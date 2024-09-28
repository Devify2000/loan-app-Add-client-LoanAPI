import { Router } from "express";
import clientRouter from "./clientRoutes.js";
import loanRouter from "./loanRoutes.js";
import userRouter from "./userRoutes.js";

const router = Router();

router.use("/clients", clientRouter)
        .use("/loans", loanRouter)
        .use("/auth", userRouter)

export default router;