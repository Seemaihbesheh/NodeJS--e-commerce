import { Request, Response } from "express";
import * as orderSevices from "../../services/orderServices";

export const updateOrderStatus = async function (
  req: Request,
  res: Response
): Promise<any> {
  const orderID = Number(req.params.orderID)
  const newState = req.body.state

  try {
    const updatedOrder = await orderSevices.updateOrderStatus(
      orderID,
      newState
    )

    return res.status(200).json(updatedOrder)
  } catch (error) {
    console.error(error);
    res.status(error.status).json(error.message)
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
    res.status(error.status).json(error.message)
  }
}
