const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
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

  const timestamp = Date.now()
  const minimumPasswordLength = 8;

  if (password !== passwordConfirmation) {
    res.status(400)
    res.send({ error: { message: 'Passwords do not match' } })
    return
  }

  if (password.length < minimumPasswordLength || passwordConfirmation.length < minimumPasswordLength) {
    res.status(400)
    res.send({ error: { message: `Password must be ${minimumPasswordLength} or more characters` } })
    return
  }

  passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const queryString = `INSERT INTO users(
      email_address,
      created_at,
      is_active,
      is_premium,
      password_hash
    ) VALUES(
      '${form.email}',
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
}

module.exports = {
  register,
}