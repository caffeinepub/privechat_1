var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { S as Subscribable, s as shallowEqualObjects, h as hashKey, g as getDefaultState, n as notifyManager, u as useQueryClient, r as reactExports, a as noop, b as shouldThrowError, c as createLucideIcon, j as jsxRuntimeExports, d as useActor, e as createActor, f as useInternetIdentity, i as useTranslation, k as cn, l as useQuery, A as Avatar, m as AvatarFallback, _ as __vitePreload, F as FriendStatus, t as PresenceStatus, v as PresenceDot, B as Button, w as Shield, Z as Zap, L as LoaderCircle, X, x as createActorWithConfig, E as ExternalBlob, I as Input, y as createContextScope, R as React2, z as useComposedRefs, C as createSlot, D as useId, G as Primitive, H as composeEventHandlers, K as useControllableState, M as useCallbackRef, N as Presence, P as Principal, J as JSON_KEY_PRINCIPAL, o as base32Decode, p as base32Encode, q as getCrc32 } from "./index-B39a_2Yv.js";
var MutationObserver$1 = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver$1(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "12", r: "2", key: "737tya" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22", key: "wt3hpn" }]
];
const FileImage = createLucideIcon("file-image", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m10 11 5 3-5 3v-6Z", key: "7ntvm4" }]
];
const FileVideo = createLucideIcon("file-video", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
function formatBytes(bytes) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
function FileIcon({ mimeType }) {
  if (mimeType.startsWith("image/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { className: "h-5 w-5 shrink-0" });
  if (mimeType.startsWith("video/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { className: "h-5 w-5 shrink-0" });
  if (mimeType.startsWith("text/") || mimeType.includes("pdf"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 shrink-0" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-5 w-5 shrink-0" });
}
function FileAttachmentView({
  attachment
}) {
  const { fileId, filename, mimeType, size } = attachment;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: fileId,
      target: "_blank",
      rel: "noopener noreferrer",
      download: filename,
      className: "flex items-center gap-2.5 px-3 py-2.5 mt-1.5 rounded-sm bg-muted/60 border border-border hover:bg-muted transition-smooth max-w-[260px] group",
      "data-ocid": "file-attachment",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground group-hover:text-foreground transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileIcon, { mimeType }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: filename }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatBytes(size) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-accent transition-colors" })
      ]
    }
  );
}
function useAddReaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.addReaction(messageId, emoji);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", messageId.toString()]
      });
    }
  });
}
function useRemoveReaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.removeReaction(messageId, emoji);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", messageId.toString()]
      });
    }
  });
}
const EMOJI_LIST = ["👍", "👎", "😂", "❤️", "😮", "😢", "😡", "🔥", "✨"];
function MessageReactions({
  messageId,
  reactions,
  isMine
}) {
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = reactExports.useState(false);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const pickerRef = reactExports.useRef(null);
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const groups = EMOJI_LIST.reduce(
    (acc, emoji) => {
      const matching = reactions.filter((r) => r.emoji === emoji);
      if (matching.length === 0) return acc;
      const hasReacted = matching.some(
        (r) => r.userId.toString() === myPrincipal
      );
      acc.push({ emoji, count: matching.length, hasReacted });
      return acc;
    },
    []
  );
  const handleReactionClick = (emoji, hasReacted) => {
    if (hasReacted) {
      removeReaction.mutate({ messageId, emoji });
    } else {
      addReaction.mutate({ messageId, emoji });
    }
  };
  const handlePickerEmoji = (emoji) => {
    setShowPicker(false);
    const existing = groups.find((g) => g.emoji === emoji);
    if (existing == null ? void 0 : existing.hasReacted) return;
    addReaction.mutate({ messageId, emoji });
  };
  reactExports.useEffect(() => {
    if (!showPicker) return;
    const handleMouseDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showPicker]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`,
      children: [
        groups.map(({ emoji, count, hasReacted }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleReactionClick(emoji, hasReacted),
            className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-smooth ${hasReacted ? "bg-accent/20 border-accent/40 text-foreground" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:border-border/80"}`,
            "data-ocid": `reaction-badge-${messageId}-${emoji}`,
            title: hasReacted ? t("removeReaction") : t("addReaction"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: count })
            ]
          },
          emoji
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: pickerRef, className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPicker((v) => !v),
              className: "inline-flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60 transition-smooth",
              "data-ocid": `btn-add-reaction-${messageId}`,
              "aria-label": t("addReaction"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-3.5 w-3.5" })
            }
          ),
          showPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `absolute z-50 bottom-full mb-1 bg-popover border border-border shadow-lg rounded-sm p-1.5 flex gap-0.5 ${isMine ? "right-0" : "left-0"}`,
              "data-ocid": "emoji-picker",
              children: EMOJI_LIST.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handlePickerEmoji(emoji),
                  className: "h-7 w-7 flex items-center justify-center text-base rounded hover:bg-muted transition-smooth",
                  title: emoji,
                  children: emoji
                },
                emoji
              ))
            }
          )
        ] })
      ]
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function usePolling(fn, { interval = 3e3, focusedInterval, enabled = true } = {}) {
  const fnRef = reactExports.useRef(fn);
  fnRef.current = fn;
  reactExports.useEffect(() => {
    if (!enabled) return;
    if (!focusedInterval) {
      const id2 = setInterval(() => fnRef.current(), interval);
      return () => clearInterval(id2);
    }
    let id;
    const startInterval = () => {
      clearInterval(id);
      const ms = document.hasFocus() ? focusedInterval : interval;
      id = setInterval(() => fnRef.current(), ms);
    };
    startInterval();
    window.addEventListener("focus", startInterval);
    window.addEventListener("blur", startInterval);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", startInterval);
      window.removeEventListener("blur", startInterval);
    };
  }, [interval, focusedInterval, enabled]);
}
const TYPING_CLEAR_DELAY_MS = 2e3;
const TYPING_POLL_MS = 1500;
function useSetTyping(conversationId) {
  const { actor } = useActor(createActor);
  const clearTimerRef = reactExports.useRef(null);
  const isTypingRef = reactExports.useRef(false);
  const sendTyping = reactExports.useCallback(
    async (isTyping) => {
      if (!actor) return;
      try {
        await actor.setTyping(conversationId, isTyping);
      } catch {
      }
    },
    [actor, conversationId]
  );
  const setTyping = reactExports.useCallback(
    (isTyping) => {
      if (isTyping) {
        if (!isTypingRef.current) {
          isTypingRef.current = true;
          void sendTyping(true);
        }
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        clearTimerRef.current = setTimeout(() => {
          isTypingRef.current = false;
          void sendTyping(false);
        }, TYPING_CLEAR_DELAY_MS);
      } else {
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        if (isTypingRef.current) {
          isTypingRef.current = false;
          void sendTyping(false);
        }
      }
    },
    [sendTyping]
  );
  reactExports.useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        void sendTyping(false);
      }
    };
  }, [sendTyping]);
  return { setTyping };
}
function useTypingIndicators(conversationId, enabled) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const query = useQuery({
    queryKey: ["typing", conversationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const userIds = await actor.getTypingIndicators(conversationId);
      return userIds.map((p) => p.toString());
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 0,
    refetchInterval: false
    // driven by usePolling below
  });
  usePolling(
    () => {
      void query.refetch();
    },
    {
      interval: TYPING_POLL_MS,
      focusedInterval: TYPING_POLL_MS,
      enabled: !!actor && !actorFetching && enabled
    }
  );
  return query.data ?? [];
}
function initials$3(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ChatWindow({
  conversationId,
  otherUser,
  onRefreshConversations
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const bottomRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const {
    data: messages = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["messages", conversationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(conversationId);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1e3
  });
  const sorted = [...messages].sort(
    (a, b) => Number(a.timestamp - b.timestamp)
  );
  usePolling(
    () => {
      refetch();
      onRefreshConversations();
    },
    {
      interval: 2e3,
      focusedInterval: 500,
      enabled: !!actor && !actorFetching
    }
  );
  const prevCount = reactExports.useRef(0);
  reactExports.useEffect(() => {
    var _a2;
    if (sorted.length !== prevCount.current) {
      prevCount.current = sorted.length;
      (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    }
  });
  const typingUserIds = useTypingIndicators(
    conversationId,
    !!actor && !actorFetching
  );
  const othersTyping = typingUserIds.filter((id) => id !== myPrincipal);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col gap-4 p-6 overflow-y-auto bg-background",
        "data-ocid": "chat-window-loading",
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-end gap-2 ${i % 2 === 0 ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: `h-12 w-48 rounded-2xl ${i % 2 === 0 ? "ml-auto" : ""}`
                }
              )
            ]
          },
          i
        ))
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: containerRef,
      className: "flex-1 overflow-y-auto flex flex-col gap-1 p-4 bg-background focus:outline-none",
      tabIndex: -1,
      "data-ocid": "chat-window",
      children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl gradient-primary mx-auto flex items-center justify-center opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "👋" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          t("sayHelloTo"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: otherUser.displayName }),
          "!"
        ] })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        sorted.map((msg, idx) => {
          const isMine = msg.sender.toString() === myPrincipal;
          const senderName = isMine ? t("senderYou") : otherUser.displayName;
          const prevMsg = idx > 0 ? sorted[idx - 1] : null;
          const sameGroup = prevMsg && prevMsg.sender.toString() === msg.sender.toString();
          const reactions = msg.reactions ?? [];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""} ${sameGroup ? "mt-0.5" : "mt-4"} group`,
              "data-ocid": `msg-${msg.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 shrink-0", children: !sameGroup && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AvatarFallback,
                  {
                    className: `text-xs font-bold ${isMine ? "gradient-primary text-white" : "bg-accent/15 text-accent"}`,
                    children: initials$3(senderName)
                  }
                ) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex flex-col gap-0.5 max-w-[70%] ${isMine ? "items-end" : "items-start"}`,
                    children: [
                      !sameGroup && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `flex items-baseline gap-2 ${isMine ? "flex-row-reverse" : ""}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: senderName }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/70", children: formatTimestamp(msg.timestamp) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `px-4 py-2.5 text-sm leading-relaxed break-words ${isMine ? "message-bubble-sent" : "message-bubble-received"}`,
                          children: [
                            msg.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: msg.content }),
                            msg.fileAttachment && /* @__PURE__ */ jsxRuntimeExports.jsx(FileAttachmentView, { attachment: msg.fileAttachment })
                          ]
                        }
                      ),
                      sameGroup && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50 px-1", children: formatTimestamp(msg.timestamp) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MessageReactions,
                        {
                          messageId: msg.id,
                          reactions,
                          isMine
                        }
                      )
                    ]
                  }
                )
              ]
            },
            msg.id.toString()
          );
        }),
        othersTyping.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 mt-3 ml-10 pl-2",
            "data-ocid": "typing-indicator",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-center px-3 py-2 bg-card border border-border rounded-2xl rounded-bl-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce",
                    style: { animationDelay: "0ms" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce",
                    style: { animationDelay: "150ms" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce",
                    style: { animationDelay: "300ms" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground italic", children: [
                otherUser.displayName,
                " ",
                t("typing")
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
      ] })
    }
  );
}
function toFrontendFriendStatus(status) {
  switch (status) {
    case FriendStatus.Accepted:
      return "Accepted";
    case FriendStatus.Rejected:
      return "Rejected";
    case FriendStatus.Pending:
      return "Pending";
  }
}
function normalizeFriendRequest(raw) {
  return {
    from: raw.from,
    to: raw.to,
    status: toFrontendFriendStatus(raw.status),
    timestamp: raw.timestamp
  };
}
function useFriends() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFriends();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 3e4
  });
  const requestsQuery = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.listFriendRequests();
      return raw.map(normalizeFriendRequest);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 15e3
  });
  const allRequests = requestsQuery.data ?? [];
  const incoming = allRequests.filter(
    (r) => r.status === "Pending" && r.to.toString() === myPrincipal
  );
  const outgoing = allRequests.filter(
    (r) => r.status === "Pending" && r.from.toString() === myPrincipal
  );
  return {
    friends: friendsQuery.data ?? [],
    incoming,
    outgoing,
    isLoading: actorFetching || friendsQuery.isLoading || requestsQuery.isLoading
  };
}
function useSendFriendRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal: Principal2 } = await __vitePreload(async () => {
        const { Principal: Principal3 } = await Promise.resolve().then(() => index);
        return { Principal: Principal3 };
      }, true ? void 0 : void 0);
      const principal = Principal2.fromText(userId);
      const result = await actor.sendFriendRequest(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    }
  });
}
function useRespondToFriendRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      from,
      accept
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal: Principal2 } = await __vitePreload(async () => {
        const { Principal: Principal3 } = await Promise.resolve().then(() => index);
        return { Principal: Principal3 };
      }, true ? void 0 : void 0);
      const principal = Principal2.fromText(from);
      const result = await actor.respondToFriendRequest(principal, accept);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    }
  });
}
function useRemoveFriend() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal: Principal2 } = await __vitePreload(async () => {
        const { Principal: Principal3 } = await Promise.resolve().then(() => index);
        return { Principal: Principal3 };
      }, true ? void 0 : void 0);
      const principal = Principal2.fromText(userId);
      const result = await actor.removeFriend(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });
}
function toFrontendStatus(status) {
  switch (status) {
    case PresenceStatus.Online:
      return "Online";
    case PresenceStatus.Away:
      return "Away";
    case PresenceStatus.Offline:
      return "Offline";
  }
}
function useBulkPresence(userIds) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const query = useQuery({
    queryKey: ["presence", "bulk", userIds.slice().sort().join(",")],
    queryFn: async () => {
      if (!actor || userIds.length === 0) return /* @__PURE__ */ new Map();
      const { Principal: Principal2 } = await __vitePreload(async () => {
        const { Principal: Principal3 } = await Promise.resolve().then(() => index);
        return { Principal: Principal3 };
      }, true ? void 0 : void 0);
      const principals = userIds.map((id) => Principal2.fromText(id));
      const entries = await actor.getBulkPresence(principals);
      const map = /* @__PURE__ */ new Map();
      for (const [principal, status] of entries) {
        map.set(principal.toString(), toFrontendStatus(status));
      }
      return map;
    },
    enabled: !!actor && !actorFetching && userIds.length > 0,
    staleTime: 1e4,
    refetchInterval: 1e4
  });
  return query.data ?? /* @__PURE__ */ new Map();
}
function initials$2(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatTime(ts) {
  const ms = Number(ts / 1000000n);
  const d = new Date(ms);
  const now = /* @__PURE__ */ new Date();
  const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  return isToday ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function ConversationList({
  users,
  onSelectConversation,
  activeConversationId
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const sendFriendRequest = useSendFriendRequest();
  const { friends, incoming, outgoing } = useFriends();
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", myPrincipal],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const otherUsers = users.filter(
        (u) => u.principal.toString() !== myPrincipal
      );
      const results = [];
      await Promise.all(
        otherUsers.map(async (otherUser) => {
          try {
            const convId = await actor.getOrCreateConversation(
              otherUser.principal
            );
            const msgs = await actor.getMessages(convId);
            if (msgs.length === 0) return;
            const sorted = [...msgs].sort(
              (a, b) => Number(b.timestamp - a.timestamp)
            );
            results.push({
              conversation: {
                id: convId,
                participants: [identity.getPrincipal(), otherUser.principal],
                createdAt: 0n
              },
              otherUser,
              lastMessage: sorted[0]
            });
          } catch {
          }
        })
      );
      return results.sort((a, b) => {
        var _a2, _b;
        const tA = ((_a2 = a.lastMessage) == null ? void 0 : _a2.timestamp) ?? 0n;
        const tB = ((_b = b.lastMessage) == null ? void 0 : _b.timestamp) ?? 0n;
        return Number(tB - tA);
      });
    },
    enabled: !!actor && !actorFetching && !!identity && users.length > 0,
    staleTime: 3e3
  });
  const partnerIds = reactExports.useMemo(
    () => conversations.map((c) => c.otherUser.principal.toString()),
    [conversations]
  );
  const presenceMap = useBulkPresence(partnerIds);
  const friendSet = reactExports.useMemo(
    () => new Set(friends.map((f) => f.principal.toString())),
    [friends]
  );
  const pendingSet = reactExports.useMemo(() => {
    const all = [...incoming, ...outgoing];
    return new Set(
      all.map((r) => r.from.toString()).concat(all.map((r) => r.to.toString()))
    );
  }, [incoming, outgoing]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-1", "data-ocid": "conversation-list-loading", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-40" })
      ] })
    ] }, i)) });
  }
  if (conversations.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 py-14 px-4 text-center",
        "data-ocid": "conversation-list-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-white", strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-0.5", children: t("noConversations") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("noConversationsHint") })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "py-1", "data-ocid": "conversation-list", children: conversations.map(({ conversation, otherUser, lastMessage }) => {
    const isActive = conversation.id === activeConversationId;
    const isMine = (lastMessage == null ? void 0 : lastMessage.sender.toString()) === myPrincipal;
    const uid = otherUser.principal.toString();
    const presence = presenceMap.get(uid) ?? null;
    const isFriend = friendSet.has(uid);
    const isPending = !isFriend && pendingSet.has(uid);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onSelectConversation(conversation.id, otherUser),
        className: `w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth group ${isActive ? "contact-item-active" : "border-l-2 border-transparent hover:bg-primary/5 hover:border-primary/30"}`,
        "data-ocid": `conv-item-${conversation.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Avatar,
              {
                className: `h-10 w-10 ${isActive ? "ring-2 ring-primary/40" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AvatarFallback,
                  {
                    className: `text-xs font-bold ${isActive ? "gradient-primary text-white" : "bg-primary/10 text-primary"}`,
                    children: initials$2(otherUser.displayName)
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: presence, size: "sm" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-sm font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`,
                  children: otherUser.displayName
                }
              ),
              lastMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: formatTime(lastMessage.timestamp) })
            ] }),
            lastMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: [
              isMine ? t("youPrefix") : "",
              lastMessage.fileAttachment ? `📎 ${lastMessage.fileAttachment.filename}` : lastMessage.content
            ] })
          ] }),
          !isFriend && !isPending && myPrincipal !== uid && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth",
              onClick: (e) => {
                e.stopPropagation();
                sendFriendRequest.mutate(uid);
              },
              disabled: sendFriendRequest.isPending,
              "aria-label": `${t("addFriend")} ${otherUser.displayName}`,
              "data-ocid": `btn-add-friend-conv-${uid.slice(0, 8)}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5" })
            }
          ),
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-smooth", children: t("pendingRequests") })
        ]
      }
    ) }, conversation.id.toString());
  }) });
}
function EmptyState() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 flex flex-col items-center justify-center bg-background gap-6 p-8 relative overflow-hidden",
      "data-ocid": "empty-state-chat",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 pointer-events-none",
            style: {
              background: "radial-gradient(ellipse at 50% 50%, oklch(var(--primary) / 0.04) 0%, transparent 70%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-5 max-w-xs text-center animate-scale-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-lg glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-9 w-9 text-white", strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-2 rounded-3xl border-2 border-primary/20 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: t("noConversationSelected") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: t("noConversationSelectedHint") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-center mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-primary/8 border border-primary/20 rounded-full px-3 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium", children: t("featurePrivate") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-accent/8 border border-accent/20 rounded-full px-3 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent font-medium", children: t("featureEncrypted") })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function initials$1(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function FriendsList({ onSelectUser }) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { friends, incoming, outgoing, isLoading } = useFriends();
  const respond = useRespondToFriendRequest();
  const removeFriend = useRemoveFriend();
  const { t } = useTranslation();
  const { data: allUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 6e4
  });
  const userByPrincipal = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const u of allUsers) map.set(u.principal.toString(), u);
    return map;
  }, [allUsers]);
  const friendIds = friends.map((f) => f.principal.toString());
  const presenceMap = useBulkPresence(friendIds);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2", "data-ocid": "friends-list-loading", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
    ] }, i)) });
  }
  const hasAnything = friends.length > 0 || incoming.length > 0 || outgoing.length > 0;
  if (!hasAnything) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 py-14 px-4 text-center",
        "data-ocid": "friends-list-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-muted-foreground/40", strokeWidth: 1.5 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-0.5", children: t("noFriendsYet") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("noFriendsHint") })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", "data-ocid": "friends-list", children: [
    incoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
        t("friendRequests"),
        " (",
        incoming.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: incoming.map((req) => {
        const fromId = req.from.toString();
        const fromUser = userByPrincipal.get(fromId);
        const displayName = (fromUser == null ? void 0 : fromUser.displayName) ?? `${fromId.slice(0, 12)}…`;
        const avatarInitials = fromUser ? initials$1(fromUser.displayName) : fromId.slice(0, 2).toUpperCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-semibold bg-primary/10 text-primary", children: avatarInitials }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-foreground truncate min-w-0", children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-7 w-7 p-0 text-[oklch(0.65_0.15_145)] hover:text-[oklch(0.55_0.15_145)] border-[oklch(0.65_0.15_145/0.3)] hover:border-[oklch(0.65_0.15_145/0.5)]",
                    onClick: () => respond.mutate({ from: fromId, accept: true }),
                    disabled: respond.isPending,
                    "aria-label": t("accept"),
                    "data-ocid": `btn-accept-${fromId}`,
                    children: respond.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-7 w-7 p-0 text-destructive hover:text-destructive/80 border-destructive/30",
                    onClick: () => respond.mutate({ from: fromId, accept: false }),
                    disabled: respond.isPending,
                    "aria-label": t("reject"),
                    "data-ocid": `btn-reject-${fromId}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] })
            ]
          },
          fromId
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 border-t border-border mt-1" })
    ] }),
    outgoing.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
        t("pendingRequests"),
        " (",
        outgoing.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: outgoing.map((req) => {
        const toId = req.to.toString();
        const toUser = userByPrincipal.get(toId);
        const displayName = (toUser == null ? void 0 : toUser.displayName) ?? `${toId.slice(0, 12)}…`;
        const avatarInitials = toUser ? initials$1(toUser.displayName) : toId.slice(0, 2).toUpperCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-semibold bg-muted text-muted-foreground", children: avatarInitials }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm text-muted-foreground truncate min-w-0", children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: t("pendingRequests") })
            ]
          },
          toId
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 border-t border-border mt-1" })
    ] }),
    friends.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
        t("friends"),
        " (",
        friends.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "py-1", children: friends.map((user) => {
        const uid = user.principal.toString();
        const presence = presenceMap.get(uid) ?? null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-semibold bg-accent/15 text-accent", children: initials$1(user.displayName) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: presence, size: "sm" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate block", children: user.displayName }),
                presence && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: presence })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-smooth", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 w-7 p-0 text-muted-foreground hover:text-accent",
                    onClick: () => onSelectUser(user),
                    "aria-label": `${t("message")} ${user.displayName}`,
                    "data-ocid": `btn-message-friend-${uid.slice(0, 8)}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive",
                    onClick: () => removeFriend.mutate(uid),
                    disabled: removeFriend.isPending,
                    "aria-label": `${t("removePin").split(" ")[0]} ${user.displayName}`,
                    "data-ocid": `btn-remove-friend-${uid.slice(0, 8)}`,
                    children: removeFriend.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ]
          },
          uid
        );
      }) })
    ] })
  ] });
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
async function uploadFileDurable(file) {
  let capturedUpload = null;
  let capturedDownload = null;
  await createActorWithConfig(
    (canisterId, uploadFile, downloadFile, options) => {
      capturedUpload = uploadFile;
      capturedDownload = downloadFile;
      return createActor(canisterId, uploadFile, downloadFile, options);
    }
  );
  if (!capturedUpload || !capturedDownload) {
    throw new Error("Storage client not initialized");
  }
  const upload = capturedUpload;
  const download = capturedDownload;
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const blob = ExternalBlob.fromBytes(bytes);
  const hashBytes = await upload(blob);
  const resultBlob = await download(hashBytes);
  return resultBlob.getDirectURL();
}
function MessageInput({
  conversationId,
  recipientName
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [text, setText] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const textareaRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const { setTyping } = useSetTyping(conversationId);
  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    setTyping(val.length > 0);
  };
  const send = reactExports.useCallback(async () => {
    var _a2;
    const trimmed = text.trim();
    if (!trimmed || !actor || sending) return;
    setSending(true);
    setTyping(false);
    try {
      await actor.sendMessage(conversationId, trimmed);
      setText("");
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId.toString()]
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setSending(false);
      (_a2 = textareaRef.current) == null ? void 0 : _a2.focus();
    }
  }, [text, actor, sending, conversationId, queryClient, setTyping]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  const handleFileClick = () => {
    var _a2;
    (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
  };
  const handleFileChange = reactExports.useCallback(
    async (e) => {
      var _a2, _b;
      const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
      if (!file || !actor) return;
      e.target.value = "";
      setUploading(true);
      try {
        const fileId = await uploadFileDurable(file);
        const result = await actor.sendFileMessage(
          conversationId,
          fileId,
          file.name,
          file.type || "application/octet-stream",
          BigInt(file.size)
        );
        if (result.__kind__ === "err") {
          console.error("File send failed:", result.err);
          return;
        }
        queryClient.invalidateQueries({
          queryKey: ["messages", conversationId.toString()]
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } catch (err) {
        console.error("File upload error:", err);
      } finally {
        setUploading(false);
        (_b = textareaRef.current) == null ? void 0 : _b.focus();
      }
    },
    [actor, conversationId, queryClient]
  );
  const isBusy = actorFetching || sending || uploading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border bg-card px-4 py-3 flex items-end gap-2",
      "data-ocid": "message-input-bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            className: "hidden",
            onChange: handleFileChange,
            accept: "*/*",
            "data-ocid": "input-file-upload"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: handleFileClick,
            disabled: isBusy,
            className: "h-10 w-9 p-0 shrink-0 text-muted-foreground hover:text-accent transition-smooth",
            "aria-label": t("sendFile"),
            "data-ocid": "btn-attach-file",
            children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            ref: textareaRef,
            value: text,
            onChange: handleTextChange,
            onKeyDown: handleKeyDown,
            placeholder: `${t("typeAMessage").replace("…", "")} ${recipientName}…`,
            rows: 1,
            disabled: isBusy,
            className: "flex-1 resize-none min-h-[40px] max-h-32 bg-muted/50 border-input text-sm leading-relaxed py-2.5 px-3 focus-visible:ring-accent overflow-y-auto",
            style: { scrollbarWidth: "none" },
            "data-ocid": "input-message"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: send,
            disabled: !text.trim() || isBusy,
            className: "h-10 w-10 p-0 shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-40 transition-smooth",
            "aria-label": t("send"),
            "data-ocid": "btn-send-message",
            children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function UserDirectory({
  onSelectUser,
  activeConversationUserId
}) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const [search, setSearch] = reactExports.useState("");
  const sendFriendRequest = useSendFriendRequest();
  const { friends, incoming, outgoing } = useFriends();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1e4
  });
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const filtered = users.filter(
    (u) => u.principal.toString() !== myPrincipal && u.displayName.toLowerCase().includes(search.toLowerCase())
  );
  const userIds = reactExports.useMemo(
    () => filtered.map((u) => u.principal.toString()),
    [filtered]
  );
  const presenceMap = useBulkPresence(userIds);
  const friendSet = reactExports.useMemo(
    () => new Set(friends.map((f) => f.principal.toString())),
    [friends]
  );
  const pendingSet = reactExports.useMemo(() => {
    const all = [...incoming, ...outgoing];
    return new Set(
      all.map((r) => r.from.toString()).concat(all.map((r) => r.to.toString()))
    );
  }, [incoming, outgoing]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "user-directory", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: t("search"),
          className: "pl-9 h-9 bg-muted/50 border-input text-sm",
          "data-ocid": "input-user-search"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-1", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
    ] }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 py-12 px-4 text-center",
        "data-ocid": "user-directory-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Users,
            {
              className: "h-8 w-8 text-muted-foreground/40",
              strokeWidth: 1.5
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search ? t("noUsersYet") : t("noUsersYet") })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "py-1", children: filtered.map((user) => {
      const uid = user.principal.toString();
      const isActive = uid === activeConversationUserId;
      const presence = presenceMap.get(uid) ?? null;
      const isFriend = friendSet.has(uid);
      const isPending = !isFriend && pendingSet.has(uid);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelectUser(user),
          className: `w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth group ${isActive ? "bg-accent/15 border-l-2 border-accent" : "border-l-2 border-transparent hover:bg-muted/60"}`,
          "data-ocid": `user-item-${uid.slice(0, 8)}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarFallback,
                {
                  className: `text-xs font-semibold ${isActive ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"}`,
                  children: initials(user.displayName)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: presence, size: "sm" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium truncate text-foreground min-w-0", children: user.displayName }),
            isFriend ? null : isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs text-muted-foreground shrink-0",
                "data-ocid": `status-pending-${uid.slice(0, 8)}`,
                children: t("pendingRequests")
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-accent transition-smooth",
                onClick: (e) => {
                  e.stopPropagation();
                  sendFriendRequest.mutate(uid);
                },
                disabled: sendFriendRequest.isPending,
                "aria-label": `${t("addFriend")} ${user.displayName}`,
                "data-ocid": `btn-add-friend-${uid.slice(0, 8)}`,
                children: sendFriendRequest.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5" })
              }
            )
          ]
        }
      ) }, uid);
    }) }) })
  ] });
}
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React2.useRef(null);
    const itemMap = React2.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React2.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React2.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection2(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React2.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2
  ];
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index2) => array[(startIndex + index2) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function ChatPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [activeChat, setActiveChat] = reactExports.useState(null);
  const [showChat, setShowChat] = reactExports.useState(false);
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1e4
  });
  const handleSelectUser = reactExports.useCallback(
    async (user) => {
      if (!actor) return;
      const convId = await actor.getOrCreateConversation(user.principal);
      setActiveChat({ conversationId: convId, otherUser: user });
      setShowChat(true);
      queryClient.invalidateQueries({
        queryKey: ["messages", convId.toString()]
      });
    },
    [actor, queryClient]
  );
  const handleSelectConversation = reactExports.useCallback(
    (conversationId, otherUser) => {
      setActiveChat({ conversationId, otherUser });
      setShowChat(true);
    },
    []
  );
  const handleRefreshConversations = reactExports.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations", myPrincipal] });
  }, [queryClient, myPrincipal]);
  const handleBack = () => {
    setShowChat(false);
  };
  const activeUserId = activeChat == null ? void 0 : activeChat.otherUser.principal.toString();
  const partnerIds = activeUserId ? [activeUserId] : [];
  const partnerPresence = useBulkPresence(partnerIds);
  const partnerStatus = activeUserId ? partnerPresence.get(activeUserId) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "aside",
      {
        className: `
          w-full md:w-80 lg:w-[340px] shrink-0 border-r border-border bg-card flex flex-col
          ${showChat ? "hidden md:flex" : "flex"}
        `,
        "data-ocid": "left-panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "conversations", className: "flex flex-col h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-3 pb-0 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full bg-muted/60 h-9", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "conversations",
                className: "flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth",
                "data-ocid": "tab-conversations",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("conversations") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "users",
                className: "flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth",
                "data-ocid": "tab-users",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("users") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "friends",
                className: "flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth",
                "data-ocid": "tab-friends",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("friends") })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsContent,
            {
              value: "conversations",
              className: "flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ConversationList,
                {
                  users,
                  onSelectConversation: handleSelectConversation,
                  activeConversationId: activeChat == null ? void 0 : activeChat.conversationId
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsContent,
            {
              value: "users",
              className: "flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                UserDirectory,
                {
                  onSelectUser: handleSelectUser,
                  activeConversationUserId: activeUserId
                }
              ) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsContent,
            {
              value: "friends",
              className: "flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FriendsList, { onSelectUser: handleSelectUser }) })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "main",
      {
        className: `
          flex-1 flex flex-col overflow-hidden bg-background
          ${showChat ? "flex" : "hidden md:flex"}
        `,
        "data-ocid": "chat-panel",
        children: activeChat ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "h-14 border-b border-border flex items-center gap-3 px-4 shrink-0 relative overflow-hidden",
              style: {
                background: "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(var(--primary) / 0.03) 100%)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 left-0 right-0 h-[2px] opacity-50",
                    style: { background: "var(--gradient-accent)" },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: handleBack,
                    className: "md:hidden h-8 w-8 p-0 -ml-1 hover:text-primary hover:bg-primary/8",
                    "aria-label": t("backToConversations"),
                    "data-ocid": "btn-back",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white shadow-sm", children: activeChat.otherUser.displayName.slice(0, 2).toUpperCase() }),
                    partnerStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: partnerStatus, size: "sm" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground truncate leading-tight", children: activeChat.otherUser.displayName }),
                    partnerStatus && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground leading-none", children: partnerStatus })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChatWindow,
            {
              conversationId: activeChat.conversationId,
              otherUser: activeChat.otherUser,
              onRefreshConversations: handleRefreshConversations
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MessageInput,
            {
              conversationId: activeChat.conversationId,
              recipientName: activeChat.otherUser.displayName
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
      }
    )
  ] });
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  ChatPage as default
};
