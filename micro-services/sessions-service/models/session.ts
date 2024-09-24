import { sequelize } from "./../database/connexion";
import { Optional, Model, DataTypes } from "sequelize";

// Interface des attributs du modèle session
interface SessionAttributes {
  id: number;
  movie_id: number; // On conserve uniquement l'ID du film
  room_id: number; // On conserve uniquement l'ID de la salle
  date: Date;
  heure_debut: string;
  heure_fin: string;
  nb_spectateurs: number;
}

// Interface pour les options de création
interface SessionCreationAttributes extends Optional<SessionAttributes, "id"> {}

// Modèle de session
class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  public id!: number;
  public movie_id!: number; // ID du film
  public room_id!: number; // ID de la salle
  public readonly date!: Date;
  public heure_debut!: string;
  public heure_fin!: string;
  public nb_spectateurs!: number;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Stocke uniquement l'ID du film
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Stocke uniquement l'ID de la salle
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    heure_debut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    heure_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    nb_spectateurs: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // Instance sequelize
    modelName: "session",
    underscored: true,
    timestamps: true,
  }
);

export default Session;
