/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = globalThis, zn = Se.ShadowRoot && (Se.ShadyCSS === void 0 || Se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Cn = Symbol(), ai = /* @__PURE__ */ new WeakMap();
let bs = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== Cn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (zn && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = ai.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ai.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const or = (e) => new bs(typeof e == "string" ? e : e + "", void 0, Cn), vs = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new bs(n, e, Cn);
}, rr = (e, t) => {
  if (zn) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = Se.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, li = zn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return or(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ar, defineProperty: lr, getOwnPropertyDescriptor: cr, getOwnPropertyNames: dr, getOwnPropertySymbols: ur, getPrototypeOf: hr } = Object, $t = globalThis, ci = $t.trustedTypes, fr = ci ? ci.emptyScript : "", tn = $t.reactiveElementPolyfillSupport, le = (e, t) => e, Ae = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? fr : null;
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
} }, Nn = (e, t) => !ar(e, t), di = { attribute: !0, type: String, converter: Ae, reflect: !1, useDefault: !1, hasChanged: Nn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), $t.litPropertyMetadata ?? ($t.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Rt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = di) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && lr(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = cr(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? di;
  }
  static _$Ei() {
    if (this.hasOwnProperty(le("elementProperties"))) return;
    const t = hr(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(le("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(le("properties"))) {
      const n = this.properties, i = [...dr(n), ...ur(n)];
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
      for (const s of i) n.unshift(li(s));
    } else t !== void 0 && n.push(li(t));
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
    return rr(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : Ae).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : Ae;
      this._$Em = s;
      const d = l.fromAttribute(n, a.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? Nn)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
Rt.elementStyles = [], Rt.shadowRootOptions = { mode: "open" }, Rt[le("elementProperties")] = /* @__PURE__ */ new Map(), Rt[le("finalized")] = /* @__PURE__ */ new Map(), tn == null || tn({ ReactiveElement: Rt }), ($t.reactiveElementVersions ?? ($t.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis, ui = (e) => e, Ie = ce.trustedTypes, hi = Ie ? Ie.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, $s = "$lit$", yt = `lit$${Math.random().toFixed(9).slice(2)}$`, ws = "?" + yt, pr = `<${ws}>`, zt = document, he = () => zt.createComment(""), fe = (e) => e === null || typeof e != "object" && typeof e != "function", Ln = Array.isArray, gr = (e) => Ln(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", en = `[ 	
\f\r]`, te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fi = /-->/g, pi = />/g, Et = RegExp(`>|${en}(?:([^\\s"'>=/]+)(${en}*=${en}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gi = /'/g, mi = /"/g, xs = /^(?:script|style|textarea|title)$/i, ks = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), b = ks(1), E = ks(2), st = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), yi = /* @__PURE__ */ new WeakMap(), Mt = zt.createTreeWalker(zt, 129);
function _s(e, t) {
  if (!Ln(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return hi !== void 0 ? hi.createHTML(t) : t;
}
const mr = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = te;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let d, f, c = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, f = r.exec(l), f !== null); ) u = r.lastIndex, r === te ? f[1] === "!--" ? r = fi : f[1] !== void 0 ? r = pi : f[2] !== void 0 ? (xs.test(f[2]) && (s = RegExp("</" + f[2], "g")), r = Et) : f[3] !== void 0 && (r = Et) : r === Et ? f[0] === ">" ? (r = s ?? te, c = -1) : f[1] === void 0 ? c = -2 : (c = r.lastIndex - f[2].length, d = f[1], r = f[3] === void 0 ? Et : f[3] === '"' ? mi : gi) : r === mi || r === gi ? r = Et : r === fi || r === pi ? r = te : (r = Et, s = void 0);
    const h = r === Et && e[a + 1].startsWith("/>") ? " " : "";
    o += r === te ? l + pr : c >= 0 ? (i.push(d), l.slice(0, c) + $s + l.slice(c) + yt + h) : l + yt + (c === -2 ? a : h);
  }
  return [_s(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class pe {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [d, f] = mr(t, n);
    if (this.el = pe.createElement(d, i), Mt.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = Mt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith($s)) {
          const u = f[r++], h = s.getAttribute(c).split(yt), g = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: o, name: g[2], strings: h, ctor: g[1] === "." ? br : g[1] === "?" ? vr : g[1] === "@" ? $r : Be }), s.removeAttribute(c);
        } else c.startsWith(yt) && (l.push({ type: 6, index: o }), s.removeAttribute(c));
        if (xs.test(s.tagName)) {
          const c = s.textContent.split(yt), u = c.length - 1;
          if (u > 0) {
            s.textContent = Ie ? Ie.emptyScript : "";
            for (let h = 0; h < u; h++) s.append(c[h], he()), Mt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(c[u], he());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ws) l.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(yt, c + 1)) !== -1; ) l.push({ type: 7, index: o }), c += yt.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = zt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Ht(e, t, n = e, i) {
  var r, a;
  if (t === st) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = fe(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Ht(e, s._$AS(e, t.values), s, i)), t;
}
class yr {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? zt).importNode(n, !0);
    Mt.currentNode = s;
    let o = Mt.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new Tn(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new wr(o, this, t)), this._$AV.push(d), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = Mt.nextNode(), r++);
    }
    return Mt.currentNode = zt, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let Tn = class Ss {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, s) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = Ht(this, t, n), fe(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== st && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : gr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && fe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(zt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = pe.createElement(_s(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new yr(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = yi.get(t.strings);
    return n === void 0 && yi.set(t.strings, n = new pe(t)), n;
  }
  k(t) {
    Ln(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Ss(this.O(he()), this.O(he()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = ui(t).nextSibling;
      ui(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class Be {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, s, o) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = $;
  }
  _$AI(t, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = Ht(this, t, n, 0), r = !fe(t) || t !== this._$AH && t !== st, r && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = Ht(this, a[i + l], n, l), d === st && (d = this._$AH[l]), r || (r = !fe(d) || d !== this._$AH[l]), d === $ ? t = $ : t !== $ && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class br extends Be {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class vr extends Be {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
let $r = class extends Be {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Ht(this, t, n, 0) ?? $) === st) return;
    const i = this._$AH, s = t === $ && i !== $ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== $ && (i === $ || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class wr {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ht(this, t);
  }
}
const nn = ce.litHtmlPolyfillSupport;
nn == null || nn(pe, Tn), (ce.litHtmlVersions ?? (ce.litHtmlVersions = [])).push("3.3.3");
const xr = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new Tn(t.insertBefore(he(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = globalThis;
let Ut = class extends Rt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = xr(n, this.renderRoot, this.renderOptions);
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
    return st;
  }
};
var ys;
Ut._$litElement$ = !0, Ut.finalized = !0, (ys = Pt.litElementHydrateSupport) == null || ys.call(Pt, { LitElement: Ut });
const sn = Pt.litElementPolyfillSupport;
sn == null || sn({ LitElement: Ut });
(Pt.litElementVersions ?? (Pt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kr = { attribute: !0, type: String, converter: Ae, reflect: !1, hasChanged: Nn }, _r = (e = kr, t, n) => {
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
function pt(e) {
  return (t, n) => typeof n == "object" ? _r(e, t, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function T(e) {
  return pt({ ...e, state: !0, attribute: !1 });
}
function Y() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function Dn(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const bi = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Sr = ["on", "off", "auto"], Rn = (e) => Sr.includes(e), on = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Er = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [{ role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 }],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [on("on"), on("off"), on("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, bi],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, bi]
}, Bn = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, Mr = { climate_sensor: "any" };
function Vt(e) {
  const t = e.props, n = Er[t.kind];
  return t.kind !== "smart_button" ? n : n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
}
function Es(e) {
  return new Set(Vt(e).map((t) => t.role));
}
function Ms(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !Es(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const d = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete d.bindings, { ...e, devices: e.devices.map((f) => f === s ? d : f) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function Ar(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = Vt(e).filter((a) => a.primary), o = s.filter((a) => !!n[a.role]);
  return (Mr[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Ir(e) {
  const t = Vt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const Pr = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function yn(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !Rn(t) ? n : `${n}|${Pr(i[t])}`;
}
function Or(e, t, n) {
  const i = yn(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && Vt(s).some((o) => yn(s, o.role) === i));
}
function zr(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Vt(e)) {
    const s = Rn(i) ? yn(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function Fn(e) {
  if (!e.bindings) return e;
  const t = Es(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Wt = (e) => e === "wall_switch" || e === "smart_button", Cr = [100, 125, 150], Un = "mdi:cube-outline", vi = ["single", "double", "hold"];
function U(e) {
  return e.automationZones ?? [];
}
const Nr = {
  bearing: 400
}, Ee = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function As(e = Y(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function $i(e) {
  return {
    id: Y(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [As()]
  };
}
const Hn = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  wall_switch: ["wall"],
  smart_button: ["wall", "free"],
  socket: ["wall"],
  equipment: ["free"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, jt = 90, Is = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ct(e, t) {
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
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Un, label: "" };
    case "wall_switch":
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
const Lr = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Un
};
function Tr(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : Lr[String(n)] ?? Un;
  return { ...e, props: { ...i, icon: s } };
}
function Dr(e) {
  var n;
  if (e.props.kind !== "switch") return e;
  const t = (n = e.bindings) == null ? void 0 : n.action;
  return t ? { ...e, props: Ct("smart_button", e.placement.mode), bindings: { on: t } } : { ...e, props: Ct("wall_switch", e.placement.mode) };
}
const Ps = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function Rr(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = Ps(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function Br(e) {
  const t = e.props.kind;
  if (!Wt(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(Ct(t, e.placement.mode))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? Rr(r, o) : s === "windowSec" ? Ps(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function Fr(e) {
  if (e.props.kind !== "climate_sensor" || !("zoneIds" in e.props)) return e;
  const { zoneIds: t, ...n } = e.props;
  return { ...e, props: n };
}
function Ur(e) {
  if (!Wt(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function Hr(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => Fn(Fr(Ur(Br(Dr(Tr(n)))))));
  return t.some((n, i) => n !== e.devices[i]) ? { ...e, devices: t } : e;
}
function P(e, t) {
  return { x: e.x + t.x, y: e.y + t.y };
}
function A(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function M(e, t) {
  return { x: e.x * t, y: e.y * t };
}
function F(e, t) {
  return e.x * t.x + e.y * t.y;
}
function J(e, t) {
  return e.x * t.y - e.y * t.x;
}
function Os(e) {
  return Math.hypot(e.x, e.y);
}
function z(e, t) {
  return Os(A(t, e));
}
function Fe(e) {
  const t = Os(e);
  return t === 0 ? { x: 0, y: 0 } : M(e, 1 / t);
}
function tt(e) {
  return { x: e.y, y: -e.x };
}
function jr(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function ut(e, t, n, i) {
  const s = J(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = J(A(n, e), i) / s;
  return P(e, M(t, o));
}
function jn(e, t, n) {
  const i = A(n, t), s = F(i, i);
  return s === 0 ? 0 : F(A(e, t), i) / s;
}
function Ue(e, t, n) {
  const i = A(n, t), s = F(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, F(A(e, t), i) / s));
  return z(e, P(t, M(i, o)));
}
function Kt(e, t) {
  let n = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > e.y != r.y > e.y && e.x < (r.x - o.x) * (e.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function ft(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const i = e[n], s = e[(n + 1) % e.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
let kt = class {
  constructor(t, n) {
    this.next = null, this.key = t, this.data = n, this.left = null, this.right = null;
  }
};
function Zr(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function bt(e, t, n) {
  const i = new kt(null, null);
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
function rn(e, t, n, i) {
  const s = new kt(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = bt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function wi(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = bt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function qr(e, t, n) {
  return t === null ? e : (e === null || (t = bt(e.key, t, n), t.left = e), t);
}
function bn(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && bn(e.left, o, !1, i, s), e.right && bn(e.right, o, !0, i, s);
  }
}
class Zn {
  constructor(t = Zr) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = rn(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new kt(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = bt(t, this._root, s), r = s(t, o.key);
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
    return n === null ? null : (n = bt(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = bt(t, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = bt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = bt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    return Wr(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && wn(t, n, 0, s - 1, o), this._root === null)
      this._root = vn(t, n, 0, s), this._size = s;
    else {
      const r = Kr(
        this.toList(),
        Vr(t, n),
        o
      );
      s = this._size + s, this._root = $n({ head: r }, 0, s);
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
    return bn(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = wi(t, this._root, s);
    s(t, n) < 0 ? r = rn(n, i, r, s) : o = rn(n, i, o, s), this._root = qr(o, r, s);
  }
  split(t) {
    return wi(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function vn(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], a = t[o], l = new kt(r, a);
    return l.left = vn(e, t, n, o), l.right = vn(e, t, o + 1, i), l;
  }
  return null;
}
function Vr(e, t) {
  const n = new kt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new kt(e[s], t[s]);
  return i.next = null, n.next;
}
function Wr(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new kt(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function $n(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = $n(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = $n(e, s + 1, n), r;
  }
  return null;
}
function Kr(e, t, n) {
  const i = new kt(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function wn(e, t, n, i, s) {
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
  wn(e, t, n, a, s), wn(e, t, a + 1, i, s);
}
const ht = 11102230246251565e-32, W = 134217729, Gr = (3 + 8 * ht) * ht;
function an(e, t, n, i, s) {
  let o, r, a, l, d = t[0], f = i[0], c = 0, u = 0;
  f > d == f > -d ? (o = d, d = t[++c]) : (o = f, f = i[++u]);
  let h = 0;
  if (c < e && u < n)
    for (f > d == f > -d ? (r = d + o, a = o - (r - d), d = t[++c]) : (r = f + o, a = o - (r - f), f = i[++u]), o = r, a !== 0 && (s[h++] = a); c < e && u < n; )
      f > d == f > -d ? (r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c]) : (r = o + f, l = r - o, a = o - (r - l) + (f - l), f = i[++u]), o = r, a !== 0 && (s[h++] = a);
  for (; c < e; )
    r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c], o = r, a !== 0 && (s[h++] = a);
  for (; u < n; )
    r = o + f, l = r - o, a = o - (r - l) + (f - l), f = i[++u], o = r, a !== 0 && (s[h++] = a);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function Yr(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function x(e) {
  return new Float64Array(e);
}
const Qr = (3 + 16 * ht) * ht, Xr = (2 + 12 * ht) * ht, Jr = (9 + 64 * ht) * ht * ht, Dt = x(4), xi = x(8), ki = x(12), _i = x(16), K = x(4);
function ta(e, t, n, i, s, o, r) {
  let a, l, d, f, c, u, h, g, y, v, m, w, _, S, k, I, C, N;
  const R = e - s, H = n - s, q = t - o, X = i - o;
  S = R * X, u = W * R, h = u - (u - R), g = R - h, u = W * X, y = u - (u - X), v = X - y, k = g * v - (S - h * y - g * y - h * v), I = q * H, u = W * q, h = u - (u - q), g = q - h, u = W * H, y = u - (u - H), v = H - y, C = g * v - (I - h * y - g * y - h * v), m = k - C, c = k - m, Dt[0] = k - (m + c) + (c - C), w = S + m, c = w - S, _ = S - (w - c) + (m - c), m = _ - I, c = _ - m, Dt[1] = _ - (m + c) + (c - I), N = w + m, c = N - w, Dt[2] = w - (N - c) + (m - c), Dt[3] = N;
  let dt = Yr(4, Dt), Jt = Xr * r;
  if (dt >= Jt || -dt >= Jt || (c = e - R, a = e - (R + c) + (c - s), c = n - H, d = n - (H + c) + (c - s), c = t - q, l = t - (q + c) + (c - o), c = i - X, f = i - (X + c) + (c - o), a === 0 && l === 0 && d === 0 && f === 0) || (Jt = Jr * r + Gr * Math.abs(dt), dt += R * f + X * a - (q * d + H * l), dt >= Jt || -dt >= Jt)) return dt;
  S = a * X, u = W * a, h = u - (u - a), g = a - h, u = W * X, y = u - (u - X), v = X - y, k = g * v - (S - h * y - g * y - h * v), I = l * H, u = W * l, h = u - (u - l), g = l - h, u = W * H, y = u - (u - H), v = H - y, C = g * v - (I - h * y - g * y - h * v), m = k - C, c = k - m, K[0] = k - (m + c) + (c - C), w = S + m, c = w - S, _ = S - (w - c) + (m - c), m = _ - I, c = _ - m, K[1] = _ - (m + c) + (c - I), N = w + m, c = N - w, K[2] = w - (N - c) + (m - c), K[3] = N;
  const nr = an(4, Dt, 4, K, xi);
  S = R * f, u = W * R, h = u - (u - R), g = R - h, u = W * f, y = u - (u - f), v = f - y, k = g * v - (S - h * y - g * y - h * v), I = q * d, u = W * q, h = u - (u - q), g = q - h, u = W * d, y = u - (u - d), v = d - y, C = g * v - (I - h * y - g * y - h * v), m = k - C, c = k - m, K[0] = k - (m + c) + (c - C), w = S + m, c = w - S, _ = S - (w - c) + (m - c), m = _ - I, c = _ - m, K[1] = _ - (m + c) + (c - I), N = w + m, c = N - w, K[2] = w - (N - c) + (m - c), K[3] = N;
  const ir = an(nr, xi, 4, K, ki);
  S = a * f, u = W * a, h = u - (u - a), g = a - h, u = W * f, y = u - (u - f), v = f - y, k = g * v - (S - h * y - g * y - h * v), I = l * d, u = W * l, h = u - (u - l), g = l - h, u = W * d, y = u - (u - d), v = d - y, C = g * v - (I - h * y - g * y - h * v), m = k - C, c = k - m, K[0] = k - (m + c) + (c - C), w = S + m, c = w - S, _ = S - (w - c) + (m - c), m = _ - I, c = _ - m, K[1] = _ - (m + c) + (c - I), N = w + m, c = N - w, K[2] = w - (N - c) + (m - c), K[3] = N;
  const sr = an(ir, ki, 4, K, _i);
  return _i[sr - 1];
}
function ea(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, d = Math.abs(r + a);
  return Math.abs(l) >= Qr * d ? l : -ta(e, t, n, i, s, o, d);
}
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(8);
x(8);
x(8);
x(4);
x(8);
x(8);
x(16);
x(12);
x(192);
x(192);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(8);
x(8);
x(8);
x(8);
x(8);
x(8);
x(8);
x(8);
x(8);
x(4);
x(4);
x(4);
x(8);
x(16);
x(16);
x(16);
x(32);
x(32);
x(48);
x(64);
x(1152);
x(1152);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(4);
x(24);
x(24);
x(24);
x(24);
x(24);
x(24);
x(24);
x(24);
x(24);
x(24);
x(1152);
x(1152);
x(1152);
x(1152);
x(1152);
x(2304);
x(2304);
x(3456);
x(5760);
x(8);
x(8);
x(8);
x(16);
x(24);
x(48);
x(48);
x(96);
x(192);
x(384);
x(384);
x(384);
x(768);
x(96);
x(96);
x(96);
x(1152);
const ee = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, xn = (e, t) => {
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
let vt = Number.EPSILON;
vt === void 0 && (vt = Math.pow(2, -52));
const na = vt * vt, Si = (e, t) => {
  if (-vt < e && e < vt && -vt < t && t < vt)
    return 0;
  const n = e - t;
  return n * n < na * e * t ? 0 : e < t ? -1 : 1;
};
class ia {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Ei(), this.yRounder = new Ei();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class Ei {
  constructor() {
    this.tree = new Zn(), this.round(0);
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
    if (i !== null && Si(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && Si(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const ge = new ia(), Me = (e, t) => e.x * t.y - e.y * t.x, zs = (e, t) => e.x * t.x + e.y * t.y, Mi = (e, t, n) => {
  const i = ea(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Pe = (e) => Math.sqrt(zs(e, e)), sa = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return Me(s, i) / Pe(s) / Pe(i);
}, oa = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return zs(s, i) / Pe(s) / Pe(i);
}, Ai = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, Ii = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, ra = (e, t, n, i) => {
  if (t.x === 0) return Ii(n, i, e.x);
  if (i.x === 0) return Ii(e, t, n.x);
  if (t.y === 0) return Ai(n, i, e.y);
  if (i.y === 0) return Ai(e, t, n.y);
  const s = Me(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = Me(o, t) / s, a = Me(o, i) / s, l = e.x + a * t.x, d = n.x + r * i.x, f = e.y + a * t.y, c = n.y + r * i.y, u = (l + d) / 2, h = (f + c) / 2;
  return {
    x: u,
    y: h
  };
};
class it {
  // for ordering sweep events in the sweep event queue
  static compare(t, n) {
    const i = it.comparePoints(t.point, n.point);
    return i !== 0 ? i : (t.point !== n.point && t.link(n), t.isLeft !== n.isLeft ? t.isLeft ? 1 : -1 : wt.compare(t.segment, n.segment));
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
        sine: sa(this.point, t.point, o.point),
        cosine: oa(this.point, t.point, o.point)
      });
    };
    return (s, o) => {
      n.has(s) || i(s), n.has(o) || i(o);
      const {
        sine: r,
        cosine: a
      } = n.get(s), {
        sine: l,
        cosine: d
      } = n.get(o);
      return r >= 0 && l >= 0 ? a < d ? 1 : a > d ? -1 : 0 : r < 0 && l < 0 ? a < d ? -1 : a > d ? 1 : 0 : l < r ? -1 : l > r ? 1 : 0;
    };
  }
}
let aa = 0;
class wt {
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
    const a = t.leftSE.point.y, l = n.leftSE.point.y, d = t.rightSE.point.y, f = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < d) return 1;
      if (l > a && l > d) return -1;
      const c = t.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const u = n.comparePoint(t.rightSE.point);
      return u !== 0 ? u : -1;
    }
    if (i > s) {
      if (a < l && a < f) return -1;
      if (a > l && a > f) return 1;
      const c = n.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const u = t.comparePoint(n.rightSE.point);
      return u < 0 ? 1 : u > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
    if (o < r) {
      const c = n.comparePoint(t.rightSE.point);
      if (c !== 0) return c;
    }
    if (o > r) {
      const c = t.comparePoint(n.rightSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
    }
    if (o !== r) {
      const c = d - a, u = o - i, h = f - l, g = r - s;
      if (c > u && h < g) return 1;
      if (c < u && h > g) return -1;
    }
    return o > r ? 1 : o < r || d < f ? -1 : d > f ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++aa, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = it.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new it(s, !0), d = new it(o, !1);
    return new wt(l, d, [i], [r]);
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
    const n = this.bbox(), i = t.bbox(), s = xn(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, d = ee(n, a) && this.comparePoint(a) === 0, f = ee(i, o) && t.comparePoint(o) === 0, c = ee(n, l) && this.comparePoint(l) === 0, u = ee(i, r) && t.comparePoint(r) === 0;
    if (f && d)
      return u && !c ? r : !u && c ? l : null;
    if (f)
      return c && o.x === l.x && o.y === l.y ? null : o;
    if (d)
      return u && r.x === a.x && r.y === a.y ? null : a;
    if (u && c) return null;
    if (u) return r;
    if (c) return l;
    const h = ra(o, this.vector(), a, t.vector());
    return h === null || !ee(s, h) ? null : ge.round(h.x, h.y);
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
    const n = [], i = t.events !== void 0, s = new it(t, !0), o = new it(t, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new wt(s, r, this.rings.slice(), this.windings.slice());
    return it.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), it.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = wt.compare(n, i);
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
        const a = i.rings[o], l = i.windings[o], d = n.rings.indexOf(a);
        d === -1 ? (n.rings.push(a), n.windings.push(l)) : n.windings[d] += l;
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
      const d = this.rings[a], f = this.windings[a], c = n.indexOf(d);
      c === -1 ? (n.push(d), i.push(f)) : i[c] += f;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const d = n[a], f = d.poly;
      if (r.indexOf(f) === -1)
        if (d.isExterior) o.push(f);
        else {
          r.indexOf(f) === -1 && r.push(f);
          const c = o.indexOf(d.poly);
          c !== -1 && o.splice(c, 1);
        }
    }
    for (let a = 0, l = o.length; a < l; a++) {
      const d = o[a].multiPoly;
      s.indexOf(d) === -1 && s.push(d);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (ot.type) {
      case "union": {
        const i = t.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < n.length ? (i = t.length, s = n.length) : (i = n.length, s = t.length), this._isInResult = s === ot.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${ot.type}`);
    }
    return this._isInResult;
  }
}
class Pi {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = ge.round(t[0][0], t[0][1]);
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
      let l = ge.round(t[r][0], t[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(wt.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(wt.fromRing(o, s, this));
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
class la {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Pi(t[0], this, !0), this.bbox = {
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
      const o = new Pi(t[i], this, !1);
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
class Oi {
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
      const o = new la(t[i], this);
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
class Oe {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, a = o.leftSE, l = o.rightSE;
      const d = [a], f = a.point, c = [];
      for (; r = a, a = l, d.push(a), a.point !== f; )
        for (; ; ) {
          const u = a.getAvailableLinkedEvents();
          if (u.length === 0) {
            const y = d[0].point, v = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (u.length === 1) {
            l = u[0].otherSE;
            break;
          }
          let h = null;
          for (let y = 0, v = c.length; y < v; y++)
            if (c[y].point === a.point) {
              h = y;
              break;
            }
          if (h !== null) {
            const y = c.splice(h)[0], v = d.splice(y.index);
            v.unshift(v[0].otherSE), n.push(new Oe(v.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: a.point
          });
          const g = a.getLeftmostComparator(r);
          l = u.sort(g)[0].otherSE;
          break;
        }
      n.push(new Oe(d));
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
    for (let d = 1, f = this.events.length - 1; d < f; d++) {
      const c = this.events[d].point, u = this.events[d + 1].point;
      Mi(c, t, u) !== 0 && (n.push(c), t = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Mi(i, t, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, a = this.isExteriorRing() ? n.length : -1, l = [];
    for (let d = r; d != a; d += o) l.push([n[d].x, n[d].y]);
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
      it.compare(t, r) > 0 && (t = r);
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
class zi {
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
class ca {
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
        if (o.isExteriorRing()) n.push(new zi(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new zi(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class da {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : wt.compare;
    this.queue = t, this.tree = new Zn(n), this.segments = [];
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
      let d = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (d = c), !a.isAnEndpoint(c))) {
          const u = this._splitSafely(a, c);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      let f = null;
      if (l) {
        const c = l.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (f = c), !l.isAnEndpoint(c))) {
          const u = this._splitSafely(l, c);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      if (d !== null || f !== null) {
        let c = null;
        d === null ? c = f : f === null ? c = d : c = it.comparePoints(d, f) <= 0 ? d : f, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const u = n.split(c);
        for (let h = 0, g = u.length; h < g; h++)
          i.push(u[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const d = a.getIntersection(l);
        if (d !== null) {
          if (!a.isAnEndpoint(d)) {
            const f = this._splitSafely(a, d);
            for (let c = 0, u = f.length; c < u; c++)
              i.push(f[c]);
          }
          if (!l.isAnEndpoint(d)) {
            const f = this._splitSafely(l, d);
            for (let c = 0, u = f.length; c < u; c++)
              i.push(f[c]);
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
const Ci = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, ua = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class ha {
  run(t, n, i) {
    ot.type = t, ge.reset();
    const s = [new Oi(n, !0)];
    for (let c = 0, u = i.length; c < u; c++)
      s.push(new Oi(i[c], !1));
    if (ot.numMultiPolys = s.length, ot.type === "difference") {
      const c = s[0];
      let u = 1;
      for (; u < s.length; )
        xn(s[u].bbox, c.bbox) !== null ? u++ : s.splice(u, 1);
    }
    if (ot.type === "intersection")
      for (let c = 0, u = s.length; c < u; c++) {
        const h = s[c];
        for (let g = c + 1, y = s.length; g < y; g++)
          if (xn(h.bbox, s[g].bbox) === null) return [];
      }
    const o = new Zn(it.compare);
    for (let c = 0, u = s.length; c < u; c++) {
      const h = s[c].getSweepEvents();
      for (let g = 0, y = h.length; g < y; g++)
        if (o.insert(h[g]), o.size > Ci)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new da(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const c = l.key;
      if (o.size === a) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > Ci)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > ua)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const u = r.process(c);
      for (let h = 0, g = u.length; h < g; h++) {
        const y = u[h];
        y.consumedBy === void 0 && o.insert(y);
      }
      a = o.size, l = o.pop();
    }
    ge.reset();
    const d = Oe.factory(r.segments);
    return new ca(d).getGeom();
  }
}
const ot = new ha(), fa = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ot.run("union", e, n);
}, pa = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ot.run("intersection", e, n);
}, ga = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ot.run("xor", e, n);
}, ma = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return ot.run("difference", e, n);
};
var Cs = {
  union: fa,
  intersection: pa,
  xor: ga,
  difference: ma
};
const Ns = 3, ya = 1e-6;
function He(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function Z(e, t) {
  const n = He(e, t);
  return { x: n.x, y: n.y };
}
function Gt(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : z(i, s);
}
function Ls(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Fe(A(t, e)), len: z(e, t), leftOff: o, rightOff: r };
}
function et(e, t) {
  return Ls(Z(e, t.a), Z(e, t.b), t.thickness, t.baseline);
}
function Lt(e, t) {
  const n = A(t, e.a);
  return { t: F(n, e.dir), side: F(n, tt(e.dir)) };
}
function Ni(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: M(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Bt = (e) => P(e.p, M(tt(e.u), e.offL)), Ft = (e) => A(e.p, M(tt(e.u), e.offR));
function At(e, t, n) {
  return e !== null && z(e, t) <= n;
}
function ba(e) {
  const t = [];
  for (const n of e.walls) {
    const i = et(e, n);
    if (i.len < 1e-9) continue;
    const s = tt(i.dir);
    t.push({
      wall: n,
      f: i,
      c: {
        al: P(i.a, M(s, i.leftOff)),
        ar: A(i.a, M(s, i.rightOff)),
        bl: P(i.b, M(s, i.leftOff)),
        br: A(i.b, M(s, i.rightOff))
      }
    });
  }
  return t;
}
function va(e, t) {
  const n = t.f, i = tt(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = F(A(s.far, n.a), i) >= 0 ? P(n.a, M(i, n.leftOff)) : A(n.a, M(i, n.rightOff)), a = Ns * Math.max(s.body.wall.thickness, t.wall.thickness), l = ut(Bt(s), s.u, r, n.dir), d = ut(Ft(s), s.u, r, n.dir);
    At(l, s.p, a) && (s.body.c[s.leftKey] = l), At(d, s.p, a) && (s.body.c[s.rightKey] = d);
  }
}
function $a(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Ns * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = ut(Ft(o), o.u, Bt(r), r.u);
    At(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = wa(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = A(r, o), l = J(a, A(t, o)), d = J(a, A(s.far, o));
    l * d < 0 && kn(s, [t]);
  }
}
function kn(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function wa(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(J(o.u, r.u)) > 1e-9 || F(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], d = ut(Ft(o), o.u, Bt(l), l.u), f = ut(Bt(r), r.u, Bt(l), l.u);
        if (!At(d, t, n) || !At(f, t, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = f, kn(o, [t, c, f]);
      } else {
        const l = e[(s - 1 + i) % i], d = ut(Bt(r), r.u, Ft(l), l.u), f = ut(Ft(o), o.u, Ft(l), l.u);
        if (!At(f, t, n) || !At(d, t, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = f, r.body.c[r.leftKey] = d, kn(r, [f, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Ts(e) {
  const t = ba(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(Ni(r, "a")), r.wall.b === i.id && s.push(Ni(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? va(s, o) : s.length >= 2 && $a(s, { x: i.x, y: i.y });
  }
  return t;
}
function Ds(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function je(e) {
  return new Map(Ts(e).map((t) => [t.wall.id, Ds(t)]));
}
function Li(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(P(s, M(A(o, s), r / (r - a))));
  }
  return n;
}
function qn(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ts(e)) {
    const s = Ds(i), o = e.openings.filter((f) => f.wallId === i.wall.id && !f.invalid && t(f)).sort((f, c) => f.offset - c.offset), r = (f) => F(A(f, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const f of o)
      a.push([l, f.offset]), l = Math.max(l, f.offset + f.width);
    a.push([l, 1 / 0]);
    const d = [];
    for (const [f, c] of a) {
      if (c <= f) continue;
      let u = s;
      f > -1 / 0 && (u = Li(u, (h) => r(h) - f)), c < 1 / 0 && (u = Li(u, (h) => c - r(h))), u.length >= 3 && Math.abs(ft(u)) > ya && d.push(u);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const _n = (e) => [e.map((t) => [t.x, t.y])];
function Rs(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function Bs(e, t) {
  return Fs(t ? [...qn(e).values()].flat() : [...je(e).values()]);
}
function Fs(e) {
  const t = e.map(_n);
  if (t.length === 0) return [];
  let n;
  try {
    n = Cs.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Rs));
}
function Us(e) {
  const t = [];
  for (const n of Bs(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function Sn(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!Kt(t, s)) continue;
    const o = Math.abs(ft(s));
    o < i && (n = s, i = o);
  }
  return n;
}
function Hs(e) {
  return Math.round(Math.abs(ft(e)) / 1e6 * 100) / 100;
}
const ln = 1e-3;
function js(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(ft(e)) - Math.abs(ft(t))) > ln ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= ln && Math.abs(n.y - i.y) <= ln));
}
function xa(e, t, n) {
  const i = Us(e), s = Sn(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const a = r.broken ? null : Sn(i, r.seed);
    if (a && js(a, s)) return { level: e, zoneId: null };
  }
  const o = { id: Y(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function ka(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function Zs(e, t) {
  const n = e.zones.find((r) => r.id === t);
  if (!n) return e;
  const i = { ...e, zones: e.zones.filter((r) => r !== n) }, s = U(e), o = (r) => r.shape.kind === "room" && r.shape.roomId === t;
  if (s.some(o)) {
    const r = n.outline.map((a) => ({ kind: "free", x: a.x, y: a.y, lost: !0 }));
    i.automationZones = s.map((a) => o(a) ? { ...a, shape: { kind: "polygon", vertices: r }, invalid: !0 } : a);
  }
  return i;
}
function Yt(e) {
  if (e.zones.length === 0) return e;
  const t = Us(e), n = [], i = e.zones.map((s) => {
    const o = Sn(t, s.seed);
    return !o || n.some((r) => js(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const Zt = 1e-6, ze = ["door", "gate", "wicket"], qs = (e) => e === "opening", Vs = (e) => e.passesLight ?? qs(e.kind), Ws = (e) => e === "opening", Ks = (e) => e.passesPir ?? Ws(e.kind);
function Gs(e, t) {
  return e.offset < t.offset + t.width - Zt && t.offset < e.offset + e.width - Zt;
}
function Ze(e, t, n, i, s) {
  const o = Gt(e, t);
  return o === null || i <= 0 || n < -Zt || n + i > o + Zt ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Gs(r, { offset: n, width: i }));
}
function Qt(e, t) {
  return { ...e, openings: t };
}
function _a(e, t, n, i, s, o = {}) {
  const r = s ?? Ee[n], a = i - r / 2;
  if (!Ze(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: Y(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return ze.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: Yt(Qt(e, [...e.openings, l])), openingId: l.id };
}
function Ys(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Ze(e, i.wallId, n, i.width, t) ? e : Yt($e(Qt(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function Sa(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Ze(e, i.wallId, i.offset, n, t) ? e : Yt($e(Qt(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function Ea(e, t) {
  return ze.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function Ma(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Yt($e(Qt(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function Qs(e, t) {
  return Yt($e(Qt(e, e.openings.filter((n) => n.id !== t))));
}
function $e(e) {
  return Qt(e, e.openings.map((t) => {
    const n = Gt(e, t.wallId), i = n === null || t.offset < -Zt || t.offset + t.width > n + Zt || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Gs(t, s));
    return { ...t, invalid: i };
  }));
}
const Ce = 1e-6;
function Xs(e, t) {
  return Hn[e.kind].includes(t.mode);
}
function Js(e, t, n) {
  if (!Xs(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -jt || i > jt)) return !1;
  const s = Gt(e, n.wallId);
  return s !== null && n.offset >= -Ce && n.offset <= s + Ce;
}
function Xt(e, t) {
  return { ...e, devices: t };
}
function Ti(e, t, n, i) {
  if (!Js(e, t, n)) return { level: e, deviceId: null };
  const s = { id: Y(), name: i, placement: n, props: t, invalid: !1 };
  return { level: Xt(e, [...e.devices, s]), deviceId: s.id };
}
function to(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = Ct("motion_sensor", t), s = Ct("motion_sensor", n);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function Vn(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !Js(e, s.props, n)) return e;
  const o = to(s.props, s.placement.mode, n.mode);
  return no(Xt(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function qe(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? Xt(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Fn({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function Aa(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !Wt(i.props.kind) || i.props.kind === n) return e;
  const s = Ct(n, i.placement.mode);
  if (!Xs(s, i.placement)) return e;
  const o = Fn({ ...i, props: s });
  return Xt(e, e.devices.map((r) => r === i ? o : r));
}
function eo(e, t) {
  return Xt(e, e.devices.filter((n) => n.id !== t));
}
function no(e) {
  return Xt(e, e.devices.map((t) => {
    if (t.placement.mode !== "wall") return t.invalid ? { ...t, invalid: !1 } : t;
    const n = Gt(e, t.placement.wallId), i = n === null || t.placement.offset < -Ce || t.placement.offset > n + Ce;
    return t.invalid === i ? t : { ...t, invalid: i };
  }));
}
const io = 2, Di = Math.ceil(360 / io), Ri = 1e-4, Ia = 1e-9, Bi = 1e-9, Pa = {
  light: Vs,
  motion: Ks
};
function so(e, t) {
  const n = [];
  for (const i of Fs([...qn(e, Pa[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Wn(e, t, n) {
  return t.filter(([i, s]) => Ue(e, i, s) <= n);
}
function cn(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function Oa(e, t, n) {
  const i = Wn(e, t, n), s = [];
  for (let v = 0; v < Di; v++) s.push(-Math.PI + 2 * Math.PI * v / Di);
  const o = n * 1.05;
  for (const v of i)
    for (const m of v) {
      if (z(e, m) > o) continue;
      const w = Math.atan2(m.y - e.y, m.x - e.x);
      s.push(cn(w - Ri), cn(w), cn(w + Ri));
    }
  s.sort((v, m) => v - m);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), d = new Float64Array(r), f = new Float64Array(r);
  i.forEach(([v, m], w) => {
    a[w] = v.x - e.x, l[w] = v.y - e.y, d[w] = m.x - v.x, f[w] = m.y - v.y;
  });
  const c = [], u = [];
  let h = NaN;
  for (const v of s) {
    if (v === h) continue;
    h = v;
    const m = Math.cos(v), w = Math.sin(v);
    let _ = n, S = -1;
    for (let C = 0; C < r; C++) {
      const N = m * f[C] - w * d[C];
      if (Math.abs(N) < 1e-12) continue;
      const R = (a[C] * f[C] - l[C] * d[C]) / N;
      if (!(R > Ia && R < _)) continue;
      const H = (a[C] * w - l[C] * m) / N;
      H < -Bi || H > 1 + Bi || (_ = R, S = C);
    }
    const k = { x: e.x + m * _, y: e.y + w * _ }, I = c.length;
    if (!(I > 0 && c[I - 1].x === k.x && c[I - 1].y === k.y)) {
      if (S >= 0 && I >= 2 && u[I - 1] === S && u[I - 2] === S) {
        c[I - 1] = k;
        continue;
      }
      c.push(k), u.push(S);
    }
  }
  const g = c[0], y = c[c.length - 1];
  return c.length > 1 && g.x === y.x && g.y === y.y && c.pop(), c;
}
const za = 32, Fi = 128;
function Ne(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function xt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function oo(e) {
  return (e % 360 + 360) % 360;
}
function ro(e) {
  return (e % 360 + 540) % 360 - 180;
}
function ao(e, t, n, i) {
  const s = e.walls.find((d) => d.id === t);
  if (!s) return null;
  let o;
  try {
    o = et(e, s);
  } catch {
    return null;
  }
  const r = tt(o.dir), a = n === "left" ? r : M(r, -1), l = n === "left" ? o.leftOff : o.rightOff;
  return { pt: P(P(o.a, M(o.dir, i)), M(a, l)), normal: a };
}
function lo(e, t, n, i) {
  var s;
  return ((s = ao(e, t, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Q(e, t) {
  const n = t.placement;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Ne(n.rotation) };
  const i = ao(e, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal;
  return { pt: i.pt, dir: n.aim ? Ne(xt(s) + n.aim) : s, normal: s };
}
function co(e, t) {
  const n = [];
  for (let i = 0; i < Fi; i++) n.push(P(e, M(Ne(360 * i / Fi), t)));
  return n;
}
function Ui(e, t, n, i) {
  if (n >= 360) return co(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * za)), o = xt(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(P(e, M(Ne(o + n * a / s), i)));
  return r;
}
const Ca = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Ve(e) {
  return Ca[e] ?? null;
}
const Na = (e) => Ve(e.kind) !== null;
function La(e, t) {
  const n = t.props;
  if (!Na(n)) return null;
  const i = Q(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Ui(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Ui(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? co(i.pt, n.poolRadius) : null;
  }
}
function Ta(e) {
  return e.normal ? P(e.pt, e.normal) : e.pt;
}
function Hi(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Da(e, t, n) {
  const i = A(t, e);
  for (const [s, o] of n) {
    const r = A(o, s), a = A(s, e), l = J(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const d = J(a, r) / l, f = J(a, i) / l;
    if (d >= 0 && d <= 1 && f >= 0 && f <= 1) return !0;
  }
  return !1;
}
const ji = 0.5, Ra = 3, Ba = 1e-4;
function Fa(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  const s = Ta(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => Hi(k, n) || Wn(k, n, ji).length > 0;
  if (!r(s)) return s;
  const a = et(e, e.walls.find((k) => k.id === o.wallId)), l = i.normal, d = (k) => Math.abs(F(A(k, i.pt), l)) <= Ba, f = ([k, I]) => M(P(k, I), 0.5), c = n.filter((k) => d(k[0]) && d(k[1]) && z(k[0], k[1]) > 1e-9 && !Hi(P(f(k), M(l, ji)), n)), u = (k) => F(A(k, a.a), a.dir), h = ([k, I]) => Math.max(0, Math.min(u(k), u(I)) - o.offset, o.offset - Math.max(u(k), u(I))), g = Math.min(...c.map(h)), y = c.filter((k) => h(k) <= g + 1e-6).map((k) => P(f(k), l)), v = (k) => y.some((I) => !Da(k, I, n)), m = Ra * Math.max(...e.walls.map((k) => k.thickness)) + 2, w = [];
  for (const [k, I] of n) {
    const C = A(I, k), N = A(k, s), R = J(a.dir, C);
    if (Math.abs(R) < 1e-12) continue;
    const H = J(N, a.dir) / R;
    if (H < -1e-9 || H > 1 + 1e-9) continue;
    const q = J(N, C) / R, X = z(k, I) / Math.abs(R);
    w.push(q - X, q + X);
  }
  const _ = o.offset <= a.len / 2 ? 1 : -1, S = w.filter((k) => Math.abs(k) <= m).sort((k, I) => Math.abs(k) - Math.abs(I) || Math.sign(I) * _ - Math.sign(k) * _);
  for (const k of S) {
    const I = P(s, M(a.dir, k));
    if (!r(I) && v(I)) return I;
  }
  return null;
}
const Ua = 1 / Math.cos(io / 2 * (Math.PI / 180)), Zi = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function Ha(e, t, n = so) {
  const i = La(e, t), s = Ve(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = Fa(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((c) => z(c, r))) * Ua, l = Wn(r, o, a);
  if (l.length === 0) return [i];
  const d = Oa(r, l, a);
  let f;
  try {
    f = Cs.intersection(_n(Zi(i)), _n(Zi(d)));
  } catch {
    return [d];
  }
  return f.flatMap((c) => c.map(Rs));
}
function ja(e, t, n, i) {
  const s = Q(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, F(A(n, s.pt), s.dir)));
    return z(P(s.pt, M(s.dir, a)), n) <= i;
  }
  if (o.kind !== "equipment") return z(s.pt, n) <= i;
  if (o.shape === "circle") return z(s.pt, n) <= o.diameter / 2 + i;
  const r = A(n, s.pt);
  return Math.abs(F(r, s.dir)) <= o.width / 2 + i && Math.abs(F(r, tt(s.dir))) <= o.depth / 2 + i;
}
function uo(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && ja(e, i[o], t, n)) return i[o].id;
  return null;
}
const Za = 60;
function En(e, t, n) {
  if (!Is.has(t.props.kind)) return null;
  const i = Q(e, t);
  return i ? { from: i.pt, to: P(i.pt, M(i.dir, Za / n)) } : null;
}
function ho(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function qa(e, t, n, i) {
  const s = t.placement, o = Q(e, t);
  if (!o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = xt(A(n, o.pt)), a = (f) => i ? Math.round(f / 15) * 15 : Math.round(f);
  if (s.mode === "free") return { ...s, rotation: oo(a(r)) };
  const l = ro(r - xt(o.normal)), d = Math.max(-jt, Math.min(jt, a(l)));
  return ho(s, d);
}
const Va = 1, qi = 1, Vi = 1e-6, Wa = 1e-9, Ka = 1e-6, Ga = 1;
function Kn(e, t) {
  switch (t.kind) {
    case "free":
      return { x: t.x, y: t.y };
    case "node": {
      const n = e.nodes.find((i) => i.id === t.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = Gt(e, t.wallId);
      return n === null ? null : lo(e, t.wallId, t.side, Math.max(0, Math.min(n, t.offset)));
    }
  }
}
function St(e, t) {
  var i;
  const n = t.shape;
  return n.kind === "room" ? ((i = e.zones.find((s) => s.id === n.roomId)) == null ? void 0 : i.outline) ?? [] : n.vertices.map((s) => Kn(e, s) ?? { x: s.x, y: s.y });
}
function re(e, t, n) {
  const i = J(A(t, e), A(n, e));
  return Math.abs(i) <= Wa * z(e, t) * z(e, n) ? 0 : Math.sign(i);
}
const xe = (e, t, n) => F(A(t, e), A(n, e)) <= 0;
function fo(e, t, n, i) {
  const s = re(n, i, e), o = re(n, i, t), r = re(e, t, n), a = re(e, t, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && xe(n, e, t) || a === 0 && xe(i, e, t) || s === 0 && xe(e, n, i) || o === 0 && xe(t, n, i);
}
function Ya(e) {
  const t = [];
  for (const n of e) (t.length === 0 || z(t[t.length - 1], n) > Vi) && t.push(n);
  for (; t.length > 1 && z(t[0], t[t.length - 1]) <= Vi; ) t.pop();
  return t;
}
function Le(e) {
  const t = Ya(e), n = t.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = t[i], o = t[(i + 1) % n], r = t[(i + 2) % n];
    if (re(s, o, r) === 0 && F(A(o, s), A(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && fo(s, o, t[a], t[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function po(e, t) {
  const n = t.shape;
  if (n.kind === "room") {
    const o = e.zones.find((r) => r.id === n.roomId);
    return !o || o.broken ? "room" : null;
  }
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Kn(e, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = Gt(e, o.wallId);
    return r !== null && (o.offset < -qi || o.offset > r + qi);
  };
  if (n.vertices.some(i)) return "wall";
  const s = St(e, t);
  return Math.abs(ft(s)) < Ga || Le(s) ? "self" : null;
}
function We(e, t) {
  return Kt(t, e) || e.some((n, i) => Ue(t, n, e[(i + 1) % e.length]) <= Va);
}
const go = (e, t) => !(e.zoneBlacklist ?? []).includes(t);
function Qa(e, t) {
  const n = Q(e, t);
  return n ? U(e).filter((i) => We(St(e, i), n.pt)).map((i) => ({ zone: i, participates: go(t, i.id) })) : [];
}
function Gn(e, t) {
  const n = U(e).find((o) => o.id === t);
  if (!n) return [];
  const i = St(e, n), s = [];
  for (const o of e.devices) {
    const r = Q(e, o);
    r && We(i, r.pt) && s.push({ device: o, participates: go(o, t) });
  }
  return s;
}
function mo(e) {
  const t = e.length;
  if (t === 0) return { x: 0, y: 0 };
  const n = ft(e);
  if (Math.abs(n) > Ka) {
    let i = 0, s = 0;
    for (let r = 0; r < t; r++) {
      const a = e[r], l = e[(r + 1) % t], d = a.x * l.y - l.x * a.y;
      i += (a.x + l.x) * d, s += (a.y + l.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (Kt(o, e)) return o;
  }
  return {
    x: e.reduce((i, s) => i + s.x, 0) / t,
    y: e.reduce((i, s) => i + s.y, 0) / t
  };
}
const Xa = 3, qt = (e, t) => ({ ...e, automationZones: t }), yo = (e) => ({ kind: "free", x: e.x, y: e.y, lost: !0 });
function Ja(e, t) {
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
function bo(e, t) {
  if (e.id !== t.id || e.name !== t.name || e.invalid !== t.invalid) return !1;
  const n = e.shape, i = t.shape;
  return n.kind === "room" ? i.kind === "room" && n.roomId === i.roomId : i.kind === "polygon" && n.vertices.length === i.vertices.length && n.vertices.every((s, o) => Ja(s, i.vertices[o]));
}
function tl(e, t) {
  if (t.kind === "free") return t;
  const n = Kn(e, t);
  return n ? n.x === t.x && n.y === t.y ? t : { ...t, x: n.x, y: n.y } : yo(t);
}
function Ke(e, t) {
  let n = t;
  const i = t.shape;
  if (i.kind === "polygon") {
    const o = i.vertices.map((r) => tl(e, r));
    o.some((r, a) => r !== i.vertices[a]) && (n = { ...t, shape: { kind: "polygon", vertices: o } });
  }
  const s = po(e, n) !== null;
  return n.invalid === s ? n : { ...n, invalid: s };
}
function el(e) {
  const t = e.automationZones;
  if (!t || t.length === 0) return e;
  const n = t.map((i) => Ke(e, i));
  return n.some((i, s) => i !== t[s]) ? qt(e, n) : e;
}
function nl(e, t) {
  const n = e.automationZones, i = t.automationZones;
  if (!n || !i) return e;
  const s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && bo(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? qt(e, i) : s.some((o, r) => o !== n[r]) ? qt(e, s) : e;
}
function vo(e, t) {
  return { level: qt(e, [...U(e), Ke(e, t)]), zoneId: t.id };
}
function il(e, t, n) {
  if (!e.zones.some((s) => s.id === t)) return { level: e, zoneId: null };
  const i = U(e).find((s) => s.shape.kind === "room" && s.shape.roomId === t);
  return i ? { level: e, zoneId: i.id } : vo(e, { id: Y(), name: n, shape: { kind: "room", roomId: t }, invalid: !1 });
}
const $o = (e) => e.kind === "free" && e.lost ? { kind: "free", x: e.x, y: e.y } : e;
function sl(e, t, n) {
  if (t.length < Xa) return { level: e, zoneId: null };
  const i = Ke(e, { id: Y(), name: n, shape: { kind: "polygon", vertices: t.map($o) }, invalid: !1 });
  return Le(St(e, i)) ? { level: e, zoneId: null } : vo(e, i);
}
function ol(e, t, n) {
  const i = U(e), s = i.find((o) => o.id === t);
  return !s || s.name === n ? e : qt(e, i.map((o) => o === s ? { ...s, name: n } : o));
}
function wo(e, t) {
  if (t.length > 0) return { ...e, zoneBlacklist: t };
  const { zoneBlacklist: n, ...i } = e;
  return i;
}
function xo(e, t) {
  const n = U(e);
  if (!n.some((s) => s.id === t)) return e;
  const i = e.devices.map((s) => {
    var o;
    return (o = s.zoneBlacklist) != null && o.includes(t) ? wo(s, s.zoneBlacklist.filter((r) => r !== t)) : s;
  });
  return {
    ...e,
    automationZones: n.filter((s) => s.id !== t),
    devices: i.some((s, o) => s !== e.devices[o]) ? i : e.devices
  };
}
function rl(e, t, n, i) {
  const s = U(e), o = s.find((l) => l.id === t);
  if (!o || o.shape.kind !== "polygon" || !Number.isInteger(n) || n < 0 || n >= o.shape.vertices.length)
    return e;
  const r = o.shape.vertices.map((l, d) => d === n ? $o(i) : l), a = Ke(e, { ...o, shape: { kind: "polygon", vertices: r } });
  return bo(a, o) ? e : qt(e, s.map((l) => l === o ? a : l));
}
function ko(e, t, n, i) {
  const s = e.devices.find((a) => a.id === t);
  if (!s) return e;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !U(e).some((a) => a.id === n)) return e;
  const r = wo(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...e, devices: e.devices.map((a) => a === s ? r : a) };
}
const me = 1;
function ct(e) {
  return structuredClone(e);
}
function Ge(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function al(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Ye(e, t, n) {
  const i = Z(e, t.a), s = Z(e, t.b), o = z(i, s), r = al(typeof n == "number" ? n : jn(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : jr(i, s, r / o), offset: r };
}
function ll(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Ye(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function _o(e, t) {
  ll(e), t && hl(t, e);
  const n = el(Yt(no($e(e))));
  return t ? nl(n, t) : n;
}
function gt(e, t) {
  return _o(ct(e), t);
}
function So(e, t, n) {
  const i = He(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Ye(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Wi(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: Z(e, t.nodeId), nodeId: t.nodeId };
  const n = Ge(e, t.wallId), { pt: i, offset: s } = Ye(e, n, t.offset), o = z(Z(e, n.a), Z(e, n.b));
  return s <= me ? { pt: Z(e, n.a), nodeId: n.a } : o - s <= me ? { pt: Z(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Ki(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: Y(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function cl(e, t, n, i) {
  const s = Wi(e, t), o = Wi(e, n);
  if (z(s.pt, o.pt) < me) return { level: e, wallId: null, endNodeId: null };
  const r = ct(e), a = Ki(r, s), l = Ki(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const d = { id: Y(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: gt(r, e), wallId: d.id, endNodeId: l };
}
function Eo(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < me || l - a < me ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function dl(e, t, n, i, s) {
  const o = Eo(t, n, i.thickness, s);
  if (!o) return e;
  const r = ct(e), a = o.map((l) => {
    const d = { id: Y(), x: l.x, y: l.y };
    return r.nodes.push(d), d.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: Y(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return gt(r, e);
}
function ul(e, t, n) {
  const i = ct(e);
  return So(i, t, n), _o(i, e);
}
function hl(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...U(t).flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((c) => c.id === s.a), r = e.nodes.find((c) => c.id === s.b), a = t.nodes.find((c) => c.id === i.a), l = t.nodes.find((c) => c.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const d = z(a, l);
    if (d === 0) continue;
    const f = Fe(A(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = jn(P(o, M(f, c.offset)), a, l) * d);
  }
}
function fl(e, t, n) {
  const i = ct(e), s = Ge(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: P(Z(i, a), n) }));
  for (const a of r) So(i, a.id, a.to);
  return gt(i, e);
}
function Qe(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Mo(e, t, n) {
  for (const i of U(e))
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === t && (s.nodeId = n);
}
function pl(e, t, n) {
  const i = ct(e), s = Ge(i, t), o = s[n], r = Z(i, o), a = { id: Y(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || Mo(i, o, a.id), Qe(i), { level: gt(i, e), nodeId: a.id };
}
function gl(e, t, n) {
  if (t === n) return e;
  const i = ct(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Mo(i, t, n), i.nodes = i.nodes.filter((o) => o.id !== t), Qe(i), gt(i, e);
}
function Yn(e, t) {
  var i;
  const n = ct(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Qe(n), gt(n, e);
}
function ml(e, t, n) {
  const i = ct(e);
  return Object.assign(Ge(i, t), n), gt(i, e);
}
const nt = (e) => typeof e == "string" && e !== "" ? e : null, Ao = (e) => e.split(".")[0], yl = ["friendly_name", "device_class", "unit_of_measurement"];
function Io(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: Ao(e),
    name: nt(n.friendly_name) ?? e,
    deviceClass: nt(n.device_class),
    unit: nt(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function bl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Io(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function vl(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && yl.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Po(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function $l(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = Io(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: nt(r.name) ?? nt(r.original_name) ?? a.name,
      deviceId: nt(r.device_id),
      areaId: nt(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: nt(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: nt(r.name_by_user) ?? nt(r.name) ?? r.id, model: nt(r.model), areaId: nt(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function wl(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Oo(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Po(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
class zo extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function dn(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function xl(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function kl(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new zo(s.message) : s;
  }
}
async function _l(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Sl = 3;
function It(e) {
  if (typeof e == "number")
    return e === Sl ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class El {
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
    const i = { ...t, id: Y(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await kl(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof zo ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = It(o)), this.onChange(), null;
    }
  }
}
const Ml = {
  "tool.select": "Select",
  "tool.box": "Box",
  "tool.wall": "Wall",
  "tool.door": "Door",
  "tool.window": "Window",
  "tool.opening": "Opening",
  "tool.zone": "Room",
  "tool.device-select": "Select",
  "tool.ceiling_light": "Ceiling light",
  "tool.wall_light": "Wall light",
  "tool.motion_sensor": "Motion sensor",
  "tool.illuminance_sensor": "Illuminance sensor",
  "tool.wall_switch": "Wall switch",
  "tool.smart_button": "Smart button",
  "tool.socket": "Socket",
  "tool.equipment": "Equipment",
  "tool.climate_sensor": "Climate sensor",
  "tool.exhaust_fan": "Exhaust fan",
  "tool.zones-select": "Select",
  "tool.zone-room": "Zone from room",
  "tool.zone-draw": "Custom zone",
  "mode.plan": "Plan",
  "mode.equipment": "Equipment",
  "mode.binding": "Binding",
  "mode.zones": "Zones",
  "mode.automation": "Automation",
  "steps.label": "Setup steps",
  "steps.app": "Plan Studio",
  "steps.wall": "{n} wall",
  "steps.walls": "{n} walls",
  "steps.room": "{n} room",
  "steps.rooms": "{n} rooms",
  "steps.device": "{n} device",
  "steps.devices": "{n} devices",
  "steps.zone": "{n} zone",
  "steps.zones": "{n} zones",
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
  "role.motion": "Motion",
  "role.illuminance": "Illuminance",
  "role.temperature": "Temperature",
  "role.humidity": "Humidity",
  "role.state": "State",
  "role.power": "Power",
  "role.on": "On",
  "role.off": "Off",
  "role.auto": "Auto",
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
  "zone.default": "Room",
  "zones.default": "Zone",
  "zones.kind.room": "Room",
  "zones.kind.polygon": "Custom",
  "zones.room": "Room",
  "zones.members": "Members",
  "zones.participates": "Participates",
  "zones.noMembers": "No devices inside.",
  "zones.delete": "Delete zone",
  "zones.filter": "Filter zones",
  "zones.hint": "Pick a zone on the plan or in the list, or add one with Zone from room or Custom zone.",
  "zones.invalid.room": "The room is broken: fix its walls.",
  "zones.invalid.lost": "A vertex lost its wall or corner: drag it to place it again.",
  "zones.invalid.wall": "A vertex lies beyond the end of its wall.",
  "zones.invalid.self": "The outline crosses itself: move a vertex.",
  "device.ceiling_light": "Ceiling light",
  "device.wall_light": "Wall light",
  "device.motion_sensor": "Motion sensor",
  "device.illuminance_sensor": "Illuminance sensor",
  "device.wall_switch": "Wall switch",
  "device.smart_button": "Smart button",
  "device.socket": "Socket",
  "device.equipment": "Equipment",
  "device.climate_sensor": "Climate sensor",
  "device.exhaust_fan": "Exhaust fan",
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
  "props.zone": "Room",
  "props.zoneList": "Zones",
  "props.noZones": "Not in any zone.",
  "props.name": "Name",
  "props.area": "Area",
  "props.broken": "The outline is no longer closed: the room is broken. Fix the walls or delete the room.",
  "props.node": "Node",
  "props.newWall": "New wall",
  "props.next.door": "New door",
  "props.next.window": "New window",
  "props.next.opening": "New opening",
  "props.nextZone": "New room",
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
  "status.grid": "Grid 100 mm",
  "status.cones": "Cones & zones",
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
function p(e) {
  return Ml[e] ?? e;
}
var Al = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Il = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", Pl = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", Ol = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", zl = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z";
const rt = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function lt(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const Qn = 12, B = "non-scaling-stroke", Cl = 7, Nl = 10, Ll = "#f43f5e", Tl = "3 2", Dl = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Co = 24;
function Rl(e, t, n) {
  const i = Co / t;
  return customElements.get("ha-icon") ? E`<foreignObject class="equipment-icon" x=${-i / 2} y=${-i / 2} width=${i} height=${i}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${i}px;color:${n};display:block`}></ha-icon></foreignObject>` : E`<g class="equipment-icon" transform=${`translate(${-i / 2} ${-i / 2}) scale(${i / 24})`}>
    <path d=${Dl} fill=${n}></path></g>`;
}
const Bl = "__preview__", Fl = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Ul = /* @__PURE__ */ new WeakMap();
function Hl(e, t) {
  var s;
  const n = lt(Ul, e.walls, () => /* @__PURE__ */ new WeakMap()), i = lt(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = lt(i, e.openings, () => ({})))[t] ?? (s[t] = so(e, t));
}
const jl = /* @__PURE__ */ new WeakMap();
function Zl(e, t) {
  const n = Ve(t.props.kind);
  if (!n) return [];
  const i = Hl(e, n), s = lt(jl, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = Ha(e, t, () => i), s.set(t, o)), o;
}
function ql(e, t, n, i, s) {
  const o = e.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? E`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></rect>` : o.shape === "spot" ? E`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${B}></circle>` : E`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>`;
    case "wall_light":
      return E`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${B}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return E`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const d = l * Math.PI / 4;
        a += `M${Math.cos(d) * t * 1.15} ${Math.sin(d) * t * 1.15}L${Math.cos(d) * t * 1.6} ${Math.sin(d) * t * 1.6}`;
      }
      return E`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    case "wall_switch":
      return E`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? $} vector-effect=${B}></rect>`;
    case "smart_button":
      return E`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? $}
        vector-effect=${B}></rect>
        <circle class="dot" r=${t * 0.18} fill=${n}></circle>`;
    case "socket":
      return E`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return E`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${B}></path>`;
    case "exhaust_fan": {
      let a = "";
      for (let l = 0; l < 4; l++) {
        const d = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(d) * t * 0.85} ${Math.sin(d) * t * 0.85}`;
      }
      return E`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    default:
      return E`${$}`;
  }
}
function Vl(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return E`${$}`;
  const o = Qn / t.scale, r = s.shape === "circle" ? E`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${B}></circle>` : E`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${B}></rect>`;
  return E`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${Rl(s.icon, t.scale, n)}
    <text class="equipment-label" y=${Co / t.scale / 2 + o} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Wl(e, t) {
  return e === "bound" ? $ : E`<circle class=${`bind-ring bind-${e}`} r=${Qn * 1.7 / t} fill="none" style=${`stroke:${Fl[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : $} vector-effect=${B}></circle>`;
}
function Kl(e) {
  return e.action === "toggle" ? ["toggle", zl] : e.action === "auto" ? ["auto", Ol] : e.value === "off" ? ["set-off", Pl] : ["set-on", Il];
}
function Gl(e, t, n, i) {
  const s = t ? Kl(t) : e.status === "error" ? ["alert", Al] : null;
  if (!s) return $;
  const [o, r] = s, a = t ? i.palette.selection : Ll, l = n * 0.9, d = -n * 0.9, f = Nl / i.scale;
  return E`<g class="badge" data-badge=${o}>
    <circle cx=${l} cy=${d} r=${Cl / i.scale} fill=${i.palette.background} stroke=${a} stroke-width="1.5"
      vector-effect=${B}></circle>
    <path d=${r} fill=${a} transform=${`translate(${l - f / 2} ${d - f / 2}) scale(${f / 24})`}></path>
  </g>`;
}
function Yl(e, t, n, i) {
  var y, v, m;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Qn / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((y = n.selection) == null ? void 0 : y.kind) === "device" && n.selection.id === e.id, d = !i && Wt(e.props.kind), f = d ? (v = n.containerState) == null ? void 0 : v.call(n, e) : void 0, c = d && !f, u = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (c ? " no-data" : ""), h = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, g = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : r * 1.6;
  return E`
    <g class=${u} data-id=${e.id} opacity=${h} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? E`<circle class="selection-ring" r=${g + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${B}></circle>` : $}
      ${e.props.kind === "equipment" ? Vl(e, n, o, a) : E`<g transform=${`rotate(${a})`}>${ql(
    e,
    r,
    o,
    s.deviceFill,
    c ? Tl : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? Wl(n.bindingStatus(e), n.scale) : $}
      ${f ? Gl(f, ((m = n.containerFlash) == null ? void 0 : m.call(n, e)) ?? null, r, n) : $}
    </g>`;
}
function Ql(e, t, n, i) {
  const s = Zl(e, t);
  if (s.length === 0) return $;
  const o = n.palette, r = t.invalid ? o.invalid : Ve(t.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, l = s.map(rt).join("");
  return t.props.kind === "ceiling_light" ? E`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${B}></path>` : E`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${B}></path>`;
}
function Xl(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return $;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? En(e, i, t.scale) : null;
  if (!s) return $;
  const o = t.palette.selection;
  return E`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : $}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${B}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${B} style="cursor:grab"></circle>
  </g>`;
}
function Jl(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Bl, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return E`
    <g class="cones">${t.showCones ? n.map((i) => Ql(e, i.d, t, i.preview)) : $}</g>
    <g class="devices">${n.map((i) => Yl(i.d, i.pose, t, i.preview))}</g>
    ${Xl(e, t)}`;
}
const Te = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], ye = "non-scaling-stroke";
function tc(e, t, n, i) {
  const s = i.palette, o = Te[n % Te.length], r = i.selectedId === t.id, a = St(e, t), l = mo(a), d = 12 / i.scale, f = (c) => {
    if (t.shape.kind !== "polygon") return !1;
    const u = t.shape.vertices[c];
    return u.kind === "free" && u.lost === !0;
  };
  return E`
    <g class=${`azone${t.invalid ? " invalid" : ""}${r ? " selected" : ""}`} data-id=${t.id}>
      <path class="azone-fill" d=${rt(a)} fill=${t.invalid ? "url(#azone-hatch)" : o}
        fill-opacity=${t.invalid ? $ : "0.18"} stroke=${o} stroke-width=${r ? "3" : "1.5"}
        vector-effect=${ye}></path>
      <text class="azone-label" x=${l.x} y=${l.y} text-anchor="middle" dominant-baseline="middle" font-size=${d}
        fill=${t.invalid ? s.invalid : o} font-family="system-ui, sans-serif">${t.name}</text>
      ${r && t.shape.kind === "polygon" ? a.map((c, u) => E`
        <circle class=${`azone-vertex${f(u) ? " lost" : ""}`} data-index=${u} cx=${c.x} cy=${c.y}
          r=${5 / i.scale} fill=${s.background} stroke=${f(u) ? s.invalid : o} stroke-width="2"
          vector-effect=${ye}></circle>`) : $}
    </g>`;
}
function ec(e, t, n) {
  const i = n.palette, s = 14 / n.scale;
  return E`<g class="azone-members">${Gn(e, t).map(({ device: o, participates: r }) => {
    const a = Q(e, o);
    return a ? r ? E`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${ye}></circle>` : E`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${ye}></circle>` : $;
  })}</g>`;
}
function nc(e, t) {
  const n = e.cursor ? [...e.points, e.cursor] : e.points;
  return E`<polyline class=${`azone-draft${e.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${e.invalid ? t.palette.invalid : t.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${ye}></polyline>`;
}
function ic(e, t) {
  const n = 8 / t.scale, i = U(e);
  return E`
    <defs>
      <pattern id="azone-hatch" patternUnits="userSpaceOnUse" width=${n} height=${n} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${n} stroke=${t.palette.invalid} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="azones">${i.map((s, o) => tc(e, s, o, t))}</g>
    ${t.selectedId && i.some((s) => s.id === t.selectedId) ? ec(e, t.selectedId, t) : $}
    ${t.draft ? nc(t.draft, t) : $}`;
}
function Ot(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function No(e) {
  return `${e.toFixed(2)} ${p("unit.m2")}`;
}
const sc = /* @__PURE__ */ new WeakMap(), oc = /* @__PURE__ */ new WeakMap(), Lo = /* @__PURE__ */ new WeakMap();
function Xe(e, t, n) {
  const i = tt(e.dir), s = P(e.a, M(e.dir, t)), o = P(e.a, M(e.dir, n));
  return [P(s, M(i, e.leftOff)), P(o, M(i, e.leftOff)), A(o, M(i, e.rightOff)), A(s, M(i, e.rightOff))];
}
function be(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = et(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function rc(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const a = e[r], l = e[(r + 1) % e.length], d = a.x * l.y - l.x * a.y;
    n += d, i += (a.x + l.x) * d, s += (a.y + l.y) * d;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return Kt(o, e) ? o : t;
}
const j = "non-scaling-stroke";
function ac(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = be(e, a.id);
    if (!l) continue;
    const d = tt(l.dir);
    for (const [f, c, u] of [[a.a, l.a, l.dir], [a.b, l.b, M(l.dir, -1)]]) {
      const h = e.nodes.find((k) => k.id === f);
      if (!h || h.host || n.get(f) !== 1) continue;
      const g = P(c, M(d, l.leftOff + i)), y = A(c, M(d, l.rightOff + i)), v = M(d, 1), m = M(P(g, y), 0.5), w = P(A(m, M(v, -o)), M(u, s / 2)), _ = A(A(m, M(v, o)), M(u, s / 2)), S = [g, w, _, y];
      r.push(E`<path class="wall-break" d=${`M${S.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${j}></path>`);
    }
  }
  return r.length ? E`${r}` : $;
}
function lc(e, t, n) {
  const i = t.palette, s = rc(e.outline, e.seed), o = 12 / t.scale;
  return E`
    <path class="zone${e.broken ? " broken" : ""}" d=${rt(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${j}></path>
    ${t.mode === "zones" ? $ : E`<text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${No(Hs(e.outline))}</tspan>
    </text>`}`;
}
function cc(e, t, n) {
  const i = tt(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : M(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = P(P(e.a, M(e.dir, a)), M(o, r)), f = P(P(e.a, M(e.dir, l)), M(o, r)), c = P(d, M(o, t.width)), u = J(A(c, d), A(f, d)) > 0 ? 1 : 0;
  return E`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${j}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${u} ${f.x} ${f.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${j}></path>`;
}
function dc(e, t, n) {
  const i = tt(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = P(P(e.a, M(e.dir, t.offset)), M(i, r)), l = P(P(e.a, M(e.dir, t.offset + t.width)), M(i, r));
    return E`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${j}></line>`;
  });
  return E`${o}`;
}
function uc(e, t, n) {
  const i = be(e, t.wallId);
  if (!i) return $;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = Xe(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return E`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${rt(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? cc(i, t, o) : t.kind === "window" ? dc(i, t, o) : $}
    </g>`;
}
function Gi(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = P(e, M(n, i)), l = P(t, M(n, i)), d = (c, u) => {
    const h = P(u, M(n, i + r));
    return E`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${j}></line>`;
  }, f = P(M(P(a, l), 0.5), M(n, 9 / s.scale));
  return E`
    <g class="dim">
      ${d(P(e, M(n, 2 / s.scale)), e)}${d(P(t, M(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${j}></line>
      <text x=${f.x} y=${f.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Ot(z(e, t))}</text>
    </g>`;
}
function hc(e, t) {
  const n = t.selection;
  if (!n) return $;
  const i = t.palette, s = 4 / t.scale, o = (r) => E`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : $;
  }
  if (n.kind === "wall") {
    const r = lt(Lo, e, je).get(n.id), a = be(e, n.id);
    if (!r || !a) return $;
    const l = tt(a.dir);
    return E`
      <path d=${rt(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${j}></path>
      ${o(a.a)}${o(a.b)}
      ${Gi(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((u) => u.id === n.id), a = r ? be(e, r.wallId) : null;
    if (!r || !a) return $;
    const l = M(tt(a.dir), -1), d = a.rightOff + 18 / t.scale, f = (u) => P(a.a, M(a.dir, u)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return E`
      <path d=${rt(Xe(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${j}></path>
      ${c.filter(([u, h]) => h - u >= 1).map(([u, h]) => Gi(f(u), f(h), l, d, t))}`;
  }
  return $;
}
function fc(e, t, n) {
  return z(e, t) < 1e-6 ? null : Xe(Ls(e, t, n.thickness, n.baseline), 0, z(e, t));
}
function pc(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? be(e, r.wallId) : null;
  return E`
    ${o ? E`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${j}></path>` : $}
    ${(n.walls ?? []).map((l) => {
    const d = fc(l.a, l.b, l.props);
    return E`<g class="preview-wall">
        ${d ? E`<path d=${rt(d)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${j}></line></g>`;
  })}
    ${r && a ? E`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${rt(Xe(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${mc(e, t)}`;
}
function gc(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return E`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${j}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${j}></rect></g>`;
}
function mc(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? gc(n.anchor, t) : $, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / t.scale, { x: a, y: l } = o.pt, d = { stroke: i.background, width: "3" };
  let f, c = $;
  if (o.kind === "node") {
    const h = r(5);
    f = E`<g class="snap-node"><rect x=${a - h} y=${l - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${j}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), g = `M${a} ${l - h}L${a + h * 0.866} ${l + h / 2}L${a - h * 0.866} ${l + h / 2}Z`;
    f = E`<g class="snap-mid"><path d=${g} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${j}></path></g>`;
  } else if (o.kind === "wall") {
    const h = r(5), g = `M${a - h} ${l - h}L${a + h} ${l + h}M${a - h} ${l + h}L${a + h} ${l - h}`;
    f = E`<g class="snap-wall">
      <path d=${g} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${j}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${j}></path></g>`;
    const y = o.endpoint.kind === "wall" ? lt(Lo, e, je).get(o.endpoint.wallId) : void 0;
    y && (c = E`<path class="snap-wall-hl" d=${rt(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${j}></path>`);
  } else {
    const h = r(4), g = `M${a - h} ${l}H${a + h}M${a} ${l - h}V${l + h}`;
    f = E`<g class="snap-grid">
      <path d=${g} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${j}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${j}></path></g>`;
  }
  const u = p(`snapmark.${o.kind}`);
  return E`
    ${c}${s}${f}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${j} font-family="system-ui, sans-serif">${u}</text>`;
}
function yc(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = lt(sc, n, (c) => Bs(c, !0)), o = n.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? lt(oc, n, qn) : null, a = 8 / t.scale, l = t.selection, d = (t.mode ?? "plan") === "plan", f = d ? $ : String(i.dimOpacity);
  return E`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${f}>${n.zones.map((c) => lc(c, t, (l == null ? void 0 : l.kind) === "zone" && l.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(rt).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${f}></path>
    ${r ? E`<g class="railings" opacity=${f}>${o.flatMap((c) => (r.get(c.id) ?? []).map((u) => E`<path d=${rt(u)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${f}>${n.openings.map((c) => uc(n, c, t))}</g>
    <g class="wall-breaks" opacity=${f}>${ac(n, t)}</g>
    ${t.mode === "zones" ? ic(n, {
    palette: i,
    scale: t.scale,
    selectedId: (l == null ? void 0 : l.kind) === "automationZone" ? l.id : null,
    draft: t.preview.zoneDraft
  }) : $}
    <g class="devices-layer">${Jl(n, {
    palette: i,
    scale: t.scale,
    selection: l,
    showCones: t.showCones ?? !0,
    dim: d,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0,
    containerState: t.containerState,
    containerFlash: t.containerFlash
  })}</g>
    <g class="selection">${hc(n, t)}</g>
    <g class="preview">${pc(n, t)}</g>`;
}
const bc = {
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
  device: "#fbbf24",
  deviceFill: "#1e293b",
  cone: "#fbbf24",
  motionCone: "#a78bfa",
  breakLine: "#94a3b8",
  dimOpacity: 0.35,
  panel: "#0f172a",
  border: "#1e293b",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#1d4ed8",
  accentText: "#ffffff",
  input: "#111a2e",
  inputBorder: "#334155"
}, vc = {
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
  device: "#b45309",
  deviceFill: "#fffbeb",
  cone: "#d97706",
  motionCone: "#7c3aed",
  breakLine: "#7c7368",
  dimOpacity: 0.4,
  panel: "#faf7f2",
  border: "#e0d8cc",
  text: "#2b2622",
  muted: "#8a8076",
  accent: "#2563eb",
  accentText: "#ffffff",
  input: "#ffffff",
  inputBorder: "#d6cfc4"
};
function $c(e) {
  return e ? bc : vc;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Xn = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Jn {
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
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const To = (e) => e.strings === void 0, wc = {}, Do = (e, t = wc) => e._$AH = t;
class xc extends Jn {
  constructor(t) {
    if (super(t), t.type !== mt.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? st : (Do(t), n);
  }
}
const V = Xn(xc), Mn = 1, Yi = 1e-6;
function kc(e, t, n, i, s) {
  const o = (l) => l > Yi && l < s - Yi, r = new Set(e.nodes.filter((l) => {
    var d;
    return ((d = l.host) == null ? void 0 : d.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const d = He(e, l).host.offset;
    o(d) && a.push({ t: d, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((y) => y === t.a || y === t.b || r.has(y))) continue;
    const d = Z(e, l.a), f = Z(e, l.b), c = z(d, f), u = c === 0 ? null : ut(n, i, d, A(f, d));
    if (!u) continue;
    const h = jn(u, d, f) * c;
    if (h < -Mn || h > c + Mn) continue;
    const g = F(A(u, n), i);
    o(g) && a.push({ t: g, wall: l, pt: u });
  }
  return a;
}
function Qi(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Xi(e, t) {
  if ("nodeId" in t)
    return delete He(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (z(Z(e, o), t.pt) <= Mn) return o;
  const { pt: n, offset: i } = Ye(e, t.wall, t.pt), s = { id: Y(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function _c(e, t, n) {
  const i = e.walls.find((m) => m.id === t);
  if (!i) return e;
  const s = Z(e, i.a), o = Z(e, i.b), r = z(s, o), a = Fe(A(o, s)), l = F(A(n, s), a), d = kc(e, i, s, a, r), f = Qi(d.filter((m) => m.t < l), l), c = Qi(d.filter((m) => m.t > l), l);
  if (!f && !c) return Yn(e, t);
  const u = ct(e), h = u.walls.find((m) => m.id === t);
  let g = t, y = 0;
  if (c) {
    const m = Xi(u, c);
    if (y = F(A(Z(u, m), s), a), f) {
      const w = { ...h, id: Y(), a: m };
      u.walls.push(w), g = w.id;
    } else
      h.a = m;
  }
  f && (h.b = Xi(u, f));
  const v = (m, w) => m.wallId !== t || f && w <= f.t ? !0 : !c || w < c.t ? !1 : (m.wallId = g, m.offset -= y, !0);
  u.openings = u.openings.filter((m) => v(m, m.offset + m.width / 2)), u.devices = u.devices.filter((m) => m.placement.mode !== "wall" || v(m.placement, m.placement.offset));
  for (const m of u.nodes) m.host && !v(m.host, m.host.offset) && delete m.host;
  for (const m of U(u)) {
    const w = m.shape;
    w.kind === "polygon" && (w.vertices = w.vertices.map((_) => _.kind !== "wall" || v(_, _.offset) ? _ : yo(_)));
  }
  return Qe(u), gt(u, e);
}
function ti(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Sc(e, t, n) {
  return P(e, M(Fe(A(t, e)), n));
}
function Ji(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Nt(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? ti(r, t) : t, d = r !== void 0 && l.y === r.y, f = (m) => !r || Math.abs(d ? m.y - r.y : m.x - r.x) <= 1;
  let c = null;
  for (const m of e.nodes) {
    if (a.has(m.id)) continue;
    const w = { x: m.x, y: m.y }, _ = z(w, l);
    _ <= i && f(w) && (!c || _ < c.d) && (c = { id: m.id, pt: w, d: _ });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const u = e.walls.filter((m) => !a.has(m.a) && !a.has(m.b)).map((m) => ({ w: m, f: et(e, m) })).filter((m) => m.f.len > 1e-9);
  let h = null;
  for (const { w: m, f: w } of u) {
    const _ = { x: (w.a.x + w.b.x) / 2, y: (w.a.y + w.b.y) / 2 }, S = z(_, l);
    S <= i && f(_) && (!h || S < h.d) && (h = { wallId: m.id, pt: _, offset: w.len / 2, d: S });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const g = (m) => {
    let w = null;
    for (const { w: _, f: S } of u) {
      const k = tt(S.dir), I = m ? [S.leftOff, -S.rightOff].filter((C) => C !== 0) : [0];
      for (const C of I) {
        const N = P(S.a, M(k, C)), R = r ? ut(r, A(l, r), N, S.dir) : P(N, M(S.dir, F(A(l, N), S.dir)));
        if (!R) continue;
        const H = F(A(R, N), S.dir);
        if (H < 0 || H > S.len) continue;
        const q = z(R, l);
        q <= i && (!w || q < w.d) && (w = { d: q, res: { pt: R, kind: "wall", endpoint: { kind: "wall", wallId: _.id, offset: H } } });
      }
    }
    return w ? w.res : null;
  }, y = g(!1);
  if (y) return y;
  const v = g(!0);
  if (v) return v;
  if (s && s > 0) {
    const m = (_) => Math.round(_ / s) * s, w = r ? d ? { x: m(l.x), y: r.y } : { x: r.x, y: m(l.y) } : { x: m(l.x), y: m(l.y) };
    return Ji(w, "grid");
  }
  return Ji(l, "none");
}
function Ec(e, t, n) {
  return t.some((i, s) => Ue(e, i, t[(s + 1) % t.length]) <= n);
}
function ei(e, t, n) {
  const i = je(e);
  for (const [s, o] of i) if (Kt(t, o)) return s;
  for (const [s, o] of i) if (Ec(t, o, n)) return s;
  return null;
}
function Mc(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = et(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Lt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Ac(e, t, n, i) {
  const s = Mc(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((d) => d.id === a);
        if (l && z(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = ei(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && Kt(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function Ic(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, a = null;
  const l = (h) => {
    t = h, e.select(h);
  }, d = () => {
    n = null, i = null, s = null, a = null, o = !1;
  }, f = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, g, y) => Lt(et(h, h.walls.find((v) => v.id === g)), y).t;
  function u(h) {
    const g = n;
    if (!(!g || !i) && !(h.pt.x === r.x && h.pt.y === r.y))
      if (o = !0, g.kind === "node") {
        const y = Nt(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [g.nodeId]
        }), v = y.endpoint, m = (y.kind === "wall" || y.kind === "mid") && v.kind === "wall", w = y.kind === "node" && v.kind === "node" && v.nodeId !== g.nodeId, _ = i.nodes.find((C) => C.id === g.nodeId), S = !!_.host && m && v.kind === "wall" && v.wallId === _.host.wallId;
        let k = i;
        if (_.host && !S) {
          const C = structuredClone(i);
          delete C.nodes.find((N) => N.id === g.nodeId).host, k = C;
        }
        let I = ul(k, g.nodeId, f(y));
        if (w && v.kind === "node")
          I = gl(I, g.nodeId, v.nodeId);
        else if (m && v.kind === "wall" && !S) {
          const C = i.walls.find((N) => N.id === v.wallId);
          if (C && C.a !== g.nodeId && C.b !== g.nodeId) {
            const N = structuredClone(I);
            N.nodes.find((R) => R.id === g.nodeId).host = { wallId: v.wallId, offset: v.offset }, I = gt(N, I);
          }
        }
        s = I;
      } else if (g.kind === "wall") {
        const y = i.walls.find((w) => w.id === g.wallId), v = Nt(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [y.a, y.b]
        }), m = A(v.pt, g.origin);
        s = fl(
          i,
          g.wallId,
          v.kind === "none" ? { x: Math.round(m.x), y: Math.round(m.y) } : m
        );
      } else {
        const y = i.openings.find((v) => v.id === g.openingId);
        s = Ys(i, y.id, c(i, y.wallId, h.pt) - g.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      d(), r = h.pt;
      const g = e.level(), y = h.ctrl ? ei(g, h.pt, e.tolMm()) : null;
      if (y) {
        l(null), e.commit(_c(g, y, h.pt));
        return;
      }
      const v = t, m = Ac(g, h.pt, e.tolMm(), v);
      if (l(m), !!m) {
        if (a = i = s = g, m.kind === "node") {
          let w = m.id;
          const _ = (v == null ? void 0 : v.kind) === "wall" ? g.walls.find((S) => S.id === v.id) : void 0;
          if (h.alt && _) {
            const S = pl(g, _.id, _.a === m.id ? "a" : "b");
            i = s = S.level, w = S.nodeId, l({ kind: "node", id: w });
          }
          n = { kind: "node", nodeId: w, origin: Z(i, w) };
        } else if (m.kind === "wall")
          n = { kind: "wall", wallId: m.id, origin: h.pt };
        else if (m.kind === "opening") {
          const w = g.openings.find((_) => _.id === m.id);
          n = { kind: "opening", openingId: w.id, grab: c(g, w.wallId, h.pt) - w.offset };
        }
      }
    },
    move(h) {
      u(h);
    },
    up(h) {
      n && u(h);
      const g = o, y = s, v = a;
      d(), g && y && v && y !== v && e.commit(y);
    },
    key(h) {
      return h === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      d(), l(null);
    }
  };
}
function ve(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function Ro() {
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
function Pc(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = Ro(), s = () => {
    t = null, i.clear();
  }, o = (d) => Nt(e.level(), d, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const d = ve(i.first, { min: 1 }), f = ve(i.second, { min: 1 });
      return d === null || f === null ? null : { x: t.x + (n.x >= t.x ? d : -d), y: t.y + (n.y >= t.y ? f : -f) };
    }
    return o(n).pt;
  }
  const a = (d, f) => Math.abs(d.x - f.x) < 1 || Math.abs(d.y - f.y) < 1;
  function l(d) {
    if (!t || a(t, d)) return;
    const f = dl(e.level(), t, d, e.wallProps(), e.boxMeasure());
    f !== e.level() && (e.commit(f), s());
  }
  return {
    id: "box",
    down(d) {
      if (n = d.pt, !t) {
        t = o(d.pt).pt;
        return;
      }
      const f = r();
      f && l(f);
    },
    move(d) {
      n = d.pt;
    },
    up() {
    },
    key(d) {
      return t ? i.key(d, () => {
        const f = r();
        f && l(f);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const d = r(), f = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || a(t, d)) return f;
      const c = e.wallProps(), u = Eo(t, d, c.thickness, e.boxMeasure());
      return u && (f.walls = u.map((h, g) => ({ a: h, b: u[(g + 1) % 4], props: { ...c, baseline: "center" } }))), f;
    },
    cancel() {
      s();
    }
  };
}
const ts = (e) => Math.round(e * 1e3) / 1e3 + 0;
function Oc(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = Ro(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, d = (u, h) => Nt(e.level(), u, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: h && n !== null });
  function f() {
    if (!n) return null;
    const u = d(s, o), h = ve(a.first, { min: 1 }), g = ve(a.second);
    if (h === null && g === null) return { pt: u.pt, endpoint: u.endpoint, snap: u };
    const y = h ?? z(n, u.pt);
    let v = u.pt;
    if (g === null && z(n, u.pt) < 1) {
      const S = r ?? { x: 1, y: 0 };
      v = { x: n.x + S.x, y: n.y + S.y };
    }
    if (g !== null) {
      const S = g * Math.PI / 180;
      v = { x: n.x + Math.cos(S), y: n.y - Math.sin(S) };
    }
    const m = Sc(n, v, y), w = { x: ts(m.x), y: ts(m.y) }, _ = e.level().nodes.find((S) => Math.hypot(S.x - w.x, S.y - w.y) < 1);
    return _ ? { pt: { x: _.x, y: _.y }, endpoint: { kind: "node", nodeId: _.id }, snap: u } : { pt: w, endpoint: { kind: "free", pt: w }, snap: u };
  }
  function c() {
    const u = f();
    if (!t || !u) return;
    const h = cl(e.level(), t, u.endpoint, e.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    e.commit(h.level);
    const g = h.level.walls.find((_) => _.id === h.wallId);
    i === null && (i = g.a);
    const y = h.endNodeId === i, v = n, m = Z(h.level, h.endNodeId), w = z(v, m);
    if (w > 0 && (r = { x: (m.x - v.x) / w, y: (m.y - v.y) / w }), a.clear(), y) {
      l();
      return;
    }
    t = { kind: "node", nodeId: h.endNodeId }, n = Z(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(u) {
      if (s = u.pt, o = u.shift, !t) {
        const h = d(u.pt, !1);
        t = h.endpoint, n = h.pt;
        return;
      }
      c();
    },
    move(u) {
      s = u.pt, o = u.shift;
    },
    up() {
    },
    key(u, h) {
      return o = h.shift, t ? a.key(u, c, l) : !1;
    },
    preview() {
      if (!n) return { snap: Nt(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const u = f();
      return {
        walls: [{ a: n, b: u.pt, props: e.wallProps() }],
        snap: u.snap,
        tracker: a.tracker(u.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      l();
    }
  };
}
function zc(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = ei(o, n, e.tolMm());
    if (!r) return null;
    const a = et(o, o.walls.find((d) => d.id === r)), l = Lt(a, n).t;
    return { wallId: r, center: l, pt: P(a.a, M(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = _a(e.level(), r.wallId, t, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Ze(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function Cc(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = xa(n, t.pt, e.zoneName());
      i.zoneId !== null && (e.commit(i.level), (s = e.zonePlaced) == null || s.call(e), e.select({ kind: "zone", id: i.zoneId }));
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
const ni = 3, es = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function Bo(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((f) => f.id === o), l = a ? Q(s, a) : null, d = a ? En(s, a, e.scale()) : null;
    return !l || !d ? 0 : ro(xt(A(r, l.pt)) - xt(A(d.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && z(s.pt, t.downPt) <= ni / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const a = z(s.pt, r.pt), l = (xt(A(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, f = qa(t.original, o, d, s.shift);
    t.work = JSON.stringify(f) === JSON.stringify(o.placement) ? t.original : Vn(t.original, o.id, f);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((d) => d.id === s), l = a ? En(r, a, e.scale()) : null;
      return !a || !l || z(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && es(o.work, o.id) !== es(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function ns(e, t, n) {
  const i = et(e, e.walls.find((s) => s.id === t));
  return Lt(i, n).side > 0 ? "left" : "right";
}
function Fo(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Uo(e, t, n, i, s = 0) {
  const o = Hn[n];
  if (o.includes("wall")) {
    const r = Nt(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: ns(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const d of t.walls) {
        if (d.a !== a.nodeId && d.b !== a.nodeId) continue;
        const f = et(t, d), c = Math.max(0, Math.min(f.len, Lt(f, i).t)), u = Math.hypot(i.x - (f.a.x + f.dir.x * c), i.y - (f.a.y + f.dir.y * c));
        (!l || u < l.d) && (l = { id: d.id, offset: d.a === a.nodeId ? 0 : f.len, d: u });
      }
      if (l) return { mode: "wall", wallId: l.id, side: ns(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Fo(e, i), rotation: s } : null;
}
function Nc(e, t, n) {
  return to(e.deviceDefaults(t), "free", n.mode);
}
function Lc(e, t) {
  let n = null, i;
  const s = Bo(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = Uo(e, r, t, n);
    if (!a)
      return { placement: { mode: "free", ...Fo(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const l = Nc(e, t, a), d = Ti(r, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), d = Dn(p(`device.${t}`), l.devices.filter((c) => c.props.kind === t).map((c) => c.name)), f = Ti(l, a.props, a.placement, d);
      f.deviceId !== null && (e.commit(f.level), i = f.deviceId, e.select({ kind: "device", id: f.deviceId }));
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
const is = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, Tc = (e, t, n) => n === void 0 || is(e, n) !== is(t, n);
function Dc(e) {
  let t = null, n = null;
  const i = Bo(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (u) => {
    t = u, e.select(u);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function f(u) {
    if (!n || !s || !r && z(u.pt, a) <= ni / e.scale()) return;
    if (r = !0, u.pt.x === a.x && u.pt.y === a.y) {
      o = s;
      return;
    }
    const h = s.devices.find((k) => k.id === n.id);
    if (!h) return;
    const g = u.shift ? ti(a, u.pt) : u.pt, y = h.placement, v = y.mode === "free", m = v ? null : Q(s, h), w = y.mode === "free" ? y.rotation : m ? oo(Math.round(xt(m.dir))) : 0, _ = Uo(e, s, h.props.kind, v ? P(g, n.grab) : g, w), S = _ && _.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ..._, aim: y.aim } : _;
    o = S ? Vn(s, h.id, c(s, h.placement, S, g)) : s;
  }
  function c(u, h, g, y) {
    if (h.mode !== "wall" || g.mode !== "wall" || g.wallId !== h.wallId) return g;
    const v = u.walls.find((I) => I.id === h.wallId);
    if (!v) return g;
    const m = et(u, v), w = Math.max(0, Math.min(m.len, h.offset + F(A(y, a), m.dir))), _ = Lt(m, y).side, S = e.tolMm(), k = h.side === "left" ? _ < -(m.rightOff + S) ? "right" : "left" : _ > m.leftOff + S ? "left" : "right";
    return { ...g, offset: w, side: k };
  }
  return {
    id: "device-select",
    down(u) {
      d(), a = u.pt;
      const h = e.level(), g = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, u)) return;
      const y = uo(h, u.pt, g);
      if (!y) {
        l(null);
        return;
      }
      l({ kind: "device", id: y });
      const v = h.devices.find((w) => w.id === y), m = Q(h, v);
      s = o = h, n = { id: y, grab: m && v.placement.mode === "free" ? A(m.pt, u.pt) : { x: 0, y: 0 } };
    },
    move(u) {
      i.active() ? i.move(u) : f(u);
    },
    up(u) {
      if (i.end(u)) return;
      n && f(u);
      const h = o, g = s, y = r, v = n == null ? void 0 : n.id;
      d(), y && h && g && h !== g && Tc(g, h, v) && e.commit(h);
    },
    key(u) {
      return u === "Escape" && i.cancel() ? !0 : u === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const u = i.working();
      return u ? { level: u } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), l(null);
    }
  };
}
function Rc(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = uo(e.level(), t.pt, e.tolMm());
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
function Bc(e, t) {
  let n = null;
  for (const i of e.zones) {
    if (i.outline.length < 3 || !We(i.outline, t)) continue;
    const s = Math.abs(ft(i.outline));
    (!n || s < n.area || s === n.area && i.id < n.room.id) && (n = { room: i, area: s });
  }
  return n ? n.room : null;
}
function Fc(e) {
  return {
    id: "zone-room",
    down(t) {
      const n = e.level(), i = Bc(n, t.pt);
      if (!i) return;
      const s = il(n, i.id, i.name);
      s.zoneId !== null && (s.level !== n && e.commit(s.level), e.select({ kind: "automationZone", id: s.zoneId }));
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
function Ho(e, t, n, i) {
  if (n.alt) {
    const r = n.shift && i ? ti(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: r.x, y: r.y }, snap: null };
  }
  const s = Nt(t, n.pt, { tolMm: e.tolMm(), grid: e.grid(), from: i, ortho: n.shift }), o = s.endpoint;
  if (s.kind === "node" && o.kind === "node")
    return { vertex: { kind: "node", nodeId: o.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if ((s.kind === "mid" || s.kind === "wall") && o.kind === "wall") {
    const r = t.walls.find((a) => a.id === o.wallId);
    if (r) {
      const a = Lt(et(t, r), n.pt).side >= 0 ? "left" : "right", l = lo(t, r.id, a, o.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: r.id, offset: o.offset, side: a, x: l.x, y: l.y }, snap: { ...s, pt: l } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function Uc(e, t, n) {
  const i = [];
  for (const s of U(e)) {
    const o = St(e, s);
    (o.some((a, l) => Ue(t, a, o[(l + 1) % o.length]) <= n) || We(o, t)) && i.push({ id: s.id, area: Math.abs(ft(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function Hc(e, t, n, i) {
  const s = U(e).find((a) => a.id === t);
  if (!s || s.shape.kind !== "polygon") return null;
  const o = St(e, s);
  let r = -1;
  return o.forEach((a, l) => {
    z(n, a) <= i && (r < 0 || z(n, a) < z(n, o[r])) && (r = l);
  }), r < 0 ? null : { index: r, from: o[(r + o.length - 1) % o.length] };
}
function jc(e) {
  let t = null, n = null, i = null, s = null, o = null, r = !1, a = !1, l = { x: 0, y: 0 };
  const d = () => {
    const g = e.selection();
    return (g == null ? void 0 : g.kind) === "automationZone" ? g.id : null;
  }, f = (g) => {
    e.select(g === null ? null : { kind: "automationZone", id: g });
  }, c = () => {
    n = null, i = null, s = null, o = null, r = !1, a = !1;
  };
  function u(g) {
    if (!n || !i || !a && z(g.pt, l) <= ni / e.scale()) return;
    a = !0;
    const y = Ho(e, i, g, n.from);
    o = y.snap, r = g.shift, s = rl(i, n.zoneId, n.index, y.vertex);
  }
  function h(g, y) {
    const v = Uc(g, y, e.tolMm());
    if (v.length === 0) {
      t = null, f(null);
      return;
    }
    const m = d(), w = m !== null && t !== null && z(y, t) <= e.tolMm() ? v.indexOf(m) : -1;
    t = y, f(v[(w + 1) % v.length]);
  }
  return {
    id: "zones-select",
    down(g) {
      c(), l = g.pt;
      const y = e.level(), v = d(), m = v === null ? null : Hc(y, v, g.pt, e.tolMm());
      if (v !== null && m) {
        n = { zoneId: v, ...m }, i = s = y;
        return;
      }
      h(y, g.pt);
    },
    move(g) {
      u(g);
    },
    up(g) {
      n && u(g);
      const y = s, v = i, m = a;
      c(), m && y && v && y !== v && e.commit(y);
    },
    key(g) {
      return g === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      if (!n || !s) return {};
      const g = { level: s };
      return o && (g.snap = o), r && (g.orthoFrom = n.from), g;
    },
    cancel() {
      c(), t = null;
    }
  };
}
const ss = 3, Zc = 1, at = (e) => ({ x: e.x, y: e.y });
function qc(e) {
  let t = [], n = null, i = !1, s = null, o = !1;
  const r = () => t.length ? at(t[t.length - 1]) : void 0;
  function a(c) {
    const u = t.length;
    if (u === 0) return !1;
    const h = t.map(at);
    if (z(h[u - 1], c) <= Zc) return !0;
    if (u >= 2) {
      const g = A(h[u - 1], h[u - 2]), y = A(c, h[u - 1]);
      if (Math.abs(J(g, y)) <= 1e-9 * Math.hypot(g.x, g.y) * Math.hypot(y.x, y.y) && F(g, y) < 0) return !0;
    }
    for (let g = 0; g + 2 < u; g++) if (fo(h[u - 1], c, h[g], h[g + 1])) return !0;
    return !1;
  }
  function l(c) {
    if (t.length < ss) return null;
    const u = e.tolMm(), h = at(t[0]), g = at(t[t.length - 1]);
    return z(c, h) <= u ? h : z(c, g) <= u ? g : null;
  }
  function d() {
    if (t.length < ss || Le(t.map(at))) return !1;
    const c = e.level(), u = Dn(p("zones.default"), U(c).map((g) => g.name)), h = sl(c, t, u);
    return h.zoneId === null ? !1 : (t = [], n = null, i = !1, e.commit(h.level), e.select({ kind: "automationZone", id: h.zoneId }), !0);
  }
  const f = (c) => Ho(e, e.level(), c, r());
  return {
    id: "zone-draw",
    down(c) {
      if (l(c.pt)) {
        d();
        return;
      }
      const u = f(c).vertex;
      a(at(u)) || (t = [...t, u], n = at(u), i = !1);
    },
    move(c) {
      o = c.shift;
      const u = l(c.pt);
      if (u) {
        n = u, s = null, i = Le(t.map(at));
        return;
      }
      const h = f(c);
      s = h.snap, n = at(h.vertex), i = a(n);
    },
    up() {
    },
    key(c) {
      return c === "Enter" ? d() : c === "Backspace" || c === "Delete" ? t.length === 0 ? !1 : (t = t.slice(0, -1), i = !1, !0) : c === "Escape" ? t.length === 0 ? !1 : (t = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const c = {};
      t.length > 0 && (c.zoneDraft = { points: t.map(at), cursor: n, invalid: i }), s && (c.snap = s);
      const u = r();
      return o && u && (c.orthoFrom = u), c;
    },
    cancel() {
      t = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
const Vc = ["select", "box", "wall", "door", "window", "opening", "zone"], Wc = [
  "device-select",
  "ceiling_light",
  "wall_light",
  "motion_sensor",
  "illuminance_sensor",
  "climate_sensor",
  "wall_switch",
  "smart_button",
  "socket",
  "exhaust_fan",
  "equipment"
], Kc = ["binding-select"], Gc = ["zones-select", "zone-room", "zone-draw"], Yc = {
  plan: Vc,
  equipment: Wc,
  binding: Kc,
  zones: Gc
};
function ii(e) {
  return Yc[e];
}
function An(e, t) {
  switch (e) {
    case "select":
      return Ic(t);
    case "box":
      return Pc(t);
    case "wall":
      return Oc(t);
    case "door":
    case "window":
    case "opening":
      return zc(t, e);
    case "zone":
      return Cc(t);
    case "device-select":
      return Dc(t);
    case "binding-select":
      return Rc(t);
    case "zones-select":
      return jc(t);
    case "zone-room":
      return Fc(t);
    case "zone-draw":
      return qc(t);
    default:
      return Lc(t, e);
  }
}
function un(e, t) {
  return t.kind === "automationZone" ? U(e).some((i) => i.id === t.id) : (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((i) => i.id === t.id);
}
function Qc(e) {
  switch (e.saveState) {
    case "saving":
      return p("save.saving");
    case "conflict":
      return p("save.conflict");
    case "error":
      return p("save.error");
    default:
      return e.dirty ? p("save.dirty") : p(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Xc(e) {
  return b`
    <div class="top"><div class="bar">
      ${e.lead ?? $}
      ${e.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${p("plan.pick")} title=${p("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${V(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => b`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : $}
      <button class="btn" data-action="new-plan" title=${p("plan.new")} aria-label=${p("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${p("plan.delete")} aria-label=${p("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${p("action.undo")} aria-label=${p("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${p("action.redo")} aria-label=${p("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${Qc(e)}${e.saveState === "error" && e.errorMessage ? b`: ${e.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${p("action.save")}</button>
    </div>${e.steps}</div>`;
}
function jo(e, t, n) {
  return ii(e).map((i) => b`
    ${i === "zone" || i === "ceiling_light" ? b`<div class="tool-sep"></div>` : $}
    <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
      ${p(`tool.${i}`)}</button>`);
}
function Jc(e, t, n) {
  return b`<div class="tools">${jo(e, t, n)}</div>`;
}
const ne = ["plan", "equipment", "binding", "zones"], ae = (e, t, n) => p(e === 1 ? t : n).replace("{n}", String(e));
function td(e, t, n) {
  const { walls: i, zones: s, devices: o } = t;
  switch (e) {
    case "plan":
      return {
        text: `${ae(i.length, "steps.wall", "steps.walls")}, ${ae(s.length, "steps.room", "steps.rooms")}`,
        done: i.length > 0 && s.length > 0
      };
    case "equipment":
      return { text: ae(o.length, "steps.device", "steps.devices"), done: o.length > 0 };
    case "binding": {
      const r = o.length - Bn(o.map(n));
      return {
        text: p("steps.bound").replace("{b}", String(r)).replace("{n}", String(o.length)),
        done: o.length > 0 && r === o.length
      };
    }
    case "zones": {
      const r = U(t).length;
      return { text: ae(r, "steps.zone", "steps.zones"), done: r > 0 };
    }
  }
}
const os = (e, t) => p(e).replace("{step}", p(`mode.${t}`));
function ed(e) {
  const t = ne.indexOf(e.mode), n = ne[t - 1], i = ne[t + 1];
  return b`
    <nav class="steps" aria-label=${p("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${V(e.planName)} aria-label=${p("plan.name")} title=${p("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${p("steps.app")}</span>
      </div>
      ${ne.map((s, o) => {
    const r = td(s, e.level, e.status), a = s === e.mode;
    return b`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : $} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${p(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${ne.length + 1}</span><span class="name">${p("mode.automation")}</span>
        <span class="state">${p("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? b`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${os("steps.back", n)}</button>` : $}
        ${i ? b`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${os("steps.next", i)}</button>` : $}
      </div>
    </nav>`;
}
const nd = ["unbound", "bound", "all"], id = /* @__PURE__ */ new WeakMap();
function Zo(e) {
  return lt(id, e, (t) => [...t.devices].sort((n, i) => n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function sd(e, t, n) {
  const i = Zo(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const rs = (e) => p(`device.${e.props.kind}`), od = (e, t) => e === "all" || e === "bound" == (t === "bound");
function rd(e, t, n) {
  return t === 0 ? p("binding.noDevices") : n || e.filter === "all" ? p("binding.noMatch") : p(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function as(e) {
  const t = p(e.collapsed ? "binding.expand" : "binding.collapse");
  return b`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function ad(e) {
  var r;
  if (e.collapsed) return b`<div class="blist collapsed">${as(e)}</div>`;
  const t = Zo(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: Bn(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => od(e.filter, l) && (!i || a.name.toLowerCase().includes(i) || rs(a).toLowerCase().includes(i))), o = ((r = e.selection) == null ? void 0 : r.kind) === "device" ? e.selection.id : null;
  return b`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${p("binding.show")}>
          ${nd.map((a) => b`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${p(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${as(e)}
      </div>
      <input class="list-search" type="search" placeholder=${p("binding.search")} aria-label=${p("binding.search")}
        .value=${V(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? b`<p class="empty">${rd(e, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const d = Ir(a);
    return b`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${p(`bindstatus.${l}`)} title=${p(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${rs(a)}</small></span>
            <span class="cnt">${d.filled}/${d.total}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function O(e, t) {
  return b`<label class="row"><span>${e}</span>${t}</label>`;
}
function G(e, t, n, i) {
  return b`<select class="val" data-field=${i ?? $} .value=${V(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => b`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function Tt(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return b`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? $}
    placeholder=${e.placeholder ?? $} title=${e.placeholder ?? $} .value=${V(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = ve(s.value, e.rule);
    if (o === null) {
      s.value = t, n(p(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(p("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function ld() {
  return {
    door: { width: Ee.door, hinge: "start", swing: "left" },
    window: { width: Ee.window, outside: "left" },
    opening: { width: Ee.opening },
    zoneName: null
  };
}
function cd(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function qo(e) {
  return Dn(p("zone.default"), e.zones.map((t) => t.name));
}
const dd = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function ud(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? qo(e.level);
    return b`
      <h4>${p("props.nextZone")}</h4>
      ${O(p("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${V(r)}
        @change=${(a) => {
      const l = a.target, d = l.value.trim();
      if (!d) {
        l.value = r;
        return;
      }
      d !== r && e.setNext({ ...t, zoneName: d });
    }} />`)}`;
  }
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return $;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return b`
    <h4>${p(`props.next.${n}`)}</h4>
    ${O(`${p("props.width")}, ${p("unit.mm")}`, Tt({
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
    ${n === "door" ? b`
      ${O(p("props.hinge"), G(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${O(p("props.swing"), G(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? O(p("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class hd {
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
class fd {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await dn(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt($i(p("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = It(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await xl(this.h.hass, t);
    this.h.drafts.cancel(), this.h.save.reset(n.revision), this.adopt(n), this.h.drafts.setLastPlanId(n.id), this.offerDraft(this.h.drafts.read(n.id));
  }
  /** Closes the open dialog when it is of the given kind. */
  closeDialog(t) {
    var n;
    ((n = this.h.dialog) == null ? void 0 : n.kind) === t && (this.h.dialog = null);
  }
  offerDraft(t) {
    this.h.pendingDraft = t, t ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await dn(this.h.hass);
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
      this.h.notice = It(n);
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
    this.h.toolId = ii(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt($i(p("plan.default"))), this.offerDraft(null);
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
            await _l(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = It(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await dn(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = It(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(Hr) }, this.h.history = new hd(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = An(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.needFit = !0;
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
  currentPlan() {
    const t = this.h.plan, n = t.levels.map((i, s) => s === 0 ? this.h.history.current : i);
    return { ...t, levels: n, revision: this.h.save.baseRevision ?? 0 };
  }
  async doSave() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.save(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = { kind: "conflict" }));
  }
  async doOverwrite() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.overwrite(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? { kind: "conflict-again" } : null);
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const t = `${this.h.plan.name} ${p("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class pd {
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
    !n || !vl(n.states, t) ? this.base = { states: t, meta: bl(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? wl(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), $l(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = p("binding.registryError").replace("{error}", It(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const ls = As("", "");
function gd(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current) ?? ls;
    },
    commit: (t) => e.commit(t),
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
    openingDefaults: (t) => cd(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? qo(((t = e.history) == null ? void 0 : t.current) ?? ls);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    }
  };
}
const Vo = Object.keys(Hn), md = (e) => Vo.includes(e);
function yd() {
  return Object.fromEntries(Vo.map((e) => [e, Ct(e, "free")]));
}
const Wo = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -jt, max: jt, signed: !0 }, bad: "props.badAim" }
}, de = (e, t, n, i, s) => Tt({ ...Wo[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), bd = ["round", "linear", "spot"], vd = ["rect", "circle"], De = (e, t) => e.map((n) => ({ v: n, label: p(`${t}.${n}`) }));
function Ko(e, t, n, i) {
  const s = (r, a, l) => O(`${p(a)}, ${p("unit.mm")}`, de(e, n + r, l, "mm", (d) => i({ [r]: d }))), o = (r, a, l) => O(`${p(a)}, ${p("unit.deg")}`, de(e, n + r, l, "angle", (d) => i({ [r]: d })));
  switch (t.kind) {
    case "ceiling_light":
      return b`
        ${O(p("props.shape"), G(t.shape, De([...bd], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? b`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(`${p("props.poolRadius")}, ${p("unit.mm")}`, Tt({
        ...Wo.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: p("props.poolHint"),
        setNotice: e.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return b`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return b`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return O(`${p("props.diameter")}, ${p("unit.mm")}`, b`<select class="val" data-field=${`${n}diameter`}
        .value=${V(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${Cr.map((r) => b`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return b`
        ${O(p("props.shape"), G(t.shape, De([...vd], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? b`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(p("props.icon"), wd(e, t.icon, `${n}icon`, i))}
        ${O(p("props.label"), b`<input class="val wide" type="text" data-field=${`${n}label`} .value=${V(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return b`<p class="muted">${p("props.noSettings")}</p>`;
  }
}
const $d = /^mdi:[a-z0-9-]+$/;
function wd(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!$d.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, p("props.badIcon"));
      return;
    }
    (l = e.onNotice) == null || l.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? b`<ha-icon-picker data-field=${n} .value=${V(t)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : b`<input class="val wide" type="text" data-field=${n} .value=${V(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
function xd(e, t) {
  const n = t.placement;
  if (n.mode === "free")
    return O(
      `${p("props.rotation")}, ${p("unit.deg")}`,
      de(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = Is.has(t.props.kind);
  return b`
    ${O(p("props.side"), G(n.side, De(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${O(`${p("props.offset")}, ${p("unit.mm")}`, de(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? O(
    `${p("props.aim")}, ${p("unit.deg")}`,
    de(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(ho(n, s)))
  ) : $}`;
}
function Go(e, t) {
  return O(p("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${V(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function kd(e, t) {
  const n = t.props.kind;
  return Wt(n) ? n === "smart_button" && t.placement.mode === "free" ? b`<p class="muted" data-note="type-free">${p("props.typeFreeHint")}</p>` : O(p("props.type"), G(
    n,
    De(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : $;
}
function _d(e, t) {
  const n = e.level ? Qa(e.level, t) : [];
  return b`<fieldset data-field="zone-membership"><legend>${p("props.zoneList")}</legend>
    ${n.length === 0 ? b`<p class="muted">${p("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => b`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = e.onZone) != null && a.call(e, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function Sd(e, t) {
  return b`
    <h4>${p(`device.${t.props.kind}`)}</h4>
    ${Go(t, (n) => e.onDevice({}, n))}
    ${kd(e, t)}
    ${Ko(e, t.props, "", (n) => e.onDevice(n))}
    ${xd(e, t)}
    ${_d(e, t)}
    ${t.invalid ? b`<p class="warn">${p("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${p("action.delete")}</button>`;
}
function Ed(e) {
  return e.device ? Sd(e, e.device) : e.nextKind && e.nextProps ? b`
      <h4>${p("props.nextDevice")}: ${p(`device.${e.nextKind}`)}</h4>
      ${Ko(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}` : b`<p class="muted">${p("props.none")}</p>`;
}
function Md(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((r) => r.id === n.id) ?? null : null, s = md(e.toolId) ? e.toolId : null, o = (r) => r === t ? (e.setNotice(p("props.noFit")), !1) : (e.setNotice(null), e.commit(r), !0);
  return b`<div class="props">
    ${Ed({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (r, a) => !!i && o(qe(t, i.id, r, a)),
    onKind: (r) => !!i && o(Aa(t, i.id, r)),
    onPlacement: (r) => !!i && o(Vn(t, i.id, r)),
    onZone: (r, a) => !!i && o(ko(t, i.id, r, a)),
    onNext: (r) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && e.commit(eo(t, i.id));
    },
    onNotice: (r) => e.setNotice(r)
  })}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
  </div>`;
}
function Yo(e, t, n) {
  return Tt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function cs(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function Ad(e, t) {
  const n = et(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(ml(t.level, e.id, o));
  return b`
    <h4>${p("props.wall")}</h4>
    ${O(p("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: p(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${O(p("props.thickness"), Yo(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${O(p("props.baseline"), G(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: p(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${O(p("props.length"), b`<span class="val ro">${Ot(n)} ${p("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(Yn(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function Id(e, t) {
  const n = ["door", "window", "opening", ...ze.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(Ma(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = ze.includes(e.kind);
  return b`
    <h4>${p(`kind.${e.kind}`)}</h4>
    ${O(p("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: p(`kind.${r}`) })), (r) => i(Ea(e, r))))}
    ${O(p("props.width"), Yo(t, e.width, (r) => cs(t, Sa(t.level, e.id, r))))}
    ${O(p("props.offset"), Tt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => cs(t, Ys(t.level, e.id, r))
  }))}
    ${o ? b`
      ${O(p("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${O(p("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : $}
    ${e.kind === "window" ? O(p("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : $}
    ${O(p("props.passesLight"), b`<input type="checkbox" data-field="passesLight" .checked=${V(Vs(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === qs(e.kind) ? void 0 : a });
  }} />`)}
    ${O(p("props.passesPir"), b`<input type="checkbox" data-field="passesPir" .checked=${V(Ks(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Ws(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? b`<p class="warn">${p("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(Qs(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function Pd(e, t) {
  return b`
    <h4>${p("props.zone")}</h4>
    ${O(p("props.name"), b`<input class="val wide" type="text" .value=${V(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(ka(t.level, e.id, s));
  }} />`)}
    ${O(p("props.area"), b`<span class="val ro">${No(Hs(e.outline))}</span>`)}
    ${e.broken ? b`<p class="warn">${p("props.broken")}</p>` : $}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(Zs(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function Od(e) {
  const t = ["bearing", "partition", "railing"];
  return b`
    <h4>${p("props.newWall")}</h4>
    ${O(p("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => b`<option value=${n} ?selected=${n === e.wallType}>${p(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${O(`${p("props.thickness")}, ${p("unit.mm")}`, Tt({
    value: e.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      e.setThickness(n);
    }
  }))}
    ${e.tool === "box" ? b`
      <div class="muted">${p("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => b`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${p(`measure.${n}`)}</button>`)}
      </div>` : $}`;
}
function zd(e) {
  const { level: t, selection: n } = e;
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = Ad(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = Id(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = Pd(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = b`<h4>${p("props.node")}</h4>
      ${O("X", b`<span class="val ro">${Ot(s.x)}</span>`)}${O("Y", b`<span class="val ro">${Ot(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === $ && (e.tool === "wall" || e.tool === "box") ? Od(e) : i === $ && dd(e.tool) ? ud({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === $ ? b`<p class="muted">${p("props.none")}</p>` : i}
      ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
    </div>`;
}
function Cd(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const ds = /* @__PURE__ */ new WeakMap();
function Nd(e, t, n) {
  let i = ds.get(e);
  i || ds.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : Cd(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
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
const ke = (e) => e ?? $;
var Ld = Object.defineProperty, we = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Ld(t, n, s), s;
};
const Td = 100;
let Dd = 0;
const Rd = (e) => b`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${E`<path d=${e}></path>`}</svg>`, oi = class oi extends Ut {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Dd++}`, this.shown = null, this.onOutside = (t) => {
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
        if (s.length === Td) {
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
    return b`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${ke(this.label || void 0)} title=${ke(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? b`<button class="x" type="button" title=${p("combo.clear")} aria-label=${p("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : $}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return b`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${ke(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => b`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${ke(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? b`<div class="empty">${this.emptyText()}</div>` : $}
      ${n ? b`<div class="hint">${p("combo.more")}</div>` : $}
    </div>`;
  }
  render() {
    return b`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : $}</div>`;
  }
};
oi.styles = vs`
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
let _t = oi;
we([
  pt()
], _t.prototype, "value");
we([
  pt()
], _t.prototype, "label");
we([
  T()
], _t.prototype, "isOpen");
we([
  T()
], _t.prototype, "query");
we([
  T()
], _t.prototype, "active");
var Bd = Object.defineProperty, si = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Bd(t, n, s), s;
};
const Fd = {
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
}, us = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Ud = { light: "light", switch: "switch", event: "event", fan: "fan" };
function hs(e, t) {
  return e != null && e.deviceClass && us[e.deviceClass] ? us[e.deviceClass] : Ud[(e == null ? void 0 : e.domain) ?? Ao(t)] ?? "generic";
}
const fs = (e) => Rd(Fd[e]);
function Hd(e) {
  switch (e) {
    case "sensor":
      return p("combo.domain.sensor");
    case "binary_sensor":
      return p("combo.domain.binary_sensor");
    case "light":
      return p("combo.domain.light");
    case "switch":
      return p("combo.domain.switch");
    case "fan":
      return p("combo.domain.fan");
    case "event":
      return p("combo.domain.event");
    default:
      return e;
  }
}
class Je extends _t {
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
    return b`${fs(t ? hs(this.meta.entities.get(t), t) : "generic")}
      ${n ? b`<span><b>${n.name}</b>${n.context !== n.name ? b`<small>${n.context}</small>` : $}<small class="eid">${t}</small></span>` : b`<span class="ph">${p("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Po(this.states, t.entityId) ?? "unavailable";
    return b`${fs(hs(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Hd(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
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
    return p("combo.search");
  }
  emptyText() {
    return p("combo.empty");
  }
}
si([
  pt({ attribute: !1 })
], Je.prototype, "meta");
si([
  pt({ attribute: !1 })
], Je.prototype, "items");
si([
  pt({ attribute: !1 })
], Je.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Je);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qo = Xn(class extends Jn {
  constructor(e) {
    if (super(e), e.type !== mt.PROPERTY && e.type !== mt.ATTRIBUTE && e.type !== mt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!To(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === st || t === $) return t;
    const n = e.element, i = e.name;
    if (e.type === mt.PROPERTY) {
      if (t === n[i]) return st;
    } else if (e.type === mt.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return st;
    } else if (e.type === mt.ATTRIBUTE && n.getAttribute(i) === t + "") return st;
    return Do(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), ue(s, t);
  return !0;
}, Re = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, Xo = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), qd(t);
  }
};
function jd(e) {
  this._$AN !== void 0 ? (Re(this), this._$AM = e, Xo(this)) : this._$AM = e;
}
function Zd(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) ue(i[o], !1), Re(i[o]);
  else i != null && (ue(i, !1), Re(i));
  else ue(this, e);
}
const qd = (e) => {
  e.type == mt.CHILD && (e._$AP ?? (e._$AP = Zd), e._$AQ ?? (e._$AQ = jd));
};
class Vd extends Jn {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), Xo(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (ue(this, t), Re(this));
  }
  setValue(t) {
    if (To(this._$Ct)) this._$Ct._$AI(t, this);
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
const Wd = () => new Kd();
class Kd {
}
const fn = /* @__PURE__ */ new WeakMap(), Gd = Xn(class extends Vd {
  render(e) {
    return $;
  }
  update(e, [t]) {
    var i;
    const n = t !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = (i = e.options) == null ? void 0 : i.host, this.rt(this.ct = e.element)), $;
  }
  rt(e) {
    if (this.G !== void 0) if (this.isConnected || (e = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let n = fn.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), fn.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = fn.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), Yd = () => [{ v: "0", label: p("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], Qd = { min: 1, max: 10 };
function Jo(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const In = (e, t, n) => Jo(e, qe(e.level, t.id, n));
function pn(e, t, n, i) {
  return b`<div class="cflag">${O(t, b`<input type="checkbox" data-field=${e} .checked=${V(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const gn = "__other", ie = /* @__PURE__ */ new Set();
function Xd(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = vi.includes(i), a = !r || ie.has(o), l = Wd(), d = [...vi.map((c) => ({ v: c, label: c })), { v: gn, label: p("binding.eventOther") }];
  return b`<span class="evfield">${G(a ? gn : i, d, (c) => {
    if (c === gn) {
      ie.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    ie.delete(o), l.value && (l.value.hidden = !0), c !== i ? s(c) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${Gd(l)} data-field=${`${n}-event-custom`} ?hidden=${Qo(!a)}
      .value=${V(r ? "" : i)} @change=${(c) => {
    var g;
    const u = c.target, h = u.value.trim();
    if (!h) {
      u.value = r ? "" : i, e.setFieldNotice(p("props.badEvent"));
      return;
    }
    if (u.value = h, e.setFieldNotice(null), h !== i) {
      s(h) && ie.delete(o);
      return;
    }
    if (ie.delete(o), r) {
      u.hidden = !0;
      const y = (g = u.parentElement) == null ? void 0 : g.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function Jd(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return b`${$}`;
  const s = i[n], o = (r) => In(e, t, { [n]: { ...s, ...r } });
  return b`<div class="trigger" data-trigger=${n}>
    ${O(p("binding.slot"), G(
    String(s.slot),
    Yd(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${O(p("binding.event"), Xd(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function tu(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return b`
      ${pn(
      "autoByDoubleToggle",
      p("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => In(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? b`<div class="cflag">${O(p("binding.window"), Tt({
      value: i.windowSec,
      rule: Qd,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => In(e, t, { windowSec: a })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return b`${$}`;
  const s = (a, l) => (d) => {
    var c, u;
    const f = qe(e.level, t.id, { [a]: d });
    return Jo(e, d && !((c = t.bindings) != null && c[l]) ? Ms(f, t.id, l, ((u = t.bindings) == null ? void 0 : u.on) ?? null) : f);
  }, o = s("separateOff", "off"), r = pn("autoEnabled", p("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : b`${pn("separateOff", p("binding.separateOff"), i.separateOff, o)}${i.separateOff ? $ : r}`;
}
function eu(e) {
  return e.props.kind !== "smart_button" || !zr(e).length ? b`${$}` : b`<div class="cfields"><p class="warn" data-note="duplicate">${p("binding.duplicate")}</p></div>`;
}
function nu(e, t) {
  return t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? p("binding.onOff") : p(`role.${t}`);
}
const mn = (e) => String(e).padStart(2, "0");
function iu(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${mn(t.getHours())}:${mn(t.getMinutes())}:${mn(t.getSeconds())}`;
}
const su = (e) => e.action === "set" ? `set ${e.value ?? ""}`.trim() : e.action;
function ou(e) {
  return e.status === "error" ? e.reason === "unavailable" ? p("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : p("output.errorNotConfigured") : e.last ? p("output.last").replace("{event}", su(e.last)).replace("{time}", iu(e.last.at)) : p("output.none");
}
function ru(e, t) {
  if (!Wt(t.props.kind)) return $;
  const n = e.feed.stateOf(t), i = n ? ou(n) : e.feed.error ?? (e.feed.ready ? p("output.notSaved") : null);
  return i === null ? $ : b`<p class="note" data-field="output">${i}</p>`;
}
function au(e, t, n, i) {
  const s = Oo(e.meta, i, e.states), o = Or(e.level, t, n);
  return b`
    ${s === "missing" ? b`<p class="warn" data-note="missing">${p("binding.missing")}</p>` : $}
    ${s === "unavailable" ? b`<p class="note" data-note="unavailable">${p("binding.unavailable")}</p>` : $}
    ${o.length ? b`<p class="note" data-note="also">${p("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : $}`;
}
function lu(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = nu(t, i);
  return b`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${p("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${Nd(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const d = Ms(e.level, t.id, i, l.detail.value);
    d !== e.level && e.commit(d);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && Rn(i) ? Jd(e, t, i) : $}
    ${s ? au(e, t, i, s) : $}
  </div>`;
}
function cu(e) {
  const t = e.device, n = Bn(e.level.devices.map(e.status));
  return b`<div class="props bprops">
    ${e.notice ? b`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : $}
    ${e.fieldNotice ? b`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : $}
    ${e.registryError ? b`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${p(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${t ? b`
      <h4>${p(`device.${t.props.kind}`)}</h4>
      ${Go(t, (i) => e.commit(qe(e.level, t.id, {}, i)))}
      ${ru(e, t)}
      ${Vt(t).map((i) => b`${lu(e, t, i)}${tu(e, t, i.role)}`)}
      ${eu(t)}` : b`<p class="muted">${p("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${p("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${p("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${p("binding.reload")}</button>
  </div>`;
}
const Pn = (e) => p(`zones.kind.${e.shape.kind}`);
function tr(e, t) {
  const n = po(e, t);
  return n ? p(`zones.invalid.${n}`) : null;
}
const du = /* @__PURE__ */ new WeakMap();
function uu(e) {
  return lt(du, e, (t) => new Map(U(t).map((n) => [n.id, Gn(t, n.id).filter((i) => i.participates).length])));
}
function hu(e) {
  var o;
  const t = uu(e.level), n = e.query.trim().toLowerCase(), i = ((o = e.selection) == null ? void 0 : o.kind) === "automationZone" ? e.selection.id : null, s = U(e.level).map((r, a) => ({ z: r, hue: Te[a % Te.length] })).filter(({ z: r }) => !n || r.name.toLowerCase().includes(n) || Pn(r).toLowerCase().includes(n));
  return b`
    <div class="zlist">
      <div class="ztools">${jo("zones", e.toolId, e.onTool)}</div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${p("zones.filter")}
        aria-label=${p("zones.filter")} .value=${V(e.query)}
        @input=${(r) => e.onQuery(r.target.value)} />
      <div class="rows">
        ${s.map(({ z: r, hue: a }) => {
    const l = r.invalid ? tr(e.level, r) ?? "" : null;
    return b`<button class="zrow${r.id === i ? " sel" : ""}" data-id=${r.id} @click=${() => e.onPick(r.id)}>
            ${l === null ? b`<span class="zswatch" style=${`background:${a}`}></span>` : b`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="nm"><span class="name">${r.name}</span><small class="kind">${Pn(r)}</small></span>
            <span class="zcount" title=${p("zones.members")}>${t.get(r.id) ?? 0}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function fu(e, t) {
  const n = Gn(e.level, t.id);
  return b`<div class="zmembers">
    <div class="zhead"><span>${p("zones.members")}</span>${n.length ? b`<span>${p("zones.participates")}</span>` : $}</div>
    ${n.length === 0 ? b`<p class="muted">${p("zones.noMembers")}</p>` : n.map(({ device: i, participates: s }) => b`
      <label class="member" data-device=${i.id}>
        <span class="nm"><span class="name">${i.name}</span><small class="kind">${p(`device.${i.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${p("zones.participates")} .checked=${Qo(s)}
          @change=${(o) => {
    const r = ko(e.level, i.id, t.id, o.target.checked);
    r !== e.level && e.commit(r);
  }} />
      </label>`)}
  </div>`;
}
function pu(e, t) {
  var o;
  const n = t.shape, i = n.kind === "room" ? ((o = e.level.zones.find((r) => r.id === n.roomId)) == null ? void 0 : o.name) ?? "—" : null, s = tr(e.level, t);
  return b`
    <h4>${p("zones.default")}</h4>
    ${O(p("props.name"), b`<input class="val wide" type="text" data-field="zone-name" .value=${V(t.name)}
      @change=${(r) => {
    const a = r.target, l = a.value.trim();
    if (!l || l === t.name) {
      a.value = t.name;
      return;
    }
    e.commit(ol(e.level, t.id, l));
  }} />`)}
    ${O(p("props.kind"), b`<span class="val ro" data-field="zone-kind">${Pn(t)}</span>`)}
    ${i === null ? $ : O(p("zones.room"), b`<span class="val ro" data-field="zone-room">${i}</span>`)}
    ${s ? b`<p class="warn" data-note="zone-invalid">${s}</p>` : $}
    ${fu(e, t)}
    <button class="btn danger" data-action="delete-zone" @click=${() => e.commit(xo(e.level, t.id))}>
      ${p("zones.delete")}</button>`;
}
function gu(e) {
  const t = e.selection, n = U(e.level), i = (t == null ? void 0 : t.kind) === "automationZone" ? n.find((s) => s.id === t.id) ?? null : null;
  return b`<div class="props zprops">
    ${i ? pu(e, i) : b`
      <p class="muted">${p("zones.hint")}</p>
      <p class="muted" data-note="zone-count">${ae(n.length, "steps.zone", "steps.zones")}</p>`}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
  </div>`;
}
function mu(e, t) {
  return e.mode === "zones" ? hu({
    level: t,
    selection: e.selection,
    toolId: e.toolId,
    query: e.zoneQuery,
    onTool: (n) => e.pickTool(n),
    onQuery: (n) => {
      e.zoneQuery = n;
    },
    onPick: (n) => e.pickZone(n)
  }) : e.mode !== "binding" ? Jc(e.mode, e.toolId, (n) => e.pickTool(n)) : ad({
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
function yu(e, t) {
  var i;
  const n = e.selection;
  return cu({
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
function bu(e, t) {
  if (e.mode === "binding") return yu(e, t);
  if (e.mode === "zones") return gu({ level: t, selection: e.selection, notice: e.notice, commit: (i) => e.commit(i) });
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (i) => e.commit(i),
    setNotice: (i) => {
      e.notice = i;
    }
  };
  return e.mode === "equipment" ? Md({ ...n, toolId: e.toolId, nextProps: e.nextProps, setNextProps: (i) => {
    e.nextProps = i;
  } }) : zd({
    ...n,
    tool: e.toolId,
    boxMeasure: e.boxMeasure,
    wallType: e.wallType,
    thickness: e.thickness,
    next: e.nextObj,
    setNext: (i) => {
      e.nextObj = i;
    },
    setWallType: (i) => e.setWallType(i),
    setThickness: (i) => {
      e.thickness = i;
    },
    setBoxMeasure: (i) => {
      e.boxMeasure = i;
    }
  });
}
function vu(e) {
  return b`
    <div class="status">
      ${e.binding ? $ : b`
        <span><span class="kbd">Shift</span> ${p("hint.shift")}</span>
        <span><span class="kbd">${p("hint.digits")}</span> ${p("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${p("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${p(e.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${e.snap ? b`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${p("status.grid")}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${p("status.cones")}
      </label>
    </div>`;
}
function $u(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: p(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: p("unit.mm")
    },
    {
      label: p(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? p("unit.mm") : "°"
    }
  ];
  return E`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((a, l) => E`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${n.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${a.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? n.text : n.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function wu(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: d } = s[0], f = Math.hypot(d.x - l.x, d.y - l.y);
    let c = Math.atan2(-(d.y - l.y), d.x - l.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: Ot(f), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Ot(r), second: Ot(a) };
}
function xu(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const ku = vs`
  :host { display: block; height: 100%; outline: none; }
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
    display: grid; grid-template-columns: 64px 240px 1fr; grid-template-rows: auto 1fr 30px;
    height: 100vh; overflow: hidden; position: relative;
    background: var(--ch-bg); color: var(--ch-text);
    font-size: 14px; font-family: var(--ha-font-family-body, Roboto, "Noto Sans", system-ui, sans-serif);
  }
  .ed.binding { grid-template-columns: 250px 300px 1fr; }
  .ed.binding.rail-off { grid-template-columns: 36px 300px 1fr; }
  .ed.zones { grid-template-columns: 230px 280px 1fr; }
  @media (max-width: 700px) {
    .ed { grid-template-columns: 54px 170px 1fr; }
    .ed.binding, .ed.zones { grid-template-columns: 170px 200px 1fr; }
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
  .steps { display: grid; grid-template-columns: minmax(150px, 1.2fr) repeat(5, minmax(100px, 1fr)) auto;
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
    .steps { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .steps .title, .steps .nav { grid-column: 1 / -1; border-right: 0; }
    .steps .title { border-bottom: 1px solid var(--ch-divider); }
    .steps .nav { border-top: 1px solid var(--ch-divider); }
    .step { padding: 6px 10px; }
  }

  /* Left rail: tools, the binding device list, or the Zones tools above the zone list. */
  .tools { background: var(--ch-card); border-right: 1px solid var(--ch-divider); display: flex;
    flex-direction: column; align-items: center; gap: 4px; padding-top: 8px; }
  .tool { width: 54px; height: 40px; border-radius: 8px; border: 0; background: transparent; font-size: 11px;
    color: var(--ch-muted); line-height: 1.1; padding: 0 2px; }
  .tool:hover { background: var(--ch-hover); color: var(--ch-text); }
  .tool.on { background: var(--ch-tint); color: var(--ch-primary); font-weight: 500; }
  .tool-sep { height: 1px; width: 36px; background: var(--ch-divider); margin: 4px 0; }
  .blist, .zlist { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--ch-card);
    border-right: 1px solid var(--ch-divider); }
  .ztools { display: flex; gap: 4px; padding: 8px 8px 0; }
  .ztools .tool { flex: 1; width: auto; }
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
  .brow .kind, .zrow .kind, .member .kind { display: block; color: var(--ch-muted); font-size: 12px; }
  .brow .cnt, .zrow .zcount { color: var(--ch-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
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
  /* Zones properties: the member list with its Participates column. */
  .zmembers { margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--ch-divider); }
  .zhead { display: flex; justify-content: space-between; gap: 8px; color: var(--ch-muted); font-size: 12px; }
  .member { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; cursor: pointer; }
  .member .nm { min-width: 0; }
  .member input[type="checkbox"] { margin: 0; }
  .bfoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 18px;
    padding-top: 10px; border-top: 1px solid var(--ch-divider); color: var(--ch-muted); }

  /* Status bar and dialogs. */
  .status { grid-column: 1 / 4; background: var(--ch-card); border-top: 1px solid var(--ch-divider); display: flex;
    gap: 18px; align-items: center; padding: 0 10px; font-size: 12px; color: var(--ch-muted); white-space: nowrap;
    overflow: hidden; }
  .kbd { border: 1px solid var(--ch-divider); border-radius: 3px; padding: 0 4px; color: var(--ch-text); }
  .grid-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; }
  .backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); display: flex; align-items: center;
    justify-content: center; z-index: 10; }
  .dialog { background: var(--ch-card); border: 1px solid var(--ch-divider); border-radius: var(--ch-radius); padding: 18px 20px;
    max-width: 420px; box-shadow: 0 8px 28px rgba(0, 0, 0, .35); }
  .dialog h3 { margin: 0 0 8px; font-weight: 500; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
`, _u = 5e-3, Su = 2, On = (e) => Math.max(_u, Math.min(Su, e));
function Eu(e, t, n) {
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
function Mu(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: On(Math.min(t, n) / 12e3) };
  const i = e.map((c) => c.x), s = e.map((c) => c.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, d = Math.max(...s) + o, f = On(Math.min(t / (a - r), n / (d - l)));
  return { x: (r + a) / 2 - t / f / 2, y: (l + d) / 2 - n / f / 2, scale: f };
}
function Au(e, t, n) {
  const i = On(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function Iu(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function ps(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function Pu(e, t, n, i) {
  const s = 100 * e.scale >= 6 ? 100 : 1e3, o = 1 / e.scale;
  return E`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${o}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${o}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Ou = ["Shift", "Control", "Alt", "Meta"], zu = { plan: "select", equipment: "device-select", zones: "zones-select" };
function gs(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class Cu {
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
        this.h.view = Iu(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.pointerActive && (this.pointerActive = !1, this.h.activeTool.preview().level && this.h.activeTool.cancel(), this.h.requestUpdate());
    }, this.wheel = (n) => {
      n.preventDefault(), this.h.view = Au(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (gs(n) || !this.h.history) return;
      const i = n.ctrlKey || n.metaKey, s = n.code === "KeyZ" ? "z" : n.code === "KeyY" ? "y" : n.code === "KeyS" ? "s" : n.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        n.preventDefault(), s === "z" && !n.shiftKey ? this.h.undo() : this.h.redo();
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
      let o = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!o && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (o = this.h.deleteSelection()), !o && n.key === "Escape") {
        const r = zu[this.h.mode];
        r && this.h.toolId !== r ? this.h.pickTool(r) : (this.h.activeTool.cancel(), this.h.selection = null), o = !0;
      }
      o && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || gs(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !Ou.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function er(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function Nu(e) {
  return b`
    <div class="draft-banner" role="status">
      <span>${p("draft.banner").replace("{time}", er(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${p("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${p("draft.discard")}</button>
    </div>`;
}
function se(e, t, n, i) {
  return b`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? b`<p class="muted">${i}</p>` : $}
        <div class="actions">
          ${n.map((s) => b`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Lu(e) {
  var n;
  const t = { action: "cancel", label: p("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? se(p("draft.title"), p("draft.text").replace("{time}", er(i.savedAt)), [
        { action: "restore", label: p("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: p("draft.discard"), onClick: () => e.discard(i) }
      ]) : $;
    }
    case "new":
      return se(p("new.title"), p("new.text"), [
        { action: "new-discard", label: p("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return se(p("delete.title"), p("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: p("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return se(p("switch.title"), p("switch.text"), [
        { action: "switch-discard", label: p("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return se(p("conflict.title"), p(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: p("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: p("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return $;
  }
}
const oe = "plan_studio.draft.", _e = "plan_studio.lastPlanId";
function Tu() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Du(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class Ru {
  constructor(t = Tu, n = 500) {
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
      (n = this.storage()) == null || n.setItem(oe + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(oe + t), s = i ? JSON.parse(i) : null;
      return Du(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(oe))) continue;
        const o = this.read(s.slice(oe.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(_e)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(_e, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(_e)) === t && n.removeItem(_e);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(oe + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Bu = 5e3, Fu = 12, Uu = 3e3;
function ms(e) {
  e().catch(() => {
  });
}
class Hu {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.flashes = /* @__PURE__ */ new Map(), this.onDisconnected = () => {
      this.cancelRetry(), this.clearFlashes(), this.drop(!1), this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.host.requestUpdate();
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
  /** The intent the container's badge shows now (for FLASH_MS after it arrived), else null. */
  flash(t) {
    var n;
    return ((n = this.flashes.get(t)) == null ? void 0 : n.intent) ?? null;
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
   * Ends the subscription (also one still being set up), cancels the retries and the flashes, stops listening to the
   * connection and forgets the states; any plan can be watched again.
   */
  stop() {
    this.unlisten(), this.cancelRetry(), this.clearFlashes(), this.retries = 0, this.drop(!0), this.planId = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null;
  }
  start() {
    var n, i;
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(p("output.noLive"));
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
    this.sub = null, n && (n.live = !1, t && n.unsub && ms(n.unsub));
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
          ms(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(It(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Fu || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Bu));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(t) {
    var i, s;
    const n = Object.entries(t.containers ?? {});
    if (t.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [o, r] of n) {
        const a = (s = (i = this.map.get(o)) == null ? void 0 : i.last) == null ? void 0 : s.at;
        this.map.set(o, r), r.last && r.last.at !== a && this.startFlash(o, r.last);
      }
    this.host.requestUpdate();
  }
  /** Shows `last` on the container's badge for FLASH_MS, replacing (and restarting) any intent shown there. */
  startFlash(t, n) {
    const i = this.flashes.get(t);
    i && clearTimeout(i.timer);
    const s = setTimeout(() => {
      this.flashes.delete(t), this.host.requestUpdate();
    }, Uu), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
    this.flashes.set(t, { intent: o, timer: s });
  }
  clearFlashes() {
    for (const t of this.flashes.values()) clearTimeout(t.timer);
    this.flashes.clear();
  }
  setFailure(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
var ju = Object.defineProperty, D = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && ju(t, n, s), s;
};
const ri = class ri extends Ut {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Nr.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = yd(), this.nextObj = ld(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new Ru(), this.resizeObs = null, this.session = new fd(this), this.haMeta = new pd(this), this.feed = new Hu(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Ar(i, (s) => {
      var o;
      return Oo(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new El(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = gd(this), this.activeTool = An("select", this.ctx), this.input = new Cu(this);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((t = this.plan) == null ? void 0 : t.id) ?? null);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null, this.feed.stop();
  }
  willUpdate(t) {
    var n;
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load(), this.needFit && this.size.w > 0 && this.size.h > 0 && (this.needFit = !1, this.fit()), this.feed.watch(this.isConnected ? ((n = this.plan) == null ? void 0 : n.id) ?? null : null);
  }
  updated() {
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((n) => {
      const i = n[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  // ---- editing ----
  commit(t) {
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !un(t, this.selection) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null), this.requestUpdate());
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Zones step deletes an automation zone only, and no other step deletes one.
   */
  deleteSelection() {
    var i;
    const t = this.selection, n = (i = this.history) == null ? void 0 : i.current;
    return this.mode === "binding" || !t || !n || t.kind === "node" || !un(n, t) || this.mode === "zones" != (t.kind === "automationZone") ? !1 : (this.commit(t.kind === "wall" ? Yn(n, t.id) : t.kind === "opening" ? Qs(n, t.id) : t.kind === "device" ? eo(n, t.id) : t.kind === "automationZone" ? xo(n, t.id) : Zs(n, t.id)), !0);
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
    var s;
    this.activeTool.cancel(), t() && this.save.markDirty();
    const n = this.selection, i = (s = this.history) == null ? void 0 : s.current;
    this.selection = this.mode === "binding" && n && i && un(i, n) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = An(t, this.ctx);
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(ii(t)[0]), t === "binding" && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    var o;
    const n = (o = this.history) == null ? void 0 : o.current, i = n == null ? void 0 : n.devices.find((r) => r.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = Q(n, i);
    s && (this.view = ps(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects an automation zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(t) {
    var s;
    const n = (s = this.history) == null ? void 0 : s.current, i = n ? U(n).find((o) => o.id === t) : void 0;
    !n || !i || (this.ctx.select({ kind: "automationZone", id: t }), this.view = ps(this.view, mo(St(n, i)), this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i, s;
    const t = (i = this.history) == null ? void 0 : i.current, n = t ? sd(t, ((s = this.selection) == null ? void 0 : s.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return Eu(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = Mu(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return Lu({
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
    var f, c, u;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${p("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${p("action.retry")}</button>` : p("load.loading")}</div>`;
    const t = $c(!!((c = (f = this.hass) == null ? void 0 : f.themes) != null && c.darkMode)), n = this.history.current, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, d = this.save;
    return b`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : this.mode === "zones" ? " zones" : ""}"
        style=${xu(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Xc({
      steps: ed({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        planName: this.plan.name,
        onRename: (h) => {
          this.plan = { ...this.plan, name: h }, d.markDirty();
        },
        onMode: (h) => this.setMode(h)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: d.state,
      dirty: d.dirty,
      errorMessage: d.errorMessage,
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (h) => this.session.pickPlan(h),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${mu(this, n)}
        ${bu(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(h) => h.preventDefault()}>
            ${this.grid ? Pu(this.view, a, l, t) : $}
            ${yc(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (h) => this.feed.stateOf(h),
      containerFlash: (h) => this.feed.flash(h.id)
    })}
            ${i.tracker ? $u(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: wu(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${this.pendingDraft && ((u = this.dialog) == null ? void 0 : u.kind) !== "restore" ? Nu({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${vu({
      grid: this.grid,
      zoomPct: Math.round(r * 1e3),
      snap: i.snap && i.snap.kind !== "none" ? p(`snap.${i.snap.kind}`) : null,
      onGrid: (h) => {
        this.grid = h;
      },
      cones: this.cones,
      onCones: (h) => {
        this.cones = h;
      },
      binding: this.mode === "binding"
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
ri.styles = ku;
let L = ri;
D([
  pt({ attribute: !1 })
], L.prototype, "hass");
D([
  pt({ type: Boolean })
], L.prototype, "narrow");
D([
  pt({ attribute: !1 })
], L.prototype, "panel");
D([
  T()
], L.prototype, "plan");
D([
  T()
], L.prototype, "loadError");
D([
  T()
], L.prototype, "selection");
D([
  T()
], L.prototype, "toolId");
D([
  T()
], L.prototype, "wallType");
D([
  T()
], L.prototype, "thickness");
D([
  T()
], L.prototype, "boxMeasure");
D([
  T()
], L.prototype, "grid");
D([
  T()
], L.prototype, "mode");
D([
  T()
], L.prototype, "bindFilter");
D([
  T()
], L.prototype, "bindQuery");
D([
  T()
], L.prototype, "railCollapsed");
D([
  T()
], L.prototype, "showAll");
D([
  T()
], L.prototype, "zoneQuery");
D([
  T()
], L.prototype, "cones");
D([
  T()
], L.prototype, "nextProps");
D([
  T()
], L.prototype, "nextObj");
D([
  T()
], L.prototype, "view");
D([
  T()
], L.prototype, "size");
D([
  T()
], L.prototype, "dialog");
D([
  T()
], L.prototype, "notice");
D([
  T()
], L.prototype, "fieldNotice");
D([
  T()
], L.prototype, "pendingDraft");
D([
  T()
], L.prototype, "plans");
D([
  T()
], L.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", L);
export {
  L as PlanStudioPanel
};
