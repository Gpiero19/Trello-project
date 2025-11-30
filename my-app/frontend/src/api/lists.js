import axiosInstance from "./axiosInstance";

const API_BASE_URL = 'http://localhost:3000/api'; 

export async function getLists(userIdOrGuestId = null) {
  try {
    const url = userIdOrGuestId ? `/lists?userIdOrGuestId=${userIdOrGuestId}` : "/lists";
    const response = await axiosInstance.get(url);
    return response.data; // axios wraps the response in `data`
  } catch (err) {
    throw new Error('Failed to fetch lists', err);
  }
}

export async function createLists(title, boardId, guestId = null) {
  try {
    const payload = { title, boardId };
    if (guestId) payload.guestId = guestId;

    const response = await axiosInstance.post("/lists", payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create list", err);
  }
}

export async function deleteList(id, userIdOrGuestId = null) {
  try {
    const url = userIdOrGuestId ? `/lists/${id}?userIdOrGuestId=${userIdOrGuestId}` : `/lists/${id}`;
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (err) {
    throw new Error("Failed to delete list", err);
  }
}

export async function updateList(id, newListTitle, guestId = null) {
  try {
    const payload = { title: newListTitle };
    if (guestId) payload.guestId = guestId;

    const response = await axiosInstance.put(`/lists/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error("Failed to update list", err);
  }
}
