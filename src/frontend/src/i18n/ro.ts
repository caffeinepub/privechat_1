import type en from "./en";

const ro: typeof en = {
  // Navigation tabs
  conversations: "Conversații",
  friends: "Prieteni",
  users: "Utilizatori",

  // Header
  appName: "PriveChat",
  statusOnline: "Online",
  statusAway: "Absent",
  statusOffline: "Offline",
  statusChangeLabel: "Status: {status}. Clic pentru schimbare",

  // Chat UI
  typeAMessage: "Scrie un mesaj…",
  send: "Trimite",
  search: "Caută",
  searchMessages: "Caută mesaje…",
  noConversations: "Nicio conversație",
  noConversationsHint: "Începe o conversație din tab-ul Utilizatori",
  noMessagesYet: "Niciun mesaj încă",
  noMessagesHint: "Spune bună ziua!",
  selectConversation: "Selectează o conversație",
  selectConversationHint: "Alege un contact din panoul stâng pentru a începe",
  typing: "scrie…",
  sendFile: "Trimite fișier",
  addReaction: "Adaugă reacție",
  removeReaction: "Elimină reacția",

  // Empty state
  noConversationSelected: "Nicio conversație selectată",
  noConversationSelectedHint:
    "Alegeți un contact din listă pentru a începe să trimiteți mesaje în siguranță și în mod privat.",
  featurePrivate: "Privat",
  featureEncrypted: "Criptat",

  // Chat messages
  sayHelloTo: "Salutați-l pe",
  senderYou: "Tu",
  backToConversations: "Înapoi la conversații",
  youPrefix: "Tu: ",

  // Settings panel
  settings: "Setări",
  language: "Limbă",
  theme: "Temă",
  dark: "Întunecat",
  light: "Luminos",
  pinManagement: "Securitate PIN",
  setPin: "Setează PIN",
  changePin: "Schimbă PIN",
  removePin: "Elimină PIN",
  save: "Salvează",
  cancel: "Anulează",
  pinEnabled: "PIN activat",
  pinDisabled: "Fără PIN",
  enablePin: "Activează PIN",
  close: "Închide",

  // PIN screen
  enterYourPin: "Introdu PIN-ul tău",
  incorrectPin: "PIN incorect. Te rugăm să încerci din nou.",
  createAPin: "Creează un PIN",
  createPinHint: "Alege un PIN cu litere, cifre sau caractere speciale.",
  confirmPin: "Confirmă PIN-ul",
  pinsDoNotMatch: "PIN-urile nu coincid. Te rugăm să încerci din nou.",
  pinSet: "PIN setat cu succes",
  pinRemoved: "PIN eliminat",
  showPin: "Arată PIN",
  hidePin: "Ascunde PIN",
  unlock: "Deblochează",
  pinRequired: "PIN necesar pentru accesarea PriveChat",
  currentPin: "PIN curent",
  newPin: "PIN nou",
  confirmNewPin: "Confirmă PIN-ul nou",

  // Login page
  signIn: "Autentifică-te cu Internet Identity",
  signingIn: "Autentificare…",
  loginSubtitle: "Mesagerie privată și sigură pe Internet Computer.",
  loginPrivacy: "Mesajele tale rămân on-chain — fără intermediari.",
  loginHeroHeadline: "Conversațiile tale, cu adevărat private.",
  loginHeroSubtitle:
    "Mesagerie criptată end-to-end pe Internet Computer. Fără servere, fără supraveghere — doar tu și persoanele în care ai încredere.",
  loginFeatureEncrypted: "Criptare end-to-end",
  loginFeatureFast: "Fulgerător de rapid",
  loginFeatureDecentralized: "Descentralizat",
  loginWelcomeBack: "Bine ai revenit",
  loginSecuredBy: "SECURIZAT DE",
  loginInternetIdentity: "Internet Identity",

  // Profile setup
  setDisplayName: "Setează numele de afișare",
  displayNameHint:
    "Acest nume va fi vizibil pentru persoanele cărora le trimiți mesaje.",
  displayNamePlaceholder: "ex. Ion Popescu",
  continue: "Continuă",

  // Buttons / actions
  logout: "Deconectare",
  accept: "Acceptă",
  reject: "Respinge",
  addFriend: "Adaugă prieten",
  message: "Mesaj",
  download: "Descarcă",

  // Friends
  friendRequests: "Cereri de prietenie",
  noFriendsYet: "Niciun prieten",
  noFriendsHint: "Adaugă prieteni din tab-ul Utilizatori",
  pendingRequests: "În așteptare",

  // Users directory
  allUsers: "Toți utilizatorii",
  noUsersYet: "Nu s-au găsit alți utilizatori",

  // Language names
  langEn: "English",
  langEl: "Ελληνικά",
  langRo: "Română",
};

export default ro;
