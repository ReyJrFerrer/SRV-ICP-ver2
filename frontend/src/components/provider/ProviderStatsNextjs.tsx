import React from 'react';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  StarIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/solid';
import { useProviderBookingManagement } from '@app/hooks/useProviderBookingManagement';

interface ProviderStatsProps {
  className?: string;
  loading?: boolean;
}

const ProviderStatsNextjs: React.FC<ProviderStatsProps> = ({ 
  className = '', 
  loading: externalLoading = false 
}) => {
  const {
    analytics,
    loading: bookingLoading,
    getRevenueByPeriod,
    providerProfile,
    error,
    isProviderAuthenticated
  } = useProviderBookingManagement();

  // Add debugging
  React.useEffect(() => {
    console.log('ProviderStatsNextjs Debug:', {
      analytics,
      bookingLoading,
      providerProfile: !!providerProfile,
      error,
      isAuthenticated: isProviderAuthenticated()
    });
  }, [analytics, bookingLoading, providerProfile, error, isProviderAuthenticated]);

  // Improved loading logic - don't wait for analytics if there are no bookings
  const isLoading = externalLoading || bookingLoading;
  const hasNoData = !analytics && !bookingLoading && !error;

  // Calculate stats from real data
  const stats = React.useMemo(() => {
    // Default stats for when there's no data or loading
    const defaultStats = [
      {
        title: 'Earnings This Month',
        value: '₱0.00',
        icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-blue-600',
        bgColor: 'bg-blue-600'
      },
      {
        title: 'Pending Payout',
        value: '₱0.00',
        icon: <ClockIcon className="h-6 w-6 text-black" />,
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-400'
      },
      {
        title: 'Completed Jobs',
        value: '0',
        icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-black',
        bgColor: 'bg-black'
      },
      {
        title: 'Completion Rate',
        value: '0%',
        icon: <ChartBarIcon className="h-6 w-6 text-blue-600" />,
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-100'
      },
      {
        title: 'Total Earnings',
        value: '₱0.00',
        icon: <BanknotesIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-blue-600',
        bgColor: 'bg-blue-600'
      }
    ];

    if (!analytics) {
      return defaultStats;
    }

    try {
      const monthlyRevenue = getRevenueByPeriod('month');
      const pendingPayout = analytics.expectedRevenue || 0;
      
      return [
        {
          title: 'Earnings This Month',
          value: `₱${monthlyRevenue.toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
        },
        {
          title: 'Pending Payout',
          value: `₱${pendingPayout.toFixed(2)}`,
          icon: <ClockIcon className="h-6 w-6 text-black" />,
          borderColor: 'border-yellow-400',
          bgColor: 'bg-yellow-400'
        },
        {
          title: 'Completed Jobs',
          value: (analytics.completedBookings || 0).toString(),
          icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-black',
          bgColor: 'bg-black'
        },
        {
          title: 'Completion Rate',
          value: `${(analytics.completionRate || 0).toFixed(0)}%`,
          icon: <ChartBarIcon className="h-6 w-6 text-blue-600" />,
          borderColor: 'border-yellow-400',
          bgColor: 'bg-yellow-100'
        },
        {
          title: 'Total Earnings',
          value: `₱${(analytics.totalRevenue || 0).toFixed(2)}`,
          icon: <BanknotesIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
        }
      ];
    } catch (err) {
      console.error('Error calculating stats:', err);
      return defaultStats;
    }
  }, [analytics, getRevenueByPeriod]);

  // Show error state
  if (error) {
    return (
      <div className={`${className} p-4`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">Error loading stats: {error}</p>
        </div>
      </div>
    );
  }

  // Show loading state only when actually loading
  if (isLoading) {
    return (
      <div className={`stats-grid ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="stat-card border-l-4 border-gray-300 animate-pulse">
            <div className="stat-icon bg-gray-300">
              <div className="h-6 w-6 bg-gray-400 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="col-span-full text-xs text-gray-400 mt-2">
          Debug: Loading={isLoading.toString()}, HasData={!!analytics}, Error={!!error}
        </div>
      )}
    </div>
  );
};

export default ProviderStatsNextjs;
