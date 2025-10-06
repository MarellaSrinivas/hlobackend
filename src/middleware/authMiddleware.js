import jwt from "jsonwebtoken";

export const protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // If roles array is provided, check user_type
      if (roles.length && !roles.includes(req.user.user_type))
        return res.status(403).json({ error: "Forbidden" });

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token invalid or expired" });
    }
  };
};
