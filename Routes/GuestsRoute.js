const { guestTokenGenerator } = require("../TokenGenerator");
const auth = require("../auth");
const db = require("../models");
const { where } = require("sequelize");
const {
  AddGuest,
  VerifyGuest,
  FetchAllGuests,
  FetchGuestById,
  DeleteGuestById,
} = require("../controller/GuestsController");
const express = require("express");

const route = express.Router();

route.post("/AddGuest", (req, res) => {
  const {
    RoomNumber,
    RoomId,
    Customer_Name,
    Checked_In_Date,
    Checked_Out_Date,
    IdentityType,
    IdentityNumber_Hashed,
    MobileNumber,
  } = req.body;
  AddGuest(
    RoomNumber,
    RoomId,
    Customer_Name,
    Checked_In_Date,
    Checked_Out_Date,
    IdentityType,
    IdentityNumber_Hashed,
    MobileNumber
  )
    .then((Result) => {
      res.status(200).json(Result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.post("/VerifyGuest", async (req, res) => {
  const EncodedRoomNo = req.query.roomId;
  const { MobileNumber } = req.body;
  try {
    const item = await VerifyGuest(MobileNumber, EncodedRoomNo);
    if (item) {
      const token = guestTokenGenerator(EncodedRoomNo, MobileNumber);
      res.cookie("jwt", token, {
        sameSite: "None",
        secure: true,
        maxAge: 30 * 60 * 1000, // 30 min
      });
      res.send(item);
    } else {
      res.status(400).json("Invalid Credentials");
    }
  } catch (Err) {
    res.status(400).json("Error While Verifying");
  }
});

route.get("/FetchAllGuests", (req, res) => {
  FetchAllGuests()
    .then((Items) => {
      res.status(200).send(Items);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});
route.get("/FetchGuestById/:RoomId", async (req, res) => {
  const RoomId = req.params.RoomId;

  FetchGuestById(RoomId)
    .then((Items) => {
      res.status(200).send(Items);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

route.get("/DeleteGuestById/:RoomId", auth, async (req, res) => {
  const RoomId = req.params.RoomId;
  try {
    DeleteGuestById(RoomId)
      .then((Items) => {
        res.status(200).send(Items);
      })
      .catch((err) => {
        res.status(404).json(err);
      });

    await Rooms.update(
      {
        isOccupied: false,
        MobileNumber: null,
        Customer_Name: null,
        GuestId: null,
      },
      {
        where: { RoomId },
      }
    );
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
