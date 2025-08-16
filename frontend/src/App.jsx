import './css/App.css'
import NavBar from "./components/NavBar"
import ManageDeck from './pages/ManageDeck'
import Decks from "./pages/Decks"
import Study from "./pages/Study"
import Account from "./pages/Account"
import {Routes, Route} from "react-router-dom"

/**
 * Function for the application
 */

function App() {

  /**
   * Creates a <NavBar> component, which is the navigation bar
   * Creates routes to the different pages of the application, "Decks," "Manage Deck," and "Study"
   */
  return (
    <div>
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Decks />} />
          <Route path="/manage/:deckId" element={<ManageDeck />} />
          <Route path="/study/:deckId" element={<Study />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </div>
  )

}

export default App;