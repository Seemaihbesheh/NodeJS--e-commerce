import { sequelize } from "../config/db"
import { productModel, imageModel, ratingModel, sessionModel, userModel, categoryModel } from "../models/modelsRelations"
import { CustomRequest } from "../middlewares/sessionMiddleware"
import { Request, Response } from 'express'
import { isAdedToWishlist } from '../utils/wishlistUtils'
import { Op } from 'sequelize';
import { brandModel } from "../models/brand";


export const getTrendyProducts = async function (req: Request, res: Response): Promise<any> {
    try {
        let productsWithIsAdded = []
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
            ],
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: sequelize.literal('position = 1'),
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [],
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
        productsWithIsAdded = await getProductsAndIsAdded(req, trendyProducts)

        return res.status(200).json({ "count": count, "products": productsWithIsAdded })
    } catch (err) {
        return res.status(500).json({ error: 'Failed to get products', details: err.message })
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

async function getProductsAndIsAdded(req: Request, products: any[]): Promise<any[]> {
    const userID = await isAuthorized(req)
    if (!userID) {
        return products.map((product) => ({
            ...product.toJSON(),
            isAddedToWishList: 0,
        }))
    }

    const isAddedPromises = products.map(product => isAdedToWishlist(userID, product.productID))
    const isAddedResults = await Promise.all(isAddedPromises);

    return products.map((product, index) => ({
        ...product.toJSON(),
        isAddedToWishList: isAddedResults[index],
    }))
}

export const getProductsByCategory = async function (req:Request , res:Response): Promise<any>{
    try{
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const categoryName = req.params.category;
        // const userID = req.user?.userID || null;

        let userID = await isAuthorized(req);
        if(!userID){
            userID = null;
        }

        console.log(userID);

        const category = await categoryModel.findOne({
            where : {
                name : categoryName
            }
        })

        if(!category){
            return res.status(404).json("category does not exist")
        }

        const count = await productModel.count({
            where : {
                categoryID : category.dataValues.categoryID
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
            where :{
                categoryID : category.dataValues.categoryID
            },
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: {
                        position :1
                    },
                    as: "images",
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [],
                    as :"ratings",
                    required: false
                },
            ],
            group: ['productID'],
            offset : (page-1) *pageSize,
            order : ["productID"],
            limit : pageSize,
            subQuery: false
        });


        res.json({
            totalCount : count,
            products : result
        });

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : "server error"});
    }  
}

export const getProductsByBrand = async function (req:Request , res:Response): Promise<any>{
    try{
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        const brandName = req.params.brand;
        // const userID = req.user?.userID || null;

        let userID = await isAuthorized(req);
        if(!userID){
            userID = null;
        }

        const brand = await brandModel.findOne({
            where : {
                name : brandName
            }
        })

        if(!brand){
            return res.status(404).json("brand does not exist")
        }

        const count = await productModel.count({
            where:{
                brandID : brand.dataValues.brandID
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
            where :{
                brandID : brand.dataValues.brandID
            },
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: {
                        position :1
                    },
                    required :false
                },
                {
                    model: ratingModel,
                    attributes: [],
                    required: false,
                    as : "ratings",
                }
            ],
            group : ["productID"],
            offset : (page-1) *pageSize,
            limit : pageSize,
            order : ["productID"],
            subQuery : false
            
        });
        res.json({
            totalCount : count,
            products : result
        });

    }catch(error){
        console.log(error.message);
        res.status(500).json({message : "server error"});
    }
}

export const getNewArrivalProducts = async function (req:Request , res:Response): Promise<any>{
    try{
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;

        let userID = await isAuthorized(req);
        if(!userID){
            userID = null;
        }

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const count = await productModel.count({
            where :{
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
            where :{
                arrivalDate: {
                    [Op.gt]: threeMonthsAgo,
                  },
            },
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: {
                        position :1
                    },
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [],
                    required: false,
                    as:"ratings"
                }
            ],
            group : ["productID"],
            offset : (page-1) *pageSize,
            limit : pageSize,
            order : [["arrivalDate" , "DESC"]],
            subQuery:false
        });

        res.json({
            totalCount : count,
            products : result
        });

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : "server error"});
    }  
}

export const getLimitedProducts = async function (req:Request , res:Response): Promise<any> {
    try{
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;

        let userID = await isAuthorized(req);
        if(!userID){
            userID = null;
        }

        const count = await productModel.count({
            where :{
                quantity :{
                    [Op.lt] : 20,
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
            where :{
                quantity :{
                    [Op.lt] : 20,
                }
            },
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: {
                        position :1
                    },
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [ ],
                    required: false,
                    as : "ratings"
                }
            ],
            group : ["productID"],
            offset : (page-1) *pageSize,
            limit : pageSize,
            order : ["productID"],
            subQuery:false
        });

        res.status(200).json({
            totalCount : count,
            products : result
        })

    }catch(error){
        res.status(500).json({message : "server error"})
    }
}

export const getProductsByDiscoutOrMore = async function (req:Request , res:Response): Promise<any> {
    try{
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 20;
        // const userID = req.user?.userID || null;

        let userID = await isAuthorized(req);
        if(!userID){
            userID = null;
        }

        const discount = Number(req.query.discount) || 15;

        const count = await productModel.count({
            where :{
                discount :{
                    [Op.gte] : discount,
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
            where :{
                discount :{
                    [Op.gte] : discount,
                }
            },
            include: [
                {
                    model: imageModel,
                    attributes: [],
                    where: {
                        position :1
                    },
                    required: false
                },
                {
                    model: ratingModel,
                    attributes: [],
                    required: false,
                    as : "ratings"
                }
            ],
            group : ["productID"],
            offset : (page-1) *pageSize,
            limit : pageSize,
            order : ["productID"],
            subQuery:false
        });

        res.status(200).json({
            totalCount : count,
            products : result
        })

    }catch(error){
        res.status(500).json({message : "server error"})
    }
}



export const handPicked = async (req: Request, res: Response): Promise<any> => {
    try {
      let productsWithIsAdded = []
      const categoryName = req.query.category as string | undefined;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;
      const category = await categoryModel.findOne({
        attributes: ['categoryID'],
        where: {
          name: categoryName
        }
      })
      if (category) {
        const handPickedProducts = await productModel.findAll({
          attributes: [
            "productID",
            "title",
            "subTitle",
            "price",
            "discount",
            [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col("ratings.rating")), 0), 'avgRating'],
            [sequelize.fn('COUNT', sequelize.col("ratings.rating")), 'ratingCount'],
            [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = products.productID AND images.position = 1 LIMIT 1)'), 'imgPath'], // to make the response
          ],
          include: [
            {
              model: ratingModel,
              attributes: [],
              as: "ratings",
              where: { rating: { [Op.gt]: 4.5 } },
              required: false
            }
            , {
              model: categoryModel,
              attributes: [],
              where: {
                categoryID: category.categoryID,
  
              }
            },
            {
              model: imageModel,
              attributes: [],
              where: sequelize.literal('position = 1'),
              required: false
            }
          ],
          where: {
            price: { [Op.lt]: 100 },
          },
          group: ['productID'],
          offset: (page - 1) * pageSize,
          limit: pageSize,
          order: [[sequelize.literal('avgRating'), 'DESC']],
          subQuery: false
        })
        for (const product of handPickedProducts) {
          let ratingCount = await ratingModel.count({
            where: {
              productID: product.productID,
            },
          });
        }
        const count = handPickedProducts.length;
  
        productsWithIsAdded = await getProductsAndIsAdded(req, handPickedProducts)
        return res.status(200).json(
          {
            "totalCount": count,
            "products": productsWithIsAdded,
          });
      } else {
        return res.status(404).json('No Products Found');
      }
    } catch (error) {
      res.status(500).json('Internal Server Error');
    }
  };
  
  
  
  export const getSpecificProduct = async (req: Request, res: Response): Promise<any> => {
    try {
      const productid = req.params.productID as string | undefined;
  
      if (!productid) {
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
          productID: productid
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
        { "totalCount":count, 
          "reviews":reviews }
      );
  
    } catch (error) {
      console.error(error);
      return  res.status(500).json( 'Internal Server Error' );
    }
  }
  
  
  
