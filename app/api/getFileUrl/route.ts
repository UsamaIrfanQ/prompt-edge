export const runtime = 'edge';
const BASE_URL = process.env.BASE_URL;


export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the request body to extract the file_id
    const { file_id, user_id } = await req.json();

    // Check if file_id is provided
    if (!file_id || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing file_id in request body' }),
        { status: 400 }
      );
    }

    // Fetch File Id using the file_id (error handling inside this function)
    const file_url = await getFileUrlByFileId(file_id, user_id);

    // If no File Id was retrieved, return an error response
    if (!file_url) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve File Id' }),
        { status: 500 }
      );
    }

    // Prepare full response with File Id
    const fullResponse = {
      file_url: file_url,
    };

    // Return the success response with File Id
    return new Response(JSON.stringify(fullResponse), { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('POST Error:', error);

    // Return a generic error response
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    );
  }
}

// Example function to fetch File Id from Microsoft using the provided file_id
async function getFileUrlByFileId(file_id: string, user_id: string): Promise<string | null> {
  try {
    console.log("File ID:", file_id);

    // Make an API call to retrieve the file URL
    const response = await fetch(`https://qui-dev-ai-pe-functionapp.azurewebsites.net/api/GetURLForFileByFileid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        file_id: file_id,
        user_id: user_id
      }
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Handle the response as plain text
    const file_url = await response.text(); // Using `response.text()` to handle plain text response

    // Return the file URL, or null if it's empty
    return file_url || null;
  } catch (error) {
    // Log the error and return null in case of failure
    console.error('Error fetching File URL:', error);
    return null;
  }
}


function logError(method: string, error: unknown) {
  console.error(`[${method}] Error:`, error);
}
