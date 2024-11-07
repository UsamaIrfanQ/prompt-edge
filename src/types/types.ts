export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  chat_id : string | undefined;
  user_id : string | undefined;
  file_id : string | undefined
}

export enum PILL_VIEWS {
  COMPANY_VIEW = 'COMPANY_VIEW',
  DATA_MIGRATION = 'DATA_MIGRATION',
  BUSINESS_PROCESS = 'BUSINESS_PROCESS',
  INTEGRATION_VIEW = 'INTEGRATION_VIEW',
  APPLICATION_MODULE = 'APPLICATION_MODULE',
  ERP_PLATFORM_VIEW = 'ERP_PLATFORM_VIEW',
}