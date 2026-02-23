const express = require("express");
const { saveUser } = require("../db/db");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/object", (req, res) => {
  res.status(200).json({
    message: "Hello, World everybody!",
    timestamp: new Date(),
    status: "success",
  });
});

app.post("/api/users", async (req, res) => {
  try {
    const newUser = await saveUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;
