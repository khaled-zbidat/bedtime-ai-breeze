
import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <Sparkles className="w-4 h-4 text-orange-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Story Magic
            </h1>
          </div>
        </div>
        <p className="text-center text-gray-600 text-sm mt-2">
          Where imagination comes to life! 🌟
        </p>
      </div>
    </header>
  );
};
