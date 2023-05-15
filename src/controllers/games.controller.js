import { db } from "../database/database.connection.js"

export async function getAllGames(req, res) {
  try {
    const games = await db.query(`SELECT * FROM games;`);
    console.table(games.rows);
    return res.send(games.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getGameById(req, res) {
  const { id } = req.params;

  try {
    const game = await db.query(`
          SELECT * FROM games WHERE id=$1;
        `, [id]);

    if (game.rowCount === 0) return res.sendStatus(404);

    return res.send(game.rows[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    const gameExists = await db.query(
      `
        SELECT * FROM games WHERE name=$1;
      `, [name]);

    if (gameExists.rowCount > 0) {
      return res.sendStatus(409);
    };

    await db.query(
      `
        INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
          VALUES ($1, $2, $3, $4);
      `, [name, image, stockTotal, pricePerDay]);

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteGame(req, res) {
  res.send("deleteGame");
}

export async function editGameById(req, res) {
  res.send("editGameById");
}