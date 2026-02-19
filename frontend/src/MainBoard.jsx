import './MainBoard.css';

const MainBoard = ({ setNewBoardModal }) => {
  return (
    <div className="mainboard-container">
      <div className="mainboard-card">
        <div className="mainboard-icon">🚀</div>
        <h2>Welcome to Frello!</h2>
        <p>
          You don't have any boards yet. Create your first board to start 
          organizing your tasks and continue the adventure!
        </p>
        <button 
          className="mainboard-create-btn" 
          onClick={() => setNewBoardModal(true)}
        >
          <span className="btn-icon">+</span>
          Create your first Board
        </button>
      </div>
      
      <div className="mainboard-features">
        <div className="feature-item">
          <span className="feature-icon">📋</span>
          <span>Organize with Boards</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">📝</span>
          <span>Create Lists & Cards</span>
        </div>
        <div className="feature-item">
          <span className="feature-icon">👥</span>
          <span>Collaborate with Team</span>
        </div>
      </div>
    </div>
  );
}

export default MainBoard;
