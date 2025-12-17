import { useState, useEffect, useCallback } from "react";
import { getBoards } from "./boards";

export function useBoard(boardId) {
  const [board, setBoard] = useState(null);
  
  const refreshBoard = useCallback(async ()=> {
  try {
    const data = await getBoards(boardId)
    setBoard(data)
  } catch (err) {
      console.error('Failed to load board', err)
    }
  }, [boardId]);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

return { board, setBoard, refreshBoard};
}