const { where } = require("sequelize")
const db = require("../models")
const OrderItem = db.OrderItem

const addOrderItem = async (orderId, itemId, Item_Name, price, quantity) => {
  try {
    const orderItem = await OrderItem.create({
      OrderId: orderId,
      item_id: itemId,
      Item_Name: Item_Name,
      price: price,
      quantity: quantity,
    })
    // console.log("Order item created:", orderItem);
    return orderItem
  } catch (error) {
    console.error("Error adding order item:", error)
    throw error
  }
}

const fetchAllOrderItems = async () => {
  try {
    const orderItems = await OrderItem.findAll({
      order: [
        ["createdAt", "DESC"], // Primary sorting by createdAt in descending order
        ["updatedAt", "ASC"], // Secondary sorting by updatedAt in ascending order
      ],
    })
    // console.log("All order items:", orderItems);
    return orderItems
  } catch (error) {
    console.error("Error fetching order items:", error)
    throw error
  }
}

const fetchOrderItemsByOrderId = async (OrderId) => {
  try {
    const orderItems = await OrderItem.findAll({
      where: {
        OrderId: OrderId,
      },
    })
    console.log("All order items:", orderItems)
    return orderItems
  } catch (error) {
    console.error("Error fetching order items:", error)
    throw error
  }
}

module.exports = { addOrderItem, fetchAllOrderItems, fetchOrderItemsByOrderId }
