import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { 
    ArrowLeftIcon, 
    UserIcon, 
    MapPinIcon, 
    CalendarIcon, 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    PhoneIcon,
    CameraIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/solid'; 

import BottomNavigation from '@app/components/provider/BottomNavigationNextjs';
import { useProviderBookingManagement } from '../../../hooks/useProviderBookingManagement';

const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const ActiveServicePage: React.FC = () => {
    const router = useRouter();
    const { bookingId, startTime: startTimeParam } = router.query;
    const [actualStartTime, setActualStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const {
        getBookingById,
        loading,
        error,
        isProviderAuthenticated
    } = useProviderBookingManagement();

    const booking = useMemo(() => {
        if (bookingId && typeof bookingId === 'string') {
            return getBookingById(bookingId);
        }
        return null;
    }, [bookingId, getBookingById]);

    useEffect(() => {
        if (booking) {
            if (typeof startTimeParam === 'string') {
                setActualStartTime(new Date(startTimeParam));
            } else if (booking.scheduledDate) {
                setActualStartTime(new Date(booking.scheduledDate));
            } else {
                setActualStartTime(new Date()); 
            }
        }
    }, [booking, startTimeParam]);

    useEffect(() => {
        let timerInterval: NodeJS.Timeout;
        if (actualStartTime) {
            timerInterval = setInterval(() => {
                const now = new Date();
                const diffSeconds = Math.floor((now.getTime() - actualStartTime.getTime()) / 1000);
                setElapsedTime(diffSeconds > 0 ? diffSeconds : 0);
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [actualStartTime]);
    
    const handleMarkCompleted = async () => {
        if (!booking) return;
        router.push(`/provider/complete-service/${booking.id}`);
    };

    const handleUploadEvidence = () => { 
        alert('Upload evidence functionality to be implemented.'); 
    };
    
    const handleContactClient = () => { 
        if (booking?.clientPhone) {
            window.open(`tel:${booking.clientPhone}`, '_self');
        } else {
            alert(`Contact client: ${booking?.clientName || 'Unknown Client'}`); 
        }
    };

    if (!isProviderAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">
                Please log in as a service provider to access this page.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">
                Error: {error}
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">
                Booking not found or an error occurred.
            </div>
        );
    }

    if (booking.status !== 'InProgress') {
        return (
            <div className="min-h-screen flex items-center justify-center text-orange-500 p-4 text-center">
                This booking is not currently in progress. Current status: {booking.status}
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Active Service: {booking.serviceName || 'Service'} | SRV Provider</title>
            </Head>
            <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
                {/* Header */}
                  <header className="bg-white shadow-sm sticky top-0 z-20 px-4 py-3">
                    <div className="container mx-auto flex items-center justify-center relative">
                      <div className="absolute left-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Go back">
                          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                      
                      <div className="flex items-center">
                        <Image src="/logo.svg" alt="SRV Logo" width={40} height={40} />
                      </div>

                    </div>
                  </header>

                <main className="flex-grow container mx-auto px-4 py-6 space-y-6 pb-20">
                    <h1 className="text-xl font-semibold text-gray-800 ml-4 truncate text-center">Service in Progress</h1>
                    {/* Timer Section - Card 1 */}
                    <section className="bg-white p-6 rounded-xl shadow-md text-center">
                      {/* The container's size is now large enough to hold the image and text */}
                      <div className="flex flex-col items-center justify-center rounded-full border-4 border-gray-300 p-8 mx-auto w-80 h-80">
                        <div className="flex justify-center mb-2">
                          <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={200}
                            height={200}
                            className="rounded-full bg-white flex-shrink-0"
                            priority
                          />
                        </div>
                        <p className="text-xs text-gray-500">Elapsed Time</p>
                        <p className="text-3xl font-bold text-gray-800 tabular-nums my-1">{formatDuration(elapsedTime).slice(3)}</p>
                        {actualStartTime && <p className="text-xs text-gray-500 mt-1">Started at {actualStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                      </div>
                    </section>
                    
                    {/* Service Details Section - Card 2 */}
                    <section className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Service</h2>
                        <div className="border-t-2 border-gray-300 p-4 borderspace-y-4 text-gray-700">
                            {/* Client */}
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                                <p className="text-sm">Client: <span className="font-medium text-gray-900">{booking.clientName || 'Unknown Client'}</span></p>
                            </div>
                            {/* Contact */}
                            {booking.clientPhone && (
                                <div className="flex items-center">
                                    <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                                    <p className="text-sm">Contact: <span className="font-medium text-gray-900">{booking.clientPhone}</span></p>
                                </div>
                            )}
                            {/* Schedule */}
                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                                <p className="text-sm">
                                    Schedule: <span className="font-medium text-gray-900">{new Date(booking.scheduledDate).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
                                    {actualStartTime && `, Started at ${actualStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                </p>
                            </div>
                            {/* Location */}
                            <div className="flex items-start">
                                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm">Location: <span className="font-medium text-gray-900 break-words">{booking.formattedLocation || 'Location not specified'}</span></p>
                            </div>
                            {/* Price */}
                            <div className="flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                                <p className="text-sm">Price: <span className="font-medium text-gray-900">Php {Number(booking.price).toFixed(2)}</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Actions Section - Card 3 */}
                    <section className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={handleUploadEvidence}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <CameraIcon className="h-5 w-5"/> Upload Evidence
                            </button>
                            <button
                                onClick={handleContactClient}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <PhoneIcon className="h-5 w-5"/> Contact Client
                            </button>
                            <button
                                onClick={handleMarkCompleted}
                                className="w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                <CheckCircleIcon className="h-5 w-5"/> Mark as Completed
                            </button>
                        </div>
                    </section>
                </main>
                <div className="lg:hidden"> <BottomNavigation /> </div>
            </div>
        </>
    );
};

export default ActiveServicePage;