import axiosInstance from "./axiosInstance";
// const API_BASE_URL = process.env.API_BASE_URL
const API_BASE_URL = 'http://localhost:3000/api'; // or use .env later

export async function getLists() {
  try {
    const response = await axiosInstance.get("/lists");
    return response.data;                   // axios wraps the response in `data`
  } catch (err) {
    throw new Error('Failed to fetch lists', err);
  }
}

export async function createLists(title) {
  try {
    const response = await axiosInstance.post("/lists", { title });
    return response.data;
  } catch (err) {
    throw new Error("Failed to create list", err);
  }
}

export async function deleteList(id) {
  try {
    const response = await axiosInstance.delete(`/lists/${id}`)
    return response.data
  } catch (err) {
    throw new Error("Failed to delete list", err);
  }
}

export async function updateList(id, newListTitle) {
  try {
    const response = await axiosInstance.delete(`/lists/${id}`, {
      title : newListTitle
    })
    return response.data
  } catch (err) {
    throw new Error("Failed to delete list", err);
  }
}