import Types "../types/reactions";
import ChatTypes "../types/chat";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type ReactionList = List.List<Types.Reaction>;
  public type MessageList = List.List<ChatTypes.Message>;
  public type ConversationList = List.List<ChatTypes.Conversation>;

  func isParticipant(conversations : ConversationList, caller : ChatTypes.UserId, conversationId : ChatTypes.ConversationId) : Bool {
    switch (conversations.find(func(c : ChatTypes.Conversation) : Bool {
      c.id == conversationId and (
        Principal.equal(c.participants.0, caller) or Principal.equal(c.participants.1, caller)
      )
    })) {
      case null false;
      case _ true;
    };
  };

  public func addReaction(
    reactions : ReactionList,
    messages : MessageList,
    conversations : ConversationList,
    caller : Types.UserId,
    messageId : Types.MessageId,
    emoji : Text,
    now : Types.Timestamp,
  ) : { #ok : (); #err : Text } {
    // Validate message exists
    switch (messages.find(func(m : ChatTypes.Message) : Bool { m.id == messageId })) {
      case null return #err("Message not found");
      case (?msg) {
        // Validate caller is participant
        if (not isParticipant(conversations, caller, msg.conversationId)) {
          return #err("Not a participant in this conversation");
        };
      };
    };
    // Check for duplicate reaction
    switch (reactions.find(func(r : Types.Reaction) : Bool {
      r.messageId == messageId and Principal.equal(r.userId, caller) and r.emoji == emoji
    })) {
      case (?_) return #err("Reaction already added");
      case null {};
    };
    reactions.add({ messageId; userId = caller; emoji; timestamp = now });
    #ok(());
  };

  public func removeReaction(
    reactions : ReactionList,
    caller : Types.UserId,
    messageId : Types.MessageId,
    emoji : Text,
  ) : { #ok : (); #err : Text } {
    var found = false;
    let filtered = reactions.filter(func(r : Types.Reaction) : Bool {
      let isTarget = r.messageId == messageId and Principal.equal(r.userId, caller) and r.emoji == emoji;
      if (isTarget) { found := true; false } else true
    });
    if (not found) return #err("Reaction not found");
    reactions.clear();
    reactions.append(filtered);
    #ok(());
  };

  public func getReactions(
    reactions : ReactionList,
    messages : MessageList,
    conversations : ConversationList,
    caller : Types.UserId,
    messageId : Types.MessageId,
  ) : { #ok : [Types.Reaction]; #err : Text } {
    switch (messages.find(func(m : ChatTypes.Message) : Bool { m.id == messageId })) {
      case null #err("Message not found");
      case (?msg) {
        if (not isParticipant(conversations, caller, msg.conversationId)) {
          return #err("Not a participant in this conversation");
        };
        let result = reactions.filter(func(r : Types.Reaction) : Bool {
          r.messageId == messageId
        }).toArray();
        #ok(result);
      };
    };
  };
};
