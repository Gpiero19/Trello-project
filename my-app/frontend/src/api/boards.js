import axiosInstance from "./axiosInstance";

const API_BASE_URL = 'http://localhost:3000/api'; // or use .env later

export async function getBoards() {
  try {
    const response = await axiosInstance.get("/boards");
    return response.data;                   // axios wraps the response in `data`
  } catch (err) {
    throw new Error('Failed to fetch boards', err);
  }
}

export async function createBoard(title) {
  try {
    const response = await axiosInstance.post("/boards", { title });
    return response.data;
  } catch (err) {
    throw new Error("Failed to create board", err);
  }
}
