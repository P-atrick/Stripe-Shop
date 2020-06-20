const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { query } = require('express');
const {
  secret,
  pgUser,
  pgHost,
  pgDb,
  pgPassword,
  pgPort,
} = require('../config/environment');

const pool = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDb,
  password: pgPassword,
  port: pgPort,
});

const register = async (req, res) => {
  const { form } = req.body;
  const { email, password, passwordConfirmation } = form;

  const timestamp = Date.now();
  const minimumPasswordLength = 8;

  const userExistsQueryString = `SELECT * FROM users WHERE email_address = '${email}'`;
  const userAlreadyExists = await pool
    .query(userExistsQueryString)
    .then((queryRes) => { return !!queryRes.rows.length; });

  if (userAlreadyExists) {
    res.status(400);
    res.send({ error: { message: 'This email is already registered' } });
    return;
  }

  if (password !== passwordConfirmation) {
    res.status(400);
    res.send({ error: { message: 'Passwords do not match' } });
    return;
  }

  if (password.length < minimumPasswordLength
    || passwordConfirmation.length < minimumPasswordLength) {
    res.status(400);
    res.send({ error: { message: `Password must be ${minimumPasswordLength} or more characters` } });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const queryString = `INSERT INTO users(
      email_address,
      created_at,
      is_active,
      is_premium,
      password_hash
    ) VALUES(
      '${email}',
      to_timestamp(${timestamp} / 1000.0),
      true,
      false,
      '${passwordHash}'
    )
    RETURNING *`;

  await pool.query(queryString, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      console.log(`Created ${queryRes.rowCount} new rows.`);
      const userId = queryRes.rows[0].user_id;
      const token = jwt.sign({ userId }, secret, { expiresIn: '1hr' });
      res.status(200).send({ token });
    }
  });
};

const login = async (req, res) => {
  const { form } = req.body;
  const { email, password } = form;

  const queryString = `SELECT * FROM users WHERE email_address = '${email}'`;

  await pool.query(queryString, (err, queryRes) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      const user = queryRes.rows[0];
      const passwordHash = user.password_hash;
      const validatePassword = bcrypt.compareSync(password, passwordHash);

      if (!validatePassword) {
        res.status(401).send({ error: { message: 'Email and/or password incorrect' } });
        return;
      }

      const token = jwt.sign({ userId: user.user_id }, secret, { expiresIn: '1hr' });
      res.status(200).send({ token });
    }
  });
};

module.exports = {
  register,
  login,
};
