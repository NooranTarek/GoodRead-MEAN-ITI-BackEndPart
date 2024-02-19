const router = require('express').Router();
const { UserController } = require('../Controller');
const asyncWrapper = require('../lib/asyncWrapper');
router.post('/register',UserController.register);
/*router.post('/register', async (req, res, next) => {
    try {
        const [err, data] = await asyncWrapper(UserController.register(req.body));
        if (!err) {
            res.json({ message: 'User created successfully', data });
        }
    } catch (error) {
        next(error);
    }
});*/

module.exports = router;
