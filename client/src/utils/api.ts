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
  data?: T;
  error?: { message: string } | null;
};

const BASE_URL = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";
    if (localStorage.getItem("auth-token")) {
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
  }

  return res.json();
}

export function registerUser(name: string, email: string, password: string) {
  return request<{ user: import("../types").CurrentUser }>(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string) {
  return request<{ token: string; user: import("../types").CurrentUser }>(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser() {
  return request<import("../types").CurrentUser>(`${BASE_URL}/auth/me`, {
    method: "GET",
  });
}

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>(`${BASE_URL}/documents`);
};

export const uploadDocument = async (file: File): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem("auth-token") ?? "";

  const res = await fetch(`${BASE_URL}/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "File upload failed.");
  }

  return res.json();
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getChats = (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>(`${BASE_URL}/chats`);
};

export const createChat = (title: string): Promise<ApiResponse<Chat>> => {
  return request<Chat>(`${BASE_URL}/chats`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const getChat = (chatId: string): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
  return request<{ chat: Chat; messages: Message[] }>(`${BASE_URL}/chats/${chatId}`);
};

export const sendMessage = (chatId: string, question: string): Promise<ApiResponse<Message[]>> => {
  return request<Message[]>(`${BASE_URL}/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
};