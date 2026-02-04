import { RequestStatus } from "../models/request.model"

/**
 * Defines allowed status transitions for requests.
 */

const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
    [RequestStatus.DRAFT]: [RequestStatus.SUBMITTED],
    [RequestStatus.SUBMITTED]: [RequestStatus.IN_PROGRESS],
    [RequestStatus.IN_PROGRESS]: [
        RequestStatus.APPROVED,
        RequestStatus.REJECTED
    ],
    [RequestStatus.APPROVED]: [],
    [RequestStatus.REJECTED]: []
}

export const isValidTransition = (currentStatus: RequestStatus, nextStatus: RequestStatus): boolean => {
    return allowedTransitions[currentStatus].includes(nextStatus);
}