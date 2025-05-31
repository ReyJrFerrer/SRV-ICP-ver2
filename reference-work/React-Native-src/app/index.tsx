import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import Auth from './auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Static credentials
    const customerUsername = 'cust123';
    const customerPassword = 'pass123';

    const providerUsername = 'prov123';
    const providerPassword = 'pass123';

    if (username === customerUsername && password === customerPassword) {
      router.replace('/customer');  // Navigate to customer app
    } else if (username === providerUsername && password === providerPassword) {
      router.replace('/service-provider');  // Navigate to provider app
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }

  };

  const handleCustomerLogin = () => {
    router.replace('/customer');
  }

  const handleServiceProviderLogin = () => {
    router.replace('/service-provider')
  }



  return (
    // <Auth/>
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <LoginButton title="Login" onPress={handleLogin} />
      <LoginButton title = "Test Customer Login" onPress={handleCustomerLogin}/>
      <LoginButton title = "Test SP Login" onPress={handleServiceProviderLogin}/>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  
});