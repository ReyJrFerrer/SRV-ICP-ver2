import React from 'react';
import { ProviderOrder as ProviderOrderType } from '../../../assets/types/provider/provider-order';
import { Order } from '../../../assets/types/order/order';
import { 
    MapPinIcon, 
    CalendarIcon, 
    ClockIcon, 
    UserIcon, 
    CurrencyDollarIcon,
    PhoneIcon,
    InformationCircleIcon 
} from '@heroicons/react/24/outline';

interface ProviderBookingItemCardProps {
  booking: ProviderOrderType;
}

const calculateDuration = (start: string | Date, end: string | Date): string => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const durationMs = endTime.getTime() - startTime.getTime();

  if (isNaN(durationMs) || durationMs < 0) return 'N/A';
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let durationStr = '';
  if (hours > 0) durationStr += `${hours} hr${hours > 1 ? 's' : ''} `;
  if (minutes > 0) durationStr += `${minutes} min${minutes > 1 ? 's' : ''}`;
  
  return durationStr.trim() || (hours === 0 && minutes === 0 ? "Short duration" : "N/A");
};

const ProviderBookingItemCard: React.FC<ProviderBookingItemCardProps> = ({ booking }) => {
  const orderDetails: Order | undefined = booking.order; 
  
  const clientName = booking.clientName;
  const clientContact = booking.clientContact;
  const serviceTitle = booking.serviceTitle;
  const scheduledStartTime = new Date(booking.scheduledStartTime);
  const scheduledEndTime = booking.scheduledEndTime ? new Date(booking.scheduledEndTime) : null;
  
  const duration = scheduledEndTime ? calculateDuration(scheduledStartTime, scheduledEndTime) : orderDetails?.schedule?.actualDuration ? `${orderDetails.schedule.actualDuration} mins` : 'N/A';

  const price = booking.finalPrice && booking.finalPrice > 0 ? booking.finalPrice : booking.quotedPrice;
  const priceLabel = booking.finalPrice && booking.finalPrice > 0 && booking.finalPrice !== booking.quotedPrice 
    ? "Final Price" 
    : "Quoted Price";

  const locationAddress = booking.location?.address || orderDetails?.location?.address || "Location not specified";
  const status = booking.status || orderDetails?.status;

  const handleAccept = () => alert(`Accept booking: ${booking.id}`);
  const handleReject = () => alert(`Reject booking: ${booking.id}`);
  const handleContactClient = () => alert(`Contact client: ${clientContact || 'Contact info not available'}`);
  const handleMarkAsCompleted = () => alert(`Mark as completed: ${booking.id}`);
  const handleStartService = () => alert(`Start service: ${booking.id}`);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full"> {/* Added flex flex-col h-full */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-semibold text-blue-700 group-hover:text-blue-800 transition-colors pr-2 flex-grow break-words">
            {serviceTitle}
        </h3>
        <span 
            className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0
            ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
            ${status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
            ${status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
            ${status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
            ${status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-700' : ''}
            ${status === 'DISPUTED' ? 'bg-orange-100 text-orange-700' : ''}
            `}
        >
          {status?.replace('_', ' ') || 'N/A'}
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-700 flex-grow"> 
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>Client: <span className="font-medium">{clientName}</span></span>
        </div>
        {clientContact && (
          <div className="flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>Contact: <span className="font-medium">{clientContact}</span></span>
          </div>
        )}
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>Date: <span className="font-medium">{scheduledStartTime.toLocaleDateString()}</span></span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>Time: <span className="font-medium">{scheduledStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
        </div>
        {duration !== 'N/A' && (
             <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>Duration: <span className="font-medium">{duration}</span></span>
            </div>
        )}
        <div className="flex items-start"> 
          <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="break-words">Location: <span className="font-medium">{locationAddress}</span></span>
        </div>
        {price !== undefined && (
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{priceLabel}: <span className="font-medium text-green-600">₱{price.toFixed(2)}</span></span>
          </div>
        )}
        {orderDetails?.completion?.notes && (
            <div className="flex items-start mt-1 pt-1 border-t border-gray-100">
                <InformationCircleIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs italic break-words">Notes: <span className="font-medium not-italic">{orderDetails.completion.notes}</span></span>
            </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-gray-200 flex flex-wrap gap-2 justify-end"> {/* Added mt-auto */}
        {status === 'PENDING' && (
          <>
            <button onClick={handleReject} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Reject</button>
            <button onClick={handleAccept} className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors">Accept</button>
          </>
        )}
        {status === 'CONFIRMED' && (
            <>
                <button onClick={handleContactClient} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">Contact Client</button>
                <button onClick={handleStartService} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors">Start Service</button>
            </>
        )}
         {status === 'IN_PROGRESS' && (
             <>
                <button onClick={handleContactClient} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">Contact Client</button>
                <button onClick={handleMarkAsCompleted} className="px-3 py-1.5 text-xs font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md transition-colors">Mark Completed</button>
             </>
        )}
      </div>
    </div>
  );
};

export default ProviderBookingItemCard;