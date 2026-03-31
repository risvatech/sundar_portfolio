import express from "express";
import { sendMailController } from "../controllers/zohoMailController.js";

const router = express.Router();

router.post("/send", sendMailController);

export default router;
