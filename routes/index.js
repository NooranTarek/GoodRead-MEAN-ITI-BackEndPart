const router = require('express').Router();

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/admin', require('./admins'));

// router.use('/categories', require('./categories'));
// router.use('/admin',require('./admins'));
module.exports = router;
