import { ChatBody } from '@/types/types';

export const runtime = 'edge';

const BASE_URL = process.env.BASE_URL;

export interface Chat {
  file_id: string;
  user_id: string
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("Hello");
    const { file_id, user_id } = (await req.json()) as Chat;

    if (!file_id) {
      throw new Error('file_id is missing');
    }

    const { history } = await deleteFileByFileId(file_id, user_id);

    const fullResponse = {
      history
    };

    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function deleteFileByFileId(file_id: string, user_id: string): Promise<{ history: Array<{ content: string; role: string }> }> {

  const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/DeletingFile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      file_id: file_id,
      user_id: user_id
    },
  });

  if (!response.ok) {
    throw new Error(`deleteFileByFileId failed with status ${response.status}: ${JSON.stringify(response)}`);
  }

  const jsonResponse = await response.json();

  console.log("jsonResponse", jsonResponse);

  return {
    history: jsonResponse
  };
}





