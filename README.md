Real-Time Chat App
A simple chat app built with React, TypeScript, Node.js, and Socket.IO, featuring Google login, chat rooms, and a clean Tailwind CSS interface with dark mode and logout options.
How to Set Up

Clone the Project:git clone https://github.com/vineethkarri/real-time-chat-app.git


Install Backend:cd backend
npm install


Install Frontend:cd ../frontend
npm install


Set Up Firebase:
Go to console.firebase.google.com.
Create a project and enable Google authentication.
Copy the Firebase config and add it to frontend/.env:REACT_APP_FIREBASE_API_KEY=AIzaSyBykqVU_AbOHIyedwZS-VyJlYfom7I0BkM
REACT_APP_FIREBASE_AUTH_DOMAIN=real-time-chat-app-1f1c5.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=real-time-chat-app-1f1c5
REACT_APP_FIREBASE_STORAGE_BUCKET=yreal-time-chat-app-1f1c5.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=126212588454




Run the App:
In the root folder:cd ..
npm install
npm run dev


Or run separately:cd backend
npm run dev

cd frontend
npm run dev




Open the App:
Visit http://localhost:3000 in your browser.



Features

Log in with Google.
Create or join chat rooms.
Send and receive messages in real-time.
See online users in each room.
Log out to end your session.
Switch between light and dark mode.

Video Demo
https://drive.google.com/file/d/1MaxM1maeJCD6mIbOuhsVSKfu9Va0GmGy/view?usp=sharing
Running Tests

Backend tests:cd backend
npm test


Frontend tests:cd frontend
npm test


