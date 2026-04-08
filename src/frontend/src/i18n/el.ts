import type en from "./en";

const el: typeof en = {
  // Navigation tabs
  conversations: "Συνομιλίες",
  friends: "Φίλοι",
  users: "Χρήστες",

  // Header
  appName: "PriveChat",
  statusOnline: "Σε σύνδεση",
  statusAway: "Απών",
  statusOffline: "Εκτός σύνδεσης",
  statusChangeLabel: "Κατάσταση: {status}. Κάντε κλικ για αλλαγή",

  // Chat UI
  typeAMessage: "Γράψτε μήνυμα…",
  send: "Αποστολή",
  search: "Αναζήτηση",
  searchMessages: "Αναζήτηση μηνυμάτων…",
  noConversations: "Δεν υπάρχουν συνομιλίες",
  noConversationsHint: "Ξεκινήστε συνομιλία από την καρτέλα Χρήστες",
  noMessagesYet: "Δεν υπάρχουν μηνύματα",
  noMessagesHint: "Πείτε γεια!",
  selectConversation: "Επιλέξτε συνομιλία",
  selectConversationHint:
    "Επιλέξτε επαφή από τον αριστερό πίνακα για να ξεκινήσετε",
  typing: "πληκτρολογεί…",
  sendFile: "Αποστολή αρχείου",
  addReaction: "Προσθήκη αντίδρασης",
  removeReaction: "Αφαίρεση αντίδρασης",

  // Empty state
  noConversationSelected: "Δεν έχει επιλεγεί συνομιλία",
  noConversationSelectedHint:
    "Επιλέξτε μια επαφή από τη λίστα για να ξεκινήσετε ασφαλή και ιδιωτική αλληλογραφία.",
  featurePrivate: "Ιδιωτικό",
  featureEncrypted: "Κρυπτογραφημένο",

  // Chat messages
  sayHelloTo: "Πείτε γεια στον/στην",
  senderYou: "Εσείς",
  backToConversations: "Πίσω στις συνομιλίες",
  youPrefix: "Εσείς: ",

  // Settings panel
  settings: "Ρυθμίσεις",
  language: "Γλώσσα",
  theme: "Θέμα",
  dark: "Σκοτεινό",
  light: "Φωτεινό",
  pinManagement: "Ασφάλεια PIN",
  setPin: "Ορισμός PIN",
  changePin: "Αλλαγή PIN",
  removePin: "Κατάργηση PIN",
  save: "Αποθήκευση",
  cancel: "Ακύρωση",
  pinEnabled: "PIN ενεργό",
  pinDisabled: "Χωρίς PIN",
  enablePin: "Ενεργοποίηση PIN",
  close: "Κλείσιμο",

  // PIN screen
  enterYourPin: "Εισάγετε το PIN σας",
  incorrectPin: "Λανθασμένο PIN. Παρακαλώ δοκιμάστε ξανά.",
  createAPin: "Δημιουργία PIN",
  createPinHint: "Επιλέξτε PIN με γράμματα, αριθμούς ή ειδικούς χαρακτήρες.",
  confirmPin: "Επιβεβαίωση PIN",
  pinsDoNotMatch: "Τα PIN δεν ταιριάζουν. Παρακαλώ δοκιμάστε ξανά.",
  pinSet: "Το PIN ορίστηκε επιτυχώς",
  pinRemoved: "Το PIN αφαιρέθηκε",
  showPin: "Εμφάνιση PIN",
  hidePin: "Απόκρυψη PIN",
  unlock: "Ξεκλείδωμα",
  pinRequired: "Απαιτείται PIN για πρόσβαση στο PriveChat",
  currentPin: "Τρέχον PIN",
  newPin: "Νέο PIN",
  confirmNewPin: "Επιβεβαίωση νέου PIN",

  // Login page
  signIn: "Σύνδεση με Internet Identity",
  signingIn: "Σύνδεση…",
  loginSubtitle: "Ασφαλής, ιδιωτική αλληλογραφία στον Internet Computer.",
  loginPrivacy: "Τα μηνύματά σας παραμένουν on-chain — χωρίς μεσάζοντες.",
  loginHeroHeadline: "Οι συνομιλίες σας, απολύτως ιδιωτικές.",
  loginHeroSubtitle:
    "Κρυπτογραφημένες συνομιλίες στον Internet Computer. Χωρίς διακομιστές, χωρίς παρακολούθηση — μόνο εσείς και οι άνθρωποι που εμπιστεύεστε.",
  loginFeatureEncrypted: "Κρυπτογράφηση άκρο προς άκρο",
  loginFeatureFast: "Αστραπιαία ταχύτητα",
  loginFeatureDecentralized: "Αποκεντρωμένο",
  loginWelcomeBack: "Καλώς ήρθατε",
  loginSecuredBy: "ΑΣΦΑΛΙΖΕΤΑΙ ΑΠΟ",
  loginInternetIdentity: "Internet Identity",

  // Profile setup
  setDisplayName: "Ορίστε το εμφανιζόμενο όνομά σας",
  displayNameHint:
    "Αυτό το όνομα θα είναι ορατό στους χρήστες που στέλνετε μήνυμα.",
  displayNamePlaceholder: "π.χ. Γιώργης Παπαδόπουλος",
  continue: "Συνέχεια",

  // Buttons / actions
  logout: "Αποσύνδεση",
  accept: "Αποδοχή",
  reject: "Απόρριψη",
  addFriend: "Προσθήκη φίλου",
  message: "Μήνυμα",
  download: "Λήψη",

  // Friends
  friendRequests: "Αιτήματα φιλίας",
  noFriendsYet: "Δεν υπάρχουν φίλοι",
  noFriendsHint: "Προσθέστε φίλους από την καρτέλα Χρήστες",
  pendingRequests: "Σε αναμονή",

  // Users directory
  allUsers: "Όλοι οι χρήστες",
  noUsersYet: "Δεν βρέθηκαν άλλοι χρήστες",

  // Language names
  langEn: "English",
  langEl: "Ελληνικά",
  langRo: "Română",
};

export default el;
