const MainBoard = ({ setNewBoardModal }) => {
  return (
    <div className="mainboard-container">
      <h2>👋 Welcome!</h2>
      <br/>
      <p>You don’t have any boards yet. Create a user to start creating boards to continue the adventure!</p>
      <br/>
      <button onClick={() => setNewBoardModal(true)}>Create your first Board here!</button>
    </div>
  );
}


export default MainBoard  