import Types "../types/friends";
import ChatTypes "../types/chat";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type FriendRequestList = List.List<Types.FriendRequest>;
  public type UserMap = Map.Map<ChatTypes.UserId, ChatTypes.User>;

  func areFriends(requests : FriendRequestList, a : Types.UserId, b : Types.UserId) : Bool {
    switch (requests.find(func(r : Types.FriendRequest) : Bool {
      r.status == #Accepted and (
        (Principal.equal(r.from, a) and Principal.equal(r.to, b)) or
        (Principal.equal(r.from, b) and Principal.equal(r.to, a))
      )
    })) {
      case null false;
      case _ true;
    };
  };

  func hasPendingRequest(requests : FriendRequestList, from : Types.UserId, to : Types.UserId) : Bool {
    switch (requests.find(func(r : Types.FriendRequest) : Bool {
      r.status == #Pending and
      Principal.equal(r.from, from) and
      Principal.equal(r.to, to)
    })) {
      case null false;
      case _ true;
    };
  };

  public func sendFriendRequest(
    requests : FriendRequestList,
    caller : Types.UserId,
    to : Types.UserId,
    now : Types.Timestamp,
  ) : { #ok : (); #err : Text } {
    if (Principal.equal(caller, to)) return #err("Cannot send friend request to yourself");
    if (areFriends(requests, caller, to)) return #err("Already friends");
    if (hasPendingRequest(requests, caller, to)) return #err("Friend request already pending");
    requests.add({ from = caller; to; status = #Pending; timestamp = now });
    #ok(());
  };

  public func respondToFriendRequest(
    requests : FriendRequestList,
    caller : Types.UserId,
    from : Types.UserId,
    accept : Bool,
  ) : { #ok : (); #err : Text } {
    let newStatus : Types.FriendStatus = if (accept) #Accepted else #Rejected;
    var found = false;
    requests.mapInPlace(func(r : Types.FriendRequest) : Types.FriendRequest {
      if (r.status == #Pending and Principal.equal(r.from, from) and Principal.equal(r.to, caller)) {
        found := true;
        { r with status = newStatus };
      } else r;
    });
    if (found) #ok(()) else #err("No pending friend request found from that user");
  };

  public func removeFriend(
    requests : FriendRequestList,
    caller : Types.UserId,
    userId : Types.UserId,
  ) : { #ok : (); #err : Text } {
    if (not areFriends(requests, caller, userId)) return #err("Not friends with this user");
    requests.mapInPlace(func(r : Types.FriendRequest) : Types.FriendRequest {
      if (r.status == #Accepted and (
        (Principal.equal(r.from, caller) and Principal.equal(r.to, userId)) or
        (Principal.equal(r.from, userId) and Principal.equal(r.to, caller))
      )) {
        { r with status = #Rejected };
      } else r;
    });
    #ok(());
  };

  public func listFriends(
    requests : FriendRequestList,
    caller : Types.UserId,
    users : UserMap,
  ) : [ChatTypes.User] {
    let friendIds = requests.filterMap(func(r : Types.FriendRequest) : ?Types.UserId {
      if (r.status == #Accepted) {
        if (Principal.equal(r.from, caller)) ?r.to
        else if (Principal.equal(r.to, caller)) ?r.from
        else null
      } else null
    });
    friendIds.filterMap<Types.UserId, ChatTypes.User>(func(uid) {
      users.get(uid)
    }).toArray();
  };

  public func listFriendRequests(
    requests : FriendRequestList,
    caller : Types.UserId,
  ) : [Types.FriendRequest] {
    requests.filter(func(r : Types.FriendRequest) : Bool {
      r.status == #Pending and (
        Principal.equal(r.from, caller) or Principal.equal(r.to, caller)
      )
    }).toArray();
  };
};
