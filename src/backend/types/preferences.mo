module {
  public type Theme = Text;    // "light" | "dark"
  public type Language = Text; // "en" | "el" | "ro"

  public type UserPreferences = {
    theme : Theme;
    language : Language;
    pinHash : ?Text;
  };
};
