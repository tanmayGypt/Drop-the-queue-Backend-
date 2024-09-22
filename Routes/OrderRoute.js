const express = require("express")
// const { v4: uuidv4 } = require("uuid")
const {
  FetchAllOrders,
  UpdateOrder,
  AddNewOrder,
  FetchOrderById,
  FetchUnbilledOrder,
} = require("../controller/OrdersController")
const { addOrderItem } = require("../controller/OrderedItemsController")
const { UUIDV4 } = require("sequelize")
const { Orders } = require("../models")
const Razorpay = require("razorpay")
const crypto = require("crypto")
const { AddAllPayment } = require("../controller/All_PaymentsController")

const route = express.Router()

route.get("/FetchAllOrders", (req, res) => {
  FetchAllOrders()
    .then((Items) => {
      res.status(200).send(Items)
    })
    .catch((err) => {
      res.status(404).json(err)
    })
})
route.get("/FetchOrderById/:OrderId", (req, res) => {
  const OrderId = req.params.OrderId
  FetchOrderById(OrderId)
    .then((Items) => {
      res.status(200).send(Items)
    })
    .catch((err) => {
      res.status(404).json(err)
    })
})
route.get("/FetchUnbilledOrder/:GuestId", (req, res) => {
  const CustomerId = req.params.GuestId
  FetchUnbilledOrder(CustomerId)
    .then((Items) => {
      res.status(200).send(Items)
    })
    .catch((err) => {
      res.status(404).json(err)
    })
})
route.post("/UpdateOrder/:OrderId", async (req, res) => {
  const OrderId = req.params.OrderId
  const {
    isPaid,
    Payment_Mode,
    OrderStatus,
    PaymentId,
    TransactionId,
    RoomId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body
  if (Payment_Mode === "online") {
    let orderData
    const sha = crypto.createHmac("sha256", process.env.Razorpay_Secret_key)
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = sha.digest("hex")
    console.log("digest", digest)
    if (digest !== razorpay_signature) {
      return res.status(400).json("Transaction is not valid")
    } else {
      await AddAllPayment(
        PaymentId,
        TransactionId,
        razorpay_order_id,
        RoomId,
        true,
        Payment_Mode
      )
    }
  }
  UpdateOrder(OrderId, isPaid, Payment_Mode, OrderStatus)
    .then((Items) => {
      res.status(200).send(Items)
    })
    .catch((err) => {
      res.status(404).json(err)
    })
})

route.post("/deleteOrder/:OrderId", async (req, res) => {
  const OrderId = req.params.OrderId
  console.log("id", OrderId)
  try {
    let response = await Orders.destroy({
      where: {
        OrderId,
      },
    })
    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error // Ensure the error is propagated
  }
})

route.post("/CreateOrder", async (req, res) => {
  const options = req.body
  try {
    const razorpay = new Razorpay({
      key_id: process.env.Razorpay_Key_Id,
      key_secret: process.env.Razorpay_Secret_Key,
    })
    const order = await razorpay.orders.create(options)
    if (!order) {
      return res.status(500).json("Failed to create order")
    }
    res.json(order)
  } catch (err) {
    res.status(400).json(err)
  }
})

route.post("/AddNewOrder", async (req, res) => {
  const {
    CustomerId,
    isPaid,
    TotalAmount,
    OrderedItems,
    RoomId,
    Payment_Mode,
    OrderStatus,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    PaymentId,
    TransactionId,
  } = req.body
  console.log(
    "razor",
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  )

  try {
    let orderData
    if (Payment_Mode === "online") {
      const sha = crypto.createHmac("sha256", process.env.Razorpay_Secret_key)

      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
      const digest = sha.digest("hex")
      console.log("digest", digest)
      if (digest !== razorpay_signature) {
        return res.status(400).json("Transaction is not valid")
      }
      orderData = await AddNewOrder(
        razorpay_order_id,
        CustomerId,
        isPaid,
        TotalAmount,
        RoomId,
        Payment_Mode,
        OrderStatus
      )
      await OrderedItems.forEach((element) => {
        addOrderItem(
          razorpay_order_id,
          element.item_id,
          element.Item_Name,
          element.price,
          element.quantity
        )
      })

      await AddAllPayment(
        PaymentId,
        TransactionId,
        razorpay_order_id,
        RoomId,
        true,
        Payment_Mode
      )
    } else {
      const { customAlphabet } = await import("nanoid")

      // Define your custom alphabet and length
      const customAlphabetString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const generateCustomId = customAlphabet(customAlphabetString, 15)

      // Generate an Order ID
      const OrderId = generateCustomId()
      orderData = await AddNewOrder(
        OrderId,
        CustomerId,
        isPaid,
        TotalAmount,
        RoomId,
        Payment_Mode,
        OrderStatus
      )
      await OrderedItems.forEach((element) => {
        addOrderItem(
          OrderId,
          element.item_id,
          element.Item_Name,
          element.price,
          element.quantity
        )
      })
    }

    res.status(200).json(orderData)
  } catch (e) {
    console.log(e)
    res.status(400).json(e)
  }
})

module.exports = route
