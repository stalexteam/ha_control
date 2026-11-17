/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jn = globalThis, vo = Jn.ShadowRoot && (Jn.ShadyCSS === void 0 || Jn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wo = Symbol(), yr = /* @__PURE__ */ new WeakMap();
let Sa = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== wo) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (vo && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = yr.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && yr.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const yu = (t) => new Sa(typeof t == "string" ? t : t + "", void 0, wo), Aa = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new Sa(n, t, wo);
}, xu = (t, e) => {
  if (vo) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = Jn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, xr = vo ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return yu(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ku, defineProperty: Mu, getOwnPropertyDescriptor: _u, getOwnPropertyNames: Su, getOwnPropertySymbols: Au, getPrototypeOf: Cu } = Object, Ke = globalThis, kr = Ke.trustedTypes, Iu = kr ? kr.emptyScript : "", as = Ke.reactiveElementPolyfillSupport, nn = (t, e) => t, ci = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Iu : null;
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
} }, $o = (t, e) => !ku(t, e), Mr = { attribute: !0, type: String, converter: ci, reflect: !1, useDefault: !1, hasChanged: $o };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ke.litPropertyMetadata ?? (Ke.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let xt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Mr) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && Mu(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = _u(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Mr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(nn("elementProperties"))) return;
    const e = Cu(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(nn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(nn("properties"))) {
      const n = this.properties, i = [...Su(n), ...Au(n)];
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
      for (const s of i) n.unshift(xr(s));
    } else e !== void 0 && n.push(xr(e));
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
    return xu(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : ci).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : ci;
      this._$Em = s;
      const c = a.fromAttribute(n, l.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? $o)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
xt.elementStyles = [], xt.shadowRootOptions = { mode: "open" }, xt[nn("elementProperties")] = /* @__PURE__ */ new Map(), xt[nn("finalized")] = /* @__PURE__ */ new Map(), as == null || as({ ReactiveElement: xt }), (Ke.reactiveElementVersions ?? (Ke.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const sn = globalThis, _r = (t) => t, di = sn.trustedTypes, Sr = di ? di.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ca = "$lit$", We = `lit$${Math.random().toFixed(9).slice(2)}$`, Ia = "?" + We, Eu = `<${Ia}>`, ft = document, gn = () => ft.createComment(""), bn = (t) => t === null || typeof t != "object" && typeof t != "function", yo = Array.isArray, Du = (t) => yo(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", cs = `[ 	
\f\r]`, jt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ar = /-->/g, Cr = />/g, rt = RegExp(`>|${cs}(?:([^\\s"'>=/]+)(${cs}*=${cs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ir = /'/g, Er = /"/g, Ea = /^(?:script|style|textarea|title)$/i, Da = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), g = Da(1), _ = Da(2), we = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), Dr = /* @__PURE__ */ new WeakMap(), at = ft.createTreeWalker(ft, 129);
function La(t, e) {
  if (!yo(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Sr !== void 0 ? Sr.createHTML(e) : e;
}
const Lu = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = jt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, u, f = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, u = r.exec(a), u !== null); ) p = r.lastIndex, r === jt ? u[1] === "!--" ? r = Ar : u[1] !== void 0 ? r = Cr : u[2] !== void 0 ? (Ea.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = rt) : u[3] !== void 0 && (r = rt) : r === rt ? u[0] === ">" ? (r = s ?? jt, f = -1) : u[1] === void 0 ? f = -2 : (f = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? rt : u[3] === '"' ? Er : Ir) : r === Er || r === Ir ? r = rt : r === Ar || r === Cr ? r = jt : (r = rt, s = void 0);
    const h = r === rt && t[l + 1].startsWith("/>") ? " " : "";
    o += r === jt ? a + Eu : f >= 0 ? (i.push(c), a.slice(0, f) + Ca + a.slice(f) + We + h) : a + We + (f === -2 ? l : h);
  }
  return [La(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class vn {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, u] = Lu(e, n);
    if (this.el = vn.createElement(c, i), at.currentNode = this.el.content, n === 2 || n === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (s = at.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const f of s.getAttributeNames()) if (f.endsWith(Ca)) {
          const p = u[r++], h = s.getAttribute(f).split(We), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? Pu : m[1] === "?" ? Nu : m[1] === "@" ? Tu : Hi }), s.removeAttribute(f);
        } else f.startsWith(We) && (a.push({ type: 6, index: o }), s.removeAttribute(f));
        if (Ea.test(s.tagName)) {
          const f = s.textContent.split(We), p = f.length - 1;
          if (p > 0) {
            s.textContent = di ? di.emptyScript : "";
            for (let h = 0; h < p; h++) s.append(f[h], gn()), at.nextNode(), a.push({ type: 2, index: ++o });
            s.append(f[p], gn());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ia) a.push({ type: 2, index: o });
      else {
        let f = -1;
        for (; (f = s.data.indexOf(We, f + 1)) !== -1; ) a.push({ type: 7, index: o }), f += We.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = ft.createElement("template");
    return i.innerHTML = e, i;
  }
}
function It(t, e, n = t, i) {
  var r, l;
  if (e === we) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = bn(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = It(t, s._$AS(t, e.values), s, i)), e;
}
class Ou {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? ft).importNode(n, !0);
    at.currentNode = s;
    let o = at.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new xo(o, o.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (c = new Hu(o, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = at.nextNode(), r++);
    }
    return at.currentNode = ft, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let xo = class Oa {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, i, s) {
    this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = It(this, e, n), bn(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== we && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Du(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== w && bn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ft.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = vn.createElement(La(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Ou(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Dr.get(e.strings);
    return n === void 0 && Dr.set(e.strings, n = new vn(e)), n;
  }
  k(e) {
    yo(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new Oa(this.O(gn()), this.O(gn()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = _r(e).nextSibling;
      _r(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class Hi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, s, o) {
    this.type = 1, this._$AH = w, this._$AN = void 0, this.element = e, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = w;
  }
  _$AI(e, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) e = It(this, e, n, 0), r = !bn(e) || e !== this._$AH && e !== we, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = o[0], a = 0; a < o.length - 1; a++) c = It(this, l[i + a], n, a), c === we && (c = this._$AH[a]), r || (r = !bn(c) || c !== this._$AH[a]), c === w ? e = w : e !== w && (e += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pu extends Hi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === w ? void 0 : e;
  }
}
class Nu extends Hi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== w);
  }
}
let Tu = class extends Hi {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = It(this, e, n, 0) ?? w) === we) return;
    const i = this._$AH, s = e === w && i !== w || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== w && (i === w || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Hu {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    It(this, e);
  }
}
const ds = sn.litHtmlPolyfillSupport;
ds == null || ds(vn, xo), (sn.litHtmlVersions ?? (sn.litHtmlVersions = [])).push("3.3.3");
const zu = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new xo(e.insertBefore(gn(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis;
let At = class extends xt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zu(n, this.renderRoot, this.renderOptions);
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
    return we;
  }
};
var _a;
At._$litElement$ = !0, At.finalized = !0, (_a = dt.litElementHydrateSupport) == null || _a.call(dt, { LitElement: At });
const us = dt.litElementPolyfillSupport;
us == null || us({ LitElement: At });
(dt.litElementVersions ?? (dt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vu = { attribute: !0, type: String, converter: ci, reflect: !1, hasChanged: $o }, Ru = (t = Vu, e, n) => {
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
function ze(t) {
  return (e, n) => typeof n == "object" ? Ru(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function q(t) {
  return ze({ ...t, state: !0, attribute: !1 });
}
function te() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function ko(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const ut = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Bu = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Fu = { ...ut, role: "power_in" }, Uu = { ...ut, role: "power_out" }, Wu = { role: "sun", domains: ["sun"], primary: !0 }, ju = ["on", "off", "auto"], Mo = (t) => ju.includes(t), ps = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), qu = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Wu
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [ps("on"), ps("off"), ps("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, ut],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, ut, Bu, Fu, Uu]
}, _o = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Zu = { climate_sensor: "any", illuminance_sensor: "any" };
function Oe(t) {
  const e = t.props, n = qu[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Pa(t) {
  return new Set(Oe(t).map((e) => e.role));
}
function zi(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !Pa(s).has(n)) return t;
  const o = (l = s.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (o === void 0) return t;
    const a = { ...s.bindings };
    delete a[n];
    const c = { ...s, bindings: a };
    if (Object.keys(a).length === 0 && delete c.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...f } = s.props;
      c.props = f;
    }
    return { ...t, devices: t.devices.map((u) => u === s ? c : u) };
  }
  if (o === i) return t;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
function Gu(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = Oe(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (Zu[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Ku(t) {
  const e = Oe(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Xu = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function Fs(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Mo(e) ? n : `${n}|${Xu(i[e])}`;
}
function Yu(t, e, n) {
  const i = Fs(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && Oe(s).some((o) => Fs(s, o.role) === i));
}
function Qu(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Oe(t)) {
    const s = Mo(i) ? Fs(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function Vi(t) {
  if (!t.bindings) return t;
  const e = Pa(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Na = (t) => t === "wall_switch" || t === "smart_button", Ri = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", wn = (t) => t === "wall" ? "wall" : "free", Ju = [100, 125, 150], So = "mdi:cube-outline", Lr = ["single", "double", "hold"], Qe = (t) => "button" in t, ep = {
  bearing: 400
}, ei = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Ta(t = te(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Or(t) {
  return {
    id: te(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Ta()]
  };
}
const Ao = {
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
}, Et = 90, Ha = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Je(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: So, label: "" };
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
const tp = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: So
};
function np(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : tp[String(n)] ?? So;
  return { ...t, props: { ...i, icon: s } };
}
function ip(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = wn(t.placement.mode);
  return e ? { ...t, props: Je("smart_button", n), bindings: { on: e } } : { ...t, props: Je("wall_switch", n) };
}
const za = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function sp(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = za(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function op(t) {
  const e = t.props.kind;
  if (!Ri(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Je(e, wn(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? sp(r, o) : s === "windowSec" ? za(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function rp(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function lp(t) {
  if (!Ri(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function ap(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Vi(rp(lp(op(ip(np(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function z(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function O(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function L(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function G(t, e) {
  return t.x * e.x + t.y * e.y;
}
function de(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Va(t) {
  return Math.hypot(t.x, t.y);
}
function H(t, e) {
  return Va(O(e, t));
}
function Bi(t) {
  const e = Va(t);
  return e === 0 ? { x: 0, y: 0 } : L(t, 1 / e);
}
function se(t) {
  return { x: t.y, y: -t.x };
}
function Ra(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function _e(t, e, n, i) {
  const s = de(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = de(O(n, t), i) / s;
  return z(t, L(e, o));
}
function Fi(t, e, n) {
  const i = O(n, e), s = G(i, i);
  return s === 0 ? 0 : G(O(t, e), i) / s;
}
function Ie(t, e, n) {
  const i = O(n, e), s = G(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, G(O(t, e), i) / s));
  return H(t, z(e, L(i, o)));
}
function Dt(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function Ee(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let et = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function cp(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function je(t, e, n) {
  const i = new et(null, null);
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
function fs(t, e, n, i) {
  const s = new et(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = je(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Pr(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = je(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function dp(t, e, n) {
  return e === null ? t : (t === null || (e = je(t.key, e, n), e.left = t), e);
}
function Us(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && Us(t.left, o, !1, i, s), t.right && Us(t.right, o, !0, i, s);
  }
}
class Co {
  constructor(e = cp) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = fs(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new et(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = je(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = je(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = je(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = je(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = je(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return pp(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && qs(e, n, 0, s - 1, o), this._root === null)
      this._root = Ws(e, n, 0, s), this._size = s;
    else {
      const r = fp(
        this.toList(),
        up(e, n),
        o
      );
      s = this._size + s, this._root = js({ head: r }, 0, s);
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
    return Us(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Pr(e, this._root, s);
    s(e, n) < 0 ? r = fs(n, i, r, s) : o = fs(n, i, o, s), this._root = dp(o, r, s);
  }
  split(e) {
    return Pr(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function Ws(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new et(r, l);
    return a.left = Ws(t, e, n, o), a.right = Ws(t, e, o + 1, i), a;
  }
  return null;
}
function up(t, e) {
  const n = new et(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new et(t[s], e[s]);
  return i.next = null, n.next;
}
function pp(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new et(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function js(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = js(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = js(t, s + 1, n), r;
  }
  return null;
}
function fp(t, e, n) {
  const i = new et(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function qs(t, e, n, i, s) {
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
  qs(t, e, n, l, s), qs(t, e, l + 1, i, s);
}
const Te = 11102230246251565e-32, oe = 134217729, hp = (3 + 8 * Te) * Te;
function hs(t, e, n, i, s) {
  let o, r, l, a, c = e[0], u = i[0], f = 0, p = 0;
  u > c == u > -c ? (o = c, c = e[++f]) : (o = u, u = i[++p]);
  let h = 0;
  if (f < t && p < n)
    for (u > c == u > -c ? (r = c + o, l = o - (r - c), c = e[++f]) : (r = u + o, l = o - (r - u), u = i[++p]), o = r, l !== 0 && (s[h++] = l); f < t && p < n; )
      u > c == u > -c ? (r = o + c, a = r - o, l = o - (r - a) + (c - a), c = e[++f]) : (r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p]), o = r, l !== 0 && (s[h++] = l);
  for (; f < t; )
    r = o + c, a = r - o, l = o - (r - a) + (c - a), c = e[++f], o = r, l !== 0 && (s[h++] = l);
  for (; p < n; )
    r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p], o = r, l !== 0 && (s[h++] = l);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function mp(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function C(t) {
  return new Float64Array(t);
}
const gp = (3 + 16 * Te) * Te, bp = (2 + 12 * Te) * Te, vp = (9 + 64 * Te) * Te * Te, wt = C(4), Nr = C(8), Tr = C(12), Hr = C(16), ae = C(4);
function wp(t, e, n, i, s, o, r) {
  let l, a, c, u, f, p, h, m, $, v, b, y, x, M, k, S, E, I;
  const N = t - s, B = n - s, D = e - o, A = i - o;
  M = N * A, p = oe * N, h = p - (p - N), m = N - h, p = oe * A, $ = p - (p - A), v = A - $, k = m * v - (M - h * $ - m * $ - h * v), S = D * B, p = oe * D, h = p - (p - D), m = D - h, p = oe * B, $ = p - (p - B), v = B - $, E = m * v - (S - h * $ - m * $ - h * v), b = k - E, f = k - b, wt[0] = k - (b + f) + (f - E), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, wt[1] = x - (b + f) + (f - S), I = y + b, f = I - y, wt[2] = y - (I - f) + (b - f), wt[3] = I;
  let P = mp(4, wt), V = bp * r;
  if (P >= V || -P >= V || (f = t - N, l = t - (N + f) + (f - s), f = n - B, c = n - (B + f) + (f - s), f = e - D, a = e - (D + f) + (f - o), f = i - A, u = i - (A + f) + (f - o), l === 0 && a === 0 && c === 0 && u === 0) || (V = vp * r + hp * Math.abs(P), P += N * u + A * l - (D * c + B * a), P >= V || -P >= V)) return P;
  M = l * A, p = oe * l, h = p - (p - l), m = l - h, p = oe * A, $ = p - (p - A), v = A - $, k = m * v - (M - h * $ - m * $ - h * v), S = a * B, p = oe * a, h = p - (p - a), m = a - h, p = oe * B, $ = p - (p - B), v = B - $, E = m * v - (S - h * $ - m * $ - h * v), b = k - E, f = k - b, ae[0] = k - (b + f) + (f - E), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, ae[1] = x - (b + f) + (f - S), I = y + b, f = I - y, ae[2] = y - (I - f) + (b - f), ae[3] = I;
  const K = hs(4, wt, 4, ae, Nr);
  M = N * u, p = oe * N, h = p - (p - N), m = N - h, p = oe * u, $ = p - (p - u), v = u - $, k = m * v - (M - h * $ - m * $ - h * v), S = D * c, p = oe * D, h = p - (p - D), m = D - h, p = oe * c, $ = p - (p - c), v = c - $, E = m * v - (S - h * $ - m * $ - h * v), b = k - E, f = k - b, ae[0] = k - (b + f) + (f - E), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, ae[1] = x - (b + f) + (f - S), I = y + b, f = I - y, ae[2] = y - (I - f) + (b - f), ae[3] = I;
  const W = hs(K, Nr, 4, ae, Tr);
  M = l * u, p = oe * l, h = p - (p - l), m = l - h, p = oe * u, $ = p - (p - u), v = u - $, k = m * v - (M - h * $ - m * $ - h * v), S = a * c, p = oe * a, h = p - (p - a), m = a - h, p = oe * c, $ = p - (p - c), v = c - $, E = m * v - (S - h * $ - m * $ - h * v), b = k - E, f = k - b, ae[0] = k - (b + f) + (f - E), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, ae[1] = x - (b + f) + (f - S), I = y + b, f = I - y, ae[2] = y - (I - f) + (b - f), ae[3] = I;
  const pe = hs(W, Tr, 4, ae, Hr);
  return Hr[pe - 1];
}
function $p(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= gp * c ? a : -wp(t, e, n, i, s, o, c);
}
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(8);
C(8);
C(8);
C(4);
C(8);
C(8);
C(16);
C(12);
C(192);
C(192);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(8);
C(8);
C(8);
C(8);
C(8);
C(8);
C(8);
C(8);
C(8);
C(4);
C(4);
C(4);
C(8);
C(16);
C(16);
C(16);
C(32);
C(32);
C(48);
C(64);
C(1152);
C(1152);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(4);
C(24);
C(24);
C(24);
C(24);
C(24);
C(24);
C(24);
C(24);
C(24);
C(24);
C(1152);
C(1152);
C(1152);
C(1152);
C(1152);
C(2304);
C(2304);
C(3456);
C(5760);
C(8);
C(8);
C(8);
C(16);
C(24);
C(48);
C(48);
C(96);
C(192);
C(384);
C(384);
C(384);
C(768);
C(96);
C(96);
C(96);
C(1152);
const qt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, Zs = (t, e) => {
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
let qe = Number.EPSILON;
qe === void 0 && (qe = Math.pow(2, -52));
const yp = qe * qe, zr = (t, e) => {
  if (-qe < t && t < qe && -qe < e && e < qe)
    return 0;
  const n = t - e;
  return n * n < yp * t * e ? 0 : t < e ? -1 : 1;
};
class xp {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Vr(), this.yRounder = new Vr();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class Vr {
  constructor() {
    this.tree = new Co(), this.round(0);
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
    if (i !== null && zr(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && zr(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const $n = new xp(), ti = (t, e) => t.x * e.y - t.y * e.x, Ba = (t, e) => t.x * e.x + t.y * e.y, Rr = (t, e, n) => {
  const i = $p(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, ui = (t) => Math.sqrt(Ba(t, t)), kp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return ti(s, i) / ui(s) / ui(i);
}, Mp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Ba(s, i) / ui(s) / ui(i);
}, Br = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Fr = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, _p = (t, e, n, i) => {
  if (e.x === 0) return Fr(n, i, t.x);
  if (i.x === 0) return Fr(t, e, n.x);
  if (e.y === 0) return Br(n, i, t.y);
  if (i.y === 0) return Br(t, e, n.y);
  const s = ti(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = ti(o, e) / s, l = ti(o, i) / s, a = t.x + l * e.x, c = n.x + r * i.x, u = t.y + l * e.y, f = n.y + r * i.y, p = (a + c) / 2, h = (u + f) / 2;
  return {
    x: p,
    y: h
  };
};
class be {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = be.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Xe.compare(e.segment, n.segment));
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
        sine: kp(this.point, e.point, o.point),
        cosine: Mp(this.point, e.point, o.point)
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
let Sp = 0;
class Xe {
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
      const f = e.comparePoint(n.leftSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
      const p = n.comparePoint(e.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (l < a && l < u) return -1;
      if (l > a && l > u) return 1;
      const f = n.comparePoint(e.leftSE.point);
      if (f !== 0) return f;
      const p = e.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (o < r) {
      const f = n.comparePoint(e.rightSE.point);
      if (f !== 0) return f;
    }
    if (o > r) {
      const f = e.comparePoint(n.rightSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
    }
    if (o !== r) {
      const f = c - l, p = o - i, h = u - a, m = r - s;
      if (f > p && h < m) return 1;
      if (f < p && h > m) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++Sp, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const l = be.comparePoints(e, n);
    if (l < 0)
      s = e, o = n, r = 1;
    else if (l > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new be(s, !0), c = new be(o, !1);
    return new Xe(a, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = Zs(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = qt(n, l) && this.comparePoint(l) === 0, u = qt(i, o) && e.comparePoint(o) === 0, f = qt(n, a) && this.comparePoint(a) === 0, p = qt(i, r) && e.comparePoint(r) === 0;
    if (u && c)
      return p && !f ? r : !p && f ? a : null;
    if (u)
      return f && o.x === a.x && o.y === a.y ? null : o;
    if (c)
      return p && r.x === l.x && r.y === l.y ? null : l;
    if (p && f) return null;
    if (p) return r;
    if (f) return a;
    const h = _p(o, this.vector(), l, e.vector());
    return h === null || !qt(s, h) ? null : $n.round(h.x, h.y);
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
    const n = [], i = e.events !== void 0, s = new be(e, !0), o = new be(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new Xe(s, r, this.rings.slice(), this.windings.slice());
    return be.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), be.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Xe.compare(n, i);
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
      const c = this.rings[l], u = this.windings[l], f = n.indexOf(c);
      f === -1 ? (n.push(c), i.push(u)) : i[f] += u;
    }
    const o = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const c = n[l], u = c.poly;
      if (r.indexOf(u) === -1)
        if (c.isExterior) o.push(u);
        else {
          r.indexOf(u) === -1 && r.push(u);
          const f = o.indexOf(c.poly);
          f !== -1 && o.splice(f, 1);
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
class Ur {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = $n.round(e[0][0], e[0][1]);
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
      let a = $n.round(e[r][0], e[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(Xe.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Xe.fromRing(o, s, this));
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
class Ap {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Ur(e[0], this, !0), this.bbox = {
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
      const o = new Ur(e[i], this, !1);
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
class Wr {
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
      const o = new Ap(e[i], this);
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
class pi {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, s = e.length; i < s; i++) {
      const o = e[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const c = [l], u = l.point, f = [];
      for (; r = l, l = a, c.push(l), l.point !== u; )
        for (; ; ) {
          const p = l.getAvailableLinkedEvents();
          if (p.length === 0) {
            const $ = c[0].point, v = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${$.x}, ${$.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (p.length === 1) {
            a = p[0].otherSE;
            break;
          }
          let h = null;
          for (let $ = 0, v = f.length; $ < v; $++)
            if (f[$].point === l.point) {
              h = $;
              break;
            }
          if (h !== null) {
            const $ = f.splice(h)[0], v = c.splice($.index);
            v.unshift(v[0].otherSE), n.push(new pi(v.reverse()));
            continue;
          }
          f.push({
            index: c.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = p.sort(m)[0].otherSE;
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
    for (let c = 1, u = this.events.length - 1; c < u; c++) {
      const f = this.events[c].point, p = this.events[c + 1].point;
      Rr(f, e, p) !== 0 && (n.push(f), e = f);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Rr(i, e, s) === 0 && n.shift(), n.push(n[0]);
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
      be.compare(e, r) > 0 && (e = r);
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
class jr {
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
class Cp {
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
        if (o.isExteriorRing()) n.push(new jr(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new jr(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Ip {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Xe.compare;
    this.queue = e, this.tree = new Co(n), this.segments = [];
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
        const f = l.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (c = f), !l.isAnEndpoint(f))) {
          const p = this._splitSafely(l, f);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      let u = null;
      if (a) {
        const f = a.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (u = f), !a.isAnEndpoint(f))) {
          const p = this._splitSafely(a, f);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      if (c !== null || u !== null) {
        let f = null;
        c === null ? f = u : u === null ? f = c : f = be.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(f);
        for (let h = 0, m = p.length; h < m; h++)
          i.push(p[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const c = l.getIntersection(a);
        if (c !== null) {
          if (!l.isAnEndpoint(c)) {
            const u = this._splitSafely(l, c);
            for (let f = 0, p = u.length; f < p; f++)
              i.push(u[f]);
          }
          if (!a.isAnEndpoint(c)) {
            const u = this._splitSafely(a, c);
            for (let f = 0, p = u.length; f < p; f++)
              i.push(u[f]);
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
const qr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Ep = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Dp {
  run(e, n, i) {
    ye.type = e, $n.reset();
    const s = [new Wr(n, !0)];
    for (let f = 0, p = i.length; f < p; f++)
      s.push(new Wr(i[f], !1));
    if (ye.numMultiPolys = s.length, ye.type === "difference") {
      const f = s[0];
      let p = 1;
      for (; p < s.length; )
        Zs(s[p].bbox, f.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (ye.type === "intersection")
      for (let f = 0, p = s.length; f < p; f++) {
        const h = s[f];
        for (let m = f + 1, $ = s.length; m < $; m++)
          if (Zs(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Co(be.compare);
    for (let f = 0, p = s.length; f < p; f++) {
      const h = s[f].getSweepEvents();
      for (let m = 0, $ = h.length; m < $; m++)
        if (o.insert(h[m]), o.size > qr)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Ip(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const f = a.key;
      if (o.size === l) {
        const h = f.segment;
        throw new Error(`Unable to pop() ${f.isLeft ? "left" : "right"} SweepEvent [${f.point.x}, ${f.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > qr)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Ep)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(f);
      for (let h = 0, m = p.length; h < m; h++) {
        const $ = p[h];
        $.consumedBy === void 0 && o.insert($);
      }
      l = o.size, a = o.pop();
    }
    $n.reset();
    const c = pi.factory(r.segments);
    return new Cp(c).getGeom();
  }
}
const ye = new Dp(), Lp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("union", t, n);
}, Op = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("intersection", t, n);
}, Pp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("xor", t, n);
}, Np = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("difference", t, n);
};
var Fa = {
  union: Lp,
  intersection: Op,
  xor: Pp,
  difference: Np
};
const Ua = 3, Tp = 1e-6;
function Ui(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function ee(t, e) {
  const n = Ui(t, e);
  return { x: n.x, y: n.y };
}
function vt(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : H(i, s);
}
function Wa(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: Bi(O(e, t)), len: H(t, e), leftOff: o, rightOff: r };
}
function le(t, e) {
  return Wa(ee(t, e.a), ee(t, e.b), e.thickness, e.baseline);
}
function nt(t, e) {
  const n = O(e, t.a);
  return { t: G(n, t.dir), side: G(n, se(t.dir)) };
}
function Zr(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: L(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const kt = (t) => z(t.p, L(se(t.u), t.offL)), Mt = (t) => O(t.p, L(se(t.u), t.offR));
function ct(t, e, n) {
  return t !== null && H(t, e) <= n;
}
function Hp(t) {
  const e = [];
  for (const n of t.walls) {
    const i = le(t, n);
    if (i.len < 1e-9) continue;
    const s = se(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: z(i.a, L(s, i.leftOff)),
        ar: O(i.a, L(s, i.rightOff)),
        bl: z(i.b, L(s, i.leftOff)),
        br: O(i.b, L(s, i.rightOff))
      }
    });
  }
  return e;
}
function zp(t, e) {
  const n = e.f, i = se(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = G(O(s.far, n.a), i) >= 0 ? z(n.a, L(i, n.leftOff)) : O(n.a, L(i, n.rightOff)), l = Ua * Math.max(s.body.wall.thickness, e.wall.thickness), a = _e(kt(s), s.u, r, n.dir), c = _e(Mt(s), s.u, r, n.dir);
    ct(a, s.p, l) && (s.body.c[s.leftKey] = a), ct(c, s.p, l) && (s.body.c[s.rightKey] = c);
  }
}
function Vp(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Ua * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = _e(Mt(o), o.u, kt(r), r.u);
    ct(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Rp(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = O(r, o), a = de(l, O(e, o)), c = de(l, O(s.far, o));
    a * c < 0 && Gs(s, [e]);
  }
}
function Gs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Rp(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(de(o.u, r.u)) > 1e-9 || G(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], c = _e(Mt(o), o.u, kt(a), a.u), u = _e(kt(r), r.u, kt(a), a.u);
        if (!ct(c, e, n) || !ct(u, e, n)) continue;
        const f = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, Gs(o, [e, f, u]);
      } else {
        const a = t[(s - 1 + i) % i], c = _e(kt(r), r.u, Mt(a), a.u), u = _e(Mt(o), o.u, Mt(a), a.u);
        if (!ct(u, e, n) || !ct(c, e, n)) continue;
        const f = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, Gs(r, [u, f, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Io(t) {
  const e = Hp(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(Zr(r, "a")), r.wall.b === i.id && s.push(Zr(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? zp(s, o) : s.length >= 2 && Vp(s, { x: i.x, y: i.y });
  }
  return e;
}
function ja(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Io(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: G(O(l, i.f.a), i.f.dir) });
    }
  return e;
}
function qa(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Wi(t) {
  return new Map(Io(t).map((e) => [e.wall.id, qa(e)]));
}
function Gr(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(z(s, L(O(o, s), r / (r - l))));
  }
  return n;
}
function Eo(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Io(t)) {
    const s = qa(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, f) => u.offset - f.offset), r = (u) => G(O(u, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const u of o)
      l.push([a, u.offset]), a = Math.max(a, u.offset + u.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [u, f] of l) {
      if (f <= u) continue;
      let p = s;
      u > -1 / 0 && (p = Gr(p, (h) => r(h) - u)), f < 1 / 0 && (p = Gr(p, (h) => f - r(h))), p.length >= 3 && Math.abs(Ee(p)) > Tp && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const Ks = (t) => [t.map((e) => [e.x, e.y])];
function Za(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Ga(t, e) {
  return Ka(e ? [...Eo(t).values()].flat() : [...Wi(t).values()]);
}
function Ka(t) {
  const e = t.map(Ks);
  if (e.length === 0) return [];
  let n;
  try {
    n = Fa.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Za));
}
const Lt = 1e-6, fi = ["door", "gate", "wicket"], Xa = (t) => t === "opening", Ya = (t) => t.passesLight ?? Xa(t.kind), Qa = (t) => t === "opening", Ja = (t) => t.passesPir ?? Qa(t.kind);
function ec(t, e) {
  return t.offset < e.offset + e.width - Lt && e.offset < t.offset + t.width - Lt;
}
function ji(t, e, n, i, s) {
  const o = vt(t, e);
  return o === null || i <= 0 || n < -Lt || n + i > o + Lt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && ec(r, { offset: n, width: i }));
}
function zt(t, e) {
  return { ...t, openings: e };
}
function Bp(t, e, n, i, s, o = {}) {
  const r = s ?? ei[n], l = i - r / 2;
  if (!ji(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: te(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return fi.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: zt(t, [...t.openings, a]), openingId: a.id };
}
function tc(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !ji(t, i.wallId, n, i.width, e) ? t : Dn(zt(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Fp(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !ji(t, i.wallId, i.offset, n, e) ? t : Dn(zt(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Up(t, e) {
  return fi.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Wp(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Dn(zt(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function nc(t, e) {
  return Dn(zt(t, t.openings.filter((n) => n.id !== e)));
}
function Dn(t) {
  return zt(t, t.openings.map((e) => {
    const n = vt(t, e.wallId), i = n === null || e.offset < -Lt || e.offset + e.width > n + Lt || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && ec(e, s));
    return { ...e, invalid: i };
  }));
}
const hi = 1e-6;
function ic(t, e) {
  return e.mode !== "none" && Ao[t.kind].includes(e.mode);
}
function sc(t, e, n) {
  if (n.mode === "none" || !ic(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Et || i > Et)) return !1;
  const s = vt(t, n.wallId);
  return s !== null && n.offset >= -hi && n.offset <= s + hi;
}
function Ve(t, e) {
  return { ...t, devices: e };
}
function Kr(t, e, n, i) {
  if (!sc(t, e, n)) return { level: t, deviceId: null };
  const s = { id: te(), name: i, placement: n, props: e, invalid: !1 };
  return { level: Ve(t, [...t.devices, s]), deviceId: s.id };
}
function oc(t, e) {
  const n = { id: te(), name: e, placement: { mode: "none" }, props: Je("equipment", "free"), invalid: !1 };
  return { level: Ve(t, [...t.devices, n]), id: n.id };
}
const jp = ["power", "power_in", "power_out", "voltage"];
function qp(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = jp.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Vt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, rc = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function lc(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function ac(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = Vi({ ...i, props: lc(i.props, "inverter", n), bindings: r });
  return Ve(t, t.devices.map((a) => a === i ? l : a));
}
function qi(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: lc(i.props, "controllable", n) };
  return Ve(t, t.devices.map((o) => o === i ? s : o));
}
function cc(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Je("motion_sensor", wn(e)), s = Je("motion_sensor", wn(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function mi(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !sc(t, s.props, n)) return t;
  const o = cc(s.props, s.placement.mode, n.mode);
  return dc(Ve(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function Rt(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? Ve(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return Vi({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Zp(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Na(i.props.kind) || i.props.kind === n) return t;
  const s = Je(n, wn(i.placement.mode));
  if (!ic(s, i.placement)) return t;
  const o = Vi({ ...i, props: s });
  return Ve(t, t.devices.map((r) => r === i ? o : r));
}
function Gp(t, e) {
  return Ve(t, t.devices.filter((n) => n.id !== e));
}
function dc(t) {
  return Ve(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = vt(t, e.placement.wallId), i = n === null || e.placement.offset < -hi || e.placement.offset > n + hi;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function uc(t) {
  const e = [];
  for (const n of Ga(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Xs(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!Dt(e, s)) continue;
    const o = Math.abs(Ee(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const ms = 1e-3;
function pc(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Ee(t)) - Math.abs(Ee(e))) > ms ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= ms && Math.abs(n.y - i.y) <= ms));
}
const fc = 2, Xr = Math.ceil(360 / fc), Yr = 1e-4, Kp = 1e-9, Qr = 1e-9, Xp = {
  light: Ya,
  motion: Ja
};
function hc(t, e) {
  const n = [];
  for (const i of Ka([...Eo(t, Xp[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Do(t, e, n) {
  return e.filter(([i, s]) => Ie(t, i, s) <= n);
}
function gs(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Yp(t, e, n) {
  const i = Do(t, e, n), s = [];
  for (let v = 0; v < Xr; v++) s.push(-Math.PI + 2 * Math.PI * v / Xr);
  const o = n * 1.05;
  for (const v of i)
    for (const b of v) {
      if (H(t, b) > o) continue;
      const y = Math.atan2(b.y - t.y, b.x - t.x);
      s.push(gs(y - Yr), gs(y), gs(y + Yr));
    }
  s.sort((v, b) => v - b);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([v, b], y) => {
    l[y] = v.x - t.x, a[y] = v.y - t.y, c[y] = b.x - v.x, u[y] = b.y - v.y;
  });
  const f = [], p = [];
  let h = NaN;
  for (const v of s) {
    if (v === h) continue;
    h = v;
    const b = Math.cos(v), y = Math.sin(v);
    let x = n, M = -1;
    for (let E = 0; E < r; E++) {
      const I = b * u[E] - y * c[E];
      if (Math.abs(I) < 1e-12) continue;
      const N = (l[E] * u[E] - a[E] * c[E]) / I;
      if (!(N > Kp && N < x)) continue;
      const B = (l[E] * y - a[E] * b) / I;
      B < -Qr || B > 1 + Qr || (x = N, M = E);
    }
    const k = { x: t.x + b * x, y: t.y + y * x }, S = f.length;
    if (!(S > 0 && f[S - 1].x === k.x && f[S - 1].y === k.y)) {
      if (M >= 0 && S >= 2 && p[S - 1] === M && p[S - 2] === M) {
        f[S - 1] = k;
        continue;
      }
      f.push(k), p.push(M);
    }
  }
  const m = f[0], $ = f[f.length - 1];
  return f.length > 1 && m.x === $.x && m.y === $.y && f.pop(), f;
}
const Qp = 32, Jr = 128;
function gi(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function He(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Lo(t) {
  return (t % 360 + 360) % 360;
}
function mc(t) {
  return (t % 360 + 540) % 360 - 180;
}
function gc(t, e, n, i) {
  const s = t.walls.find((c) => c.id === e);
  if (!s) return null;
  let o;
  try {
    o = le(t, s);
  } catch {
    return null;
  }
  const r = se(o.dir), l = n === "left" ? r : L(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: z(z(o.a, L(o.dir, i)), L(l, a)), normal: l };
}
function yn(t, e, n, i) {
  var s;
  return ((s = gc(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function re(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: gi(n.rotation) };
  const i = gc(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: z(i.pt, L(s, r)), dir: se(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? gi(He(s) + n.aim) : s, normal: s };
}
function el(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let c;
    try {
      c = le(t, a);
    } catch {
      continue;
    }
    const u = a.a === n ? c.dir : L(c.dir, -1);
    if (Math.abs(de(i, u)) < 1e-9 && G(i, u) < 0) {
      if ((G(se(c.dir), s) > 0 ? c.leftOff : c.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (G(u, s) > 1e-9) return !1;
  }
  return l;
}
function Oo(t, e, n, i) {
  var B;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((D) => D.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = le(t, s);
  } catch {
    return n;
  }
  const r = ja(t), l = r.filter((D) => D.wallId === n.wallId && D.side === n.side), a = l.find((D) => D.end === "a"), c = l.find((D) => D.end === "b");
  if (!a || !c) return n;
  const u = se(o.dir), f = n.side === "left" ? u : L(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, h = el(t, s, s.a, o.dir, f, p) ? -1 / 0 : a.offset, m = el(t, s, s.b, L(o.dir, -1), f, p) ? 1 / 0 : c.offset, $ = (D) => G(O(D, o.a), o.dir), v = [];
  for (const D of t.nodes)
    if (((B = D.host) == null ? void 0 : B.wallId) === s.id)
      for (const A of t.walls) {
        const P = A.a === D.id ? "a" : A.b === D.id ? "b" : null, V = P && t.nodes.find((W) => W.id === (P === "a" ? A.b : A.a));
        if (!V || (G(O(V, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const K = r.filter((W) => W.wallId === A.id && W.end === P).map((W) => $(W.pt));
        K.length && v.push([Math.min(...K), Math.max(...K)]);
      }
  v.sort((D, A) => D[0] - A[0]);
  const b = [];
  let y = h;
  for (const [D, A] of v) {
    const P = Math.min(D, m);
    P > y && b.push([y, P]), y = Math.max(y, A);
  }
  m > y && b.push([y, m]), b.length === 0 && b.push([h, m]);
  const x = ([D, A]) => Math.max(0, D - n.offset, n.offset - A), [M, k] = b.reduce((D, A) => x(A) < x(D) ? A : D), S = (e.shape === "circle" ? e.diameter : e.width) / 2, E = M + S, I = k - S;
  let N = n.offset;
  return E > I ? N = (M + k) / 2 : N <= E + i ? N = E : N >= I - i && (N = I), N = Math.max(0, Math.min(o.len, N)), Math.abs(N - n.offset) < 1e-9 ? n : { ...n, offset: N };
}
function bc(t, e) {
  const n = [];
  for (let i = 0; i < Jr; i++) n.push(z(t, L(gi(360 * i / Jr), e)));
  return n;
}
function tl(t, e, n, i) {
  if (n >= 360) return bc(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Qp)), o = He(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(z(t, L(gi(o + n * l / s), i)));
  return r;
}
const Jp = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Zi(t) {
  return Jp[t] ?? null;
}
const ef = (t) => Zi(t.kind) !== null;
function tf(t, e) {
  const n = e.props;
  if (!ef(n)) return null;
  const i = re(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? tl(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? tl(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? bc(i.pt, n.poolRadius) : null;
  }
}
function nf(t) {
  return t.normal ? z(t.pt, t.normal) : t.pt;
}
function nl(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function sf(t, e, n) {
  const i = O(e, t);
  for (const [s, o] of n) {
    const r = O(o, s), l = O(s, t), a = de(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = de(l, r) / a, u = de(l, i) / a;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const il = 0.5, of = 3, rf = 1e-4;
function lf(t, e, n) {
  const i = re(t, e);
  if (!i) return null;
  const s = nf(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => nl(k, n) || Do(k, n, il).length > 0;
  if (!r(s)) return s;
  const l = le(t, t.walls.find((k) => k.id === o.wallId)), a = i.normal, c = (k) => Math.abs(G(O(k, i.pt), a)) <= rf, u = ([k, S]) => L(z(k, S), 0.5), f = n.filter((k) => c(k[0]) && c(k[1]) && H(k[0], k[1]) > 1e-9 && !nl(z(u(k), L(a, il)), n)), p = (k) => G(O(k, l.a), l.dir), h = ([k, S]) => Math.max(0, Math.min(p(k), p(S)) - o.offset, o.offset - Math.max(p(k), p(S))), m = Math.min(...f.map(h)), $ = f.filter((k) => h(k) <= m + 1e-6).map((k) => z(u(k), a)), v = (k) => $.some((S) => !sf(k, S, n)), b = of * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, S] of n) {
    const E = O(S, k), I = O(k, s), N = de(l.dir, E);
    if (Math.abs(N) < 1e-12) continue;
    const B = de(I, l.dir) / N;
    if (B < -1e-9 || B > 1 + 1e-9) continue;
    const D = de(I, E) / N, A = H(k, S) / Math.abs(N);
    y.push(D - A, D + A);
  }
  const x = o.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= b).sort((k, S) => Math.abs(k) - Math.abs(S) || Math.sign(S) * x - Math.sign(k) * x);
  for (const k of M) {
    const S = z(s, L(l.dir, k));
    if (!r(S) && v(S)) return S;
  }
  return null;
}
const af = 1 / Math.cos(fc / 2 * (Math.PI / 180)), sl = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function cf(t, e, n = hc) {
  const i = tf(t, e), s = Zi(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = lf(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((f) => H(f, r))) * af, a = Do(r, o, l);
  if (a.length === 0) return [i];
  const c = Yp(r, a, l);
  let u;
  try {
    u = Fa.intersection(Ks(sl(i)), Ks(sl(c)));
  } catch {
    return [c];
  }
  return u.flatMap((f) => f.map(Za));
}
function df(t, e, n, i) {
  const s = re(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, G(O(n, s.pt), s.dir)));
    return H(z(s.pt, L(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return H(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return H(s.pt, n) <= i;
  if (o.shape === "circle") return H(s.pt, n) <= o.diameter / 2 + i;
  const r = O(n, s.pt);
  return Math.abs(G(r, s.dir)) <= o.width / 2 + i && Math.abs(G(r, se(s.dir))) <= o.depth / 2 + i;
}
function vc(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && df(t, i[o], e, n)) return i[o].id;
  return null;
}
const uf = 60;
function Ys(t, e, n) {
  if (!Ha.has(e.props.kind)) return null;
  const i = re(t, e);
  return i ? { from: i.pt, to: z(i.pt, L(i.dir, uf / n)) } : null;
}
function wc(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function pf(t, e, n, i) {
  const s = e.placement, o = re(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = He(O(n, o.pt)), l = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: Lo(l(r)) };
  const a = mc(r - He(o.normal)), c = Math.max(-Et, Math.min(Et, l(a)));
  return wc(s, c);
}
const ff = 1, bi = 1, ol = 1e-6, hf = 1e-9, mf = 1e-6, gf = 1;
function Po(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = vt(t, e.wallId);
      return n === null ? null : yn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function ue(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => Po(t, i) ?? { x: i.x, y: i.y });
}
function No(t, e) {
  const n = ue(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Ee(n)) / 1e5) / 10;
}
function en(t, e, n) {
  const i = de(O(e, t), O(n, t));
  return Math.abs(i) <= hf * H(t, e) * H(t, n) ? 0 : Math.sign(i);
}
const Vn = (t, e, n) => G(O(e, t), O(n, t)) <= 0;
function $c(t, e, n, i) {
  const s = en(n, i, t), o = en(n, i, e), r = en(t, e, n), l = en(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && Vn(n, t, e) || l === 0 && Vn(i, t, e) || s === 0 && Vn(t, n, i) || o === 0 && Vn(e, n, i);
}
function bf(t) {
  const e = [];
  for (const n of t) (e.length === 0 || H(e[e.length - 1], n) > ol) && e.push(n);
  for (; e.length > 1 && H(e[0], e[e.length - 1]) <= ol; ) e.pop();
  return e;
}
function vi(t) {
  const e = bf(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (en(s, o, r) === 0 && G(O(o, s), O(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && $c(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function yc(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Po(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = vt(t, o.wallId);
    return r !== null && (o.offset < -bi || o.offset > r + bi);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = ue(t, e);
  return Math.abs(Ee(s)) < gf || vi(s) ? "crossing" : null;
}
function Bt(t, e) {
  return Dt(e, t) || t.some((n, i) => Ie(e, n, t[(i + 1) % t.length]) <= ff);
}
const xc = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function vf(t, e) {
  const n = re(t, e);
  return n ? t.zones.filter((i) => Bt(ue(t, i), n.pt)).map((i) => ({ zone: i, participates: xc(e, i.id) })) : [];
}
function it(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = ue(t, n), s = [];
  for (const o of t.devices) {
    const r = re(t, o);
    r && Bt(i, r.pt) && s.push({ device: o, participates: xc(o, e) });
  }
  return s;
}
function wf(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Ee(t);
  if (Math.abs(n) > mf) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, s += (l.y + a.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (Dt(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const bs = 32;
function rl(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, Ie(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function kc(t) {
  const e = t.zones.map((s) => ue(t, s)), n = e.map((s) => Math.abs(Ee(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter(($, v) => v !== o && $.length >= 3 && n[v] < n[o] && $.every((b) => Bt(r, b))), a = wf(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const c = r.map(($) => $.x), u = r.map(($) => $.y), f = Math.min(...c), p = Math.min(...u), h = Math.max(Math.max(...c) - f, Math.max(...u) - p) / bs;
    let m = null;
    for (let $ = f + h / 2; $ < f + h * bs; $ += h)
      for (let v = p + h / 2; v < p + h * bs; v += h) {
        const b = { x: $, y: v };
        if (!Dt(b, r) || l.some((x) => Dt(b, x))) continue;
        const y = Math.min(rl(b, [r]), rl(b, l));
        (!m || y > m.d) && (m = { p: b, d: y });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const To = 3, Ot = (t, e) => ({ ...t, zones: e }), xn = (t, e, n) => Ot(t, t.zones.map((i) => i === e ? n : i)), Ho = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), Mc = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function $f(t, e) {
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
function yf(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && Mc(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => $f(n, e.vertices[i]));
}
function _c(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && yf(t.shape, e.shape);
}
function xf(t, e) {
  if (e.kind === "free") return e;
  const n = Po(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : Ho(e);
}
function Sc(t, e) {
  const n = e.shape, i = n.vertices.map((s) => xf(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function kf(t, e, n) {
  const i = t.shape, s = Xs(e, i.seed);
  return !s || n.some((o) => pc(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && Mc(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function Ac(t, e) {
  const n = yc(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const zo = (t, e) => Ac(t, Sc(t, e));
function Mf(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? uc(t) : [], i = [], s = e.map((o) => Ac(
    t,
    o.shape.kind === "walls" ? kf(o, n, i) : Sc(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? Ot(t, s) : t;
}
function _f(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && _c(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : Ot(t, i) : s.some((o, r) => o !== n[r]) ? Ot(t, s) : t;
}
function Sf(t, e, n) {
  const i = uc(t), s = Xs(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = Xs(i, r.shape.seed);
    if (l && pc(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: te(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: Ot(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const Vo = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function Af(t, e, n) {
  if (e.length < To) return { level: t, zoneId: null };
  const i = zo(t, { id: te(), name: n, shape: { kind: "polygon", vertices: e.map(Vo) }, invalid: !1 });
  return vi(ue(t, i)) ? { level: t, zoneId: null } : { level: Ot(t, [...t.zones, i]), zoneId: i.id };
}
function Cf(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : xn(t, i, { ...i, name: n });
}
function Ro(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return xn(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return xn(t, i, o);
}
function Cc(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Ic(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? Cc(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function Bo(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function Fo(t, e, n) {
  const i = zo(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return _c(i, e) ? t : xn(t, e, i);
}
const Uo = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function If(t, e, n, i) {
  const s = Bo(t, e);
  return !s || !Uo(n, s.shape.vertices.length) ? t : Fo(t, s, s.shape.vertices.map((o, r) => r === n ? Vo(i) : o));
}
function Ef(t, e, n, i) {
  const s = Bo(t, e);
  if (!s || !Uo(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, Vo(i)), Fo(t, s, o);
}
function Df(t, e, n) {
  const i = Bo(t, e);
  return !i || i.shape.vertices.length <= To || !Uo(n, i.shape.vertices.length) ? t : Fo(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function Lf(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < To) return t;
  const i = n.shape.outline.map(Ho);
  return xn(t, n, zo(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Ec(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Cc(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const kn = 1;
function Pe(t) {
  return structuredClone(t);
}
function Gi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Of(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Ki(t, e, n) {
  const i = ee(t, e.a), s = ee(t, e.b), o = H(i, s), r = Of(typeof n == "number" ? n : Fi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Ra(i, s, r / o), offset: r };
}
function Pf(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Ki(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Dc(t, e) {
  Pf(t), e && zf(e, t);
  const n = Mf(dc(Dn(t)));
  return e ? _f(n, e) : n;
}
function Re(t, e) {
  return Dc(Pe(t), e);
}
function Lc(t, e, n) {
  const i = Ui(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Ki(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function ll(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: ee(t, e.nodeId), nodeId: e.nodeId };
  const n = Gi(t, e.wallId), { pt: i, offset: s } = Ki(t, n, e.offset), o = H(ee(t, n.a), ee(t, n.b));
  return s <= kn ? { pt: ee(t, n.a), nodeId: n.a } : o - s <= kn ? { pt: ee(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function al(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: te(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Nf(t, e, n, i) {
  const s = ll(t, e), o = ll(t, n);
  if (H(s.pt, o.pt) < kn) return { level: t, wallId: null, endNodeId: null };
  const r = Pe(t), l = al(r, s), a = al(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: te(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Re(r, t), wallId: c.id, endNodeId: a };
}
function Oc(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < kn || a - l < kn ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function Tf(t, e, n, i, s) {
  const o = Oc(e, n, i.thickness, s);
  if (!o) return t;
  const r = Pe(t), l = o.map((a) => {
    const c = { id: te(), x: a.x, y: a.y };
    return r.nodes.push(c), c.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: te(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Re(r, t);
}
function Hf(t, e, n) {
  const i = Pe(t);
  return Lc(i, e, n), Dc(i, t);
}
function zf(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const s = t.walls.find((f) => f.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = t.nodes.find((f) => f.id === s.a), r = t.nodes.find((f) => f.id === s.b), l = e.nodes.find((f) => f.id === i.a), a = e.nodes.find((f) => f.id === i.b);
    if (!o || !r || !l || !a || o.x === l.x && o.y === l.y) continue;
    const c = H(l, a);
    if (c === 0) continue;
    const u = Bi(O(r, o));
    for (const f of n)
      f.wallId === i.id && (f.offset = Fi(z(o, L(u, f.offset)), l, a) * c);
  }
}
function Vf(t, e, n) {
  const i = Pe(t), s = Gi(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: z(ee(i, l), n) }));
  for (const l of r) Lc(i, l.id, l.to);
  return Re(i, t);
}
function Xi(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Pc(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function Rf(t, e, n) {
  const i = Pe(t), s = Gi(i, e), o = s[n], r = ee(i, o), l = { id: te(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || Pc(i, o, l.id), Xi(i), { level: Re(i, t), nodeId: l.id };
}
function Bf(t, e, n) {
  if (e === n) return t;
  const i = Pe(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Pc(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), Xi(i), Re(i, t);
}
function Wo(t, e) {
  var i;
  const n = Pe(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return Xi(n), Re(n, t);
}
function Ff(t, e, n) {
  const i = Pe(t);
  return Object.assign(Gi(i, e), n), Re(i, t);
}
const ge = (t) => typeof t == "string" && t !== "" ? t : null, Nc = (t) => t.split(".")[0], Uf = ["friendly_name", "device_class", "unit_of_measurement"];
function Tc(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: Nc(t),
    name: ge(n.friendly_name) ?? t,
    deviceClass: ge(n.device_class),
    unit: ge(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Wf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Tc(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function jf(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && Uf.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function Hc(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function qf(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Tc(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: ge(r.name) ?? ge(r.original_name) ?? l.name,
      deviceId: ge(r.device_id),
      areaId: ge(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: ge(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: ge(r.name_by_user) ?? ge(r.name) ?? r.id, model: ge(r.model), areaId: ge(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Zf(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function zc(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Hc(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Gf = {
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
function d(t) {
  return Gf[t] ?? t;
}
const Kf = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Xf = 10;
function Ft(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Vt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function Vc() {
  return { blocks: [{ id: te(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Yf(t, e, n, i) {
  const s = { id: te(), x: e.x, y: e.y }, o = { ...s, name: `${d(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function cl(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Yi(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Qf(t, e, n, i) {
  return Yi(t, e, (s) => ({ ...s, x: n, y: i }));
}
const Qs = (t) => "block" in t ? t.block : t.bus, Rc = (t, e) => Qs(t.from) === e || Qs(t.to) === e;
function Mn(t, e, n, i) {
  const s = t.blocks.find((c) => c.id === e);
  if (!s) return t;
  const o = Yi(t, e, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !Rc(c, e)) };
  const r = o.blocks.find((c) => c.id === e), l = new Set(Ft(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return o.wires.some((c) => a(c.from) || a(c.to)) ? { ...o, wires: o.wires.filter((c) => !a(c.from) && !a(c.to)) } : o;
}
function Bc(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Rc(i, e)) };
}
const Fc = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function Qi(t, e, n) {
  const i = Fc(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(Ft(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = t.wires.filter((c) => !o(c.from) && !o(c.to));
  let l = !1;
  const a = t.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((m) => u.has(m))) return c;
    l = !0;
    const f = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => u.has(m))), { portPins: p, ...h } = c;
    return Object.keys(f).length ? { ...h, portPins: f } : h;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Jf(t, e) {
  const n = jo(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = Qi(s, o, n);
  return s;
}
function eh(t, e) {
  const n = Fc(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(Qs(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const jo = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Uc(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Gp(t, n);
  return { level: s, power: i ? eh(e, n) : Qi(e, n, jo(s)) };
}
function Wc(t, e, n, i) {
  const s = ac(t, n, i);
  return { level: s, power: s === t ? e : Qi(e, n, jo(s)) };
}
function jc(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function th(t, e, n, i) {
  return Yi(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function nh(t, e) {
  return Yi(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function dl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function ih(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, Xf), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((u, f) => r.set(u.id, o & 1 << f ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (u) => {
      let f = u;
      for (; l.has(f) && l.get(f) !== f; ) f = l.get(f);
      return f;
    }, c = (u, f) => {
      if ("bus" in u) return `n:${u.bus}`;
      const p = s.get(u.block);
      return p !== void 0 && u.port !== p && u.port !== (r.get(u.block) ?? "A") ? `x:${f.id}:${u.port}` : `n:${u.block}`;
    };
    for (const u of e) {
      const f = a(c(u.from, u)), p = a(c(u.to, u));
      if (f === p) return !0;
      l.set(f, p);
    }
  }
  return !1;
}
function ul(t, e, n, i) {
  const s = new Map(t.blocks.map((b) => [b.id, b])), o = (b) => {
    if ("bus" in b) {
      const M = s.get(b.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = s.get(b.block), x = y ? Ft(y, i).find((M) => M.name === b.port) : void 0;
    return y && x ? { bl: y, dir: x.dir } : null;
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
  const u = (b) => "block" in b && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === b.block && x.port === b.port));
  if (u(a) || u(c)) return { error: "port-taken" };
  const f = (b) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === b && "block" in M) {
          const k = s.get(M.block);
          if (k) return dl(k, M.port);
        }
    return null;
  }, p = (b) => "bus" in b ? f(b.bus) : dl(s.get(b.block), b.port), h = p(a), m = p(c);
  if (h !== null && m !== null && h !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && s.get(c.block).kind === "remainder" && t.wires.some((b) => {
    var y;
    return "bus" in b.from && b.from.bus === a.bus && "block" in b.to && ((y = s.get(b.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const $ = { id: te(), from: a, to: c }, v = [...t.wires, $];
  return ih(t.blocks, v) ? { error: "loop" } : { schema: { ...t, wires: v }, wire: $ };
}
const Ne = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Ct = (t) => typeof t == "number" && Number.isFinite(t), sh = ["top", "right", "bottom", "left"], oh = ["2in1out", "1in2out"];
function rh(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Ct(n.w) && Ct(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !oh.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(Ft(n, e).map((c) => c.name)), o = {};
  let r = Ne(i);
  for (const [c, u] of Ne(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !Ne(u) || !sh.includes(u.side) || !Ct(u.at)) {
      r = !1;
      continue;
    }
    const f = Math.min(1, Math.max(0, u.at));
    f !== u.at && (r = !1), o[c] = f === u.at ? u : { side: u.side, at: f };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(o).length ? { ...a, portPins: o } : a;
}
function lh(t, e) {
  if (!Ne(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (Ne(u) && typeof u.id == "string" && u.id && Kf.includes(u.kind) && Ct(u.x) && Ct(u.y)) {
      const f = rh(u, e);
      f !== u && (s = !0), f.kind === "transfer" && f.form !== u.form && r.add(f.id), o.push(f);
    } else s = !0;
  const l = new Map(o.map((u) => [u.id, u])), a = (u) => {
    var p;
    if (!Ne(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = l.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !Ct(u.at)) return null;
      const h = Math.min(1, Math.max(0, u.at));
      return h === u.at ? u : { bus: u.bus, at: h };
    }
    const f = typeof u.block == "string" ? l.get(u.block) : void 0;
    return f && !r.has(f.id) && Ft(f, e).some((h) => h.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const f = Ne(u) ? a(u.from) : null, p = Ne(u) ? a(u.to) : null;
    if (!Ne(u) || typeof u.id != "string" || !u.id || !f || !p) {
      s = !0;
      continue;
    }
    f === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: f, to: p }));
  }
  return s ? { ...t, blocks: o, wires: c } : t;
}
function qc(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function ah(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Ln = 11, wi = 18, $i = 30, ch = 12, dh = 120, me = 14, pl = 10, _n = (t) => Math.round(t / pl) * pl || 0, vs = 24, fl = 6, uh = 2 * Ln + 6, ph = me, fh = 1e6, hl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Ji = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), ws = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Zc = (t) => Math.min(1, Math.max(0, t));
function es(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function hh(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = Vt(i);
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
function De(t, e, n) {
  return n ? Go(n, t, e).r : qo(t, e);
}
function qo(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(dh, 7 * es(t, e).length + 32),
    h: $i + wi * hh(t, e) + ch
  };
}
function yi(t, e, n) {
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
function mh(t, e) {
  const n = Ji(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function gh(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = Ie(e, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Zc(r) };
}
const Sn = (t) => t.w >= t.h;
function Gc(t, e) {
  return Sn(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function bh(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Sn(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: yi(i, r, 0.5), side: r };
  }
  const s = Ji(i), o = Sn(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: yi(i, o, e), side: o };
}
function vh(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const Zo = (t, e) => t.blocks.find((n) => n.id === e), Js = (t, e) => {
  const n = Zo(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, $s = (t, e, n) => "block" in t && t.block === e && t.port === n;
function wh(t, e, n, i) {
  const s = t.wires.find((l) => $s(l.from, e, n) || $s(l.to, e, n));
  if (!s) return null;
  const o = $s(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = Js(t, o.bus);
    return l ? Gc(l, o.at) : null;
  }
  const r = Zo(t, o.block);
  return r ? Ji(qo(r, i)) : null;
}
function Go(t, e, n) {
  const i = qo(e, n), s = Ji(i), o = Ft(e, n).map((c) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const f = wh(t, e.id, c.name, n), p = (f && mh(i, f)) ?? vh(e, c), h = f ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? h.x : h.y };
  }), r = (c) => {
    const u = o.filter((f) => f.side === c).length;
    return u ? (u + 1) * uh : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (a[u] = { name: c.name, dir: c.dir, side: c.side, pt: yi(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((f, p) => ({ p: f, i: p })).filter(({ p: f }) => !f.pin && f.side === c).sort((f, p) => f.p.key - p.p.key || f.i - p.i);
    u.forEach(({ p: f, i: p }, h) => {
      a[p] = { name: f.name, dir: f.dir, side: c, pt: yi(l, c, (h + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function ts(t, e, n) {
  return Go(t, e, n).places;
}
function Kc(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = Zo(t, c.block);
    if (!u) return null;
    const { r: f, places: p } = Go(t, u, n), h = p.find((m) => m.name === c.port);
    return h ? { pt: h.pt, side: h.side, rect: f } : null;
  }, s = (c, u, f) => {
    if (!("bus" in c)) return null;
    const p = Js(t, c.bus);
    if (!p) return null;
    let h = f == null ? void 0 : f.pt;
    if (!h && "bus" in u) {
      const m = Js(t, u.bus);
      h = m && Gc(m, u.at);
    }
    return h ? { ...bh(p, c.at, h), rect: De(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const Rn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), eo = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function $h(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = Rn(i[i.length - 2], a), u = Rn(a, l);
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
  const o = Rn(i[0], i[1]), r = Rn(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || eo(i[0], i[1]) < me - 1e-9 || r.x !== -n.x || r.y !== -n.y || eo(i[s - 2], i[s - 1]) < me - 1e-9 ? null : i;
}
function yh(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function xh(t, e) {
  let n = (t.length - 2) * ph;
  for (let i = 1; i < t.length; i++) {
    n += eo(t[i - 1], t[i]);
    for (const s of e) yh(t[i - 1], t[i], s) && (n += fh);
  }
  return n;
}
function Xc(t, e) {
  const n = t.pt, i = e.pt, s = hl[t.side], o = hl[e.side], r = { x: n.x + s.x * me, y: n.y + s.y * me }, l = { x: i.x + o.x * me, y: i.y + o.y * me }, a = [t.rect, e.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - me, k[x] + k[M] + me]),
    Math.min(r[x], l[x]) - me,
    Math.max(r[x], l[x]) + me
  ])], u = c("x", "w"), f = c("y", "h"), p = s.x === 0, h = o.x === 0, m = (p ? f : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= me - 1e-9), $ = (h ? f : u).filter((x) => (x - (h ? i.y : i.x)) * (h ? o.y : o.x) >= me - 1e-9);
  let v = null, b = 1 / 0;
  const y = (x) => {
    const M = $h(x, s, o);
    if (!M) return;
    const k = xh(M, a);
    k < b - 1e-6 && (v = M, b = k);
  };
  if (p && h)
    for (const x of m) for (const M of u) for (const k of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!p && !h)
    for (const x of m) for (const M of f) for (const k of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const M of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return v ?? [n, r, p ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Yc(t, e, n) {
  const i = De(t, e, n), s = i.x + (i.w - (3 * vs + 2 * fl)) / 2, o = i.y + $i + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (vs + fl), y: o, w: vs, h: wi - 2 }
  }));
}
function kh(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return Sn(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function ml(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const f = Yc(u, i, t).find((p) => ws(e, p.rect, 0));
    if (f) return { kind: "chip", block: u.id, position: f.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const f of ts(t, u, i)) {
      const p = H(e, f.pt);
      p <= Ln + n && p < r && (o = { kind: "port", block: u.id, port: f.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let f = null, p = 1 / 0;
    for (const h of kh(u)) {
      const m = Ie(e, h.a, h.b);
      m <= n && m < p && (f = { kind: "bus-end", id: u.id, end: h.end }, p = m);
    }
    if (f) return f;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !ws(e, De(u, i, t), n)) continue;
    const f = Sn(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Zc(f) };
  }
  let l = null, a = 1 / 0;
  for (const u of t.wires) {
    const f = Kc(t, u, i);
    if (!f) continue;
    const p = Xc(f.a, f.b);
    for (let h = 1; h < p.length; h++) {
      const m = Ie(e, p[h - 1], p[h]);
      m <= n && m < a && (l = { kind: "wire", id: u.id }, a = m);
    }
  }
  if (l) return l;
  const c = s.find((u) => u.kind !== "bus" && ws(e, De(u, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function Mh(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = De(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Qc extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function ys(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function _h(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Sh(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Qc(s.message) : s;
  }
}
async function Ah(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Ch = 3;
function Se(t) {
  if (typeof t == "number")
    return t === Ch ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class Ih {
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
    const i = { ...e, id: te(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await Sh(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Qc ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = Se(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ue = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ns = (t) => (...e) => ({ _$litDirective$: t, values: e });
let is = class {
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
const Jc = (t) => t.strings === void 0, Eh = {}, Ko = (t, e = Eh) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dh = ns(class extends is {
  constructor() {
    super(...arguments), this.key = w;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (Ko(t), this.key = e), n;
  }
});
var ed = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Lh = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Oh = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Ph = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Nh = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Th = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Hh = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", gl = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Zt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", zh = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Vh = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Rh = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Bh = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", td = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Fh = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Uh = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Wh = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", nd = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", jh = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", qh = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Zh = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Gh = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Kh = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", id = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Xh = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Yh = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", sd = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Qh = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Jh = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", em = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", tm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", nm = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", im = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", sm = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", om = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", rm = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", lm = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", od = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", am = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", cm = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", dm = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function rd(t, e, n) {
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
function um(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function pm(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function fm(t, e, n, i, s) {
  const o = pm(e, n, i, s);
  if (!o.every((l) => Bt(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, Ie(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function hm(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? um(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const p of t.zones) {
    const h = ue(t, p);
    if (h.length < 3 || !Bt(h, n.pt)) continue;
    const m = Math.abs(Ee(h));
    m < a && (a = m, l = h);
  }
  if (!l) return r;
  const c = (p) => {
    const h = rd(p, i, s);
    return fm(l, n.pt.x + h.x, n.pt.y + h.y, i.w, i.h);
  }, u = (p) => {
    let h = null, m = -1;
    for (const $ of p) {
      const v = c($);
      v !== null && v > m && (h = $, m = v);
    }
    return h;
  }, f = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const p = r === "up" || r === "down", h = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = f.filter(($) => p ? $.startsWith(r) : $.endsWith(r));
    return u(m) ?? u(p ? ["right", "left"] : ["down", "up"]) ?? (c(h) !== null ? h : r);
  }
  return u(["right", "left"]) ?? u(f) ?? u(["down", "up"]) ?? r;
}
const he = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Ae(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function ld(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${d("unit.m2")}`;
}
const On = 12, Y = "non-scaling-stroke", mm = 7, gm = 10, xi = "#f43f5e", bl = "3 2", vl = 18, bm = 6, wl = 11, vm = 0.6, wm = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", ad = 24, Bn = 4, $l = 4, ni = On * 0.85, $m = 0.58;
function ym(t, e, n, i) {
  const s = ad;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], u = a * i - 2 * $l, f = c * i - 2 * $l, p = e.length * $m * ni, h = s + Bn + ni, m = s + Bn + p, $ = Math.max(s, p), v = (M, k) => Math.max(0, M - u) + Math.max(0, k - f), b = v($, h), y = v(m, s);
  if (b > 0 && y < b) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Bn) / i,
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
    labelY: (x + s + Bn + ni / 2) / i,
    labelAnchor: "middle"
  };
}
function xm(t, e, n, i = 0, s = 0) {
  const o = ad / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${wm} fill=${n}></path></g>`;
}
const km = "__preview__", Mm = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, _m = /* @__PURE__ */ new WeakMap();
function Sm(t, e) {
  var s;
  const n = Ae(_m, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Ae(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = Ae(i, t.openings, () => ({})))[e] ?? (s[e] = hc(t, e));
}
const Am = /* @__PURE__ */ new WeakMap();
function cd(t, e) {
  const n = Zi(e.props.kind);
  if (!n) return [];
  const i = Sm(t, n), s = Ae(Am, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = cf(t, e, () => i), s.set(e, o)), o;
}
function ki(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function Cm(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = s ?? w;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${Y}></circle>` : _`<circle class="icon" r=${ki(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></path>`;
    case "motion_sensor": {
      const u = (f) => `M${e * f} ${-e * f * 0.8}A${e * f} ${e * f * 0.8} 0 0 1 ${e * f} ${e * f * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let f = 0; f < 8; f++) {
        const p = f * Math.PI / 4;
        u += `M${Math.cos(p) * e * 1.15} ${Math.sin(p) * e * 1.15}L${Math.cos(p) * e * 1.6} ${Math.sin(p) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${Y}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${Y}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${Y}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${Y}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${Y}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let f = 0; f < 4; f++) {
        const p = f * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * e * 0.85} ${Math.sin(p) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${Y}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${Y}></path>`;
    }
    default:
      return _`${w}`;
  }
}
function Im(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${w}`;
  const l = ym(r, r.label, i, e.scale), a = o ?? w, c = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${Y}></circle>
      ${s ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : w}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${Y}></rect>
      ${s ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : w}`;
  return _`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${xm(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${ni / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function Em(t, e, n = 0) {
  return t === "bound" ? w : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(On * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${Mm[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : w} vector-effect=${Y}></circle>`;
}
function Dm(t, e, n) {
  if (t.status !== "error") return w;
  const i = e * 0.9, s = -e * 0.9, o = gm / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${mm / n.scale} fill=${n.palette.background} stroke=${xi} stroke-width="1.5"
      vector-effect=${Y}></circle>
    <path d=${ed} fill=${xi} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function Lm(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? xi : t === "event" ? e.selection : e.device;
}
function Om(t, e, n, i, s, o) {
  const r = [...i.shown.map((v) => [v, "bubble-in"]), ...i.leaving.map((v) => [v, "bubble-out"])];
  if (r.length === 0) return w;
  const l = 1 / o.scale, a = r.map(([v]) => (v.text.length * wl * vm + 2 * bm) * l), c = vl * l, u = (vl + 2) * l, f = { w: Math.max(...a), h: c + u * (r.length - 1) }, p = s + 4 * l, h = Math.max(1, i.shown.length), m = hm(t, e, n, { w: Math.max(...a.slice(0, h)), h: c + u * (h - 1) }, p), $ = rd(m, f, p);
  return _`${r.map(([v, b], y) => {
    const x = a[y], M = $.x + (f.w - x) / 2, k = $.y + (m.startsWith("up") ? r.length - 1 - y : y) * u, S = Lm(v.tone, o.palette);
    return Dh(`${b}:${v.key ?? ""}`, _`<g class=${`bubble ${b}`} data-tone=${v.tone}>
      <rect x=${M} y=${k} width=${x} height=${c} rx=${c / 2} fill=${o.palette.background} stroke=${S} stroke-width="1.5"
        vector-effect=${Y}></rect>
      <text x=${M + x / 2} y=${k + c / 2} text-anchor="middle" dominant-baseline="central" fill=${S} font-weight="700"
        font-size=${wl * l} font-family="system-ui, sans-serif">${v.text}</text>
    </g>`);
  })}`;
}
function Pm(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : ki(t, On / e.scale);
}
function Nm(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? Om(t, e, n, s, Pm(e, i), i) : w;
  return o === w ? w : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : w}>${o}</g>`;
}
function Tm(t, e, n, i) {
  var x, M, k;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = On / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, c = !i && Ri(t.props.kind), u = c ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, f = i || (k = n.live) == null ? void 0 : k.call(n, t), p = (f == null ? void 0 : f.look) === "on" || (f == null ? void 0 : f.look) === "active", h = c && !!n.containerState && !u || (f == null ? void 0 : f.look) === "no-data", m = t.props.kind, $ = !p || t.invalid ? o : m === "leak_sensor" ? xi : m === "motion_sensor" ? s.motionCone : o, v = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (h ? " no-data" : ""), b = i ? "0.5" : n.dim ? String(s.dimOpacity) : w, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, ki(t, r));
  return _`
    <g class=${v} data-id=${t.id} opacity=${b} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${Y}></circle>` : w}
      ${t.props.kind === "equipment" ? Im(t, n, o, l, p, h ? bl : void 0) : _`<g transform=${`rotate(${l})`}>${Cm(
    t,
    r,
    $,
    p ? $ : s.deviceFill,
    h ? bl : void 0,
    p ? s.deviceFill : $,
    (f == null ? void 0 : f.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? Em(n.bindingStatus(t), n.scale, ki(t, r)) : w}
      ${u ? Dm(u, r, n) : w}
    </g>`;
}
function yl(t, e, n, i) {
  const s = cd(t, e);
  if (s.length === 0) return w;
  const o = n.palette, r = e.invalid ? o.invalid : Zi(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : w, a = s.map(he).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${Y}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${Y}></path>`;
}
function Hm(t, e, n, i) {
  const s = cd(t, e);
  let o = 0;
  for (const c of s) for (const u of c) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = On * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : w;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? _`<path class="light-fill" d=${s.map(he).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function zm(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return w;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? Ys(t, i, e.scale) : null;
  if (!s) return w;
  const o = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : w}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${Y}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${Y} style="cursor:grab"></circle>
  </g>`;
}
function Vm(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = re(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: km, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = re(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return w;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? Hm(t, i.d, i.pose, e) : w : o === "motion_sensor" && s === "active" ? yl(t, i.d, e, !1) : w;
    }
    return yl(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Tm(i.d, i.pose, e, i.preview))}</g>
    ${zm(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? w : Nm(t, i.d, i.pose, e))}</g>` : w}`;
}
const xl = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Xo = (t) => xl[t % xl.length], ht = "non-scaling-stroke", Rm = "0.55", Bm = /* @__PURE__ */ new WeakMap();
function Fm(t, e, n, i) {
  const s = i.palette, o = Xo(n), r = i.selectedId === e.id, l = Ae(Bm, t, kc).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${he(ue(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? w : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${ht}
        opacity=${i.selectedId !== null && !r ? Rm : w}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${ld(No(t, e))}</tspan>
      </text>` : w}
    </g>`;
}
function Um(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => _`
      <path class="zone" data-id=${o.id} d=${he(ue(t, o))} fill="none" stroke=${Xo(r)} stroke-width="1"
        vector-effect=${ht}></path>`)}</g>`;
  const s = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Fm(t, o, r, e))}</g>`;
}
function Wm(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return _`<g class="zone-members">${it(t, e).map(({ device: o, participates: r }) => {
    const l = re(t, o);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${ht}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${ht}></circle>` : w;
  })}</g>`;
}
function jm(t, e, n) {
  if (e.shape.kind !== "polygon") return w;
  const i = n.palette, s = e.shape.vertices;
  return _`${ue(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${ht}></circle>`;
  })}`;
}
function qm(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${ht}></polyline>`;
}
function Zm(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${he(ue(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${ht}></path>` : w}
    ${n ? Wm(t, n.id, e) : w}
    ${n ? jm(t, n, e) : w}
    ${e.draft ? qm(e.draft, e) : w}</g>`;
}
function pt(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Gm = /* @__PURE__ */ new WeakMap(), Km = /* @__PURE__ */ new WeakMap(), dd = /* @__PURE__ */ new WeakMap();
function ss(t, e, n) {
  const i = se(t.dir), s = z(t.a, L(t.dir, e)), o = z(t.a, L(t.dir, n));
  return [z(s, L(i, t.leftOff)), z(o, L(i, t.leftOff)), O(o, L(i, t.rightOff)), O(s, L(i, t.rightOff))];
}
function An(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = le(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const Q = "non-scaling-stroke";
function Xm(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = An(t, l.id);
    if (!a) continue;
    const c = se(a.dir);
    for (const [u, f, p] of [[l.a, a.a, a.dir], [l.b, a.b, L(a.dir, -1)]]) {
      const h = t.nodes.find((k) => k.id === u);
      if (!h || h.host || n.get(u) !== 1) continue;
      const m = z(f, L(c, a.leftOff + i)), $ = O(f, L(c, a.rightOff + i)), v = L(c, 1), b = L(z(m, $), 0.5), y = z(O(b, L(v, -o)), L(p, s / 2)), x = O(O(b, L(v, o)), L(p, s / 2)), M = [m, y, x, $];
      r.push(_`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${Q}></path>`);
    }
  }
  return r.length ? _`${r}` : w;
}
function Ym(t, e, n) {
  const i = se(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : L(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = z(z(t.a, L(t.dir, l)), L(o, r)), u = z(z(t.a, L(t.dir, a)), L(o, r)), f = z(c, L(o, e.width)), p = de(O(f, c), O(u, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${f.x} y2=${f.y} stroke=${n} stroke-width="1.5" vector-effect=${Q}></line>
    <path d=${`M${f.x} ${f.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${Q}></path>`;
}
function Qm(t, e, n) {
  const i = se(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = z(z(t.a, L(t.dir, e.offset)), L(i, r)), a = z(z(t.a, L(t.dir, e.offset + e.width)), L(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${Q}></line>`;
  });
  return _`${o}`;
}
function Jm(t, e, n) {
  const i = An(t, e.wallId);
  if (!i) return w;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = ss(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${he(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Ym(i, e, o) : e.kind === "window" ? Qm(i, e, o) : w}
    </g>`;
}
function kl(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = z(t, L(n, i)), a = z(e, L(n, i)), c = (f, p) => {
    const h = z(p, L(n, i + r));
    return _`<line x1=${f.x} y1=${f.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${Q}></line>`;
  }, u = z(L(z(l, a), 0.5), L(n, 9 / s.scale));
  return _`
    <g class="dim">
      ${c(z(t, L(n, 2 / s.scale)), t)}${c(z(e, L(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${Q}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${pt(H(t, e))}</text>
    </g>`;
}
function eg(t, e) {
  const n = e.selection;
  if (!n) return w;
  const i = e.palette, s = 4 / e.scale, o = (r) => _`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : w;
  }
  if (n.kind === "wall") {
    const r = Ae(dd, t, Wi).get(n.id), l = An(t, n.id);
    if (!r || !l) return w;
    const a = se(l.dir);
    return _`
      <path d=${he(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${Q}></path>
      ${o(l.a)}${o(l.b)}
      ${kl(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), l = r ? An(t, r.wallId) : null;
    if (!r || !l) return w;
    const a = L(se(l.dir), -1), c = l.rightOff + 18 / e.scale, u = (p) => z(l.a, L(l.dir, p)), f = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${he(ss(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${Q}></path>
      ${f.filter(([p, h]) => h - p >= 1).map(([p, h]) => kl(u(p), u(h), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${he(ue(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${Q}></path>` : w;
  }
  return w;
}
function tg(t, e, n) {
  return H(t, e) < 1e-6 ? null : ss(Wa(t, e, n.thickness, n.baseline), 0, H(t, e));
}
function ng(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? An(t, r.wallId) : null;
  return _`
    ${o ? _`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${Q}></path>` : w}
    ${(n.walls ?? []).map((a) => {
    const c = tg(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${he(c)} fill=${i.selection} fill-opacity="0.35"></path>` : w}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${Q}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${he(ss(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : w}
    ${sg(t, e)}`;
}
function ig(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${Q}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${Q}></rect></g>`;
}
function sg(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? ig(n.anchor, e) : w, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / e.scale, { x: l, y: a } = o.pt, c = { stroke: i.background, width: "3" };
  let u, f = w;
  if (o.kind === "node" || o.kind === "corner") {
    const h = r(5);
    u = _`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - h} y=${a - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${Q}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${l} ${a - h}L${l + h * 0.866} ${a + h / 2}L${l - h * 0.866} ${a + h / 2}Z`;
    u = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${Q}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const h = r(7), m = `M${l} ${a - h}L${l + h} ${a}L${l} ${a + h}L${l - h} ${a}Z`;
    u = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${Q}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${Q}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const h = r(5), m = `M${l - h} ${a - h}L${l + h} ${a + h}M${l - h} ${a + h}L${l + h} ${a - h}`;
    u = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${Q}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${Q}></path></g>`;
    const $ = o.endpoint.kind === "wall" ? Ae(dd, t, Wi).get(o.endpoint.wallId) : void 0;
    $ && (f = _`<path class="snap-wall-hl" d=${he($)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${Q}></path>`);
  } else {
    const h = r(4), m = `M${l - h} ${a}H${l + h}M${l} ${a - h}V${a + h}`;
    u = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${Q}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${Q}></path></g>`;
  }
  const p = d(`snapmark.${o.kind}`);
  return _`
    ${f}${s}${u}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${Q} font-family="system-ui, sans-serif">${p}</text>`;
}
function og(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = Ae(Gm, n, (h) => Ga(h, !0)), o = n.walls.filter((h) => h.type === "railing" || h.type === "fence"), r = o.length ? Ae(Km, n, Eo) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? w : String(i.dimOpacity), u = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, f = e.mode ?? "plan";
  return _`
    ${Um(n, { palette: i, scale: e.scale, selectedId: u, mode: f === "automation" ? "plan" : f })}
    <path class="walls" d=${s.map((h) => h.map(he).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? _`<g class="railings" opacity=${c}>${o.flatMap((h) => (r.get(h.id) ?? []).map((m) => _`<path d=${he(m)} fill=${i.railing}></path>`))}</g>` : w}
    <g class="openings" opacity=${c}>${n.openings.map((h) => Jm(n, h, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Xm(n, e)}</g>
    ${a ? Zm(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : w}
    <g class="devices-layer">${a ? w : Vm(n, {
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
    <g class="selection">${eg(n, e)}</g>
    <g class="preview">${ng(n, e)}</g>`;
}
const xe = "non-scaling-stroke", Cn = "system-ui, sans-serif", rg = 13, on = 9, lg = 11, Ml = 18, xs = 12, ks = 11, Fn = 13, ag = 3, ii = 10, _l = 4.5, cg = 12, dg = 11.5, Yo = 10, Ms = 10.5, ug = 6, pg = {
  IN: Gh,
  OUT: id,
  BAT: Kh,
  PV: sd
}, Sl = { dead: 0, nodata: 1, idle: 2, live: 3 };
function _t(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const _s = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function fg(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function Pn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const hg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, mg = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, ud = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${xe}>${i ? w : mg}</path>`, pd = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Pt = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function gg(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Ln : on, s = t.pts[0], o = t.pts[t.pts.length - 1], r = ii / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((u, f) => ({ p: t.pts[f], q: u, len: Math.abs(u.x - t.pts[f].x) + Math.abs(u.y - t.pts[f].y) })).sort((u, f) => f.len - u.len);
  for (const { p: u, q: f, len: p } of a) {
    if (p < 2 * r + 2 * l) continue;
    const h = { x: (u.x + f.x) / 2, y: (u.y + f.y) / 2 }, m = (v, b) => Math.hypot(h.x - v.x, h.y - v.y) >= b + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const $ = Math.atan2(f.y - u.y, f.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: h, deg: (($ + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function bg(t, e, n) {
  var c;
  const i = e.palette, s = Pn(t.style, i), o = pd(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = gg(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${xe}></path>` : w}
    ${t.style === "live" ? ud("glow", o, s, n) : w}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : w} stroke-linejoin="round" vector-effect=${xe}></path>
    ${a ? _`<path class="arrow" d=${`M${ii / 2} 0L${-ii / 2} ${-_l}L${-ii / 2} ${_l}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : w}
  </g>`;
}
function vg(t, e, n) {
  const i = pg[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Ln} fill=${n.portFill}
      stroke=${e ? Pn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${xe}></circle>
    ${i ? Pt(i, t.pt, rg, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Cn}>${t.name}</text>`}
  </g>`;
}
function wg(t, e) {
  const n = Math.max(4, Math.floor(e / (Yo * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function $g(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? es(a, n) || d(`power.kind.${a.kind}`) : l;
  }), o = d("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", wg(s[0], i - 12 - o.replace("{name}", "").length * Yo * 0.55)) : d("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function yg(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: _t(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: _s(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: d("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, f = Vt(c), p = [];
      return f ? (u.power_in && p.push({ kind: "text", label: d("power.in"), value: _t(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: d("power.out"), value: _t(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: _s(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(l(rc(c))), f && p.push({ kind: "text", label: d("power.loss"), value: _t(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: d("power.soc"), value: _s(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: d("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), $g(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function xg(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : xs + 3, o = e.x - s / 2, r = `${d(`power.switch.${i}`)}${t.controllable ? "" : ` · ${d("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : w}>
    <title>${r}</title>
    ${Pt(
    i === "on" ? Bh : Rh,
    { x: o, y: e.y },
    Ml,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? w : Pt(jh, { x: o + Ml / 2 + 3 + xs / 2, y: e.y + 1 }, xs, n.blockValue)}
  </g>`;
}
function Al(t, e, n) {
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
function kg(t, e, n) {
  const i = 2 * (t.w + t.h), s = Al(t, e.side, e.pt), o = ((Al(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < l).sort((u, f) => u.d - f.d).map(({ c: u }) => u.pt);
  return [e.pt, ...c, n.pt];
}
function Mg(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return w;
  const l = ts(t, e, i.geo), a = l.find((h) => h.name === r), c = l.find((h) => h.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return w;
  const u = s(c.name) ?? "nodata", f = Pn(u, i.palette), p = pd(kg(De(e, i.geo, t), a, c));
  return _`${u === "live" ? ud("ts-glow", p, f, o) : w}
    <path class="ts-path" d=${p} fill="none" stroke=${f} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : w}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${xe}></path>`;
}
function _g(t, e, n, i) {
  const s = i.palette;
  return Yc(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${xe}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${Cn}>${o}</text>
    </g>`;
  });
}
function Sg(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? d("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? d("power.alert.missingDevice") : t === "disagree" ? d("power.alert.disagree") : t;
}
function Ag(t, e, n, i) {
  const s = ag + Fn / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - a.x) - Fn / 2, 0), f = Math.max(Math.abs(c.y - a.y) - Fn / 2, 0);
    return Math.hypot(u, f) > Ln;
  }), l = o.find(r) ?? o[0];
  return _`<g class="alert"><title>${t.map(Sg).join(`
`)}</title>
    ${Pt(ed, l, Fn, i.blockInvalid)}</g>`;
}
function Cg(t, e, n, i, s) {
  var $, v;
  const o = n.palette, r = De(e, n.geo, t), l = ($ = n.frame) == null ? void 0 : $.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, u = r.x + r.w / 2, f = es(e, n.geo) || d(`power.kind.${e.kind}`), p = yg(t, e, n.geo, l, o, r.w), h = e.kind === "remainder", m = ts(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${h ? o.powerRemainder : o.blockStroke} stroke-width=${h ? 1.5 : 1.25}
      stroke-dasharray=${h ? "6 4" : w} vector-effect=${xe}></rect>
    ${e.kind === "transfer" ? Mg(t, e, l, n, (b) => i(e.id, b), s) : w}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${d("power.planDevice")}</title>
      ${Pt(qh, { x: r.x + 4 + ks / 2, y: r.y + 4 + ks / 2 }, ks, o.blockValue)}</g>` : w}
    <text class="name" x=${u} y=${r.y + $i - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${cg} font-weight="600" fill=${o.blockName} font-family=${Cn}>${f}</text>
    ${p.map((b, y) => {
    const x = r.y + $i + y * wi + wi / 2;
    if (b.kind === "chips") return e.kind === "transfer" ? _g(t, e, l, n) : w;
    if (b.kind === "switch") return xg(b, { x: u, y: x }, o);
    const M = b.fill ?? o.blockValue, k = b.label ? _`<tspan>${b.label} </tspan>` : w, S = b.note ? _`<tspan> ${b.note}</tspan>` : w;
    return _`<text x=${u} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${b.small ? Yo : dg}
        fill=${M} font-family=${Cn}>${b.title ? _`<title>${b.title}</title>` : w}${k}<tspan
        font-weight=${b.small ? w : "600"}>${b.value}</tspan>${S}</text>`;
  })}
    ${(v = l == null ? void 0 : l.alert) != null && v.length ? Ag(l.alert, r, m, o) : w}
    ${m.map((b) => vg(b, i(e.id, b.name), o))}
  </g>`;
}
function Ig(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let c = w;
  const u = t.name ?? "", f = Math.min(Ms, a - 4), p = f >= ug, h = u.length * (p ? f : Ms) * 0.58 + 12;
  if (u) {
    const m = e.map((b) => o ? b.x : b.y).sort((b, y) => b - y);
    let $ = { lo: 0, hi: -1 }, v = r;
    for (const b of [...m, l + on]) {
      const y = Math.min(b - on, l);
      y - v > $.hi - $.lo && ($ = { lo: v, hi: y }), v = Math.max(v, b + on);
    }
    if ($.hi - $.lo >= h) {
      const b = ($.lo + $.hi) / 2, y = o ? { x: b, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: b };
      c = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? f : Ms} fill=${s.blockValue} font-family=${Cn}
        transform=${o ? w : `rotate(-90 ${y.x} ${y.y})`}>${u}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? Pn(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${xe}></rect>
    ${c}
  </g>`;
}
function Eg(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${on} fill=${n.portFill} stroke=${Pn(e, n)} stroke-width="1.5"
      vector-effect=${xe}></circle>
    ${Pt(Hh, t, lg, n.portIcon)}
  </g>`;
}
function Dg(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return w;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return w;
  const s = De(i, e.geo, t), o = 4 / e.scale;
  return _`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${xe}></rect>`;
}
function Lg(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const h of n.wires) {
    const m = Kc(n, h, e.geo);
    if (!m) continue;
    const $ = (p = e.frame) == null ? void 0 : p.wires[h.id];
    s.push({ w: h, a: m.a, b: m.b, pts: Xc(m.a, m.b), live: $, style: fg($) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const h of s)
    for (const [m, $] of [[h.w.from, h.a], [h.w.to, h.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, h.style);
        continue;
      }
      const v = r.get(m.bus);
      (v === void 0 || Sl[h.style] > Sl[v]) && r.set(m.bus, h.style), l.set(m.bus, [...l.get(m.bus) ?? [], $.pt]), a.push({ at: $.pt, style: h.style });
    }
  const c = (h, m) => o.get(`${h}:${m}`), u = hg(), f = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((h) => h.kind === "bus" ? Ig(h, l.get(h.id) ?? [], r.get(h.id), e) : w)}</g>
    <g class="wires">${s.map((h) => bg(h, e, u))}</g>
    ${Dg(n, e)}
    <g class="blocks">${n.blocks.map((h) => h.kind === "bus" ? w : Cg(n, h, e, c, u))}</g>
    <g class="terminals">${a.map((h) => Eg(h.at, h.style, i))}</g>
    ${f ? _`<line class="wire-draft" x1=${f.from.x} y1=${f.from.y} x2=${f.to.x} y2=${f.to.y}
      stroke=${f.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${xe}></line>` : w}
  </g>`;
}
const Og = {
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
}, Pg = {
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
function Ng(t) {
  return t ? Og : Pg;
}
class Tg extends is {
  constructor(e) {
    if (super(e), e.type !== Ue.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? we : (Ko(e), n);
  }
}
const X = ns(Tg), to = 1, Cl = 1e-6;
function Hg(t, e, n, i, s) {
  const o = (a) => a > Cl && a < s - Cl, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = Ui(t, a).host.offset;
    o(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some(($) => $ === e.a || $ === e.b || r.has($))) continue;
    const c = ee(t, a.a), u = ee(t, a.b), f = H(c, u), p = f === 0 ? null : _e(n, i, c, O(u, c));
    if (!p) continue;
    const h = Fi(p, c, u) * f;
    if (h < -to || h > f + to) continue;
    const m = G(O(p, n), i);
    o(m) && l.push({ t: m, wall: a, pt: p });
  }
  return l;
}
function Il(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function El(t, e) {
  if ("nodeId" in e)
    return delete Ui(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (H(ee(t, o), e.pt) <= to) return o;
  const { pt: n, offset: i } = Ki(t, e.wall, e.pt), s = { id: te(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function zg(t, e, n) {
  const i = t.walls.find((b) => b.id === e);
  if (!i) return t;
  const s = ee(t, i.a), o = ee(t, i.b), r = H(s, o), l = Bi(O(o, s)), a = G(O(n, s), l), c = Hg(t, i, s, l, r), u = Il(c.filter((b) => b.t < a), a), f = Il(c.filter((b) => b.t > a), a);
  if (!u && !f) return Wo(t, e);
  const p = Pe(t), h = p.walls.find((b) => b.id === e);
  let m = e, $ = 0;
  if (f) {
    const b = El(p, f);
    if ($ = G(O(ee(p, b), s), l), u) {
      const y = { ...h, id: te(), a: b };
      p.walls.push(y), m = y.id;
    } else
      h.a = b;
  }
  u && (h.b = El(p, u));
  const v = (b, y) => b.wallId !== e || u && y <= u.t ? !0 : !f || y < f.t ? !1 : (b.wallId = m, b.offset -= $, !0);
  p.openings = p.openings.filter((b) => v(b, b.offset + b.width / 2)), p.devices = p.devices.filter((b) => b.placement.mode !== "wall" || v(b.placement, b.placement.offset));
  for (const b of p.nodes) b.host && !v(b.host, b.host.offset) && delete b.host;
  for (const b of p.zones) {
    const y = b.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || v(x, x.offset) ? x : Ho(x)));
  }
  return Xi(p), Re(p, t);
}
function Qo(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Vg(t, e, n) {
  return z(t, L(Bi(O(e, t)), n));
}
function Un(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function mt(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? Qo(r, e) : e, c = r !== void 0 && a.y === r.y, u = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let f = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const S = { x: k.x, y: k.y }, E = H(S, a);
    E <= i && u(S) && (!f || E < f.d) && (f = { id: k.id, pt: S, d: E });
  }
  let p = null;
  for (const k of n.corners ?? []) {
    const S = H(k.pt, a);
    S <= i && u(k.pt) && (!p || S < p.d) && (p = { c: k, d: S });
  }
  if (p && (!f || p.d < f.d)) {
    const k = p.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: p.c };
  }
  if (f) return { pt: f.pt, kind: "node", endpoint: { kind: "node", nodeId: f.id } };
  const h = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: le(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: S } of h) {
    const E = { x: (S.a.x + S.b.x) / 2, y: (S.a.y + S.b.y) / 2 }, I = H(E, a);
    I <= i && u(E) && (!m || I < m.d) && (m = { wallId: k.id, pt: E, offset: S.len / 2, d: I });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const $ = (k) => {
    let S = null;
    for (const { w: E, f: I } of h) {
      const N = se(I.dir), B = k ? [I.leftOff, -I.rightOff].filter((D) => D !== 0) : [0];
      for (const D of B) {
        const A = z(I.a, L(N, D)), P = r ? _e(r, O(a, r), A, I.dir) : z(A, L(I.dir, G(O(a, A), I.dir)));
        if (!P) continue;
        const V = G(O(P, A), I.dir);
        if (V < 0 || V > I.len) continue;
        const K = H(P, a);
        K <= i && (!S || K < S.d) && (S = { d: K, res: { pt: P, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: V } } });
      }
    }
    return S ? S.res : null;
  }, v = $(!1);
  if (v) return v;
  const b = $(!0);
  if (b) return b;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const S of k) {
      const E = H(S, a);
      E <= i && u(S) && (!x || E < x.d) && (x = { pt: S, d: E });
    }
  if (x) return Un(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let S = 0; S < k.length; S++) {
      const E = k[S], I = k[(S + 1) % k.length], N = H(E, I);
      if (N < 1e-9) continue;
      const B = L(O(I, E), 1 / N), D = r ? _e(r, O(a, r), E, B) : z(E, L(B, G(O(a, E), B)));
      if (!D) continue;
      const A = G(O(D, E), B);
      if (A < 0 || A > N) continue;
      const P = H(D, a);
      P <= i && (!M || P < M.d) && (M = { pt: D, d: P });
    }
  if (M) return Un(M.pt, "zoneEdge");
  if (s && s > 0) {
    const k = (E) => Math.round(E / s) * s, S = r ? c ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return Un(S, "grid");
  }
  return Un(a, "none");
}
function Rg(t, e, n) {
  return e.some((i, s) => Ie(t, i, e[(s + 1) % e.length]) <= n);
}
function Jo(t, e, n) {
  const i = Wi(t);
  for (const [s, o] of i) if (Dt(e, o)) return s;
  for (const [s, o] of i) if (Rg(e, o, n)) return s;
  return null;
}
function Bg(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = le(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = nt(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Fg(t, e, n, i) {
  const s = Bg(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && H(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = Jo(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const os = 3, Ug = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => ue(t, n)).filter((n) => n.length >= 3);
function fd(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? Qo(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = mt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Ug(e, s), corners: ja(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = vt(e, l.wallId), c = a !== null && l.offset >= -bi && l.offset <= a + bi, u = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, f = c ? yn(e, l.wallId, l.side, u) : null;
    if (f) return { vertex: { kind: "wall", wallId: l.wallId, offset: u, side: l.side, x: f.x, y: f.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = nt(le(e, l), n.pt).side >= 0 ? "left" : "right", c = yn(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function hd(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = ue(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => Ie(e, l, o[(a + 1) % o.length]) <= n) || Bt(o, e)) && i.push({ id: s.id, area: Math.abs(Ee(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function md(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: ue(t, n), v: n.shape.vertices } : null;
}
function Wg(t, e, n, i) {
  var r;
  const s = (r = md(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    H(n, l) <= i && (o < 0 || H(n, l) < H(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function jg(t, e, n, i) {
  const s = md(t, e);
  if (!s || s.o.some((v) => H(n, v) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((v, b) => {
    const y = Ie(n, v, o[(b + 1) % o.length]);
    y <= i && y < a && (l = b, a = y);
  }), l < 0) return null;
  const c = o[l], u = o[(l + 1) % o.length], f = Math.max(0, Math.min(1, Fi(n, c, u))), p = Ra(c, u, f), h = r[l], m = r[(l + 1) % r.length], $ = h.kind === "wall" && m.kind === "wall" && h.wallId === m.wallId && h.side === m.side ? { kind: "wall", wallId: h.wallId, side: h.side, offset: h.offset + f * (m.offset - h.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: l + 1, vertex: $ };
}
function qg(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, u = null, f = [];
  const p = () => {
    const v = t.selection();
    return (v == null ? void 0 : v.kind) === "zone" ? v.id : null;
  }, h = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function $(v) {
    if (!i || !s || !a && H(v.pt, c) <= os / t.scale()) return;
    a = !0;
    const b = fd(t, s, v, i.from, i.zoneId);
    r = b.snap, l = v.shift, o = If(s, i.zoneId, i.index, b.vertex);
  }
  return {
    note() {
      f = [f[f.length - 1] ?? null, t.selection()];
    },
    press(v) {
      h(), u = null, c = v.pt;
      const b = p(), y = t.level(), x = b === null ? null : Wg(y, b, v.pt, t.tolMm());
      return b === null || !x ? !1 : (i = { zoneId: b, ...x }, s = o = y, !0);
    },
    pick(v) {
      const b = hd(t.level(), v, t.tolMm());
      if (b.length === 0) {
        n = null, e(null);
        return;
      }
      const y = p(), x = y !== null && n !== null && H(v, n) <= t.tolMm() ? b.indexOf(y) : -1;
      n = v, e({ kind: "zone", id: b[(x + 1) % b.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(v) {
      $(v);
    },
    up(v) {
      if (!i) return;
      $(v);
      const b = o, y = s, x = a, M = i;
      h(), x ? b && y && b !== y && t.commit(b) : u = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(v) {
      const b = f[0];
      if ((b == null ? void 0 : b.kind) !== "zone") return;
      const y = t.level(), x = jg(y, b.id, v.pt, t.tolMm());
      if (!x) return;
      const M = Ef(y, b.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(b), n = null);
    },
    key(v) {
      if (v === "Escape" && i)
        return h(), !0;
      const b = m();
      if (v === "Escape" && b)
        return u = null, !0;
      if ((v === "Delete" || v === "Backspace") && b) {
        const y = t.level(), x = Df(y, b.zoneId, b.index);
        return x === y ? (t.notify(d("zones.minVertices")), !0) : (u = null, t.commit(x), !0);
      }
      return !1;
    },
    preview() {
      if (i && o) {
        const b = { level: o };
        return r && (b.snap = r), l && (b.orthoFrom = i.from), b;
      }
      const v = m();
      return v ? { zoneVertex: v } : {};
    },
    cancel() {
      h(), u = null, n = null;
    }
  };
}
function Zg(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (h) => {
    t.select(h);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, c = qg(t, l), u = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, f = (h, m, $) => nt(le(h, h.walls.find((v) => v.id === m)), $).t;
  function p(h) {
    const m = e;
    if (!(!m || !n) && !(h.pt.x === o.x && h.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const $ = mt(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), v = $.endpoint, b = ($.kind === "wall" || $.kind === "mid") && v.kind === "wall", y = $.kind === "node" && v.kind === "node" && v.nodeId !== m.nodeId, x = n.nodes.find((E) => E.id === m.nodeId), M = !!x.host && b && v.kind === "wall" && v.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const E = structuredClone(n);
          delete E.nodes.find((I) => I.id === m.nodeId).host, k = E;
        }
        let S = Hf(k, m.nodeId, u($));
        if (y && v.kind === "node")
          S = Bf(S, m.nodeId, v.nodeId);
        else if (b && v.kind === "wall" && !M) {
          const E = n.walls.find((I) => I.id === v.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const I = structuredClone(S);
            I.nodes.find((N) => N.id === m.nodeId).host = { wallId: v.wallId, offset: v.offset }, S = Re(I, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const $ = n.walls.find((y) => y.id === m.wallId), v = mt(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [$.a, $.b]
        }), b = O(v.pt, m.origin);
        i = Vf(
          n,
          m.wallId,
          v.kind === "none" ? { x: Math.round(b.x), y: Math.round(b.y) } : b
        );
      } else {
        const $ = n.openings.find((v) => v.id === m.openingId);
        i = tc(n, $.id, f(n, $.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      a(), o = h.pt, c.note();
      const m = t.level(), $ = h.ctrl ? Jo(m, h.pt, t.tolMm()) : null;
      if ($) {
        l(null), t.commit(zg(m, $, h.pt));
        return;
      }
      if (c.press(h)) return;
      const v = t.selection(), b = Fg(m, h.pt, t.tolMm(), v);
      if (!b) {
        c.pick(h.pt);
        return;
      }
      if (c.forget(), l(b), r = n = i = m, b.kind === "node") {
        let y = b.id;
        const x = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((M) => M.id === v.id) : void 0;
        if (h.alt && x) {
          const M = Rf(m, x.id, x.a === b.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: ee(n, y) };
      } else if (b.kind === "wall")
        e = { kind: "wall", wallId: b.id, origin: h.pt };
      else if (b.kind === "opening") {
        const y = m.openings.find((x) => x.id === b.id);
        e = { kind: "opening", openingId: y.id, grab: f(m, y.wallId, h.pt) - y.offset };
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
      const m = s, $ = i, v = r;
      a(), m && $ && v && $ !== v && t.commit($);
    },
    dblclick(h) {
      c.dblclick(h);
    },
    key(h) {
      return h === "Escape" && e ? (a(), !0) : c.key(h);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), c.cancel();
    }
  };
}
function In(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function gd() {
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
function Gg(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = gd(), s = () => {
    e = null, i.clear();
  }, o = (c) => mt(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = In(i.first, { min: 1 }), u = In(i.second, { min: 1 });
      return c === null || u === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const l = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const u = Tf(t.level(), e, c, t.wallProps(), t.boxMeasure());
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
      const f = t.wallProps(), p = Oc(e, c, f.thickness, t.boxMeasure());
      return p && (u.walls = p.map((h, m) => ({ a: h, b: p[(m + 1) % 4], props: { ...f, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Dl = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Kg(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = gd(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (p, h) => mt(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: h && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), h = In(l.first, { min: 1 }), m = In(l.second);
    if (h === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const $ = h ?? H(n, p.pt);
    let v = p.pt;
    if (m === null && H(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      v = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      v = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const b = Vg(n, v, $), y = { x: Dl(b.x), y: Dl(b.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: y, endpoint: { kind: "free", pt: y }, snap: p };
  }
  function f() {
    const p = u();
    if (!e || !p) return;
    const h = Nf(t.level(), e, p.endpoint, t.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    t.commit(h.level);
    const m = h.level.walls.find((x) => x.id === h.wallId);
    i === null && (i = m.a);
    const $ = h.endNodeId === i, v = n, b = ee(h.level, h.endNodeId), y = H(v, b);
    if (y > 0 && (r = { x: (b.x - v.x) / y, y: (b.y - v.y) / y }), l.clear(), $) {
      a();
      return;
    }
    e = { kind: "node", nodeId: h.endNodeId }, n = ee(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !e) {
        const h = c(p.pt, !1);
        e = h.endpoint, n = h.pt;
        return;
      }
      f();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, h) {
      return o = h.shift, e ? l.key(p, f, a) : !1;
    },
    preview() {
      if (!n) return { snap: mt(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
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
function Xg(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = Jo(o, n, t.tolMm());
    if (!r) return null;
    const l = le(o, o.walls.find((c) => c.id === r)), a = nt(l, n).t;
    return { wallId: r, center: a, pt: z(l.a, L(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Bp(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: o.wallId, offset: l, width: r, kind: e, invalid: !ji(t.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Ll = 3, Yg = 1, ke = (t) => ({ x: t.x, y: t.y });
function Qg(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ke(e[e.length - 1]) : void 0;
  function l(f) {
    const p = e.length;
    if (p === 0) return !1;
    const h = e.map(ke);
    if (H(h[p - 1], f) <= Yg) return !0;
    if (p >= 2) {
      const m = O(h[p - 1], h[p - 2]), $ = O(f, h[p - 1]);
      if (Math.abs(de(m, $)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot($.x, $.y) && G(m, $) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if ($c(h[p - 1], f, h[m], h[m + 1])) return !0;
    return !1;
  }
  function a(f) {
    if (e.length < Ll) return null;
    const p = t.tolMm(), h = ke(e[0]), m = ke(e[e.length - 1]);
    return H(f, h) <= p ? h : H(f, m) <= p ? m : null;
  }
  function c() {
    var h;
    if (e.length < Ll || vi(e.map(ke))) return !1;
    const f = t.level(), p = Af(f, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : Ro(p.level, p.zoneId, !1)), (h = t.zonePlaced) == null || h.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (f) => fd(t, t.level(), f, r());
  return {
    id: "zone",
    down(f) {
      if (a(f.pt)) {
        c();
        return;
      }
      const p = u(f).vertex;
      l(ke(p)) || (e = [...e, p], n = ke(p), i = !1);
    },
    move(f) {
      o = f.shift;
      const p = a(f.pt);
      if (p) {
        n = p, s = null, i = vi(e.map(ke));
        return;
      }
      const h = u(f);
      s = h.snap, n = ke(h.vertex), i = l(n);
    },
    up() {
    },
    key(f) {
      return f === "Enter" ? c() : f === "Backspace" || f === "Delete" || f === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : f === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const f = {};
      e.length > 0 && (f.zoneDraft = { points: e.map(ke), cursor: n, invalid: i }), s && (f.snap = s);
      const p = r();
      return o && p && (f.orthoFrom = p), f;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Jg(t) {
  return t.zoneMethod() === "polygon" ? Qg(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = Sf(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(d("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : Ro(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Ol = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function bd(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((u) => u.id === o), a = l ? re(s, l) : null, c = l ? Ys(s, l, t.scale()) : null;
    return !a || !c ? 0 : mc(He(O(r, a.pt)) - He(O(c.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && H(s.pt, e.downPt) <= os / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((f) => f.id === e.id), r = o ? re(e.original, o) : null;
    if (!o || !r) return;
    const l = H(s.pt, r.pt), a = (He(O(s.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, u = pf(e.original, o, c, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : mi(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === s), a = l ? Ys(r, l, t.scale()) : null;
      return !l || !a || H(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Ol(o.work, o.id) !== Ol(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function Pl(t, e, n) {
  const i = le(t, t.walls.find((s) => s.id === e));
  return nt(i, n).side > 0 ? "left" : "right";
}
function vd(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function er(t, e = "free") {
  return t === "equipment" ? [e] : Ao[t];
}
function wd(t, e, n, i, s = 0, o = er(n)) {
  if (o.includes("wall")) {
    const r = mt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: Pl(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const u = le(e, c), f = nt(u, i).side, p = Math.abs(Math.abs(f) - (f > 0 ? u.leftOff : u.rightOff));
        (!a || p < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : u.len, d: p });
      }
      if (a) return { mode: "wall", wallId: a.id, side: Pl(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...vd(t, i), rotation: s } : null;
}
function e1(t, e, n) {
  const i = re(t, e);
  if (!i) return null;
  if (!n) {
    const o = Lo(Math.round(He(i.dir)));
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
    const l = nt(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), u = yn(t, o.id, a, c), f = u ? H(u, i.pt) : 1 / 0;
    (!s || f < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: c }, d: f });
  }
  return s && s.d < 1 / 0 ? Oo(t, e.props, s.placement, 0) : null;
}
function t1(t, e, n) {
  return cc(t.deviceDefaults(e), "free", n.mode);
}
function n1(t, e) {
  let n = null, i;
  const s = bd(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = er(e, t.wallMount() ? "wall" : "free"), a = wd(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...vd(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = t1(t, e, a), u = Oo(r, c, a, t.tolMm()), f = Kr(r, c, u, "").deviceId !== null;
    return { placement: u, props: c, invalid: !f };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), c = ko(d(`device.${e}`), a.devices.filter((f) => f.props.kind === e).map((f) => f.name)), u = Kr(a, l.props, l.placement, c);
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
const Nl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, i1 = (t, e, n) => n === void 0 || Nl(t, n) !== Nl(e, n);
function s1(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return O(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = yn(t, s.wallId, s.side, s.offset);
  return o ? O(o, i) : { x: 0, y: 0 };
}
function o1(t) {
  let e = null, n = null;
  const i = bd(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (p) => {
    e = p, t.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && H(p.pt, l) <= os / t.scale()) return;
    if (r = !0, p.pt.x === l.x && p.pt.y === l.y) {
      o = s;
      return;
    }
    const h = s.devices.find((k) => k.id === n.id);
    if (!h || h.placement.mode === "none") return;
    const m = p.shift ? Qo(l, p.pt) : p.pt, $ = h.placement, v = $.mode === "free" ? null : re(s, h), b = $.mode === "free" ? $.rotation : v ? Lo(Math.round(He(v.dir))) : 0, y = z(m, n.grab), x = wd(t, s, h.props.kind, y, b, er(h.props.kind, $.mode)), M = x && x.mode === "wall" && $.mode === "wall" && $.aim !== void 0 ? { ...x, aim: $.aim } : x;
    o = M ? mi(s, h.id, Oo(s, h.props, f(s, h.placement, M, m, y), t.tolMm())) : s;
  }
  function f(p, h, m, $, v) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const b = p.walls.find((E) => E.id === h.wallId);
    if (!b) return m;
    const y = le(p, b), x = Math.max(0, Math.min(y.len, h.offset + G(O($, l), y.dir))), M = nt(y, v).side, k = t.tolMm(), S = h.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: S };
  }
  return {
    id: "device-select",
    down(p) {
      c(), l = p.pt;
      const h = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const $ = vc(h, p.pt, m);
      if (!$) {
        a(null);
        return;
      }
      a({ kind: "device", id: $ });
      const v = h.devices.find((y) => y.id === $), b = re(h, v);
      s = o = h, n = { id: $, grab: s1(h, v, (b == null ? void 0 : b.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const h = o, m = s, $ = r, v = n == null ? void 0 : n.id;
      c(), $ && h && m && h !== m && i1(m, h, v) && t.commit(h);
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
function r1(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = vc(t.level(), e.pt, t.tolMm());
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
const no = 40, l1 = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function a1(t, e, n, i) {
  const s = t.blocks.find((h) => h.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = _n(o ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - no) : r, u = n === "end" ? Math.max(a, r + no) : r + l;
  if (c === r && u === r + l) return t;
  const f = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (h) => "bus" in h && h.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + h.at * l - c) / (u - c))) } : h;
  return {
    ...t,
    blocks: t.blocks.map((h) => h.id === e ? { ...h, ...f } : h),
    wires: t.wires.map((h) => {
      const m = p(h.from), $ = p(h.to);
      return m === h.from && $ === h.to ? h : { ...h, from: m, to: $ };
    })
  };
}
function c1(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(u, f) {
    const p = ml(u, f, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function a(u) {
    const f = e, p = n;
    if (!f || !p || !s && H(u.pt, o) <= os / t.scale()) return;
    if (s = !0, f.kind === "wire") {
      const v = l(p, u.pt);
      e = { ...f, to: u.pt, ok: !!v && !("error" in ul(p, f.from, v, t.geo())) };
      return;
    }
    if (f.kind === "bus-end") {
      i = a1(p, f.id, f.end, u.pt);
      return;
    }
    const h = p.blocks.find((v) => v.id === (f.kind === "pin" ? f.from.block : f.id));
    if (!h) return;
    if (f.kind === "pin") {
      i = th(p, h.id, f.from.port, gh(De(h, t.geo(), p), u.pt));
      return;
    }
    const m = _n(h.x + u.pt.x - o.x), $ = _n(h.y + u.pt.y - o.y);
    i = m === h.x && $ === h.y ? p : Qf(p, h.id, m, $);
  }
  function c(u, f, p) {
    const h = l(u, p);
    if (!h) return;
    const m = ul(u, f, h, t.geo());
    if ("error" in m) {
      t.notify(d(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const f = t.power(), p = ml(f, u.pt, t.tolMm(), t.geo());
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
      if (n = i = f, p.kind === "port") {
        const h = { block: p.block, port: p.port };
        if (l1(f, h)) {
          e = { kind: "pin", from: h };
          return;
        }
        const m = f.blocks.find((v) => v.id === p.block), $ = ts(f, m, t.geo()).find((v) => v.name === p.port).pt;
        e = { kind: "wire", from: h, at: $, to: $, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: p.id }), e = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      a(u);
    },
    up(u) {
      a(u);
      const f = e, p = n, h = i, m = s;
      if (r(), !(!f || !p)) {
        if (!m) {
          (f.kind === "wire" || f.kind === "pin") && t.select({ kind: "powerBlock", id: f.from.block });
          return;
        }
        f.kind === "wire" ? c(p, f.from, u.pt) : h && h !== p && t.commitPower(h);
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
function d1(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let s;
      if (n === "device") {
        const u = t.placeDeviceId();
        if (!u) {
          t.notify(d("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = t.power(), r = Yf(n, { x: 0, y: 0 }, o, s), l = De(r, t.geo(), cl(o, r)), a = { ...r, x: _n(i.pt.x - l.w / 2), y: _n(i.pt.y - l.h / 2) };
      t.commitPower(cl(o, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function u1(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = hd(t.level(), e.pt, t.tolMm())[0];
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
const p1 = ["select", "box", "wall", "door", "window", "opening", "zone"], f1 = [
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
], h1 = ["binding-select"], m1 = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], g1 = ["zone-pick"], $d = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, b1 = {
  plan: p1,
  equipment: f1,
  binding: h1,
  power: m1,
  automation: g1
};
function tr(t) {
  return b1[t];
}
function io(t, e) {
  switch (t) {
    case "select":
      return Zg(e);
    case "box":
      return Gg(e);
    case "wall":
      return Kg(e);
    case "door":
    case "window":
    case "opening":
      return Xg(e, t);
    case "zone":
      return Jg(e);
    case "device-select":
      return o1(e);
    case "binding-select":
      return r1(e);
    case "power-select":
      return c1(e);
    case "zone-pick":
      return u1(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return d1(e, t);
    default:
      return n1(e, t);
  }
}
function Ss(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const v1 = {
  select: Zt,
  box: om,
  wall: rm,
  door: zh,
  window: dm,
  opening: Vh,
  zone: Jh,
  "device-select": Zt,
  ceiling_light: Ph,
  wall_light: lm,
  motion_sensor: Zh,
  illuminance_sensor: Oh,
  climate_sensor: em,
  wall_switch: nd,
  smart_button: Uh,
  valve: im,
  leak_sensor: od,
  socket: id,
  exhaust_fan: td,
  equipment: gl,
  "binding-select": Zt,
  "zone-pick": Zt,
  "power-select": Zt,
  "power-device": gl,
  "power-bus": Xh,
  "power-battery": Lh,
  "power-pv": sd,
  "power-transfer": Qh,
  "power-remainder": Nh
}, yd = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${v1[t]}></path>`}</svg>`;
function w1(t) {
  switch (t.saveState) {
    case "saving":
      return d("save.saving");
    case "conflict":
      return d("save.conflict");
    case "error":
      return d("save.error");
    default:
      return t.dirty ? d("save.dirty") : d(t.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function $1(t) {
  return g`
    <div class="top"><div class="bar">
      ${t.lead ?? w}
      ${t.plans.length > 1 ? g`
        <select class="plan-pick" aria-label=${d("plan.pick")} title=${d("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${X(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => g`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : w}
      <button class="btn" data-action="new-plan" title=${d("plan.new")} aria-label=${d("plan.new")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${d("plan.delete")} aria-label=${d("plan.delete")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${d("action.undo")} aria-label=${d("action.undo")} ?disabled=${!t.canUndo}
        @click=${t.onUndo}>↶</button>
      <button class="btn" title=${d("action.redo")} aria-label=${d("action.redo")} ?disabled=${!t.canRedo}
        @click=${t.onRedo}>↷</button>
      <span class="save-state ${t.saveState}" title=${t.saveState === "error" ? t.errorMessage ?? "" : ""}>
        ${w1(t)}${t.saveState === "error" && t.errorMessage ? g`: ${t.errorMessage}` : w}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${d("action.save")}</button>
    </div>${t.steps}</div>`;
}
const y1 = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function xd(t, e, n) {
  return tr(t).map((i) => {
    const s = t === "plan" ? $d[i] : void 0, o = d(`tool.${i}`);
    return g`
      ${y1.includes(i) ? g`<div class="tool-sep"></div>` : w}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? w}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? w}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${yd(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function x1(t, e, n) {
  return g`<div class="tools">${xd(t, e, n)}</div>`;
}
const Wn = ["plan", "equipment", "binding", "power", "automation"], Gt = (t, e, n) => d(t === 1 ? e : n).replace("{n}", String(t));
function k1(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((u) => u.invalid).length, c = a ? `, ${d("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Gt(o.length, "steps.wall", "steps.walls")}, ${Gt(r.length, "steps.zone", "steps.zones")}${c}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: Gt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - _o(l.map(n));
      return {
        text: d("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: Gt(i.blocks.length, "steps.block", "steps.blocks"), done: ah(i) };
    case "automation":
      return { text: Gt(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const Tl = (t, e) => d(t).replace("{step}", d(`mode.${e}`));
function M1(t) {
  const e = Wn.indexOf(t.mode), n = Wn[e - 1], i = Wn[e + 1];
  return g`
    <nav class="steps" aria-label=${d("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${X(t.planName)} aria-label=${d("plan.name")} title=${d("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${d("steps.app")}</span>
      </div>
      ${Wn.map((s, o) => {
    const r = k1(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return g`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : w} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${d(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Tl("steps.back", n)}</button>` : w}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Tl("steps.next", i)}</button>` : w}
      </div>
    </nav>`;
}
function _1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function kd(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return oc(t, ko(d("device.equipment"), e));
}
function nr(t) {
  if (Vt(t)) return d("props.inverter");
  const e = qp(t);
  return e ? d(`deviceRole.${e}`) : "";
}
function rs(t) {
  const e = d(`device.${t.props.kind}`), n = nr(t);
  return n ? `${e} · ${n}` : e;
}
function S1(t) {
  const e = _1(t.level);
  return g`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${d("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${d("devices.new")}</button>
    </div>
    ${e.length === 0 ? w : g`<div class="pdevs">
      ${e.map((n) => g`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${nr(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const A1 = ["unbound", "bound", "all"], C1 = /* @__PURE__ */ new WeakMap(), rn = (t) => t.placement.mode === "none";
function Md(t) {
  return Ae(C1, t, (e) => [...e.devices].sort((n, i) => Number(rn(n)) - Number(rn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function I1(t, e, n) {
  const i = Md(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const _d = (t) => d(`device.${t.props.kind}`), Hl = (t) => t.props.kind === "equipment" ? nr(t) : _d(t), E1 = (t, e) => t === "all" || t === "bound" == (e === "bound");
function D1(t, e, n) {
  return e === 0 ? d("binding.noDevices") : n || t.filter === "all" ? d("binding.noMatch") : d(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function zl(t) {
  const e = d(t.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function L1(t) {
  var l;
  if (t.collapsed) return g`<div class="blist collapsed">${zl(t)}</div>`;
  const e = Md(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: _o(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: c }) => E1(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || _d(a).toLowerCase().includes(i) || Hl(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const u = Ku(a);
    return g`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${d(`bindstatus.${c}`)} title=${d(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Hl(a)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${d("binding.show")}>
          ${A1.map((a) => g`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${d(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${zl(t)}
      </div>
      <input class="list-search" type="search" placeholder=${d("binding.search")} aria-label=${d("binding.search")}
        .value=${X(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? g`<p class="empty">${D1(t, e.length, i)}</p>` : g`
          ${s.filter((a) => !rn(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => rn(a.d)) ? g`<div class="bgroup" data-group="unplaced">
            <h5>${d("devices.unplaced")}</h5>
            ${s.filter((a) => rn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : w}`}
      </div>
    </div>`;
}
function T(t, e) {
  return g`<label class="row"><span>${t}</span>${e}</label>`;
}
function ne(t, e, n, i) {
  return g`<select class="val" data-field=${i ?? w} .value=${X(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => g`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Be(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return g`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? w}
    placeholder=${t.placeholder ?? w} title=${t.placeholder ?? w} .value=${X(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = In(s.value, t.rule);
    if (o === null) {
      s.value = e, n(d(t.bad));
      return;
    }
    if (t.skipSame && o === t.value) {
      n(null);
      return;
    }
    if (t.apply(o) === !1) {
      s.value = e, n(d("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function O1() {
  return {
    door: { width: ei.door, hinge: "start", swing: "left" },
    window: { width: ei.window, outside: "left" },
    opening: { width: ei.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function P1(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Sd(t) {
  return ko(d("zones.default"), t.zones.map((e) => e.name));
}
const N1 = (t) => t === "door" || t === "window" || t === "opening";
function T1(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return w;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: d(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return g`
    <h4>${d(`props.next.${n}`)}</h4>
    ${T(`${d("props.width")}, ${d("unit.mm")}`, Be({
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
    ${n === "door" ? g`
      ${T(d("props.hinge"), ne(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: d(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${T(d("props.swing"), ne(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : w}
    ${n === "window" ? T(d("props.outside"), ne(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : w}`;
}
class H1 {
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
const so = (t) => typeof t == "object" && t !== null && !Array.isArray(t), ln = (t) => typeof t == "string" && t ? t : null, Vl = (t) => typeof t == "number" && Number.isFinite(t), oo = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Ad(t) {
  return t.switchesMigrated || !t.devices.some(oo) ? t : { ...t, switchesMigrated: !0 };
}
function z1(t, e, n) {
  const i = oc(t, n);
  let s = i.level;
  const o = so(e.switch) ? e.switch : {}, r = [["power", ln(e.power)], ["voltage", ln(e.voltage)], ["control", ln(o.entity)]];
  for (const [l, a] of r) a && (s = zi(s, i.id, l, a));
  return o.controllable === !0 && (s = qi(s, i.id, !0)), { level: s, id: i.id };
}
function V1(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (so(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!so(l)) return l;
      if (l.kind === "meter" && ln(l.id) && Vl(l.x) && Vl(l.y)) {
        s++;
        const a = z1(e, l, ln(l.name) ?? `Meter ${s}`);
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
        return a === !0 && typeof l.deviceId == "string" && (e = ac(e, l.deviceId, !0)), o = !0, c;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(oo)) {
    for (const s of t.level.devices) oo(s) && (e = qi(e, s.id, !0));
    e = Ad(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
const ro = 3600;
function Fe(t) {
  return { id: te(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const R1 = (t, e) => [...t, e], B1 = (t, e) => t.map((n) => n.id === e.id ? e : n), F1 = (t, e) => t.filter((n) => n.id !== e);
function U1(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const W1 = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, ir = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).filter((n) => typeof n == "object" && n !== null && !Qe(n));
}, Mi = (t) => [...t.inputs, ...ir(t), ...t.gate ? [t.gate] : []].flatMap(W1), Cd = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, j1 = (t, e) => t.filter((n) => n.id !== e && Mi(n).includes(e));
function q1(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of Mi(l)) {
      const c = s(a, [...r, o]);
      if (c) return c;
    }
    return i.add(o), null;
  };
  for (const o of Mi(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const _i = /^([01]\d|2[0-3]):[0-5]\d$/, gt = (t) => typeof t == "number" && Number.isFinite(t);
function Z1(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return gt(e.below) && e.below > 0 && gt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && _i.test(n) && _i.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const Rl = (t) => Number.isInteger(t) && t >= 0 && t <= ro;
function G1(t, e, n, i, s, o, r, l, a, c, u, f, p, h, m, $, v, b, y) {
  var D;
  const x = [];
  e.name.trim() || x.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && x.push("inputs");
  const M = e.control, k = (Array.isArray(M == null ? void 0 : M.sources) ? M.sources : []).filter((A) => typeof A == "object" && A !== null && Qe(A)).map((A) => A.button), S = M ? [M.on, M.off, M.toggle].flatMap((A) => Array.isArray(A) ? A : []) : [], E = [...e.inputs, ...ir(e), ...e.gate ? [e.gate] : []], I = [...E.flatMap(Cd), ...e.onTrue.map((A) => A.device), ...e.onFalse.map((A) => A.device)], N = E.flatMap((A) => "light" in A.source ? [A.source.light] : "daylight" in A.source ? [A.source.daylight] : []);
  (I.some((A) => !n(A)) || N.some((A) => !(s ?? n)(A)) || e.vent && [e.vent.sensor, e.vent.than].some((A) => !(o ?? n)(A)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((A) => !(u ?? n)(A)) || e.leak.valves.some((A) => !(f ?? n)(A))) || e.timed && (!(p ?? n)(e.timed.button) || !(h ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(s ?? n)(e.outside.sensor)) || e.beurer && (!($ ?? n)(e.beurer.heater) || !(v ?? n)(e.beurer.source)) || k.some((A) => !(b ?? n)(A)) || S.some((A) => !(y ?? n)(A.device))) && x.push("device-missing");
  const B = new Set(t.map((A) => A.id));
  Mi(e).some((A) => A !== e.id && !B.has(A)) && x.push("rule-missing"), q1(t, e) && x.push("cycle"), (!Rl(e.onDelay) || !Rl(e.offDelay)) && x.push("delay");
  for (const A of E) {
    const P = Z1(A);
    P && !x.includes(P) && x.push(P);
  }
  return e.vent && K1(e, e.vent) && x.push("vent"), e.boiler && mb(e, e.boiler) && x.push("boiler"), e.leak && X1(e, e.leak) && x.push("leak"), e.timed && eb(e, e.timed) && x.push("timed"), e.outside && ib(e, e.outside) && x.push("outside"), e.beurer && sb(e, e.beurer) && x.push("beurer"), e.control && lb(e, e.control) && x.push("control"), (D = e.boiler) != null && D.button && c && !x.includes("device-missing") && !c(e.boiler.button) && x.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((A) => {
    const P = i(A.device);
    return P !== void 0 && !P.includes(A.do);
  }) && x.push("action"), M && S.some((A) => !ob.includes(A.do) || i && !rb(A.do, i(A.device))) && x.push("action"), x;
}
function K1(t, e) {
  if (t.inputs.length > 0 || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !gt(e.above) || !gt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function X1(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((s) => typeof s == "string" && s !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const Y1 = (t) => t.leak !== void 0;
function Q1(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const s = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), o = s ? it(s, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: o.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: o.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const J1 = 15;
function eb(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const tb = (t) => t.timed !== void 0, nb = 30;
function ib(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && _i.test(n) && _i.test(i) && n !== i);
}
const jn = { above: 200, offDelay: 60, keep: 10, every: 30 };
function sb(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !gt(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
const ob = ["on", "off", "toggle", "close"];
function an(t) {
  const e = ce(t);
  return e.includes("on") && e.includes("off") ? ["on", "off", "toggle"] : e.includes("close") ? ["close"] : [];
}
const rb = (t, e) => e === void 0 || (t === "close" ? e.includes("close") : e.includes("on") && e.includes("off"));
function Id(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function lb(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = [e.on, e.off, e.toggle];
  if (!Array.isArray(e.sources) || e.sources.length === 0 || !n.every(Array.isArray) || n.every((r) => r.length === 0)) return !0;
  const i = (r) => typeof r == "object" && r !== null && (Qe(r) ? typeof r.button == "string" && r.button !== "" : typeof r.source == "object" && r.source !== null);
  if (!e.sources.every(i) || e.sources.some((r, l) => e.sources.some((a, c) => c < l && Id(r, a)))) return !0;
  const s = (r) => r.every((l) => typeof l == "object" && l !== null && typeof l.device == "string" && l.device !== "") && new Set(r.map((l) => l.device)).size === r.length;
  if (!n.every(s)) return !0;
  const o = new Set(ir(t).flatMap(Cd));
  return n.some((r) => r.some((l) => o.has(l.device)));
}
const Bl = (t) => t.control !== void 0;
function ab(t, e, n) {
  var p, h;
  const i = Fe(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const s = e === null ? void 0 : t.levels.find((m) => m.zones.some(($) => $.id === e)), o = s ? it(s, e).filter((m) => m.participates).map((m) => m.device) : [], r = o.filter((m) => m.props.kind === "wall_switch" || m.props.kind === "smart_button"), l = o.filter((m) => {
    const $ = ce(m);
    return $.includes("on") && $.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, c = l.length === 1 ? l[0] : void 0, u = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((p = a.bindings) != null && p.state) && a.bindings.state === ((h = c == null ? void 0 : c.bindings) == null ? void 0 : h.control), f = (m) => c && !u ? [{ device: c.id, do: m }] : [];
  return i.control = { sources: a ? [a.props.kind === "smart_button" ? { button: a.id } : { source: { device: a.id } }] : [], on: f("on"), off: f("off"), toggle: f("toggle") }, i;
}
function cb(t, e) {
  const n = t.control;
  if (!n || "on" in n || !Array.isArray(n.sources) || !Array.isArray(n.loads) || ![...n.sources, ...n.loads].every((r) => typeof r == "string")) return t;
  const i = n.loads, s = (r) => i.map((l) => ({ device: l, do: r })), o = n.sources.map((r) => e(r) === "smart_button" ? { button: r } : { source: { device: r } });
  return { ...t, control: { sources: o, on: s("on"), off: s("off"), toggle: s("toggle") } };
}
const db = (t) => t.beurer !== void 0;
function ub(t, e) {
  const n = Fe(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = jn.offDelay, n.beurer = { heater: "", source: "", above: jn.above, keep: jn.keep, every: jn.every }, n;
}
const pb = (t) => t.outside !== void 0;
function fb(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), r = (s ? it(s, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && ce(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: nb }, i;
}
function hb(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), o = s ? it(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = o.filter((a) => {
    const c = ce(a);
    return c.includes("on") && c.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: J1 }, i;
}
function mb(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !gt(n.limit) || !gt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const gb = (t) => t.boiler !== void 0, lo = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function bb(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Ed = 3e3, Dd = 1400;
function vb(t, e, n) {
  var c;
  const i = Fe(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const s = e === null ? void 0 : t.levels.find((u) => u.zones.some((f) => f.id === e)), o = s ? it(s, e).filter((u) => u.participates).map((u) => u.device) : [], r = o.filter(lo), l = o.filter((u) => u.props.kind === "wall_switch" || u.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((c = t.power) == null ? void 0 : c.blocks) ?? []).filter((u) => u.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Ed, nominal: Dd }), i;
}
const wb = (t) => t.vent !== void 0, $b = 600;
function yb(t, e, n) {
  var l;
  const i = Fe(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = $b;
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), o = s ? it(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = o.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const xb = 1800;
function kb(t, e, n, i) {
  const s = Fe(e);
  return s.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", s.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: xb } } }], s;
}
const Mb = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), As = (t) => Mb.has(t.props.kind);
function ce(t) {
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
const si = (t, e) => Id(t, e);
class _b {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await ys(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(Or(d("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = Se(e);
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
    const n = await _h(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(d("load.oldServer"));
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
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = d("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await ys(this.h.hass);
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
      this.h.notice = Se(n);
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
    this.h.toolId = tr(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(Or(d("plan.default"))), this.offerDraft(null);
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
            await Ah(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = Se(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await ys(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = Se(o);
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
    this.h.plan = { ...e, levels: e.levels.map(ap) };
    const n = V1({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = lh(n.power, { device: (a) => n.level.devices.find((c) => c.id === a) }), s = new Map(this.h.plan.levels.flatMap((a) => a.devices.map((c) => [c.id, c.props.kind]))), o = (l = e.rules) == null ? void 0 : l.map((a) => cb(a, (c) => s.get(c))), r = e.rules && o && e.rules.length > 0 ? o.some((a, c) => a !== e.rules[c]) ? o : e.rules : void 0;
    this.h.history = new H1({ level: n.level, ...i ? { power: i } : {}, ...r ? { rules: r } : {} }), this.h.lazyPower = Vc(), this.h.activeTool.cancel(), this.h.activeTool = io(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((c, u) => u === 0 ? Ad(n) : c), { power: r, rules: l, ...a } = e;
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
    const e = `${this.h.plan.name} ${d("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), s = await this.h.save.saveAsNew(i, e);
    s && this.keepSaved(i), s ? (this.h.plan = s, this.h.dialog = null, this.afterSaved(n, s.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Sb {
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
    !n || !jf(n.states, e) ? this.base = { states: e, meta: Wf(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Zf(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), qf(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = d("binding.registryError").replace("{error}", Se(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const qn = Ta("", "");
function Ab(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? qn;
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
    openingDefaults: (e) => P1(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Sd(((e = t.history) == null ? void 0 : e.current.level) ?? qn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? qn).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : qc(((n = t.history) == null ? void 0 : n.current.level) ?? qn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Ld = Object.keys(Ao), Cb = (t) => Ld.includes(t);
function Ib() {
  return Object.fromEntries(Ld.map((t) => [t, Je(t, "free")]));
}
const Od = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Et, max: Et, signed: !0 }, bad: "props.badAim" }
}, cn = (t, e, n, i, s) => Be({ ...Od[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), Eb = ["round", "linear", "spot"], Db = ["rect", "circle"], Si = (t, e) => t.map((n) => ({ v: n, label: d(`${e}.${n}`) }));
function Pd(t, e, n, i) {
  const s = (r, l, a) => T(`${d(l)}, ${d("unit.mm")}`, cn(t, n + r, a, "mm", (c) => i({ [r]: c }))), o = (r, l, a) => T(`${d(l)}, ${d("unit.deg")}`, cn(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return g`
        ${T(d("props.shape"), ne(e.shape, Si([...Eb], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? g`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : w}
        ${T(`${d("props.poolRadius")}, ${d("unit.mm")}`, Be({
        ...Od.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: d("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return g`${o("coneAngle", "props.coneAngle", e.coneAngle)}${s("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return g`${o("zoneAngle", "props.zoneAngle", e.zoneAngle)}${s("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return T(`${d("props.diameter")}, ${d("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${X(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Ju.map((r) => g`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return g`
        ${T(d("props.shape"), ne(e.shape, Si([...Db], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? g`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${T(d("props.icon"), Ob(t, e.icon, `${n}icon`, i))}
        ${T(d("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${X(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return g`<p class="muted" data-note="daylight">${d("props.daylightInBinding")}</p>`;
    default:
      return g`<p class="muted">${d("props.noSettings")}</p>`;
  }
}
const Lb = /^mdi:[a-z0-9-]+$/;
function Ob(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!Lb.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, d("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? g`<ha-icon-picker data-field=${n} .value=${X(e)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : g`<input class="val wide" type="text" data-field=${n} .value=${X(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function bt(t, e, n, i) {
  return T(e, g`<input type="checkbox" data-field=${t} .checked=${X(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Pb(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? w : bt("wallMount", d("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Nb(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? w : g`
    ${bt("inverter", d("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? bt("controllable", d("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : g`<p class="muted" data-note="bind-switch">${d("props.bindSwitchHint")}</p>`}`;
}
function Tb(t, e) {
  const n = e.placement;
  if (n.mode === "none") return w;
  if (n.mode === "free")
    return T(
      `${d("props.rotation")}, ${d("unit.deg")}`,
      cn(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = Ha.has(e.props.kind);
  return g`
    ${T(d("props.side"), ne(n.side, Si(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${T(`${d("props.offset")}, ${d("unit.mm")}`, cn(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? T(
    `${d("props.aim")}, ${d("unit.deg")}`,
    cn(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(wc(n, s)))
  ) : w}`;
}
function sr(t, e) {
  return T(d("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${X(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function Hb(t, e) {
  const n = e.props.kind;
  return Na(n) ? n === "smart_button" && e.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${d("props.typeFreeHint")}</p>` : T(d("props.type"), ne(
    n,
    Si(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : w;
}
function zb(t, e) {
  const n = t.level ? vf(t.level, e) : [];
  return g`<fieldset data-field="zone-membership"><legend>${d("props.zoneList")}</legend>
    ${n.length === 0 ? g`<p class="muted">${d("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => g`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function Vb(t, e) {
  const n = e.placement.mode !== "none";
  return g`
    <h4>${rs(e)}</h4>
    ${sr(e, (i) => t.onDevice({}, i))}
    ${Hb(t, e)}
    ${n ? Pd(t, e.props, "", (i) => t.onDevice(i)) : w}
    ${Pb(t, e)}
    ${Tb(t, e)}
    ${Nb(t, e)}
    ${n ? zb(t, e) : w}
    ${e.invalid ? g`<p class="warn">${d("props.invalidDevice")}</p>` : w}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${d("action.delete")}</button>`;
}
function Rb(t) {
  return t.device ? Vb(t, t.device) : t.nextKind && t.nextProps ? g`
      <h4>${d("props.nextDevice")}: ${d(`device.${t.nextKind}`)}</h4>
      ${Pd(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? bt(
    "next-wallMount",
    d("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : w}` : g`<p class="muted">${d("props.none")}</p>`;
}
function Bb(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = Cb(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(d("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const u = e1(e, a, c);
    return o(u ? mi(e, a.id, u) : e);
  };
  return g`<div class="props">
    ${Rb({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, c) => !!i && o(Rt(e, i.id, a, c)),
    onKind: (a) => !!i && o(Zp(e, i.id, a)),
    onPlacement: (a) => !!i && o(mi(e, i.id, a)),
    onZone: (a, c) => !!i && o(Ec(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Wc(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(qi(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(Uc(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? g`<p class="warn">${t.notice}</p>` : w}
    ${i ? w : S1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = kd(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const ao = (t) => d(`zones.kind.${t.shape.kind}`), or = (t) => g`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? Fh : sm}></path>`}</svg>`;
function Nd(t, e) {
  const n = yc(t, e);
  return n ? d(`zones.invalid.${n}`) : null;
}
function Fb(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: Xo(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || ao(o).toLowerCase().includes(e));
  return g`
    <div class="zlist">
      <div class="zhead"><span>${d("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${d("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${d("zones.filter")}
        aria-label=${d("zones.filter")} .value=${X(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? Nd(t.level, o) ?? "" : null;
    return g`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? g`<span class="zswatch" style=${`background:${r}`}></span>` : g`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${ao(o)}>${or(o.shape.kind)}</span>
            <span class="zarea">${((a = No(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const rr = ns(class extends is {
  constructor(t) {
    if (super(t), t.type !== Ue.PROPERTY && t.type !== Ue.ATTRIBUTE && t.type !== Ue.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Jc(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === we || e === w) return e;
    const n = t.element, i = t.name;
    if (t.type === Ue.PROPERTY) {
      if (e === n[i]) return we;
    } else if (t.type === Ue.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return we;
    } else if (t.type === Ue.ATTRIBUTE && n.getAttribute(i) === e + "") return we;
    return Ko(t), e;
  }
}), Td = (t, e, n) => g`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${rr(e)}
    @change=${(i) => n(i.target.checked)} />${d("zones.automation")}</label>`;
function Ub(t, e, n) {
  const i = it(t, e.id);
  return g`<div class="zmembers">
    <div class="zhead"><span>${d("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? g`<span>${d("zones.participates")}</span>` : w}</div>
    ${i.length === 0 ? g`<p class="muted">${d("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => g`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${d(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${d("zones.participates")} .checked=${rr(o)}
          @change=${(r) => {
    const l = Ec(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Fl(t, e, n) {
  const i = Nd(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return g`<div class="zprops">
    <h4>${d("props.zone")}</h4>
    ${T(d("props.name"), g`<input class="val wide" type="text" data-field="zone-name" .value=${X(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(Cf(t, e.id, l));
  }} />`)}
    ${T(d("props.area"), g`<span class="val ro" data-field="zone-area">${ld(No(t, e))}</span>`)}
    ${T(d("zones.outline"), g`<span class="val ro zkindval" data-field="zone-kind">${or(e.shape.kind)}${ao(e)}</span>`)}
    ${Td("zone-automation", e.automation !== !1, (o) => {
    const r = Ro(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? g`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? g`<button class="btn" data-action="keep-outline" @click=${() => n(Lf(t, e.id))}>
        ${d("zones.keepOutline")}</button>` : w}</div>` : w}
    ${Ub(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Ic(t, e.id))}>
      ${d("zones.delete")}</button>
  </div>`;
}
function Wb(t) {
  const e = t.next.zone, n = e.name ?? Sd(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return g`
    <h4>${d("props.nextZone")}</h4>
    <div class="muted">${d("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${d("zones.method")}>
      ${["walls", "polygon"].map((s) => g`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${or(s)}<span>${d(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${d(`zones.hint.${e.method}`)}</p>
    ${T(d("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${X(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Td("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function Hd(t, e, n) {
  return Be({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Ul(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function jb(t, e) {
  const n = le(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Ff(e.level, t.id, o));
  return g`
    <h4>${d("props.wall")}</h4>
    ${T(d("props.type"), ne(
    t.type,
    i.map((o) => ({ v: o, label: d(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${T(d("props.thickness"), Hd(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${T(d("props.baseline"), ne(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: d(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${T(d("props.length"), g`<span class="val ro">${pt(n)} ${d("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(Wo(e.level, t.id))}>
      ${d("action.delete")}</button>`;
}
function qb(t, e) {
  const n = ["door", "window", "opening", ...fi.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Wp(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: d(`side.${r}`) })), o = fi.includes(t.kind);
  return g`
    <h4>${d(`kind.${t.kind}`)}</h4>
    ${T(d("props.kind"), ne(t.kind, n.map((r) => ({ v: r, label: d(`kind.${r}`) })), (r) => i(Up(t, r))))}
    ${T(d("props.width"), Hd(e, t.width, (r) => Ul(e, Fp(e.level, t.id, r))))}
    ${T(d("props.offset"), Be({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Ul(e, tc(e.level, t.id, r))
  }))}
    ${o ? g`
      ${T(d("props.hinge"), ne(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: d(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${T(d("props.swing"), ne(t.swing ?? "left", s, (r) => i({ swing: r })))}` : w}
    ${t.kind === "window" ? T(d("props.outside"), ne(t.outside ?? "left", s, (r) => i({ outside: r }))) : w}
    ${T(d("props.passesLight"), g`<input type="checkbox" data-field="passesLight" .checked=${X(Ya(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Xa(t.kind) ? void 0 : l });
  }} />`)}
    ${T(d("props.passesPir"), g`<input type="checkbox" data-field="passesPir" .checked=${X(Ja(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Qa(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? g`<p class="warn">${d("props.invalidOpening")}</p>` : w}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(nc(e.level, t.id))}>
      ${d("action.delete")}</button>`;
}
function Zb(t) {
  const e = ["bearing", "partition", "railing"];
  return g`
    <h4>${d("props.newWall")}</h4>
    ${T(d("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => g`<option value=${n} ?selected=${n === t.wallType}>${d(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${T(`${d("props.thickness")}, ${d("unit.mm")}`, Be({
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
      <div class="muted">${d("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => g`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${d(`measure.${n}`)}</button>`)}
      </div>` : w}`;
}
const Wl = (t) => Fb({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function Gb(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return g`<div class="props">
      ${Wb({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : w}
      ${s ? Fl(e, s, t.commit) : w}
      ${Wl(t)}
    </div>`;
  }
  let i = w;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = jb(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = qb(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Fl(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = g`<h4>${d("props.node")}</h4>
      ${T("X", g`<span class="val ro">${pt(s.x)}</span>`)}${T("Y", g`<span class="val ro">${pt(s.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === w && (t.tool === "wall" || t.tool === "box") ? Zb(t) : i === w && N1(t.tool) ? T1({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === w && t.tool === "select" ? Wl(t) : i === w ? g`<p class="muted">${d("props.none")}</p>` : i}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : w}
    </div>`;
}
function Kb(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const jl = /* @__PURE__ */ new WeakMap();
function lr(t, e, n) {
  let i = jl.get(t);
  i || jl.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : Kb(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function oi(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zn = (t) => t ?? w;
var Xb = Object.defineProperty, Nn = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && Xb(e, n, s), s;
};
const Yb = 100;
let Qb = 0;
const Jb = (t) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, vr = class vr extends At {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Qb++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === Yb) {
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
    return g`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${Zn(this.label || void 0)} title=${Zn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? g`<button class="x" type="button" title=${d("combo.clear")} aria-label=${d("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : w}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return g`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Zn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => g`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Zn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? g`<div class="empty">${this.emptyText()}</div>` : w}
      ${n ? g`<div class="hint">${d("combo.more")}</div>` : w}
    </div>`;
  }
  render() {
    return g`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : w}</div>`;
  }
};
vr.styles = Aa`
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
let tt = vr;
Nn([
  ze()
], tt.prototype, "value");
Nn([
  ze()
], tt.prototype, "label");
Nn([
  q()
], tt.prototype, "isOpen");
Nn([
  q()
], tt.prototype, "query");
Nn([
  q()
], tt.prototype, "active");
var ev = Object.defineProperty, ar = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && ev(e, n, s), s;
};
const tv = {
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
}, ql = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, nv = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Zl(t, e) {
  return t != null && t.deviceClass && ql[t.deviceClass] ? ql[t.deviceClass] : nv[(t == null ? void 0 : t.domain) ?? Nc(e)] ?? "generic";
}
const Gl = (t) => Jb(tv[t]);
function iv(t) {
  switch (t) {
    case "sensor":
      return d("combo.domain.sensor");
    case "binary_sensor":
      return d("combo.domain.binary_sensor");
    case "light":
      return d("combo.domain.light");
    case "switch":
      return d("combo.domain.switch");
    case "fan":
      return d("combo.domain.fan");
    case "event":
      return d("combo.domain.event");
    default:
      return t;
  }
}
class ls extends tt {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = oi(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? oi(this.meta, e) : null;
    return g`${Gl(e ? Zl(this.meta.entities.get(e), e) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : w}<small class="eid">${e}</small></span>` : g`<span class="ph">${d("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = Hc(this.states, e.entityId) ?? "unavailable";
    return g`${Gl(Zl(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${iv(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = oi(this.meta, e).name;
    return n === e ? e : `${n} (${e})`;
  }
  rowTitle(e) {
    return e.name === e.id ? e.id : `${e.name} (${e.id})`;
  }
  searchLabel() {
    return d("combo.search");
  }
  emptyText() {
    return d("combo.empty");
  }
}
ar([
  ze({ attribute: !1 })
], ls.prototype, "meta");
ar([
  ze({ attribute: !1 })
], ls.prototype, "items");
ar([
  ze({ attribute: !1 })
], ls.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", ls);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dn = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), dn(s, e);
  return !0;
}, Ai = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, zd = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), rv(e);
  }
};
function sv(t) {
  this._$AN !== void 0 ? (Ai(this), this._$AM = t, zd(this)) : this._$AM = t;
}
function ov(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) dn(i[o], !1), Ai(i[o]);
  else i != null && (dn(i, !1), Ai(i));
  else dn(this, t);
}
const rv = (t) => {
  t.type == Ue.CHILD && (t._$AP ?? (t._$AP = ov), t._$AQ ?? (t._$AQ = sv));
};
class lv extends is {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), zd(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (dn(this, e), Ai(this));
  }
  setValue(e) {
    if (Jc(this._$Ct)) this._$Ct._$AI(e, this);
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
const av = () => new cv();
class cv {
}
const Cs = /* @__PURE__ */ new WeakMap(), dv = ns(class extends lv {
  render(t) {
    return w;
  }
  update(t, [e]) {
    var i;
    const n = e !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = e, this.ht = (i = t.options) == null ? void 0 : i.host, this.rt(this.ct = t.element)), w;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let n = Cs.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Cs.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Cs.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), uv = () => [{ v: "0", label: d("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], pv = { min: 1, max: 10 };
function Vd(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const co = (t, e, n) => Vd(t, Rt(t.level, e.id, n));
function Is(t, e, n, i) {
  return g`<div class="cflag">${T(e, g`<input type="checkbox" data-field=${t} .checked=${X(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Es = "__other", Kt = /* @__PURE__ */ new Set();
function fv(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Lr.includes(i), l = !r || Kt.has(o), a = av(), c = [...Lr.map((f) => ({ v: f, label: f })), { v: Es, label: d("binding.eventOther") }];
  return g`<span class="evfield">${ne(l ? Es : i, c, (f) => {
    if (f === Es) {
      Kt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Kt.delete(o), a.value && (a.value.hidden = !0), f !== i ? s(f) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${dv(a)} data-field=${`${n}-event-custom`} ?hidden=${rr(!l)}
      .value=${X(r ? "" : i)} @change=${(f) => {
    var m;
    const p = f.target, h = p.value.trim();
    if (!h) {
      p.value = r ? "" : i, t.setFieldNotice(d("props.badEvent"));
      return;
    }
    if (p.value = h, t.setFieldNotice(null), h !== i) {
      s(h) && Kt.delete(o);
      return;
    }
    if (Kt.delete(o), r) {
      p.hidden = !0;
      const $ = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      $ && ($.value = i);
    }
  }} /></span>`;
}
function hv(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return g`${w}`;
  const s = i[n], o = (r) => co(t, e, { [n]: { ...s, ...r } });
  return g`<div class="trigger" data-trigger=${n}>
    ${T(d("binding.slot"), ne(
    String(s.slot),
    uv(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${T(d("binding.event"), fv(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function mv(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return g`
      ${Is(
      "autoByDoubleToggle",
      d("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => co(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${T(d("binding.window"), Be({
      value: i.windowSec,
      rule: pv,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => co(t, e, { windowSec: l })
    }))}</div>` : w}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${w}`;
  const s = (l, a) => (c) => {
    var f, p;
    const u = Rt(t.level, e.id, { [l]: c });
    return Vd(t, c && !((f = e.bindings) != null && f[a]) ? zi(u, e.id, a, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = Is("autoEnabled", d("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : g`${Is("separateOff", d("binding.separateOff"), i.separateOff, o)}${i.separateOff ? w : r}`;
}
function gv(t) {
  return t.props.kind !== "smart_button" || !Qu(t).length ? g`${w}` : g`<div class="cfields"><p class="warn" data-note="duplicate">${d("binding.duplicate")}</p></div>`;
}
const Nt = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, Rd = 3600, En = (t) => typeof t == "number" && Number.isFinite(t);
function bv(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Nt, i = Bd(e.nightBelow, e.dayAbove), s = Fd(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: s ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: s ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: Ud(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function Bd(t, e) {
  if (t !== void 0 && !En(t) || e !== void 0 && !En(e)) return !1;
  const n = t ?? Nt.nightBelow, i = e ?? Nt.dayAbove;
  return n >= 0 && n < i;
}
function Fd(t, e) {
  if (t !== void 0 && !En(t) || e !== void 0 && !En(e)) return !1;
  const n = t ?? Nt.sunNight, i = e ?? Nt.sunDay;
  return n < i;
}
const Ud = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= Rd, Kl = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function vv(t, e) {
  var l, a, c, u;
  const n = bv(t), i = (f) => {
    const p = f ? e == null ? void 0 : e[f] : void 0;
    return p && typeof p == "object" ? p : void 0;
  }, s = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (s && ((a = s.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof s.state == "string" && s.state.trim() !== "") {
    const f = Number(s.state);
    if (Number.isFinite(f)) return { state: Kl(f, n.nightBelow, n.dayAbove), lux: f };
  }
  const o = i((c = t.bindings) == null ? void 0 : c.sun), r = (u = o == null ? void 0 : o.attributes) == null ? void 0 : u.elevation;
  return o && o.state !== "unavailable" && o.state !== "unknown" && En(r) ? { state: Kl(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
function wv(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function $v(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return w;
  const i = Nt, s = (a, c) => {
    if (c === n[a] || n[a] === void 0 && c === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(Rt(t.level, e.id, { [a]: c }));
  }, o = (a, c) => {
    const u = String(n[a] ?? i[a]);
    return T(c, g`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${X(u)}
      @change=${(f) => {
      const p = f.target;
      if (p.value.trim() === "") {
        s(a, void 0);
        return;
      }
      const h = wv(p.value);
      if (h === null) {
        p.value = u, t.setFieldNotice(d("props.badDecimal"));
        return;
      }
      s(a, h);
    }} />`);
  }, r = T(d("props.debounce"), Be({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: Rd },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => s("debounce", a),
    onBlank: () => s("debounce", void 0)
  })), l = (a, c) => g`<p class="warn" data-note=${a}>${c}</p>`;
  return g`<div class="cfields" data-section="daylight">
    ${o("nightBelow", d("props.nightBelow"))}
    ${o("dayAbove", d("props.dayAbove"))}
    ${Bd(n.nightBelow, n.dayAbove) ? w : l("lux-pair", d("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${o("sunNight", d("props.sunNight"))}
    ${o("sunDay", d("props.sunDay"))}
    ${Fd(n.sunNight, n.sunDay) ? w : l("sun-pair", d("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${Ud(n.debounce) ? w : l("debounce", d("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function uo(t, e) {
  return e === "control" && t.props.kind === "equipment" ? d("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? d("binding.onOff") : d(`role.${e}`);
}
const Ds = (t) => String(t).padStart(2, "0");
function yv(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Ds(e.getHours())}:${Ds(e.getMinutes())}:${Ds(e.getSeconds())}`;
}
const xv = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function kv(t) {
  return t.status === "error" ? t.reason === "unavailable" ? d("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : d("output.errorNotConfigured") : t.last ? d("output.last").replace("{event}", xv(t.last, t.kind)).replace("{time}", yv(t.last.at)) : d("output.none");
}
function Mv(t, e) {
  if (!Ri(e.props.kind)) return w;
  const n = t.feed.stateOf(e), i = n ? kv(n) : t.feed.error ?? (t.feed.ready ? d("output.notSaved") : null);
  return i === null ? w : g`<p class="note" data-field="output">${i}</p>`;
}
function _v(t, e, n, i) {
  const s = zc(t.meta, i, t.states), o = Yu(t.level, e, n);
  return g`
    ${s === "missing" ? g`<p class="warn" data-note="missing">${d("binding.missing")}</p>` : w}
    ${s === "unavailable" ? g`<p class="note" data-note="unavailable">${d("binding.unavailable")}</p>` : w}
    ${o.length ? g`<p class="note" data-note="also">${d("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : w}`;
}
function Sv(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = uo(e, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${d("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${lr(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = zi(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Mo(i) ? hv(t, e, i) : w}
    ${s ? _v(t, e, i, s) : w}
  </div>`;
}
function Av(t) {
  const e = t.device, n = _o(t.level.devices.map(t.status));
  return g`<div class="props bprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : w}
    ${t.fieldNotice ? g`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : w}
    ${t.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${d(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : w}
    ${e ? g`
      <h4>${rs(e)}</h4>
      ${sr(e, (i) => t.commit(Rt(t.level, e.id, {}, i)))}
      ${Mv(t, e)}
      ${Oe(e).map((i) => g`${Sv(t, e, i)}${mv(t, e, i.role)}`)}
      ${gv(e)}
      ${$v(t, e)}` : g`<p class="muted">${d("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${d("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${d("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${d("binding.reload")}</button>
  </div>`;
}
const Cv = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Iv = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Ev = 6, Dv = ["A", "0", "B"], Lv = ["power", "control"], Ov = ["power", "power_in", "power_out", "voltage", "control"], Tt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function Xt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function Yt(t, e, n, i, s, o) {
  return g`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${lr(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function Pv(t, e) {
  const n = e.name ?? "";
  return T(d("props.name"), g`<input class="val wide" type="text" data-field="name"
    placeholder=${d(`power.kind.${e.kind}`)} .value=${X(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(Mn(t.power, e.id, { name: o }, Tt(t))) : s.value = n;
  }} />`);
}
function Nv(t, e) {
  const n = new Set(Oe(e).map((i) => i.role));
  return g`${Lv.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return g`<div class="role">
      <div class="role-head"><span class="role-label">${d(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? g`<b>${oi(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${d("power.boundHint")}</p>`;
}
function Gn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function Tv(t, e) {
  var o;
  const n = Oe(e), i = Ov.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return g`
    ${sr(e, (r) => Gn(t, Rt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return g`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${uo(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${lr(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${uo(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), Gn(t, zi(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? bt(
    "controllable",
    d("props.controllable"),
    !!s.controllable,
    (r) => Gn(t, qi(t.level, e.id, r))
  ) : w}
    ${s.kind === "equipment" ? bt("inverter", d("props.inverter"), !!s.inverter, (r) => {
    const l = Wc(t.level, t.power, e.id, r);
    return Gn(t, l.level, l.power);
  }) : w}`;
}
function Hv(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return g`<p class="warn" data-note="device-missing">${d("power.missing")}</p>`;
  const i = Vt(n) ? w : bt("output", d("power.enableOutput"), e.output !== !1, (s) => {
    const o = Tt(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(Qi(Mn(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? g`${Tv(t, n)}${i}` : g`
    ${T(d("props.name"), g`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${T(d("props.kind"), g`<span class="val ro">${d(`device.${n.props.kind}`)}</span>`)}${Nv(t, n)}${i}`;
}
function zv(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: d(`power.form.${r}`) }));
  return g`
    ${T(d("power.form"), ne(e.form, i, (r) => {
    r !== e.form && t.commitPower(Mn(t.power, e.id, { form: r }, Tt(t)));
  }, "form"))}
    <div class="row"><span>${d("power.position")}</span><span class="seg pos">${Dv.map((r) => g`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${d("power.positionHint")}</p>`;
}
function Vv(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, c) => {
    if (a === i && c === s) return !1;
    t.commitPower(Mn(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, Tt(t)));
  }, r = (a, c, u) => Be({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: u }), l = ["h", "v"].map((a) => ({ v: a, label: d(`power.orientation.${a}`) }));
  return g`
    ${T(d("power.orientation"), ne(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(Mn(t.power, e.id, { w: e.h, h: e.w }, Tt(t)));
  }, "bus-orientation"))}
    ${T(d("power.busLength"), r("bus-length", i, (a) => o(Math.max(no, s + 1, a), s)))}
    ${T(d("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(Ev, a), i - 1))))}`;
}
function Rv(t, e) {
  switch (e.kind) {
    case "grid":
      return g`
      ${Yt(t, "power", d("power.field.power"), ut, e.power, (n) => Xt(t, e, "power", n))}
      ${Yt(t, "voltage", d("power.field.voltage"), Cv, e.voltage, (n) => Xt(t, e, "voltage", n))}`;
    case "device":
      return Hv(t, e);
    case "battery":
      return g`
      ${Yt(t, "power", d("power.field.batteryPower"), ut, e.power, (n) => Xt(t, e, "power", n))}
      ${Yt(t, "soc", d("power.field.soc"), Iv, e.soc, (n) => Xt(t, e, "soc", n))}`;
    case "pv":
      return Yt(t, "power", d("power.field.power"), ut, e.power, (n) => Xt(t, e, "power", n));
    case "transfer":
      return zv(t, e);
    case "bus":
      return Vv(t, e);
    default:
      return w;
  }
}
function Bv(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return g`
    <h4>${i ? rs(i) : d(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? w : Pv(t, e)}
    ${Rv(t, e)}
    <div class="pactions">
      ${n ? g`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(nh(t.power, e.id))}>${d("power.autoPorts")}</button>` : w}
      ${e.kind === "grid" ? w : g`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Bc(t.power, e.id))}>${d("action.delete")}</button>`}
    </div>`;
}
function Fv(t, e) {
  var s, o;
  const n = Tt(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? es(l, n) || d(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return g`
    <h4>${d("power.wire")}</h4>
    ${T(d("power.wire.from"), g`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${T(d("power.wire.to"), g`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${T(d("power.wire.power"), g`<span class="val ro" data-field="wire-power">${_t((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(jc(t.power, e.id))}>${d("action.delete")}</button></div>`;
}
function Uv(t) {
  const e = qc(t.level, t.power);
  return g`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = kd(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${d("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${d("power.help.device")}</p>
    ${e.length === 0 ? g`<p class="muted" data-note="no-devices">${d("power.noDevices")}</p>` : g`<div class="pdevs">
      ${e.map((i) => g`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${rs(i)}</span>
      </button>`)}
    </div>`}`;
}
function Wv(t) {
  if (t.toolId === "power-device") return Uv(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return Bv(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Fv(t, i) : t.toolId !== "power-select" ? g`<p class="muted" data-note="power-hint">${d("power.help.place")}</p>` : g`<p class="muted" data-note="power-hint">${d("power.pick")}</p><p class="muted">${d("power.help.select")}</p>`;
}
function jv(t) {
  return g`<div class="props pprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : w}
    ${t.feedError ? g`<p class="note" data-notice="feed">${t.feedError}</p>` : w}
    ${Wv(t)}
  </div>`;
}
const Wd = "ended: switched elsewhere";
function Tn(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
function jd(t) {
  return t.sent === !1 && (t.reason === Wd || t.reason.startsWith("switched elsewhere"));
}
const qv = 5e3, Zv = 12;
function Xl(t) {
  t().catch(() => {
  });
}
class Gv {
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
      this.setFailure(d("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Xl(n.unsub));
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
          Xl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Se(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Zv || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, qv));
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
function Ce(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function cr(t) {
  if (Tn(t)) return d("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", Ce(t.at)).trim();
  if (t.sent === !1)
    return d(jd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", Ce(t.at)).trim();
  const e = `${d(`rules.did.${t.action}`)} ${t.target} ${Ce(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function dr(t) {
  return Tn(t) ? d("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", Ce(t.at)) : d("vent.flow.last").replace("{did}", d(`rules.did.${t.action}`)).replace("{at}", Ce(t.at));
}
function Kv(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${d("rules.status.error")}: ${e.reason}` : d(`rules.status.${e.status}`) : t.enabled === !1 ? d("rules.status.disabled") : n.live ? d("rules.unsaved") : d("rules.noTrace");
}
function Xv(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !si(r, t);
  return g`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${d(`rules.verdict.${s}`)}
        title=${d(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? g` <span class="orphan">(${d("rules.orphan")})</span>` : w}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${Kv(t, i, n)}</span>
        ${l ? g`<span class="runsaved">${d("rules.unsavedChanges")}</span>` : w}
        ${o > 0 ? g`<span class="rwarn">${o === 1 ? d("rules.unknown1") : d("rules.unknownN").replace("{n}", String(o))}</span>` : w}
        ${i != null && i.last ? g`<span class="rlast">${cr(i.last)}</span>` : w}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${d("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${d("rules.delete")}</button>
      </div>
    </div>`;
}
function Yv(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = U1(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return g`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : d("rules.noZone")}</h4>
      ${t.feedError ? g`<p class="muted">${t.feedError}</p>` : w}
      ${n === null && i.length === 0 && t.rules.length === 0 ? g`<p class="muted">${d("rules.hint")}</p>` : w}
      ${i.length === 0 ? g`<p class="muted rempty">${d("rules.empty")}</p>` : i.map((s) => Xv(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const qd = {
  condition: Th,
  leak: od,
  timer: tm,
  outside: cm,
  vent: td,
  boiler: am,
  timed: nm,
  beurer: Wh,
  control: nd
}, Qv = ["condition", "timer", "control"], Jv = ["vent", "boiler", "leak", "timed", "outside", "beurer"], po = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function ew(t, e, n) {
  return [
    ...Qv.map((i) => g`
      <button class="tool" data-template=${i} title=${d(`rules.template.${i}`)} @click=${() => t(i)}>
        ${po(qd[i])}<span class="tlabel">${d(`rules.template.${i}`)}</span></button>`),
    g`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${d("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${po(Yh)}<span class="tlabel">${d("rules.automations")}</span></button>`
  ];
}
function tw(t) {
  var o;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), s = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  s !== null && (t.preventDefault(), (o = n[s]) == null || o.focus());
}
function nw(t, e, n) {
  return g`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${d("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${tw}>
      ${Jv.map((i) => g`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${po(qd[i])}<span>${d(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function iw(t, e) {
  return t.mode === "automation" ? g`<div class="tools">${xd(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${ew((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? x1(t.mode, t.toolId, (n) => t.pickTool(n)) : L1({
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
function sw(t, e) {
  var i;
  const n = t.selection;
  return Av({
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
function ow(t, e) {
  var i;
  if (t.mode === "binding") return sw(t, e);
  if (t.mode === "automation")
    return g`<div class="props">${Yv({
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
    return jv({
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
  return t.mode === "equipment" ? Bb({
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
  }) : Gb({
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
function rw(t, e) {
  switch (t) {
    case "wall":
      return [["Shift", d("hint.shift")], [d("hint.digits"), d("hint.length")], ["Tab", d("hint.tab")], ["Esc", d("hint.esc")]];
    case "box":
      return [[d("hint.digits"), d("hint.size")], ["Tab", d("hint.tabSize")], ["Esc", d("hint.esc")]];
    case "zone":
      return e === "polygon" ? [
        ["Enter", d("hint.close")],
        ["Backspace", d("hint.removeVertex")],
        ["Shift", d("hint.shift")],
        ["Alt", d("hint.freeVertex")],
        ["Esc", d("hint.cancel")]
      ] : [["Esc", d("hint.esc")]];
    case "select":
    case "device-select":
    case "power-select":
      return [["Del", d("hint.delete")], ["Esc", d("hint.deselect")]];
    case "binding-select":
      return [["Esc", d("hint.deselect")]];
    default:
      return [["Esc", d("hint.esc")]];
  }
}
function lw(t, e) {
  const n = t === "zone" ? `${d("tool.zone")} · ${d(`zones.kind.${e}`)}` : d(`tool.${t}`);
  return g`<span class="tool-chip">${yd(t)}${n}</span>`;
}
function aw(t) {
  return g`
    <div class="status">
      ${lw(t.tool, t.zoneMethod)}
      ${rw(t.tool, t.zoneMethod).map(([e, n]) => g`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? g`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${d(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? w : g`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${d("status.cones")}
      </label>`}
    </div>`;
}
function cw(t, e) {
  var o, r;
  const n = e.palette, i = 1 / e.scale, s = [
    {
      label: d(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((o = e.live) == null ? void 0 : o.first) ?? "",
      active: t.field === "first",
      unit: d("unit.mm")
    },
    {
      label: d(e.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: t.second,
      live: ((r = e.live) == null ? void 0 : r.second) ?? "",
      active: t.field === "second",
      unit: e.mode === "box" ? d("unit.mm") : "°"
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
function dw(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = s[0], u = Math.hypot(c.x - a.x, c.y - a.y);
    let f = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return f < 0 && (f += 360), { first: pt(u), second: f.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: pt(r), second: pt(l) };
}
function uw(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const pw = Aa`
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
`, fw = 5e-3, hw = 2, Ci = (t) => Math.max(fw, Math.min(hw, t));
function mw(t, e, n) {
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
function gw(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Ci(Math.min(e, n) / 12e3) };
  const i = t.map((f) => f.x), s = t.map((f) => f.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, c = Math.max(...s) + o, u = Ci(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / u / 2, y: (a + c) / 2 - n / u / 2, scale: u };
}
function bw(t, e, n, i, s) {
  const o = Ci(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function vw(t, e, n) {
  const i = Ci(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function ww(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Yl(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function $w(t, e, n, i, s = 1) {
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
const yw = ["Shift", "Control", "Alt", "Meta"], xw = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, kw = new Map(Object.entries($d).map(([t, e]) => [`Key${e}`, t]));
function Ql(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class Mw {
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
          this.h.view = ww(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.view = vw(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Ql(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? kw.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = xw[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Ql(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !yw.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Zd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function _w(t) {
  return g`
    <div class="draft-banner" role="status">
      <span>${d("draft.banner").replace("{time}", Zd(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${d("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${d("draft.discard")}</button>
    </div>`;
}
function $t(t, e, n, i) {
  return g`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? g`<p class="muted">${i}</p>` : w}
        <div class="actions">
          ${n.map((s) => g`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Sw(t) {
  var n;
  const e = { action: "cancel", label: d("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? $t(d("draft.title"), d("draft.text").replace("{time}", Zd(i.savedAt)), [
        { action: "restore", label: d("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: d("draft.discard"), onClick: () => t.discard(i) }
      ]) : w;
    }
    case "new":
      return $t(d("new.title"), d("new.text"), [
        { action: "new-discard", label: d("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return $t(d("delete.title"), d("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: d("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return $t(d("delete.rule.title"), d("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: d("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? d("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return $t(d("switch.title"), d("switch.text"), [
        { action: "switch-discard", label: d("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return $t(d("conflict.title"), d(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: d("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: d("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return w;
  }
}
const Qt = "plan_studio.draft.", Kn = "plan_studio.lastPlanId";
function Aw() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Cw(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class Iw {
  constructor(e = Aw, n = 500) {
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
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Qt + e), s = i ? JSON.parse(i) : null;
      return Cw(s) && s.planId === e ? s : null;
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
    var e;
    try {
      return ((e = this.storage()) == null ? void 0 : e.getItem(Kn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Kn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Kn)) === e && n.removeItem(Kn);
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
const Gd = 5e3, Kd = 12;
function Jl(t) {
  t().catch(() => {
  });
}
class Ew {
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
      this.setFailure(d("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Jl(n.unsub));
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
          Jl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Se(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Kd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Gd));
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
const Dw = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function Xd(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const Yd = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Lw(t, e) {
  var o;
  const n = Yd(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Dw[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const Ow = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function ri(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (h, m, $) => {
    if (!h) return;
    l = Yd(e, h);
    const v = (l == null ? void 0 : l.state) ?? "";
    s = m.includes(v) ? "on" : $.includes(v) ? "off" : "no-data";
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
  const f = { look: s };
  if (o && l && (s === "on" || s === "active")) {
    const h = Ow(l);
    h !== void 0 && (f.timerSince = h);
  }
  const p = Oe(t).some((h) => h.role === "power") ? Lw(e, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (f.power = p), i === "illuminance_sensor" && (n.illuminance || n.sun) && (f.daylight = Pw(t, e)), f;
}
function Pw(t, e) {
  const n = vv(t, e);
  if (n.state === null) return d("daylight.noData");
  const i = d(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${d("daylight.bySun")}`;
}
function Qd(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: Xd(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: _t(t.power), tone: "device" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device" }), i;
}
const Nw = 1046, Jd = 1.25, Ut = 480, R = 10, j = 34, eu = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, tu = (t) => Math.floor((t - 20) / 6.6), Tw = (t) => Math.floor((t - 20) / 6), Le = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : Xd(t * 1e3), J = (t) => 14 + 18 * t;
function st(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, s) => _`<text class=${s === 0 ? "fc-t1" : s === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(s)}>${eu(i, s === 0 ? tu(t.w) : Tw(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Ii(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const fe = Nw, $e = fe / 2, Ye = 230, li = 26, ve = 4, ea = 36, Me = J(2), Hw = (fe - ve * Ye - (ve - 1) * li) / 2, ta = 200, lt = 330, nu = 40, Ze = 460, un = 8, iu = 24, fo = (fe - lt * 2 - nu) / 2, na = fo + lt + nu;
function Hn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${d("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${d("rules.unit.min")}` : i === 0 ? `${n} ${d("rules.unit.h")}` : `${n} ${d("rules.unit.h")} ${i} ${d("rules.unit.min")}`;
}
const ur = (t, e) => Le(Math.max(1, Math.ceil((t - e) / 1e3)));
function pr(t, e = !1) {
  return "light" in t ? `${d("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? d(`rules.daylight.is.${t.is}`) : "sun" in t ? d(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${d(`rules.held.${t.held.state}`)} ${Hn(t.held.seconds)}` : "rule" in t ? d("rules.src.rule") : d("rules.src.device");
}
const ia = (t) => Number.isFinite(t) ? String(t) : "?";
function zw(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function su(t, e, n) {
  return "daylight" in n ? ou(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? d("rules.flow.trueIn").replace("{t}", ur(t.until, e)) : t.detail;
}
const ou = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${ur(t.until, e)})`), ie = (t) => d(`rules.val.${t === null ? "unknown" : t}`), U = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function Vw(t) {
  if (t <= ve) {
    const i = (fe - t * Ye - (t - 1) * li) / 2;
    return Array.from({ length: t }, (s, o) => i + o * (Ye + li));
  }
  const e = t - Math.floor((t - 1) / ve) * ve, n = Math.floor((ve - e) / 2);
  return Array.from({ length: t }, (i, s) => {
    const o = s % ve;
    return Hw + (s >= t - e ? n + o : o) * (Ye + li);
  });
}
function ru(t, e, n, i) {
  const s = n ? "daylight" in t.source && n.value !== null ? `${d(n.value ? "rules.flow.open" : "rules.flow.closed")}, ${ou(n, i)}` : n.value === !0 ? d("rules.flow.open") : n.value === null ? `${d("rules.flow.closed")}, ${d("rules.val.unknown")}` : n.until !== void 0 && n.until > i ? `${d("rules.flow.closed")}, ${d("rules.flow.opensIn").replace("{t}", ur(n.until, i))}` : `${d("rules.flow.closed")}${n.detail ? `, ${n.detail}` : ""}` : pr(t.source);
  return [`${d("rules.flow.gate")}: ${t.not ? "NOT " : ""}${e}`, s];
}
function lu(t, e) {
  const n = Math.ceil(t / ve), i = Vw(t), s = (a) => R + a * (e + ea), o = (a) => s(Math.floor(a / ve)), r = (a) => s(a) + e + (a === n - 1 ? j : ea) / 2, l = [];
  i.forEach((a, c) => l.push(`M${a + Ye / 2} ${o(c) + e} V${r(Math.floor(c / ve))}`));
  for (let a = 0; a < n; a++) {
    const c = [$e, ...i.slice(a * ve, (a + 1) * ve).map((u) => u + Ye / 2)];
    Math.max(...c) > Math.min(...c) && l.push(`M${Math.min(...c)} ${r(a)} H${Math.max(...c)}`);
  }
  return { xs: i, inY: o, busY: r, bottom: t === 0 ? R - j : s(n - 1) + e, links: l };
}
function Rw(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = e.inputs.map((V, K) => {
    const W = (i == null ? void 0 : i[K].value) ?? null;
    return W === null || !V.not ? W : !W;
  }), o = i ? zw(e.combine, s) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, c = (n == null ? void 0 : n.unknownInputs) ?? 0, u = e.gate ? n == null ? void 0 : n.gate : void 0, f = e.gate ? ru(e.gate, t.inputName(e.gate), u, t.now) : [], p = d("rules.flow.delay").replace("{on}", ia(e.onDelay)).replace("{off}", ia(e.offDelay)), h = n === void 0 ? p : `${ie(r ?? null)}${l ? `, ${d("rules.flow.pending").replace("{to}", ie(l.to)).replace("{t}", Le(a))}` : ""}`, m = e.inputs.length, $ = lu(m, Me), { xs: v, inY: b } = $, y = m === 0 ? R : $.bottom + j, x = y + Me + j, M = x + Me + j, k = (e.gate ? M : x) + Me, S = k + j / 2, E = k + j, I = E + iu, N = Math.max(1, e.onTrue.length, e.onFalse.length), B = I + N * (Me + un) - un + R, D = [
    { side: "true", x: fo, list: e.onTrue, head: d("rules.whenTrue") },
    { side: "false", x: na, list: e.onFalse, head: d("rules.whenFalse") }
  ], A = [...$.links];
  m > 0 && A.push(`M${$e} ${$.busY(0)} V${y}`), A.push(`M${$e} ${y + Me} V${x}`), e.gate && A.push(`M${$e} ${x + Me} V${M}`), A.push(`M${$e} ${k} V${S} H${fo + lt / 2} V${E}`, `M${$e} ${S} H${na + lt / 2} V${E}`);
  const P = (V) => st({ ...V, h: Me, focused: t.focused === V.field, onClick: () => t.onFocus(V.target) });
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * Jd}px`} viewBox=${`0 0 ${fe} ${B}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("rules.flow.title")}>
        ${A.map((V) => _`<path class="fc-link" d=${V}></path>`)}
        ${e.inputs.map((V, K) => {
    const W = i == null ? void 0 : i[K];
    return P({
      x: v[K],
      y: b(K),
      w: Ye,
      field: `input-${K}`,
      target: { input: K },
      cls: W ? U(W.value) : "",
      lines: [`${V.not ? "NOT " : ""}${t.inputName(V)}`, W ? su(W, t.now, V.source) : pr(V.source, V.not === !0)]
    });
  })}
        ${P({
    x: (fe - ta) / 2,
    y,
    w: ta,
    field: "combine",
    target: "gate",
    cls: o === void 0 ? "" : U(o),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...o === void 0 ? [] : [ie(o)]]
  })}
        ${P({
    x: (fe - Ze) / 2,
    y: x,
    w: Ze,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : U(r ?? null),
    lines: [d("rules.flow.result"), h]
  })}
        ${e.gate ? P({
    x: (fe - Ze) / 2,
    y: M,
    w: Ze,
    field: "gate-input",
    target: "gate-input",
    cls: u ? U(u.value) : "",
    lines: f
  }) : w}
        ${D.map((V) => _`
          <text class="fc-head" text-anchor="middle" x=${V.x + lt / 2} y=${E + 14}>${V.head}</text>
          ${V.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${V.x + lt / 2} y=${I + Me / 2 + 4}>${d("rules.noActions")}</text>` : V.list.map((K, W) => P({
    x: V.x,
    y: I + W * (Me + un),
    w: lt,
    field: `action-${V.side}-${W}`,
    target: { action: V.side, index: W },
    cls: "",
    lines: [t.actionName(K.device), Bw(K.do)]
  }))}`)}
      </svg>
      ${c > 0 ? g`<p class="fc-warn">${c === 1 ? d("rules.unknown1") : d("rules.unknownN").replace("{n}", String(c))}</p>` : w}
      ${n != null && n.held ? g`<p class="fc-warn" data-note="held">${d("rules.flow.heldNote")}</p>` : w}
      ${n != null && n.last ? g`<p class="fc-last">${d("rules.flow.last")} ${cr(n.last)}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const Bw = (t) => d(`rules.act.${t}`), sa = { s: 1, min: 60, h: 3600 }, Fw = ["s", "min", "h"];
function Uw(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Ei = (t) => Number.isFinite(t) ? String(t) : "";
function oa(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const ho = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? d("rules.missingDevice") : t.ruleName(e.rule) ?? d("rules.missingRule");
};
function fr(t, e) {
  var i, s;
  const n = e.source;
  return "device" in n || "rule" in n ? ho(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? d("rules.light.noSensor") : "daylight" in n ? ((s = t.deviceById(n.daylight)) == null ? void 0 : s.name) ?? d("rules.light.noSensor") : "sun" in n ? d("rules.src.sun") : "time" in n ? d("rules.src.time") : n.held.sources.length === 0 ? d("rules.src.held") : `${d("rules.src.held")}: ${n.held.sources.map((o) => ho(t, o)).join(", ")}`;
}
const mo = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function Ww(t, e) {
  return "device" in e || "rule" in e ? mo(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => mo(t, n)) : !1;
}
function au(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function cu(t) {
  return g`
    <optgroup label=${d("rules.groupDevices")}>
      ${t.inputDevices.map((e) => g`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? g`<optgroup label=${d("rules.groupRules")}>
      ${t.otherRules.map((e) => g`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : w}`;
}
function hr(t, e, n) {
  return g`
    <option value="">${e}</option>
    ${cu(t)}
    <optgroup label=${d("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((i) => g`<option value=${i}>${d(`rules.src.${i}`)}</option>`)}
    </optgroup>
    ${n ?? w}`;
}
function jw(t, e, n, i) {
  const s = e.list, o = t.deviceById(i.device), r = o ? e.actionsFor(o) : [], l = r.includes(i.do) ? r : [...r, i.do], a = e.unique ? t.actionDevices.filter((c) => c.id === i.device || !s.some((u) => u.device === c.id)) : t.actionDevices;
  return g`
    <div class="rline" data-field=${e.field(n)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(c) => {
    const u = t.deviceById(c.target.value);
    u && e.set(s.map((f, p) => p === n ? { device: u.id, do: e.actionsFor(u).includes(f.do) ? f.do : e.firstDo(u) } : f));
  }}>
        ${o && !t.actionDevices.includes(o) ? g`<option value=${o.id}>${o.name}</option>` : w}
        ${o ? w : g`<option value=${i.device}>${d("rules.missingDevice")}</option>`}
        ${a.map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(c) => e.set(s.map((u, f) => f === n ? { ...u, do: c.target.value } : u))}>
        ${l.map((c) => g`<option value=${c}>${e.doText(c)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${d("rules.remove")} @click=${() => e.set(s.filter((c, u) => u !== n))}>&times;</button>
    </div>`;
}
function du(t, e) {
  const n = e.unique ? t.actionDevices.filter((i) => !e.list.some((s) => s.device === i.id)) : t.actionDevices;
  return g`
    <div class="rgroup">
      <div class="rlabel">${e.label}</div>
      ${e.list.map((i, s) => jw(t, e, s, i))}
      <select class="radd" data-action=${e.add} data-field=${e.addField ?? w} .value=${""}
        @change=${(i) => {
    const s = i.target, o = t.deviceById(s.value);
    s.value = "", o && e.actionsFor(o).length > 0 && e.set([...e.list, { device: o.id, do: e.firstDo(o) }]);
  }}>
        <option value="">${e.addText}</option>
        ${n.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
      </select>
    </div>`;
}
function ra(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return du(t, {
    label: d(e === "true" ? "rules.whenTrue" : "rules.whenFalse"),
    addText: d("rules.addAction"),
    add: `add-action-${e}`,
    field: (s) => Ii({ action: e, index: s }),
    list: n[i],
    set: (s) => t.onChange({ ...n, [i]: s }),
    actionsFor: ce,
    firstDo: (s) => ce(s)[0],
    doText: (s) => d(`rules.act.${s}`)
  });
}
const Ls = (t) => t.trim() === "" ? NaN : Number(t);
function la(t, e, n, i) {
  var s;
  return g`<select data-part=${e} data-value=${n} @change=${(o) => i(o.target.value)}>
    ${t.lightSensors.some((o) => o.id === n) ? w : g`<option value=${n}>${((s = t.deviceById(n)) == null ? void 0 : s.name) ?? d("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((o) => g`<option value=${o.id}>${o.name}</option>`)}
  </select>`;
}
const qw = ["night", "dark", "day"];
function Zw(t, e, n, i) {
  var s;
  if ("daylight" in n)
    return g`
      <div class="rparams">
        <label class="grow">${d("rules.daylight.sensor")} ${la(t, "daylight", n.daylight, (o) => i({ ...n, daylight: o }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(o) => i({ ...n, is: o.target.value })}>
          ${qw.map((o) => g`<option value=${o}>${d(`rules.daylight.is.${o}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const o = n.light === "" ? void 0 : t.lightUnit(n.light);
    return g`
      <div class="rparams">
        <label class="grow">${d("rules.light.sensor")}
          ${la(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${d("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Ei(n.below)}
            @input=${(r) => i({ ...n, below: Ls(r.target.value) })} /> lx</label>
        <label>${d("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Ei(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: Ls(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${d("rules.light.unknownDark")}</label>
        ${o !== void 0 && o !== "lx" ? g`<p class="rwarn" data-warn="light-unit">${d("rules.light.unit").replace("{unit}", o)}</p>` : w}
      </div>`;
  }
  if ("time" in n)
    return g`
      <div class="rparams">
        <label>${d("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(o) => i({ time: { ...n.time, from: o.target.value } })} /></label>
        <label>${d("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(o) => i({ time: { ...n.time, to: o.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const o = n.held, r = ((s = t.draft.units) == null ? void 0 : s[e]) ?? Uw(o.seconds), l = Number.isFinite(o.seconds) ? String(+(o.seconds / sa[r]).toFixed(4)) : "", a = (c) => i({ held: { ...o, ...c } });
    return g`
      <div class="rparams">
        <div class="rsources">
          ${o.sources.length === 0 ? g`<span class="muted">${d("rules.held.noSources")}</span>` : w}
          ${o.sources.map((c, u) => g`
            <span class="rchip${mo(t, c) ? " bad" : ""}" data-part="source">${ho(t, c)}
              <button class="btn" data-action="remove-source" title=${d("rules.held.removeSource")}
                @click=${() => a({ sources: o.sources.filter((f, p) => p !== u) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(c) => {
      const u = c.target, f = au(t, u.value);
      u.value = "", f && ("device" in f || "rule" in f) && a({ sources: [...o.sources, f] });
    }}>
            <option value="">${d("rules.held.addSource")}</option>
            ${cu(t)}
          </select>
        </div>
        <label>${d("rules.held.state")}
          <select data-part="state" data-value=${o.state}
            @change=${(c) => a({ state: c.target.value })}>
            ${["on", "off", "any"].map((c) => g`<option value=${c}>${d(`rules.held.${c}`)}</option>`)}
          </select></label>
        <label>${d("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(c) => {
      var u;
      ((u = t.draft.units) == null ? void 0 : u[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(Ls(c.target.value) * sa[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(c) => t.onUnit(e, c.target.value)}>
            ${Fw.map((c) => g`<option value=${c}>${d(`rules.unit.${c}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return w;
}
function mr(t, e, n, i, s) {
  const o = e.source, r = !("device" in o || "rule" in o), l = "light" in o ? "light" : "daylight" in o ? "daylight" : "sun" in o ? "sun" : "time" in o ? "time" : "held";
  return g`
    <div class="rline${Ww(t, o) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${r ? d(`rules.src.${l}`) : fr(t, e)}${"sun" in o ? g` <span class="muted">${e.not ? d("rules.sun.above") : pr(o)}</span>` : w}</span>
      ${s ?? w}
      ${"daylight" in o && !e.not ? w : g`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(a) => {
    const c = a.target.checked, { not: u, ...f } = e;
    i(c ? { ...f, not: !0 } : f);
  }} /> ${d("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${d("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${Zw(t, n, o, (a) => i({ ...e, source: a }))}
    </div>`;
}
const gr = (t, e) => (n) => {
  const i = n.target, s = i.value ? au(t, i.value) : null;
  i.value = "", s && e(s);
};
function uu(t, e, n, i = d("rules.gate.hint")) {
  const s = t.draft.rule, o = (r) => {
    const { gate: l, ...a } = s;
    t.onChange(r ? { ...a, gate: r } : a);
  };
  return g`
      <div class="rgroup">
        <div class="rlabel">${e}</div>
        <p class="muted">${i}</p>
        ${s.gate ? mr(t, s.gate, n, o) : g`<select class="radd" data-action="set-gate" .value=${""} @change=${gr(t, (r) => o({ source: r }))}>
            ${hr(t, d("rules.gate.set"))}
          </select>`}
      </div>`;
}
function pu(t) {
  const e = t.draft.rule;
  return g`
      <label class="rlabel" for="rule-name">${d("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${d("rules.namePlaceholder")}
        @input=${(n) => t.onChange({ ...e, name: n.target.value })} />`;
}
function Gw(t) {
  const e = t.draft.rule;
  return g`
    <div class="rsettings">
      ${pu(t)}

      <label class="rlabel" for="rule-combine">${d("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(n) => t.onChange({ ...e, combine: n.target.value === "all" ? "all" : "any" })}>
        <option value="any">${d("rules.combine.any")}</option>
        <option value="all">${d("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${d("rules.inputs")}</div>
        ${e.inputs.length === 0 ? g`<p class="muted">${d("rules.noInputs")}</p>` : e.inputs.map((n, i) => mr(
    t,
    n,
    Ii({ input: i }),
    (s) => t.onChange({ ...e, inputs: s ? e.inputs.map((o, r) => r === i ? s : o) : e.inputs.filter((o, r) => r !== i) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${gr(t, (n) => t.onChange({ ...e, inputs: [...e.inputs, { source: n }] }))}>
          ${hr(t, d("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${d("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${d("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${ro} step="1" .value=${Ei(e.onDelay)}
              @input=${(n) => t.onChange({ ...e, onDelay: oa(n.target.value) })} /></label>
          <label class="grow">${d("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${ro} step="1" .value=${Ei(e.offDelay)}
              @input=${(n) => t.onChange({ ...e, offDelay: oa(n.target.value) })} /></label>
        </div>
      </div>

      ${uu(t, d("rules.gate"), Ii("gate-input"))}

      ${ra(t, "true")}
      ${ra(t, "false")}
    </div>`;
}
function Kw(t) {
  const e = t.draft.rule, n = (i) => t.onFocus(Ii(i));
  return fu({
    title: d(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t.problems.map((i) => ({ key: i, text: d(`rules.problem.${i}`) })),
    form: Gw(t),
    diagram: Rw({
      rule: e,
      inputName: (i) => fr(t, i),
      actionName: (i) => {
        var s;
        return ((s = t.deviceById(i)) == null ? void 0 : s.name) ?? d("rules.missingDevice");
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
function fu(t) {
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
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : w}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${d("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${d("rules.zone.none")}</option>
            ${n ? w : g`<option value=${e.zoneId}>${d("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: s, ...o } = e;
    t.onChange(i.target.checked ? o : { ...o, enabled: !1 });
  }} /> ${d("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${d("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${d("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Ht = Ut, br = 20, St = Ht - 2 * R, pn = (St - br) / 2, go = (Ht - pn * 2 - br) / 2, aa = go + pn + br, Os = (Ht - St) / 2, Ps = Ht / 2, Ns = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), ca = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", Xw = (t) => `${t > 0 ? "+" : ""}${t} %`, Jt = (t, e) => st({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function da(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${Ns(n.t)} °C` : "", n.rh !== null ? `${Ns(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${Ns(n.ah)} g/m³` : "—"];
}
function Yw(t) {
  var V, K, W;
  const e = t.rule, n = e.vent, i = t.trace, s = i == null ? void 0 : i.inputs[0], o = s == null ? void 0 : s.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((V = e.onTrue[0]) == null ? void 0 : V.device) ?? "", c = da(r, d("vent.sensor"), o == null ? void 0 : o.a), u = da(l, d("vent.than"), o == null ? void 0 : o.b), f = J(Math.max(c.length, u.length)), p = d("vent.flow.vs").replace("{a}", r).replace("{b}", l), h = o ? `: ${o.pct === null ? ie(null) : Xw(o.pct)}` : s ? `: ${s.detail}` : "", m = o ? `${eu(p, tu(St) - h.length)}${h}` : `${p}${h}`, $ = d("vent.flow.margins").replace("{above}", ca(n.above)).replace("{below}", ca(n.below)), v = i == null ? void 0 : i.pending, b = v ? Math.max(0, Math.ceil((v.at - t.now) / 1e3)) : 0, y = d("vent.flow.runon").replace("{t}", Hn(e.offDelay)), x = [
    i ? `${d("rules.flow.result")}: ${ie(i.verdict)}` : d("rules.flow.result"),
    v ? `${y} (${d("vent.pending").replace("{to}", v.to ? "on" : "off").replace("{t}", Le(b))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((K = e.onTrue[0]) == null ? void 0 : K.do) ?? "?"} / ${((W = e.onFalse[0]) == null ? void 0 : W.do) ?? "?"}`,
    ...M ? [dr(M)] : []
  ], S = M == null ? void 0 : M.error, E = J(k.length + (S ? 1 : 0)), I = R + f + j, N = I + J(2) + j, B = N + J(2) + j, D = B + E + R, A = (pe) => _`<path class="fc-link" d=${`M${pe + pn / 2} ${R + f} V${I - j / 2} H${Ps} V${I}`}></path>`, P = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${d("rules.status.error")}: ${i.reason}` : d(`rules.status.${i.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ht}px`} viewBox=${`0 0 ${Ht} ${D}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("vent.flow.title")}>
        ${A(go)}${A(aa)}
        <path class="fc-link" d=${`M${Ps} ${I + J(2)} V${N} M${Ps} ${N + J(2)} V${B}`}></path>
        ${Jt(t, { x: go, y: R, w: pn, h: f, field: "vent-sensor", cls: o != null && o.a.why ? " nodata" : "", lines: c })}
        ${Jt(t, { x: aa, y: R, w: pn, h: f, field: "vent-than", cls: o != null && o.b.why ? " nodata" : "", lines: u })}
        ${Jt(t, { x: Os, y: I, w: St, h: J(2), field: "vent-above", cls: s ? U(s.value) : "", lines: [m, $], tip: `${p}${h}
${$}` })}
        ${Jt(t, { x: Os, y: N, w: St, h: J(2), field: "vent-runon", cls: i ? U(i.verdict) : "", lines: x })}
        ${Jt(t, { x: Os, y: B, w: St, h: E, field: "vent-fan", cls: "", lines: k, err: S })}
      </svg>
      ${P ? g`<p class="fc-warn" data-note="status">${P}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
function Wt(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return g`
    <div class="backdrop rule-backdrop" @change=${(i) => i.stopPropagation()}>
      <div class="dialog rdlg pdlg" role="dialog" aria-modal="true" aria-label=${t.title}>
        <h3>${t.title}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${t.hint}</p>
            <label class="rlabel" for=${`${t.prefix}-name`}>${d("rules.name")}</label>
            <input id=${`${t.prefix}-name`} data-field="name" type="text" .value=${e.name} placeholder=${d("rules.namePlaceholder")}
              @input=${(i) => t.onChange({ ...e, name: i.target.value })} />
            ${t.form}
          </div>
          ${t.diagram}
        </div>
        ${t.texts.length > 0 ? g`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : w}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${d("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${d("rules.zone.none")}</option>
            ${n ? w : g`<option value=${e.zoneId}>${d("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: s, ...o } = e;
    t.onChange(i.target.checked ? o : { ...o, enabled: !1 });
  }} /> ${d("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${d("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${d("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Ts = (t) => t.trim() === "" ? NaN : Number(t), Hs = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function zs(t, e, n, i, s) {
  var r;
  const o = n === "" || i.some((l) => l.id === n);
  return g`
    <select data-field=${e} data-value=${n} @change=${(l) => s(l.target.value)}>
      <option value="">${d("vent.pick")}</option>
      ${o ? w : g`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? d("rules.missingDevice")}</option>`}
      ${i.map((l) => g`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function Qw(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: d("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: d("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: d("vent.problem.fan") });
  const s = [...i], o = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((c) => !!c);
  for (const c of t.problems)
    c === "device-missing" && !o.some((u) => !t.deviceById(u)) && !(n.sensor && !t.climateSensors.some((u) => u.id === n.sensor)) && !(n.than && !t.climateSensors.some((u) => u.id === n.than)) || c === "vent" && i.length > 0 || s.push({ key: c, text: d(c === "delay" ? "vent.problem.runon" : `rules.problem.${c}`) });
  return s;
}
function Jw(t) {
  var o;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), s = ((o = e.onTrue[0]) == null ? void 0 : o.device) ?? "";
  return Wt({
    prefix: "vent",
    title: d("vent.title"),
    hint: d("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Qw(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("vent.sensor")}</label>
      ${zs(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${d("vent.than")}</label>
      ${zs(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${d("vent.fan")}</label>
      ${zs(t, "vent-fan", s, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${d("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${X(Hs(n.above))}
            @input=${(r) => i({ above: Ts(r.target.value) })} /></label>
        <label>${d("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${X(Hs(n.below))}
            @input=${(r) => i({ below: Ts(r.target.value) })} /></label>
        <label>${d("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${X(Hs(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(Ts(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: Yw({
      rule: e,
      deviceName: (r) => {
        var l;
        return r === "" ? d("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? d("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const e$ = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, Di = Ut, t$ = Di - 2 * R, n$ = R, i$ = Di / 2, ua = (t) => t === null ? ie(null) : `${Math.round(t)} W`, Xn = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function s$(t, e) {
  const n = t.until !== void 0 ? Le(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? d("boiler.phase.heatingCheck").replace("{t}", n) : d("boiler.phase.heating");
    case "waiting":
      return d("boiler.phase.waiting").replace("{t}", n ?? Le(0));
    case "blackout":
    case "limit":
    case "done":
      return d(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function o$(t) {
  return t.phase === "heating" ? U(!0) : t.phase !== null ? U(!1) : U(t.relay === null ? null : t.relay === "on");
}
function r$(t) {
  const n = t.rule.boiler, i = n.grid, s = t.trace, o = s == null ? void 0 : s.boiler, r = t.deviceName(n.device), l = [];
  let a = R;
  const c = (v, b, y, x) => {
    const M = J(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: v, cls: b, lines: y, err: x }), a += M + j;
  };
  if (i) {
    c("boiler-grid", o && o.grid === null ? U(null) : "", [t.gridName(i.block), o ? ua(o.grid) : d("boiler.flow.gridPower")]);
    const v = d("boiler.flow.formula").replace("{nominal}", Xn(i.nominal)), b = o && o.headroom !== null ? o.headroom > i.limit : null;
    c("boiler-limit", o ? U(b === null ? null : !b) : "", [
      o ? `${d("boiler.flow.headroom")}: ${b === null ? ie(null) : d(b ? "boiler.flow.over" : "boiler.flow.ok")}` : d("boiler.flow.headroom"),
      o && o.headroom !== null ? `${v} = ${Math.round(o.headroom)} / ${Xn(i.limit)} W` : `${v} ≤ ${Xn(i.limit)} W`
    ]);
  }
  c("boiler-button", o ? U(o.mode === "auto") : "", [
    o ? `${d("boiler.flow.mode")}: ${d(`boiler.mode.${o.mode}`)}` : d("boiler.flow.mode"),
    d("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const u = o ? s$(o, t.now) : null, f = s == null ? void 0 : s.last;
  c("boiler-relay", o ? o$(o) : "", [
    o ? `${d("boiler.flow.relay")}: ${o.relay ?? ie(null)}` : d("boiler.flow.relay"),
    r,
    ...u ? [u] : [],
    ...f ? [dr(f)] : []
  ], f == null ? void 0 : f.error);
  const p = d("boiler.flow.done");
  c(i ? "boiler-nominal" : "boiler-power", o ? U(o.boilerW === null ? null : o.boilerW > 1) : "", [
    o ? `${d("boiler.flow.power")}: ${ua(o.boilerW)}` : d("boiler.flow.power"),
    i ? `${d("boiler.flow.nominal").replace("{w}", Xn(i.nominal))}, ${p}` : p
  ]);
  const h = a - j + R, m = l.slice(1).map((v) => `M${i$} ${v.y - j} V${v.y}`).join(" "), $ = s && s.status !== "ok" ? s.status === "error" && s.reason ? `${d("rules.status.error")}: ${s.reason}` : d(`rules.status.${s.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Di}px`} viewBox=${`0 0 ${Di} ${h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((v) => st({ x: n$, w: t$, ...v, focused: t.focused === v.field, onClick: () => t.onFocus(v.field) }))}
      </svg>
      ${$ ? g`<p class="fc-warn" data-note="status">${$}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const pa = (t) => t.trim() === "" ? NaN : Number(t), fa = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Vs(t, e, n, i, s) {
  const o = e === "" || n.some((r) => r.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(r) => s(r.target.value)}>
      <option value="">${d("vent.pick")}</option>
      ${o ? w : g`<option value=${e}>${i}</option>`}
      ${n.map((r) => g`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function l$(t) {
  var o;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: d("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: d("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: d("boiler.problem.grid") });
  const i = [...n], s = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((o = e.grid) == null ? void 0 : o.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !s || r === "boiler" && n.length > 0 || i.push({ key: r, text: d(`rules.problem.${r}`) });
  return i;
}
function a$(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, s = (c) => t.onChange({ ...e, boiler: c }), o = (c) => i && s({ ...n, grid: { ...i, ...c } }), r = (c) => {
    const { grid: u, ...f } = n;
    s(c ? { ...f, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Ed, nominal: Dd } } : f);
  }, l = (c) => {
    var u;
    return ((u = t.deviceById(c)) == null ? void 0 : u.name) ?? d("rules.missingDevice");
  }, a = (c) => {
    var u;
    return c === "" ? d("vent.pick") : ((u = t.deviceById(c)) == null ? void 0 : u.name) ?? d("rules.missingDevice");
  };
  return Wt({
    prefix: "boiler",
    title: d("boiler.title"),
    hint: d("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: l$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("boiler.device")}</label>
      ${Vs("boiler-device", n.device, t.boilers, l(n.device), (c) => s({ ...n, device: c }))}

      <label class="rlabel">${d("boiler.button")}</label>
      ${Vs("boiler-button", n.button, t.buttons, l(n.button), (c) => s({ ...n, button: c }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(c) => r(c.target.checked)} /> ${d("boiler.limitOn")}</label>
      ${i ? g`
        <label class="rlabel">${d("boiler.grid")}</label>
        ${Vs("boiler-grid", i.block, t.grids, d("boiler.missingGrid"), (c) => o({ block: c }))}
        <div class="vnums">
          <label>${d("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${X(fa(i.limit))}
              @input=${(c) => o({ limit: pa(c.target.value) })} /></label>
          <label>${d("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${X(fa(i.nominal))}
              @input=${(c) => o({ nominal: pa(c.target.value) })} /></label>
        </div>` : w}`,
    diagram: r$({
      rule: e,
      deviceName: a,
      gridName: (c) => {
        var u;
        return c === "" ? d("vent.pick") : ((u = t.grids.find((f) => f.id === c)) == null ? void 0 : u.name) ?? d("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Li = Ut, Ge = 2, hu = 20, fn = 24, ha = 220, hn = (Li - 2 * R - (Ge - 1) * hu) / Ge, mn = Li / 2;
function c$(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const d$ = (t, e) => t === 1 ? mn - hn / 2 : R + e % Ge * (hn + hu);
function ma(t, e, n, i) {
  const s = J(Math.max(...e.map((u) => u.lines.length + (u.err ? 1 : 0)))), o = Math.ceil(e.length / Ge), r = (u) => t + u * (s + fn), l = e.map((u, f) => ({ ...u, x: d$(e.length, f), y: r(Math.floor(f / Ge)), w: hn, h: s })), a = (u) => n ? r(u) + s + (u === o - 1 ? j : fn) / 2 : r(u) - (u === 0 ? j : fn) / 2, c = [];
  for (let u = 0; u < o; u++) {
    const f = l.slice(u * Ge, (u + 1) * Ge);
    for (const h of f) c.push(`M${h.x + hn / 2} ${n ? h.y + s : h.y} V${a(u)}`);
    const p = [mn, ...f.map((h) => h.x + hn / 2)];
    Math.max(...p) > Math.min(...p) && c.push(`M${Math.min(...p)} ${a(u)} H${Math.max(...p)}`);
  }
  return c.push(n ? `M${mn} ${a(0)} V${i}` : `M${mn} ${i} V${a(o - 1)}`), { blocks: l, bottom: r(o - 1) + s, links: c.join(" ") };
}
function u$(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, s = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [d("leak.flow.addSensor")] }] : e.sensors.map((y, x) => {
    const M = n == null ? void 0 : n.inputs[x];
    return { field: `leak-sensor:${y}`, cls: M ? U(M.value) : "", lines: [t.deviceName(y), M ? M.detail : d("device.leak_sensor")] };
  }), o = (y) => {
    var x, M;
    return ((M = (x = n == null ? void 0 : n.leak) == null ? void 0 : x.valves.find((k) => k.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => o(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [d("leak.flow.addValve")] }] : e.valves.map((y) => {
    var I;
    const x = (I = n == null ? void 0 : n.leak) == null ? void 0 : I.valves.find((N) => N.id === y), M = t.deviceName(y), k = (x == null ? void 0 : x.state) ?? null, S = y === r ? i : void 0, E = S ? (S.reason === "re-closed: leak" ? d("leak.flow.reclosed") : d("vent.flow.last").replace("{did}", d(`rules.did.${S.action}`))).replace("{at}", Ce(S.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? k === "closed" ? U(!0) : k === "open" ? "" : U(null) : "",
      lines: [M, n ? k === null ? ie(null) : d(`leak.state.${k}`) : d("leak.flow.close"), ...E ? [E] : []],
      err: S == null ? void 0 : S.error
    };
  }), a = J(2), c = J(Math.max(...s.map((y) => y.lines.length))), u = R + Math.ceil(s.length / Ge) * (c + fn) - fn + j, f = ma(R, s, !0, u), p = ma(u + a + j, l, !1, u + a), h = {
    x: mn - ha / 2,
    y: u,
    w: ha,
    h: a,
    field: "leak",
    cls: n ? U(n.verdict) : "",
    lines: [n ? `${d("leak.flow.leak")}: ${n.verdict === null ? ie(null) : d(n.verdict ? "leak.yes" : "leak.no")}` : d("leak.flow.leak"), d("leak.flow.any")]
  }, m = p.bottom + R, $ = `${f.links} ${p.links}`, v = (y) => st({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), b = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${d("rules.status.error")}: ${n.reason}` : d(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Li}px`} viewBox=${`0 0 ${Li} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("leak.flow.title")}>
        ${_`<path class="fc-link" d=${$}></path>`}
        ${f.blocks.map(v)}${v(h)}${p.blocks.map(v)}
      </svg>
      ${b ? g`<p class="fc-warn" data-note="status">${b}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
function ga(t, e, n, i, s, o, r) {
  const l = (c) => {
    var u;
    return ((u = t.deviceById(c)) == null ? void 0 : u.name) ?? d("rules.missingDevice");
  }, a = t.draft.focused;
  return g`
    <div class="rsources" data-group=${e}>
      ${i.map((c) => g`
        <span class="rchip${s.some((u) => u.id === c) ? "" : " bad"}${a === `${n}:${c}` ? " hl" : ""}"
          data-id=${c}>${l(c)}
          <button class="btn" data-action="remove" title=${d("leak.remove")}
            @click=${() => r(i.filter((u) => u !== c))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(c) => {
    const u = c.target, f = u.value;
    u.value = "", f && r([...i, f]);
  }}>
        <option value="">${o}</option>
        ${s.filter((c) => !i.includes(c.id)).map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
    </div>`;
}
function p$(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: d("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: d("leak.problem.valves") });
  const i = [...n];
  for (const s of t.problems)
    s === "leak" && n.length > 0 || i.push({ key: s, text: d(`rules.problem.${s}`) });
  return i;
}
function f$(t) {
  const e = t.draft.rule, n = e.leak;
  return Wt({
    prefix: "leak",
    title: d("leak.title"),
    hint: d("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: p$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("leak.sensors")}</label>
      ${ga(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, d("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${d("leak.valves")}</label>
      ${ga(t, "leak-valves", "leak-valve", n.valves, t.valves, d("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: u$({
      rule: e,
      deviceName: (i) => {
        var s;
        return ((s = t.deviceById(i)) == null ? void 0 : s.name) ?? d("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Oi = Ut, h$ = Oi - 2 * R, m$ = Oi / 2;
function g$(t) {
  const e = Ce(t.at);
  return Tn(t) ? d("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === Wd ? d("timed.flow.elsewhere") : d("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : d("timed.flow.last").replace("{did}", d(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function b$(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, s = [];
  let o = R;
  const r = (h, m, $, v) => {
    const b = J($.length + (v ? 1 : 0));
    s.push({ y: o, h: b, field: h, cls: m, lines: $, err: v }), o += b + j;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? d("timed.flow.events")]);
  const l = d(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Hn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? d("timed.flow.running").replace("{t}", Le(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : d("timed.flow.runningNow") : d("timed.flow.idle") : d("timed.flow.run");
  r("timed-minutes", i ? U(i.running) : n ? U(n.verdict) : "", [a, l]);
  const c = n == null ? void 0 : n.last;
  r("timed-device", i ? U(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? d("timed.flow.state").replace("{s}", i.device ?? ie(null)) : d(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...c ? [g$(c)] : []
  ], c == null ? void 0 : c.error);
  const u = o - j + R, f = s.slice(1).map((h) => `M${m$} ${h.y - j} V${h.y}`).join(" "), p = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${d("rules.status.error")}: ${n.reason}` : d(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Oi}px`} viewBox=${`0 0 ${Oi} ${u}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("timed.flow.title")}>
        <path class="fc-link" d=${f}></path>
        ${s.map((h) => st({ x: R, w: h$, ...h, focused: t.focused === h.field, onClick: () => t.onFocus(h.field) }))}
      </svg>
      ${p ? g`<p class="fc-warn" data-note="status">${p}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const ba = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function v$(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? d("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${d("timed.events.start").replace("{e}", ba(e.on))}, ${e.separateOff ? d("timed.events.stop").replace("{e}", ba(e.off)) : d("timed.events.noStop")}`;
}
const w$ = (t) => t.trim() === "" ? NaN : Number(t);
function va(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${d("vent.pick")}</option>
      ${s ? w : g`<option value=${e}>${d("rules.missingDevice")}</option>`}
      ${n.map((o) => g`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function $$(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: d("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: d("timed.problem.device") });
  const i = [...n], s = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), o = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !s || r === "timed" && n.length > 0 && o || i.push({ key: r, text: d(`rules.problem.${r}`) });
  return i;
}
function y$(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), s = v$(t.deviceById(n.button)), o = (r) => {
    var l;
    return r === "" ? d("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? d("rules.missingDevice");
  };
  return Wt({
    prefix: "timed",
    title: d("timed.title"),
    hint: d("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: $$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("timed.button")}</label>
      ${va("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${s ? g`<p class="muted" data-note="events">${s}</p>` : w}

      <label class="rlabel">${d("timed.device")}</label>
      ${va("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${d("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${X(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: w$(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${d("timed.invert")}</label>`,
    diagram: b$({
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
const x$ = { "outside-wants": "outside-sensor" }, Pi = Ut, tn = Pi - 2 * R, Rs = Pi / 2, ai = 16, k$ = { 1: [tn], 2: [(tn - ai) / 2, (tn - ai) / 2], 3: [176, 116, tn - 176 - 116 - 2 * ai] }, bo = (t, e) => t !== void 0 ? Le(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function M$(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), s = i ? i[1] : t.detail, o = t.daylight === null && s === d("daylight.noData") ? [] : [s];
  return i && o.push(`${i[2]} in ${bo(t.until, n) ?? Le(0)}`), t.daylight === null && e && o.push(d("outside.flow.countsNight")), o;
}
function mu(t) {
  const e = Ce(t.at);
  return Tn(t) ? d("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : jd(t) ? d("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? d("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : d("timed.flow.last").replace("{did}", d(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function _$(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, s = e.window, o = [{
    field: "outside-sensor",
    cls: i ? U(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${d("outside.flow.daylight")}: ${d(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...M$(i, e.noDataNight === !0, t.now)] : [d("outside.flow.daylight"), t.deviceName(e.sensor), d(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && o.push({
    field: "outside-sunset",
    cls: i ? U(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${d("outside.flow.sun")}: ${i.sun === null ? ie(null) : d(`outside.sun.${i.sun}`)}` : d("outside.flow.sun"), d("outside.flow.afterSunset")]
  }), s) {
    const I = `${s.from}-${s.to}`, N = i && i.window !== null ? bo(i.windowUntil, t.now) : null;
    o.push({
      field: "outside-window",
      cls: i ? U(i.window) : "",
      lines: i ? [
        i.window === null ? `${d("outside.flow.window")}: ${ie(null)}` : d(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        I,
        ...N ? [d(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", N)] : []
      ] : [d("outside.flow.window"), I]
    });
  }
  const r = [], l = k$[o.length], a = J(Math.max(...o.map((I) => I.lines.length)));
  let c = R;
  for (const [I, N] of o.entries())
    r.push({ ...N, x: c, y: R, w: l[I], h: a }), c += l[I] + ai;
  let u = R + a + j;
  const f = (I) => {
    const N = J(I.lines.length + (I.err ? 1 : 0));
    r.push({ ...I, x: R, y: u, w: tn, h: N }), u += N + j;
  }, p = d("outside.flow.rule").replace("{sun}", e.afterSunset ? d("outside.flow.ruleSun") : "").replace("{window}", s ? d("outside.flow.ruleWindow") : "");
  f({
    field: "outside-wants",
    cls: n ? U(n.verdict) : "",
    lines: [n ? `${d("outside.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : d("outside.flow.wants"), p]
  });
  const h = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? bo(i.pausedUntil, t.now) : null;
  f(e.pause === 0 ? { field: "outside-pause", cls: i ? U(!0) : "", lines: [d("outside.flow.never"), d("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? U(h === null) : "",
    lines: [
      i ? h !== null ? d("outside.flow.paused").replace("{t}", h) : d("outside.flow.noPause") : d("outside.flow.pause"),
      d("outside.flow.after").replace("{d}", Hn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, $ = [
    t.deviceName(e.light),
    i ? d("timed.flow.state").replace("{s}", i.light ?? ie(null)) : d("outside.flow.onOff"),
    ...m ? [mu(m)] : []
  ];
  f({
    field: "outside-light",
    cls: i ? U(i.light === null ? null : i.light === "on") : "",
    lines: $,
    err: m == null ? void 0 : m.error,
    tip: m ? [...$, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const v = u - j + R, b = r.find((I) => I.field === "outside-wants"), y = R + a + j / 2, x = r.slice(0, o.length), M = [Rs, ...x.map((I) => I.x + I.w / 2)], k = [
    ...x.map((I) => `M${I.x + I.w / 2} ${R + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${Rs} ${y} V${b.y}`,
    ...r.slice(o.length + 1).map((I) => `M${Rs} ${I.y - j} V${I.y}`)
  ].join(" "), S = (I) => st({ ...I, focused: t.focused === I.field, onClick: () => t.onFocus(I.field) }), E = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${d("rules.status.error")}: ${n.reason}` : d(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Pi}px`} viewBox=${`0 0 ${Pi} ${v}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("outside.flow.title")}>
        ${_`<path class="fc-link" d=${k}></path>`}
        ${r.map(S)}
      </svg>
      ${E ? g`<p class="fc-warn" data-note="status">${E}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const S$ = { from: "17:00", to: "01:00" }, gu = (t) => t.trim() === "" ? NaN : Number(t);
function Ni(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${d("vent.pick")}</option>
      ${s ? w : g`<option value=${e}>${d("rules.missingDevice")}</option>`}
      ${n.map((o) => g`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function wa(t, e, n, i, s) {
  return g`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(o) => {
    const { [e]: r, ...l } = n;
    s(o.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function A$(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: d("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: d("outside.problem.sensor") });
  const i = [...n], s = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), o = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !s || l === "outside" && n.length > 0 && o && r || i.push({ key: l, text: d(`rules.problem.${l}`) });
  return i;
}
function C$(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), s = n.window, o = (r) => {
    var l;
    return r === "" ? d("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? d("rules.missingDevice");
  };
  return Wt({
    prefix: "outside",
    title: d("outside.title"),
    hint: d("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: A$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("outside.light")}</label>
      ${Ni("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${d("outside.sensor")}</label>
      ${Ni("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${wa("outside-nodata", "noDataNight", n, d("outside.noDataNight"), i)}
      ${wa("outside-sunset", "afterSunset", n, d("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${s !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...S$ } } : a);
    }} /> ${d("outside.window")}</label>
      ${s ? g`
        <div class="vnums">
          <label>${d("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${X(s.from)}
              @input=${(r) => i({ ...n, window: { ...s, from: r.target.value } })} /></label>
          <label>${d("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${X(s.to)}
              @input=${(r) => i({ ...n, window: { ...s, to: r.target.value } })} /></label>
        </div>` : w}

      <div class="vnums">
        <label>${d("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${X(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: gu(r.target.value) })} /></label>
        <span class="muted">${d("outside.pauseNote")}</span>
      </div>`,
    diagram: _$({
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
const I$ = { "beurer-wants": "beurer-above" }, Ti = Ut, E$ = Ti - 2 * R, D$ = Ti / 2, Yn = (t, e) => Le(Math.max(0, Math.ceil((t - e) / 1e3)));
function L$(t) {
  var b;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, s = [];
  let o = R;
  const r = (y, x, M, k, S) => {
    const E = J(M.length + (k ? 1 : 0));
    s.push({ y: o, h: E, field: y, cls: x, lines: M, err: k, tip: S }), o += E + j;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? d("beurer.flow.kept").replace("{t}", Yn(i.keptUntil, t.now)) : d("beurer.flow.noData") : d("beurer.source");
  r(
    "beurer-source",
    i ? U(i.watts !== null ? i.watts > e.above : l ? ((b = n.inputs[0]) == null ? void 0 : b.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const c = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? U(n.verdict) : "", [
    n ? `${d("beurer.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : d("beurer.flow.wants"),
    d("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", Le(t.rule.offDelay)),
    ...c ? [d("rules.flow.pending").replace("{to}", c.to ? "on" : "off").replace("{t}", Yn(c.at, t.now))] : []
  ]);
  const u = (n == null ? void 0 : n.verdict) === !0, f = e.every === 0 ? d("beurer.flow.never") : i && !u ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? d("beurer.flow.now").replace("{t}", Yn(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? d("beurer.flow.next").replace("{t}", Yn(i.cycleAt, t.now)) : i && u && i.heater === "on" && !i.fresh ? d("beurer.flow.due") : i ? "—" : Hn(e.every * 60);
  r("beurer-every", i ? U(i.pausedUntil !== void 0 ? !1 : u ? !0 : null) : "", [d("beurer.flow.repower"), f]);
  const p = n == null ? void 0 : n.last, h = [
    t.deviceName(e.heater),
    i ? d("timed.flow.state").replace("{s}", i.heater ?? ie(null)) : d("outside.flow.onOff"),
    ...p ? [mu(p)] : []
  ];
  r(
    "beurer-heater",
    i ? U(i.heater === null ? null : i.heater === "on") : "",
    h,
    p == null ? void 0 : p.error,
    p ? [...h, ...p.error ? [p.error] : [], p.reason].join(`
`) : void 0
  );
  const m = o - j + R, $ = s.slice(1).map((y) => `M${D$} ${y.y - j} V${y.y}`).join(" "), v = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${d("rules.status.error")}: ${n.reason}` : d(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ti}px`} viewBox=${`0 0 ${Ti} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("beurer.flow.title")}>
        ${_`<path class="fc-link" d=${$}></path>`}
        ${s.map((y) => st({ x: R, w: E$, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${v ? g`<p class="fc-warn" data-note="status">${v}</p>` : w}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
function O$(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: d("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: d("beurer.problem.source") });
  const s = [...i], o = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !o || l === "beurer" && i.length > 0 && r || s.push({ key: l, text: d(`rules.problem.${l}`) });
  return s;
}
function P$(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), s = (r) => {
    var l;
    return r === "" ? d("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? d("rules.missingDevice");
  }, o = (r, l, a, c, u, f, p) => g`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${c} max=${u} step="1"
          .value=${X(Number.isFinite(a) ? String(a) : "")}
          @input=${(h) => f(gu(h.target.value))} /></label>
      ${p ? g`<span class="muted">${p}</span>` : ""}
    </div>`;
  return Wt({
    prefix: "beurer",
    title: d("beurer.title"),
    hint: d("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: O$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${d("beurer.heater")}</label>
      ${Ni("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${d("beurer.source")}</label>
      ${Ni("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${o("above", d("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${o("off", d("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${o("keep", d("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${o("every", d("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), d("beurer.everyNote"))}`,
    diagram: L$({
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
function N$(t) {
  return t === "event" ? "control-source-0" : `control-${t.endsWith(":empty") ? t.slice(0, -6) : t.replace(":", "-")}`;
}
const bu = 20, yt = (fe - 2 * R - 2 * bu) / 3, T$ = ["on", "off", "toggle"], H$ = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" }, z$ = (t) => t.error ? d("control.flow.notSent").replace("{at}", Ce(t.at)) : Tn(t) || t.sent !== !1 ? dr(t) : cr(t);
function V$(t) {
  const { rule: e, trace: n } = t, i = e.control, s = i.sources.length, o = n && n.inputs.length === s ? n.inputs : null, r = n == null ? void 0 : n.control, l = r == null ? void 0 : r.event, a = J(o ? 3 : 2), c = J(l != null && l.dropped ? 3 : 2), u = lu(s, a), f = s === 0 ? R : u.bottom + j, p = f + c + j, h = e.gate ? p + J(2) : f + c, m = h + j / 2, $ = h + j, v = $ + iu, b = (D) => R + D * (yt + bu), y = [...u.links];
  s > 0 && y.push(`M${$e} ${u.busY(0)} V${f}`), e.gate && y.push(`M${$e} ${f + c} V${p}`), y.push(`M${$e} ${h} V${m} H${b(0) + yt / 2} V${$}`, `M${$e} ${m} H${b(2) + yt / 2} V${$}`, `M${$e} ${m} V${$}`);
  const x = (D) => st({ ...D, focused: t.focused === D.field, onClick: () => t.onFocus(D.field) }), M = [
    d("control.flow.event"),
    l ? d("control.flow.eventLine").replace("{source}", l.source).replace("{what}", d(`control.do.${l.what}`)).replace("{at}", Ce(l.at)) : d("control.flow.noEvent"),
    ...l != null && l.dropped ? [d("control.flow.dropped")] : []
  ], k = (D) => {
    var A;
    return (A = r == null ? void 0 : r.devices.find((P) => P.id === D)) == null ? void 0 : A.state;
  }, S = n == null ? void 0 : n.last, E = (D, A) => S && l && !l.dropped && l.what === D && S.target === t.nameOf(A.device) ? S : void 0, I = (D, A, P, V, K) => {
    const W = k(A.device), pe = E(D, A), ot = [t.nameOf(A.device), d(`control.do.${A.do}`), ...r ? [d("control.flow.now").replace("{s}", W ?? d("control.flow.noData"))] : [], ...pe ? [z$(pe)] : []], zn = J(ot.length + (pe != null && pe.error ? 1 : 0));
    return { svg: x({ x: V, y: K, w: yt, h: zn, field: `${D}:${P}`, cls: r ? U(W == null ? null : W === "on" || W === "open") : "", lines: ot, err: pe == null ? void 0 : pe.error }), h: zn };
  }, N = T$.map((D, A) => {
    const P = i[D], V = b(A), K = _`<text class="fc-head" text-anchor="middle" x=${V + yt / 2} y=${$ + 14}>${d(H$[D])}</text>`;
    if (P.length === 0) {
      const ot = J(1);
      return { bottom: v + ot, body: _`${K}${x({ x: V, y: v, w: yt, h: ot, field: `${D}:empty`, cls: " muted", lines: [d("control.flow.nothing")] })}` };
    }
    let W = v;
    const pe = P.map((ot, zn) => {
      const $r = I(D, ot, zn, V, W);
      return W += $r.h + un, $r.svg;
    });
    return { bottom: W - un, body: _`${K}${pe}` };
  }), B = Math.max(...N.map((D) => D.bottom)) + R;
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * Jd}px`} viewBox=${`0 0 ${fe} ${B}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${d("control.flow.title")}>
        ${y.map((D) => _`<path class="fc-link" d=${D}></path>`)}
        ${i.sources.map((D, A) => {
    const P = o == null ? void 0 : o[A], V = P && P.detail !== "" && "source" in D ? su(P, t.now, D.source) : P == null ? void 0 : P.detail, K = d("control.gives").replace("{what}", (P == null ? void 0 : P.gives) ?? t.gives(D));
    return x({
      x: u.xs[A],
      y: u.inY(A),
      w: Ye,
      h: a,
      field: `source:${A}`,
      cls: P && !Qe(D) ? U(P.value) : "",
      lines: [`${"not" in D && D.not ? "NOT " : ""}${(P == null ? void 0 : P.label) ?? t.sourceLabel(D)}`, ...V ? [V] : [], K]
    });
  })}
        ${x({
    x: (fe - Ze) / 2,
    y: f,
    w: Ze,
    h: c,
    field: "event",
    cls: l != null && l.dropped ? " nodata" : "",
    lines: M
  })}
        ${e.gate ? x({
    x: (fe - Ze) / 2,
    y: p,
    w: Ze,
    h: J(2),
    field: "gate",
    cls: n != null && n.gate ? U(n.gate.value) : "",
    lines: ru(e.gate, t.sourceLabel(e.gate), n == null ? void 0 : n.gate, t.now)
  }) : w}
        ${N.map((D) => D.body)}
      </svg>
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const vu = ["on", "off", "toggle"], R$ = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" };
function wu(t, e) {
  var i;
  if (!Qe(e)) return "on / off";
  const n = (i = t.deviceById(e.button)) == null ? void 0 : i.props;
  return (n == null ? void 0 : n.kind) === "smart_button" && n.separateOff ? "on / off" : "toggle";
}
function B$(t, e, n, i) {
  const s = `control-source-${n}`, o = g`<span class="muted" data-part="gives">${d("control.gives").replace("{what}", wu(t, e))}</span>`;
  if (!Qe(e)) return mr(t, e, s, i, o);
  const r = t.deviceById(e.button);
  return g`
    <div class="rline${(r == null ? void 0 : r.props.kind) === "smart_button" ? "" : " bad"}" data-field=${s} tabindex="-1">
      <span class="grow">${(r == null ? void 0 : r.name) ?? d("rules.missingDevice")}</span>
      ${o}
      <button class="btn" data-action="remove-input" title=${d("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
}
function F$(t) {
  const e = t.draft.rule.control, n = [];
  return e.sources.length === 0 && n.push({ key: "pick-sources", text: d("control.problem.sources") }), vu.every((i) => e[i].length === 0) && n.push({ key: "pick-actions", text: d("control.problem.actions") }), [...n, ...t.problems.filter((i) => i !== "control" || n.length === 0).map((i) => ({ key: i, text: d(`rules.problem.${i}`) }))];
}
function U$(t) {
  const e = t.draft.rule, n = e.control, i = (c) => t.onChange({ ...e, control: { ...n, sources: c } }), s = (c) => {
    var u;
    return ((u = t.deviceById(c)) == null ? void 0 : u.name) ?? d("rules.missingDevice");
  }, o = t.buttons.filter((c) => !n.sources.some((u) => Qe(u) && u.button === c.id)), r = o.length > 0 ? g`<optgroup label=${d("control.group.buttons")}>
      ${o.map((c) => g`<option value=${`b:${c.id}`}>${c.name}</option>`)}
    </optgroup>` : void 0, l = (c) => {
    const u = c.target;
    if (!u.value.startsWith("b:")) {
      gr(t, (p) => i([...n.sources, { source: p }]))(c);
      return;
    }
    const f = u.value.slice(2);
    u.value = "", i([...n.sources, { button: f }]);
  }, a = g`
    <div class="rsettings">
      <p class="muted">${d("control.hint")}</p>
      ${pu(t)}

      <div class="rgroup">
        <div class="rlabel">${d("control.sources")}</div>
        ${n.sources.map((c, u) => B$(
    t,
    c,
    u,
    (f) => i(f ? n.sources.map((p, h) => h === u ? f : p) : n.sources.filter((p, h) => h !== u))
  ))}
        <select class="radd" data-action="add-source" .value=${""} @change=${l}>
          ${hr(t, d("control.addSource"), r)}
        </select>
      </div>

      ${uu(t, d("control.gate"), "control-gate", d("control.gateNote"))}

      ${vu.map((c) => du(t, {
    label: d(R$[c]),
    addText: d("control.addAction"),
    add: `add-action-${c}`,
    addField: `control-${c}`,
    field: (u) => `control-${c}-${u}`,
    list: n[c],
    set: (u) => t.onChange({ ...e, control: { ...n, [c]: u } }),
    actionsFor: an,
    firstDo: (u) => an(u).includes(c) ? c : an(u)[0],
    doText: (u) => d(`control.do.${u}`),
    unique: !0
  }))}
    </div>`;
  return fu({
    title: d("control.title"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: F$(t),
    form: a,
    diagram: V$({
      rule: e,
      trace: t.trace,
      note: t.note,
      now: t.now,
      nameOf: s,
      sourceLabel: (c) => Qe(c) ? s(c.button) : fr(t, c),
      gives: (c) => wu(t, c),
      focused: t.draft.focused,
      onFocus: t.onFocus
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
const W$ = ["power", "voltage", "power_in", "power_out", "control"], j$ = 300;
function $a(t) {
  t().catch(() => {
  });
}
function q$(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Vt(r), controllable: rc(r) };
    for (const a of W$) {
      const c = (s = r.bindings) == null ? void 0 : s[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class Z$ {
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
      }, j$);
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
      this.setFailure(d("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && $a(n.unsub));
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
          $a(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(Se(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Kd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Gd));
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
const Bs = 1e4, ya = 400, G$ = 1e3, xa = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), K$ = ["timer", "power"], X$ = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function $u(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of Oe(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function Y$(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function Q$(t, e, n) {
  var i;
  if (t.settled) {
    const s = Y$(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (xa.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !xa.has(e.state) ? e.state : void 0 };
}
function ka(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return Qd(s, n, i)[0];
}
function J$(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of $u(n)) e.add(i.entity);
  return [...e].sort();
}
class ey {
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
    return i && n - i.at < Bs ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < ya).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= Bs && o < Bs + G$ && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = $u(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = X$(n, l.entity);
      if (!a) continue;
      const c = o + l.entity, { value: u, text: f } = Q$(l, a, this.seen.get(c));
      u !== void 0 && this.seen.set(c, { last: u }), f && this.events.set(e.id, { text: f, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = ri(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < ya);
      for (const l of K$) {
        const a = ka(o, l, e, i);
        a && !ka(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const Qn = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function Ma(t) {
  t().catch(() => {
  });
}
class ty {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Ma(n.unsub));
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
        n.live ? n.unsub = i : Ma(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: Qn(s.lc) ?? Qn(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const c = Qn(l.lc) ?? (a ? Qn(l.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var ny = Object.defineProperty, Z = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && ny(e, n, s), s;
};
const wr = class wr extends At {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = ep.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Ib(), this.nextObj = O1(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Vc(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Iw(), this.resizeObs = null, this.session = new _b(this), this.haMeta = new Sb(this), this.feed = new Ew(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new Gv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new Z$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new ey(), this.entityFeed = new ty(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Gu(i, (s) => {
      var o;
      return zc(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Ih(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Ab(this), this.activeTool = io("select", this.ctx), this.input = new Mw(this);
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
    this.entityFeed.watch(e ? J$(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? q$(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, c, u, f, p, h, m, $;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((v) => ri(v, this.hass.states).timerSince !== void 0 || this.events.event(v.id, n) !== null || this.events.leaving(v.id, n).length > 0), s = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, o = !!s && (!!s.pending || s.inputs.some((v) => v.until !== void 0 && v.until > n) || (((l = s.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = s.boiler) == null ? void 0 : a.until) ?? 0) > n || ((c = s.timed) == null ? void 0 : c.running) === !0 && (s.timed.until ?? 0) > n || [(u = s.outside) == null ? void 0 : u.pausedUntil, (f = s.outside) == null ? void 0 : f.until, (p = s.outside) == null ? void 0 : p.windowUntil, (h = s.beurer) == null ? void 0 : h.pausedUntil, (m = s.beurer) == null ? void 0 : m.cycleAt, ($ = s.beurer) == null ? void 0 : $.keptUntil].some((v) => (v ?? 0) > n));
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
    const i = this.history.current.power, s = n ?? (i && Jf(i, e));
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
      const r = this.planLevels(), l = ((s = this.selection) == null ? void 0 : s.kind) === "zone" ? this.selection.id : null, a = r.flatMap((p) => p.zones).find((p) => p.id === l), c = ((o = this.selection) == null ? void 0 : o.kind) === "device" ? r.flatMap((p) => p.devices).find((p) => p.id === this.selection.id) : void 0, u = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? Q1({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? kb({}, u, c && As(c) ? c.id : null, c && As(c) ? c.name : "") : e === "outside" ? fb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "control" ? ab({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? ub(u, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? yb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? hb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? vb({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, u, (a == null ? void 0 : a.name) ?? null) : Fe(u), isNew: !0, focused: null };
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
    e.isNew ? this.commitRules(R1(this.rules, e.rule)) : n && !si(n, e.rule) && this.commitRules(B1(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && si(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return w;
    const n = this.planLevels(), i = n.flatMap((p) => p.devices), s = e.rule, o = this.session.savedRules.find((p) => p.id === s.id), r = this.shownRuleTrace(s), l = o ? si(o, s) ? null : d("rules.flow.edited") : d("rules.flow.new"), a = n.length > 1, c = n.flatMap((p) => p.zones.map((h) => ({ id: h.id, name: a ? `${h.name} (${p.name})` : h.name }))), u = G1(
      this.rules,
      s,
      (p) => i.some((h) => h.id === p),
      (p) => {
        const h = i.find((m) => m.id === p);
        return h && ce(h);
      },
      (p) => i.some((h) => h.id === p && h.props.kind === "illuminance_sensor"),
      (p) => i.some((h) => h.id === p && h.props.kind === "climate_sensor"),
      (p) => i.some((h) => h.id === p && lo(h)),
      (p) => i.some((h) => h.id === p && (h.props.kind === "wall_switch" || h.props.kind === "smart_button")),
      (p) => this.boilerGridBlocks().some((h) => h.id === p),
      (p) => {
        const h = i.find((m) => m.id === p);
        return !h || bb(h);
      },
      (p) => i.some((h) => h.id === p && h.props.kind === "leak_sensor"),
      (p) => i.some((h) => h.id === p && h.props.kind === "valve"),
      (p) => i.some((h) => h.id === p && (h.props.kind === "wall_switch" || h.props.kind === "smart_button")),
      (p) => i.some((h) => h.id === p && ce(h).includes("on")),
      (p) => i.some((h) => h.id === p && ce(h).includes("on")),
      (p) => i.some((h) => h.id === p && ce(h).includes("on")),
      (p) => i.some((h) => {
        var m;
        return h.id === p && !!((m = h.bindings) != null && m.power);
      }),
      (p) => i.some((h) => h.id === p && h.props.kind === "smart_button"),
      (p) => i.some((h) => h.id === p && an(h).length > 0)
    );
    if (gb(s))
      return a$({
        draft: e,
        boilers: i.filter(lo),
        buttons: i.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button"),
        grids: this.boilerGridBlocks().map((p) => ({ id: p.id, name: p.name || d("power.kind.grid") })),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p, e$[p] ?? p),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Y1(s))
      return f$({
        draft: e,
        sensors: i.filter((p) => p.props.kind === "leak_sensor"),
        valves: i.filter((p) => p.props.kind === "valve"),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p, c$(p)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (tb(s))
      return y$({
        draft: e,
        buttons: i.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button"),
        devices: i.filter((p) => ce(p).includes("on")),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (pb(s))
      return C$({
        draft: e,
        lights: i.filter((p) => ce(p).includes("on")),
        sensors: i.filter((p) => p.props.kind === "illuminance_sensor"),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p, x$[p] ?? p),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (db(s))
      return P$({
        draft: e,
        heaters: i.filter((p) => ce(p).includes("on")),
        sources: i.filter((p) => {
          var h;
          return !!((h = p.bindings) != null && h.power);
        }),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p, I$[p] ?? p),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (wb(s))
      return Jw({
        draft: e,
        climateSensors: i.filter((p) => p.props.kind === "climate_sensor"),
        fans: i.filter((p) => {
          const h = ce(p);
          return h.includes("on") && h.includes("off");
        }),
        deviceById: (p) => i.find((h) => h.id === p),
        zones: c,
        problems: u,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (p) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
        },
        onFocus: (p) => this.focusRuleField(p),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    const f = {
      draft: e,
      inputDevices: i.filter(As),
      lightSensors: i.filter((p) => p.props.kind === "illuminance_sensor"),
      lightUnit: (p) => {
        var $, v, b, y, x;
        const h = (v = ($ = i.find((M) => M.id === p)) == null ? void 0 : $.bindings) == null ? void 0 : v.illuminance, m = h ? (y = (b = this.hass) == null ? void 0 : b.states) == null ? void 0 : y[h] : void 0;
        return (x = m == null ? void 0 : m.attributes) == null ? void 0 : x.unit_of_measurement;
      },
      actionDevices: i.filter((p) => ce(p).length > 0),
      deviceById: (p) => i.find((h) => h.id === p),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter((p) => p.id !== s.id && !Bl(p)),
      ruleName: (p) => {
        var h;
        return (h = this.rules.find((m) => m.id === p)) == null ? void 0 : h.name;
      },
      zones: c,
      problems: u,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (p) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: p };
      },
      onFocus: (p) => this.focusRuleField(p),
      onUnit: (p, h) => {
        const m = this.ruleDraft ?? e;
        this.ruleDraft = { ...m, units: { ...m.units, [p]: h } };
      },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    };
    return Bl(s) ? U$({
      ...f,
      actionDevices: i.filter((p) => an(p).length > 0),
      buttons: i.filter((p) => p.props.kind === "smart_button"),
      onFocus: (p) => this.focusRuleField(p, N$(p))
    }) : Kw(f);
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(F1(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Ss(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Ss(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Uc(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? Wo(n, e.id) : e.kind === "opening" ? nc(n, e.id) : Ic(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(jc(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Bc(n, e.id);
    return i === n ? this.notice = d("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = Se(i);
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
    this.selection = s && n && i && Ss(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = io(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(tr(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = re(n, i);
    s && (this.view = Yl(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = kc(n).get(e);
    s && (this.view = Yl(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? I1(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return mw(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = gw(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = Mh(this.power, this.ctx.geo());
    e && (this.powerView = bw(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return Sw({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? j1(this.rules, this.dialog.id).map((o) => o.name) : [],
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
    var h, m, $, v;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${d("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${d("action.retry")}</button>` : d("load.loading")}</div>`;
    const e = Ng(!!((m = (h = this.hass) == null ? void 0 : h.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power", f = Date.now(), p = ($ = this.hass) == null ? void 0 : $.states;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${uw(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${$1({
      steps: M1({
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
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : w,
      onPickPlan: (b) => this.session.pickPlan(b),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${iw(this, n)}
        ${ow(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(b) => b.preventDefault()}>
            ${this.grid ? $w(this.view, l, a, e, u ? 0.1 : 1) : w}
            ${this.mode === "power" ? Lg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : og(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (b) => this.feed.stateOf(b),
      live: (b) => ri(b, p),
      bubbles: (b) => {
        const y = ri(b, p), x = this.events.event(b.id, f);
        return {
          shown: [...Qd(y, b, f), ...x ? [{ text: x.text, tone: "event", key: x.at }] : []],
          leaving: this.events.leaving(b.id, f)
        };
      }
    })}
            ${i.tracker ? cw(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: dw(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : w}
          </svg>
          ${this.pendingDraft && ((v = this.dialog) == null ? void 0 : v.kind) !== "restore" ? _w({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : w}
        </div>
        ${aw({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? d(`snap.${i.snap.kind}`) : null,
      onGrid: (b) => {
        this.grid = b;
      },
      cones: this.cones,
      onCones: (b) => {
        this.cones = b;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: u
    })}
        ${this.automationsMenu ? nw(this.automationsMenu, (b) => this.pickAutomation(b), () => this.closeAutomationsMenu()) : w}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
wr.styles = pw;
let F = wr;
Z([
  ze({ attribute: !1 })
], F.prototype, "hass");
Z([
  ze({ type: Boolean })
], F.prototype, "narrow");
Z([
  ze({ attribute: !1 })
], F.prototype, "panel");
Z([
  q()
], F.prototype, "plan");
Z([
  q()
], F.prototype, "automationsMenu");
Z([
  q()
], F.prototype, "loadError");
Z([
  q()
], F.prototype, "selection");
Z([
  q()
], F.prototype, "toolId");
Z([
  q()
], F.prototype, "wallType");
Z([
  q()
], F.prototype, "thickness");
Z([
  q()
], F.prototype, "boxMeasure");
Z([
  q()
], F.prototype, "grid");
Z([
  q()
], F.prototype, "mode");
Z([
  q()
], F.prototype, "bindFilter");
Z([
  q()
], F.prototype, "bindQuery");
Z([
  q()
], F.prototype, "railCollapsed");
Z([
  q()
], F.prototype, "showAll");
Z([
  q()
], F.prototype, "zoneQuery");
Z([
  q()
], F.prototype, "cones");
Z([
  q()
], F.prototype, "nextProps");
Z([
  q()
], F.prototype, "nextObj");
Z([
  q()
], F.prototype, "planView");
Z([
  q()
], F.prototype, "powerView");
Z([
  q()
], F.prototype, "placeDeviceId");
Z([
  q()
], F.prototype, "size");
Z([
  q()
], F.prototype, "dialog");
Z([
  q()
], F.prototype, "notice");
Z([
  q()
], F.prototype, "fieldNotice");
Z([
  q()
], F.prototype, "pendingDraft");
Z([
  q()
], F.prototype, "ruleDraft");
Z([
  q()
], F.prototype, "plans");
Z([
  q()
], F.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", F);
export {
  F as PlanStudioPanel
};
