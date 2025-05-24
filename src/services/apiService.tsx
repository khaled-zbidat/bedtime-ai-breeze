
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
}

interface ChatResponse {
  message: {
    role: 'assistant';
    content: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const sendChatMessage = async (messages: Message[]): Promise<ChatResponse> => {
  console.log('Sending messages to API:', messages);
  
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(({ id, ...msg }) => msg)
      }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
