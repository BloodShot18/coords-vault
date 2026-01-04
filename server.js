const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
//app.use(express.static("public"));
app.use(express.static("public"));
// DB Setup
const db = new sqlite3.Database("messages.db");
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    x TEXT,
    y TEXT,
    hash TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Generate random coordinate
function generateCoord() {
  return Math.floor(10000000 + Math.random() * 89999999).toString();
}

// Save Message
app.post("/save", (req, res) => {
  const { message } = req.body;
  const x = generateCoord();
  const y = generateCoord();
  const hash = crypto.createHash("sha256").update(x + y).digest("hex");

  db.run(
    `INSERT INTO messages (x, y, hash, message) VALUES (?, ?, ?, ?)`,
    [x, y, hash, message],
    () => res.json({ x, y }) // return coords to user
  );
});

// Retrieve Message
app.post("/get", (req, res) => {
  const { x, y } = req.body;
  const hash = crypto.createHash("sha256").update(x + y).digest("hex");

  db.get(`SELECT message FROM messages WHERE hash = ?`, [hash], (err, row) => {
    if (!row) return res.json({ found: false });
    res.json({ found: true, message: row.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
//app.listen(3000, () => console.log("Server running on port 3000"));
