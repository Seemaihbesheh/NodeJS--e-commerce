"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const modelsRelations_1 = require("../models/modelsRelations");
const sessionMiddleware = async (req, res, next) => {
    try {
        const { headers: headersData } = req;
        if (!headersData.authorization) {
            return res.status(400).json({ error: 'Session ID not provided in headers' });
        }
        const foundSession = await modelsRelations_1.sessionModel.findOne({ where: { sessionID: headersData.authorization } });
        if (foundSession) {
            const foundUser = await modelsRelations_1.userModel.findOne({ where: { userID: foundSession.userID } });
            req.session = foundSession;
            req.user = foundUser;
            next();
        }
        else {
            return res.status(400).json({ error: 'Session not found or timed out. Please log in again.' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.sessionMiddleware = sessionMiddleware;
