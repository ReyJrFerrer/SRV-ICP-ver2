import React from "react";
import {
  MapPinIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ChartPieIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { useProviderBookingManagement } from "@app/hooks/useProviderBookingManagement";
import { useProviderReviews } from "@app/hooks/reviewManagement";

interface ProviderStatsProps {
  className?: string;
  loading?: boolean;
}

const ProviderStatsNextjs: React.FC<ProviderStatsProps> = ({
  className = "",
  loading: externalLoading = false,
}) => {
  const { loading: bookingLoading, error } = useProviderBookingManagement();
  const { loading: reviewsLoading, error: reviewsError } = useProviderReviews();

  const isLoading = externalLoading || bookingLoading || reviewsLoading;
  const hasError = error || reviewsError;

  const stats = React.useMemo(() => {
    return [
      {
        title: "Earnings this month",
        value: "₱ 1200.00",
        icon: <BanknotesIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
      {
        title: "Pending payout",
        value: "₱ 300.00",
        icon: <ClockIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
      {
        title: "Finished Jobs",
        value: "5",
        icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
      {
        title: "Customer Rating",
        value: "4.3",
        icon: <StarIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
      {
        title: "Completion rate",
        value: "75%",
        icon: <ChartBarIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
      {
        title: "Total Income",
        value: "₱ 2,300",
        icon: <ChartPieIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-[#4068F4]",
      },
    ];
  }, []);

  const statPairs = [];
  for (let i = 0; i < stats.length; i += 2) {
    statPairs.push(stats.slice(i, i + 2));
  }

  if (hasError) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">
            Error loading stats. {error || reviewsError}
          </p>
        </div>
      </div>
    );
  }

  const renderCards = (isMobileView: boolean) => {
    // Shared card rendering logic
    const content = (stat: (typeof stats)[0], index: number) => (
      <div
        key={index}
        className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
      >
        <div
          className={`h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full ${stat.bgColor}`}
        >
          {stat.icon}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.title}</p>
        </div>
      </div>
    );

    if (isMobileView) {
      return (
        <div className="flex overflow-x-auto pb-4 gap-4">
          {statPairs.map((pair, index) => (
            <div key={index} className="flex flex-col gap-4 flex-shrink-0 w-64">
              {pair.map((stat, statIndex) => content(stat, statIndex))}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-4 pb-4">
          {stats.map((stat, index) => content(stat, index))}
        </div>
      );
    }
  };

  return (
    <div>
      <button className="location-badge w-full flex items-center bg-[#ffdb6f] px-4 py-4 sm:px-6 sm:py-8 rounded-lg shadow-sm hover:bg-yellow-300 transition-colors">
        <span className="inline-flex items-center justify-center mr-3">
          <MapPinIcon className="h-8 w-8 sm:h-12 sm:w-12 text-black" />
        </span>
        <div className="flex flex-col items-start">
          <span className="text-sm text-black font-extrabold">My Location</span>
          <span className="text-base text-black font-bold">
            San Vicente, Baguio, Cordillera Administrative Region
          </span>
        </div>
      </button>
      <div>
        <h1 className="pt-5 text-4xl font-extrabold text-black mb-1">
          Welcome back, Mary!
        </h1>
        <p className="text-lg font-semibold text-gray-600">
          Manage your services and bookings
        </p>
      </div>

      <h1 className="pt-6 text-4xl font-extrabold text-black mb-6">
        Dashboard
      </h1>
      <div className={className}>
        {/* Mobile View */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="flex overflow-x-auto pb-4 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 flex-shrink-0 w-64"
                >
                  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderCards(true)
          )}
        </div>

        {/* PC View */}
        <div className="hidden md:block">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 pb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4"
                >
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderCards(false)
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderStatsNextjs;
