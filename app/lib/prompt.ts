export function generateSystemPrompt(ragContext: string): string {
  const base = `
You are GTA's aviation MRO assistant. Answer concisely and factually.
- If you cite internal documents, keep references brief.
- If unsure, say you don't know and offer to connect the user with a human.
- Keep tone professional and clear.
`;

  if (ragContext?.trim()) {
    return `${base}\n\nRelevant reference material:\n${ragContext}`;
  }
  return base;
}

export default generateSystemPrompt;
