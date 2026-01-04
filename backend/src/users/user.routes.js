import express from "express";
import {
  deleteUser,
  editUserProfile,
  getAllUsers,
  updateUserRole,
  userLoggedIn,
  userLogout,
  userRegistration,
} from "./user.controller.js";
import { get } from "mongoose";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// create registration endpoint
router.post("/register", userRegistration);

// login endpoint
router.post("/login", userLoggedIn);

// logout from server
router.post("/logout", userLogout);

// get all users route(token verify and admin only || create middleware)
router.get("/users", verifyToken, verifyAdmin, getAllUsers);

// delete user route for admin only
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

// update user role for admin only
router.put("/users/:id", verifyToken, verifyAdmin, updateUserRole);

// edit user profile
router.patch("/edit-profile/:id", verifyToken, editUserProfile);

export default router;
