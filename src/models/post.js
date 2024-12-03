import BaseModel from "./base";
import User from "./user";

export default class Post extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				content: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				total_likes: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize,
				modelName: "Post",
				tableName: "posts",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
				scopes: {
					withUserLike: (user_id) => ({
						attributes: [
							[
								sequelize.literal(
									`CASE WHEN (
											SELECT 1
											FROM post_likes
											WHERE post_likes.post_id = "Post".id
											AND post_likes.user_id = :user_id
											AND post_likes.deleted_at is NULL
										) is not null THEN true ELSE false END`
								),
								"is_liked",
							],
						],
						replacements: {
							user_id,
						},
					}),
					postUser: {
						include: [
							{
								model: User,
								as: "user",
								attributes: ["id", "name", "email"],
							},
						],
					},
				},
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, {
			foreignKey: "user_id",
			as: "user",
			onDelete: "CASCADE",
		});
		this.hasMany(models.PostLike, {
			foreignKey: "post_id",
			as: "likes",
			onDelete: "CASCADE",
		});
	}
}
