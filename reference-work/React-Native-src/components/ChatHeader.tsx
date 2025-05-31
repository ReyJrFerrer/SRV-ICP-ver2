import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ChatHeaderProps {
  onSearchPress?: () => void;
}

const ChatHeader = ({ onSearchPress }: ChatHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <TouchableOpacity onPress={onSearchPress} style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
});
