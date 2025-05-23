
import React from 'react';
import { Sparkles, PenTool } from 'lucide-react';

export const LoadingIndicator = () => {
  return (
    <div className="flex items-start space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
        <PenTool className="w-5 h-5 text-white" />
      </div>

      {/* Loading message */}
      <div className="flex-1 max-w-xs md:max-w-2xl">
        <div className="inline-block p-4 bg-white rounded-2xl rounded-tl-md shadow-lg border border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">
            Story Magic ✨
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
            <span className="text-sm text-gray-700">Creating your magical story...</span>
          </div>
          
          {/* Animated dots */}
          <div className="flex space-x-1 mt-3">
            <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
