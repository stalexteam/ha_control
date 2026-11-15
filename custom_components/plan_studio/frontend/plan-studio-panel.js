/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis, He = se.ShadowRoot && (se.ShadyCSS === void 0 || se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = Symbol(), sn = /* @__PURE__ */ new WeakMap();
let Yn = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== qe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (He && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = sn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && sn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ts = (n) => new Yn(typeof n == "string" ? n : n + "", void 0, qe), es = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[o + 1], n[0]);
  return new Yn(e, n, qe);
}, ns = (n, t) => {
  if (He) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = se.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, on = He ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return ts(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is, defineProperty: ss, getOwnPropertyDescriptor: os, getOwnPropertyNames: rs, getOwnPropertySymbols: ls, getPrototypeOf: as } = Object, dt = globalThis, rn = dt.trustedTypes, cs = rn ? rn.emptyScript : "", _e = dt.reactiveElementPolyfillSupport, Ft = (n, t) => n, ae = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? cs : null;
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
} }, We = (n, t) => !is(n, t), ln = { attribute: !0, type: String, converter: ae, reflect: !1, useDefault: !1, hasChanged: We };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), dt.litPropertyMetadata ?? (dt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let kt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ln) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && ss(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = os(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: s, set(r) {
      const l = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ln;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ft("elementProperties"))) return;
    const t = as(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ft("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ft("properties"))) {
      const e = this.properties, i = [...rs(e), ...ls(e)];
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
      for (const s of i) e.unshift(on(s));
    } else t !== void 0 && e.push(on(t));
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
    return ns(t, this.constructor.elementStyles), t;
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
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : ae).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : ae;
      this._$Em = s;
      const d = a.fromAttribute(e, l.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? We)(o, e) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, r] of s) {
        const { wrapped: l } = r, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
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
kt.elementStyles = [], kt.shadowRootOptions = { mode: "open" }, kt[Ft("elementProperties")] = /* @__PURE__ */ new Map(), kt[Ft("finalized")] = /* @__PURE__ */ new Map(), _e == null || _e({ ReactiveElement: kt }), (dt.reactiveElementVersions ?? (dt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = globalThis, an = (n) => n, ce = Ht.trustedTypes, cn = ce ? ce.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Gn = "$lit$", rt = `lit$${Math.random().toFixed(9).slice(2)}$`, Zn = "?" + rt, ds = `<${Zn}>`, xt = document, Kt = () => xt.createComment(""), Vt = (n) => n === null || typeof n != "object" && typeof n != "function", Ke = Array.isArray, hs = (n) => Ke(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", Ee = `[ 	
\f\r]`, Tt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dn = /-->/g, hn = />/g, mt = RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), un = /'/g, fn = /"/g, Xn = /^(?:script|style|textarea|title)$/i, Qn = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), b = Qn(1), S = Qn(2), ft = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), pn = /* @__PURE__ */ new WeakMap(), yt = xt.createTreeWalker(xt, 129);
function Jn(n, t) {
  if (!Ke(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return cn !== void 0 ? cn.createHTML(t) : t;
}
const us = (n, t) => {
  const e = n.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = Tt;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let d, f, c = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, f = r.exec(a), f !== null); ) u = r.lastIndex, r === Tt ? f[1] === "!--" ? r = dn : f[1] !== void 0 ? r = hn : f[2] !== void 0 ? (Xn.test(f[2]) && (s = RegExp("</" + f[2], "g")), r = mt) : f[3] !== void 0 && (r = mt) : r === mt ? f[0] === ">" ? (r = s ?? Tt, c = -1) : f[1] === void 0 ? c = -2 : (c = r.lastIndex - f[2].length, d = f[1], r = f[3] === void 0 ? mt : f[3] === '"' ? fn : un) : r === fn || r === un ? r = mt : r === dn || r === hn ? r = Tt : (r = mt, s = void 0);
    const h = r === mt && n[l + 1].startsWith("/>") ? " " : "";
    o += r === Tt ? a + ds : c >= 0 ? (i.push(d), a.slice(0, c) + Gn + a.slice(c) + rt + h) : a + rt + (c === -2 ? l : h);
  }
  return [Jn(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Yt {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [d, f] = us(t, e);
    if (this.el = Yt.createElement(d, i), yt.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = yt.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Gn)) {
          const u = f[r++], h = s.getAttribute(c).split(rt), g = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: g[2], strings: h, ctor: g[1] === "." ? ps : g[1] === "?" ? gs : g[1] === "@" ? ms : me }), s.removeAttribute(c);
        } else c.startsWith(rt) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (Xn.test(s.tagName)) {
          const c = s.textContent.split(rt), u = c.length - 1;
          if (u > 0) {
            s.textContent = ce ? ce.emptyScript : "";
            for (let h = 0; h < u; h++) s.append(c[h], Kt()), yt.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[u], Kt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Zn) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(rt, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += rt.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = xt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function St(n, t, e = n, i) {
  var r, l;
  if (t === ft) return t;
  let s = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const o = Vt(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = St(n, s._$AS(n, t.values), s, i)), t;
}
class fs {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? xt).importNode(e, !0);
    yt.currentNode = s;
    let o = yt.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new Ve(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new ys(o, this, t)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = yt.nextNode(), r++);
    }
    return yt.currentNode = xt, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
let Ve = class ti {
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
    t = St(this, t, e), Vt(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== ft && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : hs(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && Vt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(xt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Yt.createElement(Jn(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const r = new fs(s, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = pn.get(t.strings);
    return e === void 0 && pn.set(t.strings, e = new Yt(t)), e;
  }
  k(t) {
    Ke(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new ti(this.O(Kt()), this.O(Kt()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = an(t).nextSibling;
      an(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
};
class me {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = St(this, t, e, 0), r = !Vt(t) || t !== this._$AH && t !== ft, r && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = St(this, l[i + a], e, a), d === ft && (d = this._$AH[a]), r || (r = !Vt(d) || d !== this._$AH[a]), d === v ? t = v : t !== v && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ps extends me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class gs extends me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
let ms = class extends me {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = St(this, t, e, 0) ?? v) === ft) return;
    const i = this._$AH, s = t === v && i !== v || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class ys {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    St(this, t);
  }
}
const Se = Ht.litHtmlPolyfillSupport;
Se == null || Se(Yt, Ve), (Ht.litHtmlVersions ?? (Ht.litHtmlVersions = [])).push("3.3.3");
const $s = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new Ve(t.insertBefore(Kt(), o), o, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = globalThis;
let qt = class extends kt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = $s(e, this.renderRoot, this.renderOptions);
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
    return ft;
  }
};
var Vn;
qt._$litElement$ = !0, qt.finalized = !0, (Vn = wt.litElementHydrateSupport) == null || Vn.call(wt, { LitElement: qt });
const Me = wt.litElementPolyfillSupport;
Me == null || Me({ LitElement: qt });
(wt.litElementVersions ?? (wt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ws = { attribute: !0, type: String, converter: ae, reflect: !1, hasChanged: We }, vs = (n = ws, t, e) => {
  const { kind: i, metadata: s } = e;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), o.set(e.name, n), i === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ye(n) {
  return (t, e) => typeof e == "object" ? vs(n, t, e) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function U(n) {
  return ye({ ...n, state: !0, attribute: !1 });
}
function J() {
  const n = new Uint8Array(6);
  return crypto.getRandomValues(n), Array.from(n, (t) => t.toString(16).padStart(2, "0")).join("");
}
function ei(n, t) {
  const e = new Set(t);
  let i = 1;
  for (; e.has(`${n} ${i}`); ) i++;
  return `${n} ${i}`;
}
const xs = [100, 125, 150], bs = {
  bearing: 400
}, oe = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function ni(n = J(), t = "Level 1") {
  return { id: n, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function gn(n) {
  return {
    id: J(),
    name: n,
    schemaVersion: 1,
    revision: 0,
    levels: [ni()]
  };
}
const Ye = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  switch: ["wall"],
  socket: ["wall"],
  equipment: ["free"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, Mt = 90, ii = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ne(n, t) {
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
      return { kind: n, shape: "rect", width: 600, depth: 600, diameter: 600, symbol: "other", label: "" };
    default:
      return { kind: n };
  }
}
function ks(n) {
  return n.devices ? n : { ...n, devices: [] };
}
function M(n, t) {
  return { x: n.x + t.x, y: n.y + t.y };
}
function I(n, t) {
  return { x: n.x - t.x, y: n.y - t.y };
}
function k(n, t) {
  return { x: n.x * t, y: n.y * t };
}
function W(n, t) {
  return n.x * t.x + n.y * t.y;
}
function It(n, t) {
  return n.x * t.y - n.y * t.x;
}
function si(n) {
  return Math.hypot(n.x, n.y);
}
function z(n, t) {
  return si(I(t, n));
}
function Ge(n) {
  const t = si(n);
  return t === 0 ? { x: 0, y: 0 } : k(n, 1 / t);
}
function V(n) {
  return { x: n.y, y: -n.x };
}
function _s(n, t, e) {
  return { x: n.x + (t.x - n.x) * e, y: n.y + (t.y - n.y) * e };
}
function at(n, t, e, i) {
  const s = It(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = It(I(e, n), i) / s;
  return M(n, k(t, o));
}
function oi(n, t, e) {
  const i = I(e, t), s = W(i, i);
  return s === 0 ? 0 : W(I(n, t), i) / s;
}
function te(n, t) {
  let e = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > n.y != r.y > n.y && n.x < (r.x - o.x) * (n.y - o.y) / (r.y - o.y) + o.x && (e = !e);
  }
  return e;
}
function At(n) {
  let t = 0;
  for (let e = 0; e < n.length; e++) {
    const i = n[e], s = n[(e + 1) % n.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
class pt {
  constructor(t, e) {
    this.next = null, this.key = t, this.data = e, this.left = null, this.right = null;
  }
}
function Es(n, t) {
  return n > t ? 1 : n < t ? -1 : 0;
}
function lt(n, t, e) {
  const i = new pt(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = e(n, t.key);
    if (r < 0) {
      if (t.left === null) break;
      if (e(n, t.left.key) < 0) {
        const l = t.left;
        if (t.left = l.right, l.right = t, t = l, t.left === null) break;
      }
      o.left = t, o = t, t = t.left;
    } else if (r > 0) {
      if (t.right === null) break;
      if (e(n, t.right.key) > 0) {
        const l = t.right;
        if (t.right = l.left, l.left = t, t = l, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, o.left = t.right, t.left = i.right, t.right = i.left, t;
}
function Ie(n, t, e, i) {
  const s = new pt(n, t);
  if (e === null)
    return s.left = s.right = null, s;
  e = lt(n, e, i);
  const o = i(n, e.key);
  return o < 0 ? (s.left = e.left, s.right = e, e.left = null) : o >= 0 && (s.right = e.right, s.left = e, e.right = null), s;
}
function mn(n, t, e) {
  let i = null, s = null;
  if (t) {
    t = lt(n, t, e);
    const o = e(t.key, n);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function Ss(n, t, e) {
  return t === null ? n : (n === null || (t = lt(n.key, t, e), t.left = n), t);
}
function De(n, t, e, i, s) {
  if (n) {
    i(`${t}${e ? "└── " : "├── "}${s(n)}
`);
    const o = t + (e ? "    " : "│   ");
    n.left && De(n.left, o, !1, i, s), n.right && De(n.right, o, !0, i, s);
  }
}
class Ze {
  constructor(t = Es) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, e) {
    return this._size++, this._root = Ie(t, e, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, e) {
    const i = new pt(t, e);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = lt(t, this._root, s), r = s(t, o.key);
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
  _remove(t, e, i) {
    let s;
    return e === null ? null : (e = lt(t, e, i), i(t, e.key) === 0 ? (e.left === null ? s = e.right : (s = lt(t, e.left, i), s.right = e.right), this._size--, s) : e);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = lt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = lt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    let o = !1;
    for (; !o; )
      i !== null ? (s.push(i), i = i.left) : s.length !== 0 ? (i = s.pop(), t.call(e, i), i = i.right) : o = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(t, e, i, s) {
    const o = [], r = this._comparator;
    let l = this._root, a;
    for (; o.length !== 0 || l; )
      if (l)
        o.push(l), l = l.left;
      else {
        if (l = o.pop(), a = r(l.key, e), a > 0)
          break;
        if (r(l.key, t) >= 0 && i.call(s, l))
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
    const o = [];
    for (; !i; )
      if (e)
        o.push(e), e = e.left;
      else if (o.length > 0) {
        if (e = o.pop(), s === t) return e;
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
      const o = s(t.key, e.key);
      if (o === 0) break;
      o < 0 ? (i = e, e = e.left) : e = e.right;
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
      const o = s(t.key, e.key);
      if (o === 0) break;
      o < 0 ? e = e.left : (i = e, e = e.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Is(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, e = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && Re(t, e, 0, s - 1, o), this._root === null)
      this._root = ze(t, e, 0, s), this._size = s;
    else {
      const r = As(
        this.toList(),
        Ms(t, e),
        o
      );
      s = this._size + s, this._root = Ce({ head: r }, 0, s);
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
    return De(this._root, "", !0, (i) => e.push(i), t), e.join("");
  }
  update(t, e, i) {
    const s = this._comparator;
    let { left: o, right: r } = mn(t, this._root, s);
    s(t, e) < 0 ? r = Ie(e, i, r, s) : o = Ie(e, i, o, s), this._root = Ss(o, r, s);
  }
  split(t) {
    return mn(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const e = [];
    let i = !1;
    for (; !i; )
      t !== null ? (e.push(t), t = t.left) : e.length !== 0 ? (t = e.pop(), yield t, t = t.right) : i = !0;
  }
}
function ze(n, t, e, i) {
  const s = i - e;
  if (s > 0) {
    const o = e + Math.floor(s / 2), r = n[o], l = t[o], a = new pt(r, l);
    return a.left = ze(n, t, e, o), a.right = ze(n, t, o + 1, i), a;
  }
  return null;
}
function Ms(n, t) {
  const e = new pt(null, null);
  let i = e;
  for (let s = 0; s < n.length; s++)
    i = i.next = new pt(n[s], t[s]);
  return i.next = null, e.next;
}
function Is(n) {
  let t = n;
  const e = [];
  let i = !1;
  const s = new pt(null, null);
  let o = s;
  for (; !i; )
    t ? (e.push(t), t = t.left) : e.length > 0 ? (t = o = o.next = e.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function Ce(n, t, e) {
  const i = e - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = Ce(n, t, s), r = n.head;
    return r.left = o, n.head = n.head.next, r.right = Ce(n, s + 1, e), r;
  }
  return null;
}
function As(n, t, e) {
  const i = new pt(null, null);
  let s = i, o = n, r = t;
  for (; o !== null && r !== null; )
    e(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function Re(n, t, e, i, s) {
  if (e >= i) return;
  const o = n[e + i >> 1];
  let r = e - 1, l = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(n[r], o) < 0);
    do
      l--;
    while (s(n[l], o) > 0);
    if (r >= l) break;
    let a = n[r];
    n[r] = n[l], n[l] = a, a = t[r], t[r] = t[l], t[l] = a;
  }
  Re(n, t, e, l, s), Re(n, t, l + 1, i, s);
}
const it = 11102230246251565e-32, j = 134217729, Ps = (3 + 8 * it) * it;
function Ae(n, t, e, i, s) {
  let o, r, l, a, d = t[0], f = i[0], c = 0, u = 0;
  f > d == f > -d ? (o = d, d = t[++c]) : (o = f, f = i[++u]);
  let h = 0;
  if (c < n && u < e)
    for (f > d == f > -d ? (r = d + o, l = o - (r - d), d = t[++c]) : (r = f + o, l = o - (r - f), f = i[++u]), o = r, l !== 0 && (s[h++] = l); c < n && u < e; )
      f > d == f > -d ? (r = o + d, a = r - o, l = o - (r - a) + (d - a), d = t[++c]) : (r = o + f, a = r - o, l = o - (r - a) + (f - a), f = i[++u]), o = r, l !== 0 && (s[h++] = l);
  for (; c < n; )
    r = o + d, a = r - o, l = o - (r - a) + (d - a), d = t[++c], o = r, l !== 0 && (s[h++] = l);
  for (; u < e; )
    r = o + f, a = r - o, l = o - (r - a) + (f - a), f = i[++u], o = r, l !== 0 && (s[h++] = l);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function Os(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function $(n) {
  return new Float64Array(n);
}
const Ns = (3 + 16 * it) * it, Ds = (2 + 12 * it) * it, zs = (9 + 64 * it) * it * it, bt = $(4), yn = $(8), $n = $(12), wn = $(16), q = $(4);
function Cs(n, t, e, i, s, o, r) {
  let l, a, d, f, c, u, h, g, m, w, y, x, _, E, P, N, D, O;
  const B = n - s, F = e - s, H = t - o, X = i - o;
  E = B * X, u = j * B, h = u - (u - B), g = B - h, u = j * X, m = u - (u - X), w = X - m, P = g * w - (E - h * m - g * m - h * w), N = H * F, u = j * H, h = u - (u - H), g = H - h, u = j * F, m = u - (u - F), w = F - m, D = g * w - (N - h * m - g * m - h * w), y = P - D, c = P - y, bt[0] = P - (y + c) + (c - D), x = E + y, c = x - E, _ = E - (x - c) + (y - c), y = _ - N, c = _ - y, bt[1] = _ - (y + c) + (c - N), O = x + y, c = O - x, bt[2] = x - (O - c) + (y - c), bt[3] = O;
  let nt = Os(4, bt), Rt = Ds * r;
  if (nt >= Rt || -nt >= Rt || (c = n - B, l = n - (B + c) + (c - s), c = e - F, d = e - (F + c) + (c - s), c = t - H, a = t - (H + c) + (c - o), c = i - X, f = i - (X + c) + (c - o), l === 0 && a === 0 && d === 0 && f === 0) || (Rt = zs * r + Ps * Math.abs(nt), nt += B * f + X * l - (H * d + F * a), nt >= Rt || -nt >= Rt)) return nt;
  E = l * X, u = j * l, h = u - (u - l), g = l - h, u = j * X, m = u - (u - X), w = X - m, P = g * w - (E - h * m - g * m - h * w), N = a * F, u = j * a, h = u - (u - a), g = a - h, u = j * F, m = u - (u - F), w = F - m, D = g * w - (N - h * m - g * m - h * w), y = P - D, c = P - y, q[0] = P - (y + c) + (c - D), x = E + y, c = x - E, _ = E - (x - c) + (y - c), y = _ - N, c = _ - y, q[1] = _ - (y + c) + (c - N), O = x + y, c = O - x, q[2] = x - (O - c) + (y - c), q[3] = O;
  const Xi = Ae(4, bt, 4, q, yn);
  E = B * f, u = j * B, h = u - (u - B), g = B - h, u = j * f, m = u - (u - f), w = f - m, P = g * w - (E - h * m - g * m - h * w), N = H * d, u = j * H, h = u - (u - H), g = H - h, u = j * d, m = u - (u - d), w = d - m, D = g * w - (N - h * m - g * m - h * w), y = P - D, c = P - y, q[0] = P - (y + c) + (c - D), x = E + y, c = x - E, _ = E - (x - c) + (y - c), y = _ - N, c = _ - y, q[1] = _ - (y + c) + (c - N), O = x + y, c = O - x, q[2] = x - (O - c) + (y - c), q[3] = O;
  const Qi = Ae(Xi, yn, 4, q, $n);
  E = l * f, u = j * l, h = u - (u - l), g = l - h, u = j * f, m = u - (u - f), w = f - m, P = g * w - (E - h * m - g * m - h * w), N = a * d, u = j * a, h = u - (u - a), g = a - h, u = j * d, m = u - (u - d), w = d - m, D = g * w - (N - h * m - g * m - h * w), y = P - D, c = P - y, q[0] = P - (y + c) + (c - D), x = E + y, c = x - E, _ = E - (x - c) + (y - c), y = _ - N, c = _ - y, q[1] = _ - (y + c) + (c - N), O = x + y, c = O - x, q[2] = x - (O - c) + (y - c), q[3] = O;
  const Ji = Ae(Qi, $n, 4, q, wn);
  return wn[Ji - 1];
}
function Rs(n, t, e, i, s, o) {
  const r = (t - o) * (e - s), l = (n - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= Ns * d ? a : -Cs(n, t, e, i, s, o, d);
}
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(8);
$(8);
$(8);
$(4);
$(8);
$(8);
$(16);
$(12);
$(192);
$(192);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(8);
$(8);
$(8);
$(8);
$(8);
$(8);
$(8);
$(8);
$(8);
$(4);
$(4);
$(4);
$(8);
$(16);
$(16);
$(16);
$(32);
$(32);
$(48);
$(64);
$(1152);
$(1152);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(4);
$(24);
$(24);
$(24);
$(24);
$(24);
$(24);
$(24);
$(24);
$(24);
$(24);
$(1152);
$(1152);
$(1152);
$(1152);
$(1152);
$(2304);
$(2304);
$(3456);
$(5760);
$(8);
$(8);
$(8);
$(16);
$(24);
$(48);
$(48);
$(96);
$(192);
$(384);
$(384);
$(384);
$(768);
$(96);
$(96);
$(96);
$(1152);
const Lt = (n, t) => n.ll.x <= t.x && t.x <= n.ur.x && n.ll.y <= t.y && t.y <= n.ur.y, Te = (n, t) => {
  if (t.ur.x < n.ll.x || n.ur.x < t.ll.x || t.ur.y < n.ll.y || n.ur.y < t.ll.y) return null;
  const e = n.ll.x < t.ll.x ? t.ll.x : n.ll.x, i = n.ur.x < t.ur.x ? n.ur.x : t.ur.x, s = n.ll.y < t.ll.y ? t.ll.y : n.ll.y, o = n.ur.y < t.ur.y ? n.ur.y : t.ur.y;
  return {
    ll: {
      x: e,
      y: s
    },
    ur: {
      x: i,
      y: o
    }
  };
};
let ct = Number.EPSILON;
ct === void 0 && (ct = Math.pow(2, -52));
const Ts = ct * ct, vn = (n, t) => {
  if (-ct < n && n < ct && -ct < t && t < ct)
    return 0;
  const e = n - t;
  return e * e < Ts * n * t ? 0 : n < t ? -1 : 1;
};
class Ls {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new xn(), this.yRounder = new xn();
  }
  round(t, e) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(e)
    };
  }
}
class xn {
  constructor() {
    this.tree = new Ze(), this.round(0);
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
    if (i !== null && vn(e.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(e);
    return s !== null && vn(e.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const Gt = new Ls(), re = (n, t) => n.x * t.y - n.y * t.x, ri = (n, t) => n.x * t.x + n.y * t.y, bn = (n, t, e) => {
  const i = Rs(n.x, n.y, t.x, t.y, e.x, e.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, de = (n) => Math.sqrt(ri(n, n)), Us = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return re(s, i) / de(s) / de(i);
}, Bs = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return ri(s, i) / de(s) / de(i);
}, kn = (n, t, e) => t.y === 0 ? null : {
  x: n.x + t.x / t.y * (e - n.y),
  y: e
}, _n = (n, t, e) => t.x === 0 ? null : {
  x: e,
  y: n.y + t.y / t.x * (e - n.x)
}, js = (n, t, e, i) => {
  if (t.x === 0) return _n(e, i, n.x);
  if (i.x === 0) return _n(n, t, e.x);
  if (t.y === 0) return kn(e, i, n.y);
  if (i.y === 0) return kn(n, t, e.y);
  const s = re(t, i);
  if (s == 0) return null;
  const o = {
    x: e.x - n.x,
    y: e.y - n.y
  }, r = re(o, t) / s, l = re(o, i) / s, a = n.x + l * t.x, d = e.x + r * i.x, f = n.y + l * t.y, c = e.y + r * i.y, u = (a + d) / 2, h = (f + c) / 2;
  return {
    x: u,
    y: h
  };
};
class G {
  // for ordering sweep events in the sweep event queue
  static compare(t, e) {
    const i = G.comparePoints(t.point, e.point);
    return i !== 0 ? i : (t.point !== e.point && t.link(e), t.isLeft !== e.isLeft ? t.isLeft ? 1 : -1 : ht.compare(t.segment, e.segment));
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
      const o = e[i];
      this.point.events.push(o), o.point = this.point;
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
          const o = this.point.events[s];
          o.consumedBy === void 0 && i.otherSE.point.events === o.otherSE.point.events && i.segment.consume(o.segment);
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
      const o = s.otherSE;
      e.set(s, {
        sine: Us(this.point, t.point, o.point),
        cosine: Bs(this.point, t.point, o.point)
      });
    };
    return (s, o) => {
      e.has(s) || i(s), e.has(o) || i(o);
      const {
        sine: r,
        cosine: l
      } = e.get(s), {
        sine: a,
        cosine: d
      } = e.get(o);
      return r >= 0 && a >= 0 ? l < d ? 1 : l > d ? -1 : 0 : r < 0 && a < 0 ? l < d ? -1 : l > d ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let Fs = 0;
class ht {
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
    const i = t.leftSE.point.x, s = e.leftSE.point.x, o = t.rightSE.point.x, r = e.rightSE.point.x;
    if (r < i) return 1;
    if (o < s) return -1;
    const l = t.leftSE.point.y, a = e.leftSE.point.y, d = t.rightSE.point.y, f = e.rightSE.point.y;
    if (i < s) {
      if (a < l && a < d) return 1;
      if (a > l && a > d) return -1;
      const c = t.comparePoint(e.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const u = e.comparePoint(t.rightSE.point);
      return u !== 0 ? u : -1;
    }
    if (i > s) {
      if (l < a && l < f) return -1;
      if (l > a && l > f) return 1;
      const c = e.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const u = t.comparePoint(e.rightSE.point);
      return u < 0 ? 1 : u > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (o < r) {
      const c = e.comparePoint(t.rightSE.point);
      if (c !== 0) return c;
    }
    if (o > r) {
      const c = t.comparePoint(e.rightSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
    }
    if (o !== r) {
      const c = d - l, u = o - i, h = f - a, g = r - s;
      if (c > u && h < g) return 1;
      if (c < u && h > g) return -1;
    }
    return o > r ? 1 : o < r || d < f ? -1 : d > f ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, e, i, s) {
    this.id = ++Fs, this.leftSE = t, t.segment = this, t.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, e, i) {
    let s, o, r;
    const l = G.comparePoints(t, e);
    if (l < 0)
      s = t, o = e, r = 1;
    else if (l > 0)
      s = e, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const a = new G(s, !0), d = new G(o, !1);
    return new ht(a, d, [i], [r]);
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
    const o = (t.y - e.y) / s.y, r = e.x + o * s.x;
    if (t.x === r) return 0;
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
    const e = this.bbox(), i = t.bbox(), s = Te(e, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = t.leftSE.point, a = t.rightSE.point, d = Lt(e, l) && this.comparePoint(l) === 0, f = Lt(i, o) && t.comparePoint(o) === 0, c = Lt(e, a) && this.comparePoint(a) === 0, u = Lt(i, r) && t.comparePoint(r) === 0;
    if (f && d)
      return u && !c ? r : !u && c ? a : null;
    if (f)
      return c && o.x === a.x && o.y === a.y ? null : o;
    if (d)
      return u && r.x === l.x && r.y === l.y ? null : l;
    if (u && c) return null;
    if (u) return r;
    if (c) return a;
    const h = js(o, this.vector(), l, t.vector());
    return h === null || !Lt(s, h) ? null : Gt.round(h.x, h.y);
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
    const e = [], i = t.events !== void 0, s = new G(t, !0), o = new G(t, !1), r = this.rightSE;
    this.replaceRightSE(o), e.push(o), e.push(s);
    const l = new ht(s, r, this.rings.slice(), this.windings.slice());
    return G.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), G.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), e;
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
    const s = ht.compare(e, i);
    if (s !== 0) {
      if (s > 0) {
        const o = e;
        e = i, i = o;
      }
      if (e.prev === i) {
        const o = e;
        e = i, i = o;
      }
      for (let o = 0, r = i.rings.length; o < r; o++) {
        const l = i.rings[o], a = i.windings[o], d = e.rings.indexOf(l);
        d === -1 ? (e.rings.push(l), e.windings.push(a)) : e.windings[d] += a;
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
      const d = this.rings[l], f = this.windings[l], c = e.indexOf(d);
      c === -1 ? (e.push(d), i.push(f)) : i[c] += f;
    }
    const o = [], r = [];
    for (let l = 0, a = e.length; l < a; l++) {
      if (i[l] === 0) continue;
      const d = e[l], f = d.poly;
      if (r.indexOf(f) === -1)
        if (d.isExterior) o.push(f);
        else {
          r.indexOf(f) === -1 && r.push(f);
          const c = o.indexOf(d.poly);
          c !== -1 && o.splice(c, 1);
        }
    }
    for (let l = 0, a = o.length; l < a; l++) {
      const d = o[l].multiPoly;
      s.indexOf(d) === -1 && s.push(d);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const t = this.beforeState().multiPolys, e = this.afterState().multiPolys;
    switch (Q.type) {
      case "union": {
        const i = t.length === 0, s = e.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < e.length ? (i = t.length, s = e.length) : (i = e.length, s = t.length), this._isInResult = s === Q.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${Q.type}`);
    }
    return this._isInResult;
  }
}
class En {
  constructor(t, e, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = e, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Gt.round(t[0][0], t[0][1]);
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
    for (let r = 1, l = t.length; r < l; r++) {
      if (typeof t[r][0] != "number" || typeof t[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let a = Gt.round(t[r][0], t[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(ht.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(ht.fromRing(o, s, this));
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
class Hs {
  constructor(t, e) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new En(t[0], this, !0), this.bbox = {
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
      const o = new En(t[i], this, !1);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.interiorRings.push(o);
    }
    this.multiPoly = e;
  }
  getSweepEvents() {
    const t = this.exteriorRing.getSweepEvents();
    for (let e = 0, i = this.interiorRings.length; e < i; e++) {
      const s = this.interiorRings[e].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class Sn {
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
      const o = new Hs(t[i], this);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.polys.push(o);
    }
    this.isSubject = e;
  }
  getSweepEvents() {
    const t = [];
    for (let e = 0, i = this.polys.length; e < i; e++) {
      const s = this.polys[e].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class he {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const e = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const d = [l], f = l.point, c = [];
      for (; r = l, l = a, d.push(l), l.point !== f; )
        for (; ; ) {
          const u = l.getAvailableLinkedEvents();
          if (u.length === 0) {
            const m = d[0].point, w = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${m.x}, ${m.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (u.length === 1) {
            a = u[0].otherSE;
            break;
          }
          let h = null;
          for (let m = 0, w = c.length; m < w; m++)
            if (c[m].point === l.point) {
              h = m;
              break;
            }
          if (h !== null) {
            const m = c.splice(h)[0], w = d.splice(m.index);
            w.unshift(w[0].otherSE), e.push(new he(w.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: l.point
          });
          const g = l.getLeftmostComparator(r);
          a = u.sort(g)[0].otherSE;
          break;
        }
      e.push(new he(d));
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
    for (let d = 1, f = this.events.length - 1; d < f; d++) {
      const c = this.events[d].point, u = this.events[d + 1].point;
      bn(c, t, u) !== 0 && (e.push(c), t = c);
    }
    if (e.length === 1) return null;
    const i = e[0], s = e[1];
    bn(i, t, s) === 0 && e.shift(), e.push(e[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : e.length - 1, l = this.isExteriorRing() ? e.length : -1, a = [];
    for (let d = r; d != l; d += o) a.push([e[d].x, e[d].y]);
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
    for (let s = 1, o = this.events.length; s < o; s++) {
      const r = this.events[s];
      G.compare(t, r) > 0 && (t = r);
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
class Mn {
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
class qs {
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
      const o = t[i];
      if (!o.poly)
        if (o.isExteriorRing()) e.push(new Mn(o));
        else {
          const r = o.enclosingRing();
          r.poly || e.push(new Mn(r)), r.poly.addInterior(o);
        }
    }
    return e;
  }
}
class Ws {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ht.compare;
    this.queue = t, this.tree = new Ze(e), this.segments = [];
  }
  process(t) {
    const e = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(e), i;
    const s = t.isLeft ? this.tree.add(e) : this.tree.find(e);
    if (!s) throw new Error(`Unable to find segment #${e.id} [${e.leftSE.point.x}, ${e.leftSE.point.y}] -> [${e.rightSE.point.x}, ${e.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, l, a;
    for (; l === void 0; )
      o = this.tree.prev(o), o === null ? l = null : o.key.consumedBy === void 0 && (l = o.key);
    for (; a === void 0; )
      r = this.tree.next(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    if (t.isLeft) {
      let d = null;
      if (l) {
        const c = l.getIntersection(e);
        if (c !== null && (e.isAnEndpoint(c) || (d = c), !l.isAnEndpoint(c))) {
          const u = this._splitSafely(l, c);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      let f = null;
      if (a) {
        const c = a.getIntersection(e);
        if (c !== null && (e.isAnEndpoint(c) || (f = c), !a.isAnEndpoint(c))) {
          const u = this._splitSafely(a, c);
          for (let h = 0, g = u.length; h < g; h++)
            i.push(u[h]);
        }
      }
      if (d !== null || f !== null) {
        let c = null;
        d === null ? c = f : f === null ? c = d : c = G.comparePoints(d, f) <= 0 ? d : f, this.queue.remove(e.rightSE), i.push(e.rightSE);
        const u = e.split(c);
        for (let h = 0, g = u.length; h < g; h++)
          i.push(u[h]);
      }
      i.length > 0 ? (this.tree.remove(e), i.push(t)) : (this.segments.push(e), e.prev = l);
    } else {
      if (l && a) {
        const d = l.getIntersection(a);
        if (d !== null) {
          if (!l.isAnEndpoint(d)) {
            const f = this._splitSafely(l, d);
            for (let c = 0, u = f.length; c < u; c++)
              i.push(f[c]);
          }
          if (!a.isAnEndpoint(d)) {
            const f = this._splitSafely(a, d);
            for (let c = 0, u = f.length; c < u; c++)
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
const In = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Ks = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Vs {
  run(t, e, i) {
    Q.type = t, Gt.reset();
    const s = [new Sn(e, !0)];
    for (let c = 0, u = i.length; c < u; c++)
      s.push(new Sn(i[c], !1));
    if (Q.numMultiPolys = s.length, Q.type === "difference") {
      const c = s[0];
      let u = 1;
      for (; u < s.length; )
        Te(s[u].bbox, c.bbox) !== null ? u++ : s.splice(u, 1);
    }
    if (Q.type === "intersection")
      for (let c = 0, u = s.length; c < u; c++) {
        const h = s[c];
        for (let g = c + 1, m = s.length; g < m; g++)
          if (Te(h.bbox, s[g].bbox) === null) return [];
      }
    const o = new Ze(G.compare);
    for (let c = 0, u = s.length; c < u; c++) {
      const h = s[c].getSweepEvents();
      for (let g = 0, m = h.length; g < m; g++)
        if (o.insert(h[g]), o.size > In)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Ws(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > In)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Ks)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const u = r.process(c);
      for (let h = 0, g = u.length; h < g; h++) {
        const m = u[h];
        m.consumedBy === void 0 && o.insert(m);
      }
      l = o.size, a = o.pop();
    }
    Gt.reset();
    const d = he.factory(r.segments);
    return new qs(d).getGeom();
  }
}
const Q = new Vs(), Ys = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return Q.run("union", n, e);
}, Gs = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return Q.run("intersection", n, e);
}, Zs = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return Q.run("xor", n, e);
}, Xs = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return Q.run("difference", n, e);
};
var li = {
  union: Ys,
  intersection: Gs,
  xor: Zs,
  difference: Xs
};
const ai = 3, Qs = 1e-6;
function ci(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return e;
}
function K(n, t) {
  const e = ci(n, t);
  return { x: e.x, y: e.y };
}
function $e(n, t) {
  const e = n.walls.find((o) => o.id === t);
  if (!e) return null;
  const i = n.nodes.find((o) => o.id === e.a), s = n.nodes.find((o) => o.id === e.b);
  return !i || !s ? null : z(i, s);
}
function di(n, t, e, i) {
  const s = e, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: n, b: t, dir: Ge(I(t, n)), len: z(n, t), leftOff: o, rightOff: r };
}
function tt(n, t) {
  return di(K(n, t.a), K(n, t.b), t.thickness, t.baseline);
}
function Nt(n, t) {
  const e = I(t, n.a);
  return { t: W(e, n.dir), side: W(e, V(n.dir)) };
}
function An(n, t) {
  const { f: e } = n;
  return t === "a" ? { body: n, end: t, p: e.a, u: e.dir, offL: e.leftOff, offR: e.rightOff, leftKey: "al", rightKey: "ar", far: e.b } : { body: n, end: t, p: e.b, u: k(e.dir, -1), offL: e.rightOff, offR: e.leftOff, leftKey: "br", rightKey: "bl", far: e.a };
}
const _t = (n) => M(n.p, k(V(n.u), n.offL)), Et = (n) => I(n.p, k(V(n.u), n.offR));
function $t(n, t, e) {
  return n !== null && z(n, t) <= e;
}
function Js(n) {
  const t = [];
  for (const e of n.walls) {
    const i = tt(n, e);
    if (i.len < 1e-9) continue;
    const s = V(i.dir);
    t.push({
      wall: e,
      f: i,
      c: {
        al: M(i.a, k(s, i.leftOff)),
        ar: I(i.a, k(s, i.rightOff)),
        bl: M(i.b, k(s, i.leftOff)),
        br: I(i.b, k(s, i.rightOff))
      }
    });
  }
  return t;
}
function to(n, t) {
  const e = t.f, i = V(e.dir);
  for (const s of n) {
    if (s.body === t) continue;
    const r = W(I(s.far, e.a), i) >= 0 ? M(e.a, k(i, e.leftOff)) : I(e.a, k(i, e.rightOff)), l = ai * Math.max(s.body.wall.thickness, t.wall.thickness), a = at(_t(s), s.u, r, e.dir), d = at(Et(s), s.u, r, e.dir);
    $t(a, s.p, l) && (s.body.c[s.leftKey] = a), $t(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function eo(n, t) {
  n.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const e = ai * Math.max(...n.map((s) => s.body.wall.thickness));
  for (let s = 0; s < n.length; s++) {
    const o = n[s], r = n[(s + 1) % n.length], l = at(Et(o), o.u, _t(r), r.u);
    $t(l, t, e) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (n.length < 3) return;
  const i = no(n, t, e);
  for (const s of n) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = I(r, o), a = It(l, I(t, o)), d = It(l, I(s.far, o));
    a * d < 0 && Le(s, [t]);
  }
}
function Le(n, t) {
  n.end === "a" ? n.body.extraA = t : n.body.extraB = t;
}
function no(n, t, e) {
  const i = n.length;
  for (let s = 0; s < i; s++) {
    const o = n[s], r = n[(s + 1) % i];
    if (Math.abs(It(o.u, r.u)) > 1e-9 || W(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = n[(s + 2) % i], d = at(Et(o), o.u, _t(a), a.u), f = at(_t(r), r.u, _t(a), a.u);
        if (!$t(d, t, e) || !$t(f, t, e)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = f, Le(o, [t, c, f]);
      } else {
        const a = n[(s - 1 + i) % i], d = at(_t(r), r.u, Et(a), a.u), f = at(Et(o), o.u, Et(a), a.u);
        if (!$t(f, t, e) || !$t(d, t, e)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = f, r.body.c[r.leftKey] = d, Le(r, [f, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function hi(n) {
  const t = Js(n), e = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of n.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(An(r, "a")), r.wall.b === i.id && s.push(An(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? e.get(i.host.wallId) : void 0;
    o ? to(s, o) : s.length >= 2 && eo(s, { x: i.x, y: i.y });
  }
  return t;
}
function ui(n) {
  return [n.c.ar, n.c.br, ...n.extraB ?? [], n.c.bl, n.c.al, ...n.extraA ?? []];
}
function we(n) {
  return new Map(hi(n).map((t) => [t.wall.id, ui(t)]));
}
function Pn(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i], o = n[(i + 1) % n.length], r = t(s), l = t(o);
    r >= 0 && e.push(s), r >= 0 != l >= 0 && e.push(M(s, k(I(o, s), r / (r - l))));
  }
  return e;
}
function fi(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of hi(n)) {
    const i = ui(e), s = n.openings.filter((d) => d.wallId === e.wall.id && !d.invalid).sort((d, f) => d.offset - f.offset), o = (d) => W(I(d, e.f.a), e.f.dir), r = [];
    let l = -1 / 0;
    for (const d of s)
      r.push([l, d.offset]), l = Math.max(l, d.offset + d.width);
    r.push([l, 1 / 0]);
    const a = [];
    for (const [d, f] of r) {
      if (f <= d) continue;
      let c = i;
      d > -1 / 0 && (c = Pn(c, (u) => o(u) - d)), f < 1 / 0 && (c = Pn(c, (u) => f - o(u))), c.length >= 3 && Math.abs(At(c)) > Qs && a.push(c);
    }
    t.set(e.wall.id, a);
  }
  return t;
}
const Ue = (n) => [n.map((t) => [t.x, t.y])];
function pi(n) {
  const t = n.map(([s, o]) => ({ x: s, y: o })), e = t[0], i = t[t.length - 1];
  return t.length > 1 && e.x === i.x && e.y === i.y && t.pop(), t;
}
function gi(n, t) {
  const e = t ? [...fi(n).values()].flat() : [...we(n).values()], i = e.map(Ue);
  if (i.length === 0) return [];
  let s;
  try {
    s = li.union(i[0], ...i.slice(1));
  } catch {
    return e.map((o) => [o.map((r) => ({ x: r.x, y: r.y }))]);
  }
  return s.map((o) => o.map(pi));
}
const ue = 1e-6;
function io(n, t) {
  return Ye[n.kind].includes(t.mode);
}
function mi(n, t, e) {
  if (!io(t, e)) return !1;
  if (e.mode === "free") return !0;
  const i = e.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Mt || i > Mt)) return !1;
  const s = $e(n, e.wallId);
  return s !== null && e.offset >= -ue && e.offset <= s + ue;
}
function ee(n, t) {
  return { ...n, devices: t };
}
function On(n, t, e, i) {
  if (!mi(n, t, e)) return { level: n, deviceId: null };
  const s = { id: J(), name: i, placement: e, props: t, invalid: !1 };
  return { level: ee(n, [...n.devices, s]), deviceId: s.id };
}
function yi(n, t, e) {
  if (n.kind !== "motion_sensor" || t === e) return n;
  const i = Ne("motion_sensor", t), s = Ne("motion_sensor", e);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && n.zoneAngle === i.zoneAngle ? { ...n, zoneAngle: s.zoneAngle } : n;
}
function Xe(n, t, e) {
  const i = n.devices, s = i.find((r) => r.id === t);
  if (!s || !mi(n, s.props, e)) return n;
  const o = yi(s.props, s.placement.mode, e.mode);
  return Qe(ee(n, i.map((r) => r.id === t ? { ...r, placement: e, props: o } : r)));
}
function so(n, t, e, i) {
  const s = n.devices;
  return s.some((o) => o.id === t) ? ee(n, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...e, kind: o.props.kind };
    return { ...o, props: r, name: i ?? o.name };
  })) : n;
}
function $i(n, t) {
  return ee(n, n.devices.filter((e) => e.id !== t));
}
function oo(n, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const e = t.props.zoneIds.filter((i) => n.zones.some((s) => s.id === i));
  return e.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: e } };
}
function Qe(n) {
  return ee(n, n.devices.map((t) => {
    const e = oo(n, t);
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const i = $e(n, e.placement.wallId), s = i === null || e.placement.offset < -ue || e.placement.offset > i + ue;
    return { ...e, invalid: s };
  }));
}
function ve(n) {
  const t = [];
  for (const e of gi(n, !1)) for (const i of e.slice(1)) t.push(i);
  return t;
}
function fe(n, t) {
  let e = null, i = 1 / 0;
  for (const s of n) {
    if (!te(t, s)) continue;
    const o = Math.abs(At(s));
    o < i && (e = s, i = o);
  }
  return e;
}
function wi(n) {
  return Math.round(Math.abs(At(n)) / 1e6 * 100) / 100;
}
const Pe = 1e-3;
function vi(n, t) {
  return n.length !== t.length || Math.abs(Math.abs(At(n)) - Math.abs(At(t))) > Pe ? !1 : n.every((e) => t.some((i) => Math.abs(e.x - i.x) <= Pe && Math.abs(e.y - i.y) <= Pe));
}
function ro(n, t, e) {
  const i = ve(n), s = fe(i, t);
  if (!s) return { level: n, zoneId: null };
  for (const r of n.zones) {
    const l = r.broken ? null : fe(i, r.seed);
    if (l && vi(l, s)) return { level: n, zoneId: null };
  }
  const o = { id: J(), name: e, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...n, zones: [...n.zones, o] }, zoneId: o.id };
}
function lo(n, t, e) {
  return { ...n, zones: n.zones.map((i) => i.id === t ? { ...i, name: e } : i) };
}
function xi(n, t) {
  return Qe({ ...n, zones: n.zones.filter((e) => e.id !== t) });
}
function Dt(n) {
  if (n.zones.length === 0) return n;
  const t = ve(n), e = [], i = n.zones.map((s) => {
    const o = fe(t, s.seed);
    return !o || e.some((r) => vi(r, o)) ? { ...s, broken: !0 } : (e.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...n, zones: i };
}
const Pt = 1e-6, pe = ["door", "gate", "wicket"];
function bi(n, t) {
  return n.offset < t.offset + t.width - Pt && t.offset < n.offset + n.width - Pt;
}
function xe(n, t, e, i, s) {
  const o = $e(n, t);
  return o === null || i <= 0 || e < -Pt || e + i > o + Pt ? !1 : !n.openings.some((r) => r.wallId === t && r.id !== s && bi(r, { offset: e, width: i }));
}
function zt(n, t) {
  return { ...n, openings: t };
}
function ao(n, t, e, i, s, o = {}) {
  const r = s ?? oe[e], l = i - r / 2;
  if (!xe(n, t, l, r)) return { level: n, openingId: null };
  const a = { id: J(), wallId: t, kind: e, offset: l, width: r, invalid: !1 };
  return pe.includes(e) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), e === "window" && (a.outside = o.outside ?? "left"), { level: Dt(zt(n, [...n.openings, a])), openingId: a.id };
}
function ki(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !xe(n, i.wallId, e, i.width, t) ? n : Dt(ne(zt(n, n.openings.map((s) => s.id === t ? { ...s, offset: e } : s))));
}
function co(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !xe(n, i.wallId, i.offset, e, t) ? n : Dt(ne(zt(n, n.openings.map((s) => s.id === t ? { ...s, width: e } : s))));
}
function ho(n, t) {
  return pe.includes(t) ? { kind: t, hinge: n.hinge ?? "start", swing: n.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: n.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function uo(n, t, e) {
  if (!n.openings.some((s) => s.id === t)) return n;
  const i = (s) => {
    const o = { ...s, ...e };
    for (const r of Object.keys(e)) e[r] === void 0 && delete o[r];
    return o;
  };
  return Dt(ne(zt(n, n.openings.map((s) => s.id === t ? i(s) : s))));
}
function _i(n, t) {
  return Dt(ne(zt(n, n.openings.filter((e) => e.id !== t))));
}
function ne(n) {
  return zt(n, n.openings.map((t) => {
    const e = $e(n, t.wallId), i = e === null || t.offset < -Pt || t.offset + t.width > e + Pt || n.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && bi(t, s));
    return { ...t, invalid: i };
  }));
}
const Zt = 1;
function ot(n) {
  return structuredClone(n);
}
function be(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) throw new Error(`wall not found: ${t}`);
  return e;
}
function fo(n, t, e) {
  return Math.min(e, Math.max(t, n));
}
function Je(n, t, e) {
  const i = K(n, t.a), s = K(n, t.b), o = z(i, s), r = fo(typeof e == "number" ? e : oi(e, i, s) * o, 0, o);
  return { pt: o === 0 ? i : _s(i, s, r / o), offset: r };
}
function po(n) {
  for (let t = 0; t <= n.nodes.length; t++) {
    let e = !1;
    for (const i of n.nodes) {
      if (!i.host) continue;
      const s = n.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Je(n, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (e = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!e) break;
  }
}
function Ei(n, t) {
  return po(n), t && $o(t, n), Dt(Qe(ne(n)));
}
function gt(n, t) {
  return Ei(ot(n), t);
}
function Si(n, t, e) {
  const i = ci(n, t), s = i.host && n.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Je(n, s, e);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = e.x, i.y = e.y;
}
function Nn(n, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: K(n, t.nodeId), nodeId: t.nodeId };
  const e = be(n, t.wallId), { pt: i, offset: s } = Je(n, e, t.offset), o = z(K(n, e.a), K(n, e.b));
  return s <= Zt ? { pt: K(n, e.a), nodeId: e.a } : o - s <= Zt ? { pt: K(n, e.b), nodeId: e.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Dn(n, t) {
  if (t.nodeId) return t.nodeId;
  const e = { id: J(), x: t.pt.x, y: t.pt.y };
  return t.host && (e.host = { ...t.host }), n.nodes.push(e), e.id;
}
function go(n, t, e, i) {
  const s = Nn(n, t), o = Nn(n, e);
  if (z(s.pt, o.pt) < Zt) return { level: n, wallId: null, endNodeId: null };
  const r = ot(n), l = Dn(r, s), a = Dn(r, o);
  if (l === a) return { level: n, wallId: null, endNodeId: null };
  const d = { id: J(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: gt(r, n), wallId: d.id, endNodeId: a };
}
function Mi(n, t, e, i) {
  const s = i === "inner" ? e / 2 : i === "outer" ? -e / 2 : 0, o = Math.min(n.x, t.x) - s, r = Math.max(n.x, t.x) + s, l = Math.min(n.y, t.y) - s, a = Math.max(n.y, t.y) + s;
  return r - o < Zt || a - l < Zt ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function mo(n, t, e, i, s) {
  const o = Mi(t, e, i.thickness, s);
  if (!o) return n;
  const r = ot(n), l = o.map((a) => {
    const d = { id: J(), x: a.x, y: a.y };
    return r.nodes.push(d), d.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: J(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return gt(r, n);
}
function yo(n, t, e) {
  const i = ot(n);
  return Si(i, t, e), Ei(i, n);
}
function $o(n, t) {
  const e = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : [])
  ];
  for (const i of t.walls) {
    const s = n.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = n.nodes.find((c) => c.id === s.a), r = n.nodes.find((c) => c.id === s.b), l = t.nodes.find((c) => c.id === i.a), a = t.nodes.find((c) => c.id === i.b);
    if (!o || !r || !l || !a || o.x === l.x && o.y === l.y) continue;
    const d = z(l, a);
    if (d === 0) continue;
    const f = Ge(I(r, o));
    for (const c of e)
      c.wallId === i.id && (c.offset = oi(M(o, k(f, c.offset)), l, a) * d);
  }
}
function wo(n, t, e) {
  const i = ot(n), s = be(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: M(K(i, l), e) }));
  for (const l of r) Si(i, l.id, l.to);
  return gt(i, n);
}
function tn(n) {
  n.nodes = n.nodes.filter((t) => n.walls.some((e) => e.a === t.id || e.b === t.id));
}
function vo(n, t, e) {
  const i = ot(n), s = be(i, t), o = K(i, s[e]), r = { id: J(), x: o.x, y: o.y };
  return i.nodes.push(r), s[e] = r.id, tn(i), { level: gt(i, n), nodeId: r.id };
}
function xo(n, t, e) {
  if (t === e) return n;
  const i = ot(n);
  for (const o of i.walls)
    o.a === t && (o.a = e), o.b === t && (o.b = e);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return i.nodes = i.nodes.filter((o) => o.id !== t), tn(i), gt(i, n);
}
function Ii(n, t) {
  var i;
  const e = ot(n);
  e.walls = e.walls.filter((s) => s.id !== t), e.openings = e.openings.filter((s) => s.wallId !== t), e.devices = e.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of e.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return tn(e), gt(e, n);
}
function bo(n, t, e) {
  const i = ot(n);
  return Object.assign(be(i, t), e), gt(i, n);
}
class Ai extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Oe(n) {
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
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Ai(s.message) : s;
  }
}
async function Eo(n, t) {
  await n.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const So = 3;
function jt(n) {
  if (typeof n == "number")
    return n === So ? "Connection lost" : `Connection error ${n}`;
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
    const i = { ...t, id: J(), name: e, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await _o(this.hass, t, e, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Ai ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = jt(o)), this.onChange(), null;
    }
  }
}
const Io = {
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
  "props.symbol": "Symbol",
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
  "symbol.boiler": "Boiler",
  "symbol.pc": "Computer",
  "symbol.automation": "Automation",
  "symbol.other": "Other",
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
  "unit.mm": "mm",
  "unit.m2": "m²",
  "unit.deg": "°"
};
function p(n) {
  return Io[n] ?? n;
}
const Ao = 32, zn = 128;
function ge(n) {
  const t = n * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function ut(n) {
  return Math.atan2(-n.y, n.x) * 180 / Math.PI;
}
function Pi(n) {
  return (n % 360 + 360) % 360;
}
function Oi(n) {
  return (n % 360 + 540) % 360 - 180;
}
function Z(n, t) {
  const e = t.placement;
  if (e.mode === "free") return { pt: { x: e.x, y: e.y }, dir: ge(e.rotation) };
  const i = n.walls.find((a) => a.id === e.wallId);
  if (!i) return null;
  let s;
  try {
    s = tt(n, i);
  } catch {
    return null;
  }
  const o = V(s.dir), r = e.side === "left" ? o : k(o, -1), l = e.side === "left" ? s.leftOff : s.rightOff;
  return { pt: M(M(s.a, k(s.dir, e.offset)), k(r, l)), dir: e.aim ? ge(ut(r) + e.aim) : r, normal: r };
}
function Ni(n, t) {
  const e = [];
  for (let i = 0; i < zn; i++) e.push(M(n, k(ge(360 * i / zn), t)));
  return e;
}
function Cn(n, t, e, i) {
  if (e >= 360) return Ni(n, i);
  const s = Math.max(1, Math.ceil(e / 90 * Ao)), o = ut(t) - e / 2, r = [n];
  for (let l = 0; l <= s; l++) r.push(M(n, k(ge(o + e * l / s), i)));
  return r;
}
function Po(n, t) {
  const e = t.props;
  if (e.kind !== "wall_light" && e.kind !== "motion_sensor" && e.kind !== "ceiling_light") return null;
  const i = Z(n, t);
  if (!i) return null;
  switch (e.kind) {
    case "wall_light":
      return e.coneAngle > 0 && e.coneRange > 0 ? Cn(i.pt, i.dir, e.coneAngle, e.coneRange) : null;
    case "motion_sensor":
      return e.zoneAngle > 0 && e.zoneRange > 0 ? Cn(i.pt, i.dir, e.zoneAngle, e.zoneRange) : null;
    case "ceiling_light":
      return e.poolRadius !== null && e.poolRadius > 0 ? Ni(i.pt, e.poolRadius) : null;
  }
}
function Di(n) {
  return n.normal ? M(n.pt, n.normal) : n.pt;
}
function Oo(n, t) {
  const e = Z(n, t);
  if (!e) return null;
  const i = Di(e);
  let s = null, o = 1 / 0;
  for (const r of n.zones) {
    if (!te(i, r.outline)) continue;
    const l = Math.abs(At(r.outline));
    l < o && (s = r.id, o = l);
  }
  return s;
}
function No(n, t, e = ve) {
  const i = Po(n, t);
  if (!i) return [];
  const s = Z(n, t), o = Di(s), r = fe(e(n), o);
  if (!r) return [i];
  let l;
  try {
    l = li.intersection(Ue(i), Ue(r));
  } catch {
    return [i];
  }
  return l.flatMap((a) => a.map(pi));
}
function Do(n, t, e, i) {
  const s = Z(n, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, W(I(e, s.pt), s.dir)));
    return z(M(s.pt, k(s.dir, l)), e) <= i;
  }
  if (o.kind !== "equipment") return z(s.pt, e) <= i;
  if (o.shape === "circle") return z(s.pt, e) <= o.diameter / 2 + i;
  const r = I(e, s.pt);
  return Math.abs(W(r, s.dir)) <= o.width / 2 + i && Math.abs(W(r, V(s.dir))) <= o.depth / 2 + i;
}
function zo(n, t, e) {
  const i = n.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Do(n, i[o], t, e)) return i[o].id;
  return null;
}
const Co = 60;
function Be(n, t, e) {
  if (!ii.has(t.props.kind)) return null;
  const i = Z(n, t);
  return i ? { from: i.pt, to: M(i.pt, k(i.dir, Co / e)) } : null;
}
function zi(n, t) {
  const e = { ...n, aim: t };
  return t === 0 && delete e.aim, e;
}
function Ro(n, t, e, i) {
  const s = t.placement, o = Z(n, t);
  if (!o || e.x === o.pt.x && e.y === o.pt.y) return s;
  const r = ut(I(e, o.pt)), l = (f) => i ? Math.round(f / 15) * 15 : Math.round(f);
  if (s.mode === "free") return { ...s, rotation: Pi(l(r)) };
  const a = Oi(r - ut(o.normal)), d = Math.max(-Mt, Math.min(Mt, l(a)));
  return zi(s, d);
}
const et = (n) => n.length === 0 ? "" : `M${n.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function Xt(n, t, e) {
  let i = n.get(t);
  return i === void 0 && (i = e(t), n.set(t, i)), i;
}
const Ci = 12, R = "non-scaling-stroke", Rn = { boiler: "B", pc: "PC", automation: "A", other: "•" }, To = "__preview__", Lo = /* @__PURE__ */ new WeakMap(), Uo = (n) => Xt(Lo, n, ve);
function Bo(n, t, e, i) {
  const s = n.props, o = { stroke: e, fill: i };
  switch (s.kind) {
    case "ceiling_light":
      return s.shape === "linear" ? S`<rect class="icon" x=${-s.length / 2} y=${-s.width / 2} width=${s.length} height=${s.width}
          fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></rect>` : s.shape === "spot" ? S`<circle class="icon" r=${t / 3} fill=${e} stroke=${e} stroke-width="1" vector-effect=${R}></circle>` : S`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>`;
    case "wall_light":
      return S`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${o.fill} stroke=${o.stroke}
        stroke-width="1.5" vector-effect=${R}></path>`;
    case "motion_sensor": {
      const r = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return S`<circle class="icon" r=${t * 0.6} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="arcs" d=${r(1) + r(1.5)} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    case "illuminance_sensor": {
      let r = "";
      for (let l = 0; l < 8; l++) {
        const a = l * Math.PI / 4;
        r += `M${Math.cos(a) * t * 1.15} ${Math.sin(a) * t * 1.15}L${Math.cos(a) * t * 1.6} ${Math.sin(a) * t * 1.6}`;
      }
      return S`<circle class="icon" r=${t * 0.7} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="rays" d=${r} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    case "switch":
      return S`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${o.fill}
        stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></rect>`;
    case "socket":
      return S`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${e}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${e}></circle>`;
    case "climate_sensor":
      return S`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${R}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${e} stroke=${e} stroke-width="1" vector-effect=${R}></path>`;
    case "exhaust_fan": {
      let r = "";
      for (let l = 0; l < 4; l++) {
        const a = l * Math.PI / 2 + Math.PI / 4;
        r += `M0 0L${Math.cos(a) * t * 0.85} ${Math.sin(a) * t * 0.85}`;
      }
      return S`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="blades" d=${r} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    default:
      return S`${v}`;
  }
}
function jo(n, t, e, i) {
  const s = n.props;
  if (s.kind !== "equipment") return S`${v}`;
  const o = Ci / t.scale, r = s.shape === "circle" ? S`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${e}
        stroke-width="1.5" vector-effect=${R}></circle>` : S`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${e} stroke-width="1.5" vector-effect=${R}></rect>`;
  return S`
    <g transform=${`rotate(${i})`}>${r}</g>
    <text class="equipment-glyph" text-anchor="middle" dominant-baseline="middle" font-size=${o} fill=${e}
      font-family="system-ui, sans-serif" font-weight="600">${Rn[s.symbol] ?? Rn.other}</text>
    <text class="equipment-label" y=${o * 1.5} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${e} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Fo(n, t, e, i) {
  var u;
  const s = e.palette, o = n.invalid ? s.invalid : s.device, r = Ci / e.scale, l = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, a = !i && ((u = e.selection) == null ? void 0 : u.kind) === "device" && e.selection.id === n.id, d = `device device-${n.props.kind}${a ? " selected" : ""}${n.invalid ? " invalid" : ""}${i ? " device-preview" : ""}`, f = i ? "0.5" : e.dim ? String(s.dimOpacity) : v, c = n.props.kind === "equipment" ? n.props.shape === "circle" ? n.props.diameter / 2 : Math.hypot(n.props.width, n.props.depth) / 2 : r * 1.6;
  return S`
    <g class=${d} data-id=${n.id} opacity=${f} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${a ? S`<circle class="selection-ring" r=${c + 4 / e.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${R}></circle>` : v}
      ${n.props.kind === "equipment" ? jo(n, e, o, l) : S`<g transform=${`rotate(${l})`}>${Bo(n, r, o, s.deviceFill)}</g>`}
    </g>`;
}
function Ho(n, t, e, i) {
  const s = No(n, t, Uo);
  if (s.length === 0) return v;
  const o = e.palette, r = t.invalid ? o.invalid : o.cone, l = i ? "0.5" : e.dim ? String(o.dimOpacity) : v, a = s.map(et).join("");
  return t.props.kind === "ceiling_light" ? S`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${R}></path>` : S`<path class="cone" d=${a} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${l} vector-effect=${R}></path>`;
}
function qo(n, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device") return v;
  const e = t.selection.id, i = n.devices.find((l) => l.id === e), s = i ? Be(n, i, t.scale) : null;
  if (!s) return v;
  const o = t.palette.selection;
  return S`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${R}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${R} style="cursor:grab"></circle>
  </g>`;
}
function Wo(n, t) {
  const e = [];
  for (const i of n.devices) {
    const s = Z(n, i);
    s && e.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: To, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Z(n, i);
    s && e.push({ d: i, pose: s, preview: !0 });
  }
  return S`
    <g class="cones">${t.showCones ? e.map((i) => Ho(n, i.d, t, i.preview)) : v}</g>
    <g class="devices">${e.map((i) => Fo(i.d, i.pose, t, i.preview))}</g>
    ${qo(n, t)}`;
}
function vt(n) {
  const t = Math.round(n), e = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${e}` : e;
}
function Ri(n) {
  return `${n.toFixed(2)} ${p("unit.m2")}`;
}
const Ko = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap(), Ti = /* @__PURE__ */ new WeakMap();
function ke(n, t, e) {
  const i = V(n.dir), s = M(n.a, k(n.dir, t)), o = M(n.a, k(n.dir, e));
  return [M(s, k(i, n.leftOff)), M(o, k(i, n.leftOff)), I(o, k(i, n.rightOff)), I(s, k(i, n.rightOff))];
}
function Qt(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) return null;
  try {
    const i = tt(n, e);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function Yo(n, t) {
  let e = 0, i = 0, s = 0;
  for (let r = 0; r < n.length; r++) {
    const l = n[r], a = n[(r + 1) % n.length], d = l.x * a.y - a.x * l.y;
    e += d, i += (l.x + a.x) * d, s += (l.y + a.y) * d;
  }
  if (Math.abs(e) < 1e-9) return t;
  const o = { x: i / (3 * e), y: s / (3 * e) };
  return te(o, n) ? o : t;
}
const L = "non-scaling-stroke";
function Go(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (const l of n.walls)
    e.set(l.a, (e.get(l.a) ?? 0) + 1), e.set(l.b, (e.get(l.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const l of n.walls) {
    const a = Qt(n, l.id);
    if (!a) continue;
    const d = V(a.dir);
    for (const [f, c, u] of [[l.a, a.a, a.dir], [l.b, a.b, k(a.dir, -1)]]) {
      const h = n.nodes.find((P) => P.id === f);
      if (!h || h.host || e.get(f) !== 1) continue;
      const g = M(c, k(d, a.leftOff + i)), m = I(c, k(d, a.rightOff + i)), w = k(d, 1), y = k(M(g, m), 0.5), x = M(I(y, k(w, -o)), k(u, s / 2)), _ = I(I(y, k(w, o)), k(u, s / 2)), E = [g, x, _, m];
      r.push(S`<path class="wall-break" d=${`M${E.map((P) => `${P.x} ${P.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${L}></path>`);
    }
  }
  return r.length ? S`${r}` : v;
}
function Zo(n, t, e) {
  const i = t.palette, s = Yo(n.outline, n.seed), o = 12 / t.scale;
  return S`
    <path class="zone${n.broken ? " broken" : ""}" d=${et(n.outline)}
      fill=${n.broken ? "url(#hatch)" : i.zone}
      stroke=${e ? i.selection : "none"} stroke-width="2" vector-effect=${L}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${n.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${n.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Ri(wi(n.outline))}</tspan>
    </text>`;
}
function Xo(n, t, e) {
  const i = V(n.dir), s = (t.swing ?? "left") === "left", o = s ? i : k(i, -1), r = s ? n.leftOff : n.rightOff, [l, a] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = M(M(n.a, k(n.dir, l)), k(o, r)), f = M(M(n.a, k(n.dir, a)), k(o, r)), c = M(d, k(o, t.width)), u = It(I(c, d), I(f, d)) > 0 ? 1 : 0;
  return S`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${e} stroke-width="1.5" vector-effect=${L}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${u} ${f.x} ${f.y}`} fill="none" stroke=${e}
      stroke-width="1" vector-effect=${L}></path>`;
}
function Qo(n, t, e) {
  const i = V(n.dir), s = n.leftOff + n.rightOff, o = [n.leftOff - s / 3, n.leftOff - 2 * s / 3].map((r) => {
    const l = M(M(n.a, k(n.dir, t.offset)), k(i, r)), a = M(M(n.a, k(n.dir, t.offset + t.width)), k(i, r));
    return S`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${e} stroke-width="1.5" vector-effect=${L}></line>`;
  });
  return S`${o}`;
}
function Jo(n, t, e) {
  const i = Qt(n, t.wallId);
  if (!i) return v;
  const s = e.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = ke(i, t.offset, t.offset + t.width), l = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return S`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${et(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Xo(i, t, o) : t.kind === "window" ? Qo(i, t, o) : v}
    </g>`;
}
function Tn(n, t, e, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = M(n, k(e, i)), a = M(t, k(e, i)), d = (c, u) => {
    const h = M(u, k(e, i + r));
    return S`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${L}></line>`;
  }, f = M(k(M(l, a), 0.5), k(e, 9 / s.scale));
  return S`
    <g class="dim">
      ${d(M(n, k(e, 2 / s.scale)), n)}${d(M(t, k(e, 2 / s.scale)), t)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${L}></line>
      <text x=${f.x} y=${f.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${vt(z(n, t))}</text>
    </g>`;
}
function tr(n, t) {
  const e = t.selection;
  if (!e) return v;
  const i = t.palette, s = 4 / t.scale, o = (r) => S`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (e.kind === "node") {
    const r = n.nodes.find((l) => l.id === e.id);
    return r ? o(r) : v;
  }
  if (e.kind === "wall") {
    const r = Xt(Ti, n, we).get(e.id), l = Qt(n, e.id);
    if (!r || !l) return v;
    const a = V(l.dir);
    return S`
      <path d=${et(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${L}></path>
      ${o(l.a)}${o(l.b)}
      ${Tn(l.a, l.b, a, l.leftOff + 18 / t.scale, t)}`;
  }
  if (e.kind === "opening") {
    const r = n.openings.find((u) => u.id === e.id), l = r ? Qt(n, r.wallId) : null;
    if (!r || !l) return v;
    const a = k(V(l.dir), -1), d = l.rightOff + 18 / t.scale, f = (u) => M(l.a, k(l.dir, u)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return S`
      <path d=${et(ke(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${L}></path>
      ${c.filter(([u, h]) => h - u >= 1).map(([u, h]) => Tn(f(u), f(h), a, d, t))}`;
  }
  return v;
}
function er(n, t, e) {
  return z(n, t) < 1e-6 ? null : ke(di(n, t, e.thickness, e.baseline), 0, z(n, t));
}
function nr(n, t) {
  const { preview: e, palette: i } = t, s = 1e7, o = e.orthoFrom, r = e.opening, l = r ? Qt(n, r.wallId) : null;
  return S`
    ${o ? S`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${L}></path>` : v}
    ${(e.walls ?? []).map((a) => {
    const d = er(a.a, a.b, a.props);
    return S`<g class="preview-wall">
        ${d ? S`<path d=${et(d)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${L}></line></g>`;
  })}
    ${r && l ? S`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${et(ke(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${sr(n, t)}`;
}
function ir(n, t) {
  const e = t.palette, i = 5 / t.scale;
  return S`<g class="snap-start">
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.background}
      stroke-width="4" vector-effect=${L}></rect>
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.snap}
      stroke-width="1.5" vector-effect=${L}></rect></g>`;
}
function sr(n, t) {
  const e = t.preview, i = t.palette, s = e.anchor ? ir(e.anchor, t) : v, o = e.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / t.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let f, c = v;
  if (o.kind === "node") {
    const h = r(5);
    f = S`<g class="snap-node"><rect x=${l - h} y=${a - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${L}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), g = `M${l} ${a - h}L${l + h * 0.866} ${a + h / 2}L${l - h * 0.866} ${a + h / 2}Z`;
    f = S`<g class="snap-mid"><path d=${g} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${L}></path></g>`;
  } else if (o.kind === "wall") {
    const h = r(5), g = `M${l - h} ${a - h}L${l + h} ${a + h}M${l - h} ${a + h}L${l + h} ${a - h}`;
    f = S`<g class="snap-wall">
      <path d=${g} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${L}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${L}></path></g>`;
    const m = o.endpoint.kind === "wall" ? Xt(Ti, n, we).get(o.endpoint.wallId) : void 0;
    m && (c = S`<path class="snap-wall-hl" d=${et(m)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${L}></path>`);
  } else {
    const h = r(4), g = `M${l - h} ${a}H${l + h}M${l} ${a - h}V${a + h}`;
    f = S`<g class="snap-grid">
      <path d=${g} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${L}></path>
      <path d=${g} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${L}></path></g>`;
  }
  const u = p(`snapmark.${o.kind}`);
  return S`
    ${c}${s}${f}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${L} font-family="system-ui, sans-serif">${u}</text>`;
}
function or(n, t) {
  const e = t.preview.level ?? n, i = t.palette, s = Xt(Ko, e, (c) => gi(c, !0)), o = e.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? Xt(Vo, e, fi) : null, l = 8 / t.scale, a = t.selection, d = t.mode === "equipment", f = d ? String(i.dimOpacity) : v;
  return S`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${l} height=${l} patternTransform="rotate(45)">
        <rect width=${l} height=${l} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${l} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${f}>${e.zones.map((c) => Zo(c, t, (a == null ? void 0 : a.kind) === "zone" && a.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(et).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${f}></path>
    ${r ? S`<g class="railings" opacity=${f}>${o.flatMap((c) => (r.get(c.id) ?? []).map((u) => S`<path d=${et(u)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${f}>${e.openings.map((c) => Jo(e, c, t))}</g>
    <g class="wall-breaks" opacity=${f}>${Go(e, t)}</g>
    <g class="devices-layer">${Wo(e, {
    palette: i,
    scale: t.scale,
    selection: a,
    showCones: t.showCones ?? !0,
    dim: !d,
    preview: t.preview.device
  })}</g>
    <g class="selection">${tr(e, t)}</g>
    <g class="preview">${nr(e, t)}</g>`;
}
const rr = {
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
}, lr = {
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
function ar(n) {
  return n ? rr : lr;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const cr = { PROPERTY: 3 }, dr = (n) => (...t) => ({ _$litDirective$: n, values: t });
class hr {
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
const ur = {}, fr = (n, t = ur) => n._$AH = t;
class pr extends hr {
  constructor(t) {
    if (super(t), t.type !== cr.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === e ? ft : (fr(t), e);
  }
}
const st = dr(pr);
function Li(n, t) {
  return Math.abs(t.x - n.x) >= Math.abs(t.y - n.y) ? { x: t.x, y: n.y } : { x: n.x, y: t.y };
}
function gr(n, t, e) {
  return M(n, k(Ge(I(t, n)), e));
}
function Ln(n, t) {
  return { pt: n, kind: t, endpoint: { kind: "free", pt: n } };
}
function Ot(n, t, e) {
  const { tolMm: i, grid: s, ortho: o } = e, r = o ? e.from : void 0, l = new Set(e.excludeNodeIds ?? []), a = r ? Li(r, t) : t, d = r !== void 0 && a.y === r.y, f = (y) => !r || Math.abs(d ? y.y - r.y : y.x - r.x) <= 1;
  let c = null;
  for (const y of n.nodes) {
    if (l.has(y.id)) continue;
    const x = { x: y.x, y: y.y }, _ = z(x, a);
    _ <= i && f(x) && (!c || _ < c.d) && (c = { id: y.id, pt: x, d: _ });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const u = n.walls.filter((y) => !l.has(y.a) && !l.has(y.b)).map((y) => ({ w: y, f: tt(n, y) })).filter((y) => y.f.len > 1e-9);
  let h = null;
  for (const { w: y, f: x } of u) {
    const _ = { x: (x.a.x + x.b.x) / 2, y: (x.a.y + x.b.y) / 2 }, E = z(_, a);
    E <= i && f(_) && (!h || E < h.d) && (h = { wallId: y.id, pt: _, offset: x.len / 2, d: E });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const g = (y) => {
    let x = null;
    for (const { w: _, f: E } of u) {
      const P = V(E.dir), N = y ? [E.leftOff, -E.rightOff].filter((D) => D !== 0) : [0];
      for (const D of N) {
        const O = M(E.a, k(P, D)), B = r ? at(r, I(a, r), O, E.dir) : M(O, k(E.dir, W(I(a, O), E.dir)));
        if (!B) continue;
        const F = W(I(B, O), E.dir);
        if (F < 0 || F > E.len) continue;
        const H = z(B, a);
        H <= i && (!x || H < x.d) && (x = { d: H, res: { pt: B, kind: "wall", endpoint: { kind: "wall", wallId: _.id, offset: F } } });
      }
    }
    return x ? x.res : null;
  }, m = g(!1);
  if (m) return m;
  const w = g(!0);
  if (w) return w;
  if (s && s > 0) {
    const y = (_) => Math.round(_ / s) * s, x = r ? d ? { x: y(a.x), y: r.y } : { x: r.x, y: y(a.y) } : { x: y(a.x), y: y(a.y) };
    return Ln(x, "grid");
  }
  return Ln(a, "none");
}
function mr(n, t, e) {
  const i = I(e, t), s = W(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, W(I(n, t), i) / s));
  return z(n, { x: t.x + i.x * o, y: t.y + i.y * o });
}
function yr(n, t, e) {
  return t.some((i, s) => mr(n, i, t[(s + 1) % t.length]) <= e);
}
function Ui(n, t, e) {
  for (const [i, s] of we(n))
    if (te(t, s) || yr(t, s, e)) return i;
  return null;
}
function $r(n, t) {
  for (const e of n.openings) {
    const i = n.walls.find((l) => l.id === e.wallId);
    if (!i) continue;
    const s = tt(n, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Nt(s, t);
    if (o >= e.offset && o <= e.offset + e.width && r >= -s.rightOff && r <= s.leftOff) return e.id;
  }
  return null;
}
function wr(n, t, e, i) {
  const s = $r(n, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = n.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = n.nodes.find((d) => d.id === l);
        if (a && z(t, a) <= e) return { kind: "node", id: l };
      }
  }
  const o = Ui(n, t, e);
  if (o) return { kind: "wall", id: o };
  for (const r of n.zones)
    if (r.outline.length >= 3 && te(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function vr(n) {
  let t = null, e = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, l = null;
  const a = (h) => {
    t = h, n.select(h);
  }, d = () => {
    e = null, i = null, s = null, l = null, o = !1;
  }, f = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, g, m) => Nt(tt(h, h.walls.find((w) => w.id === g)), m).t;
  function u(h) {
    const g = e;
    if (!(!g || !i) && !(h.pt.x === r.x && h.pt.y === r.y))
      if (o = !0, g.kind === "node") {
        const m = Ot(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [g.nodeId]
        }), w = m.endpoint, y = (m.kind === "wall" || m.kind === "mid") && w.kind === "wall", x = m.kind === "node" && w.kind === "node" && w.nodeId !== g.nodeId, _ = i.nodes.find((D) => D.id === g.nodeId), E = !!_.host && y && w.kind === "wall" && w.wallId === _.host.wallId;
        let P = i;
        if (_.host && !E) {
          const D = structuredClone(i);
          delete D.nodes.find((O) => O.id === g.nodeId).host, P = D;
        }
        let N = yo(P, g.nodeId, f(m));
        if (x && w.kind === "node")
          N = xo(N, g.nodeId, w.nodeId);
        else if (y && w.kind === "wall" && !E) {
          const D = i.walls.find((O) => O.id === w.wallId);
          if (D && D.a !== g.nodeId && D.b !== g.nodeId) {
            const O = structuredClone(N);
            O.nodes.find((B) => B.id === g.nodeId).host = { wallId: w.wallId, offset: w.offset }, N = gt(O, N);
          }
        }
        s = N;
      } else if (g.kind === "wall") {
        const m = i.walls.find((x) => x.id === g.wallId), w = Ot(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: g.origin,
          ortho: h.shift,
          excludeNodeIds: [m.a, m.b]
        }), y = I(w.pt, g.origin);
        s = wo(
          i,
          g.wallId,
          w.kind === "none" ? { x: Math.round(y.x), y: Math.round(y.y) } : y
        );
      } else {
        const m = i.openings.find((w) => w.id === g.openingId);
        s = ki(i, m.id, c(i, m.wallId, h.pt) - g.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      d(), r = h.pt;
      const g = n.level(), m = t, w = wr(g, h.pt, n.tolMm(), m);
      if (a(w), !!w) {
        if (l = i = s = g, w.kind === "node") {
          let y = w.id;
          const x = (m == null ? void 0 : m.kind) === "wall" ? g.walls.find((_) => _.id === m.id) : void 0;
          if (h.alt && x) {
            const _ = vo(g, x.id, x.a === w.id ? "a" : "b");
            i = s = _.level, y = _.nodeId, a({ kind: "node", id: y });
          }
          e = { kind: "node", nodeId: y, origin: K(i, y) };
        } else if (w.kind === "wall")
          e = { kind: "wall", wallId: w.id, origin: h.pt };
        else if (w.kind === "opening") {
          const y = g.openings.find((x) => x.id === w.id);
          e = { kind: "opening", openingId: y.id, grab: c(g, y.wallId, h.pt) - y.offset };
        }
      }
    },
    move(h) {
      u(h);
    },
    up(h) {
      e && u(h);
      const g = o, m = s, w = l;
      d(), g && m && w && m !== w && n.commit(m);
    },
    key(h) {
      return h === "Escape" && e ? (d(), !0) : !1;
    },
    preview() {
      return !e || !s ? {} : { level: s, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      d(), a(null);
    }
  };
}
function Jt(n, { min: t = 0, max: e = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = n.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= e ? o : null;
}
function Bi() {
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
    key(o, r, l) {
      return /^[0-9]$/.test(o) || o === " " ? (e === "first" ? n += o : t += o, !0) : o === "Backspace" ? (e === "first" ? n = n.slice(0, -1) : t = t.slice(0, -1), !0) : o === "Tab" ? (e = e === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : l(), !0) : !1;
    },
    tracker: (o) => ({ first: n, second: t, field: e, at: o })
  };
}
function xr(n) {
  let t = null, e = { x: 0, y: 0 };
  const i = Bi(), s = () => {
    t = null, i.clear();
  }, o = (d) => Ot(n.level(), d, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const d = Jt(i.first, { min: 1 }), f = Jt(i.second, { min: 1 });
      return d === null || f === null ? null : { x: t.x + (e.x >= t.x ? d : -d), y: t.y + (e.y >= t.y ? f : -f) };
    }
    return o(e).pt;
  }
  const l = (d, f) => Math.abs(d.x - f.x) < 1 || Math.abs(d.y - f.y) < 1;
  function a(d) {
    if (!t || l(t, d)) return;
    const f = mo(n.level(), t, d, n.wallProps(), n.boxMeasure());
    f !== n.level() && (n.commit(f), s());
  }
  return {
    id: "box",
    down(d) {
      if (e = d.pt, !t) {
        t = o(d.pt).pt;
        return;
      }
      const f = r();
      f && a(f);
    },
    move(d) {
      e = d.pt;
    },
    up() {
    },
    key(d) {
      return t ? i.key(d, () => {
        const f = r();
        f && a(f);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(e) };
      const d = r(), f = {
        tracker: i.tracker(e),
        anchor: t,
        snap: i.typing() ? void 0 : o(e)
      };
      if (!d || l(t, d)) return f;
      const c = n.wallProps(), u = Mi(t, d, c.thickness, n.boxMeasure());
      return u && (f.walls = u.map((h, g) => ({ a: h, b: u[(g + 1) % 4], props: { ...c, baseline: "center" } }))), f;
    },
    cancel() {
      s();
    }
  };
}
const Un = (n) => Math.round(n * 1e3) / 1e3 + 0;
function br(n) {
  let t = null, e = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = Bi(), a = () => {
    t = null, e = null, i = null, r = null, l.clear();
  }, d = (u, h) => Ot(n.level(), u, { tolMm: n.tolMm(), grid: n.grid(), from: e ?? void 0, ortho: h && e !== null });
  function f() {
    if (!e) return null;
    const u = d(s, o), h = Jt(l.first, { min: 1 }), g = Jt(l.second);
    if (h === null && g === null) return { pt: u.pt, endpoint: u.endpoint, snap: u };
    const m = h ?? z(e, u.pt);
    let w = u.pt;
    if (g === null && z(e, u.pt) < 1) {
      const E = r ?? { x: 1, y: 0 };
      w = { x: e.x + E.x, y: e.y + E.y };
    }
    if (g !== null) {
      const E = g * Math.PI / 180;
      w = { x: e.x + Math.cos(E), y: e.y - Math.sin(E) };
    }
    const y = gr(e, w, m), x = { x: Un(y.x), y: Un(y.y) }, _ = n.level().nodes.find((E) => Math.hypot(E.x - x.x, E.y - x.y) < 1);
    return _ ? { pt: { x: _.x, y: _.y }, endpoint: { kind: "node", nodeId: _.id }, snap: u } : { pt: x, endpoint: { kind: "free", pt: x }, snap: u };
  }
  function c() {
    const u = f();
    if (!t || !u) return;
    const h = go(n.level(), t, u.endpoint, n.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    n.commit(h.level);
    const g = h.level.walls.find((_) => _.id === h.wallId);
    i === null && (i = g.a);
    const m = h.endNodeId === i, w = e, y = K(h.level, h.endNodeId), x = z(w, y);
    if (x > 0 && (r = { x: (y.x - w.x) / x, y: (y.y - w.y) / x }), l.clear(), m) {
      a();
      return;
    }
    t = { kind: "node", nodeId: h.endNodeId }, e = K(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(u) {
      if (s = u.pt, o = u.shift, !t) {
        const h = d(u.pt, !1);
        t = h.endpoint, e = h.pt;
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
      return o = h.shift, t ? l.key(u, c, a) : !1;
    },
    preview() {
      if (!e) return { snap: Ot(n.level(), s, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }) };
      const u = f();
      return {
        walls: [{ a: e, b: u.pt, props: n.wallProps() }],
        snap: u.snap,
        tracker: l.tracker(u.pt),
        orthoFrom: o ? e : void 0,
        anchor: e
      };
    },
    cancel() {
      a();
    }
  };
}
function kr(n, t) {
  let e = null;
  const i = () => n.openingDefaults(t);
  function s() {
    if (!e) return null;
    const o = n.level(), r = Ui(o, e, n.tolMm());
    if (!r) return null;
    const l = tt(o, o.walls.find((d) => d.id === r)), a = Nt(l, e).t;
    return { wallId: r, center: a, pt: M(l.a, k(l.dir, a)) };
  }
  return {
    id: t,
    down(o) {
      e = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = ao(n.level(), r.wallId, t, r.center, l.width, l);
      a.openingId !== null && n.commit(a.level);
    },
    move(o) {
      e = o.pt;
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      const o = s();
      if (!o) return {};
      const { width: r } = i(), l = o.center - r / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: o.wallId, offset: l, width: r, kind: t, invalid: !xe(n.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      e = null;
    }
  };
}
function _r(n) {
  return {
    id: "zone",
    down(t) {
      var s;
      const e = n.level(), i = ro(e, t.pt, n.zoneName());
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
const ji = 3, Bn = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
};
function Fi(n) {
  let t = null;
  const e = (s, o, r) => {
    const l = s.devices.find((f) => f.id === o), a = l ? Z(s, l) : null, d = l ? Be(s, l, n.scale()) : null;
    return !a || !d ? 0 : Oi(ut(I(r, a.pt)) - ut(I(d.to, a.pt)));
  };
  function i(s) {
    if (!t || !t.moved && z(s.pt, t.downPt) <= ji / n.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? Z(t.original, o) : null;
    if (!o || !r) return;
    const l = z(s.pt, r.pt), a = (ut(I(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, f = Ro(t.original, o, d, s.shift);
    t.work = JSON.stringify(f) === JSON.stringify(o.placement) ? t.original : Xe(t.original, o.id, f);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = n.level(), l = r.devices.find((d) => d.id === s), a = l ? Be(r, l, n.scale()) : null;
      return !l || !a || z(o.pt, a.to) > n.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: e(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && Bn(o.work, o.id) !== Bn(o.original, o.id) && n.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function jn(n, t, e) {
  const i = tt(n, n.walls.find((s) => s.id === t));
  return Nt(i, e).side > 0 ? "left" : "right";
}
function Hi(n, t) {
  const e = n.grid();
  return e && e > 0 ? { x: Math.round(t.x / e) * e, y: Math.round(t.y / e) * e } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function qi(n, t, e, i, s = 0) {
  const o = Ye[e];
  if (o.includes("wall")) {
    const r = Ot(t, i, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: jn(t, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of t.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const f = tt(t, d), c = Math.max(0, Math.min(f.len, Nt(f, i).t)), u = Math.hypot(i.x - (f.a.x + f.dir.x * c), i.y - (f.a.y + f.dir.y * c));
        (!a || u < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : f.len, d: u });
      }
      if (a) return { mode: "wall", wallId: a.id, side: jn(t, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Hi(n, i), rotation: s } : null;
}
function Er(n, t, e) {
  return yi(n.deviceDefaults(t), "free", e.mode);
}
function Sr(n, t) {
  let e = null, i;
  const s = Fi(n);
  function o() {
    if (!e) return null;
    const r = n.level(), l = qi(n, r, t, e);
    if (!l)
      return { placement: { mode: "free", ...Hi(n, e), rotation: 0 }, props: n.deviceDefaults(t), invalid: !0 };
    const a = Er(n, t, l), d = On(r, a, l, "").deviceId !== null;
    return { placement: l, props: a, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (e = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = n.level(), d = ei(p(`device.${t}`), a.devices.filter((c) => c.props.kind === t).map((c) => c.name)), f = On(a, l.props, l.placement, d);
      f.deviceId !== null && (n.commit(f.level), i = f.deviceId, n.select({ kind: "device", id: f.deviceId }));
    },
    move(r) {
      e = r.pt, s.active() && s.move(r);
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
      const l = o();
      return l ? { device: l } : {};
    },
    cancel() {
      s.cancel(), e = null, i = void 0;
    }
  };
}
const Fn = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
}, Mr = (n, t, e) => e === void 0 || Fn(n, e) !== Fn(t, e);
function Ir(n) {
  let t = null, e = null;
  const i = Fi(n);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (u) => {
    t = u, n.select(u);
  }, d = () => {
    e = null, s = null, o = null, r = !1;
  };
  function f(u) {
    if (!e || !s || !r && z(u.pt, l) <= ji / n.scale()) return;
    if (r = !0, u.pt.x === l.x && u.pt.y === l.y) {
      o = s;
      return;
    }
    const h = s.devices.find((P) => P.id === e.id);
    if (!h) return;
    const g = u.shift ? Li(l, u.pt) : u.pt, m = h.placement, w = m.mode === "free", y = w ? null : Z(s, h), x = m.mode === "free" ? m.rotation : y ? Pi(Math.round(ut(y.dir))) : 0, _ = qi(n, s, h.props.kind, w ? M(g, e.grab) : g, x), E = _ && _.mode === "wall" && m.mode === "wall" && m.aim !== void 0 ? { ..._, aim: m.aim } : _;
    o = E ? Xe(s, h.id, c(s, h.placement, E, g)) : s;
  }
  function c(u, h, g, m) {
    if (h.mode !== "wall" || g.mode !== "wall" || g.wallId !== h.wallId) return g;
    const w = u.walls.find((N) => N.id === h.wallId);
    if (!w) return g;
    const y = tt(u, w), x = Math.max(0, Math.min(y.len, h.offset + W(I(m, l), y.dir))), _ = Nt(y, m).side, E = n.tolMm(), P = h.side === "left" ? _ < -(y.rightOff + E) ? "right" : "left" : _ > y.leftOff + E ? "left" : "right";
    return { ...g, offset: x, side: P };
  }
  return {
    id: "device-select",
    down(u) {
      d(), l = u.pt;
      const h = n.level(), g = n.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, u)) return;
      const m = zo(h, u.pt, g);
      if (!m) {
        a(null);
        return;
      }
      a({ kind: "device", id: m });
      const w = h.devices.find((x) => x.id === m), y = Z(h, w);
      s = o = h, e = { id: m, grab: y && w.placement.mode === "free" ? I(y.pt, u.pt) : { x: 0, y: 0 } };
    },
    move(u) {
      i.active() ? i.move(u) : f(u);
    },
    up(u) {
      if (i.end(u)) return;
      e && f(u);
      const h = o, g = s, m = r, w = e == null ? void 0 : e.id;
      d(), m && h && g && h !== g && Mr(g, h, w) && n.commit(h);
    },
    key(u) {
      return u === "Escape" && i.cancel() ? !0 : u === "Escape" && e ? (d(), !0) : !1;
    },
    preview() {
      const u = i.working();
      return u ? { level: u } : e && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), a(null);
    }
  };
}
const Ar = ["select", "box", "wall", "door", "window", "opening", "zone"], Pr = [
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
];
function en(n) {
  return n === "plan" ? Ar : Pr;
}
function je(n, t) {
  switch (n) {
    case "select":
      return vr(t);
    case "box":
      return xr(t);
    case "wall":
      return br(t);
    case "door":
    case "window":
    case "opening":
      return kr(t, n);
    case "zone":
      return _r(t);
    case "device-select":
      return Ir(t);
    default:
      return Sr(t, n);
  }
}
function Hn(n, t) {
  return (t.kind === "wall" ? n.walls : t.kind === "node" ? n.nodes : t.kind === "opening" ? n.openings : t.kind === "device" ? n.devices : n.zones).some((i) => i.id === t.id);
}
function Or(n) {
  switch (n.saveState) {
    case "saving":
      return p("save.saving");
    case "conflict":
      return p("save.conflict");
    case "error":
      return p("save.error");
    default:
      return n.dirty ? p("save.dirty") : p(n.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Nr(n) {
  return b`
    <div class="top">
      ${n.lead ?? v}
      ${n.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${p("plan.pick")} title=${p("plan.pick")}
          ?disabled=${n.saveState === "saving"} .value=${st(n.planId)}
          @change=${(t) => {
    const e = t.target, i = e.value;
    e.value = n.planId, i !== n.planId && n.onPickPlan(i);
  }}>
          ${n.plans.map((t) => b`<option value=${t.id} ?selected=${t.id === n.planId}>${t.name}</option>`)}
        </select>` : v}
      <button class="btn" data-action="new-plan" title=${p("plan.new")} aria-label=${p("plan.new")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${p("plan.delete")} aria-label=${p("plan.delete")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onDeletePlan}>&#128465;</button>
      <input class="plan-name" .value=${st(n.planName)} aria-label=${p("plan.name")} title=${p("plan.name")}
        @change=${(t) => n.onRename(t.target.value)} />
      <span class="seg mode-tabs">
        ${["plan", "equipment"].map((t) => b`
          <button class="tab ${n.mode === t ? "on" : ""}" data-mode=${t} @click=${() => n.onMode(t)}>
            ${p(`mode.${t}`)}</button>`)}
      </span>
      <span class="sp"></span>
      <button class="btn" title=${p("action.undo")} aria-label=${p("action.undo")} ?disabled=${!n.canUndo}
        @click=${n.onUndo}>↶</button>
      <button class="btn" title=${p("action.redo")} aria-label=${p("action.redo")} ?disabled=${!n.canRedo}
        @click=${n.onRedo}>↷</button>
      <span class="save-state ${n.saveState}" title=${n.saveState === "error" ? n.errorMessage ?? "" : ""}>
        ${Or(n)}${n.saveState === "error" && n.errorMessage ? b`: ${n.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${n.saveState === "saving"} @click=${n.onSave}>
        ${p("action.save")}</button>
    </div>`;
}
function Dr(n, t, e) {
  return b`
    <div class="tools">
      ${en(n).map((i) => b`
        ${i === "zone" || i === "ceiling_light" ? b`<div class="tool-sep"></div>` : v}
        <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => e(i)}>
          ${p(`tool.${i}`)}</button>`)}
    </div>`;
}
function A(n, t) {
  return b`<label class="row"><span>${n}</span>${t}</label>`;
}
function Y(n, t, e, i) {
  return b`<select class="val" data-field=${i ?? v} .value=${st(n)} @change=${(s) => {
    const o = s.target;
    e(o.value) === !1 && (o.value = n);
  }}>
    ${t.map((s) => b`<option value=${s.v} ?selected=${s.v === n}>${s.label}</option>`)}
  </select>`;
}
function Ct(n) {
  const t = n.value === null ? "" : String(Math.round(n.value)), e = (i) => {
    var s;
    return (s = n.setNotice) == null ? void 0 : s.call(n, i);
  };
  return b`<input class="val" type="text" inputmode="numeric" data-field=${n.field ?? v}
    placeholder=${n.placeholder ?? v} title=${n.placeholder ?? v} .value=${st(t)}
    @change=${(i) => {
    const s = i.target;
    if (n.onBlank && s.value.trim() === "") {
      (n.value === null || n.onBlank() !== !1) && e(null);
      return;
    }
    const o = Jt(s.value, n.rule);
    if (o === null) {
      s.value = t, e(p(n.bad));
      return;
    }
    if (n.skipSame && o === n.value) {
      e(null);
      return;
    }
    if (n.apply(o) === !1) {
      s.value = t, e(p("props.noFit"));
      return;
    }
    e(null);
  }} />`;
}
function zr() {
  return {
    door: { width: oe.door, hinge: "start", swing: "left" },
    window: { width: oe.window, outside: "left" },
    opening: { width: oe.opening },
    zoneName: null
  };
}
function Cr(n, t) {
  return t === "door" ? { ...n.door } : t === "window" ? { ...n.window } : { width: n.opening.width };
}
function Wi(n) {
  return ei(p("zone.default"), n.zones.map((t) => t.name));
}
const Rr = (n) => n === "door" || n === "window" || n === "opening" || n === "zone";
function Tr(n) {
  const t = n.next;
  if (n.tool === "zone") {
    const r = t.zoneName ?? Wi(n.level);
    return b`
      <h4>${p("props.nextZone")}</h4>
      ${A(p("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${st(r)}
        @change=${(l) => {
      const a = l.target, d = a.value.trim();
      if (!d) {
        a.value = r;
        return;
      }
      d !== r && n.setNext({ ...t, zoneName: d });
    }} />`)}`;
  }
  if (n.tool !== "door" && n.tool !== "window" && n.tool !== "opening") return v;
  const e = n.tool, i = t[e].width, s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = (r) => n.setNext({ ...t, [e]: { ...t[e], ...r } });
  return b`
    <h4>${p(`props.next.${e}`)}</h4>
    ${A(`${p("props.width")}, ${p("unit.mm")}`, Ct({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: n.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      o({ width: r });
    }
  }))}
    ${e === "door" ? b`
      ${A(p("props.hinge"), Y(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${A(p("props.swing"), Y(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${e === "window" ? A(p("props.outside"), Y(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class Lr {
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
class Ur {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Oe(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(gn(p("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const e = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === e) ? e : t[0].id);
        }
      } catch (t) {
        this.h.loadError = jt(t);
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
        this.h.plans = await Oe(this.h.hass);
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
      this.h.notice = jt(e);
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
    this.h.toolId = en(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(gn(p("plan.default"))), this.offerDraft(null);
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
            await Eo(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = jt(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((e = this.h.pendingDraft) == null ? void 0 : e.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Oe(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = jt(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(ks) }, this.h.history = new Lr(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = je(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.needFit = !0;
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
    const t = `${this.h.plan.name} ${p("plan.copySuffix")}`, e = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(e, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
const qn = ni("", "");
function Br(n) {
  return {
    level: () => {
      var t;
      return ((t = n.history) == null ? void 0 : t.current) ?? qn;
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
    openingDefaults: (t) => Cr(n.nextObj, t),
    zoneName: () => {
      var t;
      return n.nextObj.zoneName ?? Wi(((t = n.history) == null ? void 0 : t.current) ?? qn);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      n.nextObj = { ...n.nextObj, zoneName: null };
    }
  };
}
const Ki = Object.keys(Ye), jr = (n) => Ki.includes(n);
function Fr() {
  return Object.fromEntries(Ki.map((n) => [n, Ne(n, "free")]));
}
const Vi = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Mt, max: Mt, signed: !0 }, bad: "props.badAim" }
}, Wt = (n, t, e, i, s) => Ct({ ...Vi[i], value: e, field: t, setNotice: n.onNotice, apply: s, skipSame: !0 }), Hr = ["round", "linear", "spot"], qr = ["rect", "circle"], Wr = ["boiler", "pc", "automation", "other"], le = (n, t) => n.map((e) => ({ v: e, label: p(`${t}.${e}`) }));
function Yi(n, t, e, i) {
  const s = (r, l, a) => A(`${p(l)}, ${p("unit.mm")}`, Wt(n, e + r, a, "mm", (d) => i({ [r]: d }))), o = (r, l, a) => A(`${p(l)}, ${p("unit.deg")}`, Wt(n, e + r, a, "angle", (d) => i({ [r]: d })));
  switch (t.kind) {
    case "ceiling_light":
      return b`
        ${A(p("props.shape"), Y(t.shape, le([...Hr], "shape"), (r) => i({ shape: r }), `${e}shape`))}
        ${t.shape === "linear" ? b`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${A(`${p("props.poolRadius")}, ${p("unit.mm")}`, Ct({
        ...Vi.mm,
        value: t.poolRadius,
        field: `${e}poolRadius`,
        placeholder: p("props.poolHint"),
        setNotice: n.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return b`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return b`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return A(`${p("props.diameter")}, ${p("unit.mm")}`, b`<select class="val" data-field=${`${e}diameter`}
        .value=${st(String(t.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== t.diameter && !i({ diameter: a }) && (l.value = String(t.diameter));
      }}>
        ${xs.map((r) => b`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "climate_sensor":
      return e === "" && n.device && n.level ? Vr(n.level, n.device, t.zoneIds, i) : Kr();
    case "equipment":
      return b`
        ${A(p("props.shape"), Y(t.shape, le([...qr], "shape"), (r) => i({ shape: r }), `${e}shape`))}
        ${t.shape === "rect" ? b`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${A(p("props.symbol"), Y(
        t.symbol,
        le([...Wr], "symbol"),
        (r) => i({ symbol: r }),
        `${e}symbol`
      ))}
        ${A(p("props.label"), b`<input class="val wide" type="text" data-field=${`${e}label`} .value=${st(t.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== t.label && i({ label: l });
      }} />`)}`;
    default:
      return b`<p class="muted">${p("props.noSettings")}</p>`;
  }
}
const Kr = () => b`${v}`;
function Vr(n, t, e, i) {
  var o;
  const s = e.length === 0 ? (o = n.zones.find((r) => r.id === Oo(n, t))) == null ? void 0 : o.name : void 0;
  return b`<fieldset class="zones" data-field="zoneIds"><legend>${p("props.zones")}${e.length === 0 ? b` (${p("props.zonesAuto")}${s ? `: ${s}` : ""})` : v}</legend>
    ${n.zones.map((r) => b`<label class="row"><input type="checkbox" data-zone=${r.id} .checked=${e.includes(r.id)}
      @change=${(l) => {
    const a = l.target.checked, d = n.zones.map((f) => f.id).filter((f) => f === r.id ? a : e.includes(f));
    i({ zoneIds: d }) || (l.target.checked = !a);
  }} /><span>${r.name}</span></label>`)}
  </fieldset>`;
}
function Yr(n, t) {
  const e = t.placement;
  if (e.mode === "free")
    return A(
      `${p("props.rotation")}, ${p("unit.deg")}`,
      Wt(n, "rotation", e.rotation, "rotation", (s) => n.onPlacement({ ...e, rotation: s }))
    );
  const i = ii.has(t.props.kind);
  return b`
    ${A(p("props.side"), Y(e.side, le(["left", "right"], "side"), (s) => n.onPlacement({ ...e, side: s }), "side"))}
    ${A(`${p("props.offset")}, ${p("unit.mm")}`, Wt(
    n,
    "offset",
    e.offset,
    "offset",
    (s) => n.onPlacement({ ...e, offset: s })
  ))}
    ${i ? A(
    `${p("props.aim")}, ${p("unit.deg")}`,
    Wt(n, "aim", e.aim ?? 0, "aim", (s) => n.onPlacement(zi(e, s)))
  ) : v}`;
}
function Gr(n, t) {
  return b`
    <h4>${p(`device.${t.props.kind}`)}</h4>
    ${A(p("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${st(t.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && n.onDevice({}, s);
  }} />`)}
    ${Yi(n, t.props, "", (e) => n.onDevice(e))}
    ${Yr(n, t)}
    ${t.invalid ? b`<p class="warn">${p("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => n.onDelete()}>${p("action.delete")}</button>`;
}
function Zr(n) {
  return n.device ? Gr(n, n.device) : n.nextKind && n.nextProps ? b`
      <h4>${p("props.nextDevice")}: ${p(`device.${n.nextKind}`)}</h4>
      ${Yi(n, n.nextProps, "next-", (t) => (n.onNext(t), !0))}` : b`<p class="muted">${p("props.none")}</p>`;
}
function Xr(n) {
  const { level: t, selection: e } = n, i = (e == null ? void 0 : e.kind) === "device" ? t.devices.find((r) => r.id === e.id) ?? null : null, s = jr(n.toolId) ? n.toolId : null, o = (r) => r === t ? (n.setNotice(p("props.noFit")), !1) : (n.setNotice(null), n.commit(r), !0);
  return b`<div class="props">
    ${Zr({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? n.nextProps[s] : null,
    onDevice: (r, l) => !!i && o(so(t, i.id, r, l)),
    onPlacement: (r) => !!i && o(Xe(t, i.id, r)),
    onNext: (r) => {
      s && n.setNextProps({ ...n.nextProps, [s]: { ...n.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && n.commit($i(t, i.id));
    },
    onNotice: (r) => n.setNotice(r)
  })}
    ${n.notice ? b`<p class="warn">${n.notice}</p>` : v}
  </div>`;
}
function Gi(n, t, e) {
  return Ct({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: n.setNotice, apply: e });
}
function Wn(n, t) {
  return t === n.level ? !1 : (n.commit(t), !0);
}
function Qr(n, t) {
  const e = tt(t.level, n).len, i = ["bearing", "partition", "railing", ...n.type === "fence" ? ["fence"] : []], s = (o) => t.commit(bo(t.level, n.id, o));
  return b`
    <h4>${p("props.wall")}</h4>
    ${A(p("props.type"), Y(
    n.type,
    i.map((o) => ({ v: o, label: p(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${A(p("props.thickness"), Gi(t, n.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${A(p("props.baseline"), Y(
    n.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: p(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${A(p("props.length"), b`<span class="val ro">${vt(e)} ${p("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(Ii(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function Jr(n, t) {
  const e = ["door", "window", "opening", ...pe.slice(1).includes(n.kind) ? [n.kind] : []], i = (r) => t.commit(uo(t.level, n.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = pe.includes(n.kind);
  return b`
    <h4>${p(`kind.${n.kind}`)}</h4>
    ${A(p("props.kind"), Y(n.kind, e.map((r) => ({ v: r, label: p(`kind.${r}`) })), (r) => i(ho(n, r))))}
    ${A(p("props.width"), Gi(t, n.width, (r) => Wn(t, co(t.level, n.id, r))))}
    ${A(p("props.offset"), Ct({
    value: n.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => Wn(t, ki(t.level, n.id, r))
  }))}
    ${o ? b`
      ${A(p("props.hinge"), Y(
    n.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${A(p("props.swing"), Y(n.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${n.kind === "window" ? A(p("props.outside"), Y(n.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${n.invalid ? b`<p class="warn">${p("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(_i(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function tl(n, t) {
  return b`
    <h4>${p("props.zone")}</h4>
    ${A(p("props.name"), b`<input class="val wide" type="text" .value=${st(n.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = n.name;
      return;
    }
    s !== n.name && t.commit(lo(t.level, n.id, s));
  }} />`)}
    ${A(p("props.area"), b`<span class="val ro">${Ri(wi(n.outline))}</span>`)}
    ${n.broken ? b`<p class="warn">${p("props.broken")}</p>` : v}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(xi(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function el(n) {
  const t = ["bearing", "partition", "railing"];
  return b`
    <h4>${p("props.newWall")}</h4>
    ${A(p("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(e) => n.setWallType(e.target.value)}>
      ${t.map((e) => b`<option value=${e} ?selected=${e === n.wallType}>${p(`walltype.${e}`)}</option>`)}
    </select>`)}
    ${A(`${p("props.thickness")}, ${p("unit.mm")}`, Ct({
    value: n.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: n.setNotice,
    field: "new-wall-thickness",
    apply: (e) => {
      n.setThickness(e);
    }
  }))}
    ${n.tool === "box" ? b`
      <div class="muted">${p("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((e) => b`
          <button class="tab ${n.boxMeasure === e ? "on" : ""}" data-measure=${e} @click=${() => n.setBoxMeasure(e)}>
            ${p(`measure.${e}`)}</button>`)}
      </div>` : v}`;
}
function nl(n) {
  const { level: t, selection: e } = n;
  let i = v;
  if ((e == null ? void 0 : e.kind) === "wall") {
    const s = t.walls.find((o) => o.id === e.id);
    s && (i = Qr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "opening") {
    const s = t.openings.find((o) => o.id === e.id);
    s && (i = Jr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "zone") {
    const s = t.zones.find((o) => o.id === e.id);
    s && (i = tl(s, n));
  } else if ((e == null ? void 0 : e.kind) === "node") {
    const s = t.nodes.find((o) => o.id === e.id);
    s && (i = b`<h4>${p("props.node")}</h4>
      ${A("X", b`<span class="val ro">${vt(s.x)}</span>`)}${A("Y", b`<span class="val ro">${vt(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === v && (n.tool === "wall" || n.tool === "box") ? el(n) : i === v && Rr(n.tool) ? Tr({ tool: n.tool, level: t, next: n.next, setNext: n.setNext, setNotice: n.setNotice }) : i === v ? b`<p class="muted">${p("props.none")}</p>` : i}
      ${n.notice ? b`<p class="warn">${n.notice}</p>` : v}
    </div>`;
}
function il(n, t) {
  const e = {
    level: t,
    selection: n.selection,
    notice: n.notice,
    commit: (i) => n.commit(i),
    setNotice: (i) => {
      n.notice = i;
    }
  };
  return n.mode === "equipment" ? Xr({ ...e, toolId: n.toolId, nextProps: n.nextProps, setNextProps: (i) => {
    n.nextProps = i;
  } }) : nl({
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
function sl(n) {
  return b`
    <div class="status">
      <span><span class="kbd">Shift</span> ${p("hint.shift")}</span>
      <span><span class="kbd">${p("hint.digits")}</span> ${p("hint.length")}</span>
      <span><span class="kbd">Tab</span> ${p("hint.tab")}</span>
      <span><span class="kbd">Esc</span> ${p("hint.esc")}</span>
      <span class="sp"></span>
      ${n.snap ? b`<span class="snap-kind">${n.snap}</span>` : ""}
      <span>${n.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${n.grid} @change=${(t) => n.onGrid(t.target.checked)} />
        ${p("status.grid")}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${n.cones}
          @change=${(t) => n.onCones(t.target.checked)} />
        ${p("status.cones")}
      </label>
    </div>`;
}
function ol(n, t) {
  var o, r;
  const e = t.palette, i = 1 / t.scale, s = [
    {
      label: p(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: n.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: n.field === "first",
      unit: p("unit.mm")
    },
    {
      label: p(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: n.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: n.field === "second",
      unit: t.mode === "box" ? p("unit.mm") : "°"
    }
  ];
  return S`
    <g class="tracker" transform=${`translate(${n.at.x + 18 * i} ${n.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${e.input} stroke=${e.inputBorder}></rect>
      ${s.map((l, a) => S`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${e.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${e.background}
          stroke=${l.active ? e.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? e.text : e.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function rl(n, t, e, i) {
  const s = n.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a, b: d } = s[0], f = Math.hypot(d.x - a.x, d.y - a.y);
    let c = Math.atan2(-(d.y - a.y), d.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: vt(f), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = e === "inner" ? -i : e === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: vt(r), second: vt(l) };
}
function ll(n) {
  return Object.entries(n).filter(([, t]) => typeof t == "string").map(([t, e]) => `--ps-${t}:${e}`).join(";");
}
const al = es`
  :host { display: block; height: 100%; outline: none; }
  .ed {
    display: grid; grid-template-columns: 64px 240px 1fr; grid-template-rows: auto 1fr 30px;
    height: 100vh; overflow: hidden; position: relative;
    background: var(--ps-background); color: var(--ps-text); font: 13px system-ui, sans-serif;
  }
  @media (max-width: 700px) {
    .ed { grid-template-columns: 54px 170px 1fr; }
    .props .row { flex-wrap: wrap; }
    .props .val { max-width: 100%; }
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
  .props { background: var(--ps-panel); border-right: 1px solid var(--ps-border); padding: 12px; min-width: 0; overflow-y: auto; }
  .props h4 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .06em;
    color: var(--ps-muted); }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 6px 0; }
  .row > span:first-child { color: var(--ps-muted); }
  .val { min-width: 70px; max-width: 120px; text-align: right; }
  .val.wide { max-width: 140px; text-align: left; }
  .val.ro { padding: 2px 6px; }
  .seg { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .seg.mode-tabs { display: inline-flex; margin-top: 0; }
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
`, cl = 5e-3, dl = 2, Fe = (n) => Math.max(cl, Math.min(dl, n));
function hl(n, t, e) {
  var r;
  const i = (r = n == null ? void 0 : n.getScreenCTM) == null ? void 0 : r.call(n), s = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (s && Number.isFinite(s.a) && Number.isFinite(s.d))
    return { x: s.a * e.clientX + s.c * e.clientY + s.e, y: s.b * e.clientX + s.d * e.clientY + s.f };
  const o = n == null ? void 0 : n.getBoundingClientRect();
  return {
    x: t.x + (e.clientX - ((o == null ? void 0 : o.left) ?? 0)) / t.scale,
    y: t.y + (e.clientY - ((o == null ? void 0 : o.top) ?? 0)) / t.scale
  };
}
function ul(n, t, e) {
  if (n.length === 0) return { x: -1e3, y: -1e3, scale: Fe(Math.min(t, e) / 12e3) };
  const i = n.map((c) => c.x), s = n.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, f = Fe(Math.min(t / (l - r), e / (d - a)));
  return { x: (r + l) / 2 - t / f / 2, y: (a + d) / 2 - e / f / 2, scale: f };
}
function fl(n, t, e) {
  const i = Fe(n.scale * Math.exp(-e * 15e-4));
  return { x: t.x - (t.x - n.x) * n.scale / i, y: t.y - (t.y - n.y) * n.scale / i, scale: i };
}
function pl(n, t, e) {
  return { ...n, x: n.x - t / n.scale, y: n.y - e / n.scale };
}
function gl(n, t, e, i) {
  const s = 100 * n.scale >= 6 ? 100 : 1e3, o = 1 / n.scale;
  return S`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${o}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${o}></path></pattern>
    </defs>
    <rect x=${n.x} y=${n.y} width=${t} height=${e} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const ml = ["Shift", "Control", "Alt", "Meta"];
function Kn(n) {
  const t = n.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class yl {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (e) => {
      var s, o;
      this.h.focus();
      const i = e.currentTarget;
      if (e.button === 1 || e.button === 0 && this.spaceDown) {
        e.preventDefault(), this.spacePending = !1, this.panFrom = { x: e.clientX, y: e.clientY }, (s = i.setPointerCapture) == null || s.call(i, e.pointerId);
        return;
      }
      e.button === 0 && ((o = i.setPointerCapture) == null || o.call(i, e.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(e)), this.h.requestUpdate());
    }, this.pointerMove = (e) => {
      if (this.panFrom) {
        this.h.view = pl(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y), this.panFrom = { x: e.clientX, y: e.clientY };
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
      e.preventDefault(), this.h.view = fl(this.h.view, this.h.toMm(e), e.deltaY);
    }, this.keyDown = (e) => {
      if (this.h.dialog !== null) {
        e.key === "Escape" && (e.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Kn(e) || !this.h.history) return;
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
      let o = this.h.activeTool.key(e.key, { shift: e.shiftKey });
      !o && (e.key === "Delete" || e.key === "Backspace") && (o = this.h.deleteSelection()), !o && e.key === "Escape" && (this.h.activeTool.cancel(), this.h.selection = null, o = !0), o && e.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (e) => {
      const i = this.h.dialog !== null || Kn(e), s = { shift: e.shiftKey };
      if (e.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !ml.includes(e.key) || (this.h.activeTool.key(e.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey };
  }
}
function Zi(n) {
  try {
    return new Date(n).toLocaleString();
  } catch {
    return new Date(n).toISOString();
  }
}
function $l(n) {
  return b`
    <div class="draft-banner" role="status">
      <span>${p("draft.banner").replace("{time}", Zi(n.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${n.onRestore}>${p("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${n.onDiscard}>${p("draft.discard")}</button>
    </div>`;
}
function Ut(n, t, e, i) {
  return b`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${n}</h3>
        <p>${t}</p>
        ${i ? b`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${e.map((s) => b`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function wl(n) {
  var e;
  const t = { action: "cancel", label: p("action.cancel"), onClick: n.close };
  switch ((e = n.dialog) == null ? void 0 : e.kind) {
    case "restore": {
      const i = n.draft;
      return i ? Ut(p("draft.title"), p("draft.text").replace("{time}", Zi(i.savedAt)), [
        { action: "restore", label: p("draft.restore"), primary: !0, onClick: () => n.restore(i) },
        { action: "discard", label: p("draft.discard"), onClick: () => n.discard(i) }
      ]) : v;
    }
    case "new":
      return Ut(p("new.title"), p("new.text"), [
        { action: "new-discard", label: p("new.discard"), primary: !0, onClick: n.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return Ut(p("delete.title"), p("delete.text").replace("{name}", n.planName), [
        { action: "delete-confirm", label: p("delete.confirm"), primary: !0, onClick: n.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return Ut(p("switch.title"), p("switch.text"), [
        { action: "switch-discard", label: p("switch.discard"), primary: !0, onClick: n.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = n.dialog.kind === "conflict-again";
      return Ut(p("conflict.title"), p(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: p("conflict.overwrite"), disabled: n.saving, onClick: n.overwrite }],
        { action: "save-as-new", label: p("conflict.saveAsNew"), primary: !0, disabled: n.saving, onClick: n.saveAsNew },
        t
      ], n.message);
    }
    default:
      return v;
  }
}
const Bt = "plan_studio.draft.", ie = "plan_studio.lastPlanId";
function vl() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function xl(n) {
  const t = n;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class bl {
  constructor(t = vl, e = 500) {
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
      (e = this.storage()) == null || e.setItem(Bt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var e;
    try {
      const i = (e = this.storage()) == null ? void 0 : e.getItem(Bt + t), s = i ? JSON.parse(i) : null;
      return xl(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(Bt))) continue;
        const o = this.read(s.slice(Bt.length));
        o && (!e || o.savedAt > e.savedAt) && (e = o);
      }
      return e;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var t;
    try {
      return ((t = this.storage()) == null ? void 0 : t.getItem(ie)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var e;
    try {
      (e = this.storage()) == null || e.setItem(ie, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const e = this.storage();
      (e == null ? void 0 : e.getItem(ie)) === t && e.removeItem(ie);
    } catch {
    }
  }
  clear(t) {
    var e;
    try {
      (e = this.storage()) == null || e.removeItem(Bt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
var kl = Object.defineProperty, T = (n, t, e, i) => {
  for (var s = void 0, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = r(t, e, s) || s);
  return s && kl(t, e, s), s;
};
const nn = class nn extends qt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = bs.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.cones = !0, this.nextProps = Fr(), this.nextObj = zr(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new bl(), this.resizeObs = null, this.session = new Ur(this), this.onBeforeUnload = (i) => {
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
    }), this.ctx = Br(this), this.activeTool = je("select", this.ctx), this.input = new yl(this);
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
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !Hn(t, this.selection) && (this.activeTool.cancel(), this.selection = null), this.requestUpdate());
  }
  /** Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). */
  deleteSelection() {
    var i;
    const t = this.selection, e = (i = this.history) == null ? void 0 : i.current;
    return !t || !e || t.kind === "node" || !Hn(e, t) ? !1 : (this.commit(t.kind === "wall" ? Ii(e, t.id) : t.kind === "opening" ? _i(e, t.id) : t.kind === "device" ? $i(e, t.id) : xi(e, t.id)), !0);
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
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = je(t, this.ctx);
  }
  /** Plan / Equipment tab: cancels the tool, clears the selection, activates the tab's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(en(t)[0]));
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return hl(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = ul(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return wl({
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
    var f, c, u;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${p("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${p("action.retry")}</button>` : p("load.loading")}</div>`;
    const t = ar(!!((c = (f = this.hass) == null ? void 0 : f.themes) != null && c.darkMode)), e = this.history.current, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, d = this.save;
    return b`
      <div class="ed" style=${ll(t)} @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Nr({
      mode: this.mode,
      onMode: (h) => this.setMode(h),
      planName: this.plan.name,
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: d.state,
      dirty: d.dirty,
      errorMessage: d.errorMessage,
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onRename: (h) => {
        this.plan = { ...this.plan, name: h }, d.markDirty();
      },
      onPickPlan: (h) => this.session.pickPlan(h),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Dr(this.mode, this.toolId, (h) => this.pickTool(h))}
        ${il(this, e)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(h) => h.preventDefault()}>
            ${this.grid ? gl(this.view, l, a, t) : v}
            ${or(e, { palette: t, selection: this.selection, preview: i, scale: r, mode: this.mode, showCones: this.cones })}
            ${i.tracker ? ol(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: rl(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((u = this.dialog) == null ? void 0 : u.kind) !== "restore" ? $l({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${sl({
      grid: this.grid,
      zoomPct: Math.round(r * 1e3),
      snap: i.snap && i.snap.kind !== "none" ? p(`snap.${i.snap.kind}`) : null,
      onGrid: (h) => {
        this.grid = h;
      },
      cones: this.cones,
      onCones: (h) => {
        this.cones = h;
      }
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
nn.styles = al;
let C = nn;
T([
  ye({ attribute: !1 })
], C.prototype, "hass");
T([
  ye({ type: Boolean })
], C.prototype, "narrow");
T([
  ye({ attribute: !1 })
], C.prototype, "panel");
T([
  U()
], C.prototype, "plan");
T([
  U()
], C.prototype, "loadError");
T([
  U()
], C.prototype, "selection");
T([
  U()
], C.prototype, "toolId");
T([
  U()
], C.prototype, "wallType");
T([
  U()
], C.prototype, "thickness");
T([
  U()
], C.prototype, "boxMeasure");
T([
  U()
], C.prototype, "grid");
T([
  U()
], C.prototype, "mode");
T([
  U()
], C.prototype, "cones");
T([
  U()
], C.prototype, "nextProps");
T([
  U()
], C.prototype, "nextObj");
T([
  U()
], C.prototype, "view");
T([
  U()
], C.prototype, "size");
T([
  U()
], C.prototype, "dialog");
T([
  U()
], C.prototype, "notice");
T([
  U()
], C.prototype, "pendingDraft");
T([
  U()
], C.prototype, "plans");
T([
  U()
], C.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", C);
export {
  C as PlanStudioPanel
};
