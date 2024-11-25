import BaseModel from "./base";

export class User extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					unique: true,
					allowNull: false,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize,
				modelName: "user",
				tableName: "users",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
			}
		);
	}

	static associate(models) {
		this.hasMany(models.Post, { foreignKey: "user_id", as: "posts" });
		this.hasMany(models.PostLike, { foreignKey: "user_id", as: "likes" });
	}
}
