import { sequelize } from "../config/db"
import { DataTypes, Model } from "sequelize"
interface categoryInstance extends Model {
  categoryID: number,
  name: string,
}
const categoryModel = sequelize.define<categoryInstance>('category', {
  categoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'category'
})

export {categoryModel, categoryInstance}
