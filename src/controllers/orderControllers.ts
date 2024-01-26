import { Request, Response } from 'express'
import * as orderSevices from '../services/orderServices'

export const getSpecificOrder = async function (req: Request, res: Response): Promise<any> {
    try {
        const orderID = Number(req.query.orderID)
        const orderDetails = await orderSevices.getSpecificOrder(orderID)
        res.status(200).json(orderDetails)

    } catch (error) {
        console.error(error)
        res.status(500).json(error.message)
    }
}