const { saveUser, pool } = require("./db");

describe("database tests", () => {
  beforeAll(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(100) NOT NULL,
      lastname VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );
  `);
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM users");
    testUser = {
      firstname: "John",
      lastname: "Doe",
      email: "johnDoe@gmail.com",
    };
  });

  test("trow error if missing informations", () => {
    expect(() => saveUser({ ...testUser, email: undefined })).rejects.toThrow(
      "Mising user informations",
    );
  });

  test("throw error is email is invalid", async () => {
    await expect(() =>
      saveUser({ ...testUser, email: "ohnDoe@gmail.com.caCrash/" }),
    ).rejects.toThrow("Email is invalid");
  });

  test("four special emails are valids", async () => {
    const emailsToTest = [
      "jean@122.31.5.21",
      "jean@gmail.com",
      "jean+spam@gmail.com",
      "jean@justice.gouv.fr",
    ];

    emailsToTest.forEach(async (email, i) => {
      const userData = {
        firstname: "Jean",
        lastname: "Jean",
        email,
      };

      const result = await saveUser(userData);
      expect(result.firstname).toBe("Jean");
      expect(result.lastname).toBe("Jean");
      expect(result.email).toBe(email);
    });
  });

  test("throw error if email already exists", async () => {
    await saveUser(testUser);
    await expect(saveUser(testUser)).rejects.toThrow("Email already exists");
  });

  test("create user for valid values", async () => {
    const result = await saveUser(testUser);
    expect(result.firstname).toBe(testUser.firstname);
    expect(result.lastname).toBe(testUser.lastname);
    expect(result.email).toBe(testUser.email);
  });

  test("create user with spaces", async () => {
    const userDataWithSpaces = {
      firstname: "  John ",
      lastname: " Doe   ",
      email: "    johnDoe33@gmail.com",
    };
    const result = await saveUser(userDataWithSpaces);
    expect(result.firstname).toBe("John");
    expect(result.lastname).toBe("Doe");
    expect(result.email).toBe("johnDoe33@gmail.com");
  });

  test("create user with numbers", async () => {
    await expect(() =>
      saveUser({
        ...testUser,
        firstname: 33,
        lastname: 253626176388251872584651657658581578585781858585,
      }),
    ).rejects.toThrow("firstname and lastname must be of type string");
  });

  afterAll(async () => {
    await pool.end();
  });
});
