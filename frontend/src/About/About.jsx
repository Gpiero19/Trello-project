import './about.css'

const About = () => {
    return(
        <section className="about-page">
        <div className="container">
            {/* Section 1: About Frello - stacked vertically */}
            <div className="section about-intro">
                <h1 className="about-title">About Frello</h1>
                <p className="about-description">
                    Frello is a lightweight task-management app inspired by Trello. 
                    Create boards, lists, and cards to organize your work visually 
                    and adapt your tasks as your priorities change.
                </p>
            </div>

            {/* Section 2: Features - stacked vertically */}
            <div className="section">
                <h2 className="section-title">Features</h2>
                <div className="features-container">
                    <div className="features-column">
                        <ul className="features-list">
                            <li className="feature-item">Create and manage project boards</li>
                            <li className="feature-item">Drag-and-drop reordering for boards, lists, and cards</li>
                            <li className="feature-item">Create lists to organize workflow stages</li>
                            <li className="feature-item">Create cards with titles and descriptions</li>
                            <li className="feature-item">Set card priorities (Low, Medium, High, Urgent)</li>
                            <li className="feature-item">Add labels to cards for categorization</li>
                            <li className="feature-item">Set due dates with overdue indicators</li>
                        </ul>
                    </div>
                    <div className="features-column">
                        <ul className="features-list">
                            <li className="feature-item">Comment on cards for collaboration</li>
                            <li className="feature-item">Use pre-made board templates</li>
                            <li className="feature-item">Create your own board templates</li>
                            <li className="feature-item">Guest mode - try without registration</li>
                            <li className="feature-item">Migrate guest boards to user account</li>
                            <li className="feature-item">Responsive design for all screens</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section 3: Technologies - stacked vertically */}
            <div className="section">
                <h2 className="section-title">Technologies Used</h2>
                <div className="tech-container">
                    <div className="tech-category">
                        <h3 className="tech-title">Frontend</h3>
                        <ul className="tech-list">
                            <li>React 19</li>
                            <li>React Router</li>
                            <li>Axios</li>
                            <li>@hello-pangea/dnd</li>
                            <li>Vite</li>
                            <li>CSS3</li>
                        </ul>
                    </div>

                    <div className="tech-category">
                        <h3 className="tech-title">Backend</h3>
                        <ul className="tech-list">
                            <li>Node.js</li>
                            <li>Express.js</li>
                            <li>Sequelize ORM</li>
                            <li>PostgreSQL</li>
                            <li>JWT Authentication</li>
                        </ul>
                    </div>

                    <div className="tech-category">
                        <h3 className="tech-title">Tools & Libraries</h3>
                        <ul className="tech-list">
                            <li>bcrypt</li>
                            <li>CORS</li>
                            <li>dotenv</li>
                            <li>react-icons</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section 4: Purpose - stacked vertically */}
            <div className="section">
                <h2 className="section-title">Project Purpose</h2>
                <p className="purpose-text">
                    Frello was built to practice full-stack development, including REST API architecture, 
                    database modeling, authentication, drag-and-drop interfaces, and clean state management in React.
                </p>
            </div>
        </div>
        </section>

    );
};

export default About
