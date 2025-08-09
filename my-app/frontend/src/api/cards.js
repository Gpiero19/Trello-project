import axiosInstance from "./axiosInstance";

const API_BASE_URL = 'http://localhost:3000/api'; // or use .env later

export async function getCards() {
  try {
    const response = await axiosInstance.get("/cards");
    return response.data;                   // axios wraps the response in `data`
  } catch (err) {
    throw new Error('Failed to fetch cards', err);
  }
}

export async function createCards(title, listId) {
  try {
    const response = await axiosInstance.post("/cards", { title, listId });
    return response.data;
  } catch (err) {
    console.error("Failed to create card:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteCard(cardId) {
  try {
    await axiosInstance.delete(`/cards/${cardId}`);
  } catch (err)  {
    throw new Error("Failed to delete Card", err);
  }
}
