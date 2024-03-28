const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const EmailVerification = sequelize.define('EmailVerification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users', // Assuming your User model is named 'User'
                key: 'id'
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false 
        },

        sentAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    EmailVerification.associate = (models) => {
        EmailVerification.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return EmailVerification;
};
