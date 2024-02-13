// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//     const User = sequelize.define('User', {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true,
//             readOnly: true
//         },
//         firstName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         lastName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty: true
//             }
//         },
//         userName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true, // Ensure email is unique
//             validate: {
//                 notEmpty: true,
//                 isEmail: true // Add email validation
//             }
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             writeOnly: true,
//             validate: {
//                 notEmpty: true
//             }
//         }
//     });

//     return User;
// };

// userModel.js

// userModel.js

const { DataTypes } = require('sequelize');

const defineUserModel = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            readOnly: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure email is unique
            validate: {
                notEmpty: true,
                isEmail: true // Add email validation
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            writeOnly: true,
            validate: {
                notEmpty: true
            }
        }
    });

    return User;
};

module.exports = defineUserModel;
