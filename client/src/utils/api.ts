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

export const getChat = async (chatId: string): Promise<ApiResponse<{ _id: string; messages: Message[] }>> => {
  await delay(600);
  
  const mockMessages: Record<string, Message[]> = {
    c1: [
      { _id: "m1", chatId: "c1", role: "user", content: "What is PostHog?", createdAt: new Date().toISOString() },
      { _id: "m2", chatId: "c1", role: "assistant", content: "PostHog is an **open-source product analytics platform** designed for modern engineering squads.\n\n### Core Capabilities:\n* **Product Analytics**: Funnels, paths, and retention tracking.\n* **Session Replays**: Record user journeys directly.\n* **Feature Flags**: Roll out code safely.", createdAt: new Date().toISOString() }
    ],
    c2: [
      { _id: "m3", chatId: "c2", role: "user", content: "Who are our target users?", createdAt: new Date().toISOString() },
      { _id: "m4", chatId: "c2", role: "assistant", content: "Based on engineering logs, our core users split into three buckets:\n1. **Product Engineers**: Need high-fidelity usage funnels.\n2. **Growth Teams**: Focus heavily on multi-variant split tests.\n3. **Data Teams**: Want direct SQL access via raw events pipelines.", createdAt: new Date().toISOString() }
    ],
    c3: [
      { _id: "m5", chatId: "c3", role: "user", content: "Give me a quick marketing hypothesis framework.", createdAt: new Date().toISOString() },
      { _id: "m6", chatId: "c3", role: "assistant", content: "Here is your baseline framework structure:\n\n`If we [change/feature], then [measurable metric] will increase because [user psychological motivation].`", createdAt: new Date().toISOString() }
    ]
  };

  return {
    success: true,
    data: {
      _id: chatId,
      messages: mockMessages[chatId] || []
    },
    error: null
  };
};

export const sendMessage = async (chatId: string, content: string): Promise<ApiResponse<Message>> => {
  await delay(1500);
  return {
    success: true,
    data: {
      _id: `mock-msg-${Math.random().toString(36).substring(4)}`,
      chatId,
      role: 'assistant',
      content: `This is a mock response to your question: "${content}". This area natively processes **markdown bold text**, lists, and code blocks seamlessly!`,
      createdAt: new Date().toISOString()
    },
    error: null,
  };
};