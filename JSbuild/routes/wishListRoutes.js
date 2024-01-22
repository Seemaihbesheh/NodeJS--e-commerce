"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const wishListController_1 = require("../controllers/wishListController");
const sessionMiddleware_1 = require("../middlewares/sessionMiddleware");
router.get('/', sessionMiddleware_1.sessionMiddleware, wishListController_1.getWishList);
router.post('/:productID', sessionMiddleware_1.sessionMiddleware, wishListController_1.toggleWishlist);
exports.default = router;
