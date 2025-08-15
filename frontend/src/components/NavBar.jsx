import { Link } from "react-router-dom"
import "../css/NavBar.css";

/**
 * Function for the navigation bar component
 */

function NavBar () {

    /**
     * The <nav> element consists of the app title ("Flashcards App") and <LinK> elements routing to the different pages of the application
     */
    return (
        <nav>
            <div className="left-side">
                <p className="app-title">Flashcards App</p>
                <Link to="/" className="links">Decks</Link>
                <Link to="/manage/0" className="links">Manage Deck</Link>
                <Link to="/study/0" className="links">Study</Link>
            </div>

            <div className="right-side">
                <Link to="/account" className="links account">Login/Register</Link>
            </div>
        </nav>
    )

}

export default NavBar;