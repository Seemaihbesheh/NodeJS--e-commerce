"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./config/db");
const authenticationController_1 = __importDefault(require("./controllers/authenticationController"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const cartRoutes_2 = __importDefault(require("./routes/cartRoutes"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/', authenticationController_1.default);
app.use('/products', productRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/wishList', cartRoutes_2.default);
(0, db_1.syncModels)()
    .then(() => {
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
})
    .catch((error) => {
    console.error('Error syncing models:', error);
});
