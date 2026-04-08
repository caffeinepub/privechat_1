import Types "../types/presence";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public type PresenceMap = Map.Map<Types.UserId, Types.PresenceEntry>;

  // 5 minutes in nanoseconds
  let awayThreshold : Int = 300_000_000_000;
  // 30 minutes in nanoseconds
  let offlineThreshold : Int = 1_800_000_000_000;

  // Derive effective status based on last update time
  func deriveStatus(entry : Types.PresenceEntry, now : Types.Timestamp) : Types.PresenceStatus {
    let elapsed = now - entry.updatedAt;
    if (elapsed > offlineThreshold) #Offline
    else if (elapsed > awayThreshold) #Away
    else #Online;
  };

  public func updatePresence(
    presences : PresenceMap,
    caller : Types.UserId,
    status : Types.PresenceStatus,
    now : Types.Timestamp,
  ) {
    presences.add(caller, { userId = caller; status; updatedAt = now });
  };

  public func getPresence(
    presences : PresenceMap,
    userId : Types.UserId,
  ) : ?Types.PresenceStatus {
    let now = Time.now();
    switch (presences.get(userId)) {
      case null null;
      case (?entry) ?deriveStatus(entry, now);
    };
  };

  public func getBulkPresence(
    presences : PresenceMap,
    userIds : [Types.UserId],
  ) : [(Types.UserId, Types.PresenceStatus)] {
    let now = Time.now();
    userIds.filterMap<Types.UserId, (Types.UserId, Types.PresenceStatus)>(func(uid) {
      switch (presences.get(uid)) {
        case null null;
        case (?entry) ?(uid, deriveStatus(entry, now));
      }
    });
  };
};
