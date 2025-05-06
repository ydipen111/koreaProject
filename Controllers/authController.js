import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// singUp function
export const signUp = async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ email: email });
    if (isExistingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });

  }
}


// login function
export const login = async (req, res) => {

  const { email, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      const pass = bcrypt.compareSync(password, isExistingUser.password);

      if (!pass) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({
        id: isExistingUser._id,
        isAdmin: isExistingUser.isAdmin
      }, 'token');

      res.cookie(
        'jwt',
        token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
      );

      const cook = req.cookie;
      console.log(cook);

      return res.status(200).json({
        token,
        id: isExistingUser._id,
        isAdmin: isExistingUser.isAdmin,
        fname: isExistingUser.fname,
        lname: isExistingUser.lname,
        email: isExistingUser.email,
        message: "User logged in successfully",
      })



    } else {
      return res.status(400).json({ message: "User not found" });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });

  }
}

// getUserProfile function
export const getUserProfile = async (req, res) => {

  try {
    const user = await User.findById(req.id).select(
      'fname lname email isAdmin createdAt '
    );

    if (!user) return res.status(400).json({ message: "User not found" });
    return res.status(200).json({
      user,
      message: "User profile fetched successfully",
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });

  }


}

// export const getAllUsers = async (req, res) => {

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select(
      'fname lname email isAdmin createdAt '
    );

    if (!users) return res.status(400).json({ message: "Users not found" });
    return res.status(200).json({
      users,
      message: "Users fetched successfully",
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });

  }
}

// export const updateUser 

export const updateUser = async (req, res) => {

  const { fname, lname } = req.body;

  try {
    const isExistingUser = await User.findById(req.id);

    if (!isExistingUser) return res.status(400).json({ message: "User not found" });

    if (isExistingUser) {
      isExistingUser.fname = fname || isExistingUser.fname;
      isExistingUser.lname = lname || isExistingUser.lname;

      await isExistingUser.save();
      return res.status(200).json({
        message: "User updated successfully",
        user: isExistingUser
      })
    } else {
      return res.status(400).json({ message: "User not found" });
    }



  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });

  }
}
