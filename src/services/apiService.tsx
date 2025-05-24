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
      stream: false  // This should disable streaming
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    // Use retry mechanism for the fetch request
    const response = await retryRequest(async () => {
      const resp = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Error response:', {
          status: resp.status,
          statusText: resp.statusText,
          headers: Object.fromEntries(resp.headers.entries()),
          body: errorText
        });
        throw new Error(`HTTP error! status: ${resp.status}, body: ${errorText}`);
      }

      return resp;
    });

    // Check if response is streaming (multiple JSON objects)
    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    // Parse streaming response if it contains multiple JSON objects
    const lines = responseText.trim().split('\n').filter(line => line.trim());
    let fullContent = '';
    
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

    console.log('Assembled full content:', fullContent);

    if (!fullContent) {
      console.error('No content found in response:', responseText);
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