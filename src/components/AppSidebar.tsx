
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BookOpen, Sparkles, Heart, Rocket, Crown, Star, History, Settings, Palette } from 'lucide-react';

const storyTemplates = [
  {
    title: "Adventure Quest",
    prompt: "Tell me a story about a brave child who goes on an exciting adventure to find a magical treasure",
    icon: Rocket,
    color: "text-blue-500"
  },
  {
    title: "Friendship Tale",
    prompt: "Create a heartwarming story about making new friends and learning about kindness",
    icon: Heart,
    color: "text-pink-500"
  },
  {
    title: "Magical Kingdom",
    prompt: "Write a story about a child who discovers a magical kingdom with talking animals",
    icon: Crown,
    color: "text-purple-500"
  },
  {
    title: "Space Explorer",
    prompt: "Tell me a story about a young astronaut exploring colorful planets and meeting friendly aliens",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    title: "Animal Friends",
    prompt: "Create a story about forest animals working together to solve a problem",
    icon: Sparkles,
    color: "text-green-500"
  }
];

const menuItems = [
  {
    title: "Story History",
    icon: History,
    description: "View past stories"
  },
  {
    title: "Themes",
    icon: Palette,
    description: "Change app theme"
  },
  {
    title: "Settings",
    icon: Settings,
    description: "App preferences"
  }
];

interface AppSidebarProps {
  onTemplateSelect: (prompt: string) => void;
}

export function AppSidebar({ onTemplateSelect }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-white/20">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-purple-800">Story Magic</h2>
            <p className="text-sm text-gray-600">AI Story Generator</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-700 font-semibold">
            ✨ Story Templates
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storyTemplates.map((template) => (
                <SidebarMenuItem key={template.title}>
                  <SidebarMenuButton
                    onClick={() => onTemplateSelect(template.prompt)}
                    className="w-full p-3 hover:bg-purple-50 rounded-xl transition-colors group"
                  >
                    <template.icon className={`w-5 h-5 ${template.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{template.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {template.prompt.slice(0, 50)}...
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-700 font-semibold">
            🛠️ Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="w-full p-3 hover:bg-purple-50 rounded-xl transition-colors">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Pro Tip</span>
          </div>
          <p className="text-xs text-purple-700">
            Try being specific about characters, settings, and emotions for better stories!
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
