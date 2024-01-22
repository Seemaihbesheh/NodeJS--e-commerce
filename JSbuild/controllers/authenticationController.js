"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
const modelsRelations_1 = require("../models/modelsRelations");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const sessionMiddleware_1 = require("../../src/middlewares/sessionMiddleware");
async function findUser(email) {
    try {
        const foundUser = await modelsRelations_1.userModel.findOne({ where: { email: email } });
        return foundUser;
    }
    catch (err) {
        throw new Error('Error finding user:' + err.message);
    }
}
exports.findUser = findUser;
function generateSessionID() {
    const uuid = (0, uuid_1.v4)();
    const base64Encoded = Buffer.from(uuid).toString('base64');
    return base64Encoded;
}
router.post('/signup', async (req, res) => {
    console.log(req.body);
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json('All fields are required');
    }
    try {
        const foundUser = await findUser(req.body.email);
        if (foundUser) {
            throw new Error('Email already exists');
        }
        const userData = req.body;
        const newUser = await modelsRelations_1.userModel.create({ email: userData.email, password: userData.password, firstName: firstName, lastName: lastName });
        const sessionID = generateSessionID();
        let sessionData = { "sessionID": sessionID, "userID": newUser.userID };
        console.log(await modelsRelations_1.sessionModel.create(sessionData));
        res.status(200).json({ "sessionID": sessionID });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json('Please enter all fields');
        }
        const foundUser = await findUser(req.body.email);
        if (!foundUser) {
            return res.status(404).json('User not found');
        }
        const pass = req.body.password;
        bcrypt_1.default.compare(pass, foundUser.password, async (err, result) => {
            if (err) {
                res.status(500).json(err.message);
            }
            else if (result) {
                const sessionID = generateSessionID();
                let sessionData = { "sessionID": sessionID, "userID": foundUser.userID };
                console.log(await modelsRelations_1.sessionModel.create(sessionData));
                res.status(200).json({ "sessionID": sessionID });
            }
            else {
                res.status(401).json('Invalid username or password');
            }
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});
router.post('/changePassword', sessionMiddleware_1.sessionMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, newPassword } = req.body;
        if (!email || !password || !newPassword) {
            return res.status(400).json('Please enter all fields');
        }
        const foundUser = await findUser(email);
        if (!foundUser) {
            return res.status(404).json('User not found');
        }
        const passwordMatch = await bcrypt_1.default.compare(password, foundUser.password);
        if (passwordMatch) {
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPass = await bcrypt_1.default.hash(newPassword, salt);
            try {
                await modelsRelations_1.userModel.update({ password: hashedPass }, { where: { email }, ...{ validate: false } });
                let sessionData = req.session;
                await modelsRelations_1.sessionModel.destroy({ where: { userID: sessionData.userID } });
                res.json('password updated succesfully');
            }
            catch (err) {
                throw err;
            }
        }
        else {
            res.status(401).json('Invalid username or password');
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});
router.delete('/logout', sessionMiddleware_1.sessionMiddleware, async (req, res) => {
    try {
        let sessionData = req.session;
        const userSession = await modelsRelations_1.sessionModel.findOne({ where: { sessionID: sessionData.sessionID } });
        if (!userSession) {
            return res.status(404).json({ error: 'No sessions found for the user' });
        }
        await modelsRelations_1.sessionModel.destroy({ where: { sessionID: sessionData.sessionID } });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to logout', details: error.message });
    }
});
exports.default = router;
