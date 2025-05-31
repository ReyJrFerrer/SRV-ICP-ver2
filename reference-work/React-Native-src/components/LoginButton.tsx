import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';

interface LoginButtonProps {
  onPress: () => void;
  title: string;
}

const LoginButton = ({ onPress, title }: LoginButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginButton;
