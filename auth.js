const bcrypt = require("bcrypt");
const db = require("./database");

let currentUser = null;

const registerUser = (username, password) => {
  console.log("inside auth register");
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  const stmt = db.prepare(
    "INSERT INTO users (username, password) VALUES (?, ?)"
  );
  return stmt.run(username, hashedPassword);
};

const authenticateUser = (username, password) => {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  const user = stmt.get(username);
  if (user && bcrypt.compareSync(password, user.Password)) {
    currentUser = user;
    return user; // Return user details if authentication succeeds
  }
  return null; // Return null if authentication fails
};

const getCurrentAuthenticatedUser = () => {
  return currentUser;
};

const logoutAndReturnNullUser = () => {
  currentUser = null;
  return currentUser;
};

module.exports = {
  registerUser: registerUser,
  authenticateUser: authenticateUser,
  getCurrentAuthenticatedUser: getCurrentAuthenticatedUser,
  logoutAndReturnNullUser: logoutAndReturnNullUser,
};
