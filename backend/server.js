require('dotenv').config();
const http = require("http");
const app = require("./src/app");
const { Server } = require("socket.io");
const socketManager = require("./src/sockets/socketManager");

const server = http.createServer(app);
const io = new Server(server, {
  // cors: {
  //   origin: "*",
  // },
  // deployment changes
  cors: {
  origin: "https://collab-code.vercel.app",
  methods: ["GET", "POST"],
  credentials: true,
  },
});

socketManager(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
