import BaseModel from "./base";

export class Post extends BaseModel {
	static load(sequelize, DataTypes) {
		return super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				content: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "users",
						key: "id",
					},
				},
				likes: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				paranoid: true,
				timestamps: true,
				sequelize,
				modelName: "post",
				tableName: "posts",
				createdAt: "created_at",
				updatedAt: "updated_at",
				deletedAt: "deleted_at",
				scopes: {
					withUserLike: (id) => ({
						attributes: [
							sequelize.literal(
								`CASE WHEN (
									SELECT 1
									FROM post_likes
									WHERE post_likes.post_id = post.id
									AND post_likes.user_id = :user_id
									AND post_likes.deleted_at is NULL
								) is not null THEN true ELSE false END`
							),
							"is_liked",
						],
						replacements: { user_id: id },
					}),
				},
			}
		);
	}

	static associate(models) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
		this.hasMany(models.PostLike, { foreignKey: "post_id", as: "likes" });
	}
}
