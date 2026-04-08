import PreferencesTypes "../types/preferences";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type UserId = Principal;
  public type UserPreferences = PreferencesTypes.UserPreferences;
  public type PreferencesStore = Map.Map<UserId, UserPreferences>;

  public func getPreferences(
    store : PreferencesStore,
    userId : UserId,
  ) : ?UserPreferences {
    store.get(userId);
  };

  public func setPreferences(
    store : PreferencesStore,
    userId : UserId,
    prefs : UserPreferences,
  ) {
    store.add(userId, prefs);
  };
};
