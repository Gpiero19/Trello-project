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

export async function createCards(title) {
  try {
    const response = await axiosInstance.post("/cards", { title });
    return response.data;
  } catch (err) {
    throw new Error("Failed to create card", err);
  }
}
