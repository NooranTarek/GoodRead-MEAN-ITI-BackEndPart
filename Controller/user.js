const AppError = require('../lib/appError');
const { hashFunction } = require('../lib/hashAndCompare');
const Users = require('../models/user');

// Register user
/* const register = async (req, res ) => {
        const { firstName, lastName, email, password, repassword } = req.body;
        if (password !== repassword) {
            throw new appError("Passwords don't match .. try to fill them again", 400);
        } else {
            const hashedPassword = await hashFunction({ plainText: password }, { saltRounds: 8 });
            const newUser = await Users.create({ firstName, lastName, email, password: hashedPassword });
            res.status(201).json({ message: "User registered successfully", newUser });
        }
}; */

// module.exports = { register };

const register = async (userData) => {
  const {
    firstName, lastName, email, password, repassword,
  } = userData;
  // console.log(password);
  // console.log(repassword);
  if (password !== repassword) {
    throw new AppError("Passwords don't match .. try to fill them again", 400);
  } else {
    // console.log('HASHING');
    const hashedPassword = await hashFunction({ plainText: password }, { saltRounds: 8 });
    // console.log(hashedPassword);
    const newUser = await Users.create({
      firstName, lastName, email, password: hashedPassword,
    });
    // console.log(newUser);
    return newUser;
  }
};

module.exports = { register };
