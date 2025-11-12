# Real-Time Topics Application

This project is a web application designed for teachers to collaborate on topics in real-time. It utilizes WebSockets to provide instant updates when a teacher modifies a topic, ensuring that all connected users are notified of changes and the user making those modifications.

## Project Structure

The project is divided into three main directories:

- **server**: Contains the backend application built with Express and TypeScript.
- **client**: Contains the frontend application built with React and TypeScript.
- **shared**: Contains shared TypeScript interfaces used by both the server and client.

## Features

- Real-time updates for topic modifications using WebSockets.
- Ability for teachers to create, update, and retrieve topics.
- Notifications to all connected teachers when a topic is modified.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd realtime-topics-app
   ```

2. Install dependencies for the server:

   ```
   cd server
   npm install
   ```

3. Install dependencies for the client:

   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```
   cd server
   npm start
   ```

2. Start the frontend application:

   ```
   cd ../client
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

- Teachers can log in and select a topic to edit.
- Any modifications made to a topic will be broadcasted to all other connected teachers in real-time.
- The application provides a user-friendly interface for managing topics and viewing updates.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.