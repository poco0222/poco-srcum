/**
 * @file Shared public exports for the Phase 1 domain package.
 * @author PopoY
 * @created 2026-06-04
 */
export { ProjectRole, SystemRole } from "./auth/roles";
export type { ProjectRoleValue, SystemRoleValue } from "./auth/roles";
export { AcceptanceStatus } from "./acceptance/acceptance.enums";
export {
  AcceptanceAllowedTransitions,
  assertAcceptanceStatusTransition,
  canCompleteStoryWithAcceptance,
  canTransitionAcceptanceStatus
} from "./acceptance/acceptance.machine";
export type {
  AcceptanceStatusValue
} from "./acceptance/acceptance.enums";
export type {
  AcceptanceTransitionMap
} from "./acceptance/acceptance.machine";
export type {
  MinimalAuditLogRecord
} from "./audit/audit-log.types";
export type {
  StoryAcceptanceRecord
} from "./acceptance/acceptance.types";
export { DocumentTargetType } from "./documents/document.enums";
export type {
  DocumentTargetTypeValue
} from "./documents/document.enums";
export {
  DocumentFieldRequirement,
  DocumentType
} from "./documents/document-type.enums";
export type {
  DocumentFieldRequirementValue,
  DocumentTypeValue
} from "./documents/document-type.enums";
export {
  DocumentTypeMatrix
} from "./documents/document-type.matrix";
export type {
  DocumentStructuredFieldMatrix,
  DocumentTypeMatrixEntry,
  DocumentTypeMatrixMap
} from "./documents/document-type.matrix";
export type {
  DocumentRecord,
  DocumentStructuredFields
} from "./documents/document.types";
export type {
  DocumentVersionRecord
} from "./documents/document-version.types";
export {
  DocumentRelationTargetType,
  DocumentRelationType
} from "./documents/document-relation.enums";
export type {
  DocumentRelationTargetTypeValue,
  DocumentRelationTypeValue
} from "./documents/document-relation.enums";
export type {
  DocumentRelationRecord
} from "./documents/document-relation.types";
export type {
  AttachmentPreviewKind,
  DocumentAttachmentRecord,
  DocumentLinkRecord
} from "./documents/attachment.types";
export {
  LinkageCardinality,
  LinkageObjectType,
  LinkageRelationType
} from "./linkage/linkage.enums";
export type {
  LinkageCardinalityValue,
  LinkageObjectTypeValue,
  LinkageRelationTypeValue
} from "./linkage/linkage.enums";
export {
  LinkageRelationRules,
  getReverseLinkageRelation,
  isLinkageRelationAllowed
} from "./linkage/linkage.rules";
export type {
  LinkageRelationRule,
  LinkageRelationRuleMap
} from "./linkage/linkage.rules";
export type {
  ObjectLinkRecord
} from "./linkage/linkage.types";
export { CommentAnchorType } from "./reviews/comment.enums";
export type {
  CommentAnchorTypeValue
} from "./reviews/comment.enums";
export {
  CommentMentionTokenPattern,
  buildDocumentCommentAnchor,
  buildFieldCommentAnchor,
  buildMarkdownBlockCommentAnchor,
  isCommentAnchorType,
  parseCommentMentionTokens
} from "./reviews/comment-anchor.types";
export type {
  CommentAnchor,
  DocumentCommentAnchor,
  FieldCommentAnchor,
  MarkdownBlockCommentAnchor
} from "./reviews/comment-anchor.types";
export type {
  DocumentCommentRecord
} from "./reviews/comment.types";
export { DocumentReviewStatus } from "./reviews/review.enums";
export type {
  DocumentReviewStatusValue
} from "./reviews/review.enums";
export {
  DocumentReviewAllowedTransitions,
  assertDocumentReviewStatusTransition,
  canApproveDocumentReviewVersion,
  canTransitionDocumentReviewStatus
} from "./reviews/review.machine";
export type {
  DocumentReviewTransitionMap
} from "./reviews/review.machine";
export type {
  DocumentReviewRecord
} from "./reviews/review.types";
export { NotificationEventType } from "./notifications/notification.enums";
export type {
  NotificationEventTypeValue
} from "./notifications/notification.enums";
export type {
  NotificationRecord
} from "./notifications/notification.types";
export { MemberStatus, ProjectStatus } from "./projects/project.enums";
export type {
  MemberStatusValue,
  ProjectStatusValue
} from "./projects/project.enums";
export { SprintStatus } from "./sprints/sprint.enums";
export {
  SprintAllowedTransitions,
  assertSprintStatusTransition,
  canTransitionSprintStatus
} from "./sprints/sprint.machine";
export type {
  SprintCommitmentRecord,
  SprintDailyUpdateRecord,
  SprintPlanningSnapshot,
  SprintRecord
} from "./sprints/sprint.types";
export type {
  SprintStatusValue
} from "./sprints/sprint.enums";
export type {
  SprintTransitionMap
} from "./sprints/sprint.machine";
export {
  WorkItemPriority,
  WorkItemStatus,
  WorkItemType
} from "./work-items/work-item.enums";
export type {
  WorkItemPriorityValue,
  WorkItemStatusValue,
  WorkItemTypeValue
} from "./work-items/work-item.enums";
export {
  WorkItemFieldMatrix,
  WorkItemFieldRequirement,
  WorkItemParentRules
} from "./work-items/work-item.types";
export { evaluateStoryReadyState } from "./work-items/work-item.ready";
export type {
  WorkItemFieldKey,
  WorkItemFieldMatrix as WorkItemFieldMatrixMap,
  WorkItemFieldRequirementValue,
  WorkItemParentRule,
  WorkItemParentRules as WorkItemParentRuleMap,
  WorkItemReadySnapshot,
  WorkItemRecord
} from "./work-items/work-item.types";
