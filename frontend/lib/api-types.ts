// Generated from backend/PillWise.API/DTOs/Dtos.cs and backend swagger.json.
// Do not hand-edit: regenerate when backend DTOs change (see README "OpenAPI types").
// Optional fields use `?` (not `?: ... | null`) so they stay assignable to the
// `string | undefined` props used across the UI.

// ---- Request DTOs (from swagger components.schemas) ----

export interface RegisterDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  allergies?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface InteractionCheckDto {
  medicineIds: number[];
}

export interface AddUserMedicineDto {
  userId: number;
  familyMemberId?: number;
  medicineId: number;
  dosage?: string;
  timing?: string;
}

export interface AddFamilyMemberDto {
  userId: number;
  name: string;
  relation?: string;
  age?: number;
}

export interface SideEffectDto {
  userId: number;
  medicineId: number;
  description?: string;
  severity?: string;
}

// ---- Response DTOs (mirrored from backend DTOs) ----

export interface AuthResponseDto {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface MedicineDto {
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
  bodySystem: string;
}

export interface InteractionResultDto {
  medicine1Id: number;
  medicine1Name: string;
  medicine2Id: number;
  medicine2Name: string;
  severity: string;
  description?: string;
  advice?: string;
}

export interface UserMedicineDto {
  id: number;
  userId: number;
  familyMemberId?: number;
  familyMemberName?: string;
  medicineId: number;
  medicineName: string;
  medicineForm?: string;
  bodySystem?: string;
  dosage?: string;
  timing?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface FamilyMemberDto {
  id: number;
  userId: number;
  name: string;
  relation?: string;
  age?: number;
  medicineCount: number;
}

export interface DashboardStatsDto {
  totalMedicines: number;
  activeWarnings: number;
  familyMembers: number;
  totalInteractions: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  icon?: string;
  medicineCount: number;
}
