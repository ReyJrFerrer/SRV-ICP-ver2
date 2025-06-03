import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@bundly/ares-react';
import { nanoid } from 'nanoid';

// Types
import { Category } from '../../../../assets/types/category/category';
import { CATEGORIES as mockCategoriesData } from '../../../../assets/categories';
import { DayOfWeek, ServiceAvailability } from '../../../../assets/types/service/service-availability';
import { ServicePrice } from '../../../../assets/types/service/service-price';
import { ServiceLocation } from '../../../../assets/types/service/service-location';
import { MediaItem } from '../../../../assets/types/common/media-item';
import { Package as ServicePackageTypeDefinition } from '../../../../assets/types/service/service-package';

// Interface for the structured time slot input in the form
interface TimeSlotUIData {
  id: string;
  startHour: string;
  startMinute: string;
  startPeriod: 'AM' | 'PM';
  endHour: string;
  endMinute: string;
  endPeriod: 'AM' | 'PM';
}

// Interface for package data within the form state (Duration removed)
interface ServicePackageUIData {
  id: string; 
  name: string;
  description: string;
  price: string; 
  currency: string;
  features: string; 
  isPopular: boolean;
}

const initialServiceState = {
  serviceOfferingTitle: '',
  categoryId: '',
  locationAddress: '',
  serviceRadius: '5',
  serviceRadiusUnit: 'km' as 'km' | 'mi',
  availabilitySchedule: [] as DayOfWeek[],
  useSameTimeForAllDays: true,
  commonTimeSlots: [
    { id: nanoid(), startHour: '09', startMinute: '00', startPeriod: 'AM' as 'AM' | 'PM',
      endHour: '05', endMinute: '00', endPeriod: 'PM' as 'AM' | 'PM' }
  ] as TimeSlotUIData[],
  perDayTimeSlots: {} as Record<DayOfWeek, TimeSlotUIData[]>,
  requirements: '',
  servicePackages: [ // Duration removed from initial package
    { id: nanoid(), name: '', description: '', price: '', currency: 'PHP', features: '', isPopular: false }
  ] as ServicePackageUIData[],
};

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, currentIdentity } = useAuth();
  
  const [formData, setFormData] = useState(initialServiceState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [serviceImageFiles, setServiceImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteOptions = ['00', '15', '30', '45'];
  const periodOptions: ('AM' | 'PM')[] = ['AM', 'PM'];

  useEffect(() => {
    const relevantCategories = mockCategoriesData.filter(cat => !cat.parentId);
    setCategories(relevantCategories);
    if (relevantCategories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: relevantCategories[0].id }));
    }
  }, []); 

  useEffect(() => {
    if (!formData.useSameTimeForAllDays) {
      const newPerDaySlots = { ...formData.perDayTimeSlots };
      let changed = false;
      formData.availabilitySchedule.forEach(day => {
        if (!newPerDaySlots[day] || newPerDaySlots[day].length === 0) {
          newPerDaySlots[day] = [{ id: nanoid(), startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' }];
          changed = true;
        }
      });
      Object.keys(newPerDaySlots).forEach(dayKey => {
        const day = dayKey as DayOfWeek;
        if (!formData.availabilitySchedule.includes(day)) { delete newPerDaySlots[day]; changed = true; }
      });
      if (changed) { setFormData(prev => ({ ...prev, perDayTimeSlots: newPerDaySlots })); }
    }
  }, [formData.availabilitySchedule, formData.useSameTimeForAllDays, formData.perDayTimeSlots]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === 'useSameTimeForAllDays') { setFormData(prev => ({ ...prev, useSameTimeForAllDays: checked }));
        } else if (name === 'availabilitySchedule') {
            const dayValue = value as DayOfWeek;
            setFormData(prev => {
                const currentSchedule = prev.availabilitySchedule; let newSchedule;
                if (checked) { newSchedule = Array.from(new Set([...currentSchedule, dayValue]));
                } else { newSchedule = currentSchedule.filter(day => day !== dayValue); }
                return { ...prev, availabilitySchedule: newSchedule };
            });
        }
    } else { setFormData(prev => ({ ...prev, [name]: value })); }
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { const newFilesArray = Array.from(e.target.files); const updatedFiles = [...serviceImageFiles]; const updatedPreviews = [...imagePreviews]; newFilesArray.forEach(file => { if (!updatedFiles.find(f => f.name === file.name && f.size === file.size)) { updatedFiles.push(file); updatedPreviews.push(URL.createObjectURL(file)); } }); setServiceImageFiles(updatedFiles); setImagePreviews(updatedPreviews); e.target.value = "";  } };
  const handleRemoveImage = (indexToRemove: number) => { if (imagePreviews[indexToRemove]) { URL.revokeObjectURL(imagePreviews[indexToRemove]); } setServiceImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove)); setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove)); };
  useEffect(() => { return () => { imagePreviews.forEach(url => URL.revokeObjectURL(url)); }; }, [imagePreviews]);

  const handleCommonTimeSlotChange = (index: number, field: keyof TimeSlotUIData, value: string) => { setFormData(prev => ({ ...prev, commonTimeSlots: prev.commonTimeSlots.map((slot, i) => i === index ? { ...slot, [field]: value } : slot) })); };
  const addCommonTimeSlot = () => { setFormData(prev => ({ ...prev, commonTimeSlots: [...prev.commonTimeSlots, { id: nanoid(), startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' }] })); };
  const removeCommonTimeSlot = (idToRemove: string) => { setFormData(prev => ({ ...prev, commonTimeSlots: prev.commonTimeSlots.filter(slot => slot.id !== idToRemove) })); };
  const handlePerDayTimeSlotChange = (day: DayOfWeek, index: number, field: keyof TimeSlotUIData, value: string) => { setFormData(prev => { const daySlots = prev.perDayTimeSlots[day] || []; return { ...prev, perDayTimeSlots: { ...prev.perDayTimeSlots, [day]: daySlots.map((slot, i) => i === index ? { ...slot, [field]: value } : slot) } }; }); };
  const addPerDayTimeSlot = (day: DayOfWeek) => { setFormData(prev => { const daySlots = prev.perDayTimeSlots[day] || []; return { ...prev, perDayTimeSlots: { ...prev.perDayTimeSlots, [day]: [...daySlots, { id: nanoid(), startHour: '09', startMinute: '00', startPeriod: 'AM', endHour: '05', endMinute: '00', endPeriod: 'PM' }] } }; }); };
  const removePerDayTimeSlot = (day: DayOfWeek, idToRemove: string) => { setFormData(prev => ({ ...prev, perDayTimeSlots: { ...prev.perDayTimeSlots, [day]: (prev.perDayTimeSlots[day] || []).filter(slot => slot.id !== idToRemove) } })); };
  
  const handlePackageChange = (index: number, field: keyof ServicePackageUIData, value: string | boolean) => { setFormData(prev => { const updatedPackages = prev.servicePackages.map((pkg, i) => i === index ? { ...pkg, [field]: value } : pkg ); return { ...prev, servicePackages: updatedPackages }; }); };
  const addPackage = () => { setFormData(prev => ({ ...prev, servicePackages: [...prev.servicePackages, { id: nanoid(), name: '', description: '', price: '', currency: 'PHP', features: '', isPopular: false }] })); }; // Duration removed
  const removePackage = (idToRemove: string) => { setFormData(prev => ({ ...prev, servicePackages: prev.servicePackages.filter(pkg => pkg.id !== idToRemove) })); };

  const formatSlotTo24HourString = (slot: TimeSlotUIData): string | null => { if (!slot.startHour || !slot.startMinute || !slot.startPeriod || !slot.endHour || !slot.endMinute || !slot.endPeriod) return null; const formatTimePart = (hourStr: string, minuteStr: string, period: 'AM' | 'PM'): string => { let hour = parseInt(hourStr, 10); if (period === 'PM' && hour !== 12) hour += 12; else if (period === 'AM' && hour === 12) hour = 0; return `${String(hour).padStart(2, '0')}:${minuteStr}`; }; const startTime24 = formatTimePart(slot.startHour, slot.startMinute, slot.startPeriod); const endTime24 = formatTimePart(slot.endHour, slot.endMinute, slot.endPeriod); const startDateForCompare = new Date(`1970/01/01 ${startTime24}`); const endDateForCompare = new Date(`1970/01/01 ${endTime24}`); if (endDateForCompare <= startDateForCompare) return null;  return `${startTime24}-${endTime24}`; };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError(null); setSuccessMessage(null);
    if (!isAuthenticated || !currentIdentity) { setError("You must be logged in."); setIsLoading(false); return; }
    if (serviceImageFiles.length === 0) { setError("Please upload at least one service image."); setIsLoading(false); return; }
    const providerId = currentIdentity.getPrincipal().toString();
    
    const validPackages = formData.servicePackages.filter(pkg => pkg.name.trim() !== '' && pkg.price.trim() !== '');
    if (!formData.serviceOfferingTitle.trim() || validPackages.length === 0 || !formData.categoryId) { setError("Please fill Offering Title, Category, and at least one complete Package (name & price)."); setIsLoading(false); return; }
    
    const selectedCategoryObject = categories.find(c => c.id === formData.categoryId);
    if (!selectedCategoryObject) { setError("Invalid category selected."); setIsLoading(false); return; }

    let finalTimeSlots: string[] = []; 
    if (formData.useSameTimeForAllDays) { finalTimeSlots = formData.commonTimeSlots.map(slot => formatSlotTo24HourString(slot)).filter(Boolean) as string[]; } 
    else { if (formData.availabilitySchedule.length > 0) { const firstScheduledDayWithSlots = formData.availabilitySchedule.find(day => formData.perDayTimeSlots[day] && formData.perDayTimeSlots[day].length > 0); if (firstScheduledDayWithSlots) { const slotsForDay = formData.perDayTimeSlots[firstScheduledDayWithSlots] || []; finalTimeSlots = slotsForDay.map(slot => formatSlotTo24HourString(slot)).filter(Boolean) as string[]; } } }
    const commonSlotsAttempted = formData.useSameTimeForAllDays && formData.commonTimeSlots.length > 0 && formData.commonTimeSlots.some(s => s.startHour);
    const perDaySlotsAttempted = !formData.useSameTimeForAllDays && formData.availabilitySchedule.length > 0 && formData.availabilitySchedule.some(day => formData.perDayTimeSlots[day]?.some(s => s.startHour));
    if ((commonSlotsAttempted || perDaySlotsAttempted) && finalTimeSlots.length === 0) { setError("Time slots are incomplete or invalid."); setIsLoading(false); return; }
    if (formData.availabilitySchedule.length > 0 && finalTimeSlots.length === 0 && !commonSlotsAttempted && !perDaySlotsAttempted){ setError("Define time slots for selected working days or unselect days."); setIsLoading(false); return; }
    
    let uploadedHeroImageUrl = '/images/default-service.jpg'; 
    let mediaItemsForPayload: MediaItem[] = [];
    if (serviceImageFiles.length > 0) { uploadedHeroImageUrl = `mock/uploaded/${serviceImageFiles[0].name}`; mediaItemsForPayload = serviceImageFiles.map(file => ({ type: 'IMAGE' as const, url: `mock/uploaded/${file.name}`, thumbnail: `mock/uploaded/thumb_${file.name}` })); }

    const servicePackagesForPayload = validPackages.map(pkgUI => ({
        name: pkgUI.name, description: pkgUI.description, price: parseFloat(pkgUI.price) || 0,
        currency: pkgUI.currency || "PHP", // duration is removed
        features: pkgUI.features.split(',').map(f => f.trim()).filter(f => f),
        isPopular: pkgUI.isPopular, isActive: true,
    } as Omit<ServicePackageTypeDefinition, 'id' | 'createdAt' | 'updatedAt' | 'duration'> & { duration?: string })); // Adjusted type to reflect duration might not be there in definition


    const firstValidPackage = validPackages[0];
    const mainServiceDescription = firstValidPackage.description || formData.serviceOfferingTitle;
    const mainServicePrice = {
        amount: parseFloat(firstValidPackage.price) || 0,
        currency: firstValidPackage.currency || "PHP",
        unit: "/service", 
        isNegotiable: false, 
    } as ServicePrice;

    const newServicePayload = {
      providerId, name: formData.serviceOfferingTitle, title: formData.serviceOfferingTitle, 
      description: mainServiceDescription, price: mainServicePrice,
      location: { address: formData.locationAddress, coordinates: { latitude: 0, longitude: 0 }, serviceRadius: parseInt(formData.serviceRadius) || 0, serviceRadiusUnit: formData.serviceRadiusUnit } as ServiceLocation,
      availability: { schedule: formData.availabilitySchedule, timeSlots: finalTimeSlots, isAvailableNow: true } as ServiceAvailability,
      category: { id: selectedCategoryObject.id, name: selectedCategoryObject.name, slug: selectedCategoryObject.slug, description: selectedCategoryObject.description || "", icon: selectedCategoryObject.icon || "", imageUrl: selectedCategoryObject.imageUrl || "", isActive: selectedCategoryObject.isActive, createdAt: selectedCategoryObject.createdAt || new Date(), updatedAt: selectedCategoryObject.updatedAt || new Date() } as Omit<Category, 'services'>,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
      heroImage: uploadedHeroImageUrl, media: mediaItemsForPayload, packages: servicePackagesForPayload,
      isVerified: false, isActive: true, createdAt: new Date(), updatedAt: new Date(),
      slug: formData.serviceOfferingTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0,50) + '-' + Date.now(),
    };

    console.log("Submitting New Service Data:", newServicePayload);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setSuccessMessage("Service added successfully! (Mocked)");
        setFormData(initialServiceState); 
        setServiceImageFiles([]); setImagePreviews([]);
        setTimeout(() => { setSuccessMessage(null); router.push('/provider/home'); }, 2500);
    } catch (err) { console.error("Failed to add service:", err); setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally { setIsLoading(false); }
  };

  return (
    <>
      <Head>
        <title>SRV | Add New Service</title>
        <meta name="description" content="Detail your new service offering and packages." />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors" aria-label="Go back"><ArrowLeftIcon className="h-5 w-5 text-gray-700" /></button>
            <h1 className="text-xl font-semibold text-gray-800">Add New Service Offering</h1>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6">
          {successMessage && ( <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm"> {successMessage} </div> )}
          {error && ( <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm"> {error} </div> )}

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
            {/* Service Offering Title */}
            <div>
              <label htmlFor="serviceOfferingTitle" className="block text-sm font-medium text-gray-700 mb-1">Service Offering Title*</label>
              <input type="text" name="serviceOfferingTitle" id="serviceOfferingTitle" value={formData.serviceOfferingTitle} onChange={handleChange} required 
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                     placeholder="e.g., Professional Hair Styling, Math Tutoring Sessions"/>
            </div>
            
            {/* Category Selection */}
            <div><label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category*</label><select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"><option value="" disabled>Select a category</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>

            {/* --- Service Packages Section (Duration input removed) --- */}
            <fieldset className="border p-4 rounded-md border-gray-300">
              <legend className="text-sm font-medium text-gray-700 px-1">Service Packages*</legend>
              <p className="text-xs text-gray-500 mb-3">Define one or more packages. The first package's name & price are required.</p>
              {formData.servicePackages.map((pkg, index) => (
                <div key={pkg.id} className="space-y-3 border border-gray-200 p-4 rounded-md mb-4 bg-gray-50 relative">
                  <h4 className="text-sm font-semibold text-gray-800">Package {index + 1}</h4>
                  <div><label htmlFor={`pkgName-${pkg.id}`} className="block text-xs font-medium text-gray-600 mb-1">Package Name*</label><input type="text" name="name" id={`pkgName-${pkg.id}`} value={pkg.name} onChange={(e) => handlePackageChange(index, 'name', e.target.value)} required={index === 0} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500" /></div>
                  <div><label htmlFor={`pkgDesc-${pkg.id}`} className="block text-xs font-medium text-gray-600 mb-1">Description*</label><textarea name="description" id={`pkgDesc-${pkg.id}`} value={pkg.description} onChange={(e) => handlePackageChange(index, 'description', e.target.value)} rows={3} required={index===0} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"></textarea></div>
                  <div><label htmlFor={`pkgPrice-${pkg.id}`} className="block text-xs font-medium text-gray-600 mb-1">Price (PHP)*</label><input type="number" name="price" id={`pkgPrice-${pkg.id}`} value={pkg.price} onChange={(e) => handlePackageChange(index, 'price', e.target.value)} required={index === 0} step="0.01" min="0" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500" /></div>
                  {/* Duration Input Removed from here */}
                  <div><label htmlFor={`pkgFeatures-${pkg.id}`} className="block text-xs font-medium text-gray-600 mb-1">Features (comma-separated)</label><input type="text" name="features" id={`pkgFeatures-${pkg.id}`} value={pkg.features} onChange={(e) => handlePackageChange(index, 'features', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500" /></div>
                  <div className="flex items-center"><input type="checkbox" name="isPopular" id={`pkgIsPopular-${pkg.id}`} checked={pkg.isPopular} onChange={(e) => handlePackageChange(index, 'isPopular', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label htmlFor={`pkgIsPopular-${pkg.id}`} className="ml-2 block text-sm text-gray-900">Mark as Popular</label></div>
                  {formData.servicePackages.length > 1 && (<button type="button" onClick={() => removePackage(pkg.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700" aria-label="Remove package"><TrashIcon className="h-4 w-4"/></button>)}
                </div>
              ))}
              <button type="button" onClick={addPackage} className="mt-3 px-4 py-2 border border-dashed border-blue-500 text-sm font-medium rounded-md text-blue-700 hover:bg-blue-50">+ Add Package</button>
            </fieldset>
            {/* --- End of Service Packages Section --- */}
            
            {/* Availability, Location, Requirements, Image Upload fields as before */}
            <fieldset className="border p-4 rounded-md border-gray-300"><legend className="text-sm font-medium text-gray-700 px-1">Availability*</legend><div className="mt-2 mb-3"><label className="block text-xs font-medium text-gray-600 mb-2">Working Days</label><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">{daysOfWeek.map(day => (<div key={day} className="flex items-center"><input type="checkbox" name="availabilitySchedule" id={`day-${day}`} value={day} checked={formData.availabilitySchedule.includes(day)} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/><label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-900">{day}</label></div>))}</div></div><div className="mt-4 mb-3 flex items-center"><input type="checkbox" name="useSameTimeForAllDays" id="useSameTimeForAllDays" checked={formData.useSameTimeForAllDays} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/><label htmlFor="useSameTimeForAllDays" className="ml-2 block text-sm text-gray-900">Use same time slots for all selected working days</label></div>{formData.useSameTimeForAllDays ? ( <div className="mt-2"><label className="block text-xs font-medium text-gray-600 mb-2">Common Time Slots</label>{formData.commonTimeSlots.map((slot, index) => (<div key={slot.id} className="p-3 mb-2 border border-gray-200 rounded-md bg-gray-50 space-y-2"><div className="grid grid-cols-3 sm:grid-cols-7 gap-2 items-center"> <select name="startHour" aria-label={`Start hour for slot ${index+1}`} value={slot.startHour} onChange={(e) => handleCommonTimeSlotChange(index, 'startHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{hourOptions.map(h => <option key={`c_sh-${index}-${h}`} value={h}>{h}</option>)}</select> <select name="startMinute" aria-label={`Start minute for slot ${index+1}`} value={slot.startMinute} onChange={(e) => handleCommonTimeSlotChange(index, 'startMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{minuteOptions.map(m => <option key={`c_sm-${index}-${m}`} value={m}>{m}</option>)}</select> <select name="startPeriod" aria-label={`Start period for slot ${index+1}`} value={slot.startPeriod} onChange={(e) => handleCommonTimeSlotChange(index, 'startPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{periodOptions.map(p => <option key={`c_sp-${index}-${p}`} value={p}>{p}</option>)}</select> <span className="hidden sm:inline-block text-center text-gray-500 sm:col-span-1">to</span> <select name="endHour" aria-label={`End hour for slot ${index+1}`} value={slot.endHour} onChange={(e) => handleCommonTimeSlotChange(index, 'endHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{hourOptions.map(h => <option key={`c_eh-${index}-${h}`} value={h}>{h}</option>)}</select> <select name="endMinute" aria-label={`End minute for slot ${index+1}`} value={slot.endMinute} onChange={(e) => handleCommonTimeSlotChange(index, 'endMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{minuteOptions.map(m => <option key={`c_em-${index}-${m}`} value={m}>{m}</option>)}</select> <select name="endPeriod" aria-label={`End period for slot ${index+1}`} value={slot.endPeriod} onChange={(e) => handleCommonTimeSlotChange(index, 'endPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{periodOptions.map(p => <option key={`c_ep-${index}-${p}`} value={p}>{p}</option>)}</select></div> {formData.commonTimeSlots.length > 1 && (<button type="button" onClick={() => removeCommonTimeSlot(slot.id)} className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center"><TrashIcon className="h-3 w-3 mr-1"/> Remove Slot</button> )}</div>))} <button type="button" onClick={addCommonTimeSlot} className="mt-2 px-3 py-1.5 border border-dashed border-gray-400 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-50">+ Add Common Time Slot</button></div>) : ( <div className="mt-2 space-y-4"><label className="block text-xs font-medium text-gray-600 mb-1">Specific Time Slots per Selected Day</label>{formData.availabilitySchedule.length === 0 && <p className="text-xs text-gray-500">Select working days above.</p>}{formData.availabilitySchedule.map(day => (<div key={day} className="p-3 border border-gray-200 rounded-md bg-gray-50"><p className="text-sm font-medium text-gray-800 mb-2">{day}</p>{(formData.perDayTimeSlots[day] || []).map((slot, index) => (<div key={slot.id} className="p-2 mb-2 border border-gray-100 rounded-md bg-white space-y-2"> <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 items-center"> <select name="startHour" value={slot.startHour} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'startHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{hourOptions.map(h => <option key={`${day}_sh-${index}-${h}`} value={h}>{h}</option>)}</select> <select name="startMinute" value={slot.startMinute} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'startMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{minuteOptions.map(m => <option key={`${day}_sm-${index}-${m}`} value={m}>{m}</option>)}</select> <select name="startPeriod" value={slot.startPeriod} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'startPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{periodOptions.map(p => <option key={`${day}_sp-${index}-${p}`} value={p}>{p}</option>)}</select> <span className="hidden sm:inline-block text-center text-gray-500 sm:col-span-1">to</span> <select name="endHour" value={slot.endHour} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'endHour', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{hourOptions.map(h => <option key={`${day}_eh-${index}-${h}`} value={h}>{h}</option>)}</select> <select name="endMinute" value={slot.endMinute} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'endMinute', e.target.value)} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{minuteOptions.map(m => <option key={`${day}_em-${index}-${m}`} value={m}>{m}</option>)}</select> <select name="endPeriod" value={slot.endPeriod} onChange={(e) => handlePerDayTimeSlotChange(day, index, 'endPeriod', e.target.value as 'AM' | 'PM')} className="col-span-1 block w-full px-2 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">{periodOptions.map(p => <option key={`${day}_ep-${index}-${p}`} value={p}>{p}</option>)}</select></div> {(formData.perDayTimeSlots[day]?.length || 0) > 1 && (<button type="button" onClick={() => removePerDayTimeSlot(day, slot.id)} className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center"><TrashIcon className="h-3 w-3 mr-1"/> Remove Slot</button> )}</div>))} <button type="button" onClick={() => addPerDayTimeSlot(day)} className="mt-2 px-3 py-1.5 border border-dashed border-gray-400 text-xs font-medium rounded-md text-gray-700 hover:bg-gray-50">+ Add Time Slot for {day}</button></div>))}</div>)}</fieldset>
            <fieldset className="border p-4 rounded-md border-gray-300"><legend className="text-sm font-medium text-gray-700 px-1">Service Location*</legend><div className="mt-2"><label htmlFor="locationAddress" className="block text-xs font-medium text-gray-600 mb-1">Primary Service Address/Area Description</label><input type="text" name="locationAddress" id="locationAddress" value={formData.locationAddress} onChange={handleChange} required placeholder="e.g., Within Baguio City limits" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div><div className="grid grid-cols-2 gap-4 mt-3"><div><label htmlFor="serviceRadius" className="block text-xs font-medium text-gray-600 mb-1">Service Radius</label><input type="number" name="serviceRadius" id="serviceRadius" value={formData.serviceRadius} onChange={handleChange} required placeholder="e.g., 5" min="0" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div><div><label htmlFor="serviceRadiusUnit" className="block text-xs font-medium text-gray-600 mb-1">Radius Unit</label><select name="serviceRadiusUnit" id="serviceRadiusUnit" value={formData.serviceRadiusUnit} onChange={handleChange} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[42px]"><option value="km">km</option><option value="mi">mi</option></select></div></div></fieldset>
            <div><label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Client Requirements (comma-separated)</label><input type="text" name="requirements" id="requirements" value={formData.requirements} onChange={handleChange} placeholder="e.g., Parking space, Access to water" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label htmlFor="serviceImages" className="block text-sm font-medium text-gray-700 mb-1">Service Images* (First image is main/hero)</label><input type="file" name="serviceImages" id="serviceImages" accept="image/png, image/jpeg, image/gif, image/svg+xml" multiple onChange={handleImageFilesChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>{serviceImageFiles.length === 0 && <p className="mt-1 text-xs text-red-500">At least one image is required.</p>}{imagePreviews.length > 0 && (<div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">{imagePreviews.map((previewUrl, index) => (<div key={previewUrl} className="relative group border border-gray-200 rounded-md overflow-hidden aspect-square"><img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" /><button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-0.5 sm:p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity duration-150" aria-label={`Remove image ${index + 1}`}><TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" /></button></div>))}</div>)}</div>
            
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isLoading ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Adding Service...</>
              ) : ( <><PlusCircleIcon className="h-5 w-5 mr-2" /> Add Service</>)}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AddServicePage;