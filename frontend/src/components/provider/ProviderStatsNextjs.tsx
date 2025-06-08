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
import { useProviderReviews } from '@app/hooks/reviewManagement';

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

  // Add review management hook for getting rating and reviews
  const {
    analytics: reviewAnalytics,
    loading: reviewsLoading,
    error: reviewsError,
    getCurrentUserId
  } = useProviderReviews();

  // Improved loading logic - wait for both analytics and reviews
  const isLoading = externalLoading || bookingLoading || reviewsLoading;
  const hasError = error || reviewsError;

  // Calculate rating data from review analytics
  const ratingData = React.useMemo(() => {
    if (reviewAnalytics) {
      return {
        averageRating: reviewAnalytics.averageRating || 0,
        totalReviews: reviewAnalytics.totalReviews || 0
      };
    }
    return {
      averageRating: 0,
      totalReviews: 0
    };
  }, [reviewAnalytics]);

  // Calculate stats from real data
  const stats = React.useMemo(() => {
    // Default stats for when there's no data or loading
    const defaultStats = [
      {
        title: 'Earnings This Month',
        value: '₱0.00',
        icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-400'
      },
      {
        title: 'Pending Payout',
        value: '₱0.00',
        icon: <ClockIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-yellow-400',
         bgColor: 'bg-yellow-400'
      },
      {
        title: 'Completed Jobs',
        value: '0',
        icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
       borderColor: 'border-yellow-400',
         bgColor: 'bg-yellow-400'
      },
      {
        title: 'Customer Rating',
        value: '0 (0)',
        icon: <StarIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-yellow-400',
         bgColor: 'bg-yellow-400'
      },
      {
        title: 'Completion Rate',
        value: '0%',
        icon: <ChartBarIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-yellow-400',
         bgColor: 'bg-yellow-400'
      },
      {
        title: 'Total Earnings',
        value: '₱0.00',
        icon: <BanknotesIcon className="h-6 w-6 text-white" />,
        borderColor: 'border-yellow-400',
       bgColor: 'bg-yellow-400'
      }
    ];

    if (!analytics) {
      return defaultStats.map(stat => {
        if (stat.title === 'Customer Rating') {
          return {
            ...stat,
            value: `${ratingData.averageRating.toFixed(1)} (${ratingData.totalReviews})`
          };
        }
        return stat;
      });
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
          icon: <ClockIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
        },
        {
          title: 'Completed Jobs',
          value: (analytics.completedBookings || 0).toString(),
          icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
        },
        {
          title: 'Customer Rating',
          value: `${ratingData.averageRating.toFixed(1)} (${ratingData.totalReviews})`,
          icon: <StarIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
        },
        {
          title: 'Completion Rate',
          value: `${(analytics.completionRate || 0).toFixed(0)}%`,
          icon: <ChartBarIcon className="h-6 w-6 text-white" />,
          borderColor: 'border-blue-600',
          bgColor: 'bg-blue-600'
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
  }, [analytics, getRevenueByPeriod, ratingData]);

  // Show error state
  if (hasError) {
    return (
      <div className={`${className} p-4`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Error loading stats: {error || reviewsError}
          </p>
        </div>
      </div>
    );
  }

  // Show loading state only when actually loading
  if (isLoading) {
    return (
      <div className={`stats-grid ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
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
    </div>
  );
};

export default ProviderStatsNextjs;