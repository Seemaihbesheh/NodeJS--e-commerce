import { Request, Response } from 'express'
import * as orderSevices from '../../services/orderServices'
import {   orderModel} from '../../models/modelsRelations'
import { CustomRequest } from '../middlewares/sessionMiddleware'

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

export const getOrders =async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const state = req.query.state as string ;
      const userID = req.user.userID;
      const page = Number(req.query.page) || 1
      const pageSize = Number(req.query.pageSize) || 10
  
      if (!userID || !state) {
        return res.status(400).json('Invalid Input')
      }
    
      const orders = await orderModel.findAll({
        attributes:['displayID','date','grandTotal','isPaid'],
        where: {
          state: state 
        },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
  
      if(!orders){
        return res.status(400).json("Not Found");
      }
      const count = orders.length
    
      return res.status(200).json({ "count": count, "orders": orders })
  
    } catch (error) {
      res.status(500).json( error.message );
    }
  
  }
  
  