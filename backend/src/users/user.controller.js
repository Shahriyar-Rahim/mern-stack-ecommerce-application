import generateTocken from "../middleware/generateTocken.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";
import User from "./user.model.js";

// user registration
const userRegistration = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      ...req.body,
    });

    await user.save();
    res.status(201).send({
      message: "Registration successful",
      //   user,
    });
  } catch (error) {
    console.error("Error registering a user:", error);
    res.status(500).send({
      message: "Ragistration failed",
      error,
    });
  }
};

// user login
const userLoggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isPassMatch = await user.comparePassword(password);
    if (!isPassMatch) {
      return res.status(400).send({
        message: "Invalid password!",
      });
    }

    const token = await generateTocken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error logging in a user:", error);
    res.status(500).send({
      message: "Login failed",
      //   error,
    });
  }
};

// user logout
const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    // res.status(200).send({
    //     message: "Logout successful",
    // })
    successResponse(res, 200, "Logout successful");
  } catch (error) {
    // console.error("Error logging out a user:", error);
    // res.status(500).send({
    //   message: "Logout failed",
    // //   error,
    // })
    errorResponse(res, 500, "Logout failed", error);
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email role").sort({ createdAt: -1 });
    successResponse(res, 200, "Successfully got all users", users);
  } catch (error) {
    errorResponse(res, 500, "Failed to get all users", error);
  }
};

// delete user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "Successfully deleted user");
  } catch (error) {
    errorResponse(res, 500, "Failed to delete user", error);
  }
};

// update user
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "Successfully updated user role");
  } catch (error) {
    errorResponse(res, 500, "Failed to update user role", error);
  }
};

// edit user profile
const editUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, profileImage, bio, profession } = req.body;
  try {
    const updateField = { username, profileImage, bio, profession };
    const updateUser = await User.findByIdAndUpdate(id, updateField, {
      new: true,
    });
    if (!updateUser) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(
      res,
      200,
      "Successfully updated user profile",
      updateUser
    );
  } catch (error) {
    errorResponse(res, 500, "Failed to edit user profile", error);
  }
};

export {
  userRegistration,
  userLoggedIn,
  userLogout,
  getAllUsers,
  deleteUser,
  updateUserRole,
  editUserProfile,
};
