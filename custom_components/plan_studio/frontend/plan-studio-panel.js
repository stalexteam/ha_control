/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = globalThis, vn = me.ShadowRoot && (me.ShadyCSS === void 0 || me.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $n = Symbol(), qn = /* @__PURE__ */ new WeakMap();
let Xi = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== $n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (vn && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = qn.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && qn.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ko = (e) => new Xi(typeof e == "string" ? e : e + "", void 0, $n), Qi = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new Xi(n, e, $n);
}, _o = (e, t) => {
  if (vn) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = me.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, Wn = vn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return ko(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: So, defineProperty: Eo, getOwnPropertyDescriptor: Mo, getOwnPropertyNames: Ao, getOwnPropertySymbols: Io, getPrototypeOf: Po } = Object, bt = globalThis, Vn = bt.trustedTypes, Oo = Vn ? Vn.emptyScript : "", Be = bt.reactiveElementPolyfillSupport, te = (e, t) => e, ve = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Oo : null;
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
} }, wn = (e, t) => !So(e, t), Kn = { attribute: !0, type: String, converter: ve, reflect: !1, useDefault: !1, hasChanged: wn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), bt.litPropertyMetadata ?? (bt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Ct = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Kn) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && Eo(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Mo(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Kn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(te("elementProperties"))) return;
    const t = Po(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(te("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(te("properties"))) {
      const n = this.properties, i = [...Ao(n), ...Io(n)];
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
      for (const s of i) n.unshift(Wn(s));
    } else t !== void 0 && n.push(Wn(t));
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
    return _o(t, this.constructor.elementStyles), t;
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
      const d = l.fromAttribute(n, a.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? wn)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
Ct.elementStyles = [], Ct.shadowRootOptions = { mode: "open" }, Ct[te("elementProperties")] = /* @__PURE__ */ new Map(), Ct[te("finalized")] = /* @__PURE__ */ new Map(), Be == null || Be({ ReactiveElement: Ct }), (bt.reactiveElementVersions ?? (bt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ee = globalThis, Gn = (e) => e, $e = ee.trustedTypes, Zn = $e ? $e.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ji = "$lit$", ft = `lit$${Math.random().toFixed(9).slice(2)}$`, ts = "?" + ft, Co = `<${ts}>`, At = document, se = () => At.createComment(""), oe = (e) => e === null || typeof e != "object" && typeof e != "function", xn = Array.isArray, No = (e) => xn(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", He = `[ 	
\f\r]`, Gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Yn = /-->/g, Xn = />/g, xt = RegExp(`>|${He}(?:([^\\s"'>=/]+)(${He}*=${He}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Qn = /'/g, Jn = /"/g, es = /^(?:script|style|textarea|title)$/i, ns = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), b = ns(1), M = ns(2), et = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), ti = /* @__PURE__ */ new WeakMap(), kt = At.createTreeWalker(At, 129);
function is(e, t) {
  if (!xn(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Zn !== void 0 ? Zn.createHTML(t) : t;
}
const Lo = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = Gt;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let d, p, c = -1, h = 0;
    for (; h < l.length && (r.lastIndex = h, p = r.exec(l), p !== null); ) h = r.lastIndex, r === Gt ? p[1] === "!--" ? r = Yn : p[1] !== void 0 ? r = Xn : p[2] !== void 0 ? (es.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = xt) : p[3] !== void 0 && (r = xt) : r === xt ? p[0] === ">" ? (r = s ?? Gt, c = -1) : p[1] === void 0 ? c = -2 : (c = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? xt : p[3] === '"' ? Jn : Qn) : r === Jn || r === Qn ? r = xt : r === Yn || r === Xn ? r = Gt : (r = xt, s = void 0);
    const u = r === xt && e[a + 1].startsWith("/>") ? " " : "";
    o += r === Gt ? l + Co : c >= 0 ? (i.push(d), l.slice(0, c) + Ji + l.slice(c) + ft + u) : l + ft + (c === -2 ? a : u);
  }
  return [is(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class re {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [d, p] = Lo(t, n);
    if (this.el = re.createElement(d, i), kt.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = kt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Ji)) {
          const h = p[r++], u = s.getAttribute(c).split(ft), m = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: m[2], strings: u, ctor: m[1] === "." ? Do : m[1] === "?" ? Ro : m[1] === "@" ? zo : Ae }), s.removeAttribute(c);
        } else c.startsWith(ft) && (l.push({ type: 6, index: o }), s.removeAttribute(c));
        if (es.test(s.tagName)) {
          const c = s.textContent.split(ft), h = c.length - 1;
          if (h > 0) {
            s.textContent = $e ? $e.emptyScript : "";
            for (let u = 0; u < h; u++) s.append(c[u], se()), kt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(c[h], se());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ts) l.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(ft, c + 1)) !== -1; ) l.push({ type: 7, index: o }), c += ft.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = At.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Dt(e, t, n = e, i) {
  var r, a;
  if (t === et) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = oe(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Dt(e, s._$AS(e, t.values), s, i)), t;
}
class To {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? At).importNode(n, !0);
    kt.currentNode = s;
    let o = kt.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new kn(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new Uo(o, this, t)), this._$AV.push(d), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = kt.nextNode(), r++);
    }
    return kt.currentNode = At, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let kn = class ss {
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
    t = Dt(this, t, n), oe(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== et && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : No(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && oe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(At.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = re.createElement(is(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new To(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = ti.get(t.strings);
    return n === void 0 && ti.set(t.strings, n = new re(t)), n;
  }
  k(t) {
    xn(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new ss(this.O(se()), this.O(se()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = Gn(t).nextSibling;
      Gn(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class Ae {
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
    if (o === void 0) t = Dt(this, t, n, 0), r = !oe(t) || t !== this._$AH && t !== et, r && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = Dt(this, a[i + l], n, l), d === et && (d = this._$AH[l]), r || (r = !oe(d) || d !== this._$AH[l]), d === $ ? t = $ : t !== $ && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Do extends Ae {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Ro extends Ae {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
let zo = class extends Ae {
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
class Uo {
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
const je = ee.litHtmlPolyfillSupport;
je == null || je(re, kn), (ee.litHtmlVersions ?? (ee.litHtmlVersions = [])).push("3.3.3");
const Fo = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new kn(t.insertBefore(se(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = globalThis;
let Tt = class extends Ct {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Fo(n, this.renderRoot, this.renderOptions);
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
Tt._$litElement$ = !0, Tt.finalized = !0, (Yi = Et.litElementHydrateSupport) == null || Yi.call(Et, { LitElement: Tt });
const qe = Et.litElementPolyfillSupport;
qe == null || qe({ LitElement: Tt });
(Et.litElementVersions ?? (Et.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bo = { attribute: !0, type: String, converter: ve, reflect: !1, hasChanged: wn }, Ho = (e = Bo, t, n) => {
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
  return (t, n) => typeof n == "object" ? Ho(e, t, n) : ((i, s, o) => {
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
function os(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const ei = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, jo = ["on", "off", "auto"], _n = (e) => jo.includes(e), We = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), qo = {
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
  smart_button: [We("on"), We("off"), We("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, ei],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, ei]
}, Sn = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, Wo = { climate_sensor: "any" };
function Bt(e) {
  const t = e.props, n = qo[t.kind];
  return t.kind !== "smart_button" ? n : n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
}
function rs(e) {
  return new Set(Bt(e).map((t) => t.role));
}
function as(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !rs(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const d = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete d.bindings, { ...e, devices: e.devices.map((p) => p === s ? d : p) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function Vo(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = Bt(e).filter((a) => a.primary), o = s.filter((a) => !!n[a.role]);
  return (Wo[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Ko(e) {
  const t = Bt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const Go = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function on(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !_n(t) ? n : `${n}|${Go(i[t])}`;
}
function Zo(e, t, n) {
  const i = on(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && Bt(s).some((o) => on(s, o.role) === i));
}
function Yo(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Bt(e)) {
    const s = _n(i) ? on(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function En(e) {
  if (!e.bindings) return e;
  const t = rs(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Ht = (e) => e === "wall_switch" || e === "smart_button", Xo = [100, 125, 150], Mn = "mdi:cube-outline", ni = ["single", "double", "hold"], Qo = {
  bearing: 400
}, be = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function ls(e = X(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function ii(e) {
  return {
    id: X(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [ls()]
  };
}
const An = {
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
}, Rt = 90, cs = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function It(e, t) {
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
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Mn, label: "" };
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
const Jo = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Mn
};
function tr(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : Jo[String(n)] ?? Mn;
  return { ...e, props: { ...i, icon: s } };
}
function er(e) {
  var n;
  if (e.props.kind !== "switch") return e;
  const t = (n = e.bindings) == null ? void 0 : n.action;
  return t ? { ...e, props: It("smart_button", e.placement.mode), bindings: { on: t } } : { ...e, props: It("wall_switch", e.placement.mode) };
}
const ds = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function nr(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = ds(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function ir(e) {
  const t = e.props.kind;
  if (!Ht(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(It(t, e.placement.mode))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? nr(r, o) : s === "windowSec" ? ds(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function sr(e) {
  if (!Ht(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function or(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => En(sr(ir(er(tr(n))))));
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
function us(e) {
  return Math.hypot(e.x, e.y);
}
function L(e, t) {
  return us(A(t, e));
}
function Ie(e) {
  const t = us(e);
  return t === 0 ? { x: 0, y: 0 } : E(e, 1 / t);
}
function Y(e) {
  return { x: e.y, y: -e.x };
}
function rr(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function lt(e, t, n, i) {
  const s = nt(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = nt(A(n, e), i) / s;
  return P(e, E(t, o));
}
function In(e, t, n) {
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
function ar(e, t) {
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
function Ve(e, t, n, i) {
  const s = new $t(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = gt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function si(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = gt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function lr(e, t, n) {
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
class Pn {
  constructor(t = ar) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = Ve(t, n, this._root, this._comparator);
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
    return dr(this._root);
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
      const r = ur(
        this.toList(),
        cr(t, n),
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
    let { left: o, right: r } = si(t, this._root, s);
    s(t, n) < 0 ? r = Ve(n, i, r, s) : o = Ve(n, i, o, s), this._root = lr(o, r, s);
  }
  split(t) {
    return si(t, this._root, this._comparator);
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
function cr(e, t) {
  const n = new $t(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new $t(e[s], t[s]);
  return i.next = null, n.next;
}
function dr(e) {
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
function ur(e, t, n) {
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
const ct = 11102230246251565e-32, W = 134217729, hr = (3 + 8 * ct) * ct;
function Ke(e, t, n, i, s) {
  let o, r, a, l, d = t[0], p = i[0], c = 0, h = 0;
  p > d == p > -d ? (o = d, d = t[++c]) : (o = p, p = i[++h]);
  let u = 0;
  if (c < e && h < n)
    for (p > d == p > -d ? (r = d + o, a = o - (r - d), d = t[++c]) : (r = p + o, a = o - (r - p), p = i[++h]), o = r, a !== 0 && (s[u++] = a); c < e && h < n; )
      p > d == p > -d ? (r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c]) : (r = o + p, l = r - o, a = o - (r - l) + (p - l), p = i[++h]), o = r, a !== 0 && (s[u++] = a);
  for (; c < e; )
    r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c], o = r, a !== 0 && (s[u++] = a);
  for (; h < n; )
    r = o + p, l = r - o, a = o - (r - l) + (p - l), p = i[++h], o = r, a !== 0 && (s[u++] = a);
  return (o !== 0 || u === 0) && (s[u++] = o), u;
}
function pr(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function w(e) {
  return new Float64Array(e);
}
const fr = (3 + 16 * ct) * ct, gr = (2 + 12 * ct) * ct, mr = (9 + 64 * ct) * ct * ct, Ot = w(4), oi = w(8), ri = w(12), ai = w(16), K = w(4);
function br(e, t, n, i, s, o, r) {
  let a, l, d, p, c, h, u, m, y, v, g, x, S, _, k, I, C, N;
  const D = e - s, B = n - s, q = t - o, Z = i - o;
  _ = D * Z, h = W * D, u = h - (h - D), m = D - u, h = W * Z, y = h - (h - Z), v = Z - y, k = m * v - (_ - u * y - m * y - u * v), I = q * B, h = W * q, u = h - (h - q), m = q - u, h = W * B, y = h - (h - B), v = B - y, C = m * v - (I - u * y - m * y - u * v), g = k - C, c = k - g, Ot[0] = k - (g + c) + (c - C), x = _ + g, c = x - _, S = _ - (x - c) + (g - c), g = S - I, c = S - g, Ot[1] = S - (g + c) + (c - I), N = x + g, c = N - x, Ot[2] = x - (N - c) + (g - c), Ot[3] = N;
  let at = pr(4, Ot), Kt = gr * r;
  if (at >= Kt || -at >= Kt || (c = e - D, a = e - (D + c) + (c - s), c = n - B, d = n - (B + c) + (c - s), c = t - q, l = t - (q + c) + (c - o), c = i - Z, p = i - (Z + c) + (c - o), a === 0 && l === 0 && d === 0 && p === 0) || (Kt = mr * r + hr * Math.abs(at), at += D * p + Z * a - (q * d + B * l), at >= Kt || -at >= Kt)) return at;
  _ = a * Z, h = W * a, u = h - (h - a), m = a - u, h = W * Z, y = h - (h - Z), v = Z - y, k = m * v - (_ - u * y - m * y - u * v), I = l * B, h = W * l, u = h - (h - l), m = l - u, h = W * B, y = h - (h - B), v = B - y, C = m * v - (I - u * y - m * y - u * v), g = k - C, c = k - g, K[0] = k - (g + c) + (c - C), x = _ + g, c = x - _, S = _ - (x - c) + (g - c), g = S - I, c = S - g, K[1] = S - (g + c) + (c - I), N = x + g, c = N - x, K[2] = x - (N - c) + (g - c), K[3] = N;
  const $o = Ke(4, Ot, 4, K, oi);
  _ = D * p, h = W * D, u = h - (h - D), m = D - u, h = W * p, y = h - (h - p), v = p - y, k = m * v - (_ - u * y - m * y - u * v), I = q * d, h = W * q, u = h - (h - q), m = q - u, h = W * d, y = h - (h - d), v = d - y, C = m * v - (I - u * y - m * y - u * v), g = k - C, c = k - g, K[0] = k - (g + c) + (c - C), x = _ + g, c = x - _, S = _ - (x - c) + (g - c), g = S - I, c = S - g, K[1] = S - (g + c) + (c - I), N = x + g, c = N - x, K[2] = x - (N - c) + (g - c), K[3] = N;
  const wo = Ke($o, oi, 4, K, ri);
  _ = a * p, h = W * a, u = h - (h - a), m = a - u, h = W * p, y = h - (h - p), v = p - y, k = m * v - (_ - u * y - m * y - u * v), I = l * d, h = W * l, u = h - (h - l), m = l - u, h = W * d, y = h - (h - d), v = d - y, C = m * v - (I - u * y - m * y - u * v), g = k - C, c = k - g, K[0] = k - (g + c) + (c - C), x = _ + g, c = x - _, S = _ - (x - c) + (g - c), g = S - I, c = S - g, K[1] = S - (g + c) + (c - I), N = x + g, c = N - x, K[2] = x - (N - c) + (g - c), K[3] = N;
  const xo = Ke(wo, ri, 4, K, ai);
  return ai[xo - 1];
}
function yr(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, d = Math.abs(r + a);
  return Math.abs(l) >= fr * d ? l : -br(e, t, n, i, s, o, d);
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
const Zt = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, dn = (e, t) => {
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
const vr = mt * mt, li = (e, t) => {
  if (-mt < e && e < mt && -mt < t && t < mt)
    return 0;
  const n = e - t;
  return n * n < vr * e * t ? 0 : e < t ? -1 : 1;
};
class $r {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new ci(), this.yRounder = new ci();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class ci {
  constructor() {
    this.tree = new Pn(), this.round(0);
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
    if (i !== null && li(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && li(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const ae = new $r(), ye = (e, t) => e.x * t.y - e.y * t.x, hs = (e, t) => e.x * t.x + e.y * t.y, di = (e, t, n) => {
  const i = yr(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, we = (e) => Math.sqrt(hs(e, e)), wr = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return ye(s, i) / we(s) / we(i);
}, xr = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return hs(s, i) / we(s) / we(i);
}, ui = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, hi = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, kr = (e, t, n, i) => {
  if (t.x === 0) return hi(n, i, e.x);
  if (i.x === 0) return hi(e, t, n.x);
  if (t.y === 0) return ui(n, i, e.y);
  if (i.y === 0) return ui(e, t, n.y);
  const s = ye(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = ye(o, t) / s, a = ye(o, i) / s, l = e.x + a * t.x, d = n.x + r * i.x, p = e.y + a * t.y, c = n.y + r * i.y, h = (l + d) / 2, u = (p + c) / 2;
  return {
    x: h,
    y: u
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
        sine: wr(this.point, t.point, o.point),
        cosine: xr(this.point, t.point, o.point)
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
let _r = 0;
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
    const a = t.leftSE.point.y, l = n.leftSE.point.y, d = t.rightSE.point.y, p = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < d) return 1;
      if (l > a && l > d) return -1;
      const c = t.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const h = n.comparePoint(t.rightSE.point);
      return h !== 0 ? h : -1;
    }
    if (i > s) {
      if (a < l && a < p) return -1;
      if (a > l && a > p) return 1;
      const c = n.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const h = t.comparePoint(n.rightSE.point);
      return h < 0 ? 1 : h > 0 ? -1 : 1;
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
      const c = d - a, h = o - i, u = p - l, m = r - s;
      if (c > h && u < m) return 1;
      if (c < h && u > m) return -1;
    }
    return o > r ? 1 : o < r || d < p ? -1 : d > p ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++_r, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = tt.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new tt(s, !0), d = new tt(o, !1);
    return new yt(l, d, [i], [r]);
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
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, d = Zt(n, a) && this.comparePoint(a) === 0, p = Zt(i, o) && t.comparePoint(o) === 0, c = Zt(n, l) && this.comparePoint(l) === 0, h = Zt(i, r) && t.comparePoint(r) === 0;
    if (p && d)
      return h && !c ? r : !h && c ? l : null;
    if (p)
      return c && o.x === l.x && o.y === l.y ? null : o;
    if (d)
      return h && r.x === a.x && r.y === a.y ? null : a;
    if (h && c) return null;
    if (h) return r;
    if (c) return l;
    const u = kr(o, this.vector(), a, t.vector());
    return u === null || !Zt(s, u) ? null : ae.round(u.x, u.y);
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
      const d = this.rings[a], p = this.windings[a], c = n.indexOf(d);
      c === -1 ? (n.push(d), i.push(p)) : i[c] += p;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const d = n[a], p = d.poly;
      if (r.indexOf(p) === -1)
        if (d.isExterior) o.push(p);
        else {
          r.indexOf(p) === -1 && r.push(p);
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
class pi {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = ae.round(t[0][0], t[0][1]);
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
      let l = ae.round(t[r][0], t[r][1]);
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
class Sr {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new pi(t[0], this, !0), this.bbox = {
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
      const o = new pi(t[i], this, !1);
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
class fi {
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
      const o = new Sr(t[i], this);
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
      const d = [a], p = a.point, c = [];
      for (; r = a, a = l, d.push(a), a.point !== p; )
        for (; ; ) {
          const h = a.getAvailableLinkedEvents();
          if (h.length === 0) {
            const y = d[0].point, v = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (h.length === 1) {
            l = h[0].otherSE;
            break;
          }
          let u = null;
          for (let y = 0, v = c.length; y < v; y++)
            if (c[y].point === a.point) {
              u = y;
              break;
            }
          if (u !== null) {
            const y = c.splice(u)[0], v = d.splice(y.index);
            v.unshift(v[0].otherSE), n.push(new xe(v.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: a.point
          });
          const m = a.getLeftmostComparator(r);
          l = h.sort(m)[0].otherSE;
          break;
        }
      n.push(new xe(d));
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
    for (let d = 1, p = this.events.length - 1; d < p; d++) {
      const c = this.events[d].point, h = this.events[d + 1].point;
      di(c, t, h) !== 0 && (n.push(c), t = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    di(i, t, s) === 0 && n.shift(), n.push(n[0]);
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
class gi {
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
class Er {
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
        if (o.isExteriorRing()) n.push(new gi(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new gi(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Mr {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : yt.compare;
    this.queue = t, this.tree = new Pn(n), this.segments = [];
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
          const h = this._splitSafely(a, c);
          for (let u = 0, m = h.length; u < m; u++)
            i.push(h[u]);
        }
      }
      let p = null;
      if (l) {
        const c = l.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (p = c), !l.isAnEndpoint(c))) {
          const h = this._splitSafely(l, c);
          for (let u = 0, m = h.length; u < m; u++)
            i.push(h[u]);
        }
      }
      if (d !== null || p !== null) {
        let c = null;
        d === null ? c = p : p === null ? c = d : c = tt.comparePoints(d, p) <= 0 ? d : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const h = n.split(c);
        for (let u = 0, m = h.length; u < m; u++)
          i.push(h[u]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const d = a.getIntersection(l);
        if (d !== null) {
          if (!a.isAnEndpoint(d)) {
            const p = this._splitSafely(a, d);
            for (let c = 0, h = p.length; c < h; c++)
              i.push(p[c]);
          }
          if (!l.isAnEndpoint(d)) {
            const p = this._splitSafely(l, d);
            for (let c = 0, h = p.length; c < h; c++)
              i.push(p[c]);
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
const mi = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Ar = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Ir {
  run(t, n, i) {
    st.type = t, ae.reset();
    const s = [new fi(n, !0)];
    for (let c = 0, h = i.length; c < h; c++)
      s.push(new fi(i[c], !1));
    if (st.numMultiPolys = s.length, st.type === "difference") {
      const c = s[0];
      let h = 1;
      for (; h < s.length; )
        dn(s[h].bbox, c.bbox) !== null ? h++ : s.splice(h, 1);
    }
    if (st.type === "intersection")
      for (let c = 0, h = s.length; c < h; c++) {
        const u = s[c];
        for (let m = c + 1, y = s.length; m < y; m++)
          if (dn(u.bbox, s[m].bbox) === null) return [];
      }
    const o = new Pn(tt.compare);
    for (let c = 0, h = s.length; c < h; c++) {
      const u = s[c].getSweepEvents();
      for (let m = 0, y = u.length; m < y; m++)
        if (o.insert(u[m]), o.size > mi)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Mr(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const c = l.key;
      if (o.size === a) {
        const u = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${u.id} [${u.leftSE.point.x}, ${u.leftSE.point.y}] -> [${u.rightSE.point.x}, ${u.rightSE.point.y}] from queue.`);
      }
      if (o.size > mi)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Ar)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const h = r.process(c);
      for (let u = 0, m = h.length; u < m; u++) {
        const y = h[u];
        y.consumedBy === void 0 && o.insert(y);
      }
      a = o.size, l = o.pop();
    }
    ae.reset();
    const d = xe.factory(r.segments);
    return new Er(d).getGeom();
  }
}
const st = new Ir(), Pr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("union", e, n);
}, Or = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("intersection", e, n);
}, Cr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("xor", e, n);
}, Nr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return st.run("difference", e, n);
};
var ps = {
  union: Pr,
  intersection: Or,
  xor: Cr,
  difference: Nr
};
const fs = 3, Lr = 1e-6;
function Pe(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function j(e, t) {
  const n = Pe(e, t);
  return { x: n.x, y: n.y };
}
function Oe(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function gs(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Ie(A(t, e)), len: L(e, t), leftOff: o, rightOff: r };
}
function it(e, t) {
  return gs(j(e, t.a), j(e, t.b), t.thickness, t.baseline);
}
function jt(e, t) {
  const n = A(t, e.a);
  return { t: F(n, e.dir), side: F(n, Y(e.dir)) };
}
function bi(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Nt = (e) => P(e.p, E(Y(e.u), e.offL)), Lt = (e) => A(e.p, E(Y(e.u), e.offR));
function _t(e, t, n) {
  return e !== null && L(e, t) <= n;
}
function Tr(e) {
  const t = [];
  for (const n of e.walls) {
    const i = it(e, n);
    if (i.len < 1e-9) continue;
    const s = Y(i.dir);
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
function Dr(e, t) {
  const n = t.f, i = Y(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = F(A(s.far, n.a), i) >= 0 ? P(n.a, E(i, n.leftOff)) : A(n.a, E(i, n.rightOff)), a = fs * Math.max(s.body.wall.thickness, t.wall.thickness), l = lt(Nt(s), s.u, r, n.dir), d = lt(Lt(s), s.u, r, n.dir);
    _t(l, s.p, a) && (s.body.c[s.leftKey] = l), _t(d, s.p, a) && (s.body.c[s.rightKey] = d);
  }
}
function Rr(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = fs * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = lt(Lt(o), o.u, Nt(r), r.u);
    _t(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = zr(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = A(r, o), l = nt(a, A(t, o)), d = nt(a, A(s.far, o));
    l * d < 0 && un(s, [t]);
  }
}
function un(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function zr(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(nt(o.u, r.u)) > 1e-9 || F(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], d = lt(Lt(o), o.u, Nt(l), l.u), p = lt(Nt(r), r.u, Nt(l), l.u);
        if (!_t(d, t, n) || !_t(p, t, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = p, un(o, [t, c, p]);
      } else {
        const l = e[(s - 1 + i) % i], d = lt(Nt(r), r.u, Lt(l), l.u), p = lt(Lt(o), o.u, Lt(l), l.u);
        if (!_t(p, t, n) || !_t(d, t, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = p, r.body.c[r.leftKey] = d, un(r, [p, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function ms(e) {
  const t = Tr(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(bi(r, "a")), r.wall.b === i.id && s.push(bi(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Dr(s, o) : s.length >= 2 && Rr(s, { x: i.x, y: i.y });
  }
  return t;
}
function bs(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function Ce(e) {
  return new Map(ms(e).map((t) => [t.wall.id, bs(t)]));
}
function yi(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(P(s, E(A(o, s), r / (r - a))));
  }
  return n;
}
function On(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of ms(e)) {
    const s = bs(i), o = e.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && t(p)).sort((p, c) => p.offset - c.offset), r = (p) => F(A(p, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const p of o)
      a.push([l, p.offset]), l = Math.max(l, p.offset + p.width);
    a.push([l, 1 / 0]);
    const d = [];
    for (const [p, c] of a) {
      if (c <= p) continue;
      let h = s;
      p > -1 / 0 && (h = yi(h, (u) => r(u) - p)), c < 1 / 0 && (h = yi(h, (u) => c - r(u))), h.length >= 3 && Math.abs(zt(h)) > Lr && d.push(h);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const hn = (e) => [e.map((t) => [t.x, t.y])];
function ys(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function vs(e, t) {
  return $s(t ? [...On(e).values()].flat() : [...Ce(e).values()]);
}
function $s(e) {
  const t = e.map(hn);
  if (t.length === 0) return [];
  let n;
  try {
    n = ps.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(ys));
}
const ke = 1e-6;
function ws(e, t) {
  return An[e.kind].includes(t.mode);
}
function xs(e, t, n) {
  if (!ws(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Rt || i > Rt)) return !1;
  const s = Oe(e, n.wallId);
  return s !== null && n.offset >= -ke && n.offset <= s + ke;
}
function qt(e, t) {
  return { ...e, devices: t };
}
function vi(e, t, n, i) {
  if (!xs(e, t, n)) return { level: e, deviceId: null };
  const s = { id: X(), name: i, placement: n, props: t, invalid: !1 };
  return { level: qt(e, [...e.devices, s]), deviceId: s.id };
}
function ks(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = It("motion_sensor", t), s = It("motion_sensor", n);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function Cn(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !xs(e, s.props, n)) return e;
  const o = ks(s.props, s.placement.mode, n.mode);
  return Nn(qt(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function Ne(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? qt(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return En({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function Ur(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !Ht(i.props.kind) || i.props.kind === n) return e;
  const s = It(n, i.placement.mode);
  if (!ws(s, i.placement)) return e;
  const o = En({ ...i, props: s });
  return qt(e, e.devices.map((r) => r === i ? o : r));
}
function _s(e, t) {
  return qt(e, e.devices.filter((n) => n.id !== t));
}
function Fr(e, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const n = t.props.zoneIds.filter((i) => e.zones.some((s) => s.id === i));
  return n.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: n } };
}
function Nn(e) {
  return qt(e, e.devices.map((t) => {
    const n = Fr(e, t);
    if (n.placement.mode !== "wall") return n.invalid ? { ...n, invalid: !1 } : n;
    const i = Oe(e, n.placement.wallId), s = i === null || n.placement.offset < -ke || n.placement.offset > i + ke;
    return n.invalid === s ? n : { ...n, invalid: s };
  }));
}
function Ss(e) {
  const t = [];
  for (const n of vs(e, !1)) for (const i of n.slice(1)) t.push(i);
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
function Es(e) {
  return Math.round(Math.abs(zt(e)) / 1e6 * 100) / 100;
}
const Ge = 1e-3;
function Ms(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(zt(e)) - Math.abs(zt(t))) > Ge ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= Ge && Math.abs(n.y - i.y) <= Ge));
}
function Br(e, t, n) {
  const i = Ss(e), s = pn(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const a = r.broken ? null : pn(i, r.seed);
    if (a && Ms(a, s)) return { level: e, zoneId: null };
  }
  const o = { id: X(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function Hr(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function As(e, t) {
  return Nn({ ...e, zones: e.zones.filter((n) => n.id !== t) });
}
function Wt(e) {
  if (e.zones.length === 0) return e;
  const t = Ss(e), n = [], i = e.zones.map((s) => {
    const o = pn(t, s.seed);
    return !o || n.some((r) => Ms(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const Ut = 1e-6, _e = ["door", "gate", "wicket"], Is = (e) => e === "opening", Ps = (e) => e.passesLight ?? Is(e.kind), Os = (e) => e === "opening", Cs = (e) => e.passesPir ?? Os(e.kind);
function Ns(e, t) {
  return e.offset < t.offset + t.width - Ut && t.offset < e.offset + e.width - Ut;
}
function Le(e, t, n, i, s) {
  const o = Oe(e, t);
  return o === null || i <= 0 || n < -Ut || n + i > o + Ut ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Ns(r, { offset: n, width: i }));
}
function Vt(e, t) {
  return { ...e, openings: t };
}
function jr(e, t, n, i, s, o = {}) {
  const r = s ?? be[n], a = i - r / 2;
  if (!Le(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: X(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return _e.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: Wt(Vt(e, [...e.openings, l])), openingId: l.id };
}
function Ls(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Le(e, i.wallId, n, i.width, t) ? e : Wt(he(Vt(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function qr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Le(e, i.wallId, i.offset, n, t) ? e : Wt(he(Vt(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function Wr(e, t) {
  return _e.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function Vr(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Wt(he(Vt(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function Ts(e, t) {
  return Wt(he(Vt(e, e.openings.filter((n) => n.id !== t))));
}
function he(e) {
  return Vt(e, e.openings.map((t) => {
    const n = Oe(e, t.wallId), i = n === null || t.offset < -Ut || t.offset + t.width > n + Ut || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Ns(t, s));
    return { ...t, invalid: i };
  }));
}
const le = 1;
function rt(e) {
  return structuredClone(e);
}
function Te(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function Kr(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function De(e, t, n) {
  const i = j(e, t.a), s = j(e, t.b), o = L(i, s), r = Kr(typeof n == "number" ? n : In(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : rr(i, s, r / o), offset: r };
}
function Gr(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = De(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Ds(e, t) {
  return Gr(e), t && Qr(t, e), Wt(Nn(he(e)));
}
function ht(e, t) {
  return Ds(rt(e), t);
}
function Rs(e, t, n) {
  const i = Pe(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = De(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function $i(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: j(e, t.nodeId), nodeId: t.nodeId };
  const n = Te(e, t.wallId), { pt: i, offset: s } = De(e, n, t.offset), o = L(j(e, n.a), j(e, n.b));
  return s <= le ? { pt: j(e, n.a), nodeId: n.a } : o - s <= le ? { pt: j(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function wi(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: X(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Zr(e, t, n, i) {
  const s = $i(e, t), o = $i(e, n);
  if (L(s.pt, o.pt) < le) return { level: e, wallId: null, endNodeId: null };
  const r = rt(e), a = wi(r, s), l = wi(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const d = { id: X(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: ht(r, e), wallId: d.id, endNodeId: l };
}
function zs(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < le || l - a < le ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Yr(e, t, n, i, s) {
  const o = zs(t, n, i.thickness, s);
  if (!o) return e;
  const r = rt(e), a = o.map((l) => {
    const d = { id: X(), x: l.x, y: l.y };
    return r.nodes.push(d), d.id;
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
function Xr(e, t, n) {
  const i = rt(e);
  return Rs(i, t, n), Ds(i, e);
}
function Qr(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((c) => c.id === s.a), r = e.nodes.find((c) => c.id === s.b), a = t.nodes.find((c) => c.id === i.a), l = t.nodes.find((c) => c.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const d = L(a, l);
    if (d === 0) continue;
    const p = Ie(A(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = In(P(o, E(p, c.offset)), a, l) * d);
  }
}
function Jr(e, t, n) {
  const i = rt(e), s = Te(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: P(j(i, a), n) }));
  for (const a of r) Rs(i, a.id, a.to);
  return ht(i, e);
}
function Re(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function ta(e, t, n) {
  const i = rt(e), s = Te(i, t), o = j(i, s[n]), r = { id: X(), x: o.x, y: o.y };
  return i.nodes.push(r), s[n] = r.id, Re(i), { level: ht(i, e), nodeId: r.id };
}
function ea(e, t, n) {
  if (t === n) return e;
  const i = rt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return i.nodes = i.nodes.filter((o) => o.id !== t), Re(i), ht(i, e);
}
function Ln(e, t) {
  var i;
  const n = rt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Re(n), ht(n, e);
}
function na(e, t, n) {
  const i = rt(e);
  return Object.assign(Te(i, t), n), ht(i, e);
}
const J = (e) => typeof e == "string" && e !== "" ? e : null, Us = (e) => e.split(".")[0], ia = ["friendly_name", "device_class", "unit_of_measurement"];
function Fs(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: Us(e),
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
function sa(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Fs(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function oa(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && ia.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Bs(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function ra(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = Fs(r.entity_id, {});
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
function aa(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Hs(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Bs(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const js = 2, xi = Math.ceil(360 / js), ki = 1e-4, la = 1e-9, _i = 1e-9, ca = {
  light: Ps,
  motion: Cs
};
function qs(e, t) {
  const n = [];
  for (const i of $s([...On(e, ca[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function da(e, [t, n]) {
  const i = A(n, t), s = F(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, F(A(e, t), i) / s));
  return L(e, P(t, E(i, o)));
}
function Tn(e, t, n) {
  return t.filter((i) => da(e, i) <= n);
}
function Ze(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function ua(e, t, n) {
  const i = Tn(e, t, n), s = [];
  for (let v = 0; v < xi; v++) s.push(-Math.PI + 2 * Math.PI * v / xi);
  const o = n * 1.05;
  for (const v of i)
    for (const g of v) {
      if (L(e, g) > o) continue;
      const x = Math.atan2(g.y - e.y, g.x - e.x);
      s.push(Ze(x - ki), Ze(x), Ze(x + ki));
    }
  s.sort((v, g) => v - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), d = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([v, g], x) => {
    a[x] = v.x - e.x, l[x] = v.y - e.y, d[x] = g.x - v.x, p[x] = g.y - v.y;
  });
  const c = [], h = [];
  let u = NaN;
  for (const v of s) {
    if (v === u) continue;
    u = v;
    const g = Math.cos(v), x = Math.sin(v);
    let S = n, _ = -1;
    for (let C = 0; C < r; C++) {
      const N = g * p[C] - x * d[C];
      if (Math.abs(N) < 1e-12) continue;
      const D = (a[C] * p[C] - l[C] * d[C]) / N;
      if (!(D > la && D < S)) continue;
      const B = (a[C] * x - l[C] * g) / N;
      B < -_i || B > 1 + _i || (S = D, _ = C);
    }
    const k = { x: e.x + g * S, y: e.y + x * S }, I = c.length;
    if (!(I > 0 && c[I - 1].x === k.x && c[I - 1].y === k.y)) {
      if (_ >= 0 && I >= 2 && h[I - 1] === _ && h[I - 2] === _) {
        c[I - 1] = k;
        continue;
      }
      c.push(k), h.push(_);
    }
  }
  const m = c[0], y = c[c.length - 1];
  return c.length > 1 && m.x === y.x && m.y === y.y && c.pop(), c;
}
const ha = 32, Si = 128;
function Se(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function vt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function Ws(e) {
  return (e % 360 + 360) % 360;
}
function Vs(e) {
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
  const o = Y(s.dir), r = n.side === "left" ? o : E(o, -1), a = n.side === "left" ? s.leftOff : s.rightOff;
  return { pt: P(P(s.a, E(s.dir, n.offset)), E(r, a)), dir: n.aim ? Se(vt(r) + n.aim) : r, normal: r };
}
function Ks(e, t) {
  const n = [];
  for (let i = 0; i < Si; i++) n.push(P(e, E(Se(360 * i / Si), t)));
  return n;
}
function Ei(e, t, n, i) {
  if (n >= 360) return Ks(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * ha)), o = vt(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(P(e, E(Se(o + n * a / s), i)));
  return r;
}
const pa = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function ze(e) {
  return pa[e] ?? null;
}
const fa = (e) => ze(e.kind) !== null;
function ga(e, t) {
  const n = t.props;
  if (!fa(n)) return null;
  const i = Q(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Ei(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Ei(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Ks(i.pt, n.poolRadius) : null;
  }
}
function Gs(e) {
  return e.normal ? P(e.pt, e.normal) : e.pt;
}
function ma(e, t) {
  const n = Q(e, t);
  if (!n) return null;
  const i = Gs(n);
  let s = null, o = 1 / 0;
  for (const r of e.zones) {
    if (!ue(i, r.outline)) continue;
    const a = Math.abs(zt(r.outline));
    a < o && (s = r.id, o = a);
  }
  return s;
}
function Mi(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function ba(e, t, n) {
  const i = A(t, e);
  for (const [s, o] of n) {
    const r = A(o, s), a = A(s, e), l = nt(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const d = nt(a, r) / l, p = nt(a, i) / l;
    if (d >= 0 && d <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Ai = 0.5, ya = 3, va = 1e-4;
function $a(e, t, n) {
  const i = Q(e, t);
  if (!i) return null;
  const s = Gs(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => Mi(k, n) || Tn(k, n, Ai).length > 0;
  if (!r(s)) return s;
  const a = it(e, e.walls.find((k) => k.id === o.wallId)), l = i.normal, d = (k) => Math.abs(F(A(k, i.pt), l)) <= va, p = ([k, I]) => E(P(k, I), 0.5), c = n.filter((k) => d(k[0]) && d(k[1]) && L(k[0], k[1]) > 1e-9 && !Mi(P(p(k), E(l, Ai)), n)), h = (k) => F(A(k, a.a), a.dir), u = ([k, I]) => Math.max(0, Math.min(h(k), h(I)) - o.offset, o.offset - Math.max(h(k), h(I))), m = Math.min(...c.map(u)), y = c.filter((k) => u(k) <= m + 1e-6).map((k) => P(p(k), l)), v = (k) => y.some((I) => !ba(k, I, n)), g = ya * Math.max(...e.walls.map((k) => k.thickness)) + 2, x = [];
  for (const [k, I] of n) {
    const C = A(I, k), N = A(k, s), D = nt(a.dir, C);
    if (Math.abs(D) < 1e-12) continue;
    const B = nt(N, a.dir) / D;
    if (B < -1e-9 || B > 1 + 1e-9) continue;
    const q = nt(N, C) / D, Z = L(k, I) / Math.abs(D);
    x.push(q - Z, q + Z);
  }
  const S = o.offset <= a.len / 2 ? 1 : -1, _ = x.filter((k) => Math.abs(k) <= g).sort((k, I) => Math.abs(k) - Math.abs(I) || Math.sign(I) * S - Math.sign(k) * S);
  for (const k of _) {
    const I = P(s, E(a.dir, k));
    if (!r(I) && v(I)) return I;
  }
  return null;
}
const wa = 1 / Math.cos(js / 2 * (Math.PI / 180)), Ii = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function xa(e, t, n = qs) {
  const i = ga(e, t), s = ze(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = $a(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((c) => L(c, r))) * wa, l = Tn(r, o, a);
  if (l.length === 0) return [i];
  const d = ua(r, l, a);
  let p;
  try {
    p = ps.intersection(hn(Ii(i)), hn(Ii(d)));
  } catch {
    return [d];
  }
  return p.flatMap((c) => c.map(ys));
}
function ka(e, t, n, i) {
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
  return Math.abs(F(r, s.dir)) <= o.width / 2 + i && Math.abs(F(r, Y(s.dir))) <= o.depth / 2 + i;
}
function Zs(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && ka(e, i[o], t, n)) return i[o].id;
  return null;
}
const _a = 60;
function fn(e, t, n) {
  if (!cs.has(t.props.kind)) return null;
  const i = Q(e, t);
  return i ? { from: i.pt, to: P(i.pt, E(i.dir, _a / n)) } : null;
}
function Ys(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function Sa(e, t, n, i) {
  const s = t.placement, o = Q(e, t);
  if (!o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = vt(A(n, o.pt)), a = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (s.mode === "free") return { ...s, rotation: Ws(a(r)) };
  const l = Vs(r - vt(o.normal)), d = Math.max(-Rt, Math.min(Rt, a(l)));
  return Ys(s, d);
}
class Xs extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Ye(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Ea(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Ma(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Xs(s.message) : s;
  }
}
async function Aa(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Ia = 3;
function St(e) {
  if (typeof e == "number")
    return e === Ia ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Pa {
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
      const o = await Ma(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Xs ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = St(o)), this.onChange(), null;
    }
  }
}
const Oa = {
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
  return Oa[e] ?? e;
}
var Ca = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Na = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", La = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", Ta = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", Da = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z";
const ot = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function dt(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const Dn = 12, U = "non-scaling-stroke", Ra = 7, za = 10, Ua = "#f43f5e", Fa = "3 2", Ba = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Qs = 24;
function Ha(e, t, n) {
  const i = Qs / t;
  return customElements.get("ha-icon") ? M`<foreignObject class="equipment-icon" x=${-i / 2} y=${-i / 2} width=${i} height=${i}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${i}px;color:${n};display:block`}></ha-icon></foreignObject>` : M`<g class="equipment-icon" transform=${`translate(${-i / 2} ${-i / 2}) scale(${i / 24})`}>
    <path d=${Ba} fill=${n}></path></g>`;
}
const ja = "__preview__", qa = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Wa = /* @__PURE__ */ new WeakMap();
function Va(e, t) {
  var s;
  const n = dt(Wa, e.walls, () => /* @__PURE__ */ new WeakMap()), i = dt(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = dt(i, e.openings, () => ({})))[t] ?? (s[t] = qs(e, t));
}
const Ka = /* @__PURE__ */ new WeakMap();
function Ga(e, t) {
  const n = ze(t.props.kind);
  if (!n) return [];
  const i = Va(e, n), s = dt(Ka, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = xa(e, t, () => i), s.set(t, o)), o;
}
function Za(e, t, n, i, s) {
  const o = e.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? M`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></rect>` : o.shape === "spot" ? M`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${U}></circle>` : M`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>`;
    case "wall_light":
      return M`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${U}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return M`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const d = l * Math.PI / 4;
        a += `M${Math.cos(d) * t * 1.15} ${Math.sin(d) * t * 1.15}L${Math.cos(d) * t * 1.6} ${Math.sin(d) * t * 1.6}`;
      }
      return M`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    case "wall_switch":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? $} vector-effect=${U}></rect>`;
    case "smart_button":
      return M`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? $}
        vector-effect=${U}></rect>
        <circle class="dot" r=${t * 0.18} fill=${n}></circle>`;
    case "socket":
      return M`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return M`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${U}></path>`;
    case "exhaust_fan": {
      let a = "";
      for (let l = 0; l < 4; l++) {
        const d = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(d) * t * 0.85} ${Math.sin(d) * t * 0.85}`;
      }
      return M`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${U}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${U}></path>`;
    }
    default:
      return M`${$}`;
  }
}
function Ya(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return M`${$}`;
  const o = Dn / t.scale, r = s.shape === "circle" ? M`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${U}></circle>` : M`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${U}></rect>`;
  return M`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${Ha(s.icon, t.scale, n)}
    <text class="equipment-label" y=${Qs / t.scale / 2 + o} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Xa(e, t) {
  return e === "bound" ? $ : M`<circle class=${`bind-ring bind-${e}`} r=${Dn * 1.7 / t} fill="none" style=${`stroke:${qa[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : $} vector-effect=${U}></circle>`;
}
function Qa(e) {
  return e.action === "toggle" ? ["toggle", Da] : e.action === "auto" ? ["auto", Ta] : e.value === "off" ? ["set-off", La] : ["set-on", Na];
}
function Ja(e, t, n, i) {
  const s = t ? Qa(t) : e.status === "error" ? ["alert", Ca] : null;
  if (!s) return $;
  const [o, r] = s, a = t ? i.palette.selection : Ua, l = n * 0.9, d = -n * 0.9, p = za / i.scale;
  return M`<g class="badge" data-badge=${o}>
    <circle cx=${l} cy=${d} r=${Ra / i.scale} fill=${i.palette.background} stroke=${a} stroke-width="1.5"
      vector-effect=${U}></circle>
    <path d=${r} fill=${a} transform=${`translate(${l - p / 2} ${d - p / 2}) scale(${p / 24})`}></path>
  </g>`;
}
function tl(e, t, n, i) {
  var y, v, g;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Dn / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((y = n.selection) == null ? void 0 : y.kind) === "device" && n.selection.id === e.id, d = !i && Ht(e.props.kind), p = d ? (v = n.containerState) == null ? void 0 : v.call(n, e) : void 0, c = d && !p, h = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (c ? " no-data" : ""), u = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, m = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : r * 1.6;
  return M`
    <g class=${h} data-id=${e.id} opacity=${u} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? M`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${U}></circle>` : $}
      ${e.props.kind === "equipment" ? Ya(e, n, o, a) : M`<g transform=${`rotate(${a})`}>${Za(
    e,
    r,
    o,
    s.deviceFill,
    c ? Fa : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? Xa(n.bindingStatus(e), n.scale) : $}
      ${p ? Ja(p, ((g = n.containerFlash) == null ? void 0 : g.call(n, e)) ?? null, r, n) : $}
    </g>`;
}
function el(e, t, n, i) {
  const s = Ga(e, t);
  if (s.length === 0) return $;
  const o = n.palette, r = t.invalid ? o.invalid : ze(t.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, l = s.map(ot).join("");
  return t.props.kind === "ceiling_light" ? M`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${U}></path>` : M`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${U}></path>`;
}
function nl(e, t) {
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
function il(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: ja, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return M`
    <g class="cones">${t.showCones ? n.map((i) => el(e, i.d, t, i.preview)) : $}</g>
    <g class="devices">${n.map((i) => tl(i.d, i.pose, t, i.preview))}</g>
    ${nl(e, t)}`;
}
function Mt(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function Js(e) {
  return `${e.toFixed(2)} ${f("unit.m2")}`;
}
const sl = /* @__PURE__ */ new WeakMap(), ol = /* @__PURE__ */ new WeakMap(), to = /* @__PURE__ */ new WeakMap();
function Ue(e, t, n) {
  const i = Y(e.dir), s = P(e.a, E(e.dir, t)), o = P(e.a, E(e.dir, n));
  return [P(s, E(i, e.leftOff)), P(o, E(i, e.leftOff)), A(o, E(i, e.rightOff)), A(s, E(i, e.rightOff))];
}
function ce(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = it(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function rl(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const a = e[r], l = e[(r + 1) % e.length], d = a.x * l.y - l.x * a.y;
    n += d, i += (a.x + l.x) * d, s += (a.y + l.y) * d;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return ue(o, e) ? o : t;
}
const H = "non-scaling-stroke";
function al(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = ce(e, a.id);
    if (!l) continue;
    const d = Y(l.dir);
    for (const [p, c, h] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const u = e.nodes.find((k) => k.id === p);
      if (!u || u.host || n.get(p) !== 1) continue;
      const m = P(c, E(d, l.leftOff + i)), y = A(c, E(d, l.rightOff + i)), v = E(d, 1), g = E(P(m, y), 0.5), x = P(A(g, E(v, -o)), E(h, s / 2)), S = A(A(g, E(v, o)), E(h, s / 2)), _ = [m, x, S, y];
      r.push(M`<path class="wall-break" d=${`M${_.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${H}></path>`);
    }
  }
  return r.length ? M`${r}` : $;
}
function ll(e, t, n) {
  const i = t.palette, s = rl(e.outline, e.seed), o = 12 / t.scale;
  return M`
    <path class="zone${e.broken ? " broken" : ""}" d=${ot(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${H}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Js(Es(e.outline))}</tspan>
    </text>`;
}
function cl(e, t, n) {
  const i = Y(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = P(P(e.a, E(e.dir, a)), E(o, r)), p = P(P(e.a, E(e.dir, l)), E(o, r)), c = P(d, E(o, t.width)), h = nt(A(c, d), A(p, d)) > 0 ? 1 : 0;
  return M`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${H}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${h} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${H}></path>`;
}
function dl(e, t, n) {
  const i = Y(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = P(P(e.a, E(e.dir, t.offset)), E(i, r)), l = P(P(e.a, E(e.dir, t.offset + t.width)), E(i, r));
    return M`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${H}></line>`;
  });
  return M`${o}`;
}
function ul(e, t, n) {
  const i = ce(e, t.wallId);
  if (!i) return $;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = Ue(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return M`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${ot(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? cl(i, t, o) : t.kind === "window" ? dl(i, t, o) : $}
    </g>`;
}
function Pi(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = P(e, E(n, i)), l = P(t, E(n, i)), d = (c, h) => {
    const u = P(h, E(n, i + r));
    return M`<line x1=${c.x} y1=${c.y} x2=${u.x} y2=${u.y} stroke=${o} stroke-width="0.75" vector-effect=${H}></line>`;
  }, p = P(E(P(a, l), 0.5), E(n, 9 / s.scale));
  return M`
    <g class="dim">
      ${d(P(e, E(n, 2 / s.scale)), e)}${d(P(t, E(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${H}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Mt(L(e, t))}</text>
    </g>`;
}
function hl(e, t) {
  const n = t.selection;
  if (!n) return $;
  const i = t.palette, s = 4 / t.scale, o = (r) => M`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : $;
  }
  if (n.kind === "wall") {
    const r = dt(to, e, Ce).get(n.id), a = ce(e, n.id);
    if (!r || !a) return $;
    const l = Y(a.dir);
    return M`
      <path d=${ot(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${H}></path>
      ${o(a.a)}${o(a.b)}
      ${Pi(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((h) => h.id === n.id), a = r ? ce(e, r.wallId) : null;
    if (!r || !a) return $;
    const l = E(Y(a.dir), -1), d = a.rightOff + 18 / t.scale, p = (h) => P(a.a, E(a.dir, h)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return M`
      <path d=${ot(Ue(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${H}></path>
      ${c.filter(([h, u]) => u - h >= 1).map(([h, u]) => Pi(p(h), p(u), l, d, t))}`;
  }
  return $;
}
function pl(e, t, n) {
  return L(e, t) < 1e-6 ? null : Ue(gs(e, t, n.thickness, n.baseline), 0, L(e, t));
}
function fl(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? ce(e, r.wallId) : null;
  return M`
    ${o ? M`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${H}></path>` : $}
    ${(n.walls ?? []).map((l) => {
    const d = pl(l.a, l.b, l.props);
    return M`<g class="preview-wall">
        ${d ? M`<path d=${ot(d)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${H}></line></g>`;
  })}
    ${r && a ? M`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ot(Ue(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${ml(e, t)}`;
}
function gl(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return M`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${H}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${H}></rect></g>`;
}
function ml(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? gl(n.anchor, t) : $, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (u) => u / t.scale, { x: a, y: l } = o.pt, d = { stroke: i.background, width: "3" };
  let p, c = $;
  if (o.kind === "node") {
    const u = r(5);
    p = M`<g class="snap-node"><rect x=${a - u} y=${l - u} width=${2 * u} height=${2 * u} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${H}></rect></g>`;
  } else if (o.kind === "mid") {
    const u = r(11) / Math.sqrt(3), m = `M${a} ${l - u}L${a + u * 0.866} ${l + u / 2}L${a - u * 0.866} ${l + u / 2}Z`;
    p = M`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${H}></path></g>`;
  } else if (o.kind === "wall") {
    const u = r(5), m = `M${a - u} ${l - u}L${a + u} ${l + u}M${a - u} ${l + u}L${a + u} ${l - u}`;
    p = M`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${H}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${H}></path></g>`;
    const y = o.endpoint.kind === "wall" ? dt(to, e, Ce).get(o.endpoint.wallId) : void 0;
    y && (c = M`<path class="snap-wall-hl" d=${ot(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${H}></path>`);
  } else {
    const u = r(4), m = `M${a - u} ${l}H${a + u}M${a} ${l - u}V${l + u}`;
    p = M`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${H}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${H}></path></g>`;
  }
  const h = f(`snapmark.${o.kind}`);
  return M`
    ${c}${s}${p}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${H} font-family="system-ui, sans-serif">${h}</text>`;
}
function bl(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = dt(sl, n, (c) => vs(c, !0)), o = n.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? dt(ol, n, On) : null, a = 8 / t.scale, l = t.selection, d = (t.mode ?? "plan") === "plan", p = d ? $ : String(i.dimOpacity);
  return M`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${p}>${n.zones.map((c) => ll(c, t, (l == null ? void 0 : l.kind) === "zone" && l.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(ot).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${p}></path>
    ${r ? M`<g class="railings" opacity=${p}>${o.flatMap((c) => (r.get(c.id) ?? []).map((h) => M`<path d=${ot(h)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${p}>${n.openings.map((c) => ul(n, c, t))}</g>
    <g class="wall-breaks" opacity=${p}>${al(n, t)}</g>
    <g class="devices-layer">${il(n, {
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
    <g class="selection">${hl(n, t)}</g>
    <g class="preview">${fl(n, t)}</g>`;
}
const yl = {
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
}, vl = {
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
function $l(e) {
  return e ? yl : vl;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Rn = (e) => (...t) => ({ _$litDirective$: e, values: t });
class zn {
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
const eo = (e) => e.strings === void 0, wl = {}, no = (e, t = wl) => e._$AH = t;
class xl extends zn {
  constructor(t) {
    if (super(t), t.type !== pt.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? et : (no(t), n);
  }
}
const V = Rn(xl), gn = 1, Oi = 1e-6;
function kl(e, t, n, i, s) {
  const o = (l) => l > Oi && l < s - Oi, r = new Set(e.nodes.filter((l) => {
    var d;
    return ((d = l.host) == null ? void 0 : d.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const d = Pe(e, l).host.offset;
    o(d) && a.push({ t: d, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((y) => y === t.a || y === t.b || r.has(y))) continue;
    const d = j(e, l.a), p = j(e, l.b), c = L(d, p), h = c === 0 ? null : lt(n, i, d, A(p, d));
    if (!h) continue;
    const u = In(h, d, p) * c;
    if (u < -gn || u > c + gn) continue;
    const m = F(A(h, n), i);
    o(m) && a.push({ t: m, wall: l, pt: h });
  }
  return a;
}
function Ci(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Ni(e, t) {
  if ("nodeId" in t)
    return delete Pe(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (L(j(e, o), t.pt) <= gn) return o;
  const { pt: n, offset: i } = De(e, t.wall, t.pt), s = { id: X(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function _l(e, t, n) {
  const i = e.walls.find((g) => g.id === t);
  if (!i) return e;
  const s = j(e, i.a), o = j(e, i.b), r = L(s, o), a = Ie(A(o, s)), l = F(A(n, s), a), d = kl(e, i, s, a, r), p = Ci(d.filter((g) => g.t < l), l), c = Ci(d.filter((g) => g.t > l), l);
  if (!p && !c) return Ln(e, t);
  const h = rt(e), u = h.walls.find((g) => g.id === t);
  let m = t, y = 0;
  if (c) {
    const g = Ni(h, c);
    if (y = F(A(j(h, g), s), a), p) {
      const x = { ...u, id: X(), a: g };
      h.walls.push(x), m = x.id;
    } else
      u.a = g;
  }
  p && (u.b = Ni(h, p));
  const v = (g, x) => g.wallId !== t || p && x <= p.t ? !0 : !c || x < c.t ? !1 : (g.wallId = m, g.offset -= y, !0);
  h.openings = h.openings.filter((g) => v(g, g.offset + g.width / 2)), h.devices = h.devices.filter((g) => g.placement.mode !== "wall" || v(g.placement, g.placement.offset));
  for (const g of h.nodes) g.host && !v(g.host, g.host.offset) && delete g.host;
  return Re(h), ht(h, e);
}
function io(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Sl(e, t, n) {
  return P(e, E(Ie(A(t, e)), n));
}
function Li(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Ft(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? io(r, t) : t, d = r !== void 0 && l.y === r.y, p = (g) => !r || Math.abs(d ? g.y - r.y : g.x - r.x) <= 1;
  let c = null;
  for (const g of e.nodes) {
    if (a.has(g.id)) continue;
    const x = { x: g.x, y: g.y }, S = L(x, l);
    S <= i && p(x) && (!c || S < c.d) && (c = { id: g.id, pt: x, d: S });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const h = e.walls.filter((g) => !a.has(g.a) && !a.has(g.b)).map((g) => ({ w: g, f: it(e, g) })).filter((g) => g.f.len > 1e-9);
  let u = null;
  for (const { w: g, f: x } of h) {
    const S = { x: (x.a.x + x.b.x) / 2, y: (x.a.y + x.b.y) / 2 }, _ = L(S, l);
    _ <= i && p(S) && (!u || _ < u.d) && (u = { wallId: g.id, pt: S, offset: x.len / 2, d: _ });
  }
  if (u)
    return { pt: u.pt, kind: "mid", endpoint: { kind: "wall", wallId: u.wallId, offset: u.offset } };
  const m = (g) => {
    let x = null;
    for (const { w: S, f: _ } of h) {
      const k = Y(_.dir), I = g ? [_.leftOff, -_.rightOff].filter((C) => C !== 0) : [0];
      for (const C of I) {
        const N = P(_.a, E(k, C)), D = r ? lt(r, A(l, r), N, _.dir) : P(N, E(_.dir, F(A(l, N), _.dir)));
        if (!D) continue;
        const B = F(A(D, N), _.dir);
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
    const g = (S) => Math.round(S / s) * s, x = r ? d ? { x: g(l.x), y: r.y } : { x: r.x, y: g(l.y) } : { x: g(l.x), y: g(l.y) };
    return Li(x, "grid");
  }
  return Li(l, "none");
}
function El(e, t, n) {
  const i = A(n, t), s = F(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, F(A(e, t), i) / s));
  return L(e, { x: t.x + i.x * o, y: t.y + i.y * o });
}
function Ml(e, t, n) {
  return t.some((i, s) => El(e, i, t[(s + 1) % t.length]) <= n);
}
function Un(e, t, n) {
  const i = Ce(e);
  for (const [s, o] of i) if (ue(t, o)) return s;
  for (const [s, o] of i) if (Ml(t, o, n)) return s;
  return null;
}
function Al(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = it(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = jt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Il(e, t, n, i) {
  const s = Al(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((d) => d.id === a);
        if (l && L(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = Un(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && ue(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function Pl(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, a = null;
  const l = (u) => {
    t = u, e.select(u);
  }, d = () => {
    n = null, i = null, s = null, a = null, o = !1;
  }, p = (u) => u.kind === "none" ? { x: Math.round(u.pt.x), y: Math.round(u.pt.y) } : u.pt, c = (u, m, y) => jt(it(u, u.walls.find((v) => v.id === m)), y).t;
  function h(u) {
    const m = n;
    if (!(!m || !i) && !(u.pt.x === r.x && u.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const y = Ft(i, u.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: u.shift,
          excludeNodeIds: [m.nodeId]
        }), v = y.endpoint, g = (y.kind === "wall" || y.kind === "mid") && v.kind === "wall", x = y.kind === "node" && v.kind === "node" && v.nodeId !== m.nodeId, S = i.nodes.find((C) => C.id === m.nodeId), _ = !!S.host && g && v.kind === "wall" && v.wallId === S.host.wallId;
        let k = i;
        if (S.host && !_) {
          const C = structuredClone(i);
          delete C.nodes.find((N) => N.id === m.nodeId).host, k = C;
        }
        let I = Xr(k, m.nodeId, p(y));
        if (x && v.kind === "node")
          I = ea(I, m.nodeId, v.nodeId);
        else if (g && v.kind === "wall" && !_) {
          const C = i.walls.find((N) => N.id === v.wallId);
          if (C && C.a !== m.nodeId && C.b !== m.nodeId) {
            const N = structuredClone(I);
            N.nodes.find((D) => D.id === m.nodeId).host = { wallId: v.wallId, offset: v.offset }, I = ht(N, I);
          }
        }
        s = I;
      } else if (m.kind === "wall") {
        const y = i.walls.find((x) => x.id === m.wallId), v = Ft(i, u.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: u.shift,
          excludeNodeIds: [y.a, y.b]
        }), g = A(v.pt, m.origin);
        s = Jr(
          i,
          m.wallId,
          v.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const y = i.openings.find((v) => v.id === m.openingId);
        s = Ls(i, y.id, c(i, y.wallId, u.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(u) {
      d(), r = u.pt;
      const m = e.level(), y = u.ctrl ? Un(m, u.pt, e.tolMm()) : null;
      if (y) {
        l(null), e.commit(_l(m, y, u.pt));
        return;
      }
      const v = t, g = Il(m, u.pt, e.tolMm(), v);
      if (l(g), !!g) {
        if (a = i = s = m, g.kind === "node") {
          let x = g.id;
          const S = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((_) => _.id === v.id) : void 0;
          if (u.alt && S) {
            const _ = ta(m, S.id, S.a === g.id ? "a" : "b");
            i = s = _.level, x = _.nodeId, l({ kind: "node", id: x });
          }
          n = { kind: "node", nodeId: x, origin: j(i, x) };
        } else if (g.kind === "wall")
          n = { kind: "wall", wallId: g.id, origin: u.pt };
        else if (g.kind === "opening") {
          const x = m.openings.find((S) => S.id === g.id);
          n = { kind: "opening", openingId: x.id, grab: c(m, x.wallId, u.pt) - x.offset };
        }
      }
    },
    move(u) {
      h(u);
    },
    up(u) {
      n && h(u);
      const m = o, y = s, v = a;
      d(), m && y && v && y !== v && e.commit(y);
    },
    key(u) {
      return u === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      d(), l(null);
    }
  };
}
function de(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function so() {
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
function Ol(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = so(), s = () => {
    t = null, i.clear();
  }, o = (d) => Ft(e.level(), d, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const d = de(i.first, { min: 1 }), p = de(i.second, { min: 1 });
      return d === null || p === null ? null : { x: t.x + (n.x >= t.x ? d : -d), y: t.y + (n.y >= t.y ? p : -p) };
    }
    return o(n).pt;
  }
  const a = (d, p) => Math.abs(d.x - p.x) < 1 || Math.abs(d.y - p.y) < 1;
  function l(d) {
    if (!t || a(t, d)) return;
    const p = Yr(e.level(), t, d, e.wallProps(), e.boxMeasure());
    p !== e.level() && (e.commit(p), s());
  }
  return {
    id: "box",
    down(d) {
      if (n = d.pt, !t) {
        t = o(d.pt).pt;
        return;
      }
      const p = r();
      p && l(p);
    },
    move(d) {
      n = d.pt;
    },
    up() {
    },
    key(d) {
      return t ? i.key(d, () => {
        const p = r();
        p && l(p);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const d = r(), p = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || a(t, d)) return p;
      const c = e.wallProps(), h = zs(t, d, c.thickness, e.boxMeasure());
      return h && (p.walls = h.map((u, m) => ({ a: u, b: h[(m + 1) % 4], props: { ...c, baseline: "center" } }))), p;
    },
    cancel() {
      s();
    }
  };
}
const Ti = (e) => Math.round(e * 1e3) / 1e3 + 0;
function Cl(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = so(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, d = (h, u) => Ft(e.level(), h, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: u && n !== null });
  function p() {
    if (!n) return null;
    const h = d(s, o), u = de(a.first, { min: 1 }), m = de(a.second);
    if (u === null && m === null) return { pt: h.pt, endpoint: h.endpoint, snap: h };
    const y = u ?? L(n, h.pt);
    let v = h.pt;
    if (m === null && L(n, h.pt) < 1) {
      const _ = r ?? { x: 1, y: 0 };
      v = { x: n.x + _.x, y: n.y + _.y };
    }
    if (m !== null) {
      const _ = m * Math.PI / 180;
      v = { x: n.x + Math.cos(_), y: n.y - Math.sin(_) };
    }
    const g = Sl(n, v, y), x = { x: Ti(g.x), y: Ti(g.y) }, S = e.level().nodes.find((_) => Math.hypot(_.x - x.x, _.y - x.y) < 1);
    return S ? { pt: { x: S.x, y: S.y }, endpoint: { kind: "node", nodeId: S.id }, snap: h } : { pt: x, endpoint: { kind: "free", pt: x }, snap: h };
  }
  function c() {
    const h = p();
    if (!t || !h) return;
    const u = Zr(e.level(), t, h.endpoint, e.wallProps());
    if (u.wallId === null || u.endNodeId === null) return;
    e.commit(u.level);
    const m = u.level.walls.find((S) => S.id === u.wallId);
    i === null && (i = m.a);
    const y = u.endNodeId === i, v = n, g = j(u.level, u.endNodeId), x = L(v, g);
    if (x > 0 && (r = { x: (g.x - v.x) / x, y: (g.y - v.y) / x }), a.clear(), y) {
      l();
      return;
    }
    t = { kind: "node", nodeId: u.endNodeId }, n = j(u.level, u.endNodeId);
  }
  return {
    id: "wall",
    down(h) {
      if (s = h.pt, o = h.shift, !t) {
        const u = d(h.pt, !1);
        t = u.endpoint, n = u.pt;
        return;
      }
      c();
    },
    move(h) {
      s = h.pt, o = h.shift;
    },
    up() {
    },
    key(h, u) {
      return o = u.shift, t ? a.key(h, c, l) : !1;
    },
    preview() {
      if (!n) return { snap: Ft(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const h = p();
      return {
        walls: [{ a: n, b: h.pt, props: e.wallProps() }],
        snap: h.snap,
        tracker: a.tracker(h.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      l();
    }
  };
}
function Nl(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = Un(o, n, e.tolMm());
    if (!r) return null;
    const a = it(o, o.walls.find((d) => d.id === r)), l = jt(a, n).t;
    return { wallId: r, center: l, pt: P(a.a, E(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = jr(e.level(), r.wallId, t, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Le(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function Ll(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = Br(n, t.pt, e.zoneName());
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
const oo = 3, Di = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function ro(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((p) => p.id === o), l = a ? Q(s, a) : null, d = a ? fn(s, a, e.scale()) : null;
    return !l || !d ? 0 : Vs(vt(A(r, l.pt)) - vt(A(d.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && L(s.pt, t.downPt) <= oo / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = (vt(A(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, p = Sa(t.original, o, d, s.shift);
    t.work = JSON.stringify(p) === JSON.stringify(o.placement) ? t.original : Cn(t.original, o.id, p);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((d) => d.id === s), l = a ? fn(r, a, e.scale()) : null;
      return !a || !l || L(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && Di(o.work, o.id) !== Di(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function Ri(e, t, n) {
  const i = it(e, e.walls.find((s) => s.id === t));
  return jt(i, n).side > 0 ? "left" : "right";
}
function ao(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function lo(e, t, n, i, s = 0) {
  const o = An[n];
  if (o.includes("wall")) {
    const r = Ft(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: Ri(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const d of t.walls) {
        if (d.a !== a.nodeId && d.b !== a.nodeId) continue;
        const p = it(t, d), c = Math.max(0, Math.min(p.len, jt(p, i).t)), h = Math.hypot(i.x - (p.a.x + p.dir.x * c), i.y - (p.a.y + p.dir.y * c));
        (!l || h < l.d) && (l = { id: d.id, offset: d.a === a.nodeId ? 0 : p.len, d: h });
      }
      if (l) return { mode: "wall", wallId: l.id, side: Ri(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...ao(e, i), rotation: s } : null;
}
function Tl(e, t, n) {
  return ks(e.deviceDefaults(t), "free", n.mode);
}
function Dl(e, t) {
  let n = null, i;
  const s = ro(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = lo(e, r, t, n);
    if (!a)
      return { placement: { mode: "free", ...ao(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const l = Tl(e, t, a), d = vi(r, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), d = os(f(`device.${t}`), l.devices.filter((c) => c.props.kind === t).map((c) => c.name)), p = vi(l, a.props, a.placement, d);
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
const zi = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, Rl = (e, t, n) => n === void 0 || zi(e, n) !== zi(t, n);
function zl(e) {
  let t = null, n = null;
  const i = ro(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (h) => {
    t = h, e.select(h);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function p(h) {
    if (!n || !s || !r && L(h.pt, a) <= oo / e.scale()) return;
    if (r = !0, h.pt.x === a.x && h.pt.y === a.y) {
      o = s;
      return;
    }
    const u = s.devices.find((k) => k.id === n.id);
    if (!u) return;
    const m = h.shift ? io(a, h.pt) : h.pt, y = u.placement, v = y.mode === "free", g = v ? null : Q(s, u), x = y.mode === "free" ? y.rotation : g ? Ws(Math.round(vt(g.dir))) : 0, S = lo(e, s, u.props.kind, v ? P(m, n.grab) : m, x), _ = S && S.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...S, aim: y.aim } : S;
    o = _ ? Cn(s, u.id, c(s, u.placement, _, m)) : s;
  }
  function c(h, u, m, y) {
    if (u.mode !== "wall" || m.mode !== "wall" || m.wallId !== u.wallId) return m;
    const v = h.walls.find((I) => I.id === u.wallId);
    if (!v) return m;
    const g = it(h, v), x = Math.max(0, Math.min(g.len, u.offset + F(A(y, a), g.dir))), S = jt(g, y).side, _ = e.tolMm(), k = u.side === "left" ? S < -(g.rightOff + _) ? "right" : "left" : S > g.leftOff + _ ? "left" : "right";
    return { ...m, offset: x, side: k };
  }
  return {
    id: "device-select",
    down(h) {
      d(), a = h.pt;
      const u = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, h)) return;
      const y = Zs(u, h.pt, m);
      if (!y) {
        l(null);
        return;
      }
      l({ kind: "device", id: y });
      const v = u.devices.find((x) => x.id === y), g = Q(u, v);
      s = o = u, n = { id: y, grab: g && v.placement.mode === "free" ? A(g.pt, h.pt) : { x: 0, y: 0 } };
    },
    move(h) {
      i.active() ? i.move(h) : p(h);
    },
    up(h) {
      if (i.end(h)) return;
      n && p(h);
      const u = o, m = s, y = r, v = n == null ? void 0 : n.id;
      d(), y && u && m && u !== m && Rl(m, u, v) && e.commit(u);
    },
    key(h) {
      return h === "Escape" && i.cancel() ? !0 : h === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const h = i.working();
      return h ? { level: h } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), l(null);
    }
  };
}
function Ul(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = Zs(e.level(), t.pt, e.tolMm());
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
const Fl = ["select", "box", "wall", "door", "window", "opening", "zone"], Bl = [
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
], Hl = ["binding-select"];
function Fn(e) {
  return e === "plan" ? Fl : e === "equipment" ? Bl : Hl;
}
function mn(e, t) {
  switch (e) {
    case "select":
      return Pl(t);
    case "box":
      return Ol(t);
    case "wall":
      return Cl(t);
    case "door":
    case "window":
    case "opening":
      return Nl(t, e);
    case "zone":
      return Ll(t);
    case "device-select":
      return zl(t);
    case "binding-select":
      return Ul(t);
    default:
      return Dl(t, e);
  }
}
function Xe(e, t) {
  return (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((i) => i.id === t.id);
}
function jl(e) {
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
function ql(e) {
  return b`
    <div class="top"><div class="bar">
      ${e.lead ?? $}
      ${e.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${V(e.planId)}
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
        ${jl(e)}${e.saveState === "error" && e.errorMessage ? b`: ${e.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${f("action.save")}</button>
    </div>${e.steps}</div>`;
}
function Wl(e, t, n) {
  return b`
    <div class="tools">
      ${Fn(e).map((i) => b`
        ${i === "zone" || i === "ceiling_light" ? b`<div class="tool-sep"></div>` : $}
        <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
          ${f(`tool.${i}`)}</button>`)}
    </div>`;
}
const Yt = ["plan", "equipment", "binding"], Qe = (e, t, n) => f(e === 1 ? t : n).replace("{n}", String(e));
function Vl(e, t, n) {
  const { walls: i, zones: s, devices: o } = t;
  switch (e) {
    case "plan":
      return {
        text: `${Qe(i.length, "steps.wall", "steps.walls")}, ${Qe(s.length, "steps.room", "steps.rooms")}`,
        done: i.length > 0 && s.length > 0
      };
    case "equipment":
      return { text: Qe(o.length, "steps.device", "steps.devices"), done: o.length > 0 };
    case "binding": {
      const r = o.length - Sn(o.map(n));
      return {
        text: f("steps.bound").replace("{b}", String(r)).replace("{n}", String(o.length)),
        done: o.length > 0 && r === o.length
      };
    }
  }
}
const Ui = (e, t) => f(e).replace("{step}", f(`mode.${t}`));
function Kl(e) {
  const t = Yt.indexOf(e.mode), n = Yt[t - 1], i = Yt[t + 1];
  return b`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${V(e.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${Yt.map((s, o) => {
    const r = Vl(s, e.level, e.status), a = s === e.mode;
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
        ${n ? b`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${Ui("steps.back", n)}</button>` : $}
        ${i ? b`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${Ui("steps.next", i)}</button>` : b`<button class="btn primary" data-nav="next" @click=${() => e.onNextUnbound()}>${f("steps.nextUnbound")}</button>`}
      </div>
    </nav>`;
}
const Gl = ["unbound", "bound", "all"], Zl = /* @__PURE__ */ new WeakMap();
function co(e) {
  return dt(Zl, e, (t) => [...t.devices].sort((n, i) => n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Yl(e, t, n) {
  const i = co(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Fi = (e) => f(`device.${e.props.kind}`), Xl = (e, t) => e === "all" || e === "bound" == (t === "bound");
function Ql(e, t, n) {
  return t === 0 ? f("binding.noDevices") : n || e.filter === "all" ? f("binding.noMatch") : f(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Bi(e) {
  const t = f(e.collapsed ? "binding.expand" : "binding.collapse");
  return b`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function Jl(e) {
  var r;
  if (e.collapsed) return b`<div class="blist collapsed">${Bi(e)}</div>`;
  const t = co(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: Sn(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => Xl(e.filter, l) && (!i || a.name.toLowerCase().includes(i) || Fi(a).toLowerCase().includes(i))), o = ((r = e.selection) == null ? void 0 : r.kind) === "device" ? e.selection.id : null;
  return b`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${Gl.map((a) => b`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${f(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Bi(e)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${V(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? b`<p class="empty">${Ql(e, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const d = Ko(a);
    return b`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${f(`bindstatus.${l}`)} title=${f(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${Fi(a)}</small></span>
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
function Pt(e) {
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
    const o = de(s.value, e.rule);
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
function tc() {
  return {
    door: { width: be.door, hinge: "start", swing: "left" },
    window: { width: be.window, outside: "left" },
    opening: { width: be.opening },
    zoneName: null
  };
}
function ec(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function uo(e) {
  return os(f("zone.default"), e.zones.map((t) => t.name));
}
const nc = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function ic(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? uo(e.level);
    return b`
      <h4>${f("props.nextZone")}</h4>
      ${O(f("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${V(r)}
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
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return b`
    <h4>${f(`props.next.${n}`)}</h4>
    ${O(`${f("props.width")}, ${f("unit.mm")}`, Pt({
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
      ${O(f("props.hinge"), G(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${O(f("props.swing"), G(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? O(f("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class sc {
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
class oc {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Ye(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(ii(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = St(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await Ea(this.h.hass, t);
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
        this.h.plans = await Ye(this.h.hass);
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
      this.h.notice = St(n);
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
    this.h.toolId = Fn(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(ii(f("plan.default"))), this.offerDraft(null);
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
            await Aa(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = St(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ye(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = St(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(or) }, this.h.history = new sc(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = mn(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.needFit = !0;
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
class rc {
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
    !n || !oa(n.states, t) ? this.base = { states: t, meta: sa(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? aa(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), ra(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = f("binding.registryError").replace("{error}", St(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Hi = ls("", "");
function ac(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current) ?? Hi;
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
    openingDefaults: (t) => ec(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? uo(((t = e.history) == null ? void 0 : t.current) ?? Hi);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    }
  };
}
const ho = Object.keys(An), lc = (e) => ho.includes(e);
function cc() {
  return Object.fromEntries(ho.map((e) => [e, It(e, "free")]));
}
const po = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Rt, max: Rt, signed: !0 }, bad: "props.badAim" }
}, ne = (e, t, n, i, s) => Pt({ ...po[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), dc = ["round", "linear", "spot"], uc = ["rect", "circle"], Ee = (e, t) => e.map((n) => ({ v: n, label: f(`${t}.${n}`) }));
function fo(e, t, n, i) {
  const s = (r, a, l) => O(`${f(a)}, ${f("unit.mm")}`, ne(e, n + r, l, "mm", (d) => i({ [r]: d }))), o = (r, a, l) => O(`${f(a)}, ${f("unit.deg")}`, ne(e, n + r, l, "angle", (d) => i({ [r]: d })));
  switch (t.kind) {
    case "ceiling_light":
      return b`
        ${O(f("props.shape"), G(t.shape, Ee([...dc], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? b`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(`${f("props.poolRadius")}, ${f("unit.mm")}`, Pt({
        ...po.mm,
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
        .value=${V(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${Xo.map((r) => b`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "climate_sensor":
      return n === "" && e.device && e.level ? gc(e.level, e.device, t.zoneIds, i) : fc();
    case "equipment":
      return b`
        ${O(f("props.shape"), G(t.shape, Ee([...uc], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? b`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${O(f("props.icon"), pc(e, t.icon, `${n}icon`, i))}
        ${O(f("props.label"), b`<input class="val wide" type="text" data-field=${`${n}label`} .value=${V(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return b`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const hc = /^mdi:[a-z0-9-]+$/;
function pc(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!hc.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, f("props.badIcon"));
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
const fc = () => b`${$}`;
function gc(e, t, n, i) {
  var o;
  const s = n.length === 0 ? (o = e.zones.find((r) => r.id === ma(e, t))) == null ? void 0 : o.name : void 0;
  return b`<fieldset class="zones" data-field="zoneIds"><legend>${f("props.zones")}${n.length === 0 ? b` (${f("props.zonesAuto")}${s ? `: ${s}` : ""})` : $}</legend>
    ${e.zones.map((r) => b`<label class="row"><input type="checkbox" data-zone=${r.id} .checked=${n.includes(r.id)}
      @change=${(a) => {
    const l = a.target.checked, d = e.zones.map((p) => p.id).filter((p) => p === r.id ? l : n.includes(p));
    i({ zoneIds: d }) || (a.target.checked = !l);
  }} /><span>${r.name}</span></label>`)}
  </fieldset>`;
}
function mc(e, t) {
  const n = t.placement;
  if (n.mode === "free")
    return O(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      ne(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = cs.has(t.props.kind);
  return b`
    ${O(f("props.side"), G(n.side, Ee(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${O(`${f("props.offset")}, ${f("unit.mm")}`, ne(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? O(
    `${f("props.aim")}, ${f("unit.deg")}`,
    ne(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(Ys(n, s)))
  ) : $}`;
}
function go(e, t) {
  return O(f("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${V(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function bc(e, t) {
  const n = t.props.kind;
  return Ht(n) ? n === "smart_button" && t.placement.mode === "free" ? b`<p class="muted" data-note="type-free">${f("props.typeFreeHint")}</p>` : O(f("props.type"), G(
    n,
    Ee(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : $;
}
function yc(e, t) {
  return b`
    <h4>${f(`device.${t.props.kind}`)}</h4>
    ${go(t, (n) => e.onDevice({}, n))}
    ${bc(e, t)}
    ${fo(e, t.props, "", (n) => e.onDevice(n))}
    ${mc(e, t)}
    ${t.invalid ? b`<p class="warn">${f("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${f("action.delete")}</button>`;
}
function vc(e) {
  return e.device ? yc(e, e.device) : e.nextKind && e.nextProps ? b`
      <h4>${f("props.nextDevice")}: ${f(`device.${e.nextKind}`)}</h4>
      ${fo(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}` : b`<p class="muted">${f("props.none")}</p>`;
}
function $c(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((r) => r.id === n.id) ?? null : null, s = lc(e.toolId) ? e.toolId : null, o = (r) => r === t ? (e.setNotice(f("props.noFit")), !1) : (e.setNotice(null), e.commit(r), !0);
  return b`<div class="props">
    ${vc({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (r, a) => !!i && o(Ne(t, i.id, r, a)),
    onKind: (r) => !!i && o(Ur(t, i.id, r)),
    onPlacement: (r) => !!i && o(Cn(t, i.id, r)),
    onNext: (r) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && e.commit(_s(t, i.id));
    },
    onNotice: (r) => e.setNotice(r)
  })}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
  </div>`;
}
function mo(e, t, n) {
  return Pt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function ji(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function wc(e, t) {
  const n = it(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(na(t.level, e.id, o));
  return b`
    <h4>${f("props.wall")}</h4>
    ${O(f("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: f(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${O(f("props.thickness"), mo(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${O(f("props.baseline"), G(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: f(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${O(f("props.length"), b`<span class="val ro">${Mt(n)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(Ln(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function xc(e, t) {
  const n = ["door", "window", "opening", ..._e.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(Vr(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = _e.includes(e.kind);
  return b`
    <h4>${f(`kind.${e.kind}`)}</h4>
    ${O(f("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: f(`kind.${r}`) })), (r) => i(Wr(e, r))))}
    ${O(f("props.width"), mo(t, e.width, (r) => ji(t, qr(t.level, e.id, r))))}
    ${O(f("props.offset"), Pt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => ji(t, Ls(t.level, e.id, r))
  }))}
    ${o ? b`
      ${O(f("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${O(f("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : $}
    ${e.kind === "window" ? O(f("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : $}
    ${O(f("props.passesLight"), b`<input type="checkbox" data-field="passesLight" .checked=${V(Ps(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Is(e.kind) ? void 0 : a });
  }} />`)}
    ${O(f("props.passesPir"), b`<input type="checkbox" data-field="passesPir" .checked=${V(Cs(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Os(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? b`<p class="warn">${f("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(Ts(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function kc(e, t) {
  return b`
    <h4>${f("props.zone")}</h4>
    ${O(f("props.name"), b`<input class="val wide" type="text" .value=${V(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(Hr(t.level, e.id, s));
  }} />`)}
    ${O(f("props.area"), b`<span class="val ro">${Js(Es(e.outline))}</span>`)}
    ${e.broken ? b`<p class="warn">${f("props.broken")}</p>` : $}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(As(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function _c(e) {
  const t = ["bearing", "partition", "railing"];
  return b`
    <h4>${f("props.newWall")}</h4>
    ${O(f("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => b`<option value=${n} ?selected=${n === e.wallType}>${f(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${O(`${f("props.thickness")}, ${f("unit.mm")}`, Pt({
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
function Sc(e) {
  const { level: t, selection: n } = e;
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = wc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = xc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = kc(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = b`<h4>${f("props.node")}</h4>
      ${O("X", b`<span class="val ro">${Mt(s.x)}</span>`)}${O("Y", b`<span class="val ro">${Mt(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === $ && (e.tool === "wall" || e.tool === "box") ? _c(e) : i === $ && nc(e.tool) ? ic({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === $ ? b`<p class="muted">${f("props.none")}</p>` : i}
      ${e.notice ? b`<p class="warn">${e.notice}</p>` : $}
    </div>`;
}
function Ec(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const qi = /* @__PURE__ */ new WeakMap();
function Mc(e, t, n) {
  let i = qi.get(e);
  i || qi.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : Ec(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function Je(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = (e) => e ?? $;
var Ac = Object.defineProperty, pe = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Ac(t, n, s), s;
};
const Ic = 100;
let Pc = 0;
const Oc = (e) => b`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${e}></path>`}</svg>`, Hn = class Hn extends Tt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Pc++}`, this.shown = null, this.onOutside = (t) => {
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
        if (s.length === Ic) {
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
Hn.styles = Qi`
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
let wt = Hn;
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
var Cc = Object.defineProperty, Bn = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Cc(t, n, s), s;
};
const Nc = {
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
}, Wi = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Lc = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Vi(e, t) {
  return e != null && e.deviceClass && Wi[e.deviceClass] ? Wi[e.deviceClass] : Lc[(e == null ? void 0 : e.domain) ?? Us(t)] ?? "generic";
}
const Ki = (e) => Oc(Nc[e]);
function Tc(e) {
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
class Fe extends wt {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = Je(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? Je(this.meta, t) : null;
    return b`${Ki(t ? Vi(this.meta.entities.get(t), t) : "generic")}
      ${n ? b`<span><b>${n.name}</b>${n.context !== n.name ? b`<small>${n.context}</small>` : $}<small class="eid">${t}</small></span>` : b`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Bs(this.states, t.entityId) ?? "unavailable";
    return b`${Ki(Vi(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Tc(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = Je(this.meta, t).name;
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
Bn([
  ut({ attribute: !1 })
], Fe.prototype, "meta");
Bn([
  ut({ attribute: !1 })
], Fe.prototype, "items");
Bn([
  ut({ attribute: !1 })
], Fe.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Fe);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dc = Rn(class extends zn {
  constructor(e) {
    if (super(e), e.type !== pt.PROPERTY && e.type !== pt.ATTRIBUTE && e.type !== pt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!eo(e)) throw Error("`live` bindings can only contain a single expression");
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
    return no(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), ie(s, t);
  return !0;
}, Me = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, bo = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), Uc(t);
  }
};
function Rc(e) {
  this._$AN !== void 0 ? (Me(this), this._$AM = e, bo(this)) : this._$AM = e;
}
function zc(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) ie(i[o], !1), Me(i[o]);
  else i != null && (ie(i, !1), Me(i));
  else ie(this, e);
}
const Uc = (e) => {
  e.type == pt.CHILD && (e._$AP ?? (e._$AP = zc), e._$AQ ?? (e._$AQ = Rc));
};
class Fc extends zn {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), bo(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (ie(this, t), Me(this));
  }
  setValue(t) {
    if (eo(this._$Ct)) this._$Ct._$AI(t, this);
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
const Bc = () => new Hc();
class Hc {
}
const tn = /* @__PURE__ */ new WeakMap(), jc = Rn(class extends Fc {
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
      let n = tn.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), tn.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = tn.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), qc = () => [{ v: "0", label: f("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], Wc = { min: 1, max: 10 };
function yo(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const bn = (e, t, n) => yo(e, Ne(e.level, t.id, n));
function en(e, t, n, i) {
  return b`<div class="cflag">${O(t, b`<input type="checkbox" data-field=${e} .checked=${V(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const nn = "__other", Xt = /* @__PURE__ */ new Set();
function Vc(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = ni.includes(i), a = !r || Xt.has(o), l = Bc(), d = [...ni.map((c) => ({ v: c, label: c })), { v: nn, label: f("binding.eventOther") }];
  return b`<span class="evfield">${G(a ? nn : i, d, (c) => {
    if (c === nn) {
      Xt.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    Xt.delete(o), l.value && (l.value.hidden = !0), c !== i ? s(c) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${jc(l)} data-field=${`${n}-event-custom`} ?hidden=${Dc(!a)}
      .value=${V(r ? "" : i)} @change=${(c) => {
    var m;
    const h = c.target, u = h.value.trim();
    if (!u) {
      h.value = r ? "" : i, e.setFieldNotice(f("props.badEvent"));
      return;
    }
    if (h.value = u, e.setFieldNotice(null), u !== i) {
      s(u) && Xt.delete(o);
      return;
    }
    if (Xt.delete(o), r) {
      h.hidden = !0;
      const y = (m = h.parentElement) == null ? void 0 : m.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function Kc(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return b`${$}`;
  const s = i[n], o = (r) => bn(e, t, { [n]: { ...s, ...r } });
  return b`<div class="trigger" data-trigger=${n}>
    ${O(f("binding.slot"), G(
    String(s.slot),
    qc(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${O(f("binding.event"), Vc(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function Gc(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return b`
      ${en(
      "autoByDoubleToggle",
      f("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => bn(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? b`<div class="cflag">${O(f("binding.window"), Pt({
      value: i.windowSec,
      rule: Wc,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => bn(e, t, { windowSec: a })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return b`${$}`;
  const s = (a, l) => (d) => {
    var c, h;
    const p = Ne(e.level, t.id, { [a]: d });
    return yo(e, d && !((c = t.bindings) != null && c[l]) ? as(p, t.id, l, ((h = t.bindings) == null ? void 0 : h.on) ?? null) : p);
  }, o = s("separateOff", "off"), r = en("autoEnabled", f("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : b`${en("separateOff", f("binding.separateOff"), i.separateOff, o)}${i.separateOff ? $ : r}`;
}
function Zc(e) {
  return e.props.kind !== "smart_button" || !Yo(e).length ? b`${$}` : b`<div class="cfields"><p class="warn" data-note="duplicate">${f("binding.duplicate")}</p></div>`;
}
function Yc(e, t) {
  return t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? f("binding.onOff") : f(`role.${t}`);
}
const sn = (e) => String(e).padStart(2, "0");
function Xc(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${sn(t.getHours())}:${sn(t.getMinutes())}:${sn(t.getSeconds())}`;
}
const Qc = (e) => e.action === "set" ? `set ${e.value ?? ""}`.trim() : e.action;
function Jc(e) {
  return e.status === "error" ? e.reason === "unavailable" ? f("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : f("output.errorNotConfigured") : e.last ? f("output.last").replace("{event}", Qc(e.last)).replace("{time}", Xc(e.last.at)) : f("output.none");
}
function td(e, t) {
  if (!Ht(t.props.kind)) return $;
  const n = e.feed.stateOf(t), i = n ? Jc(n) : e.feed.error ?? (e.feed.ready ? f("output.notSaved") : null);
  return i === null ? $ : b`<p class="note" data-field="output">${i}</p>`;
}
function ed(e, t, n, i) {
  const s = Hs(e.meta, i, e.states), o = Zo(e.level, t, n);
  return b`
    ${s === "missing" ? b`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : $}
    ${s === "unavailable" ? b`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : $}
    ${o.length ? b`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : $}`;
}
function nd(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = Yc(t, i);
  return b`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${Mc(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const d = as(e.level, t.id, i, l.detail.value);
    d !== e.level && e.commit(d);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && _n(i) ? Kc(e, t, i) : $}
    ${s ? ed(e, t, i, s) : $}
  </div>`;
}
function id(e) {
  const t = e.device, n = Sn(e.level.devices.map(e.status));
  return b`<div class="props bprops">
    ${e.notice ? b`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : $}
    ${e.fieldNotice ? b`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : $}
    ${e.registryError ? b`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${f(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${t ? b`
      <h4>${f(`device.${t.props.kind}`)}</h4>
      ${go(t, (i) => e.commit(Ne(e.level, t.id, {}, i)))}
      ${td(e, t)}
      ${Bt(t).map((i) => b`${nd(e, t, i)}${Gc(e, t, i.role)}`)}
      ${Zc(t)}` : b`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${f("binding.reload")}</button>
  </div>`;
}
function sd(e, t) {
  return e.mode !== "binding" ? Wl(e.mode, e.toolId, (n) => e.pickTool(n)) : Jl({
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
function od(e, t) {
  var i;
  const n = e.selection;
  return id({
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
function rd(e, t) {
  if (e.mode === "binding") return od(e, t);
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (i) => e.commit(i),
    setNotice: (i) => {
      e.notice = i;
    }
  };
  return e.mode === "equipment" ? $c({ ...n, toolId: e.toolId, nextProps: e.nextProps, setNextProps: (i) => {
    e.nextProps = i;
  } }) : Sc({
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
function ad(e) {
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
function ld(e, t) {
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
function cd(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: d } = s[0], p = Math.hypot(d.x - l.x, d.y - l.y);
    let c = Math.atan2(-(d.y - l.y), d.x - l.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: Mt(p), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Mt(r), second: Mt(a) };
}
function dd(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const ud = Qi`
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
     reveal; the duplicate warning after the roles. */
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
`, hd = 5e-3, pd = 2, yn = (e) => Math.max(hd, Math.min(pd, e));
function fd(e, t, n) {
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
function gd(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: yn(Math.min(t, n) / 12e3) };
  const i = e.map((c) => c.x), s = e.map((c) => c.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, d = Math.max(...s) + o, p = yn(Math.min(t / (a - r), n / (d - l)));
  return { x: (r + a) / 2 - t / p / 2, y: (l + d) / 2 - n / p / 2, scale: p };
}
function md(e, t, n) {
  const i = yn(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function bd(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function yd(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function vd(e, t, n, i) {
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
const $d = ["Shift", "Control", "Alt", "Meta"];
function Gi(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class wd {
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
        this.h.view = bd(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = md(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Gi(n) || !this.h.history) return;
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
      const i = this.h.dialog !== null || Gi(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !$d.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function vo(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function xd(e) {
  return b`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", vo(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function Qt(e, t, n, i) {
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
function kd(e) {
  var n;
  const t = { action: "cancel", label: f("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? Qt(f("draft.title"), f("draft.text").replace("{time}", vo(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => e.discard(i) }
      ]) : $;
    }
    case "new":
      return Qt(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return Qt(f("delete.title"), f("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return Qt(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return Qt(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return $;
  }
}
const Jt = "plan_studio.draft.", ge = "plan_studio.lastPlanId";
function _d() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Sd(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class Ed {
  constructor(t = _d, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Jt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Jt + t), s = i ? JSON.parse(i) : null;
      return Sd(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(Jt))) continue;
        const o = this.read(s.slice(Jt.length));
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
      (n = this.storage()) == null || n.removeItem(Jt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Md = 5e3, Ad = 12, Id = 3e3;
function Zi(e) {
  e().catch(() => {
  });
}
class Pd {
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
    this.sub = null, n && (n.live = !1, t && n.unsub && Zi(n.unsub));
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
          Zi(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(St(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ad || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Md));
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
    }, Id), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
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
var Od = Object.defineProperty, z = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Od(t, n, s), s;
};
const jn = class jn extends Tt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Qo.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.cones = !0, this.nextProps = cc(), this.nextObj = tc(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new Ed(), this.resizeObs = null, this.session = new oc(this), this.haMeta = new rc(this), this.feed = new Pd(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Vo(i, (s) => {
      var o;
      return Hs(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Pa(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = ac(this), this.activeTool = mn("select", this.ctx), this.input = new wd(this);
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
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !Xe(t, this.selection) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null), this.requestUpdate());
  }
  /** Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the Binding step. */
  deleteSelection() {
    var i;
    const t = this.selection, n = (i = this.history) == null ? void 0 : i.current;
    return this.mode === "binding" || !t || !n || t.kind === "node" || !Xe(n, t) ? !1 : (this.commit(t.kind === "wall" ? Ln(n, t.id) : t.kind === "opening" ? Ts(n, t.id) : t.kind === "device" ? _s(n, t.id) : As(n, t.id)), !0);
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
    this.selection = this.mode === "binding" && n && i && Xe(i, n) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
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
    t !== this.mode && (this.mode = t, this.pickTool(Fn(t)[0]), t === "binding" && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    var o;
    const n = (o = this.history) == null ? void 0 : o.current, i = n == null ? void 0 : n.devices.find((r) => r.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = Q(n, i);
    s && (this.view = yd(this.view, s.pt, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i, s;
    const t = (i = this.history) == null ? void 0 : i.current, n = t ? Yl(t, ((s = this.selection) == null ? void 0 : s.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return fd(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = gd(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return kd({
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
    var p, c, h;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const t = $l(!!((c = (p = this.hass) == null ? void 0 : p.themes) != null && c.darkMode)), n = this.history.current, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, d = this.save;
    return b`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : ""}" style=${dd(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${ql({
      steps: Kl({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        planName: this.plan.name,
        onRename: (u) => {
          this.plan = { ...this.plan, name: u }, d.markDirty();
        },
        onMode: (u) => this.setMode(u),
        onNextUnbound: () => this.nextUnboundDevice()
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: d.state,
      dirty: d.dirty,
      errorMessage: d.errorMessage,
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (u) => this.session.pickPlan(u),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${sd(this, n)}
        ${rd(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(u) => u.preventDefault()}>
            ${this.grid ? vd(this.view, a, l, t) : $}
            ${bl(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (u) => this.feed.stateOf(u),
      containerFlash: (u) => this.feed.flash(u.id)
    })}
            ${i.tracker ? ld(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: cd(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${this.pendingDraft && ((h = this.dialog) == null ? void 0 : h.kind) !== "restore" ? xd({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${ad({
      grid: this.grid,
      zoomPct: Math.round(r * 1e3),
      snap: i.snap && i.snap.kind !== "none" ? f(`snap.${i.snap.kind}`) : null,
      onGrid: (u) => {
        this.grid = u;
      },
      cones: this.cones,
      onCones: (u) => {
        this.cones = u;
      },
      binding: this.mode === "binding"
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
jn.styles = ud;
let T = jn;
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
