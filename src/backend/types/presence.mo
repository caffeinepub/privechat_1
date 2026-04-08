import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type PresenceStatus = {
    #Online;
    #Away;
    #Offline;
  };

  public type PresenceEntry = {
    userId : UserId;
    status : PresenceStatus;
    updatedAt : Timestamp;
  };
};
