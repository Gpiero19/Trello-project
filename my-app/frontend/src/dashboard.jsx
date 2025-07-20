import { useEffect, useState } from "react";
import { getBoards } from "./api/boards";

function Dashboard () {
    const [boards, setBoards] = useState([])
    useEffect(() => {
    getBoards()
        .then(setBoards)
        .catch((err) => console.error("Error fetching boards:", err));
    }, []);
    
    return (
        <div className="Maincontainer" style={{
            display:"flex",
            flexDirection: "row",
            padding: "1em",
            justifyContent: "start",
        }}>

        {boards.map((board) => (
        <div
          key={board.id}
          style={{
            border: "1px solid gray",
            borderRadius: "8px",
            padding: "1em",
            marginRight: "1em",
            minWidth: "150px",
          }}
        >
          <h3>{board.title}</h3>
          <p>User ID: {board.userId}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard