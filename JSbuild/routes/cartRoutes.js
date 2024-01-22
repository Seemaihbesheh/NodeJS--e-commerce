"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const sessionMiddleware_1 = require("../middlewares/sessionMiddleware");
const router = express_1.default.Router();
router.get('/', sessionMiddleware_1.sessionMiddleware, cartController_1.getCart);
router.put('/:productID', sessionMiddleware_1.sessionMiddleware, cartController_1.updateProductQuantityInCart);
router.post('/moveToWishList/:productID', sessionMiddleware_1.sessionMiddleware, cartController_1.moveToWishlist);
router.post("/", sessionMiddleware_1.sessionMiddleware, cartController_1.addToCart);
router.delete("/:productID", sessionMiddleware_1.sessionMiddleware, cartController_1.deleteProductFromCart);
exports.default = router;
