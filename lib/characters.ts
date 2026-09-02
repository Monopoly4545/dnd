export type CharacterAbilities = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

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

export type CreateCharacterInput = {
  name: string;
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  abilities: CharacterAbilities;
  story?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();

    throw new Error(`Server returned non-JSON response: ${text.slice(0, 200)}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Request failed.");
  }

  return data;
}

/**
 * GET all characters
 */
export async function getCharacters(): Promise<Character[]> {
  const response = await fetch("/api/characters", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<Character[]>(response);
}

/**
 * GET one character
 */
export async function getCharacter(id: string): Promise<Character> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<Character>(response);
}

/**
 * POST
 */
export async function createCharacter(
  character: CreateCharacterInput,
): Promise<Character> {
  const response = await fetch("/api/characters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  });

  return parseResponse<Character>(response);
}

/**
 * PUT
 */
export async function updateCharacter(
  id: string,
  character: CreateCharacterInput,
): Promise<Character> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  });

  return parseResponse<Character>(response);
}

/**
 * PATCH
 */
export async function patchCharacter(
  id: string,
  updates: Partial<CreateCharacterInput>,
): Promise<Character> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return parseResponse<Character>(response);
}

/**
 * DELETE
 */
export async function deleteCharacter(id: string): Promise<{
  success: boolean;
  message: string;
  character: {
    id: string;
    name: string;
  };
}> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}
