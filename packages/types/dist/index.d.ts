export interface Organization {
    id: string;
    ghl_account_id: string;
    ghl_sub_account_id?: string;
    name: string;
    plan_type: 'free' | 'professional' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    created_at: Date;
    updated_at: Date;
}
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    MEMBER = "member",
    VIEWER = "viewer"
}
export interface User {
    id: string;
    organization_id: string;
    ghl_user_id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: UserRole;
    is_active: boolean;
    last_login_at?: Date;
    created_at: Date;
}
export interface Space {
    id: string;
    organization_id: string;
    name: string;
    description?: string;
    color: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}
export interface Folder {
    id: string;
    space_id: string;
    organization_id: string;
    name: string;
    description?: string;
    color?: string;
    position: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}
export declare enum ViewType {
    LIST = "list",
    BOARD = "board",
    CALENDAR = "calendar",
    TABLE = "table"
}
export interface List {
    id: string;
    folder_id?: string;
    space_id?: string;
    organization_id: string;
    name: string;
    description?: string;
    status: 'active' | 'archived';
    view_type: ViewType;
    color?: string;
    position: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
}
export declare enum TaskStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    IN_REVIEW = "in_review",
    DONE = "done",
    ARCHIVED = "archived"
}
export declare enum TaskPriority {
    URGENT = "urgent",
    HIGH = "high",
    NORMAL = "normal",
    LOW = "low"
}
export interface Task {
    id: string;
    organization_id: string;
    list_id: string;
    parent_task_id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigned_to?: string;
    assigned_at?: Date;
    start_date?: Date;
    due_date?: Date;
    completed_at?: Date;
    estimated_hours?: number;
    time_spent: number;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    custom_fields: Record<string, any>;
    color?: string;
    archived_at?: Date;
}
export declare enum RelationshipType {
    DEPENDS_ON = "depends_on",
    RELATED_TO = "related_to",
    BLOCKS = "blocks",
    DUPLICATES = "duplicates"
}
export interface TaskRelationship {
    id: string;
    source_task_id: string;
    target_task_id: string;
    relationship_type: RelationshipType;
    created_at: Date;
}
export interface Subtask {
    id: string;
    task_id: string;
    title: string;
    is_completed: boolean;
    position: number;
    created_at: Date;
    updated_at: Date;
}
export interface Comment {
    id: string;
    task_id: string;
    thread_id?: string;
    user_id: string;
    content: string;
    content_html?: string;
    is_edited: boolean;
    edited_at?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface Attachment {
    id: string;
    task_id: string;
    comment_id?: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
    uploaded_by: string;
    uploaded_at: Date;
}
export declare enum CustomFieldType {
    TEXT = "text",
    NUMBER = "number",
    SELECT = "select",
    MULTISELECT = "multiselect",
    DATE = "date",
    CHECKBOX = "checkbox",
    FORMULA = "formula",
    LINK = "link"
}
export interface CustomField {
    id: string;
    list_id: string;
    organization_id: string;
    name: string;
    field_type: CustomFieldType;
    options?: Array<{
        id: string;
        label: string;
        color?: string;
    }>;
    formula?: string;
    linked_list_id?: string;
    required: boolean;
    position: number;
    created_at: Date;
    updated_at: Date;
}
export interface TaskFieldValue {
    id: string;
    task_id: string;
    field_id: string;
    value: any;
    computed_value?: any;
    updated_at: Date;
}
export declare enum ActivityAction {
    CREATED = "created",
    UPDATED = "updated",
    DELETED = "deleted",
    COMMENTED = "commented"
}
export declare enum ActivityEntityType {
    TASK = "task",
    LIST = "list",
    FOLDER = "folder",
    COMMENT = "comment",
    ATTACHMENT = "attachment"
}
export interface ActivityLog {
    id: string;
    organization_id: string;
    entity_type: ActivityEntityType;
    entity_id: string;
    action: ActivityAction;
    user_id?: string;
    changes?: Record<string, any>;
    created_at: Date;
}
export interface JWTPayload {
    sub: string;
    email: string;
    organization_id: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export interface GHLAuthConfig {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
}
export interface GHLTokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
}
export interface GHLUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
}
export interface CreateTaskDto {
    list_id: string;
    title: string;
    description?: string;
    priority?: TaskPriority;
    assigned_to?: string;
    due_date?: Date;
    start_date?: Date;
    estimated_hours?: number;
    parent_task_id?: string;
    custom_fields?: Record<string, any>;
}
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigned_to?: string;
    due_date?: Date;
    start_date?: Date;
    estimated_hours?: number;
    time_spent?: number;
    custom_fields?: Record<string, any>;
}
export interface CreateCommentDto {
    content: string;
    content_html?: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface WebSocketMessage<T = any> {
    event: string;
    payload: T;
    timestamp: number;
}
export interface TaskUpdateEvent {
    task_id: string;
    changes: Record<string, any>;
    updated_by: string;
}
//# sourceMappingURL=index.d.ts.map