const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5217/api";

async function request<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; phone?: string; password: string; allergies?: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: (id: number) => request<any>(`/auth/profile/${id}`),

  // Medicines
  getMedicines: (search?: string, categoryId?: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId.toString());
    return request<Medicine[]>(`/medicines?${params.toString()}`);
  },
  getMedicine: (id: number) => request<any>(`/medicines/${id}`),
  getCategories: () => request<Category[]>("/medicines/categories"),

  // Interactions
  checkInteractions: (medicineIds: number[]) =>
    request<Interaction[]>("/interactions/check", { method: "POST", body: JSON.stringify({ medicineIds }) }),

  // User Medicines
  getUserMedicines: (userId: number, familyMemberId?: number) => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (familyMemberId) params.set("familyMemberId", familyMemberId.toString());
    return request<UserMedicine[]>(`/usermedicines?${params.toString()}`);
  },
  addUserMedicine: (data: { userId: number; familyMemberId?: number; medicineId: number; dosage?: string; timing?: string }) =>
    request<any>("/usermedicines", { method: "POST", body: JSON.stringify(data) }),
  removeUserMedicine: (id: number) =>
    request<any>(`/usermedicines/${id}`, { method: "DELETE" }),

  // Family
  getFamily: (userId: number) => request<FamilyMember[]>(`/family?userId=${userId}`),
  addFamilyMember: (data: { userId: number; name: string; relation?: string; age?: number }) =>
    request<any>("/family", { method: "POST", body: JSON.stringify(data) }),
  deleteFamilyMember: (id: number) =>
    request<any>(`/family/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboardStats: (userId: number) => request<DashboardStats>(`/dashboard/stats?userId=${userId}`),

  // Demo
  seedDemo: () => request<AuthResponse>("/demo/seed", { method: "POST" }),

  // Side Effects
  reportSideEffect: (data: { userId: number; medicineId: number; description?: string; severity?: string }) =>
    request<any>("/sideeffects", { method: "POST", body: JSON.stringify(data) }),
};

// Types
export interface Medicine {
  id: number;
  name: string;
  genericName?: string;
  categoryId: number;
  categoryName?: string;
  form?: string;
  manufacturer?: string;
  purpose?: string;
  sideEffects?: string;
  dosage?: string;
  priceRange?: string;
}

export interface Interaction {
  medicine1Id: number;
  medicine1Name: string;
  medicine2Id: number;
  medicine2Name: string;
  severity: string;
  description?: string;
  advice?: string;
}

export interface UserMedicine {
  id: number;
  userId: number;
  familyMemberId?: number;
  familyMemberName?: string;
  medicineId: number;
  medicineName: string;
  medicineForm?: string;
  dosage?: string;
  timing?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface FamilyMember {
  id: number;
  userId: number;
  name: string;
  relation?: string;
  age?: number;
  medicineCount: number;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  medicineCount: number;
}

export interface DashboardStats {
  totalMedicines: number;
  activeWarnings: number;
  familyMembers: number;
  totalInteractions: number;
}

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

// Auth helpers
export function saveAuth(auth: AuthResponse) {
  localStorage.setItem("pillwise_user", JSON.stringify(auth));
}

export function getAuth(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("pillwise_user");
  return data ? JSON.parse(data) : null;
}

export function clearAuth() {
  localStorage.removeItem("pillwise_user");
}
