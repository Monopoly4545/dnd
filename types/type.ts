// src/types/type.ts

// ============================================================
// Basic Types
// ============================================================

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export type Abilities = Record<AbilityKey, number>;


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

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  inspiration: boolean;
  speed: number;
  temporary_hit_points: number;

  story: string;

  created_at: string;
  updated_at: string;
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

  story: string;
};


// ============================================================
// Character Update
// ============================================================

export type UpdateCharacterInput = Partial<CreateCharacterInput>;


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
// D&D Options
// ============================================================

export type Race = {
  id?: string;
  name: string;
  description?: string;
};

export type CharacterClass = {
  id?: string;
  name: string;
  description?: string;
};

export type Background = {
  id?: string;
  name: string;
  description?: string;
};

export type Alignment = {
  id?: string;
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

export type LoadingState =
  | "idle"
  | "loading"
  | "success"
  | "error";


// ============================================================
// Pagination
// ============================================================

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};