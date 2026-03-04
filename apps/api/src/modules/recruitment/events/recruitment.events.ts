export const RECRUITMENT_EVENTS = {
  REQUISITION_CREATED: 'recruitment.requisition.created',
  REQUISITION_UPDATED: 'recruitment.requisition.updated',
  APPLICATION_RECEIVED: 'recruitment.application.received',
  APPLICATION_STAGE_CHANGED: 'recruitment.application.stageChanged',
  INTERVIEW_SCHEDULED: 'recruitment.interview.scheduled',
  INTERVIEW_COMPLETED: 'recruitment.interview.completed',
  OFFER_EXTENDED: 'recruitment.offer.extended',
  CANDIDATE_HIRED: 'recruitment.candidate.hired',
} as const;

export interface RequisitionCreatedEvent {
  requisitionId: string;
  title: string;
  departmentId: string;
  createdBy: string;
}

export interface ApplicationStageChangedEvent {
  applicationId: string;
  candidateId: string;
  requisitionId: string;
  previousStage: string;
  newStage: string;
}
