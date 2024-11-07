import { StartChatRequest } from '@/types/Request/Chat';
import { StartConversationResponse } from '@/types/Response/Chat';
import { API_ENDPOINTS } from '@/utils/apiEndpoints';
import { HttpClient } from '@/utils/httpClient';
import { AxiosRequestConfig } from 'axios';

const chatClient = {
  startConversation: (
    variables: StartChatRequest,
    headers?: AxiosRequestConfig<StartConversationResponse>,
  ) =>
    HttpClient.post<StartConversationResponse>(
      API_ENDPOINTS.START_CONVERSATION,
      variables,
      headers,
    ),
};

export default chatClient;
