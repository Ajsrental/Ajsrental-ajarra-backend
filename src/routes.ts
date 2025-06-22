import { Router } from "express";
import type { Request, Response } from "express";
import authenticationRoutes from "./api/authentication";
import vendorRoutes from "./api/vendor";


const router = Router();

router.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ message: "ok" });
});
  
router.use("/:version/auth", authenticationRoutes);
router.use("/:version/vendor", vendorRoutes);

export default router;