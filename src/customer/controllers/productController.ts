import { sequelize } from "../../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel, categoryModel } from "../../models/modelsRelations"
import { CustomRequest } from "../middlewares/sessionMiddleware"
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { brandModel } from "../../models/brand"
import FuzzySearch from 'fuzzy-search'
import { getAllProducts } from "../../services/productServices"


export const getProductsByCategory = async (req: CustomRequest, res: Response): Promise<any> => {
  try{
    const categoryName = req.params.category;
    const category = await categoryModel.findOne({
          where: {
              name: categoryName
          }
    })
      
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

    const result =await getAllProducts(req, res, options);
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

    const brand = await brandModel.findOne({
        where : {
            name : brandName
        }
    })

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
  
    const result =await getAllProducts(req, res, options);
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

    const result =await getAllProducts(req, res, options);
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
    
    const result =await getAllProducts(req, res, options);

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

    const result =await getAllProducts(req, res, options);
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

    const productsCount = await productModel.findAll({
      attributes:[
        "productID",
        [sequelize.fn('COUNT', sequelize.col('products.productID')), 'count']],
      include: [
        {
          model: ratingModel,
          attributes: [],
        },
      ],
      group: ['productID'],
      having: sequelize.literal('AVG(`ratings`.`rating`) >= 4.5'),
    });

    const result =await getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: productsCount.length, 
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

    const category = await categoryModel.findOne({
      attributes: ['categoryID'],
      where: {
        name: categoryName
      }
    })
    if (!category) { return res.status(404).json('No Products Found'); }

    const productsCount = await productModel.findAll({
      attributes:[
        "productID",
        "price",
        [sequelize.fn('COUNT', sequelize.col('products.productID')), 'count']],
      include: [
        {
          model: ratingModel,
          attributes: [],
        },
      ],
      group: ['productID'],
      having: sequelize.literal('AVG(`ratings`.`rating`) >= 4.5 and price <100'),
    });

    const options = {
      order: [[sequelize.literal('avgRating'), 'DESC']],
      having: sequelize.literal('avgRating >= 4.5 and price <100'),  // Add HAVING clause for trendy products
    };

    const result =await getAllProducts(req, res, options);

    res.status(200).json({
      totalCount: productsCount.length, 
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

    const rating = req.body.rating;
    const productID = req.params.productID;
    const userID = req.user.userID;

    // Validate input
    if (!userID || !rating || !productID) {
      return res.status(400).json('Invalid input')
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
        rating: rating,
        productID: productID,
      });


      return res.status(200).json()
    }
    else { //existRate
      if (existRate.rating !== rating) {
        const updatedRows = await ratingModel.update(
          {
            rating: rating,
          },
          {
            where: {
              userID: userID,
              productID: productID,
            },
          }
        )
        return res.status(200).json()
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