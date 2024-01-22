"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRateAndReview = exports.rateProduct = exports.getSpecificProduct = exports.handPicked = exports.getProductsByDiscoutOrMore = exports.getLimitedProducts = exports.getNewArrivalProducts = exports.getProductsByBrand = exports.getProductsByCategory = exports.getTrendyProducts = void 0;
const db_1 = require("../config/db");
const modelsRelations_1 = require("../models/modelsRelations");
const wishlistUtils_1 = require("../utils/wishlistUtils");
const sequelize_1 = require("sequelize");
const brand_1 = require("../models/brand");
const getTrendyProducts = async function (req, res) {
    try {
        let productsWithIsAdded = [];
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const trendyProducts = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
            ],
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: db_1.sequelize.literal('position = 1'),
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    required: false
                }
            ],
            group: ['productID'],
            having: db_1.sequelize.literal('avgRating >= 4.5'),
            order: [[db_1.sequelize.literal('avgRating'), 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,
            subQuery: false
        });
        const count = trendyProducts.length;
        productsWithIsAdded = await getProductsAndIsAdded(req, trendyProducts);
        return res.status(200).json({ "totalCount": count, "products": productsWithIsAdded });
    }
    catch (err) {
        res.status(500).json('Internal Server Error');
    }
};
exports.getTrendyProducts = getTrendyProducts;
async function isAuthorized(req) {
    const { headers: headersData } = req;
    if (!headersData.authorization) {
        return false;
    }
    else {
        const foundSession = await modelsRelations_1.sessionModel.findOne({ where: { sessionID: headersData.authorization } });
        const foundUser = await modelsRelations_1.userModel.findOne({ where: { userID: foundSession.userID } });
        return foundUser.userID;
    }
}
async function getProductsAndIsAdded(req, products) {
    const userID = await isAuthorized(req);
    if (!userID) {
        return products.map((product) => ({
            ...product.toJSON(),
            isAddedToWishList: 0,
        }));
    }
    const isAddedPromises = products.map(product => (0, wishlistUtils_1.isAdedToWishlist)(userID, product.productID));
    const isAddedResults = await Promise.all(isAddedPromises);
    return products.map((product, index) => ({
        ...product.toJSON(),
        isAddedToWishList: isAddedResults[index],
    }));
}
const getProductsByCategory = async function (req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const categoryName = req.params.category;
        // const userID = req.user?.userID || null;
        let userID = await isAuthorized(req);
        if (!userID) {
            userID = null;
        }
        console.log(userID);
        const category = await modelsRelations_1.categoryModel.findOne({
            where: {
                name: categoryName
            }
        });
        if (!category) {
            return res.status(404).json("category does not exist");
        }
        const count = await modelsRelations_1.productModel.count({
            where: {
                categoryID: category.dataValues.categoryID
            }
        });
        const result = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                //the COALESCE function is used to replace the avgRating value with 0 if it is null.
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
                [db_1.sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
            ],
            where: {
                categoryID: category.dataValues.categoryID
            },
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: {
                        position: 1
                    },
                    as: "images",
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    as: "ratings",
                    required: false
                },
            ],
            group: ['productID'],
            offset: (page - 1) * pageSize,
            order: ["productID"],
            limit: pageSize,
            subQuery: false
        });
        res.json({
            totalCount: count,
            products: result
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json('Internal Server Error');
    }
};
exports.getProductsByCategory = getProductsByCategory;
const getProductsByBrand = async function (req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const brandName = req.params.brand;
        // const userID = req.user?.userID || null;
        let userID = await isAuthorized(req);
        if (!userID) {
            userID = null;
        }
        const brand = await brand_1.brandModel.findOne({
            where: {
                name: brandName
            }
        });
        if (!brand) {
            return res.status(404).json("brand does not exist");
        }
        const count = await modelsRelations_1.productModel.count({
            where: {
                brandID: brand.dataValues.brandID
            }
        });
        const result = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                //the COALESCE function is used to replace the avgRating value with 0 if it is null.
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
                [db_1.sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
            ],
            where: {
                brandID: brand.dataValues.brandID
            },
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: {
                        position: 1
                    },
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    required: false,
                    as: "ratings",
                }
            ],
            group: ["productID"],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: ["productID"],
            subQuery: false
        });
        res.json({
            totalCount: count,
            products: result
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json('Internal Server Error');
    }
};
exports.getProductsByBrand = getProductsByBrand;
const getNewArrivalProducts = async function (req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;
        let userID = await isAuthorized(req);
        if (!userID) {
            userID = null;
        }
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const count = await modelsRelations_1.productModel.count({
            where: {
                arrivalDate: {
                    [sequelize_1.Op.gt]: threeMonthsAgo,
                },
            }
        });
        const result = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                "arrivalDate",
                //the COALESCE function is used to replace the avgRating value with 0 if it is null.
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
                [db_1.sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
            ],
            where: {
                arrivalDate: {
                    [sequelize_1.Op.gt]: threeMonthsAgo,
                },
            },
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: {
                        position: 1
                    },
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    required: false,
                    as: "ratings"
                }
            ],
            group: ["productID"],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: [["arrivalDate", "DESC"]],
            subQuery: false
        });
        res.json({
            totalCount: count,
            products: result
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json('Internal Server Error');
    }
};
exports.getNewArrivalProducts = getNewArrivalProducts;
const getLimitedProducts = async function (req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;
        let userID = await isAuthorized(req);
        if (!userID) {
            userID = null;
        }
        const count = await modelsRelations_1.productModel.count({
            where: {
                quantity: {
                    [sequelize_1.Op.lt]: 20,
                }
            }
        });
        const result = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                "arrivalDate",
                //the COALESCE function is used to replace the avgRating value with 0 if it is null.
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
                [db_1.sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
            ],
            where: {
                quantity: {
                    [sequelize_1.Op.lt]: 20,
                }
            },
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: {
                        position: 1
                    },
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    required: false,
                    as: "ratings"
                }
            ],
            group: ["productID"],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: ["productID"],
            subQuery: false
        });
        res.status(200).json({
            totalCount: count,
            products: result
        });
    }
    catch (error) {
        res.status(500).json('Internal Server Error');
    }
};
exports.getLimitedProducts = getLimitedProducts;
const getProductsByDiscoutOrMore = async function (req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;
        let userID = await isAuthorized(req);
        if (!userID) {
            userID = null;
        }
        const discount = Number(req.query.discount) || 15;
        const count = await modelsRelations_1.productModel.count({
            where: {
                discount: {
                    [sequelize_1.Op.gte]: discount,
                }
            }
        });
        const result = await modelsRelations_1.productModel.findAll({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "price",
                "discount",
                "arrivalDate",
                //the COALESCE function is used to replace the avgRating value with 0 if it is null.
                [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
                [db_1.sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
            ],
            where: {
                discount: {
                    [sequelize_1.Op.gte]: discount,
                }
            },
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: [],
                    where: {
                        position: 1
                    },
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [],
                    required: false,
                    as: "ratings"
                }
            ],
            group: ["productID"],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            order: ["productID"],
            subQuery: false
        });
        res.status(200).json({
            totalCount: count,
            products: result
        });
    }
    catch (error) {
        res.status(500).json('Internal Server Error');
    }
};
exports.getProductsByDiscoutOrMore = getProductsByDiscoutOrMore;
const handPicked = async (req, res) => {
    try {
        let productsWithIsAdded = [];
        const categoryName = req.query.category;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const category = await modelsRelations_1.categoryModel.findOne({
            attributes: ['categoryID'],
            where: {
                name: categoryName
            }
        });
        if (category) {
            const handPickedProducts = await modelsRelations_1.productModel.findAll({
                attributes: [
                    "productID",
                    "title",
                    "subTitle",
                    "price",
                    "discount",
                    [db_1.sequelize.fn('COALESCE', db_1.sequelize.fn('AVG', db_1.sequelize.col("ratings.rating")), 0), 'avgRating'],
                    [db_1.sequelize.fn('COUNT', db_1.sequelize.col("ratings.rating")), 'ratingCount'],
                    [db_1.sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response
                ],
                include: [
                    {
                        model: modelsRelations_1.ratingModel,
                        attributes: [],
                        as: "ratings",
                        where: { rating: { [sequelize_1.Op.gt]: 4.5 } },
                        required: false
                    },
                    {
                        model: modelsRelations_1.categoryModel,
                        attributes: [],
                        where: {
                            categoryID: category.categoryID,
                        }
                    },
                    {
                        model: modelsRelations_1.imageModel,
                        attributes: [],
                        where: db_1.sequelize.literal('position = 1'),
                        required: false
                    }
                ],
                where: {
                    price: { [sequelize_1.Op.lt]: 100 },
                },
                group: ['productID'],
                offset: (page - 1) * pageSize,
                limit: pageSize,
                order: [[db_1.sequelize.literal('avgRating'), 'DESC']],
                subQuery: false
            });
            for (const product of handPickedProducts) {
                let ratingCount = await modelsRelations_1.ratingModel.count({
                    where: {
                        productID: product.productID,
                    },
                });
            }
            const count = handPickedProducts.length;
            productsWithIsAdded = await getProductsAndIsAdded(req, handPickedProducts);
            return res.status(200).json({
                "totalCount": count,
                "products": productsWithIsAdded,
            });
        }
        else {
            return res.status(404).json('No Products Found');
        }
    }
    catch (error) {
        res.status(500).json('Internal Server Error');
    }
};
exports.handPicked = handPicked;
const getSpecificProduct = async (req, res) => {
    try {
        const productid = req.params.productID;
        if (!productid) {
            res.status(400).json({ error: 'productid are required' });
            return;
        }
        const Product = await modelsRelations_1.productModel.findOne({
            attributes: [
                "productID",
                "title",
                "subTitle",
                "description",
                "price",
                "discount",
            ],
            include: [
                {
                    model: modelsRelations_1.imageModel,
                    attributes: ['imageID', 'imgPath', 'position'],
                    required: false
                },
                {
                    model: modelsRelations_1.ratingModel,
                    attributes: [], as: "ratings",
                    required: false
                }
            ],
            where: {
                productID: productid
            },
            group: ['productID', 'imageID'],
            subQuery: false
        });
        return res.status(200).json({ Product });
    }
    catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};
exports.getSpecificProduct = getSpecificProduct;
const rateProduct = async (req, res) => {
    try {
        const rate = req.body.rating;
        const productID = req.params.productID;
        const userID = req.user.userID;
        // Validate input
        if (!userID || !rate || !productID) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const existRate = await modelsRelations_1.ratingModel.findOne({
            where: {
                userID: userID,
                productID: productID,
            },
        });
        if (!existRate) {
            const newRating = await modelsRelations_1.ratingModel.create({
                userID: userID,
                rating: rate,
                productID: productID,
            });
            return res.status(200).json("Rated Successfully");
        }
        else {
            return res.status(400).json('Already Rated');
        }
    }
    catch (error) {
        return res.status(500).json('Internal Server Error');
    }
};
exports.rateProduct = rateProduct;
const getRateAndReview = async (req, res) => {
    try {
        const productID = req.params.productID;
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 5;
        const count = await modelsRelations_1.ratingModel.count({
            where: {
                productID: productID,
            },
        });
        const reviews = await modelsRelations_1.ratingModel.findAll({
            attributes: ['rating'],
            where: {
                productID: productID,
            },
            include: [{
                    model: modelsRelations_1.userModel,
                    attributes: ['firstName', 'lastName'],
                }
            ],
            order: [["rating", "DESC"]],
        });
        return res.status(200).json({ "totalCount": count,
            "reviews": reviews });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Internal Server Error');
    }
};
exports.getRateAndReview = getRateAndReview;
