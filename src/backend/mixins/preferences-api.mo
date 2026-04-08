import PreferencesLib "../lib/preferences";
import PreferencesTypes "../types/preferences";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

mixin (preferencesStore : Map.Map<Principal, PreferencesTypes.UserPreferences>) {

  public shared ({ caller }) func setUserPreferences(
    theme : Text,
    language : Text,
    pinHash : ?Text,
  ) : async () {
    PreferencesLib.setPreferences(preferencesStore, caller, { theme; language; pinHash });
  };

  public query ({ caller }) func getUserPreferences() : async ?PreferencesTypes.UserPreferences {
    PreferencesLib.getPreferences(preferencesStore, caller);
  };
};
