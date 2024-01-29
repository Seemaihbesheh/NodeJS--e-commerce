import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<any> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}