/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wn = globalThis, uo = Wn.ShadowRoot && (Wn.ShadyCSS === void 0 || Wn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, po = Symbol(), or = /* @__PURE__ */ new WeakMap();
let pa = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== po) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (uo && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = or.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && or.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zd = (t) => new pa(typeof t == "string" ? t : t + "", void 0, po), ha = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new pa(n, t, po);
}, Gd = (t, e) => {
  if (uo) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = Wn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, rr = uo ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return Zd(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Kd, defineProperty: Xd, getOwnPropertyDescriptor: Yd, getOwnPropertyNames: Qd, getOwnPropertySymbols: Jd, getPrototypeOf: eu } = Object, je = globalThis, lr = je.trustedTypes, tu = lr ? lr.emptyScript : "", Ji = je.reactiveElementPolyfillSupport, Yt = (t, e) => t, ei = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? tu : null;
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
} }, ho = (t, e) => !Kd(t, e), ar = { attribute: !0, type: String, converter: ei, reflect: !1, useDefault: !1, hasChanged: ho };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), je.litPropertyMetadata ?? (je.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let vt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = ar) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && Xd(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = Yd(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? ar;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Yt("elementProperties"))) return;
    const e = eu(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Yt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Yt("properties"))) {
      const n = this.properties, i = [...Qd(n), ...Jd(n)];
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
      for (const s of i) n.unshift(rr(s));
    } else e !== void 0 && n.push(rr(e));
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
    return Gd(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : ei).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : ei;
      this._$Em = s;
      const d = a.fromAttribute(n, l.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? ho)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
vt.elementStyles = [], vt.shadowRootOptions = { mode: "open" }, vt[Yt("elementProperties")] = /* @__PURE__ */ new Map(), vt[Yt("finalized")] = /* @__PURE__ */ new Map(), Ji == null || Ji({ ReactiveElement: vt }), (je.reactiveElementVersions ?? (je.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis, cr = (t) => t, ti = Qt.trustedTypes, dr = ti ? ti.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, fa = "$lit$", Be = `lit$${Math.random().toFixed(9).slice(2)}$`, ma = "?" + Be, nu = `<${ma}>`, lt = document, cn = () => lt.createComment(""), dn = (t) => t === null || typeof t != "object" && typeof t != "function", fo = Array.isArray, iu = (t) => fo(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", es = `[ 	
\f\r]`, Rt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ur = /-->/g, pr = />/g, Je = RegExp(`>|${es}(?:([^\\s"'>=/]+)(${es}*=${es}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), hr = /'/g, fr = /"/g, ga = /^(?:script|style|textarea|title)$/i, va = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), v = va(1), _ = va(2), $e = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), mr = /* @__PURE__ */ new WeakMap(), tt = lt.createTreeWalker(lt, 129);
function wa(t, e) {
  if (!fo(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dr !== void 0 ? dr.createHTML(e) : e;
}
const su = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Rt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let d, p, c = -1, h = 0;
    for (; h < a.length && (r.lastIndex = h, p = r.exec(a), p !== null); ) h = r.lastIndex, r === Rt ? p[1] === "!--" ? r = ur : p[1] !== void 0 ? r = pr : p[2] !== void 0 ? (ga.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = Je) : p[3] !== void 0 && (r = Je) : r === Je ? p[0] === ">" ? (r = s ?? Rt, c = -1) : p[1] === void 0 ? c = -2 : (c = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? Je : p[3] === '"' ? fr : hr) : r === fr || r === hr ? r = Je : r === ur || r === pr ? r = Rt : (r = Je, s = void 0);
    const f = r === Je && t[l + 1].startsWith("/>") ? " " : "";
    o += r === Rt ? a + nu : c >= 0 ? (i.push(d), a.slice(0, c) + fa + a.slice(c) + Be + f) : a + Be + (c === -2 ? l : f);
  }
  return [wa(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class un {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [d, p] = su(e, n);
    if (this.el = un.createElement(d, i), tt.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = tt.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(fa)) {
          const h = p[r++], f = s.getAttribute(c).split(Be), m = /([.?@])?(.*)/.exec(h);
          a.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? ru : m[1] === "?" ? lu : m[1] === "@" ? au : Si }), s.removeAttribute(c);
        } else c.startsWith(Be) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (ga.test(s.tagName)) {
          const c = s.textContent.split(Be), h = c.length - 1;
          if (h > 0) {
            s.textContent = ti ? ti.emptyScript : "";
            for (let f = 0; f < h; f++) s.append(c[f], cn()), tt.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[h], cn());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ma) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(Be, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += Be.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = lt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Mt(t, e, n = t, i) {
  var r, l;
  if (e === $e) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = dn(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = Mt(t, s._$AS(t, e.values), s, i)), e;
}
class ou {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? lt).importNode(n, !0);
    tt.currentNode = s;
    let o = tt.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new mo(o, o.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (d = new cu(o, this, e)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = tt.nextNode(), r++);
    }
    return tt.currentNode = lt, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let mo = class ba {
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
    e = Mt(this, e, n), dn(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== $e && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : iu(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== b && dn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(lt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = un.createElement(wa(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new ou(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = mr.get(e.strings);
    return n === void 0 && mr.set(e.strings, n = new un(e)), n;
  }
  k(e) {
    fo(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new ba(this.O(cn()), this.O(cn()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = cr(e).nextSibling;
      cr(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class Si {
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
    if (o === void 0) e = Mt(this, e, n, 0), r = !dn(e) || e !== this._$AH && e !== $e, r && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = o[0], a = 0; a < o.length - 1; a++) d = Mt(this, l[i + a], n, a), d === $e && (d = this._$AH[a]), r || (r = !dn(d) || d !== this._$AH[a]), d === b ? e = b : e !== b && (e += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ru extends Si {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === b ? void 0 : e;
  }
}
class lu extends Si {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== b);
  }
}
let au = class extends Si {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Mt(this, e, n, 0) ?? b) === $e) return;
    const i = this._$AH, s = e === b && i !== b || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== b && (i === b || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class cu {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Mt(this, e);
  }
}
const ts = Qt.litHtmlPolyfillSupport;
ts == null || ts(un, mo), (Qt.litHtmlVersions ?? (Qt.litHtmlVersions = [])).push("3.3.3");
const du = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new mo(e.insertBefore(cn(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis;
let xt = class extends vt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = du(n, this.renderRoot, this.renderOptions);
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
var ua;
xt._$litElement$ = !0, xt.finalized = !0, (ua = it.litElementHydrateSupport) == null || ua.call(it, { LitElement: xt });
const ns = it.litElementPolyfillSupport;
ns == null || ns({ LitElement: xt });
(it.litElementVersions ?? (it.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const uu = { attribute: !0, type: String, converter: ei, reflect: !1, hasChanged: ho }, pu = (t = uu, e, n) => {
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
function Te(t) {
  return (e, n) => typeof n == "object" ? pu(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function B(t) {
  return Te({ ...t, state: !0, attribute: !1 });
}
function ee() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function go(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const st = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, hu = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, fu = { ...st, role: "power_in" }, mu = { ...st, role: "power_out" }, gu = { role: "sun", domains: ["sun"], primary: !0 }, vu = ["on", "off", "auto"], vo = (t) => vu.includes(t), is = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), wu = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    gu
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [is("on"), is("off"), is("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, st],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, st, hu, fu, mu]
}, wo = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, bu = { climate_sensor: "any", illuminance_sensor: "any" };
function Ee(t) {
  const e = t.props, n = wu[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function $a(t) {
  return new Set(Ee(t).map((e) => e.role));
}
function Ai(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !$a(s).has(n)) return t;
  const o = (l = s.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (o === void 0) return t;
    const a = { ...s.bindings };
    delete a[n];
    const d = { ...s, bindings: a };
    if (Object.keys(a).length === 0 && delete d.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: p, ...c } = s.props;
      d.props = c;
    }
    return { ...t, devices: t.devices.map((p) => p === s ? d : p) };
  }
  if (o === i) return t;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
function $u(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = Ee(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (bu[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function yu(t) {
  const e = Ee(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const xu = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function Os(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !vo(e) ? n : `${n}|${xu(i[e])}`;
}
function ku(t, e, n) {
  const i = Os(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && Ee(s).some((o) => Os(s, o.role) === i));
}
function Mu(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Ee(t)) {
    const s = vo(i) ? Os(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function Ii(t) {
  if (!t.bindings) return t;
  const e = $a(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const ya = (t) => t === "wall_switch" || t === "smart_button", Ci = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", pn = (t) => t === "wall" ? "wall" : "free", _u = [100, 125, 150], bo = "mdi:cube-outline", gr = ["single", "double", "hold"], Su = {
  bearing: 400
}, jn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function xa(t = ee(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function vr(t) {
  return {
    id: ee(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [xa()]
  };
}
const $o = {
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
}, _t = 90, ka = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ge(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: bo, label: "" };
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
const Au = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: bo
};
function Iu(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Au[String(n)] ?? bo;
  return { ...t, props: { ...i, icon: s } };
}
function Cu(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = pn(t.placement.mode);
  return e ? { ...t, props: Ge("smart_button", n), bindings: { on: e } } : { ...t, props: Ge("wall_switch", n) };
}
const Ma = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Eu(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Ma(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function Du(t) {
  const e = t.props.kind;
  if (!Ci(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Ge(e, pn(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? Eu(r, o) : s === "windowSec" ? Ma(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function Lu(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function Pu(t) {
  if (!Ci(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function Ou(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Ii(Lu(Pu(Du(Cu(Iu(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function T(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function D(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function E(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function U(t, e) {
  return t.x * e.x + t.y * e.y;
}
function de(t, e) {
  return t.x * e.y - t.y * e.x;
}
function _a(t) {
  return Math.hypot(t.x, t.y);
}
function O(t, e) {
  return _a(D(e, t));
}
function Ei(t) {
  const e = _a(t);
  return e === 0 ? { x: 0, y: 0 } : E(t, 1 / e);
}
function ie(t) {
  return { x: t.y, y: -t.x };
}
function Sa(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function Me(t, e, n, i) {
  const s = de(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = de(D(n, t), i) / s;
  return T(t, E(e, o));
}
function Di(t, e, n) {
  const i = D(n, e), s = U(i, i);
  return s === 0 ? 0 : U(D(t, e), i) / s;
}
function Ae(t, e, n) {
  const i = D(n, e), s = U(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, U(D(t, e), i) / s));
  return O(t, T(e, E(i, o)));
}
function St(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function Ie(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let Ke = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function Nu(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Fe(t, e, n) {
  const i = new Ke(null, null);
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
function ss(t, e, n, i) {
  const s = new Ke(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = Fe(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function wr(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = Fe(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function Tu(t, e, n) {
  return e === null ? t : (t === null || (e = Fe(t.key, e, n), e.left = t), e);
}
function Ns(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && Ns(t.left, o, !1, i, s), t.right && Ns(t.right, o, !0, i, s);
  }
}
class yo {
  constructor(e = Nu) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = ss(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new Ke(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Fe(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = Fe(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = Fe(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Fe(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = Fe(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return Vu(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && Vs(e, n, 0, s - 1, o), this._root === null)
      this._root = Ts(e, n, 0, s), this._size = s;
    else {
      const r = Hu(
        this.toList(),
        zu(e, n),
        o
      );
      s = this._size + s, this._root = zs({ head: r }, 0, s);
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
    return Ns(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = wr(e, this._root, s);
    s(e, n) < 0 ? r = ss(n, i, r, s) : o = ss(n, i, o, s), this._root = Tu(o, r, s);
  }
  split(e) {
    return wr(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function Ts(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new Ke(r, l);
    return a.left = Ts(t, e, n, o), a.right = Ts(t, e, o + 1, i), a;
  }
  return null;
}
function zu(t, e) {
  const n = new Ke(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new Ke(t[s], e[s]);
  return i.next = null, n.next;
}
function Vu(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new Ke(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function zs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = zs(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = zs(t, s + 1, n), r;
  }
  return null;
}
function Hu(t, e, n) {
  const i = new Ke(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function Vs(t, e, n, i, s) {
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
  Vs(t, e, n, l, s), Vs(t, e, l + 1, i, s);
}
const Oe = 11102230246251565e-32, se = 134217729, Ru = (3 + 8 * Oe) * Oe;
function os(t, e, n, i, s) {
  let o, r, l, a, d = e[0], p = i[0], c = 0, h = 0;
  p > d == p > -d ? (o = d, d = e[++c]) : (o = p, p = i[++h]);
  let f = 0;
  if (c < t && h < n)
    for (p > d == p > -d ? (r = d + o, l = o - (r - d), d = e[++c]) : (r = p + o, l = o - (r - p), p = i[++h]), o = r, l !== 0 && (s[f++] = l); c < t && h < n; )
      p > d == p > -d ? (r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c]) : (r = o + p, a = r - o, l = o - (r - a) + (p - a), p = i[++h]), o = r, l !== 0 && (s[f++] = l);
  for (; c < t; )
    r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c], o = r, l !== 0 && (s[f++] = l);
  for (; h < n; )
    r = o + p, a = r - o, l = o - (r - a) + (p - a), p = i[++h], o = r, l !== 0 && (s[f++] = l);
  return (o !== 0 || f === 0) && (s[f++] = o), f;
}
function Bu(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function A(t) {
  return new Float64Array(t);
}
const Fu = (3 + 16 * Oe) * Oe, Uu = (2 + 12 * Oe) * Oe, Wu = (9 + 64 * Oe) * Oe * Oe, ft = A(4), br = A(8), $r = A(12), yr = A(16), ae = A(4);
function ju(t, e, n, i, s, o, r) {
  let l, a, d, p, c, h, f, m, $, w, g, y, k, M, x, S, C, I;
  const L = t - s, H = n - s, N = e - o, V = i - o;
  M = L * V, h = se * L, f = h - (h - L), m = L - f, h = se * V, $ = h - (h - V), w = V - $, x = m * w - (M - f * $ - m * $ - f * w), S = N * H, h = se * N, f = h - (h - N), m = N - f, h = se * H, $ = h - (h - H), w = H - $, C = m * w - (S - f * $ - m * $ - f * w), g = x - C, c = x - g, ft[0] = x - (g + c) + (c - C), y = M + g, c = y - M, k = M - (y - c) + (g - c), g = k - S, c = k - g, ft[1] = k - (g + c) + (c - S), I = y + g, c = I - y, ft[2] = y - (I - c) + (g - c), ft[3] = I;
  let W = Bu(4, ft), X = Uu * r;
  if (W >= X || -W >= X || (c = t - L, l = t - (L + c) + (c - s), c = n - H, d = n - (H + c) + (c - s), c = e - N, a = e - (N + c) + (c - o), c = i - V, p = i - (V + c) + (c - o), l === 0 && a === 0 && d === 0 && p === 0) || (X = Wu * r + Ru * Math.abs(W), W += L * p + V * l - (N * d + H * a), W >= X || -W >= X)) return W;
  M = l * V, h = se * l, f = h - (h - l), m = l - f, h = se * V, $ = h - (h - V), w = V - $, x = m * w - (M - f * $ - m * $ - f * w), S = a * H, h = se * a, f = h - (h - a), m = a - f, h = se * H, $ = h - (h - H), w = H - $, C = m * w - (S - f * $ - m * $ - f * w), g = x - C, c = x - g, ae[0] = x - (g + c) + (c - C), y = M + g, c = y - M, k = M - (y - c) + (g - c), g = k - S, c = k - g, ae[1] = k - (g + c) + (c - S), I = y + g, c = I - y, ae[2] = y - (I - c) + (g - c), ae[3] = I;
  const te = os(4, ft, 4, ae, br);
  M = L * p, h = se * L, f = h - (h - L), m = L - f, h = se * p, $ = h - (h - p), w = p - $, x = m * w - (M - f * $ - m * $ - f * w), S = N * d, h = se * N, f = h - (h - N), m = N - f, h = se * d, $ = h - (h - d), w = d - $, C = m * w - (S - f * $ - m * $ - f * w), g = x - C, c = x - g, ae[0] = x - (g + c) + (c - C), y = M + g, c = y - M, k = M - (y - c) + (g - c), g = k - S, c = k - g, ae[1] = k - (g + c) + (c - S), I = y + g, c = I - y, ae[2] = y - (I - c) + (g - c), ae[3] = I;
  const z = os(te, br, 4, ae, $r);
  M = l * p, h = se * l, f = h - (h - l), m = l - f, h = se * p, $ = h - (h - p), w = p - $, x = m * w - (M - f * $ - m * $ - f * w), S = a * d, h = se * a, f = h - (h - a), m = a - f, h = se * d, $ = h - (h - d), w = d - $, C = m * w - (S - f * $ - m * $ - f * w), g = x - C, c = x - g, ae[0] = x - (g + c) + (c - C), y = M + g, c = y - M, k = M - (y - c) + (g - c), g = k - S, c = k - g, ae[1] = k - (g + c) + (c - S), I = y + g, c = I - y, ae[2] = y - (I - c) + (g - c), ae[3] = I;
  const Q = os(z, $r, 4, ae, yr);
  return yr[Q - 1];
}
function qu(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= Fu * d ? a : -ju(t, e, n, i, s, o, d);
}
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(8);
A(8);
A(8);
A(4);
A(8);
A(8);
A(16);
A(12);
A(192);
A(192);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(8);
A(8);
A(8);
A(8);
A(8);
A(8);
A(8);
A(8);
A(8);
A(4);
A(4);
A(4);
A(8);
A(16);
A(16);
A(16);
A(32);
A(32);
A(48);
A(64);
A(1152);
A(1152);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(4);
A(24);
A(24);
A(24);
A(24);
A(24);
A(24);
A(24);
A(24);
A(24);
A(24);
A(1152);
A(1152);
A(1152);
A(1152);
A(1152);
A(2304);
A(2304);
A(3456);
A(5760);
A(8);
A(8);
A(8);
A(16);
A(24);
A(48);
A(48);
A(96);
A(192);
A(384);
A(384);
A(384);
A(768);
A(96);
A(96);
A(96);
A(1152);
const Bt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, Hs = (t, e) => {
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
let Ue = Number.EPSILON;
Ue === void 0 && (Ue = Math.pow(2, -52));
const Zu = Ue * Ue, xr = (t, e) => {
  if (-Ue < t && t < Ue && -Ue < e && e < Ue)
    return 0;
  const n = t - e;
  return n * n < Zu * t * e ? 0 : t < e ? -1 : 1;
};
class Gu {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new kr(), this.yRounder = new kr();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class kr {
  constructor() {
    this.tree = new yo(), this.round(0);
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
    if (i !== null && xr(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && xr(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const hn = new Gu(), qn = (t, e) => t.x * e.y - t.y * e.x, Aa = (t, e) => t.x * e.x + t.y * e.y, Mr = (t, e, n) => {
  const i = qu(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, ni = (t) => Math.sqrt(Aa(t, t)), Ku = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return qn(s, i) / ni(s) / ni(i);
}, Xu = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Aa(s, i) / ni(s) / ni(i);
}, _r = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Sr = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, Yu = (t, e, n, i) => {
  if (e.x === 0) return Sr(n, i, t.x);
  if (i.x === 0) return Sr(t, e, n.x);
  if (e.y === 0) return _r(n, i, t.y);
  if (i.y === 0) return _r(t, e, n.y);
  const s = qn(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = qn(o, e) / s, l = qn(o, i) / s, a = t.x + l * e.x, d = n.x + r * i.x, p = t.y + l * e.y, c = n.y + r * i.y, h = (a + d) / 2, f = (p + c) / 2;
  return {
    x: h,
    y: f
  };
};
class we {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = we.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : qe.compare(e.segment, n.segment));
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
        sine: Ku(this.point, e.point, o.point),
        cosine: Xu(this.point, e.point, o.point)
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
let Qu = 0;
class qe {
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
    const l = e.leftSE.point.y, a = n.leftSE.point.y, d = e.rightSE.point.y, p = n.rightSE.point.y;
    if (i < s) {
      if (a < l && a < d) return 1;
      if (a > l && a > d) return -1;
      const c = e.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const h = n.comparePoint(e.rightSE.point);
      return h !== 0 ? h : -1;
    }
    if (i > s) {
      if (l < a && l < p) return -1;
      if (l > a && l > p) return 1;
      const c = n.comparePoint(e.leftSE.point);
      if (c !== 0) return c;
      const h = e.comparePoint(n.rightSE.point);
      return h < 0 ? 1 : h > 0 ? -1 : 1;
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
      const c = d - l, h = o - i, f = p - a, m = r - s;
      if (c > h && f < m) return 1;
      if (c < h && f > m) return -1;
    }
    return o > r ? 1 : o < r || d < p ? -1 : d > p ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++Qu, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const l = we.comparePoints(e, n);
    if (l < 0)
      s = e, o = n, r = 1;
    else if (l > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new we(s, !0), d = new we(o, !1);
    return new qe(a, d, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = Hs(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, d = Bt(n, l) && this.comparePoint(l) === 0, p = Bt(i, o) && e.comparePoint(o) === 0, c = Bt(n, a) && this.comparePoint(a) === 0, h = Bt(i, r) && e.comparePoint(r) === 0;
    if (p && d)
      return h && !c ? r : !h && c ? a : null;
    if (p)
      return c && o.x === a.x && o.y === a.y ? null : o;
    if (d)
      return h && r.x === l.x && r.y === l.y ? null : l;
    if (h && c) return null;
    if (h) return r;
    if (c) return a;
    const f = Yu(o, this.vector(), l, e.vector());
    return f === null || !Bt(s, f) ? null : hn.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, s = new we(e, !0), o = new we(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new qe(s, r, this.rings.slice(), this.windings.slice());
    return we.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), we.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = qe.compare(n, i);
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
      const d = this.rings[l], p = this.windings[l], c = n.indexOf(d);
      c === -1 ? (n.push(d), i.push(p)) : i[c] += p;
    }
    const o = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const d = n[l], p = d.poly;
      if (r.indexOf(p) === -1)
        if (d.isExterior) o.push(p);
        else {
          r.indexOf(p) === -1 && r.push(p);
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
    switch (ye.type) {
      case "union": {
        const i = e.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        e.length < n.length ? (i = e.length, s = n.length) : (i = n.length, s = e.length), this._isInResult = s === ye.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${ye.type}`);
    }
    return this._isInResult;
  }
}
class Ar {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = hn.round(e[0][0], e[0][1]);
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
      let a = hn.round(e[r][0], e[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(qe.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(qe.fromRing(o, s, this));
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
class Ju {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Ar(e[0], this, !0), this.bbox = {
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
      const o = new Ar(e[i], this, !1);
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
class Ir {
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
      const o = new Ju(e[i], this);
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
class ii {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const d = [l], p = l.point, c = [];
      for (; r = l, l = a, d.push(l), l.point !== p; )
        for (; ; ) {
          const h = l.getAvailableLinkedEvents();
          if (h.length === 0) {
            const $ = d[0].point, w = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${$.x}, ${$.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (h.length === 1) {
            a = h[0].otherSE;
            break;
          }
          let f = null;
          for (let $ = 0, w = c.length; $ < w; $++)
            if (c[$].point === l.point) {
              f = $;
              break;
            }
          if (f !== null) {
            const $ = c.splice(f)[0], w = d.splice($.index);
            w.unshift(w[0].otherSE), n.push(new ii(w.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = h.sort(m)[0].otherSE;
          break;
        }
      n.push(new ii(d));
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
    for (let d = 1, p = this.events.length - 1; d < p; d++) {
      const c = this.events[d].point, h = this.events[d + 1].point;
      Mr(c, e, h) !== 0 && (n.push(c), e = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Mr(i, e, s) === 0 && n.shift(), n.push(n[0]);
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
class Cr {
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
class ep {
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
        if (o.isExteriorRing()) n.push(new Cr(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new Cr(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class tp {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : qe.compare;
    this.queue = e, this.tree = new yo(n), this.segments = [];
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
          const h = this._splitSafely(l, c);
          for (let f = 0, m = h.length; f < m; f++)
            i.push(h[f]);
        }
      }
      let p = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (p = c), !a.isAnEndpoint(c))) {
          const h = this._splitSafely(a, c);
          for (let f = 0, m = h.length; f < m; f++)
            i.push(h[f]);
        }
      }
      if (d !== null || p !== null) {
        let c = null;
        d === null ? c = p : p === null ? c = d : c = we.comparePoints(d, p) <= 0 ? d : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const h = n.split(c);
        for (let f = 0, m = h.length; f < m; f++)
          i.push(h[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const d = l.getIntersection(a);
        if (d !== null) {
          if (!l.isAnEndpoint(d)) {
            const p = this._splitSafely(l, d);
            for (let c = 0, h = p.length; c < h; c++)
              i.push(p[c]);
          }
          if (!a.isAnEndpoint(d)) {
            const p = this._splitSafely(a, d);
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
  _splitSafely(e, n) {
    this.tree.remove(e);
    const i = e.rightSE;
    this.queue.remove(i);
    const s = e.split(n);
    return s.push(i), e.consumedBy === void 0 && this.tree.add(e), s;
  }
}
const Er = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, np = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class ip {
  run(e, n, i) {
    ye.type = e, hn.reset();
    const s = [new Ir(n, !0)];
    for (let c = 0, h = i.length; c < h; c++)
      s.push(new Ir(i[c], !1));
    if (ye.numMultiPolys = s.length, ye.type === "difference") {
      const c = s[0];
      let h = 1;
      for (; h < s.length; )
        Hs(s[h].bbox, c.bbox) !== null ? h++ : s.splice(h, 1);
    }
    if (ye.type === "intersection")
      for (let c = 0, h = s.length; c < h; c++) {
        const f = s[c];
        for (let m = c + 1, $ = s.length; m < $; m++)
          if (Hs(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new yo(we.compare);
    for (let c = 0, h = s.length; c < h; c++) {
      const f = s[c].getSweepEvents();
      for (let m = 0, $ = f.length; m < $; m++)
        if (o.insert(f[m]), o.size > Er)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new tp(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const f = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > Er)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > np)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const h = r.process(c);
      for (let f = 0, m = h.length; f < m; f++) {
        const $ = h[f];
        $.consumedBy === void 0 && o.insert($);
      }
      l = o.size, a = o.pop();
    }
    hn.reset();
    const d = ii.factory(r.segments);
    return new ep(d).getGeom();
  }
}
const ye = new ip(), sp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("union", t, n);
}, op = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("intersection", t, n);
}, rp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("xor", t, n);
}, lp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("difference", t, n);
};
var Ia = {
  union: sp,
  intersection: op,
  xor: rp,
  difference: lp
};
const Ca = 3, ap = 1e-6;
function Li(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function J(t, e) {
  const n = Li(t, e);
  return { x: n.x, y: n.y };
}
function ut(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : O(i, s);
}
function Ea(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: Ei(D(e, t)), len: O(t, e), leftOff: o, rightOff: r };
}
function le(t, e) {
  return Ea(J(t, e.a), J(t, e.b), e.thickness, e.baseline);
}
function Qe(t, e) {
  const n = D(e, t.a);
  return { t: U(n, t.dir), side: U(n, ie(t.dir)) };
}
function Dr(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const wt = (t) => T(t.p, E(ie(t.u), t.offL)), bt = (t) => D(t.p, E(ie(t.u), t.offR));
function nt(t, e, n) {
  return t !== null && O(t, e) <= n;
}
function cp(t) {
  const e = [];
  for (const n of t.walls) {
    const i = le(t, n);
    if (i.len < 1e-9) continue;
    const s = ie(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: T(i.a, E(s, i.leftOff)),
        ar: D(i.a, E(s, i.rightOff)),
        bl: T(i.b, E(s, i.leftOff)),
        br: D(i.b, E(s, i.rightOff))
      }
    });
  }
  return e;
}
function dp(t, e) {
  const n = e.f, i = ie(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = U(D(s.far, n.a), i) >= 0 ? T(n.a, E(i, n.leftOff)) : D(n.a, E(i, n.rightOff)), l = Ca * Math.max(s.body.wall.thickness, e.wall.thickness), a = Me(wt(s), s.u, r, n.dir), d = Me(bt(s), s.u, r, n.dir);
    nt(a, s.p, l) && (s.body.c[s.leftKey] = a), nt(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function up(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Ca * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = Me(bt(o), o.u, wt(r), r.u);
    nt(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = pp(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = D(r, o), a = de(l, D(e, o)), d = de(l, D(s.far, o));
    a * d < 0 && Rs(s, [e]);
  }
}
function Rs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function pp(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(de(o.u, r.u)) > 1e-9 || U(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], d = Me(bt(o), o.u, wt(a), a.u), p = Me(wt(r), r.u, wt(a), a.u);
        if (!nt(d, e, n) || !nt(p, e, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = p, Rs(o, [e, c, p]);
      } else {
        const a = t[(s - 1 + i) % i], d = Me(wt(r), r.u, bt(a), a.u), p = Me(bt(o), o.u, bt(a), a.u);
        if (!nt(p, e, n) || !nt(d, e, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = p, r.body.c[r.leftKey] = d, Rs(r, [p, c, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function xo(t) {
  const e = cp(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(Dr(r, "a")), r.wall.b === i.id && s.push(Dr(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? dp(s, o) : s.length >= 2 && up(s, { x: i.x, y: i.y });
  }
  return e;
}
function Da(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of xo(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: U(D(l, i.f.a), i.f.dir) });
    }
  return e;
}
function La(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Pi(t) {
  return new Map(xo(t).map((e) => [e.wall.id, La(e)]));
}
function Lr(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(T(s, E(D(o, s), r / (r - l))));
  }
  return n;
}
function ko(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of xo(t)) {
    const s = La(i), o = t.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && e(p)).sort((p, c) => p.offset - c.offset), r = (p) => U(D(p, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const p of o)
      l.push([a, p.offset]), a = Math.max(a, p.offset + p.width);
    l.push([a, 1 / 0]);
    const d = [];
    for (const [p, c] of l) {
      if (c <= p) continue;
      let h = s;
      p > -1 / 0 && (h = Lr(h, (f) => r(f) - p)), c < 1 / 0 && (h = Lr(h, (f) => c - r(f))), h.length >= 3 && Math.abs(Ie(h)) > ap && d.push(h);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const Bs = (t) => [t.map((e) => [e.x, e.y])];
function Pa(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Oa(t, e) {
  return Na(e ? [...ko(t).values()].flat() : [...Pi(t).values()]);
}
function Na(t) {
  const e = t.map(Bs);
  if (e.length === 0) return [];
  let n;
  try {
    n = Ia.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Pa));
}
const At = 1e-6, si = ["door", "gate", "wicket"], Ta = (t) => t === "opening", za = (t) => t.passesLight ?? Ta(t.kind), Va = (t) => t === "opening", Ha = (t) => t.passesPir ?? Va(t.kind);
function Ra(t, e) {
  return t.offset < e.offset + e.width - At && e.offset < t.offset + t.width - At;
}
function Oi(t, e, n, i, s) {
  const o = ut(t, e);
  return o === null || i <= 0 || n < -At || n + i > o + At ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && Ra(r, { offset: n, width: i }));
}
function Ot(t, e) {
  return { ...t, openings: e };
}
function hp(t, e, n, i, s, o = {}) {
  const r = s ?? jn[n], l = i - r / 2;
  if (!Oi(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: ee(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return si.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: Ot(t, [...t.openings, a]), openingId: a.id };
}
function Ba(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Oi(t, i.wallId, n, i.width, e) ? t : Mn(Ot(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function fp(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Oi(t, i.wallId, i.offset, n, e) ? t : Mn(Ot(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function mp(t, e) {
  return si.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function gp(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Mn(Ot(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function Fa(t, e) {
  return Mn(Ot(t, t.openings.filter((n) => n.id !== e)));
}
function Mn(t) {
  return Ot(t, t.openings.map((e) => {
    const n = ut(t, e.wallId), i = n === null || e.offset < -At || e.offset + e.width > n + At || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && Ra(e, s));
    return { ...e, invalid: i };
  }));
}
const oi = 1e-6;
function Ua(t, e) {
  return e.mode !== "none" && $o[t.kind].includes(e.mode);
}
function Wa(t, e, n) {
  if (n.mode === "none" || !Ua(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -_t || i > _t)) return !1;
  const s = ut(t, n.wallId);
  return s !== null && n.offset >= -oi && n.offset <= s + oi;
}
function ze(t, e) {
  return { ...t, devices: e };
}
function Pr(t, e, n, i) {
  if (!Wa(t, e, n)) return { level: t, deviceId: null };
  const s = { id: ee(), name: i, placement: n, props: e, invalid: !1 };
  return { level: ze(t, [...t.devices, s]), deviceId: s.id };
}
function ja(t, e) {
  const n = { id: ee(), name: e, placement: { mode: "none" }, props: Ge("equipment", "free"), invalid: !1 };
  return { level: ze(t, [...t.devices, n]), id: n.id };
}
const vp = ["power", "power_in", "power_out", "voltage"];
function wp(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = vp.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Nt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, qa = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function Za(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function Ga(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = Ii({ ...i, props: Za(i.props, "inverter", n), bindings: r });
  return ze(t, t.devices.map((a) => a === i ? l : a));
}
function Ni(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: Za(i.props, "controllable", n) };
  return ze(t, t.devices.map((o) => o === i ? s : o));
}
function Ka(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Ge("motion_sensor", pn(e)), s = Ge("motion_sensor", pn(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function ri(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !Wa(t, s.props, n)) return t;
  const o = Ka(s.props, s.placement.mode, n.mode);
  return Xa(ze(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function Tt(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? ze(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return Ii({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function bp(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !ya(i.props.kind) || i.props.kind === n) return t;
  const s = Ge(n, pn(i.placement.mode));
  if (!Ua(s, i.placement)) return t;
  const o = Ii({ ...i, props: s });
  return ze(t, t.devices.map((r) => r === i ? o : r));
}
function $p(t, e) {
  return ze(t, t.devices.filter((n) => n.id !== e));
}
function Xa(t) {
  return ze(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = ut(t, e.placement.wallId), i = n === null || e.placement.offset < -oi || e.placement.offset > n + oi;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function Ya(t) {
  const e = [];
  for (const n of Oa(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Fs(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!St(e, s)) continue;
    const o = Math.abs(Ie(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const rs = 1e-3;
function Qa(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Ie(t)) - Math.abs(Ie(e))) > rs ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= rs && Math.abs(n.y - i.y) <= rs));
}
const Ja = 2, Or = Math.ceil(360 / Ja), Nr = 1e-4, yp = 1e-9, Tr = 1e-9, xp = {
  light: za,
  motion: Ha
};
function ec(t, e) {
  const n = [];
  for (const i of Na([...ko(t, xp[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Mo(t, e, n) {
  return e.filter(([i, s]) => Ae(t, i, s) <= n);
}
function ls(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function kp(t, e, n) {
  const i = Mo(t, e, n), s = [];
  for (let w = 0; w < Or; w++) s.push(-Math.PI + 2 * Math.PI * w / Or);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (O(t, g) > o) continue;
      const y = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(ls(y - Nr), ls(y), ls(y + Nr));
    }
  s.sort((w, g) => w - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), d = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([w, g], y) => {
    l[y] = w.x - t.x, a[y] = w.y - t.y, d[y] = g.x - w.x, p[y] = g.y - w.y;
  });
  const c = [], h = [];
  let f = NaN;
  for (const w of s) {
    if (w === f) continue;
    f = w;
    const g = Math.cos(w), y = Math.sin(w);
    let k = n, M = -1;
    for (let C = 0; C < r; C++) {
      const I = g * p[C] - y * d[C];
      if (Math.abs(I) < 1e-12) continue;
      const L = (l[C] * p[C] - a[C] * d[C]) / I;
      if (!(L > yp && L < k)) continue;
      const H = (l[C] * y - a[C] * g) / I;
      H < -Tr || H > 1 + Tr || (k = L, M = C);
    }
    const x = { x: t.x + g * k, y: t.y + y * k }, S = c.length;
    if (!(S > 0 && c[S - 1].x === x.x && c[S - 1].y === x.y)) {
      if (M >= 0 && S >= 2 && h[S - 1] === M && h[S - 2] === M) {
        c[S - 1] = x;
        continue;
      }
      c.push(x), h.push(M);
    }
  }
  const m = c[0], $ = c[c.length - 1];
  return c.length > 1 && m.x === $.x && m.y === $.y && c.pop(), c;
}
const Mp = 32, zr = 128;
function li(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function Ne(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function _o(t) {
  return (t % 360 + 360) % 360;
}
function tc(t) {
  return (t % 360 + 540) % 360 - 180;
}
function nc(t, e, n, i) {
  const s = t.walls.find((d) => d.id === e);
  if (!s) return null;
  let o;
  try {
    o = le(t, s);
  } catch {
    return null;
  }
  const r = ie(o.dir), l = n === "left" ? r : E(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: T(T(o.a, E(o.dir, i)), E(l, a)), normal: l };
}
function fn(t, e, n, i) {
  var s;
  return ((s = nc(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function re(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: li(n.rotation) };
  const i = nc(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: T(i.pt, E(s, r)), dir: ie(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? li(Ne(s) + n.aim) : s, normal: s };
}
function Vr(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let d;
    try {
      d = le(t, a);
    } catch {
      continue;
    }
    const p = a.a === n ? d.dir : E(d.dir, -1);
    if (Math.abs(de(i, p)) < 1e-9 && U(i, p) < 0) {
      if ((U(ie(d.dir), s) > 0 ? d.leftOff : d.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (U(p, s) > 1e-9) return !1;
  }
  return l;
}
function So(t, e, n, i) {
  var H;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((N) => N.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = le(t, s);
  } catch {
    return n;
  }
  const r = Da(t), l = r.filter((N) => N.wallId === n.wallId && N.side === n.side), a = l.find((N) => N.end === "a"), d = l.find((N) => N.end === "b");
  if (!a || !d) return n;
  const p = ie(o.dir), c = n.side === "left" ? p : E(p, -1), h = n.side === "left" ? o.leftOff : o.rightOff, f = Vr(t, s, s.a, o.dir, c, h) ? -1 / 0 : a.offset, m = Vr(t, s, s.b, E(o.dir, -1), c, h) ? 1 / 0 : d.offset, $ = (N) => U(D(N, o.a), o.dir), w = [];
  for (const N of t.nodes)
    if (((H = N.host) == null ? void 0 : H.wallId) === s.id)
      for (const V of t.walls) {
        const W = V.a === N.id ? "a" : V.b === N.id ? "b" : null, X = W && t.nodes.find((z) => z.id === (W === "a" ? V.b : V.a));
        if (!X || (U(D(X, o.a), p) >= 0 ? "left" : "right") !== n.side) continue;
        const te = r.filter((z) => z.wallId === V.id && z.end === W).map((z) => $(z.pt));
        te.length && w.push([Math.min(...te), Math.max(...te)]);
      }
  w.sort((N, V) => N[0] - V[0]);
  const g = [];
  let y = f;
  for (const [N, V] of w) {
    const W = Math.min(N, m);
    W > y && g.push([y, W]), y = Math.max(y, V);
  }
  m > y && g.push([y, m]), g.length === 0 && g.push([f, m]);
  const k = ([N, V]) => Math.max(0, N - n.offset, n.offset - V), [M, x] = g.reduce((N, V) => k(V) < k(N) ? V : N), S = (e.shape === "circle" ? e.diameter : e.width) / 2, C = M + S, I = x - S;
  let L = n.offset;
  return C > I ? L = (M + x) / 2 : L <= C + i ? L = C : L >= I - i && (L = I), L = Math.max(0, Math.min(o.len, L)), Math.abs(L - n.offset) < 1e-9 ? n : { ...n, offset: L };
}
function ic(t, e) {
  const n = [];
  for (let i = 0; i < zr; i++) n.push(T(t, E(li(360 * i / zr), e)));
  return n;
}
function Hr(t, e, n, i) {
  if (n >= 360) return ic(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Mp)), o = Ne(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(T(t, E(li(o + n * l / s), i)));
  return r;
}
const _p = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Ti(t) {
  return _p[t] ?? null;
}
const Sp = (t) => Ti(t.kind) !== null;
function Ap(t, e) {
  const n = e.props;
  if (!Sp(n)) return null;
  const i = re(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Hr(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Hr(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? ic(i.pt, n.poolRadius) : null;
  }
}
function Ip(t) {
  return t.normal ? T(t.pt, t.normal) : t.pt;
}
function Rr(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Cp(t, e, n) {
  const i = D(e, t);
  for (const [s, o] of n) {
    const r = D(o, s), l = D(s, t), a = de(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const d = de(l, r) / a, p = de(l, i) / a;
    if (d >= 0 && d <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Br = 0.5, Ep = 3, Dp = 1e-4;
function Lp(t, e, n) {
  const i = re(t, e);
  if (!i) return null;
  const s = Ip(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (x) => Rr(x, n) || Mo(x, n, Br).length > 0;
  if (!r(s)) return s;
  const l = le(t, t.walls.find((x) => x.id === o.wallId)), a = i.normal, d = (x) => Math.abs(U(D(x, i.pt), a)) <= Dp, p = ([x, S]) => E(T(x, S), 0.5), c = n.filter((x) => d(x[0]) && d(x[1]) && O(x[0], x[1]) > 1e-9 && !Rr(T(p(x), E(a, Br)), n)), h = (x) => U(D(x, l.a), l.dir), f = ([x, S]) => Math.max(0, Math.min(h(x), h(S)) - o.offset, o.offset - Math.max(h(x), h(S))), m = Math.min(...c.map(f)), $ = c.filter((x) => f(x) <= m + 1e-6).map((x) => T(p(x), a)), w = (x) => $.some((S) => !Cp(x, S, n)), g = Ep * Math.max(...t.walls.map((x) => x.thickness)) + 2, y = [];
  for (const [x, S] of n) {
    const C = D(S, x), I = D(x, s), L = de(l.dir, C);
    if (Math.abs(L) < 1e-12) continue;
    const H = de(I, l.dir) / L;
    if (H < -1e-9 || H > 1 + 1e-9) continue;
    const N = de(I, C) / L, V = O(x, S) / Math.abs(L);
    y.push(N - V, N + V);
  }
  const k = o.offset <= l.len / 2 ? 1 : -1, M = y.filter((x) => Math.abs(x) <= g).sort((x, S) => Math.abs(x) - Math.abs(S) || Math.sign(S) * k - Math.sign(x) * k);
  for (const x of M) {
    const S = T(s, E(l.dir, x));
    if (!r(S) && w(S)) return S;
  }
  return null;
}
const Pp = 1 / Math.cos(Ja / 2 * (Math.PI / 180)), Fr = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function Op(t, e, n = ec) {
  const i = Ap(t, e), s = Ti(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = Lp(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((c) => O(c, r))) * Pp, a = Mo(r, o, l);
  if (a.length === 0) return [i];
  const d = kp(r, a, l);
  let p;
  try {
    p = Ia.intersection(Bs(Fr(i)), Bs(Fr(d)));
  } catch {
    return [d];
  }
  return p.flatMap((c) => c.map(Pa));
}
function Np(t, e, n, i) {
  const s = re(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, U(D(n, s.pt), s.dir)));
    return O(T(s.pt, E(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return O(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return O(s.pt, n) <= i;
  if (o.shape === "circle") return O(s.pt, n) <= o.diameter / 2 + i;
  const r = D(n, s.pt);
  return Math.abs(U(r, s.dir)) <= o.width / 2 + i && Math.abs(U(r, ie(s.dir))) <= o.depth / 2 + i;
}
function sc(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Np(t, i[o], e, n)) return i[o].id;
  return null;
}
const Tp = 60;
function Us(t, e, n) {
  if (!ka.has(e.props.kind)) return null;
  const i = re(t, e);
  return i ? { from: i.pt, to: T(i.pt, E(i.dir, Tp / n)) } : null;
}
function oc(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function zp(t, e, n, i) {
  const s = e.placement, o = re(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = Ne(D(n, o.pt)), l = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (s.mode === "free") return { ...s, rotation: _o(l(r)) };
  const a = tc(r - Ne(o.normal)), d = Math.max(-_t, Math.min(_t, l(a)));
  return oc(s, d);
}
const Vp = 1, ai = 1, Ur = 1e-6, Hp = 1e-9, Rp = 1e-6, Bp = 1;
function Ao(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = ut(t, e.wallId);
      return n === null ? null : fn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function ue(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => Ao(t, i) ?? { x: i.x, y: i.y });
}
function Io(t, e) {
  const n = ue(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Ie(n)) / 1e5) / 10;
}
function Kt(t, e, n) {
  const i = de(D(e, t), D(n, t));
  return Math.abs(i) <= Hp * O(t, e) * O(t, n) ? 0 : Math.sign(i);
}
const Dn = (t, e, n) => U(D(e, t), D(n, t)) <= 0;
function rc(t, e, n, i) {
  const s = Kt(n, i, t), o = Kt(n, i, e), r = Kt(t, e, n), l = Kt(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && Dn(n, t, e) || l === 0 && Dn(i, t, e) || s === 0 && Dn(t, n, i) || o === 0 && Dn(e, n, i);
}
function Fp(t) {
  const e = [];
  for (const n of t) (e.length === 0 || O(e[e.length - 1], n) > Ur) && e.push(n);
  for (; e.length > 1 && O(e[0], e[e.length - 1]) <= Ur; ) e.pop();
  return e;
}
function ci(t) {
  const e = Fp(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (Kt(s, o, r) === 0 && U(D(o, s), D(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && rc(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function lc(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Ao(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = ut(t, o.wallId);
    return r !== null && (o.offset < -ai || o.offset > r + ai);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = ue(t, e);
  return Math.abs(Ie(s)) < Bp || ci(s) ? "crossing" : null;
}
function zt(t, e) {
  return St(e, t) || t.some((n, i) => Ae(e, n, t[(i + 1) % t.length]) <= Vp);
}
const ac = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function Up(t, e) {
  const n = re(t, e);
  return n ? t.zones.filter((i) => zt(ue(t, i), n.pt)).map((i) => ({ zone: i, participates: ac(e, i.id) })) : [];
}
function pt(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = ue(t, n), s = [];
  for (const o of t.devices) {
    const r = re(t, o);
    r && zt(i, r.pt) && s.push({ device: o, participates: ac(o, e) });
  }
  return s;
}
function Wp(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Ie(t);
  if (Math.abs(n) > Rp) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], d = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * d, s += (l.y + a.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (St(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const as = 32;
function Wr(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, Ae(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function cc(t) {
  const e = t.zones.map((s) => ue(t, s)), n = e.map((s) => Math.abs(Ie(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter(($, w) => w !== o && $.length >= 3 && n[w] < n[o] && $.every((g) => zt(r, g))), a = Wp(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const d = r.map(($) => $.x), p = r.map(($) => $.y), c = Math.min(...d), h = Math.min(...p), f = Math.max(Math.max(...d) - c, Math.max(...p) - h) / as;
    let m = null;
    for (let $ = c + f / 2; $ < c + f * as; $ += f)
      for (let w = h + f / 2; w < h + f * as; w += f) {
        const g = { x: $, y: w };
        if (!St(g, r) || l.some((k) => St(g, k))) continue;
        const y = Math.min(Wr(g, [r]), Wr(g, l));
        (!m || y > m.d) && (m = { p: g, d: y });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const Co = 3, It = (t, e) => ({ ...t, zones: e }), mn = (t, e, n) => It(t, t.zones.map((i) => i === e ? n : i)), Eo = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), dc = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function jp(t, e) {
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
function qp(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && dc(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => jp(n, e.vertices[i]));
}
function uc(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && qp(t.shape, e.shape);
}
function Zp(t, e) {
  if (e.kind === "free") return e;
  const n = Ao(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : Eo(e);
}
function pc(t, e) {
  const n = e.shape, i = n.vertices.map((s) => Zp(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function Gp(t, e, n) {
  const i = t.shape, s = Fs(e, i.seed);
  return !s || n.some((o) => Qa(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && dc(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function hc(t, e) {
  const n = lc(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const Do = (t, e) => hc(t, pc(t, e));
function Kp(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? Ya(t) : [], i = [], s = e.map((o) => hc(
    t,
    o.shape.kind === "walls" ? Gp(o, n, i) : pc(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? It(t, s) : t;
}
function Xp(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && uc(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : It(t, i) : s.some((o, r) => o !== n[r]) ? It(t, s) : t;
}
function Yp(t, e, n) {
  const i = Ya(t), s = Fs(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = Fs(i, r.shape.seed);
    if (l && Qa(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: ee(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: It(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const Lo = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function Qp(t, e, n) {
  if (e.length < Co) return { level: t, zoneId: null };
  const i = Do(t, { id: ee(), name: n, shape: { kind: "polygon", vertices: e.map(Lo) }, invalid: !1 });
  return ci(ue(t, i)) ? { level: t, zoneId: null } : { level: It(t, [...t.zones, i]), zoneId: i.id };
}
function Jp(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : mn(t, i, { ...i, name: n });
}
function Po(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return mn(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return mn(t, i, o);
}
function fc(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function mc(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? fc(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function Oo(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function No(t, e, n) {
  const i = Do(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return uc(i, e) ? t : mn(t, e, i);
}
const To = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function eh(t, e, n, i) {
  const s = Oo(t, e);
  return !s || !To(n, s.shape.vertices.length) ? t : No(t, s, s.shape.vertices.map((o, r) => r === n ? Lo(i) : o));
}
function th(t, e, n, i) {
  const s = Oo(t, e);
  if (!s || !To(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, Lo(i)), No(t, s, o);
}
function nh(t, e, n) {
  const i = Oo(t, e);
  return !i || i.shape.vertices.length <= Co || !To(n, i.shape.vertices.length) ? t : No(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function ih(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < Co) return t;
  const i = n.shape.outline.map(Eo);
  return mn(t, n, Do(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function gc(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = fc(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const gn = 1;
function De(t) {
  return structuredClone(t);
}
function zi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function sh(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Vi(t, e, n) {
  const i = J(t, e.a), s = J(t, e.b), o = O(i, s), r = sh(typeof n == "number" ? n : Di(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Sa(i, s, r / o), offset: r };
}
function oh(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Vi(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function vc(t, e) {
  oh(t), e && ch(e, t);
  const n = Kp(Xa(Mn(t)));
  return e ? Xp(n, e) : n;
}
function Ve(t, e) {
  return vc(De(t), e);
}
function wc(t, e, n) {
  const i = Li(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Vi(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function jr(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: J(t, e.nodeId), nodeId: e.nodeId };
  const n = zi(t, e.wallId), { pt: i, offset: s } = Vi(t, n, e.offset), o = O(J(t, n.a), J(t, n.b));
  return s <= gn ? { pt: J(t, n.a), nodeId: n.a } : o - s <= gn ? { pt: J(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function qr(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: ee(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function rh(t, e, n, i) {
  const s = jr(t, e), o = jr(t, n);
  if (O(s.pt, o.pt) < gn) return { level: t, wallId: null, endNodeId: null };
  const r = De(t), l = qr(r, s), a = qr(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const d = { id: ee(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: Ve(r, t), wallId: d.id, endNodeId: a };
}
function bc(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < gn || a - l < gn ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function lh(t, e, n, i, s) {
  const o = bc(e, n, i.thickness, s);
  if (!o) return t;
  const r = De(t), l = o.map((a) => {
    const d = { id: ee(), x: a.x, y: a.y };
    return r.nodes.push(d), d.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: ee(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Ve(r, t);
}
function ah(t, e, n) {
  const i = De(t);
  return wc(i, e, n), vc(i, t);
}
function ch(t, e) {
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
    const p = Ei(D(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = Di(T(o, E(p, c.offset)), l, a) * d);
  }
}
function dh(t, e, n) {
  const i = De(t), s = zi(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: T(J(i, l), n) }));
  for (const l of r) wc(i, l.id, l.to);
  return Ve(i, t);
}
function Hi(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function $c(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function uh(t, e, n) {
  const i = De(t), s = zi(i, e), o = s[n], r = J(i, o), l = { id: ee(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || $c(i, o, l.id), Hi(i), { level: Ve(i, t), nodeId: l.id };
}
function ph(t, e, n) {
  if (e === n) return t;
  const i = De(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return $c(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), Hi(i), Ve(i, t);
}
function zo(t, e) {
  var i;
  const n = De(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return Hi(n), Ve(n, t);
}
function hh(t, e, n) {
  const i = De(t);
  return Object.assign(zi(i, e), n), Ve(i, t);
}
const ve = (t) => typeof t == "string" && t !== "" ? t : null, yc = (t) => t.split(".")[0], fh = ["friendly_name", "device_class", "unit_of_measurement"];
function xc(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: yc(t),
    name: ve(n.friendly_name) ?? t,
    deviceClass: ve(n.device_class),
    unit: ve(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function mh(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, xc(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function gh(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && fh.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function kc(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function vh(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = xc(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: ve(r.name) ?? ve(r.original_name) ?? l.name,
      deviceId: ve(r.device_id),
      areaId: ve(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: ve(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: ve(r.name_by_user) ?? ve(r.name) ?? r.id, model: ve(r.model), areaId: ve(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function wh(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Mc(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : kc(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const bh = {
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
  return bh[t] ?? t;
}
const $h = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], yh = 10;
function Vt(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Nt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function _c() {
  return { blocks: [{ id: ee(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function xh(t, e, n, i) {
  const s = { id: ee(), x: e.x, y: e.y }, o = { ...s, name: `${u(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function Zr(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Ri(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function kh(t, e, n, i) {
  return Ri(t, e, (s) => ({ ...s, x: n, y: i }));
}
const Ws = (t) => "block" in t ? t.block : t.bus, Sc = (t, e) => Ws(t.from) === e || Ws(t.to) === e;
function vn(t, e, n, i) {
  const s = t.blocks.find((d) => d.id === e);
  if (!s) return t;
  const o = Ri(t, e, (d) => ({ ...d, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((d) => !Sc(d, e)) };
  const r = o.blocks.find((d) => d.id === e), l = new Set(Vt(r, i).map((d) => d.name)), a = (d) => "block" in d && d.block === e && !l.has(d.port);
  return o.wires.some((d) => a(d.from) || a(d.to)) ? { ...o, wires: o.wires.filter((d) => !a(d.from) && !a(d.to)) } : o;
}
function Ac(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Sc(i, e)) };
}
const Ic = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function Bi(t, e, n) {
  const i = Ic(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((d) => i.has(d.id)).map((d) => [d.id, new Set(Vt(d, n).map((p) => p.name))])), o = (d) => "block" in d && !!s.get(d.block) && !s.get(d.block).has(d.port), r = t.wires.filter((d) => !o(d.from) && !o(d.to));
  let l = !1;
  const a = t.blocks.map((d) => {
    const p = s.get(d.id);
    if (!p || !d.portPins || Object.keys(d.portPins).every((m) => p.has(m))) return d;
    l = !0;
    const c = Object.fromEntries(Object.entries(d.portPins).filter(([m]) => p.has(m))), { portPins: h, ...f } = d;
    return Object.keys(c).length ? { ...f, portPins: c } : f;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Mh(t, e) {
  const n = Vo(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = Bi(s, o, n);
  return s;
}
function _h(t, e) {
  const n = Ic(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(Ws(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const Vo = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Cc(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = $p(t, n);
  return { level: s, power: i ? _h(e, n) : Bi(e, n, Vo(s)) };
}
function Ec(t, e, n, i) {
  const s = Ga(t, n, i);
  return { level: s, power: s === t ? e : Bi(e, n, Vo(s)) };
}
function Dc(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Sh(t, e, n, i) {
  return Ri(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function Ah(t, e) {
  return Ri(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function Gr(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Ih(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, yh), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((p, c) => r.set(p.id, o & 1 << c ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (p) => {
      let c = p;
      for (; l.has(c) && l.get(c) !== c; ) c = l.get(c);
      return c;
    }, d = (p, c) => {
      if ("bus" in p) return `n:${p.bus}`;
      const h = s.get(p.block);
      return h !== void 0 && p.port !== h && p.port !== (r.get(p.block) ?? "A") ? `x:${c.id}:${p.port}` : `n:${p.block}`;
    };
    for (const p of e) {
      const c = a(d(p.from, p)), h = a(d(p.to, p));
      if (c === h) return !0;
      l.set(c, h);
    }
  }
  return !1;
}
function Kr(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = s.get(g.block), k = y ? Vt(y, i).find((M) => M.name === g.port) : void 0;
    return y && k ? { bl: y, dir: k.dir } : null;
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
  const p = (g) => "block" in g && t.wires.some((y) => [y.from, y.to].some((k) => "block" in k && k.block === g.block && k.port === g.port));
  if (p(a) || p(d)) return { error: "port-taken" };
  const c = (g) => {
    for (const y of t.wires)
      for (const [k, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in k && k.bus === g && "block" in M) {
          const x = s.get(M.block);
          if (x) return Gr(x, M.port);
        }
    return null;
  }, h = (g) => "bus" in g ? c(g.bus) : Gr(s.get(g.block), g.port), f = h(a), m = h(d);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in d && s.get(d.block).kind === "remainder" && t.wires.some((g) => {
    var y;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && ((y = s.get(g.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const $ = { id: ee(), from: a, to: d }, w = [...t.wires, $];
  return Ih(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: $ };
}
const Le = (t) => typeof t == "object" && t !== null && !Array.isArray(t), kt = (t) => typeof t == "number" && Number.isFinite(t), Ch = ["top", "right", "bottom", "left"], Eh = ["2in1out", "1in2out"];
function Dh(t, e) {
  let n = t;
  if (n.kind === "bus" && !(kt(n.w) && kt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Eh.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(Vt(n, e).map((d) => d.name)), o = {};
  let r = Le(i);
  for (const [d, p] of Le(i) ? Object.entries(i) : []) {
    if (!s.has(d) || !Le(p) || !Ch.includes(p.side) || !kt(p.at)) {
      r = !1;
      continue;
    }
    const c = Math.min(1, Math.max(0, p.at));
    c !== p.at && (r = !1), o[d] = c === p.at ? p : { side: p.side, at: c };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(o).length ? { ...a, portPins: o } : a;
}
function Lh(t, e) {
  if (!Le(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const p of n)
    if (Le(p) && typeof p.id == "string" && p.id && $h.includes(p.kind) && kt(p.x) && kt(p.y)) {
      const c = Dh(p, e);
      c !== p && (s = !0), c.kind === "transfer" && c.form !== p.form && r.add(c.id), o.push(c);
    } else s = !0;
  const l = new Map(o.map((p) => [p.id, p])), a = (p) => {
    var h;
    if (!Le(p)) return null;
    if (typeof p.bus == "string") {
      if (((h = l.get(p.bus)) == null ? void 0 : h.kind) !== "bus" || !kt(p.at)) return null;
      const f = Math.min(1, Math.max(0, p.at));
      return f === p.at ? p : { bus: p.bus, at: f };
    }
    const c = typeof p.block == "string" ? l.get(p.block) : void 0;
    return c && !r.has(c.id) && Vt(c, e).some((f) => f.name === p.port) ? p : null;
  }, d = [];
  for (const p of i) {
    const c = Le(p) ? a(p.from) : null, h = Le(p) ? a(p.to) : null;
    if (!Le(p) || typeof p.id != "string" || !p.id || !c || !h) {
      s = !0;
      continue;
    }
    c === p.from && h === p.to ? d.push(p) : (s = !0, d.push({ ...p, from: c, to: h }));
  }
  return s ? { ...t, blocks: o, wires: d } : t;
}
function Lc(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function Ph(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const _n = 11, di = 18, ui = 30, Oh = 12, Nh = 120, ge = 14, Xr = 10, wn = (t) => Math.round(t / Xr) * Xr || 0, cs = 24, Yr = 6, Th = 2 * _n + 6, zh = ge, Vh = 1e6, Qr = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Fi = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), ds = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Pc = (t) => Math.min(1, Math.max(0, t));
function Ui(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function Hh(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = Nt(i);
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
function Ce(t, e, n) {
  return n ? Bo(n, t, e).r : Ho(t, e);
}
function Ho(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(Nh, 7 * Ui(t, e).length + 32),
    h: ui + di * Hh(t, e) + Oh
  };
}
function pi(t, e, n) {
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
function Rh(t, e) {
  const n = Fi(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function Bh(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = Ae(e, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Pc(r) };
}
const bn = (t) => t.w >= t.h;
function Oc(t, e) {
  return bn(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function Fh(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = bn(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: pi(i, r, 0.5), side: r };
  }
  const s = Fi(i), o = bn(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: pi(i, o, e), side: o };
}
function Uh(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const Ro = (t, e) => t.blocks.find((n) => n.id === e), js = (t, e) => {
  const n = Ro(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, us = (t, e, n) => "block" in t && t.block === e && t.port === n;
function Wh(t, e, n, i) {
  const s = t.wires.find((l) => us(l.from, e, n) || us(l.to, e, n));
  if (!s) return null;
  const o = us(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = js(t, o.bus);
    return l ? Oc(l, o.at) : null;
  }
  const r = Ro(t, o.block);
  return r ? Fi(Ho(r, i)) : null;
}
function Bo(t, e, n) {
  const i = Ho(e, n), s = Fi(i), o = Vt(e, n).map((d) => {
    var m;
    const p = (m = e.portPins) == null ? void 0 : m[d.name];
    if (p) return { ...d, side: p.side, pin: p, key: 0 };
    const c = Wh(t, e.id, d.name, n), h = (c && Rh(i, c)) ?? Uh(e, d), f = c ?? s;
    return { ...d, side: h, pin: void 0, key: h === "top" || h === "bottom" ? f.x : f.y };
  }), r = (d) => {
    const p = o.filter((c) => c.side === d).length;
    return p ? (p + 1) * Th : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((d, p) => {
    d.pin && (a[p] = { name: d.name, dir: d.dir, side: d.side, pt: pi(l, d.side, d.pin.at), pinned: !0 });
  });
  for (const d of ["top", "right", "bottom", "left"]) {
    const p = o.map((c, h) => ({ p: c, i: h })).filter(({ p: c }) => !c.pin && c.side === d).sort((c, h) => c.p.key - h.p.key || c.i - h.i);
    p.forEach(({ p: c, i: h }, f) => {
      a[h] = { name: c.name, dir: c.dir, side: d, pt: pi(l, d, (f + 1) / (p.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function Wi(t, e, n) {
  return Bo(t, e, n).places;
}
function Nc(t, e, n) {
  const i = (d) => {
    if (!("block" in d)) return null;
    const p = Ro(t, d.block);
    if (!p) return null;
    const { r: c, places: h } = Bo(t, p, n), f = h.find((m) => m.name === d.port);
    return f ? { pt: f.pt, side: f.side, rect: c } : null;
  }, s = (d, p, c) => {
    if (!("bus" in d)) return null;
    const h = js(t, d.bus);
    if (!h) return null;
    let f = c == null ? void 0 : c.pt;
    if (!f && "bus" in p) {
      const m = js(t, p.bus);
      f = m && Oc(m, p.at);
    }
    return f ? { ...Fh(h, d.at, f), rect: Ce(h, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const Ln = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), qs = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function jh(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const d = Ln(i[i.length - 2], a), p = Ln(a, l);
        if (d.x === p.x && d.y === p.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (d.x === -p.x && d.y === -p.y) return null;
      }
      i.push(l);
    }
  }
  const s = i.length;
  if (s < 2 || s > 6) return null;
  const o = Ln(i[0], i[1]), r = Ln(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || qs(i[0], i[1]) < ge - 1e-9 || r.x !== -n.x || r.y !== -n.y || qs(i[s - 2], i[s - 1]) < ge - 1e-9 ? null : i;
}
function qh(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function Zh(t, e) {
  let n = (t.length - 2) * zh;
  for (let i = 1; i < t.length; i++) {
    n += qs(t[i - 1], t[i]);
    for (const s of e) qh(t[i - 1], t[i], s) && (n += Vh);
  }
  return n;
}
function Tc(t, e) {
  const n = t.pt, i = e.pt, s = Qr[t.side], o = Qr[e.side], r = { x: n.x + s.x * ge, y: n.y + s.y * ge }, l = { x: i.x + o.x * ge, y: i.y + o.y * ge }, a = [t.rect, e.rect].filter((k) => !!k), d = (k, M) => [.../* @__PURE__ */ new Set([
    (r[k] + l[k]) / 2,
    r[k],
    l[k],
    n[k],
    i[k],
    ...a.flatMap((x) => [x[k] - ge, x[k] + x[M] + ge]),
    Math.min(r[k], l[k]) - ge,
    Math.max(r[k], l[k]) + ge
  ])], p = d("x", "w"), c = d("y", "h"), h = s.x === 0, f = o.x === 0, m = (h ? c : p).filter((k) => (k - (h ? n.y : n.x)) * (h ? s.y : s.x) >= ge - 1e-9), $ = (f ? c : p).filter((k) => (k - (f ? i.y : i.x)) * (f ? o.y : o.x) >= ge - 1e-9);
  let w = null, g = 1 / 0;
  const y = (k) => {
    const M = jh(k, s, o);
    if (!M) return;
    const x = Zh(M, a);
    x < g - 1e-6 && (w = M, g = x);
  };
  if (h && f)
    for (const k of m) for (const M of p) for (const x of $)
      y([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: x }, { x: i.x, y: x }, i]);
  else if (!h && !f)
    for (const k of m) for (const M of c) for (const x of $)
      y([n, { x: k, y: n.y }, { x: k, y: M }, { x, y: M }, { x, y: i.y }, i]);
  else if (h)
    for (const k of m) for (const M of $)
      y([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: i.y }, i]);
  else
    for (const k of m) for (const M of $)
      y([n, { x: k, y: n.y }, { x: k, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, h ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function zc(t, e, n) {
  const i = Ce(t, e, n), s = i.x + (i.w - (3 * cs + 2 * Yr)) / 2, o = i.y + ui + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (cs + Yr), y: o, w: cs, h: di - 2 }
  }));
}
function Gh(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return bn(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function Jr(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const p of s) {
    if (p.kind !== "transfer") continue;
    const c = zc(p, i, t).find((h) => ds(e, h.rect, 0));
    if (c) return { kind: "chip", block: p.id, position: c.position };
  }
  let o = null, r = 1 / 0;
  for (const p of s)
    for (const c of Wi(t, p, i)) {
      const h = O(e, c.pt);
      h <= _n + n && h < r && (o = { kind: "port", block: p.id, port: c.name }, r = h);
    }
  if (o) return o;
  for (const p of s) {
    if (p.kind !== "bus") continue;
    let c = null, h = 1 / 0;
    for (const f of Gh(p)) {
      const m = Ae(e, f.a, f.b);
      m <= n && m < h && (c = { kind: "bus-end", id: p.id, end: f.end }, h = m);
    }
    if (c) return c;
  }
  for (const p of s) {
    if (p.kind !== "bus" || !ds(e, Ce(p, i, t), n)) continue;
    const c = bn(p) ? (e.x - p.x) / p.w : (e.y - p.y) / p.h;
    return { kind: "bus", id: p.id, at: Pc(c) };
  }
  let l = null, a = 1 / 0;
  for (const p of t.wires) {
    const c = Nc(t, p, i);
    if (!c) continue;
    const h = Tc(c.a, c.b);
    for (let f = 1; f < h.length; f++) {
      const m = Ae(e, h[f - 1], h[f]);
      m <= n && m < a && (l = { kind: "wire", id: p.id }, a = m);
    }
  }
  if (l) return l;
  const d = s.find((p) => p.kind !== "bus" && ds(e, Ce(p, i, t), 0));
  return d ? { kind: "block", id: d.id } : null;
}
function Kh(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = Ce(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Vc extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function ps(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Xh(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Yh(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Vc(s.message) : s;
  }
}
async function Qh(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Jh = 3;
function _e(t) {
  if (typeof t == "number")
    return t === Jh ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class ef {
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
    const i = { ...e, id: ee(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await Yh(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Vc ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = _e(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Re = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ji = (t) => (...e) => ({ _$litDirective$: t, values: e });
let qi = class {
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
const Hc = (t) => t.strings === void 0, tf = {}, Fo = (t, e = tf) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nf = ji(class extends qi {
  constructor() {
    super(...arguments), this.key = b;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (Fo(t), this.key = e), n;
  }
});
var Rc = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", sf = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", of = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", rf = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", lf = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", af = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", cf = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", el = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Ft = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", df = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", uf = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", pf = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", hf = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Bc = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", ff = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", mf = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", gf = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", vf = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", wf = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", bf = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", $f = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", yf = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Fc = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", xf = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", kf = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", Uc = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Mf = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", _f = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Sf = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Af = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", If = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", Cf = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Ef = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Df = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Lf = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Pf = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", Wc = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", Of = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", Nf = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Tf = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function jc(t, e, n) {
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
function zf(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function Vf(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function Hf(t, e, n, i, s) {
  const o = Vf(e, n, i, s);
  if (!o.every((l) => zt(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, Ae(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function Rf(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? zf(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const h of t.zones) {
    const f = ue(t, h);
    if (f.length < 3 || !zt(f, n.pt)) continue;
    const m = Math.abs(Ie(f));
    m < a && (a = m, l = f);
  }
  if (!l) return r;
  const d = (h) => {
    const f = jc(h, i, s);
    return Hf(l, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, p = (h) => {
    let f = null, m = -1;
    for (const $ of h) {
      const w = d($);
      w !== null && w > m && (f = $, m = w);
    }
    return f;
  }, c = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const h = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (d(r) !== null) return r;
    const m = c.filter(($) => h ? $.startsWith(r) : $.endsWith(r));
    return p(m) ?? p(h ? ["right", "left"] : ["down", "up"]) ?? (d(f) !== null ? f : r);
  }
  return p(["right", "left"]) ?? p(c) ?? p(["down", "up"]) ?? r;
}
const fe = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Se(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function qc(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${u("unit.m2")}`;
}
const Sn = 12, q = "non-scaling-stroke", Bf = 7, Ff = 10, hi = "#f43f5e", tl = "3 2", nl = 18, Uf = 6, il = 11, Wf = 0.6, jf = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Zc = 24, Pn = 4, sl = 4, Zn = Sn * 0.85, qf = 0.58;
function Zf(t, e, n, i) {
  const s = Zc;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, d] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], p = a * i - 2 * sl, c = d * i - 2 * sl, h = e.length * qf * Zn, f = s + Pn + Zn, m = s + Pn + h, $ = Math.max(s, h), w = (M, x) => Math.max(0, M - p) + Math.max(0, x - c), g = w($, f), y = w(m, s);
  if (g > 0 && y < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Pn) / i,
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
    labelY: (k + s + Pn + Zn / 2) / i,
    labelAnchor: "middle"
  };
}
function Gf(t, e, n, i = 0, s = 0) {
  const o = Zc / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${jf} fill=${n}></path></g>`;
}
const Kf = "__preview__", Xf = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Yf = /* @__PURE__ */ new WeakMap();
function Qf(t, e) {
  var s;
  const n = Se(Yf, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Se(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = Se(i, t.openings, () => ({})))[e] ?? (s[e] = ec(t, e));
}
const Jf = /* @__PURE__ */ new WeakMap();
function Gc(t, e) {
  const n = Ti(e.props.kind);
  if (!n) return [];
  const i = Qf(t, n), s = Se(Jf, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = Op(t, e, () => i), s.set(e, o)), o;
}
function fi(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function em(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, d = s ?? b;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${d} vector-effect=${q}></circle>` : _`<circle class="icon" r=${fi(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></path>`;
    case "motion_sensor": {
      const p = (c) => `M${e * c} ${-e * c * 0.8}A${e * c} ${e * c * 0.8} 0 0 1 ${e * c} ${e * c * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <path class="arcs" d=${p(1) + p(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${q}></path>`;
    }
    case "illuminance_sensor": {
      let p = "";
      for (let c = 0; c < 8; c++) {
        const h = c * Math.PI / 4;
        p += `M${Math.cos(h) * e * 1.15} ${Math.sin(h) * e * 1.15}L${Math.cos(h) * e * 1.6} ${Math.sin(h) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <path class="rays" d=${p} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${q}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${d} vector-effect=${q}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${q}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d}
        vector-effect=${q}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${q}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${q}></path>`;
    case "exhaust_fan": {
      let p = "";
      for (let c = 0; c < 4; c++) {
        const h = c * Math.PI / 2 + Math.PI / 4;
        p += `M0 0L${Math.cos(h) * e * 0.85} ${Math.sin(h) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${q}></circle>
        <path class="blades" d=${p} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${q}></path>`;
    }
    default:
      return _`${b}`;
  }
}
function tm(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${b}`;
  const l = Zf(r, r.label, i, e.scale), a = o ?? b, d = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${q}></circle>
      ${s ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : b}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${q}></rect>
      ${s ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : b}`;
  return _`
    <g transform=${`rotate(${i})`}>${d}</g>
    ${Gf(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${Zn / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function nm(t, e, n = 0) {
  return t === "bound" ? b : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(Sn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${Xf[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : b} vector-effect=${q}></circle>`;
}
function im(t, e, n) {
  if (t.status !== "error") return b;
  const i = e * 0.9, s = -e * 0.9, o = Ff / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${Bf / n.scale} fill=${n.palette.background} stroke=${hi} stroke-width="1.5"
      vector-effect=${q}></circle>
    <path d=${Rc} fill=${hi} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function sm(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? hi : t === "event" ? e.selection : e.device;
}
function om(t, e, n, i, s, o) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return b;
  const l = 1 / o.scale, a = r.map(([w]) => (w.text.length * il * Wf + 2 * Uf) * l), d = nl * l, p = (nl + 2) * l, c = { w: Math.max(...a), h: d + p * (r.length - 1) }, h = s + 4 * l, f = Math.max(1, i.shown.length), m = Rf(t, e, n, { w: Math.max(...a.slice(0, f)), h: d + p * (f - 1) }, h), $ = jc(m, c, h);
  return _`${r.map(([w, g], y) => {
    const k = a[y], M = $.x + (c.w - k) / 2, x = $.y + (m.startsWith("up") ? r.length - 1 - y : y) * p, S = sm(w.tone, o.palette);
    return nf(`${g}:${w.key ?? ""}`, _`<g class=${`bubble ${g}`} data-tone=${w.tone}>
      <rect x=${M} y=${x} width=${k} height=${d} rx=${d / 2} fill=${o.palette.background} stroke=${S} stroke-width="1.5"
        vector-effect=${q}></rect>
      <text x=${M + k / 2} y=${x + d / 2} text-anchor="middle" dominant-baseline="central" fill=${S} font-weight="700"
        font-size=${il * l} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function rm(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : fi(t, Sn / e.scale);
}
function lm(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? om(t, e, n, s, rm(e, i), i) : b;
  return o === b ? b : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : b}>${o}</g>`;
}
function am(t, e, n, i) {
  var k, M, x;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = Sn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((k = n.selection) == null ? void 0 : k.kind) === "device" && n.selection.id === t.id, d = !i && Ci(t.props.kind), p = d ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, c = i || (x = n.live) == null ? void 0 : x.call(n, t), h = (c == null ? void 0 : c.look) === "on" || (c == null ? void 0 : c.look) === "active", f = d && !!n.containerState && !p || (c == null ? void 0 : c.look) === "no-data", m = t.props.kind, $ = !h || t.invalid ? o : m === "leak_sensor" ? hi : m === "motion_sensor" ? s.motionCone : o, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : b, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, fi(t, r));
  return _`
    <g class=${w} data-id=${t.id} opacity=${g} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${q}></circle>` : b}
      ${t.props.kind === "equipment" ? tm(t, n, o, l, h, f ? tl : void 0) : _`<g transform=${`rotate(${l})`}>${em(
    t,
    r,
    $,
    h ? $ : s.deviceFill,
    f ? tl : void 0,
    h ? s.deviceFill : $,
    (c == null ? void 0 : c.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? nm(n.bindingStatus(t), n.scale, fi(t, r)) : b}
      ${p ? im(p, r, n) : b}
    </g>`;
}
function ol(t, e, n, i) {
  const s = Gc(t, e);
  if (s.length === 0) return b;
  const o = n.palette, r = e.invalid ? o.invalid : Ti(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : b, a = s.map(fe).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${q}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${q}></path>`;
}
function cm(t, e, n, i) {
  const s = Gc(t, e);
  let o = 0;
  for (const d of s) for (const p of d) o = Math.max(o, Math.hypot(p.x - n.pt.x, p.y - n.pt.y));
  o === 0 && (o = Sn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : b;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? _`<path class="light-fill" d=${s.map(fe).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function dm(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return b;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? Us(t, i, e.scale) : null;
  if (!s) return b;
  const o = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : b}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${q}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${q} style="cursor:grab"></circle>
  </g>`;
}
function um(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = re(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: Kf, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = re(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return b;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? cm(t, i.d, i.pose, e) : b : o === "motion_sensor" && s === "active" ? ol(t, i.d, e, !1) : b;
    }
    return ol(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => am(i.d, i.pose, e, i.preview))}</g>
    ${dm(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? b : lm(t, i.d, i.pose, e))}</g>` : b}`;
}
const rl = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Uo = (t) => rl[t % rl.length], at = "non-scaling-stroke", pm = "0.55", hm = /* @__PURE__ */ new WeakMap();
function fm(t, e, n, i) {
  const s = i.palette, o = Uo(n), r = i.selectedId === e.id, l = Se(hm, t, cc).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${fe(ue(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? b : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${at}
        opacity=${i.selectedId !== null && !r ? pm : b}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${qc(Io(t, e))}</tspan>
      </text>` : b}
    </g>`;
}
function mm(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => _`
      <path class="zone" data-id=${o.id} d=${fe(ue(t, o))} fill="none" stroke=${Uo(r)} stroke-width="1"
        vector-effect=${at}></path>`)}</g>`;
  const s = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => fm(t, o, r, e))}</g>`;
}
function gm(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return _`<g class="zone-members">${pt(t, e).map(({ device: o, participates: r }) => {
    const l = re(t, o);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${at}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${at}></circle>` : b;
  })}</g>`;
}
function vm(t, e, n) {
  if (e.shape.kind !== "polygon") return b;
  const i = n.palette, s = e.shape.vertices;
  return _`${ue(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, d = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${d ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${d ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${at}></circle>`;
  })}`;
}
function wm(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${at}></polyline>`;
}
function bm(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${fe(ue(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${at}></path>` : b}
    ${n ? gm(t, n.id, e) : b}
    ${n ? vm(t, n, e) : b}
    ${e.draft ? wm(e.draft, e) : b}</g>`;
}
function ot(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const $m = /* @__PURE__ */ new WeakMap(), ym = /* @__PURE__ */ new WeakMap(), Kc = /* @__PURE__ */ new WeakMap();
function Zi(t, e, n) {
  const i = ie(t.dir), s = T(t.a, E(t.dir, e)), o = T(t.a, E(t.dir, n));
  return [T(s, E(i, t.leftOff)), T(o, E(i, t.leftOff)), D(o, E(i, t.rightOff)), D(s, E(i, t.rightOff))];
}
function $n(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = le(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const Y = "non-scaling-stroke";
function xm(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = $n(t, l.id);
    if (!a) continue;
    const d = ie(a.dir);
    for (const [p, c, h] of [[l.a, a.a, a.dir], [l.b, a.b, E(a.dir, -1)]]) {
      const f = t.nodes.find((x) => x.id === p);
      if (!f || f.host || n.get(p) !== 1) continue;
      const m = T(c, E(d, a.leftOff + i)), $ = D(c, E(d, a.rightOff + i)), w = E(d, 1), g = E(T(m, $), 0.5), y = T(D(g, E(w, -o)), E(h, s / 2)), k = D(D(g, E(w, o)), E(h, s / 2)), M = [m, y, k, $];
      r.push(_`<path class="wall-break" d=${`M${M.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${Y}></path>`);
    }
  }
  return r.length ? _`${r}` : b;
}
function km(t, e, n) {
  const i = ie(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], d = T(T(t.a, E(t.dir, l)), E(o, r)), p = T(T(t.a, E(t.dir, a)), E(o, r)), c = T(d, E(o, e.width)), h = de(D(c, d), D(p, d)) > 0 ? 1 : 0;
  return _`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${Y}></line>
    <path d=${`M${c.x} ${c.y}A${e.width} ${e.width} 0 0 ${h} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${Y}></path>`;
}
function Mm(t, e, n) {
  const i = ie(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = T(T(t.a, E(t.dir, e.offset)), E(i, r)), a = T(T(t.a, E(t.dir, e.offset + e.width)), E(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${Y}></line>`;
  });
  return _`${o}`;
}
function _m(t, e, n) {
  const i = $n(t, e.wallId);
  if (!i) return b;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = Zi(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${fe(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? km(i, e, o) : e.kind === "window" ? Mm(i, e, o) : b}
    </g>`;
}
function ll(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = T(t, E(n, i)), a = T(e, E(n, i)), d = (c, h) => {
    const f = T(h, E(n, i + r));
    return _`<line x1=${c.x} y1=${c.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${Y}></line>`;
  }, p = T(E(T(l, a), 0.5), E(n, 9 / s.scale));
  return _`
    <g class="dim">
      ${d(T(t, E(n, 2 / s.scale)), t)}${d(T(e, E(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${Y}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${ot(O(t, e))}</text>
    </g>`;
}
function Sm(t, e) {
  const n = e.selection;
  if (!n) return b;
  const i = e.palette, s = 4 / e.scale, o = (r) => _`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : b;
  }
  if (n.kind === "wall") {
    const r = Se(Kc, t, Pi).get(n.id), l = $n(t, n.id);
    if (!r || !l) return b;
    const a = ie(l.dir);
    return _`
      <path d=${fe(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${Y}></path>
      ${o(l.a)}${o(l.b)}
      ${ll(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((h) => h.id === n.id), l = r ? $n(t, r.wallId) : null;
    if (!r || !l) return b;
    const a = E(ie(l.dir), -1), d = l.rightOff + 18 / e.scale, p = (h) => T(l.a, E(l.dir, h)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${fe(Zi(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${Y}></path>
      ${c.filter(([h, f]) => f - h >= 1).map(([h, f]) => ll(p(h), p(f), a, d, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${fe(ue(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${Y}></path>` : b;
  }
  return b;
}
function Am(t, e, n) {
  return O(t, e) < 1e-6 ? null : Zi(Ea(t, e, n.thickness, n.baseline), 0, O(t, e));
}
function Im(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? $n(t, r.wallId) : null;
  return _`
    ${o ? _`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${Y}></path>` : b}
    ${(n.walls ?? []).map((a) => {
    const d = Am(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${d ? _`<path d=${fe(d)} fill=${i.selection} fill-opacity="0.35"></path>` : b}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${Y}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${fe(Zi(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : b}
    ${Em(t, e)}`;
}
function Cm(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${Y}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${Y}></rect></g>`;
}
function Em(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Cm(n.anchor, e) : b, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / e.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let p, c = b;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    p = _`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${Y}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    p = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${Y}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), m = `M${l} ${a - f}L${l + f} ${a}L${l} ${a + f}L${l - f} ${a}Z`;
    p = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${d.stroke} stroke-width="5"
      vector-effect=${Y}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${Y}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    p = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${Y}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${Y}></path></g>`;
    const $ = o.endpoint.kind === "wall" ? Se(Kc, t, Pi).get(o.endpoint.wallId) : void 0;
    $ && (c = _`<path class="snap-wall-hl" d=${fe($)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${Y}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    p = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${Y}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${Y}></path></g>`;
  }
  const h = u(`snapmark.${o.kind}`);
  return _`
    ${c}${s}${p}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${Y} font-family="system-ui, sans-serif">${h}</text>`;
}
function Dm(t, e) {
  var h;
  const n = e.preview.level ?? t, i = e.palette, s = Se($m, n, (f) => Oa(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? Se(ym, n, ko) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", d = a ? b : String(i.dimOpacity), p = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, c = e.mode ?? "plan";
  return _`
    ${mm(n, { palette: i, scale: e.scale, selectedId: p, mode: c === "automation" ? "plan" : c })}
    <path class="walls" d=${s.map((f) => f.map(fe).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${d}></path>
    ${r ? _`<g class="railings" opacity=${d}>${o.flatMap((f) => (r.get(f.id) ?? []).map((m) => _`<path d=${fe(m)} fill=${i.railing}></path>`))}</g>` : b}
    <g class="openings" opacity=${d}>${n.openings.map((f) => _m(n, f, e))}</g>
    <g class="wall-breaks" opacity=${d}>${xm(n, e)}</g>
    ${a ? bm(n, {
    palette: i,
    scale: e.scale,
    selectedId: p,
    draft: e.preview.zoneDraft,
    vertex: ((h = e.preview.zoneVertex) == null ? void 0 : h.zoneId) === p ? e.preview.zoneVertex.index : null
  }) : b}
    <g class="devices-layer">${a ? b : um(n, {
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
    <g class="selection">${Sm(n, e)}</g>
    <g class="preview">${Im(n, e)}</g>`;
}
const xe = "non-scaling-stroke", yn = "system-ui, sans-serif", Lm = 13, Jt = 9, Pm = 11, al = 18, hs = 12, fs = 11, On = 13, Om = 3, Gn = 10, cl = 4.5, Nm = 12, Tm = 11.5, Wo = 10, ms = 10.5, zm = 6, Vm = {
  IN: $f,
  OUT: Fc,
  BAT: yf,
  PV: Uc
}, dl = { dead: 0, nodata: 1, idle: 2, live: 3 };
function $t(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const gs = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function Hm(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function An(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const Rm = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Bm = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Xc = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${xe}>${i ? b : Bm}</path>`, Yc = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Ct = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function Fm(t, e) {
  var d;
  const n = (d = t.live) == null ? void 0 : d.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (p) => "block" in p ? _n : Jt, s = t.pts[0], o = t.pts[t.pts.length - 1], r = Gn / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((p, c) => ({ p: t.pts[c], q: p, len: Math.abs(p.x - t.pts[c].x) + Math.abs(p.y - t.pts[c].y) })).sort((p, c) => c.len - p.len);
  for (const { p, q: c, len: h } of a) {
    if (h < 2 * r + 2 * l) continue;
    const f = { x: (p.x + c.x) / 2, y: (p.y + c.y) / 2 }, m = (w, g) => Math.hypot(f.x - w.x, f.y - w.y) >= g + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const $ = Math.atan2(c.y - p.y, c.x - p.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: (($ + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function Um(t, e, n) {
  var d;
  const i = e.palette, s = An(t.style, i), o = Yc(t.pts), r = ((d = e.selection) == null ? void 0 : d.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = Fm(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${xe}></path>` : b}
    ${t.style === "live" ? Xc("glow", o, s, n) : b}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : b} stroke-linejoin="round" vector-effect=${xe}></path>
    ${a ? _`<path class="arrow" d=${`M${Gn / 2} 0L${-Gn / 2} ${-cl}L${-Gn / 2} ${cl}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : b}
  </g>`;
}
function Wm(t, e, n) {
  const i = Vm[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${_n} fill=${n.portFill}
      stroke=${e ? An(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${xe}></circle>
    ${i ? Ct(i, t.pt, Lm, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${yn}>${t.name}</text>`}
  </g>`;
}
function jm(t, e) {
  const n = Math.max(4, Math.floor(e / (Wo * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function qm(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((d) => d.id === l);
    return a ? Ui(a, n) || u(`power.kind.${a.kind}`) : l;
  }), o = u("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", jm(s[0], i - 12 - o.replace("{name}", "").length * Wo * 0.55)) : u("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function Zm(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: $t(i == null ? void 0 : i.power) }), l = (d) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: d });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: gs(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const d = n.device(e.deviceId);
      if (!d) return [{ kind: "text", value: u("power.missing"), fill: s.blockInvalid }];
      const p = d.bindings ?? {}, c = Nt(d), h = [];
      return c ? (p.power_in && h.push({ kind: "text", label: u("power.in"), value: $t(i == null ? void 0 : i.power_in) }), p.power_out && h.push({ kind: "text", label: u("power.out"), value: $t(i == null ? void 0 : i.power_out) })) : p.power && h.push(r()), p.voltage && h.push({ kind: "text", value: gs(i == null ? void 0 : i.voltage, "V") }), p.control && h.push(l(qa(d))), c && h.push({ kind: "text", label: u("power.loss"), value: $t(i == null ? void 0 : i.loss) }), h;
    }
    case "battery":
      return [{ kind: "text", label: u("power.soc"), value: gs(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: u("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), qm(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function Gm(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : hs + 3, o = e.x - s / 2, r = `${u(`power.switch.${i}`)}${t.controllable ? "" : ` · ${u("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : b}>
    <title>${r}</title>
    ${Ct(
    i === "on" ? hf : pf,
    { x: o, y: e.y },
    al,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? b : Ct(vf, { x: o + al / 2 + 3 + hs / 2, y: e.y + 1 }, hs, n.blockValue)}
  </g>`;
}
function ul(t, e, n) {
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
function Km(t, e, n) {
  const i = 2 * (t.w + t.h), s = ul(t, e.side, e.pt), o = ((ul(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, d = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((p) => ({ c: p, d: ((p.t - s) * r % i + i) % i })).filter(({ d: p }) => p > 0 && p < l).sort((p, c) => p.d - c.d).map(({ c: p }) => p.pt);
  return [e.pt, ...d, n.pt];
}
function Xm(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return b;
  const l = Wi(t, e, i.geo), a = l.find((f) => f.name === r), d = l.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !d) return b;
  const p = s(d.name) ?? "nodata", c = An(p, i.palette), h = Yc(Km(Ce(e, i.geo, t), a, d));
  return _`${p === "live" ? Xc("ts-glow", h, c, o) : b}
    <path class="ts-path" d=${h} fill="none" stroke=${c} stroke-width="3" stroke-dasharray=${p === "nodata" ? "5 4" : b}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${xe}></path>`;
}
function Ym(t, e, n, i) {
  const s = i.palette;
  return zc(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${xe}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${yn}>${o}</text>
    </g>`;
  });
}
function Qm(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? u("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? u("power.alert.missingDevice") : t === "disagree" ? u("power.alert.disagree") : t;
}
function Jm(t, e, n, i) {
  const s = Om + On / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: d }) => {
    const p = Math.max(Math.abs(d.x - a.x) - On / 2, 0), c = Math.max(Math.abs(d.y - a.y) - On / 2, 0);
    return Math.hypot(p, c) > _n;
  }), l = o.find(r) ?? o[0];
  return _`<g class="alert"><title>${t.map(Qm).join(`
`)}</title>
    ${Ct(Rc, l, On, i.blockInvalid)}</g>`;
}
function eg(t, e, n, i, s) {
  var $, w;
  const o = n.palette, r = Ce(e, n.geo, t), l = ($ = n.frame) == null ? void 0 : $.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, d = e.kind === "device" && !a, p = r.x + r.w / 2, c = Ui(e, n.geo) || u(`power.kind.${e.kind}`), h = Zm(t, e, n.geo, l, o, r.w), f = e.kind === "remainder", m = Wi(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${d ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : b} vector-effect=${xe}></rect>
    ${e.kind === "transfer" ? Xm(t, e, l, n, (g) => i(e.id, g), s) : b}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${u("power.planDevice")}</title>
      ${Ct(wf, { x: r.x + 4 + fs / 2, y: r.y + 4 + fs / 2 }, fs, o.blockValue)}</g>` : b}
    <text class="name" x=${p} y=${r.y + ui - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${Nm} font-weight="600" fill=${o.blockName} font-family=${yn}>${c}</text>
    ${h.map((g, y) => {
    const k = r.y + ui + y * di + di / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? Ym(t, e, l, n) : b;
    if (g.kind === "switch") return Gm(g, { x: p, y: k }, o);
    const M = g.fill ?? o.blockValue, x = g.label ? _`<tspan>${g.label} </tspan>` : b, S = g.note ? _`<tspan> ${g.note}</tspan>` : b;
    return _`<text x=${p} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? Wo : Tm}
        fill=${M} font-family=${yn}>${g.title ? _`<title>${g.title}</title>` : b}${x}<tspan
        font-weight=${g.small ? b : "600"}>${g.value}</tspan>${S}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? Jm(l.alert, r, m, o) : b}
    ${m.map((g) => Wm(g, i(e.id, g.name), o))}
  </g>`;
}
function tg(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let d = b;
  const p = t.name ?? "", c = Math.min(ms, a - 4), h = c >= zm, f = p.length * (h ? c : ms) * 0.58 + 12;
  if (p) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, y) => g - y);
    let $ = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, l + Jt]) {
      const y = Math.min(g - Jt, l);
      y - w > $.hi - $.lo && ($ = { lo: w, hi: y }), w = Math.max(w, g + Jt);
    }
    if ($.hi - $.lo >= f) {
      const g = ($.lo + $.hi) / 2, y = o ? { x: g, y: h ? t.y + t.h / 2 : t.y - 7 } : { x: h ? t.x + t.w / 2 : t.x - 7, y: g };
      d = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${h ? c : ms} fill=${s.blockValue} font-family=${yn}
        transform=${o ? b : `rotate(-90 ${y.x} ${y.y})`}>${p}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? An(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${xe}></rect>
    ${d}
  </g>`;
}
function ng(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${Jt} fill=${n.portFill} stroke=${An(e, n)} stroke-width="1.5"
      vector-effect=${xe}></circle>
    ${Ct(cf, t, Pm, n.portIcon)}
  </g>`;
}
function ig(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return b;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return b;
  const s = Ce(i, e.geo, t), o = 4 / e.scale;
  return _`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${xe}></rect>`;
}
function sg(t, e) {
  var h;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const f of n.wires) {
    const m = Nc(n, f, e.geo);
    if (!m) continue;
    const $ = (h = e.frame) == null ? void 0 : h.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: Tc(m.a, m.b), live: $, style: Hm($) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of s)
    for (const [m, $] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || dl[f.style] > dl[w]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], $.pt]), a.push({ at: $.pt, style: f.style });
    }
  const d = (f, m) => o.get(`${f}:${m}`), p = Rm(), c = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? tg(f, l.get(f.id) ?? [], r.get(f.id), e) : b)}</g>
    <g class="wires">${s.map((f) => Um(f, e, p))}</g>
    ${ig(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? b : eg(n, f, e, d, p))}</g>
    <g class="terminals">${a.map((f) => ng(f.at, f.style, i))}</g>
    ${c ? _`<line class="wire-draft" x1=${c.from.x} y1=${c.from.y} x2=${c.to.x} y2=${c.to.y}
      stroke=${c.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${xe}></line>` : b}
  </g>`;
}
const og = {
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
}, rg = {
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
function lg(t) {
  return t ? og : rg;
}
class ag extends qi {
  constructor(e) {
    if (super(e), e.type !== Re.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? $e : (Fo(e), n);
  }
}
const Z = ji(ag), Zs = 1, pl = 1e-6;
function cg(t, e, n, i, s) {
  const o = (a) => a > pl && a < s - pl, r = new Set(t.nodes.filter((a) => {
    var d;
    return ((d = a.host) == null ? void 0 : d.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const d = Li(t, a).host.offset;
    o(d) && l.push({ t: d, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some(($) => $ === e.a || $ === e.b || r.has($))) continue;
    const d = J(t, a.a), p = J(t, a.b), c = O(d, p), h = c === 0 ? null : Me(n, i, d, D(p, d));
    if (!h) continue;
    const f = Di(h, d, p) * c;
    if (f < -Zs || f > c + Zs) continue;
    const m = U(D(h, n), i);
    o(m) && l.push({ t: m, wall: a, pt: h });
  }
  return l;
}
function hl(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function fl(t, e) {
  if ("nodeId" in e)
    return delete Li(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (O(J(t, o), e.pt) <= Zs) return o;
  const { pt: n, offset: i } = Vi(t, e.wall, e.pt), s = { id: ee(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function dg(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = J(t, i.a), o = J(t, i.b), r = O(s, o), l = Ei(D(o, s)), a = U(D(n, s), l), d = cg(t, i, s, l, r), p = hl(d.filter((g) => g.t < a), a), c = hl(d.filter((g) => g.t > a), a);
  if (!p && !c) return zo(t, e);
  const h = De(t), f = h.walls.find((g) => g.id === e);
  let m = e, $ = 0;
  if (c) {
    const g = fl(h, c);
    if ($ = U(D(J(h, g), s), l), p) {
      const y = { ...f, id: ee(), a: g };
      h.walls.push(y), m = y.id;
    } else
      f.a = g;
  }
  p && (f.b = fl(h, p));
  const w = (g, y) => g.wallId !== e || p && y <= p.t ? !0 : !c || y < c.t ? !1 : (g.wallId = m, g.offset -= $, !0);
  h.openings = h.openings.filter((g) => w(g, g.offset + g.width / 2)), h.devices = h.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of h.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of h.zones) {
    const y = g.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((k) => k.kind !== "wall" || w(k, k.offset) ? k : Eo(k)));
  }
  return Hi(h), Ve(h, t);
}
function jo(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function ug(t, e, n) {
  return T(t, E(Ei(D(e, t)), n));
}
function Nn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function ct(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? jo(r, e) : e, d = r !== void 0 && a.y === r.y, p = (x) => !r || Math.abs(d ? x.y - r.y : x.x - r.x) <= 1;
  let c = null;
  for (const x of t.nodes) {
    if (l.has(x.id)) continue;
    const S = { x: x.x, y: x.y }, C = O(S, a);
    C <= i && p(S) && (!c || C < c.d) && (c = { id: x.id, pt: S, d: C });
  }
  let h = null;
  for (const x of n.corners ?? []) {
    const S = O(x.pt, a);
    S <= i && p(x.pt) && (!h || S < h.d) && (h = { c: x, d: S });
  }
  if (h && (!c || h.d < c.d)) {
    const x = h.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: h.c };
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const f = t.walls.filter((x) => !l.has(x.a) && !l.has(x.b)).map((x) => ({ w: x, f: le(t, x) })).filter((x) => x.f.len > 1e-9);
  let m = null;
  for (const { w: x, f: S } of f) {
    const C = { x: (S.a.x + S.b.x) / 2, y: (S.a.y + S.b.y) / 2 }, I = O(C, a);
    I <= i && p(C) && (!m || I < m.d) && (m = { wallId: x.id, pt: C, offset: S.len / 2, d: I });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const $ = (x) => {
    let S = null;
    for (const { w: C, f: I } of f) {
      const L = ie(I.dir), H = x ? [I.leftOff, -I.rightOff].filter((N) => N !== 0) : [0];
      for (const N of H) {
        const V = T(I.a, E(L, N)), W = r ? Me(r, D(a, r), V, I.dir) : T(V, E(I.dir, U(D(a, V), I.dir)));
        if (!W) continue;
        const X = U(D(W, V), I.dir);
        if (X < 0 || X > I.len) continue;
        const te = O(W, a);
        te <= i && (!S || te < S.d) && (S = { d: te, res: { pt: W, kind: "wall", endpoint: { kind: "wall", wallId: C.id, offset: X } } });
      }
    }
    return S ? S.res : null;
  }, w = $(!1);
  if (w) return w;
  const g = $(!0);
  if (g) return g;
  const y = n.zones ?? [];
  let k = null;
  for (const x of y)
    for (const S of x) {
      const C = O(S, a);
      C <= i && p(S) && (!k || C < k.d) && (k = { pt: S, d: C });
    }
  if (k) return Nn(k.pt, "zoneVertex");
  let M = null;
  for (const x of y)
    for (let S = 0; S < x.length; S++) {
      const C = x[S], I = x[(S + 1) % x.length], L = O(C, I);
      if (L < 1e-9) continue;
      const H = E(D(I, C), 1 / L), N = r ? Me(r, D(a, r), C, H) : T(C, E(H, U(D(a, C), H)));
      if (!N) continue;
      const V = U(D(N, C), H);
      if (V < 0 || V > L) continue;
      const W = O(N, a);
      W <= i && (!M || W < M.d) && (M = { pt: N, d: W });
    }
  if (M) return Nn(M.pt, "zoneEdge");
  if (s && s > 0) {
    const x = (C) => Math.round(C / s) * s, S = r ? d ? { x: x(a.x), y: r.y } : { x: r.x, y: x(a.y) } : { x: x(a.x), y: x(a.y) };
    return Nn(S, "grid");
  }
  return Nn(a, "none");
}
function pg(t, e, n) {
  return e.some((i, s) => Ae(t, i, e[(s + 1) % e.length]) <= n);
}
function qo(t, e, n) {
  const i = Pi(t);
  for (const [s, o] of i) if (St(e, o)) return s;
  for (const [s, o] of i) if (pg(e, o, n)) return s;
  return null;
}
function hg(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = le(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Qe(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function fg(t, e, n, i) {
  const s = hg(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((d) => d.id === l);
        if (a && O(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = qo(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const Gi = 3, mg = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => ue(t, n)).filter((n) => n.length >= 3);
function Qc(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? jo(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = ct(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: mg(e, s), corners: Da(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = ut(e, l.wallId), d = a !== null && l.offset >= -ai && l.offset <= a + ai, p = d ? Math.max(0, Math.min(a, l.offset)) : l.offset, c = d ? fn(e, l.wallId, l.side, p) : null;
    if (c) return { vertex: { kind: "wall", wallId: l.wallId, offset: p, side: l.side, x: c.x, y: c.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = Qe(le(e, l), n.pt).side >= 0 ? "left" : "right", d = fn(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: d.x, y: d.y }, snap: { ...o, pt: d } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Jc(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = ue(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => Ae(e, l, o[(a + 1) % o.length]) <= n) || zt(o, e)) && i.push({ id: s.id, area: Math.abs(Ie(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function ed(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: ue(t, n), v: n.shape.vertices } : null;
}
function gg(t, e, n, i) {
  var r;
  const s = (r = ed(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    O(n, l) <= i && (o < 0 || O(n, l) < O(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function vg(t, e, n, i) {
  const s = ed(t, e);
  if (!s || s.o.some((w) => O(n, w) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((w, g) => {
    const y = Ae(n, w, o[(g + 1) % o.length]);
    y <= i && y < a && (l = g, a = y);
  }), l < 0) return null;
  const d = o[l], p = o[(l + 1) % o.length], c = Math.max(0, Math.min(1, Di(n, d, p))), h = Sa(d, p, c), f = r[l], m = r[(l + 1) % r.length], $ = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + c * (m.offset - f.offset), x: h.x, y: h.y } : { kind: "free", x: Math.round(h.x), y: Math.round(h.y) };
  return { index: l + 1, vertex: $ };
}
function wg(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, d = { x: 0, y: 0 }, p = null, c = [];
  const h = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => p && p.zoneId === h() ? p : null;
  function $(w) {
    if (!i || !s || !a && O(w.pt, d) <= Gi / t.scale()) return;
    a = !0;
    const g = Qc(t, s, w, i.from, i.zoneId);
    r = g.snap, l = w.shift, o = eh(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      c = [c[c.length - 1] ?? null, t.selection()];
    },
    press(w) {
      f(), p = null, d = w.pt;
      const g = h(), y = t.level(), k = g === null ? null : gg(y, g, w.pt, t.tolMm());
      return g === null || !k ? !1 : (i = { zoneId: g, ...k }, s = o = y, !0);
    },
    pick(w) {
      const g = Jc(t.level(), w, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const y = h(), k = y !== null && n !== null && O(w, n) <= t.tolMm() ? g.indexOf(y) : -1;
      n = w, e({ kind: "zone", id: g[(k + 1) % g.length] });
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
      const g = o, y = s, k = a, M = i;
      f(), k ? g && y && g !== y && t.commit(g) : p = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const g = c[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const y = t.level(), k = vg(y, g.id, w.pt, t.tolMm());
      if (!k) return;
      const M = th(y, g.id, k.index, k.vertex);
      M !== y && (t.commit(M), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const g = m();
      if (w === "Escape" && g)
        return p = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const y = t.level(), k = nh(y, g.zoneId, g.index);
        return k === y ? (t.notify(u("zones.minVertices")), !0) : (p = null, t.commit(k), !0);
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
      f(), p = null, n = null;
    }
  };
}
function bg(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (f) => {
    t.select(f);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, d = wg(t, l), p = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, c = (f, m, $) => Qe(le(f, f.walls.find((w) => w.id === m)), $).t;
  function h(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const $ = ct(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), w = $.endpoint, g = ($.kind === "wall" || $.kind === "mid") && w.kind === "wall", y = $.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, k = n.nodes.find((C) => C.id === m.nodeId), M = !!k.host && g && w.kind === "wall" && w.wallId === k.host.wallId;
        let x = n;
        if (k.host && !M) {
          const C = structuredClone(n);
          delete C.nodes.find((I) => I.id === m.nodeId).host, x = C;
        }
        let S = ah(x, m.nodeId, p($));
        if (y && w.kind === "node")
          S = ph(S, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const C = n.walls.find((I) => I.id === w.wallId);
          if (C && C.a !== m.nodeId && C.b !== m.nodeId) {
            const I = structuredClone(S);
            I.nodes.find((L) => L.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, S = Ve(I, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const $ = n.walls.find((y) => y.id === m.wallId), w = ct(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [$.a, $.b]
        }), g = D(w.pt, m.origin);
        i = dh(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const $ = n.openings.find((w) => w.id === m.openingId);
        i = Ba(n, $.id, c(n, $.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      a(), o = f.pt, d.note();
      const m = t.level(), $ = f.ctrl ? qo(m, f.pt, t.tolMm()) : null;
      if ($) {
        l(null), t.commit(dg(m, $, f.pt));
        return;
      }
      if (d.press(f)) return;
      const w = t.selection(), g = fg(m, f.pt, t.tolMm(), w);
      if (!g) {
        d.pick(f.pt);
        return;
      }
      if (d.forget(), l(g), r = n = i = m, g.kind === "node") {
        let y = g.id;
        const k = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (f.alt && k) {
          const M = uh(m, k.id, k.a === g.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: J(n, y) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: f.pt };
      else if (g.kind === "opening") {
        const y = m.openings.find((k) => k.id === g.id);
        e = { kind: "opening", openingId: y.id, grab: c(m, y.wallId, f.pt) - y.offset };
      }
    },
    move(f) {
      d.active() ? d.move(f) : h(f);
    },
    up(f) {
      if (d.active()) {
        d.up(f);
        return;
      }
      e && h(f);
      const m = s, $ = i, w = r;
      a(), m && $ && w && $ !== w && t.commit($);
    },
    dblclick(f) {
      d.dblclick(f);
    },
    key(f) {
      return f === "Escape" && e ? (a(), !0) : d.key(f);
    },
    preview() {
      return !e || !i ? d.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), d.cancel();
    }
  };
}
function xn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function td() {
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
function $g(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = td(), s = () => {
    e = null, i.clear();
  }, o = (d) => ct(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const d = xn(i.first, { min: 1 }), p = xn(i.second, { min: 1 });
      return d === null || p === null ? null : { x: e.x + (n.x >= e.x ? d : -d), y: e.y + (n.y >= e.y ? p : -p) };
    }
    return o(n).pt;
  }
  const l = (d, p) => Math.abs(d.x - p.x) < 1 || Math.abs(d.y - p.y) < 1;
  function a(d) {
    if (!e || l(e, d)) return;
    const p = lh(t.level(), e, d, t.wallProps(), t.boxMeasure());
    p !== t.level() && (t.commit(p), s());
  }
  return {
    id: "box",
    down(d) {
      if (n = d.pt, !e) {
        e = o(d.pt).pt;
        return;
      }
      const p = r();
      p && a(p);
    },
    move(d) {
      n = d.pt;
    },
    up() {
    },
    key(d) {
      return e ? i.key(d, () => {
        const p = r();
        p && a(p);
      }, s) : !1;
    },
    preview() {
      if (!e) return { snap: o(n) };
      const d = r(), p = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || l(e, d)) return p;
      const c = t.wallProps(), h = bc(e, d, c.thickness, t.boxMeasure());
      return h && (p.walls = h.map((f, m) => ({ a: f, b: h[(m + 1) % 4], props: { ...c, baseline: "center" } }))), p;
    },
    cancel() {
      s();
    }
  };
}
const ml = (t) => Math.round(t * 1e3) / 1e3 + 0;
function yg(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = td(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, d = (h, f) => ct(t.level(), h, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function p() {
    if (!n) return null;
    const h = d(s, o), f = xn(l.first, { min: 1 }), m = xn(l.second);
    if (f === null && m === null) return { pt: h.pt, endpoint: h.endpoint, snap: h };
    const $ = f ?? O(n, h.pt);
    let w = h.pt;
    if (m === null && O(n, h.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = ug(n, w, $), y = { x: ml(g.x), y: ml(g.y) }, k = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: h } : { pt: y, endpoint: { kind: "free", pt: y }, snap: h };
  }
  function c() {
    const h = p();
    if (!e || !h) return;
    const f = rh(t.level(), e, h.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((k) => k.id === f.wallId);
    i === null && (i = m.a);
    const $ = f.endNodeId === i, w = n, g = J(f.level, f.endNodeId), y = O(w, g);
    if (y > 0 && (r = { x: (g.x - w.x) / y, y: (g.y - w.y) / y }), l.clear(), $) {
      a();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = J(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(h) {
      if (s = h.pt, o = h.shift, !e) {
        const f = d(h.pt, !1);
        e = f.endpoint, n = f.pt;
        return;
      }
      c();
    },
    move(h) {
      s = h.pt, o = h.shift;
    },
    up() {
    },
    key(h, f) {
      return o = f.shift, e ? l.key(h, c, a) : !1;
    },
    preview() {
      if (!n) return { snap: ct(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const h = p();
      return {
        walls: [{ a: n, b: h.pt, props: t.wallProps() }],
        snap: h.snap,
        tracker: l.tracker(h.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      a();
    }
  };
}
function xg(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = qo(o, n, t.tolMm());
    if (!r) return null;
    const l = le(o, o.walls.find((d) => d.id === r)), a = Qe(l, n).t;
    return { wallId: r, center: a, pt: T(l.a, E(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = hp(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: o.wallId, offset: l, width: r, kind: e, invalid: !Oi(t.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const gl = 3, kg = 1, ke = (t) => ({ x: t.x, y: t.y });
function Mg(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ke(e[e.length - 1]) : void 0;
  function l(c) {
    const h = e.length;
    if (h === 0) return !1;
    const f = e.map(ke);
    if (O(f[h - 1], c) <= kg) return !0;
    if (h >= 2) {
      const m = D(f[h - 1], f[h - 2]), $ = D(c, f[h - 1]);
      if (Math.abs(de(m, $)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot($.x, $.y) && U(m, $) < 0) return !0;
    }
    for (let m = 0; m + 2 < h; m++) if (rc(f[h - 1], c, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(c) {
    if (e.length < gl) return null;
    const h = t.tolMm(), f = ke(e[0]), m = ke(e[e.length - 1]);
    return O(c, f) <= h ? f : O(c, m) <= h ? m : null;
  }
  function d() {
    var f;
    if (e.length < gl || ci(e.map(ke))) return !1;
    const c = t.level(), h = Qp(c, e, t.zoneName());
    return h.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? h.level : Po(h.level, h.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: h.zoneId }), !0);
  }
  const p = (c) => Qc(t, t.level(), c, r());
  return {
    id: "zone",
    down(c) {
      if (a(c.pt)) {
        d();
        return;
      }
      const h = p(c).vertex;
      l(ke(h)) || (e = [...e, h], n = ke(h), i = !1);
    },
    move(c) {
      o = c.shift;
      const h = a(c.pt);
      if (h) {
        n = h, s = null, i = ci(e.map(ke));
        return;
      }
      const f = p(c);
      s = f.snap, n = ke(f.vertex), i = l(n);
    },
    up() {
    },
    key(c) {
      return c === "Enter" ? d() : c === "Backspace" || c === "Delete" || c === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : c === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const c = {};
      e.length > 0 && (c.zoneDraft = { points: e.map(ke), cursor: n, invalid: i }), s && (c.snap = s);
      const h = r();
      return o && h && (c.orthoFrom = h), c;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function _g(t) {
  return t.zoneMethod() === "polygon" ? Mg(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = Yp(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(u("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : Po(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const vl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function nd(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((p) => p.id === o), a = l ? re(s, l) : null, d = l ? Us(s, l, t.scale()) : null;
    return !a || !d ? 0 : tc(Ne(D(r, a.pt)) - Ne(D(d.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && O(s.pt, e.downPt) <= Gi / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((c) => c.id === e.id), r = o ? re(e.original, o) : null;
    if (!o || !r) return;
    const l = O(s.pt, r.pt), a = (Ne(D(s.pt, r.pt)) - e.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, p = zp(e.original, o, d, s.shift);
    e.work = JSON.stringify(p) === JSON.stringify(o.placement) ? e.original : ri(e.original, o.id, p);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((d) => d.id === s), a = l ? Us(r, l, t.scale()) : null;
      return !l || !a || O(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && vl(o.work, o.id) !== vl(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function wl(t, e, n) {
  const i = le(t, t.walls.find((s) => s.id === e));
  return Qe(i, n).side > 0 ? "left" : "right";
}
function id(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function Zo(t, e = "free") {
  return t === "equipment" ? [e] : $o[t];
}
function sd(t, e, n, i, s = 0, o = Zo(n)) {
  if (o.includes("wall")) {
    const r = ct(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: wl(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of e.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const p = le(e, d), c = Qe(p, i).side, h = Math.abs(Math.abs(c) - (c > 0 ? p.leftOff : p.rightOff));
        (!a || h < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : p.len, d: h });
      }
      if (a) return { mode: "wall", wallId: a.id, side: wl(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...id(t, i), rotation: s } : null;
}
function Sg(t, e, n) {
  const i = re(t, e);
  if (!i) return null;
  if (!n) {
    const o = _o(Math.round(Ne(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of t.walls) {
    let r;
    try {
      r = le(t, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = Qe(r, i.pt), a = l.side > 0 ? "left" : "right", d = Math.min(r.len, Math.max(0, Math.round(l.t))), p = fn(t, o.id, a, d), c = p ? O(p, i.pt) : 1 / 0;
    (!s || c < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: d }, d: c });
  }
  return s && s.d < 1 / 0 ? So(t, e.props, s.placement, 0) : null;
}
function Ag(t, e, n) {
  return Ka(t.deviceDefaults(e), "free", n.mode);
}
function Ig(t, e) {
  let n = null, i;
  const s = nd(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = Zo(e, t.wallMount() ? "wall" : "free"), a = sd(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...id(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const d = Ag(t, e, a), p = So(r, d, a, t.tolMm()), c = Pr(r, d, p, "").deviceId !== null;
    return { placement: p, props: d, invalid: !c };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), d = go(u(`device.${e}`), a.devices.filter((c) => c.props.kind === e).map((c) => c.name)), p = Pr(a, l.props, l.placement, d);
      p.deviceId !== null && (t.commit(p.level), i = p.deviceId, t.select({ kind: "device", id: p.deviceId }));
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
const bl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Cg = (t, e, n) => n === void 0 || bl(t, n) !== bl(e, n);
function Eg(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return D(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = fn(t, s.wallId, s.side, s.offset);
  return o ? D(o, i) : { x: 0, y: 0 };
}
function Dg(t) {
  let e = null, n = null;
  const i = nd(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (h) => {
    e = h, t.select(h);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function p(h) {
    if (!n || !s || !r && O(h.pt, l) <= Gi / t.scale()) return;
    if (r = !0, h.pt.x === l.x && h.pt.y === l.y) {
      o = s;
      return;
    }
    const f = s.devices.find((x) => x.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = h.shift ? jo(l, h.pt) : h.pt, $ = f.placement, w = $.mode === "free" ? null : re(s, f), g = $.mode === "free" ? $.rotation : w ? _o(Math.round(Ne(w.dir))) : 0, y = T(m, n.grab), k = sd(t, s, f.props.kind, y, g, Zo(f.props.kind, $.mode)), M = k && k.mode === "wall" && $.mode === "wall" && $.aim !== void 0 ? { ...k, aim: $.aim } : k;
    o = M ? ri(s, f.id, So(s, f.props, c(s, f.placement, M, m, y), t.tolMm())) : s;
  }
  function c(h, f, m, $, w) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = h.walls.find((C) => C.id === f.wallId);
    if (!g) return m;
    const y = le(h, g), k = Math.max(0, Math.min(y.len, f.offset + U(D($, l), y.dir))), M = Qe(y, w).side, x = t.tolMm(), S = f.side === "left" ? M < -(y.rightOff + x) ? "right" : "left" : M > y.leftOff + x ? "left" : "right";
    return { ...m, offset: k, side: S };
  }
  return {
    id: "device-select",
    down(h) {
      d(), l = h.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, h)) return;
      const $ = sc(f, h.pt, m);
      if (!$) {
        a(null);
        return;
      }
      a({ kind: "device", id: $ });
      const w = f.devices.find((y) => y.id === $), g = re(f, w);
      s = o = f, n = { id: $, grab: Eg(f, w, (g == null ? void 0 : g.pt) ?? null, h.pt) };
    },
    move(h) {
      i.active() ? i.move(h) : p(h);
    },
    up(h) {
      if (i.end(h)) return;
      n && p(h);
      const f = o, m = s, $ = r, w = n == null ? void 0 : n.id;
      d(), $ && f && m && f !== m && Cg(m, f, w) && t.commit(f);
    },
    key(h) {
      return h === "Escape" && i.cancel() ? !0 : h === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const h = i.working();
      return h ? { level: h } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), a(null);
    }
  };
}
function Lg(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = sc(t.level(), e.pt, t.tolMm());
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
const Gs = 40, Pg = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function Og(t, e, n, i) {
  const s = t.blocks.find((f) => f.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = wn(o ? i.x : i.y), d = n === "start" ? Math.min(a, r + l - Gs) : r, p = n === "end" ? Math.max(a, r + Gs) : r + l;
  if (d === r && p === r + l) return t;
  const c = o ? { x: d, w: p - d } : { y: d, h: p - d }, h = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * l - d) / (p - d))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...c } : f),
    wires: t.wires.map((f) => {
      const m = h(f.from), $ = h(f.to);
      return m === f.from && $ === f.to ? f : { ...f, from: m, to: $ };
    })
  };
}
function Ng(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(p, c) {
    const h = Jr(p, c, t.tolMm(), t.geo());
    return (h == null ? void 0 : h.kind) === "port" ? { block: h.block, port: h.port } : (h == null ? void 0 : h.kind) === "bus" ? { bus: h.id, at: h.at } : (h == null ? void 0 : h.kind) === "bus-end" ? { bus: h.id, at: h.end === "start" ? 0 : 1 } : null;
  }
  function a(p) {
    const c = e, h = n;
    if (!c || !h || !s && O(p.pt, o) <= Gi / t.scale()) return;
    if (s = !0, c.kind === "wire") {
      const w = l(h, p.pt);
      e = { ...c, to: p.pt, ok: !!w && !("error" in Kr(h, c.from, w, t.geo())) };
      return;
    }
    if (c.kind === "bus-end") {
      i = Og(h, c.id, c.end, p.pt);
      return;
    }
    const f = h.blocks.find((w) => w.id === (c.kind === "pin" ? c.from.block : c.id));
    if (!f) return;
    if (c.kind === "pin") {
      i = Sh(h, f.id, c.from.port, Bh(Ce(f, t.geo(), h), p.pt));
      return;
    }
    const m = wn(f.x + p.pt.x - o.x), $ = wn(f.y + p.pt.y - o.y);
    i = m === f.x && $ === f.y ? h : kh(h, f.id, m, $);
  }
  function d(p, c, h) {
    const f = l(p, h);
    if (!f) return;
    const m = Kr(p, c, f, t.geo());
    if ("error" in m) {
      t.notify(u(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(p) {
      r(), o = p.pt;
      const c = t.power(), h = Jr(c, p.pt, t.tolMm(), t.geo());
      if (!h) {
        t.select(null);
        return;
      }
      if (h.kind === "chip") {
        t.setPosition(h.block, h.position);
        return;
      }
      if (h.kind === "wire") {
        t.select({ kind: "powerWire", id: h.id });
        return;
      }
      if (n = i = c, h.kind === "port") {
        const f = { block: h.block, port: h.port };
        if (Pg(c, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = c.blocks.find((w) => w.id === h.block), $ = Wi(c, m, t.geo()).find((w) => w.name === h.port).pt;
        e = { kind: "wire", from: f, at: $, to: $, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: h.id }), e = h.kind === "bus-end" ? { kind: "bus-end", id: h.id, end: h.end } : { kind: "move", id: h.id };
    },
    move(p) {
      a(p);
    },
    up(p) {
      a(p);
      const c = e, h = n, f = i, m = s;
      if (r(), !(!c || !h)) {
        if (!m) {
          (c.kind === "wire" || c.kind === "pin") && t.select({ kind: "powerBlock", id: c.from.block });
          return;
        }
        c.kind === "wire" ? d(h, c.from, p.pt) : f && f !== h && t.commitPower(f);
      }
    },
    key(p) {
      return p === "Escape" && e ? (r(), !0) : !1;
    },
    preview() {
      const p = e;
      return p ? p.kind === "wire" ? { wireDraft: { from: p.at, to: p.to, ok: p.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function Tg(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var d;
      let s;
      if (n === "device") {
        const p = t.placeDeviceId();
        if (!p) {
          t.notify(u("power.pickDevice"));
          return;
        }
        s = p;
      }
      const o = t.power(), r = xh(n, { x: 0, y: 0 }, o, s), l = Ce(r, t.geo(), Zr(o, r)), a = { ...r, x: wn(i.pt.x - l.w / 2), y: wn(i.pt.y - l.h / 2) };
      t.commitPower(Zr(o, a)), n === "device" && ((d = t.devicePlaced) == null || d.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function zg(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = Jc(t.level(), e.pt, t.tolMm())[0];
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
const Vg = ["select", "box", "wall", "door", "window", "opening", "zone"], Hg = [
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
], Rg = ["binding-select"], Bg = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Fg = ["zone-pick"], od = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, Ug = {
  plan: Vg,
  equipment: Hg,
  binding: Rg,
  power: Bg,
  automation: Fg
};
function Go(t) {
  return Ug[t];
}
function Ks(t, e) {
  switch (t) {
    case "select":
      return bg(e);
    case "box":
      return $g(e);
    case "wall":
      return yg(e);
    case "door":
    case "window":
    case "opening":
      return xg(e, t);
    case "zone":
      return _g(e);
    case "device-select":
      return Dg(e);
    case "binding-select":
      return Lg(e);
    case "power-select":
      return Ng(e);
    case "zone-pick":
      return zg(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Tg(e, t);
    default:
      return Ig(e, t);
  }
}
function vs(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const Wg = {
  select: Ft,
  box: Df,
  wall: Lf,
  door: df,
  window: Tf,
  opening: uf,
  zone: _f,
  "device-select": Ft,
  ceiling_light: rf,
  wall_light: Pf,
  motion_sensor: bf,
  illuminance_sensor: of,
  climate_sensor: Sf,
  wall_switch: gf,
  smart_button: mf,
  valve: Cf,
  leak_sensor: Wc,
  socket: Fc,
  exhaust_fan: Bc,
  equipment: el,
  "binding-select": Ft,
  "zone-pick": Ft,
  "power-select": Ft,
  "power-device": el,
  "power-bus": xf,
  "power-battery": sf,
  "power-pv": Uc,
  "power-transfer": Mf,
  "power-remainder": lf
}, rd = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${Wg[t]}></path>`}</svg>`;
function jg(t) {
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
function qg(t) {
  return v`
    <div class="top"><div class="bar">
      ${t.lead ?? b}
      ${t.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${u("plan.pick")} title=${u("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${Z(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => v`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : b}
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
        ${jg(t)}${t.saveState === "error" && t.errorMessage ? v`: ${t.errorMessage}` : b}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${u("action.save")}</button>
    </div>${t.steps}</div>`;
}
const Zg = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function ld(t, e, n) {
  return Go(t).map((i) => {
    const s = t === "plan" ? od[i] : void 0, o = u(`tool.${i}`);
    return v`
      ${Zg.includes(i) ? v`<div class="tool-sep"></div>` : b}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? b}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? b}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${rd(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function Gg(t, e, n) {
  return v`<div class="tools">${ld(t, e, n)}</div>`;
}
const Tn = ["plan", "equipment", "binding", "power", "automation"], Ut = (t, e, n) => u(t === 1 ? e : n).replace("{n}", String(t));
function Kg(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((p) => p.invalid).length, d = a ? `, ${u("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Ut(o.length, "steps.wall", "steps.walls")}, ${Ut(r.length, "steps.zone", "steps.zones")}${d}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: Ut(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - wo(l.map(n));
      return {
        text: u("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: Ut(i.blocks.length, "steps.block", "steps.blocks"), done: Ph(i) };
    case "automation":
      return { text: Ut(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const $l = (t, e) => u(t).replace("{step}", u(`mode.${e}`));
function Xg(t) {
  const e = Tn.indexOf(t.mode), n = Tn[e - 1], i = Tn[e + 1];
  return v`
    <nav class="steps" aria-label=${u("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Z(t.planName)} aria-label=${u("plan.name")} title=${u("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${u("steps.app")}</span>
      </div>
      ${Tn.map((s, o) => {
    const r = Kg(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return v`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : b} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${u(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${$l("steps.back", n)}</button>` : b}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${$l("steps.next", i)}</button>` : b}
      </div>
    </nav>`;
}
function Yg(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function ad(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return ja(t, go(u("device.equipment"), e));
}
function Ko(t) {
  if (Nt(t)) return u("props.inverter");
  const e = wp(t);
  return e ? u(`deviceRole.${e}`) : "";
}
function Ki(t) {
  const e = u(`device.${t.props.kind}`), n = Ko(t);
  return n ? `${e} · ${n}` : e;
}
function Qg(t) {
  const e = Yg(t.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${u("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${u("devices.new")}</button>
    </div>
    ${e.length === 0 ? b : v`<div class="pdevs">
      ${e.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Ko(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const Jg = ["unbound", "bound", "all"], e1 = /* @__PURE__ */ new WeakMap(), en = (t) => t.placement.mode === "none";
function cd(t) {
  return Se(e1, t, (e) => [...e.devices].sort((n, i) => Number(en(n)) - Number(en(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function t1(t, e, n) {
  const i = cd(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const dd = (t) => u(`device.${t.props.kind}`), yl = (t) => t.props.kind === "equipment" ? Ko(t) : dd(t), n1 = (t, e) => t === "all" || t === "bound" == (e === "bound");
function i1(t, e, n) {
  return e === 0 ? u("binding.noDevices") : n || t.filter === "all" ? u("binding.noMatch") : u(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function xl(t) {
  const e = u(t.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function s1(t) {
  var l;
  if (t.collapsed) return v`<div class="blist collapsed">${xl(t)}</div>`;
  const e = cd(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: wo(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: d }) => n1(t.filter, d) && (!i || a.name.toLowerCase().includes(i) || dd(a).toLowerCase().includes(i) || yl(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, d) => {
    const p = yu(a);
    return v`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${d}" role="img" aria-label=${u(`bindstatus.${d}`)} title=${u(`bindstatus.${d}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${yl(a)}</small></span>
      <span class="cnt">${p.filled}/${p.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${u("binding.show")}>
          ${Jg.map((a) => v`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${u(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${xl(t)}
      </div>
      <input class="list-search" type="search" placeholder=${u("binding.search")} aria-label=${u("binding.search")}
        .value=${Z(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${i1(t, e.length, i)}</p>` : v`
          ${s.filter((a) => !en(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => en(a.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${u("devices.unplaced")}</h5>
            ${s.filter((a) => en(a.d)).map((a) => r(a.d, a.st))}
          </div>` : b}`}
      </div>
    </div>`;
}
function P(t, e) {
  return v`<label class="row"><span>${t}</span>${e}</label>`;
}
function ne(t, e, n, i) {
  return v`<select class="val" data-field=${i ?? b} .value=${Z(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => v`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function He(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return v`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? b}
    placeholder=${t.placeholder ?? b} title=${t.placeholder ?? b} .value=${Z(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = xn(s.value, t.rule);
    if (o === null) {
      s.value = e, n(u(t.bad));
      return;
    }
    if (t.skipSame && o === t.value) {
      n(null);
      return;
    }
    if (t.apply(o) === !1) {
      s.value = e, n(u("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function o1() {
  return {
    door: { width: jn.door, hinge: "start", swing: "left" },
    window: { width: jn.window, outside: "left" },
    opening: { width: jn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function r1(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function ud(t) {
  return go(u("zones.default"), t.zones.map((e) => e.name));
}
const l1 = (t) => t === "door" || t === "window" || t === "opening";
function a1(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return b;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return v`
    <h4>${u(`props.next.${n}`)}</h4>
    ${P(`${u("props.width")}, ${u("unit.mm")}`, He({
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
      ${P(u("props.hinge"), ne(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${P(u("props.swing"), ne(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : b}
    ${n === "window" ? P(u("props.outside"), ne(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : b}`;
}
class c1 {
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
const Xs = (t) => typeof t == "object" && t !== null && !Array.isArray(t), tn = (t) => typeof t == "string" && t ? t : null, kl = (t) => typeof t == "number" && Number.isFinite(t), Ys = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function pd(t) {
  return t.switchesMigrated || !t.devices.some(Ys) ? t : { ...t, switchesMigrated: !0 };
}
function d1(t, e, n) {
  const i = ja(t, n);
  let s = i.level;
  const o = Xs(e.switch) ? e.switch : {}, r = [["power", tn(e.power)], ["voltage", tn(e.voltage)], ["control", tn(o.entity)]];
  for (const [l, a] of r) a && (s = Ai(s, i.id, l, a));
  return o.controllable === !0 && (s = Ni(s, i.id, !0)), { level: s, id: i.id };
}
function u1(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Xs(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!Xs(l)) return l;
      if (l.kind === "meter" && tn(l.id) && kl(l.x) && kl(l.y)) {
        s++;
        const a = d1(e, l, tn(l.name) ?? `Meter ${s}`);
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
        return a === !0 && typeof l.deviceId == "string" && (e = Ga(e, l.deviceId, !0)), o = !0, d;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Ys)) {
    for (const s of t.level.devices) Ys(s) && (e = Ni(e, s.id, !0));
    e = pd(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class p1 {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await ps(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(vr(u("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = _e(e);
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
    const n = await Xh(this.h.hass, e);
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
        this.h.plans = await ps(this.h.hass);
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
      this.h.notice = _e(n);
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
    this.h.toolId = Go(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(vr(u("plan.default"))), this.offerDraft(null);
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
            await Qh(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = _e(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await ps(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = _e(o);
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
    this.h.plan = { ...e, levels: e.levels.map(Ou) };
    const n = u1({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Lh(n.power, { device: (o) => n.level.devices.find((r) => r.id === o) }), s = e.rules && e.rules.length > 0 ? e.rules : void 0;
    this.h.history = new c1({ level: n.level, ...i ? { power: i } : {}, ...s ? { rules: s } : {} }), this.h.lazyPower = _c(), this.h.activeTool.cancel(), this.h.activeTool = Ks(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((d, p) => p === 0 ? pd(n) : d), { power: r, rules: l, ...a } = e;
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
    const e = `${this.h.plan.name} ${u("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), s = await this.h.save.saveAsNew(i, e);
    s && this.keepSaved(i), s ? (this.h.plan = s, this.h.dialog = null, this.afterSaved(n, s.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class h1 {
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
    !n || !gh(n.states, e) ? this.base = { states: e, meta: mh(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? wh(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), vh(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = u("binding.registryError").replace("{error}", _e(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const zn = xa("", "");
function f1(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? zn;
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
    openingDefaults: (e) => r1(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? ud(((e = t.history) == null ? void 0 : e.current.level) ?? zn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? zn).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Lc(((n = t.history) == null ? void 0 : n.current.level) ?? zn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const hd = Object.keys($o), m1 = (t) => hd.includes(t);
function g1() {
  return Object.fromEntries(hd.map((t) => [t, Ge(t, "free")]));
}
const fd = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -_t, max: _t, signed: !0 }, bad: "props.badAim" }
}, nn = (t, e, n, i, s) => He({ ...fd[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), v1 = ["round", "linear", "spot"], w1 = ["rect", "circle"], mi = (t, e) => t.map((n) => ({ v: n, label: u(`${e}.${n}`) }));
function md(t, e, n, i) {
  const s = (r, l, a) => P(`${u(l)}, ${u("unit.mm")}`, nn(t, n + r, a, "mm", (d) => i({ [r]: d }))), o = (r, l, a) => P(`${u(l)}, ${u("unit.deg")}`, nn(t, n + r, a, "angle", (d) => i({ [r]: d })));
  switch (e.kind) {
    case "ceiling_light":
      return v`
        ${P(u("props.shape"), ne(e.shape, mi([...v1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? v`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : b}
        ${P(`${u("props.poolRadius")}, ${u("unit.mm")}`, He({
        ...fd.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: u("props.poolHint"),
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
      return P(`${u("props.diameter")}, ${u("unit.mm")}`, v`<select class="val" data-field=${`${n}diameter`}
        .value=${Z(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${_u.map((r) => v`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${P(u("props.shape"), ne(e.shape, mi([...w1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? v`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${P(u("props.icon"), $1(t, e.icon, `${n}icon`, i))}
        ${P(u("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Z(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return v`<p class="muted" data-note="daylight">${u("props.daylightInBinding")}</p>`;
    default:
      return v`<p class="muted">${u("props.noSettings")}</p>`;
  }
}
const b1 = /^mdi:[a-z0-9-]+$/;
function $1(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!b1.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, u("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? v`<ha-icon-picker data-field=${n} .value=${Z(e)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : v`<input class="val wide" type="text" data-field=${n} .value=${Z(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function dt(t, e, n, i) {
  return P(e, v`<input type="checkbox" data-field=${t} .checked=${Z(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function y1(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? b : dt("wallMount", u("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function x1(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? b : v`
    ${dt("inverter", u("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? dt("controllable", u("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${u("props.bindSwitchHint")}</p>`}`;
}
function k1(t, e) {
  const n = e.placement;
  if (n.mode === "none") return b;
  if (n.mode === "free")
    return P(
      `${u("props.rotation")}, ${u("unit.deg")}`,
      nn(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = ka.has(e.props.kind);
  return v`
    ${P(u("props.side"), ne(n.side, mi(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${P(`${u("props.offset")}, ${u("unit.mm")}`, nn(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? P(
    `${u("props.aim")}, ${u("unit.deg")}`,
    nn(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(oc(n, s)))
  ) : b}`;
}
function Xo(t, e) {
  return P(u("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${Z(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function M1(t, e) {
  const n = e.props.kind;
  return ya(n) ? n === "smart_button" && e.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${u("props.typeFreeHint")}</p>` : P(u("props.type"), ne(
    n,
    mi(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : b;
}
function _1(t, e) {
  const n = t.level ? Up(t.level, e) : [];
  return v`<fieldset data-field="zone-membership"><legend>${u("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${u("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function S1(t, e) {
  const n = e.placement.mode !== "none";
  return v`
    <h4>${Ki(e)}</h4>
    ${Xo(e, (i) => t.onDevice({}, i))}
    ${M1(t, e)}
    ${n ? md(t, e.props, "", (i) => t.onDevice(i)) : b}
    ${y1(t, e)}
    ${k1(t, e)}
    ${x1(t, e)}
    ${n ? _1(t, e) : b}
    ${e.invalid ? v`<p class="warn">${u("props.invalidDevice")}</p>` : b}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${u("action.delete")}</button>`;
}
function A1(t) {
  return t.device ? S1(t, t.device) : t.nextKind && t.nextProps ? v`
      <h4>${u("props.nextDevice")}: ${u(`device.${t.nextKind}`)}</h4>
      ${md(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? dt(
    "next-wallMount",
    u("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : b}` : v`<p class="muted">${u("props.none")}</p>`;
}
function I1(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = m1(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(u("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, d) => {
    const p = Sg(e, a, d);
    return o(p ? ri(e, a.id, p) : e);
  };
  return v`<div class="props">
    ${A1({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, d) => !!i && o(Tt(e, i.id, a, d)),
    onKind: (a) => !!i && o(bp(e, i.id, a)),
    onPlacement: (a) => !!i && o(ri(e, i.id, a)),
    onZone: (a, d) => !!i && o(gc(e, i.id, a, d)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Ec(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(Ni(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(Cc(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    ${i ? b : Qg({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = ad(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const Qs = (t) => u(`zones.kind.${t.shape.kind}`), Yo = (t) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? ff : Ef}></path>`}</svg>`;
function gd(t, e) {
  const n = lc(t, e);
  return n ? u(`zones.invalid.${n}`) : null;
}
function C1(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: Uo(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || Qs(o).toLowerCase().includes(e));
  return v`
    <div class="zlist">
      <div class="zhead"><span>${u("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${u("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${u("zones.filter")}
        aria-label=${u("zones.filter")} .value=${Z(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? gd(t.level, o) ?? "" : null;
    return v`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? v`<span class="zswatch" style=${`background:${r}`}></span>` : v`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Qs(o)}>${Yo(o.shape.kind)}</span>
            <span class="zarea">${((a = Io(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const Qo = ji(class extends qi {
  constructor(t) {
    if (super(t), t.type !== Re.PROPERTY && t.type !== Re.ATTRIBUTE && t.type !== Re.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Hc(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === $e || e === b) return e;
    const n = t.element, i = t.name;
    if (t.type === Re.PROPERTY) {
      if (e === n[i]) return $e;
    } else if (t.type === Re.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return $e;
    } else if (t.type === Re.ATTRIBUTE && n.getAttribute(i) === e + "") return $e;
    return Fo(t), e;
  }
}), vd = (t, e, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Qo(e)}
    @change=${(i) => n(i.target.checked)} />${u("zones.automation")}</label>`;
function E1(t, e, n) {
  const i = pt(t, e.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${u("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${u("zones.participates")}</span>` : b}</div>
    ${i.length === 0 ? v`<p class="muted">${u("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${u(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${u("zones.participates")} .checked=${Qo(o)}
          @change=${(r) => {
    const l = gc(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Ml(t, e, n) {
  const i = gd(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return v`<div class="zprops">
    <h4>${u("props.zone")}</h4>
    ${P(u("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${Z(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(Jp(t, e.id, l));
  }} />`)}
    ${P(u("props.area"), v`<span class="val ro" data-field="zone-area">${qc(Io(t, e))}</span>`)}
    ${P(u("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${Yo(e.shape.kind)}${Qs(e)}</span>`)}
    ${vd("zone-automation", e.automation !== !1, (o) => {
    const r = Po(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(ih(t, e.id))}>
        ${u("zones.keepOutline")}</button>` : b}</div>` : b}
    ${E1(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(mc(t, e.id))}>
      ${u("zones.delete")}</button>
  </div>`;
}
function D1(t) {
  const e = t.next.zone, n = e.name ?? ud(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return v`
    <h4>${u("props.nextZone")}</h4>
    <div class="muted">${u("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${u("zones.method")}>
      ${["walls", "polygon"].map((s) => v`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${Yo(s)}<span>${u(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${u(`zones.hint.${e.method}`)}</p>
    ${P(u("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${Z(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${vd("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function wd(t, e, n) {
  return He({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function _l(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function L1(t, e) {
  const n = le(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(hh(e.level, t.id, o));
  return v`
    <h4>${u("props.wall")}</h4>
    ${P(u("props.type"), ne(
    t.type,
    i.map((o) => ({ v: o, label: u(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${P(u("props.thickness"), wd(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${P(u("props.baseline"), ne(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: u(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${P(u("props.length"), v`<span class="val ro">${ot(n)} ${u("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(zo(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function P1(t, e) {
  const n = ["door", "window", "opening", ...si.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(gp(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), o = si.includes(t.kind);
  return v`
    <h4>${u(`kind.${t.kind}`)}</h4>
    ${P(u("props.kind"), ne(t.kind, n.map((r) => ({ v: r, label: u(`kind.${r}`) })), (r) => i(mp(t, r))))}
    ${P(u("props.width"), wd(e, t.width, (r) => _l(e, fp(e.level, t.id, r))))}
    ${P(u("props.offset"), He({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => _l(e, Ba(e.level, t.id, r))
  }))}
    ${o ? v`
      ${P(u("props.hinge"), ne(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${P(u("props.swing"), ne(t.swing ?? "left", s, (r) => i({ swing: r })))}` : b}
    ${t.kind === "window" ? P(u("props.outside"), ne(t.outside ?? "left", s, (r) => i({ outside: r }))) : b}
    ${P(u("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${Z(za(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Ta(t.kind) ? void 0 : l });
  }} />`)}
    ${P(u("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${Z(Ha(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Va(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? v`<p class="warn">${u("props.invalidOpening")}</p>` : b}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Fa(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function O1(t) {
  const e = ["bearing", "partition", "railing"];
  return v`
    <h4>${u("props.newWall")}</h4>
    ${P(u("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => v`<option value=${n} ?selected=${n === t.wallType}>${u(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${P(`${u("props.thickness")}, ${u("unit.mm")}`, He({
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
      <div class="muted">${u("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => v`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${u(`measure.${n}`)}</button>`)}
      </div>` : b}`;
}
const Sl = (t) => C1({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function N1(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${D1({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
      ${s ? Ml(e, s, t.commit) : b}
      ${Sl(t)}
    </div>`;
  }
  let i = b;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = L1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = P1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Ml(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${u("props.node")}</h4>
      ${P("X", v`<span class="val ro">${ot(s.x)}</span>`)}${P("Y", v`<span class="val ro">${ot(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === b && (t.tool === "wall" || t.tool === "box") ? O1(t) : i === b && l1(t.tool) ? a1({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === b && t.tool === "select" ? Sl(t) : i === b ? v`<p class="muted">${u("props.none")}</p>` : i}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : b}
    </div>`;
}
function T1(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Al = /* @__PURE__ */ new WeakMap();
function Jo(t, e, n) {
  let i = Al.get(t);
  i || Al.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : T1(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function Kn(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vn = (t) => t ?? b;
var z1 = Object.defineProperty, In = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && z1(e, n, s), s;
};
const V1 = 100;
let H1 = 0;
const R1 = (t) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, ir = class ir extends xt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${H1++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === V1) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${Vn(this.label || void 0)} title=${Vn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${u("combo.clear")} aria-label=${u("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : b}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Vn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Vn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : b}
      ${n ? v`<div class="hint">${u("combo.more")}</div>` : b}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : b}</div>`;
  }
};
ir.styles = ha`
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
let Xe = ir;
In([
  Te()
], Xe.prototype, "value");
In([
  Te()
], Xe.prototype, "label");
In([
  B()
], Xe.prototype, "isOpen");
In([
  B()
], Xe.prototype, "query");
In([
  B()
], Xe.prototype, "active");
var B1 = Object.defineProperty, er = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && B1(e, n, s), s;
};
const F1 = {
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
}, Il = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, U1 = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Cl(t, e) {
  return t != null && t.deviceClass && Il[t.deviceClass] ? Il[t.deviceClass] : U1[(t == null ? void 0 : t.domain) ?? yc(e)] ?? "generic";
}
const El = (t) => R1(F1[t]);
function W1(t) {
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
class Xi extends Xe {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = Kn(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? Kn(this.meta, e) : null;
    return v`${El(e ? Cl(this.meta.entities.get(e), e) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : b}<small class="eid">${e}</small></span>` : v`<span class="ph">${u("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = kc(this.states, e.entityId) ?? "unavailable";
    return v`${El(Cl(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${W1(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = Kn(this.meta, e).name;
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
er([
  Te({ attribute: !1 })
], Xi.prototype, "meta");
er([
  Te({ attribute: !1 })
], Xi.prototype, "items");
er([
  Te({ attribute: !1 })
], Xi.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Xi);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const sn = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), sn(s, e);
  return !0;
}, gi = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, bd = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), Z1(e);
  }
};
function j1(t) {
  this._$AN !== void 0 ? (gi(this), this._$AM = t, bd(this)) : this._$AM = t;
}
function q1(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) sn(i[o], !1), gi(i[o]);
  else i != null && (sn(i, !1), gi(i));
  else sn(this, t);
}
const Z1 = (t) => {
  t.type == Re.CHILD && (t._$AP ?? (t._$AP = q1), t._$AQ ?? (t._$AQ = j1));
};
class G1 extends qi {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), bd(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (sn(this, e), gi(this));
  }
  setValue(e) {
    if (Hc(this._$Ct)) this._$Ct._$AI(e, this);
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
const K1 = () => new X1();
class X1 {
}
const ws = /* @__PURE__ */ new WeakMap(), Y1 = ji(class extends G1 {
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
      let n = ws.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), ws.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = ws.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), Q1 = () => [{ v: "0", label: u("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], J1 = { min: 1, max: 10 };
function $d(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Js = (t, e, n) => $d(t, Tt(t.level, e.id, n));
function bs(t, e, n, i) {
  return v`<div class="cflag">${P(e, v`<input type="checkbox" data-field=${t} .checked=${Z(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const $s = "__other", Wt = /* @__PURE__ */ new Set();
function ev(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = gr.includes(i), l = !r || Wt.has(o), a = K1(), d = [...gr.map((c) => ({ v: c, label: c })), { v: $s, label: u("binding.eventOther") }];
  return v`<span class="evfield">${ne(l ? $s : i, d, (c) => {
    if (c === $s) {
      Wt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Wt.delete(o), a.value && (a.value.hidden = !0), c !== i ? s(c) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${Y1(a)} data-field=${`${n}-event-custom`} ?hidden=${Qo(!l)}
      .value=${Z(r ? "" : i)} @change=${(c) => {
    var m;
    const h = c.target, f = h.value.trim();
    if (!f) {
      h.value = r ? "" : i, t.setFieldNotice(u("props.badEvent"));
      return;
    }
    if (h.value = f, t.setFieldNotice(null), f !== i) {
      s(f) && Wt.delete(o);
      return;
    }
    if (Wt.delete(o), r) {
      h.hidden = !0;
      const $ = (m = h.parentElement) == null ? void 0 : m.querySelector("select");
      $ && ($.value = i);
    }
  }} /></span>`;
}
function tv(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return v`${b}`;
  const s = i[n], o = (r) => Js(t, e, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${P(u("binding.slot"), ne(
    String(s.slot),
    Q1(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${P(u("binding.event"), ev(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function nv(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return v`
      ${bs(
      "autoByDoubleToggle",
      u("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => Js(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? v`<div class="cflag">${P(u("binding.window"), He({
      value: i.windowSec,
      rule: J1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => Js(t, e, { windowSec: l })
    }))}</div>` : b}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${b}`;
  const s = (l, a) => (d) => {
    var c, h;
    const p = Tt(t.level, e.id, { [l]: d });
    return $d(t, d && !((c = e.bindings) != null && c[a]) ? Ai(p, e.id, a, ((h = e.bindings) == null ? void 0 : h.on) ?? null) : p);
  }, o = s("separateOff", "off"), r = bs("autoEnabled", u("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${bs("separateOff", u("binding.separateOff"), i.separateOff, o)}${i.separateOff ? b : r}`;
}
function iv(t) {
  return t.props.kind !== "smart_button" || !Mu(t).length ? v`${b}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${u("binding.duplicate")}</p></div>`;
}
const Et = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, yd = 3600, kn = (t) => typeof t == "number" && Number.isFinite(t);
function sv(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Et, i = xd(e.nightBelow, e.dayAbove), s = kd(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: s ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: s ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: Md(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function xd(t, e) {
  if (t !== void 0 && !kn(t) || e !== void 0 && !kn(e)) return !1;
  const n = t ?? Et.nightBelow, i = e ?? Et.dayAbove;
  return n >= 0 && n < i;
}
function kd(t, e) {
  if (t !== void 0 && !kn(t) || e !== void 0 && !kn(e)) return !1;
  const n = t ?? Et.sunNight, i = e ?? Et.sunDay;
  return n < i;
}
const Md = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= yd, Dl = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function ov(t, e) {
  var l, a, d, p;
  const n = sv(t), i = (c) => {
    const h = c ? e == null ? void 0 : e[c] : void 0;
    return h && typeof h == "object" ? h : void 0;
  }, s = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (s && ((a = s.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof s.state == "string" && s.state.trim() !== "") {
    const c = Number(s.state);
    if (Number.isFinite(c)) return { state: Dl(c, n.nightBelow, n.dayAbove), lux: c };
  }
  const o = i((d = t.bindings) == null ? void 0 : d.sun), r = (p = o == null ? void 0 : o.attributes) == null ? void 0 : p.elevation;
  return o && o.state !== "unavailable" && o.state !== "unknown" && kn(r) ? { state: Dl(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
function rv(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function lv(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return b;
  const i = Et, s = (a, d) => {
    if (d === n[a] || n[a] === void 0 && d === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(Tt(t.level, e.id, { [a]: d }));
  }, o = (a, d) => {
    const p = String(n[a] ?? i[a]);
    return P(d, v`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${Z(p)}
      @change=${(c) => {
      const h = c.target;
      if (h.value.trim() === "") {
        s(a, void 0);
        return;
      }
      const f = rv(h.value);
      if (f === null) {
        h.value = p, t.setFieldNotice(u("props.badDecimal"));
        return;
      }
      s(a, f);
    }} />`);
  }, r = P(u("props.debounce"), He({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: yd },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => s("debounce", a),
    onBlank: () => s("debounce", void 0)
  })), l = (a, d) => v`<p class="warn" data-note=${a}>${d}</p>`;
  return v`<div class="cfields" data-section="daylight">
    ${o("nightBelow", u("props.nightBelow"))}
    ${o("dayAbove", u("props.dayAbove"))}
    ${xd(n.nightBelow, n.dayAbove) ? b : l("lux-pair", u("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${o("sunNight", u("props.sunNight"))}
    ${o("sunDay", u("props.sunDay"))}
    ${kd(n.sunNight, n.sunDay) ? b : l("sun-pair", u("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${Md(n.debounce) ? b : l("debounce", u("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function eo(t, e) {
  return e === "control" && t.props.kind === "equipment" ? u("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? u("binding.onOff") : u(`role.${e}`);
}
const ys = (t) => String(t).padStart(2, "0");
function av(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${ys(e.getHours())}:${ys(e.getMinutes())}:${ys(e.getSeconds())}`;
}
const cv = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function dv(t) {
  return t.status === "error" ? t.reason === "unavailable" ? u("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : u("output.errorNotConfigured") : t.last ? u("output.last").replace("{event}", cv(t.last, t.kind)).replace("{time}", av(t.last.at)) : u("output.none");
}
function uv(t, e) {
  if (!Ci(e.props.kind)) return b;
  const n = t.feed.stateOf(e), i = n ? dv(n) : t.feed.error ?? (t.feed.ready ? u("output.notSaved") : null);
  return i === null ? b : v`<p class="note" data-field="output">${i}</p>`;
}
function pv(t, e, n, i) {
  const s = Mc(t.meta, i, t.states), o = ku(t.level, e, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${u("binding.missing")}</p>` : b}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${u("binding.unavailable")}</p>` : b}
    ${o.length ? v`<p class="note" data-note="also">${u("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : b}`;
}
function hv(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = eo(e, i);
  return v`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${u("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Jo(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const d = Ai(t.level, e.id, i, a.detail.value);
    d !== t.level && t.commit(d);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && vo(i) ? tv(t, e, i) : b}
    ${s ? pv(t, e, i, s) : b}
  </div>`;
}
function fv(t) {
  const e = t.device, n = wo(t.level.devices.map(t.status));
  return v`<div class="props bprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : b}
    ${t.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${u(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : b}
    ${e ? v`
      <h4>${Ki(e)}</h4>
      ${Xo(e, (i) => t.commit(Tt(t.level, e.id, {}, i)))}
      ${uv(t, e)}
      ${Ee(e).map((i) => v`${hv(t, e, i)}${nv(t, e, i.role)}`)}
      ${iv(e)}
      ${lv(t, e)}` : v`<p class="muted">${u("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${u("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${u("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${u("binding.reload")}</button>
  </div>`;
}
const mv = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, gv = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, vv = 6, wv = ["A", "0", "B"], bv = ["power", "control"], $v = ["power", "power_in", "power_out", "voltage", "control"], Dt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function jt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function qt(t, e, n, i, s, o) {
  return v`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Jo(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function yv(t, e) {
  const n = e.name ?? "";
  return P(u("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${u(`power.kind.${e.kind}`)} .value=${Z(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(vn(t.power, e.id, { name: o }, Dt(t))) : s.value = n;
  }} />`);
}
function xv(t, e) {
  const n = new Set(Ee(e).map((i) => i.role));
  return v`${bv.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${u(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${Kn(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${u("power.boundHint")}</p>`;
}
function Hn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function kv(t, e) {
  var o;
  const n = Ee(e), i = $v.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return v`
    ${Xo(e, (r) => Hn(t, Tt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${eo(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Jo(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${eo(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), Hn(t, Ai(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? dt(
    "controllable",
    u("props.controllable"),
    !!s.controllable,
    (r) => Hn(t, Ni(t.level, e.id, r))
  ) : b}
    ${s.kind === "equipment" ? dt("inverter", u("props.inverter"), !!s.inverter, (r) => {
    const l = Ec(t.level, t.power, e.id, r);
    return Hn(t, l.level, l.power);
  }) : b}`;
}
function Mv(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${u("power.missing")}</p>`;
  const i = Nt(n) ? b : dt("output", u("power.enableOutput"), e.output !== !1, (s) => {
    const o = Dt(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(Bi(vn(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${kv(t, n)}${i}` : v`
    ${P(u("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${P(u("props.kind"), v`<span class="val ro">${u(`device.${n.props.kind}`)}</span>`)}${xv(t, n)}${i}`;
}
function _v(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: u(`power.form.${r}`) }));
  return v`
    ${P(u("power.form"), ne(e.form, i, (r) => {
    r !== e.form && t.commitPower(vn(t.power, e.id, { form: r }, Dt(t)));
  }, "form"))}
    <div class="row"><span>${u("power.position")}</span><span class="seg pos">${wv.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${u("power.positionHint")}</p>`;
}
function Sv(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, d) => {
    if (a === i && d === s) return !1;
    t.commitPower(vn(t.power, e.id, n ? { w: a, h: d } : { w: d, h: a }, Dt(t)));
  }, r = (a, d, p) => He({ value: d, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: p }), l = ["h", "v"].map((a) => ({ v: a, label: u(`power.orientation.${a}`) }));
  return v`
    ${P(u("power.orientation"), ne(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(vn(t.power, e.id, { w: e.h, h: e.w }, Dt(t)));
  }, "bus-orientation"))}
    ${P(u("power.busLength"), r("bus-length", i, (a) => o(Math.max(Gs, s + 1, a), s)))}
    ${P(u("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(vv, a), i - 1))))}`;
}
function Av(t, e) {
  switch (e.kind) {
    case "grid":
      return v`
      ${qt(t, "power", u("power.field.power"), st, e.power, (n) => jt(t, e, "power", n))}
      ${qt(t, "voltage", u("power.field.voltage"), mv, e.voltage, (n) => jt(t, e, "voltage", n))}`;
    case "device":
      return Mv(t, e);
    case "battery":
      return v`
      ${qt(t, "power", u("power.field.batteryPower"), st, e.power, (n) => jt(t, e, "power", n))}
      ${qt(t, "soc", u("power.field.soc"), gv, e.soc, (n) => jt(t, e, "soc", n))}`;
    case "pv":
      return qt(t, "power", u("power.field.power"), st, e.power, (n) => jt(t, e, "power", n));
    case "transfer":
      return _v(t, e);
    case "bus":
      return Sv(t, e);
    default:
      return b;
  }
}
function Iv(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return v`
    <h4>${i ? Ki(i) : u(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? b : yv(t, e)}
    ${Av(t, e)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Ah(t.power, e.id))}>${u("power.autoPorts")}</button>` : b}
      ${e.kind === "grid" ? b : v`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Ac(t.power, e.id))}>${u("action.delete")}</button>`}
    </div>`;
}
function Cv(t, e) {
  var s, o;
  const n = Dt(t), i = (r) => {
    const l = t.power.blocks.find((d) => d.id === ("block" in r ? r.block : r.bus)), a = l ? Ui(l, n) || u(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return v`
    <h4>${u("power.wire")}</h4>
    ${P(u("power.wire.from"), v`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${P(u("power.wire.to"), v`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${P(u("power.wire.power"), v`<span class="val ro" data-field="wire-power">${$t((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Dc(t.power, e.id))}>${u("action.delete")}</button></div>`;
}
function Ev(t) {
  const e = Lc(t.level, t.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = ad(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${u("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${u("power.help.device")}</p>
    ${e.length === 0 ? v`<p class="muted" data-note="no-devices">${u("power.noDevices")}</p>` : v`<div class="pdevs">
      ${e.map((i) => v`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${Ki(i)}</span>
      </button>`)}
    </div>`}`;
}
function Dv(t) {
  if (t.toolId === "power-device") return Ev(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return Iv(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Cv(t, i) : t.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${u("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${u("power.pick")}</p><p class="muted">${u("power.help.select")}</p>`;
}
function Lv(t) {
  return v`<div class="props pprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : b}
    ${t.feedError ? v`<p class="note" data-notice="feed">${t.feedError}</p>` : b}
    ${Dv(t)}
  </div>`;
}
const _d = "ended: switched elsewhere";
function Yi(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
function Sd(t) {
  return t.sent === !1 && (t.reason === _d || t.reason.startsWith("switched elsewhere"));
}
const Pv = 5e3, Ov = 12;
function Ll(t) {
  t().catch(() => {
  });
}
class Nv {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Ll(n.unsub));
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
          Ll(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(_e(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ov || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Pv));
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
const to = 3600;
function ht(t) {
  return { id: ee(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const Tv = (t, e) => [...t, e], zv = (t, e) => t.map((n) => n.id === e.id ? e : n), Vv = (t, e) => t.filter((n) => n.id !== e);
function Hv(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const Rv = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, vi = (t) => [...t.inputs, ...t.gate ? [t.gate] : []].flatMap(Rv), Bv = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, Fv = (t, e) => t.filter((n) => n.id !== e && vi(n).includes(e));
function Uv(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of vi(l)) {
      const d = s(a, [...r, o]);
      if (d) return d;
    }
    return i.add(o), null;
  };
  for (const o of vi(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const wi = /^([01]\d|2[0-3]):[0-5]\d$/, Lt = (t) => typeof t == "number" && Number.isFinite(t);
function Wv(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return Lt(e.below) && e.below > 0 && Lt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && wi.test(n) && wi.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const Pl = (t) => Number.isInteger(t) && t >= 0 && t <= to;
function jv(t, e, n, i, s, o, r, l, a, d, p, c, h, f, m) {
  var M;
  const $ = [];
  e.name.trim() || $.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && $.push("inputs");
  const w = [...e.inputs, ...e.gate ? [e.gate] : []], g = [...w.flatMap(Bv), ...e.onTrue.map((x) => x.device), ...e.onFalse.map((x) => x.device)], y = w.flatMap((x) => "light" in x.source ? [x.source.light] : "daylight" in x.source ? [x.source.daylight] : []);
  (g.some((x) => !n(x)) || y.some((x) => !(s ?? n)(x)) || e.vent && [e.vent.sensor, e.vent.than].some((x) => !(o ?? n)(x)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((x) => !(p ?? n)(x)) || e.leak.valves.some((x) => !(c ?? n)(x))) || e.timed && (!(h ?? n)(e.timed.button) || !(f ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(s ?? n)(e.outside.sensor))) && $.push("device-missing");
  const k = new Set(t.map((x) => x.id));
  vi(e).some((x) => x !== e.id && !k.has(x)) && $.push("rule-missing"), Uv(t, e) && $.push("cycle"), (!Pl(e.onDelay) || !Pl(e.offDelay)) && $.push("delay");
  for (const x of w) {
    const S = Wv(x);
    S && !$.includes(S) && $.push(S);
  }
  return e.vent && qv(e, e.vent) && $.push("vent"), e.boiler && sw(e, e.boiler) && $.push("boiler"), e.leak && Zv(e, e.leak) && $.push("leak"), e.timed && Yv(e, e.timed) && $.push("timed"), e.outside && ew(e, e.outside) && $.push("outside"), (M = e.boiler) != null && M.button && d && !$.includes("device-missing") && !d(e.boiler.button) && $.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((x) => {
    const S = i(x.device);
    return S !== void 0 && !S.includes(x.do);
  }) && $.push("action"), $;
}
function qv(t, e) {
  if (t.inputs.length > 0 || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !Lt(e.above) || !Lt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function Zv(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((s) => typeof s == "string" && s !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const Gv = (t) => t.leak !== void 0;
function Kv(t, e, n) {
  const i = ht(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const s = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), o = s ? pt(s, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: o.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: o.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const Xv = 15;
function Yv(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const Qv = (t) => t.timed !== void 0, Jv = 30;
function ew(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && wi.test(n) && wi.test(i) && n !== i);
}
const tw = (t) => t.outside !== void 0;
function nw(t, e, n) {
  const i = ht(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), r = (s ? pt(s, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && he(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: Jv }, i;
}
function iw(t, e, n) {
  const i = ht(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), o = s ? pt(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = o.filter((a) => {
    const d = he(a);
    return d.includes("on") && d.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: Xv }, i;
}
function sw(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !Lt(n.limit) || !Lt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const ow = (t) => t.boiler !== void 0, no = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function rw(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Ad = 3e3, Id = 1400;
function lw(t, e, n) {
  var d;
  const i = ht(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const s = e === null ? void 0 : t.levels.find((p) => p.zones.some((c) => c.id === e)), o = s ? pt(s, e).filter((p) => p.participates).map((p) => p.device) : [], r = o.filter(no), l = o.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((d = t.power) == null ? void 0 : d.blocks) ?? []).filter((p) => p.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Ad, nominal: Id }), i;
}
const aw = (t) => t.vent !== void 0, cw = 600;
function dw(t, e, n) {
  var l;
  const i = ht(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = cw;
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), o = s ? pt(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = o.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const uw = 1800;
function pw(t, e, n, i) {
  const s = ht(e);
  return s.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", s.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: uw } } }], s;
}
const hw = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), xs = (t) => hw.has(t.props.kind);
function he(t) {
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
function Xn(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function Ze(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Cd(t) {
  if (Yi(t)) return u("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", Ze(t.at)).trim();
  if (t.sent === !1)
    return u(Sd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", Ze(t.at)).trim();
  const e = `${u(`rules.did.${t.action}`)} ${t.target} ${Ze(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function Ed(t) {
  return Yi(t) ? u("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", Ze(t.at)) : u("vent.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", Ze(t.at));
}
function fw(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${u("rules.status.error")}: ${e.reason}` : u(`rules.status.${e.status}`) : t.enabled === !1 ? u("rules.status.disabled") : n.live ? u("rules.unsaved") : u("rules.noTrace");
}
function mw(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !Xn(r, t);
  return v`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${u(`rules.verdict.${s}`)}
        title=${u(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? v` <span class="orphan">(${u("rules.orphan")})</span>` : b}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${fw(t, i, n)}</span>
        ${l ? v`<span class="runsaved">${u("rules.unsavedChanges")}</span>` : b}
        ${o > 0 ? v`<span class="rwarn">${o === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(o))}</span>` : b}
        ${i != null && i.last ? v`<span class="rlast">${Cd(i.last)}</span>` : b}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${u("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${u("rules.delete")}</button>
      </div>
    </div>`;
}
function gw(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = Hv(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return v`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : u("rules.noZone")}</h4>
      ${t.feedError ? v`<p class="muted">${t.feedError}</p>` : b}
      ${n === null && i.length === 0 && t.rules.length === 0 ? v`<p class="muted">${u("rules.hint")}</p>` : b}
      ${i.length === 0 ? v`<p class="muted rempty">${u("rules.empty")}</p>` : i.map((s) => mw(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const Dd = {
  condition: af,
  leak: Wc,
  timer: Af,
  outside: Nf,
  vent: Bc,
  boiler: Of,
  timed: If
}, vw = ["condition", "timer"], ww = ["vent", "boiler", "leak", "timed", "outside"], io = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function bw(t, e, n) {
  return [
    ...vw.map((i) => v`
      <button class="tool" data-template=${i} title=${u(`rules.template.${i}`)} @click=${() => t(i)}>
        ${io(Dd[i])}<span class="tlabel">${u(`rules.template.${i}`)}</span></button>`),
    v`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${u("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${io(kf)}<span class="tlabel">${u("rules.automations")}</span></button>`
  ];
}
function $w(t) {
  var o;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), s = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  s !== null && (t.preventDefault(), (o = n[s]) == null || o.focus());
}
function yw(t, e, n) {
  return v`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${u("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${$w}>
      ${ww.map((i) => v`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${io(Dd[i])}<span>${u(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function xw(t, e) {
  return t.mode === "automation" ? v`<div class="tools">${ld(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${bw((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? Gg(t.mode, t.toolId, (n) => t.pickTool(n)) : s1({
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
function kw(t, e) {
  var i;
  const n = t.selection;
  return fv({
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
function Mw(t, e) {
  var i;
  if (t.mode === "binding") return kw(t, e);
  if (t.mode === "automation")
    return v`<div class="props">${gw({
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
    return Lv({
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
  return t.mode === "equipment" ? I1({
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
  }) : N1({
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
function _w(t, e) {
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
function Sw(t, e) {
  const n = t === "zone" ? `${u("tool.zone")} · ${u(`zones.kind.${e}`)}` : u(`tool.${t}`);
  return v`<span class="tool-chip">${rd(t)}${n}</span>`;
}
function Aw(t) {
  return v`
    <div class="status">
      ${Sw(t.tool, t.zoneMethod)}
      ${_w(t.tool, t.zoneMethod).map(([e, n]) => v`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? v`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${u(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? b : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${u("status.cones")}
      </label>`}
    </div>`;
}
function Iw(t, e) {
  var o, r;
  const n = e.palette, i = 1 / e.scale, s = [
    {
      label: u(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((o = e.live) == null ? void 0 : o.first) ?? "",
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
function Cw(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: d } = s[0], p = Math.hypot(d.x - a.x, d.y - a.y);
    let c = Math.atan2(-(d.y - a.y), d.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: ot(p), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: ot(r), second: ot(l) };
}
function Ew(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const Dw = ha`
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
`, Lw = 5e-3, Pw = 2, bi = (t) => Math.max(Lw, Math.min(Pw, t));
function Ow(t, e, n) {
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
function Nw(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: bi(Math.min(e, n) / 12e3) };
  const i = t.map((c) => c.x), s = t.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, p = bi(Math.min(e / (l - r), n / (d - a)));
  return { x: (r + l) / 2 - e / p / 2, y: (a + d) / 2 - n / p / 2, scale: p };
}
function Tw(t, e, n, i, s) {
  const o = bi(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function zw(t, e, n) {
  const i = bi(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function Vw(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Ol(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function Hw(t, e, n, i, s = 1) {
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
const Rw = ["Shift", "Control", "Alt", "Meta"], Bw = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, Fw = new Map(Object.entries(od).map(([t, e]) => [`Key${e}`, t]));
function Nl(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class Uw {
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
          this.h.view = Vw(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.view = zw(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Nl(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? Fw.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = Bw[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Nl(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !Rw.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Ld(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function Ww(t) {
  return v`
    <div class="draft-banner" role="status">
      <span>${u("draft.banner").replace("{time}", Ld(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${u("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${u("draft.discard")}</button>
    </div>`;
}
function mt(t, e, n, i) {
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
function jw(t) {
  var n;
  const e = { action: "cancel", label: u("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? mt(u("draft.title"), u("draft.text").replace("{time}", Ld(i.savedAt)), [
        { action: "restore", label: u("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: u("draft.discard"), onClick: () => t.discard(i) }
      ]) : b;
    }
    case "new":
      return mt(u("new.title"), u("new.text"), [
        { action: "new-discard", label: u("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return mt(u("delete.title"), u("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return mt(u("delete.rule.title"), u("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? u("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return mt(u("switch.title"), u("switch.text"), [
        { action: "switch-discard", label: u("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return mt(u("conflict.title"), u(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: u("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: u("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return b;
  }
}
const Zt = "plan_studio.draft.", Rn = "plan_studio.lastPlanId";
function qw() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Zw(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class Gw {
  constructor(e = qw, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Zt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Zt + e), s = i ? JSON.parse(i) : null;
      return Zw(s) && s.planId === e ? s : null;
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
        if (!(s != null && s.startsWith(Zt))) continue;
        const o = this.read(s.slice(Zt.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(Rn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Rn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Rn)) === e && n.removeItem(Rn);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Zt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Pd = 5e3, Od = 12;
function Tl(t) {
  t().catch(() => {
  });
}
class Kw {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Tl(n.unsub));
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
          Tl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(_e(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Od || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Pd));
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
const Xw = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function Nd(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const Td = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Yw(t, e) {
  var o;
  const n = Td(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Xw[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const Qw = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function Yn(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (f, m, $) => {
    if (!f) return;
    l = Td(e, f);
    const w = (l == null ? void 0 : l.state) ?? "";
    s = m.includes(w) ? "on" : $.includes(w) ? "off" : "no-data";
  }, d = ["on"], p = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      o = !0;
    // falls through
    case "socket":
    case "equipment": {
      r = !!n.control, a(n.control, d, p);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      o = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], d, p), s === "on" && (s = "active");
      break;
    }
    case "wall_switch":
      a(n.state, d, p);
      break;
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const c = { look: s };
  if (o && l && (s === "on" || s === "active")) {
    const f = Qw(l);
    f !== void 0 && (c.timerSince = f);
  }
  const h = Ee(t).some((f) => f.role === "power") ? Yw(e, n.power) : void 0;
  return h !== void 0 && Math.round(h) >= 1 && (s === "on" || !r) && (c.power = h), i === "illuminance_sensor" && (n.illuminance || n.sun) && (c.daylight = Jw(t, e)), c;
}
function Jw(t, e) {
  const n = ov(t, e);
  if (n.state === null) return u("daylight.noData");
  const i = u(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${u("daylight.bySun")}`;
}
function zd(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: Nd(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: $t(t.power), tone: "device" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device" }), i;
}
const eb = 1046, tb = 1.25, Cn = 480, j = 10, K = 34, Vd = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, Hd = (t) => Math.floor((t - 20) / 6.6), nb = (t) => Math.floor((t - 20) / 6), Ye = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : Nd(t * 1e3), oe = (t) => 14 + 18 * t;
function Ht(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, s) => _`<text class=${s === 0 ? "fc-t1" : s === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(s)}>${Vd(i, s === 0 ? Hd(t.w) : nb(t.w))}</text>`)}
      </svg>
    </g>`;
}
function $i(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const Pe = eb, gt = Pe / 2, rt = 230, Qn = 26, be = 4, zl = 36, me = oe(2), ib = (Pe - be * rt - (be - 1) * Qn) / 2, Vl = 200, Bn = 460, et = 330, Rd = 40, ks = 8, sb = 24, so = (Pe - et * 2 - Rd) / 2, Hl = so + et + Rd;
function Qi(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${u("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${u("rules.unit.min")}` : i === 0 ? `${n} ${u("rules.unit.h")}` : `${n} ${u("rules.unit.h")} ${i} ${u("rules.unit.min")}`;
}
const tr = (t, e) => Ye(Math.max(1, Math.ceil((t - e) / 1e3)));
function oo(t, e = !1) {
  return "light" in t ? `${u("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? u(`rules.daylight.is.${t.is}`) : "sun" in t ? u(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${u(`rules.held.${t.held.state}`)} ${Qi(t.held.seconds)}` : "rule" in t ? u("rules.src.rule") : u("rules.src.device");
}
const Rl = (t) => Number.isFinite(t) ? String(t) : "?";
function ob(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function rb(t, e, n) {
  return "daylight" in n ? Bd(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? u("rules.flow.trueIn").replace("{t}", tr(t.until, e)) : t.detail;
}
const Bd = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${tr(t.until, e)})`), ce = (t) => u(`rules.val.${t === null ? "unknown" : t}`), G = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function lb(t) {
  if (t <= be) {
    const i = (Pe - t * rt - (t - 1) * Qn) / 2;
    return Array.from({ length: t }, (s, o) => i + o * (rt + Qn));
  }
  const e = t - Math.floor((t - 1) / be) * be, n = Math.floor((be - e) / 2);
  return Array.from({ length: t }, (i, s) => {
    const o = s % be;
    return ib + (s >= t - e ? n + o : o) * (rt + Qn);
  });
}
function ab(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = e.inputs.map((z, Q) => {
    const pe = (i == null ? void 0 : i[Q].value) ?? null;
    return pe === null || !z.not ? pe : !pe;
  }), o = i ? ob(e.combine, s) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, d = (n == null ? void 0 : n.unknownInputs) ?? 0, p = e.gate ? n == null ? void 0 : n.gate : void 0, c = e.gate ? p ? "daylight" in e.gate.source && p.value !== null ? `${u(p.value ? "rules.flow.open" : "rules.flow.closed")}, ${Bd(p, t.now)}` : p.value === !0 ? u("rules.flow.open") : p.value === null ? `${u("rules.flow.closed")}, ${u("rules.val.unknown")}` : p.until !== void 0 && p.until > t.now ? `${u("rules.flow.closed")}, ${u("rules.flow.opensIn").replace("{t}", tr(p.until, t.now))}` : `${u("rules.flow.closed")}${p.detail ? `, ${p.detail}` : ""}` : oo(e.gate.source) : "", h = u("rules.flow.delay").replace("{on}", Rl(e.onDelay)).replace("{off}", Rl(e.offDelay)), f = n === void 0 ? h : `${ce(r ?? null)}${l ? `, ${u("rules.flow.pending").replace("{to}", ce(l.to)).replace("{t}", Ye(a))}` : ""}`, m = e.inputs.length, $ = Math.ceil(m / be), w = lb(m), g = (z) => j + z * (me + zl), y = (z) => g(Math.floor(z / be)), k = (z) => g(z) + me + (z === $ - 1 ? K : zl) / 2, M = m === 0 ? j : g($ - 1) + me + K, x = M + me + K, S = x + me + K, C = (e.gate ? S : x) + me, I = C + K / 2, L = C + K, H = L + sb, N = Math.max(1, e.onTrue.length, e.onFalse.length), V = H + N * (me + ks) - ks + j, W = [
    { side: "true", x: so, list: e.onTrue, head: u("rules.whenTrue") },
    { side: "false", x: Hl, list: e.onFalse, head: u("rules.whenFalse") }
  ], X = [];
  w.forEach((z, Q) => X.push(`M${z + rt / 2} ${y(Q) + me} V${k(Math.floor(Q / be))}`));
  for (let z = 0; z < $; z++) {
    const Q = [gt, ...w.slice(z * be, (z + 1) * be).map((pe) => pe + rt / 2)];
    Math.max(...Q) > Math.min(...Q) && X.push(`M${Math.min(...Q)} ${k(z)} H${Math.max(...Q)}`);
  }
  m > 0 && X.push(`M${gt} ${k(0)} V${M}`), X.push(`M${gt} ${M + me} V${x}`), e.gate && X.push(`M${gt} ${x + me} V${S}`), X.push(`M${gt} ${C} V${I} H${so + et / 2} V${L}`, `M${gt} ${I} H${Hl + et / 2} V${L}`);
  const te = (z) => Ht({ ...z, h: me, focused: t.focused === z.field, onClick: () => t.onFocus(z.target) });
  return v`
    <div class="flow">
      <svg class="fc" style=${`max-width:${Pe * tb}px`} viewBox=${`0 0 ${Pe} ${V}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("rules.flow.title")}>
        ${X.map((z) => _`<path class="fc-link" d=${z}></path>`)}
        ${e.inputs.map((z, Q) => {
    const pe = i == null ? void 0 : i[Q];
    return te({
      x: w[Q],
      y: y(Q),
      w: rt,
      field: `input-${Q}`,
      target: { input: Q },
      cls: pe ? G(pe.value) : "",
      lines: [`${z.not ? "NOT " : ""}${t.inputName(z)}`, pe ? rb(pe, t.now, z.source) : oo(z.source, z.not === !0)]
    });
  })}
        ${te({
    x: (Pe - Vl) / 2,
    y: M,
    w: Vl,
    field: "combine",
    target: "gate",
    cls: o === void 0 ? "" : G(o),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...o === void 0 ? [] : [ce(o)]]
  })}
        ${te({
    x: (Pe - Bn) / 2,
    y: x,
    w: Bn,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : G(r ?? null),
    lines: [u("rules.flow.result"), f]
  })}
        ${e.gate ? te({
    x: (Pe - Bn) / 2,
    y: S,
    w: Bn,
    field: "gate-input",
    target: "gate-input",
    cls: p ? G(p.value) : "",
    lines: [`${u("rules.flow.gate")}: ${e.gate.not ? "NOT " : ""}${t.inputName(e.gate)}`, c]
  }) : b}
        ${W.map((z) => _`
          <text class="fc-head" text-anchor="middle" x=${z.x + et / 2} y=${L + 14}>${z.head}</text>
          ${z.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${z.x + et / 2} y=${H + me / 2 + 4}>${u("rules.noActions")}</text>` : z.list.map((Q, pe) => te({
    x: z.x,
    y: H + pe * (me + ks),
    w: et,
    field: `action-${z.side}-${pe}`,
    target: { action: z.side, index: pe },
    cls: "",
    lines: [t.actionName(Q.device), cb(Q.do)]
  }))}`)}
      </svg>
      ${d > 0 ? v`<p class="fc-warn">${d === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(d))}</p>` : b}
      ${n != null && n.held ? v`<p class="fc-warn" data-note="held">${u("rules.flow.heldNote")}</p>` : b}
      ${n != null && n.last ? v`<p class="fc-last">${u("rules.flow.last")} ${Cd(n.last)}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const cb = (t) => u(`rules.act.${t}`), Bl = { s: 1, min: 60, h: 3600 }, db = ["s", "min", "h"];
function ub(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const yi = (t) => Number.isFinite(t) ? String(t) : "";
function Fl(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const ro = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? u("rules.missingDevice") : t.ruleName(e.rule) ?? u("rules.missingRule");
};
function Fd(t, e) {
  var i, s;
  const n = e.source;
  return "device" in n || "rule" in n ? ro(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? u("rules.light.noSensor") : "daylight" in n ? ((s = t.deviceById(n.daylight)) == null ? void 0 : s.name) ?? u("rules.light.noSensor") : "sun" in n ? u("rules.src.sun") : "time" in n ? u("rules.src.time") : n.held.sources.length === 0 ? u("rules.src.held") : `${u("rules.src.held")}: ${n.held.sources.map((o) => ro(t, o)).join(", ")}`;
}
const lo = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function pb(t, e) {
  return "device" in e || "rule" in e ? lo(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => lo(t, n)) : !1;
}
function Ud(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function Wd(t) {
  return v`
    <optgroup label=${u("rules.groupDevices")}>
      ${t.inputDevices.map((e) => v`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? v`<optgroup label=${u("rules.groupRules")}>
      ${t.otherRules.map((e) => v`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : b}`;
}
function Ul(t, e) {
  return v`
    <option value="">${e}</option>
    ${Wd(t)}
    <optgroup label=${u("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((n) => v`<option value=${n}>${u(`rules.src.${n}`)}</option>`)}
    </optgroup>`;
}
function hb(t, e, n, i) {
  const s = t.draft.rule, o = e === "true" ? "onTrue" : "onFalse", r = s[o], l = (h) => t.onChange({ ...s, [o]: h }), a = t.deviceById(i.device), d = a ? he(a) : [], p = d.includes(i.do) ? d : [...d, i.do], c = $i({ action: e, index: n });
  return v`
    <div class="rline" data-field=${c} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(h) => {
    const f = t.deviceById(h.target.value);
    f && l(r.map((m, $) => $ === n ? { device: f.id, do: he(f).includes(m.do) ? m.do : he(f)[0] } : m));
  }}>
        ${a && !t.actionDevices.includes(a) ? v`<option value=${a.id}>${a.name}</option>` : b}
        ${a ? b : v`<option value=${i.device}>${u("rules.missingDevice")}</option>`}
        ${t.actionDevices.map((h) => v`<option value=${h.id}>${h.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(h) => l(r.map((f, m) => m === n ? { ...f, do: h.target.value } : f))}>
        ${p.map((h) => v`<option value=${h}>${u(`rules.act.${h}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${u("rules.remove")} @click=${() => l(r.filter((h, f) => f !== n))}>&times;</button>
    </div>`;
}
function Wl(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return v`
    <div class="rgroup">
      <div class="rlabel">${u(e === "true" ? "rules.whenTrue" : "rules.whenFalse")}</div>
      ${n[i].map((s, o) => hb(t, e, o, s))}
      <select class="radd" data-action=${`add-action-${e}`} .value=${""}
        @change=${(s) => {
    const o = s.target, r = t.deviceById(o.value);
    o.value = "", r && he(r).length > 0 && t.onChange({ ...n, [i]: [...n[i], { device: r.id, do: he(r)[0] }] });
  }}>
        <option value="">${u("rules.addAction")}</option>
        ${t.actionDevices.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
      </select>
    </div>`;
}
const Ms = (t) => t.trim() === "" ? NaN : Number(t);
function jl(t, e, n, i) {
  var s;
  return v`<select data-part=${e} data-value=${n} @change=${(o) => i(o.target.value)}>
    ${t.lightSensors.some((o) => o.id === n) ? b : v`<option value=${n}>${((s = t.deviceById(n)) == null ? void 0 : s.name) ?? u("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((o) => v`<option value=${o.id}>${o.name}</option>`)}
  </select>`;
}
const fb = ["night", "dark", "day"];
function mb(t, e, n, i) {
  var s;
  if ("daylight" in n)
    return v`
      <div class="rparams">
        <label class="grow">${u("rules.daylight.sensor")} ${jl(t, "daylight", n.daylight, (o) => i({ ...n, daylight: o }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(o) => i({ ...n, is: o.target.value })}>
          ${fb.map((o) => v`<option value=${o}>${u(`rules.daylight.is.${o}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const o = n.light === "" ? void 0 : t.lightUnit(n.light);
    return v`
      <div class="rparams">
        <label class="grow">${u("rules.light.sensor")}
          ${jl(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${u("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${yi(n.below)}
            @input=${(r) => i({ ...n, below: Ms(r.target.value) })} /> lx</label>
        <label>${u("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${yi(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: Ms(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${u("rules.light.unknownDark")}</label>
        ${o !== void 0 && o !== "lx" ? v`<p class="rwarn" data-warn="light-unit">${u("rules.light.unit").replace("{unit}", o)}</p>` : b}
      </div>`;
  }
  if ("time" in n)
    return v`
      <div class="rparams">
        <label>${u("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(o) => i({ time: { ...n.time, from: o.target.value } })} /></label>
        <label>${u("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(o) => i({ time: { ...n.time, to: o.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const o = n.held, r = ((s = t.draft.units) == null ? void 0 : s[e]) ?? ub(o.seconds), l = Number.isFinite(o.seconds) ? String(+(o.seconds / Bl[r]).toFixed(4)) : "", a = (d) => i({ held: { ...o, ...d } });
    return v`
      <div class="rparams">
        <div class="rsources">
          ${o.sources.length === 0 ? v`<span class="muted">${u("rules.held.noSources")}</span>` : b}
          ${o.sources.map((d, p) => v`
            <span class="rchip${lo(t, d) ? " bad" : ""}" data-part="source">${ro(t, d)}
              <button class="btn" data-action="remove-source" title=${u("rules.held.removeSource")}
                @click=${() => a({ sources: o.sources.filter((c, h) => h !== p) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(d) => {
      const p = d.target, c = Ud(t, p.value);
      p.value = "", c && ("device" in c || "rule" in c) && a({ sources: [...o.sources, c] });
    }}>
            <option value="">${u("rules.held.addSource")}</option>
            ${Wd(t)}
          </select>
        </div>
        <label>${u("rules.held.state")}
          <select data-part="state" data-value=${o.state}
            @change=${(d) => a({ state: d.target.value })}>
            ${["on", "off", "any"].map((d) => v`<option value=${d}>${u(`rules.held.${d}`)}</option>`)}
          </select></label>
        <label>${u("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(d) => {
      var p;
      ((p = t.draft.units) == null ? void 0 : p[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(Ms(d.target.value) * Bl[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(d) => t.onUnit(e, d.target.value)}>
            ${db.map((d) => v`<option value=${d}>${u(`rules.unit.${d}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return b;
}
function ql(t, e, n, i) {
  const s = e.source, o = !("device" in s || "rule" in s), r = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return v`
    <div class="rline${pb(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${o ? u(`rules.src.${r}`) : Fd(t, e)}${"sun" in s ? v` <span class="muted">${e.not ? u("rules.sun.above") : oo(s)}</span>` : b}</span>
      ${"daylight" in s && !e.not ? b : v`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(l) => {
    const a = l.target.checked, { not: d, ...p } = e;
    i(a ? { ...p, not: !0 } : p);
  }} /> ${u("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${mb(t, n, s, (l) => i({ ...e, source: l }))}
    </div>`;
}
function gb(t) {
  const e = t.draft.rule, n = (s) => (o) => {
    const r = o.target, l = r.value ? Ud(t, r.value) : null;
    r.value = "", l && s(l);
  }, i = (s) => {
    const { gate: o, ...r } = e;
    t.onChange(s ? { ...r, gate: s } : r);
  };
  return v`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${u("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${u("rules.namePlaceholder")}
        @input=${(s) => t.onChange({ ...e, name: s.target.value })} />

      <label class="rlabel" for="rule-combine">${u("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(s) => t.onChange({ ...e, combine: s.target.value === "all" ? "all" : "any" })}>
        <option value="any">${u("rules.combine.any")}</option>
        <option value="all">${u("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${u("rules.inputs")}</div>
        ${e.inputs.length === 0 ? v`<p class="muted">${u("rules.noInputs")}</p>` : e.inputs.map((s, o) => ql(
    t,
    s,
    $i({ input: o }),
    (r) => t.onChange({ ...e, inputs: r ? e.inputs.map((l, a) => a === o ? r : l) : e.inputs.filter((l, a) => a !== o) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${n((s) => t.onChange({ ...e, inputs: [...e.inputs, { source: s }] }))}>
          ${Ul(t, u("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${u("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${u("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${to} step="1" .value=${yi(e.onDelay)}
              @input=${(s) => t.onChange({ ...e, onDelay: Fl(s.target.value) })} /></label>
          <label class="grow">${u("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${to} step="1" .value=${yi(e.offDelay)}
              @input=${(s) => t.onChange({ ...e, offDelay: Fl(s.target.value) })} /></label>
        </div>
      </div>

      <div class="rgroup">
        <div class="rlabel">${u("rules.gate")}</div>
        <p class="muted">${u("rules.gate.hint")}</p>
        ${e.gate ? ql(t, e.gate, $i("gate-input"), i) : v`<select class="radd" data-action="set-gate" .value=${""} @change=${n((s) => i({ source: s }))}>
            ${Ul(t, u("rules.gate.set"))}
          </select>`}
      </div>

      ${Wl(t, "true")}
      ${Wl(t, "false")}
    </div>`;
}
function vb(t) {
  const e = t.draft.rule, n = e.zoneId === null || t.zones.some((s) => s.id === e.zoneId), i = (s) => t.onFocus($i(s));
  return v`
    <div class="backdrop rule-backdrop" @change=${(s) => s.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}>
        <h3>${u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}</h3>
        <div class="rcols">
          ${gb(t)}
          ${ab({
    rule: e,
    inputName: (s) => Fd(t, s),
    actionName: (s) => {
      var o;
      return ((o = t.deviceById(s)) == null ? void 0 : o.name) ?? u("rules.missingDevice");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: i
  })}
        </div>
        ${t.problems.length > 0 ? v`<ul class="rproblems" role="alert">
          ${t.problems.map((s) => v`<li data-problem=${s}>${u(`rules.problem.${s}`)}</li>`)}</ul>` : b}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${u("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(s) => t.onChange({ ...e, zoneId: s.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? b : v`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(s) => {
    const { enabled: o, ...r } = e;
    t.onChange(s.target.checked ? r : { ...r, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Pt = Cn, nr = 20, yt = Pt - 2 * j, on = (yt - nr) / 2, ao = (Pt - on * 2 - nr) / 2, Zl = ao + on + nr, _s = (Pt - yt) / 2, Ss = Pt / 2, As = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), Gl = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", wb = (t) => `${t > 0 ? "+" : ""}${t} %`, Gt = (t, e) => Ht({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function Kl(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${As(n.t)} °C` : "", n.rh !== null ? `${As(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${As(n.ah)} g/m³` : "—"];
}
function bb(t) {
  var X, te, z;
  const e = t.rule, n = e.vent, i = t.trace, s = i == null ? void 0 : i.inputs[0], o = s == null ? void 0 : s.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((X = e.onTrue[0]) == null ? void 0 : X.device) ?? "", d = Kl(r, u("vent.sensor"), o == null ? void 0 : o.a), p = Kl(l, u("vent.than"), o == null ? void 0 : o.b), c = oe(Math.max(d.length, p.length)), h = u("vent.flow.vs").replace("{a}", r).replace("{b}", l), f = o ? `: ${o.pct === null ? ce(null) : wb(o.pct)}` : s ? `: ${s.detail}` : "", m = o ? `${Vd(h, Hd(yt) - f.length)}${f}` : `${h}${f}`, $ = u("vent.flow.margins").replace("{above}", Gl(n.above)).replace("{below}", Gl(n.below)), w = i == null ? void 0 : i.pending, g = w ? Math.max(0, Math.ceil((w.at - t.now) / 1e3)) : 0, y = u("vent.flow.runon").replace("{t}", Qi(e.offDelay)), k = [
    i ? `${u("rules.flow.result")}: ${ce(i.verdict)}` : u("rules.flow.result"),
    w ? `${y} (${u("vent.pending").replace("{to}", w.to ? "on" : "off").replace("{t}", Ye(g))})` : y
  ], M = i == null ? void 0 : i.last, x = [
    t.deviceName(a),
    `${((te = e.onTrue[0]) == null ? void 0 : te.do) ?? "?"} / ${((z = e.onFalse[0]) == null ? void 0 : z.do) ?? "?"}`,
    ...M ? [Ed(M)] : []
  ], S = M == null ? void 0 : M.error, C = oe(x.length + (S ? 1 : 0)), I = j + c + K, L = I + oe(2) + K, H = L + oe(2) + K, N = H + C + j, V = (Q) => _`<path class="fc-link" d=${`M${Q + on / 2} ${j + c} V${I - K / 2} H${Ss} V${I}`}></path>`, W = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${u("rules.status.error")}: ${i.reason}` : u(`rules.status.${i.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Pt}px`} viewBox=${`0 0 ${Pt} ${N}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("vent.flow.title")}>
        ${V(ao)}${V(Zl)}
        <path class="fc-link" d=${`M${Ss} ${I + oe(2)} V${L} M${Ss} ${L + oe(2)} V${H}`}></path>
        ${Gt(t, { x: ao, y: j, w: on, h: c, field: "vent-sensor", cls: o != null && o.a.why ? " nodata" : "", lines: d })}
        ${Gt(t, { x: Zl, y: j, w: on, h: c, field: "vent-than", cls: o != null && o.b.why ? " nodata" : "", lines: p })}
        ${Gt(t, { x: _s, y: I, w: yt, h: oe(2), field: "vent-above", cls: s ? G(s.value) : "", lines: [m, $], tip: `${h}${f}
${$}` })}
        ${Gt(t, { x: _s, y: L, w: yt, h: oe(2), field: "vent-runon", cls: i ? G(i.verdict) : "", lines: k })}
        ${Gt(t, { x: _s, y: H, w: yt, h: C, field: "vent-fan", cls: "", lines: x, err: S })}
      </svg>
      ${W ? v`<p class="fc-warn" data-note="status">${W}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
function En(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return v`
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
        ${t.texts.length > 0 ? v`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => v`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : b}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${u("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? b : v`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => v`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: s, ...o } = e;
    t.onChange(i.target.checked ? o : { ...o, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Is = (t) => t.trim() === "" ? NaN : Number(t), Cs = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Es(t, e, n, i, s) {
  var r;
  const o = n === "" || i.some((l) => l.id === n);
  return v`
    <select data-field=${e} data-value=${n} @change=${(l) => s(l.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? b : v`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? u("rules.missingDevice")}</option>`}
      ${i.map((l) => v`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function $b(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: u("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: u("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: u("vent.problem.fan") });
  const s = [...i], o = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((d) => !!d);
  for (const d of t.problems)
    d === "device-missing" && !o.some((p) => !t.deviceById(p)) && !(n.sensor && !t.climateSensors.some((p) => p.id === n.sensor)) && !(n.than && !t.climateSensors.some((p) => p.id === n.than)) || d === "vent" && i.length > 0 || s.push({ key: d, text: u(d === "delay" ? "vent.problem.runon" : `rules.problem.${d}`) });
  return s;
}
function yb(t) {
  var o;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), s = ((o = e.onTrue[0]) == null ? void 0 : o.device) ?? "";
  return En({
    prefix: "vent",
    title: u("vent.title"),
    hint: u("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: $b(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: v`
      <label class="rlabel">${u("vent.sensor")}</label>
      ${Es(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${u("vent.than")}</label>
      ${Es(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${u("vent.fan")}</label>
      ${Es(t, "vent-fan", s, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${u("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${Z(Cs(n.above))}
            @input=${(r) => i({ above: Is(r.target.value) })} /></label>
        <label>${u("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${Z(Cs(n.below))}
            @input=${(r) => i({ below: Is(r.target.value) })} /></label>
        <label>${u("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${Z(Cs(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(Is(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: bb({
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
const xb = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, xi = Cn, kb = xi - 2 * j, Mb = j, _b = xi / 2, Xl = (t) => t === null ? ce(null) : `${Math.round(t)} W`, Fn = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function Sb(t, e) {
  const n = t.until !== void 0 ? Ye(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? u("boiler.phase.heatingCheck").replace("{t}", n) : u("boiler.phase.heating");
    case "waiting":
      return u("boiler.phase.waiting").replace("{t}", n ?? Ye(0));
    case "blackout":
    case "limit":
    case "done":
      return u(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function Ab(t) {
  return t.phase === "heating" ? G(!0) : t.phase !== null ? G(!1) : G(t.relay === null ? null : t.relay === "on");
}
function Ib(t) {
  const n = t.rule.boiler, i = n.grid, s = t.trace, o = s == null ? void 0 : s.boiler, r = t.deviceName(n.device), l = [];
  let a = j;
  const d = (w, g, y, k) => {
    const M = oe(y.length + (k ? 1 : 0));
    l.push({ y: a, h: M, field: w, cls: g, lines: y, err: k }), a += M + K;
  };
  if (i) {
    d("boiler-grid", o && o.grid === null ? G(null) : "", [t.gridName(i.block), o ? Xl(o.grid) : u("boiler.flow.gridPower")]);
    const w = u("boiler.flow.formula").replace("{nominal}", Fn(i.nominal)), g = o && o.headroom !== null ? o.headroom > i.limit : null;
    d("boiler-limit", o ? G(g === null ? null : !g) : "", [
      o ? `${u("boiler.flow.headroom")}: ${g === null ? ce(null) : u(g ? "boiler.flow.over" : "boiler.flow.ok")}` : u("boiler.flow.headroom"),
      o && o.headroom !== null ? `${w} = ${Math.round(o.headroom)} / ${Fn(i.limit)} W` : `${w} ≤ ${Fn(i.limit)} W`
    ]);
  }
  d("boiler-button", o ? G(o.mode === "auto") : "", [
    o ? `${u("boiler.flow.mode")}: ${u(`boiler.mode.${o.mode}`)}` : u("boiler.flow.mode"),
    u("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const p = o ? Sb(o, t.now) : null, c = s == null ? void 0 : s.last;
  d("boiler-relay", o ? Ab(o) : "", [
    o ? `${u("boiler.flow.relay")}: ${o.relay ?? ce(null)}` : u("boiler.flow.relay"),
    r,
    ...p ? [p] : [],
    ...c ? [Ed(c)] : []
  ], c == null ? void 0 : c.error);
  const h = u("boiler.flow.done");
  d(i ? "boiler-nominal" : "boiler-power", o ? G(o.boilerW === null ? null : o.boilerW > 1) : "", [
    o ? `${u("boiler.flow.power")}: ${Xl(o.boilerW)}` : u("boiler.flow.power"),
    i ? `${u("boiler.flow.nominal").replace("{w}", Fn(i.nominal))}, ${h}` : h
  ]);
  const f = a - K + j, m = l.slice(1).map((w) => `M${_b} ${w.y - K} V${w.y}`).join(" "), $ = s && s.status !== "ok" ? s.status === "error" && s.reason ? `${u("rules.status.error")}: ${s.reason}` : u(`rules.status.${s.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${xi}px`} viewBox=${`0 0 ${xi} ${f}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((w) => Ht({ x: Mb, w: kb, ...w, focused: t.focused === w.field, onClick: () => t.onFocus(w.field) }))}
      </svg>
      ${$ ? v`<p class="fc-warn" data-note="status">${$}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const Yl = (t) => t.trim() === "" ? NaN : Number(t), Ql = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Ds(t, e, n, i, s) {
  const o = e === "" || n.some((r) => r.id === e);
  return v`
    <select data-field=${t} data-value=${e} @change=${(r) => s(r.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? b : v`<option value=${e}>${i}</option>`}
      ${n.map((r) => v`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function Cb(t) {
  var o;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: u("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: u("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: u("boiler.problem.grid") });
  const i = [...n], s = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((o = e.grid) == null ? void 0 : o.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !s || r === "boiler" && n.length > 0 || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Eb(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, s = (d) => t.onChange({ ...e, boiler: d }), o = (d) => i && s({ ...n, grid: { ...i, ...d } }), r = (d) => {
    const { grid: p, ...c } = n;
    s(d ? { ...c, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Ad, nominal: Id } } : c);
  }, l = (d) => {
    var p;
    return ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = (d) => {
    var p;
    return d === "" ? u("vent.pick") : ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  };
  return En({
    prefix: "boiler",
    title: u("boiler.title"),
    hint: u("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Cb(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: v`
      <label class="rlabel">${u("boiler.device")}</label>
      ${Ds("boiler-device", n.device, t.boilers, l(n.device), (d) => s({ ...n, device: d }))}

      <label class="rlabel">${u("boiler.button")}</label>
      ${Ds("boiler-button", n.button, t.buttons, l(n.button), (d) => s({ ...n, button: d }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(d) => r(d.target.checked)} /> ${u("boiler.limitOn")}</label>
      ${i ? v`
        <label class="rlabel">${u("boiler.grid")}</label>
        ${Ds("boiler-grid", i.block, t.grids, u("boiler.missingGrid"), (d) => o({ block: d }))}
        <div class="vnums">
          <label>${u("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${Z(Ql(i.limit))}
              @input=${(d) => o({ limit: Yl(d.target.value) })} /></label>
          <label>${u("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${Z(Ql(i.nominal))}
              @input=${(d) => o({ nominal: Yl(d.target.value) })} /></label>
        </div>` : b}`,
    diagram: Ib({
      rule: e,
      deviceName: a,
      gridName: (d) => {
        var p;
        return d === "" ? u("vent.pick") : ((p = t.grids.find((c) => c.id === d)) == null ? void 0 : p.name) ?? u("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const ki = Cn, We = 2, jd = 20, rn = 24, Jl = 220, ln = (ki - 2 * j - (We - 1) * jd) / We, an = ki / 2;
function Db(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const Lb = (t, e) => t === 1 ? an - ln / 2 : j + e % We * (ln + jd);
function ea(t, e, n, i) {
  const s = oe(Math.max(...e.map((p) => p.lines.length + (p.err ? 1 : 0)))), o = Math.ceil(e.length / We), r = (p) => t + p * (s + rn), l = e.map((p, c) => ({ ...p, x: Lb(e.length, c), y: r(Math.floor(c / We)), w: ln, h: s })), a = (p) => n ? r(p) + s + (p === o - 1 ? K : rn) / 2 : r(p) - (p === 0 ? K : rn) / 2, d = [];
  for (let p = 0; p < o; p++) {
    const c = l.slice(p * We, (p + 1) * We);
    for (const f of c) d.push(`M${f.x + ln / 2} ${n ? f.y + s : f.y} V${a(p)}`);
    const h = [an, ...c.map((f) => f.x + ln / 2)];
    Math.max(...h) > Math.min(...h) && d.push(`M${Math.min(...h)} ${a(p)} H${Math.max(...h)}`);
  }
  return d.push(n ? `M${an} ${a(0)} V${i}` : `M${an} ${i} V${a(o - 1)}`), { blocks: l, bottom: r(o - 1) + s, links: d.join(" ") };
}
function Pb(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, s = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [u("leak.flow.addSensor")] }] : e.sensors.map((y, k) => {
    const M = n == null ? void 0 : n.inputs[k];
    return { field: `leak-sensor:${y}`, cls: M ? G(M.value) : "", lines: [t.deviceName(y), M ? M.detail : u("device.leak_sensor")] };
  }), o = (y) => {
    var k, M;
    return ((M = (k = n == null ? void 0 : n.leak) == null ? void 0 : k.valves.find((x) => x.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => o(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [u("leak.flow.addValve")] }] : e.valves.map((y) => {
    var I;
    const k = (I = n == null ? void 0 : n.leak) == null ? void 0 : I.valves.find((L) => L.id === y), M = t.deviceName(y), x = (k == null ? void 0 : k.state) ?? null, S = y === r ? i : void 0, C = S ? (S.reason === "re-closed: leak" ? u("leak.flow.reclosed") : u("vent.flow.last").replace("{did}", u(`rules.did.${S.action}`))).replace("{at}", Ze(S.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? x === "closed" ? G(!0) : x === "open" ? "" : G(null) : "",
      lines: [M, n ? x === null ? ce(null) : u(`leak.state.${x}`) : u("leak.flow.close"), ...C ? [C] : []],
      err: S == null ? void 0 : S.error
    };
  }), a = oe(2), d = oe(Math.max(...s.map((y) => y.lines.length))), p = j + Math.ceil(s.length / We) * (d + rn) - rn + K, c = ea(j, s, !0, p), h = ea(p + a + K, l, !1, p + a), f = {
    x: an - Jl / 2,
    y: p,
    w: Jl,
    h: a,
    field: "leak",
    cls: n ? G(n.verdict) : "",
    lines: [n ? `${u("leak.flow.leak")}: ${n.verdict === null ? ce(null) : u(n.verdict ? "leak.yes" : "leak.no")}` : u("leak.flow.leak"), u("leak.flow.any")]
  }, m = h.bottom + j, $ = `${c.links} ${h.links}`, w = (y) => Ht({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), g = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${ki}px`} viewBox=${`0 0 ${ki} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("leak.flow.title")}>
        ${_`<path class="fc-link" d=${$}></path>`}
        ${c.blocks.map(w)}${w(f)}${h.blocks.map(w)}
      </svg>
      ${g ? v`<p class="fc-warn" data-note="status">${g}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
function ta(t, e, n, i, s, o, r) {
  const l = (d) => {
    var p;
    return ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = t.draft.focused;
  return v`
    <div class="rsources" data-group=${e}>
      ${i.map((d) => v`
        <span class="rchip${s.some((p) => p.id === d) ? "" : " bad"}${a === `${n}:${d}` ? " hl" : ""}"
          data-id=${d}>${l(d)}
          <button class="btn" data-action="remove" title=${u("leak.remove")}
            @click=${() => r(i.filter((p) => p !== d))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(d) => {
    const p = d.target, c = p.value;
    p.value = "", c && r([...i, c]);
  }}>
        <option value="">${o}</option>
        ${s.filter((d) => !i.includes(d.id)).map((d) => v`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}
function Ob(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: u("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: u("leak.problem.valves") });
  const i = [...n];
  for (const s of t.problems)
    s === "leak" && n.length > 0 || i.push({ key: s, text: u(`rules.problem.${s}`) });
  return i;
}
function Nb(t) {
  const e = t.draft.rule, n = e.leak;
  return En({
    prefix: "leak",
    title: u("leak.title"),
    hint: u("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Ob(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: v`
      <label class="rlabel">${u("leak.sensors")}</label>
      ${ta(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, u("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${u("leak.valves")}</label>
      ${ta(t, "leak-valves", "leak-valve", n.valves, t.valves, u("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: Pb({
      rule: e,
      deviceName: (i) => {
        var s;
        return ((s = t.deviceById(i)) == null ? void 0 : s.name) ?? u("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Mi = Cn, Tb = Mi - 2 * j, zb = Mi / 2;
function Vb(t) {
  const e = Ze(t.at);
  return Yi(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === _d ? u("timed.flow.elsewhere") : u("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function Hb(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, s = [];
  let o = j;
  const r = (f, m, $, w) => {
    const g = oe($.length + (w ? 1 : 0));
    s.push({ y: o, h: g, field: f, cls: m, lines: $, err: w }), o += g + K;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? u("timed.flow.events")]);
  const l = u(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Qi(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? u("timed.flow.running").replace("{t}", Ye(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : u("timed.flow.runningNow") : u("timed.flow.idle") : u("timed.flow.run");
  r("timed-minutes", i ? G(i.running) : n ? G(n.verdict) : "", [a, l]);
  const d = n == null ? void 0 : n.last;
  r("timed-device", i ? G(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? u("timed.flow.state").replace("{s}", i.device ?? ce(null)) : u(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...d ? [Vb(d)] : []
  ], d == null ? void 0 : d.error);
  const p = o - K + j, c = s.slice(1).map((f) => `M${zb} ${f.y - K} V${f.y}`).join(" "), h = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Mi}px`} viewBox=${`0 0 ${Mi} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("timed.flow.title")}>
        <path class="fc-link" d=${c}></path>
        ${s.map((f) => Ht({ x: j, w: Tb, ...f, focused: t.focused === f.field, onClick: () => t.onFocus(f.field) }))}
      </svg>
      ${h ? v`<p class="fc-warn" data-note="status">${h}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const na = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function Rb(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? u("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${u("timed.events.start").replace("{e}", na(e.on))}, ${e.separateOff ? u("timed.events.stop").replace("{e}", na(e.off)) : u("timed.events.noStop")}`;
}
const Bb = (t) => t.trim() === "" ? NaN : Number(t);
function ia(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return v`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? b : v`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((o) => v`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function Fb(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: u("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: u("timed.problem.device") });
  const i = [...n], s = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), o = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !s || r === "timed" && n.length > 0 && o || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Ub(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), s = Rb(t.deviceById(n.button)), o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return En({
    prefix: "timed",
    title: u("timed.title"),
    hint: u("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Fb(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: v`
      <label class="rlabel">${u("timed.button")}</label>
      ${ia("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${s ? v`<p class="muted" data-note="events">${s}</p>` : b}

      <label class="rlabel">${u("timed.device")}</label>
      ${ia("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${u("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${Z(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: Bb(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${u("timed.invert")}</label>`,
    diagram: Hb({
      rule: e,
      deviceName: o,
      events: s,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Wb = { "outside-wants": "outside-sensor" }, _i = Cn, Xt = _i - 2 * j, Ls = _i / 2, Jn = 16, jb = { 1: [Xt], 2: [(Xt - Jn) / 2, (Xt - Jn) / 2], 3: [176, 116, Xt - 176 - 116 - 2 * Jn] }, co = (t, e) => t !== void 0 ? Ye(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function qb(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), s = i ? i[1] : t.detail, o = t.daylight === null && s === u("daylight.noData") ? [] : [s];
  return i && o.push(`${i[2]} in ${co(t.until, n) ?? Ye(0)}`), t.daylight === null && e && o.push(u("outside.flow.countsNight")), o;
}
function Zb(t) {
  const e = Ze(t.at);
  return Yi(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : Sd(t) ? u("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? u("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function Gb(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, s = e.window, o = [{
    field: "outside-sensor",
    cls: i ? G(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${u("outside.flow.daylight")}: ${u(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...qb(i, e.noDataNight === !0, t.now)] : [u("outside.flow.daylight"), t.deviceName(e.sensor), u(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && o.push({
    field: "outside-sunset",
    cls: i ? G(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${u("outside.flow.sun")}: ${i.sun === null ? ce(null) : u(`outside.sun.${i.sun}`)}` : u("outside.flow.sun"), u("outside.flow.afterSunset")]
  }), s) {
    const I = `${s.from}-${s.to}`, L = i && i.window !== null ? co(i.windowUntil, t.now) : null;
    o.push({
      field: "outside-window",
      cls: i ? G(i.window) : "",
      lines: i ? [
        i.window === null ? `${u("outside.flow.window")}: ${ce(null)}` : u(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        I,
        ...L ? [u(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", L)] : []
      ] : [u("outside.flow.window"), I]
    });
  }
  const r = [], l = jb[o.length], a = oe(Math.max(...o.map((I) => I.lines.length)));
  let d = j;
  for (const [I, L] of o.entries())
    r.push({ ...L, x: d, y: j, w: l[I], h: a }), d += l[I] + Jn;
  let p = j + a + K;
  const c = (I) => {
    const L = oe(I.lines.length + (I.err ? 1 : 0));
    r.push({ ...I, x: j, y: p, w: Xt, h: L }), p += L + K;
  }, h = u("outside.flow.rule").replace("{sun}", e.afterSunset ? u("outside.flow.ruleSun") : "").replace("{window}", s ? u("outside.flow.ruleWindow") : "");
  c({
    field: "outside-wants",
    cls: n ? G(n.verdict) : "",
    lines: [n ? `${u("outside.flow.wants")}: ${n.verdict === null ? ce(null) : n.verdict ? "on" : "off"}` : u("outside.flow.wants"), h]
  });
  const f = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? co(i.pausedUntil, t.now) : null;
  c(e.pause === 0 ? { field: "outside-pause", cls: i ? G(!0) : "", lines: [u("outside.flow.never"), u("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? G(f === null) : "",
    lines: [
      i ? f !== null ? u("outside.flow.paused").replace("{t}", f) : u("outside.flow.noPause") : u("outside.flow.pause"),
      u("outside.flow.after").replace("{d}", Qi(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, $ = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ce(null)) : u("outside.flow.onOff"),
    ...m ? [Zb(m)] : []
  ];
  c({
    field: "outside-light",
    cls: i ? G(i.light === null ? null : i.light === "on") : "",
    lines: $,
    err: m == null ? void 0 : m.error,
    tip: m ? [...$, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const w = p - K + j, g = r.find((I) => I.field === "outside-wants"), y = j + a + K / 2, k = r.slice(0, o.length), M = [Ls, ...k.map((I) => I.x + I.w / 2)], x = [
    ...k.map((I) => `M${I.x + I.w / 2} ${j + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${Ls} ${y} V${g.y}`,
    ...r.slice(o.length + 1).map((I) => `M${Ls} ${I.y - K} V${I.y}`)
  ].join(" "), S = (I) => Ht({ ...I, focused: t.focused === I.field, onClick: () => t.onFocus(I.field) }), C = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${_i}px`} viewBox=${`0 0 ${_i} ${w}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("outside.flow.title")}>
        ${_`<path class="fc-link" d=${x}></path>`}
        ${r.map(S)}
      </svg>
      ${C ? v`<p class="fc-warn" data-note="status">${C}</p>` : b}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : b}
    </div>`;
}
const Kb = { from: "17:00", to: "01:00" }, Xb = (t) => t.trim() === "" ? NaN : Number(t);
function sa(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return v`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? b : v`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((o) => v`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function oa(t, e, n, i, s) {
  return v`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(o) => {
    const { [e]: r, ...l } = n;
    s(o.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function Yb(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: u("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: u("outside.problem.sensor") });
  const i = [...n], s = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), o = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !s || l === "outside" && n.length > 0 && o && r || i.push({ key: l, text: u(`rules.problem.${l}`) });
  return i;
}
function Qb(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), s = n.window, o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return En({
    prefix: "outside",
    title: u("outside.title"),
    hint: u("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Yb(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: v`
      <label class="rlabel">${u("outside.light")}</label>
      ${sa("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${u("outside.sensor")}</label>
      ${sa("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${oa("outside-nodata", "noDataNight", n, u("outside.noDataNight"), i)}
      ${oa("outside-sunset", "afterSunset", n, u("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${s !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...Kb } } : a);
    }} /> ${u("outside.window")}</label>
      ${s ? v`
        <div class="vnums">
          <label>${u("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${Z(s.from)}
              @input=${(r) => i({ ...n, window: { ...s, from: r.target.value } })} /></label>
          <label>${u("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${Z(s.to)}
              @input=${(r) => i({ ...n, window: { ...s, to: r.target.value } })} /></label>
        </div>` : b}

      <div class="vnums">
        <label>${u("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${Z(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: Xb(r.target.value) })} /></label>
        <span class="muted">${u("outside.pauseNote")}</span>
      </div>`,
    diagram: Gb({
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
const Jb = ["power", "voltage", "power_in", "power_out", "control"], e$ = 300;
function ra(t) {
  t().catch(() => {
  });
}
function t$(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Nt(r), controllable: qa(r) };
    for (const a of Jb) {
      const d = (s = r.bindings) == null ? void 0 : s[a];
      d && (l[a] = d);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class n$ {
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
      }, e$);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && ra(n.unsub));
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
          ra(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(_e(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Od || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Pd));
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
const Ps = 1e4, la = 400, i$ = 1e3, aa = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), s$ = ["timer", "power"], o$ = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function qd(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of Ee(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function r$(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function l$(t, e, n) {
  var i;
  if (t.settled) {
    const s = r$(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (aa.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !aa.has(e.state) ? e.state : void 0 };
}
function ca(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return zd(s, n, i)[0];
}
function a$(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of qd(n)) e.add(i.entity);
  return [...e].sort();
}
class c$ {
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
    return i && n - i.at < Ps ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < la).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= Ps && o < Ps + i$ && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = qd(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = o$(n, l.entity);
      if (!a) continue;
      const d = o + l.entity, { value: p, text: c } = l$(l, a, this.seen.get(d));
      p !== void 0 && this.seen.set(d, { last: p }), c && this.events.set(e.id, { text: c, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = Yn(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < la);
      for (const l of s$) {
        const a = ca(o, l, e, i);
        a && !ca(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const Un = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function da(t) {
  t().catch(() => {
  });
}
class d$ {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && da(n.unsub));
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
        n.live ? n.unsub = i : da(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: Un(s.lc) ?? Un(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const d = Un(l.lc) ?? (a ? Un(l.lu) : void 0);
        d && (r.last_changed = d);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var u$ = Object.defineProperty, F = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && u$(e, n, s), s;
};
const sr = class sr extends xt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Su.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = g1(), this.nextObj = o1(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = _c(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Gw(), this.resizeObs = null, this.session = new p1(this), this.haMeta = new h1(this), this.feed = new Kw(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new Nv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new n$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new c$(), this.entityFeed = new d$(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => $u(i, (s) => {
      var o;
      return Mc(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new ef(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = f1(this), this.activeTool = Ks("select", this.ctx), this.input = new Uw(this);
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
    this.entityFeed.watch(e ? a$(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? t$(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, d, p, c, h;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((f) => Yn(f, this.hass.states).timerSince !== void 0 || this.events.event(f.id, n) !== null || this.events.leaving(f.id, n).length > 0), s = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, o = !!s && (!!s.pending || s.inputs.some((f) => f.until !== void 0 && f.until > n) || (((l = s.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = s.boiler) == null ? void 0 : a.until) ?? 0) > n || ((d = s.timed) == null ? void 0 : d.running) === !0 && (s.timed.until ?? 0) > n || [(p = s.outside) == null ? void 0 : p.pausedUntil, (c = s.outside) == null ? void 0 : c.until, (h = s.outside) == null ? void 0 : h.windowUntil].some((f) => (f ?? 0) > n));
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
    const i = this.history.current.power, s = n ?? (i && Mh(i, e));
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
      const r = this.planLevels(), l = ((s = this.selection) == null ? void 0 : s.kind) === "zone" ? this.selection.id : null, a = r.flatMap((h) => h.zones).find((h) => h.id === l), d = ((o = this.selection) == null ? void 0 : o.kind) === "device" ? r.flatMap((h) => h.devices).find((h) => h.id === this.selection.id) : void 0, p = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? Kv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? pw({}, p, d && xs(d) ? d.id : null, d && xs(d) ? d.name : "") : e === "outside" ? nw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? dw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? iw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? lw({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, p, (a == null ? void 0 : a.name) ?? null) : ht(p), isNew: !0, focused: null };
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
      var o;
      const i = this.renderRoot.querySelector(`.rule-backdrop [data-field="${n}"]`), s = i != null && i.matches("input, select, button") ? i : (i == null ? void 0 : i.querySelector("select, input, button")) ?? i;
      (o = s == null ? void 0 : s.scrollIntoView) == null || o.call(s, { block: "nearest" }), s == null || s.focus();
    });
  }
  /** OK: the rule is added or changed as one undoable edit (an unchanged rule closes the dialog without an edit). */
  commitRuleDraft() {
    const e = this.ruleDraft;
    if (this.dialog = null, this.ruleDraft = null, !e) return;
    const n = this.rules.find((i) => i.id === e.rule.id);
    e.isNew ? this.commitRules(Tv(this.rules, e.rule)) : n && !Xn(n, e.rule) && this.commitRules(zv(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && Xn(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return b;
    const n = this.planLevels(), i = n.flatMap((c) => c.devices), s = e.rule, o = this.session.savedRules.find((c) => c.id === s.id), r = this.shownRuleTrace(s), l = o ? Xn(o, s) ? null : u("rules.flow.edited") : u("rules.flow.new"), a = n.length > 1, d = n.flatMap((c) => c.zones.map((h) => ({ id: h.id, name: a ? `${h.name} (${c.name})` : h.name }))), p = jv(
      this.rules,
      s,
      (c) => i.some((h) => h.id === c),
      (c) => {
        const h = i.find((f) => f.id === c);
        return h && he(h);
      },
      (c) => i.some((h) => h.id === c && h.props.kind === "illuminance_sensor"),
      (c) => i.some((h) => h.id === c && h.props.kind === "climate_sensor"),
      (c) => i.some((h) => h.id === c && no(h)),
      (c) => i.some((h) => h.id === c && (h.props.kind === "wall_switch" || h.props.kind === "smart_button")),
      (c) => this.boilerGridBlocks().some((h) => h.id === c),
      (c) => {
        const h = i.find((f) => f.id === c);
        return !h || rw(h);
      },
      (c) => i.some((h) => h.id === c && h.props.kind === "leak_sensor"),
      (c) => i.some((h) => h.id === c && h.props.kind === "valve"),
      (c) => i.some((h) => h.id === c && (h.props.kind === "wall_switch" || h.props.kind === "smart_button")),
      (c) => i.some((h) => h.id === c && he(h).includes("on")),
      (c) => i.some((h) => h.id === c && he(h).includes("on"))
    );
    return ow(s) ? Eb({
      draft: e,
      boilers: i.filter(no),
      buttons: i.filter((c) => c.props.kind === "wall_switch" || c.props.kind === "smart_button"),
      grids: this.boilerGridBlocks().map((c) => ({ id: c.id, name: c.name || u("power.kind.grid") })),
      deviceById: (c) => i.find((h) => h.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, xb[c] ?? c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : Gv(s) ? Nb({
      draft: e,
      sensors: i.filter((c) => c.props.kind === "leak_sensor"),
      valves: i.filter((c) => c.props.kind === "valve"),
      deviceById: (c) => i.find((h) => h.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, Db(c)),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : Qv(s) ? Ub({
      draft: e,
      buttons: i.filter((c) => c.props.kind === "wall_switch" || c.props.kind === "smart_button"),
      devices: i.filter((c) => he(c).includes("on")),
      deviceById: (c) => i.find((h) => h.id === c),
      zones: d,
      problems: p,
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
    }) : tw(s) ? Qb({
      draft: e,
      lights: i.filter((c) => he(c).includes("on")),
      sensors: i.filter((c) => c.props.kind === "illuminance_sensor"),
      deviceById: (c) => i.find((h) => h.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, Wb[c] ?? c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : aw(s) ? yb({
      draft: e,
      climateSensors: i.filter((c) => c.props.kind === "climate_sensor"),
      fans: i.filter((c) => {
        const h = he(c);
        return h.includes("on") && h.includes("off");
      }),
      deviceById: (c) => i.find((h) => h.id === c),
      zones: d,
      problems: p,
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
    }) : vb({
      draft: e,
      inputDevices: i.filter(xs),
      lightSensors: i.filter((c) => c.props.kind === "illuminance_sensor"),
      lightUnit: (c) => {
        var m, $, w, g, y;
        const h = ($ = (m = i.find((k) => k.id === c)) == null ? void 0 : m.bindings) == null ? void 0 : $.illuminance, f = h ? (g = (w = this.hass) == null ? void 0 : w.states) == null ? void 0 : g[h] : void 0;
        return (y = f == null ? void 0 : f.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((c) => he(c).length > 0),
      deviceById: (c) => i.find((h) => h.id === c),
      otherRules: this.rules.filter((c) => c.id !== s.id),
      ruleName: (c) => {
        var h;
        return (h = this.rules.find((f) => f.id === c)) == null ? void 0 : h.name;
      },
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c),
      onUnit: (c, h) => {
        const f = this.ruleDraft ?? e;
        this.ruleDraft = { ...f, units: { ...f.units, [c]: h } };
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
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(Vv(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !vs(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !vs(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Cc(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? zo(n, e.id) : e.kind === "opening" ? Fa(n, e.id) : mc(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Dc(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Ac(n, e.id);
    return i === n ? this.notice = u("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = _e(i);
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
    this.selection = s && n && i && vs(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Ks(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(Go(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = re(n, i);
    s && (this.view = Ol(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = cc(n).get(e);
    s && (this.view = Ol(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? t1(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return Ow(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = Nw(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = Kh(this.power, this.ctx.geo());
    e && (this.powerView = Tw(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return jw({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? Fv(this.rules, this.dialog.id).map((o) => o.name) : [],
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
    var f, m, $, w;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${u("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${u("action.retry")}</button>` : u("load.loading")}</div>`;
    const e = lg(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, d = this.save, p = this.mode === "power", c = Date.now(), h = ($ = this.hass) == null ? void 0 : $.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : p ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${Ew(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${qg({
      steps: Xg({
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
        ${xw(this, n)}
        ${Mw(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? Hw(this.view, l, a, e, p ? 0.1 : 1) : b}
            ${this.mode === "power" ? sg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Dm(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => Yn(g, h),
      bubbles: (g) => {
        const y = Yn(g, h), k = this.events.event(g.id, c);
        return {
          shown: [...zd(y, g, c), ...k ? [{ text: k.text, tone: "event", key: k.at }] : []],
          leaving: this.events.leaving(g.id, c)
        };
      }
    })}
            ${i.tracker ? Iw(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: Cw(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : b}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? Ww({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : b}
        </div>
        ${Aw({
      grid: this.grid,
      zoomPct: Math.round(r * (p ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? u(`snap.${i.snap.kind}`) : null,
      onGrid: (g) => {
        this.grid = g;
      },
      cones: this.cones,
      onCones: (g) => {
        this.cones = g;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: p
    })}
        ${this.automationsMenu ? yw(this.automationsMenu, (g) => this.pickAutomation(g), () => this.closeAutomationsMenu()) : b}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
sr.styles = Dw;
let R = sr;
F([
  Te({ attribute: !1 })
], R.prototype, "hass");
F([
  Te({ type: Boolean })
], R.prototype, "narrow");
F([
  Te({ attribute: !1 })
], R.prototype, "panel");
F([
  B()
], R.prototype, "plan");
F([
  B()
], R.prototype, "automationsMenu");
F([
  B()
], R.prototype, "loadError");
F([
  B()
], R.prototype, "selection");
F([
  B()
], R.prototype, "toolId");
F([
  B()
], R.prototype, "wallType");
F([
  B()
], R.prototype, "thickness");
F([
  B()
], R.prototype, "boxMeasure");
F([
  B()
], R.prototype, "grid");
F([
  B()
], R.prototype, "mode");
F([
  B()
], R.prototype, "bindFilter");
F([
  B()
], R.prototype, "bindQuery");
F([
  B()
], R.prototype, "railCollapsed");
F([
  B()
], R.prototype, "showAll");
F([
  B()
], R.prototype, "zoneQuery");
F([
  B()
], R.prototype, "cones");
F([
  B()
], R.prototype, "nextProps");
F([
  B()
], R.prototype, "nextObj");
F([
  B()
], R.prototype, "planView");
F([
  B()
], R.prototype, "powerView");
F([
  B()
], R.prototype, "placeDeviceId");
F([
  B()
], R.prototype, "size");
F([
  B()
], R.prototype, "dialog");
F([
  B()
], R.prototype, "notice");
F([
  B()
], R.prototype, "fieldNotice");
F([
  B()
], R.prototype, "pendingDraft");
F([
  B()
], R.prototype, "ruleDraft");
F([
  B()
], R.prototype, "plans");
F([
  B()
], R.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", R);
export {
  R as PlanStudioPanel
};
