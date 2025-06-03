import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, PrinterIcon, ShareIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { PROVIDER_ORDERS } from '../../../../assets/providerOrders';
import { ProviderOrder as ProviderOrderType } from '../../../../assets/types/provider/provider-order';

const ReceiptPage: React.FC = () => {
  const router = useRouter();
  const { bookingId, price, paid, change, method } = router.query;

  const [booking, setBooking] = useState<ProviderOrderType | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment details from query params
  const serviceTotal = typeof price === 'string' ? parseFloat(price) : 0;
  const amountPaid = typeof paid === 'string' ? parseFloat(paid) : 0;
  const changeGiven = typeof change === 'string' ? parseFloat(change) : 0;
  const paymentMethod = typeof method === 'string' ? method : 'N/A';

  useEffect(() => {
    if (bookingId && typeof bookingId === 'string') {
      const foundBooking = PROVIDER_ORDERS.find(b => b.id === bookingId);
      setBooking(foundBooking || null);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const handleDone = () => {
    router.push('/provider/bookings?tab=Completed'); // Or provider home
  };

  const handlePrint = () => {
    // Basic browser print
    window.print();
  };
  
  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: `Receipt for ${booking?.serviceTitle}`,
              text: `Service completed for ${booking?.clientName}. Amount Paid: ₱${amountPaid.toFixed(2)}`,
              url: window.location.href, // Share current page URL
          }).catch(console.error);
      } else {
          alert('Web Share API not supported. You can copy the URL.');
      }
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center">Booking details for receipt not found.</div>;
  }

  const completionTime = booking.actualEndTime ? new Date(booking.actualEndTime) : new Date(booking.updatedAt); // Use actualEndTime if available

  return (
    <>
      <Head>
        <title>Receipt - {booking.serviceTitle} | SRV Provider</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 sm:py-12 print:bg-white">
        {/* Back button (hidden on print) */}
        <div className="container mx-auto px-4 mb-4 print:hidden">
            <button 
                onClick={() => router.push('/provider/bookings')} // Go to main bookings page
                className="flex items-center text-sm text-blue-600 hover:underline"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Bookings
            </button>
        </div>

        <main className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg print:shadow-none print:border print:border-gray-300">
          <div className="text-center mb-8">
            <CheckBadgeIcon className="h-16 w-16 text-green-500 mx-auto mb-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Service Completed!</h1>
            <p className="text-sm text-gray-500">Thank you for using SRV Platform.</p>
          </div>

          <div className="space-y-3 text-sm mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium text-gray-800">{booking.id.toUpperCase().slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date Completed:</span>
              <span className="font-medium text-gray-800">{completionTime.toLocaleDateString()} {completionTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            <hr className="my-3"/>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-gray-800 text-right break-words max-w-[60%]">{booking.serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium text-gray-800">{booking.clientName}</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-6 space-y-3 text-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Summary</h2>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Total:</span>
              <span className="font-medium text-gray-800">₱{serviceTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid ({paymentMethod}):</span>
              <span className="font-medium text-green-600">₱{amountPaid.toFixed(2)}</span>
            </div>
            {changeGiven > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Change Given:</span>
                <span className="font-medium text-gray-800">₱{changeGiven.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-400 text-center mb-8">
            This is a simplified receipt. For official records, please refer to your transaction history.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <PrinterIcon className="h-5 w-5"/> Print Receipt
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="h-5 w-5"/> Share
            </button>
          </div>
          <button
            onClick={handleDone}
            className="w-full mt-4 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors print:hidden"
          >
            Done
          </button>
        </main>
      </div>
    </>
  );
};

export default ReceiptPage;