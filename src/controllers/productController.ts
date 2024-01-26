import { sequelize } from "../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel, categoryModel } from "../models/modelsRelations"
import { CustomRequest } from "../middlewares/sessionMiddleware"
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { brandModel } from "../models/brand"
import FuzzySearch from 'fuzzy-search'


export const getTrendyProducts = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user?.userID || null
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 20
    const trendyProducts = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount"
        , [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],

      ],
      include: [
        {
          model: ratingModel,
          attributes: [],
          as: "ratings",
          required: false
        }
      ],
      group: ['productID'],
      having: sequelize.literal('avgRating >= 4.5'),
      order: [[sequelize.literal('avgRating'), 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      subQuery: false

    })
    const count = trendyProducts.length

    return res.status(200).json({ "totalCount": count, "products": trendyProducts })
  } catch (err) {
    res.status(500).json('Internal Server Error')
  }
}

async function isAuthorized(req: Request): Promise<boolean | number> {
  const { headers: headersData } = req
  if (!headersData.authorization) {
    return false
  }
  else {
    const foundSession = await sessionModel.findOne({ where: { sessionID: headersData.authorization } })
    const foundUser = await userModel.findOne({ where: { userID: foundSession.userID } })
    return foundUser.userID
  }
}

export const getProductsByCategory = async function (req: Request, res: Response): Promise<any> {
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

    const category = await categoryModel.findOne({
      where: {
        name: categoryName
      }
    })

    if (!category) {
      return res.status(404).json("category does not exist")
    }

    const count = await productModel.count({
      where: {
        categoryID: category.dataValues.categoryID
      }
    });

    const result = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        //the COALESCE function is used to replace the avgRating value with 0 if it is null.
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      where: {
        categoryID: category.dataValues.categoryID
      },
      include: [
        {
          model: ratingModel,
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

  } catch (error) {
    console.log(error.message)
    res.status(500).json('Internal Server Error')
  }
}

export const getProductsByBrand = async function (req: Request, res: Response): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const brandName = req.params.brand;
    // const userID = req.user?.userID || null;

    let userID = await isAuthorized(req);
    if (!userID) {
      userID = null;
    }

    const brand = await brandModel.findOne({
      where: {
        name: brandName
      }
    })

    if (!brand) {
      return res.status(404).json("brand does not exist")
    }

    const count = await productModel.count({
      where: {
        brandID: brand.dataValues.brandID
      }
    });

    const result = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        //the COALESCE function is used to replace the avgRating value with 0 if it is null.
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      where: {
        brandID: brand.dataValues.brandID
      },
      include: [
        {
          model: ratingModel,
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

  } catch (error) {
    console.log(error.message);
    res.status(500).json('Internal Server Error')
  }
}

export const getNewArrivalProducts = async function (req: Request, res: Response): Promise<any> {
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

    const count = await productModel.count({
      where: {
        arrivalDate: {
          [Op.gt]: threeMonthsAgo,
        },
      }
    });

    const result = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        "arrivalDate",
        //the COALESCE function is used to replace the avgRating value with 0 if it is null.
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      where: {
        arrivalDate: {
          [Op.gt]: threeMonthsAgo,
        },
      },
      include: [
        {
          model: ratingModel,
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

  } catch (error) {
    console.log(error.message)
    res.status(500).json('Internal Server Error')
  }
}

export const getLimitedProducts = async function (req: Request, res: Response): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    // const userID = req.user?.userID || null;

    let userID = await isAuthorized(req);
    if (!userID) {
      userID = null;
    }

    const count = await productModel.count({
      where: {
        quantity: {
          [Op.lt]: 20,
        }
      }
    });

    const result = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        "arrivalDate",
        //the COALESCE function is used to replace the avgRating value with 0 if it is null.
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      where: {
        quantity: {
          [Op.lt]: 20,
        }
      },
      include: [
        {
          model: ratingModel,
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
    })

  } catch (error) {
    res.status(500).json('Internal Server Error')
  }
}

export const getProductsByDiscoutOrMore = async function (req: Request, res: Response): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    // const userID = req.user?.userID || null;

    let userID = await isAuthorized(req);
    if (!userID) {
      userID = null;
    }

    const discount = Number(req.query.discount) || 15;

    const count = await productModel.count({
      where: {
        discount: {
          [Op.gte]: discount,
        }
      }
    });

    const result = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        "arrivalDate",
        //the COALESCE function is used to replace the avgRating value with 0 if it is null.
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response contains the imagePath as an attribute insted of having an attribute of type array containing the imagePath   
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      where: {
        discount: {
          [Op.gte]: discount,
        }
      },
      include: [

        {
          model: ratingModel,
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
    })

  } catch (error) {
    res.status(500).json('Internal Server Error')
  }
}

export const handPicked = async (req: CustomRequest, res: Response): Promise<any> => {
  try {

    const userID = req.user?.userID || null
    const categoryName = req.query.category as string | undefined;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const category = await categoryModel.findOne({
      attributes: ['categoryID'],
      where: {
        name: categoryName
      }
    })
    if (!category) { return res.status(404).json('No Products Found'); }

    const handPickedProducts = await productModel.findAll({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "price",
        "discount",
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
        [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
        [sequelize.literal(`(SELECT COUNT(*) FROM wishlist WHERE wishlist.productID = products.productID AND wishlist.userID = ${userID} )`), 'isAddedToWishList'],
      ],
      include: [
        {
          model: ratingModel,
          attributes: [],
          as: "ratings",
          required: false
        }
      ],
      where: {
        price: { [Op.lt]: 100 },
      },
      having: sequelize.literal('avgRating >= 4.5'),
      group: ['productID'],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [[sequelize.literal('avgRating'), 'DESC']],
      subQuery: false
    })
    const count = handPickedProducts.length;

    return res.status(200).json(
      {
        "totalCount": count,
        "products": handPickedProducts,
      })

  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
}

export const getSpecificProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productID = req.query.productID as string | undefined;

    if (!productID) {
      res.status(400).json({ error: 'productid are required' });
      return;
    }

    const Product = await productModel.findOne({
      attributes: [
        "productID",
        "title",
        "subTitle",
        "description",
        "price",
        "discount",
        "quantity",
        [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
      ],

      include: [
        {
          model: imageModel,
          attributes: ['imageID', 'imgPath', 'position'],
          required: false
        },
        {
          model: ratingModel,
          attributes: [], as: "ratings",
          required: false
        }
      ],
      where: {
        productID: productID
      },
      group: ['productID', 'imageID'],
      subQuery: false

    });
    return res.status(200).json({ Product });


  } catch (error) {

    return res.status(500).json('Internal Server Error');

  }

}

export const rateProduct = async (req: CustomRequest, res: Response): Promise<any> => {
  try {

    const rate = req.body.rating;
    const productID = req.params.productID;
    const userID = req.user.userID;

    // Validate input
    if (!userID || !rate || !productID) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existRate = await ratingModel.findOne({
      where: {
        userID: userID,
        productID: productID,
      },
    });


    if (!existRate) {
      const newRating = await ratingModel.create({
        userID: userID,
        rating: rate,
        productID: productID,
      });


      return res.status(200).json(
        "Rated Successfully",
      );
    }
    else {
      return res.status(400).json('Already Rated');
    }

  } catch (error) {

    return res.status(500).json('Internal Server Error');
  }
}

export const getRateAndReview = async (req: Request, res: Response): Promise<any> => {

  try {
    const productID = req.params.productID;

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;

    const count = await ratingModel.count({
      where: {
        productID: productID,
      },
    });

    const reviews = await ratingModel.findAll({
      attributes: ['rating'],
      where: {
        productID: productID,
      },
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName'],

      }
      ]
      ,
      order: [["rating", "DESC"]],
    });

    return res.status(200).json(
      {
        "totalCount": count,
        "reviews": reviews
      }
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json('Internal Server Error');
  }
}

export const searchProduct = async (req: Request, res: Response): Promise<any> => {
  const searchQuery = req.query.searchQuery
  try {
    const products = await productModel.findAll(
      {
        attributes:
          [
            "title",
            "subTitle",
            [sequelize.literal('(SELECT name FROM brand WHERE brand.brandID = products.brandID )'), 'brandName'],
          ],
      }
    )
    const searcher = new FuzzySearch(products, ['title', 'subTitle', 'brandName'], {
      caseSensitive: false,
    })
    const result = searcher.search(searchQuery)
    res.status(200).send(result)
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}