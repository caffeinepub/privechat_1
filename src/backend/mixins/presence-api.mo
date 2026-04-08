import PresenceTypes "../types/presence";
import PresenceLib "../lib/presence";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  presences : Map.Map<PresenceTypes.UserId, PresenceTypes.PresenceEntry>,
) {

  // Update caller's presence status
  public shared ({ caller }) func setPresence(status : PresenceTypes.PresenceStatus) : async () {
    PresenceLib.updatePresence(presences, caller, status, Time.now());
  };

  // Get effective presence status for a user (auto-derived from last update time)
  public query func getPresence(userId : PresenceTypes.UserId) : async ?PresenceTypes.PresenceStatus {
    PresenceLib.getPresence(presences, userId);
  };

  // Batch presence lookup for multiple users
  public query func getBulkPresence(userIds : [PresenceTypes.UserId]) : async [(PresenceTypes.UserId, PresenceTypes.PresenceStatus)] {
    PresenceLib.getBulkPresence(presences, userIds);
  };
};
