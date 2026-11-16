/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ln = globalThis, Xi = ln.ShadowRoot && (ln.ShadyCSS === void 0 || ln.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Yi = Symbol(), Fs = /* @__PURE__ */ new WeakMap();
let kr = class {
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
const Vl = (e) => new kr(typeof e == "string" ? e : e + "", void 0, Yi), Mr = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new kr(n, e, Yi);
}, Dl = (e, t) => {
  if (Xi) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = ln.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, Us = Xi ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return Vl(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tl, defineProperty: Hl, getOwnPropertyDescriptor: Rl, getOwnPropertyNames: Bl, getOwnPropertySymbols: Fl, getPrototypeOf: Ul } = Object, Lt = globalThis, js = Lt.trustedTypes, jl = js ? js.emptyScript : "", oi = Lt.reactiveElementPolyfillSupport, xe = (e, t) => e, mn = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? jl : null;
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
} }, Qi = (e, t) => !Tl(e, t), Ws = { attribute: !0, type: String, converter: mn, reflect: !1, useDefault: !1, hasChanged: Qi };
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
      s !== void 0 && Hl(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Rl(this.prototype, t) ?? { get() {
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
    if (this.hasOwnProperty(xe("elementProperties"))) return;
    const t = Ul(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(xe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(xe("properties"))) {
      const n = this.properties, i = [...Bl(n), ...Fl(n)];
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
    return Dl(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : mn).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : mn;
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
Yt.elementStyles = [], Yt.shadowRootOptions = { mode: "open" }, Yt[xe("elementProperties")] = /* @__PURE__ */ new Map(), Yt[xe("finalized")] = /* @__PURE__ */ new Map(), oi == null || oi({ ReactiveElement: Yt }), (Lt.reactiveElementVersions ?? (Lt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ke = globalThis, qs = (e) => e, gn = ke.trustedTypes, Zs = gn ? gn.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, _r = "$lit$", It = `lit$${Math.random().toFixed(9).slice(2)}$`, Sr = "?" + It, Wl = `<${Sr}>`, Wt = document, Ie = () => Wt.createComment(""), Pe = (e) => e === null || typeof e != "object" && typeof e != "function", Ji = Array.isArray, ql = (e) => Ji(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ri = `[ 	
\f\r]`, fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ks = /-->/g, Gs = />/g, Ht = RegExp(`>|${ri}(?:([^\\s"'>=/]+)(${ri}*=${ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xs = /'/g, Ys = /"/g, Ar = /^(?:script|style|textarea|title)$/i, Er = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), v = Er(1), M = Er(2), lt = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), Qs = /* @__PURE__ */ new WeakMap(), Rt = Wt.createTreeWalker(Wt, 129);
function Ir(e, t) {
  if (!Ji(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Zs !== void 0 ? Zs.createHTML(t) : t;
}
const Zl = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = fe;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, u = r.exec(l), u !== null); ) p = r.lastIndex, r === fe ? u[1] === "!--" ? r = Ks : u[1] !== void 0 ? r = Gs : u[2] !== void 0 ? (Ar.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Ht) : u[3] !== void 0 && (r = Ht) : r === Ht ? u[0] === ">" ? (r = s ?? fe, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? Ht : u[3] === '"' ? Ys : Xs) : r === Ys || r === Xs ? r = Ht : r === Ks || r === Gs ? r = fe : (r = Ht, s = void 0);
    const f = r === Ht && e[a + 1].startsWith("/>") ? " " : "";
    o += r === fe ? l + Wl : d >= 0 ? (i.push(c), l.slice(0, d) + _r + l.slice(d) + It + f) : l + It + (d === -2 ? a : f);
  }
  return [Ir(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ce {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, u] = Zl(t, n);
    if (this.el = Ce.createElement(c, i), Rt.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Rt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(_r)) {
          const p = u[r++], f = s.getAttribute(d).split(It), g = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: g[2], strings: f, ctor: g[1] === "." ? Gl : g[1] === "?" ? Xl : g[1] === "@" ? Yl : On }), s.removeAttribute(d);
        } else d.startsWith(It) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (Ar.test(s.tagName)) {
          const d = s.textContent.split(It), p = d.length - 1;
          if (p > 0) {
            s.textContent = gn ? gn.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(d[f], Ie()), Rt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[p], Ie());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Sr) l.push({ type: 2, index: o });
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
  const o = Pe(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = ie(e, s._$AS(e, t.values), s, i)), t;
}
class Kl {
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
        l.type === 2 ? c = new ts(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new Ql(o, this, t)), this._$AV.push(c), l = i[++a];
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
let ts = class Pr {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, s) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = ie(this, t, n), Pe(t) ? t === b || t == null || t === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : t !== this._$AH && t !== lt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ql(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== b && Pe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Wt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ce.createElement(Ir(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Kl(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = Qs.get(t.strings);
    return n === void 0 && Qs.set(t.strings, n = new Ce(t)), n;
  }
  k(t) {
    Ji(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Pr(this.O(Ie()), this.O(Ie()), this, this.options)) : i = n[s], i._$AI(o), s++;
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
class On {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, s, o) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = b;
  }
  _$AI(t, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = ie(this, t, n, 0), r = !Pe(t) || t !== this._$AH && t !== lt, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = ie(this, a[i + l], n, l), c === lt && (c = this._$AH[l]), r || (r = !Pe(c) || c !== this._$AH[l]), c === b ? t = b : t !== b && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Gl extends On {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
}
class Xl extends On {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== b);
  }
}
let Yl = class extends On {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = ie(this, t, n, 0) ?? b) === lt) return;
    const i = this._$AH, s = t === b && i !== b || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== b && (i === b || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class Ql {
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
const ai = ke.litHtmlPolyfillSupport;
ai == null || ai(Ce, ts), (ke.litHtmlVersions ?? (ke.litHtmlVersions = [])).push("3.3.3");
const Jl = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new ts(t.insertBefore(Ie(), o), o, void 0, n ?? {});
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jl(n, this.renderRoot, this.renderOptions);
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
var xr;
ee._$litElement$ = !0, ee.finalized = !0, (xr = Ft.litElementHydrateSupport) == null || xr.call(Ft, { LitElement: ee });
const li = Ft.litElementPolyfillSupport;
li == null || li({ LitElement: ee });
(Ft.litElementVersions ?? (Ft.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tc = { attribute: !0, type: String, converter: mn, reflect: !1, hasChanged: Qi }, ec = (e = tc, t, n) => {
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
  return (t, n) => typeof n == "object" ? ec(e, t, n) : ((i, s, o) => {
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
const Ut = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, nc = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, ic = { ...Ut, role: "power_in" }, sc = { ...Ut, role: "power_out" }, oc = ["on", "off", "auto"], ns = (e) => oc.includes(e), ci = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), rc = {
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
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Ut, nc, ic, sc]
}, is = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, ac = { climate_sensor: "any" };
function mt(e) {
  const t = e.props, n = rc[t.kind];
  if (t.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
  if (t.kind === "equipment") {
    const i = !!t.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Cr(e) {
  return new Set(mt(e).map((t) => t.role));
}
function zn(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !Cr(s).has(n)) return e;
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
function lc(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a), s = mt(e).filter((a) => a.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const o = s.filter((a) => !!n[a.role]);
  return (ac[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function cc(e) {
  const t = mt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const dc = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function Ii(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !ns(t) ? n : `${n}|${dc(i[t])}`;
}
function uc(e, t, n) {
  const i = Ii(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && mt(s).some((o) => Ii(s, o.role) === i));
}
function pc(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of mt(e)) {
    const s = ns(i) ? Ii(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function Nn(e) {
  if (!e.bindings) return e;
  const t = Cr(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Lr = (e) => e === "wall_switch" || e === "smart_button", Vn = (e) => e === "wall_switch" || e === "smart_button" || e === "valve", Le = (e) => e === "wall" ? "wall" : "free", fc = [100, 125, 150], ss = "mdi:cube-outline", Js = ["single", "double", "hold"], hc = {
  bearing: 400
}, cn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Or(e = K(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function to(e) {
  return {
    id: K(),
    name: e,
    schemaVersion: 2,
    revision: 0,
    levels: [Or()]
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
}, se = 90, zr = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
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
const mc = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: ss
};
function gc(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : mc[String(n)] ?? ss;
  return { ...e, props: { ...i, icon: s } };
}
function wc(e) {
  var i;
  if (e.props.kind !== "switch") return e;
  const t = (i = e.bindings) == null ? void 0 : i.action, n = Le(e.placement.mode);
  return t ? { ...e, props: zt("smart_button", n), bindings: { on: t } } : { ...e, props: zt("wall_switch", n) };
}
const Nr = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function bc(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = Nr(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function yc(e) {
  const t = e.props.kind;
  if (!Vn(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(zt(t, Le(e.placement.mode)))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? bc(r, o) : s === "windowSec" ? Nr(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function vc(e) {
  if (e.props.kind !== "climate_sensor" || !("zoneIds" in e.props)) return e;
  const { zoneIds: t, ...n } = e.props;
  return { ...e, props: n };
}
function $c(e) {
  if (!Vn(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function xc(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => Nn(vc($c(yc(wc(gc(n)))))));
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
function Vr(e) {
  return Math.hypot(e.x, e.y);
}
function L(e, t) {
  return Vr(I(t, e));
}
function Dn(e) {
  const t = Vr(e);
  return t === 0 ? { x: 0, y: 0 } : E(e, 1 / t);
}
function X(e) {
  return { x: e.y, y: -e.x };
}
function Dr(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function pt(e, t, n, i) {
  const s = et(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = et(I(n, e), i) / s;
  return z(e, E(t, o));
}
function Tn(e, t, n) {
  const i = I(n, t), s = H(i, i);
  return s === 0 ? 0 : H(I(e, t), i) / s;
}
function xt(e, t, n) {
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
function kt(e) {
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
function kc(e, t) {
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
function Mc(e, t, n) {
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
  constructor(t = kc) {
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
    return Sc(this._root);
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
      const r = Ac(
        this.toList(),
        _c(t, n),
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
    s(t, n) < 0 ? r = di(n, i, r, s) : o = di(n, i, o, s), this._root = Mc(o, r, s);
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
function _c(e, t) {
  const n = new Nt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new Nt(e[s], t[s]);
  return i.next = null, n.next;
}
function Sc(e) {
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
function Ac(e, t, n) {
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
const vt = 11102230246251565e-32, Y = 134217729, Ec = (3 + 8 * vt) * vt;
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
function Ic(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function S(e) {
  return new Float64Array(e);
}
const Pc = (3 + 16 * vt) * vt, Cc = (2 + 12 * vt) * vt, Lc = (9 + 64 * vt) * vt * vt, Xt = S(4), no = S(8), io = S(12), so = S(16), tt = S(4);
function Oc(e, t, n, i, s, o, r) {
  let a, l, c, u, d, p, f, g, y, w, m, $, k, _, x, A, P, O;
  const V = e - s, U = n - s, N = t - o, D = i - o;
  _ = V * D, p = Y * V, f = p - (p - V), g = V - f, p = Y * D, y = p - (p - D), w = D - y, x = g * w - (_ - f * y - g * y - f * w), A = N * U, p = Y * N, f = p - (p - N), g = N - f, p = Y * U, y = p - (p - U), w = U - y, P = g * w - (A - f * y - g * y - f * w), m = x - P, d = x - m, Xt[0] = x - (m + d) + (d - P), $ = _ + m, d = $ - _, k = _ - ($ - d) + (m - d), m = k - A, d = k - m, Xt[1] = k - (m + d) + (d - A), O = $ + m, d = O - $, Xt[2] = $ - (O - d) + (m - d), Xt[3] = O;
  let j = Ic(4, Xt), ot = Cc * r;
  if (j >= ot || -j >= ot || (d = e - V, a = e - (V + d) + (d - s), d = n - U, c = n - (U + d) + (d - s), d = t - N, l = t - (N + d) + (d - o), d = i - D, u = i - (D + d) + (d - o), a === 0 && l === 0 && c === 0 && u === 0) || (ot = Lc * r + Ec * Math.abs(j), j += V * u + D * a - (N * c + U * l), j >= ot || -j >= ot)) return j;
  _ = a * D, p = Y * a, f = p - (p - a), g = a - f, p = Y * D, y = p - (p - D), w = D - y, x = g * w - (_ - f * y - g * y - f * w), A = l * U, p = Y * l, f = p - (p - l), g = l - f, p = Y * U, y = p - (p - U), w = U - y, P = g * w - (A - f * y - g * y - f * w), m = x - P, d = x - m, tt[0] = x - (m + d) + (d - P), $ = _ + m, d = $ - _, k = _ - ($ - d) + (m - d), m = k - A, d = k - m, tt[1] = k - (m + d) + (d - A), O = $ + m, d = O - $, tt[2] = $ - (O - d) + (m - d), tt[3] = O;
  const wt = ui(4, Xt, 4, tt, no);
  _ = V * u, p = Y * V, f = p - (p - V), g = V - f, p = Y * u, y = p - (p - u), w = u - y, x = g * w - (_ - f * y - g * y - f * w), A = N * c, p = Y * N, f = p - (p - N), g = N - f, p = Y * c, y = p - (p - c), w = c - y, P = g * w - (A - f * y - g * y - f * w), m = x - P, d = x - m, tt[0] = x - (m + d) + (d - P), $ = _ + m, d = $ - _, k = _ - ($ - d) + (m - d), m = k - A, d = k - m, tt[1] = k - (m + d) + (d - A), O = $ + m, d = O - $, tt[2] = $ - (O - d) + (m - d), tt[3] = O;
  const At = ui(wt, no, 4, tt, io);
  _ = a * u, p = Y * a, f = p - (p - a), g = a - f, p = Y * u, y = p - (p - u), w = u - y, x = g * w - (_ - f * y - g * y - f * w), A = l * c, p = Y * l, f = p - (p - l), g = l - f, p = Y * c, y = p - (p - c), w = c - y, P = g * w - (A - f * y - g * y - f * w), m = x - P, d = x - m, tt[0] = x - (m + d) + (d - P), $ = _ + m, d = $ - _, k = _ - ($ - d) + (m - d), m = k - A, d = k - m, tt[1] = k - (m + d) + (d - A), O = $ + m, d = O - $, tt[2] = $ - (O - d) + (m - d), tt[3] = O;
  const Nl = ui(At, io, 4, tt, so);
  return so[Nl - 1];
}
function zc(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= Pc * c ? l : -Oc(e, t, n, i, s, o, c);
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
const he = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, zi = (e, t) => {
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
const Nc = Ct * Ct, oo = (e, t) => {
  if (-Ct < e && e < Ct && -Ct < t && t < Ct)
    return 0;
  const n = e - t;
  return n * n < Nc * e * t ? 0 : e < t ? -1 : 1;
};
class Vc {
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
const Oe = new Vc(), dn = (e, t) => e.x * t.y - e.y * t.x, Tr = (e, t) => e.x * t.x + e.y * t.y, ao = (e, t, n) => {
  const i = zc(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, wn = (e) => Math.sqrt(Tr(e, e)), Dc = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return dn(s, i) / wn(s) / wn(i);
}, Tc = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return Tr(s, i) / wn(s) / wn(i);
}, lo = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, co = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, Hc = (e, t, n, i) => {
  if (t.x === 0) return co(n, i, e.x);
  if (i.x === 0) return co(e, t, n.x);
  if (t.y === 0) return lo(n, i, e.y);
  if (i.y === 0) return lo(e, t, n.y);
  const s = dn(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = dn(o, t) / s, a = dn(o, i) / s, l = e.x + a * t.x, c = n.x + r * i.x, u = e.y + a * t.y, d = n.y + r * i.y, p = (l + c) / 2, f = (u + d) / 2;
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
        sine: Dc(this.point, t.point, o.point),
        cosine: Tc(this.point, t.point, o.point)
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
let Rc = 0;
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
      const d = c - a, p = o - i, f = u - l, g = r - s;
      if (d > p && f < g) return 1;
      if (d < p && f > g) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++Rc, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
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
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, c = he(n, a) && this.comparePoint(a) === 0, u = he(i, o) && t.comparePoint(o) === 0, d = he(n, l) && this.comparePoint(l) === 0, p = he(i, r) && t.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? l : null;
    if (u)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return p && r.x === a.x && r.y === a.y ? null : a;
    if (p && d) return null;
    if (p) return r;
    if (d) return l;
    const f = Hc(o, this.vector(), a, t.vector());
    return f === null || !he(s, f) ? null : Oe.round(f.x, f.y);
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
    const s = Oe.round(t[0][0], t[0][1]);
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
      let l = Oe.round(t[r][0], t[r][1]);
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
class Bc {
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
      const o = new Bc(t[i], this);
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
class bn {
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
            const y = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (p.length === 1) {
            l = p[0].otherSE;
            break;
          }
          let f = null;
          for (let y = 0, w = d.length; y < w; y++)
            if (d[y].point === a.point) {
              f = y;
              break;
            }
          if (f !== null) {
            const y = d.splice(f)[0], w = c.splice(y.index);
            w.unshift(w[0].otherSE), n.push(new bn(w.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: a.point
          });
          const g = a.getLeftmostComparator(r);
          l = p.sort(g)[0].otherSE;
          break;
        }
      n.push(new bn(c));
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
class Fc {
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
class Uc {
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
          for (let f = 0, g = p.length; f < g; f++)
            i.push(p[f]);
        }
      }
      let u = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (u = d), !l.isAnEndpoint(d))) {
          const p = this._splitSafely(l, d);
          for (let f = 0, g = p.length; f < g; f++)
            i.push(p[f]);
        }
      }
      if (c !== null || u !== null) {
        let d = null;
        c === null ? d = u : u === null ? d = c : d = at.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(d);
        for (let f = 0, g = p.length; f < g; f++)
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
const ho = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, jc = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Wc {
  run(t, n, i) {
    ct.type = t, Oe.reset();
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
        for (let g = d + 1, y = s.length; g < y; g++)
          if (zi(f.bbox, s[g].bbox) === null) return [];
      }
    const o = new rs(at.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const f = s[d].getSweepEvents();
      for (let g = 0, y = f.length; g < y; g++)
        if (o.insert(f[g]), o.size > ho)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Uc(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const f = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > ho)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > jc)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let f = 0, g = p.length; f < g; f++) {
        const y = p[f];
        y.consumedBy === void 0 && o.insert(y);
      }
      a = o.size, l = o.pop();
    }
    Oe.reset();
    const c = bn.factory(r.segments);
    return new Fc(c).getGeom();
  }
}
const ct = new Wc(), qc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("union", e, n);
}, Zc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("intersection", e, n);
}, Kc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("xor", e, n);
}, Gc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ct.run("difference", e, n);
};
var Hr = {
  union: qc,
  intersection: Zc,
  xor: Kc,
  difference: Gc
};
const Rr = 3, Xc = 1e-6;
function Hn(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function q(e, t) {
  const n = Hn(e, t);
  return { x: n.x, y: n.y };
}
function Gt(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function Br(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Dn(I(t, e)), len: L(e, t), leftOff: o, rightOff: r };
}
function J(e, t) {
  return Br(q(e, t.a), q(e, t.b), t.thickness, t.baseline);
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
function Yc(e) {
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
function Qc(e, t) {
  const n = t.f, i = X(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = H(I(s.far, n.a), i) >= 0 ? z(n.a, E(i, n.leftOff)) : I(n.a, E(i, n.rightOff)), a = Rr * Math.max(s.body.wall.thickness, t.wall.thickness), l = pt(Qt(s), s.u, r, n.dir), c = pt(Jt(s), s.u, r, n.dir);
    Bt(l, s.p, a) && (s.body.c[s.leftKey] = l), Bt(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function Jc(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Rr * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = pt(Jt(o), o.u, Qt(r), r.u);
    Bt(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = td(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = I(r, o), l = et(a, I(t, o)), c = et(a, I(s.far, o));
    l * c < 0 && Ni(s, [t]);
  }
}
function Ni(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function td(e, t, n) {
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
  const t = Yc(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(mo(r, "a")), r.wall.b === i.id && s.push(mo(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Qc(s, o) : s.length >= 2 && Jc(s, { x: i.x, y: i.y });
  }
  return t;
}
function Fr(e) {
  const t = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of as(e))
    for (const [s, o, r] of n) {
      const a = i.c[s];
      t.push({ pt: a, wallId: i.wall.id, side: o, end: r, offset: H(I(a, i.f.a), i.f.dir) });
    }
  return t;
}
function Ur(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function Rn(e) {
  return new Map(as(e).map((t) => [t.wall.id, Ur(t)]));
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
    const s = Ur(i), o = e.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && t(u)).sort((u, d) => u.offset - d.offset), r = (u) => H(I(u, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const u of o)
      a.push([l, u.offset]), l = Math.max(l, u.offset + u.width);
    a.push([l, 1 / 0]);
    const c = [];
    for (const [u, d] of a) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = go(p, (f) => r(f) - u)), d < 1 / 0 && (p = go(p, (f) => d - r(f))), p.length >= 3 && Math.abs(kt(p)) > Xc && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const Vi = (e) => [e.map((t) => [t.x, t.y])];
function jr(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function Wr(e, t) {
  return qr(t ? [...ls(e).values()].flat() : [...Rn(e).values()]);
}
function qr(e) {
  const t = e.map(Vi);
  if (t.length === 0) return [];
  let n;
  try {
    n = Hr.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(jr));
}
const re = 1e-6, yn = ["door", "gate", "wicket"], Zr = (e) => e === "opening", Kr = (e) => e.passesLight ?? Zr(e.kind), Gr = (e) => e === "opening", Xr = (e) => e.passesPir ?? Gr(e.kind);
function Yr(e, t) {
  return e.offset < t.offset + t.width - re && t.offset < e.offset + e.width - re;
}
function Bn(e, t, n, i, s) {
  const o = Gt(e, t);
  return o === null || i <= 0 || n < -re || n + i > o + re ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Yr(r, { offset: n, width: i }));
}
function de(e, t) {
  return { ...e, openings: t };
}
function ed(e, t, n, i, s, o = {}) {
  const r = s ?? cn[n], a = i - r / 2;
  if (!Bn(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: K(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return yn.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: de(e, [...e.openings, l]), openingId: l.id };
}
function Qr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Bn(e, i.wallId, n, i.width, t) ? e : Ue(de(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s)));
}
function nd(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Bn(e, i.wallId, i.offset, n, t) ? e : Ue(de(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s)));
}
function id(e, t) {
  return yn.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function sd(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Ue(de(e, e.openings.map((s) => s.id === t ? i(s) : s)));
}
function Jr(e, t) {
  return Ue(de(e, e.openings.filter((n) => n.id !== t)));
}
function Ue(e) {
  return de(e, e.openings.map((t) => {
    const n = Gt(e, t.wallId), i = n === null || t.offset < -re || t.offset + t.width > n + re || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Yr(t, s));
    return { ...t, invalid: i };
  }));
}
const vn = 1e-6;
function ta(e, t) {
  return t.mode !== "none" && os[e.kind].includes(t.mode);
}
function ea(e, t, n) {
  if (n.mode === "none" || !ta(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -se || i > se)) return !1;
  const s = Gt(e, n.wallId);
  return s !== null && n.offset >= -vn && n.offset <= s + vn;
}
function _t(e, t) {
  return { ...e, devices: t };
}
function wo(e, t, n, i) {
  if (!ea(e, t, n)) return { level: e, deviceId: null };
  const s = { id: K(), name: i, placement: n, props: t, invalid: !1 };
  return { level: _t(e, [...e.devices, s]), deviceId: s.id };
}
function na(e, t) {
  const n = { id: K(), name: t, placement: { mode: "none" }, props: zt("equipment", "free"), invalid: !1 };
  return { level: _t(e, [...e.devices, n]), id: n.id };
}
const od = ["power", "power_in", "power_out", "voltage"];
function rd(e) {
  if (e.props.kind !== "equipment") return null;
  const t = e.bindings ?? {}, n = od.some((i) => !!t[i]);
  return t.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const ue = (e) => (e == null ? void 0 : e.props.kind) === "equipment" && !!e.props.inverter, ia = (e) => e.props.kind !== "equipment" || !!e.props.controllable;
function sa(e, t, n) {
  const i = { ...e };
  return n ? i[t] = !0 : delete i[t], i;
}
function oa(e, t, n) {
  const i = e.devices.find((l) => l.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return e;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const a = Nn({ ...i, props: sa(i.props, "inverter", n), bindings: r });
  return _t(e, e.devices.map((l) => l === i ? a : l));
}
function Fn(e, t, n) {
  const i = e.devices.find((o) => o.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return e;
  const s = { ...i, props: sa(i.props, "controllable", n) };
  return _t(e, e.devices.map((o) => o === i ? s : o));
}
function ra(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = zt("motion_sensor", Le(t)), s = zt("motion_sensor", Le(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function $n(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !ea(e, s.props, n)) return e;
  const o = ra(s.props, s.placement.mode, n.mode);
  return aa(_t(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function je(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? _t(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Nn({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function ad(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !Lr(i.props.kind) || i.props.kind === n) return e;
  const s = zt(n, Le(i.placement.mode));
  if (!ta(s, i.placement)) return e;
  const o = Nn({ ...i, props: s });
  return _t(e, e.devices.map((r) => r === i ? o : r));
}
function ld(e, t) {
  return _t(e, e.devices.filter((n) => n.id !== t));
}
function aa(e) {
  return _t(e, e.devices.map((t) => {
    if (t.placement.mode !== "wall") return t.invalid ? { ...t, invalid: !1 } : t;
    const n = Gt(e, t.placement.wallId), i = n === null || t.placement.offset < -vn || t.placement.offset > n + vn;
    return t.invalid === i ? t : { ...t, invalid: i };
  }));
}
function la(e) {
  const t = [];
  for (const n of Wr(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function Di(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!oe(t, s)) continue;
    const o = Math.abs(kt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const pi = 1e-3;
function ca(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(kt(e)) - Math.abs(kt(t))) > pi ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= pi && Math.abs(n.y - i.y) <= pi));
}
const da = 2, bo = Math.ceil(360 / da), yo = 1e-4, cd = 1e-9, vo = 1e-9, dd = {
  light: Kr,
  motion: Xr
};
function ua(e, t) {
  const n = [];
  for (const i of qr([...ls(e, dd[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function cs(e, t, n) {
  return t.filter(([i, s]) => xt(e, i, s) <= n);
}
function fi(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function ud(e, t, n) {
  const i = cs(e, t, n), s = [];
  for (let w = 0; w < bo; w++) s.push(-Math.PI + 2 * Math.PI * w / bo);
  const o = n * 1.05;
  for (const w of i)
    for (const m of w) {
      if (L(e, m) > o) continue;
      const $ = Math.atan2(m.y - e.y, m.x - e.x);
      s.push(fi($ - yo), fi($), fi($ + yo));
    }
  s.sort((w, m) => w - m);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, m], $) => {
    a[$] = w.x - e.x, l[$] = w.y - e.y, c[$] = m.x - w.x, u[$] = m.y - w.y;
  });
  const d = [], p = [];
  let f = NaN;
  for (const w of s) {
    if (w === f) continue;
    f = w;
    const m = Math.cos(w), $ = Math.sin(w);
    let k = n, _ = -1;
    for (let P = 0; P < r; P++) {
      const O = m * u[P] - $ * c[P];
      if (Math.abs(O) < 1e-12) continue;
      const V = (a[P] * u[P] - l[P] * c[P]) / O;
      if (!(V > cd && V < k)) continue;
      const U = (a[P] * $ - l[P] * m) / O;
      U < -vo || U > 1 + vo || (k = V, _ = P);
    }
    const x = { x: e.x + m * k, y: e.y + $ * k }, A = d.length;
    if (!(A > 0 && d[A - 1].x === x.x && d[A - 1].y === x.y)) {
      if (_ >= 0 && A >= 2 && p[A - 1] === _ && p[A - 2] === _) {
        d[A - 1] = x;
        continue;
      }
      d.push(x), p.push(_);
    }
  }
  const g = d[0], y = d[d.length - 1];
  return d.length > 1 && g.x === y.x && g.y === y.y && d.pop(), d;
}
const pd = 32, $o = 128;
function xn(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function $t(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function ds(e) {
  return (e % 360 + 360) % 360;
}
function pa(e) {
  return (e % 360 + 540) % 360 - 180;
}
function fa(e, t, n, i) {
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
function ze(e, t, n, i) {
  var s;
  return ((s = fa(e, t, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Q(e, t) {
  const n = t.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: xn(n.rotation) };
  const i = fa(e, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = t.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: z(i.pt, E(s, r)), dir: X(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? xn($t(s) + n.aim) : s, normal: s };
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
  const r = Fr(e), a = r.filter((N) => N.wallId === n.wallId && N.side === n.side), l = a.find((N) => N.end === "a"), c = a.find((N) => N.end === "b");
  if (!l || !c) return n;
  const u = X(o.dir), d = n.side === "left" ? u : E(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, f = xo(e, s, s.a, o.dir, d, p) ? -1 / 0 : l.offset, g = xo(e, s, s.b, E(o.dir, -1), d, p) ? 1 / 0 : c.offset, y = (N) => H(I(N, o.a), o.dir), w = [];
  for (const N of e.nodes)
    if (((U = N.host) == null ? void 0 : U.wallId) === s.id)
      for (const D of e.walls) {
        const j = D.a === N.id ? "a" : D.b === N.id ? "b" : null, ot = j && e.nodes.find((At) => At.id === (j === "a" ? D.b : D.a));
        if (!ot || (H(I(ot, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const wt = r.filter((At) => At.wallId === D.id && At.end === j).map((At) => y(At.pt));
        wt.length && w.push([Math.min(...wt), Math.max(...wt)]);
      }
  w.sort((N, D) => N[0] - D[0]);
  const m = [];
  let $ = f;
  for (const [N, D] of w) {
    const j = Math.min(N, g);
    j > $ && m.push([$, j]), $ = Math.max($, D);
  }
  g > $ && m.push([$, g]), m.length === 0 && m.push([f, g]);
  const k = ([N, D]) => Math.max(0, N - n.offset, n.offset - D), [_, x] = m.reduce((N, D) => k(D) < k(N) ? D : N), A = (t.shape === "circle" ? t.diameter : t.width) / 2, P = _ + A, O = x - A;
  let V = n.offset;
  return P > O ? V = (_ + x) / 2 : V <= P + i ? V = P : V >= O - i && (V = O), V = Math.max(0, Math.min(o.len, V)), Math.abs(V - n.offset) < 1e-9 ? n : { ...n, offset: V };
}
function ha(e, t) {
  const n = [];
  for (let i = 0; i < $o; i++) n.push(z(e, E(xn(360 * i / $o), t)));
  return n;
}
function ko(e, t, n, i) {
  if (n >= 360) return ha(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * pd)), o = $t(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(z(e, E(xn(o + n * a / s), i)));
  return r;
}
const fd = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Un(e) {
  return fd[e] ?? null;
}
const hd = (e) => Un(e.kind) !== null;
function md(e, t) {
  const n = t.props;
  if (!hd(n)) return null;
  const i = Q(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? ko(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? ko(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? ha(i.pt, n.poolRadius) : null;
  }
}
function gd(e) {
  return e.normal ? z(e.pt, e.normal) : e.pt;
}
function Mo(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function wd(e, t, n) {
  const i = I(t, e);
  for (const [s, o] of n) {
    const r = I(o, s), a = I(s, e), l = et(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const c = et(a, r) / l, u = et(a, i) / l;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const _o = 0.5, bd = 3, yd = 1e-4;
function vd(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  const s = gd(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (x) => Mo(x, n) || cs(x, n, _o).length > 0;
  if (!r(s)) return s;
  const a = J(e, e.walls.find((x) => x.id === o.wallId)), l = i.normal, c = (x) => Math.abs(H(I(x, i.pt), l)) <= yd, u = ([x, A]) => E(z(x, A), 0.5), d = n.filter((x) => c(x[0]) && c(x[1]) && L(x[0], x[1]) > 1e-9 && !Mo(z(u(x), E(l, _o)), n)), p = (x) => H(I(x, a.a), a.dir), f = ([x, A]) => Math.max(0, Math.min(p(x), p(A)) - o.offset, o.offset - Math.max(p(x), p(A))), g = Math.min(...d.map(f)), y = d.filter((x) => f(x) <= g + 1e-6).map((x) => z(u(x), l)), w = (x) => y.some((A) => !wd(x, A, n)), m = bd * Math.max(...e.walls.map((x) => x.thickness)) + 2, $ = [];
  for (const [x, A] of n) {
    const P = I(A, x), O = I(x, s), V = et(a.dir, P);
    if (Math.abs(V) < 1e-12) continue;
    const U = et(O, a.dir) / V;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const N = et(O, P) / V, D = L(x, A) / Math.abs(V);
    $.push(N - D, N + D);
  }
  const k = o.offset <= a.len / 2 ? 1 : -1, _ = $.filter((x) => Math.abs(x) <= m).sort((x, A) => Math.abs(x) - Math.abs(A) || Math.sign(A) * k - Math.sign(x) * k);
  for (const x of _) {
    const A = z(s, E(a.dir, x));
    if (!r(A) && w(A)) return A;
  }
  return null;
}
const $d = 1 / Math.cos(da / 2 * (Math.PI / 180)), So = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function xd(e, t, n = ua) {
  const i = md(e, t), s = Un(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = vd(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((d) => L(d, r))) * $d, l = cs(r, o, a);
  if (l.length === 0) return [i];
  const c = ud(r, l, a);
  let u;
  try {
    u = Hr.intersection(Vi(So(i)), Vi(So(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(jr));
}
function kd(e, t, n, i) {
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
function ma(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && kd(e, i[o], t, n)) return i[o].id;
  return null;
}
const Md = 60;
function Ti(e, t, n) {
  if (!zr.has(t.props.kind)) return null;
  const i = Q(e, t);
  return i ? { from: i.pt, to: z(i.pt, E(i.dir, Md / n)) } : null;
}
function ga(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function _d(e, t, n, i) {
  const s = t.placement, o = Q(e, t);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = $t(I(n, o.pt)), a = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: ds(a(r)) };
  const l = pa(r - $t(o.normal)), c = Math.max(-se, Math.min(se, a(l)));
  return ga(s, c);
}
const Sd = 1, kn = 1, Ao = 1e-6, Ad = 1e-9, Ed = 1e-6, Id = 1;
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
      return n === null ? null : ze(e, t.wallId, t.side, Math.max(0, Math.min(n, t.offset)));
    }
  }
}
function st(e, t) {
  const n = t.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => ps(e, i) ?? { x: i.x, y: i.y });
}
function fs(e, t) {
  const n = st(e, t);
  return n.length < 3 ? null : Math.round(Math.abs(kt(n)) / 1e5) / 10;
}
function $e(e, t, n) {
  const i = et(I(t, e), I(n, e));
  return Math.abs(i) <= Ad * L(e, t) * L(e, n) ? 0 : Math.sign(i);
}
const Ge = (e, t, n) => H(I(t, e), I(n, e)) <= 0;
function wa(e, t, n, i) {
  const s = $e(n, i, e), o = $e(n, i, t), r = $e(e, t, n), a = $e(e, t, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && Ge(n, e, t) || a === 0 && Ge(i, e, t) || s === 0 && Ge(e, n, i) || o === 0 && Ge(t, n, i);
}
function Pd(e) {
  const t = [];
  for (const n of e) (t.length === 0 || L(t[t.length - 1], n) > Ao) && t.push(n);
  for (; t.length > 1 && L(t[0], t[t.length - 1]) <= Ao; ) t.pop();
  return t;
}
function Mn(e) {
  const t = Pd(e), n = t.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = t[i], o = t[(i + 1) % n], r = t[(i + 2) % n];
    if ($e(s, o, r) === 0 && H(I(o, s), I(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && wa(s, o, t[a], t[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function ba(e, t) {
  const n = t.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : ps(e, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = Gt(e, o.wallId);
    return r !== null && (o.offset < -kn || o.offset > r + kn);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = st(e, t);
  return Math.abs(kt(s)) < Id || Mn(s) ? "crossing" : null;
}
function jn(e, t) {
  return oe(t, e) || e.some((n, i) => xt(t, n, e[(i + 1) % e.length]) <= Sd);
}
const ya = (e, t) => !(e.zoneBlacklist ?? []).includes(t);
function Cd(e, t) {
  const n = Q(e, t);
  return n ? e.zones.filter((i) => jn(st(e, i), n.pt)).map((i) => ({ zone: i, participates: ya(t, i.id) })) : [];
}
function va(e, t) {
  const n = e.zones.find((o) => o.id === t);
  if (!n) return [];
  const i = st(e, n), s = [];
  for (const o of e.devices) {
    const r = Q(e, o);
    r && jn(i, r.pt) && s.push({ device: o, participates: ya(o, t) });
  }
  return s;
}
function Ld(e) {
  const t = e.length;
  if (t === 0) return { x: 0, y: 0 };
  const n = kt(e);
  if (Math.abs(n) > Ed) {
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
  for (const i of t) for (let s = 0; s < i.length; s++) n = Math.min(n, xt(e, i[s], i[(s + 1) % i.length]));
  return n;
}
function $a(e) {
  const t = e.zones.map((s) => st(e, s)), n = t.map((s) => Math.abs(kt(s))), i = /* @__PURE__ */ new Map();
  return e.zones.forEach((s, o) => {
    const r = t[o];
    if (r.length < 3) return;
    const a = t.filter((y, w) => w !== o && y.length >= 3 && n[w] < n[o] && y.every((m) => jn(r, m))), l = Ld(r);
    if (a.length === 0) {
      i.set(s.id, l);
      return;
    }
    const c = r.map((y) => y.x), u = r.map((y) => y.y), d = Math.min(...c), p = Math.min(...u), f = Math.max(Math.max(...c) - d, Math.max(...u) - p) / hi;
    let g = null;
    for (let y = d + f / 2; y < d + f * hi; y += f)
      for (let w = p + f / 2; w < p + f * hi; w += f) {
        const m = { x: y, y: w };
        if (!oe(m, r) || a.some((k) => oe(m, k))) continue;
        const $ = Math.min(Eo(m, [r]), Eo(m, a));
        (!g || $ > g.d) && (g = { p: m, d: $ });
      }
    i.set(s.id, (g == null ? void 0 : g.p) ?? l);
  }), i;
}
const hs = 3, ae = (e, t) => ({ ...e, zones: t }), Ne = (e, t, n) => ae(e, e.zones.map((i) => i === t ? n : i)), ms = (e) => ({ kind: "free", x: e.x, y: e.y, lost: !0 }), xa = (e, t) => e.length === t.length && e.every((n, i) => n.x === t[i].x && n.y === t[i].y);
function Od(e, t) {
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
function zd(e, t) {
  return e.kind === "walls" ? t.kind === "walls" && e.broken === t.broken && e.seed.x === t.seed.x && e.seed.y === t.seed.y && xa(e.outline, t.outline) : t.kind === "polygon" && e.vertices.length === t.vertices.length && e.vertices.every((n, i) => Od(n, t.vertices[i]));
}
function ka(e, t) {
  return e.id === t.id && e.name === t.name && e.automation === t.automation && e.invalid === t.invalid && zd(e.shape, t.shape);
}
function Nd(e, t) {
  if (t.kind === "free") return t;
  const n = ps(e, t);
  return n ? n.x === t.x && n.y === t.y ? t : { ...t, x: n.x, y: n.y } : ms(t);
}
function Ma(e, t) {
  const n = t.shape, i = n.vertices.map((s) => Nd(e, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...t, shape: { kind: "polygon", vertices: i } } : t;
}
function Vd(e, t, n) {
  const i = e.shape, s = Di(t, i.seed);
  return !s || n.some((o) => ca(o, s)) ? i.broken ? e : { ...e, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && xa(s, i.outline) ? e : { ...e, shape: { ...i, outline: s, broken: !1 } });
}
function _a(e, t) {
  const n = ba(e, t) !== null;
  return t.invalid === n ? t : { ...t, invalid: n };
}
const gs = (e, t) => _a(e, Ma(e, t));
function Dd(e) {
  const t = e.zones;
  if (t.length === 0) return e;
  const n = t.some((o) => o.shape.kind === "walls") ? la(e) : [], i = [], s = t.map((o) => _a(
    e,
    o.shape.kind === "walls" ? Vd(o, n, i) : Ma(e, o)
  ));
  return s.some((o, r) => o !== t[r]) ? ae(e, s) : e;
}
function Td(e, t) {
  const n = e.zones, i = t.zones, s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && ka(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? e : ae(e, i) : s.some((o, r) => o !== n[r]) ? ae(e, s) : e;
}
function Hd(e, t, n) {
  const i = la(e), s = Di(i, t);
  if (!s) return { level: e, zoneId: null, existing: !1 };
  for (const r of e.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const a = Di(i, r.shape.seed);
    if (a && ca(a, s)) return { level: e, zoneId: r.id, existing: !0 };
  }
  const o = { id: K(), name: n, shape: { kind: "walls", seed: { x: t.x, y: t.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: ae(e, [...e.zones, o]), zoneId: o.id, existing: !1 };
}
const ws = (e) => e.kind === "free" && e.lost ? { kind: "free", x: e.x, y: e.y } : e;
function Rd(e, t, n) {
  if (t.length < hs) return { level: e, zoneId: null };
  const i = gs(e, { id: K(), name: n, shape: { kind: "polygon", vertices: t.map(ws) }, invalid: !1 });
  return Mn(st(e, i)) ? { level: e, zoneId: null } : { level: ae(e, [...e.zones, i]), zoneId: i.id };
}
function Bd(e, t, n) {
  const i = e.zones.find((s) => s.id === t);
  return !i || i.name === n ? e : Ne(e, i, { ...i, name: n });
}
function bs(e, t, n) {
  const i = e.zones.find((r) => r.id === t);
  if (!i || i.automation !== !1 === n) return e;
  if (!n) return Ne(e, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return Ne(e, i, o);
}
function Sa(e, t) {
  if (t.length > 0) return { ...e, zoneBlacklist: t };
  const { zoneBlacklist: n, ...i } = e;
  return i;
}
function Aa(e, t) {
  if (!e.zones.some((i) => i.id === t)) return e;
  const n = e.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(t) ? Sa(i, i.zoneBlacklist.filter((o) => o !== t)) : i;
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
  return ka(i, t) ? e : Ne(e, t, i);
}
const $s = (e, t) => Number.isInteger(e) && e >= 0 && e < t;
function Fd(e, t, n, i) {
  const s = ys(e, t);
  return !s || !$s(n, s.shape.vertices.length) ? e : vs(e, s, s.shape.vertices.map((o, r) => r === n ? ws(i) : o));
}
function Ud(e, t, n, i) {
  const s = ys(e, t);
  if (!s || !$s(n, s.shape.vertices.length + 1)) return e;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, ws(i)), vs(e, s, o);
}
function jd(e, t, n) {
  const i = ys(e, t);
  return !i || i.shape.vertices.length <= hs || !$s(n, i.shape.vertices.length) ? e : vs(e, i, i.shape.vertices.filter((s, o) => o !== n));
}
function Wd(e, t) {
  const n = e.zones.find((s) => s.id === t);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < hs) return e;
  const i = n.shape.outline.map(ms);
  return Ne(e, n, gs(e, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Ea(e, t, n, i) {
  const s = e.devices.find((a) => a.id === t);
  if (!s) return e;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !e.zones.some((a) => a.id === n)) return e;
  const r = Sa(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...e, devices: e.devices.map((a) => a === s ? r : a) };
}
const Ve = 1;
function gt(e) {
  return structuredClone(e);
}
function Wn(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function qd(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function qn(e, t, n) {
  const i = q(e, t.a), s = q(e, t.b), o = L(i, s), r = qd(typeof n == "number" ? n : Tn(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Dr(i, s, r / o), offset: r };
}
function Zd(e) {
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
function Ia(e, t) {
  Zd(e), t && Yd(t, e);
  const n = Dd(aa(Ue(e)));
  return t ? Td(n, t) : n;
}
function St(e, t) {
  return Ia(gt(e), t);
}
function Pa(e, t, n) {
  const i = Hn(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
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
  return s <= Ve ? { pt: q(e, n.a), nodeId: n.a } : o - s <= Ve ? { pt: q(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Po(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: K(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Kd(e, t, n, i) {
  const s = Io(e, t), o = Io(e, n);
  if (L(s.pt, o.pt) < Ve) return { level: e, wallId: null, endNodeId: null };
  const r = gt(e), a = Po(r, s), l = Po(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const c = { id: K(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: St(r, e), wallId: c.id, endNodeId: l };
}
function Ca(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < Ve || l - a < Ve ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Gd(e, t, n, i, s) {
  const o = Ca(t, n, i.thickness, s);
  if (!o) return e;
  const r = gt(e), a = o.map((l) => {
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
function Xd(e, t, n) {
  const i = gt(e);
  return Pa(i, t, n), Ia(i, e);
}
function Yd(e, t) {
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
    const u = Dn(I(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = Tn(z(o, E(u, d.offset)), a, l) * c);
  }
}
function Qd(e, t, n) {
  const i = gt(e), s = Wn(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: z(q(i, a), n) }));
  for (const a of r) Pa(i, a.id, a.to);
  return St(i, e);
}
function Zn(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function La(e, t, n) {
  for (const i of e.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === t && (s.nodeId = n);
}
function Jd(e, t, n) {
  const i = gt(e), s = Wn(i, t), o = s[n], r = q(i, o), a = { id: K(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || La(i, o, a.id), Zn(i), { level: St(i, e), nodeId: a.id };
}
function tu(e, t, n) {
  if (t === n) return e;
  const i = gt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return La(i, t, n), i.nodes = i.nodes.filter((o) => o.id !== t), Zn(i), St(i, e);
}
function xs(e, t) {
  var i;
  const n = gt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Zn(n), St(n, e);
}
function eu(e, t, n) {
  const i = gt(e);
  return Object.assign(Wn(i, t), n), St(i, e);
}
const rt = (e) => typeof e == "string" && e !== "" ? e : null, Oa = (e) => e.split(".")[0], nu = ["friendly_name", "device_class", "unit_of_measurement"];
function za(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: Oa(e),
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
function iu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, za(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function su(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && nu.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Na(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function ou(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = za(r.entity_id, {});
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
function ru(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Va(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Na(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const au = {
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
  return au[e] ?? e;
}
const lu = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], cu = 10;
function pe(e, t) {
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
function Da() {
  return { blocks: [{ id: K(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function du(e, t, n, i) {
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
function uu(e, t, n, i) {
  return Kn(e, t, (s) => ({ ...s, x: n, y: i }));
}
const Hi = (e) => "block" in e ? e.block : e.bus, Ta = (e, t) => Hi(e.from) === t || Hi(e.to) === t;
function De(e, t, n, i) {
  const s = e.blocks.find((c) => c.id === t);
  if (!s) return e;
  const o = Kn(e, t, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !Ta(c, t)) };
  const r = o.blocks.find((c) => c.id === t), a = new Set(pe(r, i).map((c) => c.name)), l = (c) => "block" in c && c.block === t && !a.has(c.port);
  return o.wires.some((c) => l(c.from) || l(c.to)) ? { ...o, wires: o.wires.filter((c) => !l(c.from) && !l(c.to)) } : o;
}
function Ha(e, t) {
  const n = e.blocks.find((i) => i.id === t);
  return !n || n.kind === "grid" ? e : { blocks: e.blocks.filter((i) => i.id !== t), wires: e.wires.filter((i) => !Ta(i, t)) };
}
const Ra = (e, t) => new Set(e.blocks.flatMap((n) => n.kind === "device" && n.deviceId === t ? [n.id] : []));
function Gn(e, t, n) {
  const i = Ra(e, t);
  if (i.size === 0) return e;
  const s = new Map(e.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(pe(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = e.wires.filter((c) => !o(c.from) && !o(c.to));
  let a = !1;
  const l = e.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((g) => u.has(g))) return c;
    a = !0;
    const d = Object.fromEntries(Object.entries(c.portPins).filter(([g]) => u.has(g))), { portPins: p, ...f } = c;
    return Object.keys(d).length ? { ...f, portPins: d } : f;
  });
  return r.length === e.wires.length && !a ? e : { ...e, blocks: l, wires: r };
}
function pu(e, t) {
  const n = ks(t), i = new Set(e.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = e;
  for (const o of i) s = Gn(s, o, n);
  return s;
}
function fu(e, t) {
  const n = Ra(e, t);
  if (n.size === 0) return e;
  const i = (s) => n.has(Hi(s));
  return {
    ...e,
    blocks: e.blocks.filter((s) => !n.has(s.id)),
    wires: e.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const ks = (e) => ({ device: (t) => e.devices.find((n) => n.id === t) });
function Ba(e, t, n) {
  var o;
  const i = ((o = e.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = ld(e, n);
  return { level: s, power: i ? fu(t, n) : Gn(t, n, ks(s)) };
}
function Fa(e, t, n, i) {
  const s = oa(e, n, i);
  return { level: s, power: s === e ? t : Gn(t, n, ks(s)) };
}
function Ua(e, t) {
  return e.wires.some((n) => n.id === t) ? { ...e, wires: e.wires.filter((n) => n.id !== t) } : e;
}
function hu(e, t, n, i) {
  return Kn(e, t, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...a } = s;
    return Object.keys(o).length ? { ...a, portPins: o } : a;
  });
}
function mu(e, t) {
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
function gu(e, t) {
  const n = e.filter((o) => o.kind === "transfer"), i = n.slice(0, cu), s = /* @__PURE__ */ new Map();
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
  const s = new Map(e.blocks.map((m) => [m.id, m])), o = (m) => {
    if ("bus" in m) {
      const _ = s.get(m.bus);
      return _ && _.kind === "bus" ? { bl: _, dir: null } : null;
    }
    const $ = s.get(m.block), k = $ ? pe($, i).find((_) => _.name === m.port) : void 0;
    return $ && k ? { bl: $, dir: k.dir } : null;
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
  const u = (m) => "block" in m && e.wires.some(($) => [$.from, $.to].some((k) => "block" in k && k.block === m.block && k.port === m.port));
  if (u(l) || u(c)) return { error: "port-taken" };
  const d = (m) => {
    for (const $ of e.wires)
      for (const [k, _] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in k && k.bus === m && "block" in _) {
          const x = s.get(_.block);
          if (x) return Lo(x, _.port);
        }
    return null;
  }, p = (m) => "bus" in m ? d(m.bus) : Lo(s.get(m.block), m.port), f = p(l), g = p(c);
  if (f !== null && g !== null && f !== g) return { error: "dc-mismatch" };
  if ("bus" in l && "block" in c && s.get(c.block).kind === "remainder" && e.wires.some((m) => {
    var $;
    return "bus" in m.from && m.from.bus === l.bus && "block" in m.to && (($ = s.get(m.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const y = { id: K(), from: l, to: c }, w = [...e.wires, y];
  return gu(e.blocks, w) ? { error: "loop" } : { schema: { ...e, wires: w }, wire: y };
}
const bt = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ne = (e) => typeof e == "number" && Number.isFinite(e), wu = ["top", "right", "bottom", "left"], bu = ["2in1out", "1in2out"];
function yu(e, t) {
  let n = e;
  if (n.kind === "bus" && !(ne(n.w) && ne(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !bu.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(pe(n, t).map((c) => c.name)), o = {};
  let r = bt(i);
  for (const [c, u] of bt(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !bt(u) || !wu.includes(u.side) || !ne(u.at)) {
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
function vu(e, t) {
  if (!bt(e)) return;
  const n = Array.isArray(e.blocks) ? e.blocks : [], i = Array.isArray(e.wires) ? e.wires : [];
  let s = !Array.isArray(e.blocks) || !Array.isArray(e.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (bt(u) && typeof u.id == "string" && u.id && lu.includes(u.kind) && ne(u.x) && ne(u.y)) {
      const d = yu(u, t);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const a = new Map(o.map((u) => [u.id, u])), l = (u) => {
    var p;
    if (!bt(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = a.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !ne(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const d = typeof u.block == "string" ? a.get(u.block) : void 0;
    return d && !r.has(d.id) && pe(d, t).some((f) => f.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = bt(u) ? l(u.from) : null, p = bt(u) ? l(u.to) : null;
    if (!bt(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...e, blocks: o, wires: c } : e;
}
function ja(e, t) {
  const n = new Set(t.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return e.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function $u(e) {
  const t = e.blocks.find((n) => n.kind === "grid");
  return !!t && t.kind === "grid" && !!t.power && e.wires.length > 0;
}
const We = 11, _n = 18, Sn = 30, xu = 12, ku = 120, nt = 14, zo = 10, Te = (e) => Math.round(e / zo) * zo || 0, mi = 24, No = 6, Mu = 2 * We + 6, _u = nt, Su = 1e6, Vo = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Xn = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 }), gi = (e, t, n) => e.x >= t.x - n && e.x <= t.x + t.w + n && e.y >= t.y - n && e.y <= t.y + t.h + n, Wa = (e) => Math.min(1, Math.max(0, e));
function Yn(e, t) {
  var n;
  return e.kind === "device" ? ((n = t.device(e.deviceId)) == null ? void 0 : n.name) ?? "" : e.name ?? "";
}
function Au(e, t) {
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
function ht(e, t, n) {
  return n ? Ss(n, e, t).r : Ms(e, t);
}
function Ms(e, t) {
  return e.kind === "bus" ? { x: e.x, y: e.y, w: e.w, h: e.h } : {
    x: e.x,
    y: e.y,
    w: Math.max(ku, 7 * Yn(e, t).length + 32),
    h: Sn + _n * Au(e, t) + xu
  };
}
function An(e, t, n) {
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
function Eu(e, t) {
  const n = Xn(e), i = t.x - n.x, s = t.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (e.w / 2) > Math.abs(s) / (e.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function Iu(e, t) {
  const n = [
    { side: "top", a: { x: e.x, y: e.y }, b: { x: e.x + e.w, y: e.y } },
    { side: "right", a: { x: e.x + e.w, y: e.y }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "bottom", a: { x: e.x, y: e.y + e.h }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "left", a: { x: e.x, y: e.y }, b: { x: e.x, y: e.y + e.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const a of n) {
    const l = xt(t, a.a, a.b);
    l < s && (i = a, s = l);
  }
  const r = i.side === "top" || i.side === "bottom" ? e.w ? (t.x - e.x) / e.w : 0.5 : e.h ? (t.y - e.y) / e.h : 0.5;
  return { side: i.side, at: Wa(r) };
}
const He = (e) => e.w >= e.h;
function qa(e, t) {
  return He(e) ? { x: e.x + t * e.w, y: e.y + e.h / 2 } : { x: e.x + e.w / 2, y: e.y + t * e.h };
}
function Pu(e, t, n) {
  const i = { x: e.x, y: e.y, w: e.w, h: e.h };
  if (t === 0 || t === 1) {
    const r = He(e) ? t === 0 ? "left" : "right" : t === 0 ? "top" : "bottom";
    return { pt: An(i, r, 0.5), side: r };
  }
  const s = Xn(i), o = He(e) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: An(i, o, t), side: o };
}
function Cu(e, t) {
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
function Lu(e, t, n, i) {
  const s = e.wires.find((a) => wi(a.from, t, n) || wi(a.to, t, n));
  if (!s) return null;
  const o = wi(s.from, t, n) ? s.to : s.from;
  if ("bus" in o) {
    const a = Ri(e, o.bus);
    return a ? qa(a, o.at) : null;
  }
  const r = _s(e, o.block);
  return r ? Xn(Ms(r, i)) : null;
}
function Ss(e, t, n) {
  const i = Ms(t, n), s = Xn(i), o = pe(t, n).map((c) => {
    var g;
    const u = (g = t.portPins) == null ? void 0 : g[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = Lu(e, t.id, c.name, n), p = (d && Eu(i, d)) ?? Cu(t, c), f = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * Mu : 0;
  }, a = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, l = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (l[u] = { name: c.name, dir: c.dir, side: c.side, pt: An(a, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, f) => {
      l[p] = { name: d.name, dir: d.dir, side: c, pt: An(a, c, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: a, places: l };
}
function Qn(e, t, n) {
  return Ss(e, t, n).places;
}
function Za(e, t, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = _s(e, c.block);
    if (!u) return null;
    const { r: d, places: p } = Ss(e, u, n), f = p.find((g) => g.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = Ri(e, c.bus);
    if (!p) return null;
    let f = d == null ? void 0 : d.pt;
    if (!f && "bus" in u) {
      const g = Ri(e, u.bus);
      f = g && qa(g, u.at);
    }
    return f ? { ...Pu(p, c.at, f), rect: ht(p, n, e) } : null;
  }, o = i(t.from), r = i(t.to), a = o ?? s(t.from, t.to, r), l = r ?? s(t.to, t.from, o);
  return a && l ? { a, b: l } : null;
}
const Xe = (e, t) => ({ x: Math.sign(t.x - e.x), y: Math.sign(t.y - e.y) }), Bi = (e, t) => Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
function Ou(e, t, n) {
  const i = [];
  for (const a of e) {
    const l = i[i.length - 1];
    if (!(l && l.x === a.x && l.y === a.y)) {
      if (l && l.x !== a.x && l.y !== a.y) return null;
      if (i.length >= 2) {
        const c = Xe(i[i.length - 2], l), u = Xe(l, a);
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
  const o = Xe(i[0], i[1]), r = Xe(i[s - 2], i[s - 1]);
  return o.x !== t.x || o.y !== t.y || Bi(i[0], i[1]) < nt - 1e-9 || r.x !== -n.x || r.y !== -n.y || Bi(i[s - 2], i[s - 1]) < nt - 1e-9 ? null : i;
}
function zu(e, t, n) {
  return Math.min(e.x, t.x) < n.x + n.w - 0.5 && Math.max(e.x, t.x) > n.x + 0.5 && Math.min(e.y, t.y) < n.y + n.h - 0.5 && Math.max(e.y, t.y) > n.y + 0.5;
}
function Nu(e, t) {
  let n = (e.length - 2) * _u;
  for (let i = 1; i < e.length; i++) {
    n += Bi(e[i - 1], e[i]);
    for (const s of t) zu(e[i - 1], e[i], s) && (n += Su);
  }
  return n;
}
function Ka(e, t) {
  const n = e.pt, i = t.pt, s = Vo[e.side], o = Vo[t.side], r = { x: n.x + s.x * nt, y: n.y + s.y * nt }, a = { x: i.x + o.x * nt, y: i.y + o.y * nt }, l = [e.rect, t.rect].filter((k) => !!k), c = (k, _) => [.../* @__PURE__ */ new Set([
    (r[k] + a[k]) / 2,
    r[k],
    a[k],
    n[k],
    i[k],
    ...l.flatMap((x) => [x[k] - nt, x[k] + x[_] + nt]),
    Math.min(r[k], a[k]) - nt,
    Math.max(r[k], a[k]) + nt
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, f = o.x === 0, g = (p ? d : u).filter((k) => (k - (p ? n.y : n.x)) * (p ? s.y : s.x) >= nt - 1e-9), y = (f ? d : u).filter((k) => (k - (f ? i.y : i.x)) * (f ? o.y : o.x) >= nt - 1e-9);
  let w = null, m = 1 / 0;
  const $ = (k) => {
    const _ = Ou(k, s, o);
    if (!_) return;
    const x = Nu(_, l);
    x < m - 1e-6 && (w = _, m = x);
  };
  if (p && f)
    for (const k of g) for (const _ of u) for (const x of y)
      $([n, { x: n.x, y: k }, { x: _, y: k }, { x: _, y: x }, { x: i.x, y: x }, i]);
  else if (!p && !f)
    for (const k of g) for (const _ of d) for (const x of y)
      $([n, { x: k, y: n.y }, { x: k, y: _ }, { x, y: _ }, { x, y: i.y }, i]);
  else if (p)
    for (const k of g) for (const _ of y)
      $([n, { x: n.x, y: k }, { x: _, y: k }, { x: _, y: i.y }, i]);
  else
    for (const k of g) for (const _ of y)
      $([n, { x: k, y: n.y }, { x: k, y: _ }, { x: i.x, y: _ }, i]);
  return w ?? [n, r, p ? { x: r.x, y: a.y } : { x: a.x, y: r.y }, a, i];
}
function Ga(e, t, n) {
  const i = ht(e, t, n), s = i.x + (i.w - (3 * mi + 2 * No)) / 2, o = i.y + Sn + 1;
  return ["A", "0", "B"].map((r, a) => ({
    position: r,
    rect: { x: s + a * (mi + No), y: o, w: mi, h: _n - 2 }
  }));
}
function Vu(e) {
  const { x: t, y: n, w: i, h: s } = e;
  return He(e) ? [{ end: "start", a: { x: t, y: n }, b: { x: t, y: n + s } }, { end: "end", a: { x: t + i, y: n }, b: { x: t + i, y: n + s } }] : [{ end: "start", a: { x: t, y: n }, b: { x: t + i, y: n } }, { end: "end", a: { x: t, y: n + s }, b: { x: t + i, y: n + s } }];
}
function Do(e, t, n, i) {
  const s = [...e.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = Ga(u, i, e).find((p) => gi(t, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of Qn(e, u, i)) {
      const p = L(t, d.pt);
      p <= We + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const f of Vu(u)) {
      const g = xt(t, f.a, f.b);
      g <= n && g < p && (d = { kind: "bus-end", id: u.id, end: f.end }, p = g);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !gi(t, ht(u, i, e), n)) continue;
    const d = He(u) ? (t.x - u.x) / u.w : (t.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Wa(d) };
  }
  let a = null, l = 1 / 0;
  for (const u of e.wires) {
    const d = Za(e, u, i);
    if (!d) continue;
    const p = Ka(d.a, d.b);
    for (let f = 1; f < p.length; f++) {
      const g = xt(t, p[f - 1], p[f]);
      g <= n && g < l && (a = { kind: "wire", id: u.id }, l = g);
    }
  }
  if (a) return a;
  const c = s.find((u) => u.kind !== "bus" && gi(t, ht(u, i, e), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function Du(e, t) {
  if (!e.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of e.blocks) {
    const a = ht(r, t, e);
    n = Math.min(n, a.x), i = Math.min(i, a.y), s = Math.max(s, a.x + a.w), o = Math.max(o, a.y + a.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Xa extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function bi(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Tu(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Hu(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Xa(s.message) : s;
  }
}
async function Ru(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Bu = 3;
function yt(e) {
  if (typeof e == "number")
    return e === Bu ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Fu {
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
      const o = await Hu(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Xa ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = yt(o)), this.onChange(), null;
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
const Ya = (e) => e.strings === void 0, Uu = {}, As = (e, t = Uu) => e._$AH = t;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ju = Jn(class extends ti {
  constructor() {
    super(...arguments), this.key = b;
  }
  render(e, t) {
    return this.key = e, t;
  }
  update(e, [t, n]) {
    return t !== this.key && (As(e), this.key = t), n;
  }
});
var Qa = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Wu = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", qu = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Zu = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Ku = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Gu = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", To = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Ye = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Xu = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Yu = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Qu = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Ju = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", tp = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", ep = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", np = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", ip = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", sp = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", op = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", rp = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", ap = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", lp = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Ja = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", cp = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", tl = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", dp = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", up = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", pp = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", fp = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", hp = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", mp = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", gp = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", wp = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", bp = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", yp = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const it = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function ft(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
function el(e) {
  return e === null ? "—" : `${e.toFixed(1)} ${h("unit.m2")}`;
}
const qe = 12, F = "non-scaling-stroke", nl = 7, vp = 10, En = "#f43f5e", Ho = "3 2", Ro = 18, $p = 6, Bo = 11, xp = 0.6, kp = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", il = 24, Qe = 4, Fo = 4, un = qe * 0.85, Mp = 0.58;
function _p(e, t, n, i) {
  const s = il;
  if (!t) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), a = Math.abs(Math.sin(o)), [l, c] = e.shape === "circle" ? [e.diameter / Math.SQRT2, e.diameter / Math.SQRT2] : [e.width * r + e.depth * a, e.width * a + e.depth * r], u = l * i - 2 * Fo, d = c * i - 2 * Fo, p = t.length * Mp * un, f = s + Qe + un, g = s + Qe + p, y = Math.max(s, p), w = (_, x) => Math.max(0, _ - u) + Math.max(0, x - d), m = w(y, f), $ = w(g, s);
  if (m > 0 && $ < m) {
    const _ = -g / 2;
    return {
      mode: "line",
      iconX: (_ + s / 2) / i,
      iconY: 0,
      labelX: (_ + s + Qe) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const k = -f / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (k + s / 2) / i,
    labelX: 0,
    labelY: (k + s + Qe + un / 2) / i,
    labelAnchor: "middle"
  };
}
function Sp(e, t, n, i = 0, s = 0) {
  const o = il / t;
  return customElements.get("ha-icon") ? M`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : M`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${kp} fill=${n}></path></g>`;
}
const Ap = "__preview__", Ep = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Ip = /* @__PURE__ */ new WeakMap();
function Pp(e, t) {
  var s;
  const n = ft(Ip, e.walls, () => /* @__PURE__ */ new WeakMap()), i = ft(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = ft(i, e.openings, () => ({})))[t] ?? (s[t] = ua(e, t));
}
const Cp = /* @__PURE__ */ new WeakMap();
function sl(e, t) {
  const n = Un(t.props.kind);
  if (!n) return [];
  const i = Pp(e, n), s = ft(Cp, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = xd(e, t, () => i), s.set(t, o)), o;
}
function In(e, t) {
  return e.props.kind === "ceiling_light" && e.props.shape === "round" ? Math.max(e.props.diameter / 2, t) : t;
}
function Lp(e, t, n, i, s, o = n, r = !1) {
  const a = e.props, l = { stroke: n, fill: i }, c = s ?? b;
  switch (a.kind) {
    case "ceiling_light":
      return a.shape === "linear" ? M`<rect class="icon" x=${-a.length / 2} y=${-a.width / 2} width=${a.length} height=${a.width}
          fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>` : a.shape === "spot" ? M`<circle class="icon" r=${t / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${F}></circle>` : M`<circle class="icon" r=${In(e, t)} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>`;
    case "wall_light":
      return M`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${l.fill} stroke=${l.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "motion_sensor": {
      const u = (d) => `M${t * d} ${-t * d * 0.8}A${t * d} ${t * d * 0.8} 0 0 1 ${t * d} ${t * d * 0.8}`;
      return M`<circle class="icon" r=${t * 0.6} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let d = 0; d < 8; d++) {
        const p = d * Math.PI / 4;
        u += `M${Math.cos(p) * t * 1.15} ${Math.sin(p) * t * 1.15}L${Math.cos(p) * t * 1.6} ${Math.sin(p) * t * 1.6}`;
      }
      return M`<circle class="icon" r=${t * 0.7} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "wall_switch":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${l.fill}
        stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>`;
    case "valve":
      return M`<path class="icon" d=${`M${-t} ${-t * 0.6}L${t} ${t * 0.6}L${t} ${-t * 0.6}L${-t} ${t * 0.6}Z`} fill=${l.fill}
        stroke=${l.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "leak_sensor":
      return M`<circle class="icon" r=${t * 0.7} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="drop" d=${`M0 ${-t * 0.4}Q${t * 0.3} ${t * 0.05} 0 ${t * 0.3}Q${-t * 0.3} ${t * 0.05} 0 ${-t * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${F}></path>`;
    case "smart_button":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${F}></rect>
        <circle class="dot" r=${t * 0.18} fill=${n}></circle>`;
    case "socket":
      return M`<circle class="icon" r=${t} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return M`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let d = 0; d < 4; d++) {
        const p = d * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * t * 0.85} ${Math.sin(p) * t * 0.85}`;
      }
      return M`<circle class="icon" r=${t} fill=${l.fill} stroke=${l.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    default:
      return M`${b}`;
  }
}
function Op(e, t, n, i, s, o) {
  const r = e.props;
  if (r.kind !== "equipment") return M`${b}`;
  const a = _p(r, r.label, i, t.scale), l = o ?? b, c = r.shape === "circle" ? M`<circle class="equipment-body" r=${r.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${l} vector-effect=${F}></circle>
      ${s ? M`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : b}` : M`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${l} vector-effect=${F}></rect>
      ${s ? M`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : b}`;
  return M`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${Sp(r.icon, t.scale, n, a.iconX, a.iconY)}
    <text class="equipment-label" x=${a.labelX} y=${a.labelY} text-anchor=${a.labelAnchor} dominant-baseline="middle"
      font-size=${un / t.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function zp(e, t, n = 0) {
  return e === "bound" ? b : M`<circle class=${`bind-ring bind-${e}`} r=${Math.max(qe * 1.7 / t, n + 4 / t)} fill="none" style=${`stroke:${Ep[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : b} vector-effect=${F}></circle>`;
}
function Np(e, t, n) {
  if (e.status !== "error") return b;
  const i = t * 0.9, s = -t * 0.9, o = vp / n.scale;
  return M`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${nl / n.scale} fill=${n.palette.background} stroke=${En} stroke-width="1.5"
      vector-effect=${F}></circle>
    <path d=${Qa} fill=${En} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function Vp(e, t) {
  return e === "motion" ? t.motionCone : e === "leak" ? En : e === "event" ? t.selection : t.device;
}
function Dp(e, t, n) {
  const i = [...e.shown.map((r) => [r, "bubble-in"]), ...e.leaving.map((r) => [r, "bubble-out"])];
  if (i.length === 0) return b;
  const s = 1 / n.scale, o = t * 0.9 + (nl + 3) * s;
  return M`${i.map(([r, a], l) => {
    const c = (r.text.length * Bo * xp + 2 * $p) * s, u = Ro * s, d = -t * 0.9 - (4 + Ro * (l + 1) + 2 * l) * s, p = Vp(r.tone, n.palette);
    return ju(`${a}:${r.key ?? ""}`, M`<g class=${`bubble ${a}`} data-tone=${r.tone}>
      <rect x=${o} y=${d} width=${c} height=${u} rx=${u / 2} fill=${n.palette.background} stroke=${p} stroke-width="1.5"
        vector-effect=${F}></rect>
      <text x=${o + c / 2} y=${d + u / 2} text-anchor="middle" dominant-baseline="central" fill=${p} font-weight="700"
        font-size=${Bo * s} font-family="system-ui, sans-serif">${r.text}</text>
    </g>`);
  })}`;
}
function Tp(e, t) {
  const n = e.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : In(e, qe / t.scale);
}
function Hp(e, t, n) {
  var o;
  const i = (o = n.bubbles) == null ? void 0 : o.call(n, e), s = i ? Dp(i, Tp(e, n), n) : b;
  return s === b ? b : M`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${t.pt.x} ${t.pt.y})`}
    opacity=${n.dim ? String(n.palette.dimOpacity) : b}>${s}</g>`;
}
function Rp(e, t, n, i) {
  var k, _, x;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = qe / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((k = n.selection) == null ? void 0 : k.kind) === "device" && n.selection.id === e.id, c = !i && Vn(e.props.kind), u = c ? (_ = n.containerState) == null ? void 0 : _.call(n, e) : void 0, d = i || (x = n.live) == null ? void 0 : x.call(n, e), p = (d == null ? void 0 : d.look) === "on" || (d == null ? void 0 : d.look) === "active", f = c && !!n.containerState && !u || (d == null ? void 0 : d.look) === "no-data", g = e.props.kind, y = !p || e.invalid ? o : g === "leak_sensor" ? En : g === "motion_sensor" ? s.motionCone : o, w = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), m = i ? "0.5" : n.dim ? String(s.dimOpacity) : b, $ = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : Math.max(r * 1.6, In(e, r));
  return M`
    <g class=${w} data-id=${e.id} opacity=${m} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? M`<circle class="selection-ring" r=${$ + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${F}></circle>` : b}
      ${e.props.kind === "equipment" ? Op(e, n, o, a, p, f ? Ho : void 0) : M`<g transform=${`rotate(${a})`}>${Lp(
    e,
    r,
    y,
    p ? y : s.deviceFill,
    f ? Ho : void 0,
    p ? s.deviceFill : y,
    (d == null ? void 0 : d.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? zp(n.bindingStatus(e), n.scale, In(e, r)) : b}
      ${u ? Np(u, r, n) : b}
    </g>`;
}
function Bp(e, t, n, i, s) {
  const o = sl(e, t);
  if (o.length === 0) return b;
  const r = n.palette, a = t.invalid ? r.invalid : Un(t.props.kind) === "motion" ? r.motionCone : r.cone, l = i ? "0.5" : n.dim ? String(r.dimOpacity) : b, c = o.map(it).join("");
  return t.props.kind === "ceiling_light" ? M`<path class="pool" d=${c} fill="none" stroke=${a} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${F}></path>` : M`<path class=${s ? "cone live-active" : "cone"} d=${c} fill=${a} fill-opacity=${s ? "0.32" : "0.18"}
    fill-rule="evenodd" stroke=${a} stroke-opacity=${s ? "0.85" : "0.5"} stroke-width="1" opacity=${l}
    vector-effect=${F}></path>`;
}
function Fp(e, t, n, i) {
  const s = sl(e, t);
  let o = 0;
  for (const c of s) for (const u of c) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = qe * 3 / i.scale);
  const r = `live-glow-${t.id}`, a = i.palette.device, l = i.dim ? String(i.palette.dimOpacity) : b;
  return M`<g class="live-glow" opacity=${l}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${a} stop-opacity="0.35"></stop><stop offset="1" stop-color=${a} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? M`<path d=${s.map(it).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : M`<circle cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Up(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return b;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? Ti(e, i, t.scale) : null;
  if (!s) return b;
  const o = t.palette.selection;
  return M`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : b}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${F}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${F} style="cursor:grab"></circle>
  </g>`;
}
function jp(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Ap, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return M`
    <g class="cones">${n.map((i) => {
    var a;
    const s = i.preview || (a = t.live) == null ? void 0 : a.call(t, i.d), o = i.d.props.kind, r = (s == null ? void 0 : s.look) === "on" && (o === "ceiling_light" || o === "wall_light") ? Fp(e, i.d, i.pose, t) : b;
    return M`${r}${t.showCones ? Bp(e, i.d, t, i.preview, (s == null ? void 0 : s.look) === "active") : b}`;
  })}</g>
    <g class="devices">${n.map((i) => Rp(i.d, i.pose, t, i.preview))}</g>
    ${Up(e, t)}
    ${t.bubbles ? M`<g class="bubbles">${n.map((i) => i.preview ? b : Hp(i.d, i.pose, t))}</g>` : b}`;
}
const Uo = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Es = (e) => Uo[e % Uo.length], qt = "non-scaling-stroke", Wp = "0.55", qp = /* @__PURE__ */ new WeakMap();
function Zp(e, t, n, i) {
  const s = i.palette, o = Es(n), r = i.selectedId === t.id, a = ft(qp, e, $a).get(t.id), l = 12 / i.scale;
  return M`
    <g class="zone-item" data-id=${t.id}>
      <path class=${`zone${t.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${t.id}
        d=${it(st(e, t))} fill=${t.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${t.invalid ? b : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${qt}
        opacity=${i.selectedId !== null && !r ? Wp : b}></path>
      ${a ? M`<text class="zone-label" x=${a.x} y=${a.y} text-anchor="middle" font-size=${l} font-family="system-ui, sans-serif">
        <tspan x=${a.x} dy=${-0.2 * l} font-weight="600" fill=${t.invalid ? s.invalid : s.text}>${t.name}</tspan>
        <tspan x=${a.x} dy=${1.2 * l} font-size=${l * 0.9} fill=${s.zoneLabel}>${el(fs(e, t))}</tspan>
      </text>` : b}
    </g>`;
}
function Kp(e, t) {
  const n = t.palette, i = e.zones.map((o, r) => ({ z: o, i: r }));
  if (t.mode !== "plan")
    return M`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => M`
      <path class="zone" data-id=${o.id} d=${it(st(e, o))} fill="none" stroke=${Es(r)} stroke-width="1"
        vector-effect=${qt}></path>`)}</g>`;
  const s = 8 / t.scale;
  return M`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Zp(e, o, r, t))}</g>`;
}
function Gp(e, t, n) {
  const i = n.palette, s = 14 / n.scale;
  return M`<g class="zone-members">${va(e, t).map(({ device: o, participates: r }) => {
    const a = Q(e, o);
    return a ? r ? M`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${qt}></circle>` : M`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${qt}></circle>` : b;
  })}</g>`;
}
function Xp(e, t, n) {
  if (t.shape.kind !== "polygon") return b;
  const i = n.palette, s = t.shape.vertices;
  return M`${st(e, t).map((o, r) => {
    const a = s[r], l = a.kind === "free" && a.lost === !0, c = n.vertex === r;
    return M`<circle class=${`zone-vertex${l ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${l ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${qt}></circle>`;
  })}`;
}
function Yp(e, t) {
  const n = e.cursor ? [...e.points, e.cursor] : e.points;
  return M`<polyline class=${`zone-draft${e.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${e.invalid ? t.palette.invalid : t.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${qt}></polyline>`;
}
function Qp(e, t) {
  const n = t.selectedId === null ? void 0 : e.zones.find((i) => i.id === t.selectedId);
  return M`<g class="zone-overlay">
    ${n ? M`<path class="zone-outline" data-id=${n.id} d=${it(st(e, n))} fill="none"
      stroke=${t.palette.selection} stroke-width="2.5" vector-effect=${qt}></path>` : b}
    ${n ? Gp(e, n.id, t) : b}
    ${n ? Xp(e, n, t) : b}
    ${t.draft ? Yp(t.draft, t) : b}</g>`;
}
function jt(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
const Jp = /* @__PURE__ */ new WeakMap(), tf = /* @__PURE__ */ new WeakMap(), ol = /* @__PURE__ */ new WeakMap();
function ei(e, t, n) {
  const i = X(e.dir), s = z(e.a, E(e.dir, t)), o = z(e.a, E(e.dir, n));
  return [z(s, E(i, e.leftOff)), z(o, E(i, e.leftOff)), I(o, E(i, e.rightOff)), I(s, E(i, e.rightOff))];
}
function Re(e, t) {
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
function ef(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = Re(e, a.id);
    if (!l) continue;
    const c = X(l.dir);
    for (const [u, d, p] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const f = e.nodes.find((x) => x.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const g = z(d, E(c, l.leftOff + i)), y = I(d, E(c, l.rightOff + i)), w = E(c, 1), m = E(z(g, y), 0.5), $ = z(I(m, E(w, -o)), E(p, s / 2)), k = I(I(m, E(w, o)), E(p, s / 2)), _ = [g, $, k, y];
      r.push(M`<path class="wall-break" d=${`M${_.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${W}></path>`);
    }
  }
  return r.length ? M`${r}` : b;
}
function nf(e, t, n) {
  const i = X(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], c = z(z(e.a, E(e.dir, a)), E(o, r)), u = z(z(e.a, E(e.dir, l)), E(o, r)), d = z(c, E(o, t.width)), p = et(I(d, c), I(u, c)) > 0 ? 1 : 0;
  return M`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>
    <path d=${`M${d.x} ${d.y}A${t.width} ${t.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${W}></path>`;
}
function sf(e, t, n) {
  const i = X(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = z(z(e.a, E(e.dir, t.offset)), E(i, r)), l = z(z(e.a, E(e.dir, t.offset + t.width)), E(i, r));
    return M`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>`;
  });
  return M`${o}`;
}
function of(e, t, n) {
  const i = Re(e, t.wallId);
  if (!i) return b;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = ei(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return M`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${it(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? nf(i, t, o) : t.kind === "window" ? sf(i, t, o) : b}
    </g>`;
}
function jo(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = z(e, E(n, i)), l = z(t, E(n, i)), c = (d, p) => {
    const f = z(p, E(n, i + r));
    return M`<line x1=${d.x} y1=${d.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${W}></line>`;
  }, u = z(E(z(a, l), 0.5), E(n, 9 / s.scale));
  return M`
    <g class="dim">
      ${c(z(e, E(n, 2 / s.scale)), e)}${c(z(t, E(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${W}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${jt(L(e, t))}</text>
    </g>`;
}
function rf(e, t) {
  const n = t.selection;
  if (!n) return b;
  const i = t.palette, s = 4 / t.scale, o = (r) => M`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : b;
  }
  if (n.kind === "wall") {
    const r = ft(ol, e, Rn).get(n.id), a = Re(e, n.id);
    if (!r || !a) return b;
    const l = X(a.dir);
    return M`
      <path d=${it(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${W}></path>
      ${o(a.a)}${o(a.b)}
      ${jo(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((p) => p.id === n.id), a = r ? Re(e, r.wallId) : null;
    if (!r || !a) return b;
    const l = E(X(a.dir), -1), c = a.rightOff + 18 / t.scale, u = (p) => z(a.a, E(a.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return M`
      <path d=${it(ei(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${W}></path>
      ${d.filter(([p, f]) => f - p >= 1).map(([p, f]) => jo(u(p), u(f), l, c, t))}`;
  }
  return b;
}
function af(e, t, n) {
  return L(e, t) < 1e-6 ? null : ei(Br(e, t, n.thickness, n.baseline), 0, L(e, t));
}
function lf(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? Re(e, r.wallId) : null;
  return M`
    ${o ? M`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${W}></path>` : b}
    ${(n.walls ?? []).map((l) => {
    const c = af(l.a, l.b, l.props);
    return M`<g class="preview-wall">
        ${c ? M`<path d=${it(c)} fill=${i.selection} fill-opacity="0.35"></path>` : b}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${W}></line></g>`;
  })}
    ${r && a ? M`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${it(ei(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : b}
    ${df(e, t)}`;
}
function cf(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return M`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${W}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${W}></rect></g>`;
}
function df(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? cf(n.anchor, t) : b, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / t.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = b;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    u = M`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${a - f} y=${l - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${W}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), g = `M${a} ${l - f}L${a + f * 0.866} ${l + f / 2}L${a - f * 0.866} ${l + f / 2}Z`;
    u = M`<g class="snap-mid"><path d=${g} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${W}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), g = `M${a} ${l - f}L${a + f} ${l}L${a} ${l + f}L${a - f} ${l}Z`;
    u = M`<g class="snap-zone-vertex"><path d=${g} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${W}></path><path d=${g} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${W}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), g = `M${a - f} ${l - f}L${a + f} ${l + f}M${a - f} ${l + f}L${a + f} ${l - f}`;
    u = M`<g class="snap-wall">
      <path d=${g} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${W}></path></g>`;
    const y = o.endpoint.kind === "wall" ? ft(ol, e, Rn).get(o.endpoint.wallId) : void 0;
    y && (d = M`<path class="snap-wall-hl" d=${it(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${W}></path>`);
  } else {
    const f = r(4), g = `M${a - f} ${l}H${a + f}M${a} ${l - f}V${l + f}`;
    u = M`<g class="snap-grid">
      <path d=${g} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${W}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return M`
    ${d}${s}${u}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${W} font-family="system-ui, sans-serif">${p}</text>`;
}
function uf(e, t) {
  var p;
  const n = t.preview.level ?? e, i = t.palette, s = ft(Jp, n, (f) => Wr(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? ft(tf, n, ls) : null, a = t.selection, l = (t.mode ?? "plan") === "plan", c = l ? b : String(i.dimOpacity), u = (a == null ? void 0 : a.kind) === "zone" ? a.id : null, d = t.mode ?? "plan";
  return M`
    ${Kp(n, { palette: i, scale: t.scale, selectedId: u, mode: d })}
    <path class="walls" d=${s.map((f) => f.map(it).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? M`<g class="railings" opacity=${c}>${o.flatMap((f) => (r.get(f.id) ?? []).map((g) => M`<path d=${it(g)} fill=${i.railing}></path>`))}</g>` : b}
    <g class="openings" opacity=${c}>${n.openings.map((f) => of(n, f, t))}</g>
    <g class="wall-breaks" opacity=${c}>${ef(n, t)}</g>
    ${l ? Qp(n, {
    palette: i,
    scale: t.scale,
    selectedId: u,
    draft: t.preview.zoneDraft,
    vertex: ((p = t.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? t.preview.zoneVertex.index : null
  }) : b}
    <g class="devices-layer">${l ? b : jp(n, {
    palette: i,
    scale: t.scale,
    selection: a,
    showCones: t.showCones ?? !0,
    dim: !1,
    preview: t.preview.device,
    ...d === "binding" ? { bindingStatus: t.bindingStatus, containerState: t.containerState, live: t.live, bubbles: t.bubbles } : {}
  })}</g>
    <g class="selection">${rf(n, t)}</g>
    <g class="preview">${lf(n, t)}</g>`;
}
const dt = "non-scaling-stroke", Be = "system-ui, sans-serif", pf = 13, Me = 9, ff = 11, Wo = 18, yi = 12, vi = 11, Je = 13, hf = 3, pn = 10, qo = 4.5, mf = 12, gf = 11.5, Is = 10, $i = 10.5, wf = 6, bf = {
  IN: ap,
  OUT: Ja,
  BAT: lp,
  PV: tl
}, Zo = { dead: 0, nodata: 1, idle: 2, live: 3 };
function te(e) {
  if (e == null || !Number.isFinite(e)) return "—";
  const t = Math.round(e);
  if (t === 0) return "0 W";
  const n = e < 0 ? "−" : "";
  return Math.abs(t) < 1e3 ? `${n}${Math.abs(t)} W` : `${n}${(Math.abs(e) / 1e3).toFixed(2)} kW`;
}
const xi = (e, t) => e == null || !Number.isFinite(e) ? "—" : `${Math.round(e)} ${t}`;
function yf(e) {
  return e ? e.state === "dead" ? "dead" : e.power === null ? "nodata" : Math.abs(e.power) >= 1 ? "live" : "idle" : "nodata";
}
function Ze(e, t) {
  return { live: t.powerLive, idle: t.powerIdle, dead: t.powerDead, nodata: t.powerNoData }[e];
}
const vf = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, $f = M`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, rl = (e, t, n, i) => M`<path class=${e} d=${t} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${dt}>${i ? b : $f}</path>`, al = (e) => `M${e.map((t) => `${t.x} ${t.y}`).join("L")}`, le = (e, t, n, i) => M`<path d=${e} fill=${i} transform=${`translate(${t.x - n / 2} ${t.y - n / 2}) scale(${n / 24})`}></path>`;
function xf(e, t) {
  var c;
  const n = (c = e.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? We : Me, s = e.pts[0], o = e.pts[e.pts.length - 1], r = pn / 2 / t.scale, a = 3 / t.scale, l = e.pts.slice(1).map((u, d) => ({ p: e.pts[d], q: u, len: Math.abs(u.x - e.pts[d].x) + Math.abs(u.y - e.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of l) {
    if (p < 2 * r + 2 * a) continue;
    const f = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, g = (w, m) => Math.hypot(f.x - w.x, f.y - w.y) >= m + r + a;
    if (!g(s, i(e.w.from)) || !g(o, i(e.w.to))) continue;
    const y = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((y + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function kf(e, t, n) {
  var c;
  const i = t.palette, s = Ze(e.style, i), o = al(e.pts), r = ((c = t.selection) == null ? void 0 : c.kind) === "powerWire" && t.selection.id === e.w.id, a = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[e.style], l = xf(e, t);
  return M`<g data-wire=${e.w.id}>
    ${r ? M`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${dt}></path>` : b}
    ${e.style === "live" ? rl("glow", o, s, n) : b}
    <path class=${`wire ${e.style}`} d=${o} fill="none" stroke=${s} stroke-width=${a}
      stroke-dasharray=${e.style === "nodata" ? "5 4" : b} stroke-linejoin="round" vector-effect=${dt}></path>
    ${l ? M`<path class="arrow" d=${`M${pn / 2} 0L${-pn / 2} ${-qo}L${-pn / 2} ${qo}Z`}
      fill=${s} transform=${`translate(${l.at.x} ${l.at.y}) rotate(${l.deg}) scale(${1 / t.scale})`}></path>` : b}
  </g>`;
}
function Mf(e, t, n) {
  const i = bf[e.name];
  return M`<g class="port" data-port=${e.name}>
    <title>${e.name}</title>
    <circle cx=${e.pt.x} cy=${e.pt.y} r=${We} fill=${n.portFill}
      stroke=${t ? Ze(t, n) : n.blockStroke} stroke-width="1.5" vector-effect=${dt}></circle>
    ${i ? le(i, e.pt, pf, n.portIcon) : M`<text x=${e.pt.x} y=${e.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Be}>${e.name}</text>`}
  </g>`;
}
function _f(e, t) {
  const n = Math.max(4, Math.floor(t / (Is * 0.55)));
  return e.length <= n ? e : `${e.slice(0, n - 1)}…`;
}
function Sf(e, t, n, i) {
  const s = t.map((a) => {
    const l = e.blocks.find((c) => c.id === a);
    return l ? Yn(l, n) || h(`power.kind.${l.kind}`) : a;
  }), o = h("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", _f(s[0], i - 12 - o.replace("{name}", "").length * Is * 0.55)) : h("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function Af(e, t, n, i, s, o) {
  var l;
  const r = () => ({ kind: "text", value: te(i == null ? void 0 : i.power) }), a = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (t.kind) {
    case "grid":
      return t.voltage ? [r(), { kind: "text", value: xi(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(t.deviceId);
      if (!c) return [{ kind: "text", value: h("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = ue(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: h("power.in"), value: te(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: h("power.out"), value: te(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: xi(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(a(ia(c))), d && p.push({ kind: "text", label: h("power.loss"), value: te(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: xi(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: s.blockInvalid }] : (l = i == null ? void 0 : i.absorbed) != null && l.length ? [r(), Sf(e, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function Ef(e, t, n) {
  const i = e.state ?? "unknown", s = e.controllable ? 0 : yi + 3, o = t.x - s / 2, r = `${h(`power.switch.${i}`)}${e.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return M`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : b}>
    <title>${r}</title>
    ${le(
    i === "on" ? Ju : Qu,
    { x: o, y: t.y },
    Wo,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${e.controllable ? b : le(sp, { x: o + Wo / 2 + 3 + yi / 2, y: t.y + 1 }, yi, n.blockValue)}
  </g>`;
}
function Ko(e, t, n) {
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
function If(e, t, n) {
  const i = 2 * (e.w + e.h), s = Ko(e, t.side, t.pt), o = ((Ko(e, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, a = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: e.x, y: e.y } },
    { t: e.w, pt: { x: e.x + e.w, y: e.y } },
    { t: e.w + e.h, pt: { x: e.x + e.w, y: e.y + e.h } },
    { t: 2 * e.w + e.h, pt: { x: e.x, y: e.y + e.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < a).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [t.pt, ...c, n.pt];
}
function Pf(e, t, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return b;
  const a = Qn(e, t, i.geo), l = a.find((f) => f.name === r), c = a.find((f) => f.name === (t.form === "2in1out" ? "OUT" : "IN"));
  if (!l || !c) return b;
  const u = s(c.name) ?? "nodata", d = Ze(u, i.palette), p = al(If(ht(t, i.geo, e), l, c));
  return M`${u === "live" ? rl("ts-glow", p, d, o) : b}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : b}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${dt}></path>`;
}
function Cf(e, t, n, i) {
  const s = i.palette;
  return Ga(t, i.geo, e).map(({ position: o, rect: r }) => {
    const a = (n == null ? void 0 : n.position) === o;
    return M`<g class=${a ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${a ? s.accent : "none"}
        stroke=${a ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${dt}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${a ? s.accentText : s.blockValue} font-family=${Be}>${o}</text>
    </g>`;
  });
}
function Lf(e) {
  const t = /^unavailable:(.*)$/.exec(e);
  return t ? h("power.alert.unavailable").replace("{entity}", t[1]) : e === "missing-device" ? h("power.alert.missingDevice") : e === "disagree" ? h("power.alert.disagree") : e;
}
function Of(e, t, n, i) {
  const s = hf + Je / 2, o = [
    { x: t.x + t.w - s, y: t.y + s },
    { x: t.x + t.w - s, y: t.y + t.h - s },
    { x: t.x + s, y: t.y + t.h - s },
    { x: t.x + s, y: t.y + s }
  ], r = (l) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - l.x) - Je / 2, 0), d = Math.max(Math.abs(c.y - l.y) - Je / 2, 0);
    return Math.hypot(u, d) > We;
  }), a = o.find(r) ?? o[0];
  return M`<g class="alert"><title>${e.map(Lf).join(`
`)}</title>
    ${le(Qa, a, Je, i.blockInvalid)}</g>`;
}
function zf(e, t, n, i, s) {
  var y, w;
  const o = n.palette, r = ht(t, n.geo, e), a = (y = n.frame) == null ? void 0 : y.blocks[t.id], l = t.kind === "device" ? n.geo.device(t.deviceId) : void 0, c = t.kind === "device" && !l, u = r.x + r.w / 2, d = Yn(t, n.geo) || h(`power.kind.${t.kind}`), p = Af(e, t, n.geo, a, o, r.w), f = t.kind === "remainder", g = Qn(e, t, n.geo);
  return M`<g class=${`block block-${t.kind}${c ? " missing" : ""}`} data-id=${t.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : b} vector-effect=${dt}></rect>
    ${t.kind === "transfer" ? Pf(e, t, a, n, (m) => i(t.id, m), s) : b}
    ${l && l.placement.mode !== "none" ? M`<g class="pin"><title>${h("power.planDevice")}</title>
      ${le(op, { x: r.x + 4 + vi / 2, y: r.y + 4 + vi / 2 }, vi, o.blockValue)}</g>` : b}
    <text class="name" x=${u} y=${r.y + Sn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${mf} font-weight="600" fill=${o.blockName} font-family=${Be}>${d}</text>
    ${p.map((m, $) => {
    const k = r.y + Sn + $ * _n + _n / 2;
    if (m.kind === "chips") return t.kind === "transfer" ? Cf(e, t, a, n) : b;
    if (m.kind === "switch") return Ef(m, { x: u, y: k }, o);
    const _ = m.fill ?? o.blockValue, x = m.label ? M`<tspan>${m.label} </tspan>` : b, A = m.note ? M`<tspan> ${m.note}</tspan>` : b;
    return M`<text x=${u} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${m.small ? Is : gf}
        fill=${_} font-family=${Be}>${m.title ? M`<title>${m.title}</title>` : b}${x}<tspan
        font-weight=${m.small ? b : "600"}>${m.value}</tspan>${A}</text>`;
  })}
    ${(w = a == null ? void 0 : a.alert) != null && w.length ? Of(a.alert, r, g, o) : b}
    ${g.map((m) => Mf(m, i(t.id, m.name), o))}
  </g>`;
}
function Nf(e, t, n, i) {
  const s = i.palette, o = e.w >= e.h, r = o ? e.x : e.y, a = r + (o ? e.w : e.h), l = o ? e.h : e.w;
  let c = b;
  const u = e.name ?? "", d = Math.min($i, l - 4), p = d >= wf, f = u.length * (p ? d : $i) * 0.58 + 12;
  if (u) {
    const g = t.map((m) => o ? m.x : m.y).sort((m, $) => m - $);
    let y = { lo: 0, hi: -1 }, w = r;
    for (const m of [...g, a + Me]) {
      const $ = Math.min(m - Me, a);
      $ - w > y.hi - y.lo && (y = { lo: w, hi: $ }), w = Math.max(w, m + Me);
    }
    if (y.hi - y.lo >= f) {
      const m = (y.lo + y.hi) / 2, $ = o ? { x: m, y: p ? e.y + e.h / 2 : e.y - 7 } : { x: p ? e.x + e.w / 2 : e.x - 7, y: m };
      c = M`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : $i} fill=${s.blockValue} font-family=${Be}
        transform=${o ? b : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return M`<g class="block block-bus" data-id=${e.id}>
    <rect class="body" x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="2" fill=${s.blockFill}
      stroke=${n ? Ze(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${dt}></rect>
    ${c}
  </g>`;
}
function Vf(e, t, n) {
  return M`<g class="terminal">
    <circle cx=${e.x} cy=${e.y} r=${Me} fill=${n.portFill} stroke=${Ze(t, n)} stroke-width="1.5"
      vector-effect=${dt}></circle>
    ${le(Gu, e, ff, n.portIcon)}
  </g>`;
}
function Df(e, t) {
  const n = t.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return b;
  const i = e.blocks.find((r) => r.id === n.id);
  if (!i) return b;
  const s = ht(i, t.geo, e), o = 4 / t.scale;
  return M`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${t.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${dt}></rect>`;
}
function Tf(e, t) {
  var p;
  const n = t.preview.power ?? e, i = t.palette, s = [];
  for (const f of n.wires) {
    const g = Za(n, f, t.geo);
    if (!g) continue;
    const y = (p = t.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: g.a, b: g.b, pts: Ka(g.a, g.b), live: y, style: yf(y) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = [];
  for (const f of s)
    for (const [g, y] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in g) {
        o.set(`${g.block}:${g.port}`, f.style);
        continue;
      }
      const w = r.get(g.bus);
      (w === void 0 || Zo[f.style] > Zo[w]) && r.set(g.bus, f.style), a.set(g.bus, [...a.get(g.bus) ?? [], y.pt]), l.push({ at: y.pt, style: f.style });
    }
  const c = (f, g) => o.get(`${f}:${g}`), u = vf(), d = t.preview.wireDraft;
  return M`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? Nf(f, a.get(f.id) ?? [], r.get(f.id), t) : b)}</g>
    <g class="wires">${s.map((f) => kf(f, t, u))}</g>
    ${Df(n, t)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? b : zf(n, f, t, c, u))}</g>
    <g class="terminals">${l.map((f) => Vf(f.at, f.style, i))}</g>
    ${d ? M`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${dt}></line>` : b}
  </g>`;
}
const Hf = {
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
}, Rf = {
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
function Bf(e) {
  return e ? Hf : Rf;
}
class Ff extends ti {
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
const Z = Jn(Ff), Fi = 1, Go = 1e-6;
function Uf(e, t, n, i, s) {
  const o = (l) => l > Go && l < s - Go, r = new Set(e.nodes.filter((l) => {
    var c;
    return ((c = l.host) == null ? void 0 : c.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const c = Hn(e, l).host.offset;
    o(c) && a.push({ t: c, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((y) => y === t.a || y === t.b || r.has(y))) continue;
    const c = q(e, l.a), u = q(e, l.b), d = L(c, u), p = d === 0 ? null : pt(n, i, c, I(u, c));
    if (!p) continue;
    const f = Tn(p, c, u) * d;
    if (f < -Fi || f > d + Fi) continue;
    const g = H(I(p, n), i);
    o(g) && a.push({ t: g, wall: l, pt: p });
  }
  return a;
}
function Xo(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Yo(e, t) {
  if ("nodeId" in t)
    return delete Hn(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (L(q(e, o), t.pt) <= Fi) return o;
  const { pt: n, offset: i } = qn(e, t.wall, t.pt), s = { id: K(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function jf(e, t, n) {
  const i = e.walls.find((m) => m.id === t);
  if (!i) return e;
  const s = q(e, i.a), o = q(e, i.b), r = L(s, o), a = Dn(I(o, s)), l = H(I(n, s), a), c = Uf(e, i, s, a, r), u = Xo(c.filter((m) => m.t < l), l), d = Xo(c.filter((m) => m.t > l), l);
  if (!u && !d) return xs(e, t);
  const p = gt(e), f = p.walls.find((m) => m.id === t);
  let g = t, y = 0;
  if (d) {
    const m = Yo(p, d);
    if (y = H(I(q(p, m), s), a), u) {
      const $ = { ...f, id: K(), a: m };
      p.walls.push($), g = $.id;
    } else
      f.a = m;
  }
  u && (f.b = Yo(p, u));
  const w = (m, $) => m.wallId !== t || u && $ <= u.t ? !0 : !d || $ < d.t ? !1 : (m.wallId = g, m.offset -= y, !0);
  p.openings = p.openings.filter((m) => w(m, m.offset + m.width / 2)), p.devices = p.devices.filter((m) => m.placement.mode !== "wall" || w(m.placement, m.placement.offset));
  for (const m of p.nodes) m.host && !w(m.host, m.host.offset) && delete m.host;
  for (const m of p.zones) {
    const $ = m.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((k) => k.kind !== "wall" || w(k, k.offset) ? k : ms(k)));
  }
  return Zn(p), St(p, e);
}
function Ps(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Wf(e, t, n) {
  return z(e, E(Dn(I(t, e)), n));
}
function tn(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Zt(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? Ps(r, t) : t, c = r !== void 0 && l.y === r.y, u = (x) => !r || Math.abs(c ? x.y - r.y : x.x - r.x) <= 1;
  let d = null;
  for (const x of e.nodes) {
    if (a.has(x.id)) continue;
    const A = { x: x.x, y: x.y }, P = L(A, l);
    P <= i && u(A) && (!d || P < d.d) && (d = { id: x.id, pt: A, d: P });
  }
  let p = null;
  for (const x of n.corners ?? []) {
    const A = L(x.pt, l);
    A <= i && u(x.pt) && (!p || A < p.d) && (p = { c: x, d: A });
  }
  if (p && (!d || p.d < d.d)) {
    const x = p.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: p.c };
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const f = e.walls.filter((x) => !a.has(x.a) && !a.has(x.b)).map((x) => ({ w: x, f: J(e, x) })).filter((x) => x.f.len > 1e-9);
  let g = null;
  for (const { w: x, f: A } of f) {
    const P = { x: (A.a.x + A.b.x) / 2, y: (A.a.y + A.b.y) / 2 }, O = L(P, l);
    O <= i && u(P) && (!g || O < g.d) && (g = { wallId: x.id, pt: P, offset: A.len / 2, d: O });
  }
  if (g)
    return { pt: g.pt, kind: "mid", endpoint: { kind: "wall", wallId: g.wallId, offset: g.offset } };
  const y = (x) => {
    let A = null;
    for (const { w: P, f: O } of f) {
      const V = X(O.dir), U = x ? [O.leftOff, -O.rightOff].filter((N) => N !== 0) : [0];
      for (const N of U) {
        const D = z(O.a, E(V, N)), j = r ? pt(r, I(l, r), D, O.dir) : z(D, E(O.dir, H(I(l, D), O.dir)));
        if (!j) continue;
        const ot = H(I(j, D), O.dir);
        if (ot < 0 || ot > O.len) continue;
        const wt = L(j, l);
        wt <= i && (!A || wt < A.d) && (A = { d: wt, res: { pt: j, kind: "wall", endpoint: { kind: "wall", wallId: P.id, offset: ot } } });
      }
    }
    return A ? A.res : null;
  }, w = y(!1);
  if (w) return w;
  const m = y(!0);
  if (m) return m;
  const $ = n.zones ?? [];
  let k = null;
  for (const x of $)
    for (const A of x) {
      const P = L(A, l);
      P <= i && u(A) && (!k || P < k.d) && (k = { pt: A, d: P });
    }
  if (k) return tn(k.pt, "zoneVertex");
  let _ = null;
  for (const x of $)
    for (let A = 0; A < x.length; A++) {
      const P = x[A], O = x[(A + 1) % x.length], V = L(P, O);
      if (V < 1e-9) continue;
      const U = E(I(O, P), 1 / V), N = r ? pt(r, I(l, r), P, U) : z(P, E(U, H(I(l, P), U)));
      if (!N) continue;
      const D = H(I(N, P), U);
      if (D < 0 || D > V) continue;
      const j = L(N, l);
      j <= i && (!_ || j < _.d) && (_ = { pt: N, d: j });
    }
  if (_) return tn(_.pt, "zoneEdge");
  if (s && s > 0) {
    const x = (P) => Math.round(P / s) * s, A = r ? c ? { x: x(l.x), y: r.y } : { x: r.x, y: x(l.y) } : { x: x(l.x), y: x(l.y) };
    return tn(A, "grid");
  }
  return tn(l, "none");
}
function qf(e, t, n) {
  return t.some((i, s) => xt(e, i, t[(s + 1) % t.length]) <= n);
}
function Cs(e, t, n) {
  const i = Rn(e);
  for (const [s, o] of i) if (oe(t, o)) return s;
  for (const [s, o] of i) if (qf(t, o, n)) return s;
  return null;
}
function Zf(e, t) {
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
function Kf(e, t, n, i) {
  const s = Zf(e, t);
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
const ni = 3, Gf = (e, t) => e.zones.filter((n) => n.id !== t).map((n) => st(e, n)).filter((n) => n.length >= 3);
function ll(e, t, n, i, s) {
  if (n.alt) {
    const a = n.shift && i ? Ps(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: a.x, y: a.y }, snap: null };
  }
  const o = Zt(t, n.pt, { tolMm: e.tolMm(), grid: e.grid(), from: i, ortho: n.shift, zones: Gf(t, s), corners: Fr(t) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const a = o.corner, l = Gt(t, a.wallId), c = l !== null && a.offset >= -kn && a.offset <= l + kn, u = c ? Math.max(0, Math.min(l, a.offset)) : a.offset, d = c ? ze(t, a.wallId, a.side, u) : null;
    if (d) return { vertex: { kind: "wall", wallId: a.wallId, offset: u, side: a.side, x: d.x, y: d.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const a = t.walls.find((l) => l.id === r.wallId);
    if (a) {
      const l = Dt(J(t, a), n.pt).side >= 0 ? "left" : "right", c = ze(t, a.id, l, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: a.id, offset: r.offset, side: l, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Xf(e, t, n) {
  const i = [];
  for (const s of e.zones) {
    const o = st(e, s);
    if (o.length < 3) continue;
    (o.some((a, l) => xt(t, a, o[(l + 1) % o.length]) <= n) || jn(o, t)) && i.push({ id: s.id, area: Math.abs(kt(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function cl(e, t) {
  const n = e.zones.find((i) => i.id === t);
  return n && n.shape.kind === "polygon" ? { o: st(e, n), v: n.shape.vertices } : null;
}
function Yf(e, t, n, i) {
  var r;
  const s = (r = cl(e, t)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((a, l) => {
    L(n, a) <= i && (o < 0 || L(n, a) < L(n, s[o])) && (o = l);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Qf(e, t, n, i) {
  const s = cl(e, t);
  if (!s || s.o.some((w) => L(n, w) <= i)) return null;
  const { o, v: r } = s;
  let a = -1, l = 1 / 0;
  if (o.forEach((w, m) => {
    const $ = xt(n, w, o[(m + 1) % o.length]);
    $ <= i && $ < l && (a = m, l = $);
  }), a < 0) return null;
  const c = o[a], u = o[(a + 1) % o.length], d = Math.max(0, Math.min(1, Tn(n, c, u))), p = Dr(c, u, d), f = r[a], g = r[(a + 1) % r.length], y = f.kind === "wall" && g.kind === "wall" && f.wallId === g.wallId && f.side === g.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + d * (g.offset - f.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: a + 1, vertex: y };
}
function Jf(e, t) {
  let n = null, i = null, s = null, o = null, r = null, a = !1, l = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const w = e.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, a = !1, l = !1;
  }, g = () => u && u.zoneId === p() ? u : null;
  function y(w) {
    if (!i || !s || !l && L(w.pt, c) <= ni / e.scale()) return;
    l = !0;
    const m = ll(e, s, w, i.from, i.zoneId);
    r = m.snap, a = w.shift, o = Fd(s, i.zoneId, i.index, m.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, e.selection()];
    },
    press(w) {
      f(), u = null, c = w.pt;
      const m = p(), $ = e.level(), k = m === null ? null : Yf($, m, w.pt, e.tolMm());
      return m === null || !k ? !1 : (i = { zoneId: m, ...k }, s = o = $, !0);
    },
    pick(w) {
      const m = Xf(e.level(), w, e.tolMm());
      if (m.length === 0) {
        n = null, t(null);
        return;
      }
      const $ = p(), k = $ !== null && n !== null && L(w, n) <= e.tolMm() ? m.indexOf($) : -1;
      n = w, t({ kind: "zone", id: m[(k + 1) % m.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(w) {
      y(w);
    },
    up(w) {
      if (!i) return;
      y(w);
      const m = o, $ = s, k = l, _ = i;
      f(), k ? m && $ && m !== $ && e.commit(m) : u = { zoneId: _.zoneId, index: _.index };
    },
    dblclick(w) {
      const m = d[0];
      if ((m == null ? void 0 : m.kind) !== "zone") return;
      const $ = e.level(), k = Qf($, m.id, w.pt, e.tolMm());
      if (!k) return;
      const _ = Ud($, m.id, k.index, k.vertex);
      _ !== $ && (e.commit(_), t(m), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const m = g();
      if (w === "Escape" && m)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && m) {
        const $ = e.level(), k = jd($, m.zoneId, m.index);
        return k === $ ? (e.notify(h("zones.minVertices")), !0) : (u = null, e.commit(k), !0);
      }
      return !1;
    },
    preview() {
      if (i && o) {
        const m = { level: o };
        return r && (m.snap = r), a && (m.orthoFrom = i.from), m;
      }
      const w = g();
      return w ? { zoneVertex: w } : {};
    },
    cancel() {
      f(), u = null, n = null;
    }
  };
}
function th(e) {
  let t = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const a = (f) => {
    e.select(f);
  }, l = () => {
    t = null, n = null, i = null, r = null, s = !1;
  }, c = Jf(e, a), u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, d = (f, g, y) => Dt(J(f, f.walls.find((w) => w.id === g)), y).t;
  function p(f) {
    const g = t;
    if (!(!g || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, g.kind === "node") {
        const y = Zt(n, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: g.origin,
          ortho: f.shift,
          excludeNodeIds: [g.nodeId]
        }), w = y.endpoint, m = (y.kind === "wall" || y.kind === "mid") && w.kind === "wall", $ = y.kind === "node" && w.kind === "node" && w.nodeId !== g.nodeId, k = n.nodes.find((P) => P.id === g.nodeId), _ = !!k.host && m && w.kind === "wall" && w.wallId === k.host.wallId;
        let x = n;
        if (k.host && !_) {
          const P = structuredClone(n);
          delete P.nodes.find((O) => O.id === g.nodeId).host, x = P;
        }
        let A = Xd(x, g.nodeId, u(y));
        if ($ && w.kind === "node")
          A = tu(A, g.nodeId, w.nodeId);
        else if (m && w.kind === "wall" && !_) {
          const P = n.walls.find((O) => O.id === w.wallId);
          if (P && P.a !== g.nodeId && P.b !== g.nodeId) {
            const O = structuredClone(A);
            O.nodes.find((V) => V.id === g.nodeId).host = { wallId: w.wallId, offset: w.offset }, A = St(O, A);
          }
        }
        i = A;
      } else if (g.kind === "wall") {
        const y = n.walls.find(($) => $.id === g.wallId), w = Zt(n, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: g.origin,
          ortho: f.shift,
          excludeNodeIds: [y.a, y.b]
        }), m = I(w.pt, g.origin);
        i = Qd(
          n,
          g.wallId,
          w.kind === "none" ? { x: Math.round(m.x), y: Math.round(m.y) } : m
        );
      } else {
        const y = n.openings.find((w) => w.id === g.openingId);
        i = Qr(n, y.id, d(n, y.wallId, f.pt) - g.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      l(), o = f.pt, c.note();
      const g = e.level(), y = f.ctrl ? Cs(g, f.pt, e.tolMm()) : null;
      if (y) {
        a(null), e.commit(jf(g, y, f.pt));
        return;
      }
      if (c.press(f)) return;
      const w = e.selection(), m = Kf(g, f.pt, e.tolMm(), w);
      if (!m) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), a(m), r = n = i = g, m.kind === "node") {
        let $ = m.id;
        const k = (w == null ? void 0 : w.kind) === "wall" ? g.walls.find((_) => _.id === w.id) : void 0;
        if (f.alt && k) {
          const _ = Jd(g, k.id, k.a === m.id ? "a" : "b");
          n = i = _.level, $ = _.nodeId, a({ kind: "node", id: $ });
        }
        t = { kind: "node", nodeId: $, origin: q(n, $) };
      } else if (m.kind === "wall")
        t = { kind: "wall", wallId: m.id, origin: f.pt };
      else if (m.kind === "opening") {
        const $ = g.openings.find((k) => k.id === m.id);
        t = { kind: "opening", openingId: $.id, grab: d(g, $.wallId, f.pt) - $.offset };
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
      const g = s, y = i, w = r;
      l(), g && y && w && y !== w && e.commit(y);
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
function Fe(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function dl() {
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
function eh(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = dl(), s = () => {
    t = null, i.clear();
  }, o = (c) => Zt(e.level(), c, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const c = Fe(i.first, { min: 1 }), u = Fe(i.second, { min: 1 });
      return c === null || u === null ? null : { x: t.x + (n.x >= t.x ? c : -c), y: t.y + (n.y >= t.y ? u : -u) };
    }
    return o(n).pt;
  }
  const a = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function l(c) {
    if (!t || a(t, c)) return;
    const u = Gd(e.level(), t, c, e.wallProps(), e.boxMeasure());
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
      const d = e.wallProps(), p = Ca(t, c, d.thickness, e.boxMeasure());
      return p && (u.walls = p.map((f, g) => ({ a: f, b: p[(g + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Qo = (e) => Math.round(e * 1e3) / 1e3 + 0;
function nh(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = dl(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, c = (p, f) => Zt(e.level(), p, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), f = Fe(a.first, { min: 1 }), g = Fe(a.second);
    if (f === null && g === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const y = f ?? L(n, p.pt);
    let w = p.pt;
    if (g === null && L(n, p.pt) < 1) {
      const _ = r ?? { x: 1, y: 0 };
      w = { x: n.x + _.x, y: n.y + _.y };
    }
    if (g !== null) {
      const _ = g * Math.PI / 180;
      w = { x: n.x + Math.cos(_), y: n.y - Math.sin(_) };
    }
    const m = Wf(n, w, y), $ = { x: Qo(m.x), y: Qo(m.y) }, k = e.level().nodes.find((_) => Math.hypot(_.x - $.x, _.y - $.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function d() {
    const p = u();
    if (!t || !p) return;
    const f = Kd(e.level(), t, p.endpoint, e.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    e.commit(f.level);
    const g = f.level.walls.find((k) => k.id === f.wallId);
    i === null && (i = g.a);
    const y = f.endNodeId === i, w = n, m = q(f.level, f.endNodeId), $ = L(w, m);
    if ($ > 0 && (r = { x: (m.x - w.x) / $, y: (m.y - w.y) / $ }), a.clear(), y) {
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
function ih(e, t) {
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
      const a = i(), l = ed(e.level(), r.wallId, t, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Bn(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Jo = 3, sh = 1, ut = (e) => ({ x: e.x, y: e.y });
function oh(e) {
  let t = [], n = null, i = !1, s = null, o = !1;
  const r = () => t.length ? ut(t[t.length - 1]) : void 0;
  function a(d) {
    const p = t.length;
    if (p === 0) return !1;
    const f = t.map(ut);
    if (L(f[p - 1], d) <= sh) return !0;
    if (p >= 2) {
      const g = I(f[p - 1], f[p - 2]), y = I(d, f[p - 1]);
      if (Math.abs(et(g, y)) <= 1e-9 * Math.hypot(g.x, g.y) * Math.hypot(y.x, y.y) && H(g, y) < 0) return !0;
    }
    for (let g = 0; g + 2 < p; g++) if (wa(f[p - 1], d, f[g], f[g + 1])) return !0;
    return !1;
  }
  function l(d) {
    if (t.length < Jo) return null;
    const p = e.tolMm(), f = ut(t[0]), g = ut(t[t.length - 1]);
    return L(d, f) <= p ? f : L(d, g) <= p ? g : null;
  }
  function c() {
    var f;
    if (t.length < Jo || Mn(t.map(ut))) return !1;
    const d = e.level(), p = Rd(d, t, e.zoneName());
    return p.zoneId === null ? !1 : (t = [], n = null, i = !1, e.commit(e.zoneAutomation() ? p.level : bs(p.level, p.zoneId, !1)), (f = e.zonePlaced) == null || f.call(e), e.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => ll(e, e.level(), d, r());
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
        n = p, s = null, i = Mn(t.map(ut));
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
function rh(e) {
  return e.zoneMethod() === "polygon" ? oh(e) : {
    id: "zone",
    down(t) {
      var i;
      const n = Hd(e.level(), t.pt, e.zoneName());
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
const tr = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function ul(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((u) => u.id === o), l = a ? Q(s, a) : null, c = a ? Ti(s, a, e.scale()) : null;
    return !l || !c ? 0 : pa($t(I(r, l.pt)) - $t(I(c.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && L(s.pt, t.downPt) <= ni / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((d) => d.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = ($t(I(s.pt, r.pt)) - t.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, u = _d(t.original, o, c, s.shift);
    t.work = JSON.stringify(u) === JSON.stringify(o.placement) ? t.original : $n(t.original, o.id, u);
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
      return t = null, o.moved && o.work !== o.original && tr(o.work, o.id) !== tr(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function er(e, t, n) {
  const i = J(e, e.walls.find((s) => s.id === t));
  return Dt(i, n).side > 0 ? "left" : "right";
}
function pl(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Ls(e, t = "free") {
  return e === "equipment" ? [t] : os[e];
}
function fl(e, t, n, i, s = 0, o = Ls(n)) {
  if (o.includes("wall")) {
    const r = Zt(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: er(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of t.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const u = J(t, c), d = Dt(u, i).side, p = Math.abs(Math.abs(d) - (d > 0 ? u.leftOff : u.rightOff));
        (!l || p < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : u.len, d: p });
      }
      if (l) return { mode: "wall", wallId: l.id, side: er(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...pl(e, i), rotation: s } : null;
}
function ah(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  if (!n) {
    const o = ds(Math.round($t(i.dir)));
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
    const a = Dt(r, i.pt), l = a.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(a.t))), u = ze(e, o.id, l, c), d = u ? L(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: l, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? us(e, t.props, s.placement, 0) : null;
}
function lh(e, t, n) {
  return ra(e.deviceDefaults(t), "free", n.mode);
}
function ch(e, t) {
  let n = null, i;
  const s = ul(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = Ls(t, e.wallMount() ? "wall" : "free"), l = fl(e, r, t, n, 0, a);
    if (!l)
      return { placement: { mode: "free", ...pl(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const c = lh(e, t, l), u = us(r, c, l, e.tolMm()), d = wo(r, c, u, "").deviceId !== null;
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
const nr = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, dh = (e, t, n) => n === void 0 || nr(e, n) !== nr(t, n);
function uh(e, t, n, i) {
  const s = t.placement;
  if (s.mode === "free" && n) return I(n, i);
  if (s.mode !== "wall" || t.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = ze(e, s.wallId, s.side, s.offset);
  return o ? I(o, i) : { x: 0, y: 0 };
}
function ph(e) {
  let t = null, n = null;
  const i = ul(e);
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
    const f = s.devices.find((x) => x.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const g = p.shift ? Ps(a, p.pt) : p.pt, y = f.placement, w = y.mode === "free" ? null : Q(s, f), m = y.mode === "free" ? y.rotation : w ? ds(Math.round($t(w.dir))) : 0, $ = z(g, n.grab), k = fl(e, s, f.props.kind, $, m, Ls(f.props.kind, y.mode)), _ = k && k.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...k, aim: y.aim } : k;
    o = _ ? $n(s, f.id, us(s, f.props, d(s, f.placement, _, g, $), e.tolMm())) : s;
  }
  function d(p, f, g, y, w) {
    if (f.mode !== "wall" || g.mode !== "wall" || g.wallId !== f.wallId) return g;
    const m = p.walls.find((P) => P.id === f.wallId);
    if (!m) return g;
    const $ = J(p, m), k = Math.max(0, Math.min($.len, f.offset + H(I(y, a), $.dir))), _ = Dt($, w).side, x = e.tolMm(), A = f.side === "left" ? _ < -($.rightOff + x) ? "right" : "left" : _ > $.leftOff + x ? "left" : "right";
    return { ...g, offset: k, side: A };
  }
  return {
    id: "device-select",
    down(p) {
      c(), a = p.pt;
      const f = e.level(), g = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, p)) return;
      const y = ma(f, p.pt, g);
      if (!y) {
        l(null);
        return;
      }
      l({ kind: "device", id: y });
      const w = f.devices.find(($) => $.id === y), m = Q(f, w);
      s = o = f, n = { id: y, grab: uh(f, w, (m == null ? void 0 : m.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, g = s, y = r, w = n == null ? void 0 : n.id;
      c(), y && f && g && f !== g && dh(g, f, w) && e.commit(f);
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
function fh(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = ma(e.level(), t.pt, e.tolMm());
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
const Ui = 40, hh = (e, t) => e.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === t.block && i.port === t.port));
function mh(e, t, n, i) {
  const s = e.blocks.find((f) => f.id === t);
  if ((s == null ? void 0 : s.kind) !== "bus") return e;
  const o = s.w >= s.h, r = o ? s.x : s.y, a = o ? s.w : s.h, l = Te(o ? i.x : i.y), c = n === "start" ? Math.min(l, r + a - Ui) : r, u = n === "end" ? Math.max(l, r + Ui) : r + a;
  if (c === r && u === r + a) return e;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (f) => "bus" in f && f.bus === t ? { bus: t, at: Math.min(1, Math.max(0, (r + f.at * a - c) / (u - c))) } : f;
  return {
    ...e,
    blocks: e.blocks.map((f) => f.id === t ? { ...f, ...d } : f),
    wires: e.wires.map((f) => {
      const g = p(f.from), y = p(f.to);
      return g === f.from && y === f.to ? f : { ...f, from: g, to: y };
    })
  };
}
function gh(e) {
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
      i = mh(p, d.id, d.end, u.pt);
      return;
    }
    const f = p.blocks.find((w) => w.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!f) return;
    if (d.kind === "pin") {
      i = hu(p, f.id, d.from.port, Iu(ht(f, e.geo(), p), u.pt));
      return;
    }
    const g = Te(f.x + u.pt.x - o.x), y = Te(f.y + u.pt.y - o.y);
    i = g === f.x && y === f.y ? p : uu(p, f.id, g, y);
  }
  function c(u, d, p) {
    const f = a(u, p);
    if (!f) return;
    const g = Oo(u, d, f, e.geo());
    if ("error" in g) {
      e.notify(h(`power.err.${g.error}`));
      return;
    }
    e.commitPower(g.schema), e.notify(null);
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
        if (hh(d, f)) {
          t = { kind: "pin", from: f };
          return;
        }
        const g = d.blocks.find((w) => w.id === p.block), y = Qn(d, g, e.geo()).find((w) => w.name === p.port).pt;
        t = { kind: "wire", from: f, at: y, to: y, ok: !1 };
        return;
      }
      e.select({ kind: "powerBlock", id: p.id }), t = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      l(u);
    },
    up(u) {
      l(u);
      const d = t, p = n, f = i, g = s;
      if (r(), !(!d || !p)) {
        if (!g) {
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
function wh(e, t) {
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
      const o = e.power(), r = du(n, { x: 0, y: 0 }, o, s), a = ht(r, e.geo(), Co(o, r)), l = { ...r, x: Te(i.pt.x - a.w / 2), y: Te(i.pt.y - a.h / 2) };
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
const bh = ["select", "box", "wall", "door", "window", "opening", "zone"], yh = [
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
], vh = ["binding-select"], $h = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], hl = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, xh = {
  plan: bh,
  equipment: yh,
  binding: vh,
  power: $h
};
function Os(e) {
  return xh[e];
}
function ji(e, t) {
  switch (e) {
    case "select":
      return th(t);
    case "box":
      return eh(t);
    case "wall":
      return nh(t);
    case "door":
    case "window":
    case "opening":
      return ih(t, e);
    case "zone":
      return rh(t);
    case "device-select":
      return ph(t);
    case "binding-select":
      return fh(t);
    case "power-select":
      return gh(t);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return wh(t, e);
    default:
      return ch(t, e);
  }
}
function ki(e, t, n) {
  return t.kind === "powerBlock" ? n.blocks.some((s) => s.id === t.id) : t.kind === "powerWire" ? n.wires.some((s) => s.id === t.id) : (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((s) => s.id === t.id);
}
const kh = {
  select: Ye,
  box: mp,
  wall: gp,
  door: Xu,
  window: yp,
  opening: Yu,
  zone: up,
  "device-select": Ye,
  ceiling_light: Zu,
  wall_light: wp,
  motion_sensor: rp,
  illuminance_sensor: qu,
  climate_sensor: pp,
  wall_switch: ip,
  smart_button: np,
  valve: fp,
  leak_sensor: bp,
  socket: Ja,
  exhaust_fan: tp,
  equipment: To,
  "binding-select": Ye,
  "power-select": Ye,
  "power-device": To,
  "power-bus": cp,
  "power-battery": Wu,
  "power-pv": tl,
  "power-transfer": dp,
  "power-remainder": Ku
}, ml = (e) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${kh[e]}></path>`}</svg>`;
function Mh(e) {
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
function _h(e) {
  return v`
    <div class="top"><div class="bar">
      ${e.lead ?? b}
      ${e.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${Z(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => v`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : b}
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
        ${Mh(e)}${e.saveState === "error" && e.errorMessage ? v`: ${e.errorMessage}` : b}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${h("action.save")}</button>
    </div>${e.steps}</div>`;
}
const Sh = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Ah(e, t, n) {
  return Os(e).map((i) => {
    const s = e === "plan" ? hl[i] : void 0, o = h(`tool.${i}`);
    return v`
      ${Sh.includes(i) ? v`<div class="tool-sep"></div>` : b}
      <button class="tool ${t === i ? "on" : ""}" data-tool=${i} data-key=${s ?? b}
        aria-pressed=${t === i ? "true" : "false"} aria-keyshortcuts=${s ?? b}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${ml(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function Eh(e, t, n) {
  return v`<div class="tools">${Ah(e, t, n)}</div>`;
}
const me = ["plan", "equipment", "binding", "power"], en = (e, t, n) => h(e === 1 ? t : n).replace("{n}", String(e));
function Ih(e, t, n, i) {
  const { walls: s, zones: o, devices: r } = t;
  switch (e) {
    case "plan": {
      const a = o.filter((c) => c.invalid).length, l = a ? `, ${h("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${en(s.length, "steps.wall", "steps.walls")}, ${en(o.length, "steps.zone", "steps.zones")}${l}`,
        done: s.length > 0 && o.length > 0
      };
    }
    case "equipment":
      return { text: en(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const a = r.length - is(r.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(a)).replace("{n}", String(r.length)),
        done: r.length > 0 && a === r.length
      };
    }
    case "power":
      return { text: en(i.blocks.length, "steps.block", "steps.blocks"), done: $u(i) };
  }
}
const ir = (e, t) => h(e).replace("{step}", h(`mode.${t}`));
function Ph(e) {
  const t = me.indexOf(e.mode), n = me[t - 1], i = me[t + 1];
  return v`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Z(e.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${me.map((s, o) => {
    const r = Ih(s, e.level, e.status, e.power), a = s === e.mode;
    return v`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : b} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${me.length + 1}</span><span class="name">${h("mode.automation")}</span>
        <span class="state">${h("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${ir("steps.back", n)}</button>` : b}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${ir("steps.next", i)}</button>` : b}
      </div>
    </nav>`;
}
function Ch(e) {
  return e.devices.filter((t) => t.placement.mode === "none").sort((t, n) => t.name.localeCompare(n.name) || t.id.localeCompare(n.id));
}
function gl(e) {
  const t = e.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return na(e, es(h("device.equipment"), t));
}
function zs(e) {
  if (ue(e)) return h("props.inverter");
  const t = rd(e);
  return t ? h(`deviceRole.${t}`) : "";
}
function ii(e) {
  const t = h(`device.${e.props.kind}`), n = zs(e);
  return n ? `${t} · ${n}` : t;
}
function Lh(e) {
  const t = Ch(e.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => e.onNew()}>${h("devices.new")}</button>
    </div>
    ${t.length === 0 ? b : v`<div class="pdevs">
      ${t.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => e.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${zs(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const Oh = ["unbound", "bound", "all"], zh = /* @__PURE__ */ new WeakMap(), _e = (e) => e.placement.mode === "none";
function wl(e) {
  return ft(zh, e, (t) => [...t.devices].sort((n, i) => Number(_e(n)) - Number(_e(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Nh(e, t, n) {
  const i = wl(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const bl = (e) => h(`device.${e.props.kind}`), sr = (e) => e.props.kind === "equipment" ? zs(e) : bl(e), Vh = (e, t) => e === "all" || e === "bound" == (t === "bound");
function Dh(e, t, n) {
  return t === 0 ? h("binding.noDevices") : n || e.filter === "all" ? h("binding.noMatch") : h(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function or(e) {
  const t = h(e.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function Th(e) {
  var a;
  if (e.collapsed) return v`<div class="blist collapsed">${or(e)}</div>`;
  const t = wl(e.level).map((l) => ({ d: l, st: e.status(l) })), n = {
    unbound: is(t.map((l) => l.st)),
    bound: t.filter((l) => l.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: l, st: c }) => Vh(e.filter, c) && (!i || l.name.toLowerCase().includes(i) || bl(l).toLowerCase().includes(i) || sr(l).toLowerCase().includes(i))), o = ((a = e.selection) == null ? void 0 : a.kind) === "device" ? e.selection.id : null, r = (l, c) => {
    const u = cc(l);
    return v`<button class="brow${l.id === o ? " sel" : ""}" data-id=${l.id} @click=${() => e.onPick(l.id)}>
      <span class="dot ${c}" role="img" aria-label=${h(`bindstatus.${c}`)} title=${h(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${l.name}</span><small class="kind">${sr(l)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${Oh.map((l) => v`<button role="radio" aria-checked=${String(l === e.filter)} data-filter=${l}
            @click=${() => e.onFilter(l)}>${h(`binding.filter.${l}`)} <span class="count">${n[l]}</span></button>`)}
        </div>
        ${or(e)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${Z(e.query)} @input=${(l) => e.onQuery(l.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${Dh(e, t.length, i)}</p>` : v`
          ${s.filter((l) => !_e(l.d)).map((l) => r(l.d, l.st))}
          ${s.some((l) => _e(l.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((l) => _e(l.d)).map((l) => r(l.d, l.st))}
          </div>` : b}`}
      </div>
    </div>`;
}
function C(e, t) {
  return v`<label class="row"><span>${e}</span>${t}</label>`;
}
function G(e, t, n, i) {
  return v`<select class="val" data-field=${i ?? b} .value=${Z(e)} @change=${(s) => {
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
  return v`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? b}
    placeholder=${e.placeholder ?? b} title=${e.placeholder ?? b} .value=${Z(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = Fe(s.value, e.rule);
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
function Hh() {
  return {
    door: { width: cn.door, hinge: "start", swing: "left" },
    window: { width: cn.window, outside: "left" },
    opening: { width: cn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Rh(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function yl(e) {
  return es(h("zones.default"), e.zones.map((t) => t.name));
}
const Bh = (e) => e === "door" || e === "window" || e === "opening";
function Fh(e) {
  const t = e.next;
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return b;
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
  }, "next-swing"))}` : b}
    ${n === "window" ? C(h("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : b}`;
}
class Uh {
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
const Wi = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Se = (e) => typeof e == "string" && e ? e : null, rr = (e) => typeof e == "number" && Number.isFinite(e), qi = (e) => {
  var t;
  return e.props.kind === "equipment" && !!((t = e.bindings) != null && t.control);
};
function vl(e) {
  return e.switchesMigrated || !e.devices.some(qi) ? e : { ...e, switchesMigrated: !0 };
}
function jh(e, t, n) {
  const i = na(e, n);
  let s = i.level;
  const o = Wi(t.switch) ? t.switch : {}, r = [["power", Se(t.power)], ["voltage", Se(t.voltage)], ["control", Se(o.entity)]];
  for (const [a, l] of r) l && (s = zn(s, i.id, a, l));
  return o.controllable === !0 && (s = Fn(s, i.id, !0)), { level: s, id: i.id };
}
function Wh(e) {
  let t = e.level, n = e.power;
  const i = e.power;
  if (Wi(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((a) => {
      if (!Wi(a)) return a;
      if (a.kind === "meter" && Se(a.id) && rr(a.x) && rr(a.y)) {
        s++;
        const l = jh(t, a, Se(a.name) ?? `Meter ${s}`);
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
        return l === !0 && typeof a.deviceId == "string" && (t = oa(t, a.deviceId, !0)), o = !0, c;
      }
      return a;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!t.switchesMigrated && t.devices.some(qi)) {
    for (const s of e.level.devices) qi(s) && (t = Fn(t, s.id, !0));
    t = vl(t);
  }
  return t === e.level && n === e.power ? e : { ...e, level: t, ...n ? { power: n } : {} };
}
class qh {
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
        this.h.loadError = yt(t);
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
    const n = await Tu(this.h.hass, t);
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
      this.h.notice = yt(n);
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
            await Ru(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = yt(o);
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
            this.h.notice = yt(o);
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
    this.h.plan = { ...t, levels: t.levels.map(xc) };
    const n = Wh({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = vu(n.power, { device: (s) => n.level.devices.find((o) => o.id === s) });
    this.h.history = new Uh({ level: n.level, ...i ? { power: i } : {} }), this.h.lazyPower = Da(), this.h.activeTool.cancel(), this.h.activeTool = ji(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const t = this.h.plan, { level: n, power: i } = this.h.history.current, s = t.levels.map((a, l) => l === 0 ? vl(n) : a), { power: o, ...r } = t;
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
class Zh {
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
    !n || !su(n.states, t) ? this.base = { states: t, meta: iu(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? ru(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), ou(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", yt(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const nn = Or("", "");
function Kh(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current.level) ?? nn;
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
    openingDefaults: (t) => Rh(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zone.name ?? yl(((t = e.history) == null ? void 0 : t.current.level) ?? nn);
    },
    zoneMethod: () => e.nextObj.zone.method,
    zoneAutomation: () => e.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zone: { ...e.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const t = (((n = e.history) == null ? void 0 : n.current.level) ?? nn).devices;
      return { device: (i) => t.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const t = e.placeDeviceId;
      return t === null ? null : ja(((n = e.history) == null ? void 0 : n.current.level) ?? nn, e.power).some((i) => i.id === t) ? t : (e.placeDeviceId = null, null);
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
const $l = Object.keys(os), Gh = (e) => $l.includes(e);
function Xh() {
  return Object.fromEntries($l.map((e) => [e, zt(e, "free")]));
}
const xl = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -se, max: se, signed: !0 }, bad: "props.badAim" }
}, Ae = (e, t, n, i, s) => Tt({ ...xl[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), Yh = ["round", "linear", "spot"], Qh = ["rect", "circle"], Pn = (e, t) => e.map((n) => ({ v: n, label: h(`${t}.${n}`) }));
function kl(e, t, n, i) {
  const s = (r, a, l) => C(`${h(a)}, ${h("unit.mm")}`, Ae(e, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => C(`${h(a)}, ${h("unit.deg")}`, Ae(e, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (t.kind) {
    case "ceiling_light":
      return v`
        ${C(h("props.shape"), G(t.shape, Pn([...Yh], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? v`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : t.shape === "round" ? s("diameter", "props.diameter", t.diameter) : b}
        ${C(`${h("props.poolRadius")}, ${h("unit.mm")}`, Tt({
        ...xl.mm,
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
        ${fc.map((r) => v`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${C(h("props.shape"), G(t.shape, Pn([...Qh], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? v`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${C(h("props.icon"), tm(e, t.icon, `${n}icon`, i))}
        ${C(h("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Z(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return v`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const Jh = /^mdi:[a-z0-9-]+$/;
function tm(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!Jh.test(o)) {
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
function em(e, t) {
  return t.props.kind !== "equipment" || t.placement.mode === "none" ? b : Kt("wallMount", h("props.wallMount"), t.placement.mode === "wall", (n) => {
    var i;
    return ((i = e.onWallMount) == null ? void 0 : i.call(e, n)) ?? !1;
  });
}
function nm(e, t) {
  var i;
  const n = t.props;
  return n.kind !== "equipment" ? b : v`
    ${Kt("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = e.onInverter) == null ? void 0 : o.call(e, s)) ?? !1;
  })}
    ${(i = t.bindings) != null && i.control ? Kt("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = e.onControllable) == null ? void 0 : o.call(e, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function im(e, t) {
  const n = t.placement;
  if (n.mode === "none") return b;
  if (n.mode === "free")
    return C(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      Ae(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = zr.has(t.props.kind);
  return v`
    ${C(h("props.side"), G(n.side, Pn(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${C(`${h("props.offset")}, ${h("unit.mm")}`, Ae(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? C(
    `${h("props.aim")}, ${h("unit.deg")}`,
    Ae(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(ga(n, s)))
  ) : b}`;
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
function sm(e, t) {
  const n = t.props.kind;
  return Lr(n) ? n === "smart_button" && t.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : C(h("props.type"), G(
    n,
    Pn(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : b;
}
function om(e, t) {
  const n = e.level ? Cd(e.level, t) : [];
  return v`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = e.onZone) != null && a.call(e, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function rm(e, t) {
  const n = t.placement.mode !== "none";
  return v`
    <h4>${ii(t)}</h4>
    ${Ns(t, (i) => e.onDevice({}, i))}
    ${sm(e, t)}
    ${n ? kl(e, t.props, "", (i) => e.onDevice(i)) : b}
    ${em(e, t)}
    ${im(e, t)}
    ${nm(e, t)}
    ${n ? om(e, t) : b}
    ${t.invalid ? v`<p class="warn">${h("props.invalidDevice")}</p>` : b}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${h("action.delete")}</button>`;
}
function am(e) {
  return e.device ? rm(e, e.device) : e.nextKind && e.nextProps ? v`
      <h4>${h("props.nextDevice")}: ${h(`device.${e.nextKind}`)}</h4>
      ${kl(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}
      ${e.nextKind === "equipment" ? Kt(
    "next-wallMount",
    h("props.wallMount"),
    !!e.nextWallMount,
    (t) => {
      var n;
      return (n = e.onNextWallMount) == null || n.call(e, t), !0;
    }
  ) : b}` : v`<p class="muted">${h("props.none")}</p>`;
}
function lm(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((l) => l.id === n.id) ?? null : null, s = Gh(e.toolId) ? e.toolId : null, o = (l) => l === t ? (e.setNotice(h("props.noFit")), !1) : (e.setNotice(null), e.commit(l), !0), r = (l) => l.level === t ? !1 : (e.setNotice(null), e.commit(l.level, l.power), !0), a = (l, c) => {
    const u = ah(t, l, c);
    return o(u ? $n(t, l.id, u) : t);
  };
  return v`<div class="props">
    ${am({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (l, c) => !!i && o(je(t, i.id, l, c)),
    onKind: (l) => !!i && o(ad(t, i.id, l)),
    onPlacement: (l) => !!i && o($n(t, i.id, l)),
    onZone: (l, c) => !!i && o(Ea(t, i.id, l, c)),
    onWallMount: (l) => !!i && a(i, l),
    onInverter: (l) => !!i && r(Fa(t, e.power, i.id, l)),
    onControllable: (l) => !!i && o(Fn(t, i.id, l)),
    nextWallMount: e.nextWallMount,
    onNextWallMount: (l) => e.setNextWallMount(l),
    onNext: (l) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...l, kind: s } });
    },
    onDelete: () => {
      i && r(Ba(t, e.power, i.id));
    },
    onNotice: (l) => e.setNotice(l)
  })}
    ${e.notice ? v`<p class="warn">${e.notice}</p>` : b}
    ${i ? b : Lh({
    level: t,
    onPick: (l) => e.pickDevice(l),
    onNew: () => {
      const l = gl(t);
      e.commit(l.level), e.pickDevice(l.id);
    }
  })}
  </div>`;
}
const Zi = (e) => h(`zones.kind.${e.shape.kind}`), Vs = (e) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${M`<path d=${e === "walls" ? ep : hp}></path>`}</svg>`;
function Ml(e, t) {
  const n = ba(e, t);
  return n ? h(`zones.invalid.${n}`) : null;
}
function cm(e) {
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
    const a = o.invalid ? Ml(e.level, o) ?? "" : null;
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
    if (!Ya(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === lt || t === b) return t;
    const n = e.element, i = e.name;
    if (e.type === Et.PROPERTY) {
      if (t === n[i]) return lt;
    } else if (e.type === Et.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return lt;
    } else if (e.type === Et.ATTRIBUTE && n.getAttribute(i) === t + "") return lt;
    return As(e), t;
  }
}), _l = (e, t, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${e} .checked=${Ds(t)}
    @change=${(i) => n(i.target.checked)} />${h("zones.automation")}</label>`;
function dm(e, t, n) {
  const i = va(e, t.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${h("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${h("zones.participates")}</span>` : b}</div>
    ${i.length === 0 ? v`<p class="muted">${h("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${h(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${Ds(o)}
          @change=${(r) => {
    const a = Ea(e, s.id, t.id, r.target.checked);
    a !== e && n(a);
  }} />
      </label>`)}
  </div>`;
}
function ar(e, t, n) {
  const i = Ml(e, t), s = t.shape.kind === "walls" && t.shape.broken;
  return v`<div class="zprops">
    <h4>${h("props.zone")}</h4>
    ${C(h("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${Z(t.name)}
      @change=${(o) => {
    const r = o.target, a = r.value.trim();
    if (!a || a === t.name) {
      r.value = t.name;
      return;
    }
    n(Bd(e, t.id, a));
  }} />`)}
    ${C(h("props.area"), v`<span class="val ro" data-field="zone-area">${el(fs(e, t))}</span>`)}
    ${C(h("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${Vs(t.shape.kind)}${Zi(t)}</span>`)}
    ${_l("zone-automation", t.automation !== !1, (o) => {
    const r = bs(e, t.id, o);
    r !== e && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(Wd(e, t.id))}>
        ${h("zones.keepOutline")}</button>` : b}</div>` : b}
    ${dm(e, t, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Aa(e, t.id))}>
      ${h("zones.delete")}</button>
  </div>`;
}
function um(e) {
  const t = e.next.zone, n = t.name ?? yl(e.level), i = (s) => e.setNext({ ...e.next, zone: { ...t, ...s } });
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
    ${_l("next-zone-automation", t.automation, (s) => i({ automation: s }))}`;
}
function Sl(e, t, n) {
  return Tt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function lr(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function pm(e, t) {
  const n = J(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(eu(t.level, e.id, o));
  return v`
    <h4>${h("props.wall")}</h4>
    ${C(h("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${C(h("props.thickness"), Sl(t, e.thickness, (o) => {
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
function fm(e, t) {
  const n = ["door", "window", "opening", ...yn.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(sd(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = yn.includes(e.kind);
  return v`
    <h4>${h(`kind.${e.kind}`)}</h4>
    ${C(h("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(id(e, r))))}
    ${C(h("props.width"), Sl(t, e.width, (r) => lr(t, nd(t.level, e.id, r))))}
    ${C(h("props.offset"), Tt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => lr(t, Qr(t.level, e.id, r))
  }))}
    ${o ? v`
      ${C(h("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${C(h("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : b}
    ${e.kind === "window" ? C(h("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : b}
    ${C(h("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${Z(Kr(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Zr(e.kind) ? void 0 : a });
  }} />`)}
    ${C(h("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${Z(Xr(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Gr(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? v`<p class="warn">${h("props.invalidOpening")}</p>` : b}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(Jr(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function hm(e) {
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
      </div>` : b}`;
}
const cr = (e) => cm({
  level: e.level,
  selection: e.selection,
  query: e.zoneQuery,
  onQuery: e.onZoneQuery,
  onPick: e.onPickZone
});
function mm(e) {
  const { level: t, selection: n } = e;
  if (e.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? t.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${um({ level: t, next: e.next, setNext: e.setNext, onMethod: e.onZoneMethod })}
      ${e.notice ? v`<p class="warn">${e.notice}</p>` : b}
      ${s ? ar(t, s, e.commit) : b}
      ${cr(e)}
    </div>`;
  }
  let i = b;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = pm(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = fm(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = ar(t, s, e.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${h("props.node")}</h4>
      ${C("X", v`<span class="val ro">${jt(s.x)}</span>`)}${C("Y", v`<span class="val ro">${jt(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === b && (e.tool === "wall" || e.tool === "box") ? hm(e) : i === b && Bh(e.tool) ? Fh({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === b && e.tool === "select" ? cr(e) : i === b ? v`<p class="muted">${h("props.none")}</p>` : i}
      ${e.notice ? v`<p class="warn">${e.notice}</p>` : b}
    </div>`;
}
function gm(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const dr = /* @__PURE__ */ new WeakMap();
function Ts(e, t, n) {
  let i = dr.get(e);
  i || dr.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : gm(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function fn(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const sn = (e) => e ?? b;
var wm = Object.defineProperty, Ke = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && wm(t, n, s), s;
};
const bm = 100;
let ym = 0;
const vm = (e) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${e}></path>`}</svg>`, Rs = class Rs extends ee {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${ym++}`, this.shown = null, this.onOutside = (t) => {
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
        if (s.length === bm) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${sn(this.label || void 0)} title=${sn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : b}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${sn(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${sn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : b}
      ${n ? v`<div class="hint">${h("combo.more")}</div>` : b}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : b}</div>`;
  }
};
Rs.styles = Mr`
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
Ke([
  Mt()
], Vt.prototype, "value");
Ke([
  Mt()
], Vt.prototype, "label");
Ke([
  R()
], Vt.prototype, "isOpen");
Ke([
  R()
], Vt.prototype, "query");
Ke([
  R()
], Vt.prototype, "active");
var $m = Object.defineProperty, Hs = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && $m(t, n, s), s;
};
const xm = {
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
}, ur = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, km = { light: "light", switch: "switch", event: "event", fan: "fan" };
function pr(e, t) {
  return e != null && e.deviceClass && ur[e.deviceClass] ? ur[e.deviceClass] : km[(e == null ? void 0 : e.domain) ?? Oa(t)] ?? "generic";
}
const fr = (e) => vm(xm[e]);
function Mm(e) {
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
      const { name: n, context: i } = fn(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? fn(this.meta, t) : null;
    return v`${fr(t ? pr(this.meta.entities.get(t), t) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : b}<small class="eid">${t}</small></span>` : v`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Na(this.states, t.entityId) ?? "unavailable";
    return v`${fr(pr(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Mm(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = fn(this.meta, t).name;
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
const Ee = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), Ee(s, t);
  return !0;
}, Cn = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, Al = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), Am(t);
  }
};
function _m(e) {
  this._$AN !== void 0 ? (Cn(this), this._$AM = e, Al(this)) : this._$AM = e;
}
function Sm(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) Ee(i[o], !1), Cn(i[o]);
  else i != null && (Ee(i, !1), Cn(i));
  else Ee(this, e);
}
const Am = (e) => {
  e.type == Et.CHILD && (e._$AP ?? (e._$AP = Sm), e._$AQ ?? (e._$AQ = _m));
};
class Em extends ti {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), Al(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (Ee(this, t), Cn(this));
  }
  setValue(t) {
    if (Ya(this._$Ct)) this._$Ct._$AI(t, this);
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
const Im = () => new Pm();
class Pm {
}
const Mi = /* @__PURE__ */ new WeakMap(), Cm = Jn(class extends Em {
  render(e) {
    return b;
  }
  update(e, [t]) {
    var i;
    const n = t !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = (i = e.options) == null ? void 0 : i.host, this.rt(this.ct = e.element)), b;
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
}), Lm = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], Om = { min: 1, max: 10 };
function El(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const Ki = (e, t, n) => El(e, je(e.level, t.id, n));
function _i(e, t, n, i) {
  return v`<div class="cflag">${C(t, v`<input type="checkbox" data-field=${e} .checked=${Z(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Si = "__other", ge = /* @__PURE__ */ new Set();
function zm(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = Js.includes(i), a = !r || ge.has(o), l = Im(), c = [...Js.map((d) => ({ v: d, label: d })), { v: Si, label: h("binding.eventOther") }];
  return v`<span class="evfield">${G(a ? Si : i, c, (d) => {
    if (d === Si) {
      ge.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    ge.delete(o), l.value && (l.value.hidden = !0), d !== i ? s(d) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${Cm(l)} data-field=${`${n}-event-custom`} ?hidden=${Ds(!a)}
      .value=${Z(r ? "" : i)} @change=${(d) => {
    var g;
    const p = d.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, e.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, e.setFieldNotice(null), f !== i) {
      s(f) && ge.delete(o);
      return;
    }
    if (ge.delete(o), r) {
      p.hidden = !0;
      const y = (g = p.parentElement) == null ? void 0 : g.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function Nm(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return v`${b}`;
  const s = i[n], o = (r) => Ki(e, t, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${C(h("binding.slot"), G(
    String(s.slot),
    Lm(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${C(h("binding.event"), zm(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function Vm(e, t, n) {
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
      rule: Om,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => Ki(e, t, { windowSec: a })
    }))}</div>` : b}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${b}`;
  const s = (a, l) => (c) => {
    var d, p;
    const u = je(e.level, t.id, { [a]: c });
    return El(e, c && !((d = t.bindings) != null && d[l]) ? zn(u, t.id, l, ((p = t.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = _i("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${_i("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? b : r}`;
}
function Dm(e) {
  return e.props.kind !== "smart_button" || !pc(e).length ? v`${b}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function Gi(e, t) {
  return t === "control" && e.props.kind === "equipment" ? h("role.control.equipment") : t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? h("binding.onOff") : h(`role.${t}`);
}
const Ai = (e) => String(e).padStart(2, "0");
function Tm(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${Ai(t.getHours())}:${Ai(t.getMinutes())}:${Ai(t.getSeconds())}`;
}
const Hm = (e, t) => e.action !== "set" ? e.action : `set ${(t === "valve" ? e.value === "on" ? "open" : e.value === "off" ? "closed" : e.value : e.value) ?? ""}`.trim();
function Rm(e) {
  return e.status === "error" ? e.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : h("output.errorNotConfigured") : e.last ? h("output.last").replace("{event}", Hm(e.last, e.kind)).replace("{time}", Tm(e.last.at)) : h("output.none");
}
function Bm(e, t) {
  if (!Vn(t.props.kind)) return b;
  const n = e.feed.stateOf(t), i = n ? Rm(n) : e.feed.error ?? (e.feed.ready ? h("output.notSaved") : null);
  return i === null ? b : v`<p class="note" data-field="output">${i}</p>`;
}
function Fm(e, t, n, i) {
  const s = Va(e.meta, i, e.states), o = uc(e.level, t, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : b}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : b}
    ${o.length ? v`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : b}`;
}
function Um(e, t, n) {
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
    const c = zn(e.level, t.id, i, l.detail.value);
    c !== e.level && e.commit(c);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && ns(i) ? Nm(e, t, i) : b}
    ${s ? Fm(e, t, i, s) : b}
  </div>`;
}
function jm(e) {
  const t = e.device, n = is(e.level.devices.map(e.status));
  return v`<div class="props bprops">
    ${e.notice ? v`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : b}
    ${e.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : b}
    ${e.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${h(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : b}
    ${t ? v`
      <h4>${ii(t)}</h4>
      ${Ns(t, (i) => e.commit(je(e.level, t.id, {}, i)))}
      ${Bm(e, t)}
      ${mt(t).map((i) => v`${Um(e, t, i)}${Vm(e, t, i.role)}`)}
      ${Dm(t)}` : v`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const Wm = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, qm = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Zm = 6, Km = ["A", "0", "B"], Gm = ["power", "control"], Xm = ["power", "power_in", "power_out", "voltage", "control"], ce = (e) => ({ device: (t) => e.level.devices.find((n) => n.id === t) });
function we(e, t, n, i) {
  const { [n]: s, ...o } = t, r = i === null ? o : { ...o, [n]: i };
  e.commitPower({ ...e.power, blocks: e.power.blocks.map((a) => a.id === t.id ? r : a) });
}
function be(e, t, n, i, s, o) {
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
function Ym(e, t) {
  const n = t.name ?? "";
  return C(h("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${t.kind}`)} .value=${Z(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? e.commitPower(De(e.power, t.id, { name: o }, ce(e))) : s.value = n;
  }} />`);
}
function Qm(e, t) {
  const n = new Set(mt(t).map((i) => i.role));
  return v`${Gm.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = t.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${fn(e.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function on(e, t, n) {
  return t === e.level ? !1 : (e.commit(t, n), !0);
}
function Jm(e, t) {
  var o;
  const n = mt(t), i = Xm.flatMap((r) => n.filter((a) => a.role === r)), s = t.props;
  return v`
    ${Ns(t, (r) => on(e, je(e.level, t.id, {}, r)))}
    ${i.map((r) => {
    var a;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Gi(t, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${e.meta} .states=${e.states} .items=${Ts(e.meta, r, !1)}
        .value=${((a = t.bindings) == null ? void 0 : a[r.role]) ?? null} .label=${Gi(t, r.role)}
        @value-changed=${(l) => {
      l.stopPropagation(), on(e, zn(e.level, t.id, r.role, l.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = t.bindings) != null && o.control) ? Kt(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => on(e, Fn(e.level, t.id, r))
  ) : b}
    ${s.kind === "equipment" ? Kt("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const a = Fa(e.level, e.power, t.id, r);
    return on(e, a.level, a.power);
  }) : b}`;
}
function t1(e, t) {
  const n = e.level.devices.find((s) => s.id === t.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
  const i = ue(n) ? b : Kt("output", h("power.enableOutput"), t.output !== !1, (s) => {
    const o = ce(e);
    if (s) {
      const { output: r, ...a } = t;
      e.commitPower({ ...e.power, blocks: e.power.blocks.map((l) => l.id === t.id ? a : l) });
    } else
      e.commitPower(Gn(De(e.power, t.id, { output: !1 }, o), t.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${Jm(e, n)}${i}` : v`
    ${C(h("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${C(h("props.kind"), v`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${Qm(e, n)}${i}`;
}
function e1(e, t) {
  var s, o;
  const n = (o = (s = e.frame) == null ? void 0 : s.blocks[t.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return v`
    ${C(h("power.form"), G(t.form, i, (r) => {
    r !== t.form && e.commitPower(De(e.power, t.id, { form: r }, ce(e)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${Km.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => e.setPosition(t.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function n1(e, t) {
  const n = t.w >= t.h, i = n ? t.w : t.h, s = n ? t.h : t.w, o = (l, c) => {
    if (l === i && c === s) return !1;
    e.commitPower(De(e.power, t.id, n ? { w: l, h: c } : { w: c, h: l }, ce(e)));
  }, r = (l, c, u) => Tt({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: l, skipSame: !0, apply: u }), a = ["h", "v"].map((l) => ({ v: l, label: h(`power.orientation.${l}`) }));
  return v`
    ${C(h("power.orientation"), G(n ? "h" : "v", a, (l) => {
    l !== (n ? "h" : "v") && e.commitPower(De(e.power, t.id, { w: t.h, h: t.w }, ce(e)));
  }, "bus-orientation"))}
    ${C(h("power.busLength"), r("bus-length", i, (l) => o(Math.max(Ui, s + 1, l), s)))}
    ${C(h("power.busThickness"), r("bus-thickness", s, (l) => o(i, Math.min(Math.max(Zm, l), i - 1))))}`;
}
function i1(e, t) {
  switch (t.kind) {
    case "grid":
      return v`
      ${be(e, "power", h("power.field.power"), Ut, t.power, (n) => we(e, t, "power", n))}
      ${be(e, "voltage", h("power.field.voltage"), Wm, t.voltage, (n) => we(e, t, "voltage", n))}`;
    case "device":
      return t1(e, t);
    case "battery":
      return v`
      ${be(e, "power", h("power.field.batteryPower"), Ut, t.power, (n) => we(e, t, "power", n))}
      ${be(e, "soc", h("power.field.soc"), qm, t.soc, (n) => we(e, t, "soc", n))}`;
    case "pv":
      return be(e, "power", h("power.field.power"), Ut, t.power, (n) => we(e, t, "power", n));
    case "transfer":
      return e1(e, t);
    case "bus":
      return n1(e, t);
    default:
      return b;
  }
}
function s1(e, t) {
  const n = !!t.portPins && Object.keys(t.portPins).length > 0, i = t.kind === "device" ? e.level.devices.find((s) => s.id === t.deviceId) : void 0;
  return v`
    <h4>${i ? ii(i) : h(`power.title.${t.kind}`)}</h4>
    ${t.kind === "device" ? b : Ym(e, t)}
    ${i1(e, t)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => e.commitPower(mu(e.power, t.id))}>${h("power.autoPorts")}</button>` : b}
      ${t.kind === "grid" ? b : v`<button class="btn danger" data-action="delete-block"
        @click=${() => e.commitPower(Ha(e.power, t.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function o1(e, t) {
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
      @click=${() => e.commitPower(Ua(e.power, t.id))}>${h("action.delete")}</button></div>`;
}
function r1(e) {
  const t = ja(e.level, e.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = gl(e.level);
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
function a1(e) {
  if (e.toolId === "power-device") return r1(e);
  const t = e.selection, n = (t == null ? void 0 : t.kind) === "powerBlock" ? e.power.blocks.find((s) => s.id === t.id) : void 0;
  if (n) return s1(e, n);
  const i = (t == null ? void 0 : t.kind) === "powerWire" ? e.power.wires.find((s) => s.id === t.id) : void 0;
  return i ? o1(e, i) : e.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function l1(e) {
  return v`<div class="props pprops">
    ${e.notice ? v`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : b}
    ${e.feedError ? v`<p class="note" data-notice="feed">${e.feedError}</p>` : b}
    ${a1(e)}
  </div>`;
}
function c1(e, t) {
  return e.mode !== "binding" ? Eh(e.mode, e.toolId, (n) => e.pickTool(n)) : Th({
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
function d1(e, t) {
  var i;
  const n = e.selection;
  return jm({
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
function u1(e, t) {
  var i;
  if (e.mode === "binding") return d1(e, t);
  if (e.mode === "power")
    return l1({
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
  return e.mode === "equipment" ? lm({
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
  }) : mm({
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
function p1(e, t) {
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
function f1(e, t) {
  const n = e === "zone" ? `${h("tool.zone")} · ${h(`zones.kind.${t}`)}` : h(`tool.${e}`);
  return v`<span class="tool-chip">${ml(e)}${n}</span>`;
}
function h1(e) {
  return v`
    <div class="status">
      ${f1(e.tool, e.zoneMethod)}
      ${p1(e.tool, e.zoneMethod).map(([t, n]) => v`<span><span class="kbd">${t}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${e.snap ? v`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${h(e.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${e.power ? b : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function m1(e, t) {
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
  return M`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((a, l) => M`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${n.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${a.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? n.text : n.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function g1(e, t, n, i) {
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
function w1(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const b1 = Mr`
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
`, y1 = 5e-3, v1 = 2, Ln = (e) => Math.max(y1, Math.min(v1, e));
function $1(e, t, n) {
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
function x1(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: Ln(Math.min(t, n) / 12e3) };
  const i = e.map((d) => d.x), s = e.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, u = Ln(Math.min(t / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - t / u / 2, y: (l + c) / 2 - n / u / 2, scale: u };
}
function k1(e, t, n, i, s) {
  const o = Ln(Math.min(s, t / (e.w + 2 * i), n / (e.h + 2 * i)));
  return { x: e.x + e.w / 2 - t / o / 2, y: e.y + e.h / 2 - n / o / 2, scale: o };
}
function M1(e, t, n) {
  const i = Ln(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function _1(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function hr(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function S1(e, t, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * e.scale >= 6 ? 100 * s : o, a = 1 / e.scale;
  return M`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${a}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${a}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const A1 = ["Shift", "Control", "Alt", "Meta"], E1 = {
  plan: "select",
  equipment: "device-select",
  power: "power-select"
}, I1 = new Map(Object.entries(hl).map(([e, t]) => [`Key${t}`, e]));
function mr(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class P1 {
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
        this.h.view = _1(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = M1(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (mr(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? I1.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let a = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!a && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (a = this.h.deleteSelection()), !a && n.key === "Escape") {
        const l = E1[this.h.mode];
        l && this.h.toolId !== l ? this.h.pickTool(l) : (this.h.activeTool.cancel(), this.h.selection = null), a = !0;
      }
      a && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || mr(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !A1.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function Il(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function C1(e) {
  return v`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", Il(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function ye(e, t, n, i) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? v`<p class="muted">${i}</p>` : b}
        <div class="actions">
          ${n.map((s) => v`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function L1(e) {
  var n;
  const t = { action: "cancel", label: h("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? ye(h("draft.title"), h("draft.text").replace("{time}", Il(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => e.discard(i) }
      ]) : b;
    }
    case "new":
      return ye(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return ye(h("delete.title"), h("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return ye(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return ye(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return b;
  }
}
const ve = "plan_studio.draft.", rn = "plan_studio.lastPlanId";
function O1() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function z1(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class N1 {
  constructor(t = O1, n = 500) {
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
      (n = this.storage()) == null || n.setItem(ve + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(ve + t), s = i ? JSON.parse(i) : null;
      return z1(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(ve))) continue;
        const o = this.read(s.slice(ve.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(rn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(rn, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(rn)) === t && n.removeItem(rn);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(ve + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Pl = 5e3, Cl = 12;
function gr(e) {
  e().catch(() => {
  });
}
class V1 {
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
    this.sub = null, n && (n.live = !1, t && n.unsub && gr(n.unsub));
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
          gr(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(yt(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Cl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Pl));
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
const D1 = ["power", "voltage", "power_in", "power_out", "control"], T1 = 300;
function wr(e) {
  e().catch(() => {
  });
}
function H1(e, t) {
  var s;
  const n = new Map(t.devices.map((o) => [o.id, o])), i = {};
  for (const o of e.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const a = { inverter: ue(r), controllable: ia(r) };
    for (const l of D1) {
      const c = (s = r.bindings) == null ? void 0 : s[l];
      c && (a[l] = c);
    }
    i[r.id] = a;
  }
  return { power: e, devices: i };
}
class R1 {
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
      }, T1);
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
    this.sub = null, n && (n.live = !1, t && n.unsub && wr(n.unsub));
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
          wr(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(yt(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Cl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Pl));
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
const B1 = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function F1(e) {
  const t = Math.max(0, Math.floor(e / 1e3));
  if (t < 60) return String(t);
  const n = (i) => String(i).padStart(2, "0");
  return t < 3600 ? `${Math.floor(t / 60)}:${n(t % 60)}` : `${Math.floor(t / 3600)}:${n(Math.floor(t / 60) % 60)}:${n(t % 60)}`;
}
const Ll = (e, t) => {
  const n = t ? e == null ? void 0 : e[t] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function U1(e, t) {
  var o;
  const n = Ll(e, t);
  if (!n || n.state.trim() === "") return;
  const i = B1[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const j1 = (e) => {
  const t = e.last_changed ? Date.parse(e.last_changed) : NaN;
  return Number.isFinite(t) ? t : void 0;
};
function hn(e, t) {
  const n = e.bindings ?? {}, i = e.props.kind;
  let s = "none", o = !1, r = !1, a;
  const l = (f, g, y) => {
    if (!f) return;
    a = Ll(t, f);
    const w = (a == null ? void 0 : a.state) ?? "";
    s = g.includes(w) ? "on" : y.includes(w) ? "off" : "no-data";
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
    const f = j1(a);
    f !== void 0 && (d.timerSince = f);
  }
  const p = mt(e).some((f) => f.role === "power") ? U1(t, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (d.power = p), d;
}
function Ol(e, t, n) {
  const i = [];
  if (e.timerSince !== void 0) {
    const s = t.props.kind;
    i.push({ text: F1(n - e.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return e.power !== void 0 && i.push({ text: te(e.power), tone: "device" }), i;
}
const Ei = 1e4, br = 400, W1 = 1e3, yr = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), q1 = ["timer", "power"], Z1 = (e, t) => {
  const n = e == null ? void 0 : e[t];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function zl(e) {
  const t = e.bindings ?? {}, n = e.props.kind, i = [], s = (o, r, a = !1) => {
    o && !i.some((l) => l.entity === o) && i.push({ entity: o, settled: r, valve: a });
  };
  if (n === "smart_button")
    for (const { role: o } of mt(e)) (o === "on" || o === "off" || o === "auto") && s(t[o], !1);
  else n === "wall_switch" ? s(t.state, !0) : n === "valve" && s(t.state, !0, !0);
  return i;
}
function K1(e, t) {
  if (e === "on" || t && e === "open") return t ? "open" : "on";
  if (e === "off" || t && e === "closed") return t ? "closed" : "off";
}
function G1(e, t, n) {
  var i;
  if (e.settled) {
    const s = K1(t.state, e.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (e.entity.startsWith("event.")) {
    if (yr.has(t.state)) return {};
    const s = (i = t.attributes) == null ? void 0 : i.event_type, o = n && n.last !== t.state && typeof s == "string" && s !== "";
    return { value: t.state, text: o ? s : void 0 };
  }
  return { value: t.state, text: n && n.last !== t.state && !yr.has(t.state) ? t.state : void 0 };
}
function vr(e, t, n, i) {
  const s = t === "timer" ? { look: e.look, timerSince: e.timerSince } : { look: e.look, power: e.power };
  return Ol(s, n, i)[0];
}
function X1(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e.devices) for (const i of zl(n)) t.add(i.entity);
  return [...t].sort();
}
class Y1 {
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
    const i = (this.leave.get(t) ?? []).filter((r) => n - r.at < br).map((r) => r.bubble), s = this.events.get(t), o = s ? n - s.at : -1;
    return s && o >= Ei && o < Ei + W1 && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(t, n, i) {
    const s = zl(t), o = `${t.id}|`, r = new Set(s.map((a) => o + a.entity));
    for (const a of [...this.seen.keys()]) a.startsWith(o) && !r.has(a) && this.seen.delete(a);
    for (const a of s) {
      const l = Z1(n, a.entity);
      if (!l) continue;
      const c = o + a.entity, { value: u, text: d } = G1(a, l, this.seen.get(c));
      u !== void 0 && this.seen.set(c, { last: u }), d && this.events.set(t.id, { text: d, at: i });
    }
  }
  updateBubbles(t, n, i) {
    const s = hn(t, n), o = this.bubbles.get(t.id);
    if (o) {
      const r = (this.leave.get(t.id) ?? []).filter((a) => i - a.at < br);
      for (const a of q1) {
        const l = vr(o, a, t, i);
        l && !vr(s, a, t, i) && r.push({ bubble: l, at: i });
      }
      r.length ? this.leave.set(t.id, r) : this.leave.delete(t.id);
    }
    this.bubbles.set(t.id, s);
  }
}
const an = (e) => typeof e == "number" && Number.isFinite(e) ? new Date(e * 1e3).toISOString() : void 0;
function $r(e) {
  e().catch(() => {
  });
}
class Q1 {
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
    this.sub = null, n && (n.live = !1, t && n.unsub && $r(n.unsub));
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
        n.live ? n.unsub = i : $r(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(t) {
    var n;
    for (const [i, s] of Object.entries(t.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: an(s.lc) ?? an(s.lu) });
    for (const [i, s] of Object.entries(t.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, a = s["+"];
      if (a) {
        const l = typeof a.s == "string" && a.s !== o.state;
        typeof a.s == "string" && (r.state = a.s), a.a && typeof a.a == "object" && Object.assign(r.attributes, a.a);
        const c = an(a.lc) ?? (l ? an(a.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const l of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[l];
      this.map.set(i, r);
    }
    for (const i of t.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var J1 = Object.defineProperty, B = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && J1(t, n, s), s;
};
const Bs = class Bs extends ee {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = hc.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Xh(), this.nextObj = Hh(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Da(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new N1(), this.resizeObs = null, this.session = new qh(this), this.haMeta = new Zh(this), this.feed = new V1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new R1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new Y1(), this.entityFeed = new Q1(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => lc(i, (s) => {
      var o;
      return Va(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Fu(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Kh(this), this.activeTool = ji("select", this.ctx), this.input = new P1(this);
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
    this.entityFeed.watch(t ? X1(t) : null);
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
    this.powerFeed.watch(t && this.plan ? this.plan.id : null, t ? H1(this.power, t) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var s;
    const t = (s = this.history) == null ? void 0 : s.current.level, n = Date.now(), i = this.isConnected && this.mode === "binding" && !!t && !!this.hass && t.devices.some((o) => hn(o, this.hass.states).timerSince !== void 0 || this.events.event(o.id, n) !== null || this.events.leaving(o.id, n).length > 0);
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
    const i = this.history.current.power, s = n ?? (i && pu(i, t));
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
      const i = Ba(n, this.power, t.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(t.kind === "wall" ? xs(n, t.id) : t.kind === "opening" ? Jr(n, t.id) : Aa(n, t.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(t) {
    const n = this.power;
    if (t.kind === "powerWire")
      return this.commitPower(Ua(n, t.id)), !0;
    if (t.kind !== "powerBlock") return !1;
    const i = Ha(n, t.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(t, n) {
    this.powerFeed.setPosition(t, n).catch((i) => {
      this.notice = yt(i);
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
    s && (this.view = hr(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(t) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: t });
    const s = $a(n).get(t);
    s && (this.view = hr(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const t = this.level, n = t ? Nh(t, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return $1(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.planView = x1(((t = this.level) == null ? void 0 : t.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const t = Du(this.power, this.ctx.geo());
    t && (this.powerView = k1(t, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var t;
    return L1({
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
    var f, g, y, w;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const t = Bf(!!((g = (f = this.hass) == null ? void 0 : f.themes) != null && g.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power", d = Date.now(), p = (y = this.hass) == null ? void 0 : y.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : ""}"
        style=${w1(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${_h({
      steps: Ph({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        planName: this.plan.name,
        onRename: (m) => {
          this.plan = { ...this.plan, name: m }, c.markDirty();
        },
        onMode: (m) => this.setMode(m)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : b,
      onPickPlan: (m) => this.session.pickPlan(m),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${c1(this, n)}
        ${u1(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(m) => m.preventDefault()}>
            ${this.grid ? S1(this.view, a, l, t, u ? 0.1 : 1) : b}
            ${this.mode === "power" ? Tf(this.power, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : uf(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (m) => this.feed.stateOf(m),
      live: (m) => hn(m, p),
      bubbles: (m) => {
        const $ = hn(m, p), k = this.events.event(m.id, d);
        return {
          shown: [...Ol($, m, d), ...k ? [{ text: k.text, tone: "event", key: k.at }] : []],
          leaving: this.events.leaving(m.id, d)
        };
      }
    })}
            ${i.tracker ? m1(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: g1(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : b}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? C1({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : b}
        </div>
        ${h1({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? h(`snap.${i.snap.kind}`) : null,
      onGrid: (m) => {
        this.grid = m;
      },
      cones: this.cones,
      onCones: (m) => {
        this.cones = m;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: u
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
Bs.styles = b1;
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
