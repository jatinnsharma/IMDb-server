const express = require('express')
const { createUser } = require('../controllers/user.controller');

const router = express.Router()

router.post('/sign-in',createUser);

module.exports=router;