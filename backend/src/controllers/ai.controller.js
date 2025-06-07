const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const response = await aiService(code);
    res.json({ review: response });
  } catch (err) {
    console.error("AI review failed:", err);
    res.status(500).json({ error: "Error during code review" });
  }
};

