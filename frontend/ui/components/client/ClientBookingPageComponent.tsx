import React, { useState, ChangeEvent, FC, useEffect } from 'react'; 
import { useRouter } from 'next/router';
import { Service as OriginalServiceType, ServicePackage } from 'frontend/public/data/services'; // Adjust path
import styles from 'frontend/ui/components/client/ClientBookingPageComponent.module.css';

interface BookingPageComponentProps {
  service: Omit<OriginalServiceType, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };
}

interface SelectablePackageItem extends ServicePackage {
  checked: boolean;
}

interface PackageSelectionProps {
  packages: SelectablePackageItem[]; 
  onPackageChange: (packageId: string) => void;
}

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
    <button className={styles.linkButton}>+ Add Custom Task</button>
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

const LocationInfo: FC<LocationInfoProps> = ({
houseNumber, onHouseNumberChange,
  street, onStreetChange,
  barangay, onBarangayChange,
  municipalityCity, onMunicipalityCityChange,
  province, onProvinceChange,
  onUseCurrentLocation,
  currentLocationStatus,
  showManualAddressForm, // Use this prop
  onToggleManualAddress  // Use this prop
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
        <p className={styles.manualAddressLabel}>Enter address manually:</p>
        <div className={styles.addressInputGroup}>
          <input
            type="text"
            placeholder="House No. / Unit / Building"
            value={houseNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onHouseNumberChange(e.target.value)}
            className={styles.addressInput}
          />
          <input
            type="text"
            placeholder="Street Name"
            value={street}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onStreetChange(e.target.value)}
            className={styles.addressInput}
          />
          <input
            type="text"
            placeholder="Barangay"
            value={barangay}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onBarangayChange(e.target.value)}
            className={styles.addressInput}
          />
          <input
            type="text"
            placeholder="Municipality / City"
            value={municipalityCity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onMunicipalityCityChange(e.target.value)}
            className={styles.addressInput}
          />
          <input
            type="text"
            placeholder="Province"
            value={province}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onProvinceChange(e.target.value)}
            className={styles.addressInput}
          />
        </div>
      </>
    )}
  </div>
);


const PaymentInfoDisplay: FC = () => (
  <div className={styles.formSection}><h3 className={styles.sectionTitle}>Payment</h3><p className={styles.paymentNote}>💸 Cash payment only.</p></div>
);


const BookingPageComponent: FC<BookingPageComponentProps> = ({ service }) => {
  const [packages, setPackages] = useState<SelectablePackageItem[]>([]);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (service && service.packages) {
      setPackages(service.packages.map(pkg => ({ ...pkg, checked: false }))); 
    }
  }, [service]); 

  const [concerns, setConcerns] = useState<string>('');
  
  const [bookingOption, setBookingOption] = useState<'sameday' | 'scheduled'>('sameday');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const handlePackageChange = (packageId: string) => {
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId ? { ...pkg, checked: !pkg.checked } : pkg
      )
    );
  };

    const toggleManualAddressForm = () => {
    setShowManualAddress(prev => !prev);
    setUseGpsLocation(false); // If user opens manual form, assume they don't want to use last GPS attempt
    setCurrentLocationStatus(''); // Clear GPS status
  };

  const handleConfirmBooking = () => {
    const bookingDetails = {
      providerName: service.name,
      serviceId: service.id,
      serviceSlug: service.slug, 
      serviceName: service.title,
      selectedPackages: packages.filter(p => p.checked).map(p => ({id: p.id, name: p.name})), 
      concerns,
      bookingType: bookingOption,
      date: bookingOption === 'scheduled' && selectedDate ? selectedDate.toISOString().split('T')[0] : (bookingOption === 'sameday' ? 'Same day' : null),
      time: bookingOption === 'scheduled' ? selectedTime : (bookingOption === 'sameday' ? 'ASAP (25-40 mins estimate)' : null),
    };
    console.log('Booking Details:', bookingDetails);

     router.push({
      pathname: '/client/booking/confirmation',
      query: { details: JSON.stringify(bookingDetails) },
    });
  
  
  };

  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('');
  const [province, setProvince] = useState('');
  const [currentLocationStatus, setCurrentLocationStatus] = useState('');
  const [useGpsLocation, setUseGpsLocation] = useState(false); // To track if GPS location should be used
  const [showManualAddress, setShowManualAddress] = useState(false); // New state

  useEffect(() => {
    if (service && service.packages) {
      setPackages(service.packages.map(pkg => ({ ...pkg, checked: false })));
    }
  }, [service]);

  const handleUseCurrentLocation = () => {
    setCurrentLocationStatus('Fetching location...');
    setUseGpsLocation(true); // Indicate intent to use GPS
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
          let statusMessage = 'Could not get location.';
          if (error.code === error.PERMISSION_DENIED) {
            statusMessage = 'Location permission denied. Please enter manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            statusMessage = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            statusMessage = 'Location request timed out.';
          }
          setCurrentLocationStatus(`⚠️ Could not get location. Please enter manually or try again.`);
          setUseGpsLocation(false);
          setShowManualAddress(true); // Show manual form if GPS fails
        }
      );
    } else {
      setCurrentLocationStatus("Geolocation is not supported by this browser.");
      setUseGpsLocation(false);
      setShowManualAddress(true); // Show manual form if GPS fails
    }

    const handleConfirmBooking = () => {
    let finalAddress = '';
    if (useGpsLocation && currentLocationStatus.startsWith('📍')) {
      finalAddress = `Current Location: ${currentLocationStatus.replace('📍 ','').replace(' (Using this)','')}`;
    } else {
      // Construct address from manual inputs, only if they are filled
      const addressParts = [houseNumber, street, barangay, municipalityCity, province].filter(part => part.trim() !== '');
      if (addressParts.length > 0) {
        finalAddress = addressParts.join(', ');
      } else if (useGpsLocation) { // If tried GPS but it failed, and manual is empty
        finalAddress = "Location not specified or GPS failed.";
      } else { // If neither GPS tried nor manual input
        finalAddress = "No address provided.";
      }
    }


    const bookingDetails = {
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.title,
      providerName: service.name,
      selectedPackages: packages.filter(p => p.checked).map(p => ({id: p.id, name: p.name})),
      concerns: concerns || "No specific concerns.",
      bookingType: bookingOption,
      date: bookingOption === 'scheduled' && selectedDate ? selectedDate.toISOString().split('T')[0] : (bookingOption === 'sameday' ? 'Same day' : "N/A"),
      time: bookingOption === 'scheduled' && selectedTime ? selectedTime : (bookingOption === 'sameday' ? 'ASAP (est. 25-40 mins)' : "N/A"),
      location: finalAddress, // Add the determined location
    };
    console.log('Booking Details to send:', bookingDetails);

    router.push({
      pathname: '/client/booking/confirmation',
      query: { details: JSON.stringify(bookingDetails) },
    });
  };
  };

  if (!service) {
    return <div>Loading service details...</div>; // Or handle error
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
        showManualAddressForm={showManualAddress}     // Pass state
        onToggleManualAddress={toggleManualAddressForm} // Pass handler
      />
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