export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  chat_id : string | undefined;
  user_id : string | undefined;
  file_id : string | undefined
}
