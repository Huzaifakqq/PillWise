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
  register: (data: RegisterDto) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: LoginDto) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: (id: number) => request<Medicine>(`/auth/profile/${id}`),

  // Medicines
  getMedicines: (search?: string, categoryId?: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId.toString());
    return request<Medicine[]>(`/medicines?${params.toString()}`);
  },
  getMedicine: (id: number) =>
    request<{ medicine: Medicine; interactions: InteractionDetail[] }>(`/medicines/${id}`),
  getCategories: () => request<Category[]>("/medicines/categories"),
  getAlternatives: (id: number) => request<Medicine[]>(`/medicines/${id}/alternatives`),

  // Interactions
  checkInteractions: (medicineIds: number[]) =>
    request<Interaction[]>("/interactions/check", {
      method: "POST",
      body: JSON.stringify({ medicineIds } satisfies InteractionCheckDto),
    }),

  // User Medicines
  getUserMedicines: (userId: number, familyMemberId?: number) => {
    const params = new URLSearchParams({ userId: userId.toString() });
    if (familyMemberId) params.set("familyMemberId", familyMemberId.toString());
    return request<UserMedicine[]>(`/usermedicines?${params.toString()}`);
  },
  addUserMedicine: (data: AddUserMedicineDto) =>
    request<UserMedicine>("/usermedicines", { method: "POST", body: JSON.stringify(data) }),
  removeUserMedicine: (id: number) =>
    request<void>(`/usermedicines/${id}`, { method: "DELETE" }),

  // Family
  getFamily: (userId: number) => request<FamilyMember[]>(`/family?userId=${userId}`),
  addFamilyMember: (data: AddFamilyMemberDto) =>
    request<FamilyMember>("/family", { method: "POST", body: JSON.stringify(data) }),
  deleteFamilyMember: (id: number) =>
    request<void>(`/family/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboardStats: (userId: number) => request<DashboardStats>(`/dashboard/stats?userId=${userId}`),

  // Demo
  seedDemo: () => request<AuthResponse>("/demo/seed", { method: "POST" }),

  // Side Effects
  reportSideEffect: (data: SideEffectDto) =>
    request<void>("/sideeffects", { method: "POST", body: JSON.stringify(data) }),
};

// Types (generated from backend swagger.json + DTOs — see lib/api-types.ts)
import type {
  MedicineDto as Medicine,
  InteractionResultDto as Interaction,
  UserMedicineDto as UserMedicine,
  FamilyMemberDto as FamilyMember,
  CategoryDto as Category,
  DashboardStatsDto as DashboardStats,
  AuthResponseDto as AuthResponse,
  RegisterDto,
  LoginDto,
  InteractionCheckDto,
  AddUserMedicineDto,
  AddFamilyMemberDto,
  SideEffectDto,
} from "./api-types";

/** Interaction attached to a single medicine (GET /medicines/{id}). */
export interface InteractionDetail {
  severity: string;
  description?: string;
  advice?: string;
  otherMedicine: string;
}

export type {
  Medicine,
  Interaction,
  UserMedicine,
  FamilyMember,
  Category,
  DashboardStats,
  AuthResponse,
  RegisterDto,
  LoginDto,
  InteractionCheckDto,
  AddUserMedicineDto,
  AddFamilyMemberDto,
  SideEffectDto,
};

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
