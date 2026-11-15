/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = globalThis, He = ie.ShadowRoot && (ie.ShadyCSS === void 0 || ie.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = Symbol(), cn = /* @__PURE__ */ new WeakMap();
let ni = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== qe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (He && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = cn.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && cn.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Yi = (n) => new ni(typeof n == "string" ? n : n + "", void 0, qe), Gi = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[o + 1], n[0]);
  return new ni(e, n, qe);
}, Zi = (n, t) => {
  if (He) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = ie.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, dn = He ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Yi(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xi, defineProperty: Qi, getOwnPropertyDescriptor: Ji, getOwnPropertyNames: ts, getOwnPropertySymbols: es, getPrototypeOf: ns } = Object, dt = globalThis, hn = dt.trustedTypes, is = hn ? hn.emptyScript : "", be = dt.reactiveElementPolyfillSupport, Bt = (n, t) => n, le = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? is : null;
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
} }, We = (n, t) => !Xi(n, t), un = { attribute: !0, type: String, converter: le, reflect: !1, useDefault: !1, hasChanged: We };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), dt.litPropertyMetadata ?? (dt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let kt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = un) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Qi(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Ji(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? un;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Bt("elementProperties"))) return;
    const t = ns(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Bt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Bt("properties"))) {
      const e = this.properties, i = [...ts(e), ...es(e)];
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
      for (const s of i) e.unshift(dn(s));
    } else t !== void 0 && e.push(dn(t));
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
    return Zi(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : le).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : le;
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
kt.elementStyles = [], kt.shadowRootOptions = { mode: "open" }, kt[Bt("elementProperties")] = /* @__PURE__ */ new Map(), kt[Bt("finalized")] = /* @__PURE__ */ new Map(), be == null || be({ ReactiveElement: kt }), (dt.reactiveElementVersions ?? (dt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const jt = globalThis, fn = (n) => n, ae = jt.trustedTypes, pn = ae ? ae.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, ii = "$lit$", rt = `lit$${Math.random().toFixed(9).slice(2)}$`, si = "?" + rt, ss = `<${si}>`, xt = document, qt = () => xt.createComment(""), Wt = (n) => n === null || typeof n != "object" && typeof n != "function", Ke = Array.isArray, os = (n) => Ke(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", ke = `[ 	
\f\r]`, Rt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gn = /-->/g, mn = />/g, mt = RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $n = /'/g, yn = /"/g, oi = /^(?:script|style|textarea|title)$/i, ri = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), v = ri(1), E = ri(2), ft = Symbol.for("lit-noChange"), x = Symbol.for("lit-nothing"), wn = /* @__PURE__ */ new WeakMap(), $t = xt.createTreeWalker(xt, 129);
function li(n, t) {
  if (!Ke(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pn !== void 0 ? pn.createHTML(t) : t;
}
const rs = (n, t) => {
  const e = n.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = Rt;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let d, f, c = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, f = r.exec(a), f !== null); ) u = r.lastIndex, r === Rt ? f[1] === "!--" ? r = gn : f[1] !== void 0 ? r = mn : f[2] !== void 0 ? (oi.test(f[2]) && (s = RegExp("</" + f[2], "g")), r = mt) : f[3] !== void 0 && (r = mt) : r === mt ? f[0] === ">" ? (r = s ?? Rt, c = -1) : f[1] === void 0 ? c = -2 : (c = r.lastIndex - f[2].length, d = f[1], r = f[3] === void 0 ? mt : f[3] === '"' ? yn : $n) : r === yn || r === $n ? r = mt : r === gn || r === mn ? r = Rt : (r = mt, s = void 0);
    const h = r === mt && n[l + 1].startsWith("/>") ? " " : "";
    o += r === Rt ? a + ss : c >= 0 ? (i.push(d), a.slice(0, c) + ii + a.slice(c) + rt + h) : a + rt + (c === -2 ? l : h);
  }
  return [li(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Kt {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [d, f] = rs(t, e);
    if (this.el = Kt.createElement(d, i), $t.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = $t.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(ii)) {
          const u = f[r++], h = s.getAttribute(c).split(rt), m = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? as : m[1] === "?" ? cs : m[1] === "@" ? ds : ge }), s.removeAttribute(c);
        } else c.startsWith(rt) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (oi.test(s.tagName)) {
          const c = s.textContent.split(rt), u = c.length - 1;
          if (u > 0) {
            s.textContent = ae ? ae.emptyScript : "";
            for (let h = 0; h < u; h++) s.append(c[h], qt()), $t.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[u], qt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === si) a.push({ type: 2, index: o });
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
function Mt(n, t, e = n, i) {
  var r, l;
  if (t === ft) return t;
  let s = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const o = Wt(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = Mt(n, s._$AS(n, t.values), s, i)), t;
}
class ls {
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
    $t.currentNode = s;
    let o = $t.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new Ve(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new hs(o, this, t)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = $t.nextNode(), r++);
    }
    return $t.currentNode = xt, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
let Ve = class ai {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = Mt(this, t, e), Wt(t) ? t === x || t == null || t === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : t !== this._$AH && t !== ft && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : os(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== x && Wt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(xt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Kt.createElement(li(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const r = new ls(s, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = wn.get(t.strings);
    return e === void 0 && wn.set(t.strings, e = new Kt(t)), e;
  }
  k(t) {
    Ke(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new ai(this.O(qt()), this.O(qt()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = fn(t).nextSibling;
      fn(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
};
class ge {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = x;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = Mt(this, t, e, 0), r = !Wt(t) || t !== this._$AH && t !== ft, r && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = Mt(this, l[i + a], e, a), d === ft && (d = this._$AH[a]), r || (r = !Wt(d) || d !== this._$AH[a]), d === x ? t = x : t !== x && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class as extends ge {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === x ? void 0 : t;
  }
}
class cs extends ge {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== x);
  }
}
let ds = class extends ge {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = Mt(this, t, e, 0) ?? x) === ft) return;
    const i = this._$AH, s = t === x && i !== x || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== x && (i === x || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class hs {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Mt(this, t);
  }
}
const _e = jt.litHtmlPolyfillSupport;
_e == null || _e(Kt, Ve), (jt.litHtmlVersions ?? (jt.litHtmlVersions = [])).push("3.3.3");
const us = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new Ve(t.insertBefore(qt(), o), o, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = globalThis;
let Ft = class extends kt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = us(e, this.renderRoot, this.renderOptions);
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
var ei;
Ft._$litElement$ = !0, Ft.finalized = !0, (ei = wt.litElementHydrateSupport) == null || ei.call(wt, { LitElement: Ft });
const Se = wt.litElementPolyfillSupport;
Se == null || Se({ LitElement: Ft });
(wt.litElementVersions ?? (wt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fs = { attribute: !0, type: String, converter: le, reflect: !1, hasChanged: We }, ps = (n = fs, t, e) => {
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
function me(n) {
  return (t, e) => typeof e == "object" ? ps(n, t, e) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(n, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function R(n) {
  return me({ ...n, state: !0, attribute: !1 });
}
function X() {
  const n = new Uint8Array(6);
  return crypto.getRandomValues(n), Array.from(n, (t) => t.toString(16).padStart(2, "0")).join("");
}
const gs = [100, 125, 150], ms = {
  bearing: 400
}, se = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function vn(n) {
  return {
    id: X(),
    name: n,
    schemaVersion: 1,
    revision: 0,
    levels: [
      { id: X(), name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] }
    ]
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
};
function Vt(n, t) {
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
function $s(n) {
  return n.devices ? n : { ...n, devices: [] };
}
function I(n, t) {
  return { x: n.x + t.x, y: n.y + t.y };
}
function M(n, t) {
  return { x: n.x - t.x, y: n.y - t.y };
}
function _(n, t) {
  return { x: n.x * t, y: n.y * t };
}
function B(n, t) {
  return n.x * t.x + n.y * t.y;
}
function It(n, t) {
  return n.x * t.y - n.y * t.x;
}
function ci(n) {
  return Math.hypot(n.x, n.y);
}
function N(n, t) {
  return ci(M(t, n));
}
function Xt(n) {
  const t = ci(n);
  return t === 0 ? { x: 0, y: 0 } : _(n, 1 / t);
}
function V(n) {
  return { x: n.y, y: -n.x };
}
function Ge(n, t, e) {
  return { x: n.x + (t.x - n.x) * e, y: n.y + (t.y - n.y) * e };
}
function at(n, t, e, i) {
  const s = It(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = It(M(e, n), i) / s;
  return I(n, _(t, o));
}
function $e(n, t, e) {
  const i = M(e, t), s = B(i, i);
  return s === 0 ? 0 : B(M(n, t), i) / s;
}
function Qt(n, t) {
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
const ce = 1e-6, Oe = 90;
function di(n, t) {
  const e = n.walls.find((o) => o.id === t);
  if (!e) return null;
  const i = n.nodes.find((o) => o.id === e.a), s = n.nodes.find((o) => o.id === e.b);
  return !i || !s ? null : N(i, s);
}
function ys(n, t) {
  return Ye[n.kind].includes(t.mode);
}
function hi(n, t, e) {
  if (!ys(t, e)) return !1;
  if (e.mode === "free") return !0;
  const i = e.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Oe || i > Oe)) return !1;
  const s = di(n, e.wallId);
  return s !== null && e.offset >= -ce && e.offset <= s + ce;
}
function Jt(n, t) {
  return { ...n, devices: t };
}
function xn(n, t, e, i) {
  if (!hi(n, t, e)) return { level: n, deviceId: null };
  const s = { id: X(), name: i, placement: e, props: t, invalid: !1 };
  return { level: Jt(n, [...n.devices ?? [], s]), deviceId: s.id };
}
function Ze(n, t, e) {
  const i = n.devices ?? [], s = i.find((r) => r.id === t);
  if (!s || !hi(n, s.props, e)) return n;
  let o = s.props;
  if (o.kind === "motion_sensor" && e.mode !== s.placement.mode) {
    const r = Vt("motion_sensor", s.placement.mode), l = Vt("motion_sensor", e.mode);
    r.kind === "motion_sensor" && l.kind === "motion_sensor" && o.zoneAngle === r.zoneAngle && (o = { ...o, zoneAngle: l.zoneAngle });
  }
  return Qe(Jt(n, i.map((r) => r.id === t ? { ...r, placement: e, props: o } : r)));
}
function ws(n, t, e, i) {
  const s = n.devices ?? [];
  return s.some((o) => o.id === t) ? Jt(n, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...e, kind: o.props.kind };
    return { ...o, props: r, name: i ?? o.name };
  })) : n;
}
function Xe(n, t) {
  return Jt(n, (n.devices ?? []).filter((e) => e.id !== t));
}
function vs(n, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const e = t.props.zoneIds.filter((i) => n.zones.some((s) => s.id === i));
  return e.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: e } };
}
function Qe(n) {
  return Jt(n, (n.devices ?? []).map((t) => {
    const e = vs(n, t);
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const i = di(n, e.placement.wallId), s = i === null || e.placement.offset < -ce || e.placement.offset > i + ce;
    return { ...e, invalid: s };
  }));
}
function xs(n, t) {
  if (t.devices)
    for (const e of t.walls) {
      const i = n.walls.find((f) => f.id === e.id);
      if (!i || i.a !== e.a) continue;
      const s = n.nodes.find((f) => f.id === i.a), o = n.nodes.find((f) => f.id === i.b), r = t.nodes.find((f) => f.id === e.a), l = t.nodes.find((f) => f.id === e.b);
      if (!s || !o || !r || !l || s.x === r.x && s.y === r.y) continue;
      const a = N(r, l);
      if (a === 0) continue;
      const d = Xt(M(o, s));
      for (const f of t.devices)
        f.placement.mode !== "wall" || f.placement.wallId !== e.id || (f.placement.offset = $e(I(s, _(d, f.placement.offset)), r, l) * a);
    }
}
class pt {
  constructor(t, e) {
    this.next = null, this.key = t, this.data = e, this.left = null, this.right = null;
  }
}
function bs(n, t) {
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
function Ee(n, t, e, i) {
  const s = new pt(n, t);
  if (e === null)
    return s.left = s.right = null, s;
  e = lt(n, e, i);
  const o = i(n, e.key);
  return o < 0 ? (s.left = e.left, s.right = e, e.left = null) : o >= 0 && (s.right = e.right, s.left = e, e.right = null), s;
}
function bn(n, t, e) {
  let i = null, s = null;
  if (t) {
    t = lt(n, t, e);
    const o = e(t.key, n);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function ks(n, t, e) {
  return t === null ? n : (n === null || (t = lt(n.key, t, e), t.left = n), t);
}
function Ne(n, t, e, i, s) {
  if (n) {
    i(`${t}${e ? "└── " : "├── "}${s(n)}
`);
    const o = t + (e ? "    " : "│   ");
    n.left && Ne(n.left, o, !1, i, s), n.right && Ne(n.right, o, !0, i, s);
  }
}
class Je {
  constructor(t = bs) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, e) {
    return this._size++, this._root = Ee(t, e, this._root, this._comparator);
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
    return Ss(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, e = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && ze(t, e, 0, s - 1, o), this._root === null)
      this._root = Ce(t, e, 0, s), this._size = s;
    else {
      const r = Es(
        this.toList(),
        _s(t, e),
        o
      );
      s = this._size + s, this._root = De({ head: r }, 0, s);
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
    return Ne(this._root, "", !0, (i) => e.push(i), t), e.join("");
  }
  update(t, e, i) {
    const s = this._comparator;
    let { left: o, right: r } = bn(t, this._root, s);
    s(t, e) < 0 ? r = Ee(e, i, r, s) : o = Ee(e, i, o, s), this._root = ks(o, r, s);
  }
  split(t) {
    return bn(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const e = [];
    let i = !1;
    for (; !i; )
      t !== null ? (e.push(t), t = t.left) : e.length !== 0 ? (t = e.pop(), yield t, t = t.right) : i = !0;
  }
}
function Ce(n, t, e, i) {
  const s = i - e;
  if (s > 0) {
    const o = e + Math.floor(s / 2), r = n[o], l = t[o], a = new pt(r, l);
    return a.left = Ce(n, t, e, o), a.right = Ce(n, t, o + 1, i), a;
  }
  return null;
}
function _s(n, t) {
  const e = new pt(null, null);
  let i = e;
  for (let s = 0; s < n.length; s++)
    i = i.next = new pt(n[s], t[s]);
  return i.next = null, e.next;
}
function Ss(n) {
  let t = n;
  const e = [];
  let i = !1;
  const s = new pt(null, null);
  let o = s;
  for (; !i; )
    t ? (e.push(t), t = t.left) : e.length > 0 ? (t = o = o.next = e.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function De(n, t, e) {
  const i = e - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = De(n, t, s), r = n.head;
    return r.left = o, n.head = n.head.next, r.right = De(n, s + 1, e), r;
  }
  return null;
}
function Es(n, t, e) {
  const i = new pt(null, null);
  let s = i, o = n, r = t;
  for (; o !== null && r !== null; )
    e(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function ze(n, t, e, i, s) {
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
  ze(n, t, e, l, s), ze(n, t, l + 1, i, s);
}
const it = 11102230246251565e-32, F = 134217729, Ms = (3 + 8 * it) * it;
function Me(n, t, e, i, s) {
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
function Is(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function w(n) {
  return new Float64Array(n);
}
const As = (3 + 16 * it) * it, Ps = (2 + 12 * it) * it, Os = (9 + 64 * it) * it * it, bt = w(4), kn = w(8), _n = w(12), Sn = w(16), K = w(4);
function Ns(n, t, e, i, s, o, r) {
  let l, a, d, f, c, u, h, m, g, $, y, b, k, S, A, P, O, D;
  const j = n - s, q = e - s, W = t - o, J = i - o;
  S = j * J, u = F * j, h = u - (u - j), m = j - h, u = F * J, g = u - (u - J), $ = J - g, A = m * $ - (S - h * g - m * g - h * $), P = W * q, u = F * W, h = u - (u - W), m = W - h, u = F * q, g = u - (u - q), $ = q - g, O = m * $ - (P - h * g - m * g - h * $), y = A - O, c = A - y, bt[0] = A - (y + c) + (c - O), b = S + y, c = b - S, k = S - (b - c) + (y - c), y = k - P, c = k - y, bt[1] = k - (y + c) + (c - P), D = b + y, c = D - b, bt[2] = b - (D - c) + (y - c), bt[3] = D;
  let nt = Is(4, bt), zt = Ps * r;
  if (nt >= zt || -nt >= zt || (c = n - j, l = n - (j + c) + (c - s), c = e - q, d = e - (q + c) + (c - s), c = t - W, a = t - (W + c) + (c - o), c = i - J, f = i - (J + c) + (c - o), l === 0 && a === 0 && d === 0 && f === 0) || (zt = Os * r + Ms * Math.abs(nt), nt += j * f + J * l - (W * d + q * a), nt >= zt || -nt >= zt)) return nt;
  S = l * J, u = F * l, h = u - (u - l), m = l - h, u = F * J, g = u - (u - J), $ = J - g, A = m * $ - (S - h * g - m * g - h * $), P = a * q, u = F * a, h = u - (u - a), m = a - h, u = F * q, g = u - (u - q), $ = q - g, O = m * $ - (P - h * g - m * g - h * $), y = A - O, c = A - y, K[0] = A - (y + c) + (c - O), b = S + y, c = b - S, k = S - (b - c) + (y - c), y = k - P, c = k - y, K[1] = k - (y + c) + (c - P), D = b + y, c = D - b, K[2] = b - (D - c) + (y - c), K[3] = D;
  const Wi = Me(4, bt, 4, K, kn);
  S = j * f, u = F * j, h = u - (u - j), m = j - h, u = F * f, g = u - (u - f), $ = f - g, A = m * $ - (S - h * g - m * g - h * $), P = W * d, u = F * W, h = u - (u - W), m = W - h, u = F * d, g = u - (u - d), $ = d - g, O = m * $ - (P - h * g - m * g - h * $), y = A - O, c = A - y, K[0] = A - (y + c) + (c - O), b = S + y, c = b - S, k = S - (b - c) + (y - c), y = k - P, c = k - y, K[1] = k - (y + c) + (c - P), D = b + y, c = D - b, K[2] = b - (D - c) + (y - c), K[3] = D;
  const Ki = Me(Wi, kn, 4, K, _n);
  S = l * f, u = F * l, h = u - (u - l), m = l - h, u = F * f, g = u - (u - f), $ = f - g, A = m * $ - (S - h * g - m * g - h * $), P = a * d, u = F * a, h = u - (u - a), m = a - h, u = F * d, g = u - (u - d), $ = d - g, O = m * $ - (P - h * g - m * g - h * $), y = A - O, c = A - y, K[0] = A - (y + c) + (c - O), b = S + y, c = b - S, k = S - (b - c) + (y - c), y = k - P, c = k - y, K[1] = k - (y + c) + (c - P), D = b + y, c = D - b, K[2] = b - (D - c) + (y - c), K[3] = D;
  const Vi = Me(Ki, _n, 4, K, Sn);
  return Sn[Vi - 1];
}
function Cs(n, t, e, i, s, o) {
  const r = (t - o) * (e - s), l = (n - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= As * d ? a : -Ns(n, t, e, i, s, o, d);
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
const Lt = (n, t) => n.ll.x <= t.x && t.x <= n.ur.x && n.ll.y <= t.y && t.y <= n.ur.y, Re = (n, t) => {
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
const Ds = ct * ct, En = (n, t) => {
  if (-ct < n && n < ct && -ct < t && t < ct)
    return 0;
  const e = n - t;
  return e * e < Ds * n * t ? 0 : n < t ? -1 : 1;
};
class zs {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Mn(), this.yRounder = new Mn();
  }
  round(t, e) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(e)
    };
  }
}
class Mn {
  constructor() {
    this.tree = new Je(), this.round(0);
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
    if (i !== null && En(e.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(e);
    return s !== null && En(e.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const Yt = new zs(), oe = (n, t) => n.x * t.y - n.y * t.x, ui = (n, t) => n.x * t.x + n.y * t.y, In = (n, t, e) => {
  const i = Cs(n.x, n.y, t.x, t.y, e.x, e.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, de = (n) => Math.sqrt(ui(n, n)), Rs = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return oe(s, i) / de(s) / de(i);
}, Ls = (n, t, e) => {
  const i = {
    x: t.x - n.x,
    y: t.y - n.y
  }, s = {
    x: e.x - n.x,
    y: e.y - n.y
  };
  return ui(s, i) / de(s) / de(i);
}, An = (n, t, e) => t.y === 0 ? null : {
  x: n.x + t.x / t.y * (e - n.y),
  y: e
}, Pn = (n, t, e) => t.x === 0 ? null : {
  x: e,
  y: n.y + t.y / t.x * (e - n.x)
}, Ts = (n, t, e, i) => {
  if (t.x === 0) return Pn(e, i, n.x);
  if (i.x === 0) return Pn(n, t, e.x);
  if (t.y === 0) return An(e, i, n.y);
  if (i.y === 0) return An(n, t, e.y);
  const s = oe(t, i);
  if (s == 0) return null;
  const o = {
    x: e.x - n.x,
    y: e.y - n.y
  }, r = oe(o, t) / s, l = oe(o, i) / s, a = n.x + l * t.x, d = e.x + r * i.x, f = n.y + l * t.y, c = e.y + r * i.y, u = (a + d) / 2, h = (f + c) / 2;
  return {
    x: u,
    y: h
  };
};
class Z {
  // for ordering sweep events in the sweep event queue
  static compare(t, e) {
    const i = Z.comparePoints(t.point, e.point);
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
        sine: Rs(this.point, t.point, o.point),
        cosine: Ls(this.point, t.point, o.point)
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
let Us = 0;
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
      const c = d - l, u = o - i, h = f - a, m = r - s;
      if (c > u && h < m) return 1;
      if (c < u && h > m) return -1;
    }
    return o > r ? 1 : o < r || d < f ? -1 : d > f ? 1 : t.id < e.id ? -1 : t.id > e.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, e, i, s) {
    this.id = ++Us, this.leftSE = t, t.segment = this, t.otherSE = e, this.rightSE = e, e.segment = this, e.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, e, i) {
    let s, o, r;
    const l = Z.comparePoints(t, e);
    if (l < 0)
      s = t, o = e, r = 1;
    else if (l > 0)
      s = e, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const a = new Z(s, !0), d = new Z(o, !1);
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
    const e = this.bbox(), i = t.bbox(), s = Re(e, i);
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
    const h = Ts(o, this.vector(), l, t.vector());
    return h === null || !Lt(s, h) ? null : Yt.round(h.x, h.y);
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
    const e = [], i = t.events !== void 0, s = new Z(t, !0), o = new Z(t, !1), r = this.rightSE;
    this.replaceRightSE(o), e.push(o), e.push(s);
    const l = new ht(s, r, this.rings.slice(), this.windings.slice());
    return Z.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), Z.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), e;
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
    switch (tt.type) {
      case "union": {
        const i = t.length === 0, s = e.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < e.length ? (i = t.length, s = e.length) : (i = e.length, s = t.length), this._isInResult = s === tt.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${tt.type}`);
    }
    return this._isInResult;
  }
}
class On {
  constructor(t, e, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = e, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Yt.round(t[0][0], t[0][1]);
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
      let a = Yt.round(t[r][0], t[r][1]);
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
class Bs {
  constructor(t, e) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new On(t[0], this, !0), this.bbox = {
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
      const o = new On(t[i], this, !1);
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
class Nn {
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
      const o = new Bs(t[i], this);
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
            const g = d[0].point, $ = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${g.x}, ${g.y}]. Last matching segment found ends at [${$.x}, ${$.y}].`);
          }
          if (u.length === 1) {
            a = u[0].otherSE;
            break;
          }
          let h = null;
          for (let g = 0, $ = c.length; g < $; g++)
            if (c[g].point === l.point) {
              h = g;
              break;
            }
          if (h !== null) {
            const g = c.splice(h)[0], $ = d.splice(g.index);
            $.unshift($[0].otherSE), e.push(new he($.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = u.sort(m)[0].otherSE;
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
      In(c, t, u) !== 0 && (e.push(c), t = c);
    }
    if (e.length === 1) return null;
    const i = e[0], s = e[1];
    In(i, t, s) === 0 && e.shift(), e.push(e[0]);
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
      Z.compare(t, r) > 0 && (t = r);
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
class Cn {
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
class js {
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
        if (o.isExteriorRing()) e.push(new Cn(o));
        else {
          const r = o.enclosingRing();
          r.poly || e.push(new Cn(r)), r.poly.addInterior(o);
        }
    }
    return e;
  }
}
class Fs {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ht.compare;
    this.queue = t, this.tree = new Je(e), this.segments = [];
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
          for (let h = 0, m = u.length; h < m; h++)
            i.push(u[h]);
        }
      }
      let f = null;
      if (a) {
        const c = a.getIntersection(e);
        if (c !== null && (e.isAnEndpoint(c) || (f = c), !a.isAnEndpoint(c))) {
          const u = this._splitSafely(a, c);
          for (let h = 0, m = u.length; h < m; h++)
            i.push(u[h]);
        }
      }
      if (d !== null || f !== null) {
        let c = null;
        d === null ? c = f : f === null ? c = d : c = Z.comparePoints(d, f) <= 0 ? d : f, this.queue.remove(e.rightSE), i.push(e.rightSE);
        const u = e.split(c);
        for (let h = 0, m = u.length; h < m; h++)
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
const Dn = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Hs = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class qs {
  run(t, e, i) {
    tt.type = t, Yt.reset();
    const s = [new Nn(e, !0)];
    for (let c = 0, u = i.length; c < u; c++)
      s.push(new Nn(i[c], !1));
    if (tt.numMultiPolys = s.length, tt.type === "difference") {
      const c = s[0];
      let u = 1;
      for (; u < s.length; )
        Re(s[u].bbox, c.bbox) !== null ? u++ : s.splice(u, 1);
    }
    if (tt.type === "intersection")
      for (let c = 0, u = s.length; c < u; c++) {
        const h = s[c];
        for (let m = c + 1, g = s.length; m < g; m++)
          if (Re(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Je(Z.compare);
    for (let c = 0, u = s.length; c < u; c++) {
      const h = s[c].getSweepEvents();
      for (let m = 0, g = h.length; m < g; m++)
        if (o.insert(h[m]), o.size > Dn)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Fs(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > Dn)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Hs)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const u = r.process(c);
      for (let h = 0, m = u.length; h < m; h++) {
        const g = u[h];
        g.consumedBy === void 0 && o.insert(g);
      }
      l = o.size, a = o.pop();
    }
    Yt.reset();
    const d = he.factory(r.segments);
    return new js(d).getGeom();
  }
}
const tt = new qs(), Ws = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return tt.run("union", n, e);
}, Ks = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return tt.run("intersection", n, e);
}, Vs = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return tt.run("xor", n, e);
}, Ys = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return tt.run("difference", n, e);
};
var fi = {
  union: Ws,
  intersection: Ks,
  xor: Vs,
  difference: Ys
};
const pi = 3, Gs = 1e-6;
function zn(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return { x: e.x, y: e.y };
}
function et(n, t) {
  const e = zn(n, t.a), i = zn(n, t.b), s = t.thickness, [o, r] = t.baseline === "left" ? [0, s] : t.baseline === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: i, dir: Xt(M(i, e)), len: N(e, i), leftOff: o, rightOff: r };
}
function Rn(n, t) {
  const { f: e } = n;
  return t === "a" ? { body: n, end: t, p: e.a, u: e.dir, offL: e.leftOff, offR: e.rightOff, leftKey: "al", rightKey: "ar", far: e.b } : { body: n, end: t, p: e.b, u: _(e.dir, -1), offL: e.rightOff, offR: e.leftOff, leftKey: "br", rightKey: "bl", far: e.a };
}
const _t = (n) => I(n.p, _(V(n.u), n.offL)), St = (n) => M(n.p, _(V(n.u), n.offR));
function yt(n, t, e) {
  return n !== null && N(n, t) <= e;
}
function Zs(n) {
  const t = [];
  for (const e of n.walls) {
    const i = et(n, e);
    if (i.len < 1e-9) continue;
    const s = V(i.dir);
    t.push({
      wall: e,
      f: i,
      c: {
        al: I(i.a, _(s, i.leftOff)),
        ar: M(i.a, _(s, i.rightOff)),
        bl: I(i.b, _(s, i.leftOff)),
        br: M(i.b, _(s, i.rightOff))
      }
    });
  }
  return t;
}
function Xs(n, t) {
  const e = t.f, i = V(e.dir);
  for (const s of n) {
    if (s.body === t) continue;
    const r = B(M(s.far, e.a), i) >= 0 ? I(e.a, _(i, e.leftOff)) : M(e.a, _(i, e.rightOff)), l = pi * Math.max(s.body.wall.thickness, t.wall.thickness), a = at(_t(s), s.u, r, e.dir), d = at(St(s), s.u, r, e.dir);
    yt(a, s.p, l) && (s.body.c[s.leftKey] = a), yt(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function Qs(n, t) {
  n.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const e = pi * Math.max(...n.map((s) => s.body.wall.thickness));
  for (let s = 0; s < n.length; s++) {
    const o = n[s], r = n[(s + 1) % n.length], l = at(St(o), o.u, _t(r), r.u);
    yt(l, t, e) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (n.length < 3) return;
  const i = Js(n, t, e);
  for (const s of n) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = M(r, o), a = It(l, M(t, o)), d = It(l, M(s.far, o));
    a * d < 0 && Le(s, [t]);
  }
}
function Le(n, t) {
  n.end === "a" ? n.body.extraA = t : n.body.extraB = t;
}
function Js(n, t, e) {
  const i = n.length;
  for (let s = 0; s < i; s++) {
    const o = n[s], r = n[(s + 1) % i];
    if (Math.abs(It(o.u, r.u)) > 1e-9 || B(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = n[(s + 2) % i], d = at(St(o), o.u, _t(a), a.u), f = at(_t(r), r.u, _t(a), a.u);
        if (!yt(d, t, e) || !yt(f, t, e)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = f, Le(o, [t, c, f]);
      } else {
        const a = n[(s - 1 + i) % i], d = at(_t(r), r.u, St(a), a.u), f = at(St(o), o.u, St(a), a.u);
        if (!yt(f, t, e) || !yt(d, t, e)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = f, r.body.c[r.leftKey] = d, Le(r, [f, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function gi(n) {
  const t = Zs(n), e = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of n.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(Rn(r, "a")), r.wall.b === i.id && s.push(Rn(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? e.get(i.host.wallId) : void 0;
    o ? Xs(s, o) : s.length >= 2 && Qs(s, { x: i.x, y: i.y });
  }
  return t;
}
function mi(n) {
  return [n.c.ar, n.c.br, ...n.extraB ?? [], n.c.bl, n.c.al, ...n.extraA ?? []];
}
function ye(n) {
  return new Map(gi(n).map((t) => [t.wall.id, mi(t)]));
}
function Ln(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i], o = n[(i + 1) % n.length], r = t(s), l = t(o);
    r >= 0 && e.push(s), r >= 0 != l >= 0 && e.push(I(s, _(M(o, s), r / (r - l))));
  }
  return e;
}
function $i(n) {
  const t = /* @__PURE__ */ new Map();
  for (const e of gi(n)) {
    const i = mi(e), s = n.openings.filter((d) => d.wallId === e.wall.id && !d.invalid).sort((d, f) => d.offset - f.offset), o = (d) => B(M(d, e.f.a), e.f.dir), r = [];
    let l = -1 / 0;
    for (const d of s)
      r.push([l, d.offset]), l = Math.max(l, d.offset + d.width);
    r.push([l, 1 / 0]);
    const a = [];
    for (const [d, f] of r) {
      if (f <= d) continue;
      let c = i;
      d > -1 / 0 && (c = Ln(c, (u) => o(u) - d)), f < 1 / 0 && (c = Ln(c, (u) => f - o(u))), c.length >= 3 && Math.abs(At(c)) > Gs && a.push(c);
    }
    t.set(e.wall.id, a);
  }
  return t;
}
function yi(n, t) {
  const e = t ? [...$i(n).values()].flat() : [...ye(n).values()], i = e.map((o) => [o.map((r) => [r.x, r.y])]);
  if (i.length === 0) return [];
  let s;
  try {
    s = fi.union(i[0], ...i.slice(1));
  } catch {
    return e.map((o) => [o.map((r) => ({ x: r.x, y: r.y }))]);
  }
  return s.map((o) => o.map((r) => {
    const l = r.map(([f, c]) => ({ x: f, y: c })), a = l[0], d = l[l.length - 1];
    return l.length > 1 && a.x === d.x && a.y === d.y && l.pop(), l;
  }));
}
function we(n) {
  const t = [];
  for (const e of yi(n, !1)) for (const i of e.slice(1)) t.push(i);
  return t;
}
function ue(n, t) {
  let e = null, i = 1 / 0;
  for (const s of n) {
    if (!Qt(t, s)) continue;
    const o = Math.abs(At(s));
    o < i && (e = s, i = o);
  }
  return e;
}
function wi(n) {
  return Math.round(Math.abs(At(n)) / 1e6 * 100) / 100;
}
const Ie = 1e-3;
function vi(n, t) {
  return n.length !== t.length || Math.abs(Math.abs(At(n)) - Math.abs(At(t))) > Ie ? !1 : n.every((e) => t.some((i) => Math.abs(e.x - i.x) <= Ie && Math.abs(e.y - i.y) <= Ie));
}
function to(n, t, e) {
  const i = we(n), s = ue(i, t);
  if (!s) return { level: n, zoneId: null };
  for (const r of n.zones) {
    const l = r.broken ? null : ue(i, r.seed);
    if (l && vi(l, s)) return { level: n, zoneId: null };
  }
  const o = { id: X(), name: e, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...n, zones: [...n.zones, o] }, zoneId: o.id };
}
function eo(n, t, e) {
  return { ...n, zones: n.zones.map((i) => i.id === t ? { ...i, name: e } : i) };
}
function tn(n, t) {
  return Qe({ ...n, zones: n.zones.filter((e) => e.id !== t) });
}
function Nt(n) {
  if (n.zones.length === 0) return n;
  const t = we(n), e = [], i = n.zones.map((s) => {
    const o = ue(t, s.seed);
    return !o || e.some((r) => vi(r, o)) ? { ...s, broken: !0 } : (e.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...n, zones: i };
}
const Pt = 1e-6;
function xi(n, t) {
  const e = n.walls.find((o) => o.id === t);
  if (!e) return null;
  const i = n.nodes.find((o) => o.id === e.a), s = n.nodes.find((o) => o.id === e.b);
  return !i || !s ? null : Math.hypot(s.x - i.x, s.y - i.y);
}
function bi(n, t) {
  return n.offset < t.offset + t.width - Pt && t.offset < n.offset + n.width - Pt;
}
function en(n, t, e, i, s) {
  const o = xi(n, t);
  return o === null || i <= 0 || e < -Pt || e + i > o + Pt ? !1 : !n.openings.some((r) => r.wallId === t && r.id !== s && bi(r, { offset: e, width: i }));
}
function Ct(n, t) {
  return { ...n, openings: t };
}
function Tn(n, t, e, i, s, o = {}) {
  const r = s ?? se[e], l = i - r / 2;
  if (!en(n, t, l, r)) return { level: n, openingId: null };
  const a = { id: X(), wallId: t, kind: e, offset: l, width: r, invalid: !1 };
  return (e === "door" || e === "gate" || e === "wicket") && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), e === "window" && (a.outside = o.outside ?? "left"), { level: Nt(Ct(n, [...n.openings, a])), openingId: a.id };
}
function ki(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !en(n, i.wallId, e, i.width, t) ? n : Nt(te(Ct(n, n.openings.map((s) => s.id === t ? { ...s, offset: e } : s))));
}
function no(n, t, e) {
  const i = n.openings.find((s) => s.id === t);
  return !i || !en(n, i.wallId, i.offset, e, t) ? n : Nt(te(Ct(n, n.openings.map((s) => s.id === t ? { ...s, width: e } : s))));
}
function io(n, t, e) {
  return n.openings.some((i) => i.id === t) ? Nt(te(Ct(n, n.openings.map((i) => i.id === t ? { ...i, ...e } : i)))) : n;
}
function nn(n, t) {
  return Nt(te(Ct(n, n.openings.filter((e) => e.id !== t))));
}
function te(n) {
  return Ct(n, n.openings.map((t) => {
    const e = xi(n, t.wallId), i = e === null || t.offset < -Pt || t.offset + t.width > e + Pt || n.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && bi(t, s));
    return { ...t, invalid: i };
  }));
}
const Gt = 1;
function ot(n) {
  return structuredClone(n);
}
function _i(n, t) {
  const e = n.nodes.find((i) => i.id === t);
  if (!e) throw new Error(`node not found: ${t}`);
  return e;
}
function Dt(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) throw new Error(`wall not found: ${t}`);
  return e;
}
function U(n, t) {
  const e = _i(n, t);
  return { x: e.x, y: e.y };
}
function sn(n, t, e) {
  return Math.min(e, Math.max(t, n));
}
function so(n, t, e) {
  const i = Dt(n, t), s = U(n, i.a), o = U(n, i.b), r = N(s, o), l = sn(e, 0, r);
  return { pt: r === 0 ? s : Ge(s, o, l / r), offset: l };
}
function oo(n) {
  for (let t = 0; t <= n.nodes.length; t++) {
    let e = !1;
    for (const i of n.nodes) {
      if (!i.host) continue;
      const s = n.walls.find((f) => f.id === i.host.wallId);
      if (!s) continue;
      const o = U(n, s.a), r = U(n, s.b), l = N(o, r), a = sn($e(i, o, r) * l, 0, l), d = l === 0 ? o : Ge(o, r, a / l);
      (Math.abs(i.x - d.x) > 1e-9 || Math.abs(i.y - d.y) > 1e-9) && (e = !0), i.x = d.x, i.y = d.y, i.host.offset = a;
    }
    if (!e) break;
  }
}
function Si(n, t) {
  return oo(n), t && (co(t, n), xs(t, n)), Nt(Qe(te(n)));
}
function gt(n, t) {
  return Si(ot(n), t);
}
function Ei(n, t, e) {
  const i = _i(n, t);
  if (i.host && n.walls.some((s) => s.id === i.host.wallId)) {
    const s = Dt(n, i.host.wallId), o = U(n, s.a), r = U(n, s.b), l = N(o, r);
    i.host.offset = sn($e(e, o, r) * l, 0, l);
    const a = l === 0 ? o : Ge(o, r, i.host.offset / l);
    i.x = a.x, i.y = a.y;
  } else
    i.x = e.x, i.y = e.y;
}
function Un(n, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: U(n, t.nodeId), nodeId: t.nodeId };
  const e = Dt(n, t.wallId), { pt: i, offset: s } = so(n, t.wallId, t.offset), o = N(U(n, e.a), U(n, e.b));
  return s <= Gt ? { pt: U(n, e.a), nodeId: e.a } : o - s <= Gt ? { pt: U(n, e.b), nodeId: e.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Bn(n, t) {
  if (t.nodeId) return t.nodeId;
  const e = { id: X(), x: t.pt.x, y: t.pt.y };
  return t.host && (e.host = { ...t.host }), n.nodes.push(e), e.id;
}
function ro(n, t, e, i) {
  const s = Un(n, t), o = Un(n, e);
  if (N(s.pt, o.pt) < Gt) return { level: n, wallId: null, endNodeId: null };
  const r = ot(n), l = Bn(r, s), a = Bn(r, o);
  if (l === a) return { level: n, wallId: null, endNodeId: null };
  const d = { id: X(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: gt(r, n), wallId: d.id, endNodeId: a };
}
function lo(n, t, e, i, s) {
  const o = s === "inner" ? i.thickness / 2 : s === "outer" ? -i.thickness / 2 : 0, r = Math.min(t.x, e.x) - o, l = Math.max(t.x, e.x) + o, a = Math.min(t.y, e.y) - o, d = Math.max(t.y, e.y) + o;
  if (l - r < Gt || d - a < Gt) return n;
  const f = ot(n), u = [{ x: r, y: a }, { x: l, y: a }, { x: l, y: d }, { x: r, y: d }].map((h) => {
    const m = { id: X(), x: h.x, y: h.y };
    return f.nodes.push(m), m.id;
  });
  for (let h = 0; h < 4; h++)
    f.walls.push({
      id: X(),
      a: u[h],
      b: u[(h + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return gt(f, n);
}
function ao(n, t, e) {
  const i = ot(n);
  return Ei(i, t, e), Si(i, n);
}
function co(n, t) {
  for (const e of t.walls) {
    const i = n.walls.find((f) => f.id === e.id);
    if (!i || i.a !== e.a) continue;
    const s = U(n, i.a), o = U(n, i.b), r = U(t, e.a), l = U(t, e.b);
    if (s.x === r.x && s.y === r.y) continue;
    const a = N(r, l);
    if (a === 0) continue;
    const d = Xt(M(o, s));
    for (const f of t.openings)
      f.wallId === e.id && (f.offset = $e(I(s, _(d, f.offset)), r, l) * a);
  }
}
function ho(n, t, e) {
  const i = ot(n), s = Dt(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: I(U(i, l), e) }));
  for (const l of r) Ei(i, l.id, l.to);
  return gt(i, n);
}
function on(n) {
  n.nodes = n.nodes.filter((t) => n.walls.some((e) => e.a === t.id || e.b === t.id));
}
function uo(n, t, e) {
  const i = ot(n), s = Dt(i, t), o = U(i, s[e]), r = { id: X(), x: o.x, y: o.y };
  return i.nodes.push(r), s[e] = r.id, on(i), { level: gt(i, n), nodeId: r.id };
}
function fo(n, t, e) {
  if (t === e) return n;
  const i = ot(n);
  for (const o of i.walls)
    o.a === t && (o.a = e), o.b === t && (o.b = e);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = (i.devices ?? []).filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return i.nodes = i.nodes.filter((o) => o.id !== t), on(i), gt(i, n);
}
function rn(n, t) {
  var i;
  const e = ot(n);
  e.walls = e.walls.filter((s) => s.id !== t), e.openings = e.openings.filter((s) => s.wallId !== t), e.devices = (e.devices ?? []).filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of e.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return on(e), gt(e, n);
}
function po(n, t, e) {
  const i = ot(n);
  return Object.assign(Dt(i, t), e), gt(i, n);
}
class Mi extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Ae(n) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function go(n, t) {
  return (await n.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function mo(n, t, e, i = !1) {
  try {
    return (await n.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: e,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Mi(s.message) : s;
  }
}
async function $o(n, t) {
  await n.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
function ee(n) {
  return n instanceof Error || typeof n == "object" && n !== null && typeof n.message == "string" ? n.message : String(n);
}
const yo = 3;
function wo(n) {
  if (typeof n == "number")
    return n === yo ? "Connection lost" : `Connection error ${n}`;
  if (typeof n == "string") return n;
  if (n instanceof Error) return n.message;
  if (typeof n == "object" && n !== null) {
    const t = n;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return String(n);
}
class vo {
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
    const i = { ...t, id: X(), name: e, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await mo(this.hass, t, e, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Mi ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = wo(o)), this.onChange(), null;
    }
  }
}
const xo = {
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
  "conflict.cancel": "Cancel",
  "draft.title": "Unsaved changes found",
  "draft.text": "Restore unsaved changes from {time}?",
  "draft.restore": "Restore",
  "draft.discard": "Discard",
  "draft.banner": "Unsaved changes from {time} available",
  "switch.title": "Unsaved changes",
  "switch.text": "Opening another plan discards the unsaved changes of this one.",
  "switch.discard": "Discard and open",
  "switch.cancel": "Cancel",
  "plan.pick": "Open plan",
  "plan.new": "New plan",
  "plan.delete": "Delete plan",
  "new.title": "New plan",
  "new.text": "Creating a new plan discards the unsaved changes of this one.",
  "new.discard": "Discard changes",
  "new.cancel": "Cancel",
  "delete.title": "Delete plan",
  "delete.text": "Delete plan '{name}'? This cannot be undone.",
  "delete.confirm": "Delete",
  "delete.cancel": "Cancel",
  "props.none": "Nothing selected",
  "props.wall": "Wall",
  "props.type": "Type",
  "props.thickness": "Thickness",
  "props.baseline": "Baseline",
  "props.length": "Length",
  "props.opening": "Opening",
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
function p(n, t) {
  return xo[n] ?? n;
}
const bo = 32, jn = 128;
function fe(n) {
  const t = n * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function ut(n) {
  return Math.atan2(-n.y, n.x) * 180 / Math.PI;
}
function Q(n, t) {
  const e = t.placement;
  if (e.mode === "free") return { pt: { x: e.x, y: e.y }, dir: fe(e.rotation) };
  const i = n.walls.find((a) => a.id === e.wallId);
  if (!i) return null;
  let s;
  try {
    s = et(n, i);
  } catch {
    return null;
  }
  const o = V(s.dir), r = e.side === "left" ? o : _(o, -1), l = e.side === "left" ? s.leftOff : s.rightOff;
  return { pt: I(I(s.a, _(s.dir, e.offset)), _(r, l)), dir: e.aim ? fe(ut(r) + e.aim) : r, normal: r };
}
function Ii(n, t) {
  const e = [];
  for (let i = 0; i < jn; i++) e.push(I(n, _(fe(360 * i / jn), t)));
  return e;
}
function Fn(n, t, e, i) {
  if (e >= 360) return Ii(n, i);
  const s = Math.max(1, Math.ceil(e / 90 * bo)), o = ut(t) - e / 2, r = [n];
  for (let l = 0; l <= s; l++) r.push(I(n, _(fe(o + e * l / s), i)));
  return r;
}
function ko(n, t) {
  const e = t.props;
  if (e.kind !== "wall_light" && e.kind !== "motion_sensor" && e.kind !== "ceiling_light") return null;
  const i = Q(n, t);
  if (!i) return null;
  switch (e.kind) {
    case "wall_light":
      return e.coneAngle > 0 && e.coneRange > 0 ? Fn(i.pt, i.dir, e.coneAngle, e.coneRange) : null;
    case "motion_sensor":
      return e.zoneAngle > 0 && e.zoneRange > 0 ? Fn(i.pt, i.dir, e.zoneAngle, e.zoneRange) : null;
    case "ceiling_light":
      return e.poolRadius !== null && e.poolRadius > 0 ? Ii(i.pt, e.poolRadius) : null;
  }
}
function Ai(n) {
  return n.normal ? I(n.pt, n.normal) : n.pt;
}
function _o(n, t) {
  const e = Q(n, t);
  if (!e) return null;
  const i = Ai(e);
  let s = null, o = 1 / 0;
  for (const r of n.zones) {
    if (!Qt(i, r.outline)) continue;
    const l = Math.abs(At(r.outline));
    l < o && (s = r.id, o = l);
  }
  return s;
}
const Hn = (n) => [n.map((t) => [t.x, t.y])];
function So(n, t, e = we(n)) {
  const i = ko(n, t);
  if (!i) return [];
  const s = Q(n, t), o = Ai(s), r = ue(e, o);
  if (!r) return [i];
  let l;
  try {
    l = fi.intersection(Hn(i), Hn(r));
  } catch {
    return [i];
  }
  return l.flatMap((a) => a.map((d) => {
    const f = d.map(([h, m]) => ({ x: h, y: m })), c = f[0], u = f[f.length - 1];
    return f.length > 1 && c.x === u.x && c.y === u.y && f.pop(), f;
  }));
}
function Eo(n, t, e, i) {
  const s = Q(n, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, B(M(e, s.pt), s.dir)));
    return N(I(s.pt, _(s.dir, l)), e) <= i;
  }
  if (o.kind !== "equipment") return N(s.pt, e) <= i;
  if (o.shape === "circle") return N(s.pt, e) <= o.diameter / 2 + i;
  const r = M(e, s.pt);
  return Math.abs(B(r, s.dir)) <= o.width / 2 + i && Math.abs(B(r, V(s.dir))) <= o.depth / 2 + i;
}
function Mo(n, t, e) {
  const i = n.devices ?? [];
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Eo(n, i[o], t, e)) return i[o].id;
  return null;
}
const Io = 60, Ao = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Te(n, t, e) {
  if (!Ao.has(t.props.kind)) return null;
  const i = Q(n, t);
  return i ? { from: i.pt, to: I(i.pt, _(i.dir, Io / e)) } : null;
}
function Pi(n, t) {
  const e = { ...n, aim: t };
  return t === 0 && delete e.aim, e;
}
function Po(n, t, e, i) {
  const s = t.placement, o = Q(n, t);
  if (!o || e.x === o.pt.x && e.y === o.pt.y) return s;
  const r = ut(M(e, o.pt)), l = (f) => i ? Math.round(f / 15) * 15 : Math.round(f);
  if (s.mode === "free") return { ...s, rotation: (l(r) % 360 + 360) % 360 };
  const a = ((r - ut(o.normal)) % 360 + 540) % 360 - 180, d = Math.max(-90, Math.min(90, l(a)));
  return Pi(s, d);
}
const Oi = 12, L = "non-scaling-stroke", qn = { boiler: "B", pc: "PC", automation: "A", other: "•" }, Oo = "__preview__", Wn = /* @__PURE__ */ new WeakMap();
function No(n) {
  let t = Wn.get(n);
  return t === void 0 && (t = we(n), Wn.set(n, t)), t;
}
const Co = (n) => n.length === 0 ? "" : `M${n.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function Do(n, t, e, i) {
  const s = n.props, o = { stroke: e, fill: i };
  switch (s.kind) {
    case "ceiling_light":
      return s.shape === "linear" ? E`<rect class="icon" x=${-s.length / 2} y=${-s.width / 2} width=${s.length} height=${s.width}
          fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></rect>` : s.shape === "spot" ? E`<circle class="icon" r=${t / 3} fill=${e} stroke=${e} stroke-width="1" vector-effect=${L}></circle>` : E`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>`;
    case "wall_light":
      return E`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${o.fill} stroke=${o.stroke}
        stroke-width="1.5" vector-effect=${L}></path>`;
    case "motion_sensor": {
      const r = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return E`<circle class="icon" r=${t * 0.6} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>
        <path class="arcs" d=${r(1) + r(1.5)} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${L}></path>`;
    }
    case "illuminance_sensor": {
      let r = "";
      for (let l = 0; l < 8; l++) {
        const a = l * Math.PI / 4;
        r += `M${Math.cos(a) * t * 1.15} ${Math.sin(a) * t * 1.15}L${Math.cos(a) * t * 1.6} ${Math.sin(a) * t * 1.6}`;
      }
      return E`<circle class="icon" r=${t * 0.7} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>
        <path class="rays" d=${r} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${L}></path>`;
    }
    case "switch":
      return E`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${o.fill}
        stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></rect>`;
    case "socket":
      return E`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${e}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${e}></circle>`;
    case "climate_sensor":
      return E`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${L}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${e} stroke=${e} stroke-width="1" vector-effect=${L}></path>`;
    case "exhaust_fan": {
      let r = "";
      for (let l = 0; l < 4; l++) {
        const a = l * Math.PI / 2 + Math.PI / 4;
        r += `M0 0L${Math.cos(a) * t * 0.85} ${Math.sin(a) * t * 0.85}`;
      }
      return E`<circle class="icon" r=${t} fill=${o.fill} stroke=${o.stroke} stroke-width="1.5" vector-effect=${L}></circle>
        <path class="blades" d=${r} fill="none" stroke=${e} stroke-width="1.5" vector-effect=${L}></path>`;
    }
    default:
      return E`${x}`;
  }
}
function zo(n, t, e, i) {
  const s = n.props;
  if (s.kind !== "equipment") return E`${x}`;
  const o = Oi / t.scale, r = s.shape === "circle" ? E`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${e}
        stroke-width="1.5" vector-effect=${L}></circle>` : E`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${e} stroke-width="1.5" vector-effect=${L}></rect>`;
  return E`
    <g transform=${`rotate(${i})`}>${r}</g>
    <text class="equipment-glyph" text-anchor="middle" dominant-baseline="middle" font-size=${o} fill=${e}
      font-family="system-ui, sans-serif" font-weight="600">${qn[s.symbol] ?? qn.other}</text>
    <text class="equipment-label" y=${o * 1.5} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${e} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Ro(n, t, e, i) {
  var u;
  const s = e.palette, o = n.invalid ? s.invalid : s.device, r = Oi / e.scale, l = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, a = !i && ((u = e.selection) == null ? void 0 : u.kind) === "device" && e.selection.id === n.id, d = `device device-${n.props.kind}${a ? " selected" : ""}${n.invalid ? " invalid" : ""}${i ? " device-preview" : ""}`, f = i ? "0.5" : e.dim ? String(s.dimOpacity) : x, c = n.props.kind === "equipment" ? n.props.shape === "circle" ? n.props.diameter / 2 : Math.hypot(n.props.width, n.props.depth) / 2 : r * 1.6;
  return E`
    <g class=${d} data-id=${n.id} opacity=${f} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${a ? E`<circle class="selection-ring" r=${c + 4 / e.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${L}></circle>` : x}
      ${n.props.kind === "equipment" ? zo(n, e, o, l) : E`<g transform=${`rotate(${l})`}>${Do(n, r, o, s.deviceFill)}</g>`}
    </g>`;
}
function Lo(n, t, e, i) {
  if (t.props.kind !== "wall_light" && t.props.kind !== "motion_sensor" && t.props.kind !== "ceiling_light") return x;
  const s = So(n, t, No(n));
  if (s.length === 0) return x;
  const o = e.palette, r = t.invalid ? o.invalid : o.cone, l = i ? "0.5" : e.dim ? String(o.dimOpacity) : x, a = s.map(Co).join("");
  return t.props.kind === "ceiling_light" ? E`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${L}></path>` : E`<path class="cone" d=${a} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${l} vector-effect=${L}></path>`;
}
function To(n, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device") return x;
  const e = t.selection.id, i = (n.devices ?? []).find((l) => l.id === e), s = i ? Te(n, i, t.scale) : null;
  if (!s) return x;
  const o = t.palette.selection;
  return E`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : x}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${L}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${L} style="cursor:grab"></circle>
  </g>`;
}
function Uo(n, t) {
  const e = [];
  for (const i of n.devices ?? []) {
    const s = Q(n, i);
    s && e.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Oo, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Q(n, i);
    s && e.push({ d: i, pose: s, preview: !0 });
  }
  return E`
    <g class="cones">${t.showCones ? e.map((i) => Lo(n, i.d, t, i.preview)) : x}</g>
    <g class="devices">${e.map((i) => Ro(i.d, i.pose, t, i.preview))}</g>
    ${To(n, t)}`;
}
const Bo = {
  dark: !0,
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
}, jo = {
  dark: !1,
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
function Fo(n) {
  return n ? Bo : jo;
}
function vt(n) {
  const t = Math.round(n), e = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${e}` : e;
}
function Ni(n, t) {
  return `${n.toFixed(2)} ${p("unit.m2")}`;
}
const Ho = /* @__PURE__ */ new WeakMap(), qo = /* @__PURE__ */ new WeakMap(), Ci = /* @__PURE__ */ new WeakMap();
function pe(n, t, e) {
  let i = n.get(t);
  return i === void 0 && (i = e(t), n.set(t, i)), i;
}
const st = (n) => n.length === 0 ? "" : `M${n.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function ve(n, t, e) {
  const i = V(n.dir), s = I(n.a, _(n.dir, t)), o = I(n.a, _(n.dir, e));
  return [I(s, _(i, n.leftOff)), I(o, _(i, n.leftOff)), M(o, _(i, n.rightOff)), M(s, _(i, n.rightOff))];
}
function Zt(n, t) {
  const e = n.walls.find((i) => i.id === t);
  if (!e) return null;
  try {
    const i = et(n, e);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function Wo(n, t) {
  let e = 0, i = 0, s = 0;
  for (let r = 0; r < n.length; r++) {
    const l = n[r], a = n[(r + 1) % n.length], d = l.x * a.y - a.x * l.y;
    e += d, i += (l.x + a.x) * d, s += (l.y + a.y) * d;
  }
  if (Math.abs(e) < 1e-9) return t;
  const o = { x: i / (3 * e), y: s / (3 * e) };
  return Qt(o, n) ? o : t;
}
const T = "non-scaling-stroke";
function Ko(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (const l of n.walls)
    e.set(l.a, (e.get(l.a) ?? 0) + 1), e.set(l.b, (e.get(l.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const l of n.walls) {
    const a = Zt(n, l.id);
    if (!a) continue;
    const d = V(a.dir);
    for (const [f, c, u] of [[l.a, a.a, a.dir], [l.b, a.b, _(a.dir, -1)]]) {
      const h = n.nodes.find((A) => A.id === f);
      if (!h || h.host || e.get(f) !== 1) continue;
      const m = I(c, _(d, a.leftOff + i)), g = M(c, _(d, a.rightOff + i)), $ = _(d, 1), y = _(I(m, g), 0.5), b = I(M(y, _($, -o)), _(u, s / 2)), k = M(M(y, _($, o)), _(u, s / 2)), S = [m, b, k, g];
      r.push(E`<path class="wall-break" d=${`M${S.map((A) => `${A.x} ${A.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${T}></path>`);
    }
  }
  return r.length ? E`${r}` : x;
}
function Vo(n, t, e) {
  const i = t.palette, s = Wo(n.outline, n.seed), o = 12 / t.scale;
  return E`
    <path class="zone${n.broken ? " broken" : ""}" d=${st(n.outline)}
      fill=${n.broken ? "url(#hatch)" : i.zone}
      stroke=${e ? i.selection : "none"} stroke-width="2" vector-effect=${T}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${n.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${n.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Ni(wi(n.outline), t.lang)}</tspan>
    </text>`;
}
function Yo(n, t, e) {
  const i = V(n.dir), s = (t.swing ?? "left") === "left", o = s ? i : _(i, -1), r = s ? n.leftOff : n.rightOff, [l, a] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = I(I(n.a, _(n.dir, l)), _(o, r)), f = I(I(n.a, _(n.dir, a)), _(o, r)), c = I(d, _(o, t.width)), u = It(M(c, d), M(f, d)) > 0 ? 1 : 0;
  return E`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${e} stroke-width="1.5" vector-effect=${T}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${u} ${f.x} ${f.y}`} fill="none" stroke=${e}
      stroke-width="1" vector-effect=${T}></path>`;
}
function Go(n, t, e) {
  const i = V(n.dir), s = n.leftOff + n.rightOff, o = [n.leftOff - s / 3, n.leftOff - 2 * s / 3].map((r) => {
    const l = I(I(n.a, _(n.dir, t.offset)), _(i, r)), a = I(I(n.a, _(n.dir, t.offset + t.width)), _(i, r));
    return E`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${e} stroke-width="1.5" vector-effect=${T}></line>`;
  });
  return E`${o}`;
}
function Zo(n, t, e) {
  const i = Zt(n, t.wallId);
  if (!i) return x;
  const s = e.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = ve(i, t.offset, t.offset + t.width), l = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return E`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${st(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Yo(i, t, o) : t.kind === "window" ? Go(i, t, o) : x}
    </g>`;
}
function Kn(n, t, e, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = I(n, _(e, i)), a = I(t, _(e, i)), d = (c, u) => {
    const h = I(u, _(e, i + r));
    return E`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${T}></line>`;
  }, f = I(_(I(l, a), 0.5), _(e, 9 / s.scale));
  return E`
    <g class="dim">
      ${d(I(n, _(e, 2 / s.scale)), n)}${d(I(t, _(e, 2 / s.scale)), t)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${T}></line>
      <text x=${f.x} y=${f.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${vt(N(n, t))}</text>
    </g>`;
}
function Xo(n, t) {
  const e = t.selection;
  if (!e) return x;
  const i = t.palette, s = 4 / t.scale, o = (r) => E`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (e.kind === "node") {
    const r = n.nodes.find((l) => l.id === e.id);
    return r ? o(r) : x;
  }
  if (e.kind === "wall") {
    const r = pe(Ci, n, ye).get(e.id), l = Zt(n, e.id);
    if (!r || !l) return x;
    const a = V(l.dir);
    return E`
      <path d=${st(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${T}></path>
      ${o(l.a)}${o(l.b)}
      ${Kn(l.a, l.b, a, l.leftOff + 18 / t.scale, t)}`;
  }
  if (e.kind === "opening") {
    const r = n.openings.find((u) => u.id === e.id), l = r ? Zt(n, r.wallId) : null;
    if (!r || !l) return x;
    const a = _(V(l.dir), -1), d = l.rightOff + 18 / t.scale, f = (u) => I(l.a, _(l.dir, u)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return E`
      <path d=${st(ve(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${T}></path>
      ${c.filter(([u, h]) => h - u >= 1).map(([u, h]) => Kn(f(u), f(h), a, d, t))}`;
  }
  return x;
}
function Qo(n, t, e) {
  if (N(n, t) < 1e-6) return null;
  const i = e.thickness, [s, o] = e.baseline === "left" ? [0, i] : e.baseline === "right" ? [i, 0] : [i / 2, i / 2];
  return ve({ a: n, dir: Xt(M(t, n)), len: N(n, t), leftOff: s, rightOff: o }, 0, N(n, t));
}
function Jo(n, t) {
  const { preview: e, palette: i } = t, s = 1e7, o = e.orthoFrom, r = e.opening, l = r ? Zt(n, r.wallId) : null;
  return E`
    ${o ? E`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${T}></path>` : x}
    ${(e.walls ?? []).map((a) => {
    const d = Qo(a.a, a.b, a.props);
    return E`<g class="preview-wall">
        ${d ? E`<path d=${st(d)} fill=${i.selection} fill-opacity="0.35"></path>` : x}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${T}></line></g>`;
  })}
    ${r && l ? E`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${st(ve(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : x}
    ${er(n, t)}`;
}
function tr(n, t) {
  const e = t.palette, i = 5 / t.scale;
  return E`<g class="snap-start">
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.background}
      stroke-width="4" vector-effect=${T}></rect>
    <rect x=${n.x - i} y=${n.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${e.snap}
      stroke-width="1.5" vector-effect=${T}></rect></g>`;
}
function er(n, t) {
  const e = t.preview, i = t.palette, s = e.anchor ? tr(e.anchor, t) : x, o = e.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / t.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let f, c = x;
  if (o.kind === "node") {
    const h = r(5);
    f = E`<g class="snap-node"><rect x=${l - h} y=${a - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${T}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${l} ${a - h}L${l + h * 0.866} ${a + h / 2}L${l - h * 0.866} ${a + h / 2}Z`;
    f = E`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${T}></path></g>`;
  } else if (o.kind === "wall") {
    const h = r(5), m = `M${l - h} ${a - h}L${l + h} ${a + h}M${l - h} ${a + h}L${l + h} ${a - h}`;
    f = E`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${T}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${T}></path></g>`;
    const g = o.endpoint.kind === "wall" ? pe(Ci, n, ye).get(o.endpoint.wallId) : void 0;
    g && (c = E`<path class="snap-wall-hl" d=${st(g)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${T}></path>`);
  } else {
    const h = r(4), m = `M${l - h} ${a}H${l + h}M${l} ${a - h}V${a + h}`;
    f = E`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${T}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${T}></path></g>`;
  }
  const u = p(`snapmark.${o.kind}`, t.lang);
  return E`
    ${c}${s}${f}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${T} font-family="system-ui, sans-serif">${u}</text>`;
}
function nr(n, t) {
  const e = t.preview.level ?? n, i = t.palette, s = pe(Ho, e, (c) => yi(c, !0)), o = e.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? pe(qo, e, $i) : null, l = 8 / t.scale, a = t.selection, d = t.mode === "equipment", f = d ? String(i.dimOpacity) : x;
  return E`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${l} height=${l} patternTransform="rotate(45)">
        <rect width=${l} height=${l} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${l} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${f}>${e.zones.map((c) => Vo(c, t, (a == null ? void 0 : a.kind) === "zone" && a.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(st).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${f}></path>
    ${r ? E`<g class="railings" opacity=${f}>${o.flatMap((c) => (r.get(c.id) ?? []).map((u) => E`<path d=${st(u)} fill=${i.railing}></path>`))}</g>` : x}
    <g class="openings" opacity=${f}>${e.openings.map((c) => Zo(e, c, t))}</g>
    <g class="wall-breaks" opacity=${f}>${Ko(e, t)}</g>
    <g class="devices-layer">${Uo(e, {
    palette: i,
    scale: t.scale,
    selection: a,
    showCones: t.showCones ?? !0,
    dim: !d,
    lang: t.lang,
    preview: t.preview.device
  })}</g>
    <g class="selection">${Xo(e, t)}</g>
    <g class="preview">${Jo(e, t)}</g>`;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ir = { PROPERTY: 3 }, sr = (n) => (...t) => ({ _$litDirective$: n, values: t });
class or {
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
const rr = {}, lr = (n, t = rr) => n._$AH = t;
class ar extends or {
  constructor(t) {
    if (super(t), t.type !== ir.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === e ? ft : (lr(t), e);
  }
}
const Y = sr(ar);
function Di(n, t) {
  return Math.abs(t.x - n.x) >= Math.abs(t.y - n.y) ? { x: t.x, y: n.y } : { x: n.x, y: t.y };
}
function Ue(n) {
  const t = n.replace(/[  ]/g, "");
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return Number.isSafeInteger(e) && e > 0 ? e : null;
}
function cr(n, t, e) {
  return I(n, _(Xt(M(t, n)), e));
}
function Vn(n, t) {
  return { pt: n, kind: t, endpoint: { kind: "free", pt: n } };
}
function Ot(n, t, e) {
  const { tolMm: i, grid: s, ortho: o } = e, r = o ? e.from : void 0, l = new Set(e.excludeNodeIds ?? []), a = r ? Di(r, t) : t, d = r !== void 0 && a.y === r.y, f = (y) => !r || Math.abs(d ? y.y - r.y : y.x - r.x) <= 1;
  let c = null;
  for (const y of n.nodes) {
    if (l.has(y.id)) continue;
    const b = { x: y.x, y: y.y }, k = N(b, a);
    k <= i && f(b) && (!c || k < c.d) && (c = { id: y.id, pt: b, d: k });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const u = n.walls.filter((y) => !l.has(y.a) && !l.has(y.b)).map((y) => ({ w: y, f: et(n, y) })).filter((y) => y.f.len > 1e-9);
  let h = null;
  for (const { w: y, f: b } of u) {
    const k = { x: (b.a.x + b.b.x) / 2, y: (b.a.y + b.b.y) / 2 }, S = N(k, a);
    S <= i && f(k) && (!h || S < h.d) && (h = { wallId: y.id, pt: k, offset: b.len / 2, d: S });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const m = (y) => {
    let b = null;
    for (const { w: k, f: S } of u) {
      const A = V(S.dir), P = y ? [S.leftOff, -S.rightOff].filter((O) => O !== 0) : [0];
      for (const O of P) {
        const D = I(S.a, _(A, O)), j = r ? at(r, M(a, r), D, S.dir) : I(D, _(S.dir, B(M(a, D), S.dir)));
        if (!j) continue;
        const q = B(M(j, D), S.dir);
        if (q < 0 || q > S.len) continue;
        const W = N(j, a);
        W <= i && (!b || W < b.d) && (b = { d: W, res: { pt: j, kind: "wall", endpoint: { kind: "wall", wallId: k.id, offset: q } } });
      }
    }
    return b ? b.res : null;
  }, g = m(!1);
  if (g) return g;
  const $ = m(!0);
  if ($) return $;
  if (s && s > 0) {
    const y = (k) => Math.round(k / s) * s, b = r ? d ? { x: y(a.x), y: r.y } : { x: r.x, y: y(a.y) } : { x: y(a.x), y: y(a.y) };
    return Vn(b, "grid");
  }
  return Vn(a, "none");
}
function dr(n, t, e) {
  const i = M(e, t), s = B(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, B(M(n, t), i) / s));
  return N(n, { x: t.x + i.x * o, y: t.y + i.y * o });
}
function hr(n, t, e) {
  return t.some((i, s) => dr(n, i, t[(s + 1) % t.length]) <= e);
}
function zi(n, t, e) {
  for (const [i, s] of ye(n))
    if (Qt(t, s) || hr(t, s, e)) return i;
  return null;
}
function ur(n, t) {
  for (const e of n.openings) {
    const i = n.walls.find((a) => a.id === e.wallId);
    if (!i) continue;
    const s = et(n, i);
    if (s.len < 1e-9) continue;
    const o = M(t, s.a), r = B(o, s.dir), l = o.x * s.dir.y - o.y * s.dir.x;
    if (r >= e.offset && r <= e.offset + e.width && l >= -s.rightOff && l <= s.leftOff) return e.id;
  }
  return null;
}
function fr(n, t, e, i) {
  const s = ur(n, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = n.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = n.nodes.find((d) => d.id === l);
        if (a && N(t, a) <= e) return { kind: "node", id: l };
      }
  }
  const o = zi(n, t, e);
  if (o) return { kind: "wall", id: o };
  for (const r of n.zones)
    if (r.outline.length >= 3 && Qt(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function pr(n) {
  let t = null, e = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, l = null;
  const a = (h) => {
    t = h, n.select(h);
  }, d = () => {
    e = null, i = null, s = null, l = null, o = !1;
  }, f = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, m, g) => {
    const $ = et(h, h.walls.find((y) => y.id === m));
    return B(M(g, $.a), $.dir);
  };
  function u(h) {
    const m = e;
    if (!(!m || !i) && !(h.pt.x === r.x && h.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const g = Ot(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), $ = g.endpoint, y = (g.kind === "wall" || g.kind === "mid") && $.kind === "wall", b = g.kind === "node" && $.kind === "node" && $.nodeId !== m.nodeId, k = i.nodes.find((O) => O.id === m.nodeId), S = !!k.host && y && $.kind === "wall" && $.wallId === k.host.wallId;
        let A = i;
        if (k.host && !S) {
          const O = structuredClone(i);
          delete O.nodes.find((D) => D.id === m.nodeId).host, A = O;
        }
        let P = ao(A, m.nodeId, f(g));
        if (b && $.kind === "node")
          P = fo(P, m.nodeId, $.nodeId);
        else if (y && $.kind === "wall" && !S) {
          const O = i.walls.find((D) => D.id === $.wallId);
          if (O && O.a !== m.nodeId && O.b !== m.nodeId) {
            const D = structuredClone(P);
            D.nodes.find((j) => j.id === m.nodeId).host = { wallId: $.wallId, offset: $.offset }, P = gt(D, P);
          }
        }
        s = P;
      } else if (m.kind === "wall") {
        const g = i.walls.find((b) => b.id === m.wallId), $ = Ot(i, h.pt, {
          tolMm: n.tolMm(),
          grid: n.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [g.a, g.b]
        }), y = M($.pt, m.origin);
        s = ho(
          i,
          m.wallId,
          $.kind === "none" ? { x: Math.round(y.x), y: Math.round(y.y) } : y
        );
      } else {
        const g = i.openings.find(($) => $.id === m.openingId);
        s = ki(i, g.id, c(i, g.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      d(), r = h.pt;
      const m = n.level(), g = t, $ = fr(m, h.pt, n.tolMm(), g);
      if (a($), !!$) {
        if (l = i = s = m, $.kind === "node") {
          let y = $.id;
          const b = (g == null ? void 0 : g.kind) === "wall" ? m.walls.find((k) => k.id === g.id) : void 0;
          if (h.alt && b) {
            const k = uo(m, b.id, b.a === $.id ? "a" : "b");
            i = s = k.level, y = k.nodeId, a({ kind: "node", id: y });
          }
          e = { kind: "node", nodeId: y, origin: U(i, y) };
        } else if ($.kind === "wall")
          e = { kind: "wall", wallId: $.id, origin: h.pt };
        else if ($.kind === "opening") {
          const y = m.openings.find((b) => b.id === $.id);
          e = { kind: "opening", openingId: y.id, grab: c(m, y.wallId, h.pt) - y.offset };
        }
      }
    },
    move(h) {
      u(h);
    },
    up(h) {
      e && u(h);
      const m = o, g = s, $ = l;
      d(), m && g && $ && g !== $ && n.commit(g);
    },
    key(h) {
      if (h === "Escape" && e)
        return d(), !0;
      if (h !== "Delete" && h !== "Backspace" || !t || t.kind === "node") return !1;
      const m = n.level();
      if (!(t.kind === "wall" ? m.walls : t.kind === "opening" ? m.openings : m.zones).some((y) => y.id === t.id)) return !1;
      const $ = t.kind === "wall" ? rn(m, t.id) : t.kind === "opening" ? nn(m, t.id) : tn(m, t.id);
      return n.commit($), a(null), !0;
    },
    preview() {
      return !e || !s ? {} : { level: s, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      d(), a(null);
    }
  };
}
function gr(n) {
  let t = null, e = { x: 0, y: 0 }, i = "", s = "", o = "length";
  const r = () => {
    t = null, i = "", s = "", o = "length";
  }, l = (c) => Ot(n.level(), c, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 });
  function a() {
    if (!t) return null;
    if (i !== "" || s !== "") {
      const c = Ue(i), u = Ue(s);
      return c === null || u === null ? null : { x: t.x + (e.x >= t.x ? c : -c), y: t.y + (e.y >= t.y ? u : -u) };
    }
    return l(e).pt;
  }
  const d = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function f(c) {
    if (!t || d(t, c)) return;
    const u = lo(n.level(), t, c, n.wallProps(), n.boxMeasure());
    u !== n.level() && (n.commit(u), r());
  }
  return {
    id: "box",
    down(c) {
      if (e = c.pt, !t) {
        t = l(c.pt).pt;
        return;
      }
      const u = a();
      u && f(u);
    },
    move(c) {
      e = c.pt;
    },
    up() {
    },
    key(c) {
      if (!t) return !1;
      if (/^[0-9]$/.test(c) || c === " ")
        return o === "length" ? i += c : s += c, !0;
      if (c === "Backspace")
        return o === "length" ? i = i.slice(0, -1) : s = s.slice(0, -1), !0;
      if (c === "Tab")
        return o = o === "length" ? "angle" : "length", !0;
      if (c === "Enter") {
        const u = a();
        return u && f(u), !0;
      }
      return c === "Escape" ? (i !== "" || s !== "" ? (i = "", s = "", o = "length") : r(), !0) : !1;
    },
    preview() {
      if (!t) return { snap: l(e) };
      const c = a(), h = {
        tracker: { length: i, angle: s, field: o, at: e },
        anchor: t,
        snap: i !== "" || s !== "" ? void 0 : l(e)
      };
      if (!c || d(t, c)) return h;
      const m = n.wallProps(), g = n.boxMeasure(), $ = g === "inner" ? m.thickness / 2 : g === "outer" ? -m.thickness / 2 : 0, y = Math.min(t.x, c.x) - $, b = Math.max(t.x, c.x) + $, k = Math.min(t.y, c.y) - $, S = Math.max(t.y, c.y) + $;
      if (b - y < 1 || S - k < 1) return h;
      const A = [{ x: y, y: k }, { x: b, y: k }, { x: b, y: S }, { x: y, y: S }];
      return h.walls = A.map((P, O) => ({ a: P, b: A[(O + 1) % 4], props: { ...m, baseline: "center" } })), h;
    },
    cancel() {
      r();
    }
  };
}
const Yn = (n) => Math.round(n * 1e3) / 1e3 + 0;
function mr(n) {
  const t = n.replace(/[\s ]/g, "");
  return /^\d+$/.test(t) ? Number(t) : null;
}
function $r(n) {
  let t = null, e = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null, l = "", a = "", d = "length";
  const f = () => {
    l = "", a = "", d = "length";
  }, c = () => {
    t = null, e = null, i = null, r = null, f();
  }, u = (g, $) => Ot(n.level(), g, { tolMm: n.tolMm(), grid: n.grid(), from: e ?? void 0, ortho: $ && e !== null });
  function h() {
    if (!e) return null;
    const g = u(s, o), $ = Ue(l), y = mr(a);
    if ($ === null && y === null) return { pt: g.pt, endpoint: g.endpoint, snap: g };
    const b = $ ?? N(e, g.pt);
    let k = g.pt;
    if (y === null && N(e, g.pt) < 1) {
      const O = r ?? { x: 1, y: 0 };
      k = { x: e.x + O.x, y: e.y + O.y };
    }
    if (y !== null) {
      const O = y * Math.PI / 180;
      k = { x: e.x + Math.cos(O), y: e.y - Math.sin(O) };
    }
    const S = cr(e, k, b), A = { x: Yn(S.x), y: Yn(S.y) }, P = n.level().nodes.find((O) => Math.hypot(O.x - A.x, O.y - A.y) < 1);
    return P ? { pt: { x: P.x, y: P.y }, endpoint: { kind: "node", nodeId: P.id }, snap: g } : { pt: A, endpoint: { kind: "free", pt: A }, snap: g };
  }
  function m() {
    const g = h();
    if (!t || !g) return;
    const $ = ro(n.level(), t, g.endpoint, n.wallProps());
    if ($.wallId === null || $.endNodeId === null) return;
    n.commit($.level);
    const y = $.level.walls.find((P) => P.id === $.wallId);
    i === null && (i = y.a);
    const b = $.endNodeId === i, k = e, S = U($.level, $.endNodeId), A = N(k, S);
    if (A > 0 && (r = { x: (S.x - k.x) / A, y: (S.y - k.y) / A }), f(), b) {
      c();
      return;
    }
    t = { kind: "node", nodeId: $.endNodeId }, e = U($.level, $.endNodeId);
  }
  return {
    id: "wall",
    down(g) {
      if (s = g.pt, o = g.shift, !t) {
        const $ = u(g.pt, !1);
        t = $.endpoint, e = $.pt;
        return;
      }
      m();
    },
    move(g) {
      s = g.pt, o = g.shift;
    },
    up() {
    },
    key(g, $) {
      return o = $.shift, t ? /^[0-9]$/.test(g) || g === " " ? (d === "length" ? l += g : a += g, !0) : g === "Backspace" ? (d === "length" ? l = l.slice(0, -1) : a = a.slice(0, -1), !0) : g === "Tab" ? (d = d === "length" ? "angle" : "length", !0) : g === "Enter" ? (m(), !0) : g === "Escape" ? (l !== "" || a !== "" ? f() : c(), !0) : !1 : !1;
    },
    preview() {
      if (!e) return { snap: Ot(n.level(), s, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }) };
      const g = h();
      return {
        walls: [{ a: e, b: g.pt, props: n.wallProps() }],
        snap: g.snap,
        tracker: { length: l, angle: a, field: d, at: g.pt },
        orthoFrom: o ? e : void 0,
        anchor: e
      };
    },
    cancel() {
      c();
    }
  };
}
function yr(n, t) {
  let e = null;
  const i = () => n.openingDefaults(t);
  function s() {
    if (!e) return null;
    const o = n.level(), r = zi(o, e, n.tolMm());
    if (!r) return null;
    const l = et(o, o.walls.find((d) => d.id === r)), a = B(M(e, l.a), l.dir);
    return { wallId: r, center: a, pt: I(l.a, _(l.dir, a)) };
  }
  return {
    id: t,
    down(o) {
      e = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Tn(n.level(), r.wallId, t, r.center, l.width, l);
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
      const { width: r, ...l } = i(), a = Tn(n.level(), o.wallId, t, o.center, r, l);
      return {
        opening: { wallId: o.wallId, offset: o.center - r / 2, width: r, kind: t, invalid: a.openingId === null },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      e = null;
    }
  };
}
function wr(n) {
  return {
    id: "zone",
    down(t) {
      var s;
      const e = n.level(), i = to(e, t.pt, n.zoneName());
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
const Gn = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
};
function Ri(n) {
  let t = null;
  const e = (s, o, r) => {
    const l = s.devices.find((c) => c.id === o), a = l ? Q(s, l) : null, d = l ? Te(s, l, 10 / n.tolMm()) : null;
    return !a || !d ? 0 : ((c, u) => ((c - u) % 360 + 540) % 360 - 180)(ut(M(r, a.pt)), ut(M(d.to, a.pt)));
  };
  function i(s) {
    if (!t || !t.moved && N(s.pt, t.downPt) <= n.tolMm() * 0.3) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? Q(t.original, o) : null;
    if (!o || !r) return;
    const l = N(s.pt, r.pt), a = (ut(M(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, f = Po(t.original, o, d, s.shift);
    t.work = JSON.stringify(f) === JSON.stringify(o.placement) ? t.original : Ze(t.original, o.id, f);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = n.level(), l = r.devices.find((d) => d.id === s), a = l ? Te(r, l, 10 / n.tolMm()) : null;
      return !l || !a || N(o.pt, a.to) > n.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: e(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && Gn(o.work, o.id) !== Gn(o.original, o.id) && n.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function Zn(n, t, e) {
  const i = et(n, n.walls.find((s) => s.id === t));
  return B(M(e, i.a), V(i.dir)) > 0 ? "left" : "right";
}
function Li(n, t) {
  const e = n.grid();
  return e && e > 0 ? { x: Math.round(t.x / e) * e, y: Math.round(t.y / e) * e } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Ti(n, t, e, i, s = 0) {
  const o = Ye[e];
  if (o.includes("wall")) {
    const r = Ot(t, i, { tolMm: n.tolMm(), grid: n.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: Zn(t, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of t.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const f = et(t, d), c = Math.max(0, Math.min(f.len, B(M(i, f.a), f.dir))), u = Math.hypot(i.x - (f.a.x + f.dir.x * c), i.y - (f.a.y + f.dir.y * c));
        (!a || u < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : f.len, d: u });
      }
      if (a) return { mode: "wall", wallId: a.id, side: Zn(t, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Li(n, i), rotation: s } : null;
}
function vr(n, t, e) {
  const i = n.deviceDefaults(t);
  if (e.mode === "wall" && i.kind === "motion_sensor") {
    const s = Vt("motion_sensor", "wall"), o = Vt("motion_sensor", "free");
    if (s.kind === "motion_sensor" && o.kind === "motion_sensor" && i.zoneAngle === o.zoneAngle) return { ...i, zoneAngle: s.zoneAngle };
  }
  return i;
}
function xr(n, t) {
  let e = null, i;
  const s = Ri(n);
  function o() {
    if (!e) return null;
    const r = n.level(), l = Ti(n, r, t, e);
    if (!l)
      return { placement: { mode: "free", ...Li(n, e), rotation: 0 }, props: n.deviceDefaults(t), invalid: !0 };
    const a = vr(n, t, l), d = xn(r, a, l, "").deviceId !== null;
    return { placement: l, props: a, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (e = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = n.level(), d = p(`device.${t}`, n.lang()), f = new Set((a.devices ?? []).filter((h) => h.props.kind === t).map((h) => h.name));
      let c = 1;
      for (; f.has(`${d} ${c}`); ) c++;
      const u = xn(a, l.props, l.placement, `${d} ${c}`);
      u.deviceId !== null && (n.commit(u.level), i = u.deviceId, n.select({ kind: "device", id: u.deviceId }));
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
const Xn = (n, t) => {
  var e;
  return JSON.stringify((e = n.devices.find((i) => i.id === t)) == null ? void 0 : e.placement);
}, br = (n, t, e) => e === void 0 || Xn(n, e) !== Xn(t, e);
function kr(n) {
  let t = null, e = null;
  const i = Ri(n);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (u) => {
    t = u, n.select(u);
  }, d = () => {
    e = null, s = null, o = null, r = !1;
  };
  function f(u) {
    if (!e || !s || !r && N(u.pt, l) <= n.tolMm() * 0.3) return;
    if (r = !0, u.pt.x === l.x && u.pt.y === l.y) {
      o = s;
      return;
    }
    const h = s.devices.find((A) => A.id === e.id);
    if (!h) return;
    const m = u.shift ? Di(l, u.pt) : u.pt, g = h.placement, $ = g.mode === "free", y = $ ? null : Q(s, h), b = g.mode === "free" ? g.rotation : y ? (Math.round(ut(y.dir)) % 360 + 360) % 360 : 0, k = Ti(n, s, h.props.kind, $ ? I(m, e.grab) : m, b), S = k && k.mode === "wall" && g.mode === "wall" && g.aim !== void 0 ? { ...k, aim: g.aim } : k;
    o = S ? Ze(s, h.id, c(s, h.placement, S, m)) : s;
  }
  function c(u, h, m, g) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const $ = u.walls.find((P) => P.id === h.wallId);
    if (!$) return m;
    const y = et(u, $), b = Math.max(0, Math.min(y.len, h.offset + B(M(g, l), y.dir))), k = B(M(g, y.a), V(y.dir)), S = n.tolMm(), A = h.side === "left" ? k < -(y.rightOff + S) ? "right" : "left" : k > y.leftOff + S ? "left" : "right";
    return { ...m, offset: b, side: A };
  }
  return {
    id: "device-select",
    down(u) {
      d(), l = u.pt;
      const h = n.level(), m = n.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, u)) return;
      const g = Mo(h, u.pt, m);
      if (!g) {
        a(null);
        return;
      }
      a({ kind: "device", id: g });
      const $ = h.devices.find((b) => b.id === g), y = Q(h, $);
      s = o = h, e = { id: g, grab: y && $.placement.mode === "free" ? M(y.pt, u.pt) : { x: 0, y: 0 } };
    },
    move(u) {
      i.active() ? i.move(u) : f(u);
    },
    up(u) {
      if (i.end(u)) return;
      e && f(u);
      const h = o, m = s, g = r, $ = e == null ? void 0 : e.id;
      d(), g && h && m && h !== m && br(m, h, $) && n.commit(h);
    },
    key(u) {
      if (u === "Escape" && i.cancel()) return !0;
      if (u === "Escape" && e)
        return d(), !0;
      if (u !== "Delete" && u !== "Backspace" || !t || t.kind !== "device") return !1;
      const h = n.level();
      return h.devices.some((m) => m.id === t.id) ? (n.commit(Xe(h, t.id)), a(null), !0) : !1;
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
const _r = ["select", "box", "wall", "door", "window", "opening", "zone"], Sr = [
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
function ln(n) {
  return n === "plan" ? _r : Sr;
}
function Be(n, t) {
  switch (n) {
    case "select":
      return pr(t);
    case "box":
      return gr(t);
    case "wall":
      return $r(t);
    case "door":
    case "window":
    case "opening":
      return yr(t, n);
    case "zone":
      return wr(t);
    case "device-select":
      return kr(t);
    default:
      return xr(t, n);
  }
}
function Qn(n, t) {
  return (t.kind === "wall" ? n.walls : t.kind === "node" ? n.nodes : t.kind === "opening" ? n.openings : t.kind === "device" ? n.devices : n.zones).some((i) => i.id === t.id);
}
function Er(n) {
  switch (n.saveState) {
    case "saving":
      return p("save.saving", n.lang);
    case "conflict":
      return p("save.conflict", n.lang);
    case "error":
      return p("save.error", n.lang);
    default:
      return n.dirty ? p("save.dirty", n.lang) : p(n.saveState === "saved" ? "save.saved" : "save.clean", n.lang);
  }
}
function xe(n) {
  const t = n.replace(/[\s ]/g, "");
  if (!/^\d+$/.test(t)) return null;
  const e = Number(t);
  return e > 0 ? e : null;
}
function Mr(n) {
  return n.lang, v`
    <div class="top">
      ${n.lead ?? x}
      ${n.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${p("plan.pick")} title=${p("plan.pick")}
          ?disabled=${n.saveState === "saving"} .value=${Y(n.planId)}
          @change=${(t) => {
    const e = t.target, i = e.value;
    e.value = n.planId, i !== n.planId && n.onPickPlan(i);
  }}>
          ${n.plans.map((t) => v`<option value=${t.id} ?selected=${t.id === n.planId}>${t.name}</option>`)}
        </select>` : x}
      <button class="btn" data-action="new-plan" title=${p("plan.new")} aria-label=${p("plan.new")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${p("plan.delete")} aria-label=${p("plan.delete")}
        ?disabled=${n.busy || n.saveState === "saving"} @click=${n.onDeletePlan}>&#128465;</button>
      <input class="plan-name" .value=${Y(n.planName)} aria-label=${p("plan.name")} title=${p("plan.name")}
        @change=${(t) => n.onRename(t.target.value)} />
      <span class="seg mode-tabs">
        ${["plan", "equipment"].map((t) => v`
          <button class="tab ${n.mode === t ? "on" : ""}" data-mode=${t} @click=${() => n.onMode(t)}>
            ${p(`mode.${t}`)}</button>`)}
      </span>
      <span class="sp"></span>
      <button class="btn" title=${p("action.undo")} aria-label=${p("action.undo")} ?disabled=${!n.canUndo}
        @click=${n.onUndo}>↶</button>
      <button class="btn" title=${p("action.redo")} aria-label=${p("action.redo")} ?disabled=${!n.canRedo}
        @click=${n.onRedo}>↷</button>
      <span class="save-state ${n.saveState}" title=${n.saveState === "error" ? n.errorMessage ?? "" : ""}>
        ${Er(n)}${n.saveState === "error" && n.errorMessage ? v`: ${n.errorMessage}` : x}</span>
      <button class="btn primary" data-action="save" ?disabled=${n.saveState === "saving"} @click=${n.onSave}>
        ${p("action.save")}</button>
    </div>`;
}
function Ir(n, t, e, i) {
  return v`
    <div class="tools">
      ${ln(n).map((s) => v`
        ${s === "zone" || s === "ceiling_light" ? v`<div class="tool-sep"></div>` : x}
        <button class="tool ${t === s ? "on" : ""}" data-tool=${s} @click=${() => i(s)}>
          ${p(`tool.${s}`)}</button>`)}
    </div>`;
}
function Ar() {
  return {
    door: { width: se.door, hinge: "start", swing: "left" },
    window: { width: se.window, outside: "left" },
    opening: { width: se.opening },
    zoneName: null
  };
}
function Pr(n, t) {
  return t === "door" ? { ...n.door } : t === "window" ? { ...n.window } : { width: n.opening.width };
}
function Ui(n, t) {
  const e = p("zone.default"), i = new Set(n.zones.map((o) => o.name));
  let s = 1;
  for (; i.has(`${e} ${s}`); ) s++;
  return `${e} ${s}`;
}
const Or = (n) => n === "door" || n === "window" || n === "opening" || n === "zone";
function Pe(n, t, e, i) {
  return v`<select class="val" data-field=${n} @change=${(s) => i(s.target.value)}>
    ${e.map((s) => v`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
const Tt = (n, t) => v`<label class="row"><span>${n}</span>${t}</label>`;
function Nr(n) {
  n.lang;
  const t = n.next;
  if (n.tool === "zone") {
    const r = t.zoneName ?? Ui(n.level);
    return v`
      <h4>${p("props.nextZone")}</h4>
      ${Tt(p("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${Y(r)}
        @change=${(l) => {
      const a = l.target, d = a.value.trim();
      if (!d) {
        a.value = r;
        return;
      }
      d !== r && n.setNext({ ...t, zoneName: d });
    }} />`)}`;
  }
  if (n.tool !== "door" && n.tool !== "window" && n.tool !== "opening") return x;
  const e = n.tool, i = t[e].width, s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = (r) => n.setNext({ ...t, [e]: { ...t[e], ...r } });
  return v`
    <h4>${p(`props.next.${e}`)}</h4>
    ${Tt(`${p("props.width")}, ${p("unit.mm")}`, v`<input class="val" type="text" inputmode="numeric"
      data-field="next-width" .value=${Y(String(i))}
      @change=${(r) => {
    const l = r.target, a = xe(l.value);
    if (a === null) {
      l.value = String(i), n.setNotice(p("props.badWidth"));
      return;
    }
    n.setNotice(null), a !== i && o({ width: a });
  }} />`)}
    ${e === "door" ? v`
      ${Tt(p("props.hinge"), Pe(
    "next-hinge",
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    }
  ))}
      ${Tt(p("props.swing"), Pe("next-swing", t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }))}` : x}
    ${e === "window" ? Tt(p("props.outside"), Pe(
    "next-outside",
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    }
  )) : x}`;
}
class Cr {
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
class Dr {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Ae(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(vn(p("plan.default", this.h.uiLang))), this.offerDraft(this.h.drafts.latest());
        else {
          const e = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === e) ? e : t[0].id);
        }
      } catch (t) {
        this.h.loadError = ee(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const e = await go(this.h.hass, t);
    this.h.drafts.cancel(), this.h.save.reset(e.revision), this.adopt(e), this.h.drafts.setLastPlanId(e.id), this.offerDraft(this.h.drafts.read(e.id));
  }
  offerDraft(t) {
    this.h.pendingDraft = t, this.h.restoreOpen = !!t;
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Ae(this.h.hass);
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
        this.h.switchTo = t;
        return;
      }
      this.switchPlan(t);
    }
  }
  async switchPlan(t) {
    try {
      await this.openPlan(t);
    } catch (e) {
      this.h.notice = ee(e);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    const t = this.h.switchTo;
    this.h.switchTo = null, !(!t || !this.h.plan) && (this.h.drafts.cancel(), this.draftBlocked() || this.h.drafts.clear(this.h.plan.id), this.switchPlan(t));
  }
  busy() {
    return this.h.save.state === "saving" || this.h.deleting;
  }
  requestNewPlan() {
    if (!(!this.h.plan || this.busy())) {
      if (this.h.save.dirty) {
        this.h.newConfirm = !0;
        return;
      }
      this.startNewPlan();
    }
  }
  /** Replaces the open plan with a fresh unsaved one (tool, selection and history are reset by adopt). */
  startNewPlan() {
    this.h.newConfirm = !1, this.h.drafts.cancel(), this.h.plan && !this.draftBlocked() && this.h.drafts.clear(this.h.plan.id), this.openFresh();
  }
  openFresh() {
    this.h.toolId = ln(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(vn(p("plan.default", this.h.uiLang))), this.offerDraft(null);
  }
  requestDelete() {
    !this.h.plan || this.busy() || (this.h.deleteConfirm = !0);
  }
  async confirmDelete() {
    var e;
    this.h.deleteConfirm = !1;
    const t = this.h.plan;
    if (!(!t || !this.h.hass || this.busy())) {
      this.h.deleting = !0;
      try {
        if (this.h.save.baseRevision !== null)
          try {
            await $o(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = ee(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((e = this.h.pendingDraft) == null ? void 0 : e.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ae(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = ee(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    const e = Array.isArray(t.levels) && t.levels.length > 0 ? t : {
      ...t,
      levels: [{ id: X(), name: "Level 1", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] }]
    };
    this.h.plan = { ...e, levels: e.levels.map($s) }, this.h.history = new Cr(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = Be(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.needFit = !0;
  }
  makeDraft() {
    return { planId: this.h.plan.id, baseRevision: this.h.save.baseRevision, plan: this.currentPlan(), savedAt: Date.now() };
  }
  /** True while an undecided draft of the open plan must not be overwritten. */
  draftBlocked() {
    return !!this.h.pendingDraft && !!this.h.plan && this.h.pendingDraft.planId === this.h.plan.id;
  }
  restoreDraft(t) {
    this.h.pendingDraft = null, this.h.restoreOpen = !1, this.adopt(t.plan), this.h.save.baseRevision = t.baseRevision, this.h.save.markDirty();
  }
  discardDraft(t) {
    this.h.pendingDraft = null, this.h.restoreOpen = !1, this.h.drafts.clear(t.planId), this.h.save.dirty && this.h.plan && this.h.drafts.schedule(() => this.makeDraft());
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
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.save(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = "conflict"));
  }
  async doOverwrite() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.overwrite(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? "conflict-again" : "none");
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const t = `${this.h.plan.name} ${p("plan.copySuffix", this.h.uiLang)}`, e = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = "none", this.afterSaved(e, i.id)) : this.h.save.state === "error" && (this.h.dialog = "none");
  }
}
const Jn = { id: "", name: "", kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
function zr(n) {
  return {
    level: () => {
      var t;
      return ((t = n.history) == null ? void 0 : t.current) ?? Jn;
    },
    commit: (t) => n.commit(t),
    tolMm: () => 10 / n.view.scale,
    grid: () => n.grid ? 100 : null,
    wallProps: () => ({ type: n.wallType, thickness: n.thickness, baseline: "center" }),
    boxMeasure: () => n.boxMeasure,
    select: (t) => {
      n.selection = t, n.notice = null;
    },
    lang: () => n.uiLang,
    deviceDefaults: (t) => n.nextProps[t],
    openingDefaults: (t) => Pr(n.nextObj, t),
    zoneName: () => {
      var t;
      return n.nextObj.zoneName ?? Ui(((t = n.history) == null ? void 0 : t.current) ?? Jn, n.uiLang);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      n.nextObj = { ...n.nextObj, zoneName: null };
    }
  };
}
const Bi = Object.keys(Ye), Rr = (n) => Bi.includes(n);
function Lr() {
  return Object.fromEntries(Bi.map((n) => [n, Vt(n, "free")]));
}
const Tr = {
  mm: "props.badNumber",
  angle: "props.badAngle",
  rotation: "props.badRotation",
  offset: "props.badOffset",
  aim: "props.badAim"
};
function ji(n, t) {
  if (t === "mm" || t === "angle") {
    const s = xe(n);
    return s === null || t === "angle" && s > 360 ? null : s;
  }
  const e = n.replace(/[\s ]/g, "");
  if (t === "aim") {
    const o = /^[-−]?\d+$/.exec(e) ? Number(e.replace("−", "-")) : NaN;
    return Number.isNaN(o) || Math.abs(o) > Oe ? null : o;
  }
  if (!/^\d+$/.test(e)) return null;
  const i = Number(e);
  return t === "rotation" && i > 359 ? null : i;
}
function G(n, t) {
  return v`<label class="row"><span>${n}</span>${t}</label>`;
}
function re(n, t, e, i, s, o) {
  return v`<select class="val" data-field=${n} .value=${Y(t)} @change=${(r) => {
    const l = r.target;
    o(l.value) === !1 && (l.value = t);
  }}>
    ${e.map((r) => v`<option value=${r} ?selected=${r === t}>${p(`${i}.${r}`)}</option>`)}
  </select>`;
}
function Ht(n, t, e, i, s) {
  const o = String(Math.round(e));
  return v`<input class="val" type="text" inputmode="numeric" data-field=${t} .value=${Y(o)}
    @change=${(r) => {
    var d, f, c, u;
    const l = r.target, a = ji(l.value, i);
    if (a === null) {
      l.value = o, (d = n.onNotice) == null || d.call(n, p(Tr[i], n.lang));
      return;
    }
    if (a === e) {
      (f = n.onNotice) == null || f.call(n, null);
      return;
    }
    if (!s(a)) {
      l.value = o, (c = n.onNotice) == null || c.call(n, p("props.noFit", n.lang));
      return;
    }
    (u = n.onNotice) == null || u.call(n, null);
  }} />`;
}
function Fi(n, t, e, i) {
  const s = n.lang, o = (l, a, d) => G(`${p(a)}, ${p("unit.mm")}`, Ht(n, e + l, d, "mm", (f) => i({ [l]: f }))), r = (l, a, d) => G(`${p(a)}, ${p("unit.deg")}`, Ht(n, e + l, d, "angle", (f) => i({ [l]: f })));
  switch (t.kind) {
    case "ceiling_light": {
      const l = t.poolRadius === null ? "" : String(t.poolRadius);
      return v`
        ${G(p("props.shape"), re(`${e}shape`, t.shape, ["round", "linear", "spot"], "shape", s, (a) => i({ shape: a })))}
        ${t.shape === "linear" ? v`${o("length", "props.length", t.length)}${o("width", "props.width", t.width)}` : o("diameter", "props.diameter", t.diameter)}
        ${G(`${p("props.poolRadius")}, ${p("unit.mm")}`, v`<input class="val" type="text" inputmode="numeric"
          data-field=${`${e}poolRadius`} placeholder=${p("props.poolHint")} title=${p("props.poolHint")}
          .value=${Y(l)} @change=${(a) => {
        var c, u, h, m, g, $;
        const d = a.target;
        if (d.value.trim() === "") {
          if (t.poolRadius === null) {
            (c = n.onNotice) == null || c.call(n, null);
            return;
          }
          i({ poolRadius: null }) && ((u = n.onNotice) == null || u.call(n, null));
          return;
        }
        const f = ji(d.value, "mm");
        if (f === null) {
          d.value = l, (h = n.onNotice) == null || h.call(n, p("props.badNumber"));
          return;
        }
        if (f === t.poolRadius) {
          (m = n.onNotice) == null || m.call(n, null);
          return;
        }
        if (!i({ poolRadius: f })) {
          d.value = l, (g = n.onNotice) == null || g.call(n, p("props.noFit"));
          return;
        }
        ($ = n.onNotice) == null || $.call(n, null);
      }} />`)}`;
    }
    case "wall_light":
      return v`${r("coneAngle", "props.coneAngle", t.coneAngle)}${o("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return v`${r("zoneAngle", "props.zoneAngle", t.zoneAngle)}${o("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return G(`${p("props.diameter")}, ${p("unit.mm")}`, v`<select class="val" data-field=${`${e}diameter`}
        .value=${Y(String(t.diameter))} @change=${(l) => {
        const a = l.target, d = Number(a.value);
        d !== t.diameter && !i({ diameter: d }) && (a.value = String(t.diameter));
      }}>
        ${gs.map((l) => v`<option value=${String(l)} ?selected=${l === t.diameter}>${l}</option>`)}
      </select>`);
    case "climate_sensor":
      return e === "" && n.device && n.level ? Br(n, n.level, n.device, t.zoneIds, i) : Ur();
    case "equipment":
      return v`
        ${G(p("props.shape"), re(`${e}shape`, t.shape, ["rect", "circle"], "shape", s, (l) => i({ shape: l })))}
        ${t.shape === "rect" ? v`${o("width", "props.width", t.width)}${o("depth", "props.depth", t.depth)}` : o("diameter", "props.diameter", t.diameter)}
        ${G(p("props.symbol"), re(
        `${e}symbol`,
        t.symbol,
        ["boiler", "pc", "automation", "other"],
        "symbol",
        s,
        (l) => i({ symbol: l })
      ))}
        ${G(p("props.label"), v`<input class="val wide" type="text" data-field=${`${e}label`} .value=${Y(t.label)}
          @change=${(l) => {
        const a = l.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return v`<p class="muted">${p("props.noSettings")}</p>`;
  }
}
const Ur = () => v`${x}`;
function Br(n, t, e, i, s) {
  var r;
  n.lang;
  const o = i.length === 0 ? (r = t.zones.find((l) => l.id === _o(t, e))) == null ? void 0 : r.name : void 0;
  return v`<fieldset class="zones" data-field="zoneIds"><legend>${p("props.zones")}${i.length === 0 ? v` (${p("props.zonesAuto")}${o ? `: ${o}` : ""})` : x}</legend>
    ${t.zones.map((l) => v`<label class="row"><input type="checkbox" data-zone=${l.id} .checked=${i.includes(l.id)}
      @change=${(a) => {
    const d = a.target.checked, f = t.zones.map((c) => c.id).filter((c) => c === l.id ? d : i.includes(c));
    s({ zoneIds: f }) || (a.target.checked = !d);
  }} /><span>${l.name}</span></label>`)}
  </fieldset>`;
}
function jr(n, t) {
  const e = n.lang, i = t.placement;
  if (i.mode === "free")
    return G(
      `${p("props.rotation")}, ${p("unit.deg")}`,
      Ht(n, "rotation", i.rotation, "rotation", (o) => n.onPlacement({ ...i, rotation: o }))
    );
  const s = t.props.kind === "wall_light" || t.props.kind === "motion_sensor" || t.props.kind === "illuminance_sensor";
  return v`
    ${G(p("props.side"), re("side", i.side, ["left", "right"], "side", e, (o) => n.onPlacement({ ...i, side: o })))}
    ${G(`${p("props.offset")}, ${p("unit.mm")}`, Ht(
    n,
    "offset",
    i.offset,
    "offset",
    (o) => n.onPlacement({ ...i, offset: o })
  ))}
    ${s ? G(
    `${p("props.aim")}, ${p("unit.deg")}`,
    Ht(n, "aim", i.aim ?? 0, "aim", (o) => n.onPlacement(Pi(i, o)))
  ) : x}`;
}
function Fr(n, t) {
  return n.lang, v`
    <h4>${p(`device.${t.props.kind}`)}</h4>
    ${G(p("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${Y(t.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && n.onDevice({}, s);
  }} />`)}
    ${Fi(n, t.props, "", (e) => n.onDevice(e))}
    ${jr(n, t)}
    ${t.invalid ? v`<p class="warn">${p("props.invalidDevice")}</p>` : x}
    <button class="btn danger" data-action="delete-device" @click=${() => n.onDelete()}>${p("action.delete")}</button>`;
}
function Hr(n) {
  return n.device ? Fr(n, n.device) : n.nextKind && n.nextProps ? v`
      <h4>${p("props.nextDevice", n.lang)}: ${p(`device.${n.nextKind}`, n.lang)}</h4>
      ${Fi(n, n.nextProps, "next-", (t) => (n.onNext(t), !0))}` : v`<p class="muted">${p("props.none", n.lang)}</p>`;
}
function qr(n) {
  const { level: t, selection: e } = n, i = (e == null ? void 0 : e.kind) === "device" ? t.devices.find((r) => r.id === e.id) ?? null : null, s = Rr(n.toolId) ? n.toolId : null, o = (r) => r === t ? (n.setNotice(p("props.noFit", n.lang)), !1) : (n.setNotice(null), n.commit(r), !0);
  return v`<div class="props">
    ${Hr({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? n.nextProps[s] : null,
    lang: n.lang,
    onDevice: (r, l) => !!i && o(ws(t, i.id, r, l)),
    onPlacement: (r) => !!i && o(Ze(t, i.id, r)),
    onNext: (r) => {
      s && n.setNextProps({ ...n.nextProps, [s]: { ...n.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && n.remove(Xe(t, i.id));
    },
    onNotice: (r) => n.setNotice(r)
  })}
    ${n.notice ? v`<p class="warn">${n.notice}</p>` : x}
  </div>`;
}
const je = ["door", "gate", "wicket"];
function Wr(n, t) {
  return je.includes(t) ? { kind: t, hinge: n.hinge ?? "start", swing: n.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: n.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function Kr(n, t, e) {
  const i = io(n, t, e), s = Object.keys(e).filter((o) => e[o] === void 0);
  return s.length === 0 ? i : {
    ...i,
    openings: i.openings.map((o) => {
      if (o.id !== t) return o;
      const r = { ...o };
      for (const l of s) delete r[l];
      return r;
    })
  };
}
function H(n, t) {
  return v`<label class="row"><span>${n}</span>${t}</label>`;
}
function Et(n, t, e, i) {
  return v`<select class="val" data-field=${i ?? x} @change=${(s) => e(s.target.value)}>
    ${t.map((s) => v`<option value=${s.v} ?selected=${s.v === n}>${s.label}</option>`)}
  </select>`;
}
function Hi(n, t, e, i) {
  return v`<input class="val" type="text" inputmode="numeric" .value=${Y(String(Math.round(n)))}
    @change=${(s) => {
    const o = s.target, r = xe(o.value);
    r === null || !t(r) ? (o.value = String(Math.round(n)), e.setNotice(p(r === null ? i : "props.noFit", e.lang))) : e.setNotice(null);
  }} />`;
}
function Vr(n, t) {
  t.lang;
  const e = et(t.level, n).len, i = ["bearing", "partition", "railing", ...n.type === "fence" ? ["fence"] : []], s = (o) => t.commit(po(t.level, n.id, o));
  return v`
    <h4>${p("props.wall")}</h4>
    ${H(p("props.type"), Et(
    n.type,
    i.map((o) => ({ v: o, label: p(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${H(p("props.thickness"), Hi(n.thickness, (o) => (s({ thickness: o }), !0), t, "props.badWidth"))}
    ${H(p("props.baseline"), Et(
    n.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: p(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${H(p("props.length"), v`<span class="val ro">${vt(e)} ${p("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.remove(rn(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function Yr(n, t) {
  t.lang;
  const e = ["door", "window", "opening", ...je.slice(1).includes(n.kind) ? [n.kind] : []], i = (r) => t.commit(Kr(t.level, n.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = je.includes(n.kind);
  return v`
    <h4>${p(`kind.${n.kind}`)}</h4>
    ${H(p("props.kind"), Et(n.kind, e.map((r) => ({ v: r, label: p(`kind.${r}`) })), (r) => i(Wr(n, r))))}
    ${H(p("props.width"), Hi(n.width, (r) => {
    const l = no(t.level, n.id, r);
    return l === t.level ? !1 : (t.commit(l), !0);
  }, t, "props.badWidth"))}
    ${H(p("props.offset"), v`<input class="val" type="text" inputmode="numeric" .value=${Y(String(Math.round(n.offset)))}
      @change=${(r) => {
    const l = r.target, a = l.value.replace(/[\s ]/g, ""), d = /^\d+$/.test(a) ? ki(t.level, n.id, Number(a)) : t.level;
    if (d === t.level) {
      l.value = String(Math.round(n.offset)), t.setNotice(p("props.noFit"));
      return;
    }
    t.setNotice(null), t.commit(d);
  }} />`)}
    ${o ? v`
      ${H(p("props.hinge"), Et(
    n.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${H(p("props.swing"), Et(n.swing ?? "left", s, (r) => i({ swing: r })))}` : x}
    ${n.kind === "window" ? H(p("props.outside"), Et(n.outside ?? "left", s, (r) => i({ outside: r }))) : x}
    ${n.invalid ? v`<p class="warn">${p("props.invalidOpening")}</p>` : x}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.remove(nn(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function Gr(n, t) {
  return t.lang, v`
    <h4>${p("props.zone")}</h4>
    ${H(p("props.name"), v`<input class="val wide" type="text" .value=${Y(n.name)}
      @change=${(e) => {
    const i = e.target, s = i.value.trim();
    if (!s) {
      i.value = n.name;
      return;
    }
    s !== n.name && t.commit(eo(t.level, n.id, s));
  }} />`)}
    ${H(p("props.area"), v`<span class="val ro">${Ni(wi(n.outline))}</span>`)}
    ${n.broken ? v`<p class="warn">${p("props.broken")}</p>` : x}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.remove(tn(t.level, n.id))}>
      ${p("action.delete")}</button>`;
}
function Zr(n) {
  n.lang;
  const t = ["bearing", "partition", "railing"];
  return v`
    <h4>${p("props.newWall")}</h4>
    ${H(p("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(e) => n.setWallType(e.target.value)}>
      ${t.map((e) => v`<option value=${e} ?selected=${e === n.wallType}>${p(`walltype.${e}`)}</option>`)}
    </select>`)}
    ${H(`${p("props.thickness")}, ${p("unit.mm")}`, v`<input class="val" type="text" inputmode="numeric"
      data-field="new-wall-thickness" .value=${Y(String(n.thickness))}
      @change=${(e) => {
    const i = e.target, s = xe(i.value);
    if (s === null) {
      i.value = String(n.thickness), n.setNotice(p("props.badWidth"));
      return;
    }
    n.setNotice(null), n.setThickness(s);
  }} />`)}
    ${n.tool === "box" ? v`
      <div class="muted">${p("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((e) => v`
          <button class="tab ${n.boxMeasure === e ? "on" : ""}" data-measure=${e} @click=${() => n.setBoxMeasure(e)}>
            ${p(`measure.${e}`)}</button>`)}
      </div>` : x}`;
}
function Xr(n) {
  const { level: t, selection: e } = n;
  let i = x;
  if ((e == null ? void 0 : e.kind) === "wall") {
    const s = t.walls.find((o) => o.id === e.id);
    s && (i = Vr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "opening") {
    const s = t.openings.find((o) => o.id === e.id);
    s && (i = Yr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "zone") {
    const s = t.zones.find((o) => o.id === e.id);
    s && (i = Gr(s, n));
  } else if ((e == null ? void 0 : e.kind) === "node") {
    const s = t.nodes.find((o) => o.id === e.id);
    s && (i = v`<h4>${p("props.node", n.lang)}</h4>
      ${H("X", v`<span class="val ro">${vt(s.x)}</span>`)}${H("Y", v`<span class="val ro">${vt(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === x && (n.tool === "wall" || n.tool === "box") ? Zr(n) : i === x && Or(n.tool) ? Nr({ tool: n.tool, level: t, next: n.next, lang: n.lang, setNext: n.setNext, setNotice: n.setNotice }) : i === x ? v`<p class="muted">${p("props.none", n.lang)}</p>` : i}
      ${n.notice ? v`<p class="warn">${n.notice}</p>` : x}
    </div>`;
}
function Qr(n, t) {
  const e = {
    level: t,
    selection: n.selection,
    lang: n.uiLang,
    notice: n.notice,
    commit: (i) => n.commit(i),
    remove: (i) => n.commitRemoval(i),
    setNotice: (i) => {
      n.notice = i;
    }
  };
  return n.mode === "equipment" ? qr({ ...e, toolId: n.toolId, nextProps: n.nextProps, setNextProps: (i) => {
    n.nextProps = i;
  } }) : Xr({
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
function Jr(n) {
  return n.lang, v`
    <div class="status">
      <span><span class="kbd">Shift</span> ${p("hint.shift")}</span>
      <span><span class="kbd">${p("hint.digits")}</span> ${p("hint.length")}</span>
      <span><span class="kbd">Tab</span> ${p("hint.tab")}</span>
      <span><span class="kbd">Esc</span> ${p("hint.esc")}</span>
      <span class="sp"></span>
      ${n.snap ? v`<span class="snap-kind">${n.snap}</span>` : ""}
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
function tl(n, t) {
  var o, r;
  const e = t.palette, i = 1 / t.scale, s = [
    {
      label: p(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: n.length,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: n.field === "length",
      unit: p("unit.mm")
    },
    {
      label: p(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: n.angle,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: n.field === "angle",
      unit: t.mode === "box" ? p("unit.mm") : "°"
    }
  ];
  return E`
    <g class="tracker" transform=${`translate(${n.at.x + 18 * i} ${n.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${e.input} stroke=${e.inputBorder}></rect>
      ${s.map((l, a) => E`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${e.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${e.background}
          stroke=${l.active ? e.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? e.text : e.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function el(n, t, e, i) {
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
function nl(n) {
  return Object.entries(n).filter(([, t]) => typeof t == "string").map(([t, e]) => `--ps-${t}:${e}`).join(";");
}
const il = Gi`
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
`, sl = 5e-3, ol = 2, Fe = (n) => Math.max(sl, Math.min(ol, n));
function rl(n, t, e) {
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
function ll(n, t, e) {
  if (n.length === 0) return { x: -1e3, y: -1e3, scale: Fe(Math.min(t, e) / 12e3) };
  const i = n.map((c) => c.x), s = n.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, f = Fe(Math.min(t / (l - r), e / (d - a)));
  return { x: (r + l) / 2 - t / f / 2, y: (a + d) / 2 - e / f / 2, scale: f };
}
function al(n, t, e) {
  const i = Fe(n.scale * Math.exp(-e * 15e-4));
  return { x: t.x - (t.x - n.x) * n.scale / i, y: t.y - (t.y - n.y) * n.scale / i, scale: i };
}
function cl(n, t, e) {
  return { ...n, x: n.x - t / n.scale, y: n.y - e / n.scale };
}
function dl(n, t, e, i) {
  const s = 100 * n.scale >= 6 ? 100 : 1e3, o = 1 / n.scale;
  return E`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${o}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${o}></path></pattern>
    </defs>
    <rect x=${n.x} y=${n.y} width=${t} height=${e} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const hl = ["Shift", "Control", "Alt", "Meta"];
function ti(n) {
  const t = n.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class ul {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (e) => {
      var s, o;
      this.h.focus();
      const i = e.currentTarget;
      if (e.button === 1 || e.button === 0 && this.spaceDown) {
        e.preventDefault(), this.spacePending = !1, this.panFrom = { x: e.clientX, y: e.clientY }, (s = i.setPointerCapture) == null || s.call(i, e.pointerId);
        return;
      }
      e.button === 0 && ((o = i.setPointerCapture) == null || o.call(i, e.pointerId), this.pointerActive = !0, this.h.tool().down(this.toolEvent(e)), this.h.update());
    }, this.pointerMove = (e) => {
      if (this.panFrom) {
        this.h.view = cl(this.h.view, e.clientX - this.panFrom.x, e.clientY - this.panFrom.y), this.panFrom = { x: e.clientX, y: e.clientY };
        return;
      }
      this.h.tool().move(this.toolEvent(e)), this.h.update();
    }, this.pointerUp = (e) => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      e.button !== 0 || !this.pointerActive || (this.pointerActive = !1, this.h.tool().up(this.toolEvent(e)), this.h.update());
    }, this.pointerAbort = () => {
      if (this.panFrom) {
        this.panFrom = null;
        return;
      }
      this.pointerActive && (this.pointerActive = !1, this.h.tool().preview().level && this.h.tool().cancel(), this.h.update());
    }, this.wheel = (e) => {
      e.preventDefault(), this.h.view = al(this.h.view, this.h.toMm(e), e.deltaY);
    }, this.keyDown = (e) => {
      if (this.h.modal()) {
        e.key === "Escape" && (e.preventDefault(), this.h.closeModal());
        return;
      }
      if (ti(e) || !this.h.ready()) return;
      const i = e.ctrlKey || e.metaKey, s = e.code === "KeyZ" ? "z" : e.code === "KeyY" ? "y" : e.code === "KeyS" ? "s" : e.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        e.preventDefault(), s === "z" && !e.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && s === "s") {
        e.preventDefault(), this.h.save();
        return;
      }
      if (e.key === " ") {
        e.preventDefault(), !e.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      let o = this.h.tool().key(e.key, { shift: e.shiftKey, ctrl: i });
      !o && e.key === "Delete" && (o = this.h.deleteSelection()), !o && e.key === "Escape" && (this.h.clearSelection(), o = !0), o && e.preventDefault(), this.h.update();
    }, this.keyUp = (e) => {
      const i = this.h.modal() || ti(e), s = { shift: e.shiftKey, ctrl: e.ctrlKey || e.metaKey };
      if (e.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.tool().key(" ", s), this.h.update());
        return;
      }
      i || !hl.includes(e.key) || (this.h.tool().key(e.key, s), this.h.update());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function fl(n) {
  return {
    tool: () => n.activeTool,
    get view() {
      return n.view;
    },
    set view(t) {
      n.view = t;
    },
    ready: () => !!n.history,
    modal: () => n.restoreOpen || n.dialog !== "none" || n.switchTo !== null || n.newConfirm || n.deleteConfirm,
    // Escape on the restore prompt = decide later: the draft is kept and a banner keeps offering it.
    closeModal: () => {
      n.restoreOpen = !1, n.dialog = "none", n.switchTo = null, n.newConfirm = !1, n.deleteConfirm = !1;
    },
    toMm: (t) => n.toMm(t),
    focus: () => n.focus(),
    update: () => n.requestUpdate(),
    undo: () => n.undo(),
    redo: () => n.redo(),
    save: () => {
      n.doSave();
    },
    deleteSelection: () => n.deleteSelection(),
    clearSelection: () => {
      n.activeTool.cancel(), n.selection = null;
    }
  };
}
function pl(n) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${p("conflict.title")}</h3>
        <p>${p(n.mode === "conflict" ? "conflict.text" : "conflict.again")}</p>
        ${n.message ? v`<p class="muted">${n.message}</p>` : x}
        <div class="actions">
          ${n.mode === "conflict" ? v`<button class="btn" data-action="overwrite" ?disabled=${n.busy}
            @click=${n.onOverwrite}>${p("conflict.overwrite")}</button>` : x}
          <button class="btn primary" data-action="save-as-new" ?disabled=${n.busy}
            @click=${n.onSaveAsNew}>${p("conflict.saveAsNew")}</button>
          <button class="btn" data-action="cancel" @click=${n.onCancel}>${p("conflict.cancel")}</button>
        </div>
      </div>
    </div>`;
}
function qi(n, t) {
  try {
    return new Date(n).toLocaleString(t);
  } catch {
    return new Date(n).toISOString();
  }
}
function gl(n) {
  const t = n.lang, e = qi(n.savedAt, t);
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${p("draft.title")}</h3>
        <p>${p("draft.text").replace("{time}", e)}</p>
        <div class="actions">
          <button class="btn primary" data-action="restore" @click=${n.onRestore}>${p("draft.restore")}</button>
          <button class="btn" data-action="discard" @click=${n.onDiscard}>${p("draft.discard")}</button>
        </div>
      </div>
    </div>`;
}
function ml(n) {
  const t = n.lang;
  return v`
    <div class="draft-banner" role="status">
      <span>${p("draft.banner").replace("{time}", qi(n.savedAt, t))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${n.onRestore}>${p("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${n.onDiscard}>${p("draft.discard")}</button>
    </div>`;
}
function $l(n) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${p("switch.title")}</h3>
        <p>${p("switch.text")}</p>
        <div class="actions">
          <button class="btn primary" data-action="switch-discard" @click=${n.onDiscard}>${p("switch.discard")}</button>
          <button class="btn" data-action="switch-cancel" @click=${n.onCancel}>${p("switch.cancel")}</button>
        </div>
      </div>
    </div>`;
}
function yl(n) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${p("new.title")}</h3>
        <p>${p("new.text")}</p>
        <div class="actions">
          <button class="btn primary" data-action="new-discard" @click=${n.onDiscard}>${p("new.discard")}</button>
          <button class="btn" data-action="new-cancel" @click=${n.onCancel}>${p("new.cancel")}</button>
        </div>
      </div>
    </div>`;
}
function wl(n) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${p("delete.title")}</h3>
        <p>${p("delete.text").replace("{name}", n.name)}</p>
        <div class="actions">
          <button class="btn primary" data-action="delete-confirm" @click=${n.onDelete}>${p("delete.confirm")}</button>
          <button class="btn" data-action="delete-cancel" @click=${n.onCancel}>${p("delete.cancel")}</button>
        </div>
      </div>
    </div>`;
}
function vl(n) {
  const t = n.lang, e = n.draft;
  return e && n.restoreOpen ? gl({ lang: t, savedAt: e.savedAt, onRestore: () => n.restore(e), onDiscard: () => n.discard(e) }) : n.newConfirm ? yl({ onDiscard: n.startNew, onCancel: n.cancelNew }) : n.deleteConfirm ? wl({ name: n.planName, onDelete: n.confirmDelete, onCancel: n.cancelDelete }) : n.switchTo ? $l({ onDiscard: n.confirmSwitch, onCancel: n.cancelSwitch }) : n.dialog === "none" ? x : pl({
    mode: n.dialog === "conflict" ? "conflict" : "again",
    busy: n.saving,
    message: n.message,
    onOverwrite: n.overwrite,
    onSaveAsNew: n.saveAsNew,
    onCancel: n.cancelConflict
  });
}
const Ut = "plan_studio.draft.", ne = "plan_studio.lastPlanId";
function xl() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function bl(n) {
  const t = n;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class kl {
  constructor(t = xl, e = 500) {
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
      (e = this.storage()) == null || e.setItem(Ut + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var e;
    try {
      const i = (e = this.storage()) == null ? void 0 : e.getItem(Ut + t), s = i ? JSON.parse(i) : null;
      return bl(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(Ut))) continue;
        const o = this.read(s.slice(Ut.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(ne)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var e;
    try {
      (e = this.storage()) == null || e.setItem(ne, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const e = this.storage();
      (e == null ? void 0 : e.getItem(ne)) === t && e.removeItem(ne);
    } catch {
    }
  }
  clear(t) {
    var e;
    try {
      (e = this.storage()) == null || e.removeItem(Ut + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
var _l = Object.defineProperty, z = (n, t, e, i) => {
  for (var s = void 0, o = n.length - 1, r; o >= 0; o--)
    (r = n[o]) && (s = r(t, e, s) || s);
  return s && _l(t, e, s), s;
};
const an = class an extends Ft {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = ms.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.cones = !0, this.nextProps = Lr(), this.nextObj = Ar(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = "none", this.notice = null, this.pendingDraft = null, this.restoreOpen = !1, this.plans = [], this.switchTo = null, this.newConfirm = !1, this.deleteConfirm = !1, this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new kl(), this.resizeObs = null, this.session = new Dr(this), this.onBeforeUnload = (s) => {
      this.drafts.flush(), this.save.dirty && (s.preventDefault(), s.returnValue = "");
    }, this.onPageHide = () => {
      this.drafts.flush();
    }, this.refocus = (s) => {
      const o = s.composedPath()[0];
      o instanceof Element && o.closest("button") && this.focus();
    }, this.refocusAfterChange = (s) => {
      const o = s.composedPath()[0];
      (o instanceof HTMLInputElement || o instanceof HTMLSelectElement) && (o.blur(), this.focus());
    };
    const t = this, e = {
      get connection() {
        return t.hass.connection;
      },
      get language() {
        return t.uiLang;
      },
      get themes() {
        var s;
        return (s = t.hass) == null ? void 0 : s.themes;
      }
    };
    this.save = new vo(e, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = zr(this), this.activeTool = Be("select", this.ctx);
    const i = fl(this);
    this.input = new ul(i);
  }
  load() {
    return this.session.load();
  }
  doSave() {
    return this.session.doSave();
  }
  get uiLang() {
    var t;
    return ((t = this.hass) == null ? void 0 : t.language) ?? "en";
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
  // ---- new / delete ----
  // ---- local draft ----
  // ---- editing ----
  commit(t) {
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !Qn(t, this.selection) && (this.activeTool.cancel(), this.selection = null), this.requestUpdate());
  }
  /** Commit from outside the tool that removes the selected element. */
  commitRemoval(t) {
    this.activeTool.cancel(), this.selection = null, this.commit(t);
  }
  deleteSelection() {
    var i;
    const t = this.selection, e = (i = this.history) == null ? void 0 : i.current;
    return !t || !e || t.kind === "node" || !Qn(e, t) ? !1 : (this.commitRemoval(t.kind === "wall" ? rn(e, t.id) : t.kind === "opening" ? nn(e, t.id) : t.kind === "device" ? Xe(e, t.id) : tn(e, t.id)), !0);
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
    this.activeTool.cancel(), this.selection = null, this.notice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = Be(t, this.ctx);
  }
  /** Plan / Equipment tab: cancels the tool, clears the selection, activates the tab's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(ln(t)[0]));
  }
  // ---- saving ----
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return rl(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = ll(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return vl({
      lang: this.uiLang,
      draft: this.pendingDraft,
      restoreOpen: this.restoreOpen,
      newConfirm: this.newConfirm,
      deleteConfirm: this.deleteConfirm,
      switchTo: this.switchTo,
      dialog: this.dialog,
      planName: ((t = this.plan) == null ? void 0 : t.name) ?? "",
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (e) => this.session.restoreDraft(e),
      discard: (e) => this.session.discardDraft(e),
      startNew: () => this.session.startNewPlan(),
      cancelNew: () => {
        this.newConfirm = !1;
      },
      confirmDelete: () => {
        this.session.confirmDelete();
      },
      cancelDelete: () => {
        this.deleteConfirm = !1;
      },
      confirmSwitch: () => this.session.confirmSwitch(),
      cancelSwitch: () => {
        this.switchTo = null;
      },
      overwrite: () => this.session.doOverwrite(),
      saveAsNew: () => this.session.doSaveAsNew(),
      cancelConflict: () => {
        this.dialog = "none";
      }
    });
  }
  render() {
    var c, u;
    const t = this.uiLang;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${p("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${p("action.retry")}</button>` : p("load.loading")}</div>`;
    const e = Fo(!!((u = (c = this.hass) == null ? void 0 : c.themes) != null && u.darkMode)), i = this.history.current, s = this.activeTool.preview(), { x: o, y: r, scale: l } = this.view, a = Math.max(1, this.size.w) / l, d = Math.max(1, this.size.h) / l, f = this.save;
    return v`
      <div class="ed" style=${nl(e)} @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Mr({
      lang: t,
      mode: this.mode,
      onMode: (h) => this.setMode(h),
      planName: this.plan.name,
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: f.state,
      dirty: f.dirty,
      errorMessage: f.errorMessage,
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : x,
      onRename: (h) => {
        this.plan = { ...this.plan, name: h }, f.markDirty();
      },
      onPickPlan: (h) => this.session.pickPlan(h),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Ir(this.mode, this.toolId, t, (h) => this.pickTool(h))}
        ${Qr(this, i)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${o} ${r} ${a} ${d}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(h) => h.preventDefault()}>
            ${this.grid ? dl(this.view, a, d, e) : x}
            ${nr(i, { palette: e, selection: this.selection, preview: s, scale: l, lang: t, mode: this.mode, showCones: this.cones })}
            ${s.tracker ? tl(s.tracker, {
      palette: e,
      scale: l,
      mode: this.toolId === "box" ? "box" : "wall",
      live: el(s, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : x}
          </svg>
          ${this.pendingDraft && !this.restoreOpen ? ml({
      lang: t,
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : x}
        </div>
        ${Jr({
      lang: t,
      grid: this.grid,
      zoomPct: Math.round(l * 1e3),
      snap: s.snap && s.snap.kind !== "none" ? p(`snap.${s.snap.kind}`) : null,
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
an.styles = il;
let C = an;
z([
  me({ attribute: !1 })
], C.prototype, "hass");
z([
  me({ type: Boolean })
], C.prototype, "narrow");
z([
  me({ attribute: !1 })
], C.prototype, "panel");
z([
  R()
], C.prototype, "plan");
z([
  R()
], C.prototype, "loadError");
z([
  R()
], C.prototype, "selection");
z([
  R()
], C.prototype, "toolId");
z([
  R()
], C.prototype, "wallType");
z([
  R()
], C.prototype, "thickness");
z([
  R()
], C.prototype, "boxMeasure");
z([
  R()
], C.prototype, "grid");
z([
  R()
], C.prototype, "mode");
z([
  R()
], C.prototype, "cones");
z([
  R()
], C.prototype, "nextProps");
z([
  R()
], C.prototype, "nextObj");
z([
  R()
], C.prototype, "view");
z([
  R()
], C.prototype, "size");
z([
  R()
], C.prototype, "dialog");
z([
  R()
], C.prototype, "notice");
z([
  R()
], C.prototype, "pendingDraft");
z([
  R()
], C.prototype, "restoreOpen");
z([
  R()
], C.prototype, "plans");
z([
  R()
], C.prototype, "switchTo");
z([
  R()
], C.prototype, "newConfirm");
z([
  R()
], C.prototype, "deleteConfirm");
z([
  R()
], C.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", C);
export {
  C as PlanStudioPanel
};
