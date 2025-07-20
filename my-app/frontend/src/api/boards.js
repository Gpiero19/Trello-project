const API_BASE_URL = 'http://localhost:3000/api'; // or use .env later

export async function getBoards() {
  const res = await fetch(`${API_BASE_URL}/boards`);
  if (!res.ok) throw new Error('Failed to fetch boards');
  return res.json();
}

export async function createBoard(title, userId) {
  const res = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, userId })
  });
  if (!res.ok) throw new Error('Failed to create board');
  return res.json();
}
