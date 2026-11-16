/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const cn = globalThis, Xi = cn.ShadowRoot && (cn.ShadyCSS === void 0 || cn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Yi = Symbol(), Fs = /* @__PURE__ */ new WeakMap();
let Mr = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== Yi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Xi && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = Fs.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Fs.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dl = (e) => new Mr(typeof e == "string" ? e : e + "", void 0, Yi), _r = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new Mr(n, e, Yi);
}, Tl = (e, t) => {
  if (Xi) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = cn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, Us = Xi ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return Dl(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Hl, defineProperty: Rl, getOwnPropertyDescriptor: Bl, getOwnPropertyNames: Fl, getOwnPropertySymbols: Ul, getPrototypeOf: jl } = Object, Lt = globalThis, js = Lt.trustedTypes, Wl = js ? js.emptyScript : "", oi = Lt.reactiveElementPolyfillSupport, ke = (e, t) => e, gn = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Wl : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let n = e;
  switch (t) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, Qi = (e, t) => !Hl(e, t), Ws = { attribute: !0, type: String, converter: gn, reflect: !1, useDefault: !1, hasChanged: Qi };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Lt.litPropertyMetadata ?? (Lt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Yt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Ws) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && Rl(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Bl(this.prototype, t) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: s, set(r) {
      const a = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ws;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ke("elementProperties"))) return;
    const t = jl(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ke("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ke("properties"))) {
      const n = this.properties, i = [...Fl(n), ...Ul(n)];
      for (const s of i) this.createProperty(s, n[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0) for (const [i, s] of n) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const s = this._$Eu(n, i);
      s !== void 0 && this._$Eh.set(s, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) n.unshift(Us(s));
    } else t !== void 0 && n.push(Us(t));
    return n;
  }
  static _$Eu(t, n) {
    const i = n.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((n) => n(this));
  }
  addController(t) {
    var n;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((n = t.hostConnected) == null || n.call(t));
  }
  removeController(t) {
    var n;
    (n = this._$EO) == null || n.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const i of n.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Tl(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostConnected) == null ? void 0 : i.call(n);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostDisconnected) == null ? void 0 : i.call(n);
    });
  }
  attributeChangedCallback(t, n, i) {
    this._$AK(t, i);
  }
  _$ET(t, n) {
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : gn).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : gn;
      this._$Em = s;
      const c = l.fromAttribute(n, a.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? Qi)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, n, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? n ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (n = void 0), this._$AL.set(t, n)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, r] of s) {
        const { wrapped: a } = r, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
      }
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(n)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((n) => this._$ET(n, this[n]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Yt.elementStyles = [], Yt.shadowRootOptions = { mode: "open" }, Yt[ke("elementProperties")] = /* @__PURE__ */ new Map(), Yt[ke("finalized")] = /* @__PURE__ */ new Map(), oi == null || oi({ ReactiveElement: Yt }), (Lt.reactiveElementVersions ?? (Lt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis, qs = (e) => e, wn = Me.trustedTypes, Zs = wn ? wn.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Sr = "$lit$", It = `lit$${Math.random().toFixed(9).slice(2)}$`, Ar = "?" + It, ql = `<${Ar}>`, Wt = document, Pe = () => Wt.createComment(""), Ce = (e) => e === null || typeof e != "object" && typeof e != "function", Ji = Array.isArray, Zl = (e) => Ji(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ri = `[ 	
\f\r]`, he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ks = /-->/g, Gs = />/g, Ht = RegExp(`>|${ri}(?:([^\\s"'>=/]+)(${ri}*=${ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xs = /'/g, Ys = /"/g, Er = /^(?:script|style|textarea|title)$/i, Ir = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), v = Ir(1), _ = Ir(2), lt = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Qs = /* @__PURE__ */ new WeakMap(), Rt = Wt.createTreeWalker(Wt, 129);
function Pr(e, t) {
  if (!Ji(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Zs !== void 0 ? Zs.createHTML(t) : t;
}
const Kl = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = he;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, u = r.exec(l), u !== null); ) p = r.lastIndex, r === he ? u[1] === "!--" ? r = Ks : u[1] !== void 0 ? r = Gs : u[2] !== void 0 ? (Er.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Ht) : u[3] !== void 0 && (r = Ht) : r === Ht ? u[0] === ">" ? (r = s ?? he, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? Ht : u[3] === '"' ? Ys : Xs) : r === Ys || r === Xs ? r = Ht : r === Ks || r === Gs ? r = he : (r = Ht, s = void 0);
    const f = r === Ht && e[a + 1].startsWith("/>") ? " " : "";
    o += r === he ? l + ql : d >= 0 ? (i.push(c), l.slice(0, d) + Sr + l.slice(d) + It + f) : l + It + (d === -2 ? a : f);
  }
  return [Pr(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Le {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, u] = Kl(t, n);
    if (this.el = Le.createElement(c, i), Rt.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Rt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Sr)) {
          const p = u[r++], f = s.getAttribute(d).split(It), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? Xl : m[1] === "?" ? Yl : m[1] === "@" ? Ql : zn }), s.removeAttribute(d);
        } else d.startsWith(It) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (Er.test(s.tagName)) {
          const d = s.textContent.split(It), p = d.length - 1;
          if (p > 0) {
            s.textContent = wn ? wn.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(d[f], Pe()), Rt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[p], Pe());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ar) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(It, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += It.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = Wt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function ie(e, t, n = e, i) {
  var r, a;
  if (t === lt) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Ce(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = ie(e, s._$AS(e, t.values), s, i)), t;
}
class Gl {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? Wt).importNode(n, !0);
    Rt.currentNode = s;
    let o = Rt.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new ts(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new Jl(o, this, t)), this._$AV.push(c), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = Rt.nextNode(), r++);
    }
    return Rt.currentNode = Wt, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let ts = class Cr {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, s) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = ie(this, t, n), Ce(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== lt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zl(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && Ce(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Wt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Le.createElement(Pr(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Gl(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = Qs.get(t.strings);
    return n === void 0 && Qs.set(t.strings, n = new Le(t)), n;
  }
  k(t) {
    Ji(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Cr(this.O(Pe()), this.O(Pe()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = qs(t).nextSibling;
      qs(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class zn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, s, o) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = y;
  }
  _$AI(t, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = ie(this, t, n, 0), r = !Ce(t) || t !== this._$AH && t !== lt, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = ie(this, a[i + l], n, l), c === lt && (c = this._$AH[l]), r || (r = !Ce(c) || c !== this._$AH[l]), c === y ? t = y : t !== y && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Xl extends zn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class Yl extends zn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
let Ql = class extends zn {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = ie(this, t, n, 0) ?? y) === lt) return;
    const i = this._$AH, s = t === y && i !== y || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== y && (i === y || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class Jl {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ie(this, t);
  }
}
const ai = Me.litHtmlPolyfillSupport;
ai == null || ai(Le, ts), (Me.litHtmlVersions ?? (Me.litHtmlVersions = [])).push("3.3.3");
const tc = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new ts(t.insertBefore(Pe(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = globalThis;
let ee = class extends Yt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var n;
    const t = super.createRenderRoot();
    return (n = this.renderOptions).renderBefore ?? (n.renderBefore = t.firstChild), t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = tc(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return lt;
  }
};
var kr;
ee._$litElement$ = !0, ee.finalized = !0, (kr = Ft.litElementHydrateSupport) == null || kr.call(Ft, { LitElement: ee });
const li = Ft.litElementPolyfillSupport;
li == null || li({ LitElement: ee });
(Ft.litElementVersions ?? (Ft.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ec = { attribute: !0, type: String, converter: gn, reflect: !1, hasChanged: Qi }, nc = (e = ec, t, n) => {
  const { kind: i, metadata: s } = n;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(n.name, e), i === "accessor") {
    const { name: r } = n;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(r, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, e, a), a;
    } };
  }
  if (i === "setter") {
    const { name: r } = n;
    return function(a) {
      const l = this[r];
      t.call(this, a), this.requestUpdate(r, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Mt(e) {
  return (t, n) => typeof n == "object" ? nc(e, t, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function R(e) {
  return Mt({ ...e, state: !0, attribute: !1 });
}
function K() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function es(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const Ut = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, ic = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, sc = { ...Ut, role: "power_in" }, oc = { ...Ut, role: "power_out" }, rc = ["on", "off", "auto"], ns = (e) => rc.includes(e), ci = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), ac = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [{ role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 }],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [ci("on"), ci("off"), ci("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Ut],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Ut, ic, sc, oc]
}, is = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, lc = { climate_sensor: "any" };
function wt(e) {
  const t = e.props, n = ac[t.kind];
  if (t.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
  if (t.kind === "equipment") {
    const i = !!t.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Lr(e) {
  return new Set(wt(e).map((t) => t.role));
}
function Nn(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !Lr(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const c = { ...s, bindings: l };
    if (Object.keys(l).length === 0 && delete c.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...d } = s.props;
      c.props = d;
    }
    return { ...e, devices: e.devices.map((u) => u === s ? c : u) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function cc(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a), s = wt(e).filter((a) => a.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const o = s.filter((a) => !!n[a.role]);
  return (lc[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function dc(e) {
  const t = wt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const uc = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function Ii(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !ns(t) ? n : `${n}|${uc(i[t])}`;
}
function pc(e, t, n) {
  const i = Ii(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && wt(s).some((o) => Ii(s, o.role) === i));
}
function fc(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of wt(e)) {
    const s = ns(i) ? Ii(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function Vn(e) {
  if (!e.bindings) return e;
  const t = Lr(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Or = (e) => e === "wall_switch" || e === "smart_button", Dn = (e) => e === "wall_switch" || e === "smart_button" || e === "valve", Oe = (e) => e === "wall" ? "wall" : "free", hc = [100, 125, 150], ss = "mdi:cube-outline", Js = ["single", "double", "hold"], mc = {
  bearing: 400
}, dn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function zr(e = K(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function to(e) {
  return {
    id: K(),
    name: e,
    schemaVersion: 2,
    revision: 0,
    levels: [zr()]
  };
}
const os = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  wall_switch: ["wall"],
  valve: ["wall", "free"],
  leak_sensor: ["free", "wall"],
  smart_button: ["wall", "free"],
  socket: ["wall"],
  equipment: ["free", "wall"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, se = 90, Nr = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function zt(e, t) {
  switch (e) {
    case "ceiling_light":
      return { kind: e, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: e, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: e, zoneAngle: t === "free" ? 360 : 110, zoneRange: 5e3 };
    case "exhaust_fan":
      return { kind: e, diameter: 100 };
    case "equipment":
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: ss, label: "" };
    case "wall_switch":
    case "valve":
      return { kind: e, autoByDoubleToggle: !1, windowSec: 3 };
    case "smart_button":
      return {
        kind: e,
        separateOff: !1,
        autoEnabled: !1,
        on: { slot: 0, event: "single" },
        off: { slot: 0, event: "hold" },
        auto: { slot: 0, event: "double" }
      };
    default:
      return { kind: e };
  }
}
const gc = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: ss
};
function wc(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : gc[String(n)] ?? ss;
  return { ...e, props: { ...i, icon: s } };
}
function bc(e) {
  var i;
  if (e.props.kind !== "switch") return e;
  const t = (i = e.bindings) == null ? void 0 : i.action, n = Oe(e.placement.mode);
  return t ? { ...e, props: zt("smart_button", n), bindings: { on: t } } : { ...e, props: zt("wall_switch", n) };
}
const Vr = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function yc(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = Vr(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function vc(e) {
  const t = e.props.kind;
  if (!Dn(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(zt(t, Oe(e.placement.mode)))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? yc(r, o) : s === "windowSec" ? Vr(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function $c(e) {
  if (e.props.kind !== "climate_sensor" || !("zoneIds" in e.props)) return e;
  const { zoneIds: t, ...n } = e.props;
  return { ...e, props: n };
}
function xc(e) {
  if (!Dn(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function kc(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => Vn($c(xc(vc(bc(wc(n)))))));
  return t.some((n, i) => n !== e.devices[i]) ? { ...e, devices: t } : e;
}
function z(e, t) {
  return { x: e.x + t.x, y: e.y + t.y };
}
function I(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function E(e, t) {
  return { x: e.x * t, y: e.y * t };
}
function H(e, t) {
  return e.x * t.x + e.y * t.y;
}
function et(e, t) {
  return e.x * t.y - e.y * t.x;
}
function Dr(e) {
  return Math.hypot(e.x, e.y);
}
function L(e, t) {
  return Dr(I(t, e));
}
function Tn(e) {
  const t = Dr(e);
  return t === 0 ? { x: 0, y: 0 } : E(e, 1 / t);
}
function X(e) {
  return { x: e.y, y: -e.x };
}
function Tr(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function pt(e, t, n, i) {
  const s = et(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = et(I(n, e), i) / s;
  return z(e, E(t, o));
}
function Hn(e, t, n) {
  const i = I(n, t), s = H(i, i);
  return s === 0 ? 0 : H(I(e, t), i) / s;
}
function ht(e, t, n) {
  const i = I(n, t), s = H(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, H(I(e, t), i) / s));
  return L(e, z(t, E(i, o)));
}
function oe(e, t) {
  let n = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > e.y != r.y > e.y && e.x < (r.x - o.x) * (e.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function mt(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const i = e[n], s = e[(n + 1) % e.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
let Nt = class {
  constructor(t, n) {
    this.next = null, this.key = t, this.data = n, this.left = null, this.right = null;
  }
};
function Mc(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function Pt(e, t, n) {
  const i = new Nt(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = n(e, t.key);
    if (r < 0) {
      if (t.left === null) break;
      if (n(e, t.left.key) < 0) {
        const a = t.left;
        if (t.left = a.right, a.right = t, t = a, t.left === null) break;
      }
      o.left = t, o = t, t = t.left;
    } else if (r > 0) {
      if (t.right === null) break;
      if (n(e, t.right.key) > 0) {
        const a = t.right;
        if (t.right = a.left, a.left = t, t = a, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, o.left = t.right, t.left = i.right, t.right = i.left, t;
}
function di(e, t, n, i) {
  const s = new Nt(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = Pt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function eo(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = Pt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function _c(e, t, n) {
  return t === null ? e : (e === null || (t = Pt(e.key, t, n), t.left = e), t);
}
function Pi(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && Pi(e.left, o, !1, i, s), e.right && Pi(e.right, o, !0, i, s);
  }
}
class rs {
  constructor(t = Mc) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = di(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new Nt(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Pt(t, this._root, s), r = s(t, o.key);
    return r === 0 ? this._root = o : (r < 0 ? (i.left = o.left, i.right = o, o.left = null) : r > 0 && (i.right = o.right, i.left = o, o.right = null), this._size++, this._root = i), this._root;
  }
  /**
   * @param  {Key} key
   * @return {Node|null}
   */
  remove(t) {
    this._root = this._remove(t, this._root, this._comparator);
  }
  /**
   * Deletes i from the tree if it's there
   */
  _remove(t, n, i) {
    let s;
    return n === null ? null : (n = Pt(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = Pt(t, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = Pt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
    }
    return null;
  }
  /**
   * Find without splaying
   */
  findStatic(t) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const s = i(t, n.key);
      if (s === 0) return n;
      s < 0 ? n = n.left : n = n.right;
    }
    return null;
  }
  find(t) {
    return this._root && (this._root = Pt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
  }
  contains(t) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const s = i(t, n.key);
      if (s === 0) return !0;
      s < 0 ? n = n.left : n = n.right;
    }
    return !1;
  }
  forEach(t, n) {
    let i = this._root;
    const s = [];
    let o = !1;
    for (; !o; )
      i !== null ? (s.push(i), i = i.left) : s.length !== 0 ? (i = s.pop(), t.call(n, i), i = i.right) : o = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(t, n, i, s) {
    const o = [], r = this._comparator;
    let a = this._root, l;
    for (; o.length !== 0 || a; )
      if (a)
        o.push(a), a = a.left;
      else {
        if (a = o.pop(), l = r(a.key, n), l > 0)
          break;
        if (r(a.key, t) >= 0 && i.call(s, a))
          return this;
        a = a.right;
      }
    return this;
  }
  /**
   * Returns array of keys
   */
  keys() {
    const t = [];
    return this.forEach(({ key: n }) => {
      t.push(n);
    }), t;
  }
  /**
   * Returns array of all the data in the nodes
   */
  values() {
    const t = [];
    return this.forEach(({ data: n }) => {
      t.push(n);
    }), t;
  }
  min() {
    return this._root ? this.minNode(this._root).key : null;
  }
  max() {
    return this._root ? this.maxNode(this._root).key : null;
  }
  minNode(t = this._root) {
    if (t) for (; t.left; ) t = t.left;
    return t;
  }
  maxNode(t = this._root) {
    if (t) for (; t.right; ) t = t.right;
    return t;
  }
  /**
   * Returns node at given index
   */
  at(t) {
    let n = this._root, i = !1, s = 0;
    const o = [];
    for (; !i; )
      if (n)
        o.push(n), n = n.left;
      else if (o.length > 0) {
        if (n = o.pop(), s === t) return n;
        s++, n = n.right;
      } else i = !0;
    return null;
  }
  next(t) {
    let n = this._root, i = null;
    if (t.right) {
      for (i = t.right; i.left; ) i = i.left;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(t.key, n.key);
      if (o === 0) break;
      o < 0 ? (i = n, n = n.left) : n = n.right;
    }
    return i;
  }
  prev(t) {
    let n = this._root, i = null;
    if (t.left !== null) {
      for (i = t.left; i.right; ) i = i.right;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(t.key, n.key);
      if (o === 0) break;
      o < 0 ? n = n.left : (i = n, n = n.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Ac(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && Oi(t, n, 0, s - 1, o), this._root === null)
      this._root = Ci(t, n, 0, s), this._size = s;
    else {
      const r = Ec(
        this.toList(),
        Sc(t, n),
        o
      );
      s = this._size + s, this._root = Li({ head: r }, 0, s);
    }
    return this;
  }
  isEmpty() {
    return this._root === null;
  }
  get size() {
    return this._size;
  }
  get root() {
    return this._root;
  }
  toString(t = (n) => String(n.key)) {
    const n = [];
    return Pi(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = eo(t, this._root, s);
    s(t, n) < 0 ? r = di(n, i, r, s) : o = di(n, i, o, s), this._root = _c(o, r, s);
  }
  split(t) {
    return eo(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function Ci(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], a = t[o], l = new Nt(r, a);
    return l.left = Ci(e, t, n, o), l.right = Ci(e, t, o + 1, i), l;
  }
  return null;
}
function Sc(e, t) {
  const n = new Nt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new Nt(e[s], t[s]);
  return i.next = null, n.next;
}
function Ac(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new Nt(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function Li(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = Li(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = Li(e, s + 1, n), r;
  }
  return null;
}
function Ec(e, t, n) {
  const i = new Nt(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function Oi(e, t, n, i, s) {
  if (n >= i) return;
  const o = e[n + i >> 1];
  let r = n - 1, a = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(e[r], o) < 0);
    do
      a--;
    while (s(e[a], o) > 0);
    if (r >= a) break;
    let l = e[r];
    e[r] = e[a], e[a] = l, l = t[r], t[r] = t[a], t[a] = l;
  }
  Oi(e, t, n, a, s), Oi(e, t, a + 1, i, s);
}
const xt = 11102230246251565e-32, Y = 134217729, Ic = (3 + 8 * xt) * xt;
function ui(e, t, n, i, s) {
  let o, r, a, l, c = t[0], u = i[0], d = 0, p = 0;
  u > c == u > -c ? (o = c, c = t[++d]) : (o = u, u = i[++p]);
  let f = 0;
  if (d < e && p < n)
    for (u > c == u > -c ? (r = c + o, a = o - (r - c), c = t[++d]) : (r = u + o, a = o - (r - u), u = i[++p]), o = r, a !== 0 && (s[f++] = a); d < e && p < n; )
      u > c == u > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d]) : (r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p]), o = r, a !== 0 && (s[f++] = a);
  for (; d < e; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d], o = r, a !== 0 && (s[f++] = a);
  for (; p < n; )
    r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p], o = r, a !== 0 && (s[f++] = a);
  return (o !== 0 || f === 0) && (s[f++] = o), f;
}
function Pc(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function S(e) {
  return new Float64Array(e);
}
const Cc = (3 + 16 * xt) * xt, Lc = (2 + 12 * xt) * xt, Oc = (9 + 64 * xt) * xt * xt, Xt = S(4), no = S(8), io = S(12), so = S(16), tt = S(4);
function zc(e, t, n, i, s, o, r) {
  let a, l, c, u, d, p, f, m, b, w, g, $, x, M, k, A, P, O;
  const V = e - s, U = n - s, N = t - o, D = i - o;
  M = V * D, p = Y * V, f = p - (p - V), m = V - f, p = Y * D, b = p - (p - D), w = D - b, k = m * w - (M - f * b - m * b - f * w), A = N * U, p = Y * N, f = p - (p - N), m = N - f, p = Y * U, b = p - (p - U), w = U - b, P = m * w - (A - f * b - m * b - f * w), g = k - P, d = k - g, Xt[0] = k - (g + d) + (d - P), $ = M + g, d = $ - M, x = M - ($ - d) + (g - d), g = x - A, d = x - g, Xt[1] = x - (g + d) + (d - A), O = $ + g, d = O - $, Xt[2] = $ - (O - d) + (g - d), Xt[3] = O;
  let j = Pc(4, Xt), ot = Lc * r;
  if (j >= ot || -j >= ot || (d = e - V, a = e - (V + d) + (d - s), d = n - U, c = n - (U + d) + (d - s), d = t - N, l = t - (N + d) + (d - o), d = i - D, u = i - (D + d) + (d - o), a === 0 && l === 0 && c === 0 && u === 0) || (ot = Oc * r + Ic * Math.abs(j), j += V * u + D * a - (N * c + U * l), j >= ot || -j >= ot)) return j;
  M = a * D, p = Y * a, f = p - (p - a), m = a - f, p = Y * D, b = p - (p - D), w = D - b, k = m * w - (M - f * b - m * b - f * w), A = l * U, p = Y * l, f = p - (p - l), m = l - f, p = Y * U, b = p - (p - U), w = U - b, P = m * w - (A - f * b - m * b - f * w), g = k - P, d = k - g, tt[0] = k - (g + d) + (d - P), $ = M + g, d = $ - M, x = M - ($ - d) + (g - d), g = x - A, d = x - g, tt[1] = x - (g + d) + (d - A), O = $ + g, d = O - $, tt[2] = $ - (O - d) + (g - d), tt[3] = O;
  const yt = ui(4, Xt, 4, tt, no);
  M = V * u, p = Y * V, f = p - (p - V), m = V - f, p = Y * u, b = p - (p - u), w = u - b, k = m * w - (M - f * b - m * b - f * w), A = N * c, p = Y * N, f = p - (p - N), m = N - f, p = Y * c, b = p - (p - c), w = c - b, P = m * w - (A - f * b - m * b - f * w), g = k - P, d = k - g, tt[0] = k - (g + d) + (d - P), $ = M + g, d = $ - M, x = M - ($ - d) + (g - d), g = x - A, d = x - g, tt[1] = x - (g + d) + (d - A), O = $ + g, d = O - $, tt[2] = $ - (O - d) + (g - d), tt[3] = O;
  const At = ui(yt, no, 4, tt, io);
  M = a * u, p = Y * a, f = p - (p - a), m = a - f, p = Y * u, b = p - (p - u), w = u - b, k = m * w - (M - f * b - m * b - f * w), A = l * c, p = Y * l, f = p - (p - l), m = l - f, p = Y * c, b = p - (p - c), w = c - b, P = m * w - (A - f * b - m * b - f * w), g = k - P, d = k - g, tt[0] = k - (g + d) + (d - P), $ = M + g, d = $ - M, x = M - ($ - d) + (g - d), g = x - A, d = x - g, tt[1] = x - (g + d) + (d - A), O = $ + g, d = O - $, tt[2] = $ - (O - d) + (g - d), tt[3] = O;
  const Vl = ui(At, io, 4, tt, so);
  return so[Vl - 1];
}
function Nc(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= Cc * c ? l : -zc(e, t, n, i, s, o, c);
}
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(8);
S(8);
S(8);
S(4);
S(8);
S(8);
S(16);
S(12);
S(192);
S(192);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(8);
S(8);
S(8);
S(8);
S(8);
S(8);
S(8);
S(8);
S(8);
S(4);
S(4);
S(4);
S(8);
S(16);
S(16);
S(16);
S(32);
S(32);
S(48);
S(64);
S(1152);
S(1152);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(4);
S(24);
S(24);
S(24);
S(24);
S(24);
S(24);
S(24);
S(24);
S(24);
S(24);
S(1152);
S(1152);
S(1152);
S(1152);
S(1152);
S(2304);
S(2304);
S(3456);
S(5760);
S(8);
S(8);
S(8);
S(16);
S(24);
S(48);
S(48);
S(96);
S(192);
S(384);
S(384);
S(384);
S(768);
S(96);
S(96);
S(96);
S(1152);
const me = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, zi = (e, t) => {
  if (t.ur.x < e.ll.x || e.ur.x < t.ll.x || t.ur.y < e.ll.y || e.ur.y < t.ll.y) return null;
  const n = e.ll.x < t.ll.x ? t.ll.x : e.ll.x, i = e.ur.x < t.ur.x ? e.ur.x : t.ur.x, s = e.ll.y < t.ll.y ? t.ll.y : e.ll.y, o = e.ur.y < t.ur.y ? e.ur.y : t.ur.y;
  return {
    ll: {
      x: n,
      y: s
    },
    ur: {
      x: i,
      y: o
    }
  };
};
let Ct = Number.EPSILON;
Ct === void 0 && (Ct = Math.pow(2, -52));
const Vc = Ct * Ct, oo = (e, t) => {
  if (-Ct < e && e < Ct && -Ct < t && t < Ct)
    return 0;
  const n = e - t;
  return n * n < Vc * e * t ? 0 : e < t ? -1 : 1;
};
class Dc {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new ro(), this.yRounder = new ro();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class ro {
  constructor() {
    this.tree = new rs(), this.round(0);
  }
  // Note: this can rounds input values backwards or forwards.
  //       You might ask, why not restrict this to just rounding
  //       forwards? Wouldn't that allow left endpoints to always
  //       remain left endpoints during splitting (never change to
  //       right). No - it wouldn't, because we snap intersections
  //       to endpoints (to establish independence from the segment
  //       angle for t-intersections).
  round(t) {
    const n = this.tree.add(t), i = this.tree.prev(n);
    if (i !== null && oo(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && oo(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const ze = new Dc(), un = (e, t) => e.x * t.y - e.y * t.x, Hr = (e, t) => e.x * t.x + e.y * t.y, ao = (e, t, n) => {
  const i = Nc(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, bn = (e) => Math.sqrt(Hr(e, e)), Tc = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return un(s, i) / bn(s) / bn(i);
}, Hc = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return Hr(s, i) / bn(s) / bn(i);
}, lo = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, co = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, Rc = (e, t, n, i) => {
  if (t.x === 0) return co(n, i, e.x);
  if (i.x === 0) return co(e, t, n.x);
  if (t.y === 0) return lo(n, i, e.y);
  if (i.y === 0) return lo(e, t, n.y);
  const s = un(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = un(o, t) / s, a = un(o, i) / s, l = e.x + a * t.x, c = n.x + r * i.x, u = e.y + a * t.y, d = n.y + r * i.y, p = (l + c) / 2, f = (u + d) / 2;
  return {
    x: p,
    y: f
  };
};
class at {
  // for ordering sweep events in the sweep event queue
  static compare(t, n) {
    const i = at.comparePoints(t.point, n.point);
    return i !== 0 ? i : (t.point !== n.point && t.link(n), t.isLeft !== n.isLeft ? t.isLeft ? 1 : -1 : Ot.compare(t.segment, n.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(t, n) {
    return t.x < n.x ? -1 : t.x > n.x ? 1 : t.y < n.y ? -1 : t.y > n.y ? 1 : 0;
  }
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(t, n) {
    t.events === void 0 ? t.events = [this] : t.events.push(this), this.point = t, this.isLeft = n;
  }
  link(t) {
    if (t.point === this.point)
      throw new Error("Tried to link already linked events");
    const n = t.point.events;
    for (let i = 0, s = n.length; i < s; i++) {
      const o = n[i];
      this.point.events.push(o), o.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const t = this.point.events.length;
    for (let n = 0; n < t; n++) {
      const i = this.point.events[n];
      if (i.segment.consumedBy === void 0)
        for (let s = n + 1; s < t; s++) {
          const o = this.point.events[s];
          o.consumedBy === void 0 && i.otherSE.point.events === o.otherSE.point.events && i.segment.consume(o.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const t = [];
    for (let n = 0, i = this.point.events.length; n < i; n++) {
      const s = this.point.events[n];
      s !== this && !s.segment.ringOut && s.segment.isInResult() && t.push(s);
    }
    return t;
  }
  /**
   * Returns a comparator function for sorting linked events that will
   * favor the event that will give us the smallest left-side angle.
   * All ring construction starts as low as possible heading to the right,
   * so by always turning left as sharp as possible we'll get polygons
   * without uncessary loops & holes.
   *
   * The comparator function has a compute cache such that it avoids
   * re-computing already-computed values.
   */
  getLeftmostComparator(t) {
    const n = /* @__PURE__ */ new Map(), i = (s) => {
      const o = s.otherSE;
      n.set(s, {
        sine: Tc(this.point, t.point, o.point),
        cosine: Hc(this.point, t.point, o.point)
      });
    };
    return (s, o) => {
      n.has(s) || i(s), n.has(o) || i(o);
      const {
        sine: r,
        cosine: a
      } = n.get(s), {
        sine: l,
        cosine: c
      } = n.get(o);
      return r >= 0 && l >= 0 ? a < c ? 1 : a > c ? -1 : 0 : r < 0 && l < 0 ? a < c ? -1 : a > c ? 1 : 0 : l < r ? -1 : l > r ? 1 : 0;
    };
  }
}
let Bc = 0;
class Ot {
  /* This compare() function is for ordering segments in the sweep
   * line tree, and does so according to the following criteria:
   *
   * Consider the vertical line that lies an infinestimal step to the
   * right of the right-more of the two left endpoints of the input
   * segments. Imagine slowly moving a point up from negative infinity
   * in the increasing y direction. Which of the two segments will that
   * point intersect first? That segment comes 'before' the other one.
   *
   * If neither segment would be intersected by such a line, (if one
   * or more of the segments are vertical) then the line to be considered
   * is directly on the right-more of the two left inputs.
   */
  static compare(t, n) {
    const i = t.leftSE.point.x, s = n.leftSE.point.x, o = t.rightSE.point.x, r = n.rightSE.point.x;
    if (r < i) return 1;
    if (o < s) return -1;
    const a = t.leftSE.point.y, l = n.leftSE.point.y, c = t.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < c) return 1;
      if (l > a && l > c) return -1;
      const d = t.comparePoint(n.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const p = n.comparePoint(t.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (a < l && a < u) return -1;
      if (a > l && a > u) return 1;
      const d = n.comparePoint(t.leftSE.point);
      if (d !== 0) return d;
      const p = t.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
    if (o < r) {
      const d = n.comparePoint(t.rightSE.point);
      if (d !== 0) return d;
    }
    if (o > r) {
      const d = t.comparePoint(n.rightSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
    }
    if (o !== r) {
      const d = c - a, p = o - i, f = u - l, m = r - s;
      if (d > p && f < m) return 1;
      if (d < p && f > m) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++Bc, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = at.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new at(s, !0), c = new at(o, !1);
    return new Ot(l, c, [i], [r]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(t) {
    this.rightSE = t, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const t = this.leftSE.point.y, n = this.rightSE.point.y;
    return {
      ll: {
        x: this.leftSE.point.x,
        y: t < n ? t : n
      },
      ur: {
        x: this.rightSE.point.x,
        y: t > n ? t : n
      }
    };
  }
  /* A vector from the left point to the right */
  vector() {
    return {
      x: this.rightSE.point.x - this.leftSE.point.x,
      y: this.rightSE.point.y - this.leftSE.point.y
    };
  }
  isAnEndpoint(t) {
    return t.x === this.leftSE.point.x && t.y === this.leftSE.point.y || t.x === this.rightSE.point.x && t.y === this.rightSE.point.y;
  }
  /* Compare this segment with a point.
   *
   * A point P is considered to be colinear to a segment if there
   * exists a distance D such that if we travel along the segment
   * from one * endpoint towards the other a distance D, we find
   * ourselves at point P.
   *
   * Return value indicates:
   *
   *   1: point lies above the segment (to the left of vertical)
   *   0: point is colinear to segment
   *  -1: point lies below the segment (to the right of vertical)
   */
  comparePoint(t) {
    if (this.isAnEndpoint(t)) return 0;
    const n = this.leftSE.point, i = this.rightSE.point, s = this.vector();
    if (n.x === i.x)
      return t.x === n.x ? 0 : t.x < n.x ? 1 : -1;
    const o = (t.y - n.y) / s.y, r = n.x + o * s.x;
    if (t.x === r) return 0;
    const a = (t.x - n.x) / s.x, l = n.y + a * s.y;
    return t.y === l ? 0 : t.y < l ? -1 : 1;
  }
  /**
   * Given another segment, returns the first non-trivial intersection
   * between the two segments (in terms of sweep line ordering), if it exists.
   *
   * A 'non-trivial' intersection is one that will cause one or both of the
   * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:
   *
   *   * endpoint of segA with endpoint of segB --> trivial
   *   * endpoint of segA with point along segB --> non-trivial
   *   * endpoint of segB with point along segA --> non-trivial
   *   * point along segA with point along segB --> non-trivial
   *
   * If no non-trivial intersection exists, return null
   * Else, return null.
   */
  getIntersection(t) {
    const n = this.bbox(), i = t.bbox(), s = zi(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, c = me(n, a) && this.comparePoint(a) === 0, u = me(i, o) && t.comparePoint(o) === 0, d = me(n, l) && this.comparePoint(l) === 0, p = me(i, r) && t.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? l : null;
    if (u)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return p && r.x === a.x && r.y === a.y ? null : a;
    if (p && d) return null;
    if (p) return r;
    if (d) return l;
    const f = Rc(o, this.vector(), a, t.vector());
    return f === null || !me(s, f) ? null : ze.round(f.x, f.y);
  }
  /**
   * Split the given segment into multiple segments on the given points.
   *  * Each existing segment will retain its leftSE and a new rightSE will be
   *    generated for it.
   *  * A new segment will be generated which will adopt the original segment's
   *    rightSE, and a new leftSE will be generated for it.
   *  * If there are more than two points given to split on, new segments
   *    in the middle will be generated with new leftSE and rightSE's.
   *  * An array of the newly generated SweepEvents will be returned.
   *
   * Warning: input array of points is modified
   */
  split(t) {
    const n = [], i = t.events !== void 0, s = new at(t, !0), o = new at(t, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new Ot(s, r, this.rings.slice(), this.windings.slice());
    return at.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), at.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const t = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = t, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let n = 0, i = this.windings.length; n < i; n++)
      this.windings[n] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(t) {
    let n = this, i = t;
    for (; n.consumedBy; ) n = n.consumedBy;
    for (; i.consumedBy; ) i = i.consumedBy;
    const s = Ot.compare(n, i);
    if (s !== 0) {
      if (s > 0) {
        const o = n;
        n = i, i = o;
      }
      if (n.prev === i) {
        const o = n;
        n = i, i = o;
      }
      for (let o = 0, r = i.rings.length; o < r; o++) {
        const a = i.rings[o], l = i.windings[o], c = n.rings.indexOf(a);
        c === -1 ? (n.rings.push(a), n.windings.push(l)) : n.windings[c] += l;
      }
      i.rings = null, i.windings = null, i.consumedBy = n, i.leftSE.consumedBy = n.leftSE, i.rightSE.consumedBy = n.rightSE;
    }
  }
  /* The first segment previous segment chain that is in the result */
  prevInResult() {
    return this._prevInResult !== void 0 ? this._prevInResult : (this.prev ? this.prev.isInResult() ? this._prevInResult = this.prev : this._prevInResult = this.prev.prevInResult() : this._prevInResult = null, this._prevInResult);
  }
  beforeState() {
    if (this._beforeState !== void 0) return this._beforeState;
    if (!this.prev) this._beforeState = {
      rings: [],
      windings: [],
      multiPolys: []
    };
    else {
      const t = this.prev.consumedBy || this.prev;
      this._beforeState = t.afterState();
    }
    return this._beforeState;
  }
  afterState() {
    if (this._afterState !== void 0) return this._afterState;
    const t = this.beforeState();
    this._afterState = {
      rings: t.rings.slice(0),
      windings: t.windings.slice(0),
      multiPolys: []
    };
    const n = this._afterState.rings, i = this._afterState.windings, s = this._afterState.multiPolys;
    for (let a = 0, l = this.rings.length; a < l; a++) {
      const c = this.rings[a], u = this.windings[a], d = n.indexOf(c);
      d === -1 ? (n.push(c), i.push(u)) : i[d] += u;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const c = n[a], u = c.poly;
      if (r.indexOf(u) === -1)
        if (c.isExterior) o.push(u);
        else {
          r.indexOf(u) === -1 && r.push(u);
          const d = o.indexOf(c.poly);
          d !== -1 && o.splice(d, 1);
        }
    }
    for (let a = 0, l = o.length; a < l; a++) {
      const c = o[a].multiPoly;
      s.indexOf(c) === -1 && s.push(c);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (ct.type) {
      case "union": {
        const i = t.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < n.length ? (i = t.length, s = n.length) : (i = n.length, s = t.length), this._isInResult = s === ct.numMultiPolys && i < s;
        break;
      }
      case "xor": {
        const i = Math.abs(t.length - n.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (s) => s.length === 1 && s[0].isSubject;
        this._isInResult = i(t) !== i(n);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${ct.type}`);
    }
    return this._isInResult;
  }
}
class uo {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = ze.round(t[0][0], t[0][1]);
    this.bbox = {
      ll: {
        x: s.x,
        y: s.y
      },
      ur: {
        x: s.x,
        y: s.y
      }
    };
    let o = s;
    for (let r = 1, a = t.length; r < a; r++) {
      if (typeof t[r][0] != "number" || typeof t[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let l = ze.round(t[r][0], t[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(Ot.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Ot.fromRing(o, s, this));
  }
  getSweepEvents() {
    const t = [];
    for (let n = 0, i = this.segments.length; n < i; n++) {
      const s = this.segments[n];
      t.push(s.leftSE), t.push(s.rightSE);
    }
    return t;
  }
}
class Fc {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new uo(t[0], this, !0), this.bbox = {
      ll: {
        x: this.exteriorRing.bbox.ll.x,
        y: this.exteriorRing.bbox.ll.y
      },
      ur: {
        x: this.exteriorRing.bbox.ur.x,
        y: this.exteriorRing.bbox.ur.y
      }
    }, this.interiorRings = [];
    for (let i = 1, s = t.length; i < s; i++) {
      const o = new uo(t[i], this, !1);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.interiorRings.push(o);
    }
    this.multiPoly = n;
  }
  getSweepEvents() {
    const t = this.exteriorRing.getSweepEvents();
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const s = this.interiorRings[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class po {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    try {
      typeof t[0][0][0] == "number" && (t = [t]);
    } catch {
    }
    this.polys = [], this.bbox = {
      ll: {
        x: Number.POSITIVE_INFINITY,
        y: Number.POSITIVE_INFINITY
      },
      ur: {
        x: Number.NEGATIVE_INFINITY,
        y: Number.NEGATIVE_INFINITY
      }
    };
    for (let i = 0, s = t.length; i < s; i++) {
      const o = new Fc(t[i], this);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.polys.push(o);
    }
    this.isSubject = n;
  }
  getSweepEvents() {
    const t = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class yn {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, a = o.leftSE, l = o.rightSE;
      const c = [a], u = a.point, d = [];
      for (; r = a, a = l, c.push(a), a.point !== u; )
        for (; ; ) {
          const p = a.getAvailableLinkedEvents();
          if (p.length === 0) {
            const b = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${b.x}, ${b.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (p.length === 1) {
            l = p[0].otherSE;
            break;
          }
          let f = null;
          for (let b = 0, w = d.length; b < w; b++)
            if (d[b].point === a.point) {
              f = b;
              break;
            }
          if (f !== null) {
            const b = d.splice(f)[0], w = c.splice(b.index);
            w.unshift(w[0].otherSE), n.push(new yn(w.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: a.point
          });
          const m = a.getLeftmostComparator(r);
          l = p.sort(m)[0].otherSE;
          break;
        }
      n.push(new yn(c));
    }
    return n;
  }
  constructor(t) {
    this.events = t;
    for (let n = 0, i = t.length; n < i; n++)
      t[n].segment.ringOut = this;
    this.poly = null;
  }
  getGeom() {
    let t = this.events[0].point;
    const n = [t];
    for (let c = 1, u = this.events.length - 1; c < u; c++) {
      const d = this.events[c].point, p = this.events[c + 1].point;
      ao(d, t, p) !== 0 && (n.push(d), t = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    ao(i, t, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, a = this.isExteriorRing() ? n.length : -1, l = [];
    for (let c = r; c != a; c += o) l.push([n[c].x, n[c].y]);
    return l;
  }
  isExteriorRing() {
    if (this._isExteriorRing === void 0) {
      const t = this.enclosingRing();
      this._isExteriorRing = t ? !t.isExteriorRing() : !0;
    }
    return this._isExteriorRing;
  }
  enclosingRing() {
    return this._enclosingRing === void 0 && (this._enclosingRing = this._calcEnclosingRing()), this._enclosingRing;
  }
  /* Returns the ring that encloses this one, if any */
  _calcEnclosingRing() {
    let t = this.events[0];
    for (let s = 1, o = this.events.length; s < o; s++) {
      const r = this.events[s];
      at.compare(t, r) > 0 && (t = r);
    }
    let n = t.segment.prevInResult(), i = n ? n.prevInResult() : null;
    for (; ; ) {
      if (!n) return null;
      if (!i) return n.ringOut;
      if (i.ringOut !== n.ringOut)
        return i.ringOut.enclosingRing() !== n.ringOut ? n.ringOut : n.ringOut.enclosingRing();
      n = i.prevInResult(), i = n ? n.prevInResult() : null;
    }
  }
}
class fo {
  constructor(t) {
    this.exteriorRing = t, t.poly = this, this.interiorRings = [];
  }
  addInterior(t) {
    this.interiorRings.push(t), t.poly = this;
  }
  getGeom() {
    const t = [this.exteriorRing.getGeom()];
    if (t[0] === null) return null;
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const s = this.interiorRings[n].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
}
class Uc {
  constructor(t) {
    this.rings = t, this.polys = this._composePolys(t);
  }
  getGeom() {
    const t = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
  _composePolys(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.poly)
        if (o.isExteriorRing()) n.push(new fo(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new fo(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class jc {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Ot.compare;
    this.queue = t, this.tree = new rs(n), this.segments = [];
  }
  process(t) {
    const n = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(n), i;
    const s = t.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!s) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, a, l;
    for (; a === void 0; )
      o = this.tree.prev(o), o === null ? a = null : o.key.consumedBy === void 0 && (a = o.key);
    for (; l === void 0; )
      r = this.tree.next(r), r === null ? l = null : r.key.consumedBy === void 0 && (l = r.key);
    if (t.isLeft) {
      let c = null;
      if (a) {
        const d = a.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (c = d), !a.isAnEndpoint(d))) {
          const p = this._splitSafely(a, d);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      let u = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (u = d), !l.isAnEndpoint(d))) {
          const p = this._splitSafely(l, d);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      if (c !== null || u !== null) {
        let d = null;
        c === null ? d = u : u === null ? d = c : d = at.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(d);
        for (let f = 0, m = p.length; f < m; f++)
          i.push(p[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const c = a.getIntersection(l);
        if (c !== null) {
          if (!a.isAnEndpoint(c)) {
            const u = this._splitSafely(a, c);
            for (let d = 0, p = u.length; d < p; d++)
              i.push(u[d]);
          }
          if (!l.isAnEndpoint(c)) {
            const u = this._splitSafely(l, c);
            for (let d = 0, p = u.length; d < p; d++)
              i.push(u[d]);
          }
        }
      }
      this.tree.remove(n);
    }
    return i;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(t, n) {
    this.tree.remove(t);
    const i = t.rightSE;
    this.queue.remove(i);
    const s = t.split(n);
    return s.push(i), t.consumedBy === void 0 && this.tree.add(t), s;
  }
}
const ho = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Wc = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class qc {
  run(t, n, i) {
    ct.type = t, ze.reset();
    const s = [new po(n, !0)];
    for (let d = 0, p = i.length; d < p; d++)
      s.push(new po(i[d], !1));
    if (ct.numMultiPolys = s.length, ct.type === "difference") {
      const d = s[0];
      let p = 1;
      for (; p < s.length; )
        zi(s[p].bbox, d.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (ct.type === "intersection")
      for (let d = 0, p = s.length; d < p; d++) {
        const f = s[d];
        for (let m = d + 1, b = s.length; m < b; m++)
          if (zi(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new rs(at.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const f = s[d].getSweepEvents();
      for (let m = 0, b = f.length; m < b; m++)
        if (o.insert(f[m]), o.size > ho)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new jc(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const f = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > ho)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Wc)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let f = 0, m = p.length; f < m; f++) {
        const b = p[f];
        b.consumedBy === void 0 && o.insert(b);
      }
      a = o.size, l = o.pop();
    }
    ze.reset();
    const c = yn.factory(r.segments);
    return new Uc(c).getGeom();
  }
}
const ct = new qc(), Zc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("union", e, n);
}, Kc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("intersection", e, n);
}, Gc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("xor", e, n);
}, Xc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("difference", e, n);
};
var Rr = {
  union: Zc,
  intersection: Kc,
  xor: Gc,
  difference: Xc
};
const Br = 3, Yc = 1e-6;
function Rn(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function q(e, t) {
  const n = Rn(e, t);
  return { x: n.x, y: n.y };
}
function Gt(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function Fr(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Tn(I(t, e)), len: L(e, t), leftOff: o, rightOff: r };
}
function J(e, t) {
  return Fr(q(e, t.a), q(e, t.b), t.thickness, t.baseline);
}
function Dt(e, t) {
  const n = I(t, e.a);
  return { t: H(n, e.dir), side: H(n, X(e.dir)) };
}
function mo(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Qt = (e) => z(e.p, E(X(e.u), e.offL)), Jt = (e) => I(e.p, E(X(e.u), e.offR));
function Bt(e, t, n) {
  return e !== null && L(e, t) <= n;
}
function Qc(e) {
  const t = [];
  for (const n of e.walls) {
    const i = J(e, n);
    if (i.len < 1e-9) continue;
    const s = X(i.dir);
    t.push({
      wall: n,
      f: i,
      c: {
        al: z(i.a, E(s, i.leftOff)),
        ar: I(i.a, E(s, i.rightOff)),
        bl: z(i.b, E(s, i.leftOff)),
        br: I(i.b, E(s, i.rightOff))
      }
    });
  }
  return t;
}
function Jc(e, t) {
  const n = t.f, i = X(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = H(I(s.far, n.a), i) >= 0 ? z(n.a, E(i, n.leftOff)) : I(n.a, E(i, n.rightOff)), a = Br * Math.max(s.body.wall.thickness, t.wall.thickness), l = pt(Qt(s), s.u, r, n.dir), c = pt(Jt(s), s.u, r, n.dir);
    Bt(l, s.p, a) && (s.body.c[s.leftKey] = l), Bt(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function td(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Br * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = pt(Jt(o), o.u, Qt(r), r.u);
    Bt(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = ed(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = I(r, o), l = et(a, I(t, o)), c = et(a, I(s.far, o));
    l * c < 0 && Ni(s, [t]);
  }
}
function Ni(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function ed(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(et(o.u, r.u)) > 1e-9 || H(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], c = pt(Jt(o), o.u, Qt(l), l.u), u = pt(Qt(r), r.u, Qt(l), l.u);
        if (!Bt(c, t, n) || !Bt(u, t, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, Ni(o, [t, d, u]);
      } else {
        const l = e[(s - 1 + i) % i], c = pt(Qt(r), r.u, Jt(l), l.u), u = pt(Jt(o), o.u, Jt(l), l.u);
        if (!Bt(u, t, n) || !Bt(c, t, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, Ni(r, [u, d, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function as(e) {
  const t = Qc(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(mo(r, "a")), r.wall.b === i.id && s.push(mo(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Jc(s, o) : s.length >= 2 && td(s, { x: i.x, y: i.y });
  }
  return t;
}
function Ur(e) {
  const t = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of as(e))
    for (const [s, o, r] of n) {
      const a = i.c[s];
      t.push({ pt: a, wallId: i.wall.id, side: o, end: r, offset: H(I(a, i.f.a), i.f.dir) });
    }
  return t;
}
function jr(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function Bn(e) {
  return new Map(as(e).map((t) => [t.wall.id, jr(t)]));
}
function go(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(z(s, E(I(o, s), r / (r - a))));
  }
  return n;
}
function ls(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of as(e)) {
    const s = jr(i), o = e.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && t(u)).sort((u, d) => u.offset - d.offset), r = (u) => H(I(u, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const u of o)
      a.push([l, u.offset]), l = Math.max(l, u.offset + u.width);
    a.push([l, 1 / 0]);
    const c = [];
    for (const [u, d] of a) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = go(p, (f) => r(f) - u)), d < 1 / 0 && (p = go(p, (f) => d - r(f))), p.length >= 3 && Math.abs(mt(p)) > Yc && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const Vi = (e) => [e.map((t) => [t.x, t.y])];
function Wr(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function qr(e, t) {
  return Zr(t ? [...ls(e).values()].flat() : [...Bn(e).values()]);
}
function Zr(e) {
  const t = e.map(Vi);
  if (t.length === 0) return [];
  let n;
  try {
    n = Rr.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Wr));
}
const re = 1e-6, vn = ["door", "gate", "wicket"], Kr = (e) => e === "opening", Gr = (e) => e.passesLight ?? Kr(e.kind), Xr = (e) => e === "opening", Yr = (e) => e.passesPir ?? Xr(e.kind);
function Qr(e, t) {
  return e.offset < t.offset + t.width - re && t.offset < e.offset + e.width - re;
}
function Fn(e, t, n, i, s) {
  const o = Gt(e, t);
  return o === null || i <= 0 || n < -re || n + i > o + re ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Qr(r, { offset: n, width: i }));
}
function de(e, t) {
  return { ...e, openings: t };
}
function nd(e, t, n, i, s, o = {}) {
  const r = s ?? dn[n], a = i - r / 2;
  if (!Fn(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: K(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return vn.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: de(e, [...e.openings, l]), openingId: l.id };
}
function Jr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Fn(e, i.wallId, n, i.width, t) ? e : je(de(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s)));
}
function id(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Fn(e, i.wallId, i.offset, n, t) ? e : je(de(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s)));
}
function sd(e, t) {
  return vn.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function od(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return je(de(e, e.openings.map((s) => s.id === t ? i(s) : s)));
}
function ta(e, t) {
  return je(de(e, e.openings.filter((n) => n.id !== t)));
}
function je(e) {
  return de(e, e.openings.map((t) => {
    const n = Gt(e, t.wallId), i = n === null || t.offset < -re || t.offset + t.width > n + re || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Qr(t, s));
    return { ...t, invalid: i };
  }));
}
const $n = 1e-6;
function ea(e, t) {
  return t.mode !== "none" && os[e.kind].includes(t.mode);
}
function na(e, t, n) {
  if (n.mode === "none" || !ea(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -se || i > se)) return !1;
  const s = Gt(e, n.wallId);
  return s !== null && n.offset >= -$n && n.offset <= s + $n;
}
function _t(e, t) {
  return { ...e, devices: t };
}
function wo(e, t, n, i) {
  if (!na(e, t, n)) return { level: e, deviceId: null };
  const s = { id: K(), name: i, placement: n, props: t, invalid: !1 };
  return { level: _t(e, [...e.devices, s]), deviceId: s.id };
}
function ia(e, t) {
  const n = { id: K(), name: t, placement: { mode: "none" }, props: zt("equipment", "free"), invalid: !1 };
  return { level: _t(e, [...e.devices, n]), id: n.id };
}
const rd = ["power", "power_in", "power_out", "voltage"];
function ad(e) {
  if (e.props.kind !== "equipment") return null;
  const t = e.bindings ?? {}, n = rd.some((i) => !!t[i]);
  return t.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const ue = (e) => (e == null ? void 0 : e.props.kind) === "equipment" && !!e.props.inverter, sa = (e) => e.props.kind !== "equipment" || !!e.props.controllable;
function oa(e, t, n) {
  const i = { ...e };
  return n ? i[t] = !0 : delete i[t], i;
}
function ra(e, t, n) {
  const i = e.devices.find((l) => l.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return e;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const a = Vn({ ...i, props: oa(i.props, "inverter", n), bindings: r });
  return _t(e, e.devices.map((l) => l === i ? a : l));
}
function Un(e, t, n) {
  const i = e.devices.find((o) => o.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return e;
  const s = { ...i, props: oa(i.props, "controllable", n) };
  return _t(e, e.devices.map((o) => o === i ? s : o));
}
function aa(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = zt("motion_sensor", Oe(t)), s = zt("motion_sensor", Oe(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function xn(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !na(e, s.props, n)) return e;
  const o = aa(s.props, s.placement.mode, n.mode);
  return la(_t(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function We(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? _t(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Vn({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function ld(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !Or(i.props.kind) || i.props.kind === n) return e;
  const s = zt(n, Oe(i.placement.mode));
  if (!ea(s, i.placement)) return e;
  const o = Vn({ ...i, props: s });
  return _t(e, e.devices.map((r) => r === i ? o : r));
}
function cd(e, t) {
  return _t(e, e.devices.filter((n) => n.id !== t));
}
function la(e) {
  return _t(e, e.devices.map((t) => {
    if (t.placement.mode !== "wall") return t.invalid ? { ...t, invalid: !1 } : t;
    const n = Gt(e, t.placement.wallId), i = n === null || t.placement.offset < -$n || t.placement.offset > n + $n;
    return t.invalid === i ? t : { ...t, invalid: i };
  }));
}
function ca(e) {
  const t = [];
  for (const n of qr(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function Di(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!oe(t, s)) continue;
    const o = Math.abs(mt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const pi = 1e-3;
function da(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(mt(e)) - Math.abs(mt(t))) > pi ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= pi && Math.abs(n.y - i.y) <= pi));
}
const ua = 2, bo = Math.ceil(360 / ua), yo = 1e-4, dd = 1e-9, vo = 1e-9, ud = {
  light: Gr,
  motion: Yr
};
function pa(e, t) {
  const n = [];
  for (const i of Zr([...ls(e, ud[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function cs(e, t, n) {
  return t.filter(([i, s]) => ht(e, i, s) <= n);
}
function fi(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function pd(e, t, n) {
  const i = cs(e, t, n), s = [];
  for (let w = 0; w < bo; w++) s.push(-Math.PI + 2 * Math.PI * w / bo);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (L(e, g) > o) continue;
      const $ = Math.atan2(g.y - e.y, g.x - e.x);
      s.push(fi($ - yo), fi($), fi($ + yo));
    }
  s.sort((w, g) => w - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    a[$] = w.x - e.x, l[$] = w.y - e.y, c[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const d = [], p = [];
  let f = NaN;
  for (const w of s) {
    if (w === f) continue;
    f = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let x = n, M = -1;
    for (let P = 0; P < r; P++) {
      const O = g * u[P] - $ * c[P];
      if (Math.abs(O) < 1e-12) continue;
      const V = (a[P] * u[P] - l[P] * c[P]) / O;
      if (!(V > dd && V < x)) continue;
      const U = (a[P] * $ - l[P] * g) / O;
      U < -vo || U > 1 + vo || (x = V, M = P);
    }
    const k = { x: e.x + g * x, y: e.y + $ * x }, A = d.length;
    if (!(A > 0 && d[A - 1].x === k.x && d[A - 1].y === k.y)) {
      if (M >= 0 && A >= 2 && p[A - 1] === M && p[A - 2] === M) {
        d[A - 1] = k;
        continue;
      }
      d.push(k), p.push(M);
    }
  }
  const m = d[0], b = d[d.length - 1];
  return d.length > 1 && m.x === b.x && m.y === b.y && d.pop(), d;
}
const fd = 32, $o = 128;
function kn(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function kt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function ds(e) {
  return (e % 360 + 360) % 360;
}
function fa(e) {
  return (e % 360 + 540) % 360 - 180;
}
function ha(e, t, n, i) {
  const s = e.walls.find((c) => c.id === t);
  if (!s) return null;
  let o;
  try {
    o = J(e, s);
  } catch {
    return null;
  }
  const r = X(o.dir), a = n === "left" ? r : E(r, -1), l = n === "left" ? o.leftOff : o.rightOff;
  return { pt: z(z(o.a, E(o.dir, i)), E(a, l)), normal: a };
}
function Ne(e, t, n, i) {
  var s;
  return ((s = ha(e, t, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Q(e, t) {
  const n = t.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: kn(n.rotation) };
  const i = ha(e, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = t.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: z(i.pt, E(s, r)), dir: X(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? kn(kt(s) + n.aim) : s, normal: s };
}
function xo(e, t, n, i, s, o) {
  const r = e.nodes.find((l) => l.id === n);
  if (!r || r.host) return !1;
  let a = !1;
  for (const l of e.walls) {
    if (l === t || l.a !== n && l.b !== n) continue;
    let c;
    try {
      c = J(e, l);
    } catch {
      continue;
    }
    const u = l.a === n ? c.dir : E(c.dir, -1);
    if (Math.abs(et(i, u)) < 1e-9 && H(i, u) < 0) {
      if ((H(X(c.dir), s) > 0 ? c.leftOff : c.rightOff) > o + 1e-6) return !1;
      a = !0;
    } else if (H(u, s) > 1e-9) return !1;
  }
  return a;
}
function us(e, t, n, i) {
  var U;
  if (t.kind !== "equipment" || n.mode !== "wall") return n;
  const s = e.walls.find((N) => N.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = J(e, s);
  } catch {
    return n;
  }
  const r = Ur(e), a = r.filter((N) => N.wallId === n.wallId && N.side === n.side), l = a.find((N) => N.end === "a"), c = a.find((N) => N.end === "b");
  if (!l || !c) return n;
  const u = X(o.dir), d = n.side === "left" ? u : E(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, f = xo(e, s, s.a, o.dir, d, p) ? -1 / 0 : l.offset, m = xo(e, s, s.b, E(o.dir, -1), d, p) ? 1 / 0 : c.offset, b = (N) => H(I(N, o.a), o.dir), w = [];
  for (const N of e.nodes)
    if (((U = N.host) == null ? void 0 : U.wallId) === s.id)
      for (const D of e.walls) {
        const j = D.a === N.id ? "a" : D.b === N.id ? "b" : null, ot = j && e.nodes.find((At) => At.id === (j === "a" ? D.b : D.a));
        if (!ot || (H(I(ot, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const yt = r.filter((At) => At.wallId === D.id && At.end === j).map((At) => b(At.pt));
        yt.length && w.push([Math.min(...yt), Math.max(...yt)]);
      }
  w.sort((N, D) => N[0] - D[0]);
  const g = [];
  let $ = f;
  for (const [N, D] of w) {
    const j = Math.min(N, m);
    j > $ && g.push([$, j]), $ = Math.max($, D);
  }
  m > $ && g.push([$, m]), g.length === 0 && g.push([f, m]);
  const x = ([N, D]) => Math.max(0, N - n.offset, n.offset - D), [M, k] = g.reduce((N, D) => x(D) < x(N) ? D : N), A = (t.shape === "circle" ? t.diameter : t.width) / 2, P = M + A, O = k - A;
  let V = n.offset;
  return P > O ? V = (M + k) / 2 : V <= P + i ? V = P : V >= O - i && (V = O), V = Math.max(0, Math.min(o.len, V)), Math.abs(V - n.offset) < 1e-9 ? n : { ...n, offset: V };
}
function ma(e, t) {
  const n = [];
  for (let i = 0; i < $o; i++) n.push(z(e, E(kn(360 * i / $o), t)));
  return n;
}
function ko(e, t, n, i) {
  if (n >= 360) return ma(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * fd)), o = kt(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(z(e, E(kn(o + n * a / s), i)));
  return r;
}
const hd = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function jn(e) {
  return hd[e] ?? null;
}
const md = (e) => jn(e.kind) !== null;
function gd(e, t) {
  const n = t.props;
  if (!md(n)) return null;
  const i = Q(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? ko(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? ko(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? ma(i.pt, n.poolRadius) : null;
  }
}
function wd(e) {
  return e.normal ? z(e.pt, e.normal) : e.pt;
}
function Mo(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function bd(e, t, n) {
  const i = I(t, e);
  for (const [s, o] of n) {
    const r = I(o, s), a = I(s, e), l = et(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const c = et(a, r) / l, u = et(a, i) / l;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const _o = 0.5, yd = 3, vd = 1e-4;
function $d(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  const s = wd(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => Mo(k, n) || cs(k, n, _o).length > 0;
  if (!r(s)) return s;
  const a = J(e, e.walls.find((k) => k.id === o.wallId)), l = i.normal, c = (k) => Math.abs(H(I(k, i.pt), l)) <= vd, u = ([k, A]) => E(z(k, A), 0.5), d = n.filter((k) => c(k[0]) && c(k[1]) && L(k[0], k[1]) > 1e-9 && !Mo(z(u(k), E(l, _o)), n)), p = (k) => H(I(k, a.a), a.dir), f = ([k, A]) => Math.max(0, Math.min(p(k), p(A)) - o.offset, o.offset - Math.max(p(k), p(A))), m = Math.min(...d.map(f)), b = d.filter((k) => f(k) <= m + 1e-6).map((k) => z(u(k), l)), w = (k) => b.some((A) => !bd(k, A, n)), g = yd * Math.max(...e.walls.map((k) => k.thickness)) + 2, $ = [];
  for (const [k, A] of n) {
    const P = I(A, k), O = I(k, s), V = et(a.dir, P);
    if (Math.abs(V) < 1e-12) continue;
    const U = et(O, a.dir) / V;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const N = et(O, P) / V, D = L(k, A) / Math.abs(V);
    $.push(N - D, N + D);
  }
  const x = o.offset <= a.len / 2 ? 1 : -1, M = $.filter((k) => Math.abs(k) <= g).sort((k, A) => Math.abs(k) - Math.abs(A) || Math.sign(A) * x - Math.sign(k) * x);
  for (const k of M) {
    const A = z(s, E(a.dir, k));
    if (!r(A) && w(A)) return A;
  }
  return null;
}
const xd = 1 / Math.cos(ua / 2 * (Math.PI / 180)), So = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function kd(e, t, n = pa) {
  const i = gd(e, t), s = jn(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = $d(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((d) => L(d, r))) * xd, l = cs(r, o, a);
  if (l.length === 0) return [i];
  const c = pd(r, l, a);
  let u;
  try {
    u = Rr.intersection(Vi(So(i)), Vi(So(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(Wr));
}
function Md(e, t, n, i) {
  const s = Q(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, H(I(n, s.pt), s.dir)));
    return L(z(s.pt, E(s.dir, a)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return L(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return L(s.pt, n) <= i;
  if (o.shape === "circle") return L(s.pt, n) <= o.diameter / 2 + i;
  const r = I(n, s.pt);
  return Math.abs(H(r, s.dir)) <= o.width / 2 + i && Math.abs(H(r, X(s.dir))) <= o.depth / 2 + i;
}
function ga(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Md(e, i[o], t, n)) return i[o].id;
  return null;
}
const _d = 60;
function Ti(e, t, n) {
  if (!Nr.has(t.props.kind)) return null;
  const i = Q(e, t);
  return i ? { from: i.pt, to: z(i.pt, E(i.dir, _d / n)) } : null;
}
function wa(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function Sd(e, t, n, i) {
  const s = t.placement, o = Q(e, t);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = kt(I(n, o.pt)), a = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: ds(a(r)) };
  const l = fa(r - kt(o.normal)), c = Math.max(-se, Math.min(se, a(l)));
  return wa(s, c);
}
const Ad = 1, Mn = 1, Ao = 1e-6, Ed = 1e-9, Id = 1e-6, Pd = 1;
function ps(e, t) {
  switch (t.kind) {
    case "free":
      return { x: t.x, y: t.y };
    case "node": {
      const n = e.nodes.find((i) => i.id === t.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = Gt(e, t.wallId);
      return n === null ? null : Ne(e, t.wallId, t.side, Math.max(0, Math.min(n, t.offset)));
    }
  }
}
function nt(e, t) {
  const n = t.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => ps(e, i) ?? { x: i.x, y: i.y });
}
function fs(e, t) {
  const n = nt(e, t);
  return n.length < 3 ? null : Math.round(Math.abs(mt(n)) / 1e5) / 10;
}
function xe(e, t, n) {
  const i = et(I(t, e), I(n, e));
  return Math.abs(i) <= Ed * L(e, t) * L(e, n) ? 0 : Math.sign(i);
}
const Xe = (e, t, n) => H(I(t, e), I(n, e)) <= 0;
function ba(e, t, n, i) {
  const s = xe(n, i, e), o = xe(n, i, t), r = xe(e, t, n), a = xe(e, t, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && Xe(n, e, t) || a === 0 && Xe(i, e, t) || s === 0 && Xe(e, n, i) || o === 0 && Xe(t, n, i);
}
function Cd(e) {
  const t = [];
  for (const n of e) (t.length === 0 || L(t[t.length - 1], n) > Ao) && t.push(n);
  for (; t.length > 1 && L(t[0], t[t.length - 1]) <= Ao; ) t.pop();
  return t;
}
function _n(e) {
  const t = Cd(e), n = t.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = t[i], o = t[(i + 1) % n], r = t[(i + 2) % n];
    if (xe(s, o, r) === 0 && H(I(o, s), I(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && ba(s, o, t[a], t[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function ya(e, t) {
  const n = t.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : ps(e, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = Gt(e, o.wallId);
    return r !== null && (o.offset < -Mn || o.offset > r + Mn);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = nt(e, t);
  return Math.abs(mt(s)) < Pd || _n(s) ? "crossing" : null;
}
function pe(e, t) {
  return oe(t, e) || e.some((n, i) => ht(t, n, e[(i + 1) % e.length]) <= Ad);
}
const va = (e, t) => !(e.zoneBlacklist ?? []).includes(t);
function Ld(e, t) {
  const n = Q(e, t);
  return n ? e.zones.filter((i) => pe(nt(e, i), n.pt)).map((i) => ({ zone: i, participates: va(t, i.id) })) : [];
}
function $a(e, t) {
  const n = e.zones.find((o) => o.id === t);
  if (!n) return [];
  const i = nt(e, n), s = [];
  for (const o of e.devices) {
    const r = Q(e, o);
    r && pe(i, r.pt) && s.push({ device: o, participates: va(o, t) });
  }
  return s;
}
function Od(e) {
  const t = e.length;
  if (t === 0) return { x: 0, y: 0 };
  const n = mt(e);
  if (Math.abs(n) > Id) {
    let i = 0, s = 0;
    for (let r = 0; r < t; r++) {
      const a = e[r], l = e[(r + 1) % t], c = a.x * l.y - l.x * a.y;
      i += (a.x + l.x) * c, s += (a.y + l.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (oe(o, e)) return o;
  }
  return {
    x: e.reduce((i, s) => i + s.x, 0) / t,
    y: e.reduce((i, s) => i + s.y, 0) / t
  };
}
const hi = 32;
function Eo(e, t) {
  let n = 1 / 0;
  for (const i of t) for (let s = 0; s < i.length; s++) n = Math.min(n, ht(e, i[s], i[(s + 1) % i.length]));
  return n;
}
function xa(e) {
  const t = e.zones.map((s) => nt(e, s)), n = t.map((s) => Math.abs(mt(s))), i = /* @__PURE__ */ new Map();
  return e.zones.forEach((s, o) => {
    const r = t[o];
    if (r.length < 3) return;
    const a = t.filter((b, w) => w !== o && b.length >= 3 && n[w] < n[o] && b.every((g) => pe(r, g))), l = Od(r);
    if (a.length === 0) {
      i.set(s.id, l);
      return;
    }
    const c = r.map((b) => b.x), u = r.map((b) => b.y), d = Math.min(...c), p = Math.min(...u), f = Math.max(Math.max(...c) - d, Math.max(...u) - p) / hi;
    let m = null;
    for (let b = d + f / 2; b < d + f * hi; b += f)
      for (let w = p + f / 2; w < p + f * hi; w += f) {
        const g = { x: b, y: w };
        if (!oe(g, r) || a.some((x) => oe(g, x))) continue;
        const $ = Math.min(Eo(g, [r]), Eo(g, a));
        (!m || $ > m.d) && (m = { p: g, d: $ });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? l);
  }), i;
}
const hs = 3, ae = (e, t) => ({ ...e, zones: t }), Ve = (e, t, n) => ae(e, e.zones.map((i) => i === t ? n : i)), ms = (e) => ({ kind: "free", x: e.x, y: e.y, lost: !0 }), ka = (e, t) => e.length === t.length && e.every((n, i) => n.x === t[i].x && n.y === t[i].y);
function zd(e, t) {
  if (e.x !== t.x || e.y !== t.y) return !1;
  switch (e.kind) {
    case "free":
      return t.kind === "free" && e.lost === t.lost;
    case "node":
      return t.kind === "node" && e.nodeId === t.nodeId;
    case "wall":
      return t.kind === "wall" && e.wallId === t.wallId && e.offset === t.offset && e.side === t.side;
  }
}
function Nd(e, t) {
  return e.kind === "walls" ? t.kind === "walls" && e.broken === t.broken && e.seed.x === t.seed.x && e.seed.y === t.seed.y && ka(e.outline, t.outline) : t.kind === "polygon" && e.vertices.length === t.vertices.length && e.vertices.every((n, i) => zd(n, t.vertices[i]));
}
function Ma(e, t) {
  return e.id === t.id && e.name === t.name && e.automation === t.automation && e.invalid === t.invalid && Nd(e.shape, t.shape);
}
function Vd(e, t) {
  if (t.kind === "free") return t;
  const n = ps(e, t);
  return n ? n.x === t.x && n.y === t.y ? t : { ...t, x: n.x, y: n.y } : ms(t);
}
function _a(e, t) {
  const n = t.shape, i = n.vertices.map((s) => Vd(e, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...t, shape: { kind: "polygon", vertices: i } } : t;
}
function Dd(e, t, n) {
  const i = e.shape, s = Di(t, i.seed);
  return !s || n.some((o) => da(o, s)) ? i.broken ? e : { ...e, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && ka(s, i.outline) ? e : { ...e, shape: { ...i, outline: s, broken: !1 } });
}
function Sa(e, t) {
  const n = ya(e, t) !== null;
  return t.invalid === n ? t : { ...t, invalid: n };
}
const gs = (e, t) => Sa(e, _a(e, t));
function Td(e) {
  const t = e.zones;
  if (t.length === 0) return e;
  const n = t.some((o) => o.shape.kind === "walls") ? ca(e) : [], i = [], s = t.map((o) => Sa(
    e,
    o.shape.kind === "walls" ? Dd(o, n, i) : _a(e, o)
  ));
  return s.some((o, r) => o !== t[r]) ? ae(e, s) : e;
}
function Hd(e, t) {
  const n = e.zones, i = t.zones, s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && Ma(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? e : ae(e, i) : s.some((o, r) => o !== n[r]) ? ae(e, s) : e;
}
function Rd(e, t, n) {
  const i = ca(e), s = Di(i, t);
  if (!s) return { level: e, zoneId: null, existing: !1 };
  for (const r of e.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const a = Di(i, r.shape.seed);
    if (a && da(a, s)) return { level: e, zoneId: r.id, existing: !0 };
  }
  const o = { id: K(), name: n, shape: { kind: "walls", seed: { x: t.x, y: t.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: ae(e, [...e.zones, o]), zoneId: o.id, existing: !1 };
}
const ws = (e) => e.kind === "free" && e.lost ? { kind: "free", x: e.x, y: e.y } : e;
function Bd(e, t, n) {
  if (t.length < hs) return { level: e, zoneId: null };
  const i = gs(e, { id: K(), name: n, shape: { kind: "polygon", vertices: t.map(ws) }, invalid: !1 });
  return _n(nt(e, i)) ? { level: e, zoneId: null } : { level: ae(e, [...e.zones, i]), zoneId: i.id };
}
function Fd(e, t, n) {
  const i = e.zones.find((s) => s.id === t);
  return !i || i.name === n ? e : Ve(e, i, { ...i, name: n });
}
function bs(e, t, n) {
  const i = e.zones.find((r) => r.id === t);
  if (!i || i.automation !== !1 === n) return e;
  if (!n) return Ve(e, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return Ve(e, i, o);
}
function Aa(e, t) {
  if (t.length > 0) return { ...e, zoneBlacklist: t };
  const { zoneBlacklist: n, ...i } = e;
  return i;
}
function Ea(e, t) {
  if (!e.zones.some((i) => i.id === t)) return e;
  const n = e.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(t) ? Aa(i, i.zoneBlacklist.filter((o) => o !== t)) : i;
  });
  return {
    ...e,
    zones: e.zones.filter((i) => i.id !== t),
    devices: n.some((i, s) => i !== e.devices[s]) ? n : e.devices
  };
}
function ys(e, t) {
  const n = e.zones.find((i) => i.id === t);
  return n && n.shape.kind === "polygon" ? n : null;
}
function vs(e, t, n) {
  const i = gs(e, { ...t, shape: { kind: "polygon", vertices: n } });
  return Ma(i, t) ? e : Ve(e, t, i);
}
const $s = (e, t) => Number.isInteger(e) && e >= 0 && e < t;
function Ud(e, t, n, i) {
  const s = ys(e, t);
  return !s || !$s(n, s.shape.vertices.length) ? e : vs(e, s, s.shape.vertices.map((o, r) => r === n ? ws(i) : o));
}
function jd(e, t, n, i) {
  const s = ys(e, t);
  if (!s || !$s(n, s.shape.vertices.length + 1)) return e;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, ws(i)), vs(e, s, o);
}
function Wd(e, t, n) {
  const i = ys(e, t);
  return !i || i.shape.vertices.length <= hs || !$s(n, i.shape.vertices.length) ? e : vs(e, i, i.shape.vertices.filter((s, o) => o !== n));
}
function qd(e, t) {
  const n = e.zones.find((s) => s.id === t);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < hs) return e;
  const i = n.shape.outline.map(ms);
  return Ve(e, n, gs(e, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Ia(e, t, n, i) {
  const s = e.devices.find((a) => a.id === t);
  if (!s) return e;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !e.zones.some((a) => a.id === n)) return e;
  const r = Aa(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...e, devices: e.devices.map((a) => a === s ? r : a) };
}
const De = 1;
function bt(e) {
  return structuredClone(e);
}
function Wn(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function Zd(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function qn(e, t, n) {
  const i = q(e, t.a), s = q(e, t.b), o = L(i, s), r = Zd(typeof n == "number" ? n : Hn(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Tr(i, s, r / o), offset: r };
}
function Kd(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = qn(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Pa(e, t) {
  Kd(e), t && Qd(t, e);
  const n = Td(la(je(e)));
  return t ? Hd(n, t) : n;
}
function St(e, t) {
  return Pa(bt(e), t);
}
function Ca(e, t, n) {
  const i = Rn(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = qn(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Io(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: q(e, t.nodeId), nodeId: t.nodeId };
  const n = Wn(e, t.wallId), { pt: i, offset: s } = qn(e, n, t.offset), o = L(q(e, n.a), q(e, n.b));
  return s <= De ? { pt: q(e, n.a), nodeId: n.a } : o - s <= De ? { pt: q(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Po(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: K(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Gd(e, t, n, i) {
  const s = Io(e, t), o = Io(e, n);
  if (L(s.pt, o.pt) < De) return { level: e, wallId: null, endNodeId: null };
  const r = bt(e), a = Po(r, s), l = Po(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const c = { id: K(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: St(r, e), wallId: c.id, endNodeId: l };
}
function La(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < De || l - a < De ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Xd(e, t, n, i, s) {
  const o = La(t, n, i.thickness, s);
  if (!o) return e;
  const r = bt(e), a = o.map((l) => {
    const c = { id: K(), x: l.x, y: l.y };
    return r.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: K(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return St(r, e);
}
function Yd(e, t, n) {
  const i = bt(e);
  return Ca(i, t, n), Pa(i, e);
}
function Qd(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...t.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((d) => d.id === s.a), r = e.nodes.find((d) => d.id === s.b), a = t.nodes.find((d) => d.id === i.a), l = t.nodes.find((d) => d.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const c = L(a, l);
    if (c === 0) continue;
    const u = Tn(I(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = Hn(z(o, E(u, d.offset)), a, l) * c);
  }
}
function Jd(e, t, n) {
  const i = bt(e), s = Wn(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: z(q(i, a), n) }));
  for (const a of r) Ca(i, a.id, a.to);
  return St(i, e);
}
function Zn(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Oa(e, t, n) {
  for (const i of e.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === t && (s.nodeId = n);
}
function tu(e, t, n) {
  const i = bt(e), s = Wn(i, t), o = s[n], r = q(i, o), a = { id: K(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || Oa(i, o, a.id), Zn(i), { level: St(i, e), nodeId: a.id };
}
function eu(e, t, n) {
  if (t === n) return e;
  const i = bt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Oa(i, t, n), i.nodes = i.nodes.filter((o) => o.id !== t), Zn(i), St(i, e);
}
function xs(e, t) {
  var i;
  const n = bt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Zn(n), St(n, e);
}
function nu(e, t, n) {
  const i = bt(e);
  return Object.assign(Wn(i, t), n), St(i, e);
}
const rt = (e) => typeof e == "string" && e !== "" ? e : null, za = (e) => e.split(".")[0], iu = ["friendly_name", "device_class", "unit_of_measurement"];
function Na(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: za(e),
    name: rt(n.friendly_name) ?? e,
    deviceClass: rt(n.device_class),
    unit: rt(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function su(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Na(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function ou(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && iu.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Va(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function ru(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = Na(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: rt(r.name) ?? rt(r.original_name) ?? a.name,
      deviceId: rt(r.device_id),
      areaId: rt(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: rt(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: rt(r.name_by_user) ?? rt(r.name) ?? r.id, model: rt(r.model), areaId: rt(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function au(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Da(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Va(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const lu = {
  "tool.select": "Select",
  "tool.box": "Box",
  "tool.wall": "Wall",
  "tool.door": "Door",
  "tool.window": "Window",
  "tool.opening": "Opening",
  "tool.zone": "Zone",
  "tool.device-select": "Select",
  "tool.ceiling_light": "Ceiling light",
  "tool.wall_light": "Wall light",
  "tool.motion_sensor": "Motion sensor",
  "tool.illuminance_sensor": "Illuminance sensor",
  "tool.wall_switch": "Wall switch",
  "tool.valve": "Valve",
  "tool.leak_sensor": "Leak sensor",
  "tool.smart_button": "Smart button",
  "tool.socket": "Socket",
  "tool.equipment": "Device",
  "tool.climate_sensor": "Climate sensor",
  "tool.exhaust_fan": "Exhaust fan",
  "tool.binding-select": "Select",
  "tool.power-select": "Select",
  "tool.power-device": "Device",
  "tool.power-bus": "Bus",
  "tool.power-battery": "Battery",
  "tool.power-pv": "PV field",
  "tool.power-transfer": "Transfer switch",
  "tool.power-remainder": "Remainder",
  "mode.plan": "Plan",
  "mode.equipment": "Equipment",
  "mode.binding": "Binding",
  "mode.power": "Power",
  "mode.automation": "Automation",
  "steps.label": "Setup steps",
  "steps.app": "Plan Studio",
  "steps.wall": "{n} wall",
  "steps.walls": "{n} walls",
  "steps.device": "{n} device",
  "steps.devices": "{n} devices",
  "steps.zone": "{n} zone",
  "steps.zones": "{n} zones",
  "steps.invalid": "{n} invalid",
  "steps.block": "{n} block",
  "steps.blocks": "{n} blocks",
  "steps.bound": "{b} of {n} bound",
  "steps.later": "Comes later",
  "steps.back": "Back: {step}",
  "steps.next": "Next: {step}",
  "steps.nextUnbound": "Next unbound device",
  "binding.show": "Show devices",
  "binding.filter.unbound": "Not bound",
  "binding.filter.bound": "Bound",
  "binding.filter.all": "All",
  "binding.search": "Filter devices",
  "binding.allBound": "Every device is bound.",
  "binding.noneBound": "No bound devices yet.",
  "binding.noMatch": "No devices match this filter.",
  "binding.noDevices": "No devices on the plan yet. Place them in the Equipment step.",
  "binding.pick": "Pick a device on the plan or in the list, or press Next unbound device.",
  "binding.collapse": "Collapse the device list",
  "binding.expand": "Expand the device list",
  "binding.reload": "Reload from Home Assistant",
  "binding.showAll": "Show all",
  "binding.missing": "This entity is not in Home Assistant any more. Pick another one or clear the field.",
  "binding.unavailable": "Unavailable in Home Assistant",
  "binding.alsoBound": "Also bound to: {names}",
  "binding.notBound": "{n} not bound",
  "binding.registryError": "Couldn't load the Home Assistant registries: {error}",
  "binding.onOff": "On / Off",
  "binding.slot": "Button",
  "binding.singleButton": "— (single button)",
  "binding.event": "Event",
  "binding.eventOther": "Other…",
  "binding.separateOff": "Separate Off",
  "binding.autoEnabled": "Auto",
  "binding.autoByDoubleToggle": "Auto by double toggle",
  "binding.window": "Window, s",
  "binding.duplicate": "Two triggers of this device are identical; the first one (On, Off, Auto) wins.",
  "role.control": "Control",
  "role.control.equipment": "Switch",
  "role.motion": "Motion",
  "role.illuminance": "Illuminance",
  "role.temperature": "Temperature",
  "role.humidity": "Humidity",
  "role.state": "State",
  "role.leak": "Leak",
  "role.power": "Power",
  "role.on": "On",
  "role.off": "Off",
  "role.auto": "Auto",
  "role.voltage": "Voltage",
  "role.power_in": "Input power",
  "role.power_out": "Output power",
  "output.last": "Last event: {event}, {time}",
  "output.none": "No events yet",
  "output.errorNotConfigured": "Status: error, not configured",
  "output.errorUnavailable": "Status: error, unavailable ({entities})",
  "output.notSaved": "Not saved yet",
  "output.noLive": "Live state is not available.",
  "bindstatus.bound": "Bound",
  "bindstatus.partial": "Partly bound",
  "bindstatus.unbound": "Not bound",
  "bindstatus.missing": "Entity missing in Home Assistant",
  "zones.default": "Zone",
  "zones.kind.walls": "By walls",
  "zones.kind.polygon": "Polygon",
  "zones.method": "Method",
  "zones.hint.walls": "Click inside closed walls: the zone follows them.",
  "zones.hint.polygon": "Click to add a vertex. Close with Enter or a click on the first vertex. Vertices snap to wall corners and faces, other zones and the grid.",
  "zones.noLoop": "Click inside closed walls, or use Polygon",
  "zones.automation": "Takes part in automation",
  "zones.outline": "Outline",
  "zones.list": "Zones ({n})",
  "zones.inside": "Devices inside ({n})",
  "zones.keepOutline": "Keep outline as a polygon",
  "zones.minVertices": "A zone needs at least 3 vertices.",
  "zones.participates": "Participates",
  "zones.noMembers": "No devices inside.",
  "zones.delete": "Delete zone",
  "zones.filter": "Filter zones",
  "zones.invalid.broken": "The walls no longer close this zone.",
  "zones.invalid.lost": "A vertex lost its wall or corner: drag it to place it again.",
  "zones.invalid.beyond": "A vertex lies beyond the end of its wall.",
  "power.kind.grid": "Grid",
  "power.kind.device": "Device",
  "power.kind.bus": "Bus",
  "power.kind.battery": "Battery",
  "power.kind.pv": "PV field",
  "power.kind.transfer": "Transfer switch",
  "power.kind.remainder": "Other",
  "power.missing": "Device missing",
  "power.planDevice": "On the plan",
  "power.loss": "Loss",
  "power.in": "In",
  "power.out": "Out",
  "power.soc": "SOC",
  "power.hint.disagree": "meters disagree",
  "power.absorbed.one": "incl. {name}",
  "power.absorbed.many": "incl. {n} without data",
  "power.alert.unavailable": "No data: {entity}",
  "power.alert.missingDevice": "Device missing",
  "power.alert.disagree": "Meters disagree",
  "power.switch.on": "On",
  "power.switch.off": "Off",
  "power.switch.unknown": "Unknown",
  "power.readOnly": "read-only",
  "power.gridKeep": "The grid source cannot be deleted",
  "power.pickDevice": "Pick a device in the list first",
  "power.help.select": "Drag from a port to a port or a bus to add a wire. Drag a block to move it.",
  "power.help.place": "Click on the canvas to place the block.",
  "power.enableOutput": "Enable output",
  "power.help.device": "Pick a device in the list, then click on the canvas.",
  "power.err.missing": "This port or bus no longer exists",
  "power.err.same-block": "A wire cannot join two ports of one block",
  "power.err.direction": "A wire must join an output to an input",
  "power.err.port-taken": "This port already has a wire",
  "power.err.dc-mismatch": "This wire would join a battery or PV line to a different line",
  "power.err.second-remainder": "This bus already feeds a remainder",
  "power.err.loop": "This wire would close a loop",
  "power.title.grid": "Grid source",
  "power.title.device": "Device",
  "power.title.bus": "Bus",
  "power.title.battery": "Battery",
  "power.title.pv": "PV field",
  "power.title.transfer": "Transfer switch",
  "power.title.remainder": "Remainder",
  "power.pick": "Select a block or a wire to edit it.",
  "power.noDevices": "No devices left to place. Devices, sockets and anything with a power or control binding are listed until they are in the schematic; New device adds one.",
  "power.field.power": "Power",
  "power.field.batteryPower": "Power (+ charging)",
  "power.field.voltage": "Voltage",
  "power.field.soc": "SOC",
  "power.boundHint": "Bound in the Binding step",
  "power.form": "Form",
  "power.form.2in1out": "2 inputs → 1 output",
  "power.form.1in2out": "1 input → 2 outputs",
  "power.position": "Position",
  "power.positionHint": "Set live; not saved with the plan.",
  "power.orientation": "Orientation",
  "power.orientation.h": "Horizontal",
  "power.orientation.v": "Vertical",
  "power.busLength": "Length",
  "power.busThickness": "Thickness",
  "power.autoPorts": "Auto ports",
  "power.wire": "Wire",
  "power.wire.from": "From",
  "power.wire.to": "To",
  "power.wire.power": "Power",
  "zones.invalid.crossing": "The outline crosses itself: move a vertex.",
  "device.ceiling_light": "Ceiling light",
  "device.wall_light": "Wall light",
  "device.motion_sensor": "Motion sensor",
  "device.illuminance_sensor": "Illuminance sensor",
  "device.wall_switch": "Wall switch",
  "device.valve": "Valve",
  "device.leak_sensor": "Leak sensor",
  "device.smart_button": "Smart button",
  "device.socket": "Socket",
  "device.equipment": "Device",
  "device.climate_sensor": "Climate sensor",
  "device.exhaust_fan": "Exhaust fan",
  "devices.unplaced": "Not on the plan",
  "devices.new": "New device",
  "deviceRole.meter": "Meter",
  "deviceRole.switch": "Switch",
  "deviceRole.metered-switch": "Metered switch",
  "deviceRole.dummy": "Dummy",
  "plan.default": "Plan",
  "plan.name": "Plan name",
  "plan.copySuffix": "(copy)",
  "load.loading": "Loading…",
  "load.error": "Failed to load the plan",
  "load.oldServer": "Plan Studio on the server is older than this page: restart Home Assistant, then reload.",
  "walltype.label": "Wall type",
  "walltype.bearing": "Load-bearing",
  "walltype.partition": "Partition",
  "walltype.railing": "Railing",
  "walltype.fence": "Fence",
  "action.undo": "Undo",
  "action.redo": "Redo",
  "action.save": "Save",
  "action.delete": "Delete",
  "action.cancel": "Cancel",
  "action.retry": "Retry",
  "save.dirty": "Unsaved changes",
  "save.clean": "No changes",
  "save.saving": "Saving…",
  "save.saved": "Saved",
  "save.conflict": "Conflict",
  "save.error": "Save failed",
  "conflict.title": "The plan was changed elsewhere",
  "conflict.text": "The stored plan changed after you opened it. Your edits are still here.",
  "conflict.again": "Overwrite failed too (the plan may have been deleted). Save your work as a new plan.",
  "conflict.overwrite": "Overwrite",
  "conflict.saveAsNew": "Save as new",
  "draft.title": "Unsaved changes found",
  "draft.text": "Restore unsaved changes from {time}?",
  "draft.restore": "Restore",
  "draft.discard": "Discard",
  "draft.banner": "Unsaved changes from {time} available",
  "drafts.oldDiscarded": "A draft from an older version was discarded.",
  "switch.title": "Unsaved changes",
  "switch.text": "Opening another plan discards the unsaved changes of this one.",
  "switch.discard": "Discard and open",
  "plan.pick": "Open plan",
  "plan.new": "New plan",
  "plan.delete": "Delete plan",
  "new.title": "New plan",
  "new.text": "Creating a new plan discards the unsaved changes of this one.",
  "new.discard": "Discard changes",
  "delete.title": "Delete plan",
  "delete.text": "Delete plan '{name}'? This cannot be undone.",
  "delete.confirm": "Delete",
  "props.none": "Nothing selected",
  "props.wall": "Wall",
  "props.type": "Type",
  "props.typeFreeHint": "A free-placed smart button cannot become a wall switch; move it onto a wall first.",
  "props.thickness": "Thickness",
  "props.baseline": "Baseline",
  "props.length": "Length",
  "props.kind": "Kind",
  "props.width": "Width",
  "props.offset": "From wall start",
  "props.hinge": "Hinges",
  "props.swing": "Opens to",
  "props.outside": "Outside",
  "props.passesLight": "Passes light",
  "props.passesPir": "Passes PIR",
  "props.invalidOpening": "Out of the wall or overlapping another opening",
  "props.badWidth": "Width must be a whole number of mm above 0",
  "props.noFit": "Does not fit the wall at this position",
  "props.zone": "Zone",
  "props.zoneList": "Zones",
  "props.noZones": "Not in any zone.",
  "props.name": "Name",
  "props.area": "Area",
  "props.node": "Node",
  "props.newWall": "New wall",
  "props.next.door": "New door",
  "props.next.window": "New window",
  "props.next.opening": "New opening",
  "props.nextZone": "New zone",
  "props.measure": "Size measured to",
  "props.nextDevice": "Next device",
  "props.noSettings": "No settings for this kind",
  "props.shape": "Shape",
  "props.diameter": "Diameter",
  "props.depth": "Depth",
  "props.poolRadius": "Light pool radius",
  "props.poolHint": "Empty: no light pool",
  "props.coneAngle": "Cone angle",
  "props.coneRange": "Cone range",
  "props.zoneAngle": "Zone angle",
  "props.zoneRange": "Zone range",
  "props.icon": "Icon",
  "props.badIcon": "Icon must look like mdi:water-boiler",
  "props.label": "Label",
  "props.rotation": "Rotation",
  "props.aim": "Aim",
  "props.badAim": "Aim must be a whole number from -90 to 90",
  "props.side": "Side",
  "props.badNumber": "Must be a whole number above 0",
  "props.badAngle": "Angle must be a whole number from 1 to 360",
  "props.badRotation": "Rotation must be a whole number from 0 to 359",
  "props.badOffset": "Enter a whole number of mm, 0 or more",
  "props.badWindow": "Window is a whole number of seconds from 1 to 10.",
  "props.badEvent": "Event cannot be empty.",
  "props.invalidDevice": "Outside its wall",
  "props.wallMount": "Wall mount",
  "props.inverter": "Inverter",
  "props.controllable": "Controllable",
  "props.bindSwitchHint": "Bind a switch in the Binding step",
  "shape.round": "Round",
  "shape.linear": "Linear",
  "shape.spot": "Spot",
  "shape.rect": "Rectangle",
  "shape.circle": "Circle",
  "baseline.center": "Axis",
  "baseline.left": "Left face",
  "baseline.right": "Right face",
  "kind.opening": "Opening",
  "kind.door": "Door",
  "kind.window": "Window",
  "kind.gate": "Gate",
  "kind.wicket": "Wicket gate",
  "hinge.start": "At wall start",
  "hinge.end": "At wall end",
  "side.left": "Left",
  "side.right": "Right",
  "measure.inner": "Inner face",
  "measure.axis": "Axis",
  "measure.outer": "Outer face",
  "hint.shift": "90°",
  "hint.digits": "digits",
  "hint.length": "length",
  "hint.tab": "angle",
  "hint.esc": "finish",
  "hint.deselect": "clear selection",
  "hint.size": "size",
  "hint.tabSize": "width / depth",
  "hint.close": "close",
  "hint.removeVertex": "remove last vertex",
  "hint.freeVertex": "free vertex",
  "hint.cancel": "cancel",
  "hint.delete": "delete",
  "status.grid": "Grid 100 mm",
  "status.gridSchematic": "Grid",
  "status.cones": "Cones & zones",
  "snap.node": "snap: end",
  "snap.corner": "snap: wall corner",
  "snap.mid": "snap: midpoint",
  "snap.wall": "snap: wall",
  "snap.zoneVertex": "snap: zone corner",
  "snap.zoneEdge": "snap: zone edge",
  "snap.grid": "snap: grid",
  "snapmark.node": "endpoint",
  "snapmark.corner": "wall corner",
  "snapmark.mid": "midpoint",
  "snapmark.wall": "on wall",
  "snapmark.zoneVertex": "zone corner",
  "snapmark.zoneEdge": "zone edge",
  "snapmark.grid": "grid",
  "tracker.length": "L",
  "tracker.angle": "∠",
  "tracker.width": "W",
  "tracker.depth": "D",
  "combo.search": "Search entities",
  "combo.searchDevices": "Search devices",
  "combo.emptyDevices": "No matching devices",
  "combo.empty": "No matching entities",
  "combo.none": "Select an entity",
  "combo.more": "Showing the first 100 — keep typing to narrow",
  "combo.clear": "Clear",
  "combo.domain.sensor": "Sensor",
  "combo.domain.binary_sensor": "Binary sensor",
  "combo.domain.light": "Light",
  "combo.domain.switch": "Switch",
  "combo.domain.fan": "Fan",
  "combo.domain.event": "Event",
  "unit.mm": "mm",
  "unit.m2": "m²",
  "unit.deg": "°"
};
function h(e) {
  return lu[e] ?? e;
}
const cu = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], du = 10;
function fe(e, t) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (e.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return ue(t.device(e.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : e.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
    case "battery":
      return [n("BAT", "in")];
    case "pv":
      return [n("OUT", "out")];
    case "remainder":
      return [n("IN", "in")];
    case "transfer":
      return e.form === "2in1out" ? [n("A", "in"), n("B", "in"), n("OUT", "out")] : e.form === "1in2out" ? [n("IN", "in"), n("A", "out"), n("B", "out")] : [];
    default:
      return [];
  }
}
function Ta() {
  return { blocks: [{ id: K(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function uu(e, t, n, i) {
  const s = { id: K(), x: t.x, y: t.y }, o = { ...s, name: `${h(`power.kind.${e}`)} ${1 + n.blocks.filter((r) => r.kind === e).length}` };
  switch (e) {
    case "device":
      return { ...s, kind: e, deviceId: i ?? "", output: !1 };
    case "bus":
      return { ...o, kind: e, w: 240, h: 12 };
    case "transfer":
      return { ...o, kind: e, form: "2in1out" };
    default:
      return { ...o, kind: e };
  }
}
function Co(e, t) {
  return { ...e, blocks: [...e.blocks, t] };
}
function Kn(e, t, n) {
  return e.blocks.some((i) => i.id === t) ? { ...e, blocks: e.blocks.map((i) => i.id === t ? n(i) : i) } : e;
}
function pu(e, t, n, i) {
  return Kn(e, t, (s) => ({ ...s, x: n, y: i }));
}
const Hi = (e) => "block" in e ? e.block : e.bus, Ha = (e, t) => Hi(e.from) === t || Hi(e.to) === t;
function Te(e, t, n, i) {
  const s = e.blocks.find((c) => c.id === t);
  if (!s) return e;
  const o = Kn(e, t, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !Ha(c, t)) };
  const r = o.blocks.find((c) => c.id === t), a = new Set(fe(r, i).map((c) => c.name)), l = (c) => "block" in c && c.block === t && !a.has(c.port);
  return o.wires.some((c) => l(c.from) || l(c.to)) ? { ...o, wires: o.wires.filter((c) => !l(c.from) && !l(c.to)) } : o;
}
function Ra(e, t) {
  const n = e.blocks.find((i) => i.id === t);
  return !n || n.kind === "grid" ? e : { blocks: e.blocks.filter((i) => i.id !== t), wires: e.wires.filter((i) => !Ha(i, t)) };
}
const Ba = (e, t) => new Set(e.blocks.flatMap((n) => n.kind === "device" && n.deviceId === t ? [n.id] : []));
function Gn(e, t, n) {
  const i = Ba(e, t);
  if (i.size === 0) return e;
  const s = new Map(e.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(fe(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = e.wires.filter((c) => !o(c.from) && !o(c.to));
  let a = !1;
  const l = e.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((m) => u.has(m))) return c;
    a = !0;
    const d = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => u.has(m))), { portPins: p, ...f } = c;
    return Object.keys(d).length ? { ...f, portPins: d } : f;
  });
  return r.length === e.wires.length && !a ? e : { ...e, blocks: l, wires: r };
}
function fu(e, t) {
  const n = ks(t), i = new Set(e.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = e;
  for (const o of i) s = Gn(s, o, n);
  return s;
}
function hu(e, t) {
  const n = Ba(e, t);
  if (n.size === 0) return e;
  const i = (s) => n.has(Hi(s));
  return {
    ...e,
    blocks: e.blocks.filter((s) => !n.has(s.id)),
    wires: e.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const ks = (e) => ({ device: (t) => e.devices.find((n) => n.id === t) });
function Fa(e, t, n) {
  var o;
  const i = ((o = e.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = cd(e, n);
  return { level: s, power: i ? hu(t, n) : Gn(t, n, ks(s)) };
}
function Ua(e, t, n, i) {
  const s = ra(e, n, i);
  return { level: s, power: s === e ? t : Gn(t, n, ks(s)) };
}
function ja(e, t) {
  return e.wires.some((n) => n.id === t) ? { ...e, wires: e.wires.filter((n) => n.id !== t) } : e;
}
function mu(e, t, n, i) {
  return Kn(e, t, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...a } = s;
    return Object.keys(o).length ? { ...a, portPins: o } : a;
  });
}
function gu(e, t) {
  return Kn(e, t, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function Lo(e, t) {
  if (e.kind === "battery") return "bat";
  if (e.kind === "pv") return "pv";
  if (e.kind === "device") {
    if (t === "BAT") return "bat";
    if (t === "PV") return "pv";
  }
  return "ac";
}
function wu(e, t) {
  const n = e.filter((o) => o.kind === "transfer"), i = n.slice(0, du), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((u, d) => r.set(u.id, o & 1 << d ? "B" : "A"));
    const a = /* @__PURE__ */ new Map(), l = (u) => {
      let d = u;
      for (; a.has(d) && a.get(d) !== d; ) d = a.get(d);
      return d;
    }, c = (u, d) => {
      if ("bus" in u) return `n:${u.bus}`;
      const p = s.get(u.block);
      return p !== void 0 && u.port !== p && u.port !== (r.get(u.block) ?? "A") ? `x:${d.id}:${u.port}` : `n:${u.block}`;
    };
    for (const u of t) {
      const d = l(c(u.from, u)), p = l(c(u.to, u));
      if (d === p) return !0;
      a.set(d, p);
    }
  }
  return !1;
}
function Oo(e, t, n, i) {
  const s = new Map(e.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const $ = s.get(g.block), x = $ ? fe($, i).find((M) => M.name === g.port) : void 0;
    return $ && x ? { bl: $, dir: x.dir } : null;
  }, r = o(t), a = o(n);
  if (!r || !a) return { error: "missing" };
  if (r.bl.id === a.bl.id) return { error: "same-block" };
  let l = t, c = n;
  if (r.dir === null || a.dir === null)
    (r.dir === "in" || a.dir === "out") && (l = n, c = t);
  else {
    if (r.dir === a.dir)
      return { error: "direction" };
    r.dir === "in" && (l = n, c = t);
  }
  const u = (g) => "block" in g && e.wires.some(($) => [$.from, $.to].some((x) => "block" in x && x.block === g.block && x.port === g.port));
  if (u(l) || u(c)) return { error: "port-taken" };
  const d = (g) => {
    for (const $ of e.wires)
      for (const [x, M] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in x && x.bus === g && "block" in M) {
          const k = s.get(M.block);
          if (k) return Lo(k, M.port);
        }
    return null;
  }, p = (g) => "bus" in g ? d(g.bus) : Lo(s.get(g.block), g.port), f = p(l), m = p(c);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in l && "block" in c && s.get(c.block).kind === "remainder" && e.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === l.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const b = { id: K(), from: l, to: c }, w = [...e.wires, b];
  return wu(e.blocks, w) ? { error: "loop" } : { schema: { ...e, wires: w }, wire: b };
}
const vt = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ne = (e) => typeof e == "number" && Number.isFinite(e), bu = ["top", "right", "bottom", "left"], yu = ["2in1out", "1in2out"];
function vu(e, t) {
  let n = e;
  if (n.kind === "bus" && !(ne(n.w) && ne(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !yu.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(fe(n, t).map((c) => c.name)), o = {};
  let r = vt(i);
  for (const [c, u] of vt(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !vt(u) || !bu.includes(u.side) || !ne(u.at)) {
      r = !1;
      continue;
    }
    const d = Math.min(1, Math.max(0, u.at));
    d !== u.at && (r = !1), o[c] = d === u.at ? u : { side: u.side, at: d };
  }
  if (r) return n;
  const { portPins: a, ...l } = n;
  return Object.keys(o).length ? { ...l, portPins: o } : l;
}
function $u(e, t) {
  if (!vt(e)) return;
  const n = Array.isArray(e.blocks) ? e.blocks : [], i = Array.isArray(e.wires) ? e.wires : [];
  let s = !Array.isArray(e.blocks) || !Array.isArray(e.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (vt(u) && typeof u.id == "string" && u.id && cu.includes(u.kind) && ne(u.x) && ne(u.y)) {
      const d = vu(u, t);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const a = new Map(o.map((u) => [u.id, u])), l = (u) => {
    var p;
    if (!vt(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = a.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !ne(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const d = typeof u.block == "string" ? a.get(u.block) : void 0;
    return d && !r.has(d.id) && fe(d, t).some((f) => f.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = vt(u) ? l(u.from) : null, p = vt(u) ? l(u.to) : null;
    if (!vt(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...e, blocks: o, wires: c } : e;
}
function Wa(e, t) {
  const n = new Set(t.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return e.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function xu(e) {
  const t = e.blocks.find((n) => n.kind === "grid");
  return !!t && t.kind === "grid" && !!t.power && e.wires.length > 0;
}
const qe = 11, Sn = 18, An = 30, ku = 12, Mu = 120, it = 14, zo = 10, He = (e) => Math.round(e / zo) * zo || 0, mi = 24, No = 6, _u = 2 * qe + 6, Su = it, Au = 1e6, Vo = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Xn = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 }), gi = (e, t, n) => e.x >= t.x - n && e.x <= t.x + t.w + n && e.y >= t.y - n && e.y <= t.y + t.h + n, qa = (e) => Math.min(1, Math.max(0, e));
function Yn(e, t) {
  var n;
  return e.kind === "device" ? ((n = t.device(e.deviceId)) == null ? void 0 : n.name) ?? "" : e.name ?? "";
}
function Eu(e, t) {
  const n = (...i) => i.filter(Boolean).length;
  switch (e.kind) {
    case "grid":
      return 1 + n(e.voltage);
    case "device": {
      const i = t.device(e.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = ue(i);
      return n(o ? s.power_in : s.power, o && s.power_out, s.voltage, s.control, o);
    }
    case "battery":
      return 2;
    case "remainder":
      return 2;
    case "bus":
      return 0;
    default:
      return 1;
  }
}
function gt(e, t, n) {
  return n ? Ss(n, e, t).r : Ms(e, t);
}
function Ms(e, t) {
  return e.kind === "bus" ? { x: e.x, y: e.y, w: e.w, h: e.h } : {
    x: e.x,
    y: e.y,
    w: Math.max(Mu, 7 * Yn(e, t).length + 32),
    h: An + Sn * Eu(e, t) + ku
  };
}
function En(e, t, n) {
  switch (t) {
    case "top":
      return { x: e.x + n * e.w, y: e.y };
    case "bottom":
      return { x: e.x + n * e.w, y: e.y + e.h };
    case "left":
      return { x: e.x, y: e.y + n * e.h };
    case "right":
      return { x: e.x + e.w, y: e.y + n * e.h };
  }
}
function Iu(e, t) {
  const n = Xn(e), i = t.x - n.x, s = t.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (e.w / 2) > Math.abs(s) / (e.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function Pu(e, t) {
  const n = [
    { side: "top", a: { x: e.x, y: e.y }, b: { x: e.x + e.w, y: e.y } },
    { side: "right", a: { x: e.x + e.w, y: e.y }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "bottom", a: { x: e.x, y: e.y + e.h }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "left", a: { x: e.x, y: e.y }, b: { x: e.x, y: e.y + e.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const a of n) {
    const l = ht(t, a.a, a.b);
    l < s && (i = a, s = l);
  }
  const r = i.side === "top" || i.side === "bottom" ? e.w ? (t.x - e.x) / e.w : 0.5 : e.h ? (t.y - e.y) / e.h : 0.5;
  return { side: i.side, at: qa(r) };
}
const Re = (e) => e.w >= e.h;
function Za(e, t) {
  return Re(e) ? { x: e.x + t * e.w, y: e.y + e.h / 2 } : { x: e.x + e.w / 2, y: e.y + t * e.h };
}
function Cu(e, t, n) {
  const i = { x: e.x, y: e.y, w: e.w, h: e.h };
  if (t === 0 || t === 1) {
    const r = Re(e) ? t === 0 ? "left" : "right" : t === 0 ? "top" : "bottom";
    return { pt: En(i, r, 0.5), side: r };
  }
  const s = Xn(i), o = Re(e) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: En(i, o, t), side: o };
}
function Lu(e, t) {
  if (e.kind === "device") {
    if (t.name === "BAT") return "right";
    if (t.name === "PV") return "top";
  }
  return t.dir === "in" ? "top" : "bottom";
}
const _s = (e, t) => e.blocks.find((n) => n.id === t), Ri = (e, t) => {
  const n = _s(e, t);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, wi = (e, t, n) => "block" in e && e.block === t && e.port === n;
function Ou(e, t, n, i) {
  const s = e.wires.find((a) => wi(a.from, t, n) || wi(a.to, t, n));
  if (!s) return null;
  const o = wi(s.from, t, n) ? s.to : s.from;
  if ("bus" in o) {
    const a = Ri(e, o.bus);
    return a ? Za(a, o.at) : null;
  }
  const r = _s(e, o.block);
  return r ? Xn(Ms(r, i)) : null;
}
function Ss(e, t, n) {
  const i = Ms(t, n), s = Xn(i), o = fe(t, n).map((c) => {
    var m;
    const u = (m = t.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = Ou(e, t.id, c.name, n), p = (d && Iu(i, d)) ?? Lu(t, c), f = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * _u : 0;
  }, a = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, l = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (l[u] = { name: c.name, dir: c.dir, side: c.side, pt: En(a, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, f) => {
      l[p] = { name: d.name, dir: d.dir, side: c, pt: En(a, c, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: a, places: l };
}
function Qn(e, t, n) {
  return Ss(e, t, n).places;
}
function Ka(e, t, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = _s(e, c.block);
    if (!u) return null;
    const { r: d, places: p } = Ss(e, u, n), f = p.find((m) => m.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = Ri(e, c.bus);
    if (!p) return null;
    let f = d == null ? void 0 : d.pt;
    if (!f && "bus" in u) {
      const m = Ri(e, u.bus);
      f = m && Za(m, u.at);
    }
    return f ? { ...Cu(p, c.at, f), rect: gt(p, n, e) } : null;
  }, o = i(t.from), r = i(t.to), a = o ?? s(t.from, t.to, r), l = r ?? s(t.to, t.from, o);
  return a && l ? { a, b: l } : null;
}
const Ye = (e, t) => ({ x: Math.sign(t.x - e.x), y: Math.sign(t.y - e.y) }), Bi = (e, t) => Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
function zu(e, t, n) {
  const i = [];
  for (const a of e) {
    const l = i[i.length - 1];
    if (!(l && l.x === a.x && l.y === a.y)) {
      if (l && l.x !== a.x && l.y !== a.y) return null;
      if (i.length >= 2) {
        const c = Ye(i[i.length - 2], l), u = Ye(l, a);
        if (c.x === u.x && c.y === u.y) {
          i[i.length - 1] = a;
          continue;
        }
        if (c.x === -u.x && c.y === -u.y) return null;
      }
      i.push(a);
    }
  }
  const s = i.length;
  if (s < 2 || s > 6) return null;
  const o = Ye(i[0], i[1]), r = Ye(i[s - 2], i[s - 1]);
  return o.x !== t.x || o.y !== t.y || Bi(i[0], i[1]) < it - 1e-9 || r.x !== -n.x || r.y !== -n.y || Bi(i[s - 2], i[s - 1]) < it - 1e-9 ? null : i;
}
function Nu(e, t, n) {
  return Math.min(e.x, t.x) < n.x + n.w - 0.5 && Math.max(e.x, t.x) > n.x + 0.5 && Math.min(e.y, t.y) < n.y + n.h - 0.5 && Math.max(e.y, t.y) > n.y + 0.5;
}
function Vu(e, t) {
  let n = (e.length - 2) * Su;
  for (let i = 1; i < e.length; i++) {
    n += Bi(e[i - 1], e[i]);
    for (const s of t) Nu(e[i - 1], e[i], s) && (n += Au);
  }
  return n;
}
function Ga(e, t) {
  const n = e.pt, i = t.pt, s = Vo[e.side], o = Vo[t.side], r = { x: n.x + s.x * it, y: n.y + s.y * it }, a = { x: i.x + o.x * it, y: i.y + o.y * it }, l = [e.rect, t.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + a[x]) / 2,
    r[x],
    a[x],
    n[x],
    i[x],
    ...l.flatMap((k) => [k[x] - it, k[x] + k[M] + it]),
    Math.min(r[x], a[x]) - it,
    Math.max(r[x], a[x]) + it
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, f = o.x === 0, m = (p ? d : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= it - 1e-9), b = (f ? d : u).filter((x) => (x - (f ? i.y : i.x)) * (f ? o.y : o.x) >= it - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (x) => {
    const M = zu(x, s, o);
    if (!M) return;
    const k = Vu(M, l);
    k < g - 1e-6 && (w = M, g = k);
  };
  if (p && f)
    for (const x of m) for (const M of u) for (const k of b)
      $([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!p && !f)
    for (const x of m) for (const M of d) for (const k of b)
      $([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const M of b)
      $([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of b)
      $([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, p ? { x: r.x, y: a.y } : { x: a.x, y: r.y }, a, i];
}
function Xa(e, t, n) {
  const i = gt(e, t, n), s = i.x + (i.w - (3 * mi + 2 * No)) / 2, o = i.y + An + 1;
  return ["A", "0", "B"].map((r, a) => ({
    position: r,
    rect: { x: s + a * (mi + No), y: o, w: mi, h: Sn - 2 }
  }));
}
function Du(e) {
  const { x: t, y: n, w: i, h: s } = e;
  return Re(e) ? [{ end: "start", a: { x: t, y: n }, b: { x: t, y: n + s } }, { end: "end", a: { x: t + i, y: n }, b: { x: t + i, y: n + s } }] : [{ end: "start", a: { x: t, y: n }, b: { x: t + i, y: n } }, { end: "end", a: { x: t, y: n + s }, b: { x: t + i, y: n + s } }];
}
function Do(e, t, n, i) {
  const s = [...e.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = Xa(u, i, e).find((p) => gi(t, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of Qn(e, u, i)) {
      const p = L(t, d.pt);
      p <= qe + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const f of Du(u)) {
      const m = ht(t, f.a, f.b);
      m <= n && m < p && (d = { kind: "bus-end", id: u.id, end: f.end }, p = m);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !gi(t, gt(u, i, e), n)) continue;
    const d = Re(u) ? (t.x - u.x) / u.w : (t.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: qa(d) };
  }
  let a = null, l = 1 / 0;
  for (const u of e.wires) {
    const d = Ka(e, u, i);
    if (!d) continue;
    const p = Ga(d.a, d.b);
    for (let f = 1; f < p.length; f++) {
      const m = ht(t, p[f - 1], p[f]);
      m <= n && m < l && (a = { kind: "wire", id: u.id }, l = m);
    }
  }
  if (a) return a;
  const c = s.find((u) => u.kind !== "bus" && gi(t, gt(u, i, e), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function Tu(e, t) {
  if (!e.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of e.blocks) {
    const a = gt(r, t, e);
    n = Math.min(n, a.x), i = Math.min(i, a.y), s = Math.max(s, a.x + a.w), o = Math.max(o, a.y + a.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Ya extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function bi(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Hu(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Ru(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Ya(s.message) : s;
  }
}
async function Bu(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Fu = 3;
function $t(e) {
  if (typeof e == "number")
    return e === Fu ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Uu {
  constructor(t, n) {
    this.hass = t, this.onChange = n, this.state = "idle", this.errorMessage = null, this.dirty = !1, this.baseRevision = null, this.dirtyVersion = 0, this.inflight = null;
  }
  /** Starts over for a freshly opened plan (no pending edits, no error). */
  reset(t) {
    this.state = "idle", this.errorMessage = null, this.dirty = !1, this.dirtyVersion++, this.baseRevision = t, this.onChange();
  }
  markDirty() {
    this.dirty = !0, this.dirtyVersion++, this.onChange();
  }
  save(t) {
    return this.inflight ? this.inflight.then(() => {
    }) : this.run(t, this.baseRevision, !1).then(() => {
    });
  }
  overwrite(t) {
    return this.inflight ? this.inflight.then(() => {
    }) : this.run(t, this.baseRevision, !0).then(() => {
    });
  }
  /**
   * Saves a copy under a new id and name. Returns the new plan (revision set) on
   * success; the caller must adopt it. Returns null on failure or when another
   * save is already in flight (state shows conflict/error).
   */
  async saveAsNew(t, n) {
    if (this.inflight)
      return await this.inflight, null;
    const i = { ...t, id: K(), name: n, revision: 0 }, s = await this.run(i, null, !1);
    return s === null ? null : { ...i, revision: s };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(t, n, i) {
    const s = this.doRun(t, n, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = s, s;
  }
  async doRun(t, n, i) {
    this.state = "saving", this.errorMessage = null;
    const s = this.dirtyVersion;
    this.onChange();
    try {
      const o = await Ru(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Ya ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = $t(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Jn = (e) => (...t) => ({ _$litDirective$: e, values: t });
let ti = class {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, n, i) {
    this._$Ct = t, this._$AM = n, this._$Ci = i;
  }
  _$AS(t, n) {
    return this.update(t, n);
  }
  update(t, n) {
    return this.render(...n);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qa = (e) => e.strings === void 0, ju = {}, As = (e, t = ju) => e._$AH = t;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wu = Jn(class extends ti {
  constructor() {
    super(...arguments), this.key = y;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, n]) {
    return t !== this.key && (As(e), this.key = t), n;
  }
});
var Ja = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", qu = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Zu = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Ku = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Gu = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Xu = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", To = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Qe = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Yu = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Qu = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Ju = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", tp = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", ep = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", np = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", ip = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", sp = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", op = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", rp = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", ap = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", lp = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", cp = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", tl = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", dp = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", el = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", up = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", pp = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", fp = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", hp = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", mp = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", gp = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", wp = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", bp = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", yp = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", vp = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function nl(e, t, n) {
  switch (e) {
    case "up":
      return { x: -t.w / 2, y: -n - t.h };
    case "down":
      return { x: -t.w / 2, y: n };
    case "left":
      return { x: -n - t.w, y: -t.h / 2 };
    case "right":
      return { x: n, y: -t.h / 2 };
    case "up-left":
      return { x: -n - t.w, y: -n - t.h };
    case "up-right":
      return { x: n, y: -n - t.h };
    case "down-left":
      return { x: -n - t.w, y: n };
    case "down-right":
      return { x: n, y: n };
  }
}
function $p(e) {
  return Math.abs(e.x) >= Math.abs(e.y) ? e.x >= 0 ? "right" : "left" : e.y >= 0 ? "down" : "up";
}
function xp(e, t, n, i) {
  const s = [e, e + n / 2, e + n], o = [t, t + i / 2, t + i], r = [];
  for (const a of s) for (const l of o) (a !== s[1] || l !== o[1]) && r.push({ x: a, y: l });
  return r;
}
function kp(e, t, n, i, s) {
  const o = xp(t, n, i, s);
  if (!o.every((a) => pe(e, a)) || e.some((a) => a.x > t && a.x < t + i && a.y > n && a.y < n + s)) return null;
  let r = 1 / 0;
  for (const a of o)
    for (let l = 0; l < e.length; l++) r = Math.min(r, ht(a, e[l], e[(l + 1) % e.length]));
  return r;
}
function Mp(e, t, n, i, s) {
  const o = t.placement.mode === "wall", r = o ? $p(n.normal ?? n.dir) : "right";
  let a = null, l = 1 / 0;
  for (const p of e.zones) {
    const f = nt(e, p);
    if (f.length < 3 || !pe(f, n.pt)) continue;
    const m = Math.abs(mt(f));
    m < l && (l = m, a = f);
  }
  if (!a) return r;
  const c = (p) => {
    const f = nl(p, i, s);
    return kp(a, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, u = (p) => {
    let f = null, m = -1;
    for (const b of p) {
      const w = c(b);
      w !== null && w > m && (f = b, m = w);
    }
    return f;
  }, d = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const p = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = d.filter((b) => p ? b.startsWith(r) : b.endsWith(r));
    return u(m) ?? u(p ? ["right", "left"] : ["down", "up"]) ?? (c(f) !== null ? f : r);
  }
  return u(["right", "left"]) ?? u(d) ?? u(["down", "up"]) ?? r;
}
const st = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function ft(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
function il(e) {
  return e === null ? "—" : `${e.toFixed(1)} ${h("unit.m2")}`;
}
const Ze = 12, F = "non-scaling-stroke", _p = 7, Sp = 10, In = "#f43f5e", Ho = "3 2", Ro = 18, Ap = 6, Bo = 11, Ep = 0.6, Ip = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", sl = 24, Je = 4, Fo = 4, pn = Ze * 0.85, Pp = 0.58;
function Cp(e, t, n, i) {
  const s = sl;
  if (!t) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), a = Math.abs(Math.sin(o)), [l, c] = e.shape === "circle" ? [e.diameter / Math.SQRT2, e.diameter / Math.SQRT2] : [e.width * r + e.depth * a, e.width * a + e.depth * r], u = l * i - 2 * Fo, d = c * i - 2 * Fo, p = t.length * Pp * pn, f = s + Je + pn, m = s + Je + p, b = Math.max(s, p), w = (M, k) => Math.max(0, M - u) + Math.max(0, k - d), g = w(b, f), $ = w(m, s);
  if (g > 0 && $ < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Je) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -f / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + s / 2) / i,
    labelX: 0,
    labelY: (x + s + Je + pn / 2) / i,
    labelAnchor: "middle"
  };
}
function Lp(e, t, n, i = 0, s = 0) {
  const o = sl / t;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${Ip} fill=${n}></path></g>`;
}
const Op = "__preview__", zp = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Np = /* @__PURE__ */ new WeakMap();
function Vp(e, t) {
  var s;
  const n = ft(Np, e.walls, () => /* @__PURE__ */ new WeakMap()), i = ft(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = ft(i, e.openings, () => ({})))[t] ?? (s[t] = pa(e, t));
}
const Dp = /* @__PURE__ */ new WeakMap();
function ol(e, t) {
  const n = jn(t.props.kind);
  if (!n) return [];
  const i = Vp(e, n), s = ft(Dp, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = kd(e, t, () => i), s.set(t, o)), o;
}
function Pn(e, t) {
  return e.props.kind === "ceiling_light" && e.props.shape === "round" ? Math.max(e.props.diameter / 2, t) : t;
}
function Tp(e, t, n, i, s, o = n, r = !1) {
  const a = e.props, l = { stroke: n, fill: i }, c = s ?? y;
  switch (a.kind) {
    case "ceiling_light":
      return a.shape === "linear" ? _`<rect class="icon" x=${-a.length / 2} y=${-a.width / 2} width=${a.length} height=${a.width}
          fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>` : a.shape === "spot" ? _`<circle class="icon" r=${t / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${F}></circle>` : _`<circle class="icon" r=${Pn(e, t)} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${l.fill} stroke=${l.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "motion_sensor": {
      const u = (d) => `M${t * d} ${-t * d * 0.8}A${t * d} ${t * d * 0.8} 0 0 1 ${t * d} ${t * d * 0.8}`;
      return _`<circle class="icon" r=${t * 0.6} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let d = 0; d < 8; d++) {
        const p = d * Math.PI / 4;
        u += `M${Math.cos(p) * t * 1.15} ${Math.sin(p) * t * 1.15}L${Math.cos(p) * t * 1.6} ${Math.sin(p) * t * 1.6}`;
      }
      return _`<circle class="icon" r=${t * 0.7} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${l.fill}
        stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-t} ${-t * 0.6}L${t} ${t * 0.6}L${t} ${-t * 0.6}L${-t} ${t * 0.6}Z`} fill=${l.fill}
        stroke=${l.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${t * 0.7} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="drop" d=${`M0 ${-t * 0.4}Q${t * 0.3} ${t * 0.05} 0 ${t * 0.3}Q${-t * 0.3} ${t * 0.05} 0 ${-t * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${F}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${F}></rect>
        <circle class="dot" r=${t * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${t} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let d = 0; d < 4; d++) {
        const p = d * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * t * 0.85} ${Math.sin(p) * t * 0.85}`;
      }
      return _`<circle class="icon" r=${t} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    default:
      return _`${y}`;
  }
}
function Hp(e, t, n, i, s, o) {
  const r = e.props;
  if (r.kind !== "equipment") return _`${y}`;
  const a = Cp(r, r.label, i, t.scale), l = o ?? y, c = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${l} vector-effect=${F}></circle>
      ${s ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : y}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${l} vector-effect=${F}></rect>
      ${s ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : y}`;
  return _`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${Lp(r.icon, t.scale, n, a.iconX, a.iconY)}
    <text class="equipment-label" x=${a.labelX} y=${a.labelY} text-anchor=${a.labelAnchor} dominant-baseline="middle"
      font-size=${pn / t.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function Rp(e, t, n = 0) {
  return e === "bound" ? y : _`<circle class=${`bind-ring bind-${e}`} r=${Math.max(Ze * 1.7 / t, n + 4 / t)} fill="none" style=${`stroke:${zp[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : y} vector-effect=${F}></circle>`;
}
function Bp(e, t, n) {
  if (e.status !== "error") return y;
  const i = t * 0.9, s = -t * 0.9, o = Sp / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${_p / n.scale} fill=${n.palette.background} stroke=${In} stroke-width="1.5"
      vector-effect=${F}></circle>
    <path d=${Ja} fill=${In} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function Fp(e, t) {
  return e === "motion" ? t.motionCone : e === "leak" ? In : e === "event" ? t.selection : t.device;
}
function Up(e, t, n, i, s, o) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return y;
  const a = 1 / o.scale, l = r.map(([w]) => (w.text.length * Bo * Ep + 2 * Ap) * a), c = Ro * a, u = (Ro + 2) * a, d = { w: Math.max(...l), h: c + u * (r.length - 1) }, p = s + 4 * a, f = Math.max(1, i.shown.length), m = Mp(e, t, n, { w: Math.max(...l.slice(0, f)), h: c + u * (f - 1) }, p), b = nl(m, d, p);
  return _`${r.map(([w, g], $) => {
    const x = l[$], M = b.x + (d.w - x) / 2, k = b.y + (m.startsWith("up") ? r.length - 1 - $ : $) * u, A = Fp(w.tone, o.palette);
    return Wu(`${g}:${w.key ?? ""}`, _`<g class=${`bubble ${g}`} data-tone=${w.tone}>
      <rect x=${M} y=${k} width=${x} height=${c} rx=${c / 2} fill=${o.palette.background} stroke=${A} stroke-width="1.5"
        vector-effect=${F}></rect>
      <text x=${M + x / 2} y=${k + c / 2} text-anchor="middle" dominant-baseline="central" fill=${A} font-weight="700"
        font-size=${Bo * a} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function jp(e, t) {
  const n = e.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Pn(e, Ze / t.scale);
}
function Wp(e, t, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, t), o = s ? Up(e, t, n, s, jp(t, i), i) : y;
  return o === y ? y : _`<g class="device-bubbles" data-id=${t.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : y}>${o}</g>`;
}
function qp(e, t, n, i) {
  var x, M, k;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Ze / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === e.id, c = !i && Dn(e.props.kind), u = c ? (M = n.containerState) == null ? void 0 : M.call(n, e) : void 0, d = i || (k = n.live) == null ? void 0 : k.call(n, e), p = (d == null ? void 0 : d.look) === "on" || (d == null ? void 0 : d.look) === "active", f = c && !!n.containerState && !u || (d == null ? void 0 : d.look) === "no-data", m = e.props.kind, b = !p || e.invalid ? o : m === "leak_sensor" ? In : m === "motion_sensor" ? s.motionCone : o, w = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : y, $ = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : Math.max(r * 1.6, Pn(e, r));
  return _`
    <g class=${w} data-id=${e.id} opacity=${g} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? _`<circle class="selection-ring" r=${$ + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${F}></circle>` : y}
      ${e.props.kind === "equipment" ? Hp(e, n, o, a, p, f ? Ho : void 0) : _`<g transform=${`rotate(${a})`}>${Tp(
    e,
    r,
    b,
    p ? b : s.deviceFill,
    f ? Ho : void 0,
    p ? s.deviceFill : b,
    (d == null ? void 0 : d.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? Rp(n.bindingStatus(e), n.scale, Pn(e, r)) : y}
      ${u ? Bp(u, r, n) : y}
    </g>`;
}
function Uo(e, t, n, i) {
  const s = ol(e, t);
  if (s.length === 0) return y;
  const o = n.palette, r = t.invalid ? o.invalid : jn(t.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : y, l = s.map(st).join("");
  return t.props.kind === "ceiling_light" ? _`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${F}></path>` : _`<path class="cone" d=${l} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${a}
    vector-effect=${F}></path>`;
}
function Zp(e, t, n, i) {
  const s = ol(e, t);
  let o = 0;
  for (const c of s) for (const u of c) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = Ze * 3 / i.scale);
  const r = `lg-${t.id}`, a = i.palette.device, l = i.dim ? String(i.palette.dimOpacity) : y;
  return _`<g class="light-live" opacity=${l}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${a} stop-opacity="0.35"></stop><stop offset="1" stop-color=${a} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? _`<path class="light-fill" d=${s.map(st).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Kp(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return y;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? Ti(e, i, t.scale) : null;
  if (!s) return y;
  const o = t.palette.selection;
  return _`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : y}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${F}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${F} style="cursor:grab"></circle>
  </g>`;
}
function Gp(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Op, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!t.showCones) return y;
    if (t.live && !i.preview) {
      const s = t.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? Zp(e, i.d, i.pose, t) : y : o === "motion_sensor" && s === "active" ? Uo(e, i.d, t, !1) : y;
    }
    return Uo(e, i.d, t, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => qp(i.d, i.pose, t, i.preview))}</g>
    ${Kp(e, t)}
    ${t.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? y : Wp(e, i.d, i.pose, t))}</g>` : y}`;
}
const jo = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Es = (e) => jo[e % jo.length], qt = "non-scaling-stroke", Xp = "0.55", Yp = /* @__PURE__ */ new WeakMap();
function Qp(e, t, n, i) {
  const s = i.palette, o = Es(n), r = i.selectedId === t.id, a = ft(Yp, e, xa).get(t.id), l = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${t.id}>
      <path class=${`zone${t.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${t.id}
        d=${st(nt(e, t))} fill=${t.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${t.invalid ? y : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${qt}
        opacity=${i.selectedId !== null && !r ? Xp : y}></path>
      ${a ? _`<text class="zone-label" x=${a.x} y=${a.y} text-anchor="middle" font-size=${l} font-family="system-ui, sans-serif">
        <tspan x=${a.x} dy=${-0.2 * l} font-weight="600" fill=${t.invalid ? s.invalid : s.text}>${t.name}</tspan>
        <tspan x=${a.x} dy=${1.2 * l} font-size=${l * 0.9} fill=${s.zoneLabel}>${il(fs(e, t))}</tspan>
      </text>` : y}
    </g>`;
}
function Jp(e, t) {
  const n = t.palette, i = e.zones.map((o, r) => ({ z: o, i: r }));
  if (t.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => _`
      <path class="zone" data-id=${o.id} d=${st(nt(e, o))} fill="none" stroke=${Es(r)} stroke-width="1"
        vector-effect=${qt}></path>`)}</g>`;
  const s = 8 / t.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Qp(e, o, r, t))}</g>`;
}
function tf(e, t, n) {
  const i = n.palette, s = 14 / n.scale;
  return _`<g class="zone-members">${$a(e, t).map(({ device: o, participates: r }) => {
    const a = Q(e, o);
    return a ? r ? _`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${qt}></circle>` : _`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${qt}></circle>` : y;
  })}</g>`;
}
function ef(e, t, n) {
  if (t.shape.kind !== "polygon") return y;
  const i = n.palette, s = t.shape.vertices;
  return _`${nt(e, t).map((o, r) => {
    const a = s[r], l = a.kind === "free" && a.lost === !0, c = n.vertex === r;
    return _`<circle class=${`zone-vertex${l ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${l ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${qt}></circle>`;
  })}`;
}
function nf(e, t) {
  const n = e.cursor ? [...e.points, e.cursor] : e.points;
  return _`<polyline class=${`zone-draft${e.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${e.invalid ? t.palette.invalid : t.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${qt}></polyline>`;
}
function sf(e, t) {
  const n = t.selectedId === null ? void 0 : e.zones.find((i) => i.id === t.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${st(nt(e, n))} fill="none"
      stroke=${t.palette.selection} stroke-width="2.5" vector-effect=${qt}></path>` : y}
    ${n ? tf(e, n.id, t) : y}
    ${n ? ef(e, n, t) : y}
    ${t.draft ? nf(t.draft, t) : y}</g>`;
}
function jt(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
const of = /* @__PURE__ */ new WeakMap(), rf = /* @__PURE__ */ new WeakMap(), rl = /* @__PURE__ */ new WeakMap();
function ei(e, t, n) {
  const i = X(e.dir), s = z(e.a, E(e.dir, t)), o = z(e.a, E(e.dir, n));
  return [z(s, E(i, e.leftOff)), z(o, E(i, e.leftOff)), I(o, E(i, e.rightOff)), I(s, E(i, e.rightOff))];
}
function Be(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = J(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const W = "non-scaling-stroke";
function af(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = Be(e, a.id);
    if (!l) continue;
    const c = X(l.dir);
    for (const [u, d, p] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const f = e.nodes.find((k) => k.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const m = z(d, E(c, l.leftOff + i)), b = I(d, E(c, l.rightOff + i)), w = E(c, 1), g = E(z(m, b), 0.5), $ = z(I(g, E(w, -o)), E(p, s / 2)), x = I(I(g, E(w, o)), E(p, s / 2)), M = [m, $, x, b];
      r.push(_`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${W}></path>`);
    }
  }
  return r.length ? _`${r}` : y;
}
function lf(e, t, n) {
  const i = X(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], c = z(z(e.a, E(e.dir, a)), E(o, r)), u = z(z(e.a, E(e.dir, l)), E(o, r)), d = z(c, E(o, t.width)), p = et(I(d, c), I(u, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>
    <path d=${`M${d.x} ${d.y}A${t.width} ${t.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${W}></path>`;
}
function cf(e, t, n) {
  const i = X(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = z(z(e.a, E(e.dir, t.offset)), E(i, r)), l = z(z(e.a, E(e.dir, t.offset + t.width)), E(i, r));
    return _`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>`;
  });
  return _`${o}`;
}
function df(e, t, n) {
  const i = Be(e, t.wallId);
  if (!i) return y;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = ei(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return _`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${st(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? lf(i, t, o) : t.kind === "window" ? cf(i, t, o) : y}
    </g>`;
}
function Wo(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = z(e, E(n, i)), l = z(t, E(n, i)), c = (d, p) => {
    const f = z(p, E(n, i + r));
    return _`<line x1=${d.x} y1=${d.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${W}></line>`;
  }, u = z(E(z(a, l), 0.5), E(n, 9 / s.scale));
  return _`
    <g class="dim">
      ${c(z(e, E(n, 2 / s.scale)), e)}${c(z(t, E(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${W}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${jt(L(e, t))}</text>
    </g>`;
}
function uf(e, t) {
  const n = t.selection;
  if (!n) return y;
  const i = t.palette, s = 4 / t.scale, o = (r) => _`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : y;
  }
  if (n.kind === "wall") {
    const r = ft(rl, e, Bn).get(n.id), a = Be(e, n.id);
    if (!r || !a) return y;
    const l = X(a.dir);
    return _`
      <path d=${st(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${W}></path>
      ${o(a.a)}${o(a.b)}
      ${Wo(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((p) => p.id === n.id), a = r ? Be(e, r.wallId) : null;
    if (!r || !a) return y;
    const l = E(X(a.dir), -1), c = a.rightOff + 18 / t.scale, u = (p) => z(a.a, E(a.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return _`
      <path d=${st(ei(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${W}></path>
      ${d.filter(([p, f]) => f - p >= 1).map(([p, f]) => Wo(u(p), u(f), l, c, t))}`;
  }
  return y;
}
function pf(e, t, n) {
  return L(e, t) < 1e-6 ? null : ei(Fr(e, t, n.thickness, n.baseline), 0, L(e, t));
}
function ff(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? Be(e, r.wallId) : null;
  return _`
    ${o ? _`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${W}></path>` : y}
    ${(n.walls ?? []).map((l) => {
    const c = pf(l.a, l.b, l.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${st(c)} fill=${i.selection} fill-opacity="0.35"></path>` : y}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${W}></line></g>`;
  })}
    ${r && a ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${st(ei(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : y}
    ${mf(e, t)}`;
}
function hf(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return _`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${W}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${W}></rect></g>`;
}
function mf(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? hf(n.anchor, t) : y, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / t.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = y;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    u = _`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${a - f} y=${l - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${W}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${a} ${l - f}L${a + f * 0.866} ${l + f / 2}L${a - f * 0.866} ${l + f / 2}Z`;
    u = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${W}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), m = `M${a} ${l - f}L${a + f} ${l}L${a} ${l + f}L${a - f} ${l}Z`;
    u = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${W}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${W}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), m = `M${a - f} ${l - f}L${a + f} ${l + f}M${a - f} ${l + f}L${a + f} ${l - f}`;
    u = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${W}></path></g>`;
    const b = o.endpoint.kind === "wall" ? ft(rl, e, Bn).get(o.endpoint.wallId) : void 0;
    b && (d = _`<path class="snap-wall-hl" d=${st(b)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${W}></path>`);
  } else {
    const f = r(4), m = `M${a - f} ${l}H${a + f}M${a} ${l - f}V${l + f}`;
    u = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${W}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return _`
    ${d}${s}${u}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${W} font-family="system-ui, sans-serif">${p}</text>`;
}
function gf(e, t) {
  var p;
  const n = t.preview.level ?? e, i = t.palette, s = ft(of, n, (f) => qr(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? ft(rf, n, ls) : null, a = t.selection, l = (t.mode ?? "plan") === "plan", c = l ? y : String(i.dimOpacity), u = (a == null ? void 0 : a.kind) === "zone" ? a.id : null, d = t.mode ?? "plan";
  return _`
    ${Jp(n, { palette: i, scale: t.scale, selectedId: u, mode: d })}
    <path class="walls" d=${s.map((f) => f.map(st).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? _`<g class="railings" opacity=${c}>${o.flatMap((f) => (r.get(f.id) ?? []).map((m) => _`<path d=${st(m)} fill=${i.railing}></path>`))}</g>` : y}
    <g class="openings" opacity=${c}>${n.openings.map((f) => df(n, f, t))}</g>
    <g class="wall-breaks" opacity=${c}>${af(n, t)}</g>
    ${l ? sf(n, {
    palette: i,
    scale: t.scale,
    selectedId: u,
    draft: t.preview.zoneDraft,
    vertex: ((p = t.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? t.preview.zoneVertex.index : null
  }) : y}
    <g class="devices-layer">${l ? y : Gp(n, {
    palette: i,
    scale: t.scale,
    selection: a,
    showCones: t.showCones ?? !0,
    dim: !1,
    preview: t.preview.device,
    ...d === "binding" ? { bindingStatus: t.bindingStatus, containerState: t.containerState, live: t.live, bubbles: t.bubbles } : {}
  })}</g>
    <g class="selection">${uf(n, t)}</g>
    <g class="preview">${ff(n, t)}</g>`;
}
const dt = "non-scaling-stroke", Fe = "system-ui, sans-serif", wf = 13, _e = 9, bf = 11, qo = 18, yi = 12, vi = 11, tn = 13, yf = 3, fn = 10, Zo = 4.5, vf = 12, $f = 11.5, Is = 10, $i = 10.5, xf = 6, kf = {
  IN: lp,
  OUT: tl,
  BAT: cp,
  PV: el
}, Ko = { dead: 0, nodata: 1, idle: 2, live: 3 };
function te(e) {
  if (e == null || !Number.isFinite(e)) return "—";
  const t = Math.round(e);
  if (t === 0) return "0 W";
  const n = e < 0 ? "−" : "";
  return Math.abs(t) < 1e3 ? `${n}${Math.abs(t)} W` : `${n}${(Math.abs(e) / 1e3).toFixed(2)} kW`;
}
const xi = (e, t) => e == null || !Number.isFinite(e) ? "—" : `${Math.round(e)} ${t}`;
function Mf(e) {
  return e ? e.state === "dead" ? "dead" : e.power === null ? "nodata" : Math.abs(e.power) >= 1 ? "live" : "idle" : "nodata";
}
function Ke(e, t) {
  return { live: t.powerLive, idle: t.powerIdle, dead: t.powerDead, nodata: t.powerNoData }[e];
}
const _f = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Sf = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, al = (e, t, n, i) => _`<path class=${e} d=${t} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${dt}>${i ? y : Sf}</path>`, ll = (e) => `M${e.map((t) => `${t.x} ${t.y}`).join("L")}`, le = (e, t, n, i) => _`<path d=${e} fill=${i} transform=${`translate(${t.x - n / 2} ${t.y - n / 2}) scale(${n / 24})`}></path>`;
function Af(e, t) {
  var c;
  const n = (c = e.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? qe : _e, s = e.pts[0], o = e.pts[e.pts.length - 1], r = fn / 2 / t.scale, a = 3 / t.scale, l = e.pts.slice(1).map((u, d) => ({ p: e.pts[d], q: u, len: Math.abs(u.x - e.pts[d].x) + Math.abs(u.y - e.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of l) {
    if (p < 2 * r + 2 * a) continue;
    const f = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, m = (w, g) => Math.hypot(f.x - w.x, f.y - w.y) >= g + r + a;
    if (!m(s, i(e.w.from)) || !m(o, i(e.w.to))) continue;
    const b = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((b + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function Ef(e, t, n) {
  var c;
  const i = t.palette, s = Ke(e.style, i), o = ll(e.pts), r = ((c = t.selection) == null ? void 0 : c.kind) === "powerWire" && t.selection.id === e.w.id, a = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[e.style], l = Af(e, t);
  return _`<g data-wire=${e.w.id}>
    ${r ? _`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${dt}></path>` : y}
    ${e.style === "live" ? al("glow", o, s, n) : y}
    <path class=${`wire ${e.style}`} d=${o} fill="none" stroke=${s} stroke-width=${a}
      stroke-dasharray=${e.style === "nodata" ? "5 4" : y} stroke-linejoin="round" vector-effect=${dt}></path>
    ${l ? _`<path class="arrow" d=${`M${fn / 2} 0L${-fn / 2} ${-Zo}L${-fn / 2} ${Zo}Z`}
      fill=${s} transform=${`translate(${l.at.x} ${l.at.y}) rotate(${l.deg}) scale(${1 / t.scale})`}></path>` : y}
  </g>`;
}
function If(e, t, n) {
  const i = kf[e.name];
  return _`<g class="port" data-port=${e.name}>
    <title>${e.name}</title>
    <circle cx=${e.pt.x} cy=${e.pt.y} r=${qe} fill=${n.portFill}
      stroke=${t ? Ke(t, n) : n.blockStroke} stroke-width="1.5" vector-effect=${dt}></circle>
    ${i ? le(i, e.pt, wf, n.portIcon) : _`<text x=${e.pt.x} y=${e.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Fe}>${e.name}</text>`}
  </g>`;
}
function Pf(e, t) {
  const n = Math.max(4, Math.floor(t / (Is * 0.55)));
  return e.length <= n ? e : `${e.slice(0, n - 1)}…`;
}
function Cf(e, t, n, i) {
  const s = t.map((a) => {
    const l = e.blocks.find((c) => c.id === a);
    return l ? Yn(l, n) || h(`power.kind.${l.kind}`) : a;
  }), o = h("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", Pf(s[0], i - 12 - o.replace("{name}", "").length * Is * 0.55)) : h("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function Lf(e, t, n, i, s, o) {
  var l;
  const r = () => ({ kind: "text", value: te(i == null ? void 0 : i.power) }), a = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (t.kind) {
    case "grid":
      return t.voltage ? [r(), { kind: "text", value: xi(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(t.deviceId);
      if (!c) return [{ kind: "text", value: h("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = ue(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: h("power.in"), value: te(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: h("power.out"), value: te(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: xi(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(a(sa(c))), d && p.push({ kind: "text", label: h("power.loss"), value: te(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: xi(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: s.blockInvalid }] : (l = i == null ? void 0 : i.absorbed) != null && l.length ? [r(), Cf(e, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function Of(e, t, n) {
  const i = e.state ?? "unknown", s = e.controllable ? 0 : yi + 3, o = t.x - s / 2, r = `${h(`power.switch.${i}`)}${e.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : y}>
    <title>${r}</title>
    ${le(
    i === "on" ? tp : Ju,
    { x: o, y: t.y },
    qo,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${e.controllable ? y : le(op, { x: o + qo / 2 + 3 + yi / 2, y: t.y + 1 }, yi, n.blockValue)}
  </g>`;
}
function Go(e, t, n) {
  switch (t) {
    case "top":
      return n.x - e.x;
    case "right":
      return e.w + (n.y - e.y);
    case "bottom":
      return e.w + e.h + (e.x + e.w - n.x);
    case "left":
      return 2 * e.w + e.h + (e.y + e.h - n.y);
  }
}
function zf(e, t, n) {
  const i = 2 * (e.w + e.h), s = Go(e, t.side, t.pt), o = ((Go(e, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, a = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: e.x, y: e.y } },
    { t: e.w, pt: { x: e.x + e.w, y: e.y } },
    { t: e.w + e.h, pt: { x: e.x + e.w, y: e.y + e.h } },
    { t: 2 * e.w + e.h, pt: { x: e.x, y: e.y + e.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < a).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [t.pt, ...c, n.pt];
}
function Nf(e, t, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return y;
  const a = Qn(e, t, i.geo), l = a.find((f) => f.name === r), c = a.find((f) => f.name === (t.form === "2in1out" ? "OUT" : "IN"));
  if (!l || !c) return y;
  const u = s(c.name) ?? "nodata", d = Ke(u, i.palette), p = ll(zf(gt(t, i.geo, e), l, c));
  return _`${u === "live" ? al("ts-glow", p, d, o) : y}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : y}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${dt}></path>`;
}
function Vf(e, t, n, i) {
  const s = i.palette;
  return Xa(t, i.geo, e).map(({ position: o, rect: r }) => {
    const a = (n == null ? void 0 : n.position) === o;
    return _`<g class=${a ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${a ? s.accent : "none"}
        stroke=${a ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${dt}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${a ? s.accentText : s.blockValue} font-family=${Fe}>${o}</text>
    </g>`;
  });
}
function Df(e) {
  const t = /^unavailable:(.*)$/.exec(e);
  return t ? h("power.alert.unavailable").replace("{entity}", t[1]) : e === "missing-device" ? h("power.alert.missingDevice") : e === "disagree" ? h("power.alert.disagree") : e;
}
function Tf(e, t, n, i) {
  const s = yf + tn / 2, o = [
    { x: t.x + t.w - s, y: t.y + s },
    { x: t.x + t.w - s, y: t.y + t.h - s },
    { x: t.x + s, y: t.y + t.h - s },
    { x: t.x + s, y: t.y + s }
  ], r = (l) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - l.x) - tn / 2, 0), d = Math.max(Math.abs(c.y - l.y) - tn / 2, 0);
    return Math.hypot(u, d) > qe;
  }), a = o.find(r) ?? o[0];
  return _`<g class="alert"><title>${e.map(Df).join(`
`)}</title>
    ${le(Ja, a, tn, i.blockInvalid)}</g>`;
}
function Hf(e, t, n, i, s) {
  var b, w;
  const o = n.palette, r = gt(t, n.geo, e), a = (b = n.frame) == null ? void 0 : b.blocks[t.id], l = t.kind === "device" ? n.geo.device(t.deviceId) : void 0, c = t.kind === "device" && !l, u = r.x + r.w / 2, d = Yn(t, n.geo) || h(`power.kind.${t.kind}`), p = Lf(e, t, n.geo, a, o, r.w), f = t.kind === "remainder", m = Qn(e, t, n.geo);
  return _`<g class=${`block block-${t.kind}${c ? " missing" : ""}`} data-id=${t.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : y} vector-effect=${dt}></rect>
    ${t.kind === "transfer" ? Nf(e, t, a, n, (g) => i(t.id, g), s) : y}
    ${l && l.placement.mode !== "none" ? _`<g class="pin"><title>${h("power.planDevice")}</title>
      ${le(rp, { x: r.x + 4 + vi / 2, y: r.y + 4 + vi / 2 }, vi, o.blockValue)}</g>` : y}
    <text class="name" x=${u} y=${r.y + An - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${vf} font-weight="600" fill=${o.blockName} font-family=${Fe}>${d}</text>
    ${p.map((g, $) => {
    const x = r.y + An + $ * Sn + Sn / 2;
    if (g.kind === "chips") return t.kind === "transfer" ? Vf(e, t, a, n) : y;
    if (g.kind === "switch") return Of(g, { x: u, y: x }, o);
    const M = g.fill ?? o.blockValue, k = g.label ? _`<tspan>${g.label} </tspan>` : y, A = g.note ? _`<tspan> ${g.note}</tspan>` : y;
    return _`<text x=${u} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? Is : $f}
        fill=${M} font-family=${Fe}>${g.title ? _`<title>${g.title}</title>` : y}${k}<tspan
        font-weight=${g.small ? y : "600"}>${g.value}</tspan>${A}</text>`;
  })}
    ${(w = a == null ? void 0 : a.alert) != null && w.length ? Tf(a.alert, r, m, o) : y}
    ${m.map((g) => If(g, i(t.id, g.name), o))}
  </g>`;
}
function Rf(e, t, n, i) {
  const s = i.palette, o = e.w >= e.h, r = o ? e.x : e.y, a = r + (o ? e.w : e.h), l = o ? e.h : e.w;
  let c = y;
  const u = e.name ?? "", d = Math.min($i, l - 4), p = d >= xf, f = u.length * (p ? d : $i) * 0.58 + 12;
  if (u) {
    const m = t.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let b = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, a + _e]) {
      const $ = Math.min(g - _e, a);
      $ - w > b.hi - b.lo && (b = { lo: w, hi: $ }), w = Math.max(w, g + _e);
    }
    if (b.hi - b.lo >= f) {
      const g = (b.lo + b.hi) / 2, $ = o ? { x: g, y: p ? e.y + e.h / 2 : e.y - 7 } : { x: p ? e.x + e.w / 2 : e.x - 7, y: g };
      c = _`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : $i} fill=${s.blockValue} font-family=${Fe}
        transform=${o ? y : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${e.id}>
    <rect class="body" x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="2" fill=${s.blockFill}
      stroke=${n ? Ke(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${dt}></rect>
    ${c}
  </g>`;
}
function Bf(e, t, n) {
  return _`<g class="terminal">
    <circle cx=${e.x} cy=${e.y} r=${_e} fill=${n.portFill} stroke=${Ke(t, n)} stroke-width="1.5"
      vector-effect=${dt}></circle>
    ${le(Xu, e, bf, n.portIcon)}
  </g>`;
}
function Ff(e, t) {
  const n = t.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return y;
  const i = e.blocks.find((r) => r.id === n.id);
  if (!i) return y;
  const s = gt(i, t.geo, e), o = 4 / t.scale;
  return _`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${t.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${dt}></rect>`;
}
function Uf(e, t) {
  var p;
  const n = t.preview.power ?? e, i = t.palette, s = [];
  for (const f of n.wires) {
    const m = Ka(n, f, t.geo);
    if (!m) continue;
    const b = (p = t.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: Ga(m.a, m.b), live: b, style: Mf(b) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = [];
  for (const f of s)
    for (const [m, b] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Ko[f.style] > Ko[w]) && r.set(m.bus, f.style), a.set(m.bus, [...a.get(m.bus) ?? [], b.pt]), l.push({ at: b.pt, style: f.style });
    }
  const c = (f, m) => o.get(`${f}:${m}`), u = _f(), d = t.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? Rf(f, a.get(f.id) ?? [], r.get(f.id), t) : y)}</g>
    <g class="wires">${s.map((f) => Ef(f, t, u))}</g>
    ${Ff(n, t)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? y : Hf(n, f, t, c, u))}</g>
    <g class="terminals">${l.map((f) => Bf(f.at, f.style, i))}</g>
    ${d ? _`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${dt}></line>` : y}
  </g>`;
}
const jf = {
  background: "#0b1220",
  grid: "#1c2840",
  gridMajor: "#26355a",
  wall: "#cbd5e1",
  railing: "#94a3b8",
  zoneLabel: "#94a3b8",
  window: "#38bdf8",
  door: "#94a3b8",
  selection: "#60a5fa",
  invalid: "#f43f5e",
  snap: "#facc15",
  dim: "#94a3b8",
  device: "#fbbf24",
  deviceFill: "#1e293b",
  cone: "#fbbf24",
  motionCone: "#a78bfa",
  breakLine: "#94a3b8",
  dimOpacity: 0.35,
  powerLive: "#38bdf8",
  powerIdle: "#2f6f93",
  powerDead: "#475569",
  powerNoData: "#64748b",
  powerRemainder: "#fbbf24",
  blockFill: "#121b2f",
  blockStroke: "#3b4a66",
  blockName: "#e2e8f0",
  blockValue: "#b4c0d3",
  blockInvalid: "#fb7185",
  portFill: "#0b1220",
  portIcon: "#cbd5e1",
  panel: "#0f172a",
  border: "#1e293b",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#1d4ed8",
  accentText: "#ffffff",
  input: "#111a2e",
  inputBorder: "#334155"
}, Wf = {
  background: "#f3efe8",
  grid: "#e6dfd4",
  gridMajor: "#d8cfc1",
  wall: "#2b2622",
  railing: "#7a7067",
  zoneLabel: "#7a7067",
  window: "#4a9fd0",
  door: "#7a7067",
  selection: "#2563eb",
  invalid: "#e5484d",
  snap: "#d97706",
  dim: "#6b6258",
  device: "#b45309",
  deviceFill: "#fffbeb",
  cone: "#d97706",
  motionCone: "#7c3aed",
  breakLine: "#7c7368",
  dimOpacity: 0.4,
  powerLive: "#0284c7",
  powerIdle: "#7fb3d1",
  powerDead: "#b3a999",
  powerNoData: "#998f84",
  powerRemainder: "#b45309",
  blockFill: "#ffffff",
  blockStroke: "#c9bfb1",
  blockName: "#2b2622",
  blockValue: "#5c534b",
  blockInvalid: "#cd2b31",
  portFill: "#ffffff",
  portIcon: "#4a423b",
  panel: "#faf7f2",
  border: "#e0d8cc",
  text: "#2b2622",
  muted: "#8a8076",
  accent: "#2563eb",
  accentText: "#ffffff",
  input: "#ffffff",
  inputBorder: "#d6cfc4"
};
function qf(e) {
  return e ? jf : Wf;
}
class Zf extends ti {
  constructor(t) {
    if (super(t), t.type !== Et.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? lt : (As(t), n);
  }
}
const Z = Jn(Zf), Fi = 1, Xo = 1e-6;
function Kf(e, t, n, i, s) {
  const o = (l) => l > Xo && l < s - Xo, r = new Set(e.nodes.filter((l) => {
    var c;
    return ((c = l.host) == null ? void 0 : c.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const c = Rn(e, l).host.offset;
    o(c) && a.push({ t: c, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((b) => b === t.a || b === t.b || r.has(b))) continue;
    const c = q(e, l.a), u = q(e, l.b), d = L(c, u), p = d === 0 ? null : pt(n, i, c, I(u, c));
    if (!p) continue;
    const f = Hn(p, c, u) * d;
    if (f < -Fi || f > d + Fi) continue;
    const m = H(I(p, n), i);
    o(m) && a.push({ t: m, wall: l, pt: p });
  }
  return a;
}
function Yo(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Qo(e, t) {
  if ("nodeId" in t)
    return delete Rn(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (L(q(e, o), t.pt) <= Fi) return o;
  const { pt: n, offset: i } = qn(e, t.wall, t.pt), s = { id: K(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function Gf(e, t, n) {
  const i = e.walls.find((g) => g.id === t);
  if (!i) return e;
  const s = q(e, i.a), o = q(e, i.b), r = L(s, o), a = Tn(I(o, s)), l = H(I(n, s), a), c = Kf(e, i, s, a, r), u = Yo(c.filter((g) => g.t < l), l), d = Yo(c.filter((g) => g.t > l), l);
  if (!u && !d) return xs(e, t);
  const p = bt(e), f = p.walls.find((g) => g.id === t);
  let m = t, b = 0;
  if (d) {
    const g = Qo(p, d);
    if (b = H(I(q(p, g), s), a), u) {
      const $ = { ...f, id: K(), a: g };
      p.walls.push($), m = $.id;
    } else
      f.a = g;
  }
  u && (f.b = Qo(p, u));
  const w = (g, $) => g.wallId !== t || u && $ <= u.t ? !0 : !d || $ < d.t ? !1 : (g.wallId = m, g.offset -= b, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : ms(x)));
  }
  return Zn(p), St(p, e);
}
function Ps(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Xf(e, t, n) {
  return z(e, E(Tn(I(t, e)), n));
}
function en(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Zt(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? Ps(r, t) : t, c = r !== void 0 && l.y === r.y, u = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let d = null;
  for (const k of e.nodes) {
    if (a.has(k.id)) continue;
    const A = { x: k.x, y: k.y }, P = L(A, l);
    P <= i && u(A) && (!d || P < d.d) && (d = { id: k.id, pt: A, d: P });
  }
  let p = null;
  for (const k of n.corners ?? []) {
    const A = L(k.pt, l);
    A <= i && u(k.pt) && (!p || A < p.d) && (p = { c: k, d: A });
  }
  if (p && (!d || p.d < d.d)) {
    const k = p.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: p.c };
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const f = e.walls.filter((k) => !a.has(k.a) && !a.has(k.b)).map((k) => ({ w: k, f: J(e, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: A } of f) {
    const P = { x: (A.a.x + A.b.x) / 2, y: (A.a.y + A.b.y) / 2 }, O = L(P, l);
    O <= i && u(P) && (!m || O < m.d) && (m = { wallId: k.id, pt: P, offset: A.len / 2, d: O });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const b = (k) => {
    let A = null;
    for (const { w: P, f: O } of f) {
      const V = X(O.dir), U = k ? [O.leftOff, -O.rightOff].filter((N) => N !== 0) : [0];
      for (const N of U) {
        const D = z(O.a, E(V, N)), j = r ? pt(r, I(l, r), D, O.dir) : z(D, E(O.dir, H(I(l, D), O.dir)));
        if (!j) continue;
        const ot = H(I(j, D), O.dir);
        if (ot < 0 || ot > O.len) continue;
        const yt = L(j, l);
        yt <= i && (!A || yt < A.d) && (A = { d: yt, res: { pt: j, kind: "wall", endpoint: { kind: "wall", wallId: P.id, offset: ot } } });
      }
    }
    return A ? A.res : null;
  }, w = b(!1);
  if (w) return w;
  const g = b(!0);
  if (g) return g;
  const $ = n.zones ?? [];
  let x = null;
  for (const k of $)
    for (const A of k) {
      const P = L(A, l);
      P <= i && u(A) && (!x || P < x.d) && (x = { pt: A, d: P });
    }
  if (x) return en(x.pt, "zoneVertex");
  let M = null;
  for (const k of $)
    for (let A = 0; A < k.length; A++) {
      const P = k[A], O = k[(A + 1) % k.length], V = L(P, O);
      if (V < 1e-9) continue;
      const U = E(I(O, P), 1 / V), N = r ? pt(r, I(l, r), P, U) : z(P, E(U, H(I(l, P), U)));
      if (!N) continue;
      const D = H(I(N, P), U);
      if (D < 0 || D > V) continue;
      const j = L(N, l);
      j <= i && (!M || j < M.d) && (M = { pt: N, d: j });
    }
  if (M) return en(M.pt, "zoneEdge");
  if (s && s > 0) {
    const k = (P) => Math.round(P / s) * s, A = r ? c ? { x: k(l.x), y: r.y } : { x: r.x, y: k(l.y) } : { x: k(l.x), y: k(l.y) };
    return en(A, "grid");
  }
  return en(l, "none");
}
function Yf(e, t, n) {
  return t.some((i, s) => ht(e, i, t[(s + 1) % t.length]) <= n);
}
function Cs(e, t, n) {
  const i = Bn(e);
  for (const [s, o] of i) if (oe(t, o)) return s;
  for (const [s, o] of i) if (Yf(t, o, n)) return s;
  return null;
}
function Qf(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = J(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Dt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Jf(e, t, n, i) {
  const s = Qf(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((c) => c.id === a);
        if (l && L(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = Cs(e, t, n);
  return o ? { kind: "wall", id: o } : null;
}
const ni = 3, th = (e, t) => e.zones.filter((n) => n.id !== t).map((n) => nt(e, n)).filter((n) => n.length >= 3);
function cl(e, t, n, i, s) {
  if (n.alt) {
    const a = n.shift && i ? Ps(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: a.x, y: a.y }, snap: null };
  }
  const o = Zt(t, n.pt, { tolMm: e.tolMm(), grid: e.grid(), from: i, ortho: n.shift, zones: th(t, s), corners: Ur(t) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const a = o.corner, l = Gt(t, a.wallId), c = l !== null && a.offset >= -Mn && a.offset <= l + Mn, u = c ? Math.max(0, Math.min(l, a.offset)) : a.offset, d = c ? Ne(t, a.wallId, a.side, u) : null;
    if (d) return { vertex: { kind: "wall", wallId: a.wallId, offset: u, side: a.side, x: d.x, y: d.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const a = t.walls.find((l) => l.id === r.wallId);
    if (a) {
      const l = Dt(J(t, a), n.pt).side >= 0 ? "left" : "right", c = Ne(t, a.id, l, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: a.id, offset: r.offset, side: l, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function eh(e, t, n) {
  const i = [];
  for (const s of e.zones) {
    const o = nt(e, s);
    if (o.length < 3) continue;
    (o.some((a, l) => ht(t, a, o[(l + 1) % o.length]) <= n) || pe(o, t)) && i.push({ id: s.id, area: Math.abs(mt(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function dl(e, t) {
  const n = e.zones.find((i) => i.id === t);
  return n && n.shape.kind === "polygon" ? { o: nt(e, n), v: n.shape.vertices } : null;
}
function nh(e, t, n, i) {
  var r;
  const s = (r = dl(e, t)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((a, l) => {
    L(n, a) <= i && (o < 0 || L(n, a) < L(n, s[o])) && (o = l);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function ih(e, t, n, i) {
  const s = dl(e, t);
  if (!s || s.o.some((w) => L(n, w) <= i)) return null;
  const { o, v: r } = s;
  let a = -1, l = 1 / 0;
  if (o.forEach((w, g) => {
    const $ = ht(n, w, o[(g + 1) % o.length]);
    $ <= i && $ < l && (a = g, l = $);
  }), a < 0) return null;
  const c = o[a], u = o[(a + 1) % o.length], d = Math.max(0, Math.min(1, Hn(n, c, u))), p = Tr(c, u, d), f = r[a], m = r[(a + 1) % r.length], b = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + d * (m.offset - f.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: a + 1, vertex: b };
}
function sh(e, t) {
  let n = null, i = null, s = null, o = null, r = null, a = !1, l = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const w = e.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, a = !1, l = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function b(w) {
    if (!i || !s || !l && L(w.pt, c) <= ni / e.scale()) return;
    l = !0;
    const g = cl(e, s, w, i.from, i.zoneId);
    r = g.snap, a = w.shift, o = Ud(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, e.selection()];
    },
    press(w) {
      f(), u = null, c = w.pt;
      const g = p(), $ = e.level(), x = g === null ? null : nh($, g, w.pt, e.tolMm());
      return g === null || !x ? !1 : (i = { zoneId: g, ...x }, s = o = $, !0);
    },
    pick(w) {
      const g = eh(e.level(), w, e.tolMm());
      if (g.length === 0) {
        n = null, t(null);
        return;
      }
      const $ = p(), x = $ !== null && n !== null && L(w, n) <= e.tolMm() ? g.indexOf($) : -1;
      n = w, t({ kind: "zone", id: g[(x + 1) % g.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(w) {
      b(w);
    },
    up(w) {
      if (!i) return;
      b(w);
      const g = o, $ = s, x = l, M = i;
      f(), x ? g && $ && g !== $ && e.commit(g) : u = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const g = d[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const $ = e.level(), x = ih($, g.id, w.pt, e.tolMm());
      if (!x) return;
      const M = jd($, g.id, x.index, x.vertex);
      M !== $ && (e.commit(M), t(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const g = m();
      if (w === "Escape" && g)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const $ = e.level(), x = Wd($, g.zoneId, g.index);
        return x === $ ? (e.notify(h("zones.minVertices")), !0) : (u = null, e.commit(x), !0);
      }
      return !1;
    },
    preview() {
      if (i && o) {
        const g = { level: o };
        return r && (g.snap = r), a && (g.orthoFrom = i.from), g;
      }
      const w = m();
      return w ? { zoneVertex: w } : {};
    },
    cancel() {
      f(), u = null, n = null;
    }
  };
}
function oh(e) {
  let t = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const a = (f) => {
    e.select(f);
  }, l = () => {
    t = null, n = null, i = null, r = null, s = !1;
  }, c = sh(e, a), u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, d = (f, m, b) => Dt(J(f, f.walls.find((w) => w.id === m)), b).t;
  function p(f) {
    const m = t;
    if (!(!m || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const b = Zt(n, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), w = b.endpoint, g = (b.kind === "wall" || b.kind === "mid") && w.kind === "wall", $ = b.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = n.nodes.find((P) => P.id === m.nodeId), M = !!x.host && g && w.kind === "wall" && w.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const P = structuredClone(n);
          delete P.nodes.find((O) => O.id === m.nodeId).host, k = P;
        }
        let A = Yd(k, m.nodeId, u(b));
        if ($ && w.kind === "node")
          A = eu(A, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const P = n.walls.find((O) => O.id === w.wallId);
          if (P && P.a !== m.nodeId && P.b !== m.nodeId) {
            const O = structuredClone(A);
            O.nodes.find((V) => V.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, A = St(O, A);
          }
        }
        i = A;
      } else if (m.kind === "wall") {
        const b = n.walls.find(($) => $.id === m.wallId), w = Zt(n, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [b.a, b.b]
        }), g = I(w.pt, m.origin);
        i = Jd(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const b = n.openings.find((w) => w.id === m.openingId);
        i = Jr(n, b.id, d(n, b.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      l(), o = f.pt, c.note();
      const m = e.level(), b = f.ctrl ? Cs(m, f.pt, e.tolMm()) : null;
      if (b) {
        a(null), e.commit(Gf(m, b, f.pt));
        return;
      }
      if (c.press(f)) return;
      const w = e.selection(), g = Jf(m, f.pt, e.tolMm(), w);
      if (!g) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), a(g), r = n = i = m, g.kind === "node") {
        let $ = g.id;
        const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (f.alt && x) {
          const M = tu(m, x.id, x.a === g.id ? "a" : "b");
          n = i = M.level, $ = M.nodeId, a({ kind: "node", id: $ });
        }
        t = { kind: "node", nodeId: $, origin: q(n, $) };
      } else if (g.kind === "wall")
        t = { kind: "wall", wallId: g.id, origin: f.pt };
      else if (g.kind === "opening") {
        const $ = m.openings.find((x) => x.id === g.id);
        t = { kind: "opening", openingId: $.id, grab: d(m, $.wallId, f.pt) - $.offset };
      }
    },
    move(f) {
      c.active() ? c.move(f) : p(f);
    },
    up(f) {
      if (c.active()) {
        c.up(f);
        return;
      }
      t && p(f);
      const m = s, b = i, w = r;
      l(), m && b && w && b !== w && e.commit(b);
    },
    dblclick(f) {
      c.dblclick(f);
    },
    key(f) {
      return f === "Escape" && t ? (l(), !0) : c.key(f);
    },
    preview() {
      return !t || !i ? c.preview() : { level: i, orthoFrom: t.kind === "node" ? t.origin : void 0 };
    },
    cancel() {
      l(), c.cancel();
    }
  };
}
function Ue(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function ul() {
  let e = "", t = "", n = "first";
  const i = () => {
    e = "", t = "", n = "first";
  }, s = () => e !== "" || t !== "";
  return {
    get first() {
      return e;
    },
    get second() {
      return t;
    },
    typing: s,
    clear: i,
    key(o, r, a) {
      return /^[0-9]$/.test(o) || o === " " ? (n === "first" ? e += o : t += o, !0) : o === "Backspace" ? (n === "first" ? e = e.slice(0, -1) : t = t.slice(0, -1), !0) : o === "Tab" ? (n = n === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : a(), !0) : !1;
    },
    tracker: (o) => ({ first: e, second: t, field: n, at: o })
  };
}
function rh(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = ul(), s = () => {
    t = null, i.clear();
  }, o = (c) => Zt(e.level(), c, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const c = Ue(i.first, { min: 1 }), u = Ue(i.second, { min: 1 });
      return c === null || u === null ? null : { x: t.x + (n.x >= t.x ? c : -c), y: t.y + (n.y >= t.y ? u : -u) };
    }
    return o(n).pt;
  }
  const a = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function l(c) {
    if (!t || a(t, c)) return;
    const u = Xd(e.level(), t, c, e.wallProps(), e.boxMeasure());
    u !== e.level() && (e.commit(u), s());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !t) {
        t = o(c.pt).pt;
        return;
      }
      const u = r();
      u && l(u);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return t ? i.key(c, () => {
        const u = r();
        u && l(u);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const c = r(), u = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!c || a(t, c)) return u;
      const d = e.wallProps(), p = La(t, c, d.thickness, e.boxMeasure());
      return p && (u.walls = p.map((f, m) => ({ a: f, b: p[(m + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Jo = (e) => Math.round(e * 1e3) / 1e3 + 0;
function ah(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = ul(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, c = (p, f) => Zt(e.level(), p, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), f = Ue(a.first, { min: 1 }), m = Ue(a.second);
    if (f === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const b = f ?? L(n, p.pt);
    let w = p.pt;
    if (m === null && L(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = Xf(n, w, b), $ = { x: Jo(g.x), y: Jo(g.y) }, x = e.level().nodes.find((M) => Math.hypot(M.x - $.x, M.y - $.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function d() {
    const p = u();
    if (!t || !p) return;
    const f = Gd(e.level(), t, p.endpoint, e.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    e.commit(f.level);
    const m = f.level.walls.find((x) => x.id === f.wallId);
    i === null && (i = m.a);
    const b = f.endNodeId === i, w = n, g = q(f.level, f.endNodeId), $ = L(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), a.clear(), b) {
      l();
      return;
    }
    t = { kind: "node", nodeId: f.endNodeId }, n = q(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !t) {
        const f = c(p.pt, !1);
        t = f.endpoint, n = f.pt;
        return;
      }
      d();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, f) {
      return o = f.shift, t ? a.key(p, d, l) : !1;
    },
    preview() {
      if (!n) return { snap: Zt(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: n, b: p.pt, props: e.wallProps() }],
        snap: p.snap,
        tracker: a.tracker(p.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      l();
    }
  };
}
function lh(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = Cs(o, n, e.tolMm());
    if (!r) return null;
    const a = J(o, o.walls.find((c) => c.id === r)), l = Dt(a, n).t;
    return { wallId: r, center: l, pt: z(a.a, E(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = nd(e.level(), r.wallId, t, r.center, a.width, a);
      l.openingId !== null && e.commit(l.level);
    },
    move(o) {
      n = o.pt;
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      const o = s();
      if (!o) return {};
      const { width: r } = i(), a = o.center - r / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Fn(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const tr = 3, ch = 1, ut = (e) => ({ x: e.x, y: e.y });
function dh(e) {
  let t = [], n = null, i = !1, s = null, o = !1;
  const r = () => t.length ? ut(t[t.length - 1]) : void 0;
  function a(d) {
    const p = t.length;
    if (p === 0) return !1;
    const f = t.map(ut);
    if (L(f[p - 1], d) <= ch) return !0;
    if (p >= 2) {
      const m = I(f[p - 1], f[p - 2]), b = I(d, f[p - 1]);
      if (Math.abs(et(m, b)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(b.x, b.y) && H(m, b) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (ba(f[p - 1], d, f[m], f[m + 1])) return !0;
    return !1;
  }
  function l(d) {
    if (t.length < tr) return null;
    const p = e.tolMm(), f = ut(t[0]), m = ut(t[t.length - 1]);
    return L(d, f) <= p ? f : L(d, m) <= p ? m : null;
  }
  function c() {
    var f;
    if (t.length < tr || _n(t.map(ut))) return !1;
    const d = e.level(), p = Bd(d, t, e.zoneName());
    return p.zoneId === null ? !1 : (t = [], n = null, i = !1, e.commit(e.zoneAutomation() ? p.level : bs(p.level, p.zoneId, !1)), (f = e.zonePlaced) == null || f.call(e), e.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => cl(e, e.level(), d, r());
  return {
    id: "zone",
    down(d) {
      if (l(d.pt)) {
        c();
        return;
      }
      const p = u(d).vertex;
      a(ut(p)) || (t = [...t, p], n = ut(p), i = !1);
    },
    move(d) {
      o = d.shift;
      const p = l(d.pt);
      if (p) {
        n = p, s = null, i = _n(t.map(ut));
        return;
      }
      const f = u(d);
      s = f.snap, n = ut(f.vertex), i = a(n);
    },
    up() {
    },
    key(d) {
      return d === "Enter" ? c() : d === "Backspace" || d === "Delete" || d === "Undo" ? t.length === 0 ? !1 : (t = t.slice(0, -1), i = !1, !0) : d === "Escape" ? t.length === 0 ? !1 : (t = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const d = {};
      t.length > 0 && (d.zoneDraft = { points: t.map(ut), cursor: n, invalid: i }), s && (d.snap = s);
      const p = r();
      return o && p && (d.orthoFrom = p), d;
    },
    cancel() {
      t = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function uh(e) {
  return e.zoneMethod() === "polygon" ? dh(e) : {
    id: "zone",
    down(t) {
      var i;
      const n = Rd(e.level(), t.pt, e.zoneName());
      if (n.zoneId === null) {
        e.notify(h("zones.noLoop"));
        return;
      }
      n.existing || (e.commit(e.zoneAutomation() ? n.level : bs(n.level, n.zoneId, !1)), (i = e.zonePlaced) == null || i.call(e)), e.select({ kind: "zone", id: n.zoneId });
    },
    move() {
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      return {};
    },
    cancel() {
    }
  };
}
const er = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function pl(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((u) => u.id === o), l = a ? Q(s, a) : null, c = a ? Ti(s, a, e.scale()) : null;
    return !l || !c ? 0 : fa(kt(I(r, l.pt)) - kt(I(c.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && L(s.pt, t.downPt) <= ni / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((d) => d.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = (kt(I(s.pt, r.pt)) - t.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, u = Sd(t.original, o, c, s.shift);
    t.work = JSON.stringify(u) === JSON.stringify(o.placement) ? t.original : xn(t.original, o.id, u);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((c) => c.id === s), l = a ? Ti(r, a, e.scale()) : null;
      return !a || !l || L(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && er(o.work, o.id) !== er(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function nr(e, t, n) {
  const i = J(e, e.walls.find((s) => s.id === t));
  return Dt(i, n).side > 0 ? "left" : "right";
}
function fl(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Ls(e, t = "free") {
  return e === "equipment" ? [t] : os[e];
}
function hl(e, t, n, i, s = 0, o = Ls(n)) {
  if (o.includes("wall")) {
    const r = Zt(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: nr(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of t.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const u = J(t, c), d = Dt(u, i).side, p = Math.abs(Math.abs(d) - (d > 0 ? u.leftOff : u.rightOff));
        (!l || p < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : u.len, d: p });
      }
      if (l) return { mode: "wall", wallId: l.id, side: nr(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...fl(e, i), rotation: s } : null;
}
function ph(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  if (!n) {
    const o = ds(Math.round(kt(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of e.walls) {
    let r;
    try {
      r = J(e, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const a = Dt(r, i.pt), l = a.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(a.t))), u = Ne(e, o.id, l, c), d = u ? L(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: l, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? us(e, t.props, s.placement, 0) : null;
}
function fh(e, t, n) {
  return aa(e.deviceDefaults(t), "free", n.mode);
}
function hh(e, t) {
  let n = null, i;
  const s = pl(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = Ls(t, e.wallMount() ? "wall" : "free"), l = hl(e, r, t, n, 0, a);
    if (!l)
      return { placement: { mode: "free", ...fl(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const c = fh(e, t, l), u = us(r, c, l, e.tolMm()), d = wo(r, c, u, "").deviceId !== null;
    return { placement: u, props: c, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), c = es(h(`device.${t}`), l.devices.filter((d) => d.props.kind === t).map((d) => d.name)), u = wo(l, a.props, a.placement, c);
      u.deviceId !== null && (e.commit(u.level), i = u.deviceId, e.select({ kind: "device", id: u.deviceId }));
    },
    move(r) {
      n = r.pt, s.active() && s.move(r);
    },
    up(r) {
      s.end(r);
    },
    key(r) {
      return r === "Escape" && s.cancel();
    },
    preview() {
      const r = s.working();
      if (s.active()) return r ? { level: r } : {};
      const a = o();
      return a ? { device: a } : {};
    },
    cancel() {
      s.cancel(), n = null, i = void 0;
    }
  };
}
const ir = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, mh = (e, t, n) => n === void 0 || ir(e, n) !== ir(t, n);
function gh(e, t, n, i) {
  const s = t.placement;
  if (s.mode === "free" && n) return I(n, i);
  if (s.mode !== "wall" || t.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = Ne(e, s.wallId, s.side, s.offset);
  return o ? I(o, i) : { x: 0, y: 0 };
}
function wh(e) {
  let t = null, n = null;
  const i = pl(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (p) => {
    t = p, e.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && L(p.pt, a) <= ni / e.scale()) return;
    if (r = !0, p.pt.x === a.x && p.pt.y === a.y) {
      o = s;
      return;
    }
    const f = s.devices.find((k) => k.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = p.shift ? Ps(a, p.pt) : p.pt, b = f.placement, w = b.mode === "free" ? null : Q(s, f), g = b.mode === "free" ? b.rotation : w ? ds(Math.round(kt(w.dir))) : 0, $ = z(m, n.grab), x = hl(e, s, f.props.kind, $, g, Ls(f.props.kind, b.mode)), M = x && x.mode === "wall" && b.mode === "wall" && b.aim !== void 0 ? { ...x, aim: b.aim } : x;
    o = M ? xn(s, f.id, us(s, f.props, d(s, f.placement, M, m, $), e.tolMm())) : s;
  }
  function d(p, f, m, b, w) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = p.walls.find((P) => P.id === f.wallId);
    if (!g) return m;
    const $ = J(p, g), x = Math.max(0, Math.min($.len, f.offset + H(I(b, a), $.dir))), M = Dt($, w).side, k = e.tolMm(), A = f.side === "left" ? M < -($.rightOff + k) ? "right" : "left" : M > $.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: A };
  }
  return {
    id: "device-select",
    down(p) {
      c(), a = p.pt;
      const f = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, p)) return;
      const b = ga(f, p.pt, m);
      if (!b) {
        l(null);
        return;
      }
      l({ kind: "device", id: b });
      const w = f.devices.find(($) => $.id === b), g = Q(f, w);
      s = o = f, n = { id: b, grab: gh(f, w, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, m = s, b = r, w = n == null ? void 0 : n.id;
      c(), b && f && m && f !== m && mh(m, f, w) && e.commit(f);
    },
    key(p) {
      return p === "Escape" && i.cancel() ? !0 : p === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const p = i.working();
      return p ? { level: p } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), c(), l(null);
    }
  };
}
function bh(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = ga(e.level(), t.pt, e.tolMm());
      e.select(n ? { kind: "device", id: n } : null);
    },
    move() {
    },
    up() {
    },
    key(t) {
      return t !== "Escape" ? !1 : (e.select(null), !0);
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const Ui = 40, yh = (e, t) => e.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === t.block && i.port === t.port));
function vh(e, t, n, i) {
  const s = e.blocks.find((f) => f.id === t);
  if ((s == null ? void 0 : s.kind) !== "bus") return e;
  const o = s.w >= s.h, r = o ? s.x : s.y, a = o ? s.w : s.h, l = He(o ? i.x : i.y), c = n === "start" ? Math.min(l, r + a - Ui) : r, u = n === "end" ? Math.max(l, r + Ui) : r + a;
  if (c === r && u === r + a) return e;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (f) => "bus" in f && f.bus === t ? { bus: t, at: Math.min(1, Math.max(0, (r + f.at * a - c) / (u - c))) } : f;
  return {
    ...e,
    blocks: e.blocks.map((f) => f.id === t ? { ...f, ...d } : f),
    wires: e.wires.map((f) => {
      const m = p(f.from), b = p(f.to);
      return m === f.from && b === f.to ? f : { ...f, from: m, to: b };
    })
  };
}
function $h(e) {
  let t = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    t = null, n = null, i = null, s = !1;
  };
  function a(u, d) {
    const p = Do(u, d, e.tolMm(), e.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function l(u) {
    const d = t, p = n;
    if (!d || !p || !s && L(u.pt, o) <= ni / e.scale()) return;
    if (s = !0, d.kind === "wire") {
      const w = a(p, u.pt);
      t = { ...d, to: u.pt, ok: !!w && !("error" in Oo(p, d.from, w, e.geo())) };
      return;
    }
    if (d.kind === "bus-end") {
      i = vh(p, d.id, d.end, u.pt);
      return;
    }
    const f = p.blocks.find((w) => w.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!f) return;
    if (d.kind === "pin") {
      i = mu(p, f.id, d.from.port, Pu(gt(f, e.geo(), p), u.pt));
      return;
    }
    const m = He(f.x + u.pt.x - o.x), b = He(f.y + u.pt.y - o.y);
    i = m === f.x && b === f.y ? p : pu(p, f.id, m, b);
  }
  function c(u, d, p) {
    const f = a(u, p);
    if (!f) return;
    const m = Oo(u, d, f, e.geo());
    if ("error" in m) {
      e.notify(h(`power.err.${m.error}`));
      return;
    }
    e.commitPower(m.schema), e.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const d = e.power(), p = Do(d, u.pt, e.tolMm(), e.geo());
      if (!p) {
        e.select(null);
        return;
      }
      if (p.kind === "chip") {
        e.setPosition(p.block, p.position);
        return;
      }
      if (p.kind === "wire") {
        e.select({ kind: "powerWire", id: p.id });
        return;
      }
      if (n = i = d, p.kind === "port") {
        const f = { block: p.block, port: p.port };
        if (yh(d, f)) {
          t = { kind: "pin", from: f };
          return;
        }
        const m = d.blocks.find((w) => w.id === p.block), b = Qn(d, m, e.geo()).find((w) => w.name === p.port).pt;
        t = { kind: "wire", from: f, at: b, to: b, ok: !1 };
        return;
      }
      e.select({ kind: "powerBlock", id: p.id }), t = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      l(u);
    },
    up(u) {
      l(u);
      const d = t, p = n, f = i, m = s;
      if (r(), !(!d || !p)) {
        if (!m) {
          (d.kind === "wire" || d.kind === "pin") && e.select({ kind: "powerBlock", id: d.from.block });
          return;
        }
        d.kind === "wire" ? c(p, d.from, u.pt) : f && f !== p && e.commitPower(f);
      }
    },
    key(u) {
      return u === "Escape" && t ? (r(), !0) : !1;
    },
    preview() {
      const u = t;
      return u ? u.kind === "wire" ? { wireDraft: { from: u.at, to: u.to, ok: u.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function xh(e, t) {
  const n = t.slice(6);
  return {
    id: t,
    down(i) {
      var c;
      let s;
      if (n === "device") {
        const u = e.placeDeviceId();
        if (!u) {
          e.notify(h("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = e.power(), r = uu(n, { x: 0, y: 0 }, o, s), a = gt(r, e.geo(), Co(o, r)), l = { ...r, x: He(i.pt.x - a.w / 2), y: He(i.pt.y - a.h / 2) };
      e.commitPower(Co(o, l)), n === "device" && ((c = e.devicePlaced) == null || c.call(e)), e.pickTool("power-select"), e.select({ kind: "powerBlock", id: l.id });
    },
    move() {
    },
    up() {
    },
    key() {
      return !1;
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const kh = ["select", "box", "wall", "door", "window", "opening", "zone"], Mh = [
  "device-select",
  "ceiling_light",
  "wall_light",
  "motion_sensor",
  "illuminance_sensor",
  "climate_sensor",
  "leak_sensor",
  "wall_switch",
  "smart_button",
  "valve",
  "socket",
  "exhaust_fan",
  "equipment"
], _h = ["binding-select"], Sh = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], ml = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, Ah = {
  plan: kh,
  equipment: Mh,
  binding: _h,
  power: Sh
};
function Os(e) {
  return Ah[e];
}
function ji(e, t) {
  switch (e) {
    case "select":
      return oh(t);
    case "box":
      return rh(t);
    case "wall":
      return ah(t);
    case "door":
    case "window":
    case "opening":
      return lh(t, e);
    case "zone":
      return uh(t);
    case "device-select":
      return wh(t);
    case "binding-select":
      return bh(t);
    case "power-select":
      return $h(t);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return xh(t, e);
    default:
      return hh(t, e);
  }
}
function ki(e, t, n) {
  return t.kind === "powerBlock" ? n.blocks.some((s) => s.id === t.id) : t.kind === "powerWire" ? n.wires.some((s) => s.id === t.id) : (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((s) => s.id === t.id);
}
const Eh = {
  select: Qe,
  box: gp,
  wall: wp,
  door: Yu,
  window: vp,
  opening: Qu,
  zone: pp,
  "device-select": Qe,
  ceiling_light: Ku,
  wall_light: bp,
  motion_sensor: ap,
  illuminance_sensor: Zu,
  climate_sensor: fp,
  wall_switch: sp,
  smart_button: ip,
  valve: hp,
  leak_sensor: yp,
  socket: tl,
  exhaust_fan: ep,
  equipment: To,
  "binding-select": Qe,
  "power-select": Qe,
  "power-device": To,
  "power-bus": dp,
  "power-battery": qu,
  "power-pv": el,
  "power-transfer": up,
  "power-remainder": Gu
}, gl = (e) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${Eh[e]}></path>`}</svg>`;
function Ih(e) {
  switch (e.saveState) {
    case "saving":
      return h("save.saving");
    case "conflict":
      return h("save.conflict");
    case "error":
      return h("save.error");
    default:
      return e.dirty ? h("save.dirty") : h(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Ph(e) {
  return v`
    <div class="top"><div class="bar">
      ${e.lead ?? y}
      ${e.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${Z(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => v`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : y}
      <button class="btn" data-action="new-plan" title=${h("plan.new")} aria-label=${h("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${h("plan.delete")} aria-label=${h("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${h("action.undo")} aria-label=${h("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${h("action.redo")} aria-label=${h("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${Ih(e)}${e.saveState === "error" && e.errorMessage ? v`: ${e.errorMessage}` : y}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${h("action.save")}</button>
    </div>${e.steps}</div>`;
}
const Ch = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Lh(e, t, n) {
  return Os(e).map((i) => {
    const s = e === "plan" ? ml[i] : void 0, o = h(`tool.${i}`);
    return v`
      ${Ch.includes(i) ? v`<div class="tool-sep"></div>` : y}
      <button class="tool ${t === i ? "on" : ""}" data-tool=${i} data-key=${s ?? y}
        aria-pressed=${t === i ? "true" : "false"} aria-keyshortcuts=${s ?? y}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${gl(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function Oh(e, t, n) {
  return v`<div class="tools">${Lh(e, t, n)}</div>`;
}
const ge = ["plan", "equipment", "binding", "power"], nn = (e, t, n) => h(e === 1 ? t : n).replace("{n}", String(e));
function zh(e, t, n, i) {
  const { walls: s, zones: o, devices: r } = t;
  switch (e) {
    case "plan": {
      const a = o.filter((c) => c.invalid).length, l = a ? `, ${h("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${nn(s.length, "steps.wall", "steps.walls")}, ${nn(o.length, "steps.zone", "steps.zones")}${l}`,
        done: s.length > 0 && o.length > 0
      };
    }
    case "equipment":
      return { text: nn(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const a = r.length - is(r.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(a)).replace("{n}", String(r.length)),
        done: r.length > 0 && a === r.length
      };
    }
    case "power":
      return { text: nn(i.blocks.length, "steps.block", "steps.blocks"), done: xu(i) };
  }
}
const sr = (e, t) => h(e).replace("{step}", h(`mode.${t}`));
function Nh(e) {
  const t = ge.indexOf(e.mode), n = ge[t - 1], i = ge[t + 1];
  return v`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Z(e.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${ge.map((s, o) => {
    const r = zh(s, e.level, e.status, e.power), a = s === e.mode;
    return v`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : y} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${ge.length + 1}</span><span class="name">${h("mode.automation")}</span>
        <span class="state">${h("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${sr("steps.back", n)}</button>` : y}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${sr("steps.next", i)}</button>` : y}
      </div>
    </nav>`;
}
function Vh(e) {
  return e.devices.filter((t) => t.placement.mode === "none").sort((t, n) => t.name.localeCompare(n.name) || t.id.localeCompare(n.id));
}
function wl(e) {
  const t = e.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return ia(e, es(h("device.equipment"), t));
}
function zs(e) {
  if (ue(e)) return h("props.inverter");
  const t = ad(e);
  return t ? h(`deviceRole.${t}`) : "";
}
function ii(e) {
  const t = h(`device.${e.props.kind}`), n = zs(e);
  return n ? `${t} · ${n}` : t;
}
function Dh(e) {
  const t = Vh(e.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => e.onNew()}>${h("devices.new")}</button>
    </div>
    ${t.length === 0 ? y : v`<div class="pdevs">
      ${t.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => e.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${zs(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const Th = ["unbound", "bound", "all"], Hh = /* @__PURE__ */ new WeakMap(), Se = (e) => e.placement.mode === "none";
function bl(e) {
  return ft(Hh, e, (t) => [...t.devices].sort((n, i) => Number(Se(n)) - Number(Se(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Rh(e, t, n) {
  const i = bl(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const yl = (e) => h(`device.${e.props.kind}`), or = (e) => e.props.kind === "equipment" ? zs(e) : yl(e), Bh = (e, t) => e === "all" || e === "bound" == (t === "bound");
function Fh(e, t, n) {
  return t === 0 ? h("binding.noDevices") : n || e.filter === "all" ? h("binding.noMatch") : h(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function rr(e) {
  const t = h(e.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function Uh(e) {
  var a;
  if (e.collapsed) return v`<div class="blist collapsed">${rr(e)}</div>`;
  const t = bl(e.level).map((l) => ({ d: l, st: e.status(l) })), n = {
    unbound: is(t.map((l) => l.st)),
    bound: t.filter((l) => l.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: l, st: c }) => Bh(e.filter, c) && (!i || l.name.toLowerCase().includes(i) || yl(l).toLowerCase().includes(i) || or(l).toLowerCase().includes(i))), o = ((a = e.selection) == null ? void 0 : a.kind) === "device" ? e.selection.id : null, r = (l, c) => {
    const u = dc(l);
    return v`<button class="brow${l.id === o ? " sel" : ""}" data-id=${l.id} @click=${() => e.onPick(l.id)}>
      <span class="dot ${c}" role="img" aria-label=${h(`bindstatus.${c}`)} title=${h(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${l.name}</span><small class="kind">${or(l)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${Th.map((l) => v`<button role="radio" aria-checked=${String(l === e.filter)} data-filter=${l}
            @click=${() => e.onFilter(l)}>${h(`binding.filter.${l}`)} <span class="count">${n[l]}</span></button>`)}
        </div>
        ${rr(e)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${Z(e.query)} @input=${(l) => e.onQuery(l.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${Fh(e, t.length, i)}</p>` : v`
          ${s.filter((l) => !Se(l.d)).map((l) => r(l.d, l.st))}
          ${s.some((l) => Se(l.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((l) => Se(l.d)).map((l) => r(l.d, l.st))}
          </div>` : y}`}
      </div>
    </div>`;
}
function C(e, t) {
  return v`<label class="row"><span>${e}</span>${t}</label>`;
}
function G(e, t, n, i) {
  return v`<select class="val" data-field=${i ?? y} .value=${Z(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => v`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function Tt(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return v`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? y}
    placeholder=${e.placeholder ?? y} title=${e.placeholder ?? y} .value=${Z(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = Ue(s.value, e.rule);
    if (o === null) {
      s.value = t, n(h(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(h("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function jh() {
  return {
    door: { width: dn.door, hinge: "start", swing: "left" },
    window: { width: dn.window, outside: "left" },
    opening: { width: dn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Wh(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function vl(e) {
  return es(h("zones.default"), e.zones.map((t) => t.name));
}
const qh = (e) => e === "door" || e === "window" || e === "opening";
function Zh(e) {
  const t = e.next;
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return y;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return v`
    <h4>${h(`props.next.${n}`)}</h4>
    ${C(`${h("props.width")}, ${h("unit.mm")}`, Tt({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      o({ width: r });
    }
  }))}
    ${n === "door" ? v`
      ${C(h("props.hinge"), G(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${C(h("props.swing"), G(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : y}
    ${n === "window" ? C(h("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : y}`;
}
class Kh {
  constructor(t, n = 200) {
    this.cap = n, this.past = [], this.future = [], this.present = t;
  }
  get current() {
    return this.present;
  }
  push(t) {
    for (this.past.push(this.present); this.past.length > Math.max(0, this.cap - 1); ) this.past.shift();
    this.present = t, this.future = [];
  }
  undo() {
    return this.canUndo ? (this.future.push(this.present), this.present = this.past.pop(), this.present) : null;
  }
  redo() {
    return this.canRedo ? (this.past.push(this.present), this.present = this.future.pop(), this.present) : null;
  }
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
}
const Wi = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Ae = (e) => typeof e == "string" && e ? e : null, ar = (e) => typeof e == "number" && Number.isFinite(e), qi = (e) => {
  var t;
  return e.props.kind === "equipment" && !!((t = e.bindings) != null && t.control);
};
function $l(e) {
  return e.switchesMigrated || !e.devices.some(qi) ? e : { ...e, switchesMigrated: !0 };
}
function Gh(e, t, n) {
  const i = ia(e, n);
  let s = i.level;
  const o = Wi(t.switch) ? t.switch : {}, r = [["power", Ae(t.power)], ["voltage", Ae(t.voltage)], ["control", Ae(o.entity)]];
  for (const [a, l] of r) l && (s = Nn(s, i.id, a, l));
  return o.controllable === !0 && (s = Un(s, i.id, !0)), { level: s, id: i.id };
}
function Xh(e) {
  let t = e.level, n = e.power;
  const i = e.power;
  if (Wi(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((a) => {
      if (!Wi(a)) return a;
      if (a.kind === "meter" && Ae(a.id) && ar(a.x) && ar(a.y)) {
        s++;
        const l = Gh(t, a, Ae(a.name) ?? `Meter ${s}`);
        return t = l.level, o = !0, {
          id: a.id,
          kind: "device",
          deviceId: l.id,
          x: a.x,
          y: a.y,
          ..."portPins" in a ? { portPins: a.portPins } : {}
          // the name went to the device
        };
      }
      if (a.kind === "device" && "inverter" in a) {
        const { inverter: l, ...c } = a;
        return l === !0 && typeof a.deviceId == "string" && (t = ra(t, a.deviceId, !0)), o = !0, c;
      }
      return a;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!t.switchesMigrated && t.devices.some(qi)) {
    for (const s of e.level.devices) qi(s) && (t = Un(t, s.id, !0));
    t = $l(t);
  }
  return t === e.level && n === e.power ? e : { ...e, level: t, ...n ? { power: n } : {} };
}
class Yh {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await bi(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(to(h("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = $t(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /**
   * Loads a stored plan from the server and makes it the open one. A plan of another schema version (an older server
   * still running after an update) is refused before anything changes: the panel reads and saves v2 plans only.
   */
  async openPlan(t) {
    const n = await Hu(this.h.hass, t);
    if (n.schemaVersion !== 2) throw new Error(h("load.oldServer"));
    this.h.drafts.cancel(), this.h.save.reset(n.revision), this.adopt(n), this.h.drafts.setLastPlanId(n.id), this.offerDraft(this.h.drafts.read(n.id));
  }
  /** Closes the open dialog when it is of the given kind. */
  closeDialog(t) {
    var n;
    ((n = this.h.dialog) == null ? void 0 : n.kind) === t && (this.h.dialog = null);
  }
  /**
   * Offers a stored draft for restoring. A draft saved by an older version (schemaVersion other than 2) is dropped
   * with a notice instead: the panel reads v2 plans only (the server converts stored plans, not browser drafts).
   */
  offerDraft(t) {
    t && t.plan.schemaVersion !== 2 && (this.h.drafts.clear(t.planId), this.h.notice = h("drafts.oldDiscarded"), t = null), this.h.pendingDraft = t, t ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await bi(this.h.hass);
      } catch {
      }
  }
  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions() {
    const t = this.h.plan, n = this.h.plans.map((i) => ({ id: i.id, name: i.id === t.id ? t.name : i.name }));
    return n.some((i) => i.id === t.id) || n.push({ id: t.id, name: t.name }), n;
  }
  pickPlan(t) {
    if (!(!this.h.plan || t === this.h.plan.id || this.h.save.state === "saving")) {
      if (this.h.save.dirty) {
        this.h.dialog = { kind: "switch", to: t };
        return;
      }
      this.switchPlan(t);
    }
  }
  async switchPlan(t) {
    try {
      await this.openPlan(t);
    } catch (n) {
      this.h.notice = $t(n);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    var n;
    const t = ((n = this.h.dialog) == null ? void 0 : n.kind) === "switch" ? this.h.dialog.to : null;
    this.closeDialog("switch"), !(!t || !this.h.plan) && (this.h.drafts.cancel(), this.draftBlocked() || this.h.drafts.clear(this.h.plan.id), this.switchPlan(t));
  }
  busy() {
    return this.h.save.state === "saving" || this.h.deleting;
  }
  requestNewPlan() {
    if (!(!this.h.plan || this.busy())) {
      if (this.h.save.dirty) {
        this.h.dialog = { kind: "new" };
        return;
      }
      this.startNewPlan();
    }
  }
  /** Replaces the open plan with a fresh unsaved one (tool, selection and history are reset by adopt). */
  startNewPlan() {
    this.closeDialog("new"), this.h.drafts.cancel(), this.h.plan && !this.draftBlocked() && this.h.drafts.clear(this.h.plan.id), this.openFresh();
  }
  openFresh() {
    this.h.toolId = Os(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(to(h("plan.default"))), this.offerDraft(null);
  }
  requestDelete() {
    !this.h.plan || this.busy() || (this.h.dialog = { kind: "delete" });
  }
  async confirmDelete() {
    var n;
    this.closeDialog("delete");
    const t = this.h.plan;
    if (!(!t || !this.h.hass || this.busy())) {
      this.h.deleting = !0;
      try {
        if (this.h.save.baseRevision !== null)
          try {
            await Bu(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = $t(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await bi(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = $t(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  /**
   * Makes a plan (stored or a restored draft) the open one. Its first level and raw power data go through
   * migrateDevices before normalizePower (a v0.7 meter must still be readable there); the result is saved with the
   * next Save.
   */
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(kc) };
    const n = Xh({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = $u(n.power, { device: (s) => n.level.devices.find((o) => o.id === s) });
    this.h.history = new Kh({ level: n.level, ...i ? { power: i } : {} }), this.h.lazyPower = Ta(), this.h.activeTool.cancel(), this.h.activeTool = ji(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
  }
  makeDraft() {
    return { planId: this.h.plan.id, baseRevision: this.h.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }
  /** True while an undecided draft of the open plan must not be overwritten. */
  draftBlocked() {
    return !!this.h.pendingDraft && !!this.h.plan && this.h.pendingDraft.planId === this.h.plan.id;
  }
  restoreDraft(t) {
    this.h.pendingDraft = null, this.closeDialog("restore"), this.adopt(t.plan), this.h.save.baseRevision = t.baseRevision, this.h.save.markDirty();
  }
  discardDraft(t) {
    this.h.pendingDraft = null, this.closeDialog("restore"), this.h.drafts.clear(t.planId), this.h.save.dirty && this.h.plan && this.h.drafts.schedule(() => this.makeDraft());
  }
  /** After a successful save: drop drafts of the given ids unless edits made meanwhile keep the plan dirty. */
  afterSaved(...t) {
    var n;
    if (this.h.save.state === "saved") {
      this.h.drafts.setLastPlanId(this.h.plan.id), this.refreshPlans(), this.h.drafts.cancel();
      for (const i of t) ((n = this.h.pendingDraft) == null ? void 0 : n.planId) !== i && this.h.drafts.clear(i);
      this.h.save.dirty && !this.draftBlocked() && this.h.drafts.schedule(() => this.makeDraft());
    }
  }
  /** The open plan as it is saved or drafted; an equipment switch on the edited level marks it (markSwitchesMigrated). */
  currentPlan() {
    const t = this.h.plan, { level: n, power: i } = this.h.history.current, s = t.levels.map((a, l) => l === 0 ? $l(n) : a), { power: o, ...r } = t;
    return { ...r, levels: s, ...i ? { power: i } : {}, revision: this.h.save.baseRevision ?? 0 };
  }
  async doSave() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.save(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = { kind: "conflict" }));
  }
  async doOverwrite() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.overwrite(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? { kind: "conflict-again" } : null);
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const t = `${this.h.plan.name} ${h("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Qh {
  constructor(t) {
    this.h = t, this.error = null, this.regs = null, this.tried = !1, this.pending = !1, this.base = null, this.merged = null;
  }
  /** A registry load is in progress. */
  get loading() {
    return this.pending;
  }
  get() {
    var r;
    const t = (r = this.h.hass) == null ? void 0 : r.states, n = this.base;
    !n || !ou(n.states, t) ? this.base = { states: t, meta: su(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? au(i, this.regs) : i;
    return this.merged = { base: i, regs: this.regs, meta: o }, o;
  }
  /** First entry to the Binding step: loads the registries unless an attempt was made already. */
  enter() {
    this.tried || this.retry();
  }
  /**
   * Loads the registries (again, when loaded already: Retry after a failure, "Reload from Home Assistant"); a no-op
   * while a load runs. The panel re-renders when the load starts and settles. A failed reload keeps the older registries.
   */
  retry() {
    const t = this.h.hass;
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), ru(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", $t(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const sn = zr("", "");
function Jh(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current.level) ?? sn;
    },
    commit: (t) => e.commit(t),
    power: () => e.power,
    commitPower: (t) => e.commitPower(t),
    scale: () => e.view.scale,
    tolMm: () => 10 / e.view.scale,
    grid: () => e.grid ? 100 : null,
    wallProps: () => ({ type: e.wallType, thickness: e.thickness, baseline: "center" }),
    boxMeasure: () => e.boxMeasure,
    // A field message belongs to the selected element; a session error (Binding) outlives the selection.
    select: (t) => {
      e.selection = t, e.fieldNotice = null, e.mode !== "binding" && (e.notice = null);
    },
    selection: () => e.selection,
    deviceDefaults: (t) => e.nextProps[t],
    wallMount: () => e.nextObj.wallMount,
    openingDefaults: (t) => Wh(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zone.name ?? vl(((t = e.history) == null ? void 0 : t.current.level) ?? sn);
    },
    zoneMethod: () => e.nextObj.zone.method,
    zoneAutomation: () => e.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zone: { ...e.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const t = (((n = e.history) == null ? void 0 : n.current.level) ?? sn).devices;
      return { device: (i) => t.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const t = e.placeDeviceId;
      return t === null ? null : Wa(((n = e.history) == null ? void 0 : n.current.level) ?? sn, e.power).some((i) => i.id === t) ? t : (e.placeDeviceId = null, null);
    },
    devicePlaced: () => {
      e.placeDeviceId = null;
    },
    setPosition: (t, n) => e.setPowerPosition(t, n),
    notify: (t) => {
      e.notice = t;
    },
    pickTool: (t) => e.pickTool(t)
  };
}
const xl = Object.keys(os), tm = (e) => xl.includes(e);
function em() {
  return Object.fromEntries(xl.map((e) => [e, zt(e, "free")]));
}
const kl = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -se, max: se, signed: !0 }, bad: "props.badAim" }
}, Ee = (e, t, n, i, s) => Tt({ ...kl[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), nm = ["round", "linear", "spot"], im = ["rect", "circle"], Cn = (e, t) => e.map((n) => ({ v: n, label: h(`${t}.${n}`) }));
function Ml(e, t, n, i) {
  const s = (r, a, l) => C(`${h(a)}, ${h("unit.mm")}`, Ee(e, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => C(`${h(a)}, ${h("unit.deg")}`, Ee(e, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (t.kind) {
    case "ceiling_light":
      return v`
        ${C(h("props.shape"), G(t.shape, Cn([...nm], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? v`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : t.shape === "round" ? s("diameter", "props.diameter", t.diameter) : y}
        ${C(`${h("props.poolRadius")}, ${h("unit.mm")}`, Tt({
        ...kl.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: h("props.poolHint"),
        setNotice: e.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return v`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return v`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return C(`${h("props.diameter")}, ${h("unit.mm")}`, v`<select class="val" data-field=${`${n}diameter`}
        .value=${Z(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${hc.map((r) => v`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${C(h("props.shape"), G(t.shape, Cn([...im], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? v`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${C(h("props.icon"), om(e, t.icon, `${n}icon`, i))}
        ${C(h("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Z(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return v`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const sm = /^mdi:[a-z0-9-]+$/;
function om(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!sm.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, h("props.badIcon"));
      return;
    }
    (l = e.onNotice) == null || l.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? v`<ha-icon-picker data-field=${n} .value=${Z(t)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : v`<input class="val wide" type="text" data-field=${n} .value=${Z(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
function Kt(e, t, n, i) {
  return C(t, v`<input type="checkbox" data-field=${e} .checked=${Z(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function rm(e, t) {
  return t.props.kind !== "equipment" || t.placement.mode === "none" ? y : Kt("wallMount", h("props.wallMount"), t.placement.mode === "wall", (n) => {
    var i;
    return ((i = e.onWallMount) == null ? void 0 : i.call(e, n)) ?? !1;
  });
}
function am(e, t) {
  var i;
  const n = t.props;
  return n.kind !== "equipment" ? y : v`
    ${Kt("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = e.onInverter) == null ? void 0 : o.call(e, s)) ?? !1;
  })}
    ${(i = t.bindings) != null && i.control ? Kt("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = e.onControllable) == null ? void 0 : o.call(e, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function lm(e, t) {
  const n = t.placement;
  if (n.mode === "none") return y;
  if (n.mode === "free")
    return C(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      Ee(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = Nr.has(t.props.kind);
  return v`
    ${C(h("props.side"), G(n.side, Cn(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${C(`${h("props.offset")}, ${h("unit.mm")}`, Ee(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? C(
    `${h("props.aim")}, ${h("unit.deg")}`,
    Ee(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(wa(n, s)))
  ) : y}`;
}
function Ns(e, t) {
  return C(h("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${Z(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function cm(e, t) {
  const n = t.props.kind;
  return Or(n) ? n === "smart_button" && t.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : C(h("props.type"), G(
    n,
    Cn(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : y;
}
function dm(e, t) {
  const n = e.level ? Ld(e.level, t) : [];
  return v`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = e.onZone) != null && a.call(e, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function um(e, t) {
  const n = t.placement.mode !== "none";
  return v`
    <h4>${ii(t)}</h4>
    ${Ns(t, (i) => e.onDevice({}, i))}
    ${cm(e, t)}
    ${n ? Ml(e, t.props, "", (i) => e.onDevice(i)) : y}
    ${rm(e, t)}
    ${lm(e, t)}
    ${am(e, t)}
    ${n ? dm(e, t) : y}
    ${t.invalid ? v`<p class="warn">${h("props.invalidDevice")}</p>` : y}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${h("action.delete")}</button>`;
}
function pm(e) {
  return e.device ? um(e, e.device) : e.nextKind && e.nextProps ? v`
      <h4>${h("props.nextDevice")}: ${h(`device.${e.nextKind}`)}</h4>
      ${Ml(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}
      ${e.nextKind === "equipment" ? Kt(
    "next-wallMount",
    h("props.wallMount"),
    !!e.nextWallMount,
    (t) => {
      var n;
      return (n = e.onNextWallMount) == null || n.call(e, t), !0;
    }
  ) : y}` : v`<p class="muted">${h("props.none")}</p>`;
}
function fm(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((l) => l.id === n.id) ?? null : null, s = tm(e.toolId) ? e.toolId : null, o = (l) => l === t ? (e.setNotice(h("props.noFit")), !1) : (e.setNotice(null), e.commit(l), !0), r = (l) => l.level === t ? !1 : (e.setNotice(null), e.commit(l.level, l.power), !0), a = (l, c) => {
    const u = ph(t, l, c);
    return o(u ? xn(t, l.id, u) : t);
  };
  return v`<div class="props">
    ${pm({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (l, c) => !!i && o(We(t, i.id, l, c)),
    onKind: (l) => !!i && o(ld(t, i.id, l)),
    onPlacement: (l) => !!i && o(xn(t, i.id, l)),
    onZone: (l, c) => !!i && o(Ia(t, i.id, l, c)),
    onWallMount: (l) => !!i && a(i, l),
    onInverter: (l) => !!i && r(Ua(t, e.power, i.id, l)),
    onControllable: (l) => !!i && o(Un(t, i.id, l)),
    nextWallMount: e.nextWallMount,
    onNextWallMount: (l) => e.setNextWallMount(l),
    onNext: (l) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...l, kind: s } });
    },
    onDelete: () => {
      i && r(Fa(t, e.power, i.id));
    },
    onNotice: (l) => e.setNotice(l)
  })}
    ${e.notice ? v`<p class="warn">${e.notice}</p>` : y}
    ${i ? y : Dh({
    level: t,
    onPick: (l) => e.pickDevice(l),
    onNew: () => {
      const l = wl(t);
      e.commit(l.level), e.pickDevice(l.id);
    }
  })}
  </div>`;
}
const Zi = (e) => h(`zones.kind.${e.shape.kind}`), Vs = (e) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${e === "walls" ? np : mp}></path>`}</svg>`;
function _l(e, t) {
  const n = ya(e, t);
  return n ? h(`zones.invalid.${n}`) : null;
}
function hm(e) {
  var s;
  const t = e.query.trim().toLowerCase(), n = ((s = e.selection) == null ? void 0 : s.kind) === "zone" ? e.selection.id : null, i = e.level.zones.map((o, r) => ({ z: o, hue: Es(r) })).filter(({ z: o }) => !t || o.name.toLowerCase().includes(t) || Zi(o).toLowerCase().includes(t));
  return v`
    <div class="zlist">
      <div class="zhead"><span>${h("zones.list").replace("{n}", String(e.level.zones.length))}</span><span>${h("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${h("zones.filter")}
        aria-label=${h("zones.filter")} .value=${Z(e.query)}
        @input=${(o) => e.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var l;
    const a = o.invalid ? _l(e.level, o) ?? "" : null;
    return v`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => e.onPick(o.id)}>
            ${a === null ? v`<span class="zswatch" style=${`background:${r}`}></span>` : v`<span class="zswatch zinvalid" role="img" aria-label=${a} title=${a}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Zi(o)}>${Vs(o.shape.kind)}</span>
            <span class="zarea">${((l = fs(e.level, o)) == null ? void 0 : l.toFixed(1)) ?? "—"}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ds = Jn(class extends ti {
  constructor(e) {
    if (super(e), e.type !== Et.PROPERTY && e.type !== Et.ATTRIBUTE && e.type !== Et.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Qa(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === lt || t === y) return t;
    const n = e.element, i = e.name;
    if (e.type === Et.PROPERTY) {
      if (t === n[i]) return lt;
    } else if (e.type === Et.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return lt;
    } else if (e.type === Et.ATTRIBUTE && n.getAttribute(i) === t + "") return lt;
    return As(e), t;
  }
}), Sl = (e, t, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${e} .checked=${Ds(t)}
    @change=${(i) => n(i.target.checked)} />${h("zones.automation")}</label>`;
function mm(e, t, n) {
  const i = $a(e, t.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${h("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${h("zones.participates")}</span>` : y}</div>
    ${i.length === 0 ? v`<p class="muted">${h("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${h(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${Ds(o)}
          @change=${(r) => {
    const a = Ia(e, s.id, t.id, r.target.checked);
    a !== e && n(a);
  }} />
      </label>`)}
  </div>`;
}
function lr(e, t, n) {
  const i = _l(e, t), s = t.shape.kind === "walls" && t.shape.broken;
  return v`<div class="zprops">
    <h4>${h("props.zone")}</h4>
    ${C(h("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${Z(t.name)}
      @change=${(o) => {
    const r = o.target, a = r.value.trim();
    if (!a || a === t.name) {
      r.value = t.name;
      return;
    }
    n(Fd(e, t.id, a));
  }} />`)}
    ${C(h("props.area"), v`<span class="val ro" data-field="zone-area">${il(fs(e, t))}</span>`)}
    ${C(h("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${Vs(t.shape.kind)}${Zi(t)}</span>`)}
    ${Sl("zone-automation", t.automation !== !1, (o) => {
    const r = bs(e, t.id, o);
    r !== e && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(qd(e, t.id))}>
        ${h("zones.keepOutline")}</button>` : y}</div>` : y}
    ${mm(e, t, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Ea(e, t.id))}>
      ${h("zones.delete")}</button>
  </div>`;
}
function gm(e) {
  const t = e.next.zone, n = t.name ?? vl(e.level), i = (s) => e.setNext({ ...e.next, zone: { ...t, ...s } });
  return v`
    <h4>${h("props.nextZone")}</h4>
    <div class="muted">${h("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${h("zones.method")}>
      ${["walls", "polygon"].map((s) => v`
        <button class=${t.method === s ? "on" : ""} role="radio" aria-checked=${String(t.method === s)} data-method=${s}
          @click=${() => {
    s !== t.method && e.onMethod(s);
  }}>${Vs(s)}<span>${h(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${h(`zones.hint.${t.method}`)}</p>
    ${C(h("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${Z(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Sl("next-zone-automation", t.automation, (s) => i({ automation: s }))}`;
}
function Al(e, t, n) {
  return Tt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function cr(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function wm(e, t) {
  const n = J(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(nu(t.level, e.id, o));
  return v`
    <h4>${h("props.wall")}</h4>
    ${C(h("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${C(h("props.thickness"), Al(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${C(h("props.baseline"), G(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: h(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${C(h("props.length"), v`<span class="val ro">${jt(n)} ${h("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(xs(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function bm(e, t) {
  const n = ["door", "window", "opening", ...vn.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(od(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = vn.includes(e.kind);
  return v`
    <h4>${h(`kind.${e.kind}`)}</h4>
    ${C(h("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(sd(e, r))))}
    ${C(h("props.width"), Al(t, e.width, (r) => cr(t, id(t.level, e.id, r))))}
    ${C(h("props.offset"), Tt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => cr(t, Jr(t.level, e.id, r))
  }))}
    ${o ? v`
      ${C(h("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${C(h("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : y}
    ${e.kind === "window" ? C(h("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : y}
    ${C(h("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${Z(Gr(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Kr(e.kind) ? void 0 : a });
  }} />`)}
    ${C(h("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${Z(Yr(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Xr(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? v`<p class="warn">${h("props.invalidOpening")}</p>` : y}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(ta(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function ym(e) {
  const t = ["bearing", "partition", "railing"];
  return v`
    <h4>${h("props.newWall")}</h4>
    ${C(h("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => v`<option value=${n} ?selected=${n === e.wallType}>${h(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${C(`${h("props.thickness")}, ${h("unit.mm")}`, Tt({
    value: e.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      e.setThickness(n);
    }
  }))}
    ${e.tool === "box" ? v`
      <div class="muted">${h("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => v`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${h(`measure.${n}`)}</button>`)}
      </div>` : y}`;
}
const dr = (e) => hm({
  level: e.level,
  selection: e.selection,
  query: e.zoneQuery,
  onQuery: e.onZoneQuery,
  onPick: e.onPickZone
});
function vm(e) {
  const { level: t, selection: n } = e;
  if (e.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? t.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${gm({ level: t, next: e.next, setNext: e.setNext, onMethod: e.onZoneMethod })}
      ${e.notice ? v`<p class="warn">${e.notice}</p>` : y}
      ${s ? lr(t, s, e.commit) : y}
      ${dr(e)}
    </div>`;
  }
  let i = y;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = wm(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = bm(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = lr(t, s, e.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${h("props.node")}</h4>
      ${C("X", v`<span class="val ro">${jt(s.x)}</span>`)}${C("Y", v`<span class="val ro">${jt(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === y && (e.tool === "wall" || e.tool === "box") ? ym(e) : i === y && qh(e.tool) ? Zh({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === y && e.tool === "select" ? dr(e) : i === y ? v`<p class="muted">${h("props.none")}</p>` : i}
      ${e.notice ? v`<p class="warn">${e.notice}</p>` : y}
    </div>`;
}
function $m(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const ur = /* @__PURE__ */ new WeakMap();
function Ts(e, t, n) {
  let i = ur.get(e);
  i || ur.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : $m(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function hn(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const on = (e) => e ?? y;
var xm = Object.defineProperty, Ge = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && xm(t, n, s), s;
};
const km = 100;
let Mm = 0;
const _m = (e) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${e}></path>`}</svg>`, Rs = class Rs extends ee {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Mm++}`, this.shown = null, this.onOutside = (t) => {
      t.composedPath().includes(this) || this.close();
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("pointerdown", this.onOutside, !0);
  }
  disconnectedCallback() {
    document.removeEventListener("pointerdown", this.onOutside, !0), super.disconnectedCallback();
  }
  close() {
    this.isOpen && (this.isOpen = !1, this.query = "");
  }
  openList() {
    this.isOpen = !0, this.query = "", this.active = 0, this.updateComplete.then(() => {
      var t;
      return (t = this.renderRoot.querySelector(".srch input")) == null ? void 0 : t.focus();
    });
  }
  pick(t) {
    this.close(), this.focusBox(), this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: t }, bubbles: !0, composed: !0 }));
  }
  /** Search runs over all rows; at most MAX_ROWS are rendered. Cached per row inputs and query. */
  filtered() {
    const t = [...this.rowDeps(), this.query.trim().toLowerCase()], n = this.shown;
    if (n && n.deps.length === t.length && n.deps.every((a, l) => a === t[l])) return n.value;
    const i = t[t.length - 1], s = [];
    let o = !1;
    for (const a of this.allRows())
      if (!(i && !a.search.includes(i))) {
        if (s.length === km) {
          o = !0;
          break;
        }
        s.push(a);
      }
    const r = { rows: s, more: o };
    return this.shown = { deps: t, value: r }, r;
  }
  /** Tooltip of the closed box and of a row; none by default. */
  boxTitle() {
  }
  rowTitle(t) {
  }
  optId(t) {
    return `${this.uid}-opt-${t}`;
  }
  /** The active row index kept inside the rows (the rows can shrink while the list is open). */
  clamped(t) {
    return Math.min(this.active, Math.max(t.length - 1, 0));
  }
  onSearchKey(t) {
    const { rows: n } = this.filtered();
    if (t.key === "ArrowDown")
      t.preventDefault(), this.active = Math.max(0, Math.min(this.active + 1, n.length - 1)), this.scrollActive();
    else if (t.key === "ArrowUp")
      t.preventDefault(), this.active = Math.max(this.active - 1, 0), this.scrollActive();
    else if (t.key === "Enter") {
      t.preventDefault();
      const i = n[this.clamped(n)];
      i && this.pick(i.id);
    } else t.key === "Escape" && (t.preventDefault(), t.stopPropagation(), this.close(), this.focusBox());
  }
  onFocusOut(t) {
    var i;
    const n = t.relatedTarget;
    this.isOpen && !(n && ((i = this.shadowRoot) != null && i.contains(n))) && this.close();
  }
  scrollActive() {
    this.updateComplete.then(() => {
      var t, n;
      return (n = (t = this.renderRoot.querySelector(".opt.on")) == null ? void 0 : t.scrollIntoView) == null ? void 0 : n.call(t, { block: "nearest" });
    });
  }
  focusBox() {
    this.updateComplete.then(() => {
      var t;
      return (t = this.renderRoot.querySelector(".cbox")) == null ? void 0 : t.focus();
    });
  }
  onBoxKey(t) {
    t.target === t.currentTarget && (t.key === "Enter" || t.key === " " || t.key === "ArrowDown") && (t.preventDefault(), this.openList());
  }
  renderClosed() {
    return v`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${on(this.label || void 0)} title=${on(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : y}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${on(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${on(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : y}
      ${n ? v`<div class="hint">${h("combo.more")}</div>` : y}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : y}</div>`;
  }
};
Rs.styles = _r`
    :host {
      display: block; position: relative;
      --c-text: var(--primary-text-color, #e8eaed);
      --c-muted: var(--secondary-text-color, #9aa3b2);
      --c-divider: var(--divider-color, #2c313a);
      --c-surface: var(--card-background-color, #1c1f26);
      --c-primary: var(--primary-color, #03a9f4);
      --c-hover: rgba(var(--rgb-primary-color, 3, 169, 244), .08);
      --c-tint: rgba(var(--rgb-primary-color, 3, 169, 244), .16);
    }
    .field { display: flex; align-items: center; background: var(--c-surface); border-bottom: 1px solid var(--c-muted); border-radius: 6px 6px 0 0; padding-right: 6px; }
    .field:hover { background: var(--c-hover); }
    .cbox { flex: 1; min-width: 0; display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 6px; padding: 8px 4px 8px 10px; cursor: pointer; min-height: 52px; color: var(--c-text); }
    .cbox:focus-visible, .x:focus-visible { outline: 2px solid var(--c-primary); outline-offset: -2px; }
    .ico { width: 22px; height: 22px; fill: var(--c-muted); }
    .cbox b, .opt b { display: block; font-weight: 500; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cbox small, .opt small { display: block; color: var(--c-muted); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ph { color: var(--c-muted); }
    .x, .car { color: var(--c-muted); padding: 2px 4px; font-size: 16px; background: none; border: 0; font-family: inherit; cursor: pointer; }
    .x:hover { color: var(--c-text); }
    .drop { position: absolute; z-index: 30; left: 0; right: 0; top: calc(100% + 4px); background: var(--c-surface); color: var(--c-text); border-radius: 8px; box-shadow: 0 8px 28px rgba(0, 0, 0, .45); overflow: hidden; }
    .srch { margin: 10px; display: flex; align-items: center; gap: 8px; border: 1px solid var(--c-muted); border-radius: 8px; padding: 7px 10px; }
    .srch:focus-within { border-color: var(--c-primary); }
    .srch input { flex: 1; min-width: 0; background: none; border: 0; color: var(--c-text); font: inherit; outline: none; }
    .opts { max-height: 300px; overflow: auto; border-top: 1px solid var(--c-divider); }
    .opt { display: grid; grid-template-columns: 28px 1fr auto; gap: 8px; align-items: center; padding: 9px 12px; border-bottom: 1px solid var(--c-divider); cursor: pointer; }
    .opt:hover { background: var(--c-hover); }
    .opt.on { background: var(--c-tint); }
    .side { text-align: right; font-size: 12.5px; color: var(--c-muted); }
    .hint { padding: 8px 12px; color: var(--c-muted); font-size: 12.5px; }
    .empty { padding: 12px; color: var(--c-muted); }
  `;
let Vt = Rs;
Ge([
  Mt()
], Vt.prototype, "value");
Ge([
  Mt()
], Vt.prototype, "label");
Ge([
  R()
], Vt.prototype, "isOpen");
Ge([
  R()
], Vt.prototype, "query");
Ge([
  R()
], Vt.prototype, "active");
var Sm = Object.defineProperty, Hs = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Sm(t, n, s), s;
};
const Am = {
  power: "M7,2V13H10V22L17,10H13L17,2H7Z",
  temperature: "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  humidity: "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0 0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0 1 11,11.25A1.25,1.25 0 0 1 9.75,12.5A1.25,1.25 0 0 1 8.5,11.25A1.25,1.25 0 0 1 9.75,10M14.25,14.5A1.25,1.25 0 0 1 15.5,15.75A1.25,1.25 0 0 1 14.25,17A1.25,1.25 0 0 1 13,15.75A1.25,1.25 0 0 1 14.25,14.5Z",
  motion: "M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M18,2.5A1.5,1.5 0 0 1 16.5,4A1.5,1.5 0 0 1 15,2.5A1.5,1.5 0 0 1 16.5,1A1.5,1.5 0 0 1 18,2.5Z",
  illuminance: "M12,7A5,5 0 0 1 17,12A5,5 0 0 1 12,17A5,5 0 0 1 7,12A5,5 0 0 1 12,7M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22M3.34,7L7.5,6.65L5.11,10.79L3.34,7M20.65,7L18.88,10.79L16.5,6.64L20.65,7M3.36,17L5.12,13.23L7.5,17.37L3.36,17M20.64,17L16.5,17.36L18.87,13.21L20.64,17Z",
  light: "M12,2A7,7 0 0 0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0 0 9,18H15A1,1 0 0 0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0 0 12,2M9,21A1,1 0 0 0 10,22H14A1,1 0 0 0 15,21V20H9V21Z",
  switch: "M17,7H7A5,5 0 0 0 2,12A5,5 0 0 0 7,17H17A5,5 0 0 0 22,12A5,5 0 0 0 17,7M17,15A3,3 0 0 1 14,12A3,3 0 0 1 17,9A3,3 0 0 1 20,12A3,3 0 0 1 17,15Z",
  event: "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0 0 5,21H19A2,2 0 0 0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z",
  fan: "M12,11A1,1 0 0 0 11,12A1,1 0 0 0 12,13A1,1 0 0 0 13,12A1,1 0 0 0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.69 9.22,10.88C9.41,10.4 9.73,9.97 10.13,9.65C8.15,5.96 8.94,2 12.5,2Z",
  generic: "M12,20A8,8 0 0 1 4,12A8,8 0 0 1 12,4A8,8 0 0 1 20,12A8,8 0 0 1 12,20M12,2A10,10 0 0 0 2,12A10,10 0 0 0 12,22A10,10 0 0 0 22,12A10,10 0 0 0 12,2Z"
}, pr = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Em = { light: "light", switch: "switch", event: "event", fan: "fan" };
function fr(e, t) {
  return e != null && e.deviceClass && pr[e.deviceClass] ? pr[e.deviceClass] : Em[(e == null ? void 0 : e.domain) ?? za(t)] ?? "generic";
}
const hr = (e) => _m(Am[e]);
function Im(e) {
  switch (e) {
    case "sensor":
      return h("combo.domain.sensor");
    case "binary_sensor":
      return h("combo.domain.binary_sensor");
    case "light":
      return h("combo.domain.light");
    case "switch":
      return h("combo.domain.switch");
    case "fan":
      return h("combo.domain.fan");
    case "event":
      return h("combo.domain.event");
    default:
      return e;
  }
}
class si extends Vt {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = hn(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? hn(this.meta, t) : null;
    return v`${hr(t ? fr(this.meta.entities.get(t), t) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : y}<small class="eid">${t}</small></span>` : v`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Va(this.states, t.entityId) ?? "unavailable";
    return v`${hr(fr(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Im(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = hn(this.meta, t).name;
    return n === t ? t : `${n} (${t})`;
  }
  rowTitle(t) {
    return t.name === t.id ? t.id : `${t.name} (${t.id})`;
  }
  searchLabel() {
    return h("combo.search");
  }
  emptyText() {
    return h("combo.empty");
  }
}
Hs([
  Mt({ attribute: !1 })
], si.prototype, "meta");
Hs([
  Mt({ attribute: !1 })
], si.prototype, "items");
Hs([
  Mt({ attribute: !1 })
], si.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", si);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ie = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), Ie(s, t);
  return !0;
}, Ln = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, El = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), Lm(t);
  }
};
function Pm(e) {
  this._$AN !== void 0 ? (Ln(this), this._$AM = e, El(this)) : this._$AM = e;
}
function Cm(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) Ie(i[o], !1), Ln(i[o]);
  else i != null && (Ie(i, !1), Ln(i));
  else Ie(this, e);
}
const Lm = (e) => {
  e.type == Et.CHILD && (e._$AP ?? (e._$AP = Cm), e._$AQ ?? (e._$AQ = Pm));
};
class Om extends ti {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), El(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (Ie(this, t), Ln(this));
  }
  setValue(t) {
    if (Qa(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const n = [...this._$Ct._$AH];
      n[this._$Ci] = t, this._$Ct._$AI(n, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zm = () => new Nm();
class Nm {
}
const Mi = /* @__PURE__ */ new WeakMap(), Vm = Jn(class extends Om {
  render(e) {
    return y;
  }
  update(e, [t]) {
    var i;
    const n = t !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = (i = e.options) == null ? void 0 : i.host, this.rt(this.ct = e.element)), y;
  }
  rt(e) {
    if (this.G !== void 0) if (this.isConnected || (e = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let n = Mi.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Mi.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = Mi.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), Dm = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], Tm = { min: 1, max: 10 };
function Il(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const Ki = (e, t, n) => Il(e, We(e.level, t.id, n));
function _i(e, t, n, i) {
  return v`<div class="cflag">${C(t, v`<input type="checkbox" data-field=${e} .checked=${Z(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Si = "__other", we = /* @__PURE__ */ new Set();
function Hm(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = Js.includes(i), a = !r || we.has(o), l = zm(), c = [...Js.map((d) => ({ v: d, label: d })), { v: Si, label: h("binding.eventOther") }];
  return v`<span class="evfield">${G(a ? Si : i, c, (d) => {
    if (d === Si) {
      we.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    we.delete(o), l.value && (l.value.hidden = !0), d !== i ? s(d) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${Vm(l)} data-field=${`${n}-event-custom`} ?hidden=${Ds(!a)}
      .value=${Z(r ? "" : i)} @change=${(d) => {
    var m;
    const p = d.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, e.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, e.setFieldNotice(null), f !== i) {
      s(f) && we.delete(o);
      return;
    }
    if (we.delete(o), r) {
      p.hidden = !0;
      const b = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      b && (b.value = i);
    }
  }} /></span>`;
}
function Rm(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return v`${y}`;
  const s = i[n], o = (r) => Ki(e, t, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${C(h("binding.slot"), G(
    String(s.slot),
    Dm(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${C(h("binding.event"), Hm(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function Bm(e, t, n) {
  const i = t.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return v`
      ${_i(
      "autoByDoubleToggle",
      h("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => Ki(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? v`<div class="cflag">${C(h("binding.window"), Tt({
      value: i.windowSec,
      rule: Tm,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => Ki(e, t, { windowSec: a })
    }))}</div>` : y}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${y}`;
  const s = (a, l) => (c) => {
    var d, p;
    const u = We(e.level, t.id, { [a]: c });
    return Il(e, c && !((d = t.bindings) != null && d[l]) ? Nn(u, t.id, l, ((p = t.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = _i("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${_i("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? y : r}`;
}
function Fm(e) {
  return e.props.kind !== "smart_button" || !fc(e).length ? v`${y}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function Gi(e, t) {
  return t === "control" && e.props.kind === "equipment" ? h("role.control.equipment") : t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? h("binding.onOff") : h(`role.${t}`);
}
const Ai = (e) => String(e).padStart(2, "0");
function Um(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${Ai(t.getHours())}:${Ai(t.getMinutes())}:${Ai(t.getSeconds())}`;
}
const jm = (e, t) => e.action !== "set" ? e.action : `set ${(t === "valve" ? e.value === "on" ? "open" : e.value === "off" ? "closed" : e.value : e.value) ?? ""}`.trim();
function Wm(e) {
  return e.status === "error" ? e.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : h("output.errorNotConfigured") : e.last ? h("output.last").replace("{event}", jm(e.last, e.kind)).replace("{time}", Um(e.last.at)) : h("output.none");
}
function qm(e, t) {
  if (!Dn(t.props.kind)) return y;
  const n = e.feed.stateOf(t), i = n ? Wm(n) : e.feed.error ?? (e.feed.ready ? h("output.notSaved") : null);
  return i === null ? y : v`<p class="note" data-field="output">${i}</p>`;
}
function Zm(e, t, n, i) {
  const s = Da(e.meta, i, e.states), o = pc(e.level, t, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : y}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : y}
    ${o.length ? v`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : y}`;
}
function Km(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = Gi(t, i);
  return v`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${h("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${Ts(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const c = Nn(e.level, t.id, i, l.detail.value);
    c !== e.level && e.commit(c);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && ns(i) ? Rm(e, t, i) : y}
    ${s ? Zm(e, t, i, s) : y}
  </div>`;
}
function Gm(e) {
  const t = e.device, n = is(e.level.devices.map(e.status));
  return v`<div class="props bprops">
    ${e.notice ? v`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : y}
    ${e.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : y}
    ${e.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${h(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : y}
    ${t ? v`
      <h4>${ii(t)}</h4>
      ${Ns(t, (i) => e.commit(We(e.level, t.id, {}, i)))}
      ${qm(e, t)}
      ${wt(t).map((i) => v`${Km(e, t, i)}${Bm(e, t, i.role)}`)}
      ${Fm(t)}` : v`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const Xm = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Ym = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Qm = 6, Jm = ["A", "0", "B"], t1 = ["power", "control"], e1 = ["power", "power_in", "power_out", "voltage", "control"], ce = (e) => ({ device: (t) => e.level.devices.find((n) => n.id === t) });
function be(e, t, n, i) {
  const { [n]: s, ...o } = t, r = i === null ? o : { ...o, [n]: i };
  e.commitPower({ ...e.power, blocks: e.power.blocks.map((a) => a.id === t.id ? r : a) });
}
function ye(e, t, n, i, s, o) {
  return v`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${t}>${n}</span></div>
    <ps-entity-combo data-field=${t} .meta=${e.meta} .states=${e.states} .items=${Ts(e.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const a = r.detail.value || null;
    a !== (s ?? null) && o(a);
  }}></ps-entity-combo>
  </div>`;
}
function n1(e, t) {
  const n = t.name ?? "";
  return C(h("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${t.kind}`)} .value=${Z(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? e.commitPower(Te(e.power, t.id, { name: o }, ce(e))) : s.value = n;
  }} />`);
}
function i1(e, t) {
  const n = new Set(wt(t).map((i) => i.role));
  return v`${t1.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = t.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${hn(e.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function rn(e, t, n) {
  return t === e.level ? !1 : (e.commit(t, n), !0);
}
function s1(e, t) {
  var o;
  const n = wt(t), i = e1.flatMap((r) => n.filter((a) => a.role === r)), s = t.props;
  return v`
    ${Ns(t, (r) => rn(e, We(e.level, t.id, {}, r)))}
    ${i.map((r) => {
    var a;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Gi(t, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${e.meta} .states=${e.states} .items=${Ts(e.meta, r, !1)}
        .value=${((a = t.bindings) == null ? void 0 : a[r.role]) ?? null} .label=${Gi(t, r.role)}
        @value-changed=${(l) => {
      l.stopPropagation(), rn(e, Nn(e.level, t.id, r.role, l.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = t.bindings) != null && o.control) ? Kt(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => rn(e, Un(e.level, t.id, r))
  ) : y}
    ${s.kind === "equipment" ? Kt("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const a = Ua(e.level, e.power, t.id, r);
    return rn(e, a.level, a.power);
  }) : y}`;
}
function o1(e, t) {
  const n = e.level.devices.find((s) => s.id === t.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
  const i = ue(n) ? y : Kt("output", h("power.enableOutput"), t.output !== !1, (s) => {
    const o = ce(e);
    if (s) {
      const { output: r, ...a } = t;
      e.commitPower({ ...e.power, blocks: e.power.blocks.map((l) => l.id === t.id ? a : l) });
    } else
      e.commitPower(Gn(Te(e.power, t.id, { output: !1 }, o), t.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${s1(e, n)}${i}` : v`
    ${C(h("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${C(h("props.kind"), v`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${i1(e, n)}${i}`;
}
function r1(e, t) {
  var s, o;
  const n = (o = (s = e.frame) == null ? void 0 : s.blocks[t.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return v`
    ${C(h("power.form"), G(t.form, i, (r) => {
    r !== t.form && e.commitPower(Te(e.power, t.id, { form: r }, ce(e)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${Jm.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => e.setPosition(t.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function a1(e, t) {
  const n = t.w >= t.h, i = n ? t.w : t.h, s = n ? t.h : t.w, o = (l, c) => {
    if (l === i && c === s) return !1;
    e.commitPower(Te(e.power, t.id, n ? { w: l, h: c } : { w: c, h: l }, ce(e)));
  }, r = (l, c, u) => Tt({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: l, skipSame: !0, apply: u }), a = ["h", "v"].map((l) => ({ v: l, label: h(`power.orientation.${l}`) }));
  return v`
    ${C(h("power.orientation"), G(n ? "h" : "v", a, (l) => {
    l !== (n ? "h" : "v") && e.commitPower(Te(e.power, t.id, { w: t.h, h: t.w }, ce(e)));
  }, "bus-orientation"))}
    ${C(h("power.busLength"), r("bus-length", i, (l) => o(Math.max(Ui, s + 1, l), s)))}
    ${C(h("power.busThickness"), r("bus-thickness", s, (l) => o(i, Math.min(Math.max(Qm, l), i - 1))))}`;
}
function l1(e, t) {
  switch (t.kind) {
    case "grid":
      return v`
      ${ye(e, "power", h("power.field.power"), Ut, t.power, (n) => be(e, t, "power", n))}
      ${ye(e, "voltage", h("power.field.voltage"), Xm, t.voltage, (n) => be(e, t, "voltage", n))}`;
    case "device":
      return o1(e, t);
    case "battery":
      return v`
      ${ye(e, "power", h("power.field.batteryPower"), Ut, t.power, (n) => be(e, t, "power", n))}
      ${ye(e, "soc", h("power.field.soc"), Ym, t.soc, (n) => be(e, t, "soc", n))}`;
    case "pv":
      return ye(e, "power", h("power.field.power"), Ut, t.power, (n) => be(e, t, "power", n));
    case "transfer":
      return r1(e, t);
    case "bus":
      return a1(e, t);
    default:
      return y;
  }
}
function c1(e, t) {
  const n = !!t.portPins && Object.keys(t.portPins).length > 0, i = t.kind === "device" ? e.level.devices.find((s) => s.id === t.deviceId) : void 0;
  return v`
    <h4>${i ? ii(i) : h(`power.title.${t.kind}`)}</h4>
    ${t.kind === "device" ? y : n1(e, t)}
    ${l1(e, t)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => e.commitPower(gu(e.power, t.id))}>${h("power.autoPorts")}</button>` : y}
      ${t.kind === "grid" ? y : v`<button class="btn danger" data-action="delete-block"
        @click=${() => e.commitPower(Ra(e.power, t.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function d1(e, t) {
  var s, o;
  const n = ce(e), i = (r) => {
    const a = e.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), l = a ? Yn(a, n) || h(`power.kind.${a.kind}`) : "—";
    return "block" in r ? `${l} · ${r.port}` : l;
  };
  return v`
    <h4>${h("power.wire")}</h4>
    ${C(h("power.wire.from"), v`<span class="val ro wide" data-field="wire-from">${i(t.from)}</span>`)}
    ${C(h("power.wire.to"), v`<span class="val ro wide" data-field="wire-to">${i(t.to)}</span>`)}
    ${C(h("power.wire.power"), v`<span class="val ro" data-field="wire-power">${te((o = (s = e.frame) == null ? void 0 : s.wires[t.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => e.commitPower(ja(e.power, t.id))}>${h("action.delete")}</button></div>`;
}
function u1(e) {
  const t = Wa(e.level, e.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = wl(e.level);
    e.commit(i.level), e.onPlaceDevice(i.id);
  }}>${h("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${h("power.help.device")}</p>
    ${t.length === 0 ? v`<p class="muted" data-note="no-devices">${h("power.noDevices")}</p>` : v`<div class="pdevs">
      ${t.map((i) => v`<button class="pdev${i.id === e.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === e.placeDeviceId ? "true" : "false"} @click=${() => e.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${ii(i)}</span>
      </button>`)}
    </div>`}`;
}
function p1(e) {
  if (e.toolId === "power-device") return u1(e);
  const t = e.selection, n = (t == null ? void 0 : t.kind) === "powerBlock" ? e.power.blocks.find((s) => s.id === t.id) : void 0;
  if (n) return c1(e, n);
  const i = (t == null ? void 0 : t.kind) === "powerWire" ? e.power.wires.find((s) => s.id === t.id) : void 0;
  return i ? d1(e, i) : e.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function f1(e) {
  return v`<div class="props pprops">
    ${e.notice ? v`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : y}
    ${e.feedError ? v`<p class="note" data-notice="feed">${e.feedError}</p>` : y}
    ${p1(e)}
  </div>`;
}
function h1(e, t) {
  return e.mode !== "binding" ? Oh(e.mode, e.toolId, (n) => e.pickTool(n)) : Uh({
    level: t,
    selection: e.selection,
    status: e.bindStatus,
    filter: e.bindFilter,
    query: e.bindQuery,
    onFilter: (n) => {
      e.bindFilter = n;
    },
    onQuery: (n) => {
      e.bindQuery = n;
    },
    onPick: (n) => e.pickDevice(n),
    collapsed: e.railCollapsed,
    onCollapse: (n) => {
      e.railCollapsed = n;
    }
  });
}
function m1(e, t) {
  var i;
  const n = e.selection;
  return Gm({
    level: t,
    device: (n == null ? void 0 : n.kind) === "device" ? t.devices.find((s) => s.id === n.id) ?? null : null,
    meta: e.haMeta.get(),
    states: (i = e.hass) == null ? void 0 : i.states,
    status: e.bindStatus,
    showAll: e.showAll,
    onShowAll: (s) => {
      e.showAll = { ...e.showAll, [s]: !e.showAll[s] };
    },
    commit: (s) => e.commit(s),
    onNextUnbound: () => e.nextUnboundDevice(),
    notice: e.notice,
    fieldNotice: e.fieldNotice,
    setFieldNotice: (s) => {
      e.fieldNotice = s;
    },
    registryError: e.haMeta.error,
    registryLoading: e.haMeta.loading,
    onRetry: () => e.haMeta.retry(),
    feed: e.feed
  });
}
function g1(e, t) {
  var i;
  if (e.mode === "binding") return m1(e, t);
  if (e.mode === "power")
    return f1({
      power: e.power,
      level: t,
      selection: e.selection,
      meta: e.haMeta.get(),
      states: (i = e.hass) == null ? void 0 : i.states,
      frame: e.powerFeed.frame,
      notice: e.notice,
      feedError: e.powerFeed.error,
      toolId: e.toolId,
      placeDeviceId: e.placeDeviceId,
      onPlaceDevice: (s) => e.armDevice(s),
      commit: (s, o) => e.commit(s, o),
      commitPower: (s) => e.commitPower(s),
      setPosition: (s, o) => e.setPowerPosition(s, o)
    });
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (s) => e.commit(s),
    setNotice: (s) => {
      e.notice = s;
    }
  };
  return e.mode === "equipment" ? fm({
    ...n,
    power: e.power,
    commit: (s, o) => e.commit(s, o),
    toolId: e.toolId,
    nextProps: e.nextProps,
    setNextProps: (s) => {
      e.nextProps = s;
    },
    nextWallMount: e.nextObj.wallMount,
    setNextWallMount: (s) => {
      e.nextObj = { ...e.nextObj, wallMount: s };
    },
    pickDevice: (s) => e.pickDevice(s)
  }) : vm({
    ...n,
    tool: e.toolId,
    boxMeasure: e.boxMeasure,
    wallType: e.wallType,
    thickness: e.thickness,
    next: e.nextObj,
    setNext: (s) => {
      e.nextObj = s;
    },
    setWallType: (s) => e.setWallType(s),
    setThickness: (s) => {
      e.thickness = s;
    },
    setBoxMeasure: (s) => {
      e.boxMeasure = s;
    },
    zoneQuery: e.zoneQuery,
    onZoneQuery: (s) => {
      e.zoneQuery = s;
    },
    onPickZone: (s) => e.pickZone(s),
    onZoneMethod: (s) => {
      e.nextObj = { ...e.nextObj, zone: { ...e.nextObj.zone, method: s } }, e.pickTool("zone");
    }
  });
}
function w1(e, t) {
  switch (e) {
    case "wall":
      return [["Shift", h("hint.shift")], [h("hint.digits"), h("hint.length")], ["Tab", h("hint.tab")], ["Esc", h("hint.esc")]];
    case "box":
      return [[h("hint.digits"), h("hint.size")], ["Tab", h("hint.tabSize")], ["Esc", h("hint.esc")]];
    case "zone":
      return t === "polygon" ? [
        ["Enter", h("hint.close")],
        ["Backspace", h("hint.removeVertex")],
        ["Shift", h("hint.shift")],
        ["Alt", h("hint.freeVertex")],
        ["Esc", h("hint.cancel")]
      ] : [["Esc", h("hint.esc")]];
    case "select":
    case "device-select":
    case "power-select":
      return [["Del", h("hint.delete")], ["Esc", h("hint.deselect")]];
    case "binding-select":
      return [["Esc", h("hint.deselect")]];
    default:
      return [["Esc", h("hint.esc")]];
  }
}
function b1(e, t) {
  const n = e === "zone" ? `${h("tool.zone")} · ${h(`zones.kind.${t}`)}` : h(`tool.${e}`);
  return v`<span class="tool-chip">${gl(e)}${n}</span>`;
}
function y1(e) {
  return v`
    <div class="status">
      ${b1(e.tool, e.zoneMethod)}
      ${w1(e.tool, e.zoneMethod).map(([t, n]) => v`<span><span class="kbd">${t}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${e.snap ? v`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${h(e.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${e.power ? y : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function v1(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: h(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: h("unit.mm")
    },
    {
      label: h(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? h("unit.mm") : "°"
    }
  ];
  return _`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((a, l) => _`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${n.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${a.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? n.text : n.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function $1(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: c } = s[0], u = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: jt(u), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: jt(r), second: jt(a) };
}
function x1(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const k1 = _r`
  :host { display: block; height: 100%; outline: none; }
  .bubble { pointer-events: none; transform-box: fill-box; transform-origin: center; }
  .bubble-in { animation: bubble-pop 180ms ease-out; }
  .bubble-out { animation: bubble-fade 400ms forwards; }
  @keyframes bubble-pop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes bubble-fade { from { opacity: 1; } to { opacity: 0; transform: scale(0.9); } }
  @media (prefers-reduced-motion: reduce) { .bubble-in, .bubble-out { animation: none; } .bubble-out { opacity: 0; } }
  .ed {
    --ch-bg: var(--primary-background-color, var(--ps-background));
    --ch-card: var(--card-background-color, var(--ps-panel));
    --ch-text: var(--primary-text-color, var(--ps-text));
    --ch-muted: var(--secondary-text-color, var(--ps-muted));
    --ch-divider: var(--divider-color, var(--ps-border));
    --ch-primary: var(--primary-color, #03a9f4);
    --ch-on-primary: var(--text-primary-color, #fff);
    --ch-error: var(--error-color, var(--ps-invalid));
    --ch-radius: var(--ha-card-border-radius, 12px);
    --ch-tint: rgba(var(--rgb-primary-color, 3, 169, 244), .14);
    --ch-hover: rgba(var(--rgb-primary-color, 3, 169, 244), .06);
    display: grid; grid-template-columns: 84px 240px 1fr; grid-template-rows: auto 1fr 30px;
    height: 100vh; overflow: hidden; position: relative;
    background: var(--ch-bg); color: var(--ch-text);
    font-size: 14px; font-family: var(--ha-font-family-body, Roboto, "Noto Sans", system-ui, sans-serif);
  }
  .ed.binding { grid-template-columns: 250px 300px 1fr; }
  .ed.binding.rail-off { grid-template-columns: 36px 300px 1fr; }
  .ed.power { grid-template-columns: 84px 300px 1fr; }
  @media (max-width: 700px) {
    .ed { grid-template-columns: 72px 170px 1fr; }
    .ed.binding { grid-template-columns: 170px 200px 1fr; }
    .ed.power { grid-template-columns: 72px 200px 1fr; }
    .tools .tool { font-size: 10.5px; }
    .ed.binding.rail-off { grid-template-columns: 36px 200px 1fr; }
    .props .row { flex-wrap: wrap; }
    .props .val { max-width: 100%; }
  }
  .center { display: flex; align-items: center; justify-content: center; gap: 12px; height: 100vh;
    font: 14px var(--ha-font-family-body, Roboto, system-ui, sans-serif); }
  button { font: inherit; cursor: pointer; }
  button:disabled { opacity: .45; cursor: default; }
  button:focus-visible { outline: 2px solid var(--ch-primary); outline-offset: 2px; }
  .sp { flex: 1; }
  .muted { color: var(--ch-muted); font-size: 13px; }

  /* Header: an HA-like action bar above the wizard title block. */
  .top { grid-column: 1 / 4; min-width: 0; background: var(--ch-card); border-bottom: 1px solid var(--ch-divider); }
  .bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 12px; min-height: 48px;
    box-sizing: border-box; }
  .btn { padding: 6px 12px; border: 1px solid var(--ch-divider); border-radius: 8px; background: transparent;
    color: var(--ch-text); white-space: nowrap; }
  .btn:hover:not(:disabled) { background: var(--ch-hover); }
  .btn.primary { border-color: var(--ch-primary); background: var(--ch-primary); color: var(--ch-on-primary); font-weight: 500; }
  .btn.primary:hover:not(:disabled) { background: var(--ch-primary); filter: brightness(1.08); }
  .btn.danger { margin-top: 14px; color: var(--ch-error); border-color: var(--ch-error); }
  input, select { font: inherit; color: var(--ch-text); background: var(--ch-bg);
    border: 1px solid var(--ch-divider); border-radius: 6px; padding: 3px 6px; }
  input:focus-visible, select:focus-visible { outline: none; border-color: var(--ch-primary); box-shadow: 0 0 0 1px var(--ch-primary); }
  .plan-pick { max-width: 180px; }
  .save-state { font-size: 12px; color: var(--ch-muted); max-width: 260px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; }
  .save-state.conflict, .save-state.error { color: var(--ch-error); }

  /* Wizard steps as a drawing title block: ruled cells, tabular numerals, sentence case. */
  .steps { display: grid; grid-template-columns: minmax(150px, 1.2fr) repeat(6, minmax(96px, 1fr)) auto;
    border-top: 1px solid var(--ch-divider); font-variant-numeric: tabular-nums; }
  .steps > * { min-width: 0; border-right: 1px solid var(--ch-divider); }
  .steps .title { display: flex; flex-direction: column; justify-content: center; gap: 1px; padding: 6px 12px; }
  .steps .plan-name { width: 100%; box-sizing: border-box; margin-left: -5px; padding: 2px 4px; font-size: 16px;
    font-weight: 500; background: transparent; border-color: transparent; }
  .steps .plan-name:hover { border-color: var(--ch-divider); }
  .steps .app { font-size: 12px; color: var(--ch-muted); }
  .step { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 1px;
    padding: 8px 14px 9px; border: 0; border-right: 1px solid var(--ch-divider); background: none;
    color: var(--ch-muted); text-align: left; }
  .step:hover:not(:disabled) { background: var(--ch-hover); }
  .step:focus-visible { outline-offset: -2px; }
  .step .n { font-size: 12px; }
  .step .name { font-size: 15px; font-weight: 500; color: var(--ch-text); }
  .step .state { font-size: 12px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .step.done .state::before { content: '\\2713\\00a0'; color: var(--ch-primary); }
  .step.current { background: var(--ch-hover); }
  .step.current .name { color: var(--ch-primary); }
  .step.current::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--ch-primary); }
  .steps .nav { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 6px 12px; border-right: 0; }
  @media (max-width: 900px) {
    .steps { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .steps .title, .steps .nav { grid-column: 1 / -1; border-right: 0; }
    .steps .title { border-bottom: 1px solid var(--ch-divider); }
    .steps .nav { border-top: 1px solid var(--ch-divider); }
    .step { padding: 6px 10px; }
  }

  /* Left rail: tools, or the binding device list. */
  .tools { background: var(--ch-card); border-right: 1px solid var(--ch-divider); display: flex;
    flex-direction: column; gap: 4px; padding: 8px 6px; min-height: 0; overflow-y: auto; box-sizing: border-box; }
  /* A tool button: a 24 px icon above a label that wraps to two lines (never cut); the Plan shortcut in the corner. */
  .tool { position: relative; flex: none; min-height: 58px; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 3px; padding: 4px 2px; border-radius: 8px; border: 0; background: transparent;
    color: var(--ch-text); font-size: 11px; line-height: 1.1; text-align: center; }
  .tool .ticon { width: 24px; height: 24px; fill: currentColor; flex: none; opacity: .8; }
  .tool .tlabel { max-width: 100%; overflow-wrap: break-word; }
  .tool:hover { background: var(--ch-hover); }
  .tool.on { background: var(--ch-tint); color: var(--ch-primary); font-weight: 600; }
  .tool.on .ticon { opacity: 1; }
  .tool.on::before { content: ''; position: absolute; left: -6px; top: 10px; bottom: 10px; width: 3px; border-radius: 2px;
    background: var(--ch-primary); }
  .tool[data-key]::after { content: attr(data-key); position: absolute; right: 5px; top: 4px; font-size: 9.5px;
    font-weight: 400; color: var(--ch-muted); opacity: .75; }
  .tool-sep { flex: none; height: 1px; background: var(--ch-divider); margin: 2px 8px; }
  .blist { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--ch-card);
    border-right: 1px solid var(--ch-divider); }
  /* Plan step zones: the list in the properties, the Zone tool's method switch, the zone properties. */
  .zlist { margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--ch-divider); }
  .zlist .list-search { margin: 6px 0; width: 100%; box-sizing: border-box; }
  .zlist .zrow { grid-template-columns: 12px minmax(0, 1fr) auto auto; padding: 5px 6px; border-radius: 6px; }
  .zkind, .zarea { color: var(--ch-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
  .micon { width: 16px; height: 16px; fill: currentColor; display: block; flex: none; }
  .mseg { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--ch-divider); border-radius: 8px;
    overflow: hidden; margin: 6px 0 4px; }
  .mseg button { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 6px; border: 0;
    background: none; color: var(--ch-muted); font-size: 12.5px; }
  .mseg button + button { border-left: 1px solid var(--ch-divider); }
  .mseg button .micon { width: 22px; height: 22px; }
  .mseg button.on { background: var(--ch-tint); color: var(--ch-primary); font-weight: 500; }
  .hint { font-size: 12.5px; margin: 8px 0 10px; }
  .zcheck { display: flex; align-items: center; gap: 8px; margin: 8px 0; cursor: pointer; }
  .zcheck input { margin: 0; }
  .zkindval { display: inline-flex; align-items: center; gap: 6px; }
  .warnbox { border: 1px solid var(--ch-error); border-radius: 8px; padding: 8px 10px; margin: 8px 0; }
  .warnbox .warn { margin: 0 0 6px; }
  .bhead { display: flex; align-items: center; gap: 4px; margin: 10px 6px 0 10px; }
  .filter-seg { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(3, 1fr);
    border: 1px solid var(--ch-divider); border-radius: 8px; overflow: hidden; }
  .filter-seg button { border: 0; border-right: 1px solid var(--ch-divider); background: none; color: var(--ch-muted);
    padding: 6px 4px; font-size: 12.5px; }
  .filter-seg button:last-child { border-right: 0; }
  .filter-seg button[aria-checked='true'] { background: var(--ch-tint); color: var(--ch-primary); font-weight: 500; }
  .filter-seg .count { font-variant-numeric: tabular-nums; opacity: .8; }
  .list-search { margin: 8px 10px 6px; padding: 5px 8px; }
  .rows { flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 8px; }
  .brow, .zrow { display: grid; grid-template-columns: 12px minmax(0, 1fr) auto; gap: 10px; align-items: center;
    width: 100%; padding: 6px 12px; border: 0; background: none; color: var(--ch-text); text-align: left; }
  .brow:hover, .zrow:hover { background: var(--ch-hover); }
  .brow.sel, .zrow.sel { background: var(--ch-tint); box-shadow: inset 3px 0 0 var(--ch-primary); }
  .brow .name, .zrow .name, .member .name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .brow .kind, .member .kind { display: block; color: var(--ch-muted); font-size: 12px; }
  .bgroup h5 { margin: 12px 12px 4px; color: var(--ch-muted); font-size: 12px; font-weight: 600; }
  .brow .cnt { color: var(--ch-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
  .zswatch { width: 12px; height: 12px; box-sizing: border-box; border-radius: 3px; }
  .zswatch.zinvalid { border: 1.5px solid var(--ch-error);
    background: repeating-linear-gradient(45deg, var(--ch-error) 0 1.5px, transparent 1.5px 4px); }
  .dot { width: 10px; height: 10px; box-sizing: border-box; border-radius: 50%; border: 2px dashed var(--ch-muted); }
  .dot.partial { border: 2px solid #f59e0b; }
  .dot.missing { border: 2px solid #f43f5e; }
  .dot.bound { border: 2px solid var(--ch-muted); background: var(--ch-muted); }
  .empty { margin: 14px 12px; color: var(--ch-muted); font-size: 13px; }
  .rail-toggle { flex: none; width: 26px; height: 28px; padding: 0; border: 0; border-radius: 6px; background: none;
    color: var(--ch-muted); font-size: 20px; line-height: 1; }
  .rail-toggle:hover { background: var(--ch-hover); color: var(--ch-text); }
  .blist.collapsed { align-items: center; padding-top: 10px; }

  /* Canvas: the drawing keeps the blueprint palette. */
  .canvas { position: relative; min-width: 0; min-height: 0; touch-action: none; }
  .canvas svg { width: 100%; height: 100%; display: block; user-select: none; }
  .draft-banner { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); z-index: 5;
    display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--ch-radius);
    background: var(--ch-card); border: 1px solid var(--ch-primary); white-space: nowrap; }

  /* Properties panel. */
  .props { background: var(--ch-card); border-right: 1px solid var(--ch-divider); padding: 12px; min-width: 0;
    overflow-y: auto; font-size: 13px; }
  .props h4 { margin: 0 0 10px; font-size: 14px; font-weight: 500; color: var(--ch-text); }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; }
  .row > span:first-child { color: var(--ch-muted); }
  .val { min-width: 70px; max-width: 120px; text-align: right; }
  .val.wide { max-width: 140px; text-align: left; }
  .val.ro { padding: 2px 6px; }
  .num { width: 56px; text-align: right; }
  .seg { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .seg button { padding: 5px 10px; border-radius: 6px; border: 0; background: transparent; color: var(--ch-muted); }
  .seg button.on { background: var(--ch-tint); color: var(--ch-primary); }
  .warn { color: var(--ch-error); font-size: 12px; }

  /* Binding properties: stacked fields like HA forms. */
  .role-label { color: var(--ch-muted); font-size: 12px; }
  .role { margin-top: 14px; }
  .role-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .showall { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--ch-muted); cursor: pointer; }
  .note { margin: 4px 0 0; color: var(--ch-muted); font-size: 12px; }
  .bprops .warn { margin: 4px 0 0; }
  .bprops .reload { margin-top: 12px; }
  /* Input containers: a trigger's slot and event under its entity; checkboxes between the role sections they
     reveal; the duplicate warning after the roles. */
  .trigger .row { margin: 4px 0; }
  .cflag { margin-top: 10px; }
  .cflag .row { margin: 0; }
  .cflag input[type="checkbox"] { margin: 0; }
  .cfields { margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--ch-divider); }
  .reg-error { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px;
    border: 1px solid var(--ch-error); border-radius: 8px; }
  .reg-error .warn { flex: 1; margin: 0; }
  /* Zones properties: below the Zone tool's next-zone settings, a divider; the member list with its Participates column. */
  .props .zprops:not(:first-child) { margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--ch-divider); }
  .zmembers { margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--ch-divider); }
  .zhead { display: flex; justify-content: space-between; gap: 8px; color: var(--ch-muted); font-size: 12px; }
  .member { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; cursor: pointer; }
  .member .nm { min-width: 0; }
  .member input[type="checkbox"] { margin: 0; }
  /* Equipment properties with nothing selected: the devices not on the plan (rows styled as .pdev). */
  .unplaced { margin-top: 16px; padding-top: 10px; border-top: 1px solid var(--ch-divider); }
  .uhead { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .uhead h4 { margin: 0; }
  /* Power properties: the Device tool's list, read-only bindings, the action buttons. */
  .pdevs { display: flex; flex-direction: column; margin: 8px -12px 0; }
  .pdev { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; width: 100%; padding: 6px 12px;
    border: 0; background: none; color: var(--ch-text); text-align: left; }
  .pdev:hover { background: var(--ch-hover); }
  .pdev.sel { background: var(--ch-tint); box-shadow: inset 3px 0 0 var(--ch-primary); }
  .pdev .name { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pdev .kind { color: var(--ch-muted); font-size: 12px; }
  .bound { display: flex; flex-direction: column; gap: 1px; padding: 6px 10px; border: 1px solid var(--ch-divider);
    border-radius: 6px; color: var(--ch-muted); overflow-wrap: anywhere; }
  .bound b { font-weight: 400; color: var(--ch-text); }
  .bound small { font-size: 12px; }
  .pprops .val, .pprops .val.wide { max-width: min(190px, 100%); }
  .pprops .seg { margin-top: 0; }
  .pprops [data-notice="feed"] { margin: 0 0 10px; }
  .pprops .seg button { min-width: 34px; border: 1px solid var(--ch-divider); font-variant-numeric: tabular-nums; }
  .pprops .seg button.on { border-color: var(--ch-primary); }
  .pactions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .pactions .btn.danger { margin-top: 0; }
  .bfoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 18px;
    padding-top: 10px; border-top: 1px solid var(--ch-divider); color: var(--ch-muted); }

  /* Status bar and dialogs. */
  .status { grid-column: 1 / 4; background: var(--ch-card); border-top: 1px solid var(--ch-divider); display: flex;
    gap: 18px; align-items: center; padding: 0 10px; font-size: 12px; color: var(--ch-muted); white-space: nowrap;
    overflow: hidden; }
  .tool-chip { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 5px;
    background: var(--ch-tint); color: var(--ch-primary); font-weight: 600; }
  .tool-chip .ticon { width: 14px; height: 14px; fill: currentColor; }
  .kbd { border: 1px solid var(--ch-divider); border-radius: 3px; padding: 0 4px; color: var(--ch-text); }
  .grid-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; }
  .backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); display: flex; align-items: center;
    justify-content: center; z-index: 10; }
  .dialog { background: var(--ch-card); border: 1px solid var(--ch-divider); border-radius: var(--ch-radius); padding: 18px 20px;
    max-width: 420px; box-shadow: 0 8px 28px rgba(0, 0, 0, .35); }
  .dialog h3 { margin: 0 0 8px; font-weight: 500; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
`, M1 = 5e-3, _1 = 2, On = (e) => Math.max(M1, Math.min(_1, e));
function S1(e, t, n) {
  var r;
  const i = (r = e == null ? void 0 : e.getScreenCTM) == null ? void 0 : r.call(e), s = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (s && Number.isFinite(s.a) && Number.isFinite(s.d))
    return { x: s.a * n.clientX + s.c * n.clientY + s.e, y: s.b * n.clientX + s.d * n.clientY + s.f };
  const o = e == null ? void 0 : e.getBoundingClientRect();
  return {
    x: t.x + (n.clientX - ((o == null ? void 0 : o.left) ?? 0)) / t.scale,
    y: t.y + (n.clientY - ((o == null ? void 0 : o.top) ?? 0)) / t.scale
  };
}
function A1(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: On(Math.min(t, n) / 12e3) };
  const i = e.map((d) => d.x), s = e.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, u = On(Math.min(t / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - t / u / 2, y: (l + c) / 2 - n / u / 2, scale: u };
}
function E1(e, t, n, i, s) {
  const o = On(Math.min(s, t / (e.w + 2 * i), n / (e.h + 2 * i)));
  return { x: e.x + e.w / 2 - t / o / 2, y: e.y + e.h / 2 - n / o / 2, scale: o };
}
function I1(e, t, n) {
  const i = On(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function P1(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function mr(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function C1(e, t, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * e.scale >= 6 ? 100 * s : o, a = 1 / e.scale;
  return _`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${a}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${a}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const L1 = ["Shift", "Control", "Alt", "Meta"], O1 = {
  plan: "select",
  equipment: "device-select",
  power: "power-select"
}, z1 = new Map(Object.entries(ml).map(([e, t]) => [`Key${t}`, e]));
function gr(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class N1 {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
      var s, o;
      this.h.focus();
      const i = n.currentTarget;
      if (n.button === 1 || n.button === 0 && this.spaceDown) {
        n.preventDefault(), this.spacePending = !1, this.panFrom = { x: n.clientX, y: n.clientY }, (s = i.setPointerCapture) == null || s.call(i, n.pointerId);
        return;
      }
      n.button === 0 && ((o = i.setPointerCapture) == null || o.call(i, n.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(n)), this.h.requestUpdate());
    }, this.pointerMove = (n) => {
      if (this.panFrom) {
        this.h.view = P1(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
        return;
      }
      this.h.activeTool.move(this.toolEvent(n)), this.h.requestUpdate();
    }, this.pointerUp = (n) => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      n.button !== 0 || !this.pointerActive || (this.pointerActive = !1, this.h.activeTool.up(this.toolEvent(n)), this.h.requestUpdate());
    }, this.pointerAbort = () => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      if (!this.pointerActive) return;
      this.pointerActive = !1;
      const n = this.h.activeTool.preview();
      (n.level || n.power || n.wireDraft) && this.h.activeTool.cancel(), this.h.requestUpdate();
    }, this.dblClick = (n) => {
      var i, s;
      n.button === 0 && ((s = (i = this.h.activeTool).dblclick) == null || s.call(i, this.toolEvent(n)), this.h.requestUpdate());
    }, this.wheel = (n) => {
      n.preventDefault(), this.h.view = I1(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (gr(n) || !this.h.history) return;
      const i = n.ctrlKey || n.metaKey, s = n.code === "KeyZ" ? "z" : n.code === "KeyY" ? "y" : n.code === "KeyS" ? "s" : n.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        if (n.preventDefault(), s === "z" && !n.shiftKey && this.h.activeTool.key("Undo", { shift: !1 })) {
          this.h.requestUpdate();
          return;
        }
        s === "z" && !n.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && s === "s") {
        n.preventDefault(), this.h.doSave();
        return;
      }
      if (n.key === " ") {
        n.preventDefault(), !n.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? z1.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let a = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!a && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (a = this.h.deleteSelection()), !a && n.key === "Escape") {
        const l = O1[this.h.mode];
        l && this.h.toolId !== l ? this.h.pickTool(l) : (this.h.activeTool.cancel(), this.h.selection = null), a = !0;
      }
      a && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || gr(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !L1.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function Pl(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function V1(e) {
  return v`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", Pl(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function ve(e, t, n, i) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? v`<p class="muted">${i}</p>` : y}
        <div class="actions">
          ${n.map((s) => v`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function D1(e) {
  var n;
  const t = { action: "cancel", label: h("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? ve(h("draft.title"), h("draft.text").replace("{time}", Pl(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => e.discard(i) }
      ]) : y;
    }
    case "new":
      return ve(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return ve(h("delete.title"), h("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return ve(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return ve(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return y;
  }
}
const $e = "plan_studio.draft.", an = "plan_studio.lastPlanId";
function T1() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function H1(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class R1 {
  constructor(t = T1, n = 500) {
    this.storage = t, this.delayMs = n, this.timer = null, this.pending = null;
  }
  /** Writes `make()` after the delay; later calls within the delay replace the pending draft. */
  schedule(t) {
    this.pending = t, this.timer === null && (this.timer = setTimeout(() => {
      this.timer = null, this.flush();
    }, this.delayMs));
  }
  /** Writes the pending draft now, if any. */
  flush() {
    this.cancelTimer();
    const t = this.pending;
    this.pending = null, t && this.write(t());
  }
  /** Drops the pending write without writing. */
  cancel() {
    this.cancelTimer(), this.pending = null;
  }
  write(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem($e + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem($e + t), s = i ? JSON.parse(i) : null;
      return H1(s) && s.planId === t ? s : null;
    } catch {
      return null;
    }
  }
  /** Newest draft of any plan (used when the server has no plans, e.g. an unsaved new plan). */
  latest() {
    try {
      const t = this.storage();
      if (!t) return null;
      let n = null;
      for (let i = 0; i < t.length; i++) {
        const s = t.key(i);
        if (!(s != null && s.startsWith($e))) continue;
        const o = this.read(s.slice($e.length));
        o && (!n || o.savedAt > n.savedAt) && (n = o);
      }
      return n;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var t;
    try {
      return ((t = this.storage()) == null ? void 0 : t.getItem(an)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(an, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(an)) === t && n.removeItem(an);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem($e + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Cl = 5e3, Ll = 12;
function wr(e) {
  e().catch(() => {
  });
}
class B1 {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.onDisconnected = () => {
      this.cancelRetry(), this.drop(!1), this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.host.requestUpdate();
    }, this.onReady = () => {
      this.cancelRetry(), this.retries = 0, this.drop(!0), this.subscribe();
    };
  }
  /** The first full message for the watched plan has arrived. */
  get ready() {
    return this.gotFull;
  }
  /** Why there are no live outputs (no subscription support, or the subscription failed), else null. */
  get error() {
    return this.failure;
  }
  get(t) {
    return this.map.get(t);
  }
  /** The device's live state; undefined when the saved plan has no such container or has it as another kind. */
  stateOf(t) {
    const n = this.map.get(t.id);
    return (n == null ? void 0 : n.kind) === t.props.kind ? n : void 0;
  }
  watch(t) {
    t !== this.planId && (this.stop(), this.planId = t, t !== null && this.start());
  }
  /**
   * Ends the subscription (also one still being set up), cancels the retries, stops listening to the
   * connection and forgets the states; any plan can be watched again.
   */
  stop() {
    this.unlisten(), this.cancelRetry(), this.retries = 0, this.drop(!0), this.planId = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null;
  }
  start() {
    var n, i;
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(h("output.noLive"));
      return;
    }
    this.conn = t, (n = t.addEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t.addEventListener) == null || i.call(t, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const t = this.conn;
    this.conn = null, (n = t == null ? void 0 : t.removeEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t == null ? void 0 : t.removeEventListener) == null || i.call(t, "ready", this.onReady);
  }
  /** Ends the current subscription: its messages are ignored from now on; `unsubscribe` also tells the server. */
  drop(t) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, t && n.unsub && wr(n.unsub));
  }
  subscribe() {
    const t = this.conn, n = this.planId;
    if (!(t != null && t.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, t.subscribeMessage(
      (s) => {
        i.live && this.apply(s);
      },
      { type: "plan_studio/containers/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!i.live) {
          wr(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure($t(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ll || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Cl));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(t) {
    const n = Object.entries(t.containers ?? {});
    if (t.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, s] of n) this.map.set(i, s);
    this.host.requestUpdate();
  }
  setFailure(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
const F1 = ["power", "voltage", "power_in", "power_out", "control"], U1 = 300;
function br(e) {
  e().catch(() => {
  });
}
function j1(e, t) {
  var s;
  const n = new Map(t.devices.map((o) => [o.id, o])), i = {};
  for (const o of e.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const a = { inverter: ue(r), controllable: sa(r) };
    for (const l of F1) {
      const c = (s = r.bindings) == null ? void 0 : s[l];
      c && (a[l] = c);
    }
    i[r.id] = a;
  }
  return { power: e, devices: i };
}
class W1 {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.payload = null, this.json = "", this.sub = null, this.current = null, this.failure = null, this.conn = null, this.offline = !1, this.retryTimer = null, this.retries = 0, this.debounceTimer = null, this.onDisconnected = () => {
      this.offline = !0, this.cancelRetry(), this.drop(!1), this.current = null, this.host.requestUpdate();
    }, this.onReady = () => {
      this.offline = !1, this.restart();
    };
  }
  /** The latest frame of the current draft; null before the first one, after a failure and while disconnected. */
  get frame() {
    return this.current;
  }
  /**
   * Why there are no live values (no subscription support or a failed subscription), else null. A failed position
   * request is not an error here: `setPosition` rejects and the caller shows it.
   */
  get error() {
    return this.failure;
  }
  watch(t, n) {
    if (t === null || n === null) {
      this.stop();
      return;
    }
    const i = JSON.stringify(n);
    if (t === this.planId) {
      if (i === this.json) return;
      this.payload = n, this.json = i, this.cancelDebounce(), this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null, this.restart();
      }, U1);
      return;
    }
    this.stop(), this.planId = t, this.payload = n, this.json = i, this.start();
  }
  /**
   * Ends the subscription (also one still being set up), cancels the timers, stops listening to the connection and
   * forgets the frame and the error; any plan can be watched again.
   */
  stop() {
    this.unlisten(), this.cancelRetry(), this.cancelDebounce(), this.retries = 0, this.drop(!0), this.planId = null, this.payload = null, this.json = "", this.current = null, this.failure = null, this.offline = !1;
  }
  /**
   * Sets a transfer position of the watched plan live on the server; nothing is sent while no plan is watched.
   * A failure rejects and leaves `error` as it is.
   */
  async setPosition(t, n) {
    const i = this.connection();
    !i || this.planId === null || await i.sendMessagePromise({ type: "plan_studio/power/set_position", plan_id: this.planId, block_id: t, position: n });
  }
  start() {
    var n, i;
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(h("output.noLive"));
      return;
    }
    this.conn = t, (n = t.addEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t.addEventListener) == null || i.call(t, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const t = this.conn;
    this.conn = null, (n = t == null ? void 0 : t.removeEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t == null ? void 0 : t.removeEventListener) == null || i.call(t, "ready", this.onReady);
  }
  /** Replaces the subscription with one for the latest payload, with a fresh run of retries; the frame stays. */
  restart() {
    this.cancelRetry(), this.cancelDebounce(), this.retries = 0, this.drop(!0), this.subscribe();
  }
  /** Ends the current subscription: its frames are ignored from now on; `unsubscribe` also tells the server. */
  drop(t) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, t && n.unsub && br(n.unsub));
  }
  subscribe() {
    const { conn: t, planId: n, payload: i } = this;
    if (!(t != null && t.subscribeMessage) || n === null || i === null || this.offline) return;
    const s = { live: !0, unsub: null };
    this.sub = s, t.subscribeMessage(
      (o) => {
        s.live && (this.current = o, this.host.requestUpdate());
      },
      { type: "plan_studio/power/subscribe", plan_id: n, power: i.power, devices: i.devices },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!s.live) {
          br(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure($t(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ll || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Cl));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  cancelDebounce() {
    this.debounceTimer !== null && clearTimeout(this.debounceTimer), this.debounceTimer = null;
  }
  setFailure(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
const q1 = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function Z1(e) {
  const t = Math.max(0, Math.floor(e / 1e3));
  if (t < 60) return String(t);
  const n = (i) => String(i).padStart(2, "0");
  return t < 3600 ? `${Math.floor(t / 60)}:${n(t % 60)}` : `${Math.floor(t / 3600)}:${n(Math.floor(t / 60) % 60)}:${n(t % 60)}`;
}
const Ol = (e, t) => {
  const n = t ? e == null ? void 0 : e[t] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function K1(e, t) {
  var o;
  const n = Ol(e, t);
  if (!n || n.state.trim() === "") return;
  const i = q1[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const G1 = (e) => {
  const t = e.last_changed ? Date.parse(e.last_changed) : NaN;
  return Number.isFinite(t) ? t : void 0;
};
function mn(e, t) {
  const n = e.bindings ?? {}, i = e.props.kind;
  let s = "none", o = !1, r = !1, a;
  const l = (f, m, b) => {
    if (!f) return;
    a = Ol(t, f);
    const w = (a == null ? void 0 : a.state) ?? "";
    s = m.includes(w) ? "on" : b.includes(w) ? "off" : "no-data";
  }, c = ["on"], u = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      o = !0;
    // falls through
    case "socket":
    case "equipment": {
      r = !!n.control, l(n.control, c, u);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      o = !0, l(n[i === "motion_sensor" ? "motion" : "leak"], c, u), s === "on" && (s = "active");
      break;
    }
    case "wall_switch":
      l(n.state, c, u);
      break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      l(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const d = { look: s };
  if (o && a && (s === "on" || s === "active")) {
    const f = G1(a);
    f !== void 0 && (d.timerSince = f);
  }
  const p = wt(e).some((f) => f.role === "power") ? K1(t, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (d.power = p), d;
}
function zl(e, t, n) {
  const i = [];
  if (e.timerSince !== void 0) {
    const s = t.props.kind;
    i.push({ text: Z1(n - e.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return e.power !== void 0 && i.push({ text: te(e.power), tone: "device" }), i;
}
const Ei = 1e4, yr = 400, X1 = 1e3, vr = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), Y1 = ["timer", "power"], Q1 = (e, t) => {
  const n = e == null ? void 0 : e[t];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Nl(e) {
  const t = e.bindings ?? {}, n = e.props.kind, i = [], s = (o, r, a = !1) => {
    o && !i.some((l) => l.entity === o) && i.push({ entity: o, settled: r, valve: a });
  };
  if (n === "smart_button")
    for (const { role: o } of wt(e)) (o === "on" || o === "off" || o === "auto") && s(t[o], !1);
  else n === "wall_switch" ? s(t.state, !0) : n === "valve" && s(t.state, !0, !0);
  return i;
}
function J1(e, t) {
  if (e === "on" || t && e === "open") return t ? "open" : "on";
  if (e === "off" || t && e === "closed") return t ? "closed" : "off";
}
function tg(e, t, n) {
  var i;
  if (e.settled) {
    const s = J1(t.state, e.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (e.entity.startsWith("event.")) {
    if (vr.has(t.state)) return {};
    const s = (i = t.attributes) == null ? void 0 : i.event_type, o = n && n.last !== t.state && typeof s == "string" && s !== "";
    return { value: t.state, text: o ? s : void 0 };
  }
  return { value: t.state, text: n && n.last !== t.state && !vr.has(t.state) ? t.state : void 0 };
}
function $r(e, t, n, i) {
  const s = t === "timer" ? { look: e.look, timerSince: e.timerSince } : { look: e.look, power: e.power };
  return zl(s, n, i)[0];
}
function eg(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.devices) for (const i of Nl(n)) t.add(i.entity);
  return [...t].sort();
}
class ng {
  constructor() {
    this.seen = /* @__PURE__ */ new Map(), this.events = /* @__PURE__ */ new Map(), this.bubbles = /* @__PURE__ */ new Map(), this.leave = /* @__PURE__ */ new Map();
  }
  /** Compare states with the last seen ones for every event source of the level's devices; record new events and bubble exits. */
  update(t, n, i) {
    for (const s of t.devices)
      this.updateEvents(s, n, i), this.updateBubbles(s, n, i);
  }
  /** The device's event bubble text while under EVENT_MS old, else null. */
  event(t, n) {
    const i = this.events.get(t);
    return i && n - i.at < Ei ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(t, n) {
    const i = (this.leave.get(t) ?? []).filter((r) => n - r.at < yr).map((r) => r.bubble), s = this.events.get(t), o = s ? n - s.at : -1;
    return s && o >= Ei && o < Ei + X1 && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(t, n, i) {
    const s = Nl(t), o = `${t.id}|`, r = new Set(s.map((a) => o + a.entity));
    for (const a of [...this.seen.keys()]) a.startsWith(o) && !r.has(a) && this.seen.delete(a);
    for (const a of s) {
      const l = Q1(n, a.entity);
      if (!l) continue;
      const c = o + a.entity, { value: u, text: d } = tg(a, l, this.seen.get(c));
      u !== void 0 && this.seen.set(c, { last: u }), d && this.events.set(t.id, { text: d, at: i });
    }
  }
  updateBubbles(t, n, i) {
    const s = mn(t, n), o = this.bubbles.get(t.id);
    if (o) {
      const r = (this.leave.get(t.id) ?? []).filter((a) => i - a.at < yr);
      for (const a of Y1) {
        const l = $r(o, a, t, i);
        l && !$r(s, a, t, i) && r.push({ bubble: l, at: i });
      }
      r.length ? this.leave.set(t.id, r) : this.leave.delete(t.id);
    }
    this.bubbles.set(t.id, s);
  }
}
const ln = (e) => typeof e == "number" && Number.isFinite(e) ? new Date(e * 1e3).toISOString() : void 0;
function xr(e) {
  e().catch(() => {
  });
}
class ig {
  constructor(t, n) {
    this.connection = t, this.onChange = n, this.key = null, this.ids = [], this.sub = null, this.map = /* @__PURE__ */ new Map(), this.conn = null, this.onDisconnected = () => {
      this.drop(!1), this.map = /* @__PURE__ */ new Map();
    }, this.onReady = () => {
      this.drop(!0), this.map = /* @__PURE__ */ new Map(), this.subscribe();
    };
  }
  /** `states` with the feed's entities replaced by their per-message states; `states` itself when the feed is empty. */
  overlay(t) {
    return this.map.size === 0 ? t : { ...t, ...Object.fromEntries(this.map) };
  }
  watch(t) {
    var o, r;
    const n = t ? [...new Set(t)].sort() : [], i = n.length ? n.join(`
`) : null;
    if (i === this.key || (this.stop(), i === null)) return;
    this.key = i, this.ids = n;
    const s = this.connection();
    s != null && s.subscribeMessage && (this.conn = s, (o = s.addEventListener) == null || o.call(s, "disconnected", this.onDisconnected), (r = s.addEventListener) == null || r.call(s, "ready", this.onReady), this.subscribe());
  }
  /** Ends the subscription, stops listening to the connection and forgets the states. */
  stop() {
    var n, i;
    const t = this.conn;
    this.conn = null, (n = t == null ? void 0 : t.removeEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t == null ? void 0 : t.removeEventListener) == null || i.call(t, "ready", this.onReady), this.drop(!0), this.key = null, this.ids = [], this.map = /* @__PURE__ */ new Map();
  }
  drop(t) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, t && n.unsub && xr(n.unsub));
  }
  subscribe() {
    const t = this.conn;
    if (!(t != null && t.subscribeMessage) || this.ids.length === 0) return;
    const n = { live: !0, unsub: null };
    this.sub = n, t.subscribeMessage(
      (i) => {
        n.live && this.apply(i);
      },
      { type: "subscribe_entities", entity_ids: this.ids },
      { resubscribe: !1 }
    ).then(
      (i) => {
        n.live ? n.unsub = i : xr(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(t) {
    var n;
    for (const [i, s] of Object.entries(t.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: ln(s.lc) ?? ln(s.lu) });
    for (const [i, s] of Object.entries(t.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, a = s["+"];
      if (a) {
        const l = typeof a.s == "string" && a.s !== o.state;
        typeof a.s == "string" && (r.state = a.s), a.a && typeof a.a == "object" && Object.assign(r.attributes, a.a);
        const c = ln(a.lc) ?? (l ? ln(a.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const l of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[l];
      this.map.set(i, r);
    }
    for (const i of t.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var sg = Object.defineProperty, B = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && sg(t, n, s), s;
};
const Bs = class Bs extends ee {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = mc.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = em(), this.nextObj = jh(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Ta(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new R1(), this.resizeObs = null, this.session = new Yh(this), this.haMeta = new Qh(this), this.feed = new B1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new W1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new ng(), this.entityFeed = new ig(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => cc(i, (s) => {
      var o;
      return Da(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
    }), this.onBeforeUnload = (i) => {
      this.drafts.flush(), this.save.dirty && (i.preventDefault(), i.returnValue = "");
    }, this.onPageHide = () => {
      this.drafts.flush();
    }, this.refocus = (i) => {
      const s = i.composedPath()[0];
      s instanceof Element && s.closest("button") && this.focus();
    }, this.refocusAfterChange = (i) => {
      const s = i.composedPath()[0];
      (s instanceof HTMLInputElement || s instanceof HTMLSelectElement) && (s.blur(), this.focus());
    };
    const t = this, n = {
      get connection() {
        return t.hass.connection;
      }
    };
    this.save = new Uu(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Jh(this), this.activeTool = ji("select", this.ctx), this.input = new N1(this);
  }
  /** True while the 1 s ticker runs (Binding step with a timer, event or fading bubble). */
  get tickerOn() {
    return this.ticker !== null;
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((t = this.plan) == null ? void 0 : t.id) ?? null), this.watchPower(), this.watchEntities();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null, this.feed.stop(), this.powerFeed.stop(), this.entityFeed.stop(), this.stopTicker();
  }
  willUpdate(t) {
    var s, o;
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = ((s = this.history) == null ? void 0 : s.current.level) ?? null;
    this.watchEntities(), n && this.hass && (t.has("hass") || n !== this.trackedLevel) && this.events.update(n, this.entityFeed.overlay(this.hass.states), Date.now()), this.trackedLevel = n;
    const i = this.size.w > 0 && this.size.h > 0;
    this.needFit && i && (this.needFit = !1, this.fit()), this.needPowerFit && i && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((o = this.plan) == null ? void 0 : o.id) ?? null : null), this.watchPower();
  }
  /** The entity feed watches the open level's event sources in the Binding step of an attached panel. */
  watchEntities() {
    var n;
    const t = this.isConnected && this.mode === "binding" ? (n = this.history) == null ? void 0 : n.current.level : void 0;
    this.entityFeed.watch(t ? eg(t) : null);
  }
  /** Every entity feed message: the tracker sees each value, even one the next message replaces at once. */
  onEntities() {
    var n;
    const t = (n = this.history) == null ? void 0 : n.current.level;
    t && this.hass && this.events.update(t, this.entityFeed.overlay(this.hass.states), Date.now()), this.requestUpdate();
  }
  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  watchPower() {
    const t = this.isConnected && this.mode === "power" ? this.level : null;
    this.powerFeed.watch(t && this.plan ? this.plan.id : null, t ? j1(this.power, t) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var s;
    const t = (s = this.history) == null ? void 0 : s.current.level, n = Date.now(), i = this.isConnected && this.mode === "binding" && !!t && !!this.hass && t.devices.some((o) => mn(o, this.hass.states).timerSince !== void 0 || this.events.event(o.id, n) !== null || this.events.leaving(o.id, n).length > 0);
    i && !this.ticker ? this.ticker = setInterval(() => this.requestUpdate(), 1e3) : i || this.stopTicker();
  }
  stopTicker() {
    this.ticker !== null && clearInterval(this.ticker), this.ticker = null;
  }
  updated() {
    this.syncTicker();
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((n) => {
      const i = n[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  // ---- editing ----
  get level() {
    var t;
    return ((t = this.history) == null ? void 0 : t.current.level) ?? null;
  }
  get power() {
    var t;
    return ((t = this.history) == null ? void 0 : t.current.power) ?? this.lazyPower;
  }
  /**
   * Pushes a level edit; `power` joins the same undo step when the edit changed the schematic too. Without `power`, a
   * stored schematic loses the wires on ports its device blocks no longer have (a wall delete took an inverter); the
   * lazy default is never written.
   */
  commit(t, n) {
    if (!this.history) return;
    const i = this.history.current.power, s = n ?? (i && fu(i, t));
    this.history.push({ ...this.history.current, level: t, ...s && s !== this.power ? { power: s } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
  }
  commitPower(t) {
    this.history && (this.history.push({ ...this.history.current, power: t }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  dropStaleSelection() {
    this.history && this.selection && !ki(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const t = this.selection, n = this.level;
    if (this.mode === "binding" || !t || !n || t.kind === "node" || !ki(n, t, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(t);
    if (t.kind === "powerBlock" || t.kind === "powerWire") return !1;
    if (t.kind === "device") {
      const i = Fa(n, this.power, t.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(t.kind === "wall" ? xs(n, t.id) : t.kind === "opening" ? ta(n, t.id) : Ea(n, t.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(t) {
    const n = this.power;
    if (t.kind === "powerWire")
      return this.commitPower(ja(n, t.id)), !0;
    if (t.kind !== "powerBlock") return !1;
    const i = Ra(n, t.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(t, n) {
    this.powerFeed.setPosition(t, n).catch((i) => {
      this.notice = $t(i);
    });
  }
  undo() {
    this.step(() => {
      var t;
      return ((t = this.history) == null ? void 0 : t.undo()) ?? null;
    });
  }
  redo() {
    this.step(() => {
      var t;
      return ((t = this.history) == null ? void 0 : t.redo()) ?? null;
    });
  }
  /**
   * Undo / redo drop the selection, except in the Binding step, which keeps the selected device while it exists;
   * the field notice goes with a dropped selection.
   */
  step(t) {
    this.activeTool.cancel(), t() && this.save.markDirty();
    const n = this.selection, i = this.level;
    this.selection = this.mode === "binding" && n && i && ki(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = ji(t, this.ctx);
  }
  /**
   * Power step device list: arms a device for the Device tool (activated when another tool is on), so the
   * next canvas click places it; the "pick a device first" notice goes. The arm stays across tool switches; a
   * placement, leaving the step or opening another plan clears it.
   */
  armDevice(t) {
    this.toolId !== "power-device" && this.pickTool("power-device"), this.placeDeviceId = t, this.notice = null;
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode === "power" && (this.placeDeviceId = null), this.mode = t, this.pickTool(Os(t)[0]), (t === "binding" || t === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = Q(n, i);
    s && (this.view = mr(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(t) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: t });
    const s = xa(n).get(t);
    s && (this.view = mr(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const t = this.level, n = t ? Rh(t, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  /** The canvas view of the active step: the Power step has its own, so the plan view is kept meanwhile. */
  get view() {
    return this.mode === "power" ? this.powerView : this.planView;
  }
  set view(t) {
    this.mode === "power" ? this.powerView = t : this.planView = t;
  }
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return S1(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.planView = A1(((t = this.level) == null ? void 0 : t.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const t = Tu(this.power, this.ctx.geo());
    t && (this.powerView = E1(t, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var t;
    return D1({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((t = this.plan) == null ? void 0 : t.name) ?? "",
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (n) => this.session.restoreDraft(n),
      discard: (n) => this.session.discardDraft(n),
      startNew: () => this.session.startNewPlan(),
      confirmDelete: () => {
        this.session.confirmDelete();
      },
      confirmSwitch: () => this.session.confirmSwitch(),
      overwrite: () => this.session.doOverwrite(),
      saveAsNew: () => this.session.doSaveAsNew(),
      close: () => {
        this.dialog = null;
      }
    });
  }
  render() {
    var f, m, b, w;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const t = qf(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power", d = Date.now(), p = (b = this.hass) == null ? void 0 : b.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : ""}"
        style=${x1(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Ph({
      steps: Nh({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        planName: this.plan.name,
        onRename: (g) => {
          this.plan = { ...this.plan, name: g }, c.markDirty();
        },
        onMode: (g) => this.setMode(g)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : y,
      onPickPlan: (g) => this.session.pickPlan(g),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${h1(this, n)}
        ${g1(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? C1(this.view, a, l, t, u ? 0.1 : 1) : y}
            ${this.mode === "power" ? Uf(this.power, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : gf(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => mn(g, p),
      bubbles: (g) => {
        const $ = mn(g, p), x = this.events.event(g.id, d);
        return {
          shown: [...zl($, g, d), ...x ? [{ text: x.text, tone: "event", key: x.at }] : []],
          leaving: this.events.leaving(g.id, d)
        };
      }
    })}
            ${i.tracker ? v1(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: $1(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : y}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? V1({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : y}
        </div>
        ${y1({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? h(`snap.${i.snap.kind}`) : null,
      onGrid: (g) => {
        this.grid = g;
      },
      cones: this.cones,
      onCones: (g) => {
        this.cones = g;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: u
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
Bs.styles = k1;
let T = Bs;
B([
  Mt({ attribute: !1 })
], T.prototype, "hass");
B([
  Mt({ type: Boolean })
], T.prototype, "narrow");
B([
  Mt({ attribute: !1 })
], T.prototype, "panel");
B([
  R()
], T.prototype, "plan");
B([
  R()
], T.prototype, "loadError");
B([
  R()
], T.prototype, "selection");
B([
  R()
], T.prototype, "toolId");
B([
  R()
], T.prototype, "wallType");
B([
  R()
], T.prototype, "thickness");
B([
  R()
], T.prototype, "boxMeasure");
B([
  R()
], T.prototype, "grid");
B([
  R()
], T.prototype, "mode");
B([
  R()
], T.prototype, "bindFilter");
B([
  R()
], T.prototype, "bindQuery");
B([
  R()
], T.prototype, "railCollapsed");
B([
  R()
], T.prototype, "showAll");
B([
  R()
], T.prototype, "zoneQuery");
B([
  R()
], T.prototype, "cones");
B([
  R()
], T.prototype, "nextProps");
B([
  R()
], T.prototype, "nextObj");
B([
  R()
], T.prototype, "planView");
B([
  R()
], T.prototype, "powerView");
B([
  R()
], T.prototype, "placeDeviceId");
B([
  R()
], T.prototype, "size");
B([
  R()
], T.prototype, "dialog");
B([
  R()
], T.prototype, "notice");
B([
  R()
], T.prototype, "fieldNotice");
B([
  R()
], T.prototype, "pendingDraft");
B([
  R()
], T.prototype, "plans");
B([
  R()
], T.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", T);
export {
  T as PlanStudioPanel
};
