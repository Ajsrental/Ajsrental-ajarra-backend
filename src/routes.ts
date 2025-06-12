import { Router } from "express";
import type { Request, Response } from "express";
import authenticationRoutes from "./api/authentication";


const router = Router();

router.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ message: "ok" });
});
  
router.use("/:version/auth", authenticationRoutes);

export default router;