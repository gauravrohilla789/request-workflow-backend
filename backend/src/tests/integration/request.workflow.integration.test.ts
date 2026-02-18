import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createRequestService, updateRequestStatusService } from "../../services/request.service";
import { RequestStatus } from "../../models/request.model";

describe("Request Workflow Integration Test", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        await collection.deleteMany({});
      }
    }
  });

  it("should complete full workflow successfully", async () => {
    // Create request (default should be DRAFT)
    const request = await createRequestService({
      title: "Test Request",
      description: "Integration test",
      createdBy: "user123"
    });

    expect(request.status).toBe(RequestStatus.DRAFT);

    // USER submits
    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.SUBMITTED,
      "",
      "USER"
    );

    // ADMIN moves to IN_PROGRESS
    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.IN_PROGRESS,
      "",
      "ADMIN"
    );

    // ADMIN approves
    const approvedRequest = await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.APPROVED,
      "Approved successfully",
      "ADMIN"
    );

    expect(approvedRequest.status).toBe(RequestStatus.APPROVED);
    expect(approvedRequest.approvalComment).toBe("Approved successfully");
  });

  it("should prevent USER from approving", async () => {
    const request = await createRequestService({
      title: "Test Request",
      createdBy: "user123"
    });

    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.SUBMITTED,
      "",
      "USER"
    );

    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.IN_PROGRESS,
      "",
      "ADMIN"
    );

    await expect(
      updateRequestStatusService(
        request._id.toString(),
        RequestStatus.APPROVED,
        "Not allowed",
        "USER"
      )
    ).rejects.toThrow("does not have permission");
  });

  it("should require comment for approval", async () => {
    const request = await createRequestService({
      title: "Test Request",
      createdBy: "user123"
    });

    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.SUBMITTED,
      "",
      "USER"
    );

    await updateRequestStatusService(
      request._id.toString(),
      RequestStatus.IN_PROGRESS,
      "",
      "ADMIN"
    );

    await expect(
      updateRequestStatusService(
        request._id.toString(),
        RequestStatus.APPROVED,
        "",
        "ADMIN"
      )
    ).rejects.toThrow("Comment is required");
  });
});
