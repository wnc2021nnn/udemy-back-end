const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.put('/', async function (req, res) {
    try {
        const user = { ...req.body };
        user.password = bcrypt.hashSync(user.password, 10);
        user.user_id = uuidv4();
        user.created_at = Date.now();
        await userModel.add(user);

        delete user.password;

        res.status(201).json({
            "meta": req.body,
            "data": user
        });
    } catch (ex) {
        res.status(400).send({
            "meta": req.body,
            "data": ex
        });
    }

})

module.exports = router;