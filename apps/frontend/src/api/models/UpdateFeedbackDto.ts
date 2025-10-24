/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateFeedbackDto = {
    status?: UpdateFeedbackDto.status;
    adminNotes?: string;
};
export namespace UpdateFeedbackDto {
    export enum status {
        NEW = 'new',
        REVIEWED = 'reviewed',
        IN_PROGRESS = 'in_progress',
        RESOLVED = 'resolved',
        DISMISSED = 'dismissed',
    }
}

