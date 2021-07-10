import { Router, urlencoded } from "express";
import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";
import { USER_ROLES } from "../Utils/constants.js";
import {
  deleteUser,
  updateUser,
  postLogoutUsers,
  postUserSignIn,
  postLogoutAllSession,
  postUserSignUp,
} from "../controllers/adminController.js";
import adminDashboard from "../Utils/admin-dashboard.js";
const router = Router();

router.use(
  urlencoded({
    extended: false,
  })
);
router.post(
  "/signup",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  postUserSignUp
);
router.post("/signin", postUserSignIn);
router.get("/user/me", auth(), async (req, res) => {
  res.send(req.user);
});
router.post("/user/logout", auth(), postLogoutUsers);
router.post("/user/logout/all", auth(), postLogoutAllSession);
router.delete(
  "/users/:id",
  auth(),
  checkRole([USER_ROLES.SUPER_ADMIN]),
  deleteUser
);
router.patch("/user/me", auth(), updateUser);
router.use("/admin", adminDashboard);
export default router;
