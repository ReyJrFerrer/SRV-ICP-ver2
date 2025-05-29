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

const LocationInfo: FC = () => (
  <div className={styles.formSection}><h3 className={styles.sectionTitle}>Service Location</h3><p>Current Address: Baguio City</p><button className={styles.actionButton}>View on Map</button><button className={styles.secondaryButton}>Change Address</button></div>
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
      <LocationInfo />
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