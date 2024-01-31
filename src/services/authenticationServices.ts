import { hashPassword } from "../utils/userUtils"
import * as userServices from "../services/userServices"
import * as models from "../models/modelsRelations"
import { CustomError } from "./customError"
import bcrypt from "bcrypt"
import * as validations from "../validators/validateSchema"
import * as sessionServices from './sessionServices'

export async function signUp(userData: any): Promise<{ sessionID: string }> {
    try {
        const { email, password, firstName, lastName } = userData

        const validationResult = validations.userSchema.validate({ email, password, firstName, lastName })
        if (validationResult.error) {
            const errorMessage = validationResult.error.message
            throw new CustomError(errorMessage, 400)
        }

        const foundUser = await userServices.findUser({ email: email })
        if (foundUser) {
            throw new CustomError("Email already exists", 400)
        }


        const newUser = await userServices.createUser(userData)
        const session = await sessionServices.createSession({ userID: newUser.userID })
        return { sessionID: session.sessionID }

    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw error
        }
    }
}

export async function login(userData: any): Promise<{ sessionID: string }> {
    try {
        const { email, password } = userData
        if (!email || !password) {
            throw new CustomError("Please enter all fields", 400)
        }

        const foundUser = await userServices.findUser({ email })
        if (!foundUser) {
            throw new CustomError("User not found", 404)
        }

        const passwordMatch = await verifyPassword(password, foundUser.password)
        if (!passwordMatch) {
            throw new CustomError("Invalid username or password", 400)
        }

        const session = await sessionServices.createSession({ userID: foundUser.userID })
        return { sessionID: session.sessionID }

    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError("Internal Server Error", 500)
        }
    }
}

export async function changePassword(
    userID: number,
    userData: any
): Promise<any> {
    try {
        const { email, password, newPassword } = userData;
        if (!email || !password || !newPassword) {
            throw new CustomError("Please enter all fields", 400)
        }

        const foundUser = await userServices.findUser({ email })
        if (!foundUser) {
            throw new CustomError("User not found", 404)
        }

        const passwordMatch = await verifyPassword(password, foundUser.password)
        if (!passwordMatch) {
            throw new CustomError("Invalid username or password", 400)
        }

        const validationResult = validations.passwordSchema.validate(newPassword)
        if (validationResult.error) {
            const errorMessage = validationResult.error.message
            throw new CustomError(errorMessage, 400)
        }

        const hashedPass = await hashPassword(newPassword)
        await models.userModel.update(
            { password: hashedPass },
            { where: { email }, ...{ validate: false } }
        )

        await sessionServices.deleteSession({ userID: userID })
        return "Password updated successfully"

    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError("Internal Server Error", 500)
        }
    }
}

export async function logout(sessionID: string): Promise<any> {
    try {
        const userSession = await sessionServices.findSession(sessionID)
        if (!userSession) {
            throw new CustomError("No sessions found for the user", 404)
        }

        await sessionServices.deleteSession({ sessionID: sessionID })
        return "Logged out successfully"

    } catch (error) {
        if (error instanceof CustomError) {
            throw error
        } else {
            throw new CustomError("Internal Server Error", 500)
        }
    }
}

export const verifyPassword = async function (password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
        throw new CustomError("Error verifying password", 500)
    }
}