import { Router } from "express";
import * as VendorController from "./handlers";
import { checkJwt } from "../../middlewares/checkJwt";

const router = Router({ mergeParams: true });

router.use(checkJwt);

// Optionally protect with checkJwt middleware

router.post("/create", VendorController.createVendorHandler);
router.put("/update", VendorController.updateVendorHandler);

export default router;