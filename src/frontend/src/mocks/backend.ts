import type { backendInterface } from "../backend.d";
import { FriendStatus, PresenceStatus } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const mockPrincipal1 = Principal.fromText("aaaaa-aa");
const mockPrincipal2 = Principal.fromText("2vxsx-fae");

export const mockBackend: backendInterface = {
  listUsers: async () => [
    { principal: mockPrincipal1, displayName: "Liam Dubois" },
    { principal: mockPrincipal2, displayName: "Sarah Chen" },
  ],
  getCurrentUser: async () => ({ principal: mockPrincipal1, displayName: "Liam Dubois" }),
  getOrCreateConversation: async (_other) => BigInt(1),
  getMessages: async (_conversationId) => [
    {
      id: BigInt(1),
      content: "Hey! Warm welcome to PriveChat.",
      sender: mockPrincipal2,
      conversationId: BigInt(1),
      timestamp: BigInt(Date.now() - 3600000) * BigInt(1000000),
      reactions: [],
    },
    {
      id: BigInt(2),
      content: "Thanks! Really glad to be here. How does the secure messaging work?",
      sender: mockPrincipal1,
      conversationId: BigInt(1),
      timestamp: BigInt(Date.now() - 1800000) * BigInt(1000000),
      reactions: [],
    },
    {
      id: BigInt(3),
      content: "All messages are stored on-chain. No middlemen, no surveillance.",
      sender: mockPrincipal2,
      conversationId: BigInt(1),
      timestamp: BigInt(Date.now() - 900000) * BigInt(1000000),
      reactions: [],
    },
  ],
  registerUser: async (_displayName) => undefined,
  sendMessage: async (_conversationId, _content) => BigInt(4),

  // Presence
  setPresence: async (_status) => undefined,
  getPresence: async (_userId) => PresenceStatus.Online,
  getBulkPresence: async (_userIds) => [],

  // Typing
  setTyping: async (_conversationId, _isTyping) => undefined,
  getTypingIndicators: async (_conversationId) => [],

  // Friends
  sendFriendRequest: async (_to) => ({ __kind__: "ok", ok: null }),
  respondToFriendRequest: async (_from, _accept) => ({ __kind__: "ok", ok: null }),
  removeFriend: async (_userId) => ({ __kind__: "ok", ok: null }),
  listFriends: async () => [],
  listFriendRequests: async () => [],

  // Reactions
  addReaction: async (_messageId, _emoji) => ({ __kind__: "ok", ok: null }),
  removeReaction: async (_messageId, _emoji) => ({ __kind__: "ok", ok: null }),
  getReactions: async (_messageId) => ({ __kind__: "ok", ok: [] }),

  // Preferences
  getUserPreferences: async () => null,
  setUserPreferences: async (_theme, _language, _pinHash) => undefined,

  // File messages
  sendFileMessage: async (_conversationId, _fileId, _filename, _mimeType, _size) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(5),
      content: "",
      sender: mockPrincipal1,
      conversationId: _conversationId,
      timestamp: BigInt(Date.now()) * BigInt(1000000),
      reactions: [],
      fileAttachment: {
        fileId: _fileId,
        filename: _filename,
        mimeType: _mimeType,
        size: _size,
      },
    },
  }),
};
