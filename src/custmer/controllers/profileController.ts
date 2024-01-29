import { sequelize } from "../../config/db"
import { Request, Response } from 'express'
import { CustomRequest } from "../middlewares/sessionMiddleware";
import { ratingModel } from "../../models/rating";
import { productModel } from "../../models/product";
import { imageModel } from "../../models/images";
import { userModel } from "../../models/user";
import {MulterRequest} from "../middlewares/multerMiddleware"

  export const uploadPhoto = async (req: MulterRequest, res: Response): Promise<any> => {
    try {
  
      const userID = req.user.userID;
      if (!userID ) {
        return res.status(400).json( 'Invalid input' );
      }
     const fileBuffer = req.file?.buffer;

      if (!fileBuffer) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
     // return res.status(200).json(fileBuffer);
      const  updatedUser = await userModel.update(
        { image: fileBuffer },
        {
          where: { userID: userID },
          returning: true,
        }
      );
  
      const user= await userModel.findOne({
          where: { userID: userID }
      })
  
      if(!updatedUser){
        return res.status(400).json("Uploaded Failed");
      }
      return res.status(200).json(user.image);
      
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return res.status(500).json(error.message);
    }
  };
  
  export const deletePhoto= async (req: CustomRequest, res: Response) => {
    try {
       
      const userID = req.user.userID;
       
  
        if (!userID) {
            return res.status(404).json({ error: 'User Not found ' })
        }
        const existPhoto = await userModel.findOne({
          where: { userID: userID },
          attributes: ['image'],
        });
        
        if (!existPhoto.image) {
          return res.status(400).json( 'User image not found or does not exist.');
        }
  
        const deletePhoto = await userModel.update(
          { image: null },
          {
            where: { userID: userID },
            returning: true,
          }
        );
  
        if(!deletePhoto){
          return res.status(404).json(' Failed Delete Photo');
        }
  
        return res.status(200).json('Delete Photo successfully' )
    } catch (error) {
        res.status(500).json( 'Failed to Delete Photo')
    }
  }
  
  

  
export const getMyRatingsAndReviews = async function (req:CustomRequest , res:Response): Promise<any>{
    try{
        const userID = req.user.userID;

        const result = await ratingModel.findAll({
            attributes:[
                "rating",
            ],
            where:{
                userID : userID
            },
            include :[{
                model : productModel,
                as:"product",
                attributes :[
                    "title",
                    "subTitle",
                    [sequelize.literal('(SELECT imgPath FROM images WHERE images.productID = ratings.productID AND images.position = 1 LIMIT 1)'), 'imgPath'],
                ],
                include :[{
                    model :imageModel,
                    attributes :[],
                    where :{
                        position :1
                    },
                    as : "images",
                    required : false
                }   
                ]
            },
            ],
        });
        res.json(result);

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : "server error"});
    }  
}

export const getUserProfile = async function (req:CustomRequest , res:Response): Promise<any>{
    try{
        const userID = req.user.userID;

        const result = await userModel.findByPk(userID,{
            attributes:[
                "firstName",
                "lastName",
                "email",
                "mobile",
                "image",
                "dateOfBirth"
            ]
        });

        res.json(result);

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : "server error"});
    }  
}

export const updateUserProfile = async function (req:CustomRequest , res:Response): Promise<any>{
    try{
        const userID = req.user.userID;

        const {firstName , lastName , mobile , dateOfBirth} = req.body;

        if(!firstName || !lastName ){
            return res.status(404).json("Invalid input");
        }

        if(mobile){
            // phone number should be in this format "+xx xx-xxx-xxxx" or "+xxx xx-xxx-xxxx"
            const phoneRegex = /^\+(\d{2,3})\s(\d{2})-(\d{3})-(\d{4})$/;
            if(!phoneRegex.test(mobile)){
                return res.status(404).json("Invalid phone number");
            }
        }

        console.log(userID)
        
        const result = await userModel.update({
            firstName : firstName,
            lastName : lastName,
            mobile :mobile,
            dateOfBirth : dateOfBirth
        }, {
            where: {
                userID: userID
            }
        });

        res.status(201).json("updated successfully");

    }catch(error){
        console.log(error.message)
        res.status(500).json({message : "server error"});
    }  
}