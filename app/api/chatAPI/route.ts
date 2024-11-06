import { StartChatRequest } from '@/types/Request/Chat';
import { StartConversationResponse } from '@/types/Response/Chat';

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  try {
    const { id, user_id, user_input } = (await req.json()) as StartChatRequest;

    const response = await AzureOpenAIStream(user_input, id, user_id);

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function AzureOpenAIStream(
  user_input: string,
  id?: string,
  user_id?: string,
): Promise<StartConversationResponse> {
  const response = await fetch(
    `https://qui-dev-ai-pe-fa-test.azurewebsites.net/api/conversationStart`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        user_id: user_id ?? 'user_id',
      },
      body: JSON.stringify({
        user_id: user_id,
        id: id,
        user_input,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Azure OpenAI API request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  // Parse the JSON response
  const jsonResponse: StartConversationResponse = await response.json();

  console.log('jsonResponse', jsonResponse);

  // Return an object with 'response' and 'history' fields
  return jsonResponse;
}
