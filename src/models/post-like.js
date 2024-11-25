import BaseModel from "./base";

export class PostLike extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				post_id: {
					type: DataTypes.INTEGER,
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
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		this.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
	}
}