// Direct call to Jina embeddings API to avoid provider registry issues.
// Docs: https://docs.jina.ai/embeddings
export async function getJinaEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.JINA_API_KEY;
  if (!apiKey) {
    throw new Error("JINA_API_KEY is missing");
  }

  const resp = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: text,
      model: "jina-embeddings-v2-base-en",
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Jina embedding failed: ${resp.status} ${resp.statusText} - ${body}`);
  }

  const data = await resp.json();
  const embedding = data?.data?.[0]?.embedding;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Jina embedding response malformed");
  }
  return embedding as number[];
}

export default getJinaEmbedding;
