import React from 'react';
import { Button } from '@/components/ui/button';
import { Cat, Sparkles, Rocket, BookOpen, Crown } from 'lucide-react';

interface SidebarProps {
  onGenerateStory: (prompt: string) => void;
  disabled: boolean;
}

const QUICK_STORIES = [
  {
    icon: Cat,
    label: "Quick Animal Story",
    prompt: "Write a very short 3-line story about a friendly animal adventure. Keep it simple and cute.",
  },
  {
    icon: Rocket,
    label: "Space Adventure",
    prompt: "Write a very short 3-line story about a fun space adventure. Keep it simple and exciting.",
  },
  {
    icon: Crown,
    label: "Fairy Tale",
    prompt: "Write a very short 3-line fairy tale with a happy ending. Keep it simple and magical.",
  },
  {
    icon: BookOpen,
    label: "Bedtime Story",
    prompt: "Write a very short 3-line bedtime story that will help kids sleep. Keep it simple and calming.",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ onGenerateStory, disabled }) => {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-purple-800">Quick Stories</h2>
      </div>
      
      {QUICK_STORIES.map((story, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full justify-start gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          onClick={() => onGenerateStory(story.prompt)}
          disabled={disabled}
        >
          <story.icon className="w-4 h-4" />
          {story.label}
        </Button>
      ))}
    </div>
  );
}; 