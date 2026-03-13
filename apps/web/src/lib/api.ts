const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type ApiResponse<T> = { data: T; error?: never } | { data?: never; error: string };

async function request<T>(path: string, options: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const body = await res.json();

    if (!res.ok) {
      return { error: body.error || body.message || 'Something went wrong' };
    }

    return { data: body };
  } catch {
    return { error: 'Unable to connect to the server. Please try again.' };
  }
}

export interface SignupDesignerPayload {
  fullName: string;
  email: string;
  password: string;
  businessName?: string;
  phone?: string;
}

export interface SignupClientPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  projectTypes?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: 'designer' | 'client';
  user: {
    id: string;
    fullName?: string;
    name?: string;
    email: string;
    status?: string;
  };
}

export const api = {
  signupDesigner: (payload: SignupDesignerPayload) =>
    request<{ message: string }>('/api/auth/signup/designer', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  signupClient: (payload: SignupClientPayload) =>
    request<{ message: string }>('/api/auth/signup/client', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loginDesigner: (payload: LoginPayload) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...payload, role: 'designer' }),
    }),

  loginClient: (payload: LoginPayload) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...payload, role: 'client' }),
    }),
};
