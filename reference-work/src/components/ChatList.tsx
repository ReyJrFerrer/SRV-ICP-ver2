import { StyleSheet, FlatList, View, Text } from 'react-native';
import React from 'react';
import ChatCard, { ChatCardProps } from './ChatCard';

interface ChatListProps {
  chats: Omit<ChatCardProps, 'onPress'>[];
  onChatPress: (userId: string) => void;
}

const ChatList = ({ chats, onChatPress }: ChatListProps) => {
  if (chats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>Your conversations will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={chats}
      keyExtractor={(item) => item.userId}
      renderItem={({ item }) => (
        <ChatCard
          {...item}
          onPress={() => onChatPress(item.userId)}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
