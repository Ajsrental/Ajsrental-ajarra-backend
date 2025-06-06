import { Router } from "express";
import type { Request, Response } from "express";
import authenticationRoutes from "./api/authentication";

const router = Router();

router.use("/:version/auth", authenticationRoutes);

export default router;