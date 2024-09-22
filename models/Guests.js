const { format } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define(
    "Guests",
    {
      RoomNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      RoomId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      GuestId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Checked_In_Date: {
        type: DataTypes.DATE, // Use DATE type to store dates
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("Checked_In_Date");
          return rawValue
            ? format(new Date(rawValue), "dd-MM-yyyy-HH:mm:ss")
            : null;
        },
      },
      Checked_Out_Date: {
        type: DataTypes.DATE, // Use DATE type to store dates
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("Checked_Out_Date");
          return rawValue
            ? format(new Date(rawValue), "dd-MM-yyyy-HH:mm:ss")
            : null;
        },
      },
      IdentityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      IdentityNumber_Hashed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      MobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Guests", // Explicit table name
      timestamps: true, // Enable timestamps if you want `createdAt` and `updatedAt`
    }
  );

  return Guest;
};
