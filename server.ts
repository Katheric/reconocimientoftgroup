import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("kudos.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY,
    name TEXT,
    logo TEXT,
    primaryColor TEXT,
    secondaryColor TEXT,
    votingOpen INTEGER DEFAULT 1,
    showResults INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS periods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    startDate DATE,
    endDate DATE,
    isActive INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS values_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    emoji TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS collaborators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    isAdmin INTEGER DEFAULT 0,
    avatar TEXT,
    area TEXT
  );

  CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS recognitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fromId INTEGER,
    toId INTEGER,
    valueId INTEGER,
    periodId INTEGER,
    story TEXT,
    score INTEGER DEFAULT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrations for existing databases
try { db.prepare("ALTER TABLE values_list ADD COLUMN image TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE recognitions ADD COLUMN score INTEGER DEFAULT NULL").run(); } catch (e) {}
try { db.prepare("ALTER TABLE recognitions ADD COLUMN periodId INTEGER").run(); } catch (e) {}
try { db.prepare("ALTER TABLE company ADD COLUMN showResults INTEGER DEFAULT 0").run(); } catch (e) {}
try { db.prepare("ALTER TABLE collaborators ADD COLUMN area TEXT").run(); } catch (e) {}


// Seed initial data if empty
const companyCount = db.prepare("SELECT count(*) as count FROM company").get() as { count: number };
if (companyCount.count === 0) {
  db.prepare("INSERT INTO company (id, name, primaryColor, secondaryColor) VALUES (?, ?, ?, ?)").run(
    1, "Metodo SFT", "#6366f1", "#10b981"
  );
  
  const values = [
    { name: "Innovación", emoji: "🚀", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800" },
    { name: "Compromiso", emoji: "🤝", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" },
    { name: "Excelencia", emoji: "✨", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" },
    { name: "Empatía", emoji: "❤️", image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?auto=format&fit=crop&q=80&w=800" }
  ];
  const insertValue = db.prepare("INSERT INTO values_list (name, emoji, image) VALUES (?, ?, ?)");
  values.forEach(v => insertValue.run(v.name, v.emoji, v.image));

  const collaborators = [
    { name: "Katheric", email: "kath@metodosft.com", isAdmin: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Katheric" },
    { name: "Laura", email: "laura@metodosft.com", isAdmin: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura" },
    { name: "Carlos", email: "carlos@metodosft.com", isAdmin: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" }
  ];
  const insertCollab = db.prepare("INSERT INTO collaborators (name, email, isAdmin, avatar) VALUES (?, ?, ?, ?)");
  collaborators.forEach(c => insertCollab.run(c.name, c.email, c.isAdmin, c.avatar));

  const initialAreas = ["Administración", "Ventas", "Operaciones", "Marketing", "Sistemas", "Recursos Humanos"];
  const insertArea = db.prepare("INSERT OR IGNORE INTO areas (name) VALUES (?)");
  initialAreas.forEach(name => insertArea.run(name));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.get("/api/config", (req, res) => {
    const company = db.prepare("SELECT * FROM company WHERE id = 1").get();
    const values = db.prepare("SELECT * FROM values_list").all();
    const collaborators = db.prepare("SELECT * FROM collaborators").all();
    const periods = db.prepare("SELECT * FROM periods").all();
    const areas = db.prepare("SELECT * FROM areas").all();
    res.json({ company, values, collaborators, periods, areas });
  });

  app.post("/api/company", (req, res) => {
    const { name, logo, primaryColor, secondaryColor, votingOpen, showResults } = req.body;
    db.prepare(`
      UPDATE company 
      SET name = ?, logo = ?, primaryColor = ?, secondaryColor = ?, votingOpen = ?, showResults = ?
      WHERE id = 1
    `).run(name, logo, primaryColor, secondaryColor, votingOpen ? 1 : 0, showResults ? 1 : 0);
    res.json({ success: true });
  });

  app.post("/api/values", (req, res) => {
    const { name, emoji, image } = req.body;
    db.prepare("INSERT INTO values_list (name, emoji, image) VALUES (?, ?, ?)").run(name, emoji, image);
    res.json({ success: true });
  });

  app.patch("/api/values/:id", (req, res) => {
    const { name, emoji, image } = req.body;
    db.prepare("UPDATE values_list SET name = ?, emoji = ?, image = ? WHERE id = ?").run(name, emoji, image, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/values/:id", (req, res) => {
    db.prepare("DELETE FROM values_list WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/collaborators/:id", (req, res) => {
    db.prepare("DELETE FROM collaborators WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/collaborators", (req, res) => {
    const { name, email, isAdmin, area } = req.body;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    db.prepare("INSERT INTO collaborators (name, email, isAdmin, avatar, area) VALUES (?, ?, ?, ?, ?)").run(name, email, isAdmin ? 1 : 0, avatar, area || null);
    res.json({ success: true });
  });

  app.patch("/api/collaborators/:id", (req, res) => {
    const { isAdmin, avatar, name, email, area } = req.body;
    if (avatar) {
      db.prepare("UPDATE collaborators SET avatar = ? WHERE id = ?").run(avatar, req.params.id);
    } else if (name !== undefined || email !== undefined || area !== undefined || isAdmin !== undefined) {
      const current = db.prepare("SELECT * FROM collaborators WHERE id = ?").get() as any;
      const finalName = name !== undefined ? name : current.name;
      const finalEmail = email !== undefined ? email : current.email;
      const finalArea = area !== undefined ? area : current.area;
      const finalIsAdmin = isAdmin !== undefined ? (isAdmin ? 1 : 0) : current.isAdmin;
      
      db.prepare("UPDATE collaborators SET name = ?, email = ?, area = ?, isAdmin = ? WHERE id = ?").run(
        finalName, finalEmail, finalArea, finalIsAdmin, req.params.id
      );
    }
    res.json({ success: true });
  });

  app.post("/api/collaborators/bulk", (req, res) => {
    const { members } = req.body; // Array of { name, email, isAdmin, area }
    const insert = db.prepare("INSERT OR IGNORE INTO collaborators (name, email, isAdmin, avatar, area) VALUES (?, ?, ?, ?, ?)");
    const transaction = db.transaction((users) => {
      for (const user of users) {
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
        insert.run(user.name, user.email, user.isAdmin ? 1 : 0, avatar, user.area || null);
      }
    });
    transaction(members);
    res.json({ success: true });
  });

  app.get("/api/stats/top-nominators", (req, res) => {
    const activePeriod = db.prepare("SELECT id FROM periods WHERE isActive = 1").get() as { id: number } | undefined;
    const periodFilter = activePeriod ? `WHERE r.periodId = ${activePeriod.id}` : "";
    
    const stats = db.prepare(`
      SELECT c.id, c.name, c.avatar, COUNT(r.id) as count
      FROM collaborators c
      JOIN recognitions r ON c.id = r.fromId
      ${periodFilter}
      GROUP BY c.id
      ORDER BY count DESC
      LIMIT 5
    `).all();
    res.json(stats);
  });

  app.get("/api/areas", (req, res) => {
    const areas = db.prepare("SELECT * FROM areas").all();
    res.json(areas);
  });

  app.post("/api/areas", (req, res) => {
    const { name } = req.body;
    try {
      db.prepare("INSERT INTO areas (name) VALUES (?)").run(name);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "El área ya existe" });
    }
  });

  app.delete("/api/areas/:id", (req, res) => {
    db.prepare("DELETE FROM areas WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/recognitions", (req, res) => {
    try {
      const activePeriod = db.prepare("SELECT id FROM periods WHERE isActive = 1").get() as { id: number } | undefined;
      // If no active period, show all. If active period, show only those for that period.
      const periodFilter = activePeriod ? `WHERE r.periodId = ${activePeriod.id}` : "";

      const recognitions = db.prepare(`
        SELECT r.*, 
               f.name as fromName, f.avatar as fromAvatar,
               t.name as toName, t.avatar as toAvatar,
               v.name as valueName, v.emoji as valueEmoji, v.image as valueImage
        FROM recognitions r
        LEFT JOIN collaborators f ON r.fromId = f.id
        LEFT JOIN collaborators t ON r.toId = t.id
        LEFT JOIN values_list v ON r.valueId = v.id
        ${periodFilter}
        ORDER BY r.createdAt DESC
      `).all();
      res.json(recognitions);
    } catch (error) {
      console.error("Error fetching recognitions:", error);
      res.status(500).json({ error: "Error al obtener reconocimientos" });
    }
  });

  app.post("/api/recognitions", (req, res) => {
    try {
      const { fromId, toId, valueId, story } = req.body;
      console.log("POST /api/recognitions received:", { fromId, toId, valueId, storyLength: story?.length });
      
      const fId = Number(fromId);
      const tId = Number(toId);
      const vId = Number(valueId);

      if (isNaN(fId) || isNaN(tId) || isNaN(vId)) {
        console.warn("Invalid IDs provided:", { fromId, toId, valueId });
        return res.status(400).json({ error: "Los IDs proporcionados no son válidos." });
      }

      const activePeriod = db.prepare("SELECT id FROM periods WHERE isActive = 1").get() as { id: number } | undefined;
      console.log("Active period:", activePeriod);
      
      const pId = activePeriod ? activePeriod.id : null;

      if (!fId || !tId || !vId || !story || !story.trim()) {
        console.warn("Missing required fields in request body");
        return res.status(400).json({ error: "Faltan datos requeridos para el reconocimiento (compañero, valor o historia)." });
      }

      const result = db.prepare("INSERT INTO recognitions (fromId, toId, valueId, periodId, story) VALUES (?, ?, ?, ?, ?)").run(
        fId, tId, vId, pId, story.trim()
      );
      
      console.log("Recognition saved successfully, ID:", result.lastInsertRowid, "Changes:", result.changes);
      
      if (result.changes > 0) {
        res.json({ success: true, id: result.lastInsertRowid });
      } else {
        console.error("No rows were inserted into recognitions");
        res.status(500).json({ error: "No se pudo guardar el reconocimiento en la base de datos." });
      }
    } catch (error) {
      console.error("Error saving recognition:", error);
      res.status(500).json({ error: "Error interno al guardar el reconocimiento." });
    }
  });

  app.patch("/api/recognitions/:id/score", (req, res) => {
    const { score } = req.body;
    db.prepare("UPDATE recognitions SET score = ? WHERE id = ?").run(score, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/stats/ambassadors", (req, res) => {
    try {
      const activePeriod = db.prepare("SELECT id FROM periods WHERE isActive = 1").get() as { id: number } | undefined;
      const periodFilter = activePeriod ? `AND r.periodId = ${activePeriod.id}` : "";

      const ambassadors = db.prepare(`
        SELECT v.id as valueId, v.name as valueName, c.id as collabId, c.name as collabName, c.avatar as collabAvatar, AVG(r.score) as avgScore
        FROM recognitions r
        JOIN collaborators c ON r.toId = c.id
        JOIN values_list v ON r.valueId = v.id
        WHERE r.score IS NOT NULL ${periodFilter}
        GROUP BY v.id, c.id
        HAVING avgScore > 0
        ORDER BY v.id, avgScore DESC
      `).all();
      res.json(ambassadors);
    } catch (error) {
      console.error("Error fetching ambassadors:", error);
      res.status(500).json({ error: "Error al obtener embajadores" });
    }
  });

  // Periods Management
  app.get("/api/periods", (req, res) => {
    res.json(db.prepare("SELECT * FROM periods ORDER BY startDate DESC").all());
  });

  app.post("/api/periods", (req, res) => {
    const { name, startDate, endDate } = req.body;
    db.prepare("INSERT INTO periods (name, startDate, endDate) VALUES (?, ?, ?)").run(name, startDate, endDate);
    res.json({ success: true });
  });

  app.patch("/api/periods/:id/activate", (req, res) => {
    db.prepare("UPDATE periods SET isActive = 0").run();
    db.prepare("UPDATE periods SET isActive = 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/periods/:id", (req, res) => {
    db.prepare("DELETE FROM periods WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
