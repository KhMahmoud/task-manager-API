

const express = require("express");

const app = express();
app.use(express.json());

const tasks = [];
let nextId = 1;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", (req, res) => {
  res.json({ count: tasks.length, tasks });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 2) {
    return res.status(400).json({ error: "title is required (min 2 chars)" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json(task);
});

const PORT = process.env.PORT || 3000;

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "task not found" });

  const { title, done } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ error: "title must be a string (min 2 chars)" });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "done must be boolean" });
    }
    task.done = done;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "task not found" });

  const deleted = tasks.splice(idx, 1)[0];
  res.json({ deleted });
});



app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
