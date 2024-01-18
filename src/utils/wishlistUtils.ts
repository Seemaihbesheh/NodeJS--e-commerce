import { wishListModel } from "../models/modelsRelations"

export const isAdedToWishlist = async function isAdedToWishlist(userID: any, productID: number): Promise<boolean> {
    const isAdded = await wishListModel.findOne({
        where: {
            userID: userID,
            productID: productID
        }
    })
    if (isAdded) {
        console.log ("clabla")
        return true}
    else return false
} 