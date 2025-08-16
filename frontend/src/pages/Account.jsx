import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import {login, register, getCurrentUser} from "../api"
import "../css/Account.css"

/**
 * Function for the "LOgin/Register" page
 */
function Account () {
    /**
     * State variables
     */
    const [user, setUser] = useState(null); // represents the user currently logged in, set to null by default
    const [usernameLogin, setUsernameLogin] = useState(""); // represents the value shown in the Username text input for login, set to an empty string "" by default
    const [passwordLogin, setPasswordLogin] = useState(""); // represents the value shown in the Password text input for login, set to an empty string "" by default
    const [usernameRegister, setUsernameRegister] = useState(""); // represents the value shown in the Username text input for register, set to an empty string "" by default
    const [passwordRegister, setPasswordRegister] = useState(""); // represents the value shown in the Password text input for register, set to an empty string "" by default


    /**
     * Other setup
     */
    const navigate = useNavigate(); // sets up navigation to different pages

    
    /**
     * Reads the token from the local storage
     * If found, sets the user state variable to the user asssociated with the token using getCurrentUser() function
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getCurrentUser(token).then((data) => setUser(data));
        }
        else {
            setUser(null);
        }
    }, []);


    /**
     * Uses the usernameLogin and passwordLogin states to call the login() function
     * Logs in the user and generates a token, which is stored in the local storage
     * Navigates to the decks page afterwards
     */
    const loginUser = async () => {
        try {
            const user = await login(usernameLogin, passwordLogin);
            localStorage.setItem("token", user.token);
            navigate('/')
        } catch (err) {
            console.error(err);
        }
    }


    /**
     * Uses the usernameRegister and passwordRegister states to call the register() function
     * If register() is successful, then automatically login the user with the login() function and store the generated token into localStorage
     * Navigate to deck page once login is successfulc
     */
    const registerUser = async () => {
        try {
            const registeredUser = await register(usernameRegister, passwordRegister);

            if (registeredUser) {
                const loginUser = await login(registeredUser.username, passwordRegister);
                localStorage.setItem("token", loginUser.token);
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    }

    
    /**
     * Logs the current user out by removing their token from the local storage
     */
    const logoutUser = () => {
        localStorage.removeItem("token");
        setUser(null);
    }


    /**
     * If user is logged in, then shows a message (<p>) saying who the user is logged in as with the option to log out
     * If not, then shows 2 <div> sections, one to register the user with username and password inputs and one to log in the user
     */
    return (
        <>
            {user != null ? (
                <div className="logout-user">
                    <p>Logged in as {user.username}</p>
                    <input type="submit" value="Log out" onClick={logoutUser} className="logout-input"/>
                </div>
            ) : (
                <>
                    <div className="login-user">
                        <h4>Login</h4>
                        <input type="text" placeholder="Username" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} required="required" className="user-input" />
                        <input type="password" placeholder="Password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required="required" className="pass-input" />
                        <input type="submit" value="Login" onClick={loginUser} className="login-input" />
                    </div>
                    
                    <div className="register-user">
                        <h4>Register</h4>
                        <input type="text" placeholder="Username (max. 20)" value={usernameRegister} maxLength="20" onChange={(e) => setUsernameRegister(e.target.value)} required="required" className="user-input" />
                        <input type="password" placeholder="Password" value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)} required="required" className="pass-input" />
                        <input type="submit" value="Register" onClick={registerUser} className="register-input" />
                    </div>
                </>
            )}
        </>
    )
}

export default Account;