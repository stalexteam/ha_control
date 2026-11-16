/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const sn = globalThis, Ri = sn.ShadowRoot && (sn.ShadyCSS === void 0 || sn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bi = Symbol(), Ls = /* @__PURE__ */ new WeakMap();
let rr = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Bi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Ri && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Ls.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ls.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const gl = (t) => new rr(typeof t == "string" ? t : t + "", void 0, Bi), ar = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new rr(n, t, Bi);
}, wl = (t, e) => {
  if (Ri) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = sn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, Os = Ri ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return gl(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yl, defineProperty: bl, getOwnPropertyDescriptor: vl, getOwnPropertyNames: $l, getOwnPropertySymbols: xl, getPrototypeOf: kl } = Object, Ie = globalThis, zs = Ie.trustedTypes, Ml = zs ? zs.emptyScript : "", Gn = Ie.reactiveElementPolyfillSupport, $t = (t, e) => t, dn = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ml : null;
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
} }, Fi = (t, e) => !yl(t, e), Ns = { attribute: !0, type: String, converter: dn, reflect: !1, useDefault: !1, hasChanged: Fi };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ie.litPropertyMetadata ?? (Ie.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Ke = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Ns) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && bl(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = vl(this.prototype, e) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: s, set(r) {
      const a = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(e, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ns;
  }
  static _$Ei() {
    if (this.hasOwnProperty($t("elementProperties"))) return;
    const e = kl(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty($t("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($t("properties"))) {
      const n = this.properties, i = [...$l(n), ...xl(n)];
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
      for (const s of i) n.unshift(Os(s));
    } else e !== void 0 && n.push(Os(e));
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
    return wl(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : dn).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : dn;
      this._$Em = s;
      const c = l.fromAttribute(n, a.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = a.getPropertyOptions(e)), !((i.hasChanged ?? Fi)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(a._$Eu(e, i)))) return;
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
        const { wrapped: a } = r, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
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
Ke.elementStyles = [], Ke.shadowRootOptions = { mode: "open" }, Ke[$t("elementProperties")] = /* @__PURE__ */ new Map(), Ke[$t("finalized")] = /* @__PURE__ */ new Map(), Gn == null || Gn({ ReactiveElement: Ke }), (Ie.reactiveElementVersions ?? (Ie.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = globalThis, Hs = (t) => t, un = xt.trustedTypes, Vs = un ? un.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, lr = "$lit$", Ae = `lit$${Math.random().toFixed(9).slice(2)}$`, cr = "?" + Ae, _l = `<${cr}>`, Ue = document, Et = () => Ue.createComment(""), It = (t) => t === null || typeof t != "object" && typeof t != "function", Ui = Array.isArray, Al = (t) => Ui(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Yn = `[ 	
\f\r]`, ut = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ts = /-->/g, Ds = />/g, Ve = RegExp(`>|${Yn}(?:([^\\s"'>=/]+)(${Yn}*=${Yn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Rs = /'/g, Bs = /"/g, dr = /^(?:script|style|textarea|title)$/i, ur = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), y = ur(1), A = ur(2), re = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Fs = /* @__PURE__ */ new WeakMap(), Te = Ue.createTreeWalker(Ue, 129);
function pr(t, e) {
  if (!Ui(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Vs !== void 0 ? Vs.createHTML(e) : e;
}
const Sl = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = ut;
  for (let a = 0; a < n; a++) {
    const l = t[a];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, u = r.exec(l), u !== null); ) p = r.lastIndex, r === ut ? u[1] === "!--" ? r = Ts : u[1] !== void 0 ? r = Ds : u[2] !== void 0 ? (dr.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Ve) : u[3] !== void 0 && (r = Ve) : r === Ve ? u[0] === ">" ? (r = s ?? ut, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? Ve : u[3] === '"' ? Bs : Rs) : r === Bs || r === Rs ? r = Ve : r === Ts || r === Ds ? r = ut : (r = Ve, s = void 0);
    const h = r === Ve && t[a + 1].startsWith("/>") ? " " : "";
    o += r === ut ? l + _l : d >= 0 ? (i.push(c), l.slice(0, d) + lr + l.slice(d) + Ae + h) : l + Ae + (d === -2 ? a : h);
  }
  return [pr(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Pt {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = e.length - 1, l = this.parts, [c, u] = Sl(e, n);
    if (this.el = Pt.createElement(c, i), Te.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Te.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(lr)) {
          const p = u[r++], h = s.getAttribute(d).split(Ae), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? Il : m[1] === "?" ? Pl : m[1] === "@" ? Cl : _n }), s.removeAttribute(d);
        } else d.startsWith(Ae) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (dr.test(s.tagName)) {
          const d = s.textContent.split(Ae), p = d.length - 1;
          if (p > 0) {
            s.textContent = un ? un.emptyScript : "";
            for (let h = 0; h < p; h++) s.append(d[h], Et()), Te.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[p], Et());
          }
        }
      } else if (s.nodeType === 8) if (s.data === cr) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(Ae, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += Ae.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = Ue.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Je(t, e, n = t, i) {
  var r, a;
  if (e === re) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = It(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = Je(t, s._$AS(t, e.values), s, i)), e;
}
class El {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? Ue).importNode(n, !0);
    Te.currentNode = s;
    let o = Te.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new ji(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Ll(o, this, e)), this._$AV.push(c), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = Te.nextNode(), r++);
    }
    return Te.currentNode = Ue, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let ji = class hr {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, i, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = Je(this, e, n), It(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== re && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Al(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && It(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ue.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Pt.createElement(pr(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new El(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Fs.get(e.strings);
    return n === void 0 && Fs.set(e.strings, n = new Pt(e)), n;
  }
  k(e) {
    Ui(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new hr(this.O(Et()), this.O(Et()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = Hs(e).nextSibling;
      Hs(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class _n {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, s, o) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(e, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) e = Je(this, e, n, 0), r = !It(e) || e !== this._$AH && e !== re, r && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = Je(this, a[i + l], n, l), c === re && (c = this._$AH[l]), r || (r = !It(c) || c !== this._$AH[l]), c === v ? e = v : e !== v && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Il extends _n {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class Pl extends _n {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
let Cl = class extends _n {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Je(this, e, n, 0) ?? v) === re) return;
    const i = this._$AH, s = e === v && i !== v || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Ll {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Je(this, e);
  }
}
const Xn = xt.litHtmlPolyfillSupport;
Xn == null || Xn(Pt, ji), (xt.litHtmlVersions ?? (xt.litHtmlVersions = [])).push("3.3.3");
const Ol = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new ji(e.insertBefore(Et(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = globalThis;
let Xe = class extends Ke {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ol(n, this.renderRoot, this.renderOptions);
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
    return re;
  }
};
var or;
Xe._$litElement$ = !0, Xe.finalized = !0, (or = Re.litElementHydrateSupport) == null || or.call(Re, { LitElement: Xe });
const Qn = Re.litElementPolyfillSupport;
Qn == null || Qn({ LitElement: Xe });
(Re.litElementVersions ?? (Re.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zl = { attribute: !0, type: String, converter: dn, reflect: !1, hasChanged: Fi }, Nl = (t = zl, e, n) => {
  const { kind: i, metadata: s } = n;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(n.name, t), i === "accessor") {
    const { name: r } = n;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(r, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, t, a), a;
    } };
  }
  if (i === "setter") {
    const { name: r } = n;
    return function(a) {
      const l = this[r];
      e.call(this, a), this.requestUpdate(r, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function xe(t) {
  return (e, n) => typeof n == "object" ? Nl(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function H(t) {
  return xe({ ...t, state: !0, attribute: !1 });
}
function q() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Wi(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const Be = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Hl = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Vl = { ...Be, role: "power_in" }, Tl = { ...Be, role: "power_out" }, Dl = ["on", "off", "auto"], Zi = (t) => Dl.includes(t), Jn = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Rl = {
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
  smart_button: [Jn("on"), Jn("off"), Jn("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Be],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Be, Hl, Vl, Tl]
}, qi = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Bl = { climate_sensor: "any" };
function ze(t) {
  const e = t.props, n = Rl[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function fr(t) {
  return new Set(ze(t).map((e) => e.role));
}
function An(t, e, n, i) {
  var a;
  const s = t.devices.find((l) => l.id === e);
  if (!s || !fr(s).has(n)) return t;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return t;
    const l = { ...s.bindings };
    delete l[n];
    const c = { ...s, bindings: l };
    if (Object.keys(l).length === 0 && delete c.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...d } = s.props;
      c.props = d;
    }
    return { ...t, devices: t.devices.map((u) => u === s ? c : u) };
  }
  if (o === i) return t;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
function Fl(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((a) => !!a), s = ze(t).filter((a) => a.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((a) => e(a) === "missing")) return "missing";
  const o = s.filter((a) => !!n[a.role]);
  return (Bl[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Ul(t) {
  const e = ze(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const jl = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function yi(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Zi(e) ? n : `${n}|${jl(i[e])}`;
}
function Wl(t, e, n) {
  const i = yi(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && ze(s).some((o) => yi(s, o.role) === i));
}
function Zl(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of ze(t)) {
    const s = Zi(i) ? yi(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function Sn(t) {
  if (!t.bindings) return t;
  const e = fr(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const rt = (t) => t === "wall_switch" || t === "smart_button", Ct = (t) => t === "wall" ? "wall" : "free", ql = [100, 125, 150], Ki = "mdi:cube-outline", Us = ["single", "double", "hold"], Kl = {
  bearing: 400
}, on = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function mr(t = q(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function js(t) {
  return {
    id: q(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [mr()]
  };
}
const Gi = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  wall_switch: ["wall"],
  smart_button: ["wall", "free"],
  socket: ["wall"],
  equipment: ["free", "wall"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, et = 90, gr = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ce(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Ki, label: "" };
    case "wall_switch":
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
const Gl = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Ki
};
function Yl(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Gl[String(n)] ?? Ki;
  return { ...t, props: { ...i, icon: s } };
}
function Xl(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Ct(t.placement.mode);
  return e ? { ...t, props: Ce("smart_button", n), bindings: { on: e } } : { ...t, props: Ce("wall_switch", n) };
}
const wr = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Ql(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = wr(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function Jl(t) {
  const e = t.props.kind;
  if (!rt(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Ce(e, Ct(t.placement.mode)))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? Ql(r, o) : s === "windowSec" ? wr(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...t, props: i } : t;
}
function ec(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function tc(t) {
  if (!rt(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function nc(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Sn(ec(tc(Jl(Xl(Yl(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function O(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function I(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function E(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function B(t, e) {
  return t.x * e.x + t.y * e.y;
}
function J(t, e) {
  return t.x * e.y - t.y * e.x;
}
function yr(t) {
  return Math.hypot(t.x, t.y);
}
function L(t, e) {
  return yr(I(e, t));
}
function En(t) {
  const e = yr(t);
  return e === 0 ? { x: 0, y: 0 } : E(t, 1 / e);
}
function Q(t) {
  return { x: t.y, y: -t.x };
}
function br(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function ue(t, e, n, i) {
  const s = J(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = J(I(n, t), i) / s;
  return O(t, E(e, o));
}
function In(t, e, n) {
  const i = I(n, e), s = B(i, i);
  return s === 0 ? 0 : B(I(t, e), i) / s;
}
function ve(t, e, n) {
  const i = I(n, e), s = B(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, B(I(t, e), i) / s));
  return L(t, O(e, E(i, o)));
}
function tt(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function $e(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let Le = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function ic(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Se(t, e, n) {
  const i = new Le(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = n(t, e.key);
    if (r < 0) {
      if (e.left === null) break;
      if (n(t, e.left.key) < 0) {
        const a = e.left;
        if (e.left = a.right, a.right = e, e = a, e.left === null) break;
      }
      o.left = e, o = e, e = e.left;
    } else if (r > 0) {
      if (e.right === null) break;
      if (n(t, e.right.key) > 0) {
        const a = e.right;
        if (e.right = a.left, a.left = e, e = a, e.right === null) break;
      }
      s.right = e, s = e, e = e.right;
    } else break;
  }
  return s.right = e.left, o.left = e.right, e.left = i.right, e.right = i.left, e;
}
function ei(t, e, n, i) {
  const s = new Le(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = Se(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Ws(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = Se(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function sc(t, e, n) {
  return e === null ? t : (t === null || (e = Se(t.key, e, n), e.left = t), e);
}
function bi(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && bi(t.left, o, !1, i, s), t.right && bi(t.right, o, !0, i, s);
  }
}
class Yi {
  constructor(e = ic) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = ei(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new Le(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Se(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = Se(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = Se(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Se(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = Se(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    let a = this._root, l;
    for (; o.length !== 0 || a; )
      if (a)
        o.push(a), a = a.left;
      else {
        if (a = o.pop(), l = r(a.key, n), l > 0)
          break;
        if (r(a.key, e) >= 0 && i.call(s, a))
          return this;
        a = a.right;
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
    return rc(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && xi(e, n, 0, s - 1, o), this._root === null)
      this._root = vi(e, n, 0, s), this._size = s;
    else {
      const r = ac(
        this.toList(),
        oc(e, n),
        o
      );
      s = this._size + s, this._root = $i({ head: r }, 0, s);
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
    return bi(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Ws(e, this._root, s);
    s(e, n) < 0 ? r = ei(n, i, r, s) : o = ei(n, i, o, s), this._root = sc(o, r, s);
  }
  split(e) {
    return Ws(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function vi(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], a = e[o], l = new Le(r, a);
    return l.left = vi(t, e, n, o), l.right = vi(t, e, o + 1, i), l;
  }
  return null;
}
function oc(t, e) {
  const n = new Le(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new Le(t[s], e[s]);
  return i.next = null, n.next;
}
function rc(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new Le(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function $i(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = $i(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = $i(t, s + 1, n), r;
  }
  return null;
}
function ac(t, e, n) {
  const i = new Le(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function xi(t, e, n, i, s) {
  if (n >= i) return;
  const o = t[n + i >> 1];
  let r = n - 1, a = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(t[r], o) < 0);
    do
      a--;
    while (s(t[a], o) > 0);
    if (r >= a) break;
    let l = t[r];
    t[r] = t[a], t[a] = l, l = e[r], e[r] = e[a], e[a] = l;
  }
  xi(t, e, n, a, s), xi(t, e, a + 1, i, s);
}
const ye = 11102230246251565e-32, G = 134217729, lc = (3 + 8 * ye) * ye;
function ti(t, e, n, i, s) {
  let o, r, a, l, c = e[0], u = i[0], d = 0, p = 0;
  u > c == u > -c ? (o = c, c = e[++d]) : (o = u, u = i[++p]);
  let h = 0;
  if (d < t && p < n)
    for (u > c == u > -c ? (r = c + o, a = o - (r - c), c = e[++d]) : (r = u + o, a = o - (r - u), u = i[++p]), o = r, a !== 0 && (s[h++] = a); d < t && p < n; )
      u > c == u > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = e[++d]) : (r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p]), o = r, a !== 0 && (s[h++] = a);
  for (; d < t; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = e[++d], o = r, a !== 0 && (s[h++] = a);
  for (; p < n; )
    r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p], o = r, a !== 0 && (s[h++] = a);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function cc(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function _(t) {
  return new Float64Array(t);
}
const dc = (3 + 16 * ye) * ye, uc = (2 + 12 * ye) * ye, pc = (9 + 64 * ye) * ye * ye, qe = _(4), Zs = _(8), qs = _(12), Ks = _(16), X = _(4);
function hc(t, e, n, i, s, o, r) {
  let a, l, c, u, d, p, h, m, b, w, g, $, x, k, M, S, P, z;
  const T = t - s, D = n - s, U = e - o, F = i - o;
  k = T * F, p = G * T, h = p - (p - T), m = T - h, p = G * F, b = p - (p - F), w = F - b, M = m * w - (k - h * b - m * b - h * w), S = U * D, p = G * U, h = p - (p - U), m = U - h, p = G * D, b = p - (p - D), w = D - b, P = m * w - (S - h * b - m * b - h * w), g = M - P, d = M - g, qe[0] = M - (g + d) + (d - P), $ = k + g, d = $ - k, x = k - ($ - d) + (g - d), g = x - S, d = x - g, qe[1] = x - (g + d) + (d - S), z = $ + g, d = z - $, qe[2] = $ - (z - d) + (g - d), qe[3] = z;
  let te = cc(4, qe), me = uc * r;
  if (te >= me || -te >= me || (d = t - T, a = t - (T + d) + (d - s), d = n - D, c = n - (D + d) + (d - s), d = e - U, l = e - (U + d) + (d - o), d = i - F, u = i - (F + d) + (d - o), a === 0 && l === 0 && c === 0 && u === 0) || (me = pc * r + lc * Math.abs(te), te += T * u + F * a - (U * c + D * l), te >= me || -te >= me)) return te;
  k = a * F, p = G * a, h = p - (p - a), m = a - h, p = G * F, b = p - (p - F), w = F - b, M = m * w - (k - h * b - m * b - h * w), S = l * D, p = G * l, h = p - (p - l), m = l - h, p = G * D, b = p - (p - D), w = D - b, P = m * w - (S - h * b - m * b - h * w), g = M - P, d = M - g, X[0] = M - (g + d) + (d - P), $ = k + g, d = $ - k, x = k - ($ - d) + (g - d), g = x - S, d = x - g, X[1] = x - (g + d) + (d - S), z = $ + g, d = z - $, X[2] = $ - (z - d) + (g - d), X[3] = z;
  const hl = ti(4, qe, 4, X, Zs);
  k = T * u, p = G * T, h = p - (p - T), m = T - h, p = G * u, b = p - (p - u), w = u - b, M = m * w - (k - h * b - m * b - h * w), S = U * c, p = G * U, h = p - (p - U), m = U - h, p = G * c, b = p - (p - c), w = c - b, P = m * w - (S - h * b - m * b - h * w), g = M - P, d = M - g, X[0] = M - (g + d) + (d - P), $ = k + g, d = $ - k, x = k - ($ - d) + (g - d), g = x - S, d = x - g, X[1] = x - (g + d) + (d - S), z = $ + g, d = z - $, X[2] = $ - (z - d) + (g - d), X[3] = z;
  const fl = ti(hl, Zs, 4, X, qs);
  k = a * u, p = G * a, h = p - (p - a), m = a - h, p = G * u, b = p - (p - u), w = u - b, M = m * w - (k - h * b - m * b - h * w), S = l * c, p = G * l, h = p - (p - l), m = l - h, p = G * c, b = p - (p - c), w = c - b, P = m * w - (S - h * b - m * b - h * w), g = M - P, d = M - g, X[0] = M - (g + d) + (d - P), $ = k + g, d = $ - k, x = k - ($ - d) + (g - d), g = x - S, d = x - g, X[1] = x - (g + d) + (d - S), z = $ + g, d = z - $, X[2] = $ - (z - d) + (g - d), X[3] = z;
  const ml = ti(fl, qs, 4, X, Ks);
  return Ks[ml - 1];
}
function fc(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), a = (t - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= dc * c ? l : -hc(t, e, n, i, s, o, c);
}
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(8);
_(8);
_(8);
_(4);
_(8);
_(8);
_(16);
_(12);
_(192);
_(192);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(8);
_(8);
_(8);
_(8);
_(8);
_(8);
_(8);
_(8);
_(8);
_(4);
_(4);
_(4);
_(8);
_(16);
_(16);
_(16);
_(32);
_(32);
_(48);
_(64);
_(1152);
_(1152);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(4);
_(24);
_(24);
_(24);
_(24);
_(24);
_(24);
_(24);
_(24);
_(24);
_(24);
_(1152);
_(1152);
_(1152);
_(1152);
_(1152);
_(2304);
_(2304);
_(3456);
_(5760);
_(8);
_(8);
_(8);
_(16);
_(24);
_(48);
_(48);
_(96);
_(192);
_(384);
_(384);
_(384);
_(768);
_(96);
_(96);
_(96);
_(1152);
const pt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, ki = (t, e) => {
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
let Ee = Number.EPSILON;
Ee === void 0 && (Ee = Math.pow(2, -52));
const mc = Ee * Ee, Gs = (t, e) => {
  if (-Ee < t && t < Ee && -Ee < e && e < Ee)
    return 0;
  const n = t - e;
  return n * n < mc * t * e ? 0 : t < e ? -1 : 1;
};
class gc {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Ys(), this.yRounder = new Ys();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class Ys {
  constructor() {
    this.tree = new Yi(), this.round(0);
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
    if (i !== null && Gs(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && Gs(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const Lt = new gc(), rn = (t, e) => t.x * e.y - t.y * e.x, vr = (t, e) => t.x * e.x + t.y * e.y, Xs = (t, e, n) => {
  const i = fc(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, pn = (t) => Math.sqrt(vr(t, t)), wc = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return rn(s, i) / pn(s) / pn(i);
}, yc = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return vr(s, i) / pn(s) / pn(i);
}, Qs = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Js = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, bc = (t, e, n, i) => {
  if (e.x === 0) return Js(n, i, t.x);
  if (i.x === 0) return Js(t, e, n.x);
  if (e.y === 0) return Qs(n, i, t.y);
  if (i.y === 0) return Qs(t, e, n.y);
  const s = rn(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = rn(o, e) / s, a = rn(o, i) / s, l = t.x + a * e.x, c = n.x + r * i.x, u = t.y + a * e.y, d = n.y + r * i.y, p = (l + c) / 2, h = (u + d) / 2;
  return {
    x: p,
    y: h
  };
};
class oe {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = oe.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Pe.compare(e.segment, n.segment));
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
        sine: wc(this.point, e.point, o.point),
        cosine: yc(this.point, e.point, o.point)
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
let vc = 0;
class Pe {
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
    const a = e.leftSE.point.y, l = n.leftSE.point.y, c = e.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < c) return 1;
      if (l > a && l > c) return -1;
      const d = e.comparePoint(n.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const p = n.comparePoint(e.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (a < l && a < u) return -1;
      if (a > l && a > u) return 1;
      const d = n.comparePoint(e.leftSE.point);
      if (d !== 0) return d;
      const p = e.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
    if (o < r) {
      const d = n.comparePoint(e.rightSE.point);
      if (d !== 0) return d;
    }
    if (o > r) {
      const d = e.comparePoint(n.rightSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
    }
    if (o !== r) {
      const d = c - a, p = o - i, h = u - l, m = r - s;
      if (d > p && h < m) return 1;
      if (d < p && h > m) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++vc, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const a = oe.comparePoints(e, n);
    if (a < 0)
      s = e, o = n, r = 1;
    else if (a > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const l = new oe(s, !0), c = new oe(o, !1);
    return new Pe(l, c, [i], [r]);
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
    const a = (e.x - n.x) / s.x, l = n.y + a * s.y;
    return e.y === l ? 0 : e.y < l ? -1 : 1;
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
    const n = this.bbox(), i = e.bbox(), s = ki(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = e.leftSE.point, l = e.rightSE.point, c = pt(n, a) && this.comparePoint(a) === 0, u = pt(i, o) && e.comparePoint(o) === 0, d = pt(n, l) && this.comparePoint(l) === 0, p = pt(i, r) && e.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? l : null;
    if (u)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return p && r.x === a.x && r.y === a.y ? null : a;
    if (p && d) return null;
    if (p) return r;
    if (d) return l;
    const h = bc(o, this.vector(), a, e.vector());
    return h === null || !pt(s, h) ? null : Lt.round(h.x, h.y);
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
    const n = [], i = e.events !== void 0, s = new oe(e, !0), o = new oe(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new Pe(s, r, this.rings.slice(), this.windings.slice());
    return oe.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), oe.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Pe.compare(n, i);
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
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (le.type) {
      case "union": {
        const i = e.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        e.length < n.length ? (i = e.length, s = n.length) : (i = n.length, s = e.length), this._isInResult = s === le.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${le.type}`);
    }
    return this._isInResult;
  }
}
class eo {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Lt.round(e[0][0], e[0][1]);
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
    for (let r = 1, a = e.length; r < a; r++) {
      if (typeof e[r][0] != "number" || typeof e[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let l = Lt.round(e[r][0], e[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(Pe.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Pe.fromRing(o, s, this));
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
class $c {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new eo(e[0], this, !0), this.bbox = {
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
      const o = new eo(e[i], this, !1);
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
class to {
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
      const o = new $c(e[i], this);
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
class hn {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
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
          let h = null;
          for (let b = 0, w = d.length; b < w; b++)
            if (d[b].point === a.point) {
              h = b;
              break;
            }
          if (h !== null) {
            const b = d.splice(h)[0], w = c.splice(b.index);
            w.unshift(w[0].otherSE), n.push(new hn(w.reverse()));
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
      n.push(new hn(c));
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
    for (let c = 1, u = this.events.length - 1; c < u; c++) {
      const d = this.events[c].point, p = this.events[c + 1].point;
      Xs(d, e, p) !== 0 && (n.push(d), e = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Xs(i, e, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, a = this.isExteriorRing() ? n.length : -1, l = [];
    for (let c = r; c != a; c += o) l.push([n[c].x, n[c].y]);
    return l;
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
      oe.compare(e, r) > 0 && (e = r);
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
class no {
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
class xc {
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
        if (o.isExteriorRing()) n.push(new no(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new no(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class kc {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Pe.compare;
    this.queue = e, this.tree = new Yi(n), this.segments = [];
  }
  process(e) {
    const n = e.segment, i = [];
    if (e.consumedBy)
      return e.isLeft ? this.queue.remove(e.otherSE) : this.tree.remove(n), i;
    const s = e.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!s) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, a, l;
    for (; a === void 0; )
      o = this.tree.prev(o), o === null ? a = null : o.key.consumedBy === void 0 && (a = o.key);
    for (; l === void 0; )
      r = this.tree.next(r), r === null ? l = null : r.key.consumedBy === void 0 && (l = r.key);
    if (e.isLeft) {
      let c = null;
      if (a) {
        const d = a.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (c = d), !a.isAnEndpoint(d))) {
          const p = this._splitSafely(a, d);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      let u = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (u = d), !l.isAnEndpoint(d))) {
          const p = this._splitSafely(l, d);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      if (c !== null || u !== null) {
        let d = null;
        c === null ? d = u : u === null ? d = c : d = oe.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(d);
        for (let h = 0, m = p.length; h < m; h++)
          i.push(p[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = a);
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
  _splitSafely(e, n) {
    this.tree.remove(e);
    const i = e.rightSE;
    this.queue.remove(i);
    const s = e.split(n);
    return s.push(i), e.consumedBy === void 0 && this.tree.add(e), s;
  }
}
const io = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Mc = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class _c {
  run(e, n, i) {
    le.type = e, Lt.reset();
    const s = [new to(n, !0)];
    for (let d = 0, p = i.length; d < p; d++)
      s.push(new to(i[d], !1));
    if (le.numMultiPolys = s.length, le.type === "difference") {
      const d = s[0];
      let p = 1;
      for (; p < s.length; )
        ki(s[p].bbox, d.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (le.type === "intersection")
      for (let d = 0, p = s.length; d < p; d++) {
        const h = s[d];
        for (let m = d + 1, b = s.length; m < b; m++)
          if (ki(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Yi(oe.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const h = s[d].getSweepEvents();
      for (let m = 0, b = h.length; m < b; m++)
        if (o.insert(h[m]), o.size > io)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new kc(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const h = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > io)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Mc)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let h = 0, m = p.length; h < m; h++) {
        const b = p[h];
        b.consumedBy === void 0 && o.insert(b);
      }
      a = o.size, l = o.pop();
    }
    Lt.reset();
    const c = hn.factory(r.segments);
    return new xc(c).getGeom();
  }
}
const le = new _c(), Ac = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return le.run("union", t, n);
}, Sc = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return le.run("intersection", t, n);
}, Ec = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return le.run("xor", t, n);
}, Ic = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return le.run("difference", t, n);
};
var $r = {
  union: Ac,
  intersection: Sc,
  xor: Ec,
  difference: Ic
};
const xr = 3, Pc = 1e-6;
function Pn(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function W(t, e) {
  const n = Pn(t, e);
  return { x: n.x, y: n.y };
}
function at(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function kr(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: En(I(e, t)), len: L(t, e), leftOff: o, rightOff: r };
}
function ee(t, e) {
  return kr(W(t, e.a), W(t, e.b), e.thickness, e.baseline);
}
function Ne(t, e) {
  const n = I(e, t.a);
  return { t: B(n, t.dir), side: B(n, Q(t.dir)) };
}
function so(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Ge = (t) => O(t.p, E(Q(t.u), t.offL)), Ye = (t) => I(t.p, E(Q(t.u), t.offR));
function De(t, e, n) {
  return t !== null && L(t, e) <= n;
}
function Cc(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ee(t, n);
    if (i.len < 1e-9) continue;
    const s = Q(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: O(i.a, E(s, i.leftOff)),
        ar: I(i.a, E(s, i.rightOff)),
        bl: O(i.b, E(s, i.leftOff)),
        br: I(i.b, E(s, i.rightOff))
      }
    });
  }
  return e;
}
function Lc(t, e) {
  const n = e.f, i = Q(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = B(I(s.far, n.a), i) >= 0 ? O(n.a, E(i, n.leftOff)) : I(n.a, E(i, n.rightOff)), a = xr * Math.max(s.body.wall.thickness, e.wall.thickness), l = ue(Ge(s), s.u, r, n.dir), c = ue(Ye(s), s.u, r, n.dir);
    De(l, s.p, a) && (s.body.c[s.leftKey] = l), De(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function Oc(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = xr * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], a = ue(Ye(o), o.u, Ge(r), r.u);
    De(a, e, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (t.length < 3) return;
  const i = zc(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = I(r, o), l = J(a, I(e, o)), c = J(a, I(s.far, o));
    l * c < 0 && Mi(s, [e]);
  }
}
function Mi(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function zc(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(J(o.u, r.u)) > 1e-9 || B(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = t[(s + 2) % i], c = ue(Ye(o), o.u, Ge(l), l.u), u = ue(Ge(r), r.u, Ge(l), l.u);
        if (!De(c, e, n) || !De(u, e, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, Mi(o, [e, d, u]);
      } else {
        const l = t[(s - 1 + i) % i], c = ue(Ge(r), r.u, Ye(l), l.u), u = ue(Ye(o), o.u, Ye(l), l.u);
        if (!De(u, e, n) || !De(c, e, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, Mi(r, [u, d, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Mr(t) {
  const e = Cc(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(so(r, "a")), r.wall.b === i.id && s.push(so(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Lc(s, o) : s.length >= 2 && Oc(s, { x: i.x, y: i.y });
  }
  return e;
}
function _r(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Cn(t) {
  return new Map(Mr(t).map((e) => [e.wall.id, _r(e)]));
}
function oo(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), a = e(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(O(s, E(I(o, s), r / (r - a))));
  }
  return n;
}
function Xi(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Mr(t)) {
    const s = _r(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, d) => u.offset - d.offset), r = (u) => B(I(u, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const u of o)
      a.push([l, u.offset]), l = Math.max(l, u.offset + u.width);
    a.push([l, 1 / 0]);
    const c = [];
    for (const [u, d] of a) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = oo(p, (h) => r(h) - u)), d < 1 / 0 && (p = oo(p, (h) => d - r(h))), p.length >= 3 && Math.abs($e(p)) > Pc && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const _i = (t) => [t.map((e) => [e.x, e.y])];
function Ar(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Sr(t, e) {
  return Er(e ? [...Xi(t).values()].flat() : [...Cn(t).values()]);
}
function Er(t) {
  const e = t.map(_i);
  if (e.length === 0) return [];
  let n;
  try {
    n = $r.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Ar));
}
const nt = 1e-6, fn = ["door", "gate", "wicket"], Ir = (t) => t === "opening", Pr = (t) => t.passesLight ?? Ir(t.kind), Cr = (t) => t === "opening", Lr = (t) => t.passesPir ?? Cr(t.kind);
function Or(t, e) {
  return t.offset < e.offset + e.width - nt && e.offset < t.offset + t.width - nt;
}
function Ln(t, e, n, i, s) {
  const o = at(t, e);
  return o === null || i <= 0 || n < -nt || n + i > o + nt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && Or(r, { offset: n, width: i }));
}
function lt(t, e) {
  return { ...t, openings: e };
}
function Nc(t, e, n, i, s, o = {}) {
  const r = s ?? on[n], a = i - r / 2;
  if (!Ln(t, e, a, r)) return { level: t, openingId: null };
  const l = { id: q(), wallId: e, kind: n, offset: a, width: r, invalid: !1 };
  return fn.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: lt(t, [...t.openings, l]), openingId: l.id };
}
function zr(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Ln(t, i.wallId, n, i.width, e) ? t : Bt(lt(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Hc(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Ln(t, i.wallId, i.offset, n, e) ? t : Bt(lt(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Vc(t, e) {
  return fn.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Tc(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Bt(lt(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function Nr(t, e) {
  return Bt(lt(t, t.openings.filter((n) => n.id !== e)));
}
function Bt(t) {
  return lt(t, t.openings.map((e) => {
    const n = at(t, e.wallId), i = n === null || e.offset < -nt || e.offset + e.width > n + nt || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && Or(e, s));
    return { ...e, invalid: i };
  }));
}
const mn = 1e-6;
function Hr(t, e) {
  return e.mode !== "none" && Gi[t.kind].includes(e.mode);
}
function Vr(t, e, n) {
  if (n.mode === "none" || !Hr(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -et || i > et)) return !1;
  const s = at(t, n.wallId);
  return s !== null && n.offset >= -mn && n.offset <= s + mn;
}
function ke(t, e) {
  return { ...t, devices: e };
}
function ro(t, e, n, i) {
  if (!Vr(t, e, n)) return { level: t, deviceId: null };
  const s = { id: q(), name: i, placement: n, props: e, invalid: !1 };
  return { level: ke(t, [...t.devices, s]), deviceId: s.id };
}
function Tr(t, e) {
  const n = { id: q(), name: e, placement: { mode: "none" }, props: Ce("equipment", "free"), invalid: !1 };
  return { level: ke(t, [...t.devices, n]), id: n.id };
}
const Dc = ["power", "power_in", "power_out", "voltage"];
function Rc(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Dc.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const ct = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, Dr = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function Rr(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function Br(t, e, n) {
  const i = t.devices.find((l) => l.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const a = Sn({ ...i, props: Rr(i.props, "inverter", n), bindings: r });
  return ke(t, t.devices.map((l) => l === i ? a : l));
}
function On(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: Rr(i.props, "controllable", n) };
  return ke(t, t.devices.map((o) => o === i ? s : o));
}
function Fr(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Ce("motion_sensor", Ct(e)), s = Ce("motion_sensor", Ct(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function gn(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !Vr(t, s.props, n)) return t;
  const o = Fr(s.props, s.placement.mode, n.mode);
  return Ur(ke(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function Ft(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? ke(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Sn({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Bc(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !rt(i.props.kind) || i.props.kind === n) return t;
  const s = Ce(n, Ct(i.placement.mode));
  if (!Hr(s, i.placement)) return t;
  const o = Sn({ ...i, props: s });
  return ke(t, t.devices.map((r) => r === i ? o : r));
}
function Fc(t, e) {
  return ke(t, t.devices.filter((n) => n.id !== e));
}
function Ur(t) {
  return ke(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = at(t, e.placement.wallId), i = n === null || e.placement.offset < -mn || e.placement.offset > n + mn;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function jr(t) {
  const e = [];
  for (const n of Sr(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Ai(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!tt(e, s)) continue;
    const o = Math.abs($e(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const ni = 1e-3;
function Wr(t, e) {
  return t.length !== e.length || Math.abs(Math.abs($e(t)) - Math.abs($e(e))) > ni ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= ni && Math.abs(n.y - i.y) <= ni));
}
const Zr = 2, ao = Math.ceil(360 / Zr), lo = 1e-4, Uc = 1e-9, co = 1e-9, jc = {
  light: Pr,
  motion: Lr
};
function qr(t, e) {
  const n = [];
  for (const i of Er([...Xi(t, jc[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Qi(t, e, n) {
  return e.filter(([i, s]) => ve(t, i, s) <= n);
}
function ii(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Wc(t, e, n) {
  const i = Qi(t, e, n), s = [];
  for (let w = 0; w < ao; w++) s.push(-Math.PI + 2 * Math.PI * w / ao);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (L(t, g) > o) continue;
      const $ = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(ii($ - lo), ii($), ii($ + lo));
    }
  s.sort((w, g) => w - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    a[$] = w.x - t.x, l[$] = w.y - t.y, c[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const d = [], p = [];
  let h = NaN;
  for (const w of s) {
    if (w === h) continue;
    h = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let x = n, k = -1;
    for (let P = 0; P < r; P++) {
      const z = g * u[P] - $ * c[P];
      if (Math.abs(z) < 1e-12) continue;
      const T = (a[P] * u[P] - l[P] * c[P]) / z;
      if (!(T > Uc && T < x)) continue;
      const D = (a[P] * $ - l[P] * g) / z;
      D < -co || D > 1 + co || (x = T, k = P);
    }
    const M = { x: t.x + g * x, y: t.y + $ * x }, S = d.length;
    if (!(S > 0 && d[S - 1].x === M.x && d[S - 1].y === M.y)) {
      if (k >= 0 && S >= 2 && p[S - 1] === k && p[S - 2] === k) {
        d[S - 1] = M;
        continue;
      }
      d.push(M), p.push(k);
    }
  }
  const m = d[0], b = d[d.length - 1];
  return d.length > 1 && m.x === b.x && m.y === b.y && d.pop(), d;
}
const Zc = 32, uo = 128;
function wn(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function be(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Ji(t) {
  return (t % 360 + 360) % 360;
}
function Kr(t) {
  return (t % 360 + 540) % 360 - 180;
}
function Gr(t, e, n, i) {
  const s = t.walls.find((c) => c.id === e);
  if (!s) return null;
  let o;
  try {
    o = ee(t, s);
  } catch {
    return null;
  }
  const r = Q(o.dir), a = n === "left" ? r : E(r, -1), l = n === "left" ? o.leftOff : o.rightOff;
  return { pt: O(O(o.a, E(o.dir, i)), E(a, l)), normal: a };
}
function zn(t, e, n, i) {
  var s;
  return ((s = Gr(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Y(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: wn(n.rotation) };
  const i = Gr(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: O(i.pt, E(s, r)), dir: Q(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? wn(be(s) + n.aim) : s, normal: s };
}
function Yr(t, e) {
  const n = [];
  for (let i = 0; i < uo; i++) n.push(O(t, E(wn(360 * i / uo), e)));
  return n;
}
function po(t, e, n, i) {
  if (n >= 360) return Yr(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Zc)), o = be(e) - n / 2, r = [t];
  for (let a = 0; a <= s; a++) r.push(O(t, E(wn(o + n * a / s), i)));
  return r;
}
const qc = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Nn(t) {
  return qc[t] ?? null;
}
const Kc = (t) => Nn(t.kind) !== null;
function Gc(t, e) {
  const n = e.props;
  if (!Kc(n)) return null;
  const i = Y(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? po(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? po(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Yr(i.pt, n.poolRadius) : null;
  }
}
function Yc(t) {
  return t.normal ? O(t.pt, t.normal) : t.pt;
}
function ho(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Xc(t, e, n) {
  const i = I(e, t);
  for (const [s, o] of n) {
    const r = I(o, s), a = I(s, t), l = J(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const c = J(a, r) / l, u = J(a, i) / l;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const fo = 0.5, Qc = 3, Jc = 1e-4;
function ed(t, e, n) {
  const i = Y(t, e);
  if (!i) return null;
  const s = Yc(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (M) => ho(M, n) || Qi(M, n, fo).length > 0;
  if (!r(s)) return s;
  const a = ee(t, t.walls.find((M) => M.id === o.wallId)), l = i.normal, c = (M) => Math.abs(B(I(M, i.pt), l)) <= Jc, u = ([M, S]) => E(O(M, S), 0.5), d = n.filter((M) => c(M[0]) && c(M[1]) && L(M[0], M[1]) > 1e-9 && !ho(O(u(M), E(l, fo)), n)), p = (M) => B(I(M, a.a), a.dir), h = ([M, S]) => Math.max(0, Math.min(p(M), p(S)) - o.offset, o.offset - Math.max(p(M), p(S))), m = Math.min(...d.map(h)), b = d.filter((M) => h(M) <= m + 1e-6).map((M) => O(u(M), l)), w = (M) => b.some((S) => !Xc(M, S, n)), g = Qc * Math.max(...t.walls.map((M) => M.thickness)) + 2, $ = [];
  for (const [M, S] of n) {
    const P = I(S, M), z = I(M, s), T = J(a.dir, P);
    if (Math.abs(T) < 1e-12) continue;
    const D = J(z, a.dir) / T;
    if (D < -1e-9 || D > 1 + 1e-9) continue;
    const U = J(z, P) / T, F = L(M, S) / Math.abs(T);
    $.push(U - F, U + F);
  }
  const x = o.offset <= a.len / 2 ? 1 : -1, k = $.filter((M) => Math.abs(M) <= g).sort((M, S) => Math.abs(M) - Math.abs(S) || Math.sign(S) * x - Math.sign(M) * x);
  for (const M of k) {
    const S = O(s, E(a.dir, M));
    if (!r(S) && w(S)) return S;
  }
  return null;
}
const td = 1 / Math.cos(Zr / 2 * (Math.PI / 180)), mo = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function nd(t, e, n = qr) {
  const i = Gc(t, e), s = Nn(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = ed(t, e, o);
  if (!r) return [];
  const a = Math.max(...i.map((d) => L(d, r))) * td, l = Qi(r, o, a);
  if (l.length === 0) return [i];
  const c = Wc(r, l, a);
  let u;
  try {
    u = $r.intersection(_i(mo(i)), _i(mo(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(Ar));
}
function id(t, e, n, i) {
  const s = Y(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, B(I(n, s.pt), s.dir)));
    return L(O(s.pt, E(s.dir, a)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return L(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return L(s.pt, n) <= i;
  if (o.shape === "circle") return L(s.pt, n) <= o.diameter / 2 + i;
  const r = I(n, s.pt);
  return Math.abs(B(r, s.dir)) <= o.width / 2 + i && Math.abs(B(r, Q(s.dir))) <= o.depth / 2 + i;
}
function Xr(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && id(t, i[o], e, n)) return i[o].id;
  return null;
}
const sd = 60;
function Si(t, e, n) {
  if (!gr.has(e.props.kind)) return null;
  const i = Y(t, e);
  return i ? { from: i.pt, to: O(i.pt, E(i.dir, sd / n)) } : null;
}
function Qr(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function od(t, e, n, i) {
  const s = e.placement, o = Y(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = be(I(n, o.pt)), a = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: Ji(a(r)) };
  const l = Kr(r - be(o.normal)), c = Math.max(-et, Math.min(et, a(l)));
  return Qr(s, c);
}
const rd = 1, go = 1, wo = 1e-6, ad = 1e-9, ld = 1e-6, cd = 1;
function es(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = at(t, e.wallId);
      return n === null ? null : zn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function ie(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => es(t, i) ?? { x: i.x, y: i.y });
}
function ts(t, e) {
  const n = ie(t, e);
  return n.length < 3 ? null : Math.round(Math.abs($e(n)) / 1e5) / 10;
}
function bt(t, e, n) {
  const i = J(I(e, t), I(n, t));
  return Math.abs(i) <= ad * L(t, e) * L(t, n) ? 0 : Math.sign(i);
}
const Zt = (t, e, n) => B(I(e, t), I(n, t)) <= 0;
function Jr(t, e, n, i) {
  const s = bt(n, i, t), o = bt(n, i, e), r = bt(t, e, n), a = bt(t, e, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && Zt(n, t, e) || a === 0 && Zt(i, t, e) || s === 0 && Zt(t, n, i) || o === 0 && Zt(e, n, i);
}
function dd(t) {
  const e = [];
  for (const n of t) (e.length === 0 || L(e[e.length - 1], n) > wo) && e.push(n);
  for (; e.length > 1 && L(e[0], e[e.length - 1]) <= wo; ) e.pop();
  return e;
}
function yn(t) {
  const e = dd(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (bt(s, o, r) === 0 && B(I(o, s), I(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && Jr(s, o, e[a], e[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function ea(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : es(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = at(t, o.wallId);
    return r !== null && (o.offset < -go || o.offset > r + go);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = ie(t, e);
  return Math.abs($e(s)) < cd || yn(s) ? "crossing" : null;
}
function Hn(t, e) {
  return tt(e, t) || t.some((n, i) => ve(e, n, t[(i + 1) % t.length]) <= rd);
}
const ta = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function ud(t, e) {
  const n = Y(t, e);
  return n ? t.zones.filter((i) => Hn(ie(t, i), n.pt)).map((i) => ({ zone: i, participates: ta(e, i.id) })) : [];
}
function na(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = ie(t, n), s = [];
  for (const o of t.devices) {
    const r = Y(t, o);
    r && Hn(i, r.pt) && s.push({ device: o, participates: ta(o, e) });
  }
  return s;
}
function pd(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = $e(t);
  if (Math.abs(n) > ld) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const a = t[r], l = t[(r + 1) % e], c = a.x * l.y - l.x * a.y;
      i += (a.x + l.x) * c, s += (a.y + l.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (tt(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const si = 32;
function yo(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, ve(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function ia(t) {
  const e = t.zones.map((s) => ie(t, s)), n = e.map((s) => Math.abs($e(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const a = e.filter((b, w) => w !== o && b.length >= 3 && n[w] < n[o] && b.every((g) => Hn(r, g))), l = pd(r);
    if (a.length === 0) {
      i.set(s.id, l);
      return;
    }
    const c = r.map((b) => b.x), u = r.map((b) => b.y), d = Math.min(...c), p = Math.min(...u), h = Math.max(Math.max(...c) - d, Math.max(...u) - p) / si;
    let m = null;
    for (let b = d + h / 2; b < d + h * si; b += h)
      for (let w = p + h / 2; w < p + h * si; w += h) {
        const g = { x: b, y: w };
        if (!tt(g, r) || a.some((x) => tt(g, x))) continue;
        const $ = Math.min(yo(g, [r]), yo(g, a));
        (!m || $ > m.d) && (m = { p: g, d: $ });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? l);
  }), i;
}
const ns = 3, it = (t, e) => ({ ...t, zones: e }), Ot = (t, e, n) => it(t, t.zones.map((i) => i === e ? n : i)), is = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), sa = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function hd(t, e) {
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
function fd(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && sa(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => hd(n, e.vertices[i]));
}
function oa(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && fd(t.shape, e.shape);
}
function md(t, e) {
  if (e.kind === "free") return e;
  const n = es(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : is(e);
}
function ra(t, e) {
  const n = e.shape, i = n.vertices.map((s) => md(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function gd(t, e, n) {
  const i = t.shape, s = Ai(e, i.seed);
  return !s || n.some((o) => Wr(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && sa(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function aa(t, e) {
  const n = ea(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const ss = (t, e) => aa(t, ra(t, e));
function wd(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? jr(t) : [], i = [], s = e.map((o) => aa(
    t,
    o.shape.kind === "walls" ? gd(o, n, i) : ra(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? it(t, s) : t;
}
function yd(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && oa(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : it(t, i) : s.some((o, r) => o !== n[r]) ? it(t, s) : t;
}
function bd(t, e, n) {
  const i = jr(t), s = Ai(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const a = Ai(i, r.shape.seed);
    if (a && Wr(a, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: q(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: it(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const os = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function vd(t, e, n) {
  if (e.length < ns) return { level: t, zoneId: null };
  const i = ss(t, { id: q(), name: n, shape: { kind: "polygon", vertices: e.map(os) }, invalid: !1 });
  return yn(ie(t, i)) ? { level: t, zoneId: null } : { level: it(t, [...t.zones, i]), zoneId: i.id };
}
function $d(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : Ot(t, i, { ...i, name: n });
}
function rs(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return Ot(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return Ot(t, i, o);
}
function la(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function ca(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? la(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function as(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function ls(t, e, n) {
  const i = ss(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return oa(i, e) ? t : Ot(t, e, i);
}
const cs = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function xd(t, e, n, i) {
  const s = as(t, e);
  return !s || !cs(n, s.shape.vertices.length) ? t : ls(t, s, s.shape.vertices.map((o, r) => r === n ? os(i) : o));
}
function kd(t, e, n, i) {
  const s = as(t, e);
  if (!s || !cs(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, os(i)), ls(t, s, o);
}
function Md(t, e, n) {
  const i = as(t, e);
  return !i || i.shape.vertices.length <= ns || !cs(n, i.shape.vertices.length) ? t : ls(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function _d(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < ns) return t;
  const i = n.shape.outline.map(is);
  return Ot(t, n, ss(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function da(t, e, n, i) {
  const s = t.devices.find((a) => a.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((a) => a.id === n)) return t;
  const r = la(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
const zt = 1;
function fe(t) {
  return structuredClone(t);
}
function Vn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Ad(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Tn(t, e, n) {
  const i = W(t, e.a), s = W(t, e.b), o = L(i, s), r = Ad(typeof n == "number" ? n : In(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : br(i, s, r / o), offset: r };
}
function Sd(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Tn(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function ua(t, e) {
  Sd(t), e && Cd(e, t);
  const n = wd(Ur(Bt(t)));
  return e ? yd(n, e) : n;
}
function Me(t, e) {
  return ua(fe(t), e);
}
function pa(t, e, n) {
  const i = Pn(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Tn(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function bo(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: W(t, e.nodeId), nodeId: e.nodeId };
  const n = Vn(t, e.wallId), { pt: i, offset: s } = Tn(t, n, e.offset), o = L(W(t, n.a), W(t, n.b));
  return s <= zt ? { pt: W(t, n.a), nodeId: n.a } : o - s <= zt ? { pt: W(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function vo(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: q(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Ed(t, e, n, i) {
  const s = bo(t, e), o = bo(t, n);
  if (L(s.pt, o.pt) < zt) return { level: t, wallId: null, endNodeId: null };
  const r = fe(t), a = vo(r, s), l = vo(r, o);
  if (a === l) return { level: t, wallId: null, endNodeId: null };
  const c = { id: q(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Me(r, t), wallId: c.id, endNodeId: l };
}
function ha(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, a = Math.min(t.y, e.y) - s, l = Math.max(t.y, e.y) + s;
  return r - o < zt || l - a < zt ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Id(t, e, n, i, s) {
  const o = ha(e, n, i.thickness, s);
  if (!o) return t;
  const r = fe(t), a = o.map((l) => {
    const c = { id: q(), x: l.x, y: l.y };
    return r.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: q(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Me(r, t);
}
function Pd(t, e, n) {
  const i = fe(t);
  return pa(i, e, n), ua(i, t);
}
function Cd(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const s = t.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = t.nodes.find((d) => d.id === s.a), r = t.nodes.find((d) => d.id === s.b), a = e.nodes.find((d) => d.id === i.a), l = e.nodes.find((d) => d.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const c = L(a, l);
    if (c === 0) continue;
    const u = En(I(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = In(O(o, E(u, d.offset)), a, l) * c);
  }
}
function Ld(t, e, n) {
  const i = fe(t), s = Vn(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: O(W(i, a), n) }));
  for (const a of r) pa(i, a.id, a.to);
  return Me(i, t);
}
function Dn(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function fa(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function Od(t, e, n) {
  const i = fe(t), s = Vn(i, e), o = s[n], r = W(i, o), a = { id: q(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || fa(i, o, a.id), Dn(i), { level: Me(i, t), nodeId: a.id };
}
function zd(t, e, n) {
  if (e === n) return t;
  const i = fe(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return fa(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), Dn(i), Me(i, t);
}
function ds(t, e) {
  var i;
  const n = fe(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return Dn(n), Me(n, t);
}
function Nd(t, e, n) {
  const i = fe(t);
  return Object.assign(Vn(i, e), n), Me(i, t);
}
const se = (t) => typeof t == "string" && t !== "" ? t : null, ma = (t) => t.split(".")[0], Hd = ["friendly_name", "device_class", "unit_of_measurement"];
function ga(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: ma(t),
    name: se(n.friendly_name) ?? t,
    deviceClass: se(n.device_class),
    unit: se(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Vd(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, ga(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Td(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && Hd.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(t).length;
}
function wa(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Dd(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = ga(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: se(r.name) ?? se(r.original_name) ?? a.name,
      deviceId: se(r.device_id),
      areaId: se(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: se(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: se(r.name_by_user) ?? se(r.name) ?? r.id, model: se(r.model), areaId: se(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Rd(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function ya(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : wa(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Bd = {
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
  "snap.mid": "snap: midpoint",
  "snap.wall": "snap: wall",
  "snap.zoneVertex": "snap: zone corner",
  "snap.zoneEdge": "snap: zone edge",
  "snap.grid": "snap: grid",
  "snapmark.node": "endpoint",
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
  return Bd[t] ?? t;
}
const Fd = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Ud = 10;
function dt(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return ct(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function ba() {
  return { blocks: [{ id: q(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function jd(t, e, n, i) {
  const s = { id: q(), x: e.x, y: e.y }, o = { ...s, name: `${f(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function $o(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Rn(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Wd(t, e, n, i) {
  return Rn(t, e, (s) => ({ ...s, x: n, y: i }));
}
const Ei = (t) => "block" in t ? t.block : t.bus, va = (t, e) => Ei(t.from) === e || Ei(t.to) === e;
function Nt(t, e, n, i) {
  const s = t.blocks.find((c) => c.id === e);
  if (!s) return t;
  const o = Rn(t, e, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !va(c, e)) };
  const r = o.blocks.find((c) => c.id === e), a = new Set(dt(r, i).map((c) => c.name)), l = (c) => "block" in c && c.block === e && !a.has(c.port);
  return o.wires.some((c) => l(c.from) || l(c.to)) ? { ...o, wires: o.wires.filter((c) => !l(c.from) && !l(c.to)) } : o;
}
function $a(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !va(i, e)) };
}
const xa = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function Bn(t, e, n) {
  const i = xa(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(dt(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = t.wires.filter((c) => !o(c.from) && !o(c.to));
  let a = !1;
  const l = t.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((m) => u.has(m))) return c;
    a = !0;
    const d = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => u.has(m))), { portPins: p, ...h } = c;
    return Object.keys(d).length ? { ...h, portPins: d } : h;
  });
  return r.length === t.wires.length && !a ? t : { ...t, blocks: l, wires: r };
}
function Zd(t, e) {
  const n = us(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = Bn(s, o, n);
  return s;
}
function qd(t, e) {
  const n = xa(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(Ei(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const us = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function ka(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Fc(t, n);
  return { level: s, power: i ? qd(e, n) : Bn(e, n, us(s)) };
}
function Ma(t, e, n, i) {
  const s = Br(t, n, i);
  return { level: s, power: s === t ? e : Bn(e, n, us(s)) };
}
function _a(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Kd(t, e, n, i) {
  return Rn(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...a } = s;
    return Object.keys(o).length ? { ...a, portPins: o } : a;
  });
}
function Gd(t, e) {
  return Rn(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function xo(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Yd(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, Ud), s = /* @__PURE__ */ new Map();
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
    for (const u of e) {
      const d = l(c(u.from, u)), p = l(c(u.to, u));
      if (d === p) return !0;
      a.set(d, p);
    }
  }
  return !1;
}
function ko(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const k = s.get(g.bus);
      return k && k.kind === "bus" ? { bl: k, dir: null } : null;
    }
    const $ = s.get(g.block), x = $ ? dt($, i).find((k) => k.name === g.port) : void 0;
    return $ && x ? { bl: $, dir: x.dir } : null;
  }, r = o(e), a = o(n);
  if (!r || !a) return { error: "missing" };
  if (r.bl.id === a.bl.id) return { error: "same-block" };
  let l = e, c = n;
  if (r.dir === null || a.dir === null)
    (r.dir === "in" || a.dir === "out") && (l = n, c = e);
  else {
    if (r.dir === a.dir)
      return { error: "direction" };
    r.dir === "in" && (l = n, c = e);
  }
  const u = (g) => "block" in g && t.wires.some(($) => [$.from, $.to].some((x) => "block" in x && x.block === g.block && x.port === g.port));
  if (u(l) || u(c)) return { error: "port-taken" };
  const d = (g) => {
    for (const $ of t.wires)
      for (const [x, k] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in x && x.bus === g && "block" in k) {
          const M = s.get(k.block);
          if (M) return xo(M, k.port);
        }
    return null;
  }, p = (g) => "bus" in g ? d(g.bus) : xo(s.get(g.block), g.port), h = p(l), m = p(c);
  if (h !== null && m !== null && h !== m) return { error: "dc-mismatch" };
  if ("bus" in l && "block" in c && s.get(c.block).kind === "remainder" && t.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === l.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const b = { id: q(), from: l, to: c }, w = [...t.wires, b];
  return Yd(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: b };
}
const ge = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Qe = (t) => typeof t == "number" && Number.isFinite(t), Xd = ["top", "right", "bottom", "left"], Qd = ["2in1out", "1in2out"];
function Jd(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Qe(n.w) && Qe(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Qd.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(dt(n, e).map((c) => c.name)), o = {};
  let r = ge(i);
  for (const [c, u] of ge(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !ge(u) || !Xd.includes(u.side) || !Qe(u.at)) {
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
function eu(t, e) {
  if (!ge(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (ge(u) && typeof u.id == "string" && u.id && Fd.includes(u.kind) && Qe(u.x) && Qe(u.y)) {
      const d = Jd(u, e);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const a = new Map(o.map((u) => [u.id, u])), l = (u) => {
    var p;
    if (!ge(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = a.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !Qe(u.at)) return null;
      const h = Math.min(1, Math.max(0, u.at));
      return h === u.at ? u : { bus: u.bus, at: h };
    }
    const d = typeof u.block == "string" ? a.get(u.block) : void 0;
    return d && !r.has(d.id) && dt(d, e).some((h) => h.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = ge(u) ? l(u.from) : null, p = ge(u) ? l(u.to) : null;
    if (!ge(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...t, blocks: o, wires: c } : t;
}
function Aa(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function tu(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Ut = 11, bn = 18, vn = 30, nu = 12, iu = 120, ne = 14, Mo = 10, Ht = (t) => Math.round(t / Mo) * Mo || 0, oi = 24, _o = 6, su = 2 * Ut + 6, ou = ne, ru = 1e6, Ao = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Fn = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), ri = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Sa = (t) => Math.min(1, Math.max(0, t));
function Un(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function au(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = ct(i);
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
function he(t, e, n) {
  return n ? fs(n, t, e).r : ps(t, e);
}
function ps(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(iu, 7 * Un(t, e).length + 32),
    h: vn + bn * au(t, e) + nu
  };
}
function $n(t, e, n) {
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
function lu(t, e) {
  const n = Fn(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function cu(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const a of n) {
    const l = ve(e, a.a, a.b);
    l < s && (i = a, s = l);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Sa(r) };
}
const Vt = (t) => t.w >= t.h;
function Ea(t, e) {
  return Vt(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function du(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Vt(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: $n(i, r, 0.5), side: r };
  }
  const s = Fn(i), o = Vt(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: $n(i, o, e), side: o };
}
function uu(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const hs = (t, e) => t.blocks.find((n) => n.id === e), Ii = (t, e) => {
  const n = hs(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, ai = (t, e, n) => "block" in t && t.block === e && t.port === n;
function pu(t, e, n, i) {
  const s = t.wires.find((a) => ai(a.from, e, n) || ai(a.to, e, n));
  if (!s) return null;
  const o = ai(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const a = Ii(t, o.bus);
    return a ? Ea(a, o.at) : null;
  }
  const r = hs(t, o.block);
  return r ? Fn(ps(r, i)) : null;
}
function fs(t, e, n) {
  const i = ps(e, n), s = Fn(i), o = dt(e, n).map((c) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = pu(t, e.id, c.name, n), p = (d && lu(i, d)) ?? uu(e, c), h = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? h.x : h.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * su : 0;
  }, a = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, l = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (l[u] = { name: c.name, dir: c.dir, side: c.side, pt: $n(a, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, h) => {
      l[p] = { name: d.name, dir: d.dir, side: c, pt: $n(a, c, (h + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: a, places: l };
}
function jn(t, e, n) {
  return fs(t, e, n).places;
}
function Ia(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = hs(t, c.block);
    if (!u) return null;
    const { r: d, places: p } = fs(t, u, n), h = p.find((m) => m.name === c.port);
    return h ? { pt: h.pt, side: h.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = Ii(t, c.bus);
    if (!p) return null;
    let h = d == null ? void 0 : d.pt;
    if (!h && "bus" in u) {
      const m = Ii(t, u.bus);
      h = m && Ea(m, u.at);
    }
    return h ? { ...du(p, c.at, h), rect: he(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), a = o ?? s(e.from, e.to, r), l = r ?? s(e.to, e.from, o);
  return a && l ? { a, b: l } : null;
}
const qt = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Pi = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function hu(t, e, n) {
  const i = [];
  for (const a of t) {
    const l = i[i.length - 1];
    if (!(l && l.x === a.x && l.y === a.y)) {
      if (l && l.x !== a.x && l.y !== a.y) return null;
      if (i.length >= 2) {
        const c = qt(i[i.length - 2], l), u = qt(l, a);
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
  const o = qt(i[0], i[1]), r = qt(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || Pi(i[0], i[1]) < ne - 1e-9 || r.x !== -n.x || r.y !== -n.y || Pi(i[s - 2], i[s - 1]) < ne - 1e-9 ? null : i;
}
function fu(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function mu(t, e) {
  let n = (t.length - 2) * ou;
  for (let i = 1; i < t.length; i++) {
    n += Pi(t[i - 1], t[i]);
    for (const s of e) fu(t[i - 1], t[i], s) && (n += ru);
  }
  return n;
}
function Pa(t, e) {
  const n = t.pt, i = e.pt, s = Ao[t.side], o = Ao[e.side], r = { x: n.x + s.x * ne, y: n.y + s.y * ne }, a = { x: i.x + o.x * ne, y: i.y + o.y * ne }, l = [t.rect, e.rect].filter((x) => !!x), c = (x, k) => [.../* @__PURE__ */ new Set([
    (r[x] + a[x]) / 2,
    r[x],
    a[x],
    n[x],
    i[x],
    ...l.flatMap((M) => [M[x] - ne, M[x] + M[k] + ne]),
    Math.min(r[x], a[x]) - ne,
    Math.max(r[x], a[x]) + ne
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, h = o.x === 0, m = (p ? d : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= ne - 1e-9), b = (h ? d : u).filter((x) => (x - (h ? i.y : i.x)) * (h ? o.y : o.x) >= ne - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (x) => {
    const k = hu(x, s, o);
    if (!k) return;
    const M = mu(k, l);
    M < g - 1e-6 && (w = k, g = M);
  };
  if (p && h)
    for (const x of m) for (const k of u) for (const M of b)
      $([n, { x: n.x, y: x }, { x: k, y: x }, { x: k, y: M }, { x: i.x, y: M }, i]);
  else if (!p && !h)
    for (const x of m) for (const k of d) for (const M of b)
      $([n, { x, y: n.y }, { x, y: k }, { x: M, y: k }, { x: M, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const k of b)
      $([n, { x: n.x, y: x }, { x: k, y: x }, { x: k, y: i.y }, i]);
  else
    for (const x of m) for (const k of b)
      $([n, { x, y: n.y }, { x, y: k }, { x: i.x, y: k }, i]);
  return w ?? [n, r, p ? { x: r.x, y: a.y } : { x: a.x, y: r.y }, a, i];
}
function Ca(t, e, n) {
  const i = he(t, e, n), s = i.x + (i.w - (3 * oi + 2 * _o)) / 2, o = i.y + vn + 1;
  return ["A", "0", "B"].map((r, a) => ({
    position: r,
    rect: { x: s + a * (oi + _o), y: o, w: oi, h: bn - 2 }
  }));
}
function gu(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return Vt(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function So(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = Ca(u, i, t).find((p) => ri(e, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of jn(t, u, i)) {
      const p = L(e, d.pt);
      p <= Ut + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const h of gu(u)) {
      const m = ve(e, h.a, h.b);
      m <= n && m < p && (d = { kind: "bus-end", id: u.id, end: h.end }, p = m);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !ri(e, he(u, i, t), n)) continue;
    const d = Vt(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Sa(d) };
  }
  let a = null, l = 1 / 0;
  for (const u of t.wires) {
    const d = Ia(t, u, i);
    if (!d) continue;
    const p = Pa(d.a, d.b);
    for (let h = 1; h < p.length; h++) {
      const m = ve(e, p[h - 1], p[h]);
      m <= n && m < l && (a = { kind: "wire", id: u.id }, l = m);
    }
  }
  if (a) return a;
  const c = s.find((u) => u.kind !== "bus" && ri(e, he(u, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function wu(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const a = he(r, e, t);
    n = Math.min(n, a.x), i = Math.min(i, a.y), s = Math.max(s, a.x + a.w), o = Math.max(o, a.y + a.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class La extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function li(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function yu(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function bu(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new La(s.message) : s;
  }
}
async function vu(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const $u = 3;
function we(t) {
  if (typeof t == "number")
    return t === $u ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class xu {
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
    const i = { ...e, id: q(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await bu(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof La ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = we(o)), this.onChange(), null;
    }
  }
}
var Oa = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", ku = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Mu = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", _u = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Au = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Su = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Eo = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Kt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Eu = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Iu = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Pu = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Cu = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Lu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Ou = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", zu = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Nu = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Hu = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Vu = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Tu = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Du = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", Ru = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", Bu = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Fu = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", za = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Uu = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", ju = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", Na = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Wu = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Zu = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", qu = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Ku = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z", Gu = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Yu = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Xu = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Qu = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", Ju = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const ae = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function pe(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function Ha(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${f("unit.m2")}`;
}
const ms = 12, R = "non-scaling-stroke", ep = 7, tp = 10, np = "#f43f5e", ip = "3 2", sp = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Va = 24, Gt = 4, Io = 4, an = ms * 0.85, op = 0.58;
function rp(t, e, n, i) {
  const s = Va;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), a = Math.abs(Math.sin(o)), [l, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * a, t.width * a + t.depth * r], u = l * i - 2 * Io, d = c * i - 2 * Io, p = e.length * op * an, h = s + Gt + an, m = s + Gt + p, b = Math.max(s, p), w = (k, M) => Math.max(0, k - u) + Math.max(0, M - d), g = w(b, h), $ = w(m, s);
  if (g > 0 && $ < g) {
    const k = -m / 2;
    return {
      mode: "line",
      iconX: (k + s / 2) / i,
      iconY: 0,
      labelX: (k + s + Gt) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -h / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + s / 2) / i,
    labelX: 0,
    labelY: (x + s + Gt + an / 2) / i,
    labelAnchor: "middle"
  };
}
function ap(t, e, n, i = 0, s = 0) {
  const o = Va / e;
  return customElements.get("ha-icon") ? A`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : A`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${sp} fill=${n}></path></g>`;
}
const lp = "__preview__", cp = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, dp = /* @__PURE__ */ new WeakMap();
function up(t, e) {
  var s;
  const n = pe(dp, t.walls, () => /* @__PURE__ */ new WeakMap()), i = pe(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = pe(i, t.openings, () => ({})))[e] ?? (s[e] = qr(t, e));
}
const pp = /* @__PURE__ */ new WeakMap();
function hp(t, e) {
  const n = Nn(e.props.kind);
  if (!n) return [];
  const i = up(t, n), s = pe(pp, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = nd(t, e, () => i), s.set(e, o)), o;
}
function Ci(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function fp(t, e, n, i, s) {
  const o = t.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? A`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></rect>` : o.shape === "spot" ? A`<circle class="icon" r=${e / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${R}></circle>` : A`<circle class="icon" r=${Ci(t, e)} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>`;
    case "wall_light":
      return A`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${R}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${e * l} ${-e * l * 0.8}A${e * l} ${e * l * 0.8} 0 0 1 ${e * l} ${e * l * 0.8}`;
      return A`<circle class="icon" r=${e * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const c = l * Math.PI / 4;
        a += `M${Math.cos(c) * e * 1.15} ${Math.sin(c) * e * 1.15}L${Math.cos(c) * e * 1.6} ${Math.sin(c) * e * 1.6}`;
      }
      return A`<circle class="icon" r=${e * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    case "wall_switch":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v} vector-effect=${R}></rect>`;
    case "smart_button":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v}
        vector-effect=${R}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return A`<circle class="icon" r=${e} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return A`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${R}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${R}></path>`;
    case "exhaust_fan": {
      let a = "";
      for (let l = 0; l < 4; l++) {
        const c = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(c) * e * 0.85} ${Math.sin(c) * e * 0.85}`;
      }
      return A`<circle class="icon" r=${e} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${R}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${R}></path>`;
    }
    default:
      return A`${v}`;
  }
}
function mp(t, e, n, i) {
  const s = t.props;
  if (s.kind !== "equipment") return A`${v}`;
  const o = rp(s, s.label, i, e.scale), r = s.shape === "circle" ? A`<circle class="equipment-body" r=${s.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${R}></circle>` : A`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${R}></rect>`;
  return A`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${ap(s.icon, e.scale, n, o.iconX, o.iconY)}
    <text class="equipment-label" x=${o.labelX} y=${o.labelY} text-anchor=${o.labelAnchor} dominant-baseline="middle"
      font-size=${an / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function gp(t, e, n = 0) {
  return t === "bound" ? v : A`<circle class=${`bind-ring bind-${t}`} r=${Math.max(ms * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${cp[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : v} vector-effect=${R}></circle>`;
}
function wp(t) {
  return t.action === "toggle" ? ["toggle", Ku] : t.action === "auto" ? ["auto", ju] : t.value === "off" ? ["set-off", Ru] : ["set-on", Du];
}
function yp(t, e, n, i) {
  const s = e ? wp(e) : t.status === "error" ? ["alert", Oa] : null;
  if (!s) return v;
  const [o, r] = s, a = e ? i.palette.selection : np, l = n * 0.9, c = -n * 0.9, u = tp / i.scale;
  return A`<g class="badge" data-badge=${o}>
    <circle cx=${l} cy=${c} r=${ep / i.scale} fill=${i.palette.background} stroke=${a} stroke-width="1.5"
      vector-effect=${R}></circle>
    <path d=${r} fill=${a} transform=${`translate(${l - u / 2} ${c - u / 2}) scale(${u / 24})`}></path>
  </g>`;
}
function bp(t, e, n, i) {
  var b, w, g;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = ms / n.scale, a = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, l = !i && ((b = n.selection) == null ? void 0 : b.kind) === "device" && n.selection.id === t.id, c = !i && rt(t.props.kind), u = c ? (w = n.containerState) == null ? void 0 : w.call(n, t) : void 0, d = c && !u, p = `device device-${t.props.kind}${l ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (d ? " no-data" : ""), h = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, m = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Ci(t, r));
  return A`
    <g class=${p} data-id=${t.id} opacity=${h} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${l ? A`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${R}></circle>` : v}
      ${t.props.kind === "equipment" ? mp(t, n, o, a) : A`<g transform=${`rotate(${a})`}>${fp(
    t,
    r,
    o,
    s.deviceFill,
    d ? ip : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? gp(n.bindingStatus(t), n.scale, Ci(t, r)) : v}
      ${u ? yp(u, ((g = n.containerFlash) == null ? void 0 : g.call(n, t)) ?? null, r, n) : v}
    </g>`;
}
function vp(t, e, n, i) {
  const s = hp(t, e);
  if (s.length === 0) return v;
  const o = n.palette, r = e.invalid ? o.invalid : Nn(e.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, l = s.map(ae).join("");
  return e.props.kind === "ceiling_light" ? A`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${R}></path>` : A`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${R}></path>`;
}
function $p(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return v;
  const n = e.selection.id, i = t.devices.find((a) => a.id === n), s = i ? Si(t, i, e.scale) : null;
  if (!s) return v;
  const o = e.palette.selection;
  return A`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${R}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${R} style="cursor:grab"></circle>
  </g>`;
}
function xp(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = Y(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: lp, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = Y(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return A`
    <g class="cones">${e.showCones ? n.map((i) => vp(t, i.d, e, i.preview)) : v}</g>
    <g class="devices">${n.map((i) => bp(i.d, i.pose, e, i.preview))}</g>
    ${$p(t, e)}`;
}
const Po = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], gs = (t) => Po[t % Po.length], je = "non-scaling-stroke", kp = "0.55", Mp = /* @__PURE__ */ new WeakMap();
function _p(t, e, n, i) {
  const s = i.palette, o = gs(n), r = i.selectedId === e.id, a = pe(Mp, t, ia).get(e.id), l = 12 / i.scale;
  return A`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${ae(ie(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? v : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${je}
        opacity=${i.selectedId !== null && !r ? kp : v}></path>
      ${a ? A`<text class="zone-label" x=${a.x} y=${a.y} text-anchor="middle" font-size=${l} font-family="system-ui, sans-serif">
        <tspan x=${a.x} dy=${-0.2 * l} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${a.x} dy=${1.2 * l} font-size=${l * 0.9} fill=${s.zoneLabel}>${Ha(ts(t, e))}</tspan>
      </text>` : v}
    </g>`;
}
function Ap(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return A`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => A`
      <path class="zone" data-id=${o.id} d=${ae(ie(t, o))} fill="none" stroke=${gs(r)} stroke-width="1"
        vector-effect=${je}></path>`)}</g>`;
  const s = 8 / e.scale;
  return A`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => _p(t, o, r, e))}</g>`;
}
function Sp(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return A`<g class="zone-members">${na(t, e).map(({ device: o, participates: r }) => {
    const a = Y(t, o);
    return a ? r ? A`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${je}></circle>` : A`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${je}></circle>` : v;
  })}</g>`;
}
function Ep(t, e, n) {
  if (e.shape.kind !== "polygon") return v;
  const i = n.palette, s = e.shape.vertices;
  return A`${ie(t, e).map((o, r) => {
    const a = s[r], l = a.kind === "free" && a.lost === !0, c = n.vertex === r;
    return A`<circle class=${`zone-vertex${l ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${l ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${je}></circle>`;
  })}`;
}
function Ip(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return A`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${je}></polyline>`;
}
function Pp(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return A`<g class="zone-overlay">
    ${n ? A`<path class="zone-outline" data-id=${n.id} d=${ae(ie(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${je}></path>` : v}
    ${n ? Sp(t, n.id, e) : v}
    ${n ? Ep(t, n, e) : v}
    ${e.draft ? Ip(e.draft, e) : v}</g>`;
}
function Fe(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Cp = /* @__PURE__ */ new WeakMap(), Lp = /* @__PURE__ */ new WeakMap(), Ta = /* @__PURE__ */ new WeakMap();
function Wn(t, e, n) {
  const i = Q(t.dir), s = O(t.a, E(t.dir, e)), o = O(t.a, E(t.dir, n));
  return [O(s, E(i, t.leftOff)), O(o, E(i, t.leftOff)), I(o, E(i, t.rightOff)), I(s, E(i, t.rightOff))];
}
function Tt(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ee(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const j = "non-scaling-stroke";
function Op(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const a of t.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const a of t.walls) {
    const l = Tt(t, a.id);
    if (!l) continue;
    const c = Q(l.dir);
    for (const [u, d, p] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const h = t.nodes.find((M) => M.id === u);
      if (!h || h.host || n.get(u) !== 1) continue;
      const m = O(d, E(c, l.leftOff + i)), b = I(d, E(c, l.rightOff + i)), w = E(c, 1), g = E(O(m, b), 0.5), $ = O(I(g, E(w, -o)), E(p, s / 2)), x = I(I(g, E(w, o)), E(p, s / 2)), k = [m, $, x, b];
      r.push(A`<path class="wall-break" d=${`M${k.map((M) => `${M.x} ${M.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${j}></path>`);
    }
  }
  return r.length ? A`${r}` : v;
}
function zp(t, e, n) {
  const i = Q(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? t.leftOff : t.rightOff, [a, l] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = O(O(t.a, E(t.dir, a)), E(o, r)), u = O(O(t.a, E(t.dir, l)), E(o, r)), d = O(c, E(o, e.width)), p = J(I(d, c), I(u, c)) > 0 ? 1 : 0;
  return A`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${j}></line>
    <path d=${`M${d.x} ${d.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${j}></path>`;
}
function Np(t, e, n) {
  const i = Q(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const a = O(O(t.a, E(t.dir, e.offset)), E(i, r)), l = O(O(t.a, E(t.dir, e.offset + e.width)), E(i, r));
    return A`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${j}></line>`;
  });
  return A`${o}`;
}
function Hp(t, e, n) {
  const i = Tt(t, e.wallId);
  if (!i) return v;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = Wn(i, e.offset, e.offset + e.width), a = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return A`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${ae(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? zp(i, e, o) : e.kind === "window" ? Np(i, e, o) : v}
    </g>`;
}
function Co(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = O(t, E(n, i)), l = O(e, E(n, i)), c = (d, p) => {
    const h = O(p, E(n, i + r));
    return A`<line x1=${d.x} y1=${d.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${j}></line>`;
  }, u = O(E(O(a, l), 0.5), E(n, 9 / s.scale));
  return A`
    <g class="dim">
      ${c(O(t, E(n, 2 / s.scale)), t)}${c(O(e, E(n, 2 / s.scale)), e)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${j}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Fe(L(t, e))}</text>
    </g>`;
}
function Vp(t, e) {
  const n = e.selection;
  if (!n) return v;
  const i = e.palette, s = 4 / e.scale, o = (r) => A`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((a) => a.id === n.id);
    return r ? o(r) : v;
  }
  if (n.kind === "wall") {
    const r = pe(Ta, t, Cn).get(n.id), a = Tt(t, n.id);
    if (!r || !a) return v;
    const l = Q(a.dir);
    return A`
      <path d=${ae(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${j}></path>
      ${o(a.a)}${o(a.b)}
      ${Co(a.a, a.b, l, a.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), a = r ? Tt(t, r.wallId) : null;
    if (!r || !a) return v;
    const l = E(Q(a.dir), -1), c = a.rightOff + 18 / e.scale, u = (p) => O(a.a, E(a.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return A`
      <path d=${ae(Wn(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${j}></path>
      ${d.filter(([p, h]) => h - p >= 1).map(([p, h]) => Co(u(p), u(h), l, c, e))}`;
  }
  return v;
}
function Tp(t, e, n) {
  return L(t, e) < 1e-6 ? null : Wn(kr(t, e, n.thickness, n.baseline), 0, L(t, e));
}
function Dp(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? Tt(t, r.wallId) : null;
  return A`
    ${o ? A`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${j}></path>` : v}
    ${(n.walls ?? []).map((l) => {
    const c = Tp(l.a, l.b, l.props);
    return A`<g class="preview-wall">
        ${c ? A`<path d=${ae(c)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${j}></line></g>`;
  })}
    ${r && a ? A`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ae(Wn(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${Bp(t, e)}`;
}
function Rp(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return A`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${j}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${j}></rect></g>`;
}
function Bp(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Rp(n.anchor, e) : v, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / e.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = v;
  if (o.kind === "node") {
    const h = r(5);
    u = A`<g class="snap-node"><rect x=${a - h} y=${l - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${j}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${a} ${l - h}L${a + h * 0.866} ${l + h / 2}L${a - h * 0.866} ${l + h / 2}Z`;
    u = A`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${j}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const h = r(7), m = `M${a} ${l - h}L${a + h} ${l}L${a} ${l + h}L${a - h} ${l}Z`;
    u = A`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${j}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${j}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const h = r(5), m = `M${a - h} ${l - h}L${a + h} ${l + h}M${a - h} ${l + h}L${a + h} ${l - h}`;
    u = A`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${j}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${j}></path></g>`;
    const b = o.endpoint.kind === "wall" ? pe(Ta, t, Cn).get(o.endpoint.wallId) : void 0;
    b && (d = A`<path class="snap-wall-hl" d=${ae(b)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${j}></path>`);
  } else {
    const h = r(4), m = `M${a - h} ${l}H${a + h}M${a} ${l - h}V${l + h}`;
    u = A`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${j}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${j}></path></g>`;
  }
  const p = f(`snapmark.${o.kind}`);
  return A`
    ${d}${s}${u}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${j} font-family="system-ui, sans-serif">${p}</text>`;
}
function Fp(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = pe(Cp, n, (h) => Sr(h, !0)), o = n.walls.filter((h) => h.type === "railing" || h.type === "fence"), r = o.length ? pe(Lp, n, Xi) : null, a = e.selection, l = (e.mode ?? "plan") === "plan", c = l ? v : String(i.dimOpacity), u = (a == null ? void 0 : a.kind) === "zone" ? a.id : null, d = e.mode ?? "plan";
  return A`
    ${Ap(n, { palette: i, scale: e.scale, selectedId: u, mode: d })}
    <path class="walls" d=${s.map((h) => h.map(ae).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? A`<g class="railings" opacity=${c}>${o.flatMap((h) => (r.get(h.id) ?? []).map((m) => A`<path d=${ae(m)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${c}>${n.openings.map((h) => Hp(n, h, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Op(n, e)}</g>
    ${l ? Pp(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : v}
    <g class="devices-layer">${xp(n, {
    palette: i,
    scale: e.scale,
    selection: a,
    showCones: e.showCones ?? !0,
    dim: l,
    preview: e.preview.device,
    bindingStatus: e.mode === "binding" ? e.bindingStatus : void 0,
    containerState: e.containerState,
    containerFlash: e.containerFlash
  })}</g>
    <g class="selection">${Vp(n, e)}</g>
    <g class="preview">${Dp(n, e)}</g>`;
}
const ce = "non-scaling-stroke", Dt = "system-ui, sans-serif", Up = 13, kt = 9, jp = 11, Lo = 18, ci = 12, di = 11, Yt = 13, Wp = 3, ln = 10, Oo = 4.5, Zp = 12, qp = 11.5, ws = 10, ui = 10.5, Kp = 6, Gp = {
  IN: Bu,
  OUT: za,
  BAT: Fu,
  PV: Na
}, zo = { dead: 0, nodata: 1, idle: 2, live: 3 };
function vt(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const pi = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function Yp(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function jt(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const Xp = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Qp = A`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Da = (t, e, n, i) => A`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${ce}>${i ? v : Qp}</path>`, Ra = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, st = (t, e, n, i) => A`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function Jp(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Ut : kt, s = t.pts[0], o = t.pts[t.pts.length - 1], r = ln / 2 / e.scale, a = 3 / e.scale, l = t.pts.slice(1).map((u, d) => ({ p: t.pts[d], q: u, len: Math.abs(u.x - t.pts[d].x) + Math.abs(u.y - t.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of l) {
    if (p < 2 * r + 2 * a) continue;
    const h = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, m = (w, g) => Math.hypot(h.x - w.x, h.y - w.y) >= g + r + a;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const b = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: h, deg: ((b + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function eh(t, e, n) {
  var c;
  const i = e.palette, s = jt(t.style, i), o = Ra(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, a = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], l = Jp(t, e);
  return A`<g data-wire=${t.w.id}>
    ${r ? A`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${ce}></path>` : v}
    ${t.style === "live" ? Da("glow", o, s, n) : v}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${a}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${ce}></path>
    ${l ? A`<path class="arrow" d=${`M${ln / 2} 0L${-ln / 2} ${-Oo}L${-ln / 2} ${Oo}Z`}
      fill=${s} transform=${`translate(${l.at.x} ${l.at.y}) rotate(${l.deg}) scale(${1 / e.scale})`}></path>` : v}
  </g>`;
}
function th(t, e, n) {
  const i = Gp[t.name];
  return A`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Ut} fill=${n.portFill}
      stroke=${e ? jt(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${ce}></circle>
    ${i ? st(i, t.pt, Up, n.portIcon) : A`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Dt}>${t.name}</text>`}
  </g>`;
}
function nh(t, e) {
  const n = Math.max(4, Math.floor(e / (ws * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function ih(t, e, n, i) {
  const s = e.map((a) => {
    const l = t.blocks.find((c) => c.id === a);
    return l ? Un(l, n) || f(`power.kind.${l.kind}`) : a;
  }), o = f("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", nh(s[0], i - 12 - o.replace("{name}", "").length * ws * 0.55)) : f("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function sh(t, e, n, i, s, o) {
  var l;
  const r = () => ({ kind: "text", value: vt(i == null ? void 0 : i.power) }), a = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: pi(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: f("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = ct(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: f("power.in"), value: vt(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: f("power.out"), value: vt(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: pi(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(a(Dr(c))), d && p.push({ kind: "text", label: f("power.loss"), value: vt(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: f("power.soc"), value: pi(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: f("power.hint.disagree"), fill: s.blockInvalid }] : (l = i == null ? void 0 : i.absorbed) != null && l.length ? [r(), ih(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function oh(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : ci + 3, o = e.x - s / 2, r = `${f(`power.switch.${i}`)}${t.controllable ? "" : ` · ${f("power.readOnly")}`}`;
  return A`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${st(
    i === "on" ? Cu : Pu,
    { x: o, y: e.y },
    Lo,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? v : st(Hu, { x: o + Lo / 2 + 3 + ci / 2, y: e.y + 1 }, ci, n.blockValue)}
  </g>`;
}
function No(t, e, n) {
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
function rh(t, e, n) {
  const i = 2 * (t.w + t.h), s = No(t, e.side, e.pt), o = ((No(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, a = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < a).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [e.pt, ...c, n.pt];
}
function ah(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return v;
  const a = jn(t, e, i.geo), l = a.find((h) => h.name === r), c = a.find((h) => h.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!l || !c) return v;
  const u = s(c.name) ?? "nodata", d = jt(u, i.palette), p = Ra(rh(he(e, i.geo, t), l, c));
  return A`${u === "live" ? Da("ts-glow", p, d, o) : v}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : v}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${ce}></path>`;
}
function lh(t, e, n, i) {
  const s = i.palette;
  return Ca(e, i.geo, t).map(({ position: o, rect: r }) => {
    const a = (n == null ? void 0 : n.position) === o;
    return A`<g class=${a ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${a ? s.accent : "none"}
        stroke=${a ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${ce}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${a ? s.accentText : s.blockValue} font-family=${Dt}>${o}</text>
    </g>`;
  });
}
function ch(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? f("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? f("power.alert.missingDevice") : t === "disagree" ? f("power.alert.disagree") : t;
}
function dh(t, e, n, i) {
  const s = Wp + Yt / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (l) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - l.x) - Yt / 2, 0), d = Math.max(Math.abs(c.y - l.y) - Yt / 2, 0);
    return Math.hypot(u, d) > Ut;
  }), a = o.find(r) ?? o[0];
  return A`<g class="alert"><title>${t.map(ch).join(`
`)}</title>
    ${st(Oa, a, Yt, i.blockInvalid)}</g>`;
}
function uh(t, e, n, i, s) {
  var b, w;
  const o = n.palette, r = he(e, n.geo, t), a = (b = n.frame) == null ? void 0 : b.blocks[e.id], l = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !l, u = r.x + r.w / 2, d = Un(e, n.geo) || f(`power.kind.${e.kind}`), p = sh(t, e, n.geo, a, o, r.w), h = e.kind === "remainder", m = jn(t, e, n.geo);
  return A`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${h ? o.powerRemainder : o.blockStroke} stroke-width=${h ? 1.5 : 1.25}
      stroke-dasharray=${h ? "6 4" : v} vector-effect=${ce}></rect>
    ${e.kind === "transfer" ? ah(t, e, a, n, (g) => i(e.id, g), s) : v}
    ${l && l.placement.mode !== "none" ? A`<g class="pin"><title>${f("power.planDevice")}</title>
      ${st(Vu, { x: r.x + 4 + di / 2, y: r.y + 4 + di / 2 }, di, o.blockValue)}</g>` : v}
    <text class="name" x=${u} y=${r.y + vn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${Zp} font-weight="600" fill=${o.blockName} font-family=${Dt}>${d}</text>
    ${p.map((g, $) => {
    const x = r.y + vn + $ * bn + bn / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? lh(t, e, a, n) : v;
    if (g.kind === "switch") return oh(g, { x: u, y: x }, o);
    const k = g.fill ?? o.blockValue, M = g.label ? A`<tspan>${g.label} </tspan>` : v, S = g.note ? A`<tspan> ${g.note}</tspan>` : v;
    return A`<text x=${u} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? ws : qp}
        fill=${k} font-family=${Dt}>${g.title ? A`<title>${g.title}</title>` : v}${M}<tspan
        font-weight=${g.small ? v : "600"}>${g.value}</tspan>${S}</text>`;
  })}
    ${(w = a == null ? void 0 : a.alert) != null && w.length ? dh(a.alert, r, m, o) : v}
    ${m.map((g) => th(g, i(e.id, g.name), o))}
  </g>`;
}
function ph(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, a = r + (o ? t.w : t.h), l = o ? t.h : t.w;
  let c = v;
  const u = t.name ?? "", d = Math.min(ui, l - 4), p = d >= Kp, h = u.length * (p ? d : ui) * 0.58 + 12;
  if (u) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let b = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, a + kt]) {
      const $ = Math.min(g - kt, a);
      $ - w > b.hi - b.lo && (b = { lo: w, hi: $ }), w = Math.max(w, g + kt);
    }
    if (b.hi - b.lo >= h) {
      const g = (b.lo + b.hi) / 2, $ = o ? { x: g, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: g };
      c = A`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : ui} fill=${s.blockValue} font-family=${Dt}
        transform=${o ? v : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return A`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? jt(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${ce}></rect>
    ${c}
  </g>`;
}
function hh(t, e, n) {
  return A`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${kt} fill=${n.portFill} stroke=${jt(e, n)} stroke-width="1.5"
      vector-effect=${ce}></circle>
    ${st(Su, t, jp, n.portIcon)}
  </g>`;
}
function fh(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const s = he(i, e.geo, t), o = 4 / e.scale;
  return A`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${ce}></rect>`;
}
function mh(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const h of n.wires) {
    const m = Ia(n, h, e.geo);
    if (!m) continue;
    const b = (p = e.frame) == null ? void 0 : p.wires[h.id];
    s.push({ w: h, a: m.a, b: m.b, pts: Pa(m.a, m.b), live: b, style: Yp(b) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = [];
  for (const h of s)
    for (const [m, b] of [[h.w.from, h.a], [h.w.to, h.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, h.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || zo[h.style] > zo[w]) && r.set(m.bus, h.style), a.set(m.bus, [...a.get(m.bus) ?? [], b.pt]), l.push({ at: b.pt, style: h.style });
    }
  const c = (h, m) => o.get(`${h}:${m}`), u = Xp(), d = e.preview.wireDraft;
  return A`<g class="power">
    <g class="buses">${n.blocks.map((h) => h.kind === "bus" ? ph(h, a.get(h.id) ?? [], r.get(h.id), e) : v)}</g>
    <g class="wires">${s.map((h) => eh(h, e, u))}</g>
    ${fh(n, e)}
    <g class="blocks">${n.blocks.map((h) => h.kind === "bus" ? v : uh(n, h, e, c, u))}</g>
    <g class="terminals">${l.map((h) => hh(h.at, h.style, i))}</g>
    ${d ? A`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${ce}></line>` : v}
  </g>`;
}
const gh = {
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
}, wh = {
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
function yh(t) {
  return t ? gh : wh;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _e = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ys = (t) => (...e) => ({ _$litDirective$: t, values: e });
class bs {
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
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ba = (t) => t.strings === void 0, bh = {}, Fa = (t, e = bh) => t._$AH = e;
class vh extends bs {
  constructor(e) {
    if (super(e), e.type !== _e.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? re : (Fa(e), n);
  }
}
const Z = ys(vh), Li = 1, Ho = 1e-6;
function $h(t, e, n, i, s) {
  const o = (l) => l > Ho && l < s - Ho, r = new Set(t.nodes.filter((l) => {
    var c;
    return ((c = l.host) == null ? void 0 : c.wallId) === e.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const c = Pn(t, l).host.offset;
    o(c) && a.push({ t: c, nodeId: l });
  }
  for (const l of t.walls) {
    if (l.id === e.id || [l.a, l.b].some((b) => b === e.a || b === e.b || r.has(b))) continue;
    const c = W(t, l.a), u = W(t, l.b), d = L(c, u), p = d === 0 ? null : ue(n, i, c, I(u, c));
    if (!p) continue;
    const h = In(p, c, u) * d;
    if (h < -Li || h > d + Li) continue;
    const m = B(I(p, n), i);
    o(m) && a.push({ t: m, wall: l, pt: p });
  }
  return a;
}
function Vo(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function To(t, e) {
  if ("nodeId" in e)
    return delete Pn(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (L(W(t, o), e.pt) <= Li) return o;
  const { pt: n, offset: i } = Tn(t, e.wall, e.pt), s = { id: q(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function xh(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = W(t, i.a), o = W(t, i.b), r = L(s, o), a = En(I(o, s)), l = B(I(n, s), a), c = $h(t, i, s, a, r), u = Vo(c.filter((g) => g.t < l), l), d = Vo(c.filter((g) => g.t > l), l);
  if (!u && !d) return ds(t, e);
  const p = fe(t), h = p.walls.find((g) => g.id === e);
  let m = e, b = 0;
  if (d) {
    const g = To(p, d);
    if (b = B(I(W(p, g), s), a), u) {
      const $ = { ...h, id: q(), a: g };
      p.walls.push($), m = $.id;
    } else
      h.a = g;
  }
  u && (h.b = To(p, u));
  const w = (g, $) => g.wallId !== e || u && $ <= u.t ? !0 : !d || $ < d.t ? !1 : (g.wallId = m, g.offset -= b, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : is(x)));
  }
  return Dn(p), Me(p, t);
}
function vs(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function kh(t, e, n) {
  return O(t, E(En(I(e, t)), n));
}
function Xt(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function We(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? vs(r, e) : e, c = r !== void 0 && l.y === r.y, u = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let d = null;
  for (const k of t.nodes) {
    if (a.has(k.id)) continue;
    const M = { x: k.x, y: k.y }, S = L(M, l);
    S <= i && u(M) && (!d || S < d.d) && (d = { id: k.id, pt: M, d: S });
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const p = t.walls.filter((k) => !a.has(k.a) && !a.has(k.b)).map((k) => ({ w: k, f: ee(t, k) })).filter((k) => k.f.len > 1e-9);
  let h = null;
  for (const { w: k, f: M } of p) {
    const S = { x: (M.a.x + M.b.x) / 2, y: (M.a.y + M.b.y) / 2 }, P = L(S, l);
    P <= i && u(S) && (!h || P < h.d) && (h = { wallId: k.id, pt: S, offset: M.len / 2, d: P });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const m = (k) => {
    let M = null;
    for (const { w: S, f: P } of p) {
      const z = Q(P.dir), T = k ? [P.leftOff, -P.rightOff].filter((D) => D !== 0) : [0];
      for (const D of T) {
        const U = O(P.a, E(z, D)), F = r ? ue(r, I(l, r), U, P.dir) : O(U, E(P.dir, B(I(l, U), P.dir)));
        if (!F) continue;
        const te = B(I(F, U), P.dir);
        if (te < 0 || te > P.len) continue;
        const me = L(F, l);
        me <= i && (!M || me < M.d) && (M = { d: me, res: { pt: F, kind: "wall", endpoint: { kind: "wall", wallId: S.id, offset: te } } });
      }
    }
    return M ? M.res : null;
  }, b = m(!1);
  if (b) return b;
  const w = m(!0);
  if (w) return w;
  const g = n.zones ?? [];
  let $ = null;
  for (const k of g)
    for (const M of k) {
      const S = L(M, l);
      S <= i && u(M) && (!$ || S < $.d) && ($ = { pt: M, d: S });
    }
  if ($) return Xt($.pt, "zoneVertex");
  let x = null;
  for (const k of g)
    for (let M = 0; M < k.length; M++) {
      const S = k[M], P = k[(M + 1) % k.length], z = L(S, P);
      if (z < 1e-9) continue;
      const T = E(I(P, S), 1 / z), D = r ? ue(r, I(l, r), S, T) : O(S, E(T, B(I(l, S), T)));
      if (!D) continue;
      const U = B(I(D, S), T);
      if (U < 0 || U > z) continue;
      const F = L(D, l);
      F <= i && (!x || F < x.d) && (x = { pt: D, d: F });
    }
  if (x) return Xt(x.pt, "zoneEdge");
  if (s && s > 0) {
    const k = (S) => Math.round(S / s) * s, M = r ? c ? { x: k(l.x), y: r.y } : { x: r.x, y: k(l.y) } : { x: k(l.x), y: k(l.y) };
    return Xt(M, "grid");
  }
  return Xt(l, "none");
}
function Mh(t, e, n) {
  return e.some((i, s) => ve(t, i, e[(s + 1) % e.length]) <= n);
}
function $s(t, e, n) {
  const i = Cn(t);
  for (const [s, o] of i) if (tt(e, o)) return s;
  for (const [s, o] of i) if (Mh(e, o, n)) return s;
  return null;
}
function _h(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = ee(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Ne(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Ah(t, e, n, i) {
  const s = _h(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = t.nodes.find((c) => c.id === a);
        if (l && L(e, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = $s(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const Zn = 3, Sh = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => ie(t, n)).filter((n) => n.length >= 3);
function Ua(t, e, n, i, s) {
  if (n.alt) {
    const a = n.shift && i ? vs(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: a.x, y: a.y }, snap: null };
  }
  const o = We(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Sh(e, s) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const a = e.walls.find((l) => l.id === r.wallId);
    if (a) {
      const l = Ne(ee(e, a), n.pt).side >= 0 ? "left" : "right", c = zn(e, a.id, l, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: a.id, offset: r.offset, side: l, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Eh(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = ie(t, s);
    if (o.length < 3) continue;
    (o.some((a, l) => ve(e, a, o[(l + 1) % o.length]) <= n) || Hn(o, e)) && i.push({ id: s.id, area: Math.abs($e(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function ja(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: ie(t, n), v: n.shape.vertices } : null;
}
function Ih(t, e, n, i) {
  var r;
  const s = (r = ja(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((a, l) => {
    L(n, a) <= i && (o < 0 || L(n, a) < L(n, s[o])) && (o = l);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Ph(t, e, n, i) {
  const s = ja(t, e);
  if (!s || s.o.some((w) => L(n, w) <= i)) return null;
  const { o, v: r } = s;
  let a = -1, l = 1 / 0;
  if (o.forEach((w, g) => {
    const $ = ve(n, w, o[(g + 1) % o.length]);
    $ <= i && $ < l && (a = g, l = $);
  }), a < 0) return null;
  const c = o[a], u = o[(a + 1) % o.length], d = Math.max(0, Math.min(1, In(n, c, u))), p = br(c, u, d), h = r[a], m = r[(a + 1) % r.length], b = h.kind === "wall" && m.kind === "wall" && h.wallId === m.wallId && h.side === m.side ? { kind: "wall", wallId: h.wallId, side: h.side, offset: h.offset + d * (m.offset - h.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: a + 1, vertex: b };
}
function Ch(t, e) {
  let n = null, i = null, s = null, o = null, r = null, a = !1, l = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, h = () => {
    i = null, s = null, o = null, r = null, a = !1, l = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function b(w) {
    if (!i || !s || !l && L(w.pt, c) <= Zn / t.scale()) return;
    l = !0;
    const g = Ua(t, s, w, i.from, i.zoneId);
    r = g.snap, a = w.shift, o = xd(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, t.selection()];
    },
    press(w) {
      h(), u = null, c = w.pt;
      const g = p(), $ = t.level(), x = g === null ? null : Ih($, g, w.pt, t.tolMm());
      return g === null || !x ? !1 : (i = { zoneId: g, ...x }, s = o = $, !0);
    },
    pick(w) {
      const g = Eh(t.level(), w, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const $ = p(), x = $ !== null && n !== null && L(w, n) <= t.tolMm() ? g.indexOf($) : -1;
      n = w, e({ kind: "zone", id: g[(x + 1) % g.length] });
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
      const g = o, $ = s, x = l, k = i;
      h(), x ? g && $ && g !== $ && t.commit(g) : u = { zoneId: k.zoneId, index: k.index };
    },
    dblclick(w) {
      const g = d[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const $ = t.level(), x = Ph($, g.id, w.pt, t.tolMm());
      if (!x) return;
      const k = kd($, g.id, x.index, x.vertex);
      k !== $ && (t.commit(k), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return h(), !0;
      const g = m();
      if (w === "Escape" && g)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const $ = t.level(), x = Md($, g.zoneId, g.index);
        return x === $ ? (t.notify(f("zones.minVertices")), !0) : (u = null, t.commit(x), !0);
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
      h(), u = null, n = null;
    }
  };
}
function Lh(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const a = (h) => {
    t.select(h);
  }, l = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, c = Ch(t, a), u = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, d = (h, m, b) => Ne(ee(h, h.walls.find((w) => w.id === m)), b).t;
  function p(h) {
    const m = e;
    if (!(!m || !n) && !(h.pt.x === o.x && h.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const b = We(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), w = b.endpoint, g = (b.kind === "wall" || b.kind === "mid") && w.kind === "wall", $ = b.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = n.nodes.find((P) => P.id === m.nodeId), k = !!x.host && g && w.kind === "wall" && w.wallId === x.host.wallId;
        let M = n;
        if (x.host && !k) {
          const P = structuredClone(n);
          delete P.nodes.find((z) => z.id === m.nodeId).host, M = P;
        }
        let S = Pd(M, m.nodeId, u(b));
        if ($ && w.kind === "node")
          S = zd(S, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !k) {
          const P = n.walls.find((z) => z.id === w.wallId);
          if (P && P.a !== m.nodeId && P.b !== m.nodeId) {
            const z = structuredClone(S);
            z.nodes.find((T) => T.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, S = Me(z, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const b = n.walls.find(($) => $.id === m.wallId), w = We(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [b.a, b.b]
        }), g = I(w.pt, m.origin);
        i = Ld(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const b = n.openings.find((w) => w.id === m.openingId);
        i = zr(n, b.id, d(n, b.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      l(), o = h.pt, c.note();
      const m = t.level(), b = h.ctrl ? $s(m, h.pt, t.tolMm()) : null;
      if (b) {
        a(null), t.commit(xh(m, b, h.pt));
        return;
      }
      if (c.press(h)) return;
      const w = t.selection(), g = Ah(m, h.pt, t.tolMm(), w);
      if (!g) {
        c.pick(h.pt);
        return;
      }
      if (c.forget(), a(g), r = n = i = m, g.kind === "node") {
        let $ = g.id;
        const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((k) => k.id === w.id) : void 0;
        if (h.alt && x) {
          const k = Od(m, x.id, x.a === g.id ? "a" : "b");
          n = i = k.level, $ = k.nodeId, a({ kind: "node", id: $ });
        }
        e = { kind: "node", nodeId: $, origin: W(n, $) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: h.pt };
      else if (g.kind === "opening") {
        const $ = m.openings.find((x) => x.id === g.id);
        e = { kind: "opening", openingId: $.id, grab: d(m, $.wallId, h.pt) - $.offset };
      }
    },
    move(h) {
      c.active() ? c.move(h) : p(h);
    },
    up(h) {
      if (c.active()) {
        c.up(h);
        return;
      }
      e && p(h);
      const m = s, b = i, w = r;
      l(), m && b && w && b !== w && t.commit(b);
    },
    dblclick(h) {
      c.dblclick(h);
    },
    key(h) {
      return h === "Escape" && e ? (l(), !0) : c.key(h);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      l(), c.cancel();
    }
  };
}
function Rt(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function Wa() {
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
    key(o, r, a) {
      return /^[0-9]$/.test(o) || o === " " ? (n === "first" ? t += o : e += o, !0) : o === "Backspace" ? (n === "first" ? t = t.slice(0, -1) : e = e.slice(0, -1), !0) : o === "Tab" ? (n = n === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : a(), !0) : !1;
    },
    tracker: (o) => ({ first: t, second: e, field: n, at: o })
  };
}
function Oh(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = Wa(), s = () => {
    e = null, i.clear();
  }, o = (c) => We(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = Rt(i.first, { min: 1 }), u = Rt(i.second, { min: 1 });
      return c === null || u === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const a = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function l(c) {
    if (!e || a(e, c)) return;
    const u = Id(t.level(), e, c, t.wallProps(), t.boxMeasure());
    u !== t.level() && (t.commit(u), s());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !e) {
        e = o(c.pt).pt;
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
      return e ? i.key(c, () => {
        const u = r();
        u && l(u);
      }, s) : !1;
    },
    preview() {
      if (!e) return { snap: o(n) };
      const c = r(), u = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!c || a(e, c)) return u;
      const d = t.wallProps(), p = ha(e, c, d.thickness, t.boxMeasure());
      return p && (u.walls = p.map((h, m) => ({ a: h, b: p[(m + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Do = (t) => Math.round(t * 1e3) / 1e3 + 0;
function zh(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = Wa(), l = () => {
    e = null, n = null, i = null, r = null, a.clear();
  }, c = (p, h) => We(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: h && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), h = Rt(a.first, { min: 1 }), m = Rt(a.second);
    if (h === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const b = h ?? L(n, p.pt);
    let w = p.pt;
    if (m === null && L(n, p.pt) < 1) {
      const k = r ?? { x: 1, y: 0 };
      w = { x: n.x + k.x, y: n.y + k.y };
    }
    if (m !== null) {
      const k = m * Math.PI / 180;
      w = { x: n.x + Math.cos(k), y: n.y - Math.sin(k) };
    }
    const g = kh(n, w, b), $ = { x: Do(g.x), y: Do(g.y) }, x = t.level().nodes.find((k) => Math.hypot(k.x - $.x, k.y - $.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function d() {
    const p = u();
    if (!e || !p) return;
    const h = Ed(t.level(), e, p.endpoint, t.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    t.commit(h.level);
    const m = h.level.walls.find((x) => x.id === h.wallId);
    i === null && (i = m.a);
    const b = h.endNodeId === i, w = n, g = W(h.level, h.endNodeId), $ = L(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), a.clear(), b) {
      l();
      return;
    }
    e = { kind: "node", nodeId: h.endNodeId }, n = W(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !e) {
        const h = c(p.pt, !1);
        e = h.endpoint, n = h.pt;
        return;
      }
      d();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, h) {
      return o = h.shift, e ? a.key(p, d, l) : !1;
    },
    preview() {
      if (!n) return { snap: We(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: n, b: p.pt, props: t.wallProps() }],
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
function Nh(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = $s(o, n, t.tolMm());
    if (!r) return null;
    const a = ee(o, o.walls.find((c) => c.id === r)), l = Ne(a, n).t;
    return { wallId: r, center: l, pt: O(a.a, E(a.dir, l)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = Nc(t.level(), r.wallId, e, r.center, a.width, a);
      l.openingId !== null && t.commit(l.level);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: e, invalid: !Ln(t.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Ro = 3, Hh = 1, de = (t) => ({ x: t.x, y: t.y });
function Vh(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? de(e[e.length - 1]) : void 0;
  function a(d) {
    const p = e.length;
    if (p === 0) return !1;
    const h = e.map(de);
    if (L(h[p - 1], d) <= Hh) return !0;
    if (p >= 2) {
      const m = I(h[p - 1], h[p - 2]), b = I(d, h[p - 1]);
      if (Math.abs(J(m, b)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(b.x, b.y) && B(m, b) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (Jr(h[p - 1], d, h[m], h[m + 1])) return !0;
    return !1;
  }
  function l(d) {
    if (e.length < Ro) return null;
    const p = t.tolMm(), h = de(e[0]), m = de(e[e.length - 1]);
    return L(d, h) <= p ? h : L(d, m) <= p ? m : null;
  }
  function c() {
    var h;
    if (e.length < Ro || yn(e.map(de))) return !1;
    const d = t.level(), p = vd(d, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : rs(p.level, p.zoneId, !1)), (h = t.zonePlaced) == null || h.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => Ua(t, t.level(), d, r());
  return {
    id: "zone",
    down(d) {
      if (l(d.pt)) {
        c();
        return;
      }
      const p = u(d).vertex;
      a(de(p)) || (e = [...e, p], n = de(p), i = !1);
    },
    move(d) {
      o = d.shift;
      const p = l(d.pt);
      if (p) {
        n = p, s = null, i = yn(e.map(de));
        return;
      }
      const h = u(d);
      s = h.snap, n = de(h.vertex), i = a(n);
    },
    up() {
    },
    key(d) {
      return d === "Enter" ? c() : d === "Backspace" || d === "Delete" || d === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : d === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const d = {};
      e.length > 0 && (d.zoneDraft = { points: e.map(de), cursor: n, invalid: i }), s && (d.snap = s);
      const p = r();
      return o && p && (d.orthoFrom = p), d;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Th(t) {
  return t.zoneMethod() === "polygon" ? Vh(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = bd(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(f("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : rs(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Bo = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Za(t) {
  let e = null;
  const n = (s, o, r) => {
    const a = s.devices.find((u) => u.id === o), l = a ? Y(s, a) : null, c = a ? Si(s, a, t.scale()) : null;
    return !l || !c ? 0 : Kr(be(I(r, l.pt)) - be(I(c.to, l.pt)));
  };
  function i(s) {
    if (!e || !e.moved && L(s.pt, e.downPt) <= Zn / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((d) => d.id === e.id), r = o ? Y(e.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = (be(I(s.pt, r.pt)) - e.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, u = od(e.original, o, c, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : gn(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), a = r.devices.find((c) => c.id === s), l = a ? Si(r, a, t.scale()) : null;
      return !a || !l || L(o.pt, l.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Bo(o.work, o.id) !== Bo(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function Fo(t, e, n) {
  const i = ee(t, t.walls.find((s) => s.id === e));
  return Ne(i, n).side > 0 ? "left" : "right";
}
function qa(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function xs(t, e = "free") {
  return t === "equipment" ? [e] : Gi[t];
}
function Ka(t, e, n, i, s = 0, o = xs(n)) {
  if (o.includes("wall")) {
    const r = We(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: Fo(e, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of e.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const u = ee(e, c), d = Math.max(0, Math.min(u.len, Ne(u, i).t)), p = Math.hypot(i.x - (u.a.x + u.dir.x * d), i.y - (u.a.y + u.dir.y * d));
        (!l || p < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : u.len, d: p });
      }
      if (l) return { mode: "wall", wallId: l.id, side: Fo(e, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...qa(t, i), rotation: s } : null;
}
function Dh(t, e, n) {
  const i = Y(t, e);
  if (!i) return null;
  if (!n) {
    const o = Ji(Math.round(be(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of t.walls) {
    let r;
    try {
      r = ee(t, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const a = Ne(r, i.pt), l = a.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(a.t))), u = zn(t, o.id, l, c), d = u ? L(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: l, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? s.placement : null;
}
function Rh(t, e, n) {
  return Fr(t.deviceDefaults(e), "free", n.mode);
}
function Bh(t, e) {
  let n = null, i;
  const s = Za(t);
  function o() {
    if (!n) return null;
    const r = t.level(), a = xs(e, t.wallMount() ? "wall" : "free"), l = Ka(t, r, e, n, 0, a);
    if (!l)
      return { placement: { mode: "free", ...qa(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = Rh(t, e, l), u = ro(r, c, l, "").deviceId !== null;
    return { placement: l, props: c, invalid: !u };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = t.level(), c = Wi(f(`device.${e}`), l.devices.filter((d) => d.props.kind === e).map((d) => d.name)), u = ro(l, a.props, a.placement, c);
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
      const a = o();
      return a ? { device: a } : {};
    },
    cancel() {
      s.cancel(), n = null, i = void 0;
    }
  };
}
const Uo = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Fh = (t, e, n) => n === void 0 || Uo(t, n) !== Uo(e, n);
function Uh(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return I(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = zn(t, s.wallId, s.side, s.offset);
  return o ? I(o, i) : { x: 0, y: 0 };
}
function jh(t) {
  let e = null, n = null;
  const i = Za(t);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (p) => {
    e = p, t.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && L(p.pt, a) <= Zn / t.scale()) return;
    if (r = !0, p.pt.x === a.x && p.pt.y === a.y) {
      o = s;
      return;
    }
    const h = s.devices.find((M) => M.id === n.id);
    if (!h || h.placement.mode === "none") return;
    const m = p.shift ? vs(a, p.pt) : p.pt, b = h.placement, w = b.mode === "free" ? null : Y(s, h), g = b.mode === "free" ? b.rotation : w ? Ji(Math.round(be(w.dir))) : 0, $ = O(m, n.grab), x = Ka(t, s, h.props.kind, $, g, xs(h.props.kind, b.mode)), k = x && x.mode === "wall" && b.mode === "wall" && b.aim !== void 0 ? { ...x, aim: b.aim } : x;
    o = k ? gn(s, h.id, d(s, h.placement, k, m, $)) : s;
  }
  function d(p, h, m, b, w) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const g = p.walls.find((P) => P.id === h.wallId);
    if (!g) return m;
    const $ = ee(p, g), x = Math.max(0, Math.min($.len, h.offset + B(I(b, a), $.dir))), k = Ne($, w).side, M = t.tolMm(), S = h.side === "left" ? k < -($.rightOff + M) ? "right" : "left" : k > $.leftOff + M ? "left" : "right";
    return { ...m, offset: x, side: S };
  }
  return {
    id: "device-select",
    down(p) {
      c(), a = p.pt;
      const h = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const b = Xr(h, p.pt, m);
      if (!b) {
        l(null);
        return;
      }
      l({ kind: "device", id: b });
      const w = h.devices.find(($) => $.id === b), g = Y(h, w);
      s = o = h, n = { id: b, grab: Uh(h, w, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const h = o, m = s, b = r, w = n == null ? void 0 : n.id;
      c(), b && h && m && h !== m && Fh(m, h, w) && t.commit(h);
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
function Wh(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = Xr(t.level(), e.pt, t.tolMm());
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
const Oi = 40, Zh = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function qh(t, e, n, i) {
  const s = t.blocks.find((h) => h.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, a = o ? s.w : s.h, l = Ht(o ? i.x : i.y), c = n === "start" ? Math.min(l, r + a - Oi) : r, u = n === "end" ? Math.max(l, r + Oi) : r + a;
  if (c === r && u === r + a) return t;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (h) => "bus" in h && h.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + h.at * a - c) / (u - c))) } : h;
  return {
    ...t,
    blocks: t.blocks.map((h) => h.id === e ? { ...h, ...d } : h),
    wires: t.wires.map((h) => {
      const m = p(h.from), b = p(h.to);
      return m === h.from && b === h.to ? h : { ...h, from: m, to: b };
    })
  };
}
function Kh(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function a(u, d) {
    const p = So(u, d, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function l(u) {
    const d = e, p = n;
    if (!d || !p || !s && L(u.pt, o) <= Zn / t.scale()) return;
    if (s = !0, d.kind === "wire") {
      const w = a(p, u.pt);
      e = { ...d, to: u.pt, ok: !!w && !("error" in ko(p, d.from, w, t.geo())) };
      return;
    }
    if (d.kind === "bus-end") {
      i = qh(p, d.id, d.end, u.pt);
      return;
    }
    const h = p.blocks.find((w) => w.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!h) return;
    if (d.kind === "pin") {
      i = Kd(p, h.id, d.from.port, cu(he(h, t.geo(), p), u.pt));
      return;
    }
    const m = Ht(h.x + u.pt.x - o.x), b = Ht(h.y + u.pt.y - o.y);
    i = m === h.x && b === h.y ? p : Wd(p, h.id, m, b);
  }
  function c(u, d, p) {
    const h = a(u, p);
    if (!h) return;
    const m = ko(u, d, h, t.geo());
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
      const d = t.power(), p = So(d, u.pt, t.tolMm(), t.geo());
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
      if (n = i = d, p.kind === "port") {
        const h = { block: p.block, port: p.port };
        if (Zh(d, h)) {
          e = { kind: "pin", from: h };
          return;
        }
        const m = d.blocks.find((w) => w.id === p.block), b = jn(d, m, t.geo()).find((w) => w.name === p.port).pt;
        e = { kind: "wire", from: h, at: b, to: b, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: p.id }), e = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      l(u);
    },
    up(u) {
      l(u);
      const d = e, p = n, h = i, m = s;
      if (r(), !(!d || !p)) {
        if (!m) {
          (d.kind === "wire" || d.kind === "pin") && t.select({ kind: "powerBlock", id: d.from.block });
          return;
        }
        d.kind === "wire" ? c(p, d.from, u.pt) : h && h !== p && t.commitPower(h);
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
function Gh(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let s;
      if (n === "device") {
        const u = t.placeDeviceId();
        if (!u) {
          t.notify(f("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = t.power(), r = jd(n, { x: 0, y: 0 }, o, s), a = he(r, t.geo(), $o(o, r)), l = { ...r, x: Ht(i.pt.x - a.w / 2), y: Ht(i.pt.y - a.h / 2) };
      t.commitPower($o(o, l)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: l.id });
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
const Yh = ["select", "box", "wall", "door", "window", "opening", "zone"], Xh = [
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
], Qh = ["binding-select"], Jh = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Ga = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, ef = {
  plan: Yh,
  equipment: Xh,
  binding: Qh,
  power: Jh
};
function ks(t) {
  return ef[t];
}
function zi(t, e) {
  switch (t) {
    case "select":
      return Lh(e);
    case "box":
      return Oh(e);
    case "wall":
      return zh(e);
    case "door":
    case "window":
    case "opening":
      return Nh(e, t);
    case "zone":
      return Th(e);
    case "device-select":
      return jh(e);
    case "binding-select":
      return Wh(e);
    case "power-select":
      return Kh(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Gh(e, t);
    default:
      return Bh(e, t);
  }
}
function hi(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const tf = {
  select: Kt,
  box: Yu,
  wall: Xu,
  door: Eu,
  window: Ju,
  opening: Iu,
  zone: Zu,
  "device-select": Kt,
  ceiling_light: _u,
  wall_light: Qu,
  motion_sensor: Tu,
  illuminance_sensor: Mu,
  climate_sensor: qu,
  wall_switch: Nu,
  smart_button: zu,
  socket: za,
  exhaust_fan: Lu,
  equipment: Eo,
  "binding-select": Kt,
  "power-select": Kt,
  "power-device": Eo,
  "power-bus": Uu,
  "power-battery": ku,
  "power-pv": Na,
  "power-transfer": Wu,
  "power-remainder": Au
}, Ya = (t) => y`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${tf[t]}></path>`}</svg>`;
function nf(t) {
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
function sf(t) {
  return y`
    <div class="top"><div class="bar">
      ${t.lead ?? v}
      ${t.plans.length > 1 ? y`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${Z(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => y`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : v}
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
        ${nf(t)}${t.saveState === "error" && t.errorMessage ? y`: ${t.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${f("action.save")}</button>
    </div>${t.steps}</div>`;
}
const of = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function rf(t, e, n) {
  return ks(t).map((i) => {
    const s = t === "plan" ? Ga[i] : void 0, o = f(`tool.${i}`);
    return y`
      ${of.includes(i) ? y`<div class="tool-sep"></div>` : v}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? v}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? v}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${Ya(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function af(t, e, n) {
  return y`<div class="tools">${rf(t, e, n)}</div>`;
}
const ht = ["plan", "equipment", "binding", "power"], Qt = (t, e, n) => f(t === 1 ? e : n).replace("{n}", String(t));
function lf(t, e, n, i) {
  const { walls: s, zones: o, devices: r } = e;
  switch (t) {
    case "plan": {
      const a = o.filter((c) => c.invalid).length, l = a ? `, ${f("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Qt(s.length, "steps.wall", "steps.walls")}, ${Qt(o.length, "steps.zone", "steps.zones")}${l}`,
        done: s.length > 0 && o.length > 0
      };
    }
    case "equipment":
      return { text: Qt(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const a = r.length - qi(r.map(n));
      return {
        text: f("steps.bound").replace("{b}", String(a)).replace("{n}", String(r.length)),
        done: r.length > 0 && a === r.length
      };
    }
    case "power":
      return { text: Qt(i.blocks.length, "steps.block", "steps.blocks"), done: tu(i) };
  }
}
const jo = (t, e) => f(t).replace("{step}", f(`mode.${e}`));
function cf(t) {
  const e = ht.indexOf(t.mode), n = ht[e - 1], i = ht[e + 1];
  return y`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Z(t.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${ht.map((s, o) => {
    const r = lf(s, t.level, t.status, t.power), a = s === t.mode;
    return y`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : v} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${f(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${ht.length + 1}</span><span class="name">${f("mode.automation")}</span>
        <span class="state">${f("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? y`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${jo("steps.back", n)}</button>` : v}
        ${i ? y`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${jo("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
function df(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Xa(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return Tr(t, Wi(f("device.equipment"), e));
}
function Ms(t) {
  if (ct(t)) return f("props.inverter");
  const e = Rc(t);
  return e ? f(`deviceRole.${e}`) : "";
}
function qn(t) {
  const e = f(`device.${t.props.kind}`), n = Ms(t);
  return n ? `${e} · ${n}` : e;
}
function uf(t) {
  const e = df(t.level);
  return y`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${f("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${f("devices.new")}</button>
    </div>
    ${e.length === 0 ? v : y`<div class="pdevs">
      ${e.map((n) => y`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Ms(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const pf = ["unbound", "bound", "all"], hf = /* @__PURE__ */ new WeakMap(), Mt = (t) => t.placement.mode === "none";
function Qa(t) {
  return pe(hf, t, (e) => [...e.devices].sort((n, i) => Number(Mt(n)) - Number(Mt(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function ff(t, e, n) {
  const i = Qa(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Ja = (t) => f(`device.${t.props.kind}`), Wo = (t) => t.props.kind === "equipment" ? Ms(t) : Ja(t), mf = (t, e) => t === "all" || t === "bound" == (e === "bound");
function gf(t, e, n) {
  return e === 0 ? f("binding.noDevices") : n || t.filter === "all" ? f("binding.noMatch") : f(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Zo(t) {
  const e = f(t.collapsed ? "binding.expand" : "binding.collapse");
  return y`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function wf(t) {
  var a;
  if (t.collapsed) return y`<div class="blist collapsed">${Zo(t)}</div>`;
  const e = Qa(t.level).map((l) => ({ d: l, st: t.status(l) })), n = {
    unbound: qi(e.map((l) => l.st)),
    bound: e.filter((l) => l.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: l, st: c }) => mf(t.filter, c) && (!i || l.name.toLowerCase().includes(i) || Ja(l).toLowerCase().includes(i) || Wo(l).toLowerCase().includes(i))), o = ((a = t.selection) == null ? void 0 : a.kind) === "device" ? t.selection.id : null, r = (l, c) => {
    const u = Ul(l);
    return y`<button class="brow${l.id === o ? " sel" : ""}" data-id=${l.id} @click=${() => t.onPick(l.id)}>
      <span class="dot ${c}" role="img" aria-label=${f(`bindstatus.${c}`)} title=${f(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${l.name}</span><small class="kind">${Wo(l)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return y`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${pf.map((l) => y`<button role="radio" aria-checked=${String(l === t.filter)} data-filter=${l}
            @click=${() => t.onFilter(l)}>${f(`binding.filter.${l}`)} <span class="count">${n[l]}</span></button>`)}
        </div>
        ${Zo(t)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${Z(t.query)} @input=${(l) => t.onQuery(l.target.value)} />
      <div class="rows">
        ${s.length === 0 ? y`<p class="empty">${gf(t, e.length, i)}</p>` : y`
          ${s.filter((l) => !Mt(l.d)).map((l) => r(l.d, l.st))}
          ${s.some((l) => Mt(l.d)) ? y`<div class="bgroup" data-group="unplaced">
            <h5>${f("devices.unplaced")}</h5>
            ${s.filter((l) => Mt(l.d)).map((l) => r(l.d, l.st))}
          </div>` : v}`}
      </div>
    </div>`;
}
function C(t, e) {
  return y`<label class="row"><span>${t}</span>${e}</label>`;
}
function K(t, e, n, i) {
  return y`<select class="val" data-field=${i ?? v} .value=${Z(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => y`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function He(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return y`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? v}
    placeholder=${t.placeholder ?? v} title=${t.placeholder ?? v} .value=${Z(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = Rt(s.value, t.rule);
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
function yf() {
  return {
    door: { width: on.door, hinge: "start", swing: "left" },
    window: { width: on.window, outside: "left" },
    opening: { width: on.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function bf(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function el(t) {
  return Wi(f("zones.default"), t.zones.map((e) => e.name));
}
const vf = (t) => t === "door" || t === "window" || t === "opening";
function $f(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return v;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return y`
    <h4>${f(`props.next.${n}`)}</h4>
    ${C(`${f("props.width")}, ${f("unit.mm")}`, He({
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
    ${n === "door" ? y`
      ${C(f("props.hinge"), K(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${C(f("props.swing"), K(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? C(f("props.outside"), K(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class xf {
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
const Ni = (t) => typeof t == "object" && t !== null && !Array.isArray(t), _t = (t) => typeof t == "string" && t ? t : null, qo = (t) => typeof t == "number" && Number.isFinite(t), Hi = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function tl(t) {
  return t.switchesMigrated || !t.devices.some(Hi) ? t : { ...t, switchesMigrated: !0 };
}
function kf(t, e, n) {
  const i = Tr(t, n);
  let s = i.level;
  const o = Ni(e.switch) ? e.switch : {}, r = [["power", _t(e.power)], ["voltage", _t(e.voltage)], ["control", _t(o.entity)]];
  for (const [a, l] of r) l && (s = An(s, i.id, a, l));
  return o.controllable === !0 && (s = On(s, i.id, !0)), { level: s, id: i.id };
}
function Mf(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Ni(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((a) => {
      if (!Ni(a)) return a;
      if (a.kind === "meter" && _t(a.id) && qo(a.x) && qo(a.y)) {
        s++;
        const l = kf(e, a, _t(a.name) ?? `Meter ${s}`);
        return e = l.level, o = !0, {
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
        return l === !0 && typeof a.deviceId == "string" && (e = Br(e, a.deviceId, !0)), o = !0, c;
      }
      return a;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Hi)) {
    for (const s of t.level.devices) Hi(s) && (e = On(e, s.id, !0));
    e = tl(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class _f {
  constructor(e) {
    this.h = e;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await li(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.adopt(js(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = we(e);
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
    const n = await yu(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(f("load.oldServer"));
    this.h.drafts.cancel(), this.h.save.reset(n.revision), this.adopt(n), this.h.drafts.setLastPlanId(n.id), this.offerDraft(this.h.drafts.read(n.id));
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
        this.h.plans = await li(this.h.hass);
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
      this.h.notice = we(n);
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
    this.h.toolId = ks(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(js(f("plan.default"))), this.offerDraft(null);
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
            await vu(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = we(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await li(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = we(o);
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
    this.h.plan = { ...e, levels: e.levels.map(nc) };
    const n = Mf({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = eu(n.power, { device: (s) => n.level.devices.find((o) => o.id === s) });
    this.h.history = new xf({ level: n.level, ...i ? { power: i } : {} }), this.h.lazyPower = ba(), this.h.activeTool.cancel(), this.h.activeTool = zi(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i } = this.h.history.current, s = e.levels.map((a, l) => l === 0 ? tl(n) : a), { power: o, ...r } = e;
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
    const e = `${this.h.plan.name} ${f("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), e);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Af {
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
    !n || !Td(n.states, e) ? this.base = { states: e, meta: Vd(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Rd(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Dd(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = f("binding.registryError").replace("{error}", we(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Jt = mr("", "");
function Sf(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? Jt;
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
    openingDefaults: (e) => bf(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? el(((e = t.history) == null ? void 0 : e.current.level) ?? Jt);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? Jt).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Aa(((n = t.history) == null ? void 0 : n.current.level) ?? Jt, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const nl = Object.keys(Gi), Ef = (t) => nl.includes(t);
function If() {
  return Object.fromEntries(nl.map((t) => [t, Ce(t, "free")]));
}
const il = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -et, max: et, signed: !0 }, bad: "props.badAim" }
}, At = (t, e, n, i, s) => He({ ...il[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), Pf = ["round", "linear", "spot"], Cf = ["rect", "circle"], xn = (t, e) => t.map((n) => ({ v: n, label: f(`${e}.${n}`) }));
function sl(t, e, n, i) {
  const s = (r, a, l) => C(`${f(a)}, ${f("unit.mm")}`, At(t, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => C(`${f(a)}, ${f("unit.deg")}`, At(t, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return y`
        ${C(f("props.shape"), K(e.shape, xn([...Pf], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? y`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : v}
        ${C(`${f("props.poolRadius")}, ${f("unit.mm")}`, He({
        ...il.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: f("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return y`${o("coneAngle", "props.coneAngle", e.coneAngle)}${s("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return y`${o("zoneAngle", "props.zoneAngle", e.zoneAngle)}${s("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return C(`${f("props.diameter")}, ${f("unit.mm")}`, y`<select class="val" data-field=${`${n}diameter`}
        .value=${Z(String(e.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== e.diameter && !i({ diameter: l }) && (a.value = String(e.diameter));
      }}>
        ${ql.map((r) => y`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return y`
        ${C(f("props.shape"), K(e.shape, xn([...Cf], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? y`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${C(f("props.icon"), Of(t, e.icon, `${n}icon`, i))}
        ${C(f("props.label"), y`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Z(e.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== e.label && i({ label: a });
      }} />`)}`;
    default:
      return y`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const Lf = /^mdi:[a-z0-9-]+$/;
function Of(t, e, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!Lf.test(o)) {
      r(e), (a = t.onNotice) == null || a.call(t, f("props.badIcon"));
      return;
    }
    (l = t.onNotice) == null || l.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? y`<ha-icon-picker data-field=${n} .value=${Z(e)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : y`<input class="val wide" type="text" data-field=${n} .value=${Z(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
function Ze(t, e, n, i) {
  return C(e, y`<input type="checkbox" data-field=${t} .checked=${Z(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function zf(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? v : Ze("wallMount", f("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Nf(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? v : y`
    ${Ze("inverter", f("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? Ze("controllable", f("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : y`<p class="muted" data-note="bind-switch">${f("props.bindSwitchHint")}</p>`}`;
}
function Hf(t, e) {
  const n = e.placement;
  if (n.mode === "none") return v;
  if (n.mode === "free")
    return C(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      At(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = gr.has(e.props.kind);
  return y`
    ${C(f("props.side"), K(n.side, xn(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${C(`${f("props.offset")}, ${f("unit.mm")}`, At(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? C(
    `${f("props.aim")}, ${f("unit.deg")}`,
    At(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(Qr(n, s)))
  ) : v}`;
}
function _s(t, e) {
  return C(f("props.name"), y`<input class="val wide" type="text" data-field="name" .value=${Z(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function Vf(t, e) {
  const n = e.props.kind;
  return rt(n) ? n === "smart_button" && e.placement.mode === "free" ? y`<p class="muted" data-note="type-free">${f("props.typeFreeHint")}</p>` : C(f("props.type"), K(
    n,
    xn(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : v;
}
function Tf(t, e) {
  const n = t.level ? ud(t.level, e) : [];
  return y`<fieldset data-field="zone-membership"><legend>${f("props.zoneList")}</legend>
    ${n.length === 0 ? y`<p class="muted">${f("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => y`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = t.onZone) != null && a.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function Df(t, e) {
  const n = e.placement.mode !== "none";
  return y`
    <h4>${qn(e)}</h4>
    ${_s(e, (i) => t.onDevice({}, i))}
    ${Vf(t, e)}
    ${n ? sl(t, e.props, "", (i) => t.onDevice(i)) : v}
    ${zf(t, e)}
    ${Hf(t, e)}
    ${Nf(t, e)}
    ${n ? Tf(t, e) : v}
    ${e.invalid ? y`<p class="warn">${f("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${f("action.delete")}</button>`;
}
function Rf(t) {
  return t.device ? Df(t, t.device) : t.nextKind && t.nextProps ? y`
      <h4>${f("props.nextDevice")}: ${f(`device.${t.nextKind}`)}</h4>
      ${sl(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? Ze(
    "next-wallMount",
    f("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : v}` : y`<p class="muted">${f("props.none")}</p>`;
}
function Bf(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((l) => l.id === n.id) ?? null : null, s = Ef(t.toolId) ? t.toolId : null, o = (l) => l === e ? (t.setNotice(f("props.noFit")), !1) : (t.setNotice(null), t.commit(l), !0), r = (l) => l.level === e ? !1 : (t.setNotice(null), t.commit(l.level, l.power), !0), a = (l, c) => {
    const u = Dh(e, l, c);
    return o(u ? gn(e, l.id, u) : e);
  };
  return y`<div class="props">
    ${Rf({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (l, c) => !!i && o(Ft(e, i.id, l, c)),
    onKind: (l) => !!i && o(Bc(e, i.id, l)),
    onPlacement: (l) => !!i && o(gn(e, i.id, l)),
    onZone: (l, c) => !!i && o(da(e, i.id, l, c)),
    onWallMount: (l) => !!i && a(i, l),
    onInverter: (l) => !!i && r(Ma(e, t.power, i.id, l)),
    onControllable: (l) => !!i && o(On(e, i.id, l)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (l) => t.setNextWallMount(l),
    onNext: (l) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...l, kind: s } });
    },
    onDelete: () => {
      i && r(ka(e, t.power, i.id));
    },
    onNotice: (l) => t.setNotice(l)
  })}
    ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
    ${i ? v : uf({
    level: e,
    onPick: (l) => t.pickDevice(l),
    onNew: () => {
      const l = Xa(e);
      t.commit(l.level), t.pickDevice(l.id);
    }
  })}
  </div>`;
}
const Vi = (t) => f(`zones.kind.${t.shape.kind}`), As = (t) => y`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${A`<path d=${t === "walls" ? Ou : Gu}></path>`}</svg>`;
function ol(t, e) {
  const n = ea(t, e);
  return n ? f(`zones.invalid.${n}`) : null;
}
function Ff(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: gs(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || Vi(o).toLowerCase().includes(e));
  return y`
    <div class="zlist">
      <div class="zhead"><span>${f("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${f("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${f("zones.filter")}
        aria-label=${f("zones.filter")} .value=${Z(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var l;
    const a = o.invalid ? ol(t.level, o) ?? "" : null;
    return y`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${a === null ? y`<span class="zswatch" style=${`background:${r}`}></span>` : y`<span class="zswatch zinvalid" role="img" aria-label=${a} title=${a}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Vi(o)}>${As(o.shape.kind)}</span>
            <span class="zarea">${((l = ts(t.level, o)) == null ? void 0 : l.toFixed(1)) ?? "—"}</span>
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
const Ss = ys(class extends bs {
  constructor(t) {
    if (super(t), t.type !== _e.PROPERTY && t.type !== _e.ATTRIBUTE && t.type !== _e.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Ba(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === re || e === v) return e;
    const n = t.element, i = t.name;
    if (t.type === _e.PROPERTY) {
      if (e === n[i]) return re;
    } else if (t.type === _e.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return re;
    } else if (t.type === _e.ATTRIBUTE && n.getAttribute(i) === e + "") return re;
    return Fa(t), e;
  }
}), rl = (t, e, n) => y`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Ss(e)}
    @change=${(i) => n(i.target.checked)} />${f("zones.automation")}</label>`;
function Uf(t, e, n) {
  const i = na(t, e.id);
  return y`<div class="zmembers">
    <div class="zhead"><span>${f("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? y`<span>${f("zones.participates")}</span>` : v}</div>
    ${i.length === 0 ? y`<p class="muted">${f("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => y`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${f(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${f("zones.participates")} .checked=${Ss(o)}
          @change=${(r) => {
    const a = da(t, s.id, e.id, r.target.checked);
    a !== t && n(a);
  }} />
      </label>`)}
  </div>`;
}
function Ko(t, e, n) {
  const i = ol(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return y`<div class="zprops">
    <h4>${f("props.zone")}</h4>
    ${C(f("props.name"), y`<input class="val wide" type="text" data-field="zone-name" .value=${Z(e.name)}
      @change=${(o) => {
    const r = o.target, a = r.value.trim();
    if (!a || a === e.name) {
      r.value = e.name;
      return;
    }
    n($d(t, e.id, a));
  }} />`)}
    ${C(f("props.area"), y`<span class="val ro" data-field="zone-area">${Ha(ts(t, e))}</span>`)}
    ${C(f("zones.outline"), y`<span class="val ro zkindval" data-field="zone-kind">${As(e.shape.kind)}${Vi(e)}</span>`)}
    ${rl("zone-automation", e.automation !== !1, (o) => {
    const r = rs(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? y`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? y`<button class="btn" data-action="keep-outline" @click=${() => n(_d(t, e.id))}>
        ${f("zones.keepOutline")}</button>` : v}</div>` : v}
    ${Uf(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(ca(t, e.id))}>
      ${f("zones.delete")}</button>
  </div>`;
}
function jf(t) {
  const e = t.next.zone, n = e.name ?? el(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return y`
    <h4>${f("props.nextZone")}</h4>
    <div class="muted">${f("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${f("zones.method")}>
      ${["walls", "polygon"].map((s) => y`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${As(s)}<span>${f(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${f(`zones.hint.${e.method}`)}</p>
    ${C(f("props.name"), y`<input class="val wide" type="text" data-field="next-zone-name" .value=${Z(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${rl("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function al(t, e, n) {
  return He({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Go(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Wf(t, e) {
  const n = ee(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Nd(e.level, t.id, o));
  return y`
    <h4>${f("props.wall")}</h4>
    ${C(f("props.type"), K(
    t.type,
    i.map((o) => ({ v: o, label: f(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${C(f("props.thickness"), al(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${C(f("props.baseline"), K(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: f(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${C(f("props.length"), y`<span class="val ro">${Fe(n)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(ds(e.level, t.id))}>
      ${f("action.delete")}</button>`;
}
function Zf(t, e) {
  const n = ["door", "window", "opening", ...fn.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Tc(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = fn.includes(t.kind);
  return y`
    <h4>${f(`kind.${t.kind}`)}</h4>
    ${C(f("props.kind"), K(t.kind, n.map((r) => ({ v: r, label: f(`kind.${r}`) })), (r) => i(Vc(t, r))))}
    ${C(f("props.width"), al(e, t.width, (r) => Go(e, Hc(e.level, t.id, r))))}
    ${C(f("props.offset"), He({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Go(e, zr(e.level, t.id, r))
  }))}
    ${o ? y`
      ${C(f("props.hinge"), K(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${C(f("props.swing"), K(t.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${t.kind === "window" ? C(f("props.outside"), K(t.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${C(f("props.passesLight"), y`<input type="checkbox" data-field="passesLight" .checked=${Z(Pr(t))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Ir(t.kind) ? void 0 : a });
  }} />`)}
    ${C(f("props.passesPir"), y`<input type="checkbox" data-field="passesPir" .checked=${Z(Lr(t))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Cr(t.kind) ? void 0 : a });
  }} />`)}
    ${t.invalid ? y`<p class="warn">${f("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Nr(e.level, t.id))}>
      ${f("action.delete")}</button>`;
}
function qf(t) {
  const e = ["bearing", "partition", "railing"];
  return y`
    <h4>${f("props.newWall")}</h4>
    ${C(f("props.type"), y`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => y`<option value=${n} ?selected=${n === t.wallType}>${f(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${C(`${f("props.thickness")}, ${f("unit.mm")}`, He({
    value: t.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      t.setThickness(n);
    }
  }))}
    ${t.tool === "box" ? y`
      <div class="muted">${f("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => y`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${f(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
const Yo = (t) => Ff({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function Kf(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return y`<div class="props">
      ${jf({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
      ${s ? Ko(e, s, t.commit) : v}
      ${Yo(t)}
    </div>`;
  }
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = Wf(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = Zf(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Ko(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = y`<h4>${f("props.node")}</h4>
      ${C("X", y`<span class="val ro">${Fe(s.x)}</span>`)}${C("Y", y`<span class="val ro">${Fe(s.y)}</span>`)}`);
  }
  return y`
    <div class="props">
      ${i === v && (t.tool === "wall" || t.tool === "box") ? qf(t) : i === v && vf(t.tool) ? $f({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === v && t.tool === "select" ? Yo(t) : i === v ? y`<p class="muted">${f("props.none")}</p>` : i}
      ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
    </div>`;
}
function Gf(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Xo = /* @__PURE__ */ new WeakMap();
function Es(t, e, n) {
  let i = Xo.get(t);
  i || Xo.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((a) => {
    var l;
    return n ? e.domains.includes(a.domain) : Gf(a, e) && !a.hidden && !a.disabled && (a.category === null || !!((l = e.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function cn(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const en = (t) => t ?? v;
var Yf = Object.defineProperty, Wt = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && Yf(e, n, s), s;
};
const Xf = 100;
let Qf = 0;
const Jf = (t) => y`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${t}></path>`}</svg>`, Ps = class Ps extends Xe {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Qf++}`, this.shown = null, this.onOutside = (e) => {
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
    if (n && n.deps.length === e.length && n.deps.every((a, l) => a === e[l])) return n.value;
    const i = e[e.length - 1], s = [];
    let o = !1;
    for (const a of this.allRows())
      if (!(i && !a.search.includes(i))) {
        if (s.length === Xf) {
          o = !0;
          break;
        }
        s.push(a);
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
    return y`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${en(this.label || void 0)} title=${en(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? y`<button class="x" type="button" title=${f("combo.clear")} aria-label=${f("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return y`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${en(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => y`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${en(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? y`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? y`<div class="hint">${f("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return y`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
Ps.styles = ar`
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
let Oe = Ps;
Wt([
  xe()
], Oe.prototype, "value");
Wt([
  xe()
], Oe.prototype, "label");
Wt([
  H()
], Oe.prototype, "isOpen");
Wt([
  H()
], Oe.prototype, "query");
Wt([
  H()
], Oe.prototype, "active");
var e1 = Object.defineProperty, Is = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && e1(e, n, s), s;
};
const t1 = {
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
}, Qo = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, n1 = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Jo(t, e) {
  return t != null && t.deviceClass && Qo[t.deviceClass] ? Qo[t.deviceClass] : n1[(t == null ? void 0 : t.domain) ?? ma(e)] ?? "generic";
}
const er = (t) => Jf(t1[t]);
function i1(t) {
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
class Kn extends Oe {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = cn(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? cn(this.meta, e) : null;
    return y`${er(e ? Jo(this.meta.entities.get(e), e) : "generic")}
      ${n ? y`<span><b>${n.name}</b>${n.context !== n.name ? y`<small>${n.context}</small>` : v}<small class="eid">${e}</small></span>` : y`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = wa(this.states, e.entityId) ?? "unavailable";
    return y`${er(Jo(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${i1(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = cn(this.meta, e).name;
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
Is([
  xe({ attribute: !1 })
], Kn.prototype, "meta");
Is([
  xe({ attribute: !1 })
], Kn.prototype, "items");
Is([
  xe({ attribute: !1 })
], Kn.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Kn);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), St(s, e);
  return !0;
}, kn = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, ll = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), r1(e);
  }
};
function s1(t) {
  this._$AN !== void 0 ? (kn(this), this._$AM = t, ll(this)) : this._$AM = t;
}
function o1(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) St(i[o], !1), kn(i[o]);
  else i != null && (St(i, !1), kn(i));
  else St(this, t);
}
const r1 = (t) => {
  t.type == _e.CHILD && (t._$AP ?? (t._$AP = o1), t._$AQ ?? (t._$AQ = s1));
};
class a1 extends bs {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), ll(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (St(this, e), kn(this));
  }
  setValue(e) {
    if (Ba(this._$Ct)) this._$Ct._$AI(e, this);
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
const l1 = () => new c1();
class c1 {
}
const fi = /* @__PURE__ */ new WeakMap(), d1 = ys(class extends a1 {
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
      let n = fi.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), fi.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = fi.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), u1 = () => [{ v: "0", label: f("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], p1 = { min: 1, max: 10 };
function cl(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Ti = (t, e, n) => cl(t, Ft(t.level, e.id, n));
function mi(t, e, n, i) {
  return y`<div class="cflag">${C(e, y`<input type="checkbox" data-field=${t} .checked=${Z(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const gi = "__other", ft = /* @__PURE__ */ new Set();
function h1(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Us.includes(i), a = !r || ft.has(o), l = l1(), c = [...Us.map((d) => ({ v: d, label: d })), { v: gi, label: f("binding.eventOther") }];
  return y`<span class="evfield">${K(a ? gi : i, c, (d) => {
    if (d === gi) {
      ft.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    ft.delete(o), l.value && (l.value.hidden = !0), d !== i ? s(d) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${d1(l)} data-field=${`${n}-event-custom`} ?hidden=${Ss(!a)}
      .value=${Z(r ? "" : i)} @change=${(d) => {
    var m;
    const p = d.target, h = p.value.trim();
    if (!h) {
      p.value = r ? "" : i, t.setFieldNotice(f("props.badEvent"));
      return;
    }
    if (p.value = h, t.setFieldNotice(null), h !== i) {
      s(h) && ft.delete(o);
      return;
    }
    if (ft.delete(o), r) {
      p.hidden = !0;
      const b = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      b && (b.value = i);
    }
  }} /></span>`;
}
function f1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return y`${v}`;
  const s = i[n], o = (r) => Ti(t, e, { [n]: { ...s, ...r } });
  return y`<div class="trigger" data-trigger=${n}>
    ${C(f("binding.slot"), K(
    String(s.slot),
    u1(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${C(f("binding.event"), h1(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function m1(t, e, n) {
  const i = e.props;
  if (i.kind === "wall_switch" && n === "state")
    return y`
      ${mi(
      "autoByDoubleToggle",
      f("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => Ti(t, e, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? y`<div class="cflag">${C(f("binding.window"), He({
      value: i.windowSec,
      rule: p1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => t.setFieldNotice(a),
      apply: (a) => Ti(t, e, { windowSec: a })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return y`${v}`;
  const s = (a, l) => (c) => {
    var d, p;
    const u = Ft(t.level, e.id, { [a]: c });
    return cl(t, c && !((d = e.bindings) != null && d[l]) ? An(u, e.id, l, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = mi("autoEnabled", f("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : y`${mi("separateOff", f("binding.separateOff"), i.separateOff, o)}${i.separateOff ? v : r}`;
}
function g1(t) {
  return t.props.kind !== "smart_button" || !Zl(t).length ? y`${v}` : y`<div class="cfields"><p class="warn" data-note="duplicate">${f("binding.duplicate")}</p></div>`;
}
function Di(t, e) {
  return e === "control" && t.props.kind === "equipment" ? f("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? f("binding.onOff") : f(`role.${e}`);
}
const wi = (t) => String(t).padStart(2, "0");
function w1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${wi(e.getHours())}:${wi(e.getMinutes())}:${wi(e.getSeconds())}`;
}
const y1 = (t) => t.action === "set" ? `set ${t.value ?? ""}`.trim() : t.action;
function b1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? f("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : f("output.errorNotConfigured") : t.last ? f("output.last").replace("{event}", y1(t.last)).replace("{time}", w1(t.last.at)) : f("output.none");
}
function v1(t, e) {
  if (!rt(e.props.kind)) return v;
  const n = t.feed.stateOf(e), i = n ? b1(n) : t.feed.error ?? (t.feed.ready ? f("output.notSaved") : null);
  return i === null ? v : y`<p class="note" data-field="output">${i}</p>`;
}
function $1(t, e, n, i) {
  const s = ya(t.meta, i, t.states), o = Wl(t.level, e, n);
  return y`
    ${s === "missing" ? y`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : v}
    ${s === "unavailable" ? y`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : v}
    ${o.length ? y`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : v}`;
}
function x1(t, e, n) {
  var a;
  const { role: i } = n, s = ((a = e.bindings) == null ? void 0 : a[i]) ?? null, o = !!t.showAll[i], r = Di(e, i);
  return y`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Es(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const c = An(t.level, e.id, i, l.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Zi(i) ? f1(t, e, i) : v}
    ${s ? $1(t, e, i, s) : v}
  </div>`;
}
function k1(t) {
  const e = t.device, n = qi(t.level.devices.map(t.status));
  return y`<div class="props bprops">
    ${t.notice ? y`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.fieldNotice ? y`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : v}
    ${t.registryError ? y`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${f(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${e ? y`
      <h4>${qn(e)}</h4>
      ${_s(e, (i) => t.commit(Ft(t.level, e.id, {}, i)))}
      ${v1(t, e)}
      ${ze(e).map((i) => y`${x1(t, e, i)}${m1(t, e, i.role)}`)}
      ${g1(e)}` : y`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${f("binding.reload")}</button>
  </div>`;
}
const M1 = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, _1 = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, A1 = 6, S1 = ["A", "0", "B"], E1 = ["power", "control"], I1 = ["power", "power_in", "power_out", "voltage", "control"], ot = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function mt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? r : a) });
}
function gt(t, e, n, i, s, o) {
  return y`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Es(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const a = r.detail.value || null;
    a !== (s ?? null) && o(a);
  }}></ps-entity-combo>
  </div>`;
}
function P1(t, e) {
  const n = e.name ?? "";
  return C(f("props.name"), y`<input class="val wide" type="text" data-field="name"
    placeholder=${f(`power.kind.${e.kind}`)} .value=${Z(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(Nt(t.power, e.id, { name: o }, ot(t))) : s.value = n;
  }} />`);
}
function C1(t, e) {
  const n = new Set(ze(e).map((i) => i.role));
  return y`${E1.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return y`<div class="role">
      <div class="role-head"><span class="role-label">${f(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? y`<b>${cn(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${f("power.boundHint")}</p>`;
}
function tn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function L1(t, e) {
  var o;
  const n = ze(e), i = I1.flatMap((r) => n.filter((a) => a.role === r)), s = e.props;
  return y`
    ${_s(e, (r) => tn(t, Ft(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var a;
    return y`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Di(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Es(t.meta, r, !1)}
        .value=${((a = e.bindings) == null ? void 0 : a[r.role]) ?? null} .label=${Di(e, r.role)}
        @value-changed=${(l) => {
      l.stopPropagation(), tn(t, An(t.level, e.id, r.role, l.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? Ze(
    "controllable",
    f("props.controllable"),
    !!s.controllable,
    (r) => tn(t, On(t.level, e.id, r))
  ) : v}
    ${s.kind === "equipment" ? Ze("inverter", f("props.inverter"), !!s.inverter, (r) => {
    const a = Ma(t.level, t.power, e.id, r);
    return tn(t, a.level, a.power);
  }) : v}`;
}
function O1(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return y`<p class="warn" data-note="device-missing">${f("power.missing")}</p>`;
  const i = ct(n) ? v : Ze("output", f("power.enableOutput"), e.output !== !1, (s) => {
    const o = ot(t);
    if (s) {
      const { output: r, ...a } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? a : l) });
    } else
      t.commitPower(Bn(Nt(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? y`${L1(t, n)}${i}` : y`
    ${C(f("props.name"), y`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${C(f("props.kind"), y`<span class="val ro">${f(`device.${n.props.kind}`)}</span>`)}${C1(t, n)}${i}`;
}
function z1(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: f(`power.form.${r}`) }));
  return y`
    ${C(f("power.form"), K(e.form, i, (r) => {
    r !== e.form && t.commitPower(Nt(t.power, e.id, { form: r }, ot(t)));
  }, "form"))}
    <div class="row"><span>${f("power.position")}</span><span class="seg pos">${S1.map((r) => y`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${f("power.positionHint")}</p>`;
}
function N1(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (l, c) => {
    if (l === i && c === s) return !1;
    t.commitPower(Nt(t.power, e.id, n ? { w: l, h: c } : { w: c, h: l }, ot(t)));
  }, r = (l, c, u) => He({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: l, skipSame: !0, apply: u }), a = ["h", "v"].map((l) => ({ v: l, label: f(`power.orientation.${l}`) }));
  return y`
    ${C(f("power.orientation"), K(n ? "h" : "v", a, (l) => {
    l !== (n ? "h" : "v") && t.commitPower(Nt(t.power, e.id, { w: e.h, h: e.w }, ot(t)));
  }, "bus-orientation"))}
    ${C(f("power.busLength"), r("bus-length", i, (l) => o(Math.max(Oi, s + 1, l), s)))}
    ${C(f("power.busThickness"), r("bus-thickness", s, (l) => o(i, Math.min(Math.max(A1, l), i - 1))))}`;
}
function H1(t, e) {
  switch (e.kind) {
    case "grid":
      return y`
      ${gt(t, "power", f("power.field.power"), Be, e.power, (n) => mt(t, e, "power", n))}
      ${gt(t, "voltage", f("power.field.voltage"), M1, e.voltage, (n) => mt(t, e, "voltage", n))}`;
    case "device":
      return O1(t, e);
    case "battery":
      return y`
      ${gt(t, "power", f("power.field.batteryPower"), Be, e.power, (n) => mt(t, e, "power", n))}
      ${gt(t, "soc", f("power.field.soc"), _1, e.soc, (n) => mt(t, e, "soc", n))}`;
    case "pv":
      return gt(t, "power", f("power.field.power"), Be, e.power, (n) => mt(t, e, "power", n));
    case "transfer":
      return z1(t, e);
    case "bus":
      return N1(t, e);
    default:
      return v;
  }
}
function V1(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return y`
    <h4>${i ? qn(i) : f(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? v : P1(t, e)}
    ${H1(t, e)}
    <div class="pactions">
      ${n ? y`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Gd(t.power, e.id))}>${f("power.autoPorts")}</button>` : v}
      ${e.kind === "grid" ? v : y`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower($a(t.power, e.id))}>${f("action.delete")}</button>`}
    </div>`;
}
function T1(t, e) {
  var s, o;
  const n = ot(t), i = (r) => {
    const a = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), l = a ? Un(a, n) || f(`power.kind.${a.kind}`) : "—";
    return "block" in r ? `${l} · ${r.port}` : l;
  };
  return y`
    <h4>${f("power.wire")}</h4>
    ${C(f("power.wire.from"), y`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${C(f("power.wire.to"), y`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${C(f("power.wire.power"), y`<span class="val ro" data-field="wire-power">${vt((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(_a(t.power, e.id))}>${f("action.delete")}</button></div>`;
}
function D1(t) {
  const e = Aa(t.level, t.power);
  return y`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Xa(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${f("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${f("power.help.device")}</p>
    ${e.length === 0 ? y`<p class="muted" data-note="no-devices">${f("power.noDevices")}</p>` : y`<div class="pdevs">
      ${e.map((i) => y`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${qn(i)}</span>
      </button>`)}
    </div>`}`;
}
function R1(t) {
  if (t.toolId === "power-device") return D1(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return V1(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? T1(t, i) : t.toolId !== "power-select" ? y`<p class="muted" data-note="power-hint">${f("power.help.place")}</p>` : y`<p class="muted" data-note="power-hint">${f("power.pick")}</p><p class="muted">${f("power.help.select")}</p>`;
}
function B1(t) {
  return y`<div class="props pprops">
    ${t.notice ? y`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.feedError ? y`<p class="note" data-notice="feed">${t.feedError}</p>` : v}
    ${R1(t)}
  </div>`;
}
function F1(t, e) {
  return t.mode !== "binding" ? af(t.mode, t.toolId, (n) => t.pickTool(n)) : wf({
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
function U1(t, e) {
  var i;
  const n = t.selection;
  return k1({
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
function j1(t, e) {
  var i;
  if (t.mode === "binding") return U1(t, e);
  if (t.mode === "power")
    return B1({
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
  return t.mode === "equipment" ? Bf({
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
  }) : Kf({
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
function W1(t, e) {
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
function Z1(t, e) {
  const n = t === "zone" ? `${f("tool.zone")} · ${f(`zones.kind.${e}`)}` : f(`tool.${t}`);
  return y`<span class="tool-chip">${Ya(t)}${n}</span>`;
}
function q1(t) {
  return y`
    <div class="status">
      ${Z1(t.tool, t.zoneMethod)}
      ${W1(t.tool, t.zoneMethod).map(([e, n]) => y`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? y`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${f(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? v : y`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${f("status.cones")}
      </label>`}
    </div>`;
}
function K1(t, e) {
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
  return A`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((a, l) => A`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${n.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${a.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? n.text : n.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function G1(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a: l, b: c } = s[0], u = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: Fe(u), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Fe(r), second: Fe(a) };
}
function Y1(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const X1 = ar`
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
`, Q1 = 5e-3, J1 = 2, Mn = (t) => Math.max(Q1, Math.min(J1, t));
function em(t, e, n) {
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
function tm(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Mn(Math.min(e, n) / 12e3) };
  const i = t.map((d) => d.x), s = t.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, u = Mn(Math.min(e / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - e / u / 2, y: (l + c) / 2 - n / u / 2, scale: u };
}
function nm(t, e, n, i, s) {
  const o = Mn(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function im(t, e, n) {
  const i = Mn(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function sm(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function tr(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function om(t, e, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * t.scale >= 6 ? 100 * s : o, a = 1 / t.scale;
  return A`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${a}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${a}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const rm = ["Shift", "Control", "Alt", "Meta"], am = {
  plan: "select",
  equipment: "device-select",
  power: "power-select"
}, lm = new Map(Object.entries(Ga).map(([t, e]) => [`Key${e}`, t]));
function nr(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class cm {
  constructor(e) {
    this.h = e, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
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
        this.h.view = sm(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = im(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (nr(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? lm.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let a = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!a && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (a = this.h.deleteSelection()), !a && n.key === "Escape") {
        const l = am[this.h.mode];
        l && this.h.toolId !== l ? this.h.pickTool(l) : (this.h.activeTool.cancel(), this.h.selection = null), a = !0;
      }
      a && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || nr(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !rm.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function dl(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function dm(t) {
  return y`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", dl(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function wt(t, e, n, i) {
  return y`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? y`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${n.map((s) => y`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function um(t) {
  var n;
  const e = { action: "cancel", label: f("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? wt(f("draft.title"), f("draft.text").replace("{time}", dl(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => t.discard(i) }
      ]) : v;
    }
    case "new":
      return wt(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return wt(f("delete.title"), f("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "switch":
      return wt(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return wt(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return v;
  }
}
const yt = "plan_studio.draft.", nn = "plan_studio.lastPlanId";
function pm() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function hm(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class fm {
  constructor(e = pm, n = 500) {
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
      (n = this.storage()) == null || n.setItem(yt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(yt + e), s = i ? JSON.parse(i) : null;
      return hm(s) && s.planId === e ? s : null;
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
        if (!(s != null && s.startsWith(yt))) continue;
        const o = this.read(s.slice(yt.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(nn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(nn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(nn)) === e && n.removeItem(nn);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(yt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const ul = 5e3, pl = 12, mm = 3e3;
function ir(t) {
  t().catch(() => {
  });
}
class gm {
  constructor(e, n) {
    this.host = e, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.flashes = /* @__PURE__ */ new Map(), this.onDisconnected = () => {
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
  get(e) {
    return this.map.get(e);
  }
  /** The intent the container's badge shows now (for FLASH_MS after it arrived), else null. */
  flash(e) {
    var n;
    return ((n = this.flashes.get(e)) == null ? void 0 : n.intent) ?? null;
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
   * Ends the subscription (also one still being set up), cancels the retries and the flashes, stops listening to the
   * connection and forgets the states; any plan can be watched again.
   */
  stop() {
    this.unlisten(), this.cancelRetry(), this.clearFlashes(), this.retries = 0, this.drop(!0), this.planId = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null;
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
    this.sub = null, n && (n.live = !1, e && n.unsub && ir(n.unsub));
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
          ir(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(we(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= pl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, ul));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    var i, s;
    const n = Object.entries(e.containers ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [o, r] of n) {
        const a = (s = (i = this.map.get(o)) == null ? void 0 : i.last) == null ? void 0 : s.at;
        this.map.set(o, r), r.last && r.last.at !== a && this.startFlash(o, r.last);
      }
    this.host.requestUpdate();
  }
  /** Shows `last` on the container's badge for FLASH_MS, replacing (and restarting) any intent shown there. */
  startFlash(e, n) {
    const i = this.flashes.get(e);
    i && clearTimeout(i.timer);
    const s = setTimeout(() => {
      this.flashes.delete(e), this.host.requestUpdate();
    }, mm), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
    this.flashes.set(e, { intent: o, timer: s });
  }
  clearFlashes() {
    for (const e of this.flashes.values()) clearTimeout(e.timer);
    this.flashes.clear();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
const wm = ["power", "voltage", "power_in", "power_out", "control"], ym = 300;
function sr(t) {
  t().catch(() => {
  });
}
function bm(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const a = { inverter: ct(r), controllable: Dr(r) };
    for (const l of wm) {
      const c = (s = r.bindings) == null ? void 0 : s[l];
      c && (a[l] = c);
    }
    i[r.id] = a;
  }
  return { power: t, devices: i };
}
class vm {
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
      }, ym);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && sr(n.unsub));
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
          sr(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(we(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= pl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, ul));
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
var $m = Object.defineProperty, V = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && $m(e, n, s), s;
};
const Cs = class Cs extends Xe {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Kl.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = If(), this.nextObj = yf(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = ba(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new fm(), this.resizeObs = null, this.session = new _f(this), this.haMeta = new Af(this), this.feed = new gm(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new vm(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Fl(i, (s) => {
      var o;
      return ya(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new xu(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Sf(this), this.activeTool = zi("select", this.ctx), this.input = new cm(this);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((e = this.plan) == null ? void 0 : e.id) ?? null), this.watchPower();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (e = this.resizeObs) == null || e.disconnect(), this.resizeObs = null, this.feed.stop(), this.powerFeed.stop();
  }
  willUpdate(e) {
    var i;
    e.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = this.size.w > 0 && this.size.h > 0;
    this.needFit && n && (this.needFit = !1, this.fit()), this.needPowerFit && n && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((i = this.plan) == null ? void 0 : i.id) ?? null : null), this.watchPower();
  }
  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  watchPower() {
    const e = this.isConnected && this.mode === "power" ? this.level : null;
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? bm(this.power, e) : null);
  }
  updated() {
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
    const i = this.history.current.power, s = n ?? (i && Zd(i, e));
    this.history.push({ ...this.history.current, level: e, ...s && s !== this.power ? { power: s } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
  }
  commitPower(e) {
    this.history && (this.history.push({ ...this.history.current, power: e }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  dropStaleSelection() {
    this.history && this.selection && !hi(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || !e || !n || e.kind === "node" || !hi(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = ka(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? ds(n, e.id) : e.kind === "opening" ? Nr(n, e.id) : ca(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(_a(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = $a(n, e.id);
    return i === n ? this.notice = f("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = we(i);
    });
  }
  undo() {
    this.step(() => {
      var e;
      return ((e = this.history) == null ? void 0 : e.undo()) ?? null;
    });
  }
  redo() {
    this.step(() => {
      var e;
      return ((e = this.history) == null ? void 0 : e.redo()) ?? null;
    });
  }
  /**
   * Undo / redo drop the selection, except in the Binding step, which keeps the selected device while it exists;
   * the field notice goes with a dropped selection.
   */
  step(e) {
    this.activeTool.cancel(), e() && this.save.markDirty();
    const n = this.selection, i = this.level;
    this.selection = this.mode === "binding" && n && i && hi(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = zi(e, this.ctx);
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
    e !== this.mode && (this.mode === "power" && (this.placeDeviceId = null), this.mode = e, this.pickTool(ks(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = Y(n, i);
    s && (this.view = tr(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = ia(n).get(e);
    s && (this.view = tr(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? ff(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return em(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = tm(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = wu(this.power, this.ctx.geo());
    e && (this.powerView = nm(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e;
    return um({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
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
    var d, p, h;
    if (!this.plan || !this.history)
      return y`<div class="center">${this.loadError ? y`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const e = yh(!!((p = (d = this.hass) == null ? void 0 : d.themes) != null && p.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power";
    return y`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : ""}"
        style=${Y1(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${sf({
      steps: cf({
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
      lead: this.narrow ? y`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onPickPlan: (m) => this.session.pickPlan(m),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${F1(this, n)}
        ${j1(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(m) => m.preventDefault()}>
            ${this.grid ? om(this.view, a, l, e, u ? 0.1 : 1) : v}
            ${this.mode === "power" ? mh(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Fp(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (m) => this.feed.stateOf(m),
      containerFlash: (m) => this.feed.flash(m.id)
    })}
            ${i.tracker ? K1(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: G1(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((h = this.dialog) == null ? void 0 : h.kind) !== "restore" ? dm({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${q1({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? f(`snap.${i.snap.kind}`) : null,
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
Cs.styles = X1;
let N = Cs;
V([
  xe({ attribute: !1 })
], N.prototype, "hass");
V([
  xe({ type: Boolean })
], N.prototype, "narrow");
V([
  xe({ attribute: !1 })
], N.prototype, "panel");
V([
  H()
], N.prototype, "plan");
V([
  H()
], N.prototype, "loadError");
V([
  H()
], N.prototype, "selection");
V([
  H()
], N.prototype, "toolId");
V([
  H()
], N.prototype, "wallType");
V([
  H()
], N.prototype, "thickness");
V([
  H()
], N.prototype, "boxMeasure");
V([
  H()
], N.prototype, "grid");
V([
  H()
], N.prototype, "mode");
V([
  H()
], N.prototype, "bindFilter");
V([
  H()
], N.prototype, "bindQuery");
V([
  H()
], N.prototype, "railCollapsed");
V([
  H()
], N.prototype, "showAll");
V([
  H()
], N.prototype, "zoneQuery");
V([
  H()
], N.prototype, "cones");
V([
  H()
], N.prototype, "nextProps");
V([
  H()
], N.prototype, "nextObj");
V([
  H()
], N.prototype, "planView");
V([
  H()
], N.prototype, "powerView");
V([
  H()
], N.prototype, "placeDeviceId");
V([
  H()
], N.prototype, "size");
V([
  H()
], N.prototype, "dialog");
V([
  H()
], N.prototype, "notice");
V([
  H()
], N.prototype, "fieldNotice");
V([
  H()
], N.prototype, "pendingDraft");
V([
  H()
], N.prototype, "plans");
V([
  H()
], N.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", N);
export {
  N as PlanStudioPanel
};
