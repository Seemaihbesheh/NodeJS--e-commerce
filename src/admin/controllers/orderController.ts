import { Request, Response } from "express";
import * as orderSevices from "../../services/orderServices";
import  * as validates from '../../validators/validateSchema'
export const updateOrderStatus = async function (
  req: Request,
  res: Response
): Promise<any> {
  const orderID = Number(req.params.orderID)
  const newStatus = req.body.status

  try {
    const validationResult = validates.orderValidationSchema.validate({ orderID:orderID, status:newStatus })

    if (validationResult.error) {
        return res.status(400).json({error: "Invalid Input"});
    }
    const updatedOrder = await orderSevices.updateOrderStatus(
      orderID,
      newStatus
    )

    return res.status(200).json(updatedOrder)
  } catch (error) {
    console.error(error);
    res.status(error.status).json({error: error.message})
  }
}

export const getProcessingOrders = async function (
  req: Request,
  res: Response
): Promise<any> {
  try {
    const processingOrders = await orderSevices.getProcessingOrders()

    res.status(200).json(processingOrders)
  } catch (error) {
    console.error(error);
    res.status(error.status).json({error: error.message})
  }
}
