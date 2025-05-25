export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChatRequest {
  message: string;
  post: any;
}

export interface ChatResponse {
  chat_id: string;
  bot_user_id: string;
  message: {
    user: {
      id: string;
      first_name: string;
      email: string;
      language_code: string;
    };
    message_id: string;
    text: string;
  };
  bot: {
    text: string;
    message_id: string;
  };
  hasPost: false;
  post: {
    hashtags: string[];
    content: string;
    title: string;
  };
}

export interface GenerateAyrshareTokenResponse {
    status: string;
    title: string;
    token: string;
    url: string;
    emailSent: boolean;
    expiresIn: string;
}
