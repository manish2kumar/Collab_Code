import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // This will provide dark syntax highlighting
import { v4 as uuid } from "uuid";

const socket = io("http://localhost:5000");

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [version] = useState("*");
  const [codeReview, setCodeReview] = useState("");
  const [rightPanelWidth, setRightPanelWidth] = useState(350);
  const [userInput, setUserInput] = useState("");

  // State for animated typing text on the join page
  const [animatedPhrase, setAnimatedPhrase] = useState("");
  const headerPhrases = ["real time code editor", "code review"];
  const [headerPhraseIndex, setHeaderPhraseIndex] = useState(0);
  const [headerIsTyping, setHeaderIsTyping] = useState(true);
  const [headerCharIndex, setHeaderCharIndex] = useState(0);

  // State for the "review your code" animation in the right panel
  const reviewPlaceholderPhrase = "Review your code ☺️☺️☺️";
  const [placeholderAnimatedText, setPlaceholderAnimatedText] = useState("");
  const [placeholderCharIndex, setPlaceholderCharIndex] = useState(0);
  const [placeholderIsTyping, setPlaceholderIsTyping] = useState(true);

  // Effect for the join page header typing animation
  useEffect(() => {
    if (!joined) { // Only run this animation when not joined
      const currentPhrase = headerPhrases[headerPhraseIndex];
      if (headerIsTyping) {
        if (headerCharIndex < currentPhrase.length) {
          const timeout = setTimeout(() => {
            setAnimatedPhrase(prev => prev + currentPhrase[headerCharIndex]);
            setHeaderCharIndex(prev => prev + 1);
          }, 100); // Typing speed
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setHeaderIsTyping(false);
          }, 1500); // Delay before erasing
          return () => clearTimeout(timeout);
        }
      } else { // Erasing
        if (headerCharIndex > 0) {
          const timeout = setTimeout(() => {
            setAnimatedPhrase(prev => prev.substring(0, prev.length - 1));
            setHeaderCharIndex(prev => prev - 1);
          }, 50); // Erasing speed
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setHeaderIsTyping(true);
            setHeaderPhraseIndex(prev => (prev + 1) % headerPhrases.length);
          }, 700); // Delay before typing next phrase
          return () => clearTimeout(timeout);
        }
      }
    }
  }, [headerCharIndex, headerIsTyping, headerPhraseIndex, joined]);

  // Effect for the "review your code" placeholder animation
  useEffect(() => {
    if (joined && !codeReview) { // Only animate when joined and no review present
      const currentPhrase = reviewPlaceholderPhrase;
      if (placeholderIsTyping) {
        if (placeholderCharIndex < currentPhrase.length) {
          const timeout = setTimeout(() => {
            setPlaceholderAnimatedText(prev => prev + currentPhrase[placeholderCharIndex]);
            setPlaceholderCharIndex(prev => prev + 1);
          }, 100); // Typing speed
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setPlaceholderIsTyping(false);
          }, 1500); // Delay before erasing
          return () => clearTimeout(timeout);
        }
      } else { // Erasing
        if (placeholderCharIndex > 0) {
          const timeout = setTimeout(() => {
            setPlaceholderAnimatedText(prev => prev.substring(0, prev.length - 1));
            setPlaceholderCharIndex(prev => prev - 1);
          }, 50); // Erasing speed
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setPlaceholderIsTyping(true);
            // No phrase index, just cycle this one phrase
          }, 700); // Delay before typing again
          return () => clearTimeout(timeout);
        }
      }
    } else {
      // If codeReview is present or not joined, ensure placeholder animation is reset/stopped
      setPlaceholderAnimatedText("");
      setPlaceholderCharIndex(0);
      setPlaceholderIsTyping(true); // Reset to typing state for next time it becomes visible
    }
  }, [placeholderCharIndex, placeholderIsTyping, joined, codeReview]);


  useEffect(() => {
    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 15)}... is typing`);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("languageUpdate", (newLanguage) => setLanguage(newLanguage));
    socket.on("codeResponse", (response) => setOutPut(response.run.output));
    socket.on("reviewResult", (review) => {
      setCodeReview(review);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
      socket.off("reviewResult");
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
      // Reset header animation state when joining a room
      setAnimatedPhrase("");
      setHeaderPhraseIndex(0);
      setHeaderIsTyping(true);
      setHeaderCharIndex(0);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
    setOutPut("");
    setCodeReview("");
    setUserInput("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    socket.emit("compileCode", {
      code,
      roomId,
      language,
      version,
      input: userInput,
    });
  };

  const createRoomId = () => setRoomId(uuid());

  const fetchCodeReview = () => {
    socket.emit("codeReview", { code, language, roomId });
  };

  const handleResize = (e) => {
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      if (newWidth > 250 && newWidth < window.innerWidth * 0.7) {
        setRightPanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-header">
          <h1>COLLAB CODE</h1>
          <div className="animated-text-container">
            <span className="animated-text">{animatedPhrase}</span>
          </div>
        </div>
        <div className="join-form">
          <h1>Join Code Room</h1>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={createRoomId}>Create New Room ID</button>
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>Room ID: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">
            Copy ID
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
        <h3>Users in Room:</h3>
        <ul>{users.map((user, i) => <li key={i}>{user}</li>)}</ul>
        <p className="typing-indicator">{typing}</p>
        <select className="language-selector" value={language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
        <button className="run-btn" onClick={runCode}>Execute Code</button>
        <button className="code-review-btn" onClick={fetchCodeReview}>Get Code Review</button>
      </div>

      <div className="editor-wrapper">
        <div className="editor-main">
          <Editor
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              padding: { top: 15 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="console-container">
          <textarea
            className="input-console"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter input here..."
            spellCheck="false"
          />
          <textarea
            className="output-console"
            value={outPut}
            readOnly
            placeholder="Code output will appear here..."
            spellCheck="false"
          />
        </div>
      </div>

      <div className="right-panel" style={{ width: rightPanelWidth }}>
        <div className="right-panel-content">
          <div className="code-review-main-wrapper"> {/* This wrapper always has the border */}
            {codeReview ? (
              <div className="code-review"> {/* This has the watermark */}
                <h3>Code Review:</h3>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {codeReview}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="code-review-placeholder-state"> {/* This has the typing animation */}
                <span className="placeholder-animated-text">{placeholderAnimatedText}</span>
              </div>
            )}
          </div>
        </div>
        <div className="resize-handle" onMouseDown={handleResize} />
      </div>
    </div>
  );
};

export default App;
