import { sequelize } from "../../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel, categoryModel } from "../../models/modelsRelations"
import { CustomRequest } from "../middlewares/sessionMiddleware"
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { brandModel } from "../../models/brand"
import FuzzySearch from 'fuzzy-search'
import * as productServices from "../../services/productServices"
import { ratingValidationSchema } from '../../validators/validateSchema'
import * as categorySevices from "../../services/categoryServices";
import * as brandSevices from "../../services/brandServices";
import * as ratingSevices from "../../services/ratingServices";

export const getProductsByCategory = async (req: CustomRequest, res: Response): Promise<any> => {
  try{
    const categoryName = req.params.category;

    if(!categoryName){
      return res.status(400).json("Invalid Input")
    }
    const category = await categorySevices.findCategoryByName(categoryName)
      
    if (!category) {
        return res.status(404).json("category does not exist")
    }
    
    const options = {
      where: {
        categoryID: category.dataValues.categoryID,
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where : options.where
    });

    const result =await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count, 
      products: result,
    });

  }catch(error){
    res.status(500).json('Internal Server Error');
  }
}

export const getProductsByBrand = async (req: CustomRequest, res: Response): Promise<any> => {
  try{
    const brandName = req.params.brand;

    if(!brandName){
      return res.status(400).json("Invalid Input")
    }
    const brand = await brandSevices.findBrandByName(brandName)

    if(!brand){
      return res.status(404).json("brand does not exist")
    }
    const options = {
      where: {
        brandID: brand.dataValues.brandID
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where:options.where
    });
  
    const result =await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count, 
      products: result,
    });

  }catch(error){
    res.status(500).json('Internal Server Error');
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
      order: [["arrivalDate" , "DESC"]],
    };

    const count = await productModel.count({
      where :options.where
    });

    const result =await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count, 
      products: result,
    });

  } catch (error) {
    console.log(error.message)
    res.status(500).json('Internal Server Error')
  }
}

export const getLimitedProducts = async function (req: CustomRequest, res: Response): Promise<any> {
  try {

    const limited=20;
    const options = {
      where: {
        quantity: {
          [Op.lt]: limited,
        }
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where :options.where
    });
    
    const result =await productServices.getAllProducts(req, res, options);

    res.json({
      totalCount: count, 
      products: result,
    });

  } catch (error) {
    res.status(500).json('Internal Server Error')
  }
}

export const getProductsByDiscoutOrMore = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const discount = Number(req.query.discount) || 15;

    const options = {
      where: {
        discount :{
          [Op.gte] : discount,
        }
      },
      order: ['productID'],
    };

    const count = await productModel.count({
      where: options.where
    });

    const result =await productServices.getAllProducts(req, res, options);
    res.json({
      totalCount: count, 
      products: result,
    });

  } catch (error) {
    res.status(500).json('Internal Server Error')
  }
}

export const getTrendyProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  try{
    const options = {
      order: [[sequelize.literal('avgRating'), 'DESC']],
      having: sequelize.literal('avgRating >= 4.5'),  // Add HAVING clause for trendy products
    };

    const count = await productModel.count({
      where: {
        productID: {
          [Op.in]: sequelize.literal(`(SELECT productID FROM ratings GROUP BY productID HAVING AVG(rating) >= 4.5)`),
        },
      },
    });

    const result =await productServices.getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: count, 
      products: result,
    });

  }catch(error){
    console.log(error.message)
    res.status(500).json('Internal Server Error');
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
      return res.status(404).json('No Products Found');
     }

     const count = await productModel.count({
      where: {
        productID: {
          [Op.in]: sequelize.literal(`(SELECT productID FROM ratings GROUP BY productID HAVING AVG(rating) >= 4.5 and price < 100)`),
        },
      },
    });

    const options = {
      order: [[sequelize.literal('avgRating'), 'DESC']],
      having: sequelize.literal('avgRating >= 4.5 and price <100'),  // Add HAVING clause for trendy products
    };

    const result =await productServices.getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: count, 
      products: result,
    });

  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
}

export const getSpecificProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const productID = req.query.productID as string | undefined;

    if (!productID) {
      return  res.status(400).json({ error: 'productid are required' });
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

    const rating = req.body.rating;
    const productID =Number( req.params.productID);
    const userID = req.user.userID;

   //validate
   const validationResult = ratingValidationSchema.validate({ userID, productID, rating });
   if (validationResult.error) {
     return res.status(400).json("Invalid Input");
   }

    const existProduct = await productServices.getProduct(productID)

    if (!existProduct) {
      return res.status(404).json('Product Not Found');
    }

    const options = {
      where: {
        userID: userID,
        productID: productID,
      }
    }

    const existRate = await ratingSevices.findRatings(options);

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
        return res.status(200).json()
      }
      else { 
        return res.status(200).json();
      }
    }

  } catch (error) {

    return res.status(500).json('Internal Server Error')
  }
}

export const getRateAndReview = async (req: Request, res: Response): Promise<any> => {

  try {
    const productID = req.params.productID;

    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;

     // Validating the request body against the schema
     if (!productID) {
      return res.status(400).json("Invalid Input");
    }

    const count = await ratingModel.count({
      where: {
        productID: productID,
      },
    });

    const options ={
      where: {
        productID: productID,
      },
      include: [{
        model: userModel,
        attributes: ['firstName', 'lastName'],
      }],
      order :[["rating", "DESC"]]
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
    res.status(500).send('Internal Server Error')
  }
}