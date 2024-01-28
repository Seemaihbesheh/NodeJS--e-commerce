import { hashPassword } from '../utils/userUtils'
import { generateSessionID } from '../utils/sessionUtils'
import * as userServices from '../services/userServices'
import * as models from '../models/modelsRelations'
import { CustomError } from './customError'
import bcrypt from 'bcrypt'

export async function signUp(userData: any): Promise<{ sessionID: string }> {
    try {
        const { email, password, firstName, lastName } = userData

        if (!email || !password || !firstName || !lastName) {
            throw new CustomError('All fields are required', 400)
        }

        const foundUser = await userServices.findUser(email)

        if (foundUser) {
            throw new CustomError('Email already exists', 400)
        }

        const newUser = await models.userModel.create({
            email: userData.email,
            password: userData.password,
            firstName,
            lastName,
        });

        const sessionID = generateSessionID()
        const sessionData = { sessionID, userID: newUser.userID }
        await models.sessionModel.create(sessionData)

        return { sessionID }
    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError('Internal Server Error', 500)
        }
    }
}

export async function login(userData: any): Promise<{ sessionID: string }> {
    try {
        const { email, password } = userData

        if (!email || !password) {
            throw new CustomError('Please enter all fields', 400)
        }

        const foundUser = await userServices.findUser(email)

        if (!foundUser) {
            throw new CustomError('User not found', 404)
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password)

        if (!passwordMatch) {
            throw new CustomError('Invalid username or password', 400)
        }

        const sessionID = generateSessionID()
        const sessionData = { sessionID, userID: foundUser.userID }
        await models.sessionModel.create(sessionData)

        return { sessionID }
    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError('Internal Server Error', 500)
        }
    }
}

export async function changePassword(userID: number, userData: any): Promise<any> {
    try {
        const { email, password, newPassword } = userData

        if (!email || !password || !newPassword) {
            throw new CustomError('Please enter all fields', 400)
        }

        const foundUser = await userServices.findUser(email)

        if (!foundUser) {
            throw new CustomError('User not found', 404)
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password)

        if (!passwordMatch) {
            throw new CustomError('Invalid username or password', 400)
        }

        const hashedPass = await hashPassword(newPassword)

        await models.userModel.update(
            { password: hashedPass },
            { where: { email }, ...{ validate: false } }
        )

        await models.sessionModel.destroy({ where: { userID: userID } })

        return 'Password updated successfully'
    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError('Internal Server Error', 500)
        }
    }
}

export async function logout(sessionID: number): Promise<any> {
    try {
        const userSession = await models.sessionModel.findOne({ where: { sessionID: sessionID } })

        if (!userSession) {
            throw new CustomError('No sessions found for the user', 404);
        }

        await models.sessionModel.destroy({ where: { sessionID: sessionID } })

        return 'Logged out successfully'
    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError('Internal Server Error', 500)
        }
    }
}
