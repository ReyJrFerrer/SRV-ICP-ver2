import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Service } from '../../../assets/types/service/service';

// Helper functions
const dayIndexToName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

interface SelectablePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  checked: boolean;
}

interface ClientBookingPageComponentProps {
  serviceSlug: string;
}

const ClientBookingPageComponent: React.FC<ClientBookingPageComponentProps> = ({ serviceSlug }) => {
  const router = useRouter();

  // Service data (placeholder - replace with actual service fetching)
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [packages, setPackages] = useState<SelectablePackage[]>([]);
  const [concerns, setConcerns] = useState<string>('');
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>('sameday');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSameDayPossible, setIsSameDayPossible] = useState(true);

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

  // Load service data (placeholder)
  useEffect(() => {
    const loadService = async () => {
      setLoading(true);
      try {
        // This would be replaced with actual service fetching
        const mockService: Service = {
          id: serviceSlug,
          slug: serviceSlug,
          name: "Sample Service",
          title: "Professional Sample Service",
          description: "This is a sample service description",
          heroImage: "/placeholder-service.jpg",
          category: {
            id: "1",
            name: "Sample Category",
            description: "Sample category description",
            icon: "🔧",
            slug: "sample-category",
            imageUrl: "/placeholder-category.jpg",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          price: {
            amount: 500,
            currency: "PHP",
            unit: "per service",
            isNegotiable: true
          },
          packages: [
            {
              id: "1",
              name: "Basic Package",
              description: "Basic service package",
              price: 500,
              currency: "PHP",
              features: ["Basic consultation", "Standard service"],
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: "2",
              name: "Premium Package",
              description: "Premium service package",
              price: 800,
              currency: "PHP",
              features: ["Premium consultation", "Extended service", "Priority support"],
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          location: {
            address: "Quezon City, Metro Manila",
            coordinates: { latitude: 14.6760, longitude: 121.0437 },
            serviceRadius: 10,
            serviceRadiusUnit: "km"
          },
          availability: {
            schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            timeSlots: ["09:00-17:00"],
            isAvailableNow: true
          },
          rating: {
            average: 4.5,
            count: 10
          },
          media: [],
          requirements: ["Valid ID", "Downpayment"],
          isVerified: true,
          providerId: "mock-provider",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setService(mockService);
        setPackages(mockService.packages?.map(pkg => ({ ...pkg, checked: false })) || []);
      } catch (error) {
        console.error('Error loading service:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      loadService();
    }
  }, [serviceSlug]);

  // Calculate same-day availability
  useEffect(() => {
    if (!service) return;
    
    const calculateSameDay = () => {
      if (!service.availability.isAvailableNow) return false;
      
      const today = new Date();
      const currentDayName = dayIndexToName(today.getDay());
      const isTodayServiceDay = service.availability.schedule
        .map(s => s.toLowerCase())
        .includes(currentDayName.toLowerCase());
      
      if (!isTodayServiceDay) return false;

      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      
      for (const slotStr of service.availability.timeSlots) {
        const parsedSlot = parseTimeSlotString(slotStr);
        if (parsedSlot) {
          if ((currentHour > parsedSlot.start.h || 
               (currentHour === parsedSlot.start.h && currentMinute >= parsedSlot.start.m)) &&
              (currentHour < parsedSlot.end.h || 
               (currentHour === parsedSlot.end.h && currentMinute < parsedSlot.end.m))) {
            return true;
          }
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
    let addressValid = false;

    if (showManualAddress && !useGpsLocation) {
      const addressParts = [houseNumber, street, barangay, municipalityCity, province];
      const missingFields = addressParts.filter(part => !part.trim());
      
      if (missingFields.length > 0) {
        setFormError("Please fill in all address fields.");
        return;
      }
      
      finalAddress = addressParts.join(', ');
      addressValid = true;
    } else if (useGpsLocation && currentLocationStatus.startsWith('📍')) {
      finalAddress = currentLocationStatus.replace('📍 ', '').replace(' (Using this)', '');
      addressValid = true;
    }

    if (!addressValid) {
      setFormError("Please provide a service location using GPS or manual address entry.");
      return;
    }

    // Prepare booking details
    const bookingDetails = {
      serviceId: service?.id,
      serviceSlug: service?.slug,
      serviceName: service?.title,
      providerName: "Service Provider", // Placeholder since Service type only has providerId
      selectedPackages: packages.filter(p => p.checked).map(p => ({ id: p.id, name: p.name })),
      concerns: concerns.trim() || "No specific concerns.",
      bookingType: bookingOption,
      date: bookingOption === 'scheduled' && selectedDate 
        ? selectedDate.toISOString().split('T')[0] 
        : (bookingOption === 'sameday' ? 'Same day' : "N/A"),
      time: bookingOption === 'scheduled' && selectedTime 
        ? selectedTime 
        : (bookingOption === 'sameday' ? 'ASAP (within operating hours)' : "N/A"),
      location: finalAddress,
    };

    // Navigate to confirmation page
    router.push({
      pathname: '/client/booking/confirmation',
      query: { details: JSON.stringify(bookingDetails) },
    });
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
    <div className="bg-white min-h-screen">
      {/* Package Selection */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package *</h3>
        {packages.map((pkg) => (
          <label key={pkg.id} className="flex items-start space-x-3 mb-3 cursor-pointer">
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

      {/* Concerns */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Concerns</h3>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-vertical min-h-20"
          placeholder="Add any concerns or requests..."
          value={concerns}
          onChange={(e) => setConcerns(e.target.value)}
        />
      </div>

      {/* Booking Schedule */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Schedule *</h3>
        
        {service.availability.timeSlots.length > 0 && (
          <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700 text-center">
            Available: {service.availability.schedule.join(', ')} | {service.availability.timeSlots.join(', ')}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button
            className={`flex-1 p-3 border rounded-lg text-center ${
              bookingOption === 'sameday' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-50 text-gray-700 border-gray-300'
            } ${!isSameDayPossible ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleBookingOptionChange('sameday')}
            disabled={!isSameDayPossible}
          >
            <div className="font-medium">Same Day</div>
            <div className="text-xs opacity-75">Arrive within 20-45 minutes</div>
          </button>
          <button
            className={`flex-1 p-3 border rounded-lg text-center ${
              bookingOption === 'scheduled' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
            onClick={() => handleBookingOptionChange('scheduled')}
          >
            <div className="font-medium">Scheduled</div>
          </button>
        </div>

        {bookingOption === 'scheduled' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholderText="Click to select a date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                filterDate={(date) => {
                  const dayName = dayIndexToName(date.getDay());
                  return service.availability.schedule
                    .map(s => s.toLowerCase())
                    .includes(dayName.toLowerCase());
                }}
              />
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time {service.availability.timeSlots.length > 0 && 
                    `(${service.availability.timeSlots[0]})`}:
                </label>
                <input
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Location *</h3>
        
        <button 
          onClick={handleUseCurrentLocation}
          className="w-full mb-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          📍 Use Current Location
        </button>
        
        {currentLocationStatus && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 text-center">
            {currentLocationStatus}
          </div>
        )}
        
        {!showManualAddress && (
          <button 
            onClick={toggleManualAddress}
            className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Enter Address Manually
          </button>
        )}
        
        {showManualAddress && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Enter address manually (all fields required*):</p>
            <input 
              type="text" 
              placeholder="House No. / Unit / Building *" 
              value={houseNumber} 
              onChange={(e) => setHouseNumber(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input 
              type="text" 
              placeholder="Street Name *" 
              value={street} 
              onChange={(e) => setStreet(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input 
              type="text" 
              placeholder="Barangay *" 
              value={barangay} 
              onChange={(e) => setBarangay(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input 
              type="text" 
              placeholder="Municipality / City *" 
              value={municipalityCity} 
              onChange={(e) => setMunicipalityCity(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input 
              type="text" 
              placeholder="Province *" 
              value={province} 
              onChange={(e) => setProvince(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          💸 Cash payment only.
        </div>
      </div>

      {/* Error Message */}
      {formError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
          {formError}
        </div>
      )}

      {/* Confirm Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <button 
          onClick={handleConfirmBooking}
          disabled={isConfirmDisabled}
          className={`w-full py-4 rounded-lg font-semibold text-white ${
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
