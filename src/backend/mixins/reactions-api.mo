import ReactionTypes "../types/reactions";
import ChatTypes "../types/chat";
import ReactionsLib "../lib/reactions";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (
  reactions : List.List<ReactionTypes.Reaction>,
  messages : List.List<ChatTypes.Message>,
  conversations : List.List<ChatTypes.Conversation>,
) {

  // Add an emoji reaction to a message; caller must be a participant
  public shared ({ caller }) func addReaction(messageId : ReactionTypes.MessageId, emoji : Text) : async { #ok : (); #err : Text } {
    ReactionsLib.addReaction(reactions, messages, conversations, caller, messageId, emoji, Time.now());
  };

  // Remove caller's emoji reaction from a message
  public shared ({ caller }) func removeReaction(messageId : ReactionTypes.MessageId, emoji : Text) : async { #ok : (); #err : Text } {
    ReactionsLib.removeReaction(reactions, caller, messageId, emoji);
  };

  // Get all reactions for a message; caller must be a participant
  public query ({ caller }) func getReactions(messageId : ReactionTypes.MessageId) : async { #ok : [ReactionTypes.Reaction]; #err : Text } {
    ReactionsLib.getReactions(reactions, messages, conversations, caller, messageId);
  };
};
