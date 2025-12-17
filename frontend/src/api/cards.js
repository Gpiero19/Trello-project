import axiosInstance from "./axiosInstance";
const API_BASE_URL = 'http://localhost:3000/api';

export async function getCards() {
  try {
    const response = await axiosInstance.get("/cards");
    return response.data; 
  } catch (err) {
    throw new Error('Failed to fetch cards', err);
  }
}

export async function createCards(title, listId) {
  try {
    const payload = { title, listId };

    const response = await axiosInstance.post("/cards", payload);
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
    throw new Error("Failed to delete card", err);
  }
}

export async function updateCardTitle(cardId, newCardTitle) {
  try {
    const payload = { title: newCardTitle };

    const response = await axiosInstance.put(`/cards/${cardId}`, payload);
    return response.data;
  } catch (err) {
    console.error("Failed to rename card:", err.response?.data || err.message);
    throw err;
  }
}
