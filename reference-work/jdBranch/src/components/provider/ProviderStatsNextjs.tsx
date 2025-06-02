import React from 'react';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  StarIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';
import { ServiceProvider } from '../../../assets/types/provider/service-provider';

interface ProviderStatsProps {
  provider: ServiceProvider;
  className?: string;
}

const ProviderStatsNextjs: React.FC<ProviderStatsProps> = ({ provider, className = '' }) => {
  const { earningSummary, totalCompletedJobs, totalReviews, averageRating } = provider;
  
  // Stats data structure
  const stats = [
    {
      title: 'Earnings This Month',
      value: `₱${earningSummary.totalEarningsThisMonth.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Pending Payout',
      value: `₱${earningSummary.pendingPayouts.toFixed(2)}`,
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-500'
    },
    {
      title: 'Completed Jobs',
      value: totalCompletedJobs,
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Customer Rating',
      value: `${averageRating} (${totalReviews})`,
      icon: <StarIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-500'
    },
    {
      title: 'Completion Rate',
      value: `${earningSummary.completionRate}%`,
      icon: <ChartBarIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Total Earnings',
      value: `₱${earningSummary.totalEarnings.toFixed(2)}`,
      icon: <BanknotesIcon className="h-6 w-6 text-white" />,
      borderColor: 'border-teal-500',
      bgColor: 'bg-teal-500'
    }
  ];

  return (
    <div className={`stats-grid ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`stat-card ${stat.borderColor} border-l-4`}
        >
          <div className={`stat-icon ${stat.bgColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderStatsNextjs;
