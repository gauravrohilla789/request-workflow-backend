import { updateRequestStatusService } from "../../services/request.service";
import { RequestModel, RequestStatus } from "../../models/request.model";
import {
  isValidTransition,
  rolePermissions,
} from "../../services/workflow.services";

jest.mock("../../models/request.model");
jest.mock("../../services/workflow.services");

describe("Request Service - updateRequestStatusService", () => {
  let mockRequest: any;
  let mockSave: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSave = jest.fn();

    mockRequest = {
      _id: "req123",
      status: RequestStatus.SUBMITTED,
      approvalComment: "",
      rejectionReason: "",
      save: mockSave,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update status when transition and role are valid", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(true);
    (rolePermissions as any)["ADMIN"] = [RequestStatus.IN_PROGRESS];

    const result = await updateRequestStatusService(
      "req123",
      RequestStatus.IN_PROGRESS,
      "",
      "ADMIN",
    );

    expect(result.status).toBe(RequestStatus.IN_PROGRESS);
    expect(mockSave).toHaveBeenCalled();
  });

  it("should throw if request not found", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateRequestStatusService(
        "invalidId",
        RequestStatus.APPROVED,
        "ok",
        "ADMIN",
      ),
    ).rejects.toThrow("Request not found");
  });

  it("should throw if invalid transition", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(false);

    await expect(
      updateRequestStatusService(
        "req123",
        RequestStatus.APPROVED,
        "ok",
        "ADMIN",
      ),
    ).rejects.toThrow(
      `Invalid status transition from ${RequestStatus.SUBMITTED} to ${RequestStatus.APPROVED}`,
    );
  });

  it("should throw if role does not have permission", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(true);
    (rolePermissions as any)["MANAGER"] = [];

    await expect(
      updateRequestStatusService(
        "req123",
        RequestStatus.IN_PROGRESS,
        "",
        "MANAGER",
      ),
    ).rejects.toThrow(
      `User role MANAGER does not have permission to change status to ${RequestStatus.IN_PROGRESS}`,
    );
  });

  it("should require comment for APPROVED", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(true);
    (rolePermissions as any)["ADMIN"] = [RequestStatus.APPROVED];

    await expect(
      updateRequestStatusService("req123", RequestStatus.APPROVED, "", "ADMIN"),
    ).rejects.toThrow("Comment is required");
  });

  it("should set approvalComment when approved", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(true);
    (rolePermissions as any)["ADMIN"] = [RequestStatus.APPROVED];

    const result = await updateRequestStatusService(
      "req123",
      RequestStatus.APPROVED,
      "Looks good",
      "ADMIN",
    );

    expect(result.status).toBe(RequestStatus.APPROVED);
    expect(result.approvalComment).toBe("Looks good");
    expect(mockSave).toHaveBeenCalled();
  });

  it("should set rejectionReason when rejected", async () => {
    (RequestModel.findById as jest.Mock).mockResolvedValue(mockRequest);
    (isValidTransition as jest.Mock).mockReturnValue(true);
    (rolePermissions as any)["ADMIN"] = [RequestStatus.REJECTED];

    const result = await updateRequestStatusService(
      "req123",
      RequestStatus.REJECTED,
      "Not valid",
      "ADMIN",
    );

    expect(result.status).toBe(RequestStatus.REJECTED);
    expect(result.rejectionReason).toBe("Not valid");
    expect(mockSave).toHaveBeenCalled();
  });
});
