import axiosInstance from "./axiosInstance";
import { createCards } from "./cards";

export async function getBoards() {
  try {
    const response = await axiosInstance.get("/boards");
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error("Failed to fetch boards", err);
  }
}

export async function createBoard(title, description = null) {
  try {
    const response = await axiosInstance.post("/boards", {title, description});
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

export async function updateBoard(boardId, newTitle, newDescription = null) {
  try {
    const payload = { title: newTitle };
    if (newDescription !== null) {
      payload.description = newDescription;
    }

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

// Import guest boards to server
export async function importGuestBoards(guestBoards) {
  const results = {
    success: 0,
    failed: 0,
    boards: []
  };

  for (const guestBoard of guestBoards) {
    try {
      // Create the board
      const newBoard = await createBoard(guestBoard.title, guestBoard.description);
      results.boards.push({ guestId: guestBoard.id, serverId: newBoard.id });
      results.success++;

      // Create lists and cards
      if (guestBoard.Lists && guestBoard.Lists.length > 0) {
        for (const guestList of guestBoard.Lists) {
          try {
            const listResponse = await axiosInstance.post("/lists", {
              title: guestList.title,
              boardId: newBoard.id
            });
            const newList = listResponse.data;

            // Create cards in the list
            if (guestList.Cards && guestList.Cards.length > 0) {
              for (const guestCard of guestList.Cards) {
                try {
                  await createCards(guestCard.title, newList.id, guestCard.priority || 'medium');
                } catch (cardErr) {
                  console.error("Failed to import card:", cardErr);
                }
              }
            }
          } catch (listErr) {
            console.error("Failed to import list:", listErr);
          }
        }
      }
    } catch (boardErr) {
      console.error("Failed to import board:", boardErr);
      results.failed++;
    }
  }

  return results;
}
