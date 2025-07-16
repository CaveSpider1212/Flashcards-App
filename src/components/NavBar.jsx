import { Link } from "react-router-dom"

/**
 * Function for the navigation bar component
 */

function NavBar () {

    /**
     * The <nav> element consists of the app title ("Flashcards App") and <LinK> elements routing to the different pages of the application
     */
    return (
        <nav>
            <div>
                <p>Flashcards App</p>
            </div>

            <div>
                <Link to="/">Decks</Link>
                <Link to="/manage/0">Manage Deck</Link>
                <Link to="/study/0">Study</Link>
            </div>
        </nav>
    )

}

export default NavBar;