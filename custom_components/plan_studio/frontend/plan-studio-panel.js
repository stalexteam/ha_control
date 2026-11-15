/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pe = globalThis, dn = pe.ShadowRoot && (pe.ShadyCSS === void 0 || pe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, un = Symbol(), Nn = /* @__PURE__ */ new WeakMap();
let Ci = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== un) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (dn && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = Nn.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Nn.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Js = (e) => new Ci(typeof e == "string" ? e : e + "", void 0, un), Ni = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new Ci(n, e, un);
}, to = (e, t) => {
  if (dn) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = pe.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, Ln = dn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return Js(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: eo, defineProperty: no, getOwnPropertyDescriptor: io, getOwnPropertyNames: so, getOwnPropertySymbols: oo, getPrototypeOf: ro } = Object, pt = globalThis, Dn = pt.trustedTypes, ao = Dn ? Dn.emptyScript : "", ze = pt.reactiveElementPolyfillSupport, Xt = (e, t) => e, me = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ao : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let n = e;
  switch (t) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, hn = (e, t) => !eo(e, t), Tn = { attribute: !0, type: String, converter: me, reflect: !1, useDefault: !1, hasChanged: hn };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), pt.litPropertyMetadata ?? (pt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Pt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Tn) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && no(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = io(this.prototype, t) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: s, set(r) {
      const a = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, a, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Tn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Xt("elementProperties"))) return;
    const t = ro(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Xt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Xt("properties"))) {
      const n = this.properties, i = [...so(n), ...oo(n)];
      for (const s of i) this.createProperty(s, n[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0) for (const [i, s] of n) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const s = this._$Eu(n, i);
      s !== void 0 && this._$Eh.set(s, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) n.unshift(Ln(s));
    } else t !== void 0 && n.push(Ln(t));
    return n;
  }
  static _$Eu(t, n) {
    const i = n.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((n) => this.enableUpdating = n), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((n) => n(this));
  }
  addController(t) {
    var n;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((n = t.hostConnected) == null || n.call(t));
  }
  removeController(t) {
    var n;
    (n = this._$EO) == null || n.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const i of n.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return to(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostConnected) == null ? void 0 : i.call(n);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((n) => {
      var i;
      return (i = n.hostDisconnected) == null ? void 0 : i.call(n);
    });
  }
  attributeChangedCallback(t, n, i) {
    this._$AK(t, i);
  }
  _$ET(t, n) {
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : me).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : me;
      this._$Em = s;
      const c = l.fromAttribute(n, a.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? hn)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, n, { useDefault: i, reflect: s, wrapped: o }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? n ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (n = void 0), this._$AL.set(t, n)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
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
        const { wrapped: a } = r, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, r, l);
      }
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(n)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((n) => this._$ET(n, this[n]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Pt.elementStyles = [], Pt.shadowRootOptions = { mode: "open" }, Pt[Xt("elementProperties")] = /* @__PURE__ */ new Map(), Pt[Xt("finalized")] = /* @__PURE__ */ new Map(), ze == null || ze({ ReactiveElement: Pt }), (pt.reactiveElementVersions ?? (pt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = globalThis, zn = (e) => e, be = Qt.trustedTypes, Rn = be ? be.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Li = "$lit$", ct = `lit$${Math.random().toFixed(9).slice(2)}$`, Di = "?" + ct, lo = `<${Di}>`, Mt = document, te = () => Mt.createComment(""), ee = (e) => e === null || typeof e != "object" && typeof e != "function", pn = Array.isArray, co = (e) => pn(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Re = `[ 	
\f\r]`, Wt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Un = /-->/g, Fn = />/g, wt = RegExp(`>|${Re}(?:([^\\s"'>=/]+)(${Re}*=${Re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Bn = /'/g, Hn = /"/g, Ti = /^(?:script|style|textarea|title)$/i, zi = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), g = zi(1), k = zi(2), mt = Symbol.for("lit-noChange"), b = Symbol.for("lit-nothing"), jn = /* @__PURE__ */ new WeakMap(), xt = Mt.createTreeWalker(Mt, 129);
function Ri(e, t) {
  if (!pn(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Rn !== void 0 ? Rn.createHTML(t) : t;
}
const uo = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = Wt;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let c, f, d = -1, h = 0;
    for (; h < l.length && (r.lastIndex = h, f = r.exec(l), f !== null); ) h = r.lastIndex, r === Wt ? f[1] === "!--" ? r = Un : f[1] !== void 0 ? r = Fn : f[2] !== void 0 ? (Ti.test(f[2]) && (s = RegExp("</" + f[2], "g")), r = wt) : f[3] !== void 0 && (r = wt) : r === wt ? f[0] === ">" ? (r = s ?? Wt, d = -1) : f[1] === void 0 ? d = -2 : (d = r.lastIndex - f[2].length, c = f[1], r = f[3] === void 0 ? wt : f[3] === '"' ? Hn : Bn) : r === Hn || r === Bn ? r = wt : r === Un || r === Fn ? r = Wt : (r = wt, s = void 0);
    const u = r === wt && e[a + 1].startsWith("/>") ? " " : "";
    o += r === Wt ? l + lo : d >= 0 ? (i.push(c), l.slice(0, d) + Li + l.slice(d) + ct + u) : l + ct + (d === -2 ? a : u);
  }
  return [Ri(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class ne {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [c, f] = uo(t, n);
    if (this.el = ne.createElement(c, i), xt.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = xt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Li)) {
          const h = f[r++], u = s.getAttribute(d).split(ct), m = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: m[2], strings: u, ctor: m[1] === "." ? po : m[1] === "?" ? fo : m[1] === "@" ? go : Ee }), s.removeAttribute(d);
        } else d.startsWith(ct) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (Ti.test(s.tagName)) {
          const d = s.textContent.split(ct), h = d.length - 1;
          if (h > 0) {
            s.textContent = be ? be.emptyScript : "";
            for (let u = 0; u < h; u++) s.append(d[u], te()), xt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[h], te());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Di) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(ct, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += ct.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = Mt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Lt(e, t, n = e, i) {
  var r, a;
  if (t === mt) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = ee(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Lt(e, s._$AS(e, t.values), s, i)), t;
}
class ho {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? Mt).importNode(n, !0);
    xt.currentNode = s;
    let o = xt.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new fn(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new mo(o, this, t)), this._$AV.push(c), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = xt.nextNode(), r++);
    }
    return xt.currentNode = Mt, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let fn = class Ui {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, s) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = Lt(this, t, n), ee(t) ? t === b || t == null || t === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : t !== this._$AH && t !== mt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : co(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== b && ee(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Mt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = ne.createElement(Ri(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new ho(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = jn.get(t.strings);
    return n === void 0 && jn.set(t.strings, n = new ne(t)), n;
  }
  k(t) {
    pn(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Ui(this.O(te()), this.O(te()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = zn(t).nextSibling;
      zn(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class Ee {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, s, o) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = b;
  }
  _$AI(t, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = Lt(this, t, n, 0), r = !ee(t) || t !== this._$AH && t !== mt, r && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = Lt(this, a[i + l], n, l), c === mt && (c = this._$AH[l]), r || (r = !ee(c) || c !== this._$AH[l]), c === b ? t = b : t !== b && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class po extends Ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
}
class fo extends Ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== b);
  }
}
let go = class extends Ee {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Lt(this, t, n, 0) ?? b) === mt) return;
    const i = this._$AH, s = t === b && i !== b || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== b && (i === b || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class mo {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Lt(this, t);
  }
}
const Ue = Qt.litHtmlPolyfillSupport;
Ue == null || Ue(ne, fn), (Qt.litHtmlVersions ?? (Qt.litHtmlVersions = [])).push("3.3.3");
const bo = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new fn(t.insertBefore(te(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = globalThis;
let Nt = class extends Pt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var n;
    const t = super.createRenderRoot();
    return (n = this.renderOptions).renderBefore ?? (n.renderBefore = t.firstChild), t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = bo(n, this.renderRoot, this.renderOptions);
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
var Oi;
Nt._$litElement$ = !0, Nt.finalized = !0, (Oi = St.litElementHydrateSupport) == null || Oi.call(St, { LitElement: Nt });
const Fe = St.litElementPolyfillSupport;
Fe == null || Fe({ LitElement: Nt });
(St.litElementVersions ?? (St.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vo = { attribute: !0, type: String, converter: me, reflect: !1, hasChanged: hn }, yo = (e = vo, t, n) => {
  const { kind: i, metadata: s } = n;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(n.name, e), i === "accessor") {
    const { name: r } = n;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(r, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, e, a), a;
    } };
  }
  if (i === "setter") {
    const { name: r } = n;
    return function(a) {
      const l = this[r];
      t.call(this, a), this.requestUpdate(r, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function J(e) {
  return (t, n) => typeof n == "object" ? yo(e, t, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function L(e) {
  return J({ ...e, state: !0, attribute: !1 });
}
function nt() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function Fi(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const qn = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, $o = ["on", "off", "auto"], gn = (e) => $o.includes(e), Be = (e, t) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0,
  ...t === !1 ? { autoFill: t } : {}
}), Bi = {
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
  smart_button: [
    Be("on"),
    Be("off", !1),
    Be("auto", !1),
    { role: "final", domains: ["light", "switch"], primary: !1, autoFill: !1 }
  ],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, qn],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, qn]
}, mn = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, wo = { climate_sensor: "any" };
function vt(e) {
  const t = e.props, n = Bi[t.kind];
  return t.kind !== "smart_button" ? n : n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : i === "final" ? !t.separateOff && t.autoEnabled : !0);
}
function Hi(e) {
  return new Set(vt(e).map((t) => t.role));
}
function bn(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !Hi(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const c = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete c.bindings, { ...e, devices: e.devices.map((f) => f === s ? c : f) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function xo(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = vt(e).filter((a) => a.primary), o = s.filter((a) => !!n[a.role]);
  return (wo[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function ko(e) {
  const t = vt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const _o = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function Ye(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !gn(t) ? n : `${n}|${_o(i[t])}`;
}
function So(e, t, n) {
  const i = Ye(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && vt(s).some((o) => Ye(s, o.role) === i));
}
function Eo(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of vt(e)) {
    const s = gn(i) ? Ye(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function vn(e) {
  if (!e.bindings) return e;
  const t = Hi(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const ae = (e) => e === "wall_switch" || e === "smart_button", Mo = [100, 125, 150], yn = "mdi:cube-outline", Ao = ["single", "double", "hold"];
function ji(e) {
  const t = e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled : null;
  return t === null ? [] : t ? ["off", "on", "auto", "error"] : ["off", "on", "error"];
}
function qi(e) {
  return e.kind !== "wall_switch" && e.kind !== "smart_button" || ji(e).includes(e.defaultOutput) ? e : { ...e, defaultOutput: "off" };
}
const Io = {
  bearing: 400
}, fe = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Vi(e = nt(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Vn(e) {
  return {
    id: nt(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [Vi()]
  };
}
const $n = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  wall_switch: ["wall"],
  smart_button: ["wall", "free"],
  socket: ["wall"],
  equipment: ["free"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, Dt = 90, Wi = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function At(e, t) {
  switch (e) {
    case "ceiling_light":
      return { kind: e, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: e, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: e, zoneAngle: t === "free" ? 360 : 110, zoneRange: 5e3 };
    case "climate_sensor":
      return { kind: e, zoneIds: [] };
    case "exhaust_fan":
      return { kind: e, diameter: 100 };
    case "equipment":
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: yn, label: "" };
    case "wall_switch":
      return { kind: e, autoByDoubleToggle: !1, windowSec: 3, defaultOutput: "off" };
    case "smart_button":
      return {
        kind: e,
        separateOff: !1,
        autoEnabled: !1,
        on: { slot: 0, event: "single" },
        off: { slot: 0, event: "hold" },
        auto: { slot: 0, event: "double" },
        defaultOutput: "off"
      };
    default:
      return { kind: e };
  }
}
const Po = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: yn
};
function Oo(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : Po[String(n)] ?? yn;
  return { ...e, props: { ...i, icon: s } };
}
function Co(e) {
  var n;
  if (e.props.kind !== "switch") return e;
  const t = (n = e.bindings) == null ? void 0 : n.action;
  return t ? { ...e, props: At("smart_button", e.placement.mode), bindings: { on: t } } : { ...e, props: At("wall_switch", e.placement.mode) };
}
const Ki = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function No(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = Ki(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function Lo(e) {
  const t = e.props.kind;
  if (!ae(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(At(t, e.placement.mode))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? No(r, o) : s === "windowSec" ? Ki(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function Do(e) {
  const t = qi(e.props);
  return t === e.props ? e : { ...e, props: t };
}
function To(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => vn(Do(Lo(Co(Oo(n))))));
  return t.some((n, i) => n !== e.devices[i]) ? { ...e, devices: t } : e;
}
function M(e, t) {
  return { x: e.x + t.x, y: e.y + t.y };
}
function I(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function _(e, t) {
  return { x: e.x * t, y: e.y * t };
}
function V(e, t) {
  return e.x * t.x + e.y * t.y;
}
function Tt(e, t) {
  return e.x * t.y - e.y * t.x;
}
function Zi(e) {
  return Math.hypot(e.x, e.y);
}
function R(e, t) {
  return Zi(I(t, e));
}
function wn(e) {
  const t = Zi(e);
  return t === 0 ? { x: 0, y: 0 } : _(e, 1 / t);
}
function Z(e) {
  return { x: e.y, y: -e.x };
}
function zo(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function ut(e, t, n, i) {
  const s = Tt(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = Tt(I(n, e), i) / s;
  return M(e, _(t, o));
}
function Gi(e, t, n) {
  const i = I(n, t), s = V(i, i);
  return s === 0 ? 0 : V(I(e, t), i) / s;
}
function le(e, t) {
  let n = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > e.y != r.y > e.y && e.x < (r.x - o.x) * (e.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function zt(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const i = e[n], s = e[(n + 1) % e.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
class bt {
  constructor(t, n) {
    this.next = null, this.key = t, this.data = n, this.left = null, this.right = null;
  }
}
function Ro(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function dt(e, t, n) {
  const i = new bt(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = n(e, t.key);
    if (r < 0) {
      if (t.left === null) break;
      if (n(e, t.left.key) < 0) {
        const a = t.left;
        if (t.left = a.right, a.right = t, t = a, t.left === null) break;
      }
      o.left = t, o = t, t = t.left;
    } else if (r > 0) {
      if (t.right === null) break;
      if (n(e, t.right.key) > 0) {
        const a = t.right;
        if (t.right = a.left, a.left = t, t = a, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, o.left = t.right, t.left = i.right, t.right = i.left, t;
}
function He(e, t, n, i) {
  const s = new bt(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = dt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Wn(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = dt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function Uo(e, t, n) {
  return t === null ? e : (e === null || (t = dt(e.key, t, n), t.left = e), t);
}
function Xe(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && Xe(e.left, o, !1, i, s), e.right && Xe(e.right, o, !0, i, s);
  }
}
class xn {
  constructor(t = Ro) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = He(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new bt(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = dt(t, this._root, s), r = s(t, o.key);
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
  _remove(t, n, i) {
    let s;
    return n === null ? null : (n = dt(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = dt(t, n.left, i), s.right = n.right), this._size--, s) : n);
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
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const s = i(t, n.key);
      if (s === 0) return n;
      s < 0 ? n = n.left : n = n.right;
    }
    return null;
  }
  find(t) {
    return this._root && (this._root = dt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
  }
  contains(t) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const s = i(t, n.key);
      if (s === 0) return !0;
      s < 0 ? n = n.left : n = n.right;
    }
    return !1;
  }
  forEach(t, n) {
    let i = this._root;
    const s = [];
    let o = !1;
    for (; !o; )
      i !== null ? (s.push(i), i = i.left) : s.length !== 0 ? (i = s.pop(), t.call(n, i), i = i.right) : o = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(t, n, i, s) {
    const o = [], r = this._comparator;
    let a = this._root, l;
    for (; o.length !== 0 || a; )
      if (a)
        o.push(a), a = a.left;
      else {
        if (a = o.pop(), l = r(a.key, n), l > 0)
          break;
        if (r(a.key, t) >= 0 && i.call(s, a))
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
    return this.forEach(({ key: n }) => {
      t.push(n);
    }), t;
  }
  /**
   * Returns array of all the data in the nodes
   */
  values() {
    const t = [];
    return this.forEach(({ data: n }) => {
      t.push(n);
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
    let n = this._root, i = !1, s = 0;
    const o = [];
    for (; !i; )
      if (n)
        o.push(n), n = n.left;
      else if (o.length > 0) {
        if (n = o.pop(), s === t) return n;
        s++, n = n.right;
      } else i = !0;
    return null;
  }
  next(t) {
    let n = this._root, i = null;
    if (t.right) {
      for (i = t.right; i.left; ) i = i.left;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(t.key, n.key);
      if (o === 0) break;
      o < 0 ? (i = n, n = n.left) : n = n.right;
    }
    return i;
  }
  prev(t) {
    let n = this._root, i = null;
    if (t.left !== null) {
      for (i = t.left; i.right; ) i = i.right;
      return i;
    }
    const s = this._comparator;
    for (; n; ) {
      const o = s(t.key, n.key);
      if (o === 0) break;
      o < 0 ? n = n.left : (i = n, n = n.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Bo(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && tn(t, n, 0, s - 1, o), this._root === null)
      this._root = Qe(t, n, 0, s), this._size = s;
    else {
      const r = Ho(
        this.toList(),
        Fo(t, n),
        o
      );
      s = this._size + s, this._root = Je({ head: r }, 0, s);
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
  toString(t = (n) => String(n.key)) {
    const n = [];
    return Xe(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Wn(t, this._root, s);
    s(t, n) < 0 ? r = He(n, i, r, s) : o = He(n, i, o, s), this._root = Uo(o, r, s);
  }
  split(t) {
    return Wn(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function Qe(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], a = t[o], l = new bt(r, a);
    return l.left = Qe(e, t, n, o), l.right = Qe(e, t, o + 1, i), l;
  }
  return null;
}
function Fo(e, t) {
  const n = new bt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new bt(e[s], t[s]);
  return i.next = null, n.next;
}
function Bo(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new bt(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function Je(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = Je(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = Je(e, s + 1, n), r;
  }
  return null;
}
function Ho(e, t, n) {
  const i = new bt(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function tn(e, t, n, i, s) {
  if (n >= i) return;
  const o = e[n + i >> 1];
  let r = n - 1, a = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(e[r], o) < 0);
    do
      a--;
    while (s(e[a], o) > 0);
    if (r >= a) break;
    let l = e[r];
    e[r] = e[a], e[a] = l, l = t[r], t[r] = t[a], t[a] = l;
  }
  tn(e, t, n, a, s), tn(e, t, a + 1, i, s);
}
const rt = 11102230246251565e-32, B = 134217729, jo = (3 + 8 * rt) * rt;
function je(e, t, n, i, s) {
  let o, r, a, l, c = t[0], f = i[0], d = 0, h = 0;
  f > c == f > -c ? (o = c, c = t[++d]) : (o = f, f = i[++h]);
  let u = 0;
  if (d < e && h < n)
    for (f > c == f > -c ? (r = c + o, a = o - (r - c), c = t[++d]) : (r = f + o, a = o - (r - f), f = i[++h]), o = r, a !== 0 && (s[u++] = a); d < e && h < n; )
      f > c == f > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d]) : (r = o + f, l = r - o, a = o - (r - l) + (f - l), f = i[++h]), o = r, a !== 0 && (s[u++] = a);
  for (; d < e; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = t[++d], o = r, a !== 0 && (s[u++] = a);
  for (; h < n; )
    r = o + f, l = r - o, a = o - (r - l) + (f - l), f = i[++h], o = r, a !== 0 && (s[u++] = a);
  return (o !== 0 || u === 0) && (s[u++] = o), u;
}
function qo(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function $(e) {
  return new Float64Array(e);
}
const Vo = (3 + 16 * rt) * rt, Wo = (2 + 12 * rt) * rt, Ko = (9 + 64 * rt) * rt * rt, It = $(4), Kn = $(8), Zn = $(12), Gn = $(16), q = $(4);
function Zo(e, t, n, i, s, o, r) {
  let a, l, c, f, d, h, u, m, v, w, y, x, S, E, P, N, T, C;
  const F = e - s, H = n - s, j = t - o, tt = i - o;
  E = F * tt, h = B * F, u = h - (h - F), m = F - u, h = B * tt, v = h - (h - tt), w = tt - v, P = m * w - (E - u * v - m * v - u * w), N = j * H, h = B * j, u = h - (h - j), m = j - u, h = B * H, v = h - (h - H), w = H - v, T = m * w - (N - u * v - m * v - u * w), y = P - T, d = P - y, It[0] = P - (y + d) + (d - T), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, It[1] = S - (y + d) + (d - N), C = x + y, d = C - x, It[2] = x - (C - d) + (y - d), It[3] = C;
  let ot = qo(4, It), Vt = Wo * r;
  if (ot >= Vt || -ot >= Vt || (d = e - F, a = e - (F + d) + (d - s), d = n - H, c = n - (H + d) + (d - s), d = t - j, l = t - (j + d) + (d - o), d = i - tt, f = i - (tt + d) + (d - o), a === 0 && l === 0 && c === 0 && f === 0) || (Vt = Ko * r + jo * Math.abs(ot), ot += F * f + tt * a - (j * c + H * l), ot >= Vt || -ot >= Vt)) return ot;
  E = a * tt, h = B * a, u = h - (h - a), m = a - u, h = B * tt, v = h - (h - tt), w = tt - v, P = m * w - (E - u * v - m * v - u * w), N = l * H, h = B * l, u = h - (h - l), m = l - u, h = B * H, v = h - (h - H), w = H - v, T = m * w - (N - u * v - m * v - u * w), y = P - T, d = P - y, q[0] = P - (y + d) + (d - T), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, q[1] = S - (y + d) + (d - N), C = x + y, d = C - x, q[2] = x - (C - d) + (y - d), q[3] = C;
  const Ys = je(4, It, 4, q, Kn);
  E = F * f, h = B * F, u = h - (h - F), m = F - u, h = B * f, v = h - (h - f), w = f - v, P = m * w - (E - u * v - m * v - u * w), N = j * c, h = B * j, u = h - (h - j), m = j - u, h = B * c, v = h - (h - c), w = c - v, T = m * w - (N - u * v - m * v - u * w), y = P - T, d = P - y, q[0] = P - (y + d) + (d - T), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, q[1] = S - (y + d) + (d - N), C = x + y, d = C - x, q[2] = x - (C - d) + (y - d), q[3] = C;
  const Xs = je(Ys, Kn, 4, q, Zn);
  E = a * f, h = B * a, u = h - (h - a), m = a - u, h = B * f, v = h - (h - f), w = f - v, P = m * w - (E - u * v - m * v - u * w), N = l * c, h = B * l, u = h - (h - l), m = l - u, h = B * c, v = h - (h - c), w = c - v, T = m * w - (N - u * v - m * v - u * w), y = P - T, d = P - y, q[0] = P - (y + d) + (d - T), x = E + y, d = x - E, S = E - (x - d) + (y - d), y = S - N, d = S - y, q[1] = S - (y + d) + (d - N), C = x + y, d = C - x, q[2] = x - (C - d) + (y - d), q[3] = C;
  const Qs = je(Xs, Zn, 4, q, Gn);
  return Gn[Qs - 1];
}
function Go(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= Vo * c ? l : -Zo(e, t, n, i, s, o, c);
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
const Kt = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, en = (e, t) => {
  if (t.ur.x < e.ll.x || e.ur.x < t.ll.x || t.ur.y < e.ll.y || e.ur.y < t.ll.y) return null;
  const n = e.ll.x < t.ll.x ? t.ll.x : e.ll.x, i = e.ur.x < t.ur.x ? e.ur.x : t.ur.x, s = e.ll.y < t.ll.y ? t.ll.y : e.ll.y, o = e.ur.y < t.ur.y ? e.ur.y : t.ur.y;
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
let ht = Number.EPSILON;
ht === void 0 && (ht = Math.pow(2, -52));
const Yo = ht * ht, Yn = (e, t) => {
  if (-ht < e && e < ht && -ht < t && t < ht)
    return 0;
  const n = e - t;
  return n * n < Yo * e * t ? 0 : e < t ? -1 : 1;
};
class Xo {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Xn(), this.yRounder = new Xn();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class Xn {
  constructor() {
    this.tree = new xn(), this.round(0);
  }
  // Note: this can rounds input values backwards or forwards.
  //       You might ask, why not restrict this to just rounding
  //       forwards? Wouldn't that allow left endpoints to always
  //       remain left endpoints during splitting (never change to
  //       right). No - it wouldn't, because we snap intersections
  //       to endpoints (to establish independence from the segment
  //       angle for t-intersections).
  round(t) {
    const n = this.tree.add(t), i = this.tree.prev(n);
    if (i !== null && Yn(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && Yn(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const ie = new Xo(), ge = (e, t) => e.x * t.y - e.y * t.x, Yi = (e, t) => e.x * t.x + e.y * t.y, Qn = (e, t, n) => {
  const i = Go(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, ve = (e) => Math.sqrt(Yi(e, e)), Qo = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return ge(s, i) / ve(s) / ve(i);
}, Jo = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return Yi(s, i) / ve(s) / ve(i);
}, Jn = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, ti = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, tr = (e, t, n, i) => {
  if (t.x === 0) return ti(n, i, e.x);
  if (i.x === 0) return ti(e, t, n.x);
  if (t.y === 0) return Jn(n, i, e.y);
  if (i.y === 0) return Jn(e, t, n.y);
  const s = ge(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = ge(o, t) / s, a = ge(o, i) / s, l = e.x + a * t.x, c = n.x + r * i.x, f = e.y + a * t.y, d = n.y + r * i.y, h = (l + c) / 2, u = (f + d) / 2;
  return {
    x: h,
    y: u
  };
};
class Q {
  // for ordering sweep events in the sweep event queue
  static compare(t, n) {
    const i = Q.comparePoints(t.point, n.point);
    return i !== 0 ? i : (t.point !== n.point && t.link(n), t.isLeft !== n.isLeft ? t.isLeft ? 1 : -1 : ft.compare(t.segment, n.segment));
  }
  // for ordering points in sweep line order
  static comparePoints(t, n) {
    return t.x < n.x ? -1 : t.x > n.x ? 1 : t.y < n.y ? -1 : t.y > n.y ? 1 : 0;
  }
  // Warning: 'point' input will be modified and re-used (for performance)
  constructor(t, n) {
    t.events === void 0 ? t.events = [this] : t.events.push(this), this.point = t, this.isLeft = n;
  }
  link(t) {
    if (t.point === this.point)
      throw new Error("Tried to link already linked events");
    const n = t.point.events;
    for (let i = 0, s = n.length; i < s; i++) {
      const o = n[i];
      this.point.events.push(o), o.point = this.point;
    }
    this.checkForConsuming();
  }
  /* Do a pass over our linked events and check to see if any pair
   * of segments match, and should be consumed. */
  checkForConsuming() {
    const t = this.point.events.length;
    for (let n = 0; n < t; n++) {
      const i = this.point.events[n];
      if (i.segment.consumedBy === void 0)
        for (let s = n + 1; s < t; s++) {
          const o = this.point.events[s];
          o.consumedBy === void 0 && i.otherSE.point.events === o.otherSE.point.events && i.segment.consume(o.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const t = [];
    for (let n = 0, i = this.point.events.length; n < i; n++) {
      const s = this.point.events[n];
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
    const n = /* @__PURE__ */ new Map(), i = (s) => {
      const o = s.otherSE;
      n.set(s, {
        sine: Qo(this.point, t.point, o.point),
        cosine: Jo(this.point, t.point, o.point)
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
let er = 0;
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
  static compare(t, n) {
    const i = t.leftSE.point.x, s = n.leftSE.point.x, o = t.rightSE.point.x, r = n.rightSE.point.x;
    if (r < i) return 1;
    if (o < s) return -1;
    const a = t.leftSE.point.y, l = n.leftSE.point.y, c = t.rightSE.point.y, f = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < c) return 1;
      if (l > a && l > c) return -1;
      const d = t.comparePoint(n.leftSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
      const h = n.comparePoint(t.rightSE.point);
      return h !== 0 ? h : -1;
    }
    if (i > s) {
      if (a < l && a < f) return -1;
      if (a > l && a > f) return 1;
      const d = n.comparePoint(t.leftSE.point);
      if (d !== 0) return d;
      const h = t.comparePoint(n.rightSE.point);
      return h < 0 ? 1 : h > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
    if (o < r) {
      const d = n.comparePoint(t.rightSE.point);
      if (d !== 0) return d;
    }
    if (o > r) {
      const d = t.comparePoint(n.rightSE.point);
      if (d < 0) return 1;
      if (d > 0) return -1;
    }
    if (o !== r) {
      const d = c - a, h = o - i, u = f - l, m = r - s;
      if (d > h && u < m) return 1;
      if (d < h && u > m) return -1;
    }
    return o > r ? 1 : o < r || c < f ? -1 : c > f ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++er, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = Q.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new Q(s, !0), c = new Q(o, !1);
    return new ft(l, c, [i], [r]);
  }
  /* When a segment is split, the rightSE is replaced with a new sweep event */
  replaceRightSE(t) {
    this.rightSE = t, this.rightSE.segment = this, this.rightSE.otherSE = this.leftSE, this.leftSE.otherSE = this.rightSE;
  }
  bbox() {
    const t = this.leftSE.point.y, n = this.rightSE.point.y;
    return {
      ll: {
        x: this.leftSE.point.x,
        y: t < n ? t : n
      },
      ur: {
        x: this.rightSE.point.x,
        y: t > n ? t : n
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
    const n = this.leftSE.point, i = this.rightSE.point, s = this.vector();
    if (n.x === i.x)
      return t.x === n.x ? 0 : t.x < n.x ? 1 : -1;
    const o = (t.y - n.y) / s.y, r = n.x + o * s.x;
    if (t.x === r) return 0;
    const a = (t.x - n.x) / s.x, l = n.y + a * s.y;
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
    const n = this.bbox(), i = t.bbox(), s = en(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, c = Kt(n, a) && this.comparePoint(a) === 0, f = Kt(i, o) && t.comparePoint(o) === 0, d = Kt(n, l) && this.comparePoint(l) === 0, h = Kt(i, r) && t.comparePoint(r) === 0;
    if (f && c)
      return h && !d ? r : !h && d ? l : null;
    if (f)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return h && r.x === a.x && r.y === a.y ? null : a;
    if (h && d) return null;
    if (h) return r;
    if (d) return l;
    const u = tr(o, this.vector(), a, t.vector());
    return u === null || !Kt(s, u) ? null : ie.round(u.x, u.y);
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
    const n = [], i = t.events !== void 0, s = new Q(t, !0), o = new Q(t, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new ft(s, r, this.rings.slice(), this.windings.slice());
    return Q.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), Q.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
  }
  /* Swap which event is left and right */
  swapEvents() {
    const t = this.rightSE;
    this.rightSE = this.leftSE, this.leftSE = t, this.leftSE.isLeft = !0, this.rightSE.isLeft = !1;
    for (let n = 0, i = this.windings.length; n < i; n++)
      this.windings[n] *= -1;
  }
  /* Consume another segment. We take their rings under our wing
   * and mark them as consumed. Use for perfectly overlapping segments */
  consume(t) {
    let n = this, i = t;
    for (; n.consumedBy; ) n = n.consumedBy;
    for (; i.consumedBy; ) i = i.consumedBy;
    const s = ft.compare(n, i);
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
    const n = this._afterState.rings, i = this._afterState.windings, s = this._afterState.multiPolys;
    for (let a = 0, l = this.rings.length; a < l; a++) {
      const c = this.rings[a], f = this.windings[a], d = n.indexOf(c);
      d === -1 ? (n.push(c), i.push(f)) : i[d] += f;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const c = n[a], f = c.poly;
      if (r.indexOf(f) === -1)
        if (c.isExterior) o.push(f);
        else {
          r.indexOf(f) === -1 && r.push(f);
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
    const t = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (et.type) {
      case "union": {
        const i = t.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < n.length ? (i = t.length, s = n.length) : (i = n.length, s = t.length), this._isInResult = s === et.numMultiPolys && i < s;
        break;
      }
      case "xor": {
        const i = Math.abs(t.length - n.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (s) => s.length === 1 && s[0].isSubject;
        this._isInResult = i(t) !== i(n);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${et.type}`);
    }
    return this._isInResult;
  }
}
class ei {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = ie.round(t[0][0], t[0][1]);
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
    for (let r = 1, a = t.length; r < a; r++) {
      if (typeof t[r][0] != "number" || typeof t[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let l = ie.round(t[r][0], t[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(ft.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(ft.fromRing(o, s, this));
  }
  getSweepEvents() {
    const t = [];
    for (let n = 0, i = this.segments.length; n < i; n++) {
      const s = this.segments[n];
      t.push(s.leftSE), t.push(s.rightSE);
    }
    return t;
  }
}
class nr {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new ei(t[0], this, !0), this.bbox = {
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
      const o = new ei(t[i], this, !1);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.interiorRings.push(o);
    }
    this.multiPoly = n;
  }
  getSweepEvents() {
    const t = this.exteriorRing.getSweepEvents();
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const s = this.interiorRings[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class ni {
  constructor(t, n) {
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
      const o = new nr(t[i], this);
      o.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = o.bbox.ll.x), o.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = o.bbox.ll.y), o.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = o.bbox.ur.x), o.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = o.bbox.ur.y), this.polys.push(o);
    }
    this.isSubject = n;
  }
  getSweepEvents() {
    const t = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getSweepEvents();
      for (let o = 0, r = s.length; o < r; o++)
        t.push(s[o]);
    }
    return t;
  }
}
class ye {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, a = o.leftSE, l = o.rightSE;
      const c = [a], f = a.point, d = [];
      for (; r = a, a = l, c.push(a), a.point !== f; )
        for (; ; ) {
          const h = a.getAvailableLinkedEvents();
          if (h.length === 0) {
            const v = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${v.x}, ${v.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (h.length === 1) {
            l = h[0].otherSE;
            break;
          }
          let u = null;
          for (let v = 0, w = d.length; v < w; v++)
            if (d[v].point === a.point) {
              u = v;
              break;
            }
          if (u !== null) {
            const v = d.splice(u)[0], w = c.splice(v.index);
            w.unshift(w[0].otherSE), n.push(new ye(w.reverse()));
            continue;
          }
          d.push({
            index: c.length,
            point: a.point
          });
          const m = a.getLeftmostComparator(r);
          l = h.sort(m)[0].otherSE;
          break;
        }
      n.push(new ye(c));
    }
    return n;
  }
  constructor(t) {
    this.events = t;
    for (let n = 0, i = t.length; n < i; n++)
      t[n].segment.ringOut = this;
    this.poly = null;
  }
  getGeom() {
    let t = this.events[0].point;
    const n = [t];
    for (let c = 1, f = this.events.length - 1; c < f; c++) {
      const d = this.events[c].point, h = this.events[c + 1].point;
      Qn(d, t, h) !== 0 && (n.push(d), t = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Qn(i, t, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, a = this.isExteriorRing() ? n.length : -1, l = [];
    for (let c = r; c != a; c += o) l.push([n[c].x, n[c].y]);
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
    for (let s = 1, o = this.events.length; s < o; s++) {
      const r = this.events[s];
      Q.compare(t, r) > 0 && (t = r);
    }
    let n = t.segment.prevInResult(), i = n ? n.prevInResult() : null;
    for (; ; ) {
      if (!n) return null;
      if (!i) return n.ringOut;
      if (i.ringOut !== n.ringOut)
        return i.ringOut.enclosingRing() !== n.ringOut ? n.ringOut : n.ringOut.enclosingRing();
      n = i.prevInResult(), i = n ? n.prevInResult() : null;
    }
  }
}
class ii {
  constructor(t) {
    this.exteriorRing = t, t.poly = this, this.interiorRings = [];
  }
  addInterior(t) {
    this.interiorRings.push(t), t.poly = this;
  }
  getGeom() {
    const t = [this.exteriorRing.getGeom()];
    if (t[0] === null) return null;
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const s = this.interiorRings[n].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
}
class ir {
  constructor(t) {
    this.rings = t, this.polys = this._composePolys(t);
  }
  getGeom() {
    const t = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const s = this.polys[n].getGeom();
      s !== null && t.push(s);
    }
    return t;
  }
  _composePolys(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.poly)
        if (o.isExteriorRing()) n.push(new ii(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new ii(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class sr {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ft.compare;
    this.queue = t, this.tree = new xn(n), this.segments = [];
  }
  process(t) {
    const n = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(n), i;
    const s = t.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!s) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, a, l;
    for (; a === void 0; )
      o = this.tree.prev(o), o === null ? a = null : o.key.consumedBy === void 0 && (a = o.key);
    for (; l === void 0; )
      r = this.tree.next(r), r === null ? l = null : r.key.consumedBy === void 0 && (l = r.key);
    if (t.isLeft) {
      let c = null;
      if (a) {
        const d = a.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (c = d), !a.isAnEndpoint(d))) {
          const h = this._splitSafely(a, d);
          for (let u = 0, m = h.length; u < m; u++)
            i.push(h[u]);
        }
      }
      let f = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (f = d), !l.isAnEndpoint(d))) {
          const h = this._splitSafely(l, d);
          for (let u = 0, m = h.length; u < m; u++)
            i.push(h[u]);
        }
      }
      if (c !== null || f !== null) {
        let d = null;
        c === null ? d = f : f === null ? d = c : d = Q.comparePoints(c, f) <= 0 ? c : f, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const h = n.split(d);
        for (let u = 0, m = h.length; u < m; u++)
          i.push(h[u]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const c = a.getIntersection(l);
        if (c !== null) {
          if (!a.isAnEndpoint(c)) {
            const f = this._splitSafely(a, c);
            for (let d = 0, h = f.length; d < h; d++)
              i.push(f[d]);
          }
          if (!l.isAnEndpoint(c)) {
            const f = this._splitSafely(l, c);
            for (let d = 0, h = f.length; d < h; d++)
              i.push(f[d]);
          }
        }
      }
      this.tree.remove(n);
    }
    return i;
  }
  /* Safely split a segment that is currently in the datastructures
   * IE - a segment other than the one that is currently being processed. */
  _splitSafely(t, n) {
    this.tree.remove(t);
    const i = t.rightSE;
    this.queue.remove(i);
    const s = t.split(n);
    return s.push(i), t.consumedBy === void 0 && this.tree.add(t), s;
  }
}
const si = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, or = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class rr {
  run(t, n, i) {
    et.type = t, ie.reset();
    const s = [new ni(n, !0)];
    for (let d = 0, h = i.length; d < h; d++)
      s.push(new ni(i[d], !1));
    if (et.numMultiPolys = s.length, et.type === "difference") {
      const d = s[0];
      let h = 1;
      for (; h < s.length; )
        en(s[h].bbox, d.bbox) !== null ? h++ : s.splice(h, 1);
    }
    if (et.type === "intersection")
      for (let d = 0, h = s.length; d < h; d++) {
        const u = s[d];
        for (let m = d + 1, v = s.length; m < v; m++)
          if (en(u.bbox, s[m].bbox) === null) return [];
      }
    const o = new xn(Q.compare);
    for (let d = 0, h = s.length; d < h; d++) {
      const u = s[d].getSweepEvents();
      for (let m = 0, v = u.length; m < v; m++)
        if (o.insert(u[m]), o.size > si)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new sr(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const u = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${u.id} [${u.leftSE.point.x}, ${u.leftSE.point.y}] -> [${u.rightSE.point.x}, ${u.rightSE.point.y}] from queue.`);
      }
      if (o.size > si)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > or)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const h = r.process(d);
      for (let u = 0, m = h.length; u < m; u++) {
        const v = h[u];
        v.consumedBy === void 0 && o.insert(v);
      }
      a = o.size, l = o.pop();
    }
    ie.reset();
    const c = ye.factory(r.segments);
    return new ir(c).getGeom();
  }
}
const et = new rr(), ar = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return et.run("union", e, n);
}, lr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return et.run("intersection", e, n);
}, cr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return et.run("xor", e, n);
}, dr = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return et.run("difference", e, n);
};
var Xi = {
  union: ar,
  intersection: lr,
  xor: cr,
  difference: dr
};
const Qi = 3, ur = 1e-6;
function Ji(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function W(e, t) {
  const n = Ji(e, t);
  return { x: n.x, y: n.y };
}
function Me(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : R(i, s);
}
function ts(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: wn(I(t, e)), len: R(e, t), leftOff: o, rightOff: r };
}
function it(e, t) {
  return ts(W(e, t.a), W(e, t.b), t.thickness, t.baseline);
}
function Bt(e, t) {
  const n = I(t, e.a);
  return { t: V(n, e.dir), side: V(n, Z(e.dir)) };
}
function oi(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: _(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Ot = (e) => M(e.p, _(Z(e.u), e.offL)), Ct = (e) => I(e.p, _(Z(e.u), e.offR));
function kt(e, t, n) {
  return e !== null && R(e, t) <= n;
}
function hr(e) {
  const t = [];
  for (const n of e.walls) {
    const i = it(e, n);
    if (i.len < 1e-9) continue;
    const s = Z(i.dir);
    t.push({
      wall: n,
      f: i,
      c: {
        al: M(i.a, _(s, i.leftOff)),
        ar: I(i.a, _(s, i.rightOff)),
        bl: M(i.b, _(s, i.leftOff)),
        br: I(i.b, _(s, i.rightOff))
      }
    });
  }
  return t;
}
function pr(e, t) {
  const n = t.f, i = Z(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = V(I(s.far, n.a), i) >= 0 ? M(n.a, _(i, n.leftOff)) : I(n.a, _(i, n.rightOff)), a = Qi * Math.max(s.body.wall.thickness, t.wall.thickness), l = ut(Ot(s), s.u, r, n.dir), c = ut(Ct(s), s.u, r, n.dir);
    kt(l, s.p, a) && (s.body.c[s.leftKey] = l), kt(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function fr(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Qi * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = ut(Ct(o), o.u, Ot(r), r.u);
    kt(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = gr(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = I(r, o), l = Tt(a, I(t, o)), c = Tt(a, I(s.far, o));
    l * c < 0 && nn(s, [t]);
  }
}
function nn(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function gr(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(Tt(o.u, r.u)) > 1e-9 || V(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], c = ut(Ct(o), o.u, Ot(l), l.u), f = ut(Ot(r), r.u, Ot(l), l.u);
        if (!kt(c, t, n) || !kt(f, t, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = f, nn(o, [t, d, f]);
      } else {
        const l = e[(s - 1 + i) % i], c = ut(Ot(r), r.u, Ct(l), l.u), f = ut(Ct(o), o.u, Ct(l), l.u);
        if (!kt(f, t, n) || !kt(c, t, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = f, r.body.c[r.leftKey] = c, nn(r, [f, d, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function es(e) {
  const t = hr(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(oi(r, "a")), r.wall.b === i.id && s.push(oi(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? pr(s, o) : s.length >= 2 && fr(s, { x: i.x, y: i.y });
  }
  return t;
}
function ns(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function Ae(e) {
  return new Map(es(e).map((t) => [t.wall.id, ns(t)]));
}
function ri(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(M(s, _(I(o, s), r / (r - a))));
  }
  return n;
}
function is(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of es(e)) {
    const i = ns(n), s = e.openings.filter((c) => c.wallId === n.wall.id && !c.invalid).sort((c, f) => c.offset - f.offset), o = (c) => V(I(c, n.f.a), n.f.dir), r = [];
    let a = -1 / 0;
    for (const c of s)
      r.push([a, c.offset]), a = Math.max(a, c.offset + c.width);
    r.push([a, 1 / 0]);
    const l = [];
    for (const [c, f] of r) {
      if (f <= c) continue;
      let d = i;
      c > -1 / 0 && (d = ri(d, (h) => o(h) - c)), f < 1 / 0 && (d = ri(d, (h) => f - o(h))), d.length >= 3 && Math.abs(zt(d)) > ur && l.push(d);
    }
    t.set(n.wall.id, l);
  }
  return t;
}
const sn = (e) => [e.map((t) => [t.x, t.y])];
function ss(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function os(e, t) {
  const n = t ? [...is(e).values()].flat() : [...Ae(e).values()], i = n.map(sn);
  if (i.length === 0) return [];
  let s;
  try {
    s = Xi.union(i[0], ...i.slice(1));
  } catch {
    return n.map((o) => [o.map((r) => ({ x: r.x, y: r.y }))]);
  }
  return s.map((o) => o.map(ss));
}
const $e = 1e-6;
function rs(e, t) {
  return $n[e.kind].includes(t.mode);
}
function as(e, t, n) {
  if (!rs(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Dt || i > Dt)) return !1;
  const s = Me(e, n.wallId);
  return s !== null && n.offset >= -$e && n.offset <= s + $e;
}
function Ht(e, t) {
  return { ...e, devices: t };
}
function ai(e, t, n, i) {
  if (!as(e, t, n)) return { level: e, deviceId: null };
  const s = { id: nt(), name: i, placement: n, props: t, invalid: !1 };
  return { level: Ht(e, [...e.devices, s]), deviceId: s.id };
}
function ls(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = At("motion_sensor", t), s = At("motion_sensor", n);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function kn(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !as(e, s.props, n)) return e;
  const o = ls(s.props, s.placement.mode, n.mode);
  return _n(Ht(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function Ie(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? Ht(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = qi({ ...o.props, ...n, kind: o.props.kind });
    return vn({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function mr(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !ae(i.props.kind) || i.props.kind === n) return e;
  const s = At(n, i.placement.mode);
  if (!rs(s, i.placement)) return e;
  const o = vn({ ...i, props: s });
  return Ht(e, e.devices.map((r) => r === i ? o : r));
}
function cs(e, t) {
  return Ht(e, e.devices.filter((n) => n.id !== t));
}
function br(e, t) {
  if (t.props.kind !== "climate_sensor") return t;
  const n = t.props.zoneIds.filter((i) => e.zones.some((s) => s.id === i));
  return n.length === t.props.zoneIds.length ? t : { ...t, props: { ...t.props, zoneIds: n } };
}
function _n(e) {
  return Ht(e, e.devices.map((t) => {
    const n = br(e, t);
    if (n.placement.mode !== "wall") return n.invalid ? { ...n, invalid: !1 } : n;
    const i = Me(e, n.placement.wallId), s = i === null || n.placement.offset < -$e || n.placement.offset > i + $e;
    return { ...n, invalid: s };
  }));
}
function Pe(e) {
  const t = [];
  for (const n of os(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function we(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!le(t, s)) continue;
    const o = Math.abs(zt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
function ds(e) {
  return Math.round(Math.abs(zt(e)) / 1e6 * 100) / 100;
}
const qe = 1e-3;
function us(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(zt(e)) - Math.abs(zt(t))) > qe ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= qe && Math.abs(n.y - i.y) <= qe));
}
function vr(e, t, n) {
  const i = Pe(e), s = we(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const a = r.broken ? null : we(i, r.seed);
    if (a && us(a, s)) return { level: e, zoneId: null };
  }
  const o = { id: nt(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function yr(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function hs(e, t) {
  return _n({ ...e, zones: e.zones.filter((n) => n.id !== t) });
}
function jt(e) {
  if (e.zones.length === 0) return e;
  const t = Pe(e), n = [], i = e.zones.map((s) => {
    const o = we(t, s.seed);
    return !o || n.some((r) => us(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const Rt = 1e-6, xe = ["door", "gate", "wicket"];
function ps(e, t) {
  return e.offset < t.offset + t.width - Rt && t.offset < e.offset + e.width - Rt;
}
function Oe(e, t, n, i, s) {
  const o = Me(e, t);
  return o === null || i <= 0 || n < -Rt || n + i > o + Rt ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && ps(r, { offset: n, width: i }));
}
function qt(e, t) {
  return { ...e, openings: t };
}
function $r(e, t, n, i, s, o = {}) {
  const r = s ?? fe[n], a = i - r / 2;
  if (!Oe(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: nt(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return xe.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: jt(qt(e, [...e.openings, l])), openingId: l.id };
}
function fs(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Oe(e, i.wallId, n, i.width, t) ? e : jt(ce(qt(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function wr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Oe(e, i.wallId, i.offset, n, t) ? e : jt(ce(qt(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function xr(e, t) {
  return xe.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function kr(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return jt(ce(qt(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function gs(e, t) {
  return jt(ce(qt(e, e.openings.filter((n) => n.id !== t))));
}
function ce(e) {
  return qt(e, e.openings.map((t) => {
    const n = Me(e, t.wallId), i = n === null || t.offset < -Rt || t.offset + t.width > n + Rt || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && ps(t, s));
    return { ...t, invalid: i };
  }));
}
const se = 1;
function lt(e) {
  return structuredClone(e);
}
function Ce(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function _r(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Sn(e, t, n) {
  const i = W(e, t.a), s = W(e, t.b), o = R(i, s), r = _r(typeof n == "number" ? n : Gi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : zo(i, s, r / o), offset: r };
}
function Sr(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Sn(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function ms(e, t) {
  return Sr(e), t && Ir(t, e), jt(_n(ce(e)));
}
function yt(e, t) {
  return ms(lt(e), t);
}
function bs(e, t, n) {
  const i = Ji(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Sn(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function li(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: W(e, t.nodeId), nodeId: t.nodeId };
  const n = Ce(e, t.wallId), { pt: i, offset: s } = Sn(e, n, t.offset), o = R(W(e, n.a), W(e, n.b));
  return s <= se ? { pt: W(e, n.a), nodeId: n.a } : o - s <= se ? { pt: W(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function ci(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: nt(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Er(e, t, n, i) {
  const s = li(e, t), o = li(e, n);
  if (R(s.pt, o.pt) < se) return { level: e, wallId: null, endNodeId: null };
  const r = lt(e), a = ci(r, s), l = ci(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const c = { id: nt(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: yt(r, e), wallId: c.id, endNodeId: l };
}
function vs(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < se || l - a < se ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Mr(e, t, n, i, s) {
  const o = vs(t, n, i.thickness, s);
  if (!o) return e;
  const r = lt(e), a = o.map((l) => {
    const c = { id: nt(), x: l.x, y: l.y };
    return r.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: nt(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return yt(r, e);
}
function Ar(e, t, n) {
  const i = lt(e);
  return bs(i, t, n), ms(i, e);
}
function Ir(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((d) => d.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((d) => d.id === s.a), r = e.nodes.find((d) => d.id === s.b), a = t.nodes.find((d) => d.id === i.a), l = t.nodes.find((d) => d.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const c = R(a, l);
    if (c === 0) continue;
    const f = wn(I(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = Gi(M(o, _(f, d.offset)), a, l) * c);
  }
}
function Pr(e, t, n) {
  const i = lt(e), s = Ce(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: M(W(i, a), n) }));
  for (const a of r) bs(i, a.id, a.to);
  return yt(i, e);
}
function En(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Or(e, t, n) {
  const i = lt(e), s = Ce(i, t), o = W(i, s[n]), r = { id: nt(), x: o.x, y: o.y };
  return i.nodes.push(r), s[n] = r.id, En(i), { level: yt(i, e), nodeId: r.id };
}
function Cr(e, t, n) {
  if (t === n) return e;
  const i = lt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return i.nodes = i.nodes.filter((o) => o.id !== t), En(i), yt(i, e);
}
function ys(e, t) {
  var i;
  const n = lt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return En(n), yt(n, e);
}
function Nr(e, t, n) {
  const i = lt(e);
  return Object.assign(Ce(i, t), n), yt(i, e);
}
const X = (e) => typeof e == "string" && e !== "" ? e : null, $s = (e) => e.split(".")[0], Lr = ["friendly_name", "device_class", "unit_of_measurement"];
function ws(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: $s(e),
    name: X(n.friendly_name) ?? e,
    deviceClass: X(n.device_class),
    unit: X(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Dr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, ws(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Tr(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && Lr.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function xs(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function zr(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = ws(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: X(r.name) ?? X(r.original_name) ?? a.name,
      deviceId: X(r.device_id),
      areaId: X(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: X(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: X(r.name_by_user) ?? X(r.name) ?? r.id, model: X(r.model), areaId: X(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Rr(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function ks(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : xs(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Ur = 32, di = 128;
function ke(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function gt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function _s(e) {
  return (e % 360 + 360) % 360;
}
function Ss(e) {
  return (e % 360 + 540) % 360 - 180;
}
function Y(e, t) {
  const n = t.placement;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: ke(n.rotation) };
  const i = e.walls.find((l) => l.id === n.wallId);
  if (!i) return null;
  let s;
  try {
    s = it(e, i);
  } catch {
    return null;
  }
  const o = Z(s.dir), r = n.side === "left" ? o : _(o, -1), a = n.side === "left" ? s.leftOff : s.rightOff;
  return { pt: M(M(s.a, _(s.dir, n.offset)), _(r, a)), dir: n.aim ? ke(gt(r) + n.aim) : r, normal: r };
}
function Es(e, t) {
  const n = [];
  for (let i = 0; i < di; i++) n.push(M(e, _(ke(360 * i / di), t)));
  return n;
}
function ui(e, t, n, i) {
  if (n >= 360) return Es(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * Ur)), o = gt(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(M(e, _(ke(o + n * a / s), i)));
  return r;
}
function Fr(e, t) {
  const n = t.props;
  if (n.kind !== "wall_light" && n.kind !== "motion_sensor" && n.kind !== "ceiling_light") return null;
  const i = Y(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? ui(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? ui(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Es(i.pt, n.poolRadius) : null;
  }
}
function Ms(e) {
  return e.normal ? M(e.pt, e.normal) : e.pt;
}
function Br(e, t) {
  const n = Y(e, t);
  if (!n) return null;
  const i = Ms(n);
  let s = null, o = 1 / 0;
  for (const r of e.zones) {
    if (!le(i, r.outline)) continue;
    const a = Math.abs(zt(r.outline));
    a < o && (s = r.id, o = a);
  }
  return s;
}
function Hr(e, t, n = Pe) {
  const i = Fr(e, t);
  if (!i) return [];
  const s = Y(e, t), o = Ms(s), r = we(n(e), o);
  if (!r) return [i];
  let a;
  try {
    a = Xi.intersection(sn(i), sn(r));
  } catch {
    return [i];
  }
  return a.flatMap((l) => l.map(ss));
}
function jr(e, t, n, i) {
  const s = Y(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, V(I(n, s.pt), s.dir)));
    return R(M(s.pt, _(s.dir, a)), n) <= i;
  }
  if (o.kind !== "equipment") return R(s.pt, n) <= i;
  if (o.shape === "circle") return R(s.pt, n) <= o.diameter / 2 + i;
  const r = I(n, s.pt);
  return Math.abs(V(r, s.dir)) <= o.width / 2 + i && Math.abs(V(r, Z(s.dir))) <= o.depth / 2 + i;
}
function As(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && jr(e, i[o], t, n)) return i[o].id;
  return null;
}
const qr = 60;
function on(e, t, n) {
  if (!Wi.has(t.props.kind)) return null;
  const i = Y(e, t);
  return i ? { from: i.pt, to: M(i.pt, _(i.dir, qr / n)) } : null;
}
function Is(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function Vr(e, t, n, i) {
  const s = t.placement, o = Y(e, t);
  if (!o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = gt(I(n, o.pt)), a = (f) => i ? Math.round(f / 15) * 15 : Math.round(f);
  if (s.mode === "free") return { ...s, rotation: _s(a(r)) };
  const l = Ss(r - gt(o.normal)), c = Math.max(-Dt, Math.min(Dt, a(l)));
  return Is(s, c);
}
class Ps extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function Ve(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Wr(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Kr(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Ps(s.message) : s;
  }
}
async function Zr(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Gr = 3;
function _t(e) {
  if (typeof e == "number")
    return e === Gr ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Yr {
  constructor(t, n) {
    this.hass = t, this.onChange = n, this.state = "idle", this.errorMessage = null, this.dirty = !1, this.baseRevision = null, this.dirtyVersion = 0, this.inflight = null;
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
  async saveAsNew(t, n) {
    if (this.inflight)
      return await this.inflight, null;
    const i = { ...t, id: nt(), name: n, revision: 0 }, s = await this.run(i, null, !1);
    return s === null ? null : { ...i, revision: s };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(t, n, i) {
    const s = this.doRun(t, n, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = s, s;
  }
  async doRun(t, n, i) {
    this.state = "saving", this.errorMessage = null;
    const s = this.dirtyVersion;
    this.onChange();
    try {
      const o = await Kr(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Ps ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = _t(o)), this.onChange(), null;
    }
  }
}
const Xr = {
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
  "binding.haDevicesLoading": "Loading Home Assistant devices…",
  "binding.haDevicesUnavailable": "Home Assistant devices unavailable",
  "binding.reload": "Reload from Home Assistant",
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
  "binding.onOff": "On / Off",
  "binding.slot": "Slot",
  "binding.event": "Event",
  "binding.separateOff": "Separate Off",
  "binding.autoEnabled": "Auto",
  "binding.autoByDoubleToggle": "Auto by double toggle",
  "binding.window": "Window, s",
  "binding.defaultOutput": "Default output",
  "binding.duplicate": "Two triggers of this device are identical; the first one (On, Off, Auto) wins.",
  "role.control": "Control",
  "role.motion": "Motion",
  "role.illuminance": "Illuminance",
  "role.temperature": "Temperature",
  "role.humidity": "Humidity",
  "role.state": "State",
  "role.power": "Power",
  "role.on": "On",
  "role.off": "Off",
  "role.auto": "Auto",
  "role.final": "Final state",
  "output.on": "On",
  "output.off": "Off",
  "output.auto": "Auto",
  "output.error": "Error",
  "output.line": "Output: {output}",
  "output.defaultNotConfigured": "default: not configured",
  "output.defaultUnavailable": "default: unavailable ({entities})",
  "output.notSaved": "Not saved yet",
  "output.noLive": "Live outputs are not available.",
  "bindstatus.bound": "Bound",
  "bindstatus.partial": "Partly bound",
  "bindstatus.unbound": "Not bound",
  "bindstatus.missing": "Entity missing in Home Assistant",
  "zone.default": "Room",
  "device.ceiling_light": "Ceiling light",
  "device.wall_light": "Wall light",
  "device.motion_sensor": "Motion sensor",
  "device.illuminance_sensor": "Illuminance sensor",
  "device.wall_switch": "Wall switch",
  "device.smart_button": "Smart button",
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
  "props.badSlot": "Slot is a whole number from 0 to 9.",
  "props.badWindow": "Window is a whole number of seconds from 1 to 10.",
  "props.badEvent": "Event cannot be empty.",
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
function p(e) {
  return Xr[e] ?? e;
}
const st = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function Ut(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const Mn = 12, z = "non-scaling-stroke", Qr = { on: "#facc15", auto: "#38bdf8", error: "#f43f5e" }, Jr = "#0f172a", ta = "#f43f5e", ea = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Os = 24;
function na(e, t, n) {
  const i = Os / t;
  return customElements.get("ha-icon") ? k`<foreignObject class="equipment-icon" x=${-i / 2} y=${-i / 2} width=${i} height=${i}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${i}px;color:${n};display:block`}></ha-icon></foreignObject>` : k`<g class="equipment-icon" transform=${`translate(${-i / 2} ${-i / 2}) scale(${i / 24})`}>
    <path d=${ea} fill=${n}></path></g>`;
}
const ia = "__preview__", sa = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, oa = /* @__PURE__ */ new WeakMap(), ra = (e) => Ut(oa, e, Pe);
function aa(e, t, n, i, s = n) {
  const o = e.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? k`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></rect>` : o.shape === "spot" ? k`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${z}></circle>` : k`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>`;
    case "wall_light":
      return k`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${z}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return k`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${z}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const c = l * Math.PI / 4;
        a += `M${Math.cos(c) * t * 1.15} ${Math.sin(c) * t * 1.15}L${Math.cos(c) * t * 1.6} ${Math.sin(c) * t * 1.6}`;
      }
      return k`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${z}></path>`;
    }
    case "wall_switch":
      return k`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></rect>`;
    case "smart_button":
      return k`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></rect>
        <circle class="dot" r=${t * 0.18} fill=${s}></circle>`;
    case "socket":
      return k`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return k`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${z}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${z}></path>`;
    case "exhaust_fan": {
      let a = "";
      for (let l = 0; l < 4; l++) {
        const c = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(c) * t * 0.85} ${Math.sin(c) * t * 0.85}`;
      }
      return k`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${z}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${z}></path>`;
    }
    default:
      return k`${b}`;
  }
}
function la(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return k`${b}`;
  const o = Mn / t.scale, r = s.shape === "circle" ? k`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${z}></circle>` : k`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${z}></rect>`;
  return k`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${na(s.icon, t.scale, n)}
    <text class="equipment-label" y=${Os / t.scale / 2 + o} text-anchor="middle" dominant-baseline="middle" font-size=${o * 0.85}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function ca(e, t) {
  return e === "bound" ? b : k`<circle class=${`bind-ring bind-${e}`} r=${Mn * 1.7 / t} fill="none" style=${`stroke:${sa[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : b} vector-effect=${z}></circle>`;
}
function da(e, t) {
  return k`<circle class="fault-mark" cx=${e * 0.6} cy=${-e * 0.6} r=${e * 0.3} fill=${ta} stroke=${t.background}
    stroke-width="1.5" vector-effect=${z}></circle>`;
}
function ua(e, t, n, i) {
  var v, w;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Mn / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((v = n.selection) == null ? void 0 : v.kind) === "device" && n.selection.id === e.id, c = !i && ae(e.props.kind) ? (w = n.containerState) == null ? void 0 : w.call(n, e) : void 0, f = c ? Qr[c.output] : void 0, d = f ?? s.deviceFill, h = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (c ? ` out-${c.output}` : ""), u = i ? "0.5" : n.dim ? String(s.dimOpacity) : b, m = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : r * 1.6;
  return k`
    <g class=${h} data-id=${e.id} opacity=${u} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? k`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${z}></circle>` : b}
      ${e.props.kind === "equipment" ? la(e, n, o, a) : k`<g transform=${`rotate(${a})`}>${aa(e, r, o, d, f ? Jr : o)}</g>`}
      ${c != null && c.fault ? da(r, s) : b}
      ${n.bindingStatus && !i ? ca(n.bindingStatus(e), n.scale) : b}
    </g>`;
}
function ha(e, t, n, i) {
  const s = Hr(e, t, ra);
  if (s.length === 0) return b;
  const o = n.palette, r = t.invalid ? o.invalid : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : b, l = s.map(st).join("");
  return t.props.kind === "ceiling_light" ? k`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${z}></path>` : k`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${z}></path>`;
}
function pa(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return b;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? on(e, i, t.scale) : null;
  if (!s) return b;
  const o = t.palette.selection;
  return k`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : b}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${z}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${z} style="cursor:grab"></circle>
  </g>`;
}
function fa(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Y(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: ia, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Y(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return k`
    <g class="cones">${t.showCones ? n.map((i) => ha(e, i.d, t, i.preview)) : b}</g>
    <g class="devices">${n.map((i) => ua(i.d, i.pose, t, i.preview))}</g>
    ${pa(e, t)}`;
}
function Et(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function Cs(e) {
  return `${e.toFixed(2)} ${p("unit.m2")}`;
}
const ga = /* @__PURE__ */ new WeakMap(), ma = /* @__PURE__ */ new WeakMap(), Ns = /* @__PURE__ */ new WeakMap();
function Ne(e, t, n) {
  const i = Z(e.dir), s = M(e.a, _(e.dir, t)), o = M(e.a, _(e.dir, n));
  return [M(s, _(i, e.leftOff)), M(o, _(i, e.leftOff)), I(o, _(i, e.rightOff)), I(s, _(i, e.rightOff))];
}
function oe(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = it(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function ba(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const a = e[r], l = e[(r + 1) % e.length], c = a.x * l.y - l.x * a.y;
    n += c, i += (a.x + l.x) * c, s += (a.y + l.y) * c;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return le(o, e) ? o : t;
}
const U = "non-scaling-stroke";
function va(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = oe(e, a.id);
    if (!l) continue;
    const c = Z(l.dir);
    for (const [f, d, h] of [[a.a, l.a, l.dir], [a.b, l.b, _(l.dir, -1)]]) {
      const u = e.nodes.find((P) => P.id === f);
      if (!u || u.host || n.get(f) !== 1) continue;
      const m = M(d, _(c, l.leftOff + i)), v = I(d, _(c, l.rightOff + i)), w = _(c, 1), y = _(M(m, v), 0.5), x = M(I(y, _(w, -o)), _(h, s / 2)), S = I(I(y, _(w, o)), _(h, s / 2)), E = [m, x, S, v];
      r.push(k`<path class="wall-break" d=${`M${E.map((P) => `${P.x} ${P.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${U}></path>`);
    }
  }
  return r.length ? k`${r}` : b;
}
function ya(e, t, n) {
  const i = t.palette, s = ba(e.outline, e.seed), o = 12 / t.scale;
  return k`
    <path class="zone${e.broken ? " broken" : ""}" d=${st(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${U}></path>
    <text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Cs(ds(e.outline))}</tspan>
    </text>`;
}
function $a(e, t, n) {
  const i = Z(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : _(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], c = M(M(e.a, _(e.dir, a)), _(o, r)), f = M(M(e.a, _(e.dir, l)), _(o, r)), d = M(c, _(o, t.width)), h = Tt(I(d, c), I(f, c)) > 0 ? 1 : 0;
  return k`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${U}></line>
    <path d=${`M${d.x} ${d.y}A${t.width} ${t.width} 0 0 ${h} ${f.x} ${f.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${U}></path>`;
}
function wa(e, t, n) {
  const i = Z(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = M(M(e.a, _(e.dir, t.offset)), _(i, r)), l = M(M(e.a, _(e.dir, t.offset + t.width)), _(i, r));
    return k`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${U}></line>`;
  });
  return k`${o}`;
}
function xa(e, t, n) {
  const i = oe(e, t.wallId);
  if (!i) return b;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = Ne(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return k`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${st(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? $a(i, t, o) : t.kind === "window" ? wa(i, t, o) : b}
    </g>`;
}
function hi(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = M(e, _(n, i)), l = M(t, _(n, i)), c = (d, h) => {
    const u = M(h, _(n, i + r));
    return k`<line x1=${d.x} y1=${d.y} x2=${u.x} y2=${u.y} stroke=${o} stroke-width="0.75" vector-effect=${U}></line>`;
  }, f = M(_(M(a, l), 0.5), _(n, 9 / s.scale));
  return k`
    <g class="dim">
      ${c(M(e, _(n, 2 / s.scale)), e)}${c(M(t, _(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${U}></line>
      <text x=${f.x} y=${f.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Et(R(e, t))}</text>
    </g>`;
}
function ka(e, t) {
  const n = t.selection;
  if (!n) return b;
  const i = t.palette, s = 4 / t.scale, o = (r) => k`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : b;
  }
  if (n.kind === "wall") {
    const r = Ut(Ns, e, Ae).get(n.id), a = oe(e, n.id);
    if (!r || !a) return b;
    const l = Z(a.dir);
    return k`
      <path d=${st(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${U}></path>
      ${o(a.a)}${o(a.b)}
      ${hi(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((h) => h.id === n.id), a = r ? oe(e, r.wallId) : null;
    if (!r || !a) return b;
    const l = _(Z(a.dir), -1), c = a.rightOff + 18 / t.scale, f = (h) => M(a.a, _(a.dir, h)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return k`
      <path d=${st(Ne(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${U}></path>
      ${d.filter(([h, u]) => u - h >= 1).map(([h, u]) => hi(f(h), f(u), l, c, t))}`;
  }
  return b;
}
function _a(e, t, n) {
  return R(e, t) < 1e-6 ? null : Ne(ts(e, t, n.thickness, n.baseline), 0, R(e, t));
}
function Sa(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? oe(e, r.wallId) : null;
  return k`
    ${o ? k`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${U}></path>` : b}
    ${(n.walls ?? []).map((l) => {
    const c = _a(l.a, l.b, l.props);
    return k`<g class="preview-wall">
        ${c ? k`<path d=${st(c)} fill=${i.selection} fill-opacity="0.35"></path>` : b}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${U}></line></g>`;
  })}
    ${r && a ? k`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${st(Ne(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : b}
    ${Ma(e, t)}`;
}
function Ea(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return k`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${U}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${U}></rect></g>`;
}
function Ma(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? Ea(n.anchor, t) : b, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (u) => u / t.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let f, d = b;
  if (o.kind === "node") {
    const u = r(5);
    f = k`<g class="snap-node"><rect x=${a - u} y=${l - u} width=${2 * u} height=${2 * u} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${U}></rect></g>`;
  } else if (o.kind === "mid") {
    const u = r(11) / Math.sqrt(3), m = `M${a} ${l - u}L${a + u * 0.866} ${l + u / 2}L${a - u * 0.866} ${l + u / 2}Z`;
    f = k`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${U}></path></g>`;
  } else if (o.kind === "wall") {
    const u = r(5), m = `M${a - u} ${l - u}L${a + u} ${l + u}M${a - u} ${l + u}L${a + u} ${l - u}`;
    f = k`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${U}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${U}></path></g>`;
    const v = o.endpoint.kind === "wall" ? Ut(Ns, e, Ae).get(o.endpoint.wallId) : void 0;
    v && (d = k`<path class="snap-wall-hl" d=${st(v)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${U}></path>`);
  } else {
    const u = r(4), m = `M${a - u} ${l}H${a + u}M${a} ${l - u}V${l + u}`;
    f = k`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${U}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${U}></path></g>`;
  }
  const h = p(`snapmark.${o.kind}`);
  return k`
    ${d}${s}${f}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${U} font-family="system-ui, sans-serif">${h}</text>`;
}
function Aa(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = Ut(ga, n, (d) => os(d, !0)), o = n.walls.filter((d) => d.type === "railing" || d.type === "fence"), r = o.length ? Ut(ma, n, is) : null, a = 8 / t.scale, l = t.selection, c = (t.mode ?? "plan") === "plan", f = c ? b : String(i.dimOpacity);
  return k`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${f}>${n.zones.map((d) => ya(d, t, (l == null ? void 0 : l.kind) === "zone" && l.id === d.id))}</g>
    <path class="walls" d=${s.map((d) => d.map(st).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${f}></path>
    ${r ? k`<g class="railings" opacity=${f}>${o.flatMap((d) => (r.get(d.id) ?? []).map((h) => k`<path d=${st(h)} fill=${i.railing}></path>`))}</g>` : b}
    <g class="openings" opacity=${f}>${n.openings.map((d) => xa(n, d, t))}</g>
    <g class="wall-breaks" opacity=${f}>${va(n, t)}</g>
    <g class="devices-layer">${fa(n, {
    palette: i,
    scale: t.scale,
    selection: l,
    showCones: t.showCones ?? !0,
    dim: c,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0,
    containerState: t.containerState
  })}</g>
    <g class="selection">${ka(n, t)}</g>
    <g class="preview">${Sa(n, t)}</g>`;
}
const Ia = {
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
}, Pa = {
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
function Oa(e) {
  return e ? Ia : Pa;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ca = { PROPERTY: 3 }, Na = (e) => (...t) => ({ _$litDirective$: e, values: t });
class La {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, n, i) {
    this._$Ct = t, this._$AM = n, this._$Ci = i;
  }
  _$AS(t, n) {
    return this.update(t, n);
  }
  update(t, n) {
    return this.render(...n);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Da = {}, Ta = (e, t = Da) => e._$AH = t;
class za extends La {
  constructor(t) {
    if (super(t), t.type !== Ca.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? mt : (Ta(t), n);
  }
}
const G = Na(za);
function Ls(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Ra(e, t, n) {
  return M(e, _(wn(I(t, e)), n));
}
function pi(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Ft(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? Ls(r, t) : t, c = r !== void 0 && l.y === r.y, f = (y) => !r || Math.abs(c ? y.y - r.y : y.x - r.x) <= 1;
  let d = null;
  for (const y of e.nodes) {
    if (a.has(y.id)) continue;
    const x = { x: y.x, y: y.y }, S = R(x, l);
    S <= i && f(x) && (!d || S < d.d) && (d = { id: y.id, pt: x, d: S });
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const h = e.walls.filter((y) => !a.has(y.a) && !a.has(y.b)).map((y) => ({ w: y, f: it(e, y) })).filter((y) => y.f.len > 1e-9);
  let u = null;
  for (const { w: y, f: x } of h) {
    const S = { x: (x.a.x + x.b.x) / 2, y: (x.a.y + x.b.y) / 2 }, E = R(S, l);
    E <= i && f(S) && (!u || E < u.d) && (u = { wallId: y.id, pt: S, offset: x.len / 2, d: E });
  }
  if (u)
    return { pt: u.pt, kind: "mid", endpoint: { kind: "wall", wallId: u.wallId, offset: u.offset } };
  const m = (y) => {
    let x = null;
    for (const { w: S, f: E } of h) {
      const P = Z(E.dir), N = y ? [E.leftOff, -E.rightOff].filter((T) => T !== 0) : [0];
      for (const T of N) {
        const C = M(E.a, _(P, T)), F = r ? ut(r, I(l, r), C, E.dir) : M(C, _(E.dir, V(I(l, C), E.dir)));
        if (!F) continue;
        const H = V(I(F, C), E.dir);
        if (H < 0 || H > E.len) continue;
        const j = R(F, l);
        j <= i && (!x || j < x.d) && (x = { d: j, res: { pt: F, kind: "wall", endpoint: { kind: "wall", wallId: S.id, offset: H } } });
      }
    }
    return x ? x.res : null;
  }, v = m(!1);
  if (v) return v;
  const w = m(!0);
  if (w) return w;
  if (s && s > 0) {
    const y = (S) => Math.round(S / s) * s, x = r ? c ? { x: y(l.x), y: r.y } : { x: r.x, y: y(l.y) } : { x: y(l.x), y: y(l.y) };
    return pi(x, "grid");
  }
  return pi(l, "none");
}
function Ua(e, t, n) {
  const i = I(n, t), s = V(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, V(I(e, t), i) / s));
  return R(e, { x: t.x + i.x * o, y: t.y + i.y * o });
}
function Fa(e, t, n) {
  return t.some((i, s) => Ua(e, i, t[(s + 1) % t.length]) <= n);
}
function Ds(e, t, n) {
  for (const [i, s] of Ae(e))
    if (le(t, s) || Fa(t, s, n)) return i;
  return null;
}
function Ba(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = it(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Bt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Ha(e, t, n, i) {
  const s = Ba(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((c) => c.id === a);
        if (l && R(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = Ds(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && le(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function ja(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, a = null;
  const l = (u) => {
    t = u, e.select(u);
  }, c = () => {
    n = null, i = null, s = null, a = null, o = !1;
  }, f = (u) => u.kind === "none" ? { x: Math.round(u.pt.x), y: Math.round(u.pt.y) } : u.pt, d = (u, m, v) => Bt(it(u, u.walls.find((w) => w.id === m)), v).t;
  function h(u) {
    const m = n;
    if (!(!m || !i) && !(u.pt.x === r.x && u.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const v = Ft(i, u.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: u.shift,
          excludeNodeIds: [m.nodeId]
        }), w = v.endpoint, y = (v.kind === "wall" || v.kind === "mid") && w.kind === "wall", x = v.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, S = i.nodes.find((T) => T.id === m.nodeId), E = !!S.host && y && w.kind === "wall" && w.wallId === S.host.wallId;
        let P = i;
        if (S.host && !E) {
          const T = structuredClone(i);
          delete T.nodes.find((C) => C.id === m.nodeId).host, P = T;
        }
        let N = Ar(P, m.nodeId, f(v));
        if (x && w.kind === "node")
          N = Cr(N, m.nodeId, w.nodeId);
        else if (y && w.kind === "wall" && !E) {
          const T = i.walls.find((C) => C.id === w.wallId);
          if (T && T.a !== m.nodeId && T.b !== m.nodeId) {
            const C = structuredClone(N);
            C.nodes.find((F) => F.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, N = yt(C, N);
          }
        }
        s = N;
      } else if (m.kind === "wall") {
        const v = i.walls.find((x) => x.id === m.wallId), w = Ft(i, u.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: u.shift,
          excludeNodeIds: [v.a, v.b]
        }), y = I(w.pt, m.origin);
        s = Pr(
          i,
          m.wallId,
          w.kind === "none" ? { x: Math.round(y.x), y: Math.round(y.y) } : y
        );
      } else {
        const v = i.openings.find((w) => w.id === m.openingId);
        s = fs(i, v.id, d(i, v.wallId, u.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(u) {
      c(), r = u.pt;
      const m = e.level(), v = t, w = Ha(m, u.pt, e.tolMm(), v);
      if (l(w), !!w) {
        if (a = i = s = m, w.kind === "node") {
          let y = w.id;
          const x = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((S) => S.id === v.id) : void 0;
          if (u.alt && x) {
            const S = Or(m, x.id, x.a === w.id ? "a" : "b");
            i = s = S.level, y = S.nodeId, l({ kind: "node", id: y });
          }
          n = { kind: "node", nodeId: y, origin: W(i, y) };
        } else if (w.kind === "wall")
          n = { kind: "wall", wallId: w.id, origin: u.pt };
        else if (w.kind === "opening") {
          const y = m.openings.find((x) => x.id === w.id);
          n = { kind: "opening", openingId: y.id, grab: d(m, y.wallId, u.pt) - y.offset };
        }
      }
    },
    move(u) {
      h(u);
    },
    up(u) {
      n && h(u);
      const m = o, v = s, w = a;
      c(), m && v && w && v !== w && e.commit(v);
    },
    key(u) {
      return u === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      c(), l(null);
    }
  };
}
function re(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function Ts() {
  let e = "", t = "", n = "first";
  const i = () => {
    e = "", t = "", n = "first";
  }, s = () => e !== "" || t !== "";
  return {
    get first() {
      return e;
    },
    get second() {
      return t;
    },
    typing: s,
    clear: i,
    key(o, r, a) {
      return /^[0-9]$/.test(o) || o === " " ? (n === "first" ? e += o : t += o, !0) : o === "Backspace" ? (n === "first" ? e = e.slice(0, -1) : t = t.slice(0, -1), !0) : o === "Tab" ? (n = n === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : a(), !0) : !1;
    },
    tracker: (o) => ({ first: e, second: t, field: n, at: o })
  };
}
function qa(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = Ts(), s = () => {
    t = null, i.clear();
  }, o = (c) => Ft(e.level(), c, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const c = re(i.first, { min: 1 }), f = re(i.second, { min: 1 });
      return c === null || f === null ? null : { x: t.x + (n.x >= t.x ? c : -c), y: t.y + (n.y >= t.y ? f : -f) };
    }
    return o(n).pt;
  }
  const a = (c, f) => Math.abs(c.x - f.x) < 1 || Math.abs(c.y - f.y) < 1;
  function l(c) {
    if (!t || a(t, c)) return;
    const f = Mr(e.level(), t, c, e.wallProps(), e.boxMeasure());
    f !== e.level() && (e.commit(f), s());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !t) {
        t = o(c.pt).pt;
        return;
      }
      const f = r();
      f && l(f);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return t ? i.key(c, () => {
        const f = r();
        f && l(f);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const c = r(), f = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!c || a(t, c)) return f;
      const d = e.wallProps(), h = vs(t, c, d.thickness, e.boxMeasure());
      return h && (f.walls = h.map((u, m) => ({ a: u, b: h[(m + 1) % 4], props: { ...d, baseline: "center" } }))), f;
    },
    cancel() {
      s();
    }
  };
}
const fi = (e) => Math.round(e * 1e3) / 1e3 + 0;
function Va(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = Ts(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, c = (h, u) => Ft(e.level(), h, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: u && n !== null });
  function f() {
    if (!n) return null;
    const h = c(s, o), u = re(a.first, { min: 1 }), m = re(a.second);
    if (u === null && m === null) return { pt: h.pt, endpoint: h.endpoint, snap: h };
    const v = u ?? R(n, h.pt);
    let w = h.pt;
    if (m === null && R(n, h.pt) < 1) {
      const E = r ?? { x: 1, y: 0 };
      w = { x: n.x + E.x, y: n.y + E.y };
    }
    if (m !== null) {
      const E = m * Math.PI / 180;
      w = { x: n.x + Math.cos(E), y: n.y - Math.sin(E) };
    }
    const y = Ra(n, w, v), x = { x: fi(y.x), y: fi(y.y) }, S = e.level().nodes.find((E) => Math.hypot(E.x - x.x, E.y - x.y) < 1);
    return S ? { pt: { x: S.x, y: S.y }, endpoint: { kind: "node", nodeId: S.id }, snap: h } : { pt: x, endpoint: { kind: "free", pt: x }, snap: h };
  }
  function d() {
    const h = f();
    if (!t || !h) return;
    const u = Er(e.level(), t, h.endpoint, e.wallProps());
    if (u.wallId === null || u.endNodeId === null) return;
    e.commit(u.level);
    const m = u.level.walls.find((S) => S.id === u.wallId);
    i === null && (i = m.a);
    const v = u.endNodeId === i, w = n, y = W(u.level, u.endNodeId), x = R(w, y);
    if (x > 0 && (r = { x: (y.x - w.x) / x, y: (y.y - w.y) / x }), a.clear(), v) {
      l();
      return;
    }
    t = { kind: "node", nodeId: u.endNodeId }, n = W(u.level, u.endNodeId);
  }
  return {
    id: "wall",
    down(h) {
      if (s = h.pt, o = h.shift, !t) {
        const u = c(h.pt, !1);
        t = u.endpoint, n = u.pt;
        return;
      }
      d();
    },
    move(h) {
      s = h.pt, o = h.shift;
    },
    up() {
    },
    key(h, u) {
      return o = u.shift, t ? a.key(h, d, l) : !1;
    },
    preview() {
      if (!n) return { snap: Ft(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const h = f();
      return {
        walls: [{ a: n, b: h.pt, props: e.wallProps() }],
        snap: h.snap,
        tracker: a.tracker(h.pt),
        orthoFrom: o ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      l();
    }
  };
}
function Wa(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = Ds(o, n, e.tolMm());
    if (!r) return null;
    const a = it(o, o.walls.find((c) => c.id === r)), l = Bt(a, n).t;
    return { wallId: r, center: l, pt: M(a.a, _(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = $r(e.level(), r.wallId, t, r.center, a.width, a);
      l.openingId !== null && e.commit(l.level);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !Oe(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function Ka(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = vr(n, t.pt, e.zoneName());
      i.zoneId !== null && (e.commit(i.level), (s = e.zonePlaced) == null || s.call(e), e.select({ kind: "zone", id: i.zoneId }));
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
const zs = 3, gi = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function Rs(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((f) => f.id === o), l = a ? Y(s, a) : null, c = a ? on(s, a, e.scale()) : null;
    return !l || !c ? 0 : Ss(gt(I(r, l.pt)) - gt(I(c.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && R(s.pt, t.downPt) <= zs / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((d) => d.id === t.id), r = o ? Y(t.original, o) : null;
    if (!o || !r) return;
    const a = R(s.pt, r.pt), l = (gt(I(s.pt, r.pt)) - t.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, f = Vr(t.original, o, c, s.shift);
    t.work = JSON.stringify(f) === JSON.stringify(o.placement) ? t.original : kn(t.original, o.id, f);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((c) => c.id === s), l = a ? on(r, a, e.scale()) : null;
      return !a || !l || R(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && gi(o.work, o.id) !== gi(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function mi(e, t, n) {
  const i = it(e, e.walls.find((s) => s.id === t));
  return Bt(i, n).side > 0 ? "left" : "right";
}
function Us(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Fs(e, t, n, i, s = 0) {
  const o = $n[n];
  if (o.includes("wall")) {
    const r = Ft(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: mi(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of t.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const f = it(t, c), d = Math.max(0, Math.min(f.len, Bt(f, i).t)), h = Math.hypot(i.x - (f.a.x + f.dir.x * d), i.y - (f.a.y + f.dir.y * d));
        (!l || h < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : f.len, d: h });
      }
      if (l) return { mode: "wall", wallId: l.id, side: mi(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Us(e, i), rotation: s } : null;
}
function Za(e, t, n) {
  return ls(e.deviceDefaults(t), "free", n.mode);
}
function Ga(e, t) {
  let n = null, i;
  const s = Rs(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = Fs(e, r, t, n);
    if (!a)
      return { placement: { mode: "free", ...Us(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const l = Za(e, t, a), c = ai(r, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !c };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), c = Fi(p(`device.${t}`), l.devices.filter((d) => d.props.kind === t).map((d) => d.name)), f = ai(l, a.props, a.placement, c);
      f.deviceId !== null && (e.commit(f.level), i = f.deviceId, e.select({ kind: "device", id: f.deviceId }));
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
const bi = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, Ya = (e, t, n) => n === void 0 || bi(e, n) !== bi(t, n);
function Xa(e) {
  let t = null, n = null;
  const i = Rs(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (h) => {
    t = h, e.select(h);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function f(h) {
    if (!n || !s || !r && R(h.pt, a) <= zs / e.scale()) return;
    if (r = !0, h.pt.x === a.x && h.pt.y === a.y) {
      o = s;
      return;
    }
    const u = s.devices.find((P) => P.id === n.id);
    if (!u) return;
    const m = h.shift ? Ls(a, h.pt) : h.pt, v = u.placement, w = v.mode === "free", y = w ? null : Y(s, u), x = v.mode === "free" ? v.rotation : y ? _s(Math.round(gt(y.dir))) : 0, S = Fs(e, s, u.props.kind, w ? M(m, n.grab) : m, x), E = S && S.mode === "wall" && v.mode === "wall" && v.aim !== void 0 ? { ...S, aim: v.aim } : S;
    o = E ? kn(s, u.id, d(s, u.placement, E, m)) : s;
  }
  function d(h, u, m, v) {
    if (u.mode !== "wall" || m.mode !== "wall" || m.wallId !== u.wallId) return m;
    const w = h.walls.find((N) => N.id === u.wallId);
    if (!w) return m;
    const y = it(h, w), x = Math.max(0, Math.min(y.len, u.offset + V(I(v, a), y.dir))), S = Bt(y, v).side, E = e.tolMm(), P = u.side === "left" ? S < -(y.rightOff + E) ? "right" : "left" : S > y.leftOff + E ? "left" : "right";
    return { ...m, offset: x, side: P };
  }
  return {
    id: "device-select",
    down(h) {
      c(), a = h.pt;
      const u = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, h)) return;
      const v = As(u, h.pt, m);
      if (!v) {
        l(null);
        return;
      }
      l({ kind: "device", id: v });
      const w = u.devices.find((x) => x.id === v), y = Y(u, w);
      s = o = u, n = { id: v, grab: y && w.placement.mode === "free" ? I(y.pt, h.pt) : { x: 0, y: 0 } };
    },
    move(h) {
      i.active() ? i.move(h) : f(h);
    },
    up(h) {
      if (i.end(h)) return;
      n && f(h);
      const u = o, m = s, v = r, w = n == null ? void 0 : n.id;
      c(), v && u && m && u !== m && Ya(m, u, w) && e.commit(u);
    },
    key(h) {
      return h === "Escape" && i.cancel() ? !0 : h === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const h = i.working();
      return h ? { level: h } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), c(), l(null);
    }
  };
}
function Qa(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = As(e.level(), t.pt, e.tolMm());
      e.select(n ? { kind: "device", id: n } : null);
    },
    move() {
    },
    up() {
    },
    key(t) {
      return t !== "Escape" ? !1 : (e.select(null), !0);
    },
    preview: () => ({}),
    cancel() {
    }
  };
}
const Ja = ["select", "box", "wall", "door", "window", "opening", "zone"], tl = [
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
], el = ["binding-select"];
function An(e) {
  return e === "plan" ? Ja : e === "equipment" ? tl : el;
}
function rn(e, t) {
  switch (e) {
    case "select":
      return ja(t);
    case "box":
      return qa(t);
    case "wall":
      return Va(t);
    case "door":
    case "window":
    case "opening":
      return Wa(t, e);
    case "zone":
      return Ka(t);
    case "device-select":
      return Xa(t);
    case "binding-select":
      return Qa(t);
    default:
      return Ga(t, e);
  }
}
function We(e, t) {
  return (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((i) => i.id === t.id);
}
function nl(e) {
  switch (e.saveState) {
    case "saving":
      return p("save.saving");
    case "conflict":
      return p("save.conflict");
    case "error":
      return p("save.error");
    default:
      return e.dirty ? p("save.dirty") : p(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function il(e) {
  return g`
    <div class="top"><div class="bar">
      ${e.lead ?? b}
      ${e.plans.length > 1 ? g`
        <select class="plan-pick" aria-label=${p("plan.pick")} title=${p("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${G(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => g`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : b}
      <button class="btn" data-action="new-plan" title=${p("plan.new")} aria-label=${p("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${p("plan.delete")} aria-label=${p("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${p("action.undo")} aria-label=${p("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${p("action.redo")} aria-label=${p("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${nl(e)}${e.saveState === "error" && e.errorMessage ? g`: ${e.errorMessage}` : b}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${p("action.save")}</button>
    </div>${e.steps}</div>`;
}
function sl(e, t, n) {
  return g`
    <div class="tools">
      ${An(e).map((i) => g`
        ${i === "zone" || i === "ceiling_light" ? g`<div class="tool-sep"></div>` : b}
        <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
          ${p(`tool.${i}`)}</button>`)}
    </div>`;
}
const Zt = ["plan", "equipment", "binding"], Ke = (e, t, n) => p(e === 1 ? t : n).replace("{n}", String(e));
function ol(e, t, n) {
  const { walls: i, zones: s, devices: o } = t;
  switch (e) {
    case "plan":
      return {
        text: `${Ke(i.length, "steps.wall", "steps.walls")}, ${Ke(s.length, "steps.room", "steps.rooms")}`,
        done: i.length > 0 && s.length > 0
      };
    case "equipment":
      return { text: Ke(o.length, "steps.device", "steps.devices"), done: o.length > 0 };
    case "binding": {
      const r = o.length - mn(o.map(n));
      return {
        text: p("steps.bound").replace("{b}", String(r)).replace("{n}", String(o.length)),
        done: o.length > 0 && r === o.length
      };
    }
  }
}
const vi = (e, t) => p(e).replace("{step}", p(`mode.${t}`));
function rl(e) {
  const t = Zt.indexOf(e.mode), n = Zt[t - 1], i = Zt[t + 1];
  return g`
    <nav class="steps" aria-label=${p("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${G(e.planName)} aria-label=${p("plan.name")} title=${p("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${p("steps.app")}</span>
      </div>
      ${Zt.map((s, o) => {
    const r = ol(s, e.level, e.status), a = s === e.mode;
    return g`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : b} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${p(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${Zt.length + 1}</span><span class="name">${p("mode.automation")}</span>
        <span class="state">${p("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${vi("steps.back", n)}</button>` : b}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${vi("steps.next", i)}</button>` : g`<button class="btn primary" data-nav="next" @click=${() => e.onNextUnbound()}>${p("steps.nextUnbound")}</button>`}
      </div>
    </nav>`;
}
const al = ["unbound", "bound", "all"], ll = /* @__PURE__ */ new WeakMap();
function Bs(e) {
  return Ut(ll, e, (t) => [...t.devices].sort((n, i) => n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function cl(e, t, n) {
  const i = Bs(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const yi = (e) => p(`device.${e.props.kind}`), dl = (e, t) => e === "all" || e === "bound" == (t === "bound");
function ul(e, t, n) {
  return t === 0 ? p("binding.noDevices") : n || e.filter === "all" ? p("binding.noMatch") : p(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function $i(e) {
  const t = p(e.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function hl(e) {
  var r;
  if (e.collapsed) return g`<div class="blist collapsed">${$i(e)}</div>`;
  const t = Bs(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: mn(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => dl(e.filter, l) && (!i || a.name.toLowerCase().includes(i) || yi(a).toLowerCase().includes(i))), o = ((r = e.selection) == null ? void 0 : r.kind) === "device" ? e.selection.id : null;
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${p("binding.show")}>
          ${al.map((a) => g`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${p(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${$i(e)}
      </div>
      <input class="list-search" type="search" placeholder=${p("binding.search")} aria-label=${p("binding.search")}
        .value=${G(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? g`<p class="empty">${ul(e, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const c = ko(a);
    return g`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${p(`bindstatus.${l}`)} title=${p(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${yi(a)}</small></span>
            <span class="cnt">${c.filled}/${c.total}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function A(e, t) {
  return g`<label class="row"><span>${e}</span>${t}</label>`;
}
function K(e, t, n, i) {
  return g`<select class="val" data-field=${i ?? b} .value=${G(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => g`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function $t(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return g`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? b}
    placeholder=${e.placeholder ?? b} title=${e.placeholder ?? b} .value=${G(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = re(s.value, e.rule);
    if (o === null) {
      s.value = t, n(p(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(p("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function pl() {
  return {
    door: { width: fe.door, hinge: "start", swing: "left" },
    window: { width: fe.window, outside: "left" },
    opening: { width: fe.opening },
    zoneName: null
  };
}
function fl(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function Hs(e) {
  return Fi(p("zone.default"), e.zones.map((t) => t.name));
}
const gl = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function ml(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? Hs(e.level);
    return g`
      <h4>${p("props.nextZone")}</h4>
      ${A(p("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${G(r)}
        @change=${(a) => {
      const l = a.target, c = l.value.trim();
      if (!c) {
        l.value = r;
        return;
      }
      c !== r && e.setNext({ ...t, zoneName: c });
    }} />`)}`;
  }
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return b;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return g`
    <h4>${p(`props.next.${n}`)}</h4>
    ${A(`${p("props.width")}, ${p("unit.mm")}`, $t({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      o({ width: r });
    }
  }))}
    ${n === "door" ? g`
      ${A(p("props.hinge"), K(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${A(p("props.swing"), K(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : b}
    ${n === "window" ? A(p("props.outside"), K(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : b}`;
}
class bl {
  constructor(t, n = 200) {
    this.cap = n, this.past = [], this.future = [], this.present = t;
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
class vl {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await Ve(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(Vn(p("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = _t(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await Wr(this.h.hass, t);
    this.h.drafts.cancel(), this.h.save.reset(n.revision), this.adopt(n), this.h.drafts.setLastPlanId(n.id), this.offerDraft(this.h.drafts.read(n.id));
  }
  /** Closes the open dialog when it is of the given kind. */
  closeDialog(t) {
    var n;
    ((n = this.h.dialog) == null ? void 0 : n.kind) === t && (this.h.dialog = null);
  }
  offerDraft(t) {
    this.h.pendingDraft = t, t ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Ve(this.h.hass);
      } catch {
      }
  }
  /** Options of the plan selector: stored plans plus the open (maybe unsaved or renamed) one. */
  planOptions() {
    const t = this.h.plan, n = this.h.plans.map((i) => ({ id: i.id, name: i.id === t.id ? t.name : i.name }));
    return n.some((i) => i.id === t.id) || n.push({ id: t.id, name: t.name }), n;
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
    } catch (n) {
      this.h.notice = _t(n);
    }
  }
  /** "Discard and open": drop the unsaved edits (and their draft, unless it is an undecided older one). */
  confirmSwitch() {
    var n;
    const t = ((n = this.h.dialog) == null ? void 0 : n.kind) === "switch" ? this.h.dialog.to : null;
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
    this.h.toolId = An(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(Vn(p("plan.default"))), this.offerDraft(null);
  }
  requestDelete() {
    !this.h.plan || this.busy() || (this.h.dialog = { kind: "delete" });
  }
  async confirmDelete() {
    var n;
    this.closeDialog("delete");
    const t = this.h.plan;
    if (!(!t || !this.h.hass || this.busy())) {
      this.h.deleting = !0;
      try {
        if (this.h.save.baseRevision !== null)
          try {
            await Zr(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = _t(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Ve(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = _t(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(To) }, this.h.history = new bl(this.h.plan.levels[0]), this.h.activeTool.cancel(), this.h.activeTool = rn(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.needFit = !0;
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
    var n;
    if (this.h.save.state === "saved") {
      this.h.drafts.setLastPlanId(this.h.plan.id), this.refreshPlans(), this.h.drafts.cancel();
      for (const i of t) ((n = this.h.pendingDraft) == null ? void 0 : n.planId) !== i && this.h.drafts.clear(i);
      this.h.save.dirty && !this.draftBlocked() && this.h.drafts.schedule(() => this.makeDraft());
    }
  }
  currentPlan() {
    const t = this.h.plan, n = t.levels.map((i, s) => s === 0 ? this.h.history.current : i);
    return { ...t, levels: n, revision: this.h.save.baseRevision ?? 0 };
  }
  async doSave() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.save(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.save.state === "conflict" && (this.h.dialog = { kind: "conflict" }));
  }
  async doOverwrite() {
    !this.h.plan || this.h.save.state === "saving" || (await this.h.save.overwrite(this.currentPlan()), this.afterSaved(this.h.plan.id), this.h.dialog = this.h.save.state === "conflict" ? { kind: "conflict-again" } : null);
  }
  async doSaveAsNew() {
    if (!this.h.plan || this.h.save.state === "saving") return;
    const t = `${this.h.plan.name} ${p("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class yl {
  constructor(t) {
    this.h = t, this.error = null, this.regs = null, this.tried = !1, this.pending = !1, this.base = null, this.merged = null;
  }
  /** A registry load is in progress. */
  get loading() {
    return this.pending;
  }
  get() {
    var r;
    const t = (r = this.h.hass) == null ? void 0 : r.states, n = this.base;
    !n || !Tr(n.states, t) ? this.base = { states: t, meta: Dr(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Rr(i, this.regs) : i;
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
    const t = this.h.hass;
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), zr(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = p("binding.registryError").replace("{error}", _t(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const wi = Vi("", "");
function $l(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current) ?? wi;
    },
    commit: (t) => e.commit(t),
    scale: () => e.view.scale,
    tolMm: () => 10 / e.view.scale,
    grid: () => e.grid ? 100 : null,
    wallProps: () => ({ type: e.wallType, thickness: e.thickness, baseline: "center" }),
    boxMeasure: () => e.boxMeasure,
    select: (t) => {
      e.selection = t, e.fillNotice = null, e.mode !== "binding" && (e.notice = null);
    },
    deviceDefaults: (t) => e.nextProps[t],
    openingDefaults: (t) => fl(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? Hs(((t = e.history) == null ? void 0 : t.current) ?? wi);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    }
  };
}
const js = Object.keys($n), wl = (e) => js.includes(e);
function xl() {
  return Object.fromEntries(js.map((e) => [e, At(e, "free")]));
}
const qs = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Dt, max: Dt, signed: !0 }, bad: "props.badAim" }
}, Jt = (e, t, n, i, s) => $t({ ...qs[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), kl = ["round", "linear", "spot"], _l = ["rect", "circle"], _e = (e, t) => e.map((n) => ({ v: n, label: p(`${t}.${n}`) }));
function Vs(e, t, n, i) {
  const s = (r, a, l) => A(`${p(a)}, ${p("unit.mm")}`, Jt(e, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => A(`${p(a)}, ${p("unit.deg")}`, Jt(e, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (t.kind) {
    case "ceiling_light":
      return g`
        ${A(p("props.shape"), K(t.shape, _e([...kl], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? g`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : s("diameter", "props.diameter", t.diameter)}
        ${A(`${p("props.poolRadius")}, ${p("unit.mm")}`, $t({
        ...qs.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: p("props.poolHint"),
        setNotice: e.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return g`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return g`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return A(`${p("props.diameter")}, ${p("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${G(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${Mo.map((r) => g`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "climate_sensor":
      return n === "" && e.device && e.level ? Al(e.level, e.device, t.zoneIds, i) : Ml();
    case "equipment":
      return g`
        ${A(p("props.shape"), K(t.shape, _e([..._l], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? g`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${A(p("props.icon"), El(e, t.icon, `${n}icon`, i))}
        ${A(p("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${G(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return g`<p class="muted">${p("props.noSettings")}</p>`;
  }
}
const Sl = /^mdi:[a-z0-9-]+$/;
function El(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!Sl.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, p("props.badIcon"));
      return;
    }
    (l = e.onNotice) == null || l.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? g`<ha-icon-picker data-field=${n} .value=${G(t)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : g`<input class="val wide" type="text" data-field=${n} .value=${G(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
const Ml = () => g`${b}`;
function Al(e, t, n, i) {
  var o;
  const s = n.length === 0 ? (o = e.zones.find((r) => r.id === Br(e, t))) == null ? void 0 : o.name : void 0;
  return g`<fieldset class="zones" data-field="zoneIds"><legend>${p("props.zones")}${n.length === 0 ? g` (${p("props.zonesAuto")}${s ? `: ${s}` : ""})` : b}</legend>
    ${e.zones.map((r) => g`<label class="row"><input type="checkbox" data-zone=${r.id} .checked=${n.includes(r.id)}
      @change=${(a) => {
    const l = a.target.checked, c = e.zones.map((f) => f.id).filter((f) => f === r.id ? l : n.includes(f));
    i({ zoneIds: c }) || (a.target.checked = !l);
  }} /><span>${r.name}</span></label>`)}
  </fieldset>`;
}
function Il(e, t) {
  const n = t.placement;
  if (n.mode === "free")
    return A(
      `${p("props.rotation")}, ${p("unit.deg")}`,
      Jt(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = Wi.has(t.props.kind);
  return g`
    ${A(p("props.side"), K(n.side, _e(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${A(`${p("props.offset")}, ${p("unit.mm")}`, Jt(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? A(
    `${p("props.aim")}, ${p("unit.deg")}`,
    Jt(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(Is(n, s)))
  ) : b}`;
}
function Ws(e, t) {
  return A(p("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${G(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function Pl(e, t) {
  const n = t.props.kind;
  return ae(n) ? n === "smart_button" && t.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${p("props.typeFreeHint")}</p>` : A(p("props.type"), K(
    n,
    _e(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : b;
}
function Ol(e, t) {
  return g`
    <h4>${p(`device.${t.props.kind}`)}</h4>
    ${Ws(t, (n) => e.onDevice({}, n))}
    ${Pl(e, t)}
    ${Vs(e, t.props, "", (n) => e.onDevice(n))}
    ${Il(e, t)}
    ${t.invalid ? g`<p class="warn">${p("props.invalidDevice")}</p>` : b}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${p("action.delete")}</button>`;
}
function Cl(e) {
  return e.device ? Ol(e, e.device) : e.nextKind && e.nextProps ? g`
      <h4>${p("props.nextDevice")}: ${p(`device.${e.nextKind}`)}</h4>
      ${Vs(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}` : g`<p class="muted">${p("props.none")}</p>`;
}
function Nl(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((r) => r.id === n.id) ?? null : null, s = wl(e.toolId) ? e.toolId : null, o = (r) => r === t ? (e.setNotice(p("props.noFit")), !1) : (e.setNotice(null), e.commit(r), !0);
  return g`<div class="props">
    ${Cl({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (r, a) => !!i && o(Ie(t, i.id, r, a)),
    onKind: (r) => !!i && o(mr(t, i.id, r)),
    onPlacement: (r) => !!i && o(kn(t, i.id, r)),
    onNext: (r) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && e.commit(cs(t, i.id));
    },
    onNotice: (r) => e.setNotice(r)
  })}
    ${e.notice ? g`<p class="warn">${e.notice}</p>` : b}
  </div>`;
}
function Ks(e, t, n) {
  return $t({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function xi(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function Ll(e, t) {
  const n = it(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(Nr(t.level, e.id, o));
  return g`
    <h4>${p("props.wall")}</h4>
    ${A(p("props.type"), K(
    e.type,
    i.map((o) => ({ v: o, label: p(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${A(p("props.thickness"), Ks(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${A(p("props.baseline"), K(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: p(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${A(p("props.length"), g`<span class="val ro">${Et(n)} ${p("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(ys(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function Dl(e, t) {
  const n = ["door", "window", "opening", ...xe.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(kr(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: p(`side.${r}`) })), o = xe.includes(e.kind);
  return g`
    <h4>${p(`kind.${e.kind}`)}</h4>
    ${A(p("props.kind"), K(e.kind, n.map((r) => ({ v: r, label: p(`kind.${r}`) })), (r) => i(xr(e, r))))}
    ${A(p("props.width"), Ks(t, e.width, (r) => xi(t, wr(t.level, e.id, r))))}
    ${A(p("props.offset"), $t({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => xi(t, fs(t.level, e.id, r))
  }))}
    ${o ? g`
      ${A(p("props.hinge"), K(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: p(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${A(p("props.swing"), K(e.swing ?? "left", s, (r) => i({ swing: r })))}` : b}
    ${e.kind === "window" ? A(p("props.outside"), K(e.outside ?? "left", s, (r) => i({ outside: r }))) : b}
    ${e.invalid ? g`<p class="warn">${p("props.invalidOpening")}</p>` : b}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(gs(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function Tl(e, t) {
  return g`
    <h4>${p("props.zone")}</h4>
    ${A(p("props.name"), g`<input class="val wide" type="text" .value=${G(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(yr(t.level, e.id, s));
  }} />`)}
    ${A(p("props.area"), g`<span class="val ro">${Cs(ds(e.outline))}</span>`)}
    ${e.broken ? g`<p class="warn">${p("props.broken")}</p>` : b}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(hs(t.level, e.id))}>
      ${p("action.delete")}</button>`;
}
function zl(e) {
  const t = ["bearing", "partition", "railing"];
  return g`
    <h4>${p("props.newWall")}</h4>
    ${A(p("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => g`<option value=${n} ?selected=${n === e.wallType}>${p(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${A(`${p("props.thickness")}, ${p("unit.mm")}`, $t({
    value: e.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      e.setThickness(n);
    }
  }))}
    ${e.tool === "box" ? g`
      <div class="muted">${p("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => g`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${p(`measure.${n}`)}</button>`)}
      </div>` : b}`;
}
function Rl(e) {
  const { level: t, selection: n } = e;
  let i = b;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = Ll(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = Dl(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = Tl(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = g`<h4>${p("props.node")}</h4>
      ${A("X", g`<span class="val ro">${Et(s.x)}</span>`)}${A("Y", g`<span class="val ro">${Et(s.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === b && (e.tool === "wall" || e.tool === "box") ? zl(e) : i === b && gl(e.tool) ? ml({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === b ? g`<p class="muted">${p("props.none")}</p>` : i}
      ${e.notice ? g`<p class="warn">${e.notice}</p>` : b}
    </div>`;
}
function Ul(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const ki = /* @__PURE__ */ new WeakMap();
function Le(e, t, n) {
  let i = ki.get(e);
  i || ki.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : Ul(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
const _i = /* @__PURE__ */ new WeakMap();
function Fl(e, t) {
  let n = _i.get(e);
  n || _i.set(e, n = /* @__PURE__ */ new Map());
  const i = n.get(t);
  if (i) return i;
  const s = /* @__PURE__ */ new Set();
  for (const r of Bi[t])
    if (r.autoFill !== !1)
      for (const a of Le(e, r, !1)) a.deviceId && s.add(a.deviceId);
  const o = [...s].map((r) => e.devices.get(r)).filter((r) => !!r).sort((r, a) => r.name.localeCompare(a.name) || r.id.localeCompare(a.id));
  return n.set(t, o), o;
}
function Bl(e, t, n, i) {
  var l;
  const s = e.devices.find((c) => c.id === t), o = [], r = [];
  if (!s) return { level: e, filled: o, ambiguous: r };
  let a = e;
  for (const c of vt(s)) {
    if (c.autoFill === !1 || (l = s.bindings) != null && l[c.role]) continue;
    const f = Le(i, c, !1).filter((d) => d.deviceId === n);
    f.length === 1 ? (a = bn(a, t, c.role, f[0].entityId), o.push(c.role)) : f.length > 1 && r.push(c.role);
  }
  return { level: a, filled: o, ambiguous: r };
}
function Ze(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = (e) => e ?? b;
var Hl = Object.defineProperty, de = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Hl(t, n, s), s;
};
const jl = 100;
let ql = 0;
const an = (e) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${k`<path d=${e}></path>`}</svg>`, On = class On extends Nt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${ql++}`, this.shown = null, this.onOutside = (t) => {
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
    const t = [...this.rowDeps(), this.query.trim().toLowerCase()], n = this.shown;
    if (n && n.deps.length === t.length && n.deps.every((a, l) => a === t[l])) return n.value;
    const i = t[t.length - 1], s = [];
    let o = !1;
    for (const a of this.allRows())
      if (!(i && !a.search.includes(i))) {
        if (s.length === jl) {
          o = !0;
          break;
        }
        s.push(a);
      }
    const r = { rows: s, more: o };
    return this.shown = { deps: t, value: r }, r;
  }
  /** Tooltip of the closed box and of a row; none by default. */
  boxTitle() {
  }
  rowTitle(t) {
  }
  optId(t) {
    return `${this.uid}-opt-${t}`;
  }
  /** The active row index kept inside the rows (the rows can shrink while the list is open). */
  clamped(t) {
    return Math.min(this.active, Math.max(t.length - 1, 0));
  }
  onSearchKey(t) {
    const { rows: n } = this.filtered();
    if (t.key === "ArrowDown")
      t.preventDefault(), this.active = Math.max(0, Math.min(this.active + 1, n.length - 1)), this.scrollActive();
    else if (t.key === "ArrowUp")
      t.preventDefault(), this.active = Math.max(this.active - 1, 0), this.scrollActive();
    else if (t.key === "Enter") {
      t.preventDefault();
      const i = n[this.clamped(n)];
      i && this.pick(i.id);
    } else t.key === "Escape" && (t.preventDefault(), t.stopPropagation(), this.close(), this.focusBox());
  }
  onFocusOut(t) {
    var i;
    const n = t.relatedTarget;
    this.isOpen && !(n && ((i = this.shadowRoot) != null && i.contains(n))) && this.close();
  }
  scrollActive() {
    this.updateComplete.then(() => {
      var t, n;
      return (n = (t = this.renderRoot.querySelector(".opt.on")) == null ? void 0 : t.scrollIntoView) == null ? void 0 : n.call(t, { block: "nearest" });
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
    return g`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${ue(this.label || void 0)} title=${ue(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? g`<button class="x" type="button" title=${p("combo.clear")} aria-label=${p("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : b}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return g`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${ue(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => g`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${ue(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? g`<div class="empty">${this.emptyText()}</div>` : b}
      ${n ? g`<div class="hint">${p("combo.more")}</div>` : b}
    </div>`;
  }
  render() {
    return g`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : b}</div>`;
  }
};
On.styles = Ni`
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
let at = On;
de([
  J()
], at.prototype, "value");
de([
  J()
], at.prototype, "label");
de([
  L()
], at.prototype, "isOpen");
de([
  L()
], at.prototype, "query");
de([
  L()
], at.prototype, "active");
var Vl = Object.defineProperty, In = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Vl(t, n, s), s;
};
const Wl = {
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
}, Si = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Kl = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Ei(e, t) {
  return e != null && e.deviceClass && Si[e.deviceClass] ? Si[e.deviceClass] : Kl[(e == null ? void 0 : e.domain) ?? $s(t)] ?? "generic";
}
const Mi = (e) => an(Wl[e]);
function Zl(e) {
  switch (e) {
    case "sensor":
      return p("combo.domain.sensor");
    case "binary_sensor":
      return p("combo.domain.binary_sensor");
    case "light":
      return p("combo.domain.light");
    case "switch":
      return p("combo.domain.switch");
    case "fan":
      return p("combo.domain.fan");
    case "event":
      return p("combo.domain.event");
    default:
      return e;
  }
}
class De extends at {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = Ze(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? Ze(this.meta, t) : null;
    return g`${Mi(t ? Ei(this.meta.entities.get(t), t) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : b}<small class="eid">${t}</small></span>` : g`<span class="ph">${p("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = xs(this.states, t.entityId) ?? "unavailable";
    return g`${Mi(Ei(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${Zl(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = Ze(this.meta, t).name;
    return n === t ? t : `${n} (${t})`;
  }
  rowTitle(t) {
    return t.name === t.id ? t.id : `${t.name} (${t.id})`;
  }
  searchLabel() {
    return p("combo.search");
  }
  emptyText() {
    return p("combo.empty");
  }
}
In([
  J({ attribute: !1 })
], De.prototype, "meta");
In([
  J({ attribute: !1 })
], De.prototype, "items");
In([
  J({ attribute: !1 })
], De.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", De);
var Gl = Object.defineProperty, Pn = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Gl(t, n, s), s;
};
const Ai = "M3,6H21V4H3C1.9,4 1,4.9 1,6V18A2,2 0 0,0 3,20H7V18H3V6M13,12H9V13.78C8.39,14.33 8,15.11 8,16C8,16.89 8.39,17.67 9,18.22V20H13V18.22C13.61,17.67 14,16.88 14,16C14,15.12 13.61,14.33 13,13.78V12M11,17.5A1.5,1.5 0 0,1 9.5,16A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 12.5,16A1.5,1.5 0 0,1 11,17.5M22,8H16A1,1 0 0,0 15,9V19A1,1 0 0,0 16,20H22A1,1 0 0,0 23,19V9A1,1 0 0,0 22,8M21,18H17V10H21V18Z";
class Te extends at {
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
    return g`${an(Ai)}<span class="ph">${this.placeholder}</span>`;
  }
  renderRow(t) {
    return g`${an(Ai)}<span><b>${t.name}</b>${t.context ? g`<small>${t.context}</small>` : b}</span>`;
  }
  searchLabel() {
    return p("combo.searchDevices");
  }
  emptyText() {
    return p("combo.emptyDevices");
  }
}
Pn([
  J({ attribute: !1 })
], Te.prototype, "meta");
Pn([
  J({ attribute: !1 })
], Te.prototype, "devices");
Pn([
  J()
], Te.prototype, "placeholder");
customElements.get("ps-device-combo") || customElements.define("ps-device-combo", Te);
const Yl = { min: 0, max: 9 }, Xl = { min: 1, max: 10 };
function Zs(e, t) {
  return t === e.level ? !1 : (e.setNotice(null), e.commit(t), !0);
}
const Se = (e, t, n) => Zs(e, Ie(e.level, t.id, n));
function Ge(e, t, n, i) {
  return g`<div class="cflag">${A(t, g`<input type="checkbox" data-field=${e} .checked=${G(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
function Ql(e, t, n) {
  const i = ji(n).map((s) => ({ v: s, label: p(`output.${s}`) }));
  return A(
    p("binding.defaultOutput"),
    K(n.defaultOutput, i, (s) => Se(e, t, { defaultOutput: s }), "defaultOutput")
  );
}
function Jl(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return g`${b}`;
  const s = i[n], o = (a) => Se(e, t, { [n]: { ...s, ...a } }), r = `ps-events-${n}`;
  return g`<div class="trigger" data-trigger=${n}>
    ${A(p("binding.slot"), $t({
    value: s.slot,
    rule: Yl,
    bad: "props.badSlot",
    field: `${n}-slot`,
    skipSame: !0,
    setNotice: (a) => e.setNotice(a),
    apply: (a) => o({ slot: a })
  }))}
    ${A(p("binding.event"), g`<input class="val wide" type="text" list=${r} data-field=${`${n}-event`}
      .value=${G(s.event)} @change=${(a) => {
    const l = a.target, c = l.value.trim();
    if (!c) {
      l.value = s.event, e.setNotice(p("props.badEvent"));
      return;
    }
    l.value = c, e.setNotice(null), c !== s.event && o({ event: c });
  }} />`)}
    <datalist id=${r}>${Ao.map((a) => g`<option value=${a}></option>`)}</datalist>
  </div>`;
}
function tc(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return g`
      ${Ge(
      "autoByDoubleToggle",
      p("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => Se(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${A(p("binding.window"), $t({
      value: i.windowSec,
      rule: Xl,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setNotice(a),
      apply: (a) => Se(e, t, { windowSec: a })
    }))}</div>` : b}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${b}`;
  const s = (a, l) => (c) => {
    var d, h;
    const f = Ie(e.level, t.id, { [a]: c });
    return Zs(e, c && !((d = t.bindings) != null && d[l]) ? bn(f, t.id, l, ((h = t.bindings) == null ? void 0 : h.on) ?? null) : f);
  }, o = s("separateOff", "off"), r = Ge("autoEnabled", p("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : g`${Ge("separateOff", p("binding.separateOff"), i.separateOff, o)}${i.separateOff ? b : r}`;
}
function ec(e, t) {
  const n = t.props;
  return n.kind !== "wall_switch" && n.kind !== "smart_button" ? g`${b}` : g`<div class="cfields">
    ${Ql(e, t, n)}
    ${n.kind === "smart_button" && Eo(t).length ? g`<p class="warn" data-note="duplicate">${p("binding.duplicate")}</p>` : b}
  </div>`;
}
function ln(e, t) {
  return t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? p("binding.onOff") : p(`role.${t}`);
}
function nc(e, t, n) {
  if (t.length === 0 && n.length === 0) return p("binding.nothingToFill");
  const i = t.length ? p("binding.filled").replace("{roles}", t.map((s) => ln(e, s)).join(", ")) : p("binding.nothingFilled");
  return n.length === 0 ? i : `${i}; ${p("binding.several").replace("{roles}", n.map((s) => `${ln(e, s.role)} (${s.n})`).join(", "))}`;
}
function ic(e) {
  const t = p("output.line").replace("{output}", p(`output.${e.output}`));
  return e.fault === "not_configured" ? `${t} — ${p("output.defaultNotConfigured")}` : e.fault === "unavailable" ? `${t} — ${p("output.defaultUnavailable").replace("{entities}", (e.entities ?? []).join(", "))}` : t;
}
function sc(e, t) {
  if (!ae(t.props.kind)) return b;
  const n = e.feed.stateOf(t), i = n ? ic(n) : e.feed.error ?? (e.feed.ready ? p("output.notSaved") : null);
  return i === null ? b : g`<p class="note" data-field="output">${i}</p>`;
}
function oc(e, t) {
  return t > 0 ? "binding.haDevicePick" : e.registryLoading || !e.meta.registryLoaded && !e.registryError ? "binding.haDevicesLoading" : e.meta.registryLoaded ? "binding.haDeviceNone" : "binding.haDevicesUnavailable";
}
function rc(e, t) {
  const n = Fl(e.meta, t.props.kind), i = (s) => {
    const o = Bl(e.level, t.id, s, e.meta), r = vt(t), a = o.ambiguous.map((l) => ({
      role: l,
      n: Le(e.meta, r.find((c) => c.role === l), !1).filter((c) => c.deviceId === s).length
    }));
    o.level !== e.level && e.commit(o.level), e.setFillNotice(nc(t, o.filled, a));
  };
  return g`<div class="bfield"><span>${p("binding.haDevice")}</span>
    <ps-device-combo data-field="ha-device" .meta=${e.meta} .devices=${n} .label=${p("binding.haDevice")}
      .placeholder=${p(oc(e, n.length))}
      @value-changed=${(s) => {
    s.stopPropagation(), s.detail.value && i(s.detail.value);
  }}></ps-device-combo></div>`;
}
function ac(e, t, n, i) {
  const s = ks(e.meta, i, e.states), o = So(e.level, t, n);
  return g`
    ${s === "missing" ? g`<p class="warn" data-note="missing">${p("binding.missing")}</p>` : b}
    ${s === "unavailable" ? g`<p class="note" data-note="unavailable">${p("binding.unavailable")}</p>` : b}
    ${o.length ? g`<p class="note" data-note="also">${p("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : b}`;
}
function lc(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = ln(t, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${p("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${Le(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const c = bn(e.level, t.id, i, l.detail.value);
    c !== e.level && (e.setFillNotice(null), e.commit(c));
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && gn(i) ? Jl(e, t, i) : b}
    ${s ? ac(e, t, i, s) : b}
  </div>`;
}
function cc(e) {
  const t = e.device, n = mn(e.level.devices.map(e.status));
  return g`<div class="props bprops">
    ${e.notice ? g`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : b}
    ${e.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${p(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : b}
    ${t ? g`
      <h4>${p(`device.${t.props.kind}`)}</h4>
      ${Ws(t, (i) => e.commit(Ie(e.level, t.id, {}, i)))}
      ${sc(e, t)}
      ${rc(e, t)}
      ${e.fillNotice ? g`<p class="note" data-notice="fill">${e.fillNotice}</p>` : b}
      ${vt(t).map((i) => g`${lc(e, t, i)}${tc(e, t, i.role)}`)}
      ${ec(e, t)}` : g`<p class="muted">${p("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${p("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${p("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${p("binding.reload")}</button>
  </div>`;
}
function dc(e, t) {
  return e.mode !== "binding" ? sl(e.mode, e.toolId, (n) => e.pickTool(n)) : hl({
    level: t,
    selection: e.selection,
    status: e.bindStatus,
    filter: e.bindFilter,
    query: e.bindQuery,
    onFilter: (n) => {
      e.bindFilter = n;
    },
    onQuery: (n) => {
      e.bindQuery = n;
    },
    onPick: (n) => e.pickDevice(n),
    collapsed: e.railCollapsed,
    onCollapse: (n) => {
      e.railCollapsed = n;
    }
  });
}
function uc(e, t) {
  var i;
  const n = e.selection;
  return cc({
    level: t,
    device: (n == null ? void 0 : n.kind) === "device" ? t.devices.find((s) => s.id === n.id) ?? null : null,
    meta: e.haMeta.get(),
    states: (i = e.hass) == null ? void 0 : i.states,
    status: e.bindStatus,
    showAll: e.showAll,
    onShowAll: (s) => {
      e.showAll = { ...e.showAll, [s]: !e.showAll[s] };
    },
    commit: (s) => e.commit(s),
    onNextUnbound: () => e.nextUnboundDevice(),
    notice: e.notice,
    setNotice: (s) => {
      e.notice = s;
    },
    fillNotice: e.fillNotice,
    setFillNotice: (s) => {
      e.fillNotice = s;
    },
    registryError: e.haMeta.error,
    registryLoading: e.haMeta.loading,
    onRetry: () => e.haMeta.retry(),
    feed: e.feed
  });
}
function hc(e, t) {
  if (e.mode === "binding") return uc(e, t);
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (i) => e.commit(i),
    setNotice: (i) => {
      e.notice = i;
    }
  };
  return e.mode === "equipment" ? Nl({ ...n, toolId: e.toolId, nextProps: e.nextProps, setNextProps: (i) => {
    e.nextProps = i;
  } }) : Rl({
    ...n,
    tool: e.toolId,
    boxMeasure: e.boxMeasure,
    wallType: e.wallType,
    thickness: e.thickness,
    next: e.nextObj,
    setNext: (i) => {
      e.nextObj = i;
    },
    setWallType: (i) => e.setWallType(i),
    setThickness: (i) => {
      e.thickness = i;
    },
    setBoxMeasure: (i) => {
      e.boxMeasure = i;
    }
  });
}
function pc(e) {
  return g`
    <div class="status">
      ${e.binding ? b : g`
        <span><span class="kbd">Shift</span> ${p("hint.shift")}</span>
        <span><span class="kbd">${p("hint.digits")}</span> ${p("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${p("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${p(e.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${e.snap ? g`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${p("status.grid")}
      </label>
      <label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${p("status.cones")}
      </label>
    </div>`;
}
function fc(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: p(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: p("unit.mm")
    },
    {
      label: p(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? p("unit.mm") : "°"
    }
  ];
  return k`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((a, l) => k`
        <text x="8" y=${19 + l * 22} font-size="11" fill=${n.muted}>${a.label}</text>
        <rect x="24" y=${7 + l * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${a.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + l * 22} text-anchor="end" font-size="12"
          fill=${a.buf ? n.text : n.muted}>${a.buf ? `${a.buf} ${a.unit}` : a.live ? `${a.live} ${a.unit}` : "—"}</text>`)}
    </g>`;
}
function gc(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: c } = s[0], f = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: Et(f), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Et(r), second: Et(a) };
}
function mc(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const bc = Ni`
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
  .bfield { display: flex; flex-direction: column; gap: 4px; margin: 0 0 6px; }
  .bfield > span, .role-label { color: var(--ch-muted); font-size: 12px; }
  .role { margin-top: 14px; }
  .role-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .showall { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--ch-muted); cursor: pointer; }
  .note { margin: 4px 0 0; color: var(--ch-muted); font-size: 12px; }
  .bprops .warn { margin: 4px 0 0; }
  .bprops .reload { margin-top: 12px; }
  /* Input containers: a trigger's slot and event under its entity; checkboxes between the role sections they
     reveal; the default output after the roles. */
  .trigger .row { margin: 4px 0; }
  .cflag { margin-top: 10px; }
  .cflag .row { margin: 0; }
  .cflag input[type="checkbox"] { margin: 0; }
  .cfields { margin-top: 14px; padding-top: 8px; border-top: 1px solid var(--ch-divider); }
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
`, vc = 5e-3, yc = 2, cn = (e) => Math.max(vc, Math.min(yc, e));
function $c(e, t, n) {
  var r;
  const i = (r = e == null ? void 0 : e.getScreenCTM) == null ? void 0 : r.call(e), s = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (s && Number.isFinite(s.a) && Number.isFinite(s.d))
    return { x: s.a * n.clientX + s.c * n.clientY + s.e, y: s.b * n.clientX + s.d * n.clientY + s.f };
  const o = e == null ? void 0 : e.getBoundingClientRect();
  return {
    x: t.x + (n.clientX - ((o == null ? void 0 : o.left) ?? 0)) / t.scale,
    y: t.y + (n.clientY - ((o == null ? void 0 : o.top) ?? 0)) / t.scale
  };
}
function wc(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: cn(Math.min(t, n) / 12e3) };
  const i = e.map((d) => d.x), s = e.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, f = cn(Math.min(t / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - t / f / 2, y: (l + c) / 2 - n / f / 2, scale: f };
}
function xc(e, t, n) {
  const i = cn(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function kc(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function _c(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function Sc(e, t, n, i) {
  const s = 100 * e.scale >= 6 ? 100 : 1e3, o = 1 / e.scale;
  return k`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.grid} stroke-width=${o}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width="1000" height="1000">
        <rect width="1000" height="1000" fill="url(#grid-minor)"></rect>
        <path d="M1000 0H0V1000" fill="none" stroke=${i.gridMajor} stroke-width=${o}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Ec = ["Shift", "Control", "Alt", "Meta"];
function Ii(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class Mc {
  constructor(t) {
    this.h = t, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
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
        this.h.view = kc(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.pointerActive && (this.pointerActive = !1, this.h.activeTool.preview().level && this.h.activeTool.cancel(), this.h.requestUpdate());
    }, this.wheel = (n) => {
      n.preventDefault(), this.h.view = xc(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Ii(n) || !this.h.history) return;
      const i = n.ctrlKey || n.metaKey, s = n.code === "KeyZ" ? "z" : n.code === "KeyY" ? "y" : n.code === "KeyS" ? "s" : n.key.toLowerCase();
      if (i && (s === "z" || s === "y")) {
        n.preventDefault(), s === "z" && !n.shiftKey ? this.h.undo() : this.h.redo();
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
      let o = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      !o && (n.key === "Delete" || n.key === "Backspace") && (o = this.h.deleteSelection()), !o && n.key === "Escape" && (this.h.activeTool.cancel(), this.h.selection = null, o = !0), o && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Ii(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !Ec.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey };
  }
}
function Gs(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function Ac(e) {
  return g`
    <div class="draft-banner" role="status">
      <span>${p("draft.banner").replace("{time}", Gs(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${p("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${p("draft.discard")}</button>
    </div>`;
}
function Gt(e, t, n, i) {
  return g`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? g`<p class="muted">${i}</p>` : b}
        <div class="actions">
          ${n.map((s) => g`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Ic(e) {
  var n;
  const t = { action: "cancel", label: p("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? Gt(p("draft.title"), p("draft.text").replace("{time}", Gs(i.savedAt)), [
        { action: "restore", label: p("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: p("draft.discard"), onClick: () => e.discard(i) }
      ]) : b;
    }
    case "new":
      return Gt(p("new.title"), p("new.text"), [
        { action: "new-discard", label: p("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return Gt(p("delete.title"), p("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: p("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return Gt(p("switch.title"), p("switch.text"), [
        { action: "switch-discard", label: p("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return Gt(p("conflict.title"), p(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: p("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: p("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return b;
  }
}
const Yt = "plan_studio.draft.", he = "plan_studio.lastPlanId";
function Pc() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Oc(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class Cc {
  constructor(t = Pc, n = 500) {
    this.storage = t, this.delayMs = n, this.timer = null, this.pending = null;
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
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Yt + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Yt + t), s = i ? JSON.parse(i) : null;
      return Oc(s) && s.planId === t ? s : null;
    } catch {
      return null;
    }
  }
  /** Newest draft of any plan (used when the server has no plans, e.g. an unsaved new plan). */
  latest() {
    try {
      const t = this.storage();
      if (!t) return null;
      let n = null;
      for (let i = 0; i < t.length; i++) {
        const s = t.key(i);
        if (!(s != null && s.startsWith(Yt))) continue;
        const o = this.read(s.slice(Yt.length));
        o && (!n || o.savedAt > n.savedAt) && (n = o);
      }
      return n;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var t;
    try {
      return ((t = this.storage()) == null ? void 0 : t.getItem(he)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(he, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(he)) === t && n.removeItem(he);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Yt + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
function Pi(e) {
  e().catch(() => {
  });
}
class Nc {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null;
  }
  /** The first full message for the watched plan has arrived. */
  get ready() {
    return this.gotFull;
  }
  /** Why there are no live outputs (no subscription support, or the subscription failed), else null. */
  get error() {
    return this.failure;
  }
  get(t) {
    return this.map.get(t);
  }
  /** The device's live state; undefined when the saved plan has no such container or has it as another kind. */
  stateOf(t) {
    const n = this.map.get(t.id);
    return (n == null ? void 0 : n.kind) === t.props.kind ? n : void 0;
  }
  watch(t) {
    t !== this.planId && (this.stop(), this.planId = t, t !== null && this.start(t));
  }
  /** Ends the subscription (also one still being set up) and forgets the outputs; any plan can be watched again. */
  stop() {
    const t = this.sub;
    this.sub = null, this.planId = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, t && (t.live = !1, t.unsub && Pi(t.unsub));
  }
  start(t) {
    const n = this.connection();
    if (!(n != null && n.subscribeMessage)) {
      this.fail(p("output.noLive"));
      return;
    }
    const i = { live: !0, unsub: null };
    this.sub = i, n.subscribeMessage(
      (s) => {
        i.live && this.apply(s);
      },
      { type: "plan_studio/containers/subscribe", plan_id: t }
    ).then(
      (s) => {
        i.live ? i.unsub = s : Pi(s);
      },
      (s) => {
        i.live && this.fail(_t(s));
      }
    );
  }
  apply(t) {
    const n = Object.entries(t.containers ?? {});
    if (t.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, s] of n) this.map.set(i, s);
    this.host.requestUpdate();
  }
  fail(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
var Lc = Object.defineProperty, D = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Lc(t, n, s), s;
};
const Cn = class Cn extends Nt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Io.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.cones = !0, this.nextProps = xl(), this.nextObj = pl(), this.view = { x: -1e3, y: -1e3, scale: 0.08 }, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fillNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.loading = !1, this.needFit = !1, this.drafts = new Cc(), this.resizeObs = null, this.session = new vl(this), this.haMeta = new yl(this), this.feed = new Nc(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => xo(i, (s) => {
      var o;
      return ks(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    const t = this, n = {
      get connection() {
        return t.hass.connection;
      }
    };
    this.save = new Yr(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = $l(this), this.activeTool = rn("select", this.ctx), this.input = new Mc(this);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((t = this.plan) == null ? void 0 : t.id) ?? null);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null, this.feed.stop();
  }
  willUpdate(t) {
    var n;
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load(), this.needFit && this.size.w > 0 && this.size.h > 0 && (this.needFit = !1, this.fit()), this.feed.watch(this.isConnected ? ((n = this.plan) == null ? void 0 : n.id) ?? null : null);
  }
  updated() {
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((n) => {
      const i = n[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  // ---- editing ----
  commit(t) {
    this.history && (this.history.push(t), this.save.markDirty(), this.selection && !We(t, this.selection) && (this.activeTool.cancel(), this.selection = null), this.requestUpdate());
  }
  /** Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the Binding step. */
  deleteSelection() {
    var i;
    const t = this.selection, n = (i = this.history) == null ? void 0 : i.current;
    return this.mode === "binding" || !t || !n || t.kind === "node" || !We(n, t) ? !1 : (this.commit(t.kind === "wall" ? ys(n, t.id) : t.kind === "opening" ? gs(n, t.id) : t.kind === "device" ? cs(n, t.id) : hs(n, t.id)), !0);
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
    const n = this.selection, i = (s = this.history) == null ? void 0 : s.current;
    this.selection = this.mode === "binding" && n && i && We(i, n) ? n : null, this.mode === "binding" && (this.fillNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fillNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = rn(t, this.ctx);
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode = t, this.pickTool(An(t)[0]), t === "binding" && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    var o;
    const n = (o = this.history) == null ? void 0 : o.current, i = n == null ? void 0 : n.devices.find((r) => r.id === t);
    if (!n || !i) return;
    this.selection = { kind: "device", id: t }, this.fillNotice = null;
    const s = Y(n, i);
    s && (this.view = _c(this.view, s.pt, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i, s;
    const t = (i = this.history) == null ? void 0 : i.current, n = t ? cl(t, ((s = this.selection) == null ? void 0 : s.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return $c(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.view = wc(((t = this.history) == null ? void 0 : t.current.nodes) ?? [], this.size.w, this.size.h);
  }
  // ---- render ----
  renderDialog() {
    var t;
    return Ic({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((t = this.plan) == null ? void 0 : t.name) ?? "",
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
    var f, d, h;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${p("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${p("action.retry")}</button>` : p("load.loading")}</div>`;
    const t = Oa(!!((d = (f = this.hass) == null ? void 0 : f.themes) != null && d.darkMode)), n = this.history.current, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : ""}" style=${mc(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${il({
      steps: rl({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        planName: this.plan.name,
        onRename: (u) => {
          this.plan = { ...this.plan, name: u }, c.markDirty();
        },
        onMode: (u) => this.setMode(u),
        onNextUnbound: () => this.nextUnboundDevice()
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : b,
      onPickPlan: (u) => this.session.pickPlan(u),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${dc(this, n)}
        ${hc(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(u) => u.preventDefault()}>
            ${this.grid ? Sc(this.view, a, l, t) : b}
            ${Aa(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (u) => this.feed.stateOf(u)
    })}
            ${i.tracker ? fc(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: gc(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : b}
          </svg>
          ${this.pendingDraft && ((h = this.dialog) == null ? void 0 : h.kind) !== "restore" ? Ac({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : b}
        </div>
        ${pc({
      grid: this.grid,
      zoomPct: Math.round(r * 1e3),
      snap: i.snap && i.snap.kind !== "none" ? p(`snap.${i.snap.kind}`) : null,
      onGrid: (u) => {
        this.grid = u;
      },
      cones: this.cones,
      onCones: (u) => {
        this.cones = u;
      },
      binding: this.mode === "binding"
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
Cn.styles = bc;
let O = Cn;
D([
  J({ attribute: !1 })
], O.prototype, "hass");
D([
  J({ type: Boolean })
], O.prototype, "narrow");
D([
  J({ attribute: !1 })
], O.prototype, "panel");
D([
  L()
], O.prototype, "plan");
D([
  L()
], O.prototype, "loadError");
D([
  L()
], O.prototype, "selection");
D([
  L()
], O.prototype, "toolId");
D([
  L()
], O.prototype, "wallType");
D([
  L()
], O.prototype, "thickness");
D([
  L()
], O.prototype, "boxMeasure");
D([
  L()
], O.prototype, "grid");
D([
  L()
], O.prototype, "mode");
D([
  L()
], O.prototype, "bindFilter");
D([
  L()
], O.prototype, "bindQuery");
D([
  L()
], O.prototype, "railCollapsed");
D([
  L()
], O.prototype, "showAll");
D([
  L()
], O.prototype, "cones");
D([
  L()
], O.prototype, "nextProps");
D([
  L()
], O.prototype, "nextObj");
D([
  L()
], O.prototype, "view");
D([
  L()
], O.prototype, "size");
D([
  L()
], O.prototype, "dialog");
D([
  L()
], O.prototype, "notice");
D([
  L()
], O.prototype, "fillNotice");
D([
  L()
], O.prototype, "pendingDraft");
D([
  L()
], O.prototype, "plans");
D([
  L()
], O.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", O);
export {
  O as PlanStudioPanel
};
