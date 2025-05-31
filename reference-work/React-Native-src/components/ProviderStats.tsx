import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIconContainer}>
        <FontAwesome5 name={icon} size={wp('6%')} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );
};

interface ProviderStatsProps {
  totalEarnings: number;
  totalEarningsThisMonth: number;
  pendingPayouts: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  totalCompletedJobs: number;
}

const ProviderStats = ({ 
  totalEarnings, 
  totalEarningsThisMonth, 
  pendingPayouts, 
  completionRate, 
  averageRating,
  totalReviews,
  totalCompletedJobs
}: ProviderStatsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dashboard</Text>
      
      <View style={styles.statsRow}>
        <StatCard 
          title="Earnings This Month" 
          value={`₱${totalEarningsThisMonth.toFixed(2)}`} 
          icon="dollar-sign" 
          color="#4CAF50" 
        />
        <StatCard 
          title="Pending Payout" 
          value={`₱${pendingPayouts.toFixed(2)}`} 
          icon="clock" 
          color="#FF9800" 
        />
      </View>
      
      <View style={styles.statsRow}>
        <StatCard 
          title="Completed Jobs" 
          value={totalCompletedJobs} 
          icon="check-circle" 
          color="#2196F3" 
        />
        <StatCard 
          title="Customer Rating" 
          value={`${averageRating} (${totalReviews})`} 
          icon="star" 
          color="#FFC107" 
        />
      </View>
      
      <View style={styles.statsRow}>
        <StatCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          icon="chart-line" 
          color="#9C27B0" 
        />
        <StatCard 
          title="Total Earnings" 
          value={`₱${totalEarnings.toFixed(2)}`} 
          icon="money-bill-wave" 
          color="#4F959D" 
        />
      </View>
    </View>
  );
};

export default ProviderStats;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('5.3%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: wp('1%'),
  },
  statIconContainer: {
    marginRight: wp('3%'),
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: wp('3%'),
    color: '#666',
  },
});