import mongoose from 'mongoose';

export enum RequestStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

const RequestSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String},
        status: {
            type: String,
            enum: Object.values(RequestStatus),
            default: RequestStatus.DRAFT,
        },
        createdBy: {type: String, required: true},
        approvalComment: {type: String},
        rejectionReason: {type: String},
    },
    { timestamps: true }
);

export const RequestModel = mongoose.model("Request", RequestSchema);