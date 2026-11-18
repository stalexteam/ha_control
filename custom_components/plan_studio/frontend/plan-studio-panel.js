/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ti = globalThis, ks = ti.ShadowRoot && (ti.ShadyCSS === void 0 || ti.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ms = Symbol(), Lr = /* @__PURE__ */ new WeakMap();
let Na = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Ms) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (ks && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Lr.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Lr.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Id = (t) => new Na(typeof t == "string" ? t : t + "", void 0, Ms), Pa = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, o, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new Na(n, t, Ms);
}, Ed = (t, e) => {
  if (ks) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), o = ti.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = n.cssText, t.appendChild(i);
  }
}, Cr = ks ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return Id(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Dd, defineProperty: Od, getOwnPropertyDescriptor: Nd, getOwnPropertyNames: Pd, getOwnPropertySymbols: Td, getPrototypeOf: Hd } = Object, Ye = globalThis, Ir = Ye.trustedTypes, Vd = Ir ? Ir.emptyScript : "", fo = Ye.reactiveElementPolyfillSupport, nn = (t, e) => t, di = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Vd : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let n = t;
  switch (e) {
    case Boolean:
      n = t !== null;
      break;
    case Number:
      n = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(t);
      } catch {
        n = null;
      }
  }
  return n;
} }, _s = (t, e) => !Dd(t, e), Er = { attribute: !0, type: String, converter: di, reflect: !1, useDefault: !1, hasChanged: _s };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ye.litPropertyMetadata ?? (Ye.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Mt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Er) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(e, i, n);
      o !== void 0 && Od(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: o, set: s } = Nd(this.prototype, e) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: o, set(r) {
      const l = o == null ? void 0 : o.call(this);
      s == null || s.call(this, r), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Er;
  }
  static _$Ei() {
    if (this.hasOwnProperty(nn("elementProperties"))) return;
    const e = Hd(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(nn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nn("properties"))) {
      const n = this.properties, i = [...Pd(n), ...Td(n)];
      for (const o of i) this.createProperty(o, n[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const n = litPropertyMetadata.get(e);
      if (n !== void 0) for (const [i, o] of n) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const o = this._$Eu(n, i);
      o !== void 0 && this._$Eh.set(o, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const n = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const o of i) n.unshift(Cr(o));
    } else e !== void 0 && n.push(Cr(e));
    return n;
  }
  static _$Eu(e, n) {
    const i = n.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((n) => n(this));
  }
  addController(e) {
    var n;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((n = e.hostConnected) == null || n.call(e));
  }
  removeController(e) {
    var n;
    (n = this._$EO) == null || n.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const i of n.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ed(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((n) => {
      var i;
      return (i = n.hostConnected) == null ? void 0 : i.call(n);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((n) => {
      var i;
      return (i = n.hostDisconnected) == null ? void 0 : i.call(n);
    });
  }
  attributeChangedCallback(e, n, i) {
    this._$AK(e, i);
  }
  _$ET(e, n) {
    var s;
    const i = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : di).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var s, r;
    const i = this.constructor, o = i._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const l = i.getPropertyOptions(o), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : di;
      this._$Em = o;
      const c = a.fromAttribute(n, l.type);
      this[o] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, o = !1, s) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (o === !1 && (s = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? _s)(s, n) || i.useDefault && i.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, n, { useDefault: i, reflect: o, wrapped: s }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? n ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (n = void 0), this._$AL.set(e, n)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [s, r] of o) {
        const { wrapped: l } = r, a = this[s];
        l !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, r, a);
      }
    }
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((o) => {
        var s;
        return (s = o.hostUpdate) == null ? void 0 : s.call(o);
      }), this.update(n)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
      var o;
      return (o = i.hostUpdated) == null ? void 0 : o.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((n) => this._$ET(n, this[n]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Mt.elementStyles = [], Mt.shadowRootOptions = { mode: "open" }, Mt[nn("elementProperties")] = /* @__PURE__ */ new Map(), Mt[nn("finalized")] = /* @__PURE__ */ new Map(), fo == null || fo({ ReactiveElement: Mt }), (Ye.reactiveElementVersions ?? (Ye.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const on = globalThis, Dr = (t) => t, hi = on.trustedTypes, Or = hi ? hi.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ta = "$lit$", qe = `lit$${Math.random().toFixed(9).slice(2)}$`, Ha = "?" + qe, zd = `<${Ha}>`, ft = document, gn = () => ft.createComment(""), bn = (t) => t === null || typeof t != "object" && typeof t != "function", As = Array.isArray, Rd = (t) => As(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", po = `[ 	
\f\r]`, jt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Nr = /-->/g, Pr = />/g, rt = RegExp(`>|${po}(?:([^\\s"'>=/]+)(${po}*=${po}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Tr = /'/g, Hr = /"/g, Va = /^(?:script|style|textarea|title)$/i, za = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), g = za(1), A = za(2), $e = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Vr = /* @__PURE__ */ new WeakMap(), at = ft.createTreeWalker(ft, 129);
function Ra(t, e) {
  if (!As(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Or !== void 0 ? Or.createHTML(e) : e;
}
const Bd = (t, e) => {
  const n = t.length - 1, i = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = jt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, h, f = -1, d = 0;
    for (; d < a.length && (r.lastIndex = d, h = r.exec(a), h !== null); ) d = r.lastIndex, r === jt ? h[1] === "!--" ? r = Nr : h[1] !== void 0 ? r = Pr : h[2] !== void 0 ? (Va.test(h[2]) && (o = RegExp("</" + h[2], "g")), r = rt) : h[3] !== void 0 && (r = rt) : r === rt ? h[0] === ">" ? (r = o ?? jt, f = -1) : h[1] === void 0 ? f = -2 : (f = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? rt : h[3] === '"' ? Hr : Tr) : r === Hr || r === Tr ? r = rt : r === Nr || r === Pr ? r = jt : (r = rt, o = void 0);
    const p = r === rt && t[l + 1].startsWith("/>") ? " " : "";
    s += r === jt ? a + zd : f >= 0 ? (i.push(c), a.slice(0, f) + Ta + a.slice(f) + qe + p) : a + qe + (f === -2 ? l : p);
  }
  return [Ra(t, s + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class wn {
  constructor({ strings: e, _$litType$: n }, i) {
    let o;
    this.parts = [];
    let s = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, h] = Bd(e, n);
    if (this.el = wn.createElement(c, i), at.currentNode = this.el.content, n === 2 || n === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (o = at.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const f of o.getAttributeNames()) if (f.endsWith(Ta)) {
          const d = h[r++], p = o.getAttribute(f).split(qe), m = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: s, name: m[2], strings: p, ctor: m[1] === "." ? Ud : m[1] === "?" ? Wd : m[1] === "@" ? jd : Bi }), o.removeAttribute(f);
        } else f.startsWith(qe) && (a.push({ type: 6, index: s }), o.removeAttribute(f));
        if (Va.test(o.tagName)) {
          const f = o.textContent.split(qe), d = f.length - 1;
          if (d > 0) {
            o.textContent = hi ? hi.emptyScript : "";
            for (let p = 0; p < d; p++) o.append(f[p], gn()), at.nextNode(), a.push({ type: 2, index: ++s });
            o.append(f[d], gn());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ha) a.push({ type: 2, index: s });
      else {
        let f = -1;
        for (; (f = o.data.indexOf(qe, f + 1)) !== -1; ) a.push({ type: 7, index: s }), f += qe.length - 1;
      }
      s++;
    }
  }
  static createElement(e, n) {
    const i = ft.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Et(t, e, n = t, i) {
  var r, l;
  if (e === $e) return e;
  let o = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const s = bn(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== s && ((l = o == null ? void 0 : o._$AO) == null || l.call(o, !1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = o : n._$Cl = o), o !== void 0 && (e = Et(t, o._$AS(t, e.values), o, i)), e;
}
class Fd {
  constructor(e, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: n }, parts: i } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? ft).importNode(n, !0);
    at.currentNode = o;
    let s = at.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new Ss(s, s.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (c = new qd(s, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (s = at.nextNode(), r++);
    }
    return at.currentNode = ft, o;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let Ss = class Ba {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, i, o) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = n.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, n = this) {
    e = Et(this, e, n), bn(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== $e && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Rd(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && bn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ft.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: n, _$litType$: i } = e, o = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = wn.createElement(Ra(i.h, i.h[0]), this.options)), i);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === o) this._$AH.p(n);
    else {
      const r = new Fd(o, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Vr.get(e.strings);
    return n === void 0 && Vr.set(e.strings, n = new wn(e)), n;
  }
  k(e) {
    As(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, o = 0;
    for (const s of e) o === n.length ? n.push(i = new Ba(this.O(gn()), this.O(gn()), this, this.options)) : i = n[o], i._$AI(s), o++;
    o < n.length && (this._$AR(i && i._$AB.nextSibling, o), n.length = o);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const o = Dr(e).nextSibling;
      Dr(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class Bi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, o, s) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = n, this._$AM = o, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(e, n = this, i, o) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = Et(this, e, n, 0), r = !bn(e) || e !== this._$AH && e !== $e, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = s[0], a = 0; a < s.length - 1; a++) c = Et(this, l[i + a], n, a), c === $e && (c = this._$AH[a]), r || (r = !bn(c) || c !== this._$AH[a]), c === v ? e = v : e !== v && (e += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ud extends Bi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class Wd extends Bi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
let jd = class extends Bi {
  constructor(e, n, i, o, s) {
    super(e, n, i, o, s), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Et(this, e, n, 0) ?? v) === $e) return;
    const i = this._$AH, o = e === v && i !== v || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== v && (i === v || o);
    o && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class qd {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Et(this, e);
  }
}
const mo = on.litHtmlPolyfillSupport;
mo == null || mo(wn, Ss), (on.litHtmlVersions ?? (on.litHtmlVersions = [])).push("3.3.3");
const Zd = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let o = i._$litPart$;
  if (o === void 0) {
    const s = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = o = new Ss(e.insertBefore(gn(), s), s, void 0, n ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = globalThis;
let Ct = class extends Mt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var n;
    const e = super.createRenderRoot();
    return (n = this.renderOptions).renderBefore ?? (n.renderBefore = e.firstChild), e;
  }
  update(e) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Zd(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return $e;
  }
};
var Oa;
Ct._$litElement$ = !0, Ct.finalized = !0, (Oa = ut.litElementHydrateSupport) == null || Oa.call(ut, { LitElement: Ct });
const go = ut.litElementPolyfillSupport;
go == null || go({ LitElement: Ct });
(ut.litElementVersions ?? (ut.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gd = { attribute: !0, type: String, converter: di, reflect: !1, hasChanged: _s }, Kd = (t = Gd, e, n) => {
  const { kind: i, metadata: o } = n;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(n.name, t), i === "accessor") {
    const { name: r } = n;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(r, a, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, t, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = n;
    return function(l) {
      const a = this[r];
      e.call(this, l), this.requestUpdate(r, a, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ze(t) {
  return (e, n) => typeof n == "object" ? Kd(t, e, n) : ((i, o, s) => {
    const r = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, i), r ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Z(t) {
  return ze({ ...t, state: !0, attribute: !1 });
}
function ie() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Ls(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const dt = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Xd = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Yd = { ...dt, role: "power_in" }, Qd = { ...dt, role: "power_out" }, Jd = { role: "sun", domains: ["sun"], primary: !0 }, eh = ["on", "off", "auto"], Cs = (t) => eh.includes(t), bo = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), th = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Jd
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [bo("on"), bo("off"), bo("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, dt],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, dt, Xd, Yd, Qd]
}, Is = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, nh = { climate_sensor: "any", illuminance_sensor: "any" };
function Oe(t) {
  const e = t.props, n = th[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: o }) => o === "power" ? !i : o === "power_in" || o === "power_out" ? i : !0);
  }
  return n;
}
function Fa(t) {
  return new Set(Oe(t).map((e) => e.role));
}
function Fi(t, e, n, i) {
  var l;
  const o = t.devices.find((a) => a.id === e);
  if (!o || !Fa(o).has(n)) return t;
  const s = (l = o.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (s === void 0) return t;
    const a = { ...o.bindings };
    delete a[n];
    const c = { ...o, bindings: a };
    if (Object.keys(a).length === 0 && delete c.bindings, n === "control" && o.props.kind === "equipment" && o.props.controllable) {
      const { controllable: h, ...f } = o.props;
      c.props = f;
    }
    return { ...t, devices: t.devices.map((h) => h === o ? c : h) };
  }
  if (s === i) return t;
  const r = { ...o, bindings: { ...o.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === o ? r : a) };
}
function ih(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), o = Oe(t).filter((l) => l.primary);
  if (i.length === 0) return o.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const s = o.filter((l) => !!n[l.role]);
  return (nh[t.props.kind] === "any" ? s.length > 0 : s.length === o.length) ? "bound" : "partial";
}
function oh(t) {
  const e = Oe(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const sh = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function Ko(t, e) {
  var o;
  const n = (o = t.bindings) == null ? void 0 : o[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Cs(e) ? n : `${n}|${sh(i[e])}`;
}
function rh(t, e, n) {
  const i = Ko(e, n);
  return i === null ? [] : t.devices.filter((o) => o.id !== e.id && Oe(o).some((s) => Ko(o, s.role) === i));
}
function lh(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Oe(t)) {
    const o = Cs(i) ? Ko(t, i) : null;
    o !== null && (e.has(o) ? n.push(i) : e.add(o));
  }
  return n;
}
function Ui(t) {
  if (!t.bindings) return t;
  const e = Fa(t), n = Object.entries(t.bindings).filter(([o, s]) => e.has(o) && !!s);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Ua = (t) => t === "wall_switch" || t === "smart_button", Wi = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", vn = (t) => t === "wall" ? "wall" : "free", ah = [100, 125, 150], Es = "mdi:cube-outline", zr = ["single", "double", "hold"], et = (t) => "button" in t, ch = {
  bearing: 400
}, ni = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Wa(t = ie(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Rr(t) {
  return {
    id: ie(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Wa()]
  };
}
const Ds = {
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
}, Dt = 90, ja = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function tt(t, e) {
  switch (t) {
    case "ceiling_light":
      return { kind: t, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: t, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: t, zoneAngle: e === "free" ? 360 : 110, zoneRange: 5e3 };
    case "exhaust_fan":
      return { kind: t, diameter: 100 };
    case "equipment":
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Es, label: "" };
    case "wall_switch":
    case "valve":
      return { kind: t, autoByDoubleToggle: !1, windowSec: 3 };
    case "smart_button":
      return {
        kind: t,
        separateOff: !1,
        autoEnabled: !1,
        on: { slot: 0, event: "single" },
        off: { slot: 0, event: "hold" },
        auto: { slot: 0, event: "double" }
      };
    default:
      return { kind: t };
  }
}
const uh = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Es
};
function dh(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, o = typeof e.icon == "string" ? e.icon : uh[String(n)] ?? Es;
  return { ...t, props: { ...i, icon: o } };
}
function hh(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = vn(t.placement.mode);
  return e ? { ...t, props: tt("smart_button", n), bindings: { on: e } } : { ...t, props: tt("wall_switch", n) };
}
const qa = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function fh(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = qa(n.slot, 0, 9) ? n.slot : e.slot, o = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && o === n.event ? t : { slot: i, event: o };
}
function ph(t) {
  const e = t.props.kind;
  if (!Wi(e)) return t;
  const n = t.props;
  let i = null;
  for (const [o, s] of Object.entries(tt(e, vn(t.placement.mode)))) {
    const r = n[o], l = o === "on" || o === "off" || o === "auto" ? fh(r, s) : o === "windowSec" ? qa(r, 1, 10) ? r : s : typeof r == typeof s ? r : s;
    l !== r && ((i ?? (i = { ...n }))[o] = l);
  }
  return i ? { ...t, props: i } : t;
}
function mh(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function gh(t) {
  if (!Wi(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function bh(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Ui(mh(gh(ph(hh(dh(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function R(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function P(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function N(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function K(t, e) {
  return t.x * e.x + t.y * e.y;
}
function ue(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Za(t) {
  return Math.hypot(t.x, t.y);
}
function z(t, e) {
  return Za(P(e, t));
}
function ji(t) {
  const e = Za(t);
  return e === 0 ? { x: 0, y: 0 } : N(t, 1 / e);
}
function se(t) {
  return { x: t.y, y: -t.x };
}
function Ga(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function Se(t, e, n, i) {
  const o = ue(e, i);
  if (Math.abs(o) < 1e-9) return null;
  const s = ue(P(n, t), i) / o;
  return R(t, N(e, s));
}
function qi(t, e, n) {
  const i = P(n, e), o = K(i, i);
  return o === 0 ? 0 : K(P(t, e), i) / o;
}
function Ie(t, e, n) {
  const i = P(n, e), o = K(i, i), s = o === 0 ? 0 : Math.max(0, Math.min(1, K(P(t, e), i) / o));
  return z(t, R(e, N(i, s)));
}
function Ot(t, e) {
  let n = !1;
  for (let i = 0, o = e.length - 1; i < e.length; o = i++) {
    const s = e[i], r = e[o];
    s.y > t.y != r.y > t.y && t.x < (r.x - s.x) * (t.y - s.y) / (r.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function Ee(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], o = t[(n + 1) % t.length];
    e += i.x * o.y - o.x * i.y;
  }
  return e / 2;
}
let nt = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function wh(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Ze(t, e, n) {
  const i = new nt(null, null);
  let o = i, s = i;
  for (; ; ) {
    const r = n(t, e.key);
    if (r < 0) {
      if (e.left === null) break;
      if (n(t, e.left.key) < 0) {
        const l = e.left;
        if (e.left = l.right, l.right = e, e = l, e.left === null) break;
      }
      s.left = e, s = e, e = e.left;
    } else if (r > 0) {
      if (e.right === null) break;
      if (n(t, e.right.key) > 0) {
        const l = e.right;
        if (e.right = l.left, l.left = e, e = l, e.right === null) break;
      }
      o.right = e, o = e, e = e.right;
    } else break;
  }
  return o.right = e.left, s.left = e.right, e.left = i.right, e.right = i.left, e;
}
function wo(t, e, n, i) {
  const o = new nt(t, e);
  if (n === null)
    return o.left = o.right = null, o;
  n = Ze(t, n, i);
  const s = i(t, n.key);
  return s < 0 ? (o.left = n.left, o.right = n, n.left = null) : s >= 0 && (o.right = n.right, o.left = n, n.right = null), o;
}
function Br(t, e, n) {
  let i = null, o = null;
  if (e) {
    e = Ze(t, e, n);
    const s = n(e.key, t);
    s === 0 ? (i = e.left, o = e.right) : s < 0 ? (o = e.right, e.right = null, i = e) : (i = e.left, e.left = null, o = e);
  }
  return { left: i, right: o };
}
function vh(t, e, n) {
  return e === null ? t : (t === null || (e = Ze(t.key, e, n), e.left = t), e);
}
function Xo(t, e, n, i, o) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${o(t)}
`);
    const s = e + (n ? "    " : "│   ");
    t.left && Xo(t.left, s, !1, i, o), t.right && Xo(t.right, s, !0, i, o);
  }
}
class Os {
  constructor(e = wh) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = wo(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new nt(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const o = this._comparator, s = Ze(e, this._root, o), r = o(e, s.key);
    return r === 0 ? this._root = s : (r < 0 ? (i.left = s.left, i.right = s, s.left = null) : r > 0 && (i.right = s.right, i.left = s, s.right = null), this._size++, this._root = i), this._root;
  }
  /**
   * @param  {Key} key
   * @return {Node|null}
   */
  remove(e) {
    this._root = this._remove(e, this._root, this._comparator);
  }
  /**
   * Deletes i from the tree if it's there
   */
  _remove(e, n, i) {
    let o;
    return n === null ? null : (n = Ze(e, n, i), i(e, n.key) === 0 ? (n.left === null ? o = n.right : (o = Ze(e, n.left, i), o.right = n.right), this._size--, o) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Ze(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
    }
    return null;
  }
  /**
   * Find without splaying
   */
  findStatic(e) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const o = i(e, n.key);
      if (o === 0) return n;
      o < 0 ? n = n.left : n = n.right;
    }
    return null;
  }
  find(e) {
    return this._root && (this._root = Ze(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
  }
  contains(e) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const o = i(e, n.key);
      if (o === 0) return !0;
      o < 0 ? n = n.left : n = n.right;
    }
    return !1;
  }
  forEach(e, n) {
    let i = this._root;
    const o = [];
    let s = !1;
    for (; !s; )
      i !== null ? (o.push(i), i = i.left) : o.length !== 0 ? (i = o.pop(), e.call(n, i), i = i.right) : s = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(e, n, i, o) {
    const s = [], r = this._comparator;
    let l = this._root, a;
    for (; s.length !== 0 || l; )
      if (l)
        s.push(l), l = l.left;
      else {
        if (l = s.pop(), a = r(l.key, n), a > 0)
          break;
        if (r(l.key, e) >= 0 && i.call(o, l))
          return this;
        l = l.right;
      }
    return this;
  }
  /**
   * Returns array of keys
   */
  keys() {
    const e = [];
    return this.forEach(({ key: n }) => {
      e.push(n);
    }), e;
  }
  /**
   * Returns array of all the data in the nodes
   */
  values() {
    const e = [];
    return this.forEach(({ data: n }) => {
      e.push(n);
    }), e;
  }
  min() {
    return this._root ? this.minNode(this._root).key : null;
  }
  max() {
    return this._root ? this.maxNode(this._root).key : null;
  }
  minNode(e = this._root) {
    if (e) for (; e.left; ) e = e.left;
    return e;
  }
  maxNode(e = this._root) {
    if (e) for (; e.right; ) e = e.right;
    return e;
  }
  /**
   * Returns node at given index
   */
  at(e) {
    let n = this._root, i = !1, o = 0;
    const s = [];
    for (; !i; )
      if (n)
        s.push(n), n = n.left;
      else if (s.length > 0) {
        if (n = s.pop(), o === e) return n;
        o++, n = n.right;
      } else i = !0;
    return null;
  }
  next(e) {
    let n = this._root, i = null;
    if (e.right) {
      for (i = e.right; i.left; ) i = i.left;
      return i;
    }
    const o = this._comparator;
    for (; n; ) {
      const s = o(e.key, n.key);
      if (s === 0) break;
      s < 0 ? (i = n, n = n.left) : n = n.right;
    }
    return i;
  }
  prev(e) {
    let n = this._root, i = null;
    if (e.left !== null) {
      for (i = e.left; i.right; ) i = i.right;
      return i;
    }
    const o = this._comparator;
    for (; n; ) {
      const s = o(e.key, n.key);
      if (s === 0) break;
      s < 0 ? n = n.left : (i = n, n = n.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return yh(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let o = e.length;
    const s = this._comparator;
    if (i && Jo(e, n, 0, o - 1, s), this._root === null)
      this._root = Yo(e, n, 0, o), this._size = o;
    else {
      const r = xh(
        this.toList(),
        $h(e, n),
        s
      );
      o = this._size + o, this._root = Qo({ head: r }, 0, o);
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
  toString(e = (n) => String(n.key)) {
    const n = [];
    return Xo(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const o = this._comparator;
    let { left: s, right: r } = Br(e, this._root, o);
    o(e, n) < 0 ? r = wo(n, i, r, o) : s = wo(n, i, s, o), this._root = vh(s, r, o);
  }
  split(e) {
    return Br(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function Yo(t, e, n, i) {
  const o = i - n;
  if (o > 0) {
    const s = n + Math.floor(o / 2), r = t[s], l = e[s], a = new nt(r, l);
    return a.left = Yo(t, e, n, s), a.right = Yo(t, e, s + 1, i), a;
  }
  return null;
}
function $h(t, e) {
  const n = new nt(null, null);
  let i = n;
  for (let o = 0; o < t.length; o++)
    i = i.next = new nt(t[o], e[o]);
  return i.next = null, n.next;
}
function yh(t) {
  let e = t;
  const n = [];
  let i = !1;
  const o = new nt(null, null);
  let s = o;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = s = s.next = n.pop(), e = e.right) : i = !0;
  return s.next = null, o.next;
}
function Qo(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const o = e + Math.floor(i / 2), s = Qo(t, e, o), r = t.head;
    return r.left = s, t.head = t.head.next, r.right = Qo(t, o + 1, n), r;
  }
  return null;
}
function xh(t, e, n) {
  const i = new nt(null, null);
  let o = i, s = t, r = e;
  for (; s !== null && r !== null; )
    n(s.key, r.key) < 0 ? (o.next = s, s = s.next) : (o.next = r, r = r.next), o = o.next;
  return s !== null ? o.next = s : r !== null && (o.next = r), i.next;
}
function Jo(t, e, n, i, o) {
  if (n >= i) return;
  const s = t[n + i >> 1];
  let r = n - 1, l = i + 1;
  for (; ; ) {
    do
      r++;
    while (o(t[r], s) < 0);
    do
      l--;
    while (o(t[l], s) > 0);
    if (r >= l) break;
    let a = t[r];
    t[r] = t[l], t[l] = a, a = e[r], e[r] = e[l], e[l] = a;
  }
  Jo(t, e, n, l, o), Jo(t, e, l + 1, i, o);
}
const He = 11102230246251565e-32, re = 134217729, kh = (3 + 8 * He) * He;
function vo(t, e, n, i, o) {
  let s, r, l, a, c = e[0], h = i[0], f = 0, d = 0;
  h > c == h > -c ? (s = c, c = e[++f]) : (s = h, h = i[++d]);
  let p = 0;
  if (f < t && d < n)
    for (h > c == h > -c ? (r = c + s, l = s - (r - c), c = e[++f]) : (r = h + s, l = s - (r - h), h = i[++d]), s = r, l !== 0 && (o[p++] = l); f < t && d < n; )
      h > c == h > -c ? (r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++f]) : (r = s + h, a = r - s, l = s - (r - a) + (h - a), h = i[++d]), s = r, l !== 0 && (o[p++] = l);
  for (; f < t; )
    r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++f], s = r, l !== 0 && (o[p++] = l);
  for (; d < n; )
    r = s + h, a = r - s, l = s - (r - a) + (h - a), h = i[++d], s = r, l !== 0 && (o[p++] = l);
  return (s !== 0 || p === 0) && (o[p++] = s), p;
}
function Mh(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function S(t) {
  return new Float64Array(t);
}
const _h = (3 + 16 * He) * He, Ah = (2 + 12 * He) * He, Sh = (9 + 64 * He) * He * He, yt = S(4), Fr = S(8), Ur = S(12), Wr = S(16), ce = S(4);
function Lh(t, e, n, i, o, s, r) {
  let l, a, c, h, f, d, p, m, $, w, b, y, x, M, k, _, C, L;
  const E = t - o, H = n - o, I = e - s, O = i - s;
  M = E * O, d = re * E, p = d - (d - E), m = E - p, d = re * O, $ = d - (d - O), w = O - $, k = m * w - (M - p * $ - m * $ - p * w), _ = I * H, d = re * I, p = d - (d - I), m = I - p, d = re * H, $ = d - (d - H), w = H - $, C = m * w - (_ - p * $ - m * $ - p * w), b = k - C, f = k - b, yt[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - _, f = x - b, yt[1] = x - (b + f) + (f - _), L = y + b, f = L - y, yt[2] = y - (L - f) + (b - f), yt[3] = L;
  let T = Mh(4, yt), B = Ah * r;
  if (T >= B || -T >= B || (f = t - E, l = t - (E + f) + (f - o), f = n - H, c = n - (H + f) + (f - o), f = e - I, a = e - (I + f) + (f - s), f = i - O, h = i - (O + f) + (f - s), l === 0 && a === 0 && c === 0 && h === 0) || (B = Sh * r + kh * Math.abs(T), T += E * h + O * l - (I * c + H * a), T >= B || -T >= B)) return T;
  M = l * O, d = re * l, p = d - (d - l), m = l - p, d = re * O, $ = d - (d - O), w = O - $, k = m * w - (M - p * $ - m * $ - p * w), _ = a * H, d = re * a, p = d - (d - a), m = a - p, d = re * H, $ = d - (d - H), w = H - $, C = m * w - (_ - p * $ - m * $ - p * w), b = k - C, f = k - b, ce[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - _, f = x - b, ce[1] = x - (b + f) + (f - _), L = y + b, f = L - y, ce[2] = y - (L - f) + (b - f), ce[3] = L;
  const D = vo(4, yt, 4, ce, Fr);
  M = E * h, d = re * E, p = d - (d - E), m = E - p, d = re * h, $ = d - (d - h), w = h - $, k = m * w - (M - p * $ - m * $ - p * w), _ = I * c, d = re * I, p = d - (d - I), m = I - p, d = re * c, $ = d - (d - c), w = c - $, C = m * w - (_ - p * $ - m * $ - p * w), b = k - C, f = k - b, ce[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - _, f = x - b, ce[1] = x - (b + f) + (f - _), L = y + b, f = L - y, ce[2] = y - (L - f) + (b - f), ce[3] = L;
  const U = vo(D, Fr, 4, ce, Ur);
  M = l * h, d = re * l, p = d - (d - l), m = l - p, d = re * h, $ = d - (d - h), w = h - $, k = m * w - (M - p * $ - m * $ - p * w), _ = a * c, d = re * a, p = d - (d - a), m = a - p, d = re * c, $ = d - (d - c), w = c - $, C = m * w - (_ - p * $ - m * $ - p * w), b = k - C, f = k - b, ce[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - _, f = x - b, ce[1] = x - (b + f) + (f - _), L = y + b, f = L - y, ce[2] = y - (L - f) + (b - f), ce[3] = L;
  const he = vo(U, Ur, 4, ce, Wr);
  return Wr[he - 1];
}
function Ch(t, e, n, i, o, s) {
  const r = (e - s) * (n - o), l = (t - o) * (i - s), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= _h * c ? a : -Lh(t, e, n, i, o, s, c);
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
const qt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, es = (t, e) => {
  if (e.ur.x < t.ll.x || t.ur.x < e.ll.x || e.ur.y < t.ll.y || t.ur.y < e.ll.y) return null;
  const n = t.ll.x < e.ll.x ? e.ll.x : t.ll.x, i = t.ur.x < e.ur.x ? t.ur.x : e.ur.x, o = t.ll.y < e.ll.y ? e.ll.y : t.ll.y, s = t.ur.y < e.ur.y ? t.ur.y : e.ur.y;
  return {
    ll: {
      x: n,
      y: o
    },
    ur: {
      x: i,
      y: s
    }
  };
};
let Ge = Number.EPSILON;
Ge === void 0 && (Ge = Math.pow(2, -52));
const Ih = Ge * Ge, jr = (t, e) => {
  if (-Ge < t && t < Ge && -Ge < e && e < Ge)
    return 0;
  const n = t - e;
  return n * n < Ih * t * e ? 0 : t < e ? -1 : 1;
};
class Eh {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new qr(), this.yRounder = new qr();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class qr {
  constructor() {
    this.tree = new Os(), this.round(0);
  }
  // Note: this can rounds input values backwards or forwards.
  //       You might ask, why not restrict this to just rounding
  //       forwards? Wouldn't that allow left endpoints to always
  //       remain left endpoints during splitting (never change to
  //       right). No - it wouldn't, because we snap intersections
  //       to endpoints (to establish independence from the segment
  //       angle for t-intersections).
  round(e) {
    const n = this.tree.add(e), i = this.tree.prev(n);
    if (i !== null && jr(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const o = this.tree.next(n);
    return o !== null && jr(n.key, o.key) === 0 ? (this.tree.remove(e), o.key) : e;
  }
}
const $n = new Eh(), ii = (t, e) => t.x * e.y - t.y * e.x, Ka = (t, e) => t.x * e.x + t.y * e.y, Zr = (t, e, n) => {
  const i = Ch(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, fi = (t) => Math.sqrt(Ka(t, t)), Dh = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return ii(o, i) / fi(o) / fi(i);
}, Oh = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Ka(o, i) / fi(o) / fi(i);
}, Gr = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Kr = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, Nh = (t, e, n, i) => {
  if (e.x === 0) return Kr(n, i, t.x);
  if (i.x === 0) return Kr(t, e, n.x);
  if (e.y === 0) return Gr(n, i, t.y);
  if (i.y === 0) return Gr(t, e, n.y);
  const o = ii(e, i);
  if (o == 0) return null;
  const s = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = ii(s, e) / o, l = ii(s, i) / o, a = t.x + l * e.x, c = n.x + r * i.x, h = t.y + l * e.y, f = n.y + r * i.y, d = (a + c) / 2, p = (h + f) / 2;
  return {
    x: d,
    y: p
  };
};
class we {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = we.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Qe.compare(e.segment, n.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(e, n) {
    return e.x < n.x ? -1 : e.x > n.x ? 1 : e.y < n.y ? -1 : e.y > n.y ? 1 : 0;
  }
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(e, n) {
    e.events === void 0 ? e.events = [this] : e.events.push(this), this.point = e, this.isLeft = n;
  }
  link(e) {
    if (e.point === this.point)
      throw new Error("Tried to link already linked events");
    const n = e.point.events;
    for (let i = 0, o = n.length; i < o; i++) {
      const s = n[i];
      this.point.events.push(s), s.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const e = this.point.events.length;
    for (let n = 0; n < e; n++) {
      const i = this.point.events[n];
      if (i.segment.consumedBy === void 0)
        for (let o = n + 1; o < e; o++) {
          const s = this.point.events[o];
          s.consumedBy === void 0 && i.otherSE.point.events === s.otherSE.point.events && i.segment.consume(s.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const e = [];
    for (let n = 0, i = this.point.events.length; n < i; n++) {
      const o = this.point.events[n];
      o !== this && !o.segment.ringOut && o.segment.isInResult() && e.push(o);
    }
    return e;
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
  getLeftmostComparator(e) {
    const n = /* @__PURE__ */ new Map(), i = (o) => {
      const s = o.otherSE;
      n.set(o, {
        sine: Dh(this.point, e.point, s.point),
        cosine: Oh(this.point, e.point, s.point)
      });
    };
    return (o, s) => {
      n.has(o) || i(o), n.has(s) || i(s);
      const {
        sine: r,
        cosine: l
      } = n.get(o), {
        sine: a,
        cosine: c
      } = n.get(s);
      return r >= 0 && a >= 0 ? l < c ? 1 : l > c ? -1 : 0 : r < 0 && a < 0 ? l < c ? -1 : l > c ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let Ph = 0;
class Qe {
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
  static compare(e, n) {
    const i = e.leftSE.point.x, o = n.leftSE.point.x, s = e.rightSE.point.x, r = n.rightSE.point.x;
    if (r < i) return 1;
    if (s < o) return -1;
    const l = e.leftSE.point.y, a = n.leftSE.point.y, c = e.rightSE.point.y, h = n.rightSE.point.y;
    if (i < o) {
      if (a < l && a < c) return 1;
      if (a > l && a > c) return -1;
      const f = e.comparePoint(n.leftSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
      const d = n.comparePoint(e.rightSE.point);
      return d !== 0 ? d : -1;
    }
    if (i > o) {
      if (l < a && l < h) return -1;
      if (l > a && l > h) return 1;
      const f = n.comparePoint(e.leftSE.point);
      if (f !== 0) return f;
      const d = e.comparePoint(n.rightSE.point);
      return d < 0 ? 1 : d > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (s < r) {
      const f = n.comparePoint(e.rightSE.point);
      if (f !== 0) return f;
    }
    if (s > r) {
      const f = e.comparePoint(n.rightSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
    }
    if (s !== r) {
      const f = c - l, d = s - i, p = h - a, m = r - o;
      if (f > d && p < m) return 1;
      if (f < d && p > m) return -1;
    }
    return s > r ? 1 : s < r || c < h ? -1 : c > h ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, o) {
    this.id = ++Ph, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = o;
  }
  static fromRing(e, n, i) {
    let o, s, r;
    const l = we.comparePoints(e, n);
    if (l < 0)
      o = e, s = n, r = 1;
    else if (l > 0)
      o = n, s = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new we(o, !0), c = new we(s, !1);
    return new Qe(a, c, [i], [r]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(e) {
    this.rightSE = e, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const e = this.leftSE.point.y, n = this.rightSE.point.y;
    return {
      ll: {
        x: this.leftSE.point.x,
        y: e < n ? e : n
      },
      ur: {
        x: this.rightSE.point.x,
        y: e > n ? e : n
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
  isAnEndpoint(e) {
    return e.x === this.leftSE.point.x && e.y === this.leftSE.point.y || e.x === this.rightSE.point.x && e.y === this.rightSE.point.y;
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
  comparePoint(e) {
    if (this.isAnEndpoint(e)) return 0;
    const n = this.leftSE.point, i = this.rightSE.point, o = this.vector();
    if (n.x === i.x)
      return e.x === n.x ? 0 : e.x < n.x ? 1 : -1;
    const s = (e.y - n.y) / o.y, r = n.x + s * o.x;
    if (e.x === r) return 0;
    const l = (e.x - n.x) / o.x, a = n.y + l * o.y;
    return e.y === a ? 0 : e.y < a ? -1 : 1;
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
  getIntersection(e) {
    const n = this.bbox(), i = e.bbox(), o = es(n, i);
    if (o === null) return null;
    const s = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = qt(n, l) && this.comparePoint(l) === 0, h = qt(i, s) && e.comparePoint(s) === 0, f = qt(n, a) && this.comparePoint(a) === 0, d = qt(i, r) && e.comparePoint(r) === 0;
    if (h && c)
      return d && !f ? r : !d && f ? a : null;
    if (h)
      return f && s.x === a.x && s.y === a.y ? null : s;
    if (c)
      return d && r.x === l.x && r.y === l.y ? null : l;
    if (d && f) return null;
    if (d) return r;
    if (f) return a;
    const p = Nh(s, this.vector(), l, e.vector());
    return p === null || !qt(o, p) ? null : $n.round(p.x, p.y);
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
  split(e) {
    const n = [], i = e.events !== void 0, o = new we(e, !0), s = new we(e, !1), r = this.rightSE;
    this.replaceRightSE(s), n.push(s), n.push(o);
    const l = new Qe(o, r, this.rings.slice(), this.windings.slice());
    return we.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), we.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (o.checkForConsuming(), s.checkForConsuming()), n;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const e = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = e, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let n = 0, i = this.windings.length; n < i; n++)
      this.windings[n] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(e) {
    let n = this, i = e;
    for (; n.consumedBy; ) n = n.consumedBy;
    for (; i.consumedBy; ) i = i.consumedBy;
    const o = Qe.compare(n, i);
    if (o !== 0) {
      if (o > 0) {
        const s = n;
        n = i, i = s;
      }
      if (n.prev === i) {
        const s = n;
        n = i, i = s;
      }
      for (let s = 0, r = i.rings.length; s < r; s++) {
        const l = i.rings[s], a = i.windings[s], c = n.rings.indexOf(l);
        c === -1 ? (n.rings.push(l), n.windings.push(a)) : n.windings[c] += a;
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
      const e = this.prev.consumedBy || this.prev;
      this._beforeState = e.afterState();
    }
    return this._beforeState;
  }
  afterState() {
    if (this._afterState !== void 0) return this._afterState;
    const e = this.beforeState();
    this._afterState = {
      rings: e.rings.slice(0),
      windings: e.windings.slice(0),
      multiPolys: []
    };
    const n = this._afterState.rings, i = this._afterState.windings, o = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const c = this.rings[l], h = this.windings[l], f = n.indexOf(c);
      f === -1 ? (n.push(c), i.push(h)) : i[f] += h;
    }
    const s = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const c = n[l], h = c.poly;
      if (r.indexOf(h) === -1)
        if (c.isExterior) s.push(h);
        else {
          r.indexOf(h) === -1 && r.push(h);
          const f = s.indexOf(c.poly);
          f !== -1 && s.splice(f, 1);
        }
    }
    for (let l = 0, a = s.length; l < a; l++) {
      const c = s[l].multiPoly;
      o.indexOf(c) === -1 && o.push(c);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (ke.type) {
      case "union": {
        const i = e.length === 0, o = n.length === 0;
        this._isInResult = i !== o;
        break;
      }
      case "intersection": {
        let i, o;
        e.length < n.length ? (i = e.length, o = n.length) : (i = n.length, o = e.length), this._isInResult = o === ke.numMultiPolys && i < o;
        break;
      }
      case "xor": {
        const i = Math.abs(e.length - n.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (o) => o.length === 1 && o[0].isSubject;
        this._isInResult = i(e) !== i(n);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${ke.type}`);
    }
    return this._isInResult;
  }
}
class Xr {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const o = $n.round(e[0][0], e[0][1]);
    this.bbox = {
      ll: {
        x: o.x,
        y: o.y
      },
      ur: {
        x: o.x,
        y: o.y
      }
    };
    let s = o;
    for (let r = 1, l = e.length; r < l; r++) {
      if (typeof e[r][0] != "number" || typeof e[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let a = $n.round(e[r][0], e[r][1]);
      a.x === s.x && a.y === s.y || (this.segments.push(Qe.fromRing(s, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), s = a);
    }
    (o.x !== s.x || o.y !== s.y) && this.segments.push(Qe.fromRing(s, o, this));
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.segments.length; n < i; n++) {
      const o = this.segments[n];
      e.push(o.leftSE), e.push(o.rightSE);
    }
    return e;
  }
}
class Th {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Xr(e[0], this, !0), this.bbox = {
      ll: {
        x: this.exteriorRing.bbox.ll.x,
        y: this.exteriorRing.bbox.ll.y
      },
      ur: {
        x: this.exteriorRing.bbox.ur.x,
        y: this.exteriorRing.bbox.ur.y
      }
    }, this.interiorRings = [];
    for (let i = 1, o = e.length; i < o; i++) {
      const s = new Xr(e[i], this, !1);
      s.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = s.bbox.ll.x), s.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = s.bbox.ll.y), s.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = s.bbox.ur.x), s.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = s.bbox.ur.y), this.interiorRings.push(s);
    }
    this.multiPoly = n;
  }
  getSweepEvents() {
    const e = this.exteriorRing.getSweepEvents();
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const o = this.interiorRings[n].getSweepEvents();
      for (let s = 0, r = o.length; s < r; s++)
        e.push(o[s]);
    }
    return e;
  }
}
class Yr {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    try {
      typeof e[0][0][0] == "number" && (e = [e]);
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
    for (let i = 0, o = e.length; i < o; i++) {
      const s = new Th(e[i], this);
      s.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = s.bbox.ll.x), s.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = s.bbox.ll.y), s.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = s.bbox.ur.x), s.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = s.bbox.ur.y), this.polys.push(s);
    }
    this.isSubject = n;
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const o = this.polys[n].getSweepEvents();
      for (let s = 0, r = o.length; s < r; s++)
        e.push(o[s]);
    }
    return e;
  }
}
class pi {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.isInResult() || s.ringOut) continue;
      let r = null, l = s.leftSE, a = s.rightSE;
      const c = [l], h = l.point, f = [];
      for (; r = l, l = a, c.push(l), l.point !== h; )
        for (; ; ) {
          const d = l.getAvailableLinkedEvents();
          if (d.length === 0) {
            const $ = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${$.x}, ${$.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (d.length === 1) {
            a = d[0].otherSE;
            break;
          }
          let p = null;
          for (let $ = 0, w = f.length; $ < w; $++)
            if (f[$].point === l.point) {
              p = $;
              break;
            }
          if (p !== null) {
            const $ = f.splice(p)[0], w = c.splice($.index);
            w.unshift(w[0].otherSE), n.push(new pi(w.reverse()));
            continue;
          }
          f.push({
            index: c.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = d.sort(m)[0].otherSE;
          break;
        }
      n.push(new pi(c));
    }
    return n;
  }
  constructor(e) {
    this.events = e;
    for (let n = 0, i = e.length; n < i; n++)
      e[n].segment.ringOut = this;
    this.poly = null;
  }
  getGeom() {
    let e = this.events[0].point;
    const n = [e];
    for (let c = 1, h = this.events.length - 1; c < h; c++) {
      const f = this.events[c].point, d = this.events[c + 1].point;
      Zr(f, e, d) !== 0 && (n.push(f), e = f);
    }
    if (n.length === 1) return null;
    const i = n[0], o = n[1];
    Zr(i, e, o) === 0 && n.shift(), n.push(n[0]);
    const s = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let c = r; c != l; c += s) a.push([n[c].x, n[c].y]);
    return a;
  }
  isExteriorRing() {
    if (this._isExteriorRing === void 0) {
      const e = this.enclosingRing();
      this._isExteriorRing = e ? !e.isExteriorRing() : !0;
    }
    return this._isExteriorRing;
  }
  enclosingRing() {
    return this._enclosingRing === void 0 && (this._enclosingRing = this._calcEnclosingRing()), this._enclosingRing;
  }
  /* Returns the ring that encloses this one, if any */
  _calcEnclosingRing() {
    let e = this.events[0];
    for (let o = 1, s = this.events.length; o < s; o++) {
      const r = this.events[o];
      we.compare(e, r) > 0 && (e = r);
    }
    let n = e.segment.prevInResult(), i = n ? n.prevInResult() : null;
    for (; ; ) {
      if (!n) return null;
      if (!i) return n.ringOut;
      if (i.ringOut !== n.ringOut)
        return i.ringOut.enclosingRing() !== n.ringOut ? n.ringOut : n.ringOut.enclosingRing();
      n = i.prevInResult(), i = n ? n.prevInResult() : null;
    }
  }
}
class Qr {
  constructor(e) {
    this.exteriorRing = e, e.poly = this, this.interiorRings = [];
  }
  addInterior(e) {
    this.interiorRings.push(e), e.poly = this;
  }
  getGeom() {
    const e = [this.exteriorRing.getGeom()];
    if (e[0] === null) return null;
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const o = this.interiorRings[n].getGeom();
      o !== null && e.push(o);
    }
    return e;
  }
}
class Hh {
  constructor(e) {
    this.rings = e, this.polys = this._composePolys(e);
  }
  getGeom() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const o = this.polys[n].getGeom();
      o !== null && e.push(o);
    }
    return e;
  }
  _composePolys(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.poly)
        if (s.isExteriorRing()) n.push(new Qr(s));
        else {
          const r = s.enclosingRing();
          r.poly || n.push(new Qr(r)), r.poly.addInterior(s);
        }
    }
    return n;
  }
}
class Vh {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Qe.compare;
    this.queue = e, this.tree = new Os(n), this.segments = [];
  }
  process(e) {
    const n = e.segment, i = [];
    if (e.consumedBy)
      return e.isLeft ? this.queue.remove(e.otherSE) : this.tree.remove(n), i;
    const o = e.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!o) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let s = o, r = o, l, a;
    for (; l === void 0; )
      s = this.tree.prev(s), s === null ? l = null : s.key.consumedBy === void 0 && (l = s.key);
    for (; a === void 0; )
      r = this.tree.next(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    if (e.isLeft) {
      let c = null;
      if (l) {
        const f = l.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (c = f), !l.isAnEndpoint(f))) {
          const d = this._splitSafely(l, f);
          for (let p = 0, m = d.length; p < m; p++)
            i.push(d[p]);
        }
      }
      let h = null;
      if (a) {
        const f = a.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (h = f), !a.isAnEndpoint(f))) {
          const d = this._splitSafely(a, f);
          for (let p = 0, m = d.length; p < m; p++)
            i.push(d[p]);
        }
      }
      if (c !== null || h !== null) {
        let f = null;
        c === null ? f = h : h === null ? f = c : f = we.comparePoints(c, h) <= 0 ? c : h, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const d = n.split(f);
        for (let p = 0, m = d.length; p < m; p++)
          i.push(d[p]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const c = l.getIntersection(a);
        if (c !== null) {
          if (!l.isAnEndpoint(c)) {
            const h = this._splitSafely(l, c);
            for (let f = 0, d = h.length; f < d; f++)
              i.push(h[f]);
          }
          if (!a.isAnEndpoint(c)) {
            const h = this._splitSafely(a, c);
            for (let f = 0, d = h.length; f < d; f++)
              i.push(h[f]);
          }
        }
      }
      this.tree.remove(n);
    }
    return i;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(e, n) {
    this.tree.remove(e);
    const i = e.rightSE;
    this.queue.remove(i);
    const o = e.split(n);
    return o.push(i), e.consumedBy === void 0 && this.tree.add(e), o;
  }
}
const Jr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, zh = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Rh {
  run(e, n, i) {
    ke.type = e, $n.reset();
    const o = [new Yr(n, !0)];
    for (let f = 0, d = i.length; f < d; f++)
      o.push(new Yr(i[f], !1));
    if (ke.numMultiPolys = o.length, ke.type === "difference") {
      const f = o[0];
      let d = 1;
      for (; d < o.length; )
        es(o[d].bbox, f.bbox) !== null ? d++ : o.splice(d, 1);
    }
    if (ke.type === "intersection")
      for (let f = 0, d = o.length; f < d; f++) {
        const p = o[f];
        for (let m = f + 1, $ = o.length; m < $; m++)
          if (es(p.bbox, o[m].bbox) === null) return [];
      }
    const s = new Os(we.compare);
    for (let f = 0, d = o.length; f < d; f++) {
      const p = o[f].getSweepEvents();
      for (let m = 0, $ = p.length; m < $; m++)
        if (s.insert(p[m]), s.size > Jr)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Vh(s);
    let l = s.size, a = s.pop();
    for (; a; ) {
      const f = a.key;
      if (s.size === l) {
        const p = f.segment;
        throw new Error(`Unable to pop() ${f.isLeft ? "left" : "right"} SweepEvent [${f.point.x}, ${f.point.y}] from segment #${p.id} [${p.leftSE.point.x}, ${p.leftSE.point.y}] -> [${p.rightSE.point.x}, ${p.rightSE.point.y}] from queue.`);
      }
      if (s.size > Jr)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > zh)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const d = r.process(f);
      for (let p = 0, m = d.length; p < m; p++) {
        const $ = d[p];
        $.consumedBy === void 0 && s.insert($);
      }
      l = s.size, a = s.pop();
    }
    $n.reset();
    const c = pi.factory(r.segments);
    return new Hh(c).getGeom();
  }
}
const ke = new Rh(), Bh = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ke.run("union", t, n);
}, Fh = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ke.run("intersection", t, n);
}, Uh = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ke.run("xor", t, n);
}, Wh = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ke.run("difference", t, n);
};
var Xa = {
  union: Bh,
  intersection: Fh,
  xor: Uh,
  difference: Wh
};
const Ya = 3, jh = 1e-6;
function Zi(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function te(t, e) {
  const n = Zi(t, e);
  return { x: n.x, y: n.y };
}
function wt(t, e) {
  const n = t.walls.find((s) => s.id === e);
  if (!n) return null;
  const i = t.nodes.find((s) => s.id === n.a), o = t.nodes.find((s) => s.id === n.b);
  return !i || !o ? null : z(i, o);
}
function Qa(t, e, n, i) {
  const o = n, [s, r] = i === "left" ? [0, o] : i === "right" ? [o, 0] : [o / 2, o / 2];
  return { a: t, b: e, dir: ji(P(e, t)), len: z(t, e), leftOff: s, rightOff: r };
}
function ae(t, e) {
  return Qa(te(t, e.a), te(t, e.b), e.thickness, e.baseline);
}
function ot(t, e) {
  const n = P(e, t.a);
  return { t: K(n, t.dir), side: K(n, se(t.dir)) };
}
function el(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: N(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const _t = (t) => R(t.p, N(se(t.u), t.offL)), At = (t) => P(t.p, N(se(t.u), t.offR));
function ct(t, e, n) {
  return t !== null && z(t, e) <= n;
}
function qh(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ae(t, n);
    if (i.len < 1e-9) continue;
    const o = se(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: R(i.a, N(o, i.leftOff)),
        ar: P(i.a, N(o, i.rightOff)),
        bl: R(i.b, N(o, i.leftOff)),
        br: P(i.b, N(o, i.rightOff))
      }
    });
  }
  return e;
}
function Zh(t, e) {
  const n = e.f, i = se(n.dir);
  for (const o of t) {
    if (o.body === e) continue;
    const r = K(P(o.far, n.a), i) >= 0 ? R(n.a, N(i, n.leftOff)) : P(n.a, N(i, n.rightOff)), l = Ya * Math.max(o.body.wall.thickness, e.wall.thickness), a = Se(_t(o), o.u, r, n.dir), c = Se(At(o), o.u, r, n.dir);
    ct(a, o.p, l) && (o.body.c[o.leftKey] = a), ct(c, o.p, l) && (o.body.c[o.rightKey] = c);
  }
}
function Gh(t, e) {
  t.sort((o, s) => Math.atan2(o.u.y, o.u.x) - Math.atan2(s.u.y, s.u.x));
  const n = Ya * Math.max(...t.map((o) => o.body.wall.thickness));
  for (let o = 0; o < t.length; o++) {
    const s = t[o], r = t[(o + 1) % t.length], l = Se(At(s), s.u, _t(r), r.u);
    ct(l, e, n) && (s.body.c[s.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Kh(t, e, n);
  for (const o of t) {
    if (i.has(o)) continue;
    const s = o.body.c[o.leftKey], r = o.body.c[o.rightKey], l = P(r, s), a = ue(l, P(e, s)), c = ue(l, P(o.far, s));
    a * c < 0 && ts(o, [e]);
  }
}
function ts(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Kh(t, e, n) {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o], r = t[(o + 1) % i];
    if (Math.abs(ue(s.u, r.u)) > 1e-9 || K(s.u, r.u) > 0) continue;
    const l = s.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(o + 2) % i], c = Se(At(s), s.u, _t(a), a.u), h = Se(_t(r), r.u, _t(a), a.u);
        if (!ct(c, e, n) || !ct(h, e, n)) continue;
        const f = r.body.c[r.rightKey];
        s.body.c[s.rightKey] = c, r.body.c[r.leftKey] = h, ts(s, [e, f, h]);
      } else {
        const a = t[(o - 1 + i) % i], c = Se(_t(r), r.u, At(a), a.u), h = Se(At(s), s.u, At(a), a.u);
        if (!ct(h, e, n) || !ct(c, e, n)) continue;
        const f = s.body.c[s.leftKey];
        s.body.c[s.rightKey] = h, r.body.c[r.leftKey] = c, ts(r, [h, f, e]);
      }
      return /* @__PURE__ */ new Set([s, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Ns(t) {
  const e = qh(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const o = [];
    for (const r of e)
      r.wall.a === i.id && o.push(el(r, "a")), r.wall.b === i.id && o.push(el(r, "b"));
    if (o.length === 0) continue;
    const s = i.host ? n.get(i.host.wallId) : void 0;
    s ? Zh(o, s) : o.length >= 2 && Gh(o, { x: i.x, y: i.y });
  }
  return e;
}
function Ja(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Ns(t))
    for (const [o, s, r] of n) {
      const l = i.c[o];
      e.push({ pt: l, wallId: i.wall.id, side: s, end: r, offset: K(P(l, i.f.a), i.f.dir) });
    }
  return e;
}
function ec(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Gi(t) {
  return new Map(Ns(t).map((e) => [e.wall.id, ec(e)]));
}
function tl(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const o = t[i], s = t[(i + 1) % t.length], r = e(o), l = e(s);
    r >= 0 && n.push(o), r >= 0 != l >= 0 && n.push(R(o, N(P(s, o), r / (r - l))));
  }
  return n;
}
function Ps(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ns(t)) {
    const o = ec(i), s = t.openings.filter((h) => h.wallId === i.wall.id && !h.invalid && e(h)).sort((h, f) => h.offset - f.offset), r = (h) => K(P(h, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const h of s)
      l.push([a, h.offset]), a = Math.max(a, h.offset + h.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [h, f] of l) {
      if (f <= h) continue;
      let d = o;
      h > -1 / 0 && (d = tl(d, (p) => r(p) - h)), f < 1 / 0 && (d = tl(d, (p) => f - r(p))), d.length >= 3 && Math.abs(Ee(d)) > jh && c.push(d);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const ns = (t) => [t.map((e) => [e.x, e.y])];
function tc(t) {
  const e = t.map(([o, s]) => ({ x: o, y: s })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function nc(t, e) {
  return ic(e ? [...Ps(t).values()].flat() : [...Gi(t).values()]);
}
function ic(t) {
  const e = t.map(ns);
  if (e.length === 0) return [];
  let n;
  try {
    n = Xa.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return n.map((i) => i.map(tc));
}
const Nt = 1e-6, mi = ["door", "gate", "wicket"], oc = (t) => t === "opening", sc = (t) => t.passesLight ?? oc(t.kind), rc = (t) => t === "opening", lc = (t) => t.passesPir ?? rc(t.kind);
function ac(t, e) {
  return t.offset < e.offset + e.width - Nt && e.offset < t.offset + t.width - Nt;
}
function Ki(t, e, n, i, o) {
  const s = wt(t, e);
  return s === null || i <= 0 || n < -Nt || n + i > s + Nt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== o && ac(r, { offset: n, width: i }));
}
function Rt(t, e) {
  return { ...t, openings: e };
}
function Xh(t, e, n, i, o, s = {}) {
  const r = o ?? ni[n], l = i - r / 2;
  if (!Ki(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: ie(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return mi.includes(n) && (a.hinge = s.hinge ?? "start", a.swing = s.swing ?? "left"), n === "window" && (a.outside = s.outside ?? "left"), { level: Rt(t, [...t.openings, a]), openingId: a.id };
}
function cc(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !Ki(t, i.wallId, n, i.width, e) ? t : Dn(Rt(t, t.openings.map((o) => o.id === e ? { ...o, offset: n } : o)));
}
function Yh(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !Ki(t, i.wallId, i.offset, n, e) ? t : Dn(Rt(t, t.openings.map((o) => o.id === e ? { ...o, width: n } : o)));
}
function Qh(t, e) {
  return mi.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Jh(t, e, n) {
  if (!t.openings.some((o) => o.id === e)) return t;
  const i = (o) => {
    const s = { ...o, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete s[r];
    return s;
  };
  return Dn(Rt(t, t.openings.map((o) => o.id === e ? i(o) : o)));
}
function uc(t, e) {
  return Dn(Rt(t, t.openings.filter((n) => n.id !== e)));
}
function Dn(t) {
  return Rt(t, t.openings.map((e) => {
    const n = wt(t, e.wallId), i = n === null || e.offset < -Nt || e.offset + e.width > n + Nt || t.openings.some((o) => o.id !== e.id && o.wallId === e.wallId && ac(e, o));
    return { ...e, invalid: i };
  }));
}
const gi = 1e-6;
function dc(t, e) {
  return e.mode !== "none" && Ds[t.kind].includes(e.mode);
}
function hc(t, e, n) {
  if (n.mode === "none" || !dc(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Dt || i > Dt)) return !1;
  const o = wt(t, n.wallId);
  return o !== null && n.offset >= -gi && n.offset <= o + gi;
}
function Re(t, e) {
  return { ...t, devices: e };
}
function nl(t, e, n, i) {
  if (!hc(t, e, n)) return { level: t, deviceId: null };
  const o = { id: ie(), name: i, placement: n, props: e, invalid: !1 };
  return { level: Re(t, [...t.devices, o]), deviceId: o.id };
}
function fc(t, e) {
  const n = { id: ie(), name: e, placement: { mode: "none" }, props: tt("equipment", "free"), invalid: !1 };
  return { level: Re(t, [...t.devices, n]), id: n.id };
}
const ef = ["power", "power_in", "power_out", "voltage"];
function tf(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = ef.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Bt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, pc = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function mc(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function gc(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [o, s] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[o] && (r[s] = r[o]), delete r[o];
  const l = Ui({ ...i, props: mc(i.props, "inverter", n), bindings: r });
  return Re(t, t.devices.map((a) => a === i ? l : a));
}
function Xi(t, e, n) {
  const i = t.devices.find((s) => s.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const o = { ...i, props: mc(i.props, "controllable", n) };
  return Re(t, t.devices.map((s) => s === i ? o : s));
}
function bc(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = tt("motion_sensor", vn(e)), o = tt("motion_sensor", vn(n));
  return i.kind === "motion_sensor" && o.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: o.zoneAngle } : t;
}
function bi(t, e, n) {
  const i = t.devices, o = i.find((r) => r.id === e);
  if (!o || !hc(t, o.props, n)) return t;
  const s = bc(o.props, o.placement.mode, n.mode);
  return wc(Re(t, i.map((r) => r.id === e ? { ...r, placement: n, props: s } : r)));
}
function Ft(t, e, n, i) {
  const o = t.devices;
  return o.some((s) => s.id === e) ? Re(t, o.map((s) => {
    if (s.id !== e) return s;
    const r = { ...s.props, ...n, kind: s.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return Ui({ ...s, props: r, name: i ?? s.name });
  })) : t;
}
function nf(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Ua(i.props.kind) || i.props.kind === n) return t;
  const o = tt(n, vn(i.placement.mode));
  if (!dc(o, i.placement)) return t;
  const s = Ui({ ...i, props: o });
  return Re(t, t.devices.map((r) => r === i ? s : r));
}
function of(t, e) {
  return Re(t, t.devices.filter((n) => n.id !== e));
}
function wc(t) {
  return Re(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = wt(t, e.placement.wallId), i = n === null || e.placement.offset < -gi || e.placement.offset > n + gi;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function vc(t) {
  const e = [];
  for (const n of nc(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function is(t, e) {
  let n = null, i = 1 / 0;
  for (const o of t) {
    if (!Ot(e, o)) continue;
    const s = Math.abs(Ee(o));
    s < i && (n = o, i = s);
  }
  return n;
}
const $o = 1e-3;
function $c(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Ee(t)) - Math.abs(Ee(e))) > $o ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= $o && Math.abs(n.y - i.y) <= $o));
}
const yc = 2, il = Math.ceil(360 / yc), ol = 1e-4, sf = 1e-9, sl = 1e-9, rf = {
  light: sc,
  motion: lc
};
function xc(t, e) {
  const n = [];
  for (const i of ic([...Ps(t, rf[e]).values()].flat()))
    for (const o of i)
      for (let s = 0; s < o.length; s++) n.push([o[s], o[(s + 1) % o.length]]);
  return n;
}
function Ts(t, e, n) {
  return e.filter(([i, o]) => Ie(t, i, o) <= n);
}
function yo(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function lf(t, e, n) {
  const i = Ts(t, e, n), o = [];
  for (let w = 0; w < il; w++) o.push(-Math.PI + 2 * Math.PI * w / il);
  const s = n * 1.05;
  for (const w of i)
    for (const b of w) {
      if (z(t, b) > s) continue;
      const y = Math.atan2(b.y - t.y, b.x - t.x);
      o.push(yo(y - ol), yo(y), yo(y + ol));
    }
  o.sort((w, b) => w - b);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), h = new Float64Array(r);
  i.forEach(([w, b], y) => {
    l[y] = w.x - t.x, a[y] = w.y - t.y, c[y] = b.x - w.x, h[y] = b.y - w.y;
  });
  const f = [], d = [];
  let p = NaN;
  for (const w of o) {
    if (w === p) continue;
    p = w;
    const b = Math.cos(w), y = Math.sin(w);
    let x = n, M = -1;
    for (let C = 0; C < r; C++) {
      const L = b * h[C] - y * c[C];
      if (Math.abs(L) < 1e-12) continue;
      const E = (l[C] * h[C] - a[C] * c[C]) / L;
      if (!(E > sf && E < x)) continue;
      const H = (l[C] * y - a[C] * b) / L;
      H < -sl || H > 1 + sl || (x = E, M = C);
    }
    const k = { x: t.x + b * x, y: t.y + y * x }, _ = f.length;
    if (!(_ > 0 && f[_ - 1].x === k.x && f[_ - 1].y === k.y)) {
      if (M >= 0 && _ >= 2 && d[_ - 1] === M && d[_ - 2] === M) {
        f[_ - 1] = k;
        continue;
      }
      f.push(k), d.push(M);
    }
  }
  const m = f[0], $ = f[f.length - 1];
  return f.length > 1 && m.x === $.x && m.y === $.y && f.pop(), f;
}
const af = 32, rl = 128;
function wi(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function Ve(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Hs(t) {
  return (t % 360 + 360) % 360;
}
function kc(t) {
  return (t % 360 + 540) % 360 - 180;
}
function Mc(t, e, n, i) {
  const o = t.walls.find((c) => c.id === e);
  if (!o) return null;
  let s;
  try {
    s = ae(t, o);
  } catch {
    return null;
  }
  const r = se(s.dir), l = n === "left" ? r : N(r, -1), a = n === "left" ? s.leftOff : s.rightOff;
  return { pt: R(R(s.a, N(s.dir, i)), N(l, a)), normal: l };
}
function yn(t, e, n, i) {
  var o;
  return ((o = Mc(t, e, n, i)) == null ? void 0 : o.pt) ?? null;
}
function le(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: wi(n.rotation) };
  const i = Mc(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const o = i.normal, s = e.props;
  if (s.kind === "equipment") {
    const r = s.shape === "circle" ? s.diameter / 2 : s.depth / 2;
    return { pt: R(i.pt, N(o, r)), dir: se(o), normal: o };
  }
  return { pt: i.pt, dir: n.aim ? wi(Ve(o) + n.aim) : o, normal: o };
}
function ll(t, e, n, i, o, s) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let c;
    try {
      c = ae(t, a);
    } catch {
      continue;
    }
    const h = a.a === n ? c.dir : N(c.dir, -1);
    if (Math.abs(ue(i, h)) < 1e-9 && K(i, h) < 0) {
      if ((K(se(c.dir), o) > 0 ? c.leftOff : c.rightOff) > s + 1e-6) return !1;
      l = !0;
    } else if (K(h, o) > 1e-9) return !1;
  }
  return l;
}
function Vs(t, e, n, i) {
  var H;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const o = t.walls.find((I) => I.id === n.wallId);
  if (!o) return n;
  let s;
  try {
    s = ae(t, o);
  } catch {
    return n;
  }
  const r = Ja(t), l = r.filter((I) => I.wallId === n.wallId && I.side === n.side), a = l.find((I) => I.end === "a"), c = l.find((I) => I.end === "b");
  if (!a || !c) return n;
  const h = se(s.dir), f = n.side === "left" ? h : N(h, -1), d = n.side === "left" ? s.leftOff : s.rightOff, p = ll(t, o, o.a, s.dir, f, d) ? -1 / 0 : a.offset, m = ll(t, o, o.b, N(s.dir, -1), f, d) ? 1 / 0 : c.offset, $ = (I) => K(P(I, s.a), s.dir), w = [];
  for (const I of t.nodes)
    if (((H = I.host) == null ? void 0 : H.wallId) === o.id)
      for (const O of t.walls) {
        const T = O.a === I.id ? "a" : O.b === I.id ? "b" : null, B = T && t.nodes.find((U) => U.id === (T === "a" ? O.b : O.a));
        if (!B || (K(P(B, s.a), h) >= 0 ? "left" : "right") !== n.side) continue;
        const D = r.filter((U) => U.wallId === O.id && U.end === T).map((U) => $(U.pt));
        D.length && w.push([Math.min(...D), Math.max(...D)]);
      }
  w.sort((I, O) => I[0] - O[0]);
  const b = [];
  let y = p;
  for (const [I, O] of w) {
    const T = Math.min(I, m);
    T > y && b.push([y, T]), y = Math.max(y, O);
  }
  m > y && b.push([y, m]), b.length === 0 && b.push([p, m]);
  const x = ([I, O]) => Math.max(0, I - n.offset, n.offset - O), [M, k] = b.reduce((I, O) => x(O) < x(I) ? O : I), _ = (e.shape === "circle" ? e.diameter : e.width) / 2, C = M + _, L = k - _;
  let E = n.offset;
  return C > L ? E = (M + k) / 2 : E <= C + i ? E = C : E >= L - i && (E = L), E = Math.max(0, Math.min(s.len, E)), Math.abs(E - n.offset) < 1e-9 ? n : { ...n, offset: E };
}
function _c(t, e) {
  const n = [];
  for (let i = 0; i < rl; i++) n.push(R(t, N(wi(360 * i / rl), e)));
  return n;
}
function al(t, e, n, i) {
  if (n >= 360) return _c(t, i);
  const o = Math.max(1, Math.ceil(n / 90 * af)), s = Ve(e) - n / 2, r = [t];
  for (let l = 0; l <= o; l++) r.push(R(t, N(wi(s + n * l / o), i)));
  return r;
}
const cf = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Yi(t) {
  return cf[t] ?? null;
}
const uf = (t) => Yi(t.kind) !== null;
function df(t, e) {
  const n = e.props;
  if (!uf(n)) return null;
  const i = le(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? al(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? al(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? _c(i.pt, n.poolRadius) : null;
  }
}
function hf(t) {
  return t.normal ? R(t.pt, t.normal) : t.pt;
}
function cl(t, e) {
  let n = !1;
  for (const [i, o] of e)
    i.y > t.y != o.y > t.y && t.x < i.x + (t.y - i.y) * (o.x - i.x) / (o.y - i.y) && (n = !n);
  return n;
}
function ff(t, e, n) {
  const i = P(e, t);
  for (const [o, s] of n) {
    const r = P(s, o), l = P(o, t), a = ue(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = ue(l, r) / a, h = ue(l, i) / a;
    if (c >= 0 && c <= 1 && h >= 0 && h <= 1) return !0;
  }
  return !1;
}
const ul = 0.5, pf = 3, mf = 1e-4;
function gf(t, e, n) {
  const i = le(t, e);
  if (!i) return null;
  const o = hf(i), s = e.placement;
  if (s.mode !== "wall") return o;
  const r = (k) => cl(k, n) || Ts(k, n, ul).length > 0;
  if (!r(o)) return o;
  const l = ae(t, t.walls.find((k) => k.id === s.wallId)), a = i.normal, c = (k) => Math.abs(K(P(k, i.pt), a)) <= mf, h = ([k, _]) => N(R(k, _), 0.5), f = n.filter((k) => c(k[0]) && c(k[1]) && z(k[0], k[1]) > 1e-9 && !cl(R(h(k), N(a, ul)), n)), d = (k) => K(P(k, l.a), l.dir), p = ([k, _]) => Math.max(0, Math.min(d(k), d(_)) - s.offset, s.offset - Math.max(d(k), d(_))), m = Math.min(...f.map(p)), $ = f.filter((k) => p(k) <= m + 1e-6).map((k) => R(h(k), a)), w = (k) => $.some((_) => !ff(k, _, n)), b = pf * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, _] of n) {
    const C = P(_, k), L = P(k, o), E = ue(l.dir, C);
    if (Math.abs(E) < 1e-12) continue;
    const H = ue(L, l.dir) / E;
    if (H < -1e-9 || H > 1 + 1e-9) continue;
    const I = ue(L, C) / E, O = z(k, _) / Math.abs(E);
    y.push(I - O, I + O);
  }
  const x = s.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= b).sort((k, _) => Math.abs(k) - Math.abs(_) || Math.sign(_) * x - Math.sign(k) * x);
  for (const k of M) {
    const _ = R(o, N(l.dir, k));
    if (!r(_) && w(_)) return _;
  }
  return null;
}
const bf = 1 / Math.cos(yc / 2 * (Math.PI / 180)), dl = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function wf(t, e, n = xc) {
  const i = df(t, e), o = Yi(e.props.kind);
  if (!i || !o) return [];
  const s = n(t, o), r = gf(t, e, s);
  if (!r) return [];
  const l = Math.max(...i.map((f) => z(f, r))) * bf, a = Ts(r, s, l);
  if (a.length === 0) return [i];
  const c = lf(r, a, l);
  let h;
  try {
    h = Xa.intersection(ns(dl(i)), ns(dl(c)));
  } catch {
    return [c];
  }
  return h.flatMap((f) => f.map(tc));
}
function vf(t, e, n, i) {
  const o = le(t, e);
  if (!o) return !1;
  const s = e.props;
  if (s.kind === "ceiling_light" && s.shape === "linear") {
    const l = Math.max(-s.length / 2, Math.min(s.length / 2, K(P(n, o.pt), o.dir)));
    return z(R(o.pt, N(o.dir, l)), n) <= i;
  }
  if (s.kind === "ceiling_light" && s.shape === "round") return z(o.pt, n) <= s.diameter / 2 + i;
  if (s.kind !== "equipment") return z(o.pt, n) <= i;
  if (s.shape === "circle") return z(o.pt, n) <= s.diameter / 2 + i;
  const r = P(n, o.pt);
  return Math.abs(K(r, o.dir)) <= s.width / 2 + i && Math.abs(K(r, se(o.dir))) <= s.depth / 2 + i;
}
function Ac(t, e, n) {
  const i = t.devices;
  for (const o of [!1, !0])
    for (let s = i.length - 1; s >= 0; s--)
      if (i[s].props.kind === "equipment" === o && vf(t, i[s], e, n)) return i[s].id;
  return null;
}
const $f = 60;
function os(t, e, n) {
  if (!ja.has(e.props.kind)) return null;
  const i = le(t, e);
  return i ? { from: i.pt, to: R(i.pt, N(i.dir, $f / n)) } : null;
}
function Sc(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function yf(t, e, n, i) {
  const o = e.placement, s = le(t, e);
  if (o.mode === "none" || !s || n.x === s.pt.x && n.y === s.pt.y) return o;
  const r = Ve(P(n, s.pt)), l = (h) => i ? Math.round(h / 15) * 15 : Math.round(h);
  if (o.mode === "free") return { ...o, rotation: Hs(l(r)) };
  const a = kc(r - Ve(s.normal)), c = Math.max(-Dt, Math.min(Dt, l(a)));
  return Sc(o, c);
}
const xf = 1, vi = 1, hl = 1e-6, kf = 1e-9, Mf = 1e-6, _f = 1;
function zs(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = wt(t, e.wallId);
      return n === null ? null : yn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function de(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => zs(t, i) ?? { x: i.x, y: i.y });
}
function Rs(t, e) {
  const n = de(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Ee(n)) / 1e5) / 10;
}
function en(t, e, n) {
  const i = ue(P(e, t), P(n, t));
  return Math.abs(i) <= kf * z(t, e) * z(t, n) ? 0 : Math.sign(i);
}
const Rn = (t, e, n) => K(P(e, t), P(n, t)) <= 0;
function Lc(t, e, n, i) {
  const o = en(n, i, t), s = en(n, i, e), r = en(t, e, n), l = en(t, e, i);
  return o * s < 0 && r * l < 0 ? !0 : r === 0 && Rn(n, t, e) || l === 0 && Rn(i, t, e) || o === 0 && Rn(t, n, i) || s === 0 && Rn(e, n, i);
}
function Af(t) {
  const e = [];
  for (const n of t) (e.length === 0 || z(e[e.length - 1], n) > hl) && e.push(n);
  for (; e.length > 1 && z(e[0], e[e.length - 1]) <= hl; ) e.pop();
  return e;
}
function $i(t) {
  const e = Af(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const o = e[i], s = e[(i + 1) % n], r = e[(i + 2) % n];
    if (en(o, s, r) === 0 && K(P(s, o), P(r, s)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && Lc(o, s, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function Cc(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((s) => s.kind === "free" ? s.lost === !0 : zs(t, s) === null)) return "lost";
  const i = (s) => {
    if (s.kind !== "wall") return !1;
    const r = wt(t, s.wallId);
    return r !== null && (s.offset < -vi || s.offset > r + vi);
  };
  if (n.vertices.some(i)) return "beyond";
  const o = de(t, e);
  return Math.abs(Ee(o)) < _f || $i(o) ? "crossing" : null;
}
function Ut(t, e) {
  return Ot(e, t) || t.some((n, i) => Ie(e, n, t[(i + 1) % t.length]) <= xf);
}
const Ic = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function Sf(t, e) {
  const n = le(t, e);
  return n ? t.zones.filter((i) => Ut(de(t, i), n.pt)).map((i) => ({ zone: i, participates: Ic(e, i.id) })) : [];
}
function Be(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n) return [];
  const i = de(t, n), o = [];
  for (const s of t.devices) {
    const r = le(t, s);
    r && Ut(i, r.pt) && o.push({ device: s, participates: Ic(s, e) });
  }
  return o;
}
function Lf(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Ee(t);
  if (Math.abs(n) > Mf) {
    let i = 0, o = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, o += (l.y + a.y) * c;
    }
    const s = { x: i / (6 * n), y: o / (6 * n) };
    if (Ot(s, t)) return s;
  }
  return {
    x: t.reduce((i, o) => i + o.x, 0) / e,
    y: t.reduce((i, o) => i + o.y, 0) / e
  };
}
const xo = 32;
function fl(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let o = 0; o < i.length; o++) n = Math.min(n, Ie(t, i[o], i[(o + 1) % i.length]));
  return n;
}
function Ec(t) {
  const e = t.zones.map((o) => de(t, o)), n = e.map((o) => Math.abs(Ee(o))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((o, s) => {
    const r = e[s];
    if (r.length < 3) return;
    const l = e.filter(($, w) => w !== s && $.length >= 3 && n[w] < n[s] && $.every((b) => Ut(r, b))), a = Lf(r);
    if (l.length === 0) {
      i.set(o.id, a);
      return;
    }
    const c = r.map(($) => $.x), h = r.map(($) => $.y), f = Math.min(...c), d = Math.min(...h), p = Math.max(Math.max(...c) - f, Math.max(...h) - d) / xo;
    let m = null;
    for (let $ = f + p / 2; $ < f + p * xo; $ += p)
      for (let w = d + p / 2; w < d + p * xo; w += p) {
        const b = { x: $, y: w };
        if (!Ot(b, r) || l.some((x) => Ot(b, x))) continue;
        const y = Math.min(fl(b, [r]), fl(b, l));
        (!m || y > m.d) && (m = { p: b, d: y });
      }
    i.set(o.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const Bs = 3, Pt = (t, e) => ({ ...t, zones: e }), xn = (t, e, n) => Pt(t, t.zones.map((i) => i === e ? n : i)), Fs = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), Dc = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function Cf(t, e) {
  if (t.x !== e.x || t.y !== e.y) return !1;
  switch (t.kind) {
    case "free":
      return e.kind === "free" && t.lost === e.lost;
    case "node":
      return e.kind === "node" && t.nodeId === e.nodeId;
    case "wall":
      return e.kind === "wall" && t.wallId === e.wallId && t.offset === e.offset && t.side === e.side;
  }
}
function If(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && Dc(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => Cf(n, e.vertices[i]));
}
function Oc(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && If(t.shape, e.shape);
}
function Ef(t, e) {
  if (e.kind === "free") return e;
  const n = zs(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : Fs(e);
}
function Nc(t, e) {
  const n = e.shape, i = n.vertices.map((o) => Ef(t, o));
  return i.some((o, s) => o !== n.vertices[s]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function Df(t, e, n) {
  const i = t.shape, o = is(e, i.seed);
  return !o || n.some((s) => $c(s, o)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(o), !i.broken && Dc(o, i.outline) ? t : { ...t, shape: { ...i, outline: o, broken: !1 } });
}
function Pc(t, e) {
  const n = Cc(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const Us = (t, e) => Pc(t, Nc(t, e));
function Of(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((s) => s.shape.kind === "walls") ? vc(t) : [], i = [], o = e.map((s) => Pc(
    t,
    s.shape.kind === "walls" ? Df(s, n, i) : Nc(t, s)
  ));
  return o.some((s, r) => s !== e[r]) ? Pt(t, o) : t;
}
function Nf(t, e) {
  const n = t.zones, i = e.zones, o = n.map((s) => {
    const r = i.find((l) => l.id === s.id);
    return r && r !== s && Oc(r, s) ? r : s;
  });
  return o.length === i.length && o.every((s, r) => s === i[r]) ? n === i ? t : Pt(t, i) : o.some((s, r) => s !== n[r]) ? Pt(t, o) : t;
}
function Pf(t, e, n) {
  const i = vc(t), o = is(i, e);
  if (!o) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = is(i, r.shape.seed);
    if (l && $c(l, o)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const s = { id: ie(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: o, broken: !1 }, invalid: !1 };
  return { level: Pt(t, [...t.zones, s]), zoneId: s.id, existing: !1 };
}
const Ws = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function Tf(t, e, n) {
  if (e.length < Bs) return { level: t, zoneId: null };
  const i = Us(t, { id: ie(), name: n, shape: { kind: "polygon", vertices: e.map(Ws) }, invalid: !1 });
  return $i(de(t, i)) ? { level: t, zoneId: null } : { level: Pt(t, [...t.zones, i]), zoneId: i.id };
}
function Hf(t, e, n) {
  const i = t.zones.find((o) => o.id === e);
  return !i || i.name === n ? t : xn(t, i, { ...i, name: n });
}
function js(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return xn(t, i, { ...i, automation: !1 });
  const { automation: o, ...s } = i;
  return xn(t, i, s);
}
function Tc(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Hc(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var o;
    return (o = i.zoneBlacklist) != null && o.includes(e) ? Tc(i, i.zoneBlacklist.filter((s) => s !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, o) => i !== t.devices[o]) ? n : t.devices
  };
}
function qs(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function Zs(t, e, n) {
  const i = Us(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return Oc(i, e) ? t : xn(t, e, i);
}
const Gs = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function Vf(t, e, n, i) {
  const o = qs(t, e);
  return !o || !Gs(n, o.shape.vertices.length) ? t : Zs(t, o, o.shape.vertices.map((s, r) => r === n ? Ws(i) : s));
}
function zf(t, e, n, i) {
  const o = qs(t, e);
  if (!o || !Gs(n, o.shape.vertices.length + 1)) return t;
  const s = [...o.shape.vertices];
  return s.splice(n, 0, Ws(i)), Zs(t, o, s);
}
function Rf(t, e, n) {
  const i = qs(t, e);
  return !i || i.shape.vertices.length <= Bs || !Gs(n, i.shape.vertices.length) ? t : Zs(t, i, i.shape.vertices.filter((o, s) => s !== n));
}
function Bf(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < Bs) return t;
  const i = n.shape.outline.map(Fs);
  return xn(t, n, Us(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Vc(t, e, n, i) {
  const o = t.devices.find((l) => l.id === e);
  if (!o) return t;
  const s = o.zoneBlacklist ?? [];
  if (s.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Tc(o, i ? s.filter((l) => l !== n) : [...s, n]);
  return { ...t, devices: t.devices.map((l) => l === o ? r : l) };
}
const kn = 1;
function Ne(t) {
  return structuredClone(t);
}
function Qi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Ff(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Ji(t, e, n) {
  const i = te(t, e.a), o = te(t, e.b), s = z(i, o), r = Ff(typeof n == "number" ? n : qi(n, i, o) * s, 0, s);
  return { pt: s === 0 ? i : Ga(i, o, r / s), offset: r };
}
function Uf(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const o = t.walls.find((l) => l.id === i.host.wallId);
      if (!o) continue;
      const { pt: s, offset: r } = Ji(t, o, i);
      (Math.abs(i.x - s.x) > 1e-9 || Math.abs(i.y - s.y) > 1e-9) && (n = !0), i.x = s.x, i.y = s.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function zc(t, e) {
  Uf(t), e && Zf(e, t);
  const n = Of(wc(Dn(t)));
  return e ? Nf(n, e) : n;
}
function Fe(t, e) {
  return zc(Ne(t), e);
}
function Rc(t, e, n) {
  const i = Zi(t, e), o = i.host && t.walls.find((s) => s.id === i.host.wallId);
  if (i.host && o) {
    const { pt: s, offset: r } = Ji(t, o, n);
    i.host.offset = r, i.x = s.x, i.y = s.y;
  } else
    i.x = n.x, i.y = n.y;
}
function pl(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: te(t, e.nodeId), nodeId: e.nodeId };
  const n = Qi(t, e.wallId), { pt: i, offset: o } = Ji(t, n, e.offset), s = z(te(t, n.a), te(t, n.b));
  return o <= kn ? { pt: te(t, n.a), nodeId: n.a } : s - o <= kn ? { pt: te(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: o } };
}
function ml(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: ie(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Wf(t, e, n, i) {
  const o = pl(t, e), s = pl(t, n);
  if (z(o.pt, s.pt) < kn) return { level: t, wallId: null, endNodeId: null };
  const r = Ne(t), l = ml(r, o), a = ml(r, s);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: ie(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Fe(r, t), wallId: c.id, endNodeId: a };
}
function Bc(t, e, n, i) {
  const o = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, s = Math.min(t.x, e.x) - o, r = Math.max(t.x, e.x) + o, l = Math.min(t.y, e.y) - o, a = Math.max(t.y, e.y) + o;
  return r - s < kn || a - l < kn ? null : [{ x: s, y: l }, { x: r, y: l }, { x: r, y: a }, { x: s, y: a }];
}
function jf(t, e, n, i, o) {
  const s = Bc(e, n, i.thickness, o);
  if (!s) return t;
  const r = Ne(t), l = s.map((a) => {
    const c = { id: ie(), x: a.x, y: a.y };
    return r.nodes.push(c), c.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: ie(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Fe(r, t);
}
function qf(t, e, n) {
  const i = Ne(t);
  return Rc(i, e, n), zc(i, t);
}
function Zf(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const o = t.walls.find((f) => f.id === i.id);
    if (!o || o.a !== i.a) continue;
    const s = t.nodes.find((f) => f.id === o.a), r = t.nodes.find((f) => f.id === o.b), l = e.nodes.find((f) => f.id === i.a), a = e.nodes.find((f) => f.id === i.b);
    if (!s || !r || !l || !a || s.x === l.x && s.y === l.y) continue;
    const c = z(l, a);
    if (c === 0) continue;
    const h = ji(P(r, s));
    for (const f of n)
      f.wallId === i.id && (f.offset = qi(R(s, N(h, f.offset)), l, a) * c);
  }
}
function Gf(t, e, n) {
  const i = Ne(t), o = Qi(i, e), r = (o.a === o.b ? [o.a] : [o.a, o.b]).map((l) => ({ id: l, to: R(te(i, l), n) }));
  for (const l of r) Rc(i, l.id, l.to);
  return Fe(i, t);
}
function eo(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Fc(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const o of i.shape.vertices) o.kind === "node" && o.nodeId === e && (o.nodeId = n);
}
function Kf(t, e, n) {
  const i = Ne(t), o = Qi(i, e), s = o[n], r = te(i, s), l = { id: ie(), x: r.x, y: r.y };
  return i.nodes.push(l), o[n] = l.id, i.walls.some((a) => a.a === s || a.b === s) || Fc(i, s, l.id), eo(i), { level: Fe(i, t), nodeId: l.id };
}
function Xf(t, e, n) {
  if (e === n) return t;
  const i = Ne(t);
  for (const s of i.walls)
    s.a === e && (s.a = n), s.b === e && (s.b = n);
  const o = new Set(i.walls.filter((s) => s.a === s.b).map((s) => s.id));
  i.walls = i.walls.filter((s) => !o.has(s.id)), i.openings = i.openings.filter((s) => !o.has(s.wallId)), i.devices = i.devices.filter((s) => s.placement.mode !== "wall" || !o.has(s.placement.wallId));
  for (const s of i.nodes) s.host && o.has(s.host.wallId) && delete s.host;
  return Fc(i, e, n), i.nodes = i.nodes.filter((s) => s.id !== e), eo(i), Fe(i, t);
}
function Ks(t, e) {
  var i;
  const n = Ne(t);
  n.walls = n.walls.filter((o) => o.id !== e), n.openings = n.openings.filter((o) => o.wallId !== e), n.devices = n.devices.filter((o) => o.placement.mode !== "wall" || o.placement.wallId !== e);
  for (const o of n.nodes) ((i = o.host) == null ? void 0 : i.wallId) === e && delete o.host;
  return eo(n), Fe(n, t);
}
function Yf(t, e, n) {
  const i = Ne(t);
  return Object.assign(Qi(i, e), n), Fe(i, t);
}
const be = (t) => typeof t == "string" && t !== "" ? t : null, Uc = (t) => t.split(".")[0], Qf = ["friendly_name", "device_class", "unit_of_measurement"];
function Wc(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: Uc(t),
    name: be(n.friendly_name) ?? t,
    deviceClass: be(n.device_class),
    unit: be(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Jf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Wc(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function ep(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const o = t[i], s = e[i];
    if (o === s) continue;
    if (!o || !s) return !1;
    const r = o.attributes ?? {}, l = s.attributes ?? {};
    if (r !== l && Qf.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function jc(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function tp(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, o] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), s = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Wc(r.entity_id, {});
    s.set(r.entity_id, {
      ...l,
      name: be(r.name) ?? be(r.original_name) ?? l.name,
      deviceId: be(r.device_id),
      areaId: be(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: be(r.entity_category)
    });
  }
  return {
    entities: s,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: be(r.name_by_user) ?? be(r.name) ?? r.id, model: be(r.model), areaId: be(r.area_id) }])),
    areas: new Map(o.map((r) => [r.area_id, r.name]))
  };
}
function np(t, e) {
  const n = new Map(e.entities);
  for (const [i, o] of t.entities) {
    const s = e.entities.get(i);
    n.set(i, s ? { ...s, name: o.name !== i ? o.name : s.name, deviceClass: o.deviceClass ?? s.deviceClass, unit: o.unit ?? s.unit } : o);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function qc(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const o = i.disabled ? null : jc(n, e);
  return o === null || o === "unavailable" ? "unavailable" : "present";
}
const ip = {
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
  "tool.zone-pick": "Select",
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
  "steps.rule": "{n} rule",
  "steps.rules": "{n} rules",
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
  "role.sun": "Sun",
  "daylight.night": "night",
  "daylight.twilight": "twilight",
  "daylight.day": "day",
  "daylight.noData": "no data",
  "daylight.bySun": "(sun)",
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
  "rules.template.condition": "Condition",
  "rules.template.leak": "Leak protection",
  "rules.template.timer": "Timer",
  "rules.template.outside": "Outside light",
  "rules.template.beurer": "Beurer heater",
  "rules.template.motionLight": "Light motion control",
  "rules.template.control": "Load control",
  "rules.template.vent": "Wet zone ventilation",
  "vent.title": "Wet zone ventilation",
  "vent.hint": "Runs the fan while the air of the wet zone holds clearly more water than the reference sensor, and for the run-on time after it.",
  "vent.pick": "Choose...",
  "vent.sensor": "Wet zone sensor",
  "vent.than": "Compare with",
  "vent.fan": "Fan",
  "vent.above": "On above %",
  "vent.below": "Off below %",
  "vent.runon": "Run-on, min",
  "vent.pending": "{to} in {t}",
  "vent.flow.title": "Ventilation diagram",
  "vent.flow.vs": "{a} vs {b}",
  "vent.flow.margins": "on > {above} %, off < {below} %",
  "vent.flow.runon": "run-on {t}",
  "vent.flow.last": "last: {did} {at}",
  "vent.flow.kept": "last: {reason} {at}",
  "vent.problem.sensor": "Choose the wet zone sensor",
  "vent.problem.than": "Choose the sensor to compare with",
  "vent.problem.fan": "Choose the fan",
  "vent.problem.runon": "Run-on: 0 to 60 min",
  "rules.template.boiler": "Cost effective boiler",
  "rules.automations": "Automations",
  "rules.template.timed": "Timed switch",
  "timed.title": "Timed switch",
  "timed.hint": "The start event of the button switches the device on for the duration, then off (inverted: off, then on). Starting again while it runs counts the duration from then; the stop event ends a run at once. When someone else switches the device during a run, the run ends without a command.",
  "timed.button": "Button",
  "timed.device": "Device",
  "timed.minutes": "Duration, min",
  "timed.invert": "Invert (off for the duration, then on)",
  "timed.problem.button": "Choose the button",
  "timed.problem.device": "Choose the device",
  "timed.events.wall": "start: switched on, stop: switched off",
  "timed.events.start": "start: on ({e})",
  "timed.events.stop": "stop: off ({e})",
  "timed.events.noStop": "no stop",
  "timed.flow.title": "Timed switch diagram",
  "timed.flow.events": "start / stop events",
  "timed.flow.run": "Run",
  "timed.flow.running": "Running, ends in {t}",
  "timed.flow.runningNow": "Running",
  "timed.flow.idle": "Idle",
  "timed.flow.for": "on for {d}, then off",
  "timed.flow.forInvert": "off for {d}, then on",
  "timed.flow.cmd": "on, then off",
  "timed.flow.cmdInvert": "off, then on",
  "timed.flow.state": "state: {s}",
  "timed.flow.last": "last: {did} {at} ({reason})",
  "timed.flow.elsewhere": "switched {s} elsewhere {at}",
  "timed.flow.already": "{reason}: already {s} {at}",
  "timed.flow.kept": "{reason} {at}",
  "beurer.title": "Beurer heater",
  "beurer.hint": "Keeps the heating pad on while the power source draws more than the threshold. The pad has its own switch-off timer, so its socket is switched off for 5 s at the interval to restart it. A socket switched off elsewhere is switched on again.",
  "beurer.heater": "Heater",
  "beurer.source": "Power source",
  "beurer.above": "On above, W",
  "beurer.off": "Off after, s",
  "beurer.keep": "Keep without data, min",
  "beurer.every": "Re-power every, min",
  "beurer.everyNote": "0 = never",
  "beurer.problem.heater": "Choose the heater",
  "beurer.problem.source": "Choose the power source",
  "beurer.flow.title": "Beurer heater diagram",
  "beurer.flow.noData": "no data",
  "beurer.flow.kept": "no data, kept {t}",
  "beurer.flow.wants": "Wants",
  "beurer.flow.rule": "on above {w} W, off after {d}",
  "beurer.flow.repower": "Re-power",
  "beurer.flow.next": "next in {t}",
  "beurer.flow.now": "re-powering {t}",
  "beurer.flow.never": "never",
  "beurer.flow.due": "due",
  "control.title": "Load control",
  "control.hint": 'Reacts to events. A source gives "on" when it becomes true and "off" when it becomes false (NOT swaps them); a button gives what it is set up for: toggle, or on / off. Each event runs its own list. "toggle" actions of one list work as a group: any of them on switches all off, else all on. Nothing happens at start or Save, a device that is unavailable at that moment is skipped, and a change made by a Load control rule is not an event for another one.',
  "control.sources": "Sources",
  "control.addSource": "Add a source…",
  "control.group.buttons": "Buttons",
  "control.gives": "gives {what}",
  "control.gate": "Act only when",
  "control.whenOn": "When on",
  "control.whenOff": "When off",
  "control.whenToggle": "When toggle",
  "control.addAction": "Add an action…",
  "control.problem.sources": "Add a source",
  "control.problem.actions": "Add an action to at least one list",
  "control.flow.title": "Load control diagram",
  "control.flow.event": "Event",
  "control.flow.noEvent": "no event yet",
  "control.flow.eventLine": "{source}: {what} {at}",
  "control.flow.dropped": "dropped: gate closed",
  "control.flow.nothing": "nothing",
  "control.flow.noData": "no data",
  "control.flow.now": "now {s}",
  "control.flow.notSent": "last: not sent {at}",
  "control.gateNote": 'While this is false or unknown, "on" and "toggle" events are dropped and nothing is replayed later. "off" events always act.',
  "control.do.on": "on",
  "control.do.off": "off",
  "control.do.toggle": "toggle",
  "control.do.close": "close",
  "outside.title": "Outside light",
  "outside.hint": "Switches the light on at night and off by day, by the daylight state of the sensor; optionally only after sunset and inside a time window. When someone switches the light, the rule pauses for the set minutes, then applies its current want. A light coming back from no data (a blackout) is not a switch.",
  "outside.light": "Light",
  "outside.sensor": "Daylight sensor",
  "outside.noDataNight": "No data counts as night",
  "outside.afterSunset": "Only after sunset",
  "outside.window": "Time window",
  "outside.pause": "Pause after a manual switch, min",
  "outside.pauseNote": "0 = never pause",
  "outside.problem.light": "Choose the light",
  "outside.problem.sensor": "Choose the daylight sensor",
  "outside.sun.below": "below",
  "outside.sun.above": "above",
  "outside.flow.title": "Outside light diagram",
  "outside.flow.daylight": "Daylight",
  "outside.flow.nightOrNoData": "night or no data",
  "outside.flow.countsNight": "counts as night",
  "outside.flow.sun": "Sun",
  "outside.flow.afterSunset": "after sunset",
  "outside.flow.window": "Time window",
  "outside.flow.inWindow": "In window",
  "outside.flow.outWindow": "Outside window",
  "outside.flow.endsIn": "ends in {t}",
  "outside.flow.startsIn": "starts in {t}",
  "outside.flow.wants": "Wants",
  "outside.flow.rule": "on at night{sun}{window}, else off",
  "outside.flow.ruleSun": " after sunset",
  "outside.flow.ruleWindow": " in the window",
  "outside.flow.pause": "Pause",
  "outside.flow.paused": "Paused, resumes in {t}",
  "outside.flow.noPause": "No pause",
  "outside.flow.never": "Never pauses",
  "outside.flow.ignored": "manual switches are ignored",
  "outside.flow.after": "{d} after a manual switch",
  "outside.flow.onOff": "on / off",
  "outside.flow.elsewhere": "switched {s} elsewhere {at}, {why}",
  "motionLight.title": "Light motion control",
  "motionLight.hint": "The button sets the mode: its toggle (or on / off) switches the light by hand, its Auto action hands the light to the automation. Without a button the rule is always in auto. Auto: motion on any of the sensors switches the light on (only when it is dark, if a light sensor is set) and it goes off after the time without motion, but not before the minimum on time. Without motion sensors auto does nothing. A switch of the light by other means does not change the mode.",
  "motionLight.light": "Light",
  "motionLight.sensors": "Motion sensors",
  "motionLight.addSensor": "Add a motion sensor…",
  "motionLight.daylight": "Only when dark",
  "motionLight.noDaylight": "— always —",
  "motionLight.isNight": "is night",
  "motionLight.isDark": "is dark",
  "motionLight.off": "Off after, s",
  "motionLight.offNote": "without motion",
  "motionLight.minOn": "Minimum on time, s",
  "motionLight.buttons": "Buttons",
  "motionLight.addButton": "Add a button…",
  "motionLight.buttonsNote": "none = always auto",
  "motionLight.sensorsNote": "none = auto does nothing",
  "motionLight.autoAfter": "Auto again after, min",
  "motionLight.autoAfterNote": "0 = never",
  "motionLight.problem.light": "Choose the light",
  "motionLight.flow.title": "Light motion control diagram",
  "motionLight.flow.motion": "motion",
  "motionLight.flow.clear": "clear",
  "motionLight.flow.noData": "no data",
  "motionLight.flow.daylight": "Daylight",
  "motionLight.flow.wants": "Wants",
  "motionLight.flow.rule": "on at motion{dark}, off {d} after it ends",
  "motionLight.flow.ruleDark": " when dark",
  "motionLight.flow.ruleMin": ", at least {d} on",
  "motionLight.flow.offIn": "off in {t}",
  "motionLight.flow.minOn": "minimum on {t}",
  "motionLight.flow.mode": "Mode",
  "motionLight.flow.auto": "auto",
  "motionLight.flow.manual": "manual",
  "motionLight.flow.autoIn": "auto again in {t}",
  "motionLight.flow.lastAuto": "last: back to auto {at} (button)",
  "motionLight.flow.lastAutoAgain": "last: back to auto {at} (no motion)",
  "motionLight.flow.lastManualButton": "last: manual {at} (button)",
  "motionLight.flow.lastReleased": "last: switched off elsewhere {at}, waits for new motion",
  "motionLight.flow.lastFound": "last: found on {at}",
  "motionLight.flow.lastAutoOff": "last: turned off {at} (back to auto: no motion)",
  "motionLight.flow.lastAutoOffLight": "last: turned off {at} (back to auto: it is light)",
  "motionLight.flow.lastAutoOn": "last: turned on {at} (back to auto: motion)",
  "motionLight.flow.noSensors": "no motion sensors: auto does nothing",
  "motionLight.flow.autoNoButton": "auto (no button)",
  "motionLight.flow.waiting": "waiting for new motion",
  "motionLight.flow.byButton": "back to auto: a button's Auto action",
  "leak.title": "Leak protection",
  "leak.hint": "Any wet leak sensor closes every valve. While a sensor is still wet, a valve opened by anyone is closed again at once. Valves are never opened automatically.",
  "leak.sensors": "Leak sensors",
  "leak.valves": "Valves",
  "leak.addSensor": "Add leak sensor...",
  "leak.addValve": "Add valve...",
  "leak.remove": "Remove",
  "leak.problem.sensors": "Add at least one leak sensor",
  "leak.problem.valves": "Add at least one valve",
  "leak.yes": "yes",
  "leak.no": "no",
  "leak.state.open": "open",
  "leak.state.closed": "closed",
  "leak.flow.title": "Leak protection diagram",
  "leak.flow.leak": "Leak",
  "leak.flow.any": "any sensor wet",
  "leak.flow.close": "close on leak",
  "leak.flow.reclosed": "re-closed {at}",
  "leak.flow.addSensor": "Add a leak sensor",
  "leak.flow.addValve": "Add a valve",
  "boiler.title": "Cost effective boiler",
  "boiler.hint": "In auto the boiler heats until its power drops to 0 W, then the mode returns to manual. The button switches it by hand or starts auto. With a power limit the boiler is off while the grid has no data or the grid power plus the boiler power would exceed the limit, and 15 s after that.",
  "boiler.device": "Boiler",
  "boiler.button": "Button",
  "boiler.limitOn": "Power limit",
  "boiler.grid": "Grid",
  "boiler.missingGrid": "(missing grid block)",
  "boiler.limit": "Limit, W",
  "boiler.nominal": "Boiler power, W",
  "boiler.problem.device": "Choose the boiler",
  "boiler.problem.button": "Choose the button",
  "boiler.problem.grid": "Choose the grid block",
  "boiler.mode.auto": "auto",
  "boiler.mode.manual": "manual",
  "boiler.phase.heating": "heating",
  "boiler.phase.heatingCheck": "heating, power check in {t}",
  "boiler.phase.waiting": "waiting {t}",
  "boiler.phase.blackout": "blackout",
  "boiler.phase.limit": "power limit",
  "boiler.phase.done": "heating done",
  "boiler.flow.title": "Boiler diagram",
  "boiler.flow.gridPower": "grid power",
  "boiler.flow.headroom": "Headroom",
  "boiler.flow.formula": "grid + {nominal} - boiler",
  "boiler.flow.ok": "ok",
  "boiler.flow.over": "over the limit",
  "boiler.flow.mode": "Mode",
  "boiler.flow.button": "button: {name}",
  "boiler.flow.relay": "Relay",
  "boiler.flow.power": "Boiler power",
  "boiler.flow.nominal": "nominal {w} W",
  "boiler.flow.done": "done at ≤ 1 W",
  "rules.problem.boiler-auto": "This button has no Auto action: enable it in the button's properties",
  "rules.problem.boiler": "Boiler: a boiler and a button; Limit and Boiler power above 0 W.",
  "rules.problem.outside": "Outside light: pick a light that can be switched on and a different daylight sensor, a time window with different From and To, and a pause of 0 to 1440 minutes.",
  "rules.problem.motionLight": "Light motion control: pick a light that can be switched on and off, smart buttons and motion sensors each only once, and whole numbers in range.",
  "rules.problem.beurer": "Beurer heater: pick a heater that can be switched on and a different device with a Power binding, a threshold above 0 W, and whole minutes 0 to 1440.",
  "rules.problem.control": "Load control: every source once; a device once per list; a device the rule switches cannot also be its source; toggle, on and off for devices that can be switched, close for valves.",
  "rules.problem.timed": "Timed switch: pick a button and a different device that can be switched on, and a duration of 1 to 1440 minutes.",
  "rules.problem.leak": "Leak protection: at least one leak sensor and one valve, each listed once.",
  "rules.problem.vent": "Ventilation: two different climate sensors, a fan, On above > 0 and Off below from 0 to On above.",
  "rules.noZone": "Rules without a zone",
  "rules.hint": "Click a zone on the plan to see its rules.",
  "rules.empty": "No rules here yet. Start one from a template on the left.",
  "rules.orphan": "zone removed",
  "rules.edit": "Edit",
  "rules.delete": "Delete",
  "rules.verdict.true": "Condition true",
  "rules.verdict.false": "Condition false",
  "rules.verdict.unknown": "Condition unknown",
  "rules.status.ok": "OK",
  "rules.status.disabled": "Disabled",
  "rules.status.waiting": "Waiting for data",
  "rules.status.error": "Error",
  "rules.unsaved": "Not saved yet",
  "rules.unsavedChanges": "Unsaved changes",
  "rules.noTrace": "Waiting for live state",
  "rules.unknown1": "1 input without data",
  "rules.unknownN": "{n} inputs without data",
  "rules.did.on": "turned on",
  "rules.did.off": "turned off",
  "rules.did.open": "opened",
  "rules.did.close": "closed",
  "rules.last.elsewhere": "{target} switched {s} elsewhere {at}",
  "rules.last.already": "{target} already {s} {at}",
  "motionLight.row.auto": "{target} back to auto {at} (button)",
  "motionLight.row.autoAgain": "{target} back to auto {at} (no motion)",
  "motionLight.row.manualButton": "{target} manual {at} (button)",
  "motionLight.row.releasedOff": "{target} switched off elsewhere {at}: waits for new motion",
  "motionLight.row.found": "{target} found on {at}",
  "motionLight.row.autoOff": "{target} turned off {at} (back to auto: no motion)",
  "motionLight.row.autoOffLight": "{target} turned off {at} (back to auto: it is light)",
  "motionLight.row.autoOn": "{target} turned on {at} (back to auto: motion)",
  "motionLight.noAutoNote": 'No button here has an Auto action and "Auto again after" is 0: after a press the rule stays manual until it is changed.',
  "rules.last.kept": "{target} {reason} {at}",
  "action.ok": "OK",
  "rules.dialog.new": "New rule",
  "rules.dialog.edit": "Edit rule",
  "rules.name": "Name",
  "rules.namePlaceholder": "Rule name",
  "rules.combine": "Condition",
  "rules.combine.any": "Any input is active",
  "rules.combine.all": "All inputs are active",
  "rules.inputs": "Inputs",
  "rules.addInput": "Add input...",
  "rules.groupDevices": "Devices",
  "rules.groupRules": "Rules",
  "rules.noInputs": "No inputs yet.",
  "rules.not": "NOT",
  "rules.remove": "Remove",
  "rules.delays": "Delays",
  "rules.onDelay": "On delay, s",
  "rules.offDelay": "Off delay, s",
  "rules.whenTrue": "When true",
  "rules.whenFalse": "When false",
  "rules.addAction": "Add action...",
  "rules.noActions": "No actions",
  "rules.zone": "Zone",
  "rules.zone.none": "No zone",
  "rules.zone.removed": "Zone removed",
  "rules.enabled": "Enabled",
  "rules.missingDevice": "(missing device)",
  "rules.missingRule": "(missing rule)",
  "rules.src.device": "Device",
  "rules.src.rule": "Rule",
  "rules.src.light": "Light level",
  "rules.src.daylight": "Daylight",
  "rules.src.sun": "Sun",
  "rules.src.time": "Time window",
  "rules.src.held": "Held",
  "rules.groupConditions": "Conditions",
  "rules.light.sensor": "Light sensor",
  "rules.light.below": "Below",
  "rules.light.hysteresis": "Hysteresis",
  "rules.light.unknownDark": "No data counts as dark",
  "rules.light.noSensor": "Pick a light sensor",
  "rules.light.unit": "This sensor reports {unit}, not lx; the thresholds are read as lx and the input has no data.",
  "rules.sun.below": "below horizon",
  "rules.sun.above": "above horizon",
  "rules.daylight.sensor": "Sensor",
  "rules.daylight.is.night": "is night",
  "rules.daylight.is.dark": "is dark",
  "rules.daylight.is.day": "is day",
  "rules.time.from": "From",
  "rules.time.to": "To",
  "rules.held.state": "State",
  "rules.held.on": "on",
  "rules.held.off": "off",
  "rules.held.any": "any (unchanged)",
  "rules.held.for": "For",
  "rules.held.addSource": "Add source...",
  "rules.held.noSources": "No sources yet.",
  "rules.held.removeSource": "Remove source",
  "rules.unit.s": "s",
  "rules.unit.min": "min",
  "rules.unit.h": "h",
  "rules.gate": "Act only when",
  "rules.gate.set": "Set gate...",
  "rules.gate.hint": "Actions are sent only while the gate is open.",
  "rules.flow.gate": "Gate",
  "rules.flow.open": "open",
  "rules.flow.closed": "closed",
  "rules.flow.opensIn": "opens in {t}",
  "rules.flow.trueIn": "true in {t}",
  "rules.flow.heldNote": "Actions are held until the gate opens.",
  "rules.flow.noGate": "No gate",
  "rules.act.on": "Turn on",
  "rules.act.off": "Turn off",
  "rules.act.open": "Open",
  "rules.act.close": "Close",
  "rules.val.true": "true",
  "rules.val.false": "false",
  "rules.val.unknown": "no data",
  "rules.problem.name": "Give the rule a name.",
  "rules.problem.inputs": "Add at least one input.",
  "rules.problem.device-missing": "A device of this rule is no longer on the plan.",
  "rules.problem.rule-missing": "An input rule no longer exists.",
  "rules.problem.cycle": "These inputs make the rules depend on each other in a loop.",
  "rules.problem.action": "An action is not available for its device.",
  "rules.problem.delay": "Delays are whole seconds from 0 to 3600.",
  "rules.problem.light": "Light level: below must be above 0 and hysteresis 0 or more.",
  "rules.problem.daylight": "Daylight: pick an illuminance sensor and night, dark or day; NOT is not available for it.",
  "rules.problem.time": "Time window: both times set and different.",
  "rules.problem.held": "Held: pick at least one source and a time of 1 s to 24 h.",
  "rules.flow.title": "Rule flowchart",
  "rules.flow.result": "Result",
  "rules.flow.delay": "delay on {on} s, off {off} s",
  "rules.flow.pending": "{to} in {t}",
  "rules.flow.last": "Last action:",
  "rules.flow.new": "Live state appears after Save",
  "rules.flow.edited": "Saved version: your changes apply after Save",
  "delete.rule.title": "Delete rule",
  "delete.rule.text": "Delete rule '{name}'? You can undo this until you save.",
  "delete.rule.usedBy": "Used by: {names} — they will lose this input.",
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
  "props.daylightInBinding": "Daylight thresholds are set in the Binding step.",
  "props.nightBelow": "Night below, lx",
  "props.dayAbove": "Day above, lx",
  "props.sunNight": "Sun: night below, °",
  "props.sunDay": "Sun: day above, °",
  "props.debounce": "Debounce, s",
  "props.badDecimal": "Enter a number.",
  "props.badDebounce": "Debounce is a whole number of seconds from 0 to 3600.",
  "props.badDebounceStored": "Debounce is not a whole number from 0 to 3600; {s} s applies.",
  "props.badLuxPair": "Night below must be 0 or more and under Day above; {night} / {day} lx apply.",
  "props.badSunPair": "Sun: night below must be under day above; {night}° / {day}° apply.",
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
function u(t) {
  return ip[t] ?? t;
}
const op = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], sp = 10;
function Wt(t, e) {
  const n = (i, o) => ({ name: i, dir: o });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Bt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
    case "battery":
      return [n("BAT", "in")];
    case "pv":
      return [n("OUT", "out")];
    case "remainder":
      return [n("IN", "in")];
    case "transfer":
      return t.form === "2in1out" ? [n("A", "in"), n("B", "in"), n("OUT", "out")] : t.form === "1in2out" ? [n("IN", "in"), n("A", "out"), n("B", "out")] : [];
    default:
      return [];
  }
}
function Zc() {
  return { blocks: [{ id: ie(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function rp(t, e, n, i) {
  const o = { id: ie(), x: e.x, y: e.y }, s = { ...o, name: `${u(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
  switch (t) {
    case "device":
      return { ...o, kind: t, deviceId: i ?? "", output: !1 };
    case "bus":
      return { ...s, kind: t, w: 240, h: 12 };
    case "transfer":
      return { ...s, kind: t, form: "2in1out" };
    default:
      return { ...s, kind: t };
  }
}
function gl(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function to(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function lp(t, e, n, i) {
  return to(t, e, (o) => ({ ...o, x: n, y: i }));
}
const ss = (t) => "block" in t ? t.block : t.bus, Gc = (t, e) => ss(t.from) === e || ss(t.to) === e;
function Mn(t, e, n, i) {
  const o = t.blocks.find((c) => c.id === e);
  if (!o) return t;
  const s = to(t, e, (c) => ({ ...c, ...n }));
  if (o.kind === "transfer" && "form" in n && n.form !== o.form)
    return { ...s, wires: s.wires.filter((c) => !Gc(c, e)) };
  const r = s.blocks.find((c) => c.id === e), l = new Set(Wt(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return s.wires.some((c) => a(c.from) || a(c.to)) ? { ...s, wires: s.wires.filter((c) => !a(c.from) && !a(c.to)) } : s;
}
function Kc(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Gc(i, e)) };
}
const Xc = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function no(t, e, n) {
  const i = Xc(t, e);
  if (i.size === 0) return t;
  const o = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(Wt(c, n).map((h) => h.name))])), s = (c) => "block" in c && !!o.get(c.block) && !o.get(c.block).has(c.port), r = t.wires.filter((c) => !s(c.from) && !s(c.to));
  let l = !1;
  const a = t.blocks.map((c) => {
    const h = o.get(c.id);
    if (!h || !c.portPins || Object.keys(c.portPins).every((m) => h.has(m))) return c;
    l = !0;
    const f = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => h.has(m))), { portPins: d, ...p } = c;
    return Object.keys(f).length ? { ...p, portPins: f } : p;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function ap(t, e) {
  const n = Xs(e), i = new Set(t.blocks.flatMap((s) => s.kind === "device" ? [s.deviceId] : []));
  let o = t;
  for (const s of i) o = no(o, s, n);
  return o;
}
function cp(t, e) {
  const n = Xc(t, e);
  if (n.size === 0) return t;
  const i = (o) => n.has(ss(o));
  return {
    ...t,
    blocks: t.blocks.filter((o) => !n.has(o.id)),
    wires: t.wires.filter((o) => !i(o.from) && !i(o.to))
  };
}
const Xs = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Yc(t, e, n) {
  var s;
  const i = ((s = t.devices.find((r) => r.id === n)) == null ? void 0 : s.placement.mode) === "none", o = of(t, n);
  return { level: o, power: i ? cp(e, n) : no(e, n, Xs(o)) };
}
function Qc(t, e, n, i) {
  const o = gc(t, n, i);
  return { level: o, power: o === t ? e : no(e, n, Xs(o)) };
}
function Jc(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function up(t, e, n, i) {
  return to(t, e, (o) => {
    const s = { ...o.portPins };
    i ? s[n] = i : delete s[n];
    const { portPins: r, ...l } = o;
    return Object.keys(s).length ? { ...l, portPins: s } : l;
  });
}
function dp(t, e) {
  return to(t, e, (n) => {
    const { portPins: i, ...o } = n;
    return o;
  });
}
function bl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function hp(t, e) {
  const n = t.filter((s) => s.kind === "transfer"), i = n.slice(0, sp), o = /* @__PURE__ */ new Map();
  for (const s of n) s.kind === "transfer" && o.set(s.id, s.form === "2in1out" ? "OUT" : "IN");
  for (let s = 0; s < 1 << i.length; s++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((h, f) => r.set(h.id, s & 1 << f ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (h) => {
      let f = h;
      for (; l.has(f) && l.get(f) !== f; ) f = l.get(f);
      return f;
    }, c = (h, f) => {
      if ("bus" in h) return `n:${h.bus}`;
      const d = o.get(h.block);
      return d !== void 0 && h.port !== d && h.port !== (r.get(h.block) ?? "A") ? `x:${f.id}:${h.port}` : `n:${h.block}`;
    };
    for (const h of e) {
      const f = a(c(h.from, h)), d = a(c(h.to, h));
      if (f === d) return !0;
      l.set(f, d);
    }
  }
  return !1;
}
function wl(t, e, n, i) {
  const o = new Map(t.blocks.map((b) => [b.id, b])), s = (b) => {
    if ("bus" in b) {
      const M = o.get(b.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = o.get(b.block), x = y ? Wt(y, i).find((M) => M.name === b.port) : void 0;
    return y && x ? { bl: y, dir: x.dir } : null;
  }, r = s(e), l = s(n);
  if (!r || !l) return { error: "missing" };
  if (r.bl.id === l.bl.id) return { error: "same-block" };
  let a = e, c = n;
  if (r.dir === null || l.dir === null)
    (r.dir === "in" || l.dir === "out") && (a = n, c = e);
  else {
    if (r.dir === l.dir)
      return { error: "direction" };
    r.dir === "in" && (a = n, c = e);
  }
  const h = (b) => "block" in b && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === b.block && x.port === b.port));
  if (h(a) || h(c)) return { error: "port-taken" };
  const f = (b) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === b && "block" in M) {
          const k = o.get(M.block);
          if (k) return bl(k, M.port);
        }
    return null;
  }, d = (b) => "bus" in b ? f(b.bus) : bl(o.get(b.block), b.port), p = d(a), m = d(c);
  if (p !== null && m !== null && p !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && o.get(c.block).kind === "remainder" && t.wires.some((b) => {
    var y;
    return "bus" in b.from && b.from.bus === a.bus && "block" in b.to && ((y = o.get(b.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const $ = { id: ie(), from: a, to: c }, w = [...t.wires, $];
  return hp(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: $ };
}
const Te = (t) => typeof t == "object" && t !== null && !Array.isArray(t), It = (t) => typeof t == "number" && Number.isFinite(t), fp = ["top", "right", "bottom", "left"], pp = ["2in1out", "1in2out"];
function mp(t, e) {
  let n = t;
  if (n.kind === "bus" && !(It(n.w) && It(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !pp.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, o = new Set(Wt(n, e).map((c) => c.name)), s = {};
  let r = Te(i);
  for (const [c, h] of Te(i) ? Object.entries(i) : []) {
    if (!o.has(c) || !Te(h) || !fp.includes(h.side) || !It(h.at)) {
      r = !1;
      continue;
    }
    const f = Math.min(1, Math.max(0, h.at));
    f !== h.at && (r = !1), s[c] = f === h.at ? h : { side: h.side, at: f };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(s).length ? { ...a, portPins: s } : a;
}
function gp(t, e) {
  if (!Te(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let o = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const s = [], r = /* @__PURE__ */ new Set();
  for (const h of n)
    if (Te(h) && typeof h.id == "string" && h.id && op.includes(h.kind) && It(h.x) && It(h.y)) {
      const f = mp(h, e);
      f !== h && (o = !0), f.kind === "transfer" && f.form !== h.form && r.add(f.id), s.push(f);
    } else o = !0;
  const l = new Map(s.map((h) => [h.id, h])), a = (h) => {
    var d;
    if (!Te(h)) return null;
    if (typeof h.bus == "string") {
      if (((d = l.get(h.bus)) == null ? void 0 : d.kind) !== "bus" || !It(h.at)) return null;
      const p = Math.min(1, Math.max(0, h.at));
      return p === h.at ? h : { bus: h.bus, at: p };
    }
    const f = typeof h.block == "string" ? l.get(h.block) : void 0;
    return f && !r.has(f.id) && Wt(f, e).some((p) => p.name === h.port) ? h : null;
  }, c = [];
  for (const h of i) {
    const f = Te(h) ? a(h.from) : null, d = Te(h) ? a(h.to) : null;
    if (!Te(h) || typeof h.id != "string" || !h.id || !f || !d) {
      o = !0;
      continue;
    }
    f === h.from && d === h.to ? c.push(h) : (o = !0, c.push({ ...h, from: f, to: d }));
  }
  return o ? { ...t, blocks: s, wires: c } : t;
}
function eu(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var o, s;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((o = i.bindings) != null && o.power) || !!((s = i.bindings) != null && s.control));
  }).sort((i, o) => i.name.localeCompare(o.name) || i.id.localeCompare(o.id));
}
function bp(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const On = 11, yi = 18, xi = 30, wp = 12, vp = 120, me = 14, vl = 10, _n = (t) => Math.round(t / vl) * vl || 0, ko = 24, $l = 6, $p = 2 * On + 6, yp = me, xp = 1e6, yl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, io = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Mo = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, tu = (t) => Math.min(1, Math.max(0, t));
function oo(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function kp(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const o = i.bindings ?? {}, s = Bt(i);
      return n(s ? o.power_in : o.power, s && o.power_out, o.voltage, o.control, s);
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
function De(t, e, n) {
  return n ? Js(n, t, e).r : Ys(t, e);
}
function Ys(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(vp, 7 * oo(t, e).length + 32),
    h: xi + yi * kp(t, e) + wp
  };
}
function ki(t, e, n) {
  switch (e) {
    case "top":
      return { x: t.x + n * t.w, y: t.y };
    case "bottom":
      return { x: t.x + n * t.w, y: t.y + t.h };
    case "left":
      return { x: t.x, y: t.y + n * t.h };
    case "right":
      return { x: t.x + t.w, y: t.y + n * t.h };
  }
}
function Mp(t, e) {
  const n = io(t), i = e.x - n.x, o = e.y - n.y;
  return i === 0 && o === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(o) / (t.h / 2) ? i > 0 ? "right" : "left" : o > 0 ? "bottom" : "top";
}
function _p(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], o = 1 / 0;
  for (const l of n) {
    const a = Ie(e, l.a, l.b);
    a < o && (i = l, o = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: tu(r) };
}
const An = (t) => t.w >= t.h;
function nu(t, e) {
  return An(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function Ap(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = An(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: ki(i, r, 0.5), side: r };
  }
  const o = io(i), s = An(t) ? n.y < o.y ? "top" : "bottom" : n.x < o.x ? "left" : "right";
  return { pt: ki(i, s, e), side: s };
}
function Sp(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const Qs = (t, e) => t.blocks.find((n) => n.id === e), rs = (t, e) => {
  const n = Qs(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, _o = (t, e, n) => "block" in t && t.block === e && t.port === n;
function Lp(t, e, n, i) {
  const o = t.wires.find((l) => _o(l.from, e, n) || _o(l.to, e, n));
  if (!o) return null;
  const s = _o(o.from, e, n) ? o.to : o.from;
  if ("bus" in s) {
    const l = rs(t, s.bus);
    return l ? nu(l, s.at) : null;
  }
  const r = Qs(t, s.block);
  return r ? io(Ys(r, i)) : null;
}
function Js(t, e, n) {
  const i = Ys(e, n), o = io(i), s = Wt(e, n).map((c) => {
    var m;
    const h = (m = e.portPins) == null ? void 0 : m[c.name];
    if (h) return { ...c, side: h.side, pin: h, key: 0 };
    const f = Lp(t, e.id, c.name, n), d = (f && Mp(i, f)) ?? Sp(e, c), p = f ?? o;
    return { ...c, side: d, pin: void 0, key: d === "top" || d === "bottom" ? p.x : p.y };
  }), r = (c) => {
    const h = s.filter((f) => f.side === c).length;
    return h ? (h + 1) * $p : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(s.length);
  s.forEach((c, h) => {
    c.pin && (a[h] = { name: c.name, dir: c.dir, side: c.side, pt: ki(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const h = s.map((f, d) => ({ p: f, i: d })).filter(({ p: f }) => !f.pin && f.side === c).sort((f, d) => f.p.key - d.p.key || f.i - d.i);
    h.forEach(({ p: f, i: d }, p) => {
      a[d] = { name: f.name, dir: f.dir, side: c, pt: ki(l, c, (p + 1) / (h.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function so(t, e, n) {
  return Js(t, e, n).places;
}
function iu(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const h = Qs(t, c.block);
    if (!h) return null;
    const { r: f, places: d } = Js(t, h, n), p = d.find((m) => m.name === c.port);
    return p ? { pt: p.pt, side: p.side, rect: f } : null;
  }, o = (c, h, f) => {
    if (!("bus" in c)) return null;
    const d = rs(t, c.bus);
    if (!d) return null;
    let p = f == null ? void 0 : f.pt;
    if (!p && "bus" in h) {
      const m = rs(t, h.bus);
      p = m && nu(m, h.at);
    }
    return p ? { ...Ap(d, c.at, p), rect: De(d, n, t) } : null;
  }, s = i(e.from), r = i(e.to), l = s ?? o(e.from, e.to, r), a = r ?? o(e.to, e.from, s);
  return l && a ? { a: l, b: a } : null;
}
const Bn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), ls = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function Cp(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = Bn(i[i.length - 2], a), h = Bn(a, l);
        if (c.x === h.x && c.y === h.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (c.x === -h.x && c.y === -h.y) return null;
      }
      i.push(l);
    }
  }
  const o = i.length;
  if (o < 2 || o > 6) return null;
  const s = Bn(i[0], i[1]), r = Bn(i[o - 2], i[o - 1]);
  return s.x !== e.x || s.y !== e.y || ls(i[0], i[1]) < me - 1e-9 || r.x !== -n.x || r.y !== -n.y || ls(i[o - 2], i[o - 1]) < me - 1e-9 ? null : i;
}
function Ip(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function Ep(t, e) {
  let n = (t.length - 2) * yp;
  for (let i = 1; i < t.length; i++) {
    n += ls(t[i - 1], t[i]);
    for (const o of e) Ip(t[i - 1], t[i], o) && (n += xp);
  }
  return n;
}
function ou(t, e) {
  const n = t.pt, i = e.pt, o = yl[t.side], s = yl[e.side], r = { x: n.x + o.x * me, y: n.y + o.y * me }, l = { x: i.x + s.x * me, y: i.y + s.y * me }, a = [t.rect, e.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - me, k[x] + k[M] + me]),
    Math.min(r[x], l[x]) - me,
    Math.max(r[x], l[x]) + me
  ])], h = c("x", "w"), f = c("y", "h"), d = o.x === 0, p = s.x === 0, m = (d ? f : h).filter((x) => (x - (d ? n.y : n.x)) * (d ? o.y : o.x) >= me - 1e-9), $ = (p ? f : h).filter((x) => (x - (p ? i.y : i.x)) * (p ? s.y : s.x) >= me - 1e-9);
  let w = null, b = 1 / 0;
  const y = (x) => {
    const M = Cp(x, o, s);
    if (!M) return;
    const k = Ep(M, a);
    k < b - 1e-6 && (w = M, b = k);
  };
  if (d && p)
    for (const x of m) for (const M of h) for (const k of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!d && !p)
    for (const x of m) for (const M of f) for (const k of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (d)
    for (const x of m) for (const M of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, d ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function su(t, e, n) {
  const i = De(t, e, n), o = i.x + (i.w - (3 * ko + 2 * $l)) / 2, s = i.y + xi + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: o + l * (ko + $l), y: s, w: ko, h: yi - 2 }
  }));
}
function Dp(t) {
  const { x: e, y: n, w: i, h: o } = t;
  return An(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + o } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + o } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + o }, b: { x: e + i, y: n + o } }];
}
function xl(t, e, n, i) {
  const o = [...t.blocks].reverse();
  for (const h of o) {
    if (h.kind !== "transfer") continue;
    const f = su(h, i, t).find((d) => Mo(e, d.rect, 0));
    if (f) return { kind: "chip", block: h.id, position: f.position };
  }
  let s = null, r = 1 / 0;
  for (const h of o)
    for (const f of so(t, h, i)) {
      const d = z(e, f.pt);
      d <= On + n && d < r && (s = { kind: "port", block: h.id, port: f.name }, r = d);
    }
  if (s) return s;
  for (const h of o) {
    if (h.kind !== "bus") continue;
    let f = null, d = 1 / 0;
    for (const p of Dp(h)) {
      const m = Ie(e, p.a, p.b);
      m <= n && m < d && (f = { kind: "bus-end", id: h.id, end: p.end }, d = m);
    }
    if (f) return f;
  }
  for (const h of o) {
    if (h.kind !== "bus" || !Mo(e, De(h, i, t), n)) continue;
    const f = An(h) ? (e.x - h.x) / h.w : (e.y - h.y) / h.h;
    return { kind: "bus", id: h.id, at: tu(f) };
  }
  let l = null, a = 1 / 0;
  for (const h of t.wires) {
    const f = iu(t, h, i);
    if (!f) continue;
    const d = ou(f.a, f.b);
    for (let p = 1; p < d.length; p++) {
      const m = Ie(e, d[p - 1], d[p]);
      m <= n && m < a && (l = { kind: "wire", id: h.id }, a = m);
    }
  }
  if (l) return l;
  const c = o.find((h) => h.kind !== "bus" && Mo(e, De(h, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function Op(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const r of t.blocks) {
    const l = De(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), o = Math.max(o, l.x + l.w), s = Math.max(s, l.y + l.h);
  }
  return { x: n, y: i, w: o - n, h: s - i };
}
class ru extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function Ao(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Np(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Pp(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (o) {
    throw typeof o == "object" && o !== null && o.code === "revision_conflict" ? new ru(o.message) : o;
  }
}
async function Tp(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Hp = 3;
function Le(t) {
  if (typeof t == "number")
    return t === Hp ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class Vp {
  constructor(e, n) {
    this.hass = e, this.onChange = n, this.state = "idle", this.errorMessage = null, this.dirty = !1, this.baseRevision = null, this.dirtyVersion = 0, this.inflight = null;
  }
  /** Starts over for a freshly opened plan (no pending edits, no error). */
  reset(e) {
    this.state = "idle", this.errorMessage = null, this.dirty = !1, this.dirtyVersion++, this.baseRevision = e, this.onChange();
  }
  markDirty() {
    this.dirty = !0, this.dirtyVersion++, this.onChange();
  }
  save(e) {
    return this.inflight ? this.inflight.then(() => {
    }) : this.run(e, this.baseRevision, !1).then(() => {
    });
  }
  overwrite(e) {
    return this.inflight ? this.inflight.then(() => {
    }) : this.run(e, this.baseRevision, !0).then(() => {
    });
  }
  /**
   * Saves a copy under a new id and name. Returns the new plan (revision set) on
   * success; the caller must adopt it. Returns null on failure or when another
   * save is already in flight (state shows conflict/error).
   */
  async saveAsNew(e, n) {
    if (this.inflight)
      return await this.inflight, null;
    const i = { ...e, id: ie(), name: n, revision: 0 }, o = await this.run(i, null, !1);
    return o === null ? null : { ...i, revision: o };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(e, n, i) {
    const o = this.doRun(e, n, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = o, o;
  }
  async doRun(e, n, i) {
    this.state = "saving", this.errorMessage = null;
    const o = this.dirtyVersion;
    this.onChange();
    try {
      const s = await Pp(this.hass, e, n, i);
      return this.baseRevision = s, this.dirty = this.dirtyVersion !== o, this.state = "saved", this.onChange(), s;
    } catch (s) {
      return s instanceof ru ? (this.state = "conflict", this.errorMessage = s.message) : (this.state = "error", this.errorMessage = Le(s)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ro = (t) => (...e) => ({ _$litDirective$: t, values: e });
let lo = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, n, i) {
    this._$Ct = e, this._$AM = n, this._$Ci = i;
  }
  _$AS(e, n) {
    return this.update(e, n);
  }
  update(e, n) {
    return this.render(...n);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lu = (t) => t.strings === void 0, zp = {}, er = (t, e = zp) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rp = ro(class extends lo {
  constructor() {
    super(...arguments), this.key = v;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (er(t), this.key = e), n;
  }
});
var au = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Bp = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Fp = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Up = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Wp = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", jp = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", qp = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", kl = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Zt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Zp = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Gp = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Kp = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Xp = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", cu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Yp = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Qp = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Jp = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", uu = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", em = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", tm = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", du = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", nm = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", im = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", hu = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", om = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", sm = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", fu = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", rm = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", lm = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", am = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", cm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", um = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", dm = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", hm = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", fm = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", pm = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", mm = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", pu = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", gm = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", bm = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", wm = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function mu(t, e, n) {
  switch (t) {
    case "up":
      return { x: -e.w / 2, y: -n - e.h };
    case "down":
      return { x: -e.w / 2, y: n };
    case "left":
      return { x: -n - e.w, y: -e.h / 2 };
    case "right":
      return { x: n, y: -e.h / 2 };
    case "up-left":
      return { x: -n - e.w, y: -n - e.h };
    case "up-right":
      return { x: n, y: -n - e.h };
    case "down-left":
      return { x: -n - e.w, y: n };
    case "down-right":
      return { x: n, y: n };
  }
}
function vm(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function $m(t, e, n, i) {
  const o = [t, t + n / 2, t + n], s = [e, e + i / 2, e + i], r = [];
  for (const l of o) for (const a of s) (l !== o[1] || a !== s[1]) && r.push({ x: l, y: a });
  return r;
}
function ym(t, e, n, i, o) {
  const s = $m(e, n, i, o);
  if (!s.every((l) => Ut(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + o)) return null;
  let r = 1 / 0;
  for (const l of s)
    for (let a = 0; a < t.length; a++) r = Math.min(r, Ie(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function xm(t, e, n, i, o) {
  const s = e.placement.mode === "wall", r = s ? vm(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const d of t.zones) {
    const p = de(t, d);
    if (p.length < 3 || !Ut(p, n.pt)) continue;
    const m = Math.abs(Ee(p));
    m < a && (a = m, l = p);
  }
  if (!l) return r;
  const c = (d) => {
    const p = mu(d, i, o);
    return ym(l, n.pt.x + p.x, n.pt.y + p.y, i.w, i.h);
  }, h = (d) => {
    let p = null, m = -1;
    for (const $ of d) {
      const w = c($);
      w !== null && w > m && (p = $, m = w);
    }
    return p;
  }, f = ["down-right", "down-left", "up-right", "up-left"];
  if (s) {
    const d = r === "up" || r === "down", p = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = f.filter(($) => d ? $.startsWith(r) : $.endsWith(r));
    return h(m) ?? h(d ? ["right", "left"] : ["down", "up"]) ?? (c(p) !== null ? p : r);
  }
  return h(["right", "left"]) ?? h(f) ?? h(["down", "up"]) ?? r;
}
const pe = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Ce(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function gu(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${u("unit.m2")}`;
}
const Nn = 12, Y = "non-scaling-stroke", km = 7, Mm = 10, Mi = "#f43f5e", Ml = "3 2", _l = 18, _m = 6, Al = 11, Am = 0.6, Sm = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", bu = 24, Fn = 4, Sl = 4, oi = Nn * 0.85, Lm = 0.58;
function Cm(t, e, n, i) {
  const o = bu;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const s = n * Math.PI / 180, r = Math.abs(Math.cos(s)), l = Math.abs(Math.sin(s)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], h = a * i - 2 * Sl, f = c * i - 2 * Sl, d = e.length * Lm * oi, p = o + Fn + oi, m = o + Fn + d, $ = Math.max(o, d), w = (M, k) => Math.max(0, M - h) + Math.max(0, k - f), b = w($, p), y = w(m, o);
  if (b > 0 && y < b) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + o / 2) / i,
      iconY: 0,
      labelX: (M + o + Fn) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -p / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + o / 2) / i,
    labelX: 0,
    labelY: (x + o + Fn + oi / 2) / i,
    labelAnchor: "middle"
  };
}
function Im(t, e, n, i = 0, o = 0) {
  const s = bu / e;
  return customElements.get("ha-icon") ? A`<foreignObject class="equipment-icon" x=${i - s / 2} y=${o - s / 2} width=${s} height=${s}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${s}px;color:${n};display:block`}></ha-icon></foreignObject>` : A`<g class="equipment-icon" transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}>
    <path d=${Sm} fill=${n}></path></g>`;
}
const Em = "__preview__", Dm = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Om = /* @__PURE__ */ new WeakMap();
function Nm(t, e) {
  var o;
  const n = Ce(Om, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Ce(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (o = Ce(i, t.openings, () => ({})))[e] ?? (o[e] = xc(t, e));
}
const Pm = /* @__PURE__ */ new WeakMap();
function wu(t, e) {
  const n = Yi(e.props.kind);
  if (!n) return [];
  const i = Nm(t, n), o = Ce(Pm, i, () => /* @__PURE__ */ new WeakMap());
  let s = o.get(e);
  return s || (s = wf(t, e, () => i), o.set(e, s)), s;
}
function _i(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function Tm(t, e, n, i, o, s = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = o ?? v;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? A`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></rect>` : l.shape === "spot" ? A`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${Y}></circle>` : A`<circle class="icon" r=${_i(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>`;
    case "wall_light":
      return A`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></path>`;
    case "motion_sensor": {
      const h = (f) => `M${e * f} ${-e * f * 0.8}A${e * f} ${e * f * 0.8} 0 0 1 ${e * f} ${e * f * 0.8}`;
      return A`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="arcs" d=${h(1) + h(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    case "illuminance_sensor": {
      let h = "";
      for (let f = 0; f < 8; f++) {
        const d = f * Math.PI / 4;
        h += `M${Math.cos(d) * e * 1.15} ${Math.sin(d) * e * 1.15}L${Math.cos(d) * e * 1.6} ${Math.sin(d) * e * 1.6}`;
      }
      return A`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="rays" d=${h} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    case "wall_switch":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></rect>`;
    case "valve":
      return A`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${Y}></path>`;
    case "leak_sensor":
      return A`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${s} stroke=${s} stroke-width="1" vector-effect=${Y}></path>`;
    case "smart_button":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${Y}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return A`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${s}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${s}></circle>`;
    case "climate_sensor":
      return A`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${Y}></path>`;
    case "exhaust_fan": {
      let h = "";
      for (let f = 0; f < 4; f++) {
        const d = f * Math.PI / 2 + Math.PI / 4;
        h += `M0 0L${Math.cos(d) * e * 0.85} ${Math.sin(d) * e * 0.85}`;
      }
      return A`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="blades" d=${h} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    default:
      return A`${v}`;
  }
}
function Hm(t, e, n, i, o, s) {
  const r = t.props;
  if (r.kind !== "equipment") return A`${v}`;
  const l = Cm(r, r.label, i, e.scale), a = s ?? v, c = r.shape === "circle" ? A`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${Y}></circle>
      ${o ? A`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : v}` : A`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${Y}></rect>
      ${o ? A`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : v}`;
  return A`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${Im(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${oi / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function Vm(t, e, n = 0) {
  return t === "bound" ? v : A`<circle class=${`bind-ring bind-${t}`} r=${Math.max(Nn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${Dm[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : v} vector-effect=${Y}></circle>`;
}
function zm(t, e, n) {
  if (t.status !== "error") return v;
  const i = e * 0.9, o = -e * 0.9, s = Mm / n.scale;
  return A`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${o} r=${km / n.scale} fill=${n.palette.background} stroke=${Mi} stroke-width="1.5"
      vector-effect=${Y}></circle>
    <path d=${au} fill=${Mi} transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}></path>
  </g>`;
}
function Rm(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? Mi : t === "event" ? e.selection : e.device;
}
function Bm(t, e, n, i, o, s) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return v;
  const l = 1 / s.scale, a = r.map(([w]) => (w.text.length * Al * Am + 2 * _m) * l), c = _l * l, h = (_l + 2) * l, f = { w: Math.max(...a), h: c + h * (r.length - 1) }, d = o + 4 * l, p = Math.max(1, i.shown.length), m = xm(t, e, n, { w: Math.max(...a.slice(0, p)), h: c + h * (p - 1) }, d), $ = mu(m, f, d);
  return A`${r.map(([w, b], y) => {
    const x = a[y], M = $.x + (f.w - x) / 2, k = $.y + (m.startsWith("up") ? r.length - 1 - y : y) * h, _ = Rm(w.tone, s.palette);
    return Rp(`${b}:${w.key ?? ""}`, A`<g class=${`bubble ${b}`} data-tone=${w.tone}>
      <rect x=${M} y=${k} width=${x} height=${c} rx=${c / 2} fill=${s.palette.background} stroke=${_} stroke-width="1.5"
        vector-effect=${Y}></rect>
      <text x=${M + x / 2} y=${k + c / 2} text-anchor="middle" dominant-baseline="central" fill=${_} font-weight="700"
        font-size=${Al * l} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function Fm(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : _i(t, Nn / e.scale);
}
function Um(t, e, n, i) {
  var r;
  const o = (r = i.bubbles) == null ? void 0 : r.call(i, e), s = o ? Bm(t, e, n, o, Fm(e, i), i) : v;
  return s === v ? v : A`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : v}>${s}</g>`;
}
function Wm(t, e, n, i) {
  var x, M, k;
  const o = n.palette, s = t.invalid ? o.invalid : o.device, r = Nn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, c = !i && Wi(t.props.kind), h = c ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, f = i || (k = n.live) == null ? void 0 : k.call(n, t), d = (f == null ? void 0 : f.look) === "on" || (f == null ? void 0 : f.look) === "active", p = c && !!n.containerState && !h || (f == null ? void 0 : f.look) === "no-data", m = t.props.kind, $ = !d || t.invalid ? s : m === "leak_sensor" ? Mi : m === "motion_sensor" ? o.motionCone : s, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (p ? " no-data" : ""), b = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, _i(t, r));
  return A`
    <g class=${w} data-id=${t.id} opacity=${b} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? A`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${o.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${Y}></circle>` : v}
      ${t.props.kind === "equipment" ? Hm(t, n, s, l, d, p ? Ml : void 0) : A`<g transform=${`rotate(${l})`}>${Tm(
    t,
    r,
    $,
    d ? $ : o.deviceFill,
    p ? Ml : void 0,
    d ? o.deviceFill : $,
    (f == null ? void 0 : f.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? Vm(n.bindingStatus(t), n.scale, _i(t, r)) : v}
      ${h ? zm(h, r, n) : v}
    </g>`;
}
function Ll(t, e, n, i) {
  const o = wu(t, e);
  if (o.length === 0) return v;
  const s = n.palette, r = e.invalid ? s.invalid : Yi(e.props.kind) === "motion" ? s.motionCone : s.cone, l = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, a = o.map(pe).join("");
  return e.props.kind === "ceiling_light" ? A`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${Y}></path>` : A`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${Y}></path>`;
}
function jm(t, e, n, i) {
  const o = wu(t, e);
  let s = 0;
  for (const c of o) for (const h of c) s = Math.max(s, Math.hypot(h.x - n.pt.x, h.y - n.pt.y));
  s === 0 && (s = Nn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : v;
  return A`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${s}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${o.length ? A`<path class="light-fill" d=${o.map(pe).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : A`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${s} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function qm(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return v;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), o = i ? os(t, i, e.scale) : null;
  if (!o) return v;
  const s = e.palette.selection;
  return A`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : v}>
    <line x1=${o.from.x} y1=${o.from.y} x2=${o.to.x} y2=${o.to.y} stroke=${s} stroke-width="2" vector-effect=${Y}></line>
    <circle class="aim-knob" cx=${o.to.x} cy=${o.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${s}
      stroke-width="2" vector-effect=${Y} style="cursor:grab"></circle>
  </g>`;
}
function Zm(t, e) {
  const n = [];
  for (const i of t.devices) {
    const o = le(t, i);
    o && n.push({ d: i, pose: o, preview: !1 });
  }
  if (e.preview) {
    const i = { id: Em, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, o = le(t, i);
    o && n.push({ d: i, pose: o, preview: !0 });
  }
  return A`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return v;
    if (e.live && !i.preview) {
      const o = e.live(i.d).look, s = i.d.props.kind;
      return s === "ceiling_light" || s === "wall_light" ? o === "on" ? jm(t, i.d, i.pose, e) : v : s === "motion_sensor" && o === "active" ? Ll(t, i.d, e, !1) : v;
    }
    return Ll(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Wm(i.d, i.pose, e, i.preview))}</g>
    ${qm(t, e)}
    ${e.bubbles ? A`<g class="bubbles">${n.map((i) => i.preview ? v : Um(t, i.d, i.pose, e))}</g>` : v}`;
}
const Cl = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], tr = (t) => Cl[t % Cl.length], pt = "non-scaling-stroke", Gm = "0.55", Km = /* @__PURE__ */ new WeakMap();
function Xm(t, e, n, i) {
  const o = i.palette, s = tr(n), r = i.selectedId === e.id, l = Ce(Km, t, Ec).get(e.id), a = 12 / i.scale;
  return A`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${pe(de(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : s}
        fill-opacity=${e.invalid ? v : "0.16"} stroke=${s} stroke-width="1.5" vector-effect=${pt}
        opacity=${i.selectedId !== null && !r ? Gm : v}></path>
      ${l ? A`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? o.invalid : o.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${o.zoneLabel}>${gu(Rs(t, e))}</tspan>
      </text>` : v}
    </g>`;
}
function Ym(t, e) {
  const n = e.palette, i = t.zones.map((s, r) => ({ z: s, i: r }));
  if (e.mode !== "plan")
    return A`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: s, i: r }) => A`
      <path class="zone" data-id=${s.id} d=${pe(de(t, s))} fill="none" stroke=${tr(r)} stroke-width="1"
        vector-effect=${pt}></path>`)}</g>`;
  const o = 8 / e.scale;
  return A`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${o} height=${o} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${o} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: s, i: r }) => Xm(t, s, r, e))}</g>`;
}
function Qm(t, e, n) {
  const i = n.palette, o = 14 / n.scale;
  return A`<g class="zone-members">${Be(t, e).map(({ device: s, participates: r }) => {
    const l = le(t, s);
    return l ? r ? A`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${pt}></circle>` : A`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${pt}></circle>` : v;
  })}</g>`;
}
function Jm(t, e, n) {
  if (e.shape.kind !== "polygon") return v;
  const i = n.palette, o = e.shape.vertices;
  return A`${de(t, e).map((s, r) => {
    const l = o[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return A`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${s.x} cy=${s.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${pt}></circle>`;
  })}`;
}
function eg(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return A`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${pt}></polyline>`;
}
function tg(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return A`<g class="zone-overlay">
    ${n ? A`<path class="zone-outline" data-id=${n.id} d=${pe(de(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${pt}></path>` : v}
    ${n ? Qm(t, n.id, e) : v}
    ${n ? Jm(t, n, e) : v}
    ${e.draft ? eg(e.draft, e) : v}</g>`;
}
function ht(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const ng = /* @__PURE__ */ new WeakMap(), ig = /* @__PURE__ */ new WeakMap(), vu = /* @__PURE__ */ new WeakMap();
function ao(t, e, n) {
  const i = se(t.dir), o = R(t.a, N(t.dir, e)), s = R(t.a, N(t.dir, n));
  return [R(o, N(i, t.leftOff)), R(s, N(i, t.leftOff)), P(s, N(i, t.rightOff)), P(o, N(i, t.rightOff))];
}
function Sn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ae(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const J = "non-scaling-stroke";
function og(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, o = 5 / e.scale, s = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = Sn(t, l.id);
    if (!a) continue;
    const c = se(a.dir);
    for (const [h, f, d] of [[l.a, a.a, a.dir], [l.b, a.b, N(a.dir, -1)]]) {
      const p = t.nodes.find((k) => k.id === h);
      if (!p || p.host || n.get(h) !== 1) continue;
      const m = R(f, N(c, a.leftOff + i)), $ = P(f, N(c, a.rightOff + i)), w = N(c, 1), b = N(R(m, $), 0.5), y = R(P(b, N(w, -s)), N(d, o / 2)), x = P(P(b, N(w, s)), N(d, o / 2)), M = [m, y, x, $];
      r.push(A`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${J}></path>`);
    }
  }
  return r.length ? A`${r}` : v;
}
function sg(t, e, n) {
  const i = se(t.dir), o = (e.swing ?? "left") === "left", s = o ? i : N(i, -1), r = o ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = R(R(t.a, N(t.dir, l)), N(s, r)), h = R(R(t.a, N(t.dir, a)), N(s, r)), f = R(c, N(s, e.width)), d = ue(P(f, c), P(h, c)) > 0 ? 1 : 0;
  return A`
    <line x1=${c.x} y1=${c.y} x2=${f.x} y2=${f.y} stroke=${n} stroke-width="1.5" vector-effect=${J}></line>
    <path d=${`M${f.x} ${f.y}A${e.width} ${e.width} 0 0 ${d} ${h.x} ${h.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${J}></path>`;
}
function rg(t, e, n) {
  const i = se(t.dir), o = t.leftOff + t.rightOff, s = [t.leftOff - o / 3, t.leftOff - 2 * o / 3].map((r) => {
    const l = R(R(t.a, N(t.dir, e.offset)), N(i, r)), a = R(R(t.a, N(t.dir, e.offset + e.width)), N(i, r));
    return A`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${J}></line>`;
  });
  return A`${s}`;
}
function lg(t, e, n) {
  const i = Sn(t, e.wallId);
  if (!i) return v;
  const o = n.palette, s = e.invalid ? o.invalid : e.kind === "window" ? o.window : o.door, r = ao(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return A`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${pe(r)} fill=${e.invalid ? o.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? sg(i, e, s) : e.kind === "window" ? rg(i, e, s) : v}
    </g>`;
}
function Il(t, e, n, i, o) {
  const s = o.palette.dim, r = 6 / o.scale, l = R(t, N(n, i)), a = R(e, N(n, i)), c = (f, d) => {
    const p = R(d, N(n, i + r));
    return A`<line x1=${f.x} y1=${f.y} x2=${p.x} y2=${p.y} stroke=${s} stroke-width="0.75" vector-effect=${J}></line>`;
  }, h = R(N(R(l, a), 0.5), N(n, 9 / o.scale));
  return A`
    <g class="dim">
      ${c(R(t, N(n, 2 / o.scale)), t)}${c(R(e, N(n, 2 / o.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${s} stroke-width="1" vector-effect=${J}></line>
      <text x=${h.x} y=${h.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / o.scale}
        fill=${s} font-family="system-ui, sans-serif">${ht(z(t, e))}</text>
    </g>`;
}
function ag(t, e) {
  const n = e.selection;
  if (!n) return v;
  const i = e.palette, o = 4 / e.scale, s = (r) => A`<circle cx=${r.x} cy=${r.y} r=${o} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? s(r) : v;
  }
  if (n.kind === "wall") {
    const r = Ce(vu, t, Gi).get(n.id), l = Sn(t, n.id);
    if (!r || !l) return v;
    const a = se(l.dir);
    return A`
      <path d=${pe(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${J}></path>
      ${s(l.a)}${s(l.b)}
      ${Il(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((d) => d.id === n.id), l = r ? Sn(t, r.wallId) : null;
    if (!r || !l) return v;
    const a = N(se(l.dir), -1), c = l.rightOff + 18 / e.scale, h = (d) => R(l.a, N(l.dir, d)), f = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return A`
      <path d=${pe(ao(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${J}></path>
      ${f.filter(([d, p]) => p - d >= 1).map(([d, p]) => Il(h(d), h(p), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? A`<path class="zone-pick" d=${pe(de(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${J}></path>` : v;
  }
  return v;
}
function cg(t, e, n) {
  return z(t, e) < 1e-6 ? null : ao(Qa(t, e, n.thickness, n.baseline), 0, z(t, e));
}
function ug(t, e) {
  const { preview: n, palette: i } = e, o = 1e7, s = n.orthoFrom, r = n.opening, l = r ? Sn(t, r.wallId) : null;
  return A`
    ${s ? A`<path d=${`M${s.x - o} ${s.y}H${s.x + o}M${s.x} ${s.y - o}V${s.y + o}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${J}></path>` : v}
    ${(n.walls ?? []).map((a) => {
    const c = cg(a.a, a.b, a.props);
    return A`<g class="preview-wall">
        ${c ? A`<path d=${pe(c)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${J}></line></g>`;
  })}
    ${r && l ? A`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${pe(ao(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${hg(t, e)}`;
}
function dg(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return A`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${J}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${J}></rect></g>`;
}
function hg(t, e) {
  const n = e.preview, i = e.palette, o = n.anchor ? dg(n.anchor, e) : v, s = n.snap;
  if (!s || s.kind === "none") return o;
  const r = (p) => p / e.scale, { x: l, y: a } = s.pt, c = { stroke: i.background, width: "3" };
  let h, f = v;
  if (s.kind === "node" || s.kind === "corner") {
    const p = r(5);
    h = A`<g class=${s.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - p} y=${a - p} width=${2 * p} height=${2 * p} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${J}></rect></g>`;
  } else if (s.kind === "mid") {
    const p = r(11) / Math.sqrt(3), m = `M${l} ${a - p}L${l + p * 0.866} ${a + p / 2}L${l - p * 0.866} ${a + p / 2}Z`;
    h = A`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${J}></path></g>`;
  } else if (s.kind === "zoneVertex") {
    const p = r(7), m = `M${l} ${a - p}L${l + p} ${a}L${l} ${a + p}L${l - p} ${a}Z`;
    h = A`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${J}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${J}></path></g>`;
  } else if (s.kind === "wall" || s.kind === "zoneEdge") {
    const p = r(5), m = `M${l - p} ${a - p}L${l + p} ${a + p}M${l - p} ${a + p}L${l + p} ${a - p}`;
    h = A`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${J}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${J}></path></g>`;
    const $ = s.endpoint.kind === "wall" ? Ce(vu, t, Gi).get(s.endpoint.wallId) : void 0;
    $ && (f = A`<path class="snap-wall-hl" d=${pe($)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${J}></path>`);
  } else {
    const p = r(4), m = `M${l - p} ${a}H${l + p}M${l} ${a - p}V${a + p}`;
    h = A`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${J}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${J}></path></g>`;
  }
  const d = u(`snapmark.${s.kind}`);
  return A`
    ${f}${o}${h}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${J} font-family="system-ui, sans-serif">${d}</text>`;
}
function fg(t, e) {
  var d;
  const n = e.preview.level ?? t, i = e.palette, o = Ce(ng, n, (p) => nc(p, !0)), s = n.walls.filter((p) => p.type === "railing" || p.type === "fence"), r = s.length ? Ce(ig, n, Ps) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? v : String(i.dimOpacity), h = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, f = e.mode ?? "plan";
  return A`
    ${Ym(n, { palette: i, scale: e.scale, selectedId: h, mode: f === "automation" ? "plan" : f })}
    <path class="walls" d=${o.map((p) => p.map(pe).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? A`<g class="railings" opacity=${c}>${s.flatMap((p) => (r.get(p.id) ?? []).map((m) => A`<path d=${pe(m)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${c}>${n.openings.map((p) => lg(n, p, e))}</g>
    <g class="wall-breaks" opacity=${c}>${og(n, e)}</g>
    ${a ? tg(n, {
    palette: i,
    scale: e.scale,
    selectedId: h,
    draft: e.preview.zoneDraft,
    vertex: ((d = e.preview.zoneVertex) == null ? void 0 : d.zoneId) === h ? e.preview.zoneVertex.index : null
  }) : v}
    <g class="devices-layer">${a ? v : Zm(n, {
    palette: i,
    scale: e.scale,
    selection: l,
    showCones: e.showCones ?? !0,
    dim: !1,
    preview: e.preview.device,
    ...f === "binding" || f === "automation" ? {
      bindingStatus: f === "binding" ? e.bindingStatus : void 0,
      containerState: e.containerState,
      live: e.live,
      bubbles: e.bubbles
    } : {}
  })}</g>
    <g class="selection">${ag(n, e)}</g>
    <g class="preview">${ug(n, e)}</g>`;
}
const Me = "non-scaling-stroke", Ln = "system-ui, sans-serif", pg = 13, sn = 9, mg = 11, El = 18, So = 12, Lo = 11, Un = 13, gg = 3, si = 10, Dl = 4.5, bg = 12, wg = 11.5, nr = 10, Co = 10.5, vg = 6, $g = {
  IN: nm,
  OUT: hu,
  BAT: im,
  PV: fu
}, Ol = { dead: 0, nodata: 1, idle: 2, live: 3 };
function St(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Io = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function yg(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function Pn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const xg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, kg = A`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, $u = (t, e, n, i) => A`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${Me}>${i ? v : kg}</path>`, yu = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Tt = (t, e, n, i) => A`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function Mg(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (h) => "block" in h ? On : sn, o = t.pts[0], s = t.pts[t.pts.length - 1], r = si / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((h, f) => ({ p: t.pts[f], q: h, len: Math.abs(h.x - t.pts[f].x) + Math.abs(h.y - t.pts[f].y) })).sort((h, f) => f.len - h.len);
  for (const { p: h, q: f, len: d } of a) {
    if (d < 2 * r + 2 * l) continue;
    const p = { x: (h.x + f.x) / 2, y: (h.y + f.y) / 2 }, m = (w, b) => Math.hypot(p.x - w.x, p.y - w.y) >= b + r + l;
    if (!m(o, i(t.w.from)) || !m(s, i(t.w.to))) continue;
    const $ = Math.atan2(f.y - h.y, f.x - h.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: p, deg: (($ + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function _g(t, e, n) {
  var c;
  const i = e.palette, o = Pn(t.style, i), s = yu(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = Mg(t, e);
  return A`<g data-wire=${t.w.id}>
    ${r ? A`<path class="wire-selection" d=${s} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${Me}></path>` : v}
    ${t.style === "live" ? $u("glow", s, o, n) : v}
    <path class=${`wire ${t.style}`} d=${s} fill="none" stroke=${o} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${Me}></path>
    ${a ? A`<path class="arrow" d=${`M${si / 2} 0L${-si / 2} ${-Dl}L${-si / 2} ${Dl}Z`}
      fill=${o} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : v}
  </g>`;
}
function Ag(t, e, n) {
  const i = $g[t.name];
  return A`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${On} fill=${n.portFill}
      stroke=${e ? Pn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${Me}></circle>
    ${i ? Tt(i, t.pt, pg, n.portIcon) : A`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Ln}>${t.name}</text>`}
  </g>`;
}
function Sg(t, e) {
  const n = Math.max(4, Math.floor(e / (nr * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function Lg(t, e, n, i) {
  const o = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? oo(a, n) || u(`power.kind.${a.kind}`) : l;
  }), s = u("power.absorbed.one");
  return { kind: "text", value: o.length === 1 ? s.replace("{name}", Sg(o[0], i - 12 - s.replace("{name}", "").length * nr * 0.55)) : u("power.absorbed.many").replace("{n}", String(o.length)), small: !0, title: o.join(", ") };
}
function Cg(t, e, n, i, o, s) {
  var a;
  const r = () => ({ kind: "text", value: St(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Io(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: u("power.missing"), fill: o.blockInvalid }];
      const h = c.bindings ?? {}, f = Bt(c), d = [];
      return f ? (h.power_in && d.push({ kind: "text", label: u("power.in"), value: St(i == null ? void 0 : i.power_in) }), h.power_out && d.push({ kind: "text", label: u("power.out"), value: St(i == null ? void 0 : i.power_out) })) : h.power && d.push(r()), h.voltage && d.push({ kind: "text", value: Io(i == null ? void 0 : i.voltage, "V") }), h.control && d.push(l(pc(c))), f && d.push({ kind: "text", label: u("power.loss"), value: St(i == null ? void 0 : i.loss) }), d;
    }
    case "battery":
      return [{ kind: "text", label: u("power.soc"), value: Io(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: u("power.hint.disagree"), fill: o.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), Lg(t, i.absorbed, n, s)] : [r()];
    case "bus":
      return [];
  }
}
function Ig(t, e, n) {
  const i = t.state ?? "unknown", o = t.controllable ? 0 : So + 3, s = e.x - o / 2, r = `${u(`power.switch.${i}`)}${t.controllable ? "" : ` · ${u("power.readOnly")}`}`;
  return A`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${Tt(
    i === "on" ? Xp : Kp,
    { x: s, y: e.y },
    El,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? v : Tt(em, { x: s + El / 2 + 3 + So / 2, y: e.y + 1 }, So, n.blockValue)}
  </g>`;
}
function Nl(t, e, n) {
  switch (e) {
    case "top":
      return n.x - t.x;
    case "right":
      return t.w + (n.y - t.y);
    case "bottom":
      return t.w + t.h + (t.x + t.w - n.x);
    case "left":
      return 2 * t.w + t.h + (t.y + t.h - n.y);
  }
}
function Eg(t, e, n) {
  const i = 2 * (t.w + t.h), o = Nl(t, e.side, e.pt), s = ((Nl(t, n.side, n.pt) - o) % i + i) % i, r = s <= i / 2 ? 1 : -1, l = r > 0 ? s : i - s, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((h) => ({ c: h, d: ((h.t - o) * r % i + i) % i })).filter(({ d: h }) => h > 0 && h < l).sort((h, f) => h.d - f.d).map(({ c: h }) => h.pt);
  return [e.pt, ...c, n.pt];
}
function Dg(t, e, n, i, o, s) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return v;
  const l = so(t, e, i.geo), a = l.find((p) => p.name === r), c = l.find((p) => p.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return v;
  const h = o(c.name) ?? "nodata", f = Pn(h, i.palette), d = yu(Eg(De(e, i.geo, t), a, c));
  return A`${h === "live" ? $u("ts-glow", d, f, s) : v}
    <path class="ts-path" d=${d} fill="none" stroke=${f} stroke-width="3" stroke-dasharray=${h === "nodata" ? "5 4" : v}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${Me}></path>`;
}
function Og(t, e, n, i) {
  const o = i.palette;
  return su(e, i.geo, t).map(({ position: s, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === s;
    return A`<g class=${l ? "chip current" : "chip"} data-position=${s} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? o.accent : "none"}
        stroke=${l ? o.accent : o.blockStroke} stroke-width="1" vector-effect=${Me}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? o.accentText : o.blockValue} font-family=${Ln}>${s}</text>
    </g>`;
  });
}
function Ng(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? u("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? u("power.alert.missingDevice") : t === "disagree" ? u("power.alert.disagree") : t;
}
function Pg(t, e, n, i) {
  const o = gg + Un / 2, s = [
    { x: e.x + e.w - o, y: e.y + o },
    { x: e.x + e.w - o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + o }
  ], r = (a) => n.every(({ pt: c }) => {
    const h = Math.max(Math.abs(c.x - a.x) - Un / 2, 0), f = Math.max(Math.abs(c.y - a.y) - Un / 2, 0);
    return Math.hypot(h, f) > On;
  }), l = s.find(r) ?? s[0];
  return A`<g class="alert"><title>${t.map(Ng).join(`
`)}</title>
    ${Tt(au, l, Un, i.blockInvalid)}</g>`;
}
function Tg(t, e, n, i, o) {
  var $, w;
  const s = n.palette, r = De(e, n.geo, t), l = ($ = n.frame) == null ? void 0 : $.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, h = r.x + r.w / 2, f = oo(e, n.geo) || u(`power.kind.${e.kind}`), d = Cg(t, e, n.geo, l, s, r.w), p = e.kind === "remainder", m = so(t, e, n.geo);
  return A`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${s.blockFill}
      stroke=${p ? s.powerRemainder : s.blockStroke} stroke-width=${p ? 1.5 : 1.25}
      stroke-dasharray=${p ? "6 4" : v} vector-effect=${Me}></rect>
    ${e.kind === "transfer" ? Dg(t, e, l, n, (b) => i(e.id, b), o) : v}
    ${a && a.placement.mode !== "none" ? A`<g class="pin"><title>${u("power.planDevice")}</title>
      ${Tt(tm, { x: r.x + 4 + Lo / 2, y: r.y + 4 + Lo / 2 }, Lo, s.blockValue)}</g>` : v}
    <text class="name" x=${h} y=${r.y + xi - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${bg} font-weight="600" fill=${s.blockName} font-family=${Ln}>${f}</text>
    ${d.map((b, y) => {
    const x = r.y + xi + y * yi + yi / 2;
    if (b.kind === "chips") return e.kind === "transfer" ? Og(t, e, l, n) : v;
    if (b.kind === "switch") return Ig(b, { x: h, y: x }, s);
    const M = b.fill ?? s.blockValue, k = b.label ? A`<tspan>${b.label} </tspan>` : v, _ = b.note ? A`<tspan> ${b.note}</tspan>` : v;
    return A`<text x=${h} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${b.small ? nr : wg}
        fill=${M} font-family=${Ln}>${b.title ? A`<title>${b.title}</title>` : v}${k}<tspan
        font-weight=${b.small ? v : "600"}>${b.value}</tspan>${_}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? Pg(l.alert, r, m, s) : v}
    ${m.map((b) => Ag(b, i(e.id, b.name), s))}
  </g>`;
}
function Hg(t, e, n, i) {
  const o = i.palette, s = t.w >= t.h, r = s ? t.x : t.y, l = r + (s ? t.w : t.h), a = s ? t.h : t.w;
  let c = v;
  const h = t.name ?? "", f = Math.min(Co, a - 4), d = f >= vg, p = h.length * (d ? f : Co) * 0.58 + 12;
  if (h) {
    const m = e.map((b) => s ? b.x : b.y).sort((b, y) => b - y);
    let $ = { lo: 0, hi: -1 }, w = r;
    for (const b of [...m, l + sn]) {
      const y = Math.min(b - sn, l);
      y - w > $.hi - $.lo && ($ = { lo: w, hi: y }), w = Math.max(w, b + sn);
    }
    if ($.hi - $.lo >= p) {
      const b = ($.lo + $.hi) / 2, y = s ? { x: b, y: d ? t.y + t.h / 2 : t.y - 7 } : { x: d ? t.x + t.w / 2 : t.x - 7, y: b };
      c = A`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${d ? f : Co} fill=${o.blockValue} font-family=${Ln}
        transform=${s ? v : `rotate(-90 ${y.x} ${y.y})`}>${h}</text>`;
    }
  }
  return A`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${o.blockFill}
      stroke=${n ? Pn(n, o) : o.blockStroke} stroke-width="1.5" vector-effect=${Me}></rect>
    ${c}
  </g>`;
}
function Vg(t, e, n) {
  return A`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${sn} fill=${n.portFill} stroke=${Pn(e, n)} stroke-width="1.5"
      vector-effect=${Me}></circle>
    ${Tt(qp, t, mg, n.portIcon)}
  </g>`;
}
function zg(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const o = De(i, e.geo, t), s = 4 / e.scale;
  return A`<rect class="selection" x=${o.x - s} y=${o.y - s} width=${o.w + 2 * s} height=${o.h + 2 * s} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${Me}></rect>`;
}
function Rg(t, e) {
  var d;
  const n = e.preview.power ?? t, i = e.palette, o = [];
  for (const p of n.wires) {
    const m = iu(n, p, e.geo);
    if (!m) continue;
    const $ = (d = e.frame) == null ? void 0 : d.wires[p.id];
    o.push({ w: p, a: m.a, b: m.b, pts: ou(m.a, m.b), live: $, style: yg($) });
  }
  const s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const p of o)
    for (const [m, $] of [[p.w.from, p.a], [p.w.to, p.b]]) {
      if ("block" in m) {
        s.set(`${m.block}:${m.port}`, p.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Ol[p.style] > Ol[w]) && r.set(m.bus, p.style), l.set(m.bus, [...l.get(m.bus) ?? [], $.pt]), a.push({ at: $.pt, style: p.style });
    }
  const c = (p, m) => s.get(`${p}:${m}`), h = xg(), f = e.preview.wireDraft;
  return A`<g class="power">
    <g class="buses">${n.blocks.map((p) => p.kind === "bus" ? Hg(p, l.get(p.id) ?? [], r.get(p.id), e) : v)}</g>
    <g class="wires">${o.map((p) => _g(p, e, h))}</g>
    ${zg(n, e)}
    <g class="blocks">${n.blocks.map((p) => p.kind === "bus" ? v : Tg(n, p, e, c, h))}</g>
    <g class="terminals">${a.map((p) => Vg(p.at, p.style, i))}</g>
    ${f ? A`<line class="wire-draft" x1=${f.from.x} y1=${f.from.y} x2=${f.to.x} y2=${f.to.y}
      stroke=${f.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${Me}></line>` : v}
  </g>`;
}
const Bg = {
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
}, Fg = {
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
function Ug(t) {
  return t ? Bg : Fg;
}
class Wg extends lo {
  constructor(e) {
    if (super(e), e.type !== je.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? $e : (er(e), n);
  }
}
const X = ro(Wg), as = 1, Pl = 1e-6;
function jg(t, e, n, i, o) {
  const s = (a) => a > Pl && a < o - Pl, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = Zi(t, a).host.offset;
    s(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some(($) => $ === e.a || $ === e.b || r.has($))) continue;
    const c = te(t, a.a), h = te(t, a.b), f = z(c, h), d = f === 0 ? null : Se(n, i, c, P(h, c));
    if (!d) continue;
    const p = qi(d, c, h) * f;
    if (p < -as || p > f + as) continue;
    const m = K(P(d, n), i);
    s(m) && l.push({ t: m, wall: a, pt: d });
  }
  return l;
}
function Tl(t, e) {
  let n;
  for (const i of t) {
    const o = Math.abs(i.t - e), s = n ? Math.abs(n.t - e) : 1 / 0;
    (o < s || o === s && "nodeId" in i) && (n = i);
  }
  return n;
}
function Hl(t, e) {
  if ("nodeId" in e)
    return delete Zi(t, e.nodeId).host, e.nodeId;
  for (const s of [e.wall.a, e.wall.b]) if (z(te(t, s), e.pt) <= as) return s;
  const { pt: n, offset: i } = Ji(t, e.wall, e.pt), o = { id: ie(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(o), o.id;
}
function qg(t, e, n) {
  const i = t.walls.find((b) => b.id === e);
  if (!i) return t;
  const o = te(t, i.a), s = te(t, i.b), r = z(o, s), l = ji(P(s, o)), a = K(P(n, o), l), c = jg(t, i, o, l, r), h = Tl(c.filter((b) => b.t < a), a), f = Tl(c.filter((b) => b.t > a), a);
  if (!h && !f) return Ks(t, e);
  const d = Ne(t), p = d.walls.find((b) => b.id === e);
  let m = e, $ = 0;
  if (f) {
    const b = Hl(d, f);
    if ($ = K(P(te(d, b), o), l), h) {
      const y = { ...p, id: ie(), a: b };
      d.walls.push(y), m = y.id;
    } else
      p.a = b;
  }
  h && (p.b = Hl(d, h));
  const w = (b, y) => b.wallId !== e || h && y <= h.t ? !0 : !f || y < f.t ? !1 : (b.wallId = m, b.offset -= $, !0);
  d.openings = d.openings.filter((b) => w(b, b.offset + b.width / 2)), d.devices = d.devices.filter((b) => b.placement.mode !== "wall" || w(b.placement, b.placement.offset));
  for (const b of d.nodes) b.host && !w(b.host, b.host.offset) && delete b.host;
  for (const b of d.zones) {
    const y = b.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : Fs(x)));
  }
  return eo(d), Fe(d, t);
}
function ir(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Zg(t, e, n) {
  return R(t, N(ji(P(e, t)), n));
}
function Wn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function mt(t, e, n) {
  const { tolMm: i, grid: o, ortho: s } = n, r = s ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? ir(r, e) : e, c = r !== void 0 && a.y === r.y, h = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let f = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const _ = { x: k.x, y: k.y }, C = z(_, a);
    C <= i && h(_) && (!f || C < f.d) && (f = { id: k.id, pt: _, d: C });
  }
  let d = null;
  for (const k of n.corners ?? []) {
    const _ = z(k.pt, a);
    _ <= i && h(k.pt) && (!d || _ < d.d) && (d = { c: k, d: _ });
  }
  if (d && (!f || d.d < f.d)) {
    const k = d.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: d.c };
  }
  if (f) return { pt: f.pt, kind: "node", endpoint: { kind: "node", nodeId: f.id } };
  const p = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: ae(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: _ } of p) {
    const C = { x: (_.a.x + _.b.x) / 2, y: (_.a.y + _.b.y) / 2 }, L = z(C, a);
    L <= i && h(C) && (!m || L < m.d) && (m = { wallId: k.id, pt: C, offset: _.len / 2, d: L });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const $ = (k) => {
    let _ = null;
    for (const { w: C, f: L } of p) {
      const E = se(L.dir), H = k ? [L.leftOff, -L.rightOff].filter((I) => I !== 0) : [0];
      for (const I of H) {
        const O = R(L.a, N(E, I)), T = r ? Se(r, P(a, r), O, L.dir) : R(O, N(L.dir, K(P(a, O), L.dir)));
        if (!T) continue;
        const B = K(P(T, O), L.dir);
        if (B < 0 || B > L.len) continue;
        const D = z(T, a);
        D <= i && (!_ || D < _.d) && (_ = { d: D, res: { pt: T, kind: "wall", endpoint: { kind: "wall", wallId: C.id, offset: B } } });
      }
    }
    return _ ? _.res : null;
  }, w = $(!1);
  if (w) return w;
  const b = $(!0);
  if (b) return b;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const _ of k) {
      const C = z(_, a);
      C <= i && h(_) && (!x || C < x.d) && (x = { pt: _, d: C });
    }
  if (x) return Wn(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let _ = 0; _ < k.length; _++) {
      const C = k[_], L = k[(_ + 1) % k.length], E = z(C, L);
      if (E < 1e-9) continue;
      const H = N(P(L, C), 1 / E), I = r ? Se(r, P(a, r), C, H) : R(C, N(H, K(P(a, C), H)));
      if (!I) continue;
      const O = K(P(I, C), H);
      if (O < 0 || O > E) continue;
      const T = z(I, a);
      T <= i && (!M || T < M.d) && (M = { pt: I, d: T });
    }
  if (M) return Wn(M.pt, "zoneEdge");
  if (o && o > 0) {
    const k = (C) => Math.round(C / o) * o, _ = r ? c ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return Wn(_, "grid");
  }
  return Wn(a, "none");
}
function Gg(t, e, n) {
  return e.some((i, o) => Ie(t, i, e[(o + 1) % e.length]) <= n);
}
function or(t, e, n) {
  const i = Gi(t);
  for (const [o, s] of i) if (Ot(e, s)) return o;
  for (const [o, s] of i) if (Gg(e, s, n)) return o;
  return null;
}
function Kg(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const o = ae(t, i);
    if (o.len < 1e-9) continue;
    const { t: s, side: r } = ot(o, e);
    if (s >= n.offset && s <= n.offset + n.width && r >= -o.rightOff && r <= o.leftOff) return n.id;
  }
  return null;
}
function Xg(t, e, n, i) {
  const o = Kg(t, e);
  if (o) return { kind: "opening", id: o };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && z(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const s = or(t, e, n);
  return s ? { kind: "wall", id: s } : null;
}
const co = 3, Yg = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => de(t, n)).filter((n) => n.length >= 3);
function xu(t, e, n, i, o) {
  if (n.alt) {
    const l = n.shift && i ? ir(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const s = mt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Yg(e, o), corners: Ja(e) }), r = s.endpoint;
  if (s.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if (s.kind === "corner" && s.corner) {
    const l = s.corner, a = wt(e, l.wallId), c = a !== null && l.offset >= -vi && l.offset <= a + vi, h = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, f = c ? yn(e, l.wallId, l.side, h) : null;
    if (f) return { vertex: { kind: "wall", wallId: l.wallId, offset: h, side: l.side, x: f.x, y: f.y }, snap: s };
  }
  if ((s.kind === "mid" || s.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = ot(ae(e, l), n.pt).side >= 0 ? "left" : "right", c = yn(e, l.id, a, r.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...s, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function ku(t, e, n) {
  const i = [];
  for (const o of t.zones) {
    const s = de(t, o);
    if (s.length < 3) continue;
    (s.some((l, a) => Ie(e, l, s[(a + 1) % s.length]) <= n) || Ut(s, e)) && i.push({ id: o.id, area: Math.abs(Ee(s)) });
  }
  return i.sort((o, s) => o.area - s.area || (o.id < s.id ? -1 : o.id > s.id ? 1 : 0)), i.map((o) => o.id);
}
function Mu(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: de(t, n), v: n.shape.vertices } : null;
}
function Qg(t, e, n, i) {
  var r;
  const o = (r = Mu(t, e)) == null ? void 0 : r.o;
  if (!o) return null;
  let s = -1;
  return o.forEach((l, a) => {
    z(n, l) <= i && (s < 0 || z(n, l) < z(n, o[s])) && (s = a);
  }), s < 0 ? null : { index: s, from: o[(s + o.length - 1) % o.length] };
}
function Jg(t, e, n, i) {
  const o = Mu(t, e);
  if (!o || o.o.some((w) => z(n, w) <= i)) return null;
  const { o: s, v: r } = o;
  let l = -1, a = 1 / 0;
  if (s.forEach((w, b) => {
    const y = Ie(n, w, s[(b + 1) % s.length]);
    y <= i && y < a && (l = b, a = y);
  }), l < 0) return null;
  const c = s[l], h = s[(l + 1) % s.length], f = Math.max(0, Math.min(1, qi(n, c, h))), d = Ga(c, h, f), p = r[l], m = r[(l + 1) % r.length], $ = p.kind === "wall" && m.kind === "wall" && p.wallId === m.wallId && p.side === m.side ? { kind: "wall", wallId: p.wallId, side: p.side, offset: p.offset + f * (m.offset - p.offset), x: d.x, y: d.y } : { kind: "free", x: Math.round(d.x), y: Math.round(d.y) };
  return { index: l + 1, vertex: $ };
}
function e1(t, e) {
  let n = null, i = null, o = null, s = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, h = null, f = [];
  const d = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, p = () => {
    i = null, o = null, s = null, r = null, l = !1, a = !1;
  }, m = () => h && h.zoneId === d() ? h : null;
  function $(w) {
    if (!i || !o || !a && z(w.pt, c) <= co / t.scale()) return;
    a = !0;
    const b = xu(t, o, w, i.from, i.zoneId);
    r = b.snap, l = w.shift, s = Vf(o, i.zoneId, i.index, b.vertex);
  }
  return {
    note() {
      f = [f[f.length - 1] ?? null, t.selection()];
    },
    press(w) {
      p(), h = null, c = w.pt;
      const b = d(), y = t.level(), x = b === null ? null : Qg(y, b, w.pt, t.tolMm());
      return b === null || !x ? !1 : (i = { zoneId: b, ...x }, o = s = y, !0);
    },
    pick(w) {
      const b = ku(t.level(), w, t.tolMm());
      if (b.length === 0) {
        n = null, e(null);
        return;
      }
      const y = d(), x = y !== null && n !== null && z(w, n) <= t.tolMm() ? b.indexOf(y) : -1;
      n = w, e({ kind: "zone", id: b[(x + 1) % b.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(w) {
      $(w);
    },
    up(w) {
      if (!i) return;
      $(w);
      const b = s, y = o, x = a, M = i;
      p(), x ? b && y && b !== y && t.commit(b) : h = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const b = f[0];
      if ((b == null ? void 0 : b.kind) !== "zone") return;
      const y = t.level(), x = Jg(y, b.id, w.pt, t.tolMm());
      if (!x) return;
      const M = zf(y, b.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(b), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return p(), !0;
      const b = m();
      if (w === "Escape" && b)
        return h = null, !0;
      if ((w === "Delete" || w === "Backspace") && b) {
        const y = t.level(), x = Rf(y, b.zoneId, b.index);
        return x === y ? (t.notify(u("zones.minVertices")), !0) : (h = null, t.commit(x), !0);
      }
      return !1;
    },
    preview() {
      if (i && s) {
        const b = { level: s };
        return r && (b.snap = r), l && (b.orthoFrom = i.from), b;
      }
      const w = m();
      return w ? { zoneVertex: w } : {};
    },
    cancel() {
      p(), h = null, n = null;
    }
  };
}
function t1(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 }, r = null;
  const l = (p) => {
    t.select(p);
  }, a = () => {
    e = null, n = null, i = null, r = null, o = !1;
  }, c = e1(t, l), h = (p) => p.kind === "none" ? { x: Math.round(p.pt.x), y: Math.round(p.pt.y) } : p.pt, f = (p, m, $) => ot(ae(p, p.walls.find((w) => w.id === m)), $).t;
  function d(p) {
    const m = e;
    if (!(!m || !n) && !(p.pt.x === s.x && p.pt.y === s.y))
      if (o = !0, m.kind === "node") {
        const $ = mt(n, p.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: p.shift,
          excludeNodeIds: [m.nodeId]
        }), w = $.endpoint, b = ($.kind === "wall" || $.kind === "mid") && w.kind === "wall", y = $.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = n.nodes.find((C) => C.id === m.nodeId), M = !!x.host && b && w.kind === "wall" && w.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const C = structuredClone(n);
          delete C.nodes.find((L) => L.id === m.nodeId).host, k = C;
        }
        let _ = qf(k, m.nodeId, h($));
        if (y && w.kind === "node")
          _ = Xf(_, m.nodeId, w.nodeId);
        else if (b && w.kind === "wall" && !M) {
          const C = n.walls.find((L) => L.id === w.wallId);
          if (C && C.a !== m.nodeId && C.b !== m.nodeId) {
            const L = structuredClone(_);
            L.nodes.find((E) => E.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, _ = Fe(L, _);
          }
        }
        i = _;
      } else if (m.kind === "wall") {
        const $ = n.walls.find((y) => y.id === m.wallId), w = mt(n, p.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: p.shift,
          excludeNodeIds: [$.a, $.b]
        }), b = P(w.pt, m.origin);
        i = Gf(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(b.x), y: Math.round(b.y) } : b
        );
      } else {
        const $ = n.openings.find((w) => w.id === m.openingId);
        i = cc(n, $.id, f(n, $.wallId, p.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(p) {
      a(), s = p.pt, c.note();
      const m = t.level(), $ = p.ctrl ? or(m, p.pt, t.tolMm()) : null;
      if ($) {
        l(null), t.commit(qg(m, $, p.pt));
        return;
      }
      if (c.press(p)) return;
      const w = t.selection(), b = Xg(m, p.pt, t.tolMm(), w);
      if (!b) {
        c.pick(p.pt);
        return;
      }
      if (c.forget(), l(b), r = n = i = m, b.kind === "node") {
        let y = b.id;
        const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (p.alt && x) {
          const M = Kf(m, x.id, x.a === b.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: te(n, y) };
      } else if (b.kind === "wall")
        e = { kind: "wall", wallId: b.id, origin: p.pt };
      else if (b.kind === "opening") {
        const y = m.openings.find((x) => x.id === b.id);
        e = { kind: "opening", openingId: y.id, grab: f(m, y.wallId, p.pt) - y.offset };
      }
    },
    move(p) {
      c.active() ? c.move(p) : d(p);
    },
    up(p) {
      if (c.active()) {
        c.up(p);
        return;
      }
      e && d(p);
      const m = o, $ = i, w = r;
      a(), m && $ && w && $ !== w && t.commit($);
    },
    dblclick(p) {
      c.dblclick(p);
    },
    key(p) {
      return p === "Escape" && e ? (a(), !0) : c.key(p);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), c.cancel();
    }
  };
}
function Cn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const o = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(o)) return null;
  const s = Number(o);
  return Number.isSafeInteger(s) && s >= e && s <= n ? s : null;
}
function _u() {
  let t = "", e = "", n = "first";
  const i = () => {
    t = "", e = "", n = "first";
  }, o = () => t !== "" || e !== "";
  return {
    get first() {
      return t;
    },
    get second() {
      return e;
    },
    typing: o,
    clear: i,
    key(s, r, l) {
      return /^[0-9]$/.test(s) || s === " " ? (n === "first" ? t += s : e += s, !0) : s === "Backspace" ? (n === "first" ? t = t.slice(0, -1) : e = e.slice(0, -1), !0) : s === "Tab" ? (n = n === "first" ? "second" : "first", !0) : s === "Enter" ? (r(), !0) : s === "Escape" ? (o() ? i() : l(), !0) : !1;
    },
    tracker: (s) => ({ first: t, second: e, field: n, at: s })
  };
}
function n1(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = _u(), o = () => {
    e = null, i.clear();
  }, s = (c) => mt(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = Cn(i.first, { min: 1 }), h = Cn(i.second, { min: 1 });
      return c === null || h === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? h : -h) };
    }
    return s(n).pt;
  }
  const l = (c, h) => Math.abs(c.x - h.x) < 1 || Math.abs(c.y - h.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const h = jf(t.level(), e, c, t.wallProps(), t.boxMeasure());
    h !== t.level() && (t.commit(h), o());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !e) {
        e = s(c.pt).pt;
        return;
      }
      const h = r();
      h && a(h);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return e ? i.key(c, () => {
        const h = r();
        h && a(h);
      }, o) : !1;
    },
    preview() {
      if (!e) return { snap: s(n) };
      const c = r(), h = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : s(n)
      };
      if (!c || l(e, c)) return h;
      const f = t.wallProps(), d = Bc(e, c, f.thickness, t.boxMeasure());
      return d && (h.walls = d.map((p, m) => ({ a: p, b: d[(m + 1) % 4], props: { ...f, baseline: "center" } }))), h;
    },
    cancel() {
      o();
    }
  };
}
const Vl = (t) => Math.round(t * 1e3) / 1e3 + 0;
function i1(t) {
  let e = null, n = null, i = null, o = { x: 0, y: 0 }, s = !1, r = null;
  const l = _u(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (d, p) => mt(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: p && n !== null });
  function h() {
    if (!n) return null;
    const d = c(o, s), p = Cn(l.first, { min: 1 }), m = Cn(l.second);
    if (p === null && m === null) return { pt: d.pt, endpoint: d.endpoint, snap: d };
    const $ = p ?? z(n, d.pt);
    let w = d.pt;
    if (m === null && z(n, d.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const b = Zg(n, w, $), y = { x: Vl(b.x), y: Vl(b.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: d } : { pt: y, endpoint: { kind: "free", pt: y }, snap: d };
  }
  function f() {
    const d = h();
    if (!e || !d) return;
    const p = Wf(t.level(), e, d.endpoint, t.wallProps());
    if (p.wallId === null || p.endNodeId === null) return;
    t.commit(p.level);
    const m = p.level.walls.find((x) => x.id === p.wallId);
    i === null && (i = m.a);
    const $ = p.endNodeId === i, w = n, b = te(p.level, p.endNodeId), y = z(w, b);
    if (y > 0 && (r = { x: (b.x - w.x) / y, y: (b.y - w.y) / y }), l.clear(), $) {
      a();
      return;
    }
    e = { kind: "node", nodeId: p.endNodeId }, n = te(p.level, p.endNodeId);
  }
  return {
    id: "wall",
    down(d) {
      if (o = d.pt, s = d.shift, !e) {
        const p = c(d.pt, !1);
        e = p.endpoint, n = p.pt;
        return;
      }
      f();
    },
    move(d) {
      o = d.pt, s = d.shift;
    },
    up() {
    },
    key(d, p) {
      return s = p.shift, e ? l.key(d, f, a) : !1;
    },
    preview() {
      if (!n) return { snap: mt(t.level(), o, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const d = h();
      return {
        walls: [{ a: n, b: d.pt, props: t.wallProps() }],
        snap: d.snap,
        tracker: l.tracker(d.pt),
        orthoFrom: s ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      a();
    }
  };
}
function o1(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function o() {
    if (!n) return null;
    const s = t.level(), r = or(s, n, t.tolMm());
    if (!r) return null;
    const l = ae(s, s.walls.find((c) => c.id === r)), a = ot(l, n).t;
    return { wallId: r, center: a, pt: R(l.a, N(l.dir, a)) };
  }
  return {
    id: e,
    down(s) {
      n = s.pt;
      const r = o();
      if (!r) return;
      const l = i(), a = Xh(t.level(), r.wallId, e, r.center, l.width, l);
      a.openingId !== null && t.commit(a.level);
    },
    move(s) {
      n = s.pt;
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      const s = o();
      if (!s) return {};
      const { width: r } = i(), l = s.center - r / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: s.wallId, offset: l, width: r, kind: e, invalid: !Ki(t.level(), s.wallId, l, r) },
        snap: { pt: s.pt, kind: "wall", endpoint: { kind: "wall", wallId: s.wallId, offset: s.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const zl = 3, s1 = 1, _e = (t) => ({ x: t.x, y: t.y });
function r1(t) {
  let e = [], n = null, i = !1, o = null, s = !1;
  const r = () => e.length ? _e(e[e.length - 1]) : void 0;
  function l(f) {
    const d = e.length;
    if (d === 0) return !1;
    const p = e.map(_e);
    if (z(p[d - 1], f) <= s1) return !0;
    if (d >= 2) {
      const m = P(p[d - 1], p[d - 2]), $ = P(f, p[d - 1]);
      if (Math.abs(ue(m, $)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot($.x, $.y) && K(m, $) < 0) return !0;
    }
    for (let m = 0; m + 2 < d; m++) if (Lc(p[d - 1], f, p[m], p[m + 1])) return !0;
    return !1;
  }
  function a(f) {
    if (e.length < zl) return null;
    const d = t.tolMm(), p = _e(e[0]), m = _e(e[e.length - 1]);
    return z(f, p) <= d ? p : z(f, m) <= d ? m : null;
  }
  function c() {
    var p;
    if (e.length < zl || $i(e.map(_e))) return !1;
    const f = t.level(), d = Tf(f, e, t.zoneName());
    return d.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? d.level : js(d.level, d.zoneId, !1)), (p = t.zonePlaced) == null || p.call(t), t.select({ kind: "zone", id: d.zoneId }), !0);
  }
  const h = (f) => xu(t, t.level(), f, r());
  return {
    id: "zone",
    down(f) {
      if (a(f.pt)) {
        c();
        return;
      }
      const d = h(f).vertex;
      l(_e(d)) || (e = [...e, d], n = _e(d), i = !1);
    },
    move(f) {
      s = f.shift;
      const d = a(f.pt);
      if (d) {
        n = d, o = null, i = $i(e.map(_e));
        return;
      }
      const p = h(f);
      o = p.snap, n = _e(p.vertex), i = l(n);
    },
    up() {
    },
    key(f) {
      return f === "Enter" ? c() : f === "Backspace" || f === "Delete" || f === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : f === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const f = {};
      e.length > 0 && (f.zoneDraft = { points: e.map(_e), cursor: n, invalid: i }), o && (f.snap = o);
      const d = r();
      return s && d && (f.orthoFrom = d), f;
    },
    cancel() {
      e = [], n = null, i = !1, o = null, s = !1;
    }
  };
}
function l1(t) {
  return t.zoneMethod() === "polygon" ? r1(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = Pf(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(u("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : js(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Rl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Au(t) {
  let e = null;
  const n = (o, s, r) => {
    const l = o.devices.find((h) => h.id === s), a = l ? le(o, l) : null, c = l ? os(o, l, t.scale()) : null;
    return !a || !c ? 0 : kc(Ve(P(r, a.pt)) - Ve(P(c.to, a.pt)));
  };
  function i(o) {
    if (!e || !e.moved && z(o.pt, e.downPt) <= co / t.scale()) return;
    e.moved = !0;
    const s = e.original.devices.find((f) => f.id === e.id), r = s ? le(e.original, s) : null;
    if (!s || !r) return;
    const l = z(o.pt, r.pt), a = (Ve(P(o.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? o.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, h = yf(e.original, s, c, o.shift);
    e.work = JSON.stringify(h) === JSON.stringify(s.placement) ? e.original : bi(e.original, s.id, h);
  }
  return {
    start(o, s) {
      if (e = null, !o) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === o), a = l ? os(r, l, t.scale()) : null;
      return !l || !a || z(s.pt, a.to) > t.tolMm() ? !1 : (e = { id: o, original: r, work: r, downPt: s.pt, offset: n(r, o, s.pt), moved: !1 }, !0);
    },
    move: i,
    end(o) {
      if (!e) return !1;
      i(o);
      const s = e;
      return e = null, s.moved && s.work !== s.original && Rl(s.work, s.id) !== Rl(s.original, s.id) && t.commit(s.work), !0;
    },
    cancel() {
      const o = e !== null;
      return e = null, o;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function Bl(t, e, n) {
  const i = ae(t, t.walls.find((o) => o.id === e));
  return ot(i, n).side > 0 ? "left" : "right";
}
function Su(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function sr(t, e = "free") {
  return t === "equipment" ? [e] : Ds[t];
}
function Lu(t, e, n, i, o = 0, s = sr(n)) {
  if (s.includes("wall")) {
    const r = mt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: Bl(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const h = ae(e, c), f = ot(h, i).side, d = Math.abs(Math.abs(f) - (f > 0 ? h.leftOff : h.rightOff));
        (!a || d < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : h.len, d });
      }
      if (a) return { mode: "wall", wallId: a.id, side: Bl(e, a.id, i), offset: a.offset };
    }
  }
  return s.includes("free") ? { mode: "free", ...Su(t, i), rotation: o } : null;
}
function a1(t, e, n) {
  const i = le(t, e);
  if (!i) return null;
  if (!n) {
    const s = Hs(Math.round(Ve(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: s };
  }
  let o = null;
  for (const s of t.walls) {
    let r;
    try {
      r = ae(t, s);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = ot(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), h = yn(t, s.id, a, c), f = h ? z(h, i.pt) : 1 / 0;
    (!o || f < o.d) && (o = { placement: { mode: "wall", wallId: s.id, side: a, offset: c }, d: f });
  }
  return o && o.d < 1 / 0 ? Vs(t, e.props, o.placement, 0) : null;
}
function c1(t, e, n) {
  return bc(t.deviceDefaults(e), "free", n.mode);
}
function u1(t, e) {
  let n = null, i;
  const o = Au(t);
  function s() {
    if (!n) return null;
    const r = t.level(), l = sr(e, t.wallMount() ? "wall" : "free"), a = Lu(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...Su(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = c1(t, e, a), h = Vs(r, c, a, t.tolMm()), f = nl(r, c, h, "").deviceId !== null;
    return { placement: h, props: c, invalid: !f };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, o.start(i, r)) return;
      const l = s();
      if (!l || l.invalid) return;
      const a = t.level(), c = Ls(u(`device.${e}`), a.devices.filter((f) => f.props.kind === e).map((f) => f.name)), h = nl(a, l.props, l.placement, c);
      h.deviceId !== null && (t.commit(h.level), i = h.deviceId, t.select({ kind: "device", id: h.deviceId }));
    },
    move(r) {
      n = r.pt, o.active() && o.move(r);
    },
    up(r) {
      o.end(r);
    },
    key(r) {
      return r === "Escape" && o.cancel();
    },
    preview() {
      const r = o.working();
      if (o.active()) return r ? { level: r } : {};
      const l = s();
      return l ? { device: l } : {};
    },
    cancel() {
      o.cancel(), n = null, i = void 0;
    }
  };
}
const Fl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, d1 = (t, e, n) => n === void 0 || Fl(t, n) !== Fl(e, n);
function h1(t, e, n, i) {
  const o = e.placement;
  if (o.mode === "free" && n) return P(n, i);
  if (o.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const s = yn(t, o.wallId, o.side, o.offset);
  return s ? P(s, i) : { x: 0, y: 0 };
}
function f1(t) {
  let e = null, n = null;
  const i = Au(t);
  let o = null, s = null, r = !1, l = { x: 0, y: 0 };
  const a = (d) => {
    e = d, t.select(d);
  }, c = () => {
    n = null, o = null, s = null, r = !1;
  };
  function h(d) {
    if (!n || !o || !r && z(d.pt, l) <= co / t.scale()) return;
    if (r = !0, d.pt.x === l.x && d.pt.y === l.y) {
      s = o;
      return;
    }
    const p = o.devices.find((k) => k.id === n.id);
    if (!p || p.placement.mode === "none") return;
    const m = d.shift ? ir(l, d.pt) : d.pt, $ = p.placement, w = $.mode === "free" ? null : le(o, p), b = $.mode === "free" ? $.rotation : w ? Hs(Math.round(Ve(w.dir))) : 0, y = R(m, n.grab), x = Lu(t, o, p.props.kind, y, b, sr(p.props.kind, $.mode)), M = x && x.mode === "wall" && $.mode === "wall" && $.aim !== void 0 ? { ...x, aim: $.aim } : x;
    s = M ? bi(o, p.id, Vs(o, p.props, f(o, p.placement, M, m, y), t.tolMm())) : o;
  }
  function f(d, p, m, $, w) {
    if (p.mode !== "wall" || m.mode !== "wall" || m.wallId !== p.wallId) return m;
    const b = d.walls.find((C) => C.id === p.wallId);
    if (!b) return m;
    const y = ae(d, b), x = Math.max(0, Math.min(y.len, p.offset + K(P($, l), y.dir))), M = ot(y, w).side, k = t.tolMm(), _ = p.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: _ };
  }
  return {
    id: "device-select",
    down(d) {
      c(), l = d.pt;
      const p = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, d)) return;
      const $ = Ac(p, d.pt, m);
      if (!$) {
        a(null);
        return;
      }
      a({ kind: "device", id: $ });
      const w = p.devices.find((y) => y.id === $), b = le(p, w);
      o = s = p, n = { id: $, grab: h1(p, w, (b == null ? void 0 : b.pt) ?? null, d.pt) };
    },
    move(d) {
      i.active() ? i.move(d) : h(d);
    },
    up(d) {
      if (i.end(d)) return;
      n && h(d);
      const p = s, m = o, $ = r, w = n == null ? void 0 : n.id;
      c(), $ && p && m && p !== m && d1(m, p, w) && t.commit(p);
    },
    key(d) {
      return d === "Escape" && i.cancel() ? !0 : d === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const d = i.working();
      return d ? { level: d } : n && s ? { level: s } : {};
    },
    cancel() {
      i.cancel(), c(), a(null);
    }
  };
}
function p1(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = Ac(t.level(), e.pt, t.tolMm());
      t.select(n ? { kind: "device", id: n } : null);
    },
    move() {
    },
    up() {
    },
    key(e) {
      return e !== "Escape" ? !1 : (t.select(null), !0);
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const cs = 40, m1 = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function g1(t, e, n, i) {
  const o = t.blocks.find((p) => p.id === e);
  if ((o == null ? void 0 : o.kind) !== "bus") return t;
  const s = o.w >= o.h, r = s ? o.x : o.y, l = s ? o.w : o.h, a = _n(s ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - cs) : r, h = n === "end" ? Math.max(a, r + cs) : r + l;
  if (c === r && h === r + l) return t;
  const f = s ? { x: c, w: h - c } : { y: c, h: h - c }, d = (p) => "bus" in p && p.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + p.at * l - c) / (h - c))) } : p;
  return {
    ...t,
    blocks: t.blocks.map((p) => p.id === e ? { ...p, ...f } : p),
    wires: t.wires.map((p) => {
      const m = d(p.from), $ = d(p.to);
      return m === p.from && $ === p.to ? p : { ...p, from: m, to: $ };
    })
  };
}
function b1(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, o = !1;
  };
  function l(h, f) {
    const d = xl(h, f, t.tolMm(), t.geo());
    return (d == null ? void 0 : d.kind) === "port" ? { block: d.block, port: d.port } : (d == null ? void 0 : d.kind) === "bus" ? { bus: d.id, at: d.at } : (d == null ? void 0 : d.kind) === "bus-end" ? { bus: d.id, at: d.end === "start" ? 0 : 1 } : null;
  }
  function a(h) {
    const f = e, d = n;
    if (!f || !d || !o && z(h.pt, s) <= co / t.scale()) return;
    if (o = !0, f.kind === "wire") {
      const w = l(d, h.pt);
      e = { ...f, to: h.pt, ok: !!w && !("error" in wl(d, f.from, w, t.geo())) };
      return;
    }
    if (f.kind === "bus-end") {
      i = g1(d, f.id, f.end, h.pt);
      return;
    }
    const p = d.blocks.find((w) => w.id === (f.kind === "pin" ? f.from.block : f.id));
    if (!p) return;
    if (f.kind === "pin") {
      i = up(d, p.id, f.from.port, _p(De(p, t.geo(), d), h.pt));
      return;
    }
    const m = _n(p.x + h.pt.x - s.x), $ = _n(p.y + h.pt.y - s.y);
    i = m === p.x && $ === p.y ? d : lp(d, p.id, m, $);
  }
  function c(h, f, d) {
    const p = l(h, d);
    if (!p) return;
    const m = wl(h, f, p, t.geo());
    if ("error" in m) {
      t.notify(u(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(h) {
      r(), s = h.pt;
      const f = t.power(), d = xl(f, h.pt, t.tolMm(), t.geo());
      if (!d) {
        t.select(null);
        return;
      }
      if (d.kind === "chip") {
        t.setPosition(d.block, d.position);
        return;
      }
      if (d.kind === "wire") {
        t.select({ kind: "powerWire", id: d.id });
        return;
      }
      if (n = i = f, d.kind === "port") {
        const p = { block: d.block, port: d.port };
        if (m1(f, p)) {
          e = { kind: "pin", from: p };
          return;
        }
        const m = f.blocks.find((w) => w.id === d.block), $ = so(f, m, t.geo()).find((w) => w.name === d.port).pt;
        e = { kind: "wire", from: p, at: $, to: $, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: d.id }), e = d.kind === "bus-end" ? { kind: "bus-end", id: d.id, end: d.end } : { kind: "move", id: d.id };
    },
    move(h) {
      a(h);
    },
    up(h) {
      a(h);
      const f = e, d = n, p = i, m = o;
      if (r(), !(!f || !d)) {
        if (!m) {
          (f.kind === "wire" || f.kind === "pin") && t.select({ kind: "powerBlock", id: f.from.block });
          return;
        }
        f.kind === "wire" ? c(d, f.from, h.pt) : p && p !== d && t.commitPower(p);
      }
    },
    key(h) {
      return h === "Escape" && e ? (r(), !0) : !1;
    },
    preview() {
      const h = e;
      return h ? h.kind === "wire" ? { wireDraft: { from: h.at, to: h.to, ok: h.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function w1(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let o;
      if (n === "device") {
        const h = t.placeDeviceId();
        if (!h) {
          t.notify(u("power.pickDevice"));
          return;
        }
        o = h;
      }
      const s = t.power(), r = rp(n, { x: 0, y: 0 }, s, o), l = De(r, t.geo(), gl(s, r)), a = { ...r, x: _n(i.pt.x - l.w / 2), y: _n(i.pt.y - l.h / 2) };
      t.commitPower(gl(s, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function v1(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = ku(t.level(), e.pt, t.tolMm())[0];
      t.select(n ? { kind: "zone", id: n } : null);
    },
    move() {
    },
    up() {
    },
    key(e) {
      return e !== "Escape" ? !1 : (t.select(null), !0);
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const $1 = ["select", "box", "wall", "door", "window", "opening", "zone"], y1 = [
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
], x1 = ["binding-select"], k1 = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], M1 = ["zone-pick"], Cu = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, _1 = {
  plan: $1,
  equipment: y1,
  binding: x1,
  power: k1,
  automation: M1
};
function rr(t) {
  return _1[t];
}
function us(t, e) {
  switch (t) {
    case "select":
      return t1(e);
    case "box":
      return n1(e);
    case "wall":
      return i1(e);
    case "door":
    case "window":
    case "opening":
      return o1(e, t);
    case "zone":
      return l1(e);
    case "device-select":
      return f1(e);
    case "binding-select":
      return p1(e);
    case "power-select":
      return b1(e);
    case "zone-pick":
      return v1(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return w1(e, t);
    default:
      return u1(e, t);
  }
}
function Eo(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((o) => o.id === e.id) : e.kind === "powerWire" ? n.wires.some((o) => o.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((o) => o.id === e.id);
}
const A1 = {
  select: Zt,
  box: fm,
  wall: pm,
  door: Zp,
  window: wm,
  opening: Gp,
  zone: lm,
  "device-select": Zt,
  ceiling_light: Up,
  wall_light: mm,
  motion_sensor: du,
  illuminance_sensor: Fp,
  climate_sensor: am,
  wall_switch: uu,
  smart_button: Qp,
  valve: dm,
  leak_sensor: pu,
  socket: hu,
  exhaust_fan: cu,
  equipment: kl,
  "binding-select": Zt,
  "zone-pick": Zt,
  "power-select": Zt,
  "power-device": kl,
  "power-bus": om,
  "power-battery": Bp,
  "power-pv": fu,
  "power-transfer": rm,
  "power-remainder": Wp
}, Iu = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${A1[t]}></path>`}</svg>`;
function S1(t) {
  switch (t.saveState) {
    case "saving":
      return u("save.saving");
    case "conflict":
      return u("save.conflict");
    case "error":
      return u("save.error");
    default:
      return t.dirty ? u("save.dirty") : u(t.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function L1(t) {
  return g`
    <div class="top"><div class="bar">
      ${t.lead ?? v}
      ${t.plans.length > 1 ? g`
        <select class="plan-pick" aria-label=${u("plan.pick")} title=${u("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${X(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => g`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : v}
      <button class="btn" data-action="new-plan" title=${u("plan.new")} aria-label=${u("plan.new")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${u("plan.delete")} aria-label=${u("plan.delete")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${u("action.undo")} aria-label=${u("action.undo")} ?disabled=${!t.canUndo}
        @click=${t.onUndo}>↶</button>
      <button class="btn" title=${u("action.redo")} aria-label=${u("action.redo")} ?disabled=${!t.canRedo}
        @click=${t.onRedo}>↷</button>
      <span class="save-state ${t.saveState}" title=${t.saveState === "error" ? t.errorMessage ?? "" : ""}>
        ${S1(t)}${t.saveState === "error" && t.errorMessage ? g`: ${t.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${u("action.save")}</button>
    </div>${t.steps}</div>`;
}
const C1 = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Eu(t, e, n) {
  return rr(t).map((i) => {
    const o = t === "plan" ? Cu[i] : void 0, s = u(`tool.${i}`);
    return g`
      ${C1.includes(i) ? g`<div class="tool-sep"></div>` : v}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${o ?? v}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${o ?? v}
        title=${o ? `${s} (${o})` : s} @click=${() => n(i)}>
        ${Iu(i)}<span class="tlabel">${s}</span></button>`;
  });
}
function I1(t, e, n) {
  return g`<div class="tools">${Eu(t, e, n)}</div>`;
}
const jn = ["plan", "equipment", "binding", "power", "automation"], Gt = (t, e, n) => u(t === 1 ? e : n).replace("{n}", String(t));
function E1(t, e, n, i, o = 0) {
  const { walls: s, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((h) => h.invalid).length, c = a ? `, ${u("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Gt(s.length, "steps.wall", "steps.walls")}, ${Gt(r.length, "steps.zone", "steps.zones")}${c}`,
        done: s.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: Gt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Is(l.map(n));
      return {
        text: u("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: Gt(i.blocks.length, "steps.block", "steps.blocks"), done: bp(i) };
    case "automation":
      return { text: Gt(o, "steps.rule", "steps.rules"), done: o > 0 };
  }
}
const Ul = (t, e) => u(t).replace("{step}", u(`mode.${e}`));
function D1(t) {
  const e = jn.indexOf(t.mode), n = jn[e - 1], i = jn[e + 1];
  return g`
    <nav class="steps" aria-label=${u("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${X(t.planName)} aria-label=${u("plan.name")} title=${u("plan.name")}
          @change=${(o) => t.onRename(o.target.value)} />
        <span class="app">${u("steps.app")}</span>
      </div>
      ${jn.map((o, s) => {
    const r = E1(o, t.level, t.status, t.power, t.rules), l = o === t.mode;
    return g`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${o}
          aria-current=${l ? "step" : v} @click=${() => t.onMode(o)}>
          <span class="n">${s + 1}</span><span class="name">${u(`mode.${o}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Ul("steps.back", n)}</button>` : v}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Ul("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
function O1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Du(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return fc(t, Ls(u("device.equipment"), e));
}
function lr(t) {
  if (Bt(t)) return u("props.inverter");
  const e = tf(t);
  return e ? u(`deviceRole.${e}`) : "";
}
function uo(t) {
  const e = u(`device.${t.props.kind}`), n = lr(t);
  return n ? `${e} · ${n}` : e;
}
function N1(t) {
  const e = O1(t.level);
  return g`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${u("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${u("devices.new")}</button>
    </div>
    ${e.length === 0 ? v : g`<div class="pdevs">
      ${e.map((n) => g`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${lr(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const P1 = ["unbound", "bound", "all"], T1 = /* @__PURE__ */ new WeakMap(), rn = (t) => t.placement.mode === "none";
function Ou(t) {
  return Ce(T1, t, (e) => [...e.devices].sort((n, i) => Number(rn(n)) - Number(rn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function H1(t, e, n) {
  const i = Ou(t), o = e === null ? -1 : i.findIndex((s) => s.id === e);
  for (let s = 1; s <= i.length; s++) {
    const r = i[(o + s) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Nu = (t) => u(`device.${t.props.kind}`), Wl = (t) => t.props.kind === "equipment" ? lr(t) : Nu(t), V1 = (t, e) => t === "all" || t === "bound" == (e === "bound");
function z1(t, e, n) {
  return e === 0 ? u("binding.noDevices") : n || t.filter === "all" ? u("binding.noMatch") : u(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function jl(t) {
  const e = u(t.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function R1(t) {
  var l;
  if (t.collapsed) return g`<div class="blist collapsed">${jl(t)}</div>`;
  const e = Ou(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Is(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), o = e.filter(({ d: a, st: c }) => V1(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || Nu(a).toLowerCase().includes(i) || Wl(a).toLowerCase().includes(i))), s = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const h = oh(a);
    return g`<button class="brow${a.id === s ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${u(`bindstatus.${c}`)} title=${u(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Wl(a)}</small></span>
      <span class="cnt">${h.filled}/${h.total}</span>
    </button>`;
  };
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${u("binding.show")}>
          ${P1.map((a) => g`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${u(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${jl(t)}
      </div>
      <input class="list-search" type="search" placeholder=${u("binding.search")} aria-label=${u("binding.search")}
        .value=${X(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${o.length === 0 ? g`<p class="empty">${z1(t, e.length, i)}</p>` : g`
          ${o.filter((a) => !rn(a.d)).map((a) => r(a.d, a.st))}
          ${o.some((a) => rn(a.d)) ? g`<div class="bgroup" data-group="unplaced">
            <h5>${u("devices.unplaced")}</h5>
            ${o.filter((a) => rn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : v}`}
      </div>
    </div>`;
}
function V(t, e) {
  return g`<label class="row"><span>${t}</span>${e}</label>`;
}
function oe(t, e, n, i) {
  return g`<select class="val" data-field=${i ?? v} .value=${X(t)} @change=${(o) => {
    const s = o.target;
    n(s.value) === !1 && (s.value = t);
  }}>
    ${e.map((o) => g`<option value=${o.v} ?selected=${o.v === t}>${o.label}</option>`)}
  </select>`;
}
function Ue(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var o;
    return (o = t.setNotice) == null ? void 0 : o.call(t, i);
  };
  return g`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? v}
    placeholder=${t.placeholder ?? v} title=${t.placeholder ?? v} .value=${X(e)}
    @change=${(i) => {
    const o = i.target;
    if (t.onBlank && o.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const s = Cn(o.value, t.rule);
    if (s === null) {
      o.value = e, n(u(t.bad));
      return;
    }
    if (t.skipSame && s === t.value) {
      n(null);
      return;
    }
    if (t.apply(s) === !1) {
      o.value = e, n(u("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function B1() {
  return {
    door: { width: ni.door, hinge: "start", swing: "left" },
    window: { width: ni.window, outside: "left" },
    opening: { width: ni.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function F1(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Pu(t) {
  return Ls(u("zones.default"), t.zones.map((e) => e.name));
}
const U1 = (t) => t === "door" || t === "window" || t === "opening";
function W1(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return v;
  const n = t.tool, i = e[n].width, o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return g`
    <h4>${u(`props.next.${n}`)}</h4>
    ${V(`${u("props.width")}, ${u("unit.mm")}`, Ue({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      s({ width: r });
    }
  }))}
    ${n === "door" ? g`
      ${V(u("props.hinge"), oe(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && s({ hinge: r });
    },
    "next-hinge"
  ))}
      ${V(u("props.swing"), oe(e.door.swing, o, (r) => {
    r !== e.door.swing && s({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? V(u("props.outside"), oe(
    e.window.outside,
    o,
    (r) => {
      r !== e.window.outside && s({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class j1 {
  constructor(e, n = 200) {
    this.cap = n, this.past = [], this.future = [], this.present = e;
  }
  get current() {
    return this.present;
  }
  push(e) {
    for (this.past.push(this.present); this.past.length > Math.max(0, this.cap - 1); ) this.past.shift();
    this.present = e, this.future = [];
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
const ds = (t) => typeof t == "object" && t !== null && !Array.isArray(t), ln = (t) => typeof t == "string" && t ? t : null, ql = (t) => typeof t == "number" && Number.isFinite(t), hs = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Tu(t) {
  return t.switchesMigrated || !t.devices.some(hs) ? t : { ...t, switchesMigrated: !0 };
}
function q1(t, e, n) {
  const i = fc(t, n);
  let o = i.level;
  const s = ds(e.switch) ? e.switch : {}, r = [["power", ln(e.power)], ["voltage", ln(e.voltage)], ["control", ln(s.entity)]];
  for (const [l, a] of r) a && (o = Fi(o, i.id, l, a));
  return s.controllable === !0 && (o = Xi(o, i.id, !0)), { level: o, id: i.id };
}
function Z1(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (ds(i) && Array.isArray(i.blocks)) {
    let o = 0, s = !1;
    const r = i.blocks.map((l) => {
      if (!ds(l)) return l;
      if (l.kind === "meter" && ln(l.id) && ql(l.x) && ql(l.y)) {
        o++;
        const a = q1(e, l, ln(l.name) ?? `Meter ${o}`);
        return e = a.level, s = !0, {
          id: l.id,
          kind: "device",
          deviceId: a.id,
          x: l.x,
          y: l.y,
          ..."portPins" in l ? { portPins: l.portPins } : {}
          // the name went to the device
        };
      }
      if (l.kind === "device" && "inverter" in l) {
        const { inverter: a, ...c } = l;
        return a === !0 && typeof l.deviceId == "string" && (e = gc(e, l.deviceId, !0)), s = !0, c;
      }
      return l;
    });
    s && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(hs)) {
    for (const o of t.level.devices) hs(o) && (e = Xi(e, o.id, !0));
    e = Tu(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
const Ai = 3600;
function Pe(t) {
  return { id: ie(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const G1 = (t, e) => [...t, e], K1 = (t, e) => t.map((n) => n.id === e.id ? e : n), X1 = (t, e) => t.filter((n) => n.id !== e);
function Y1(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const Q1 = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, ar = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).filter((n) => typeof n == "object" && n !== null && !et(n));
}, Si = (t) => [...t.inputs, ...ar(t), ...t.gate ? [t.gate] : []].flatMap(Q1), Hu = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, J1 = (t, e) => t.filter((n) => n.id !== e && Si(n).includes(e));
function eb(t, e) {
  const n = new Map(t.map((s) => [s.id, s]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), o = (s, r) => {
    if (s === e.id && r.length > 0) return r;
    if (r.includes(s) || i.has(s)) return null;
    const l = n.get(s);
    if (!l) return null;
    for (const a of Si(l)) {
      const c = o(a, [...r, s]);
      if (c) return c;
    }
    return i.add(s), null;
  };
  for (const s of Si(e)) {
    const r = o(s, [e.id]);
    if (r) return r;
  }
  return null;
}
const Li = /^([01]\d|2[0-3]):[0-5]\d$/, gt = (t) => typeof t == "number" && Number.isFinite(t);
function tb(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return gt(e.below) && e.below > 0 && gt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && Li.test(n) && Li.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const Zl = (t) => Number.isInteger(t) && t >= 0 && t <= Ai;
function nb(t, e, n, i, o, s, r, l, a, c, h, f, d, p, m, $, w, b, y, x, M, k) {
  var B;
  const _ = [];
  e.name.trim() || _.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && !e.motionLight && _.push("inputs");
  const C = e.control, L = (Array.isArray(C == null ? void 0 : C.sources) ? C.sources : []).filter((D) => typeof D == "object" && D !== null && et(D)).map((D) => D.button), E = C ? [C.on, C.off, C.toggle].flatMap((D) => Array.isArray(D) ? D : []) : [], H = [...e.inputs, ...ar(e), ...e.gate ? [e.gate] : []], I = [...H.flatMap(Hu), ...e.onTrue.map((D) => D.device), ...e.onFalse.map((D) => D.device)], O = H.flatMap((D) => "light" in D.source ? [D.source.light] : "daylight" in D.source ? [D.source.daylight] : []);
  (I.some((D) => !n(D)) || O.some((D) => !(o ?? n)(D)) || e.vent && [e.vent.sensor, e.vent.than].some((D) => !(s ?? n)(D)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((D) => !(h ?? n)(D)) || e.leak.valves.some((D) => !(f ?? n)(D))) || e.timed && (!(d ?? n)(e.timed.button) || !(p ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(o ?? n)(e.outside.sensor)) || e.beurer && (!($ ?? n)(e.beurer.heater) || !(w ?? n)(e.beurer.source)) || e.motionLight && (!(x ?? n)(e.motionLight.light) || e.motionLight.sensors.some((D) => !(M ?? n)(D)) || e.motionLight.buttons.some((D) => !(k ?? n)(D)) || e.motionLight.daylight && !(o ?? n)(e.motionLight.daylight.sensor)) || L.some((D) => !(b ?? n)(D)) || E.some((D) => !(y ?? n)(D.device))) && _.push("device-missing");
  const T = new Set(t.map((D) => D.id));
  Si(e).some((D) => D !== e.id && !T.has(D)) && _.push("rule-missing"), eb(t, e) && _.push("cycle"), (!Zl(e.onDelay) || !Zl(e.offDelay)) && _.push("delay");
  for (const D of H) {
    const U = tb(D);
    U && !_.includes(U) && _.push(U);
  }
  return e.vent && ib(e, e.vent) && _.push("vent"), e.boiler && Ab(e, e.boiler) && _.push("boiler"), e.leak && ob(e, e.leak) && _.push("leak"), e.timed && ab(e, e.timed) && _.push("timed"), e.outside && db(e, e.outside) && _.push("outside"), e.beurer && hb(e, e.beurer) && _.push("beurer"), e.control && mb(e, e.control) && _.push("control"), e.motionLight && xb(e, e.motionLight) && _.push("motionLight"), (B = e.boiler) != null && B.button && c && !_.includes("device-missing") && !c(e.boiler.button) && _.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((D) => {
    const U = i(D.device);
    return U !== void 0 && !U.includes(D.do);
  }) && _.push("action"), C && E.some((D) => !fb.includes(D.do) || i && !pb(D.do, i(D.device))) && _.push("action"), _;
}
function ib(t, e) {
  if (t.inputs.length > 0 || t.motionLight || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !gt(e.above) || !gt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function ob(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((o) => typeof o == "string" && o !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const sb = (t) => t.leak !== void 0;
function rb(t, e, n) {
  const i = Pe(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const o = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), s = o ? Be(o, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: s.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: s.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const lb = 15;
function ab(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const cb = (t) => t.timed !== void 0, ub = 30;
function db(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && Li.test(n) && Li.test(i) && n !== i);
}
const qn = { above: 200, offDelay: 60, keep: 10, every: 30 };
function hb(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !gt(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
const fb = ["on", "off", "toggle", "close"];
function an(t) {
  const e = ee(t);
  return e.includes("on") && e.includes("off") ? ["on", "off", "toggle"] : e.includes("close") ? ["close"] : [];
}
const pb = (t, e) => e === void 0 || (t === "close" ? e.includes("close") : e.includes("on") && e.includes("off"));
function Vu(t, e) {
  const n = (i, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).sort(([s], [r]) => s < r ? -1 : 1)) : o;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function mb(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.motionLight || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = [e.on, e.off, e.toggle];
  if (!Array.isArray(e.sources) || e.sources.length === 0 || !n.every(Array.isArray) || n.every((r) => r.length === 0)) return !0;
  const i = (r) => typeof r == "object" && r !== null && (et(r) ? typeof r.button == "string" && r.button !== "" : typeof r.source == "object" && r.source !== null);
  if (!e.sources.every(i) || e.sources.some((r, l) => e.sources.some((a, c) => c < l && Vu(r, a)))) return !0;
  const o = (r) => r.every((l) => typeof l == "object" && l !== null && typeof l.device == "string" && l.device !== "") && new Set(r.map((l) => l.device)).size === r.length;
  if (!n.every(o)) return !0;
  const s = new Set(ar(t).flatMap(Hu));
  return n.some((r) => r.some((l) => s.has(l.device)));
}
const Gl = (t) => t.control !== void 0;
function gb(t, e, n) {
  var d, p;
  const i = Pe(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const o = e === null ? void 0 : t.levels.find((m) => m.zones.some(($) => $.id === e)), s = o ? Be(o, e).filter((m) => m.participates).map((m) => m.device) : [], r = s.filter((m) => m.props.kind === "wall_switch" || m.props.kind === "smart_button"), l = s.filter((m) => {
    const $ = ee(m);
    return $.includes("on") && $.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, c = l.length === 1 ? l[0] : void 0, h = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((d = a.bindings) != null && d.state) && a.bindings.state === ((p = c == null ? void 0 : c.bindings) == null ? void 0 : p.control), f = (m) => c && !h ? [{ device: c.id, do: m }] : [];
  return i.control = { sources: a ? [a.props.kind === "smart_button" ? { button: a.id } : { source: { device: a.id } }] : [], on: f("on"), off: f("off"), toggle: f("toggle") }, i;
}
function bb(t, e) {
  const n = t.control;
  if (!n || "on" in n || !Array.isArray(n.sources) || !Array.isArray(n.loads) || ![...n.sources, ...n.loads].every((r) => typeof r == "string")) return t;
  const i = n.loads, o = (r) => i.map((l) => ({ device: l, do: r })), s = n.sources.map((r) => e(r) === "smart_button" ? { button: r } : { source: { device: r } });
  return { ...t, control: { sources: s, on: o("on"), off: o("off"), toggle: o("toggle") } };
}
const wb = (t) => t.beurer !== void 0;
function vb(t, e) {
  const n = Pe(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = qn.offDelay, n.beurer = { heater: "", source: "", above: qn.above, keep: qn.keep, every: qn.every }, n;
}
const $b = (t) => t.outside !== void 0;
function yb(t, e, n) {
  const i = Pe(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), r = (o ? Be(o, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && ee(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: ub }, i;
}
const Zn = { offDelay: 180, minOn: 0, autoAfter: 0, is: "dark" };
function xb(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.every((o) => typeof o == "string" && o !== "") && new Set(i).size === i.length;
  return typeof e.light != "string" || e.light === "" || !n(e.sensors) || !n(e.buttons) || e.sensors.includes(e.light) || e.buttons.includes(e.light) || e.daylight !== void 0 && (typeof e.daylight != "object" || e.daylight === null || typeof e.daylight.sensor != "string" || e.daylight.sensor === "" || e.daylight.is !== "night" && e.daylight.is !== "dark") ? !0 : !Number.isInteger(e.minOn) || e.minOn < 0 || e.minOn > 3600 || !Number.isInteger(e.autoAfter) || e.autoAfter < 0 || e.autoAfter > 1440;
}
const kb = (t) => t.motionLight !== void 0;
function Mb(t, e, n) {
  const i = Pe(e);
  i.name = e !== null && n ? `Light motion control ${n}` : "Light motion control", i.offDelay = Zn.offDelay;
  const o = e === null ? void 0 : t.levels.find((c) => c.zones.some((h) => h.id === e)), s = o ? Be(o, e).filter((c) => c.participates).map((c) => c.device) : [], r = s.filter((c) => (c.props.kind === "ceiling_light" || c.props.kind === "wall_light") && ee(c).includes("on") && ee(c).includes("off")), l = t.levels.flatMap((c) => c.devices).filter((c) => c.props.kind === "illuminance_sensor"), a = r.length === 1 ? r[0] : void 0;
  return i.motionLight = {
    light: a ? a.id : "",
    sensors: s.filter((c) => c.props.kind === "motion_sensor").map((c) => c.id),
    ...l.length === 1 ? { daylight: { sensor: l[0].id, is: Zn.is } } : {},
    minOn: Zn.minOn,
    buttons: s.filter((c) => c.props.kind === "smart_button").map((c) => c.id),
    autoAfter: Zn.autoAfter
  }, i;
}
function _b(t, e, n) {
  const i = Pe(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Be(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = s.filter((a) => {
    const c = ee(a);
    return c.includes("on") && c.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: lb }, i;
}
function Ab(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !gt(n.limit) || !gt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const Sb = (t) => t.boiler !== void 0, fs = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function zu(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Ru = 3e3, Bu = 1400;
function Lb(t, e, n) {
  var c;
  const i = Pe(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const o = e === null ? void 0 : t.levels.find((h) => h.zones.some((f) => f.id === e)), s = o ? Be(o, e).filter((h) => h.participates).map((h) => h.device) : [], r = s.filter(fs), l = s.filter((h) => h.props.kind === "wall_switch" || h.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((c = t.power) == null ? void 0 : c.blocks) ?? []).filter((h) => h.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Ru, nominal: Bu }), i;
}
const Cb = (t) => t.vent !== void 0, Ib = 600;
function Eb(t, e, n) {
  var l;
  const i = Pe(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = Ib;
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Be(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = s.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const Db = 1800;
function Ob(t, e, n, i) {
  const o = Pe(e);
  return o.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", o.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Db } } }], o;
}
const Nb = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), Do = (t) => Nb.has(t.props.kind);
function ee(t) {
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
const ri = (t, e) => Vu(t, e);
class Pb {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await Ao(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(Rr(u("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = Le(e);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /**
   * Loads a stored plan from the server and makes it the open one. A plan of another schema version (an older server
   * still running after an update) is refused before anything changes: the panel reads and saves v2 plans only.
   */
  async openPlan(e) {
    const n = await Np(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(u("load.oldServer"));
    this.h.drafts.cancel(), this.h.save.reset(n.revision), this.savedRules = n.rules ?? [], this.adopt(n), this.h.drafts.setLastPlanId(n.id), this.offerDraft(this.h.drafts.read(n.id));
  }
  /** Closes the open dialog when it is of the given kind. */
  closeDialog(e) {
    var n;
    ((n = this.h.dialog) == null ? void 0 : n.kind) === e && (this.h.dialog = null);
  }
  /**
   * Offers a stored draft for restoring. A draft saved by an older version (schemaVersion other than 2) is dropped
   * with a notice instead: the panel reads v2 plans only (the server converts stored plans, not browser drafts).
   */
  offerDraft(e) {
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = u("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Ao(this.h.hass);
      } catch {
      }
  }
  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions() {
    const e = this.h.plan, n = this.h.plans.map((i) => ({ id: i.id, name: i.id === e.id ? e.name : i.name }));
    return n.some((i) => i.id === e.id) || n.push({ id: e.id, name: e.name }), n;
  }
  pickPlan(e) {
    if (!(!this.h.plan || e === this.h.plan.id || this.h.save.state === "saving")) {
      if (this.h.save.dirty) {
        this.h.dialog = { kind: "switch", to: e };
        return;
      }
      this.switchPlan(e);
    }
  }
  async switchPlan(e) {
    try {
      await this.openPlan(e);
    } catch (n) {
      this.h.notice = Le(n);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    var n;
    const e = ((n = this.h.dialog) == null ? void 0 : n.kind) === "switch" ? this.h.dialog.to : null;
    this.closeDialog("switch"), !(!e || !this.h.plan) && (this.h.drafts.cancel(), this.draftBlocked() || this.h.drafts.clear(this.h.plan.id), this.switchPlan(e));
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
    this.h.toolId = rr(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(Rr(u("plan.default"))), this.offerDraft(null);
  }
  requestDelete() {
    !this.h.plan || this.busy() || (this.h.dialog = { kind: "delete" });
  }
  async confirmDelete() {
    var n;
    this.closeDialog("delete");
    const e = this.h.plan;
    if (!(!e || !this.h.hass || this.busy())) {
      this.h.deleting = !0;
      try {
        if (this.h.save.baseRevision !== null)
          try {
            await Tp(this.h.hass, e.id);
          } catch (s) {
            this.h.save.state = "error", this.h.save.errorMessage = Le(s);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ao(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const o = i.find((s) => s.id !== e.id);
        if (o)
          try {
            await this.openPlan(o.id);
            return;
          } catch (s) {
            this.h.notice = Le(s);
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
  adopt(e) {
    var l;
    this.h.plan = { ...e, levels: e.levels.map(bh) };
    const n = Z1({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = gp(n.power, { device: (a) => n.level.devices.find((c) => c.id === a) }), o = new Map(this.h.plan.levels.flatMap((a) => a.devices.map((c) => [c.id, c.props.kind]))), s = (l = e.rules) == null ? void 0 : l.map((a) => bb(a, (c) => o.get(c))), r = e.rules && s && e.rules.length > 0 ? s.some((a, c) => a !== e.rules[c]) ? s : e.rules : void 0;
    this.h.history = new j1({ level: n.level, ...i ? { power: i } : {}, ...r ? { rules: r } : {} }), this.h.lazyPower = Zc(), this.h.activeTool.cancel(), this.h.activeTool = us(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
  }
  makeDraft() {
    return { planId: this.h.plan.id, baseRevision: this.h.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }
  /** True while an undecided draft of the open plan must not be overwritten. */
  draftBlocked() {
    return !!this.h.pendingDraft && !!this.h.plan && this.h.pendingDraft.planId === this.h.plan.id;
  }
  restoreDraft(e) {
    this.h.pendingDraft = null, this.closeDialog("restore"), this.adopt(e.plan), this.h.save.baseRevision = e.baseRevision, this.h.save.markDirty();
  }
  discardDraft(e) {
    this.h.pendingDraft = null, this.closeDialog("restore"), this.h.drafts.clear(e.planId), this.h.save.dirty && this.h.plan && this.h.drafts.schedule(() => this.makeDraft());
  }
  /** After a successful save: drop drafts of the given ids unless edits made meanwhile keep the plan dirty. */
  afterSaved(...e) {
    var n;
    if (this.h.save.state === "saved") {
      this.h.drafts.setLastPlanId(this.h.plan.id), this.refreshPlans(), this.h.drafts.cancel();
      for (const i of e) ((n = this.h.pendingDraft) == null ? void 0 : n.planId) !== i && this.h.drafts.clear(i);
      this.h.save.dirty && !this.draftBlocked() && this.h.drafts.schedule(() => this.makeDraft());
    }
  }
  /** The open plan as it is saved or drafted; an equipment switch on the edited level marks it (markSwitchesMigrated). */
  currentPlan() {
    const e = this.h.plan, { level: n, power: i, rules: o } = this.h.history.current, s = e.levels.map((c, h) => h === 0 ? Tu(n) : c), { power: r, rules: l, ...a } = e;
    return { ...a, levels: s, ...i ? { power: i } : {}, ...o ? { rules: o } : {}, revision: this.h.save.baseRevision ?? 0 };
  }
  /** After a save: the rules of the plan that was sent are the saved ones when it succeeded. */
  keepSaved(e) {
    this.h.save.state === "saved" && (this.savedRules = e.rules ?? []);
  }
  async doSave() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const e = this.currentPlan();
    await this.h.save.save(e), this.keepSaved(e), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = { kind: "conflict" });
  }
  async doOverwrite() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const e = this.currentPlan();
    await this.h.save.overwrite(e), this.keepSaved(e), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? { kind: "conflict-again" } : null;
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const e = `${this.h.plan.name} ${u("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), o = await this.h.save.saveAsNew(i, e);
    o && this.keepSaved(i), o ? (this.h.plan = o, this.h.dialog = null, this.afterSaved(n, o.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Tb {
  constructor(e) {
    this.h = e, this.error = null, this.regs = null, this.tried = !1, this.pending = !1, this.base = null, this.merged = null;
  }
  /** A registry load is in progress. */
  get loading() {
    return this.pending;
  }
  get() {
    var r;
    const e = (r = this.h.hass) == null ? void 0 : r.states, n = this.base;
    !n || !ep(n.states, e) ? this.base = { states: e, meta: Jf(e) } : n.states = e;
    const i = this.base.meta, o = this.merged;
    if (o && o.base === i && o.regs === this.regs) return o.meta;
    const s = this.regs ? np(i, this.regs) : i;
    return this.merged = { base: i, regs: this.regs, meta: s }, s;
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
    const e = this.h.hass;
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), tp(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = u("binding.registryError").replace("{error}", Le(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Gn = Wa("", "");
function Hb(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? Gn;
    },
    commit: (e) => t.commit(e),
    power: () => t.power,
    commitPower: (e) => t.commitPower(e),
    scale: () => t.view.scale,
    tolMm: () => 10 / t.view.scale,
    grid: () => t.grid ? 100 : null,
    wallProps: () => ({ type: t.wallType, thickness: t.thickness, baseline: "center" }),
    boxMeasure: () => t.boxMeasure,
    // A field message belongs to the selected element; a session error (Binding) outlives the selection.
    select: (e) => {
      t.selection = e, t.fieldNotice = null, t.mode !== "binding" && (t.notice = null);
    },
    selection: () => t.selection,
    deviceDefaults: (e) => t.nextProps[e],
    wallMount: () => t.nextObj.wallMount,
    openingDefaults: (e) => F1(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Pu(((e = t.history) == null ? void 0 : e.current.level) ?? Gn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? Gn).devices;
      return { device: (i) => e.find((o) => o.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : eu(((n = t.history) == null ? void 0 : n.current.level) ?? Gn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
    },
    devicePlaced: () => {
      t.placeDeviceId = null;
    },
    setPosition: (e, n) => t.setPowerPosition(e, n),
    notify: (e) => {
      t.notice = e;
    },
    pickTool: (e) => t.pickTool(e)
  };
}
const Fu = Object.keys(Ds), Vb = (t) => Fu.includes(t);
function zb() {
  return Object.fromEntries(Fu.map((t) => [t, tt(t, "free")]));
}
const Uu = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Dt, max: Dt, signed: !0 }, bad: "props.badAim" }
}, cn = (t, e, n, i, o) => Ue({ ...Uu[i], value: n, field: e, setNotice: t.onNotice, apply: o, skipSame: !0 }), Rb = ["round", "linear", "spot"], Bb = ["rect", "circle"], Ci = (t, e) => t.map((n) => ({ v: n, label: u(`${e}.${n}`) }));
function Wu(t, e, n, i) {
  const o = (r, l, a) => V(`${u(l)}, ${u("unit.mm")}`, cn(t, n + r, a, "mm", (c) => i({ [r]: c }))), s = (r, l, a) => V(`${u(l)}, ${u("unit.deg")}`, cn(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return g`
        ${V(u("props.shape"), oe(e.shape, Ci([...Rb], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? g`${o("length", "props.length", e.length)}${o("width", "props.width", e.width)}` : e.shape === "round" ? o("diameter", "props.diameter", e.diameter) : v}
        ${V(`${u("props.poolRadius")}, ${u("unit.mm")}`, Ue({
        ...Uu.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: u("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return g`${s("coneAngle", "props.coneAngle", e.coneAngle)}${o("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return g`${s("zoneAngle", "props.zoneAngle", e.zoneAngle)}${o("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return V(`${u("props.diameter")}, ${u("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${X(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${ah.map((r) => g`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return g`
        ${V(u("props.shape"), oe(e.shape, Ci([...Bb], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? g`${o("width", "props.width", e.width)}${o("depth", "props.depth", e.depth)}` : o("diameter", "props.diameter", e.diameter)}
        ${V(u("props.icon"), Ub(t, e.icon, `${n}icon`, i))}
        ${V(u("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${X(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return g`<p class="muted" data-note="daylight">${u("props.daylightInBinding")}</p>`;
    default:
      return g`<p class="muted">${u("props.noSettings")}</p>`;
  }
}
const Fb = /^mdi:[a-z0-9-]+$/;
function Ub(t, e, n, i) {
  const o = (s, r) => {
    var l, a;
    if (!Fb.test(s)) {
      r(e), (l = t.onNotice) == null || l.call(t, u("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), s !== e && !i({ icon: s }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? g`<ha-icon-picker data-field=${n} .value=${X(e)} @value-changed=${(s) => {
    var l;
    const r = s.target;
    o(String(((l = s.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : g`<input class="val wide" type="text" data-field=${n} .value=${X(e)}
    @change=${(s) => {
    const r = s.target;
    o(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function bt(t, e, n, i) {
  return V(e, g`<input type="checkbox" data-field=${t} .checked=${X(n)} @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`);
}
function Wb(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? v : bt("wallMount", u("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function jb(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? v : g`
    ${bt("inverter", u("props.inverter"), !!n.inverter, (o) => {
    var s;
    return ((s = t.onInverter) == null ? void 0 : s.call(t, o)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? bt("controllable", u("props.controllable"), !!n.controllable, (o) => {
    var s;
    return ((s = t.onControllable) == null ? void 0 : s.call(t, o)) ?? !1;
  }) : g`<p class="muted" data-note="bind-switch">${u("props.bindSwitchHint")}</p>`}`;
}
function qb(t, e) {
  const n = e.placement;
  if (n.mode === "none") return v;
  if (n.mode === "free")
    return V(
      `${u("props.rotation")}, ${u("unit.deg")}`,
      cn(t, "rotation", n.rotation, "rotation", (o) => t.onPlacement({ ...n, rotation: o }))
    );
  const i = ja.has(e.props.kind);
  return g`
    ${V(u("props.side"), oe(n.side, Ci(["left", "right"], "side"), (o) => t.onPlacement({ ...n, side: o }), "side"))}
    ${V(`${u("props.offset")}, ${u("unit.mm")}`, cn(
    t,
    "offset",
    n.offset,
    "offset",
    (o) => t.onPlacement({ ...n, offset: o })
  ))}
    ${i ? V(
    `${u("props.aim")}, ${u("unit.deg")}`,
    cn(t, "aim", n.aim ?? 0, "aim", (o) => t.onPlacement(Sc(n, o)))
  ) : v}`;
}
function cr(t, e) {
  return V(u("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${X(t.name)}
    @change=${(n) => {
    const i = n.target, o = i.value.trim();
    if (!o) {
      i.value = t.name;
      return;
    }
    o !== t.name && e(o);
  }} />`);
}
function Zb(t, e) {
  const n = e.props.kind;
  return Ua(n) ? n === "smart_button" && e.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${u("props.typeFreeHint")}</p>` : V(u("props.type"), oe(
    n,
    Ci(["wall_switch", "smart_button"], "device"),
    (i) => {
      var o;
      return (o = t.onKind) == null ? void 0 : o.call(t, i);
    },
    "kind"
  )) : v;
}
function Gb(t, e) {
  const n = t.level ? Sf(t.level, e) : [];
  return g`<fieldset data-field="zone-membership"><legend>${u("props.zoneList")}</legend>
    ${n.length === 0 ? g`<p class="muted">${u("props.noZones")}</p>` : n.map(({ zone: i, participates: o }) => g`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${o}
        @change=${(s) => {
    var l;
    const r = s.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = o);
  }} /></label>`)}
  </fieldset>`;
}
function Kb(t, e) {
  const n = e.placement.mode !== "none";
  return g`
    <h4>${uo(e)}</h4>
    ${cr(e, (i) => t.onDevice({}, i))}
    ${Zb(t, e)}
    ${n ? Wu(t, e.props, "", (i) => t.onDevice(i)) : v}
    ${Wb(t, e)}
    ${qb(t, e)}
    ${jb(t, e)}
    ${n ? Gb(t, e) : v}
    ${e.invalid ? g`<p class="warn">${u("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${u("action.delete")}</button>`;
}
function Xb(t) {
  return t.device ? Kb(t, t.device) : t.nextKind && t.nextProps ? g`
      <h4>${u("props.nextDevice")}: ${u(`device.${t.nextKind}`)}</h4>
      ${Wu(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? bt(
    "next-wallMount",
    u("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : v}` : g`<p class="muted">${u("props.none")}</p>`;
}
function Yb(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, o = Vb(t.toolId) ? t.toolId : null, s = (a) => a === e ? (t.setNotice(u("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const h = a1(e, a, c);
    return s(h ? bi(e, a.id, h) : e);
  };
  return g`<div class="props">
    ${Xb({
    device: i,
    level: e,
    nextKind: o,
    nextProps: o ? t.nextProps[o] : null,
    onDevice: (a, c) => !!i && s(Ft(e, i.id, a, c)),
    onKind: (a) => !!i && s(nf(e, i.id, a)),
    onPlacement: (a) => !!i && s(bi(e, i.id, a)),
    onZone: (a, c) => !!i && s(Vc(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Qc(e, t.power, i.id, a)),
    onControllable: (a) => !!i && s(Xi(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      o && t.setNextProps({ ...t.nextProps, [o]: { ...t.nextProps[o], ...a, kind: o } });
    },
    onDelete: () => {
      i && r(Yc(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? g`<p class="warn">${t.notice}</p>` : v}
    ${i ? v : N1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = Du(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const ps = (t) => u(`zones.kind.${t.shape.kind}`), ur = (t) => g`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${A`<path d=${t === "walls" ? Yp : hm}></path>`}</svg>`;
function ju(t, e) {
  const n = Cc(t, e);
  return n ? u(`zones.invalid.${n}`) : null;
}
function Qb(t) {
  var o;
  const e = t.query.trim().toLowerCase(), n = ((o = t.selection) == null ? void 0 : o.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((s, r) => ({ z: s, hue: tr(r) })).filter(({ z: s }) => !e || s.name.toLowerCase().includes(e) || ps(s).toLowerCase().includes(e));
  return g`
    <div class="zlist">
      <div class="zhead"><span>${u("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${u("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${u("zones.filter")}
        aria-label=${u("zones.filter")} .value=${X(t.query)}
        @input=${(s) => t.onQuery(s.target.value)} />
      <div class="rows">
        ${i.map(({ z: s, hue: r }) => {
    var a;
    const l = s.invalid ? ju(t.level, s) ?? "" : null;
    return g`<button class="zrow${s.id === n ? " sel" : ""}" data-id=${s.id} @click=${() => t.onPick(s.id)}>
            ${l === null ? g`<span class="zswatch" style=${`background:${r}`}></span>` : g`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${s.name}</span>
            <span class="zkind" data-kind=${s.shape.kind} title=${ps(s)}>${ur(s.shape.kind)}</span>
            <span class="zarea">${((a = Rs(t.level, s)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const dr = ro(class extends lo {
  constructor(t) {
    if (super(t), t.type !== je.PROPERTY && t.type !== je.ATTRIBUTE && t.type !== je.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!lu(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === $e || e === v) return e;
    const n = t.element, i = t.name;
    if (t.type === je.PROPERTY) {
      if (e === n[i]) return $e;
    } else if (t.type === je.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return $e;
    } else if (t.type === je.ATTRIBUTE && n.getAttribute(i) === e + "") return $e;
    return er(t), e;
  }
}), qu = (t, e, n) => g`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${dr(e)}
    @change=${(i) => n(i.target.checked)} />${u("zones.automation")}</label>`;
function Jb(t, e, n) {
  const i = Be(t, e.id);
  return g`<div class="zmembers">
    <div class="zhead"><span>${u("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? g`<span>${u("zones.participates")}</span>` : v}</div>
    ${i.length === 0 ? g`<p class="muted">${u("zones.noMembers")}</p>` : i.map(({ device: o, participates: s }) => g`
      <label class="member" data-device=${o.id}>
        <span class="nm"><span class="name">${o.name}</span><small class="kind">${u(`device.${o.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${u("zones.participates")} .checked=${dr(s)}
          @change=${(r) => {
    const l = Vc(t, o.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Kl(t, e, n) {
  const i = ju(t, e), o = e.shape.kind === "walls" && e.shape.broken;
  return g`<div class="zprops">
    <h4>${u("props.zone")}</h4>
    ${V(u("props.name"), g`<input class="val wide" type="text" data-field="zone-name" .value=${X(e.name)}
      @change=${(s) => {
    const r = s.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(Hf(t, e.id, l));
  }} />`)}
    ${V(u("props.area"), g`<span class="val ro" data-field="zone-area">${gu(Rs(t, e))}</span>`)}
    ${V(u("zones.outline"), g`<span class="val ro zkindval" data-field="zone-kind">${ur(e.shape.kind)}${ps(e)}</span>`)}
    ${qu("zone-automation", e.automation !== !1, (s) => {
    const r = js(t, e.id, s);
    r !== t && n(r);
  })}
    ${i ? g`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${o ? g`<button class="btn" data-action="keep-outline" @click=${() => n(Bf(t, e.id))}>
        ${u("zones.keepOutline")}</button>` : v}</div>` : v}
    ${Jb(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Hc(t, e.id))}>
      ${u("zones.delete")}</button>
  </div>`;
}
function ew(t) {
  const e = t.next.zone, n = e.name ?? Pu(t.level), i = (o) => t.setNext({ ...t.next, zone: { ...e, ...o } });
  return g`
    <h4>${u("props.nextZone")}</h4>
    <div class="muted">${u("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${u("zones.method")}>
      ${["walls", "polygon"].map((o) => g`
        <button class=${e.method === o ? "on" : ""} role="radio" aria-checked=${String(e.method === o)} data-method=${o}
          @click=${() => {
    o !== e.method && t.onMethod(o);
  }}>${ur(o)}<span>${u(`zones.kind.${o}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${u(`zones.hint.${e.method}`)}</p>
    ${V(u("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${X(n)}
      @change=${(o) => {
    const s = o.target, r = s.value.trim();
    if (!r) {
      s.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${qu("next-zone-automation", e.automation, (o) => i({ automation: o }))}`;
}
function Zu(t, e, n) {
  return Ue({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Xl(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function tw(t, e) {
  const n = ae(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], o = (s) => e.commit(Yf(e.level, t.id, s));
  return g`
    <h4>${u("props.wall")}</h4>
    ${V(u("props.type"), oe(
    t.type,
    i.map((s) => ({ v: s, label: u(`walltype.${s}`) })),
    (s) => o({ type: s }),
    "wall-type"
  ))}
    ${V(u("props.thickness"), Zu(e, t.thickness, (s) => {
    o({ thickness: s });
  }))}
    ${V(u("props.baseline"), oe(
    t.baseline,
    ["center", "left", "right"].map((s) => ({ v: s, label: u(`baseline.${s}`) })),
    (s) => o({ baseline: s })
  ))}
    ${V(u("props.length"), g`<span class="val ro">${ht(n)} ${u("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(Ks(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function nw(t, e) {
  const n = ["door", "window", "opening", ...mi.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Jh(e.level, t.id, r)), o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = mi.includes(t.kind);
  return g`
    <h4>${u(`kind.${t.kind}`)}</h4>
    ${V(u("props.kind"), oe(t.kind, n.map((r) => ({ v: r, label: u(`kind.${r}`) })), (r) => i(Qh(t, r))))}
    ${V(u("props.width"), Zu(e, t.width, (r) => Xl(e, Yh(e.level, t.id, r))))}
    ${V(u("props.offset"), Ue({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Xl(e, cc(e.level, t.id, r))
  }))}
    ${s ? g`
      ${V(u("props.hinge"), oe(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${V(u("props.swing"), oe(t.swing ?? "left", o, (r) => i({ swing: r })))}` : v}
    ${t.kind === "window" ? V(u("props.outside"), oe(t.outside ?? "left", o, (r) => i({ outside: r }))) : v}
    ${V(u("props.passesLight"), g`<input type="checkbox" data-field="passesLight" .checked=${X(sc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === oc(t.kind) ? void 0 : l });
  }} />`)}
    ${V(u("props.passesPir"), g`<input type="checkbox" data-field="passesPir" .checked=${X(lc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === rc(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? g`<p class="warn">${u("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(uc(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function iw(t) {
  const e = ["bearing", "partition", "railing"];
  return g`
    <h4>${u("props.newWall")}</h4>
    ${V(u("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => g`<option value=${n} ?selected=${n === t.wallType}>${u(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${V(`${u("props.thickness")}, ${u("unit.mm")}`, Ue({
    value: t.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      t.setThickness(n);
    }
  }))}
    ${t.tool === "box" ? g`
      <div class="muted">${u("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => g`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${u(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
const Yl = (t) => Qb({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function ow(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const o = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((s) => s.id === n.id) : void 0;
    return g`<div class="props">
      ${ew({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : v}
      ${o ? Kl(e, o, t.commit) : v}
      ${Yl(t)}
    </div>`;
  }
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const o = e.walls.find((s) => s.id === n.id);
    o && (i = tw(o, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const o = e.openings.find((s) => s.id === n.id);
    o && (i = nw(o, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const o = e.zones.find((s) => s.id === n.id);
    o && (i = Kl(e, o, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const o = e.nodes.find((s) => s.id === n.id);
    o && (i = g`<h4>${u("props.node")}</h4>
      ${V("X", g`<span class="val ro">${ht(o.x)}</span>`)}${V("Y", g`<span class="val ro">${ht(o.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === v && (t.tool === "wall" || t.tool === "box") ? iw(t) : i === v && U1(t.tool) ? W1({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === v && t.tool === "select" ? Yl(t) : i === v ? g`<p class="muted">${u("props.none")}</p>` : i}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : v}
    </div>`;
}
function sw(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Ql = /* @__PURE__ */ new WeakMap();
function hr(t, e, n) {
  let i = Ql.get(t);
  i || Ql.set(t, i = /* @__PURE__ */ new WeakMap());
  let o = i.get(e);
  o || i.set(e, o = [null, null]);
  const s = n ? 1 : 0;
  if (o[s]) return o[s];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : sw(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), o[s] = r, r;
}
function li(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, o = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, s = [o ? t.areas.get(o) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: s.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kn = (t) => t ?? v;
var rw = Object.defineProperty, Tn = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && rw(e, n, o), o;
};
const lw = 100;
let aw = 0;
const cw = (t) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${t}></path>`}</svg>`, _r = class _r extends Ct {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${aw++}`, this.shown = null, this.onOutside = (e) => {
      e.composedPath().includes(this) || this.close();
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
      var e;
      return (e = this.renderRoot.querySelector(".srch input")) == null ? void 0 : e.focus();
    });
  }
  pick(e) {
    this.close(), this.focusBox(), this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: e }, bubbles: !0, composed: !0 }));
  }
  /** Search runs over all rows; at most MAX_ROWS are rendered. Cached per row inputs and query. */
  filtered() {
    const e = [...this.rowDeps(), this.query.trim().toLowerCase()], n = this.shown;
    if (n && n.deps.length === e.length && n.deps.every((l, a) => l === e[a])) return n.value;
    const i = e[e.length - 1], o = [];
    let s = !1;
    for (const l of this.allRows())
      if (!(i && !l.search.includes(i))) {
        if (o.length === lw) {
          s = !0;
          break;
        }
        o.push(l);
      }
    const r = { rows: o, more: s };
    return this.shown = { deps: e, value: r }, r;
  }
  /** Tooltip of the closed box and of a row; none by default. */
  boxTitle() {
  }
  rowTitle(e) {
  }
  optId(e) {
    return `${this.uid}-opt-${e}`;
  }
  /** The active row index kept inside the rows (the rows can shrink while the list is open). */
  clamped(e) {
    return Math.min(this.active, Math.max(e.length - 1, 0));
  }
  onSearchKey(e) {
    const { rows: n } = this.filtered();
    if (e.key === "ArrowDown")
      e.preventDefault(), this.active = Math.max(0, Math.min(this.active + 1, n.length - 1)), this.scrollActive();
    else if (e.key === "ArrowUp")
      e.preventDefault(), this.active = Math.max(this.active - 1, 0), this.scrollActive();
    else if (e.key === "Enter") {
      e.preventDefault();
      const i = n[this.clamped(n)];
      i && this.pick(i.id);
    } else e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), this.close(), this.focusBox());
  }
  onFocusOut(e) {
    var i;
    const n = e.relatedTarget;
    this.isOpen && !(n && ((i = this.shadowRoot) != null && i.contains(n))) && this.close();
  }
  scrollActive() {
    this.updateComplete.then(() => {
      var e, n;
      return (n = (e = this.renderRoot.querySelector(".opt.on")) == null ? void 0 : e.scrollIntoView) == null ? void 0 : n.call(e, { block: "nearest" });
    });
  }
  focusBox() {
    this.updateComplete.then(() => {
      var e;
      return (e = this.renderRoot.querySelector(".cbox")) == null ? void 0 : e.focus();
    });
  }
  onBoxKey(e) {
    e.target === e.currentTarget && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && (e.preventDefault(), this.openList());
  }
  renderClosed() {
    return g`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${Kn(this.label || void 0)} title=${Kn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? g`<button class="x" type="button" title=${u("combo.clear")} aria-label=${u("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return g`<div class="drop" @pointerdown=${(o) => {
      o.target.tagName !== "INPUT" && o.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Kn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(o) => {
      this.query = o.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((o, s) => g`<div class="opt ${s === i ? "on" : ""}" id=${this.optId(s)} role="option"
            aria-selected=${o.id === this.value ? "true" : "false"} data-id=${o.id} title=${Kn(this.rowTitle(o))}
            @click=${() => this.pick(o.id)} @pointerenter=${() => {
      this.active = s;
    }}>${this.renderRow(o)}</div>`)}
      </div>
      ${e.length === 0 ? g`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? g`<div class="hint">${u("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return g`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
_r.styles = Pa`
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
let it = _r;
Tn([
  ze()
], it.prototype, "value");
Tn([
  ze()
], it.prototype, "label");
Tn([
  Z()
], it.prototype, "isOpen");
Tn([
  Z()
], it.prototype, "query");
Tn([
  Z()
], it.prototype, "active");
var uw = Object.defineProperty, fr = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && uw(e, n, o), o;
};
const dw = {
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
}, Jl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, hw = { light: "light", switch: "switch", event: "event", fan: "fan" };
function ea(t, e) {
  return t != null && t.deviceClass && Jl[t.deviceClass] ? Jl[t.deviceClass] : hw[(t == null ? void 0 : t.domain) ?? Uc(e)] ?? "generic";
}
const ta = (t) => cw(dw[t]);
function fw(t) {
  switch (t) {
    case "sensor":
      return u("combo.domain.sensor");
    case "binary_sensor":
      return u("combo.domain.binary_sensor");
    case "light":
      return u("combo.domain.light");
    case "switch":
      return u("combo.domain.switch");
    case "fan":
      return u("combo.domain.fan");
    case "event":
      return u("combo.domain.event");
    default:
      return t;
  }
}
class ho extends it {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = li(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? li(this.meta, e) : null;
    return g`${ta(e ? ea(this.meta.entities.get(e), e) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : v}<small class="eid">${e}</small></span>` : g`<span class="ph">${u("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const o = jc(this.states, e.entityId) ?? "unavailable";
    return g`${ta(ea(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${fw(e.domain)}<br>${o}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = li(this.meta, e).name;
    return n === e ? e : `${n} (${e})`;
  }
  rowTitle(e) {
    return e.name === e.id ? e.id : `${e.name} (${e.id})`;
  }
  searchLabel() {
    return u("combo.search");
  }
  emptyText() {
    return u("combo.empty");
  }
}
fr([
  ze({ attribute: !1 })
], ho.prototype, "meta");
fr([
  ze({ attribute: !1 })
], ho.prototype, "items");
fr([
  ze({ attribute: !1 })
], ho.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", ho);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const un = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const o of n) (i = o._$AO) == null || i.call(o, e, !1), un(o, e);
  return !0;
}, Ii = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, Gu = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), gw(e);
  }
};
function pw(t) {
  this._$AN !== void 0 ? (Ii(this), this._$AM = t, Gu(this)) : this._$AM = t;
}
function mw(t, e = !1, n = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0) if (e) if (Array.isArray(i)) for (let s = n; s < i.length; s++) un(i[s], !1), Ii(i[s]);
  else i != null && (un(i, !1), Ii(i));
  else un(this, t);
}
const gw = (t) => {
  t.type == je.CHILD && (t._$AP ?? (t._$AP = mw), t._$AQ ?? (t._$AQ = pw));
};
class bw extends lo {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), Gu(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, o;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (o = this.disconnected) == null || o.call(this)), n && (un(this, e), Ii(this));
  }
  setValue(e) {
    if (lu(this._$Ct)) this._$Ct._$AI(e, this);
    else {
      const n = [...this._$Ct._$AH];
      n[this._$Ci] = e, this._$Ct._$AI(n, this, 0);
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
const ww = () => new vw();
class vw {
}
const Oo = /* @__PURE__ */ new WeakMap(), $w = ro(class extends bw {
  render(t) {
    return v;
  }
  update(t, [e]) {
    var i;
    const n = e !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = e, this.ht = (i = t.options) == null ? void 0 : i.host, this.rt(this.ct = t.element)), v;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let n = Oo.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Oo.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Oo.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), yw = () => [{ v: "0", label: u("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], xw = { min: 1, max: 10 };
function Ku(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const ms = (t, e, n) => Ku(t, Ft(t.level, e.id, n));
function No(t, e, n, i) {
  return g`<div class="cflag">${V(e, g`<input type="checkbox" data-field=${t} .checked=${X(n)}
    @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`)}</div>`;
}
const Po = "__other", Kt = /* @__PURE__ */ new Set();
function kw(t, e, n, i, o) {
  const s = `${e.id}:${n}`, r = zr.includes(i), l = !r || Kt.has(s), a = ww(), c = [...zr.map((f) => ({ v: f, label: f })), { v: Po, label: u("binding.eventOther") }];
  return g`<span class="evfield">${oe(l ? Po : i, c, (f) => {
    if (f === Po) {
      Kt.add(s), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Kt.delete(s), a.value && (a.value.hidden = !0), f !== i ? o(f) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${$w(a)} data-field=${`${n}-event-custom`} ?hidden=${dr(!l)}
      .value=${X(r ? "" : i)} @change=${(f) => {
    var m;
    const d = f.target, p = d.value.trim();
    if (!p) {
      d.value = r ? "" : i, t.setFieldNotice(u("props.badEvent"));
      return;
    }
    if (d.value = p, t.setFieldNotice(null), p !== i) {
      o(p) && Kt.delete(s);
      return;
    }
    if (Kt.delete(s), r) {
      d.hidden = !0;
      const $ = (m = d.parentElement) == null ? void 0 : m.querySelector("select");
      $ && ($.value = i);
    }
  }} /></span>`;
}
function Mw(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return g`${v}`;
  const o = i[n], s = (r) => ms(t, e, { [n]: { ...o, ...r } });
  return g`<div class="trigger" data-trigger=${n}>
    ${V(u("binding.slot"), oe(
    String(o.slot),
    yw(),
    (r) => r === String(o.slot) ? !1 : s({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${V(u("binding.event"), kw(t, e, n, o.event, (r) => s({ event: r })))}
  </div>`;
}
function _w(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return g`
      ${No(
      "autoByDoubleToggle",
      u("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => ms(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${V(u("binding.window"), Ue({
      value: i.windowSec,
      rule: xw,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => ms(t, e, { windowSec: l })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${v}`;
  const o = (l, a) => (c) => {
    var f, d;
    const h = Ft(t.level, e.id, { [l]: c });
    return Ku(t, c && !((f = e.bindings) != null && f[a]) ? Fi(h, e.id, a, ((d = e.bindings) == null ? void 0 : d.on) ?? null) : h);
  }, s = o("separateOff", "off"), r = No("autoEnabled", u("binding.autoEnabled"), i.autoEnabled, o("autoEnabled", "auto"));
  return n === "off" ? r : g`${No("separateOff", u("binding.separateOff"), i.separateOff, s)}${i.separateOff ? v : r}`;
}
function Aw(t) {
  return t.props.kind !== "smart_button" || !lh(t).length ? g`${v}` : g`<div class="cfields"><p class="warn" data-note="duplicate">${u("binding.duplicate")}</p></div>`;
}
const Ht = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, Xu = 3600, In = (t) => typeof t == "number" && Number.isFinite(t);
function Sw(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Ht, i = Yu(e.nightBelow, e.dayAbove), o = Qu(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: o ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: o ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: Ju(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function Yu(t, e) {
  if (t !== void 0 && !In(t) || e !== void 0 && !In(e)) return !1;
  const n = t ?? Ht.nightBelow, i = e ?? Ht.dayAbove;
  return n >= 0 && n < i;
}
function Qu(t, e) {
  if (t !== void 0 && !In(t) || e !== void 0 && !In(e)) return !1;
  const n = t ?? Ht.sunNight, i = e ?? Ht.sunDay;
  return n < i;
}
const Ju = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= Xu, na = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function Lw(t, e) {
  var l, a, c, h;
  const n = Sw(t), i = (f) => {
    const d = f ? e == null ? void 0 : e[f] : void 0;
    return d && typeof d == "object" ? d : void 0;
  }, o = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (o && ((a = o.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof o.state == "string" && o.state.trim() !== "") {
    const f = Number(o.state);
    if (Number.isFinite(f)) return { state: na(f, n.nightBelow, n.dayAbove), lux: f };
  }
  const s = i((c = t.bindings) == null ? void 0 : c.sun), r = (h = s == null ? void 0 : s.attributes) == null ? void 0 : h.elevation;
  return s && s.state !== "unavailable" && s.state !== "unknown" && In(r) ? { state: na(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
function Cw(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function Iw(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return v;
  const i = Ht, o = (a, c) => {
    if (c === n[a] || n[a] === void 0 && c === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(Ft(t.level, e.id, { [a]: c }));
  }, s = (a, c) => {
    const h = String(n[a] ?? i[a]);
    return V(c, g`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${X(h)}
      @change=${(f) => {
      const d = f.target;
      if (d.value.trim() === "") {
        o(a, void 0);
        return;
      }
      const p = Cw(d.value);
      if (p === null) {
        d.value = h, t.setFieldNotice(u("props.badDecimal"));
        return;
      }
      o(a, p);
    }} />`);
  }, r = V(u("props.debounce"), Ue({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: Xu },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => o("debounce", a),
    onBlank: () => o("debounce", void 0)
  })), l = (a, c) => g`<p class="warn" data-note=${a}>${c}</p>`;
  return g`<div class="cfields" data-section="daylight">
    ${s("nightBelow", u("props.nightBelow"))}
    ${s("dayAbove", u("props.dayAbove"))}
    ${Yu(n.nightBelow, n.dayAbove) ? v : l("lux-pair", u("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${s("sunNight", u("props.sunNight"))}
    ${s("sunDay", u("props.sunDay"))}
    ${Qu(n.sunNight, n.sunDay) ? v : l("sun-pair", u("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${Ju(n.debounce) ? v : l("debounce", u("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function gs(t, e) {
  return e === "control" && t.props.kind === "equipment" ? u("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? u("binding.onOff") : u(`role.${e}`);
}
const To = (t) => String(t).padStart(2, "0");
function Ew(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${To(e.getHours())}:${To(e.getMinutes())}:${To(e.getSeconds())}`;
}
const Dw = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function Ow(t) {
  return t.status === "error" ? t.reason === "unavailable" ? u("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : u("output.errorNotConfigured") : t.last ? u("output.last").replace("{event}", Dw(t.last, t.kind)).replace("{time}", Ew(t.last.at)) : u("output.none");
}
function Nw(t, e) {
  if (!Wi(e.props.kind)) return v;
  const n = t.feed.stateOf(e), i = n ? Ow(n) : t.feed.error ?? (t.feed.ready ? u("output.notSaved") : null);
  return i === null ? v : g`<p class="note" data-field="output">${i}</p>`;
}
function Pw(t, e, n, i) {
  const o = qc(t.meta, i, t.states), s = rh(t.level, e, n);
  return g`
    ${o === "missing" ? g`<p class="warn" data-note="missing">${u("binding.missing")}</p>` : v}
    ${o === "unavailable" ? g`<p class="note" data-note="unavailable">${u("binding.unavailable")}</p>` : v}
    ${s.length ? g`<p class="note" data-note="also">${u("binding.alsoBound").replace("{names}", s.map((r) => r.name).join(", "))}</p>` : v}`;
}
function Tw(t, e, n) {
  var l;
  const { role: i } = n, o = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, s = !!t.showAll[i], r = gs(e, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${s}
        @change=${() => t.onShowAll(i)} />${u("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${hr(t.meta, n, s)} .value=${o}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = Fi(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Cs(i) ? Mw(t, e, i) : v}
    ${o ? Pw(t, e, i, o) : v}
  </div>`;
}
function Hw(t) {
  const e = t.device, n = Is(t.level.devices.map(t.status));
  return g`<div class="props bprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.fieldNotice ? g`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : v}
    ${t.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${u(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${e ? g`
      <h4>${uo(e)}</h4>
      ${cr(e, (i) => t.commit(Ft(t.level, e.id, {}, i)))}
      ${Nw(t, e)}
      ${Oe(e).map((i) => g`${Tw(t, e, i)}${_w(t, e, i.role)}`)}
      ${Aw(e)}
      ${Iw(t, e)}` : g`<p class="muted">${u("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${u("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${u("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${u("binding.reload")}</button>
  </div>`;
}
const Vw = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, zw = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Rw = 6, Bw = ["A", "0", "B"], Fw = ["power", "control"], Uw = ["power", "power_in", "power_out", "voltage", "control"], Vt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function Xt(t, e, n, i) {
  const { [n]: o, ...s } = e, r = i === null ? s : { ...s, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function Yt(t, e, n, i, o, s) {
  return g`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${hr(t.meta, i, !1)}
      .value=${o ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (o ?? null) && s(l);
  }}></ps-entity-combo>
  </div>`;
}
function Ww(t, e) {
  const n = e.name ?? "";
  return V(u("props.name"), g`<input class="val wide" type="text" data-field="name"
    placeholder=${u(`power.kind.${e.kind}`)} .value=${X(n)} @change=${(i) => {
    const o = i.target, s = o.value.trim();
    s && s !== n ? t.commitPower(Mn(t.power, e.id, { name: s }, Vt(t))) : o.value = n;
  }} />`);
}
function jw(t, e) {
  const n = new Set(Oe(e).map((i) => i.role));
  return g`${Fw.filter((i) => n.has(i)).map((i) => {
    var s;
    const o = (s = e.bindings) == null ? void 0 : s[i];
    return g`<div class="role">
      <div class="role-head"><span class="role-label">${u(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${o ? g`<b>${li(t.meta, o).name}</b><small>${o}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${u("power.boundHint")}</p>`;
}
function Xn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function qw(t, e) {
  var s;
  const n = Oe(e), i = Uw.flatMap((r) => n.filter((l) => l.role === r)), o = e.props;
  return g`
    ${cr(e, (r) => Xn(t, Ft(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return g`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${gs(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${hr(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${gs(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), Xn(t, Fi(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${o.kind === "equipment" && ((s = e.bindings) != null && s.control) ? bt(
    "controllable",
    u("props.controllable"),
    !!o.controllable,
    (r) => Xn(t, Xi(t.level, e.id, r))
  ) : v}
    ${o.kind === "equipment" ? bt("inverter", u("props.inverter"), !!o.inverter, (r) => {
    const l = Qc(t.level, t.power, e.id, r);
    return Xn(t, l.level, l.power);
  }) : v}`;
}
function Zw(t, e) {
  const n = t.level.devices.find((o) => o.id === e.deviceId);
  if (!n) return g`<p class="warn" data-note="device-missing">${u("power.missing")}</p>`;
  const i = Bt(n) ? v : bt("output", u("power.enableOutput"), e.output !== !1, (o) => {
    const s = Vt(t);
    if (o) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(no(Mn(t.power, e.id, { output: !1 }, s), e.deviceId, s));
    return !0;
  });
  return n.props.kind === "equipment" ? g`${qw(t, n)}${i}` : g`
    ${V(u("props.name"), g`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${V(u("props.kind"), g`<span class="val ro">${u(`device.${n.props.kind}`)}</span>`)}${jw(t, n)}${i}`;
}
function Gw(t, e) {
  var o, s;
  const n = (s = (o = t.frame) == null ? void 0 : o.blocks[e.id]) == null ? void 0 : s.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: u(`power.form.${r}`) }));
  return g`
    ${V(u("power.form"), oe(e.form, i, (r) => {
    r !== e.form && t.commitPower(Mn(t.power, e.id, { form: r }, Vt(t)));
  }, "form"))}
    <div class="row"><span>${u("power.position")}</span><span class="seg pos">${Bw.map((r) => g`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${u("power.positionHint")}</p>`;
}
function Kw(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, o = n ? e.h : e.w, s = (a, c) => {
    if (a === i && c === o) return !1;
    t.commitPower(Mn(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, Vt(t)));
  }, r = (a, c, h) => Ue({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: h }), l = ["h", "v"].map((a) => ({ v: a, label: u(`power.orientation.${a}`) }));
  return g`
    ${V(u("power.orientation"), oe(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(Mn(t.power, e.id, { w: e.h, h: e.w }, Vt(t)));
  }, "bus-orientation"))}
    ${V(u("power.busLength"), r("bus-length", i, (a) => s(Math.max(cs, o + 1, a), o)))}
    ${V(u("power.busThickness"), r("bus-thickness", o, (a) => s(i, Math.min(Math.max(Rw, a), i - 1))))}`;
}
function Xw(t, e) {
  switch (e.kind) {
    case "grid":
      return g`
      ${Yt(t, "power", u("power.field.power"), dt, e.power, (n) => Xt(t, e, "power", n))}
      ${Yt(t, "voltage", u("power.field.voltage"), Vw, e.voltage, (n) => Xt(t, e, "voltage", n))}`;
    case "device":
      return Zw(t, e);
    case "battery":
      return g`
      ${Yt(t, "power", u("power.field.batteryPower"), dt, e.power, (n) => Xt(t, e, "power", n))}
      ${Yt(t, "soc", u("power.field.soc"), zw, e.soc, (n) => Xt(t, e, "soc", n))}`;
    case "pv":
      return Yt(t, "power", u("power.field.power"), dt, e.power, (n) => Xt(t, e, "power", n));
    case "transfer":
      return Gw(t, e);
    case "bus":
      return Kw(t, e);
    default:
      return v;
  }
}
function Yw(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((o) => o.id === e.deviceId) : void 0;
  return g`
    <h4>${i ? uo(i) : u(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? v : Ww(t, e)}
    ${Xw(t, e)}
    <div class="pactions">
      ${n ? g`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(dp(t.power, e.id))}>${u("power.autoPorts")}</button>` : v}
      ${e.kind === "grid" ? v : g`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Kc(t.power, e.id))}>${u("action.delete")}</button>`}
    </div>`;
}
function Qw(t, e) {
  var o, s;
  const n = Vt(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? oo(l, n) || u(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return g`
    <h4>${u("power.wire")}</h4>
    ${V(u("power.wire.from"), g`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${V(u("power.wire.to"), g`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${V(u("power.wire.power"), g`<span class="val ro" data-field="wire-power">${St((s = (o = t.frame) == null ? void 0 : o.wires[e.id]) == null ? void 0 : s.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Jc(t.power, e.id))}>${u("action.delete")}</button></div>`;
}
function Jw(t) {
  const e = eu(t.level, t.power);
  return g`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Du(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${u("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${u("power.help.device")}</p>
    ${e.length === 0 ? g`<p class="muted" data-note="no-devices">${u("power.noDevices")}</p>` : g`<div class="pdevs">
      ${e.map((i) => g`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${uo(i)}</span>
      </button>`)}
    </div>`}`;
}
function ev(t) {
  if (t.toolId === "power-device") return Jw(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((o) => o.id === e.id) : void 0;
  if (n) return Yw(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((o) => o.id === e.id) : void 0;
  return i ? Qw(t, i) : t.toolId !== "power-select" ? g`<p class="muted" data-note="power-hint">${u("power.help.place")}</p>` : g`<p class="muted" data-note="power-hint">${u("power.pick")}</p><p class="muted">${u("power.help.select")}</p>`;
}
function tv(t) {
  return g`<div class="props pprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.feedError ? g`<p class="note" data-notice="feed">${t.feedError}</p>` : v}
    ${ev(t)}
  </div>`;
}
const ed = "ended: switched elsewhere";
function Hn(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
const nv = {
  "button: auto": "auto",
  "auto again": "autoAgain",
  "button: manual": "manualButton",
  "switched off elsewhere: waits for new motion": "releasedOff",
  "found on": "found",
  // the command sent on entering auto (a fresh decision)
  "back to auto: no motion": "autoOff",
  "back to auto: not dark": "autoOffLight",
  "back to auto: motion": "autoOn"
};
function td(t) {
  return nv[t.reason];
}
function nd(t) {
  return t.sent === !1 && (t.reason === ed || t.reason.startsWith("switched elsewhere"));
}
const iv = 5e3, ov = 12;
function ia(t) {
  t().catch(() => {
  });
}
class sv {
  constructor(e, n) {
    this.host = e, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.onDisconnected = () => {
      this.cancelRetry(), this.drop(!1), this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.host.requestUpdate();
    }, this.onReady = () => {
      this.cancelRetry(), this.retries = 0, this.drop(!0), this.subscribe();
    };
  }
  /** The first full message for the watched plan has arrived. */
  get ready() {
    return this.gotFull;
  }
  /** Why there are no live rule state (no subscription support, or the subscription failed), else null. */
  get error() {
    return this.failure;
  }
  /** The live trace of a saved rule; undefined for a rule the server does not know (not saved yet). */
  trace(e) {
    return this.map.get(e);
  }
  watch(e) {
    e !== this.planId && (this.stop(), this.planId = e, e !== null && this.start());
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
    const e = this.connection();
    if (!(e != null && e.subscribeMessage)) {
      this.setFailure(u("output.noLive"));
      return;
    }
    this.conn = e, (n = e.addEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e.addEventListener) == null || i.call(e, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady);
  }
  /** Ends the current subscription: its messages are ignored from now on; `unsubscribe` also tells the server. */
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && ia(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (o) => {
        i.live && this.apply(o);
      },
      { type: "plan_studio/rules/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!i.live) {
          ia(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Le(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= ov || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, iv));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.rules ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, o] of n) this.map.set(i, o);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
function ye(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function pr(t, e = !1) {
  const n = e ? td(t) : void 0;
  if (n) return u(`motionLight.row.${n}`).replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ye(t.at)).trim();
  if (Hn(t)) return u("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", ye(t.at)).trim();
  if (t.sent === !1)
    return u(nd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ye(t.at)).trim();
  const i = `${u(`rules.did.${t.action}`)} ${t.target} ${ye(t.at)}`.trim();
  return t.error ? `${i}: ${t.error}` : i;
}
function mr(t) {
  return Hn(t) ? u("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", ye(t.at)) : u("vent.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", ye(t.at));
}
function rv(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${u("rules.status.error")}: ${e.reason}` : u(`rules.status.${e.status}`) : t.enabled === !1 ? u("rules.status.disabled") : n.live ? u("rules.unsaved") : u("rules.noTrace");
}
function lv(t, e, n) {
  const i = n.trace(t.id), o = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", s = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !ri(r, t);
  return g`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${o} role="img" aria-label=${u(`rules.verdict.${o}`)}
        title=${u(`rules.verdict.${o}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? g` <span class="orphan">(${u("rules.orphan")})</span>` : v}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${rv(t, i, n)}</span>
        ${l ? g`<span class="runsaved">${u("rules.unsavedChanges")}</span>` : v}
        ${s > 0 ? g`<span class="rwarn">${s === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(s))}</span>` : v}
        ${i != null && i.last ? g`<span class="rlast">${pr(i.last, !!i.motionLight)}</span>` : v}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${u("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${u("rules.delete")}</button>
      </div>
    </div>`;
}
function av(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((o) => o.id === e.id) ?? null : null, i = Y1(t.rules, (n == null ? void 0 : n.id) ?? null, (o) => t.level.zones.some((s) => s.id === o));
  return g`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : u("rules.noZone")}</h4>
      ${t.feedError ? g`<p class="muted">${t.feedError}</p>` : v}
      ${n === null && i.length === 0 && t.rules.length === 0 ? g`<p class="muted">${u("rules.hint")}</p>` : v}
      ${i.length === 0 ? g`<p class="muted rempty">${u("rules.empty")}</p>` : i.map((o) => lv(o, n === null && o.zoneId !== null, t))}
    </div>`;
}
const id = {
  condition: jp,
  leak: pu,
  timer: cm,
  outside: bm,
  vent: cu,
  boiler: gm,
  timed: um,
  beurer: Jp,
  control: uu,
  motionLight: du
}, cv = ["condition", "timer", "control"], uv = ["vent", "boiler", "leak", "timed", "outside", "motionLight", "beurer"], bs = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${t}></path>`}</svg>`;
function dv(t, e, n) {
  return [
    ...cv.map((i) => g`
      <button class="tool" data-template=${i} title=${u(`rules.template.${i}`)} @click=${() => t(i)}>
        ${bs(id[i])}<span class="tlabel">${u(`rules.template.${i}`)}</span></button>`),
    g`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${u("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${bs(sm)}<span class="tlabel">${u("rules.automations")}</span></button>`
  ];
}
function hv(t) {
  var s;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), o = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  o !== null && (t.preventDefault(), (s = n[o]) == null || s.focus());
}
function fv(t, e, n) {
  return g`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${u("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${hv}>
      ${uv.map((i) => g`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${bs(id[i])}<span>${u(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function pv(t, e) {
  return t.mode === "automation" ? g`<div class="tools">${Eu(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${dv((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? I1(t.mode, t.toolId, (n) => t.pickTool(n)) : R1({
    level: e,
    selection: t.selection,
    status: t.bindStatus,
    filter: t.bindFilter,
    query: t.bindQuery,
    onFilter: (n) => {
      t.bindFilter = n;
    },
    onQuery: (n) => {
      t.bindQuery = n;
    },
    onPick: (n) => t.pickDevice(n),
    collapsed: t.railCollapsed,
    onCollapse: (n) => {
      t.railCollapsed = n;
    }
  });
}
function mv(t, e) {
  var i;
  const n = t.selection;
  return Hw({
    level: e,
    device: (n == null ? void 0 : n.kind) === "device" ? e.devices.find((o) => o.id === n.id) ?? null : null,
    meta: t.haMeta.get(),
    states: (i = t.hass) == null ? void 0 : i.states,
    status: t.bindStatus,
    showAll: t.showAll,
    onShowAll: (o) => {
      t.showAll = { ...t.showAll, [o]: !t.showAll[o] };
    },
    commit: (o) => t.commit(o),
    onNextUnbound: () => t.nextUnboundDevice(),
    notice: t.notice,
    fieldNotice: t.fieldNotice,
    setFieldNotice: (o) => {
      t.fieldNotice = o;
    },
    registryError: t.haMeta.error,
    registryLoading: t.haMeta.loading,
    onRetry: () => t.haMeta.retry(),
    feed: t.feed
  });
}
function gv(t, e) {
  var i;
  if (t.mode === "binding") return mv(t, e);
  if (t.mode === "automation")
    return g`<div class="props">${av({
      level: e,
      rules: t.rules,
      saved: (o) => t.session.savedRules.find((s) => s.id === o),
      selection: t.selection,
      trace: (o) => t.rulesFeed.trace(o),
      live: t.rulesFeed.ready,
      feedError: t.rulesFeed.error,
      onEdit: (o) => t.openRuleDialog("condition", o),
      onDelete: (o) => {
        t.dialog = { kind: "delete-rule", id: o };
      }
    })}</div>`;
  if (t.mode === "power")
    return tv({
      power: t.power,
      level: e,
      selection: t.selection,
      meta: t.haMeta.get(),
      states: (i = t.hass) == null ? void 0 : i.states,
      frame: t.powerFeed.frame,
      notice: t.notice,
      feedError: t.powerFeed.error,
      toolId: t.toolId,
      placeDeviceId: t.placeDeviceId,
      onPlaceDevice: (o) => t.armDevice(o),
      commit: (o, s) => t.commit(o, s),
      commitPower: (o) => t.commitPower(o),
      setPosition: (o, s) => t.setPowerPosition(o, s)
    });
  const n = {
    level: e,
    selection: t.selection,
    notice: t.notice,
    commit: (o) => t.commit(o),
    setNotice: (o) => {
      t.notice = o;
    }
  };
  return t.mode === "equipment" ? Yb({
    ...n,
    power: t.power,
    commit: (o, s) => t.commit(o, s),
    toolId: t.toolId,
    nextProps: t.nextProps,
    setNextProps: (o) => {
      t.nextProps = o;
    },
    nextWallMount: t.nextObj.wallMount,
    setNextWallMount: (o) => {
      t.nextObj = { ...t.nextObj, wallMount: o };
    },
    pickDevice: (o) => t.pickDevice(o)
  }) : ow({
    ...n,
    tool: t.toolId,
    boxMeasure: t.boxMeasure,
    wallType: t.wallType,
    thickness: t.thickness,
    next: t.nextObj,
    setNext: (o) => {
      t.nextObj = o;
    },
    setWallType: (o) => t.setWallType(o),
    setThickness: (o) => {
      t.thickness = o;
    },
    setBoxMeasure: (o) => {
      t.boxMeasure = o;
    },
    zoneQuery: t.zoneQuery,
    onZoneQuery: (o) => {
      t.zoneQuery = o;
    },
    onPickZone: (o) => t.pickZone(o),
    onZoneMethod: (o) => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, method: o } }, t.pickTool("zone");
    }
  });
}
function bv(t, e) {
  switch (t) {
    case "wall":
      return [["Shift", u("hint.shift")], [u("hint.digits"), u("hint.length")], ["Tab", u("hint.tab")], ["Esc", u("hint.esc")]];
    case "box":
      return [[u("hint.digits"), u("hint.size")], ["Tab", u("hint.tabSize")], ["Esc", u("hint.esc")]];
    case "zone":
      return e === "polygon" ? [
        ["Enter", u("hint.close")],
        ["Backspace", u("hint.removeVertex")],
        ["Shift", u("hint.shift")],
        ["Alt", u("hint.freeVertex")],
        ["Esc", u("hint.cancel")]
      ] : [["Esc", u("hint.esc")]];
    case "select":
    case "device-select":
    case "power-select":
      return [["Del", u("hint.delete")], ["Esc", u("hint.deselect")]];
    case "binding-select":
      return [["Esc", u("hint.deselect")]];
    default:
      return [["Esc", u("hint.esc")]];
  }
}
function wv(t, e) {
  const n = t === "zone" ? `${u("tool.zone")} · ${u(`zones.kind.${e}`)}` : u(`tool.${t}`);
  return g`<span class="tool-chip">${Iu(t)}${n}</span>`;
}
function vv(t) {
  return g`
    <div class="status">
      ${wv(t.tool, t.zoneMethod)}
      ${bv(t.tool, t.zoneMethod).map(([e, n]) => g`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? g`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${u(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? v : g`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${u("status.cones")}
      </label>`}
    </div>`;
}
function $v(t, e) {
  var s, r;
  const n = e.palette, i = 1 / e.scale, o = [
    {
      label: u(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((s = e.live) == null ? void 0 : s.first) ?? "",
      active: t.field === "first",
      unit: u("unit.mm")
    },
    {
      label: u(e.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: t.second,
      live: ((r = e.live) == null ? void 0 : r.second) ?? "",
      active: t.field === "second",
      unit: e.mode === "box" ? u("unit.mm") : "°"
    }
  ];
  return A`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${o.map((l, a) => A`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function yv(t, e, n, i) {
  const o = t.walls;
  if (!o || o.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = o[0], h = Math.hypot(c.x - a.x, c.y - a.y);
    let f = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return f < 0 && (f += 360), { first: ht(h), second: f.toFixed(1) };
  }
  if (o.length < 2) return null;
  const s = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(o[0].b.x - o[0].a.x, o[0].b.y - o[0].a.y) + s, l = Math.hypot(o[1].b.x - o[1].a.x, o[1].b.y - o[1].a.y) + s;
  return { first: ht(r), second: ht(l) };
}
function xv(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const kv = Pa`
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
  .ed.automation { grid-template-columns: 84px 340px 1fr; }
  @media (max-width: 700px) {
    .ed { grid-template-columns: 72px 170px 1fr; }
    .ed.binding { grid-template-columns: 170px 200px 1fr; }
    .ed.power { grid-template-columns: 72px 200px 1fr; }
    .ed.automation { grid-template-columns: 72px 230px 1fr; }
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
  /* The Automation rail's "Automations" menu: fixed beside its button, over everything but the dialogs. */
  .amenu-back { position: fixed; inset: 0; z-index: 8; }
  .amenu { position: fixed; z-index: 9; display: flex; flex-direction: column; min-width: 220px; padding: 4px;
    background: var(--ch-card); border: 1px solid var(--ch-divider); border-radius: 8px; box-shadow: 0 6px 20px rgba(0, 0, 0, .3); }
  .amenu-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 0; border-radius: 6px;
    background: transparent; color: var(--ch-text); font-size: 13px; text-align: left; cursor: pointer; }
  .amenu-item .ticon { width: 20px; height: 20px; fill: currentColor; opacity: .8; flex: none; }
  .amenu-item:hover, .amenu-item:focus-visible { background: var(--ch-hover); outline: none; }
  .amenu-item:focus { background: var(--ch-tint); outline: none; }
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

  /* Automation step: the rules of the selected zone. */
  .rrow { display: grid; grid-template-columns: 12px minmax(0, 1fr) auto; gap: 10px; align-items: start;
    padding: 8px 4px; border-bottom: 1px solid var(--ch-divider); }
  .rbody { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .rname { font-weight: 500; overflow-wrap: anywhere; }
  .rname .orphan, .rstatus, .rlast { color: var(--ch-muted); font-size: 12px; }
  .runsaved { font-size: 12px; font-style: italic; }
  .rstatus.error, .rwarn { color: var(--ch-error); font-size: 12px; }
  .ractions { display: flex; flex-direction: column; gap: 4px; }
  .ractions .btn { padding: 3px 10px; font-size: 12px; }
  .vdot { width: 10px; height: 10px; margin-top: 4px; box-sizing: border-box; border-radius: 50%; border: 2px solid var(--ch-muted); }
  .vdot[data-verdict='true'] { background: #22c55e; border-color: #22c55e; }
  .vdot[data-verdict='false'] { background: var(--ch-muted); border-color: var(--ch-muted); }
  .vdot[data-verdict='unknown'] { border-style: dashed; }

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

  /* The rule dialogs: the condition dialog about 90 % of the viewport (the purpose-built ones narrow it below); the
     form scrolls on the left, the diagram is on the right, the footer below. */
  .dialog.rdlg { box-sizing: border-box; width: 90%; height: 90%; max-width: none; display: flex; flex-direction: column; padding: 14px 18px; }
  .rsettings > p.muted { margin: 0; }
  .rsettings .rcheck { margin-top: 12px; font-size: 13px; color: var(--ch-text); }
  .vnums { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 18px; margin-top: 8px; }
  .vnums label { display: inline-flex; align-items: center; gap: 6px; color: var(--ch-muted); font-size: 12px; }
  .rcols { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(280px, 38%) 1fr; gap: 18px; margin-top: 4px; }
  .rsettings { overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 8px; min-width: 0; }
  .rsettings .rlabel, .rfoot .rlabel { color: var(--ch-muted); font-size: 12px; margin-top: 6px; }
  .rsettings input, .rsettings select, .rfoot select { font: inherit; color: var(--ch-text); background: var(--ch-bg);
    border: 1px solid var(--ch-divider); border-radius: 6px; padding: 5px 8px; min-width: 0; }
  .rsettings .num { width: 72px; text-align: right; }
  .rgroup { display: flex; flex-direction: column; gap: 6px; }
  .rline { display: flex; align-items: center; gap: 6px; padding: 3px 6px; border-radius: 6px; outline: none;
    border: 1px solid transparent; }
  .rline:focus-within, .rgroup[data-field]:focus-within { border-color: var(--ch-primary); background: var(--ch-tint); }
  .rline { flex-wrap: wrap; }
  .rparams { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding-left: 4px; }
  .rparams label { display: inline-flex; align-items: center; gap: 4px; color: var(--ch-muted); font-size: 12px; }
  .rsources { flex-basis: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
  .rchip { display: inline-flex; align-items: center; gap: 6px; padding: 2px 3px 2px 10px; border: 1px solid var(--ch-divider); border-radius: 12px; font-size: 12px; }
  .rchip.bad { border-color: var(--ch-error); }
  .rchip.hl { border-color: var(--ch-primary); background: var(--ch-tint); }
  .rwarn { flex-basis: 100%; margin: 0; color: var(--ch-error); font-size: 12px; }
  .rline.bad { border-color: var(--ch-error); }
  .rline .grow, .rsettings .grow { flex: 1; min-width: 0; }
  .rline .btn { padding: 1px 8px; }
  .rchip .btn { padding: 1px 7px; border-radius: 9px; line-height: 16px; }
  .rnot { display: inline-flex; align-items: center; gap: 4px; color: var(--ch-muted); font-size: 12px; cursor: pointer; }
  .rnot input { margin: 0; }
  .radd { color: var(--ch-muted); }
  .rproblems { margin: 8px 0 0; padding: 0 0 0 18px; color: var(--ch-error); font-size: 12px; }
  .rfoot { display: flex; align-items: center; gap: 10px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--ch-divider); }
  .rfoot .rlabel { margin: 0; }
  .flow { min-width: 0; min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 6px; }
  /* The diagrams keep their width; a tall one scrolls in its column. */
  svg.fc, svg.vt { width: 100%; height: auto; flex: none; }
  .fc-blk { cursor: pointer; }
  .fc-box { fill: var(--ch-card); stroke: var(--ch-divider); stroke-width: 1.5; }
  .fc-blk:hover .fc-box { stroke: var(--ch-primary); }
  .fc-blk.hl .fc-box { stroke: var(--ch-primary); stroke-width: 2.5; fill: var(--ch-tint); }
  .fc-blk.on .fc-box { stroke: #22c55e; }
  .fc-blk.nodata .fc-box { stroke: #f59e0b; stroke-dasharray: 5 3; }
  .fc-blk.muted .fc-box { fill: none; stroke-dasharray: 4 4; }
  .fc-blk.muted .fc-t1 { fill: var(--ch-muted); font-weight: 400; }
  .fc-t1 { fill: var(--ch-text); font-size: 13px; font-weight: 500; }
  .fc-t2, .fc-head { fill: var(--ch-muted); font-size: 12px; }
  .fc-err { fill: var(--ch-error); font-size: 12px; }
  .fc-head { font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .fc-link { fill: none; stroke: var(--ch-muted); stroke-width: 1.5; opacity: .7; }
  .fc-note { margin: 0; color: var(--ch-muted); font-size: 12px; }
  .fc-warn { margin: 0; color: #f59e0b; font-size: 12px; }
  .fc-last { margin: 0; color: var(--ch-text); font-size: 12px; }
  @media (max-width: 700px) { .rcols { grid-template-columns: 1fr; overflow-y: auto; } }
  /* The purpose-built automation dialogs (ventilation, boiler, leak protection): one compact frame sized to its content,
     about 960 px wide (form ~420 px + the 480 px diagram at 1:1) and up to 90 % high, then the body scrolls as one;
     on narrow screens 16 px margins, below 760 px the diagram goes under the form. */
  .dialog.rdlg.pdlg { width: 960px; max-width: calc(100% - 32px); height: auto; max-height: min(90%, calc(100% - 32px)); }
  .pdlg .rcols { flex: 0 1 auto; overflow-y: auto; grid-template-columns: minmax(260px, 42fr) minmax(0, 48fr); }
  .pdlg .rsettings, .pdlg .flow { overflow: visible; }
  .pdlg .flow { align-items: center; }
  .pdlg .rsettings > .rsources { flex: none; }
  @media (max-width: 760px) { .pdlg .rcols { grid-template-columns: 1fr; } }

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
`, Mv = 5e-3, _v = 2, Ei = (t) => Math.max(Mv, Math.min(_v, t));
function Av(t, e, n) {
  var r;
  const i = (r = t == null ? void 0 : t.getScreenCTM) == null ? void 0 : r.call(t), o = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (o && Number.isFinite(o.a) && Number.isFinite(o.d))
    return { x: o.a * n.clientX + o.c * n.clientY + o.e, y: o.b * n.clientX + o.d * n.clientY + o.f };
  const s = t == null ? void 0 : t.getBoundingClientRect();
  return {
    x: e.x + (n.clientX - ((s == null ? void 0 : s.left) ?? 0)) / e.scale,
    y: e.y + (n.clientY - ((s == null ? void 0 : s.top) ?? 0)) / e.scale
  };
}
function Sv(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Ei(Math.min(e, n) / 12e3) };
  const i = t.map((f) => f.x), o = t.map((f) => f.y), s = 1500, r = Math.min(...i) - s, l = Math.max(...i) + s, a = Math.min(...o) - s, c = Math.max(...o) + s, h = Ei(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / h / 2, y: (a + c) / 2 - n / h / 2, scale: h };
}
function Lv(t, e, n, i, o) {
  const s = Ei(Math.min(o, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / s / 2, y: t.y + t.h / 2 - n / s / 2, scale: s };
}
function Cv(t, e, n) {
  const i = Ei(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function Iv(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function oa(t, e, n, i) {
  const o = n / t.scale, s = i / t.scale;
  return e.x >= t.x && e.x <= t.x + o && e.y >= t.y && e.y <= t.y + s ? t : { ...t, x: e.x - o / 2, y: e.y - s / 2 };
}
function Ev(t, e, n, i, o = 1) {
  const s = 1e3 * o, r = 100 * o * t.scale >= 6 ? 100 * o : s, l = 1 / t.scale;
  return A`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <rect width=${s} height=${s} fill="url(#grid-minor)"></rect>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Dv = ["Shift", "Control", "Alt", "Meta"], Ov = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, Nv = new Map(Object.entries(Cu).map(([t, e]) => [`Key${e}`, t]));
function sa(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class Pv {
  constructor(e) {
    this.h = e, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
      var o, s;
      if (this.h.dialog !== null) return;
      this.h.focus();
      const i = n.currentTarget;
      if (n.button === 1 || n.button === 0 && this.spaceDown) {
        n.preventDefault(), this.spacePending = !1, this.panFrom = { x: n.clientX, y: n.clientY }, (o = i.setPointerCapture) == null || o.call(i, n.pointerId);
        return;
      }
      n.button === 0 && ((s = i.setPointerCapture) == null || s.call(i, n.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(n)), this.h.requestUpdate());
    }, this.pointerMove = (n) => {
      if (this.h.dialog === null) {
        if (this.panFrom) {
          this.h.view = Iv(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
          return;
        }
        this.h.activeTool.move(this.toolEvent(n)), this.h.requestUpdate();
      }
    }, this.pointerUp = (n) => {
      if (this.h.dialog === null) {
        if (this.panFrom) {
          this.panFrom = null;
          return;
        }
        n.button !== 0 || !this.pointerActive || (this.pointerActive = !1, this.h.activeTool.up(this.toolEvent(n)), this.h.requestUpdate());
      }
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
      var i, o;
      this.h.dialog === null && n.button === 0 && ((o = (i = this.h.activeTool).dblclick) == null || o.call(i, this.toolEvent(n)), this.h.requestUpdate());
    }, this.wheel = (n) => {
      this.h.dialog === null && (n.preventDefault(), this.h.view = Cv(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (sa(n) || !this.h.history) return;
      const i = n.ctrlKey || n.metaKey, o = n.code === "KeyZ" ? "z" : n.code === "KeyY" ? "y" : n.code === "KeyS" ? "s" : n.key.toLowerCase();
      if (i && (o === "z" || o === "y")) {
        if (n.preventDefault(), o === "z" && !n.shiftKey && this.h.activeTool.key("Undo", { shift: !1 })) {
          this.h.requestUpdate();
          return;
        }
        o === "z" && !n.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && o === "s") {
        n.preventDefault(), this.h.doSave();
        return;
      }
      if (n.key === " ") {
        n.preventDefault(), !n.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      const s = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && s ? Nv.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = Ov[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || sa(n), o = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const s = this.spacePending;
        this.spacePending = !1, s && !i && (this.h.activeTool.key(" ", o), this.h.requestUpdate());
        return;
      }
      i || !Dv.includes(n.key) || (this.h.activeTool.key(n.key, o), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function od(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function Tv(t) {
  return g`
    <div class="draft-banner" role="status">
      <span>${u("draft.banner").replace("{time}", od(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${u("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${u("draft.discard")}</button>
    </div>`;
}
function xt(t, e, n, i) {
  return g`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? g`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${n.map((o) => g`<button class="btn${o.primary ? " primary" : ""}" data-action=${o.action}
            ?disabled=${o.disabled ?? !1} @click=${o.onClick}>${o.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Hv(t) {
  var n;
  const e = { action: "cancel", label: u("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? xt(u("draft.title"), u("draft.text").replace("{time}", od(i.savedAt)), [
        { action: "restore", label: u("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: u("draft.discard"), onClick: () => t.discard(i) }
      ]) : v;
    }
    case "new":
      return xt(u("new.title"), u("new.text"), [
        { action: "new-discard", label: u("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return xt(u("delete.title"), u("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return xt(u("delete.rule.title"), u("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? u("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return xt(u("switch.title"), u("switch.text"), [
        { action: "switch-discard", label: u("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return xt(u("conflict.title"), u(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: u("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: u("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return v;
  }
}
const Qt = "plan_studio.draft.", Yn = "plan_studio.lastPlanId";
function Vv() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function zv(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class Rv {
  constructor(e = Vv, n = 500) {
    this.storage = e, this.delayMs = n, this.timer = null, this.pending = null;
  }
  /** Writes `make()` after the delay; later calls within the delay replace the pending draft. */
  schedule(e) {
    this.pending = e, this.timer === null && (this.timer = setTimeout(() => {
      this.timer = null, this.flush();
    }, this.delayMs));
  }
  /** Writes the pending draft now, if any. */
  flush() {
    this.cancelTimer();
    const e = this.pending;
    this.pending = null, e && this.write(e());
  }
  /** Drops the pending write without writing. */
  cancel() {
    this.cancelTimer(), this.pending = null;
  }
  write(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Qt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Qt + e), o = i ? JSON.parse(i) : null;
      return zv(o) && o.planId === e ? o : null;
    } catch {
      return null;
    }
  }
  /** Newest draft of any plan (used when the server has no plans, e.g. an unsaved new plan). */
  latest() {
    try {
      const e = this.storage();
      if (!e) return null;
      let n = null;
      for (let i = 0; i < e.length; i++) {
        const o = e.key(i);
        if (!(o != null && o.startsWith(Qt))) continue;
        const s = this.read(o.slice(Qt.length));
        s && (!n || s.savedAt > n.savedAt) && (n = s);
      }
      return n;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var e;
    try {
      return ((e = this.storage()) == null ? void 0 : e.getItem(Yn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Yn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Yn)) === e && n.removeItem(Yn);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Qt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const sd = 5e3, rd = 12;
function ra(t) {
  t().catch(() => {
  });
}
class Bv {
  constructor(e, n) {
    this.host = e, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.onDisconnected = () => {
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
  get(e) {
    return this.map.get(e);
  }
  /** The device's live state; undefined when the saved plan has no such container or has it as another kind. */
  stateOf(e) {
    const n = this.map.get(e.id);
    return (n == null ? void 0 : n.kind) === e.props.kind ? n : void 0;
  }
  watch(e) {
    e !== this.planId && (this.stop(), this.planId = e, e !== null && this.start());
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
    const e = this.connection();
    if (!(e != null && e.subscribeMessage)) {
      this.setFailure(u("output.noLive"));
      return;
    }
    this.conn = e, (n = e.addEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e.addEventListener) == null || i.call(e, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady);
  }
  /** Ends the current subscription: its messages are ignored from now on; `unsubscribe` also tells the server. */
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && ra(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (o) => {
        i.live && this.apply(o);
      },
      { type: "plan_studio/containers/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!i.live) {
          ra(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Le(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= rd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, sd));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.containers ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, o] of n) this.map.set(i, o);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
const Fv = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function ld(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const ad = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Uv(t, e) {
  var s;
  const n = ad(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Fv[((s = n.attributes) == null ? void 0 : s.unit_of_measurement) ?? ""], o = Number(n.state);
  return i === void 0 || !Number.isFinite(o) ? void 0 : o * i;
}
const Wv = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function ai(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let o = "none", s = !1, r = !1, l;
  const a = (p, m, $) => {
    if (!p) return;
    l = ad(e, p);
    const w = (l == null ? void 0 : l.state) ?? "";
    o = m.includes(w) ? "on" : $.includes(w) ? "off" : "no-data";
  }, c = ["on"], h = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      s = !0;
    // falls through
    case "socket":
    case "equipment": {
      r = !!n.control, a(n.control, c, h);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      s = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], c, h), o === "on" && (o = "active");
      break;
    }
    case "wall_switch":
      a(n.state, c, h);
      break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const f = { look: o };
  if (s && l && (o === "on" || o === "active")) {
    const p = Wv(l);
    p !== void 0 && (f.timerSince = p);
  }
  const d = Oe(t).some((p) => p.role === "power") ? Uv(e, n.power) : void 0;
  return d !== void 0 && Math.round(d) >= 1 && (o === "on" || !r) && (f.power = d), i === "illuminance_sensor" && (n.illuminance || n.sun) && (f.daylight = jv(t, e)), f;
}
function jv(t, e) {
  const n = Lw(t, e);
  if (n.state === null) return u("daylight.noData");
  const i = u(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${u("daylight.bySun")}`;
}
function cd(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const o = e.props.kind;
    i.push({ text: ld(n - t.timerSince), tone: o === "motion_sensor" ? "motion" : o === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: St(t.power), tone: "device" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device" }), i;
}
const qv = 1046, ud = 1.25, vt = 480, F = 10, W = 34, dd = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, hd = (t) => Math.floor((t - 20) / 6.6), Zv = (t) => Math.floor((t - 20) / 6), ge = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : ld(t * 1e3), Q = (t) => 14 + 18 * t;
function We(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return A`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, o) => A`<text class=${o === 0 ? "fc-t1" : o === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(o)}>${dd(i, o === 0 ? hd(t.w) : Zv(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Di(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const fe = qv, xe = fe / 2, Je = 230, ci = 26, ve = 4, la = 36, Ae = Q(2), Gv = (fe - ve * Je - (ve - 1) * ci) / 2, aa = 200, lt = 330, fd = 40, Ke = 460, dn = 8, pd = 24, ws = (fe - lt * 2 - fd) / 2, ca = ws + lt + fd;
function Vn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${u("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${u("rules.unit.min")}` : i === 0 ? `${n} ${u("rules.unit.h")}` : `${n} ${u("rules.unit.h")} ${i} ${u("rules.unit.min")}`;
}
const gr = (t, e) => ge(Math.max(1, Math.ceil((t - e) / 1e3)));
function br(t, e = !1) {
  return "light" in t ? `${u("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? u(`rules.daylight.is.${t.is}`) : "sun" in t ? u(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${u(`rules.held.${t.held.state}`)} ${Vn(t.held.seconds)}` : "rule" in t ? u("rules.src.rule") : u("rules.src.device");
}
const ua = (t) => Number.isFinite(t) ? String(t) : "?";
function Kv(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function md(t, e, n) {
  return "daylight" in n ? gd(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? u("rules.flow.trueIn").replace("{t}", gr(t.until, e)) : t.detail;
}
const gd = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${gr(t.until, e)})`), ne = (t) => u(`rules.val.${t === null ? "unknown" : t}`), j = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function Xv(t) {
  if (t <= ve) {
    const i = (fe - t * Je - (t - 1) * ci) / 2;
    return Array.from({ length: t }, (o, s) => i + s * (Je + ci));
  }
  const e = t - Math.floor((t - 1) / ve) * ve, n = Math.floor((ve - e) / 2);
  return Array.from({ length: t }, (i, o) => {
    const s = o % ve;
    return Gv + (o >= t - e ? n + s : s) * (Je + ci);
  });
}
function bd(t, e, n, i) {
  const o = n ? "daylight" in t.source && n.value !== null ? `${u(n.value ? "rules.flow.open" : "rules.flow.closed")}, ${gd(n, i)}` : n.value === !0 ? u("rules.flow.open") : n.value === null ? `${u("rules.flow.closed")}, ${u("rules.val.unknown")}` : n.until !== void 0 && n.until > i ? `${u("rules.flow.closed")}, ${u("rules.flow.opensIn").replace("{t}", gr(n.until, i))}` : `${u("rules.flow.closed")}${n.detail ? `, ${n.detail}` : ""}` : br(t.source);
  return [`${u("rules.flow.gate")}: ${t.not ? "NOT " : ""}${e}`, o];
}
function wd(t, e) {
  const n = Math.ceil(t / ve), i = Xv(t), o = (a) => F + a * (e + la), s = (a) => o(Math.floor(a / ve)), r = (a) => o(a) + e + (a === n - 1 ? W : la) / 2, l = [];
  i.forEach((a, c) => l.push(`M${a + Je / 2} ${s(c) + e} V${r(Math.floor(c / ve))}`));
  for (let a = 0; a < n; a++) {
    const c = [xe, ...i.slice(a * ve, (a + 1) * ve).map((h) => h + Je / 2)];
    Math.max(...c) > Math.min(...c) && l.push(`M${Math.min(...c)} ${r(a)} H${Math.max(...c)}`);
  }
  return { xs: i, inY: s, busY: r, bottom: t === 0 ? F - W : o(n - 1) + e, links: l };
}
function Yv(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, o = e.inputs.map((B, D) => {
    const U = (i == null ? void 0 : i[D].value) ?? null;
    return U === null || !B.not ? U : !U;
  }), s = i ? Kv(e.combine, o) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, c = (n == null ? void 0 : n.unknownInputs) ?? 0, h = e.gate ? n == null ? void 0 : n.gate : void 0, f = e.gate ? bd(e.gate, t.inputName(e.gate), h, t.now) : [], d = u("rules.flow.delay").replace("{on}", ua(e.onDelay)).replace("{off}", ua(e.offDelay)), p = n === void 0 ? d : `${ne(r ?? null)}${l ? `, ${u("rules.flow.pending").replace("{to}", ne(l.to)).replace("{t}", ge(a))}` : ""}`, m = e.inputs.length, $ = wd(m, Ae), { xs: w, inY: b } = $, y = m === 0 ? F : $.bottom + W, x = y + Ae + W, M = x + Ae + W, k = (e.gate ? M : x) + Ae, _ = k + W / 2, C = k + W, L = C + pd, E = Math.max(1, e.onTrue.length, e.onFalse.length), H = L + E * (Ae + dn) - dn + F, I = [
    { side: "true", x: ws, list: e.onTrue, head: u("rules.whenTrue") },
    { side: "false", x: ca, list: e.onFalse, head: u("rules.whenFalse") }
  ], O = [...$.links];
  m > 0 && O.push(`M${xe} ${$.busY(0)} V${y}`), O.push(`M${xe} ${y + Ae} V${x}`), e.gate && O.push(`M${xe} ${x + Ae} V${M}`), O.push(`M${xe} ${k} V${_} H${ws + lt / 2} V${C}`, `M${xe} ${_} H${ca + lt / 2} V${C}`);
  const T = (B) => We({ ...B, h: Ae, focused: t.focused === B.field, onClick: () => t.onFocus(B.target) });
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * ud}px`} viewBox=${`0 0 ${fe} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("rules.flow.title")}>
        ${O.map((B) => A`<path class="fc-link" d=${B}></path>`)}
        ${e.inputs.map((B, D) => {
    const U = i == null ? void 0 : i[D];
    return T({
      x: w[D],
      y: b(D),
      w: Je,
      field: `input-${D}`,
      target: { input: D },
      cls: U ? j(U.value) : "",
      lines: [`${B.not ? "NOT " : ""}${t.inputName(B)}`, U ? md(U, t.now, B.source) : br(B.source, B.not === !0)]
    });
  })}
        ${T({
    x: (fe - aa) / 2,
    y,
    w: aa,
    field: "combine",
    target: "gate",
    cls: s === void 0 ? "" : j(s),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...s === void 0 ? [] : [ne(s)]]
  })}
        ${T({
    x: (fe - Ke) / 2,
    y: x,
    w: Ke,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : j(r ?? null),
    lines: [u("rules.flow.result"), p]
  })}
        ${e.gate ? T({
    x: (fe - Ke) / 2,
    y: M,
    w: Ke,
    field: "gate-input",
    target: "gate-input",
    cls: h ? j(h.value) : "",
    lines: f
  }) : v}
        ${I.map((B) => A`
          <text class="fc-head" text-anchor="middle" x=${B.x + lt / 2} y=${C + 14}>${B.head}</text>
          ${B.list.length === 0 ? A`<text class="fc-t2" text-anchor="middle" x=${B.x + lt / 2} y=${L + Ae / 2 + 4}>${u("rules.noActions")}</text>` : B.list.map((D, U) => T({
    x: B.x,
    y: L + U * (Ae + dn),
    w: lt,
    field: `action-${B.side}-${U}`,
    target: { action: B.side, index: U },
    cls: "",
    lines: [t.actionName(D.device), Qv(D.do)]
  }))}`)}
      </svg>
      ${c > 0 ? g`<p class="fc-warn">${c === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(c))}</p>` : v}
      ${n != null && n.held ? g`<p class="fc-warn" data-note="held">${u("rules.flow.heldNote")}</p>` : v}
      ${n != null && n.last ? g`<p class="fc-last">${u("rules.flow.last")} ${pr(n.last)}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const Qv = (t) => u(`rules.act.${t}`), da = { s: 1, min: 60, h: 3600 }, Jv = ["s", "min", "h"];
function e$(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Oi = (t) => Number.isFinite(t) ? String(t) : "";
function ha(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const vs = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? u("rules.missingDevice") : t.ruleName(e.rule) ?? u("rules.missingRule");
};
function wr(t, e) {
  var i, o;
  const n = e.source;
  return "device" in n || "rule" in n ? vs(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? u("rules.light.noSensor") : "daylight" in n ? ((o = t.deviceById(n.daylight)) == null ? void 0 : o.name) ?? u("rules.light.noSensor") : "sun" in n ? u("rules.src.sun") : "time" in n ? u("rules.src.time") : n.held.sources.length === 0 ? u("rules.src.held") : `${u("rules.src.held")}: ${n.held.sources.map((s) => vs(t, s)).join(", ")}`;
}
const $s = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function t$(t, e) {
  return "device" in e || "rule" in e ? $s(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => $s(t, n)) : !1;
}
function vd(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function $d(t) {
  return g`
    <optgroup label=${u("rules.groupDevices")}>
      ${t.inputDevices.map((e) => g`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? g`<optgroup label=${u("rules.groupRules")}>
      ${t.otherRules.map((e) => g`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : v}`;
}
function vr(t, e, n) {
  return g`
    <option value="">${e}</option>
    ${$d(t)}
    <optgroup label=${u("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((i) => g`<option value=${i}>${u(`rules.src.${i}`)}</option>`)}
    </optgroup>
    ${n ?? v}`;
}
function n$(t, e, n, i) {
  const o = e.list, s = t.deviceById(i.device), r = s ? e.actionsFor(s) : [], l = r.includes(i.do) ? r : [...r, i.do], a = e.unique ? t.actionDevices.filter((c) => c.id === i.device || !o.some((h) => h.device === c.id)) : t.actionDevices;
  return g`
    <div class="rline" data-field=${e.field(n)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(c) => {
    const h = t.deviceById(c.target.value);
    h && e.set(o.map((f, d) => d === n ? { device: h.id, do: e.actionsFor(h).includes(f.do) ? f.do : e.firstDo(h) } : f));
  }}>
        ${s && !t.actionDevices.includes(s) ? g`<option value=${s.id}>${s.name}</option>` : v}
        ${s ? v : g`<option value=${i.device}>${u("rules.missingDevice")}</option>`}
        ${a.map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(c) => e.set(o.map((h, f) => f === n ? { ...h, do: c.target.value } : h))}>
        ${l.map((c) => g`<option value=${c}>${e.doText(c)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${u("rules.remove")} @click=${() => e.set(o.filter((c, h) => h !== n))}>&times;</button>
    </div>`;
}
function yd(t, e) {
  const n = e.unique ? t.actionDevices.filter((i) => !e.list.some((o) => o.device === i.id)) : t.actionDevices;
  return g`
    <div class="rgroup">
      <div class="rlabel">${e.label}</div>
      ${e.list.map((i, o) => n$(t, e, o, i))}
      <select class="radd" data-action=${e.add} data-field=${e.addField ?? v} .value=${""}
        @change=${(i) => {
    const o = i.target, s = t.deviceById(o.value);
    o.value = "", s && e.actionsFor(s).length > 0 && e.set([...e.list, { device: s.id, do: e.firstDo(s) }]);
  }}>
        <option value="">${e.addText}</option>
        ${n.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
      </select>
    </div>`;
}
function fa(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return yd(t, {
    label: u(e === "true" ? "rules.whenTrue" : "rules.whenFalse"),
    addText: u("rules.addAction"),
    add: `add-action-${e}`,
    field: (o) => Di({ action: e, index: o }),
    list: n[i],
    set: (o) => t.onChange({ ...n, [i]: o }),
    actionsFor: ee,
    firstDo: (o) => ee(o)[0],
    doText: (o) => u(`rules.act.${o}`)
  });
}
const Ho = (t) => t.trim() === "" ? NaN : Number(t);
function pa(t, e, n, i) {
  var o;
  return g`<select data-part=${e} data-value=${n} @change=${(s) => i(s.target.value)}>
    ${t.lightSensors.some((s) => s.id === n) ? v : g`<option value=${n}>${((o = t.deviceById(n)) == null ? void 0 : o.name) ?? u("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
  </select>`;
}
const i$ = ["night", "dark", "day"];
function o$(t, e, n, i) {
  var o;
  if ("daylight" in n)
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.daylight.sensor")} ${pa(t, "daylight", n.daylight, (s) => i({ ...n, daylight: s }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(s) => i({ ...n, is: s.target.value })}>
          ${i$.map((s) => g`<option value=${s}>${u(`rules.daylight.is.${s}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const s = n.light === "" ? void 0 : t.lightUnit(n.light);
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.light.sensor")}
          ${pa(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${u("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Oi(n.below)}
            @input=${(r) => i({ ...n, below: Ho(r.target.value) })} /> lx</label>
        <label>${u("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Oi(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: Ho(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${u("rules.light.unknownDark")}</label>
        ${s !== void 0 && s !== "lx" ? g`<p class="rwarn" data-warn="light-unit">${u("rules.light.unit").replace("{unit}", s)}</p>` : v}
      </div>`;
  }
  if ("time" in n)
    return g`
      <div class="rparams">
        <label>${u("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(s) => i({ time: { ...n.time, from: s.target.value } })} /></label>
        <label>${u("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(s) => i({ time: { ...n.time, to: s.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const s = n.held, r = ((o = t.draft.units) == null ? void 0 : o[e]) ?? e$(s.seconds), l = Number.isFinite(s.seconds) ? String(+(s.seconds / da[r]).toFixed(4)) : "", a = (c) => i({ held: { ...s, ...c } });
    return g`
      <div class="rparams">
        <div class="rsources">
          ${s.sources.length === 0 ? g`<span class="muted">${u("rules.held.noSources")}</span>` : v}
          ${s.sources.map((c, h) => g`
            <span class="rchip${$s(t, c) ? " bad" : ""}" data-part="source">${vs(t, c)}
              <button class="btn" data-action="remove-source" title=${u("rules.held.removeSource")}
                @click=${() => a({ sources: s.sources.filter((f, d) => d !== h) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(c) => {
      const h = c.target, f = vd(t, h.value);
      h.value = "", f && ("device" in f || "rule" in f) && a({ sources: [...s.sources, f] });
    }}>
            <option value="">${u("rules.held.addSource")}</option>
            ${$d(t)}
          </select>
        </div>
        <label>${u("rules.held.state")}
          <select data-part="state" data-value=${s.state}
            @change=${(c) => a({ state: c.target.value })}>
            ${["on", "off", "any"].map((c) => g`<option value=${c}>${u(`rules.held.${c}`)}</option>`)}
          </select></label>
        <label>${u("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(c) => {
      var h;
      ((h = t.draft.units) == null ? void 0 : h[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(Ho(c.target.value) * da[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(c) => t.onUnit(e, c.target.value)}>
            ${Jv.map((c) => g`<option value=${c}>${u(`rules.unit.${c}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return v;
}
function $r(t, e, n, i, o) {
  const s = e.source, r = !("device" in s || "rule" in s), l = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return g`
    <div class="rline${t$(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${r ? u(`rules.src.${l}`) : wr(t, e)}${"sun" in s ? g` <span class="muted">${e.not ? u("rules.sun.above") : br(s)}</span>` : v}</span>
      ${o ?? v}
      ${"daylight" in s && !e.not ? v : g`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(a) => {
    const c = a.target.checked, { not: h, ...f } = e;
    i(c ? { ...f, not: !0 } : f);
  }} /> ${u("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${o$(t, n, s, (a) => i({ ...e, source: a }))}
    </div>`;
}
const yr = (t, e) => (n) => {
  const i = n.target, o = i.value ? vd(t, i.value) : null;
  i.value = "", o && e(o);
};
function xd(t, e, n, i = u("rules.gate.hint")) {
  const o = t.draft.rule, s = (r) => {
    const { gate: l, ...a } = o;
    t.onChange(r ? { ...a, gate: r } : a);
  };
  return g`
      <div class="rgroup">
        <div class="rlabel">${e}</div>
        <p class="muted">${i}</p>
        ${o.gate ? $r(t, o.gate, n, s) : g`<select class="radd" data-action="set-gate" .value=${""} @change=${yr(t, (r) => s({ source: r }))}>
            ${vr(t, u("rules.gate.set"))}
          </select>`}
      </div>`;
}
function kd(t) {
  const e = t.draft.rule;
  return g`
      <label class="rlabel" for="rule-name">${u("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${u("rules.namePlaceholder")}
        @input=${(n) => t.onChange({ ...e, name: n.target.value })} />`;
}
function s$(t) {
  const e = t.draft.rule;
  return g`
    <div class="rsettings">
      ${kd(t)}

      <label class="rlabel" for="rule-combine">${u("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(n) => t.onChange({ ...e, combine: n.target.value === "all" ? "all" : "any" })}>
        <option value="any">${u("rules.combine.any")}</option>
        <option value="all">${u("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${u("rules.inputs")}</div>
        ${e.inputs.length === 0 ? g`<p class="muted">${u("rules.noInputs")}</p>` : e.inputs.map((n, i) => $r(
    t,
    n,
    Di({ input: i }),
    (o) => t.onChange({ ...e, inputs: o ? e.inputs.map((s, r) => r === i ? o : s) : e.inputs.filter((s, r) => r !== i) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${yr(t, (n) => t.onChange({ ...e, inputs: [...e.inputs, { source: n }] }))}>
          ${vr(t, u("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${u("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${u("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${Ai} step="1" .value=${Oi(e.onDelay)}
              @input=${(n) => t.onChange({ ...e, onDelay: ha(n.target.value) })} /></label>
          <label class="grow">${u("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${Ai} step="1" .value=${Oi(e.offDelay)}
              @input=${(n) => t.onChange({ ...e, offDelay: ha(n.target.value) })} /></label>
        </div>
      </div>

      ${xd(t, u("rules.gate"), Di("gate-input"))}

      ${fa(t, "true")}
      ${fa(t, "false")}
    </div>`;
}
function r$(t) {
  const e = t.draft.rule, n = (i) => t.onFocus(Di(i));
  return Md({
    title: u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t.problems.map((i) => ({ key: i, text: u(`rules.problem.${i}`) })),
    form: s$(t),
    diagram: Yv({
      rule: e,
      inputName: (i) => wr(t, i),
      actionName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? u("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: n
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
function Md(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return g`
    <div class="backdrop rule-backdrop" @change=${(i) => i.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${t.title}>
        <h3>${t.title}</h3>
        <div class="rcols">
          ${t.form}
          ${t.diagram}
        </div>
        ${t.texts.length > 0 ? g`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : v}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${u("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? v : g`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const zt = vt, xr = 20, Lt = zt - 2 * F, hn = (Lt - xr) / 2, ys = (zt - hn * 2 - xr) / 2, ma = ys + hn + xr, Vo = (zt - Lt) / 2, zo = zt / 2, Ro = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), ga = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", l$ = (t) => `${t > 0 ? "+" : ""}${t} %`, Jt = (t, e) => We({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function ba(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${Ro(n.t)} °C` : "", n.rh !== null ? `${Ro(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${Ro(n.ah)} g/m³` : "—"];
}
function a$(t) {
  var B, D, U;
  const e = t.rule, n = e.vent, i = t.trace, o = i == null ? void 0 : i.inputs[0], s = o == null ? void 0 : o.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((B = e.onTrue[0]) == null ? void 0 : B.device) ?? "", c = ba(r, u("vent.sensor"), s == null ? void 0 : s.a), h = ba(l, u("vent.than"), s == null ? void 0 : s.b), f = Q(Math.max(c.length, h.length)), d = u("vent.flow.vs").replace("{a}", r).replace("{b}", l), p = s ? `: ${s.pct === null ? ne(null) : l$(s.pct)}` : o ? `: ${o.detail}` : "", m = s ? `${dd(d, hd(Lt) - p.length)}${p}` : `${d}${p}`, $ = u("vent.flow.margins").replace("{above}", ga(n.above)).replace("{below}", ga(n.below)), w = i == null ? void 0 : i.pending, b = w ? Math.max(0, Math.ceil((w.at - t.now) / 1e3)) : 0, y = u("vent.flow.runon").replace("{t}", Vn(e.offDelay)), x = [
    i ? `${u("rules.flow.result")}: ${ne(i.verdict)}` : u("rules.flow.result"),
    w ? `${y} (${u("vent.pending").replace("{to}", w.to ? "on" : "off").replace("{t}", ge(b))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((D = e.onTrue[0]) == null ? void 0 : D.do) ?? "?"} / ${((U = e.onFalse[0]) == null ? void 0 : U.do) ?? "?"}`,
    ...M ? [mr(M)] : []
  ], _ = M == null ? void 0 : M.error, C = Q(k.length + (_ ? 1 : 0)), L = F + f + W, E = L + Q(2) + W, H = E + Q(2) + W, I = H + C + F, O = (he) => A`<path class="fc-link" d=${`M${he + hn / 2} ${F + f} V${L - W / 2} H${zo} V${L}`}></path>`, T = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${u("rules.status.error")}: ${i.reason}` : u(`rules.status.${i.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${zt}px`} viewBox=${`0 0 ${zt} ${I}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("vent.flow.title")}>
        ${O(ys)}${O(ma)}
        <path class="fc-link" d=${`M${zo} ${L + Q(2)} V${E} M${zo} ${E + Q(2)} V${H}`}></path>
        ${Jt(t, { x: ys, y: F, w: hn, h: f, field: "vent-sensor", cls: s != null && s.a.why ? " nodata" : "", lines: c })}
        ${Jt(t, { x: ma, y: F, w: hn, h: f, field: "vent-than", cls: s != null && s.b.why ? " nodata" : "", lines: h })}
        ${Jt(t, { x: Vo, y: L, w: Lt, h: Q(2), field: "vent-above", cls: o ? j(o.value) : "", lines: [m, $], tip: `${d}${p}
${$}` })}
        ${Jt(t, { x: Vo, y: E, w: Lt, h: Q(2), field: "vent-runon", cls: i ? j(i.verdict) : "", lines: x })}
        ${Jt(t, { x: Vo, y: H, w: Lt, h: C, field: "vent-fan", cls: "", lines: k, err: _ })}
      </svg>
      ${T ? g`<p class="fc-warn" data-note="status">${T}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function $t(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return g`
    <div class="backdrop rule-backdrop" @change=${(i) => i.stopPropagation()}>
      <div class="dialog rdlg pdlg" role="dialog" aria-modal="true" aria-label=${t.title}>
        <h3>${t.title}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${t.hint}</p>
            <label class="rlabel" for=${`${t.prefix}-name`}>${u("rules.name")}</label>
            <input id=${`${t.prefix}-name`} data-field="name" type="text" .value=${e.name} placeholder=${u("rules.namePlaceholder")}
              @input=${(i) => t.onChange({ ...e, name: i.target.value })} />
            ${t.form}
          </div>
          ${t.diagram}
        </div>
        ${t.texts.length > 0 ? g`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : v}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${u("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? v : g`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Bo = (t) => t.trim() === "" ? NaN : Number(t), Fo = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Uo(t, e, n, i, o) {
  var r;
  const s = n === "" || i.some((l) => l.id === n);
  return g`
    <select data-field=${e} data-value=${n} @change=${(l) => o(l.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? v : g`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? u("rules.missingDevice")}</option>`}
      ${i.map((l) => g`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function c$(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: u("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: u("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: u("vent.problem.fan") });
  const o = [...i], s = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((c) => !!c);
  for (const c of t.problems)
    c === "device-missing" && !s.some((h) => !t.deviceById(h)) && !(n.sensor && !t.climateSensors.some((h) => h.id === n.sensor)) && !(n.than && !t.climateSensors.some((h) => h.id === n.than)) || c === "vent" && i.length > 0 || o.push({ key: c, text: u(c === "delay" ? "vent.problem.runon" : `rules.problem.${c}`) });
  return o;
}
function u$(t) {
  var s;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), o = ((s = e.onTrue[0]) == null ? void 0 : s.device) ?? "";
  return $t({
    prefix: "vent",
    title: u("vent.title"),
    hint: u("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: c$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("vent.sensor")}</label>
      ${Uo(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${u("vent.than")}</label>
      ${Uo(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${u("vent.fan")}</label>
      ${Uo(t, "vent-fan", o, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${u("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${X(Fo(n.above))}
            @input=${(r) => i({ above: Bo(r.target.value) })} /></label>
        <label>${u("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${X(Fo(n.below))}
            @input=${(r) => i({ below: Bo(r.target.value) })} /></label>
        <label>${u("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${X(Fo(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(Bo(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: a$({
      rule: e,
      deviceName: (r) => {
        var l;
        return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const d$ = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, Ni = vt, h$ = Ni - 2 * F, f$ = F, p$ = Ni / 2, wa = (t) => t === null ? ne(null) : `${Math.round(t)} W`, Qn = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function m$(t, e) {
  const n = t.until !== void 0 ? ge(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? u("boiler.phase.heatingCheck").replace("{t}", n) : u("boiler.phase.heating");
    case "waiting":
      return u("boiler.phase.waiting").replace("{t}", n ?? ge(0));
    case "blackout":
    case "limit":
    case "done":
      return u(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function g$(t) {
  return t.phase === "heating" ? j(!0) : t.phase !== null ? j(!1) : j(t.relay === null ? null : t.relay === "on");
}
function b$(t) {
  const n = t.rule.boiler, i = n.grid, o = t.trace, s = o == null ? void 0 : o.boiler, r = t.deviceName(n.device), l = [];
  let a = F;
  const c = (w, b, y, x) => {
    const M = Q(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: w, cls: b, lines: y, err: x }), a += M + W;
  };
  if (i) {
    c("boiler-grid", s && s.grid === null ? j(null) : "", [t.gridName(i.block), s ? wa(s.grid) : u("boiler.flow.gridPower")]);
    const w = u("boiler.flow.formula").replace("{nominal}", Qn(i.nominal)), b = s && s.headroom !== null ? s.headroom > i.limit : null;
    c("boiler-limit", s ? j(b === null ? null : !b) : "", [
      s ? `${u("boiler.flow.headroom")}: ${b === null ? ne(null) : u(b ? "boiler.flow.over" : "boiler.flow.ok")}` : u("boiler.flow.headroom"),
      s && s.headroom !== null ? `${w} = ${Math.round(s.headroom)} / ${Qn(i.limit)} W` : `${w} ≤ ${Qn(i.limit)} W`
    ]);
  }
  c("boiler-button", s ? j(s.mode === "auto") : "", [
    s ? `${u("boiler.flow.mode")}: ${u(`boiler.mode.${s.mode}`)}` : u("boiler.flow.mode"),
    u("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const h = s ? m$(s, t.now) : null, f = o == null ? void 0 : o.last;
  c("boiler-relay", s ? g$(s) : "", [
    s ? `${u("boiler.flow.relay")}: ${s.relay ?? ne(null)}` : u("boiler.flow.relay"),
    r,
    ...h ? [h] : [],
    ...f ? [mr(f)] : []
  ], f == null ? void 0 : f.error);
  const d = u("boiler.flow.done");
  c(i ? "boiler-nominal" : "boiler-power", s ? j(s.boilerW === null ? null : s.boilerW > 1) : "", [
    s ? `${u("boiler.flow.power")}: ${wa(s.boilerW)}` : u("boiler.flow.power"),
    i ? `${u("boiler.flow.nominal").replace("{w}", Qn(i.nominal))}, ${d}` : d
  ]);
  const p = a - W + F, m = l.slice(1).map((w) => `M${p$} ${w.y - W} V${w.y}`).join(" "), $ = o && o.status !== "ok" ? o.status === "error" && o.reason ? `${u("rules.status.error")}: ${o.reason}` : u(`rules.status.${o.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ni}px`} viewBox=${`0 0 ${Ni} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((w) => We({ x: f$, w: h$, ...w, focused: t.focused === w.field, onClick: () => t.onFocus(w.field) }))}
      </svg>
      ${$ ? g`<p class="fc-warn" data-note="status">${$}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const va = (t) => t.trim() === "" ? NaN : Number(t), $a = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Wo(t, e, n, i, o) {
  const s = e === "" || n.some((r) => r.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(r) => o(r.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? v : g`<option value=${e}>${i}</option>`}
      ${n.map((r) => g`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function w$(t) {
  var s;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: u("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: u("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: u("boiler.problem.grid") });
  const i = [...n], o = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((s = e.grid) == null ? void 0 : s.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !o || r === "boiler" && n.length > 0 || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function v$(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, o = (c) => t.onChange({ ...e, boiler: c }), s = (c) => i && o({ ...n, grid: { ...i, ...c } }), r = (c) => {
    const { grid: h, ...f } = n;
    o(c ? { ...f, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Ru, nominal: Bu } } : f);
  }, l = (c) => {
    var h;
    return ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, a = (c) => {
    var h;
    return c === "" ? u("vent.pick") : ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  };
  return $t({
    prefix: "boiler",
    title: u("boiler.title"),
    hint: u("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: w$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("boiler.device")}</label>
      ${Wo("boiler-device", n.device, t.boilers, l(n.device), (c) => o({ ...n, device: c }))}

      <label class="rlabel">${u("boiler.button")}</label>
      ${Wo("boiler-button", n.button, t.buttons, l(n.button), (c) => o({ ...n, button: c }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(c) => r(c.target.checked)} /> ${u("boiler.limitOn")}</label>
      ${i ? g`
        <label class="rlabel">${u("boiler.grid")}</label>
        ${Wo("boiler-grid", i.block, t.grids, u("boiler.missingGrid"), (c) => s({ block: c }))}
        <div class="vnums">
          <label>${u("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${X($a(i.limit))}
              @input=${(c) => s({ limit: va(c.target.value) })} /></label>
          <label>${u("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${X($a(i.nominal))}
              @input=${(c) => s({ nominal: va(c.target.value) })} /></label>
        </div>` : v}`,
    diagram: b$({
      rule: e,
      deviceName: a,
      gridName: (c) => {
        var h;
        return c === "" ? u("vent.pick") : ((h = t.grids.find((f) => f.id === c)) == null ? void 0 : h.name) ?? u("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Pi = vt, Xe = 2, _d = 20, fn = 24, ya = 220, pn = (Pi - 2 * F - (Xe - 1) * _d) / Xe, mn = Pi / 2;
function $$(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const y$ = (t, e) => t === 1 ? mn - pn / 2 : F + e % Xe * (pn + _d);
function xa(t, e, n, i) {
  const o = Q(Math.max(...e.map((h) => h.lines.length + (h.err ? 1 : 0)))), s = Math.ceil(e.length / Xe), r = (h) => t + h * (o + fn), l = e.map((h, f) => ({ ...h, x: y$(e.length, f), y: r(Math.floor(f / Xe)), w: pn, h: o })), a = (h) => n ? r(h) + o + (h === s - 1 ? W : fn) / 2 : r(h) - (h === 0 ? W : fn) / 2, c = [];
  for (let h = 0; h < s; h++) {
    const f = l.slice(h * Xe, (h + 1) * Xe);
    for (const p of f) c.push(`M${p.x + pn / 2} ${n ? p.y + o : p.y} V${a(h)}`);
    const d = [mn, ...f.map((p) => p.x + pn / 2)];
    Math.max(...d) > Math.min(...d) && c.push(`M${Math.min(...d)} ${a(h)} H${Math.max(...d)}`);
  }
  return c.push(n ? `M${mn} ${a(0)} V${i}` : `M${mn} ${i} V${a(s - 1)}`), { blocks: l, bottom: r(s - 1) + o, links: c.join(" ") };
}
function x$(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, o = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [u("leak.flow.addSensor")] }] : e.sensors.map((y, x) => {
    const M = n == null ? void 0 : n.inputs[x];
    return { field: `leak-sensor:${y}`, cls: M ? j(M.value) : "", lines: [t.deviceName(y), M ? M.detail : u("device.leak_sensor")] };
  }), s = (y) => {
    var x, M;
    return ((M = (x = n == null ? void 0 : n.leak) == null ? void 0 : x.valves.find((k) => k.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => s(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [u("leak.flow.addValve")] }] : e.valves.map((y) => {
    var L;
    const x = (L = n == null ? void 0 : n.leak) == null ? void 0 : L.valves.find((E) => E.id === y), M = t.deviceName(y), k = (x == null ? void 0 : x.state) ?? null, _ = y === r ? i : void 0, C = _ ? (_.reason === "re-closed: leak" ? u("leak.flow.reclosed") : u("vent.flow.last").replace("{did}", u(`rules.did.${_.action}`))).replace("{at}", ye(_.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? k === "closed" ? j(!0) : k === "open" ? "" : j(null) : "",
      lines: [M, n ? k === null ? ne(null) : u(`leak.state.${k}`) : u("leak.flow.close"), ...C ? [C] : []],
      err: _ == null ? void 0 : _.error
    };
  }), a = Q(2), c = Q(Math.max(...o.map((y) => y.lines.length))), h = F + Math.ceil(o.length / Xe) * (c + fn) - fn + W, f = xa(F, o, !0, h), d = xa(h + a + W, l, !1, h + a), p = {
    x: mn - ya / 2,
    y: h,
    w: ya,
    h: a,
    field: "leak",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("leak.flow.leak")}: ${n.verdict === null ? ne(null) : u(n.verdict ? "leak.yes" : "leak.no")}` : u("leak.flow.leak"), u("leak.flow.any")]
  }, m = d.bottom + F, $ = `${f.links} ${d.links}`, w = (y) => We({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), b = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Pi}px`} viewBox=${`0 0 ${Pi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("leak.flow.title")}>
        ${A`<path class="fc-link" d=${$}></path>`}
        ${f.blocks.map(w)}${w(p)}${d.blocks.map(w)}
      </svg>
      ${b ? g`<p class="fc-warn" data-note="status">${b}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function Ti(t, e, n, i, o, s, r) {
  const l = (c) => {
    var h;
    return ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, a = t.draft.focused;
  return g`
    <div class="rsources" data-group=${e}>
      ${i.map((c) => g`
        <span class="rchip${o.some((h) => h.id === c) ? "" : " bad"}${a === `${n}:${c}` ? " hl" : ""}"
          data-id=${c}>${l(c)}
          <button class="btn" data-action="remove" title=${u("leak.remove")}
            @click=${() => r(i.filter((h) => h !== c))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(c) => {
    const h = c.target, f = h.value;
    h.value = "", f && r([...i, f]);
  }}>
        <option value="">${s}</option>
        ${o.filter((c) => !i.includes(c.id)).map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
    </div>`;
}
function k$(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: u("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: u("leak.problem.valves") });
  const i = [...n];
  for (const o of t.problems)
    o === "leak" && n.length > 0 || i.push({ key: o, text: u(`rules.problem.${o}`) });
  return i;
}
function M$(t) {
  const e = t.draft.rule, n = e.leak;
  return $t({
    prefix: "leak",
    title: u("leak.title"),
    hint: u("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: k$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("leak.sensors")}</label>
      ${Ti(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, u("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${u("leak.valves")}</label>
      ${Ti(t, "leak-valves", "leak-valve", n.valves, t.valves, u("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: x$({
      rule: e,
      deviceName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? u("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Hi = vt, _$ = Hi - 2 * F, A$ = Hi / 2;
function S$(t) {
  const e = ye(t.at);
  return Hn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === ed ? u("timed.flow.elsewhere") : u("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function L$(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, o = [];
  let s = F;
  const r = (p, m, $, w) => {
    const b = Q($.length + (w ? 1 : 0));
    o.push({ y: s, h: b, field: p, cls: m, lines: $, err: w }), s += b + W;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? u("timed.flow.events")]);
  const l = u(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Vn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? u("timed.flow.running").replace("{t}", ge(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : u("timed.flow.runningNow") : u("timed.flow.idle") : u("timed.flow.run");
  r("timed-minutes", i ? j(i.running) : n ? j(n.verdict) : "", [a, l]);
  const c = n == null ? void 0 : n.last;
  r("timed-device", i ? j(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? u("timed.flow.state").replace("{s}", i.device ?? ne(null)) : u(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...c ? [S$(c)] : []
  ], c == null ? void 0 : c.error);
  const h = s - W + F, f = o.slice(1).map((p) => `M${A$} ${p.y - W} V${p.y}`).join(" "), d = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Hi}px`} viewBox=${`0 0 ${Hi} ${h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("timed.flow.title")}>
        <path class="fc-link" d=${f}></path>
        ${o.map((p) => We({ x: F, w: _$, ...p, focused: t.focused === p.field, onClick: () => t.onFocus(p.field) }))}
      </svg>
      ${d ? g`<p class="fc-warn" data-note="status">${d}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const ka = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function C$(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? u("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${u("timed.events.start").replace("{e}", ka(e.on))}, ${e.separateOff ? u("timed.events.stop").replace("{e}", ka(e.off)) : u("timed.events.noStop")}`;
}
const I$ = (t) => t.trim() === "" ? NaN : Number(t);
function Ma(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? v : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function E$(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: u("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: u("timed.problem.device") });
  const i = [...n], o = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), s = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !o || r === "timed" && n.length > 0 && s || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function D$(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), o = C$(t.deviceById(n.button)), s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return $t({
    prefix: "timed",
    title: u("timed.title"),
    hint: u("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: E$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("timed.button")}</label>
      ${Ma("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${o ? g`<p class="muted" data-note="events">${o}</p>` : v}

      <label class="rlabel">${u("timed.device")}</label>
      ${Ma("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${u("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${X(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: I$(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${u("timed.invert")}</label>`,
    diagram: L$({
      rule: e,
      deviceName: s,
      events: o,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const O$ = { "outside-wants": "outside-sensor" }, Vi = vt, tn = Vi - 2 * F, jo = Vi / 2, ui = 16, N$ = { 1: [tn], 2: [(tn - ui) / 2, (tn - ui) / 2], 3: [176, 116, tn - 176 - 116 - 2 * ui] }, xs = (t, e) => t !== void 0 ? ge(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function P$(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), o = i ? i[1] : t.detail, s = t.daylight === null && o === u("daylight.noData") ? [] : [o];
  return i && s.push(`${i[2]} in ${xs(t.until, n) ?? ge(0)}`), t.daylight === null && e && s.push(u("outside.flow.countsNight")), s;
}
function kr(t) {
  const e = ye(t.at);
  return Hn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : nd(t) ? u("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? u("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function T$(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, o = e.window, s = [{
    field: "outside-sensor",
    cls: i ? j(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${u("outside.flow.daylight")}: ${u(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...P$(i, e.noDataNight === !0, t.now)] : [u("outside.flow.daylight"), t.deviceName(e.sensor), u(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && s.push({
    field: "outside-sunset",
    cls: i ? j(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${u("outside.flow.sun")}: ${i.sun === null ? ne(null) : u(`outside.sun.${i.sun}`)}` : u("outside.flow.sun"), u("outside.flow.afterSunset")]
  }), o) {
    const L = `${o.from}-${o.to}`, E = i && i.window !== null ? xs(i.windowUntil, t.now) : null;
    s.push({
      field: "outside-window",
      cls: i ? j(i.window) : "",
      lines: i ? [
        i.window === null ? `${u("outside.flow.window")}: ${ne(null)}` : u(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        L,
        ...E ? [u(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", E)] : []
      ] : [u("outside.flow.window"), L]
    });
  }
  const r = [], l = N$[s.length], a = Q(Math.max(...s.map((L) => L.lines.length)));
  let c = F;
  for (const [L, E] of s.entries())
    r.push({ ...E, x: c, y: F, w: l[L], h: a }), c += l[L] + ui;
  let h = F + a + W;
  const f = (L) => {
    const E = Q(L.lines.length + (L.err ? 1 : 0));
    r.push({ ...L, x: F, y: h, w: tn, h: E }), h += E + W;
  }, d = u("outside.flow.rule").replace("{sun}", e.afterSunset ? u("outside.flow.ruleSun") : "").replace("{window}", o ? u("outside.flow.ruleWindow") : "");
  f({
    field: "outside-wants",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("outside.flow.wants")}: ${n.verdict === null ? ne(null) : n.verdict ? "on" : "off"}` : u("outside.flow.wants"), d]
  });
  const p = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? xs(i.pausedUntil, t.now) : null;
  f(e.pause === 0 ? { field: "outside-pause", cls: i ? j(!0) : "", lines: [u("outside.flow.never"), u("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? j(p === null) : "",
    lines: [
      i ? p !== null ? u("outside.flow.paused").replace("{t}", p) : u("outside.flow.noPause") : u("outside.flow.pause"),
      u("outside.flow.after").replace("{d}", Vn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, $ = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ne(null)) : u("outside.flow.onOff"),
    ...m ? [kr(m)] : []
  ];
  f({
    field: "outside-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: $,
    err: m == null ? void 0 : m.error,
    tip: m ? [...$, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const w = h - W + F, b = r.find((L) => L.field === "outside-wants"), y = F + a + W / 2, x = r.slice(0, s.length), M = [jo, ...x.map((L) => L.x + L.w / 2)], k = [
    ...x.map((L) => `M${L.x + L.w / 2} ${F + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${jo} ${y} V${b.y}`,
    ...r.slice(s.length + 1).map((L) => `M${jo} ${L.y - W} V${L.y}`)
  ].join(" "), _ = (L) => We({ ...L, focused: t.focused === L.field, onClick: () => t.onFocus(L.field) }), C = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Vi}px`} viewBox=${`0 0 ${Vi} ${w}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("outside.flow.title")}>
        ${A`<path class="fc-link" d=${k}></path>`}
        ${r.map(_)}
      </svg>
      ${C ? g`<p class="fc-warn" data-note="status">${C}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const H$ = { from: "17:00", to: "01:00" }, Mr = (t) => t.trim() === "" ? NaN : Number(t);
function En(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? v : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function _a(t, e, n, i, o) {
  return g`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(s) => {
    const { [e]: r, ...l } = n;
    o(s.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function V$(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: u("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: u("outside.problem.sensor") });
  const i = [...n], o = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), s = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !o || l === "outside" && n.length > 0 && s && r || i.push({ key: l, text: u(`rules.problem.${l}`) });
  return i;
}
function z$(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), o = n.window, s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return $t({
    prefix: "outside",
    title: u("outside.title"),
    hint: u("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: V$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("outside.light")}</label>
      ${En("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${u("outside.sensor")}</label>
      ${En("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${_a("outside-nodata", "noDataNight", n, u("outside.noDataNight"), i)}
      ${_a("outside-sunset", "afterSunset", n, u("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${o !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...H$ } } : a);
    }} /> ${u("outside.window")}</label>
      ${o ? g`
        <div class="vnums">
          <label>${u("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${X(o.from)}
              @input=${(r) => i({ ...n, window: { ...o, from: r.target.value } })} /></label>
          <label>${u("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${X(o.to)}
              @input=${(r) => i({ ...n, window: { ...o, to: r.target.value } })} /></label>
        </div>` : v}

      <div class="vnums">
        <label>${u("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${X(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: Mr(r.target.value) })} /></label>
        <span class="muted">${u("outside.pauseNote")}</span>
      </div>`,
    diagram: T$({
      rule: e,
      deviceName: s,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const R$ = { "beurer-wants": "beurer-above" }, zi = vt, B$ = zi - 2 * F, F$ = zi / 2, Jn = (t, e) => ge(Math.max(0, Math.ceil((t - e) / 1e3)));
function U$(t) {
  var b;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, o = [];
  let s = F;
  const r = (y, x, M, k, _) => {
    const C = Q(M.length + (k ? 1 : 0));
    o.push({ y: s, h: C, field: y, cls: x, lines: M, err: k, tip: _ }), s += C + W;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? u("beurer.flow.kept").replace("{t}", Jn(i.keptUntil, t.now)) : u("beurer.flow.noData") : u("beurer.source");
  r(
    "beurer-source",
    i ? j(i.watts !== null ? i.watts > e.above : l ? ((b = n.inputs[0]) == null ? void 0 : b.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const c = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? j(n.verdict) : "", [
    n ? `${u("beurer.flow.wants")}: ${n.verdict === null ? ne(null) : n.verdict ? "on" : "off"}` : u("beurer.flow.wants"),
    u("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", ge(t.rule.offDelay)),
    ...c ? [u("rules.flow.pending").replace("{to}", c.to ? "on" : "off").replace("{t}", Jn(c.at, t.now))] : []
  ]);
  const h = (n == null ? void 0 : n.verdict) === !0, f = e.every === 0 ? u("beurer.flow.never") : i && !h ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? u("beurer.flow.now").replace("{t}", Jn(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? u("beurer.flow.next").replace("{t}", Jn(i.cycleAt, t.now)) : i && h && i.heater === "on" && !i.fresh ? u("beurer.flow.due") : i ? "—" : Vn(e.every * 60);
  r("beurer-every", i ? j(i.pausedUntil !== void 0 ? !1 : h ? !0 : null) : "", [u("beurer.flow.repower"), f]);
  const d = n == null ? void 0 : n.last, p = [
    t.deviceName(e.heater),
    i ? u("timed.flow.state").replace("{s}", i.heater ?? ne(null)) : u("outside.flow.onOff"),
    ...d ? [kr(d)] : []
  ];
  r(
    "beurer-heater",
    i ? j(i.heater === null ? null : i.heater === "on") : "",
    p,
    d == null ? void 0 : d.error,
    d ? [...p, ...d.error ? [d.error] : [], d.reason].join(`
`) : void 0
  );
  const m = s - W + F, $ = o.slice(1).map((y) => `M${F$} ${y.y - W} V${y.y}`).join(" "), w = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${zi}px`} viewBox=${`0 0 ${zi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("beurer.flow.title")}>
        ${A`<path class="fc-link" d=${$}></path>`}
        ${o.map((y) => We({ x: F, w: B$, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${w ? g`<p class="fc-warn" data-note="status">${w}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function W$(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: u("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: u("beurer.problem.source") });
  const o = [...i], s = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !s || l === "beurer" && i.length > 0 && r || o.push({ key: l, text: u(`rules.problem.${l}`) });
  return o;
}
function j$(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  }, s = (r, l, a, c, h, f, d) => g`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${c} max=${h} step="1"
          .value=${X(Number.isFinite(a) ? String(a) : "")}
          @input=${(p) => f(Mr(p.target.value))} /></label>
      ${d ? g`<span class="muted">${d}</span>` : ""}
    </div>`;
  return $t({
    prefix: "beurer",
    title: u("beurer.title"),
    hint: u("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: W$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("beurer.heater")}</label>
      ${En("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${u("beurer.source")}</label>
      ${En("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${s("above", u("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${s("off", u("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${s("keep", u("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${s("every", u("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), u("beurer.everyNote"))}`,
    diagram: U$({
      rule: e,
      deviceName: o,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const q$ = { "motionlight-wants": "motionlight-off", "motionlight-mode": "motionlight-buttons" };
function Z$(t) {
  return t.startsWith("motionlight-sensor:") ? "motionlight-sensors" : q$[t] ?? t;
}
const Ri = vt, Aa = Ri - 2 * F, Sa = Ri / 2, qo = 12, G$ = 3, K$ = {
  auto: "lastAuto",
  autoAgain: "lastAutoAgain",
  manualButton: "lastManualButton",
  releasedOff: "lastReleased",
  found: "lastFound",
  autoOff: "lastAutoOff",
  autoOffLight: "lastAutoOffLight",
  autoOn: "lastAutoOn"
}, X$ = (t) => {
  const e = td(t);
  return e ? u(`motionLight.flow.${K$[e]}`).replace("{at}", ye(t.at)).replace("{s}", t.action) : kr(t);
}, Zo = (t, e) => ge(Math.max(0, Math.ceil((t - e) / 1e3)));
function Y$(t) {
  var L;
  const e = t.rule.motionLight, n = t.trace, i = n == null ? void 0 : n.motionLight, o = e.daylight, s = e.sensors.length === 0 ? [{ field: "motionlight-sensors", cls: " muted", lines: [u("motionLight.flow.noSensors")] }] : e.sensors.map((E) => {
    const H = i == null ? void 0 : i.sensors.find((I) => I.id === E);
    return {
      field: `motionlight-sensor:${E}`,
      cls: i ? j((H == null ? void 0 : H.state) === void 0 || H.state === null ? null : H.state === "on") : "",
      lines: [t.deviceName(E), i ? (H == null ? void 0 : H.state) === "on" ? u("motionLight.flow.motion") : (H == null ? void 0 : H.state) === "off" ? u("motionLight.flow.clear") : u("motionLight.flow.noData") : u("device.motion_sensor")]
    };
  });
  if (o) {
    const E = i != null && i.daylight ? ((L = /^(.*?) \(.+ in [\d:]+\)$/.exec(i.daylight.detail)) == null ? void 0 : L[1]) ?? i.daylight.detail : "";
    s.push({
      field: "motionlight-daylight",
      cls: i ? j(i.dark) : "",
      lines: i != null && i.daylight ? [`${u("motionLight.flow.daylight")}: ${i.daylight.state ?? u("motionLight.flow.noData")}`, t.deviceName(o.sensor), ...E ? [E] : []] : [u("motionLight.flow.daylight"), t.deviceName(o.sensor), u(o.is === "night" ? "motionLight.isNight" : "motionLight.isDark")],
      tip: i != null && i.daylight ? [u("motionLight.flow.daylight"), t.deviceName(o.sensor), i.daylight.detail].join(`
`) : void 0
    });
  }
  const r = e.sensors.length === 0 ? 1 : Math.min(G$, s.length), l = (Aa - (r - 1) * qo) / r, a = Math.ceil(s.length / r), c = Q(Math.max(...s.map((E) => E.lines.length))), h = r === 3 ? F + l + qo / 2 : Sa, f = s.map((E, H) => ({ ...E, x: F + H % r * (l + qo), y: F + Math.floor(H / r) * (c + W), w: l, h: c })), d = [];
  for (let E = 0; E < a; E++) {
    const H = f.slice(E * r, (E + 1) * r), I = H[0].y + c + W / 2;
    for (const T of H) d.push(`M${T.x + l / 2} ${T.y + c} V${I}`);
    const O = [h, ...H.map((T) => T.x + l / 2)];
    Math.max(...O) > Math.min(...O) && d.push(`M${Math.min(...O)} ${I} H${Math.max(...O)}`);
  }
  const p = F + a * (c + W);
  let m = p;
  d.push(`M${h} ${F + c + W / 2} V${p}`);
  const $ = (E) => {
    const H = Q(E.lines.length + (E.err ? 1 : 0));
    f.push({ ...E, x: F, y: m, w: Aa, h: H }), m > p && d.push(`M${Sa} ${m - W} V${m}`), m += H + W;
  }, w = u("motionLight.flow.rule").replace("{dark}", o ? u("motionLight.flow.ruleDark") : "").replace("{d}", ge(t.rule.offDelay)) + (e.minOn > 0 ? u("motionLight.flow.ruleMin").replace("{d}", ge(e.minOn)) : ""), b = (i == null ? void 0 : i.mode) === "manual", y = b || e.sensors.length === 0;
  $({
    field: "motionlight-wants",
    cls: i && !y ? j(n.verdict) : "",
    lines: [
      i && !y ? `${u("motionLight.flow.wants")}: ${n.verdict === null ? ne(null) : n.verdict ? "on" : "off"}` : u("motionLight.flow.wants"),
      w,
      ...(i == null ? void 0 : i.offAt) !== void 0 && !y ? [u("motionLight.flow.offIn").replace("{t}", Zo(i.offAt, t.now))] : [],
      ...(i == null ? void 0 : i.minUntil) !== void 0 && !y ? [u("motionLight.flow.minOn").replace("{t}", Zo(i.minUntil, t.now))] : [],
      ...i != null && i.waiting && !y ? [u("motionLight.flow.waiting")] : []
    ]
  }), $({
    field: "motionlight-mode",
    cls: i ? j(!b) : "",
    lines: i ? [
      `${u("motionLight.flow.mode")}: ${u(b ? "motionLight.flow.manual" : e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.auto")}`,
      ...b ? [i.autoAt !== void 0 ? u("motionLight.flow.autoIn").replace("{t}", Zo(i.autoAt, t.now)) : u("motionLight.flow.byButton")] : []
    ] : [u("motionLight.flow.mode"), u(e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.byButton")]
  });
  const x = n == null ? void 0 : n.last, M = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ne(null)) : u("outside.flow.onOff"),
    ...x ? [X$(x)] : []
  ];
  $({
    field: "motionlight-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: M,
    err: x == null ? void 0 : x.error,
    tip: x ? [...M, ...x.error ? [x.error] : [], x.reason].join(`
`) : void 0
  });
  const k = m - W + F, _ = (E) => We({ ...E, focused: t.focused === E.field, onClick: () => t.onFocus(E.field) }), C = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ri}px`} viewBox=${`0 0 ${Ri} ${k}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("motionLight.flow.title")}>
        ${A`<path class="fc-link" d=${d.join(" ")}></path>`}
        ${f.map(_)}
      </svg>
      ${C ? g`<p class="fc-warn" data-note="status">${C}</p>` : v}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function Q$(t) {
  const e = t.draft.rule, n = e.motionLight, i = [];
  n.light || i.push({ key: "pick-light", text: u("motionLight.problem.light") });
  const o = [...i], s = n.light && !t.lights.some((l) => l.id === n.light) || n.sensors.some((l) => !t.sensors.some((a) => a.id === l)) || n.buttons.some((l) => !t.buttons.some((a) => a.id === l)) || n.daylight && !t.daylightSensors.some((l) => l.id === n.daylight.sensor), r = !n.sensors.includes(n.light) && !n.buttons.includes(n.light) && [n.minOn, n.autoAfter].every(Number.isInteger) && n.minOn >= 0 && n.minOn <= 3600 && n.autoAfter >= 0 && n.autoAfter <= 1440;
  for (const l of t.problems)
    l === "device-missing" && !s || l === "motionLight" && i.length > 0 && r || o.push({ key: l, text: u(`rules.problem.${l}`) });
  return o;
}
function J$(t) {
  const e = t.draft.rule, n = e.motionLight, i = (c) => t.onChange({ ...e, motionLight: c }), o = (c) => {
    var h;
    return c === "" ? u("vent.pick") : ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, s = (c, h, f, d, p, m, $) => g`
    <div class="vnums">
      <label>${h}
        <input class="num" data-field=${`motionlight-${c}`} type="number" min=${d} max=${p} step="1"
          .value=${X(Number.isFinite(f) ? String(f) : "")}
          @input=${(w) => m(Mr(w.target.value))} /></label>
      ${$ ? g`<span class="muted">${$}</span>` : v}
    </div>`, r = n.buttons.length > 0 && n.autoAfter === 0 && !n.buttons.some((c) => {
    const h = t.buttons.find((f) => f.id === c);
    return !!h && zu(h);
  }), l = n.daylight, a = !l || t.daylightSensors.some((c) => c.id === l.sensor);
  return $t({
    prefix: "motionlight",
    title: u("motionLight.title"),
    hint: u("motionLight.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Q$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("motionLight.light")}</label>
      ${En("motionlight-light", n.light, t.lights, (c) => i({ ...n, light: c }))}

      <label class="rlabel">${u("motionLight.buttons")}</label>
      ${Ti(t, "motionlight-buttons", "motionlight-button", n.buttons, t.buttons.filter((c) => c.id !== n.light), u("motionLight.addButton"), (c) => i({ ...n, buttons: c, ...c.length === 0 ? { autoAfter: 0 } : {} }))}
      <span class="muted">${u("motionLight.buttonsNote")}</span>

      <label class="rlabel">${u("motionLight.sensors")}</label>
      ${Ti(t, "motionlight-sensors", "motionlight-sensor", n.sensors, t.sensors, u("motionLight.addSensor"), (c) => i({ ...n, sensors: c }))}
      <span class="muted">${u("motionLight.sensorsNote")}</span>

      <label class="rlabel">${u("motionLight.daylight")}</label>
      <div class="vnums">
        <select data-field="motionlight-daylight" data-value=${(l == null ? void 0 : l.sensor) ?? ""}
          @change=${(c) => {
      const h = c.target.value, { daylight: f, ...d } = n;
      i(h === "" ? d : { ...d, daylight: { sensor: h, is: (l == null ? void 0 : l.is) ?? "dark" } });
    }}>
          <option value="">${u("motionLight.noDaylight")}</option>
          ${a ? v : g`<option value=${l.sensor}>${u("rules.missingDevice")}</option>`}
          ${t.daylightSensors.map((c) => g`<option value=${c.id}>${c.name}</option>`)}
        </select>
        ${l ? g`
          <select data-field="motionlight-is" data-value=${l.is}
            @change=${(c) => i({ ...n, daylight: { ...l, is: c.target.value } })}>
            <option value="night">${u("motionLight.isNight")}</option>
            <option value="dark">${u("motionLight.isDark")}</option>
          </select>` : v}
      </div>

      ${s("off", u("motionLight.off"), e.offDelay, 0, Ai, (c) => t.onChange({ ...e, offDelay: c }), u("motionLight.offNote"))}
      ${s("minon", u("motionLight.minOn"), n.minOn, 0, 3600, (c) => i({ ...n, minOn: c }))}

      ${n.buttons.length > 0 ? s("autoafter", u("motionLight.autoAfter"), n.autoAfter, 0, 1440, (c) => i({ ...n, autoAfter: c }), u("motionLight.autoAfterNote")) : v}
      ${r ? g`<p class="muted" data-note="motionlight-noauto">${u("motionLight.noAutoNote")}</p>` : v}`,
    diagram: Y$({
      rule: e,
      deviceName: o,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
function ey(t) {
  return t === "event" ? "control-source-0" : `control-${t.endsWith(":empty") ? t.slice(0, -6) : t.replace(":", "-")}`;
}
const Ad = 20, kt = (fe - 2 * F - 2 * Ad) / 3, ty = ["on", "off", "toggle"], ny = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" }, iy = (t) => t.error ? u("control.flow.notSent").replace("{at}", ye(t.at)) : Hn(t) || t.sent !== !1 ? mr(t) : pr(t);
function oy(t) {
  const { rule: e, trace: n } = t, i = e.control, o = i.sources.length, s = n && n.inputs.length === o ? n.inputs : null, r = n == null ? void 0 : n.control, l = r == null ? void 0 : r.event, a = Q(s ? 3 : 2), c = Q(l != null && l.dropped ? 3 : 2), h = wd(o, a), f = o === 0 ? F : h.bottom + W, d = f + c + W, p = e.gate ? d + Q(2) : f + c, m = p + W / 2, $ = p + W, w = $ + pd, b = (I) => F + I * (kt + Ad), y = [...h.links];
  o > 0 && y.push(`M${xe} ${h.busY(0)} V${f}`), e.gate && y.push(`M${xe} ${f + c} V${d}`), y.push(`M${xe} ${p} V${m} H${b(0) + kt / 2} V${$}`, `M${xe} ${m} H${b(2) + kt / 2} V${$}`, `M${xe} ${m} V${$}`);
  const x = (I) => We({ ...I, focused: t.focused === I.field, onClick: () => t.onFocus(I.field) }), M = [
    u("control.flow.event"),
    l ? u("control.flow.eventLine").replace("{source}", l.source).replace("{what}", u(`control.do.${l.what}`)).replace("{at}", ye(l.at)) : u("control.flow.noEvent"),
    ...l != null && l.dropped ? [u("control.flow.dropped")] : []
  ], k = (I) => {
    var O;
    return (O = r == null ? void 0 : r.devices.find((T) => T.id === I)) == null ? void 0 : O.state;
  }, _ = n == null ? void 0 : n.last, C = (I, O) => _ && l && !l.dropped && l.what === I && _.target === t.nameOf(O.device) ? _ : void 0, L = (I, O, T, B, D) => {
    const U = k(O.device), he = C(I, O), st = [t.nameOf(O.device), u(`control.do.${O.do}`), ...r ? [u("control.flow.now").replace("{s}", U ?? u("control.flow.noData"))] : [], ...he ? [iy(he)] : []], zn = Q(st.length + (he != null && he.error ? 1 : 0));
    return { svg: x({ x: B, y: D, w: kt, h: zn, field: `${I}:${T}`, cls: r ? j(U == null ? null : U === "on" || U === "open") : "", lines: st, err: he == null ? void 0 : he.error }), h: zn };
  }, E = ty.map((I, O) => {
    const T = i[I], B = b(O), D = A`<text class="fc-head" text-anchor="middle" x=${B + kt / 2} y=${$ + 14}>${u(ny[I])}</text>`;
    if (T.length === 0) {
      const st = Q(1);
      return { bottom: w + st, body: A`${D}${x({ x: B, y: w, w: kt, h: st, field: `${I}:empty`, cls: " muted", lines: [u("control.flow.nothing")] })}` };
    }
    let U = w;
    const he = T.map((st, zn) => {
      const Sr = L(I, st, zn, B, U);
      return U += Sr.h + dn, Sr.svg;
    });
    return { bottom: U - dn, body: A`${D}${he}` };
  }), H = Math.max(...E.map((I) => I.bottom)) + F;
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * ud}px`} viewBox=${`0 0 ${fe} ${H}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("control.flow.title")}>
        ${y.map((I) => A`<path class="fc-link" d=${I}></path>`)}
        ${i.sources.map((I, O) => {
    const T = s == null ? void 0 : s[O], B = T && T.detail !== "" && "source" in I ? md(T, t.now, I.source) : T == null ? void 0 : T.detail, D = u("control.gives").replace("{what}", (T == null ? void 0 : T.gives) ?? t.gives(I));
    return x({
      x: h.xs[O],
      y: h.inY(O),
      w: Je,
      h: a,
      field: `source:${O}`,
      cls: T && !et(I) ? j(T.value) : "",
      lines: [`${"not" in I && I.not ? "NOT " : ""}${(T == null ? void 0 : T.label) ?? t.sourceLabel(I)}`, ...B ? [B] : [], D]
    });
  })}
        ${x({
    x: (fe - Ke) / 2,
    y: f,
    w: Ke,
    h: c,
    field: "event",
    cls: l != null && l.dropped ? " nodata" : "",
    lines: M
  })}
        ${e.gate ? x({
    x: (fe - Ke) / 2,
    y: d,
    w: Ke,
    h: Q(2),
    field: "gate",
    cls: n != null && n.gate ? j(n.gate.value) : "",
    lines: bd(e.gate, t.sourceLabel(e.gate), n == null ? void 0 : n.gate, t.now)
  }) : v}
        ${E.map((I) => I.body)}
      </svg>
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const Sd = ["on", "off", "toggle"], sy = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" };
function Ld(t, e) {
  var i;
  if (!et(e)) return "on / off";
  const n = (i = t.deviceById(e.button)) == null ? void 0 : i.props;
  return (n == null ? void 0 : n.kind) === "smart_button" && n.separateOff ? "on / off" : "toggle";
}
function ry(t, e, n, i) {
  const o = `control-source-${n}`, s = g`<span class="muted" data-part="gives">${u("control.gives").replace("{what}", Ld(t, e))}</span>`;
  if (!et(e)) return $r(t, e, o, i, s);
  const r = t.deviceById(e.button);
  return g`
    <div class="rline${(r == null ? void 0 : r.props.kind) === "smart_button" ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${(r == null ? void 0 : r.name) ?? u("rules.missingDevice")}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
}
function ly(t) {
  const e = t.draft.rule.control, n = [];
  return e.sources.length === 0 && n.push({ key: "pick-sources", text: u("control.problem.sources") }), Sd.every((i) => e[i].length === 0) && n.push({ key: "pick-actions", text: u("control.problem.actions") }), [...n, ...t.problems.filter((i) => i !== "control" || n.length === 0).map((i) => ({ key: i, text: u(`rules.problem.${i}`) }))];
}
function ay(t) {
  const e = t.draft.rule, n = e.control, i = (c) => t.onChange({ ...e, control: { ...n, sources: c } }), o = (c) => {
    var h;
    return ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, s = t.buttons.filter((c) => !n.sources.some((h) => et(h) && h.button === c.id)), r = s.length > 0 ? g`<optgroup label=${u("control.group.buttons")}>
      ${s.map((c) => g`<option value=${`b:${c.id}`}>${c.name}</option>`)}
    </optgroup>` : void 0, l = (c) => {
    const h = c.target;
    if (!h.value.startsWith("b:")) {
      yr(t, (d) => i([...n.sources, { source: d }]))(c);
      return;
    }
    const f = h.value.slice(2);
    h.value = "", i([...n.sources, { button: f }]);
  }, a = g`
    <div class="rsettings">
      <p class="muted">${u("control.hint")}</p>
      ${kd(t)}

      <div class="rgroup">
        <div class="rlabel">${u("control.sources")}</div>
        ${n.sources.map((c, h) => ry(
    t,
    c,
    h,
    (f) => i(f ? n.sources.map((d, p) => p === h ? f : d) : n.sources.filter((d, p) => p !== h))
  ))}
        <select class="radd" data-action="add-source" .value=${""} @change=${l}>
          ${vr(t, u("control.addSource"), r)}
        </select>
      </div>

      ${xd(t, u("control.gate"), "control-gate", u("control.gateNote"))}

      ${Sd.map((c) => yd(t, {
    label: u(sy[c]),
    addText: u("control.addAction"),
    add: `add-action-${c}`,
    addField: `control-${c}`,
    field: (h) => `control-${c}-${h}`,
    list: n[c],
    set: (h) => t.onChange({ ...e, control: { ...n, [c]: h } }),
    actionsFor: an,
    firstDo: (h) => an(h).includes(c) ? c : an(h)[0],
    doText: (h) => u(`control.do.${h}`),
    unique: !0
  }))}
    </div>`;
  return Md({
    title: u("control.title"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: ly(t),
    form: a,
    diagram: oy({
      rule: e,
      trace: t.trace,
      note: t.note,
      now: t.now,
      nameOf: o,
      sourceLabel: (c) => et(c) ? o(c.button) : wr(t, c),
      gives: (c) => Ld(t, c),
      focused: t.draft.focused,
      onFocus: t.onFocus
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
const cy = ["power", "voltage", "power_in", "power_out", "control"], uy = 300;
function La(t) {
  t().catch(() => {
  });
}
function dy(t, e) {
  var o;
  const n = new Map(e.devices.map((s) => [s.id, s])), i = {};
  for (const s of t.blocks) {
    const r = s.kind === "device" ? n.get(s.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Bt(r), controllable: pc(r) };
    for (const a of cy) {
      const c = (o = r.bindings) == null ? void 0 : o[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class hy {
  constructor(e, n) {
    this.host = e, this.connection = n, this.planId = null, this.payload = null, this.json = "", this.sub = null, this.current = null, this.failure = null, this.conn = null, this.offline = !1, this.retryTimer = null, this.retries = 0, this.debounceTimer = null, this.onDisconnected = () => {
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
  watch(e, n) {
    if (e === null || n === null) {
      this.stop();
      return;
    }
    const i = JSON.stringify(n);
    if (e === this.planId) {
      if (i === this.json) return;
      this.payload = n, this.json = i, this.cancelDebounce(), this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null, this.restart();
      }, uy);
      return;
    }
    this.stop(), this.planId = e, this.payload = n, this.json = i, this.start();
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
  async setPosition(e, n) {
    const i = this.connection();
    !i || this.planId === null || await i.sendMessagePromise({ type: "plan_studio/power/set_position", plan_id: this.planId, block_id: e, position: n });
  }
  start() {
    var n, i;
    const e = this.connection();
    if (!(e != null && e.subscribeMessage)) {
      this.setFailure(u("output.noLive"));
      return;
    }
    this.conn = e, (n = e.addEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e.addEventListener) == null || i.call(e, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady);
  }
  /** Replaces the subscription with one for the latest payload, with a fresh run of retries; the frame stays. */
  restart() {
    this.cancelRetry(), this.cancelDebounce(), this.retries = 0, this.drop(!0), this.subscribe();
  }
  /** Ends the current subscription: its frames are ignored from now on; `unsubscribe` also tells the server. */
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && La(n.unsub));
  }
  subscribe() {
    const { conn: e, planId: n, payload: i } = this;
    if (!(e != null && e.subscribeMessage) || n === null || i === null || this.offline) return;
    const o = { live: !0, unsub: null };
    this.sub = o, e.subscribeMessage(
      (s) => {
        o.live && (this.current = s, this.host.requestUpdate());
      },
      { type: "plan_studio/power/subscribe", plan_id: n, power: i.power, devices: i.devices },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!o.live) {
          La(s);
          return;
        }
        o.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        o.live && (o.live = !1, this.sub = null, this.current = null, this.setFailure(Le(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= rd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, sd));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  cancelDebounce() {
    this.debounceTimer !== null && clearTimeout(this.debounceTimer), this.debounceTimer = null;
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
const Go = 1e4, Ca = 400, fy = 1e3, Ia = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), py = ["timer", "power"], my = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Cd(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], o = (s, r, l = !1) => {
    s && !i.some((a) => a.entity === s) && i.push({ entity: s, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: s } of Oe(t)) (s === "on" || s === "off" || s === "auto") && o(e[s], !1);
  else n === "wall_switch" ? o(e.state, !0) : n === "valve" && o(e.state, !0, !0);
  return i;
}
function gy(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function by(t, e, n) {
  var i;
  if (t.settled) {
    const o = gy(e.state, t.valve);
    return o === void 0 ? {} : { value: o, text: n && n.last !== o ? o : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (Ia.has(e.state)) return {};
    const o = (i = e.attributes) == null ? void 0 : i.event_type, s = n && n.last !== e.state && typeof o == "string" && o !== "";
    return { value: e.state, text: s ? o : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !Ia.has(e.state) ? e.state : void 0 };
}
function Ea(t, e, n, i) {
  const o = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return cd(o, n, i)[0];
}
function wy(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of Cd(n)) e.add(i.entity);
  return [...e].sort();
}
class vy {
  constructor() {
    this.seen = /* @__PURE__ */ new Map(), this.events = /* @__PURE__ */ new Map(), this.bubbles = /* @__PURE__ */ new Map(), this.leave = /* @__PURE__ */ new Map();
  }
  /** Compare states with the last seen ones for every event source of the level's devices; record new events and bubble exits. */
  update(e, n, i) {
    for (const o of e.devices)
      this.updateEvents(o, n, i), this.updateBubbles(o, n, i);
  }
  /** The device's event bubble text while under EVENT_MS old, else null. */
  event(e, n) {
    const i = this.events.get(e);
    return i && n - i.at < Go ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < Ca).map((r) => r.bubble), o = this.events.get(e), s = o ? n - o.at : -1;
    return o && s >= Go && s < Go + fy && i.push({ text: o.text, tone: "event", key: o.at }), i;
  }
  updateEvents(e, n, i) {
    const o = Cd(e), s = `${e.id}|`, r = new Set(o.map((l) => s + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(s) && !r.has(l) && this.seen.delete(l);
    for (const l of o) {
      const a = my(n, l.entity);
      if (!a) continue;
      const c = s + l.entity, { value: h, text: f } = by(l, a, this.seen.get(c));
      h !== void 0 && this.seen.set(c, { last: h }), f && this.events.set(e.id, { text: f, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const o = ai(e, n), s = this.bubbles.get(e.id);
    if (s) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < Ca);
      for (const l of py) {
        const a = Ea(s, l, e, i);
        a && !Ea(o, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, o);
  }
}
const ei = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function Da(t) {
  t().catch(() => {
  });
}
class $y {
  constructor(e, n) {
    this.connection = e, this.onChange = n, this.key = null, this.ids = [], this.sub = null, this.map = /* @__PURE__ */ new Map(), this.conn = null, this.onDisconnected = () => {
      this.drop(!1), this.map = /* @__PURE__ */ new Map();
    }, this.onReady = () => {
      this.drop(!0), this.map = /* @__PURE__ */ new Map(), this.subscribe();
    };
  }
  /** `states` with the feed's entities replaced by their per-message states; `states` itself when the feed is empty. */
  overlay(e) {
    return this.map.size === 0 ? e : { ...e, ...Object.fromEntries(this.map) };
  }
  watch(e) {
    var s, r;
    const n = e ? [...new Set(e)].sort() : [], i = n.length ? n.join(`
`) : null;
    if (i === this.key || (this.stop(), i === null)) return;
    this.key = i, this.ids = n;
    const o = this.connection();
    o != null && o.subscribeMessage && (this.conn = o, (s = o.addEventListener) == null || s.call(o, "disconnected", this.onDisconnected), (r = o.addEventListener) == null || r.call(o, "ready", this.onReady), this.subscribe());
  }
  /** Ends the subscription, stops listening to the connection and forgets the states. */
  stop() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady), this.drop(!0), this.key = null, this.ids = [], this.map = /* @__PURE__ */ new Map();
  }
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && Da(n.unsub));
  }
  subscribe() {
    const e = this.conn;
    if (!(e != null && e.subscribeMessage) || this.ids.length === 0) return;
    const n = { live: !0, unsub: null };
    this.sub = n, e.subscribeMessage(
      (i) => {
        n.live && this.apply(i);
      },
      { type: "subscribe_entities", entity_ids: this.ids },
      { resubscribe: !1 }
    ).then(
      (i) => {
        n.live ? n.unsub = i : Da(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, o] of Object.entries(e.a ?? {}))
      !o || typeof o.s != "string" || this.map.set(i, { state: o.s, attributes: { ...o.a ?? {} }, last_changed: ei(o.lc) ?? ei(o.lu) });
    for (const [i, o] of Object.entries(e.c ?? {})) {
      const s = this.map.get(i);
      if (!s || !o) continue;
      const r = { ...s, attributes: { ...s.attributes } }, l = o["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== s.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const c = ei(l.lc) ?? (a ? ei(l.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const a of ((n = o["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var yy = Object.defineProperty, G = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && yy(e, n, o), o;
};
const Ar = class Ar extends Ct {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = ch.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = zb(), this.nextObj = B1(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Zc(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Rv(), this.resizeObs = null, this.session = new Pb(this), this.haMeta = new Tb(this), this.feed = new Bv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new sv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new hy(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new vy(), this.entityFeed = new $y(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => ih(i, (o) => {
      var s;
      return qc(this.haMeta.get(), o, (s = this.hass) == null ? void 0 : s.states);
    }), this.onBeforeUnload = (i) => {
      this.drafts.flush(), this.save.dirty && (i.preventDefault(), i.returnValue = "");
    }, this.onPageHide = () => {
      this.drafts.flush();
    }, this.refocus = (i) => {
      const o = i.composedPath()[0];
      o instanceof Element && o.closest("button") && this.focus();
    }, this.refocusAfterChange = (i) => {
      const o = i.composedPath()[0];
      (o instanceof HTMLInputElement || o instanceof HTMLSelectElement) && (o.blur(), this.focus());
    };
    const e = this, n = {
      get connection() {
        return e.hass.connection;
      }
    };
    this.save = new Vp(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Hb(this), this.activeTool = us("select", this.ctx), this.input = new Pv(this);
  }
  /** True while the 1 s ticker runs (Binding step with a timer, event or fading bubble). */
  get tickerOn() {
    return this.ticker !== null;
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((e = this.plan) == null ? void 0 : e.id) ?? null), this.watchPower(), this.watchRules(), this.watchEntities();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (e = this.resizeObs) == null || e.disconnect(), this.resizeObs = null, this.feed.stop(), this.powerFeed.stop(), this.rulesFeed.stop(), this.entityFeed.stop(), this.stopTicker();
  }
  willUpdate(e) {
    var o, s;
    this.ruleDraft && !this.modal && (this.ruleDraft = null), e.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = ((o = this.history) == null ? void 0 : o.current.level) ?? null;
    this.watchEntities(), n && this.hass && (e.has("hass") || n !== this.trackedLevel) && this.events.update(n, this.entityFeed.overlay(this.hass.states), Date.now()), this.trackedLevel = n;
    const i = this.size.w > 0 && this.size.h > 0;
    this.needFit && i && (this.needFit = !1, this.fit()), this.needPowerFit && i && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((s = this.plan) == null ? void 0 : s.id) ?? null : null), this.watchPower(), this.watchRules();
  }
  /** The rules feed watches the open plan in the Automation step of an attached panel. */
  watchRules() {
    var e;
    this.rulesFeed.watch(this.isConnected && this.mode === "automation" ? ((e = this.plan) == null ? void 0 : e.id) ?? null : null);
  }
  /** The entity feed watches the open level's event sources in the Binding and Automation steps of an attached panel. */
  watchEntities() {
    var n;
    const e = this.isConnected && (this.mode === "binding" || this.mode === "automation") ? (n = this.history) == null ? void 0 : n.current.level : void 0;
    this.entityFeed.watch(e ? wy(e) : null);
  }
  /** Every entity feed message: the tracker sees each value, even one the next message replaces at once. */
  onEntities() {
    var n;
    const e = (n = this.history) == null ? void 0 : n.current.level;
    e && this.hass && this.events.update(e, this.entityFeed.overlay(this.hass.states), Date.now()), this.requestUpdate();
  }
  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  watchPower() {
    const e = this.isConnected && this.mode === "power" ? this.level : null;
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? dy(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, c, h, f, d, p, m, $, w, b, y;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((x) => ai(x, this.hass.states).timerSince !== void 0 || this.events.event(x.id, n) !== null || this.events.leaving(x.id, n).length > 0), o = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, s = !!o && (!!o.pending || o.inputs.some((x) => x.until !== void 0 && x.until > n) || (((l = o.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = o.boiler) == null ? void 0 : a.until) ?? 0) > n || ((c = o.timed) == null ? void 0 : c.running) === !0 && (o.timed.until ?? 0) > n || [(h = o.outside) == null ? void 0 : h.pausedUntil, (f = o.outside) == null ? void 0 : f.until, (d = o.outside) == null ? void 0 : d.windowUntil, (p = o.beurer) == null ? void 0 : p.pausedUntil, (m = o.beurer) == null ? void 0 : m.cycleAt, ($ = o.beurer) == null ? void 0 : $.keptUntil, (w = o.motionLight) == null ? void 0 : w.offAt, (b = o.motionLight) == null ? void 0 : b.minUntil, (y = o.motionLight) == null ? void 0 : y.autoAt].some((x) => (x ?? 0) > n));
    (i || s) && !this.ticker ? this.ticker = setInterval(() => this.requestUpdate(), 1e3) : !i && !s && this.stopTicker();
  }
  stopTicker() {
    this.ticker !== null && clearInterval(this.ticker), this.ticker = null;
  }
  updated() {
    this.syncTicker();
    for (const n of this.renderRoot.querySelectorAll(".ed > :not(.backdrop)")) n.toggleAttribute("inert", this.modal);
    for (const n of this.renderRoot.querySelectorAll(".rule-backdrop select[data-value]")) n.value = n.dataset.value ?? "";
    const e = this.renderRoot.querySelector(".canvas");
    e && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((n) => {
      const i = n[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(e));
  }
  // ---- editing ----
  get level() {
    var e;
    return ((e = this.history) == null ? void 0 : e.current.level) ?? null;
  }
  get power() {
    var e;
    return ((e = this.history) == null ? void 0 : e.current.power) ?? this.lazyPower;
  }
  /**
   * Pushes a level edit; `power` joins the same undo step when the edit changed the schematic too. Without `power`, a
   * stored schematic loses the wires on ports its device blocks no longer have (a wall delete took an inverter); the
   * lazy default is never written.
   */
  commit(e, n) {
    if (!this.history) return;
    const i = this.history.current.power, o = n ?? (i && ap(i, e));
    this.history.push({ ...this.history.current, level: e, ...o && o !== this.power ? { power: o } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
  }
  commitPower(e) {
    this.history && (this.history.push({ ...this.history.current, power: e }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  /** Pushes a rules edit into the same undo history; an empty list drops the key. */
  commitRules(e) {
    if (!this.history) return;
    const { rules: n, ...i } = this.history.current;
    this.history.push({ ...i, ...e.length > 0 ? { rules: e } : {} }), this.save.markDirty(), this.requestUpdate();
  }
  get rules() {
    var e;
    return ((e = this.history) == null ? void 0 : e.current.rules) ?? [];
  }
  /** True while the rule dialog is open: nothing behind it reacts. */
  get modal() {
    var e;
    return ((e = this.dialog) == null ? void 0 : e.kind) === "rule";
  }
  /** The plan's levels with the edited one in place of the stored first level (the plan keeps its stale copy). */
  planLevels() {
    var n;
    const e = this.level;
    return (((n = this.plan) == null ? void 0 : n.levels) ?? []).map((i, o) => o === 0 && e ? e : i);
  }
  /**
   * Opens the rule dialog: a rule id edits that rule (the template does not matter then); otherwise a new rule
   * from the template, in the selected zone. The dialog works on a copy; OK commits one edit, Cancel drops it.
   */
  openRuleDialog(e, n) {
    var o, s;
    if (!this.plan || !this.history || this.dialog !== null) return;
    let i;
    if (n !== void 0) {
      const r = this.rules.find((l) => l.id === n);
      if (!r) return;
      i = { rule: structuredClone(r), isNew: !1, focused: null };
    } else {
      const r = this.planLevels(), l = ((o = this.selection) == null ? void 0 : o.kind) === "zone" ? this.selection.id : null, a = r.flatMap((d) => d.zones).find((d) => d.id === l), c = ((s = this.selection) == null ? void 0 : s.kind) === "device" ? r.flatMap((d) => d.devices).find((d) => d.id === this.selection.id) : void 0, h = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? rb({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Ob({}, h, c && Do(c) ? c.id : null, c && Do(c) ? c.name : "") : e === "outside" ? yb({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "control" ? gb({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? vb(h, (a == null ? void 0 : a.name) ?? null) : e === "motionLight" ? Mb({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? Eb({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? _b({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? Lb({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, h, (a == null ? void 0 : a.name) ?? null) : Pe(h), isNew: !0, focused: null };
    }
    this.ruleDraft = i, this.dialog = { kind: "rule" }, this.updateComplete.then(() => {
      var r;
      return (r = this.renderRoot.querySelector('.rule-backdrop [data-field="name"]')) == null ? void 0 : r.focus();
    });
  }
  /** The edited Power schematic's grid blocks that have a power entity (the boiler rule's power limit reads one). */
  boilerGridBlocks() {
    return this.power.blocks.filter((e) => e.kind === "grid" && !!e.power);
  }
  /** Opens the "Automations" menu beside its rail button (focus on the first item), or closes it when open. */
  toggleAutomationsMenu(e) {
    if (this.automationsMenu) {
      this.automationsMenu = null;
      return;
    }
    const n = e.getBoundingClientRect();
    this.automationsMenu = { x: n.right + 4, y: n.top }, this.updateComplete.then(() => {
      var i;
      return (i = this.renderRoot.querySelector('.amenu [role="menuitem"]')) == null ? void 0 : i.focus();
    });
  }
  /** Closes the "Automations" menu (Escape, a click outside) and hands the focus back to its rail button. */
  closeAutomationsMenu() {
    this.automationsMenu = null, this.updateComplete.then(() => {
      var e;
      return (e = this.renderRoot.querySelector('.tools button[data-action="automations"]')) == null ? void 0 : e.focus();
    });
  }
  /** A purpose-built automation picked from the menu: its dialog, pre-filled for the selected zone. */
  pickAutomation(e) {
    this.automationsMenu = null, this.openRuleDialog(e);
  }
  /**
   * A click on a flowchart block: the block (`field`) gets the highlight, the form field `target` (by default the
   * one of the same name) the focus.
   */
  focusRuleField(e, n = e) {
    this.ruleDraft && (this.ruleDraft = { ...this.ruleDraft, focused: e }), this.updateComplete.then(() => {
      var s;
      const i = this.renderRoot.querySelector(`.rule-backdrop [data-field="${n}"]`), o = i != null && i.matches("input, select, button") ? i : (i == null ? void 0 : i.querySelector("select, input, button")) ?? i;
      (s = o == null ? void 0 : o.scrollIntoView) == null || s.call(o, { block: "nearest" }), o == null || o.focus();
    });
  }
  /** OK: the rule is added or changed as one undoable edit (an unchanged rule closes the dialog without an edit). */
  commitRuleDraft() {
    const e = this.ruleDraft;
    if (this.dialog = null, this.ruleDraft = null, !e) return;
    const n = this.rules.find((i) => i.id === e.rule.id);
    e.isNew ? this.commitRules(G1(this.rules, e.rule)) : n && !ri(n, e.rule) && this.commitRules(K1(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && ri(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return v;
    const n = this.planLevels(), i = n.flatMap((d) => d.devices), o = e.rule, s = this.session.savedRules.find((d) => d.id === o.id), r = this.shownRuleTrace(o), l = s ? ri(s, o) ? null : u("rules.flow.edited") : u("rules.flow.new"), a = n.length > 1, c = n.flatMap((d) => d.zones.map((p) => ({ id: p.id, name: a ? `${p.name} (${d.name})` : p.name }))), h = nb(
      this.rules,
      o,
      (d) => i.some((p) => p.id === d),
      (d) => {
        const p = i.find((m) => m.id === d);
        return p && ee(p);
      },
      (d) => i.some((p) => p.id === d && p.props.kind === "illuminance_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "climate_sensor"),
      (d) => i.some((p) => p.id === d && fs(p)),
      (d) => i.some((p) => p.id === d && (p.props.kind === "wall_switch" || p.props.kind === "smart_button")),
      (d) => this.boilerGridBlocks().some((p) => p.id === d),
      (d) => {
        const p = i.find((m) => m.id === d);
        return !p || zu(p);
      },
      (d) => i.some((p) => p.id === d && p.props.kind === "leak_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "valve"),
      (d) => i.some((p) => p.id === d && (p.props.kind === "wall_switch" || p.props.kind === "smart_button")),
      (d) => i.some((p) => p.id === d && ee(p).includes("on")),
      (d) => i.some((p) => p.id === d && ee(p).includes("on")),
      (d) => i.some((p) => p.id === d && ee(p).includes("on")),
      (d) => i.some((p) => {
        var m;
        return p.id === d && !!((m = p.bindings) != null && m.power);
      }),
      (d) => i.some((p) => p.id === d && p.props.kind === "smart_button"),
      (d) => i.some((p) => p.id === d && an(p).length > 0),
      (d) => i.some((p) => p.id === d && ee(p).includes("on") && ee(p).includes("off")),
      (d) => i.some((p) => p.id === d && p.props.kind === "motion_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "smart_button")
    );
    if (Sb(o))
      return v$({
        draft: e,
        boilers: i.filter(fs),
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        grids: this.boilerGridBlocks().map((d) => ({ id: d.id, name: d.name || u("power.kind.grid") })),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, d$[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (sb(o))
      return M$({
        draft: e,
        sensors: i.filter((d) => d.props.kind === "leak_sensor"),
        valves: i.filter((d) => d.props.kind === "valve"),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, $$(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (cb(o))
      return D$({
        draft: e,
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        devices: i.filter((d) => ee(d).includes("on")),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if ($b(o))
      return z$({
        draft: e,
        lights: i.filter((d) => ee(d).includes("on")),
        sensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, O$[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (kb(o))
      return J$({
        draft: e,
        lights: i.filter((d) => {
          const p = ee(d);
          return p.includes("on") && p.includes("off");
        }),
        sensors: i.filter((d) => d.props.kind === "motion_sensor"),
        daylightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        buttons: i.filter((d) => d.props.kind === "smart_button"),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Z$(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (wb(o))
      return j$({
        draft: e,
        heaters: i.filter((d) => ee(d).includes("on")),
        sources: i.filter((d) => {
          var p;
          return !!((p = d.bindings) != null && p.power);
        }),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, R$[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Cb(o))
      return u$({
        draft: e,
        climateSensors: i.filter((d) => d.props.kind === "climate_sensor"),
        fans: i.filter((d) => {
          const p = ee(d);
          return p.includes("on") && p.includes("off");
        }),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    const f = {
      draft: e,
      inputDevices: i.filter(Do),
      lightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
      lightUnit: (d) => {
        var $, w, b, y, x;
        const p = (w = ($ = i.find((M) => M.id === d)) == null ? void 0 : $.bindings) == null ? void 0 : w.illuminance, m = p ? (y = (b = this.hass) == null ? void 0 : b.states) == null ? void 0 : y[p] : void 0;
        return (x = m == null ? void 0 : m.attributes) == null ? void 0 : x.unit_of_measurement;
      },
      actionDevices: i.filter((d) => ee(d).length > 0),
      deviceById: (d) => i.find((p) => p.id === d),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter((d) => d.id !== o.id && !Gl(d)),
      ruleName: (d) => {
        var p;
        return (p = this.rules.find((m) => m.id === d)) == null ? void 0 : p.name;
      },
      zones: c,
      problems: h,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (d) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
      },
      onFocus: (d) => this.focusRuleField(d),
      onUnit: (d, p) => {
        const m = this.ruleDraft ?? e;
        this.ruleDraft = { ...m, units: { ...m.units, [d]: p } };
      },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    };
    return Gl(o) ? ay({
      ...f,
      actionDevices: i.filter((d) => an(d).length > 0),
      buttons: i.filter((d) => d.props.kind === "smart_button"),
      onFocus: (d) => this.focusRuleField(d, ey(d))
    }) : r$(f);
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(X1(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Eo(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Eo(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Yc(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? Ks(n, e.id) : e.kind === "opening" ? uc(n, e.id) : Hc(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Jc(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Kc(n, e.id);
    return i === n ? this.notice = u("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = Le(i);
    });
  }
  undo() {
    this.modal || this.step(() => {
      var e;
      return ((e = this.history) == null ? void 0 : e.undo()) ?? null;
    });
  }
  redo() {
    this.modal || this.step(() => {
      var e;
      return ((e = this.history) == null ? void 0 : e.redo()) ?? null;
    });
  }
  /**
   * Undo / redo drop the selection, except in the Binding step (the selected device) and the Automation step (the
   * selected zone), which keep it while it exists; the field notice goes with a dropped selection.
   */
  step(e) {
    this.activeTool.cancel(), e() && this.save.markDirty();
    const n = this.selection, i = this.level, o = this.mode === "binding" || this.mode === "automation";
    this.selection = o && n && i && Eo(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = us(e, this.ctx));
  }
  /**
   * Power step device list: arms a device for the Device tool (activated when another tool is on), so the
   * next canvas click places it; the "pick a device first" notice goes. The arm stays across tool switches; a
   * placement, leaving the step or opening another plan clears it.
   */
  armDevice(e) {
    this.toolId !== "power-device" && this.pickTool("power-device"), this.placeDeviceId = e, this.notice = null;
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(e) {
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(rr(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const o = le(n, i);
    o && (this.view = oa(this.view, o.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const o = Ec(n).get(e);
    o && (this.view = oa(this.view, o, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? H1(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  /** The canvas view of the active step: the Power step has its own, so the plan view is kept meanwhile. */
  get view() {
    return this.mode === "power" ? this.powerView : this.planView;
  }
  set view(e) {
    this.mode === "power" ? this.powerView = e : this.planView = e;
  }
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(e) {
    return Av(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = Sv(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = Op(this.power, this.ctx.geo());
    e && (this.powerView = Lv(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, o;
    return Hv({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((s) => s.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((o = this.dialog) == null ? void 0 : o.kind) === "delete-rule" ? J1(this.rules, this.dialog.id).map((s) => s.name) : [],
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (s) => this.session.restoreDraft(s),
      discard: (s) => this.session.discardDraft(s),
      startNew: () => this.session.startNewPlan(),
      confirmDelete: () => {
        this.session.confirmDelete();
      },
      confirmDeleteRule: () => this.confirmDeleteRule(),
      confirmSwitch: () => this.session.confirmSwitch(),
      overwrite: () => this.session.doOverwrite(),
      saveAsNew: () => this.session.doSaveAsNew(),
      close: () => {
        this.dialog = null;
      }
    });
  }
  render() {
    var p, m, $, w;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${u("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${u("action.retry")}</button>` : u("load.loading")}</div>`;
    const e = Ug(!!((m = (p = this.hass) == null ? void 0 : p.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: o, y: s, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, h = this.mode === "power", f = Date.now(), d = ($ = this.hass) == null ? void 0 : $.states;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : h ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${xv(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${L1({
      steps: D1({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (b) => {
          this.plan = { ...this.plan, name: b }, c.markDirty();
        },
        onMode: (b) => this.setMode(b)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onPickPlan: (b) => this.session.pickPlan(b),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${pv(this, n)}
        ${gv(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${o} ${s} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(b) => b.preventDefault()}>
            ${this.grid ? Ev(this.view, l, a, e, h ? 0.1 : 1) : v}
            ${this.mode === "power" ? Rg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : fg(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (b) => this.feed.stateOf(b),
      live: (b) => ai(b, d),
      bubbles: (b) => {
        const y = ai(b, d), x = this.events.event(b.id, f);
        return {
          shown: [...cd(y, b, f), ...x ? [{ text: x.text, tone: "event", key: x.at }] : []],
          leaving: this.events.leaving(b.id, f)
        };
      }
    })}
            ${i.tracker ? $v(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: yv(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? Tv({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${vv({
      grid: this.grid,
      zoomPct: Math.round(r * (h ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? u(`snap.${i.snap.kind}`) : null,
      onGrid: (b) => {
        this.grid = b;
      },
      cones: this.cones,
      onCones: (b) => {
        this.cones = b;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: h
    })}
        ${this.automationsMenu ? fv(this.automationsMenu, (b) => this.pickAutomation(b), () => this.closeAutomationsMenu()) : v}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
Ar.styles = kv;
let q = Ar;
G([
  ze({ attribute: !1 })
], q.prototype, "hass");
G([
  ze({ type: Boolean })
], q.prototype, "narrow");
G([
  ze({ attribute: !1 })
], q.prototype, "panel");
G([
  Z()
], q.prototype, "plan");
G([
  Z()
], q.prototype, "automationsMenu");
G([
  Z()
], q.prototype, "loadError");
G([
  Z()
], q.prototype, "selection");
G([
  Z()
], q.prototype, "toolId");
G([
  Z()
], q.prototype, "wallType");
G([
  Z()
], q.prototype, "thickness");
G([
  Z()
], q.prototype, "boxMeasure");
G([
  Z()
], q.prototype, "grid");
G([
  Z()
], q.prototype, "mode");
G([
  Z()
], q.prototype, "bindFilter");
G([
  Z()
], q.prototype, "bindQuery");
G([
  Z()
], q.prototype, "railCollapsed");
G([
  Z()
], q.prototype, "showAll");
G([
  Z()
], q.prototype, "zoneQuery");
G([
  Z()
], q.prototype, "cones");
G([
  Z()
], q.prototype, "nextProps");
G([
  Z()
], q.prototype, "nextObj");
G([
  Z()
], q.prototype, "planView");
G([
  Z()
], q.prototype, "powerView");
G([
  Z()
], q.prototype, "placeDeviceId");
G([
  Z()
], q.prototype, "size");
G([
  Z()
], q.prototype, "dialog");
G([
  Z()
], q.prototype, "notice");
G([
  Z()
], q.prototype, "fieldNotice");
G([
  Z()
], q.prototype, "pendingDraft");
G([
  Z()
], q.prototype, "ruleDraft");
G([
  Z()
], q.prototype, "plans");
G([
  Z()
], q.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", q);
export {
  q as PlanStudioPanel
};
