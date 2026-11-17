/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qn = globalThis, ko = Qn.ShadowRoot && (Qn.ShadyCSS === void 0 || Qn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Mo = Symbol(), br = /* @__PURE__ */ new WeakMap();
let Ma = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Mo) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (ko && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = br.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && br.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const au = (t) => new Ma(typeof t == "string" ? t : t + "", void 0, Mo), _a = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new Ma(n, t, Mo);
}, cu = (t, e) => {
  if (ko) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = Qn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, wr = ko ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return au(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: du, defineProperty: uu, getOwnPropertyDescriptor: pu, getOwnPropertyNames: fu, getOwnPropertySymbols: hu, getPrototypeOf: mu } = Object, Ke = globalThis, vr = Ke.trustedTypes, gu = vr ? vr.emptyScript : "", cs = Ke.reactiveElementPolyfillSupport, en = (t, e) => t, ai = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? gu : null;
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
} }, _o = (t, e) => !du(t, e), $r = { attribute: !0, type: String, converter: ai, reflect: !1, useDefault: !1, hasChanged: _o };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ke.litPropertyMetadata ?? (Ke.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let xt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = $r) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && uu(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = pu(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? $r;
  }
  static _$Ei() {
    if (this.hasOwnProperty(en("elementProperties"))) return;
    const e = mu(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(en("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(en("properties"))) {
      const n = this.properties, i = [...fu(n), ...hu(n)];
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
      for (const s of i) n.unshift(wr(s));
    } else e !== void 0 && n.push(wr(e));
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
    return cu(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : ai).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : ai;
      this._$Em = s;
      const d = a.fromAttribute(n, l.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? _o)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
xt.elementStyles = [], xt.shadowRootOptions = { mode: "open" }, xt[en("elementProperties")] = /* @__PURE__ */ new Map(), xt[en("finalized")] = /* @__PURE__ */ new Map(), cs == null || cs({ ReactiveElement: xt }), (Ke.reactiveElementVersions ?? (Ke.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tn = globalThis, yr = (t) => t, ci = tn.trustedTypes, xr = ci ? ci.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Sa = "$lit$", je = `lit$${Math.random().toFixed(9).slice(2)}$`, Aa = "?" + je, bu = `<${Aa}>`, ut = document, mn = () => ut.createComment(""), gn = (t) => t === null || typeof t != "object" && typeof t != "function", So = Array.isArray, wu = (t) => So(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", ds = `[ 	
\f\r]`, Ut = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, kr = /-->/g, Mr = />/g, it = RegExp(`>|${ds}(?:([^\\s"'>=/]+)(${ds}*=${ds}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _r = /'/g, Sr = /"/g, Ca = /^(?:script|style|textarea|title)$/i, Ia = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), b = Ia(1), S = Ia(2), $e = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Ar = /* @__PURE__ */ new WeakMap(), ot = ut.createTreeWalker(ut, 129);
function Ea(t, e) {
  if (!So(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xr !== void 0 ? xr.createHTML(e) : e;
}
const vu = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Ut;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let d, p, c = -1, f = 0;
    for (; f < a.length && (r.lastIndex = f, p = r.exec(a), p !== null); ) f = r.lastIndex, r === Ut ? p[1] === "!--" ? r = kr : p[1] !== void 0 ? r = Mr : p[2] !== void 0 ? (Ca.test(p[2]) && (s = RegExp("</" + p[2], "g")), r = it) : p[3] !== void 0 && (r = it) : r === it ? p[0] === ">" ? (r = s ?? Ut, c = -1) : p[1] === void 0 ? c = -2 : (c = r.lastIndex - p[2].length, d = p[1], r = p[3] === void 0 ? it : p[3] === '"' ? Sr : _r) : r === Sr || r === _r ? r = it : r === kr || r === Mr ? r = Ut : (r = it, s = void 0);
    const h = r === it && t[l + 1].startsWith("/>") ? " " : "";
    o += r === Ut ? a + bu : c >= 0 ? (i.push(d), a.slice(0, c) + Sa + a.slice(c) + je + h) : a + je + (c === -2 ? l : h);
  }
  return [Ea(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class bn {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [d, p] = vu(e, n);
    if (this.el = bn.createElement(d, i), ot.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = ot.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Sa)) {
          const f = p[r++], h = s.getAttribute(c).split(je), m = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? yu : m[1] === "?" ? xu : m[1] === "@" ? ku : zi }), s.removeAttribute(c);
        } else c.startsWith(je) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (Ca.test(s.tagName)) {
          const c = s.textContent.split(je), f = c.length - 1;
          if (f > 0) {
            s.textContent = ci ? ci.emptyScript : "";
            for (let h = 0; h < f; h++) s.append(c[h], mn()), ot.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[f], mn());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Aa) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(je, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += je.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = ut.createElement("template");
    return i.innerHTML = e, i;
  }
}
function It(t, e, n = t, i) {
  var r, l;
  if (e === $e) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = gn(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = It(t, s._$AS(t, e.values), s, i)), e;
}
class $u {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? ut).importNode(n, !0);
    ot.currentNode = s;
    let o = ot.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new Ao(o, o.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (d = new Mu(o, this, e)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = ot.nextNode(), r++);
    }
    return ot.currentNode = ut, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let Ao = class Da {
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
    e = It(this, e, n), gn(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== $e && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : wu(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && gn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ut.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = bn.createElement(Ea(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new $u(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Ar.get(e.strings);
    return n === void 0 && Ar.set(e.strings, n = new bn(e)), n;
  }
  k(e) {
    So(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new Da(this.O(mn()), this.O(mn()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = yr(e).nextSibling;
      yr(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class zi {
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
    if (o === void 0) e = It(this, e, n, 0), r = !gn(e) || e !== this._$AH && e !== $e, r && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = o[0], a = 0; a < o.length - 1; a++) d = It(this, l[i + a], n, a), d === $e && (d = this._$AH[a]), r || (r = !gn(d) || d !== this._$AH[a]), d === v ? e = v : e !== v && (e += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class yu extends zi {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class xu extends zi {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
let ku = class extends zi {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = It(this, e, n, 0) ?? v) === $e) return;
    const i = this._$AH, s = e === v && i !== v || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Mu {
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
const us = tn.litHtmlPolyfillSupport;
us == null || us(bn, Ao), (tn.litHtmlVersions ?? (tn.litHtmlVersions = [])).push("3.3.3");
const _u = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new Ao(e.insertBefore(mn(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = globalThis;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = _u(n, this.renderRoot, this.renderOptions);
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
var ka;
At._$litElement$ = !0, At.finalized = !0, (ka = lt.litElementHydrateSupport) == null || ka.call(lt, { LitElement: At });
const ps = lt.litElementPolyfillSupport;
ps == null || ps({ LitElement: At });
(lt.litElementVersions ?? (lt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Su = { attribute: !0, type: String, converter: ai, reflect: !1, hasChanged: _o }, Au = (t = Su, e, n) => {
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
function Ve(t) {
  return (e, n) => typeof n == "object" ? Au(t, e, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(t) {
  return Ve({ ...t, state: !0, attribute: !1 });
}
function ne() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Co(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const at = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Cu = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Iu = { ...at, role: "power_in" }, Eu = { ...at, role: "power_out" }, Du = { role: "sun", domains: ["sun"], primary: !0 }, Lu = ["on", "off", "auto"], Io = (t) => Lu.includes(t), fs = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Pu = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Du
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [fs("on"), fs("off"), fs("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, at],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, at, Cu, Iu, Eu]
}, Eo = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Ou = { climate_sensor: "any", illuminance_sensor: "any" };
function De(t) {
  const e = t.props, n = Pu[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function La(t) {
  return new Set(De(t).map((e) => e.role));
}
function Hi(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !La(s).has(n)) return t;
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
function Nu(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = De(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (Ou[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Tu(t) {
  const e = De(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const zu = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function Ws(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Io(e) ? n : `${n}|${zu(i[e])}`;
}
function Hu(t, e, n) {
  const i = Ws(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && De(s).some((o) => Ws(s, o.role) === i));
}
function Vu(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of De(t)) {
    const s = Io(i) ? Ws(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function Vi(t) {
  if (!t.bindings) return t;
  const e = La(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Pa = (t) => t === "wall_switch" || t === "smart_button", Ri = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", wn = (t) => t === "wall" ? "wall" : "free", Ru = [100, 125, 150], Do = "mdi:cube-outline", Cr = ["single", "double", "hold"], Bu = {
  bearing: 400
}, Jn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Oa(t = ne(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Ir(t) {
  return {
    id: ne(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Oa()]
  };
}
const Lo = {
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
}, Et = 90, Na = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ye(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Do, label: "" };
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
const Fu = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Do
};
function Uu(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Fu[String(n)] ?? Do;
  return { ...t, props: { ...i, icon: s } };
}
function Wu(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = wn(t.placement.mode);
  return e ? { ...t, props: Ye("smart_button", n), bindings: { on: e } } : { ...t, props: Ye("wall_switch", n) };
}
const Ta = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function ju(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Ta(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function qu(t) {
  const e = t.props.kind;
  if (!Ri(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Ye(e, wn(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? ju(r, o) : s === "windowSec" ? Ta(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function Zu(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function Gu(t) {
  if (!Ri(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function Ku(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Vi(Zu(Gu(qu(Wu(Uu(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function T(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function L(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function D(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function q(t, e) {
  return t.x * e.x + t.y * e.y;
}
function ue(t, e) {
  return t.x * e.y - t.y * e.x;
}
function za(t) {
  return Math.hypot(t.x, t.y);
}
function O(t, e) {
  return za(L(e, t));
}
function Bi(t) {
  const e = za(t);
  return e === 0 ? { x: 0, y: 0 } : D(t, 1 / e);
}
function re(t) {
  return { x: t.y, y: -t.x };
}
function Ha(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function Me(t, e, n, i) {
  const s = ue(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = ue(L(n, t), i) / s;
  return T(t, D(e, o));
}
function Fi(t, e, n) {
  const i = L(n, e), s = q(i, i);
  return s === 0 ? 0 : q(L(t, e), i) / s;
}
function Ae(t, e, n) {
  const i = L(n, e), s = q(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, q(L(t, e), i) / s));
  return O(t, T(e, D(i, o)));
}
function Dt(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function Ce(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let Qe = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function Xu(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function qe(t, e, n) {
  const i = new Qe(null, null);
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
function hs(t, e, n, i) {
  const s = new Qe(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = qe(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Er(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = qe(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function Yu(t, e, n) {
  return e === null ? t : (t === null || (e = qe(t.key, e, n), e.left = t), e);
}
function js(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && js(t.left, o, !1, i, s), t.right && js(t.right, o, !0, i, s);
  }
}
class Po {
  constructor(e = Xu) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = hs(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new Qe(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = qe(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = qe(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = qe(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = qe(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = qe(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return Ju(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && Gs(e, n, 0, s - 1, o), this._root === null)
      this._root = qs(e, n, 0, s), this._size = s;
    else {
      const r = ep(
        this.toList(),
        Qu(e, n),
        o
      );
      s = this._size + s, this._root = Zs({ head: r }, 0, s);
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
    return js(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Er(e, this._root, s);
    s(e, n) < 0 ? r = hs(n, i, r, s) : o = hs(n, i, o, s), this._root = Yu(o, r, s);
  }
  split(e) {
    return Er(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function qs(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new Qe(r, l);
    return a.left = qs(t, e, n, o), a.right = qs(t, e, o + 1, i), a;
  }
  return null;
}
function Qu(t, e) {
  const n = new Qe(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new Qe(t[s], e[s]);
  return i.next = null, n.next;
}
function Ju(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new Qe(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function Zs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = Zs(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = Zs(t, s + 1, n), r;
  }
  return null;
}
function ep(t, e, n) {
  const i = new Qe(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function Gs(t, e, n, i, s) {
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
  Gs(t, e, n, l, s), Gs(t, e, l + 1, i, s);
}
const Te = 11102230246251565e-32, le = 134217729, tp = (3 + 8 * Te) * Te;
function ms(t, e, n, i, s) {
  let o, r, l, a, d = e[0], p = i[0], c = 0, f = 0;
  p > d == p > -d ? (o = d, d = e[++c]) : (o = p, p = i[++f]);
  let h = 0;
  if (c < t && f < n)
    for (p > d == p > -d ? (r = d + o, l = o - (r - d), d = e[++c]) : (r = p + o, l = o - (r - p), p = i[++f]), o = r, l !== 0 && (s[h++] = l); c < t && f < n; )
      p > d == p > -d ? (r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c]) : (r = o + p, a = r - o, l = o - (r - a) + (p - a), p = i[++f]), o = r, l !== 0 && (s[h++] = l);
  for (; c < t; )
    r = o + d, a = r - o, l = o - (r - a) + (d - a), d = e[++c], o = r, l !== 0 && (s[h++] = l);
  for (; f < n; )
    r = o + p, a = r - o, l = o - (r - a) + (p - a), p = i[++f], o = r, l !== 0 && (s[h++] = l);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function np(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function A(t) {
  return new Float64Array(t);
}
const ip = (3 + 16 * Te) * Te, sp = (2 + 12 * Te) * Te, op = (9 + 64 * Te) * Te * Te, vt = A(4), Dr = A(8), Lr = A(12), Pr = A(16), de = A(4);
function rp(t, e, n, i, s, o, r) {
  let l, a, d, p, c, f, h, m, $, w, g, y, x, M, k, _, E, C;
  const I = t - s, V = n - s, N = e - o, R = i - o;
  M = I * R, f = le * I, h = f - (f - I), m = I - h, f = le * R, $ = f - (f - R), w = R - $, k = m * w - (M - h * $ - m * $ - h * w), _ = N * V, f = le * N, h = f - (f - N), m = N - h, f = le * V, $ = f - (f - V), w = V - $, E = m * w - (_ - h * $ - m * $ - h * w), g = k - E, c = k - g, vt[0] = k - (g + c) + (c - E), y = M + g, c = y - M, x = M - (y - c) + (g - c), g = x - _, c = x - g, vt[1] = x - (g + c) + (c - _), C = y + g, c = C - y, vt[2] = y - (C - c) + (g - c), vt[3] = C;
  let Z = np(4, vt), X = sp * r;
  if (Z >= X || -Z >= X || (c = t - I, l = t - (I + c) + (c - s), c = n - V, d = n - (V + c) + (c - s), c = e - N, a = e - (N + c) + (c - o), c = i - R, p = i - (R + c) + (c - o), l === 0 && a === 0 && d === 0 && p === 0) || (X = op * r + tp * Math.abs(Z), Z += I * p + R * l - (N * d + V * a), Z >= X || -Z >= X)) return Z;
  M = l * R, f = le * l, h = f - (f - l), m = l - h, f = le * R, $ = f - (f - R), w = R - $, k = m * w - (M - h * $ - m * $ - h * w), _ = a * V, f = le * a, h = f - (f - a), m = a - h, f = le * V, $ = f - (f - V), w = V - $, E = m * w - (_ - h * $ - m * $ - h * w), g = k - E, c = k - g, de[0] = k - (g + c) + (c - E), y = M + g, c = y - M, x = M - (y - c) + (g - c), g = x - _, c = x - g, de[1] = x - (g + c) + (c - _), C = y + g, c = C - y, de[2] = y - (C - c) + (g - c), de[3] = C;
  const ie = ms(4, vt, 4, de, Dr);
  M = I * p, f = le * I, h = f - (f - I), m = I - h, f = le * p, $ = f - (f - p), w = p - $, k = m * w - (M - h * $ - m * $ - h * w), _ = N * d, f = le * N, h = f - (f - N), m = N - h, f = le * d, $ = f - (f - d), w = d - $, E = m * w - (_ - h * $ - m * $ - h * w), g = k - E, c = k - g, de[0] = k - (g + c) + (c - E), y = M + g, c = y - M, x = M - (y - c) + (g - c), g = x - _, c = x - g, de[1] = x - (g + c) + (c - _), C = y + g, c = C - y, de[2] = y - (C - c) + (g - c), de[3] = C;
  const z = ms(ie, Dr, 4, de, Lr);
  M = l * p, f = le * l, h = f - (f - l), m = l - h, f = le * p, $ = f - (f - p), w = p - $, k = m * w - (M - h * $ - m * $ - h * w), _ = a * d, f = le * a, h = f - (f - a), m = a - h, f = le * d, $ = f - (f - d), w = d - $, E = m * w - (_ - h * $ - m * $ - h * w), g = k - E, c = k - g, de[0] = k - (g + c) + (c - E), y = M + g, c = y - M, x = M - (y - c) + (g - c), g = x - _, c = x - g, de[1] = x - (g + c) + (c - _), C = y + g, c = C - y, de[2] = y - (C - c) + (g - c), de[3] = C;
  const Q = ms(z, Lr, 4, de, Pr);
  return Pr[Q - 1];
}
function lp(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= ip * d ? a : -rp(t, e, n, i, s, o, d);
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
const Wt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, Ks = (t, e) => {
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
let Ze = Number.EPSILON;
Ze === void 0 && (Ze = Math.pow(2, -52));
const ap = Ze * Ze, Or = (t, e) => {
  if (-Ze < t && t < Ze && -Ze < e && e < Ze)
    return 0;
  const n = t - e;
  return n * n < ap * t * e ? 0 : t < e ? -1 : 1;
};
class cp {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Nr(), this.yRounder = new Nr();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class Nr {
  constructor() {
    this.tree = new Po(), this.round(0);
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
    if (i !== null && Or(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && Or(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const vn = new cp(), ei = (t, e) => t.x * e.y - t.y * e.x, Va = (t, e) => t.x * e.x + t.y * e.y, Tr = (t, e, n) => {
  const i = lp(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, di = (t) => Math.sqrt(Va(t, t)), dp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return ei(s, i) / di(s) / di(i);
}, up = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Va(s, i) / di(s) / di(i);
}, zr = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Hr = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, pp = (t, e, n, i) => {
  if (e.x === 0) return Hr(n, i, t.x);
  if (i.x === 0) return Hr(t, e, n.x);
  if (e.y === 0) return zr(n, i, t.y);
  if (i.y === 0) return zr(t, e, n.y);
  const s = ei(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = ei(o, e) / s, l = ei(o, i) / s, a = t.x + l * e.x, d = n.x + r * i.x, p = t.y + l * e.y, c = n.y + r * i.y, f = (a + d) / 2, h = (p + c) / 2;
  return {
    x: f,
    y: h
  };
};
class we {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = we.comparePoints(e.point, n.point);
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
        sine: dp(this.point, e.point, o.point),
        cosine: up(this.point, e.point, o.point)
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
let fp = 0;
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
    const l = e.leftSE.point.y, a = n.leftSE.point.y, d = e.rightSE.point.y, p = n.rightSE.point.y;
    if (i < s) {
      if (a < l && a < d) return 1;
      if (a > l && a > d) return -1;
      const c = e.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const f = n.comparePoint(e.rightSE.point);
      return f !== 0 ? f : -1;
    }
    if (i > s) {
      if (l < a && l < p) return -1;
      if (l > a && l > p) return 1;
      const c = n.comparePoint(e.leftSE.point);
      if (c !== 0) return c;
      const f = e.comparePoint(n.rightSE.point);
      return f < 0 ? 1 : f > 0 ? -1 : 1;
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
      const c = d - l, f = o - i, h = p - a, m = r - s;
      if (c > f && h < m) return 1;
      if (c < f && h > m) return -1;
    }
    return o > r ? 1 : o < r || d < p ? -1 : d > p ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++fp, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
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
    return new Xe(a, d, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = Ks(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, d = Wt(n, l) && this.comparePoint(l) === 0, p = Wt(i, o) && e.comparePoint(o) === 0, c = Wt(n, a) && this.comparePoint(a) === 0, f = Wt(i, r) && e.comparePoint(r) === 0;
    if (p && d)
      return f && !c ? r : !f && c ? a : null;
    if (p)
      return c && o.x === a.x && o.y === a.y ? null : o;
    if (d)
      return f && r.x === l.x && r.y === l.y ? null : l;
    if (f && c) return null;
    if (f) return r;
    if (c) return a;
    const h = pp(o, this.vector(), l, e.vector());
    return h === null || !Wt(s, h) ? null : vn.round(h.x, h.y);
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
    const l = new Xe(s, r, this.rings.slice(), this.windings.slice());
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
class Vr {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = vn.round(e[0][0], e[0][1]);
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
      let a = vn.round(e[r][0], e[r][1]);
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
class hp {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Vr(e[0], this, !0), this.bbox = {
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
      const o = new Vr(e[i], this, !1);
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
class Rr {
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
      const o = new hp(e[i], this);
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
class ui {
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
          const f = l.getAvailableLinkedEvents();
          if (f.length === 0) {
            const $ = d[0].point, w = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${$.x}, ${$.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (f.length === 1) {
            a = f[0].otherSE;
            break;
          }
          let h = null;
          for (let $ = 0, w = c.length; $ < w; $++)
            if (c[$].point === l.point) {
              h = $;
              break;
            }
          if (h !== null) {
            const $ = c.splice(h)[0], w = d.splice($.index);
            w.unshift(w[0].otherSE), n.push(new ui(w.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = f.sort(m)[0].otherSE;
          break;
        }
      n.push(new ui(d));
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
      const c = this.events[d].point, f = this.events[d + 1].point;
      Tr(c, e, f) !== 0 && (n.push(c), e = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Tr(i, e, s) === 0 && n.shift(), n.push(n[0]);
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
class Br {
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
class mp {
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
        if (o.isExteriorRing()) n.push(new Br(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new Br(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class gp {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Xe.compare;
    this.queue = e, this.tree = new Po(n), this.segments = [];
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
          const f = this._splitSafely(l, c);
          for (let h = 0, m = f.length; h < m; h++)
            i.push(f[h]);
        }
      }
      let p = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (p = c), !a.isAnEndpoint(c))) {
          const f = this._splitSafely(a, c);
          for (let h = 0, m = f.length; h < m; h++)
            i.push(f[h]);
        }
      }
      if (d !== null || p !== null) {
        let c = null;
        d === null ? c = p : p === null ? c = d : c = we.comparePoints(d, p) <= 0 ? d : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const f = n.split(c);
        for (let h = 0, m = f.length; h < m; h++)
          i.push(f[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const d = l.getIntersection(a);
        if (d !== null) {
          if (!l.isAnEndpoint(d)) {
            const p = this._splitSafely(l, d);
            for (let c = 0, f = p.length; c < f; c++)
              i.push(p[c]);
          }
          if (!a.isAnEndpoint(d)) {
            const p = this._splitSafely(a, d);
            for (let c = 0, f = p.length; c < f; c++)
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
const Fr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, bp = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class wp {
  run(e, n, i) {
    ye.type = e, vn.reset();
    const s = [new Rr(n, !0)];
    for (let c = 0, f = i.length; c < f; c++)
      s.push(new Rr(i[c], !1));
    if (ye.numMultiPolys = s.length, ye.type === "difference") {
      const c = s[0];
      let f = 1;
      for (; f < s.length; )
        Ks(s[f].bbox, c.bbox) !== null ? f++ : s.splice(f, 1);
    }
    if (ye.type === "intersection")
      for (let c = 0, f = s.length; c < f; c++) {
        const h = s[c];
        for (let m = c + 1, $ = s.length; m < $; m++)
          if (Ks(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Po(we.compare);
    for (let c = 0, f = s.length; c < f; c++) {
      const h = s[c].getSweepEvents();
      for (let m = 0, $ = h.length; m < $; m++)
        if (o.insert(h[m]), o.size > Fr)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new gp(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > Fr)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > bp)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const f = r.process(c);
      for (let h = 0, m = f.length; h < m; h++) {
        const $ = f[h];
        $.consumedBy === void 0 && o.insert($);
      }
      l = o.size, a = o.pop();
    }
    vn.reset();
    const d = ui.factory(r.segments);
    return new mp(d).getGeom();
  }
}
const ye = new wp(), vp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("union", t, n);
}, $p = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("intersection", t, n);
}, yp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("xor", t, n);
}, xp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ye.run("difference", t, n);
};
var Ra = {
  union: vp,
  intersection: $p,
  xor: yp,
  difference: xp
};
const Ba = 3, kp = 1e-6;
function Ui(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function te(t, e) {
  const n = Ui(t, e);
  return { x: n.x, y: n.y };
}
function gt(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : O(i, s);
}
function Fa(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: Bi(L(e, t)), len: O(t, e), leftOff: o, rightOff: r };
}
function ce(t, e) {
  return Fa(te(t, e.a), te(t, e.b), e.thickness, e.baseline);
}
function et(t, e) {
  const n = L(e, t.a);
  return { t: q(n, t.dir), side: q(n, re(t.dir)) };
}
function Ur(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: D(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const kt = (t) => T(t.p, D(re(t.u), t.offL)), Mt = (t) => L(t.p, D(re(t.u), t.offR));
function rt(t, e, n) {
  return t !== null && O(t, e) <= n;
}
function Mp(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ce(t, n);
    if (i.len < 1e-9) continue;
    const s = re(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: T(i.a, D(s, i.leftOff)),
        ar: L(i.a, D(s, i.rightOff)),
        bl: T(i.b, D(s, i.leftOff)),
        br: L(i.b, D(s, i.rightOff))
      }
    });
  }
  return e;
}
function _p(t, e) {
  const n = e.f, i = re(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = q(L(s.far, n.a), i) >= 0 ? T(n.a, D(i, n.leftOff)) : L(n.a, D(i, n.rightOff)), l = Ba * Math.max(s.body.wall.thickness, e.wall.thickness), a = Me(kt(s), s.u, r, n.dir), d = Me(Mt(s), s.u, r, n.dir);
    rt(a, s.p, l) && (s.body.c[s.leftKey] = a), rt(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function Sp(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Ba * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = Me(Mt(o), o.u, kt(r), r.u);
    rt(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Ap(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = L(r, o), a = ue(l, L(e, o)), d = ue(l, L(s.far, o));
    a * d < 0 && Xs(s, [e]);
  }
}
function Xs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Ap(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(ue(o.u, r.u)) > 1e-9 || q(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], d = Me(Mt(o), o.u, kt(a), a.u), p = Me(kt(r), r.u, kt(a), a.u);
        if (!rt(d, e, n) || !rt(p, e, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = p, Xs(o, [e, c, p]);
      } else {
        const a = t[(s - 1 + i) % i], d = Me(kt(r), r.u, Mt(a), a.u), p = Me(Mt(o), o.u, Mt(a), a.u);
        if (!rt(p, e, n) || !rt(d, e, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = p, r.body.c[r.leftKey] = d, Xs(r, [p, c, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Oo(t) {
  const e = Mp(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(Ur(r, "a")), r.wall.b === i.id && s.push(Ur(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? _p(s, o) : s.length >= 2 && Sp(s, { x: i.x, y: i.y });
  }
  return e;
}
function Ua(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Oo(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: q(L(l, i.f.a), i.f.dir) });
    }
  return e;
}
function Wa(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Wi(t) {
  return new Map(Oo(t).map((e) => [e.wall.id, Wa(e)]));
}
function Wr(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(T(s, D(L(o, s), r / (r - l))));
  }
  return n;
}
function No(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Oo(t)) {
    const s = Wa(i), o = t.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && e(p)).sort((p, c) => p.offset - c.offset), r = (p) => q(L(p, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const p of o)
      l.push([a, p.offset]), a = Math.max(a, p.offset + p.width);
    l.push([a, 1 / 0]);
    const d = [];
    for (const [p, c] of l) {
      if (c <= p) continue;
      let f = s;
      p > -1 / 0 && (f = Wr(f, (h) => r(h) - p)), c < 1 / 0 && (f = Wr(f, (h) => c - r(h))), f.length >= 3 && Math.abs(Ce(f)) > kp && d.push(f);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const Ys = (t) => [t.map((e) => [e.x, e.y])];
function ja(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function qa(t, e) {
  return Za(e ? [...No(t).values()].flat() : [...Wi(t).values()]);
}
function Za(t) {
  const e = t.map(Ys);
  if (e.length === 0) return [];
  let n;
  try {
    n = Ra.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(ja));
}
const Lt = 1e-6, pi = ["door", "gate", "wicket"], Ga = (t) => t === "opening", Ka = (t) => t.passesLight ?? Ga(t.kind), Xa = (t) => t === "opening", Ya = (t) => t.passesPir ?? Xa(t.kind);
function Qa(t, e) {
  return t.offset < e.offset + e.width - Lt && e.offset < t.offset + t.width - Lt;
}
function ji(t, e, n, i, s) {
  const o = gt(t, e);
  return o === null || i <= 0 || n < -Lt || n + i > o + Lt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && Qa(r, { offset: n, width: i }));
}
function Ht(t, e) {
  return { ...t, openings: e };
}
function Cp(t, e, n, i, s, o = {}) {
  const r = s ?? Jn[n], l = i - r / 2;
  if (!ji(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: ne(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return pi.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: Ht(t, [...t.openings, a]), openingId: a.id };
}
function Ja(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !ji(t, i.wallId, n, i.width, e) ? t : Dn(Ht(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Ip(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !ji(t, i.wallId, i.offset, n, e) ? t : Dn(Ht(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Ep(t, e) {
  return pi.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Dp(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Dn(Ht(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function ec(t, e) {
  return Dn(Ht(t, t.openings.filter((n) => n.id !== e)));
}
function Dn(t) {
  return Ht(t, t.openings.map((e) => {
    const n = gt(t, e.wallId), i = n === null || e.offset < -Lt || e.offset + e.width > n + Lt || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && Qa(e, s));
    return { ...e, invalid: i };
  }));
}
const fi = 1e-6;
function tc(t, e) {
  return e.mode !== "none" && Lo[t.kind].includes(e.mode);
}
function nc(t, e, n) {
  if (n.mode === "none" || !tc(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Et || i > Et)) return !1;
  const s = gt(t, n.wallId);
  return s !== null && n.offset >= -fi && n.offset <= s + fi;
}
function Re(t, e) {
  return { ...t, devices: e };
}
function jr(t, e, n, i) {
  if (!nc(t, e, n)) return { level: t, deviceId: null };
  const s = { id: ne(), name: i, placement: n, props: e, invalid: !1 };
  return { level: Re(t, [...t.devices, s]), deviceId: s.id };
}
function ic(t, e) {
  const n = { id: ne(), name: e, placement: { mode: "none" }, props: Ye("equipment", "free"), invalid: !1 };
  return { level: Re(t, [...t.devices, n]), id: n.id };
}
const Lp = ["power", "power_in", "power_out", "voltage"];
function Pp(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Lp.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Vt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, sc = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function oc(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function rc(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = Vi({ ...i, props: oc(i.props, "inverter", n), bindings: r });
  return Re(t, t.devices.map((a) => a === i ? l : a));
}
function qi(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: oc(i.props, "controllable", n) };
  return Re(t, t.devices.map((o) => o === i ? s : o));
}
function lc(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Ye("motion_sensor", wn(e)), s = Ye("motion_sensor", wn(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function hi(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !nc(t, s.props, n)) return t;
  const o = lc(s.props, s.placement.mode, n.mode);
  return ac(Re(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function Rt(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? Re(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return Vi({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Op(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Pa(i.props.kind) || i.props.kind === n) return t;
  const s = Ye(n, wn(i.placement.mode));
  if (!tc(s, i.placement)) return t;
  const o = Vi({ ...i, props: s });
  return Re(t, t.devices.map((r) => r === i ? o : r));
}
function Np(t, e) {
  return Re(t, t.devices.filter((n) => n.id !== e));
}
function ac(t) {
  return Re(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = gt(t, e.placement.wallId), i = n === null || e.placement.offset < -fi || e.placement.offset > n + fi;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function cc(t) {
  const e = [];
  for (const n of qa(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Qs(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!Dt(e, s)) continue;
    const o = Math.abs(Ce(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const gs = 1e-3;
function dc(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Ce(t)) - Math.abs(Ce(e))) > gs ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= gs && Math.abs(n.y - i.y) <= gs));
}
const uc = 2, qr = Math.ceil(360 / uc), Zr = 1e-4, Tp = 1e-9, Gr = 1e-9, zp = {
  light: Ka,
  motion: Ya
};
function pc(t, e) {
  const n = [];
  for (const i of Za([...No(t, zp[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function To(t, e, n) {
  return e.filter(([i, s]) => Ae(t, i, s) <= n);
}
function bs(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Hp(t, e, n) {
  const i = To(t, e, n), s = [];
  for (let w = 0; w < qr; w++) s.push(-Math.PI + 2 * Math.PI * w / qr);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (O(t, g) > o) continue;
      const y = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(bs(y - Zr), bs(y), bs(y + Zr));
    }
  s.sort((w, g) => w - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), d = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([w, g], y) => {
    l[y] = w.x - t.x, a[y] = w.y - t.y, d[y] = g.x - w.x, p[y] = g.y - w.y;
  });
  const c = [], f = [];
  let h = NaN;
  for (const w of s) {
    if (w === h) continue;
    h = w;
    const g = Math.cos(w), y = Math.sin(w);
    let x = n, M = -1;
    for (let E = 0; E < r; E++) {
      const C = g * p[E] - y * d[E];
      if (Math.abs(C) < 1e-12) continue;
      const I = (l[E] * p[E] - a[E] * d[E]) / C;
      if (!(I > Tp && I < x)) continue;
      const V = (l[E] * y - a[E] * g) / C;
      V < -Gr || V > 1 + Gr || (x = I, M = E);
    }
    const k = { x: t.x + g * x, y: t.y + y * x }, _ = c.length;
    if (!(_ > 0 && c[_ - 1].x === k.x && c[_ - 1].y === k.y)) {
      if (M >= 0 && _ >= 2 && f[_ - 1] === M && f[_ - 2] === M) {
        c[_ - 1] = k;
        continue;
      }
      c.push(k), f.push(M);
    }
  }
  const m = c[0], $ = c[c.length - 1];
  return c.length > 1 && m.x === $.x && m.y === $.y && c.pop(), c;
}
const Vp = 32, Kr = 128;
function mi(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function ze(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function zo(t) {
  return (t % 360 + 360) % 360;
}
function fc(t) {
  return (t % 360 + 540) % 360 - 180;
}
function hc(t, e, n, i) {
  const s = t.walls.find((d) => d.id === e);
  if (!s) return null;
  let o;
  try {
    o = ce(t, s);
  } catch {
    return null;
  }
  const r = re(o.dir), l = n === "left" ? r : D(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: T(T(o.a, D(o.dir, i)), D(l, a)), normal: l };
}
function $n(t, e, n, i) {
  var s;
  return ((s = hc(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function ae(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: mi(n.rotation) };
  const i = hc(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: T(i.pt, D(s, r)), dir: re(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? mi(ze(s) + n.aim) : s, normal: s };
}
function Xr(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let d;
    try {
      d = ce(t, a);
    } catch {
      continue;
    }
    const p = a.a === n ? d.dir : D(d.dir, -1);
    if (Math.abs(ue(i, p)) < 1e-9 && q(i, p) < 0) {
      if ((q(re(d.dir), s) > 0 ? d.leftOff : d.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (q(p, s) > 1e-9) return !1;
  }
  return l;
}
function Ho(t, e, n, i) {
  var V;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((N) => N.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = ce(t, s);
  } catch {
    return n;
  }
  const r = Ua(t), l = r.filter((N) => N.wallId === n.wallId && N.side === n.side), a = l.find((N) => N.end === "a"), d = l.find((N) => N.end === "b");
  if (!a || !d) return n;
  const p = re(o.dir), c = n.side === "left" ? p : D(p, -1), f = n.side === "left" ? o.leftOff : o.rightOff, h = Xr(t, s, s.a, o.dir, c, f) ? -1 / 0 : a.offset, m = Xr(t, s, s.b, D(o.dir, -1), c, f) ? 1 / 0 : d.offset, $ = (N) => q(L(N, o.a), o.dir), w = [];
  for (const N of t.nodes)
    if (((V = N.host) == null ? void 0 : V.wallId) === s.id)
      for (const R of t.walls) {
        const Z = R.a === N.id ? "a" : R.b === N.id ? "b" : null, X = Z && t.nodes.find((z) => z.id === (Z === "a" ? R.b : R.a));
        if (!X || (q(L(X, o.a), p) >= 0 ? "left" : "right") !== n.side) continue;
        const ie = r.filter((z) => z.wallId === R.id && z.end === Z).map((z) => $(z.pt));
        ie.length && w.push([Math.min(...ie), Math.max(...ie)]);
      }
  w.sort((N, R) => N[0] - R[0]);
  const g = [];
  let y = h;
  for (const [N, R] of w) {
    const Z = Math.min(N, m);
    Z > y && g.push([y, Z]), y = Math.max(y, R);
  }
  m > y && g.push([y, m]), g.length === 0 && g.push([h, m]);
  const x = ([N, R]) => Math.max(0, N - n.offset, n.offset - R), [M, k] = g.reduce((N, R) => x(R) < x(N) ? R : N), _ = (e.shape === "circle" ? e.diameter : e.width) / 2, E = M + _, C = k - _;
  let I = n.offset;
  return E > C ? I = (M + k) / 2 : I <= E + i ? I = E : I >= C - i && (I = C), I = Math.max(0, Math.min(o.len, I)), Math.abs(I - n.offset) < 1e-9 ? n : { ...n, offset: I };
}
function mc(t, e) {
  const n = [];
  for (let i = 0; i < Kr; i++) n.push(T(t, D(mi(360 * i / Kr), e)));
  return n;
}
function Yr(t, e, n, i) {
  if (n >= 360) return mc(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Vp)), o = ze(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(T(t, D(mi(o + n * l / s), i)));
  return r;
}
const Rp = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Zi(t) {
  return Rp[t] ?? null;
}
const Bp = (t) => Zi(t.kind) !== null;
function Fp(t, e) {
  const n = e.props;
  if (!Bp(n)) return null;
  const i = ae(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Yr(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Yr(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? mc(i.pt, n.poolRadius) : null;
  }
}
function Up(t) {
  return t.normal ? T(t.pt, t.normal) : t.pt;
}
function Qr(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Wp(t, e, n) {
  const i = L(e, t);
  for (const [s, o] of n) {
    const r = L(o, s), l = L(s, t), a = ue(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const d = ue(l, r) / a, p = ue(l, i) / a;
    if (d >= 0 && d <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Jr = 0.5, jp = 3, qp = 1e-4;
function Zp(t, e, n) {
  const i = ae(t, e);
  if (!i) return null;
  const s = Up(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => Qr(k, n) || To(k, n, Jr).length > 0;
  if (!r(s)) return s;
  const l = ce(t, t.walls.find((k) => k.id === o.wallId)), a = i.normal, d = (k) => Math.abs(q(L(k, i.pt), a)) <= qp, p = ([k, _]) => D(T(k, _), 0.5), c = n.filter((k) => d(k[0]) && d(k[1]) && O(k[0], k[1]) > 1e-9 && !Qr(T(p(k), D(a, Jr)), n)), f = (k) => q(L(k, l.a), l.dir), h = ([k, _]) => Math.max(0, Math.min(f(k), f(_)) - o.offset, o.offset - Math.max(f(k), f(_))), m = Math.min(...c.map(h)), $ = c.filter((k) => h(k) <= m + 1e-6).map((k) => T(p(k), a)), w = (k) => $.some((_) => !Wp(k, _, n)), g = jp * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, _] of n) {
    const E = L(_, k), C = L(k, s), I = ue(l.dir, E);
    if (Math.abs(I) < 1e-12) continue;
    const V = ue(C, l.dir) / I;
    if (V < -1e-9 || V > 1 + 1e-9) continue;
    const N = ue(C, E) / I, R = O(k, _) / Math.abs(I);
    y.push(N - R, N + R);
  }
  const x = o.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= g).sort((k, _) => Math.abs(k) - Math.abs(_) || Math.sign(_) * x - Math.sign(k) * x);
  for (const k of M) {
    const _ = T(s, D(l.dir, k));
    if (!r(_) && w(_)) return _;
  }
  return null;
}
const Gp = 1 / Math.cos(uc / 2 * (Math.PI / 180)), el = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function Kp(t, e, n = pc) {
  const i = Fp(t, e), s = Zi(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = Zp(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((c) => O(c, r))) * Gp, a = To(r, o, l);
  if (a.length === 0) return [i];
  const d = Hp(r, a, l);
  let p;
  try {
    p = Ra.intersection(Ys(el(i)), Ys(el(d)));
  } catch {
    return [d];
  }
  return p.flatMap((c) => c.map(ja));
}
function Xp(t, e, n, i) {
  const s = ae(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, q(L(n, s.pt), s.dir)));
    return O(T(s.pt, D(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return O(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return O(s.pt, n) <= i;
  if (o.shape === "circle") return O(s.pt, n) <= o.diameter / 2 + i;
  const r = L(n, s.pt);
  return Math.abs(q(r, s.dir)) <= o.width / 2 + i && Math.abs(q(r, re(s.dir))) <= o.depth / 2 + i;
}
function gc(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Xp(t, i[o], e, n)) return i[o].id;
  return null;
}
const Yp = 60;
function Js(t, e, n) {
  if (!Na.has(e.props.kind)) return null;
  const i = ae(t, e);
  return i ? { from: i.pt, to: T(i.pt, D(i.dir, Yp / n)) } : null;
}
function bc(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function Qp(t, e, n, i) {
  const s = e.placement, o = ae(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = ze(L(n, o.pt)), l = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (s.mode === "free") return { ...s, rotation: zo(l(r)) };
  const a = fc(r - ze(o.normal)), d = Math.max(-Et, Math.min(Et, l(a)));
  return bc(s, d);
}
const Jp = 1, gi = 1, tl = 1e-6, ef = 1e-9, tf = 1e-6, nf = 1;
function Vo(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = gt(t, e.wallId);
      return n === null ? null : $n(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function pe(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => Vo(t, i) ?? { x: i.x, y: i.y });
}
function Ro(t, e) {
  const n = pe(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Ce(n)) / 1e5) / 10;
}
function Qt(t, e, n) {
  const i = ue(L(e, t), L(n, t));
  return Math.abs(i) <= ef * O(t, e) * O(t, n) ? 0 : Math.sign(i);
}
const zn = (t, e, n) => q(L(e, t), L(n, t)) <= 0;
function wc(t, e, n, i) {
  const s = Qt(n, i, t), o = Qt(n, i, e), r = Qt(t, e, n), l = Qt(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && zn(n, t, e) || l === 0 && zn(i, t, e) || s === 0 && zn(t, n, i) || o === 0 && zn(e, n, i);
}
function sf(t) {
  const e = [];
  for (const n of t) (e.length === 0 || O(e[e.length - 1], n) > tl) && e.push(n);
  for (; e.length > 1 && O(e[0], e[e.length - 1]) <= tl; ) e.pop();
  return e;
}
function bi(t) {
  const e = sf(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (Qt(s, o, r) === 0 && q(L(o, s), L(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && wc(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function vc(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Vo(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = gt(t, o.wallId);
    return r !== null && (o.offset < -gi || o.offset > r + gi);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = pe(t, e);
  return Math.abs(Ce(s)) < nf || bi(s) ? "crossing" : null;
}
function Bt(t, e) {
  return Dt(e, t) || t.some((n, i) => Ae(e, n, t[(i + 1) % t.length]) <= Jp);
}
const $c = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function of(t, e) {
  const n = ae(t, e);
  return n ? t.zones.filter((i) => Bt(pe(t, i), n.pt)).map((i) => ({ zone: i, participates: $c(e, i.id) })) : [];
}
function tt(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = pe(t, n), s = [];
  for (const o of t.devices) {
    const r = ae(t, o);
    r && Bt(i, r.pt) && s.push({ device: o, participates: $c(o, e) });
  }
  return s;
}
function rf(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Ce(t);
  if (Math.abs(n) > tf) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], d = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * d, s += (l.y + a.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (Dt(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const ws = 32;
function nl(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, Ae(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function yc(t) {
  const e = t.zones.map((s) => pe(t, s)), n = e.map((s) => Math.abs(Ce(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter(($, w) => w !== o && $.length >= 3 && n[w] < n[o] && $.every((g) => Bt(r, g))), a = rf(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const d = r.map(($) => $.x), p = r.map(($) => $.y), c = Math.min(...d), f = Math.min(...p), h = Math.max(Math.max(...d) - c, Math.max(...p) - f) / ws;
    let m = null;
    for (let $ = c + h / 2; $ < c + h * ws; $ += h)
      for (let w = f + h / 2; w < f + h * ws; w += h) {
        const g = { x: $, y: w };
        if (!Dt(g, r) || l.some((x) => Dt(g, x))) continue;
        const y = Math.min(nl(g, [r]), nl(g, l));
        (!m || y > m.d) && (m = { p: g, d: y });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const Bo = 3, Pt = (t, e) => ({ ...t, zones: e }), yn = (t, e, n) => Pt(t, t.zones.map((i) => i === e ? n : i)), Fo = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), xc = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function lf(t, e) {
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
function af(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && xc(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => lf(n, e.vertices[i]));
}
function kc(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && af(t.shape, e.shape);
}
function cf(t, e) {
  if (e.kind === "free") return e;
  const n = Vo(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : Fo(e);
}
function Mc(t, e) {
  const n = e.shape, i = n.vertices.map((s) => cf(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function df(t, e, n) {
  const i = t.shape, s = Qs(e, i.seed);
  return !s || n.some((o) => dc(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && xc(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function _c(t, e) {
  const n = vc(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const Uo = (t, e) => _c(t, Mc(t, e));
function uf(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? cc(t) : [], i = [], s = e.map((o) => _c(
    t,
    o.shape.kind === "walls" ? df(o, n, i) : Mc(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? Pt(t, s) : t;
}
function pf(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && kc(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : Pt(t, i) : s.some((o, r) => o !== n[r]) ? Pt(t, s) : t;
}
function ff(t, e, n) {
  const i = cc(t), s = Qs(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = Qs(i, r.shape.seed);
    if (l && dc(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: ne(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: Pt(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const Wo = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function hf(t, e, n) {
  if (e.length < Bo) return { level: t, zoneId: null };
  const i = Uo(t, { id: ne(), name: n, shape: { kind: "polygon", vertices: e.map(Wo) }, invalid: !1 });
  return bi(pe(t, i)) ? { level: t, zoneId: null } : { level: Pt(t, [...t.zones, i]), zoneId: i.id };
}
function mf(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : yn(t, i, { ...i, name: n });
}
function jo(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return yn(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return yn(t, i, o);
}
function Sc(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Ac(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? Sc(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function qo(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function Zo(t, e, n) {
  const i = Uo(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return kc(i, e) ? t : yn(t, e, i);
}
const Go = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function gf(t, e, n, i) {
  const s = qo(t, e);
  return !s || !Go(n, s.shape.vertices.length) ? t : Zo(t, s, s.shape.vertices.map((o, r) => r === n ? Wo(i) : o));
}
function bf(t, e, n, i) {
  const s = qo(t, e);
  if (!s || !Go(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, Wo(i)), Zo(t, s, o);
}
function wf(t, e, n) {
  const i = qo(t, e);
  return !i || i.shape.vertices.length <= Bo || !Go(n, i.shape.vertices.length) ? t : Zo(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function vf(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < Bo) return t;
  const i = n.shape.outline.map(Fo);
  return yn(t, n, Uo(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Cc(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Sc(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const xn = 1;
function Le(t) {
  return structuredClone(t);
}
function Gi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function $f(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Ki(t, e, n) {
  const i = te(t, e.a), s = te(t, e.b), o = O(i, s), r = $f(typeof n == "number" ? n : Fi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Ha(i, s, r / o), offset: r };
}
function yf(t) {
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
function Ic(t, e) {
  yf(t), e && _f(e, t);
  const n = uf(ac(Dn(t)));
  return e ? pf(n, e) : n;
}
function Be(t, e) {
  return Ic(Le(t), e);
}
function Ec(t, e, n) {
  const i = Ui(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Ki(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function il(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: te(t, e.nodeId), nodeId: e.nodeId };
  const n = Gi(t, e.wallId), { pt: i, offset: s } = Ki(t, n, e.offset), o = O(te(t, n.a), te(t, n.b));
  return s <= xn ? { pt: te(t, n.a), nodeId: n.a } : o - s <= xn ? { pt: te(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function sl(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: ne(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function xf(t, e, n, i) {
  const s = il(t, e), o = il(t, n);
  if (O(s.pt, o.pt) < xn) return { level: t, wallId: null, endNodeId: null };
  const r = Le(t), l = sl(r, s), a = sl(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const d = { id: ne(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: Be(r, t), wallId: d.id, endNodeId: a };
}
function Dc(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < xn || a - l < xn ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function kf(t, e, n, i, s) {
  const o = Dc(e, n, i.thickness, s);
  if (!o) return t;
  const r = Le(t), l = o.map((a) => {
    const d = { id: ne(), x: a.x, y: a.y };
    return r.nodes.push(d), d.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: ne(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Be(r, t);
}
function Mf(t, e, n) {
  const i = Le(t);
  return Ec(i, e, n), Ic(i, t);
}
function _f(t, e) {
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
    const p = Bi(L(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = Fi(T(o, D(p, c.offset)), l, a) * d);
  }
}
function Sf(t, e, n) {
  const i = Le(t), s = Gi(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: T(te(i, l), n) }));
  for (const l of r) Ec(i, l.id, l.to);
  return Be(i, t);
}
function Xi(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Lc(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function Af(t, e, n) {
  const i = Le(t), s = Gi(i, e), o = s[n], r = te(i, o), l = { id: ne(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || Lc(i, o, l.id), Xi(i), { level: Be(i, t), nodeId: l.id };
}
function Cf(t, e, n) {
  if (e === n) return t;
  const i = Le(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Lc(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), Xi(i), Be(i, t);
}
function Ko(t, e) {
  var i;
  const n = Le(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return Xi(n), Be(n, t);
}
function If(t, e, n) {
  const i = Le(t);
  return Object.assign(Gi(i, e), n), Be(i, t);
}
const be = (t) => typeof t == "string" && t !== "" ? t : null, Pc = (t) => t.split(".")[0], Ef = ["friendly_name", "device_class", "unit_of_measurement"];
function Oc(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: Pc(t),
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
function Df(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Oc(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Lf(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && Ef.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function Nc(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Pf(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Oc(r.entity_id, {});
    o.set(r.entity_id, {
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
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: be(r.name_by_user) ?? be(r.name) ?? r.id, model: be(r.model), areaId: be(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Of(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Tc(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Nc(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Nf = {
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
  "control.hint": "Buttons, wall switches and motion sensors switch the loads directly. A button toggles them (any load on: all off, else all on) or sets them on / off; a wall switch makes the loads repeat every on / off change of its relay; a motion sensor switches them on at motion and off when clear. A change made by a Load control rule is not repeated by another one, so put every load of a button into its own rule. Nothing is sent at start or Save, and a load that is unavailable at that moment is skipped.",
  "control.sources": "Sources",
  "control.loads": "Loads",
  "control.addSource": "Add a button, switch or motion sensor…",
  "control.addLoad": "Add a load…",
  "control.problem.sources": "Add a button, a wall switch or a motion sensor",
  "control.problem.loads": "Add a load",
  "control.flow.title": "Load control diagram",
  "control.flow.toggle": "toggle",
  "control.flow.onOff": "on / off",
  "control.flow.repeat": "repeated",
  "control.flow.sets": "Sets the loads",
  "control.flow.rule": "button: toggle (any on: all off) or on / off; switch, motion: repeat",
  "control.flow.motion": "motion",
  "control.flow.clear": "clear",
  "control.flow.noData": "no data",
  "control.flow.last": "last: {target} {did} {at} ({reason})",
  "control.flow.already": "last: {target} already {s} {at} ({reason})",
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
  "rules.problem.control": "Load control: pick wall switches, smart buttons or motion sensors as sources and different devices that can be switched on and off as loads, each only once.",
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
  return Nf[t] ?? t;
}
const Tf = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], zf = 10;
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
function zc() {
  return { blocks: [{ id: ne(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Hf(t, e, n, i) {
  const s = { id: ne(), x: e.x, y: e.y }, o = { ...s, name: `${u(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function ol(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Yi(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Vf(t, e, n, i) {
  return Yi(t, e, (s) => ({ ...s, x: n, y: i }));
}
const eo = (t) => "block" in t ? t.block : t.bus, Hc = (t, e) => eo(t.from) === e || eo(t.to) === e;
function kn(t, e, n, i) {
  const s = t.blocks.find((d) => d.id === e);
  if (!s) return t;
  const o = Yi(t, e, (d) => ({ ...d, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((d) => !Hc(d, e)) };
  const r = o.blocks.find((d) => d.id === e), l = new Set(Ft(r, i).map((d) => d.name)), a = (d) => "block" in d && d.block === e && !l.has(d.port);
  return o.wires.some((d) => a(d.from) || a(d.to)) ? { ...o, wires: o.wires.filter((d) => !a(d.from) && !a(d.to)) } : o;
}
function Vc(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Hc(i, e)) };
}
const Rc = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function Qi(t, e, n) {
  const i = Rc(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((d) => i.has(d.id)).map((d) => [d.id, new Set(Ft(d, n).map((p) => p.name))])), o = (d) => "block" in d && !!s.get(d.block) && !s.get(d.block).has(d.port), r = t.wires.filter((d) => !o(d.from) && !o(d.to));
  let l = !1;
  const a = t.blocks.map((d) => {
    const p = s.get(d.id);
    if (!p || !d.portPins || Object.keys(d.portPins).every((m) => p.has(m))) return d;
    l = !0;
    const c = Object.fromEntries(Object.entries(d.portPins).filter(([m]) => p.has(m))), { portPins: f, ...h } = d;
    return Object.keys(c).length ? { ...h, portPins: c } : h;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Rf(t, e) {
  const n = Xo(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = Qi(s, o, n);
  return s;
}
function Bf(t, e) {
  const n = Rc(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(eo(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const Xo = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Bc(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Np(t, n);
  return { level: s, power: i ? Bf(e, n) : Qi(e, n, Xo(s)) };
}
function Fc(t, e, n, i) {
  const s = rc(t, n, i);
  return { level: s, power: s === t ? e : Qi(e, n, Xo(s)) };
}
function Uc(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Ff(t, e, n, i) {
  return Yi(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function Uf(t, e) {
  return Yi(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function rl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Wf(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, zf), s = /* @__PURE__ */ new Map();
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
      const f = s.get(p.block);
      return f !== void 0 && p.port !== f && p.port !== (r.get(p.block) ?? "A") ? `x:${c.id}:${p.port}` : `n:${p.block}`;
    };
    for (const p of e) {
      const c = a(d(p.from, p)), f = a(d(p.to, p));
      if (c === f) return !0;
      l.set(c, f);
    }
  }
  return !1;
}
function ll(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = s.get(g.block), x = y ? Ft(y, i).find((M) => M.name === g.port) : void 0;
    return y && x ? { bl: y, dir: x.dir } : null;
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
  const p = (g) => "block" in g && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === g.block && x.port === g.port));
  if (p(a) || p(d)) return { error: "port-taken" };
  const c = (g) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === g && "block" in M) {
          const k = s.get(M.block);
          if (k) return rl(k, M.port);
        }
    return null;
  }, f = (g) => "bus" in g ? c(g.bus) : rl(s.get(g.block), g.port), h = f(a), m = f(d);
  if (h !== null && m !== null && h !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in d && s.get(d.block).kind === "remainder" && t.wires.some((g) => {
    var y;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && ((y = s.get(g.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const $ = { id: ne(), from: a, to: d }, w = [...t.wires, $];
  return Wf(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: $ };
}
const Pe = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Ct = (t) => typeof t == "number" && Number.isFinite(t), jf = ["top", "right", "bottom", "left"], qf = ["2in1out", "1in2out"];
function Zf(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Ct(n.w) && Ct(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !qf.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(Ft(n, e).map((d) => d.name)), o = {};
  let r = Pe(i);
  for (const [d, p] of Pe(i) ? Object.entries(i) : []) {
    if (!s.has(d) || !Pe(p) || !jf.includes(p.side) || !Ct(p.at)) {
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
function Gf(t, e) {
  if (!Pe(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const p of n)
    if (Pe(p) && typeof p.id == "string" && p.id && Tf.includes(p.kind) && Ct(p.x) && Ct(p.y)) {
      const c = Zf(p, e);
      c !== p && (s = !0), c.kind === "transfer" && c.form !== p.form && r.add(c.id), o.push(c);
    } else s = !0;
  const l = new Map(o.map((p) => [p.id, p])), a = (p) => {
    var f;
    if (!Pe(p)) return null;
    if (typeof p.bus == "string") {
      if (((f = l.get(p.bus)) == null ? void 0 : f.kind) !== "bus" || !Ct(p.at)) return null;
      const h = Math.min(1, Math.max(0, p.at));
      return h === p.at ? p : { bus: p.bus, at: h };
    }
    const c = typeof p.block == "string" ? l.get(p.block) : void 0;
    return c && !r.has(c.id) && Ft(c, e).some((h) => h.name === p.port) ? p : null;
  }, d = [];
  for (const p of i) {
    const c = Pe(p) ? a(p.from) : null, f = Pe(p) ? a(p.to) : null;
    if (!Pe(p) || typeof p.id != "string" || !p.id || !c || !f) {
      s = !0;
      continue;
    }
    c === p.from && f === p.to ? d.push(p) : (s = !0, d.push({ ...p, from: c, to: f }));
  }
  return s ? { ...t, blocks: o, wires: d } : t;
}
function Wc(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function Kf(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Ln = 11, wi = 18, vi = 30, Xf = 12, Yf = 120, ge = 14, al = 10, Mn = (t) => Math.round(t / al) * al || 0, vs = 24, cl = 6, Qf = 2 * Ln + 6, Jf = ge, eh = 1e6, dl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Ji = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), $s = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, jc = (t) => Math.min(1, Math.max(0, t));
function es(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function th(t, e) {
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
function Ie(t, e, n) {
  return n ? Jo(n, t, e).r : Yo(t, e);
}
function Yo(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(Yf, 7 * es(t, e).length + 32),
    h: vi + wi * th(t, e) + Xf
  };
}
function $i(t, e, n) {
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
function nh(t, e) {
  const n = Ji(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function ih(t, e) {
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
  return { side: i.side, at: jc(r) };
}
const _n = (t) => t.w >= t.h;
function qc(t, e) {
  return _n(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function sh(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = _n(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: $i(i, r, 0.5), side: r };
  }
  const s = Ji(i), o = _n(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: $i(i, o, e), side: o };
}
function oh(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const Qo = (t, e) => t.blocks.find((n) => n.id === e), to = (t, e) => {
  const n = Qo(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, ys = (t, e, n) => "block" in t && t.block === e && t.port === n;
function rh(t, e, n, i) {
  const s = t.wires.find((l) => ys(l.from, e, n) || ys(l.to, e, n));
  if (!s) return null;
  const o = ys(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = to(t, o.bus);
    return l ? qc(l, o.at) : null;
  }
  const r = Qo(t, o.block);
  return r ? Ji(Yo(r, i)) : null;
}
function Jo(t, e, n) {
  const i = Yo(e, n), s = Ji(i), o = Ft(e, n).map((d) => {
    var m;
    const p = (m = e.portPins) == null ? void 0 : m[d.name];
    if (p) return { ...d, side: p.side, pin: p, key: 0 };
    const c = rh(t, e.id, d.name, n), f = (c && nh(i, c)) ?? oh(e, d), h = c ?? s;
    return { ...d, side: f, pin: void 0, key: f === "top" || f === "bottom" ? h.x : h.y };
  }), r = (d) => {
    const p = o.filter((c) => c.side === d).length;
    return p ? (p + 1) * Qf : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((d, p) => {
    d.pin && (a[p] = { name: d.name, dir: d.dir, side: d.side, pt: $i(l, d.side, d.pin.at), pinned: !0 });
  });
  for (const d of ["top", "right", "bottom", "left"]) {
    const p = o.map((c, f) => ({ p: c, i: f })).filter(({ p: c }) => !c.pin && c.side === d).sort((c, f) => c.p.key - f.p.key || c.i - f.i);
    p.forEach(({ p: c, i: f }, h) => {
      a[f] = { name: c.name, dir: c.dir, side: d, pt: $i(l, d, (h + 1) / (p.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function ts(t, e, n) {
  return Jo(t, e, n).places;
}
function Zc(t, e, n) {
  const i = (d) => {
    if (!("block" in d)) return null;
    const p = Qo(t, d.block);
    if (!p) return null;
    const { r: c, places: f } = Jo(t, p, n), h = f.find((m) => m.name === d.port);
    return h ? { pt: h.pt, side: h.side, rect: c } : null;
  }, s = (d, p, c) => {
    if (!("bus" in d)) return null;
    const f = to(t, d.bus);
    if (!f) return null;
    let h = c == null ? void 0 : c.pt;
    if (!h && "bus" in p) {
      const m = to(t, p.bus);
      h = m && qc(m, p.at);
    }
    return h ? { ...sh(f, d.at, h), rect: Ie(f, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const Hn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), no = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function lh(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const d = Hn(i[i.length - 2], a), p = Hn(a, l);
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
  const o = Hn(i[0], i[1]), r = Hn(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || no(i[0], i[1]) < ge - 1e-9 || r.x !== -n.x || r.y !== -n.y || no(i[s - 2], i[s - 1]) < ge - 1e-9 ? null : i;
}
function ah(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function ch(t, e) {
  let n = (t.length - 2) * Jf;
  for (let i = 1; i < t.length; i++) {
    n += no(t[i - 1], t[i]);
    for (const s of e) ah(t[i - 1], t[i], s) && (n += eh);
  }
  return n;
}
function Gc(t, e) {
  const n = t.pt, i = e.pt, s = dl[t.side], o = dl[e.side], r = { x: n.x + s.x * ge, y: n.y + s.y * ge }, l = { x: i.x + o.x * ge, y: i.y + o.y * ge }, a = [t.rect, e.rect].filter((x) => !!x), d = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - ge, k[x] + k[M] + ge]),
    Math.min(r[x], l[x]) - ge,
    Math.max(r[x], l[x]) + ge
  ])], p = d("x", "w"), c = d("y", "h"), f = s.x === 0, h = o.x === 0, m = (f ? c : p).filter((x) => (x - (f ? n.y : n.x)) * (f ? s.y : s.x) >= ge - 1e-9), $ = (h ? c : p).filter((x) => (x - (h ? i.y : i.x)) * (h ? o.y : o.x) >= ge - 1e-9);
  let w = null, g = 1 / 0;
  const y = (x) => {
    const M = lh(x, s, o);
    if (!M) return;
    const k = ch(M, a);
    k < g - 1e-6 && (w = M, g = k);
  };
  if (f && h)
    for (const x of m) for (const M of p) for (const k of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!f && !h)
    for (const x of m) for (const M of c) for (const k of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (f)
    for (const x of m) for (const M of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, f ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Kc(t, e, n) {
  const i = Ie(t, e, n), s = i.x + (i.w - (3 * vs + 2 * cl)) / 2, o = i.y + vi + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (vs + cl), y: o, w: vs, h: wi - 2 }
  }));
}
function dh(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return _n(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function ul(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const p of s) {
    if (p.kind !== "transfer") continue;
    const c = Kc(p, i, t).find((f) => $s(e, f.rect, 0));
    if (c) return { kind: "chip", block: p.id, position: c.position };
  }
  let o = null, r = 1 / 0;
  for (const p of s)
    for (const c of ts(t, p, i)) {
      const f = O(e, c.pt);
      f <= Ln + n && f < r && (o = { kind: "port", block: p.id, port: c.name }, r = f);
    }
  if (o) return o;
  for (const p of s) {
    if (p.kind !== "bus") continue;
    let c = null, f = 1 / 0;
    for (const h of dh(p)) {
      const m = Ae(e, h.a, h.b);
      m <= n && m < f && (c = { kind: "bus-end", id: p.id, end: h.end }, f = m);
    }
    if (c) return c;
  }
  for (const p of s) {
    if (p.kind !== "bus" || !$s(e, Ie(p, i, t), n)) continue;
    const c = _n(p) ? (e.x - p.x) / p.w : (e.y - p.y) / p.h;
    return { kind: "bus", id: p.id, at: jc(c) };
  }
  let l = null, a = 1 / 0;
  for (const p of t.wires) {
    const c = Zc(t, p, i);
    if (!c) continue;
    const f = Gc(c.a, c.b);
    for (let h = 1; h < f.length; h++) {
      const m = Ae(e, f[h - 1], f[h]);
      m <= n && m < a && (l = { kind: "wire", id: p.id }, a = m);
    }
  }
  if (l) return l;
  const d = s.find((p) => p.kind !== "bus" && $s(e, Ie(p, i, t), 0));
  return d ? { kind: "block", id: d.id } : null;
}
function uh(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = Ie(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Xc extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function xs(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function ph(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function fh(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Xc(s.message) : s;
  }
}
async function hh(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const mh = 3;
function _e(t) {
  if (typeof t == "number")
    return t === mh ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class gh {
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
    const i = { ...e, id: ne(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await fh(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Xc ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = _e(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ns = (t) => (...e) => ({ _$litDirective$: t, values: e });
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
const Yc = (t) => t.strings === void 0, bh = {}, er = (t, e = bh) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wh = ns(class extends is {
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
var Qc = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", vh = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", $h = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", yh = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", xh = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", kh = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Mh = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", pl = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", jt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", _h = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Sh = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Ah = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Ch = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Jc = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Ih = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Eh = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Dh = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", ed = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Lh = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Ph = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Oh = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Nh = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Th = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", td = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", zh = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Hh = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", nd = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Vh = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Rh = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Bh = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Fh = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Uh = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", Wh = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", jh = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", qh = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Zh = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Gh = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", id = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", Kh = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", Xh = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Yh = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function sd(t, e, n) {
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
function Qh(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function Jh(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function em(t, e, n, i, s) {
  const o = Jh(e, n, i, s);
  if (!o.every((l) => Bt(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, Ae(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function tm(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? Qh(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const f of t.zones) {
    const h = pe(t, f);
    if (h.length < 3 || !Bt(h, n.pt)) continue;
    const m = Math.abs(Ce(h));
    m < a && (a = m, l = h);
  }
  if (!l) return r;
  const d = (f) => {
    const h = sd(f, i, s);
    return em(l, n.pt.x + h.x, n.pt.y + h.y, i.w, i.h);
  }, p = (f) => {
    let h = null, m = -1;
    for (const $ of f) {
      const w = d($);
      w !== null && w > m && (h = $, m = w);
    }
    return h;
  }, c = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const f = r === "up" || r === "down", h = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (d(r) !== null) return r;
    const m = c.filter(($) => f ? $.startsWith(r) : $.endsWith(r));
    return p(m) ?? p(f ? ["right", "left"] : ["down", "up"]) ?? (d(h) !== null ? h : r);
  }
  return p(["right", "left"]) ?? p(c) ?? p(["down", "up"]) ?? r;
}
const he = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Se(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function od(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${u("unit.m2")}`;
}
const Pn = 12, K = "non-scaling-stroke", nm = 7, im = 10, yi = "#f43f5e", fl = "3 2", hl = 18, sm = 6, ml = 11, om = 0.6, rm = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", rd = 24, Vn = 4, gl = 4, ti = Pn * 0.85, lm = 0.58;
function am(t, e, n, i) {
  const s = rd;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, d] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], p = a * i - 2 * gl, c = d * i - 2 * gl, f = e.length * lm * ti, h = s + Vn + ti, m = s + Vn + f, $ = Math.max(s, f), w = (M, k) => Math.max(0, M - p) + Math.max(0, k - c), g = w($, h), y = w(m, s);
  if (g > 0 && y < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Vn) / i,
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
    labelY: (x + s + Vn + ti / 2) / i,
    labelAnchor: "middle"
  };
}
function cm(t, e, n, i = 0, s = 0) {
  const o = rd / e;
  return customElements.get("ha-icon") ? S`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : S`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${rm} fill=${n}></path></g>`;
}
const dm = "__preview__", um = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, pm = /* @__PURE__ */ new WeakMap();
function fm(t, e) {
  var s;
  const n = Se(pm, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Se(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = Se(i, t.openings, () => ({})))[e] ?? (s[e] = pc(t, e));
}
const hm = /* @__PURE__ */ new WeakMap();
function ld(t, e) {
  const n = Zi(e.props.kind);
  if (!n) return [];
  const i = fm(t, n), s = Se(hm, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = Kp(t, e, () => i), s.set(e, o)), o;
}
function xi(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function mm(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, d = s ?? v;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? S`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></rect>` : l.shape === "spot" ? S`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${d} vector-effect=${K}></circle>` : S`<circle class="icon" r=${xi(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>`;
    case "wall_light":
      return S`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></path>`;
    case "motion_sensor": {
      const p = (c) => `M${e * c} ${-e * c * 0.8}A${e * c} ${e * c * 0.8} 0 0 1 ${e * c} ${e * c * 0.8}`;
      return S`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <path class="arcs" d=${p(1) + p(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    case "illuminance_sensor": {
      let p = "";
      for (let c = 0; c < 8; c++) {
        const f = c * Math.PI / 4;
        p += `M${Math.cos(f) * e * 1.15} ${Math.sin(f) * e * 1.15}L${Math.cos(f) * e * 1.6} ${Math.sin(f) * e * 1.6}`;
      }
      return S`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <path class="rays" d=${p} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    case "wall_switch":
      return S`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></rect>`;
    case "valve":
      return S`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${d} vector-effect=${K}></path>`;
    case "leak_sensor":
      return S`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${K}></path>`;
    case "smart_button":
      return S`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d}
        vector-effect=${K}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return S`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return S`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${K}></path>`;
    case "exhaust_fan": {
      let p = "";
      for (let c = 0; c < 4; c++) {
        const f = c * Math.PI / 2 + Math.PI / 4;
        p += `M0 0L${Math.cos(f) * e * 0.85} ${Math.sin(f) * e * 0.85}`;
      }
      return S`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${d} vector-effect=${K}></circle>
        <path class="blades" d=${p} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    default:
      return S`${v}`;
  }
}
function gm(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return S`${v}`;
  const l = am(r, r.label, i, e.scale), a = o ?? v, d = r.shape === "circle" ? S`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></circle>
      ${s ? S`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : v}` : S`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></rect>
      ${s ? S`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : v}`;
  return S`
    <g transform=${`rotate(${i})`}>${d}</g>
    ${cm(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${ti / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function bm(t, e, n = 0) {
  return t === "bound" ? v : S`<circle class=${`bind-ring bind-${t}`} r=${Math.max(Pn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${um[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : v} vector-effect=${K}></circle>`;
}
function wm(t, e, n) {
  if (t.status !== "error") return v;
  const i = e * 0.9, s = -e * 0.9, o = im / n.scale;
  return S`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${nm / n.scale} fill=${n.palette.background} stroke=${yi} stroke-width="1.5"
      vector-effect=${K}></circle>
    <path d=${Qc} fill=${yi} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function vm(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? yi : t === "event" ? e.selection : e.device;
}
function $m(t, e, n, i, s, o) {
  const r = [...i.shown.map((w) => [w, "bubble-in"]), ...i.leaving.map((w) => [w, "bubble-out"])];
  if (r.length === 0) return v;
  const l = 1 / o.scale, a = r.map(([w]) => (w.text.length * ml * om + 2 * sm) * l), d = hl * l, p = (hl + 2) * l, c = { w: Math.max(...a), h: d + p * (r.length - 1) }, f = s + 4 * l, h = Math.max(1, i.shown.length), m = tm(t, e, n, { w: Math.max(...a.slice(0, h)), h: d + p * (h - 1) }, f), $ = sd(m, c, f);
  return S`${r.map(([w, g], y) => {
    const x = a[y], M = $.x + (c.w - x) / 2, k = $.y + (m.startsWith("up") ? r.length - 1 - y : y) * p, _ = vm(w.tone, o.palette);
    return wh(`${g}:${w.key ?? ""}`, S`<g class=${`bubble ${g}`} data-tone=${w.tone}>
      <rect x=${M} y=${k} width=${x} height=${d} rx=${d / 2} fill=${o.palette.background} stroke=${_} stroke-width="1.5"
        vector-effect=${K}></rect>
      <text x=${M + x / 2} y=${k + d / 2} text-anchor="middle" dominant-baseline="central" fill=${_} font-weight="700"
        font-size=${ml * l} font-family="system-ui, sans-serif">${w.text}</text>
    </g>`);
  })}`;
}
function ym(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : xi(t, Pn / e.scale);
}
function xm(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? $m(t, e, n, s, ym(e, i), i) : v;
  return o === v ? v : S`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : v}>${o}</g>`;
}
function km(t, e, n, i) {
  var x, M, k;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = Pn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, d = !i && Ri(t.props.kind), p = d ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, c = i || (k = n.live) == null ? void 0 : k.call(n, t), f = (c == null ? void 0 : c.look) === "on" || (c == null ? void 0 : c.look) === "active", h = d && !!n.containerState && !p || (c == null ? void 0 : c.look) === "no-data", m = t.props.kind, $ = !f || t.invalid ? o : m === "leak_sensor" ? yi : m === "motion_sensor" ? s.motionCone : o, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (h ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, xi(t, r));
  return S`
    <g class=${w} data-id=${t.id} opacity=${g} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? S`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${K}></circle>` : v}
      ${t.props.kind === "equipment" ? gm(t, n, o, l, f, h ? fl : void 0) : S`<g transform=${`rotate(${l})`}>${mm(
    t,
    r,
    $,
    f ? $ : s.deviceFill,
    h ? fl : void 0,
    f ? s.deviceFill : $,
    (c == null ? void 0 : c.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? bm(n.bindingStatus(t), n.scale, xi(t, r)) : v}
      ${p ? wm(p, r, n) : v}
    </g>`;
}
function bl(t, e, n, i) {
  const s = ld(t, e);
  if (s.length === 0) return v;
  const o = n.palette, r = e.invalid ? o.invalid : Zi(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, a = s.map(he).join("");
  return e.props.kind === "ceiling_light" ? S`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${K}></path>` : S`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${K}></path>`;
}
function Mm(t, e, n, i) {
  const s = ld(t, e);
  let o = 0;
  for (const d of s) for (const p of d) o = Math.max(o, Math.hypot(p.x - n.pt.x, p.y - n.pt.y));
  o === 0 && (o = Pn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : v;
  return S`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? S`<path class="light-fill" d=${s.map(he).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : S`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function _m(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return v;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? Js(t, i, e.scale) : null;
  if (!s) return v;
  const o = e.palette.selection;
  return S`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${K}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${K} style="cursor:grab"></circle>
  </g>`;
}
function Sm(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = ae(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: dm, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = ae(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return S`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return v;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? Mm(t, i.d, i.pose, e) : v : o === "motion_sensor" && s === "active" ? bl(t, i.d, e, !1) : v;
    }
    return bl(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => km(i.d, i.pose, e, i.preview))}</g>
    ${_m(t, e)}
    ${e.bubbles ? S`<g class="bubbles">${n.map((i) => i.preview ? v : xm(t, i.d, i.pose, e))}</g>` : v}`;
}
const wl = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], tr = (t) => wl[t % wl.length], pt = "non-scaling-stroke", Am = "0.55", Cm = /* @__PURE__ */ new WeakMap();
function Im(t, e, n, i) {
  const s = i.palette, o = tr(n), r = i.selectedId === e.id, l = Se(Cm, t, yc).get(e.id), a = 12 / i.scale;
  return S`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${he(pe(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? v : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${pt}
        opacity=${i.selectedId !== null && !r ? Am : v}></path>
      ${l ? S`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${od(Ro(t, e))}</tspan>
      </text>` : v}
    </g>`;
}
function Em(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return S`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => S`
      <path class="zone" data-id=${o.id} d=${he(pe(t, o))} fill="none" stroke=${tr(r)} stroke-width="1"
        vector-effect=${pt}></path>`)}</g>`;
  const s = 8 / e.scale;
  return S`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Im(t, o, r, e))}</g>`;
}
function Dm(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return S`<g class="zone-members">${tt(t, e).map(({ device: o, participates: r }) => {
    const l = ae(t, o);
    return l ? r ? S`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${pt}></circle>` : S`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${pt}></circle>` : v;
  })}</g>`;
}
function Lm(t, e, n) {
  if (e.shape.kind !== "polygon") return v;
  const i = n.palette, s = e.shape.vertices;
  return S`${pe(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, d = n.vertex === r;
    return S`<circle class=${`zone-vertex${a ? " lost" : ""}${d ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${d ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${pt}></circle>`;
  })}`;
}
function Pm(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return S`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${pt}></polyline>`;
}
function Om(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return S`<g class="zone-overlay">
    ${n ? S`<path class="zone-outline" data-id=${n.id} d=${he(pe(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${pt}></path>` : v}
    ${n ? Dm(t, n.id, e) : v}
    ${n ? Lm(t, n, e) : v}
    ${e.draft ? Pm(e.draft, e) : v}</g>`;
}
function ct(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Nm = /* @__PURE__ */ new WeakMap(), Tm = /* @__PURE__ */ new WeakMap(), ad = /* @__PURE__ */ new WeakMap();
function ss(t, e, n) {
  const i = re(t.dir), s = T(t.a, D(t.dir, e)), o = T(t.a, D(t.dir, n));
  return [T(s, D(i, t.leftOff)), T(o, D(i, t.leftOff)), L(o, D(i, t.rightOff)), L(s, D(i, t.rightOff))];
}
function Sn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ce(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const Y = "non-scaling-stroke";
function zm(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = Sn(t, l.id);
    if (!a) continue;
    const d = re(a.dir);
    for (const [p, c, f] of [[l.a, a.a, a.dir], [l.b, a.b, D(a.dir, -1)]]) {
      const h = t.nodes.find((k) => k.id === p);
      if (!h || h.host || n.get(p) !== 1) continue;
      const m = T(c, D(d, a.leftOff + i)), $ = L(c, D(d, a.rightOff + i)), w = D(d, 1), g = D(T(m, $), 0.5), y = T(L(g, D(w, -o)), D(f, s / 2)), x = L(L(g, D(w, o)), D(f, s / 2)), M = [m, y, x, $];
      r.push(S`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${Y}></path>`);
    }
  }
  return r.length ? S`${r}` : v;
}
function Hm(t, e, n) {
  const i = re(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : D(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], d = T(T(t.a, D(t.dir, l)), D(o, r)), p = T(T(t.a, D(t.dir, a)), D(o, r)), c = T(d, D(o, e.width)), f = ue(L(c, d), L(p, d)) > 0 ? 1 : 0;
  return S`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${Y}></line>
    <path d=${`M${c.x} ${c.y}A${e.width} ${e.width} 0 0 ${f} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${Y}></path>`;
}
function Vm(t, e, n) {
  const i = re(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = T(T(t.a, D(t.dir, e.offset)), D(i, r)), a = T(T(t.a, D(t.dir, e.offset + e.width)), D(i, r));
    return S`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${Y}></line>`;
  });
  return S`${o}`;
}
function Rm(t, e, n) {
  const i = Sn(t, e.wallId);
  if (!i) return v;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = ss(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return S`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${he(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Hm(i, e, o) : e.kind === "window" ? Vm(i, e, o) : v}
    </g>`;
}
function vl(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = T(t, D(n, i)), a = T(e, D(n, i)), d = (c, f) => {
    const h = T(f, D(n, i + r));
    return S`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${Y}></line>`;
  }, p = T(D(T(l, a), 0.5), D(n, 9 / s.scale));
  return S`
    <g class="dim">
      ${d(T(t, D(n, 2 / s.scale)), t)}${d(T(e, D(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${Y}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${ct(O(t, e))}</text>
    </g>`;
}
function Bm(t, e) {
  const n = e.selection;
  if (!n) return v;
  const i = e.palette, s = 4 / e.scale, o = (r) => S`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : v;
  }
  if (n.kind === "wall") {
    const r = Se(ad, t, Wi).get(n.id), l = Sn(t, n.id);
    if (!r || !l) return v;
    const a = re(l.dir);
    return S`
      <path d=${he(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${Y}></path>
      ${o(l.a)}${o(l.b)}
      ${vl(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((f) => f.id === n.id), l = r ? Sn(t, r.wallId) : null;
    if (!r || !l) return v;
    const a = D(re(l.dir), -1), d = l.rightOff + 18 / e.scale, p = (f) => T(l.a, D(l.dir, f)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return S`
      <path d=${he(ss(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${Y}></path>
      ${c.filter(([f, h]) => h - f >= 1).map(([f, h]) => vl(p(f), p(h), a, d, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? S`<path class="zone-pick" d=${he(pe(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${Y}></path>` : v;
  }
  return v;
}
function Fm(t, e, n) {
  return O(t, e) < 1e-6 ? null : ss(Fa(t, e, n.thickness, n.baseline), 0, O(t, e));
}
function Um(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? Sn(t, r.wallId) : null;
  return S`
    ${o ? S`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${Y}></path>` : v}
    ${(n.walls ?? []).map((a) => {
    const d = Fm(a.a, a.b, a.props);
    return S`<g class="preview-wall">
        ${d ? S`<path d=${he(d)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${Y}></line></g>`;
  })}
    ${r && l ? S`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${he(ss(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${jm(t, e)}`;
}
function Wm(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return S`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${Y}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${Y}></rect></g>`;
}
function jm(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Wm(n.anchor, e) : v, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / e.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let p, c = v;
  if (o.kind === "node" || o.kind === "corner") {
    const h = r(5);
    p = S`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - h} y=${a - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${Y}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${l} ${a - h}L${l + h * 0.866} ${a + h / 2}L${l - h * 0.866} ${a + h / 2}Z`;
    p = S`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${Y}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const h = r(7), m = `M${l} ${a - h}L${l + h} ${a}L${l} ${a + h}L${l - h} ${a}Z`;
    p = S`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${d.stroke} stroke-width="5"
      vector-effect=${Y}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${Y}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const h = r(5), m = `M${l - h} ${a - h}L${l + h} ${a + h}M${l - h} ${a + h}L${l + h} ${a - h}`;
    p = S`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${Y}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${Y}></path></g>`;
    const $ = o.endpoint.kind === "wall" ? Se(ad, t, Wi).get(o.endpoint.wallId) : void 0;
    $ && (c = S`<path class="snap-wall-hl" d=${he($)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${Y}></path>`);
  } else {
    const h = r(4), m = `M${l - h} ${a}H${l + h}M${l} ${a - h}V${a + h}`;
    p = S`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${Y}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${Y}></path></g>`;
  }
  const f = u(`snapmark.${o.kind}`);
  return S`
    ${c}${s}${p}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${Y} font-family="system-ui, sans-serif">${f}</text>`;
}
function qm(t, e) {
  var f;
  const n = e.preview.level ?? t, i = e.palette, s = Se(Nm, n, (h) => qa(h, !0)), o = n.walls.filter((h) => h.type === "railing" || h.type === "fence"), r = o.length ? Se(Tm, n, No) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", d = a ? v : String(i.dimOpacity), p = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, c = e.mode ?? "plan";
  return S`
    ${Em(n, { palette: i, scale: e.scale, selectedId: p, mode: c === "automation" ? "plan" : c })}
    <path class="walls" d=${s.map((h) => h.map(he).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${d}></path>
    ${r ? S`<g class="railings" opacity=${d}>${o.flatMap((h) => (r.get(h.id) ?? []).map((m) => S`<path d=${he(m)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${d}>${n.openings.map((h) => Rm(n, h, e))}</g>
    <g class="wall-breaks" opacity=${d}>${zm(n, e)}</g>
    ${a ? Om(n, {
    palette: i,
    scale: e.scale,
    selectedId: p,
    draft: e.preview.zoneDraft,
    vertex: ((f = e.preview.zoneVertex) == null ? void 0 : f.zoneId) === p ? e.preview.zoneVertex.index : null
  }) : v}
    <g class="devices-layer">${a ? v : Sm(n, {
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
    <g class="selection">${Bm(n, e)}</g>
    <g class="preview">${Um(n, e)}</g>`;
}
const xe = "non-scaling-stroke", An = "system-ui, sans-serif", Zm = 13, nn = 9, Gm = 11, $l = 18, ks = 12, Ms = 11, Rn = 13, Km = 3, ni = 10, yl = 4.5, Xm = 12, Ym = 11.5, nr = 10, _s = 10.5, Qm = 6, Jm = {
  IN: Nh,
  OUT: td,
  BAT: Th,
  PV: nd
}, xl = { dead: 0, nodata: 1, idle: 2, live: 3 };
function _t(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Ss = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function eg(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function On(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const tg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, ng = S`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, cd = (t, e, n, i) => S`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${xe}>${i ? v : ng}</path>`, dd = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Ot = (t, e, n, i) => S`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function ig(t, e) {
  var d;
  const n = (d = t.live) == null ? void 0 : d.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (p) => "block" in p ? Ln : nn, s = t.pts[0], o = t.pts[t.pts.length - 1], r = ni / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((p, c) => ({ p: t.pts[c], q: p, len: Math.abs(p.x - t.pts[c].x) + Math.abs(p.y - t.pts[c].y) })).sort((p, c) => c.len - p.len);
  for (const { p, q: c, len: f } of a) {
    if (f < 2 * r + 2 * l) continue;
    const h = { x: (p.x + c.x) / 2, y: (p.y + c.y) / 2 }, m = (w, g) => Math.hypot(h.x - w.x, h.y - w.y) >= g + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const $ = Math.atan2(c.y - p.y, c.x - p.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: h, deg: (($ + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function sg(t, e, n) {
  var d;
  const i = e.palette, s = On(t.style, i), o = dd(t.pts), r = ((d = e.selection) == null ? void 0 : d.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = ig(t, e);
  return S`<g data-wire=${t.w.id}>
    ${r ? S`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${xe}></path>` : v}
    ${t.style === "live" ? cd("glow", o, s, n) : v}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${xe}></path>
    ${a ? S`<path class="arrow" d=${`M${ni / 2} 0L${-ni / 2} ${-yl}L${-ni / 2} ${yl}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : v}
  </g>`;
}
function og(t, e, n) {
  const i = Jm[t.name];
  return S`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Ln} fill=${n.portFill}
      stroke=${e ? On(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${xe}></circle>
    ${i ? Ot(i, t.pt, Zm, n.portIcon) : S`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${An}>${t.name}</text>`}
  </g>`;
}
function rg(t, e) {
  const n = Math.max(4, Math.floor(e / (nr * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function lg(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((d) => d.id === l);
    return a ? es(a, n) || u(`power.kind.${a.kind}`) : l;
  }), o = u("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", rg(s[0], i - 12 - o.replace("{name}", "").length * nr * 0.55)) : u("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function ag(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: _t(i == null ? void 0 : i.power) }), l = (d) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: d });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Ss(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const d = n.device(e.deviceId);
      if (!d) return [{ kind: "text", value: u("power.missing"), fill: s.blockInvalid }];
      const p = d.bindings ?? {}, c = Vt(d), f = [];
      return c ? (p.power_in && f.push({ kind: "text", label: u("power.in"), value: _t(i == null ? void 0 : i.power_in) }), p.power_out && f.push({ kind: "text", label: u("power.out"), value: _t(i == null ? void 0 : i.power_out) })) : p.power && f.push(r()), p.voltage && f.push({ kind: "text", value: Ss(i == null ? void 0 : i.voltage, "V") }), p.control && f.push(l(sc(d))), c && f.push({ kind: "text", label: u("power.loss"), value: _t(i == null ? void 0 : i.loss) }), f;
    }
    case "battery":
      return [{ kind: "text", label: u("power.soc"), value: Ss(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: u("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), lg(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function cg(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : ks + 3, o = e.x - s / 2, r = `${u(`power.switch.${i}`)}${t.controllable ? "" : ` · ${u("power.readOnly")}`}`;
  return S`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${Ot(
    i === "on" ? Ch : Ah,
    { x: o, y: e.y },
    $l,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? v : Ot(Lh, { x: o + $l / 2 + 3 + ks / 2, y: e.y + 1 }, ks, n.blockValue)}
  </g>`;
}
function kl(t, e, n) {
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
function dg(t, e, n) {
  const i = 2 * (t.w + t.h), s = kl(t, e.side, e.pt), o = ((kl(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, d = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((p) => ({ c: p, d: ((p.t - s) * r % i + i) % i })).filter(({ d: p }) => p > 0 && p < l).sort((p, c) => p.d - c.d).map(({ c: p }) => p.pt);
  return [e.pt, ...d, n.pt];
}
function ug(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return v;
  const l = ts(t, e, i.geo), a = l.find((h) => h.name === r), d = l.find((h) => h.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !d) return v;
  const p = s(d.name) ?? "nodata", c = On(p, i.palette), f = dd(dg(Ie(e, i.geo, t), a, d));
  return S`${p === "live" ? cd("ts-glow", f, c, o) : v}
    <path class="ts-path" d=${f} fill="none" stroke=${c} stroke-width="3" stroke-dasharray=${p === "nodata" ? "5 4" : v}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${xe}></path>`;
}
function pg(t, e, n, i) {
  const s = i.palette;
  return Kc(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return S`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${xe}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${An}>${o}</text>
    </g>`;
  });
}
function fg(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? u("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? u("power.alert.missingDevice") : t === "disagree" ? u("power.alert.disagree") : t;
}
function hg(t, e, n, i) {
  const s = Km + Rn / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: d }) => {
    const p = Math.max(Math.abs(d.x - a.x) - Rn / 2, 0), c = Math.max(Math.abs(d.y - a.y) - Rn / 2, 0);
    return Math.hypot(p, c) > Ln;
  }), l = o.find(r) ?? o[0];
  return S`<g class="alert"><title>${t.map(fg).join(`
`)}</title>
    ${Ot(Qc, l, Rn, i.blockInvalid)}</g>`;
}
function mg(t, e, n, i, s) {
  var $, w;
  const o = n.palette, r = Ie(e, n.geo, t), l = ($ = n.frame) == null ? void 0 : $.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, d = e.kind === "device" && !a, p = r.x + r.w / 2, c = es(e, n.geo) || u(`power.kind.${e.kind}`), f = ag(t, e, n.geo, l, o, r.w), h = e.kind === "remainder", m = ts(t, e, n.geo);
  return S`<g class=${`block block-${e.kind}${d ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${h ? o.powerRemainder : o.blockStroke} stroke-width=${h ? 1.5 : 1.25}
      stroke-dasharray=${h ? "6 4" : v} vector-effect=${xe}></rect>
    ${e.kind === "transfer" ? ug(t, e, l, n, (g) => i(e.id, g), s) : v}
    ${a && a.placement.mode !== "none" ? S`<g class="pin"><title>${u("power.planDevice")}</title>
      ${Ot(Ph, { x: r.x + 4 + Ms / 2, y: r.y + 4 + Ms / 2 }, Ms, o.blockValue)}</g>` : v}
    <text class="name" x=${p} y=${r.y + vi - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${Xm} font-weight="600" fill=${o.blockName} font-family=${An}>${c}</text>
    ${f.map((g, y) => {
    const x = r.y + vi + y * wi + wi / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? pg(t, e, l, n) : v;
    if (g.kind === "switch") return cg(g, { x: p, y: x }, o);
    const M = g.fill ?? o.blockValue, k = g.label ? S`<tspan>${g.label} </tspan>` : v, _ = g.note ? S`<tspan> ${g.note}</tspan>` : v;
    return S`<text x=${p} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? nr : Ym}
        fill=${M} font-family=${An}>${g.title ? S`<title>${g.title}</title>` : v}${k}<tspan
        font-weight=${g.small ? v : "600"}>${g.value}</tspan>${_}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? hg(l.alert, r, m, o) : v}
    ${m.map((g) => og(g, i(e.id, g.name), o))}
  </g>`;
}
function gg(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let d = v;
  const p = t.name ?? "", c = Math.min(_s, a - 4), f = c >= Qm, h = p.length * (f ? c : _s) * 0.58 + 12;
  if (p) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, y) => g - y);
    let $ = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, l + nn]) {
      const y = Math.min(g - nn, l);
      y - w > $.hi - $.lo && ($ = { lo: w, hi: y }), w = Math.max(w, g + nn);
    }
    if ($.hi - $.lo >= h) {
      const g = ($.lo + $.hi) / 2, y = o ? { x: g, y: f ? t.y + t.h / 2 : t.y - 7 } : { x: f ? t.x + t.w / 2 : t.x - 7, y: g };
      d = S`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${f ? c : _s} fill=${s.blockValue} font-family=${An}
        transform=${o ? v : `rotate(-90 ${y.x} ${y.y})`}>${p}</text>`;
    }
  }
  return S`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? On(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${xe}></rect>
    ${d}
  </g>`;
}
function bg(t, e, n) {
  return S`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${nn} fill=${n.portFill} stroke=${On(e, n)} stroke-width="1.5"
      vector-effect=${xe}></circle>
    ${Ot(Mh, t, Gm, n.portIcon)}
  </g>`;
}
function wg(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const s = Ie(i, e.geo, t), o = 4 / e.scale;
  return S`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${xe}></rect>`;
}
function vg(t, e) {
  var f;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const h of n.wires) {
    const m = Zc(n, h, e.geo);
    if (!m) continue;
    const $ = (f = e.frame) == null ? void 0 : f.wires[h.id];
    s.push({ w: h, a: m.a, b: m.b, pts: Gc(m.a, m.b), live: $, style: eg($) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const h of s)
    for (const [m, $] of [[h.w.from, h.a], [h.w.to, h.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, h.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || xl[h.style] > xl[w]) && r.set(m.bus, h.style), l.set(m.bus, [...l.get(m.bus) ?? [], $.pt]), a.push({ at: $.pt, style: h.style });
    }
  const d = (h, m) => o.get(`${h}:${m}`), p = tg(), c = e.preview.wireDraft;
  return S`<g class="power">
    <g class="buses">${n.blocks.map((h) => h.kind === "bus" ? gg(h, l.get(h.id) ?? [], r.get(h.id), e) : v)}</g>
    <g class="wires">${s.map((h) => sg(h, e, p))}</g>
    ${wg(n, e)}
    <g class="blocks">${n.blocks.map((h) => h.kind === "bus" ? v : mg(n, h, e, d, p))}</g>
    <g class="terminals">${a.map((h) => bg(h.at, h.style, i))}</g>
    ${c ? S`<line class="wire-draft" x1=${c.from.x} y1=${c.from.y} x2=${c.to.x} y2=${c.to.y}
      stroke=${c.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${xe}></line>` : v}
  </g>`;
}
const $g = {
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
}, yg = {
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
function xg(t) {
  return t ? $g : yg;
}
class kg extends is {
  constructor(e) {
    if (super(e), e.type !== We.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? $e : (er(e), n);
  }
}
const G = ns(kg), io = 1, Ml = 1e-6;
function Mg(t, e, n, i, s) {
  const o = (a) => a > Ml && a < s - Ml, r = new Set(t.nodes.filter((a) => {
    var d;
    return ((d = a.host) == null ? void 0 : d.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const d = Ui(t, a).host.offset;
    o(d) && l.push({ t: d, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some(($) => $ === e.a || $ === e.b || r.has($))) continue;
    const d = te(t, a.a), p = te(t, a.b), c = O(d, p), f = c === 0 ? null : Me(n, i, d, L(p, d));
    if (!f) continue;
    const h = Fi(f, d, p) * c;
    if (h < -io || h > c + io) continue;
    const m = q(L(f, n), i);
    o(m) && l.push({ t: m, wall: a, pt: f });
  }
  return l;
}
function _l(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Sl(t, e) {
  if ("nodeId" in e)
    return delete Ui(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (O(te(t, o), e.pt) <= io) return o;
  const { pt: n, offset: i } = Ki(t, e.wall, e.pt), s = { id: ne(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function _g(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = te(t, i.a), o = te(t, i.b), r = O(s, o), l = Bi(L(o, s)), a = q(L(n, s), l), d = Mg(t, i, s, l, r), p = _l(d.filter((g) => g.t < a), a), c = _l(d.filter((g) => g.t > a), a);
  if (!p && !c) return Ko(t, e);
  const f = Le(t), h = f.walls.find((g) => g.id === e);
  let m = e, $ = 0;
  if (c) {
    const g = Sl(f, c);
    if ($ = q(L(te(f, g), s), l), p) {
      const y = { ...h, id: ne(), a: g };
      f.walls.push(y), m = y.id;
    } else
      h.a = g;
  }
  p && (h.b = Sl(f, p));
  const w = (g, y) => g.wallId !== e || p && y <= p.t ? !0 : !c || y < c.t ? !1 : (g.wallId = m, g.offset -= $, !0);
  f.openings = f.openings.filter((g) => w(g, g.offset + g.width / 2)), f.devices = f.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of f.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of f.zones) {
    const y = g.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : Fo(x)));
  }
  return Xi(f), Be(f, t);
}
function ir(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Sg(t, e, n) {
  return T(t, D(Bi(L(e, t)), n));
}
function Bn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function ft(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? ir(r, e) : e, d = r !== void 0 && a.y === r.y, p = (k) => !r || Math.abs(d ? k.y - r.y : k.x - r.x) <= 1;
  let c = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const _ = { x: k.x, y: k.y }, E = O(_, a);
    E <= i && p(_) && (!c || E < c.d) && (c = { id: k.id, pt: _, d: E });
  }
  let f = null;
  for (const k of n.corners ?? []) {
    const _ = O(k.pt, a);
    _ <= i && p(k.pt) && (!f || _ < f.d) && (f = { c: k, d: _ });
  }
  if (f && (!c || f.d < c.d)) {
    const k = f.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: f.c };
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const h = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: ce(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: _ } of h) {
    const E = { x: (_.a.x + _.b.x) / 2, y: (_.a.y + _.b.y) / 2 }, C = O(E, a);
    C <= i && p(E) && (!m || C < m.d) && (m = { wallId: k.id, pt: E, offset: _.len / 2, d: C });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const $ = (k) => {
    let _ = null;
    for (const { w: E, f: C } of h) {
      const I = re(C.dir), V = k ? [C.leftOff, -C.rightOff].filter((N) => N !== 0) : [0];
      for (const N of V) {
        const R = T(C.a, D(I, N)), Z = r ? Me(r, L(a, r), R, C.dir) : T(R, D(C.dir, q(L(a, R), C.dir)));
        if (!Z) continue;
        const X = q(L(Z, R), C.dir);
        if (X < 0 || X > C.len) continue;
        const ie = O(Z, a);
        ie <= i && (!_ || ie < _.d) && (_ = { d: ie, res: { pt: Z, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: X } } });
      }
    }
    return _ ? _.res : null;
  }, w = $(!1);
  if (w) return w;
  const g = $(!0);
  if (g) return g;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const _ of k) {
      const E = O(_, a);
      E <= i && p(_) && (!x || E < x.d) && (x = { pt: _, d: E });
    }
  if (x) return Bn(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let _ = 0; _ < k.length; _++) {
      const E = k[_], C = k[(_ + 1) % k.length], I = O(E, C);
      if (I < 1e-9) continue;
      const V = D(L(C, E), 1 / I), N = r ? Me(r, L(a, r), E, V) : T(E, D(V, q(L(a, E), V)));
      if (!N) continue;
      const R = q(L(N, E), V);
      if (R < 0 || R > I) continue;
      const Z = O(N, a);
      Z <= i && (!M || Z < M.d) && (M = { pt: N, d: Z });
    }
  if (M) return Bn(M.pt, "zoneEdge");
  if (s && s > 0) {
    const k = (E) => Math.round(E / s) * s, _ = r ? d ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return Bn(_, "grid");
  }
  return Bn(a, "none");
}
function Ag(t, e, n) {
  return e.some((i, s) => Ae(t, i, e[(s + 1) % e.length]) <= n);
}
function sr(t, e, n) {
  const i = Wi(t);
  for (const [s, o] of i) if (Dt(e, o)) return s;
  for (const [s, o] of i) if (Ag(e, o, n)) return s;
  return null;
}
function Cg(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = ce(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = et(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Ig(t, e, n, i) {
  const s = Cg(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((d) => d.id === l);
        if (a && O(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = sr(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const os = 3, Eg = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => pe(t, n)).filter((n) => n.length >= 3);
function ud(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? ir(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = ft(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Eg(e, s), corners: Ua(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = gt(e, l.wallId), d = a !== null && l.offset >= -gi && l.offset <= a + gi, p = d ? Math.max(0, Math.min(a, l.offset)) : l.offset, c = d ? $n(e, l.wallId, l.side, p) : null;
    if (c) return { vertex: { kind: "wall", wallId: l.wallId, offset: p, side: l.side, x: c.x, y: c.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = et(ce(e, l), n.pt).side >= 0 ? "left" : "right", d = $n(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: d.x, y: d.y }, snap: { ...o, pt: d } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function pd(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = pe(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => Ae(e, l, o[(a + 1) % o.length]) <= n) || Bt(o, e)) && i.push({ id: s.id, area: Math.abs(Ce(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function fd(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: pe(t, n), v: n.shape.vertices } : null;
}
function Dg(t, e, n, i) {
  var r;
  const s = (r = fd(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    O(n, l) <= i && (o < 0 || O(n, l) < O(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Lg(t, e, n, i) {
  const s = fd(t, e);
  if (!s || s.o.some((w) => O(n, w) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((w, g) => {
    const y = Ae(n, w, o[(g + 1) % o.length]);
    y <= i && y < a && (l = g, a = y);
  }), l < 0) return null;
  const d = o[l], p = o[(l + 1) % o.length], c = Math.max(0, Math.min(1, Fi(n, d, p))), f = Ha(d, p, c), h = r[l], m = r[(l + 1) % r.length], $ = h.kind === "wall" && m.kind === "wall" && h.wallId === m.wallId && h.side === m.side ? { kind: "wall", wallId: h.wallId, side: h.side, offset: h.offset + c * (m.offset - h.offset), x: f.x, y: f.y } : { kind: "free", x: Math.round(f.x), y: Math.round(f.y) };
  return { index: l + 1, vertex: $ };
}
function Pg(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, d = { x: 0, y: 0 }, p = null, c = [];
  const f = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, h = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => p && p.zoneId === f() ? p : null;
  function $(w) {
    if (!i || !s || !a && O(w.pt, d) <= os / t.scale()) return;
    a = !0;
    const g = ud(t, s, w, i.from, i.zoneId);
    r = g.snap, l = w.shift, o = gf(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      c = [c[c.length - 1] ?? null, t.selection()];
    },
    press(w) {
      h(), p = null, d = w.pt;
      const g = f(), y = t.level(), x = g === null ? null : Dg(y, g, w.pt, t.tolMm());
      return g === null || !x ? !1 : (i = { zoneId: g, ...x }, s = o = y, !0);
    },
    pick(w) {
      const g = pd(t.level(), w, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const y = f(), x = y !== null && n !== null && O(w, n) <= t.tolMm() ? g.indexOf(y) : -1;
      n = w, e({ kind: "zone", id: g[(x + 1) % g.length] });
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
      const g = o, y = s, x = a, M = i;
      h(), x ? g && y && g !== y && t.commit(g) : p = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const g = c[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const y = t.level(), x = Lg(y, g.id, w.pt, t.tolMm());
      if (!x) return;
      const M = bf(y, g.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return h(), !0;
      const g = m();
      if (w === "Escape" && g)
        return p = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const y = t.level(), x = wf(y, g.zoneId, g.index);
        return x === y ? (t.notify(u("zones.minVertices")), !0) : (p = null, t.commit(x), !0);
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
      h(), p = null, n = null;
    }
  };
}
function Og(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (h) => {
    t.select(h);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, d = Pg(t, l), p = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, m, $) => et(ce(h, h.walls.find((w) => w.id === m)), $).t;
  function f(h) {
    const m = e;
    if (!(!m || !n) && !(h.pt.x === o.x && h.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const $ = ft(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), w = $.endpoint, g = ($.kind === "wall" || $.kind === "mid") && w.kind === "wall", y = $.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = n.nodes.find((E) => E.id === m.nodeId), M = !!x.host && g && w.kind === "wall" && w.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const E = structuredClone(n);
          delete E.nodes.find((C) => C.id === m.nodeId).host, k = E;
        }
        let _ = Mf(k, m.nodeId, p($));
        if (y && w.kind === "node")
          _ = Cf(_, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const E = n.walls.find((C) => C.id === w.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const C = structuredClone(_);
            C.nodes.find((I) => I.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, _ = Be(C, _);
          }
        }
        i = _;
      } else if (m.kind === "wall") {
        const $ = n.walls.find((y) => y.id === m.wallId), w = ft(n, h.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [$.a, $.b]
        }), g = L(w.pt, m.origin);
        i = Sf(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const $ = n.openings.find((w) => w.id === m.openingId);
        i = Ja(n, $.id, c(n, $.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      a(), o = h.pt, d.note();
      const m = t.level(), $ = h.ctrl ? sr(m, h.pt, t.tolMm()) : null;
      if ($) {
        l(null), t.commit(_g(m, $, h.pt));
        return;
      }
      if (d.press(h)) return;
      const w = t.selection(), g = Ig(m, h.pt, t.tolMm(), w);
      if (!g) {
        d.pick(h.pt);
        return;
      }
      if (d.forget(), l(g), r = n = i = m, g.kind === "node") {
        let y = g.id;
        const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (h.alt && x) {
          const M = Af(m, x.id, x.a === g.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: te(n, y) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: h.pt };
      else if (g.kind === "opening") {
        const y = m.openings.find((x) => x.id === g.id);
        e = { kind: "opening", openingId: y.id, grab: c(m, y.wallId, h.pt) - y.offset };
      }
    },
    move(h) {
      d.active() ? d.move(h) : f(h);
    },
    up(h) {
      if (d.active()) {
        d.up(h);
        return;
      }
      e && f(h);
      const m = s, $ = i, w = r;
      a(), m && $ && w && $ !== w && t.commit($);
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
function Cn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function hd() {
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
function Ng(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = hd(), s = () => {
    e = null, i.clear();
  }, o = (d) => ft(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const d = Cn(i.first, { min: 1 }), p = Cn(i.second, { min: 1 });
      return d === null || p === null ? null : { x: e.x + (n.x >= e.x ? d : -d), y: e.y + (n.y >= e.y ? p : -p) };
    }
    return o(n).pt;
  }
  const l = (d, p) => Math.abs(d.x - p.x) < 1 || Math.abs(d.y - p.y) < 1;
  function a(d) {
    if (!e || l(e, d)) return;
    const p = kf(t.level(), e, d, t.wallProps(), t.boxMeasure());
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
      const c = t.wallProps(), f = Dc(e, d, c.thickness, t.boxMeasure());
      return f && (p.walls = f.map((h, m) => ({ a: h, b: f[(m + 1) % 4], props: { ...c, baseline: "center" } }))), p;
    },
    cancel() {
      s();
    }
  };
}
const Al = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Tg(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = hd(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, d = (f, h) => ft(t.level(), f, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: h && n !== null });
  function p() {
    if (!n) return null;
    const f = d(s, o), h = Cn(l.first, { min: 1 }), m = Cn(l.second);
    if (h === null && m === null) return { pt: f.pt, endpoint: f.endpoint, snap: f };
    const $ = h ?? O(n, f.pt);
    let w = f.pt;
    if (m === null && O(n, f.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = Sg(n, w, $), y = { x: Al(g.x), y: Al(g.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: f } : { pt: y, endpoint: { kind: "free", pt: y }, snap: f };
  }
  function c() {
    const f = p();
    if (!e || !f) return;
    const h = xf(t.level(), e, f.endpoint, t.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    t.commit(h.level);
    const m = h.level.walls.find((x) => x.id === h.wallId);
    i === null && (i = m.a);
    const $ = h.endNodeId === i, w = n, g = te(h.level, h.endNodeId), y = O(w, g);
    if (y > 0 && (r = { x: (g.x - w.x) / y, y: (g.y - w.y) / y }), l.clear(), $) {
      a();
      return;
    }
    e = { kind: "node", nodeId: h.endNodeId }, n = te(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(f) {
      if (s = f.pt, o = f.shift, !e) {
        const h = d(f.pt, !1);
        e = h.endpoint, n = h.pt;
        return;
      }
      c();
    },
    move(f) {
      s = f.pt, o = f.shift;
    },
    up() {
    },
    key(f, h) {
      return o = h.shift, e ? l.key(f, c, a) : !1;
    },
    preview() {
      if (!n) return { snap: ft(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const f = p();
      return {
        walls: [{ a: n, b: f.pt, props: t.wallProps() }],
        snap: f.snap,
        tracker: l.tracker(f.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      a();
    }
  };
}
function zg(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = sr(o, n, t.tolMm());
    if (!r) return null;
    const l = ce(o, o.walls.find((d) => d.id === r)), a = et(l, n).t;
    return { wallId: r, center: a, pt: T(l.a, D(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Cp(t.level(), r.wallId, e, r.center, l.width, l);
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
const Cl = 3, Hg = 1, ke = (t) => ({ x: t.x, y: t.y });
function Vg(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ke(e[e.length - 1]) : void 0;
  function l(c) {
    const f = e.length;
    if (f === 0) return !1;
    const h = e.map(ke);
    if (O(h[f - 1], c) <= Hg) return !0;
    if (f >= 2) {
      const m = L(h[f - 1], h[f - 2]), $ = L(c, h[f - 1]);
      if (Math.abs(ue(m, $)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot($.x, $.y) && q(m, $) < 0) return !0;
    }
    for (let m = 0; m + 2 < f; m++) if (wc(h[f - 1], c, h[m], h[m + 1])) return !0;
    return !1;
  }
  function a(c) {
    if (e.length < Cl) return null;
    const f = t.tolMm(), h = ke(e[0]), m = ke(e[e.length - 1]);
    return O(c, h) <= f ? h : O(c, m) <= f ? m : null;
  }
  function d() {
    var h;
    if (e.length < Cl || bi(e.map(ke))) return !1;
    const c = t.level(), f = hf(c, e, t.zoneName());
    return f.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? f.level : jo(f.level, f.zoneId, !1)), (h = t.zonePlaced) == null || h.call(t), t.select({ kind: "zone", id: f.zoneId }), !0);
  }
  const p = (c) => ud(t, t.level(), c, r());
  return {
    id: "zone",
    down(c) {
      if (a(c.pt)) {
        d();
        return;
      }
      const f = p(c).vertex;
      l(ke(f)) || (e = [...e, f], n = ke(f), i = !1);
    },
    move(c) {
      o = c.shift;
      const f = a(c.pt);
      if (f) {
        n = f, s = null, i = bi(e.map(ke));
        return;
      }
      const h = p(c);
      s = h.snap, n = ke(h.vertex), i = l(n);
    },
    up() {
    },
    key(c) {
      return c === "Enter" ? d() : c === "Backspace" || c === "Delete" || c === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : c === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const c = {};
      e.length > 0 && (c.zoneDraft = { points: e.map(ke), cursor: n, invalid: i }), s && (c.snap = s);
      const f = r();
      return o && f && (c.orthoFrom = f), c;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Rg(t) {
  return t.zoneMethod() === "polygon" ? Vg(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = ff(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(u("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : jo(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Il = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function md(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((p) => p.id === o), a = l ? ae(s, l) : null, d = l ? Js(s, l, t.scale()) : null;
    return !a || !d ? 0 : fc(ze(L(r, a.pt)) - ze(L(d.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && O(s.pt, e.downPt) <= os / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((c) => c.id === e.id), r = o ? ae(e.original, o) : null;
    if (!o || !r) return;
    const l = O(s.pt, r.pt), a = (ze(L(s.pt, r.pt)) - e.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, p = Qp(e.original, o, d, s.shift);
    e.work = JSON.stringify(p) === JSON.stringify(o.placement) ? e.original : hi(e.original, o.id, p);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((d) => d.id === s), a = l ? Js(r, l, t.scale()) : null;
      return !l || !a || O(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Il(o.work, o.id) !== Il(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function El(t, e, n) {
  const i = ce(t, t.walls.find((s) => s.id === e));
  return et(i, n).side > 0 ? "left" : "right";
}
function gd(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function or(t, e = "free") {
  return t === "equipment" ? [e] : Lo[t];
}
function bd(t, e, n, i, s = 0, o = or(n)) {
  if (o.includes("wall")) {
    const r = ft(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: El(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of e.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const p = ce(e, d), c = et(p, i).side, f = Math.abs(Math.abs(c) - (c > 0 ? p.leftOff : p.rightOff));
        (!a || f < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : p.len, d: f });
      }
      if (a) return { mode: "wall", wallId: a.id, side: El(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...gd(t, i), rotation: s } : null;
}
function Bg(t, e, n) {
  const i = ae(t, e);
  if (!i) return null;
  if (!n) {
    const o = zo(Math.round(ze(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of t.walls) {
    let r;
    try {
      r = ce(t, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = et(r, i.pt), a = l.side > 0 ? "left" : "right", d = Math.min(r.len, Math.max(0, Math.round(l.t))), p = $n(t, o.id, a, d), c = p ? O(p, i.pt) : 1 / 0;
    (!s || c < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: d }, d: c });
  }
  return s && s.d < 1 / 0 ? Ho(t, e.props, s.placement, 0) : null;
}
function Fg(t, e, n) {
  return lc(t.deviceDefaults(e), "free", n.mode);
}
function Ug(t, e) {
  let n = null, i;
  const s = md(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = or(e, t.wallMount() ? "wall" : "free"), a = bd(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...gd(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const d = Fg(t, e, a), p = Ho(r, d, a, t.tolMm()), c = jr(r, d, p, "").deviceId !== null;
    return { placement: p, props: d, invalid: !c };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), d = Co(u(`device.${e}`), a.devices.filter((c) => c.props.kind === e).map((c) => c.name)), p = jr(a, l.props, l.placement, d);
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
const Dl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Wg = (t, e, n) => n === void 0 || Dl(t, n) !== Dl(e, n);
function jg(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return L(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = $n(t, s.wallId, s.side, s.offset);
  return o ? L(o, i) : { x: 0, y: 0 };
}
function qg(t) {
  let e = null, n = null;
  const i = md(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (f) => {
    e = f, t.select(f);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function p(f) {
    if (!n || !s || !r && O(f.pt, l) <= os / t.scale()) return;
    if (r = !0, f.pt.x === l.x && f.pt.y === l.y) {
      o = s;
      return;
    }
    const h = s.devices.find((k) => k.id === n.id);
    if (!h || h.placement.mode === "none") return;
    const m = f.shift ? ir(l, f.pt) : f.pt, $ = h.placement, w = $.mode === "free" ? null : ae(s, h), g = $.mode === "free" ? $.rotation : w ? zo(Math.round(ze(w.dir))) : 0, y = T(m, n.grab), x = bd(t, s, h.props.kind, y, g, or(h.props.kind, $.mode)), M = x && x.mode === "wall" && $.mode === "wall" && $.aim !== void 0 ? { ...x, aim: $.aim } : x;
    o = M ? hi(s, h.id, Ho(s, h.props, c(s, h.placement, M, m, y), t.tolMm())) : s;
  }
  function c(f, h, m, $, w) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const g = f.walls.find((E) => E.id === h.wallId);
    if (!g) return m;
    const y = ce(f, g), x = Math.max(0, Math.min(y.len, h.offset + q(L($, l), y.dir))), M = et(y, w).side, k = t.tolMm(), _ = h.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: _ };
  }
  return {
    id: "device-select",
    down(f) {
      d(), l = f.pt;
      const h = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, f)) return;
      const $ = gc(h, f.pt, m);
      if (!$) {
        a(null);
        return;
      }
      a({ kind: "device", id: $ });
      const w = h.devices.find((y) => y.id === $), g = ae(h, w);
      s = o = h, n = { id: $, grab: jg(h, w, (g == null ? void 0 : g.pt) ?? null, f.pt) };
    },
    move(f) {
      i.active() ? i.move(f) : p(f);
    },
    up(f) {
      if (i.end(f)) return;
      n && p(f);
      const h = o, m = s, $ = r, w = n == null ? void 0 : n.id;
      d(), $ && h && m && h !== m && Wg(m, h, w) && t.commit(h);
    },
    key(f) {
      return f === "Escape" && i.cancel() ? !0 : f === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const f = i.working();
      return f ? { level: f } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), a(null);
    }
  };
}
function Zg(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = gc(t.level(), e.pt, t.tolMm());
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
const so = 40, Gg = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function Kg(t, e, n, i) {
  const s = t.blocks.find((h) => h.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = Mn(o ? i.x : i.y), d = n === "start" ? Math.min(a, r + l - so) : r, p = n === "end" ? Math.max(a, r + so) : r + l;
  if (d === r && p === r + l) return t;
  const c = o ? { x: d, w: p - d } : { y: d, h: p - d }, f = (h) => "bus" in h && h.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + h.at * l - d) / (p - d))) } : h;
  return {
    ...t,
    blocks: t.blocks.map((h) => h.id === e ? { ...h, ...c } : h),
    wires: t.wires.map((h) => {
      const m = f(h.from), $ = f(h.to);
      return m === h.from && $ === h.to ? h : { ...h, from: m, to: $ };
    })
  };
}
function Xg(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(p, c) {
    const f = ul(p, c, t.tolMm(), t.geo());
    return (f == null ? void 0 : f.kind) === "port" ? { block: f.block, port: f.port } : (f == null ? void 0 : f.kind) === "bus" ? { bus: f.id, at: f.at } : (f == null ? void 0 : f.kind) === "bus-end" ? { bus: f.id, at: f.end === "start" ? 0 : 1 } : null;
  }
  function a(p) {
    const c = e, f = n;
    if (!c || !f || !s && O(p.pt, o) <= os / t.scale()) return;
    if (s = !0, c.kind === "wire") {
      const w = l(f, p.pt);
      e = { ...c, to: p.pt, ok: !!w && !("error" in ll(f, c.from, w, t.geo())) };
      return;
    }
    if (c.kind === "bus-end") {
      i = Kg(f, c.id, c.end, p.pt);
      return;
    }
    const h = f.blocks.find((w) => w.id === (c.kind === "pin" ? c.from.block : c.id));
    if (!h) return;
    if (c.kind === "pin") {
      i = Ff(f, h.id, c.from.port, ih(Ie(h, t.geo(), f), p.pt));
      return;
    }
    const m = Mn(h.x + p.pt.x - o.x), $ = Mn(h.y + p.pt.y - o.y);
    i = m === h.x && $ === h.y ? f : Vf(f, h.id, m, $);
  }
  function d(p, c, f) {
    const h = l(p, f);
    if (!h) return;
    const m = ll(p, c, h, t.geo());
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
      const c = t.power(), f = ul(c, p.pt, t.tolMm(), t.geo());
      if (!f) {
        t.select(null);
        return;
      }
      if (f.kind === "chip") {
        t.setPosition(f.block, f.position);
        return;
      }
      if (f.kind === "wire") {
        t.select({ kind: "powerWire", id: f.id });
        return;
      }
      if (n = i = c, f.kind === "port") {
        const h = { block: f.block, port: f.port };
        if (Gg(c, h)) {
          e = { kind: "pin", from: h };
          return;
        }
        const m = c.blocks.find((w) => w.id === f.block), $ = ts(c, m, t.geo()).find((w) => w.name === f.port).pt;
        e = { kind: "wire", from: h, at: $, to: $, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: f.id }), e = f.kind === "bus-end" ? { kind: "bus-end", id: f.id, end: f.end } : { kind: "move", id: f.id };
    },
    move(p) {
      a(p);
    },
    up(p) {
      a(p);
      const c = e, f = n, h = i, m = s;
      if (r(), !(!c || !f)) {
        if (!m) {
          (c.kind === "wire" || c.kind === "pin") && t.select({ kind: "powerBlock", id: c.from.block });
          return;
        }
        c.kind === "wire" ? d(f, c.from, p.pt) : h && h !== f && t.commitPower(h);
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
function Yg(t, e) {
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
      const o = t.power(), r = Hf(n, { x: 0, y: 0 }, o, s), l = Ie(r, t.geo(), ol(o, r)), a = { ...r, x: Mn(i.pt.x - l.w / 2), y: Mn(i.pt.y - l.h / 2) };
      t.commitPower(ol(o, a)), n === "device" && ((d = t.devicePlaced) == null || d.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function Qg(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = pd(t.level(), e.pt, t.tolMm())[0];
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
const Jg = ["select", "box", "wall", "door", "window", "opening", "zone"], e1 = [
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
], t1 = ["binding-select"], n1 = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], i1 = ["zone-pick"], wd = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, s1 = {
  plan: Jg,
  equipment: e1,
  binding: t1,
  power: n1,
  automation: i1
};
function rr(t) {
  return s1[t];
}
function oo(t, e) {
  switch (t) {
    case "select":
      return Og(e);
    case "box":
      return Ng(e);
    case "wall":
      return Tg(e);
    case "door":
    case "window":
    case "opening":
      return zg(e, t);
    case "zone":
      return Rg(e);
    case "device-select":
      return qg(e);
    case "binding-select":
      return Zg(e);
    case "power-select":
      return Xg(e);
    case "zone-pick":
      return Qg(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Yg(e, t);
    default:
      return Ug(e, t);
  }
}
function As(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const o1 = {
  select: jt,
  box: qh,
  wall: Zh,
  door: _h,
  window: Yh,
  opening: Sh,
  zone: Rh,
  "device-select": jt,
  ceiling_light: yh,
  wall_light: Gh,
  motion_sensor: Oh,
  illuminance_sensor: $h,
  climate_sensor: Bh,
  wall_switch: ed,
  smart_button: Eh,
  valve: Wh,
  leak_sensor: id,
  socket: td,
  exhaust_fan: Jc,
  equipment: pl,
  "binding-select": jt,
  "zone-pick": jt,
  "power-select": jt,
  "power-device": pl,
  "power-bus": zh,
  "power-battery": vh,
  "power-pv": nd,
  "power-transfer": Vh,
  "power-remainder": xh
}, vd = (t) => b`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${S`<path d=${o1[t]}></path>`}</svg>`;
function r1(t) {
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
function l1(t) {
  return b`
    <div class="top"><div class="bar">
      ${t.lead ?? v}
      ${t.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${u("plan.pick")} title=${u("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${G(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => b`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
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
        ${r1(t)}${t.saveState === "error" && t.errorMessage ? b`: ${t.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${u("action.save")}</button>
    </div>${t.steps}</div>`;
}
const a1 = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function $d(t, e, n) {
  return rr(t).map((i) => {
    const s = t === "plan" ? wd[i] : void 0, o = u(`tool.${i}`);
    return b`
      ${a1.includes(i) ? b`<div class="tool-sep"></div>` : v}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? v}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? v}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${vd(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function c1(t, e, n) {
  return b`<div class="tools">${$d(t, e, n)}</div>`;
}
const Fn = ["plan", "equipment", "binding", "power", "automation"], qt = (t, e, n) => u(t === 1 ? e : n).replace("{n}", String(t));
function d1(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((p) => p.invalid).length, d = a ? `, ${u("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${qt(o.length, "steps.wall", "steps.walls")}, ${qt(r.length, "steps.zone", "steps.zones")}${d}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: qt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Eo(l.map(n));
      return {
        text: u("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: qt(i.blocks.length, "steps.block", "steps.blocks"), done: Kf(i) };
    case "automation":
      return { text: qt(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const Ll = (t, e) => u(t).replace("{step}", u(`mode.${e}`));
function u1(t) {
  const e = Fn.indexOf(t.mode), n = Fn[e - 1], i = Fn[e + 1];
  return b`
    <nav class="steps" aria-label=${u("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${G(t.planName)} aria-label=${u("plan.name")} title=${u("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${u("steps.app")}</span>
      </div>
      ${Fn.map((s, o) => {
    const r = d1(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return b`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : v} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${u(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? b`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Ll("steps.back", n)}</button>` : v}
        ${i ? b`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Ll("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
function p1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function yd(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return ic(t, Co(u("device.equipment"), e));
}
function lr(t) {
  if (Vt(t)) return u("props.inverter");
  const e = Pp(t);
  return e ? u(`deviceRole.${e}`) : "";
}
function rs(t) {
  const e = u(`device.${t.props.kind}`), n = lr(t);
  return n ? `${e} · ${n}` : e;
}
function f1(t) {
  const e = p1(t.level);
  return b`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${u("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${u("devices.new")}</button>
    </div>
    ${e.length === 0 ? v : b`<div class="pdevs">
      ${e.map((n) => b`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${lr(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const h1 = ["unbound", "bound", "all"], m1 = /* @__PURE__ */ new WeakMap(), sn = (t) => t.placement.mode === "none";
function xd(t) {
  return Se(m1, t, (e) => [...e.devices].sort((n, i) => Number(sn(n)) - Number(sn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function g1(t, e, n) {
  const i = xd(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const kd = (t) => u(`device.${t.props.kind}`), Pl = (t) => t.props.kind === "equipment" ? lr(t) : kd(t), b1 = (t, e) => t === "all" || t === "bound" == (e === "bound");
function w1(t, e, n) {
  return e === 0 ? u("binding.noDevices") : n || t.filter === "all" ? u("binding.noMatch") : u(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Ol(t) {
  const e = u(t.collapsed ? "binding.expand" : "binding.collapse");
  return b`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function v1(t) {
  var l;
  if (t.collapsed) return b`<div class="blist collapsed">${Ol(t)}</div>`;
  const e = xd(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Eo(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: d }) => b1(t.filter, d) && (!i || a.name.toLowerCase().includes(i) || kd(a).toLowerCase().includes(i) || Pl(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, d) => {
    const p = Tu(a);
    return b`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${d}" role="img" aria-label=${u(`bindstatus.${d}`)} title=${u(`bindstatus.${d}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Pl(a)}</small></span>
      <span class="cnt">${p.filled}/${p.total}</span>
    </button>`;
  };
  return b`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${u("binding.show")}>
          ${h1.map((a) => b`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${u(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Ol(t)}
      </div>
      <input class="list-search" type="search" placeholder=${u("binding.search")} aria-label=${u("binding.search")}
        .value=${G(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? b`<p class="empty">${w1(t, e.length, i)}</p>` : b`
          ${s.filter((a) => !sn(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => sn(a.d)) ? b`<div class="bgroup" data-group="unplaced">
            <h5>${u("devices.unplaced")}</h5>
            ${s.filter((a) => sn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : v}`}
      </div>
    </div>`;
}
function P(t, e) {
  return b`<label class="row"><span>${t}</span>${e}</label>`;
}
function se(t, e, n, i) {
  return b`<select class="val" data-field=${i ?? v} .value=${G(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => b`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Fe(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return b`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? v}
    placeholder=${t.placeholder ?? v} title=${t.placeholder ?? v} .value=${G(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = Cn(s.value, t.rule);
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
function $1() {
  return {
    door: { width: Jn.door, hinge: "start", swing: "left" },
    window: { width: Jn.window, outside: "left" },
    opening: { width: Jn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function y1(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Md(t) {
  return Co(u("zones.default"), t.zones.map((e) => e.name));
}
const x1 = (t) => t === "door" || t === "window" || t === "opening";
function k1(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return v;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return b`
    <h4>${u(`props.next.${n}`)}</h4>
    ${P(`${u("props.width")}, ${u("unit.mm")}`, Fe({
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
    ${n === "door" ? b`
      ${P(u("props.hinge"), se(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${P(u("props.swing"), se(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? P(u("props.outside"), se(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class M1 {
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
const ro = (t) => typeof t == "object" && t !== null && !Array.isArray(t), on = (t) => typeof t == "string" && t ? t : null, Nl = (t) => typeof t == "number" && Number.isFinite(t), lo = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function _d(t) {
  return t.switchesMigrated || !t.devices.some(lo) ? t : { ...t, switchesMigrated: !0 };
}
function _1(t, e, n) {
  const i = ic(t, n);
  let s = i.level;
  const o = ro(e.switch) ? e.switch : {}, r = [["power", on(e.power)], ["voltage", on(e.voltage)], ["control", on(o.entity)]];
  for (const [l, a] of r) a && (s = Hi(s, i.id, l, a));
  return o.controllable === !0 && (s = qi(s, i.id, !0)), { level: s, id: i.id };
}
function S1(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (ro(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!ro(l)) return l;
      if (l.kind === "meter" && on(l.id) && Nl(l.x) && Nl(l.y)) {
        s++;
        const a = _1(e, l, on(l.name) ?? `Meter ${s}`);
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
        return a === !0 && typeof l.deviceId == "string" && (e = rc(e, l.deviceId, !0)), o = !0, d;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(lo)) {
    for (const s of t.level.devices) lo(s) && (e = qi(e, s.id, !0));
    e = _d(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class A1 {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await xs(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(Ir(u("plan.default"))), this.offerDraft(this.h.drafts.latest());
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
    const n = await ph(this.h.hass, e);
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
        this.h.plans = await xs(this.h.hass);
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
    this.h.toolId = rr(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(Ir(u("plan.default"))), this.offerDraft(null);
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
            await hh(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = _e(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await xs(this.h.hass), this.h.plans = i;
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
    this.h.plan = { ...e, levels: e.levels.map(Ku) };
    const n = S1({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Gf(n.power, { device: (o) => n.level.devices.find((r) => r.id === o) }), s = e.rules && e.rules.length > 0 ? e.rules : void 0;
    this.h.history = new M1({ level: n.level, ...i ? { power: i } : {}, ...s ? { rules: s } : {} }), this.h.lazyPower = zc(), this.h.activeTool.cancel(), this.h.activeTool = oo(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((d, p) => p === 0 ? _d(n) : d), { power: r, rules: l, ...a } = e;
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
class C1 {
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
    !n || !Lf(n.states, e) ? this.base = { states: e, meta: Df(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Of(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Pf(e).then(
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
const Un = Oa("", "");
function I1(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? Un;
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
    openingDefaults: (e) => y1(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Md(((e = t.history) == null ? void 0 : e.current.level) ?? Un);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? Un).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Wc(((n = t.history) == null ? void 0 : n.current.level) ?? Un, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Sd = Object.keys(Lo), E1 = (t) => Sd.includes(t);
function D1() {
  return Object.fromEntries(Sd.map((t) => [t, Ye(t, "free")]));
}
const Ad = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Et, max: Et, signed: !0 }, bad: "props.badAim" }
}, rn = (t, e, n, i, s) => Fe({ ...Ad[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), L1 = ["round", "linear", "spot"], P1 = ["rect", "circle"], ki = (t, e) => t.map((n) => ({ v: n, label: u(`${e}.${n}`) }));
function Cd(t, e, n, i) {
  const s = (r, l, a) => P(`${u(l)}, ${u("unit.mm")}`, rn(t, n + r, a, "mm", (d) => i({ [r]: d }))), o = (r, l, a) => P(`${u(l)}, ${u("unit.deg")}`, rn(t, n + r, a, "angle", (d) => i({ [r]: d })));
  switch (e.kind) {
    case "ceiling_light":
      return b`
        ${P(u("props.shape"), se(e.shape, ki([...L1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? b`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : v}
        ${P(`${u("props.poolRadius")}, ${u("unit.mm")}`, Fe({
        ...Ad.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: u("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return b`${o("coneAngle", "props.coneAngle", e.coneAngle)}${s("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return b`${o("zoneAngle", "props.zoneAngle", e.zoneAngle)}${s("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return P(`${u("props.diameter")}, ${u("unit.mm")}`, b`<select class="val" data-field=${`${n}diameter`}
        .value=${G(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Ru.map((r) => b`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return b`
        ${P(u("props.shape"), se(e.shape, ki([...P1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? b`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${P(u("props.icon"), N1(t, e.icon, `${n}icon`, i))}
        ${P(u("props.label"), b`<input class="val wide" type="text" data-field=${`${n}label`} .value=${G(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return b`<p class="muted" data-note="daylight">${u("props.daylightInBinding")}</p>`;
    default:
      return b`<p class="muted">${u("props.noSettings")}</p>`;
  }
}
const O1 = /^mdi:[a-z0-9-]+$/;
function N1(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!O1.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, u("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? b`<ha-icon-picker data-field=${n} .value=${G(e)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : b`<input class="val wide" type="text" data-field=${n} .value=${G(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function ht(t, e, n, i) {
  return P(e, b`<input type="checkbox" data-field=${t} .checked=${G(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function T1(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? v : ht("wallMount", u("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function z1(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? v : b`
    ${ht("inverter", u("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? ht("controllable", u("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : b`<p class="muted" data-note="bind-switch">${u("props.bindSwitchHint")}</p>`}`;
}
function H1(t, e) {
  const n = e.placement;
  if (n.mode === "none") return v;
  if (n.mode === "free")
    return P(
      `${u("props.rotation")}, ${u("unit.deg")}`,
      rn(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = Na.has(e.props.kind);
  return b`
    ${P(u("props.side"), se(n.side, ki(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${P(`${u("props.offset")}, ${u("unit.mm")}`, rn(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? P(
    `${u("props.aim")}, ${u("unit.deg")}`,
    rn(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(bc(n, s)))
  ) : v}`;
}
function ar(t, e) {
  return P(u("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${G(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function V1(t, e) {
  const n = e.props.kind;
  return Pa(n) ? n === "smart_button" && e.placement.mode === "free" ? b`<p class="muted" data-note="type-free">${u("props.typeFreeHint")}</p>` : P(u("props.type"), se(
    n,
    ki(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : v;
}
function R1(t, e) {
  const n = t.level ? of(t.level, e) : [];
  return b`<fieldset data-field="zone-membership"><legend>${u("props.zoneList")}</legend>
    ${n.length === 0 ? b`<p class="muted">${u("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => b`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function B1(t, e) {
  const n = e.placement.mode !== "none";
  return b`
    <h4>${rs(e)}</h4>
    ${ar(e, (i) => t.onDevice({}, i))}
    ${V1(t, e)}
    ${n ? Cd(t, e.props, "", (i) => t.onDevice(i)) : v}
    ${T1(t, e)}
    ${H1(t, e)}
    ${z1(t, e)}
    ${n ? R1(t, e) : v}
    ${e.invalid ? b`<p class="warn">${u("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${u("action.delete")}</button>`;
}
function F1(t) {
  return t.device ? B1(t, t.device) : t.nextKind && t.nextProps ? b`
      <h4>${u("props.nextDevice")}: ${u(`device.${t.nextKind}`)}</h4>
      ${Cd(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? ht(
    "next-wallMount",
    u("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : v}` : b`<p class="muted">${u("props.none")}</p>`;
}
function U1(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = E1(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(u("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, d) => {
    const p = Bg(e, a, d);
    return o(p ? hi(e, a.id, p) : e);
  };
  return b`<div class="props">
    ${F1({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, d) => !!i && o(Rt(e, i.id, a, d)),
    onKind: (a) => !!i && o(Op(e, i.id, a)),
    onPlacement: (a) => !!i && o(hi(e, i.id, a)),
    onZone: (a, d) => !!i && o(Cc(e, i.id, a, d)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Fc(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(qi(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(Bc(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? b`<p class="warn">${t.notice}</p>` : v}
    ${i ? v : f1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = yd(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const ao = (t) => u(`zones.kind.${t.shape.kind}`), cr = (t) => b`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${S`<path d=${t === "walls" ? Ih : jh}></path>`}</svg>`;
function Id(t, e) {
  const n = vc(t, e);
  return n ? u(`zones.invalid.${n}`) : null;
}
function W1(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: tr(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || ao(o).toLowerCase().includes(e));
  return b`
    <div class="zlist">
      <div class="zhead"><span>${u("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${u("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${u("zones.filter")}
        aria-label=${u("zones.filter")} .value=${G(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? Id(t.level, o) ?? "" : null;
    return b`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? b`<span class="zswatch" style=${`background:${r}`}></span>` : b`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${ao(o)}>${cr(o.shape.kind)}</span>
            <span class="zarea">${((a = Ro(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const dr = ns(class extends is {
  constructor(t) {
    if (super(t), t.type !== We.PROPERTY && t.type !== We.ATTRIBUTE && t.type !== We.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Yc(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === $e || e === v) return e;
    const n = t.element, i = t.name;
    if (t.type === We.PROPERTY) {
      if (e === n[i]) return $e;
    } else if (t.type === We.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return $e;
    } else if (t.type === We.ATTRIBUTE && n.getAttribute(i) === e + "") return $e;
    return er(t), e;
  }
}), Ed = (t, e, n) => b`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${dr(e)}
    @change=${(i) => n(i.target.checked)} />${u("zones.automation")}</label>`;
function j1(t, e, n) {
  const i = tt(t, e.id);
  return b`<div class="zmembers">
    <div class="zhead"><span>${u("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? b`<span>${u("zones.participates")}</span>` : v}</div>
    ${i.length === 0 ? b`<p class="muted">${u("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => b`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${u(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${u("zones.participates")} .checked=${dr(o)}
          @change=${(r) => {
    const l = Cc(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Tl(t, e, n) {
  const i = Id(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return b`<div class="zprops">
    <h4>${u("props.zone")}</h4>
    ${P(u("props.name"), b`<input class="val wide" type="text" data-field="zone-name" .value=${G(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(mf(t, e.id, l));
  }} />`)}
    ${P(u("props.area"), b`<span class="val ro" data-field="zone-area">${od(Ro(t, e))}</span>`)}
    ${P(u("zones.outline"), b`<span class="val ro zkindval" data-field="zone-kind">${cr(e.shape.kind)}${ao(e)}</span>`)}
    ${Ed("zone-automation", e.automation !== !1, (o) => {
    const r = jo(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? b`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? b`<button class="btn" data-action="keep-outline" @click=${() => n(vf(t, e.id))}>
        ${u("zones.keepOutline")}</button>` : v}</div>` : v}
    ${j1(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Ac(t, e.id))}>
      ${u("zones.delete")}</button>
  </div>`;
}
function q1(t) {
  const e = t.next.zone, n = e.name ?? Md(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return b`
    <h4>${u("props.nextZone")}</h4>
    <div class="muted">${u("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${u("zones.method")}>
      ${["walls", "polygon"].map((s) => b`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${cr(s)}<span>${u(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${u(`zones.hint.${e.method}`)}</p>
    ${P(u("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${G(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Ed("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function Dd(t, e, n) {
  return Fe({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function zl(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Z1(t, e) {
  const n = ce(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(If(e.level, t.id, o));
  return b`
    <h4>${u("props.wall")}</h4>
    ${P(u("props.type"), se(
    t.type,
    i.map((o) => ({ v: o, label: u(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${P(u("props.thickness"), Dd(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${P(u("props.baseline"), se(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: u(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${P(u("props.length"), b`<span class="val ro">${ct(n)} ${u("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(Ko(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function G1(t, e) {
  const n = ["door", "window", "opening", ...pi.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Dp(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), o = pi.includes(t.kind);
  return b`
    <h4>${u(`kind.${t.kind}`)}</h4>
    ${P(u("props.kind"), se(t.kind, n.map((r) => ({ v: r, label: u(`kind.${r}`) })), (r) => i(Ep(t, r))))}
    ${P(u("props.width"), Dd(e, t.width, (r) => zl(e, Ip(e.level, t.id, r))))}
    ${P(u("props.offset"), Fe({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => zl(e, Ja(e.level, t.id, r))
  }))}
    ${o ? b`
      ${P(u("props.hinge"), se(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${P(u("props.swing"), se(t.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${t.kind === "window" ? P(u("props.outside"), se(t.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${P(u("props.passesLight"), b`<input type="checkbox" data-field="passesLight" .checked=${G(Ka(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Ga(t.kind) ? void 0 : l });
  }} />`)}
    ${P(u("props.passesPir"), b`<input type="checkbox" data-field="passesPir" .checked=${G(Ya(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Xa(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? b`<p class="warn">${u("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(ec(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function K1(t) {
  const e = ["bearing", "partition", "railing"];
  return b`
    <h4>${u("props.newWall")}</h4>
    ${P(u("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => b`<option value=${n} ?selected=${n === t.wallType}>${u(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${P(`${u("props.thickness")}, ${u("unit.mm")}`, Fe({
    value: t.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      t.setThickness(n);
    }
  }))}
    ${t.tool === "box" ? b`
      <div class="muted">${u("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => b`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${u(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
const Hl = (t) => W1({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function X1(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return b`<div class="props">
      ${q1({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? b`<p class="warn">${t.notice}</p>` : v}
      ${s ? Tl(e, s, t.commit) : v}
      ${Hl(t)}
    </div>`;
  }
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = Z1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = G1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Tl(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = b`<h4>${u("props.node")}</h4>
      ${P("X", b`<span class="val ro">${ct(s.x)}</span>`)}${P("Y", b`<span class="val ro">${ct(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === v && (t.tool === "wall" || t.tool === "box") ? K1(t) : i === v && x1(t.tool) ? k1({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === v && t.tool === "select" ? Hl(t) : i === v ? b`<p class="muted">${u("props.none")}</p>` : i}
      ${t.notice ? b`<p class="warn">${t.notice}</p>` : v}
    </div>`;
}
function Y1(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Vl = /* @__PURE__ */ new WeakMap();
function ur(t, e, n) {
  let i = Vl.get(t);
  i || Vl.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : Y1(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function ii(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wn = (t) => t ?? v;
var Q1 = Object.defineProperty, Nn = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && Q1(e, n, s), s;
};
const J1 = 100;
let eb = 0;
const tb = (t) => b`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${S`<path d=${t}></path>`}</svg>`, mr = class mr extends At {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${eb++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === J1) {
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
    return b`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${Wn(this.label || void 0)} title=${Wn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? b`<button class="x" type="button" title=${u("combo.clear")} aria-label=${u("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return b`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Wn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => b`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Wn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? b`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? b`<div class="hint">${u("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return b`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
mr.styles = _a`
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
let Je = mr;
Nn([
  Ve()
], Je.prototype, "value");
Nn([
  Ve()
], Je.prototype, "label");
Nn([
  W()
], Je.prototype, "isOpen");
Nn([
  W()
], Je.prototype, "query");
Nn([
  W()
], Je.prototype, "active");
var nb = Object.defineProperty, pr = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && nb(e, n, s), s;
};
const ib = {
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
}, Rl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, sb = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Bl(t, e) {
  return t != null && t.deviceClass && Rl[t.deviceClass] ? Rl[t.deviceClass] : sb[(t == null ? void 0 : t.domain) ?? Pc(e)] ?? "generic";
}
const Fl = (t) => tb(ib[t]);
function ob(t) {
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
class ls extends Je {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = ii(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? ii(this.meta, e) : null;
    return b`${Fl(e ? Bl(this.meta.entities.get(e), e) : "generic")}
      ${n ? b`<span><b>${n.name}</b>${n.context !== n.name ? b`<small>${n.context}</small>` : v}<small class="eid">${e}</small></span>` : b`<span class="ph">${u("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = Nc(this.states, e.entityId) ?? "unavailable";
    return b`${Fl(Bl(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${ob(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = ii(this.meta, e).name;
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
pr([
  Ve({ attribute: !1 })
], ls.prototype, "meta");
pr([
  Ve({ attribute: !1 })
], ls.prototype, "items");
pr([
  Ve({ attribute: !1 })
], ls.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", ls);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ln = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), ln(s, e);
  return !0;
}, Mi = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, Ld = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), ab(e);
  }
};
function rb(t) {
  this._$AN !== void 0 ? (Mi(this), this._$AM = t, Ld(this)) : this._$AM = t;
}
function lb(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) ln(i[o], !1), Mi(i[o]);
  else i != null && (ln(i, !1), Mi(i));
  else ln(this, t);
}
const ab = (t) => {
  t.type == We.CHILD && (t._$AP ?? (t._$AP = lb), t._$AQ ?? (t._$AQ = rb));
};
class cb extends is {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), Ld(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (ln(this, e), Mi(this));
  }
  setValue(e) {
    if (Yc(this._$Ct)) this._$Ct._$AI(e, this);
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
const db = () => new ub();
class ub {
}
const Cs = /* @__PURE__ */ new WeakMap(), pb = ns(class extends cb {
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
}), fb = () => [{ v: "0", label: u("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], hb = { min: 1, max: 10 };
function Pd(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const co = (t, e, n) => Pd(t, Rt(t.level, e.id, n));
function Is(t, e, n, i) {
  return b`<div class="cflag">${P(e, b`<input type="checkbox" data-field=${t} .checked=${G(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Es = "__other", Zt = /* @__PURE__ */ new Set();
function mb(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Cr.includes(i), l = !r || Zt.has(o), a = db(), d = [...Cr.map((c) => ({ v: c, label: c })), { v: Es, label: u("binding.eventOther") }];
  return b`<span class="evfield">${se(l ? Es : i, d, (c) => {
    if (c === Es) {
      Zt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Zt.delete(o), a.value && (a.value.hidden = !0), c !== i ? s(c) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${pb(a)} data-field=${`${n}-event-custom`} ?hidden=${dr(!l)}
      .value=${G(r ? "" : i)} @change=${(c) => {
    var m;
    const f = c.target, h = f.value.trim();
    if (!h) {
      f.value = r ? "" : i, t.setFieldNotice(u("props.badEvent"));
      return;
    }
    if (f.value = h, t.setFieldNotice(null), h !== i) {
      s(h) && Zt.delete(o);
      return;
    }
    if (Zt.delete(o), r) {
      f.hidden = !0;
      const $ = (m = f.parentElement) == null ? void 0 : m.querySelector("select");
      $ && ($.value = i);
    }
  }} /></span>`;
}
function gb(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return b`${v}`;
  const s = i[n], o = (r) => co(t, e, { [n]: { ...s, ...r } });
  return b`<div class="trigger" data-trigger=${n}>
    ${P(u("binding.slot"), se(
    String(s.slot),
    fb(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${P(u("binding.event"), mb(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function bb(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return b`
      ${Is(
      "autoByDoubleToggle",
      u("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => co(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? b`<div class="cflag">${P(u("binding.window"), Fe({
      value: i.windowSec,
      rule: hb,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => co(t, e, { windowSec: l })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return b`${v}`;
  const s = (l, a) => (d) => {
    var c, f;
    const p = Rt(t.level, e.id, { [l]: d });
    return Pd(t, d && !((c = e.bindings) != null && c[a]) ? Hi(p, e.id, a, ((f = e.bindings) == null ? void 0 : f.on) ?? null) : p);
  }, o = s("separateOff", "off"), r = Is("autoEnabled", u("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : b`${Is("separateOff", u("binding.separateOff"), i.separateOff, o)}${i.separateOff ? v : r}`;
}
function wb(t) {
  return t.props.kind !== "smart_button" || !Vu(t).length ? b`${v}` : b`<div class="cfields"><p class="warn" data-note="duplicate">${u("binding.duplicate")}</p></div>`;
}
const Nt = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, Od = 3600, In = (t) => typeof t == "number" && Number.isFinite(t);
function vb(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Nt, i = Nd(e.nightBelow, e.dayAbove), s = Td(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: s ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: s ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: zd(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function Nd(t, e) {
  if (t !== void 0 && !In(t) || e !== void 0 && !In(e)) return !1;
  const n = t ?? Nt.nightBelow, i = e ?? Nt.dayAbove;
  return n >= 0 && n < i;
}
function Td(t, e) {
  if (t !== void 0 && !In(t) || e !== void 0 && !In(e)) return !1;
  const n = t ?? Nt.sunNight, i = e ?? Nt.sunDay;
  return n < i;
}
const zd = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= Od, Ul = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function $b(t, e) {
  var l, a, d, p;
  const n = vb(t), i = (c) => {
    const f = c ? e == null ? void 0 : e[c] : void 0;
    return f && typeof f == "object" ? f : void 0;
  }, s = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (s && ((a = s.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof s.state == "string" && s.state.trim() !== "") {
    const c = Number(s.state);
    if (Number.isFinite(c)) return { state: Ul(c, n.nightBelow, n.dayAbove), lux: c };
  }
  const o = i((d = t.bindings) == null ? void 0 : d.sun), r = (p = o == null ? void 0 : o.attributes) == null ? void 0 : p.elevation;
  return o && o.state !== "unavailable" && o.state !== "unknown" && In(r) ? { state: Ul(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
function yb(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function xb(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return v;
  const i = Nt, s = (a, d) => {
    if (d === n[a] || n[a] === void 0 && d === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(Rt(t.level, e.id, { [a]: d }));
  }, o = (a, d) => {
    const p = String(n[a] ?? i[a]);
    return P(d, b`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${G(p)}
      @change=${(c) => {
      const f = c.target;
      if (f.value.trim() === "") {
        s(a, void 0);
        return;
      }
      const h = yb(f.value);
      if (h === null) {
        f.value = p, t.setFieldNotice(u("props.badDecimal"));
        return;
      }
      s(a, h);
    }} />`);
  }, r = P(u("props.debounce"), Fe({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: Od },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => s("debounce", a),
    onBlank: () => s("debounce", void 0)
  })), l = (a, d) => b`<p class="warn" data-note=${a}>${d}</p>`;
  return b`<div class="cfields" data-section="daylight">
    ${o("nightBelow", u("props.nightBelow"))}
    ${o("dayAbove", u("props.dayAbove"))}
    ${Nd(n.nightBelow, n.dayAbove) ? v : l("lux-pair", u("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${o("sunNight", u("props.sunNight"))}
    ${o("sunDay", u("props.sunDay"))}
    ${Td(n.sunNight, n.sunDay) ? v : l("sun-pair", u("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${zd(n.debounce) ? v : l("debounce", u("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function uo(t, e) {
  return e === "control" && t.props.kind === "equipment" ? u("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? u("binding.onOff") : u(`role.${e}`);
}
const Ds = (t) => String(t).padStart(2, "0");
function kb(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Ds(e.getHours())}:${Ds(e.getMinutes())}:${Ds(e.getSeconds())}`;
}
const Mb = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function _b(t) {
  return t.status === "error" ? t.reason === "unavailable" ? u("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : u("output.errorNotConfigured") : t.last ? u("output.last").replace("{event}", Mb(t.last, t.kind)).replace("{time}", kb(t.last.at)) : u("output.none");
}
function Sb(t, e) {
  if (!Ri(e.props.kind)) return v;
  const n = t.feed.stateOf(e), i = n ? _b(n) : t.feed.error ?? (t.feed.ready ? u("output.notSaved") : null);
  return i === null ? v : b`<p class="note" data-field="output">${i}</p>`;
}
function Ab(t, e, n, i) {
  const s = Tc(t.meta, i, t.states), o = Hu(t.level, e, n);
  return b`
    ${s === "missing" ? b`<p class="warn" data-note="missing">${u("binding.missing")}</p>` : v}
    ${s === "unavailable" ? b`<p class="note" data-note="unavailable">${u("binding.unavailable")}</p>` : v}
    ${o.length ? b`<p class="note" data-note="also">${u("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : v}`;
}
function Cb(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = uo(e, i);
  return b`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${u("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${ur(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const d = Hi(t.level, e.id, i, a.detail.value);
    d !== t.level && t.commit(d);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Io(i) ? gb(t, e, i) : v}
    ${s ? Ab(t, e, i, s) : v}
  </div>`;
}
function Ib(t) {
  const e = t.device, n = Eo(t.level.devices.map(t.status));
  return b`<div class="props bprops">
    ${t.notice ? b`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.fieldNotice ? b`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : v}
    ${t.registryError ? b`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${u(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${e ? b`
      <h4>${rs(e)}</h4>
      ${ar(e, (i) => t.commit(Rt(t.level, e.id, {}, i)))}
      ${Sb(t, e)}
      ${De(e).map((i) => b`${Cb(t, e, i)}${bb(t, e, i.role)}`)}
      ${wb(e)}
      ${xb(t, e)}` : b`<p class="muted">${u("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${u("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${u("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${u("binding.reload")}</button>
  </div>`;
}
const Eb = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Db = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Lb = 6, Pb = ["A", "0", "B"], Ob = ["power", "control"], Nb = ["power", "power_in", "power_out", "voltage", "control"], Tt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function Gt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function Kt(t, e, n, i, s, o) {
  return b`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${ur(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function Tb(t, e) {
  const n = e.name ?? "";
  return P(u("props.name"), b`<input class="val wide" type="text" data-field="name"
    placeholder=${u(`power.kind.${e.kind}`)} .value=${G(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(kn(t.power, e.id, { name: o }, Tt(t))) : s.value = n;
  }} />`);
}
function zb(t, e) {
  const n = new Set(De(e).map((i) => i.role));
  return b`${Ob.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return b`<div class="role">
      <div class="role-head"><span class="role-label">${u(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? b`<b>${ii(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${u("power.boundHint")}</p>`;
}
function jn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function Hb(t, e) {
  var o;
  const n = De(e), i = Nb.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return b`
    ${ar(e, (r) => jn(t, Rt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return b`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${uo(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${ur(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${uo(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), jn(t, Hi(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? ht(
    "controllable",
    u("props.controllable"),
    !!s.controllable,
    (r) => jn(t, qi(t.level, e.id, r))
  ) : v}
    ${s.kind === "equipment" ? ht("inverter", u("props.inverter"), !!s.inverter, (r) => {
    const l = Fc(t.level, t.power, e.id, r);
    return jn(t, l.level, l.power);
  }) : v}`;
}
function Vb(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return b`<p class="warn" data-note="device-missing">${u("power.missing")}</p>`;
  const i = Vt(n) ? v : ht("output", u("power.enableOutput"), e.output !== !1, (s) => {
    const o = Tt(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(Qi(kn(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? b`${Hb(t, n)}${i}` : b`
    ${P(u("props.name"), b`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${P(u("props.kind"), b`<span class="val ro">${u(`device.${n.props.kind}`)}</span>`)}${zb(t, n)}${i}`;
}
function Rb(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: u(`power.form.${r}`) }));
  return b`
    ${P(u("power.form"), se(e.form, i, (r) => {
    r !== e.form && t.commitPower(kn(t.power, e.id, { form: r }, Tt(t)));
  }, "form"))}
    <div class="row"><span>${u("power.position")}</span><span class="seg pos">${Pb.map((r) => b`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${u("power.positionHint")}</p>`;
}
function Bb(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, d) => {
    if (a === i && d === s) return !1;
    t.commitPower(kn(t.power, e.id, n ? { w: a, h: d } : { w: d, h: a }, Tt(t)));
  }, r = (a, d, p) => Fe({ value: d, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: p }), l = ["h", "v"].map((a) => ({ v: a, label: u(`power.orientation.${a}`) }));
  return b`
    ${P(u("power.orientation"), se(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(kn(t.power, e.id, { w: e.h, h: e.w }, Tt(t)));
  }, "bus-orientation"))}
    ${P(u("power.busLength"), r("bus-length", i, (a) => o(Math.max(so, s + 1, a), s)))}
    ${P(u("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(Lb, a), i - 1))))}`;
}
function Fb(t, e) {
  switch (e.kind) {
    case "grid":
      return b`
      ${Kt(t, "power", u("power.field.power"), at, e.power, (n) => Gt(t, e, "power", n))}
      ${Kt(t, "voltage", u("power.field.voltage"), Eb, e.voltage, (n) => Gt(t, e, "voltage", n))}`;
    case "device":
      return Vb(t, e);
    case "battery":
      return b`
      ${Kt(t, "power", u("power.field.batteryPower"), at, e.power, (n) => Gt(t, e, "power", n))}
      ${Kt(t, "soc", u("power.field.soc"), Db, e.soc, (n) => Gt(t, e, "soc", n))}`;
    case "pv":
      return Kt(t, "power", u("power.field.power"), at, e.power, (n) => Gt(t, e, "power", n));
    case "transfer":
      return Rb(t, e);
    case "bus":
      return Bb(t, e);
    default:
      return v;
  }
}
function Ub(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return b`
    <h4>${i ? rs(i) : u(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? v : Tb(t, e)}
    ${Fb(t, e)}
    <div class="pactions">
      ${n ? b`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Uf(t.power, e.id))}>${u("power.autoPorts")}</button>` : v}
      ${e.kind === "grid" ? v : b`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Vc(t.power, e.id))}>${u("action.delete")}</button>`}
    </div>`;
}
function Wb(t, e) {
  var s, o;
  const n = Tt(t), i = (r) => {
    const l = t.power.blocks.find((d) => d.id === ("block" in r ? r.block : r.bus)), a = l ? es(l, n) || u(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return b`
    <h4>${u("power.wire")}</h4>
    ${P(u("power.wire.from"), b`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${P(u("power.wire.to"), b`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${P(u("power.wire.power"), b`<span class="val ro" data-field="wire-power">${_t((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Uc(t.power, e.id))}>${u("action.delete")}</button></div>`;
}
function jb(t) {
  const e = Wc(t.level, t.power);
  return b`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = yd(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${u("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${u("power.help.device")}</p>
    ${e.length === 0 ? b`<p class="muted" data-note="no-devices">${u("power.noDevices")}</p>` : b`<div class="pdevs">
      ${e.map((i) => b`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${rs(i)}</span>
      </button>`)}
    </div>`}`;
}
function qb(t) {
  if (t.toolId === "power-device") return jb(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return Ub(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Wb(t, i) : t.toolId !== "power-select" ? b`<p class="muted" data-note="power-hint">${u("power.help.place")}</p>` : b`<p class="muted" data-note="power-hint">${u("power.pick")}</p><p class="muted">${u("power.help.select")}</p>`;
}
function Zb(t) {
  return b`<div class="props pprops">
    ${t.notice ? b`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.feedError ? b`<p class="note" data-notice="feed">${t.feedError}</p>` : v}
    ${qb(t)}
  </div>`;
}
const Hd = "ended: switched elsewhere";
function as(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
function Vd(t) {
  return t.sent === !1 && (t.reason === Hd || t.reason.startsWith("switched elsewhere"));
}
const Gb = 5e3, Kb = 12;
function Wl(t) {
  t().catch(() => {
  });
}
class Xb {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Wl(n.unsub));
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
          Wl(s);
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
    this.retries >= Kb || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Gb));
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
const po = 3600;
function Ue(t) {
  return { id: ne(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const Yb = (t, e) => [...t, e], Qb = (t, e) => t.map((n) => n.id === e.id ? e : n), Jb = (t, e) => t.filter((n) => n.id !== e);
function ew(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const tw = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, _i = (t) => [...t.inputs, ...t.gate ? [t.gate] : []].flatMap(tw), nw = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, iw = (t, e) => t.filter((n) => n.id !== e && _i(n).includes(e));
function sw(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of _i(l)) {
      const d = s(a, [...r, o]);
      if (d) return d;
    }
    return i.add(o), null;
  };
  for (const o of _i(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const Si = /^([01]\d|2[0-3]):[0-5]\d$/, mt = (t) => typeof t == "number" && Number.isFinite(t);
function ow(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return mt(e.below) && e.below > 0 && mt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && Si.test(n) && Si.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const jl = (t) => Number.isInteger(t) && t >= 0 && t <= po;
function rw(t, e, n, i, s, o, r, l, a, d, p, c, f, h, m, $, w, g, y) {
  var C;
  const x = [];
  e.name.trim() || x.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && x.push("inputs");
  const M = [...e.inputs, ...e.gate ? [e.gate] : []], k = [...M.flatMap(nw), ...e.onTrue.map((I) => I.device), ...e.onFalse.map((I) => I.device)], _ = M.flatMap((I) => "light" in I.source ? [I.source.light] : "daylight" in I.source ? [I.source.daylight] : []);
  (k.some((I) => !n(I)) || _.some((I) => !(s ?? n)(I)) || e.vent && [e.vent.sensor, e.vent.than].some((I) => !(o ?? n)(I)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((I) => !(p ?? n)(I)) || e.leak.valves.some((I) => !(c ?? n)(I))) || e.timed && (!(f ?? n)(e.timed.button) || !(h ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(s ?? n)(e.outside.sensor)) || e.beurer && (!($ ?? n)(e.beurer.heater) || !(w ?? n)(e.beurer.source)) || e.control && (e.control.sources.some((I) => !(g ?? n)(I)) || e.control.loads.some((I) => !(y ?? n)(I)))) && x.push("device-missing");
  const E = new Set(t.map((I) => I.id));
  _i(e).some((I) => I !== e.id && !E.has(I)) && x.push("rule-missing"), sw(t, e) && x.push("cycle"), (!jl(e.onDelay) || !jl(e.offDelay)) && x.push("delay");
  for (const I of M) {
    const V = ow(I);
    V && !x.includes(V) && x.push(V);
  }
  return e.vent && lw(e, e.vent) && x.push("vent"), e.boiler && _w(e, e.boiler) && x.push("boiler"), e.leak && aw(e, e.leak) && x.push("leak"), e.timed && pw(e, e.timed) && x.push("timed"), e.outside && mw(e, e.outside) && x.push("outside"), e.beurer && gw(e, e.beurer) && x.push("beurer"), e.control && bw(e, e.control) && x.push("control"), (C = e.boiler) != null && C.button && d && !x.includes("device-missing") && !d(e.boiler.button) && x.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((I) => {
    const V = i(I.device);
    return V !== void 0 && !V.includes(I.do);
  }) && x.push("action"), x;
}
function lw(t, e) {
  if (t.inputs.length > 0 || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !mt(e.above) || !mt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function aw(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((s) => typeof s == "string" && s !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const cw = (t) => t.leak !== void 0;
function dw(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const s = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), o = s ? tt(s, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: o.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: o.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const uw = 15;
function pw(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const fw = (t) => t.timed !== void 0, hw = 30;
function mw(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && Si.test(n) && Si.test(i) && n !== i);
}
const qn = { above: 200, offDelay: 60, keep: 10, every: 30 };
function gw(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !mt(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
function bw(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((s) => typeof s == "string" && s !== "") && new Set(i).size === i.length;
  return !n(e.sources) || !n(e.loads) || e.sources.some((i) => e.loads.includes(i));
}
const ww = (t) => t.control !== void 0;
function vw(t, e, n) {
  var c, f;
  const i = Ue(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const s = e === null ? void 0 : t.levels.find((h) => h.zones.some((m) => m.id === e)), o = s ? tt(s, e).filter((h) => h.participates).map((h) => h.device) : [], r = o.filter((h) => h.props.kind === "wall_switch" || h.props.kind === "smart_button"), l = o.filter((h) => {
    const m = J(h);
    return m.includes("on") && m.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, d = l.length === 1 ? l[0] : void 0, p = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((c = a.bindings) != null && c.state) && a.bindings.state === ((f = d == null ? void 0 : d.bindings) == null ? void 0 : f.control);
  return i.control = { sources: a ? [a.id] : [], loads: d && !p ? [d.id] : [] }, i;
}
const $w = (t) => t.beurer !== void 0;
function yw(t, e) {
  const n = Ue(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = qn.offDelay, n.beurer = { heater: "", source: "", above: qn.above, keep: qn.keep, every: qn.every }, n;
}
const xw = (t) => t.outside !== void 0;
function kw(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), r = (s ? tt(s, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && J(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: hw }, i;
}
function Mw(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), o = s ? tt(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = o.filter((a) => {
    const d = J(a);
    return d.includes("on") && d.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: uw }, i;
}
function _w(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !mt(n.limit) || !mt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const Sw = (t) => t.boiler !== void 0, fo = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function Aw(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Rd = 3e3, Bd = 1400;
function Cw(t, e, n) {
  var d;
  const i = Ue(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const s = e === null ? void 0 : t.levels.find((p) => p.zones.some((c) => c.id === e)), o = s ? tt(s, e).filter((p) => p.participates).map((p) => p.device) : [], r = o.filter(fo), l = o.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((d = t.power) == null ? void 0 : d.blocks) ?? []).filter((p) => p.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Rd, nominal: Bd }), i;
}
const Iw = (t) => t.vent !== void 0, Ew = 600;
function Dw(t, e, n) {
  var l;
  const i = Ue(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = Ew;
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((d) => d.id === e)), o = s ? tt(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = o.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const Lw = 1800;
function Pw(t, e, n, i) {
  const s = Ue(e);
  return s.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", s.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Lw } } }], s;
}
const Ow = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), Ls = (t) => Ow.has(t.props.kind);
function J(t) {
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
function si(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function He(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Fd(t) {
  if (as(t)) return u("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", He(t.at)).trim();
  if (t.sent === !1)
    return u(Vd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", He(t.at)).trim();
  const e = `${u(`rules.did.${t.action}`)} ${t.target} ${He(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function Ud(t) {
  return as(t) ? u("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", He(t.at)) : u("vent.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", He(t.at));
}
function Nw(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${u("rules.status.error")}: ${e.reason}` : u(`rules.status.${e.status}`) : t.enabled === !1 ? u("rules.status.disabled") : n.live ? u("rules.unsaved") : u("rules.noTrace");
}
function Tw(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !si(r, t);
  return b`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${u(`rules.verdict.${s}`)}
        title=${u(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? b` <span class="orphan">(${u("rules.orphan")})</span>` : v}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${Nw(t, i, n)}</span>
        ${l ? b`<span class="runsaved">${u("rules.unsavedChanges")}</span>` : v}
        ${o > 0 ? b`<span class="rwarn">${o === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(o))}</span>` : v}
        ${i != null && i.last ? b`<span class="rlast">${Fd(i.last)}</span>` : v}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${u("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${u("rules.delete")}</button>
      </div>
    </div>`;
}
function zw(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = ew(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return b`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : u("rules.noZone")}</h4>
      ${t.feedError ? b`<p class="muted">${t.feedError}</p>` : v}
      ${n === null && i.length === 0 && t.rules.length === 0 ? b`<p class="muted">${u("rules.hint")}</p>` : v}
      ${i.length === 0 ? b`<p class="muted rempty">${u("rules.empty")}</p>` : i.map((s) => Tw(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const Wd = {
  condition: kh,
  leak: id,
  timer: Fh,
  outside: Xh,
  vent: Jc,
  boiler: Kh,
  timed: Uh,
  beurer: Dh,
  control: ed
}, Hw = ["condition", "timer"], Vw = ["vent", "boiler", "leak", "timed", "control", "outside", "beurer"], ho = (t) => b`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${S`<path d=${t}></path>`}</svg>`;
function Rw(t, e, n) {
  return [
    ...Hw.map((i) => b`
      <button class="tool" data-template=${i} title=${u(`rules.template.${i}`)} @click=${() => t(i)}>
        ${ho(Wd[i])}<span class="tlabel">${u(`rules.template.${i}`)}</span></button>`),
    b`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${u("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${ho(Hh)}<span class="tlabel">${u("rules.automations")}</span></button>`
  ];
}
function Bw(t) {
  var o;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), s = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  s !== null && (t.preventDefault(), (o = n[s]) == null || o.focus());
}
function Fw(t, e, n) {
  return b`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${u("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${Bw}>
      ${Vw.map((i) => b`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${ho(Wd[i])}<span>${u(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function Uw(t, e) {
  return t.mode === "automation" ? b`<div class="tools">${$d(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${Rw((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? c1(t.mode, t.toolId, (n) => t.pickTool(n)) : v1({
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
function Ww(t, e) {
  var i;
  const n = t.selection;
  return Ib({
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
function jw(t, e) {
  var i;
  if (t.mode === "binding") return Ww(t, e);
  if (t.mode === "automation")
    return b`<div class="props">${zw({
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
    return Zb({
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
  return t.mode === "equipment" ? U1({
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
  }) : X1({
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
function qw(t, e) {
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
function Zw(t, e) {
  const n = t === "zone" ? `${u("tool.zone")} · ${u(`zones.kind.${e}`)}` : u(`tool.${t}`);
  return b`<span class="tool-chip">${vd(t)}${n}</span>`;
}
function Gw(t) {
  return b`
    <div class="status">
      ${Zw(t.tool, t.zoneMethod)}
      ${qw(t.tool, t.zoneMethod).map(([e, n]) => b`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? b`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${u(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? v : b`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${u("status.cones")}
      </label>`}
    </div>`;
}
function Kw(t, e) {
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
  return S`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((l, a) => S`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function Xw(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: d } = s[0], p = Math.hypot(d.x - a.x, d.y - a.y);
    let c = Math.atan2(-(d.y - a.y), d.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: ct(p), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: ct(r), second: ct(l) };
}
function Yw(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const Qw = _a`
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
`, Jw = 5e-3, ev = 2, Ai = (t) => Math.max(Jw, Math.min(ev, t));
function tv(t, e, n) {
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
function nv(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Ai(Math.min(e, n) / 12e3) };
  const i = t.map((c) => c.x), s = t.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, p = Ai(Math.min(e / (l - r), n / (d - a)));
  return { x: (r + l) / 2 - e / p / 2, y: (a + d) / 2 - n / p / 2, scale: p };
}
function iv(t, e, n, i, s) {
  const o = Ai(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function sv(t, e, n) {
  const i = Ai(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function ov(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function ql(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function rv(t, e, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * t.scale >= 6 ? 100 * s : o, l = 1 / t.scale;
  return S`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const lv = ["Shift", "Control", "Alt", "Meta"], av = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, cv = new Map(Object.entries(wd).map(([t, e]) => [`Key${e}`, t]));
function Zl(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class dv {
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
          this.h.view = ov(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.view = sv(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Zl(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? cv.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = av[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Zl(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !lv.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function jd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function uv(t) {
  return b`
    <div class="draft-banner" role="status">
      <span>${u("draft.banner").replace("{time}", jd(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${u("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${u("draft.discard")}</button>
    </div>`;
}
function $t(t, e, n, i) {
  return b`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? b`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${n.map((s) => b`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function pv(t) {
  var n;
  const e = { action: "cancel", label: u("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? $t(u("draft.title"), u("draft.text").replace("{time}", jd(i.savedAt)), [
        { action: "restore", label: u("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: u("draft.discard"), onClick: () => t.discard(i) }
      ]) : v;
    }
    case "new":
      return $t(u("new.title"), u("new.text"), [
        { action: "new-discard", label: u("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return $t(u("delete.title"), u("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return $t(u("delete.rule.title"), u("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? u("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return $t(u("switch.title"), u("switch.text"), [
        { action: "switch-discard", label: u("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return $t(u("conflict.title"), u(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: u("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: u("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return v;
  }
}
const Xt = "plan_studio.draft.", Zn = "plan_studio.lastPlanId";
function fv() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function hv(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class mv {
  constructor(e = fv, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Xt + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Xt + e), s = i ? JSON.parse(i) : null;
      return hv(s) && s.planId === e ? s : null;
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
        if (!(s != null && s.startsWith(Xt))) continue;
        const o = this.read(s.slice(Xt.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(Zn)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Zn, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Zn)) === e && n.removeItem(Zn);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Xt + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const qd = 5e3, Zd = 12;
function Gl(t) {
  t().catch(() => {
  });
}
class gv {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Gl(n.unsub));
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
          Gl(s);
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
    this.retries >= Zd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, qd));
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
const bv = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function Gd(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const Kd = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function wv(t, e) {
  var o;
  const n = Kd(t, e);
  if (!n || n.state.trim() === "") return;
  const i = bv[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const vv = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function oi(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (h, m, $) => {
    if (!h) return;
    l = Kd(e, h);
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
    const h = vv(l);
    h !== void 0 && (c.timerSince = h);
  }
  const f = De(t).some((h) => h.role === "power") ? wv(e, n.power) : void 0;
  return f !== void 0 && Math.round(f) >= 1 && (s === "on" || !r) && (c.power = f), i === "illuminance_sensor" && (n.illuminance || n.sun) && (c.daylight = $v(t, e)), c;
}
function $v(t, e) {
  const n = $b(t, e);
  if (n.state === null) return u("daylight.noData");
  const i = u(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${u("daylight.bySun")}`;
}
function Xd(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: Gd(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: _t(t.power), tone: "device" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device" }), i;
}
const yv = 1046, xv = 1.25, bt = 480, H = 10, F = 34, Yd = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, Qd = (t) => Math.floor((t - 20) / 6.6), kv = (t) => Math.floor((t - 20) / 6), Ee = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : Gd(t * 1e3), ee = (t) => 14 + 18 * t;
function nt(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return S`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, s) => S`<text class=${s === 0 ? "fc-t1" : s === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(s)}>${Yd(i, s === 0 ? Qd(t.w) : kv(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Ci(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const Oe = yv, yt = Oe / 2, dt = 230, ri = 26, ve = 4, Kl = 36, me = ee(2), Mv = (Oe - ve * dt - (ve - 1) * ri) / 2, Xl = 200, Gn = 460, st = 330, Jd = 40, Ps = 8, _v = 24, mo = (Oe - st * 2 - Jd) / 2, Yl = mo + st + Jd;
function Tn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${u("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${u("rules.unit.min")}` : i === 0 ? `${n} ${u("rules.unit.h")}` : `${n} ${u("rules.unit.h")} ${i} ${u("rules.unit.min")}`;
}
const fr = (t, e) => Ee(Math.max(1, Math.ceil((t - e) / 1e3)));
function go(t, e = !1) {
  return "light" in t ? `${u("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? u(`rules.daylight.is.${t.is}`) : "sun" in t ? u(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${u(`rules.held.${t.held.state}`)} ${Tn(t.held.seconds)}` : "rule" in t ? u("rules.src.rule") : u("rules.src.device");
}
const Ql = (t) => Number.isFinite(t) ? String(t) : "?";
function Sv(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function Av(t, e, n) {
  return "daylight" in n ? eu(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? u("rules.flow.trueIn").replace("{t}", fr(t.until, e)) : t.detail;
}
const eu = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${fr(t.until, e)})`), oe = (t) => u(`rules.val.${t === null ? "unknown" : t}`), U = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function Cv(t) {
  if (t <= ve) {
    const i = (Oe - t * dt - (t - 1) * ri) / 2;
    return Array.from({ length: t }, (s, o) => i + o * (dt + ri));
  }
  const e = t - Math.floor((t - 1) / ve) * ve, n = Math.floor((ve - e) / 2);
  return Array.from({ length: t }, (i, s) => {
    const o = s % ve;
    return Mv + (s >= t - e ? n + o : o) * (dt + ri);
  });
}
function Iv(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = e.inputs.map((z, Q) => {
    const fe = (i == null ? void 0 : i[Q].value) ?? null;
    return fe === null || !z.not ? fe : !fe;
  }), o = i ? Sv(e.combine, s) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, d = (n == null ? void 0 : n.unknownInputs) ?? 0, p = e.gate ? n == null ? void 0 : n.gate : void 0, c = e.gate ? p ? "daylight" in e.gate.source && p.value !== null ? `${u(p.value ? "rules.flow.open" : "rules.flow.closed")}, ${eu(p, t.now)}` : p.value === !0 ? u("rules.flow.open") : p.value === null ? `${u("rules.flow.closed")}, ${u("rules.val.unknown")}` : p.until !== void 0 && p.until > t.now ? `${u("rules.flow.closed")}, ${u("rules.flow.opensIn").replace("{t}", fr(p.until, t.now))}` : `${u("rules.flow.closed")}${p.detail ? `, ${p.detail}` : ""}` : go(e.gate.source) : "", f = u("rules.flow.delay").replace("{on}", Ql(e.onDelay)).replace("{off}", Ql(e.offDelay)), h = n === void 0 ? f : `${oe(r ?? null)}${l ? `, ${u("rules.flow.pending").replace("{to}", oe(l.to)).replace("{t}", Ee(a))}` : ""}`, m = e.inputs.length, $ = Math.ceil(m / ve), w = Cv(m), g = (z) => H + z * (me + Kl), y = (z) => g(Math.floor(z / ve)), x = (z) => g(z) + me + (z === $ - 1 ? F : Kl) / 2, M = m === 0 ? H : g($ - 1) + me + F, k = M + me + F, _ = k + me + F, E = (e.gate ? _ : k) + me, C = E + F / 2, I = E + F, V = I + _v, N = Math.max(1, e.onTrue.length, e.onFalse.length), R = V + N * (me + Ps) - Ps + H, Z = [
    { side: "true", x: mo, list: e.onTrue, head: u("rules.whenTrue") },
    { side: "false", x: Yl, list: e.onFalse, head: u("rules.whenFalse") }
  ], X = [];
  w.forEach((z, Q) => X.push(`M${z + dt / 2} ${y(Q) + me} V${x(Math.floor(Q / ve))}`));
  for (let z = 0; z < $; z++) {
    const Q = [yt, ...w.slice(z * ve, (z + 1) * ve).map((fe) => fe + dt / 2)];
    Math.max(...Q) > Math.min(...Q) && X.push(`M${Math.min(...Q)} ${x(z)} H${Math.max(...Q)}`);
  }
  m > 0 && X.push(`M${yt} ${x(0)} V${M}`), X.push(`M${yt} ${M + me} V${k}`), e.gate && X.push(`M${yt} ${k + me} V${_}`), X.push(`M${yt} ${E} V${C} H${mo + st / 2} V${I}`, `M${yt} ${C} H${Yl + st / 2} V${I}`);
  const ie = (z) => nt({ ...z, h: me, focused: t.focused === z.field, onClick: () => t.onFocus(z.target) });
  return b`
    <div class="flow">
      <svg class="fc" style=${`max-width:${Oe * xv}px`} viewBox=${`0 0 ${Oe} ${R}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("rules.flow.title")}>
        ${X.map((z) => S`<path class="fc-link" d=${z}></path>`)}
        ${e.inputs.map((z, Q) => {
    const fe = i == null ? void 0 : i[Q];
    return ie({
      x: w[Q],
      y: y(Q),
      w: dt,
      field: `input-${Q}`,
      target: { input: Q },
      cls: fe ? U(fe.value) : "",
      lines: [`${z.not ? "NOT " : ""}${t.inputName(z)}`, fe ? Av(fe, t.now, z.source) : go(z.source, z.not === !0)]
    });
  })}
        ${ie({
    x: (Oe - Xl) / 2,
    y: M,
    w: Xl,
    field: "combine",
    target: "gate",
    cls: o === void 0 ? "" : U(o),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...o === void 0 ? [] : [oe(o)]]
  })}
        ${ie({
    x: (Oe - Gn) / 2,
    y: k,
    w: Gn,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : U(r ?? null),
    lines: [u("rules.flow.result"), h]
  })}
        ${e.gate ? ie({
    x: (Oe - Gn) / 2,
    y: _,
    w: Gn,
    field: "gate-input",
    target: "gate-input",
    cls: p ? U(p.value) : "",
    lines: [`${u("rules.flow.gate")}: ${e.gate.not ? "NOT " : ""}${t.inputName(e.gate)}`, c]
  }) : v}
        ${Z.map((z) => S`
          <text class="fc-head" text-anchor="middle" x=${z.x + st / 2} y=${I + 14}>${z.head}</text>
          ${z.list.length === 0 ? S`<text class="fc-t2" text-anchor="middle" x=${z.x + st / 2} y=${V + me / 2 + 4}>${u("rules.noActions")}</text>` : z.list.map((Q, fe) => ie({
    x: z.x,
    y: V + fe * (me + Ps),
    w: st,
    field: `action-${z.side}-${fe}`,
    target: { action: z.side, index: fe },
    cls: "",
    lines: [t.actionName(Q.device), Ev(Q.do)]
  }))}`)}
      </svg>
      ${d > 0 ? b`<p class="fc-warn">${d === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(d))}</p>` : v}
      ${n != null && n.held ? b`<p class="fc-warn" data-note="held">${u("rules.flow.heldNote")}</p>` : v}
      ${n != null && n.last ? b`<p class="fc-last">${u("rules.flow.last")} ${Fd(n.last)}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const Ev = (t) => u(`rules.act.${t}`), Jl = { s: 1, min: 60, h: 3600 }, Dv = ["s", "min", "h"];
function Lv(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Ii = (t) => Number.isFinite(t) ? String(t) : "";
function ea(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const bo = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? u("rules.missingDevice") : t.ruleName(e.rule) ?? u("rules.missingRule");
};
function tu(t, e) {
  var i, s;
  const n = e.source;
  return "device" in n || "rule" in n ? bo(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? u("rules.light.noSensor") : "daylight" in n ? ((s = t.deviceById(n.daylight)) == null ? void 0 : s.name) ?? u("rules.light.noSensor") : "sun" in n ? u("rules.src.sun") : "time" in n ? u("rules.src.time") : n.held.sources.length === 0 ? u("rules.src.held") : `${u("rules.src.held")}: ${n.held.sources.map((o) => bo(t, o)).join(", ")}`;
}
const wo = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function Pv(t, e) {
  return "device" in e || "rule" in e ? wo(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => wo(t, n)) : !1;
}
function nu(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function iu(t) {
  return b`
    <optgroup label=${u("rules.groupDevices")}>
      ${t.inputDevices.map((e) => b`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? b`<optgroup label=${u("rules.groupRules")}>
      ${t.otherRules.map((e) => b`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : v}`;
}
function ta(t, e) {
  return b`
    <option value="">${e}</option>
    ${iu(t)}
    <optgroup label=${u("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((n) => b`<option value=${n}>${u(`rules.src.${n}`)}</option>`)}
    </optgroup>`;
}
function Ov(t, e, n, i) {
  const s = t.draft.rule, o = e === "true" ? "onTrue" : "onFalse", r = s[o], l = (f) => t.onChange({ ...s, [o]: f }), a = t.deviceById(i.device), d = a ? J(a) : [], p = d.includes(i.do) ? d : [...d, i.do], c = Ci({ action: e, index: n });
  return b`
    <div class="rline" data-field=${c} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(f) => {
    const h = t.deviceById(f.target.value);
    h && l(r.map((m, $) => $ === n ? { device: h.id, do: J(h).includes(m.do) ? m.do : J(h)[0] } : m));
  }}>
        ${a && !t.actionDevices.includes(a) ? b`<option value=${a.id}>${a.name}</option>` : v}
        ${a ? v : b`<option value=${i.device}>${u("rules.missingDevice")}</option>`}
        ${t.actionDevices.map((f) => b`<option value=${f.id}>${f.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(f) => l(r.map((h, m) => m === n ? { ...h, do: f.target.value } : h))}>
        ${p.map((f) => b`<option value=${f}>${u(`rules.act.${f}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${u("rules.remove")} @click=${() => l(r.filter((f, h) => h !== n))}>&times;</button>
    </div>`;
}
function na(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return b`
    <div class="rgroup">
      <div class="rlabel">${u(e === "true" ? "rules.whenTrue" : "rules.whenFalse")}</div>
      ${n[i].map((s, o) => Ov(t, e, o, s))}
      <select class="radd" data-action=${`add-action-${e}`} .value=${""}
        @change=${(s) => {
    const o = s.target, r = t.deviceById(o.value);
    o.value = "", r && J(r).length > 0 && t.onChange({ ...n, [i]: [...n[i], { device: r.id, do: J(r)[0] }] });
  }}>
        <option value="">${u("rules.addAction")}</option>
        ${t.actionDevices.map((s) => b`<option value=${s.id}>${s.name}</option>`)}
      </select>
    </div>`;
}
const Os = (t) => t.trim() === "" ? NaN : Number(t);
function ia(t, e, n, i) {
  var s;
  return b`<select data-part=${e} data-value=${n} @change=${(o) => i(o.target.value)}>
    ${t.lightSensors.some((o) => o.id === n) ? v : b`<option value=${n}>${((s = t.deviceById(n)) == null ? void 0 : s.name) ?? u("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((o) => b`<option value=${o.id}>${o.name}</option>`)}
  </select>`;
}
const Nv = ["night", "dark", "day"];
function Tv(t, e, n, i) {
  var s;
  if ("daylight" in n)
    return b`
      <div class="rparams">
        <label class="grow">${u("rules.daylight.sensor")} ${ia(t, "daylight", n.daylight, (o) => i({ ...n, daylight: o }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(o) => i({ ...n, is: o.target.value })}>
          ${Nv.map((o) => b`<option value=${o}>${u(`rules.daylight.is.${o}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const o = n.light === "" ? void 0 : t.lightUnit(n.light);
    return b`
      <div class="rparams">
        <label class="grow">${u("rules.light.sensor")}
          ${ia(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${u("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Ii(n.below)}
            @input=${(r) => i({ ...n, below: Os(r.target.value) })} /> lx</label>
        <label>${u("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Ii(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: Os(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${u("rules.light.unknownDark")}</label>
        ${o !== void 0 && o !== "lx" ? b`<p class="rwarn" data-warn="light-unit">${u("rules.light.unit").replace("{unit}", o)}</p>` : v}
      </div>`;
  }
  if ("time" in n)
    return b`
      <div class="rparams">
        <label>${u("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(o) => i({ time: { ...n.time, from: o.target.value } })} /></label>
        <label>${u("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(o) => i({ time: { ...n.time, to: o.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const o = n.held, r = ((s = t.draft.units) == null ? void 0 : s[e]) ?? Lv(o.seconds), l = Number.isFinite(o.seconds) ? String(+(o.seconds / Jl[r]).toFixed(4)) : "", a = (d) => i({ held: { ...o, ...d } });
    return b`
      <div class="rparams">
        <div class="rsources">
          ${o.sources.length === 0 ? b`<span class="muted">${u("rules.held.noSources")}</span>` : v}
          ${o.sources.map((d, p) => b`
            <span class="rchip${wo(t, d) ? " bad" : ""}" data-part="source">${bo(t, d)}
              <button class="btn" data-action="remove-source" title=${u("rules.held.removeSource")}
                @click=${() => a({ sources: o.sources.filter((c, f) => f !== p) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(d) => {
      const p = d.target, c = nu(t, p.value);
      p.value = "", c && ("device" in c || "rule" in c) && a({ sources: [...o.sources, c] });
    }}>
            <option value="">${u("rules.held.addSource")}</option>
            ${iu(t)}
          </select>
        </div>
        <label>${u("rules.held.state")}
          <select data-part="state" data-value=${o.state}
            @change=${(d) => a({ state: d.target.value })}>
            ${["on", "off", "any"].map((d) => b`<option value=${d}>${u(`rules.held.${d}`)}</option>`)}
          </select></label>
        <label>${u("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(d) => {
      var p;
      ((p = t.draft.units) == null ? void 0 : p[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(Os(d.target.value) * Jl[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(d) => t.onUnit(e, d.target.value)}>
            ${Dv.map((d) => b`<option value=${d}>${u(`rules.unit.${d}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return v;
}
function sa(t, e, n, i) {
  const s = e.source, o = !("device" in s || "rule" in s), r = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return b`
    <div class="rline${Pv(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${o ? u(`rules.src.${r}`) : tu(t, e)}${"sun" in s ? b` <span class="muted">${e.not ? u("rules.sun.above") : go(s)}</span>` : v}</span>
      ${"daylight" in s && !e.not ? v : b`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(l) => {
    const a = l.target.checked, { not: d, ...p } = e;
    i(a ? { ...p, not: !0 } : p);
  }} /> ${u("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${Tv(t, n, s, (l) => i({ ...e, source: l }))}
    </div>`;
}
function zv(t) {
  const e = t.draft.rule, n = (s) => (o) => {
    const r = o.target, l = r.value ? nu(t, r.value) : null;
    r.value = "", l && s(l);
  }, i = (s) => {
    const { gate: o, ...r } = e;
    t.onChange(s ? { ...r, gate: s } : r);
  };
  return b`
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
        ${e.inputs.length === 0 ? b`<p class="muted">${u("rules.noInputs")}</p>` : e.inputs.map((s, o) => sa(
    t,
    s,
    Ci({ input: o }),
    (r) => t.onChange({ ...e, inputs: r ? e.inputs.map((l, a) => a === o ? r : l) : e.inputs.filter((l, a) => a !== o) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${n((s) => t.onChange({ ...e, inputs: [...e.inputs, { source: s }] }))}>
          ${ta(t, u("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${u("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${u("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${po} step="1" .value=${Ii(e.onDelay)}
              @input=${(s) => t.onChange({ ...e, onDelay: ea(s.target.value) })} /></label>
          <label class="grow">${u("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${po} step="1" .value=${Ii(e.offDelay)}
              @input=${(s) => t.onChange({ ...e, offDelay: ea(s.target.value) })} /></label>
        </div>
      </div>

      <div class="rgroup">
        <div class="rlabel">${u("rules.gate")}</div>
        <p class="muted">${u("rules.gate.hint")}</p>
        ${e.gate ? sa(t, e.gate, Ci("gate-input"), i) : b`<select class="radd" data-action="set-gate" .value=${""} @change=${n((s) => i({ source: s }))}>
            ${ta(t, u("rules.gate.set"))}
          </select>`}
      </div>

      ${na(t, "true")}
      ${na(t, "false")}
    </div>`;
}
function Hv(t) {
  const e = t.draft.rule, n = e.zoneId === null || t.zones.some((s) => s.id === e.zoneId), i = (s) => t.onFocus(Ci(s));
  return b`
    <div class="backdrop rule-backdrop" @change=${(s) => s.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}>
        <h3>${u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}</h3>
        <div class="rcols">
          ${zv(t)}
          ${Iv({
    rule: e,
    inputName: (s) => tu(t, s),
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
        ${t.problems.length > 0 ? b`<ul class="rproblems" role="alert">
          ${t.problems.map((s) => b`<li data-problem=${s}>${u(`rules.problem.${s}`)}</li>`)}</ul>` : v}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${u("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(s) => t.onChange({ ...e, zoneId: s.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? v : b`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((s) => b`<option value=${s.id}>${s.name}</option>`)}
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
const zt = bt, hr = 20, St = zt - 2 * H, an = (St - hr) / 2, vo = (zt - an * 2 - hr) / 2, oa = vo + an + hr, Ns = (zt - St) / 2, Ts = zt / 2, zs = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), ra = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", Vv = (t) => `${t > 0 ? "+" : ""}${t} %`, Yt = (t, e) => nt({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function la(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${zs(n.t)} °C` : "", n.rh !== null ? `${zs(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${zs(n.ah)} g/m³` : "—"];
}
function Rv(t) {
  var X, ie, z;
  const e = t.rule, n = e.vent, i = t.trace, s = i == null ? void 0 : i.inputs[0], o = s == null ? void 0 : s.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((X = e.onTrue[0]) == null ? void 0 : X.device) ?? "", d = la(r, u("vent.sensor"), o == null ? void 0 : o.a), p = la(l, u("vent.than"), o == null ? void 0 : o.b), c = ee(Math.max(d.length, p.length)), f = u("vent.flow.vs").replace("{a}", r).replace("{b}", l), h = o ? `: ${o.pct === null ? oe(null) : Vv(o.pct)}` : s ? `: ${s.detail}` : "", m = o ? `${Yd(f, Qd(St) - h.length)}${h}` : `${f}${h}`, $ = u("vent.flow.margins").replace("{above}", ra(n.above)).replace("{below}", ra(n.below)), w = i == null ? void 0 : i.pending, g = w ? Math.max(0, Math.ceil((w.at - t.now) / 1e3)) : 0, y = u("vent.flow.runon").replace("{t}", Tn(e.offDelay)), x = [
    i ? `${u("rules.flow.result")}: ${oe(i.verdict)}` : u("rules.flow.result"),
    w ? `${y} (${u("vent.pending").replace("{to}", w.to ? "on" : "off").replace("{t}", Ee(g))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((ie = e.onTrue[0]) == null ? void 0 : ie.do) ?? "?"} / ${((z = e.onFalse[0]) == null ? void 0 : z.do) ?? "?"}`,
    ...M ? [Ud(M)] : []
  ], _ = M == null ? void 0 : M.error, E = ee(k.length + (_ ? 1 : 0)), C = H + c + F, I = C + ee(2) + F, V = I + ee(2) + F, N = V + E + H, R = (Q) => S`<path class="fc-link" d=${`M${Q + an / 2} ${H + c} V${C - F / 2} H${Ts} V${C}`}></path>`, Z = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${u("rules.status.error")}: ${i.reason}` : u(`rules.status.${i.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${zt}px`} viewBox=${`0 0 ${zt} ${N}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("vent.flow.title")}>
        ${R(vo)}${R(oa)}
        <path class="fc-link" d=${`M${Ts} ${C + ee(2)} V${I} M${Ts} ${I + ee(2)} V${V}`}></path>
        ${Yt(t, { x: vo, y: H, w: an, h: c, field: "vent-sensor", cls: o != null && o.a.why ? " nodata" : "", lines: d })}
        ${Yt(t, { x: oa, y: H, w: an, h: c, field: "vent-than", cls: o != null && o.b.why ? " nodata" : "", lines: p })}
        ${Yt(t, { x: Ns, y: C, w: St, h: ee(2), field: "vent-above", cls: s ? U(s.value) : "", lines: [m, $], tip: `${f}${h}
${$}` })}
        ${Yt(t, { x: Ns, y: I, w: St, h: ee(2), field: "vent-runon", cls: i ? U(i.verdict) : "", lines: x })}
        ${Yt(t, { x: Ns, y: V, w: St, h: E, field: "vent-fan", cls: "", lines: k, err: _ })}
      </svg>
      ${Z ? b`<p class="fc-warn" data-note="status">${Z}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function wt(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return b`
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
        ${t.texts.length > 0 ? b`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => b`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : v}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${u("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? v : b`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => b`<option value=${i.id}>${i.name}</option>`)}
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
const Hs = (t) => t.trim() === "" ? NaN : Number(t), Vs = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Rs(t, e, n, i, s) {
  var r;
  const o = n === "" || i.some((l) => l.id === n);
  return b`
    <select data-field=${e} data-value=${n} @change=${(l) => s(l.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? v : b`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? u("rules.missingDevice")}</option>`}
      ${i.map((l) => b`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function Bv(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: u("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: u("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: u("vent.problem.fan") });
  const s = [...i], o = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((d) => !!d);
  for (const d of t.problems)
    d === "device-missing" && !o.some((p) => !t.deviceById(p)) && !(n.sensor && !t.climateSensors.some((p) => p.id === n.sensor)) && !(n.than && !t.climateSensors.some((p) => p.id === n.than)) || d === "vent" && i.length > 0 || s.push({ key: d, text: u(d === "delay" ? "vent.problem.runon" : `rules.problem.${d}`) });
  return s;
}
function Fv(t) {
  var o;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), s = ((o = e.onTrue[0]) == null ? void 0 : o.device) ?? "";
  return wt({
    prefix: "vent",
    title: u("vent.title"),
    hint: u("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Bv(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("vent.sensor")}</label>
      ${Rs(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${u("vent.than")}</label>
      ${Rs(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${u("vent.fan")}</label>
      ${Rs(t, "vent-fan", s, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${u("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${G(Vs(n.above))}
            @input=${(r) => i({ above: Hs(r.target.value) })} /></label>
        <label>${u("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${G(Vs(n.below))}
            @input=${(r) => i({ below: Hs(r.target.value) })} /></label>
        <label>${u("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${G(Vs(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(Hs(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: Rv({
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
const Uv = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, Ei = bt, Wv = Ei - 2 * H, jv = H, qv = Ei / 2, aa = (t) => t === null ? oe(null) : `${Math.round(t)} W`, Kn = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function Zv(t, e) {
  const n = t.until !== void 0 ? Ee(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? u("boiler.phase.heatingCheck").replace("{t}", n) : u("boiler.phase.heating");
    case "waiting":
      return u("boiler.phase.waiting").replace("{t}", n ?? Ee(0));
    case "blackout":
    case "limit":
    case "done":
      return u(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function Gv(t) {
  return t.phase === "heating" ? U(!0) : t.phase !== null ? U(!1) : U(t.relay === null ? null : t.relay === "on");
}
function Kv(t) {
  const n = t.rule.boiler, i = n.grid, s = t.trace, o = s == null ? void 0 : s.boiler, r = t.deviceName(n.device), l = [];
  let a = H;
  const d = (w, g, y, x) => {
    const M = ee(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: w, cls: g, lines: y, err: x }), a += M + F;
  };
  if (i) {
    d("boiler-grid", o && o.grid === null ? U(null) : "", [t.gridName(i.block), o ? aa(o.grid) : u("boiler.flow.gridPower")]);
    const w = u("boiler.flow.formula").replace("{nominal}", Kn(i.nominal)), g = o && o.headroom !== null ? o.headroom > i.limit : null;
    d("boiler-limit", o ? U(g === null ? null : !g) : "", [
      o ? `${u("boiler.flow.headroom")}: ${g === null ? oe(null) : u(g ? "boiler.flow.over" : "boiler.flow.ok")}` : u("boiler.flow.headroom"),
      o && o.headroom !== null ? `${w} = ${Math.round(o.headroom)} / ${Kn(i.limit)} W` : `${w} ≤ ${Kn(i.limit)} W`
    ]);
  }
  d("boiler-button", o ? U(o.mode === "auto") : "", [
    o ? `${u("boiler.flow.mode")}: ${u(`boiler.mode.${o.mode}`)}` : u("boiler.flow.mode"),
    u("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const p = o ? Zv(o, t.now) : null, c = s == null ? void 0 : s.last;
  d("boiler-relay", o ? Gv(o) : "", [
    o ? `${u("boiler.flow.relay")}: ${o.relay ?? oe(null)}` : u("boiler.flow.relay"),
    r,
    ...p ? [p] : [],
    ...c ? [Ud(c)] : []
  ], c == null ? void 0 : c.error);
  const f = u("boiler.flow.done");
  d(i ? "boiler-nominal" : "boiler-power", o ? U(o.boilerW === null ? null : o.boilerW > 1) : "", [
    o ? `${u("boiler.flow.power")}: ${aa(o.boilerW)}` : u("boiler.flow.power"),
    i ? `${u("boiler.flow.nominal").replace("{w}", Kn(i.nominal))}, ${f}` : f
  ]);
  const h = a - F + H, m = l.slice(1).map((w) => `M${qv} ${w.y - F} V${w.y}`).join(" "), $ = s && s.status !== "ok" ? s.status === "error" && s.reason ? `${u("rules.status.error")}: ${s.reason}` : u(`rules.status.${s.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ei}px`} viewBox=${`0 0 ${Ei} ${h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((w) => nt({ x: jv, w: Wv, ...w, focused: t.focused === w.field, onClick: () => t.onFocus(w.field) }))}
      </svg>
      ${$ ? b`<p class="fc-warn" data-note="status">${$}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const ca = (t) => t.trim() === "" ? NaN : Number(t), da = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function Bs(t, e, n, i, s) {
  const o = e === "" || n.some((r) => r.id === e);
  return b`
    <select data-field=${t} data-value=${e} @change=${(r) => s(r.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? v : b`<option value=${e}>${i}</option>`}
      ${n.map((r) => b`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function Xv(t) {
  var o;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: u("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: u("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: u("boiler.problem.grid") });
  const i = [...n], s = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((o = e.grid) == null ? void 0 : o.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !s || r === "boiler" && n.length > 0 || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Yv(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, s = (d) => t.onChange({ ...e, boiler: d }), o = (d) => i && s({ ...n, grid: { ...i, ...d } }), r = (d) => {
    const { grid: p, ...c } = n;
    s(d ? { ...c, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Rd, nominal: Bd } } : c);
  }, l = (d) => {
    var p;
    return ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = (d) => {
    var p;
    return d === "" ? u("vent.pick") : ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  };
  return wt({
    prefix: "boiler",
    title: u("boiler.title"),
    hint: u("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Xv(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("boiler.device")}</label>
      ${Bs("boiler-device", n.device, t.boilers, l(n.device), (d) => s({ ...n, device: d }))}

      <label class="rlabel">${u("boiler.button")}</label>
      ${Bs("boiler-button", n.button, t.buttons, l(n.button), (d) => s({ ...n, button: d }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(d) => r(d.target.checked)} /> ${u("boiler.limitOn")}</label>
      ${i ? b`
        <label class="rlabel">${u("boiler.grid")}</label>
        ${Bs("boiler-grid", i.block, t.grids, u("boiler.missingGrid"), (d) => o({ block: d }))}
        <div class="vnums">
          <label>${u("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${G(da(i.limit))}
              @input=${(d) => o({ limit: ca(d.target.value) })} /></label>
          <label>${u("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${G(da(i.nominal))}
              @input=${(d) => o({ nominal: ca(d.target.value) })} /></label>
        </div>` : v}`,
    diagram: Kv({
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
const Di = bt, Ge = 2, su = 20, cn = 24, ua = 220, dn = (Di - 2 * H - (Ge - 1) * su) / Ge, un = Di / 2;
function Qv(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const Jv = (t, e) => t === 1 ? un - dn / 2 : H + e % Ge * (dn + su);
function pa(t, e, n, i) {
  const s = ee(Math.max(...e.map((p) => p.lines.length + (p.err ? 1 : 0)))), o = Math.ceil(e.length / Ge), r = (p) => t + p * (s + cn), l = e.map((p, c) => ({ ...p, x: Jv(e.length, c), y: r(Math.floor(c / Ge)), w: dn, h: s })), a = (p) => n ? r(p) + s + (p === o - 1 ? F : cn) / 2 : r(p) - (p === 0 ? F : cn) / 2, d = [];
  for (let p = 0; p < o; p++) {
    const c = l.slice(p * Ge, (p + 1) * Ge);
    for (const h of c) d.push(`M${h.x + dn / 2} ${n ? h.y + s : h.y} V${a(p)}`);
    const f = [un, ...c.map((h) => h.x + dn / 2)];
    Math.max(...f) > Math.min(...f) && d.push(`M${Math.min(...f)} ${a(p)} H${Math.max(...f)}`);
  }
  return d.push(n ? `M${un} ${a(0)} V${i}` : `M${un} ${i} V${a(o - 1)}`), { blocks: l, bottom: r(o - 1) + s, links: d.join(" ") };
}
function e$(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, s = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [u("leak.flow.addSensor")] }] : e.sensors.map((y, x) => {
    const M = n == null ? void 0 : n.inputs[x];
    return { field: `leak-sensor:${y}`, cls: M ? U(M.value) : "", lines: [t.deviceName(y), M ? M.detail : u("device.leak_sensor")] };
  }), o = (y) => {
    var x, M;
    return ((M = (x = n == null ? void 0 : n.leak) == null ? void 0 : x.valves.find((k) => k.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => o(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [u("leak.flow.addValve")] }] : e.valves.map((y) => {
    var C;
    const x = (C = n == null ? void 0 : n.leak) == null ? void 0 : C.valves.find((I) => I.id === y), M = t.deviceName(y), k = (x == null ? void 0 : x.state) ?? null, _ = y === r ? i : void 0, E = _ ? (_.reason === "re-closed: leak" ? u("leak.flow.reclosed") : u("vent.flow.last").replace("{did}", u(`rules.did.${_.action}`))).replace("{at}", He(_.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? k === "closed" ? U(!0) : k === "open" ? "" : U(null) : "",
      lines: [M, n ? k === null ? oe(null) : u(`leak.state.${k}`) : u("leak.flow.close"), ...E ? [E] : []],
      err: _ == null ? void 0 : _.error
    };
  }), a = ee(2), d = ee(Math.max(...s.map((y) => y.lines.length))), p = H + Math.ceil(s.length / Ge) * (d + cn) - cn + F, c = pa(H, s, !0, p), f = pa(p + a + F, l, !1, p + a), h = {
    x: un - ua / 2,
    y: p,
    w: ua,
    h: a,
    field: "leak",
    cls: n ? U(n.verdict) : "",
    lines: [n ? `${u("leak.flow.leak")}: ${n.verdict === null ? oe(null) : u(n.verdict ? "leak.yes" : "leak.no")}` : u("leak.flow.leak"), u("leak.flow.any")]
  }, m = f.bottom + H, $ = `${c.links} ${f.links}`, w = (y) => nt({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), g = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Di}px`} viewBox=${`0 0 ${Di} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("leak.flow.title")}>
        ${S`<path class="fc-link" d=${$}></path>`}
        ${c.blocks.map(w)}${w(h)}${f.blocks.map(w)}
      </svg>
      ${g ? b`<p class="fc-warn" data-note="status">${g}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function Li(t, e, n, i, s, o, r) {
  const l = (d) => {
    var p;
    return ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = t.draft.focused;
  return b`
    <div class="rsources" data-group=${e}>
      ${i.map((d) => b`
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
        ${s.filter((d) => !i.includes(d.id)).map((d) => b`<option value=${d.id}>${d.name}</option>`)}
      </select>
    </div>`;
}
function t$(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: u("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: u("leak.problem.valves") });
  const i = [...n];
  for (const s of t.problems)
    s === "leak" && n.length > 0 || i.push({ key: s, text: u(`rules.problem.${s}`) });
  return i;
}
function n$(t) {
  const e = t.draft.rule, n = e.leak;
  return wt({
    prefix: "leak",
    title: u("leak.title"),
    hint: u("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("leak.sensors")}</label>
      ${Li(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, u("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${u("leak.valves")}</label>
      ${Li(t, "leak-valves", "leak-valve", n.valves, t.valves, u("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: e$({
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
const Pi = bt, i$ = Pi - 2 * H, s$ = Pi / 2;
function o$(t) {
  const e = He(t.at);
  return as(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === Hd ? u("timed.flow.elsewhere") : u("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function r$(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, s = [];
  let o = H;
  const r = (h, m, $, w) => {
    const g = ee($.length + (w ? 1 : 0));
    s.push({ y: o, h: g, field: h, cls: m, lines: $, err: w }), o += g + F;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? u("timed.flow.events")]);
  const l = u(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Tn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? u("timed.flow.running").replace("{t}", Ee(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : u("timed.flow.runningNow") : u("timed.flow.idle") : u("timed.flow.run");
  r("timed-minutes", i ? U(i.running) : n ? U(n.verdict) : "", [a, l]);
  const d = n == null ? void 0 : n.last;
  r("timed-device", i ? U(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? u("timed.flow.state").replace("{s}", i.device ?? oe(null)) : u(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...d ? [o$(d)] : []
  ], d == null ? void 0 : d.error);
  const p = o - F + H, c = s.slice(1).map((h) => `M${s$} ${h.y - F} V${h.y}`).join(" "), f = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Pi}px`} viewBox=${`0 0 ${Pi} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("timed.flow.title")}>
        <path class="fc-link" d=${c}></path>
        ${s.map((h) => nt({ x: H, w: i$, ...h, focused: t.focused === h.field, onClick: () => t.onFocus(h.field) }))}
      </svg>
      ${f ? b`<p class="fc-warn" data-note="status">${f}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const fa = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function l$(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? u("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${u("timed.events.start").replace("{e}", fa(e.on))}, ${e.separateOff ? u("timed.events.stop").replace("{e}", fa(e.off)) : u("timed.events.noStop")}`;
}
const a$ = (t) => t.trim() === "" ? NaN : Number(t);
function ha(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return b`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? v : b`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((o) => b`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function c$(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: u("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: u("timed.problem.device") });
  const i = [...n], s = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), o = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !s || r === "timed" && n.length > 0 && o || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function d$(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), s = l$(t.deviceById(n.button)), o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return wt({
    prefix: "timed",
    title: u("timed.title"),
    hint: u("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: c$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("timed.button")}</label>
      ${ha("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${s ? b`<p class="muted" data-note="events">${s}</p>` : v}

      <label class="rlabel">${u("timed.device")}</label>
      ${ha("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${u("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${G(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: a$(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${u("timed.invert")}</label>`,
    diagram: r$({
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
const u$ = { "outside-wants": "outside-sensor" }, Oi = bt, Jt = Oi - 2 * H, Fs = Oi / 2, li = 16, p$ = { 1: [Jt], 2: [(Jt - li) / 2, (Jt - li) / 2], 3: [176, 116, Jt - 176 - 116 - 2 * li] }, $o = (t, e) => t !== void 0 ? Ee(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function f$(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), s = i ? i[1] : t.detail, o = t.daylight === null && s === u("daylight.noData") ? [] : [s];
  return i && o.push(`${i[2]} in ${$o(t.until, n) ?? Ee(0)}`), t.daylight === null && e && o.push(u("outside.flow.countsNight")), o;
}
function ou(t) {
  const e = He(t.at);
  return as(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : Vd(t) ? u("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? u("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function h$(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, s = e.window, o = [{
    field: "outside-sensor",
    cls: i ? U(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${u("outside.flow.daylight")}: ${u(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...f$(i, e.noDataNight === !0, t.now)] : [u("outside.flow.daylight"), t.deviceName(e.sensor), u(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && o.push({
    field: "outside-sunset",
    cls: i ? U(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${u("outside.flow.sun")}: ${i.sun === null ? oe(null) : u(`outside.sun.${i.sun}`)}` : u("outside.flow.sun"), u("outside.flow.afterSunset")]
  }), s) {
    const C = `${s.from}-${s.to}`, I = i && i.window !== null ? $o(i.windowUntil, t.now) : null;
    o.push({
      field: "outside-window",
      cls: i ? U(i.window) : "",
      lines: i ? [
        i.window === null ? `${u("outside.flow.window")}: ${oe(null)}` : u(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        C,
        ...I ? [u(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", I)] : []
      ] : [u("outside.flow.window"), C]
    });
  }
  const r = [], l = p$[o.length], a = ee(Math.max(...o.map((C) => C.lines.length)));
  let d = H;
  for (const [C, I] of o.entries())
    r.push({ ...I, x: d, y: H, w: l[C], h: a }), d += l[C] + li;
  let p = H + a + F;
  const c = (C) => {
    const I = ee(C.lines.length + (C.err ? 1 : 0));
    r.push({ ...C, x: H, y: p, w: Jt, h: I }), p += I + F;
  }, f = u("outside.flow.rule").replace("{sun}", e.afterSunset ? u("outside.flow.ruleSun") : "").replace("{window}", s ? u("outside.flow.ruleWindow") : "");
  c({
    field: "outside-wants",
    cls: n ? U(n.verdict) : "",
    lines: [n ? `${u("outside.flow.wants")}: ${n.verdict === null ? oe(null) : n.verdict ? "on" : "off"}` : u("outside.flow.wants"), f]
  });
  const h = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? $o(i.pausedUntil, t.now) : null;
  c(e.pause === 0 ? { field: "outside-pause", cls: i ? U(!0) : "", lines: [u("outside.flow.never"), u("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? U(h === null) : "",
    lines: [
      i ? h !== null ? u("outside.flow.paused").replace("{t}", h) : u("outside.flow.noPause") : u("outside.flow.pause"),
      u("outside.flow.after").replace("{d}", Tn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, $ = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? oe(null)) : u("outside.flow.onOff"),
    ...m ? [ou(m)] : []
  ];
  c({
    field: "outside-light",
    cls: i ? U(i.light === null ? null : i.light === "on") : "",
    lines: $,
    err: m == null ? void 0 : m.error,
    tip: m ? [...$, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const w = p - F + H, g = r.find((C) => C.field === "outside-wants"), y = H + a + F / 2, x = r.slice(0, o.length), M = [Fs, ...x.map((C) => C.x + C.w / 2)], k = [
    ...x.map((C) => `M${C.x + C.w / 2} ${H + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${Fs} ${y} V${g.y}`,
    ...r.slice(o.length + 1).map((C) => `M${Fs} ${C.y - F} V${C.y}`)
  ].join(" "), _ = (C) => nt({ ...C, focused: t.focused === C.field, onClick: () => t.onFocus(C.field) }), E = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Oi}px`} viewBox=${`0 0 ${Oi} ${w}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("outside.flow.title")}>
        ${S`<path class="fc-link" d=${k}></path>`}
        ${r.map(_)}
      </svg>
      ${E ? b`<p class="fc-warn" data-note="status">${E}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
const m$ = { from: "17:00", to: "01:00" }, ru = (t) => t.trim() === "" ? NaN : Number(t);
function Ni(t, e, n, i) {
  const s = e === "" || n.some((o) => o.id === e);
  return b`
    <select data-field=${t} data-value=${e} @change=${(o) => i(o.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? v : b`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((o) => b`<option value=${o.id}>${o.name}</option>`)}
    </select>`;
}
function ma(t, e, n, i, s) {
  return b`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(o) => {
    const { [e]: r, ...l } = n;
    s(o.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function g$(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: u("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: u("outside.problem.sensor") });
  const i = [...n], s = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), o = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !s || l === "outside" && n.length > 0 && o && r || i.push({ key: l, text: u(`rules.problem.${l}`) });
  return i;
}
function b$(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), s = n.window, o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return wt({
    prefix: "outside",
    title: u("outside.title"),
    hint: u("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: g$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("outside.light")}</label>
      ${Ni("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${u("outside.sensor")}</label>
      ${Ni("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${ma("outside-nodata", "noDataNight", n, u("outside.noDataNight"), i)}
      ${ma("outside-sunset", "afterSunset", n, u("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${s !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...m$ } } : a);
    }} /> ${u("outside.window")}</label>
      ${s ? b`
        <div class="vnums">
          <label>${u("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${G(s.from)}
              @input=${(r) => i({ ...n, window: { ...s, from: r.target.value } })} /></label>
          <label>${u("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${G(s.to)}
              @input=${(r) => i({ ...n, window: { ...s, to: r.target.value } })} /></label>
        </div>` : v}

      <div class="vnums">
        <label>${u("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${G(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: ru(r.target.value) })} /></label>
        <span class="muted">${u("outside.pauseNote")}</span>
      </div>`,
    diagram: h$({
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
const w$ = { "beurer-wants": "beurer-above" }, Ti = bt, v$ = Ti - 2 * H, $$ = Ti / 2, Xn = (t, e) => Ee(Math.max(0, Math.ceil((t - e) / 1e3)));
function y$(t) {
  var g;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, s = [];
  let o = H;
  const r = (y, x, M, k, _) => {
    const E = ee(M.length + (k ? 1 : 0));
    s.push({ y: o, h: E, field: y, cls: x, lines: M, err: k, tip: _ }), o += E + F;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? u("beurer.flow.kept").replace("{t}", Xn(i.keptUntil, t.now)) : u("beurer.flow.noData") : u("beurer.source");
  r(
    "beurer-source",
    i ? U(i.watts !== null ? i.watts > e.above : l ? ((g = n.inputs[0]) == null ? void 0 : g.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const d = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? U(n.verdict) : "", [
    n ? `${u("beurer.flow.wants")}: ${n.verdict === null ? oe(null) : n.verdict ? "on" : "off"}` : u("beurer.flow.wants"),
    u("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", Ee(t.rule.offDelay)),
    ...d ? [u("rules.flow.pending").replace("{to}", d.to ? "on" : "off").replace("{t}", Xn(d.at, t.now))] : []
  ]);
  const p = (n == null ? void 0 : n.verdict) === !0, c = e.every === 0 ? u("beurer.flow.never") : i && !p ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? u("beurer.flow.now").replace("{t}", Xn(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? u("beurer.flow.next").replace("{t}", Xn(i.cycleAt, t.now)) : i && p && i.heater === "on" && !i.fresh ? u("beurer.flow.due") : i ? "—" : Tn(e.every * 60);
  r("beurer-every", i ? U(i.pausedUntil !== void 0 ? !1 : p ? !0 : null) : "", [u("beurer.flow.repower"), c]);
  const f = n == null ? void 0 : n.last, h = [
    t.deviceName(e.heater),
    i ? u("timed.flow.state").replace("{s}", i.heater ?? oe(null)) : u("outside.flow.onOff"),
    ...f ? [ou(f)] : []
  ];
  r(
    "beurer-heater",
    i ? U(i.heater === null ? null : i.heater === "on") : "",
    h,
    f == null ? void 0 : f.error,
    f ? [...h, ...f.error ? [f.error] : [], f.reason].join(`
`) : void 0
  );
  const m = o - F + H, $ = s.slice(1).map((y) => `M${$$} ${y.y - F} V${y.y}`).join(" "), w = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ti}px`} viewBox=${`0 0 ${Ti} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("beurer.flow.title")}>
        ${S`<path class="fc-link" d=${$}></path>`}
        ${s.map((y) => nt({ x: H, w: v$, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${w ? b`<p class="fc-warn" data-note="status">${w}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function x$(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: u("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: u("beurer.problem.source") });
  const s = [...i], o = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !o || l === "beurer" && i.length > 0 && r || s.push({ key: l, text: u(`rules.problem.${l}`) });
  return s;
}
function k$(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  }, o = (r, l, a, d, p, c, f) => b`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${d} max=${p} step="1"
          .value=${G(Number.isFinite(a) ? String(a) : "")}
          @input=${(h) => c(ru(h.target.value))} /></label>
      ${f ? b`<span class="muted">${f}</span>` : ""}
    </div>`;
  return wt({
    prefix: "beurer",
    title: u("beurer.title"),
    hint: u("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: x$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("beurer.heater")}</label>
      ${Ni("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${u("beurer.source")}</label>
      ${Ni("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${o("above", u("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${o("off", u("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${o("keep", u("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${o("every", u("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), u("beurer.everyNote"))}`,
    diagram: y$({
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
const En = bt, Ne = 3, pn = 10, fn = 24, hn = (En - 2 * H - (Ne - 1) * pn) / Ne, yo = En / 2, xo = En - 2 * H;
function M$(t) {
  return t.startsWith("control-load") || t === "control-last" ? "control-loads" : "control-sources";
}
function _$(t) {
  return (t.sent === !1 ? u("control.flow.already").replace("{s}", t.action) : u("control.flow.last").replace("{did}", u(`rules.did.${t.action}`))).replace("{target}", t.target).replace("{at}", He(t.at)).replace("{reason}", t.reason);
}
const S$ = (t, e) => t <= Ne ? yo - (t * hn + (t - 1) * pn) / 2 + e * (hn + pn) : H + e % Ne * (hn + pn);
function ga(t, e, n, i) {
  const s = ee(Math.max(...e.map((c) => c.lines.length))), o = Math.ceil(e.length / Ne), r = (c) => t + c * (s + fn), l = e.map((c, f) => ({ ...c, x: c.wide ? H : S$(e.length, f), y: r(Math.floor(f / Ne)), w: c.wide ? xo : hn, h: s })), a = (c) => n ? r(c) + s + (c === o - 1 ? F : fn) / 2 : r(c) - (c === 0 ? F : fn) / 2, d = o > 1 ? yo - (hn + pn) / 2 : yo, p = [];
  for (let c = 0; c < o; c++) {
    const f = l.slice(c * Ne, (c + 1) * Ne);
    for (const m of f) p.push(`M${m.x + m.w / 2} ${n ? m.y + s : m.y} V${a(c)}`);
    const h = [d, ...f.map((m) => m.x + m.w / 2)];
    Math.max(...h) > Math.min(...h) && p.push(`M${Math.min(...h)} ${a(c)} H${Math.max(...h)}`);
  }
  return p.push(n ? `M${d} ${a(0)} V${i}` : `M${d} ${i} V${a(o - 1)}`), { blocks: l, bottom: r(o - 1) + s, links: p.join(" ") };
}
function A$(t) {
  const e = t.rule.control, n = t.trace, i = n == null ? void 0 : n.control, s = (M, k, _) => M === "on" ? k : M === "off" ? _ : u("control.flow.noData"), o = (M) => i ? U(M == null ? null : M === "on") : "", r = e.sources.length === 0 ? [{ field: "control-sources", cls: "", lines: [u("control.problem.sources")], wide: !0 }] : e.sources.map((M) => {
    const k = i == null ? void 0 : i.sources.find((I) => I.id === M), _ = k ? k.kind : t.deviceKind(M), E = t.deviceName(M);
    if (_ !== "smart_button" && _ !== "wall_switch" && _ !== "motion_sensor") return { field: `control-source:${M}`, cls: "", lines: [E] };
    if (_ === "smart_button") return { field: `control-source:${M}`, cls: "", lines: [E, u(t.separateOff(M) ? "control.flow.onOff" : "control.flow.toggle")] };
    const C = _ === "motion_sensor" ? s(k == null ? void 0 : k.state, u("control.flow.motion"), u("control.flow.clear")) : s(k == null ? void 0 : k.state, "on", "off");
    return { field: `control-source:${M}`, cls: o(k == null ? void 0 : k.state), lines: [E, ...i ? [C] : [], u("control.flow.repeat")] };
  }), l = e.loads.length === 0 ? [{ field: "control-loads", cls: "", lines: [u("control.problem.loads")], wide: !0 }] : e.loads.map((M) => {
    const k = i == null ? void 0 : i.loads.find((_) => _.id === M);
    return { field: `control-load:${M}`, cls: o(k == null ? void 0 : k.state), lines: [t.deviceName(M), ...i ? [s(k == null ? void 0 : k.state, "on", "off")] : []] };
  }), a = ee(Math.max(...r.map((M) => M.lines.length))), d = ee(2), p = H + Math.ceil(r.length / Ne) * (a + fn) - fn + F, c = ga(H, r, !0, p), f = ga(p + d + F, l, !1, p + d), h = { x: H, y: p, w: xo, h: d, field: "control", cls: "", lines: [u("control.flow.sets"), u("control.flow.rule")] }, m = n == null ? void 0 : n.last, $ = m ? { x: H, y: f.bottom + F / 2, w: xo, h: ee(1 + (m.error ? 1 : 0)), field: "control-last", cls: "", lines: [_$(m)], err: m.error } : void 0, w = ($ ? $.y + $.h : f.bottom) + H, g = `${c.links} ${f.links}`, y = (M) => nt({ ...M, focused: t.focused === M.field, onClick: () => t.onFocus(M.field) }), x = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return b`
    <div class="flow">
      <svg class="vt" style=${`max-width:${En}px`} viewBox=${`0 0 ${En} ${w}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("control.flow.title")}>
        ${S`<path class="fc-link" d=${g}></path>`}
        ${c.blocks.map(y)}${y(h)}${f.blocks.map(y)}${$ ? y($) : v}
      </svg>
      ${x ? b`<p class="fc-warn" data-note="status">${x}</p>` : v}
      ${t.note ? b`<p class="fc-note">${t.note}</p>` : v}
    </div>`;
}
function C$(t) {
  const e = t.draft.rule.control, n = [];
  e.sources.length === 0 && n.push({ key: "pick-sources", text: u("control.problem.sources") }), e.loads.length === 0 && n.push({ key: "pick-loads", text: u("control.problem.loads") });
  const i = [...n];
  for (const s of t.problems)
    s === "control" && n.length > 0 || i.push({ key: s, text: u(`rules.problem.${s}`) });
  return i;
}
function I$(t) {
  const e = t.draft.rule, n = e.control;
  return wt({
    prefix: "control",
    title: u("control.title"),
    hint: u("control.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: C$(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: b`
      <label class="rlabel">${u("control.sources")}</label>
      ${Li(t, "control-sources", "control-source", n.sources, t.sources, u("control.addSource"), (i) => t.onChange({ ...e, control: { ...n, sources: i } }))}
      <label class="rlabel">${u("control.loads")}</label>
      ${Li(t, "control-loads", "control-load", n.loads, t.loads.filter((i) => !n.sources.includes(i.id)), u("control.addLoad"), (i) => t.onChange({ ...e, control: { ...n, loads: i } }))}`,
    diagram: A$({
      rule: e,
      deviceName: (i) => {
        var s;
        return ((s = t.deviceById(i)) == null ? void 0 : s.name) ?? u("rules.missingDevice");
      },
      deviceKind: (i) => {
        var s;
        return (s = t.deviceById(i)) == null ? void 0 : s.props.kind;
      },
      separateOff: (i) => {
        var o;
        const s = (o = t.deviceById(i)) == null ? void 0 : o.props;
        return (s == null ? void 0 : s.kind) === "smart_button" && s.separateOff === !0;
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const E$ = ["power", "voltage", "power_in", "power_out", "control"], D$ = 300;
function ba(t) {
  t().catch(() => {
  });
}
function L$(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Vt(r), controllable: sc(r) };
    for (const a of E$) {
      const d = (s = r.bindings) == null ? void 0 : s[a];
      d && (l[a] = d);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class P$ {
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
      }, D$);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && ba(n.unsub));
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
          ba(o);
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
    this.retries >= Zd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, qd));
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
const Us = 1e4, wa = 400, O$ = 1e3, va = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), N$ = ["timer", "power"], T$ = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function lu(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of De(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function z$(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function H$(t, e, n) {
  var i;
  if (t.settled) {
    const s = z$(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (va.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !va.has(e.state) ? e.state : void 0 };
}
function $a(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return Xd(s, n, i)[0];
}
function V$(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of lu(n)) e.add(i.entity);
  return [...e].sort();
}
class R$ {
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
    return i && n - i.at < Us ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < wa).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= Us && o < Us + O$ && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = lu(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = T$(n, l.entity);
      if (!a) continue;
      const d = o + l.entity, { value: p, text: c } = H$(l, a, this.seen.get(d));
      p !== void 0 && this.seen.set(d, { last: p }), c && this.events.set(e.id, { text: c, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = oi(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < wa);
      for (const l of N$) {
        const a = $a(o, l, e, i);
        a && !$a(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const Yn = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function ya(t) {
  t().catch(() => {
  });
}
class B$ {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && ya(n.unsub));
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
        n.live ? n.unsub = i : ya(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: Yn(s.lc) ?? Yn(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const d = Yn(l.lc) ?? (a ? Yn(l.lu) : void 0);
        d && (r.last_changed = d);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var F$ = Object.defineProperty, j = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && F$(e, n, s), s;
};
const xa = (t) => t.props.kind === "wall_switch" || t.props.kind === "smart_button" || t.props.kind === "motion_sensor", gr = class gr extends At {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Bu.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = D1(), this.nextObj = $1(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = zc(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new mv(), this.resizeObs = null, this.session = new A1(this), this.haMeta = new C1(this), this.feed = new gv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new Xb(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new P$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new R$(), this.entityFeed = new B$(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Nu(i, (s) => {
      var o;
      return Tc(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new gh(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = I1(this), this.activeTool = oo("select", this.ctx), this.input = new dv(this);
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
    this.entityFeed.watch(e ? V$(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? L$(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, d, p, c, f, h, m, $;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((w) => oi(w, this.hass.states).timerSince !== void 0 || this.events.event(w.id, n) !== null || this.events.leaving(w.id, n).length > 0), s = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, o = !!s && (!!s.pending || s.inputs.some((w) => w.until !== void 0 && w.until > n) || (((l = s.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = s.boiler) == null ? void 0 : a.until) ?? 0) > n || ((d = s.timed) == null ? void 0 : d.running) === !0 && (s.timed.until ?? 0) > n || [(p = s.outside) == null ? void 0 : p.pausedUntil, (c = s.outside) == null ? void 0 : c.until, (f = s.outside) == null ? void 0 : f.windowUntil, (h = s.beurer) == null ? void 0 : h.pausedUntil, (m = s.beurer) == null ? void 0 : m.cycleAt, ($ = s.beurer) == null ? void 0 : $.keptUntil].some((w) => (w ?? 0) > n));
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
    const i = this.history.current.power, s = n ?? (i && Rf(i, e));
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
      const r = this.planLevels(), l = ((s = this.selection) == null ? void 0 : s.kind) === "zone" ? this.selection.id : null, a = r.flatMap((f) => f.zones).find((f) => f.id === l), d = ((o = this.selection) == null ? void 0 : o.kind) === "device" ? r.flatMap((f) => f.devices).find((f) => f.id === this.selection.id) : void 0, p = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? dw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Pw({}, p, d && Ls(d) ? d.id : null, d && Ls(d) ? d.name : "") : e === "outside" ? kw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "control" ? vw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? yw(p, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? Dw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? Mw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? Cw({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, p, (a == null ? void 0 : a.name) ?? null) : Ue(p), isNew: !0, focused: null };
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
    e.isNew ? this.commitRules(Yb(this.rules, e.rule)) : n && !si(n, e.rule) && this.commitRules(Qb(this.rules, e.rule));
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
    if (!this.modal || !e || !this.plan) return v;
    const n = this.planLevels(), i = n.flatMap((c) => c.devices), s = e.rule, o = this.session.savedRules.find((c) => c.id === s.id), r = this.shownRuleTrace(s), l = o ? si(o, s) ? null : u("rules.flow.edited") : u("rules.flow.new"), a = n.length > 1, d = n.flatMap((c) => c.zones.map((f) => ({ id: f.id, name: a ? `${f.name} (${c.name})` : f.name }))), p = rw(
      this.rules,
      s,
      (c) => i.some((f) => f.id === c),
      (c) => {
        const f = i.find((h) => h.id === c);
        return f && J(f);
      },
      (c) => i.some((f) => f.id === c && f.props.kind === "illuminance_sensor"),
      (c) => i.some((f) => f.id === c && f.props.kind === "climate_sensor"),
      (c) => i.some((f) => f.id === c && fo(f)),
      (c) => i.some((f) => f.id === c && (f.props.kind === "wall_switch" || f.props.kind === "smart_button")),
      (c) => this.boilerGridBlocks().some((f) => f.id === c),
      (c) => {
        const f = i.find((h) => h.id === c);
        return !f || Aw(f);
      },
      (c) => i.some((f) => f.id === c && f.props.kind === "leak_sensor"),
      (c) => i.some((f) => f.id === c && f.props.kind === "valve"),
      (c) => i.some((f) => f.id === c && (f.props.kind === "wall_switch" || f.props.kind === "smart_button")),
      (c) => i.some((f) => f.id === c && J(f).includes("on")),
      (c) => i.some((f) => f.id === c && J(f).includes("on")),
      (c) => i.some((f) => f.id === c && J(f).includes("on")),
      (c) => i.some((f) => {
        var h;
        return f.id === c && !!((h = f.bindings) != null && h.power);
      }),
      (c) => i.some((f) => f.id === c && xa(f)),
      (c) => i.some((f) => f.id === c && J(f).includes("on") && J(f).includes("off"))
    );
    return Sw(s) ? Yv({
      draft: e,
      boilers: i.filter(fo),
      buttons: i.filter((c) => c.props.kind === "wall_switch" || c.props.kind === "smart_button"),
      grids: this.boilerGridBlocks().map((c) => ({ id: c.id, name: c.name || u("power.kind.grid") })),
      deviceById: (c) => i.find((f) => f.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, Uv[c] ?? c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : cw(s) ? n$({
      draft: e,
      sensors: i.filter((c) => c.props.kind === "leak_sensor"),
      valves: i.filter((c) => c.props.kind === "valve"),
      deviceById: (c) => i.find((f) => f.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, Qv(c)),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : fw(s) ? d$({
      draft: e,
      buttons: i.filter((c) => c.props.kind === "wall_switch" || c.props.kind === "smart_button"),
      devices: i.filter((c) => J(c).includes("on")),
      deviceById: (c) => i.find((f) => f.id === c),
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
    }) : xw(s) ? b$({
      draft: e,
      lights: i.filter((c) => J(c).includes("on")),
      sensors: i.filter((c) => c.props.kind === "illuminance_sensor"),
      deviceById: (c) => i.find((f) => f.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, u$[c] ?? c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : ww(s) ? I$({
      draft: e,
      sources: i.filter(xa),
      loads: i.filter((c) => J(c).includes("on") && J(c).includes("off")),
      deviceById: (c) => i.find((f) => f.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, M$(c)),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : $w(s) ? k$({
      draft: e,
      heaters: i.filter((c) => J(c).includes("on")),
      sources: i.filter((c) => {
        var f;
        return !!((f = c.bindings) != null && f.power);
      }),
      deviceById: (c) => i.find((f) => f.id === c),
      zones: d,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (c) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: c };
      },
      onFocus: (c) => this.focusRuleField(c, w$[c] ?? c),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : Iw(s) ? Fv({
      draft: e,
      climateSensors: i.filter((c) => c.props.kind === "climate_sensor"),
      fans: i.filter((c) => {
        const f = J(c);
        return f.includes("on") && f.includes("off");
      }),
      deviceById: (c) => i.find((f) => f.id === c),
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
    }) : Hv({
      draft: e,
      inputDevices: i.filter(Ls),
      lightSensors: i.filter((c) => c.props.kind === "illuminance_sensor"),
      lightUnit: (c) => {
        var m, $, w, g, y;
        const f = ($ = (m = i.find((x) => x.id === c)) == null ? void 0 : m.bindings) == null ? void 0 : $.illuminance, h = f ? (g = (w = this.hass) == null ? void 0 : w.states) == null ? void 0 : g[f] : void 0;
        return (y = h == null ? void 0 : h.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((c) => J(c).length > 0),
      deviceById: (c) => i.find((f) => f.id === c),
      otherRules: this.rules.filter((c) => c.id !== s.id),
      ruleName: (c) => {
        var f;
        return (f = this.rules.find((h) => h.id === c)) == null ? void 0 : f.name;
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
      onUnit: (c, f) => {
        const h = this.ruleDraft ?? e;
        this.ruleDraft = { ...h, units: { ...h.units, [c]: f } };
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
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(Jb(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !As(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !As(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Bc(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? Ko(n, e.id) : e.kind === "opening" ? ec(n, e.id) : Ac(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Uc(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Vc(n, e.id);
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
    this.selection = s && n && i && As(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = oo(e, this.ctx));
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
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = ae(n, i);
    s && (this.view = ql(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = yc(n).get(e);
    s && (this.view = ql(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? g1(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return tv(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = nv(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = uh(this.power, this.ctx.geo());
    e && (this.powerView = iv(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return pv({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? iw(this.rules, this.dialog.id).map((o) => o.name) : [],
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
    var h, m, $, w;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${u("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${u("action.retry")}</button>` : u("load.loading")}</div>`;
    const e = xg(!!((m = (h = this.hass) == null ? void 0 : h.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, d = this.save, p = this.mode === "power", c = Date.now(), f = ($ = this.hass) == null ? void 0 : $.states;
    return b`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : p ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${Yw(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${l1({
      steps: u1({
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
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onPickPlan: (g) => this.session.pickPlan(g),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Uw(this, n)}
        ${jw(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? rv(this.view, l, a, e, p ? 0.1 : 1) : v}
            ${this.mode === "power" ? vg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : qm(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => oi(g, f),
      bubbles: (g) => {
        const y = oi(g, f), x = this.events.event(g.id, c);
        return {
          shown: [...Xd(y, g, c), ...x ? [{ text: x.text, tone: "event", key: x.at }] : []],
          leaving: this.events.leaving(g.id, c)
        };
      }
    })}
            ${i.tracker ? Kw(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: Xw(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? uv({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${Gw({
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
        ${this.automationsMenu ? Fw(this.automationsMenu, (g) => this.pickAutomation(g), () => this.closeAutomationsMenu()) : v}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
gr.styles = Qw;
let B = gr;
j([
  Ve({ attribute: !1 })
], B.prototype, "hass");
j([
  Ve({ type: Boolean })
], B.prototype, "narrow");
j([
  Ve({ attribute: !1 })
], B.prototype, "panel");
j([
  W()
], B.prototype, "plan");
j([
  W()
], B.prototype, "automationsMenu");
j([
  W()
], B.prototype, "loadError");
j([
  W()
], B.prototype, "selection");
j([
  W()
], B.prototype, "toolId");
j([
  W()
], B.prototype, "wallType");
j([
  W()
], B.prototype, "thickness");
j([
  W()
], B.prototype, "boxMeasure");
j([
  W()
], B.prototype, "grid");
j([
  W()
], B.prototype, "mode");
j([
  W()
], B.prototype, "bindFilter");
j([
  W()
], B.prototype, "bindQuery");
j([
  W()
], B.prototype, "railCollapsed");
j([
  W()
], B.prototype, "showAll");
j([
  W()
], B.prototype, "zoneQuery");
j([
  W()
], B.prototype, "cones");
j([
  W()
], B.prototype, "nextProps");
j([
  W()
], B.prototype, "nextObj");
j([
  W()
], B.prototype, "planView");
j([
  W()
], B.prototype, "powerView");
j([
  W()
], B.prototype, "placeDeviceId");
j([
  W()
], B.prototype, "size");
j([
  W()
], B.prototype, "dialog");
j([
  W()
], B.prototype, "notice");
j([
  W()
], B.prototype, "fieldNotice");
j([
  W()
], B.prototype, "pendingDraft");
j([
  W()
], B.prototype, "ruleDraft");
j([
  W()
], B.prototype, "plans");
j([
  W()
], B.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", B);
export {
  B as PlanStudioPanel
};
