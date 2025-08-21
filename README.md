## Flashcards App

#### Description

This is a simple flashcards app made using React and Node.js + Express, which uses MongoDB to store decks, flashcards, and user information.

#### Features

- Create cards by setting term and definition
- Edit cards' term or definition
- Study decks by going through the list of cards
- Store decks, flashcards, and user information in database for access anywhere
- Communication between client, server, and database

#### Running the Application

Link: https://cavespider1212.github.io/Flashcards-App/

*Note: although the app works on all devices, it looks the best when used on desktop*

#### Demonstration

1. When the application is first launched, users will be led to the Decks page. If the user is not logged in yet, they will be met with a message reading "Must be logged in to view decks!" This message is similar on other pages.

2. To log in, the user must go to "Login/Register" on the top right. The page is shown below. If the user already has an existing account, log in using the two text inputs on the top, otherwise register with the inputs on the bottom. The user will be navigated to the "Decks" page after successfully logging in/registering.

<img width="717" height="686" alt="image" src="https://github.com/user-attachments/assets/8f81b047-b357-4e18-a0b0-143265e804da" />

3. If the user is logged in but there are no decks created yet, there will be a message instructing the user how to do so. Otherwise, an overview of the user's created decks will be shown.

4. Users must go to the "Manage Deck" page to create a deck. The page is shown below:

<img width="784" height="234" alt="image" src="https://github.com/user-attachments/assets/dfb8e261-0ad9-4edb-bf32-536f62e94e27" />

5. The user can add terms/definitions to the deck, as well as give it a name. Clicking on a card flips it between the term and definition. Clicking the "Edit" button under a card allows the user to edit the term or definition of the card, and clicking "Delete" removes the card from the deck.

<img width="552" height="945" alt="image" src="https://github.com/user-attachments/assets/e1b159ae-ba6c-4b92-9994-ef1333187db6" />

6. Clicking the green "Save Deck" button will save the deck to the local storage, and navigate the user to the "Decks" page, where an overview of all decks they have created are shown. Clicking "Edit" navigates the user to the Manage Deck page with this deck already loaded. Clicking "Study" navigates the user to the Study page with the deck selected. Clicking "Delete" removes the deck from the local storage.

<img width="1918" height="324" alt="image" src="https://github.com/user-attachments/assets/e8cd68f5-4c6d-4103-ab3d-1e09334e44ab" />

7. In the Study page, the user can select a deck using the dropdown menu. Once selected, the deck will be loaded onto the screen, where the user can use the left and right arrow buttons to go through the cards. Clicking a card will flip it.

<img width="1915" height="536" alt="image" src="https://github.com/user-attachments/assets/ba6cd34e-a8d8-4faf-858a-1cbba469cf86" />

8. If the user wishes to log out of the application, they may click on the "Logged in as {username}" button on the top right of the navigation bar. They will be met with the page shown below, where they can click "Log out" to log out successfully.

<img width="345" height="247" alt="image" src="https://github.com/user-attachments/assets/d2af5cef-504a-4c4f-a2a7-d7cd54fc8b00" />

