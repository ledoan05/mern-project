import express from "express";
import { admin, authMiddle } from "../middleware/authMiddleware.js";
import { addUser, deleteUser, editUser, getUser } from "../controller/userAdmin.js";

const route  = express.Router();

route.get("/", authMiddle, admin, getUser)
route.post("/", authMiddle, admin, addUser)
route.put("/:id", authMiddle, admin, editUser)
route.delete("/:id", authMiddle, admin, deleteUser)

export default route;