
import React from 'react';
import { User, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-orange-400 to-pink-500'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-xs md:max-w-2xl ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-md'
            : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
        }`}>
          <div className={`text-xs font-medium mb-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {isUser ? 'You' : 'Story Magic ✨'}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};
