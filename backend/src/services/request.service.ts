import { RequestModel } from "../models/request.model";
import { RequestStatus } from "../models/request.model";
import { isValidTransition } from "./workflow.services";
import { rolePermissions } from "./workflow.services";

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
};

/**
 * Retrieves all requests from the database.
 * @returns An array of all request documents.
 */

export const getAllRequestsService = async () => {
  return await RequestModel.find();
};

/**
 * Updates the status of a request using workflow rules.
 */

export const updateRequestStatusService = async (
  requestId: string,
  nextStatus: RequestStatus,
  comment: string,
  userRole:string
) => {
    const request = await RequestModel.findById(requestId);
    if (!request) {
        throw new Error("Request not found");
    }
    const currentStatus = request.status as RequestStatus;
    const isAllowed = isValidTransition(currentStatus, nextStatus);
    if (!isAllowed) {
        throw new Error(`Invalid status transition from ${currentStatus} to ${nextStatus}`);
    }
      // Check role permissions
    const allowedStatusesForRole = rolePermissions[userRole] || [];
    if (!allowedStatusesForRole.includes(nextStatus)) {
        throw new Error(`User role ${userRole} does not have permission to change status to ${nextStatus}`);
    }
    if((nextStatus === RequestStatus.APPROVED || nextStatus === RequestStatus.REJECTED) && (!comment || comment.trim() === "")) {
        throw new Error(`Comment is required`);
    }
    request.status = nextStatus;
    if (nextStatus === RequestStatus.APPROVED) {
        request.approvalComment = comment;
    }
    if (nextStatus === RequestStatus.REJECTED) {
        request.rejectionReason = comment;
    }
    await request.save();
    return request;
};
