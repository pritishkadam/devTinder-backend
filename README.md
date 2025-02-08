# Tinder Clone - Backend

This project is inspired by an app called "tinder" - a dating application for general public. This application - "devTinder" is developed on similar lines but for fellow developers to connect and interact. This project is built using Node.js, Express.js, MongoDB, and many other tools.

## Tools Used

- Node.js
- Express.js
- MongoDB
- Mongoose

## APIs

- Registration API: To accept user details and register a user
- Login API: To authenticate a user
- Logout API: To log out a user from it's session and clear all the cookie/session details
- Profile View API: To view logged in user's profile details
- Profile Edit API: To edit logged in user's profile details
- Update Feed Profile API: To save profile status based on logged in user's action of sending a request or ignoring a developer profile
- Review Feed Profile API: To review a profile status and accept or reject a developer request that logged in user receives
- Received Requests API: To fetch the list of requests that logged in user has received
- Get Connections API: To fetch logged in user's connections list
- Get Messages API: To fetch logged in user's messages
- Feed API: To fetch list of developer profiles
- Profile Details API: To fetch profile details of a specific userID

## Future Improvements/Additions

- APIs to send and receive messages

## Tech Stack

- NodeJS: open-source, runtime environment containing a JS Engine(V8) for executing JS code outside of a browser
- ExpressJS: web application framework for Node.js
- MongoDB: non-relational database

## Dependencies

| npm modules    |
| -------------- |
| express        |
| mongoose       |
| validtor       |
| bcrypt         |
| cookie-parser  |
| cors           |
| json-web-token |
| multer         |

## Getting Started

### Prerequisites

- Node.js and npm should be installed on your machine

### Installation

1. Clone the repository

```
https://github.com/pritishkadam/devTinder-clone.git
```

2. Change into the project directory

```
cd devTinder-clone
```

3. Install the dependencies

```
npm install
```

4. Start the development server

```
npm run start
```

##### NOTE: In order to experience the full range of features offered by this application, it is essential to install the necessary external dependencies
