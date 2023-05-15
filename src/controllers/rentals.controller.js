import dayjs from 'dayjs';

import { db } from "../database/database.connection.js"

export async function getAllRentals(req, res) {
  try {
    const resRentals = await db.query(`
    SELECT rentals.*, customers.name as "customerName", games.name as "gameName"
      FROM rentals 
      JOIN customers 
        ON rentals."customerId"=customers.id
      JOIN games
        ON rentals."gameId"=games.id;
    `);

    const rentals = resRentals.rows.map(row => {
      const newObj = {
        ...row,
        rentDate: dayjs(row.rentDate).format('YYYY-MM-DD'),
        customer: {
          id: row.customerId,
          name: row.customerName,
        },
        game: {
          id: row.gameId,
          name: row.gameName,
        }
      };

      delete newObj.gameName;
      delete newObj.customerName;

      return newObj;
    })

    return res.send(rentals);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getRentalById(req, res) {
  const { id } = req.params;

  try {
    const resRentals = await db.query(`
    SELECT rentals.*, customers.name as "customerName", games.name as "gameName"
      FROM rentals 
      JOIN customers 
        ON rentals."customerId"=customers.id
      JOIN games
        ON rentals."gameId"=games.id
      WHERE rentals.id=$1;
    `, [id]);

    if (resRentals.rowCount === 0) return res.sendStatus(404);

    const rentals = resRentals.rows.map(row => {
      const newObj = {
        ...row,
        rentDate: dayjs(row.rentDate).format('YYYY-MM-DD'),
        customer: {
          id: row.customerId,
          name: row.customerName,
        },
        game: {
          id: row.gameId,
          name: row.gameName,
        }
      };

      delete newObj.gameName;
      delete newObj.customerName;

      return newObj;
    })

    return res.send(rentals[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
    const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);

    if (customer.rowCount === 0 || game.rowCount === 0) {
      return res.sendStatus(400);
    }

    const quantityOfGamesRented = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1`, [gameId]);

    if (quantityOfGamesRented.rows.length === game.rows[0].stockTotal) {
      return res.sendStatus(400);
    }

    const rentDate = dayjs().format('YYYY-MM-DD');
    const originalPrice = daysRented * game.rows[0].pricePerDay;

    await db.query(
      `
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
          VALUES ($1, $2, $3, $4, $5, null, null);
      `, [customerId, gameId, daysRented, rentDate, originalPrice]);

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


export async function returnRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`
    SELECT * FROM rentals WHERE id=$1;
    `, [id]);

    if (rental.rowCount === 0) return res.sendStatus(404);

    if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

    const returnDate = dayjs().format('YYYY-MM-DD');
    const rentDate = dayjs(rental.rows[0].rentDate).format('YYYY-MM-DD');

    const diffInMs = new Date(returnDate) - new Date(rentDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const daysInArrears = rental.rows[0].daysRented >= diffInDays ? 0 : diffInDays - rental.rows[0].daysRented;

    const delayFee = daysInArrears * (rental.rows[0].originalPrice / rental.rows[0].daysRented);

    await db.query(`UPDATE rentals SET "returnDate"=$2, "delayFee"=$3 WHERE id=$1;`, [id, returnDate, delayFee]);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`
    SELECT * FROM rentals WHERE id=$1;
    `, [id]);

    if (rental.rowCount === 0) return res.sendStatus(404);

    if (rental.rows[0].returnDate === null) return res.sendStatus(400);

    await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}