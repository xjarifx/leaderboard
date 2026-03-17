import fs from "fs";
import path from "path";

const ROOT = "public/images-webp";

function actorSlug(folderName) {
  return folderName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function renameActorDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".webp")).sort();
  if (files.length === 0) return;
  const actor = actorSlug(path.basename(dir));
  files.forEach((file, i) => {
    const num = String(i + 1).padStart(2, "0");
    const newName = `${num}_${actor}.webp`;
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, newName);
    if (file === newName) return;
    if (fs.existsSync(newPath)) {
      const tmp = path.join(dir, `__tmp_${Date.now()}_${i}.webp`);
      fs.renameSync(oldPath, tmp);
      fs.renameSync(tmp, newPath);
    } else {
      fs.renameSync(oldPath, newPath);
    }
    console.log(`${file} -> ${newName}`);
  });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const hasFiles = entries.some(e => e.isFile() && e.name.endsWith(".webp"));
  if (hasFiles) renameActorDir(dir);
  for (const entry of entries) {
    if (entry.isDirectory()) walk(path.join(dir, entry.name));
  }
}

walk(ROOT);
console.log("Done.");
