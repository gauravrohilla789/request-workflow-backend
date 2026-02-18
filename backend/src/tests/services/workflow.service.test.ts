import { isValidTransition, rolePermissions } from "../../services/workflow.services";
import { RequestStatus } from "../../models/request.model";

describe("Workflow Service", () => {
  describe("isValidTransition", () => {

    it("should allow DRAFT → SUBMITTED", () => {
      expect(
        isValidTransition(RequestStatus.DRAFT, RequestStatus.SUBMITTED)
      ).toBe(true);
    });

    it("should allow SUBMITTED → IN_PROGRESS", () => {
      expect(
        isValidTransition(RequestStatus.SUBMITTED, RequestStatus.IN_PROGRESS)
      ).toBe(true);
    });

    it("should allow IN_PROGRESS → APPROVED", () => {
      expect(
        isValidTransition(RequestStatus.IN_PROGRESS, RequestStatus.APPROVED)
      ).toBe(true);
    });

    it("should allow IN_PROGRESS → REJECTED", () => {
      expect(
        isValidTransition(RequestStatus.IN_PROGRESS, RequestStatus.REJECTED)
      ).toBe(true);
    });

    it("should reject invalid transitions", () => {
      expect(
        isValidTransition(RequestStatus.DRAFT, RequestStatus.APPROVED)
      ).toBe(false);

      expect(
        isValidTransition(RequestStatus.SUBMITTED, RequestStatus.REJECTED)
      ).toBe(false);

      expect(
        isValidTransition(RequestStatus.APPROVED, RequestStatus.DRAFT)
      ).toBe(false);

      expect(
        isValidTransition(RequestStatus.REJECTED, RequestStatus.SUBMITTED)
      ).toBe(false);
    });

    it("should not allow same-state transition", () => {
      expect(
        isValidTransition(RequestStatus.DRAFT, RequestStatus.DRAFT)
      ).toBe(false);
    });

  });

  describe("rolePermissions", () => {

    it("USER should only be allowed to move to SUBMITTED", () => {
      expect(rolePermissions.USER).toContain(RequestStatus.SUBMITTED);
      expect(rolePermissions.USER).not.toContain(RequestStatus.APPROVED);
      expect(rolePermissions.USER).not.toContain(RequestStatus.IN_PROGRESS);
    });

    it("ADMIN should be allowed to move to IN_PROGRESS", () => {
      expect(rolePermissions.ADMIN).toContain(RequestStatus.IN_PROGRESS);
    });

    it("ADMIN should be allowed to move to APPROVED", () => {
      expect(rolePermissions.ADMIN).toContain(RequestStatus.APPROVED);
    });

    it("ADMIN should be allowed to move to REJECTED", () => {
      expect(rolePermissions.ADMIN).toContain(RequestStatus.REJECTED);
    });

  });

});
