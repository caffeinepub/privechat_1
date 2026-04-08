import Common "common";
import Files "files";
import Reactions "reactions";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;
  public type ConversationId = Common.ConversationId;
  public type MessageId = Common.MessageId;

  public type FileAttachment = Files.FileAttachment;
  public type Reaction = Reactions.Reaction;

  public type User = {
    principal : UserId;
    displayName : Text;
  };

  public type Conversation = {
    id : ConversationId;
    participants : (UserId, UserId);
    createdAt : Timestamp;
  };

  public type Message = {
    id : MessageId;
    conversationId : ConversationId;
    sender : UserId;
    content : Text;
    timestamp : Timestamp;
    fileAttachment : ?FileAttachment;
    reactions : [Reaction];
  };
};
