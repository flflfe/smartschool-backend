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
  postStudentSignUp,
  postTeacherSignUp,
  getTeacherslist,
} from "../controllers/adminController.js";
import adminDashboard from "../Utils/admin-dashboard.js";
const router = Router();

router.use(
  urlencoded({
    extended: false,
  })
);
router.post(
  "/signup/student",
  auth(),
  checkRole([USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN]),
  postStudentSignUp
);
router.post(
  "/signup/teacher",
  auth(),
  checkRole([USER_ROLES.SUPER_ADMIN]),
  postTeacherSignUp
);
router.post("/signin", postUserSignIn);
router.get("/user/me", auth(), async (req, res) => {
  res.send(req.user);
});
router.get(
  "/teachers",
  auth(),
  checkRole([USER_ROLES.TEACHER]),
  getTeacherslist
);
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
