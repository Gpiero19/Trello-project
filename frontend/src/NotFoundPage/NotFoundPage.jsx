import { Link } from "react-router-dom";
import './NotFoundPage.css'

const NotFoundPage = () => {
    return(
        <div className="container">
            <div className="container-img">
                
            </div>
            <div className="NotFoundMessage">
                <h1>404</h1>
                <h2>UH OH! You're lost.</h2>
                <p>The page you are looking for does not exist.
                How you got here is a mystery. But you can click the button below
                to go back to the homepage.
                </p>
                <Link to={"/dashboard"}>
                <br/>
                    <button className="btn orange">Go back Home</button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage