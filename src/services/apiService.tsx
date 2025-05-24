interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
}

// Use import.meta.env instead of process.env for Vite projects
const BACKEND_URL = import.meta.env.VITE_OLLAMA_BACKEND_URL; // || 'http://localhost:11434';

export const sendChatMessage = async (messages: Message[]): Promise<ChatResponse> => {
  try {
    console.log('Sending messages to backend:', messages);
    
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "phi",
        messages: messages,
        stream: false // Disable streaming for now to ensure basic functionality
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response as text first to handle potential JSON parsing errors
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response as JSON:', text);
      throw new Error('Invalid JSON response from server');
    }

    // Log the raw response for debugging
    console.log('Raw response from backend:', data);
    
    // Handle Ollama's response format
    return {
      message: {
        role: 'assistant',
        content: data.message?.content || data.response || 'Sorry, I could not generate a response.'
      }
    };
  } catch (error) {
    console.error('Error communicating with backend:', error);
    
    // For development/demo purposes, return a mock response
    if (import.meta.env.DEV) {
      console.log('Using mock response for development');
      return {
        message: {
          role: 'assistant',
          content: `Once upon a time, there was a magical adventure waiting to unfold! 🌟\n\n(Note: This is a demo response. To connect to your Ollama backend, please set the VITE_OLLAMA_BACKEND_URL environment variable to your Ollama server URL.)\n\nYour story prompt was: "${messages[messages.length - 1]?.content}"\n\nI would love to create an amazing story for you once connected to the AI backend!`
        }
      };
    }
    
    throw error;
  }
};
