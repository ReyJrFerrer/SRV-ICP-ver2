import React, { useState, ChangeEvent, FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Service as OriginalServiceType, ServicePackage } from 'frontend/public/data/services'; // Corrected path assuming standard structure
import styles from 'frontend/ui/components/client/bookingPage/ClientBookingPageComponent.module.css'; // Corrected path assuming standard structure

interface BookingPageComponentProps {
  service: Omit<OriginalServiceType, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    packages: OriginalServiceType['packages'];
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

const SimpleCalendar: FC<{selectedDate: Date | null, onDateSelect: (date: Date) => void}> = ({selectedDate, onDateSelect}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isSelected = (date: Date) => selectedDate && date.toDateString() === selectedDate.toDateString();
  return (
    <div className={styles.calendarPlaceholder}>
      <p>Select a date:</p>
      <button onClick={() => onDateSelect(today)} className={isSelected(today) ? `${styles.dateButton} ${styles.dateButtonSelected}` : styles.dateButton}>Today ({today.toLocaleDateString()})</button>
      <button onClick={() => onDateSelect(tomorrow)} className={isSelected(tomorrow) ? `${styles.dateButton} ${styles.dateButtonSelected}` : styles.dateButton}>Tomorrow ({tomorrow.toLocaleDateString()})</button>
      {selectedDate && <p>Selected: {selectedDate.toLocaleDateString()}</p>}
    </div>
  );
};

interface BookingOptionsProps {
  bookingOption: 'sameday' | 'scheduled';
  onOptionChange: (option: 'sameday' | 'scheduled') => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
}
const BookingOptionsDisplay: FC<BookingOptionsProps> = ({
  bookingOption, onOptionChange, selectedDate, onDateChange, selectedTime, onTimeChange
}) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Booking Schedule</h3>
    <div className={styles.optionGroup}>
      <button className={`${styles.optionButton} ${bookingOption === 'sameday' ? styles.optionButtonSelected : ''}`} onClick={() => { onOptionChange('sameday'); onDateChange(null); }}>Same day <span className={styles.optionDetail}>25 - 40 mins</span></button>
      <button className={`${styles.optionButton} ${bookingOption === 'scheduled' ? styles.optionButtonSelected : ''}`} onClick={() => onOptionChange('scheduled')}>Scheduled</button>
    </div>
    {bookingOption === 'scheduled' && (
      <div className={styles.scheduledOptions}>
        <SimpleCalendar selectedDate={selectedDate} onDateSelect={onDateChange} />
        {selectedDate && (<><input type="time" className={styles.timeInput} value={selectedTime} onChange={(e: ChangeEvent<HTMLInputElement>) => onTimeChange(e.target.value)} /> </>)}
      </div>
    )}
  </div>
);

interface LocationInfoProps {
  houseNumber: string;
  onHouseNumberChange: (value: string) => void;
  street: string;
  onStreetChange: (value: string) => void;
  barangay: string;
  onBarangayChange: (value: string) => void;
  municipalityCity: string;
  onMunicipalityCityChange: (value: string) => void;
  province: string;
  onProvinceChange: (value: string) => void;
  onUseCurrentLocation: () => void;
  currentLocationStatus: string;
  showManualAddressForm: boolean;
  onToggleManualAddress: () => void;
}

const LocationInfo: FC<LocationInfoProps> = ({
  houseNumber, onHouseNumberChange,
  street, onStreetChange,
  barangay, onBarangayChange,
  municipalityCity, onMunicipalityCityChange,
  province, onProvinceChange,
  onUseCurrentLocation,
  currentLocationStatus,
  showManualAddressForm,
  onToggleManualAddress
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
          <input
            type="text"
            placeholder="House No. / Unit / Building *" // Added asterisk
            value={houseNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onHouseNumberChange(e.target.value)}
            className={styles.addressInput}
          />
          {/* Add asterisks to other placeholders similarly */}
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
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>('sameday');
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
  }, [service]);

  const handlePackageChange = (packageId: string) => {
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId ? { ...pkg, checked: !pkg.checked } : pkg
      )
    );
  };

  const toggleManualAddressForm = () => {
    setShowManualAddress(prev => !prev);
    if (!showManualAddress) { 
        setUseGpsLocation(false);
        setCurrentLocationStatus(''); 
    }
  };

  const handleUseCurrentLocation = () => {
    setCurrentLocationStatus('Fetching location...');
    setUseGpsLocation(true);
    setShowManualAddress(false); // Hide manual form when attempting GPS

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocationStatus(`📍 Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Using this)`);
          setHouseNumber(''); setStreet(''); setBarangay(''); setMunicipalityCity(''); setProvince('');
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocationStatus(`⚠️ Could not get location. Please enter manually or try again.`);
          setUseGpsLocation(false);
          setShowManualAddress(true);
        }
      );
    } else {
      setCurrentLocationStatus("Geolocation is not supported. Please enter address manually.");
      setUseGpsLocation(false);
      setShowManualAddress(true);
    }
  };

  const handleConfirmBooking = () => {
    setFormError(null); // Clear previous errors

    let finalAddress = "Address not specified.";
    let manualAddressProvided = false;
    let attemptManualAddress = showManualAddress && !useGpsLocation; // True if manual form is shown AND we are not relying on a (potentially successful) GPS attempt.
                                                                    // Or, if useGpsLocation was true but failed, showManualAddress might become true.

    if (attemptManualAddress || (showManualAddress && useGpsLocation && !currentLocationStatus.startsWith('📍'))) {
        // This condition means:
        // 1. User explicitly chose manual OR
        // 2. User tried GPS, it failed, and the manual form is now the fallback.
        const manualAddressParts = [
            {label: "House No. / Unit / Building", value: houseNumber},
            {label: "Street Name", value: street},
            {label: "Barangay", value: barangay},
            {label: "Municipality / City", value: municipalityCity},
            {label: "Province", value: province}
        ];

        const missingFields = manualAddressParts
            .filter(part => part.value.trim() === '')
            .map(part => part.label);

        if (missingFields.length > 0) {
            setFormError(`Please fill in all required address fields: ${missingFields.join(', ')}.`);
            return; // Stop processing
        }
        finalAddress = manualAddressParts.map(part => part.value.trim()).join(', ');
        manualAddressProvided = true;
    }


    if (!manualAddressProvided && useGpsLocation && currentLocationStatus.startsWith('📍')) {
      // Using GPS location
      finalAddress = `Current Location (GPS): ${currentLocationStatus.replace('📍 ','').replace(' (Using this)','')}`;
    } else if (!manualAddressProvided && !attemptManualAddress && useGpsLocation) {
      // Tried GPS, it failed, and didn't fall back to validated manual input (e.g. user didn't fill it)
      finalAddress = `GPS location failed. Address not manually entered.`;
    }
    // If neither GPS was successful nor manual address was provided and validated,
    // `finalAddress` will retain its default "Address not specified." or the GPS error.
    // You might want an explicit check here if an address is absolutely mandatory.
    if (finalAddress === "Address not specified." && !currentLocationStatus.startsWith('📍')) {
        setFormError("Please provide a service location using GPS or by entering it manually.");
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
      time: bookingOption === 'scheduled' && selectedTime ? selectedTime : (bookingOption === 'sameday' ? 'ASAP (est. 25-40 mins)' : "N/A"),
      location: finalAddress, // Include the determined location
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

  return (
    <div className={styles.bookingFormContainer}>
      <PackageSelection packages={packages} onPackageChange={handlePackageChange} />
      <ConcernsInput concerns={concerns} onConcernsChange={setConcerns} />
      <BookingOptionsDisplay
        bookingOption={bookingOption}
        onOptionChange={setBookingOption}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedTime={selectedTime}
        onTimeChange={setSelectedTime}
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
        <button onClick={handleConfirmBooking} className={styles.confirmButton}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPageComponent;