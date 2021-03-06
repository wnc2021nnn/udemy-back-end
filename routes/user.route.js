const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.get('/', require('../middlewares/auth.v2.mdw')(0), async function (req, res) {
    try {
        const role = req.query.role;

        var users = [];

        if (role) {
            users = await userService.getUsersByRole(role);
        }

        res.status(201).json({
            "data": users
        });
    } catch (ex) {
        console.log(ex)
        res.status(403).send({
            "data": ex
        });
    }

})

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
        if (user.role != 2) {
            res.status(400).json({
                "error": "Learner role must be 2",
            });
        } else {
            await userService.createUser(user);

            res.status(201).json({
                "data": user
            });
        }
    } catch (ex) {
        console.log(ex)
        res.status(400).json({
            "data": ex
        });
    }

})

router.put('/teachers'
    , require('../middlewares/auth.v2.mdw')(0)
    , require('../middlewares/validate.mdw')(userSchema)
    , async function (req, res) {
        try {
            const user = { ...req.body };

            await userService.createUser(user);

            res.status(201).json({
                "data": user
            });
        } catch (ex) {
            console.log(ex)
            res.status(400).json({
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
                return res.status(403).json({
                    status: false,
                    'error': 'Wrong password'
                });
            }
            user.password = bcrypt.hashSync(req.body.password, 10);

            //await userModel.patchPassword(userId, user.password);
        }

        if (req.body.first_name && req.body.last_name) {
            //await userModel.patchUsername(userId, req.body.first_name, req.body.last_name);
            user['first_name'] = req.body.first_name;
            user['last_name'] = req.body.last_name;
        }

        if(req.body.email){
            user['email'] = req.body.email;
        }

        await userModel.patchUser(userId, user);

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

router.patch('/:id', require('../middlewares/auth.v2.mdw')(0), async function (req, res) {
    try {
        const userId = req.params.id;
        const user = req.body;

        await userModel.patchUser(userId, user);

        res.status(201).json({
            //"meta": req.body,
            "data": "ok"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error
        });
    }

})

router.delete('/', require('../middlewares/auth.v2.mdw')(0), async function (req, res) {
    try {
        const userIds = req.body.user_ids;
        var result = await userService.deleteUsers(userIds);
        res.status(201).json({
            "data": result
        });
    } catch (error) {
        console.log(error)
        res.status(403).json({
            error
        });
    }

})

module.exports = router;