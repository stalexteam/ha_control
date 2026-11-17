/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Cn = globalThis, Vs = Cn.ShadowRoot && (Cn.ShadyCSS === void 0 || Cn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Hs = Symbol(), Lo = /* @__PURE__ */ new WeakMap();
let El = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Hs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Vs && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Lo.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Lo.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const od = (t) => new El(typeof t == "string" ? t : t + "", void 0, Hs), Il = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new El(n, t, Hs);
}, rd = (t, e) => {
  if (Vs) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = Cn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, Oo = Vs ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return od(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ld, defineProperty: ad, getOwnPropertyDescriptor: cd, getOwnPropertyNames: dd, getOwnPropertySymbols: ud, getPrototypeOf: pd } = Object, Re = globalThis, zo = Re.trustedTypes, hd = zo ? zo.emptyScript : "", Li = Re.reactiveElementPolyfillSupport, Ht = (t, e) => t, Hn = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? hd : null;
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
} }, Rs = (t, e) => !ld(t, e), No = { attribute: !0, type: String, converter: Hn, reflect: !1, useDefault: !1, hasChanged: Rs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Re.litPropertyMetadata ?? (Re.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let dt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = No) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && ad(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = cd(this.prototype, e) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: s, set(r) {
      const l = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? No;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ht("elementProperties"))) return;
    const e = pd(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ht("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ht("properties"))) {
      const n = this.properties, i = [...dd(n), ...ud(n)];
      for (const s of i) this.createProperty(s, n[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const n = litPropertyMetadata.get(e);
      if (n !== void 0) for (const [i, s] of n) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const s = this._$Eu(n, i);
      s !== void 0 && this._$Eh.set(s, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const n = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) n.unshift(Oo(s));
    } else e !== void 0 && n.push(Oo(e));
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
    return rd(e, this.constructor.elementStyles), e;
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
    var o;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : Hn).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : Hn;
      this._$Em = s;
      const d = a.fromAttribute(n, l.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? Rs)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, n, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? n ?? this[e]), o !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (n = void 0), this._$AL.set(e, n)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, r] of s) {
        const { wrapped: l } = r, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
      }
    }
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(n)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
dt.elementStyles = [], dt.shadowRootOptions = { mode: "open" }, dt[Ht("elementProperties")] = /* @__PURE__ */ new Map(), dt[Ht("finalized")] = /* @__PURE__ */ new Map(), Li == null || Li({ ReactiveElement: dt }), (Re.reactiveElementVersions ?? (Re.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = globalThis, Do = (t) => t, Rn = Rt.trustedTypes, To = Rn ? Rn.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Cl = "$lit$", De = `lit$${Math.random().toFixed(9).slice(2)}$`, Pl = "?" + De, fd = `<${Pl}>`, nt = document, Gt = () => nt.createComment(""), Kt = (t) => t === null || typeof t != "object" && typeof t != "function", Bs = Array.isArray, md = (t) => Bs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Oi = `[ 	
\f\r]`, Et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Vo = /-->/g, Ho = />/g, Ge = RegExp(`>|${Oi}(?:([^\\s"'>=/]+)(${Oi}*=${Oi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ro = /'/g, Bo = /"/g, Ll = /^(?:script|style|textarea|title)$/i, Ol = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), v = Ol(1), _ = Ol(2), fe = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), Fo = /* @__PURE__ */ new WeakMap(), Xe = nt.createTreeWalker(nt, 129);
function zl(t, e) {
  if (!Bs(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return To !== void 0 ? To.createHTML(e) : e;
}
const gd = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Et;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let d, u, c = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, u = r.exec(a), u !== null); ) p = r.lastIndex, r === Et ? u[1] === "!--" ? r = Vo : u[1] !== void 0 ? r = Ho : u[2] !== void 0 ? (Ll.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Ge) : u[3] !== void 0 && (r = Ge) : r === Ge ? u[0] === ">" ? (r = s ?? Et, c = -1) : u[1] === void 0 ? c = -2 : (c = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? Ge : u[3] === '"' ? Bo : Ro) : r === Bo || r === Ro ? r = Ge : r === Vo || r === Ho ? r = Et : (r = Ge, s = void 0);
    const h = r === Ge && t[l + 1].startsWith("/>") ? " " : "";
    o += r === Et ? a + fd : c >= 0 ? (i.push(d), a.slice(0, c) + Cl + a.slice(c) + De + h) : a + De + (c === -2 ? l : h);
  }
  return [zl(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Xt {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [d, u] = gd(e, n);
    if (this.el = Xt.createElement(d, i), Xe.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = Xe.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Cl)) {
          const p = u[r++], h = s.getAttribute(c).split(De), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? wd : m[1] === "?" ? bd : m[1] === "@" ? yd : li }), s.removeAttribute(c);
        } else c.startsWith(De) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (Ll.test(s.tagName)) {
          const c = s.textContent.split(De), p = c.length - 1;
          if (p > 0) {
            s.textContent = Rn ? Rn.emptyScript : "";
            for (let h = 0; h < p; h++) s.append(c[h], Gt()), Xe.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[p], Gt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Pl) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(De, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += De.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = nt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function vt(t, e, n = t, i) {
  var r, l;
  if (e === fe) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Kt(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = vt(t, s._$AS(t, e.values), s, i)), e;
}
class vd {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? nt).importNode(n, !0);
    Xe.currentNode = s;
    let o = Xe.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new Fs(o, o.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (d = new $d(o, this, e)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = Xe.nextNode(), r++);
    }
    return Xe.currentNode = nt, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let Fs = class Nl {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, i, s) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = vt(this, e, n), Kt(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== fe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : md(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== b && Kt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(nt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Xt.createElement(zl(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new vd(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Fo.get(e.strings);
    return n === void 0 && Fo.set(e.strings, n = new Xt(e)), n;
  }
  k(e) {
    Bs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new Nl(this.O(Gt()), this.O(Gt()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = Do(e).nextSibling;
      Do(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class li {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, s, o) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = e, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = b;
  }
  _$AI(e, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) e = vt(this, e, n, 0), r = !Kt(e) || e !== this._$AH && e !== fe, r && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = o[0], a = 0; a < o.length - 1; a++) d = vt(this, l[i + a], n, a), d === fe && (d = this._$AH[a]), r || (r = !Kt(d) || d !== this._$AH[a]), d === b ? e = b : e !== b && (e += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class wd extends li {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === b ? void 0 : e;
  }
}
class bd extends li {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== b);
  }
}
let yd = class extends li {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = vt(this, e, n, 0) ?? b) === fe) return;
    const i = this._$AH, s = e === b && i !== b || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== b && (i === b || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class $d {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    vt(this, e);
  }
}
const zi = Rt.litHtmlPolyfillSupport;
zi == null || zi(Xt, Fs), (Rt.litHtmlVersions ?? (Rt.litHtmlVersions = [])).push("3.3.3");
const xd = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new Fs(e.insertBefore(Gt(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qe = globalThis;
let mt = class extends dt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xd(n, this.renderRoot, this.renderOptions);
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
    return fe;
  }
};
var Al;
mt._$litElement$ = !0, mt.finalized = !0, (Al = Qe.litElementHydrateSupport) == null || Al.call(Qe, { LitElement: mt });
const Ni = Qe.litElementPolyfillSupport;
Ni == null || Ni({ LitElement: mt });
(Qe.litElementVersions ?? (Qe.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kd = { attribute: !0, type: String, converter: Hn, reflect: !1, hasChanged: Rs }, Md = (t = kd, e, n) => {
  const { kind: i, metadata: s } = n;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(n.name, t), i === "accessor") {
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
function Le(t) {
  return (e, n) => typeof n == "object" ? Md(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function F(t) {
  return Le({ ...t, state: !0, attribute: !1 });
}
function Y() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Us(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const Je = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, _d = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Sd = { ...Je, role: "power_in" }, Ad = { ...Je, role: "power_out" }, Ed = ["on", "off", "auto"], Ws = (t) => Ed.includes(t), Di = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Id = {
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
  smart_button: [Di("on"), Di("off"), Di("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Je],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Je, _d, Sd, Ad]
}, js = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Cd = { climate_sensor: "any" };
function _e(t) {
  const e = t.props, n = Id[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Dl(t) {
  return new Set(_e(t).map((e) => e.role));
}
function ai(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !Dl(s).has(n)) return t;
  const o = (l = s.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (o === void 0) return t;
    const a = { ...s.bindings };
    delete a[n];
    const d = { ...s, bindings: a };
    if (Object.keys(a).length === 0 && delete d.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...c } = s.props;
      d.props = c;
    }
    return { ...t, devices: t.devices.map((u) => u === s ? d : u) };
  }
  if (o === i) return t;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
function Pd(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = _e(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (Cd[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Ld(t) {
  const e = _e(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Od = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function us(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Ws(e) ? n : `${n}|${Od(i[e])}`;
}
function zd(t, e, n) {
  const i = us(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && _e(s).some((o) => us(s, o.role) === i));
}
function Nd(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of _e(t)) {
    const s = Ws(i) ? us(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function ci(t) {
  if (!t.bindings) return t;
  const e = Dl(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Tl = (t) => t === "wall_switch" || t === "smart_button", di = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", Yt = (t) => t === "wall" ? "wall" : "free", Dd = [100, 125, 150], qs = "mdi:cube-outline", Uo = ["single", "double", "hold"], Td = {
  bearing: 400
}, Pn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Vl(t = Y(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Wo(t) {
  return {
    id: Y(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Vl()]
  };
}
const Zs = {
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
}, wt = 90, Hl = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ue(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: qs, label: "" };
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
const Vd = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: qs
};
function Hd(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Vd[String(n)] ?? qs;
  return { ...t, props: { ...i, icon: s } };
}
function Rd(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Yt(t.placement.mode);
  return e ? { ...t, props: Ue("smart_button", n), bindings: { on: e } } : { ...t, props: Ue("wall_switch", n) };
}
const Rl = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Bd(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Rl(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function Fd(t) {
  const e = t.props.kind;
  if (!di(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Ue(e, Yt(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? Bd(r, o) : s === "windowSec" ? Rl(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function Ud(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function Wd(t) {
  if (!di(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function jd(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => ci(Ud(Wd(Fd(Rd(Hd(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function N(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function C(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function I(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function B(t, e) {
  return t.x * e.x + t.y * e.y;
}
function oe(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Bl(t) {
  return Math.hypot(t.x, t.y);
}
function O(t, e) {
  return Bl(C(e, t));
}
function ui(t) {
  const e = Bl(t);
  return e === 0 ? { x: 0, y: 0 } : I(t, 1 / e);
}
function ee(t) {
  return { x: t.y, y: -t.x };
}
function Fl(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function be(t, e, n, i) {
  const s = oe(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = oe(C(n, t), i) / s;
  return N(t, I(e, o));
}
function pi(t, e, n) {
  const i = C(n, e), s = B(i, i);
  return s === 0 ? 0 : B(C(t, e), i) / s;
}
function xe(t, e, n) {
  const i = C(n, e), s = B(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, B(C(t, e), i) / s));
  return O(t, N(e, I(i, o)));
}
function bt(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function ke(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let We = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function qd(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Te(t, e, n) {
  const i = new We(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = n(t, e.key);
    if (r < 0) {
      if (e.left === null) break;
      if (n(t, e.left.key) < 0) {
        const l = e.left;
        if (e.left = l.right, l.right = e, e = l, e.left === null) break;
      }
      o.left = e, o = e, e = e.left;
    } else if (r > 0) {
      if (e.right === null) break;
      if (n(t, e.right.key) > 0) {
        const l = e.right;
        if (e.right = l.left, l.left = e, e = l, e.right === null) break;
      }
      s.right = e, s = e, e = e.right;
    } else break;
  }
  return s.right = e.left, o.left = e.right, e.left = i.right, e.right = i.left, e;
}
function Ti(t, e, n, i) {
  const s = new We(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = Te(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function jo(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = Te(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function Zd(t, e, n) {
  return e === null ? t : (t === null || (e = Te(t.key, e, n), e.left = t), e);
}
function ps(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && ps(t.left, o, !1, i, s), t.right && ps(t.right, o, !0, i, s);
  }
}
class Gs {
  constructor(e = qd) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = Ti(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new We(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Te(e, this._root, s), r = s(e, o.key);
    return r === 0 ? this._root = o : (r < 0 ? (i.left = o.left, i.right = o, o.left = null) : r > 0 && (i.right = o.right, i.left = o, o.right = null), this._size++, this._root = i), this._root;
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
    let s;
    return n === null ? null : (n = Te(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = Te(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Te(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
      const s = i(e, n.key);
      if (s === 0) return n;
      s < 0 ? n = n.left : n = n.right;
    }
    return null;
  }
  find(e) {
    return this._root && (this._root = Te(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
  }
  contains(e) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const s = i(e, n.key);
      if (s === 0) return !0;
      s < 0 ? n = n.left : n = n.right;
    }
    return !1;
  }
  forEach(e, n) {
    let i = this._root;
    const s = [];
    let o = !1;
    for (; !o; )
      i !== null ? (s.push(i), i = i.left) : s.length !== 0 ? (i = s.pop(), e.call(n, i), i = i.right) : o = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(e, n, i, s) {
    const o = [], r = this._comparator;
    let l = this._root, a;
    for (; o.length !== 0 || l; )
      if (l)
        o.push(l), l = l.left;
      else {
        if (l = o.pop(), a = r(l.key, n), a > 0)
          break;
        if (r(l.key, e) >= 0 && i.call(s, l))
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
    let n = this._root, i = !1, s = 0;
    const o = [];
    for (; !i; )
      if (n)
        o.push(n), n = n.left;
      else if (o.length > 0) {
        if (n = o.pop(), s === e) return n;
        s++, n = n.right;
      } else i = !0;
    return null;
  }
  next(e) {
    let n = this._root, i = null;
    if (e.right) {
      for (i = e.right; i.left; ) i = i.left;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(e.key, n.key);
      if (o === 0) break;
      o < 0 ? (i = n, n = n.left) : n = n.right;
    }
    return i;
  }
  prev(e) {
    let n = this._root, i = null;
    if (e.left !== null) {
      for (i = e.left; i.right; ) i = i.right;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(e.key, n.key);
      if (o === 0) break;
      o < 0 ? n = n.left : (i = n, n = n.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Kd(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && ms(e, n, 0, s - 1, o), this._root === null)
      this._root = hs(e, n, 0, s), this._size = s;
    else {
      const r = Xd(
        this.toList(),
        Gd(e, n),
        o
      );
      s = this._size + s, this._root = fs({ head: r }, 0, s);
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
    return ps(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = jo(e, this._root, s);
    s(e, n) < 0 ? r = Ti(n, i, r, s) : o = Ti(n, i, o, s), this._root = Zd(o, r, s);
  }
  split(e) {
    return jo(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function hs(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new We(r, l);
    return a.left = hs(t, e, n, o), a.right = hs(t, e, o + 1, i), a;
  }
  return null;
}
function Gd(t, e) {
  const n = new We(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new We(t[s], e[s]);
  return i.next = null, n.next;
}
function Kd(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new We(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function fs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = fs(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = fs(t, s + 1, n), r;
  }
  return null;
}
function Xd(t, e, n) {
  const i = new We(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function ms(t, e, n, i, s) {
  if (n >= i) return;
  const o = t[n + i >> 1];
  let r = n - 1, l = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(t[r], o) < 0);
    do
      l--;
    while (s(t[l], o) > 0);
    if (r >= l) break;
    let a = t[r];
    t[r] = t[l], t[l] = a, a = e[r], e[r] = e[l], e[l] = a;
  }
  ms(t, e, n, l, s), ms(t, e, l + 1, i, s);
}
const Ce = 11102230246251565e-32, te = 134217729, Yd = (3 + 8 * Ce) * Ce;
function Vi(t, e, n, i, s) {
  let o, r, l, a, d = e[0], u = i[0], c = 0, p = 0;
  u > d == u > -d ? (o = d, d = e[++c]) : (o = u, u = i[++p]);
  let h = 0;
  if (c < t && p < n)
    for (u > d == u > -d ? (r = d + o, l = o - (r - d), d = e[++c]) : (r = u + o, l = o - (r - u), u = i[++p]), o = r, l !== 0 && (s[h++] = l); c < t && p < n; )
      u > d == u > -d ? (r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c]) : (r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p]), o = r, l !== 0 && (s[h++] = l);
  for (; c < t; )
    r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c], o = r, l !== 0 && (s[h++] = l);
  for (; p < n; )
    r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p], o = r, l !== 0 && (s[h++] = l);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function Qd(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function S(t) {
  return new Float64Array(t);
}
const Jd = (3 + 16 * Ce) * Ce, eu = (2 + 12 * Ce) * Ce, tu = (9 + 64 * Ce) * Ce * Ce, lt = S(4), qo = S(8), Zo = S(12), Go = S(16), se = S(4);
function nu(t, e, n, i, s, o, r) {
  let l, a, d, u, c, p, h, m, y, w, g, $, k, M, x, A, E, P;
  const D = t - s, H = n - s, z = e - o, V = i - o;
  M = D * V, p = te * D, h = p - (p - D), m = D - h, p = te * V, y = p - (p - V), w = V - y, x = m * w - (M - h * y - m * y - h * w), A = z * H, p = te * z, h = p - (p - z), m = z - h, p = te * H, y = p - (p - H), w = H - y, E = m * w - (A - h * y - m * y - h * w), g = x - E, c = x - g, lt[0] = x - (g + c) + (c - E), $ = M + g, c = $ - M, k = M - ($ - c) + (g - c), g = k - A, c = k - g, lt[1] = k - (g + c) + (c - A), P = $ + g, c = P - $, lt[2] = $ - (P - c) + (g - c), lt[3] = P;
  let W = Qd(4, lt), q = eu * r;
  if (W >= q || -W >= q || (c = t - D, l = t - (D + c) + (c - s), c = n - H, d = n - (H + c) + (c - s), c = e - z, a = e - (z + c) + (c - o), c = i - V, u = i - (V + c) + (c - o), l === 0 && a === 0 && d === 0 && u === 0) || (q = tu * r + Yd * Math.abs(W), W += D * u + V * l - (z * d + H * a), W >= q || -W >= q)) return W;
  M = l * V, p = te * l, h = p - (p - l), m = l - h, p = te * V, y = p - (p - V), w = V - y, x = m * w - (M - h * y - m * y - h * w), A = a * H, p = te * a, h = p - (p - a), m = a - h, p = te * H, y = p - (p - H), w = H - y, E = m * w - (A - h * y - m * y - h * w), g = x - E, c = x - g, se[0] = x - (g + c) + (c - E), $ = M + g, c = $ - M, k = M - ($ - c) + (g - c), g = k - A, c = k - g, se[1] = k - (g + c) + (c - A), P = $ + g, c = P - $, se[2] = $ - (P - c) + (g - c), se[3] = P;
  const Q = Vi(4, lt, 4, se, qo);
  M = D * u, p = te * D, h = p - (p - D), m = D - h, p = te * u, y = p - (p - u), w = u - y, x = m * w - (M - h * y - m * y - h * w), A = z * d, p = te * z, h = p - (p - z), m = z - h, p = te * d, y = p - (p - d), w = d - y, E = m * w - (A - h * y - m * y - h * w), g = x - E, c = x - g, se[0] = x - (g + c) + (c - E), $ = M + g, c = $ - M, k = M - ($ - c) + (g - c), g = k - A, c = k - g, se[1] = k - (g + c) + (c - A), P = $ + g, c = P - $, se[2] = $ - (P - c) + (g - c), se[3] = P;
  const T = Vi(Q, qo, 4, se, Zo);
  M = l * u, p = te * l, h = p - (p - l), m = l - h, p = te * u, y = p - (p - u), w = u - y, x = m * w - (M - h * y - m * y - h * w), A = a * d, p = te * a, h = p - (p - a), m = a - h, p = te * d, y = p - (p - d), w = d - y, E = m * w - (A - h * y - m * y - h * w), g = x - E, c = x - g, se[0] = x - (g + c) + (c - E), $ = M + g, c = $ - M, k = M - ($ - c) + (g - c), g = k - A, c = k - g, se[1] = k - (g + c) + (c - A), P = $ + g, c = P - $, se[2] = $ - (P - c) + (g - c), se[3] = P;
  const G = Vi(T, Zo, 4, se, Go);
  return Go[G - 1];
}
function iu(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= Jd * d ? a : -nu(t, e, n, i, s, o, d);
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
const It = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, gs = (t, e) => {
  if (e.ur.x < t.ll.x || t.ur.x < e.ll.x || e.ur.y < t.ll.y || t.ur.y < e.ll.y) return null;
  const n = t.ll.x < e.ll.x ? e.ll.x : t.ll.x, i = t.ur.x < e.ur.x ? t.ur.x : e.ur.x, s = t.ll.y < e.ll.y ? e.ll.y : t.ll.y, o = t.ur.y < e.ur.y ? t.ur.y : e.ur.y;
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
let He = Number.EPSILON;
He === void 0 && (He = Math.pow(2, -52));
const su = He * He, Ko = (t, e) => {
  if (-He < t && t < He && -He < e && e < He)
    return 0;
  const n = t - e;
  return n * n < su * t * e ? 0 : t < e ? -1 : 1;
};
class ou {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Xo(), this.yRounder = new Xo();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class Xo {
  constructor() {
    this.tree = new Gs(), this.round(0);
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
    if (i !== null && Ko(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && Ko(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const Qt = new ou(), Ln = (t, e) => t.x * e.y - t.y * e.x, Ul = (t, e) => t.x * e.x + t.y * e.y, Yo = (t, e, n) => {
  const i = iu(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Bn = (t) => Math.sqrt(Ul(t, t)), ru = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Ln(s, i) / Bn(s) / Bn(i);
}, lu = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Ul(s, i) / Bn(s) / Bn(i);
}, Qo = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Jo = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, au = (t, e, n, i) => {
  if (e.x === 0) return Jo(n, i, t.x);
  if (i.x === 0) return Jo(t, e, n.x);
  if (e.y === 0) return Qo(n, i, t.y);
  if (i.y === 0) return Qo(t, e, n.y);
  const s = Ln(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = Ln(o, e) / s, l = Ln(o, i) / s, a = t.x + l * e.x, d = n.x + r * i.x, u = t.y + l * e.y, c = n.y + r * i.y, p = (a + d) / 2, h = (u + c) / 2;
  return {
    x: p,
    y: h
  };
};
class pe {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = pe.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Be.compare(e.segment, n.segment));
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
    for (let i = 0, s = n.length; i < s; i++) {
      const o = n[i];
      this.point.events.push(o), o.point = this.point;
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
        for (let s = n + 1; s < e; s++) {
          const o = this.point.events[s];
          o.consumedBy === void 0 && i.otherSE.point.events === o.otherSE.point.events && i.segment.consume(o.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const e = [];
    for (let n = 0, i = this.point.events.length; n < i; n++) {
      const s = this.point.events[n];
      s !== this && !s.segment.ringOut && s.segment.isInResult() && e.push(s);
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
    const n = /* @__PURE__ */ new Map(), i = (s) => {
      const o = s.otherSE;
      n.set(s, {
        sine: ru(this.point, e.point, o.point),
        cosine: lu(this.point, e.point, o.point)
      });
    };
    return (s, o) => {
      n.has(s) || i(s), n.has(o) || i(o);
      const {
        sine: r,
        cosine: l
      } = n.get(s), {
        sine: a,
        cosine: d
      } = n.get(o);
      return r >= 0 && a >= 0 ? l < d ? 1 : l > d ? -1 : 0 : r < 0 && a < 0 ? l < d ? -1 : l > d ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let cu = 0;
class Be {
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
    const i = e.leftSE.point.x, s = n.leftSE.point.x, o = e.rightSE.point.x, r = n.rightSE.point.x;
    if (r < i) return 1;
    if (o < s) return -1;
    const l = e.leftSE.point.y, a = n.leftSE.point.y, d = e.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (a < l && a < d) return 1;
      if (a > l && a > d) return -1;
      const c = e.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const p = n.comparePoint(e.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (l < a && l < u) return -1;
      if (l > a && l > u) return 1;
      const c = n.comparePoint(e.leftSE.point);
      if (c !== 0) return c;
      const p = e.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (o < r) {
      const c = n.comparePoint(e.rightSE.point);
      if (c !== 0) return c;
    }
    if (o > r) {
      const c = e.comparePoint(n.rightSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
    }
    if (o !== r) {
      const c = d - l, p = o - i, h = u - a, m = r - s;
      if (c > p && h < m) return 1;
      if (c < p && h > m) return -1;
    }
    return o > r ? 1 : o < r || d < u ? -1 : d > u ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++cu, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const l = pe.comparePoints(e, n);
    if (l < 0)
      s = e, o = n, r = 1;
    else if (l > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new pe(s, !0), d = new pe(o, !1);
    return new Be(a, d, [i], [r]);
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
    const n = this.leftSE.point, i = this.rightSE.point, s = this.vector();
    if (n.x === i.x)
      return e.x === n.x ? 0 : e.x < n.x ? 1 : -1;
    const o = (e.y - n.y) / s.y, r = n.x + o * s.x;
    if (e.x === r) return 0;
    const l = (e.x - n.x) / s.x, a = n.y + l * s.y;
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
    const n = this.bbox(), i = e.bbox(), s = gs(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, d = It(n, l) && this.comparePoint(l) === 0, u = It(i, o) && e.comparePoint(o) === 0, c = It(n, a) && this.comparePoint(a) === 0, p = It(i, r) && e.comparePoint(r) === 0;
    if (u && d)
      return p && !c ? r : !p && c ? a : null;
    if (u)
      return c && o.x === a.x && o.y === a.y ? null : o;
    if (d)
      return p && r.x === l.x && r.y === l.y ? null : l;
    if (p && c) return null;
    if (p) return r;
    if (c) return a;
    const h = au(o, this.vector(), l, e.vector());
    return h === null || !It(s, h) ? null : Qt.round(h.x, h.y);
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
    const n = [], i = e.events !== void 0, s = new pe(e, !0), o = new pe(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new Be(s, r, this.rings.slice(), this.windings.slice());
    return pe.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), pe.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Be.compare(n, i);
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
        const l = i.rings[o], a = i.windings[o], d = n.rings.indexOf(l);
        d === -1 ? (n.rings.push(l), n.windings.push(a)) : n.windings[d] += a;
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
    const n = this._afterState.rings, i = this._afterState.windings, s = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const d = this.rings[l], u = this.windings[l], c = n.indexOf(d);
      c === -1 ? (n.push(d), i.push(u)) : i[c] += u;
    }
    const o = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const d = n[l], u = d.poly;
      if (r.indexOf(u) === -1)
        if (d.isExterior) o.push(u);
        else {
          r.indexOf(u) === -1 && r.push(u);
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
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (me.type) {
      case "union": {
        const i = e.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        e.length < n.length ? (i = e.length, s = n.length) : (i = n.length, s = e.length), this._isInResult = s === me.numMultiPolys && i < s;
        break;
      }
      case "xor": {
        const i = Math.abs(e.length - n.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (s) => s.length === 1 && s[0].isSubject;
        this._isInResult = i(e) !== i(n);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${me.type}`);
    }
    return this._isInResult;
  }
}
class er {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Qt.round(e[0][0], e[0][1]);
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
    for (let r = 1, l = e.length; r < l; r++) {
      if (typeof e[r][0] != "number" || typeof e[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let a = Qt.round(e[r][0], e[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(Be.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Be.fromRing(o, s, this));
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.segments.length; n < i; n++) {
      const s = this.segments[n];
      e.push(s.leftSE), e.push(s.rightSE);
    }
    return e;
  }
}
class du {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new er(e[0], this, !0), this.bbox = {
      ll: {
        x: this.exteriorRing.bbox.ll.x,
        y: this.exteriorRing.bbox.ll.y
      },
      ur: {
        x: this.exteriorRing.bbox.ur.x,
        y: this.exteriorRing.bbox.ur.y
      }
    }, this.interiorRings = [];
    for (let i = 1, s = e.length; i < s; i++) {
      const o = new er(e[i], this, !1);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.interiorRings.push(o);
    }
    this.multiPoly = n;
  }
  getSweepEvents() {
    const e = this.exteriorRing.getSweepEvents();
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const s = this.interiorRings[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        e.push(s[o]);
    }
    return e;
  }
}
class tr {
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
    for (let i = 0, s = e.length; i < s; i++) {
      const o = new du(e[i], this);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.polys.push(o);
    }
    this.isSubject = n;
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        e.push(s[o]);
    }
    return e;
  }
}
class Fn {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const d = [l], u = l.point, c = [];
      for (; r = l, l = a, d.push(l), l.point !== u; )
        for (; ; ) {
          const p = l.getAvailableLinkedEvents();
          if (p.length === 0) {
            const y = d[0].point, w = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (p.length === 1) {
            a = p[0].otherSE;
            break;
          }
          let h = null;
          for (let y = 0, w = c.length; y < w; y++)
            if (c[y].point === l.point) {
              h = y;
              break;
            }
          if (h !== null) {
            const y = c.splice(h)[0], w = d.splice(y.index);
            w.unshift(w[0].otherSE), n.push(new Fn(w.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = p.sort(m)[0].otherSE;
          break;
        }
      n.push(new Fn(d));
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
    for (let d = 1, u = this.events.length - 1; d < u; d++) {
      const c = this.events[d].point, p = this.events[d + 1].point;
      Yo(c, e, p) !== 0 && (n.push(c), e = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Yo(i, e, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let d = r; d != l; d += o) a.push([n[d].x, n[d].y]);
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
    for (let s = 1, o = this.events.length; s < o; s++) {
      const r = this.events[s];
      pe.compare(e, r) > 0 && (e = r);
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
class nr {
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
      const s = this.interiorRings[n].getGeom();
      s !== null && e.push(s);
    }
    return e;
  }
}
class uu {
  constructor(e) {
    this.rings = e, this.polys = this._composePolys(e);
  }
  getGeom() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getGeom();
      s !== null && e.push(s);
    }
    return e;
  }
  _composePolys(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      if (!o.poly)
        if (o.isExteriorRing()) n.push(new nr(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new nr(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class pu {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Be.compare;
    this.queue = e, this.tree = new Gs(n), this.segments = [];
  }
  process(e) {
    const n = e.segment, i = [];
    if (e.consumedBy)
      return e.isLeft ? this.queue.remove(e.otherSE) : this.tree.remove(n), i;
    const s = e.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!s) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, l, a;
    for (; l === void 0; )
      o = this.tree.prev(o), o === null ? l = null : o.key.consumedBy === void 0 && (l = o.key);
    for (; a === void 0; )
      r = this.tree.next(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    if (e.isLeft) {
      let d = null;
      if (l) {
        const c = l.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (d = c), !l.isAnEndpoint(c))) {
          const p = this._splitSafely(l, c);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      let u = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (u = c), !a.isAnEndpoint(c))) {
          const p = this._splitSafely(a, c);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      if (d !== null || u !== null) {
        let c = null;
        d === null ? c = u : u === null ? c = d : c = pe.comparePoints(d, u) <= 0 ? d : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(c);
        for (let h = 0, m = p.length; h < m; h++)
          i.push(p[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const d = l.getIntersection(a);
        if (d !== null) {
          if (!l.isAnEndpoint(d)) {
            const u = this._splitSafely(l, d);
            for (let c = 0, p = u.length; c < p; c++)
              i.push(u[c]);
          }
          if (!a.isAnEndpoint(d)) {
            const u = this._splitSafely(a, d);
            for (let c = 0, p = u.length; c < p; c++)
              i.push(u[c]);
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
    const s = e.split(n);
    return s.push(i), e.consumedBy === void 0 && this.tree.add(e), s;
  }
}
const ir = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, hu = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class fu {
  run(e, n, i) {
    me.type = e, Qt.reset();
    const s = [new tr(n, !0)];
    for (let c = 0, p = i.length; c < p; c++)
      s.push(new tr(i[c], !1));
    if (me.numMultiPolys = s.length, me.type === "difference") {
      const c = s[0];
      let p = 1;
      for (; p < s.length; )
        gs(s[p].bbox, c.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (me.type === "intersection")
      for (let c = 0, p = s.length; c < p; c++) {
        const h = s[c];
        for (let m = c + 1, y = s.length; m < y; m++)
          if (gs(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Gs(pe.compare);
    for (let c = 0, p = s.length; c < p; c++) {
      const h = s[c].getSweepEvents();
      for (let m = 0, y = h.length; m < y; m++)
        if (o.insert(h[m]), o.size > ir)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new pu(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > ir)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > hu)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(c);
      for (let h = 0, m = p.length; h < m; h++) {
        const y = p[h];
        y.consumedBy === void 0 && o.insert(y);
      }
      l = o.size, a = o.pop();
    }
    Qt.reset();
    const d = Fn.factory(r.segments);
    return new uu(d).getGeom();
  }
}
const me = new fu(), mu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return me.run("union", t, n);
}, gu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return me.run("intersection", t, n);
}, vu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return me.run("xor", t, n);
}, wu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return me.run("difference", t, n);
};
var Wl = {
  union: mu,
  intersection: gu,
  xor: vu,
  difference: wu
};
const jl = 3, bu = 1e-6;
function hi(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function X(t, e) {
  const n = hi(t, e);
  return { x: n.x, y: n.y };
}
function rt(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : O(i, s);
}
function ql(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: ui(C(e, t)), len: O(t, e), leftOff: o, rightOff: r };
}
function ie(t, e) {
  return ql(X(t, e.a), X(t, e.b), e.thickness, e.baseline);
}
function qe(t, e) {
  const n = C(e, t.a);
  return { t: B(n, t.dir), side: B(n, ee(t.dir)) };
}
function sr(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: I(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const ut = (t) => N(t.p, I(ee(t.u), t.offL)), pt = (t) => C(t.p, I(ee(t.u), t.offR));
function Ye(t, e, n) {
  return t !== null && O(t, e) <= n;
}
function yu(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ie(t, n);
    if (i.len < 1e-9) continue;
    const s = ee(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: N(i.a, I(s, i.leftOff)),
        ar: C(i.a, I(s, i.rightOff)),
        bl: N(i.b, I(s, i.leftOff)),
        br: C(i.b, I(s, i.rightOff))
      }
    });
  }
  return e;
}
function $u(t, e) {
  const n = e.f, i = ee(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = B(C(s.far, n.a), i) >= 0 ? N(n.a, I(i, n.leftOff)) : C(n.a, I(i, n.rightOff)), l = jl * Math.max(s.body.wall.thickness, e.wall.thickness), a = be(ut(s), s.u, r, n.dir), d = be(pt(s), s.u, r, n.dir);
    Ye(a, s.p, l) && (s.body.c[s.leftKey] = a), Ye(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function xu(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = jl * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = be(pt(o), o.u, ut(r), r.u);
    Ye(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = ku(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = C(r, o), a = oe(l, C(e, o)), d = oe(l, C(s.far, o));
    a * d < 0 && vs(s, [e]);
  }
}
function vs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function ku(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(oe(o.u, r.u)) > 1e-9 || B(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], d = be(pt(o), o.u, ut(a), a.u), u = be(ut(r), r.u, ut(a), a.u);
        if (!Ye(d, e, n) || !Ye(u, e, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = u, vs(o, [e, c, u]);
      } else {
        const a = t[(s - 1 + i) % i], d = be(ut(r), r.u, pt(a), a.u), u = be(pt(o), o.u, pt(a), a.u);
        if (!Ye(u, e, n) || !Ye(d, e, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = d, vs(r, [u, c, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Ks(t) {
  const e = yu(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(sr(r, "a")), r.wall.b === i.id && s.push(sr(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? $u(s, o) : s.length >= 2 && xu(s, { x: i.x, y: i.y });
  }
  return e;
}
function Zl(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Ks(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: B(C(l, i.f.a), i.f.dir) });
    }
  return e;
}
function Gl(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function fi(t) {
  return new Map(Ks(t).map((e) => [e.wall.id, Gl(e)]));
}
function or(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(N(s, I(C(o, s), r / (r - l))));
  }
  return n;
}
function Xs(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ks(t)) {
    const s = Gl(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, c) => u.offset - c.offset), r = (u) => B(C(u, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const u of o)
      l.push([a, u.offset]), a = Math.max(a, u.offset + u.width);
    l.push([a, 1 / 0]);
    const d = [];
    for (const [u, c] of l) {
      if (c <= u) continue;
      let p = s;
      u > -1 / 0 && (p = or(p, (h) => r(h) - u)), c < 1 / 0 && (p = or(p, (h) => c - r(h))), p.length >= 3 && Math.abs(ke(p)) > bu && d.push(p);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const ws = (t) => [t.map((e) => [e.x, e.y])];
function Kl(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Xl(t, e) {
  return Yl(e ? [...Xs(t).values()].flat() : [...fi(t).values()]);
}
function Yl(t) {
  const e = t.map(ws);
  if (e.length === 0) return [];
  let n;
  try {
    n = Wl.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Kl));
}
const yt = 1e-6, Un = ["door", "gate", "wicket"], Ql = (t) => t === "opening", Jl = (t) => t.passesLight ?? Ql(t.kind), ea = (t) => t === "opening", ta = (t) => t.passesPir ?? ea(t.kind);
function na(t, e) {
  return t.offset < e.offset + e.width - yt && e.offset < t.offset + t.width - yt;
}
function mi(t, e, n, i, s) {
  const o = rt(t, e);
  return o === null || i <= 0 || n < -yt || n + i > o + yt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && na(r, { offset: n, width: i }));
}
function Mt(t, e) {
  return { ...t, openings: e };
}
function Mu(t, e, n, i, s, o = {}) {
  const r = s ?? Pn[n], l = i - r / 2;
  if (!mi(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: Y(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return Un.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: Mt(t, [...t.openings, a]), openingId: a.id };
}
function ia(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !mi(t, i.wallId, n, i.width, e) ? t : dn(Mt(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function _u(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !mi(t, i.wallId, i.offset, n, e) ? t : dn(Mt(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Su(t, e) {
  return Un.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Au(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return dn(Mt(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function sa(t, e) {
  return dn(Mt(t, t.openings.filter((n) => n.id !== e)));
}
function dn(t) {
  return Mt(t, t.openings.map((e) => {
    const n = rt(t, e.wallId), i = n === null || e.offset < -yt || e.offset + e.width > n + yt || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && na(e, s));
    return { ...e, invalid: i };
  }));
}
const Wn = 1e-6;
function oa(t, e) {
  return e.mode !== "none" && Zs[t.kind].includes(e.mode);
}
function ra(t, e, n) {
  if (n.mode === "none" || !oa(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -wt || i > wt)) return !1;
  const s = rt(t, n.wallId);
  return s !== null && n.offset >= -Wn && n.offset <= s + Wn;
}
function Oe(t, e) {
  return { ...t, devices: e };
}
function rr(t, e, n, i) {
  if (!ra(t, e, n)) return { level: t, deviceId: null };
  const s = { id: Y(), name: i, placement: n, props: e, invalid: !1 };
  return { level: Oe(t, [...t.devices, s]), deviceId: s.id };
}
function la(t, e) {
  const n = { id: Y(), name: e, placement: { mode: "none" }, props: Ue("equipment", "free"), invalid: !1 };
  return { level: Oe(t, [...t.devices, n]), id: n.id };
}
const Eu = ["power", "power_in", "power_out", "voltage"];
function Iu(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Eu.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const _t = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, aa = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function ca(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function da(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = ci({ ...i, props: ca(i.props, "inverter", n), bindings: r });
  return Oe(t, t.devices.map((a) => a === i ? l : a));
}
function gi(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: ca(i.props, "controllable", n) };
  return Oe(t, t.devices.map((o) => o === i ? s : o));
}
function ua(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Ue("motion_sensor", Yt(e)), s = Ue("motion_sensor", Yt(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function jn(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !ra(t, s.props, n)) return t;
  const o = ua(s.props, s.placement.mode, n.mode);
  return pa(Oe(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function un(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? Oe(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return ci({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Cu(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Tl(i.props.kind) || i.props.kind === n) return t;
  const s = Ue(n, Yt(i.placement.mode));
  if (!oa(s, i.placement)) return t;
  const o = ci({ ...i, props: s });
  return Oe(t, t.devices.map((r) => r === i ? o : r));
}
function Pu(t, e) {
  return Oe(t, t.devices.filter((n) => n.id !== e));
}
function pa(t) {
  return Oe(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = rt(t, e.placement.wallId), i = n === null || e.placement.offset < -Wn || e.placement.offset > n + Wn;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function ha(t) {
  const e = [];
  for (const n of Xl(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function bs(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!bt(e, s)) continue;
    const o = Math.abs(ke(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const Hi = 1e-3;
function fa(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(ke(t)) - Math.abs(ke(e))) > Hi ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= Hi && Math.abs(n.y - i.y) <= Hi));
}
const ma = 2, lr = Math.ceil(360 / ma), ar = 1e-4, Lu = 1e-9, cr = 1e-9, Ou = {
  light: Jl,
  motion: ta
};
function ga(t, e) {
  const n = [];
  for (const i of Yl([...Xs(t, Ou[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Ys(t, e, n) {
  return e.filter(([i, s]) => xe(t, i, s) <= n);
}
function Ri(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function zu(t, e, n) {
  const i = Ys(t, e, n), s = [];
  for (let w = 0; w < lr; w++) s.push(-Math.PI + 2 * Math.PI * w / lr);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (O(t, g) > o) continue;
      const $ = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(Ri($ - ar), Ri($), Ri($ + ar));
    }
  s.sort((w, g) => w - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), d = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    l[$] = w.x - t.x, a[$] = w.y - t.y, d[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const c = [], p = [];
  let h = NaN;
  for (const w of s) {
    if (w === h) continue;
    h = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let k = n, M = -1;
    for (let E = 0; E < r; E++) {
      const P = g * u[E] - $ * d[E];
      if (Math.abs(P) < 1e-12) continue;
      const D = (l[E] * u[E] - a[E] * d[E]) / P;
      if (!(D > Lu && D < k)) continue;
      const H = (l[E] * $ - a[E] * g) / P;
      H < -cr || H > 1 + cr || (k = D, M = E);
    }
    const x = { x: t.x + g * k, y: t.y + $ * k }, A = c.length;
    if (!(A > 0 && c[A - 1].x === x.x && c[A - 1].y === x.y)) {
      if (M >= 0 && A >= 2 && p[A - 1] === M && p[A - 2] === M) {
        c[A - 1] = x;
        continue;
      }
      c.push(x), p.push(M);
    }
  }
  const m = c[0], y = c[c.length - 1];
  return c.length > 1 && m.x === y.x && m.y === y.y && c.pop(), c;
}
const Nu = 32, dr = 128;
function qn(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function Pe(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Qs(t) {
  return (t % 360 + 360) % 360;
}
function va(t) {
  return (t % 360 + 540) % 360 - 180;
}
function wa(t, e, n, i) {
  const s = t.walls.find((d) => d.id === e);
  if (!s) return null;
  let o;
  try {
    o = ie(t, s);
  } catch {
    return null;
  }
  const r = ee(o.dir), l = n === "left" ? r : I(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: N(N(o.a, I(o.dir, i)), I(l, a)), normal: l };
}
function Jt(t, e, n, i) {
  var s;
  return ((s = wa(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function ne(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: qn(n.rotation) };
  const i = wa(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: N(i.pt, I(s, r)), dir: ee(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? qn(Pe(s) + n.aim) : s, normal: s };
}
function ur(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let d;
    try {
      d = ie(t, a);
    } catch {
      continue;
    }
    const u = a.a === n ? d.dir : I(d.dir, -1);
    if (Math.abs(oe(i, u)) < 1e-9 && B(i, u) < 0) {
      if ((B(ee(d.dir), s) > 0 ? d.leftOff : d.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (B(u, s) > 1e-9) return !1;
  }
  return l;
}
function Js(t, e, n, i) {
  var H;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((z) => z.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = ie(t, s);
  } catch {
    return n;
  }
  const r = Zl(t), l = r.filter((z) => z.wallId === n.wallId && z.side === n.side), a = l.find((z) => z.end === "a"), d = l.find((z) => z.end === "b");
  if (!a || !d) return n;
  const u = ee(o.dir), c = n.side === "left" ? u : I(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, h = ur(t, s, s.a, o.dir, c, p) ? -1 / 0 : a.offset, m = ur(t, s, s.b, I(o.dir, -1), c, p) ? 1 / 0 : d.offset, y = (z) => B(C(z, o.a), o.dir), w = [];
  for (const z of t.nodes)
    if (((H = z.host) == null ? void 0 : H.wallId) === s.id)
      for (const V of t.walls) {
        const W = V.a === z.id ? "a" : V.b === z.id ? "b" : null, q = W && t.nodes.find((T) => T.id === (W === "a" ? V.b : V.a));
        if (!q || (B(C(q, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const Q = r.filter((T) => T.wallId === V.id && T.end === W).map((T) => y(T.pt));
        Q.length && w.push([Math.min(...Q), Math.max(...Q)]);
      }
  w.sort((z, V) => z[0] - V[0]);
  const g = [];
  let $ = h;
  for (const [z, V] of w) {
    const W = Math.min(z, m);
    W > $ && g.push([$, W]), $ = Math.max($, V);
  }
  m > $ && g.push([$, m]), g.length === 0 && g.push([h, m]);
  const k = ([z, V]) => Math.max(0, z - n.offset, n.offset - V), [M, x] = g.reduce((z, V) => k(V) < k(z) ? V : z), A = (e.shape === "circle" ? e.diameter : e.width) / 2, E = M + A, P = x - A;
  let D = n.offset;
  return E > P ? D = (M + x) / 2 : D <= E + i ? D = E : D >= P - i && (D = P), D = Math.max(0, Math.min(o.len, D)), Math.abs(D - n.offset) < 1e-9 ? n : { ...n, offset: D };
}
function ba(t, e) {
  const n = [];
  for (let i = 0; i < dr; i++) n.push(N(t, I(qn(360 * i / dr), e)));
  return n;
}
function pr(t, e, n, i) {
  if (n >= 360) return ba(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Nu)), o = Pe(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(N(t, I(qn(o + n * l / s), i)));
  return r;
}
const Du = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function vi(t) {
  return Du[t] ?? null;
}
const Tu = (t) => vi(t.kind) !== null;
function Vu(t, e) {
  const n = e.props;
  if (!Tu(n)) return null;
  const i = ne(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? pr(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? pr(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? ba(i.pt, n.poolRadius) : null;
  }
}
function Hu(t) {
  return t.normal ? N(t.pt, t.normal) : t.pt;
}
function hr(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Ru(t, e, n) {
  const i = C(e, t);
  for (const [s, o] of n) {
    const r = C(o, s), l = C(s, t), a = oe(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const d = oe(l, r) / a, u = oe(l, i) / a;
    if (d >= 0 && d <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const fr = 0.5, Bu = 3, Fu = 1e-4;
function Uu(t, e, n) {
  const i = ne(t, e);
  if (!i) return null;
  const s = Hu(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (x) => hr(x, n) || Ys(x, n, fr).length > 0;
  if (!r(s)) return s;
  const l = ie(t, t.walls.find((x) => x.id === o.wallId)), a = i.normal, d = (x) => Math.abs(B(C(x, i.pt), a)) <= Fu, u = ([x, A]) => I(N(x, A), 0.5), c = n.filter((x) => d(x[0]) && d(x[1]) && O(x[0], x[1]) > 1e-9 && !hr(N(u(x), I(a, fr)), n)), p = (x) => B(C(x, l.a), l.dir), h = ([x, A]) => Math.max(0, Math.min(p(x), p(A)) - o.offset, o.offset - Math.max(p(x), p(A))), m = Math.min(...c.map(h)), y = c.filter((x) => h(x) <= m + 1e-6).map((x) => N(u(x), a)), w = (x) => y.some((A) => !Ru(x, A, n)), g = Bu * Math.max(...t.walls.map((x) => x.thickness)) + 2, $ = [];
  for (const [x, A] of n) {
    const E = C(A, x), P = C(x, s), D = oe(l.dir, E);
    if (Math.abs(D) < 1e-12) continue;
    const H = oe(P, l.dir) / D;
    if (H < -1e-9 || H > 1 + 1e-9) continue;
    const z = oe(P, E) / D, V = O(x, A) / Math.abs(D);
    $.push(z - V, z + V);
  }
  const k = o.offset <= l.len / 2 ? 1 : -1, M = $.filter((x) => Math.abs(x) <= g).sort((x, A) => Math.abs(x) - Math.abs(A) || Math.sign(A) * k - Math.sign(x) * k);
  for (const x of M) {
    const A = N(s, I(l.dir, x));
    if (!r(A) && w(A)) return A;
  }
  return null;
}
const Wu = 1 / Math.cos(ma / 2 * (Math.PI / 180)), mr = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function ju(t, e, n = ga) {
  const i = Vu(t, e), s = vi(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = Uu(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((c) => O(c, r))) * Wu, a = Ys(r, o, l);
  if (a.length === 0) return [i];
  const d = zu(r, a, l);
  let u;
  try {
    u = Wl.intersection(ws(mr(i)), ws(mr(d)));
  } catch {
    return [d];
  }
  return u.flatMap((c) => c.map(Kl));
}
function qu(t, e, n, i) {
  const s = ne(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, B(C(n, s.pt), s.dir)));
    return O(N(s.pt, I(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return O(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return O(s.pt, n) <= i;
  if (o.shape === "circle") return O(s.pt, n) <= o.diameter / 2 + i;
  const r = C(n, s.pt);
  return Math.abs(B(r, s.dir)) <= o.width / 2 + i && Math.abs(B(r, ee(s.dir))) <= o.depth / 2 + i;
}
function ya(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && qu(t, i[o], e, n)) return i[o].id;
  return null;
}
const Zu = 60;
function ys(t, e, n) {
  if (!Hl.has(e.props.kind)) return null;
  const i = ne(t, e);
  return i ? { from: i.pt, to: N(i.pt, I(i.dir, Zu / n)) } : null;
}
function $a(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function Gu(t, e, n, i) {
  const s = e.placement, o = ne(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = Pe(C(n, o.pt)), l = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: Qs(l(r)) };
  const a = va(r - Pe(o.normal)), d = Math.max(-wt, Math.min(wt, l(a)));
  return $a(s, d);
}
const Ku = 1, Zn = 1, gr = 1e-6, Xu = 1e-9, Yu = 1e-6, Qu = 1;
function eo(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = rt(t, e.wallId);
      return n === null ? null : Jt(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function re(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => eo(t, i) ?? { x: i.x, y: i.y });
}
function to(t, e) {
  const n = re(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(ke(n)) / 1e5) / 10;
}
function Tt(t, e, n) {
  const i = oe(C(e, t), C(n, t));
  return Math.abs(i) <= Xu * O(t, e) * O(t, n) ? 0 : Math.sign(i);
}
const wn = (t, e, n) => B(C(e, t), C(n, t)) <= 0;
function xa(t, e, n, i) {
  const s = Tt(n, i, t), o = Tt(n, i, e), r = Tt(t, e, n), l = Tt(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && wn(n, t, e) || l === 0 && wn(i, t, e) || s === 0 && wn(t, n, i) || o === 0 && wn(e, n, i);
}
function Ju(t) {
  const e = [];
  for (const n of t) (e.length === 0 || O(e[e.length - 1], n) > gr) && e.push(n);
  for (; e.length > 1 && O(e[0], e[e.length - 1]) <= gr; ) e.pop();
  return e;
}
function Gn(t) {
  const e = Ju(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (Tt(s, o, r) === 0 && B(C(o, s), C(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && xa(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function ka(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : eo(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = rt(t, o.wallId);
    return r !== null && (o.offset < -Zn || o.offset > r + Zn);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = re(t, e);
  return Math.abs(ke(s)) < Qu || Gn(s) ? "crossing" : null;
}
function St(t, e) {
  return bt(e, t) || t.some((n, i) => xe(e, n, t[(i + 1) % t.length]) <= Ku);
}
const Ma = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function ep(t, e) {
  const n = ne(t, e);
  return n ? t.zones.filter((i) => St(re(t, i), n.pt)).map((i) => ({ zone: i, participates: Ma(e, i.id) })) : [];
}
function pn(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = re(t, n), s = [];
  for (const o of t.devices) {
    const r = ne(t, o);
    r && St(i, r.pt) && s.push({ device: o, participates: Ma(o, e) });
  }
  return s;
}
function tp(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = ke(t);
  if (Math.abs(n) > Yu) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], d = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * d, s += (l.y + a.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (bt(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const Bi = 32;
function vr(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, xe(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function _a(t) {
  const e = t.zones.map((s) => re(t, s)), n = e.map((s) => Math.abs(ke(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter((y, w) => w !== o && y.length >= 3 && n[w] < n[o] && y.every((g) => St(r, g))), a = tp(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const d = r.map((y) => y.x), u = r.map((y) => y.y), c = Math.min(...d), p = Math.min(...u), h = Math.max(Math.max(...d) - c, Math.max(...u) - p) / Bi;
    let m = null;
    for (let y = c + h / 2; y < c + h * Bi; y += h)
      for (let w = p + h / 2; w < p + h * Bi; w += h) {
        const g = { x: y, y: w };
        if (!bt(g, r) || l.some((k) => bt(g, k))) continue;
        const $ = Math.min(vr(g, [r]), vr(g, l));
        (!m || $ > m.d) && (m = { p: g, d: $ });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const no = 3, $t = (t, e) => ({ ...t, zones: e }), en = (t, e, n) => $t(t, t.zones.map((i) => i === e ? n : i)), io = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), Sa = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function np(t, e) {
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
function ip(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && Sa(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => np(n, e.vertices[i]));
}
function Aa(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && ip(t.shape, e.shape);
}
function sp(t, e) {
  if (e.kind === "free") return e;
  const n = eo(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : io(e);
}
function Ea(t, e) {
  const n = e.shape, i = n.vertices.map((s) => sp(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function op(t, e, n) {
  const i = t.shape, s = bs(e, i.seed);
  return !s || n.some((o) => fa(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && Sa(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function Ia(t, e) {
  const n = ka(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const so = (t, e) => Ia(t, Ea(t, e));
function rp(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? ha(t) : [], i = [], s = e.map((o) => Ia(
    t,
    o.shape.kind === "walls" ? op(o, n, i) : Ea(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? $t(t, s) : t;
}
function lp(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && Aa(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : $t(t, i) : s.some((o, r) => o !== n[r]) ? $t(t, s) : t;
}
function ap(t, e, n) {
  const i = ha(t), s = bs(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = bs(i, r.shape.seed);
    if (l && fa(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: Y(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: $t(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const oo = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function cp(t, e, n) {
  if (e.length < no) return { level: t, zoneId: null };
  const i = so(t, { id: Y(), name: n, shape: { kind: "polygon", vertices: e.map(oo) }, invalid: !1 });
  return Gn(re(t, i)) ? { level: t, zoneId: null } : { level: $t(t, [...t.zones, i]), zoneId: i.id };
}
function dp(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : en(t, i, { ...i, name: n });
}
function ro(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return en(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return en(t, i, o);
}
function Ca(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Pa(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? Ca(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function lo(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function ao(t, e, n) {
  const i = so(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return Aa(i, e) ? t : en(t, e, i);
}
const co = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function up(t, e, n, i) {
  const s = lo(t, e);
  return !s || !co(n, s.shape.vertices.length) ? t : ao(t, s, s.shape.vertices.map((o, r) => r === n ? oo(i) : o));
}
function pp(t, e, n, i) {
  const s = lo(t, e);
  if (!s || !co(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, oo(i)), ao(t, s, o);
}
function hp(t, e, n) {
  const i = lo(t, e);
  return !i || i.shape.vertices.length <= no || !co(n, i.shape.vertices.length) ? t : ao(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function fp(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < no) return t;
  const i = n.shape.outline.map(io);
  return en(t, n, so(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function La(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Ca(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const tn = 1;
function Se(t) {
  return structuredClone(t);
}
function wi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function mp(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function bi(t, e, n) {
  const i = X(t, e.a), s = X(t, e.b), o = O(i, s), r = mp(typeof n == "number" ? n : pi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Fl(i, s, r / o), offset: r };
}
function gp(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = bi(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Oa(t, e) {
  gp(t), e && yp(e, t);
  const n = rp(pa(dn(t)));
  return e ? lp(n, e) : n;
}
function ze(t, e) {
  return Oa(Se(t), e);
}
function za(t, e, n) {
  const i = hi(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = bi(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function wr(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: X(t, e.nodeId), nodeId: e.nodeId };
  const n = wi(t, e.wallId), { pt: i, offset: s } = bi(t, n, e.offset), o = O(X(t, n.a), X(t, n.b));
  return s <= tn ? { pt: X(t, n.a), nodeId: n.a } : o - s <= tn ? { pt: X(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function br(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: Y(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function vp(t, e, n, i) {
  const s = wr(t, e), o = wr(t, n);
  if (O(s.pt, o.pt) < tn) return { level: t, wallId: null, endNodeId: null };
  const r = Se(t), l = br(r, s), a = br(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const d = { id: Y(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: ze(r, t), wallId: d.id, endNodeId: a };
}
function Na(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < tn || a - l < tn ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function wp(t, e, n, i, s) {
  const o = Na(e, n, i.thickness, s);
  if (!o) return t;
  const r = Se(t), l = o.map((a) => {
    const d = { id: Y(), x: a.x, y: a.y };
    return r.nodes.push(d), d.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: Y(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return ze(r, t);
}
function bp(t, e, n) {
  const i = Se(t);
  return za(i, e, n), Oa(i, t);
}
function yp(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const s = t.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = t.nodes.find((c) => c.id === s.a), r = t.nodes.find((c) => c.id === s.b), l = e.nodes.find((c) => c.id === i.a), a = e.nodes.find((c) => c.id === i.b);
    if (!o || !r || !l || !a || o.x === l.x && o.y === l.y) continue;
    const d = O(l, a);
    if (d === 0) continue;
    const u = ui(C(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = pi(N(o, I(u, c.offset)), l, a) * d);
  }
}
function $p(t, e, n) {
  const i = Se(t), s = wi(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: N(X(i, l), n) }));
  for (const l of r) za(i, l.id, l.to);
  return ze(i, t);
}
function yi(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Da(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function xp(t, e, n) {
  const i = Se(t), s = wi(i, e), o = s[n], r = X(i, o), l = { id: Y(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || Da(i, o, l.id), yi(i), { level: ze(i, t), nodeId: l.id };
}
function kp(t, e, n) {
  if (e === n) return t;
  const i = Se(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Da(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), yi(i), ze(i, t);
}
function uo(t, e) {
  var i;
  const n = Se(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return yi(n), ze(n, t);
}
function Mp(t, e, n) {
  const i = Se(t);
  return Object.assign(wi(i, e), n), ze(i, t);
}
const ue = (t) => typeof t == "string" && t !== "" ? t : null, Ta = (t) => t.split(".")[0], _p = ["friendly_name", "device_class", "unit_of_measurement"];
function Va(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: Ta(t),
    name: ue(n.friendly_name) ?? t,
    deviceClass: ue(n.device_class),
    unit: ue(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Sp(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Va(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Ap(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && _p.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function Ha(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Ep(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Va(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: ue(r.name) ?? ue(r.original_name) ?? l.name,
      deviceId: ue(r.device_id),
      areaId: ue(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: ue(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: ue(r.name_by_user) ?? ue(r.name) ?? r.id, model: ue(r.model), areaId: ue(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Ip(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Ra(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Ha(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Cp = {
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
  "rules.template.leak": "Leak -> valve",
  "rules.template.timer": "Timer",
  "rules.template.outside": "Outside light",
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
  "vent.problem.sensor": "Choose the wet zone sensor",
  "vent.problem.than": "Choose the sensor to compare with",
  "vent.problem.fan": "Choose the fan",
  "vent.problem.runon": "Run-on: 0 to 60 min",
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
function f(t) {
  return Cp[t] ?? t;
}
const Pp = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Lp = 10;
function At(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return _t(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function Ba() {
  return { blocks: [{ id: Y(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Op(t, e, n, i) {
  const s = { id: Y(), x: e.x, y: e.y }, o = { ...s, name: `${f(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
  switch (t) {
    case "device":
      return { ...s, kind: t, deviceId: i ?? "", output: !1 };
    case "bus":
      return { ...o, kind: t, w: 240, h: 12 };
    case "transfer":
      return { ...o, kind: t, form: "2in1out" };
    default:
      return { ...o, kind: t };
  }
}
function yr(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function $i(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function zp(t, e, n, i) {
  return $i(t, e, (s) => ({ ...s, x: n, y: i }));
}
const $s = (t) => "block" in t ? t.block : t.bus, Fa = (t, e) => $s(t.from) === e || $s(t.to) === e;
function nn(t, e, n, i) {
  const s = t.blocks.find((d) => d.id === e);
  if (!s) return t;
  const o = $i(t, e, (d) => ({ ...d, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((d) => !Fa(d, e)) };
  const r = o.blocks.find((d) => d.id === e), l = new Set(At(r, i).map((d) => d.name)), a = (d) => "block" in d && d.block === e && !l.has(d.port);
  return o.wires.some((d) => a(d.from) || a(d.to)) ? { ...o, wires: o.wires.filter((d) => !a(d.from) && !a(d.to)) } : o;
}
function Ua(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Fa(i, e)) };
}
const Wa = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function xi(t, e, n) {
  const i = Wa(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((d) => i.has(d.id)).map((d) => [d.id, new Set(At(d, n).map((u) => u.name))])), o = (d) => "block" in d && !!s.get(d.block) && !s.get(d.block).has(d.port), r = t.wires.filter((d) => !o(d.from) && !o(d.to));
  let l = !1;
  const a = t.blocks.map((d) => {
    const u = s.get(d.id);
    if (!u || !d.portPins || Object.keys(d.portPins).every((m) => u.has(m))) return d;
    l = !0;
    const c = Object.fromEntries(Object.entries(d.portPins).filter(([m]) => u.has(m))), { portPins: p, ...h } = d;
    return Object.keys(c).length ? { ...h, portPins: c } : h;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Np(t, e) {
  const n = po(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = xi(s, o, n);
  return s;
}
function Dp(t, e) {
  const n = Wa(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has($s(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const po = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function ja(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Pu(t, n);
  return { level: s, power: i ? Dp(e, n) : xi(e, n, po(s)) };
}
function qa(t, e, n, i) {
  const s = da(t, n, i);
  return { level: s, power: s === t ? e : xi(e, n, po(s)) };
}
function Za(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Tp(t, e, n, i) {
  return $i(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function Vp(t, e) {
  return $i(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function $r(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Hp(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, Lp), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((u, c) => r.set(u.id, o & 1 << c ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (u) => {
      let c = u;
      for (; l.has(c) && l.get(c) !== c; ) c = l.get(c);
      return c;
    }, d = (u, c) => {
      if ("bus" in u) return `n:${u.bus}`;
      const p = s.get(u.block);
      return p !== void 0 && u.port !== p && u.port !== (r.get(u.block) ?? "A") ? `x:${c.id}:${u.port}` : `n:${u.block}`;
    };
    for (const u of e) {
      const c = a(d(u.from, u)), p = a(d(u.to, u));
      if (c === p) return !0;
      l.set(c, p);
    }
  }
  return !1;
}
function xr(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const $ = s.get(g.block), k = $ ? At($, i).find((M) => M.name === g.port) : void 0;
    return $ && k ? { bl: $, dir: k.dir } : null;
  }, r = o(e), l = o(n);
  if (!r || !l) return { error: "missing" };
  if (r.bl.id === l.bl.id) return { error: "same-block" };
  let a = e, d = n;
  if (r.dir === null || l.dir === null)
    (r.dir === "in" || l.dir === "out") && (a = n, d = e);
  else {
    if (r.dir === l.dir)
      return { error: "direction" };
    r.dir === "in" && (a = n, d = e);
  }
  const u = (g) => "block" in g && t.wires.some(($) => [$.from, $.to].some((k) => "block" in k && k.block === g.block && k.port === g.port));
  if (u(a) || u(d)) return { error: "port-taken" };
  const c = (g) => {
    for (const $ of t.wires)
      for (const [k, M] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in k && k.bus === g && "block" in M) {
          const x = s.get(M.block);
          if (x) return $r(x, M.port);
        }
    return null;
  }, p = (g) => "bus" in g ? c(g.bus) : $r(s.get(g.block), g.port), h = p(a), m = p(d);
  if (h !== null && m !== null && h !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in d && s.get(d.block).kind === "remainder" && t.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const y = { id: Y(), from: a, to: d }, w = [...t.wires, y];
  return Hp(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: y };
}
const Ee = (t) => typeof t == "object" && t !== null && !Array.isArray(t), gt = (t) => typeof t == "number" && Number.isFinite(t), Rp = ["top", "right", "bottom", "left"], Bp = ["2in1out", "1in2out"];
function Fp(t, e) {
  let n = t;
  if (n.kind === "bus" && !(gt(n.w) && gt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Bp.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(At(n, e).map((d) => d.name)), o = {};
  let r = Ee(i);
  for (const [d, u] of Ee(i) ? Object.entries(i) : []) {
    if (!s.has(d) || !Ee(u) || !Rp.includes(u.side) || !gt(u.at)) {
      r = !1;
      continue;
    }
    const c = Math.min(1, Math.max(0, u.at));
    c !== u.at && (r = !1), o[d] = c === u.at ? u : { side: u.side, at: c };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(o).length ? { ...a, portPins: o } : a;
}
function Up(t, e) {
  if (!Ee(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (Ee(u) && typeof u.id == "string" && u.id && Pp.includes(u.kind) && gt(u.x) && gt(u.y)) {
      const c = Fp(u, e);
      c !== u && (s = !0), c.kind === "transfer" && c.form !== u.form && r.add(c.id), o.push(c);
    } else s = !0;
  const l = new Map(o.map((u) => [u.id, u])), a = (u) => {
    var p;
    if (!Ee(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = l.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !gt(u.at)) return null;
      const h = Math.min(1, Math.max(0, u.at));
      return h === u.at ? u : { bus: u.bus, at: h };
    }
    const c = typeof u.block == "string" ? l.get(u.block) : void 0;
    return c && !r.has(c.id) && At(c, e).some((h) => h.name === u.port) ? u : null;
  }, d = [];
  for (const u of i) {
    const c = Ee(u) ? a(u.from) : null, p = Ee(u) ? a(u.to) : null;
    if (!Ee(u) || typeof u.id != "string" || !u.id || !c || !p) {
      s = !0;
      continue;
    }
    c === u.from && p === u.to ? d.push(u) : (s = !0, d.push({ ...u, from: c, to: p }));
  }
  return s ? { ...t, blocks: o, wires: d } : t;
}
function Ga(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function Wp(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const hn = 11, Kn = 18, Xn = 30, jp = 12, qp = 120, de = 14, kr = 10, sn = (t) => Math.round(t / kr) * kr || 0, Fi = 24, Mr = 6, Zp = 2 * hn + 6, Gp = de, Kp = 1e6, _r = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, ki = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Ui = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Ka = (t) => Math.min(1, Math.max(0, t));
function Mi(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function Xp(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = _t(i);
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
function Me(t, e, n) {
  return n ? mo(n, t, e).r : ho(t, e);
}
function ho(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(qp, 7 * Mi(t, e).length + 32),
    h: Xn + Kn * Xp(t, e) + jp
  };
}
function Yn(t, e, n) {
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
function Yp(t, e) {
  const n = ki(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function Qp(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = xe(e, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Ka(r) };
}
const on = (t) => t.w >= t.h;
function Xa(t, e) {
  return on(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function Jp(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = on(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Yn(i, r, 0.5), side: r };
  }
  const s = ki(i), o = on(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: Yn(i, o, e), side: o };
}
function eh(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const fo = (t, e) => t.blocks.find((n) => n.id === e), xs = (t, e) => {
  const n = fo(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Wi = (t, e, n) => "block" in t && t.block === e && t.port === n;
function th(t, e, n, i) {
  const s = t.wires.find((l) => Wi(l.from, e, n) || Wi(l.to, e, n));
  if (!s) return null;
  const o = Wi(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = xs(t, o.bus);
    return l ? Xa(l, o.at) : null;
  }
  const r = fo(t, o.block);
  return r ? ki(ho(r, i)) : null;
}
function mo(t, e, n) {
  const i = ho(e, n), s = ki(i), o = At(e, n).map((d) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[d.name];
    if (u) return { ...d, side: u.side, pin: u, key: 0 };
    const c = th(t, e.id, d.name, n), p = (c && Yp(i, c)) ?? eh(e, d), h = c ?? s;
    return { ...d, side: p, pin: void 0, key: p === "top" || p === "bottom" ? h.x : h.y };
  }), r = (d) => {
    const u = o.filter((c) => c.side === d).length;
    return u ? (u + 1) * Zp : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((d, u) => {
    d.pin && (a[u] = { name: d.name, dir: d.dir, side: d.side, pt: Yn(l, d.side, d.pin.at), pinned: !0 });
  });
  for (const d of ["top", "right", "bottom", "left"]) {
    const u = o.map((c, p) => ({ p: c, i: p })).filter(({ p: c }) => !c.pin && c.side === d).sort((c, p) => c.p.key - p.p.key || c.i - p.i);
    u.forEach(({ p: c, i: p }, h) => {
      a[p] = { name: c.name, dir: c.dir, side: d, pt: Yn(l, d, (h + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function _i(t, e, n) {
  return mo(t, e, n).places;
}
function Ya(t, e, n) {
  const i = (d) => {
    if (!("block" in d)) return null;
    const u = fo(t, d.block);
    if (!u) return null;
    const { r: c, places: p } = mo(t, u, n), h = p.find((m) => m.name === d.port);
    return h ? { pt: h.pt, side: h.side, rect: c } : null;
  }, s = (d, u, c) => {
    if (!("bus" in d)) return null;
    const p = xs(t, d.bus);
    if (!p) return null;
    let h = c == null ? void 0 : c.pt;
    if (!h && "bus" in u) {
      const m = xs(t, u.bus);
      h = m && Xa(m, u.at);
    }
    return h ? { ...Jp(p, d.at, h), rect: Me(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const bn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), ks = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function nh(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const d = bn(i[i.length - 2], a), u = bn(a, l);
        if (d.x === u.x && d.y === u.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (d.x === -u.x && d.y === -u.y) return null;
      }
      i.push(l);
    }
  }
  const s = i.length;
  if (s < 2 || s > 6) return null;
  const o = bn(i[0], i[1]), r = bn(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || ks(i[0], i[1]) < de - 1e-9 || r.x !== -n.x || r.y !== -n.y || ks(i[s - 2], i[s - 1]) < de - 1e-9 ? null : i;
}
function ih(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function sh(t, e) {
  let n = (t.length - 2) * Gp;
  for (let i = 1; i < t.length; i++) {
    n += ks(t[i - 1], t[i]);
    for (const s of e) ih(t[i - 1], t[i], s) && (n += Kp);
  }
  return n;
}
function Qa(t, e) {
  const n = t.pt, i = e.pt, s = _r[t.side], o = _r[e.side], r = { x: n.x + s.x * de, y: n.y + s.y * de }, l = { x: i.x + o.x * de, y: i.y + o.y * de }, a = [t.rect, e.rect].filter((k) => !!k), d = (k, M) => [.../* @__PURE__ */ new Set([
    (r[k] + l[k]) / 2,
    r[k],
    l[k],
    n[k],
    i[k],
    ...a.flatMap((x) => [x[k] - de, x[k] + x[M] + de]),
    Math.min(r[k], l[k]) - de,
    Math.max(r[k], l[k]) + de
  ])], u = d("x", "w"), c = d("y", "h"), p = s.x === 0, h = o.x === 0, m = (p ? c : u).filter((k) => (k - (p ? n.y : n.x)) * (p ? s.y : s.x) >= de - 1e-9), y = (h ? c : u).filter((k) => (k - (h ? i.y : i.x)) * (h ? o.y : o.x) >= de - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (k) => {
    const M = nh(k, s, o);
    if (!M) return;
    const x = sh(M, a);
    x < g - 1e-6 && (w = M, g = x);
  };
  if (p && h)
    for (const k of m) for (const M of u) for (const x of y)
      $([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: x }, { x: i.x, y: x }, i]);
  else if (!p && !h)
    for (const k of m) for (const M of c) for (const x of y)
      $([n, { x: k, y: n.y }, { x: k, y: M }, { x, y: M }, { x, y: i.y }, i]);
  else if (p)
    for (const k of m) for (const M of y)
      $([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: i.y }, i]);
  else
    for (const k of m) for (const M of y)
      $([n, { x: k, y: n.y }, { x: k, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, p ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Ja(t, e, n) {
  const i = Me(t, e, n), s = i.x + (i.w - (3 * Fi + 2 * Mr)) / 2, o = i.y + Xn + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (Fi + Mr), y: o, w: Fi, h: Kn - 2 }
  }));
}
function oh(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return on(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function Sr(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const c = Ja(u, i, t).find((p) => Ui(e, p.rect, 0));
    if (c) return { kind: "chip", block: u.id, position: c.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const c of _i(t, u, i)) {
      const p = O(e, c.pt);
      p <= hn + n && p < r && (o = { kind: "port", block: u.id, port: c.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let c = null, p = 1 / 0;
    for (const h of oh(u)) {
      const m = xe(e, h.a, h.b);
      m <= n && m < p && (c = { kind: "bus-end", id: u.id, end: h.end }, p = m);
    }
    if (c) return c;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !Ui(e, Me(u, i, t), n)) continue;
    const c = on(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Ka(c) };
  }
  let l = null, a = 1 / 0;
  for (const u of t.wires) {
    const c = Ya(t, u, i);
    if (!c) continue;
    const p = Qa(c.a, c.b);
    for (let h = 1; h < p.length; h++) {
      const m = xe(e, p[h - 1], p[h]);
      m <= n && m < a && (l = { kind: "wire", id: u.id }, a = m);
    }
  }
  if (l) return l;
  const d = s.find((u) => u.kind !== "bus" && Ui(e, Me(u, i, t), 0));
  return d ? { kind: "block", id: d.id } : null;
}
function rh(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = Me(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class ec extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function ji(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function lh(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function ah(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new ec(s.message) : s;
  }
}
async function ch(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const dh = 3;
function ye(t) {
  if (typeof t == "number")
    return t === dh ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class uh {
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
    const i = { ...e, id: Y(), name: n, revision: 0 }, s = await this.run(i, null, !1);
    return s === null ? null : { ...i, revision: s };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(e, n, i) {
    const s = this.doRun(e, n, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = s, s;
  }
  async doRun(e, n, i) {
    this.state = "saving", this.errorMessage = null;
    const s = this.dirtyVersion;
    this.onChange();
    try {
      const o = await ah(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof ec ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = ye(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Si = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ai = class {
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
const tc = (t) => t.strings === void 0, ph = {}, go = (t, e = ph) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hh = Si(class extends Ai {
  constructor() {
    super(...arguments), this.key = b;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (go(t), this.key = e), n;
  }
});
var nc = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", fh = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", mh = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", gh = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", vh = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", wh = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", bh = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Ar = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Ct = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", yh = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", $h = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", xh = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", kh = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", ic = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Mh = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", _h = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Sh = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Ah = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Eh = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Ih = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Ch = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Ph = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", sc = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Lh = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", oc = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Oh = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", zh = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Nh = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Dh = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Th = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Vh = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Hh = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Rh = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Bh = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", rc = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", Fh = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Uh = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function lc(t, e, n) {
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
function Wh(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function jh(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function qh(t, e, n, i, s) {
  const o = jh(e, n, i, s);
  if (!o.every((l) => St(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, xe(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function Zh(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? Wh(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const p of t.zones) {
    const h = re(t, p);
    if (h.length < 3 || !St(h, n.pt)) continue;
    const m = Math.abs(ke(h));
    m < a && (a = m, l = h);
  }
  if (!l) return r;
  const d = (p) => {
    const h = lc(p, i, s);
    return qh(l, n.pt.x + h.x, n.pt.y + h.y, i.w, i.h);
  }, u = (p) => {
    let h = null, m = -1;
    for (const y of p) {
      const w = d(y);
      w !== null && w > m && (h = y, m = w);
    }
    return h;
  }, c = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const p = r === "up" || r === "down", h = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (d(r) !== null) return r;
    const m = c.filter((y) => p ? y.startsWith(r) : y.endsWith(r));
    return u(m) ?? u(p ? ["right", "left"] : ["down", "up"]) ?? (d(h) !== null ? h : r);
  }
  return u(["right", "left"]) ?? u(c) ?? u(["down", "up"]) ?? r;
}
const ae = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function $e(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function ac(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${f("unit.m2")}`;
}
const fn = 12, j = "non-scaling-stroke", Gh = 7, Kh = 10, Qn = "#f43f5e", Er = "3 2", Ir = 18, Xh = 6, Cr = 11, Yh = 0.6, Qh = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", cc = 24, yn = 4, Pr = 4, On = fn * 0.85, Jh = 0.58;
function ef(t, e, n, i) {
  const s = cc;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, d] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], u = a * i - 2 * Pr, c = d * i - 2 * Pr, p = e.length * Jh * On, h = s + yn + On, m = s + yn + p, y = Math.max(s, p), w = (M, x) => Math.max(0, M - u) + Math.max(0, x - c), g = w(y, h), $ = w(m, s);
  if (g > 0 && $ < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + yn) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const k = -h / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (k + s / 2) / i,
    labelX: 0,
    labelY: (k + s + yn + On / 2) / i,
    labelAnchor: "middle"
  };
}
function tf(t, e, n, i = 0, s = 0) {
  const o = cc / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${Qh} fill=${n}></path></g>`;
}
const nf = "__preview__", sf = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, of = /* @__PURE__ */ new WeakMap();
function rf(t, e) {
  var s;
  const n = $e(of, t.walls, () => /* @__PURE__ */ new WeakMap()), i = $e(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = $e(i, t.openings, () => ({})))[e] ?? (s[e] = ga(t, e));
}
const lf = /* @__PURE__ */ new WeakMap();
function dc(t, e) {
  const n = vi(e.props.kind);
  if (!n) return [];
  const i = rf(t, n), s = $e(lf, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = ju(t, e, () => i), s.set(e, o)), o;
}
function Jn(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function af(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, d = s ?? b;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${d} vector-effect=${j}></circle>` : _`<circle class="icon" r=${Jn(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></path>`;
    case "motion_sensor": {
      const u = (c) => `M${e * c} ${-e * c * 0.8}A${e * c} ${e * c * 0.8} 0 0 1 ${e * c} ${e * c * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let c = 0; c < 8; c++) {
        const p = c * Math.PI / 4;
        u += `M${Math.cos(p) * e * 1.15} ${Math.sin(p) * e * 1.15}L${Math.cos(p) * e * 1.6} ${Math.sin(p) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${d} vector-effect=${j}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${j}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d}
        vector-effect=${j}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${j}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let c = 0; c < 4; c++) {
        const p = c * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * e * 0.85} ${Math.sin(p) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${j}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    default:
      return _`${b}`;
  }
}
function cf(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${b}`;
  const l = ef(r, r.label, i, e.scale), a = o ?? b, d = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${j}></circle>
      ${s ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : b}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${j}></rect>
      ${s ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : b}`;
  return _`
    <g transform=${`rotate(${i})`}>${d}</g>
    ${tf(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${On / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function df(t, e, n = 0) {
  return t === "bound" ? b : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(fn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${sf[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : b} vector-effect=${j}></circle>`;
}
function uf(t, e, n) {
  if (t.status !== "error") return b;
  const i = e * 0.9, s = -e * 0.9, o = Kh / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${Gh / n.scale} fill=${n.palette.background} stroke=${Qn} stroke-width="1.5"
      vector-effect=${j}></circle>
    <path d=${nc} fill=${Qn} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function pf(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? Qn : t === "event" ? e.selection : e.device;
}
function hf(t, e, n, i, s, o) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return b;
  const l = 1 / o.scale, a = r.map(([w]) => (w.text.length * Cr * Yh + 2 * Xh) * l), d = Ir * l, u = (Ir + 2) * l, c = { w: Math.max(...a), h: d + u * (r.length - 1) }, p = s + 4 * l, h = Math.max(1, i.shown.length), m = Zh(t, e, n, { w: Math.max(...a.slice(0, h)), h: d + u * (h - 1) }, p), y = lc(m, c, p);
  return _`${r.map(([w, g], $) => {
    const k = a[$], M = y.x + (c.w - k) / 2, x = y.y + (m.startsWith("up") ? r.length - 1 - $ : $) * u, A = pf(w.tone, o.palette);
    return hh(`${g}:${w.key ?? ""}`, _`<g class=${`bubble ${g}`} data-tone=${w.tone}>
      <rect x=${M} y=${x} width=${k} height=${d} rx=${d / 2} fill=${o.palette.background} stroke=${A} stroke-width="1.5"
        vector-effect=${j}></rect>
      <text x=${M + k / 2} y=${x + d / 2} text-anchor="middle" dominant-baseline="central" fill=${A} font-weight="700"
        font-size=${Cr * l} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function ff(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Jn(t, fn / e.scale);
}
function mf(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? hf(t, e, n, s, ff(e, i), i) : b;
  return o === b ? b : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : b}>${o}</g>`;
}
function gf(t, e, n, i) {
  var k, M, x;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = fn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((k = n.selection) == null ? void 0 : k.kind) === "device" && n.selection.id === t.id, d = !i && di(t.props.kind), u = d ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, c = i || (x = n.live) == null ? void 0 : x.call(n, t), p = (c == null ? void 0 : c.look) === "on" || (c == null ? void 0 : c.look) === "active", h = d && !!n.containerState && !u || (c == null ? void 0 : c.look) === "no-data", m = t.props.kind, y = !p || t.invalid ? o : m === "leak_sensor" ? Qn : m === "motion_sensor" ? s.motionCone : o, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (h ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : b, $ = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Jn(t, r));
  return _`
    <g class=${w} data-id=${t.id} opacity=${g} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${$ + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${j}></circle>` : b}
      ${t.props.kind === "equipment" ? cf(t, n, o, l, p, h ? Er : void 0) : _`<g transform=${`rotate(${l})`}>${af(
    t,
    r,
    y,
    p ? y : s.deviceFill,
    h ? Er : void 0,
    p ? s.deviceFill : y,
    (c == null ? void 0 : c.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? df(n.bindingStatus(t), n.scale, Jn(t, r)) : b}
      ${u ? uf(u, r, n) : b}
    </g>`;
}
function Lr(t, e, n, i) {
  const s = dc(t, e);
  if (s.length === 0) return b;
  const o = n.palette, r = e.invalid ? o.invalid : vi(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : b, a = s.map(ae).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${j}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${j}></path>`;
}
function vf(t, e, n, i) {
  const s = dc(t, e);
  let o = 0;
  for (const d of s) for (const u of d) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = fn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : b;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? _`<path class="light-fill" d=${s.map(ae).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function wf(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return b;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? ys(t, i, e.scale) : null;
  if (!s) return b;
  const o = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : b}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${j}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${j} style="cursor:grab"></circle>
  </g>`;
}
function bf(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = ne(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: nf, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = ne(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return b;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? vf(t, i.d, i.pose, e) : b : o === "motion_sensor" && s === "active" ? Lr(t, i.d, e, !1) : b;
    }
    return Lr(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => gf(i.d, i.pose, e, i.preview))}</g>
    ${wf(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? b : mf(t, i.d, i.pose, e))}</g>` : b}`;
}
const Or = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], vo = (t) => Or[t % Or.length], it = "non-scaling-stroke", yf = "0.55", $f = /* @__PURE__ */ new WeakMap();
function xf(t, e, n, i) {
  const s = i.palette, o = vo(n), r = i.selectedId === e.id, l = $e($f, t, _a).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${ae(re(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? b : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${it}
        opacity=${i.selectedId !== null && !r ? yf : b}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${ac(to(t, e))}</tspan>
      </text>` : b}
    </g>`;
}
function kf(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => _`
      <path class="zone" data-id=${o.id} d=${ae(re(t, o))} fill="none" stroke=${vo(r)} stroke-width="1"
        vector-effect=${it}></path>`)}</g>`;
  const s = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => xf(t, o, r, e))}</g>`;
}
function Mf(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return _`<g class="zone-members">${pn(t, e).map(({ device: o, participates: r }) => {
    const l = ne(t, o);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${it}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${it}></circle>` : b;
  })}</g>`;
}
function _f(t, e, n) {
  if (e.shape.kind !== "polygon") return b;
  const i = n.palette, s = e.shape.vertices;
  return _`${re(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, d = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${d ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${d ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${it}></circle>`;
  })}`;
}
function Sf(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${it}></polyline>`;
}
function Af(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${ae(re(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${it}></path>` : b}
    ${n ? Mf(t, n.id, e) : b}
    ${n ? _f(t, n, e) : b}
    ${e.draft ? Sf(e.draft, e) : b}</g>`;
}
function et(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Ef = /* @__PURE__ */ new WeakMap(), If = /* @__PURE__ */ new WeakMap(), uc = /* @__PURE__ */ new WeakMap();
function Ei(t, e, n) {
  const i = ee(t.dir), s = N(t.a, I(t.dir, e)), o = N(t.a, I(t.dir, n));
  return [N(s, I(i, t.leftOff)), N(o, I(i, t.leftOff)), C(o, I(i, t.rightOff)), C(s, I(i, t.rightOff))];
}
function rn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ie(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const Z = "non-scaling-stroke";
function Cf(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = rn(t, l.id);
    if (!a) continue;
    const d = ee(a.dir);
    for (const [u, c, p] of [[l.a, a.a, a.dir], [l.b, a.b, I(a.dir, -1)]]) {
      const h = t.nodes.find((x) => x.id === u);
      if (!h || h.host || n.get(u) !== 1) continue;
      const m = N(c, I(d, a.leftOff + i)), y = C(c, I(d, a.rightOff + i)), w = I(d, 1), g = I(N(m, y), 0.5), $ = N(C(g, I(w, -o)), I(p, s / 2)), k = C(C(g, I(w, o)), I(p, s / 2)), M = [m, $, k, y];
      r.push(_`<path class="wall-break" d=${`M${M.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${Z}></path>`);
    }
  }
  return r.length ? _`${r}` : b;
}
function Pf(t, e, n) {
  const i = ee(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : I(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], d = N(N(t.a, I(t.dir, l)), I(o, r)), u = N(N(t.a, I(t.dir, a)), I(o, r)), c = N(d, I(o, e.width)), p = oe(C(c, d), C(u, d)) > 0 ? 1 : 0;
  return _`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${Z}></line>
    <path d=${`M${c.x} ${c.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${Z}></path>`;
}
function Lf(t, e, n) {
  const i = ee(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = N(N(t.a, I(t.dir, e.offset)), I(i, r)), a = N(N(t.a, I(t.dir, e.offset + e.width)), I(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${Z}></line>`;
  });
  return _`${o}`;
}
function Of(t, e, n) {
  const i = rn(t, e.wallId);
  if (!i) return b;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = Ei(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${ae(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Pf(i, e, o) : e.kind === "window" ? Lf(i, e, o) : b}
    </g>`;
}
function zr(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = N(t, I(n, i)), a = N(e, I(n, i)), d = (c, p) => {
    const h = N(p, I(n, i + r));
    return _`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${Z}></line>`;
  }, u = N(I(N(l, a), 0.5), I(n, 9 / s.scale));
  return _`
    <g class="dim">
      ${d(N(t, I(n, 2 / s.scale)), t)}${d(N(e, I(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${Z}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${et(O(t, e))}</text>
    </g>`;
}
function zf(t, e) {
  const n = e.selection;
  if (!n) return b;
  const i = e.palette, s = 4 / e.scale, o = (r) => _`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : b;
  }
  if (n.kind === "wall") {
    const r = $e(uc, t, fi).get(n.id), l = rn(t, n.id);
    if (!r || !l) return b;
    const a = ee(l.dir);
    return _`
      <path d=${ae(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${Z}></path>
      ${o(l.a)}${o(l.b)}
      ${zr(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), l = r ? rn(t, r.wallId) : null;
    if (!r || !l) return b;
    const a = I(ee(l.dir), -1), d = l.rightOff + 18 / e.scale, u = (p) => N(l.a, I(l.dir, p)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${ae(Ei(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${Z}></path>
      ${c.filter(([p, h]) => h - p >= 1).map(([p, h]) => zr(u(p), u(h), a, d, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${ae(re(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${Z}></path>` : b;
  }
  return b;
}
function Nf(t, e, n) {
  return O(t, e) < 1e-6 ? null : Ei(ql(t, e, n.thickness, n.baseline), 0, O(t, e));
}
function Df(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? rn(t, r.wallId) : null;
  return _`
    ${o ? _`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${Z}></path>` : b}
    ${(n.walls ?? []).map((a) => {
    const d = Nf(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${d ? _`<path d=${ae(d)} fill=${i.selection} fill-opacity="0.35"></path>` : b}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${Z}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ae(Ei(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : b}
    ${Vf(t, e)}`;
}
function Tf(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${Z}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${Z}></rect></g>`;
}
function Vf(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Tf(n.anchor, e) : b, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / e.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let u, c = b;
  if (o.kind === "node" || o.kind === "corner") {
    const h = r(5);
    u = _`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - h} y=${a - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${Z}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${l} ${a - h}L${l + h * 0.866} ${a + h / 2}L${l - h * 0.866} ${a + h / 2}Z`;
    u = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${Z}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const h = r(7), m = `M${l} ${a - h}L${l + h} ${a}L${l} ${a + h}L${l - h} ${a}Z`;
    u = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${d.stroke} stroke-width="5"
      vector-effect=${Z}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${Z}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const h = r(5), m = `M${l - h} ${a - h}L${l + h} ${a + h}M${l - h} ${a + h}L${l + h} ${a - h}`;
    u = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${Z}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${Z}></path></g>`;
    const y = o.endpoint.kind === "wall" ? $e(uc, t, fi).get(o.endpoint.wallId) : void 0;
    y && (c = _`<path class="snap-wall-hl" d=${ae(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${Z}></path>`);
  } else {
    const h = r(4), m = `M${l - h} ${a}H${l + h}M${l} ${a - h}V${a + h}`;
    u = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${Z}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${Z}></path></g>`;
  }
  const p = f(`snapmark.${o.kind}`);
  return _`
    ${c}${s}${u}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${Z} font-family="system-ui, sans-serif">${p}</text>`;
}
function Hf(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = $e(Ef, n, (h) => Xl(h, !0)), o = n.walls.filter((h) => h.type === "railing" || h.type === "fence"), r = o.length ? $e(If, n, Xs) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", d = a ? b : String(i.dimOpacity), u = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, c = e.mode ?? "plan";
  return _`
    ${kf(n, { palette: i, scale: e.scale, selectedId: u, mode: c === "automation" ? "plan" : c })}
    <path class="walls" d=${s.map((h) => h.map(ae).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${d}></path>
    ${r ? _`<g class="railings" opacity=${d}>${o.flatMap((h) => (r.get(h.id) ?? []).map((m) => _`<path d=${ae(m)} fill=${i.railing}></path>`))}</g>` : b}
    <g class="openings" opacity=${d}>${n.openings.map((h) => Of(n, h, e))}</g>
    <g class="wall-breaks" opacity=${d}>${Cf(n, e)}</g>
    ${a ? Af(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : b}
    <g class="devices-layer">${a ? b : bf(n, {
    palette: i,
    scale: e.scale,
    selection: l,
    showCones: e.showCones ?? !0,
    dim: !1,
    preview: e.preview.device,
    ...c === "binding" || c === "automation" ? {
      bindingStatus: c === "binding" ? e.bindingStatus : void 0,
      containerState: e.containerState,
      live: e.live,
      bubbles: e.bubbles
    } : {}
  })}</g>
    <g class="selection">${zf(n, e)}</g>
    <g class="preview">${Df(n, e)}</g>`;
}
const ge = "non-scaling-stroke", ln = "system-ui, sans-serif", Rf = 13, Bt = 9, Bf = 11, Nr = 18, qi = 12, Zi = 11, $n = 13, Ff = 3, zn = 10, Dr = 4.5, Uf = 12, Wf = 11.5, wo = 10, Gi = 10.5, jf = 6, qf = {
  IN: Ch,
  OUT: sc,
  BAT: Ph,
  PV: oc
}, Tr = { dead: 0, nodata: 1, idle: 2, live: 3 };
function ht(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Ki = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function Zf(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function mn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const Gf = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Kf = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, pc = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${ge}>${i ? b : Kf}</path>`, hc = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, xt = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function Xf(t, e) {
  var d;
  const n = (d = t.live) == null ? void 0 : d.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? hn : Bt, s = t.pts[0], o = t.pts[t.pts.length - 1], r = zn / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((u, c) => ({ p: t.pts[c], q: u, len: Math.abs(u.x - t.pts[c].x) + Math.abs(u.y - t.pts[c].y) })).sort((u, c) => c.len - u.len);
  for (const { p: u, q: c, len: p } of a) {
    if (p < 2 * r + 2 * l) continue;
    const h = { x: (u.x + c.x) / 2, y: (u.y + c.y) / 2 }, m = (w, g) => Math.hypot(h.x - w.x, h.y - w.y) >= g + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const y = Math.atan2(c.y - u.y, c.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: h, deg: ((y + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function Yf(t, e, n) {
  var d;
  const i = e.palette, s = mn(t.style, i), o = hc(t.pts), r = ((d = e.selection) == null ? void 0 : d.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = Xf(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${ge}></path>` : b}
    ${t.style === "live" ? pc("glow", o, s, n) : b}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : b} stroke-linejoin="round" vector-effect=${ge}></path>
    ${a ? _`<path class="arrow" d=${`M${zn / 2} 0L${-zn / 2} ${-Dr}L${-zn / 2} ${Dr}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : b}
  </g>`;
}
function Qf(t, e, n) {
  const i = qf[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${hn} fill=${n.portFill}
      stroke=${e ? mn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${ge}></circle>
    ${i ? xt(i, t.pt, Rf, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${ln}>${t.name}</text>`}
  </g>`;
}
function Jf(t, e) {
  const n = Math.max(4, Math.floor(e / (wo * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function em(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((d) => d.id === l);
    return a ? Mi(a, n) || f(`power.kind.${a.kind}`) : l;
  }), o = f("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", Jf(s[0], i - 12 - o.replace("{name}", "").length * wo * 0.55)) : f("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function tm(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: ht(i == null ? void 0 : i.power) }), l = (d) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: d });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Ki(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const d = n.device(e.deviceId);
      if (!d) return [{ kind: "text", value: f("power.missing"), fill: s.blockInvalid }];
      const u = d.bindings ?? {}, c = _t(d), p = [];
      return c ? (u.power_in && p.push({ kind: "text", label: f("power.in"), value: ht(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: f("power.out"), value: ht(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: Ki(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(l(aa(d))), c && p.push({ kind: "text", label: f("power.loss"), value: ht(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: f("power.soc"), value: Ki(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: f("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), em(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function nm(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : qi + 3, o = e.x - s / 2, r = `${f(`power.switch.${i}`)}${t.controllable ? "" : ` · ${f("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : b}>
    <title>${r}</title>
    ${xt(
    i === "on" ? kh : xh,
    { x: o, y: e.y },
    Nr,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? b : xt(Ah, { x: o + Nr / 2 + 3 + qi / 2, y: e.y + 1 }, qi, n.blockValue)}
  </g>`;
}
function Vr(t, e, n) {
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
function im(t, e, n) {
  const i = 2 * (t.w + t.h), s = Vr(t, e.side, e.pt), o = ((Vr(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, d = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < l).sort((u, c) => u.d - c.d).map(({ c: u }) => u.pt);
  return [e.pt, ...d, n.pt];
}
function sm(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return b;
  const l = _i(t, e, i.geo), a = l.find((h) => h.name === r), d = l.find((h) => h.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !d) return b;
  const u = s(d.name) ?? "nodata", c = mn(u, i.palette), p = hc(im(Me(e, i.geo, t), a, d));
  return _`${u === "live" ? pc("ts-glow", p, c, o) : b}
    <path class="ts-path" d=${p} fill="none" stroke=${c} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : b}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${ge}></path>`;
}
function om(t, e, n, i) {
  const s = i.palette;
  return Ja(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${ge}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${ln}>${o}</text>
    </g>`;
  });
}
function rm(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? f("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? f("power.alert.missingDevice") : t === "disagree" ? f("power.alert.disagree") : t;
}
function lm(t, e, n, i) {
  const s = Ff + $n / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: d }) => {
    const u = Math.max(Math.abs(d.x - a.x) - $n / 2, 0), c = Math.max(Math.abs(d.y - a.y) - $n / 2, 0);
    return Math.hypot(u, c) > hn;
  }), l = o.find(r) ?? o[0];
  return _`<g class="alert"><title>${t.map(rm).join(`
`)}</title>
    ${xt(nc, l, $n, i.blockInvalid)}</g>`;
}
function am(t, e, n, i, s) {
  var y, w;
  const o = n.palette, r = Me(e, n.geo, t), l = (y = n.frame) == null ? void 0 : y.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, d = e.kind === "device" && !a, u = r.x + r.w / 2, c = Mi(e, n.geo) || f(`power.kind.${e.kind}`), p = tm(t, e, n.geo, l, o, r.w), h = e.kind === "remainder", m = _i(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${d ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${h ? o.powerRemainder : o.blockStroke} stroke-width=${h ? 1.5 : 1.25}
      stroke-dasharray=${h ? "6 4" : b} vector-effect=${ge}></rect>
    ${e.kind === "transfer" ? sm(t, e, l, n, (g) => i(e.id, g), s) : b}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${f("power.planDevice")}</title>
      ${xt(Eh, { x: r.x + 4 + Zi / 2, y: r.y + 4 + Zi / 2 }, Zi, o.blockValue)}</g>` : b}
    <text class="name" x=${u} y=${r.y + Xn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${Uf} font-weight="600" fill=${o.blockName} font-family=${ln}>${c}</text>
    ${p.map((g, $) => {
    const k = r.y + Xn + $ * Kn + Kn / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? om(t, e, l, n) : b;
    if (g.kind === "switch") return nm(g, { x: u, y: k }, o);
    const M = g.fill ?? o.blockValue, x = g.label ? _`<tspan>${g.label} </tspan>` : b, A = g.note ? _`<tspan> ${g.note}</tspan>` : b;
    return _`<text x=${u} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? wo : Wf}
        fill=${M} font-family=${ln}>${g.title ? _`<title>${g.title}</title>` : b}${x}<tspan
        font-weight=${g.small ? b : "600"}>${g.value}</tspan>${A}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? lm(l.alert, r, m, o) : b}
    ${m.map((g) => Qf(g, i(e.id, g.name), o))}
  </g>`;
}
function cm(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let d = b;
  const u = t.name ?? "", c = Math.min(Gi, a - 4), p = c >= jf, h = u.length * (p ? c : Gi) * 0.58 + 12;
  if (u) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let y = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, l + Bt]) {
      const $ = Math.min(g - Bt, l);
      $ - w > y.hi - y.lo && (y = { lo: w, hi: $ }), w = Math.max(w, g + Bt);
    }
    if (y.hi - y.lo >= h) {
      const g = (y.lo + y.hi) / 2, $ = o ? { x: g, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: g };
      d = _`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? c : Gi} fill=${s.blockValue} font-family=${ln}
        transform=${o ? b : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? mn(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${ge}></rect>
    ${d}
  </g>`;
}
function dm(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${Bt} fill=${n.portFill} stroke=${mn(e, n)} stroke-width="1.5"
      vector-effect=${ge}></circle>
    ${xt(bh, t, Bf, n.portIcon)}
  </g>`;
}
function um(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return b;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return b;
  const s = Me(i, e.geo, t), o = 4 / e.scale;
  return _`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${ge}></rect>`;
}
function pm(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const h of n.wires) {
    const m = Ya(n, h, e.geo);
    if (!m) continue;
    const y = (p = e.frame) == null ? void 0 : p.wires[h.id];
    s.push({ w: h, a: m.a, b: m.b, pts: Qa(m.a, m.b), live: y, style: Zf(y) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const h of s)
    for (const [m, y] of [[h.w.from, h.a], [h.w.to, h.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, h.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Tr[h.style] > Tr[w]) && r.set(m.bus, h.style), l.set(m.bus, [...l.get(m.bus) ?? [], y.pt]), a.push({ at: y.pt, style: h.style });
    }
  const d = (h, m) => o.get(`${h}:${m}`), u = Gf(), c = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((h) => h.kind === "bus" ? cm(h, l.get(h.id) ?? [], r.get(h.id), e) : b)}</g>
    <g class="wires">${s.map((h) => Yf(h, e, u))}</g>
    ${um(n, e)}
    <g class="blocks">${n.blocks.map((h) => h.kind === "bus" ? b : am(n, h, e, d, u))}</g>
    <g class="terminals">${a.map((h) => dm(h.at, h.style, i))}</g>
    ${c ? _`<line class="wire-draft" x1=${c.from.x} y1=${c.from.y} x2=${c.to.x} y2=${c.to.y}
      stroke=${c.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${ge}></line>` : b}
  </g>`;
}
const hm = {
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
}, fm = {
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
function mm(t) {
  return t ? hm : fm;
}
class gm extends Ai {
  constructor(e) {
    if (super(e), e.type !== Ne.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? fe : (go(e), n);
  }
}
const K = Si(gm), Ms = 1, Hr = 1e-6;
function vm(t, e, n, i, s) {
  const o = (a) => a > Hr && a < s - Hr, r = new Set(t.nodes.filter((a) => {
    var d;
    return ((d = a.host) == null ? void 0 : d.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const d = hi(t, a).host.offset;
    o(d) && l.push({ t: d, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some((y) => y === e.a || y === e.b || r.has(y))) continue;
    const d = X(t, a.a), u = X(t, a.b), c = O(d, u), p = c === 0 ? null : be(n, i, d, C(u, d));
    if (!p) continue;
    const h = pi(p, d, u) * c;
    if (h < -Ms || h > c + Ms) continue;
    const m = B(C(p, n), i);
    o(m) && l.push({ t: m, wall: a, pt: p });
  }
  return l;
}
function Rr(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Br(t, e) {
  if ("nodeId" in e)
    return delete hi(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (O(X(t, o), e.pt) <= Ms) return o;
  const { pt: n, offset: i } = bi(t, e.wall, e.pt), s = { id: Y(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function wm(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = X(t, i.a), o = X(t, i.b), r = O(s, o), l = ui(C(o, s)), a = B(C(n, s), l), d = vm(t, i, s, l, r), u = Rr(d.filter((g) => g.t < a), a), c = Rr(d.filter((g) => g.t > a), a);
  if (!u && !c) return uo(t, e);
  const p = Se(t), h = p.walls.find((g) => g.id === e);
  let m = e, y = 0;
  if (c) {
    const g = Br(p, c);
    if (y = B(C(X(p, g), s), l), u) {
      const $ = { ...h, id: Y(), a: g };
      p.walls.push($), m = $.id;
    } else
      h.a = g;
  }
  u && (h.b = Br(p, u));
  const w = (g, $) => g.wallId !== e || u && $ <= u.t ? !0 : !c || $ < c.t ? !1 : (g.wallId = m, g.offset -= y, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((k) => k.kind !== "wall" || w(k, k.offset) ? k : io(k)));
  }
  return yi(p), ze(p, t);
}
function bo(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function bm(t, e, n) {
  return N(t, I(ui(C(e, t)), n));
}
function xn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function st(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? bo(r, e) : e, d = r !== void 0 && a.y === r.y, u = (x) => !r || Math.abs(d ? x.y - r.y : x.x - r.x) <= 1;
  let c = null;
  for (const x of t.nodes) {
    if (l.has(x.id)) continue;
    const A = { x: x.x, y: x.y }, E = O(A, a);
    E <= i && u(A) && (!c || E < c.d) && (c = { id: x.id, pt: A, d: E });
  }
  let p = null;
  for (const x of n.corners ?? []) {
    const A = O(x.pt, a);
    A <= i && u(x.pt) && (!p || A < p.d) && (p = { c: x, d: A });
  }
  if (p && (!c || p.d < c.d)) {
    const x = p.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: p.c };
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const h = t.walls.filter((x) => !l.has(x.a) && !l.has(x.b)).map((x) => ({ w: x, f: ie(t, x) })).filter((x) => x.f.len > 1e-9);
  let m = null;
  for (const { w: x, f: A } of h) {
    const E = { x: (A.a.x + A.b.x) / 2, y: (A.a.y + A.b.y) / 2 }, P = O(E, a);
    P <= i && u(E) && (!m || P < m.d) && (m = { wallId: x.id, pt: E, offset: A.len / 2, d: P });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const y = (x) => {
    let A = null;
    for (const { w: E, f: P } of h) {
      const D = ee(P.dir), H = x ? [P.leftOff, -P.rightOff].filter((z) => z !== 0) : [0];
      for (const z of H) {
        const V = N(P.a, I(D, z)), W = r ? be(r, C(a, r), V, P.dir) : N(V, I(P.dir, B(C(a, V), P.dir)));
        if (!W) continue;
        const q = B(C(W, V), P.dir);
        if (q < 0 || q > P.len) continue;
        const Q = O(W, a);
        Q <= i && (!A || Q < A.d) && (A = { d: Q, res: { pt: W, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: q } } });
      }
    }
    return A ? A.res : null;
  }, w = y(!1);
  if (w) return w;
  const g = y(!0);
  if (g) return g;
  const $ = n.zones ?? [];
  let k = null;
  for (const x of $)
    for (const A of x) {
      const E = O(A, a);
      E <= i && u(A) && (!k || E < k.d) && (k = { pt: A, d: E });
    }
  if (k) return xn(k.pt, "zoneVertex");
  let M = null;
  for (const x of $)
    for (let A = 0; A < x.length; A++) {
      const E = x[A], P = x[(A + 1) % x.length], D = O(E, P);
      if (D < 1e-9) continue;
      const H = I(C(P, E), 1 / D), z = r ? be(r, C(a, r), E, H) : N(E, I(H, B(C(a, E), H)));
      if (!z) continue;
      const V = B(C(z, E), H);
      if (V < 0 || V > D) continue;
      const W = O(z, a);
      W <= i && (!M || W < M.d) && (M = { pt: z, d: W });
    }
  if (M) return xn(M.pt, "zoneEdge");
  if (s && s > 0) {
    const x = (E) => Math.round(E / s) * s, A = r ? d ? { x: x(a.x), y: r.y } : { x: r.x, y: x(a.y) } : { x: x(a.x), y: x(a.y) };
    return xn(A, "grid");
  }
  return xn(a, "none");
}
function ym(t, e, n) {
  return e.some((i, s) => xe(t, i, e[(s + 1) % e.length]) <= n);
}
function yo(t, e, n) {
  const i = fi(t);
  for (const [s, o] of i) if (bt(e, o)) return s;
  for (const [s, o] of i) if (ym(e, o, n)) return s;
  return null;
}
function $m(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = ie(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = qe(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function xm(t, e, n, i) {
  const s = $m(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((d) => d.id === l);
        if (a && O(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = yo(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const Ii = 3, km = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => re(t, n)).filter((n) => n.length >= 3);
function fc(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? bo(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = st(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: km(e, s), corners: Zl(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = rt(e, l.wallId), d = a !== null && l.offset >= -Zn && l.offset <= a + Zn, u = d ? Math.max(0, Math.min(a, l.offset)) : l.offset, c = d ? Jt(e, l.wallId, l.side, u) : null;
    if (c) return { vertex: { kind: "wall", wallId: l.wallId, offset: u, side: l.side, x: c.x, y: c.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = qe(ie(e, l), n.pt).side >= 0 ? "left" : "right", d = Jt(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: d.x, y: d.y }, snap: { ...o, pt: d } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function mc(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = re(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => xe(e, l, o[(a + 1) % o.length]) <= n) || St(o, e)) && i.push({ id: s.id, area: Math.abs(ke(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function gc(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: re(t, n), v: n.shape.vertices } : null;
}
function Mm(t, e, n, i) {
  var r;
  const s = (r = gc(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    O(n, l) <= i && (o < 0 || O(n, l) < O(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function _m(t, e, n, i) {
  const s = gc(t, e);
  if (!s || s.o.some((w) => O(n, w) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((w, g) => {
    const $ = xe(n, w, o[(g + 1) % o.length]);
    $ <= i && $ < a && (l = g, a = $);
  }), l < 0) return null;
  const d = o[l], u = o[(l + 1) % o.length], c = Math.max(0, Math.min(1, pi(n, d, u))), p = Fl(d, u, c), h = r[l], m = r[(l + 1) % r.length], y = h.kind === "wall" && m.kind === "wall" && h.wallId === m.wallId && h.side === m.side ? { kind: "wall", wallId: h.wallId, side: h.side, offset: h.offset + c * (m.offset - h.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: l + 1, vertex: y };
}
function Sm(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, d = { x: 0, y: 0 }, u = null, c = [];
  const p = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, h = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function y(w) {
    if (!i || !s || !a && O(w.pt, d) <= Ii / t.scale()) return;
    a = !0;
    const g = fc(t, s, w, i.from, i.zoneId);
    r = g.snap, l = w.shift, o = up(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      c = [c[c.length - 1] ?? null, t.selection()];
    },
    press(w) {
      h(), u = null, d = w.pt;
      const g = p(), $ = t.level(), k = g === null ? null : Mm($, g, w.pt, t.tolMm());
      return g === null || !k ? !1 : (i = { zoneId: g, ...k }, s = o = $, !0);
    },
    pick(w) {
      const g = mc(t.level(), w, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const $ = p(), k = $ !== null && n !== null && O(w, n) <= t.tolMm() ? g.indexOf($) : -1;
      n = w, e({ kind: "zone", id: g[(k + 1) % g.length] });
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
      const g = o, $ = s, k = a, M = i;
      h(), k ? g && $ && g !== $ && t.commit(g) : u = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const g = c[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const $ = t.level(), k = _m($, g.id, w.pt, t.tolMm());
      if (!k) return;
      const M = pp($, g.id, k.index, k.vertex);
      M !== $ && (t.commit(M), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return h(), !0;
      const g = m();
      if (w === "Escape" && g)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const $ = t.level(), k = hp($, g.zoneId, g.index);
        return k === $ ? (t.notify(f("zones.minVertices")), !0) : (u = null, t.commit(k), !0);
      }
      return !1;
    },
    preview() {
      if (i && o) {
        const g = { level: o };
        return r && (g.snap = r), l && (g.orthoFrom = i.from), g;
      }
      const w = m();
      return w ? { zoneVertex: w } : {};
    },
    cancel() {
      h(), u = null, n = null;
    }
  };
}
function Am(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (h) => {
    t.select(h);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, d = Sm(t, l), u = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, m, y) => qe(ie(h, h.walls.find((w) => w.id === m)), y).t;
  function p(h) {
    const m = e;
    if (!(!m || !n) && !(h.pt.x === o.x && h.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const y = st(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), w = y.endpoint, g = (y.kind === "wall" || y.kind === "mid") && w.kind === "wall", $ = y.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, k = n.nodes.find((E) => E.id === m.nodeId), M = !!k.host && g && w.kind === "wall" && w.wallId === k.host.wallId;
        let x = n;
        if (k.host && !M) {
          const E = structuredClone(n);
          delete E.nodes.find((P) => P.id === m.nodeId).host, x = E;
        }
        let A = bp(x, m.nodeId, u(y));
        if ($ && w.kind === "node")
          A = kp(A, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const E = n.walls.find((P) => P.id === w.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const P = structuredClone(A);
            P.nodes.find((D) => D.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, A = ze(P, A);
          }
        }
        i = A;
      } else if (m.kind === "wall") {
        const y = n.walls.find(($) => $.id === m.wallId), w = st(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [y.a, y.b]
        }), g = C(w.pt, m.origin);
        i = $p(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const y = n.openings.find((w) => w.id === m.openingId);
        i = ia(n, y.id, c(n, y.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      a(), o = h.pt, d.note();
      const m = t.level(), y = h.ctrl ? yo(m, h.pt, t.tolMm()) : null;
      if (y) {
        l(null), t.commit(wm(m, y, h.pt));
        return;
      }
      if (d.press(h)) return;
      const w = t.selection(), g = xm(m, h.pt, t.tolMm(), w);
      if (!g) {
        d.pick(h.pt);
        return;
      }
      if (d.forget(), l(g), r = n = i = m, g.kind === "node") {
        let $ = g.id;
        const k = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (h.alt && k) {
          const M = xp(m, k.id, k.a === g.id ? "a" : "b");
          n = i = M.level, $ = M.nodeId, l({ kind: "node", id: $ });
        }
        e = { kind: "node", nodeId: $, origin: X(n, $) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: h.pt };
      else if (g.kind === "opening") {
        const $ = m.openings.find((k) => k.id === g.id);
        e = { kind: "opening", openingId: $.id, grab: c(m, $.wallId, h.pt) - $.offset };
      }
    },
    move(h) {
      d.active() ? d.move(h) : p(h);
    },
    up(h) {
      if (d.active()) {
        d.up(h);
        return;
      }
      e && p(h);
      const m = s, y = i, w = r;
      a(), m && y && w && y !== w && t.commit(y);
    },
    dblclick(h) {
      d.dblclick(h);
    },
    key(h) {
      return h === "Escape" && e ? (a(), !0) : d.key(h);
    },
    preview() {
      return !e || !i ? d.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), d.cancel();
    }
  };
}
function an(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function vc() {
  let t = "", e = "", n = "first";
  const i = () => {
    t = "", e = "", n = "first";
  }, s = () => t !== "" || e !== "";
  return {
    get first() {
      return t;
    },
    get second() {
      return e;
    },
    typing: s,
    clear: i,
    key(o, r, l) {
      return /^[0-9]$/.test(o) || o === " " ? (n === "first" ? t += o : e += o, !0) : o === "Backspace" ? (n === "first" ? t = t.slice(0, -1) : e = e.slice(0, -1), !0) : o === "Tab" ? (n = n === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : l(), !0) : !1;
    },
    tracker: (o) => ({ first: t, second: e, field: n, at: o })
  };
}
function Em(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = vc(), s = () => {
    e = null, i.clear();
  }, o = (d) => st(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const d = an(i.first, { min: 1 }), u = an(i.second, { min: 1 });
      return d === null || u === null ? null : { x: e.x + (n.x >= e.x ? d : -d), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const l = (d, u) => Math.abs(d.x - u.x) < 1 || Math.abs(d.y - u.y) < 1;
  function a(d) {
    if (!e || l(e, d)) return;
    const u = wp(t.level(), e, d, t.wallProps(), t.boxMeasure());
    u !== t.level() && (t.commit(u), s());
  }
  return {
    id: "box",
    down(d) {
      if (n = d.pt, !e) {
        e = o(d.pt).pt;
        return;
      }
      const u = r();
      u && a(u);
    },
    move(d) {
      n = d.pt;
    },
    up() {
    },
    key(d) {
      return e ? i.key(d, () => {
        const u = r();
        u && a(u);
      }, s) : !1;
    },
    preview() {
      if (!e) return { snap: o(n) };
      const d = r(), u = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || l(e, d)) return u;
      const c = t.wallProps(), p = Na(e, d, c.thickness, t.boxMeasure());
      return p && (u.walls = p.map((h, m) => ({ a: h, b: p[(m + 1) % 4], props: { ...c, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Fr = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Im(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = vc(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, d = (p, h) => st(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: h && n !== null });
  function u() {
    if (!n) return null;
    const p = d(s, o), h = an(l.first, { min: 1 }), m = an(l.second);
    if (h === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const y = h ?? O(n, p.pt);
    let w = p.pt;
    if (m === null && O(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = bm(n, w, y), $ = { x: Fr(g.x), y: Fr(g.y) }, k = t.level().nodes.find((M) => Math.hypot(M.x - $.x, M.y - $.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function c() {
    const p = u();
    if (!e || !p) return;
    const h = vp(t.level(), e, p.endpoint, t.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    t.commit(h.level);
    const m = h.level.walls.find((k) => k.id === h.wallId);
    i === null && (i = m.a);
    const y = h.endNodeId === i, w = n, g = X(h.level, h.endNodeId), $ = O(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), l.clear(), y) {
      a();
      return;
    }
    e = { kind: "node", nodeId: h.endNodeId }, n = X(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !e) {
        const h = d(p.pt, !1);
        e = h.endpoint, n = h.pt;
        return;
      }
      c();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, h) {
      return o = h.shift, e ? l.key(p, c, a) : !1;
    },
    preview() {
      if (!n) return { snap: st(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: n, b: p.pt, props: t.wallProps() }],
        snap: p.snap,
        tracker: l.tracker(p.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      a();
    }
  };
}
function Cm(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = yo(o, n, t.tolMm());
    if (!r) return null;
    const l = ie(o, o.walls.find((d) => d.id === r)), a = qe(l, n).t;
    return { wallId: r, center: a, pt: N(l.a, I(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Mu(t.level(), r.wallId, e, r.center, l.width, l);
      a.openingId !== null && t.commit(a.level);
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
      const { width: r } = i(), l = o.center - r / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: o.wallId, offset: l, width: r, kind: e, invalid: !mi(t.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Ur = 3, Pm = 1, ve = (t) => ({ x: t.x, y: t.y });
function Lm(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ve(e[e.length - 1]) : void 0;
  function l(c) {
    const p = e.length;
    if (p === 0) return !1;
    const h = e.map(ve);
    if (O(h[p - 1], c) <= Pm) return !0;
    if (p >= 2) {
      const m = C(h[p - 1], h[p - 2]), y = C(c, h[p - 1]);
      if (Math.abs(oe(m, y)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(y.x, y.y) && B(m, y) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (xa(h[p - 1], c, h[m], h[m + 1])) return !0;
    return !1;
  }
  function a(c) {
    if (e.length < Ur) return null;
    const p = t.tolMm(), h = ve(e[0]), m = ve(e[e.length - 1]);
    return O(c, h) <= p ? h : O(c, m) <= p ? m : null;
  }
  function d() {
    var h;
    if (e.length < Ur || Gn(e.map(ve))) return !1;
    const c = t.level(), p = cp(c, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : ro(p.level, p.zoneId, !1)), (h = t.zonePlaced) == null || h.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (c) => fc(t, t.level(), c, r());
  return {
    id: "zone",
    down(c) {
      if (a(c.pt)) {
        d();
        return;
      }
      const p = u(c).vertex;
      l(ve(p)) || (e = [...e, p], n = ve(p), i = !1);
    },
    move(c) {
      o = c.shift;
      const p = a(c.pt);
      if (p) {
        n = p, s = null, i = Gn(e.map(ve));
        return;
      }
      const h = u(c);
      s = h.snap, n = ve(h.vertex), i = l(n);
    },
    up() {
    },
    key(c) {
      return c === "Enter" ? d() : c === "Backspace" || c === "Delete" || c === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : c === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const c = {};
      e.length > 0 && (c.zoneDraft = { points: e.map(ve), cursor: n, invalid: i }), s && (c.snap = s);
      const p = r();
      return o && p && (c.orthoFrom = p), c;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Om(t) {
  return t.zoneMethod() === "polygon" ? Lm(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = ap(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(f("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : ro(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Wr = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function wc(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((u) => u.id === o), a = l ? ne(s, l) : null, d = l ? ys(s, l, t.scale()) : null;
    return !a || !d ? 0 : va(Pe(C(r, a.pt)) - Pe(C(d.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && O(s.pt, e.downPt) <= Ii / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((c) => c.id === e.id), r = o ? ne(e.original, o) : null;
    if (!o || !r) return;
    const l = O(s.pt, r.pt), a = (Pe(C(s.pt, r.pt)) - e.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, u = Gu(e.original, o, d, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : jn(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((d) => d.id === s), a = l ? ys(r, l, t.scale()) : null;
      return !l || !a || O(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Wr(o.work, o.id) !== Wr(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function jr(t, e, n) {
  const i = ie(t, t.walls.find((s) => s.id === e));
  return qe(i, n).side > 0 ? "left" : "right";
}
function bc(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function $o(t, e = "free") {
  return t === "equipment" ? [e] : Zs[t];
}
function yc(t, e, n, i, s = 0, o = $o(n)) {
  if (o.includes("wall")) {
    const r = st(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: jr(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of e.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const u = ie(e, d), c = qe(u, i).side, p = Math.abs(Math.abs(c) - (c > 0 ? u.leftOff : u.rightOff));
        (!a || p < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : u.len, d: p });
      }
      if (a) return { mode: "wall", wallId: a.id, side: jr(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...bc(t, i), rotation: s } : null;
}
function zm(t, e, n) {
  const i = ne(t, e);
  if (!i) return null;
  if (!n) {
    const o = Qs(Math.round(Pe(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of t.walls) {
    let r;
    try {
      r = ie(t, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = qe(r, i.pt), a = l.side > 0 ? "left" : "right", d = Math.min(r.len, Math.max(0, Math.round(l.t))), u = Jt(t, o.id, a, d), c = u ? O(u, i.pt) : 1 / 0;
    (!s || c < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: d }, d: c });
  }
  return s && s.d < 1 / 0 ? Js(t, e.props, s.placement, 0) : null;
}
function Nm(t, e, n) {
  return ua(t.deviceDefaults(e), "free", n.mode);
}
function Dm(t, e) {
  let n = null, i;
  const s = wc(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = $o(e, t.wallMount() ? "wall" : "free"), a = yc(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...bc(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const d = Nm(t, e, a), u = Js(r, d, a, t.tolMm()), c = rr(r, d, u, "").deviceId !== null;
    return { placement: u, props: d, invalid: !c };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), d = Us(f(`device.${e}`), a.devices.filter((c) => c.props.kind === e).map((c) => c.name)), u = rr(a, l.props, l.placement, d);
      u.deviceId !== null && (t.commit(u.level), i = u.deviceId, t.select({ kind: "device", id: u.deviceId }));
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
      const l = o();
      return l ? { device: l } : {};
    },
    cancel() {
      s.cancel(), n = null, i = void 0;
    }
  };
}
const qr = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Tm = (t, e, n) => n === void 0 || qr(t, n) !== qr(e, n);
function Vm(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return C(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = Jt(t, s.wallId, s.side, s.offset);
  return o ? C(o, i) : { x: 0, y: 0 };
}
function Hm(t) {
  let e = null, n = null;
  const i = wc(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (p) => {
    e = p, t.select(p);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && O(p.pt, l) <= Ii / t.scale()) return;
    if (r = !0, p.pt.x === l.x && p.pt.y === l.y) {
      o = s;
      return;
    }
    const h = s.devices.find((x) => x.id === n.id);
    if (!h || h.placement.mode === "none") return;
    const m = p.shift ? bo(l, p.pt) : p.pt, y = h.placement, w = y.mode === "free" ? null : ne(s, h), g = y.mode === "free" ? y.rotation : w ? Qs(Math.round(Pe(w.dir))) : 0, $ = N(m, n.grab), k = yc(t, s, h.props.kind, $, g, $o(h.props.kind, y.mode)), M = k && k.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...k, aim: y.aim } : k;
    o = M ? jn(s, h.id, Js(s, h.props, c(s, h.placement, M, m, $), t.tolMm())) : s;
  }
  function c(p, h, m, y, w) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const g = p.walls.find((E) => E.id === h.wallId);
    if (!g) return m;
    const $ = ie(p, g), k = Math.max(0, Math.min($.len, h.offset + B(C(y, l), $.dir))), M = qe($, w).side, x = t.tolMm(), A = h.side === "left" ? M < -($.rightOff + x) ? "right" : "left" : M > $.leftOff + x ? "left" : "right";
    return { ...m, offset: k, side: A };
  }
  return {
    id: "device-select",
    down(p) {
      d(), l = p.pt;
      const h = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const y = ya(h, p.pt, m);
      if (!y) {
        a(null);
        return;
      }
      a({ kind: "device", id: y });
      const w = h.devices.find(($) => $.id === y), g = ne(h, w);
      s = o = h, n = { id: y, grab: Vm(h, w, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const h = o, m = s, y = r, w = n == null ? void 0 : n.id;
      d(), y && h && m && h !== m && Tm(m, h, w) && t.commit(h);
    },
    key(p) {
      return p === "Escape" && i.cancel() ? !0 : p === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const p = i.working();
      return p ? { level: p } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), a(null);
    }
  };
}
function Rm(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = ya(t.level(), e.pt, t.tolMm());
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
const _s = 40, Bm = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function Fm(t, e, n, i) {
  const s = t.blocks.find((h) => h.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = sn(o ? i.x : i.y), d = n === "start" ? Math.min(a, r + l - _s) : r, u = n === "end" ? Math.max(a, r + _s) : r + l;
  if (d === r && u === r + l) return t;
  const c = o ? { x: d, w: u - d } : { y: d, h: u - d }, p = (h) => "bus" in h && h.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + h.at * l - d) / (u - d))) } : h;
  return {
    ...t,
    blocks: t.blocks.map((h) => h.id === e ? { ...h, ...c } : h),
    wires: t.wires.map((h) => {
      const m = p(h.from), y = p(h.to);
      return m === h.from && y === h.to ? h : { ...h, from: m, to: y };
    })
  };
}
function Um(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(u, c) {
    const p = Sr(u, c, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function a(u) {
    const c = e, p = n;
    if (!c || !p || !s && O(u.pt, o) <= Ii / t.scale()) return;
    if (s = !0, c.kind === "wire") {
      const w = l(p, u.pt);
      e = { ...c, to: u.pt, ok: !!w && !("error" in xr(p, c.from, w, t.geo())) };
      return;
    }
    if (c.kind === "bus-end") {
      i = Fm(p, c.id, c.end, u.pt);
      return;
    }
    const h = p.blocks.find((w) => w.id === (c.kind === "pin" ? c.from.block : c.id));
    if (!h) return;
    if (c.kind === "pin") {
      i = Tp(p, h.id, c.from.port, Qp(Me(h, t.geo(), p), u.pt));
      return;
    }
    const m = sn(h.x + u.pt.x - o.x), y = sn(h.y + u.pt.y - o.y);
    i = m === h.x && y === h.y ? p : zp(p, h.id, m, y);
  }
  function d(u, c, p) {
    const h = l(u, p);
    if (!h) return;
    const m = xr(u, c, h, t.geo());
    if ("error" in m) {
      t.notify(f(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const c = t.power(), p = Sr(c, u.pt, t.tolMm(), t.geo());
      if (!p) {
        t.select(null);
        return;
      }
      if (p.kind === "chip") {
        t.setPosition(p.block, p.position);
        return;
      }
      if (p.kind === "wire") {
        t.select({ kind: "powerWire", id: p.id });
        return;
      }
      if (n = i = c, p.kind === "port") {
        const h = { block: p.block, port: p.port };
        if (Bm(c, h)) {
          e = { kind: "pin", from: h };
          return;
        }
        const m = c.blocks.find((w) => w.id === p.block), y = _i(c, m, t.geo()).find((w) => w.name === p.port).pt;
        e = { kind: "wire", from: h, at: y, to: y, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: p.id }), e = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      a(u);
    },
    up(u) {
      a(u);
      const c = e, p = n, h = i, m = s;
      if (r(), !(!c || !p)) {
        if (!m) {
          (c.kind === "wire" || c.kind === "pin") && t.select({ kind: "powerBlock", id: c.from.block });
          return;
        }
        c.kind === "wire" ? d(p, c.from, u.pt) : h && h !== p && t.commitPower(h);
      }
    },
    key(u) {
      return u === "Escape" && e ? (r(), !0) : !1;
    },
    preview() {
      const u = e;
      return u ? u.kind === "wire" ? { wireDraft: { from: u.at, to: u.to, ok: u.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function Wm(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var d;
      let s;
      if (n === "device") {
        const u = t.placeDeviceId();
        if (!u) {
          t.notify(f("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = t.power(), r = Op(n, { x: 0, y: 0 }, o, s), l = Me(r, t.geo(), yr(o, r)), a = { ...r, x: sn(i.pt.x - l.w / 2), y: sn(i.pt.y - l.h / 2) };
      t.commitPower(yr(o, a)), n === "device" && ((d = t.devicePlaced) == null || d.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function jm(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = mc(t.level(), e.pt, t.tolMm())[0];
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
const qm = ["select", "box", "wall", "door", "window", "opening", "zone"], Zm = [
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
], Gm = ["binding-select"], Km = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Xm = ["zone-pick"], $c = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, Ym = {
  plan: qm,
  equipment: Zm,
  binding: Gm,
  power: Km,
  automation: Xm
};
function xo(t) {
  return Ym[t];
}
function Ss(t, e) {
  switch (t) {
    case "select":
      return Am(e);
    case "box":
      return Em(e);
    case "wall":
      return Im(e);
    case "door":
    case "window":
    case "opening":
      return Cm(e, t);
    case "zone":
      return Om(e);
    case "device-select":
      return Hm(e);
    case "binding-select":
      return Rm(e);
    case "power-select":
      return Um(e);
    case "zone-pick":
      return jm(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Wm(e, t);
    default:
      return Dm(e, t);
  }
}
function Xi(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const Qm = {
  select: Ct,
  box: Hh,
  wall: Rh,
  door: yh,
  window: Uh,
  opening: $h,
  zone: zh,
  "device-select": Ct,
  ceiling_light: gh,
  wall_light: Bh,
  motion_sensor: Ih,
  illuminance_sensor: mh,
  climate_sensor: Nh,
  wall_switch: Sh,
  smart_button: _h,
  valve: Th,
  leak_sensor: rc,
  socket: sc,
  exhaust_fan: ic,
  equipment: Ar,
  "binding-select": Ct,
  "zone-pick": Ct,
  "power-select": Ct,
  "power-device": Ar,
  "power-bus": Lh,
  "power-battery": fh,
  "power-pv": oc,
  "power-transfer": Oh,
  "power-remainder": vh
}, xc = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${Qm[t]}></path>`}</svg>`;
function Jm(t) {
  switch (t.saveState) {
    case "saving":
      return f("save.saving");
    case "conflict":
      return f("save.conflict");
    case "error":
      return f("save.error");
    default:
      return t.dirty ? f("save.dirty") : f(t.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function eg(t) {
  return v`
    <div class="top"><div class="bar">
      ${t.lead ?? b}
      ${t.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${K(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => v`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : b}
      <button class="btn" data-action="new-plan" title=${f("plan.new")} aria-label=${f("plan.new")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${f("plan.delete")} aria-label=${f("plan.delete")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${f("action.undo")} aria-label=${f("action.undo")} ?disabled=${!t.canUndo}
        @click=${t.onUndo}>↶</button>
      <button class="btn" title=${f("action.redo")} aria-label=${f("action.redo")} ?disabled=${!t.canRedo}
        @click=${t.onRedo}>↷</button>
      <span class="save-state ${t.saveState}" title=${t.saveState === "error" ? t.errorMessage ?? "" : ""}>
        ${Jm(t)}${t.saveState === "error" && t.errorMessage ? v`: ${t.errorMessage}` : b}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${f("action.save")}</button>
    </div>${t.steps}</div>`;
}
const tg = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function kc(t, e, n) {
  return xo(t).map((i) => {
    const s = t === "plan" ? $c[i] : void 0, o = f(`tool.${i}`);
    return v`
      ${tg.includes(i) ? v`<div class="tool-sep"></div>` : b}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? b}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? b}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${xc(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function ng(t, e, n) {
  return v`<div class="tools">${kc(t, e, n)}</div>`;
}
const kn = ["plan", "equipment", "binding", "power", "automation"], Pt = (t, e, n) => f(t === 1 ? e : n).replace("{n}", String(t));
function ig(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((u) => u.invalid).length, d = a ? `, ${f("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Pt(o.length, "steps.wall", "steps.walls")}, ${Pt(r.length, "steps.zone", "steps.zones")}${d}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: Pt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - js(l.map(n));
      return {
        text: f("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: Pt(i.blocks.length, "steps.block", "steps.blocks"), done: Wp(i) };
    case "automation":
      return { text: Pt(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const Zr = (t, e) => f(t).replace("{step}", f(`mode.${e}`));
function sg(t) {
  const e = kn.indexOf(t.mode), n = kn[e - 1], i = kn[e + 1];
  return v`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${K(t.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${kn.map((s, o) => {
    const r = ig(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return v`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : b} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${f(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Zr("steps.back", n)}</button>` : b}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Zr("steps.next", i)}</button>` : b}
      </div>
    </nav>`;
}
function og(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Mc(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return la(t, Us(f("device.equipment"), e));
}
function ko(t) {
  if (_t(t)) return f("props.inverter");
  const e = Iu(t);
  return e ? f(`deviceRole.${e}`) : "";
}
function Ci(t) {
  const e = f(`device.${t.props.kind}`), n = ko(t);
  return n ? `${e} · ${n}` : e;
}
function rg(t) {
  const e = og(t.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${f("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${f("devices.new")}</button>
    </div>
    ${e.length === 0 ? b : v`<div class="pdevs">
      ${e.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${ko(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const lg = ["unbound", "bound", "all"], ag = /* @__PURE__ */ new WeakMap(), Ft = (t) => t.placement.mode === "none";
function _c(t) {
  return $e(ag, t, (e) => [...e.devices].sort((n, i) => Number(Ft(n)) - Number(Ft(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function cg(t, e, n) {
  const i = _c(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Sc = (t) => f(`device.${t.props.kind}`), Gr = (t) => t.props.kind === "equipment" ? ko(t) : Sc(t), dg = (t, e) => t === "all" || t === "bound" == (e === "bound");
function ug(t, e, n) {
  return e === 0 ? f("binding.noDevices") : n || t.filter === "all" ? f("binding.noMatch") : f(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Kr(t) {
  const e = f(t.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function pg(t) {
  var l;
  if (t.collapsed) return v`<div class="blist collapsed">${Kr(t)}</div>`;
  const e = _c(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: js(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: d }) => dg(t.filter, d) && (!i || a.name.toLowerCase().includes(i) || Sc(a).toLowerCase().includes(i) || Gr(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, d) => {
    const u = Ld(a);
    return v`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${d}" role="img" aria-label=${f(`bindstatus.${d}`)} title=${f(`bindstatus.${d}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Gr(a)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${lg.map((a) => v`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${f(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Kr(t)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${K(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${ug(t, e.length, i)}</p>` : v`
          ${s.filter((a) => !Ft(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => Ft(a.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${f("devices.unplaced")}</h5>
            ${s.filter((a) => Ft(a.d)).map((a) => r(a.d, a.st))}
          </div>` : b}`}
      </div>
    </div>`;
}
function L(t, e) {
  return v`<label class="row"><span>${t}</span>${e}</label>`;
}
function J(t, e, n, i) {
  return v`<select class="val" data-field=${i ?? b} .value=${K(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => v`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Ze(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return v`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? b}
    placeholder=${t.placeholder ?? b} title=${t.placeholder ?? b} .value=${K(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = an(s.value, t.rule);
    if (o === null) {
      s.value = e, n(f(t.bad));
      return;
    }
    if (t.skipSame && o === t.value) {
      n(null);
      return;
    }
    if (t.apply(o) === !1) {
      s.value = e, n(f("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function hg() {
  return {
    door: { width: Pn.door, hinge: "start", swing: "left" },
    window: { width: Pn.window, outside: "left" },
    opening: { width: Pn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function fg(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Ac(t) {
  return Us(f("zones.default"), t.zones.map((e) => e.name));
}
const mg = (t) => t === "door" || t === "window" || t === "opening";
function gg(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return b;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return v`
    <h4>${f(`props.next.${n}`)}</h4>
    ${L(`${f("props.width")}, ${f("unit.mm")}`, Ze({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      o({ width: r });
    }
  }))}
    ${n === "door" ? v`
      ${L(f("props.hinge"), J(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${L(f("props.swing"), J(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : b}
    ${n === "window" ? L(f("props.outside"), J(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : b}`;
}
class vg {
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
const As = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Ut = (t) => typeof t == "string" && t ? t : null, Xr = (t) => typeof t == "number" && Number.isFinite(t), Es = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Ec(t) {
  return t.switchesMigrated || !t.devices.some(Es) ? t : { ...t, switchesMigrated: !0 };
}
function wg(t, e, n) {
  const i = la(t, n);
  let s = i.level;
  const o = As(e.switch) ? e.switch : {}, r = [["power", Ut(e.power)], ["voltage", Ut(e.voltage)], ["control", Ut(o.entity)]];
  for (const [l, a] of r) a && (s = ai(s, i.id, l, a));
  return o.controllable === !0 && (s = gi(s, i.id, !0)), { level: s, id: i.id };
}
function bg(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (As(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!As(l)) return l;
      if (l.kind === "meter" && Ut(l.id) && Xr(l.x) && Xr(l.y)) {
        s++;
        const a = wg(e, l, Ut(l.name) ?? `Meter ${s}`);
        return e = a.level, o = !0, {
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
        const { inverter: a, ...d } = l;
        return a === !0 && typeof l.deviceId == "string" && (e = da(e, l.deviceId, !0)), o = !0, d;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Es)) {
    for (const s of t.level.devices) Es(s) && (e = gi(e, s.id, !0));
    e = Ec(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class yg {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await ji(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(Wo(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = ye(e);
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
    const n = await lh(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(f("load.oldServer"));
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
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = f("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await ji(this.h.hass);
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
      this.h.notice = ye(n);
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
    this.h.toolId = xo(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(Wo(f("plan.default"))), this.offerDraft(null);
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
            await ch(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = ye(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await ji(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = ye(o);
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
    this.h.plan = { ...e, levels: e.levels.map(jd) };
    const n = bg({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Up(n.power, { device: (o) => n.level.devices.find((r) => r.id === o) }), s = e.rules && e.rules.length > 0 ? e.rules : void 0;
    this.h.history = new vg({ level: n.level, ...i ? { power: i } : {}, ...s ? { rules: s } : {} }), this.h.lazyPower = Ba(), this.h.activeTool.cancel(), this.h.activeTool = Ss(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((d, u) => u === 0 ? Ec(n) : d), { power: r, rules: l, ...a } = e;
    return { ...a, levels: o, ...i ? { power: i } : {}, ...s ? { rules: s } : {}, revision: this.h.save.baseRevision ?? 0 };
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
    const e = `${this.h.plan.name} ${f("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), s = await this.h.save.saveAsNew(i, e);
    s && this.keepSaved(i), s ? (this.h.plan = s, this.h.dialog = null, this.afterSaved(n, s.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class $g {
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
    !n || !Ap(n.states, e) ? this.base = { states: e, meta: Sp(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Ip(i, this.regs) : i;
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
    const e = this.h.hass;
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Ep(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = f("binding.registryError").replace("{error}", ye(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Mn = Vl("", "");
function xg(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? Mn;
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
    openingDefaults: (e) => fg(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Ac(((e = t.history) == null ? void 0 : e.current.level) ?? Mn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? Mn).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Ga(((n = t.history) == null ? void 0 : n.current.level) ?? Mn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Ic = Object.keys(Zs), kg = (t) => Ic.includes(t);
function Mg() {
  return Object.fromEntries(Ic.map((t) => [t, Ue(t, "free")]));
}
const Cc = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -wt, max: wt, signed: !0 }, bad: "props.badAim" }
}, Wt = (t, e, n, i, s) => Ze({ ...Cc[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), _g = ["round", "linear", "spot"], Sg = ["rect", "circle"], ei = (t, e) => t.map((n) => ({ v: n, label: f(`${e}.${n}`) }));
function Pc(t, e, n, i) {
  const s = (r, l, a) => L(`${f(l)}, ${f("unit.mm")}`, Wt(t, n + r, a, "mm", (d) => i({ [r]: d }))), o = (r, l, a) => L(`${f(l)}, ${f("unit.deg")}`, Wt(t, n + r, a, "angle", (d) => i({ [r]: d })));
  switch (e.kind) {
    case "ceiling_light":
      return v`
        ${L(f("props.shape"), J(e.shape, ei([..._g], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? v`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : b}
        ${L(`${f("props.poolRadius")}, ${f("unit.mm")}`, Ze({
        ...Cc.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: f("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return v`${o("coneAngle", "props.coneAngle", e.coneAngle)}${s("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return v`${o("zoneAngle", "props.zoneAngle", e.zoneAngle)}${s("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return L(`${f("props.diameter")}, ${f("unit.mm")}`, v`<select class="val" data-field=${`${n}diameter`}
        .value=${K(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Dd.map((r) => v`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${L(f("props.shape"), J(e.shape, ei([...Sg], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? v`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${L(f("props.icon"), Eg(t, e.icon, `${n}icon`, i))}
        ${L(f("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${K(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    default:
      return v`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const Ag = /^mdi:[a-z0-9-]+$/;
function Eg(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!Ag.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, f("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? v`<ha-icon-picker data-field=${n} .value=${K(e)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : v`<input class="val wide" type="text" data-field=${n} .value=${K(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function ot(t, e, n, i) {
  return L(e, v`<input type="checkbox" data-field=${t} .checked=${K(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Ig(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? b : ot("wallMount", f("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Cg(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? b : v`
    ${ot("inverter", f("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? ot("controllable", f("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${f("props.bindSwitchHint")}</p>`}`;
}
function Pg(t, e) {
  const n = e.placement;
  if (n.mode === "none") return b;
  if (n.mode === "free")
    return L(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      Wt(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = Hl.has(e.props.kind);
  return v`
    ${L(f("props.side"), J(n.side, ei(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${L(`${f("props.offset")}, ${f("unit.mm")}`, Wt(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? L(
    `${f("props.aim")}, ${f("unit.deg")}`,
    Wt(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement($a(n, s)))
  ) : b}`;
}
function Mo(t, e) {
  return L(f("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${K(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function Lg(t, e) {
  const n = e.props.kind;
  return Tl(n) ? n === "smart_button" && e.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${f("props.typeFreeHint")}</p>` : L(f("props.type"), J(
    n,
    ei(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : b;
}
function Og(t, e) {
  const n = t.level ? ep(t.level, e) : [];
  return v`<fieldset data-field="zone-membership"><legend>${f("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${f("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function zg(t, e) {
  const n = e.placement.mode !== "none";
  return v`
    <h4>${Ci(e)}</h4>
    ${Mo(e, (i) => t.onDevice({}, i))}
    ${Lg(t, e)}
    ${n ? Pc(t, e.props, "", (i) => t.onDevice(i)) : b}
    ${Ig(t, e)}
    ${Pg(t, e)}
    ${Cg(t, e)}
    ${n ? Og(t, e) : b}
    ${e.invalid ? v`<p class="warn">${f("props.invalidDevice")}</p>` : b}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${f("action.delete")}</button>`;
}
function Ng(t) {
  return t.device ? zg(t, t.device) : t.nextKind && t.nextProps ? v`
      <h4>${f("props.nextDevice")}: ${f(`device.${t.nextKind}`)}</h4>
      ${Pc(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? ot(
    "next-wallMount",
    f("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : b}` : v`<p class="muted">${f("props.none")}</p>`;
}
function Dg(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = kg(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(f("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, d) => {
    const u = zm(e, a, d);
    return o(u ? jn(e, a.id, u) : e);
  };
  return v`<div class="props">
    ${Ng({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, d) => !!i && o(un(e, i.id, a, d)),
    onKind: (a) => !!i && o(Cu(e, i.id, a)),
    onPlacement: (a) => !!i && o(jn(e, i.id, a)),
    onZone: (a, d) => !!i && o(La(e, i.id, a, d)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(qa(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(gi(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(ja(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    ${i ? b : rg({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = Mc(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const Is = (t) => f(`zones.kind.${t.shape.kind}`), _o = (t) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? Mh : Vh}></path>`}</svg>`;
function Lc(t, e) {
  const n = ka(t, e);
  return n ? f(`zones.invalid.${n}`) : null;
}
function Tg(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: vo(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || Is(o).toLowerCase().includes(e));
  return v`
    <div class="zlist">
      <div class="zhead"><span>${f("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${f("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${f("zones.filter")}
        aria-label=${f("zones.filter")} .value=${K(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? Lc(t.level, o) ?? "" : null;
    return v`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? v`<span class="zswatch" style=${`background:${r}`}></span>` : v`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Is(o)}>${_o(o.shape.kind)}</span>
            <span class="zarea">${((a = to(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const So = Si(class extends Ai {
  constructor(t) {
    if (super(t), t.type !== Ne.PROPERTY && t.type !== Ne.ATTRIBUTE && t.type !== Ne.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!tc(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === fe || e === b) return e;
    const n = t.element, i = t.name;
    if (t.type === Ne.PROPERTY) {
      if (e === n[i]) return fe;
    } else if (t.type === Ne.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return fe;
    } else if (t.type === Ne.ATTRIBUTE && n.getAttribute(i) === e + "") return fe;
    return go(t), e;
  }
}), Oc = (t, e, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${So(e)}
    @change=${(i) => n(i.target.checked)} />${f("zones.automation")}</label>`;
function Vg(t, e, n) {
  const i = pn(t, e.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${f("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${f("zones.participates")}</span>` : b}</div>
    ${i.length === 0 ? v`<p class="muted">${f("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${f(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${f("zones.participates")} .checked=${So(o)}
          @change=${(r) => {
    const l = La(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Yr(t, e, n) {
  const i = Lc(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return v`<div class="zprops">
    <h4>${f("props.zone")}</h4>
    ${L(f("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${K(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(dp(t, e.id, l));
  }} />`)}
    ${L(f("props.area"), v`<span class="val ro" data-field="zone-area">${ac(to(t, e))}</span>`)}
    ${L(f("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${_o(e.shape.kind)}${Is(e)}</span>`)}
    ${Oc("zone-automation", e.automation !== !1, (o) => {
    const r = ro(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(fp(t, e.id))}>
        ${f("zones.keepOutline")}</button>` : b}</div>` : b}
    ${Vg(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Pa(t, e.id))}>
      ${f("zones.delete")}</button>
  </div>`;
}
function Hg(t) {
  const e = t.next.zone, n = e.name ?? Ac(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return v`
    <h4>${f("props.nextZone")}</h4>
    <div class="muted">${f("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${f("zones.method")}>
      ${["walls", "polygon"].map((s) => v`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${_o(s)}<span>${f(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${f(`zones.hint.${e.method}`)}</p>
    ${L(f("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${K(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Oc("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function zc(t, e, n) {
  return Ze({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Qr(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Rg(t, e) {
  const n = ie(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Mp(e.level, t.id, o));
  return v`
    <h4>${f("props.wall")}</h4>
    ${L(f("props.type"), J(
    t.type,
    i.map((o) => ({ v: o, label: f(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${L(f("props.thickness"), zc(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${L(f("props.baseline"), J(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: f(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${L(f("props.length"), v`<span class="val ro">${et(n)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(uo(e.level, t.id))}>
      ${f("action.delete")}</button>`;
}
function Bg(t, e) {
  const n = ["door", "window", "opening", ...Un.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Au(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = Un.includes(t.kind);
  return v`
    <h4>${f(`kind.${t.kind}`)}</h4>
    ${L(f("props.kind"), J(t.kind, n.map((r) => ({ v: r, label: f(`kind.${r}`) })), (r) => i(Su(t, r))))}
    ${L(f("props.width"), zc(e, t.width, (r) => Qr(e, _u(e.level, t.id, r))))}
    ${L(f("props.offset"), Ze({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Qr(e, ia(e.level, t.id, r))
  }))}
    ${o ? v`
      ${L(f("props.hinge"), J(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${L(f("props.swing"), J(t.swing ?? "left", s, (r) => i({ swing: r })))}` : b}
    ${t.kind === "window" ? L(f("props.outside"), J(t.outside ?? "left", s, (r) => i({ outside: r }))) : b}
    ${L(f("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${K(Jl(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Ql(t.kind) ? void 0 : l });
  }} />`)}
    ${L(f("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${K(ta(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === ea(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? v`<p class="warn">${f("props.invalidOpening")}</p>` : b}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(sa(e.level, t.id))}>
      ${f("action.delete")}</button>`;
}
function Fg(t) {
  const e = ["bearing", "partition", "railing"];
  return v`
    <h4>${f("props.newWall")}</h4>
    ${L(f("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => v`<option value=${n} ?selected=${n === t.wallType}>${f(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${L(`${f("props.thickness")}, ${f("unit.mm")}`, Ze({
    value: t.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      t.setThickness(n);
    }
  }))}
    ${t.tool === "box" ? v`
      <div class="muted">${f("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => v`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${f(`measure.${n}`)}</button>`)}
      </div>` : b}`;
}
const Jr = (t) => Tg({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function Ug(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${Hg({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
      ${s ? Yr(e, s, t.commit) : b}
      ${Jr(t)}
    </div>`;
  }
  let i = b;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = Rg(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = Bg(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Yr(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${f("props.node")}</h4>
      ${L("X", v`<span class="val ro">${et(s.x)}</span>`)}${L("Y", v`<span class="val ro">${et(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === b && (t.tool === "wall" || t.tool === "box") ? Fg(t) : i === b && mg(t.tool) ? gg({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === b && t.tool === "select" ? Jr(t) : i === b ? v`<p class="muted">${f("props.none")}</p>` : i}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    </div>`;
}
function Wg(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const el = /* @__PURE__ */ new WeakMap();
function Ao(t, e, n) {
  let i = el.get(t);
  i || el.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : Wg(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function Nn(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _n = (t) => t ?? b;
var jg = Object.defineProperty, gn = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && jg(e, n, s), s;
};
const qg = 100;
let Zg = 0;
const Gg = (t) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, Co = class Co extends mt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Zg++}`, this.shown = null, this.onOutside = (e) => {
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
    const i = e[e.length - 1], s = [];
    let o = !1;
    for (const l of this.allRows())
      if (!(i && !l.search.includes(i))) {
        if (s.length === qg) {
          o = !0;
          break;
        }
        s.push(l);
      }
    const r = { rows: s, more: o };
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
    return v`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${_n(this.label || void 0)} title=${_n(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${f("combo.clear")} aria-label=${f("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : b}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${_n(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${_n(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : b}
      ${n ? v`<div class="hint">${f("combo.more")}</div>` : b}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : b}</div>`;
  }
};
Co.styles = Il`
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
let je = Co;
gn([
  Le()
], je.prototype, "value");
gn([
  Le()
], je.prototype, "label");
gn([
  F()
], je.prototype, "isOpen");
gn([
  F()
], je.prototype, "query");
gn([
  F()
], je.prototype, "active");
var Kg = Object.defineProperty, Eo = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && Kg(e, n, s), s;
};
const Xg = {
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
}, tl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Yg = { light: "light", switch: "switch", event: "event", fan: "fan" };
function nl(t, e) {
  return t != null && t.deviceClass && tl[t.deviceClass] ? tl[t.deviceClass] : Yg[(t == null ? void 0 : t.domain) ?? Ta(e)] ?? "generic";
}
const il = (t) => Gg(Xg[t]);
function Qg(t) {
  switch (t) {
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
      return t;
  }
}
class Pi extends je {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = Nn(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? Nn(this.meta, e) : null;
    return v`${il(e ? nl(this.meta.entities.get(e), e) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : b}<small class="eid">${e}</small></span>` : v`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = Ha(this.states, e.entityId) ?? "unavailable";
    return v`${il(nl(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${Qg(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = Nn(this.meta, e).name;
    return n === e ? e : `${n} (${e})`;
  }
  rowTitle(e) {
    return e.name === e.id ? e.id : `${e.name} (${e.id})`;
  }
  searchLabel() {
    return f("combo.search");
  }
  emptyText() {
    return f("combo.empty");
  }
}
Eo([
  Le({ attribute: !1 })
], Pi.prototype, "meta");
Eo([
  Le({ attribute: !1 })
], Pi.prototype, "items");
Eo([
  Le({ attribute: !1 })
], Pi.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Pi);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), jt(s, e);
  return !0;
}, ti = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, Nc = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), t1(e);
  }
};
function Jg(t) {
  this._$AN !== void 0 ? (ti(this), this._$AM = t, Nc(this)) : this._$AM = t;
}
function e1(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) jt(i[o], !1), ti(i[o]);
  else i != null && (jt(i, !1), ti(i));
  else jt(this, t);
}
const t1 = (t) => {
  t.type == Ne.CHILD && (t._$AP ?? (t._$AP = e1), t._$AQ ?? (t._$AQ = Jg));
};
class n1 extends Ai {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), Nc(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (jt(this, e), ti(this));
  }
  setValue(e) {
    if (tc(this._$Ct)) this._$Ct._$AI(e, this);
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
const i1 = () => new s1();
class s1 {
}
const Yi = /* @__PURE__ */ new WeakMap(), o1 = Si(class extends n1 {
  render(t) {
    return b;
  }
  update(t, [e]) {
    var i;
    const n = e !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = e, this.ht = (i = t.options) == null ? void 0 : i.host, this.rt(this.ct = t.element)), b;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let n = Yi.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Yi.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Yi.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), r1 = () => [{ v: "0", label: f("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], l1 = { min: 1, max: 10 };
function Dc(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Cs = (t, e, n) => Dc(t, un(t.level, e.id, n));
function Qi(t, e, n, i) {
  return v`<div class="cflag">${L(e, v`<input type="checkbox" data-field=${t} .checked=${K(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Ji = "__other", Lt = /* @__PURE__ */ new Set();
function a1(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Uo.includes(i), l = !r || Lt.has(o), a = i1(), d = [...Uo.map((c) => ({ v: c, label: c })), { v: Ji, label: f("binding.eventOther") }];
  return v`<span class="evfield">${J(l ? Ji : i, d, (c) => {
    if (c === Ji) {
      Lt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Lt.delete(o), a.value && (a.value.hidden = !0), c !== i ? s(c) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${o1(a)} data-field=${`${n}-event-custom`} ?hidden=${So(!l)}
      .value=${K(r ? "" : i)} @change=${(c) => {
    var m;
    const p = c.target, h = p.value.trim();
    if (!h) {
      p.value = r ? "" : i, t.setFieldNotice(f("props.badEvent"));
      return;
    }
    if (p.value = h, t.setFieldNotice(null), h !== i) {
      s(h) && Lt.delete(o);
      return;
    }
    if (Lt.delete(o), r) {
      p.hidden = !0;
      const y = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function c1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return v`${b}`;
  const s = i[n], o = (r) => Cs(t, e, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${L(f("binding.slot"), J(
    String(s.slot),
    r1(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${L(f("binding.event"), a1(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function d1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return v`
      ${Qi(
      "autoByDoubleToggle",
      f("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => Cs(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? v`<div class="cflag">${L(f("binding.window"), Ze({
      value: i.windowSec,
      rule: l1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => Cs(t, e, { windowSec: l })
    }))}</div>` : b}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${b}`;
  const s = (l, a) => (d) => {
    var c, p;
    const u = un(t.level, e.id, { [l]: d });
    return Dc(t, d && !((c = e.bindings) != null && c[a]) ? ai(u, e.id, a, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = Qi("autoEnabled", f("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${Qi("separateOff", f("binding.separateOff"), i.separateOff, o)}${i.separateOff ? b : r}`;
}
function u1(t) {
  return t.props.kind !== "smart_button" || !Nd(t).length ? v`${b}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${f("binding.duplicate")}</p></div>`;
}
function Ps(t, e) {
  return e === "control" && t.props.kind === "equipment" ? f("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? f("binding.onOff") : f(`role.${e}`);
}
const es = (t) => String(t).padStart(2, "0");
function p1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${es(e.getHours())}:${es(e.getMinutes())}:${es(e.getSeconds())}`;
}
const h1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function f1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? f("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : f("output.errorNotConfigured") : t.last ? f("output.last").replace("{event}", h1(t.last, t.kind)).replace("{time}", p1(t.last.at)) : f("output.none");
}
function m1(t, e) {
  if (!di(e.props.kind)) return b;
  const n = t.feed.stateOf(e), i = n ? f1(n) : t.feed.error ?? (t.feed.ready ? f("output.notSaved") : null);
  return i === null ? b : v`<p class="note" data-field="output">${i}</p>`;
}
function g1(t, e, n, i) {
  const s = Ra(t.meta, i, t.states), o = zd(t.level, e, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : b}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : b}
    ${o.length ? v`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : b}`;
}
function v1(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = Ps(e, i);
  return v`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Ao(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const d = ai(t.level, e.id, i, a.detail.value);
    d !== t.level && t.commit(d);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Ws(i) ? c1(t, e, i) : b}
    ${s ? g1(t, e, i, s) : b}
  </div>`;
}
function w1(t) {
  const e = t.device, n = js(t.level.devices.map(t.status));
  return v`<div class="props bprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : b}
    ${t.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${f(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : b}
    ${e ? v`
      <h4>${Ci(e)}</h4>
      ${Mo(e, (i) => t.commit(un(t.level, e.id, {}, i)))}
      ${m1(t, e)}
      ${_e(e).map((i) => v`${v1(t, e, i)}${d1(t, e, i.role)}`)}
      ${u1(e)}` : v`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${f("binding.reload")}</button>
  </div>`;
}
const b1 = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, y1 = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, $1 = 6, x1 = ["A", "0", "B"], k1 = ["power", "control"], M1 = ["power", "power_in", "power_out", "voltage", "control"], kt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function Ot(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function zt(t, e, n, i, s, o) {
  return v`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Ao(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function _1(t, e) {
  const n = e.name ?? "";
  return L(f("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${f(`power.kind.${e.kind}`)} .value=${K(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(nn(t.power, e.id, { name: o }, kt(t))) : s.value = n;
  }} />`);
}
function S1(t, e) {
  const n = new Set(_e(e).map((i) => i.role));
  return v`${k1.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${f(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${Nn(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${f("power.boundHint")}</p>`;
}
function Sn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function A1(t, e) {
  var o;
  const n = _e(e), i = M1.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return v`
    ${Mo(e, (r) => Sn(t, un(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Ps(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Ao(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Ps(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), Sn(t, ai(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? ot(
    "controllable",
    f("props.controllable"),
    !!s.controllable,
    (r) => Sn(t, gi(t.level, e.id, r))
  ) : b}
    ${s.kind === "equipment" ? ot("inverter", f("props.inverter"), !!s.inverter, (r) => {
    const l = qa(t.level, t.power, e.id, r);
    return Sn(t, l.level, l.power);
  }) : b}`;
}
function E1(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${f("power.missing")}</p>`;
  const i = _t(n) ? b : ot("output", f("power.enableOutput"), e.output !== !1, (s) => {
    const o = kt(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(xi(nn(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${A1(t, n)}${i}` : v`
    ${L(f("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${L(f("props.kind"), v`<span class="val ro">${f(`device.${n.props.kind}`)}</span>`)}${S1(t, n)}${i}`;
}
function I1(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: f(`power.form.${r}`) }));
  return v`
    ${L(f("power.form"), J(e.form, i, (r) => {
    r !== e.form && t.commitPower(nn(t.power, e.id, { form: r }, kt(t)));
  }, "form"))}
    <div class="row"><span>${f("power.position")}</span><span class="seg pos">${x1.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${f("power.positionHint")}</p>`;
}
function C1(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, d) => {
    if (a === i && d === s) return !1;
    t.commitPower(nn(t.power, e.id, n ? { w: a, h: d } : { w: d, h: a }, kt(t)));
  }, r = (a, d, u) => Ze({ value: d, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: u }), l = ["h", "v"].map((a) => ({ v: a, label: f(`power.orientation.${a}`) }));
  return v`
    ${L(f("power.orientation"), J(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(nn(t.power, e.id, { w: e.h, h: e.w }, kt(t)));
  }, "bus-orientation"))}
    ${L(f("power.busLength"), r("bus-length", i, (a) => o(Math.max(_s, s + 1, a), s)))}
    ${L(f("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max($1, a), i - 1))))}`;
}
function P1(t, e) {
  switch (e.kind) {
    case "grid":
      return v`
      ${zt(t, "power", f("power.field.power"), Je, e.power, (n) => Ot(t, e, "power", n))}
      ${zt(t, "voltage", f("power.field.voltage"), b1, e.voltage, (n) => Ot(t, e, "voltage", n))}`;
    case "device":
      return E1(t, e);
    case "battery":
      return v`
      ${zt(t, "power", f("power.field.batteryPower"), Je, e.power, (n) => Ot(t, e, "power", n))}
      ${zt(t, "soc", f("power.field.soc"), y1, e.soc, (n) => Ot(t, e, "soc", n))}`;
    case "pv":
      return zt(t, "power", f("power.field.power"), Je, e.power, (n) => Ot(t, e, "power", n));
    case "transfer":
      return I1(t, e);
    case "bus":
      return C1(t, e);
    default:
      return b;
  }
}
function L1(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return v`
    <h4>${i ? Ci(i) : f(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? b : _1(t, e)}
    ${P1(t, e)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Vp(t.power, e.id))}>${f("power.autoPorts")}</button>` : b}
      ${e.kind === "grid" ? b : v`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Ua(t.power, e.id))}>${f("action.delete")}</button>`}
    </div>`;
}
function O1(t, e) {
  var s, o;
  const n = kt(t), i = (r) => {
    const l = t.power.blocks.find((d) => d.id === ("block" in r ? r.block : r.bus)), a = l ? Mi(l, n) || f(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return v`
    <h4>${f("power.wire")}</h4>
    ${L(f("power.wire.from"), v`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${L(f("power.wire.to"), v`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${L(f("power.wire.power"), v`<span class="val ro" data-field="wire-power">${ht((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Za(t.power, e.id))}>${f("action.delete")}</button></div>`;
}
function z1(t) {
  const e = Ga(t.level, t.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Mc(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${f("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${f("power.help.device")}</p>
    ${e.length === 0 ? v`<p class="muted" data-note="no-devices">${f("power.noDevices")}</p>` : v`<div class="pdevs">
      ${e.map((i) => v`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${Ci(i)}</span>
      </button>`)}
    </div>`}`;
}
function N1(t) {
  if (t.toolId === "power-device") return z1(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return L1(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? O1(t, i) : t.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${f("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${f("power.pick")}</p><p class="muted">${f("power.help.select")}</p>`;
}
function D1(t) {
  return v`<div class="props pprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.feedError ? v`<p class="note" data-notice="feed">${t.feedError}</p>` : b}
    ${N1(t)}
  </div>`;
}
const Ls = 3600;
function vn(t) {
  return { id: Y(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const T1 = (t, e) => [...t, e], V1 = (t, e) => t.map((n) => n.id === e.id ? e : n), H1 = (t, e) => t.filter((n) => n.id !== e);
function R1(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const B1 = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, ni = (t) => [...t.inputs, ...t.gate ? [t.gate] : []].flatMap(B1), F1 = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, U1 = (t, e) => t.filter((n) => n.id !== e && ni(n).includes(e));
function W1(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of ni(l)) {
      const d = s(a, [...r, o]);
      if (d) return d;
    }
    return i.add(o), null;
  };
  for (const o of ni(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const sl = /^([01]\d|2[0-3]):[0-5]\d$/, ii = (t) => typeof t == "number" && Number.isFinite(t);
function j1(t) {
  const e = t.source;
  if ("light" in e) return ii(e.below) && e.below > 0 && ii(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && sl.test(n) && sl.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const ol = (t) => Number.isInteger(t) && t >= 0 && t <= Ls;
function q1(t, e, n, i, s, o) {
  const r = [];
  e.name.trim() || r.push("name"), e.inputs.length === 0 && !e.vent && r.push("inputs");
  const l = [...e.inputs, ...e.gate ? [e.gate] : []], a = [...l.flatMap(F1), ...e.onTrue.map((c) => c.device), ...e.onFalse.map((c) => c.device)], d = l.flatMap((c) => "light" in c.source ? [c.source.light] : []);
  (a.some((c) => !n(c)) || d.some((c) => !(s ?? n)(c)) || e.vent && [e.vent.sensor, e.vent.than].some((c) => !(o ?? n)(c))) && r.push("device-missing");
  const u = new Set(t.map((c) => c.id));
  ni(e).some((c) => c !== e.id && !u.has(c)) && r.push("rule-missing"), W1(t, e) && r.push("cycle"), (!ol(e.onDelay) || !ol(e.offDelay)) && r.push("delay");
  for (const c of l) {
    const p = j1(c);
    p && !r.includes(p) && r.push(p);
  }
  return e.vent && Z1(e, e.vent) && r.push("vent"), i && [...e.onTrue, ...e.onFalse].some((c) => {
    const p = i(c.device);
    return p !== void 0 && !p.includes(c.do);
  }) && r.push("action"), r;
}
function Z1(t, e) {
  if (t.inputs.length > 0 || t.gate || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !ii(e.above) || !ii(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
const G1 = (t) => t.vent !== void 0, K1 = 600;
function X1(t, e, n) {
  var l;
  const i = vn(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = K1;
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), o = s ? pn(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = o.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
function Y1(t, e, n) {
  const i = vn(e);
  if (i.name = e !== null && n ? `Leak ${n} -> valve` : "Leak -> valve", e === null) return i;
  const s = t.levels.find((l) => l.zones.some((a) => a.id === e));
  if (!s) return i;
  const o = pn(s, e).filter((l) => l.participates).map((l) => l.device);
  i.inputs = o.filter((l) => l.props.kind === "leak_sensor").map((l) => ({ source: { device: l.id } }));
  const r = o.filter((l) => l.props.kind === "valve");
  return r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "close" }]), i;
}
const Tc = 1800;
function Q1(t, e, n, i) {
  const s = vn(e);
  return s.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", s.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Tc } } }], s;
}
function J1(t, e, n) {
  var r;
  const i = vn(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light", i.combine = "all";
  const s = e === null ? void 0 : t.levels.find((l) => l.zones.some((a) => a.id === e)), o = s ? (r = pn(s, e).find((l) => l.participates && l.device.props.kind === "illuminance_sensor")) == null ? void 0 : r.device.id : void 0;
  return i.inputs = [
    { source: { light: o ?? "", below: 10, hysteresis: 5, unknownDark: !0 } },
    { source: { sun: !0 } },
    { source: { time: { from: "17:00", to: "01:00" } } }
  ], i.gate = { source: { held: { sources: [], state: "any", seconds: Tc } } }, i;
}
const ev = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), ts = (t) => ev.has(t.props.kind);
function Fe(t) {
  const e = t.props;
  return e.kind === "valve" ? ["open", "close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
function Dn(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function Vc(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Hc(t) {
  const e = `${f(`rules.did.${t.action}`)} ${t.target} ${Vc(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function tv(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${f("rules.status.error")}: ${e.reason}` : f(`rules.status.${e.status}`) : t.enabled === !1 ? f("rules.status.disabled") : n.live ? f("rules.unsaved") : f("rules.noTrace");
}
function nv(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !Dn(r, t);
  return v`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${f(`rules.verdict.${s}`)}
        title=${f(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? v` <span class="orphan">(${f("rules.orphan")})</span>` : b}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${tv(t, i, n)}</span>
        ${l ? v`<span class="runsaved">${f("rules.unsavedChanges")}</span>` : b}
        ${o > 0 ? v`<span class="rwarn">${o === 1 ? f("rules.unknown1") : f("rules.unknownN").replace("{n}", String(o))}</span>` : b}
        ${i != null && i.last ? v`<span class="rlast">${Hc(i.last)}</span>` : b}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${f("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${f("rules.delete")}</button>
      </div>
    </div>`;
}
function iv(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = R1(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return v`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : f("rules.noZone")}</h4>
      ${t.feedError ? v`<p class="muted">${t.feedError}</p>` : b}
      ${n === null && i.length === 0 && t.rules.length === 0 ? v`<p class="muted">${f("rules.hint")}</p>` : b}
      ${i.length === 0 ? v`<p class="muted rempty">${f("rules.empty")}</p>` : i.map((s) => nv(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const sv = {
  condition: wh,
  leak: rc,
  timer: Dh,
  outside: Fh,
  vent: ic
};
function ov(t) {
  return ["condition", "leak", "timer", "outside", "vent"].map((e) => v`
    <button class="tool" data-template=${e} title=${f(`rules.template.${e}`)} @click=${() => t(e)}>
      <svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${sv[e]}></path>`}</svg>
      <span class="tlabel">${f(`rules.template.${e}`)}</span></button>`);
}
function rv(t, e) {
  return t.mode === "automation" ? v`<div class="tools">${kc(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${ov((n) => t.openRuleDialog(n))}</div>` : t.mode !== "binding" ? ng(t.mode, t.toolId, (n) => t.pickTool(n)) : pg({
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
function lv(t, e) {
  var i;
  const n = t.selection;
  return w1({
    level: e,
    device: (n == null ? void 0 : n.kind) === "device" ? e.devices.find((s) => s.id === n.id) ?? null : null,
    meta: t.haMeta.get(),
    states: (i = t.hass) == null ? void 0 : i.states,
    status: t.bindStatus,
    showAll: t.showAll,
    onShowAll: (s) => {
      t.showAll = { ...t.showAll, [s]: !t.showAll[s] };
    },
    commit: (s) => t.commit(s),
    onNextUnbound: () => t.nextUnboundDevice(),
    notice: t.notice,
    fieldNotice: t.fieldNotice,
    setFieldNotice: (s) => {
      t.fieldNotice = s;
    },
    registryError: t.haMeta.error,
    registryLoading: t.haMeta.loading,
    onRetry: () => t.haMeta.retry(),
    feed: t.feed
  });
}
function av(t, e) {
  var i;
  if (t.mode === "binding") return lv(t, e);
  if (t.mode === "automation")
    return v`<div class="props">${iv({
      level: e,
      rules: t.rules,
      saved: (s) => t.session.savedRules.find((o) => o.id === s),
      selection: t.selection,
      trace: (s) => t.rulesFeed.trace(s),
      live: t.rulesFeed.ready,
      feedError: t.rulesFeed.error,
      onEdit: (s) => t.openRuleDialog("condition", s),
      onDelete: (s) => {
        t.dialog = { kind: "delete-rule", id: s };
      }
    })}</div>`;
  if (t.mode === "power")
    return D1({
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
      onPlaceDevice: (s) => t.armDevice(s),
      commit: (s, o) => t.commit(s, o),
      commitPower: (s) => t.commitPower(s),
      setPosition: (s, o) => t.setPowerPosition(s, o)
    });
  const n = {
    level: e,
    selection: t.selection,
    notice: t.notice,
    commit: (s) => t.commit(s),
    setNotice: (s) => {
      t.notice = s;
    }
  };
  return t.mode === "equipment" ? Dg({
    ...n,
    power: t.power,
    commit: (s, o) => t.commit(s, o),
    toolId: t.toolId,
    nextProps: t.nextProps,
    setNextProps: (s) => {
      t.nextProps = s;
    },
    nextWallMount: t.nextObj.wallMount,
    setNextWallMount: (s) => {
      t.nextObj = { ...t.nextObj, wallMount: s };
    },
    pickDevice: (s) => t.pickDevice(s)
  }) : Ug({
    ...n,
    tool: t.toolId,
    boxMeasure: t.boxMeasure,
    wallType: t.wallType,
    thickness: t.thickness,
    next: t.nextObj,
    setNext: (s) => {
      t.nextObj = s;
    },
    setWallType: (s) => t.setWallType(s),
    setThickness: (s) => {
      t.thickness = s;
    },
    setBoxMeasure: (s) => {
      t.boxMeasure = s;
    },
    zoneQuery: t.zoneQuery,
    onZoneQuery: (s) => {
      t.zoneQuery = s;
    },
    onPickZone: (s) => t.pickZone(s),
    onZoneMethod: (s) => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, method: s } }, t.pickTool("zone");
    }
  });
}
function cv(t, e) {
  switch (t) {
    case "wall":
      return [["Shift", f("hint.shift")], [f("hint.digits"), f("hint.length")], ["Tab", f("hint.tab")], ["Esc", f("hint.esc")]];
    case "box":
      return [[f("hint.digits"), f("hint.size")], ["Tab", f("hint.tabSize")], ["Esc", f("hint.esc")]];
    case "zone":
      return e === "polygon" ? [
        ["Enter", f("hint.close")],
        ["Backspace", f("hint.removeVertex")],
        ["Shift", f("hint.shift")],
        ["Alt", f("hint.freeVertex")],
        ["Esc", f("hint.cancel")]
      ] : [["Esc", f("hint.esc")]];
    case "select":
    case "device-select":
    case "power-select":
      return [["Del", f("hint.delete")], ["Esc", f("hint.deselect")]];
    case "binding-select":
      return [["Esc", f("hint.deselect")]];
    default:
      return [["Esc", f("hint.esc")]];
  }
}
function dv(t, e) {
  const n = t === "zone" ? `${f("tool.zone")} · ${f(`zones.kind.${e}`)}` : f(`tool.${t}`);
  return v`<span class="tool-chip">${xc(t)}${n}</span>`;
}
function uv(t) {
  return v`
    <div class="status">
      ${dv(t.tool, t.zoneMethod)}
      ${cv(t.tool, t.zoneMethod).map(([e, n]) => v`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? v`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${f(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? b : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${f("status.cones")}
      </label>`}
    </div>`;
}
function pv(t, e) {
  var o, r;
  const n = e.palette, i = 1 / e.scale, s = [
    {
      label: f(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((o = e.live) == null ? void 0 : o.first) ?? "",
      active: t.field === "first",
      unit: f("unit.mm")
    },
    {
      label: f(e.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: t.second,
      live: ((r = e.live) == null ? void 0 : r.second) ?? "",
      active: t.field === "second",
      unit: e.mode === "box" ? f("unit.mm") : "°"
    }
  ];
  return _`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((l, a) => _`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function hv(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: d } = s[0], u = Math.hypot(d.x - a.x, d.y - a.y);
    let c = Math.atan2(-(d.y - a.y), d.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: et(u), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: et(r), second: et(l) };
}
function fv(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const mv = Il`
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

  /* Both rule dialogs (condition, wet zone ventilation): about 90 % of the viewport; the form scrolls on the left,
     the diagram is on the right, the footer below. */
  .dialog.rdlg { box-sizing: border-box; width: 90%; height: 90%; max-width: none; display: flex; flex-direction: column; padding: 14px 18px; }
  .rsettings > p.muted { margin: 0; }
  .vnums { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 8px; }
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
  .rchip { display: inline-flex; align-items: center; gap: 2px; padding: 0 2px 0 8px; border: 1px solid var(--ch-divider); border-radius: 10px; font-size: 12px; }
  .rchip.bad { border-color: var(--ch-error); }
  .rwarn { flex-basis: 100%; margin: 0; color: var(--ch-error); font-size: 12px; }
  .rline.bad { border-color: var(--ch-error); }
  .rline .grow, .rsettings .grow { flex: 1; min-width: 0; }
  .rline .btn { padding: 1px 8px; }
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
  .fc-t1 { fill: var(--ch-text); font-size: 13px; font-weight: 500; }
  .fc-t2, .fc-head { fill: var(--ch-muted); font-size: 12px; }
  .fc-err { fill: var(--ch-error); font-size: 12px; }
  .fc-head { font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .fc-link { fill: none; stroke: var(--ch-muted); stroke-width: 1.5; opacity: .7; }
  .fc-note { margin: 0; color: var(--ch-muted); font-size: 12px; }
  .fc-warn { margin: 0; color: #f59e0b; font-size: 12px; }
  .fc-last { margin: 0; color: var(--ch-text); font-size: 12px; }
  @media (max-width: 700px) { .rcols { grid-template-columns: 1fr; overflow-y: auto; } }

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
`, gv = 5e-3, vv = 2, si = (t) => Math.max(gv, Math.min(vv, t));
function wv(t, e, n) {
  var r;
  const i = (r = t == null ? void 0 : t.getScreenCTM) == null ? void 0 : r.call(t), s = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (s && Number.isFinite(s.a) && Number.isFinite(s.d))
    return { x: s.a * n.clientX + s.c * n.clientY + s.e, y: s.b * n.clientX + s.d * n.clientY + s.f };
  const o = t == null ? void 0 : t.getBoundingClientRect();
  return {
    x: e.x + (n.clientX - ((o == null ? void 0 : o.left) ?? 0)) / e.scale,
    y: e.y + (n.clientY - ((o == null ? void 0 : o.top) ?? 0)) / e.scale
  };
}
function bv(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: si(Math.min(e, n) / 12e3) };
  const i = t.map((c) => c.x), s = t.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, u = si(Math.min(e / (l - r), n / (d - a)));
  return { x: (r + l) / 2 - e / u / 2, y: (a + d) / 2 - n / u / 2, scale: u };
}
function yv(t, e, n, i, s) {
  const o = si(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function $v(t, e, n) {
  const i = si(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function xv(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function rl(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function kv(t, e, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * t.scale >= 6 ? 100 * s : o, l = 1 / t.scale;
  return _`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Mv = ["Shift", "Control", "Alt", "Meta"], _v = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, Sv = new Map(Object.entries($c).map(([t, e]) => [`Key${e}`, t]));
function ll(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class Av {
  constructor(e) {
    this.h = e, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
      var s, o;
      if (this.h.dialog !== null) return;
      this.h.focus();
      const i = n.currentTarget;
      if (n.button === 1 || n.button === 0 && this.spaceDown) {
        n.preventDefault(), this.spacePending = !1, this.panFrom = { x: n.clientX, y: n.clientY }, (s = i.setPointerCapture) == null || s.call(i, n.pointerId);
        return;
      }
      n.button === 0 && ((o = i.setPointerCapture) == null || o.call(i, n.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(n)), this.h.requestUpdate());
    }, this.pointerMove = (n) => {
      if (this.h.dialog === null) {
        if (this.panFrom) {
          this.h.view = xv(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      var i, s;
      this.h.dialog === null && n.button === 0 && ((s = (i = this.h.activeTool).dblclick) == null || s.call(i, this.toolEvent(n)), this.h.requestUpdate());
    }, this.wheel = (n) => {
      this.h.dialog === null && (n.preventDefault(), this.h.view = $v(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (ll(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? Sv.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = _v[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || ll(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !Mv.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Rc(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function Ev(t) {
  return v`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", Rc(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function at(t, e, n, i) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? v`<p class="muted">${i}</p>` : b}
        <div class="actions">
          ${n.map((s) => v`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Iv(t) {
  var n;
  const e = { action: "cancel", label: f("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? at(f("draft.title"), f("draft.text").replace("{time}", Rc(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => t.discard(i) }
      ]) : b;
    }
    case "new":
      return at(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return at(f("delete.title"), f("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return at(f("delete.rule.title"), f("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: f("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? f("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return at(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return at(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return b;
  }
}
const Nt = "plan_studio.draft.", An = "plan_studio.lastPlanId";
function Cv() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Pv(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class Lv {
  constructor(e = Cv, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Nt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Nt + e), s = i ? JSON.parse(i) : null;
      return Pv(s) && s.planId === e ? s : null;
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
        const s = e.key(i);
        if (!(s != null && s.startsWith(Nt))) continue;
        const o = this.read(s.slice(Nt.length));
        o && (!n || o.savedAt > n.savedAt) && (n = o);
      }
      return n;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var e;
    try {
      return ((e = this.storage()) == null ? void 0 : e.getItem(An)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(An, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(An)) === e && n.removeItem(An);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Nt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Bc = 5e3, Fc = 12;
function al(t) {
  t().catch(() => {
  });
}
class Ov {
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
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && al(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (s) => {
        i.live && this.apply(s);
      },
      { type: "plan_studio/containers/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!i.live) {
          al(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(ye(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Fc || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Bc));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.containers ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, s] of n) this.map.set(i, s);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
const zv = 5e3, Nv = 12;
function cl(t) {
  t().catch(() => {
  });
}
class Dv {
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
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && cl(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (s) => {
        i.live && this.apply(s);
      },
      { type: "plan_studio/rules/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!i.live) {
          cl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(ye(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Nv || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, zv));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.rules ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, s] of n) this.map.set(i, s);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
const Tv = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function Uc(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const Wc = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Vv(t, e) {
  var o;
  const n = Wc(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Tv[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const Hv = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function Tn(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (h, m, y) => {
    if (!h) return;
    l = Wc(e, h);
    const w = (l == null ? void 0 : l.state) ?? "";
    s = m.includes(w) ? "on" : y.includes(w) ? "off" : "no-data";
  }, d = ["on"], u = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      o = !0;
    // falls through
    case "socket":
    case "equipment": {
      r = !!n.control, a(n.control, d, u);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      o = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], d, u), s === "on" && (s = "active");
      break;
    }
    case "wall_switch":
      a(n.state, d, u);
      break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const c = { look: s };
  if (o && l && (s === "on" || s === "active")) {
    const h = Hv(l);
    h !== void 0 && (c.timerSince = h);
  }
  const p = _e(t).some((h) => h.role === "power") ? Vv(e, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (c.power = p), c;
}
function jc(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: Uc(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: ht(t.power), tone: "device" }), i;
}
const qc = 1046, Zc = 1.25, Ve = 10, we = 34, Gc = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, Kc = (t) => Math.floor((t - 20) / 6.6), Rv = (t) => Math.floor((t - 20) / 6), Io = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : Uc(t * 1e3), Ae = (t) => 14 + 18 * t;
function Xc(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, s) => _`<text class=${s === 0 ? "fc-t1" : s === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(s)}>${Gc(i, s === 0 ? Kc(t.w) : Rv(t.w))}</text>`)}
      </svg>
    </g>`;
}
function oi(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const Ie = qc, ct = Ie / 2, tt = 230, Vn = 26, he = 4, dl = 36, ce = Ae(2), Bv = (Ie - he * tt - (he - 1) * Vn) / 2, ul = 200, En = 460, Ke = 330, Yc = 40, ns = 8, Fv = 24, Os = (Ie - Ke * 2 - Yc) / 2, pl = Os + Ke + Yc;
function Qc(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${f("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${f("rules.unit.min")}` : i === 0 ? `${n} ${f("rules.unit.h")}` : `${n} ${f("rules.unit.h")} ${i} ${f("rules.unit.min")}`;
}
const Jc = (t, e) => Io(Math.max(1, Math.ceil((t - e) / 1e3)));
function zs(t, e = !1) {
  return "light" in t ? `${f("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "sun" in t ? f(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${f(`rules.held.${t.held.state}`)} ${Qc(t.held.seconds)}` : "rule" in t ? f("rules.src.rule") : f("rules.src.device");
}
const hl = (t) => Number.isFinite(t) ? String(t) : "?";
function Uv(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function Wv(t, e) {
  return t.until !== void 0 && t.until > e && t.value !== !0 ? f("rules.flow.trueIn").replace("{t}", Jc(t.until, e)) : t.detail;
}
const qt = (t) => f(`rules.val.${t === null ? "unknown" : t}`), ft = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function jv(t) {
  if (t <= he) {
    const i = (Ie - t * tt - (t - 1) * Vn) / 2;
    return Array.from({ length: t }, (s, o) => i + o * (tt + Vn));
  }
  const e = t - Math.floor((t - 1) / he) * he, n = Math.floor((he - e) / 2);
  return Array.from({ length: t }, (i, s) => {
    const o = s % he;
    return Bv + (s >= t - e ? n + o : o) * (tt + Vn);
  });
}
function qv(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = e.inputs.map((T, G) => {
    const le = (i == null ? void 0 : i[G].value) ?? null;
    return le === null || !T.not ? le : !le;
  }), o = i ? Uv(e.combine, s) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, d = (n == null ? void 0 : n.unknownInputs) ?? 0, u = e.gate ? n == null ? void 0 : n.gate : void 0, c = e.gate ? u ? u.value === !0 ? f("rules.flow.open") : u.value === null ? `${f("rules.flow.closed")}, ${f("rules.val.unknown")}` : u.until !== void 0 && u.until > t.now ? `${f("rules.flow.closed")}, ${f("rules.flow.opensIn").replace("{t}", Jc(u.until, t.now))}` : `${f("rules.flow.closed")}${u.detail ? `, ${u.detail}` : ""}` : zs(e.gate.source) : "", p = f("rules.flow.delay").replace("{on}", hl(e.onDelay)).replace("{off}", hl(e.offDelay)), h = n === void 0 ? p : `${qt(r ?? null)}${l ? `, ${f("rules.flow.pending").replace("{to}", qt(l.to)).replace("{t}", Io(a))}` : ""}`, m = e.inputs.length, y = Math.ceil(m / he), w = jv(m), g = (T) => Ve + T * (ce + dl), $ = (T) => g(Math.floor(T / he)), k = (T) => g(T) + ce + (T === y - 1 ? we : dl) / 2, M = m === 0 ? Ve : g(y - 1) + ce + we, x = M + ce + we, A = x + ce + we, E = (e.gate ? A : x) + ce, P = E + we / 2, D = E + we, H = D + Fv, z = Math.max(1, e.onTrue.length, e.onFalse.length), V = H + z * (ce + ns) - ns + Ve, W = [
    { side: "true", x: Os, list: e.onTrue, head: f("rules.whenTrue") },
    { side: "false", x: pl, list: e.onFalse, head: f("rules.whenFalse") }
  ], q = [];
  w.forEach((T, G) => q.push(`M${T + tt / 2} ${$(G) + ce} V${k(Math.floor(G / he))}`));
  for (let T = 0; T < y; T++) {
    const G = [ct, ...w.slice(T * he, (T + 1) * he).map((le) => le + tt / 2)];
    Math.max(...G) > Math.min(...G) && q.push(`M${Math.min(...G)} ${k(T)} H${Math.max(...G)}`);
  }
  m > 0 && q.push(`M${ct} ${k(0)} V${M}`), q.push(`M${ct} ${M + ce} V${x}`), e.gate && q.push(`M${ct} ${x + ce} V${A}`), q.push(`M${ct} ${E} V${P} H${Os + Ke / 2} V${D}`, `M${ct} ${P} H${pl + Ke / 2} V${D}`);
  const Q = (T) => Xc({ ...T, h: ce, focused: t.focused === T.field, onClick: () => t.onFocus(T.target) });
  return v`
    <div class="flow">
      <svg class="fc" style=${`max-width:${Ie * Zc}px`} viewBox=${`0 0 ${Ie} ${V}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${f("rules.flow.title")}>
        ${q.map((T) => _`<path class="fc-link" d=${T}></path>`)}
        ${e.inputs.map((T, G) => {
    const le = i == null ? void 0 : i[G];
    return Q({
      x: w[G],
      y: $(G),
      w: tt,
      field: `input-${G}`,
      target: { input: G },
      cls: le ? ft(le.value) : "",
      lines: [`${T.not ? "NOT " : ""}${t.inputName(T)}`, le ? Wv(le, t.now) : zs(T.source, T.not === !0)]
    });
  })}
        ${Q({
    x: (Ie - ul) / 2,
    y: M,
    w: ul,
    field: "combine",
    target: "gate",
    cls: o === void 0 ? "" : ft(o),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...o === void 0 ? [] : [qt(o)]]
  })}
        ${Q({
    x: (Ie - En) / 2,
    y: x,
    w: En,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : ft(r ?? null),
    lines: [f("rules.flow.result"), h]
  })}
        ${e.gate ? Q({
    x: (Ie - En) / 2,
    y: A,
    w: En,
    field: "gate-input",
    target: "gate-input",
    cls: u ? ft(u.value) : "",
    lines: [`${f("rules.flow.gate")}: ${e.gate.not ? "NOT " : ""}${t.inputName(e.gate)}`, c]
  }) : b}
        ${W.map((T) => _`
          <text class="fc-head" text-anchor="middle" x=${T.x + Ke / 2} y=${D + 14}>${T.head}</text>
          ${T.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${T.x + Ke / 2} y=${H + ce / 2 + 4}>${f("rules.noActions")}</text>` : T.list.map((G, le) => Q({
    x: T.x,
    y: H + le * (ce + ns),
    w: Ke,
    field: `action-${T.side}-${le}`,
    target: { action: T.side, index: le },
    cls: "",
    lines: [t.actionName(G.device), Zv(G.do)]
  }))}`)}
      </svg>
      ${d > 0 ? v`<p class="fc-warn">${d === 1 ? f("rules.unknown1") : f("rules.unknownN").replace("{n}", String(d))}</p>` : b}
      ${n != null && n.held ? v`<p class="fc-warn" data-note="held">${f("rules.flow.heldNote")}</p>` : b}
      ${n != null && n.last ? v`<p class="fc-last">${f("rules.flow.last")} ${Hc(n.last)}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const Zv = (t) => f(`rules.act.${t}`), fl = { s: 1, min: 60, h: 3600 }, Gv = ["s", "min", "h"];
function Kv(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const ri = (t) => Number.isFinite(t) ? String(t) : "";
function ml(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const Ns = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? f("rules.missingDevice") : t.ruleName(e.rule) ?? f("rules.missingRule");
};
function ed(t, e) {
  var i;
  const n = e.source;
  return "device" in n || "rule" in n ? Ns(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? f("rules.light.noSensor") : "sun" in n ? f("rules.src.sun") : "time" in n ? f("rules.src.time") : n.held.sources.length === 0 ? f("rules.src.held") : `${f("rules.src.held")}: ${n.held.sources.map((s) => Ns(t, s)).join(", ")}`;
}
const Ds = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function Xv(t, e) {
  return "device" in e || "rule" in e ? Ds(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "held" in e ? e.held.sources.some((n) => Ds(t, n)) : !1;
}
function td(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "light" ? { light: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", below: 10, hysteresis: 5 } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function nd(t) {
  return v`
    <optgroup label=${f("rules.groupDevices")}>
      ${t.inputDevices.map((e) => v`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? v`<optgroup label=${f("rules.groupRules")}>
      ${t.otherRules.map((e) => v`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : b}`;
}
function gl(t, e) {
  return v`
    <option value="">${e}</option>
    ${nd(t)}
    <optgroup label=${f("rules.groupConditions")}>
      ${["light", "sun", "time", "held"].map((n) => v`<option value=${n}>${f(`rules.src.${n}`)}</option>`)}
    </optgroup>`;
}
function Yv(t, e, n, i) {
  const s = t.draft.rule, o = e === "true" ? "onTrue" : "onFalse", r = s[o], l = (p) => t.onChange({ ...s, [o]: p }), a = t.deviceById(i.device), d = a ? Fe(a) : [], u = d.includes(i.do) ? d : [...d, i.do], c = oi({ action: e, index: n });
  return v`
    <div class="rline" data-field=${c} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(p) => {
    const h = t.deviceById(p.target.value);
    h && l(r.map((m, y) => y === n ? { device: h.id, do: Fe(h).includes(m.do) ? m.do : Fe(h)[0] } : m));
  }}>
        ${a && !t.actionDevices.includes(a) ? v`<option value=${a.id}>${a.name}</option>` : b}
        ${a ? b : v`<option value=${i.device}>${f("rules.missingDevice")}</option>`}
        ${t.actionDevices.map((p) => v`<option value=${p.id}>${p.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(p) => l(r.map((h, m) => m === n ? { ...h, do: p.target.value } : h))}>
        ${u.map((p) => v`<option value=${p}>${f(`rules.act.${p}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${f("rules.remove")} @click=${() => l(r.filter((p, h) => h !== n))}>&times;</button>
    </div>`;
}
function vl(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return v`
    <div class="rgroup">
      <div class="rlabel">${f(e === "true" ? "rules.whenTrue" : "rules.whenFalse")}</div>
      ${n[i].map((s, o) => Yv(t, e, o, s))}
      <select class="radd" data-action=${`add-action-${e}`} .value=${""}
        @change=${(s) => {
    const o = s.target, r = t.deviceById(o.value);
    o.value = "", r && Fe(r).length > 0 && t.onChange({ ...n, [i]: [...n[i], { device: r.id, do: Fe(r)[0] }] });
  }}>
        <option value="">${f("rules.addAction")}</option>
        ${t.actionDevices.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
      </select>
    </div>`;
}
const is = (t) => t.trim() === "" ? NaN : Number(t);
function Qv(t, e, n, i) {
  var s, o;
  if ("light" in n) {
    const r = n.light === "" ? void 0 : t.lightUnit(n.light);
    return v`
      <div class="rparams">
        <label class="grow">${f("rules.light.sensor")}
          <select data-part="light" data-value=${n.light}
            @change=${(l) => i({ ...n, light: l.target.value })}>
            ${t.lightSensors.some((l) => l.id === n.light) ? b : v`<option value=${n.light}>${((s = t.deviceById(n.light)) == null ? void 0 : s.name) ?? f("rules.light.noSensor")}</option>`}
            ${t.lightSensors.map((l) => v`<option value=${l.id}>${l.name}</option>`)}
          </select></label>
        <label>${f("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${ri(n.below)}
            @input=${(l) => i({ ...n, below: is(l.target.value) })} /> lx</label>
        <label>${f("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${ri(n.hysteresis)}
            @input=${(l) => i({ ...n, hysteresis: is(l.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(l) => {
      const { unknownDark: a, ...d } = n;
      i(l.target.checked ? { ...d, unknownDark: !0 } : d);
    }} /> ${f("rules.light.unknownDark")}</label>
        ${r !== void 0 && r !== "lx" ? v`<p class="rwarn" data-warn="light-unit">${f("rules.light.unit").replace("{unit}", r)}</p>` : b}
      </div>`;
  }
  if ("time" in n)
    return v`
      <div class="rparams">
        <label>${f("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(r) => i({ time: { ...n.time, from: r.target.value } })} /></label>
        <label>${f("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(r) => i({ time: { ...n.time, to: r.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const r = n.held, l = ((o = t.draft.units) == null ? void 0 : o[e]) ?? Kv(r.seconds), a = Number.isFinite(r.seconds) ? String(+(r.seconds / fl[l]).toFixed(4)) : "", d = (u) => i({ held: { ...r, ...u } });
    return v`
      <div class="rparams">
        <div class="rsources">
          ${r.sources.length === 0 ? v`<span class="muted">${f("rules.held.noSources")}</span>` : b}
          ${r.sources.map((u, c) => v`
            <span class="rchip${Ds(t, u) ? " bad" : ""}" data-part="source">${Ns(t, u)}
              <button class="btn" data-action="remove-source" title=${f("rules.held.removeSource")}
                @click=${() => d({ sources: r.sources.filter((p, h) => h !== c) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(u) => {
      const c = u.target, p = td(t, c.value);
      c.value = "", p && ("device" in p || "rule" in p) && d({ sources: [...r.sources, p] });
    }}>
            <option value="">${f("rules.held.addSource")}</option>
            ${nd(t)}
          </select>
        </div>
        <label>${f("rules.held.state")}
          <select data-part="state" data-value=${r.state}
            @change=${(u) => d({ state: u.target.value })}>
            ${["on", "off", "any"].map((u) => v`<option value=${u}>${f(`rules.held.${u}`)}</option>`)}
          </select></label>
        <label>${f("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${a}
            @input=${(u) => {
      var c;
      ((c = t.draft.units) == null ? void 0 : c[e]) === void 0 && t.onUnit(e, l), d({ seconds: Math.round(is(u.target.value) * fl[l]) });
    }} />
          <select data-part="unit" data-value=${l} @change=${(u) => t.onUnit(e, u.target.value)}>
            ${Gv.map((u) => v`<option value=${u}>${f(`rules.unit.${u}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return b;
}
function wl(t, e, n, i) {
  const s = e.source, o = "light" in s || "sun" in s || "time" in s || "held" in s, r = "light" in s ? "light" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return v`
    <div class="rline${Xv(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${o ? f(`rules.src.${r}`) : ed(t, e)}${"sun" in s ? v` <span class="muted">${e.not ? f("rules.sun.above") : zs(s)}</span>` : b}</span>
      <label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(l) => {
    const a = l.target.checked, { not: d, ...u } = e;
    i(a ? { ...u, not: !0 } : u);
  }} /> ${f("rules.not")}</label>
      <button class="btn" data-action="remove-input" title=${f("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${Qv(t, n, s, (l) => i({ ...e, source: l }))}
    </div>`;
}
function Jv(t) {
  const e = t.draft.rule, n = (s) => (o) => {
    const r = o.target, l = r.value ? td(t, r.value) : null;
    r.value = "", l && s(l);
  }, i = (s) => {
    const { gate: o, ...r } = e;
    t.onChange(s ? { ...r, gate: s } : r);
  };
  return v`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${f("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${f("rules.namePlaceholder")}
        @input=${(s) => t.onChange({ ...e, name: s.target.value })} />

      <label class="rlabel" for="rule-combine">${f("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(s) => t.onChange({ ...e, combine: s.target.value === "all" ? "all" : "any" })}>
        <option value="any">${f("rules.combine.any")}</option>
        <option value="all">${f("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${f("rules.inputs")}</div>
        ${e.inputs.length === 0 ? v`<p class="muted">${f("rules.noInputs")}</p>` : e.inputs.map((s, o) => wl(
    t,
    s,
    oi({ input: o }),
    (r) => t.onChange({ ...e, inputs: r ? e.inputs.map((l, a) => a === o ? r : l) : e.inputs.filter((l, a) => a !== o) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${n((s) => t.onChange({ ...e, inputs: [...e.inputs, { source: s }] }))}>
          ${gl(t, f("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${f("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${f("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${Ls} step="1" .value=${ri(e.onDelay)}
              @input=${(s) => t.onChange({ ...e, onDelay: ml(s.target.value) })} /></label>
          <label class="grow">${f("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${Ls} step="1" .value=${ri(e.offDelay)}
              @input=${(s) => t.onChange({ ...e, offDelay: ml(s.target.value) })} /></label>
        </div>
      </div>

      <div class="rgroup">
        <div class="rlabel">${f("rules.gate")}</div>
        <p class="muted">${f("rules.gate.hint")}</p>
        ${e.gate ? wl(t, e.gate, oi("gate-input"), i) : v`<select class="radd" data-action="set-gate" .value=${""} @change=${n((s) => i({ source: s }))}>
            ${gl(t, f("rules.gate.set"))}
          </select>`}
      </div>

      ${vl(t, "true")}
      ${vl(t, "false")}
    </div>`;
}
function ew(t) {
  const e = t.draft.rule, n = e.zoneId === null || t.zones.some((s) => s.id === e.zoneId), i = (s) => t.onFocus(oi(s));
  return v`
    <div class="backdrop rule-backdrop" @change=${(s) => s.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${f(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}>
        <h3>${f(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}</h3>
        <div class="rcols">
          ${Jv(t)}
          ${qv({
    rule: e,
    inputName: (s) => ed(t, s),
    actionName: (s) => {
      var o;
      return ((o = t.deviceById(s)) == null ? void 0 : o.name) ?? f("rules.missingDevice");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: i
  })}
        </div>
        ${t.problems.length > 0 ? v`<ul class="rproblems" role="alert">
          ${t.problems.map((s) => v`<li data-problem=${s}>${f(`rules.problem.${s}`)}</li>`)}</ul>` : b}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${f("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(s) => t.onChange({ ...e, zoneId: s.target.value || null })}>
            <option value="">${f("rules.zone.none")}</option>
            ${n ? b : v`<option value=${e.zoneId}>${f("rules.zone.removed")}</option>`}
            ${t.zones.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(s) => {
    const { enabled: o, ...r } = e;
    t.onChange(s.target.checked ? r : { ...r, enabled: !1 });
  }} /> ${f("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${f("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${f("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const cn = qc, Zt = 330, id = 40, Vt = 460, Ts = (cn - Zt * 2 - id) / 2, bl = Ts + Zt + id, ss = (cn - Vt) / 2, os = cn / 2, rs = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), yl = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", tw = (t) => `${t > 0 ? "+" : ""}${t} %`, Dt = (t, e) => Xc({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function $l(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${rs(n.t)} °C` : "", n.rh !== null ? `${rs(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${rs(n.ah)} g/m³` : "—"];
}
function nw(t) {
  var q, Q, T;
  const e = t.rule, n = e.vent, i = t.trace, s = i == null ? void 0 : i.inputs[0], o = s == null ? void 0 : s.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((q = e.onTrue[0]) == null ? void 0 : q.device) ?? "", d = $l(r, f("vent.sensor"), o == null ? void 0 : o.a), u = $l(l, f("vent.than"), o == null ? void 0 : o.b), c = Ae(Math.max(d.length, u.length)), p = f("vent.flow.vs").replace("{a}", r).replace("{b}", l), h = o ? `: ${o.pct === null ? qt(null) : tw(o.pct)}` : s ? `: ${s.detail}` : "", m = o ? `${Gc(p, Kc(Vt) - h.length)}${h}` : `${p}${h}`, y = f("vent.flow.margins").replace("{above}", yl(n.above)).replace("{below}", yl(n.below)), w = i == null ? void 0 : i.pending, g = w ? Math.max(0, Math.ceil((w.at - t.now) / 1e3)) : 0, $ = f("vent.flow.runon").replace("{t}", Qc(e.offDelay)), k = [
    i ? `${f("rules.flow.result")}: ${qt(i.verdict)}` : f("rules.flow.result"),
    w ? `${$} (${f("vent.pending").replace("{to}", w.to ? "on" : "off").replace("{t}", Io(g))})` : $
  ], M = i == null ? void 0 : i.last, x = [
    t.deviceName(a),
    `${((Q = e.onTrue[0]) == null ? void 0 : Q.do) ?? "?"} / ${((T = e.onFalse[0]) == null ? void 0 : T.do) ?? "?"}`,
    ...M ? [f("vent.flow.last").replace("{did}", f(`rules.did.${M.action}`)).replace("{at}", Vc(M.at))] : []
  ], A = M == null ? void 0 : M.error, E = Ae(x.length + (A ? 1 : 0)), P = Ve + c + we, D = P + Ae(2) + we, H = D + Ae(2) + we, z = H + E + Ve, V = (G) => _`<path class="fc-link" d=${`M${G + Zt / 2} ${Ve + c} V${P - we / 2} H${os} V${P}`}></path>`, W = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${f("rules.status.error")}: ${i.reason}` : f(`rules.status.${i.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${cn * Zc}px`} viewBox=${`0 0 ${cn} ${z}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${f("vent.flow.title")}>
        ${V(Ts)}${V(bl)}
        <path class="fc-link" d=${`M${os} ${P + Ae(2)} V${D} M${os} ${D + Ae(2)} V${H}`}></path>
        ${Dt(t, { x: Ts, y: Ve, w: Zt, h: c, field: "vent-sensor", cls: o != null && o.a.why ? " nodata" : "", lines: d })}
        ${Dt(t, { x: bl, y: Ve, w: Zt, h: c, field: "vent-than", cls: o != null && o.b.why ? " nodata" : "", lines: u })}
        ${Dt(t, { x: ss, y: P, w: Vt, h: Ae(2), field: "vent-above", cls: s ? ft(s.value) : "", lines: [m, y], tip: `${p}${h}
${y}` })}
        ${Dt(t, { x: ss, y: D, w: Vt, h: Ae(2), field: "vent-runon", cls: i ? ft(i.verdict) : "", lines: k })}
        ${Dt(t, { x: ss, y: H, w: Vt, h: E, field: "vent-fan", cls: "", lines: x, err: A })}
      </svg>
      ${W ? v`<p class="fc-warn" data-note="status">${W}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const ls = (t) => t.trim() === "" ? NaN : Number(t), as = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function cs(t, e, n, i, s) {
  var r;
  const o = n === "" || i.some((l) => l.id === n);
  return v`
    <select data-field=${e} data-value=${n} @change=${(l) => s(l.target.value)}>
      <option value="">${f("vent.pick")}</option>
      ${o ? b : v`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? f("rules.missingDevice")}</option>`}
      ${i.map((l) => v`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function iw(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: f("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: f("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: f("vent.problem.fan") });
  const s = [...i], o = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((d) => !!d);
  for (const d of t.problems)
    d === "device-missing" && !o.some((u) => !t.deviceById(u)) && !(n.sensor && !t.climateSensors.some((u) => u.id === n.sensor)) && !(n.than && !t.climateSensors.some((u) => u.id === n.than)) || d === "vent" && i.length > 0 || s.push({ key: d, text: f(d === "delay" ? "vent.problem.runon" : `rules.problem.${d}`) });
  return s;
}
function sw(t) {
  var a;
  const e = t.draft.rule, n = e.vent, i = (d) => t.onChange({ ...e, vent: { ...n, ...d } }), s = ((a = e.onTrue[0]) == null ? void 0 : a.device) ?? "", o = e.zoneId === null || t.zones.some((d) => d.id === e.zoneId), r = f("vent.title"), l = iw(t);
  return v`
    <div class="backdrop rule-backdrop" @change=${(d) => d.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${r}>
        <h3>${r}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${f("vent.hint")}</p>
            <label class="rlabel" for="vent-name">${f("rules.name")}</label>
            <input id="vent-name" data-field="name" type="text" .value=${e.name} placeholder=${f("rules.namePlaceholder")}
              @input=${(d) => t.onChange({ ...e, name: d.target.value })} />

            <label class="rlabel">${f("vent.sensor")}</label>
            ${cs(t, "vent-sensor", n.sensor, t.climateSensors, (d) => i({ sensor: d }))}

            <label class="rlabel">${f("vent.than")}</label>
            ${cs(t, "vent-than", n.than, t.climateSensors, (d) => i({ than: d }))}

            <label class="rlabel">${f("vent.fan")}</label>
            ${cs(t, "vent-fan", s, t.fans, (d) => t.onChange({
    ...e,
    onTrue: d ? [{ device: d, do: "on" }] : [],
    onFalse: d ? [{ device: d, do: "off" }] : []
  }))}

            <div class="vnums">
              <label>${f("vent.above")}
                <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${K(as(n.above))}
                  @input=${(d) => i({ above: ls(d.target.value) })} /></label>
              <label>${f("vent.below")}
                <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${K(as(n.below))}
                  @input=${(d) => i({ below: ls(d.target.value) })} /></label>
              <label>${f("vent.runon")}
                <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${K(as(e.offDelay / 60))}
                  @input=${(d) => t.onChange({ ...e, offDelay: Math.round(ls(d.target.value)) * 60 })} /></label>
            </div>
          </div>
          ${nw({
    rule: e,
    deviceName: (d) => {
      var u;
      return d === "" ? f("vent.pick") : ((u = t.deviceById(d)) == null ? void 0 : u.name) ?? f("rules.missingDevice");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: t.onFocus
  })}
        </div>
        ${l.length > 0 ? v`<ul class="rproblems" role="alert">
          ${l.map((d) => v`<li data-problem=${d.key}>${d.text}</li>`)}</ul>` : b}
        <div class="rfoot">
          <label class="rlabel" for="vent-zone">${f("rules.zone")}</label>
          <select id="vent-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(d) => t.onChange({ ...e, zoneId: d.target.value || null })}>
            <option value="">${f("rules.zone.none")}</option>
            ${o ? b : v`<option value=${e.zoneId}>${f("rules.zone.removed")}</option>`}
            ${t.zones.map((d) => v`<option value=${d.id}>${d.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(d) => {
    const { enabled: u, ...c } = e;
    t.onChange(d.target.checked ? c : { ...c, enabled: !1 });
  }} /> ${f("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${f("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${f("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const ow = ["power", "voltage", "power_in", "power_out", "control"], rw = 300;
function xl(t) {
  t().catch(() => {
  });
}
function lw(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: _t(r), controllable: aa(r) };
    for (const a of ow) {
      const d = (s = r.bindings) == null ? void 0 : s[a];
      d && (l[a] = d);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class aw {
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
      }, rw);
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
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && xl(n.unsub));
  }
  subscribe() {
    const { conn: e, planId: n, payload: i } = this;
    if (!(e != null && e.subscribeMessage) || n === null || i === null || this.offline) return;
    const s = { live: !0, unsub: null };
    this.sub = s, e.subscribeMessage(
      (o) => {
        s.live && (this.current = o, this.host.requestUpdate());
      },
      { type: "plan_studio/power/subscribe", plan_id: n, power: i.power, devices: i.devices },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!s.live) {
          xl(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(ye(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Fc || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Bc));
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
const ds = 1e4, kl = 400, cw = 1e3, Ml = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), dw = ["timer", "power"], uw = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function sd(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of _e(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function pw(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function hw(t, e, n) {
  var i;
  if (t.settled) {
    const s = pw(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (Ml.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !Ml.has(e.state) ? e.state : void 0 };
}
function _l(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return jc(s, n, i)[0];
}
function fw(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of sd(n)) e.add(i.entity);
  return [...e].sort();
}
class mw {
  constructor() {
    this.seen = /* @__PURE__ */ new Map(), this.events = /* @__PURE__ */ new Map(), this.bubbles = /* @__PURE__ */ new Map(), this.leave = /* @__PURE__ */ new Map();
  }
  /** Compare states with the last seen ones for every event source of the level's devices; record new events and bubble exits. */
  update(e, n, i) {
    for (const s of e.devices)
      this.updateEvents(s, n, i), this.updateBubbles(s, n, i);
  }
  /** The device's event bubble text while under EVENT_MS old, else null. */
  event(e, n) {
    const i = this.events.get(e);
    return i && n - i.at < ds ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < kl).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= ds && o < ds + cw && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = sd(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = uw(n, l.entity);
      if (!a) continue;
      const d = o + l.entity, { value: u, text: c } = hw(l, a, this.seen.get(d));
      u !== void 0 && this.seen.set(d, { last: u }), c && this.events.set(e.id, { text: c, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = Tn(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < kl);
      for (const l of dw) {
        const a = _l(o, l, e, i);
        a && !_l(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const In = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function Sl(t) {
  t().catch(() => {
  });
}
class gw {
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
    var o, r;
    const n = e ? [...new Set(e)].sort() : [], i = n.length ? n.join(`
`) : null;
    if (i === this.key || (this.stop(), i === null)) return;
    this.key = i, this.ids = n;
    const s = this.connection();
    s != null && s.subscribeMessage && (this.conn = s, (o = s.addEventListener) == null || o.call(s, "disconnected", this.onDisconnected), (r = s.addEventListener) == null || r.call(s, "ready", this.onReady), this.subscribe());
  }
  /** Ends the subscription, stops listening to the connection and forgets the states. */
  stop() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady), this.drop(!0), this.key = null, this.ids = [], this.map = /* @__PURE__ */ new Map();
  }
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && Sl(n.unsub));
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
        n.live ? n.unsub = i : Sl(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: In(s.lc) ?? In(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const d = In(l.lc) ?? (a ? In(l.lu) : void 0);
        d && (r.last_changed = d);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var vw = Object.defineProperty, U = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && vw(e, n, s), s;
};
const Po = class Po extends mt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Td.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Mg(), this.nextObj = hg(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Ba(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Lv(), this.resizeObs = null, this.session = new yg(this), this.haMeta = new $g(this), this.feed = new Ov(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new Dv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new aw(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new mw(), this.entityFeed = new gw(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Pd(i, (s) => {
      var o;
      return Ra(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    const e = this, n = {
      get connection() {
        return e.hass.connection;
      }
    };
    this.save = new uh(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = xg(this), this.activeTool = Ss("select", this.ctx), this.input = new Av(this);
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
    var s, o;
    this.ruleDraft && !this.modal && (this.ruleDraft = null), e.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = ((s = this.history) == null ? void 0 : s.current.level) ?? null;
    this.watchEntities(), n && this.hass && (e.has("hass") || n !== this.trackedLevel) && this.events.update(n, this.entityFeed.overlay(this.hass.states), Date.now()), this.trackedLevel = n;
    const i = this.size.w > 0 && this.size.h > 0;
    this.needFit && i && (this.needFit = !1, this.fit()), this.needPowerFit && i && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((o = this.plan) == null ? void 0 : o.id) ?? null : null), this.watchPower(), this.watchRules();
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
    this.entityFeed.watch(e ? fw(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? lw(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((a) => Tn(a, this.hass.states).timerSince !== void 0 || this.events.event(a.id, n) !== null || this.events.leaving(a.id, n).length > 0), s = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, o = !!s && (!!s.pending || s.inputs.some((a) => a.until !== void 0 && a.until > n) || (((l = s.gate) == null ? void 0 : l.until) ?? 0) > n);
    (i || o) && !this.ticker ? this.ticker = setInterval(() => this.requestUpdate(), 1e3) : !i && !o && this.stopTicker();
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
    const i = this.history.current.power, s = n ?? (i && Np(i, e));
    this.history.push({ ...this.history.current, level: e, ...s && s !== this.power ? { power: s } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
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
    return (((n = this.plan) == null ? void 0 : n.levels) ?? []).map((i, s) => s === 0 && e ? e : i);
  }
  /**
   * Opens the rule dialog: a rule id edits that rule (the template does not matter then); otherwise a new rule
   * from the template, in the selected zone. The dialog works on a copy; OK commits one edit, Cancel drops it.
   */
  openRuleDialog(e, n) {
    var s, o;
    if (!this.plan || !this.history || this.dialog !== null) return;
    let i;
    if (n !== void 0) {
      const r = this.rules.find((l) => l.id === n);
      if (!r) return;
      i = { rule: structuredClone(r), isNew: !1, focused: null };
    } else {
      const r = this.planLevels(), l = ((s = this.selection) == null ? void 0 : s.kind) === "zone" ? this.selection.id : null, a = r.flatMap((p) => p.zones).find((p) => p.id === l), d = ((o = this.selection) == null ? void 0 : o.kind) === "device" ? r.flatMap((p) => p.devices).find((p) => p.id === this.selection.id) : void 0, u = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? Y1({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Q1({}, u, d && ts(d) ? d.id : null, d && ts(d) ? d.name : "") : e === "outside" ? J1({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? X1({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : vn(u), isNew: !0, focused: null };
    }
    this.ruleDraft = i, this.dialog = { kind: "rule" }, this.updateComplete.then(() => {
      var r;
      return (r = this.renderRoot.querySelector('.rule-backdrop [data-field="name"]')) == null ? void 0 : r.focus();
    });
  }
  /** A click on a flowchart block: the matching form field gets the focus and the highlight. */
  focusRuleField(e) {
    this.ruleDraft && (this.ruleDraft = { ...this.ruleDraft, focused: e }), this.updateComplete.then(() => {
      var s;
      const n = this.renderRoot.querySelector(`.rule-backdrop [data-field="${e}"]`), i = n != null && n.matches("input, select, button") ? n : (n == null ? void 0 : n.querySelector("select, input, button")) ?? n;
      (s = i == null ? void 0 : i.scrollIntoView) == null || s.call(i, { block: "nearest" }), i == null || i.focus();
    });
  }
  /** OK: the rule is added or changed as one undoable edit (an unchanged rule closes the dialog without an edit). */
  commitRuleDraft() {
    const e = this.ruleDraft;
    if (this.dialog = null, this.ruleDraft = null, !e) return;
    const n = this.rules.find((i) => i.id === e.rule.id);
    e.isNew ? this.commitRules(T1(this.rules, e.rule)) : n && !Dn(n, e.rule) && this.commitRules(V1(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && Dn(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return b;
    const n = this.planLevels(), i = n.flatMap((c) => c.devices), s = e.rule, o = this.session.savedRules.find((c) => c.id === s.id), r = this.shownRuleTrace(s), l = o ? Dn(o, s) ? null : f("rules.flow.edited") : f("rules.flow.new"), a = n.length > 1, d = n.flatMap((c) => c.zones.map((p) => ({ id: p.id, name: a ? `${p.name} (${c.name})` : p.name }))), u = q1(
      this.rules,
      s,
      (c) => i.some((p) => p.id === c),
      (c) => {
        const p = i.find((h) => h.id === c);
        return p && Fe(p);
      },
      (c) => i.some((p) => p.id === c && p.props.kind === "illuminance_sensor"),
      (c) => i.some((p) => p.id === c && p.props.kind === "climate_sensor")
    );
    return G1(s) ? sw({
      draft: e,
      climateSensors: i.filter((c) => c.props.kind === "climate_sensor"),
      fans: i.filter((c) => {
        const p = Fe(c);
        return p.includes("on") && p.includes("off");
      }),
      deviceById: (c) => i.find((p) => p.id === c),
      zones: d,
      problems: u,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : ew({
      draft: e,
      inputDevices: i.filter(ts),
      lightSensors: i.filter((c) => c.props.kind === "illuminance_sensor"),
      lightUnit: (c) => {
        var m, y, w, g, $;
        const p = (y = (m = i.find((k) => k.id === c)) == null ? void 0 : m.bindings) == null ? void 0 : y.illuminance, h = p ? (g = (w = this.hass) == null ? void 0 : w.states) == null ? void 0 : g[p] : void 0;
        return ($ = h == null ? void 0 : h.attributes) == null ? void 0 : $.unit_of_measurement;
      },
      actionDevices: i.filter((c) => Fe(c).length > 0),
      deviceById: (c) => i.find((p) => p.id === c),
      otherRules: this.rules.filter((c) => c.id !== s.id),
      ruleName: (c) => {
        var p;
        return (p = this.rules.find((h) => h.id === c)) == null ? void 0 : p.name;
      },
      zones: d,
      problems: u,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c),
      onUnit: (c, p) => {
        const h = this.ruleDraft ?? e;
        this.ruleDraft = { ...h, units: { ...h.units, [c]: p } };
      },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    });
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(H1(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Xi(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Xi(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = ja(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? uo(n, e.id) : e.kind === "opening" ? sa(n, e.id) : Pa(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Za(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Ua(n, e.id);
    return i === n ? this.notice = f("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = ye(i);
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
    const n = this.selection, i = this.level, s = this.mode === "binding" || this.mode === "automation";
    this.selection = s && n && i && Xi(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Ss(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.mode = e, this.pickTool(xo(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = ne(n, i);
    s && (this.view = rl(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = _a(n).get(e);
    s && (this.view = rl(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? cg(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return wv(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = bv(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = rh(this.power, this.ctx.geo());
    e && (this.powerView = yv(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return Iv({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? U1(this.rules, this.dialog.id).map((o) => o.name) : [],
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (o) => this.session.restoreDraft(o),
      discard: (o) => this.session.discardDraft(o),
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
    var h, m, y, w;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const e = mm(!!((m = (h = this.hass) == null ? void 0 : h.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, d = this.save, u = this.mode === "power", c = Date.now(), p = (y = this.hass) == null ? void 0 : y.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${fv(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${eg({
      steps: sg({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (g) => {
          this.plan = { ...this.plan, name: g }, d.markDirty();
        },
        onMode: (g) => this.setMode(g)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: d.state,
      dirty: d.dirty,
      errorMessage: d.errorMessage,
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : b,
      onPickPlan: (g) => this.session.pickPlan(g),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${rv(this, n)}
        ${av(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? kv(this.view, l, a, e, u ? 0.1 : 1) : b}
            ${this.mode === "power" ? pm(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Hf(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => Tn(g, p),
      bubbles: (g) => {
        const $ = Tn(g, p), k = this.events.event(g.id, c);
        return {
          shown: [...jc($, g, c), ...k ? [{ text: k.text, tone: "event", key: k.at }] : []],
          leaving: this.events.leaving(g.id, c)
        };
      }
    })}
            ${i.tracker ? pv(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: hv(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : b}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? Ev({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : b}
        </div>
        ${uv({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? f(`snap.${i.snap.kind}`) : null,
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
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
Po.styles = mv;
let R = Po;
U([
  Le({ attribute: !1 })
], R.prototype, "hass");
U([
  Le({ type: Boolean })
], R.prototype, "narrow");
U([
  Le({ attribute: !1 })
], R.prototype, "panel");
U([
  F()
], R.prototype, "plan");
U([
  F()
], R.prototype, "loadError");
U([
  F()
], R.prototype, "selection");
U([
  F()
], R.prototype, "toolId");
U([
  F()
], R.prototype, "wallType");
U([
  F()
], R.prototype, "thickness");
U([
  F()
], R.prototype, "boxMeasure");
U([
  F()
], R.prototype, "grid");
U([
  F()
], R.prototype, "mode");
U([
  F()
], R.prototype, "bindFilter");
U([
  F()
], R.prototype, "bindQuery");
U([
  F()
], R.prototype, "railCollapsed");
U([
  F()
], R.prototype, "showAll");
U([
  F()
], R.prototype, "zoneQuery");
U([
  F()
], R.prototype, "cones");
U([
  F()
], R.prototype, "nextProps");
U([
  F()
], R.prototype, "nextObj");
U([
  F()
], R.prototype, "planView");
U([
  F()
], R.prototype, "powerView");
U([
  F()
], R.prototype, "placeDeviceId");
U([
  F()
], R.prototype, "size");
U([
  F()
], R.prototype, "dialog");
U([
  F()
], R.prototype, "notice");
U([
  F()
], R.prototype, "fieldNotice");
U([
  F()
], R.prototype, "pendingDraft");
U([
  F()
], R.prototype, "ruleDraft");
U([
  F()
], R.prototype, "plans");
U([
  F()
], R.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", R);
export {
  R as PlanStudioPanel
};
