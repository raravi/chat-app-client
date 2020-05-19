# chat-app-client

A chat app client written in React!

![license](https://img.shields.io/github/license/raravi/chat-app-client)&nbsp;&nbsp;![version](https://img.shields.io/github/package-json/v/raravi/chat-app-client)&nbsp;&nbsp;![coverage](https://img.shields.io/codecov/c/gh/raravi/chat-app-client)&nbsp;&nbsp;![dependencies](https://img.shields.io/depfu/raravi/chat-app-client)&nbsp;&nbsp;![last-commit](https://img.shields.io/github/last-commit/raravi/chat-app-client)&nbsp;&nbsp;[![Netlify Status](https://api.netlify.com/api/v1/badges/e5601703-91da-4653-9d4a-ce47971739fd/deploy-status)](https://app.netlify.com/sites/chat-raravi/deploys)

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

---

## Testing (Jest & React Testing Library)
This project has a code coverage of 100% with functional as well as unit tests written with care.
