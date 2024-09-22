const { format } = require("date-fns");

module.exports = (sequelize, DataTypes) => {
  const OrderPayment = sequelize.define(
    "OrderPayment",
    {
      Order_PaymentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      PaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      OrderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Options
      tableName: "Order_Payments", // Explicit table name
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

  return OrderPayment;
};
