const { Pool } = require("pg");

const pool = new Pool({
  user: "test",
  host: "localhost",
  database: "test_db",
  password: "test",
  port: 5432,
});

const saveUser = async (userValues) => {
  const query = `
   INSERT INTO users (firstname, lastname, email)
   VALUES ($1, $2, $3)
   RETURNING *
  `;

  userValues = validateFields(userValues);

  try {
    const result = await pool.query(query, userValues);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }
    throw new Error("Failed to save user");
  }
};

const validateFields = (userValues) => {
  if (
    !userValues ||
    !userValues.firstname ||
    !userValues.lastname ||
    !userValues.email
  ) {
    throw new Error("Mising user informations");
  }
  if (
    typeof userValues.firstname !== "string" ||
    typeof userValues.lastname !== "string"
  ) {
    throw new Error("firstname and lastname must be of type string");
  }
  if (!isEmailValid(userValues.email.trim())) {
    throw new Error("Email is invalid");
  }

  return [
    userValues.firstname.trim(),
    userValues.lastname.trim(),
    userValues.email.trim(),
  ];
};

const isEmailValid = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})$/;
  return emailRegex.test(email);
};

module.exports = {
  pool,
  saveUser,
};
