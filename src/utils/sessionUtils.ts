import { v4 as uuidv4 } from 'uuid'

export function generateSessionID(): string {
  const uuid = uuidv4()
  const base64Encoded = Buffer.from(uuid).toString('base64')
  return base64Encoded
}