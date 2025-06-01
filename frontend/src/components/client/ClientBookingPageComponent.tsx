import React, { useState, useEffect, ChangeEvent, FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Service } from '../../../assets/types/service/service';
import { Package as ServicePackage } from '../../../assets/types/service/service-package';
import { ServiceAvailability, DayOfWeek } from '../../../assets/types/service/service-availability';

// --- Helper Functions (dayIndexToName, parseTimeSlotString, etc.) ---
const dayIndexToName = (dayIndex: number): string => {
  const days: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex] || '';
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
// --- End Helper Functions ---


// Use the aliased ServicePackage type
interface SelectablePackage extends ServicePackage {
  checked: boolean;
}

interface ClientBookingPageComponentProps {
  serviceSlug: string;
}

const ClientBookingPageComponent: React.FC<ClientBookingPageComponentProps> = ({ serviceSlug }) => {
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [packages, setPackages] = useState<SelectablePackage[]>([]);
  // ... other state variables ...
  const [concerns, setConcerns] = useState<string>('');
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>('sameday');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSameDayPossible, setIsSameDayPossible] = useState(true);

  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('');
  const [province, setProvince] = useState('');
  const [currentLocationStatus, setCurrentLocationStatus] = useState('');
  const [useGpsLocation, setUseGpsLocation] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      try {
        const { SERVICES } = await import('../../../assets/services');
        const mockServiceData = SERVICES.find(s => s.slug === serviceSlug);

        if (mockServiceData) {
          setService(mockServiceData as Service); // Cast to Service
          setPackages(
            mockServiceData.packages?.map((pkg: ServicePackage) => ({ 
              ...pkg,
              checked: false,
            })) || []
          );
          
          if (mockServiceData.availability) {
            const today = new Date();
            const currentDayName = dayIndexToName(today.getDay());
            const isTodayServiceDay = mockServiceData.availability.schedule.some(s => s.toLowerCase() === currentDayName.toLowerCase());
            let possibleToday = mockServiceData.availability.isAvailableNow && isTodayServiceDay;
            if (possibleToday) {
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                let inSlot = false;
                for (const slotStr of mockServiceData.availability.timeSlots) {
                    const parsedSlot = parseTimeSlotString(slotStr);
                    if (parsedSlot) {
                        if ((currentHour > parsedSlot.start.h || (currentHour === parsedSlot.start.h && currentMinute >= parsedSlot.start.m)) &&
                            (currentHour < parsedSlot.end.h || (currentHour === parsedSlot.end.h && currentMinute < parsedSlot.end.m))) {
                            inSlot = true;
                            break;
                        }
                    }
                }
                possibleToday = inSlot;
            }
            setIsSameDayPossible(possibleToday);
            if (!possibleToday) setBookingOption('scheduled'); else setBookingOption('sameday');
          } else {
            setIsSameDayPossible(false);
            setBookingOption('scheduled');
          }
        } else {
            setFormError("Service not found.");
        }
      } catch (error) {
        console.error('Error loading service:', error);
        setFormError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      loadService();
    }
  }, [serviceSlug]);

  // --- (Event handlers: handlePackageChange, handleBookingOptionChange, etc. - assume they are correctly defined as before) ---
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
    if (!service) {
        setFormError("Service details not loaded yet.");
        return;
    }
    if (!packages.some(pkg => pkg.checked)) {
        setFormError("Please select at least one service package.");
        return;
    }
     if (bookingOption === 'scheduled') {
      if (!selectedDate) {
        setFormError("Please select a date for your scheduled booking.");
        return;
      }
      if (!selectedTime.trim()) {
        setFormError("Please select a time for your scheduled booking.");
        return;
      }
    }

    const bookingDetails = {
        serviceId: service.id,
        serviceSlug: service.slug,
        serviceName: service.title,
        providerName: service.name, 
        selectedPackages: packages.filter(p => p.checked).map(p => ({ id: p.id, name: p.name })),
        concerns: concerns.trim() || "No specific concerns.",
        bookingType: bookingOption,
        date: bookingOption === 'scheduled' && selectedDate 
          ? selectedDate.toISOString().split('T')[0] 
          : (bookingOption === 'sameday' ? 'Same day' : "N/A"),
        time: bookingOption === 'scheduled' && selectedTime 
          ? selectedTime 
          : (bookingOption === 'sameday' ? 'ASAP (within operating hours)' : "N/A"),
        location: useGpsLocation ? (currentLocationStatus.startsWith('📍') ? currentLocationStatus.replace('📍 ', '').replace(' (Using this)', '') : "GPS Error") : `${houseNumber}, ${street}, ${barangay}, ${municipalityCity}, ${province}`,
    };
    router.push({
      pathname: '/client/booking/confirmation',
      query: { details: JSON.stringify(bookingDetails) },
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 text-red-600">
        {formError || "Service not found or failed to load."}
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
                    <div className="font-medium text-gray-900">{pkg.name}</div>
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
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setConcerns(e.target.value)}
              />
            </div>
          </div>

          <div className="md:w-1/2 md:flex md:flex-col mt-4 md:mt-0">
            {/* Booking Schedule Section */}
            <div className="bg-white border-b border-gray-200 p-4 md:rounded-t-xl md:border md:shadow-sm md:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Schedule *</h3>
              {service.availability.timeSlots.length > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700 text-center">
                  Available: {service.availability.schedule.join(', ')} | {service.availability.timeSlots.join(' / ')}
                </div>
              )}
              <div className="flex gap-3 mb-4">
                 <button
                  className={`flex-1 p-3 border rounded-lg text-center ${ bookingOption === 'sameday' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-300'} ${!isSameDayPossible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'}`}
                  onClick={() => handleBookingOptionChange('sameday')}
                  disabled={!isSameDayPossible}
                >
                  <div className="font-medium text-sm">Same Day</div>
                  {isSameDayPossible && <div className="text-xs opacity-75">Arrive within 20-45 mins</div>}
                </button>
                <button
                  className={`flex-1 p-3 border rounded-lg text-center ${ bookingOption === 'scheduled' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
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
                        const dayName = dayIndexToName(date.getDay());
                        return service.availability.schedule.some(s => s.toLowerCase() === dayName.toLowerCase());
                      }}
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time {service.availability.timeSlots.length > 0 && `(${service.availability.timeSlots.join(' / ')})`}:
                      </label>
                      <input
                        type="time"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleTimeChange(e.target.value)}
                      />
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
                  <input type="text" placeholder="House No. / Unit / Building *" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"/>
                  <input type="text" placeholder="Street Name *" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input type="text" placeholder="Barangay *" value={barangay} onChange={(e) => setBarangay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input type="text" placeholder="Municipality / City *" value={municipalityCity} onChange={(e) => setMunicipalityCity(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                  <input type="text" placeholder="Province *" value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
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