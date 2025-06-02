import React, { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@bundly/ares-react'; 

// Types
import { Category } from '../../../../assets/types/category/category';
import { CATEGORIES as mockCategoriesData } from '../../../../assets/categories';
import { DayOfWeek, ServiceAvailability } from '../../../../assets/types/service/service-availability';
import { ServicePrice } from '../../../../assets/types/service/service-price';
import { ServiceLocation } from '../../../../assets/types/service/service-location';
import { MediaItem } from '../../../../assets/types/common/media-item';

// Interface for the structured time slot input in the form
interface TimeSlotInput {
  id: string; 
  startHour: string;
  startMinute: string;
  startPeriod: 'AM' | 'PM';
  endHour: string;
  endMinute: string;
  endPeriod: 'AM' | 'PM';
}


// Simplified initial service state
const initialServiceState = {
  title: '',
  description: '',
  categoryId: '',
  priceAmount: '',
  priceUnit: '/hr',
  isNegotiable: true,
  locationAddress: '',
  serviceRadius: '5',
  serviceRadiusUnit: 'km' as 'km' | 'mi',
  availabilitySchedule: [] as DayOfWeek[],
  // Initialize with one default time slot using the new structure
  availabilityTimeSlots: [
    { 
      id: `slot-${Date.now()}`, // Simple unique ID
      startHour: '09', startMinute: '00', startPeriod: 'AM' as 'AM' | 'PM',
      endHour: '05', endMinute: '00', endPeriod: 'PM' as 'AM' | 'PM'
    }
  ] as TimeSlotInput[], // Array of TimeSlotInput objects
  requirements: '',
  heroImageUrl: '',
};
const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth(); // Get auth state and identity
  const [formData, setFormData] = useState(initialServiceState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteOptions = ['00', '15', '30', '45'];
  const periodOptions: ('AM' | 'PM')[] = ['AM', 'PM'];

  const handleTimeSlotChange = (index: number, field: keyof TimeSlotInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      availabilityTimeSlots: prev.availabilityTimeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      availabilityTimeSlots: [
        ...prev.availabilityTimeSlots,
        { 
          id: `slot-${Date.now()}-${prev.availabilityTimeSlots.length}`, // Ensure unique ID
          startHour: '09', startMinute: '00', startPeriod: 'AM',
          endHour: '05', endMinute: '00', endPeriod: 'PM' 
        },
      ],
    }));
  };

  const removeTimeSlot = (idToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      availabilityTimeSlots: prev.availabilityTimeSlots.filter(slot => slot.id !== idToRemove),
    }));
  };

  const formatSlotTo24HourString = (slot: TimeSlotInput): string | null => {
    if (!slot.startHour || !slot.startMinute || !slot.startPeriod || 
        !slot.endHour || !slot.endMinute || !slot.endPeriod) {
      return null; 
    }

    const formatTimePart = (hourStr: string, minuteStr: string, period: 'AM' | 'PM'): string => {
      let hour = parseInt(hourStr, 10);
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) { 
        hour = 0;
      }
      return `${String(hour).padStart(2, '0')}:${minuteStr}`;
    };

    const startTime24 = formatTimePart(slot.startHour, slot.startMinute, slot.startPeriod);
    const endTime24 = formatTimePart(slot.endHour, slot.endMinute, slot.endPeriod);
    
    // Basic validation: end time should be after start time
    const startDateForCompare = new Date(`1970/01/01 ${startTime24}`);
    const endDateForCompare = new Date(`1970/01/01 ${endTime24}`);
    if (endDateForCompare <= startDateForCompare) {
        console.warn("End time must be after start time for slot:", slot);
    }

    return `${startTime24}-${endTime24}`;
  };
  
  useEffect(() => {
    const relevantCategories = mockCategoriesData.filter(cat => !cat.parentId); 
    setCategories(relevantCategories);
    if (relevantCategories.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: relevantCategories[0].id }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === 'isNegotiable') {
            setFormData(prev => ({ ...prev, isNegotiable: checked }));
        } else if (name === 'availabilitySchedule') {
            const dayValue = value as DayOfWeek;
            setFormData(prev => {
                const currentSchedule = prev.availabilitySchedule;
                if (checked) {
                    return { ...prev, availabilitySchedule: Array.from(new Set([...currentSchedule, dayValue])) };
                } else {
                    return { ...prev, availabilitySchedule: currentSchedule.filter(day => day !== dayValue) };
                }
            });
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !currentIdentity) {
      setError("You must be logged in to add a service.");
      setIsLoading(false);
      return;
    }
    const providerId = currentIdentity.getPrincipal().toString();

    
    // Validate form data (basic example)
    if (!formData.title.trim() || !formData.description.trim() || !formData.categoryId || !formData.priceAmount) {
        setError("Please fill in all required fields (*).");
        setIsLoading(false);
        return;
    }
    
    const selectedCategoryObject = categories.find(c => c.id === formData.categoryId);
    if (!selectedCategoryObject) {
        setError("Invalid category selected.");
        setIsLoading(false);
        return;
    }

     const formattedTimeSlots = formData.availabilityTimeSlots
      .map(slot => formatSlotTo24HourString(slot))
      .filter(Boolean) as string[]; 

    if (formattedTimeSlots.length === 0 && formData.availabilityTimeSlots.length > 0) {
        setError("Please ensure all time slots are complete and valid (end time must be after start time).");
        setIsLoading(false);
        return;
    }
    if (formData.availabilityTimeSlots.length === 0) { 
        setError("Please add at least one time slot.");
        setIsLoading(false);
        return;
    }

    const newServicePayload = {
      providerId: providerId,
      name: formData.title, 
      title: formData.title,
      description: formData.description,
      price: {
        amount: parseFloat(formData.priceAmount) || 0,
        currency: "PHP", 
        unit: formData.priceUnit,
        isNegotiable: formData.isNegotiable,
      } as ServicePrice,
      location: {
        address: formData.locationAddress,
        coordinates: { latitude: 0, longitude: 0 },
        serviceRadius: parseInt(formData.serviceRadius) || 0,
        serviceRadiusUnit: formData.serviceRadiusUnit,
      } as ServiceLocation,
     availability: {
        schedule: formData.availabilitySchedule,
        timeSlots: formattedTimeSlots, 
        isAvailableNow: true, 
      } as ServiceAvailability,
      category: { 
        id: selectedCategoryObject.id,
        name: selectedCategoryObject.name,
        slug: selectedCategoryObject.slug,
        description: selectedCategoryObject.description || "",
        icon: selectedCategoryObject.icon || "",
        imageUrl: selectedCategoryObject.imageUrl || "",
        isActive: selectedCategoryObject.isActive,
        createdAt: selectedCategoryObject.createdAt || new Date(), 
        updatedAt: selectedCategoryObject.updatedAt || new Date(),
      } as Omit<Category, 'services'>, 
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
      heroImage: formData.heroImageUrl || '/images/default-service.jpg',
      media: formData.heroImageUrl ? [{ type: 'IMAGE' as const, url: formData.heroImageUrl, thumbnail: formData.heroImageUrl }] : [] as MediaItem[],
      isVerified: false, 
      isActive: true,    
      slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0,50) + '-' + Date.now(),
    };

    console.log("Submitting New Service Data with formatted time slots:", newServicePayload);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setSuccessMessage("Service added successfully! (Mocked)");
      setFormData(initialServiceState); 
      setTimeout(() => {
        setSuccessMessage(null);
        router.push('/provider/home');
      }, 2500);

    } catch (err) {
      console.error("Failed to add service:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <Head>
        <title>Add New Service | SRV Provider</title>
        <meta name="description" content="Detail the new service you offer." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Add New Service</h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
            {/* Service Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Service Title*</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            {/* Pricing Fieldset */}
            <fieldset className="border p-4 rounded-md border-gray-300">
                <legend className="text-sm font-medium text-gray-700 px-1">Pricing*</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label htmlFor="priceAmount" className="block text-xs font-medium text-gray-600 mb-1">Amount (PHP)</label>
                        <input type="number" name="priceAmount" id="priceAmount" value={formData.priceAmount} onChange={handleChange} required step="0.01" min="0" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="priceUnit" className="block text-xs font-medium text-gray-600 mb-1">Unit (e.g., /hr, /session)</label>
                        <input type="text" name="priceUnit" id="priceUnit" value={formData.priceUnit} onChange={handleChange} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                </div>
                <div className="mt-4 flex items-center">
                    <input type="checkbox" name="isNegotiable" id="isNegotiable" checked={formData.isNegotiable} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor="isNegotiable" className="ml-2 block text-sm text-gray-900">Price is negotiable</label>
                </div>
            </fieldset>
            
            {/* Availability Fieldset */}
            <fieldset className="border p-4 rounded-md border-gray-300">
                <legend className="text-sm font-medium text-gray-700 px-1">Availability*</legend>
                <div className="mt-2 mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Working Days</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                        {daysOfWeek.map(day => (
                            <div key={day} className="flex items-center">
                                <input type="checkbox" name="availabilitySchedule" id={`day-${day}`} value={day} checked={formData.availabilitySchedule.includes(day)} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                                <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-900">{day}</label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Time Slots*</label>
                  {formData.availabilityTimeSlots.map((slot, index) => (
                    <div key={slot.id} className="p-3 mb-3 border border-gray-200 rounded-md bg-gray-50">
                      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 items-center">
                        {/* Start Time */}
                        <select name="startHour" value={slot.startHour} onChange={(e) => handleTimeSlotChange(index, 'startHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {hourOptions.map(h => <option key={`sh-${h}`} value={h}>{h}</option>)}
                        </select>
                        <select name="startMinute" value={slot.startMinute} onChange={(e) => handleTimeSlotChange(index, 'startMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {minuteOptions.map(m => <option key={`sm-${m}`} value={m}>{m}</option>)}
                        </select>
                        <select name="startPeriod" value={slot.startPeriod} onChange={(e) => handleTimeSlotChange(index, 'startPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {periodOptions.map(p => <option key={`sp-${p}`} value={p}>{p}</option>)}
                        </select>
                        
                        <span className="hidden sm:inline-block text-center text-gray-500 sm:col-span-1">to</span>

                        {/* End Time */}
                        <select name="endHour" value={slot.endHour} onChange={(e) => handleTimeSlotChange(index, 'endHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {hourOptions.map(h => <option key={`eh-${h}`} value={h}>{h}</option>)}
                        </select>
                        <select name="endMinute" value={slot.endMinute} onChange={(e) => handleTimeSlotChange(index, 'endMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {minuteOptions.map(m => <option key={`em-${m}`} value={m}>{m}</option>)}
                        </select>
                        <select name="endPeriod" value={slot.endPeriod} onChange={(e) => handleTimeSlotChange(index, 'endPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          {periodOptions.map(p => <option key={`ep-${p}`} value={p}>{p}</option>)}
                        </select>
                      </div>
                      {formData.availabilityTimeSlots.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTimeSlot(slot.id)} 
                          className="mt-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove Slot
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={addTimeSlot}
                    className="mt-2 px-3 py-1.5 border border-dashed border-gray-400 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    + Add Another Time Slot
                  </button>
                </div>
            </fieldset>

            {/* Location Fields */}
            <fieldset className="border p-4 rounded-md border-gray-300">
                <legend className="text-sm font-medium text-gray-700 px-1">Service Location*</legend>
                <div className="mt-2">
                    <label htmlFor="locationAddress" className="block text-xs font-medium text-gray-600 mb-1">Primary Service Address/Area Description</label>
                    <input type="text" name="locationAddress" id="locationAddress" value={formData.locationAddress} onChange={handleChange} required placeholder="e.g., Within Baguio City limits" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                        <label htmlFor="serviceRadius" className="block text-xs font-medium text-gray-600 mb-1">Service Radius</label>
                        <input type="number" name="serviceRadius" id="serviceRadius" value={formData.serviceRadius} onChange={handleChange} required placeholder="e.g., 5" min="0" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="serviceRadiusUnit" className="block text-xs font-medium text-gray-600 mb-1">Radius Unit</label>
                        <select name="serviceRadiusUnit" id="serviceRadiusUnit" value={formData.serviceRadiusUnit} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[42px]"> {/* Matched height approx */}
                            <option value="km">km</option>
                            <option value="mi">mi</option>
                        </select>
                    </div>
                </div>
            </fieldset>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Client Requirements (seperate by comma)</label>
              <input type="text" name="requirements" id="requirements" value={formData.requirements} onChange={handleChange} placeholder="e.g., Parking space, Access to water" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            
            {/* Hero Image URL */}
            <div>
              <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Main Service Image URL (temporary)</label>
              <input type="url" name="heroImageUrl" id="heroImageUrl" value={formData.heroImageUrl} onChange={handleChange} placeholder="https://example.com/your-service-image.jpg" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
               <p className="mt-1 text-xs text-gray-500">A proper file upload will be implemented later.</p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Service...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Service
                </>
              )}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AddServicePage;