/**
 * Client-side wrapper — proxies chat requests through the server-side Route Handler
 * so the Gemini API key never ships to the browser bundle.
 */
export async function getSecurityInsights(query: string): Promise<string> {
  try {
    const response = await fetch('/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Chat API responded with ${response.status}`);
    }

    const data: { response?: string } = await response.json();
    return data.response ?? 'No response received.';
  } catch {
    return 'Signal is temporarily unavailable. Please contact our team directly for immediate assistance.';
  }
}
