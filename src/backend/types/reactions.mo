import Common "common";

module {
  public type UserId = Common.UserId;
  public type MessageId = Common.MessageId;
  public type Timestamp = Common.Timestamp;

  public type Reaction = {
    messageId : MessageId;
    userId : UserId;
    emoji : Text;
    timestamp : Timestamp;
  };
};
