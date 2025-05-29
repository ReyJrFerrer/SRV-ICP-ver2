import React from 'react';
import styles from './ClientChat.module.css';

// Mock chat data
const mockChats = [
  {
    id: 1,
    name: 'Quick Clean Pro',
    lastMessage: 'Thank you for choosing our service!',
    timestamp: '2:30 PM',
    unreadCount: 2,
    avatar: '🧹',
    online: true,
  },
  {
    id: 2,
    name: 'Fix-It Frank',
    lastMessage: 'I can start the plumbing work tomorrow',
    timestamp: '11:45 AM',
    unreadCount: 0,
    avatar: '🔧',
    online: false,
  },
  {
    id: 3,
    name: 'Garden Masters',
    lastMessage: 'Here are some photos of the completed work',
    timestamp: 'Yesterday',
    unreadCount: 1,
    avatar: '🌿',
    online: true,
  },
];

export default function ClientChat() {
  return (
    <div className={styles.container}>
      {/* Chat Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Messages</h2>
        <button className={styles.searchButton}>
          <span className={styles.searchIcon}>🔍</span>
        </button>
      </div>

      {/* Chat List */}
      <div className={styles.chatList}>
        {mockChats.map((chat) => (
          <div key={chat.id} className={styles.chatItem}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <span className={styles.avatarEmoji}>{chat.avatar}</span>
              </div>
              {chat.online && <div className={styles.onlineIndicator} />}
            </div>

            <div className={styles.chatContent}>
              <div className={styles.chatHeader}>
                <span className={styles.chatName}>{chat.name}</span>
                <span className={styles.timestamp}>{chat.timestamp}</span>
              </div>
              <div className={styles.lastMessageContainer}>
                <span className={styles.lastMessage}>{chat.lastMessage}</span>
                {chat.unreadCount > 0 && (
                  <div className={styles.unreadBadge}>
                    <span className={styles.unreadCount}>{chat.unreadCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockChats.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💬</span>
          <h3 className={styles.emptyTitle}>No messages yet</h3>
          <p className={styles.emptyText}>
            Start a conversation with a service provider to see your messages here.
          </p>
        </div>
      )}
    </div>
  );
}
