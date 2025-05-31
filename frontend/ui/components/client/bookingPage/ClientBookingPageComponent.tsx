import React, { useState, ChangeEvent, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Service as OriginalServiceType, ServicePackage } from 'frontend/public/data/services';
import styles from 'frontend/ui/components/client/bookingPage/ClientBookingPageComponent.module.css'; 
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 

interface BookingPageComponentProps {
  service: Omit<OriginalServiceType, 'createdAt' | 'updatedAt' | 'availability'> & {
    createdAt: string;
    updatedAt: string;
    packages: OriginalServiceType['packages'];
    availability: {
      isAvailableNow: boolean;
      schedule: string[];
      timeSlots: string[];
    };
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
        <input
          type="checkbox"
          checked={pkg.checked}
          onChange={() => onPackageChange(pkg.id)}
        />
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
  isSameDayAvailable: boolean;
}

const BookingOptionsDisplay: FC<BookingOptionsProps> = ({
  bookingOption, onOptionChange, selectedDate, onDateChange, selectedTime, onTimeChange,
  isSameDayAvailable
}) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Booking Schedule</h3>
    <div className={styles.optionGroup}>
      <button className={`${styles.optionButton} ${bookingOption === 'sameday' ? styles.optionButtonSelected : ''}`} onClick={() => { if (isSameDayAvailable) { onOptionChange('sameday'); onDateChange(null); }}} disabled={!isSameDayAvailable}>Same day <span className={styles.optionDetail}>25 - 40 mins</span></button>
      <button className={`${styles.optionButton} ${bookingOption === 'scheduled' ? styles.optionButtonSelected : ''}`} onClick={() => onOptionChange('scheduled')}>Scheduled</button>
    </div>
    {bookingOption === 'scheduled' && (
      <div className={styles.scheduledOptions}>
        <p className={styles.inputLabel}>Select Date:</p>
        <DatePicker selected={selectedDate} onChange={(date: Date | null) => onDateChange(date)} className={styles.datePickerInput} placeholderText="Click to select a date" dateFormat="MMMM d, yyyy" minDate={new Date()} />
        {selectedDate && (<div style={{ marginTop: '15px' }}><p className={styles.inputLabel}>Select Time:</p><input type="time" className={styles.timeInput} value={selectedTime} onChange={(e: ChangeEvent<HTMLInputElement>) => onTimeChange(e.target.value)} /></div>)}
      </div>
    )}
  </div>
);
interface LocationInfoProps {
  houseNumber: string; onHouseNumberChange: (value: string) => void;
  street: string; onStreetChange: (value: string) => void;
  barangay: string; onBarangayChange: (value: string) => void;
  municipalityCity: string; onMunicipalityCityChange: (value: string) => void;
  province: string; onProvinceChange: (value: string) => void;
  onUseCurrentLocation: () => void; // onClick for "Use Current Location"
  currentLocationStatus: string;
  showManualAddressForm: boolean;
  onToggleManualAddress: () => void; // onClick for "Enter Address Manually"
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

  const [packages, setPackages] = useState<SelectablePackageItem[]>([]);
  const [concerns, setConcerns] = useState<string>('');
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>(
    service.availability.isAvailableNow ? 'sameday' : 'scheduled'
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

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
    if (service && service.packages) {
      setPackages(service.packages.map(pkg => ({ ...pkg, checked: false })));
    }
    if (service && !service.availability.isAvailableNow) {
      setBookingOption('scheduled');
    }
  }, [service]);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedTime(''); //
      if (bookingOption === 'scheduled') { 
      }
    } else {
        if (formError === "Please select a date for your scheduled booking.") {
            setFormError(null); 
        }
    }
  }, [selectedDate, bookingOption]); 

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
    setFormError(null); 
    setBookingOption(option);
    if (option === 'sameday') {
        setSelectedDate(null); 
        setSelectedTime('');
    }
  };

   const handleDateChange = (date: Date | null) => {
    setFormError(null); 
    setSelectedDate(date);
    if (!date) { 
        setSelectedTime('');
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

  const anyPackageSelected = packages.some(pkg => pkg.checked);
  if (!anyPackageSelected) {
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

  let finalAddress = "Address not specified."; 
  let manualAddressIsValid = false;
  let triedGpsAndFailed = useGpsLocation && !currentLocationStatus.startsWith('📍');

  if (showManualAddress && (!useGpsLocation || triedGpsAndFailed)) {
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
    manualAddressIsValid = true;
  }

  if (!manualAddressIsValid && useGpsLocation && currentLocationStatus.startsWith('📍')) {
    finalAddress = `Current Location (GPS): ${currentLocationStatus.replace('📍 ', '').replace(' (Using this)', '')}`;
  } else if (!manualAddressIsValid && triedGpsAndFailed) {
    finalAddress = `GPS location failed. Please complete the manual address or try GPS again.`;
  }

  if (finalAddress === "Address not specified." && !(useGpsLocation && currentLocationStatus.startsWith('📍'))) {
    setFormError("Please provide a service location using GPS or by entering all manual address fields.");
    return;
  }

  const bookingDetails = {
    serviceId: service.id,
    serviceSlug: service.slug,
    serviceName: service.title,
    providerName: service.name, 
    selectedPackages: packages.filter(p => p.checked).map(p => ({ id: p.id, name: p.name })),
    concerns: concerns.trim() || "No specific concerns.",
    bookingType: bookingOption,
    date: bookingOption === 'scheduled' && selectedDate ? selectedDate.toISOString().split('T')[0] : (bookingOption === 'sameday' ? 'Same day' : "N/A"),
    time: bookingOption === 'scheduled' && selectedTime ? selectedTime : (bookingOption === 'sameday' ? 'ASAP (est. 25-40 mins)' : "N/A"),
    location: finalAddress,
  };

  console.log('Booking Details to send:', bookingDetails);

  // Navigate to confirmation page
  router.push({
    pathname: '/client/booking/confirmation',
    query: { details: JSON.stringify(bookingDetails) },
  });
};

  if (!service) {
    return <div>Loading service details...</div>;
  }

  const isConfirmDisabled = !packages.some(pkg => pkg.checked);

  return (
    <div className={styles.bookingFormContainer}>
      <PackageSelection packages={packages} onPackageChange={handlePackageChange} />
      <ConcernsInput concerns={concerns} onConcernsChange={setConcerns} />
        <BookingOptionsDisplay
        bookingOption={bookingOption}
        onOptionChange={handleBookingOptionChange} // Use updated handler
        selectedDate={selectedDate}
        onDateChange={handleDateChange}         // Use updated handler
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}           // Use updated handler
        isSameDayAvailable={service.availability.isAvailableNow}
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
        <button 
          onClick={handleConfirmBooking} 
          className={styles.confirmButton}
          disabled={isConfirmDisabled} 
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPageComponent;