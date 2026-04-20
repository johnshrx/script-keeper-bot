import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "allowed.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ users: [] }, null, 2));
  }
}

export async function getAllowed() {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    const json = JSON.parse(raw);
    return Array.isArray(json.users) ? json.users : [];
  } catch {
    return [];
  }
}

export async function isAllowed(userId) {
  const users = await getAllowed();
  return users.includes(userId);
}

export async function addAllowed(userId) {
  const users = await getAllowed();
  if (users.includes(userId)) return false;
  users.push(userId);
  await fs.writeFile(FILE, JSON.stringify({ users }, null, 2));
  return true;
}

export async function removeAllowed(userId) {
  const users = await getAllowed();
  if (!users.includes(userId)) return false;
  const next = users.filter((u) => u !== userId);
  await fs.writeFile(FILE, JSON.stringify({ users: next }, null, 2));
  return true;
}
