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

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

// Use import.meta.env instead of process.env for Vite projects
const BACKEND_URL = import.meta.env.VITE_OLLAMA_BACKEND_URL; // || 'http://localhost:11434';

// Function to test the backend connection
const testBackendConnection = async () => {
  try {
    console.log('Testing connection to backend URL:', BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/api/tags`);
    console.log('Backend connection test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

export const sendChatMessage = async (messages: Message[]): Promise<ChatResponse> => {
  try {
    if (!BACKEND_URL) {
      throw new Error('BACKEND_URL is not configured. Please check your environment variables.');
    }

    // Test connection first
    const isConnected = await testBackendConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to Ollama backend. Please check if the service is running and accessible.');
    }

    console.log('Sending messages to backend:', messages);
    console.log('Using backend URL:', BACKEND_URL);
    
    const requestBody = {
      model: "phi",
      messages: messages,
      stream: false
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data: OllamaResponse = await response.json();
    console.log('Parsed response from backend:', data);

    if (!data.message || !data.message.content) {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from server');
    }

    return {
      message: {
        role: 'assistant',
        content: data.message.content.trim()
      }
    };
  } catch (error) {
    console.error('Error communicating with backend:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
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
