/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis, en = de.ShadowRoot && (de.ShadyCSS === void 0 || de.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nn = Symbol(), wn = /* @__PURE__ */ new WeakMap();
let wi = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== nn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (en && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = wn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && wn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ds = (n) => new wi(typeof n == "string" ? n : n + "", void 0, nn), xi = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new wi(e, n, nn);
}, zs = (n, t) => {
  if (en) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = de.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, xn = en ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ds(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Rs, defineProperty: Ts, getOwnPropertyDescriptor: Us, getOwnPropertyNames: Bs, getOwnPropertySymbols: Hs, getPrototypeOf: js } = Object, pt = globalThis, kn = pt.trustedTypes, Fs = kn ? kn.emptyScript : "", Oe = pt.reactiveElementPolyfillSupport, Zt = (n, t) => n, pe = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Fs : null;
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
} }, sn = (n, t) => !Rs(n, t), _n = { attribute: !0, type: String, converter: pe, reflect: !1, useDefault: !1, hasChanged: sn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), pt.litPropertyMetadata ?? (pt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Mt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = _n) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Ts(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = Us(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? _n;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Zt("elementProperties"))) return;
    const t = js(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Zt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Zt("properties"))) {
      const e = this.properties, i = [...Bs(e), ...Hs(e)];
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
      for (const s of i) e.unshift(xn(s));
    } else t !== void 0 && e.push(xn(t));
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
    return zs(t, this.constructor.elementStyles), t;
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
      const o = (((r = i.converter) == null ? void 0 : r.toAttribute) !== void 0 ? i.converter : pe).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var r, o;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : pe;
      this._$Em = s;
      const c = l.fromAttribute(e, a.type);
      this[s] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (r = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? sn)(r, e) || i.useDefault && i.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
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
Mt.elementStyles = [], Mt.shadowRootOptions = { mode: "open" }, Mt[Zt("elementProperties")] = /* @__PURE__ */ new Map(), Mt[Zt("finalized")] = /* @__PURE__ */ new Map(), Oe == null || Oe({ ReactiveElement: Mt }), (pt.reactiveElementVersions ?? (pt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = globalThis, Sn = (n) => n, fe = Yt.trustedTypes, En = fe ? fe.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ki = "$lit$", ct = `lit$${Math.random().toFixed(9).slice(2)}$`, _i = "?" + ct, qs = `<${_i}>`, _t = document, Xt = () => _t.createComment(""), Qt = (n) => n === null || typeof n != "object" && typeof n != "function", rn = Array.isArray, Vs = (n) => rn(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", Ne = `[ 	
\f\r]`, qt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mn = /-->/g, An = />/g, bt = RegExp(`>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), In = /'/g, Pn = /"/g, Si = /^(?:script|style|textarea|title)$/i, Ei = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), m = Ei(1), _ = Ei(2), mt = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), Cn = /* @__PURE__ */ new WeakMap(), $t = _t.createTreeWalker(_t, 129);
function Mi(n, t) {
  if (!rn(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return En !== void 0 ? En.createHTML(t) : t;
}
const Ws = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = qt;
  for (let a = 0; a < e; a++) {
    const l = n[a];
    let c, p, d = -1, u = 0;
    for (; u < l.length && (o.lastIndex = u, p = o.exec(l), p !== null); ) u = o.lastIndex, o === qt ? p[1] === "!--" ? o = Mn : p[1] !== void 0 ? o = An : p[2] !== void 0 ? (Si.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = bt) : p[3] !== void 0 && (o = bt) : o === bt ? p[0] === ">" ? (o = s ?? qt, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? bt : p[3] === '"' ? Pn : In) : o === Pn || o === In ? o = bt : o === Mn || o === An ? o = qt : (o = bt, s = void 0);
    const h = o === bt && n[a + 1].startsWith("/>") ? " " : "";
    r += o === qt ? l + qs : d >= 0 ? (i.push(c), l.slice(0, d) + ki + l.slice(d) + ct + h) : l + ct + (d === -2 ? a : h);
  }
  return [Mi(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Jt {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, l = this.parts, [c, p] = Ws(t, e);
    if (this.el = Jt.createElement(c, i), $t.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = $t.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(ki)) {
          const u = p[o++], h = s.getAttribute(d).split(ct), g = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: r, name: g[2], strings: h, ctor: g[1] === "." ? Zs : g[1] === "?" ? Ys : g[1] === "@" ? Gs : xe }), s.removeAttribute(d);
        } else d.startsWith(ct) && (l.push({ type: 6, index: r }), s.removeAttribute(d));
        if (Si.test(s.tagName)) {
          const d = s.textContent.split(ct), u = d.length - 1;
          if (u > 0) {
            s.textContent = fe ? fe.emptyScript : "";
            for (let h = 0; h < u; h++) s.append(d[h], Xt()), $t.nextNode(), l.push({ type: 2, index: ++r });
            s.append(d[u], Xt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === _i) l.push({ type: 2, index: r });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(ct, d + 1)) !== -1; ) l.push({ type: 7, index: r }), d += ct.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = _t.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Ot(n, t, e = n, i) {
  var o, a;
  if (t === mt) return t;
  let s = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const r = Qt(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = Ot(n, s._$AS(n, t.values), s, i)), t;
}
class Ks {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? _t).importNode(e, !0);
    $t.currentNode = s;
    let r = $t.nextNode(), o = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let c;
        l.type === 2 ? c = new on(r, r.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (c = new Xs(r, this, t)), this._$AV.push(c), l = i[++a];
      }
      o !== (l == null ? void 0 : l.index) && (r = $t.nextNode(), o++);
    }
    return $t.currentNode = _t, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
let on = class Ai {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = Ot(this, t, e), Qt(t) ? t === $ || t == null || t === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : t !== this._$AH && t !== mt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Vs(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== $ && Qt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_t.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Jt.createElement(Mi(i.h, i.h[0]), this.options)), i);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(e);
    else {
      const o = new Ks(s, this), a = o.u(this.options);
      o.p(e), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Cn.get(t.strings);
    return e === void 0 && Cn.set(t.strings, e = new Jt(t)), e;
  }
  k(t) {
    rn(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new Ai(this.O(Xt()), this.O(Xt()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = Sn(t).nextSibling;
      Sn(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
};
class xe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = $;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = Ot(this, t, e, 0), o = !Qt(t) || t !== this._$AH && t !== mt, o && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = r[0], l = 0; l < r.length - 1; l++) c = Ot(this, a[i + l], e, l), c === mt && (c = this._$AH[l]), o || (o = !Qt(c) || c !== this._$AH[l]), c === $ ? t = $ : t !== $ && (t += (c ?? "") + r[l + 1]), this._$AH[l] = c;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Zs extends xe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === $ ? void 0 : t;
  }
}
class Ys extends xe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== $);
  }
}
let Gs = class extends xe {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = Ot(this, t, e, 0) ?? $) === mt) return;
    const i = this._$AH, s = t === $ && i !== $ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== $ && (i === $ || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class Xs {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ot(this, t);
  }
}
const Le = Yt.litHtmlPolyfillSupport;
Le == null || Le(Jt, on), (Yt.litHtmlVersions ?? (Yt.litHtmlVersions = [])).push("3.3.3");
const Qs = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new on(t.insertBefore(Xt(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = globalThis;
let Ct = class extends Mt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Qs(e, this.renderRoot, this.renderOptions);
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
    return mt;
  }
};
var $i;
Ct._$litElement$ = !0, Ct.finalized = !0, ($i = xt.litElementHydrateSupport) == null || $i.call(xt, { LitElement: Ct });
const De = xt.litElementPolyfillSupport;
De == null || De({ LitElement: Ct });
(xt.litElementVersions ?? (xt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Js = { attribute: !0, type: String, converter: pe, reflect: !1, hasChanged: sn }, tr = (n = Js, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), i === "accessor") {
    const { name: o } = e;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, n, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, n, a), a;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, n, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function J(n) {
  return (t, e) => typeof e == "object" ? tr(n, t, e) : ((i, s, r) => {
    const o = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function L(n) {
  return J({ ...n, state: !0, attribute: !1 });
}
function nt() {
  const n = new Uint8Array(6);
  return crypto.getRandomValues(n), Array.from(n, (t) => t.toString(16).padStart(2, "0")).join("");
}
function Ii(n, t) {
  const e = new Set(t);
  let i = 1;
  for (; e.has(`${n} ${i}`); ) i++;
  return `${n} ${i}`;
}
const On = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, St = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [{ role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 }],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  switch: [
    { role: "action", domains: ["event", "sensor"], primary: !0 },
    { role: "state", domains: ["switch", "light", "binary_sensor"], primary: !1 }
  ],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, On],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, On]
}, er = { climate_sensor: "any" };
function Pi(n) {
  return new Set(St[n.props.kind].map((t) => t.role));
}
function Ci(n, t, e, i) {
  var a;
  const s = n.devices.find((l) => l.id === t);
  if (!s || !Pi(s).has(e)) return n;
  const r = (a = s.bindings) == null ? void 0 : a[e];
  if (i === null || i === "") {
    if (r === void 0) return n;
    const l = { ...s.bindings };
    delete l[e];
    const c = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete c.bindings, { ...n, devices: n.devices.map((p) => p === s ? c : p) };
  }
  if (r === i) return n;
  const o = { ...s, bindings: { ...s.bindings, [e]: i } };
  return { ...n, devices: n.devices.map((l) => l === s ? o : l) };
}
function nr(n, t) {
  const e = n.bindings ?? {}, i = Object.values(e).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = St[n.props.kind].filter((a) => a.primary), r = s.filter((a) => !!e[a.role]);
  return (er[n.props.kind] === "any" ? r.length > 0 : r.length === s.length) ? "bound" : "partial";
}
function ir(n) {
  const t = St[n.props.kind];
  return { filled: t.filter((e) => {
    var i;
    return !!((i = n.bindings) != null && i[e.role]);
  }).length, total: t.length };
}
function sr(n, t, e) {
  return n.devices.filter((i) => i.id !== e && Object.values(i.bindings ?? {}).includes(t));
}
function rr(n) {
  if (!n.bindings) return n;
  const t = Pi(n), e = Object.entries(n.bindings).filter(([s, r]) => t.has(s) && !!r);
  if (e.length > 0 && e.length === Object.keys(n.bindings).length) return n;
  const i = { ...n };
  return e.length ? i.bindings = Object.fromEntries(e) : delete i.bindings, i;
}
const or = [100, 125, 150], an = "mdi:cube-outline", ar = {
  bearing: 400
}, he = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Oi(n = nt(), t = "Level 1") {
  return { id: n, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Nn(n) {
  return {
    id: nt(),
    name: n,
    schemaVersion: 1,
    revision: 0,
    levels: [Oi()]
  };
}
const ln = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  switch: ["wall"],
  socket: ["wall"],
  equipment: ["free"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, Nt = 90, Ni = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function je(n, t) {
  switch (n) {
    case "ceiling_light":
      return { kind: n, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: n, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: n, zoneAngle: t === "free" ? 360 : 110, zoneRange: 5e3 };
    case "climate_sensor":
      return { kind: n, zoneIds: [] };
    case "exhaust_fan":
      return { kind: n, diameter: 100 };
    case "equipment":
      return { kind: n, shape: "rect", width: 600, depth: 600, diameter: 600, icon: an, label: "" };
    default:
      return { kind: n };
  }
}
const lr = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: an
};
function cr(n) {
  const t = n.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return n;
  const { symbol: e, ...i } = t, s = typeof t.icon == "string" ? t.icon : lr[String(e)] ?? an;
  return { ...n, props: { ...i, icon: s } };
}
function dr(n) {
  if (!n.devices) return { ...n, devices: [] };
  const t = n.devices.map((e) => rr(cr(e)));
  return t.some((e, i) => e !== n.devices[i]) ? { ...n, devices: t } : n;
}
function M(n, t) {
  return { x: n.x + t.x, y: n.y + t.y };
}
function A(n, t) {
  return { x: n.x - t.x, y: n.y - t.y };
}
function k(n, t) {
  return { x: n.x * t, y: n.y * t };
}
function W(n, t) {
  return n.x * t.x + n.y * t.y;
}
function Lt(n, t) {
  return n.x * t.y - n.y * t.x;
}
function Li(n) {
  return Math.hypot(n.x, n.y);
}
function R(n, t) {
  return Li(A(t, n));
}
function cn(n) {
  const t = Li(n);
  return t === 0 ? { x: 0, y: 0 } : k(n, 1 / t);
}
function Z(n) {
  return { x: n.y, y: -n.x };
}
function hr(n, t, e) {
  return { x: n.x + (t.x - n.x) * e, y: n.y + (t.y - n.y) * e };
}
function ht(n, t, e, i) {
  const s = Lt(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const r = Lt(A(e, n), i) / s;
  return M(n, k(t, r));
}
function Di(n, t, e) {
  const i = A(e, t), s = W(i, i);
  return s === 0 ? 0 : W(A(n, t), i) / s;
}
function se(n, t) {
  let e = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const r = t[i], o = t[s];
    r.y > n.y != o.y > n.y && n.x < (o.x - r.x) * (n.y - r.y) / (o.y - r.y) + r.x && (e = !e);
  }
  return e;
}
function Dt(n) {
  let t = 0;
  for (let e = 0; e < n.length; e++) {
    const i = n[e], s = n[(e + 1) % n.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
class vt {
  constructor(t, e) {
    this.next = null, this.key = t, this.data = e, this.left = null, this.right = null;
  }
}
function ur(n, t) {
  return n > t ? 1 : n < t ? -1 : 0;
}
function dt(n, t, e) {
  const i = new vt(null, null);
  let s = i, r = i;
  for (; ; ) {
    const o = e(n, t.key);
    if (o < 0) {
      if (t.left === null) break;
      if (e(n, t.left.key) < 0) {
        const a = t.left;
        if (t.left = a.right, a.right = t, t = a, t.left === null) break;
      }
      r.left = t, r = t, t = t.left;
    } else if (o > 0) {
      if (t.right === null) break;
      if (e(n, t.right.key) > 0) {
        const a = t.right;
        if (t.right = a.left, a.left = t, t = a, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, r.left = t.right, t.left = i.right, t.right = i.left, t;
}
function ze(n, t, e, i) {
  const s = new vt(n, t);
  if (e === null)
    return s.left = s.right = null, s;
  e = dt(n, e, i);
  const r = i(n, e.key);
  return r < 0 ? (s.left = e.left, s.right = e, e.left = null) : r >= 0 && (s.right = e.right, s.left = e, e.right = null), s;
}
function Ln(n, t, e) {
  let i = null, s = null;
  if (t) {
    t = dt(n, t, e);
    const r = e(t.key, n);
    r === 0 ? (i = t.left, s = t.right) : r < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function pr(n, t, e) {
  return t === null ? n : (n === null || (t = dt(n.key, t, e), t.left = n), t);
}
function Fe(n, t, e, i, s) {
  if (n) {
    i(`${t}${e ? "└── " : "├── "}${s(n)}
`);
    const r = t + (e ? "    " : "│   ");
    n.left && Fe(n.left, r, !1, i, s), n.right && Fe(n.right, r, !0, i, s);
  }
}
class dn {
  constructor(t = ur) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, e) {
    return this._size++, this._root = ze(t, e, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, e) {
    const i = new vt(t, e);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, r = dt(t, this._root, s), o = s(t, r.key);
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
    return e === null ? null : (e = dt(t, e, i), i(t, e.key) === 0 ? (e.left === null ? s = e.right : (s = dt(t, e.left, i), s.right = e.right), this._size--, s) : e);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = dt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = dt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    let a = this._root, l;
    for (; r.length !== 0 || a; )
      if (a)
        r.push(a), a = a.left;
      else {
        if (a = r.pop(), l = o(a.key, e), l > 0)
          break;
        if (o(a.key, t) >= 0 && i.call(s, a))
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
    return gr(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, e = [], i = !1) {
    let s = t.length;
    const r = this._comparator;
    if (i && We(t, e, 0, s - 1, r), this._root === null)
      this._root = qe(t, e, 0, s), this._size = s;
    else {
      const o = mr(
        this.toList(),
        fr(t, e),
        r
      );
      s = this._size + s, this._root = Ve({ head: o }, 0, s);
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
    return Fe(this._root, "", !0, (i) => e.push(i), t), e.join("");
  }
  update(t, e, i) {
    const s = this._comparator;
    let { left: r, right: o } = Ln(t, this._root, s);
    s(t, e) < 0 ? o = ze(e, i, o, s) : r = ze(e, i, r, s), this._root = pr(r, o, s);
  }
  split(t) {
    return Ln(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const e = [];
    let i = !1;
    for (; !i; )
      t !== null ? (e.push(t), t = t.left) : e.length !== 0 ? (t = e.pop(), yield t, t = t.right) : i = !0;
  }
}
function qe(n, t, e, i) {
  const s = i - e;
  if (s > 0) {
    const r = e + Math.floor(s / 2), o = n[r], a = t[r], l = new vt(o, a);
    return l.left = qe(n, t, e, r), l.right = qe(n, t, r + 1, i), l;
  }
  return null;
}
function fr(n, t) {
  const e = new vt(null, null);
  let i = e;
  for (let s = 0; s < n.length; s++)
    i = i.next = new vt(n[s], t[s]);
  return i.next = null, e.next;
}
function gr(n) {
  let t = n;
  const e = [];
  let i = !1;
  const s = new vt(null, null);
  let r = s;
  for (; !i; )
    t ? (e.push(t), t = t.left) : e.length > 0 ? (t = r = r.next = e.pop(), t = t.right) : i = !0;
  return r.next = null, s.next;
}
function Ve(n, t, e) {
  const i = e - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), r = Ve(n, t, s), o = n.head;
    return o.left = r, n.head = n.head.next, o.right = Ve(n, s + 1, e), o;
  }
  return null;
}
function mr(n, t, e) {
  const i = new vt(null, null);
  let s = i, r = n, o = t;
  for (; r !== null && o !== null; )
    e(r.key, o.key) < 0 ? (s.next = r, r = r.next) : (s.next = o, o = o.next), s = s.next;
  return r !== null ? s.next = r : o !== null && (s.next = o), i.next;
}
function We(n, t, e, i, s) {
  if (e >= i) return;
  const r = n[e + i >> 1];
  let o = e - 1, a = i + 1;
  for (; ; ) {
    do
      o++;
    while (s(n[o], r) < 0);
    do
      a--;
    while (s(n[a], r) > 0);
    if (o >= a) break;
    let l = n[o];
    n[o] = n[a], n[a] = l, l = t[o], t[o] = t[a], t[a] = l;
  }
  We(n, t, e, a, s), We(n, t, a + 1, i, s);
}
const ot = 11102230246251565e-32, j = 134217729, vr = (3 + 8 * ot) * ot;
function Re(n, t, e, i, s) {
  let r, o, a, l, c = t[0], p = i[0], d = 0, u = 0;
  p > c == p > -c ? (r = c, c = t[++d]) : (r = p, p = i[++u]);
  let h = 0;
  if (d < n && u < e)
    for (p > c == p > -c ? (o = c + r, a = r - (o - c), c = t[++d]) : (o = p + r, a = r - (o - p), p = i[++u]), r = o, a !== 0 && (s[h++] = a); d < n && u < e; )
      p > c == p > -c ? (o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++d]) : (o = r + p, l = o - r, a = r - (o - l) + (p - l), p = i[++u]), r = o, a !== 0 && (s[h++] = a);
  for (; d < n; )
    o = r + c, l = o - r, a = r - (o - l) + (c - l), c = t[++d], r = o, a !== 0 && (s[h++] = a);
  for (; u < e; )
    o = r + p, l = o - r, a = r - (o - l) + (p - l), p = i[++u], r = o, a !== 0 && (s[h++] = a);
  return (r !== 0 || h === 0) && (s[h++] = r), h;
}
function yr(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function b(n) {
  return new Float64Array(n);
}
const br = (3 + 16 * ot) * ot, $r = (2 + 12 * ot) * ot, wr = (9 + 64 * ot) * ot * ot, Et = b(4), Dn = b(8), zn = b(12), Rn = b(16), V = b(4);
function xr(n, t, e, i, s, r, o) {
  let a, l, c, p, d, u, h, g, v, w, y, x, S, E, P, N, z, O;
  const B = n - s, F = e - s, q = t - r, tt = i - r;
  E = B * tt, u = j * B, h = u - (u - B), g = B - h, u = j * tt, v = u - (u - tt), w = tt - v, P = g * w - (E - h * v - g * v - h * w), N = q * F, u = j * q, h = u - (u - q), g = q - h, u = j * F, v = u - (u - F), w = F - v, z = g * w - (N - h * v - g * v - h * w), y = P - z, d = P - y, Et[0] = P - (y + d) + (d - z), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, Et[1] = S - (y + d) + (d - N), O = x + y, d = O - x, Et[2] = x - (O - d) + (y - d), Et[3] = O;
  let rt = yr(4, Et), Ft = $r * o;
  if (rt >= Ft || -rt >= Ft || (d = n - B, a = n - (B + d) + (d - s), d = e - F, c = e - (F + d) + (d - s), d = t - q, l = t - (q + d) + (d - r), d = i - tt, p = i - (tt + d) + (d - r), a === 0 && l === 0 && c === 0 && p === 0) || (Ft = wr * o + vr * Math.abs(rt), rt += B * p + tt * a - (q * c + F * l), rt >= Ft || -rt >= Ft)) return rt;
  E = a * tt, u = j * a, h = u - (u - a), g = a - h, u = j * tt, v = u - (u - tt), w = tt - v, P = g * w - (E - h * v - g * v - h * w), N = l * F, u = j * l, h = u - (u - l), g = l - h, u = j * F, v = u - (u - F), w = F - v, z = g * w - (N - h * v - g * v - h * w), y = P - z, d = P - y, V[0] = P - (y + d) + (d - z), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, V[1] = S - (y + d) + (d - N), O = x + y, d = O - x, V[2] = x - (O - d) + (y - d), V[3] = O;
  const Os = Re(4, Et, 4, V, Dn);
  E = B * p, u = j * B, h = u - (u - B), g = B - h, u = j * p, v = u - (u - p), w = p - v, P = g * w - (E - h * v - g * v - h * w), N = q * c, u = j * q, h = u - (u - q), g = q - h, u = j * c, v = u - (u - c), w = c - v, z = g * w - (N - h * v - g * v - h * w), y = P - z, d = P - y, V[0] = P - (y + d) + (d - z), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, V[1] = S - (y + d) + (d - N), O = x + y, d = O - x, V[2] = x - (O - d) + (y - d), V[3] = O;
  const Ns = Re(Os, Dn, 4, V, zn);
  E = a * p, u = j * a, h = u - (u - a), g = a - h, u = j * p, v = u - (u - p), w = p - v, P = g * w - (E - h * v - g * v - h * w), N = l * c, u = j * l, h = u - (u - l), g = l - h, u = j * c, v = u - (u - c), w = c - v, z = g * w - (N - h * v - g * v - h * w), y = P - z, d = P - y, V[0] = P - (y + d) + (d - z), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, V[1] = S - (y + d) + (d - N), O = x + y, d = O - x, V[2] = x - (O - d) + (y - d), V[3] = O;
  const Ls = Re(Ns, zn, 4, V, Rn);
  return Rn[Ls - 1];
}
function kr(n, t, e, i, s, r) {
  const o = (t - r) * (e - s), a = (n - s) * (i - r), l = o - a, c = Math.abs(o + a);
  return Math.abs(l) >= br * c ? l : -xr(n, t, e, i, s, r, c);
}
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(8);
b(8);
b(8);
b(4);
b(8);
b(8);
b(16);
b(12);
b(192);
b(192);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(8);
b(8);
b(8);
b(8);
b(8);
b(8);
b(8);
b(8);
b(8);
b(4);
b(4);
b(4);
b(8);
b(16);
b(16);
b(16);
b(32);
b(32);
b(48);
b(64);
b(1152);
b(1152);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(4);
b(24);
b(24);
b(24);
b(24);
b(24);
b(24);
b(24);
b(24);
b(24);
b(24);
b(1152);
b(1152);
b(1152);
b(1152);
b(1152);
b(2304);
b(2304);
b(3456);
b(5760);
b(8);
b(8);
b(8);
b(16);
b(24);
b(48);
b(48);
b(96);
b(192);
b(384);
b(384);
b(384);
b(768);
b(96);
b(96);
b(96);
b(1152);
const Vt = (n, t) => n.ll.x <= t.x && t.x <= n.ur.x && n.ll.y <= t.y && t.y <= n.ur.y, Ke = (n, t) => {
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
let ut = Number.EPSILON;
ut === void 0 && (ut = Math.pow(2, -52));
const _r = ut * ut, Tn = (n, t) => {
  if (-ut < n && n < ut && -ut < t && t < ut)
    return 0;
  const e = n - t;
  return e * e < _r * n * t ? 0 : n < t ? -1 : 1;
};
class Sr {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Un(), this.yRounder = new Un();
  }
  round(t, e) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(e)
    };
  }
}
class Un {
  constructor() {
    this.tree = new dn(), this.round(0);
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
    if (i !== null && Tn(e.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(e);
    return s !== null && Tn(e.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const te = new Sr(), ue = (n, t) => n.x * t.y - n.y * t.x, zi = (n, t) => n.x * t.x + n.y * t.y, Bn = (n, t, e) => {
  const i = kr(n.x, n.y, t.x, t.y, e.x, e.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, ge = (n) => Math.sqrt(zi(n, n)), Er = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return ue(s, i) / ge(s) / ge(i);
}, Mr = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return zi(s, i) / ge(s) / ge(i);
}, Hn = (n, t, e) => t.y === 0 ? null : {
  x: n.x + t.x / t.y * (e - n.y),
  y: e
}, jn = (n, t, e) => t.x === 0 ? null : {
  x: e,
  y: n.y + t.y / t.x * (e - n.x)
}, Ar = (n, t, e, i) => {
  if (t.x === 0) return jn(e, i, n.x);
  if (i.x === 0) return jn(n, t, e.x);
  if (t.y === 0) return Hn(e, i, n.y);
  if (i.y === 0) return Hn(n, t, e.y);
  const s = ue(t, i);
  if (s == 0) return null;
  const r = {
    x: e.x - n.x,
    y: e.y - n.y
  }, o = ue(r, t) / s, a = ue(r, i) / s, l = n.x + a * t.x, c = e.x + o * i.x, p = n.y + a * t.y, d = e.y + o * i.y, u = (l + c) / 2, h = (p + d) / 2;
  return {
    x: u,
    y: h
  };
};
class G {
  // for ordering sweep events in the sweep event queue
  static compare(t, e) {
    const i = G.comparePoints(t.point, e.point);
    return i !== 0 ? i : (t.point !== e.point && t.link(e), t.isLeft !== e.isLeft ? t.isLeft ? 1 : -1 : ft.compare(t.segment, e.segment));
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
        sine: Er(this.point, t.point, r.point),
        cosine: Mr(this.point, t.point, r.point)
      });
    };
    return (s, r) => {
      e.has(s) || i(s), e.has(r) || i(r);
      const {
        sine: o,
        cosine: a
      } = e.get(s), {
        sine: l,
        cosine: c
      } = e.get(r);
      return o >= 0 && l >= 0 ? a < c ? 1 : a > c ? -1 : 0 : o < 0 && l < 0 ? a < c ? -1 : a > c ? 1 : 0 : l < o ? -1 : l > o ? 1 : 0;
    };
  }
}
let Ir = 0;
class ft {
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
    const a = t.leftSE.point.y, l = e.leftSE.point.y, c = t.rightSE.point.y, p = e.rightSE.point.y;
    if (i < s) {
      if (l < a && l < c) return 1;
      if (l > a && l > c) return -1;
      const d = t.comparePoint(e.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const u = e.comparePoint(t.rightSE.point);
      return u !== 0 ? u : -1;
    }
    if (i > s) {
      if (a < l && a < p) return -1;
      if (a > l && a > p) return 1;
      const d = e.comparePoint(t.leftSE.point);
      if (d !== 0) return d;
      const u = t.comparePoint(e.rightSE.point);
      return u < 0 ? 1 : u > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
    if (r < o) {
      const d = e.comparePoint(t.rightSE.point);
      if (d !== 0) return d;
    }
    if (r > o) {
      const d = t.comparePoint(e.rightSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
    }
    if (r !== o) {
      const d = c - a, u = r - i, h = p - l, g = o - s;
      if (d > u && h < g) return 1;
      if (d < u && h > g) return -1;
    }
    return r > o ? 1 : r < o || c < p ? -1 : c > p ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, e, i, s) {
    this.id = ++Ir, this.leftSE = t, t.segment = this, t.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, e, i) {
    let s, r, o;
    const a = G.comparePoints(t, e);
    if (a < 0)
      s = t, r = e, o = 1;
    else if (a > 0)
      s = e, r = t, o = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new G(s, !0), c = new G(r, !1);
    return new ft(l, c, [i], [o]);
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
    const a = (t.x - e.x) / s.x, l = e.y + a * s.y;
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
    const e = this.bbox(), i = t.bbox(), s = Ke(e, i);
    if (s === null) return null;
    const r = this.leftSE.point, o = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, c = Vt(e, a) && this.comparePoint(a) === 0, p = Vt(i, r) && t.comparePoint(r) === 0, d = Vt(e, l) && this.comparePoint(l) === 0, u = Vt(i, o) && t.comparePoint(o) === 0;
    if (p && c)
      return u && !d ? o : !u && d ? l : null;
    if (p)
      return d && r.x === l.x && r.y === l.y ? null : r;
    if (c)
      return u && o.x === a.x && o.y === a.y ? null : a;
    if (u && d) return null;
    if (u) return o;
    if (d) return l;
    const h = Ar(r, this.vector(), a, t.vector());
    return h === null || !Vt(s, h) ? null : te.round(h.x, h.y);
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
    const e = [], i = t.events !== void 0, s = new G(t, !0), r = new G(t, !1), o = this.rightSE;
    this.replaceRightSE(r), e.push(r), e.push(s);
    const a = new ft(s, o, this.rings.slice(), this.windings.slice());
    return G.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), G.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), r.checkForConsuming()), e;
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
    const s = ft.compare(e, i);
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
        const a = i.rings[r], l = i.windings[r], c = e.rings.indexOf(a);
        c === -1 ? (e.rings.push(a), e.windings.push(l)) : e.windings[c] += l;
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
    for (let a = 0, l = this.rings.length; a < l; a++) {
      const c = this.rings[a], p = this.windings[a], d = e.indexOf(c);
      d === -1 ? (e.push(c), i.push(p)) : i[d] += p;
    }
    const r = [], o = [];
    for (let a = 0, l = e.length; a < l; a++) {
      if (i[a] === 0) continue;
      const c = e[a], p = c.poly;
      if (o.indexOf(p) === -1)
        if (c.isExterior) r.push(p);
        else {
          o.indexOf(p) === -1 && o.push(p);
          const d = r.indexOf(c.poly);
          d !== -1 && r.splice(d, 1);
        }
    }
    for (let a = 0, l = r.length; a < l; a++) {
      const c = r[a].multiPoly;
      s.indexOf(c) === -1 && s.push(c);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, e = this.afterState().multiPolys;
    switch (et.type) {
      case "union": {
        const i = t.length === 0, s = e.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < e.length ? (i = t.length, s = e.length) : (i = e.length, s = t.length), this._isInResult = s === et.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${et.type}`);
    }
    return this._isInResult;
  }
}
class Fn {
  constructor(t, e, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = e, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = te.round(t[0][0], t[0][1]);
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
    for (let o = 1, a = t.length; o < a; o++) {
      if (typeof t[o][0] != "number" || typeof t[o][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let l = te.round(t[o][0], t[o][1]);
      l.x === r.x && l.y === r.y || (this.segments.push(ft.fromRing(r, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), r = l);
    }
    (s.x !== r.x || s.y !== r.y) && this.segments.push(ft.fromRing(r, s, this));
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
class Pr {
  constructor(t, e) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Fn(t[0], this, !0), this.bbox = {
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
      const r = new Fn(t[i], this, !1);
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
class qn {
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
      const r = new Pr(t[i], this);
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
class me {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const e = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const r = t[i];
      if (!r.isInResult() || r.ringOut) continue;
      let o = null, a = r.leftSE, l = r.rightSE;
      const c = [a], p = a.point, d = [];
      for (; o = a, a = l, c.push(a), a.point !== p; )
        for (; ; ) {
          const u = a.getAvailableLinkedEvents();
          if (u.length === 0) {
            const v = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${v.x}, ${v.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (u.length === 1) {
            l = u[0].otherSE;
            break;
          }
          let h = null;
          for (let v = 0, w = d.length; v < w; v++)
            if (d[v].point === a.point) {
              h = v;
              break;
            }
          if (h !== null) {
            const v = d.splice(h)[0], w = c.splice(v.index);
            w.unshift(w[0].otherSE), e.push(new me(w.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: a.point
          });
          const g = a.getLeftmostComparator(o);
          l = u.sort(g)[0].otherSE;
          break;
        }
      e.push(new me(c));
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
    for (let c = 1, p = this.events.length - 1; c < p; c++) {
      const d = this.events[c].point, u = this.events[c + 1].point;
      Bn(d, t, u) !== 0 && (e.push(d), t = d);
    }
    if (e.length === 1) return null;
    const i = e[0], s = e[1];
    Bn(i, t, s) === 0 && e.shift(), e.push(e[0]);
    const r = this.isExteriorRing() ? 1 : -1, o = this.isExteriorRing() ? 0 : e.length - 1, a = this.isExteriorRing() ? e.length : -1, l = [];
    for (let c = o; c != a; c += r) l.push([e[c].x, e[c].y]);
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
    for (let s = 1, r = this.events.length; s < r; s++) {
      const o = this.events[s];
      G.compare(t, o) > 0 && (t = o);
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
class Vn {
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
class Cr {
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
        if (r.isExteriorRing()) e.push(new Vn(r));
        else {
          const o = r.enclosingRing();
          o.poly || e.push(new Vn(o)), o.poly.addInterior(r);
        }
    }
    return e;
  }
}
class Or {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ft.compare;
    this.queue = t, this.tree = new dn(e), this.segments = [];
  }
  process(t) {
    const e = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(e), i;
    const s = t.isLeft ? this.tree.add(e) : this.tree.find(e);
    if (!s) throw new Error(`Unable to find segment #${e.id} [${e.leftSE.point.x}, ${e.leftSE.point.y}] -> [${e.rightSE.point.x}, ${e.rightSE.point.y}] in SweepLine tree.`);
    let r = s, o = s, a, l;
    for (; a === void 0; )
      r = this.tree.prev(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    for (; l === void 0; )
      o = this.tree.next(o), o === null ? l = null : o.key.consumedBy === void 0 && (l = o.key);
    if (t.isLeft) {
      let c = null;
      if (a) {
        const d = a.getIntersection(e);
        if (d !== null && (e.isAnEndpoint(d) || (c = d), !a.isAnEndpoint(d))) {
          const u = this._splitSafely(a, d);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      let p = null;
      if (l) {
        const d = l.getIntersection(e);
        if (d !== null && (e.isAnEndpoint(d) || (p = d), !l.isAnEndpoint(d))) {
          const u = this._splitSafely(l, d);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      if (c !== null || p !== null) {
        let d = null;
        c === null ? d = p : p === null ? d = c : d = G.comparePoints(c, p) <= 0 ? c : p, this.queue.remove(e.rightSE), i.push(e.rightSE);
        const u = e.split(d);
        for (let h = 0, g = u.length; h < g; h++)
          i.push(u[h]);
      }
      i.length > 0 ? (this.tree.remove(e), i.push(t)) : (this.segments.push(e), e.prev = a);
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
const Wn = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Nr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Lr {
  run(t, e, i) {
    et.type = t, te.reset();
    const s = [new qn(e, !0)];
    for (let d = 0, u = i.length; d < u; d++)
      s.push(new qn(i[d], !1));
    if (et.numMultiPolys = s.length, et.type === "difference") {
      const d = s[0];
      let u = 1;
      for (; u < s.length; )
        Ke(s[u].bbox, d.bbox) !== null ? u++ : s.splice(u, 1);
    }
    if (et.type === "intersection")
      for (let d = 0, u = s.length; d < u; d++) {
        const h = s[d];
        for (let g = d + 1, v = s.length; g < v; g++)
          if (Ke(h.bbox, s[g].bbox) === null) return [];
      }
    const r = new dn(G.compare);
    for (let d = 0, u = s.length; d < u; d++) {
      const h = s[d].getSweepEvents();
      for (let g = 0, v = h.length; g < v; g++)
        if (r.insert(h[g]), r.size > Wn)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const o = new Or(r);
    let a = r.size, l = r.pop();
    for (; l; ) {
      const d = l.key;
      if (r.size === a) {
        const h = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (r.size > Wn)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (o.segments.length > Nr)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const u = o.process(d);
      for (let h = 0, g = u.length; h < g; h++) {
        const v = u[h];
        v.consumedBy === void 0 && r.insert(v);
      }
      a = r.size, l = r.pop();
    }
    te.reset();
    const c = me.factory(o.segments);
    return new Cr(c).getGeom();
  }
}
const et = new Lr(), Dr = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return et.run("union", n, e);
}, zr = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return et.run("intersection", n, e);
}, Rr = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return et.run("xor", n, e);
}, Tr = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return et.run("difference", n, e);
};
var Ri = {
  union: Dr,
  intersection: zr,
  xor: Rr,
  difference: Tr
};
const Ti = 3, Ur = 1e-6;
function Ui(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return e;
}
function K(n, t) {
  const e = Ui(n, t);
  return { x: e.x, y: e.y };
}
function ke(n, t) {
  const e = n.walls.find((r) => r.id === t);
  if (!e) return null;
  const i = n.nodes.find((r) => r.id === e.a), s = n.nodes.find((r) => r.id === e.b);
  return !i || !s ? null : R(i, s);
}
function Bi(n, t, e, i) {
  const s = e, [r, o] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: n, b: t, dir: cn(A(t, n)), len: R(n, t), leftOff: r, rightOff: o };
}
function it(n, t) {
  return Bi(K(n, t.a), K(n, t.b), t.thickness, t.baseline);
}
function Ut(n, t) {
  const e = A(t, n.a);
  return { t: W(e, n.dir), side: W(e, Z(n.dir)) };
}
function Kn(n, t) {
  const { f: e } = n;
  return t === "a" ? { body: n, end: t, p: e.a, u: e.dir, offL: e.leftOff, offR: e.rightOff, leftKey: "al", rightKey: "ar", far: e.b } : { body: n, end: t, p: e.b, u: k(e.dir, -1), offL: e.rightOff, offR: e.leftOff, leftKey: "br", rightKey: "bl", far: e.a };
}
const At = (n) => M(n.p, k(Z(n.u), n.offL)), It = (n) => A(n.p, k(Z(n.u), n.offR));
function wt(n, t, e) {
  return n !== null && R(n, t) <= e;
}
function Br(n) {
  const t = [];
  for (const e of n.walls) {
    const i = it(n, e);
    if (i.len < 1e-9) continue;
    const s = Z(i.dir);
    t.push({
      wall: e,
      f: i,
      c: {
        al: M(i.a, k(s, i.leftOff)),
        ar: A(i.a, k(s, i.rightOff)),
        bl: M(i.b, k(s, i.leftOff)),
        br: A(i.b, k(s, i.rightOff))
      }
    });
  }
  return t;
}
function Hr(n, t) {
  const e = t.f, i = Z(e.dir);
  for (const s of n) {
    if (s.body === t) continue;
    const o = W(A(s.far, e.a), i) >= 0 ? M(e.a, k(i, e.leftOff)) : A(e.a, k(i, e.rightOff)), a = Ti * Math.max(s.body.wall.thickness, t.wall.thickness), l = ht(At(s), s.u, o, e.dir), c = ht(It(s), s.u, o, e.dir);
    wt(l, s.p, a) && (s.body.c[s.leftKey] = l), wt(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function jr(n, t) {
  n.sort((s, r) => Math.atan2(s.u.y, s.u.x) - Math.atan2(r.u.y, r.u.x));
  const e = Ti * Math.max(...n.map((s) => s.body.wall.thickness));
  for (let s = 0; s < n.length; s++) {
    const r = n[s], o = n[(s + 1) % n.length], a = ht(It(r), r.u, At(o), o.u);
    wt(a, t, e) && (r.body.c[r.rightKey] = a, o.body.c[o.leftKey] = a);
  }
  if (n.length < 3) return;
  const i = Fr(n, t, e);
  for (const s of n) {
    if (i.has(s)) continue;
    const r = s.body.c[s.leftKey], o = s.body.c[s.rightKey], a = A(o, r), l = Lt(a, A(t, r)), c = Lt(a, A(s.far, r));
    l * c < 0 && Ze(s, [t]);
  }
}
function Ze(n, t) {
  n.end === "a" ? n.body.extraA = t : n.body.extraB = t;
}
function Fr(n, t, e) {
  const i = n.length;
  for (let s = 0; s < i; s++) {
    const r = n[s], o = n[(s + 1) % i];
    if (Math.abs(Lt(r.u, o.u)) > 1e-9 || W(r.u, o.u) > 0) continue;
    const a = r.offR - o.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = n[(s + 2) % i], c = ht(It(r), r.u, At(l), l.u), p = ht(At(o), o.u, At(l), l.u);
        if (!wt(c, t, e) || !wt(p, t, e)) continue;
        const d = o.body.c[o.rightKey];
        r.body.c[r.rightKey] = c, o.body.c[o.leftKey] = p, Ze(r, [t, d, p]);
      } else {
        const l = n[(s - 1 + i) % i], c = ht(At(o), o.u, It(l), l.u), p = ht(It(r), r.u, It(l), l.u);
        if (!wt(p, t, e) || !wt(c, t, e)) continue;
        const d = r.body.c[r.leftKey];
        r.body.c[r.rightKey] = p, o.body.c[o.leftKey] = c, Ze(o, [p, d, t]);
      }
      return /* @__PURE__ */ new Set([r, o]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Hi(n) {
  const t = Br(n), e = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of n.nodes) {
    const s = [];
    for (const o of t)
      o.wall.a === i.id && s.push(Kn(o, "a")), o.wall.b === i.id && s.push(Kn(o, "b"));
    if (s.length === 0) continue;
    const r = i.host ? e.get(i.host.wallId) : void 0;
    r ? Hr(s, r) : s.length >= 2 && jr(s, { x: i.x, y: i.y });
  }
  return t;
}
function ji(n) {
  return [n.c.ar, n.c.br, ...n.extraB ?? [], n.c.bl, n.c.al, ...n.extraA ?? []];
}
function _e(n) {
  return new Map(Hi(n).map((t) => [t.wall.id, ji(t)]));
}
function Zn(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i], r = n[(i + 1) % n.length], o = t(s), a = t(r);
    o >= 0 && e.push(s), o >= 0 != a >= 0 && e.push(M(s, k(A(r, s), o / (o - a))));
  }
  return e;
}
function Fi(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of Hi(n)) {
    const i = ji(e), s = n.openings.filter((c) => c.wallId === e.wall.id && !c.invalid).sort((c, p) => c.offset - p.offset), r = (c) => W(A(c, e.f.a), e.f.dir), o = [];
    let a = -1 / 0;
    for (const c of s)
      o.push([a, c.offset]), a = Math.max(a, c.offset + c.width);
    o.push([a, 1 / 0]);
    const l = [];
    for (const [c, p] of o) {
      if (p <= c) continue;
      let d = i;
      c > -1 / 0 && (d = Zn(d, (u) => r(u) - c)), p < 1 / 0 && (d = Zn(d, (u) => p - r(u))), d.length >= 3 && Math.abs(Dt(d)) > Ur && l.push(d);
    }
    t.set(e.wall.id, l);
  }
  return t;
}
const Ye = (n) => [n.map((t) => [t.x, t.y])];
function qi(n) {
  const t = n.map(([s, r]) => ({ x: s, y: r })), e = t[0], i = t[t.length - 1];
  return t.length > 1 && e.x === i.x && e.y === i.y && t.pop(), t;
}
function Vi(n, t) {
  const e = t ? [...Fi(n).values()].flat() : [..._e(n).values()], i = e.map(Ye);
  if (i.length === 0) return [];
  let s;
  try {
    s = Ri.union(i[0], ...i.slice(1));
  } catch {
    return e.map((r) => [r.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return s.map((r) => r.map(qi));
}
const ve = 1e-6;
function qr(n, t) {
  return ln[n.kind].includes(t.mode);
}
function Wi(n, t, e) {
  if (!qr(t, e)) return !1;
  if (e.mode === "free") return !0;
  const i = e.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Nt || i > Nt)) return !1;
  const s = ke(n, e.wallId);
  return s !== null && e.offset >= -ve && e.offset <= s + ve;
}
function re(n, t) {
  return { ...n, devices: t };
}
function Yn(n, t, e, i) {
  if (!Wi(n, t, e)) return { level: n, deviceId: null };
  const s = { id: nt(), name: i, placement: e, props: t, invalid: !1 };
  return { level: re(n, [...n.devices, s]), deviceId: s.id };
}
function Ki(n, t, e) {
  if (n.kind !== "motion_sensor" || t === e) return n;
  const i = je("motion_sensor", t), s = je("motion_sensor", e);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && n.zoneAngle === i.zoneAngle ? { ...n, zoneAngle: s.zoneAngle } : n;
}
function hn(n, t, e) {
  const i = n.devices, s = i.find((o) => o.id === t);
  if (!s || !Wi(n, s.props, e)) return n;
  const r = Ki(s.props, s.placement.mode, e.mode);
  return un(re(n, i.map((o) => o.id === t ? { ...o, placement: e, props: r } : o)));
}
function Vr(n, t, e, i) {
  const s = n.devices;
  return s.some((r) => r.id === t) ? re(n, s.map((r) => {
    if (r.id !== t) return r;
    const o = { ...r.props, ...e, kind: r.props.kind };
    return { ...r, props: o, name: i ?? r.name };
  })) : n;
}
function Zi(n, t) {
  return re(n, n.devices.filter((e) => e.id !== t));
}
function Wr(n, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const e = t.props.zoneIds.filter((i) => n.zones.some((s) => s.id === i));
  return e.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: e } };
}
function un(n) {
  return re(n, n.devices.map((t) => {
    const e = Wr(n, t);
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const i = ke(n, e.placement.wallId), s = i === null || e.placement.offset < -ve || e.placement.offset > i + ve;
    return { ...e, invalid: s };
  }));
}
function Se(n) {
  const t = [];
  for (const e of Vi(n, !1)) for (const i of e.slice(1)) t.push(i);
  return t;
}
function ye(n, t) {
  let e = null, i = 1 / 0;
  for (const s of n) {
    if (!se(t, s)) continue;
    const r = Math.abs(Dt(s));
    r < i && (e = s, i = r);
  }
  return e;
}
function Yi(n) {
  return Math.round(Math.abs(Dt(n)) / 1e6 * 100) / 100;
}
const Te = 1e-3;
function Gi(n, t) {
  return n.length !== t.length || Math.abs(Math.abs(Dt(n)) - Math.abs(Dt(t))) > Te ? !1 : n.every((e) => t.some((i) => Math.abs(e.x - i.x) <= Te && Math.abs(e.y - i.y) <= Te));
}
function Kr(n, t, e) {
  const i = Se(n), s = ye(i, t);
  if (!s) return { level: n, zoneId: null };
  for (const o of n.zones) {
    const a = o.broken ? null : ye(i, o.seed);
    if (a && Gi(a, s)) return { level: n, zoneId: null };
  }
  const r = { id: nt(), name: e, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...n, zones: [...n.zones, r] }, zoneId: r.id };
}
function Zr(n, t, e) {
  return { ...n, zones: n.zones.map((i) => i.id === t ? { ...i, name: e } : i) };
}
function Xi(n, t) {
  return un({ ...n, zones: n.zones.filter((e) => e.id !== t) });
}
function Bt(n) {
  if (n.zones.length === 0) return n;
  const t = Se(n), e = [], i = n.zones.map((s) => {
    const r = ye(t, s.seed);
    return !r || e.some((o) => Gi(o, r)) ? { ...s, broken: !0 } : (e.push(r), { ...s, outline: r, broken: !1 });
  });
  return { ...n, zones: i };
}
const zt = 1e-6, be = ["door", "gate", "wicket"];
function Qi(n, t) {
  return n.offset < t.offset + t.width - zt && t.offset < n.offset + n.width - zt;
}
function Ee(n, t, e, i, s) {
  const r = ke(n, t);
  return r === null || i <= 0 || e < -zt || e + i > r + zt ? !1 : !n.openings.some((o) => o.wallId === t && o.id !== s && Qi(o, { offset: e, width: i }));
}
function Ht(n, t) {
  return { ...n, openings: t };
}
function Yr(n, t, e, i, s, r = {}) {
  const o = s ?? he[e], a = i - o / 2;
  if (!Ee(n, t, a, o)) return { level: n, openingId: null };
  const l = { id: nt(), wallId: t, kind: e, offset: a, width: o, invalid: !1 };
  return be.includes(e) && (l.hinge = r.hinge ?? "start", l.swing = r.swing ?? "left"), e === "window" && (l.outside = r.outside ?? "left"), { level: Bt(Ht(n, [...n.openings, l])), openingId: l.id };
}
function Ji(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !Ee(n, i.wallId, e, i.width, t) ? n : Bt(oe(Ht(n, n.openings.map((s) => s.id === t ? { ...s, offset: e } : s))));
}
function Gr(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !Ee(n, i.wallId, i.offset, e, t) ? n : Bt(oe(Ht(n, n.openings.map((s) => s.id === t ? { ...s, width: e } : s))));
}
function Xr(n, t) {
  return be.includes(t) ? { kind: t, hinge: n.hinge ?? "start", swing: n.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: n.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function Qr(n, t, e) {
  if (!n.openings.some((s) => s.id === t)) return n;
  const i = (s) => {
    const r = { ...s, ...e };
    for (const o of Object.keys(e)) e[o] === void 0 && delete r[o];
    return r;
  };
  return Bt(oe(Ht(n, n.openings.map((s) => s.id === t ? i(s) : s))));
}
function ts(n, t) {
  return Bt(oe(Ht(n, n.openings.filter((e) => e.id !== t))));
}
function oe(n) {
  return Ht(n, n.openings.map((t) => {
    const e = ke(n, t.wallId), i = e === null || t.offset < -zt || t.offset + t.width > e + zt || n.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Qi(t, s));
    return { ...t, invalid: i };
  }));
}
const ee = 1;
function lt(n) {
  return structuredClone(n);
}
function Me(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) throw new Error(`wall not found: ${t}`);
  return e;
}
function Jr(n, t, e) {
  return Math.min(e, Math.max(t, n));
}
function pn(n, t, e) {
  const i = K(n, t.a), s = K(n, t.b), r = R(i, s), o = Jr(typeof e == "number" ? e : Di(e, i, s) * r, 0, r);
  return { pt: r === 0 ? i : hr(i, s, o / r), offset: o };
}
function to(n) {
  for (let t = 0; t <= n.nodes.length; t++) {
    let e = !1;
    for (const i of n.nodes) {
      if (!i.host) continue;
      const s = n.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: r, offset: o } = pn(n, s, i);
      (Math.abs(i.x - r.x) > 1e-9 || Math.abs(i.y - r.y) > 1e-9) && (e = !0), i.x = r.x, i.y = r.y, i.host.offset = o;
    }
    if (!e) break;
  }
}
function es(n, t) {
  return to(n), t && so(t, n), Bt(un(oe(n)));
}
function yt(n, t) {
  return es(lt(n), t);
}
function ns(n, t, e) {
  const i = Ui(n, t), s = i.host && n.walls.find((r) => r.id === i.host.wallId);
  if (i.host && s) {
    const { pt: r, offset: o } = pn(n, s, e);
    i.host.offset = o, i.x = r.x, i.y = r.y;
  } else
    i.x = e.x, i.y = e.y;
}
function Gn(n, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: K(n, t.nodeId), nodeId: t.nodeId };
  const e = Me(n, t.wallId), { pt: i, offset: s } = pn(n, e, t.offset), r = R(K(n, e.a), K(n, e.b));
  return s <= ee ? { pt: K(n, e.a), nodeId: e.a } : r - s <= ee ? { pt: K(n, e.b), nodeId: e.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Xn(n, t) {
  if (t.nodeId) return t.nodeId;
  const e = { id: nt(), x: t.pt.x, y: t.pt.y };
  return t.host && (e.host = { ...t.host }), n.nodes.push(e), e.id;
}
function eo(n, t, e, i) {
  const s = Gn(n, t), r = Gn(n, e);
  if (R(s.pt, r.pt) < ee) return { level: n, wallId: null, endNodeId: null };
  const o = lt(n), a = Xn(o, s), l = Xn(o, r);
  if (a === l) return { level: n, wallId: null, endNodeId: null };
  const c = { id: nt(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return o.walls.push(c), { level: yt(o, n), wallId: c.id, endNodeId: l };
}
function is(n, t, e, i) {
  const s = i === "inner" ? e / 2 : i === "outer" ? -e / 2 : 0, r = Math.min(n.x, t.x) - s, o = Math.max(n.x, t.x) + s, a = Math.min(n.y, t.y) - s, l = Math.max(n.y, t.y) + s;
  return o - r < ee || l - a < ee ? null : [{ x: r, y: a }, { x: o, y: a }, { x: o, y: l }, { x: r, y: l }];
}
function no(n, t, e, i, s) {
  const r = is(t, e, i.thickness, s);
  if (!r) return n;
  const o = lt(n), a = r.map((l) => {
    const c = { id: nt(), x: l.x, y: l.y };
    return o.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    o.walls.push({
      id: nt(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return yt(o, n);
}
function io(n, t, e) {
  const i = lt(n);
  return ns(i, t, e), es(i, n);
}
function so(n, t) {
  const e = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : [])
  ];
  for (const i of t.walls) {
    const s = n.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const r = n.nodes.find((d) => d.id === s.a), o = n.nodes.find((d) => d.id === s.b), a = t.nodes.find((d) => d.id === i.a), l = t.nodes.find((d) => d.id === i.b);
    if (!r || !o || !a || !l || r.x === a.x && r.y === a.y) continue;
    const c = R(a, l);
    if (c === 0) continue;
    const p = cn(A(o, r));
    for (const d of e)
      d.wallId === i.id && (d.offset = Di(M(r, k(p, d.offset)), a, l) * c);
  }
}
function ro(n, t, e) {
  const i = lt(n), s = Me(i, t), o = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: M(K(i, a), e) }));
  for (const a of o) ns(i, a.id, a.to);
  return yt(i, n);
}
function fn(n) {
  n.nodes = n.nodes.filter((t) => n.walls.some((e) => e.a === t.id || e.b === t.id));
}
function oo(n, t, e) {
  const i = lt(n), s = Me(i, t), r = K(i, s[e]), o = { id: nt(), x: r.x, y: r.y };
  return i.nodes.push(o), s[e] = o.id, fn(i), { level: yt(i, n), nodeId: o.id };
}
function ao(n, t, e) {
  if (t === e) return n;
  const i = lt(n);
  for (const r of i.walls)
    r.a === t && (r.a = e), r.b === t && (r.b = e);
  const s = new Set(i.walls.filter((r) => r.a === r.b).map((r) => r.id));
  i.walls = i.walls.filter((r) => !s.has(r.id)), i.openings = i.openings.filter((r) => !s.has(r.wallId)), i.devices = i.devices.filter((r) => r.placement.mode !== "wall" || !s.has(r.placement.wallId));
  for (const r of i.nodes) r.host && s.has(r.host.wallId) && delete r.host;
  return i.nodes = i.nodes.filter((r) => r.id !== t), fn(i), yt(i, n);
}
function ss(n, t) {
  var i;
  const e = lt(n);
  e.walls = e.walls.filter((s) => s.id !== t), e.openings = e.openings.filter((s) => s.wallId !== t), e.devices = e.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of e.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return fn(e), yt(e, n);
}
function lo(n, t, e) {
  const i = lt(n);
  return Object.assign(Me(i, t), e), yt(i, n);
}
const H = (n) => typeof n == "string" && n !== "" ? n : null, co = (n) => n.split(".")[0], ho = ["friendly_name", "device_class", "unit_of_measurement", "icon"];
function rs(n, t) {
  const e = t.attributes ?? {};
  return {
    entityId: n,
    domain: co(n),
    name: H(e.friendly_name) ?? n,
    deviceClass: H(e.device_class),
    unit: H(e.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null,
    icon: H(e.icon)
  };
}
function uo(n) {
  const t = /* @__PURE__ */ new Map();
  for (const [e, i] of Object.entries(n ?? {})) t.set(e, rs(e, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function po(n, t) {
  if (n === t) return !0;
  if (!n || !t) return Object.keys(n ?? t ?? {}).length === 0;
  let e = 0;
  for (const i in t) {
    e++;
    const s = n[i], r = t[i];
    if (s === r) continue;
    if (!s || !r) return !1;
    const o = s.attributes ?? {}, a = r.attributes ?? {};
    if (o !== a && ho.some((l) => o[l] !== a[l])) return !1;
  }
  return e === Object.keys(n).length;
}
function os(n, t) {
  const e = n == null ? void 0 : n[t];
  return e ? typeof e.state == "string" ? e.state : String(e.state ?? "") : null;
}
async function fo(n) {
  const t = (o) => n.connection.sendMessagePromise({ type: o }), [e, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), r = /* @__PURE__ */ new Map();
  for (const o of e) {
    const a = rs(o.entity_id, {});
    r.set(o.entity_id, {
      ...a,
      name: H(o.name) ?? H(o.original_name) ?? a.name,
      deviceClass: H(o.device_class) ?? H(o.original_device_class),
      unit: H(o.unit_of_measurement),
      deviceId: H(o.device_id),
      areaId: H(o.area_id),
      hidden: !!o.hidden_by,
      disabled: !!o.disabled_by,
      category: H(o.entity_category),
      icon: H(o.icon) ?? H(o.original_icon)
    });
  }
  return {
    entities: r,
    devices: new Map(i.map((o) => [o.id, { id: o.id, name: H(o.name_by_user) ?? H(o.name) ?? o.id, model: H(o.model), areaId: H(o.area_id) }])),
    areas: new Map(s.map((o) => [o.area_id, o.name]))
  };
}
function go(n, t) {
  const e = new Map(t.entities);
  for (const [i, s] of n.entities) {
    const r = t.entities.get(i);
    e.set(i, r ? { ...r, name: s.name !== i ? s.name : r.name, deviceClass: s.deviceClass ?? r.deviceClass, unit: s.unit ?? r.unit, icon: r.icon ?? s.icon } : s);
  }
  return { entities: e, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function as(n, t, e) {
  const i = n.entities.get(t);
  if (!i) return n.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : os(e, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const mo = 32, Qn = 128;
function $e(n) {
  const t = n * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function gt(n) {
  return Math.atan2(-n.y, n.x) * 180 / Math.PI;
}
function ls(n) {
  return (n % 360 + 360) % 360;
}
function cs(n) {
  return (n % 360 + 540) % 360 - 180;
}
function Y(n, t) {
  const e = t.placement;
  if (e.mode === "free") return { pt: { x: e.x, y: e.y }, dir: $e(e.rotation) };
  const i = n.walls.find((l) => l.id === e.wallId);
  if (!i) return null;
  let s;
  try {
    s = it(n, i);
  } catch {
    return null;
  }
  const r = Z(s.dir), o = e.side === "left" ? r : k(r, -1), a = e.side === "left" ? s.leftOff : s.rightOff;
  return { pt: M(M(s.a, k(s.dir, e.offset)), k(o, a)), dir: e.aim ? $e(gt(o) + e.aim) : o, normal: o };
}
function ds(n, t) {
  const e = [];
  for (let i = 0; i < Qn; i++) e.push(M(n, k($e(360 * i / Qn), t)));
  return e;
}
function Jn(n, t, e, i) {
  if (e >= 360) return ds(n, i);
  const s = Math.max(1, Math.ceil(e / 90 * mo)), r = gt(t) - e / 2, o = [n];
  for (let a = 0; a <= s; a++) o.push(M(n, k($e(r + e * a / s), i)));
  return o;
}
function vo(n, t) {
  const e = t.props;
  if (e.kind !== "wall_light" && e.kind !== "motion_sensor" && e.kind !== "ceiling_light") return null;
  const i = Y(n, t);
  if (!i) return null;
  switch (e.kind) {
    case "wall_light":
      return e.coneAngle > 0 && e.coneRange > 0 ? Jn(i.pt, i.dir, e.coneAngle, e.coneRange) : null;
    case "motion_sensor":
      return e.zoneAngle > 0 && e.zoneRange > 0 ? Jn(i.pt, i.dir, e.zoneAngle, e.zoneRange) : null;
    case "ceiling_light":
      return e.poolRadius !== null && e.poolRadius > 0 ? ds(i.pt, e.poolRadius) : null;
  }
}
function hs(n) {
  return n.normal ? M(n.pt, n.normal) : n.pt;
}
function yo(n, t) {
  const e = Y(n, t);
  if (!e) return null;
  const i = hs(e);
  let s = null, r = 1 / 0;
  for (const o of n.zones) {
    if (!se(i, o.outline)) continue;
    const a = Math.abs(Dt(o.outline));
    a < r && (s = o.id, r = a);
  }
  return s;
}
function bo(n, t, e = Se) {
  const i = vo(n, t);
  if (!i) return [];
  const s = Y(n, t), r = hs(s), o = ye(e(n), r);
  if (!o) return [i];
  let a;
  try {
    a = Ri.intersection(Ye(i), Ye(o));
  } catch {
    return [i];
  }
  return a.flatMap((l) => l.map(qi));
}
function $o(n, t, e, i) {
  const s = Y(n, t);
  if (!s) return !1;
  const r = t.props;
  if (r.kind === "ceiling_light" && r.shape === "linear") {
    const a = Math.max(-r.length / 2, Math.min(r.length / 2, W(A(e, s.pt), s.dir)));
    return R(M(s.pt, k(s.dir, a)), e) <= i;
  }
  if (r.kind !== "equipment") return R(s.pt, e) <= i;
  if (r.shape === "circle") return R(s.pt, e) <= r.diameter / 2 + i;
  const o = A(e, s.pt);
  return Math.abs(W(o, s.dir)) <= r.width / 2 + i && Math.abs(W(o, Z(s.dir))) <= r.depth / 2 + i;
}
function us(n, t, e) {
  const i = n.devices;
  for (const s of [!1, !0])
    for (let r = i.length - 1; r >= 0; r--)
      if (i[r].props.kind === "equipment" === s && $o(n, i[r], t, e)) return i[r].id;
  return null;
}
const wo = 60;
function Ge(n, t, e) {
  if (!Ni.has(t.props.kind)) return null;
  const i = Y(n, t);
  return i ? { from: i.pt, to: M(i.pt, k(i.dir, wo / e)) } : null;
}
function ps(n, t) {
  const e = { ...n, aim: t };
  return t === 0 && delete e.aim, e;
}
function xo(n, t, e, i) {
  const s = t.placement, r = Y(n, t);
  if (!r || e.x === r.pt.x && e.y === r.pt.y) return s;
  const o = gt(A(e, r.pt)), a = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (s.mode === "free") return { ...s, rotation: ls(a(o)) };
  const l = cs(o - gt(r.normal)), c = Math.max(-Nt, Math.min(Nt, a(l)));
  return ps(s, c);
}
class fs extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Ue(n) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function ko(n, t) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function _o(n, t, e, i = !1) {
  try {
    return (await n.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: e,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new fs(s.message) : s;
  }
}
async function So(n, t) {
  await n.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Eo = 3;
function Pt(n) {
  if (typeof n == "number")
    return n === Eo ? "Connection lost" : `Connection error ${n}`;
  if (typeof n == "string") return n;
  if (n instanceof Error) return n.message;
  if (typeof n == "object" && n !== null) {
    const t = n;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof n == "object" && n !== null ? "Unknown error" : String(n);
}
class Mo {
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
    const i = { ...t, id: nt(), name: e, revision: 0 }, s = await this.run(i, null, !1);
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
      const r = await _o(this.hass, t, e, i);
      return this.baseRevision = r, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), r;
    } catch (r) {
      return r instanceof fs ? (this.state = "conflict", this.errorMessage = r.message) : (this.state = "error", this.errorMessage = Pt(r)), this.onChange(), null;
    }
  }
}
const Ao = {
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
  "tool.switch": "Switch",
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
  "binding.haDevice": "Home Assistant device",
  "binding.haDevicePick": "Choose one to fill the empty roles",
  "binding.haDeviceNone": "No Home Assistant device has a matching entity",
  "binding.showAll": "Show all",
  "binding.missing": "This entity is not in Home Assistant any more. Pick another one or clear the field.",
  "binding.unavailable": "Unavailable in Home Assistant",
  "binding.alsoBound": "Also bound to: {names}",
  "binding.notBound": "{n} not bound",
  "binding.filled": "Filled: {roles}",
  "binding.nothingFilled": "Nothing filled",
  "binding.several": "several matches for: {roles}",
  "binding.nothingToFill": "Nothing to fill: no empty role matches an entity of this device.",
  "binding.registryError": "Couldn't load the Home Assistant registries: {error}",
  "role.control": "Control",
  "role.motion": "Motion",
  "role.illuminance": "Illuminance",
  "role.temperature": "Temperature",
  "role.humidity": "Humidity",
  "role.action": "Button events",
  "role.state": "State",
  "role.power": "Power",
  "bindstatus.bound": "Bound",
  "bindstatus.partial": "Partly bound",
  "bindstatus.unbound": "Not bound",
  "bindstatus.missing": "Entity missing in Home Assistant",
  "zone.default": "Room",
  "device.ceiling_light": "Ceiling light",
  "device.wall_light": "Wall light",
  "device.motion_sensor": "Motion sensor",
  "device.illuminance_sensor": "Illuminance sensor",
  "device.switch": "Switch",
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
  "props.thickness": "Thickness",
  "props.baseline": "Baseline",
  "props.length": "Length",
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
function f(n) {
  return Ao[n] ?? n;
}
const st = (n) => n.length === 0 ? "" : `M${n.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function Rt(n, t, e) {
  let i = n.get(t);
  return i === void 0 && (i = e(t), n.set(t, i)), i;
}
const gn = 12, T = "non-scaling-stroke", Io = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", gs = 24;
function Po(n, t, e) {
  const i = gs / t;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${-i / 2} y=${-i / 2} width=${i} height=${i}
      style="pointer-events:none">
      <ha-icon icon=${n} style=${`--mdc-icon-size:${i}px;color:${e};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${-i / 2} ${-i / 2}) scale(${i / 24})`}>
    <path d=${Io} fill=${e}></path></g>`;
}
const Co = "__preview__", Oo = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, No = /* @__PURE__ */ new WeakMap(), Lo = (n) => Rt(No, n, Se);
function Do(n, t, e, i) {
  const s = n.props, r = { stroke: e, fill: i };
  switch (s.kind) {
    case "ceiling_light":
      return s.shape === "linear" ? _`<rect class="icon" x=${-s.length / 2} y=${-s.width / 2} width=${s.length} height=${s.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></rect>` : s.shape === "spot" ? _`<circle class="icon" r=${t / 3} fill=${e} stroke=${e} stroke-width="1" vector-effect=${T}></circle>` : _`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${T}></path>`;
    case "motion_sensor": {
      const o = (a) => `M${t * a} ${-t * a * 0.8}A${t * a} ${t * a * 0.8} 0 0 1 ${t * a} ${t * a * 0.8}`;
      return _`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>
        <path class="arcs" d=${o(1) + o(1.5)} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${T}></path>`;
    }
    case "illuminance_sensor": {
      let o = "";
      for (let a = 0; a < 8; a++) {
        const l = a * Math.PI / 4;
        o += `M${Math.cos(l) * t * 1.15} ${Math.sin(l) * t * 1.15}L${Math.cos(l) * t * 1.6} ${Math.sin(l) * t * 1.6}`;
      }
      return _`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>
        <path class="rays" d=${o} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${T}></path>`;
    }
    case "switch":
      return _`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></rect>`;
    case "socket":
      return _`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${e}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${e}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${T}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${e} stroke=${e} stroke-width="1" vector-effect=${T}></path>`;
    case "exhaust_fan": {
      let o = "";
      for (let a = 0; a < 4; a++) {
        const l = a * Math.PI / 2 + Math.PI / 4;
        o += `M0 0L${Math.cos(l) * t * 0.85} ${Math.sin(l) * t * 0.85}`;
      }
      return _`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${T}></circle>
        <path class="blades" d=${o} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${T}></path>`;
    }
    default:
      return _`${$}`;
  }
}
function zo(n, t, e, i) {
  const s = n.props;
  if (s.kind !== "equipment") return _`${$}`;
  const r = gn / t.scale, o = s.shape === "circle" ? _`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${e}
        stroke-width="1.5" vector-effect=${T}></circle>` : _`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${e} stroke-width="1.5" vector-effect=${T}></rect>`;
  return _`
    <g transform=${`rotate(${i})`}>${o}</g>
    ${Po(s.icon, t.scale, e)}
    <text class="equipment-label" y=${gs / t.scale / 2 + r} text-anchor="middle" dominant-baseline="middle" font-size=${r * 0.85}
      fill=${e} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Ro(n, t) {
  return n === "bound" ? $ : _`<circle class=${`bind-ring bind-${n}`} r=${gn * 1.7 / t} fill="none" style=${`stroke:${Oo[n]}`}
    stroke-width="2" stroke-dasharray=${n === "unbound" ? "4 3" : $} vector-effect=${T}></circle>`;
}
function To(n, t, e, i) {
  var u;
  const s = e.palette, r = n.invalid ? s.invalid : s.device, o = gn / e.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((u = e.selection) == null ? void 0 : u.kind) === "device" && e.selection.id === n.id, c = `device device-${n.props.kind}${l ? " selected" : ""}${n.invalid ? " invalid" : ""}${i ? " device-preview" : ""}`, p = i ? "0.5" : e.dim ? String(s.dimOpacity) : $, d = n.props.kind === "equipment" ? n.props.shape === "circle" ? n.props.diameter / 2 : Math.hypot(n.props.width, n.props.depth) / 2 : o * 1.6;
  return _`
    <g class=${c} data-id=${n.id} opacity=${p} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? _`<circle class="selection-ring" r=${d + 4 / e.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${T}></circle>` : $}
      ${n.props.kind === "equipment" ? zo(n, e, r, a) : _`<g transform=${`rotate(${a})`}>${Do(n, o, r, s.deviceFill)}</g>`}
      ${e.bindingStatus && !i ? Ro(e.bindingStatus(n), e.scale) : $}
    </g>`;
}
function Uo(n, t, e, i) {
  const s = bo(n, t, Lo);
  if (s.length === 0) return $;
  const r = e.palette, o = t.invalid ? r.invalid : r.cone, a = i ? "0.5" : e.dim ? String(r.dimOpacity) : $, l = s.map(st).join("");
  return t.props.kind === "ceiling_light" ? _`<path class="pool" d=${l} fill="none" stroke=${o} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${T}></path>` : _`<path class="cone" d=${l} fill=${o} fill-opacity="0.18" fill-rule="evenodd" stroke=${o}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${T}></path>`;
}
function Bo(n, t) {
  var o;
  if (((o = t.selection) == null ? void 0 : o.kind) !== "device" || t.bindingStatus) return $;
  const e = t.selection.id, i = n.devices.find((a) => a.id === e), s = i ? Ge(n, i, t.scale) : null;
  if (!s) return $;
  const r = t.palette.selection;
  return _`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : $}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${r} stroke-width="2" vector-effect=${T}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${r}
      stroke-width="2" vector-effect=${T} style="cursor:grab"></circle>
  </g>`;
}
function Ho(n, t) {
  const e = [];
  for (const i of n.devices) {
    const s = Y(n, i);
    s && e.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Co, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Y(n, i);
    s && e.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${t.showCones ? e.map((i) => Uo(n, i.d, t, i.preview)) : $}</g>
    <g class="devices">${e.map((i) => To(i.d, i.pose, t, i.preview))}</g>
    ${Bo(n, t)}`;
}
function kt(n) {
  const t = Math.round(n), e = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${e}` : e;
}
function ms(n) {
  return `${n.toFixed(2)} ${f("unit.m2")}`;
}
const jo = /* @__PURE__ */ new WeakMap(), Fo = /* @__PURE__ */ new WeakMap(), vs = /* @__PURE__ */ new WeakMap();
function Ae(n, t, e) {
  const i = Z(n.dir), s = M(n.a, k(n.dir, t)), r = M(n.a, k(n.dir, e));
  return [M(s, k(i, n.leftOff)), M(r, k(i, n.leftOff)), A(r, k(i, n.rightOff)), A(s, k(i, n.rightOff))];
}
function ne(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) return null;
  try {
    const i = it(n, e);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function qo(n, t) {
  let e = 0, i = 0, s = 0;
  for (let o = 0; o < n.length; o++) {
    const a = n[o], l = n[(o + 1) % n.length], c = a.x * l.y - l.x * a.y;
    e += c, i += (a.x + l.x) * c, s += (a.y + l.y) * c;
  }
  if (Math.abs(e) < 1e-9) return t;
  const r = { x: i / (3 * e), y: s / (3 * e) };
  return se(r, n) ? r : t;
}
const U = "non-scaling-stroke";
function Vo(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (const a of n.walls)
    e.set(a.a, (e.get(a.a) ?? 0) + 1), e.set(a.b, (e.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, r = 2 / t.scale, o = [];
  for (const a of n.walls) {
    const l = ne(n, a.id);
    if (!l) continue;
    const c = Z(l.dir);
    for (const [p, d, u] of [[a.a, l.a, l.dir], [a.b, l.b, k(l.dir, -1)]]) {
      const h = n.nodes.find((P) => P.id === p);
      if (!h || h.host || e.get(p) !== 1) continue;
      const g = M(d, k(c, l.leftOff + i)), v = A(d, k(c, l.rightOff + i)), w = k(c, 1), y = k(M(g, v), 0.5), x = M(A(y, k(w, -r)), k(u, s / 2)), S = A(A(y, k(w, r)), k(u, s / 2)), E = [g, x, S, v];
      o.push(_`<path class="wall-break" d=${`M${E.map((P) => `${P.x} ${P.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${U}></path>`);
    }
  }
  return o.length ? _`${o}` : $;
}
function Wo(n, t, e) {
  const i = t.palette, s = qo(n.outline, n.seed), r = 12 / t.scale;
  return _`
    <path class="zone${n.broken ? " broken" : ""}" d=${st(n.outline)}
      fill=${n.broken ? "url(#hatch)" : i.zone}
      stroke=${e ? i.selection : "none"} stroke-width="2" vector-effect=${U}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${r}
      fill=${n.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * r}>${n.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * r} font-size=${r * 0.9}>${ms(Yi(n.outline))}</tspan>
    </text>`;
}
function Ko(n, t, e) {
  const i = Z(n.dir), s = (t.swing ?? "left") === "left", r = s ? i : k(i, -1), o = s ? n.leftOff : n.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], c = M(M(n.a, k(n.dir, a)), k(r, o)), p = M(M(n.a, k(n.dir, l)), k(r, o)), d = M(c, k(r, t.width)), u = Lt(A(d, c), A(p, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${e} stroke-width="1.5" vector-effect=${U}></line>
    <path d=${`M${d.x} ${d.y}A${t.width} ${t.width} 0 0 ${u} ${p.x} ${p.y}`} fill="none" stroke=${e}
      stroke-width="1" vector-effect=${U}></path>`;
}
function Zo(n, t, e) {
  const i = Z(n.dir), s = n.leftOff + n.rightOff, r = [n.leftOff - s / 3, n.leftOff - 2 * s / 3].map((o) => {
    const a = M(M(n.a, k(n.dir, t.offset)), k(i, o)), l = M(M(n.a, k(n.dir, t.offset + t.width)), k(i, o));
    return _`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${e} stroke-width="1.5" vector-effect=${U}></line>`;
  });
  return _`${r}`;
}
function Yo(n, t, e) {
  const i = ne(n, t.wallId);
  if (!i) return $;
  const s = e.palette, r = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, o = Ae(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return _`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${st(o)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? Ko(i, t, r) : t.kind === "window" ? Zo(i, t, r) : $}
    </g>`;
}
function ti(n, t, e, i, s) {
  const r = s.palette.dim, o = 6 / s.scale, a = M(n, k(e, i)), l = M(t, k(e, i)), c = (d, u) => {
    const h = M(u, k(e, i + o));
    return _`<line x1=${d.x} y1=${d.y} x2=${h.x} y2=${h.y} stroke=${r} stroke-width="0.75" vector-effect=${U}></line>`;
  }, p = M(k(M(a, l), 0.5), k(e, 9 / s.scale));
  return _`
    <g class="dim">
      ${c(M(n, k(e, 2 / s.scale)), n)}${c(M(t, k(e, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${r} stroke-width="1" vector-effect=${U}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${r} font-family="system-ui, sans-serif">${kt(R(n, t))}</text>
    </g>`;
}
function Go(n, t) {
  const e = t.selection;
  if (!e) return $;
  const i = t.palette, s = 4 / t.scale, r = (o) => _`<circle cx=${o.x} cy=${o.y} r=${s} fill=${i.selection}></circle>`;
  if (e.kind === "node") {
    const o = n.nodes.find((a) => a.id === e.id);
    return o ? r(o) : $;
  }
  if (e.kind === "wall") {
    const o = Rt(vs, n, _e).get(e.id), a = ne(n, e.id);
    if (!o || !a) return $;
    const l = Z(a.dir);
    return _`
      <path d=${st(o)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${U}></path>
      ${r(a.a)}${r(a.b)}
      ${ti(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (e.kind === "opening") {
    const o = n.openings.find((u) => u.id === e.id), a = o ? ne(n, o.wallId) : null;
    if (!o || !a) return $;
    const l = k(Z(a.dir), -1), c = a.rightOff + 18 / t.scale, p = (u) => M(a.a, k(a.dir, u)), d = [[0, o.offset], [o.offset, o.offset + o.width], [o.offset + o.width, a.len]];
    return _`
      <path d=${st(Ae(a, o.offset, o.offset + o.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${U}></path>
      ${d.filter(([u, h]) => h - u >= 1).map(([u, h]) => ti(p(u), p(h), l, c, t))}`;
  }
  return $;
}
function Xo(n, t, e) {
  return R(n, t) < 1e-6 ? null : Ae(Bi(n, t, e.thickness, e.baseline), 0, R(n, t));
}
function Qo(n, t) {
  const { preview: e, palette: i } = t, s = 1e7, r = e.orthoFrom, o = e.opening, a = o ? ne(n, o.wallId) : null;
  return _`
    ${r ? _`<path d=${`M${r.x - s} ${r.y}H${r.x + s}M${r.x} ${r.y - s}V${r.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${U}></path>` : $}
    ${(e.walls ?? []).map((l) => {
    const c = Xo(l.a, l.b, l.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${st(c)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${U}></line></g>`;
  })}
    ${o && a ? _`<path class=${`preview-opening${o.invalid ? " invalid" : ""}`}
      d=${st(Ae(a, o.offset, o.offset + o.width))}
      fill=${o.invalid ? i.invalid : o.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${ta(n, t)}`;
}
function Jo(n, t) {
  const e = t.palette, i = 5 / t.scale;
  return _`<g class="snap-start">
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.background}
      stroke-width="4" vector-effect=${U}></rect>
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.snap}
      stroke-width="1.5" vector-effect=${U}></rect></g>`;
}
function ta(n, t) {
  const e = t.preview, i = t.palette, s = e.anchor ? Jo(e.anchor, t) : $, r = e.snap;
  if (!r || r.kind === "none") return s;
  const o = (h) => h / t.scale, { x: a, y: l } = r.pt, c = { stroke: i.background, width: "3" };
  let p, d = $;
  if (r.kind === "node") {
    const h = o(5);
    p = _`<g class="snap-node"><rect x=${a - h} y=${l - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${U}></rect></g>`;
  } else if (r.kind === "mid") {
    const h = o(11) / Math.sqrt(3), g = `M${a} ${l - h}L${a + h * 0.866} ${l + h / 2}L${a - h * 0.866} ${l + h / 2}Z`;
    p = _`<g class="snap-mid"><path d=${g} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${U}></path></g>`;
  } else if (r.kind === "wall") {
    const h = o(5), g = `M${a - h} ${l - h}L${a + h} ${l + h}M${a - h} ${l + h}L${a + h} ${l - h}`;
    p = _`<g class="snap-wall">
      <path d=${g} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${U}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${U}></path></g>`;
    const v = r.endpoint.kind === "wall" ? Rt(vs, n, _e).get(r.endpoint.wallId) : void 0;
    v && (d = _`<path class="snap-wall-hl" d=${st(v)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${U}></path>`);
  } else {
    const h = o(4), g = `M${a - h} ${l}H${a + h}M${a} ${l - h}V${l + h}`;
    p = _`<g class="snap-grid">
      <path d=${g} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${U}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${U}></path></g>`;
  }
  const u = f(`snapmark.${r.kind}`);
  return _`
    ${d}${s}${p}
    <text class="snap-label" x=${a + o(9)} y=${l - o(9)} font-size=${o(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${U} font-family="system-ui, sans-serif">${u}</text>`;
}
function ea(n, t) {
  const e = t.preview.level ?? n, i = t.palette, s = Rt(jo, e, (d) => Vi(d, !0)), r = e.walls.filter((d) => d.type === "railing" || d.type === "fence"), o = r.length ? Rt(Fo, e, Fi) : null, a = 8 / t.scale, l = t.selection, c = (t.mode ?? "plan") === "plan", p = c ? $ : String(i.dimOpacity);
  return _`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${p}>${e.zones.map((d) => Wo(d, t, (l == null ? void 0 : l.kind) === "zone" && l.id === d.id))}</g>
    <path class="walls" d=${s.map((d) => d.map(st).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${p}></path>
    ${o ? _`<g class="railings" opacity=${p}>${r.flatMap((d) => (o.get(d.id) ?? []).map((u) => _`<path d=${st(u)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${p}>${e.openings.map((d) => Yo(e, d, t))}</g>
    <g class="wall-breaks" opacity=${p}>${Vo(e, t)}</g>
    <g class="devices-layer">${Ho(e, {
    palette: i,
    scale: t.scale,
    selection: l,
    showCones: t.showCones ?? !0,
    dim: c,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0
  })}</g>
    <g class="selection">${Go(e, t)}</g>
    <g class="preview">${Qo(e, t)}</g>`;
}
const na = {
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
}, ia = {
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
function sa(n) {
  return n ? na : ia;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ra = { PROPERTY: 3 }, oa = (n) => (...t) => ({ _$litDirective$: n, values: t });
class aa {
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
const la = {}, ca = (n, t = la) => n._$AH = t;
class da extends aa {
  constructor(t) {
    if (super(t), t.type !== ra.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === e ? mt : (ca(t), e);
  }
}
const Q = oa(da);
function ys(n, t) {
  return Math.abs(t.x - n.x) >= Math.abs(t.y - n.y) ? { x: t.x, y: n.y } : { x: n.x, y: t.y };
}
function ha(n, t, e) {
  return M(n, k(cn(A(t, n)), e));
}
function ei(n, t) {
  return { pt: n, kind: t, endpoint: { kind: "free", pt: n } };
}
function Tt(n, t, e) {
  const { tolMm: i, grid: s, ortho: r } = e, o = r ? e.from : void 0, a = new Set(e.excludeNodeIds ?? []), l = o ? ys(o, t) : t, c = o !== void 0 && l.y === o.y, p = (y) => !o || Math.abs(c ? y.y - o.y : y.x - o.x) <= 1;
  let d = null;
  for (const y of n.nodes) {
    if (a.has(y.id)) continue;
    const x = { x: y.x, y: y.y }, S = R(x, l);
    S <= i && p(x) && (!d || S < d.d) && (d = { id: y.id, pt: x, d: S });
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const u = n.walls.filter((y) => !a.has(y.a) && !a.has(y.b)).map((y) => ({ w: y, f: it(n, y) })).filter((y) => y.f.len > 1e-9);
  let h = null;
  for (const { w: y, f: x } of u) {
    const S = { x: (x.a.x + x.b.x) / 2, y: (x.a.y + x.b.y) / 2 }, E = R(S, l);
    E <= i && p(S) && (!h || E < h.d) && (h = { wallId: y.id, pt: S, offset: x.len / 2, d: E });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const g = (y) => {
    let x = null;
    for (const { w: S, f: E } of u) {
      const P = Z(E.dir), N = y ? [E.leftOff, -E.rightOff].filter((z) => z !== 0) : [0];
      for (const z of N) {
        const O = M(E.a, k(P, z)), B = o ? ht(o, A(l, o), O, E.dir) : M(O, k(E.dir, W(A(l, O), E.dir)));
        if (!B) continue;
        const F = W(A(B, O), E.dir);
        if (F < 0 || F > E.len) continue;
        const q = R(B, l);
        q <= i && (!x || q < x.d) && (x = { d: q, res: { pt: B, kind: "wall", endpoint: { kind: "wall", wallId: S.id, offset: F } } });
      }
    }
    return x ? x.res : null;
  }, v = g(!1);
  if (v) return v;
  const w = g(!0);
  if (w) return w;
  if (s && s > 0) {
    const y = (S) => Math.round(S / s) * s, x = o ? c ? { x: y(l.x), y: o.y } : { x: o.x, y: y(l.y) } : { x: y(l.x), y: y(l.y) };
    return ei(x, "grid");
  }
  return ei(l, "none");
}
function ua(n, t, e) {
  const i = A(e, t), s = W(i, i), r = s === 0 ? 0 : Math.max(0, Math.min(1, W(A(n, t), i) / s));
  return R(n, { x: t.x + i.x * r, y: t.y + i.y * r });
}
function pa(n, t, e) {
  return t.some((i, s) => ua(n, i, t[(s + 1) % t.length]) <= e);
}
function bs(n, t, e) {
  for (const [i, s] of _e(n))
    if (se(t, s) || pa(t, s, e)) return i;
  return null;
}
function fa(n, t) {
  for (const e of n.openings) {
    const i = n.walls.find((a) => a.id === e.wallId);
    if (!i) continue;
    const s = it(n, i);
    if (s.len < 1e-9) continue;
    const { t: r, side: o } = Ut(s, t);
    if (r >= e.offset && r <= e.offset + e.width && o >= -s.rightOff && o <= s.leftOff) return e.id;
  }
  return null;
}
function ga(n, t, e, i) {
  const s = fa(n, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const o = n.walls.find((a) => a.id === i.id);
    if (o)
      for (const a of [o.a, o.b]) {
        const l = n.nodes.find((c) => c.id === a);
        if (l && R(t, l) <= e) return { kind: "node", id: a };
      }
  }
  const r = bs(n, t, e);
  if (r) return { kind: "wall", id: r };
  for (const o of n.zones)
    if (o.outline.length >= 3 && se(t, o.outline)) return { kind: "zone", id: o.id };
  return null;
}
function ma(n) {
  let t = null, e = null, i = null, s = null, r = !1, o = { x: 0, y: 0 }, a = null;
  const l = (h) => {
    t = h, n.select(h);
  }, c = () => {
    e = null, i = null, s = null, a = null, r = !1;
  }, p = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, d = (h, g, v) => Ut(it(h, h.walls.find((w) => w.id === g)), v).t;
  function u(h) {
    const g = e;
    if (!(!g || !i) && !(h.pt.x === o.x && h.pt.y === o.y))
      if (r = !0, g.kind === "node") {
        const v = Tt(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [g.nodeId]
        }), w = v.endpoint, y = (v.kind === "wall" || v.kind === "mid") && w.kind === "wall", x = v.kind === "node" && w.kind === "node" && w.nodeId !== g.nodeId, S = i.nodes.find((z) => z.id === g.nodeId), E = !!S.host && y && w.kind === "wall" && w.wallId === S.host.wallId;
        let P = i;
        if (S.host && !E) {
          const z = structuredClone(i);
          delete z.nodes.find((O) => O.id === g.nodeId).host, P = z;
        }
        let N = io(P, g.nodeId, p(v));
        if (x && w.kind === "node")
          N = ao(N, g.nodeId, w.nodeId);
        else if (y && w.kind === "wall" && !E) {
          const z = i.walls.find((O) => O.id === w.wallId);
          if (z && z.a !== g.nodeId && z.b !== g.nodeId) {
            const O = structuredClone(N);
            O.nodes.find((B) => B.id === g.nodeId).host = { wallId: w.wallId, offset: w.offset }, N = yt(O, N);
          }
        }
        s = N;
      } else if (g.kind === "wall") {
        const v = i.walls.find((x) => x.id === g.wallId), w = Tt(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [v.a, v.b]
        }), y = A(w.pt, g.origin);
        s = ro(
          i,
          g.wallId,
          w.kind === "none" ? { x: Math.round(y.x), y: Math.round(y.y) } : y
        );
      } else {
        const v = i.openings.find((w) => w.id === g.openingId);
        s = Ji(i, v.id, d(i, v.wallId, h.pt) - g.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      c(), o = h.pt;
      const g = n.level(), v = t, w = ga(g, h.pt, n.tolMm(), v);
      if (l(w), !!w) {
        if (a = i = s = g, w.kind === "node") {
          let y = w.id;
          const x = (v == null ? void 0 : v.kind) === "wall" ? g.walls.find((S) => S.id === v.id) : void 0;
          if (h.alt && x) {
            const S = oo(g, x.id, x.a === w.id ? "a" : "b");
            i = s = S.level, y = S.nodeId, l({ kind: "node", id: y });
          }
          e = { kind: "node", nodeId: y, origin: K(i, y) };
        } else if (w.kind === "wall")
          e = { kind: "wall", wallId: w.id, origin: h.pt };
        else if (w.kind === "opening") {
          const y = g.openings.find((x) => x.id === w.id);
          e = { kind: "opening", openingId: y.id, grab: d(g, y.wallId, h.pt) - y.offset };
        }
      }
    },
    move(h) {
      u(h);
    },
    up(h) {
      e && u(h);
      const g = r, v = s, w = a;
      c(), g && v && w && v !== w && n.commit(v);
    },
    key(h) {
      return h === "Escape" && e ? (c(), !0) : !1;
    },
    preview() {
      return !e || !s ? {} : { level: s, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      c(), l(null);
    }
  };
}
function ie(n, { min: t = 0, max: e = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = n.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const r = Number(s);
  return Number.isSafeInteger(r) && r >= t && r <= e ? r : null;
}
function $s() {
  let n = "", t = "", e = "first";
  const i = () => {
    n = "", t = "", e = "first";
  }, s = () => n !== "" || t !== "";
  return {
    get first() {
      return n;
    },
    get second() {
      return t;
    },
    typing: s,
    clear: i,
    key(r, o, a) {
      return /^[0-9]$/.test(r) || r === " " ? (e === "first" ? n += r : t += r, !0) : r === "Backspace" ? (e === "first" ? n = n.slice(0, -1) : t = t.slice(0, -1), !0) : r === "Tab" ? (e = e === "first" ? "second" : "first", !0) : r === "Enter" ? (o(), !0) : r === "Escape" ? (s() ? i() : a(), !0) : !1;
    },
    tracker: (r) => ({ first: n, second: t, field: e, at: r })
  };
}
function va(n) {
  let t = null, e = { x: 0, y: 0 };
  const i = $s(), s = () => {
    t = null, i.clear();
  }, r = (c) => Tt(n.level(), c, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 });
  function o() {
    if (!t) return null;
    if (i.typing()) {
      const c = ie(i.first, { min: 1 }), p = ie(i.second, { min: 1 });
      return c === null || p === null ? null : { x: t.x + (e.x >= t.x ? c : -c), y: t.y + (e.y >= t.y ? p : -p) };
    }
    return r(e).pt;
  }
  const a = (c, p) => Math.abs(c.x - p.x) < 1 || Math.abs(c.y - p.y) < 1;
  function l(c) {
    if (!t || a(t, c)) return;
    const p = no(n.level(), t, c, n.wallProps(), n.boxMeasure());
    p !== n.level() && (n.commit(p), s());
  }
  return {
    id: "box",
    down(c) {
      if (e = c.pt, !t) {
        t = r(c.pt).pt;
        return;
      }
      const p = o();
      p && l(p);
    },
    move(c) {
      e = c.pt;
    },
    up() {
    },
    key(c) {
      return t ? i.key(c, () => {
        const p = o();
        p && l(p);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: r(e) };
      const c = o(), p = {
        tracker: i.tracker(e),
        anchor: t,
        snap: i.typing() ? void 0 : r(e)
      };
      if (!c || a(t, c)) return p;
      const d = n.wallProps(), u = is(t, c, d.thickness, n.boxMeasure());
      return u && (p.walls = u.map((h, g) => ({ a: h, b: u[(g + 1) % 4], props: { ...d, baseline: "center" } }))), p;
    },
    cancel() {
      s();
    }
  };
}
const ni = (n) => Math.round(n * 1e3) / 1e3 + 0;
function ya(n) {
  let t = null, e = null, i = null, s = { x: 0, y: 0 }, r = !1, o = null;
  const a = $s(), l = () => {
    t = null, e = null, i = null, o = null, a.clear();
  }, c = (u, h) => Tt(n.level(), u, { tolMm: n.tolMm(), grid: n.grid(), from: e ?? void 0, ortho: h && e !== null });
  function p() {
    if (!e) return null;
    const u = c(s, r), h = ie(a.first, { min: 1 }), g = ie(a.second);
    if (h === null && g === null) return { pt: u.pt, endpoint: u.endpoint, snap: u };
    const v = h ?? R(e, u.pt);
    let w = u.pt;
    if (g === null && R(e, u.pt) < 1) {
      const E = o ?? { x: 1, y: 0 };
      w = { x: e.x + E.x, y: e.y + E.y };
    }
    if (g !== null) {
      const E = g * Math.PI / 180;
      w = { x: e.x + Math.cos(E), y: e.y - Math.sin(E) };
    }
    const y = ha(e, w, v), x = { x: ni(y.x), y: ni(y.y) }, S = n.level().nodes.find((E) => Math.hypot(E.x - x.x, E.y - x.y) < 1);
    return S ? { pt: { x: S.x, y: S.y }, endpoint: { kind: "node", nodeId: S.id }, snap: u } : { pt: x, endpoint: { kind: "free", pt: x }, snap: u };
  }
  function d() {
    const u = p();
    if (!t || !u) return;
    const h = eo(n.level(), t, u.endpoint, n.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    n.commit(h.level);
    const g = h.level.walls.find((S) => S.id === h.wallId);
    i === null && (i = g.a);
    const v = h.endNodeId === i, w = e, y = K(h.level, h.endNodeId), x = R(w, y);
    if (x > 0 && (o = { x: (y.x - w.x) / x, y: (y.y - w.y) / x }), a.clear(), v) {
      l();
      return;
    }
    t = { kind: "node", nodeId: h.endNodeId }, e = K(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(u) {
      if (s = u.pt, r = u.shift, !t) {
        const h = c(u.pt, !1);
        t = h.endpoint, e = h.pt;
        return;
      }
      d();
    },
    move(u) {
      s = u.pt, r = u.shift;
    },
    up() {
    },
    key(u, h) {
      return r = h.shift, t ? a.key(u, d, l) : !1;
    },
    preview() {
      if (!e) return { snap: Tt(n.level(), s, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }) };
      const u = p();
      return {
        walls: [{ a: e, b: u.pt, props: n.wallProps() }],
        snap: u.snap,
        tracker: a.tracker(u.pt),
        orthoFrom: r ? e : void 0,
        anchor: e
      };
    },
    cancel() {
      l();
    }
  };
}
function ba(n, t) {
  let e = null;
  const i = () => n.openingDefaults(t);
  function s() {
    if (!e) return null;
    const r = n.level(), o = bs(r, e, n.tolMm());
    if (!o) return null;
    const a = it(r, r.walls.find((c) => c.id === o)), l = Ut(a, e).t;
    return { wallId: o, center: l, pt: M(a.a, k(a.dir, l)) };
  }
  return {
    id: t,
    down(r) {
      e = r.pt;
      const o = s();
      if (!o) return;
      const a = i(), l = Yr(n.level(), o.wallId, t, o.center, a.width, a);
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
      const { width: o } = i(), a = r.center - o / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: r.wallId, offset: a, width: o, kind: t, invalid: !Ee(n.level(), r.wallId, a, o) },
        snap: { pt: r.pt, kind: "wall", endpoint: { kind: "wall", wallId: r.wallId, offset: r.center } }
      };
    },
    cancel() {
      e = null;
    }
  };
}
function $a(n) {
  return {
    id: "zone",
    down(t) {
      var s;
      const e = n.level(), i = Kr(e, t.pt, n.zoneName());
      i.zoneId !== null && (n.commit(i.level), (s = n.zonePlaced) == null || s.call(n), n.select({ kind: "zone", id: i.zoneId }));
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
const ws = 3, ii = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
};
function xs(n) {
  let t = null;
  const e = (s, r, o) => {
    const a = s.devices.find((p) => p.id === r), l = a ? Y(s, a) : null, c = a ? Ge(s, a, n.scale()) : null;
    return !l || !c ? 0 : cs(gt(A(o, l.pt)) - gt(A(c.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && R(s.pt, t.downPt) <= ws / n.scale()) return;
    t.moved = !0;
    const r = t.original.devices.find((d) => d.id === t.id), o = r ? Y(t.original, r) : null;
    if (!r || !o) return;
    const a = R(s.pt, o.pt), l = (gt(A(s.pt, o.pt)) - t.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: o.pt.x + Math.cos(l) * a, y: o.pt.y - Math.sin(l) * a }, p = xo(t.original, r, c, s.shift);
    t.work = JSON.stringify(p) === JSON.stringify(r.placement) ? t.original : hn(t.original, r.id, p);
  }
  return {
    start(s, r) {
      if (t = null, !s) return !1;
      const o = n.level(), a = o.devices.find((c) => c.id === s), l = a ? Ge(o, a, n.scale()) : null;
      return !a || !l || R(r.pt, l.to) > n.tolMm() ? !1 : (t = { id: s, original: o, work: o, downPt: r.pt, offset: e(o, s, r.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const r = t;
      return t = null, r.moved && r.work !== r.original && ii(r.work, r.id) !== ii(r.original, r.id) && n.commit(r.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function si(n, t, e) {
  const i = it(n, n.walls.find((s) => s.id === t));
  return Ut(i, e).side > 0 ? "left" : "right";
}
function ks(n, t) {
  const e = n.grid();
  return e && e > 0 ? { x: Math.round(t.x / e) * e, y: Math.round(t.y / e) * e } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function _s(n, t, e, i, s = 0) {
  const r = ln[e];
  if (r.includes("wall")) {
    const o = Tt(t, i, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }), a = o.endpoint;
    if ((o.kind === "wall" || o.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: si(t, a.wallId, i), offset: a.offset };
    if (o.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of t.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const p = it(t, c), d = Math.max(0, Math.min(p.len, Ut(p, i).t)), u = Math.hypot(i.x - (p.a.x + p.dir.x * d), i.y - (p.a.y + p.dir.y * d));
        (!l || u < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : p.len, d: u });
      }
      if (l) return { mode: "wall", wallId: l.id, side: si(t, l.id, i), offset: l.offset };
    }
  }
  return r.includes("free") ? { mode: "free", ...ks(n, i), rotation: s } : null;
}
function wa(n, t, e) {
  return Ki(n.deviceDefaults(t), "free", e.mode);
}
function xa(n, t) {
  let e = null, i;
  const s = xs(n);
  function r() {
    if (!e) return null;
    const o = n.level(), a = _s(n, o, t, e);
    if (!a)
      return { placement: { mode: "free", ...ks(n, e), rotation: 0 }, props: n.deviceDefaults(t), invalid: !0 };
    const l = wa(n, t, a), c = Yn(o, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !c };
  }
  return {
    id: t,
    down(o) {
      if (e = o.pt, s.start(i, o)) return;
      const a = r();
      if (!a || a.invalid) return;
      const l = n.level(), c = Ii(f(`device.${t}`), l.devices.filter((d) => d.props.kind === t).map((d) => d.name)), p = Yn(l, a.props, a.placement, c);
      p.deviceId !== null && (n.commit(p.level), i = p.deviceId, n.select({ kind: "device", id: p.deviceId }));
    },
    move(o) {
      e = o.pt, s.active() && s.move(o);
    },
    up(o) {
      s.end(o);
    },
    key(o) {
      return o === "Escape" && s.cancel();
    },
    preview() {
      const o = s.working();
      if (s.active()) return o ? { level: o } : {};
      const a = r();
      return a ? { device: a } : {};
    },
    cancel() {
      s.cancel(), e = null, i = void 0;
    }
  };
}
const ri = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
}, ka = (n, t, e) => e === void 0 || ri(n, e) !== ri(t, e);
function _a(n) {
  let t = null, e = null;
  const i = xs(n);
  let s = null, r = null, o = !1, a = { x: 0, y: 0 };
  const l = (u) => {
    t = u, n.select(u);
  }, c = () => {
    e = null, s = null, r = null, o = !1;
  };
  function p(u) {
    if (!e || !s || !o && R(u.pt, a) <= ws / n.scale()) return;
    if (o = !0, u.pt.x === a.x && u.pt.y === a.y) {
      r = s;
      return;
    }
    const h = s.devices.find((P) => P.id === e.id);
    if (!h) return;
    const g = u.shift ? ys(a, u.pt) : u.pt, v = h.placement, w = v.mode === "free", y = w ? null : Y(s, h), x = v.mode === "free" ? v.rotation : y ? ls(Math.round(gt(y.dir))) : 0, S = _s(n, s, h.props.kind, w ? M(g, e.grab) : g, x), E = S && S.mode === "wall" && v.mode === "wall" && v.aim !== void 0 ? { ...S, aim: v.aim } : S;
    r = E ? hn(s, h.id, d(s, h.placement, E, g)) : s;
  }
  function d(u, h, g, v) {
    if (h.mode !== "wall" || g.mode !== "wall" || g.wallId !== h.wallId) return g;
    const w = u.walls.find((N) => N.id === h.wallId);
    if (!w) return g;
    const y = it(u, w), x = Math.max(0, Math.min(y.len, h.offset + W(A(v, a), y.dir))), S = Ut(y, v).side, E = n.tolMm(), P = h.side === "left" ? S < -(y.rightOff + E) ? "right" : "left" : S > y.leftOff + E ? "left" : "right";
    return { ...g, offset: x, side: P };
  }
  return {
    id: "device-select",
    down(u) {
      c(), a = u.pt;
      const h = n.level(), g = n.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, u)) return;
      const v = us(h, u.pt, g);
      if (!v) {
        l(null);
        return;
      }
      l({ kind: "device", id: v });
      const w = h.devices.find((x) => x.id === v), y = Y(h, w);
      s = r = h, e = { id: v, grab: y && w.placement.mode === "free" ? A(y.pt, u.pt) : { x: 0, y: 0 } };
    },
    move(u) {
      i.active() ? i.move(u) : p(u);
    },
    up(u) {
      if (i.end(u)) return;
      e && p(u);
      const h = r, g = s, v = o, w = e == null ? void 0 : e.id;
      c(), v && h && g && h !== g && ka(g, h, w) && n.commit(h);
    },
    key(u) {
      return u === "Escape" && i.cancel() ? !0 : u === "Escape" && e ? (c(), !0) : !1;
    },
    preview() {
      const u = i.working();
      return u ? { level: u } : e && r ? { level: r } : {};
    },
    cancel() {
      i.cancel(), c(), l(null);
    }
  };
}
function Sa(n) {
  return {
    id: "binding-select",
    down(t) {
      const e = us(n.level(), t.pt, n.tolMm());
      n.select(e ? { kind: "device", id: e } : null);
    },
    move() {
    },
    up() {
    },
    key(t) {
      return t !== "Escape" ? !1 : (n.select(null), !0);
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const Ea = ["select", "box", "wall", "door", "window", "opening", "zone"], Ma = [
  "device-select",
  "ceiling_light",
  "wall_light",
  "motion_sensor",
  "illuminance_sensor",
  "climate_sensor",
  "switch",
  "socket",
  "exhaust_fan",
  "equipment"
], Aa = ["binding-select"];
function mn(n) {
  return n === "plan" ? Ea : n === "equipment" ? Ma : Aa;
}
function Xe(n, t) {
  switch (n) {
    case "select":
      return ma(t);
    case "box":
      return va(t);
    case "wall":
      return ya(t);
    case "door":
    case "window":
    case "opening":
      return ba(t, n);
    case "zone":
      return $a(t);
    case "device-select":
      return _a(t);
    case "binding-select":
      return Sa(t);
    default:
      return xa(t, n);
  }
}
function Be(n, t) {
  return (t.kind === "wall" ? n.walls : t.kind === "node" ? n.nodes : t.kind === "opening" ? n.openings : t.kind === "device" ? n.devices : n.zones).some((i) => i.id === t.id);
}
function Ia(n) {
  switch (n.saveState) {
    case "saving":
      return f("save.saving");
    case "conflict":
      return f("save.conflict");
    case "error":
      return f("save.error");
    default:
      return n.dirty ? f("save.dirty") : f(n.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Pa(n) {
  return m`
    <div class="top"><div class="bar">
      ${n.lead ?? $}
      ${n.plans.length > 1 ? m`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${n.saveState === "saving"} .value=${Q(n.planId)}
          @change=${(t) => {
    const e = t.target, i = e.value;
    e.value = n.planId, i !== n.planId && n.onPickPlan(i);
  }}>
          ${n.plans.map((t) => m`<option value=${t.id} ?selected=${t.id === n.planId}>${t.name}</option>`)}
        </select>` : $}
      <button class="btn" data-action="new-plan" title=${f("plan.new")} aria-label=${f("plan.new")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${f("plan.delete")} aria-label=${f("plan.delete")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${f("action.undo")} aria-label=${f("action.undo")} ?disabled=${!n.canUndo}
        @click=${n.onUndo}>↶</button>
      <button class="btn" title=${f("action.redo")} aria-label=${f("action.redo")} ?disabled=${!n.canRedo}
        @click=${n.onRedo}>↷</button>
      <span class="save-state ${n.saveState}" title=${n.saveState === "error" ? n.errorMessage ?? "" : ""}>
        ${Ia(n)}${n.saveState === "error" && n.errorMessage ? m`: ${n.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${n.saveState === "saving"} @click=${n.onSave}>
        ${f("action.save")}</button>
    </div>${n.steps}</div>`;
}
function Ca(n, t, e) {
  return m`
    <div class="tools">
      ${mn(n).map((i) => m`
        ${i === "zone" || i === "ceiling_light" ? m`<div class="tool-sep"></div>` : $}
        <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => e(i)}>
          ${f(`tool.${i}`)}</button>`)}
    </div>`;
}
const Oa = ["plan", "equipment", "binding", "automation"], le = ["plan", "equipment", "binding"], He = (n, t, e) => f(n === 1 ? t : e).replace("{n}", String(n));
function Na(n, t, e) {
  const { walls: i, zones: s, devices: r } = t;
  switch (n) {
    case "plan":
      return {
        text: `${He(i.length, "steps.wall", "steps.walls")}, ${He(s.length, "steps.room", "steps.rooms")}`,
        done: i.length > 0 && s.length > 0
      };
    case "equipment":
      return { text: He(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const o = r.filter((a) => e(a) === "bound").length;
      return {
        text: f("steps.bound").replace("{b}", String(o)).replace("{n}", String(r.length)),
        done: r.length > 0 && o === r.length
      };
    }
  }
}
const oi = (n, t) => f(n).replace("{step}", f(`mode.${t}`));
function La(n) {
  const t = le.indexOf(n.mode), e = le[t - 1], i = le[t + 1];
  return m`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Q(n.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => n.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${le.map((s, r) => {
    const o = Na(s, n.level, n.status), a = s === n.mode;
    return m`<button class="step${a ? " current" : ""}${o.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : $} @click=${() => n.onMode(s)}>
          <span class="n">${r + 1}</span><span class="name">${f(`mode.${s}`)}</span><span class="state">${o.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${Oa.length}</span><span class="name">${f("mode.automation")}</span>
        <span class="state">${f("steps.later")}</span>
      </button>
      <div class="nav">
        ${e ? m`<button class="btn" data-nav="back" @click=${() => n.onMode(e)}>${oi("steps.back", e)}</button>` : $}
        ${i ? m`<button class="btn primary" data-nav="next" @click=${() => n.onMode(i)}>${oi("steps.next", i)}</button>` : m`<button class="btn primary" data-nav="next" @click=${() => n.onNextUnbound()}>${f("steps.nextUnbound")}</button>`}
      </div>
    </nav>`;
}
const Da = ["unbound", "bound", "all"], za = /* @__PURE__ */ new WeakMap();
function Ss(n) {
  return Rt(za, n, (t) => [...t.devices].sort((e, i) => e.name.localeCompare(i.name) || e.id.localeCompare(i.id)));
}
function Ra(n, t, e) {
  const i = Ss(n), s = t === null ? -1 : i.findIndex((r) => r.id === t);
  for (let r = 1; r <= i.length; r++) {
    const o = i[(s + r) % i.length];
    if (e(o) !== "bound") return o.id;
  }
  return null;
}
const ai = (n) => f(`device.${n.props.kind}`), Ta = (n, t) => n === "all" || n === "bound" == (t === "bound");
function Ua(n, t, e) {
  return t === 0 ? f("binding.noDevices") : e || n.filter === "all" ? f("binding.noMatch") : f(n.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function li(n) {
  const t = f(n.collapsed ? "binding.expand" : "binding.collapse");
  return m`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!n.collapsed)} aria-label=${t}
    title=${t} @click=${() => n.onCollapse(!n.collapsed)}>${n.collapsed ? "›" : "‹"}</button>`;
}
function Ba(n) {
  var o;
  if (n.collapsed) return m`<div class="blist collapsed">${li(n)}</div>`;
  const t = Ss(n.level).map((a) => ({ d: a, st: n.status(a) })), e = {
    unbound: t.filter((a) => a.st !== "bound").length,
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = n.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => Ta(n.filter, l) && (!i || a.name.toLowerCase().includes(i) || ai(a).toLowerCase().includes(i))), r = ((o = n.selection) == null ? void 0 : o.kind) === "device" ? n.selection.id : null;
  return m`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${Da.map((a) => m`<button role="radio" aria-checked=${String(a === n.filter)} data-filter=${a}
            @click=${() => n.onFilter(a)}>${f(`binding.filter.${a}`)} <span class="count">${e[a]}</span></button>`)}
        </div>
        ${li(n)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${Q(n.query)} @input=${(a) => n.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? m`<p class="empty">${Ua(n, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const c = ir(a);
    return m`<button class="brow${a.id === r ? " sel" : ""}" data-id=${a.id} @click=${() => n.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${f(`bindstatus.${l}`)} title=${f(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${ai(a)}</small></span>
            <span class="cnt">${c.filled}/${c.total}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function I(n, t) {
  return m`<label class="row"><span>${n}</span>${t}</label>`;
}
function X(n, t, e, i) {
  return m`<select class="val" data-field=${i ?? $} .value=${Q(n)} @change=${(s) => {
    const r = s.target;
    e(r.value) === !1 && (r.value = n);
  }}>
    ${t.map((s) => m`<option value=${s.v} ?selected=${s.v === n}>${s.label}</option>`)}
  </select>`;
}
function jt(n) {
  const t = n.value === null ? "" : String(Math.round(n.value)), e = (i) => {
    var s;
    return (s = n.setNotice) == null ? void 0 : s.call(n, i);
  };
  return m`<input class="val" type="text" inputmode="numeric" data-field=${n.field ?? $}
    placeholder=${n.placeholder ?? $} title=${n.placeholder ?? $} .value=${Q(t)}
    @change=${(i) => {
    const s = i.target;
    if (n.onBlank && s.value.trim() === "") {
      (n.value === null || n.onBlank() !== !1) && e(null);
      return;
    }
    const r = ie(s.value, n.rule);
    if (r === null) {
      s.value = t, e(f(n.bad));
      return;
    }
    if (n.skipSame && r === n.value) {
      e(null);
      return;
    }
    if (n.apply(r) === !1) {
      s.value = t, e(f("props.noFit"));
      return;
    }
    e(null);
  }} />`;
}
function Ha() {
  return {
    door: { width: he.door, hinge: "start", swing: "left" },
    window: { width: he.window, outside: "left" },
    opening: { width: he.opening },
    zoneName: null
  };
}
function ja(n, t) {
  return t === "door" ? { ...n.door } : t === "window" ? { ...n.window } : { width: n.opening.width };
}
function Es(n) {
  return Ii(f("zone.default"), n.zones.map((t) => t.name));
}
const Fa = (n) => n === "door" || n === "window" || n === "opening" || n === "zone";
function qa(n) {
  const t = n.next;
  if (n.tool === "zone") {
    const o = t.zoneName ?? Es(n.level);
    return m`
      <h4>${f("props.nextZone")}</h4>
      ${I(f("props.name"), m`<input class="val wide" type="text" data-field="next-zone-name" .value=${Q(o)}
        @change=${(a) => {
      const l = a.target, c = l.value.trim();
      if (!c) {
        l.value = o;
        return;
      }
      c !== o && n.setNext({ ...t, zoneName: c });
    }} />`)}`;
  }
  if (n.tool !== "door" && n.tool !== "window" && n.tool !== "opening") return $;
  const e = n.tool, i = t[e].width, s = ["left", "right"].map((o) => ({ v: o, label: f(`side.${o}`) })), r = (o) => n.setNext({ ...t, [e]: { ...t[e], ...o } });
  return m`
    <h4>${f(`props.next.${e}`)}</h4>
    ${I(`${f("props.width")}, ${f("unit.mm")}`, jt({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: n.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (o) => {
      r({ width: o });
    }
  }))}
    ${e === "door" ? m`
      ${I(f("props.hinge"), X(
    t.door.hinge,
    ["start", "end"].map((o) => ({ v: o, label: f(`hinge.${o}`) })),
    (o) => {
      o !== t.door.hinge && r({ hinge: o });
    },
    "next-hinge"
  ))}
      ${I(f("props.swing"), X(t.door.swing, s, (o) => {
    o !== t.door.swing && r({ swing: o });
  }, "next-swing"))}` : $}
    ${e === "window" ? I(f("props.outside"), X(
    t.window.outside,
    s,
    (o) => {
      o !== t.window.outside && r({ outside: o });
    },
    "next-outside"
  )) : $}`;
}
class Va {
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
class Wa {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Ue(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(Nn(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const e = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === e) ? e : t[0].id);
        }
      } catch (t) {
        this.h.loadError = Pt(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const e = await ko(this.h.hass, t);
    this.h.drafts.cancel(), this.h.save.reset(e.revision), this.adopt(e), this.h.drafts.setLastPlanId(e.id), this.offerDraft(this.h.drafts.read(e.id));
  }
  /** Closes the open dialog when it is of the given kind. */
  closeDialog(t) {
    var e;
    ((e = this.h.dialog) == null ? void 0 : e.kind) === t && (this.h.dialog = null);
  }
  offerDraft(t) {
    this.h.pendingDraft = t, t ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Ue(this.h.hass);
      } catch {
      }
  }
  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions() {
    const t = this.h.plan, e = this.h.plans.map((i) => ({ id: i.id, name: i.id === t.id ? t.name : i.name }));
    return e.some((i) => i.id === t.id) || e.push({ id: t.id, name: t.name }), e;
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
    } catch (e) {
      this.h.notice = Pt(e);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    var e;
    const t = ((e = this.h.dialog) == null ? void 0 : e.kind) === "switch" ? this.h.dialog.to : null;
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
    this.h.toolId = mn(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(Nn(f("plan.default"))), this.offerDraft(null);
  }
  requestDelete() {
    !this.h.plan || this.busy() || (this.h.dialog = { kind: "delete" });
  }
  async confirmDelete() {
    var e;
    this.closeDialog("delete");
    const t = this.h.plan;
    if (!(!t || !this.h.hass || this.busy())) {
      this.h.deleting = !0;
      try {
        if (this.h.save.baseRevision !== null)
          try {
            await So(this.h.hass, t.id);
          } catch (r) {
            this.h.save.state = "error", this.h.save.errorMessage = Pt(r);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((e = this.h.pendingDraft) == null ? void 0 : e.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ue(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((r) => r.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (r) {
            this.h.notice = Pt(r);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(dr) }, this.h.history = new Va(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = Xe(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.needFit = !0;
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
    var e;
    if (this.h.save.state === "saved") {
      this.h.drafts.setLastPlanId(this.h.plan.id), this.refreshPlans(), this.h.drafts.cancel();
      for (const i of t) ((e = this.h.pendingDraft) == null ? void 0 : e.planId) !== i && this.h.drafts.clear(i);
      this.h.save.dirty && !this.draftBlocked() && this.h.drafts.schedule(() => this.makeDraft());
    }
  }
  currentPlan() {
    const t = this.h.plan, e = t.levels.map((i, s) => s === 0 ? this.h.history.current : i);
    return { ...t, levels: e, revision: this.h.save.baseRevision ?? 0 };
  }
  async doSave() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.save(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = { kind: "conflict" }));
  }
  async doOverwrite() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.overwrite(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? { kind: "conflict-again" } : null);
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const t = `${this.h.plan.name} ${f("plan.copySuffix")}`, e = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(e, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Ka {
  constructor(t) {
    this.h = t, this.error = null, this.regs = null, this.tried = !1, this.pending = !1, this.base = null, this.merged = null;
  }
  /** A registry load is in progress. */
  get loading() {
    return this.pending;
  }
  get() {
    var o;
    const t = (o = this.h.hass) == null ? void 0 : o.states, e = this.base;
    !e || !po(e.states, t) ? this.base = { states: t, meta: uo(t) } : e.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const r = this.regs ? go(i, this.regs) : i;
    return this.merged = { base: i, regs: this.regs, meta: r }, r;
  }
  /** First entry to the Binding step: loads the registries unless an attempt was made already. */
  enter() {
    this.tried || this.retry();
  }
  /** Loads the registries unless they are loaded or loading; the panel re-renders when the load starts and settles. */
  retry() {
    const t = this.h.hass;
    this.regs || this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), fo(t).then(
      (e) => {
        this.regs = e, this.error = null;
      },
      (e) => {
        this.error = f("binding.registryError").replace("{error}", Pt(e));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const ci = Oi("", "");
function Za(n) {
  return {
    level: () => {
      var t;
      return ((t = n.history) == null ? void 0 : t.current) ?? ci;
    },
    commit: (t) => n.commit(t),
    scale: () => n.view.scale,
    tolMm: () => 10 / n.view.scale,
    grid: () => n.grid ? 100 : null,
    wallProps: () => ({ type: n.wallType, thickness: n.thickness, baseline: "center" }),
    boxMeasure: () => n.boxMeasure,
    select: (t) => {
      n.selection = t, n.notice = null;
    },
    deviceDefaults: (t) => n.nextProps[t],
    openingDefaults: (t) => ja(n.nextObj, t),
    zoneName: () => {
      var t;
      return n.nextObj.zoneName ?? Es(((t = n.history) == null ? void 0 : t.current) ?? ci);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      n.nextObj = { ...n.nextObj, zoneName: null };
    }
  };
}
const Ms = Object.keys(ln), Ya = (n) => Ms.includes(n);
function Ga() {
  return Object.fromEntries(Ms.map((n) => [n, je(n, "free")]));
}
const As = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Nt, max: Nt, signed: !0 }, bad: "props.badAim" }
}, Gt = (n, t, e, i, s) => jt({ ...As[i], value: e, field: t, setNotice: n.onNotice, apply: s, skipSame: !0 }), Xa = ["round", "linear", "spot"], Qa = ["rect", "circle"], Qe = (n, t) => n.map((e) => ({ v: e, label: f(`${t}.${e}`) }));
function Is(n, t, e, i) {
  const s = (o, a, l) => I(`${f(a)}, ${f("unit.mm")}`, Gt(n, e + o, l, "mm", (c) => i({ [o]: c }))), r = (o, a, l) => I(`${f(a)}, ${f("unit.deg")}`, Gt(n, e + o, l, "angle", (c) => i({ [o]: c })));
  switch (t.kind) {
    case "ceiling_light":
      return m`
        ${I(f("props.shape"), X(t.shape, Qe([...Xa], "shape"), (o) => i({ shape: o }), `${e}shape`))}
        ${t.shape === "linear" ? m`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${I(`${f("props.poolRadius")}, ${f("unit.mm")}`, jt({
        ...As.mm,
        value: t.poolRadius,
        field: `${e}poolRadius`,
        placeholder: f("props.poolHint"),
        setNotice: n.onNotice,
        skipSame: !0,
        apply: (o) => i({ poolRadius: o }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return m`${r("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return m`${r("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return I(`${f("props.diameter")}, ${f("unit.mm")}`, m`<select class="val" data-field=${`${e}diameter`}
        .value=${Q(String(t.diameter))} @change=${(o) => {
        const a = o.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${or.map((o) => m`<option value=${String(o)} ?selected=${o === t.diameter}>${o}</option>`)}
      </select>`);
    case "climate_sensor":
      return e === "" && n.device && n.level ? nl(n.level, n.device, t.zoneIds, i) : el();
    case "equipment":
      return m`
        ${I(f("props.shape"), X(t.shape, Qe([...Qa], "shape"), (o) => i({ shape: o }), `${e}shape`))}
        ${t.shape === "rect" ? m`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${I(f("props.icon"), tl(n, t.icon, `${e}icon`, i))}
        ${I(f("props.label"), m`<input class="val wide" type="text" data-field=${`${e}label`} .value=${Q(t.label)}
          @change=${(o) => {
        const a = o.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return m`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const Ja = /^mdi:[a-z0-9-]+$/;
function tl(n, t, e, i) {
  const s = (r, o) => {
    var a, l;
    if (!Ja.test(r)) {
      o(t), (a = n.onNotice) == null || a.call(n, f("props.badIcon"));
      return;
    }
    (l = n.onNotice) == null || l.call(n, null), r !== t && !i({ icon: r }) && o(t);
  };
  return customElements.get("ha-icon-picker") ? m`<ha-icon-picker data-field=${e} .value=${Q(t)} @value-changed=${(r) => {
    var a;
    const o = r.target;
    s(String(((a = r.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      o.value = l;
    });
  }}></ha-icon-picker>` : m`<input class="val wide" type="text" data-field=${e} .value=${Q(t)}
    @change=${(r) => {
    const o = r.target;
    s(o.value.trim(), (a) => {
      o.value = a;
    });
  }} />`;
}
const el = () => m`${$}`;
function nl(n, t, e, i) {
  var r;
  const s = e.length === 0 ? (r = n.zones.find((o) => o.id === yo(n, t))) == null ? void 0 : r.name : void 0;
  return m`<fieldset class="zones" data-field="zoneIds"><legend>${f("props.zones")}${e.length === 0 ? m` (${f("props.zonesAuto")}${s ? `: ${s}` : ""})` : $}</legend>
    ${n.zones.map((o) => m`<label class="row"><input type="checkbox" data-zone=${o.id} .checked=${e.includes(o.id)}
      @change=${(a) => {
    const l = a.target.checked, c = n.zones.map((p) => p.id).filter((p) => p === o.id ? l : e.includes(p));
    i({ zoneIds: c }) || (a.target.checked = !l);
  }} /><span>${o.name}</span></label>`)}
  </fieldset>`;
}
function il(n, t) {
  const e = t.placement;
  if (e.mode === "free")
    return I(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      Gt(n, "rotation", e.rotation, "rotation", (s) => n.onPlacement({ ...e, rotation: s }))
    );
  const i = Ni.has(t.props.kind);
  return m`
    ${I(f("props.side"), X(e.side, Qe(["left", "right"], "side"), (s) => n.onPlacement({ ...e, side: s }), "side"))}
    ${I(`${f("props.offset")}, ${f("unit.mm")}`, Gt(
    n,
    "offset",
    e.offset,
    "offset",
    (s) => n.onPlacement({ ...e, offset: s })
  ))}
    ${i ? I(
    `${f("props.aim")}, ${f("unit.deg")}`,
    Gt(n, "aim", e.aim ?? 0, "aim", (s) => n.onPlacement(ps(e, s)))
  ) : $}`;
}
function sl(n, t) {
  return m`
    <h4>${f(`device.${t.props.kind}`)}</h4>
    ${I(f("props.name"), m`<input class="val wide" type="text" data-field="name" .value=${Q(t.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && n.onDevice({}, s);
  }} />`)}
    ${Is(n, t.props, "", (e) => n.onDevice(e))}
    ${il(n, t)}
    ${t.invalid ? m`<p class="warn">${f("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => n.onDelete()}>${f("action.delete")}</button>`;
}
function rl(n) {
  return n.device ? sl(n, n.device) : n.nextKind && n.nextProps ? m`
      <h4>${f("props.nextDevice")}: ${f(`device.${n.nextKind}`)}</h4>
      ${Is(n, n.nextProps, "next-", (t) => (n.onNext(t), !0))}` : m`<p class="muted">${f("props.none")}</p>`;
}
function ol(n) {
  const { level: t, selection: e } = n, i = (e == null ? void 0 : e.kind) === "device" ? t.devices.find((o) => o.id === e.id) ?? null : null, s = Ya(n.toolId) ? n.toolId : null, r = (o) => o === t ? (n.setNotice(f("props.noFit")), !1) : (n.setNotice(null), n.commit(o), !0);
  return m`<div class="props">
    ${rl({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? n.nextProps[s] : null,
    onDevice: (o, a) => !!i && r(Vr(t, i.id, o, a)),
    onPlacement: (o) => !!i && r(hn(t, i.id, o)),
    onNext: (o) => {
      s && n.setNextProps({ ...n.nextProps, [s]: { ...n.nextProps[s], ...o, kind: s } });
    },
    onDelete: () => {
      i && n.commit(Zi(t, i.id));
    },
    onNotice: (o) => n.setNotice(o)
  })}
    ${n.notice ? m`<p class="warn">${n.notice}</p>` : $}
  </div>`;
}
function Ps(n, t, e) {
  return jt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: n.setNotice, apply: e });
}
function di(n, t) {
  return t === n.level ? !1 : (n.commit(t), !0);
}
function al(n, t) {
  const e = it(t.level, n).len, i = ["bearing", "partition", "railing", ...n.type === "fence" ? ["fence"] : []], s = (r) => t.commit(lo(t.level, n.id, r));
  return m`
    <h4>${f("props.wall")}</h4>
    ${I(f("props.type"), X(
    n.type,
    i.map((r) => ({ v: r, label: f(`walltype.${r}`) })),
    (r) => s({ type: r }),
    "wall-type"
  ))}
    ${I(f("props.thickness"), Ps(t, n.thickness, (r) => {
    s({ thickness: r });
  }))}
    ${I(f("props.baseline"), X(
    n.baseline,
    ["center", "left", "right"].map((r) => ({ v: r, label: f(`baseline.${r}`) })),
    (r) => s({ baseline: r })
  ))}
    ${I(f("props.length"), m`<span class="val ro">${kt(e)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(ss(t.level, n.id))}>
      ${f("action.delete")}</button>`;
}
function ll(n, t) {
  const e = ["door", "window", "opening", ...be.slice(1).includes(n.kind) ? [n.kind] : []], i = (o) => t.commit(Qr(t.level, n.id, o)), s = ["left", "right"].map((o) => ({ v: o, label: f(`side.${o}`) })), r = be.includes(n.kind);
  return m`
    <h4>${f(`kind.${n.kind}`)}</h4>
    ${I(f("props.kind"), X(n.kind, e.map((o) => ({ v: o, label: f(`kind.${o}`) })), (o) => i(Xr(n, o))))}
    ${I(f("props.width"), Ps(t, n.width, (o) => di(t, Gr(t.level, n.id, o))))}
    ${I(f("props.offset"), jt({
    value: n.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (o) => di(t, Ji(t.level, n.id, o))
  }))}
    ${r ? m`
      ${I(f("props.hinge"), X(
    n.hinge ?? "start",
    ["start", "end"].map((o) => ({ v: o, label: f(`hinge.${o}`) })),
    (o) => i({ hinge: o })
  ))}
      ${I(f("props.swing"), X(n.swing ?? "left", s, (o) => i({ swing: o })))}` : $}
    ${n.kind === "window" ? I(f("props.outside"), X(n.outside ?? "left", s, (o) => i({ outside: o }))) : $}
    ${n.invalid ? m`<p class="warn">${f("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(ts(t.level, n.id))}>
      ${f("action.delete")}</button>`;
}
function cl(n, t) {
  return m`
    <h4>${f("props.zone")}</h4>
    ${I(f("props.name"), m`<input class="val wide" type="text" .value=${Q(n.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = n.name;
      return;
    }
    s !== n.name && t.commit(Zr(t.level, n.id, s));
  }} />`)}
    ${I(f("props.area"), m`<span class="val ro">${ms(Yi(n.outline))}</span>`)}
    ${n.broken ? m`<p class="warn">${f("props.broken")}</p>` : $}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(Xi(t.level, n.id))}>
      ${f("action.delete")}</button>`;
}
function dl(n) {
  const t = ["bearing", "partition", "railing"];
  return m`
    <h4>${f("props.newWall")}</h4>
    ${I(f("props.type"), m`<select class="val" data-field="new-wall-type"
      @change=${(e) => n.setWallType(e.target.value)}>
      ${t.map((e) => m`<option value=${e} ?selected=${e === n.wallType}>${f(`walltype.${e}`)}</option>`)}
    </select>`)}
    ${I(`${f("props.thickness")}, ${f("unit.mm")}`, jt({
    value: n.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: n.setNotice,
    field: "new-wall-thickness",
    apply: (e) => {
      n.setThickness(e);
    }
  }))}
    ${n.tool === "box" ? m`
      <div class="muted">${f("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((e) => m`
          <button class=${n.boxMeasure === e ? "on" : ""} aria-pressed=${String(n.boxMeasure === e)} data-measure=${e}
            @click=${() => n.setBoxMeasure(e)}>
            ${f(`measure.${e}`)}</button>`)}
      </div>` : $}`;
}
function hl(n) {
  const { level: t, selection: e } = n;
  let i = $;
  if ((e == null ? void 0 : e.kind) === "wall") {
    const s = t.walls.find((r) => r.id === e.id);
    s && (i = al(s, n));
  } else if ((e == null ? void 0 : e.kind) === "opening") {
    const s = t.openings.find((r) => r.id === e.id);
    s && (i = ll(s, n));
  } else if ((e == null ? void 0 : e.kind) === "zone") {
    const s = t.zones.find((r) => r.id === e.id);
    s && (i = cl(s, n));
  } else if ((e == null ? void 0 : e.kind) === "node") {
    const s = t.nodes.find((r) => r.id === e.id);
    s && (i = m`<h4>${f("props.node")}</h4>
      ${I("X", m`<span class="val ro">${kt(s.x)}</span>`)}${I("Y", m`<span class="val ro">${kt(s.y)}</span>`)}`);
  }
  return m`
    <div class="props">
      ${i === $ && (n.tool === "wall" || n.tool === "box") ? dl(n) : i === $ && Fa(n.tool) ? qa({ tool: n.tool, level: t, next: n.next, setNext: n.setNext, setNotice: n.setNotice }) : i === $ ? m`<p class="muted">${f("props.none")}</p>` : i}
      ${n.notice ? m`<p class="warn">${n.notice}</p>` : $}
    </div>`;
}
function ul(n, t) {
  var e;
  return t.domains.includes(n.domain) ? t.deviceClasses ? n.deviceClass !== null ? t.deviceClasses.includes(n.deviceClass) : n.unit !== null && !!((e = t.units) != null && e.includes(n.unit)) : !0 : !1;
}
const hi = /* @__PURE__ */ new WeakMap();
function Ie(n, t, e) {
  let i = hi.get(n);
  i || hi.set(n, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const r = e ? 1 : 0;
  if (s[r]) return s[r];
  const o = [...n.entities.values()].filter((a) => e ? t.domains.includes(a.domain) : ul(a, t) && !a.hidden && !a.disabled && a.category === null);
  return o.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[r] = o, o;
}
const ui = /* @__PURE__ */ new WeakMap();
function pl(n, t) {
  let e = ui.get(n);
  e || ui.set(n, e = /* @__PURE__ */ new Map());
  const i = e.get(t);
  if (i) return i;
  const s = /* @__PURE__ */ new Set();
  for (const o of St[t]) for (const a of Ie(n, o, !1)) a.deviceId && s.add(a.deviceId);
  const r = [...s].map((o) => n.devices.get(o)).filter((o) => !!o).sort((o, a) => o.name.localeCompare(a.name) || o.id.localeCompare(a.id));
  return e.set(t, r), r;
}
function fl(n, t, e, i) {
  var l;
  const s = n.devices.find((c) => c.id === t), r = [], o = [];
  if (!s) return { level: n, filled: r, ambiguous: o };
  let a = n;
  for (const c of St[s.props.kind]) {
    if ((l = s.bindings) != null && l[c.role]) continue;
    const p = Ie(i, c, !1).filter((d) => d.deviceId === e);
    p.length === 1 ? (a = Ci(a, t, c.role, p[0].entityId), r.push(c.role)) : p.length > 1 && o.push(c.role);
  }
  return { level: a, filled: r, ambiguous: o };
}
function pi(n, t) {
  const e = n.entities.get(t), i = e != null && e.deviceId ? n.devices.get(e.deviceId) : void 0, s = (e == null ? void 0 : e.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, r = [s ? n.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((o) => !!o);
  return { name: (e == null ? void 0 : e.name) ?? t, context: r.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fi = (n) => n ?? $;
var gl = Object.defineProperty, ae = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && gl(t, e, s), s;
};
const ml = 100;
let vl = 0;
const Je = (n) => m`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${n}></path>`}</svg>`, bn = class bn extends Ct {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${vl++}`, this.shown = null, this.onOutside = (t) => {
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
    const t = [...this.rowDeps(), this.query.trim().toLowerCase()], e = this.shown;
    if (e && e.deps.length === t.length && e.deps.every((a, l) => a === t[l])) return e.value;
    const i = t[t.length - 1], s = [];
    let r = !1;
    for (const a of this.allRows())
      if (!(i && !a.search.includes(i))) {
        if (s.length === ml) {
          r = !0;
          break;
        }
        s.push(a);
      }
    const o = { rows: s, more: r };
    return this.shown = { deps: t, value: o }, o;
  }
  optId(t) {
    return `${this.uid}-opt-${t}`;
  }
  /** The active row index kept inside the rows (the rows can shrink while the list is open). */
  clamped(t) {
    return Math.min(this.active, Math.max(t.length - 1, 0));
  }
  onSearchKey(t) {
    const { rows: e } = this.filtered();
    if (t.key === "ArrowDown")
      t.preventDefault(), this.active = Math.max(0, Math.min(this.active + 1, e.length - 1)), this.scrollActive();
    else if (t.key === "ArrowUp")
      t.preventDefault(), this.active = Math.max(this.active - 1, 0), this.scrollActive();
    else if (t.key === "Enter") {
      t.preventDefault();
      const i = e[this.clamped(e)];
      i && this.pick(i.id);
    } else t.key === "Escape" && (t.preventDefault(), t.stopPropagation(), this.close(), this.focusBox());
  }
  onFocusOut(t) {
    var i;
    const e = t.relatedTarget;
    this.isOpen && !(e && ((i = this.shadowRoot) != null && i.contains(e))) && this.close();
  }
  scrollActive() {
    this.updateComplete.then(() => {
      var t, e;
      return (e = (t = this.renderRoot.querySelector(".opt.on")) == null ? void 0 : t.scrollIntoView) == null ? void 0 : e.call(t, { block: "nearest" });
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
    return m`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${fi(this.label || void 0)} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? m`<button class="x" type="button" title=${f("combo.clear")} aria-label=${f("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : $}</div>`;
  }
  renderDrop() {
    const { rows: t, more: e } = this.filtered(), i = this.clamped(t);
    return m`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${fi(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, r) => m`<div class="opt ${r === i ? "on" : ""}" id=${this.optId(r)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = r;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? m`<div class="empty">${this.emptyText()}</div>` : $}
      ${e ? m`<div class="hint">${f("combo.more")}</div>` : $}
    </div>`;
  }
  render() {
    return m`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : $}</div>`;
  }
};
bn.styles = xi`
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
let at = bn;
ae([
  J()
], at.prototype, "value");
ae([
  J()
], at.prototype, "label");
ae([
  L()
], at.prototype, "isOpen");
ae([
  L()
], at.prototype, "query");
ae([
  L()
], at.prototype, "active");
var yl = Object.defineProperty, vn = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && yl(t, e, s), s;
};
const bl = {
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
}, gi = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, $l = { light: "light", switch: "switch", event: "event", fan: "fan" };
function mi(n, t) {
  return n != null && n.deviceClass && gi[n.deviceClass] ? gi[n.deviceClass] : $l[(n == null ? void 0 : n.domain) ?? t.split(".")[0]] ?? "generic";
}
const vi = (n) => Je(bl[n]);
function wl(n) {
  switch (n) {
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
      return n;
  }
}
class Pe extends at {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: e, context: i } = pi(this.meta, t.entityId);
      yield { id: t.entityId, name: e, context: i, search: `${e}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, e = t ? pi(this.meta, t) : null;
    return m`${vi(t ? mi(this.meta.entities.get(t), t) : "generic")}
      ${e ? m`<span><b>${e.name}</b>${e.context !== e.name ? m`<small>${e.context}</small>` : $}</span>` : m`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: e, context: i }) {
    const s = os(this.states, t.entityId) ?? "unavailable";
    return m`${vi(mi(t, t.entityId))}
      <span><b>${e}</b><small>${i}</small></span>
      <span class="side">${wl(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  searchLabel() {
    return f("combo.search");
  }
  emptyText() {
    return f("combo.empty");
  }
}
vn([
  J({ attribute: !1 })
], Pe.prototype, "meta");
vn([
  J({ attribute: !1 })
], Pe.prototype, "items");
vn([
  J({ attribute: !1 })
], Pe.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Pe);
var xl = Object.defineProperty, yn = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && xl(t, e, s), s;
};
const yi = "M3,6H21V4H3C1.9,4 1,4.9 1,6V18A2,2 0 0,0 3,20H7V18H3V6M13,12H9V13.78C8.39,14.33 8,15.11 8,16C8,16.89 8.39,17.67 9,18.22V20H13V18.22C13.61,17.67 14,16.88 14,16C14,15.12 13.61,14.33 13,13.78V12M11,17.5A1.5,1.5 0 0,1 9.5,16A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 12.5,16A1.5,1.5 0 0,1 11,17.5M22,8H16A1,1 0 0,0 15,9V19A1,1 0 0,0 16,20H22A1,1 0 0,0 23,19V9A1,1 0 0,0 22,8M21,18H17V10H21V18Z";
class Ce extends at {
  constructor() {
    super(...arguments), this.devices = [], this.placeholder = "";
  }
  rowDeps() {
    return [this.devices, this.meta];
  }
  *allRows() {
    for (const t of this.devices) {
      const i = [t.areaId ? this.meta.areas.get(t.areaId) : void 0, t.model].filter((s) => !!s).join(" · ");
      yield { id: t.id, name: t.name, context: i, search: `${t.name}
${i}`.toLowerCase() };
    }
  }
  renderBox() {
    return m`${Je(yi)}<span class="ph">${this.placeholder}</span>`;
  }
  renderRow(t) {
    return m`${Je(yi)}<span><b>${t.name}</b>${t.context ? m`<small>${t.context}</small>` : $}</span>`;
  }
  searchLabel() {
    return f("combo.searchDevices");
  }
  emptyText() {
    return f("combo.emptyDevices");
  }
}
yn([
  J({ attribute: !1 })
], Ce.prototype, "meta");
yn([
  J({ attribute: !1 })
], Ce.prototype, "devices");
yn([
  J()
], Ce.prototype, "placeholder");
customElements.get("ps-device-combo") || customElements.define("ps-device-combo", Ce);
const we = (n) => f(`role.${n}`);
function kl(n, t) {
  if (n.length === 0 && t.length === 0) return f("binding.nothingToFill");
  const e = n.length ? f("binding.filled").replace("{roles}", n.map(we).join(", ")) : f("binding.nothingFilled");
  return t.length === 0 ? e : `${e}; ${f("binding.several").replace("{roles}", t.map((i) => `${we(i.role)} (${i.n})`).join(", "))}`;
}
function _l(n, t) {
  const e = pl(n.meta, t.props.kind), i = (s) => {
    const r = fl(n.level, t.id, s, n.meta), o = St[t.props.kind], a = r.ambiguous.map((l) => ({
      role: l,
      n: Ie(n.meta, o.find((c) => c.role === l), !1).filter((c) => c.deviceId === s).length
    }));
    r.level !== n.level && n.commit(r.level), n.setNotice(kl(r.filled, a));
  };
  return m`<div class="bfield"><span>${f("binding.haDevice")}</span>
    <ps-device-combo data-field="ha-device" .meta=${n.meta} .devices=${e} .label=${f("binding.haDevice")}
      .placeholder=${f(e.length ? "binding.haDevicePick" : "binding.haDeviceNone")}
      @value-changed=${(s) => {
    s.stopPropagation(), s.detail.value && i(s.detail.value);
  }}></ps-device-combo></div>`;
}
function Sl(n, t, e) {
  const i = as(n.meta, e, n.states), s = sr(n.level, e, t.id);
  return m`
    ${i === "missing" ? m`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : $}
    ${i === "unavailable" ? m`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : $}
    ${s.length ? m`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", s.map((r) => r.name).join(", "))}</p>` : $}`;
}
function El(n, t, e) {
  var o;
  const { role: i } = e, s = ((o = t.bindings) == null ? void 0 : o[i]) ?? null, r = !!n.showAll[i];
  return m`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${we(i)}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${r}
        @change=${() => n.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${n.meta} .states=${n.states} .items=${Ie(n.meta, e, r)} .value=${s}
      .label=${we(i)} @value-changed=${(a) => {
    a.stopPropagation();
    const l = Ci(n.level, t.id, i, a.detail.value);
    l !== n.level && (n.setNotice(null), n.commit(l));
  }}></ps-entity-combo>
    ${s ? Sl(n, t, s) : $}
  </div>`;
}
function Ml(n) {
  const t = n.device, e = n.level.devices.filter((i) => n.status(i) !== "bound").length;
  return m`<div class="props bprops">
    ${n.registryError ? m`<div class="reg-error" data-notice="registry"><p class="warn">${n.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${n.registryLoading}
        @click=${() => n.onRetry()}>${f(n.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${t ? m`
      <h4>${t.name}</h4>
      <p class="muted kind">${f(`device.${t.props.kind}`)}</p>
      ${_l(n, t)}
      ${n.notice ? m`<p class="note" data-notice="fill">${n.notice}</p>` : $}
      ${St[t.props.kind].map((i) => El(n, t, i))}` : m`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(e))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => n.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
  </div>`;
}
function Al(n, t) {
  return n.mode !== "binding" ? Ca(n.mode, n.toolId, (e) => n.pickTool(e)) : Ba({
    level: t,
    selection: n.selection,
    status: n.bindStatus,
    filter: n.bindFilter,
    query: n.bindQuery,
    onFilter: (e) => {
      n.bindFilter = e;
    },
    onQuery: (e) => {
      n.bindQuery = e;
    },
    onPick: (e) => n.pickDevice(e),
    collapsed: n.railCollapsed,
    onCollapse: (e) => {
      n.railCollapsed = e;
    }
  });
}
function Il(n, t) {
  var i;
  const e = n.selection;
  return Ml({
    level: t,
    device: (e == null ? void 0 : e.kind) === "device" ? t.devices.find((s) => s.id === e.id) ?? null : null,
    meta: n.haMeta.get(),
    states: (i = n.hass) == null ? void 0 : i.states,
    status: n.bindStatus,
    showAll: n.showAll,
    onShowAll: (s) => {
      n.showAll = { ...n.showAll, [s]: !n.showAll[s] };
    },
    commit: (s) => n.commit(s),
    onNextUnbound: () => n.nextUnboundDevice(),
    notice: n.notice,
    setNotice: (s) => {
      n.notice = s;
    },
    registryError: n.haMeta.error,
    registryLoading: n.haMeta.loading,
    onRetry: () => n.haMeta.retry()
  });
}
function Pl(n, t) {
  if (n.mode === "binding") return Il(n, t);
  const e = {
    level: t,
    selection: n.selection,
    notice: n.notice,
    commit: (i) => n.commit(i),
    setNotice: (i) => {
      n.notice = i;
    }
  };
  return n.mode === "equipment" ? ol({ ...e, toolId: n.toolId, nextProps: n.nextProps, setNextProps: (i) => {
    n.nextProps = i;
  } }) : hl({
    ...e,
    tool: n.toolId,
    boxMeasure: n.boxMeasure,
    wallType: n.wallType,
    thickness: n.thickness,
    next: n.nextObj,
    setNext: (i) => {
      n.nextObj = i;
    },
    setWallType: (i) => n.setWallType(i),
    setThickness: (i) => {
      n.thickness = i;
    },
    setBoxMeasure: (i) => {
      n.boxMeasure = i;
    }
  });
}
function Cl(n) {
  return m`
    <div class="status">
      ${n.binding ? $ : m`
        <span><span class="kbd">Shift</span> ${f("hint.shift")}</span>
        <span><span class="kbd">${f("hint.digits")}</span> ${f("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${f("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${f(n.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${n.snap ? m`<span class="snap-kind">${n.snap}</span>` : ""}
      <span>${n.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${n.grid} @change=${(t) => n.onGrid(t.target.checked)} />
        ${f("status.grid")}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${n.cones}
          @change=${(t) => n.onCones(t.target.checked)} />
        ${f("status.cones")}
      </label>
    </div>`;
}
function Ol(n, t) {
  var r, o;
  const e = t.palette, i = 1 / t.scale, s = [
    {
      label: f(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: n.first,
      live: ((r = t.live) == null ? void 0 : r.first) ?? "",
      active: n.field === "first",
      unit: f("unit.mm")
    },
    {
      label: f(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: n.second,
      live: ((o = t.live) == null ? void 0 : o.second) ?? "",
      active: n.field === "second",
      unit: t.mode === "box" ? f("unit.mm") : "°"
    }
  ];
  return _`
    <g class="tracker" transform=${`translate(${n.at.x + 18 * i} ${n.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${e.input} stroke=${e.inputBorder}></rect>
      ${s.map((a, l) => _`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${e.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${e.background}
          stroke=${a.active ? e.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? e.text : e.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function Nl(n, t, e, i) {
  const s = n.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: c } = s[0], p = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: kt(p), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const r = e === "inner" ? -i : e === "outer" ? i : 0, o = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + r, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + r;
  return { first: kt(o), second: kt(a) };
}
function Ll(n) {
  return Object.entries(n).filter(([, t]) => typeof t == "string").map(([t, e]) => `--ps-${t}:${e}`).join(";");
}
const Dl = xi`
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
  .bprops h4 { margin-bottom: 2px; font-size: 16px; }
  .bprops .kind { margin: 0 0 12px; }
  .bfield { display: flex; flex-direction: column; gap: 4px; margin: 0 0 6px; }
  .bfield > span, .role-label { color: var(--ch-muted); font-size: 12px; }
  .role { margin-top: 14px; }
  .role-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .showall { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--ch-muted); cursor: pointer; }
  .note { margin: 4px 0 0; color: var(--ch-muted); font-size: 12px; }
  .bprops .warn { margin: 4px 0 0; }
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
`, zl = 5e-3, Rl = 2, tn = (n) => Math.max(zl, Math.min(Rl, n));
function Tl(n, t, e) {
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
function Ul(n, t, e) {
  if (n.length === 0) return { x: -1e3, y: -1e3, scale: tn(Math.min(t, e) / 12e3) };
  const i = n.map((d) => d.x), s = n.map((d) => d.y), r = 1500, o = Math.min(...i) - r, a = Math.max(...i) + r, l = Math.min(...s) - r, c = Math.max(...s) + r, p = tn(Math.min(t / (a - o), e / (c - l)));
  return { x: (o + a) / 2 - t / p / 2, y: (l + c) / 2 - e / p / 2, scale: p };
}
function Bl(n, t, e) {
  const i = tn(n.scale * Math.exp(-e * 15e-4));
  return { x: t.x - (t.x - n.x) * n.scale / i, y: t.y - (t.y - n.y) * n.scale / i, scale: i };
}
function Hl(n, t, e) {
  return { ...n, x: n.x - t / n.scale, y: n.y - e / n.scale };
}
function jl(n, t, e, i) {
  const s = e / n.scale, r = i / n.scale;
  return t.x >= n.x && t.x <= n.x + s && t.y >= n.y && t.y <= n.y + r ? n : { ...n, x: t.x - s / 2, y: t.y - r / 2 };
}
function Fl(n, t, e, i) {
  const s = 100 * n.scale >= 6 ? 100 : 1e3, r = 1 / n.scale;
  return _`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${r}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${r}></path></pattern>
    </defs>
    <rect x=${n.x} y=${n.y} width=${t} height=${e} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const ql = ["Shift", "Control", "Alt", "Meta"];
function bi(n) {
  const t = n.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class Vl {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (e) => {
      var s, r;
      this.h.focus();
      const i = e.currentTarget;
      if (e.button === 1 || e.button === 0 && this.spaceDown) {
        e.preventDefault(), this.spacePending = !1, this.panFrom = { x: e.clientX, y: e.clientY }, (s = i.setPointerCapture) == null || s.call(i, e.pointerId);
        return;
      }
      e.button === 0 && ((r = i.setPointerCapture) == null || r.call(i, e.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(e)), this.h.requestUpdate());
    }, this.pointerMove = (e) => {
      if (this.panFrom) {
        this.h.view = Hl(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y), this.panFrom = { x: e.clientX, y: e.clientY };
        return;
      }
      this.h.activeTool.move(this.toolEvent(e)), this.h.requestUpdate();
    }, this.pointerUp = (e) => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      e.button !== 0 || !this.pointerActive || (this.pointerActive = !1, this.h.activeTool.up(this.toolEvent(e)), this.h.requestUpdate());
    }, this.pointerAbort = () => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      this.pointerActive && (this.pointerActive = !1, this.h.activeTool.preview().level && this.h.activeTool.cancel(), this.h.requestUpdate());
    }, this.wheel = (e) => {
      e.preventDefault(), this.h.view = Bl(this.h.view, this.h.toMm(e), e.deltaY);
    }, this.keyDown = (e) => {
      if (this.h.dialog !== null) {
        e.key === "Escape" && (e.preventDefault(), this.h.dialog = null);
        return;
      }
      if (bi(e) || !this.h.history) return;
      const i = e.ctrlKey || e.metaKey, s = e.code === "KeyZ" ? "z" : e.code === "KeyY" ? "y" : e.code === "KeyS" ? "s" : e.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        e.preventDefault(), s === "z" && !e.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && s === "s") {
        e.preventDefault(), this.h.doSave();
        return;
      }
      if (e.key === " ") {
        e.preventDefault(), !e.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      let r = this.h.activeTool.key(e.key, { shift: e.shiftKey });
      !r && (e.key === "Delete" || e.key === "Backspace") && (r = this.h.deleteSelection()), !r && e.key === "Escape" && (this.h.activeTool.cancel(), this.h.selection = null, r = !0), r && e.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (e) => {
      const i = this.h.dialog !== null || bi(e), s = { shift: e.shiftKey };
      if (e.key === " ") {
        this.spaceDown = !1;
        const r = this.spacePending;
        this.spacePending = !1, r && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !ql.includes(e.key) || (this.h.activeTool.key(e.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey };
  }
}
function Cs(n) {
  try {
    return new Date(n).toLocaleString();
  } catch {
    return new Date(n).toISOString();
  }
}
function Wl(n) {
  return m`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", Cs(n.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${n.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${n.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function Wt(n, t, e, i) {
  return m`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${n}</h3>
        <p>${t}</p>
        ${i ? m`<p class="muted">${i}</p>` : $}
        <div class="actions">
          ${e.map((s) => m`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Kl(n) {
  var e;
  const t = { action: "cancel", label: f("action.cancel"), onClick: n.close };
  switch ((e = n.dialog) == null ? void 0 : e.kind) {
    case "restore": {
      const i = n.draft;
      return i ? Wt(f("draft.title"), f("draft.text").replace("{time}", Cs(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => n.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => n.discard(i) }
      ]) : $;
    }
    case "new":
      return Wt(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: n.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return Wt(f("delete.title"), f("delete.text").replace("{name}", n.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: n.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return Wt(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: n.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = n.dialog.kind === "conflict-again";
      return Wt(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: n.saving, onClick: n.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: n.saving, onClick: n.saveAsNew },
        t
      ], n.message);
    }
    default:
      return $;
  }
}
const Kt = "plan_studio.draft.", ce = "plan_studio.lastPlanId";
function Zl() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Yl(n) {
  const t = n;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class Gl {
  constructor(t = Zl, e = 500) {
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
      (e = this.storage()) == null || e.setItem(Kt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var e;
    try {
      const i = (e = this.storage()) == null ? void 0 : e.getItem(Kt + t), s = i ? JSON.parse(i) : null;
      return Yl(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(Kt))) continue;
        const r = this.read(s.slice(Kt.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(ce)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var e;
    try {
      (e = this.storage()) == null || e.setItem(ce, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const e = this.storage();
      (e == null ? void 0 : e.getItem(ce)) === t && e.removeItem(ce);
    } catch {
    }
  }
  clear(t) {
    var e;
    try {
      (e = this.storage()) == null || e.removeItem(Kt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
var Xl = Object.defineProperty, D = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && Xl(t, e, s), s;
};
const $n = class $n extends Ct {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = ar.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.cones = !0, this.nextProps = Ga(), this.nextObj = Ha(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new Gl(), this.resizeObs = null, this.session = new Wa(this), this.haMeta = new Ka(this), this.bindStatus = (i) => nr(i, (s) => {
      var r;
      return as(this.haMeta.get(), s, (r = this.hass) == null ? void 0 : r.states);
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
    const t = this, e = {
      get connection() {
        return t.hass.connection;
      }
    };
    this.save = new Mo(e, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Za(this), this.activeTool = Xe("select", this.ctx), this.input = new Vl(this);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null;
  }
  willUpdate(t) {
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load(), this.needFit && this.size.w > 0 && this.size.h > 0 && (this.needFit = !1, this.fit());
  }
  updated() {
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((e) => {
      const i = e[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  // ---- editing ----
  commit(t) {
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !Be(t, this.selection) && (this.activeTool.cancel(), this.selection = null), this.requestUpdate());
  }
  /** Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the Binding step. */
  deleteSelection() {
    var i;
    const t = this.selection, e = (i = this.history) == null ? void 0 : i.current;
    return this.mode === "binding" || !t || !e || t.kind === "node" || !Be(e, t) ? !1 : (this.commit(t.kind === "wall" ? ss(e, t.id) : t.kind === "opening" ? ts(e, t.id) : t.kind === "device" ? Zi(e, t.id) : Xi(e, t.id)), !0);
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
  /** Undo / redo drop the selection, except in the Binding step, which keeps the selected device while it exists. */
  step(t) {
    var s;
    this.activeTool.cancel(), t() && this.save.markDirty();
    const e = this.selection, i = (s = this.history) == null ? void 0 : s.current;
    this.selection = this.mode === "binding" && e && i && Be(i, e) ? e : null, this.mode === "binding" && (this.notice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = Xe(t, this.ctx);
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(mn(t)[0]), t === "binding" && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    var r;
    const e = (r = this.history) == null ? void 0 : r.current, i = e == null ? void 0 : e.devices.find((o) => o.id === t);
    if (!e || !i) return;
    this.selection = { kind: "device", id: t }, this.notice = null;
    const s = Y(e, i);
    s && (this.view = jl(this.view, s.pt, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i, s;
    const t = (i = this.history) == null ? void 0 : i.current, e = t ? Ra(t, ((s = this.selection) == null ? void 0 : s.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    e && this.pickDevice(e);
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return Tl(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = Ul(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return Kl({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((t = this.plan) == null ? void 0 : t.name) ?? "",
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (e) => this.session.restoreDraft(e),
      discard: (e) => this.session.discardDraft(e),
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
      return m`<div class="center">${this.loadError ? m`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const t = sa(!!((d = (p = this.hass) == null ? void 0 : p.themes) != null && d.darkMode)), e = this.history.current, i = this.activeTool.preview(), { x: s, y: r, scale: o } = this.view, a = Math.max(1, this.size.w) / o, l = Math.max(1, this.size.h) / o, c = this.save;
    return m`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : ""}" style=${Ll(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Pa({
      steps: La({
        mode: this.mode,
        level: e,
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
      lead: this.narrow ? m`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (h) => this.session.pickPlan(h),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Al(this, e)}
        ${Pl(this, e)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${r} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(h) => h.preventDefault()}>
            ${this.grid ? Fl(this.view, a, l, t) : $}
            ${ea(e, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: o,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus
    })}
            ${i.tracker ? Ol(i.tracker, {
      palette: t,
      scale: o,
      mode: this.toolId === "box" ? "box" : "wall",
      live: Nl(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${this.pendingDraft && ((u = this.dialog) == null ? void 0 : u.kind) !== "restore" ? Wl({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${Cl({
      grid: this.grid,
      zoomPct: Math.round(o * 1e3),
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
$n.styles = Dl;
let C = $n;
D([
  J({ attribute: !1 })
], C.prototype, "hass");
D([
  J({ type: Boolean })
], C.prototype, "narrow");
D([
  J({ attribute: !1 })
], C.prototype, "panel");
D([
  L()
], C.prototype, "plan");
D([
  L()
], C.prototype, "loadError");
D([
  L()
], C.prototype, "selection");
D([
  L()
], C.prototype, "toolId");
D([
  L()
], C.prototype, "wallType");
D([
  L()
], C.prototype, "thickness");
D([
  L()
], C.prototype, "boxMeasure");
D([
  L()
], C.prototype, "grid");
D([
  L()
], C.prototype, "mode");
D([
  L()
], C.prototype, "bindFilter");
D([
  L()
], C.prototype, "bindQuery");
D([
  L()
], C.prototype, "railCollapsed");
D([
  L()
], C.prototype, "showAll");
D([
  L()
], C.prototype, "cones");
D([
  L()
], C.prototype, "nextProps");
D([
  L()
], C.prototype, "nextObj");
D([
  L()
], C.prototype, "view");
D([
  L()
], C.prototype, "size");
D([
  L()
], C.prototype, "dialog");
D([
  L()
], C.prototype, "notice");
D([
  L()
], C.prototype, "pendingDraft");
D([
  L()
], C.prototype, "plans");
D([
  L()
], C.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", C);
export {
  C as PlanStudioPanel
};
