import { Link } from "react-router-dom"

function NavBar () {
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

export default NavBar