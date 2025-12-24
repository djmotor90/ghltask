// User Types
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["MEMBER"] = "member";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (UserRole = {}));
export var ViewType;
(function (ViewType) {
    ViewType["LIST"] = "list";
    ViewType["BOARD"] = "board";
    ViewType["CALENDAR"] = "calendar";
    ViewType["TABLE"] = "table";
})(ViewType || (ViewType = {}));
// Task Types
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["OPEN"] = "open";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["IN_REVIEW"] = "in_review";
    TaskStatus["DONE"] = "done";
    TaskStatus["ARCHIVED"] = "archived";
})(TaskStatus || (TaskStatus = {}));
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority["URGENT"] = "urgent";
    TaskPriority["HIGH"] = "high";
    TaskPriority["NORMAL"] = "normal";
    TaskPriority["LOW"] = "low";
})(TaskPriority || (TaskPriority = {}));
// Relationships
export var RelationshipType;
(function (RelationshipType) {
    RelationshipType["DEPENDS_ON"] = "depends_on";
    RelationshipType["RELATED_TO"] = "related_to";
    RelationshipType["BLOCKS"] = "blocks";
    RelationshipType["DUPLICATES"] = "duplicates";
})(RelationshipType || (RelationshipType = {}));
// Custom Fields
export var CustomFieldType;
(function (CustomFieldType) {
    CustomFieldType["TEXT"] = "text";
    CustomFieldType["NUMBER"] = "number";
    CustomFieldType["SELECT"] = "select";
    CustomFieldType["MULTISELECT"] = "multiselect";
    CustomFieldType["DATE"] = "date";
    CustomFieldType["CHECKBOX"] = "checkbox";
    CustomFieldType["FORMULA"] = "formula";
    CustomFieldType["LINK"] = "link";
})(CustomFieldType || (CustomFieldType = {}));
// Activity Log
export var ActivityAction;
(function (ActivityAction) {
    ActivityAction["CREATED"] = "created";
    ActivityAction["UPDATED"] = "updated";
    ActivityAction["DELETED"] = "deleted";
    ActivityAction["COMMENTED"] = "commented";
})(ActivityAction || (ActivityAction = {}));
export var ActivityEntityType;
(function (ActivityEntityType) {
    ActivityEntityType["TASK"] = "task";
    ActivityEntityType["LIST"] = "list";
    ActivityEntityType["FOLDER"] = "folder";
    ActivityEntityType["COMMENT"] = "comment";
    ActivityEntityType["ATTACHMENT"] = "attachment";
})(ActivityEntityType || (ActivityEntityType = {}));
//# sourceMappingURL=index.js.map