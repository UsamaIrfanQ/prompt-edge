import { ChatBody } from '@/types/types';

export const runtime = 'edge';

const BASE_URL = process.env.BASE_URL;

export interface Chat {
  chat_id: string;
  user_id: string
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("Hello");
    const { chat_id, user_id } = (await req.json()) as Chat;

    if (!chat_id) {
      throw new Error('chat_id is missing');
    }

    const { history } = await getConversationByChatId(chat_id, user_id);

    const fullResponse = {
      history
    };

    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function getConversationByChatId(chat_id: string, user_id : string): Promise<{ history: Array<{ content: string; role: string }> }> {

  const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/GetSpecificChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chat_id,
      user_id : user_id
    })
  });

  if (!response.ok) {
    throw new Error(`getConversationByChatId failed with status ${response.status}: ${response.statusText}`);
  }

  // Parse the JSON response
  const jsonResponse = await response.json();

  console.log("jsonResponse", jsonResponse);

  // Return an object with 'response' and 'history' fields
  return {
    history: jsonResponse
  };
}





