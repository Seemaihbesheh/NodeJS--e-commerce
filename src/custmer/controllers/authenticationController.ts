import { userInstance } from '../../models/user'
import * as models from '../../models/modelsRelations'
import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { sessionMiddleware, CustomRequest } from '../middlewares/sessionMiddleware'
const router = express.Router()

export async function findUser(email: string): Promise<userInstance> {
    try {
        const foundUser = await models.userModel.findOne({ where: { email: email } })
        return foundUser
    } catch (err) {
        throw new Error('Error finding user:' + err.message)
    }
}

function generateSessionID(): string {
    const uuid = uuidv4()
    const base64Encoded = Buffer.from(uuid).toString('base64')
    return base64Encoded
}

router.post('/signup', async (req: Request, res: Response) => {
    console.log(req.body)
    const { email, password, firstName , lastName} = req.body
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json('All fields are required')
    }
    try {
        const foundUser = await findUser(req.body.email)
        if (foundUser) {
            throw new Error('Email already exists');
        }
        
        const userData: userInstance = req.body
        const newUser = await models.userModel.create({ email: userData.email, password: userData.password, firstName: firstName, lastName: lastName })

        const sessionID: string = generateSessionID()
        let sessionData = { "sessionID": sessionID, "userID": newUser.userID }
        console.log(await models.sessionModel.create(sessionData))
        res.status(200).json({ "sessionID": sessionID })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password ) {
            return res.status(400).json('Please enter all fields');
        }
        const foundUser = await findUser(req.body.email)

        if (!foundUser) {
            return res.status(404).json('User not found')
        }
        const pass: string = req.body.password
        bcrypt.compare(pass, foundUser.password, async (err, result) => {
            if (err) {
                res.status(500).json(err.message)
            } else if (result) {
                const sessionID: string = generateSessionID()
                let sessionData = { "sessionID": sessionID, "userID": foundUser.userID }
                console.log(await models.sessionModel.create(sessionData))
                res.status(200).json({ "sessionID": sessionID })
            } else {
                res.status(401).json('Invalid username or password')
            }
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.post('/changePassword', sessionMiddleware, async (req: CustomRequest, res: Response) => {
    try {
        console.log(req.body)
        const { email, password, newPassword } = req.body
        if (!email || !password || !newPassword) {
            return res.status(400).json('Please enter all fields');
        }
        const foundUser = await findUser(email)
        if (!foundUser) {
            return res.status(404).json('User not found')
        }
        const passwordMatch = await bcrypt.compare(password, foundUser.password);

        if (passwordMatch) {

            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(newPassword, salt)
            try {
                await models.userModel.update(
                    { password: hashedPass },
                    { where: { email }, ...{ validate: false } }
                )
                let sessionData = req.session
                await models.sessionModel.destroy({ where: { userID: sessionData.userID } })
                res.json('password updated succesfully')

            } catch (err) {
                throw err
            }


        } else {
            res.status(401).json('Invalid username or password')
        }

    }
    catch (err) {
        res.status(500).json(err.message)
    }


})

router.delete('/logout', sessionMiddleware, async (req: CustomRequest, res: Response) => {
    try {
        let sessionData = req.session

        const userSession = await models.sessionModel.findOne({ where: { sessionID: sessionData.sessionID } })

        if (!userSession) {
            return res.status(404).json({ error: 'No sessions found for the user' })
        }

        await models.sessionModel.destroy({ where: { sessionID: sessionData.sessionID } })

        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout', details: error.message })
    }

})

export default router