module {
  // File metadata only — actual file bytes are stored in object-storage extension
  public type FileAttachment = {
    fileId : Text;    // ID from object-storage
    filename : Text;
    mimeType : Text;
    size : Nat;
  };
};
