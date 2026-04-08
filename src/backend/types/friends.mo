import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type FriendStatus = {
    #Pending;
    #Accepted;
    #Rejected;
  };

  public type FriendRequest = {
    from : UserId;
    to : UserId;
    status : FriendStatus;
    timestamp : Timestamp;
  };
};
