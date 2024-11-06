import { StartChatRequest } from '@/types/Request/Chat';
import { StartConversationResponse } from '@/types/Response/Chat';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';
import { HttpClient } from '@/utils/httpClient';

const chatClient = {
  startConversation: (variables: StartChatRequest) =>
    HttpClient.post<StartConversationResponse>(API_ENDPOINTS.START_CONVERSATION, variables),
};

export default chatClient;
