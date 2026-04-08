import Common "common";

module {
  public type UserId = Common.UserId;
  public type ConversationId = Common.ConversationId;
  public type Timestamp = Common.Timestamp;

  public type TypingIndicator = {
    conversationId : ConversationId;
    userId : UserId;
    timestamp : Timestamp;
  };
};
