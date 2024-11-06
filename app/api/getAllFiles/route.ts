import { ChatBody } from '@/types/types';

export const runtime = 'edge';

const BASE_URL = process.env.BASE_URL;

interface userId {
  user_id: string
}

// Modify the return type to reflect the actual structure of the data
interface File {
  user_id: string;
  file_id: string;
  file_name: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("Hello");
    const { user_id } = (await req.json()) as userId;

    if (!user_id) {
      throw new Error('user_id is missing');
    }

    const files = await getAllFilesByUserId(user_id);
    console.log("1", JSON.stringify(files), user_id);


    const fullResponse = {
      files
    };
    console.log("JSON.stringify(fullResponse)", JSON.stringify(fullResponse));


    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error', { status: 500 });
  }
}



async function getAllFilesByUserId(user_id: string): Promise<File[]> {
  try {
    const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/GetDocByUserId`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user_id': user_id
      }
    });

    // Log the status to see if it successfully reaches the API
    console.log('Response status:', response.status);

    // Check for non-200 response codes
    if (!response.ok) {
      throw new Error(`getAllFilesByUserId failed with status ${response.status}: ${response.statusText}`);
    }

    // Log raw response for debugging
    const responseBody = await response.text(); // Parse as text to check what the server returned
    console.log('Raw response body:', responseBody);

    // Try parsing JSON only if it's expected
    const files: File[] = JSON.parse(responseBody); // Manually parse JSON after logging raw response
    console.log('Parsed response:', files);

    return files;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}



