const express = require('express')
const { create } = require('../controllers/user.controller');
const { validate, userValidtor } = require('../middlewares/validator');

const router = express.Router()

router.post('/create',userValidtor,validate,create);

module.exports=router;