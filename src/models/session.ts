import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"

interface sessionInstance extends Model {
  sessionID: string
  userID: number
}

const sessionModel = sequelize.define<sessionInstance>('sessions', {
  sessionID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'sessions'
})
export {
  sessionModel,
  sessionInstance
} 