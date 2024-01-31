import { sequelize } from "../../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel, categoryModel } from "../../models/modelsRelations"
import { CustomRequest } from "../middlewares/sessionMiddleware"
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import FuzzySearch from 'fuzzy-search'
import * as models from "../../models/modelsRelations"
import * as productServices from "../../services/productServices"
import * as validations from '../../validators/validateSchema'
import * as categorySevices from "../../services/categoryServices";
import * as brandSevices from "../../services/brandServices";
import * as ratingSevices from "../../services/ratingServices";
const rateToCompare = 4.5
const priceToCompare = 100

export const getProductsByCategory = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const categoryName = req.params.category;

    const validationResult = validations.categoryValidationSchema.validate({ name: categoryName });
    if (validationResult.error) {
      return res.status(400).json({error: "Invalid Input"});
    }

    const category = await categorySevices.findCategoryByName(categoryName)

    if (!category) {
      return res.status(404).json({error: "category does not exist"})
    }

    const options = {
      where: {
        categoryID: category.dataValues.categoryID,
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result = await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }
}

export const getProductsByBrand = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const brandName = req.params.brand;

    const validationResult = validations.brandValidationSchema.validate({ name: brandName });
    if (validationResult.error) {
      return res.status(400).json({error: "Invalid Input"});
    }
    const brand = await brandSevices.findBrandByName(brandName)

    if (!brand) {
      return res.status(404).json({error: "brand does not exist"})
    }
    const options = {
      where: {
        brandID: brand.dataValues.brandID
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result = await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }

}

export const getNewArrivalProducts = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const options = {
      where: {
        arrivalDate: {
          [Op.gt]: threeMonthsAgo,
        },
      },
      order: [["arrivalDate", "DESC"]],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result = await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    console.log(error.message)
    res.status(error.status).json({error: error.message})
  }
}

export const getLimitedProducts = async function (req: CustomRequest, res: Response): Promise<any> {
  try {

    const limited = 20;
    const options = {
      where: {
        quantity: {
          [Op.lt]: limited,
        }
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result = await productServices.getAllProducts(req, res, options);

    res.json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }
}

export const getProductsByDiscoutOrMore = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const discount = Number(req.query.discount) || 15;

    const options = {
      where: {
        discount: {
          [Op.gte]: discount,
        }
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result = await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }
}

export const getTrendyProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const options = {
      order: [[sequelize.literal('avgRating'), 'DESC']],
      having: sequelize.literal(`avgRating >= ${rateToCompare}`),  // Add HAVING clause for trendy products
    };

    const count = await productModel.count({
      where: {
        productID: {
          [Op.in]: sequelize.literal(`(SELECT productID FROM ratings GROUP BY productID HAVING AVG(rating) >= ${rateToCompare})`),
        },
      },
    });

    const result = await productServices.getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    console.log(error.message)
    res.status(error.status).json({error: error.message})
  }

}

export const handPicked = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const categoryName = req.query.category as string | undefined;

    if (!categoryName) {
      return res.status(404).json('Inalid Input');
    }


    const category = await categorySevices.findCategoryByName(categoryName)
    if (!category) {
      return res.status(404).json({error: 'No Products Found'});
    }

    const count = await productModel.count({
      where: {
        productID: {
          [Op.in]: sequelize.literal(`(SELECT productID FROM ratings GROUP BY productID HAVING AVG(rating) >= ${rateToCompare} and price < ${priceToCompare})`),
        },
      },
    });

    const options = {
      order: [[sequelize.literal('avgRating'), 'DESC']],
      having: sequelize.literal(`avgRating >= ${rateToCompare} and price < ${priceToCompare}`),  // Add HAVING clause for trendy products
    };

    const result = await productServices.getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: count,
      products: result,
    });

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }
}

export const getSpecificProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productID = req.query.productID as string | undefined;

    if (!productID) {
      return res.status(400).json({ error: 'productid are required' });
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

    return res.status(500).json({error: 'Internal Server Error'});

  }

}

export const rateProduct = async (req: CustomRequest, res: Response): Promise<any> => {
  try {

    const rating = req.body.rating;
    const productID = Number(req.params.productID);
    const userID = req.user.userID;

    const validationResult = validations.ratingValidationSchema.validate({ userID, productID, rating });
    if (validationResult.error) {
      return res.status(400).json({error: "Invalid Input"});
    }

    const existProduct = await productServices.getProduct(productID)

    if (!existProduct) {
      return res.status(404).json({error: 'Product Not Found'});
    }

    const options = {
      where: {
        userID: userID,
        productID: productID,
      }
    }

    const existRate = await models.ratingModel.findOne({
      where: {
        userID: userID,
        productID: productID,
      }
    });

    if (!existRate) {
      await ratingSevices.addRating({
        userID: userID,
        rating: rating,
        productID: productID,
      });

      return res.status(200).json()
    }
    else { //existRate
      if (existRate.rating !== rating) {
        await ratingSevices.updateRating(
          {
            rating: rating,
          },
          {
            userID: userID,
            productID: productID,
          }
        )
        return res.status(200).json("Rated Done")
      }

    }

  } catch (error) {

    res.status(error.status).json({error: error.message})
  }
}

export const getRateAndReview = async (req: Request, res: Response): Promise<any> => {

  try {
    const productID = req.params.productID;

    if (!productID) {
      return res.status(400).json({error: "Invalid Input"});
    }

    const count = await ratingModel.count({
      where: {
        productID: productID,
      },
    });

    const options = {
      where: {
        productID: productID,
      },
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName'],
      }],
      order: [["rating", "DESC"]]
    }

    const reviews = await ratingSevices.findRatings(options);

    return res.status(200).json(
      {
        "totalCount": count,
        "reviews": reviews
      }
    );

  } catch (error) {
    console.error(error);
    return res.status(error.status).json({error: error.message})
  }
}

export const searchProduct = async (req: Request, res: Response): Promise<any> => {
  const searchQuery = req.query.searchQuery
  try {
    const products = await productModel.findAll(
      {
        attributes:
          [
            "productID",
            "title",
            "subTitle",
            [sequelize.literal('(SELECT name FROM brand WHERE brand.brandID = products.brandID )'), 'brandName'],
          ],
        limit: 10
      }
    )
    const searcher = new FuzzySearch(products, ['title', 'subTitle', 'brandName'], {
      caseSensitive: false,
    })
    const result = searcher.search(searchQuery)
    res.status(200).send(result)
  }
  catch (err) {
    res.status(500).send({error: 'Internal Server Error'})
  }
}
