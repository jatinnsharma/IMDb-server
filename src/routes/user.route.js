const express = require('express')
const { create, verifyEmail } = require('../controllers/user.controller');
const { validate, userValidtor } = require('../middlewares/validator');

const router = express.Router()

router.post('/create',userValidtor,validate,create);
router.post('/verify-email',verifyEmail);

module.exports=router;