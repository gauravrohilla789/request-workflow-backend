import { Request, Response } from "express";
import { RequestModel, RequestStatus } from "../models/request.model";
import {
  createRequestService,
  getAllRequestsService,
  updateRequestStatusService,
} from "../services/request.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.user?.userId || "Unknown User";
    if (req.user?.role !== "USER") {
      return res
        .status(403)
        .json({ message: "Only users can create requests" });
    }
    const request = await createRequestService({
      title,
      description,
      createdBy,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Error creating request" });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await getAllRequestsService();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests" });
  }
};

export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, comment } = req.body;
  // Validate we have an id (req.params properties can be undefined in TS)
  if (!id) {
    return res.status(400).json({ message: "Missing request id in params" });
  }
  if (!status) {
    return res.status(400).json({ message: "Missing status in body" });
  }

  try {
    const updatedRequest = await updateRequestStatusService(
      id as any,
      status as RequestStatus,
      comment,
      req.user?.role || 'USER'
    );
    res.status(200).json(updatedRequest);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
