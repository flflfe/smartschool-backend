import { USER_ROLES } from "../Utils/constants.js";

const authenticateRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ Error: "Unable to Authorize" });
  }

  const authorized = roles.some((role) => req.user.role === role);
  const admin = req.user.role === USER_ROLES.SUPER_ADMIN;
  if (authorized || admin) {
    req.roles = req.user.role;
    return next();
  }
  return res.status(401).json({
    Error: "Unauthorized for your role",
  });
};
export default authenticateRole;
