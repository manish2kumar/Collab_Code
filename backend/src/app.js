const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// app.use(cors());
// for deployment
app.use(cors({
  origin: "https://collab-code.vercel.app",
  methods: ["GET", "POST"],
  credentials: true,
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running.");
});

app.use("/ai", aiRoutes);

module.exports = app;
