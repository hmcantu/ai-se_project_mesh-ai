import { Router } from "express";
import { getCurrentUser } from "../controllers/users.js";
import { auth } from "../middleware/auth.js";

const usersRouter = Router();

usersRouter.use(auth);

// Handle GET /users/me requests
usersRouter.get("/me", getCurrentUser);

export default usersRouter;