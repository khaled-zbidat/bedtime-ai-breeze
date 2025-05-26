import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/MessageBubble';
import { StoryInput } from '@/components/StoryInput';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { sendChatMessage } from '@/services/apiService';

// Define a more comprehensive Message interface that works with both components
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
}

// Interface for display messages (excludes system messages)
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

  // Filter out system messages for display
  const displayMessages = messages.filter(msg => msg.role !== 'system') as DisplayMessage[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-orange-100 flex">
      <Sidebar onGenerateStory={handleSendMessage} disabled={isLoading} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 container mx-auto px-4 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Welcome message when no stories yet */}
            {/* {displayMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">
                    ✨ Let's Create Amazing Stories! ✨
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Tell me what kind of story you'd like, or use the quick story buttons on the left!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-sm">
                    <div className="bg-blue-100 rounded-xl p-4">
                      <strong>Try saying:</strong> "Tell me a story about a brave little mouse"
                    </div>
                    <div className="bg-green-100 rounded-xl p-4">
                      <strong>Or:</strong> "Create a story about friendship and adventure"
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Chat messages */}
            <div className="space-y-4 mb-6">
              {displayMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isLoading && <LoadingIndicator />}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>

        {/* Fixed input at bottom */}
        <div className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 p-4">
          <div className="container mx-auto max-w-4xl">
            <StoryInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
