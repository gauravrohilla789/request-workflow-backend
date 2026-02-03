import { RequestModel } from "../models/request.model";

/**
 * Creates a new request in the database.
 * @param data - An object containing the title, optional description, and createdBy fields.
 * @returns The created request document.
 */

export const createRequestService = async (data: {
    title: string;
    description?: string;
    createdBy: string;
}) => {
    const request = await RequestModel.create(data);
    return request;
}

/**
 * Retrieves all requests from the database.
 * @returns An array of all request documents.
 */

export const getAllRequestsService = async () => {
    return await RequestModel.find()
}