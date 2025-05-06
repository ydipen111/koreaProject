

import jwt from 'jsonwebtoken';

// userChecking middleware
export const userCheck = (req, res, next) => {

  const token = req.headers.authorization;
  const decoded = jwt.decode(token, 'token');
  if (decoded) {
    req.id = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

//adminCheck middleware
export const adminCheck = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};