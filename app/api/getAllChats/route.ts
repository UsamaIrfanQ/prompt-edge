import { ChatBody } from '@/types/types';

export const runtime = 'edge';

const BASE_URL = process.env.BASE_URL;

interface UserId {
  user_id: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { user_id } = (await req.json()) as UserId;

    if (!user_id) {
      throw new Error('user_id is missing');
    }

    const { history } = await getConversationByChatId(user_id);

    const fullResponse = {
      history
    };

    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function getConversationByChatId(user_id: string): Promise<{ history: Array<{ content: string; role: string }> }> {

  const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/get_sessionids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: user_id,
    })
  });

  if (!response.ok) {
    throw new Error(`getConversationByChatId failed with status ${response.status}: ${response.statusText}`);
  }

  // Parse the JSON response
  const jsonResponse = await response.json();

  console.log("response", jsonResponse);

  // Return an object with 'response' and 'history' fields
  return {
    history: jsonResponse
  };
}





