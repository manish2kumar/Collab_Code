# Collab Code: Collaborative Editor & AI Code Review 

Collab Code is a dynamic web application that provides a collaborative real-time code editing experience, integrated with an AI-powered code review system. It allows multiple users to work on the same codebase simultaneously and get instant AI feedback on their code quality, best practices, and potential issues.


## Features

- **Real-time Collaborative Editing**  
  Multiple users can join a shared room and code together in real-time. Changes are instantly synchronized across all participants.

- **AI-Powered Code Review**  
  Get intelligent, detailed code reviews powered by the **Google Gemini AI**, focusing on:
  - Code Quality & Readability  
  - Best Practices & Design Patterns  
  - Efficiency & Performance Bottlenecks  
  - Error Detection & Security Vulnerabilities  
  - Scalability & Maintainability

- **Multi-language Support**  
  Supports JavaScript, Python, Java, and C++.

- **Live Code Execution**  
  Compile and run your code directly within the editor and see the output in the integrated console.

- **User Presence & Typing Indicators**  
  See who is in your room and when others are typing.

- **Dynamic UI**  
  Engaging animations for joining rooms and dynamic text effects for enhanced UX.


## Technologies Used

### Frontend
- **React**: JavaScript library for building UI.
- **Monaco Editor**: Code editor that powers VS Code.
- **Socket.IO Client**: For real-time communication.
- **React Markdown & Rehype Highlight**: For rendering markdown with syntax highlighting.
- **CSS3**: Modern styling and responsive design.

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Minimalist web framework.
- **Socket.IO**: Real-time communication.
- **Axios**: HTTP client for API requests.
- **Google Gemini API**: Powers the AI code review system.
- **Piston API**: Public API for code execution.
- **dotenv**: Manages environment variables.

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### API Keys

**Google Gemini API Key**:
1. Go to Google AI Studio and generate a key.
2. Create a `.env` file in the `backend` directory.
3. Add the following:
`GOOGLE_GEMINI_KEY=your_api_key_here`
## Local Development

1. Clone the repository:

```bash
git clone https://github.com/manish2kumar/Collab_Code
cd Collab_Code
```
2. Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```
3. Start the backend server:

```bash
node server.js
```
The backend server will typically run on http://localhost:5000

4. Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```
5. Start the frontend development server:


```bash
npm run dev
```
The frontend application will typically open in your browser at http://localhost:5173

## Usage

### Join a Room:

Upon launching the application, you'll see a **"Join Code Room"** page.

You can either:

- Enter an existing **Room ID** if someone has already created one.
- Click **Create New Room ID** to generate a unique ID for a new session.
- Enter your **Your Name** (this is how you'll be identified in the room).
- Click **Join Room**.

### Collaborate:

- Once in the room, you'll see the code editor, user list, and output/review panels.
- Start typing code in the editor. Your changes are synchronized in real-time with other users in the same room.
- Select your preferred programming language from the dropdown.

### Run Code:

- Enter any necessary input into the **"Enter input here..."** console.
- Click the **Execute Code** button to compile and run your code.
- The output will appear in the **"Code output will appear here..."** console.

### Get Code Review:

- When you want feedback on your code, click the **Get Code Review** button.
- Initially, the code review panel will display a dynamic typing animation with phrases like *"Review your code..."*, *"Analyzing structure..."*, etc.
- After the AI processes your request, a detailed review will appear in the right-hand panel.

### Leave Room:

- Click the **Leave Room** button to exit the current collaborative session.

## Project Structure

```bash
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── ai.controller.js        
│   │   ├── routes/
│   │   │   └── ai.routes.js            
│   │   ├── services/
│   │   │   └── ai.services.js          
│   │   ├── socket/
│   │   │   └── socketManager.js   
│   │   └── app.js                    
│   ├── server.js                  
│   ├── package.json
│   └── .env                        
├── frontend/
│   ├── public/
│   │   │   └── log.png
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css                
│   │   ├── App.jsx                 
│   │   ├── index.css               
│   │   └── main.jsx              
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             
└── README.md
```           
## Screenshots

Here are some screenshots showcasing the application's interface:

- **Join Room Page**
  ![Join Room Page](https://github.com/manish2kumar/Collab_Code/blob/main/screenshorts/Join%20Room%20Page.png)

- **Collaborative Editor Interface**
  ![Collaborative Editor Interface](https://github.com/manish2kumar/Collab_Code/blob/main/screenshorts/Collaborative%20Editor%20Interface.png)

- **AI Code Review in Action**
  ![AI Code Review in Action](https://github.com/manish2kumar/Collab_Code/blob/main/screenshorts/AI%20Code%20Review%20in%20Action.png)
  
