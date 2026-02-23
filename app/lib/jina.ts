export async function getJinaEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.JINA_API_KEY;
    if (!apiKey) {
        throw new Error('Missing JINA_API_KEY environment variable');
    }

    const requestBody = {
        model: 'jina-embeddings-v4', // Supports variable dimensions
        input: [text],
        dimensions: 1024, // Reduced to 1024 due to API error
    };

    console.log('Sending Jina payload:', JSON.stringify(requestBody));

    const response = await fetch('https://api.jina.ai/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jina API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
}