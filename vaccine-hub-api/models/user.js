const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      date: user.date,
    };
  }
  static async login(credentials) {
    // user should submit email and password
    // if any fields are missing, throw an error
    const requiredFields = ["email", "password"];
    requiredFields.forEach((field) => {
      // Checks whether the credentials has the value we are trying to access
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });
    // lookup the user in the db by email
    const user = await User.fetchUserByEmail(credentials.email);
    // if a user is found, compare the submitted password
    // with the password in the db
    // if is a match, return user
    if (user) {
      // compare the password we have received with the user's password
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    // if anything else is wrong, throw an error
    throw new UnauthorizedError("Invalid email/password combo");
  }
  static async register(credentials) {
    // user should submit email, pw, rsvp status, and # of guests
    // if any of fields are missing, throw error
    const requiredFields = [
      "email",
      "password",
      "first_name",
      "last_name",
      "location",
    ];
    requiredFields.forEach((field) => {
      // Checks whether the credentials has the value we are trying to access
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });
    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }
    // make sure no user already exists in the system with that email
    // if one does, throw and error
    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }
    // take the users password, and hash it
    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );
    // take the users email and lowercase it

    const lowercasedEmail = credentials.email.toLowerCase();
    // create a new user in the db with all info

    const result = await db.query(
      `
    INSERT INTO users (
        email,
        password,
        first_name,
        last_name,
        location
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, first_name, last_name, location, date;`,
      [
        lowercasedEmail,
        hashedPassword,
        credentials.first_name,
        credentials.last_name,
        credentials.location,
      ]
    );
    // return the user
    const user = result.rows[0];
    return User.makePublicUser(user);
  }
  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }
    // The query where we get all the users

    // Query parameters are the $ thing, and that is useful for sql injection prevention,
    // so this is best practice
    const query = `SELECT * FROM users WHERE email = $1`;
    // Our query, and the array of all the parameters to be substituted into the query
    const result = await db.query(query, [email.toLowerCase()]);
    // Grab the first row of results provided by postgres
    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
