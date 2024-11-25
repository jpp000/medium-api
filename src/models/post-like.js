import BaseModel from "./base";

export default class PostLike extends BaseModel {
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
				modelName: "PostLike",
				tableName: "post_likes",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
		this.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
	}
}
