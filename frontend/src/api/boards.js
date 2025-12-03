import axiosInstance from "./axiosInstance";
const API_BASE_URL = 'http://localhost:3000/api'; 

export async function getBoards() {
  try {
    const response = await axiosInstance.get("/boards");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch boards", err);
  }
}

export async function createBoard(title) {
  try {
    const response = await axiosInstance.post("/boards", {title});
    return response.data;
  } catch (err) {
    throw new Error("Failed to create board", err);
  }
}

export async function deleteBoard(boardId) {
  try {
    const response = await axiosInstance.delete(`/boards/${boardId}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to delete board", err);
  }
}

export async function updateBoard(boardId, newTitle) {
  try {
    const payload = { title: newTitle };

    const response = await axiosInstance.put(`/boards/${boardId}`, payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update board title", err);
  }
}

export async function reorderBoards(boardsArray) {
  try {
    const payload = boardsArray.map((b, i) => ({
      id: b.id,
      position: i,
    }));
    const response = await axiosInstance.put("/boards/reorder", payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to reorder boards", err);
  }
}
