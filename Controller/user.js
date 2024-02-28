const JWT = require("jsonwebtoken");
const AppError = require("../lib/appError");
const { hashFunction, compareFunction } = require("../lib/hashAndCompare");
const Users = require("../models/user");

// module.exports = { register };
const register = async (userData) => {
  const { firstName, lastName, email, password } = userData;
  const hashedPassword = await hashFunction({ plainText: password });
  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  return newUser;
};

// login user
const login = async (userData) => {
  const { username, password } = userData;
  const userExist = await Users.findOne({ username });
  if (!userExist) {
    throw new AppError("sorry there is no user with this username", 400);
  } else {
    const match = await compareFunction({
      plainText: password,
      hash: userExist.password,
    });
    if (!match) {
      throw new AppError(
        "Passwords don't match .. try to fill them again",
        400
      );
    } else {
      const token = JWT.sign({ userExist }, process.env.JWT_KEY);
      return token;
    }
  }
};
const updateRating = async (userId, bookId, newRating) => {
  try {
    const user = await Users.findById(userId);
    // console.log(`check if found user ${user}`);
    const bookIndex = user.books.findIndex((book) => book.idOfBook.toString() === bookId);

    if (bookIndex !== -1) {
      user.books[bookIndex].rating = newRating;
    } else {
      user.books.push({ idOfBook: bookId, rating: newRating });
    }

    await user.save();

    return { success: true, message: 'Rating updated successfully' };
  } catch (error) {
    return { success: false, message: 'Error updating rating', error };
  }
};
module.exports = { register, login, updateRating };
