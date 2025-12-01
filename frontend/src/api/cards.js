import axiosInstance from "./axiosInstance";

export async function getCards(userIdOrGuestId = null) {
  try {
    const url = userIdOrGuestId ? `/cards?userIdOrGuestId=${userIdOrGuestId}` : "/cards";
    const response = await axiosInstance.get(url);
    return response.data; 
  } catch (err) {
    throw new Error('Failed to fetch cards', err);
  }
}

export async function createCards(title, listId, guestId = null) {
  try {
    const payload = { title, listId };
    if (guestId) payload.guestId = guestId;

    const response = await axiosInstance.post("/cards", payload);
    return response.data;
  } catch (err) {
    console.error("Failed to create card:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteCard(cardId, userIdOrGuestId = null) {
  try {
    const url = userIdOrGuestId ? `/cards/${cardId}?userIdOrGuestId=${userIdOrGuestId}` : `/cards/${cardId}`;
    await axiosInstance.delete(url);
  } catch (err)  {
    throw new Error("Failed to delete card", err);
  }
}

export async function updateCardTitle(cardId, newCardTitle, guestId = null) {
  try {
    const payload = { title: newCardTitle };
    if (guestId) payload.guestId = guestId;

    const response = await axiosInstance.put(`/cards/${cardId}`, payload);
    return response.data;
  } catch (err) {
    console.error("Failed to rename card:", err.response?.data || err.message);
    throw err;
  }
}
