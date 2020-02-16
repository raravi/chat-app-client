# chat-app-client

A chat app client written in React!

This Chat Client has the following functionality:
1. Register a new user.
2. Login an existing user.
3. Forgot Password functionality.
4. Once logged in, User can retrieve chat history and chat with connected users.

## Registering a new user
A new user has to enter their details (name, email, password). The details will be sent to the `/register` API endpoint and the server tries to register the new user. If there are errors, server responds with the specific errors. If not, the user will be registered in the DB and success notification is sent back.

## Login an existing user
User enters their details (email & password). The details will be sent to the `/login` API endpoint and the server tries to login the user. If there are errors, server responds with the specific errors. If not, the user will be logged in, session created, and success notification is sent back along with chat history.

## Forgot Password
User enters their details (email). The details will be sent to the `/forgotpassword` API endpoint and the server tries to send mail with reset details to the user. If there are errors, server responds with the specific errors. If not, the user will be sent an email with the reset token (a cryptographically secure random number), and success notification is sent back.

## Reset Password
The email sent will have a reset link where the user enters their details (email, reset token, new password). The details will be sent to the `/resetpassword` API endpoint and the server tries to reset the user. If there are errors, server responds with the specific errors. If not, the user will be reset, the reset token destroyed, new password updated in DB and then success notification is sent back.

## Chatting
User can read the chat history upon login. They can send & receive messages in realtime with whoever is connected to the server!

Note: I've added elements to the application to experiment with the new trend of [neumorphism](https://uxdesign.cc/neumorphism-in-user-interfaces-b47cef3bf3a6), you can disable it by modifying the `drop-shadow` property for the relevant elements in the DOM!
