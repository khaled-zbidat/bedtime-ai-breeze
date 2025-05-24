import React from 'react';
import { Button } from '@/components/ui/button';
import { Cat, Sparkles, Rocket, BookOpen, Crown, Brain } from 'lucide-react';

interface SidebarProps {
  onGenerateStory: (prompt: string) => void;
  disabled: boolean;
}

const QUICK_STORIES = [
  {
    icon: Cat,
    label: "Quick Animal Story",
    prompt: "Write a very short 3-line story about a friendly animal adventure. Keep it simple and cute.",
    iconColor: "text-orange-500",
  },
  {
    icon: Rocket,
    label: "Space Adventure",
    prompt: "Write a very short 3-line story about a fun space adventure. Keep it simple and exciting.",
    iconColor: "text-blue-500",
  },
  {
    icon: Crown,
    label: "Fairy Tale",
    prompt: "Write a very short 3-line fairy tale with a happy ending. Keep it simple and magical.",
    iconColor: "text-yellow-500",
  },
  {
    icon: BookOpen,
    label: "Bedtime Story",
    prompt: "Write a very short 3-line bedtime story that will help kids sleep. Keep it simple and calming.",
    iconColor: "text-purple-500",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ onGenerateStory, disabled }) => {
  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-purple-100 p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold text-purple-800">Quick Stories</h2>
        </div>

        {QUICK_STORIES.map((story, index) => {
          const Icon = story.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              onClick={() => onGenerateStory(story.prompt)}
              disabled={disabled}
            >
              <Icon className={`w-4 h-4 ${story.iconColor}`} />
              {story.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <Brain className="w-12 h-12 text-purple-300 opacity-60" />
      </div>
    </div>
  );
};
