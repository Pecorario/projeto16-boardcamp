import dayjs from 'dayjs';

import { db } from "../database/database.connection.js"

export async function getAllCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM customers;`);

    const formatedData = customers.rows.map(row => {
      const newRow = {
        ...row,
        birthday: dayjs(row.birthday).format('YYYY-MM-DD'),
      }

      return newRow;
    })

    return res.send(formatedData);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const resCustomers = await db.query(`
          SELECT * FROM customers WHERE id=$1;
        `, [id]);

    if (customer.rowCount === 0) return res.sendStatus(404);

    const customers = resCustomers.rows.map(row => {
      const newRow = {
        ...row,
        birthday: dayjs(row.birthday).format('YYYY-MM-DD'),
      }

      return newRow;
    })

    return res.send(customers[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customerExists = await db.query(
      `
        SELECT * FROM customers WHERE cpf=$1;
      `, [cpf]);

    if (customerExists.rowCount > 0) {
      return res.sendStatus(409);
    };

    await db.query(
      `
        INSERT INTO customers (name, phone, cpf, birthday) 
          VALUES ($1, $2, $3, $4);
      `, [name, phone, cpf, birthday]);

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteCustomer(req, res) {
  res.send("deleteCustomer");
}

export async function editCustomerById(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customer = await db.query(`
          SELECT * FROM customers WHERE id=$1;
        `, [id]);

    if (customer.rowCount === 0) return res.sendStatus(404);

    const customerExists = await db.query(
      `
        SELECT * FROM customers WHERE cpf=$1;
      `, [cpf]);

    if (customerExists.rows[0] && (customerExists.rows[0].id !== customer.rows[0].id)) {
      return res.sendStatus(409);
    };

    await db.query(`UPDATE customers SET name=$2, phone=$3, cpf=$4, birthday=$5 WHERE id=$1;`, [id, name, phone, cpf, birthday])

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}