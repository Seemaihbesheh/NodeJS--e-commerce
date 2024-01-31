import Joi from "joi"
import { CustomError } from "../services/customError"

export const wishListValidationSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });



export const addressValidationSchema = Joi.object({
    userID: Joi.number().integer().positive(),
    street: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    pinCode: Joi.number().integer().positive().required(),
});

export const brandValidationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(255).required(),
});


export const cartValidationSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
    productQuantity: Joi.number().integer().min(1),
    isOrdered: Joi.boolean(),
}).options({ abortEarly: false, stripUnknown: true });



export const imageValidationSchema = Joi.object({
    productID: Joi.number().integer().positive().required(),
    imgPath: Joi.string().trim().min(3).max(255).required(),
    position: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });


export const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().min(3).max(255).required(),
}).options({ abortEarly: false, stripUnknown: true });



export const orderValidationSchema = Joi.object({
    userID: Joi.number().integer().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
    street: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    pinCode: Joi.string().required(),
    status: Joi.string().trim().required(),
    isPaid: Joi.boolean().required(),
    date: Joi.date().iso().required(),
    paymentMethod: Joi.string().required(),
    grandTotal: Joi.number().required(),
    displayID: Joi.number().integer().required(),
}).options({ abortEarly: false, stripUnknown: true });


export const orderItemValidationSchema = Joi.object({
    orderID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
    productQuantity: Joi.number().integer().min(1).required(),
    productPrice: Joi.number().precision(2).positive().required(),
    productTitle: Joi.string().trim().min(3).max(255).required(),
    productSubtitle: Joi.string().trim().min(3).max(255).required(),
    productDiscount: Joi.number().integer().min(0).max(100).required(),
}).options({ abortEarly: false, stripUnknown: true });


export const productValidationSchema = Joi.object({
    title: Joi.string().trim().min(3).max(255).required(),
    subTitle: Joi.string().trim().min(3).max(255).allow(null),
    description: Joi.string().trim().allow(null),
    price: Joi.number().precision(2).positive().required(),
    quantity: Joi.number().integer().positive().required(),
    categoryID: Joi.number().integer().positive().required(),
    discount: Joi.number().precision(2).min(0).max(100).required(),
    arrivalDate: Joi.date().iso().allow(null),
    brandID: Joi.number().integer().positive().required(),

}).options({ abortEarly: false, stripUnknown: true });


export const ratingValidationSchema = Joi.object({

    userID: Joi.number().integer().positive().required(),
    rating: Joi.number().precision(2).min(0).max(5).required(), // Assuming ratings are between 0 and 5
    productID: Joi.number().integer().positive().required(),

}).options({ abortEarly: false, stripUnknown: true });

export const validNumber = function (mobileNumber: string): Boolean {
    const phoneRegex = /^\+(\d{2,3})\s(\d{2})-(\d{3})-(\d{4})$/
    return phoneRegex.test(mobileNumber)
}

export const validPassword = function (password: string): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return !!password.match(passwordPattern)
}
export const passwordSchema = Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
    'string.pattern.base': 'Password does not meet requirements: It must be at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters',
  })

export const userSchema = Joi.object({
    password: passwordSchema,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
})