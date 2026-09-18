export type User = {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  avatarUrl: string | null;
  address: string | null;
  state: string | null;
  district: string | null;
  municipality: string | null;
  createdAt: string;
};

const globalAny = global as any;

if (!globalAny.mockUsers) {
  globalAny.mockUsers = new Map<string, User>();
}

export const db = {
  users: globalAny.mockUsers as Map<string, User>
};
