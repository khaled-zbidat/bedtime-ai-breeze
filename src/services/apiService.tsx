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
const BACKEND_URL = import.meta.env.VITE_OLLAMA_BACKEND_URL;

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

// Function to retry a failed request
async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log(`Retrying request... ${retries} attempts remaining`);
    return retryRequest(fn, retries - 1, delay * 1.5);
  }
}

export const sendChatMessage = async (messages: Message[]): Promise<ChatResponse> => {
  try {
    if (!BACKEND_URL) {
      throw new Error('BACKEND_URL is not configured. Please check your environment variables.');
    }

    console.log('Sending messages to backend:', messages);
    console.log('Using backend URL:', BACKEND_URL);
    
    // Only send the last user message to match the curl format
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }
    
    const requestBody = {
      model: "phi",
      messages: [
        { role: "user", content: lastUserMessage.content }
      ]
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let fullContent = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const data: OllamaResponse = JSON.parse(line);
          if (data.message && data.message.content) {
            fullContent += data.message.content;
          }
          // If done is true, we've reached the end
          if (data.done) {
            break;
          }
        } catch (parseError) {
          console.warn('Failed to parse line:', line, parseError);
        }
      }
    }

    console.log('Assembled full content:', fullContent);

    if (!fullContent) {
      console.error('No content found in response');
      throw new Error('No content received from AI');
    }

    return {
      message: {
        role: 'assistant',
        content: fullContent.trim()
      }
    };
  } catch (error) {
    console.error('Error communicating with backend:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Rethrow with a more user-friendly message
    throw new Error('Failed to communicate with the AI backend. Please try again in a moment.');
  }
};