import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserPreferences {
    theme: Theme;
    language: Language;
    pinHash?: string;
}
export type Timestamp = bigint;
export interface User {
    principal: UserId;
    displayName: string;
}
export type Language = string;
export type ConversationId = bigint;
export type UserId = Principal;
export interface FriendRequest {
    to: UserId;
    status: FriendStatus;
    from: UserId;
    timestamp: Timestamp;
}
export interface FileAttachment {
    size: bigint;
    mimeType: string;
    filename: string;
    fileId: string;
}
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    sender: UserId;
    conversationId: ConversationId;
    fileAttachment?: FileAttachment;
    timestamp: Timestamp;
    reactions: Array<Reaction>;
}
export type Theme = string;
export interface Reaction {
    messageId: MessageId;
    userId: UserId;
    emoji: string;
    timestamp: Timestamp;
}
export enum FriendStatus {
    Rejected = "Rejected",
    Accepted = "Accepted",
    Pending = "Pending"
}
export enum PresenceStatus {
    Away = "Away",
    Online = "Online",
    Offline = "Offline"
}
export interface backendInterface {
    addReaction(messageId: MessageId, emoji: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getBulkPresence(userIds: Array<UserId>): Promise<Array<[UserId, PresenceStatus]>>;
    getCurrentUser(): Promise<User | null>;
    getMessages(conversationId: ConversationId): Promise<Array<Message>>;
    getOrCreateConversation(other: UserId): Promise<ConversationId>;
    getPresence(userId: UserId): Promise<PresenceStatus | null>;
    getReactions(messageId: MessageId): Promise<{
        __kind__: "ok";
        ok: Array<Reaction>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getTypingIndicators(conversationId: ConversationId): Promise<Array<UserId>>;
    getUserPreferences(): Promise<UserPreferences | null>;
    listFriendRequests(): Promise<Array<FriendRequest>>;
    listFriends(): Promise<Array<User>>;
    listUsers(): Promise<Array<User>>;
    registerUser(displayName: string): Promise<void>;
    removeFriend(userId: UserId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeReaction(messageId: MessageId, emoji: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    respondToFriendRequest(from: UserId, accept: boolean): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendFileMessage(conversationId: ConversationId, fileId: string, filename: string, mimeType: string, size: bigint): Promise<{
        __kind__: "ok";
        ok: Message;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendFriendRequest(to: UserId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendMessage(conversationId: ConversationId, content: string): Promise<MessageId>;
    setPresence(status: PresenceStatus): Promise<void>;
    setTyping(conversationId: ConversationId, isTyping: boolean): Promise<void>;
    setUserPreferences(theme: string, language: string, pinHash: string | null): Promise<void>;
}
