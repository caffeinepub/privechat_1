import ChatTypes "types/chat";
import PresenceTypes "types/presence";
import FriendTypes "types/friends";
import ReactionTypes "types/reactions";
import TypingTypes "types/typing";
import PreferencesTypes "types/preferences";
import ChatMixin "mixins/chat-api";
import PresenceMixin "mixins/presence-api";
import FriendsMixin "mixins/friends-api";
import ReactionsMixin "mixins/reactions-api";
import PreferencesMixin "mixins/preferences-api";

import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";


actor {
  // Chat state
  let users = Map.empty<ChatTypes.UserId, ChatTypes.User>();
  let conversations = List.empty<ChatTypes.Conversation>();
  let messages = List.empty<ChatTypes.Message>();

  // Typing state: conversationId -> userId -> TypingIndicator
  let typingMap = Map.empty<TypingTypes.ConversationId, Map.Map<TypingTypes.UserId, TypingTypes.TypingIndicator>>();

  // Presence state
  let presences = Map.empty<PresenceTypes.UserId, PresenceTypes.PresenceEntry>();

  // Friends state
  let friendRequests = List.empty<FriendTypes.FriendRequest>();

  // Reactions state
  let reactions = List.empty<ReactionTypes.Reaction>();

  // Preferences state
  let preferencesStore = Map.empty<Principal, PreferencesTypes.UserPreferences>();

  include ChatMixin(users, conversations, messages, typingMap);
  include PresenceMixin(presences);
  include FriendsMixin(friendRequests, users);
  include ReactionsMixin(reactions, messages, conversations);
  include PreferencesMixin(preferencesStore);
};
