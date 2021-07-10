import { Router, urlencoded } from "express";
import auth from "../auth/auth.js";
import checkRole from "../auth/checkRole.js";
import {
  deleteUser,
  updateUser,
  postLogoutUsers,
  postUserSignIn,
  postLogoutAllSession,
  postUserSignUp,
} from "../controllers/adminController.js";

const router = Router();

router.use(
  urlencoded({
    extended: false,
  })
);
router.post("/signup", auth(), checkRole(["teacher", "admin"]), postUserSignUp);
router.post("/signin", postUserSignIn);
router.get("/user/me", auth(), async (req, res) => {
  res.send(req.user);
});
router.post("/user/logout", auth(), postLogoutUsers);
router.post("/user/logout/all", auth(), postLogoutAllSession);
router.delete("/users/:id", auth(), checkRole(["admin"]), deleteUser);
router.patch("/user/me", auth(), updateUser);
export default router;
