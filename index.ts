import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import path from "path";

dotenv.config();

const db = new sqlite3.Database(path.join(__dirname, "food.sqlite"));

const app: Express = express();

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  if (!req.query.ingredient) {
    res.json({ err: "No ingredient provided" });
  } else if (typeof req.query.ingredient !== "string") {
    res.json({ err: "Ingredient must be a string" });
  } else if (!/^[a-zA-Z ]+$/.test(req.query.ingredient)) {
    res.json({ err: "Only letters allowed" });
  }
  console.log("req.query.ingredient", [`%${req.query.ingredient}%`]);
  db.all(
    "SELECT * FROM ingredient WHERE name LIKE ? LIMIT 50;",
    [`%${req.query.ingredient}%`],
    (err: any, rows: any) => {
      if (err) {
        res.json({ err });
      }
      res.json(rows);
    }
  );
});

app.get(`/ingredient/:id`, (req: Request, res: Response) => {
  console.log("req.params.id", typeof req.params.id);
  db.all(
    `SELECT * FROM ingredient
      JOIN source_on_ingredient ON ingredient.ingredient_id = source_on_ingredient.ingredient_id
      JOIN source ON source_on_ingredient.source_id = source.source_id
      WHERE ingredient.ingredient_id = ?;
   `,
    [req.params.id],
    (err: any, rows: any) => {
      console.log(err);
      if (err) {
        res.json({ err });
      }
      res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
