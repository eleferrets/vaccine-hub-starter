const db = require("../db");
const { UnauthorizedError } = require("../utils/errors");

class User {
  static async login(credentials) {
    // user should submit email and password
    // if any fields are missing, throw an error

    // lookup the user in the db by email
    // if a user is found, compare the submitted password
    // with the password in the db
    // if is a match, return user

    // if anything else is wrong, throw an error
    throw new UnauthorizedError("Invalid email/password combo");
  }
  static async register(credentials) {
    // user should submit email, pw, rsvp status, and # of guests
    // if any of fields are missing, throw error
    // make sure no user already exists in the system with that email
    // if one does, throw and error
    // take the users password, and hash it
    // take the users email and lowercase it
    // create a new user in the db with all info
    // return the user
  }
}
module.exports = User;
