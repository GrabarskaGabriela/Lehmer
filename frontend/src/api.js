const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function postJson(path, payload, signal) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

export async function getJson(path, signal) {
  const response = await fetch(`${API_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}
