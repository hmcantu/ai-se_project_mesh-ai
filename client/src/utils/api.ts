export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDocuments = async (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  await delay(700);
  return {
    success: true,
    data: [
      {
        _id: "1",
        title: "Code Review Guidelines",
        fileName: "code-review-guidelines.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "React Best Practices",
        fileName: "react-best-practices.pdf",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ],
    error: null,
  };
};

// Mock function to load existing conversations
export const getChats = async (): Promise<ApiResponse<Chat[]>> => {
  await delay(500);
  return {
    success: true,
    data: [
      {
        _id: "c1",
        title: "What is posthog",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "c2",
        title: "Who are our users",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "c3",
        title: "Marketing Hypothesis",
        userId: "u1",
        createdAt: new Date().toISOString(),
      },
    ],
    error: null,
  };
};

// Mock function to create a new conversation thread
export const createChat = async (title: string): Promise<ApiResponse<Chat>> => {
  await delay(300);
  return {
    success: true,
    data: {
      _id: `mock-id-${Math.random().toString(36).substring(4)}`,
      title,
      userId: "u1",
      createdAt: new Date().toISOString(),
    },
    error: null,
  };
};