const { format } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      OrderId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      CustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      TotalAmount: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      RoomId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      Payment_Mode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      // Options
      tableName: "Orders", // Explicit table name
      timestamps: true, // Enable timestamps to automatically manage `createdAt` and `updatedAt`
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      getterMethods: {
        createdAt() {
          const rawValue = this.getDataValue("createdAt");
          return rawValue
            ? format(new Date(rawValue), "dd-MM-yyyy" + "-" + "HH:MM:SS")
            : null;
        },
        updatedAt() {
          const rawValue = this.getDataValue("updatedAt");
          return rawValue ? format(new Date(rawValue), "dd-MM-yyyy") : null;
        },
      },
    }
  );

  return Order;
};
