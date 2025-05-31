import { StyleSheet, View, SafeAreaView, StatusBar, Alert } from 'react-native';
import React from 'react';
import ChatHeader from '../../../../components/ChatHeader';
import ChatList from '../../../../components/ChatList';
import { chatData } from '../../../../../data/chatData';

const ChatHome = () => {
  // Handle tapping on a chat
  const handleChatPress = (userId: string) => {
    Alert.alert('Chat Selected', `Opening chat with user ID: ${userId}`);
    // In a real app, you would navigate to the chat detail screen
    // navigation.navigate('ChatDetail', { userId });
  };

  // Handle search button press
  const handleSearchPress = () => {
    Alert.alert('Search', 'Search functionality would open here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ChatHeader onSearchPress={handleSearchPress} />
      <ChatList 
        chats={chatData} 
        onChatPress={handleChatPress} 
      />
    </SafeAreaView>
  );
};

export default ChatHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});