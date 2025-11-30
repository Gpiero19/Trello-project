import axiosInstance from "./axiosInstance";

const API_BASE_URL = 'http://localhost:3000/api'; 

export async function getBoards(userIdOrGuestId = null) {
  try {
    const response = await axiosInstance.get("/boards", {
      params: { userIdOrGuestId }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch boards", err);
  }
}

export async function createBoard(title, userIdOrGuestId = null) {
  try {
    const payload = { title };
    if (userIdOrGuestId) payload.userIdOrGuestId = userIdOrGuestId;

    const response = await axiosInstance.post("/boards", payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create board", err);
  }
}

export async function deleteBoard(boardId, userIdOrGuestId = null) {
  try {
    const config = userIdOrGuestId
      ? { data: { userIdOrGuestId } }
      : {};
    const response = await axiosInstance.delete(`/boards/${boardId}`, config);
    return response.data;
  } catch (err) {
    throw new Error("Failed to delete board", err);
  }
}

export async function updateBoard(boardId, newTitle, userIdOrGuestId = null) {
  try {
    const payload = { title: newTitle };
    if (userIdOrGuestId) payload.userIdOrGuestId = userIdOrGuestId;

    const response = await axiosInstance.put(`/boards/${boardId}`, payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update board title", err);
  }
}

export async function reorderBoards(boardsArray, userIdOrGuestId = null) {
  try {
    const payload = boardsArray.map((b, i) => ({
      id: b.id,
      position: i,
      userIdOrGuestId
    }));
    const response = await axiosInstance.put("/boards/reorder", payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to reorder boards", err);
  }
}
