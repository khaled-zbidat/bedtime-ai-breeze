
import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/MessageBubble';
import { StoryInput } from '@/components/StoryInput';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Header } from '@/components/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { sendChatMessage } from '@/services/apiService';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
}

type DisplayMessage = Omit<Message, 'role'> & {
  role: 'user' | 'assistant';
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'You are a creative children\'s story writer. Create engaging, age-appropriate stories based on the prompts. Keep stories fun, educational, and suitable for children aged 4-12.',
      id: 'system-1'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput,
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage([...messages, userMessage]);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message.content,
        id: `assistant-${Date.now()}`
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Oops! Something went wrong. Let me try again to create your story.',
        id: `error-${Date.now()}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const displayMessages = messages.filter(msg => msg.role !== 'system') as DisplayMessage[];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-100 via-blue-50 to-orange-100">
        <AppSidebar onTemplateSelect={handleTemplateSelect} />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen">
            <Header />
            
            <div className="md:hidden p-4">
              <SidebarTrigger className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl" />
            </div>
            
            <div className="container mx-auto px-4 pb-24">
              <div className="max-w-4xl mx-auto">
                {displayMessages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                      <h2 className="text-3xl font-bold text-purple-800 mb-4">
                        ✨ Let's Create Amazing Stories! ✨
                      </h2>
                      <p className="text-lg text-gray-700 mb-6">
                        Choose a template from the sidebar or tell me what kind of story you'd like!
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
                        <div className="bg-blue-100 rounded-xl p-4">
                          <strong>Try the sidebar:</strong> Click on any story template to get started instantly
                        </div>
                        <div className="bg-green-100 rounded-xl p-4">
                          <strong>Or customize:</strong> "Create a story about friendship and adventure"
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {displayMessages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {isLoading && <LoadingIndicator />}
                  <div ref={chatEndRef} />
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 p-4">
              <div className="container mx-auto max-w-4xl">
                <StoryInput onSendMessage={handleSendMessage} disabled={isLoading} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
