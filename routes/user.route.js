const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.get('/:id', async function (req, res) {
    try {
        const id = req.params.id;

        var user = await userService.getUserInfo(id);

        res.status(201).json({
            "data": user
        });
    } catch (ex) {
        console.log(ex)
        res.status(503).send({
            "data": ex
        });
    }

})

const userSchema = require('../schemas/user.json');
router.put('/', require('../middlewares/validate.mdw')(userSchema), async function (req, res) {
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

const pUserSchema = require('../schemas/patch-user.json');
const userService = require('../services/user.service');
router.patch('/', require('../middlewares/validate.mdw')(pUserSchema), require('../middlewares/auth.mdw'), async function (req, res) {
    try {
        const userId = req.accessTokenPayload.user_id;
        const user = await userModel.single(userId);

        if (user === null) {
            return res.json({
                status: false
            });
        }

        if (req.body.old_password && req.body.password) {
            if (!bcrypt.compareSync(req.body.old_password, user.password)) {
                return res.json({
                    status: false
                });
            }
            user.password = bcrypt.hashSync(req.body.password, 10);

            await userModel.patchPassword(userId, user.password);
        }

        if (req.body.first_name && req.body.last_name) {
            await userModel.patchUsername(userId, req.body.first_name, req.body.last_name);
            user['first_name'] = req.body.first_name;
            user['last_name'] = req.body.last_name;
        }

        delete user.password;

        res.status(201).json({
            //"meta": req.body,
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