import React, { useState, ChangeEvent, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { Service as OriginalServiceType, ServicePackage, ServiceAvailability } from '../../../../public/data/services';
import styles from 'frontend/ui/components/client/bookingPage/ClientBookingPageComponent.module.css';

// Helper to get day name (e.g., "Monday") from Date object's day index (0 for Sunday)
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


interface BookingPageComponentProps {
  service: Omit<OriginalServiceType, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    packages: OriginalServiceType['packages'];
    availability: OriginalServiceType['availability'];
  };
}

interface SelectablePackageItem extends ServicePackage {
  checked: boolean;
}

interface PackageSelectionProps {
  packages: SelectablePackageItem[];
  onPackageChange: (packageId: string) => void;
}
const PackageSelection: FC<PackageSelectionProps> = ({ packages, onPackageChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Select Package</h3>
    {packages.map((pkg) => (
      <label key={pkg.id} className={styles.checkboxLabel}>
        <input type="checkbox" checked={pkg.checked} onChange={() => onPackageChange(pkg.id)} />
        {pkg.name}
      </label>
    ))}
  </div>
);

const ConcernsInput: FC<{concerns: string; onConcernsChange: (value: string) => void;}> = ({ concerns, onConcernsChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Concerns</h3>
    <textarea
      className={styles.textarea}
      placeholder="Add any concerns or requests..."
      value={concerns}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onConcernsChange(e.target.value)}
    />
  </div>
);

interface BookingOptionsProps {
  bookingOption: 'sameday' | 'scheduled';
  onOptionChange: (option: 'sameday' | 'scheduled') => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  isSameDayPossible: boolean; 
  availability: ServiceAvailability;
}

const BookingOptionsDisplay: FC<BookingOptionsProps> = ({
  bookingOption, onOptionChange, selectedDate, onDateChange, selectedTime, onTimeChange,
  isSameDayPossible, availability
}) => {
  const [timeInputMin, setTimeInputMin] = useState<string>('');
  const [timeInputMax, setTimeInputMax] = useState<string>('');

  useEffect(() => {
    if (bookingOption === 'scheduled' && selectedDate) {
      const selectedDayName = dayIndexToName(selectedDate.getDay());
      const isServiceDay = availability.schedule.map(s => s.toLowerCase()).includes(selectedDayName.toLowerCase());

      if (isServiceDay && availability.timeSlots.length > 0) {
        const parsedSlot = parseTimeSlotString(availability.timeSlots[0]); // Using first slot for min/max
        if (parsedSlot) {
          setTimeInputMin(`${String(parsedSlot.start.h).padStart(2, '0')}:${String(parsedSlot.start.m).padStart(2, '0')}`);
          setTimeInputMax(`${String(parsedSlot.end.h).padStart(2, '0')}:${String(parsedSlot.end.m).padStart(2, '0')}`);
        } else {
          setTimeInputMin(''); setTimeInputMax('');
        }
      } else {
        setTimeInputMin(''); setTimeInputMax('');
        if (selectedTime !== '') onTimeChange(''); 
      }
    } else {
      setTimeInputMin(''); setTimeInputMax('');
    }
  }, [selectedDate, bookingOption, availability, onTimeChange]); 

  const selectedDayName = selectedDate ? dayIndexToName(selectedDate.getDay()) : '';
  const isSelectedDateServiceDay = selectedDate ? availability.schedule.map(s => s.toLowerCase()).includes(selectedDayName.toLowerCase()) : false;

  return (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Booking Schedule</h3>
      {availability.timeSlots && availability.timeSlots.length > 0 && (
          <p className={styles.availabilityInfo}>
            Available: {availability.schedule.join(', ')} 
          </p>
      )}
      <div className={styles.optionGroup}>
        <button
          className={`${styles.optionButton} ${bookingOption === 'sameday' ? styles.optionButtonSelected : ''}`}
          onClick={() => { if (isSameDayPossible) { onOptionChange('sameday'); onDateChange(null); }}}
          disabled={!isSameDayPossible}
        >
          Same day <span className={styles.optionDetail}>Arrive within 20 - 45 minutes</span>
        </button>
        <button
          className={`${styles.optionButton} ${bookingOption === 'scheduled' ? styles.optionButtonSelected : ''}`}
          onClick={() => onOptionChange('scheduled')}
        >
          Scheduled
        </button>
      </div>

      {bookingOption === 'scheduled' && (
        <div className={styles.scheduledOptions}>
          <p className={styles.inputLabel}>Select Date:</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => onDateChange(date)}
            className={styles.datePickerInput}
            placeholderText="Click to select a date"
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            filterDate={(date) => {
                const dayName = dayIndexToName(date.getDay());
                return availability.schedule.map(s => s.toLowerCase()).includes(dayName.toLowerCase());
            }}
          />
          {selectedDate && (
            <div style={{ marginTop: '15px' }}>
              {!isSelectedDateServiceDay ? (
                <p className={styles.formErrorMessageSmall}>Provider is not available on {selectedDayName}s.</p>
              ) : (
                <>
                  <p className={styles.inputLabel}>Select Time (between {timeInputMin || 'N/A'} - {timeInputMax || 'N/A'}):</p>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={selectedTime}
                    min={timeInputMin}
                    max={timeInputMax}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onTimeChange(e.target.value)}
                    disabled={!isSelectedDateServiceDay || !timeInputMin}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface LocationInfoProps {
  houseNumber: string; onHouseNumberChange: (value: string) => void;
  street: string; onStreetChange: (value: string) => void;
  barangay: string; onBarangayChange: (value: string) => void;
  municipalityCity: string; onMunicipalityCityChange: (value: string) => void;
  province: string; onProvinceChange: (value: string) => void;
  onUseCurrentLocation: () => void;
  currentLocationStatus: string;
  showManualAddressForm: boolean;
  onToggleManualAddress: () => void;
}

const LocationInfo: FC<LocationInfoProps> = ({
  houseNumber, onHouseNumberChange, street, onStreetChange, barangay, onBarangayChange,
  municipalityCity, onMunicipalityCityChange, province, onProvinceChange,
  onUseCurrentLocation, currentLocationStatus, showManualAddressForm, onToggleManualAddress
}) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Service Location</h3>
    <button onClick={onUseCurrentLocation} className={styles.actionButton} style={{marginBottom: '10px'}}>
      📍 Use Current Location
    </button>
    {currentLocationStatus && <p className={styles.locationStatus}>{currentLocationStatus}</p>}
    {!showManualAddressForm && (
      <button onClick={onToggleManualAddress} className={styles.secondaryButton} style={{marginTop: '5px'}}>
        Enter Address Manually
      </button>
    )}
    {showManualAddressForm && (
      <>
        <p className={styles.manualAddressLabel}>Enter address manually (all fields required*):</p>
        <div className={styles.addressInputGroup}>
          <input type="text" placeholder="House No. / Unit / Building *" value={houseNumber} onChange={(e) => onHouseNumberChange(e.target.value)} className={styles.addressInput}/>
          <input type="text" placeholder="Street Name *" value={street} onChange={(e) => onStreetChange(e.target.value)} className={styles.addressInput} />
          <input type="text" placeholder="Barangay *" value={barangay} onChange={(e) => onBarangayChange(e.target.value)} className={styles.addressInput} />
          <input type="text" placeholder="Municipality / City *" value={municipalityCity} onChange={(e) => onMunicipalityCityChange(e.target.value)} className={styles.addressInput} />
          <input type="text" placeholder="Province *" value={province} onChange={(e) => onProvinceChange(e.target.value)} className={styles.addressInput} />
        </div>
      </>
    )}
  </div>
);

const PaymentInfoDisplay: FC = () => (
  <div className={styles.formSection}><h3 className={styles.sectionTitle}>Payment</h3><p className={styles.paymentNote}>💸 Cash payment only.</p></div>
);


const BookingPageComponent: FC<BookingPageComponentProps> = ({ service }) => {
  const router = useRouter();

  // --- State Variables ---
  const [packages, setPackages] = useState<SelectablePackageItem[]>([]);
  const [concerns, setConcerns] = useState<string>('');

  // Helper to calculate if same-day booking is possible
  const calculateIsSameDayPossible = () => {
    if (!service || !service.availability) return false; 
    if (!service.availability.isAvailableNow) return false;
    const today = new Date();
    const currentDayName = dayIndexToName(today.getDay()); 
    const isTodayServiceDay = service.availability.schedule.map(s => s.toLowerCase()).includes(currentDayName.toLowerCase());
    if (!isTodayServiceDay) return false;

    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    for (const slotStr of service.availability.timeSlots) {
      const parsedSlot = parseTimeSlotString(slotStr); 
      if (parsedSlot) {
        if ( (currentHour > parsedSlot.start.h || (currentHour === parsedSlot.start.h && currentMinute >= parsedSlot.start.m)) &&
             (currentHour < parsedSlot.end.h || (currentHour === parsedSlot.end.h && currentMinute < parsedSlot.end.m)) ) {
          return true;
        }
      }
    }
    return false;
  };

  const initialSameDayPossible = calculateIsSameDayPossible();
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>(
    initialSameDayPossible ? 'sameday' : 'scheduled'
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSameDayCurrentlyPossible, setIsSameDayCurrentlyPossible] = useState(initialSameDayPossible);

  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('');
  const [province, setProvince] = useState('');
  const [currentLocationStatus, setCurrentLocationStatus] = useState('');
  const [useGpsLocation, setUseGpsLocation] = useState(false);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Effect 1: Initialize packages ONLY when the service prop changes.
  useEffect(() => {
    if (service && service.packages) {
      // Initialize packages with 'checked: false' or any default you prefer.
      // This ensures that package selections are not reset by other state changes.
      setPackages(service.packages.map(pkg => ({ ...pkg, checked: false })));
    }
  }, [service]); // Only depends on 'service'

  // Effect 2: Handle logic related to same-day availability and bookingOption default.
  useEffect(() => {
    const sameDayPossible = calculateIsSameDayPossible();
    setIsSameDayCurrentlyPossible(sameDayPossible);
    if (!sameDayPossible && bookingOption === 'sameday') {
      setBookingOption('scheduled'); // Switch to scheduled if same-day becomes impossible
    }
    // Note: Avoid putting 'bookingOption' in this dependency array if this effect can change 'bookingOption',
    // unless you have a clear condition to prevent infinite loops.
    // Recalculating on 'service' change (which includes availability) is generally sufficient.
  }, [service, bookingOption]); // Re-check if service or bookingOption changes for safety

  // Effect 3: Clear time if date is cleared, and clear date-related errors.
  useEffect(() => {
    if (!selectedDate) {
      setSelectedTime('');
    }
    if (selectedDate && (formError === "Please select a date for your scheduled booking." || formError === "Provider is not available on this day. Please choose a different date.")) {
        setFormError(null);
    }
  }, [selectedDate, formError]);

  // Effect 4: Clear time-related error when time is selected.
  useEffect(() => {
    if (selectedTime.trim() !== "" && formError === "Please select a time for your scheduled booking.") {
        setFormError(null);
    }
  }, [selectedTime, formError]);

   const handlePackageChange = (packageId: string) => {
    setFormError(null);
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId ? { ...pkg, checked: !pkg.checked } : pkg
      )
    );
  };

  const handleBookingOptionChange = (option: 'sameday' | 'scheduled') => {
    if (option === 'sameday' && !isSameDayCurrentlyPossible) return;
    setFormError(null);
    setBookingOption(option);
    if (option === 'sameday') {
        setSelectedDate(null);
        setSelectedTime('');
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (formError && (formError.includes("date") || formError.includes("time"))) {
        setFormError(null);
    }
    setSelectedDate(date);
    if (!date) {
        setSelectedTime('');
    } else {
        if (formError === "Please select a time for your scheduled booking.") {
            setFormError(null);
        }
    }
  };

  const handleTimeChange = (time: string) => {
    if (formError === "Please select a time for your scheduled booking." && time.trim() !== "") {
        setFormError(null);
    }
    setSelectedTime(time);
  };

  const toggleManualAddressForm = () => {
    console.log("toggleManualAddressForm called. Current showManualAddress:", showManualAddress); // DEBUG
    setShowManualAddress(prevShowManualAddress => {
        const nextShowState = !prevShowManualAddress;
        console.log("Setting showManualAddress to:", nextShowState); // DEBUG
        if (nextShowState) { 
            setUseGpsLocation(false);
            setCurrentLocationStatus('');
            console.log("Cleared GPS status for manual entry."); // DEBUG
        }
        return nextShowState;
    });
  };

  const handleUseCurrentLocation = () => {
    console.log("handleUseCurrentLocation called"); // DEBUG
    setCurrentLocationStatus('Fetching location...');
    setUseGpsLocation(true);
    setShowManualAddress(false);

    if (navigator.geolocation) {
      console.log("Geolocation API is available."); // DEBUG
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Geolocation success:", latitude, longitude); // DEBUG
          setCurrentLocationStatus(`📍 Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Using this)`);
          setHouseNumber(''); setStreet(''); setBarangay(''); setMunicipalityCity(''); setProvince('');
        },
        (error) => {
          console.error("Geolocation error:", error); // DEBUG
          setCurrentLocationStatus(`⚠️ Could not get location. Please enter manually or try again. (Error: ${error.message})`);
          setUseGpsLocation(false);
          setShowManualAddress(true);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser."); // DEBUG
      setCurrentLocationStatus("Geolocation is not supported. Please enter address manually.");
      setUseGpsLocation(false);
      setShowManualAddress(true);
    }
  };

   const handleConfirmBooking = () => {
    setFormError(null); 

    // 1. Validate Package Selection
    const anyPackageSelected = packages.some(pkg => pkg.checked);
    if (!anyPackageSelected) {
      setFormError("Please select at least one service package.");
      return;
    }

    // 2. Validate Scheduled Date and Time (if applicable)
    if (bookingOption === 'scheduled') {
      if (!selectedDate) {
        setFormError("Please select a date for your scheduled booking.");
        return;
      }
      const selectedDayNameVal = dayIndexToName(selectedDate.getDay()); // Make sure dayIndexToName is defined
      const isDateAValidServiceDay = service.availability.schedule.map(s => s.toLowerCase()).includes(selectedDayNameVal.toLowerCase());
      if (!isDateAValidServiceDay) {
        setFormError(`Provider is not available on ${selectedDayNameVal}s. Please choose a different date.`);
        return;
      }
      if (!selectedTime.trim()) {
        setFormError("Please select a time for your scheduled booking.");
        return;
      }
      const slotForSelectedDay = service.availability.timeSlots.length > 0 ? parseTimeSlotString(service.availability.timeSlots[0]) : null; // Make sure parseTimeSlotString is defined
      if (slotForSelectedDay) {
        const [selectedH, selectedM] = selectedTime.split(':').map(Number);
        if (
          selectedH < slotForSelectedDay.start.h ||
          (selectedH === slotForSelectedDay.start.h && selectedM < slotForSelectedDay.start.m) ||
          selectedH > slotForSelectedDay.end.h ||
          (selectedH === slotForSelectedDay.end.h && selectedM > slotForSelectedDay.end.m)
        ) {
          setFormError(`Selected time is outside provider's availability (${service.availability.timeSlots[0]}).`);
          return;
        }
      }
    } else { // 'sameday' booking
      if (!isSameDayCurrentlyPossible) { 
        setFormError("Same day booking is currently not possible. Please schedule for a future date/time.");
        return;
      }
    }

    // 3. Determine and Validate Location
    let finalAddress = "Address not specified.";
    let manualAddressIsValidAndUsed = false;

    if (showManualAddress && (!useGpsLocation || (useGpsLocation && !currentLocationStatus.startsWith('📍')))) {
      const manualAddressParts = [
        { label: "House No. / Unit / Building", value: houseNumber },
        { label: "Street Name", value: street },
        { label: "Barangay", value: barangay },
        { label: "Municipality / City", value: municipalityCity },
        { label: "Province", value: province }
      ];
      const missingFields = manualAddressParts
        .filter(part => part.value.trim() === '')
        .map(part => part.label);

      if (missingFields.length > 0) {
        setFormError(`Please fill in all required manual address fields: ${missingFields.join(', ')}.`);
        return; 
      }
      finalAddress = manualAddressParts.map(part => part.value.trim()).join(', ');
      manualAddressIsValidAndUsed = true;
    }

    if (!manualAddressIsValidAndUsed && useGpsLocation && currentLocationStatus.startsWith('📍')) {
      finalAddress = `Current Location (GPS): ${currentLocationStatus.replace('📍 ', '').replace(' (Using this)', '')}`;
    } else if (!manualAddressIsValidAndUsed && useGpsLocation && !currentLocationStatus.startsWith('📍')) {
      setFormError("GPS location failed. Please enter your address manually and ensure all fields are filled.");
      return;
    } else if (!manualAddressIsValidAndUsed && !useGpsLocation && finalAddress === "Address not specified.") {
      setFormError("Please provide a service location using GPS or by entering your address manually.");
      return;
    }

    const bookingDetails = {
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.title,
      providerName: service.name,
      selectedPackages: packages.filter(p => p.checked).map(p => ({id: p.id, name: p.name})),
      concerns: concerns.trim() || "No specific concerns.",
      bookingType: bookingOption,
      date: bookingOption === 'scheduled' && selectedDate ? selectedDate.toISOString().split('T')[0] : (bookingOption === 'sameday' ? 'Same day' : "N/A"),
      time: bookingOption === 'scheduled' && selectedTime ? selectedTime : (bookingOption === 'sameday' ? 'ASAP (within operating hours)' : "N/A"),
      location: finalAddress,
    };
    
    console.log('Booking Details to send:', bookingDetails);

    router.push({
      pathname: '/client/booking/confirmation',
      query: { details: JSON.stringify(bookingDetails) },
    });
  };

  if (!service) {
    return <div>Loading service details...</div>;
  }

   let isScheduleFieldsIncomplete = false;
  if (bookingOption === 'scheduled') {
    const isDateAValidServiceDay = selectedDate ? service.availability.schedule.map(s => s.toLowerCase()).includes(dayIndexToName(selectedDate.getDay()).toLowerCase()) : false;
    isScheduleFieldsIncomplete = !selectedDate || !selectedTime.trim() || !isDateAValidServiceDay;
  }
  const isConfirmDisabled =
    !packages.some(pkg => pkg.checked) ||
    (bookingOption === 'sameday' && !isSameDayCurrentlyPossible) ||
    (bookingOption === 'scheduled' && isScheduleFieldsIncomplete);
    
  return (
    <div className={styles.bookingFormContainer}>
      <PackageSelection packages={packages} onPackageChange={handlePackageChange} />
      <ConcernsInput concerns={concerns} onConcernsChange={setConcerns} />
      <BookingOptionsDisplay
        bookingOption={bookingOption}
        onOptionChange={handleBookingOptionChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
        isSameDayPossible={isSameDayCurrentlyPossible}
        availability={service.availability}
      />
      <LocationInfo
        houseNumber={houseNumber} onHouseNumberChange={setHouseNumber}
        street={street} onStreetChange={setStreet}
        barangay={barangay} onBarangayChange={setBarangay}
        municipalityCity={municipalityCity} onMunicipalityCityChange={setMunicipalityCity}
        province={province} onProvinceChange={setProvince}
        onUseCurrentLocation={handleUseCurrentLocation}
        currentLocationStatus={currentLocationStatus}
        showManualAddressForm={showManualAddress}
        onToggleManualAddress={toggleManualAddressForm}
      />
      {formError && <p className={styles.formErrorMessage}>{formError}</p>}
      <PaymentInfoDisplay />
      <div className={styles.confirmButtonContainer}>
        <button onClick={handleConfirmBooking} className={styles.confirmButton} disabled={isConfirmDisabled}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPageComponent;