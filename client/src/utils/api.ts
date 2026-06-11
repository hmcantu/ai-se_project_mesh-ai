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