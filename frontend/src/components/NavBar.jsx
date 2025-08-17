import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { currentUser } from "../api";
import "../css/NavBar.css";

/**
 * Function for the navigation bar component
 */

function NavBar () {
    /**
     * State variables
     */
    const [user, setUser] = useState(null); // represents the user logged in, set to null by default


    /**
     * Looks for the token in the local storage
     * If found, then set the user state variable to the user associated with the token (using getCurrentUser())
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            currentUser(token).then((data) => setUser(data));
        }
        else {
            setUser(null);
        }

        // window.location.reload(); // refreshes the page after login/logout (to display change)
    });


    /**
     * The <nav> element consists of the app title ("Flashcards App") and <LinK> elements routing to the different pages of the application
     * If user is logged in, then show "Logged in as {user}"; otherwise, show "Login/Register"
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
                {user ? (
                    <Link to="/account" className="links account">Logged in as {user.username}</Link>
                ) : (
                    <Link to="/account" className="links account">Login/Register</Link>
                )}
            </div>
        </nav>
    )

}

export default NavBar;