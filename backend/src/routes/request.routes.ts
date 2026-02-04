import { Router } from "express";
import { createRequest, getAllRequests, updateRequestStatus } from "../controllers/request.controller";

const router = Router();

router.post("/", createRequest);
router.get("/", getAllRequests);

router.patch("/:id/status", updateRequestStatus);

export default router;