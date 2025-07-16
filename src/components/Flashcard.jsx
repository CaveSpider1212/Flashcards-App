import "../css/Flashcard.css"
import { useState } from "react";

/**
 * Function for the flashcard component
 */

function Flashcard ({term, definition, cardType}) {

    /**
     * State variables
     */
    const [flipped, setFlipped] = useState(false); // represents whether card has been flipped or not, set to false by default


    /**
     * Creates a <div> element for the card, which shows either the definition or term depending on the value of the flipped state
     * When the <div> element is clicked, it changes the flipped state
     */
    return (
        <div onClick={() => setFlipped(!flipped)} className={cardType}>
            {flipped ? definition : term}
        </div>
    )

}

export default Flashcard;