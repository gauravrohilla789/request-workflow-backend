import {Request, Response} from 'express';
import { RequestModel, RequestStatus } from '../models/request.model';
import { createRequestService, getAllRequestsService, updateRequestStatusService } from '../services/request.service';
export const createRequest = async (req: Request, res: Response) => {
    const { title, description, createdBy } = req.body;
    const request = await createRequestService({ title, description, createdBy });
    res.status(201).json(request);
}

export const getAllRequests = async (req: Request, res: Response) => {
    const requests = await getAllRequestsService();
    res.status(200).json(requests);
}

export const updateRequestStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, comment } = req.body;
    // Validate we have an id (req.params properties can be undefined in TS)
    if (!id) {
        return res.status(400).json({ message: 'Missing request id in params' });
    }
    if (!status) {
        return res.status(400).json({ message: 'Missing status in body' });
    }

    try {
        const updatedRequest = await updateRequestStatusService(id as any, status as RequestStatus, comment);
        res.status(200).json(updatedRequest);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
