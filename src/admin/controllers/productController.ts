import { Request, Response } from 'express'
import { productModel } from '../../models/product';
import * as categorySevices from "../../services/categoryServices";
import * as brandSevices from "../../services/brandServices";
import * as productSevices from '../../services/productServices'
import  * as validates from '../../validators/validateSchema'

export const addProduct = async function (req : Request , res:Response) {
    try{
        const {title ,subTitle, description, price, quantity, categoryName, brandName} = req.body;

        const validationResult = validates.productValidationSchema.validate({ title, subTitle, description, price, quantity }) && validates.brandValidationSchema.validate({ name: brandName }) && validates.categoryValidationSchema.validate({ name: categoryName });

        if (validationResult.error) {
            return res.status(400).json("Invalid Input");
        }

        let discount = req.body.discount
        if(!discount){
            discount = 0;
        }

        

        const category = await categorySevices.findCategoryByName(categoryName)
        if(!category){
            return res.status(404).json("category doesn't exixt");
        }
        const categoryID = category.dataValues.categoryID;

        const brand = await brandSevices.findBrandByName(brandName)
        if(!brand){
            return res.status(404).json("brand doesn't exixt");
        }
        const brandID = brand.dataValues.brandID;

        await productSevices.createProduct({
            title :title,
            subTitle :subTitle,
            description: description,
            price:price,
            quantity :quantity,
            categoryID: categoryID,
            brandID : brandID,
            arrivalDate : new Date(),
            discount: discount
        })

        res.status(201).json("added successfully");

    }catch(error){
        res.status(500).json("Internal Server Error")
    }
}

export const updateProduct = async function (req : Request , res:Response) {
    try{
        const productID=Number( req.params.productID)
        const {title ,subTitle, description, price, quantity, categoryName, brandName , discount} = req.body;

        const validationResult = validates.productValidationSchema.validate({ title, subTitle, description, price, quantity,discount }) && validates.brandValidationSchema.validate({ name: brandName }) && validates.categoryValidationSchema.validate({ name: categoryName });

        if (validationResult.error) {
            return res.status(400).json("Invalid Input");
        }
        const product = await productModel.findByPk(productID);
        if(!product){
            return res.status(404).json("product not found")
        }

       }

        //if the admin need to update the category
        let category;
        let categoryID;
        if(categoryName){
            category = await categorySevices.findCategoryByName(categoryName)
            if(!category){
                return res.status(404).json("category doesn't exixt");
            }
            categoryID = category.dataValues.categoryID;
        }
        //if the admin need to update the brand
        let brand;
        let brandID;
        if(brandName){
            brand = await brandSevices.findBrandByName(brandName)
            if(!brand){
                return res.status(404).json("brand doesn't exixt");
            }
            brandID = brand.dataValues.brandID;            
        }

        await productSevices.updateProduct(productID,{
            title :title,
            subTitle :subTitle,
            description: description,
            price:price,
            quantity :quantity,
            categoryID: categoryID,
            brandID : brandID,
            discount: discount
        })

        res.json("updated successfully");

    }catch(error){
        res.status(500).json("Internal Server Error")
    }
}
