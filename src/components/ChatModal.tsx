import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatModalProps {
  onClose: () => void;
  bookId?: string;
}

export default function ChatModal({ onClose, bookId }: ChatModalProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, books, chats, messages, addMessage, getChat, createChat } = useApp();

  const book = bookId ? books.find(b => b.id === bookId) : null;
  const currentChat = activeChat ? chats.find(c => c.id === activeChat) : null;
  const chatMessages = currentChat ? messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === currentChat.participants.find(p => p !== user?.id)) ||
    (m.receiverId === user?.id && m.senderId === currentChat.participants.find(p => p !== user?.id))
  ) : [];

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    const ensureChat = async () => {
      if (bookId && book && user && book.postedBy !== user.id) {
        let chat = getChat(bookId, book.postedBy);
        if (!chat) {
          chat = await createChat([user.id, book.postedBy], 'direct', bookId);
        }
        setActiveChat(chat.id);
      }
    };
    ensureChat();
  }, [bookId, book, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentChat || !user) return;

    const receiverId = currentChat.participants.find(p => p !== user.id);
    if (!receiverId) return;

    addMessage({
      senderId: user.id,
      receiverId,
      chatId: currentChat.id,
      content: messageText.trim(),
      senderName: user.name,
      type: 'text'
    });

    setMessageText('');
  };

  const userChats = chats.filter(chat => chat.participants.includes(user?.id || ''));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[600px] max-h-[90vh] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Chats</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {userChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No conversations yet</p>
                <p className="text-sm">Start by messaging someone about a book</p>
              </div>
            ) : (
              userChats.map((chat) => {
                const otherParticipant = chat.participantNames.find((_name, index) => 
                  chat.participants[index] !== user?.id
                );
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeChat === chat.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-medium">
                        {otherParticipant?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{otherParticipant}</p>
                        <p className="text-sm text-gray-500 truncate">{chat.bookTitle}</p>
                        {chat.lastMessage && (
                          <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {currentChat.participantNames.find((_name, index) => 
                    currentChat.participants[index] !== user?.id
                  )}
                </h3>
                <p className="text-sm text-gray-500">{currentChat.bookTitle}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}