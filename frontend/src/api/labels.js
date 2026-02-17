import axiosInstance from "./axiosInstance";

// Get all labels for a board
export async function getLabelsByBoard(boardId) {
  try {
    const response = await axiosInstance.get(`/labels/${boardId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to get labels:", err.response?.data || err.message);
    throw err;
  }
}

// Create a new label
export async function createLabel(boardId, name, color) {
  try {
    const response = await axiosInstance.post(`/labels`, { boardId, name, color });
    return response.data;
  } catch (err) {
    console.error("Failed to create label:", err.response?.data || err.message);
    throw err;
  }
}

// Update a label
export async function updateLabel(labelId, name, color) {
  try {
    const response = await axiosInstance.put(`/labels/${labelId}`, { name, color });
    return response.data;
  } catch (err) {
    console.error("Failed to update label:", err.response?.data || err.message);
    throw err;
  }
}

// Delete a label
export async function deleteLabel(labelId) {
  try {
    await axiosInstance.delete(`/labels/${labelId}`);
  } catch (err) {
    console.error("Failed to delete label:", err.response?.data || err.message);
    throw err;
  }
}
