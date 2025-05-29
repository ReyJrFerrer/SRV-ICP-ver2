import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ProviderCredential, ProviderVerificationStatus } from '../../assets/types/provider/service-provider';

interface CredentialsDisplayProps {
  verificationStatus: ProviderVerificationStatus;
  identityVerified: boolean;
  backgroundCheckPassed: boolean;
  credentials: ProviderCredential[];
}

const CredentialsDisplay = ({ 
  verificationStatus, 
  identityVerified, 
  backgroundCheckPassed,
  credentials 
}: CredentialsDisplayProps) => {
  const router = useRouter();

  const handleAddCredential = () => {
    Alert.alert('Goes to the Credentials Management Screen');
    // router.push('/service-provider/add-credential');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Credentials & Verification</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCredential}
        >
          <FontAwesome5 name="plus" size={wp('3.5%')} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.verificationBox}>
        <View style={styles.verificationRow}>
          <View style={styles.verificationItem}>
            <FontAwesome5 
              name="user-check" 
              size={wp('4.5%')} 
              color={identityVerified ? "#4CAF50" : "#ccc"} 
              solid={identityVerified}
            />
            <Text style={[
              styles.verificationText,
              identityVerified ? styles.verifiedText : styles.unverifiedText
            ]}>
              Identity {identityVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
          
          <View style={styles.verificationItem}>
            <FontAwesome5 
              name="shield-alt" 
              size={wp('4.5%')} 
              color={backgroundCheckPassed ? "#4CAF50" : "#ccc"} 
              solid={backgroundCheckPassed}
            />
            <Text style={[
              styles.verificationText,
              backgroundCheckPassed ? styles.verifiedText : styles.unverifiedText
            ]}>
              Background {backgroundCheckPassed ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Account Status:</Text>
          <View style={[
            styles.statusBadge,
            verificationStatus === 'VERIFIED' ? styles.verifiedBadge :
            verificationStatus === 'PENDING' ? styles.pendingBadge : styles.rejectedBadge
          ]}>
            <Text style={styles.statusText}>{verificationStatus}</Text>
          </View>
        </View>
      </View>

      <View style={styles.credentialsContainer}>
        {credentials.length === 0 ? (
          <View style={styles.emptyCredentials}>
            <FontAwesome5 name="certificate" size={wp('8%')} color="#ccc" />
            <Text style={styles.emptyText}>No credentials added yet</Text>
            <Text style={styles.emptySubText}>Add your qualifications to increase trust</Text>
          </View>
        ) : (
          credentials.map((credential) => (
            <View key={credential.id} style={styles.credentialItem}>
              <View style={styles.credentialIcon}>
                <FontAwesome5 
                  name={
                    credential.type === 'LICENSE' ? 'id-card' :
                    credential.type === 'CERTIFICATION' ? 'certificate' :
                    credential.type === 'EDUCATION' ? 'graduation-cap' :
                    credential.type === 'AWARD' ? 'trophy' : 'file-alt'
                  } 
                  size={wp('6%')} 
                  color="#4F959D" 
                />
              </View>
              <View style={styles.credentialInfo}>
                <Text style={styles.credentialTitle}>{credential.title}</Text>
                <Text style={styles.credentialAuthority}>{credential.issuingAuthority}</Text>
                <Text style={styles.credentialDate}>
                  Issued: {credential.issueDate.toLocaleDateString()}
                  {credential.expiryDate && ` • Expires: ${credential.expiryDate.toLocaleDateString()}`}
                </Text>
              </View>
              <View style={[
                styles.credentialStatus,
                credential.verificationStatus === 'VERIFIED' ? styles.credentialVerified :
                credential.verificationStatus === 'PENDING' ? styles.credentialPending : styles.credentialRejected
              ]}>
                <FontAwesome5 
                  name={
                    credential.verificationStatus === 'VERIFIED' ? 'check-circle' :
                    credential.verificationStatus === 'PENDING' ? 'clock' : 'times-circle'
                  } 
                  size={wp('4%')} 
                  color="white" 
                  solid 
                />
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default CredentialsDisplay;

const styles = StyleSheet.create({
  container: {
    marginBottom: hp('2%'),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  sectionTitle: {
    fontSize: wp('5.3%'),
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F959D',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  addButtonText: {
    color: 'white',
    marginLeft: wp('1.5%'),
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  verificationBox: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1.5%'),
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    marginLeft: wp('2%'),
    fontSize: wp('3.5%'),
  },
  verifiedText: {
    color: '#4CAF50',
  },
  unverifiedText: {
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginRight: wp('2%'),
  },
  statusBadge: {
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
  },
  verifiedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF8E1',
  },
  rejectedBadge: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  credentialsContainer: {
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyCredentials: {
    alignItems: 'center',
    padding: wp('4%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#666',
    marginTop: hp('1%'),
  },
  emptySubText: {
    fontSize: wp('3.5%'),
    color: '#888',
    textAlign: 'center',
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  credentialIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  credentialAuthority: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('0.3%'),
  },
  credentialDate: {
    fontSize: wp('3%'),
    color: '#999',
    marginTop: hp('0.3%'),
  },
  credentialStatus: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  credentialVerified: {
    backgroundColor: '#4CAF50',
  },
  credentialPending: {
    backgroundColor: '#FF9800',
  },
  credentialRejected: {
    backgroundColor: '#F44336',
  },
});