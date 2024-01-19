import { wishListModel } from "../models/modelsRelations"

export const isAdedToWishlist = async function isAdedToWishlist(userID: any, productID: number): Promise<number> {
    const isAdded = await wishListModel.findOne({
        where: {
            userID: userID,
            productID: productID
        }
    })
    if (isAdded) return 1
    else return 0
} 
