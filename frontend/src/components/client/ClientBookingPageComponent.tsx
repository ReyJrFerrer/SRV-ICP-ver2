import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Principal } from '@dfinity/principal';
import serviceCanisterService, { 
  Service, 
  ServicePackage, 
  ProviderAvailability, 
  DayOfWeek,
  AvailableSlot
} from '../../services/serviceCanisterService';

// Helper functions
const dayIndexToName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex] || '';
};

// TODO later
// Map DayOfWeek enum to day index (for Date.getDay())
const dayOfWeekToIndex = (day: DayOfWeek): number => {
  const mapping: Record<DayOfWeek, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  return mapping[day];
};

interface ParsedTimeSlot {
  start: { h: number; m: number };
  end: { h: number; m: number };
}

const parseTimeSlotString = (slotStr: string): ParsedTimeSlot | null => {
  const parts = slotStr.split('-');
  if (parts.length !== 2) return null;
  const [startStr, endStr] = parts;
  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return null;
  return { start: { h: startH, m: startM }, end: { h: endH, m: endM } };
};

interface SelectablePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  checked: boolean;
}

// Extended service interface that includes packages
interface ExtendedService extends Service {
  packages?: ServicePackage[];
}

interface ClientBookingPageComponentProps {
  serviceSlug: string;
}

const ClientBookingPageComponent: React.FC<ClientBookingPageComponentProps> = ({ serviceSlug }) => {
  const router = useRouter();

  // Service data
  const [service, setService] = useState<ExtendedService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [packages, setPackages] = useState<SelectablePackage[]>([]);
  const [concerns, setConcerns] = useState<string>('');
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>('sameday');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSameDayPossible, setIsSameDayPossible] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);

  // Location state
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('');
  const [province, setProvince] = useState('');
  const [currentLocationStatus, setCurrentLocationStatus] = useState('');
  const [useGpsLocation, setUseGpsLocation] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load service data from canister
  useEffect(() => {
    const loadService = async () => {
      if (!serviceSlug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get service details
        const serviceData = await serviceCanisterService.getService(serviceSlug);
        if (!serviceData) {
          setError('Service not found');
          return;
        }

        // Get service packages
        const servicePackages = await serviceCanisterService.getServicePackages(serviceSlug);

        console.log('Service Data:', serviceData); // Debug log

        // Create extended service object
        const extendedService: ExtendedService = {
          ...serviceData,
          packages: servicePackages,
        };

        setService(extendedService);
        
        // Set packages for selection
        setPackages(servicePackages.map(pkg => ({ 
          id: pkg.id, 
          title: pkg.title, 
          description: pkg.description, 
          price: pkg.price, 
          checked: false 
        })));

      } catch (error) {
        console.error('Error loading service:', error);
        setError('Failed to load service data');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [serviceSlug]);

  // Calculate same-day availability
  useEffect(() => {
    if (!service) return;
    
    const calculateSameDay = () => {
      // Check if service has instant booking enabled
      if (!service.instantBookingEnabled) return false;
      
      // Check if weeklySchedule exists and has data
      if (!service.weeklySchedule || service.weeklySchedule.length === 0) {
        return false;
      }
      
      const today = new Date();
      const currentDayIndex = today.getDay();
      const currentDayName = dayIndexToName(currentDayIndex);
      
      // Find today's availability in weekly schedule
      const todayAvailability = service.weeklySchedule.find(
        (scheduleItem) => scheduleItem.day === currentDayName as DayOfWeek
      );
      
      if (!todayAvailability?.availability?.isAvailable) return false;

      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if current time falls within any available slot
      if (!todayAvailability.availability.slots || todayAvailability.availability.slots.length === 0) {
        return false;
      }
      
      for (const slot of todayAvailability.availability.slots) {
        if (currentTimeStr >= slot.startTime && currentTimeStr < slot.endTime) {
          return true;
        }
      }
      return false;
    };

    const sameDayPossible = calculateSameDay();
    setIsSameDayPossible(sameDayPossible);
    
    if (!sameDayPossible && bookingOption === 'sameday') {
      setBookingOption('scheduled');
    }
  }, [service, bookingOption]);

  // Load available slots when date is selected
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!service || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const slots = await serviceCanisterService.getAvailableTimeSlots(
          service.providerId.toString(),
          selectedDate
        );
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading available slots:', error);
        setAvailableSlots([]);
      }
    };

    loadAvailableSlots();
  }, [service, selectedDate]);

  // Event handlers
  const handlePackageChange = (packageId: string) => {
    setFormError(null);
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId ? { ...pkg, checked: !pkg.checked } : pkg
      )
    );
  };

  const handleBookingOptionChange = (option: 'sameday' | 'scheduled') => {
    if (option === 'sameday' && !isSameDayPossible) return;
    setFormError(null);
    setBookingOption(option);
    if (option === 'sameday') {
      setSelectedDate(null);
      setSelectedTime('');
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (!date) {
      setSelectedTime('');
    }
    if (formError?.includes('date')) {
      setFormError(null);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (formError?.includes('time')) {
      setFormError(null);
    }
  };

  const handleUseCurrentLocation = () => {
    setCurrentLocationStatus('Fetching location...');
    setUseGpsLocation(true);
    setShowManualAddress(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocationStatus(`📍 Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Using this)`);
          setHouseNumber(''); setStreet(''); setBarangay(''); setMunicipalityCity(''); setProvince('');
        },
        (error) => {
          setCurrentLocationStatus(`⚠️ Could not get location. Please enter manually. (Error: ${error.message})`);
          setUseGpsLocation(false);
          setShowManualAddress(true);
        }
      );
    } else {
      setCurrentLocationStatus("Geolocation not supported. Please enter address manually.");
      setUseGpsLocation(false);
      setShowManualAddress(true);
    }
  };

  const toggleManualAddress = () => {
    setShowManualAddress(!showManualAddress);
    if (!showManualAddress) {
      setUseGpsLocation(false);
      setCurrentLocationStatus('');
    }
  };

  const handleConfirmBooking = () => {
    setFormError(null);

    // Validate package selection
    const anyPackageSelected = packages.some(pkg => pkg.checked);
    if (!anyPackageSelected) {
      setFormError("Please select at least one service package.");
      return;
    }

    // Validate scheduling
    if (bookingOption === 'scheduled') {
      if (!selectedDate) {
        setFormError("Please select a date for your scheduled booking.");
        return;
      }
      if (!selectedTime.trim()) {
        setFormError("Please select a time for your scheduled booking.");
        return;
      }
    } else if (!isSameDayPossible) {
      setFormError("Same day booking is currently not possible.");
      return;
    }

    // Validate location
    let finalAddress = "Address not specified.";
    if (useGpsLocation) {
      finalAddress = currentLocationStatus;
    } else if (houseNumber || street || barangay || municipalityCity || province) {
      const addressParts = [houseNumber, street, barangay, municipalityCity, province].filter(Boolean);
      finalAddress = addressParts.join(', ');
    } else {
      setFormError("Please provide your location (GPS or manual address).");
      return;
    }

    // Prepare booking data
    const selectedPackageIds = packages.filter(pkg => pkg.checked).map(pkg => pkg.id);
    const totalPrice = packages.filter(pkg => pkg.checked).reduce((sum, pkg) => sum + pkg.price, 0);

    const bookingData = {
      serviceId: service!.id,
      serviceName: service!.title,
      providerId: service!.providerId.toString(),
      packages: packages.filter(pkg => pkg.checked),
      totalPrice,
      bookingType: bookingOption,
      scheduledDate: bookingOption === 'scheduled' ? selectedDate : null,
      scheduledTime: bookingOption === 'scheduled' ? selectedTime : null,
      location: finalAddress,
      concerns: concerns.trim() || 'No specific concerns mentioned.',
    };

    console.log('Booking Data:', bookingData);
    alert(`Booking request prepared!\n\nService: ${bookingData.serviceName}\nPackages: ${bookingData.packages.map(p => p.title).join(', ')}\nTotal: ₱${bookingData.totalPrice}\nType: ${bookingData.bookingType}\nLocation: ${bookingData.location}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-gray-600">Service not found</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isConfirmDisabled = 
    !packages.some(pkg => pkg.checked) ||
    (bookingOption === 'sameday' && !isSameDayPossible) ||
    (bookingOption === 'scheduled' && (!selectedDate || !selectedTime.trim()));

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex-grow pb-28 md:pb-24">
        <div className="md:flex md:flex-row md:gap-x-6 lg:gap-x-8 md:p-4 lg:p-6">
          {/* Left Column Wrapper */}
          <div className="md:w-1/2 md:flex md:flex-col">
            {/* Package Selection Section */}
            <div className="bg-white border-b border-gray-200 p-4 md:rounded-t-xl md:border md:shadow-sm md:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package *</h3>
              {packages.map((pkg) => (
                <label key={pkg.id} className="flex items-start space-x-3 mb-3 cursor-pointer p-2 hover:bg-gray-50 rounded-md">
                  <input 
                    type="checkbox" 
                    checked={pkg.checked} 
                    onChange={() => handlePackageChange(pkg.id)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{pkg.title}</div>
                    <div className="text-sm text-gray-600">{pkg.description}</div>
                    <div className="text-sm font-medium text-green-600">₱{pkg.price}</div>
                  </div>
                </label>
              ))}
            </div>
            
            {/* Concerns Section */}
            <div className="bg-white border-b border-gray-200 p-4 md:rounded-b-xl md:border-x md:border-b md:shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Concerns</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[80px] focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any concerns or requests..."
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column Wrapper */}
          <div className="md:w-1/2 md:flex md:flex-col mt-4 md:mt-0">
            {/* Booking Schedule Section */}
            <div className="bg-white border-b border-gray-200 p-4 md:rounded-t-xl md:border md:shadow-sm md:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Schedule *</h3>
              
              {service.weeklySchedule && service.weeklySchedule.length > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700 text-center">
                  Available: {service.weeklySchedule
                    .filter(s => s.availability.isAvailable)
                    .map(s => s.day)
                    .join(', ')} | 
                  {service.weeklySchedule[0]?.availability?.slots?.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ') || 'No time slots available'}
                </div>
              )}

              {(!service.weeklySchedule || service.weeklySchedule.length === 0) && (
                <div className="mb-4 p-2 bg-yellow-50 rounded text-sm text-yellow-700 text-center">
                  No availability schedule set for this provider.
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <button
                  className={`flex-1 p-3 border rounded-lg text-center ${
                    bookingOption === 'sameday' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-50 text-gray-700 border-gray-300'
                  } ${!isSameDayPossible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'}`}
                  onClick={() => handleBookingOptionChange('sameday')}
                  disabled={!isSameDayPossible}
                >
                  <div className="font-medium text-sm">Same Day</div>
                  {isSameDayPossible && <div className="text-xs opacity-75">Arrive within 20-45 mins</div>}
                </button>
                <button
                  className={`flex-1 p-3 border rounded-lg text-center ${
                    bookingOption === 'scheduled' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50'
                  }`}
                  onClick={() => handleBookingOptionChange('scheduled')}
                >
                  <div className="font-medium text-sm">Scheduled</div>
                </button>
              </div>

              {bookingOption === 'scheduled' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholderText="Click to select a date"
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                      filterDate={(date) => {
                        if (!service.weeklySchedule) return false;
                        const dayName = dayIndexToName(date.getDay());
                        return service.weeklySchedule.some(scheduleItem => 
                          scheduleItem.day === dayName as DayOfWeek && scheduleItem.availability.isAvailable
                        );
                      }}
                    />
                  </div>
                  
                  {selectedDate && availableSlots.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Time:</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                      >
                        <option value="">Choose a time</option>
                        {availableSlots
                          .filter(slot => slot.isAvailable)
                          .map((slot, index) => (
                            <option key={index} value={slot.timeSlot.startTime}>
                              {slot.timeSlot.startTime} - {slot.timeSlot.endTime}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Location Section */}
            <div className="bg-white border-b border-gray-200 p-4 md:rounded-b-xl md:border-x md:border-b md:shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Location *</h3>
              
              <button 
                onClick={handleUseCurrentLocation}
                className="w-full mb-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                📍 Use Current Location
              </button>
              
              {currentLocationStatus && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 text-center">
                  {currentLocationStatus}
                </div>
              )}
              
              {!showManualAddress && (
                <button 
                  onClick={toggleManualAddress}
                  className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Enter Address Manually
                </button>
              )}
              
              {showManualAddress && (
                <div className="space-y-3 mt-2">
                  <p className="text-xs text-gray-600">Enter address manually (all fields required*):</p>
                  <input 
                    type="text" 
                    placeholder="House No. / Unit / Building *" 
                    value={houseNumber} 
                    onChange={(e) => setHouseNumber(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Street Name *" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Barangay *" 
                    value={barangay} 
                    onChange={(e) => setBarangay(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Municipality / City *" 
                    value={municipalityCity} 
                    onChange={(e) => setMunicipalityCity(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Province *" 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0 md:mx-4 lg:mx-6 mt-4 md:mt-6">
          <div className="bg-white p-4 md:rounded-xl md:border md:shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              💸 Cash payment only.
            </div>
          </div>
          
          {formError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
              {formError}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-top-md">
        <button 
          onClick={handleConfirmBooking}
          disabled={isConfirmDisabled}
          className={`w-full py-3 md:py-4 rounded-lg font-semibold text-white transition-colors ${
            isConfirmDisabled 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ClientBookingPageComponent;
