export interface StartConversationResponse {
  input?: string;
  id?: string;
  user_id?: string;
  response?: ViewDataResponse[];
}

export interface ChatViewData {
  response: ViewDataResponse[];
}

export interface ViewDataResponse {
  id: string;
  user_id: string;
  description: string;
  viewType: string;
  title: string;
  content: string;
  industry: string;
  SIC_Code: string;
  type_of_manufacturing: string;
  headquarters_address: string;
  employees: string;
  corporate_structure: string;
  subsidiaries_and_brands: string[];
  fields?: ViewDataProcessField[];
  url?: string;
}

export interface ViewDataProcessField {
  type: string;
  label: string;
  description?: string;
  value?: string;
  id: string;
  isChecked: string; // Changed to boolean
  inputPlaceHolders?: string; // Added this property
  group?: string; // Added this property
}