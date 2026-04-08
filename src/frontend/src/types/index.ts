import type { Principal } from "@icp-sdk/core/principal";

export type UserId = Principal;
export type ConversationId = bigint;
export type MessageId = bigint;
export type Timestamp = bigint;

export type PresenceStatus = "Online" | "Away" | "Offline";
export type FriendStatus = "Pending" | "Accepted" | "Rejected";

export interface FileAttachment {
  fileId: string;
  filename: string;
  mimeType: string;
  size: bigint;
}

export interface Reaction {
  messageId: MessageId;
  userId: UserId;
  emoji: string;
  timestamp: Timestamp;
}

export interface FriendRequest {
  from: UserId;
  to: UserId;
  status: FriendStatus;
  timestamp: Timestamp;
}

export interface User {
  principal: UserId;
  displayName: string;
}

export interface Conversation {
  id: ConversationId;
  participants: UserId[];
  createdAt: Timestamp;
}

export interface Message {
  id: MessageId;
  conversationId: ConversationId;
  sender: UserId;
  content: string;
  timestamp: Timestamp;
  fileAttachment?: FileAttachment;
  reactions?: Reaction[]; // populated from backend; absent = no reactions yet
}

export interface UserProfile {
  name: string;
}
