import './about.css'

const About = () => {
    return(
        <section className="about-page">
        <div className="container">
            <h1 className="about-title">About Frello</h1>
            <p className="about-subtitle">
            Frello is a lightweight task-management app inspired by Trello. 
            Create boards, lists, and cards to organize your work visually 
            and adapt your tasks as your priorities change.
            </p>

            <div className="section">
            <h2 className="section-title">Features</h2>
            <ul className="features-list">
                <li className="feature-item">Create and manage project boards</li>
                <li className="feature-item">Add lists to organize workflow stages</li>
                <li className="feature-item">Create cards to track tasks</li>
                <li className="feature-item">Drag-and-drop reordering</li>
                <li className="feature-item">Edit, update, and delete cards</li>
                <li className="feature-item">Responsive layout for all screens</li>
            </ul>
            </div>

            <div className="section">
            <h2 className="section-title">Technologies Used</h2>

            <div className="tech-columns">
                <div className="tech-category">
                <h3 className="tech-title">Frontend</h3>
                <ul className="tech-list">
                    <li>React</li>
                    <li>React Router</li>
                    <li>Axios</li>
                    <li>Tailwind CSS</li>
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
                <h3 className="tech-title">Tools</h3>
                <ul className="tech-list">
                    <li>bcrypt</li>
                    <li>dotenv</li>
                    <li>CORS</li>
                    <li>pgAdmin</li>
                </ul>
                </div>
            </div>
            </div>

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