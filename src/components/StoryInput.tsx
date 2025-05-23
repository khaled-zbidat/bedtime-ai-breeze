
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What kind of story would you like me to create? 📚✨"
          disabled={disabled}
          className="w-full px-4 py-3 pr-12 bg-white border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none transition-colors placeholder-gray-500 text-gray-800"
          rows={2}
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {input.length}/500
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!input.trim() || disabled}
        className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? (
          <Sparkles className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};
