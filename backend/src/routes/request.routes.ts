import { Router } from "express";
import { createRequest, getAllRequests, updateRequestStatus } from "../controllers/request.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.post("/", createRequest);
router.get("/", getAllRequests);

router.patch("/:id/status",
    requireRole(['ADMIN', 'USER']), // Both ADMIN and USER can update status, but service will check specific permissions
    updateRequestStatus);

export default router;