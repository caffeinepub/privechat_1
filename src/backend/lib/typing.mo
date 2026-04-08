import Types "../types/typing";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

module {
  // Maps conversationId -> Map<UserId, TypingIndicator>
  public type TypingMap = Map.Map<Types.ConversationId, Map.Map<Types.UserId, Types.TypingIndicator>>;

  // 5 seconds in nanoseconds
  let typingTimeout : Int = 5_000_000_000;

  public func setTyping(
    typingMap : TypingMap,
    caller : Types.UserId,
    conversationId : Types.ConversationId,
    isTyping : Bool,
    now : Types.Timestamp,
  ) {
    let innerMap = switch (typingMap.get(conversationId)) {
      case (?m) m;
      case null {
        let m = Map.empty<Types.UserId, Types.TypingIndicator>();
        typingMap.add(conversationId, m);
        m;
      };
    };
    if (isTyping) {
      innerMap.add(caller, { conversationId; userId = caller; timestamp = now });
    } else {
      innerMap.remove(caller);
    };
  };

  public func getTypingIndicators(
    typingMap : TypingMap,
    conversationId : Types.ConversationId,
    caller : Types.UserId,
    now : Types.Timestamp,
  ) : [Types.UserId] {
    switch (typingMap.get(conversationId)) {
      case null [];
      case (?innerMap) {
        innerMap.entries()
          .filter(func((uid, indicator) : (Types.UserId, Types.TypingIndicator)) : Bool {
            not Principal.equal(uid, caller) and
            (now - indicator.timestamp) <= typingTimeout
          })
          .map<(Types.UserId, Types.TypingIndicator), Types.UserId>(func((uid, _)) { uid })
          .toArray()
      };
    };
  };
};
