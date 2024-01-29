import Joi from "joi";


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

// Define Joi schema for validation
export const brandValidationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(255).required(),
});


// Joi schema for validation
export const cartValidationSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
    productQuantity: Joi.number().integer().min(1).required(),
    isOrdered: Joi.boolean().required(),
}).options({ abortEarly: false, stripUnknown: true });



// Joi schema for validation
export const imageValidationSchema = Joi.object({
    productID: Joi.number().integer().positive().required(),
    imgPath: Joi.string().trim().min(3).max(255).required(),
    position: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });

// Joi schema for validation
export const categoryValidationSchema = Joi.object({
    name: Joi.string().trim().min(3).max(255).required(),
}).options({ abortEarly: false, stripUnknown: true });



// Joi schema for validation
export const orderValidationSchema = Joi.object({
    userID: Joi.number().integer().positive().required(),
    fullName: Joi.string().trim().min(2).max(255).required(),
    email: Joi.string().trim().email().required(),
    mobile: Joi.string().trim().pattern(/^\d{10}$/).required(),
    addressID: Joi.number().integer().positive().required(),
    state: Joi.string().trim().min(2).max(255).required(),
    isPaid: Joi.boolean().required(),
    date: Joi.date().iso().required(),
    paymentMethod: Joi.string().trim().min(2).max(255).required(),
    grandTotal: Joi.number().precision(2).positive().required(),
    displayID: Joi.number().integer().positive().required(),
}).options({ abortEarly: false, stripUnknown: true });


// Joi schema for validation
export const orderItemValidationSchema = Joi.object({
    orderID: Joi.number().integer().positive().required(),
    productID: Joi.number().integer().positive().required(),
    productQuantity: Joi.number().integer().min(1).required(),
    productPrice: Joi.number().precision(2).positive().required(),
    productTitle: Joi.string().trim().min(3).max(255).required(),
    productSubtitle: Joi.string().trim().min(3).max(255).required(),
    productDiscount: Joi.number().integer().min(0).max(100).required(),
}).options({ abortEarly: false, stripUnknown: true });


// Joi schema for validation
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


// Joi schema for validation
export const ratingValidationSchema = Joi.object({
    
    userID: Joi.number().integer().positive().required(),
    rating: Joi.number().precision(2).min(0).max(5).required(), // Assuming ratings are between 0 and 5
    productID: Joi.number().integer().positive().required(),

}).options({ abortEarly: false, stripUnknown: true });

