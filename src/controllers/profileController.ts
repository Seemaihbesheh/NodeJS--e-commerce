import { sequelize } from "../config/db"
import { Request, Response } from 'express'
import { CustomRequest } from "../middlewares/sessionMiddleware";
import { ratingModel } from "../models/rating";
import { productModel } from "../models/product";
import { imageModel } from "../models/images";
import { userModel } from "../models/user";

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

        const {firstName , lastName } = req.body;

        if(!firstName || !lastName ){
            return res.status(404).json("Invalid input");
        }

        // if(mobile){
        //     // phone number should be in this format "+xx xx-xxx-xxxx" or "+xxx xx-xxx-xxxx"
        //     const phoneRegex = /^\+(\d{2,3})\s(\d{2})-(\d{3})-(\d{4})$/;
        //     if(!phoneRegex.test(mobile)){
        //         return res.status(404).json("Invalid phone number");
        //     }
        // }

        console.log(userID)
        
        const result = await userModel.update({
            firstName : firstName,
            lastName : lastName,
            // mobile :mobile,
            // dateOfBirth : dateOfBirth
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