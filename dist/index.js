"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const db = new sqlite3_1.default.Database(path_1.default.join(__dirname, "food.sqlite"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get("/", (req, res) => {
    if (!req.query.ingredient) {
        res.json({ err: "No ingredient provided" });
    }
    else if (typeof req.query.ingredient !== "string") {
        res.json({ err: "Ingredient must be a string" });
    }
    else if (!/^[a-zA-Z ]+$/.test(req.query.ingredient)) {
        res.json({ err: "Only letters allowed" });
    }
    console.log("req.query.ingredient", [`%${req.query.ingredient}%`]);
    db.all("SELECT * FROM ingredient WHERE name LIKE ? LIMIT 50;", [`%${req.query.ingredient}%`], (err, rows) => {
        if (err) {
            res.json({ err });
        }
        res.json(rows);
    });
});
app.get(`/ingredient/:id`, (req, res) => {
    console.log("req.params.id", typeof req.params.id);
    db.all(`SELECT * FROM ingredient
      JOIN source_on_ingredient ON ingredient.ingredient_id = source_on_ingredient.ingredient_id
      JOIN source ON source_on_ingredient.source_id = source.source_id
      WHERE ingredient.ingredient_id = ?;
   `, [req.params.id], (err, rows) => {
        console.log(err);
        if (err) {
            res.json({ err });
        }
        res.json(rows);
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
