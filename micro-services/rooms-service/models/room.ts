import { sequelize } from "../database/connexion";
import { Model, DataTypes } from "sequelize";

// Interface des attributs du modèle Room
interface RoomAttributes {
  room_id: number;
  name: string;
  seatsNumber: number;
  available: boolean;
}

// Interface pour les options de création mieux comprise par ESLint
type RoomCreationAttributes = Omit<RoomAttributes, "room_id"> & {
  room_id?: number;
};

// Modèle de salle
class Room
  extends Model<RoomAttributes, RoomCreationAttributes>
  implements RoomAttributes
{
  public room_id!: number;
  public name!: string;
  public seatsNumber!: number;
  public available!: boolean;
}

Room.init(
  {
    room_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatsNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize, // Instance sequelize
    modelName: "room",
    underscored: true,
    timestamps: true,
  }
);

export default Room;
