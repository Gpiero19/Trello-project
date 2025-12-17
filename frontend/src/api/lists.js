import axiosInstance from "./axiosInstance";
const API_BASE_URL = 'http://localhost:3000/api'; 

export async function getLists() {
  try {
    const response = await axiosInstance.get("/lists");
    return response.data; // axios wraps the response in `data`
  } catch (err) {
    throw new Error('Failed to fetch lists', err);
  }
}

export async function createLists(title, boardId) {
  try {
    const payload = { title, boardId };

    const response = await axiosInstance.post("/lists", payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create list", err);
  }
}

export async function deleteList(id) {
  try {
    const response = await axiosInstance.delete(`/lists/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to delete list", err);
  }
}

export async function updateList(id, newListTitle) {
  try {
    const payload = { title: newListTitle };

    const response = await axiosInstance.put(`/lists/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update list", err);
  }
}
