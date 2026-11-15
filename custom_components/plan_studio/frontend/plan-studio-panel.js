/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = globalThis, yn = me.ShadowRoot && (me.ShadyCSS === void 0 || me.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vn = Symbol(), jn = /* @__PURE__ */ new WeakMap();
let Zi = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== vn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (yn && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = jn.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && jn.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xo = (e) => new Zi(typeof e == "string" ? e : e + "", void 0, vn), Xi = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new Zi(n, e, vn);
}, ko = (e, t) => {
  if (yn) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = me.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, qn = yn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return xo(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _o, defineProperty: So, getOwnPropertyDescriptor: Eo, getOwnPropertyNames: Mo, getOwnPropertySymbols: Ao, getPrototypeOf: Io } = Object, bt = globalThis, Wn = bt.trustedTypes, Po = Wn ? Wn.emptyScript : "", He = bt.reactiveElementPolyfillSupport, Jt = (e, t) => e, ve = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Po : null;
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
} }, $n = (e, t) => !_o(e, t), Vn = { attribute: !0, type: String, converter: ve, reflect: !1, useDefault: !1, hasChanged: $n };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), bt.litPropertyMetadata ?? (bt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Nt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Vn) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && So(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Eo(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Vn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Jt("elementProperties"))) return;
    const t = Io(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Jt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Jt("properties"))) {
      const n = this.properties, i = [...Mo(n), ...Ao(n)];
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
      for (const s of i) n.unshift(qn(s));
    } else t !== void 0 && n.push(qn(t));
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
    return ko(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : ve).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : ve;
      this._$Em = s;
      const c = l.fromAttribute(n, a.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? $n)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
Nt.elementStyles = [], Nt.shadowRootOptions = { mode: "open" }, Nt[Jt("elementProperties")] = /* @__PURE__ */ new Map(), Nt[Jt("finalized")] = /* @__PURE__ */ new Map(), He == null || He({ ReactiveElement: Nt }), (bt.reactiveElementVersions ?? (bt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis, Kn = (e) => e, $e = te.trustedTypes, Gn = $e ? $e.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Qi = "$lit$", ft = `lit$${Math.random().toFixed(9).slice(2)}$`, Ji = "?" + ft, Oo = `<${Ji}>`, It = document, ie = () => It.createComment(""), se = (e) => e === null || typeof e != "object" && typeof e != "function", wn = Array.isArray, No = (e) => wn(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", je = `[ 	
\f\r]`, Kt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Yn = /-->/g, Zn = />/g, kt = RegExp(`>|${je}(?:([^\\s"'>=/]+)(${je}*=${je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xn = /'/g, Qn = /"/g, ts = /^(?:script|style|textarea|title)$/i, es = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), b = es(1), M = es(2), et = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), Jn = /* @__PURE__ */ new WeakMap(), _t = It.createTreeWalker(It, 129);
function ns(e, t) {
  if (!wn(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Gn !== void 0 ? Gn.createHTML(t) : t;
}
const Co = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = Kt;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let c, p, d = -1, u = 0;
    for (; u < l.length && (r.lastIndex = u, p = r.exec(l), p !== null); ) u = r.lastIndex, r === Kt ? p[1] === "!--" ? r = Yn : p[1] !== void 0 ? r = Zn : p[2] !== void 0 ? (ts.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = kt) : p[3] !== void 0 && (r = kt) : r === kt ? p[0] === ">" ? (r = s ?? Kt, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, c = p[1], r = p[3] === void 0 ? kt : p[3] === '"' ? Qn : Xn) : r === Qn || r === Xn ? r = kt : r === Yn || r === Zn ? r = Kt : (r = kt, s = void 0);
    const h = r === kt && e[a + 1].startsWith("/>") ? " " : "";
    o += r === Kt ? l + Oo : d >= 0 ? (i.push(c), l.slice(0, d) + Qi + l.slice(d) + ft + h) : l + ft + (d === -2 ? a : h);
  }
  return [ns(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class oe {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, p] = Co(t, n);
    if (this.el = oe.createElement(c, i), _t.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = _t.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Qi)) {
          const u = p[r++], h = s.getAttribute(d).split(ft), m = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? To : m[1] === "?" ? Do : m[1] === "@" ? Ro : Ie }), s.removeAttribute(d);
        } else d.startsWith(ft) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (ts.test(s.tagName)) {
          const d = s.textContent.split(ft), u = d.length - 1;
          if (u > 0) {
            s.textContent = $e ? $e.emptyScript : "";
            for (let h = 0; h < u; h++) s.append(d[h], ie()), _t.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[u], ie());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ji) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(ft, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += ft.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = It.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Dt(e, t, n = e, i) {
  var r, a;
  if (t === et) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = se(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Dt(e, s._$AS(e, t.values), s, i)), t;
}
class Lo {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? It).importNode(n, !0);
    _t.currentNode = s;
    let o = _t.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new xn(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new zo(o, this, t)), this._$AV.push(c), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = _t.nextNode(), r++);
    }
    return _t.currentNode = It, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let xn = class is {
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
    t = Dt(this, t, n), se(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== et && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : No(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && se(this._$AH) ? this._$AA.nextSibling.data = t : this.T(It.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = oe.createElement(ns(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Lo(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = Jn.get(t.strings);
    return n === void 0 && Jn.set(t.strings, n = new oe(t)), n;
  }
  k(t) {
    wn(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new is(this.O(ie()), this.O(ie()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = Kn(t).nextSibling;
      Kn(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class Ie {
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
    if (o === void 0) t = Dt(this, t, n, 0), r = !se(t) || t !== this._$AH && t !== et, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = Dt(this, a[i + l], n, l), c === et && (c = this._$AH[l]), r || (r = !se(c) || c !== this._$AH[l]), c === $ ? t = $ : t !== $ && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class To extends Ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Do extends Ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
let Ro = class extends Ie {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Dt(this, t, n, 0) ?? $) === et) return;
    const i = this._$AH, s = t === $ && i !== $ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== $ && (i === $ || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class zo {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Dt(this, t);
  }
}
const qe = te.litHtmlPolyfillSupport;
qe == null || qe(oe, xn), (te.litHtmlVersions ?? (te.litHtmlVersions = [])).push("3.3.3");
const Uo = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new xn(t.insertBefore(ie(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = globalThis;
let Tt = class extends Nt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Uo(n, this.renderRoot, this.renderOptions);
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
    return et;
  }
};
var Yi;
Tt._$litElement$ = !0, Tt.finalized = !0, (Yi = Mt.litElementHydrateSupport) == null || Yi.call(Mt, { LitElement: Tt });
const We = Mt.litElementPolyfillSupport;
We == null || We({ LitElement: Tt });
(Mt.litElementVersions ?? (Mt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fo = { attribute: !0, type: String, converter: ve, reflect: !1, hasChanged: $n }, Bo = (e = Fo, t, n) => {
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
function ut(e) {
  return (t, n) => typeof n == "object" ? Bo(e, t, n) : ((i, s, o) => {
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
  return ut({ ...e, state: !0, attribute: !1 });
}
function X() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function ss(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const ti = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Ho = ["on", "off", "auto"], kn = (e) => Ho.includes(e), Ve = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), jo = {
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
  smart_button: [
    Ve("on"),
    Ve("off"),
    Ve("auto"),
    { role: "final", domains: ["light", "switch"], primary: !1 }
  ],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, ti],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, ti]
}, _n = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, qo = { climate_sensor: "any" };
function Bt(e) {
  const t = e.props, n = jo[t.kind];
  return t.kind !== "smart_button" ? n : n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : i === "final" ? !t.separateOff && t.autoEnabled : !0);
}
function os(e) {
  return new Set(Bt(e).map((t) => t.role));
}
function rs(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !os(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const c = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete c.bindings, { ...e, devices: e.devices.map((p) => p === s ? c : p) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function Wo(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = Bt(e).filter((a) => a.primary), o = s.filter((a) => !!n[a.role]);
  return (qo[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Vo(e) {
  const t = Bt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const Ko = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function on(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !kn(t) ? n : `${n}|${Ko(i[t])}`;
}
function Go(e, t, n) {
  const i = on(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && Bt(s).some((o) => on(s, o.role) === i));
}
function Yo(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Bt(e)) {
    const s = kn(i) ? on(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function Sn(e) {
  if (!e.bindings) return e;
  const t = os(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const de = (e) => e === "wall_switch" || e === "smart_button", Zo = [100, 125, 150], En = "mdi:cube-outline", ei = ["single", "double", "hold"];
function as(e) {
  const t = e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled : null;
  return t === null ? [] : t ? ["off", "on", "auto", "error"] : ["off", "on", "error"];
}
function ls(e) {
  return e.kind !== "wall_switch" && e.kind !== "smart_button" || as(e).includes(e.defaultOutput) ? e : { ...e, defaultOutput: "off" };
}
const Xo = {
  bearing: 400
}, be = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function cs(e = X(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function ni(e) {
  return {
    id: X(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [cs()]
  };
}
const Mn = {
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
}, Rt = 90, ds = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Pt(e, t) {
  switch (e) {
    case "ceiling_light":
      return { kind: e, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: e, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: e, zoneAngle: t === "free" ? 360 : 110, zoneRange: 5e3 };
    case "climate_sensor":
      return { kind: e, zoneIds: [] };
    case "exhaust_fan":
      return { kind: e, diameter: 100 };
    case "equipment":
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: En, label: "" };
    case "wall_switch":
      return { kind: e, autoByDoubleToggle: !1, windowSec: 3, defaultOutput: "off" };
    case "smart_button":
      return {
        kind: e,
        separateOff: !1,
        autoEnabled: !1,
        on: { slot: 0, event: "single" },
        off: { slot: 0, event: "hold" },
        auto: { slot: 0, event: "double" },
        defaultOutput: "off"
      };
    default:
      return { kind: e };
  }
}
const Qo = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: En
};
function Jo(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : Qo[String(n)] ?? En;
  return { ...e, props: { ...i, icon: s } };
}
function tr(e) {
  var n;
  if (e.props.kind !== "switch") return e;
  const t = (n = e.bindings) == null ? void 0 : n.action;
  return t ? { ...e, props: Pt("smart_button", e.placement.mode), bindings: { on: t } } : { ...e, props: Pt("wall_switch", e.placement.mode) };
}
const us = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function er(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = us(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function nr(e) {
  const t = e.props.kind;
  if (!de(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(Pt(t, e.placement.mode))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? er(r, o) : s === "windowSec" ? us(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function ir(e) {
  const t = ls(e.props);
  return t === e.props ? e : { ...e, props: t };
}
function sr(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => Sn(ir(nr(tr(Jo(n))))));
  return t.some((n, i) => n !== e.devices[i]) ? { ...e, devices: t } : e;
}
function P(e, t) {
  return { x: e.x + t.x, y: e.y + t.y };
}
function A(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function E(e, t) {
  return { x: e.x * t, y: e.y * t };
}
function F(e, t) {
  return e.x * t.x + e.y * t.y;
}
function nt(e, t) {
  return e.x * t.y - e.y * t.x;
}
function hs(e) {
  return Math.hypot(e.x, e.y);
}
function L(e, t) {
  return hs(A(t, e));
}
function Pe(e) {
  const t = hs(e);
  return t === 0 ? { x: 0, y: 0 } : E(e, 1 / t);
}
function Z(e) {
  return { x: e.y, y: -e.x };
}
function or(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function lt(e, t, n, i) {
  const s = nt(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = nt(A(n, e), i) / s;
  return P(e, E(t, o));
}
function An(e, t, n) {
  const i = A(n, t), s = F(i, i);
  return s === 0 ? 0 : F(A(e, t), i) / s;
}
function ue(e, t) {
  let n = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > e.y != r.y > e.y && e.x < (r.x - o.x) * (e.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function zt(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const i = e[n], s = e[(n + 1) % e.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
let $t = class {
  constructor(t, n) {
    this.next = null, this.key = t, this.data = n, this.left = null, this.right = null;
  }
};
function rr(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function gt(e, t, n) {
  const i = new $t(null, null);
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
function Ke(e, t, n, i) {
  const s = new $t(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = gt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function ii(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = gt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function ar(e, t, n) {
  return t === null ? e : (e === null || (t = gt(e.key, t, n), t.left = e), t);
}
function rn(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && rn(e.left, o, !1, i, s), e.right && rn(e.right, o, !0, i, s);
  }
}
class In {
  constructor(t = rr) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = Ke(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new $t(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = gt(t, this._root, s), r = s(t, o.key);
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
    return n === null ? null : (n = gt(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = gt(t, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = gt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = gt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    return cr(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && cn(t, n, 0, s - 1, o), this._root === null)
      this._root = an(t, n, 0, s), this._size = s;
    else {
      const r = dr(
        this.toList(),
        lr(t, n),
        o
      );
      s = this._size + s, this._root = ln({ head: r }, 0, s);
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
    return rn(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = ii(t, this._root, s);
    s(t, n) < 0 ? r = Ke(n, i, r, s) : o = Ke(n, i, o, s), this._root = ar(o, r, s);
  }
  split(t) {
    return ii(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function an(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], a = t[o], l = new $t(r, a);
    return l.left = an(e, t, n, o), l.right = an(e, t, o + 1, i), l;
  }
  return null;
}
function lr(e, t) {
  const n = new $t(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new $t(e[s], t[s]);
  return i.next = null, n.next;
}
function cr(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new $t(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function ln(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = ln(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = ln(e, s + 1, n), r;
  }
  return null;
}
function dr(e, t, n) {
  const i = new $t(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function cn(e, t, n, i, s) {
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
  cn(e, t, n, a, s), cn(e, t, a + 1, i, s);
}
const ct = 11102230246251565e-32, W = 134217729, ur = (3 + 8 * ct) * ct;
function Ge(e, t, n, i, s) {
  let o, r, a, l, c = t[0], p = i[0], d = 0, u = 0;
  p > c == p > -c ? (o = c, c = t[++d]) : (o = p, p = i[++u]);
  let h = 0;
  if (d < e && u < n)
    for (p > c == p > -c ? (r = c + o, a = o - (r - c), c = t[++d]) : (r = p + o, a = o - (r - p), p = i[++u]), o = r, a !== 0 && (s[h++] = a); d < e && u < n; )
      p > c == p > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d]) : (r = o + p, l = r - o, a = o - (r - l) + (p - l), p = i[++u]), o = r, a !== 0 && (s[h++] = a);
  for (; d < e; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d], o = r, a !== 0 && (s[h++] = a);
  for (; u < n; )
    r = o + p, l = r - o, a = o - (r - l) + (p - l), p = i[++u], o = r, a !== 0 && (s[h++] = a);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function hr(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function w(e) {
  return new Float64Array(e);
}
const pr = (3 + 16 * ct) * ct, fr = (2 + 12 * ct) * ct, gr = (9 + 64 * ct) * ct * ct, Ot = w(4), si = w(8), oi = w(12), ri = w(16), V = w(4);
function mr(e, t, n, i, s, o, r) {
  let a, l, c, p, d, u, h, m, y, v, g, x, S, _, k, I, N, C;
  const D = e - s, B = n - s, q = t - o, Y = i - o;
  _ = D * Y, u = W * D, h = u - (u - D), m = D - h, u = W * Y, y = u - (u - Y), v = Y - y, k = m * v - (_ - h * y - m * y - h * v), I = q * B, u = W * q, h = u - (u - q), m = q - h, u = W * B, y = u - (u - B), v = B - y, N = m * v - (I - h * y - m * y - h * v), g = k - N, d = k - g, Ot[0] = k - (g + d) + (d - N), x = _ + g, d = x - _, S = _ - (x - d) + (g - d), g = S - I, d = S - g, Ot[1] = S - (g + d) + (d - I), C = x + g, d = C - x, Ot[2] = x - (C - d) + (g - d), Ot[3] = C;
  let at = hr(4, Ot), Vt = fr * r;
  if (at >= Vt || -at >= Vt || (d = e - D, a = e - (D + d) + (d - s), d = n - B, c = n - (B + d) + (d - s), d = t - q, l = t - (q + d) + (d - o), d = i - Y, p = i - (Y + d) + (d - o), a === 0 && l === 0 && c === 0 && p === 0) || (Vt = gr * r + ur * Math.abs(at), at += D * p + Y * a - (q * c + B * l), at >= Vt || -at >= Vt)) return at;
  _ = a * Y, u = W * a, h = u - (u - a), m = a - h, u = W * Y, y = u - (u - Y), v = Y - y, k = m * v - (_ - h * y - m * y - h * v), I = l * B, u = W * l, h = u - (u - l), m = l - h, u = W * B, y = u - (u - B), v = B - y, N = m * v - (I - h * y - m * y - h * v), g = k - N, d = k - g, V[0] = k - (g + d) + (d - N), x = _ + g, d = x - _, S = _ - (x - d) + (g - d), g = S - I, d = S - g, V[1] = S - (g + d) + (d - I), C = x + g, d = C - x, V[2] = x - (C - d) + (g - d), V[3] = C;
  const vo = Ge(4, Ot, 4, V, si);
  _ = D * p, u = W * D, h = u - (u - D), m = D - h, u = W * p, y = u - (u - p), v = p - y, k = m * v - (_ - h * y - m * y - h * v), I = q * c, u = W * q, h = u - (u - q), m = q - h, u = W * c, y = u - (u - c), v = c - y, N = m * v - (I - h * y - m * y - h * v), g = k - N, d = k - g, V[0] = k - (g + d) + (d - N), x = _ + g, d = x - _, S = _ - (x - d) + (g - d), g = S - I, d = S - g, V[1] = S - (g + d) + (d - I), C = x + g, d = C - x, V[2] = x - (C - d) + (g - d), V[3] = C;
  const $o = Ge(vo, si, 4, V, oi);
  _ = a * p, u = W * a, h = u - (u - a), m = a - h, u = W * p, y = u - (u - p), v = p - y, k = m * v - (_ - h * y - m * y - h * v), I = l * c, u = W * l, h = u - (u - l), m = l - h, u = W * c, y = u - (u - c), v = c - y, N = m * v - (I - h * y - m * y - h * v), g = k - N, d = k - g, V[0] = k - (g + d) + (d - N), x = _ + g, d = x - _, S = _ - (x - d) + (g - d), g = S - I, d = S - g, V[1] = S - (g + d) + (d - I), C = x + g, d = C - x, V[2] = x - (C - d) + (g - d), V[3] = C;
  const wo = Ge($o, oi, 4, V, ri);
  return ri[wo - 1];
}
function br(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= pr * c ? l : -mr(e, t, n, i, s, o, c);
}
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(8);
w(8);
w(8);
w(4);
w(8);
w(8);
w(16);
w(12);
w(192);
w(192);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(8);
w(8);
w(8);
w(8);
w(8);
w(8);
w(8);
w(8);
w(8);
w(4);
w(4);
w(4);
w(8);
w(16);
w(16);
w(16);
w(32);
w(32);
w(48);
w(64);
w(1152);
w(1152);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(4);
w(24);
w(24);
w(24);
w(24);
w(24);
w(24);
w(24);
w(24);
w(24);
w(24);
w(1152);
w(1152);
w(1152);
w(1152);
w(1152);
w(2304);
w(2304);
w(3456);
w(5760);
w(8);
w(8);
w(8);
w(16);
w(24);
w(48);
w(48);
w(96);
w(192);
w(384);
w(384);
w(384);
w(768);
w(96);
w(96);
w(96);
w(1152);
const Gt = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, dn = (e, t) => {
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
let mt = Number.EPSILON;
mt === void 0 && (mt = Math.pow(2, -52));
const yr = mt * mt, ai = (e, t) => {
  if (-mt < e && e < mt && -mt < t && t < mt)
    return 0;
  const n = e - t;
  return n * n < yr * e * t ? 0 : e < t ? -1 : 1;
};
class vr {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new li(), this.yRounder = new li();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class li {
  constructor() {
    this.tree = new In(), this.round(0);
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
    if (i !== null && ai(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && ai(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const re = new vr(), ye = (e, t) => e.x * t.y - e.y * t.x, ps = (e, t) => e.x * t.x + e.y * t.y, ci = (e, t, n) => {
  const i = br(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, we = (e) => Math.sqrt(ps(e, e)), $r = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return ye(s, i) / we(s) / we(i);
}, wr = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return ps(s, i) / we(s) / we(i);
}, di = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, ui = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, xr = (e, t, n, i) => {
  if (t.x === 0) return ui(n, i, e.x);
  if (i.x === 0) return ui(e, t, n.x);
  if (t.y === 0) return di(n, i, e.y);
  if (i.y === 0) return di(e, t, n.y);
  const s = ye(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = ye(o, t) / s, a = ye(o, i) / s, l = e.x + a * t.x, c = n.x + r * i.x, p = e.y + a * t.y, d = n.y + r * i.y, u = (l + c) / 2, h = (p + d) / 2;
  return {
    x: u,
    y: h
  };
};
class tt {
  // for ordering sweep events in the sweep event queue
  static compare(t, n) {
    const i = tt.comparePoints(t.point, n.point);
    return i !== 0 ? i : (t.point !== n.point && t.link(n), t.isLeft !== n.isLeft ? t.isLeft ? 1 : -1 : yt.compare(t.segment, n.segment));
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
        sine: $r(this.point, t.point, o.point),
        cosine: wr(this.point, t.point, o.point)
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
let kr = 0;
class yt {
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
    const a = t.leftSE.point.y, l = n.leftSE.point.y, c = t.rightSE.point.y, p = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < c) return 1;
      if (l > a && l > c) return -1;
      const d = t.comparePoint(n.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const u = n.comparePoint(t.rightSE.point);
      return u !== 0 ? u : -1;
    }
    if (i > s) {
      if (a < l && a < p) return -1;
      if (a > l && a > p) return 1;
      const d = n.comparePoint(t.leftSE.point);
      if (d !== 0) return d;
      const u = t.comparePoint(n.rightSE.point);
      return u < 0 ? 1 : u > 0 ? -1 : 1;
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
      const d = c - a, u = o - i, h = p - l, m = r - s;
      if (d > u && h < m) return 1;
      if (d < u && h > m) return -1;
    }
    return o > r ? 1 : o < r || c < p ? -1 : c > p ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++kr, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = tt.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new tt(s, !0), c = new tt(o, !1);
    return new yt(l, c, [i], [r]);
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
    const n = this.bbox(), i = t.bbox(), s = dn(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, c = Gt(n, a) && this.comparePoint(a) === 0, p = Gt(i, o) && t.comparePoint(o) === 0, d = Gt(n, l) && this.comparePoint(l) === 0, u = Gt(i, r) && t.comparePoint(r) === 0;
    if (p && c)
      return u && !d ? r : !u && d ? l : null;
    if (p)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return u && r.x === a.x && r.y === a.y ? null : a;
    if (u && d) return null;
    if (u) return r;
    if (d) return l;
    const h = xr(o, this.vector(), a, t.vector());
    return h === null || !Gt(s, h) ? null : re.round(h.x, h.y);
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
    const n = [], i = t.events !== void 0, s = new tt(t, !0), o = new tt(t, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new yt(s, r, this.rings.slice(), this.windings.slice());
    return tt.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), tt.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = yt.compare(n, i);
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
      const c = this.rings[a], p = this.windings[a], d = n.indexOf(c);
      d === -1 ? (n.push(c), i.push(p)) : i[d] += p;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const c = n[a], p = c.poly;
      if (r.indexOf(p) === -1)
        if (c.isExterior) o.push(p);
        else {
          r.indexOf(p) === -1 && r.push(p);
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
    switch (st.type) {
      case "union": {
        const i = t.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < n.length ? (i = t.length, s = n.length) : (i = n.length, s = t.length), this._isInResult = s === st.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${st.type}`);
    }
    return this._isInResult;
  }
}
class hi {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = re.round(t[0][0], t[0][1]);
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
      let l = re.round(t[r][0], t[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(yt.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(yt.fromRing(o, s, this));
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
class _r {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new hi(t[0], this, !0), this.bbox = {
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
      const o = new hi(t[i], this, !1);
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
class pi {
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
      const o = new _r(t[i], this);
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
class xe {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, a = o.leftSE, l = o.rightSE;
      const c = [a], p = a.point, d = [];
      for (; r = a, a = l, c.push(a), a.point !== p; )
        for (; ; ) {
          const u = a.getAvailableLinkedEvents();
          if (u.length === 0) {
            const y = c[0].point, v = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (u.length === 1) {
            l = u[0].otherSE;
            break;
          }
          let h = null;
          for (let y = 0, v = d.length; y < v; y++)
            if (d[y].point === a.point) {
              h = y;
              break;
            }
          if (h !== null) {
            const y = d.splice(h)[0], v = c.splice(y.index);
            v.unshift(v[0].otherSE), n.push(new xe(v.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: a.point
          });
          const m = a.getLeftmostComparator(r);
          l = u.sort(m)[0].otherSE;
          break;
        }
      n.push(new xe(c));
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
    for (let c = 1, p = this.events.length - 1; c < p; c++) {
      const d = this.events[c].point, u = this.events[c + 1].point;
      ci(d, t, u) !== 0 && (n.push(d), t = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    ci(i, t, s) === 0 && n.shift(), n.push(n[0]);
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
      tt.compare(t, r) > 0 && (t = r);
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
class fi {
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
class Sr {
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
        if (o.isExteriorRing()) n.push(new fi(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new fi(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Er {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : yt.compare;
    this.queue = t, this.tree = new In(n), this.segments = [];
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
          const u = this._splitSafely(a, d);
          for (let h = 0, m = u.length; h < m; h++)
            i.push(u[h]);
        }
      }
      let p = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (p = d), !l.isAnEndpoint(d))) {
          const u = this._splitSafely(l, d);
          for (let h = 0, m = u.length; h < m; h++)
            i.push(u[h]);
        }
      }
      if (c !== null || p !== null) {
        let d = null;
        c === null ? d = p : p === null ? d = c : d = tt.comparePoints(c, p) <= 0 ? c : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const u = n.split(d);
        for (let h = 0, m = u.length; h < m; h++)
          i.push(u[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const c = a.getIntersection(l);
        if (c !== null) {
          if (!a.isAnEndpoint(c)) {
            const p = this._splitSafely(a, c);
            for (let d = 0, u = p.length; d < u; d++)
              i.push(p[d]);
          }
          if (!l.isAnEndpoint(c)) {
            const p = this._splitSafely(l, c);
            for (let d = 0, u = p.length; d < u; d++)
              i.push(p[d]);
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
const gi = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Mr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Ar {
  run(t, n, i) {
    st.type = t, re.reset();
    const s = [new pi(n, !0)];
    for (let d = 0, u = i.length; d < u; d++)
      s.push(new pi(i[d], !1));
    if (st.numMultiPolys = s.length, st.type === "difference") {
      const d = s[0];
      let u = 1;
      for (; u < s.length; )
        dn(s[u].bbox, d.bbox) !== null ? u++ : s.splice(u, 1);
    }
    if (st.type === "intersection")
      for (let d = 0, u = s.length; d < u; d++) {
        const h = s[d];
        for (let m = d + 1, y = s.length; m < y; m++)
          if (dn(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new In(tt.compare);
    for (let d = 0, u = s.length; d < u; d++) {
      const h = s[d].getSweepEvents();
      for (let m = 0, y = h.length; m < y; m++)
        if (o.insert(h[m]), o.size > gi)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Er(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const h = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > gi)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Mr)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const u = r.process(d);
      for (let h = 0, m = u.length; h < m; h++) {
        const y = u[h];
        y.consumedBy === void 0 && o.insert(y);
      }
      a = o.size, l = o.pop();
    }
    re.reset();
    const c = xe.factory(r.segments);
    return new Sr(c).getGeom();
  }
}
const st = new Ar(), Ir = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("union", e, n);
}, Pr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("intersection", e, n);
}, Or = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("xor", e, n);
}, Nr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("difference", e, n);
};
var fs = {
  union: Ir,
  intersection: Pr,
  xor: Or,
  difference: Nr
};
const gs = 3, Cr = 1e-6;
function Oe(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function j(e, t) {
  const n = Oe(e, t);
  return { x: n.x, y: n.y };
}
function Ne(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function ms(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Pe(A(t, e)), len: L(e, t), leftOff: o, rightOff: r };
}
function it(e, t) {
  return ms(j(e, t.a), j(e, t.b), t.thickness, t.baseline);
}
function Ht(e, t) {
  const n = A(t, e.a);
  return { t: F(n, e.dir), side: F(n, Z(e.dir)) };
}
function mi(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Ct = (e) => P(e.p, E(Z(e.u), e.offL)), Lt = (e) => A(e.p, E(Z(e.u), e.offR));
function St(e, t, n) {
  return e !== null && L(e, t) <= n;
}
function Lr(e) {
  const t = [];
  for (const n of e.walls) {
    const i = it(e, n);
    if (i.len < 1e-9) continue;
    const s = Z(i.dir);
    t.push({
      wall: n,
      f: i,
      c: {
        al: P(i.a, E(s, i.leftOff)),
        ar: A(i.a, E(s, i.rightOff)),
        bl: P(i.b, E(s, i.leftOff)),
        br: A(i.b, E(s, i.rightOff))
      }
    });
  }
  return t;
}
function Tr(e, t) {
  const n = t.f, i = Z(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = F(A(s.far, n.a), i) >= 0 ? P(n.a, E(i, n.leftOff)) : A(n.a, E(i, n.rightOff)), a = gs * Math.max(s.body.wall.thickness, t.wall.thickness), l = lt(Ct(s), s.u, r, n.dir), c = lt(Lt(s), s.u, r, n.dir);
    St(l, s.p, a) && (s.body.c[s.leftKey] = l), St(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function Dr(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = gs * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = lt(Lt(o), o.u, Ct(r), r.u);
    St(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = Rr(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = A(r, o), l = nt(a, A(t, o)), c = nt(a, A(s.far, o));
    l * c < 0 && un(s, [t]);
  }
}
function un(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function Rr(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(nt(o.u, r.u)) > 1e-9 || F(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], c = lt(Lt(o), o.u, Ct(l), l.u), p = lt(Ct(r), r.u, Ct(l), l.u);
        if (!St(c, t, n) || !St(p, t, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = p, un(o, [t, d, p]);
      } else {
        const l = e[(s - 1 + i) % i], c = lt(Ct(r), r.u, Lt(l), l.u), p = lt(Lt(o), o.u, Lt(l), l.u);
        if (!St(p, t, n) || !St(c, t, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = p, r.body.c[r.leftKey] = c, un(r, [p, d, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function bs(e) {
  const t = Lr(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(mi(r, "a")), r.wall.b === i.id && s.push(mi(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Tr(s, o) : s.length >= 2 && Dr(s, { x: i.x, y: i.y });
  }
  return t;
}
function ys(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function Ce(e) {
  return new Map(bs(e).map((t) => [t.wall.id, ys(t)]));
}
function bi(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(P(s, E(A(o, s), r / (r - a))));
  }
  return n;
}
function Pn(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of bs(e)) {
    const s = ys(i), o = e.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && t(p)).sort((p, d) => p.offset - d.offset), r = (p) => F(A(p, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const p of o)
      a.push([l, p.offset]), l = Math.max(l, p.offset + p.width);
    a.push([l, 1 / 0]);
    const c = [];
    for (const [p, d] of a) {
      if (d <= p) continue;
      let u = s;
      p > -1 / 0 && (u = bi(u, (h) => r(h) - p)), d < 1 / 0 && (u = bi(u, (h) => d - r(h))), u.length >= 3 && Math.abs(zt(u)) > Cr && c.push(u);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const hn = (e) => [e.map((t) => [t.x, t.y])];
function vs(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function $s(e, t) {
  return ws(t ? [...Pn(e).values()].flat() : [...Ce(e).values()]);
}
function ws(e) {
  const t = e.map(hn);
  if (t.length === 0) return [];
  let n;
  try {
    n = fs.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(vs));
}
const ke = 1e-6;
function xs(e, t) {
  return Mn[e.kind].includes(t.mode);
}
function ks(e, t, n) {
  if (!xs(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Rt || i > Rt)) return !1;
  const s = Ne(e, n.wallId);
  return s !== null && n.offset >= -ke && n.offset <= s + ke;
}
function jt(e, t) {
  return { ...e, devices: t };
}
function yi(e, t, n, i) {
  if (!ks(e, t, n)) return { level: e, deviceId: null };
  const s = { id: X(), name: i, placement: n, props: t, invalid: !1 };
  return { level: jt(e, [...e.devices, s]), deviceId: s.id };
}
function _s(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = Pt("motion_sensor", t), s = Pt("motion_sensor", n);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function On(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !ks(e, s.props, n)) return e;
  const o = _s(s.props, s.placement.mode, n.mode);
  return Nn(jt(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function Le(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? jt(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = ls({ ...o.props, ...n, kind: o.props.kind });
    return Sn({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function zr(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !de(i.props.kind) || i.props.kind === n) return e;
  const s = Pt(n, i.placement.mode);
  if (!xs(s, i.placement)) return e;
  const o = Sn({ ...i, props: s });
  return jt(e, e.devices.map((r) => r === i ? o : r));
}
function Ss(e, t) {
  return jt(e, e.devices.filter((n) => n.id !== t));
}
function Ur(e, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const n = t.props.zoneIds.filter((i) => e.zones.some((s) => s.id === i));
  return n.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: n } };
}
function Nn(e) {
  return jt(e, e.devices.map((t) => {
    const n = Ur(e, t);
    if (n.placement.mode !== "wall") return n.invalid ? { ...n, invalid: !1 } : n;
    const i = Ne(e, n.placement.wallId), s = i === null || n.placement.offset < -ke || n.placement.offset > i + ke;
    return n.invalid === s ? n : { ...n, invalid: s };
  }));
}
function Es(e) {
  const t = [];
  for (const n of $s(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function pn(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!ue(t, s)) continue;
    const o = Math.abs(zt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
function Ms(e) {
  return Math.round(Math.abs(zt(e)) / 1e6 * 100) / 100;
}
const Ye = 1e-3;
function As(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(zt(e)) - Math.abs(zt(t))) > Ye ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= Ye && Math.abs(n.y - i.y) <= Ye));
}
function Fr(e, t, n) {
  const i = Es(e), s = pn(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const a = r.broken ? null : pn(i, r.seed);
    if (a && As(a, s)) return { level: e, zoneId: null };
  }
  const o = { id: X(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function Br(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function Is(e, t) {
  return Nn({ ...e, zones: e.zones.filter((n) => n.id !== t) });
}
function qt(e) {
  if (e.zones.length === 0) return e;
  const t = Es(e), n = [], i = e.zones.map((s) => {
    const o = pn(t, s.seed);
    return !o || n.some((r) => As(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const Ut = 1e-6, _e = ["door", "gate", "wicket"], Ps = (e) => e === "opening", Os = (e) => e.passesLight ?? Ps(e.kind);
function Ns(e, t) {
  return e.offset < t.offset + t.width - Ut && t.offset < e.offset + e.width - Ut;
}
function Te(e, t, n, i, s) {
  const o = Ne(e, t);
  return o === null || i <= 0 || n < -Ut || n + i > o + Ut ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Ns(r, { offset: n, width: i }));
}
function Wt(e, t) {
  return { ...e, openings: t };
}
function Hr(e, t, n, i, s, o = {}) {
  const r = s ?? be[n], a = i - r / 2;
  if (!Te(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: X(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return _e.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: qt(Wt(e, [...e.openings, l])), openingId: l.id };
}
function Cs(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Te(e, i.wallId, n, i.width, t) ? e : qt(he(Wt(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function jr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Te(e, i.wallId, i.offset, n, t) ? e : qt(he(Wt(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function qr(e, t) {
  return _e.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function Wr(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return qt(he(Wt(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function Ls(e, t) {
  return qt(he(Wt(e, e.openings.filter((n) => n.id !== t))));
}
function he(e) {
  return Wt(e, e.openings.map((t) => {
    const n = Ne(e, t.wallId), i = n === null || t.offset < -Ut || t.offset + t.width > n + Ut || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Ns(t, s));
    return { ...t, invalid: i };
  }));
}
const ae = 1;
function rt(e) {
  return structuredClone(e);
}
function De(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function Vr(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Re(e, t, n) {
  const i = j(e, t.a), s = j(e, t.b), o = L(i, s), r = Vr(typeof n == "number" ? n : An(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : or(i, s, r / o), offset: r };
}
function Kr(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Re(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Ts(e, t) {
  return Kr(e), t && Xr(t, e), qt(Nn(he(e)));
}
function ht(e, t) {
  return Ts(rt(e), t);
}
function Ds(e, t, n) {
  const i = Oe(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Re(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function vi(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: j(e, t.nodeId), nodeId: t.nodeId };
  const n = De(e, t.wallId), { pt: i, offset: s } = Re(e, n, t.offset), o = L(j(e, n.a), j(e, n.b));
  return s <= ae ? { pt: j(e, n.a), nodeId: n.a } : o - s <= ae ? { pt: j(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function $i(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: X(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Gr(e, t, n, i) {
  const s = vi(e, t), o = vi(e, n);
  if (L(s.pt, o.pt) < ae) return { level: e, wallId: null, endNodeId: null };
  const r = rt(e), a = $i(r, s), l = $i(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const c = { id: X(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: ht(r, e), wallId: c.id, endNodeId: l };
}
function Rs(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < ae || l - a < ae ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Yr(e, t, n, i, s) {
  const o = Rs(t, n, i.thickness, s);
  if (!o) return e;
  const r = rt(e), a = o.map((l) => {
    const c = { id: X(), x: l.x, y: l.y };
    return r.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: X(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return ht(r, e);
}
function Zr(e, t, n) {
  const i = rt(e);
  return Ds(i, t, n), Ts(i, e);
}
function Xr(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((d) => d.id === s.a), r = e.nodes.find((d) => d.id === s.b), a = t.nodes.find((d) => d.id === i.a), l = t.nodes.find((d) => d.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const c = L(a, l);
    if (c === 0) continue;
    const p = Pe(A(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = An(P(o, E(p, d.offset)), a, l) * c);
  }
}
function Qr(e, t, n) {
  const i = rt(e), s = De(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: P(j(i, a), n) }));
  for (const a of r) Ds(i, a.id, a.to);
  return ht(i, e);
}
function ze(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Jr(e, t, n) {
  const i = rt(e), s = De(i, t), o = j(i, s[n]), r = { id: X(), x: o.x, y: o.y };
  return i.nodes.push(r), s[n] = r.id, ze(i), { level: ht(i, e), nodeId: r.id };
}
function ta(e, t, n) {
  if (t === n) return e;
  const i = rt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return i.nodes = i.nodes.filter((o) => o.id !== t), ze(i), ht(i, e);
}
function Cn(e, t) {
  var i;
  const n = rt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return ze(n), ht(n, e);
}
function ea(e, t, n) {
  const i = rt(e);
  return Object.assign(De(i, t), n), ht(i, e);
}
const J = (e) => typeof e == "string" && e !== "" ? e : null, zs = (e) => e.split(".")[0], na = ["friendly_name", "device_class", "unit_of_measurement"];
function Us(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: zs(e),
    name: J(n.friendly_name) ?? e,
    deviceClass: J(n.device_class),
    unit: J(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function ia(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Us(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function sa(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && na.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Fs(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function oa(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = Us(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: J(r.name) ?? J(r.original_name) ?? a.name,
      deviceId: J(r.device_id),
      areaId: J(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: J(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: J(r.name_by_user) ?? J(r.name) ?? r.id, model: J(r.model), areaId: J(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function ra(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Bs(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Fs(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Hs = 2, wi = Math.ceil(360 / Hs), xi = 1e-4, aa = 1e-9, ki = 1e-9, la = {
  light: Os,
  motion: (e) => e.kind === "opening"
};
function js(e, t) {
  const n = [];
  for (const i of ws([...Pn(e, la[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function ca(e, [t, n]) {
  const i = A(n, t), s = F(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, F(A(e, t), i) / s));
  return L(e, P(t, E(i, o)));
}
function Ln(e, t, n) {
  return t.filter((i) => ca(e, i) <= n);
}
function Ze(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function da(e, t, n) {
  const i = Ln(e, t, n), s = [];
  for (let v = 0; v < wi; v++) s.push(-Math.PI + 2 * Math.PI * v / wi);
  const o = n * 1.05;
  for (const v of i)
    for (const g of v) {
      if (L(e, g) > o) continue;
      const x = Math.atan2(g.y - e.y, g.x - e.x);
      s.push(Ze(x - xi), Ze(x), Ze(x + xi));
    }
  s.sort((v, g) => v - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), c = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([v, g], x) => {
    a[x] = v.x - e.x, l[x] = v.y - e.y, c[x] = g.x - v.x, p[x] = g.y - v.y;
  });
  const d = [], u = [];
  let h = NaN;
  for (const v of s) {
    if (v === h) continue;
    h = v;
    const g = Math.cos(v), x = Math.sin(v);
    let S = n, _ = -1;
    for (let N = 0; N < r; N++) {
      const C = g * p[N] - x * c[N];
      if (Math.abs(C) < 1e-12) continue;
      const D = (a[N] * p[N] - l[N] * c[N]) / C;
      if (!(D > aa && D < S)) continue;
      const B = (a[N] * x - l[N] * g) / C;
      B < -ki || B > 1 + ki || (S = D, _ = N);
    }
    const k = { x: e.x + g * S, y: e.y + x * S }, I = d.length;
    if (!(I > 0 && d[I - 1].x === k.x && d[I - 1].y === k.y)) {
      if (_ >= 0 && I >= 2 && u[I - 1] === _ && u[I - 2] === _) {
        d[I - 1] = k;
        continue;
      }
      d.push(k), u.push(_);
    }
  }
  const m = d[0], y = d[d.length - 1];
  return d.length > 1 && m.x === y.x && m.y === y.y && d.pop(), d;
}
const ua = 32, _i = 128;
function Se(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function vt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function qs(e) {
  return (e % 360 + 360) % 360;
}
function Ws(e) {
  return (e % 360 + 540) % 360 - 180;
}
function Q(e, t) {
  const n = t.placement;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Se(n.rotation) };
  const i = e.walls.find((l) => l.id === n.wallId);
  if (!i) return null;
  let s;
  try {
    s = it(e, i);
  } catch {
    return null;
  }
  const o = Z(s.dir), r = n.side === "left" ? o : E(o, -1), a = n.side === "left" ? s.leftOff : s.rightOff;
  return { pt: P(P(s.a, E(s.dir, n.offset)), E(r, a)), dir: n.aim ? Se(vt(r) + n.aim) : r, normal: r };
}
function Vs(e, t) {
  const n = [];
  for (let i = 0; i < _i; i++) n.push(P(e, E(Se(360 * i / _i), t)));
  return n;
}
function Si(e, t, n, i) {
  if (n >= 360) return Vs(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * ua)), o = vt(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(P(e, E(Se(o + n * a / s), i)));
  return r;
}
const ha = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Ue(e) {
  return ha[e] ?? null;
}
const pa = (e) => Ue(e.kind) !== null;
function fa(e, t) {
  const n = t.props;
  if (!pa(n)) return null;
  const i = Q(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Si(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Si(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Vs(i.pt, n.poolRadius) : null;
  }
}
function Ks(e) {
  return e.normal ? P(e.pt, e.normal) : e.pt;
}
function ga(e, t) {
  const n = Q(e, t);
  if (!n) return null;
  const i = Ks(n);
  let s = null, o = 1 / 0;
  for (const r of e.zones) {
    if (!ue(i, r.outline)) continue;
    const a = Math.abs(zt(r.outline));
    a < o && (s = r.id, o = a);
  }
  return s;
}
function Ei(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function ma(e, t, n) {
  const i = A(t, e);
  for (const [s, o] of n) {
    const r = A(o, s), a = A(s, e), l = nt(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const c = nt(a, r) / l, p = nt(a, i) / l;
    if (c >= 0 && c <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Mi = 0.5, ba = 3, ya = 1e-4;
function va(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  const s = Ks(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => Ei(k, n) || Ln(k, n, Mi).length > 0;
  if (!r(s)) return s;
  const a = it(e, e.walls.find((k) => k.id === o.wallId)), l = i.normal, c = (k) => Math.abs(F(A(k, i.pt), l)) <= ya, p = ([k, I]) => E(P(k, I), 0.5), d = n.filter((k) => c(k[0]) && c(k[1]) && L(k[0], k[1]) > 1e-9 && !Ei(P(p(k), E(l, Mi)), n)), u = (k) => F(A(k, a.a), a.dir), h = ([k, I]) => Math.max(0, Math.min(u(k), u(I)) - o.offset, o.offset - Math.max(u(k), u(I))), m = Math.min(...d.map(h)), y = d.filter((k) => h(k) <= m + 1e-6).map((k) => P(p(k), l)), v = (k) => y.some((I) => !ma(k, I, n)), g = ba * Math.max(...e.walls.map((k) => k.thickness)) + 2, x = [];
  for (const [k, I] of n) {
    const N = A(I, k), C = A(k, s), D = nt(a.dir, N);
    if (Math.abs(D) < 1e-12) continue;
    const B = nt(C, a.dir) / D;
    if (B < -1e-9 || B > 1 + 1e-9) continue;
    const q = nt(C, N) / D, Y = L(k, I) / Math.abs(D);
    x.push(q - Y, q + Y);
  }
  const S = o.offset <= a.len / 2 ? 1 : -1, _ = x.filter((k) => Math.abs(k) <= g).sort((k, I) => Math.abs(k) - Math.abs(I) || Math.sign(I) * S - Math.sign(k) * S);
  for (const k of _) {
    const I = P(s, E(a.dir, k));
    if (!r(I) && v(I)) return I;
  }
  return null;
}
const $a = 1 / Math.cos(Hs / 2 * (Math.PI / 180)), Ai = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function wa(e, t, n = js) {
  const i = fa(e, t), s = Ue(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = va(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((d) => L(d, r))) * $a, l = Ln(r, o, a);
  if (l.length === 0) return [i];
  const c = da(r, l, a);
  let p;
  try {
    p = fs.intersection(hn(Ai(i)), hn(Ai(c)));
  } catch {
    return [c];
  }
  return p.flatMap((d) => d.map(vs));
}
function xa(e, t, n, i) {
  const s = Q(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, F(A(n, s.pt), s.dir)));
    return L(P(s.pt, E(s.dir, a)), n) <= i;
  }
  if (o.kind !== "equipment") return L(s.pt, n) <= i;
  if (o.shape === "circle") return L(s.pt, n) <= o.diameter / 2 + i;
  const r = A(n, s.pt);
  return Math.abs(F(r, s.dir)) <= o.width / 2 + i && Math.abs(F(r, Z(s.dir))) <= o.depth / 2 + i;
}
function Gs(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && xa(e, i[o], t, n)) return i[o].id;
  return null;
}
const ka = 60;
function fn(e, t, n) {
  if (!ds.has(t.props.kind)) return null;
  const i = Q(e, t);
  return i ? { from: i.pt, to: P(i.pt, E(i.dir, ka / n)) } : null;
}
function Ys(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function _a(e, t, n, i) {
  const s = t.placement, o = Q(e, t);
  if (!o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = vt(A(n, o.pt)), a = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (s.mode === "free") return { ...s, rotation: qs(a(r)) };
  const l = Ws(r - vt(o.normal)), c = Math.max(-Rt, Math.min(Rt, a(l)));
  return Ys(s, c);
}
class Zs extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Xe(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Sa(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Ea(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Zs(s.message) : s;
  }
}
async function Ma(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Aa = 3;
function Et(e) {
  if (typeof e == "number")
    return e === Aa ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Ia {
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
    const i = { ...t, id: X(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await Ea(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Zs ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = Et(o)), this.onChange(), null;
    }
  }
}
const Pa = {
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
  "tool.smart_button": "Smart button",
  "tool.socket": "Socket",
  "tool.equipment": "Equipment",
  "tool.climate_sensor": "Climate sensor",
  "tool.exhaust_fan": "Exhaust fan",
  "mode.plan": "Plan",
  "mode.equipment": "Equipment",
  "mode.binding": "Binding",
  "mode.automation": "Automation",
  "steps.label": "Setup steps",
  "steps.app": "Plan Studio",
  "steps.wall": "{n} wall",
  "steps.walls": "{n} walls",
  "steps.room": "{n} room",
  "steps.rooms": "{n} rooms",
  "steps.device": "{n} device",
  "steps.devices": "{n} devices",
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
  "binding.slot": "Slot",
  "binding.event": "Event",
  "binding.eventOther": "Other…",
  "binding.separateOff": "Separate Off",
  "binding.autoEnabled": "Auto",
  "binding.autoByDoubleToggle": "Auto by double toggle",
  "binding.window": "Window, s",
  "binding.defaultOutput": "Default output",
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
  "role.final": "Final state",
  "output.on": "On",
  "output.off": "Off",
  "output.auto": "Auto",
  "output.error": "Error",
  "output.line": "Output: {output}",
  "output.defaultNotConfigured": "default: not configured",
  "output.defaultUnavailable": "default: unavailable ({entities})",
  "output.notSaved": "Not saved yet",
  "output.noLive": "Live outputs are not available.",
  "bindstatus.bound": "Bound",
  "bindstatus.partial": "Partly bound",
  "bindstatus.unbound": "Not bound",
  "bindstatus.missing": "Entity missing in Home Assistant",
  "zone.default": "Room",
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
  "props.invalidOpening": "Out of the wall or overlapping another opening",
  "props.badWidth": "Width must be a whole number of mm above 0",
  "props.noFit": "Does not fit the wall at this position",
  "props.zone": "Room",
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
  "props.zones": "Rooms",
  "props.zonesAuto": "auto",
  "props.badAim": "Aim must be a whole number from -90 to 90",
  "props.side": "Side",
  "props.badNumber": "Must be a whole number above 0",
  "props.badAngle": "Angle must be a whole number from 1 to 360",
  "props.badRotation": "Rotation must be a whole number from 0 to 359",
  "props.badOffset": "Enter a whole number of mm, 0 or more",
  "props.badSlot": "Slot is a whole number from 0 to 9.",
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
function f(e) {
  return Pa[e] ?? e;
}
const ot = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function dt(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const Tn = 12, U = "non-scaling-stroke", Oa = { on: "#facc15", auto: "#38bdf8", error: "#f43f5e" }, Na = "#0f172a", Ca = "#f43f5e", La = "3 2", Ta = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Xs = 24;
function Da(e, t, n) {
  const i = Xs / t;
  return customElements.get("ha-icon") ? M`<foreignObject class="equipment-icon" x=${-i / 2} y=${-i / 2} width=${i} height=${i}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${i}px;color:${n};display:block`}></ha-icon></foreignObject>` : M`<g class="equipment-icon" transform=${`translate(${-i / 2} ${-i / 2}) scale(${i / 24})`}>
    <path d=${Ta} fill=${n}></path></g>`;
}
const Ra = "__preview__", za = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Ua = /* @__PURE__ */ new WeakMap();
function Fa(e, t) {
  var s;
  const n = dt(Ua, e.walls, () => /* @__PURE__ */ new WeakMap()), i = dt(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = dt(i, e.openings, () => ({})))[t] ?? (s[t] = js(e, t));
}
const Ba = /* @__PURE__ */ new WeakMap();
function Ha(e, t) {
  const n = Ue(t.props.kind);
  if (!n) return [];
  const i = Fa(e, n), s = dt(Ba, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = wa(e, t, () => i), s.set(t, o)), o;
}
function ja(e, t, n, i, s = n, o) {
  const r = e.props, a = { stroke: n, fill: i };
  switch (r.kind) {
    case "ceiling_light":
      return r.shape === "linear" ? M`<rect class="icon" x=${-r.length / 2} y=${-r.width / 2} width=${r.length} height=${r.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></rect>` : r.shape === "spot" ? M`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${U}></circle>` : M`<circle class="icon" r=${t} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>`;
    case "wall_light":
      return M`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" vector-effect=${U}></path>`;
    case "motion_sensor": {
      const l = (c) => `M${t * c} ${-t * c * 0.8}A${t * c} ${t * c * 0.8} 0 0 1 ${t * c} ${t * c * 0.8}`;
      return M`<circle class="icon" r=${t * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="arcs" d=${l(1) + l(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    case "illuminance_sensor": {
      let l = "";
      for (let c = 0; c < 8; c++) {
        const p = c * Math.PI / 4;
        l += `M${Math.cos(p) * t * 1.15} ${Math.sin(p) * t * 1.15}L${Math.cos(p) * t * 1.6} ${Math.sin(p) * t * 1.6}`;
      }
      return M`<circle class="icon" r=${t * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="rays" d=${l} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    case "wall_switch":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${o ?? $} vector-effect=${U}></rect>`;
    case "smart_button":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${o ?? $}
        vector-effect=${U}></rect>
        <circle class="dot" r=${t * 0.18} fill=${s}></circle>`;
    case "socket":
      return M`<circle class="icon" r=${t} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return M`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${U}></path>`;
    case "exhaust_fan": {
      let l = "";
      for (let c = 0; c < 4; c++) {
        const p = c * Math.PI / 2 + Math.PI / 4;
        l += `M0 0L${Math.cos(p) * t * 0.85} ${Math.sin(p) * t * 0.85}`;
      }
      return M`<circle class="icon" r=${t} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="blades" d=${l} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    default:
      return M`${$}`;
  }
}
function qa(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return M`${$}`;
  const o = Tn / t.scale, r = s.shape === "circle" ? M`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${U}></circle>` : M`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${U}></rect>`;
  return M`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${Da(s.icon, t.scale, n)}
    <text class="equipment-label" y=${Xs / t.scale / 2 + o} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Wa(e, t) {
  return e === "bound" ? $ : M`<circle class=${`bind-ring bind-${e}`} r=${Tn * 1.7 / t} fill="none" style=${`stroke:${za[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : $} vector-effect=${U}></circle>`;
}
function Va(e, t) {
  return M`<circle class="fault-mark" cx=${e * 0.6} cy=${-e * 0.6} r=${e * 0.3} fill=${Ca} stroke=${t.background}
    stroke-width="1.5" vector-effect=${U}></circle>`;
}
function Ka(e, t, n, i) {
  var g, x;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Tn / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((g = n.selection) == null ? void 0 : g.kind) === "device" && n.selection.id === e.id, c = !i && de(e.props.kind), p = c ? (x = n.containerState) == null ? void 0 : x.call(n, e) : void 0, d = c && !p, u = p ? Oa[p.output] : void 0, h = u ?? s.deviceFill, m = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (p ? ` out-${p.output}` : "") + (d ? " no-data" : ""), y = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, v = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : r * 1.6;
  return M`
    <g class=${m} data-id=${e.id} opacity=${y} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? M`<circle class="selection-ring" r=${v + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${U}></circle>` : $}
      ${e.props.kind === "equipment" ? qa(e, n, o, a) : M`<g transform=${`rotate(${a})`}>${ja(
    e,
    r,
    o,
    h,
    u ? Na : o,
    d ? La : void 0
  )}</g>`}
      ${p != null && p.fault ? Va(r, s) : $}
      ${n.bindingStatus && !i ? Wa(n.bindingStatus(e), n.scale) : $}
    </g>`;
}
function Ga(e, t, n, i) {
  const s = Ha(e, t);
  if (s.length === 0) return $;
  const o = n.palette, r = t.invalid ? o.invalid : Ue(t.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, l = s.map(ot).join("");
  return t.props.kind === "ceiling_light" ? M`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${U}></path>` : M`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${U}></path>`;
}
function Ya(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return $;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? fn(e, i, t.scale) : null;
  if (!s) return $;
  const o = t.palette.selection;
  return M`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : $}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${U}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${U} style="cursor:grab"></circle>
  </g>`;
}
function Za(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Ra, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return M`
    <g class="cones">${t.showCones ? n.map((i) => Ga(e, i.d, t, i.preview)) : $}</g>
    <g class="devices">${n.map((i) => Ka(i.d, i.pose, t, i.preview))}</g>
    ${Ya(e, t)}`;
}
function At(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function Qs(e) {
  return `${e.toFixed(2)} ${f("unit.m2")}`;
}
const Xa = /* @__PURE__ */ new WeakMap(), Qa = /* @__PURE__ */ new WeakMap(), Js = /* @__PURE__ */ new WeakMap();
function Fe(e, t, n) {
  const i = Z(e.dir), s = P(e.a, E(e.dir, t)), o = P(e.a, E(e.dir, n));
  return [P(s, E(i, e.leftOff)), P(o, E(i, e.leftOff)), A(o, E(i, e.rightOff)), A(s, E(i, e.rightOff))];
}
function le(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = it(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function Ja(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const a = e[r], l = e[(r + 1) % e.length], c = a.x * l.y - l.x * a.y;
    n += c, i += (a.x + l.x) * c, s += (a.y + l.y) * c;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return ue(o, e) ? o : t;
}
const H = "non-scaling-stroke";
function tl(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = le(e, a.id);
    if (!l) continue;
    const c = Z(l.dir);
    for (const [p, d, u] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const h = e.nodes.find((k) => k.id === p);
      if (!h || h.host || n.get(p) !== 1) continue;
      const m = P(d, E(c, l.leftOff + i)), y = A(d, E(c, l.rightOff + i)), v = E(c, 1), g = E(P(m, y), 0.5), x = P(A(g, E(v, -o)), E(u, s / 2)), S = A(A(g, E(v, o)), E(u, s / 2)), _ = [m, x, S, y];
      r.push(M`<path class="wall-break" d=${`M${_.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${H}></path>`);
    }
  }
  return r.length ? M`${r}` : $;
}
function el(e, t, n) {
  const i = t.palette, s = Ja(e.outline, e.seed), o = 12 / t.scale;
  return M`
    <path class="zone${e.broken ? " broken" : ""}" d=${ot(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${H}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Qs(Ms(e.outline))}</tspan>
    </text>`;
}
function nl(e, t, n) {
  const i = Z(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], c = P(P(e.a, E(e.dir, a)), E(o, r)), p = P(P(e.a, E(e.dir, l)), E(o, r)), d = P(c, E(o, t.width)), u = nt(A(d, c), A(p, c)) > 0 ? 1 : 0;
  return M`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${H}></line>
    <path d=${`M${d.x} ${d.y}A${t.width} ${t.width} 0 0 ${u} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${H}></path>`;
}
function il(e, t, n) {
  const i = Z(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = P(P(e.a, E(e.dir, t.offset)), E(i, r)), l = P(P(e.a, E(e.dir, t.offset + t.width)), E(i, r));
    return M`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${H}></line>`;
  });
  return M`${o}`;
}
function sl(e, t, n) {
  const i = le(e, t.wallId);
  if (!i) return $;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = Fe(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return M`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${ot(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? nl(i, t, o) : t.kind === "window" ? il(i, t, o) : $}
    </g>`;
}
function Ii(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = P(e, E(n, i)), l = P(t, E(n, i)), c = (d, u) => {
    const h = P(u, E(n, i + r));
    return M`<line x1=${d.x} y1=${d.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${H}></line>`;
  }, p = P(E(P(a, l), 0.5), E(n, 9 / s.scale));
  return M`
    <g class="dim">
      ${c(P(e, E(n, 2 / s.scale)), e)}${c(P(t, E(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${H}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${At(L(e, t))}</text>
    </g>`;
}
function ol(e, t) {
  const n = t.selection;
  if (!n) return $;
  const i = t.palette, s = 4 / t.scale, o = (r) => M`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : $;
  }
  if (n.kind === "wall") {
    const r = dt(Js, e, Ce).get(n.id), a = le(e, n.id);
    if (!r || !a) return $;
    const l = Z(a.dir);
    return M`
      <path d=${ot(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${H}></path>
      ${o(a.a)}${o(a.b)}
      ${Ii(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((u) => u.id === n.id), a = r ? le(e, r.wallId) : null;
    if (!r || !a) return $;
    const l = E(Z(a.dir), -1), c = a.rightOff + 18 / t.scale, p = (u) => P(a.a, E(a.dir, u)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return M`
      <path d=${ot(Fe(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${H}></path>
      ${d.filter(([u, h]) => h - u >= 1).map(([u, h]) => Ii(p(u), p(h), l, c, t))}`;
  }
  return $;
}
function rl(e, t, n) {
  return L(e, t) < 1e-6 ? null : Fe(ms(e, t, n.thickness, n.baseline), 0, L(e, t));
}
function al(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? le(e, r.wallId) : null;
  return M`
    ${o ? M`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${H}></path>` : $}
    ${(n.walls ?? []).map((l) => {
    const c = rl(l.a, l.b, l.props);
    return M`<g class="preview-wall">
        ${c ? M`<path d=${ot(c)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${H}></line></g>`;
  })}
    ${r && a ? M`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ot(Fe(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${cl(e, t)}`;
}
function ll(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return M`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${H}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${H}></rect></g>`;
}
function cl(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? ll(n.anchor, t) : $, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / t.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let p, d = $;
  if (o.kind === "node") {
    const h = r(5);
    p = M`<g class="snap-node"><rect x=${a - h} y=${l - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${H}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${a} ${l - h}L${a + h * 0.866} ${l + h / 2}L${a - h * 0.866} ${l + h / 2}Z`;
    p = M`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${H}></path></g>`;
  } else if (o.kind === "wall") {
    const h = r(5), m = `M${a - h} ${l - h}L${a + h} ${l + h}M${a - h} ${l + h}L${a + h} ${l - h}`;
    p = M`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${H}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${H}></path></g>`;
    const y = o.endpoint.kind === "wall" ? dt(Js, e, Ce).get(o.endpoint.wallId) : void 0;
    y && (d = M`<path class="snap-wall-hl" d=${ot(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${H}></path>`);
  } else {
    const h = r(4), m = `M${a - h} ${l}H${a + h}M${a} ${l - h}V${l + h}`;
    p = M`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${H}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${H}></path></g>`;
  }
  const u = f(`snapmark.${o.kind}`);
  return M`
    ${d}${s}${p}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${H} font-family="system-ui, sans-serif">${u}</text>`;
}
function dl(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = dt(Xa, n, (d) => $s(d, !0)), o = n.walls.filter((d) => d.type === "railing" || d.type === "fence"), r = o.length ? dt(Qa, n, Pn) : null, a = 8 / t.scale, l = t.selection, c = (t.mode ?? "plan") === "plan", p = c ? $ : String(i.dimOpacity);
  return M`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${p}>${n.zones.map((d) => el(d, t, (l == null ? void 0 : l.kind) === "zone" && l.id === d.id))}</g>
    <path class="walls" d=${s.map((d) => d.map(ot).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${p}></path>
    ${r ? M`<g class="railings" opacity=${p}>${o.flatMap((d) => (r.get(d.id) ?? []).map((u) => M`<path d=${ot(u)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${p}>${n.openings.map((d) => sl(n, d, t))}</g>
    <g class="wall-breaks" opacity=${p}>${tl(n, t)}</g>
    <g class="devices-layer">${Za(n, {
    palette: i,
    scale: t.scale,
    selection: l,
    showCones: t.showCones ?? !0,
    dim: c,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0,
    containerState: t.containerState
  })}</g>
    <g class="selection">${ol(n, t)}</g>
    <g class="preview">${al(n, t)}</g>`;
}
const ul = {
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
}, hl = {
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
function pl(e) {
  return e ? ul : hl;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Dn = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Rn {
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
const to = (e) => e.strings === void 0, fl = {}, eo = (e, t = fl) => e._$AH = t;
class gl extends Rn {
  constructor(t) {
    if (super(t), t.type !== pt.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? et : (eo(t), n);
  }
}
const G = Dn(gl), gn = 1, Pi = 1e-6;
function ml(e, t, n, i, s) {
  const o = (l) => l > Pi && l < s - Pi, r = new Set(e.nodes.filter((l) => {
    var c;
    return ((c = l.host) == null ? void 0 : c.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const c = Oe(e, l).host.offset;
    o(c) && a.push({ t: c, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((y) => y === t.a || y === t.b || r.has(y))) continue;
    const c = j(e, l.a), p = j(e, l.b), d = L(c, p), u = d === 0 ? null : lt(n, i, c, A(p, c));
    if (!u) continue;
    const h = An(u, c, p) * d;
    if (h < -gn || h > d + gn) continue;
    const m = F(A(u, n), i);
    o(m) && a.push({ t: m, wall: l, pt: u });
  }
  return a;
}
function Oi(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Ni(e, t) {
  if ("nodeId" in t)
    return delete Oe(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (L(j(e, o), t.pt) <= gn) return o;
  const { pt: n, offset: i } = Re(e, t.wall, t.pt), s = { id: X(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function bl(e, t, n) {
  const i = e.walls.find((g) => g.id === t);
  if (!i) return e;
  const s = j(e, i.a), o = j(e, i.b), r = L(s, o), a = Pe(A(o, s)), l = F(A(n, s), a), c = ml(e, i, s, a, r), p = Oi(c.filter((g) => g.t < l), l), d = Oi(c.filter((g) => g.t > l), l);
  if (!p && !d) return Cn(e, t);
  const u = rt(e), h = u.walls.find((g) => g.id === t);
  let m = t, y = 0;
  if (d) {
    const g = Ni(u, d);
    if (y = F(A(j(u, g), s), a), p) {
      const x = { ...h, id: X(), a: g };
      u.walls.push(x), m = x.id;
    } else
      h.a = g;
  }
  p && (h.b = Ni(u, p));
  const v = (g, x) => g.wallId !== t || p && x <= p.t ? !0 : !d || x < d.t ? !1 : (g.wallId = m, g.offset -= y, !0);
  u.openings = u.openings.filter((g) => v(g, g.offset + g.width / 2)), u.devices = u.devices.filter((g) => g.placement.mode !== "wall" || v(g.placement, g.placement.offset));
  for (const g of u.nodes) g.host && !v(g.host, g.host.offset) && delete g.host;
  return ze(u), ht(u, e);
}
function no(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function yl(e, t, n) {
  return P(e, E(Pe(A(t, e)), n));
}
function Ci(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Ft(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? no(r, t) : t, c = r !== void 0 && l.y === r.y, p = (g) => !r || Math.abs(c ? g.y - r.y : g.x - r.x) <= 1;
  let d = null;
  for (const g of e.nodes) {
    if (a.has(g.id)) continue;
    const x = { x: g.x, y: g.y }, S = L(x, l);
    S <= i && p(x) && (!d || S < d.d) && (d = { id: g.id, pt: x, d: S });
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const u = e.walls.filter((g) => !a.has(g.a) && !a.has(g.b)).map((g) => ({ w: g, f: it(e, g) })).filter((g) => g.f.len > 1e-9);
  let h = null;
  for (const { w: g, f: x } of u) {
    const S = { x: (x.a.x + x.b.x) / 2, y: (x.a.y + x.b.y) / 2 }, _ = L(S, l);
    _ <= i && p(S) && (!h || _ < h.d) && (h = { wallId: g.id, pt: S, offset: x.len / 2, d: _ });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const m = (g) => {
    let x = null;
    for (const { w: S, f: _ } of u) {
      const k = Z(_.dir), I = g ? [_.leftOff, -_.rightOff].filter((N) => N !== 0) : [0];
      for (const N of I) {
        const C = P(_.a, E(k, N)), D = r ? lt(r, A(l, r), C, _.dir) : P(C, E(_.dir, F(A(l, C), _.dir)));
        if (!D) continue;
        const B = F(A(D, C), _.dir);
        if (B < 0 || B > _.len) continue;
        const q = L(D, l);
        q <= i && (!x || q < x.d) && (x = { d: q, res: { pt: D, kind: "wall", endpoint: { kind: "wall", wallId: S.id, offset: B } } });
      }
    }
    return x ? x.res : null;
  }, y = m(!1);
  if (y) return y;
  const v = m(!0);
  if (v) return v;
  if (s && s > 0) {
    const g = (S) => Math.round(S / s) * s, x = r ? c ? { x: g(l.x), y: r.y } : { x: r.x, y: g(l.y) } : { x: g(l.x), y: g(l.y) };
    return Ci(x, "grid");
  }
  return Ci(l, "none");
}
function vl(e, t, n) {
  const i = A(n, t), s = F(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, F(A(e, t), i) / s));
  return L(e, { x: t.x + i.x * o, y: t.y + i.y * o });
}
function $l(e, t, n) {
  return t.some((i, s) => vl(e, i, t[(s + 1) % t.length]) <= n);
}
function zn(e, t, n) {
  const i = Ce(e);
  for (const [s, o] of i) if (ue(t, o)) return s;
  for (const [s, o] of i) if ($l(t, o, n)) return s;
  return null;
}
function wl(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = it(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Ht(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function xl(e, t, n, i) {
  const s = wl(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((c) => c.id === a);
        if (l && L(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = zn(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && ue(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function kl(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, a = null;
  const l = (h) => {
    t = h, e.select(h);
  }, c = () => {
    n = null, i = null, s = null, a = null, o = !1;
  }, p = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, d = (h, m, y) => Ht(it(h, h.walls.find((v) => v.id === m)), y).t;
  function u(h) {
    const m = n;
    if (!(!m || !i) && !(h.pt.x === r.x && h.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const y = Ft(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), v = y.endpoint, g = (y.kind === "wall" || y.kind === "mid") && v.kind === "wall", x = y.kind === "node" && v.kind === "node" && v.nodeId !== m.nodeId, S = i.nodes.find((N) => N.id === m.nodeId), _ = !!S.host && g && v.kind === "wall" && v.wallId === S.host.wallId;
        let k = i;
        if (S.host && !_) {
          const N = structuredClone(i);
          delete N.nodes.find((C) => C.id === m.nodeId).host, k = N;
        }
        let I = Zr(k, m.nodeId, p(y));
        if (x && v.kind === "node")
          I = ta(I, m.nodeId, v.nodeId);
        else if (g && v.kind === "wall" && !_) {
          const N = i.walls.find((C) => C.id === v.wallId);
          if (N && N.a !== m.nodeId && N.b !== m.nodeId) {
            const C = structuredClone(I);
            C.nodes.find((D) => D.id === m.nodeId).host = { wallId: v.wallId, offset: v.offset }, I = ht(C, I);
          }
        }
        s = I;
      } else if (m.kind === "wall") {
        const y = i.walls.find((x) => x.id === m.wallId), v = Ft(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [y.a, y.b]
        }), g = A(v.pt, m.origin);
        s = Qr(
          i,
          m.wallId,
          v.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const y = i.openings.find((v) => v.id === m.openingId);
        s = Cs(i, y.id, d(i, y.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      c(), r = h.pt;
      const m = e.level(), y = h.ctrl ? zn(m, h.pt, e.tolMm()) : null;
      if (y) {
        l(null), e.commit(bl(m, y, h.pt));
        return;
      }
      const v = t, g = xl(m, h.pt, e.tolMm(), v);
      if (l(g), !!g) {
        if (a = i = s = m, g.kind === "node") {
          let x = g.id;
          const S = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((_) => _.id === v.id) : void 0;
          if (h.alt && S) {
            const _ = Jr(m, S.id, S.a === g.id ? "a" : "b");
            i = s = _.level, x = _.nodeId, l({ kind: "node", id: x });
          }
          n = { kind: "node", nodeId: x, origin: j(i, x) };
        } else if (g.kind === "wall")
          n = { kind: "wall", wallId: g.id, origin: h.pt };
        else if (g.kind === "opening") {
          const x = m.openings.find((S) => S.id === g.id);
          n = { kind: "opening", openingId: x.id, grab: d(m, x.wallId, h.pt) - x.offset };
        }
      }
    },
    move(h) {
      u(h);
    },
    up(h) {
      n && u(h);
      const m = o, y = s, v = a;
      c(), m && y && v && y !== v && e.commit(y);
    },
    key(h) {
      return h === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      c(), l(null);
    }
  };
}
function ce(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function io() {
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
function _l(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = io(), s = () => {
    t = null, i.clear();
  }, o = (c) => Ft(e.level(), c, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const c = ce(i.first, { min: 1 }), p = ce(i.second, { min: 1 });
      return c === null || p === null ? null : { x: t.x + (n.x >= t.x ? c : -c), y: t.y + (n.y >= t.y ? p : -p) };
    }
    return o(n).pt;
  }
  const a = (c, p) => Math.abs(c.x - p.x) < 1 || Math.abs(c.y - p.y) < 1;
  function l(c) {
    if (!t || a(t, c)) return;
    const p = Yr(e.level(), t, c, e.wallProps(), e.boxMeasure());
    p !== e.level() && (e.commit(p), s());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !t) {
        t = o(c.pt).pt;
        return;
      }
      const p = r();
      p && l(p);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return t ? i.key(c, () => {
        const p = r();
        p && l(p);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const c = r(), p = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!c || a(t, c)) return p;
      const d = e.wallProps(), u = Rs(t, c, d.thickness, e.boxMeasure());
      return u && (p.walls = u.map((h, m) => ({ a: h, b: u[(m + 1) % 4], props: { ...d, baseline: "center" } }))), p;
    },
    cancel() {
      s();
    }
  };
}
const Li = (e) => Math.round(e * 1e3) / 1e3 + 0;
function Sl(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = io(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, c = (u, h) => Ft(e.level(), u, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: h && n !== null });
  function p() {
    if (!n) return null;
    const u = c(s, o), h = ce(a.first, { min: 1 }), m = ce(a.second);
    if (h === null && m === null) return { pt: u.pt, endpoint: u.endpoint, snap: u };
    const y = h ?? L(n, u.pt);
    let v = u.pt;
    if (m === null && L(n, u.pt) < 1) {
      const _ = r ?? { x: 1, y: 0 };
      v = { x: n.x + _.x, y: n.y + _.y };
    }
    if (m !== null) {
      const _ = m * Math.PI / 180;
      v = { x: n.x + Math.cos(_), y: n.y - Math.sin(_) };
    }
    const g = yl(n, v, y), x = { x: Li(g.x), y: Li(g.y) }, S = e.level().nodes.find((_) => Math.hypot(_.x - x.x, _.y - x.y) < 1);
    return S ? { pt: { x: S.x, y: S.y }, endpoint: { kind: "node", nodeId: S.id }, snap: u } : { pt: x, endpoint: { kind: "free", pt: x }, snap: u };
  }
  function d() {
    const u = p();
    if (!t || !u) return;
    const h = Gr(e.level(), t, u.endpoint, e.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    e.commit(h.level);
    const m = h.level.walls.find((S) => S.id === h.wallId);
    i === null && (i = m.a);
    const y = h.endNodeId === i, v = n, g = j(h.level, h.endNodeId), x = L(v, g);
    if (x > 0 && (r = { x: (g.x - v.x) / x, y: (g.y - v.y) / x }), a.clear(), y) {
      l();
      return;
    }
    t = { kind: "node", nodeId: h.endNodeId }, n = j(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(u) {
      if (s = u.pt, o = u.shift, !t) {
        const h = c(u.pt, !1);
        t = h.endpoint, n = h.pt;
        return;
      }
      d();
    },
    move(u) {
      s = u.pt, o = u.shift;
    },
    up() {
    },
    key(u, h) {
      return o = h.shift, t ? a.key(u, d, l) : !1;
    },
    preview() {
      if (!n) return { snap: Ft(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const u = p();
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
function El(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = zn(o, n, e.tolMm());
    if (!r) return null;
    const a = it(o, o.walls.find((c) => c.id === r)), l = Ht(a, n).t;
    return { wallId: r, center: l, pt: P(a.a, E(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = Hr(e.level(), r.wallId, t, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Te(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function Ml(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = Fr(n, t.pt, e.zoneName());
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
const so = 3, Ti = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function oo(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((p) => p.id === o), l = a ? Q(s, a) : null, c = a ? fn(s, a, e.scale()) : null;
    return !l || !c ? 0 : Ws(vt(A(r, l.pt)) - vt(A(c.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && L(s.pt, t.downPt) <= so / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((d) => d.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = (vt(A(s.pt, r.pt)) - t.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, p = _a(t.original, o, c, s.shift);
    t.work = JSON.stringify(p) === JSON.stringify(o.placement) ? t.original : On(t.original, o.id, p);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((c) => c.id === s), l = a ? fn(r, a, e.scale()) : null;
      return !a || !l || L(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && Ti(o.work, o.id) !== Ti(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function Di(e, t, n) {
  const i = it(e, e.walls.find((s) => s.id === t));
  return Ht(i, n).side > 0 ? "left" : "right";
}
function ro(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function ao(e, t, n, i, s = 0) {
  const o = Mn[n];
  if (o.includes("wall")) {
    const r = Ft(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: Di(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of t.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const p = it(t, c), d = Math.max(0, Math.min(p.len, Ht(p, i).t)), u = Math.hypot(i.x - (p.a.x + p.dir.x * d), i.y - (p.a.y + p.dir.y * d));
        (!l || u < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : p.len, d: u });
      }
      if (l) return { mode: "wall", wallId: l.id, side: Di(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...ro(e, i), rotation: s } : null;
}
function Al(e, t, n) {
  return _s(e.deviceDefaults(t), "free", n.mode);
}
function Il(e, t) {
  let n = null, i;
  const s = oo(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = ao(e, r, t, n);
    if (!a)
      return { placement: { mode: "free", ...ro(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const l = Al(e, t, a), c = yi(r, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !c };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), c = ss(f(`device.${t}`), l.devices.filter((d) => d.props.kind === t).map((d) => d.name)), p = yi(l, a.props, a.placement, c);
      p.deviceId !== null && (e.commit(p.level), i = p.deviceId, e.select({ kind: "device", id: p.deviceId }));
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
const Ri = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, Pl = (e, t, n) => n === void 0 || Ri(e, n) !== Ri(t, n);
function Ol(e) {
  let t = null, n = null;
  const i = oo(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (u) => {
    t = u, e.select(u);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function p(u) {
    if (!n || !s || !r && L(u.pt, a) <= so / e.scale()) return;
    if (r = !0, u.pt.x === a.x && u.pt.y === a.y) {
      o = s;
      return;
    }
    const h = s.devices.find((k) => k.id === n.id);
    if (!h) return;
    const m = u.shift ? no(a, u.pt) : u.pt, y = h.placement, v = y.mode === "free", g = v ? null : Q(s, h), x = y.mode === "free" ? y.rotation : g ? qs(Math.round(vt(g.dir))) : 0, S = ao(e, s, h.props.kind, v ? P(m, n.grab) : m, x), _ = S && S.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...S, aim: y.aim } : S;
    o = _ ? On(s, h.id, d(s, h.placement, _, m)) : s;
  }
  function d(u, h, m, y) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const v = u.walls.find((I) => I.id === h.wallId);
    if (!v) return m;
    const g = it(u, v), x = Math.max(0, Math.min(g.len, h.offset + F(A(y, a), g.dir))), S = Ht(g, y).side, _ = e.tolMm(), k = h.side === "left" ? S < -(g.rightOff + _) ? "right" : "left" : S > g.leftOff + _ ? "left" : "right";
    return { ...m, offset: x, side: k };
  }
  return {
    id: "device-select",
    down(u) {
      c(), a = u.pt;
      const h = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, u)) return;
      const y = Gs(h, u.pt, m);
      if (!y) {
        l(null);
        return;
      }
      l({ kind: "device", id: y });
      const v = h.devices.find((x) => x.id === y), g = Q(h, v);
      s = o = h, n = { id: y, grab: g && v.placement.mode === "free" ? A(g.pt, u.pt) : { x: 0, y: 0 } };
    },
    move(u) {
      i.active() ? i.move(u) : p(u);
    },
    up(u) {
      if (i.end(u)) return;
      n && p(u);
      const h = o, m = s, y = r, v = n == null ? void 0 : n.id;
      c(), y && h && m && h !== m && Pl(m, h, v) && e.commit(h);
    },
    key(u) {
      return u === "Escape" && i.cancel() ? !0 : u === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const u = i.working();
      return u ? { level: u } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), c(), l(null);
    }
  };
}
function Nl(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = Gs(e.level(), t.pt, e.tolMm());
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
const Cl = ["select", "box", "wall", "door", "window", "opening", "zone"], Ll = [
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
], Tl = ["binding-select"];
function Un(e) {
  return e === "plan" ? Cl : e === "equipment" ? Ll : Tl;
}
function mn(e, t) {
  switch (e) {
    case "select":
      return kl(t);
    case "box":
      return _l(t);
    case "wall":
      return Sl(t);
    case "door":
    case "window":
    case "opening":
      return El(t, e);
    case "zone":
      return Ml(t);
    case "device-select":
      return Ol(t);
    case "binding-select":
      return Nl(t);
    default:
      return Il(t, e);
  }
}
function Qe(e, t) {
  return (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((i) => i.id === t.id);
}
function Dl(e) {
  switch (e.saveState) {
    case "saving":
      return f("save.saving");
    case "conflict":
      return f("save.conflict");
    case "error":
      return f("save.error");
    default:
      return e.dirty ? f("save.dirty") : f(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Rl(e) {
  return b`
    <div class="top"><div class="bar">
      ${e.lead ?? $}
      ${e.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${G(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => b`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : $}
      <button class="btn" data-action="new-plan" title=${f("plan.new")} aria-label=${f("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${f("plan.delete")} aria-label=${f("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${f("action.undo")} aria-label=${f("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${f("action.redo")} aria-label=${f("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${Dl(e)}${e.saveState === "error" && e.errorMessage ? b`: ${e.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${f("action.save")}</button>
    </div>${e.steps}</div>`;
}
function zl(e, t, n) {
  return b`
    <div class="tools">
      ${Un(e).map((i) => b`
        ${i === "zone" || i === "ceiling_light" ? b`<div class="tool-sep"></div>` : $}
        <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
          ${f(`tool.${i}`)}</button>`)}
    </div>`;
}
const Yt = ["plan", "equipment", "binding"], Je = (e, t, n) => f(e === 1 ? t : n).replace("{n}", String(e));
function Ul(e, t, n) {
  const { walls: i, zones: s, devices: o } = t;
  switch (e) {
    case "plan":
      return {
        text: `${Je(i.length, "steps.wall", "steps.walls")}, ${Je(s.length, "steps.room", "steps.rooms")}`,
        done: i.length > 0 && s.length > 0
      };
    case "equipment":
      return { text: Je(o.length, "steps.device", "steps.devices"), done: o.length > 0 };
    case "binding": {
      const r = o.length - _n(o.map(n));
      return {
        text: f("steps.bound").replace("{b}", String(r)).replace("{n}", String(o.length)),
        done: o.length > 0 && r === o.length
      };
    }
  }
}
const zi = (e, t) => f(e).replace("{step}", f(`mode.${t}`));
function Fl(e) {
  const t = Yt.indexOf(e.mode), n = Yt[t - 1], i = Yt[t + 1];
  return b`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${G(e.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${Yt.map((s, o) => {
    const r = Ul(s, e.level, e.status), a = s === e.mode;
    return b`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : $} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${f(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${Yt.length + 1}</span><span class="name">${f("mode.automation")}</span>
        <span class="state">${f("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? b`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${zi("steps.back", n)}</button>` : $}
        ${i ? b`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${zi("steps.next", i)}</button>` : b`<button class="btn primary" data-nav="next" @click=${() => e.onNextUnbound()}>${f("steps.nextUnbound")}</button>`}
      </div>
    </nav>`;
}
const Bl = ["unbound", "bound", "all"], Hl = /* @__PURE__ */ new WeakMap();
function lo(e) {
  return dt(Hl, e, (t) => [...t.devices].sort((n, i) => n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function jl(e, t, n) {
  const i = lo(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Ui = (e) => f(`device.${e.props.kind}`), ql = (e, t) => e === "all" || e === "bound" == (t === "bound");
function Wl(e, t, n) {
  return t === 0 ? f("binding.noDevices") : n || e.filter === "all" ? f("binding.noMatch") : f(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Fi(e) {
  const t = f(e.collapsed ? "binding.expand" : "binding.collapse");
  return b`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function Vl(e) {
  var r;
  if (e.collapsed) return b`<div class="blist collapsed">${Fi(e)}</div>`;
  const t = lo(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: _n(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => ql(e.filter, l) && (!i || a.name.toLowerCase().includes(i) || Ui(a).toLowerCase().includes(i))), o = ((r = e.selection) == null ? void 0 : r.kind) === "device" ? e.selection.id : null;
  return b`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${Bl.map((a) => b`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${f(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Fi(e)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${G(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? b`<p class="empty">${Wl(e, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const c = Vo(a);
    return b`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${f(`bindstatus.${l}`)} title=${f(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${Ui(a)}</small></span>
            <span class="cnt">${c.filled}/${c.total}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function O(e, t) {
  return b`<label class="row"><span>${e}</span>${t}</label>`;
}
function K(e, t, n, i) {
  return b`<select class="val" data-field=${i ?? $} .value=${G(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => b`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function xt(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return b`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? $}
    placeholder=${e.placeholder ?? $} title=${e.placeholder ?? $} .value=${G(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = ce(s.value, e.rule);
    if (o === null) {
      s.value = t, n(f(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(f("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function Kl() {
  return {
    door: { width: be.door, hinge: "start", swing: "left" },
    window: { width: be.window, outside: "left" },
    opening: { width: be.opening },
    zoneName: null
  };
}
function Gl(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function co(e) {
  return ss(f("zone.default"), e.zones.map((t) => t.name));
}
const Yl = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function Zl(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? co(e.level);
    return b`
      <h4>${f("props.nextZone")}</h4>
      ${O(f("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${G(r)}
        @change=${(a) => {
      const l = a.target, c = l.value.trim();
      if (!c) {
        l.value = r;
        return;
      }
      c !== r && e.setNext({ ...t, zoneName: c });
    }} />`)}`;
  }
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return $;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return b`
    <h4>${f(`props.next.${n}`)}</h4>
    ${O(`${f("props.width")}, ${f("unit.mm")}`, xt({
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
      ${O(f("props.hinge"), K(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${O(f("props.swing"), K(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? O(f("props.outside"), K(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class Xl {
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
class Ql {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Xe(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(ni(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = Et(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await Sa(this.h.hass, t);
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
        this.h.plans = await Xe(this.h.hass);
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
      this.h.notice = Et(n);
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
    this.h.toolId = Un(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(ni(f("plan.default"))), this.offerDraft(null);
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
            await Ma(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = Et(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Xe(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = Et(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(sr) }, this.h.history = new Xl(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = mn(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.needFit = !0;
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
    const t = `${this.h.plan.name} ${f("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Jl {
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
    !n || !sa(n.states, t) ? this.base = { states: t, meta: ia(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? ra(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), oa(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = f("binding.registryError").replace("{error}", Et(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Bi = cs("", "");
function tc(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current) ?? Bi;
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
    deviceDefaults: (t) => e.nextProps[t],
    openingDefaults: (t) => Gl(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? co(((t = e.history) == null ? void 0 : t.current) ?? Bi);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    }
  };
}
const uo = Object.keys(Mn), ec = (e) => uo.includes(e);
function nc() {
  return Object.fromEntries(uo.map((e) => [e, Pt(e, "free")]));
}
const ho = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Rt, max: Rt, signed: !0 }, bad: "props.badAim" }
}, ee = (e, t, n, i, s) => xt({ ...ho[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), ic = ["round", "linear", "spot"], sc = ["rect", "circle"], Ee = (e, t) => e.map((n) => ({ v: n, label: f(`${t}.${n}`) }));
function po(e, t, n, i) {
  const s = (r, a, l) => O(`${f(a)}, ${f("unit.mm")}`, ee(e, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => O(`${f(a)}, ${f("unit.deg")}`, ee(e, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (t.kind) {
    case "ceiling_light":
      return b`
        ${O(f("props.shape"), K(t.shape, Ee([...ic], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? b`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(`${f("props.poolRadius")}, ${f("unit.mm")}`, xt({
        ...ho.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: f("props.poolHint"),
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
      return O(`${f("props.diameter")}, ${f("unit.mm")}`, b`<select class="val" data-field=${`${n}diameter`}
        .value=${G(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${Zo.map((r) => b`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "climate_sensor":
      return n === "" && e.device && e.level ? lc(e.level, e.device, t.zoneIds, i) : ac();
    case "equipment":
      return b`
        ${O(f("props.shape"), K(t.shape, Ee([...sc], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? b`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(f("props.icon"), rc(e, t.icon, `${n}icon`, i))}
        ${O(f("props.label"), b`<input class="val wide" type="text" data-field=${`${n}label`} .value=${G(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return b`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const oc = /^mdi:[a-z0-9-]+$/;
function rc(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!oc.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, f("props.badIcon"));
      return;
    }
    (l = e.onNotice) == null || l.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? b`<ha-icon-picker data-field=${n} .value=${G(t)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : b`<input class="val wide" type="text" data-field=${n} .value=${G(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
const ac = () => b`${$}`;
function lc(e, t, n, i) {
  var o;
  const s = n.length === 0 ? (o = e.zones.find((r) => r.id === ga(e, t))) == null ? void 0 : o.name : void 0;
  return b`<fieldset class="zones" data-field="zoneIds"><legend>${f("props.zones")}${n.length === 0 ? b` (${f("props.zonesAuto")}${s ? `: ${s}` : ""})` : $}</legend>
    ${e.zones.map((r) => b`<label class="row"><input type="checkbox" data-zone=${r.id} .checked=${n.includes(r.id)}
      @change=${(a) => {
    const l = a.target.checked, c = e.zones.map((p) => p.id).filter((p) => p === r.id ? l : n.includes(p));
    i({ zoneIds: c }) || (a.target.checked = !l);
  }} /><span>${r.name}</span></label>`)}
  </fieldset>`;
}
function cc(e, t) {
  const n = t.placement;
  if (n.mode === "free")
    return O(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      ee(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = ds.has(t.props.kind);
  return b`
    ${O(f("props.side"), K(n.side, Ee(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${O(`${f("props.offset")}, ${f("unit.mm")}`, ee(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? O(
    `${f("props.aim")}, ${f("unit.deg")}`,
    ee(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(Ys(n, s)))
  ) : $}`;
}
function fo(e, t) {
  return O(f("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${G(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function dc(e, t) {
  const n = t.props.kind;
  return de(n) ? n === "smart_button" && t.placement.mode === "free" ? b`<p class="muted" data-note="type-free">${f("props.typeFreeHint")}</p>` : O(f("props.type"), K(
    n,
    Ee(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : $;
}
function uc(e, t) {
  return b`
    <h4>${f(`device.${t.props.kind}`)}</h4>
    ${fo(t, (n) => e.onDevice({}, n))}
    ${dc(e, t)}
    ${po(e, t.props, "", (n) => e.onDevice(n))}
    ${cc(e, t)}
    ${t.invalid ? b`<p class="warn">${f("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${f("action.delete")}</button>`;
}
function hc(e) {
  return e.device ? uc(e, e.device) : e.nextKind && e.nextProps ? b`
      <h4>${f("props.nextDevice")}: ${f(`device.${e.nextKind}`)}</h4>
      ${po(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}` : b`<p class="muted">${f("props.none")}</p>`;
}
function pc(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((r) => r.id === n.id) ?? null : null, s = ec(e.toolId) ? e.toolId : null, o = (r) => r === t ? (e.setNotice(f("props.noFit")), !1) : (e.setNotice(null), e.commit(r), !0);
  return b`<div class="props">
    ${hc({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (r, a) => !!i && o(Le(t, i.id, r, a)),
    onKind: (r) => !!i && o(zr(t, i.id, r)),
    onPlacement: (r) => !!i && o(On(t, i.id, r)),
    onNext: (r) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && e.commit(Ss(t, i.id));
    },
    onNotice: (r) => e.setNotice(r)
  })}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
  </div>`;
}
function go(e, t, n) {
  return xt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function Hi(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function fc(e, t) {
  const n = it(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(ea(t.level, e.id, o));
  return b`
    <h4>${f("props.wall")}</h4>
    ${O(f("props.type"), K(
    e.type,
    i.map((o) => ({ v: o, label: f(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${O(f("props.thickness"), go(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${O(f("props.baseline"), K(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: f(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${O(f("props.length"), b`<span class="val ro">${At(n)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(Cn(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function gc(e, t) {
  const n = ["door", "window", "opening", ..._e.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(Wr(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = _e.includes(e.kind);
  return b`
    <h4>${f(`kind.${e.kind}`)}</h4>
    ${O(f("props.kind"), K(e.kind, n.map((r) => ({ v: r, label: f(`kind.${r}`) })), (r) => i(qr(e, r))))}
    ${O(f("props.width"), go(t, e.width, (r) => Hi(t, jr(t.level, e.id, r))))}
    ${O(f("props.offset"), xt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => Hi(t, Cs(t.level, e.id, r))
  }))}
    ${o ? b`
      ${O(f("props.hinge"), K(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${O(f("props.swing"), K(e.swing ?? "left", s, (r) => i({ swing: r })))}` : $}
    ${e.kind === "window" ? O(f("props.outside"), K(e.outside ?? "left", s, (r) => i({ outside: r }))) : $}
    ${O(f("props.passesLight"), b`<input type="checkbox" data-field="passesLight" .checked=${G(Os(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Ps(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? b`<p class="warn">${f("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(Ls(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function mc(e, t) {
  return b`
    <h4>${f("props.zone")}</h4>
    ${O(f("props.name"), b`<input class="val wide" type="text" .value=${G(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(Br(t.level, e.id, s));
  }} />`)}
    ${O(f("props.area"), b`<span class="val ro">${Qs(Ms(e.outline))}</span>`)}
    ${e.broken ? b`<p class="warn">${f("props.broken")}</p>` : $}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(Is(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function bc(e) {
  const t = ["bearing", "partition", "railing"];
  return b`
    <h4>${f("props.newWall")}</h4>
    ${O(f("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => b`<option value=${n} ?selected=${n === e.wallType}>${f(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${O(`${f("props.thickness")}, ${f("unit.mm")}`, xt({
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
      <div class="muted">${f("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => b`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${f(`measure.${n}`)}</button>`)}
      </div>` : $}`;
}
function yc(e) {
  const { level: t, selection: n } = e;
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = fc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = gc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = mc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = b`<h4>${f("props.node")}</h4>
      ${O("X", b`<span class="val ro">${At(s.x)}</span>`)}${O("Y", b`<span class="val ro">${At(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === $ && (e.tool === "wall" || e.tool === "box") ? bc(e) : i === $ && Yl(e.tool) ? Zl({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === $ ? b`<p class="muted">${f("props.none")}</p>` : i}
      ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
    </div>`;
}
function vc(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const ji = /* @__PURE__ */ new WeakMap();
function $c(e, t, n) {
  let i = ji.get(e);
  i || ji.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : vc(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function tn(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = (e) => e ?? $;
var wc = Object.defineProperty, pe = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && wc(t, n, s), s;
};
const xc = 100;
let kc = 0;
const _c = (e) => b`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${e}></path>`}</svg>`, Bn = class Bn extends Tt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${kc++}`, this.shown = null, this.onOutside = (t) => {
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
        if (s.length === xc) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${fe(this.label || void 0)} title=${fe(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? b`<button class="x" type="button" title=${f("combo.clear")} aria-label=${f("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : $}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return b`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${fe(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => b`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${fe(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? b`<div class="empty">${this.emptyText()}</div>` : $}
      ${n ? b`<div class="hint">${f("combo.more")}</div>` : $}
    </div>`;
  }
  render() {
    return b`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : $}</div>`;
  }
};
Bn.styles = Xi`
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
let wt = Bn;
pe([
  ut()
], wt.prototype, "value");
pe([
  ut()
], wt.prototype, "label");
pe([
  R()
], wt.prototype, "isOpen");
pe([
  R()
], wt.prototype, "query");
pe([
  R()
], wt.prototype, "active");
var Sc = Object.defineProperty, Fn = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Sc(t, n, s), s;
};
const Ec = {
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
}, qi = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Mc = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Wi(e, t) {
  return e != null && e.deviceClass && qi[e.deviceClass] ? qi[e.deviceClass] : Mc[(e == null ? void 0 : e.domain) ?? zs(t)] ?? "generic";
}
const Vi = (e) => _c(Ec[e]);
function Ac(e) {
  switch (e) {
    case "sensor":
      return f("combo.domain.sensor");
    case "binary_sensor":
      return f("combo.domain.binary_sensor");
    case "light":
      return f("combo.domain.light");
    case "switch":
      return f("combo.domain.switch");
    case "fan":
      return f("combo.domain.fan");
    case "event":
      return f("combo.domain.event");
    default:
      return e;
  }
}
class Be extends wt {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = tn(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? tn(this.meta, t) : null;
    return b`${Vi(t ? Wi(this.meta.entities.get(t), t) : "generic")}
      ${n ? b`<span><b>${n.name}</b>${n.context !== n.name ? b`<small>${n.context}</small>` : $}<small class="eid">${t}</small></span>` : b`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Fs(this.states, t.entityId) ?? "unavailable";
    return b`${Vi(Wi(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Ac(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = tn(this.meta, t).name;
    return n === t ? t : `${n} (${t})`;
  }
  rowTitle(t) {
    return t.name === t.id ? t.id : `${t.name} (${t.id})`;
  }
  searchLabel() {
    return f("combo.search");
  }
  emptyText() {
    return f("combo.empty");
  }
}
Fn([
  ut({ attribute: !1 })
], Be.prototype, "meta");
Fn([
  ut({ attribute: !1 })
], Be.prototype, "items");
Fn([
  ut({ attribute: !1 })
], Be.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Be);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ic = Dn(class extends Rn {
  constructor(e) {
    if (super(e), e.type !== pt.PROPERTY && e.type !== pt.ATTRIBUTE && e.type !== pt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!to(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === et || t === $) return t;
    const n = e.element, i = e.name;
    if (e.type === pt.PROPERTY) {
      if (t === n[i]) return et;
    } else if (e.type === pt.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return et;
    } else if (e.type === pt.ATTRIBUTE && n.getAttribute(i) === t + "") return et;
    return eo(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), ne(s, t);
  return !0;
}, Me = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, mo = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), Nc(t);
  }
};
function Pc(e) {
  this._$AN !== void 0 ? (Me(this), this._$AM = e, mo(this)) : this._$AM = e;
}
function Oc(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) ne(i[o], !1), Me(i[o]);
  else i != null && (ne(i, !1), Me(i));
  else ne(this, e);
}
const Nc = (e) => {
  e.type == pt.CHILD && (e._$AP ?? (e._$AP = Oc), e._$AQ ?? (e._$AQ = Pc));
};
class Cc extends Rn {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), mo(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (ne(this, t), Me(this));
  }
  setValue(t) {
    if (to(this._$Ct)) this._$Ct._$AI(t, this);
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
const Lc = () => new Tc();
class Tc {
}
const en = /* @__PURE__ */ new WeakMap(), Dc = Dn(class extends Cc {
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
      let n = en.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), en.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = en.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), Rc = { min: 0, max: 9 }, zc = { min: 1, max: 10 };
function bo(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const Ae = (e, t, n) => bo(e, Le(e.level, t.id, n));
function nn(e, t, n, i) {
  return b`<div class="cflag">${O(t, b`<input type="checkbox" data-field=${e} .checked=${G(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
function Uc(e, t, n) {
  const i = as(n).map((s) => ({ v: s, label: f(`output.${s}`) }));
  return O(
    f("binding.defaultOutput"),
    K(n.defaultOutput, i, (s) => Ae(e, t, { defaultOutput: s }), "defaultOutput")
  );
}
const sn = "__other", Zt = /* @__PURE__ */ new Set();
function Fc(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = ei.includes(i), a = !r || Zt.has(o), l = Lc(), c = [...ei.map((d) => ({ v: d, label: d })), { v: sn, label: f("binding.eventOther") }];
  return b`<span class="evfield">${K(a ? sn : i, c, (d) => {
    if (d === sn) {
      Zt.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    Zt.delete(o), l.value && (l.value.hidden = !0), d !== i ? s(d) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${Dc(l)} data-field=${`${n}-event-custom`} ?hidden=${Ic(!a)}
      .value=${G(r ? "" : i)} @change=${(d) => {
    var m;
    const u = d.target, h = u.value.trim();
    if (!h) {
      u.value = r ? "" : i, e.setFieldNotice(f("props.badEvent"));
      return;
    }
    if (u.value = h, e.setFieldNotice(null), h !== i) {
      s(h) && Zt.delete(o);
      return;
    }
    if (Zt.delete(o), r) {
      u.hidden = !0;
      const y = (m = u.parentElement) == null ? void 0 : m.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function Bc(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return b`${$}`;
  const s = i[n], o = (r) => Ae(e, t, { [n]: { ...s, ...r } });
  return b`<div class="trigger" data-trigger=${n}>
    ${O(f("binding.slot"), xt({
    value: s.slot,
    rule: Rc,
    bad: "props.badSlot",
    field: `${n}-slot`,
    skipSame: !0,
    setNotice: (r) => e.setFieldNotice(r),
    apply: (r) => o({ slot: r })
  }))}
    ${O(f("binding.event"), Fc(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function Hc(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return b`
      ${nn(
      "autoByDoubleToggle",
      f("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => Ae(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? b`<div class="cflag">${O(f("binding.window"), xt({
      value: i.windowSec,
      rule: zc,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => Ae(e, t, { windowSec: a })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return b`${$}`;
  const s = (a, l) => (c) => {
    var d, u;
    const p = Le(e.level, t.id, { [a]: c });
    return bo(e, c && !((d = t.bindings) != null && d[l]) ? rs(p, t.id, l, ((u = t.bindings) == null ? void 0 : u.on) ?? null) : p);
  }, o = s("separateOff", "off"), r = nn("autoEnabled", f("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : b`${nn("separateOff", f("binding.separateOff"), i.separateOff, o)}${i.separateOff ? $ : r}`;
}
function jc(e, t) {
  const n = t.props;
  return n.kind !== "wall_switch" && n.kind !== "smart_button" ? b`${$}` : b`<div class="cfields">
    ${Uc(e, t, n)}
    ${n.kind === "smart_button" && Yo(t).length ? b`<p class="warn" data-note="duplicate">${f("binding.duplicate")}</p>` : $}
  </div>`;
}
function qc(e, t) {
  return t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? f("binding.onOff") : f(`role.${t}`);
}
function Wc(e) {
  const t = f("output.line").replace("{output}", f(`output.${e.output}`));
  return e.fault === "not_configured" ? `${t} — ${f("output.defaultNotConfigured")}` : e.fault === "unavailable" ? `${t} — ${f("output.defaultUnavailable").replace("{entities}", (e.entities ?? []).join(", "))}` : t;
}
function Vc(e, t) {
  if (!de(t.props.kind)) return $;
  const n = e.feed.stateOf(t), i = n ? Wc(n) : e.feed.error ?? (e.feed.ready ? f("output.notSaved") : null);
  return i === null ? $ : b`<p class="note" data-field="output">${i}</p>`;
}
function Kc(e, t, n, i) {
  const s = Bs(e.meta, i, e.states), o = Go(e.level, t, n);
  return b`
    ${s === "missing" ? b`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : $}
    ${s === "unavailable" ? b`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : $}
    ${o.length ? b`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : $}`;
}
function Gc(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = qc(t, i);
  return b`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${$c(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const c = rs(e.level, t.id, i, l.detail.value);
    c !== e.level && e.commit(c);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && kn(i) ? Bc(e, t, i) : $}
    ${s ? Kc(e, t, i, s) : $}
  </div>`;
}
function Yc(e) {
  const t = e.device, n = _n(e.level.devices.map(e.status));
  return b`<div class="props bprops">
    ${e.notice ? b`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : $}
    ${e.fieldNotice ? b`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : $}
    ${e.registryError ? b`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${f(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${t ? b`
      <h4>${f(`device.${t.props.kind}`)}</h4>
      ${fo(t, (i) => e.commit(Le(e.level, t.id, {}, i)))}
      ${Vc(e, t)}
      ${Bt(t).map((i) => b`${Gc(e, t, i)}${Hc(e, t, i.role)}`)}
      ${jc(e, t)}` : b`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${f("binding.reload")}</button>
  </div>`;
}
function Zc(e, t) {
  return e.mode !== "binding" ? zl(e.mode, e.toolId, (n) => e.pickTool(n)) : Vl({
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
function Xc(e, t) {
  var i;
  const n = e.selection;
  return Yc({
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
function Qc(e, t) {
  if (e.mode === "binding") return Xc(e, t);
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (i) => e.commit(i),
    setNotice: (i) => {
      e.notice = i;
    }
  };
  return e.mode === "equipment" ? pc({ ...n, toolId: e.toolId, nextProps: e.nextProps, setNextProps: (i) => {
    e.nextProps = i;
  } }) : yc({
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
function Jc(e) {
  return b`
    <div class="status">
      ${e.binding ? $ : b`
        <span><span class="kbd">Shift</span> ${f("hint.shift")}</span>
        <span><span class="kbd">${f("hint.digits")}</span> ${f("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${f("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${f(e.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${e.snap ? b`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${f("status.grid")}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${f("status.cones")}
      </label>
    </div>`;
}
function td(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: f(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: f("unit.mm")
    },
    {
      label: f(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? f("unit.mm") : "°"
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
function ed(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: c } = s[0], p = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: At(p), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: At(r), second: At(a) };
}
function nd(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const id = Xi`
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
  @media (max-width: 700px) {
    .ed { grid-template-columns: 54px 170px 1fr; }
    .ed.binding { grid-template-columns: 170px 200px 1fr; }
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
  .steps { display: grid; grid-template-columns: minmax(150px, 1.2fr) repeat(4, minmax(112px, 1fr)) auto;
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
    .steps { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .steps .title, .steps .nav { grid-column: 1 / -1; border-right: 0; }
    .steps .title { border-bottom: 1px solid var(--ch-divider); }
    .steps .nav { border-top: 1px solid var(--ch-divider); }
    .step { padding: 6px 10px; }
  }

  /* Left rail: tools, or the binding device list. */
  .tools { background: var(--ch-card); border-right: 1px solid var(--ch-divider); display: flex;
    flex-direction: column; align-items: center; gap: 4px; padding-top: 8px; }
  .tool { width: 54px; height: 40px; border-radius: 8px; border: 0; background: transparent; font-size: 11px;
    color: var(--ch-muted); line-height: 1.1; padding: 0 2px; }
  .tool:hover { background: var(--ch-hover); color: var(--ch-text); }
  .tool.on { background: var(--ch-tint); color: var(--ch-primary); font-weight: 500; }
  .tool-sep { height: 1px; width: 36px; background: var(--ch-divider); margin: 4px 0; }
  .blist { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--ch-card);
    border-right: 1px solid var(--ch-divider); }
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
  .brow { display: grid; grid-template-columns: 12px minmax(0, 1fr) auto; gap: 10px; align-items: center; width: 100%;
    padding: 6px 12px; border: 0; background: none; color: var(--ch-text); text-align: left; }
  .brow:hover { background: var(--ch-hover); }
  .brow.sel { background: var(--ch-tint); box-shadow: inset 3px 0 0 var(--ch-primary); }
  .brow .name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .brow .kind { display: block; color: var(--ch-muted); font-size: 12px; }
  .brow .cnt { color: var(--ch-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
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
     reveal; the default output after the roles. */
  .trigger .row { margin: 4px 0; }
  .cflag { margin-top: 10px; }
  .cflag .row { margin: 0; }
  .cflag input[type="checkbox"] { margin: 0; }
  .cfields { margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--ch-divider); }
  .reg-error { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px;
    border: 1px solid var(--ch-error); border-radius: 8px; }
  .reg-error .warn { flex: 1; margin: 0; }
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
`, sd = 5e-3, od = 2, bn = (e) => Math.max(sd, Math.min(od, e));
function rd(e, t, n) {
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
function ad(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: bn(Math.min(t, n) / 12e3) };
  const i = e.map((d) => d.x), s = e.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, p = bn(Math.min(t / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - t / p / 2, y: (l + c) / 2 - n / p / 2, scale: p };
}
function ld(e, t, n) {
  const i = bn(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function cd(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function dd(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function ud(e, t, n, i) {
  const s = 100 * e.scale >= 6 ? 100 : 1e3, o = 1 / e.scale;
  return M`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${o}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${o}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const hd = ["Shift", "Control", "Alt", "Meta"];
function Ki(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class pd {
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
        this.h.view = cd(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = ld(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Ki(n) || !this.h.history) return;
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
      if (!o && (n.key === "Delete" || n.key === "Backspace") && (o = this.h.deleteSelection()), !o && n.key === "Escape") {
        const r = this.h.mode === "plan" ? "select" : this.h.mode === "equipment" ? "device-select" : null;
        r && this.h.toolId !== r ? this.h.pickTool(r) : (this.h.activeTool.cancel(), this.h.selection = null), o = !0;
      }
      o && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Ki(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !hd.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function yo(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function fd(e) {
  return b`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", yo(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function Xt(e, t, n, i) {
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
function gd(e) {
  var n;
  const t = { action: "cancel", label: f("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? Xt(f("draft.title"), f("draft.text").replace("{time}", yo(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => e.discard(i) }
      ]) : $;
    }
    case "new":
      return Xt(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return Xt(f("delete.title"), f("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return Xt(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return Xt(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return $;
  }
}
const Qt = "plan_studio.draft.", ge = "plan_studio.lastPlanId";
function md() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function bd(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class yd {
  constructor(t = md, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Qt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Qt + t), s = i ? JSON.parse(i) : null;
      return bd(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(Qt))) continue;
        const o = this.read(s.slice(Qt.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(ge)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(ge, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(ge)) === t && n.removeItem(ge);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Qt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const vd = 5e3, $d = 12;
function Gi(e) {
  e().catch(() => {
  });
}
class wd {
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
   * Ends the subscription (also one still being set up), cancels the retries, stops listening to the connection
   * and forgets the outputs; any plan can be watched again.
   */
  stop() {
    this.unlisten(), this.cancelRetry(), this.retries = 0, this.drop(!0), this.planId = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null;
  }
  start() {
    var n, i;
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, t && n.unsub && Gi(n.unsub));
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
          Gi(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Et(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= $d || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, vd));
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
var xd = Object.defineProperty, z = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && xd(t, n, s), s;
};
const Hn = class Hn extends Tt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Xo.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.cones = !0, this.nextProps = nc(), this.nextObj = Kl(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new yd(), this.resizeObs = null, this.session = new Ql(this), this.haMeta = new Jl(this), this.feed = new wd(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Wo(i, (s) => {
      var o;
      return Bs(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Ia(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = tc(this), this.activeTool = mn("select", this.ctx), this.input = new pd(this);
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
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !Qe(t, this.selection) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null), this.requestUpdate());
  }
  /** Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the Binding step. */
  deleteSelection() {
    var i;
    const t = this.selection, n = (i = this.history) == null ? void 0 : i.current;
    return this.mode === "binding" || !t || !n || t.kind === "node" || !Qe(n, t) ? !1 : (this.commit(t.kind === "wall" ? Cn(n, t.id) : t.kind === "opening" ? Ls(n, t.id) : t.kind === "device" ? Ss(n, t.id) : Is(n, t.id)), !0);
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
    this.selection = this.mode === "binding" && n && i && Qe(i, n) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = mn(t, this.ctx);
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(Un(t)[0]), t === "binding" && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    var o;
    const n = (o = this.history) == null ? void 0 : o.current, i = n == null ? void 0 : n.devices.find((r) => r.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = Q(n, i);
    s && (this.view = dd(this.view, s.pt, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i, s;
    const t = (i = this.history) == null ? void 0 : i.current, n = t ? jl(t, ((s = this.selection) == null ? void 0 : s.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return rd(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = ad(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return gd({
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
    var p, d, u;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const t = pl(!!((d = (p = this.hass) == null ? void 0 : p.themes) != null && d.darkMode)), n = this.history.current, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save;
    return b`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : ""}" style=${nd(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Rl({
      steps: Fl({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        planName: this.plan.name,
        onRename: (h) => {
          this.plan = { ...this.plan, name: h }, c.markDirty();
        },
        onMode: (h) => this.setMode(h),
        onNextUnbound: () => this.nextUnboundDevice()
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (h) => this.session.pickPlan(h),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Zc(this, n)}
        ${Qc(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(h) => h.preventDefault()}>
            ${this.grid ? ud(this.view, a, l, t) : $}
            ${dl(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (h) => this.feed.stateOf(h)
    })}
            ${i.tracker ? td(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: ed(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${this.pendingDraft && ((u = this.dialog) == null ? void 0 : u.kind) !== "restore" ? fd({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${Jc({
      grid: this.grid,
      zoomPct: Math.round(r * 1e3),
      snap: i.snap && i.snap.kind !== "none" ? f(`snap.${i.snap.kind}`) : null,
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
Hn.styles = id;
let T = Hn;
z([
  ut({ attribute: !1 })
], T.prototype, "hass");
z([
  ut({ type: Boolean })
], T.prototype, "narrow");
z([
  ut({ attribute: !1 })
], T.prototype, "panel");
z([
  R()
], T.prototype, "plan");
z([
  R()
], T.prototype, "loadError");
z([
  R()
], T.prototype, "selection");
z([
  R()
], T.prototype, "toolId");
z([
  R()
], T.prototype, "wallType");
z([
  R()
], T.prototype, "thickness");
z([
  R()
], T.prototype, "boxMeasure");
z([
  R()
], T.prototype, "grid");
z([
  R()
], T.prototype, "mode");
z([
  R()
], T.prototype, "bindFilter");
z([
  R()
], T.prototype, "bindQuery");
z([
  R()
], T.prototype, "railCollapsed");
z([
  R()
], T.prototype, "showAll");
z([
  R()
], T.prototype, "cones");
z([
  R()
], T.prototype, "nextProps");
z([
  R()
], T.prototype, "nextObj");
z([
  R()
], T.prototype, "view");
z([
  R()
], T.prototype, "size");
z([
  R()
], T.prototype, "dialog");
z([
  R()
], T.prototype, "notice");
z([
  R()
], T.prototype, "fieldNotice");
z([
  R()
], T.prototype, "pendingDraft");
z([
  R()
], T.prototype, "plans");
z([
  R()
], T.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", T);
export {
  T as PlanStudioPanel
};
