const JWT = require('jsonwebtoken');
const AppError = require('../lib/appError');
const { hashFunction, compareFunction } = require('../lib/hashAndCompare');
const Users = require('../models/user');
const { sendEmail } = require('../emailing/user.email');
const { emailHtml } = require('../emailing/email.html');

// module.exports = { register };
const register = async (userData) => {
  const {
    firstName, lastName, email, password, image,
  } = userData;
  const hashedPassword = await hashFunction({ plainText: password });
  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    image,
  }).catch((err) => {
    throw new AppError(err.message, 400);
  });
  sendEmail({ email, html: emailHtml(newUser.username) });
  return newUser;
};
// login user
const login = async (userData) => {
  const { username, password } = userData;
  const userExist = await Users.findOne({ username });
  if (!userExist) {
    throw new AppError('sorry there is no user with this username', 400);
  } else {
    const match = await compareFunction({
      plainText: password,
      hash: userExist.password,
    });
    if (!match) {
      throw new AppError(
        "Passwords don't match .. try to fill them again",
        400,
      );
    } else {
      const token = JWT.sign({ userExist }, process.env.JWT_KEY);
      return token;
    }
  }
};
// user make rating
const updateRating = async (userId, bookId, newRating) => {
  try {
    const user = await Users.findById(userId);

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

// user add book to his list

const updateShelve = async (userId, bookId, newShelf) => {
  try {
    const user = await Users.findById(userId);

    const bookIndex = user.books.findIndex((book) => book.idOfBook.toString() === bookId);

    if (bookIndex !== -1) {
      user.books[bookIndex].shelf = newShelf;
    } else {
      user.books.push({ idOfBook: bookId, shelf: newShelf });
    }

    await user.save();

    return { success: true, message: 'Shelf updated successfully' };
  } catch (error) {
    return { success: false, message: 'Error updating shelf', error };
  }
};

module.exports = {
  register, login, updateRating, updateShelve,
};
