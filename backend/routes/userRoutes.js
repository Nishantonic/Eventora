// routes/userRoutes.js
import express from "express";
import { register, login, getUser , getMe, getAllUsers} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUser);
router.get("/me", getMe);
router.get("/all", getAllUsers); 



export default router;