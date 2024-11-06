import { ChatBody } from '@/types/types';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const BASE_URL = process.env.BASE_URL;


export interface Chat {
  user_id: string;
  file: File;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const user_id = req.headers.get('user_id');

    if (!user_id || !file) {
      throw new Error('user_id or file is missing');
    }

    // Only call uploadFile, no need to return history
    const { file_path } = await uploadFile(user_id, file);

    // Full response
    const fullResponse = {
      message: "File uploaded successfully",
      file_path,  // Return the file path or any other useful info
    };

    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    console.error('POST Error:', error);
    return new Response('Error uploading file', { status: 500 });
  }
}

async function uploadFile(user_id: string, file: File): Promise<{ file_path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/uploaddoc`, {
    method: 'POST',
    body: formData,
    headers: {
      'user_id': user_id,  // Send user_id in headers
    }
  });

  if (!response.ok) {
    throw new Error(`uploadFile failed with status ${response.status}: ${response.statusText}`);
  }

  const jsonResponse = await response.json();
  console.log("jsonResponse", jsonResponse);

  return {
    file_path: jsonResponse.file_path,
  };
}
