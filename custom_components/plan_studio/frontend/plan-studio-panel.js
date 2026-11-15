/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = globalThis, be = Kt.ShadowRoot && (Kt.ShadyCSS === void 0 || Kt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ke = Symbol(), De = /* @__PURE__ */ new WeakMap();
let En = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ke) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (be && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = De.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && De.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const si = (n) => new En(typeof n == "string" ? n : n + "", void 0, ke), ri = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new En(e, n, ke);
}, oi = (n, t) => {
  if (be) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = Kt.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, Ue = be ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return si(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: li, defineProperty: ai, getOwnPropertyDescriptor: ci, getOwnPropertyNames: hi, getOwnPropertySymbols: ui, getPrototypeOf: di } = Object, ot = globalThis, Be = ot.trustedTypes, fi = Be ? Be.emptyScript : "", re = ot.reactiveElementPolyfillSupport, Tt = (n, t) => n, qt = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? fi : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ee = (n, t) => !li(n, t), je = { attribute: !0, type: String, converter: qt, reflect: !1, useDefault: !1, hasChanged: Ee };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ot.litPropertyMetadata ?? (ot.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let wt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = je) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && ai(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = ci(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const l = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? je;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Tt("elementProperties"))) return;
    const t = di(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Tt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Tt("properties"))) {
      const e = this.properties, i = [...hi(e), ...ui(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Ue(s));
    } else t !== void 0 && e.push(Ue(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return oi(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var r;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : qt).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : qt;
      this._$Em = s;
      const h = a.fromAttribute(e, l.type);
      this[s] = h ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (r = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? Ee)(r, e) || i.useDefault && i.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: l } = o, a = this[r];
        l !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
wt.elementStyles = [], wt.shadowRootOptions = { mode: "open" }, wt[Tt("elementProperties")] = /* @__PURE__ */ new Map(), wt[Tt("finalized")] = /* @__PURE__ */ new Map(), re == null || re({ ReactiveElement: wt }), (ot.reactiveElementVersions ?? (ot.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Lt = globalThis, Fe = (n) => n, Vt = Lt.trustedTypes, He = Vt ? Vt.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Sn = "$lit$", nt = `lit$${Math.random().toFixed(9).slice(2)}$`, _n = "?" + nt, pi = `<${_n}>`, gt = document, zt = () => gt.createComment(""), Dt = (n) => n === null || typeof n != "object" && typeof n != "function", Se = Array.isArray, gi = (n) => Se(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", oe = `[ 	
\f\r]`, Pt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, We = /-->/g, Ke = />/g, ht = RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ye = /'/g, qe = /"/g, An = /^(?:script|style|textarea|title)$/i, Mn = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), E = Mn(1), R = Mn(2), X = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Ve = /* @__PURE__ */ new WeakMap(), ut = gt.createTreeWalker(gt, 129);
function In(n, t) {
  if (!Se(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return He !== void 0 ? He.createHTML(t) : t;
}
const yi = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Pt;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let h, f, c = -1, d = 0;
    for (; d < a.length && (o.lastIndex = d, f = o.exec(a), f !== null); ) d = o.lastIndex, o === Pt ? f[1] === "!--" ? o = We : f[1] !== void 0 ? o = Ke : f[2] !== void 0 ? (An.test(f[2]) && (s = RegExp("</" + f[2], "g")), o = ht) : f[3] !== void 0 && (o = ht) : o === ht ? f[0] === ">" ? (o = s ?? Pt, c = -1) : f[1] === void 0 ? c = -2 : (c = o.lastIndex - f[2].length, h = f[1], o = f[3] === void 0 ? ht : f[3] === '"' ? qe : Ye) : o === qe || o === Ye ? o = ht : o === We || o === Ke ? o = Pt : (o = ht, s = void 0);
    const u = o === ht && n[l + 1].startsWith("/>") ? " " : "";
    r += o === Pt ? a + pi : c >= 0 ? (i.push(h), a.slice(0, c) + Sn + a.slice(c) + nt + u) : a + nt + (c === -2 ? l : u);
  }
  return [In(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ut {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, f] = yi(t, e);
    if (this.el = Ut.createElement(h, i), ut.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = ut.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Sn)) {
          const d = f[o++], u = s.getAttribute(c).split(nt), g = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: r, name: g[2], strings: u, ctor: g[1] === "." ? xi : g[1] === "?" ? wi : g[1] === "@" ? $i : Jt }), s.removeAttribute(c);
        } else c.startsWith(nt) && (a.push({ type: 6, index: r }), s.removeAttribute(c));
        if (An.test(s.tagName)) {
          const c = s.textContent.split(nt), d = c.length - 1;
          if (d > 0) {
            s.textContent = Vt ? Vt.emptyScript : "";
            for (let u = 0; u < d; u++) s.append(c[u], zt()), ut.nextNode(), a.push({ type: 2, index: ++r });
            s.append(c[d], zt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === _n) a.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(nt, c + 1)) !== -1; ) a.push({ type: 7, index: r }), c += nt.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = gt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function kt(n, t, e = n, i) {
  var o, l;
  if (t === X) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = Dt(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = kt(n, s._$AS(n, t.values), s, i)), t;
}
class mi {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? gt).importNode(e, !0);
    ut.currentNode = s;
    let r = ut.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new _e(r, r.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (h = new vi(r, this, t)), this._$AV.push(h), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (r = ut.nextNode(), o++);
    }
    return ut.currentNode = gt, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
let _e = class Pn {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = kt(this, t, e), Dt(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== X && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : gi(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && Dt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(gt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ut.createElement(In(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const o = new mi(s, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Ve.get(t.strings);
    return e === void 0 && Ve.set(t.strings, e = new Ut(t)), e;
  }
  k(t) {
    Se(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new Pn(this.O(zt()), this.O(zt()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = Fe(t).nextSibling;
      Fe(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
};
class Jt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = kt(this, t, e, 0), o = !Dt(t) || t !== this._$AH && t !== X, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = r[0], a = 0; a < r.length - 1; a++) h = kt(this, l[i + a], e, a), h === X && (h = this._$AH[a]), o || (o = !Dt(h) || h !== this._$AH[a]), h === v ? t = v : t !== v && (t += (h ?? "") + r[a + 1]), this._$AH[a] = h;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class xi extends Jt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class wi extends Jt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
let $i = class extends Jt {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = kt(this, t, e, 0) ?? v) === X) return;
    const i = this._$AH, s = t === v && i !== v || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class vi {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    kt(this, t);
  }
}
const le = Lt.litHtmlPolyfillSupport;
le == null || le(Ut, _e), (Lt.litHtmlVersions ?? (Lt.litHtmlVersions = [])).push("3.3.3");
const bi = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new _e(t.insertBefore(zt(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ft = globalThis;
let Nt = class extends wt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = bi(e, this.renderRoot, this.renderOptions);
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
    return X;
  }
};
var kn;
Nt._$litElement$ = !0, Nt.finalized = !0, (kn = ft.litElementHydrateSupport) == null || kn.call(ft, { LitElement: Nt });
const ae = ft.litElementPolyfillSupport;
ae == null || ae({ LitElement: Nt });
(ft.litElementVersions ?? (ft.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ki = { attribute: !0, type: String, converter: qt, reflect: !1, hasChanged: Ee }, Ei = (n = ki, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function te(n) {
  return (t, e) => typeof e == "object" ? Ei(n, t, e) : ((i, s, r) => {
    const o = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function j(n) {
  return te({ ...n, state: !0, attribute: !1 });
}
function G() {
  const n = new Uint8Array(6);
  return crypto.getRandomValues(n), Array.from(n, (t) => t.toString(16).padStart(2, "0")).join("");
}
const Ct = {
  bearing: 400,
  partition: 100,
  railing: 100,
  fence: 50
}, On = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Si(n) {
  return {
    id: G(),
    name: n,
    schemaVersion: 1,
    revision: 0,
    levels: [
      { id: G(), name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [] }
    ]
  };
}
function I(n, t) {
  return { x: n.x + t.x, y: n.y + t.y };
}
function P(n, t) {
  return { x: n.x - t.x, y: n.y - t.y };
}
function S(n, t) {
  return { x: n.x * t, y: n.y * t };
}
function Y(n, t) {
  return n.x * t.x + n.y * t.y;
}
function Et(n, t) {
  return n.x * t.y - n.y * t.x;
}
function Rn(n) {
  return Math.hypot(n.x, n.y);
}
function C(n, t) {
  return Rn(P(t, n));
}
function ee(n) {
  const t = Rn(n);
  return t === 0 ? { x: 0, y: 0 } : S(n, 1 / t);
}
function Z(n) {
  return { x: n.y, y: -n.x };
}
function Ae(n, t, e) {
  return { x: n.x + (t.x - n.x) * e, y: n.y + (t.y - n.y) * e };
}
function st(n, t, e, i) {
  const s = Et(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const r = Et(P(e, n), i) / s;
  return I(n, S(t, r));
}
function Me(n, t, e) {
  const i = P(e, t), s = Y(i, i);
  return s === 0 ? 0 : Y(P(n, t), i) / s;
}
function ne(n, t) {
  let e = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const r = t[i], o = t[s];
    r.y > n.y != o.y > n.y && n.x < (o.x - r.x) * (n.y - r.y) / (o.y - r.y) + r.x && (e = !e);
  }
  return e;
}
function Bt(n) {
  let t = 0;
  for (let e = 0; e < n.length; e++) {
    const i = n[e], s = n[(e + 1) % n.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
class at {
  constructor(t, e) {
    this.next = null, this.key = t, this.data = e, this.left = null, this.right = null;
  }
}
function _i(n, t) {
  return n > t ? 1 : n < t ? -1 : 0;
}
function it(n, t, e) {
  const i = new at(null, null);
  let s = i, r = i;
  for (; ; ) {
    const o = e(n, t.key);
    if (o < 0) {
      if (t.left === null) break;
      if (e(n, t.left.key) < 0) {
        const l = t.left;
        if (t.left = l.right, l.right = t, t = l, t.left === null) break;
      }
      r.left = t, r = t, t = t.left;
    } else if (o > 0) {
      if (t.right === null) break;
      if (e(n, t.right.key) > 0) {
        const l = t.right;
        if (t.right = l.left, l.left = t, t = l, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, r.left = t.right, t.left = i.right, t.right = i.left, t;
}
function ce(n, t, e, i) {
  const s = new at(n, t);
  if (e === null)
    return s.left = s.right = null, s;
  e = it(n, e, i);
  const r = i(n, e.key);
  return r < 0 ? (s.left = e.left, s.right = e, e.left = null) : r >= 0 && (s.right = e.right, s.left = e, e.right = null), s;
}
function Ge(n, t, e) {
  let i = null, s = null;
  if (t) {
    t = it(n, t, e);
    const r = e(t.key, n);
    r === 0 ? (i = t.left, s = t.right) : r < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function Ai(n, t, e) {
  return t === null ? n : (n === null || (t = it(n.key, t, e), t.left = n), t);
}
function de(n, t, e, i, s) {
  if (n) {
    i(`${t}${e ? "└── " : "├── "}${s(n)}
`);
    const r = t + (e ? "    " : "│   ");
    n.left && de(n.left, r, !1, i, s), n.right && de(n.right, r, !0, i, s);
  }
}
class Ie {
  constructor(t = _i) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, e) {
    return this._size++, this._root = ce(t, e, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, e) {
    const i = new at(t, e);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, r = it(t, this._root, s), o = s(t, r.key);
    return o === 0 ? this._root = r : (o < 0 ? (i.left = r.left, i.right = r, r.left = null) : o > 0 && (i.right = r.right, i.left = r, r.right = null), this._size++, this._root = i), this._root;
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
  _remove(t, e, i) {
    let s;
    return e === null ? null : (e = it(t, e, i), i(t, e.key) === 0 ? (e.left === null ? s = e.right : (s = it(t, e.left, i), s.right = e.right), this._size--, s) : e);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = it(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
    }
    return null;
  }
  /**
   * Find without splaying
   */
  findStatic(t) {
    let e = this._root;
    const i = this._comparator;
    for (; e; ) {
      const s = i(t, e.key);
      if (s === 0) return e;
      s < 0 ? e = e.left : e = e.right;
    }
    return null;
  }
  find(t) {
    return this._root && (this._root = it(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
  }
  contains(t) {
    let e = this._root;
    const i = this._comparator;
    for (; e; ) {
      const s = i(t, e.key);
      if (s === 0) return !0;
      s < 0 ? e = e.left : e = e.right;
    }
    return !1;
  }
  forEach(t, e) {
    let i = this._root;
    const s = [];
    let r = !1;
    for (; !r; )
      i !== null ? (s.push(i), i = i.left) : s.length !== 0 ? (i = s.pop(), t.call(e, i), i = i.right) : r = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(t, e, i, s) {
    const r = [], o = this._comparator;
    let l = this._root, a;
    for (; r.length !== 0 || l; )
      if (l)
        r.push(l), l = l.left;
      else {
        if (l = r.pop(), a = o(l.key, e), a > 0)
          break;
        if (o(l.key, t) >= 0 && i.call(s, l))
          return this;
        l = l.right;
      }
    return this;
  }
  /**
   * Returns array of keys
   */
  keys() {
    const t = [];
    return this.forEach(({ key: e }) => {
      t.push(e);
    }), t;
  }
  /**
   * Returns array of all the data in the nodes
   */
  values() {
    const t = [];
    return this.forEach(({ data: e }) => {
      t.push(e);
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
    let e = this._root, i = !1, s = 0;
    const r = [];
    for (; !i; )
      if (e)
        r.push(e), e = e.left;
      else if (r.length > 0) {
        if (e = r.pop(), s === t) return e;
        s++, e = e.right;
      } else i = !0;
    return null;
  }
  next(t) {
    let e = this._root, i = null;
    if (t.right) {
      for (i = t.right; i.left; ) i = i.left;
      return i;
    }
    const s = this._comparator;
    for (; e; ) {
      const r = s(t.key, e.key);
      if (r === 0) break;
      r < 0 ? (i = e, e = e.left) : e = e.right;
    }
    return i;
  }
  prev(t) {
    let e = this._root, i = null;
    if (t.left !== null) {
      for (i = t.left; i.right; ) i = i.right;
      return i;
    }
    const s = this._comparator;
    for (; e; ) {
      const r = s(t.key, e.key);
      if (r === 0) break;
      r < 0 ? e = e.left : (i = e, e = e.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Ii(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, e = [], i = !1) {
    let s = t.length;
    const r = this._comparator;
    if (i && ge(t, e, 0, s - 1, r), this._root === null)
      this._root = fe(t, e, 0, s), this._size = s;
    else {
      const o = Pi(
        this.toList(),
        Mi(t, e),
        r
      );
      s = this._size + s, this._root = pe({ head: o }, 0, s);
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
  toString(t = (e) => String(e.key)) {
    const e = [];
    return de(this._root, "", !0, (i) => e.push(i), t), e.join("");
  }
  update(t, e, i) {
    const s = this._comparator;
    let { left: r, right: o } = Ge(t, this._root, s);
    s(t, e) < 0 ? o = ce(e, i, o, s) : r = ce(e, i, r, s), this._root = Ai(r, o, s);
  }
  split(t) {
    return Ge(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const e = [];
    let i = !1;
    for (; !i; )
      t !== null ? (e.push(t), t = t.left) : e.length !== 0 ? (t = e.pop(), yield t, t = t.right) : i = !0;
  }
}
function fe(n, t, e, i) {
  const s = i - e;
  if (s > 0) {
    const r = e + Math.floor(s / 2), o = n[r], l = t[r], a = new at(o, l);
    return a.left = fe(n, t, e, r), a.right = fe(n, t, r + 1, i), a;
  }
  return null;
}
function Mi(n, t) {
  const e = new at(null, null);
  let i = e;
  for (let s = 0; s < n.length; s++)
    i = i.next = new at(n[s], t[s]);
  return i.next = null, e.next;
}
function Ii(n) {
  let t = n;
  const e = [];
  let i = !1;
  const s = new at(null, null);
  let r = s;
  for (; !i; )
    t ? (e.push(t), t = t.left) : e.length > 0 ? (t = r = r.next = e.pop(), t = t.right) : i = !0;
  return r.next = null, s.next;
}
function pe(n, t, e) {
  const i = e - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), r = pe(n, t, s), o = n.head;
    return o.left = r, n.head = n.head.next, o.right = pe(n, s + 1, e), o;
  }
  return null;
}
function Pi(n, t, e) {
  const i = new at(null, null);
  let s = i, r = n, o = t;
  for (; r !== null && o !== null; )
    e(r.key, o.key) < 0 ? (s.next = r, r = r.next) : (s.next = o, o = o.next), s = s.next;
  return r !== null ? s.next = r : o !== null && (s.next = o), i.next;
}
function ge(n, t, e, i, s) {
  if (e >= i) return;
  const r = n[e + i >> 1];
  let o = e - 1, l = i + 1;
  for (; ; ) {
    do
      o++;
    while (s(n[o], r) < 0);
    do
      l--;
    while (s(n[l], r) > 0);
    if (o >= l) break;
    let a = n[o];
    n[o] = n[l], n[l] = a, a = t[o], t[o] = t[l], t[l] = a;
  }
  ge(n, t, e, l, s), ge(n, t, l + 1, i, s);
}
const J = 11102230246251565e-32, U = 134217729, Oi = (3 + 8 * J) * J;
function he(n, t, e, i, s) {
  let r, o, l, a, h = t[0], f = i[0], c = 0, d = 0;
  f > h == f > -h ? (r = h, h = t[++c]) : (r = f, f = i[++d]);
  let u = 0;
  if (c < n && d < e)
    for (f > h == f > -h ? (o = h + r, l = r - (o - h), h = t[++c]) : (o = f + r, l = r - (o - f), f = i[++d]), r = o, l !== 0 && (s[u++] = l); c < n && d < e; )
      f > h == f > -h ? (o = r + h, a = o - r, l = r - (o - a) + (h - a), h = t[++c]) : (o = r + f, a = o - r, l = r - (o - a) + (f - a), f = i[++d]), r = o, l !== 0 && (s[u++] = l);
  for (; c < n; )
    o = r + h, a = o - r, l = r - (o - a) + (h - a), h = t[++c], r = o, l !== 0 && (s[u++] = l);
  for (; d < e; )
    o = r + f, a = o - r, l = r - (o - a) + (f - a), f = i[++d], r = o, l !== 0 && (s[u++] = l);
  return (r !== 0 || u === 0) && (s[u++] = r), u;
}
function Ri(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function y(n) {
  return new Float64Array(n);
}
const Ti = (3 + 16 * J) * J, Li = (2 + 12 * J) * J, Ni = (9 + 64 * J) * J * J, mt = y(4), Xe = y(8), Ze = y(12), Qe = y(16), W = y(4);
function Ci(n, t, e, i, s, r, o) {
  let l, a, h, f, c, d, u, g, p, m, x, $, b, k, M, A, _, O;
  const D = n - s, F = e - s, H = t - r, q = i - r;
  k = D * q, d = U * D, u = d - (d - D), g = D - u, d = U * q, p = d - (d - q), m = q - p, M = g * m - (k - u * p - g * p - u * m), A = H * F, d = U * H, u = d - (d - H), g = H - u, d = U * F, p = d - (d - F), m = F - p, _ = g * m - (A - u * p - g * p - u * m), x = M - _, c = M - x, mt[0] = M - (x + c) + (c - _), $ = k + x, c = $ - k, b = k - ($ - c) + (x - c), x = b - A, c = b - x, mt[1] = b - (x + c) + (c - A), O = $ + x, c = O - $, mt[2] = $ - (O - c) + (x - c), mt[3] = O;
  let Q = Ri(4, mt), It = Li * o;
  if (Q >= It || -Q >= It || (c = n - D, l = n - (D + c) + (c - s), c = e - F, h = e - (F + c) + (c - s), c = t - H, a = t - (H + c) + (c - r), c = i - q, f = i - (q + c) + (c - r), l === 0 && a === 0 && h === 0 && f === 0) || (It = Ni * o + Oi * Math.abs(Q), Q += D * f + q * l - (H * h + F * a), Q >= It || -Q >= It)) return Q;
  k = l * q, d = U * l, u = d - (d - l), g = l - u, d = U * q, p = d - (d - q), m = q - p, M = g * m - (k - u * p - g * p - u * m), A = a * F, d = U * a, u = d - (d - a), g = a - u, d = U * F, p = d - (d - F), m = F - p, _ = g * m - (A - u * p - g * p - u * m), x = M - _, c = M - x, W[0] = M - (x + c) + (c - _), $ = k + x, c = $ - k, b = k - ($ - c) + (x - c), x = b - A, c = b - x, W[1] = b - (x + c) + (c - A), O = $ + x, c = O - $, W[2] = $ - (O - c) + (x - c), W[3] = O;
  const ei = he(4, mt, 4, W, Xe);
  k = D * f, d = U * D, u = d - (d - D), g = D - u, d = U * f, p = d - (d - f), m = f - p, M = g * m - (k - u * p - g * p - u * m), A = H * h, d = U * H, u = d - (d - H), g = H - u, d = U * h, p = d - (d - h), m = h - p, _ = g * m - (A - u * p - g * p - u * m), x = M - _, c = M - x, W[0] = M - (x + c) + (c - _), $ = k + x, c = $ - k, b = k - ($ - c) + (x - c), x = b - A, c = b - x, W[1] = b - (x + c) + (c - A), O = $ + x, c = O - $, W[2] = $ - (O - c) + (x - c), W[3] = O;
  const ni = he(ei, Xe, 4, W, Ze);
  k = l * f, d = U * l, u = d - (d - l), g = l - u, d = U * f, p = d - (d - f), m = f - p, M = g * m - (k - u * p - g * p - u * m), A = a * h, d = U * a, u = d - (d - a), g = a - u, d = U * h, p = d - (d - h), m = h - p, _ = g * m - (A - u * p - g * p - u * m), x = M - _, c = M - x, W[0] = M - (x + c) + (c - _), $ = k + x, c = $ - k, b = k - ($ - c) + (x - c), x = b - A, c = b - x, W[1] = b - (x + c) + (c - A), O = $ + x, c = O - $, W[2] = $ - (O - c) + (x - c), W[3] = O;
  const ii = he(ni, Ze, 4, W, Qe);
  return Qe[ii - 1];
}
function zi(n, t, e, i, s, r) {
  const o = (t - r) * (e - s), l = (n - s) * (i - r), a = o - l, h = Math.abs(o + l);
  return Math.abs(a) >= Ti * h ? a : -Ci(n, t, e, i, s, r, h);
}
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(8);
y(8);
y(8);
y(4);
y(8);
y(8);
y(16);
y(12);
y(192);
y(192);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(8);
y(8);
y(8);
y(8);
y(8);
y(8);
y(8);
y(8);
y(8);
y(4);
y(4);
y(4);
y(8);
y(16);
y(16);
y(16);
y(32);
y(32);
y(48);
y(64);
y(1152);
y(1152);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(4);
y(24);
y(24);
y(24);
y(24);
y(24);
y(24);
y(24);
y(24);
y(24);
y(24);
y(1152);
y(1152);
y(1152);
y(1152);
y(1152);
y(2304);
y(2304);
y(3456);
y(5760);
y(8);
y(8);
y(8);
y(16);
y(24);
y(48);
y(48);
y(96);
y(192);
y(384);
y(384);
y(384);
y(768);
y(96);
y(96);
y(96);
y(1152);
const Ot = (n, t) => n.ll.x <= t.x && t.x <= n.ur.x && n.ll.y <= t.y && t.y <= n.ur.y, ye = (n, t) => {
  if (t.ur.x < n.ll.x || n.ur.x < t.ll.x || t.ur.y < n.ll.y || n.ur.y < t.ll.y) return null;
  const e = n.ll.x < t.ll.x ? t.ll.x : n.ll.x, i = n.ur.x < t.ur.x ? n.ur.x : t.ur.x, s = n.ll.y < t.ll.y ? t.ll.y : n.ll.y, r = n.ur.y < t.ur.y ? n.ur.y : t.ur.y;
  return {
    ll: {
      x: e,
      y: s
    },
    ur: {
      x: i,
      y: r
    }
  };
};
let rt = Number.EPSILON;
rt === void 0 && (rt = Math.pow(2, -52));
const Di = rt * rt, Je = (n, t) => {
  if (-rt < n && n < rt && -rt < t && t < rt)
    return 0;
  const e = n - t;
  return e * e < Di * n * t ? 0 : n < t ? -1 : 1;
};
class Ui {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new tn(), this.yRounder = new tn();
  }
  round(t, e) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(e)
    };
  }
}
class tn {
  constructor() {
    this.tree = new Ie(), this.round(0);
  }
  // Note: this can rounds input values backwards or forwards.
  //       You might ask, why not restrict this to just rounding
  //       forwards? Wouldn't that allow left endpoints to always
  //       remain left endpoints during splitting (never change to
  //       right). No - it wouldn't, because we snap intersections
  //       to endpoints (to establish independence from the segment
  //       angle for t-intersections).
  round(t) {
    const e = this.tree.add(t), i = this.tree.prev(e);
    if (i !== null && Je(e.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(e);
    return s !== null && Je(e.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const jt = new Ui(), Yt = (n, t) => n.x * t.y - n.y * t.x, Tn = (n, t) => n.x * t.x + n.y * t.y, en = (n, t, e) => {
  const i = zi(n.x, n.y, t.x, t.y, e.x, e.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Gt = (n) => Math.sqrt(Tn(n, n)), Bi = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return Yt(s, i) / Gt(s) / Gt(i);
}, ji = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return Tn(s, i) / Gt(s) / Gt(i);
}, nn = (n, t, e) => t.y === 0 ? null : {
  x: n.x + t.x / t.y * (e - n.y),
  y: e
}, sn = (n, t, e) => t.x === 0 ? null : {
  x: e,
  y: n.y + t.y / t.x * (e - n.x)
}, Fi = (n, t, e, i) => {
  if (t.x === 0) return sn(e, i, n.x);
  if (i.x === 0) return sn(n, t, e.x);
  if (t.y === 0) return nn(e, i, n.y);
  if (i.y === 0) return nn(n, t, e.y);
  const s = Yt(t, i);
  if (s == 0) return null;
  const r = {
    x: e.x - n.x,
    y: e.y - n.y
  }, o = Yt(r, t) / s, l = Yt(r, i) / s, a = n.x + l * t.x, h = e.x + o * i.x, f = n.y + l * t.y, c = e.y + o * i.y, d = (a + h) / 2, u = (f + c) / 2;
  return {
    x: d,
    y: u
  };
};
class K {
  // for ordering sweep events in the sweep event queue
  static compare(t, e) {
    const i = K.comparePoints(t.point, e.point);
    return i !== 0 ? i : (t.point !== e.point && t.link(e), t.isLeft !== e.isLeft ? t.isLeft ? 1 : -1 : lt.compare(t.segment, e.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(t, e) {
    return t.x < e.x ? -1 : t.x > e.x ? 1 : t.y < e.y ? -1 : t.y > e.y ? 1 : 0;
  }
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(t, e) {
    t.events === void 0 ? t.events = [this] : t.events.push(this), this.point = t, this.isLeft = e;
  }
  link(t) {
    if (t.point === this.point)
      throw new Error("Tried to link already linked events");
    const e = t.point.events;
    for (let i = 0, s = e.length; i < s; i++) {
      const r = e[i];
      this.point.events.push(r), r.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const t = this.point.events.length;
    for (let e = 0; e < t; e++) {
      const i = this.point.events[e];
      if (i.segment.consumedBy === void 0)
        for (let s = e + 1; s < t; s++) {
          const r = this.point.events[s];
          r.consumedBy === void 0 && i.otherSE.point.events === r.otherSE.point.events && i.segment.consume(r.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const t = [];
    for (let e = 0, i = this.point.events.length; e < i; e++) {
      const s = this.point.events[e];
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
    const e = /* @__PURE__ */ new Map(), i = (s) => {
      const r = s.otherSE;
      e.set(s, {
        sine: Bi(this.point, t.point, r.point),
        cosine: ji(this.point, t.point, r.point)
      });
    };
    return (s, r) => {
      e.has(s) || i(s), e.has(r) || i(r);
      const {
        sine: o,
        cosine: l
      } = e.get(s), {
        sine: a,
        cosine: h
      } = e.get(r);
      return o >= 0 && a >= 0 ? l < h ? 1 : l > h ? -1 : 0 : o < 0 && a < 0 ? l < h ? -1 : l > h ? 1 : 0 : a < o ? -1 : a > o ? 1 : 0;
    };
  }
}
let Hi = 0;
class lt {
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
  static compare(t, e) {
    const i = t.leftSE.point.x, s = e.leftSE.point.x, r = t.rightSE.point.x, o = e.rightSE.point.x;
    if (o < i) return 1;
    if (r < s) return -1;
    const l = t.leftSE.point.y, a = e.leftSE.point.y, h = t.rightSE.point.y, f = e.rightSE.point.y;
    if (i < s) {
      if (a < l && a < h) return 1;
      if (a > l && a > h) return -1;
      const c = t.comparePoint(e.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const d = e.comparePoint(t.rightSE.point);
      return d !== 0 ? d : -1;
    }
    if (i > s) {
      if (l < a && l < f) return -1;
      if (l > a && l > f) return 1;
      const c = e.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const d = t.comparePoint(e.rightSE.point);
      return d < 0 ? 1 : d > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (r < o) {
      const c = e.comparePoint(t.rightSE.point);
      if (c !== 0) return c;
    }
    if (r > o) {
      const c = t.comparePoint(e.rightSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
    }
    if (r !== o) {
      const c = h - l, d = r - i, u = f - a, g = o - s;
      if (c > d && u < g) return 1;
      if (c < d && u > g) return -1;
    }
    return r > o ? 1 : r < o || h < f ? -1 : h > f ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, e, i, s) {
    this.id = ++Hi, this.leftSE = t, t.segment = this, t.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, e, i) {
    let s, r, o;
    const l = K.comparePoints(t, e);
    if (l < 0)
      s = t, r = e, o = 1;
    else if (l > 0)
      s = e, r = t, o = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const a = new K(s, !0), h = new K(r, !1);
    return new lt(a, h, [i], [o]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(t) {
    this.rightSE = t, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const t = this.leftSE.point.y, e = this.rightSE.point.y;
    return {
      ll: {
        x: this.leftSE.point.x,
        y: t < e ? t : e
      },
      ur: {
        x: this.rightSE.point.x,
        y: t > e ? t : e
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
    const e = this.leftSE.point, i = this.rightSE.point, s = this.vector();
    if (e.x === i.x)
      return t.x === e.x ? 0 : t.x < e.x ? 1 : -1;
    const r = (t.y - e.y) / s.y, o = e.x + r * s.x;
    if (t.x === o) return 0;
    const l = (t.x - e.x) / s.x, a = e.y + l * s.y;
    return t.y === a ? 0 : t.y < a ? -1 : 1;
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
    const e = this.bbox(), i = t.bbox(), s = ye(e, i);
    if (s === null) return null;
    const r = this.leftSE.point, o = this.rightSE.point, l = t.leftSE.point, a = t.rightSE.point, h = Ot(e, l) && this.comparePoint(l) === 0, f = Ot(i, r) && t.comparePoint(r) === 0, c = Ot(e, a) && this.comparePoint(a) === 0, d = Ot(i, o) && t.comparePoint(o) === 0;
    if (f && h)
      return d && !c ? o : !d && c ? a : null;
    if (f)
      return c && r.x === a.x && r.y === a.y ? null : r;
    if (h)
      return d && o.x === l.x && o.y === l.y ? null : l;
    if (d && c) return null;
    if (d) return o;
    if (c) return a;
    const u = Fi(r, this.vector(), l, t.vector());
    return u === null || !Ot(s, u) ? null : jt.round(u.x, u.y);
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
    const e = [], i = t.events !== void 0, s = new K(t, !0), r = new K(t, !1), o = this.rightSE;
    this.replaceRightSE(r), e.push(r), e.push(s);
    const l = new lt(s, o, this.rings.slice(), this.windings.slice());
    return K.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), K.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), r.checkForConsuming()), e;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const t = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = t, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let e = 0, i = this.windings.length; e < i; e++)
      this.windings[e] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(t) {
    let e = this, i = t;
    for (; e.consumedBy; ) e = e.consumedBy;
    for (; i.consumedBy; ) i = i.consumedBy;
    const s = lt.compare(e, i);
    if (s !== 0) {
      if (s > 0) {
        const r = e;
        e = i, i = r;
      }
      if (e.prev === i) {
        const r = e;
        e = i, i = r;
      }
      for (let r = 0, o = i.rings.length; r < o; r++) {
        const l = i.rings[r], a = i.windings[r], h = e.rings.indexOf(l);
        h === -1 ? (e.rings.push(l), e.windings.push(a)) : e.windings[h] += a;
      }
      i.rings = null, i.windings = null, i.consumedBy = e, i.leftSE.consumedBy = e.leftSE, i.rightSE.consumedBy = e.rightSE;
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
    const e = this._afterState.rings, i = this._afterState.windings, s = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const h = this.rings[l], f = this.windings[l], c = e.indexOf(h);
      c === -1 ? (e.push(h), i.push(f)) : i[c] += f;
    }
    const r = [], o = [];
    for (let l = 0, a = e.length; l < a; l++) {
      if (i[l] === 0) continue;
      const h = e[l], f = h.poly;
      if (o.indexOf(f) === -1)
        if (h.isExterior) r.push(f);
        else {
          o.indexOf(f) === -1 && o.push(f);
          const c = r.indexOf(h.poly);
          c !== -1 && r.splice(c, 1);
        }
    }
    for (let l = 0, a = r.length; l < a; l++) {
      const h = r[l].multiPoly;
      s.indexOf(h) === -1 && s.push(h);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, e = this.afterState().multiPolys;
    switch (V.type) {
      case "union": {
        const i = t.length === 0, s = e.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < e.length ? (i = t.length, s = e.length) : (i = e.length, s = t.length), this._isInResult = s === V.numMultiPolys && i < s;
        break;
      }
      case "xor": {
        const i = Math.abs(t.length - e.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (s) => s.length === 1 && s[0].isSubject;
        this._isInResult = i(t) !== i(e);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${V.type}`);
    }
    return this._isInResult;
  }
}
class rn {
  constructor(t, e, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = e, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = jt.round(t[0][0], t[0][1]);
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
    let r = s;
    for (let o = 1, l = t.length; o < l; o++) {
      if (typeof t[o][0] != "number" || typeof t[o][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let a = jt.round(t[o][0], t[o][1]);
      a.x === r.x && a.y === r.y || (this.segments.push(lt.fromRing(r, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), r = a);
    }
    (s.x !== r.x || s.y !== r.y) && this.segments.push(lt.fromRing(r, s, this));
  }
  getSweepEvents() {
    const t = [];
    for (let e = 0, i = this.segments.length; e < i; e++) {
      const s = this.segments[e];
      t.push(s.leftSE), t.push(s.rightSE);
    }
    return t;
  }
}
class Wi {
  constructor(t, e) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new rn(t[0], this, !0), this.bbox = {
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
      const r = new rn(t[i], this, !1);
      r.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = r.bbox.ll.x), r.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = r.bbox.ll.y), r.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = r.bbox.ur.x), r.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = r.bbox.ur.y), this.interiorRings.push(r);
    }
    this.multiPoly = e;
  }
  getSweepEvents() {
    const t = this.exteriorRing.getSweepEvents();
    for (let e = 0, i = this.interiorRings.length; e < i; e++) {
      const s = this.interiorRings[e].getSweepEvents();
      for (let r = 0, o = s.length; r < o; r++)
        t.push(s[r]);
    }
    return t;
  }
}
class on {
  constructor(t, e) {
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
      const r = new Wi(t[i], this);
      r.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = r.bbox.ll.x), r.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = r.bbox.ll.y), r.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = r.bbox.ur.x), r.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = r.bbox.ur.y), this.polys.push(r);
    }
    this.isSubject = e;
  }
  getSweepEvents() {
    const t = [];
    for (let e = 0, i = this.polys.length; e < i; e++) {
      const s = this.polys[e].getSweepEvents();
      for (let r = 0, o = s.length; r < o; r++)
        t.push(s[r]);
    }
    return t;
  }
}
class Xt {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const e = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const r = t[i];
      if (!r.isInResult() || r.ringOut) continue;
      let o = null, l = r.leftSE, a = r.rightSE;
      const h = [l], f = l.point, c = [];
      for (; o = l, l = a, h.push(l), l.point !== f; )
        for (; ; ) {
          const d = l.getAvailableLinkedEvents();
          if (d.length === 0) {
            const p = h[0].point, m = h[h.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${p.x}, ${p.y}]. Last matching segment found ends at [${m.x}, ${m.y}].`);
          }
          if (d.length === 1) {
            a = d[0].otherSE;
            break;
          }
          let u = null;
          for (let p = 0, m = c.length; p < m; p++)
            if (c[p].point === l.point) {
              u = p;
              break;
            }
          if (u !== null) {
            const p = c.splice(u)[0], m = h.splice(p.index);
            m.unshift(m[0].otherSE), e.push(new Xt(m.reverse()));
            continue;
          }
          c.push({
            index: h.length,
            point: l.point
          });
          const g = l.getLeftmostComparator(o);
          a = d.sort(g)[0].otherSE;
          break;
        }
      e.push(new Xt(h));
    }
    return e;
  }
  constructor(t) {
    this.events = t;
    for (let e = 0, i = t.length; e < i; e++)
      t[e].segment.ringOut = this;
    this.poly = null;
  }
  getGeom() {
    let t = this.events[0].point;
    const e = [t];
    for (let h = 1, f = this.events.length - 1; h < f; h++) {
      const c = this.events[h].point, d = this.events[h + 1].point;
      en(c, t, d) !== 0 && (e.push(c), t = c);
    }
    if (e.length === 1) return null;
    const i = e[0], s = e[1];
    en(i, t, s) === 0 && e.shift(), e.push(e[0]);
    const r = this.isExteriorRing() ? 1 : -1, o = this.isExteriorRing() ? 0 : e.length - 1, l = this.isExteriorRing() ? e.length : -1, a = [];
    for (let h = o; h != l; h += r) a.push([e[h].x, e[h].y]);
    return a;
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
    for (let s = 1, r = this.events.length; s < r; s++) {
      const o = this.events[s];
      K.compare(t, o) > 0 && (t = o);
    }
    let e = t.segment.prevInResult(), i = e ? e.prevInResult() : null;
    for (; ; ) {
      if (!e) return null;
      if (!i) return e.ringOut;
      if (i.ringOut !== e.ringOut)
        return i.ringOut.enclosingRing() !== e.ringOut ? e.ringOut : e.ringOut.enclosingRing();
      e = i.prevInResult(), i = e ? e.prevInResult() : null;
    }
  }
}
class ln {
  constructor(t) {
    this.exteriorRing = t, t.poly = this, this.interiorRings = [];
  }
  addInterior(t) {
    this.interiorRings.push(t), t.poly = this;
  }
  getGeom() {
    const t = [this.exteriorRing.getGeom()];
    if (t[0] === null) return null;
    for (let e = 0, i = this.interiorRings.length; e < i; e++) {
      const s = this.interiorRings[e].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
}
class Ki {
  constructor(t) {
    this.rings = t, this.polys = this._composePolys(t);
  }
  getGeom() {
    const t = [];
    for (let e = 0, i = this.polys.length; e < i; e++) {
      const s = this.polys[e].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
  _composePolys(t) {
    const e = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const r = t[i];
      if (!r.poly)
        if (r.isExteriorRing()) e.push(new ln(r));
        else {
          const o = r.enclosingRing();
          o.poly || e.push(new ln(o)), o.poly.addInterior(r);
        }
    }
    return e;
  }
}
class Yi {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : lt.compare;
    this.queue = t, this.tree = new Ie(e), this.segments = [];
  }
  process(t) {
    const e = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(e), i;
    const s = t.isLeft ? this.tree.add(e) : this.tree.find(e);
    if (!s) throw new Error(`Unable to find segment #${e.id} [${e.leftSE.point.x}, ${e.leftSE.point.y}] -> [${e.rightSE.point.x}, ${e.rightSE.point.y}] in SweepLine tree.`);
    let r = s, o = s, l, a;
    for (; l === void 0; )
      r = this.tree.prev(r), r === null ? l = null : r.key.consumedBy === void 0 && (l = r.key);
    for (; a === void 0; )
      o = this.tree.next(o), o === null ? a = null : o.key.consumedBy === void 0 && (a = o.key);
    if (t.isLeft) {
      let h = null;
      if (l) {
        const c = l.getIntersection(e);
        if (c !== null && (e.isAnEndpoint(c) || (h = c), !l.isAnEndpoint(c))) {
          const d = this._splitSafely(l, c);
          for (let u = 0, g = d.length; u < g; u++)
            i.push(d[u]);
        }
      }
      let f = null;
      if (a) {
        const c = a.getIntersection(e);
        if (c !== null && (e.isAnEndpoint(c) || (f = c), !a.isAnEndpoint(c))) {
          const d = this._splitSafely(a, c);
          for (let u = 0, g = d.length; u < g; u++)
            i.push(d[u]);
        }
      }
      if (h !== null || f !== null) {
        let c = null;
        h === null ? c = f : f === null ? c = h : c = K.comparePoints(h, f) <= 0 ? h : f, this.queue.remove(e.rightSE), i.push(e.rightSE);
        const d = e.split(c);
        for (let u = 0, g = d.length; u < g; u++)
          i.push(d[u]);
      }
      i.length > 0 ? (this.tree.remove(e), i.push(t)) : (this.segments.push(e), e.prev = l);
    } else {
      if (l && a) {
        const h = l.getIntersection(a);
        if (h !== null) {
          if (!l.isAnEndpoint(h)) {
            const f = this._splitSafely(l, h);
            for (let c = 0, d = f.length; c < d; c++)
              i.push(f[c]);
          }
          if (!a.isAnEndpoint(h)) {
            const f = this._splitSafely(a, h);
            for (let c = 0, d = f.length; c < d; c++)
              i.push(f[c]);
          }
        }
      }
      this.tree.remove(e);
    }
    return i;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(t, e) {
    this.tree.remove(t);
    const i = t.rightSE;
    this.queue.remove(i);
    const s = t.split(e);
    return s.push(i), t.consumedBy === void 0 && this.tree.add(t), s;
  }
}
const an = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, qi = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Vi {
  run(t, e, i) {
    V.type = t, jt.reset();
    const s = [new on(e, !0)];
    for (let c = 0, d = i.length; c < d; c++)
      s.push(new on(i[c], !1));
    if (V.numMultiPolys = s.length, V.type === "difference") {
      const c = s[0];
      let d = 1;
      for (; d < s.length; )
        ye(s[d].bbox, c.bbox) !== null ? d++ : s.splice(d, 1);
    }
    if (V.type === "intersection")
      for (let c = 0, d = s.length; c < d; c++) {
        const u = s[c];
        for (let g = c + 1, p = s.length; g < p; g++)
          if (ye(u.bbox, s[g].bbox) === null) return [];
      }
    const r = new Ie(K.compare);
    for (let c = 0, d = s.length; c < d; c++) {
      const u = s[c].getSweepEvents();
      for (let g = 0, p = u.length; g < p; g++)
        if (r.insert(u[g]), r.size > an)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const o = new Yi(r);
    let l = r.size, a = r.pop();
    for (; a; ) {
      const c = a.key;
      if (r.size === l) {
        const u = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${u.id} [${u.leftSE.point.x}, ${u.leftSE.point.y}] -> [${u.rightSE.point.x}, ${u.rightSE.point.y}] from queue.`);
      }
      if (r.size > an)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (o.segments.length > qi)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const d = o.process(c);
      for (let u = 0, g = d.length; u < g; u++) {
        const p = d[u];
        p.consumedBy === void 0 && r.insert(p);
      }
      l = r.size, a = r.pop();
    }
    jt.reset();
    const h = Xt.factory(o.segments);
    return new Ki(h).getGeom();
  }
}
const V = new Vi(), Gi = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return V.run("union", n, e);
}, Xi = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return V.run("intersection", n, e);
}, Zi = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return V.run("xor", n, e);
}, Qi = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return V.run("difference", n, e);
};
var Ji = {
  union: Gi,
  intersection: Xi,
  xor: Zi,
  difference: Qi
};
const Ln = 3, ts = 1e-6;
function cn(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return { x: e.x, y: e.y };
}
function yt(n, t) {
  const e = cn(n, t.a), i = cn(n, t.b), s = t.thickness, [r, o] = t.baseline === "left" ? [0, s] : t.baseline === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: i, dir: ee(P(i, e)), len: C(e, i), leftOff: r, rightOff: o };
}
function hn(n, t) {
  const { f: e } = n;
  return t === "a" ? { body: n, end: t, p: e.a, u: e.dir, offL: e.leftOff, offR: e.rightOff, leftKey: "al", rightKey: "ar", far: e.b } : { body: n, end: t, p: e.b, u: S(e.dir, -1), offL: e.rightOff, offR: e.leftOff, leftKey: "br", rightKey: "bl", far: e.a };
}
const $t = (n) => I(n.p, S(Z(n.u), n.offL)), vt = (n) => P(n.p, S(Z(n.u), n.offR));
function dt(n, t, e) {
  return n !== null && C(n, t) <= e;
}
function es(n) {
  const t = [];
  for (const e of n.walls) {
    const i = yt(n, e);
    if (i.len < 1e-9) continue;
    const s = Z(i.dir);
    t.push({
      wall: e,
      f: i,
      c: {
        al: I(i.a, S(s, i.leftOff)),
        ar: P(i.a, S(s, i.rightOff)),
        bl: I(i.b, S(s, i.leftOff)),
        br: P(i.b, S(s, i.rightOff))
      }
    });
  }
  return t;
}
function ns(n, t) {
  const e = t.f, i = Z(e.dir);
  for (const s of n) {
    if (s.body === t) continue;
    const o = Y(P(s.far, e.a), i) >= 0 ? I(e.a, S(i, e.leftOff)) : P(e.a, S(i, e.rightOff)), l = Ln * Math.max(s.body.wall.thickness, t.wall.thickness), a = st($t(s), s.u, o, e.dir), h = st(vt(s), s.u, o, e.dir);
    dt(a, s.p, l) && (s.body.c[s.leftKey] = a), dt(h, s.p, l) && (s.body.c[s.rightKey] = h);
  }
}
function is(n, t) {
  n.sort((s, r) => Math.atan2(s.u.y, s.u.x) - Math.atan2(r.u.y, r.u.x));
  const e = Ln * Math.max(...n.map((s) => s.body.wall.thickness));
  for (let s = 0; s < n.length; s++) {
    const r = n[s], o = n[(s + 1) % n.length], l = st(vt(r), r.u, $t(o), o.u);
    dt(l, t, e) && (r.body.c[r.rightKey] = l, o.body.c[o.leftKey] = l);
  }
  if (n.length < 3) return;
  const i = ss(n, t, e);
  for (const s of n) {
    if (i.has(s)) continue;
    const r = s.body.c[s.leftKey], o = s.body.c[s.rightKey], l = P(o, r), a = Et(l, P(t, r)), h = Et(l, P(s.far, r));
    a * h < 0 && me(s, [t]);
  }
}
function me(n, t) {
  n.end === "a" ? n.body.extraA = t : n.body.extraB = t;
}
function ss(n, t, e) {
  const i = n.length;
  for (let s = 0; s < i; s++) {
    const r = n[s], o = n[(s + 1) % i];
    if (Math.abs(Et(r.u, o.u)) > 1e-9 || Y(r.u, o.u) > 0) continue;
    const l = r.offR - o.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = n[(s + 2) % i], h = st(vt(r), r.u, $t(a), a.u), f = st($t(o), o.u, $t(a), a.u);
        if (!dt(h, t, e) || !dt(f, t, e)) continue;
        const c = o.body.c[o.rightKey];
        r.body.c[r.rightKey] = h, o.body.c[o.leftKey] = f, me(r, [t, c, f]);
      } else {
        const a = n[(s - 1 + i) % i], h = st($t(o), o.u, vt(a), a.u), f = st(vt(r), r.u, vt(a), a.u);
        if (!dt(f, t, e) || !dt(h, t, e)) continue;
        const c = r.body.c[r.leftKey];
        r.body.c[r.rightKey] = f, o.body.c[o.leftKey] = h, me(o, [f, c, t]);
      }
      return /* @__PURE__ */ new Set([r, o]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Nn(n) {
  const t = es(n), e = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of n.nodes) {
    const s = [];
    for (const o of t)
      o.wall.a === i.id && s.push(hn(o, "a")), o.wall.b === i.id && s.push(hn(o, "b"));
    if (s.length === 0) continue;
    const r = i.host ? e.get(i.host.wallId) : void 0;
    r ? ns(s, r) : s.length >= 2 && is(s, { x: i.x, y: i.y });
  }
  return t;
}
function Cn(n) {
  return [n.c.ar, n.c.br, ...n.extraB ?? [], n.c.bl, n.c.al, ...n.extraA ?? []];
}
function ie(n) {
  return new Map(Nn(n).map((t) => [t.wall.id, Cn(t)]));
}
function un(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i], r = n[(i + 1) % n.length], o = t(s), l = t(r);
    o >= 0 && e.push(s), o >= 0 != l >= 0 && e.push(I(s, S(P(r, s), o / (o - l))));
  }
  return e;
}
function zn(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of Nn(n)) {
    const i = Cn(e), s = n.openings.filter((h) => h.wallId === e.wall.id && !h.invalid).sort((h, f) => h.offset - f.offset), r = (h) => Y(P(h, e.f.a), e.f.dir), o = [];
    let l = -1 / 0;
    for (const h of s)
      o.push([l, h.offset]), l = Math.max(l, h.offset + h.width);
    o.push([l, 1 / 0]);
    const a = [];
    for (const [h, f] of o) {
      if (f <= h) continue;
      let c = i;
      h > -1 / 0 && (c = un(c, (d) => r(d) - h)), f < 1 / 0 && (c = un(c, (d) => f - r(d))), c.length >= 3 && Math.abs(Bt(c)) > ts && a.push(c);
    }
    t.set(e.wall.id, a);
  }
  return t;
}
function Dn(n, t) {
  const e = t ? [...zn(n).values()].flat() : [...ie(n).values()], i = e.map((r) => [r.map((o) => [o.x, o.y])]);
  if (i.length === 0) return [];
  let s;
  try {
    s = Ji.union(i[0], ...i.slice(1));
  } catch {
    return e.map((r) => [r.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return s.map((r) => r.map((o) => {
    const l = o.map(([f, c]) => ({ x: f, y: c })), a = l[0], h = l[l.length - 1];
    return l.length > 1 && a.x === h.x && a.y === h.y && l.pop(), l;
  }));
}
function Un(n) {
  const t = [];
  for (const e of Dn(n, !1)) for (const i of e.slice(1)) t.push(i);
  return t;
}
function xe(n, t) {
  let e = null, i = 1 / 0;
  for (const s of n) {
    if (!ne(t, s)) continue;
    const r = Math.abs(Bt(s));
    r < i && (e = s, i = r);
  }
  return e;
}
function Bn(n) {
  return Math.round(Math.abs(Bt(n)) / 1e6 * 100) / 100;
}
const ue = 1e-3;
function jn(n, t) {
  return n.length !== t.length || Math.abs(Math.abs(Bt(n)) - Math.abs(Bt(t))) > ue ? !1 : n.every((e) => t.some((i) => Math.abs(e.x - i.x) <= ue && Math.abs(e.y - i.y) <= ue));
}
function rs(n, t, e) {
  const i = Un(n), s = xe(i, t);
  if (!s) return { level: n, zoneId: null };
  for (const o of n.zones) {
    const l = o.broken ? null : xe(i, o.seed);
    if (l && jn(l, s)) return { level: n, zoneId: null };
  }
  const r = { id: G(), name: e, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...n, zones: [...n.zones, r] }, zoneId: r.id };
}
function os(n, t, e) {
  return { ...n, zones: n.zones.map((i) => i.id === t ? { ...i, name: e } : i) };
}
function Pe(n, t) {
  return { ...n, zones: n.zones.filter((e) => e.id !== t) };
}
function _t(n) {
  if (n.zones.length === 0) return n;
  const t = Un(n), e = [], i = n.zones.map((s) => {
    const r = xe(t, s.seed);
    return !r || e.some((o) => jn(o, r)) ? { ...s, broken: !0 } : (e.push(r), { ...s, outline: r, broken: !1 });
  });
  return { ...n, zones: i };
}
const St = 1e-6;
function Fn(n, t) {
  const e = n.walls.find((r) => r.id === t);
  if (!e) return null;
  const i = n.nodes.find((r) => r.id === e.a), s = n.nodes.find((r) => r.id === e.b);
  return !i || !s ? null : Math.hypot(s.x - i.x, s.y - i.y);
}
function Hn(n, t) {
  return n.offset < t.offset + t.width - St && t.offset < n.offset + n.width - St;
}
function Oe(n, t, e, i, s) {
  const r = Fn(n, t);
  return r === null || i <= 0 || e < -St || e + i > r + St ? !1 : !n.openings.some((o) => o.wallId === t && o.id !== s && Hn(o, { offset: e, width: i }));
}
function At(n, t) {
  return { ...n, openings: t };
}
function dn(n, t, e, i, s) {
  const r = On[e], o = i - r / 2;
  if (!Oe(n, t, o, r)) return { level: n, openingId: null };
  const l = { id: G(), wallId: t, kind: e, offset: o, width: r, invalid: !1 };
  return (e === "door" || e === "gate" || e === "wicket") && (l.hinge = "start", l.swing = "left"), e === "window" && (l.outside = "left"), { level: _t(At(n, [...n.openings, l])), openingId: l.id };
}
function Wn(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !Oe(n, i.wallId, e, i.width, t) ? n : _t(Wt(At(n, n.openings.map((s) => s.id === t ? { ...s, offset: e } : s))));
}
function ls(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !Oe(n, i.wallId, i.offset, e, t) ? n : _t(Wt(At(n, n.openings.map((s) => s.id === t ? { ...s, width: e } : s))));
}
function as(n, t, e) {
  return n.openings.some((i) => i.id === t) ? _t(Wt(At(n, n.openings.map((i) => i.id === t ? { ...i, ...e } : i)))) : n;
}
function Re(n, t) {
  return _t(Wt(At(n, n.openings.filter((e) => e.id !== t))));
}
function Wt(n) {
  return At(n, n.openings.map((t) => {
    const e = Fn(n, t.wallId), i = e === null || t.offset < -St || t.offset + t.width > e + St || n.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Hn(t, s));
    return { ...t, invalid: i };
  }));
}
const Ft = 1;
function et(n) {
  return structuredClone(n);
}
function Kn(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return e;
}
function Mt(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) throw new Error(`wall not found: ${t}`);
  return e;
}
function N(n, t) {
  const e = Kn(n, t);
  return { x: e.x, y: e.y };
}
function Te(n, t, e) {
  return Math.min(e, Math.max(t, n));
}
function cs(n, t, e) {
  const i = Mt(n, t), s = N(n, i.a), r = N(n, i.b), o = C(s, r), l = Te(e, 0, o);
  return { pt: o === 0 ? s : Ae(s, r, l / o), offset: l };
}
function hs(n) {
  for (let t = 0; t <= n.nodes.length; t++) {
    let e = !1;
    for (const i of n.nodes) {
      if (!i.host) continue;
      const s = n.walls.find((f) => f.id === i.host.wallId);
      if (!s) continue;
      const r = N(n, s.a), o = N(n, s.b), l = C(r, o), a = Te(Me(i, r, o) * l, 0, l), h = l === 0 ? r : Ae(r, o, a / l);
      (Math.abs(i.x - h.x) > 1e-9 || Math.abs(i.y - h.y) > 1e-9) && (e = !0), i.x = h.x, i.y = h.y, i.host.offset = a;
    }
    if (!e) break;
  }
}
function Yn(n, t) {
  return hs(n), t && ps(t, n), _t(Wt(n));
}
function ct(n, t) {
  return Yn(et(n), t);
}
function qn(n, t, e) {
  const i = Kn(n, t);
  if (i.host && n.walls.some((s) => s.id === i.host.wallId)) {
    const s = Mt(n, i.host.wallId), r = N(n, s.a), o = N(n, s.b), l = C(r, o);
    i.host.offset = Te(Me(e, r, o) * l, 0, l);
    const a = l === 0 ? r : Ae(r, o, i.host.offset / l);
    i.x = a.x, i.y = a.y;
  } else
    i.x = e.x, i.y = e.y;
}
function fn(n, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: N(n, t.nodeId), nodeId: t.nodeId };
  const e = Mt(n, t.wallId), { pt: i, offset: s } = cs(n, t.wallId, t.offset), r = C(N(n, e.a), N(n, e.b));
  return s <= Ft ? { pt: N(n, e.a), nodeId: e.a } : r - s <= Ft ? { pt: N(n, e.b), nodeId: e.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function pn(n, t) {
  if (t.nodeId) return t.nodeId;
  const e = { id: G(), x: t.pt.x, y: t.pt.y };
  return t.host && (e.host = { ...t.host }), n.nodes.push(e), e.id;
}
function us(n, t, e, i) {
  const s = fn(n, t), r = fn(n, e);
  if (C(s.pt, r.pt) < Ft) return { level: n, wallId: null, endNodeId: null };
  const o = et(n), l = pn(o, s), a = pn(o, r);
  if (l === a) return { level: n, wallId: null, endNodeId: null };
  const h = { id: G(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return o.walls.push(h), { level: ct(o, n), wallId: h.id, endNodeId: a };
}
function ds(n, t, e, i, s) {
  const r = s === "inner" ? i.thickness / 2 : s === "outer" ? -i.thickness / 2 : 0, o = Math.min(t.x, e.x) - r, l = Math.max(t.x, e.x) + r, a = Math.min(t.y, e.y) - r, h = Math.max(t.y, e.y) + r;
  if (l - o < Ft || h - a < Ft) return n;
  const f = et(n), d = [{ x: o, y: a }, { x: l, y: a }, { x: l, y: h }, { x: o, y: h }].map((u) => {
    const g = { id: G(), x: u.x, y: u.y };
    return f.nodes.push(g), g.id;
  });
  for (let u = 0; u < 4; u++)
    f.walls.push({
      id: G(),
      a: d[u],
      b: d[(u + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return ct(f, n);
}
function fs(n, t, e) {
  const i = et(n);
  return qn(i, t, e), Yn(i, n);
}
function ps(n, t) {
  for (const e of t.walls) {
    const i = n.walls.find((f) => f.id === e.id);
    if (!i || i.a !== e.a) continue;
    const s = N(n, i.a), r = N(n, i.b), o = N(t, e.a), l = N(t, e.b);
    if (s.x === o.x && s.y === o.y) continue;
    const a = C(o, l);
    if (a === 0) continue;
    const h = ee(P(r, s));
    for (const f of t.openings)
      f.wallId === e.id && (f.offset = Me(I(s, S(h, f.offset)), o, l) * a);
  }
}
function gs(n, t, e) {
  const i = et(n), s = Mt(i, t), o = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: I(N(i, l), e) }));
  for (const l of o) qn(i, l.id, l.to);
  return ct(i, n);
}
function Le(n) {
  n.nodes = n.nodes.filter((t) => n.walls.some((e) => e.a === t.id || e.b === t.id));
}
function ys(n, t, e) {
  const i = et(n), s = Mt(i, t), r = N(i, s[e]), o = { id: G(), x: r.x, y: r.y };
  return i.nodes.push(o), s[e] = o.id, Le(i), { level: ct(i, n), nodeId: o.id };
}
function ms(n, t, e) {
  if (t === e) return n;
  const i = et(n);
  for (const r of i.walls)
    r.a === t && (r.a = e), r.b === t && (r.b = e);
  const s = new Set(i.walls.filter((r) => r.a === r.b).map((r) => r.id));
  i.walls = i.walls.filter((r) => !s.has(r.id)), i.openings = i.openings.filter((r) => !s.has(r.wallId));
  for (const r of i.nodes) r.host && s.has(r.host.wallId) && delete r.host;
  return i.nodes = i.nodes.filter((r) => r.id !== t), Le(i), ct(i, n);
}
function Ne(n, t) {
  var i;
  const e = et(n);
  e.walls = e.walls.filter((s) => s.id !== t), e.openings = e.openings.filter((s) => s.wallId !== t);
  for (const s of e.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Le(e), ct(e, n);
}
function xs(n, t, e) {
  const i = et(n);
  return Object.assign(Mt(i, t), e), ct(i, n);
}
class ws {
  constructor(t, e = 200) {
    this.cap = e, this.past = [], this.future = [], this.present = t;
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
class Vn extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function gn(n) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function $s(n, t) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function vs(n, t, e, i = !1) {
  try {
    return (await n.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: e,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Vn(s.message) : s;
  }
}
const bs = 3;
function ks(n) {
  if (typeof n == "number")
    return n === bs ? "Connection lost" : `Connection error ${n}`;
  if (typeof n == "string") return n;
  if (n instanceof Error) return n.message;
  if (typeof n == "object" && n !== null) {
    const t = n;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return String(n);
}
class Es {
  constructor(t, e) {
    this.hass = t, this.onChange = e, this.state = "idle", this.errorMessage = null, this.dirty = !1, this.baseRevision = null, this.dirtyVersion = 0, this.inflight = null;
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
  async saveAsNew(t, e) {
    if (this.inflight)
      return await this.inflight, null;
    const i = { ...t, id: G(), name: e, revision: 0 }, s = await this.run(i, null, !1);
    return s === null ? null : { ...i, revision: s };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(t, e, i) {
    const s = this.doRun(t, e, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = s, s;
  }
  async doRun(t, e, i) {
    this.state = "saving", this.errorMessage = null;
    const s = this.dirtyVersion;
    this.onChange();
    try {
      const r = await vs(this.hass, t, e, i);
      return this.baseRevision = r, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), r;
    } catch (r) {
      return r instanceof Vn ? (this.state = "conflict", this.errorMessage = r.message) : (this.state = "error", this.errorMessage = ks(r)), this.onChange(), null;
    }
  }
}
function Ss(n, t) {
  return Math.abs(t.x - n.x) >= Math.abs(t.y - n.y) ? { x: t.x, y: n.y } : { x: n.x, y: t.y };
}
function we(n) {
  const t = n.replace(/[  ]/g, "");
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return Number.isSafeInteger(e) && e > 0 ? e : null;
}
function _s(n, t, e) {
  return I(n, S(ee(P(t, n)), e));
}
function yn(n, t) {
  return { pt: n, kind: t, endpoint: { kind: "free", pt: n } };
}
function Ht(n, t, e) {
  const { tolMm: i, grid: s, ortho: r } = e, o = r ? e.from : void 0, l = new Set(e.excludeNodeIds ?? []), a = o ? Ss(o, t) : t, h = o !== void 0 && a.y === o.y, f = (x) => !o || Math.abs(h ? x.y - o.y : x.x - o.x) <= 1;
  let c = null;
  for (const x of n.nodes) {
    if (l.has(x.id)) continue;
    const $ = { x: x.x, y: x.y }, b = C($, a);
    b <= i && f($) && (!c || b < c.d) && (c = { id: x.id, pt: $, d: b });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const d = n.walls.filter((x) => !l.has(x.a) && !l.has(x.b)).map((x) => ({ w: x, f: yt(n, x) })).filter((x) => x.f.len > 1e-9);
  let u = null;
  for (const { w: x, f: $ } of d) {
    const b = { x: ($.a.x + $.b.x) / 2, y: ($.a.y + $.b.y) / 2 }, k = C(b, a);
    k <= i && f(b) && (!u || k < u.d) && (u = { wallId: x.id, pt: b, offset: $.len / 2, d: k });
  }
  if (u)
    return { pt: u.pt, kind: "mid", endpoint: { kind: "wall", wallId: u.wallId, offset: u.offset } };
  const g = (x) => {
    let $ = null;
    for (const { w: b, f: k } of d) {
      const M = Z(k.dir), A = x ? [k.leftOff, -k.rightOff].filter((_) => _ !== 0) : [0];
      for (const _ of A) {
        const O = I(k.a, S(M, _)), D = o ? st(o, P(a, o), O, k.dir) : I(O, S(k.dir, Y(P(a, O), k.dir)));
        if (!D) continue;
        const F = Y(P(D, O), k.dir);
        if (F < 0 || F > k.len) continue;
        const H = C(D, a);
        H <= i && (!$ || H < $.d) && ($ = { d: H, res: { pt: D, kind: "wall", endpoint: { kind: "wall", wallId: b.id, offset: F } } });
      }
    }
    return $ ? $.res : null;
  }, p = g(!1);
  if (p) return p;
  const m = g(!0);
  if (m) return m;
  if (s && s > 0) {
    const x = (b) => Math.round(b / s) * s, $ = o ? h ? { x: x(a.x), y: o.y } : { x: o.x, y: x(a.y) } : { x: x(a.x), y: x(a.y) };
    return yn($, "grid");
  }
  return yn(a, "none");
}
function As(n, t, e) {
  const i = P(e, t), s = Y(i, i), r = s === 0 ? 0 : Math.max(0, Math.min(1, Y(P(n, t), i) / s));
  return C(n, { x: t.x + i.x * r, y: t.y + i.y * r });
}
function Ms(n, t, e) {
  return t.some((i, s) => As(n, i, t[(s + 1) % t.length]) <= e);
}
function Gn(n, t, e) {
  for (const [i, s] of ie(n))
    if (ne(t, s) || Ms(t, s, e)) return i;
  return null;
}
function Is(n, t) {
  for (const e of n.openings) {
    const i = n.walls.find((a) => a.id === e.wallId);
    if (!i) continue;
    const s = yt(n, i);
    if (s.len < 1e-9) continue;
    const r = P(t, s.a), o = Y(r, s.dir), l = r.x * s.dir.y - r.y * s.dir.x;
    if (o >= e.offset && o <= e.offset + e.width && l >= -s.rightOff && l <= s.leftOff) return e.id;
  }
  return null;
}
function Ps(n, t, e, i) {
  const s = Is(n, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const o = n.walls.find((l) => l.id === i.id);
    if (o)
      for (const l of [o.a, o.b]) {
        const a = n.nodes.find((h) => h.id === l);
        if (a && C(t, a) <= e) return { kind: "node", id: l };
      }
  }
  const r = Gn(n, t, e);
  if (r) return { kind: "wall", id: r };
  for (const o of n.zones)
    if (o.outline.length >= 3 && ne(t, o.outline)) return { kind: "zone", id: o.id };
  return null;
}
function Os(n) {
  let t = null, e = null, i = null, s = null, r = !1, o = { x: 0, y: 0 }, l = null;
  const a = (u) => {
    t = u, n.select(u);
  }, h = () => {
    e = null, i = null, s = null, l = null, r = !1;
  }, f = (u) => u.kind === "none" ? { x: Math.round(u.pt.x), y: Math.round(u.pt.y) } : u.pt, c = (u, g, p) => {
    const m = yt(u, u.walls.find((x) => x.id === g));
    return Y(P(p, m.a), m.dir);
  };
  function d(u) {
    const g = e;
    if (!(!g || !i) && !(u.pt.x === o.x && u.pt.y === o.y))
      if (r = !0, g.kind === "node") {
        const p = Ht(i, u.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: u.shift,
          excludeNodeIds: [g.nodeId]
        }), m = p.endpoint, x = (p.kind === "wall" || p.kind === "mid") && m.kind === "wall", $ = p.kind === "node" && m.kind === "node" && m.nodeId !== g.nodeId, b = i.nodes.find((_) => _.id === g.nodeId), k = !!b.host && x && m.kind === "wall" && m.wallId === b.host.wallId;
        let M = i;
        if (b.host && !k) {
          const _ = structuredClone(i);
          delete _.nodes.find((O) => O.id === g.nodeId).host, M = _;
        }
        let A = fs(M, g.nodeId, f(p));
        if ($ && m.kind === "node")
          A = ms(A, g.nodeId, m.nodeId);
        else if (x && m.kind === "wall" && !k) {
          const _ = i.walls.find((O) => O.id === m.wallId);
          if (_ && _.a !== g.nodeId && _.b !== g.nodeId) {
            const O = structuredClone(A);
            O.nodes.find((D) => D.id === g.nodeId).host = { wallId: m.wallId, offset: m.offset }, A = ct(O, A);
          }
        }
        s = A;
      } else if (g.kind === "wall") {
        const p = i.walls.find(($) => $.id === g.wallId), m = Ht(i, u.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: u.shift,
          excludeNodeIds: [p.a, p.b]
        }), x = P(m.pt, g.origin);
        s = gs(
          i,
          g.wallId,
          m.kind === "none" ? { x: Math.round(x.x), y: Math.round(x.y) } : x
        );
      } else {
        const p = i.openings.find((m) => m.id === g.openingId);
        s = Wn(i, p.id, c(i, p.wallId, u.pt) - g.grab);
      }
  }
  return {
    id: "select",
    down(u) {
      h(), o = u.pt;
      const g = n.level(), p = t, m = Ps(g, u.pt, n.tolMm(), p);
      if (a(m), !!m) {
        if (l = i = s = g, m.kind === "node") {
          let x = m.id;
          const $ = (p == null ? void 0 : p.kind) === "wall" ? g.walls.find((b) => b.id === p.id) : void 0;
          if (u.alt && $) {
            const b = ys(g, $.id, $.a === m.id ? "a" : "b");
            i = s = b.level, x = b.nodeId, a({ kind: "node", id: x });
          }
          e = { kind: "node", nodeId: x, origin: N(i, x) };
        } else if (m.kind === "wall")
          e = { kind: "wall", wallId: m.id, origin: u.pt };
        else if (m.kind === "opening") {
          const x = g.openings.find(($) => $.id === m.id);
          e = { kind: "opening", openingId: x.id, grab: c(g, x.wallId, u.pt) - x.offset };
        }
      }
    },
    move(u) {
      d(u);
    },
    up(u) {
      e && d(u);
      const g = r, p = s, m = l;
      h(), g && p && m && p !== m && n.commit(p);
    },
    key(u) {
      if (u === "Escape" && e)
        return h(), !0;
      if (u !== "Delete" && u !== "Backspace" || !t || t.kind === "node") return !1;
      const g = n.level();
      if (!(t.kind === "wall" ? g.walls : t.kind === "opening" ? g.openings : g.zones).some((x) => x.id === t.id)) return !1;
      const m = t.kind === "wall" ? Ne(g, t.id) : t.kind === "opening" ? Re(g, t.id) : Pe(g, t.id);
      return n.commit(m), a(null), !0;
    },
    preview() {
      return !e || !s ? {} : { level: s, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      h(), a(null);
    }
  };
}
function Rs(n) {
  let t = null, e = { x: 0, y: 0 }, i = "", s = "", r = "length";
  const o = () => {
    t = null, i = "", s = "", r = "length";
  }, l = (c) => Ht(n.level(), c, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 });
  function a() {
    if (!t) return null;
    if (i !== "" || s !== "") {
      const c = we(i), d = we(s);
      return c === null || d === null ? null : { x: t.x + (e.x >= t.x ? c : -c), y: t.y + (e.y >= t.y ? d : -d) };
    }
    return l(e).pt;
  }
  const h = (c, d) => Math.abs(c.x - d.x) < 1 || Math.abs(c.y - d.y) < 1;
  function f(c) {
    if (!t || h(t, c)) return;
    const d = ds(n.level(), t, c, n.wallProps(), n.boxMeasure());
    d !== n.level() && (n.commit(d), o());
  }
  return {
    id: "box",
    down(c) {
      if (e = c.pt, !t) {
        t = l(c.pt).pt;
        return;
      }
      const d = a();
      d && f(d);
    },
    move(c) {
      e = c.pt;
    },
    up() {
    },
    key(c) {
      if (!t) return !1;
      if (/^[0-9]$/.test(c) || c === " ")
        return r === "length" ? i += c : s += c, !0;
      if (c === "Backspace")
        return r === "length" ? i = i.slice(0, -1) : s = s.slice(0, -1), !0;
      if (c === "Tab")
        return r = r === "length" ? "angle" : "length", !0;
      if (c === "Enter") {
        const d = a();
        return d && f(d), !0;
      }
      return c === "Escape" ? (i !== "" || s !== "" ? (i = "", s = "", r = "length") : o(), !0) : !1;
    },
    preview() {
      if (!t) return { snap: l(e) };
      const c = a(), u = {
        tracker: { length: i, angle: s, field: r, at: e },
        anchor: t,
        snap: i !== "" || s !== "" ? void 0 : l(e)
      };
      if (!c || h(t, c)) return u;
      const g = n.wallProps(), p = n.boxMeasure(), m = p === "inner" ? g.thickness / 2 : p === "outer" ? -g.thickness / 2 : 0, x = Math.min(t.x, c.x) - m, $ = Math.max(t.x, c.x) + m, b = Math.min(t.y, c.y) - m, k = Math.max(t.y, c.y) + m;
      if ($ - x < 1 || k - b < 1) return u;
      const M = [{ x, y: b }, { x: $, y: b }, { x: $, y: k }, { x, y: k }];
      return u.walls = M.map((A, _) => ({ a: A, b: M[(_ + 1) % 4], props: { ...g, baseline: "center" } })), u;
    },
    cancel() {
      o();
    }
  };
}
const mn = (n) => Math.round(n * 1e3) / 1e3 + 0;
function Ts(n) {
  const t = n.replace(/[\s ]/g, "");
  return /^\d+$/.test(t) ? Number(t) : null;
}
function Ls(n) {
  let t = null, e = null, i = null, s = { x: 0, y: 0 }, r = !1, o = null, l = "", a = "", h = "length";
  const f = () => {
    l = "", a = "", h = "length";
  }, c = () => {
    t = null, e = null, i = null, o = null, f();
  }, d = (p, m) => Ht(n.level(), p, { tolMm: n.tolMm(), grid: n.grid(), from: e ?? void 0, ortho: m && e !== null });
  function u() {
    if (!e) return null;
    const p = d(s, r), m = we(l), x = Ts(a);
    if (m === null && x === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const $ = m ?? C(e, p.pt);
    let b = p.pt;
    if (x === null && C(e, p.pt) < 1) {
      const _ = o ?? { x: 1, y: 0 };
      b = { x: e.x + _.x, y: e.y + _.y };
    }
    if (x !== null) {
      const _ = x * Math.PI / 180;
      b = { x: e.x + Math.cos(_), y: e.y - Math.sin(_) };
    }
    const k = _s(e, b, $), M = { x: mn(k.x), y: mn(k.y) }, A = n.level().nodes.find((_) => Math.hypot(_.x - M.x, _.y - M.y) < 1);
    return A ? { pt: { x: A.x, y: A.y }, endpoint: { kind: "node", nodeId: A.id }, snap: p } : { pt: M, endpoint: { kind: "free", pt: M }, snap: p };
  }
  function g() {
    const p = u();
    if (!t || !p) return;
    const m = us(n.level(), t, p.endpoint, n.wallProps());
    if (m.wallId === null || m.endNodeId === null) return;
    n.commit(m.level);
    const x = m.level.walls.find((A) => A.id === m.wallId);
    i === null && (i = x.a);
    const $ = m.endNodeId === i, b = e, k = N(m.level, m.endNodeId), M = C(b, k);
    if (M > 0 && (o = { x: (k.x - b.x) / M, y: (k.y - b.y) / M }), f(), $) {
      c();
      return;
    }
    t = { kind: "node", nodeId: m.endNodeId }, e = N(m.level, m.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, r = p.shift, !t) {
        const m = d(p.pt, !1);
        t = m.endpoint, e = m.pt;
        return;
      }
      g();
    },
    move(p) {
      s = p.pt, r = p.shift;
    },
    up() {
    },
    key(p, m) {
      return r = m.shift, t ? /^[0-9]$/.test(p) || p === " " ? (h === "length" ? l += p : a += p, !0) : p === "Backspace" ? (h === "length" ? l = l.slice(0, -1) : a = a.slice(0, -1), !0) : p === "Tab" ? (h = h === "length" ? "angle" : "length", !0) : p === "Enter" ? (g(), !0) : p === "Escape" ? (l !== "" || a !== "" ? f() : c(), !0) : !1 : !1;
    },
    preview() {
      if (!e) return { snap: Ht(n.level(), s, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: e, b: p.pt, props: n.wallProps() }],
        snap: p.snap,
        tracker: { length: l, angle: a, field: h, at: p.pt },
        orthoFrom: r ? e : void 0,
        anchor: e
      };
    },
    cancel() {
      c();
    }
  };
}
function Ns(n, t) {
  let e = null;
  const i = On[t];
  function s() {
    if (!e) return null;
    const r = n.level(), o = Gn(r, e, n.tolMm());
    if (!o) return null;
    const l = yt(r, r.walls.find((h) => h.id === o)), a = Y(P(e, l.a), l.dir);
    return { wallId: o, center: a, pt: I(l.a, S(l.dir, a)) };
  }
  return {
    id: t,
    down(r) {
      e = r.pt;
      const o = s();
      if (!o) return;
      const l = dn(n.level(), o.wallId, t, o.center);
      l.openingId !== null && n.commit(l.level);
    },
    move(r) {
      e = r.pt;
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      const r = s();
      if (!r) return {};
      const o = dn(n.level(), r.wallId, t, r.center);
      return {
        opening: { wallId: r.wallId, offset: r.center - i / 2, width: i, kind: t, invalid: o.openingId === null },
        snap: { pt: r.pt, kind: "wall", endpoint: { kind: "wall", wallId: r.wallId, offset: r.center } }
      };
    },
    cancel() {
      e = null;
    }
  };
}
const Cs = {
  "tool.select": "Select",
  "tool.box": "Box",
  "tool.wall": "Wall",
  "tool.door": "Door",
  "tool.window": "Window",
  "tool.opening": "Opening",
  "tool.zone": "Zone",
  "zone.default": "Room",
  "plan.default": "Plan",
  "plan.name": "Plan name",
  "plan.copySuffix": "(copy)",
  "load.loading": "Loading…",
  "load.error": "Failed to load the plan",
  "walltype.label": "Wall type",
  "walltype.bearing": "Load-bearing",
  "walltype.partition": "Partition",
  "walltype.railing": "Railing",
  "walltype.fence": "Fence",
  "action.undo": "Undo",
  "action.redo": "Redo",
  "action.save": "Save",
  "action.delete": "Delete",
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
  "conflict.cancel": "Cancel",
  "draft.title": "Unsaved changes found",
  "draft.text": "Restore unsaved changes from {time}?",
  "draft.restore": "Restore",
  "draft.discard": "Discard",
  "draft.banner": "Unsaved changes from {time} available",
  "switch.title": "Unsaved changes",
  "switch.text": "Opening another plan discards the unsaved changes of this one.",
  "switch.discard": "Discard and open",
  "switch.cancel": "Cancel",
  "plan.pick": "Open plan",
  "props.none": "Nothing selected",
  "props.wall": "Wall",
  "props.type": "Type",
  "props.thickness": "Thickness",
  "props.baseline": "Baseline",
  "props.length": "Length",
  "props.opening": "Opening",
  "props.kind": "Kind",
  "props.width": "Width",
  "props.offset": "From wall start",
  "props.hinge": "Hinges",
  "props.swing": "Opens to",
  "props.outside": "Outside",
  "props.invalidOpening": "Out of the wall or overlapping another opening",
  "props.badWidth": "Width must be a whole number of mm above 0",
  "props.noFit": "Does not fit the wall at this position",
  "props.zone": "Room",
  "props.name": "Name",
  "props.area": "Area",
  "props.broken": "The outline is no longer closed: the room is broken. Fix the walls or delete the room.",
  "props.node": "Node",
  "props.newWall": "New wall",
  "props.measure": "Size measured to",
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
  "status.grid": "Grid 100 mm",
  "snap.node": "snap: end",
  "snap.mid": "snap: midpoint",
  "snap.wall": "snap: wall",
  "snap.grid": "snap: grid",
  "snapmark.node": "endpoint",
  "snapmark.mid": "midpoint",
  "snapmark.wall": "on wall",
  "snapmark.grid": "grid",
  "tracker.length": "L",
  "tracker.angle": "∠",
  "tracker.width": "W",
  "tracker.depth": "D",
  "unit.mm": "mm",
  "unit.m2": "m²"
};
function w(n, t) {
  return Cs[n] ?? n;
}
function zs(n) {
  return {
    id: "zone",
    down(t) {
      const e = n.level(), i = `${w("zone.default", n.lang())} ${e.zones.length + 1}`, s = rs(e, t.pt, i);
      s.zoneId !== null && (n.commit(s.level), n.select({ kind: "zone", id: s.zoneId }));
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
const Ds = {
  dark: !0,
  background: "#0b1220",
  grid: "#1c2840",
  gridMajor: "#26355a",
  wall: "#cbd5e1",
  railing: "#94a3b8",
  zone: "#111a2e",
  zoneLabel: "#94a3b8",
  hatch: "#f43f5e",
  window: "#38bdf8",
  door: "#94a3b8",
  selection: "#60a5fa",
  invalid: "#f43f5e",
  snap: "#facc15",
  dim: "#94a3b8",
  panel: "#0f172a",
  border: "#1e293b",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#1d4ed8",
  accentText: "#ffffff",
  input: "#111a2e",
  inputBorder: "#334155"
}, Us = {
  dark: !1,
  background: "#f3efe8",
  grid: "#e6dfd4",
  gridMajor: "#d8cfc1",
  wall: "#2b2622",
  railing: "#7a7067",
  zone: "#ffffff",
  zoneLabel: "#7a7067",
  hatch: "#e5484d",
  window: "#4a9fd0",
  door: "#7a7067",
  selection: "#2563eb",
  invalid: "#e5484d",
  snap: "#d97706",
  dim: "#6b6258",
  panel: "#faf7f2",
  border: "#e0d8cc",
  text: "#2b2622",
  muted: "#8a8076",
  accent: "#2563eb",
  accentText: "#ffffff",
  input: "#ffffff",
  inputBorder: "#d6cfc4"
};
function Bs(n) {
  return n ? Ds : Us;
}
function pt(n) {
  const t = Math.round(n), e = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${e}` : e;
}
function Xn(n, t) {
  return `${n.toFixed(2)} ${w("unit.m2")}`;
}
const js = /* @__PURE__ */ new WeakMap(), Fs = /* @__PURE__ */ new WeakMap(), Zn = /* @__PURE__ */ new WeakMap();
function Zt(n, t, e) {
  let i = n.get(t);
  return i === void 0 && (i = e(t), n.set(t, i)), i;
}
const tt = (n) => n.length === 0 ? "" : `M${n.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function se(n, t, e) {
  const i = Z(n.dir), s = I(n.a, S(n.dir, t)), r = I(n.a, S(n.dir, e));
  return [I(s, S(i, n.leftOff)), I(r, S(i, n.leftOff)), P(r, S(i, n.rightOff)), P(s, S(i, n.rightOff))];
}
function Qt(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) return null;
  try {
    const i = yt(n, e);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function Hs(n, t) {
  let e = 0, i = 0, s = 0;
  for (let o = 0; o < n.length; o++) {
    const l = n[o], a = n[(o + 1) % n.length], h = l.x * a.y - a.x * l.y;
    e += h, i += (l.x + a.x) * h, s += (l.y + a.y) * h;
  }
  if (Math.abs(e) < 1e-9) return t;
  const r = { x: i / (3 * e), y: s / (3 * e) };
  return ne(r, n) ? r : t;
}
const L = "non-scaling-stroke";
function Ws(n, t, e) {
  const i = t.palette, s = Hs(n.outline, n.seed), r = 12 / t.scale;
  return R`
    <path class="zone${n.broken ? " broken" : ""}" d=${tt(n.outline)}
      fill=${n.broken ? "url(#hatch)" : i.zone}
      stroke=${e ? i.selection : "none"} stroke-width="2" vector-effect=${L}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${r}
      fill=${n.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * r}>${n.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * r} font-size=${r * 0.9}>${Xn(Bn(n.outline), t.lang)}</tspan>
    </text>`;
}
function Ks(n, t, e) {
  const i = Z(n.dir), s = (t.swing ?? "left") === "left", r = s ? i : S(i, -1), o = s ? n.leftOff : n.rightOff, [l, a] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], h = I(I(n.a, S(n.dir, l)), S(r, o)), f = I(I(n.a, S(n.dir, a)), S(r, o)), c = I(h, S(r, t.width)), d = Et(P(c, h), P(f, h)) > 0 ? 1 : 0;
  return R`
    <line x1=${h.x} y1=${h.y} x2=${c.x} y2=${c.y} stroke=${e} stroke-width="1.5" vector-effect=${L}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${d} ${f.x} ${f.y}`} fill="none" stroke=${e}
      stroke-width="1" vector-effect=${L}></path>`;
}
function Ys(n, t, e) {
  const i = Z(n.dir), s = n.leftOff + n.rightOff, r = [n.leftOff - s / 3, n.leftOff - 2 * s / 3].map((o) => {
    const l = I(I(n.a, S(n.dir, t.offset)), S(i, o)), a = I(I(n.a, S(n.dir, t.offset + t.width)), S(i, o));
    return R`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${e} stroke-width="1.5" vector-effect=${L}></line>`;
  });
  return R`${r}`;
}
function qs(n, t, e) {
  const i = Qt(n, t.wallId);
  if (!i) return v;
  const s = e.palette, r = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, o = se(i, t.offset, t.offset + t.width), l = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return R`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${tt(o)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Ks(i, t, r) : t.kind === "window" ? Ys(i, t, r) : v}
    </g>`;
}
function xn(n, t, e, i, s) {
  const r = s.palette.dim, o = 6 / s.scale, l = I(n, S(e, i)), a = I(t, S(e, i)), h = (c, d) => {
    const u = I(d, S(e, i + o));
    return R`<line x1=${c.x} y1=${c.y} x2=${u.x} y2=${u.y} stroke=${r} stroke-width="0.75" vector-effect=${L}></line>`;
  }, f = I(S(I(l, a), 0.5), S(e, 9 / s.scale));
  return R`
    <g class="dim">
      ${h(I(n, S(e, 2 / s.scale)), n)}${h(I(t, S(e, 2 / s.scale)), t)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${r} stroke-width="1" vector-effect=${L}></line>
      <text x=${f.x} y=${f.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${r} font-family="system-ui, sans-serif">${pt(C(n, t))}</text>
    </g>`;
}
function Vs(n, t) {
  const e = t.selection;
  if (!e) return v;
  const i = t.palette, s = 4 / t.scale, r = (o) => R`<circle cx=${o.x} cy=${o.y} r=${s} fill=${i.selection}></circle>`;
  if (e.kind === "node") {
    const o = n.nodes.find((l) => l.id === e.id);
    return o ? r(o) : v;
  }
  if (e.kind === "wall") {
    const o = Zt(Zn, n, ie).get(e.id), l = Qt(n, e.id);
    if (!o || !l) return v;
    const a = Z(l.dir);
    return R`
      <path d=${tt(o)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${L}></path>
      ${r(l.a)}${r(l.b)}
      ${xn(l.a, l.b, a, l.leftOff + 18 / t.scale, t)}`;
  }
  if (e.kind === "opening") {
    const o = n.openings.find((d) => d.id === e.id), l = o ? Qt(n, o.wallId) : null;
    if (!o || !l) return v;
    const a = S(Z(l.dir), -1), h = l.rightOff + 18 / t.scale, f = (d) => I(l.a, S(l.dir, d)), c = [[0, o.offset], [o.offset, o.offset + o.width], [o.offset + o.width, l.len]];
    return R`
      <path d=${tt(se(l, o.offset, o.offset + o.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${L}></path>
      ${c.filter(([d, u]) => u - d >= 1).map(([d, u]) => xn(f(d), f(u), a, h, t))}`;
  }
  return v;
}
function Gs(n, t, e) {
  if (C(n, t) < 1e-6) return null;
  const i = e.thickness, [s, r] = e.baseline === "left" ? [0, i] : e.baseline === "right" ? [i, 0] : [i / 2, i / 2];
  return se({ a: n, dir: ee(P(t, n)), len: C(n, t), leftOff: s, rightOff: r }, 0, C(n, t));
}
function Xs(n, t) {
  const { preview: e, palette: i } = t, s = 1e7, r = e.orthoFrom, o = e.opening, l = o ? Qt(n, o.wallId) : null;
  return R`
    ${r ? R`<path d=${`M${r.x - s} ${r.y}H${r.x + s}M${r.x} ${r.y - s}V${r.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${L}></path>` : v}
    ${(e.walls ?? []).map((a) => {
    const h = Gs(a.a, a.b, a.props);
    return R`<g class="preview-wall">
        ${h ? R`<path d=${tt(h)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${L}></line></g>`;
  })}
    ${o && l ? R`<path class=${`preview-opening${o.invalid ? " invalid" : ""}`}
      d=${tt(se(l, o.offset, o.offset + o.width))}
      fill=${o.invalid ? i.invalid : o.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${Qs(n, t)}`;
}
function Zs(n, t) {
  const e = t.palette, i = 5 / t.scale;
  return R`<g class="snap-start">
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.background}
      stroke-width="4" vector-effect=${L}></rect>
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.snap}
      stroke-width="1.5" vector-effect=${L}></rect></g>`;
}
function Qs(n, t) {
  const e = t.preview, i = t.palette, s = e.anchor ? Zs(e.anchor, t) : v, r = e.snap;
  if (!r || r.kind === "none") return s;
  const o = (u) => u / t.scale, { x: l, y: a } = r.pt, h = { stroke: i.background, width: "3" };
  let f, c = v;
  if (r.kind === "node") {
    const u = o(5);
    f = R`<g class="snap-node"><rect x=${l - u} y=${a - u} width=${2 * u} height=${2 * u} fill=${i.snap}
      stroke=${h.stroke} stroke-width=${h.width} paint-order="stroke" vector-effect=${L}></rect></g>`;
  } else if (r.kind === "mid") {
    const u = o(11) / Math.sqrt(3), g = `M${l} ${a - u}L${l + u * 0.866} ${a + u / 2}L${l - u * 0.866} ${a + u / 2}Z`;
    f = R`<g class="snap-mid"><path d=${g} fill=${i.snap} stroke=${h.stroke} stroke-width=${h.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${L}></path></g>`;
  } else if (r.kind === "wall") {
    const u = o(5), g = `M${l - u} ${a - u}L${l + u} ${a + u}M${l - u} ${a + u}L${l + u} ${a - u}`;
    f = R`<g class="snap-wall">
      <path d=${g} fill="none" stroke=${h.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${L}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${L}></path></g>`;
    const p = r.endpoint.kind === "wall" ? Zt(Zn, n, ie).get(r.endpoint.wallId) : void 0;
    p && (c = R`<path class="snap-wall-hl" d=${tt(p)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${L}></path>`);
  } else {
    const u = o(4), g = `M${l - u} ${a}H${l + u}M${l} ${a - u}V${a + u}`;
    f = R`<g class="snap-grid">
      <path d=${g} fill="none" stroke=${h.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${L}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${L}></path></g>`;
  }
  const d = w(`snapmark.${r.kind}`, t.lang);
  return R`
    ${c}${s}${f}
    <text class="snap-label" x=${l + o(9)} y=${a - o(9)} font-size=${o(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${L} font-family="system-ui, sans-serif">${d}</text>`;
}
function Js(n, t) {
  const e = t.preview.level ?? n, i = t.palette, s = Zt(js, e, (h) => Dn(h, !0)), r = e.walls.filter((h) => h.type === "railing" || h.type === "fence"), o = r.length ? Zt(Fs, e, zn) : null, l = 8 / t.scale, a = t.selection;
  return R`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${l} height=${l} patternTransform="rotate(45)">
        <rect width=${l} height=${l} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${l} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${e.zones.map((h) => Ws(h, t, (a == null ? void 0 : a.kind) === "zone" && a.id === h.id))}</g>
    <path class="walls" d=${s.map((h) => h.map(tt).join("")).join("")} fill=${i.wall} fill-rule="evenodd"></path>
    ${o ? R`<g class="railings">${r.flatMap((h) => (o.get(h.id) ?? []).map((f) => R`<path d=${tt(f)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings">${e.openings.map((h) => qs(e, h, t))}</g>
    <g class="selection">${Vs(e, t)}</g>
    <g class="preview">${Xs(e, t)}</g>`;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, tr = (n) => (...t) => ({ _$litDirective$: n, values: t });
class er {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nr = (n) => n.strings === void 0, ir = {}, sr = (n, t = ir) => n._$AH = t;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qn = tr(class extends er {
  constructor(n) {
    if (super(n), n.type !== xt.PROPERTY && n.type !== xt.ATTRIBUTE && n.type !== xt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!nr(n)) throw Error("`live` bindings can only contain a single expression");
  }
  render(n) {
    return n;
  }
  update(n, [t]) {
    if (t === X || t === v) return t;
    const e = n.element, i = n.name;
    if (n.type === xt.PROPERTY) {
      if (t === e[i]) return X;
    } else if (n.type === xt.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(i)) return X;
    } else if (n.type === xt.ATTRIBUTE && e.getAttribute(i) === t + "") return X;
    return sr(n), t;
  }
}), rr = ["select", "box", "wall", "door", "window", "opening", "zone"], or = ["bearing", "partition", "railing"];
function lr(n) {
  switch (n.saveState) {
    case "saving":
      return w("save.saving", n.lang);
    case "conflict":
      return w("save.conflict", n.lang);
    case "error":
      return w("save.error", n.lang);
    default:
      return n.dirty ? w("save.dirty", n.lang) : w(n.saveState === "saved" ? "save.saved" : "save.clean", n.lang);
  }
}
function Ce(n) {
  const t = n.replace(/[\s ]/g, "");
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return e > 0 ? e : null;
}
function ar(n) {
  return n.lang, E`
    <div class="top">
      ${n.lead ?? v}
      ${n.plans.length > 1 ? E`
        <select class="plan-pick" aria-label=${w("plan.pick")} title=${w("plan.pick")}
          ?disabled=${n.saveState === "saving"} .value=${Qn(n.planId)}
          @change=${(t) => {
    const e = t.target, i = e.value;
    e.value = n.planId, i !== n.planId && n.onPickPlan(i);
  }}>
          ${n.plans.map((t) => E`<option value=${t.id} ?selected=${t.id === n.planId}>${t.name}</option>`)}
        </select>` : v}
      <input class="plan-name" .value=${n.planName} aria-label=${w("plan.name")} title=${w("plan.name")}
        @change=${(t) => n.onRename(t.target.value)} />
      <span class="sp"></span>
      <span class="muted">${w("walltype.label")}:</span>
      ${or.map((t) => E`
        <button class="tab ${n.wallType === t ? "on" : ""}" data-walltype=${t} @click=${() => n.onWallType(t)}>
          ${w(`walltype.${t}`)} ${Ct[t]}</button>`)}
      <input class="num" type="text" inputmode="numeric" .value=${String(n.thickness)}
        aria-label=${w("props.thickness")} title=${w("props.thickness")}
        @change=${(t) => {
    const e = t.target, i = Ce(e.value);
    i === null ? e.value = String(n.thickness) : n.onThickness(i);
  }} />
      <span class="muted">${w("unit.mm")}</span>
      <span class="sp"></span>
      <button class="btn" title=${w("action.undo")} aria-label=${w("action.undo")} ?disabled=${!n.canUndo}
        @click=${n.onUndo}>↶</button>
      <button class="btn" title=${w("action.redo")} aria-label=${w("action.redo")} ?disabled=${!n.canRedo}
        @click=${n.onRedo}>↷</button>
      <span class="save-state ${n.saveState}" title=${n.saveState === "error" ? n.errorMessage ?? "" : ""}>
        ${lr(n)}${n.saveState === "error" && n.errorMessage ? E`: ${n.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${n.saveState === "saving"} @click=${n.onSave}>
        ${w("action.save")}</button>
    </div>`;
}
function cr(n, t, e) {
  return E`
    <div class="tools">
      ${rr.map((i) => E`
        ${i === "zone" ? E`<div class="tool-sep"></div>` : v}
        <button class="tool ${n === i ? "on" : ""}" data-tool=${i} @click=${() => e(i)}>
          ${w(`tool.${i}`)}</button>`)}
    </div>`;
}
const $e = ["door", "gate", "wicket"];
function hr(n, t) {
  return $e.includes(t) ? { kind: t, hinge: n.hinge ?? "start", swing: n.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: n.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function ur(n, t, e) {
  const i = as(n, t, e), s = Object.keys(e).filter((r) => e[r] === void 0);
  return s.length === 0 ? i : {
    ...i,
    openings: i.openings.map((r) => {
      if (r.id !== t) return r;
      const o = { ...r };
      for (const l of s) delete o[l];
      return o;
    })
  };
}
function B(n, t) {
  return E`<label class="row"><span>${n}</span>${t}</label>`;
}
function bt(n, t, e) {
  return E`<select class="val" @change=${(i) => e(i.target.value)}>
    ${t.map((i) => E`<option value=${i.v} ?selected=${i.v === n}>${i.label}</option>`)}
  </select>`;
}
function Jn(n, t, e, i) {
  return E`<input class="val" type="text" inputmode="numeric" .value=${String(Math.round(n))}
    @change=${(s) => {
    const r = s.target, o = Ce(r.value);
    o === null || !t(o) ? (r.value = String(Math.round(n)), e.setNotice(w(o === null ? i : "props.noFit", e.lang))) : e.setNotice(null);
  }} />`;
}
function dr(n, t) {
  t.lang;
  const e = yt(t.level, n).len, i = ["bearing", "partition", "railing", ...n.type === "fence" ? ["fence"] : []], s = (r) => t.commit(xs(t.level, n.id, r));
  return E`
    <h4>${w("props.wall")}</h4>
    ${B(w("props.type"), bt(
    n.type,
    i.map((r) => ({ v: r, label: w(`walltype.${r}`) })),
    (r) => s({ type: r, thickness: Ct[r] })
  ))}
    ${B(w("props.thickness"), Jn(n.thickness, (r) => (s({ thickness: r }), !0), t, "props.badWidth"))}
    ${B(w("props.baseline"), bt(
    n.baseline,
    ["center", "left", "right"].map((r) => ({ v: r, label: w(`baseline.${r}`) })),
    (r) => s({ baseline: r })
  ))}
    ${B(w("props.length"), E`<span class="val ro">${pt(e)} ${w("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.remove(Ne(t.level, n.id))}>
      ${w("action.delete")}</button>`;
}
function fr(n, t) {
  t.lang;
  const e = ["door", "window", "opening", ...$e.slice(1).includes(n.kind) ? [n.kind] : []], i = (o) => t.commit(ur(t.level, n.id, o)), s = ["left", "right"].map((o) => ({ v: o, label: w(`side.${o}`) })), r = $e.includes(n.kind);
  return E`
    <h4>${w(`kind.${n.kind}`)}</h4>
    ${B(w("props.kind"), bt(n.kind, e.map((o) => ({ v: o, label: w(`kind.${o}`) })), (o) => i(hr(n, o))))}
    ${B(w("props.width"), Jn(n.width, (o) => {
    const l = ls(t.level, n.id, o);
    return l === t.level ? !1 : (t.commit(l), !0);
  }, t, "props.badWidth"))}
    ${B(w("props.offset"), E`<input class="val" type="text" inputmode="numeric" .value=${String(Math.round(n.offset))}
      @change=${(o) => {
    const l = o.target, a = l.value.replace(/[\s ]/g, ""), h = /^\d+$/.test(a) ? Wn(t.level, n.id, Number(a)) : t.level;
    if (h === t.level) {
      l.value = String(Math.round(n.offset)), t.setNotice(w("props.noFit"));
      return;
    }
    t.setNotice(null), t.commit(h);
  }} />`)}
    ${r ? E`
      ${B(w("props.hinge"), bt(
    n.hinge ?? "start",
    ["start", "end"].map((o) => ({ v: o, label: w(`hinge.${o}`) })),
    (o) => i({ hinge: o })
  ))}
      ${B(w("props.swing"), bt(n.swing ?? "left", s, (o) => i({ swing: o })))}` : v}
    ${n.kind === "window" ? B(w("props.outside"), bt(n.outside ?? "left", s, (o) => i({ outside: o }))) : v}
    ${n.invalid ? E`<p class="warn">${w("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.remove(Re(t.level, n.id))}>
      ${w("action.delete")}</button>`;
}
function pr(n, t) {
  return t.lang, E`
    <h4>${w("props.zone")}</h4>
    ${B(w("props.name"), E`<input class="val wide" type="text" .value=${n.name}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = n.name;
      return;
    }
    s !== n.name && t.commit(os(t.level, n.id, s));
  }} />`)}
    ${B(w("props.area"), E`<span class="val ro">${Xn(Bn(n.outline))}</span>`)}
    ${n.broken ? E`<p class="warn">${w("props.broken")}</p>` : v}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.remove(Pe(t.level, n.id))}>
      ${w("action.delete")}</button>`;
}
function gr(n) {
  n.lang;
  const t = ["bearing", "partition", "railing"];
  return E`
    <h4>${w("props.newWall")}</h4>
    ${B(w("props.type"), E`<select class="val" data-field="new-wall-type"
      @change=${(e) => n.setWallType(e.target.value)}>
      ${t.map((e) => E`<option value=${e} ?selected=${e === n.wallType}>${w(`walltype.${e}`)}</option>`)}
    </select>`)}
    ${B(`${w("props.thickness")}, ${w("unit.mm")}`, E`<input class="val" type="text" inputmode="numeric"
      data-field="new-wall-thickness" .value=${Qn(String(n.thickness))}
      @change=${(e) => {
    const i = e.target, s = Ce(i.value);
    if (s === null) {
      i.value = String(n.thickness), n.setNotice(w("props.badWidth"));
      return;
    }
    n.setNotice(null), n.setThickness(s);
  }} />`)}
    ${n.tool === "box" ? E`
      <div class="muted">${w("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((e) => E`
          <button class="tab ${n.boxMeasure === e ? "on" : ""}" data-measure=${e} @click=${() => n.setBoxMeasure(e)}>
            ${w(`measure.${e}`)}</button>`)}
      </div>` : v}`;
}
function yr(n) {
  const { level: t, selection: e } = n;
  let i = v;
  if ((e == null ? void 0 : e.kind) === "wall") {
    const s = t.walls.find((r) => r.id === e.id);
    s && (i = dr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "opening") {
    const s = t.openings.find((r) => r.id === e.id);
    s && (i = fr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "zone") {
    const s = t.zones.find((r) => r.id === e.id);
    s && (i = pr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "node") {
    const s = t.nodes.find((r) => r.id === e.id);
    s && (i = E`<h4>${w("props.node", n.lang)}</h4>
      ${B("X", E`<span class="val ro">${pt(s.x)}</span>`)}${B("Y", E`<span class="val ro">${pt(s.y)}</span>`)}`);
  }
  return E`
    <div class="props">
      ${i === v && (n.tool === "wall" || n.tool === "box") ? gr(n) : i === v ? E`<p class="muted">${w("props.none", n.lang)}</p>` : i}
      ${n.notice ? E`<p class="warn">${n.notice}</p>` : v}
    </div>`;
}
function mr(n) {
  return n.lang, E`
    <div class="status">
      <span><span class="kbd">Shift</span> ${w("hint.shift")}</span>
      <span><span class="kbd">${w("hint.digits")}</span> ${w("hint.length")}</span>
      <span><span class="kbd">Tab</span> ${w("hint.tab")}</span>
      <span><span class="kbd">Esc</span> ${w("hint.esc")}</span>
      <span class="sp"></span>
      ${n.snap ? E`<span class="snap-kind">${n.snap}</span>` : ""}
      <span>${n.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${n.grid} @change=${(t) => n.onGrid(t.target.checked)} />
        ${w("status.grid")}
      </label>
    </div>`;
}
function xr(n, t) {
  var r, o;
  const e = t.palette, i = 1 / t.scale, s = [
    {
      label: w(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: n.length,
      live: ((r = t.live) == null ? void 0 : r.first) ?? "",
      active: n.field === "length",
      unit: w("unit.mm")
    },
    {
      label: w(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: n.angle,
      live: ((o = t.live) == null ? void 0 : o.second) ?? "",
      active: n.field === "angle",
      unit: t.mode === "box" ? w("unit.mm") : "°"
    }
  ];
  return R`
    <g class="tracker" transform=${`translate(${n.at.x + 18 * i} ${n.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${e.input} stroke=${e.inputBorder}></rect>
      ${s.map((l, a) => R`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${e.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${e.background}
          stroke=${l.active ? e.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? e.text : e.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function wr(n, t, e, i) {
  const s = n.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a, b: h } = s[0], f = Math.hypot(h.x - a.x, h.y - a.y);
    let c = Math.atan2(-(h.y - a.y), h.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: pt(f), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const r = e === "inner" ? -i : e === "outer" ? i : 0, o = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + r, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + r;
  return { first: pt(o), second: pt(l) };
}
function $r(n) {
  return Object.entries(n).filter(([, t]) => typeof t == "string").map(([t, e]) => `--ps-${t}:${e}`).join(";");
}
const vr = ri`
  :host { display: block; height: 100%; outline: none; }
  .ed {
    display: grid; grid-template-columns: 64px 1fr 240px; grid-template-rows: auto 1fr 30px;
    height: 100vh; overflow: hidden; position: relative;
    background: var(--ps-background); color: var(--ps-text); font: 13px system-ui, sans-serif;
  }
  .center { display: flex; align-items: center; justify-content: center; gap: 12px; height: 100vh;
    font: 14px system-ui, sans-serif; }
  .top { grid-column: 1 / 4; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 10px;
    min-width: 0; min-height: 44px; box-sizing: border-box;
    background: var(--ps-panel); border-bottom: 1px solid var(--ps-border); }
  .sp { flex: 1; }
  .muted { color: var(--ps-muted); font-size: 12px; }
  button { font: inherit; cursor: pointer; }
  button:disabled { opacity: .45; cursor: default; }
  .tab { padding: 5px 10px; border-radius: 6px; border: 0; background: transparent; color: var(--ps-muted); }
  .tab.on { background: var(--ps-border); color: var(--ps-text); }
  .btn { padding: 5px 10px; border: 1px solid var(--ps-inputBorder); border-radius: 6px; background: transparent;
    color: var(--ps-text); }
  .btn.primary { border-color: var(--ps-accent); background: var(--ps-accent); color: var(--ps-accentText); }
  .btn.danger { margin-top: 14px; color: var(--ps-invalid); border-color: var(--ps-invalid); }
  input, select { font: inherit; color: var(--ps-text); background: var(--ps-input);
    border: 1px solid var(--ps-inputBorder); border-radius: 4px; padding: 2px 6px; }
  .plan-name { width: 180px; font-weight: 600; }
  .plan-pick { max-width: 160px; }
  .draft-banner { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); z-index: 5;
    display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px;
    background: var(--ps-panel); border: 1px solid var(--ps-accent); white-space: nowrap; }
  .num { width: 56px; text-align: right; }
  .save-state { font-size: 12px; color: var(--ps-muted); max-width: 260px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; }
  .save-state.conflict, .save-state.error { color: var(--ps-invalid); }
  .tools { background: var(--ps-panel); border-right: 1px solid var(--ps-border); display: flex;
    flex-direction: column; align-items: center; gap: 4px; padding-top: 8px; }
  .tool { width: 54px; height: 40px; border-radius: 8px; border: 0; background: transparent; font-size: 11px;
    color: var(--ps-muted); line-height: 1.1; padding: 0 2px; }
  .tool.on { background: var(--ps-accent); color: var(--ps-accentText); }
  .tool-sep { height: 1px; width: 36px; background: var(--ps-border); margin: 4px 0; }
  .canvas { position: relative; min-width: 0; min-height: 0; touch-action: none; }
  .canvas svg { width: 100%; height: 100%; display: block; user-select: none; }
  .props { background: var(--ps-panel); border-left: 1px solid var(--ps-border); padding: 12px; overflow-y: auto; }
  .props h4 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em;
    color: var(--ps-muted); }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; }
  .row > span:first-child { color: var(--ps-muted); }
  .val { min-width: 70px; max-width: 120px; text-align: right; }
  .val.wide { max-width: 140px; text-align: left; }
  .val.ro { padding: 2px 6px; }
  .seg { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .warn { color: var(--ps-invalid); font-size: 12px; }
  .status { grid-column: 1 / 4; background: var(--ps-panel); border-top: 1px solid var(--ps-border); display: flex;
    gap: 18px; align-items: center; padding: 0 10px; font-size: 12px; color: var(--ps-muted); white-space: nowrap;
    overflow: hidden; }
  .kbd { border: 1px solid var(--ps-inputBorder); border-radius: 3px; padding: 0 4px; color: var(--ps-text); }
  .grid-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; }
  .backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); display: flex; align-items: center;
    justify-content: center; z-index: 10; }
  .dialog { background: var(--ps-panel); border: 1px solid var(--ps-border); border-radius: 10px; padding: 18px;
    max-width: 420px; }
  .dialog h3 { margin: 0 0 8px; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
`, br = 5e-3, kr = 2, ve = (n) => Math.max(br, Math.min(kr, n));
function Er(n, t, e) {
  var o;
  const i = (o = n == null ? void 0 : n.getScreenCTM) == null ? void 0 : o.call(n), s = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (s && Number.isFinite(s.a) && Number.isFinite(s.d))
    return { x: s.a * e.clientX + s.c * e.clientY + s.e, y: s.b * e.clientX + s.d * e.clientY + s.f };
  const r = n == null ? void 0 : n.getBoundingClientRect();
  return {
    x: t.x + (e.clientX - ((r == null ? void 0 : r.left) ?? 0)) / t.scale,
    y: t.y + (e.clientY - ((r == null ? void 0 : r.top) ?? 0)) / t.scale
  };
}
function Sr(n, t, e) {
  if (n.length === 0) return { x: -1e3, y: -1e3, scale: ve(Math.min(t, e) / 12e3) };
  const i = n.map((c) => c.x), s = n.map((c) => c.y), r = 1500, o = Math.min(...i) - r, l = Math.max(...i) + r, a = Math.min(...s) - r, h = Math.max(...s) + r, f = ve(Math.min(t / (l - o), e / (h - a)));
  return { x: (o + l) / 2 - t / f / 2, y: (a + h) / 2 - e / f / 2, scale: f };
}
function _r(n, t, e) {
  const i = ve(n.scale * Math.exp(-e * 15e-4));
  return { x: t.x - (t.x - n.x) * n.scale / i, y: t.y - (t.y - n.y) * n.scale / i, scale: i };
}
function Ar(n, t, e) {
  return { ...n, x: n.x - t / n.scale, y: n.y - e / n.scale };
}
function Mr(n, t, e, i) {
  const s = 100 * n.scale >= 6 ? 100 : 1e3, r = 1 / n.scale;
  return R`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${r}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${r}></path></pattern>
    </defs>
    <rect x=${n.x} y=${n.y} width=${t} height=${e} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Ir = ["Shift", "Control", "Alt", "Meta"];
function wn(n) {
  const t = n.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class Pr {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (e) => {
      var s, r;
      this.h.focus();
      const i = e.currentTarget;
      if (e.button === 1 || e.button === 0 && this.spaceDown) {
        e.preventDefault(), this.spacePending = !1, this.panFrom = { x: e.clientX, y: e.clientY }, (s = i.setPointerCapture) == null || s.call(i, e.pointerId);
        return;
      }
      e.button === 0 && ((r = i.setPointerCapture) == null || r.call(i, e.pointerId), this.pointerActive = !0, this.h.tool().down(this.toolEvent(e)), this.h.update());
    }, this.pointerMove = (e) => {
      if (this.panFrom) {
        this.h.view = Ar(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y), this.panFrom = { x: e.clientX, y: e.clientY };
        return;
      }
      this.h.tool().move(this.toolEvent(e)), this.h.update();
    }, this.pointerUp = (e) => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      e.button !== 0 || !this.pointerActive || (this.pointerActive = !1, this.h.tool().up(this.toolEvent(e)), this.h.update());
    }, this.pointerAbort = () => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      this.pointerActive && (this.pointerActive = !1, this.h.tool().preview().level && this.h.tool().cancel(), this.h.update());
    }, this.wheel = (e) => {
      e.preventDefault(), this.h.view = _r(this.h.view, this.h.toMm(e), e.deltaY);
    }, this.keyDown = (e) => {
      if (this.h.modal()) {
        e.key === "Escape" && (e.preventDefault(), this.h.closeModal());
        return;
      }
      if (wn(e) || !this.h.ready()) return;
      const i = e.ctrlKey || e.metaKey, s = e.code === "KeyZ" ? "z" : e.code === "KeyY" ? "y" : e.code === "KeyS" ? "s" : e.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        e.preventDefault(), s === "z" && !e.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && s === "s") {
        e.preventDefault(), this.h.save();
        return;
      }
      if (e.key === " ") {
        e.preventDefault(), !e.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      let r = this.h.tool().key(e.key, { shift: e.shiftKey, ctrl: i });
      !r && e.key === "Delete" && (r = this.h.deleteSelection()), !r && e.key === "Escape" && (this.h.clearSelection(), r = !0), r && e.preventDefault(), this.h.update();
    }, this.keyUp = (e) => {
      const i = this.h.modal() || wn(e), s = { shift: e.shiftKey, ctrl: e.ctrlKey || e.metaKey };
      if (e.key === " ") {
        this.spaceDown = !1;
        const r = this.spacePending;
        this.spacePending = !1, r && !i && (this.h.tool().key(" ", s), this.h.update());
        return;
      }
      i || !Ir.includes(e.key) || (this.h.tool().key(e.key, s), this.h.update());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function Or(n) {
  return E`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${w("conflict.title")}</h3>
        <p>${w(n.mode === "conflict" ? "conflict.text" : "conflict.again")}</p>
        ${n.message ? E`<p class="muted">${n.message}</p>` : v}
        <div class="actions">
          ${n.mode === "conflict" ? E`<button class="btn" data-action="overwrite" ?disabled=${n.busy}
            @click=${n.onOverwrite}>${w("conflict.overwrite")}</button>` : v}
          <button class="btn primary" data-action="save-as-new" ?disabled=${n.busy}
            @click=${n.onSaveAsNew}>${w("conflict.saveAsNew")}</button>
          <button class="btn" data-action="cancel" @click=${n.onCancel}>${w("conflict.cancel")}</button>
        </div>
      </div>
    </div>`;
}
function ti(n, t) {
  try {
    return new Date(n).toLocaleString(t);
  } catch {
    return new Date(n).toISOString();
  }
}
function Rr(n) {
  const t = n.lang, e = ti(n.savedAt, t);
  return E`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${w("draft.title")}</h3>
        <p>${w("draft.text").replace("{time}", e)}</p>
        <div class="actions">
          <button class="btn primary" data-action="restore" @click=${n.onRestore}>${w("draft.restore")}</button>
          <button class="btn" data-action="discard" @click=${n.onDiscard}>${w("draft.discard")}</button>
        </div>
      </div>
    </div>`;
}
function Tr(n) {
  const t = n.lang;
  return E`
    <div class="draft-banner" role="status">
      <span>${w("draft.banner").replace("{time}", ti(n.savedAt, t))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${n.onRestore}>${w("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${n.onDiscard}>${w("draft.discard")}</button>
    </div>`;
}
function Lr(n) {
  return E`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${w("switch.title")}</h3>
        <p>${w("switch.text")}</p>
        <div class="actions">
          <button class="btn primary" data-action="switch-discard" @click=${n.onDiscard}>${w("switch.discard")}</button>
          <button class="btn" data-action="switch-cancel" @click=${n.onCancel}>${w("switch.cancel")}</button>
        </div>
      </div>
    </div>`;
}
const Rt = "plan_studio.draft.", $n = "plan_studio.lastPlanId";
function Nr() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Cr(n) {
  const t = n;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class zr {
  constructor(t = Nr, e = 500) {
    this.storage = t, this.delayMs = e, this.timer = null, this.pending = null;
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
    var e;
    try {
      (e = this.storage()) == null || e.setItem(Rt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var e;
    try {
      const i = (e = this.storage()) == null ? void 0 : e.getItem(Rt + t), s = i ? JSON.parse(i) : null;
      return Cr(s) && s.planId === t ? s : null;
    } catch {
      return null;
    }
  }
  /** Newest draft of any plan (used when the server has no plans, e.g. an unsaved new plan). */
  latest() {
    try {
      const t = this.storage();
      if (!t) return null;
      let e = null;
      for (let i = 0; i < t.length; i++) {
        const s = t.key(i);
        if (!(s != null && s.startsWith(Rt))) continue;
        const r = this.read(s.slice(Rt.length));
        r && (!e || r.savedAt > e.savedAt) && (e = r);
      }
      return e;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var t;
    try {
      return ((t = this.storage()) == null ? void 0 : t.getItem($n)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var e;
    try {
      (e = this.storage()) == null || e.setItem($n, t);
    } catch {
    }
  }
  clear(t) {
    var e;
    try {
      (e = this.storage()) == null || e.removeItem(Rt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
var Dr = Object.defineProperty, z = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && Dr(t, e, s), s;
};
const Ur = { id: "", name: "", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [] };
function vn(n, t) {
  return (t.kind === "wall" ? n.walls : t.kind === "node" ? n.nodes : t.kind === "opening" ? n.openings : n.zones).some((i) => i.id === t.id);
}
function bn(n) {
  return n instanceof Error || typeof n == "object" && n !== null && typeof n.message == "string" ? n.message : String(n);
}
const ze = class ze extends Nt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Ct.bearing, this.boxMeasure = "inner", this.grid = !0, this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = "none", this.notice = null, this.pendingDraft = null, this.restoreOpen = !1, this.plans = [], this.switchTo = null, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new zr(), this.resizeObs = null, this.onBeforeUnload = (s) => {
      this.drafts.flush(), this.save.dirty && (s.preventDefault(), s.returnValue = "");
    }, this.onPageHide = () => {
      this.drafts.flush();
    }, this.refocus = (s) => {
      const r = s.composedPath()[0];
      r instanceof Element && r.closest("button") && this.focus();
    }, this.refocusAfterChange = (s) => {
      const r = s.composedPath()[0];
      (r instanceof HTMLInputElement || r instanceof HTMLSelectElement) && (r.blur(), this.focus());
    };
    const t = this, e = {
      get connection() {
        return t.hass.connection;
      },
      get language() {
        return t.uiLang;
      },
      get themes() {
        var s;
        return (s = t.hass) == null ? void 0 : s.themes;
      }
    };
    this.save = new Es(e, () => {
      this.save.dirty && this.plan && !this.draftBlocked() && this.drafts.schedule(() => this.makeDraft()), this.requestUpdate();
    }), this.ctx = {
      level: () => {
        var s;
        return ((s = this.history) == null ? void 0 : s.current) ?? Ur;
      },
      commit: (s) => this.commit(s),
      tolMm: () => 10 / this.view.scale,
      grid: () => this.grid ? 100 : null,
      wallProps: () => ({ type: this.wallType, thickness: this.thickness, baseline: "center" }),
      boxMeasure: () => this.boxMeasure,
      select: (s) => {
        this.selection = s, this.notice = null;
      },
      lang: () => this.uiLang
    }, this.activeTool = this.makeTool("select");
    const i = {
      tool: () => this.activeTool,
      get view() {
        return t.view;
      },
      set view(s) {
        t.view = s;
      },
      ready: () => !!this.history,
      modal: () => this.restoreOpen || this.dialog !== "none" || this.switchTo !== null,
      // Escape on the restore prompt = decide later: the draft is kept and a banner keeps offering it.
      closeModal: () => {
        this.restoreOpen = !1, this.dialog = "none", this.switchTo = null;
      },
      toMm: (s) => this.toMm(s),
      focus: () => this.focus(),
      update: () => this.requestUpdate(),
      undo: () => this.undo(),
      redo: () => this.redo(),
      save: () => {
        this.doSave();
      },
      deleteSelection: () => this.deleteSelection(),
      clearSelection: () => {
        this.activeTool.cancel(), this.selection = null;
      }
    };
    this.input = new Pr(i);
  }
  get uiLang() {
    var t;
    return ((t = this.hass) == null ? void 0 : t.language) ?? "en";
  }
  makeTool(t) {
    switch (t) {
      case "box":
        return Rs(this.ctx);
      case "wall":
        return Ls(this.ctx);
      case "door":
      case "window":
      case "opening":
        return Ns(this.ctx, t);
      case "zone":
        return zs(this.ctx);
      default:
        return Os(this.ctx);
    }
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.draftBlocked() && this.drafts.write(this.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null;
  }
  willUpdate(t) {
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.load(), this.needFit && this.size.w > 0 && this.size.h > 0 && (this.needFit = !1, this.fit());
  }
  updated() {
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((e) => {
      const i = e[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  async load() {
    if (this.hass) {
      this.loading = !0, this.loadError = null;
      try {
        const t = await gn(this.hass);
        if (this.plans = t, t.length === 0)
          this.save.reset(null), this.adopt(Si(w("plan.default", this.uiLang))), this.offerDraft(this.drafts.latest());
        else {
          const e = this.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === e) ? e : t[0].id);
        }
      } catch (t) {
        this.loadError = bn(t);
      } finally {
        this.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const e = await $s(this.hass, t);
    this.drafts.cancel(), this.save.reset(e.revision), this.adopt(e), this.drafts.setLastPlanId(e.id), this.offerDraft(this.drafts.read(e.id));
  }
  offerDraft(t) {
    this.pendingDraft = t, this.restoreOpen = !!t;
  }
  async refreshPlans() {
    if (this.hass)
      try {
        this.plans = await gn(this.hass);
      } catch {
      }
  }
  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions() {
    const t = this.plan, e = this.plans.map((i) => ({ id: i.id, name: i.id === t.id ? t.name : i.name }));
    return e.some((i) => i.id === t.id) || e.push({ id: t.id, name: t.name }), e;
  }
  pickPlan(t) {
    if (!(!this.plan || t === this.plan.id || this.save.state === "saving")) {
      if (this.save.dirty) {
        this.switchTo = t;
        return;
      }
      this.switchPlan(t);
    }
  }
  async switchPlan(t) {
    try {
      await this.openPlan(t);
    } catch (e) {
      this.notice = bn(e);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    const t = this.switchTo;
    this.switchTo = null, !(!t || !this.plan) && (this.drafts.cancel(), this.draftBlocked() || this.drafts.clear(this.plan.id), this.switchPlan(t));
  }
  adopt(t) {
    const e = Array.isArray(t.levels) && t.levels.length > 0 ? t : {
      ...t,
      levels: [{ id: G(), name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [] }]
    };
    this.plan = e, this.history = new ws(e.levels[0]), this.activeTool.cancel(), this.activeTool = this.makeTool(this.toolId), this.selection = null, this.needFit = !0;
  }
  // ---- local draft ----
  makeDraft() {
    return { planId: this.plan.id, baseRevision: this.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }
  /** True while an undecided draft of the open plan must not be overwritten. */
  draftBlocked() {
    return !!this.pendingDraft && !!this.plan && this.pendingDraft.planId === this.plan.id;
  }
  restoreDraft(t) {
    this.pendingDraft = null, this.restoreOpen = !1, this.adopt(t.plan), this.save.baseRevision = t.baseRevision, this.save.markDirty();
  }
  discardDraft(t) {
    this.pendingDraft = null, this.restoreOpen = !1, this.drafts.clear(t.planId), this.save.dirty && this.plan && this.drafts.schedule(() => this.makeDraft());
  }
  /** After a successful save: drop drafts of the given ids unless edits made meanwhile keep the plan dirty. */
  afterSaved(...t) {
    var e;
    if (this.save.state === "saved") {
      this.drafts.setLastPlanId(this.plan.id), this.refreshPlans(), this.drafts.cancel();
      for (const i of t) ((e = this.pendingDraft) == null ? void 0 : e.planId) !== i && this.drafts.clear(i);
      this.save.dirty && !this.draftBlocked() && this.drafts.schedule(() => this.makeDraft());
    }
  }
  // ---- editing ----
  commit(t) {
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !vn(t, this.selection) && (this.activeTool.cancel(), this.selection = null), this.requestUpdate());
  }
  /** Commit from outside the tool that removes the selected element. */
  commitRemoval(t) {
    this.activeTool.cancel(), this.selection = null, this.commit(t);
  }
  deleteSelection() {
    var i;
    const t = this.selection, e = (i = this.history) == null ? void 0 : i.current;
    return !t || !e || t.kind === "node" || !vn(e, t) ? !1 : (this.commitRemoval(t.kind === "wall" ? Ne(e, t.id) : t.kind === "opening" ? Re(e, t.id) : Pe(e, t.id)), !0);
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
  step(t) {
    this.activeTool.cancel(), this.selection = null, t() && this.save.markDirty(), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness follows the type preset. */
  setWallType(t) {
    this.wallType = t, this.thickness = Ct[t];
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, t === "box" && (this.wallType = "bearing", this.thickness = Ct.bearing), this.toolId = t, this.activeTool = this.makeTool(t);
  }
  // ---- saving ----
  currentPlan() {
    const t = this.plan, e = t.levels.map((i, s) => s === 0 ? this.history.current : i);
    return { ...t, levels: e, revision: this.save.baseRevision ?? 0 };
  }
  async doSave() {
    !this.plan || this.save.state === "saving" || (await this.save.save(this.currentPlan()), this.afterSaved(this.plan.id), this.save.state === "conflict" && (this.dialog = "conflict"));
  }
  async doOverwrite() {
    !this.plan || this.save.state === "saving" || (await this.save.overwrite(this.currentPlan()), this.afterSaved(this.plan.id), this.dialog = this.save.state === "conflict" ? "conflict-again" : "none");
  }
  async doSaveAsNew() {
    if (!this.plan || this.save.state === "saving") return;
    const t = `${this.plan.name} ${w("plan.copySuffix", this.uiLang)}`, e = this.plan.id, i = await this.save.saveAsNew(this.currentPlan(), t);
    i ? (this.plan = i, this.dialog = "none", this.afterSaved(e, i.id)) : this.save.state === "error" && (this.dialog = "none");
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return Er(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = Sr(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    const t = this.pendingDraft;
    return t && this.restoreOpen ? Rr({
      lang: this.uiLang,
      savedAt: t.savedAt,
      onRestore: () => this.restoreDraft(t),
      onDiscard: () => this.discardDraft(t)
    }) : this.switchTo ? Lr({
      lang: this.uiLang,
      onDiscard: () => this.confirmSwitch(),
      onCancel: () => {
        this.switchTo = null;
      }
    }) : this.dialog === "none" ? v : Or({
      lang: this.uiLang,
      mode: this.dialog === "conflict" ? "conflict" : "again",
      busy: this.save.state === "saving",
      message: this.save.errorMessage,
      onOverwrite: () => this.doOverwrite(),
      onSaveAsNew: () => this.doSaveAsNew(),
      onCancel: () => {
        this.dialog = "none";
      }
    });
  }
  render() {
    var c, d;
    const t = this.uiLang;
    if (!this.plan || !this.history)
      return E`<div class="center">${this.loadError ? E`<span>${w("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.load()}>${w("action.retry")}</button>` : w("load.loading")}</div>`;
    const e = Bs(!!((d = (c = this.hass) == null ? void 0 : c.themes) != null && d.darkMode)), i = this.history.current, s = this.activeTool.preview(), { x: r, y: o, scale: l } = this.view, a = Math.max(1, this.size.w) / l, h = Math.max(1, this.size.h) / l, f = this.save;
    return E`
      <div class="ed" style=${$r(e)} @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${ar({
      lang: t,
      planName: this.plan.name,
      planId: this.plan.id,
      plans: this.planOptions(),
      wallType: this.wallType,
      thickness: this.thickness,
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: f.state,
      dirty: f.dirty,
      errorMessage: f.errorMessage,
      lead: this.narrow ? E`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onRename: (u) => {
        this.plan = { ...this.plan, name: u }, f.markDirty();
      },
      onPickPlan: (u) => this.pickPlan(u),
      onWallType: (u) => this.setWallType(u),
      onThickness: (u) => {
        this.thickness = u;
      },
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.doSave()
    })}
        ${cr(this.toolId, t, (u) => this.pickTool(u))}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${r} ${o} ${a} ${h}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(u) => u.preventDefault()}>
            ${this.grid ? Mr(this.view, a, h, e) : v}
            ${Js(i, { palette: e, selection: this.selection, preview: s, scale: l, lang: t })}
            ${s.tracker ? xr(s.tracker, {
      palette: e,
      scale: l,
      mode: this.toolId === "box" ? "box" : "wall",
      live: wr(s, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && !this.restoreOpen ? Tr({
      lang: t,
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.restoreDraft(this.pendingDraft),
      onDiscard: () => this.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${yr({
      level: i,
      selection: this.selection,
      tool: this.toolId,
      boxMeasure: this.boxMeasure,
      lang: t,
      notice: this.notice,
      wallType: this.wallType,
      thickness: this.thickness,
      setWallType: (u) => this.setWallType(u),
      setThickness: (u) => {
        this.thickness = u;
      },
      commit: (u) => this.commit(u),
      remove: (u) => this.commitRemoval(u),
      setBoxMeasure: (u) => {
        this.boxMeasure = u;
      },
      setNotice: (u) => {
        this.notice = u;
      }
    })}
        ${mr({
      lang: t,
      grid: this.grid,
      zoomPct: Math.round(l * 1e3),
      snap: s.snap && s.snap.kind !== "none" ? w(`snap.${s.snap.kind}`) : null,
      onGrid: (u) => {
        this.grid = u;
      }
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
ze.styles = vr;
let T = ze;
z([
  te({ attribute: !1 })
], T.prototype, "hass");
z([
  te({ type: Boolean })
], T.prototype, "narrow");
z([
  te({ attribute: !1 })
], T.prototype, "panel");
z([
  j()
], T.prototype, "plan");
z([
  j()
], T.prototype, "loadError");
z([
  j()
], T.prototype, "selection");
z([
  j()
], T.prototype, "toolId");
z([
  j()
], T.prototype, "wallType");
z([
  j()
], T.prototype, "thickness");
z([
  j()
], T.prototype, "boxMeasure");
z([
  j()
], T.prototype, "grid");
z([
  j()
], T.prototype, "view");
z([
  j()
], T.prototype, "size");
z([
  j()
], T.prototype, "dialog");
z([
  j()
], T.prototype, "notice");
z([
  j()
], T.prototype, "pendingDraft");
z([
  j()
], T.prototype, "restoreOpen");
z([
  j()
], T.prototype, "plans");
z([
  j()
], T.prototype, "switchTo");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", T);
export {
  T as PlanStudioPanel
};
