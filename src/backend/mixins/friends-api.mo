import FriendTypes "../types/friends";
import ChatTypes "../types/chat";
import FriendsLib "../lib/friends";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  friendRequests : List.List<FriendTypes.FriendRequest>,
  users : Map.Map<ChatTypes.UserId, ChatTypes.User>,
) {

  // Send a friend request to another user
  public shared ({ caller }) func sendFriendRequest(to : FriendTypes.UserId) : async { #ok : (); #err : Text } {
    FriendsLib.sendFriendRequest(friendRequests, caller, to, Time.now());
  };

  // Respond to a pending friend request (caller is the recipient)
  public shared ({ caller }) func respondToFriendRequest(from : FriendTypes.UserId, accept : Bool) : async { #ok : (); #err : Text } {
    FriendsLib.respondToFriendRequest(friendRequests, caller, from, accept);
  };

  // Remove an accepted friend
  public shared ({ caller }) func removeFriend(userId : FriendTypes.UserId) : async { #ok : (); #err : Text } {
    FriendsLib.removeFriend(friendRequests, caller, userId);
  };

  // List all accepted friends for the caller
  public query ({ caller }) func listFriends() : async [ChatTypes.User] {
    FriendsLib.listFriends(friendRequests, caller, users);
  };

  // List all pending friend requests involving the caller (sent or received)
  public query ({ caller }) func listFriendRequests() : async [FriendTypes.FriendRequest] {
    FriendsLib.listFriendRequests(friendRequests, caller);
  };
};
