import {Request, Response} from 'express';
import { RequestModel, RequestStatus } from '../models/request.model';
import { createRequestService, getAllRequestsService } from '../services/request.service';
export const createRequest = async (req: Request, res: Response) => {
    const { title, description, createdBy } = req.body;
    const request = await createRequestService({ title, description, createdBy });
    res.status(201).json(request);
}

export const getAllRequests = async (req: Request, res: Response) => {
    const requests = await getAllRequestsService();
    res.status(200).json(requests);
}