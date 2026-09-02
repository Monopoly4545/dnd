import type {
  Character,
  CreateCharacterInput,
  DeleteCharacterResponse,
} from "@/types/type";

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
export async function deleteCharacter(
  id: string,
): Promise<DeleteCharacterResponse> {
  const response = await fetch(`/api/characters/${id}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}
