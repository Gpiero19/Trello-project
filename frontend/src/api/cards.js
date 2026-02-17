import axiosInstance from "./axiosInstance";

export async function getCards() {
  try {
    const response = await axiosInstance.get("/cards");
    return response.data; 
  } catch (err) {
    throw new Error('Failed to fetch cards', err);
  }
}

export async function createCards(title, listId, priority = 'medium') {
  try {
    const payload = { title, listId, priority };

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

    const response = await axiosInstance.patch(`/cards/${cardId}`, payload);
    return response.data;
  } catch (err) {
    console.error("Failed to rename card:", err.response?.data || err.message);
    throw err;
  }
}

// Update card with any field (priority, dueDate, description, etc.)
export async function updateCard(cardId, updates) {
  try {
    const response = await axiosInstance.patch(`/cards/${cardId}`, updates);
    return response.data;
  } catch (err) {
    console.error("Failed to update card:", err.response?.data || err.message);
    throw err;
  }
}

// Get card by ID with all details
export async function getCardById(cardId) {
  try {
    const response = await axiosInstance.get(`/cards/${cardId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to get card:", err.response?.data || err.message);
    throw err;
  }
}

// Move card to new list
export async function moveCard(cardId, newListId, newPosition) {
  try {
    const response = await axiosInstance.patch(`/cards/${cardId}/move`, {
      newListId,
      newPosition
    });
    return response.data;
  } catch (err) {
    console.error("Failed to move card:", err.response?.data || err.message);
    throw err;
  }
}

// Add label to card
export async function addLabelToCard(cardId, labelId) {
  try {
    const response = await axiosInstance.post(`/cards/${cardId}/labels`, { labelId });
    return response.data;
  } catch (err) {
    console.error("Failed to add label:", err.response?.data || err.message);
    throw err;
  }
}

// Remove label from card
export async function removeLabelFromCard(cardId, labelId) {
  try {
    const response = await axiosInstance.delete(`/cards/${cardId}/labels/${labelId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to remove label:", err.response?.data || err.message);
    throw err;
  }
}

// Get comments for a card
export async function getComments(cardId) {
  try {
    const response = await axiosInstance.get(`/cards/${cardId}/comments`);
    return response.data;
  } catch (err) {
    console.error("Failed to get comments:", err.response?.data || err.message);
    throw err;
  }
}

// Add comment to card
export async function addComment(cardId, content) {
  try {
    const response = await axiosInstance.post(`/cards/${cardId}/comments`, { content });
    return response.data;
  } catch (err) {
    console.error("Failed to add comment:", err.response?.data || err.message);
    throw err;
  }
}

// Delete comment
export async function deleteComment(commentId) {
  try {
    await axiosInstance.delete(`/cards/comments/${commentId}`);
  } catch (err) {
    console.error("Failed to delete comment:", err.response?.data || err.message);
    throw err;
  }
}
