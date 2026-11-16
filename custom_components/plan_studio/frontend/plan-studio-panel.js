/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gn = globalThis, fs = gn.ShadowRoot && (gn.ShadyCSS === void 0 || gn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, hs = Symbol(), ao = /* @__PURE__ */ new WeakMap();
let Jr = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== hs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (fs && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = ao.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ao.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vc = (t) => new Jr(typeof t == "string" ? t : t + "", void 0, hs), el = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new Jr(n, t, hs);
}, bc = (t, e) => {
  if (fs) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = gn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, co = fs ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return vc(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yc, defineProperty: $c, getOwnPropertyDescriptor: xc, getOwnPropertyNames: kc, getOwnPropertySymbols: Mc, getPrototypeOf: _c } = Object, Le = globalThis, uo = Le.trustedTypes, Ac = uo ? uo.emptyScript : "", mi = Le.reactiveElementPolyfillSupport, Et = (t, e) => t, _n = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ac : null;
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
} }, ms = (t, e) => !yc(t, e), po = { attribute: !0, type: String, converter: _n, reflect: !1, useDefault: !1, hasChanged: ms };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Le.litPropertyMetadata ?? (Le.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Je = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = po) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && $c(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = xc(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? po;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Et("elementProperties"))) return;
    const e = _c(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Et("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Et("properties"))) {
      const n = this.properties, i = [...kc(n), ...Mc(n)];
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
      for (const s of i) n.unshift(co(s));
    } else e !== void 0 && n.push(co(e));
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
    return bc(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : _n).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : _n;
      this._$Em = s;
      const c = a.fromAttribute(n, l.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? ms)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
Je.elementStyles = [], Je.shadowRootOptions = { mode: "open" }, Je[Et("elementProperties")] = /* @__PURE__ */ new Map(), Je[Et("finalized")] = /* @__PURE__ */ new Map(), mi == null || mi({ ReactiveElement: Je }), (Le.reactiveElementVersions ?? (Le.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = globalThis, fo = (t) => t, An = It.trustedTypes, ho = An ? An.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, tl = "$lit$", Ie = `lit$${Math.random().toFixed(9).slice(2)}$`, nl = "?" + Ie, Sc = `<${nl}>`, qe = document, Nt = () => qe.createComment(""), Tt = (t) => t === null || typeof t != "object" && typeof t != "function", gs = Array.isArray, Ec = (t) => gs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", gi = `[ 	
\f\r]`, gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mo = /-->/g, go = />/g, He = RegExp(`>|${gi}(?:([^\\s"'>=/]+)(${gi}*=${gi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wo = /'/g, vo = /"/g, il = /^(?:script|style|textarea|title)$/i, sl = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), v = sl(1), M = sl(2), ae = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), bo = /* @__PURE__ */ new WeakMap(), Re = qe.createTreeWalker(qe, 129);
function ol(t, e) {
  if (!gs(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ho !== void 0 ? ho.createHTML(e) : e;
}
const Ic = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = gt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, u, d = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, u = r.exec(a), u !== null); ) p = r.lastIndex, r === gt ? u[1] === "!--" ? r = mo : u[1] !== void 0 ? r = go : u[2] !== void 0 ? (il.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = He) : u[3] !== void 0 && (r = He) : r === He ? u[0] === ">" ? (r = s ?? gt, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? He : u[3] === '"' ? vo : wo) : r === vo || r === wo ? r = He : r === mo || r === go ? r = gt : (r = He, s = void 0);
    const f = r === He && t[l + 1].startsWith("/>") ? " " : "";
    o += r === gt ? a + Sc : d >= 0 ? (i.push(c), a.slice(0, d) + tl + a.slice(d) + Ie + f) : a + Ie + (d === -2 ? l : f);
  }
  return [ol(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Vt {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, u] = Ic(e, n);
    if (this.el = Vt.createElement(c, i), Re.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Re.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(tl)) {
          const p = u[r++], f = s.getAttribute(d).split(Ie), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? Pc : m[1] === "?" ? Lc : m[1] === "@" ? Oc : jn }), s.removeAttribute(d);
        } else d.startsWith(Ie) && (a.push({ type: 6, index: o }), s.removeAttribute(d));
        if (il.test(s.tagName)) {
          const d = s.textContent.split(Ie), p = d.length - 1;
          if (p > 0) {
            s.textContent = An ? An.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(d[f], Nt()), Re.nextNode(), a.push({ type: 2, index: ++o });
            s.append(d[p], Nt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === nl) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(Ie, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += Ie.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = qe.createElement("template");
    return i.innerHTML = e, i;
  }
}
function ot(t, e, n = t, i) {
  var r, l;
  if (e === ae) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Tt(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = ot(t, s._$AS(t, e.values), s, i)), e;
}
class Cc {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? qe).importNode(n, !0);
    Re.currentNode = s;
    let o = Re.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new ws(o, o.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (c = new zc(o, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = Re.nextNode(), r++);
    }
    return Re.currentNode = qe, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let ws = class rl {
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
    e = ot(this, e, n), Tt(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== ae && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ec(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== b && Tt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(qe.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Vt.createElement(ol(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Cc(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = bo.get(e.strings);
    return n === void 0 && bo.set(e.strings, n = new Vt(e)), n;
  }
  k(e) {
    gs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new rl(this.O(Nt()), this.O(Nt()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = fo(e).nextSibling;
      fo(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class jn {
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
    if (o === void 0) e = ot(this, e, n, 0), r = !Tt(e) || e !== this._$AH && e !== ae, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = o[0], a = 0; a < o.length - 1; a++) c = ot(this, l[i + a], n, a), c === ae && (c = this._$AH[a]), r || (r = !Tt(c) || c !== this._$AH[a]), c === b ? e = b : e !== b && (e += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pc extends jn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === b ? void 0 : e;
  }
}
class Lc extends jn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== b);
  }
}
let Oc = class extends jn {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = ot(this, e, n, 0) ?? b) === ae) return;
    const i = this._$AH, s = e === b && i !== b || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== b && (i === b || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class zc {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ot(this, e);
  }
}
const wi = It.litHtmlPolyfillSupport;
wi == null || wi(Vt, ws), (It.litHtmlVersions ?? (It.litHtmlVersions = [])).push("3.3.3");
const Dc = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new ws(e.insertBefore(Nt(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis;
let it = class extends Je {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Dc(n, this.renderRoot, this.renderOptions);
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
    return ae;
  }
};
var Qr;
it._$litElement$ = !0, it.finalized = !0, (Qr = Fe.litElementHydrateSupport) == null || Qr.call(Fe, { LitElement: it });
const vi = Fe.litElementPolyfillSupport;
vi == null || vi({ LitElement: it });
(Fe.litElementVersions ?? (Fe.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Nc = { attribute: !0, type: String, converter: _n, reflect: !1, hasChanged: ms }, Tc = (t = Nc, e, n) => {
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
function Me(t) {
  return (e, n) => typeof n == "object" ? Tc(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function R(t) {
  return Me({ ...t, state: !0, attribute: !1 });
}
function Z() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function vs(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const Ue = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Vc = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Hc = { ...Ue, role: "power_in" }, Rc = { ...Ue, role: "power_out" }, Bc = ["on", "off", "auto"], bs = (t) => Bc.includes(t), bi = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Fc = {
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
  smart_button: [bi("on"), bi("off"), bi("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Ue],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Ue, Vc, Hc, Rc]
}, ys = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Uc = { climate_sensor: "any" };
function ve(t) {
  const e = t.props, n = Fc[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function ll(t) {
  return new Set(ve(t).map((e) => e.role));
}
function Wn(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !ll(s).has(n)) return t;
  const o = (l = s.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (o === void 0) return t;
    const a = { ...s.bindings };
    delete a[n];
    const c = { ...s, bindings: a };
    if (Object.keys(a).length === 0 && delete c.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...d } = s.props;
      c.props = d;
    }
    return { ...t, devices: t.devices.map((u) => u === s ? c : u) };
  }
  if (o === i) return t;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
function jc(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = ve(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (Uc[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Wc(t) {
  const e = ve(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const qc = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function Bi(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !bs(e) ? n : `${n}|${qc(i[e])}`;
}
function Zc(t, e, n) {
  const i = Bi(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && ve(s).some((o) => Bi(s, o.role) === i));
}
function Kc(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of ve(t)) {
    const s = bs(i) ? Bi(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function qn(t) {
  if (!t.bindings) return t;
  const e = ll(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const al = (t) => t === "wall_switch" || t === "smart_button", Zn = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", Ht = (t) => t === "wall" ? "wall" : "free", Gc = [100, 125, 150], $s = "mdi:cube-outline", yo = ["single", "double", "hold"], Yc = {
  bearing: 400
}, wn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function cl(t = Z(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function $o(t) {
  return {
    id: Z(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [cl()]
  };
}
const xs = {
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
}, rt = 90, dl = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function ze(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: $s, label: "" };
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
const Xc = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: $s
};
function Qc(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Xc[String(n)] ?? $s;
  return { ...t, props: { ...i, icon: s } };
}
function Jc(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Ht(t.placement.mode);
  return e ? { ...t, props: ze("smart_button", n), bindings: { on: e } } : { ...t, props: ze("wall_switch", n) };
}
const ul = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function ed(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = ul(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function td(t) {
  const e = t.props.kind;
  if (!Zn(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(ze(e, Ht(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? ed(r, o) : s === "windowSec" ? ul(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function nd(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function id(t) {
  if (!Zn(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function sd(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => qn(nd(id(td(Jc(Qc(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function z(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function C(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function I(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function H(t, e) {
  return t.x * e.x + t.y * e.y;
}
function te(t, e) {
  return t.x * e.y - t.y * e.x;
}
function pl(t) {
  return Math.hypot(t.x, t.y);
}
function L(t, e) {
  return pl(C(e, t));
}
function Kn(t) {
  const e = pl(t);
  return e === 0 ? { x: 0, y: 0 } : I(t, 1 / e);
}
function Y(t) {
  return { x: t.y, y: -t.x };
}
function fl(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function pe(t, e, n, i) {
  const s = te(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = te(C(n, t), i) / s;
  return z(t, I(e, o));
}
function Gn(t, e, n) {
  const i = C(n, e), s = H(i, i);
  return s === 0 ? 0 : H(C(t, e), i) / s;
}
function me(t, e, n) {
  const i = C(n, e), s = H(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, H(C(t, e), i) / s));
  return L(t, z(e, I(i, o)));
}
function lt(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function ge(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let De = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function od(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Ce(t, e, n) {
  const i = new De(null, null);
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
function yi(t, e, n, i) {
  const s = new De(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = Ce(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function xo(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = Ce(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function rd(t, e, n) {
  return e === null ? t : (t === null || (e = Ce(t.key, e, n), e.left = t), e);
}
function Fi(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && Fi(t.left, o, !1, i, s), t.right && Fi(t.right, o, !0, i, s);
  }
}
class ks {
  constructor(e = od) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = yi(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new De(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Ce(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = Ce(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = Ce(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Ce(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = Ce(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return ad(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && Wi(e, n, 0, s - 1, o), this._root === null)
      this._root = Ui(e, n, 0, s), this._size = s;
    else {
      const r = cd(
        this.toList(),
        ld(e, n),
        o
      );
      s = this._size + s, this._root = ji({ head: r }, 0, s);
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
    return Fi(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = xo(e, this._root, s);
    s(e, n) < 0 ? r = yi(n, i, r, s) : o = yi(n, i, o, s), this._root = rd(o, r, s);
  }
  split(e) {
    return xo(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function Ui(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new De(r, l);
    return a.left = Ui(t, e, n, o), a.right = Ui(t, e, o + 1, i), a;
  }
  return null;
}
function ld(t, e) {
  const n = new De(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new De(t[s], e[s]);
  return i.next = null, n.next;
}
function ad(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new De(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function ji(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = ji(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = ji(t, s + 1, n), r;
  }
  return null;
}
function cd(t, e, n) {
  const i = new De(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function Wi(t, e, n, i, s) {
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
  Wi(t, e, n, l, s), Wi(t, e, l + 1, i, s);
}
const xe = 11102230246251565e-32, X = 134217729, dd = (3 + 8 * xe) * xe;
function $i(t, e, n, i, s) {
  let o, r, l, a, c = e[0], u = i[0], d = 0, p = 0;
  u > c == u > -c ? (o = c, c = e[++d]) : (o = u, u = i[++p]);
  let f = 0;
  if (d < t && p < n)
    for (u > c == u > -c ? (r = c + o, l = o - (r - c), c = e[++d]) : (r = u + o, l = o - (r - u), u = i[++p]), o = r, l !== 0 && (s[f++] = l); d < t && p < n; )
      u > c == u > -c ? (r = o + c, a = r - o, l = o - (r - a) + (c - a), c = e[++d]) : (r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p]), o = r, l !== 0 && (s[f++] = l);
  for (; d < t; )
    r = o + c, a = r - o, l = o - (r - a) + (c - a), c = e[++d], o = r, l !== 0 && (s[f++] = l);
  for (; p < n; )
    r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p], o = r, l !== 0 && (s[f++] = l);
  return (o !== 0 || f === 0) && (s[f++] = o), f;
}
function ud(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function S(t) {
  return new Float64Array(t);
}
const pd = (3 + 16 * xe) * xe, fd = (2 + 12 * xe) * xe, hd = (9 + 64 * xe) * xe * xe, Xe = S(4), ko = S(8), Mo = S(12), _o = S(16), ee = S(4);
function md(t, e, n, i, s, o, r) {
  let l, a, c, u, d, p, f, m, y, w, g, $, k, _, x, A, E, O;
  const N = t - s, U = n - s, D = e - o, T = i - o;
  _ = N * T, p = X * N, f = p - (p - N), m = N - f, p = X * T, y = p - (p - T), w = T - y, x = m * w - (_ - f * y - m * y - f * w), A = D * U, p = X * D, f = p - (p - D), m = D - f, p = X * U, y = p - (p - U), w = U - y, E = m * w - (A - f * y - m * y - f * w), g = x - E, d = x - g, Xe[0] = x - (g + d) + (d - E), $ = _ + g, d = $ - _, k = _ - ($ - d) + (g - d), g = k - A, d = k - g, Xe[1] = k - (g + d) + (d - A), O = $ + g, d = O - $, Xe[2] = $ - (O - d) + (g - d), Xe[3] = O;
  let j = ud(4, Xe), oe = fd * r;
  if (j >= oe || -j >= oe || (d = t - N, l = t - (N + d) + (d - s), d = n - U, c = n - (U + d) + (d - s), d = e - D, a = e - (D + d) + (d - o), d = i - T, u = i - (T + d) + (d - o), l === 0 && a === 0 && c === 0 && u === 0) || (oe = hd * r + dd * Math.abs(j), j += N * u + T * l - (D * c + U * a), j >= oe || -j >= oe)) return j;
  _ = l * T, p = X * l, f = p - (p - l), m = l - f, p = X * T, y = p - (p - T), w = T - y, x = m * w - (_ - f * y - m * y - f * w), A = a * U, p = X * a, f = p - (p - a), m = a - f, p = X * U, y = p - (p - U), w = U - y, E = m * w - (A - f * y - m * y - f * w), g = x - E, d = x - g, ee[0] = x - (g + d) + (d - E), $ = _ + g, d = $ - _, k = _ - ($ - d) + (g - d), g = k - A, d = k - g, ee[1] = k - (g + d) + (d - A), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const ye = $i(4, Xe, 4, ee, ko);
  _ = N * u, p = X * N, f = p - (p - N), m = N - f, p = X * u, y = p - (p - u), w = u - y, x = m * w - (_ - f * y - m * y - f * w), A = D * c, p = X * D, f = p - (p - D), m = D - f, p = X * c, y = p - (p - c), w = c - y, E = m * w - (A - f * y - m * y - f * w), g = x - E, d = x - g, ee[0] = x - (g + d) + (d - E), $ = _ + g, d = $ - _, k = _ - ($ - d) + (g - d), g = k - A, d = k - g, ee[1] = k - (g + d) + (d - A), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const Se = $i(ye, ko, 4, ee, Mo);
  _ = l * u, p = X * l, f = p - (p - l), m = l - f, p = X * u, y = p - (p - u), w = u - y, x = m * w - (_ - f * y - m * y - f * w), A = a * c, p = X * a, f = p - (p - a), m = a - f, p = X * c, y = p - (p - c), w = c - y, E = m * w - (A - f * y - m * y - f * w), g = x - E, d = x - g, ee[0] = x - (g + d) + (d - E), $ = _ + g, d = $ - _, k = _ - ($ - d) + (g - d), g = k - A, d = k - g, ee[1] = k - (g + d) + (d - A), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const wc = $i(Se, Mo, 4, ee, _o);
  return _o[wc - 1];
}
function gd(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= pd * c ? a : -md(t, e, n, i, s, o, c);
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
const wt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, qi = (t, e) => {
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
let Pe = Number.EPSILON;
Pe === void 0 && (Pe = Math.pow(2, -52));
const wd = Pe * Pe, Ao = (t, e) => {
  if (-Pe < t && t < Pe && -Pe < e && e < Pe)
    return 0;
  const n = t - e;
  return n * n < wd * t * e ? 0 : t < e ? -1 : 1;
};
class vd {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new So(), this.yRounder = new So();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class So {
  constructor() {
    this.tree = new ks(), this.round(0);
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
    if (i !== null && Ao(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && Ao(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const Rt = new vd(), vn = (t, e) => t.x * e.y - t.y * e.x, hl = (t, e) => t.x * e.x + t.y * e.y, Eo = (t, e, n) => {
  const i = gd(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Sn = (t) => Math.sqrt(hl(t, t)), bd = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return vn(s, i) / Sn(s) / Sn(i);
}, yd = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return hl(s, i) / Sn(s) / Sn(i);
}, Io = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Co = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, $d = (t, e, n, i) => {
  if (e.x === 0) return Co(n, i, t.x);
  if (i.x === 0) return Co(t, e, n.x);
  if (e.y === 0) return Io(n, i, t.y);
  if (i.y === 0) return Io(t, e, n.y);
  const s = vn(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = vn(o, e) / s, l = vn(o, i) / s, a = t.x + l * e.x, c = n.x + r * i.x, u = t.y + l * e.y, d = n.y + r * i.y, p = (a + c) / 2, f = (u + d) / 2;
  return {
    x: p,
    y: f
  };
};
class le {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = le.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Oe.compare(e.segment, n.segment));
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
        sine: bd(this.point, e.point, o.point),
        cosine: yd(this.point, e.point, o.point)
      });
    };
    return (s, o) => {
      n.has(s) || i(s), n.has(o) || i(o);
      const {
        sine: r,
        cosine: l
      } = n.get(s), {
        sine: a,
        cosine: c
      } = n.get(o);
      return r >= 0 && a >= 0 ? l < c ? 1 : l > c ? -1 : 0 : r < 0 && a < 0 ? l < c ? -1 : l > c ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let xd = 0;
class Oe {
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
    const l = e.leftSE.point.y, a = n.leftSE.point.y, c = e.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (a < l && a < c) return 1;
      if (a > l && a > c) return -1;
      const d = e.comparePoint(n.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const p = n.comparePoint(e.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (l < a && l < u) return -1;
      if (l > a && l > u) return 1;
      const d = n.comparePoint(e.leftSE.point);
      if (d !== 0) return d;
      const p = e.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
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
      const d = c - l, p = o - i, f = u - a, m = r - s;
      if (d > p && f < m) return 1;
      if (d < p && f > m) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++xd, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const l = le.comparePoints(e, n);
    if (l < 0)
      s = e, o = n, r = 1;
    else if (l > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new le(s, !0), c = new le(o, !1);
    return new Oe(a, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = qi(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = wt(n, l) && this.comparePoint(l) === 0, u = wt(i, o) && e.comparePoint(o) === 0, d = wt(n, a) && this.comparePoint(a) === 0, p = wt(i, r) && e.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? a : null;
    if (u)
      return d && o.x === a.x && o.y === a.y ? null : o;
    if (c)
      return p && r.x === l.x && r.y === l.y ? null : l;
    if (p && d) return null;
    if (p) return r;
    if (d) return a;
    const f = $d(o, this.vector(), l, e.vector());
    return f === null || !wt(s, f) ? null : Rt.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, s = new le(e, !0), o = new le(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new Oe(s, r, this.rings.slice(), this.windings.slice());
    return le.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), le.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Oe.compare(n, i);
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
        const l = i.rings[o], a = i.windings[o], c = n.rings.indexOf(l);
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
    const n = this._afterState.rings, i = this._afterState.windings, s = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const c = this.rings[l], u = this.windings[l], d = n.indexOf(c);
      d === -1 ? (n.push(c), i.push(u)) : i[d] += u;
    }
    const o = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const c = n[l], u = c.poly;
      if (r.indexOf(u) === -1)
        if (c.isExterior) o.push(u);
        else {
          r.indexOf(u) === -1 && r.push(u);
          const d = o.indexOf(c.poly);
          d !== -1 && o.splice(d, 1);
        }
    }
    for (let l = 0, a = o.length; l < a; l++) {
      const c = o[l].multiPoly;
      s.indexOf(c) === -1 && s.push(c);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (ce.type) {
      case "union": {
        const i = e.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        e.length < n.length ? (i = e.length, s = n.length) : (i = n.length, s = e.length), this._isInResult = s === ce.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${ce.type}`);
    }
    return this._isInResult;
  }
}
class Po {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Rt.round(e[0][0], e[0][1]);
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
      let a = Rt.round(e[r][0], e[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(Oe.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Oe.fromRing(o, s, this));
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
class kd {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Po(e[0], this, !0), this.bbox = {
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
      const o = new Po(e[i], this, !1);
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
class Lo {
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
      const o = new kd(e[i], this);
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
class En {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const c = [l], u = l.point, d = [];
      for (; r = l, l = a, c.push(l), l.point !== u; )
        for (; ; ) {
          const p = l.getAvailableLinkedEvents();
          if (p.length === 0) {
            const y = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (p.length === 1) {
            a = p[0].otherSE;
            break;
          }
          let f = null;
          for (let y = 0, w = d.length; y < w; y++)
            if (d[y].point === l.point) {
              f = y;
              break;
            }
          if (f !== null) {
            const y = d.splice(f)[0], w = c.splice(y.index);
            w.unshift(w[0].otherSE), n.push(new En(w.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = p.sort(m)[0].otherSE;
          break;
        }
      n.push(new En(c));
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
      Eo(d, e, p) !== 0 && (n.push(d), e = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Eo(i, e, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let c = r; c != l; c += o) a.push([n[c].x, n[c].y]);
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
      le.compare(e, r) > 0 && (e = r);
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
class Oo {
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
class Md {
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
        if (o.isExteriorRing()) n.push(new Oo(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new Oo(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class _d {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Oe.compare;
    this.queue = e, this.tree = new ks(n), this.segments = [];
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
      let c = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (c = d), !l.isAnEndpoint(d))) {
          const p = this._splitSafely(l, d);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      let u = null;
      if (a) {
        const d = a.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (u = d), !a.isAnEndpoint(d))) {
          const p = this._splitSafely(a, d);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      if (c !== null || u !== null) {
        let d = null;
        c === null ? d = u : u === null ? d = c : d = le.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(d);
        for (let f = 0, m = p.length; f < m; f++)
          i.push(p[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const c = l.getIntersection(a);
        if (c !== null) {
          if (!l.isAnEndpoint(c)) {
            const u = this._splitSafely(l, c);
            for (let d = 0, p = u.length; d < p; d++)
              i.push(u[d]);
          }
          if (!a.isAnEndpoint(c)) {
            const u = this._splitSafely(a, c);
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
const zo = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Ad = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Sd {
  run(e, n, i) {
    ce.type = e, Rt.reset();
    const s = [new Lo(n, !0)];
    for (let d = 0, p = i.length; d < p; d++)
      s.push(new Lo(i[d], !1));
    if (ce.numMultiPolys = s.length, ce.type === "difference") {
      const d = s[0];
      let p = 1;
      for (; p < s.length; )
        qi(s[p].bbox, d.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (ce.type === "intersection")
      for (let d = 0, p = s.length; d < p; d++) {
        const f = s[d];
        for (let m = d + 1, y = s.length; m < y; m++)
          if (qi(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new ks(le.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const f = s[d].getSweepEvents();
      for (let m = 0, y = f.length; m < y; m++)
        if (o.insert(f[m]), o.size > zo)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new _d(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const d = a.key;
      if (o.size === l) {
        const f = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > zo)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Ad)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let f = 0, m = p.length; f < m; f++) {
        const y = p[f];
        y.consumedBy === void 0 && o.insert(y);
      }
      l = o.size, a = o.pop();
    }
    Rt.reset();
    const c = En.factory(r.segments);
    return new Md(c).getGeom();
  }
}
const ce = new Sd(), Ed = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("union", t, n);
}, Id = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("intersection", t, n);
}, Cd = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("xor", t, n);
}, Pd = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("difference", t, n);
};
var ml = {
  union: Ed,
  intersection: Id,
  xor: Cd,
  difference: Pd
};
const gl = 3, Ld = 1e-6;
function Yn(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function q(t, e) {
  const n = Yn(t, e);
  return { x: n.x, y: n.y };
}
function Ye(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function wl(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: Kn(C(e, t)), len: L(t, e), leftOff: o, rightOff: r };
}
function J(t, e) {
  return wl(q(t, e.a), q(t, e.b), e.thickness, e.baseline);
}
function Te(t, e) {
  const n = C(e, t.a);
  return { t: H(n, t.dir), side: H(n, Y(t.dir)) };
}
function Do(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: I(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const et = (t) => z(t.p, I(Y(t.u), t.offL)), tt = (t) => C(t.p, I(Y(t.u), t.offR));
function Be(t, e, n) {
  return t !== null && L(t, e) <= n;
}
function Od(t) {
  const e = [];
  for (const n of t.walls) {
    const i = J(t, n);
    if (i.len < 1e-9) continue;
    const s = Y(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: z(i.a, I(s, i.leftOff)),
        ar: C(i.a, I(s, i.rightOff)),
        bl: z(i.b, I(s, i.leftOff)),
        br: C(i.b, I(s, i.rightOff))
      }
    });
  }
  return e;
}
function zd(t, e) {
  const n = e.f, i = Y(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = H(C(s.far, n.a), i) >= 0 ? z(n.a, I(i, n.leftOff)) : C(n.a, I(i, n.rightOff)), l = gl * Math.max(s.body.wall.thickness, e.wall.thickness), a = pe(et(s), s.u, r, n.dir), c = pe(tt(s), s.u, r, n.dir);
    Be(a, s.p, l) && (s.body.c[s.leftKey] = a), Be(c, s.p, l) && (s.body.c[s.rightKey] = c);
  }
}
function Dd(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = gl * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = pe(tt(o), o.u, et(r), r.u);
    Be(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Nd(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = C(r, o), a = te(l, C(e, o)), c = te(l, C(s.far, o));
    a * c < 0 && Zi(s, [e]);
  }
}
function Zi(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Nd(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(te(o.u, r.u)) > 1e-9 || H(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], c = pe(tt(o), o.u, et(a), a.u), u = pe(et(r), r.u, et(a), a.u);
        if (!Be(c, e, n) || !Be(u, e, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, Zi(o, [e, d, u]);
      } else {
        const a = t[(s - 1 + i) % i], c = pe(et(r), r.u, tt(a), a.u), u = pe(tt(o), o.u, tt(a), a.u);
        if (!Be(u, e, n) || !Be(c, e, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, Zi(r, [u, d, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Ms(t) {
  const e = Od(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(Do(r, "a")), r.wall.b === i.id && s.push(Do(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? zd(s, o) : s.length >= 2 && Dd(s, { x: i.x, y: i.y });
  }
  return e;
}
function vl(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Ms(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: H(C(l, i.f.a), i.f.dir) });
    }
  return e;
}
function bl(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Xn(t) {
  return new Map(Ms(t).map((e) => [e.wall.id, bl(e)]));
}
function No(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(z(s, I(C(o, s), r / (r - l))));
  }
  return n;
}
function _s(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Ms(t)) {
    const s = bl(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, d) => u.offset - d.offset), r = (u) => H(C(u, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const u of o)
      l.push([a, u.offset]), a = Math.max(a, u.offset + u.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [u, d] of l) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = No(p, (f) => r(f) - u)), d < 1 / 0 && (p = No(p, (f) => d - r(f))), p.length >= 3 && Math.abs(ge(p)) > Ld && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const Ki = (t) => [t.map((e) => [e.x, e.y])];
function yl(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function $l(t, e) {
  return xl(e ? [..._s(t).values()].flat() : [...Xn(t).values()]);
}
function xl(t) {
  const e = t.map(Ki);
  if (e.length === 0) return [];
  let n;
  try {
    n = ml.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(yl));
}
const at = 1e-6, In = ["door", "gate", "wicket"], kl = (t) => t === "opening", Ml = (t) => t.passesLight ?? kl(t.kind), _l = (t) => t === "opening", Al = (t) => t.passesPir ?? _l(t.kind);
function Sl(t, e) {
  return t.offset < e.offset + e.width - at && e.offset < t.offset + t.width - at;
}
function Qn(t, e, n, i, s) {
  const o = Ye(t, e);
  return o === null || i <= 0 || n < -at || n + i > o + at ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && Sl(r, { offset: n, width: i }));
}
function pt(t, e) {
  return { ...t, openings: e };
}
function Td(t, e, n, i, s, o = {}) {
  const r = s ?? wn[n], l = i - r / 2;
  if (!Qn(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: Z(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return In.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: pt(t, [...t.openings, a]), openingId: a.id };
}
function El(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Qn(t, i.wallId, n, i.width, e) ? t : Yt(pt(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Vd(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Qn(t, i.wallId, i.offset, n, e) ? t : Yt(pt(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Hd(t, e) {
  return In.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Rd(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Yt(pt(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function Il(t, e) {
  return Yt(pt(t, t.openings.filter((n) => n.id !== e)));
}
function Yt(t) {
  return pt(t, t.openings.map((e) => {
    const n = Ye(t, e.wallId), i = n === null || e.offset < -at || e.offset + e.width > n + at || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && Sl(e, s));
    return { ...e, invalid: i };
  }));
}
const Cn = 1e-6;
function Cl(t, e) {
  return e.mode !== "none" && xs[t.kind].includes(e.mode);
}
function Pl(t, e, n) {
  if (n.mode === "none" || !Cl(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -rt || i > rt)) return !1;
  const s = Ye(t, n.wallId);
  return s !== null && n.offset >= -Cn && n.offset <= s + Cn;
}
function _e(t, e) {
  return { ...t, devices: e };
}
function To(t, e, n, i) {
  if (!Pl(t, e, n)) return { level: t, deviceId: null };
  const s = { id: Z(), name: i, placement: n, props: e, invalid: !1 };
  return { level: _e(t, [...t.devices, s]), deviceId: s.id };
}
function Ll(t, e) {
  const n = { id: Z(), name: e, placement: { mode: "none" }, props: ze("equipment", "free"), invalid: !1 };
  return { level: _e(t, [...t.devices, n]), id: n.id };
}
const Bd = ["power", "power_in", "power_out", "voltage"];
function Fd(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Bd.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const ft = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, Ol = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function zl(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function Dl(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = qn({ ...i, props: zl(i.props, "inverter", n), bindings: r });
  return _e(t, t.devices.map((a) => a === i ? l : a));
}
function Jn(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: zl(i.props, "controllable", n) };
  return _e(t, t.devices.map((o) => o === i ? s : o));
}
function Nl(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = ze("motion_sensor", Ht(e)), s = ze("motion_sensor", Ht(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function Pn(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !Pl(t, s.props, n)) return t;
  const o = Nl(s.props, s.placement.mode, n.mode);
  return Tl(_e(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function Xt(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? _e(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return qn({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Ud(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !al(i.props.kind) || i.props.kind === n) return t;
  const s = ze(n, Ht(i.placement.mode));
  if (!Cl(s, i.placement)) return t;
  const o = qn({ ...i, props: s });
  return _e(t, t.devices.map((r) => r === i ? o : r));
}
function jd(t, e) {
  return _e(t, t.devices.filter((n) => n.id !== e));
}
function Tl(t) {
  return _e(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = Ye(t, e.placement.wallId), i = n === null || e.placement.offset < -Cn || e.placement.offset > n + Cn;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function Vl(t) {
  const e = [];
  for (const n of $l(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Gi(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!lt(e, s)) continue;
    const o = Math.abs(ge(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const xi = 1e-3;
function Hl(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(ge(t)) - Math.abs(ge(e))) > xi ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= xi && Math.abs(n.y - i.y) <= xi));
}
const Rl = 2, Vo = Math.ceil(360 / Rl), Ho = 1e-4, Wd = 1e-9, Ro = 1e-9, qd = {
  light: Ml,
  motion: Al
};
function Bl(t, e) {
  const n = [];
  for (const i of xl([..._s(t, qd[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function As(t, e, n) {
  return e.filter(([i, s]) => me(t, i, s) <= n);
}
function ki(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Zd(t, e, n) {
  const i = As(t, e, n), s = [];
  for (let w = 0; w < Vo; w++) s.push(-Math.PI + 2 * Math.PI * w / Vo);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (L(t, g) > o) continue;
      const $ = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(ki($ - Ho), ki($), ki($ + Ho));
    }
  s.sort((w, g) => w - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    l[$] = w.x - t.x, a[$] = w.y - t.y, c[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const d = [], p = [];
  let f = NaN;
  for (const w of s) {
    if (w === f) continue;
    f = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let k = n, _ = -1;
    for (let E = 0; E < r; E++) {
      const O = g * u[E] - $ * c[E];
      if (Math.abs(O) < 1e-12) continue;
      const N = (l[E] * u[E] - a[E] * c[E]) / O;
      if (!(N > Wd && N < k)) continue;
      const U = (l[E] * $ - a[E] * g) / O;
      U < -Ro || U > 1 + Ro || (k = N, _ = E);
    }
    const x = { x: t.x + g * k, y: t.y + $ * k }, A = d.length;
    if (!(A > 0 && d[A - 1].x === x.x && d[A - 1].y === x.y)) {
      if (_ >= 0 && A >= 2 && p[A - 1] === _ && p[A - 2] === _) {
        d[A - 1] = x;
        continue;
      }
      d.push(x), p.push(_);
    }
  }
  const m = d[0], y = d[d.length - 1];
  return d.length > 1 && m.x === y.x && m.y === y.y && d.pop(), d;
}
const Kd = 32, Bo = 128;
function Ln(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function ke(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Ss(t) {
  return (t % 360 + 360) % 360;
}
function Fl(t) {
  return (t % 360 + 540) % 360 - 180;
}
function Ul(t, e, n, i) {
  const s = t.walls.find((c) => c.id === e);
  if (!s) return null;
  let o;
  try {
    o = J(t, s);
  } catch {
    return null;
  }
  const r = Y(o.dir), l = n === "left" ? r : I(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: z(z(o.a, I(o.dir, i)), I(l, a)), normal: l };
}
function Bt(t, e, n, i) {
  var s;
  return ((s = Ul(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Q(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Ln(n.rotation) };
  const i = Ul(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: z(i.pt, I(s, r)), dir: Y(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? Ln(ke(s) + n.aim) : s, normal: s };
}
function Fo(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let c;
    try {
      c = J(t, a);
    } catch {
      continue;
    }
    const u = a.a === n ? c.dir : I(c.dir, -1);
    if (Math.abs(te(i, u)) < 1e-9 && H(i, u) < 0) {
      if ((H(Y(c.dir), s) > 0 ? c.leftOff : c.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (H(u, s) > 1e-9) return !1;
  }
  return l;
}
function Es(t, e, n, i) {
  var U;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((D) => D.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = J(t, s);
  } catch {
    return n;
  }
  const r = vl(t), l = r.filter((D) => D.wallId === n.wallId && D.side === n.side), a = l.find((D) => D.end === "a"), c = l.find((D) => D.end === "b");
  if (!a || !c) return n;
  const u = Y(o.dir), d = n.side === "left" ? u : I(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, f = Fo(t, s, s.a, o.dir, d, p) ? -1 / 0 : a.offset, m = Fo(t, s, s.b, I(o.dir, -1), d, p) ? 1 / 0 : c.offset, y = (D) => H(C(D, o.a), o.dir), w = [];
  for (const D of t.nodes)
    if (((U = D.host) == null ? void 0 : U.wallId) === s.id)
      for (const T of t.walls) {
        const j = T.a === D.id ? "a" : T.b === D.id ? "b" : null, oe = j && t.nodes.find((Se) => Se.id === (j === "a" ? T.b : T.a));
        if (!oe || (H(C(oe, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const ye = r.filter((Se) => Se.wallId === T.id && Se.end === j).map((Se) => y(Se.pt));
        ye.length && w.push([Math.min(...ye), Math.max(...ye)]);
      }
  w.sort((D, T) => D[0] - T[0]);
  const g = [];
  let $ = f;
  for (const [D, T] of w) {
    const j = Math.min(D, m);
    j > $ && g.push([$, j]), $ = Math.max($, T);
  }
  m > $ && g.push([$, m]), g.length === 0 && g.push([f, m]);
  const k = ([D, T]) => Math.max(0, D - n.offset, n.offset - T), [_, x] = g.reduce((D, T) => k(T) < k(D) ? T : D), A = (e.shape === "circle" ? e.diameter : e.width) / 2, E = _ + A, O = x - A;
  let N = n.offset;
  return E > O ? N = (_ + x) / 2 : N <= E + i ? N = E : N >= O - i && (N = O), N = Math.max(0, Math.min(o.len, N)), Math.abs(N - n.offset) < 1e-9 ? n : { ...n, offset: N };
}
function jl(t, e) {
  const n = [];
  for (let i = 0; i < Bo; i++) n.push(z(t, I(Ln(360 * i / Bo), e)));
  return n;
}
function Uo(t, e, n, i) {
  if (n >= 360) return jl(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Kd)), o = ke(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(z(t, I(Ln(o + n * l / s), i)));
  return r;
}
const Gd = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function ei(t) {
  return Gd[t] ?? null;
}
const Yd = (t) => ei(t.kind) !== null;
function Xd(t, e) {
  const n = e.props;
  if (!Yd(n)) return null;
  const i = Q(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Uo(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Uo(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? jl(i.pt, n.poolRadius) : null;
  }
}
function Qd(t) {
  return t.normal ? z(t.pt, t.normal) : t.pt;
}
function jo(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Jd(t, e, n) {
  const i = C(e, t);
  for (const [s, o] of n) {
    const r = C(o, s), l = C(s, t), a = te(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = te(l, r) / a, u = te(l, i) / a;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const Wo = 0.5, eu = 3, tu = 1e-4;
function nu(t, e, n) {
  const i = Q(t, e);
  if (!i) return null;
  const s = Qd(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (x) => jo(x, n) || As(x, n, Wo).length > 0;
  if (!r(s)) return s;
  const l = J(t, t.walls.find((x) => x.id === o.wallId)), a = i.normal, c = (x) => Math.abs(H(C(x, i.pt), a)) <= tu, u = ([x, A]) => I(z(x, A), 0.5), d = n.filter((x) => c(x[0]) && c(x[1]) && L(x[0], x[1]) > 1e-9 && !jo(z(u(x), I(a, Wo)), n)), p = (x) => H(C(x, l.a), l.dir), f = ([x, A]) => Math.max(0, Math.min(p(x), p(A)) - o.offset, o.offset - Math.max(p(x), p(A))), m = Math.min(...d.map(f)), y = d.filter((x) => f(x) <= m + 1e-6).map((x) => z(u(x), a)), w = (x) => y.some((A) => !Jd(x, A, n)), g = eu * Math.max(...t.walls.map((x) => x.thickness)) + 2, $ = [];
  for (const [x, A] of n) {
    const E = C(A, x), O = C(x, s), N = te(l.dir, E);
    if (Math.abs(N) < 1e-12) continue;
    const U = te(O, l.dir) / N;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const D = te(O, E) / N, T = L(x, A) / Math.abs(N);
    $.push(D - T, D + T);
  }
  const k = o.offset <= l.len / 2 ? 1 : -1, _ = $.filter((x) => Math.abs(x) <= g).sort((x, A) => Math.abs(x) - Math.abs(A) || Math.sign(A) * k - Math.sign(x) * k);
  for (const x of _) {
    const A = z(s, I(l.dir, x));
    if (!r(A) && w(A)) return A;
  }
  return null;
}
const iu = 1 / Math.cos(Rl / 2 * (Math.PI / 180)), qo = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function su(t, e, n = Bl) {
  const i = Xd(t, e), s = ei(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = nu(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((d) => L(d, r))) * iu, a = As(r, o, l);
  if (a.length === 0) return [i];
  const c = Zd(r, a, l);
  let u;
  try {
    u = ml.intersection(Ki(qo(i)), Ki(qo(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(yl));
}
function ou(t, e, n, i) {
  const s = Q(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, H(C(n, s.pt), s.dir)));
    return L(z(s.pt, I(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return L(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return L(s.pt, n) <= i;
  if (o.shape === "circle") return L(s.pt, n) <= o.diameter / 2 + i;
  const r = C(n, s.pt);
  return Math.abs(H(r, s.dir)) <= o.width / 2 + i && Math.abs(H(r, Y(s.dir))) <= o.depth / 2 + i;
}
function Wl(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && ou(t, i[o], e, n)) return i[o].id;
  return null;
}
const ru = 60;
function Yi(t, e, n) {
  if (!dl.has(e.props.kind)) return null;
  const i = Q(t, e);
  return i ? { from: i.pt, to: z(i.pt, I(i.dir, ru / n)) } : null;
}
function ql(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function lu(t, e, n, i) {
  const s = e.placement, o = Q(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = ke(C(n, o.pt)), l = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: Ss(l(r)) };
  const a = Fl(r - ke(o.normal)), c = Math.max(-rt, Math.min(rt, l(a)));
  return ql(s, c);
}
const au = 1, On = 1, Zo = 1e-6, cu = 1e-9, du = 1e-6, uu = 1;
function Is(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = Ye(t, e.wallId);
      return n === null ? null : Bt(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function ne(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => Is(t, i) ?? { x: i.x, y: i.y });
}
function Cs(t, e) {
  const n = ne(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(ge(n)) / 1e5) / 10;
}
function At(t, e, n) {
  const i = te(C(e, t), C(n, t));
  return Math.abs(i) <= cu * L(t, e) * L(t, n) ? 0 : Math.sign(i);
}
const nn = (t, e, n) => H(C(e, t), C(n, t)) <= 0;
function Zl(t, e, n, i) {
  const s = At(n, i, t), o = At(n, i, e), r = At(t, e, n), l = At(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && nn(n, t, e) || l === 0 && nn(i, t, e) || s === 0 && nn(t, n, i) || o === 0 && nn(e, n, i);
}
function pu(t) {
  const e = [];
  for (const n of t) (e.length === 0 || L(e[e.length - 1], n) > Zo) && e.push(n);
  for (; e.length > 1 && L(e[0], e[e.length - 1]) <= Zo; ) e.pop();
  return e;
}
function zn(t) {
  const e = pu(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (At(s, o, r) === 0 && H(C(o, s), C(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && Zl(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function Kl(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Is(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = Ye(t, o.wallId);
    return r !== null && (o.offset < -On || o.offset > r + On);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = ne(t, e);
  return Math.abs(ge(s)) < uu || zn(s) ? "crossing" : null;
}
function ht(t, e) {
  return lt(e, t) || t.some((n, i) => me(e, n, t[(i + 1) % t.length]) <= au);
}
const Gl = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function fu(t, e) {
  const n = Q(t, e);
  return n ? t.zones.filter((i) => ht(ne(t, i), n.pt)).map((i) => ({ zone: i, participates: Gl(e, i.id) })) : [];
}
function Ps(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = ne(t, n), s = [];
  for (const o of t.devices) {
    const r = Q(t, o);
    r && ht(i, r.pt) && s.push({ device: o, participates: Gl(o, e) });
  }
  return s;
}
function hu(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = ge(t);
  if (Math.abs(n) > du) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, s += (l.y + a.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (lt(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const Mi = 32;
function Ko(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, me(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function Yl(t) {
  const e = t.zones.map((s) => ne(t, s)), n = e.map((s) => Math.abs(ge(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter((y, w) => w !== o && y.length >= 3 && n[w] < n[o] && y.every((g) => ht(r, g))), a = hu(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const c = r.map((y) => y.x), u = r.map((y) => y.y), d = Math.min(...c), p = Math.min(...u), f = Math.max(Math.max(...c) - d, Math.max(...u) - p) / Mi;
    let m = null;
    for (let y = d + f / 2; y < d + f * Mi; y += f)
      for (let w = p + f / 2; w < p + f * Mi; w += f) {
        const g = { x: y, y: w };
        if (!lt(g, r) || l.some((k) => lt(g, k))) continue;
        const $ = Math.min(Ko(g, [r]), Ko(g, l));
        (!m || $ > m.d) && (m = { p: g, d: $ });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const Ls = 3, ct = (t, e) => ({ ...t, zones: e }), Ft = (t, e, n) => ct(t, t.zones.map((i) => i === e ? n : i)), Os = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), Xl = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function mu(t, e) {
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
function gu(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && Xl(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => mu(n, e.vertices[i]));
}
function Ql(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && gu(t.shape, e.shape);
}
function wu(t, e) {
  if (e.kind === "free") return e;
  const n = Is(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : Os(e);
}
function Jl(t, e) {
  const n = e.shape, i = n.vertices.map((s) => wu(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function vu(t, e, n) {
  const i = t.shape, s = Gi(e, i.seed);
  return !s || n.some((o) => Hl(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && Xl(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function ea(t, e) {
  const n = Kl(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const zs = (t, e) => ea(t, Jl(t, e));
function bu(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? Vl(t) : [], i = [], s = e.map((o) => ea(
    t,
    o.shape.kind === "walls" ? vu(o, n, i) : Jl(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? ct(t, s) : t;
}
function yu(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && Ql(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : ct(t, i) : s.some((o, r) => o !== n[r]) ? ct(t, s) : t;
}
function $u(t, e, n) {
  const i = Vl(t), s = Gi(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = Gi(i, r.shape.seed);
    if (l && Hl(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: Z(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: ct(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const Ds = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function xu(t, e, n) {
  if (e.length < Ls) return { level: t, zoneId: null };
  const i = zs(t, { id: Z(), name: n, shape: { kind: "polygon", vertices: e.map(Ds) }, invalid: !1 });
  return zn(ne(t, i)) ? { level: t, zoneId: null } : { level: ct(t, [...t.zones, i]), zoneId: i.id };
}
function ku(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : Ft(t, i, { ...i, name: n });
}
function Ns(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return Ft(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return Ft(t, i, o);
}
function ta(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function na(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? ta(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function Ts(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function Vs(t, e, n) {
  const i = zs(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return Ql(i, e) ? t : Ft(t, e, i);
}
const Hs = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function Mu(t, e, n, i) {
  const s = Ts(t, e);
  return !s || !Hs(n, s.shape.vertices.length) ? t : Vs(t, s, s.shape.vertices.map((o, r) => r === n ? Ds(i) : o));
}
function _u(t, e, n, i) {
  const s = Ts(t, e);
  if (!s || !Hs(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, Ds(i)), Vs(t, s, o);
}
function Au(t, e, n) {
  const i = Ts(t, e);
  return !i || i.shape.vertices.length <= Ls || !Hs(n, i.shape.vertices.length) ? t : Vs(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function Su(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < Ls) return t;
  const i = n.shape.outline.map(Os);
  return Ft(t, n, zs(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function ia(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = ta(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const Ut = 1;
function be(t) {
  return structuredClone(t);
}
function ti(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Eu(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function ni(t, e, n) {
  const i = q(t, e.a), s = q(t, e.b), o = L(i, s), r = Eu(typeof n == "number" ? n : Gn(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : fl(i, s, r / o), offset: r };
}
function Iu(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = ni(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function sa(t, e) {
  Iu(t), e && Ou(e, t);
  const n = bu(Tl(Yt(t)));
  return e ? yu(n, e) : n;
}
function Ae(t, e) {
  return sa(be(t), e);
}
function oa(t, e, n) {
  const i = Yn(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = ni(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Go(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: q(t, e.nodeId), nodeId: e.nodeId };
  const n = ti(t, e.wallId), { pt: i, offset: s } = ni(t, n, e.offset), o = L(q(t, n.a), q(t, n.b));
  return s <= Ut ? { pt: q(t, n.a), nodeId: n.a } : o - s <= Ut ? { pt: q(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function Yo(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: Z(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Cu(t, e, n, i) {
  const s = Go(t, e), o = Go(t, n);
  if (L(s.pt, o.pt) < Ut) return { level: t, wallId: null, endNodeId: null };
  const r = be(t), l = Yo(r, s), a = Yo(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: Z(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Ae(r, t), wallId: c.id, endNodeId: a };
}
function ra(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < Ut || a - l < Ut ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function Pu(t, e, n, i, s) {
  const o = ra(e, n, i.thickness, s);
  if (!o) return t;
  const r = be(t), l = o.map((a) => {
    const c = { id: Z(), x: a.x, y: a.y };
    return r.nodes.push(c), c.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: Z(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Ae(r, t);
}
function Lu(t, e, n) {
  const i = be(t);
  return oa(i, e, n), sa(i, t);
}
function Ou(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const s = t.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = t.nodes.find((d) => d.id === s.a), r = t.nodes.find((d) => d.id === s.b), l = e.nodes.find((d) => d.id === i.a), a = e.nodes.find((d) => d.id === i.b);
    if (!o || !r || !l || !a || o.x === l.x && o.y === l.y) continue;
    const c = L(l, a);
    if (c === 0) continue;
    const u = Kn(C(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = Gn(z(o, I(u, d.offset)), l, a) * c);
  }
}
function zu(t, e, n) {
  const i = be(t), s = ti(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: z(q(i, l), n) }));
  for (const l of r) oa(i, l.id, l.to);
  return Ae(i, t);
}
function ii(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function la(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function Du(t, e, n) {
  const i = be(t), s = ti(i, e), o = s[n], r = q(i, o), l = { id: Z(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || la(i, o, l.id), ii(i), { level: Ae(i, t), nodeId: l.id };
}
function Nu(t, e, n) {
  if (e === n) return t;
  const i = be(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return la(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), ii(i), Ae(i, t);
}
function Rs(t, e) {
  var i;
  const n = be(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return ii(n), Ae(n, t);
}
function Tu(t, e, n) {
  const i = be(t);
  return Object.assign(ti(i, e), n), Ae(i, t);
}
const re = (t) => typeof t == "string" && t !== "" ? t : null, aa = (t) => t.split(".")[0], Vu = ["friendly_name", "device_class", "unit_of_measurement"];
function ca(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: aa(t),
    name: re(n.friendly_name) ?? t,
    deviceClass: re(n.device_class),
    unit: re(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Hu(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, ca(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Ru(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && Vu.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function da(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Bu(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = ca(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: re(r.name) ?? re(r.original_name) ?? l.name,
      deviceId: re(r.device_id),
      areaId: re(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: re(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: re(r.name_by_user) ?? re(r.name) ?? r.id, model: re(r.model), areaId: re(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Fu(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function ua(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : da(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Uu = {
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
  "rules.flow.title": "Rule flowchart",
  "rules.flow.result": "Result",
  "rules.flow.delay": "delay on {on} s, off {off} s",
  "rules.flow.pending": "{to} in {n} s",
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
function h(t) {
  return Uu[t] ?? t;
}
const ju = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Wu = 10;
function mt(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return ft(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function pa() {
  return { blocks: [{ id: Z(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function qu(t, e, n, i) {
  const s = { id: Z(), x: e.x, y: e.y }, o = { ...s, name: `${h(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function Xo(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function si(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Zu(t, e, n, i) {
  return si(t, e, (s) => ({ ...s, x: n, y: i }));
}
const Xi = (t) => "block" in t ? t.block : t.bus, fa = (t, e) => Xi(t.from) === e || Xi(t.to) === e;
function jt(t, e, n, i) {
  const s = t.blocks.find((c) => c.id === e);
  if (!s) return t;
  const o = si(t, e, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !fa(c, e)) };
  const r = o.blocks.find((c) => c.id === e), l = new Set(mt(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return o.wires.some((c) => a(c.from) || a(c.to)) ? { ...o, wires: o.wires.filter((c) => !a(c.from) && !a(c.to)) } : o;
}
function ha(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !fa(i, e)) };
}
const ma = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function oi(t, e, n) {
  const i = ma(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(mt(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = t.wires.filter((c) => !o(c.from) && !o(c.to));
  let l = !1;
  const a = t.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((m) => u.has(m))) return c;
    l = !0;
    const d = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => u.has(m))), { portPins: p, ...f } = c;
    return Object.keys(d).length ? { ...f, portPins: d } : f;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Ku(t, e) {
  const n = Bs(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = oi(s, o, n);
  return s;
}
function Gu(t, e) {
  const n = ma(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(Xi(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const Bs = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function ga(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = jd(t, n);
  return { level: s, power: i ? Gu(e, n) : oi(e, n, Bs(s)) };
}
function wa(t, e, n, i) {
  const s = Dl(t, n, i);
  return { level: s, power: s === t ? e : oi(e, n, Bs(s)) };
}
function va(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Yu(t, e, n, i) {
  return si(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function Xu(t, e) {
  return si(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function Qo(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Qu(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, Wu), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((u, d) => r.set(u.id, o & 1 << d ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (u) => {
      let d = u;
      for (; l.has(d) && l.get(d) !== d; ) d = l.get(d);
      return d;
    }, c = (u, d) => {
      if ("bus" in u) return `n:${u.bus}`;
      const p = s.get(u.block);
      return p !== void 0 && u.port !== p && u.port !== (r.get(u.block) ?? "A") ? `x:${d.id}:${u.port}` : `n:${u.block}`;
    };
    for (const u of e) {
      const d = a(c(u.from, u)), p = a(c(u.to, u));
      if (d === p) return !0;
      l.set(d, p);
    }
  }
  return !1;
}
function Jo(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const _ = s.get(g.bus);
      return _ && _.kind === "bus" ? { bl: _, dir: null } : null;
    }
    const $ = s.get(g.block), k = $ ? mt($, i).find((_) => _.name === g.port) : void 0;
    return $ && k ? { bl: $, dir: k.dir } : null;
  }, r = o(e), l = o(n);
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
  const u = (g) => "block" in g && t.wires.some(($) => [$.from, $.to].some((k) => "block" in k && k.block === g.block && k.port === g.port));
  if (u(a) || u(c)) return { error: "port-taken" };
  const d = (g) => {
    for (const $ of t.wires)
      for (const [k, _] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in k && k.bus === g && "block" in _) {
          const x = s.get(_.block);
          if (x) return Qo(x, _.port);
        }
    return null;
  }, p = (g) => "bus" in g ? d(g.bus) : Qo(s.get(g.block), g.port), f = p(a), m = p(c);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && s.get(c.block).kind === "remainder" && t.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const y = { id: Z(), from: a, to: c }, w = [...t.wires, y];
  return Qu(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: y };
}
const $e = (t) => typeof t == "object" && t !== null && !Array.isArray(t), st = (t) => typeof t == "number" && Number.isFinite(t), Ju = ["top", "right", "bottom", "left"], ep = ["2in1out", "1in2out"];
function tp(t, e) {
  let n = t;
  if (n.kind === "bus" && !(st(n.w) && st(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !ep.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(mt(n, e).map((c) => c.name)), o = {};
  let r = $e(i);
  for (const [c, u] of $e(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !$e(u) || !Ju.includes(u.side) || !st(u.at)) {
      r = !1;
      continue;
    }
    const d = Math.min(1, Math.max(0, u.at));
    d !== u.at && (r = !1), o[c] = d === u.at ? u : { side: u.side, at: d };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(o).length ? { ...a, portPins: o } : a;
}
function np(t, e) {
  if (!$e(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if ($e(u) && typeof u.id == "string" && u.id && ju.includes(u.kind) && st(u.x) && st(u.y)) {
      const d = tp(u, e);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const l = new Map(o.map((u) => [u.id, u])), a = (u) => {
    var p;
    if (!$e(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = l.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !st(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const d = typeof u.block == "string" ? l.get(u.block) : void 0;
    return d && !r.has(d.id) && mt(d, e).some((f) => f.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = $e(u) ? a(u.from) : null, p = $e(u) ? a(u.to) : null;
    if (!$e(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...t, blocks: o, wires: c } : t;
}
function ba(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function ip(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Qt = 11, Dn = 18, Nn = 30, sp = 12, op = 120, se = 14, er = 10, Wt = (t) => Math.round(t / er) * er || 0, _i = 24, tr = 6, rp = 2 * Qt + 6, lp = se, ap = 1e6, nr = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, ri = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Ai = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, ya = (t) => Math.min(1, Math.max(0, t));
function li(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function cp(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = ft(i);
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
function we(t, e, n) {
  return n ? js(n, t, e).r : Fs(t, e);
}
function Fs(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(op, 7 * li(t, e).length + 32),
    h: Nn + Dn * cp(t, e) + sp
  };
}
function Tn(t, e, n) {
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
function dp(t, e) {
  const n = ri(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function up(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = me(e, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: ya(r) };
}
const qt = (t) => t.w >= t.h;
function $a(t, e) {
  return qt(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function pp(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = qt(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Tn(i, r, 0.5), side: r };
  }
  const s = ri(i), o = qt(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: Tn(i, o, e), side: o };
}
function fp(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const Us = (t, e) => t.blocks.find((n) => n.id === e), Qi = (t, e) => {
  const n = Us(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Si = (t, e, n) => "block" in t && t.block === e && t.port === n;
function hp(t, e, n, i) {
  const s = t.wires.find((l) => Si(l.from, e, n) || Si(l.to, e, n));
  if (!s) return null;
  const o = Si(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = Qi(t, o.bus);
    return l ? $a(l, o.at) : null;
  }
  const r = Us(t, o.block);
  return r ? ri(Fs(r, i)) : null;
}
function js(t, e, n) {
  const i = Fs(e, n), s = ri(i), o = mt(e, n).map((c) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = hp(t, e.id, c.name, n), p = (d && dp(i, d)) ?? fp(e, c), f = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * rp : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (a[u] = { name: c.name, dir: c.dir, side: c.side, pt: Tn(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, f) => {
      a[p] = { name: d.name, dir: d.dir, side: c, pt: Tn(l, c, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function ai(t, e, n) {
  return js(t, e, n).places;
}
function xa(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = Us(t, c.block);
    if (!u) return null;
    const { r: d, places: p } = js(t, u, n), f = p.find((m) => m.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = Qi(t, c.bus);
    if (!p) return null;
    let f = d == null ? void 0 : d.pt;
    if (!f && "bus" in u) {
      const m = Qi(t, u.bus);
      f = m && $a(m, u.at);
    }
    return f ? { ...pp(p, c.at, f), rect: we(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const sn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Ji = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function mp(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = sn(i[i.length - 2], a), u = sn(a, l);
        if (c.x === u.x && c.y === u.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (c.x === -u.x && c.y === -u.y) return null;
      }
      i.push(l);
    }
  }
  const s = i.length;
  if (s < 2 || s > 6) return null;
  const o = sn(i[0], i[1]), r = sn(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || Ji(i[0], i[1]) < se - 1e-9 || r.x !== -n.x || r.y !== -n.y || Ji(i[s - 2], i[s - 1]) < se - 1e-9 ? null : i;
}
function gp(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function wp(t, e) {
  let n = (t.length - 2) * lp;
  for (let i = 1; i < t.length; i++) {
    n += Ji(t[i - 1], t[i]);
    for (const s of e) gp(t[i - 1], t[i], s) && (n += ap);
  }
  return n;
}
function ka(t, e) {
  const n = t.pt, i = e.pt, s = nr[t.side], o = nr[e.side], r = { x: n.x + s.x * se, y: n.y + s.y * se }, l = { x: i.x + o.x * se, y: i.y + o.y * se }, a = [t.rect, e.rect].filter((k) => !!k), c = (k, _) => [.../* @__PURE__ */ new Set([
    (r[k] + l[k]) / 2,
    r[k],
    l[k],
    n[k],
    i[k],
    ...a.flatMap((x) => [x[k] - se, x[k] + x[_] + se]),
    Math.min(r[k], l[k]) - se,
    Math.max(r[k], l[k]) + se
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, f = o.x === 0, m = (p ? d : u).filter((k) => (k - (p ? n.y : n.x)) * (p ? s.y : s.x) >= se - 1e-9), y = (f ? d : u).filter((k) => (k - (f ? i.y : i.x)) * (f ? o.y : o.x) >= se - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (k) => {
    const _ = mp(k, s, o);
    if (!_) return;
    const x = wp(_, a);
    x < g - 1e-6 && (w = _, g = x);
  };
  if (p && f)
    for (const k of m) for (const _ of u) for (const x of y)
      $([n, { x: n.x, y: k }, { x: _, y: k }, { x: _, y: x }, { x: i.x, y: x }, i]);
  else if (!p && !f)
    for (const k of m) for (const _ of d) for (const x of y)
      $([n, { x: k, y: n.y }, { x: k, y: _ }, { x, y: _ }, { x, y: i.y }, i]);
  else if (p)
    for (const k of m) for (const _ of y)
      $([n, { x: n.x, y: k }, { x: _, y: k }, { x: _, y: i.y }, i]);
  else
    for (const k of m) for (const _ of y)
      $([n, { x: k, y: n.y }, { x: k, y: _ }, { x: i.x, y: _ }, i]);
  return w ?? [n, r, p ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Ma(t, e, n) {
  const i = we(t, e, n), s = i.x + (i.w - (3 * _i + 2 * tr)) / 2, o = i.y + Nn + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (_i + tr), y: o, w: _i, h: Dn - 2 }
  }));
}
function vp(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return qt(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function ir(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = Ma(u, i, t).find((p) => Ai(e, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of ai(t, u, i)) {
      const p = L(e, d.pt);
      p <= Qt + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const f of vp(u)) {
      const m = me(e, f.a, f.b);
      m <= n && m < p && (d = { kind: "bus-end", id: u.id, end: f.end }, p = m);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !Ai(e, we(u, i, t), n)) continue;
    const d = qt(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: ya(d) };
  }
  let l = null, a = 1 / 0;
  for (const u of t.wires) {
    const d = xa(t, u, i);
    if (!d) continue;
    const p = ka(d.a, d.b);
    for (let f = 1; f < p.length; f++) {
      const m = me(e, p[f - 1], p[f]);
      m <= n && m < a && (l = { kind: "wire", id: u.id }, a = m);
    }
  }
  if (l) return l;
  const c = s.find((u) => u.kind !== "bus" && Ai(e, we(u, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function bp(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = we(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class _a extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function Ei(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function yp(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function $p(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new _a(s.message) : s;
  }
}
async function xp(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const kp = 3;
function fe(t) {
  if (typeof t == "number")
    return t === kp ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class Mp {
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
    const i = { ...e, id: Z(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await $p(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof _a ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = fe(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ee = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ci = (t) => (...e) => ({ _$litDirective$: t, values: e });
let di = class {
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
const Aa = (t) => t.strings === void 0, _p = {}, Ws = (t, e = _p) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ap = ci(class extends di {
  constructor() {
    super(...arguments), this.key = b;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (Ws(t), this.key = e), n;
  }
});
var Sa = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Sp = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Ep = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Ip = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Cp = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Pp = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Lp = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", sr = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", vt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Op = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", zp = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Dp = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Np = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Tp = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Vp = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Hp = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Rp = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Bp = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Fp = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Up = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", jp = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Wp = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Ea = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", qp = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Ia = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Zp = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Kp = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Gp = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Yp = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Xp = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Qp = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Jp = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", ef = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", Ca = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", tf = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function Pa(t, e, n) {
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
function nf(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function sf(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function of(t, e, n, i, s) {
  const o = sf(e, n, i, s);
  if (!o.every((l) => ht(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, me(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function rf(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? nf(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const p of t.zones) {
    const f = ne(t, p);
    if (f.length < 3 || !ht(f, n.pt)) continue;
    const m = Math.abs(ge(f));
    m < a && (a = m, l = f);
  }
  if (!l) return r;
  const c = (p) => {
    const f = Pa(p, i, s);
    return of(l, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, u = (p) => {
    let f = null, m = -1;
    for (const y of p) {
      const w = c(y);
      w !== null && w > m && (f = y, m = w);
    }
    return f;
  }, d = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const p = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = d.filter((y) => p ? y.startsWith(r) : y.endsWith(r));
    return u(m) ?? u(p ? ["right", "left"] : ["down", "up"]) ?? (c(f) !== null ? f : r);
  }
  return u(["right", "left"]) ?? u(d) ?? u(["down", "up"]) ?? r;
}
const ie = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function he(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function La(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${h("unit.m2")}`;
}
const Jt = 12, F = "non-scaling-stroke", lf = 7, af = 10, Vn = "#f43f5e", or = "3 2", rr = 18, cf = 6, lr = 11, df = 0.6, uf = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Oa = 24, on = 4, ar = 4, bn = Jt * 0.85, pf = 0.58;
function ff(t, e, n, i) {
  const s = Oa;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], u = a * i - 2 * ar, d = c * i - 2 * ar, p = e.length * pf * bn, f = s + on + bn, m = s + on + p, y = Math.max(s, p), w = (_, x) => Math.max(0, _ - u) + Math.max(0, x - d), g = w(y, f), $ = w(m, s);
  if (g > 0 && $ < g) {
    const _ = -m / 2;
    return {
      mode: "line",
      iconX: (_ + s / 2) / i,
      iconY: 0,
      labelX: (_ + s + on) / i,
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
    labelY: (k + s + on + bn / 2) / i,
    labelAnchor: "middle"
  };
}
function hf(t, e, n, i = 0, s = 0) {
  const o = Oa / e;
  return customElements.get("ha-icon") ? M`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : M`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${uf} fill=${n}></path></g>`;
}
const mf = "__preview__", gf = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, wf = /* @__PURE__ */ new WeakMap();
function vf(t, e) {
  var s;
  const n = he(wf, t.walls, () => /* @__PURE__ */ new WeakMap()), i = he(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = he(i, t.openings, () => ({})))[e] ?? (s[e] = Bl(t, e));
}
const bf = /* @__PURE__ */ new WeakMap();
function za(t, e) {
  const n = ei(e.props.kind);
  if (!n) return [];
  const i = vf(t, n), s = he(bf, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = su(t, e, () => i), s.set(e, o)), o;
}
function Hn(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function yf(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = s ?? b;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? M`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>` : l.shape === "spot" ? M`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${F}></circle>` : M`<circle class="icon" r=${Hn(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>`;
    case "wall_light":
      return M`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "motion_sensor": {
      const u = (d) => `M${e * d} ${-e * d * 0.8}A${e * d} ${e * d * 0.8} 0 0 1 ${e * d} ${e * d * 0.8}`;
      return M`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let d = 0; d < 8; d++) {
        const p = d * Math.PI / 4;
        u += `M${Math.cos(p) * e * 1.15} ${Math.sin(p) * e * 1.15}L${Math.cos(p) * e * 1.6} ${Math.sin(p) * e * 1.6}`;
      }
      return M`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "wall_switch":
      return M`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></rect>`;
    case "valve":
      return M`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${F}></path>`;
    case "leak_sensor":
      return M`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${F}></path>`;
    case "smart_button":
      return M`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${F}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return M`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return M`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let d = 0; d < 4; d++) {
        const p = d * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * e * 0.85} ${Math.sin(p) * e * 0.85}`;
      }
      return M`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${F}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    default:
      return M`${b}`;
  }
}
function $f(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return M`${b}`;
  const l = ff(r, r.label, i, e.scale), a = o ?? b, c = r.shape === "circle" ? M`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${F}></circle>
      ${s ? M`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : b}` : M`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${F}></rect>
      ${s ? M`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : b}`;
  return M`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${hf(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${bn / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function xf(t, e, n = 0) {
  return t === "bound" ? b : M`<circle class=${`bind-ring bind-${t}`} r=${Math.max(Jt * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${gf[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : b} vector-effect=${F}></circle>`;
}
function kf(t, e, n) {
  if (t.status !== "error") return b;
  const i = e * 0.9, s = -e * 0.9, o = af / n.scale;
  return M`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${lf / n.scale} fill=${n.palette.background} stroke=${Vn} stroke-width="1.5"
      vector-effect=${F}></circle>
    <path d=${Sa} fill=${Vn} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function Mf(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? Vn : t === "event" ? e.selection : e.device;
}
function _f(t, e, n, i, s, o) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return b;
  const l = 1 / o.scale, a = r.map(([w]) => (w.text.length * lr * df + 2 * cf) * l), c = rr * l, u = (rr + 2) * l, d = { w: Math.max(...a), h: c + u * (r.length - 1) }, p = s + 4 * l, f = Math.max(1, i.shown.length), m = rf(t, e, n, { w: Math.max(...a.slice(0, f)), h: c + u * (f - 1) }, p), y = Pa(m, d, p);
  return M`${r.map(([w, g], $) => {
    const k = a[$], _ = y.x + (d.w - k) / 2, x = y.y + (m.startsWith("up") ? r.length - 1 - $ : $) * u, A = Mf(w.tone, o.palette);
    return Ap(`${g}:${w.key ?? ""}`, M`<g class=${`bubble ${g}`} data-tone=${w.tone}>
      <rect x=${_} y=${x} width=${k} height=${c} rx=${c / 2} fill=${o.palette.background} stroke=${A} stroke-width="1.5"
        vector-effect=${F}></rect>
      <text x=${_ + k / 2} y=${x + c / 2} text-anchor="middle" dominant-baseline="central" fill=${A} font-weight="700"
        font-size=${lr * l} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function Af(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Hn(t, Jt / e.scale);
}
function Sf(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? _f(t, e, n, s, Af(e, i), i) : b;
  return o === b ? b : M`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : b}>${o}</g>`;
}
function Ef(t, e, n, i) {
  var k, _, x;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = Jt / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((k = n.selection) == null ? void 0 : k.kind) === "device" && n.selection.id === t.id, c = !i && Zn(t.props.kind), u = c ? (_ = n.containerState) == null ? void 0 : _.call(n, t) : void 0, d = i || (x = n.live) == null ? void 0 : x.call(n, t), p = (d == null ? void 0 : d.look) === "on" || (d == null ? void 0 : d.look) === "active", f = c && !!n.containerState && !u || (d == null ? void 0 : d.look) === "no-data", m = t.props.kind, y = !p || t.invalid ? o : m === "leak_sensor" ? Vn : m === "motion_sensor" ? s.motionCone : o, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : b, $ = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Hn(t, r));
  return M`
    <g class=${w} data-id=${t.id} opacity=${g} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? M`<circle class="selection-ring" r=${$ + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${F}></circle>` : b}
      ${t.props.kind === "equipment" ? $f(t, n, o, l, p, f ? or : void 0) : M`<g transform=${`rotate(${l})`}>${yf(
    t,
    r,
    y,
    p ? y : s.deviceFill,
    f ? or : void 0,
    p ? s.deviceFill : y,
    (d == null ? void 0 : d.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? xf(n.bindingStatus(t), n.scale, Hn(t, r)) : b}
      ${u ? kf(u, r, n) : b}
    </g>`;
}
function cr(t, e, n, i) {
  const s = za(t, e);
  if (s.length === 0) return b;
  const o = n.palette, r = e.invalid ? o.invalid : ei(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : b, a = s.map(ie).join("");
  return e.props.kind === "ceiling_light" ? M`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${F}></path>` : M`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${F}></path>`;
}
function If(t, e, n, i) {
  const s = za(t, e);
  let o = 0;
  for (const c of s) for (const u of c) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = Jt * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : b;
  return M`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? M`<path class="light-fill" d=${s.map(ie).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : M`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Cf(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return b;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? Yi(t, i, e.scale) : null;
  if (!s) return b;
  const o = e.palette.selection;
  return M`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : b}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${F}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${F} style="cursor:grab"></circle>
  </g>`;
}
function Pf(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = Q(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: mf, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = Q(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return M`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return b;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? If(t, i.d, i.pose, e) : b : o === "motion_sensor" && s === "active" ? cr(t, i.d, e, !1) : b;
    }
    return cr(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Ef(i.d, i.pose, e, i.preview))}</g>
    ${Cf(t, e)}
    ${e.bubbles ? M`<g class="bubbles">${n.map((i) => i.preview ? b : Sf(t, i.d, i.pose, e))}</g>` : b}`;
}
const dr = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], qs = (t) => dr[t % dr.length], Ze = "non-scaling-stroke", Lf = "0.55", Of = /* @__PURE__ */ new WeakMap();
function zf(t, e, n, i) {
  const s = i.palette, o = qs(n), r = i.selectedId === e.id, l = he(Of, t, Yl).get(e.id), a = 12 / i.scale;
  return M`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${ie(ne(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? b : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${Ze}
        opacity=${i.selectedId !== null && !r ? Lf : b}></path>
      ${l ? M`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${La(Cs(t, e))}</tspan>
      </text>` : b}
    </g>`;
}
function Df(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return M`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => M`
      <path class="zone" data-id=${o.id} d=${ie(ne(t, o))} fill="none" stroke=${qs(r)} stroke-width="1"
        vector-effect=${Ze}></path>`)}</g>`;
  const s = 8 / e.scale;
  return M`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => zf(t, o, r, e))}</g>`;
}
function Nf(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return M`<g class="zone-members">${Ps(t, e).map(({ device: o, participates: r }) => {
    const l = Q(t, o);
    return l ? r ? M`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${Ze}></circle>` : M`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${Ze}></circle>` : b;
  })}</g>`;
}
function Tf(t, e, n) {
  if (e.shape.kind !== "polygon") return b;
  const i = n.palette, s = e.shape.vertices;
  return M`${ne(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return M`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${Ze}></circle>`;
  })}`;
}
function Vf(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return M`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${Ze}></polyline>`;
}
function Hf(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return M`<g class="zone-overlay">
    ${n ? M`<path class="zone-outline" data-id=${n.id} d=${ie(ne(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${Ze}></path>` : b}
    ${n ? Nf(t, n.id, e) : b}
    ${n ? Tf(t, n, e) : b}
    ${e.draft ? Vf(e.draft, e) : b}</g>`;
}
function je(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Rf = /* @__PURE__ */ new WeakMap(), Bf = /* @__PURE__ */ new WeakMap(), Da = /* @__PURE__ */ new WeakMap();
function ui(t, e, n) {
  const i = Y(t.dir), s = z(t.a, I(t.dir, e)), o = z(t.a, I(t.dir, n));
  return [z(s, I(i, t.leftOff)), z(o, I(i, t.leftOff)), C(o, I(i, t.rightOff)), C(s, I(i, t.rightOff))];
}
function Zt(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = J(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const W = "non-scaling-stroke";
function Ff(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = Zt(t, l.id);
    if (!a) continue;
    const c = Y(a.dir);
    for (const [u, d, p] of [[l.a, a.a, a.dir], [l.b, a.b, I(a.dir, -1)]]) {
      const f = t.nodes.find((x) => x.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const m = z(d, I(c, a.leftOff + i)), y = C(d, I(c, a.rightOff + i)), w = I(c, 1), g = I(z(m, y), 0.5), $ = z(C(g, I(w, -o)), I(p, s / 2)), k = C(C(g, I(w, o)), I(p, s / 2)), _ = [m, $, k, y];
      r.push(M`<path class="wall-break" d=${`M${_.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${W}></path>`);
    }
  }
  return r.length ? M`${r}` : b;
}
function Uf(t, e, n) {
  const i = Y(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : I(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = z(z(t.a, I(t.dir, l)), I(o, r)), u = z(z(t.a, I(t.dir, a)), I(o, r)), d = z(c, I(o, e.width)), p = te(C(d, c), C(u, c)) > 0 ? 1 : 0;
  return M`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>
    <path d=${`M${d.x} ${d.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${W}></path>`;
}
function jf(t, e, n) {
  const i = Y(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = z(z(t.a, I(t.dir, e.offset)), I(i, r)), a = z(z(t.a, I(t.dir, e.offset + e.width)), I(i, r));
    return M`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>`;
  });
  return M`${o}`;
}
function Wf(t, e, n) {
  const i = Zt(t, e.wallId);
  if (!i) return b;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = ui(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return M`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${ie(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Uf(i, e, o) : e.kind === "window" ? jf(i, e, o) : b}
    </g>`;
}
function ur(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = z(t, I(n, i)), a = z(e, I(n, i)), c = (d, p) => {
    const f = z(p, I(n, i + r));
    return M`<line x1=${d.x} y1=${d.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${W}></line>`;
  }, u = z(I(z(l, a), 0.5), I(n, 9 / s.scale));
  return M`
    <g class="dim">
      ${c(z(t, I(n, 2 / s.scale)), t)}${c(z(e, I(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${W}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${je(L(t, e))}</text>
    </g>`;
}
function qf(t, e) {
  const n = e.selection;
  if (!n) return b;
  const i = e.palette, s = 4 / e.scale, o = (r) => M`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : b;
  }
  if (n.kind === "wall") {
    const r = he(Da, t, Xn).get(n.id), l = Zt(t, n.id);
    if (!r || !l) return b;
    const a = Y(l.dir);
    return M`
      <path d=${ie(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${W}></path>
      ${o(l.a)}${o(l.b)}
      ${ur(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), l = r ? Zt(t, r.wallId) : null;
    if (!r || !l) return b;
    const a = I(Y(l.dir), -1), c = l.rightOff + 18 / e.scale, u = (p) => z(l.a, I(l.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return M`
      <path d=${ie(ui(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${W}></path>
      ${d.filter(([p, f]) => f - p >= 1).map(([p, f]) => ur(u(p), u(f), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? M`<path class="zone-pick" d=${ie(ne(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${W}></path>` : b;
  }
  return b;
}
function Zf(t, e, n) {
  return L(t, e) < 1e-6 ? null : ui(wl(t, e, n.thickness, n.baseline), 0, L(t, e));
}
function Kf(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? Zt(t, r.wallId) : null;
  return M`
    ${o ? M`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${W}></path>` : b}
    ${(n.walls ?? []).map((a) => {
    const c = Zf(a.a, a.b, a.props);
    return M`<g class="preview-wall">
        ${c ? M`<path d=${ie(c)} fill=${i.selection} fill-opacity="0.35"></path>` : b}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${W}></line></g>`;
  })}
    ${r && l ? M`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ie(ui(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : b}
    ${Yf(t, e)}`;
}
function Gf(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return M`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${W}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${W}></rect></g>`;
}
function Yf(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Gf(n.anchor, e) : b, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / e.scale, { x: l, y: a } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = b;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    u = M`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${W}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    u = M`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${W}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), m = `M${l} ${a - f}L${l + f} ${a}L${l} ${a + f}L${l - f} ${a}Z`;
    u = M`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${W}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${W}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    u = M`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${W}></path></g>`;
    const y = o.endpoint.kind === "wall" ? he(Da, t, Xn).get(o.endpoint.wallId) : void 0;
    y && (d = M`<path class="snap-wall-hl" d=${ie(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${W}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    u = M`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${W}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return M`
    ${d}${s}${u}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${W} font-family="system-ui, sans-serif">${p}</text>`;
}
function Xf(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = he(Rf, n, (f) => $l(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? he(Bf, n, _s) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? b : String(i.dimOpacity), u = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, d = e.mode ?? "plan";
  return M`
    ${Df(n, { palette: i, scale: e.scale, selectedId: u, mode: d === "automation" ? "plan" : d })}
    <path class="walls" d=${s.map((f) => f.map(ie).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? M`<g class="railings" opacity=${c}>${o.flatMap((f) => (r.get(f.id) ?? []).map((m) => M`<path d=${ie(m)} fill=${i.railing}></path>`))}</g>` : b}
    <g class="openings" opacity=${c}>${n.openings.map((f) => Wf(n, f, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Ff(n, e)}</g>
    ${a ? Hf(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : b}
    <g class="devices-layer">${a ? b : Pf(n, {
    palette: i,
    scale: e.scale,
    selection: l,
    showCones: e.showCones ?? !0,
    dim: !1,
    preview: e.preview.device,
    ...d === "binding" || d === "automation" ? {
      bindingStatus: d === "binding" ? e.bindingStatus : void 0,
      containerState: e.containerState,
      live: e.live,
      bubbles: e.bubbles
    } : {}
  })}</g>
    <g class="selection">${qf(n, e)}</g>
    <g class="preview">${Kf(n, e)}</g>`;
}
const de = "non-scaling-stroke", Kt = "system-ui, sans-serif", Qf = 13, Ct = 9, Jf = 11, pr = 18, Ii = 12, Ci = 11, rn = 13, eh = 3, yn = 10, fr = 4.5, th = 12, nh = 11.5, Zs = 10, Pi = 10.5, ih = 6, sh = {
  IN: jp,
  OUT: Ea,
  BAT: Wp,
  PV: Ia
}, hr = { dead: 0, nodata: 1, idle: 2, live: 3 };
function nt(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Li = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function oh(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function en(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const rh = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, lh = M`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Na = (t, e, n, i) => M`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${de}>${i ? b : lh}</path>`, Ta = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, dt = (t, e, n, i) => M`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function ah(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Qt : Ct, s = t.pts[0], o = t.pts[t.pts.length - 1], r = yn / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((u, d) => ({ p: t.pts[d], q: u, len: Math.abs(u.x - t.pts[d].x) + Math.abs(u.y - t.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of a) {
    if (p < 2 * r + 2 * l) continue;
    const f = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, m = (w, g) => Math.hypot(f.x - w.x, f.y - w.y) >= g + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const y = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((y + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function ch(t, e, n) {
  var c;
  const i = e.palette, s = en(t.style, i), o = Ta(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = ah(t, e);
  return M`<g data-wire=${t.w.id}>
    ${r ? M`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${de}></path>` : b}
    ${t.style === "live" ? Na("glow", o, s, n) : b}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : b} stroke-linejoin="round" vector-effect=${de}></path>
    ${a ? M`<path class="arrow" d=${`M${yn / 2} 0L${-yn / 2} ${-fr}L${-yn / 2} ${fr}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : b}
  </g>`;
}
function dh(t, e, n) {
  const i = sh[t.name];
  return M`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Qt} fill=${n.portFill}
      stroke=${e ? en(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${de}></circle>
    ${i ? dt(i, t.pt, Qf, n.portIcon) : M`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Kt}>${t.name}</text>`}
  </g>`;
}
function uh(t, e) {
  const n = Math.max(4, Math.floor(e / (Zs * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function ph(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? li(a, n) || h(`power.kind.${a.kind}`) : l;
  }), o = h("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", uh(s[0], i - 12 - o.replace("{name}", "").length * Zs * 0.55)) : h("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function fh(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: nt(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Li(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: h("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = ft(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: h("power.in"), value: nt(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: h("power.out"), value: nt(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: Li(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(l(Ol(c))), d && p.push({ kind: "text", label: h("power.loss"), value: nt(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: Li(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), ph(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function hh(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : Ii + 3, o = e.x - s / 2, r = `${h(`power.switch.${i}`)}${t.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return M`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : b}>
    <title>${r}</title>
    ${dt(
    i === "on" ? Np : Dp,
    { x: o, y: e.y },
    pr,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? b : dt(Bp, { x: o + pr / 2 + 3 + Ii / 2, y: e.y + 1 }, Ii, n.blockValue)}
  </g>`;
}
function mr(t, e, n) {
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
function mh(t, e, n) {
  const i = 2 * (t.w + t.h), s = mr(t, e.side, e.pt), o = ((mr(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < l).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [e.pt, ...c, n.pt];
}
function gh(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return b;
  const l = ai(t, e, i.geo), a = l.find((f) => f.name === r), c = l.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return b;
  const u = s(c.name) ?? "nodata", d = en(u, i.palette), p = Ta(mh(we(e, i.geo, t), a, c));
  return M`${u === "live" ? Na("ts-glow", p, d, o) : b}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : b}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${de}></path>`;
}
function wh(t, e, n, i) {
  const s = i.palette;
  return Ma(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return M`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${de}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${Kt}>${o}</text>
    </g>`;
  });
}
function vh(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? h("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? h("power.alert.missingDevice") : t === "disagree" ? h("power.alert.disagree") : t;
}
function bh(t, e, n, i) {
  const s = eh + rn / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - a.x) - rn / 2, 0), d = Math.max(Math.abs(c.y - a.y) - rn / 2, 0);
    return Math.hypot(u, d) > Qt;
  }), l = o.find(r) ?? o[0];
  return M`<g class="alert"><title>${t.map(vh).join(`
`)}</title>
    ${dt(Sa, l, rn, i.blockInvalid)}</g>`;
}
function yh(t, e, n, i, s) {
  var y, w;
  const o = n.palette, r = we(e, n.geo, t), l = (y = n.frame) == null ? void 0 : y.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, u = r.x + r.w / 2, d = li(e, n.geo) || h(`power.kind.${e.kind}`), p = fh(t, e, n.geo, l, o, r.w), f = e.kind === "remainder", m = ai(t, e, n.geo);
  return M`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : b} vector-effect=${de}></rect>
    ${e.kind === "transfer" ? gh(t, e, l, n, (g) => i(e.id, g), s) : b}
    ${a && a.placement.mode !== "none" ? M`<g class="pin"><title>${h("power.planDevice")}</title>
      ${dt(Fp, { x: r.x + 4 + Ci / 2, y: r.y + 4 + Ci / 2 }, Ci, o.blockValue)}</g>` : b}
    <text class="name" x=${u} y=${r.y + Nn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${th} font-weight="600" fill=${o.blockName} font-family=${Kt}>${d}</text>
    ${p.map((g, $) => {
    const k = r.y + Nn + $ * Dn + Dn / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? wh(t, e, l, n) : b;
    if (g.kind === "switch") return hh(g, { x: u, y: k }, o);
    const _ = g.fill ?? o.blockValue, x = g.label ? M`<tspan>${g.label} </tspan>` : b, A = g.note ? M`<tspan> ${g.note}</tspan>` : b;
    return M`<text x=${u} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? Zs : nh}
        fill=${_} font-family=${Kt}>${g.title ? M`<title>${g.title}</title>` : b}${x}<tspan
        font-weight=${g.small ? b : "600"}>${g.value}</tspan>${A}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? bh(l.alert, r, m, o) : b}
    ${m.map((g) => dh(g, i(e.id, g.name), o))}
  </g>`;
}
function $h(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let c = b;
  const u = t.name ?? "", d = Math.min(Pi, a - 4), p = d >= ih, f = u.length * (p ? d : Pi) * 0.58 + 12;
  if (u) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let y = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, l + Ct]) {
      const $ = Math.min(g - Ct, l);
      $ - w > y.hi - y.lo && (y = { lo: w, hi: $ }), w = Math.max(w, g + Ct);
    }
    if (y.hi - y.lo >= f) {
      const g = (y.lo + y.hi) / 2, $ = o ? { x: g, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: g };
      c = M`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : Pi} fill=${s.blockValue} font-family=${Kt}
        transform=${o ? b : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return M`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? en(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${de}></rect>
    ${c}
  </g>`;
}
function xh(t, e, n) {
  return M`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${Ct} fill=${n.portFill} stroke=${en(e, n)} stroke-width="1.5"
      vector-effect=${de}></circle>
    ${dt(Lp, t, Jf, n.portIcon)}
  </g>`;
}
function kh(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return b;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return b;
  const s = we(i, e.geo, t), o = 4 / e.scale;
  return M`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${de}></rect>`;
}
function Mh(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const f of n.wires) {
    const m = xa(n, f, e.geo);
    if (!m) continue;
    const y = (p = e.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: ka(m.a, m.b), live: y, style: oh(y) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of s)
    for (const [m, y] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || hr[f.style] > hr[w]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], y.pt]), a.push({ at: y.pt, style: f.style });
    }
  const c = (f, m) => o.get(`${f}:${m}`), u = rh(), d = e.preview.wireDraft;
  return M`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? $h(f, l.get(f.id) ?? [], r.get(f.id), e) : b)}</g>
    <g class="wires">${s.map((f) => ch(f, e, u))}</g>
    ${kh(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? b : yh(n, f, e, c, u))}</g>
    <g class="terminals">${a.map((f) => xh(f.at, f.style, i))}</g>
    ${d ? M`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${de}></line>` : b}
  </g>`;
}
const _h = {
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
}, Ah = {
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
function Sh(t) {
  return t ? _h : Ah;
}
class Eh extends di {
  constructor(e) {
    if (super(e), e.type !== Ee.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? ae : (Ws(e), n);
  }
}
const K = ci(Eh), es = 1, gr = 1e-6;
function Ih(t, e, n, i, s) {
  const o = (a) => a > gr && a < s - gr, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = Yn(t, a).host.offset;
    o(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some((y) => y === e.a || y === e.b || r.has(y))) continue;
    const c = q(t, a.a), u = q(t, a.b), d = L(c, u), p = d === 0 ? null : pe(n, i, c, C(u, c));
    if (!p) continue;
    const f = Gn(p, c, u) * d;
    if (f < -es || f > d + es) continue;
    const m = H(C(p, n), i);
    o(m) && l.push({ t: m, wall: a, pt: p });
  }
  return l;
}
function wr(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function vr(t, e) {
  if ("nodeId" in e)
    return delete Yn(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (L(q(t, o), e.pt) <= es) return o;
  const { pt: n, offset: i } = ni(t, e.wall, e.pt), s = { id: Z(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function Ch(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = q(t, i.a), o = q(t, i.b), r = L(s, o), l = Kn(C(o, s)), a = H(C(n, s), l), c = Ih(t, i, s, l, r), u = wr(c.filter((g) => g.t < a), a), d = wr(c.filter((g) => g.t > a), a);
  if (!u && !d) return Rs(t, e);
  const p = be(t), f = p.walls.find((g) => g.id === e);
  let m = e, y = 0;
  if (d) {
    const g = vr(p, d);
    if (y = H(C(q(p, g), s), l), u) {
      const $ = { ...f, id: Z(), a: g };
      p.walls.push($), m = $.id;
    } else
      f.a = g;
  }
  u && (f.b = vr(p, u));
  const w = (g, $) => g.wallId !== e || u && $ <= u.t ? !0 : !d || $ < d.t ? !1 : (g.wallId = m, g.offset -= y, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((k) => k.kind !== "wall" || w(k, k.offset) ? k : Os(k)));
  }
  return ii(p), Ae(p, t);
}
function Ks(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Ph(t, e, n) {
  return z(t, I(Kn(C(e, t)), n));
}
function ln(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function Ke(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? Ks(r, e) : e, c = r !== void 0 && a.y === r.y, u = (x) => !r || Math.abs(c ? x.y - r.y : x.x - r.x) <= 1;
  let d = null;
  for (const x of t.nodes) {
    if (l.has(x.id)) continue;
    const A = { x: x.x, y: x.y }, E = L(A, a);
    E <= i && u(A) && (!d || E < d.d) && (d = { id: x.id, pt: A, d: E });
  }
  let p = null;
  for (const x of n.corners ?? []) {
    const A = L(x.pt, a);
    A <= i && u(x.pt) && (!p || A < p.d) && (p = { c: x, d: A });
  }
  if (p && (!d || p.d < d.d)) {
    const x = p.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: p.c };
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const f = t.walls.filter((x) => !l.has(x.a) && !l.has(x.b)).map((x) => ({ w: x, f: J(t, x) })).filter((x) => x.f.len > 1e-9);
  let m = null;
  for (const { w: x, f: A } of f) {
    const E = { x: (A.a.x + A.b.x) / 2, y: (A.a.y + A.b.y) / 2 }, O = L(E, a);
    O <= i && u(E) && (!m || O < m.d) && (m = { wallId: x.id, pt: E, offset: A.len / 2, d: O });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const y = (x) => {
    let A = null;
    for (const { w: E, f: O } of f) {
      const N = Y(O.dir), U = x ? [O.leftOff, -O.rightOff].filter((D) => D !== 0) : [0];
      for (const D of U) {
        const T = z(O.a, I(N, D)), j = r ? pe(r, C(a, r), T, O.dir) : z(T, I(O.dir, H(C(a, T), O.dir)));
        if (!j) continue;
        const oe = H(C(j, T), O.dir);
        if (oe < 0 || oe > O.len) continue;
        const ye = L(j, a);
        ye <= i && (!A || ye < A.d) && (A = { d: ye, res: { pt: j, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: oe } } });
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
      const E = L(A, a);
      E <= i && u(A) && (!k || E < k.d) && (k = { pt: A, d: E });
    }
  if (k) return ln(k.pt, "zoneVertex");
  let _ = null;
  for (const x of $)
    for (let A = 0; A < x.length; A++) {
      const E = x[A], O = x[(A + 1) % x.length], N = L(E, O);
      if (N < 1e-9) continue;
      const U = I(C(O, E), 1 / N), D = r ? pe(r, C(a, r), E, U) : z(E, I(U, H(C(a, E), U)));
      if (!D) continue;
      const T = H(C(D, E), U);
      if (T < 0 || T > N) continue;
      const j = L(D, a);
      j <= i && (!_ || j < _.d) && (_ = { pt: D, d: j });
    }
  if (_) return ln(_.pt, "zoneEdge");
  if (s && s > 0) {
    const x = (E) => Math.round(E / s) * s, A = r ? c ? { x: x(a.x), y: r.y } : { x: r.x, y: x(a.y) } : { x: x(a.x), y: x(a.y) };
    return ln(A, "grid");
  }
  return ln(a, "none");
}
function Lh(t, e, n) {
  return e.some((i, s) => me(t, i, e[(s + 1) % e.length]) <= n);
}
function Gs(t, e, n) {
  const i = Xn(t);
  for (const [s, o] of i) if (lt(e, o)) return s;
  for (const [s, o] of i) if (Lh(e, o, n)) return s;
  return null;
}
function Oh(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = J(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Te(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function zh(t, e, n, i) {
  const s = Oh(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && L(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = Gs(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const pi = 3, Dh = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => ne(t, n)).filter((n) => n.length >= 3);
function Va(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? Ks(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = Ke(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Dh(e, s), corners: vl(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = Ye(e, l.wallId), c = a !== null && l.offset >= -On && l.offset <= a + On, u = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, d = c ? Bt(e, l.wallId, l.side, u) : null;
    if (d) return { vertex: { kind: "wall", wallId: l.wallId, offset: u, side: l.side, x: d.x, y: d.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = Te(J(e, l), n.pt).side >= 0 ? "left" : "right", c = Bt(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Ha(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = ne(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => me(e, l, o[(a + 1) % o.length]) <= n) || ht(o, e)) && i.push({ id: s.id, area: Math.abs(ge(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function Ra(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: ne(t, n), v: n.shape.vertices } : null;
}
function Nh(t, e, n, i) {
  var r;
  const s = (r = Ra(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    L(n, l) <= i && (o < 0 || L(n, l) < L(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Th(t, e, n, i) {
  const s = Ra(t, e);
  if (!s || s.o.some((w) => L(n, w) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((w, g) => {
    const $ = me(n, w, o[(g + 1) % o.length]);
    $ <= i && $ < a && (l = g, a = $);
  }), l < 0) return null;
  const c = o[l], u = o[(l + 1) % o.length], d = Math.max(0, Math.min(1, Gn(n, c, u))), p = fl(c, u, d), f = r[l], m = r[(l + 1) % r.length], y = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + d * (m.offset - f.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: l + 1, vertex: y };
}
function Vh(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function y(w) {
    if (!i || !s || !a && L(w.pt, c) <= pi / t.scale()) return;
    a = !0;
    const g = Va(t, s, w, i.from, i.zoneId);
    r = g.snap, l = w.shift, o = Mu(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, t.selection()];
    },
    press(w) {
      f(), u = null, c = w.pt;
      const g = p(), $ = t.level(), k = g === null ? null : Nh($, g, w.pt, t.tolMm());
      return g === null || !k ? !1 : (i = { zoneId: g, ...k }, s = o = $, !0);
    },
    pick(w) {
      const g = Ha(t.level(), w, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const $ = p(), k = $ !== null && n !== null && L(w, n) <= t.tolMm() ? g.indexOf($) : -1;
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
      const g = o, $ = s, k = a, _ = i;
      f(), k ? g && $ && g !== $ && t.commit(g) : u = { zoneId: _.zoneId, index: _.index };
    },
    dblclick(w) {
      const g = d[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const $ = t.level(), k = Th($, g.id, w.pt, t.tolMm());
      if (!k) return;
      const _ = _u($, g.id, k.index, k.vertex);
      _ !== $ && (t.commit(_), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const g = m();
      if (w === "Escape" && g)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const $ = t.level(), k = Au($, g.zoneId, g.index);
        return k === $ ? (t.notify(h("zones.minVertices")), !0) : (u = null, t.commit(k), !0);
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
      f(), u = null, n = null;
    }
  };
}
function Hh(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (f) => {
    t.select(f);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, c = Vh(t, l), u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, d = (f, m, y) => Te(J(f, f.walls.find((w) => w.id === m)), y).t;
  function p(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const y = Ke(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), w = y.endpoint, g = (y.kind === "wall" || y.kind === "mid") && w.kind === "wall", $ = y.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, k = n.nodes.find((E) => E.id === m.nodeId), _ = !!k.host && g && w.kind === "wall" && w.wallId === k.host.wallId;
        let x = n;
        if (k.host && !_) {
          const E = structuredClone(n);
          delete E.nodes.find((O) => O.id === m.nodeId).host, x = E;
        }
        let A = Lu(x, m.nodeId, u(y));
        if ($ && w.kind === "node")
          A = Nu(A, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !_) {
          const E = n.walls.find((O) => O.id === w.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const O = structuredClone(A);
            O.nodes.find((N) => N.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, A = Ae(O, A);
          }
        }
        i = A;
      } else if (m.kind === "wall") {
        const y = n.walls.find(($) => $.id === m.wallId), w = Ke(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [y.a, y.b]
        }), g = C(w.pt, m.origin);
        i = zu(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const y = n.openings.find((w) => w.id === m.openingId);
        i = El(n, y.id, d(n, y.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      a(), o = f.pt, c.note();
      const m = t.level(), y = f.ctrl ? Gs(m, f.pt, t.tolMm()) : null;
      if (y) {
        l(null), t.commit(Ch(m, y, f.pt));
        return;
      }
      if (c.press(f)) return;
      const w = t.selection(), g = zh(m, f.pt, t.tolMm(), w);
      if (!g) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), l(g), r = n = i = m, g.kind === "node") {
        let $ = g.id;
        const k = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((_) => _.id === w.id) : void 0;
        if (f.alt && k) {
          const _ = Du(m, k.id, k.a === g.id ? "a" : "b");
          n = i = _.level, $ = _.nodeId, l({ kind: "node", id: $ });
        }
        e = { kind: "node", nodeId: $, origin: q(n, $) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: f.pt };
      else if (g.kind === "opening") {
        const $ = m.openings.find((k) => k.id === g.id);
        e = { kind: "opening", openingId: $.id, grab: d(m, $.wallId, f.pt) - $.offset };
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
      e && p(f);
      const m = s, y = i, w = r;
      a(), m && y && w && y !== w && t.commit(y);
    },
    dblclick(f) {
      c.dblclick(f);
    },
    key(f) {
      return f === "Escape" && e ? (a(), !0) : c.key(f);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), c.cancel();
    }
  };
}
function Gt(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function Ba() {
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
function Rh(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = Ba(), s = () => {
    e = null, i.clear();
  }, o = (c) => Ke(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = Gt(i.first, { min: 1 }), u = Gt(i.second, { min: 1 });
      return c === null || u === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const l = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const u = Pu(t.level(), e, c, t.wallProps(), t.boxMeasure());
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
      u && a(u);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return e ? i.key(c, () => {
        const u = r();
        u && a(u);
      }, s) : !1;
    },
    preview() {
      if (!e) return { snap: o(n) };
      const c = r(), u = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!c || l(e, c)) return u;
      const d = t.wallProps(), p = ra(e, c, d.thickness, t.boxMeasure());
      return p && (u.walls = p.map((f, m) => ({ a: f, b: p[(m + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const br = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Bh(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = Ba(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (p, f) => Ke(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), f = Gt(l.first, { min: 1 }), m = Gt(l.second);
    if (f === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const y = f ?? L(n, p.pt);
    let w = p.pt;
    if (m === null && L(n, p.pt) < 1) {
      const _ = r ?? { x: 1, y: 0 };
      w = { x: n.x + _.x, y: n.y + _.y };
    }
    if (m !== null) {
      const _ = m * Math.PI / 180;
      w = { x: n.x + Math.cos(_), y: n.y - Math.sin(_) };
    }
    const g = Ph(n, w, y), $ = { x: br(g.x), y: br(g.y) }, k = t.level().nodes.find((_) => Math.hypot(_.x - $.x, _.y - $.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function d() {
    const p = u();
    if (!e || !p) return;
    const f = Cu(t.level(), e, p.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((k) => k.id === f.wallId);
    i === null && (i = m.a);
    const y = f.endNodeId === i, w = n, g = q(f.level, f.endNodeId), $ = L(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), l.clear(), y) {
      a();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = q(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !e) {
        const f = c(p.pt, !1);
        e = f.endpoint, n = f.pt;
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
      return o = f.shift, e ? l.key(p, d, a) : !1;
    },
    preview() {
      if (!n) return { snap: Ke(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
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
function Fh(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = Gs(o, n, t.tolMm());
    if (!r) return null;
    const l = J(o, o.walls.find((c) => c.id === r)), a = Te(l, n).t;
    return { wallId: r, center: a, pt: z(l.a, I(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Td(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: o.wallId, offset: l, width: r, kind: e, invalid: !Qn(t.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const yr = 3, Uh = 1, ue = (t) => ({ x: t.x, y: t.y });
function jh(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ue(e[e.length - 1]) : void 0;
  function l(d) {
    const p = e.length;
    if (p === 0) return !1;
    const f = e.map(ue);
    if (L(f[p - 1], d) <= Uh) return !0;
    if (p >= 2) {
      const m = C(f[p - 1], f[p - 2]), y = C(d, f[p - 1]);
      if (Math.abs(te(m, y)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(y.x, y.y) && H(m, y) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (Zl(f[p - 1], d, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(d) {
    if (e.length < yr) return null;
    const p = t.tolMm(), f = ue(e[0]), m = ue(e[e.length - 1]);
    return L(d, f) <= p ? f : L(d, m) <= p ? m : null;
  }
  function c() {
    var f;
    if (e.length < yr || zn(e.map(ue))) return !1;
    const d = t.level(), p = xu(d, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : Ns(p.level, p.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => Va(t, t.level(), d, r());
  return {
    id: "zone",
    down(d) {
      if (a(d.pt)) {
        c();
        return;
      }
      const p = u(d).vertex;
      l(ue(p)) || (e = [...e, p], n = ue(p), i = !1);
    },
    move(d) {
      o = d.shift;
      const p = a(d.pt);
      if (p) {
        n = p, s = null, i = zn(e.map(ue));
        return;
      }
      const f = u(d);
      s = f.snap, n = ue(f.vertex), i = l(n);
    },
    up() {
    },
    key(d) {
      return d === "Enter" ? c() : d === "Backspace" || d === "Delete" || d === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : d === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const d = {};
      e.length > 0 && (d.zoneDraft = { points: e.map(ue), cursor: n, invalid: i }), s && (d.snap = s);
      const p = r();
      return o && p && (d.orthoFrom = p), d;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Wh(t) {
  return t.zoneMethod() === "polygon" ? jh(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = $u(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(h("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : Ns(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const $r = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Fa(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((u) => u.id === o), a = l ? Q(s, l) : null, c = l ? Yi(s, l, t.scale()) : null;
    return !a || !c ? 0 : Fl(ke(C(r, a.pt)) - ke(C(c.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && L(s.pt, e.downPt) <= pi / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((d) => d.id === e.id), r = o ? Q(e.original, o) : null;
    if (!o || !r) return;
    const l = L(s.pt, r.pt), a = (ke(C(s.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, u = lu(e.original, o, c, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : Pn(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === s), a = l ? Yi(r, l, t.scale()) : null;
      return !l || !a || L(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && $r(o.work, o.id) !== $r(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function xr(t, e, n) {
  const i = J(t, t.walls.find((s) => s.id === e));
  return Te(i, n).side > 0 ? "left" : "right";
}
function Ua(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function Ys(t, e = "free") {
  return t === "equipment" ? [e] : xs[t];
}
function ja(t, e, n, i, s = 0, o = Ys(n)) {
  if (o.includes("wall")) {
    const r = Ke(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: xr(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const u = J(e, c), d = Te(u, i).side, p = Math.abs(Math.abs(d) - (d > 0 ? u.leftOff : u.rightOff));
        (!a || p < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : u.len, d: p });
      }
      if (a) return { mode: "wall", wallId: a.id, side: xr(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Ua(t, i), rotation: s } : null;
}
function qh(t, e, n) {
  const i = Q(t, e);
  if (!i) return null;
  if (!n) {
    const o = Ss(Math.round(ke(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of t.walls) {
    let r;
    try {
      r = J(t, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = Te(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), u = Bt(t, o.id, a, c), d = u ? L(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? Es(t, e.props, s.placement, 0) : null;
}
function Zh(t, e, n) {
  return Nl(t.deviceDefaults(e), "free", n.mode);
}
function Kh(t, e) {
  let n = null, i;
  const s = Fa(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = Ys(e, t.wallMount() ? "wall" : "free"), a = ja(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...Ua(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = Zh(t, e, a), u = Es(r, c, a, t.tolMm()), d = To(r, c, u, "").deviceId !== null;
    return { placement: u, props: c, invalid: !d };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), c = vs(h(`device.${e}`), a.devices.filter((d) => d.props.kind === e).map((d) => d.name)), u = To(a, l.props, l.placement, c);
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
const kr = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Gh = (t, e, n) => n === void 0 || kr(t, n) !== kr(e, n);
function Yh(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return C(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = Bt(t, s.wallId, s.side, s.offset);
  return o ? C(o, i) : { x: 0, y: 0 };
}
function Xh(t) {
  let e = null, n = null;
  const i = Fa(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (p) => {
    e = p, t.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && L(p.pt, l) <= pi / t.scale()) return;
    if (r = !0, p.pt.x === l.x && p.pt.y === l.y) {
      o = s;
      return;
    }
    const f = s.devices.find((x) => x.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = p.shift ? Ks(l, p.pt) : p.pt, y = f.placement, w = y.mode === "free" ? null : Q(s, f), g = y.mode === "free" ? y.rotation : w ? Ss(Math.round(ke(w.dir))) : 0, $ = z(m, n.grab), k = ja(t, s, f.props.kind, $, g, Ys(f.props.kind, y.mode)), _ = k && k.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...k, aim: y.aim } : k;
    o = _ ? Pn(s, f.id, Es(s, f.props, d(s, f.placement, _, m, $), t.tolMm())) : s;
  }
  function d(p, f, m, y, w) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = p.walls.find((E) => E.id === f.wallId);
    if (!g) return m;
    const $ = J(p, g), k = Math.max(0, Math.min($.len, f.offset + H(C(y, l), $.dir))), _ = Te($, w).side, x = t.tolMm(), A = f.side === "left" ? _ < -($.rightOff + x) ? "right" : "left" : _ > $.leftOff + x ? "left" : "right";
    return { ...m, offset: k, side: A };
  }
  return {
    id: "device-select",
    down(p) {
      c(), l = p.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const y = Wl(f, p.pt, m);
      if (!y) {
        a(null);
        return;
      }
      a({ kind: "device", id: y });
      const w = f.devices.find(($) => $.id === y), g = Q(f, w);
      s = o = f, n = { id: y, grab: Yh(f, w, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, m = s, y = r, w = n == null ? void 0 : n.id;
      c(), y && f && m && f !== m && Gh(m, f, w) && t.commit(f);
    },
    key(p) {
      return p === "Escape" && i.cancel() ? !0 : p === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const p = i.working();
      return p ? { level: p } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), c(), a(null);
    }
  };
}
function Qh(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = Wl(t.level(), e.pt, t.tolMm());
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
const ts = 40, Jh = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function em(t, e, n, i) {
  const s = t.blocks.find((f) => f.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = Wt(o ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - ts) : r, u = n === "end" ? Math.max(a, r + ts) : r + l;
  if (c === r && u === r + l) return t;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * l - c) / (u - c))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...d } : f),
    wires: t.wires.map((f) => {
      const m = p(f.from), y = p(f.to);
      return m === f.from && y === f.to ? f : { ...f, from: m, to: y };
    })
  };
}
function tm(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(u, d) {
    const p = ir(u, d, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function a(u) {
    const d = e, p = n;
    if (!d || !p || !s && L(u.pt, o) <= pi / t.scale()) return;
    if (s = !0, d.kind === "wire") {
      const w = l(p, u.pt);
      e = { ...d, to: u.pt, ok: !!w && !("error" in Jo(p, d.from, w, t.geo())) };
      return;
    }
    if (d.kind === "bus-end") {
      i = em(p, d.id, d.end, u.pt);
      return;
    }
    const f = p.blocks.find((w) => w.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!f) return;
    if (d.kind === "pin") {
      i = Yu(p, f.id, d.from.port, up(we(f, t.geo(), p), u.pt));
      return;
    }
    const m = Wt(f.x + u.pt.x - o.x), y = Wt(f.y + u.pt.y - o.y);
    i = m === f.x && y === f.y ? p : Zu(p, f.id, m, y);
  }
  function c(u, d, p) {
    const f = l(u, p);
    if (!f) return;
    const m = Jo(u, d, f, t.geo());
    if ("error" in m) {
      t.notify(h(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const d = t.power(), p = ir(d, u.pt, t.tolMm(), t.geo());
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
        const f = { block: p.block, port: p.port };
        if (Jh(d, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = d.blocks.find((w) => w.id === p.block), y = ai(d, m, t.geo()).find((w) => w.name === p.port).pt;
        e = { kind: "wire", from: f, at: y, to: y, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: p.id }), e = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      a(u);
    },
    up(u) {
      a(u);
      const d = e, p = n, f = i, m = s;
      if (r(), !(!d || !p)) {
        if (!m) {
          (d.kind === "wire" || d.kind === "pin") && t.select({ kind: "powerBlock", id: d.from.block });
          return;
        }
        d.kind === "wire" ? c(p, d.from, u.pt) : f && f !== p && t.commitPower(f);
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
function nm(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let s;
      if (n === "device") {
        const u = t.placeDeviceId();
        if (!u) {
          t.notify(h("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = t.power(), r = qu(n, { x: 0, y: 0 }, o, s), l = we(r, t.geo(), Xo(o, r)), a = { ...r, x: Wt(i.pt.x - l.w / 2), y: Wt(i.pt.y - l.h / 2) };
      t.commitPower(Xo(o, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function im(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = Ha(t.level(), e.pt, t.tolMm())[0];
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
const sm = ["select", "box", "wall", "door", "window", "opening", "zone"], om = [
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
], rm = ["binding-select"], lm = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], am = ["zone-pick"], Wa = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, cm = {
  plan: sm,
  equipment: om,
  binding: rm,
  power: lm,
  automation: am
};
function Xs(t) {
  return cm[t];
}
function ns(t, e) {
  switch (t) {
    case "select":
      return Hh(e);
    case "box":
      return Rh(e);
    case "wall":
      return Bh(e);
    case "door":
    case "window":
    case "opening":
      return Fh(e, t);
    case "zone":
      return Wh(e);
    case "device-select":
      return Xh(e);
    case "binding-select":
      return Qh(e);
    case "power-select":
      return tm(e);
    case "zone-pick":
      return im(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return nm(e, t);
    default:
      return Kh(e, t);
  }
}
function Oi(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const dm = {
  select: vt,
  box: Qp,
  wall: Jp,
  door: Op,
  window: tf,
  opening: zp,
  zone: Kp,
  "device-select": vt,
  ceiling_light: Ip,
  wall_light: ef,
  motion_sensor: Up,
  illuminance_sensor: Ep,
  climate_sensor: Gp,
  wall_switch: Rp,
  smart_button: Hp,
  valve: Yp,
  leak_sensor: Ca,
  socket: Ea,
  exhaust_fan: Tp,
  equipment: sr,
  "binding-select": vt,
  "zone-pick": vt,
  "power-select": vt,
  "power-device": sr,
  "power-bus": qp,
  "power-battery": Sp,
  "power-pv": Ia,
  "power-transfer": Zp,
  "power-remainder": Cp
}, qa = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${dm[t]}></path>`}</svg>`;
function um(t) {
  switch (t.saveState) {
    case "saving":
      return h("save.saving");
    case "conflict":
      return h("save.conflict");
    case "error":
      return h("save.error");
    default:
      return t.dirty ? h("save.dirty") : h(t.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function pm(t) {
  return v`
    <div class="top"><div class="bar">
      ${t.lead ?? b}
      ${t.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${K(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => v`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : b}
      <button class="btn" data-action="new-plan" title=${h("plan.new")} aria-label=${h("plan.new")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${h("plan.delete")} aria-label=${h("plan.delete")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${h("action.undo")} aria-label=${h("action.undo")} ?disabled=${!t.canUndo}
        @click=${t.onUndo}>↶</button>
      <button class="btn" title=${h("action.redo")} aria-label=${h("action.redo")} ?disabled=${!t.canRedo}
        @click=${t.onRedo}>↷</button>
      <span class="save-state ${t.saveState}" title=${t.saveState === "error" ? t.errorMessage ?? "" : ""}>
        ${um(t)}${t.saveState === "error" && t.errorMessage ? v`: ${t.errorMessage}` : b}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${h("action.save")}</button>
    </div>${t.steps}</div>`;
}
const fm = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Za(t, e, n) {
  return Xs(t).map((i) => {
    const s = t === "plan" ? Wa[i] : void 0, o = h(`tool.${i}`);
    return v`
      ${fm.includes(i) ? v`<div class="tool-sep"></div>` : b}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? b}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? b}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${qa(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function hm(t, e, n) {
  return v`<div class="tools">${Za(t, e, n)}</div>`;
}
const an = ["plan", "equipment", "binding", "power", "automation"], bt = (t, e, n) => h(t === 1 ? e : n).replace("{n}", String(t));
function mm(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((u) => u.invalid).length, c = a ? `, ${h("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${bt(o.length, "steps.wall", "steps.walls")}, ${bt(r.length, "steps.zone", "steps.zones")}${c}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: bt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - ys(l.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: bt(i.blocks.length, "steps.block", "steps.blocks"), done: ip(i) };
    case "automation":
      return { text: bt(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const Mr = (t, e) => h(t).replace("{step}", h(`mode.${e}`));
function gm(t) {
  const e = an.indexOf(t.mode), n = an[e - 1], i = an[e + 1];
  return v`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${K(t.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${an.map((s, o) => {
    const r = mm(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return v`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : b} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Mr("steps.back", n)}</button>` : b}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Mr("steps.next", i)}</button>` : b}
      </div>
    </nav>`;
}
function wm(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Ka(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return Ll(t, vs(h("device.equipment"), e));
}
function Qs(t) {
  if (ft(t)) return h("props.inverter");
  const e = Fd(t);
  return e ? h(`deviceRole.${e}`) : "";
}
function fi(t) {
  const e = h(`device.${t.props.kind}`), n = Qs(t);
  return n ? `${e} · ${n}` : e;
}
function vm(t) {
  const e = wm(t.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${h("devices.new")}</button>
    </div>
    ${e.length === 0 ? b : v`<div class="pdevs">
      ${e.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Qs(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const bm = ["unbound", "bound", "all"], ym = /* @__PURE__ */ new WeakMap(), Pt = (t) => t.placement.mode === "none";
function Ga(t) {
  return he(ym, t, (e) => [...e.devices].sort((n, i) => Number(Pt(n)) - Number(Pt(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function $m(t, e, n) {
  const i = Ga(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Ya = (t) => h(`device.${t.props.kind}`), _r = (t) => t.props.kind === "equipment" ? Qs(t) : Ya(t), xm = (t, e) => t === "all" || t === "bound" == (e === "bound");
function km(t, e, n) {
  return e === 0 ? h("binding.noDevices") : n || t.filter === "all" ? h("binding.noMatch") : h(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Ar(t) {
  const e = h(t.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function Mm(t) {
  var l;
  if (t.collapsed) return v`<div class="blist collapsed">${Ar(t)}</div>`;
  const e = Ga(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: ys(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: c }) => xm(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || Ya(a).toLowerCase().includes(i) || _r(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const u = Wc(a);
    return v`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${h(`bindstatus.${c}`)} title=${h(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${_r(a)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${bm.map((a) => v`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${h(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Ar(t)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${K(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${km(t, e.length, i)}</p>` : v`
          ${s.filter((a) => !Pt(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => Pt(a.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((a) => Pt(a.d)).map((a) => r(a.d, a.st))}
          </div>` : b}`}
      </div>
    </div>`;
}
function P(t, e) {
  return v`<label class="row"><span>${t}</span>${e}</label>`;
}
function G(t, e, n, i) {
  return v`<select class="val" data-field=${i ?? b} .value=${K(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => v`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Ve(t) {
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
    const o = Gt(s.value, t.rule);
    if (o === null) {
      s.value = e, n(h(t.bad));
      return;
    }
    if (t.skipSame && o === t.value) {
      n(null);
      return;
    }
    if (t.apply(o) === !1) {
      s.value = e, n(h("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function _m() {
  return {
    door: { width: wn.door, hinge: "start", swing: "left" },
    window: { width: wn.window, outside: "left" },
    opening: { width: wn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Am(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Xa(t) {
  return vs(h("zones.default"), t.zones.map((e) => e.name));
}
const Sm = (t) => t === "door" || t === "window" || t === "opening";
function Em(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return b;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return v`
    <h4>${h(`props.next.${n}`)}</h4>
    ${P(`${h("props.width")}, ${h("unit.mm")}`, Ve({
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
      ${P(h("props.hinge"), G(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${P(h("props.swing"), G(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : b}
    ${n === "window" ? P(h("props.outside"), G(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : b}`;
}
class Im {
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
const is = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Lt = (t) => typeof t == "string" && t ? t : null, Sr = (t) => typeof t == "number" && Number.isFinite(t), ss = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Qa(t) {
  return t.switchesMigrated || !t.devices.some(ss) ? t : { ...t, switchesMigrated: !0 };
}
function Cm(t, e, n) {
  const i = Ll(t, n);
  let s = i.level;
  const o = is(e.switch) ? e.switch : {}, r = [["power", Lt(e.power)], ["voltage", Lt(e.voltage)], ["control", Lt(o.entity)]];
  for (const [l, a] of r) a && (s = Wn(s, i.id, l, a));
  return o.controllable === !0 && (s = Jn(s, i.id, !0)), { level: s, id: i.id };
}
function Pm(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (is(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!is(l)) return l;
      if (l.kind === "meter" && Lt(l.id) && Sr(l.x) && Sr(l.y)) {
        s++;
        const a = Cm(e, l, Lt(l.name) ?? `Meter ${s}`);
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
        const { inverter: a, ...c } = l;
        return a === !0 && typeof l.deviceId == "string" && (e = Dl(e, l.deviceId, !0)), o = !0, c;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(ss)) {
    for (const s of t.level.devices) ss(s) && (e = Jn(e, s.id, !0));
    e = Qa(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class Lm {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await Ei(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt($o(h("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = fe(e);
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
    const n = await yp(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(h("load.oldServer"));
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
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = h("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Ei(this.h.hass);
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
      this.h.notice = fe(n);
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
    this.h.toolId = Xs(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt($o(h("plan.default"))), this.offerDraft(null);
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
            await xp(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = fe(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ei(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = fe(o);
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
    this.h.plan = { ...e, levels: e.levels.map(sd) };
    const n = Pm({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = np(n.power, { device: (o) => n.level.devices.find((r) => r.id === o) }), s = e.rules && e.rules.length > 0 ? e.rules : void 0;
    this.h.history = new Im({ level: n.level, ...i ? { power: i } : {}, ...s ? { rules: s } : {} }), this.h.lazyPower = pa(), this.h.activeTool.cancel(), this.h.activeTool = ns(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((c, u) => u === 0 ? Qa(n) : c), { power: r, rules: l, ...a } = e;
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
    const e = `${this.h.plan.name} ${h("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), s = await this.h.save.saveAsNew(i, e);
    s && this.keepSaved(i), s ? (this.h.plan = s, this.h.dialog = null, this.afterSaved(n, s.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Om {
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
    !n || !Ru(n.states, e) ? this.base = { states: e, meta: Hu(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Fu(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Bu(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", fe(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const cn = cl("", "");
function zm(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? cn;
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
    openingDefaults: (e) => Am(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Xa(((e = t.history) == null ? void 0 : e.current.level) ?? cn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? cn).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : ba(((n = t.history) == null ? void 0 : n.current.level) ?? cn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Ja = Object.keys(xs), Dm = (t) => Ja.includes(t);
function Nm() {
  return Object.fromEntries(Ja.map((t) => [t, ze(t, "free")]));
}
const ec = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -rt, max: rt, signed: !0 }, bad: "props.badAim" }
}, Ot = (t, e, n, i, s) => Ve({ ...ec[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), Tm = ["round", "linear", "spot"], Vm = ["rect", "circle"], Rn = (t, e) => t.map((n) => ({ v: n, label: h(`${e}.${n}`) }));
function tc(t, e, n, i) {
  const s = (r, l, a) => P(`${h(l)}, ${h("unit.mm")}`, Ot(t, n + r, a, "mm", (c) => i({ [r]: c }))), o = (r, l, a) => P(`${h(l)}, ${h("unit.deg")}`, Ot(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return v`
        ${P(h("props.shape"), G(e.shape, Rn([...Tm], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? v`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : b}
        ${P(`${h("props.poolRadius")}, ${h("unit.mm")}`, Ve({
        ...ec.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: h("props.poolHint"),
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
      return P(`${h("props.diameter")}, ${h("unit.mm")}`, v`<select class="val" data-field=${`${n}diameter`}
        .value=${K(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Gc.map((r) => v`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${P(h("props.shape"), G(e.shape, Rn([...Vm], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? v`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${P(h("props.icon"), Rm(t, e.icon, `${n}icon`, i))}
        ${P(h("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${K(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    default:
      return v`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const Hm = /^mdi:[a-z0-9-]+$/;
function Rm(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!Hm.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, h("props.badIcon"));
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
function Ge(t, e, n, i) {
  return P(e, v`<input type="checkbox" data-field=${t} .checked=${K(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Bm(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? b : Ge("wallMount", h("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Fm(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? b : v`
    ${Ge("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? Ge("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function Um(t, e) {
  const n = e.placement;
  if (n.mode === "none") return b;
  if (n.mode === "free")
    return P(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      Ot(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = dl.has(e.props.kind);
  return v`
    ${P(h("props.side"), G(n.side, Rn(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${P(`${h("props.offset")}, ${h("unit.mm")}`, Ot(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? P(
    `${h("props.aim")}, ${h("unit.deg")}`,
    Ot(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(ql(n, s)))
  ) : b}`;
}
function Js(t, e) {
  return P(h("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${K(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function jm(t, e) {
  const n = e.props.kind;
  return al(n) ? n === "smart_button" && e.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : P(h("props.type"), G(
    n,
    Rn(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : b;
}
function Wm(t, e) {
  const n = t.level ? fu(t.level, e) : [];
  return v`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function qm(t, e) {
  const n = e.placement.mode !== "none";
  return v`
    <h4>${fi(e)}</h4>
    ${Js(e, (i) => t.onDevice({}, i))}
    ${jm(t, e)}
    ${n ? tc(t, e.props, "", (i) => t.onDevice(i)) : b}
    ${Bm(t, e)}
    ${Um(t, e)}
    ${Fm(t, e)}
    ${n ? Wm(t, e) : b}
    ${e.invalid ? v`<p class="warn">${h("props.invalidDevice")}</p>` : b}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${h("action.delete")}</button>`;
}
function Zm(t) {
  return t.device ? qm(t, t.device) : t.nextKind && t.nextProps ? v`
      <h4>${h("props.nextDevice")}: ${h(`device.${t.nextKind}`)}</h4>
      ${tc(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? Ge(
    "next-wallMount",
    h("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : b}` : v`<p class="muted">${h("props.none")}</p>`;
}
function Km(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = Dm(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(h("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const u = qh(e, a, c);
    return o(u ? Pn(e, a.id, u) : e);
  };
  return v`<div class="props">
    ${Zm({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, c) => !!i && o(Xt(e, i.id, a, c)),
    onKind: (a) => !!i && o(Ud(e, i.id, a)),
    onPlacement: (a) => !!i && o(Pn(e, i.id, a)),
    onZone: (a, c) => !!i && o(ia(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(wa(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(Jn(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(ga(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    ${i ? b : vm({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = Ka(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const os = (t) => h(`zones.kind.${t.shape.kind}`), eo = (t) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${M`<path d=${t === "walls" ? Vp : Xp}></path>`}</svg>`;
function nc(t, e) {
  const n = Kl(t, e);
  return n ? h(`zones.invalid.${n}`) : null;
}
function Gm(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: qs(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || os(o).toLowerCase().includes(e));
  return v`
    <div class="zlist">
      <div class="zhead"><span>${h("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${h("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${h("zones.filter")}
        aria-label=${h("zones.filter")} .value=${K(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? nc(t.level, o) ?? "" : null;
    return v`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? v`<span class="zswatch" style=${`background:${r}`}></span>` : v`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${os(o)}>${eo(o.shape.kind)}</span>
            <span class="zarea">${((a = Cs(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const to = ci(class extends di {
  constructor(t) {
    if (super(t), t.type !== Ee.PROPERTY && t.type !== Ee.ATTRIBUTE && t.type !== Ee.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Aa(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === ae || e === b) return e;
    const n = t.element, i = t.name;
    if (t.type === Ee.PROPERTY) {
      if (e === n[i]) return ae;
    } else if (t.type === Ee.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return ae;
    } else if (t.type === Ee.ATTRIBUTE && n.getAttribute(i) === e + "") return ae;
    return Ws(t), e;
  }
}), ic = (t, e, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${to(e)}
    @change=${(i) => n(i.target.checked)} />${h("zones.automation")}</label>`;
function Ym(t, e, n) {
  const i = Ps(t, e.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${h("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${h("zones.participates")}</span>` : b}</div>
    ${i.length === 0 ? v`<p class="muted">${h("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${h(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${to(o)}
          @change=${(r) => {
    const l = ia(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Er(t, e, n) {
  const i = nc(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return v`<div class="zprops">
    <h4>${h("props.zone")}</h4>
    ${P(h("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${K(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(ku(t, e.id, l));
  }} />`)}
    ${P(h("props.area"), v`<span class="val ro" data-field="zone-area">${La(Cs(t, e))}</span>`)}
    ${P(h("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${eo(e.shape.kind)}${os(e)}</span>`)}
    ${ic("zone-automation", e.automation !== !1, (o) => {
    const r = Ns(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(Su(t, e.id))}>
        ${h("zones.keepOutline")}</button>` : b}</div>` : b}
    ${Ym(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(na(t, e.id))}>
      ${h("zones.delete")}</button>
  </div>`;
}
function Xm(t) {
  const e = t.next.zone, n = e.name ?? Xa(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return v`
    <h4>${h("props.nextZone")}</h4>
    <div class="muted">${h("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${h("zones.method")}>
      ${["walls", "polygon"].map((s) => v`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${eo(s)}<span>${h(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${h(`zones.hint.${e.method}`)}</p>
    ${P(h("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${K(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${ic("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function sc(t, e, n) {
  return Ve({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Ir(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Qm(t, e) {
  const n = J(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Tu(e.level, t.id, o));
  return v`
    <h4>${h("props.wall")}</h4>
    ${P(h("props.type"), G(
    t.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${P(h("props.thickness"), sc(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${P(h("props.baseline"), G(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: h(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${P(h("props.length"), v`<span class="val ro">${je(n)} ${h("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(Rs(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function Jm(t, e) {
  const n = ["door", "window", "opening", ...In.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Rd(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = In.includes(t.kind);
  return v`
    <h4>${h(`kind.${t.kind}`)}</h4>
    ${P(h("props.kind"), G(t.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(Hd(t, r))))}
    ${P(h("props.width"), sc(e, t.width, (r) => Ir(e, Vd(e.level, t.id, r))))}
    ${P(h("props.offset"), Ve({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Ir(e, El(e.level, t.id, r))
  }))}
    ${o ? v`
      ${P(h("props.hinge"), G(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${P(h("props.swing"), G(t.swing ?? "left", s, (r) => i({ swing: r })))}` : b}
    ${t.kind === "window" ? P(h("props.outside"), G(t.outside ?? "left", s, (r) => i({ outside: r }))) : b}
    ${P(h("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${K(Ml(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === kl(t.kind) ? void 0 : l });
  }} />`)}
    ${P(h("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${K(Al(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === _l(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? v`<p class="warn">${h("props.invalidOpening")}</p>` : b}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Il(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function eg(t) {
  const e = ["bearing", "partition", "railing"];
  return v`
    <h4>${h("props.newWall")}</h4>
    ${P(h("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => v`<option value=${n} ?selected=${n === t.wallType}>${h(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${P(`${h("props.thickness")}, ${h("unit.mm")}`, Ve({
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
      <div class="muted">${h("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => v`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${h(`measure.${n}`)}</button>`)}
      </div>` : b}`;
}
const Cr = (t) => Gm({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function tg(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${Xm({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
      ${s ? Er(e, s, t.commit) : b}
      ${Cr(t)}
    </div>`;
  }
  let i = b;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = Qm(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = Jm(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Er(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${h("props.node")}</h4>
      ${P("X", v`<span class="val ro">${je(s.x)}</span>`)}${P("Y", v`<span class="val ro">${je(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === b && (t.tool === "wall" || t.tool === "box") ? eg(t) : i === b && Sm(t.tool) ? Em({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === b && t.tool === "select" ? Cr(t) : i === b ? v`<p class="muted">${h("props.none")}</p>` : i}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    </div>`;
}
function ng(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Pr = /* @__PURE__ */ new WeakMap();
function no(t, e, n) {
  let i = Pr.get(t);
  i || Pr.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : ng(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function $n(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dn = (t) => t ?? b;
var ig = Object.defineProperty, tn = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && ig(e, n, s), s;
};
const sg = 100;
let og = 0;
const rg = (t) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${t}></path>`}</svg>`, ro = class ro extends it {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${og++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === sg) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${dn(this.label || void 0)} title=${dn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : b}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${dn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${dn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : b}
      ${n ? v`<div class="hint">${h("combo.more")}</div>` : b}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : b}</div>`;
  }
};
ro.styles = el`
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
let Ne = ro;
tn([
  Me()
], Ne.prototype, "value");
tn([
  Me()
], Ne.prototype, "label");
tn([
  R()
], Ne.prototype, "isOpen");
tn([
  R()
], Ne.prototype, "query");
tn([
  R()
], Ne.prototype, "active");
var lg = Object.defineProperty, io = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && lg(e, n, s), s;
};
const ag = {
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
}, Lr = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, cg = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Or(t, e) {
  return t != null && t.deviceClass && Lr[t.deviceClass] ? Lr[t.deviceClass] : cg[(t == null ? void 0 : t.domain) ?? aa(e)] ?? "generic";
}
const zr = (t) => rg(ag[t]);
function dg(t) {
  switch (t) {
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
      return t;
  }
}
class hi extends Ne {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = $n(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? $n(this.meta, e) : null;
    return v`${zr(e ? Or(this.meta.entities.get(e), e) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : b}<small class="eid">${e}</small></span>` : v`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = da(this.states, e.entityId) ?? "unavailable";
    return v`${zr(Or(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${dg(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = $n(this.meta, e).name;
    return n === e ? e : `${n} (${e})`;
  }
  rowTitle(e) {
    return e.name === e.id ? e.id : `${e.name} (${e.id})`;
  }
  searchLabel() {
    return h("combo.search");
  }
  emptyText() {
    return h("combo.empty");
  }
}
io([
  Me({ attribute: !1 })
], hi.prototype, "meta");
io([
  Me({ attribute: !1 })
], hi.prototype, "items");
io([
  Me({ attribute: !1 })
], hi.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", hi);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const zt = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), zt(s, e);
  return !0;
}, Bn = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, oc = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), fg(e);
  }
};
function ug(t) {
  this._$AN !== void 0 ? (Bn(this), this._$AM = t, oc(this)) : this._$AM = t;
}
function pg(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) zt(i[o], !1), Bn(i[o]);
  else i != null && (zt(i, !1), Bn(i));
  else zt(this, t);
}
const fg = (t) => {
  t.type == Ee.CHILD && (t._$AP ?? (t._$AP = pg), t._$AQ ?? (t._$AQ = ug));
};
class hg extends di {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), oc(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (zt(this, e), Bn(this));
  }
  setValue(e) {
    if (Aa(this._$Ct)) this._$Ct._$AI(e, this);
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
const mg = () => new gg();
class gg {
}
const zi = /* @__PURE__ */ new WeakMap(), wg = ci(class extends hg {
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
      let n = zi.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), zi.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = zi.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), vg = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], bg = { min: 1, max: 10 };
function rc(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const rs = (t, e, n) => rc(t, Xt(t.level, e.id, n));
function Di(t, e, n, i) {
  return v`<div class="cflag">${P(e, v`<input type="checkbox" data-field=${t} .checked=${K(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Ni = "__other", yt = /* @__PURE__ */ new Set();
function yg(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = yo.includes(i), l = !r || yt.has(o), a = mg(), c = [...yo.map((d) => ({ v: d, label: d })), { v: Ni, label: h("binding.eventOther") }];
  return v`<span class="evfield">${G(l ? Ni : i, c, (d) => {
    if (d === Ni) {
      yt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    yt.delete(o), a.value && (a.value.hidden = !0), d !== i ? s(d) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${wg(a)} data-field=${`${n}-event-custom`} ?hidden=${to(!l)}
      .value=${K(r ? "" : i)} @change=${(d) => {
    var m;
    const p = d.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, t.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, t.setFieldNotice(null), f !== i) {
      s(f) && yt.delete(o);
      return;
    }
    if (yt.delete(o), r) {
      p.hidden = !0;
      const y = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function $g(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return v`${b}`;
  const s = i[n], o = (r) => rs(t, e, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${P(h("binding.slot"), G(
    String(s.slot),
    vg(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${P(h("binding.event"), yg(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function xg(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return v`
      ${Di(
      "autoByDoubleToggle",
      h("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => rs(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? v`<div class="cflag">${P(h("binding.window"), Ve({
      value: i.windowSec,
      rule: bg,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => rs(t, e, { windowSec: l })
    }))}</div>` : b}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${b}`;
  const s = (l, a) => (c) => {
    var d, p;
    const u = Xt(t.level, e.id, { [l]: c });
    return rc(t, c && !((d = e.bindings) != null && d[a]) ? Wn(u, e.id, a, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = Di("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${Di("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? b : r}`;
}
function kg(t) {
  return t.props.kind !== "smart_button" || !Kc(t).length ? v`${b}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function ls(t, e) {
  return e === "control" && t.props.kind === "equipment" ? h("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? h("binding.onOff") : h(`role.${e}`);
}
const Ti = (t) => String(t).padStart(2, "0");
function Mg(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Ti(e.getHours())}:${Ti(e.getMinutes())}:${Ti(e.getSeconds())}`;
}
const _g = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function Ag(t) {
  return t.status === "error" ? t.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : h("output.errorNotConfigured") : t.last ? h("output.last").replace("{event}", _g(t.last, t.kind)).replace("{time}", Mg(t.last.at)) : h("output.none");
}
function Sg(t, e) {
  if (!Zn(e.props.kind)) return b;
  const n = t.feed.stateOf(e), i = n ? Ag(n) : t.feed.error ?? (t.feed.ready ? h("output.notSaved") : null);
  return i === null ? b : v`<p class="note" data-field="output">${i}</p>`;
}
function Eg(t, e, n, i) {
  const s = ua(t.meta, i, t.states), o = Zc(t.level, e, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : b}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : b}
    ${o.length ? v`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : b}`;
}
function Ig(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = ls(e, i);
  return v`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${h("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${no(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = Wn(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && bs(i) ? $g(t, e, i) : b}
    ${s ? Eg(t, e, i, s) : b}
  </div>`;
}
function Cg(t) {
  const e = t.device, n = ys(t.level.devices.map(t.status));
  return v`<div class="props bprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : b}
    ${t.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${h(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : b}
    ${e ? v`
      <h4>${fi(e)}</h4>
      ${Js(e, (i) => t.commit(Xt(t.level, e.id, {}, i)))}
      ${Sg(t, e)}
      ${ve(e).map((i) => v`${Ig(t, e, i)}${xg(t, e, i.role)}`)}
      ${kg(e)}` : v`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const Pg = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Lg = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Og = 6, zg = ["A", "0", "B"], Dg = ["power", "control"], Ng = ["power", "power_in", "power_out", "voltage", "control"], ut = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function $t(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function xt(t, e, n, i, s, o) {
  return v`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${no(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function Tg(t, e) {
  const n = e.name ?? "";
  return P(h("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${e.kind}`)} .value=${K(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(jt(t.power, e.id, { name: o }, ut(t))) : s.value = n;
  }} />`);
}
function Vg(t, e) {
  const n = new Set(ve(e).map((i) => i.role));
  return v`${Dg.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${$n(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function un(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function Hg(t, e) {
  var o;
  const n = ve(e), i = Ng.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return v`
    ${Js(e, (r) => un(t, Xt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${ls(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${no(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${ls(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), un(t, Wn(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? Ge(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => un(t, Jn(t.level, e.id, r))
  ) : b}
    ${s.kind === "equipment" ? Ge("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const l = wa(t.level, t.power, e.id, r);
    return un(t, l.level, l.power);
  }) : b}`;
}
function Rg(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
  const i = ft(n) ? b : Ge("output", h("power.enableOutput"), e.output !== !1, (s) => {
    const o = ut(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(oi(jt(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${Hg(t, n)}${i}` : v`
    ${P(h("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${P(h("props.kind"), v`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${Vg(t, n)}${i}`;
}
function Bg(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return v`
    ${P(h("power.form"), G(e.form, i, (r) => {
    r !== e.form && t.commitPower(jt(t.power, e.id, { form: r }, ut(t)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${zg.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function Fg(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, c) => {
    if (a === i && c === s) return !1;
    t.commitPower(jt(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, ut(t)));
  }, r = (a, c, u) => Ve({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: u }), l = ["h", "v"].map((a) => ({ v: a, label: h(`power.orientation.${a}`) }));
  return v`
    ${P(h("power.orientation"), G(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(jt(t.power, e.id, { w: e.h, h: e.w }, ut(t)));
  }, "bus-orientation"))}
    ${P(h("power.busLength"), r("bus-length", i, (a) => o(Math.max(ts, s + 1, a), s)))}
    ${P(h("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(Og, a), i - 1))))}`;
}
function Ug(t, e) {
  switch (e.kind) {
    case "grid":
      return v`
      ${xt(t, "power", h("power.field.power"), Ue, e.power, (n) => $t(t, e, "power", n))}
      ${xt(t, "voltage", h("power.field.voltage"), Pg, e.voltage, (n) => $t(t, e, "voltage", n))}`;
    case "device":
      return Rg(t, e);
    case "battery":
      return v`
      ${xt(t, "power", h("power.field.batteryPower"), Ue, e.power, (n) => $t(t, e, "power", n))}
      ${xt(t, "soc", h("power.field.soc"), Lg, e.soc, (n) => $t(t, e, "soc", n))}`;
    case "pv":
      return xt(t, "power", h("power.field.power"), Ue, e.power, (n) => $t(t, e, "power", n));
    case "transfer":
      return Bg(t, e);
    case "bus":
      return Fg(t, e);
    default:
      return b;
  }
}
function jg(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return v`
    <h4>${i ? fi(i) : h(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? b : Tg(t, e)}
    ${Ug(t, e)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Xu(t.power, e.id))}>${h("power.autoPorts")}</button>` : b}
      ${e.kind === "grid" ? b : v`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(ha(t.power, e.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function Wg(t, e) {
  var s, o;
  const n = ut(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? li(l, n) || h(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return v`
    <h4>${h("power.wire")}</h4>
    ${P(h("power.wire.from"), v`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${P(h("power.wire.to"), v`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${P(h("power.wire.power"), v`<span class="val ro" data-field="wire-power">${nt((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(va(t.power, e.id))}>${h("action.delete")}</button></div>`;
}
function qg(t) {
  const e = ba(t.level, t.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Ka(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${h("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${h("power.help.device")}</p>
    ${e.length === 0 ? v`<p class="muted" data-note="no-devices">${h("power.noDevices")}</p>` : v`<div class="pdevs">
      ${e.map((i) => v`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${fi(i)}</span>
      </button>`)}
    </div>`}`;
}
function Zg(t) {
  if (t.toolId === "power-device") return qg(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return jg(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Wg(t, i) : t.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function Kg(t) {
  return v`<div class="props pprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.feedError ? v`<p class="note" data-notice="feed">${t.feedError}</p>` : b}
    ${Zg(t)}
  </div>`;
}
const as = 3600;
function lc(t) {
  return { id: Z(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const Gg = (t, e) => [...t, e], Yg = (t, e) => t.map((n) => n.id === e.id ? e : n), Xg = (t, e) => t.filter((n) => n.id !== e);
function Qg(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const Fn = (t) => t.inputs.flatMap((e) => "rule" in e.source ? [e.source.rule] : []), Jg = (t, e) => t.filter((n) => n.id !== e && Fn(n).includes(e));
function e1(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of Fn(l)) {
      const c = s(a, [...r, o]);
      if (c) return c;
    }
    return i.add(o), null;
  };
  for (const o of Fn(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const Dr = (t) => Number.isInteger(t) && t >= 0 && t <= as;
function t1(t, e, n, i) {
  const s = [];
  e.name.trim() || s.push("name"), e.inputs.length === 0 && s.push("inputs"), [
    ...e.inputs.flatMap((l) => "device" in l.source ? [l.source.device] : []),
    ...e.onTrue.map((l) => l.device),
    ...e.onFalse.map((l) => l.device)
  ].some((l) => !n(l)) && s.push("device-missing");
  const r = new Set(t.map((l) => l.id));
  return Fn(e).some((l) => l !== e.id && !r.has(l)) && s.push("rule-missing"), e1(t, e) && s.push("cycle"), (!Dr(e.onDelay) || !Dr(e.offDelay)) && s.push("delay"), i && [...e.onTrue, ...e.onFalse].some((l) => {
    const a = i(l.device);
    return a !== void 0 && !a.includes(l.do);
  }) && s.push("action"), s;
}
function n1(t, e, n) {
  const i = lc(e);
  if (i.name = e !== null && n ? `Leak ${n} -> valve` : "Leak -> valve", e === null) return i;
  const s = t.levels.find((l) => l.zones.some((a) => a.id === e));
  if (!s) return i;
  const o = Ps(s, e).filter((l) => l.participates).map((l) => l.device);
  i.inputs = o.filter((l) => l.props.kind === "leak_sensor").map((l) => ({ source: { device: l.id } }));
  const r = o.filter((l) => l.props.kind === "valve");
  return r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "close" }]), i;
}
const i1 = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), s1 = (t) => i1.has(t.props.kind);
function We(t) {
  const e = t.props;
  return e.kind === "valve" ? ["open", "close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
function cs(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function o1(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function ac(t) {
  const e = `${h(`rules.did.${t.action}`)} ${t.target} ${o1(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function r1(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${h("rules.status.error")}: ${e.reason}` : h(`rules.status.${e.status}`) : t.enabled === !1 ? h("rules.status.disabled") : n.live ? h("rules.unsaved") : h("rules.noTrace");
}
function l1(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !cs(r, t);
  return v`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${h(`rules.verdict.${s}`)}
        title=${h(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? v` <span class="orphan">(${h("rules.orphan")})</span>` : b}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${r1(t, i, n)}</span>
        ${l ? v`<span class="runsaved">${h("rules.unsavedChanges")}</span>` : b}
        ${o > 0 ? v`<span class="rwarn">${o === 1 ? h("rules.unknown1") : h("rules.unknownN").replace("{n}", String(o))}</span>` : b}
        ${i != null && i.last ? v`<span class="rlast">${ac(i.last)}</span>` : b}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${h("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${h("rules.delete")}</button>
      </div>
    </div>`;
}
function a1(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = Qg(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return v`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : h("rules.noZone")}</h4>
      ${t.feedError ? v`<p class="muted">${t.feedError}</p>` : b}
      ${n === null && i.length === 0 && t.rules.length === 0 ? v`<p class="muted">${h("rules.hint")}</p>` : b}
      ${i.length === 0 ? v`<p class="muted rempty">${h("rules.empty")}</p>` : i.map((s) => l1(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const c1 = { condition: Pp, leak: Ca };
function d1(t) {
  return ["condition", "leak"].map((e) => v`
    <button class="tool" data-template=${e} title=${h(`rules.template.${e}`)} @click=${() => t(e)}>
      <svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${M`<path d=${c1[e]}></path>`}</svg>
      <span class="tlabel">${h(`rules.template.${e}`)}</span></button>`);
}
function u1(t, e) {
  return t.mode === "automation" ? v`<div class="tools">${Za(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${d1((n) => t.openRuleDialog(n))}</div>` : t.mode !== "binding" ? hm(t.mode, t.toolId, (n) => t.pickTool(n)) : Mm({
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
function p1(t, e) {
  var i;
  const n = t.selection;
  return Cg({
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
function f1(t, e) {
  var i;
  if (t.mode === "binding") return p1(t, e);
  if (t.mode === "automation")
    return v`<div class="props">${a1({
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
    return Kg({
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
  return t.mode === "equipment" ? Km({
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
  }) : tg({
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
function h1(t, e) {
  switch (t) {
    case "wall":
      return [["Shift", h("hint.shift")], [h("hint.digits"), h("hint.length")], ["Tab", h("hint.tab")], ["Esc", h("hint.esc")]];
    case "box":
      return [[h("hint.digits"), h("hint.size")], ["Tab", h("hint.tabSize")], ["Esc", h("hint.esc")]];
    case "zone":
      return e === "polygon" ? [
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
function m1(t, e) {
  const n = t === "zone" ? `${h("tool.zone")} · ${h(`zones.kind.${e}`)}` : h(`tool.${t}`);
  return v`<span class="tool-chip">${qa(t)}${n}</span>`;
}
function g1(t) {
  return v`
    <div class="status">
      ${m1(t.tool, t.zoneMethod)}
      ${h1(t.tool, t.zoneMethod).map(([e, n]) => v`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? v`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${h(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? b : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function w1(t, e) {
  var o, r;
  const n = e.palette, i = 1 / e.scale, s = [
    {
      label: h(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((o = e.live) == null ? void 0 : o.first) ?? "",
      active: t.field === "first",
      unit: h("unit.mm")
    },
    {
      label: h(e.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: t.second,
      live: ((r = e.live) == null ? void 0 : r.second) ?? "",
      active: t.field === "second",
      unit: e.mode === "box" ? h("unit.mm") : "°"
    }
  ];
  return M`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((l, a) => M`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function v1(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = s[0], u = Math.hypot(c.x - a.x, c.y - a.y);
    let d = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: je(u), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: je(r), second: je(l) };
}
function b1(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const y1 = el`
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

  /* Rule dialog: about 90 % of the viewport; settings scroll on the left, the flowchart is on the right. */
  .dialog.rdlg { box-sizing: border-box; width: 90%; height: 90%; max-width: none; display: flex; flex-direction: column; padding: 14px 18px; }
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
  svg.fc { width: 100%; height: auto; max-height: 100%; flex: none; }
  .fc-blk { cursor: pointer; }
  .fc-box { fill: var(--ch-card); stroke: var(--ch-divider); stroke-width: 1.5; }
  .fc-blk:hover .fc-box { stroke: var(--ch-primary); }
  .fc-blk.hl .fc-box { stroke: var(--ch-primary); stroke-width: 2.5; fill: var(--ch-tint); }
  .fc-blk.on .fc-box { stroke: #22c55e; }
  .fc-blk.nodata .fc-box { stroke: #f59e0b; stroke-dasharray: 5 3; }
  .fc-t1 { fill: var(--ch-text); font-size: 13px; font-weight: 500; }
  .fc-t2, .fc-head { fill: var(--ch-muted); font-size: 12px; }
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
`, $1 = 5e-3, x1 = 2, Un = (t) => Math.max($1, Math.min(x1, t));
function k1(t, e, n) {
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
function M1(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Un(Math.min(e, n) / 12e3) };
  const i = t.map((d) => d.x), s = t.map((d) => d.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, c = Math.max(...s) + o, u = Un(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / u / 2, y: (a + c) / 2 - n / u / 2, scale: u };
}
function _1(t, e, n, i, s) {
  const o = Un(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function A1(t, e, n) {
  const i = Un(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function S1(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Nr(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function E1(t, e, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * t.scale >= 6 ? 100 * s : o, l = 1 / t.scale;
  return M`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const I1 = ["Shift", "Control", "Alt", "Meta"], C1 = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, P1 = new Map(Object.entries(Wa).map(([t, e]) => [`Key${e}`, t]));
function Tr(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class L1 {
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
          this.h.view = S1(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.view = A1(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Tr(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? P1.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = C1[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Tr(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !I1.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function cc(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function O1(t) {
  return v`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", cc(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function Qe(t, e, n, i) {
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
function z1(t) {
  var n;
  const e = { action: "cancel", label: h("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? Qe(h("draft.title"), h("draft.text").replace("{time}", cc(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => t.discard(i) }
      ]) : b;
    }
    case "new":
      return Qe(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return Qe(h("delete.title"), h("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return Qe(h("delete.rule.title"), h("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: h("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? h("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return Qe(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return Qe(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return b;
  }
}
const kt = "plan_studio.draft.", pn = "plan_studio.lastPlanId";
function D1() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function N1(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class T1 {
  constructor(e = D1, n = 500) {
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
      (n = this.storage()) == null || n.setItem(kt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(kt + e), s = i ? JSON.parse(i) : null;
      return N1(s) && s.planId === e ? s : null;
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
        if (!(s != null && s.startsWith(kt))) continue;
        const o = this.read(s.slice(kt.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(pn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(pn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(pn)) === e && n.removeItem(pn);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(kt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const dc = 5e3, uc = 12;
function Vr(t) {
  t().catch(() => {
  });
}
class V1 {
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
      this.setFailure(h("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Vr(n.unsub));
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
          Vr(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(fe(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= uc || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, dc));
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
const H1 = 5e3, R1 = 12;
function Hr(t) {
  t().catch(() => {
  });
}
class B1 {
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
      this.setFailure(h("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Hr(n.unsub));
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
          Hr(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(fe(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= R1 || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, H1));
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
function so(t) {
  return t === "gate" ? "combine" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const ds = 210, Mt = 50, us = 90, ps = 150, pc = 230, fn = 44, _t = 26, oo = 44, Dt = 10, xn = Dt + ds + oo, kn = xn + us + oo, St = kn + ps + oo, F1 = 1.25, Rr = St + pc + Dt, Br = (t) => Number.isFinite(t) ? String(t) : "?", Fr = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t;
function U1(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
const Vi = (t) => h(`rules.val.${t === null ? "unknown" : t}`), Hi = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function hn(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return M`
    <g class="fc-blk${t.cls ?? ""}${t.opts.focused === t.field ? " hl" : ""}" data-block=${t.field} transform=${`translate(${e} ${n})`}
      @click=${() => t.opts.onFocus(t.target)}>
      <rect class="fc-box" width=${i} height=${s} rx="8"></rect>
      <text class="fc-t1" x="10" y=${t.lines[1] === void 0 ? s / 2 + 5 : 20}>${Fr(t.lines[0], t.chars)}</text>
      ${t.lines[1] === void 0 ? b : M`<text class="fc-t2" x="10" y="38">${Fr(t.lines[1], t.chars + 4)}</text>`}
    </g>`;
}
const Ur = (t, e, n, i) => {
  const s = (t + n) / 2;
  return M`<path class="fc-link" d=${`M${t} ${e} H${s} V${i} H${n}`}></path>`;
};
function j1(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = (x) => _t + 8 + Math.max(1, x) * (fn + 8), o = Math.max(1, e.inputs.length) * (Mt + 12), r = s(e.onTrue.length) + 16 + s(e.onFalse.length), l = Math.max(o, r, 150) + Dt * 2, a = l / 2, c = a - o / 2 + 6, u = a - r / 2, d = u + s(e.onTrue.length) + 16, p = e.inputs.map((x, A) => {
    const E = (i == null ? void 0 : i[A].value) ?? null;
    return E === null || !x.not ? E : !E;
  }), f = i ? U1(e.combine, p) : void 0, m = n ? n.verdict : void 0, y = n == null ? void 0 : n.pending, w = y ? Math.max(0, Math.ceil((y.at - t.now) / 1e3)) : 0, g = (n == null ? void 0 : n.unknownInputs) ?? 0, $ = [
    { side: "true", y0: u, list: e.onTrue, head: h("rules.whenTrue") },
    { side: "false", y0: d, list: e.onFalse, head: h("rules.whenFalse") }
  ], k = h("rules.flow.delay").replace("{on}", Br(e.onDelay)).replace("{off}", Br(e.offDelay)), _ = n === void 0 ? k : `${Vi(m ?? null)}${y ? `, ${h("rules.flow.pending").replace("{to}", Vi(y.to)).replace("{n}", String(w))}` : ""}`;
  return v`
    <div class="flow">
      <svg class="fc" style=${`max-width:${Rr * F1}px`} viewBox=${`0 0 ${Rr} ${l}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${h("rules.flow.title")}>
        ${e.inputs.map((x, A) => Ur(Dt + ds, c + A * (Mt + 12) + Mt / 2, xn, a))}
        ${M`<path class="fc-link" d=${`M${xn + us} ${a} H${kn}`}></path>`}
        ${$.map((x) => Ur(kn + ps, a, St, x.y0 + _t / 2))}
        ${e.inputs.map((x, A) => {
    const E = i == null ? void 0 : i[A];
    return hn({
      x: Dt,
      y: c + A * (Mt + 12),
      w: ds,
      h: Mt,
      field: `input-${A}`,
      target: { input: A },
      opts: t,
      chars: 26,
      cls: E ? Hi(E.value) : "",
      lines: [`${x.not ? "NOT " : ""}${t.inputName(x)}`, E ? E.detail : q1(x)]
    });
  })}
        ${hn({
    x: xn,
    y: a - 28,
    w: us,
    h: 56,
    field: "combine",
    target: "gate",
    opts: t,
    chars: 10,
    cls: f === void 0 ? "" : Hi(f),
    lines: [e.combine === "all" ? "ALL" : "ANY", f === void 0 ? void 0 : Vi(f)]
  })}
        ${hn({
    x: kn,
    y: a - 28,
    w: ps,
    h: 56,
    field: "delays",
    target: "delays",
    opts: t,
    chars: 19,
    cls: m === void 0 ? "" : Hi(m ?? null),
    lines: [h("rules.flow.result"), _]
  })}
        ${$.map((x) => M`
          <text class="fc-head" x=${St + 8} y=${x.y0 + _t - 8}>${x.head}</text>
          ${x.list.length === 0 ? M`<text class="fc-t2" x=${St + 10} y=${x.y0 + _t + 8 + fn / 2 + 4}>${h("rules.noActions")}</text>` : x.list.map((A, E) => hn({
    x: St,
    y: x.y0 + _t + 8 + E * (fn + 8),
    w: pc,
    h: fn,
    field: `action-${x.side}-${E}`,
    target: { action: x.side, index: E },
    opts: t,
    chars: 28,
    lines: [t.actionName(A.device), W1(A.do)]
  }))}`)}
      </svg>
      ${g > 0 ? v`<p class="fc-warn">${g === 1 ? h("rules.unknown1") : h("rules.unknownN").replace("{n}", String(g))}</p>` : b}
      ${n != null && n.last ? v`<p class="fc-last">${h("rules.flow.last")} ${ac(n.last)}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const W1 = (t) => h(`rules.act.${t}`), q1 = (t) => "rule" in t.source ? h("rules.src.rule") : h("rules.src.device"), jr = (t) => Number.isFinite(t) ? String(t) : "";
function Wr(t) {
  return t.trim() === "" ? NaN : Number(t);
}
function fc(t, e) {
  var n;
  return "device" in e.source ? ((n = t.deviceById(e.source.device)) == null ? void 0 : n.name) ?? h("rules.missingDevice") : t.ruleName(e.source.rule) ?? h("rules.missingRule");
}
function Z1(t, e, n, i) {
  const s = t.draft.rule, o = e === "true" ? "onTrue" : "onFalse", r = s[o], l = (p) => t.onChange({ ...s, [o]: p }), a = t.deviceById(i.device), c = a ? We(a) : [], u = c.includes(i.do) ? c : [...c, i.do], d = so({ action: e, index: n });
  return v`
    <div class="rline" data-field=${d} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(p) => {
    const f = t.deviceById(p.target.value);
    f && l(r.map((m, y) => y === n ? { device: f.id, do: We(f).includes(m.do) ? m.do : We(f)[0] } : m));
  }}>
        ${a && !t.actionDevices.includes(a) ? v`<option value=${a.id}>${a.name}</option>` : b}
        ${a ? b : v`<option value=${i.device}>${h("rules.missingDevice")}</option>`}
        ${t.actionDevices.map((p) => v`<option value=${p.id}>${p.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(p) => l(r.map((f, m) => m === n ? { ...f, do: p.target.value } : f))}>
        ${u.map((p) => v`<option value=${p}>${h(`rules.act.${p}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${h("rules.remove")} @click=${() => l(r.filter((p, f) => f !== n))}>&times;</button>
    </div>`;
}
function qr(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return v`
    <div class="rgroup">
      <div class="rlabel">${h(e === "true" ? "rules.whenTrue" : "rules.whenFalse")}</div>
      ${n[i].map((s, o) => Z1(t, e, o, s))}
      <select class="radd" data-action=${`add-action-${e}`} .value=${""}
        @change=${(s) => {
    const o = s.target, r = t.deviceById(o.value);
    o.value = "", r && We(r).length > 0 && t.onChange({ ...n, [i]: [...n[i], { device: r.id, do: We(r)[0] }] });
  }}>
        <option value="">${h("rules.addAction")}</option>
        ${t.actionDevices.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
      </select>
    </div>`;
}
function K1(t, e, n) {
  const i = t.draft.rule, s = "device" in e.source ? !t.deviceById(e.source.device) : t.ruleName(e.source.rule) === void 0;
  return v`
    <div class="rline${s ? " bad" : ""}" data-field=${so({ input: n })} tabindex="-1">
      <span class="grow">${fc(t, e)}</span>
      <label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(o) => {
    const r = o.target.checked;
    t.onChange({ ...i, inputs: i.inputs.map((l, a) => {
      if (a !== n) return l;
      const { not: c, ...u } = l;
      return r ? { ...u, not: !0 } : u;
    }) });
  }} /> ${h("rules.not")}</label>
      <button class="btn" data-action="remove-input" title=${h("rules.remove")}
        @click=${() => t.onChange({ ...i, inputs: i.inputs.filter((o, r) => r !== n) })}>&times;</button>
    </div>`;
}
function G1(t) {
  const e = t.draft.rule, n = (i) => {
    const s = i.target, o = s.value;
    if (s.value = "", !o) return;
    const r = o.startsWith("r:") ? { rule: o.slice(2) } : { device: o.slice(2) };
    t.onChange({ ...e, inputs: [...e.inputs, { source: r }] });
  };
  return v`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${h("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${h("rules.namePlaceholder")}
        @input=${(i) => t.onChange({ ...e, name: i.target.value })} />

      <label class="rlabel" for="rule-combine">${h("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(i) => t.onChange({ ...e, combine: i.target.value === "all" ? "all" : "any" })}>
        <option value="any">${h("rules.combine.any")}</option>
        <option value="all">${h("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${h("rules.inputs")}</div>
        ${e.inputs.length === 0 ? v`<p class="muted">${h("rules.noInputs")}</p>` : e.inputs.map((i, s) => K1(t, i, s))}
        <select class="radd" data-action="add-input" .value=${""} @change=${n}>
          <option value="">${h("rules.addInput")}</option>
          <optgroup label=${h("rules.groupDevices")}>
            ${t.inputDevices.map((i) => v`<option value=${`d:${i.id}`}>${i.name}</option>`)}
          </optgroup>
          ${t.otherRules.length > 0 ? v`<optgroup label=${h("rules.groupRules")}>
            ${t.otherRules.map((i) => v`<option value=${`r:${i.id}`}>${i.name}</option>`)}
          </optgroup>` : b}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${h("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${h("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${as} step="1" .value=${jr(e.onDelay)}
              @input=${(i) => t.onChange({ ...e, onDelay: Wr(i.target.value) })} /></label>
          <label class="grow">${h("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${as} step="1" .value=${jr(e.offDelay)}
              @input=${(i) => t.onChange({ ...e, offDelay: Wr(i.target.value) })} /></label>
        </div>
      </div>

      ${qr(t, "true")}
      ${qr(t, "false")}
    </div>`;
}
function Y1(t) {
  const e = t.draft.rule, n = e.zoneId === null || t.zones.some((s) => s.id === e.zoneId), i = (s) => t.onFocus(so(s));
  return v`
    <div class="backdrop rule-backdrop" @change=${(s) => s.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${h(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}>
        <h3>${h(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}</h3>
        <div class="rcols">
          ${G1(t)}
          ${j1({
    rule: e,
    inputName: (s) => fc(t, s),
    actionName: (s) => {
      var o;
      return ((o = t.deviceById(s)) == null ? void 0 : o.name) ?? h("rules.missingDevice");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: i
  })}
        </div>
        ${t.problems.length > 0 ? v`<ul class="rproblems" role="alert">
          ${t.problems.map((s) => v`<li data-problem=${s}>${h(`rules.problem.${s}`)}</li>`)}</ul>` : b}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${h("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(s) => t.onChange({ ...e, zoneId: s.target.value || null })}>
            <option value="">${h("rules.zone.none")}</option>
            ${n ? b : v`<option value=${e.zoneId}>${h("rules.zone.removed")}</option>`}
            ${t.zones.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(s) => {
    const { enabled: o, ...r } = e;
    t.onChange(s.target.checked ? r : { ...r, enabled: !1 });
  }} /> ${h("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${h("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${h("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const X1 = ["power", "voltage", "power_in", "power_out", "control"], Q1 = 300;
function Zr(t) {
  t().catch(() => {
  });
}
function J1(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: ft(r), controllable: Ol(r) };
    for (const a of X1) {
      const c = (s = r.bindings) == null ? void 0 : s[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class ew {
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
      }, Q1);
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
      this.setFailure(h("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Zr(n.unsub));
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
          Zr(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(fe(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= uc || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, dc));
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
const tw = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function nw(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const hc = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function iw(t, e) {
  var o;
  const n = hc(t, e);
  if (!n || n.state.trim() === "") return;
  const i = tw[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const sw = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function Mn(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (f, m, y) => {
    if (!f) return;
    l = hc(e, f);
    const w = (l == null ? void 0 : l.state) ?? "";
    s = m.includes(w) ? "on" : y.includes(w) ? "off" : "no-data";
  }, c = ["on"], u = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      o = !0;
    // falls through
    case "socket":
    case "equipment": {
      r = !!n.control, a(n.control, c, u);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      o = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], c, u), s === "on" && (s = "active");
      break;
    }
    case "wall_switch":
      a(n.state, c, u);
      break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const d = { look: s };
  if (o && l && (s === "on" || s === "active")) {
    const f = sw(l);
    f !== void 0 && (d.timerSince = f);
  }
  const p = ve(t).some((f) => f.role === "power") ? iw(e, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (d.power = p), d;
}
function mc(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: nw(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: nt(t.power), tone: "device" }), i;
}
const Ri = 1e4, Kr = 400, ow = 1e3, Gr = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), rw = ["timer", "power"], lw = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function gc(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of ve(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function aw(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function cw(t, e, n) {
  var i;
  if (t.settled) {
    const s = aw(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (Gr.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !Gr.has(e.state) ? e.state : void 0 };
}
function Yr(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return mc(s, n, i)[0];
}
function dw(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of gc(n)) e.add(i.entity);
  return [...e].sort();
}
class uw {
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
    return i && n - i.at < Ri ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < Kr).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= Ri && o < Ri + ow && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = gc(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = lw(n, l.entity);
      if (!a) continue;
      const c = o + l.entity, { value: u, text: d } = cw(l, a, this.seen.get(c));
      u !== void 0 && this.seen.set(c, { last: u }), d && this.events.set(e.id, { text: d, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = Mn(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < Kr);
      for (const l of rw) {
        const a = Yr(o, l, e, i);
        a && !Yr(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const mn = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function Xr(t) {
  t().catch(() => {
  });
}
class pw {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Xr(n.unsub));
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
        n.live ? n.unsub = i : Xr(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: mn(s.lc) ?? mn(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const c = mn(l.lc) ?? (a ? mn(l.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var fw = Object.defineProperty, B = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && fw(e, n, s), s;
};
const lo = class lo extends it {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Yc.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Nm(), this.nextObj = _m(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = pa(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new T1(), this.resizeObs = null, this.session = new Lm(this), this.haMeta = new Om(this), this.feed = new V1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new B1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new ew(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new uw(), this.entityFeed = new pw(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => jc(i, (s) => {
      var o;
      return ua(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Mp(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = zm(this), this.activeTool = ns("select", this.ctx), this.input = new L1(this);
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
    this.entityFeed.watch(e ? dw(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? J1(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var o, r;
    const e = (o = this.history) == null ? void 0 : o.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((l) => Mn(l, this.hass.states).timerSince !== void 0 || this.events.event(l.id, n) !== null || this.events.leaving(l.id, n).length > 0), s = this.modal && !!this.ruleDraft && !!((r = this.rulesFeed.trace(this.ruleDraft.rule.id)) != null && r.pending);
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
    const i = this.history.current.power, s = n ?? (i && Ku(i, e));
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
    var s;
    if (!this.plan || !this.history || this.dialog !== null) return;
    let i;
    if (n !== void 0) {
      const o = this.rules.find((r) => r.id === n);
      if (!o) return;
      i = { rule: structuredClone(o), isNew: !1, focused: null };
    } else {
      const o = this.planLevels(), r = ((s = this.selection) == null ? void 0 : s.kind) === "zone" ? this.selection.id : null, l = o.flatMap((c) => c.zones).find((c) => c.id === r);
      i = { rule: e === "leak" ? n1({ levels: o }, (l == null ? void 0 : l.id) ?? null, (l == null ? void 0 : l.name) ?? null) : lc((l == null ? void 0 : l.id) ?? null), isNew: !0, focused: null };
    }
    this.ruleDraft = i, this.dialog = { kind: "rule" }, this.updateComplete.then(() => {
      var o;
      return (o = this.renderRoot.querySelector('.rule-backdrop [data-field="name"]')) == null ? void 0 : o.focus();
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
    e.isNew ? this.commitRules(Gg(this.rules, e.rule)) : n && !cs(n, e.rule) && this.commitRules(Yg(this.rules, e.rule));
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return b;
    const n = this.planLevels(), i = n.flatMap((u) => u.devices), s = e.rule, o = this.session.savedRules.find((u) => u.id === s.id), r = !!o && cs(o, s), l = r ? this.rulesFeed.trace(s.id) : void 0, a = o ? r ? null : h("rules.flow.edited") : h("rules.flow.new"), c = n.length > 1;
    return Y1({
      draft: e,
      inputDevices: i.filter(s1),
      actionDevices: i.filter((u) => We(u).length > 0),
      deviceById: (u) => i.find((d) => d.id === u),
      otherRules: this.rules.filter((u) => u.id !== s.id),
      ruleName: (u) => {
        var d;
        return (d = this.rules.find((p) => p.id === u)) == null ? void 0 : d.name;
      },
      zones: n.flatMap((u) => u.zones.map((d) => ({ id: d.id, name: c ? `${d.name} (${u.name})` : d.name }))),
      problems: t1(
        this.rules,
        s,
        (u) => i.some((d) => d.id === u),
        (u) => {
          const d = i.find((p) => p.id === u);
          return d && We(d);
        }
      ),
      trace: l,
      note: a,
      now: Date.now(),
      onChange: (u) => {
        this.ruleDraft = { ...e, rule: u };
      },
      onFocus: (u) => this.focusRuleField(u),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    });
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(Xg(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Oi(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Oi(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = ga(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? Rs(n, e.id) : e.kind === "opening" ? Il(n, e.id) : na(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(va(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = ha(n, e.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = fe(i);
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
    this.selection = s && n && i && Oi(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = ns(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.mode = e, this.pickTool(Xs(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = Q(n, i);
    s && (this.view = Nr(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = Yl(n).get(e);
    s && (this.view = Nr(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? $m(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return k1(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = M1(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = bp(this.power, this.ctx.geo());
    e && (this.powerView = _1(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return z1({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? Jg(this.rules, this.dialog.id).map((o) => o.name) : [],
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
    var f, m, y, w;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const e = Sh(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power", d = Date.now(), p = (y = this.hass) == null ? void 0 : y.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${b1(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${pm({
      steps: gm({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (g) => {
          this.plan = { ...this.plan, name: g }, c.markDirty();
        },
        onMode: (g) => this.setMode(g)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : b,
      onPickPlan: (g) => this.session.pickPlan(g),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${u1(this, n)}
        ${f1(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? E1(this.view, l, a, e, u ? 0.1 : 1) : b}
            ${this.mode === "power" ? Mh(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Xf(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => Mn(g, p),
      bubbles: (g) => {
        const $ = Mn(g, p), k = this.events.event(g.id, d);
        return {
          shown: [...mc($, g, d), ...k ? [{ text: k.text, tone: "event", key: k.at }] : []],
          leaving: this.events.leaving(g.id, d)
        };
      }
    })}
            ${i.tracker ? w1(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: v1(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : b}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? O1({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : b}
        </div>
        ${g1({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? h(`snap.${i.snap.kind}`) : null,
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
lo.styles = y1;
let V = lo;
B([
  Me({ attribute: !1 })
], V.prototype, "hass");
B([
  Me({ type: Boolean })
], V.prototype, "narrow");
B([
  Me({ attribute: !1 })
], V.prototype, "panel");
B([
  R()
], V.prototype, "plan");
B([
  R()
], V.prototype, "loadError");
B([
  R()
], V.prototype, "selection");
B([
  R()
], V.prototype, "toolId");
B([
  R()
], V.prototype, "wallType");
B([
  R()
], V.prototype, "thickness");
B([
  R()
], V.prototype, "boxMeasure");
B([
  R()
], V.prototype, "grid");
B([
  R()
], V.prototype, "mode");
B([
  R()
], V.prototype, "bindFilter");
B([
  R()
], V.prototype, "bindQuery");
B([
  R()
], V.prototype, "railCollapsed");
B([
  R()
], V.prototype, "showAll");
B([
  R()
], V.prototype, "zoneQuery");
B([
  R()
], V.prototype, "cones");
B([
  R()
], V.prototype, "nextProps");
B([
  R()
], V.prototype, "nextObj");
B([
  R()
], V.prototype, "planView");
B([
  R()
], V.prototype, "powerView");
B([
  R()
], V.prototype, "placeDeviceId");
B([
  R()
], V.prototype, "size");
B([
  R()
], V.prototype, "dialog");
B([
  R()
], V.prototype, "notice");
B([
  R()
], V.prototype, "fieldNotice");
B([
  R()
], V.prototype, "pendingDraft");
B([
  R()
], V.prototype, "ruleDraft");
B([
  R()
], V.prototype, "plans");
B([
  R()
], V.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", V);
export {
  V as PlanStudioPanel
};
