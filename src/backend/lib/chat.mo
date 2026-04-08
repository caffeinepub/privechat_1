import Types "../types/chat";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public type UserMap = Map.Map<Types.UserId, Types.User>;
  public type ConversationList = List.List<Types.Conversation>;
  public type MessageList = List.List<Types.Message>;

  // Register or update a user's display name
  public func registerUser(
    users : UserMap,
    caller : Types.UserId,
    displayName : Text,
  ) {
    users.add(caller, { principal = caller; displayName });
  };

  // Return all registered users
  public func listUsers(users : UserMap) : [Types.User] {
    users.values().toArray();
  };

  // Return the calling user's record (update call — always sees fresh committed state)
  public func getCurrentUser(users : UserMap, caller : Types.UserId) : ?Types.User {
    users.get(caller);
  };

  // Get or create a conversation between two principals; returns (conversation, newNextId)
  public func getOrCreateConversation(
    conversations : ConversationList,
    nextId : Nat,
    a : Types.UserId,
    b : Types.UserId,
    now : Types.Timestamp,
  ) : (Types.Conversation, Nat) {
    // Check if a conversation already exists between these two
    let existing = conversations.find(func(c : Types.Conversation) : Bool {
      let (p1, p2) = c.participants;
      (Principal.equal(p1, a) and Principal.equal(p2, b)) or
      (Principal.equal(p1, b) and Principal.equal(p2, a))
    });
    switch (existing) {
      case (?conv) (conv, nextId);
      case null {
        let conv : Types.Conversation = {
          id = nextId;
          participants = (a, b);
          createdAt = now;
        };
        conversations.add(conv);
        (conv, nextId + 1);
      };
    };
  };

  // Look up a conversation by id, verifying caller is a participant
  public func getConversation(
    conversations : ConversationList,
    caller : Types.UserId,
    conversationId : Types.ConversationId,
  ) : ?Types.Conversation {
    conversations.find(func(c : Types.Conversation) : Bool {
      if (c.id != conversationId) return false;
      let (p1, p2) = c.participants;
      Principal.equal(p1, caller) or Principal.equal(p2, caller)
    });
  };

  // Send a text message; validates caller is a participant; returns new message
  public func sendMessage(
    messages : MessageList,
    conversations : ConversationList,
    nextId : Nat,
    caller : Types.UserId,
    conversationId : Types.ConversationId,
    content : Text,
    now : Types.Timestamp,
  ) : Nat {
    switch (getConversation(conversations, caller, conversationId)) {
      case null Runtime.trap("Not a participant in this conversation");
      case (?_) {
        let msg : Types.Message = {
          id = nextId;
          conversationId;
          sender = caller;
          content;
          timestamp = now;
          fileAttachment = null;
          reactions = [];
        };
        messages.add(msg);
        nextId
      };
    };
  };

  // Send a file message (metadata only); validates caller is a participant; returns new message
  public func sendFileMessage(
    messages : MessageList,
    conversations : ConversationList,
    nextId : Nat,
    caller : Types.UserId,
    conversationId : Types.ConversationId,
    fileId : Text,
    filename : Text,
    mimeType : Text,
    size : Nat,
    now : Types.Timestamp,
  ) : { #ok : Types.Message; #err : Text } {
    switch (getConversation(conversations, caller, conversationId)) {
      case null #err("Not a participant in this conversation");
      case (?_) {
        let msg : Types.Message = {
          id = nextId;
          conversationId;
          sender = caller;
          content = "";
          timestamp = now;
          fileAttachment = ?{ fileId; filename; mimeType; size };
          reactions = [];
        };
        messages.add(msg);
        #ok(msg)
      };
    };
  };

  // Retrieve all messages for a conversation; validates caller is a participant
  public func getMessages(
    messages : MessageList,
    conversations : ConversationList,
    caller : Types.UserId,
    conversationId : Types.ConversationId,
  ) : [Types.Message] {
    switch (getConversation(conversations, caller, conversationId)) {
      case null Runtime.trap("Not a participant in this conversation");
      case (?_) {
        messages.filter(func(m : Types.Message) : Bool {
          m.conversationId == conversationId
        }).toArray()
      };
    };
  };
};
