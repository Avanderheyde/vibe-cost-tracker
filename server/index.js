import express from "express";
import { readFileSync, writeFileSync, mkdirSync, renameSync } from "fs";
import { dirname } from "path";

const DATA_PATH = process.env.DATA_PATH || "/data/store.json";
const PORT = process.env.PORT || 3001;
const EMPTY = JSON.stringify({ projects: [], subscriptions: [] });

mkdirSync(dirname(DATA_PATH), { recursive: true });

function read() {
  try {
    return readFileSync(DATA_PATH, "utf-8");
  } catch {
    return EMPTY;
  }
}

function write(json) {
  const tmp = DATA_PATH + ".tmp";
  writeFileSync(tmp, json, "utf-8");
  renameSync(tmp, DATA_PATH);
}

const app = express();
app.use(express.json({ limit: "5mb" }));

app.get("/api/data", (_req, res) => {
  res.type("json").send(read());
});

app.put("/api/data", (req, res) => {
  write(JSON.stringify(req.body));
  res.json({ ok: true });
});

app.post("/api/data/reset", (_req, res) => {
  write(EMPTY);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API server listening on :${PORT}`));
