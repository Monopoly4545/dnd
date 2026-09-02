// src/types/type.ts

// ============================================================
// Basic Types
// ============================================================

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type Abilities = Record<AbilityKey, number>;

export type AbilityScore = {
  name: string;
  short: AbilityKey;
};


// ============================================================
// Character
// ============================================================

export type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;

  // Individual ability scores (database columns)
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Character stats
  inspiration: boolean;
  speed: number;
  temporary_hit_points: number;

  // Flavor
  story: string;

  // Timestamps
  created_at: string;
  updated_at: string;
};


// ============================================================
// Character with Abilities (for UI)
// ============================================================

export type CharacterWithAbilities = Character & {
  abilities: Abilities;
};


// ============================================================
// Character Creation
// ============================================================

export type CreateCharacterInput = {
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  abilities: Abilities;
  story?: string;
};


// ============================================================
// Character Update
// ============================================================

export type UpdateCharacterInput = Partial<Omit<CreateCharacterInput, 'abilities'>> & {
  abilities?: Abilities;
};


// ============================================================
// API Response
// ============================================================

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};


// ============================================================
// Character API
// ============================================================

export type CharactersResponse = ApiResponse<Character[]>;

export type CharacterResponse = ApiResponse<Character>;

export type DeleteCharacterResponse = {
  success: boolean;
  message: string;
  character: {
    id: string;
    name: string;
  };
};


// ============================================================
// Character Form
// ============================================================

export type CharacterFormData = {
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  abilities: Abilities;
  story: string;
};


// ============================================================
// Character Builder Steps
// ============================================================

export type CharacterStep =
  | "Basic Info"
  | "Race & Class"
  | "Abilities"
  | "Background";

export type CharacterStepIndex = 0 | 1 | 2 | 3;


// ============================================================
// D&D Options (Data Types)
// ============================================================

export type RaceOption = {
  id: string;
  name: string;
  description?: string;
};

export type ClassOption = {
  id: string;
  name: string;
  description?: string;
};

export type BackgroundOption = {
  id: string;
  name: string;
  description?: string;
};

export type AlignmentOption = {
  id: string;
  name: string;
  description?: string;
};


// ============================================================
// Generic Select Option
// ============================================================

export type SelectOption = {
  value: string;
  label: string;
};


// ============================================================
// Navigation
// ============================================================

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
};


// ============================================================
// UI
// ============================================================

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type Size = "sm" | "md" | "lg";


// ============================================================
// Loading / Status
// ============================================================

export type LoadingState = "idle" | "loading" | "success" | "error";


// ============================================================
// Pagination
// ============================================================

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};


// ============================================================
// Authentication Types
// ============================================================

export type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
};

export type JWTPayload = {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
};
