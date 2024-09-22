const { generateHash } = require("../TokenGenerator");
const db = require("../models");
const { where } = require("sequelize");

const Rooms = db.Rooms;

const AddnewRoom = async (RoomNumber, isOccupied, GuestId, MobileNumber) => {
  try {
    const EncodedRoomNo = generateHash(RoomNumber);
    console.log(RoomNumber);
    console.log(RoomNumber, EncodedRoomNo);

    let result = await Rooms.create({
      EncodedRoomNo,
      RoomNumber,
      isOccupied,
      GuestId,
      MobileNumber,
    });
    // console.log(result);
    return result;
  } catch (e) {
    // console.error("Error adding new room:", e);
    return e;
  }
};

const UpdateRoom = async (
  isOccupied,
  RoomId,
  MobileNumber,
  Customer_Name,
  GuestId
) => {
  try {
    let Result = await Rooms.update(
      {
        isOccupied,
        MobileNumber,
        Customer_Name,
        GuestId,
      },
      {
        where: { RoomId },
      }
    );
    console.log("Update Success " + Result);
    return Result;
  } catch (err) {
    console.error("Error updating room:", err);
    return err;
  }
};

const FetchRoomById = async (RoomId) => {
  try {
    let Row = await Rooms.findOne({ where: { RoomId } });
    return Row;
  } catch (e) {
    return null;
  }
};

const UpdateRoomById = async (RoomId, isOccupied) => {
  try {
    let Row = await Rooms.findOne({ where: { RoomId } });
    if (!Row.GuestId && !Row.MobileNumber) {
      let response = await Rooms.update(
        { isOccupied },
        {
          where: {
            RoomId,
          },
        }
      );
      return response;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const FetchAllRooms = async () => {
  try {
    let AllRooms = await Rooms.findAll({
      order: [
        ["RoomNumber", "DESC"], // Sorting by RoomNumber in descending order
      ],
    });
    console.log(AllRooms);
    return AllRooms;
  } catch (err) {
    console.error("Error fetching all rooms:", err);
    return null;
  }
};

module.exports = {
  FetchAllRooms,
  UpdateRoom,
  AddnewRoom,
  FetchRoomById,
  UpdateRoomById,
};
