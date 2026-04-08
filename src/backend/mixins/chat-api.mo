import Types "../types/chat";
import TypingTypes "../types/typing";
import ChatLib "../lib/chat";
import TypingLib "../lib/typing";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  users : Map.Map<Types.UserId, Types.User>,
  conversations : List.List<Types.Conversation>,
  messages : List.List<Types.Message>,
  typingMap : Map.Map<TypingTypes.ConversationId, Map.Map<TypingTypes.UserId, TypingTypes.TypingIndicator>>,
) {

  var nextConversationId : Nat = 0;
  var nextMessageId : Nat = 0;

  // Register the caller with a display name; auto-registers on first call
  public shared ({ caller }) func registerUser(displayName : Text) : async () {
    ChatLib.registerUser(users, caller, displayName);
  };

  // List all registered users
  public query func listUsers() : async [Types.User] {
    ChatLib.listUsers(users);
  };

  // Get the calling user's record — declared as shared (update), NOT query,
  // so it always reads the latest committed state after registration.
  public shared ({ caller }) func getCurrentUser() : async ?Types.User {
    ChatLib.getCurrentUser(users, caller);
  };

  // Get or create a direct conversation with another user; returns conversation id
  public shared ({ caller }) func getOrCreateConversation(other : Types.UserId) : async Types.ConversationId {
    let now = Time.now();
    let (conv, newNextId) = ChatLib.getOrCreateConversation(conversations, nextConversationId, caller, other, now);
    nextConversationId := newNextId;
    conv.id;
  };

  // Send a text message in a conversation; caller must be a participant
  public shared ({ caller }) func sendMessage(conversationId : Types.ConversationId, content : Text) : async Types.MessageId {
    let now = Time.now();
    let msgId = ChatLib.sendMessage(messages, conversations, nextMessageId, caller, conversationId, content, now);
    nextMessageId := nextMessageId + 1;
    msgId;
  };

  // Retrieve all messages for a conversation; caller must be a participant
  public query ({ caller }) func getMessages(conversationId : Types.ConversationId) : async [Types.Message] {
    ChatLib.getMessages(messages, conversations, caller, conversationId);
  };

  // Set or clear typing indicator for the caller in a conversation
  public shared ({ caller }) func setTyping(conversationId : Types.ConversationId, isTyping : Bool) : async () {
    switch (ChatLib.getConversation(conversations, caller, conversationId)) {
      case null { /* caller is not a participant, silently ignore */ };
      case (?_) {
        TypingLib.setTyping(typingMap, caller, conversationId, isTyping, Time.now());
      };
    };
  };

  // Get list of users currently typing in a conversation (excludes caller, stale > 5s)
  public query ({ caller }) func getTypingIndicators(conversationId : Types.ConversationId) : async [Types.UserId] {
    TypingLib.getTypingIndicators(typingMap, conversationId, caller, Time.now());
  };

  // Send a message with a file attachment (metadata only; file bytes stored in object-storage)
  public shared ({ caller }) func sendFileMessage(
    conversationId : Types.ConversationId,
    fileId : Text,
    filename : Text,
    mimeType : Text,
    size : Nat,
  ) : async { #ok : Types.Message; #err : Text } {
    let now = Time.now();
    let result = ChatLib.sendFileMessage(messages, conversations, nextMessageId, caller, conversationId, fileId, filename, mimeType, size, now);
    switch (result) {
      case (#ok(_)) { nextMessageId := nextMessageId + 1 };
      case (#err(_)) {};
    };
    result;
  };
};
