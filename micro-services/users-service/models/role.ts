import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/connexion";

// Interface des attributs du modèle Role
interface RoleAttributes {
  id: number;
  role_name: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface pour les options de création
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

// Modèle de rôle
class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public role_name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
   
  },
  {
    sequelize,
    modelName: "role",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Role;
