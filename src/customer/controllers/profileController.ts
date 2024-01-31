import { Request, Response } from 'express'
import { CustomRequest } from "../middlewares/sessionMiddleware";
import * as models from '../../models/modelsRelations'
import * as userServices from '../../services/userServices'
import { MulterRequest } from "../middlewares/multerMiddleware"
import { validNumber } from '../../validators/validateSchema'


export const getMyRatingsAndReviews = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user.userID
    const result = await userServices.getUserRatingsAndReviews(userID)

    res.send(200).json(result)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

export const getUserProfile = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const result = req.user
    res.status(200).json(result)

  } catch (error) {
    console.log(error.message)
    res.status(500).json({error: error.message})
  }
}

export const updateUserProfile = async function (req: CustomRequest, res: Response): Promise<any> {
  try {
    const userID = req.user.userID;

    const { firstName, lastName, mobile, dateOfBirth } = req.body;

    if (!firstName || !lastName) {
      return res.status(404).json({error: "Invalid input"})
    }

    if (mobile) {
      if (!validNumber(mobile)) {
        return res.status(404).json({error: "Invalid phone number"})
      }
    }

    await userServices.updateUserProfile(userID, { firstName: firstName, lastName: lastName, dateOfBirth , mobile })
    res.status(201).json()

  } catch (error) {
    console.log(error.message)
    res.status(500).json({error: error.message})
  }
}

export const uploadPhoto = async (req: MulterRequest, res: Response): Promise<any> => {
  try {
    const userID = req.user.userID;

    const fileBuffer = req.file?.buffer;
    console.log('New Image:', fileBuffer);

    if (!fileBuffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const updatedUser = await userServices.updateUserProfile(userID, { image: fileBuffer })

    if (!updatedUser) {
      return res.status(400).json({error: "Upload Failed"});
    }
    return res.status(200).json(updatedUser.image);


  } catch (error) {
    console.error('Error in uploadPhoto:', error)
    return res.status(500).json({error: error.message})
  }
}

export const deletePhoto = async (req: CustomRequest, res: Response) => {
  try {

    const userID = req.user.userID

    const existPhoto = await models.userModel.findOne({
      where: { userID: userID },
      attributes: ['image'],
    })

    if (!existPhoto.image) {
      return res.status(400).json('User image not found or does not exist.')
    }

    const deletePhoto = await userServices.updateUserProfile(userID, { image: null })

    if (!deletePhoto) {
      return res.status(404).json({error: 'Failed To Delete Photo'})
    }
    return res.status(200).json()

  } catch (error) {
    res.status(500).json({error: 'Failed to Delete Photo'})
  }
}

export const getUserAddresses = async (req: CustomRequest, res: Response): Promise<any> => {

  try {
    const userID = req.user.userID

    if (!userID) {
      return res.status(400).json({error: "Invalid Input"})
    }

    const address = await userServices.getUserAddresses(userID)


    if (!address) {
      return res.status(400).json({error: 'Not Found'})
    }

    return res.json({ address })


  } catch (error) {
    console.error(error)
    return res.status(500).json({error: error.message})
  }
}

export const getUserOrders = async (req: CustomRequest, res: Response): Promise<any> => {
  try {
    const userID = req.user.userID
    const status = (req.query.status as string) || "completed";

    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10

    const orders = await userServices.getUserOrdersByStatus(userID, status, page, pageSize)
    const count = orders.length
    if (!orders) {
      return res.status(404).json({error: "Not Found"})
    }
    return res.status(200).json({ "count": count, "orders": orders })

  } catch (error) {
    res.status(error.status).json({error: error.message})
  }

}
