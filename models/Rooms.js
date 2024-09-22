const { format } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      RoomId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Auto-increment RoomId
      },
      EncodedRoomNo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      RoomNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isOccupied: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      GuestId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Customer_Name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      MobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Options
      tableName: "Rooms", // Explicit table name
      timestamps: true, // Enable timestamps to automatically manage `createdAt` and `updatedAt`
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      getterMethods: {
        createdAt() {
          const rawValue = this.getDataValue("createdAt");
          return rawValue ? format(new Date(rawValue), "dd-MM-yyyy") : null;
        },
        updatedAt() {
          const rawValue = this.getDataValue("updatedAt");
          return rawValue ? format(new Date(rawValue), "dd-MM-yyyy") : null;
        },
      },
    }
  );

  return Room;
};
