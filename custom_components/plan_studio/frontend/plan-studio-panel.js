/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rn = globalThis, Ui = rn.ShadowRoot && (rn.ShadyCSS === void 0 || rn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ji = Symbol(), Ns = /* @__PURE__ */ new WeakMap();
let ur = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== ji) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Ui && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Ns.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ns.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vl = (t) => new ur(typeof t == "string" ? t : t + "", void 0, ji), pr = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new ur(n, t, ji);
}, $l = (t, e) => {
  if (Ui) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = rn.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, Ts = Ui ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return vl(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xl, defineProperty: kl, getOwnPropertyDescriptor: Ml, getOwnPropertyNames: _l, getOwnPropertySymbols: Al, getPrototypeOf: Sl } = Object, Ce = globalThis, Ds = Ce.trustedTypes, El = Ds ? Ds.emptyScript : "", Xn = Ce.reactiveElementPolyfillSupport, xt = (t, e) => t, pn = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? El : null;
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
} }, Wi = (t, e) => !xl(t, e), Rs = { attribute: !0, type: String, converter: pn, reflect: !1, useDefault: !1, hasChanged: Wi };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Ce.litPropertyMetadata ?? (Ce.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Qe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Rs) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && kl(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = Ml(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Rs;
  }
  static _$Ei() {
    if (this.hasOwnProperty(xt("elementProperties"))) return;
    const e = Sl(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(xt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(xt("properties"))) {
      const n = this.properties, i = [..._l(n), ...Al(n)];
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
      for (const s of i) n.unshift(Ts(s));
    } else e !== void 0 && n.push(Ts(e));
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
    return $l(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : pn).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : pn;
      this._$Em = s;
      const c = l.fromAttribute(n, a.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = a.getPropertyOptions(e)), !((i.hasChanged ?? Wi)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(a._$Eu(e, i)))) return;
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
Qe.elementStyles = [], Qe.shadowRootOptions = { mode: "open" }, Qe[xt("elementProperties")] = /* @__PURE__ */ new Map(), Qe[xt("finalized")] = /* @__PURE__ */ new Map(), Xn == null || Xn({ ReactiveElement: Qe }), (Ce.reactiveElementVersions ?? (Ce.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = globalThis, Bs = (t) => t, fn = kt.trustedTypes, Fs = fn ? fn.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, fr = "$lit$", Ee = `lit$${Math.random().toFixed(9).slice(2)}$`, hr = "?" + Ee, Il = `<${hr}>`, We = document, It = () => We.createComment(""), Pt = (t) => t === null || typeof t != "object" && typeof t != "function", Zi = Array.isArray, Pl = (t) => Zi(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Jn = `[ 	
\f\r]`, pt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Us = /-->/g, js = />/g, De = RegExp(`>|${Jn}(?:([^\\s"'>=/]+)(${Jn}*=${Jn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ws = /'/g, Zs = /"/g, mr = /^(?:script|style|textarea|title)$/i, gr = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), y = gr(1), A = gr(2), ae = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), qs = /* @__PURE__ */ new WeakMap(), Re = We.createTreeWalker(We, 129);
function wr(t, e) {
  if (!Zi(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Fs !== void 0 ? Fs.createHTML(e) : e;
}
const Cl = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = pt;
  for (let a = 0; a < n; a++) {
    const l = t[a];
    let c, u, d = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, u = r.exec(l), u !== null); ) p = r.lastIndex, r === pt ? u[1] === "!--" ? r = Us : u[1] !== void 0 ? r = js : u[2] !== void 0 ? (mr.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = De) : u[3] !== void 0 && (r = De) : r === De ? u[0] === ">" ? (r = s ?? pt, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? De : u[3] === '"' ? Zs : Ws) : r === Zs || r === Ws ? r = De : r === Us || r === js ? r = pt : (r = De, s = void 0);
    const f = r === De && t[a + 1].startsWith("/>") ? " " : "";
    o += r === pt ? l + Il : d >= 0 ? (i.push(c), l.slice(0, d) + fr + l.slice(d) + Ee + f) : l + Ee + (d === -2 ? a : f);
  }
  return [wr(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Ct {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = e.length - 1, l = this.parts, [c, u] = Cl(e, n);
    if (this.el = Ct.createElement(c, i), Re.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Re.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(fr)) {
          const p = u[r++], f = s.getAttribute(d).split(Ee), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? Ol : m[1] === "?" ? zl : m[1] === "@" ? Vl : En }), s.removeAttribute(d);
        } else d.startsWith(Ee) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (mr.test(s.tagName)) {
          const d = s.textContent.split(Ee), p = d.length - 1;
          if (p > 0) {
            s.textContent = fn ? fn.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(d[f], It()), Re.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[p], It());
          }
        }
      } else if (s.nodeType === 8) if (s.data === hr) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(Ee, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += Ee.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = We.createElement("template");
    return i.innerHTML = e, i;
  }
}
function nt(t, e, n = t, i) {
  var r, a;
  if (e === ae) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Pt(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = nt(t, s._$AS(t, e.values), s, i)), e;
}
class Ll {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? We).importNode(n, !0);
    Re.currentNode = s;
    let o = Re.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new qi(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Hl(o, this, e)), this._$AV.push(c), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = Re.nextNode(), r++);
    }
    return Re.currentNode = We, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let qi = class br {
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
    e = nt(this, e, n), Pt(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== ae && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Pl(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && Pt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(We.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Ct.createElement(wr(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Ll(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = qs.get(e.strings);
    return n === void 0 && qs.set(e.strings, n = new Ct(e)), n;
  }
  k(e) {
    Zi(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new br(this.O(It()), this.O(It()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = Bs(e).nextSibling;
      Bs(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class En {
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
    if (o === void 0) e = nt(this, e, n, 0), r = !Pt(e) || e !== this._$AH && e !== ae, r && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = nt(this, a[i + l], n, l), c === ae && (c = this._$AH[l]), r || (r = !Pt(c) || c !== this._$AH[l]), c === v ? e = v : e !== v && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ol extends En {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class zl extends En {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
let Vl = class extends En {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = nt(this, e, n, 0) ?? v) === ae) return;
    const i = this._$AH, s = e === v && i !== v || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Hl {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    nt(this, e);
  }
}
const ei = kt.litHtmlPolyfillSupport;
ei == null || ei(Ct, qi), (kt.litHtmlVersions ?? (kt.litHtmlVersions = [])).push("3.3.3");
const Nl = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new qi(e.insertBefore(It(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = globalThis;
let et = class extends Qe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Nl(n, this.renderRoot, this.renderOptions);
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
var dr;
et._$litElement$ = !0, et.finalized = !0, (dr = Fe.litElementHydrateSupport) == null || dr.call(Fe, { LitElement: et });
const ti = Fe.litElementPolyfillSupport;
ti == null || ti({ LitElement: et });
(Fe.litElementVersions ?? (Fe.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tl = { attribute: !0, type: String, converter: pn, reflect: !1, hasChanged: Wi }, Dl = (t = Tl, e, n) => {
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
function ke(t) {
  return (e, n) => typeof n == "object" ? Dl(t, e, n) : ((i, s, o) => {
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
  return ke({ ...t, state: !0, attribute: !1 });
}
function K() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Ki(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const Ue = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Rl = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Bl = { ...Ue, role: "power_in" }, Fl = { ...Ue, role: "power_out" }, Ul = ["on", "off", "auto"], Gi = (t) => Ul.includes(t), ni = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), jl = {
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
  smart_button: [ni("on"), ni("off"), ni("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Ue],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Ue, Rl, Bl, Fl]
}, Yi = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Wl = { climate_sensor: "any" };
function He(t) {
  const e = t.props, n = jl[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function yr(t) {
  return new Set(He(t).map((e) => e.role));
}
function In(t, e, n, i) {
  var a;
  const s = t.devices.find((l) => l.id === e);
  if (!s || !yr(s).has(n)) return t;
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
function Zl(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((a) => !!a), s = He(t).filter((a) => a.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((a) => e(a) === "missing")) return "missing";
  const o = s.filter((a) => !!n[a.role]);
  return (Wl[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function ql(t) {
  const e = He(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Kl = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function $i(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Gi(e) ? n : `${n}|${Kl(i[e])}`;
}
function Gl(t, e, n) {
  const i = $i(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && He(s).some((o) => $i(s, o.role) === i));
}
function Yl(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of He(t)) {
    const s = Gi(i) ? $i(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function Pn(t) {
  if (!t.bindings) return t;
  const e = yr(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const vr = (t) => t === "wall_switch" || t === "smart_button", Cn = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", Lt = (t) => t === "wall" ? "wall" : "free", Ql = [100, 125, 150], Qi = "mdi:cube-outline", Ks = ["single", "double", "hold"], Xl = {
  bearing: 400
}, an = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function $r(t = K(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Gs(t) {
  return {
    id: K(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [$r()]
  };
}
const Xi = {
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
}, it = 90, xr = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Oe(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Qi, label: "" };
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
const Jl = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Qi
};
function ec(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Jl[String(n)] ?? Qi;
  return { ...t, props: { ...i, icon: s } };
}
function tc(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Lt(t.placement.mode);
  return e ? { ...t, props: Oe("smart_button", n), bindings: { on: e } } : { ...t, props: Oe("wall_switch", n) };
}
const kr = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function nc(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = kr(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function ic(t) {
  const e = t.props.kind;
  if (!Cn(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(Oe(e, Lt(t.placement.mode)))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? nc(r, o) : s === "windowSec" ? kr(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...t, props: i } : t;
}
function sc(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function oc(t) {
  if (!Cn(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function rc(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Pn(sc(oc(ic(tc(ec(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function z(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function I(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function E(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function D(t, e) {
  return t.x * e.x + t.y * e.y;
}
function te(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Mr(t) {
  return Math.hypot(t.x, t.y);
}
function L(t, e) {
  return Mr(I(e, t));
}
function Ln(t) {
  const e = Mr(t);
  return e === 0 ? { x: 0, y: 0 } : E(t, 1 / e);
}
function Y(t) {
  return { x: t.y, y: -t.x };
}
function _r(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function pe(t, e, n, i) {
  const s = te(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = te(I(n, t), i) / s;
  return z(t, E(e, o));
}
function On(t, e, n) {
  const i = I(n, e), s = D(i, i);
  return s === 0 ? 0 : D(I(t, e), i) / s;
}
function $e(t, e, n) {
  const i = I(n, e), s = D(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, D(I(t, e), i) / s));
  return L(t, z(e, E(i, o)));
}
function st(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function xe(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let ze = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function ac(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Ie(t, e, n) {
  const i = new ze(null, null);
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
function ii(t, e, n, i) {
  const s = new ze(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = Ie(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Ys(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = Ie(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function lc(t, e, n) {
  return e === null ? t : (t === null || (e = Ie(t.key, e, n), e.left = t), e);
}
function xi(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && xi(t.left, o, !1, i, s), t.right && xi(t.right, o, !0, i, s);
  }
}
class Ji {
  constructor(e = ac) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = ii(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new ze(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Ie(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = Ie(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = Ie(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Ie(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = Ie(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return dc(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && _i(e, n, 0, s - 1, o), this._root === null)
      this._root = ki(e, n, 0, s), this._size = s;
    else {
      const r = uc(
        this.toList(),
        cc(e, n),
        o
      );
      s = this._size + s, this._root = Mi({ head: r }, 0, s);
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
    return xi(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Ys(e, this._root, s);
    s(e, n) < 0 ? r = ii(n, i, r, s) : o = ii(n, i, o, s), this._root = lc(o, r, s);
  }
  split(e) {
    return Ys(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function ki(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], a = e[o], l = new ze(r, a);
    return l.left = ki(t, e, n, o), l.right = ki(t, e, o + 1, i), l;
  }
  return null;
}
function cc(t, e) {
  const n = new ze(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new ze(t[s], e[s]);
  return i.next = null, n.next;
}
function dc(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new ze(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function Mi(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = Mi(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = Mi(t, s + 1, n), r;
  }
  return null;
}
function uc(t, e, n) {
  const i = new ze(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function _i(t, e, n, i, s) {
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
  _i(t, e, n, a, s), _i(t, e, a + 1, i, s);
}
const ye = 11102230246251565e-32, Q = 134217729, pc = (3 + 8 * ye) * ye;
function si(t, e, n, i, s) {
  let o, r, a, l, c = e[0], u = i[0], d = 0, p = 0;
  u > c == u > -c ? (o = c, c = e[++d]) : (o = u, u = i[++p]);
  let f = 0;
  if (d < t && p < n)
    for (u > c == u > -c ? (r = c + o, a = o - (r - c), c = e[++d]) : (r = u + o, a = o - (r - u), u = i[++p]), o = r, a !== 0 && (s[f++] = a); d < t && p < n; )
      u > c == u > -c ? (r = o + c, l = r - o, a = o - (r - l) + (c - l), c = e[++d]) : (r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p]), o = r, a !== 0 && (s[f++] = a);
  for (; d < t; )
    r = o + c, l = r - o, a = o - (r - l) + (c - l), c = e[++d], o = r, a !== 0 && (s[f++] = a);
  for (; p < n; )
    r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p], o = r, a !== 0 && (s[f++] = a);
  return (o !== 0 || f === 0) && (s[f++] = o), f;
}
function fc(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function _(t) {
  return new Float64Array(t);
}
const hc = (3 + 16 * ye) * ye, mc = (2 + 12 * ye) * ye, gc = (9 + 64 * ye) * ye * ye, Ye = _(4), Qs = _(8), Xs = _(12), Js = _(16), ee = _(4);
function wc(t, e, n, i, s, o, r) {
  let a, l, c, u, d, p, f, m, b, w, g, $, k, M, x, S, P, O;
  const H = t - s, U = n - s, V = e - o, N = i - o;
  M = H * N, p = Q * H, f = p - (p - H), m = H - f, p = Q * N, b = p - (p - N), w = N - b, x = m * w - (M - f * b - m * b - f * w), S = V * U, p = Q * V, f = p - (p - V), m = V - f, p = Q * U, b = p - (p - U), w = U - b, P = m * w - (S - f * b - m * b - f * w), g = x - P, d = x - g, Ye[0] = x - (g + d) + (d - P), $ = M + g, d = $ - M, k = M - ($ - d) + (g - d), g = k - S, d = k - g, Ye[1] = k - (g + d) + (d - S), O = $ + g, d = O - $, Ye[2] = $ - (O - d) + (g - d), Ye[3] = O;
  let j = fc(4, Ye), se = mc * r;
  if (j >= se || -j >= se || (d = t - H, a = t - (H + d) + (d - s), d = n - U, c = n - (U + d) + (d - s), d = e - V, l = e - (V + d) + (d - o), d = i - N, u = i - (N + d) + (d - o), a === 0 && l === 0 && c === 0 && u === 0) || (se = gc * r + pc * Math.abs(j), j += H * u + N * a - (V * c + U * l), j >= se || -j >= se)) return j;
  M = a * N, p = Q * a, f = p - (p - a), m = a - f, p = Q * N, b = p - (p - N), w = N - b, x = m * w - (M - f * b - m * b - f * w), S = l * U, p = Q * l, f = p - (p - l), m = l - f, p = Q * U, b = p - (p - U), w = U - b, P = m * w - (S - f * b - m * b - f * w), g = x - P, d = x - g, ee[0] = x - (g + d) + (d - P), $ = M + g, d = $ - M, k = M - ($ - d) + (g - d), g = k - S, d = k - g, ee[1] = k - (g + d) + (d - S), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const ge = si(4, Ye, 4, ee, Qs);
  M = H * u, p = Q * H, f = p - (p - H), m = H - f, p = Q * u, b = p - (p - u), w = u - b, x = m * w - (M - f * b - m * b - f * w), S = V * c, p = Q * V, f = p - (p - V), m = V - f, p = Q * c, b = p - (p - c), w = c - b, P = m * w - (S - f * b - m * b - f * w), g = x - P, d = x - g, ee[0] = x - (g + d) + (d - P), $ = M + g, d = $ - M, k = M - ($ - d) + (g - d), g = k - S, d = k - g, ee[1] = k - (g + d) + (d - S), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const Ae = si(ge, Qs, 4, ee, Xs);
  M = a * u, p = Q * a, f = p - (p - a), m = a - f, p = Q * u, b = p - (p - u), w = u - b, x = m * w - (M - f * b - m * b - f * w), S = l * c, p = Q * l, f = p - (p - l), m = l - f, p = Q * c, b = p - (p - c), w = c - b, P = m * w - (S - f * b - m * b - f * w), g = x - P, d = x - g, ee[0] = x - (g + d) + (d - P), $ = M + g, d = $ - M, k = M - ($ - d) + (g - d), g = k - S, d = k - g, ee[1] = k - (g + d) + (d - S), O = $ + g, d = O - $, ee[2] = $ - (O - d) + (g - d), ee[3] = O;
  const yl = si(Ae, Xs, 4, ee, Js);
  return Js[yl - 1];
}
function bc(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), a = (t - s) * (i - o), l = r - a, c = Math.abs(r + a);
  return Math.abs(l) >= hc * c ? l : -wc(t, e, n, i, s, o, c);
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
const ft = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, Ai = (t, e) => {
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
const yc = Pe * Pe, eo = (t, e) => {
  if (-Pe < t && t < Pe && -Pe < e && e < Pe)
    return 0;
  const n = t - e;
  return n * n < yc * t * e ? 0 : t < e ? -1 : 1;
};
class vc {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new to(), this.yRounder = new to();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class to {
  constructor() {
    this.tree = new Ji(), this.round(0);
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
    if (i !== null && eo(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && eo(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const Ot = new vc(), ln = (t, e) => t.x * e.y - t.y * e.x, Ar = (t, e) => t.x * e.x + t.y * e.y, no = (t, e, n) => {
  const i = bc(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, hn = (t) => Math.sqrt(Ar(t, t)), $c = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return ln(s, i) / hn(s) / hn(i);
}, xc = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Ar(s, i) / hn(s) / hn(i);
}, io = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, so = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, kc = (t, e, n, i) => {
  if (e.x === 0) return so(n, i, t.x);
  if (i.x === 0) return so(t, e, n.x);
  if (e.y === 0) return io(n, i, t.y);
  if (i.y === 0) return io(t, e, n.y);
  const s = ln(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = ln(o, e) / s, a = ln(o, i) / s, l = t.x + a * e.x, c = n.x + r * i.x, u = t.y + a * e.y, d = n.y + r * i.y, p = (l + c) / 2, f = (u + d) / 2;
  return {
    x: p,
    y: f
  };
};
class re {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = re.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Le.compare(e.segment, n.segment));
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
        sine: $c(this.point, e.point, o.point),
        cosine: xc(this.point, e.point, o.point)
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
let Mc = 0;
class Le {
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
      const d = c - a, p = o - i, f = u - l, m = r - s;
      if (d > p && f < m) return 1;
      if (d < p && f > m) return -1;
    }
    return o > r ? 1 : o < r || c < u ? -1 : c > u ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, s) {
    this.id = ++Mc, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const a = re.comparePoints(e, n);
    if (a < 0)
      s = e, o = n, r = 1;
    else if (a > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const l = new re(s, !0), c = new re(o, !1);
    return new Le(l, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = Ai(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = e.leftSE.point, l = e.rightSE.point, c = ft(n, a) && this.comparePoint(a) === 0, u = ft(i, o) && e.comparePoint(o) === 0, d = ft(n, l) && this.comparePoint(l) === 0, p = ft(i, r) && e.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? l : null;
    if (u)
      return d && o.x === l.x && o.y === l.y ? null : o;
    if (c)
      return p && r.x === a.x && r.y === a.y ? null : a;
    if (p && d) return null;
    if (p) return r;
    if (d) return l;
    const f = kc(o, this.vector(), a, e.vector());
    return f === null || !ft(s, f) ? null : Ot.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, s = new re(e, !0), o = new re(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const a = new Le(s, r, this.rings.slice(), this.windings.slice());
    return re.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), re.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Le.compare(n, i);
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
class oo {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Ot.round(e[0][0], e[0][1]);
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
      let l = Ot.round(e[r][0], e[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(Le.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Le.fromRing(o, s, this));
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
class _c {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new oo(e[0], this, !0), this.bbox = {
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
      const o = new oo(e[i], this, !1);
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
class ro {
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
      const o = new _c(e[i], this);
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
class mn {
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
          let f = null;
          for (let b = 0, w = d.length; b < w; b++)
            if (d[b].point === a.point) {
              f = b;
              break;
            }
          if (f !== null) {
            const b = d.splice(f)[0], w = c.splice(b.index);
            w.unshift(w[0].otherSE), n.push(new mn(w.reverse()));
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
      n.push(new mn(c));
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
      no(d, e, p) !== 0 && (n.push(d), e = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    no(i, e, s) === 0 && n.shift(), n.push(n[0]);
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
      re.compare(e, r) > 0 && (e = r);
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
class ao {
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
class Ac {
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
        if (o.isExteriorRing()) n.push(new ao(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new ao(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Sc {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Le.compare;
    this.queue = e, this.tree = new Ji(n), this.segments = [];
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
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      let u = null;
      if (l) {
        const d = l.getIntersection(n);
        if (d !== null && (n.isAnEndpoint(d) || (u = d), !l.isAnEndpoint(d))) {
          const p = this._splitSafely(l, d);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      if (c !== null || u !== null) {
        let d = null;
        c === null ? d = u : u === null ? d = c : d = re.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(d);
        for (let f = 0, m = p.length; f < m; f++)
          i.push(p[f]);
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
const lo = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Ec = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Ic {
  run(e, n, i) {
    ce.type = e, Ot.reset();
    const s = [new ro(n, !0)];
    for (let d = 0, p = i.length; d < p; d++)
      s.push(new ro(i[d], !1));
    if (ce.numMultiPolys = s.length, ce.type === "difference") {
      const d = s[0];
      let p = 1;
      for (; p < s.length; )
        Ai(s[p].bbox, d.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (ce.type === "intersection")
      for (let d = 0, p = s.length; d < p; d++) {
        const f = s[d];
        for (let m = d + 1, b = s.length; m < b; m++)
          if (Ai(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new Ji(re.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const f = s[d].getSweepEvents();
      for (let m = 0, b = f.length; m < b; m++)
        if (o.insert(f[m]), o.size > lo)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Sc(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const d = l.key;
      if (o.size === a) {
        const f = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > lo)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Ec)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let f = 0, m = p.length; f < m; f++) {
        const b = p[f];
        b.consumedBy === void 0 && o.insert(b);
      }
      a = o.size, l = o.pop();
    }
    Ot.reset();
    const c = mn.factory(r.segments);
    return new Ac(c).getGeom();
  }
}
const ce = new Ic(), Pc = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("union", t, n);
}, Cc = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("intersection", t, n);
}, Lc = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("xor", t, n);
}, Oc = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return ce.run("difference", t, n);
};
var Sr = {
  union: Pc,
  intersection: Cc,
  xor: Lc,
  difference: Oc
};
const Er = 3, zc = 1e-6;
function zn(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function Z(t, e) {
  const n = zn(t, e);
  return { x: n.x, y: n.y };
}
function Ge(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : L(i, s);
}
function Ir(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: Ln(I(e, t)), len: L(t, e), leftOff: o, rightOff: r };
}
function J(t, e) {
  return Ir(Z(t, e.a), Z(t, e.b), e.thickness, e.baseline);
}
function Ne(t, e) {
  const n = I(e, t.a);
  return { t: D(n, t.dir), side: D(n, Y(t.dir)) };
}
function co(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Xe = (t) => z(t.p, E(Y(t.u), t.offL)), Je = (t) => I(t.p, E(Y(t.u), t.offR));
function Be(t, e, n) {
  return t !== null && L(t, e) <= n;
}
function Vc(t) {
  const e = [];
  for (const n of t.walls) {
    const i = J(t, n);
    if (i.len < 1e-9) continue;
    const s = Y(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: z(i.a, E(s, i.leftOff)),
        ar: I(i.a, E(s, i.rightOff)),
        bl: z(i.b, E(s, i.leftOff)),
        br: I(i.b, E(s, i.rightOff))
      }
    });
  }
  return e;
}
function Hc(t, e) {
  const n = e.f, i = Y(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = D(I(s.far, n.a), i) >= 0 ? z(n.a, E(i, n.leftOff)) : I(n.a, E(i, n.rightOff)), a = Er * Math.max(s.body.wall.thickness, e.wall.thickness), l = pe(Xe(s), s.u, r, n.dir), c = pe(Je(s), s.u, r, n.dir);
    Be(l, s.p, a) && (s.body.c[s.leftKey] = l), Be(c, s.p, a) && (s.body.c[s.rightKey] = c);
  }
}
function Nc(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Er * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], a = pe(Je(o), o.u, Xe(r), r.u);
    Be(a, e, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (t.length < 3) return;
  const i = Tc(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = I(r, o), l = te(a, I(e, o)), c = te(a, I(s.far, o));
    l * c < 0 && Si(s, [e]);
  }
}
function Si(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Tc(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(te(o.u, r.u)) > 1e-9 || D(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = t[(s + 2) % i], c = pe(Je(o), o.u, Xe(l), l.u), u = pe(Xe(r), r.u, Xe(l), l.u);
        if (!Be(c, e, n) || !Be(u, e, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, Si(o, [e, d, u]);
      } else {
        const l = t[(s - 1 + i) % i], c = pe(Xe(r), r.u, Je(l), l.u), u = pe(Je(o), o.u, Je(l), l.u);
        if (!Be(u, e, n) || !Be(c, e, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, Si(r, [u, d, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function es(t) {
  const e = Vc(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(co(r, "a")), r.wall.b === i.id && s.push(co(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Hc(s, o) : s.length >= 2 && Nc(s, { x: i.x, y: i.y });
  }
  return e;
}
function Pr(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of es(t))
    for (const [s, o, r] of n) {
      const a = i.c[s];
      e.push({ pt: a, wallId: i.wall.id, side: o, end: r, offset: D(I(a, i.f.a), i.f.dir) });
    }
  return e;
}
function Cr(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function Vn(t) {
  return new Map(es(t).map((e) => [e.wall.id, Cr(e)]));
}
function uo(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), a = e(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(z(s, E(I(o, s), r / (r - a))));
  }
  return n;
}
function ts(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of es(t)) {
    const s = Cr(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, d) => u.offset - d.offset), r = (u) => D(I(u, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const u of o)
      a.push([l, u.offset]), l = Math.max(l, u.offset + u.width);
    a.push([l, 1 / 0]);
    const c = [];
    for (const [u, d] of a) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = uo(p, (f) => r(f) - u)), d < 1 / 0 && (p = uo(p, (f) => d - r(f))), p.length >= 3 && Math.abs(xe(p)) > zc && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const Ei = (t) => [t.map((e) => [e.x, e.y])];
function Lr(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Or(t, e) {
  return zr(e ? [...ts(t).values()].flat() : [...Vn(t).values()]);
}
function zr(t) {
  const e = t.map(Ei);
  if (e.length === 0) return [];
  let n;
  try {
    n = Sr.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Lr));
}
const ot = 1e-6, gn = ["door", "gate", "wicket"], Vr = (t) => t === "opening", Hr = (t) => t.passesLight ?? Vr(t.kind), Nr = (t) => t === "opening", Tr = (t) => t.passesPir ?? Nr(t.kind);
function Dr(t, e) {
  return t.offset < e.offset + e.width - ot && e.offset < t.offset + t.width - ot;
}
function Hn(t, e, n, i, s) {
  const o = Ge(t, e);
  return o === null || i <= 0 || n < -ot || n + i > o + ot ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && Dr(r, { offset: n, width: i }));
}
function ct(t, e) {
  return { ...t, openings: e };
}
function Dc(t, e, n, i, s, o = {}) {
  const r = s ?? an[n], a = i - r / 2;
  if (!Hn(t, e, a, r)) return { level: t, openingId: null };
  const l = { id: K(), wallId: e, kind: n, offset: a, width: r, invalid: !1 };
  return gn.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: ct(t, [...t.openings, l]), openingId: l.id };
}
function Rr(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Hn(t, i.wallId, n, i.width, e) ? t : Ut(ct(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Rc(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !Hn(t, i.wallId, i.offset, n, e) ? t : Ut(ct(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Bc(t, e) {
  return gn.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Fc(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return Ut(ct(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function Br(t, e) {
  return Ut(ct(t, t.openings.filter((n) => n.id !== e)));
}
function Ut(t) {
  return ct(t, t.openings.map((e) => {
    const n = Ge(t, e.wallId), i = n === null || e.offset < -ot || e.offset + e.width > n + ot || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && Dr(e, s));
    return { ...e, invalid: i };
  }));
}
const wn = 1e-6;
function Fr(t, e) {
  return e.mode !== "none" && Xi[t.kind].includes(e.mode);
}
function Ur(t, e, n) {
  if (n.mode === "none" || !Fr(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -it || i > it)) return !1;
  const s = Ge(t, n.wallId);
  return s !== null && n.offset >= -wn && n.offset <= s + wn;
}
function Me(t, e) {
  return { ...t, devices: e };
}
function po(t, e, n, i) {
  if (!Ur(t, e, n)) return { level: t, deviceId: null };
  const s = { id: K(), name: i, placement: n, props: e, invalid: !1 };
  return { level: Me(t, [...t.devices, s]), deviceId: s.id };
}
function jr(t, e) {
  const n = { id: K(), name: e, placement: { mode: "none" }, props: Oe("equipment", "free"), invalid: !1 };
  return { level: Me(t, [...t.devices, n]), id: n.id };
}
const Uc = ["power", "power_in", "power_out", "voltage"];
function jc(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Uc.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const dt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, Wr = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function Zr(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function qr(t, e, n) {
  const i = t.devices.find((l) => l.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const a = Pn({ ...i, props: Zr(i.props, "inverter", n), bindings: r });
  return Me(t, t.devices.map((l) => l === i ? a : l));
}
function Nn(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: Zr(i.props, "controllable", n) };
  return Me(t, t.devices.map((o) => o === i ? s : o));
}
function Kr(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = Oe("motion_sensor", Lt(e)), s = Oe("motion_sensor", Lt(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function bn(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !Ur(t, s.props, n)) return t;
  const o = Kr(s.props, s.placement.mode, n.mode);
  return Gr(Me(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function jt(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? Me(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Pn({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Wc(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !vr(i.props.kind) || i.props.kind === n) return t;
  const s = Oe(n, Lt(i.placement.mode));
  if (!Fr(s, i.placement)) return t;
  const o = Pn({ ...i, props: s });
  return Me(t, t.devices.map((r) => r === i ? o : r));
}
function Zc(t, e) {
  return Me(t, t.devices.filter((n) => n.id !== e));
}
function Gr(t) {
  return Me(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = Ge(t, e.placement.wallId), i = n === null || e.placement.offset < -wn || e.placement.offset > n + wn;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function Yr(t) {
  const e = [];
  for (const n of Or(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function Ii(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!st(e, s)) continue;
    const o = Math.abs(xe(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const oi = 1e-3;
function Qr(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(xe(t)) - Math.abs(xe(e))) > oi ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= oi && Math.abs(n.y - i.y) <= oi));
}
const Xr = 2, fo = Math.ceil(360 / Xr), ho = 1e-4, qc = 1e-9, mo = 1e-9, Kc = {
  light: Hr,
  motion: Tr
};
function Jr(t, e) {
  const n = [];
  for (const i of zr([...ts(t, Kc[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function ns(t, e, n) {
  return e.filter(([i, s]) => $e(t, i, s) <= n);
}
function ri(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Gc(t, e, n) {
  const i = ns(t, e, n), s = [];
  for (let w = 0; w < fo; w++) s.push(-Math.PI + 2 * Math.PI * w / fo);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (L(t, g) > o) continue;
      const $ = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(ri($ - ho), ri($), ri($ + ho));
    }
  s.sort((w, g) => w - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    a[$] = w.x - t.x, l[$] = w.y - t.y, c[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const d = [], p = [];
  let f = NaN;
  for (const w of s) {
    if (w === f) continue;
    f = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let k = n, M = -1;
    for (let P = 0; P < r; P++) {
      const O = g * u[P] - $ * c[P];
      if (Math.abs(O) < 1e-12) continue;
      const H = (a[P] * u[P] - l[P] * c[P]) / O;
      if (!(H > qc && H < k)) continue;
      const U = (a[P] * $ - l[P] * g) / O;
      U < -mo || U > 1 + mo || (k = H, M = P);
    }
    const x = { x: t.x + g * k, y: t.y + $ * k }, S = d.length;
    if (!(S > 0 && d[S - 1].x === x.x && d[S - 1].y === x.y)) {
      if (M >= 0 && S >= 2 && p[S - 1] === M && p[S - 2] === M) {
        d[S - 1] = x;
        continue;
      }
      d.push(x), p.push(M);
    }
  }
  const m = d[0], b = d[d.length - 1];
  return d.length > 1 && m.x === b.x && m.y === b.y && d.pop(), d;
}
const Yc = 32, go = 128;
function yn(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function ve(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function is(t) {
  return (t % 360 + 360) % 360;
}
function ea(t) {
  return (t % 360 + 540) % 360 - 180;
}
function ta(t, e, n, i) {
  const s = t.walls.find((c) => c.id === e);
  if (!s) return null;
  let o;
  try {
    o = J(t, s);
  } catch {
    return null;
  }
  const r = Y(o.dir), a = n === "left" ? r : E(r, -1), l = n === "left" ? o.leftOff : o.rightOff;
  return { pt: z(z(o.a, E(o.dir, i)), E(a, l)), normal: a };
}
function zt(t, e, n, i) {
  var s;
  return ((s = ta(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function X(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: yn(n.rotation) };
  const i = ta(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: z(i.pt, E(s, r)), dir: Y(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? yn(ve(s) + n.aim) : s, normal: s };
}
function wo(t, e, n, i, s, o) {
  const r = t.nodes.find((l) => l.id === n);
  if (!r || r.host) return !1;
  let a = !1;
  for (const l of t.walls) {
    if (l === e || l.a !== n && l.b !== n) continue;
    let c;
    try {
      c = J(t, l);
    } catch {
      continue;
    }
    const u = l.a === n ? c.dir : E(c.dir, -1);
    if (Math.abs(te(i, u)) < 1e-9 && D(i, u) < 0) {
      if ((D(Y(c.dir), s) > 0 ? c.leftOff : c.rightOff) > o + 1e-6) return !1;
      a = !0;
    } else if (D(u, s) > 1e-9) return !1;
  }
  return a;
}
function ss(t, e, n, i) {
  var U;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const s = t.walls.find((V) => V.id === n.wallId);
  if (!s) return n;
  let o;
  try {
    o = J(t, s);
  } catch {
    return n;
  }
  const r = Pr(t), a = r.filter((V) => V.wallId === n.wallId && V.side === n.side), l = a.find((V) => V.end === "a"), c = a.find((V) => V.end === "b");
  if (!l || !c) return n;
  const u = Y(o.dir), d = n.side === "left" ? u : E(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, f = wo(t, s, s.a, o.dir, d, p) ? -1 / 0 : l.offset, m = wo(t, s, s.b, E(o.dir, -1), d, p) ? 1 / 0 : c.offset, b = (V) => D(I(V, o.a), o.dir), w = [];
  for (const V of t.nodes)
    if (((U = V.host) == null ? void 0 : U.wallId) === s.id)
      for (const N of t.walls) {
        const j = N.a === V.id ? "a" : N.b === V.id ? "b" : null, se = j && t.nodes.find((Ae) => Ae.id === (j === "a" ? N.b : N.a));
        if (!se || (D(I(se, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const ge = r.filter((Ae) => Ae.wallId === N.id && Ae.end === j).map((Ae) => b(Ae.pt));
        ge.length && w.push([Math.min(...ge), Math.max(...ge)]);
      }
  w.sort((V, N) => V[0] - N[0]);
  const g = [];
  let $ = f;
  for (const [V, N] of w) {
    const j = Math.min(V, m);
    j > $ && g.push([$, j]), $ = Math.max($, N);
  }
  m > $ && g.push([$, m]), g.length === 0 && g.push([f, m]);
  const k = ([V, N]) => Math.max(0, V - n.offset, n.offset - N), [M, x] = g.reduce((V, N) => k(N) < k(V) ? N : V), S = (e.shape === "circle" ? e.diameter : e.width) / 2, P = M + S, O = x - S;
  let H = n.offset;
  return P > O ? H = (M + x) / 2 : H <= P + i ? H = P : H >= O - i && (H = O), H = Math.max(0, Math.min(o.len, H)), Math.abs(H - n.offset) < 1e-9 ? n : { ...n, offset: H };
}
function na(t, e) {
  const n = [];
  for (let i = 0; i < go; i++) n.push(z(t, E(yn(360 * i / go), e)));
  return n;
}
function bo(t, e, n, i) {
  if (n >= 360) return na(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Yc)), o = ve(e) - n / 2, r = [t];
  for (let a = 0; a <= s; a++) r.push(z(t, E(yn(o + n * a / s), i)));
  return r;
}
const Qc = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Tn(t) {
  return Qc[t] ?? null;
}
const Xc = (t) => Tn(t.kind) !== null;
function Jc(t, e) {
  const n = e.props;
  if (!Xc(n)) return null;
  const i = X(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? bo(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? bo(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? na(i.pt, n.poolRadius) : null;
  }
}
function ed(t) {
  return t.normal ? z(t.pt, t.normal) : t.pt;
}
function yo(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function td(t, e, n) {
  const i = I(e, t);
  for (const [s, o] of n) {
    const r = I(o, s), a = I(s, t), l = te(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const c = te(a, r) / l, u = te(a, i) / l;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const vo = 0.5, nd = 3, id = 1e-4;
function sd(t, e, n) {
  const i = X(t, e);
  if (!i) return null;
  const s = ed(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (x) => yo(x, n) || ns(x, n, vo).length > 0;
  if (!r(s)) return s;
  const a = J(t, t.walls.find((x) => x.id === o.wallId)), l = i.normal, c = (x) => Math.abs(D(I(x, i.pt), l)) <= id, u = ([x, S]) => E(z(x, S), 0.5), d = n.filter((x) => c(x[0]) && c(x[1]) && L(x[0], x[1]) > 1e-9 && !yo(z(u(x), E(l, vo)), n)), p = (x) => D(I(x, a.a), a.dir), f = ([x, S]) => Math.max(0, Math.min(p(x), p(S)) - o.offset, o.offset - Math.max(p(x), p(S))), m = Math.min(...d.map(f)), b = d.filter((x) => f(x) <= m + 1e-6).map((x) => z(u(x), l)), w = (x) => b.some((S) => !td(x, S, n)), g = nd * Math.max(...t.walls.map((x) => x.thickness)) + 2, $ = [];
  for (const [x, S] of n) {
    const P = I(S, x), O = I(x, s), H = te(a.dir, P);
    if (Math.abs(H) < 1e-12) continue;
    const U = te(O, a.dir) / H;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const V = te(O, P) / H, N = L(x, S) / Math.abs(H);
    $.push(V - N, V + N);
  }
  const k = o.offset <= a.len / 2 ? 1 : -1, M = $.filter((x) => Math.abs(x) <= g).sort((x, S) => Math.abs(x) - Math.abs(S) || Math.sign(S) * k - Math.sign(x) * k);
  for (const x of M) {
    const S = z(s, E(a.dir, x));
    if (!r(S) && w(S)) return S;
  }
  return null;
}
const od = 1 / Math.cos(Xr / 2 * (Math.PI / 180)), $o = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function rd(t, e, n = Jr) {
  const i = Jc(t, e), s = Tn(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = sd(t, e, o);
  if (!r) return [];
  const a = Math.max(...i.map((d) => L(d, r))) * od, l = ns(r, o, a);
  if (l.length === 0) return [i];
  const c = Gc(r, l, a);
  let u;
  try {
    u = Sr.intersection(Ei($o(i)), Ei($o(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(Lr));
}
function ad(t, e, n, i) {
  const s = X(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, D(I(n, s.pt), s.dir)));
    return L(z(s.pt, E(s.dir, a)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return L(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return L(s.pt, n) <= i;
  if (o.shape === "circle") return L(s.pt, n) <= o.diameter / 2 + i;
  const r = I(n, s.pt);
  return Math.abs(D(r, s.dir)) <= o.width / 2 + i && Math.abs(D(r, Y(s.dir))) <= o.depth / 2 + i;
}
function ia(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && ad(t, i[o], e, n)) return i[o].id;
  return null;
}
const ld = 60;
function Pi(t, e, n) {
  if (!xr.has(e.props.kind)) return null;
  const i = X(t, e);
  return i ? { from: i.pt, to: z(i.pt, E(i.dir, ld / n)) } : null;
}
function sa(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function cd(t, e, n, i) {
  const s = e.placement, o = X(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = ve(I(n, o.pt)), a = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: is(a(r)) };
  const l = ea(r - ve(o.normal)), c = Math.max(-it, Math.min(it, a(l)));
  return sa(s, c);
}
const dd = 1, vn = 1, xo = 1e-6, ud = 1e-9, pd = 1e-6, fd = 1;
function os(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = Ge(t, e.wallId);
      return n === null ? null : zt(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function ie(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => os(t, i) ?? { x: i.x, y: i.y });
}
function rs(t, e) {
  const n = ie(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(xe(n)) / 1e5) / 10;
}
function vt(t, e, n) {
  const i = te(I(e, t), I(n, t));
  return Math.abs(i) <= ud * L(t, e) * L(t, n) ? 0 : Math.sign(i);
}
const Kt = (t, e, n) => D(I(e, t), I(n, t)) <= 0;
function oa(t, e, n, i) {
  const s = vt(n, i, t), o = vt(n, i, e), r = vt(t, e, n), a = vt(t, e, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && Kt(n, t, e) || a === 0 && Kt(i, t, e) || s === 0 && Kt(t, n, i) || o === 0 && Kt(e, n, i);
}
function hd(t) {
  const e = [];
  for (const n of t) (e.length === 0 || L(e[e.length - 1], n) > xo) && e.push(n);
  for (; e.length > 1 && L(e[0], e[e.length - 1]) <= xo; ) e.pop();
  return e;
}
function $n(t) {
  const e = hd(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (vt(s, o, r) === 0 && D(I(o, s), I(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && oa(s, o, e[a], e[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function ra(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : os(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = Ge(t, o.wallId);
    return r !== null && (o.offset < -vn || o.offset > r + vn);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = ie(t, e);
  return Math.abs(xe(s)) < fd || $n(s) ? "crossing" : null;
}
function Dn(t, e) {
  return st(e, t) || t.some((n, i) => $e(e, n, t[(i + 1) % t.length]) <= dd);
}
const aa = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function md(t, e) {
  const n = X(t, e);
  return n ? t.zones.filter((i) => Dn(ie(t, i), n.pt)).map((i) => ({ zone: i, participates: aa(e, i.id) })) : [];
}
function la(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = ie(t, n), s = [];
  for (const o of t.devices) {
    const r = X(t, o);
    r && Dn(i, r.pt) && s.push({ device: o, participates: aa(o, e) });
  }
  return s;
}
function gd(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = xe(t);
  if (Math.abs(n) > pd) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const a = t[r], l = t[(r + 1) % e], c = a.x * l.y - l.x * a.y;
      i += (a.x + l.x) * c, s += (a.y + l.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (st(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const ai = 32;
function ko(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, $e(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function ca(t) {
  const e = t.zones.map((s) => ie(t, s)), n = e.map((s) => Math.abs(xe(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const a = e.filter((b, w) => w !== o && b.length >= 3 && n[w] < n[o] && b.every((g) => Dn(r, g))), l = gd(r);
    if (a.length === 0) {
      i.set(s.id, l);
      return;
    }
    const c = r.map((b) => b.x), u = r.map((b) => b.y), d = Math.min(...c), p = Math.min(...u), f = Math.max(Math.max(...c) - d, Math.max(...u) - p) / ai;
    let m = null;
    for (let b = d + f / 2; b < d + f * ai; b += f)
      for (let w = p + f / 2; w < p + f * ai; w += f) {
        const g = { x: b, y: w };
        if (!st(g, r) || a.some((k) => st(g, k))) continue;
        const $ = Math.min(ko(g, [r]), ko(g, a));
        (!m || $ > m.d) && (m = { p: g, d: $ });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? l);
  }), i;
}
const as = 3, rt = (t, e) => ({ ...t, zones: e }), Vt = (t, e, n) => rt(t, t.zones.map((i) => i === e ? n : i)), ls = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), da = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function wd(t, e) {
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
function bd(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && da(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => wd(n, e.vertices[i]));
}
function ua(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && bd(t.shape, e.shape);
}
function yd(t, e) {
  if (e.kind === "free") return e;
  const n = os(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : ls(e);
}
function pa(t, e) {
  const n = e.shape, i = n.vertices.map((s) => yd(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function vd(t, e, n) {
  const i = t.shape, s = Ii(e, i.seed);
  return !s || n.some((o) => Qr(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && da(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function fa(t, e) {
  const n = ra(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const cs = (t, e) => fa(t, pa(t, e));
function $d(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? Yr(t) : [], i = [], s = e.map((o) => fa(
    t,
    o.shape.kind === "walls" ? vd(o, n, i) : pa(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? rt(t, s) : t;
}
function xd(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && ua(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : rt(t, i) : s.some((o, r) => o !== n[r]) ? rt(t, s) : t;
}
function kd(t, e, n) {
  const i = Yr(t), s = Ii(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const a = Ii(i, r.shape.seed);
    if (a && Qr(a, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: K(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: rt(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const ds = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function Md(t, e, n) {
  if (e.length < as) return { level: t, zoneId: null };
  const i = cs(t, { id: K(), name: n, shape: { kind: "polygon", vertices: e.map(ds) }, invalid: !1 });
  return $n(ie(t, i)) ? { level: t, zoneId: null } : { level: rt(t, [...t.zones, i]), zoneId: i.id };
}
function _d(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : Vt(t, i, { ...i, name: n });
}
function us(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return Vt(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return Vt(t, i, o);
}
function ha(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function ma(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? ha(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function ps(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function fs(t, e, n) {
  const i = cs(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return ua(i, e) ? t : Vt(t, e, i);
}
const hs = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function Ad(t, e, n, i) {
  const s = ps(t, e);
  return !s || !hs(n, s.shape.vertices.length) ? t : fs(t, s, s.shape.vertices.map((o, r) => r === n ? ds(i) : o));
}
function Sd(t, e, n, i) {
  const s = ps(t, e);
  if (!s || !hs(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, ds(i)), fs(t, s, o);
}
function Ed(t, e, n) {
  const i = ps(t, e);
  return !i || i.shape.vertices.length <= as || !hs(n, i.shape.vertices.length) ? t : fs(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function Id(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < as) return t;
  const i = n.shape.outline.map(ls);
  return Vt(t, n, cs(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function ga(t, e, n, i) {
  const s = t.devices.find((a) => a.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((a) => a.id === n)) return t;
  const r = ha(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((a) => a === s ? r : a) };
}
const Ht = 1;
function me(t) {
  return structuredClone(t);
}
function Rn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Pd(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function Bn(t, e, n) {
  const i = Z(t, e.a), s = Z(t, e.b), o = L(i, s), r = Pd(typeof n == "number" ? n : On(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : _r(i, s, r / o), offset: r };
}
function Cd(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Bn(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function wa(t, e) {
  Cd(t), e && Vd(e, t);
  const n = $d(Gr(Ut(t)));
  return e ? xd(n, e) : n;
}
function _e(t, e) {
  return wa(me(t), e);
}
function ba(t, e, n) {
  const i = zn(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Bn(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Mo(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: Z(t, e.nodeId), nodeId: e.nodeId };
  const n = Rn(t, e.wallId), { pt: i, offset: s } = Bn(t, n, e.offset), o = L(Z(t, n.a), Z(t, n.b));
  return s <= Ht ? { pt: Z(t, n.a), nodeId: n.a } : o - s <= Ht ? { pt: Z(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function _o(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: K(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Ld(t, e, n, i) {
  const s = Mo(t, e), o = Mo(t, n);
  if (L(s.pt, o.pt) < Ht) return { level: t, wallId: null, endNodeId: null };
  const r = me(t), a = _o(r, s), l = _o(r, o);
  if (a === l) return { level: t, wallId: null, endNodeId: null };
  const c = { id: K(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: _e(r, t), wallId: c.id, endNodeId: l };
}
function ya(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, a = Math.min(t.y, e.y) - s, l = Math.max(t.y, e.y) + s;
  return r - o < Ht || l - a < Ht ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Od(t, e, n, i, s) {
  const o = ya(e, n, i.thickness, s);
  if (!o) return t;
  const r = me(t), a = o.map((l) => {
    const c = { id: K(), x: l.x, y: l.y };
    return r.nodes.push(c), c.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: K(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return _e(r, t);
}
function zd(t, e, n) {
  const i = me(t);
  return ba(i, e, n), wa(i, t);
}
function Vd(t, e) {
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
    const u = Ln(I(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = On(z(o, E(u, d.offset)), a, l) * c);
  }
}
function Hd(t, e, n) {
  const i = me(t), s = Rn(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: z(Z(i, a), n) }));
  for (const a of r) ba(i, a.id, a.to);
  return _e(i, t);
}
function Fn(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function va(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function Nd(t, e, n) {
  const i = me(t), s = Rn(i, e), o = s[n], r = Z(i, o), a = { id: K(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || va(i, o, a.id), Fn(i), { level: _e(i, t), nodeId: a.id };
}
function Td(t, e, n) {
  if (e === n) return t;
  const i = me(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return va(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), Fn(i), _e(i, t);
}
function ms(t, e) {
  var i;
  const n = me(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return Fn(n), _e(n, t);
}
function Dd(t, e, n) {
  const i = me(t);
  return Object.assign(Rn(i, e), n), _e(i, t);
}
const oe = (t) => typeof t == "string" && t !== "" ? t : null, $a = (t) => t.split(".")[0], Rd = ["friendly_name", "device_class", "unit_of_measurement"];
function xa(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: $a(t),
    name: oe(n.friendly_name) ?? t,
    deviceClass: oe(n.device_class),
    unit: oe(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Bd(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, xa(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Fd(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && Rd.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(t).length;
}
function ka(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Ud(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = xa(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: oe(r.name) ?? oe(r.original_name) ?? a.name,
      deviceId: oe(r.device_id),
      areaId: oe(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: oe(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: oe(r.name_by_user) ?? oe(r.name) ?? r.id, model: oe(r.model), areaId: oe(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function jd(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Ma(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : ka(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Wd = {
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
  return Wd[t] ?? t;
}
const Zd = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], qd = 10;
function ut(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return dt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function _a() {
  return { blocks: [{ id: K(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Kd(t, e, n, i) {
  const s = { id: K(), x: e.x, y: e.y }, o = { ...s, name: `${h(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function Ao(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Un(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Gd(t, e, n, i) {
  return Un(t, e, (s) => ({ ...s, x: n, y: i }));
}
const Ci = (t) => "block" in t ? t.block : t.bus, Aa = (t, e) => Ci(t.from) === e || Ci(t.to) === e;
function Nt(t, e, n, i) {
  const s = t.blocks.find((c) => c.id === e);
  if (!s) return t;
  const o = Un(t, e, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !Aa(c, e)) };
  const r = o.blocks.find((c) => c.id === e), a = new Set(ut(r, i).map((c) => c.name)), l = (c) => "block" in c && c.block === e && !a.has(c.port);
  return o.wires.some((c) => l(c.from) || l(c.to)) ? { ...o, wires: o.wires.filter((c) => !l(c.from) && !l(c.to)) } : o;
}
function Sa(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Aa(i, e)) };
}
const Ea = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function jn(t, e, n) {
  const i = Ea(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(ut(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = t.wires.filter((c) => !o(c.from) && !o(c.to));
  let a = !1;
  const l = t.blocks.map((c) => {
    const u = s.get(c.id);
    if (!u || !c.portPins || Object.keys(c.portPins).every((m) => u.has(m))) return c;
    a = !0;
    const d = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => u.has(m))), { portPins: p, ...f } = c;
    return Object.keys(d).length ? { ...f, portPins: d } : f;
  });
  return r.length === t.wires.length && !a ? t : { ...t, blocks: l, wires: r };
}
function Yd(t, e) {
  const n = gs(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = jn(s, o, n);
  return s;
}
function Qd(t, e) {
  const n = Ea(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(Ci(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const gs = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Ia(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Zc(t, n);
  return { level: s, power: i ? Qd(e, n) : jn(e, n, gs(s)) };
}
function Pa(t, e, n, i) {
  const s = qr(t, n, i);
  return { level: s, power: s === t ? e : jn(e, n, gs(s)) };
}
function Ca(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Xd(t, e, n, i) {
  return Un(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...a } = s;
    return Object.keys(o).length ? { ...a, portPins: o } : a;
  });
}
function Jd(t, e) {
  return Un(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function So(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function eu(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, qd), s = /* @__PURE__ */ new Map();
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
function Eo(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const $ = s.get(g.block), k = $ ? ut($, i).find((M) => M.name === g.port) : void 0;
    return $ && k ? { bl: $, dir: k.dir } : null;
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
  const u = (g) => "block" in g && t.wires.some(($) => [$.from, $.to].some((k) => "block" in k && k.block === g.block && k.port === g.port));
  if (u(l) || u(c)) return { error: "port-taken" };
  const d = (g) => {
    for (const $ of t.wires)
      for (const [k, M] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in k && k.bus === g && "block" in M) {
          const x = s.get(M.block);
          if (x) return So(x, M.port);
        }
    return null;
  }, p = (g) => "bus" in g ? d(g.bus) : So(s.get(g.block), g.port), f = p(l), m = p(c);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in l && "block" in c && s.get(c.block).kind === "remainder" && t.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === l.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const b = { id: K(), from: l, to: c }, w = [...t.wires, b];
  return eu(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: b };
}
const we = (t) => typeof t == "object" && t !== null && !Array.isArray(t), tt = (t) => typeof t == "number" && Number.isFinite(t), tu = ["top", "right", "bottom", "left"], nu = ["2in1out", "1in2out"];
function iu(t, e) {
  let n = t;
  if (n.kind === "bus" && !(tt(n.w) && tt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !nu.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(ut(n, e).map((c) => c.name)), o = {};
  let r = we(i);
  for (const [c, u] of we(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !we(u) || !tu.includes(u.side) || !tt(u.at)) {
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
function su(t, e) {
  if (!we(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (we(u) && typeof u.id == "string" && u.id && Zd.includes(u.kind) && tt(u.x) && tt(u.y)) {
      const d = iu(u, e);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const a = new Map(o.map((u) => [u.id, u])), l = (u) => {
    var p;
    if (!we(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = a.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !tt(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const d = typeof u.block == "string" ? a.get(u.block) : void 0;
    return d && !r.has(d.id) && ut(d, e).some((f) => f.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = we(u) ? l(u.from) : null, p = we(u) ? l(u.to) : null;
    if (!we(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...t, blocks: o, wires: c } : t;
}
function La(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function ou(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Wt = 11, xn = 18, kn = 30, ru = 12, au = 120, ne = 14, Io = 10, Tt = (t) => Math.round(t / Io) * Io || 0, li = 24, Po = 6, lu = 2 * Wt + 6, cu = ne, du = 1e6, Co = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Wn = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), ci = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Oa = (t) => Math.min(1, Math.max(0, t));
function Zn(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function uu(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = dt(i);
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
  return n ? ys(n, t, e).r : ws(t, e);
}
function ws(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(au, 7 * Zn(t, e).length + 32),
    h: kn + xn * uu(t, e) + ru
  };
}
function Mn(t, e, n) {
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
function pu(t, e) {
  const n = Wn(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function fu(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const a of n) {
    const l = $e(e, a.a, a.b);
    l < s && (i = a, s = l);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Oa(r) };
}
const Dt = (t) => t.w >= t.h;
function za(t, e) {
  return Dt(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function hu(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Dt(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Mn(i, r, 0.5), side: r };
  }
  const s = Wn(i), o = Dt(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: Mn(i, o, e), side: o };
}
function mu(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const bs = (t, e) => t.blocks.find((n) => n.id === e), Li = (t, e) => {
  const n = bs(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, di = (t, e, n) => "block" in t && t.block === e && t.port === n;
function gu(t, e, n, i) {
  const s = t.wires.find((a) => di(a.from, e, n) || di(a.to, e, n));
  if (!s) return null;
  const o = di(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const a = Li(t, o.bus);
    return a ? za(a, o.at) : null;
  }
  const r = bs(t, o.block);
  return r ? Wn(ws(r, i)) : null;
}
function ys(t, e, n) {
  const i = ws(e, n), s = Wn(i), o = ut(e, n).map((c) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = gu(t, e.id, c.name, n), p = (d && pu(i, d)) ?? mu(e, c), f = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * lu : 0;
  }, a = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, l = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (l[u] = { name: c.name, dir: c.dir, side: c.side, pt: Mn(a, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, f) => {
      l[p] = { name: d.name, dir: d.dir, side: c, pt: Mn(a, c, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: a, places: l };
}
function qn(t, e, n) {
  return ys(t, e, n).places;
}
function Va(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = bs(t, c.block);
    if (!u) return null;
    const { r: d, places: p } = ys(t, u, n), f = p.find((m) => m.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = Li(t, c.bus);
    if (!p) return null;
    let f = d == null ? void 0 : d.pt;
    if (!f && "bus" in u) {
      const m = Li(t, u.bus);
      f = m && za(m, u.at);
    }
    return f ? { ...hu(p, c.at, f), rect: he(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), a = o ?? s(e.from, e.to, r), l = r ?? s(e.to, e.from, o);
  return a && l ? { a, b: l } : null;
}
const Gt = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Oi = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function wu(t, e, n) {
  const i = [];
  for (const a of t) {
    const l = i[i.length - 1];
    if (!(l && l.x === a.x && l.y === a.y)) {
      if (l && l.x !== a.x && l.y !== a.y) return null;
      if (i.length >= 2) {
        const c = Gt(i[i.length - 2], l), u = Gt(l, a);
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
  const o = Gt(i[0], i[1]), r = Gt(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || Oi(i[0], i[1]) < ne - 1e-9 || r.x !== -n.x || r.y !== -n.y || Oi(i[s - 2], i[s - 1]) < ne - 1e-9 ? null : i;
}
function bu(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function yu(t, e) {
  let n = (t.length - 2) * cu;
  for (let i = 1; i < t.length; i++) {
    n += Oi(t[i - 1], t[i]);
    for (const s of e) bu(t[i - 1], t[i], s) && (n += du);
  }
  return n;
}
function Ha(t, e) {
  const n = t.pt, i = e.pt, s = Co[t.side], o = Co[e.side], r = { x: n.x + s.x * ne, y: n.y + s.y * ne }, a = { x: i.x + o.x * ne, y: i.y + o.y * ne }, l = [t.rect, e.rect].filter((k) => !!k), c = (k, M) => [.../* @__PURE__ */ new Set([
    (r[k] + a[k]) / 2,
    r[k],
    a[k],
    n[k],
    i[k],
    ...l.flatMap((x) => [x[k] - ne, x[k] + x[M] + ne]),
    Math.min(r[k], a[k]) - ne,
    Math.max(r[k], a[k]) + ne
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, f = o.x === 0, m = (p ? d : u).filter((k) => (k - (p ? n.y : n.x)) * (p ? s.y : s.x) >= ne - 1e-9), b = (f ? d : u).filter((k) => (k - (f ? i.y : i.x)) * (f ? o.y : o.x) >= ne - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (k) => {
    const M = wu(k, s, o);
    if (!M) return;
    const x = yu(M, l);
    x < g - 1e-6 && (w = M, g = x);
  };
  if (p && f)
    for (const k of m) for (const M of u) for (const x of b)
      $([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: x }, { x: i.x, y: x }, i]);
  else if (!p && !f)
    for (const k of m) for (const M of d) for (const x of b)
      $([n, { x: k, y: n.y }, { x: k, y: M }, { x, y: M }, { x, y: i.y }, i]);
  else if (p)
    for (const k of m) for (const M of b)
      $([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: i.y }, i]);
  else
    for (const k of m) for (const M of b)
      $([n, { x: k, y: n.y }, { x: k, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, p ? { x: r.x, y: a.y } : { x: a.x, y: r.y }, a, i];
}
function Na(t, e, n) {
  const i = he(t, e, n), s = i.x + (i.w - (3 * li + 2 * Po)) / 2, o = i.y + kn + 1;
  return ["A", "0", "B"].map((r, a) => ({
    position: r,
    rect: { x: s + a * (li + Po), y: o, w: li, h: xn - 2 }
  }));
}
function vu(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return Dt(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function Lo(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = Na(u, i, t).find((p) => ci(e, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of qn(t, u, i)) {
      const p = L(e, d.pt);
      p <= Wt + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const f of vu(u)) {
      const m = $e(e, f.a, f.b);
      m <= n && m < p && (d = { kind: "bus-end", id: u.id, end: f.end }, p = m);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !ci(e, he(u, i, t), n)) continue;
    const d = Dt(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Oa(d) };
  }
  let a = null, l = 1 / 0;
  for (const u of t.wires) {
    const d = Va(t, u, i);
    if (!d) continue;
    const p = Ha(d.a, d.b);
    for (let f = 1; f < p.length; f++) {
      const m = $e(e, p[f - 1], p[f]);
      m <= n && m < l && (a = { kind: "wire", id: u.id }, l = m);
    }
  }
  if (a) return a;
  const c = s.find((u) => u.kind !== "bus" && ci(e, he(u, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function $u(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const a = he(r, e, t);
    n = Math.min(n, a.x), i = Math.min(i, a.y), s = Math.max(s, a.x + a.w), o = Math.max(o, a.y + a.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class Ta extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function ui(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function xu(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function ku(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new Ta(s.message) : s;
  }
}
async function Mu(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const _u = 3;
function be(t) {
  if (typeof t == "number")
    return t === _u ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class Au {
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
    const i = { ...e, id: K(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await ku(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof Ta ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = be(o)), this.onChange(), null;
    }
  }
}
var Da = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Su = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Eu = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Iu = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Pu = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Cu = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Oo = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Yt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Lu = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Ou = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", zu = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Vu = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Hu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Nu = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Tu = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Du = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Ru = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Bu = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Fu = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Uu = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", ju = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", Wu = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Zu = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Ra = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", qu = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Ku = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", Ba = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Gu = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Yu = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Qu = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Xu = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z", Ju = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", ep = "M22 2V22H20V13H14.82A3 3 0 0 1 9.18 13H4V22H2V2H4V11H9.18A3 3 0 0 1 14.82 11H20V2Z", tp = "M4 22H2V2H4M22 2H20V22H22M11 4V9.18A3 3 0 0 0 11 14.82V20H13V14.82A3 3 0 0 0 13 9.18V4Z", np = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", ip = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", sp = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", op = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", rp = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", ap = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const le = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function fe(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function Fa(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${h("unit.m2")}`;
}
const vs = 12, F = "non-scaling-stroke", lp = 7, cp = 10, dp = "#f43f5e", up = "3 2", pp = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Ua = 24, Qt = 4, zo = 4, cn = vs * 0.85, fp = 0.58;
function hp(t, e, n, i) {
  const s = Ua;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), a = Math.abs(Math.sin(o)), [l, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * a, t.width * a + t.depth * r], u = l * i - 2 * zo, d = c * i - 2 * zo, p = e.length * fp * cn, f = s + Qt + cn, m = s + Qt + p, b = Math.max(s, p), w = (M, x) => Math.max(0, M - u) + Math.max(0, x - d), g = w(b, f), $ = w(m, s);
  if (g > 0 && $ < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Qt) / i,
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
    labelY: (k + s + Qt + cn / 2) / i,
    labelAnchor: "middle"
  };
}
function mp(t, e, n, i = 0, s = 0) {
  const o = Ua / e;
  return customElements.get("ha-icon") ? A`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : A`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${pp} fill=${n}></path></g>`;
}
const gp = "__preview__", wp = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, bp = /* @__PURE__ */ new WeakMap();
function yp(t, e) {
  var s;
  const n = fe(bp, t.walls, () => /* @__PURE__ */ new WeakMap()), i = fe(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = fe(i, t.openings, () => ({})))[e] ?? (s[e] = Jr(t, e));
}
const vp = /* @__PURE__ */ new WeakMap();
function $p(t, e) {
  const n = Tn(e.props.kind);
  if (!n) return [];
  const i = yp(t, n), s = fe(vp, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = rd(t, e, () => i), s.set(e, o)), o;
}
function zi(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function xp(t, e, n, i, s) {
  const o = t.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? A`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></rect>` : o.shape === "spot" ? A`<circle class="icon" r=${e / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></circle>` : A`<circle class="icon" r=${zi(t, e)} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>`;
    case "wall_light":
      return A`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${F}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${e * l} ${-e * l * 0.8}A${e * l} ${e * l * 0.8} 0 0 1 ${e * l} ${e * l * 0.8}`;
      return A`<circle class="icon" r=${e * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const c = l * Math.PI / 4;
        a += `M${Math.cos(c) * e * 1.15} ${Math.sin(c) * e * 1.15}L${Math.cos(c) * e * 1.6} ${Math.sin(c) * e * 1.6}`;
      }
      return A`<circle class="icon" r=${e * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    case "wall_switch":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v} vector-effect=${F}></rect>`;
    case "valve":
      return A`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${s ?? v} vector-effect=${F}></path>`;
    case "leak_sensor":
      return A`<circle class="icon" r=${e * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></path>`;
    case "smart_button":
      return A`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v}
        vector-effect=${F}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return A`<circle class="icon" r=${e} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return A`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${F}></path>`;
    case "exhaust_fan": {
      let a = "";
      for (let l = 0; l < 4; l++) {
        const c = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(c) * e * 0.85} ${Math.sin(c) * e * 0.85}`;
      }
      return A`<circle class="icon" r=${e} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${F}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${F}></path>`;
    }
    default:
      return A`${v}`;
  }
}
function kp(t, e, n, i) {
  const s = t.props;
  if (s.kind !== "equipment") return A`${v}`;
  const o = hp(s, s.label, i, e.scale), r = s.shape === "circle" ? A`<circle class="equipment-body" r=${s.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${F}></circle>` : A`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${F}></rect>`;
  return A`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${mp(s.icon, e.scale, n, o.iconX, o.iconY)}
    <text class="equipment-label" x=${o.labelX} y=${o.labelY} text-anchor=${o.labelAnchor} dominant-baseline="middle"
      font-size=${cn / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Mp(t, e, n = 0) {
  return t === "bound" ? v : A`<circle class=${`bind-ring bind-${t}`} r=${Math.max(vs * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${wp[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : v} vector-effect=${F}></circle>`;
}
function _p(t, e) {
  return t.action === "toggle" ? ["toggle", Xu] : t.action === "auto" ? ["auto", Ku] : e === "valve" ? t.value === "off" ? ["valve-closed", ep] : ["valve-open", tp] : t.value === "off" ? ["set-off", ju] : ["set-on", Uu];
}
function Ap(t, e, n, i, s) {
  const o = e ? _p(e, n) : t.status === "error" ? ["alert", Da] : null;
  if (!o) return v;
  const [r, a] = o, l = e ? s.palette.selection : dp, c = i * 0.9, u = -i * 0.9, d = cp / s.scale;
  return A`<g class="badge" data-badge=${r}>
    <circle cx=${c} cy=${u} r=${lp / s.scale} fill=${s.palette.background} stroke=${l} stroke-width="1.5"
      vector-effect=${F}></circle>
    <path d=${a} fill=${l} transform=${`translate(${c - d / 2} ${u - d / 2}) scale(${d / 24})`}></path>
  </g>`;
}
function Sp(t, e, n, i) {
  var b, w, g;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = vs / n.scale, a = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, l = !i && ((b = n.selection) == null ? void 0 : b.kind) === "device" && n.selection.id === t.id, c = !i && Cn(t.props.kind), u = c ? (w = n.containerState) == null ? void 0 : w.call(n, t) : void 0, d = c && !u, p = `device device-${t.props.kind}${l ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (d ? " no-data" : ""), f = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, m = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, zi(t, r));
  return A`
    <g class=${p} data-id=${t.id} opacity=${f} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${l ? A`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${F}></circle>` : v}
      ${t.props.kind === "equipment" ? kp(t, n, o, a) : A`<g transform=${`rotate(${a})`}>${xp(
    t,
    r,
    o,
    s.deviceFill,
    d ? up : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? Mp(n.bindingStatus(t), n.scale, zi(t, r)) : v}
      ${u ? Ap(u, ((g = n.containerFlash) == null ? void 0 : g.call(n, t)) ?? null, t.props.kind, r, n) : v}
    </g>`;
}
function Ep(t, e, n, i) {
  const s = $p(t, e);
  if (s.length === 0) return v;
  const o = n.palette, r = e.invalid ? o.invalid : Tn(e.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, l = s.map(le).join("");
  return e.props.kind === "ceiling_light" ? A`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${F}></path>` : A`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${F}></path>`;
}
function Ip(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return v;
  const n = e.selection.id, i = t.devices.find((a) => a.id === n), s = i ? Pi(t, i, e.scale) : null;
  if (!s) return v;
  const o = e.palette.selection;
  return A`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${F}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${F} style="cursor:grab"></circle>
  </g>`;
}
function Pp(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = X(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: gp, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = X(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return A`
    <g class="cones">${e.showCones ? n.map((i) => Ep(t, i.d, e, i.preview)) : v}</g>
    <g class="devices">${n.map((i) => Sp(i.d, i.pose, e, i.preview))}</g>
    ${Ip(t, e)}`;
}
const Vo = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], $s = (t) => Vo[t % Vo.length], Ze = "non-scaling-stroke", Cp = "0.55", Lp = /* @__PURE__ */ new WeakMap();
function Op(t, e, n, i) {
  const s = i.palette, o = $s(n), r = i.selectedId === e.id, a = fe(Lp, t, ca).get(e.id), l = 12 / i.scale;
  return A`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${le(ie(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? v : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${Ze}
        opacity=${i.selectedId !== null && !r ? Cp : v}></path>
      ${a ? A`<text class="zone-label" x=${a.x} y=${a.y} text-anchor="middle" font-size=${l} font-family="system-ui, sans-serif">
        <tspan x=${a.x} dy=${-0.2 * l} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${a.x} dy=${1.2 * l} font-size=${l * 0.9} fill=${s.zoneLabel}>${Fa(rs(t, e))}</tspan>
      </text>` : v}
    </g>`;
}
function zp(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return A`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => A`
      <path class="zone" data-id=${o.id} d=${le(ie(t, o))} fill="none" stroke=${$s(r)} stroke-width="1"
        vector-effect=${Ze}></path>`)}</g>`;
  const s = 8 / e.scale;
  return A`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Op(t, o, r, e))}</g>`;
}
function Vp(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return A`<g class="zone-members">${la(t, e).map(({ device: o, participates: r }) => {
    const a = X(t, o);
    return a ? r ? A`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${Ze}></circle>` : A`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${Ze}></circle>` : v;
  })}</g>`;
}
function Hp(t, e, n) {
  if (e.shape.kind !== "polygon") return v;
  const i = n.palette, s = e.shape.vertices;
  return A`${ie(t, e).map((o, r) => {
    const a = s[r], l = a.kind === "free" && a.lost === !0, c = n.vertex === r;
    return A`<circle class=${`zone-vertex${l ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${l ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${Ze}></circle>`;
  })}`;
}
function Np(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return A`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${Ze}></polyline>`;
}
function Tp(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return A`<g class="zone-overlay">
    ${n ? A`<path class="zone-outline" data-id=${n.id} d=${le(ie(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${Ze}></path>` : v}
    ${n ? Vp(t, n.id, e) : v}
    ${n ? Hp(t, n, e) : v}
    ${e.draft ? Np(e.draft, e) : v}</g>`;
}
function je(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Dp = /* @__PURE__ */ new WeakMap(), Rp = /* @__PURE__ */ new WeakMap(), ja = /* @__PURE__ */ new WeakMap();
function Kn(t, e, n) {
  const i = Y(t.dir), s = z(t.a, E(t.dir, e)), o = z(t.a, E(t.dir, n));
  return [z(s, E(i, t.leftOff)), z(o, E(i, t.leftOff)), I(o, E(i, t.rightOff)), I(s, E(i, t.rightOff))];
}
function Rt(t, e) {
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
function Bp(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const a of t.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const a of t.walls) {
    const l = Rt(t, a.id);
    if (!l) continue;
    const c = Y(l.dir);
    for (const [u, d, p] of [[a.a, l.a, l.dir], [a.b, l.b, E(l.dir, -1)]]) {
      const f = t.nodes.find((x) => x.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const m = z(d, E(c, l.leftOff + i)), b = I(d, E(c, l.rightOff + i)), w = E(c, 1), g = E(z(m, b), 0.5), $ = z(I(g, E(w, -o)), E(p, s / 2)), k = I(I(g, E(w, o)), E(p, s / 2)), M = [m, $, k, b];
      r.push(A`<path class="wall-break" d=${`M${M.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${W}></path>`);
    }
  }
  return r.length ? A`${r}` : v;
}
function Fp(t, e, n) {
  const i = Y(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? t.leftOff : t.rightOff, [a, l] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = z(z(t.a, E(t.dir, a)), E(o, r)), u = z(z(t.a, E(t.dir, l)), E(o, r)), d = z(c, E(o, e.width)), p = te(I(d, c), I(u, c)) > 0 ? 1 : 0;
  return A`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>
    <path d=${`M${d.x} ${d.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${W}></path>`;
}
function Up(t, e, n) {
  const i = Y(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const a = z(z(t.a, E(t.dir, e.offset)), E(i, r)), l = z(z(t.a, E(t.dir, e.offset + e.width)), E(i, r));
    return A`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${W}></line>`;
  });
  return A`${o}`;
}
function jp(t, e, n) {
  const i = Rt(t, e.wallId);
  if (!i) return v;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = Kn(i, e.offset, e.offset + e.width), a = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return A`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${le(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? Fp(i, e, o) : e.kind === "window" ? Up(i, e, o) : v}
    </g>`;
}
function Ho(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = z(t, E(n, i)), l = z(e, E(n, i)), c = (d, p) => {
    const f = z(p, E(n, i + r));
    return A`<line x1=${d.x} y1=${d.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${W}></line>`;
  }, u = z(E(z(a, l), 0.5), E(n, 9 / s.scale));
  return A`
    <g class="dim">
      ${c(z(t, E(n, 2 / s.scale)), t)}${c(z(e, E(n, 2 / s.scale)), e)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${W}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${je(L(t, e))}</text>
    </g>`;
}
function Wp(t, e) {
  const n = e.selection;
  if (!n) return v;
  const i = e.palette, s = 4 / e.scale, o = (r) => A`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((a) => a.id === n.id);
    return r ? o(r) : v;
  }
  if (n.kind === "wall") {
    const r = fe(ja, t, Vn).get(n.id), a = Rt(t, n.id);
    if (!r || !a) return v;
    const l = Y(a.dir);
    return A`
      <path d=${le(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${W}></path>
      ${o(a.a)}${o(a.b)}
      ${Ho(a.a, a.b, l, a.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), a = r ? Rt(t, r.wallId) : null;
    if (!r || !a) return v;
    const l = E(Y(a.dir), -1), c = a.rightOff + 18 / e.scale, u = (p) => z(a.a, E(a.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return A`
      <path d=${le(Kn(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${W}></path>
      ${d.filter(([p, f]) => f - p >= 1).map(([p, f]) => Ho(u(p), u(f), l, c, e))}`;
  }
  return v;
}
function Zp(t, e, n) {
  return L(t, e) < 1e-6 ? null : Kn(Ir(t, e, n.thickness, n.baseline), 0, L(t, e));
}
function qp(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? Rt(t, r.wallId) : null;
  return A`
    ${o ? A`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${W}></path>` : v}
    ${(n.walls ?? []).map((l) => {
    const c = Zp(l.a, l.b, l.props);
    return A`<g class="preview-wall">
        ${c ? A`<path d=${le(c)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${W}></line></g>`;
  })}
    ${r && a ? A`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${le(Kn(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${Gp(t, e)}`;
}
function Kp(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return A`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${W}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${W}></rect></g>`;
}
function Gp(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Kp(n.anchor, e) : v, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / e.scale, { x: a, y: l } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = v;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    u = A`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${a - f} y=${l - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${W}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${a} ${l - f}L${a + f * 0.866} ${l + f / 2}L${a - f * 0.866} ${l + f / 2}Z`;
    u = A`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${W}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), m = `M${a} ${l - f}L${a + f} ${l}L${a} ${l + f}L${a - f} ${l}Z`;
    u = A`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${W}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${W}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), m = `M${a - f} ${l - f}L${a + f} ${l + f}M${a - f} ${l + f}L${a + f} ${l - f}`;
    u = A`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${W}></path></g>`;
    const b = o.endpoint.kind === "wall" ? fe(ja, t, Vn).get(o.endpoint.wallId) : void 0;
    b && (d = A`<path class="snap-wall-hl" d=${le(b)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${W}></path>`);
  } else {
    const f = r(4), m = `M${a - f} ${l}H${a + f}M${a} ${l - f}V${l + f}`;
    u = A`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${W}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${W}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return A`
    ${d}${s}${u}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${W} font-family="system-ui, sans-serif">${p}</text>`;
}
function Yp(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = fe(Dp, n, (f) => Or(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? fe(Rp, n, ts) : null, a = e.selection, l = (e.mode ?? "plan") === "plan", c = l ? v : String(i.dimOpacity), u = (a == null ? void 0 : a.kind) === "zone" ? a.id : null, d = e.mode ?? "plan";
  return A`
    ${zp(n, { palette: i, scale: e.scale, selectedId: u, mode: d })}
    <path class="walls" d=${s.map((f) => f.map(le).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? A`<g class="railings" opacity=${c}>${o.flatMap((f) => (r.get(f.id) ?? []).map((m) => A`<path d=${le(m)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${c}>${n.openings.map((f) => jp(n, f, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Bp(n, e)}</g>
    ${l ? Tp(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : v}
    <g class="devices-layer">${Pp(n, {
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
    <g class="selection">${Wp(n, e)}</g>
    <g class="preview">${qp(n, e)}</g>`;
}
const de = "non-scaling-stroke", Bt = "system-ui, sans-serif", Qp = 13, Mt = 9, Xp = 11, No = 18, pi = 12, fi = 11, Xt = 13, Jp = 3, dn = 10, To = 4.5, ef = 12, tf = 11.5, xs = 10, hi = 10.5, nf = 6, sf = {
  IN: Wu,
  OUT: Ra,
  BAT: Zu,
  PV: Ba
}, Do = { dead: 0, nodata: 1, idle: 2, live: 3 };
function $t(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const mi = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function of(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function Zt(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const rf = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, af = A`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Wa = (t, e, n, i) => A`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${de}>${i ? v : af}</path>`, Za = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, at = (t, e, n, i) => A`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function lf(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Wt : Mt, s = t.pts[0], o = t.pts[t.pts.length - 1], r = dn / 2 / e.scale, a = 3 / e.scale, l = t.pts.slice(1).map((u, d) => ({ p: t.pts[d], q: u, len: Math.abs(u.x - t.pts[d].x) + Math.abs(u.y - t.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of l) {
    if (p < 2 * r + 2 * a) continue;
    const f = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, m = (w, g) => Math.hypot(f.x - w.x, f.y - w.y) >= g + r + a;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const b = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((b + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function cf(t, e, n) {
  var c;
  const i = e.palette, s = Zt(t.style, i), o = Za(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, a = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], l = lf(t, e);
  return A`<g data-wire=${t.w.id}>
    ${r ? A`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${de}></path>` : v}
    ${t.style === "live" ? Wa("glow", o, s, n) : v}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${a}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${de}></path>
    ${l ? A`<path class="arrow" d=${`M${dn / 2} 0L${-dn / 2} ${-To}L${-dn / 2} ${To}Z`}
      fill=${s} transform=${`translate(${l.at.x} ${l.at.y}) rotate(${l.deg}) scale(${1 / e.scale})`}></path>` : v}
  </g>`;
}
function df(t, e, n) {
  const i = sf[t.name];
  return A`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Wt} fill=${n.portFill}
      stroke=${e ? Zt(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${de}></circle>
    ${i ? at(i, t.pt, Qp, n.portIcon) : A`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Bt}>${t.name}</text>`}
  </g>`;
}
function uf(t, e) {
  const n = Math.max(4, Math.floor(e / (xs * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function pf(t, e, n, i) {
  const s = e.map((a) => {
    const l = t.blocks.find((c) => c.id === a);
    return l ? Zn(l, n) || h(`power.kind.${l.kind}`) : a;
  }), o = h("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", uf(s[0], i - 12 - o.replace("{name}", "").length * xs * 0.55)) : h("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function ff(t, e, n, i, s, o) {
  var l;
  const r = () => ({ kind: "text", value: $t(i == null ? void 0 : i.power) }), a = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: mi(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: h("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = dt(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: h("power.in"), value: $t(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: h("power.out"), value: $t(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: mi(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(a(Wr(c))), d && p.push({ kind: "text", label: h("power.loss"), value: $t(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: mi(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: s.blockInvalid }] : (l = i == null ? void 0 : i.absorbed) != null && l.length ? [r(), pf(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function hf(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : pi + 3, o = e.x - s / 2, r = `${h(`power.switch.${i}`)}${t.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return A`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${at(
    i === "on" ? Vu : zu,
    { x: o, y: e.y },
    No,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? v : at(Ru, { x: o + No / 2 + 3 + pi / 2, y: e.y + 1 }, pi, n.blockValue)}
  </g>`;
}
function Ro(t, e, n) {
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
function mf(t, e, n) {
  const i = 2 * (t.w + t.h), s = Ro(t, e.side, e.pt), o = ((Ro(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, a = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < a).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [e.pt, ...c, n.pt];
}
function gf(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return v;
  const a = qn(t, e, i.geo), l = a.find((f) => f.name === r), c = a.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!l || !c) return v;
  const u = s(c.name) ?? "nodata", d = Zt(u, i.palette), p = Za(mf(he(e, i.geo, t), l, c));
  return A`${u === "live" ? Wa("ts-glow", p, d, o) : v}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : v}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${de}></path>`;
}
function wf(t, e, n, i) {
  const s = i.palette;
  return Na(e, i.geo, t).map(({ position: o, rect: r }) => {
    const a = (n == null ? void 0 : n.position) === o;
    return A`<g class=${a ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${a ? s.accent : "none"}
        stroke=${a ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${de}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${a ? s.accentText : s.blockValue} font-family=${Bt}>${o}</text>
    </g>`;
  });
}
function bf(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? h("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? h("power.alert.missingDevice") : t === "disagree" ? h("power.alert.disagree") : t;
}
function yf(t, e, n, i) {
  const s = Jp + Xt / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (l) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - l.x) - Xt / 2, 0), d = Math.max(Math.abs(c.y - l.y) - Xt / 2, 0);
    return Math.hypot(u, d) > Wt;
  }), a = o.find(r) ?? o[0];
  return A`<g class="alert"><title>${t.map(bf).join(`
`)}</title>
    ${at(Da, a, Xt, i.blockInvalid)}</g>`;
}
function vf(t, e, n, i, s) {
  var b, w;
  const o = n.palette, r = he(e, n.geo, t), a = (b = n.frame) == null ? void 0 : b.blocks[e.id], l = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !l, u = r.x + r.w / 2, d = Zn(e, n.geo) || h(`power.kind.${e.kind}`), p = ff(t, e, n.geo, a, o, r.w), f = e.kind === "remainder", m = qn(t, e, n.geo);
  return A`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : v} vector-effect=${de}></rect>
    ${e.kind === "transfer" ? gf(t, e, a, n, (g) => i(e.id, g), s) : v}
    ${l && l.placement.mode !== "none" ? A`<g class="pin"><title>${h("power.planDevice")}</title>
      ${at(Bu, { x: r.x + 4 + fi / 2, y: r.y + 4 + fi / 2 }, fi, o.blockValue)}</g>` : v}
    <text class="name" x=${u} y=${r.y + kn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${ef} font-weight="600" fill=${o.blockName} font-family=${Bt}>${d}</text>
    ${p.map((g, $) => {
    const k = r.y + kn + $ * xn + xn / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? wf(t, e, a, n) : v;
    if (g.kind === "switch") return hf(g, { x: u, y: k }, o);
    const M = g.fill ?? o.blockValue, x = g.label ? A`<tspan>${g.label} </tspan>` : v, S = g.note ? A`<tspan> ${g.note}</tspan>` : v;
    return A`<text x=${u} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? xs : tf}
        fill=${M} font-family=${Bt}>${g.title ? A`<title>${g.title}</title>` : v}${x}<tspan
        font-weight=${g.small ? v : "600"}>${g.value}</tspan>${S}</text>`;
  })}
    ${(w = a == null ? void 0 : a.alert) != null && w.length ? yf(a.alert, r, m, o) : v}
    ${m.map((g) => df(g, i(e.id, g.name), o))}
  </g>`;
}
function $f(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, a = r + (o ? t.w : t.h), l = o ? t.h : t.w;
  let c = v;
  const u = t.name ?? "", d = Math.min(hi, l - 4), p = d >= nf, f = u.length * (p ? d : hi) * 0.58 + 12;
  if (u) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let b = { lo: 0, hi: -1 }, w = r;
    for (const g of [...m, a + Mt]) {
      const $ = Math.min(g - Mt, a);
      $ - w > b.hi - b.lo && (b = { lo: w, hi: $ }), w = Math.max(w, g + Mt);
    }
    if (b.hi - b.lo >= f) {
      const g = (b.lo + b.hi) / 2, $ = o ? { x: g, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: g };
      c = A`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : hi} fill=${s.blockValue} font-family=${Bt}
        transform=${o ? v : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return A`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? Zt(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${de}></rect>
    ${c}
  </g>`;
}
function xf(t, e, n) {
  return A`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${Mt} fill=${n.portFill} stroke=${Zt(e, n)} stroke-width="1.5"
      vector-effect=${de}></circle>
    ${at(Cu, t, Xp, n.portIcon)}
  </g>`;
}
function kf(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const s = he(i, e.geo, t), o = 4 / e.scale;
  return A`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${de}></rect>`;
}
function Mf(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const f of n.wires) {
    const m = Va(n, f, e.geo);
    if (!m) continue;
    const b = (p = e.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: Ha(m.a, m.b), live: b, style: of(b) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = [];
  for (const f of s)
    for (const [m, b] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Do[f.style] > Do[w]) && r.set(m.bus, f.style), a.set(m.bus, [...a.get(m.bus) ?? [], b.pt]), l.push({ at: b.pt, style: f.style });
    }
  const c = (f, m) => o.get(`${f}:${m}`), u = rf(), d = e.preview.wireDraft;
  return A`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? $f(f, a.get(f.id) ?? [], r.get(f.id), e) : v)}</g>
    <g class="wires">${s.map((f) => cf(f, e, u))}</g>
    ${kf(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? v : vf(n, f, e, c, u))}</g>
    <g class="terminals">${l.map((f) => xf(f.at, f.style, i))}</g>
    ${d ? A`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${de}></line>` : v}
  </g>`;
}
const _f = {
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
}, Af = {
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
function Sf(t) {
  return t ? _f : Af;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Se = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ks = (t) => (...e) => ({ _$litDirective$: t, values: e });
class Ms {
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
const qa = (t) => t.strings === void 0, Ef = {}, Ka = (t, e = Ef) => t._$AH = e;
class If extends Ms {
  constructor(e) {
    if (super(e), e.type !== Se.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? ae : (Ka(e), n);
  }
}
const q = ks(If), Vi = 1, Bo = 1e-6;
function Pf(t, e, n, i, s) {
  const o = (l) => l > Bo && l < s - Bo, r = new Set(t.nodes.filter((l) => {
    var c;
    return ((c = l.host) == null ? void 0 : c.wallId) === e.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const c = zn(t, l).host.offset;
    o(c) && a.push({ t: c, nodeId: l });
  }
  for (const l of t.walls) {
    if (l.id === e.id || [l.a, l.b].some((b) => b === e.a || b === e.b || r.has(b))) continue;
    const c = Z(t, l.a), u = Z(t, l.b), d = L(c, u), p = d === 0 ? null : pe(n, i, c, I(u, c));
    if (!p) continue;
    const f = On(p, c, u) * d;
    if (f < -Vi || f > d + Vi) continue;
    const m = D(I(p, n), i);
    o(m) && a.push({ t: m, wall: l, pt: p });
  }
  return a;
}
function Fo(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Uo(t, e) {
  if ("nodeId" in e)
    return delete zn(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (L(Z(t, o), e.pt) <= Vi) return o;
  const { pt: n, offset: i } = Bn(t, e.wall, e.pt), s = { id: K(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function Cf(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = Z(t, i.a), o = Z(t, i.b), r = L(s, o), a = Ln(I(o, s)), l = D(I(n, s), a), c = Pf(t, i, s, a, r), u = Fo(c.filter((g) => g.t < l), l), d = Fo(c.filter((g) => g.t > l), l);
  if (!u && !d) return ms(t, e);
  const p = me(t), f = p.walls.find((g) => g.id === e);
  let m = e, b = 0;
  if (d) {
    const g = Uo(p, d);
    if (b = D(I(Z(p, g), s), a), u) {
      const $ = { ...f, id: K(), a: g };
      p.walls.push($), m = $.id;
    } else
      f.a = g;
  }
  u && (f.b = Uo(p, u));
  const w = (g, $) => g.wallId !== e || u && $ <= u.t ? !0 : !d || $ < d.t ? !1 : (g.wallId = m, g.offset -= b, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((k) => k.kind !== "wall" || w(k, k.offset) ? k : ls(k)));
  }
  return Fn(p), _e(p, t);
}
function _s(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Lf(t, e, n) {
  return z(t, E(Ln(I(e, t)), n));
}
function Jt(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function qe(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? _s(r, e) : e, c = r !== void 0 && l.y === r.y, u = (x) => !r || Math.abs(c ? x.y - r.y : x.x - r.x) <= 1;
  let d = null;
  for (const x of t.nodes) {
    if (a.has(x.id)) continue;
    const S = { x: x.x, y: x.y }, P = L(S, l);
    P <= i && u(S) && (!d || P < d.d) && (d = { id: x.id, pt: S, d: P });
  }
  let p = null;
  for (const x of n.corners ?? []) {
    const S = L(x.pt, l);
    S <= i && u(x.pt) && (!p || S < p.d) && (p = { c: x, d: S });
  }
  if (p && (!d || p.d < d.d)) {
    const x = p.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: p.c };
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const f = t.walls.filter((x) => !a.has(x.a) && !a.has(x.b)).map((x) => ({ w: x, f: J(t, x) })).filter((x) => x.f.len > 1e-9);
  let m = null;
  for (const { w: x, f: S } of f) {
    const P = { x: (S.a.x + S.b.x) / 2, y: (S.a.y + S.b.y) / 2 }, O = L(P, l);
    O <= i && u(P) && (!m || O < m.d) && (m = { wallId: x.id, pt: P, offset: S.len / 2, d: O });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const b = (x) => {
    let S = null;
    for (const { w: P, f: O } of f) {
      const H = Y(O.dir), U = x ? [O.leftOff, -O.rightOff].filter((V) => V !== 0) : [0];
      for (const V of U) {
        const N = z(O.a, E(H, V)), j = r ? pe(r, I(l, r), N, O.dir) : z(N, E(O.dir, D(I(l, N), O.dir)));
        if (!j) continue;
        const se = D(I(j, N), O.dir);
        if (se < 0 || se > O.len) continue;
        const ge = L(j, l);
        ge <= i && (!S || ge < S.d) && (S = { d: ge, res: { pt: j, kind: "wall", endpoint: { kind: "wall", wallId: P.id, offset: se } } });
      }
    }
    return S ? S.res : null;
  }, w = b(!1);
  if (w) return w;
  const g = b(!0);
  if (g) return g;
  const $ = n.zones ?? [];
  let k = null;
  for (const x of $)
    for (const S of x) {
      const P = L(S, l);
      P <= i && u(S) && (!k || P < k.d) && (k = { pt: S, d: P });
    }
  if (k) return Jt(k.pt, "zoneVertex");
  let M = null;
  for (const x of $)
    for (let S = 0; S < x.length; S++) {
      const P = x[S], O = x[(S + 1) % x.length], H = L(P, O);
      if (H < 1e-9) continue;
      const U = E(I(O, P), 1 / H), V = r ? pe(r, I(l, r), P, U) : z(P, E(U, D(I(l, P), U)));
      if (!V) continue;
      const N = D(I(V, P), U);
      if (N < 0 || N > H) continue;
      const j = L(V, l);
      j <= i && (!M || j < M.d) && (M = { pt: V, d: j });
    }
  if (M) return Jt(M.pt, "zoneEdge");
  if (s && s > 0) {
    const x = (P) => Math.round(P / s) * s, S = r ? c ? { x: x(l.x), y: r.y } : { x: r.x, y: x(l.y) } : { x: x(l.x), y: x(l.y) };
    return Jt(S, "grid");
  }
  return Jt(l, "none");
}
function Of(t, e, n) {
  return e.some((i, s) => $e(t, i, e[(s + 1) % e.length]) <= n);
}
function As(t, e, n) {
  const i = Vn(t);
  for (const [s, o] of i) if (st(e, o)) return s;
  for (const [s, o] of i) if (Of(e, o, n)) return s;
  return null;
}
function zf(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = J(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Ne(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Vf(t, e, n, i) {
  const s = zf(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = t.nodes.find((c) => c.id === a);
        if (l && L(e, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = As(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const Gn = 3, Hf = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => ie(t, n)).filter((n) => n.length >= 3);
function Ga(t, e, n, i, s) {
  if (n.alt) {
    const a = n.shift && i ? _s(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: a.x, y: a.y }, snap: null };
  }
  const o = qe(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Hf(e, s), corners: Pr(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const a = o.corner, l = Ge(e, a.wallId), c = l !== null && a.offset >= -vn && a.offset <= l + vn, u = c ? Math.max(0, Math.min(l, a.offset)) : a.offset, d = c ? zt(e, a.wallId, a.side, u) : null;
    if (d) return { vertex: { kind: "wall", wallId: a.wallId, offset: u, side: a.side, x: d.x, y: d.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const a = e.walls.find((l) => l.id === r.wallId);
    if (a) {
      const l = Ne(J(e, a), n.pt).side >= 0 ? "left" : "right", c = zt(e, a.id, l, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: a.id, offset: r.offset, side: l, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Nf(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = ie(t, s);
    if (o.length < 3) continue;
    (o.some((a, l) => $e(e, a, o[(l + 1) % o.length]) <= n) || Dn(o, e)) && i.push({ id: s.id, area: Math.abs(xe(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function Ya(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: ie(t, n), v: n.shape.vertices } : null;
}
function Tf(t, e, n, i) {
  var r;
  const s = (r = Ya(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((a, l) => {
    L(n, a) <= i && (o < 0 || L(n, a) < L(n, s[o])) && (o = l);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Df(t, e, n, i) {
  const s = Ya(t, e);
  if (!s || s.o.some((w) => L(n, w) <= i)) return null;
  const { o, v: r } = s;
  let a = -1, l = 1 / 0;
  if (o.forEach((w, g) => {
    const $ = $e(n, w, o[(g + 1) % o.length]);
    $ <= i && $ < l && (a = g, l = $);
  }), a < 0) return null;
  const c = o[a], u = o[(a + 1) % o.length], d = Math.max(0, Math.min(1, On(n, c, u))), p = _r(c, u, d), f = r[a], m = r[(a + 1) % r.length], b = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + d * (m.offset - f.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: a + 1, vertex: b };
}
function Rf(t, e) {
  let n = null, i = null, s = null, o = null, r = null, a = !1, l = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, a = !1, l = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function b(w) {
    if (!i || !s || !l && L(w.pt, c) <= Gn / t.scale()) return;
    l = !0;
    const g = Ga(t, s, w, i.from, i.zoneId);
    r = g.snap, a = w.shift, o = Ad(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, t.selection()];
    },
    press(w) {
      f(), u = null, c = w.pt;
      const g = p(), $ = t.level(), k = g === null ? null : Tf($, g, w.pt, t.tolMm());
      return g === null || !k ? !1 : (i = { zoneId: g, ...k }, s = o = $, !0);
    },
    pick(w) {
      const g = Nf(t.level(), w, t.tolMm());
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
      b(w);
    },
    up(w) {
      if (!i) return;
      b(w);
      const g = o, $ = s, k = l, M = i;
      f(), k ? g && $ && g !== $ && t.commit(g) : u = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const g = d[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const $ = t.level(), k = Df($, g.id, w.pt, t.tolMm());
      if (!k) return;
      const M = Sd($, g.id, k.index, k.vertex);
      M !== $ && (t.commit(M), e(g), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const g = m();
      if (w === "Escape" && g)
        return u = null, !0;
      if ((w === "Delete" || w === "Backspace") && g) {
        const $ = t.level(), k = Ed($, g.zoneId, g.index);
        return k === $ ? (t.notify(h("zones.minVertices")), !0) : (u = null, t.commit(k), !0);
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
      f(), u = null, n = null;
    }
  };
}
function Bf(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const a = (f) => {
    t.select(f);
  }, l = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, c = Rf(t, a), u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, d = (f, m, b) => Ne(J(f, f.walls.find((w) => w.id === m)), b).t;
  function p(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const b = qe(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), w = b.endpoint, g = (b.kind === "wall" || b.kind === "mid") && w.kind === "wall", $ = b.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, k = n.nodes.find((P) => P.id === m.nodeId), M = !!k.host && g && w.kind === "wall" && w.wallId === k.host.wallId;
        let x = n;
        if (k.host && !M) {
          const P = structuredClone(n);
          delete P.nodes.find((O) => O.id === m.nodeId).host, x = P;
        }
        let S = zd(x, m.nodeId, u(b));
        if ($ && w.kind === "node")
          S = Td(S, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const P = n.walls.find((O) => O.id === w.wallId);
          if (P && P.a !== m.nodeId && P.b !== m.nodeId) {
            const O = structuredClone(S);
            O.nodes.find((H) => H.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, S = _e(O, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const b = n.walls.find(($) => $.id === m.wallId), w = qe(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [b.a, b.b]
        }), g = I(w.pt, m.origin);
        i = Hd(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const b = n.openings.find((w) => w.id === m.openingId);
        i = Rr(n, b.id, d(n, b.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      l(), o = f.pt, c.note();
      const m = t.level(), b = f.ctrl ? As(m, f.pt, t.tolMm()) : null;
      if (b) {
        a(null), t.commit(Cf(m, b, f.pt));
        return;
      }
      if (c.press(f)) return;
      const w = t.selection(), g = Vf(m, f.pt, t.tolMm(), w);
      if (!g) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), a(g), r = n = i = m, g.kind === "node") {
        let $ = g.id;
        const k = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (f.alt && k) {
          const M = Nd(m, k.id, k.a === g.id ? "a" : "b");
          n = i = M.level, $ = M.nodeId, a({ kind: "node", id: $ });
        }
        e = { kind: "node", nodeId: $, origin: Z(n, $) };
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
      const m = s, b = i, w = r;
      l(), m && b && w && b !== w && t.commit(b);
    },
    dblclick(f) {
      c.dblclick(f);
    },
    key(f) {
      return f === "Escape" && e ? (l(), !0) : c.key(f);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      l(), c.cancel();
    }
  };
}
function Ft(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function Qa() {
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
function Ff(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = Qa(), s = () => {
    e = null, i.clear();
  }, o = (c) => qe(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = Ft(i.first, { min: 1 }), u = Ft(i.second, { min: 1 });
      return c === null || u === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const a = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function l(c) {
    if (!e || a(e, c)) return;
    const u = Od(t.level(), e, c, t.wallProps(), t.boxMeasure());
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
      const d = t.wallProps(), p = ya(e, c, d.thickness, t.boxMeasure());
      return p && (u.walls = p.map((f, m) => ({ a: f, b: p[(m + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const jo = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Uf(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = Qa(), l = () => {
    e = null, n = null, i = null, r = null, a.clear();
  }, c = (p, f) => qe(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), f = Ft(a.first, { min: 1 }), m = Ft(a.second);
    if (f === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const b = f ?? L(n, p.pt);
    let w = p.pt;
    if (m === null && L(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = Lf(n, w, b), $ = { x: jo(g.x), y: jo(g.y) }, k = t.level().nodes.find((M) => Math.hypot(M.x - $.x, M.y - $.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function d() {
    const p = u();
    if (!e || !p) return;
    const f = Ld(t.level(), e, p.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((k) => k.id === f.wallId);
    i === null && (i = m.a);
    const b = f.endNodeId === i, w = n, g = Z(f.level, f.endNodeId), $ = L(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), a.clear(), b) {
      l();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = Z(f.level, f.endNodeId);
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
      return o = f.shift, e ? a.key(p, d, l) : !1;
    },
    preview() {
      if (!n) return { snap: qe(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
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
function jf(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = As(o, n, t.tolMm());
    if (!r) return null;
    const a = J(o, o.walls.find((c) => c.id === r)), l = Ne(a, n).t;
    return { wallId: r, center: l, pt: z(a.a, E(a.dir, l)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = Dc(t.level(), r.wallId, e, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: e, invalid: !Hn(t.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Wo = 3, Wf = 1, ue = (t) => ({ x: t.x, y: t.y });
function Zf(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? ue(e[e.length - 1]) : void 0;
  function a(d) {
    const p = e.length;
    if (p === 0) return !1;
    const f = e.map(ue);
    if (L(f[p - 1], d) <= Wf) return !0;
    if (p >= 2) {
      const m = I(f[p - 1], f[p - 2]), b = I(d, f[p - 1]);
      if (Math.abs(te(m, b)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(b.x, b.y) && D(m, b) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (oa(f[p - 1], d, f[m], f[m + 1])) return !0;
    return !1;
  }
  function l(d) {
    if (e.length < Wo) return null;
    const p = t.tolMm(), f = ue(e[0]), m = ue(e[e.length - 1]);
    return L(d, f) <= p ? f : L(d, m) <= p ? m : null;
  }
  function c() {
    var f;
    if (e.length < Wo || $n(e.map(ue))) return !1;
    const d = t.level(), p = Md(d, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : us(p.level, p.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => Ga(t, t.level(), d, r());
  return {
    id: "zone",
    down(d) {
      if (l(d.pt)) {
        c();
        return;
      }
      const p = u(d).vertex;
      a(ue(p)) || (e = [...e, p], n = ue(p), i = !1);
    },
    move(d) {
      o = d.shift;
      const p = l(d.pt);
      if (p) {
        n = p, s = null, i = $n(e.map(ue));
        return;
      }
      const f = u(d);
      s = f.snap, n = ue(f.vertex), i = a(n);
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
function qf(t) {
  return t.zoneMethod() === "polygon" ? Zf(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = kd(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(h("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : us(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Zo = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Xa(t) {
  let e = null;
  const n = (s, o, r) => {
    const a = s.devices.find((u) => u.id === o), l = a ? X(s, a) : null, c = a ? Pi(s, a, t.scale()) : null;
    return !l || !c ? 0 : ea(ve(I(r, l.pt)) - ve(I(c.to, l.pt)));
  };
  function i(s) {
    if (!e || !e.moved && L(s.pt, e.downPt) <= Gn / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((d) => d.id === e.id), r = o ? X(e.original, o) : null;
    if (!o || !r) return;
    const a = L(s.pt, r.pt), l = (ve(I(s.pt, r.pt)) - e.offset) * Math.PI / 180, c = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, u = cd(e.original, o, c, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : bn(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), a = r.devices.find((c) => c.id === s), l = a ? Pi(r, a, t.scale()) : null;
      return !a || !l || L(o.pt, l.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Zo(o.work, o.id) !== Zo(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function qo(t, e, n) {
  const i = J(t, t.walls.find((s) => s.id === e));
  return Ne(i, n).side > 0 ? "left" : "right";
}
function Ja(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function Ss(t, e = "free") {
  return t === "equipment" ? [e] : Xi[t];
}
function el(t, e, n, i, s = 0, o = Ss(n)) {
  if (o.includes("wall")) {
    const r = qe(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: qo(e, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const c of e.walls) {
        if (c.a !== a.nodeId && c.b !== a.nodeId) continue;
        const u = J(e, c), d = Ne(u, i).side, p = Math.abs(Math.abs(d) - (d > 0 ? u.leftOff : u.rightOff));
        (!l || p < l.d) && (l = { id: c.id, offset: c.a === a.nodeId ? 0 : u.len, d: p });
      }
      if (l) return { mode: "wall", wallId: l.id, side: qo(e, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Ja(t, i), rotation: s } : null;
}
function Kf(t, e, n) {
  const i = X(t, e);
  if (!i) return null;
  if (!n) {
    const o = is(Math.round(ve(i.dir)));
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
    const a = Ne(r, i.pt), l = a.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(a.t))), u = zt(t, o.id, l, c), d = u ? L(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: l, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? ss(t, e.props, s.placement, 0) : null;
}
function Gf(t, e, n) {
  return Kr(t.deviceDefaults(e), "free", n.mode);
}
function Yf(t, e) {
  let n = null, i;
  const s = Xa(t);
  function o() {
    if (!n) return null;
    const r = t.level(), a = Ss(e, t.wallMount() ? "wall" : "free"), l = el(t, r, e, n, 0, a);
    if (!l)
      return { placement: { mode: "free", ...Ja(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = Gf(t, e, l), u = ss(r, c, l, t.tolMm()), d = po(r, c, u, "").deviceId !== null;
    return { placement: u, props: c, invalid: !d };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = t.level(), c = Ki(h(`device.${e}`), l.devices.filter((d) => d.props.kind === e).map((d) => d.name)), u = po(l, a.props, a.placement, c);
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
const Ko = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Qf = (t, e, n) => n === void 0 || Ko(t, n) !== Ko(e, n);
function Xf(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return I(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = zt(t, s.wallId, s.side, s.offset);
  return o ? I(o, i) : { x: 0, y: 0 };
}
function Jf(t) {
  let e = null, n = null;
  const i = Xa(t);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (p) => {
    e = p, t.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && L(p.pt, a) <= Gn / t.scale()) return;
    if (r = !0, p.pt.x === a.x && p.pt.y === a.y) {
      o = s;
      return;
    }
    const f = s.devices.find((x) => x.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = p.shift ? _s(a, p.pt) : p.pt, b = f.placement, w = b.mode === "free" ? null : X(s, f), g = b.mode === "free" ? b.rotation : w ? is(Math.round(ve(w.dir))) : 0, $ = z(m, n.grab), k = el(t, s, f.props.kind, $, g, Ss(f.props.kind, b.mode)), M = k && k.mode === "wall" && b.mode === "wall" && b.aim !== void 0 ? { ...k, aim: b.aim } : k;
    o = M ? bn(s, f.id, ss(s, f.props, d(s, f.placement, M, m, $), t.tolMm())) : s;
  }
  function d(p, f, m, b, w) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = p.walls.find((P) => P.id === f.wallId);
    if (!g) return m;
    const $ = J(p, g), k = Math.max(0, Math.min($.len, f.offset + D(I(b, a), $.dir))), M = Ne($, w).side, x = t.tolMm(), S = f.side === "left" ? M < -($.rightOff + x) ? "right" : "left" : M > $.leftOff + x ? "left" : "right";
    return { ...m, offset: k, side: S };
  }
  return {
    id: "device-select",
    down(p) {
      c(), a = p.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const b = ia(f, p.pt, m);
      if (!b) {
        l(null);
        return;
      }
      l({ kind: "device", id: b });
      const w = f.devices.find(($) => $.id === b), g = X(f, w);
      s = o = f, n = { id: b, grab: Xf(f, w, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, m = s, b = r, w = n == null ? void 0 : n.id;
      c(), b && f && m && f !== m && Qf(m, f, w) && t.commit(f);
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
function eh(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = ia(t.level(), e.pt, t.tolMm());
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
const Hi = 40, th = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function nh(t, e, n, i) {
  const s = t.blocks.find((f) => f.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, a = o ? s.w : s.h, l = Tt(o ? i.x : i.y), c = n === "start" ? Math.min(l, r + a - Hi) : r, u = n === "end" ? Math.max(l, r + Hi) : r + a;
  if (c === r && u === r + a) return t;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * a - c) / (u - c))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...d } : f),
    wires: t.wires.map((f) => {
      const m = p(f.from), b = p(f.to);
      return m === f.from && b === f.to ? f : { ...f, from: m, to: b };
    })
  };
}
function ih(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function a(u, d) {
    const p = Lo(u, d, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function l(u) {
    const d = e, p = n;
    if (!d || !p || !s && L(u.pt, o) <= Gn / t.scale()) return;
    if (s = !0, d.kind === "wire") {
      const w = a(p, u.pt);
      e = { ...d, to: u.pt, ok: !!w && !("error" in Eo(p, d.from, w, t.geo())) };
      return;
    }
    if (d.kind === "bus-end") {
      i = nh(p, d.id, d.end, u.pt);
      return;
    }
    const f = p.blocks.find((w) => w.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!f) return;
    if (d.kind === "pin") {
      i = Xd(p, f.id, d.from.port, fu(he(f, t.geo(), p), u.pt));
      return;
    }
    const m = Tt(f.x + u.pt.x - o.x), b = Tt(f.y + u.pt.y - o.y);
    i = m === f.x && b === f.y ? p : Gd(p, f.id, m, b);
  }
  function c(u, d, p) {
    const f = a(u, p);
    if (!f) return;
    const m = Eo(u, d, f, t.geo());
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
      const d = t.power(), p = Lo(d, u.pt, t.tolMm(), t.geo());
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
        if (th(d, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = d.blocks.find((w) => w.id === p.block), b = qn(d, m, t.geo()).find((w) => w.name === p.port).pt;
        e = { kind: "wire", from: f, at: b, to: b, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: p.id }), e = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      l(u);
    },
    up(u) {
      l(u);
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
function sh(t, e) {
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
      const o = t.power(), r = Kd(n, { x: 0, y: 0 }, o, s), a = he(r, t.geo(), Ao(o, r)), l = { ...r, x: Tt(i.pt.x - a.w / 2), y: Tt(i.pt.y - a.h / 2) };
      t.commitPower(Ao(o, l)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: l.id });
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
const oh = ["select", "box", "wall", "door", "window", "opening", "zone"], rh = [
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
], ah = ["binding-select"], lh = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], tl = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, ch = {
  plan: oh,
  equipment: rh,
  binding: ah,
  power: lh
};
function Es(t) {
  return ch[t];
}
function Ni(t, e) {
  switch (t) {
    case "select":
      return Bf(e);
    case "box":
      return Ff(e);
    case "wall":
      return Uf(e);
    case "door":
    case "window":
    case "opening":
      return jf(e, t);
    case "zone":
      return qf(e);
    case "device-select":
      return Jf(e);
    case "binding-select":
      return eh(e);
    case "power-select":
      return ih(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return sh(e, t);
    default:
      return Yf(e, t);
  }
}
function gi(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const dh = {
  select: Yt,
  box: ip,
  wall: sp,
  door: Lu,
  window: ap,
  opening: Ou,
  zone: Yu,
  "device-select": Yt,
  ceiling_light: Iu,
  wall_light: op,
  motion_sensor: Fu,
  illuminance_sensor: Eu,
  climate_sensor: Qu,
  wall_switch: Du,
  smart_button: Tu,
  valve: Ju,
  leak_sensor: rp,
  socket: Ra,
  exhaust_fan: Hu,
  equipment: Oo,
  "binding-select": Yt,
  "power-select": Yt,
  "power-device": Oo,
  "power-bus": qu,
  "power-battery": Su,
  "power-pv": Ba,
  "power-transfer": Gu,
  "power-remainder": Pu
}, nl = (t) => y`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${dh[t]}></path>`}</svg>`;
function uh(t) {
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
function ph(t) {
  return y`
    <div class="top"><div class="bar">
      ${t.lead ?? v}
      ${t.plans.length > 1 ? y`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${q(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => y`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : v}
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
        ${uh(t)}${t.saveState === "error" && t.errorMessage ? y`: ${t.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${h("action.save")}</button>
    </div>${t.steps}</div>`;
}
const fh = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function hh(t, e, n) {
  return Es(t).map((i) => {
    const s = t === "plan" ? tl[i] : void 0, o = h(`tool.${i}`);
    return y`
      ${fh.includes(i) ? y`<div class="tool-sep"></div>` : v}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? v}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? v}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${nl(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function mh(t, e, n) {
  return y`<div class="tools">${hh(t, e, n)}</div>`;
}
const ht = ["plan", "equipment", "binding", "power"], en = (t, e, n) => h(t === 1 ? e : n).replace("{n}", String(t));
function gh(t, e, n, i) {
  const { walls: s, zones: o, devices: r } = e;
  switch (t) {
    case "plan": {
      const a = o.filter((c) => c.invalid).length, l = a ? `, ${h("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${en(s.length, "steps.wall", "steps.walls")}, ${en(o.length, "steps.zone", "steps.zones")}${l}`,
        done: s.length > 0 && o.length > 0
      };
    }
    case "equipment":
      return { text: en(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const a = r.length - Yi(r.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(a)).replace("{n}", String(r.length)),
        done: r.length > 0 && a === r.length
      };
    }
    case "power":
      return { text: en(i.blocks.length, "steps.block", "steps.blocks"), done: ou(i) };
  }
}
const Go = (t, e) => h(t).replace("{step}", h(`mode.${e}`));
function wh(t) {
  const e = ht.indexOf(t.mode), n = ht[e - 1], i = ht[e + 1];
  return y`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${q(t.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${ht.map((s, o) => {
    const r = gh(s, t.level, t.status, t.power), a = s === t.mode;
    return y`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : v} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${ht.length + 1}</span><span class="name">${h("mode.automation")}</span>
        <span class="state">${h("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? y`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Go("steps.back", n)}</button>` : v}
        ${i ? y`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Go("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
function bh(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function il(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return jr(t, Ki(h("device.equipment"), e));
}
function Is(t) {
  if (dt(t)) return h("props.inverter");
  const e = jc(t);
  return e ? h(`deviceRole.${e}`) : "";
}
function Yn(t) {
  const e = h(`device.${t.props.kind}`), n = Is(t);
  return n ? `${e} · ${n}` : e;
}
function yh(t) {
  const e = bh(t.level);
  return y`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${h("devices.new")}</button>
    </div>
    ${e.length === 0 ? v : y`<div class="pdevs">
      ${e.map((n) => y`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Is(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const vh = ["unbound", "bound", "all"], $h = /* @__PURE__ */ new WeakMap(), _t = (t) => t.placement.mode === "none";
function sl(t) {
  return fe($h, t, (e) => [...e.devices].sort((n, i) => Number(_t(n)) - Number(_t(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function xh(t, e, n) {
  const i = sl(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const ol = (t) => h(`device.${t.props.kind}`), Yo = (t) => t.props.kind === "equipment" ? Is(t) : ol(t), kh = (t, e) => t === "all" || t === "bound" == (e === "bound");
function Mh(t, e, n) {
  return e === 0 ? h("binding.noDevices") : n || t.filter === "all" ? h("binding.noMatch") : h(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Qo(t) {
  const e = h(t.collapsed ? "binding.expand" : "binding.collapse");
  return y`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function _h(t) {
  var a;
  if (t.collapsed) return y`<div class="blist collapsed">${Qo(t)}</div>`;
  const e = sl(t.level).map((l) => ({ d: l, st: t.status(l) })), n = {
    unbound: Yi(e.map((l) => l.st)),
    bound: e.filter((l) => l.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: l, st: c }) => kh(t.filter, c) && (!i || l.name.toLowerCase().includes(i) || ol(l).toLowerCase().includes(i) || Yo(l).toLowerCase().includes(i))), o = ((a = t.selection) == null ? void 0 : a.kind) === "device" ? t.selection.id : null, r = (l, c) => {
    const u = ql(l);
    return y`<button class="brow${l.id === o ? " sel" : ""}" data-id=${l.id} @click=${() => t.onPick(l.id)}>
      <span class="dot ${c}" role="img" aria-label=${h(`bindstatus.${c}`)} title=${h(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${l.name}</span><small class="kind">${Yo(l)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return y`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${vh.map((l) => y`<button role="radio" aria-checked=${String(l === t.filter)} data-filter=${l}
            @click=${() => t.onFilter(l)}>${h(`binding.filter.${l}`)} <span class="count">${n[l]}</span></button>`)}
        </div>
        ${Qo(t)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${q(t.query)} @input=${(l) => t.onQuery(l.target.value)} />
      <div class="rows">
        ${s.length === 0 ? y`<p class="empty">${Mh(t, e.length, i)}</p>` : y`
          ${s.filter((l) => !_t(l.d)).map((l) => r(l.d, l.st))}
          ${s.some((l) => _t(l.d)) ? y`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((l) => _t(l.d)).map((l) => r(l.d, l.st))}
          </div>` : v}`}
      </div>
    </div>`;
}
function C(t, e) {
  return y`<label class="row"><span>${t}</span>${e}</label>`;
}
function G(t, e, n, i) {
  return y`<select class="val" data-field=${i ?? v} .value=${q(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => y`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Te(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return y`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? v}
    placeholder=${t.placeholder ?? v} title=${t.placeholder ?? v} .value=${q(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = Ft(s.value, t.rule);
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
function Ah() {
  return {
    door: { width: an.door, hinge: "start", swing: "left" },
    window: { width: an.window, outside: "left" },
    opening: { width: an.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Sh(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function rl(t) {
  return Ki(h("zones.default"), t.zones.map((e) => e.name));
}
const Eh = (t) => t === "door" || t === "window" || t === "opening";
function Ih(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return v;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return y`
    <h4>${h(`props.next.${n}`)}</h4>
    ${C(`${h("props.width")}, ${h("unit.mm")}`, Te({
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
      ${C(h("props.hinge"), G(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${C(h("props.swing"), G(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? C(h("props.outside"), G(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class Ph {
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
const Ti = (t) => typeof t == "object" && t !== null && !Array.isArray(t), At = (t) => typeof t == "string" && t ? t : null, Xo = (t) => typeof t == "number" && Number.isFinite(t), Di = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function al(t) {
  return t.switchesMigrated || !t.devices.some(Di) ? t : { ...t, switchesMigrated: !0 };
}
function Ch(t, e, n) {
  const i = jr(t, n);
  let s = i.level;
  const o = Ti(e.switch) ? e.switch : {}, r = [["power", At(e.power)], ["voltage", At(e.voltage)], ["control", At(o.entity)]];
  for (const [a, l] of r) l && (s = In(s, i.id, a, l));
  return o.controllable === !0 && (s = Nn(s, i.id, !0)), { level: s, id: i.id };
}
function Lh(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Ti(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((a) => {
      if (!Ti(a)) return a;
      if (a.kind === "meter" && At(a.id) && Xo(a.x) && Xo(a.y)) {
        s++;
        const l = Ch(e, a, At(a.name) ?? `Meter ${s}`);
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
        return l === !0 && typeof a.deviceId == "string" && (e = qr(e, a.deviceId, !0)), o = !0, c;
      }
      return a;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Di)) {
    for (const s of t.level.devices) Di(s) && (e = Nn(e, s.id, !0));
    e = al(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class Oh {
  constructor(e) {
    this.h = e;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await ui(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.adopt(Gs(h("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = be(e);
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
    const n = await xu(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(h("load.oldServer"));
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
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = h("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await ui(this.h.hass);
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
      this.h.notice = be(n);
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
    this.h.toolId = Es(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(Gs(h("plan.default"))), this.offerDraft(null);
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
            await Mu(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = be(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await ui(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = be(o);
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
    this.h.plan = { ...e, levels: e.levels.map(rc) };
    const n = Lh({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = su(n.power, { device: (s) => n.level.devices.find((o) => o.id === s) });
    this.h.history = new Ph({ level: n.level, ...i ? { power: i } : {} }), this.h.lazyPower = _a(), this.h.activeTool.cancel(), this.h.activeTool = Ni(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i } = this.h.history.current, s = e.levels.map((a, l) => l === 0 ? al(n) : a), { power: o, ...r } = e;
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
    const e = `${this.h.plan.name} ${h("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), e);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class zh {
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
    !n || !Fd(n.states, e) ? this.base = { states: e, meta: Bd(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? jd(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Ud(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", be(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const tn = $r("", "");
function Vh(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? tn;
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
    openingDefaults: (e) => Sh(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? rl(((e = t.history) == null ? void 0 : e.current.level) ?? tn);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? tn).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : La(((n = t.history) == null ? void 0 : n.current.level) ?? tn, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const ll = Object.keys(Xi), Hh = (t) => ll.includes(t);
function Nh() {
  return Object.fromEntries(ll.map((t) => [t, Oe(t, "free")]));
}
const cl = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -it, max: it, signed: !0 }, bad: "props.badAim" }
}, St = (t, e, n, i, s) => Te({ ...cl[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), Th = ["round", "linear", "spot"], Dh = ["rect", "circle"], _n = (t, e) => t.map((n) => ({ v: n, label: h(`${e}.${n}`) }));
function dl(t, e, n, i) {
  const s = (r, a, l) => C(`${h(a)}, ${h("unit.mm")}`, St(t, n + r, l, "mm", (c) => i({ [r]: c }))), o = (r, a, l) => C(`${h(a)}, ${h("unit.deg")}`, St(t, n + r, l, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return y`
        ${C(h("props.shape"), G(e.shape, _n([...Th], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? y`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : v}
        ${C(`${h("props.poolRadius")}, ${h("unit.mm")}`, Te({
        ...cl.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: h("props.poolHint"),
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
      return C(`${h("props.diameter")}, ${h("unit.mm")}`, y`<select class="val" data-field=${`${n}diameter`}
        .value=${q(String(e.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== e.diameter && !i({ diameter: l }) && (a.value = String(e.diameter));
      }}>
        ${Ql.map((r) => y`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return y`
        ${C(h("props.shape"), G(e.shape, _n([...Dh], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? y`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${C(h("props.icon"), Bh(t, e.icon, `${n}icon`, i))}
        ${C(h("props.label"), y`<input class="val wide" type="text" data-field=${`${n}label`} .value=${q(e.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== e.label && i({ label: a });
      }} />`)}`;
    default:
      return y`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const Rh = /^mdi:[a-z0-9-]+$/;
function Bh(t, e, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!Rh.test(o)) {
      r(e), (a = t.onNotice) == null || a.call(t, h("props.badIcon"));
      return;
    }
    (l = t.onNotice) == null || l.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? y`<ha-icon-picker data-field=${n} .value=${q(e)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : y`<input class="val wide" type="text" data-field=${n} .value=${q(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
function Ke(t, e, n, i) {
  return C(e, y`<input type="checkbox" data-field=${t} .checked=${q(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Fh(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? v : Ke("wallMount", h("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Uh(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? v : y`
    ${Ke("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? Ke("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : y`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function jh(t, e) {
  const n = e.placement;
  if (n.mode === "none") return v;
  if (n.mode === "free")
    return C(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      St(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = xr.has(e.props.kind);
  return y`
    ${C(h("props.side"), G(n.side, _n(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${C(`${h("props.offset")}, ${h("unit.mm")}`, St(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? C(
    `${h("props.aim")}, ${h("unit.deg")}`,
    St(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(sa(n, s)))
  ) : v}`;
}
function Ps(t, e) {
  return C(h("props.name"), y`<input class="val wide" type="text" data-field="name" .value=${q(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function Wh(t, e) {
  const n = e.props.kind;
  return vr(n) ? n === "smart_button" && e.placement.mode === "free" ? y`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : C(h("props.type"), G(
    n,
    _n(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : v;
}
function Zh(t, e) {
  const n = t.level ? md(t.level, e) : [];
  return y`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? y`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => y`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = t.onZone) != null && a.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function qh(t, e) {
  const n = e.placement.mode !== "none";
  return y`
    <h4>${Yn(e)}</h4>
    ${Ps(e, (i) => t.onDevice({}, i))}
    ${Wh(t, e)}
    ${n ? dl(t, e.props, "", (i) => t.onDevice(i)) : v}
    ${Fh(t, e)}
    ${jh(t, e)}
    ${Uh(t, e)}
    ${n ? Zh(t, e) : v}
    ${e.invalid ? y`<p class="warn">${h("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${h("action.delete")}</button>`;
}
function Kh(t) {
  return t.device ? qh(t, t.device) : t.nextKind && t.nextProps ? y`
      <h4>${h("props.nextDevice")}: ${h(`device.${t.nextKind}`)}</h4>
      ${dl(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? Ke(
    "next-wallMount",
    h("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : v}` : y`<p class="muted">${h("props.none")}</p>`;
}
function Gh(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((l) => l.id === n.id) ?? null : null, s = Hh(t.toolId) ? t.toolId : null, o = (l) => l === e ? (t.setNotice(h("props.noFit")), !1) : (t.setNotice(null), t.commit(l), !0), r = (l) => l.level === e ? !1 : (t.setNotice(null), t.commit(l.level, l.power), !0), a = (l, c) => {
    const u = Kf(e, l, c);
    return o(u ? bn(e, l.id, u) : e);
  };
  return y`<div class="props">
    ${Kh({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (l, c) => !!i && o(jt(e, i.id, l, c)),
    onKind: (l) => !!i && o(Wc(e, i.id, l)),
    onPlacement: (l) => !!i && o(bn(e, i.id, l)),
    onZone: (l, c) => !!i && o(ga(e, i.id, l, c)),
    onWallMount: (l) => !!i && a(i, l),
    onInverter: (l) => !!i && r(Pa(e, t.power, i.id, l)),
    onControllable: (l) => !!i && o(Nn(e, i.id, l)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (l) => t.setNextWallMount(l),
    onNext: (l) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...l, kind: s } });
    },
    onDelete: () => {
      i && r(Ia(e, t.power, i.id));
    },
    onNotice: (l) => t.setNotice(l)
  })}
    ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
    ${i ? v : yh({
    level: e,
    onPick: (l) => t.pickDevice(l),
    onNew: () => {
      const l = il(e);
      t.commit(l.level), t.pickDevice(l.id);
    }
  })}
  </div>`;
}
const Ri = (t) => h(`zones.kind.${t.shape.kind}`), Cs = (t) => y`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${A`<path d=${t === "walls" ? Nu : np}></path>`}</svg>`;
function ul(t, e) {
  const n = ra(t, e);
  return n ? h(`zones.invalid.${n}`) : null;
}
function Yh(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: $s(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || Ri(o).toLowerCase().includes(e));
  return y`
    <div class="zlist">
      <div class="zhead"><span>${h("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${h("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${h("zones.filter")}
        aria-label=${h("zones.filter")} .value=${q(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var l;
    const a = o.invalid ? ul(t.level, o) ?? "" : null;
    return y`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${a === null ? y`<span class="zswatch" style=${`background:${r}`}></span>` : y`<span class="zswatch zinvalid" role="img" aria-label=${a} title=${a}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Ri(o)}>${Cs(o.shape.kind)}</span>
            <span class="zarea">${((l = rs(t.level, o)) == null ? void 0 : l.toFixed(1)) ?? "—"}</span>
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
const Ls = ks(class extends Ms {
  constructor(t) {
    if (super(t), t.type !== Se.PROPERTY && t.type !== Se.ATTRIBUTE && t.type !== Se.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!qa(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === ae || e === v) return e;
    const n = t.element, i = t.name;
    if (t.type === Se.PROPERTY) {
      if (e === n[i]) return ae;
    } else if (t.type === Se.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return ae;
    } else if (t.type === Se.ATTRIBUTE && n.getAttribute(i) === e + "") return ae;
    return Ka(t), e;
  }
}), pl = (t, e, n) => y`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Ls(e)}
    @change=${(i) => n(i.target.checked)} />${h("zones.automation")}</label>`;
function Qh(t, e, n) {
  const i = la(t, e.id);
  return y`<div class="zmembers">
    <div class="zhead"><span>${h("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? y`<span>${h("zones.participates")}</span>` : v}</div>
    ${i.length === 0 ? y`<p class="muted">${h("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => y`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${h(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${Ls(o)}
          @change=${(r) => {
    const a = ga(t, s.id, e.id, r.target.checked);
    a !== t && n(a);
  }} />
      </label>`)}
  </div>`;
}
function Jo(t, e, n) {
  const i = ul(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return y`<div class="zprops">
    <h4>${h("props.zone")}</h4>
    ${C(h("props.name"), y`<input class="val wide" type="text" data-field="zone-name" .value=${q(e.name)}
      @change=${(o) => {
    const r = o.target, a = r.value.trim();
    if (!a || a === e.name) {
      r.value = e.name;
      return;
    }
    n(_d(t, e.id, a));
  }} />`)}
    ${C(h("props.area"), y`<span class="val ro" data-field="zone-area">${Fa(rs(t, e))}</span>`)}
    ${C(h("zones.outline"), y`<span class="val ro zkindval" data-field="zone-kind">${Cs(e.shape.kind)}${Ri(e)}</span>`)}
    ${pl("zone-automation", e.automation !== !1, (o) => {
    const r = us(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? y`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? y`<button class="btn" data-action="keep-outline" @click=${() => n(Id(t, e.id))}>
        ${h("zones.keepOutline")}</button>` : v}</div>` : v}
    ${Qh(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(ma(t, e.id))}>
      ${h("zones.delete")}</button>
  </div>`;
}
function Xh(t) {
  const e = t.next.zone, n = e.name ?? rl(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return y`
    <h4>${h("props.nextZone")}</h4>
    <div class="muted">${h("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${h("zones.method")}>
      ${["walls", "polygon"].map((s) => y`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${Cs(s)}<span>${h(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${h(`zones.hint.${e.method}`)}</p>
    ${C(h("props.name"), y`<input class="val wide" type="text" data-field="next-zone-name" .value=${q(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${pl("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function fl(t, e, n) {
  return Te({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function er(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Jh(t, e) {
  const n = J(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Dd(e.level, t.id, o));
  return y`
    <h4>${h("props.wall")}</h4>
    ${C(h("props.type"), G(
    t.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${C(h("props.thickness"), fl(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${C(h("props.baseline"), G(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: h(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${C(h("props.length"), y`<span class="val ro">${je(n)} ${h("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(ms(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function e1(t, e) {
  const n = ["door", "window", "opening", ...gn.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Fc(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = gn.includes(t.kind);
  return y`
    <h4>${h(`kind.${t.kind}`)}</h4>
    ${C(h("props.kind"), G(t.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(Bc(t, r))))}
    ${C(h("props.width"), fl(e, t.width, (r) => er(e, Rc(e.level, t.id, r))))}
    ${C(h("props.offset"), Te({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => er(e, Rr(e.level, t.id, r))
  }))}
    ${o ? y`
      ${C(h("props.hinge"), G(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${C(h("props.swing"), G(t.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${t.kind === "window" ? C(h("props.outside"), G(t.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${C(h("props.passesLight"), y`<input type="checkbox" data-field="passesLight" .checked=${q(Hr(t))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Vr(t.kind) ? void 0 : a });
  }} />`)}
    ${C(h("props.passesPir"), y`<input type="checkbox" data-field="passesPir" .checked=${q(Tr(t))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Nr(t.kind) ? void 0 : a });
  }} />`)}
    ${t.invalid ? y`<p class="warn">${h("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Br(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function t1(t) {
  const e = ["bearing", "partition", "railing"];
  return y`
    <h4>${h("props.newWall")}</h4>
    ${C(h("props.type"), y`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => y`<option value=${n} ?selected=${n === t.wallType}>${h(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${C(`${h("props.thickness")}, ${h("unit.mm")}`, Te({
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
      <div class="muted">${h("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => y`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${h(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
const tr = (t) => Yh({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function n1(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return y`<div class="props">
      ${Xh({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
      ${s ? Jo(e, s, t.commit) : v}
      ${tr(t)}
    </div>`;
  }
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = Jh(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = e1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = Jo(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = y`<h4>${h("props.node")}</h4>
      ${C("X", y`<span class="val ro">${je(s.x)}</span>`)}${C("Y", y`<span class="val ro">${je(s.y)}</span>`)}`);
  }
  return y`
    <div class="props">
      ${i === v && (t.tool === "wall" || t.tool === "box") ? t1(t) : i === v && Eh(t.tool) ? Ih({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === v && t.tool === "select" ? tr(t) : i === v ? y`<p class="muted">${h("props.none")}</p>` : i}
      ${t.notice ? y`<p class="warn">${t.notice}</p>` : v}
    </div>`;
}
function i1(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const nr = /* @__PURE__ */ new WeakMap();
function Os(t, e, n) {
  let i = nr.get(t);
  i || nr.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((a) => {
    var l;
    return n ? e.domains.includes(a.domain) : i1(a, e) && !a.hidden && !a.disabled && (a.category === null || !!((l = e.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function un(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nn = (t) => t ?? v;
var s1 = Object.defineProperty, qt = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && s1(e, n, s), s;
};
const o1 = 100;
let r1 = 0;
const a1 = (t) => y`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${t}></path>`}</svg>`, Vs = class Vs extends et {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${r1++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === o1) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${nn(this.label || void 0)} title=${nn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? y`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return y`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${nn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => y`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${nn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? y`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? y`<div class="hint">${h("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return y`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
Vs.styles = pr`
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
let Ve = Vs;
qt([
  ke()
], Ve.prototype, "value");
qt([
  ke()
], Ve.prototype, "label");
qt([
  R()
], Ve.prototype, "isOpen");
qt([
  R()
], Ve.prototype, "query");
qt([
  R()
], Ve.prototype, "active");
var l1 = Object.defineProperty, zs = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && l1(e, n, s), s;
};
const c1 = {
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
}, ir = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, d1 = { light: "light", switch: "switch", event: "event", fan: "fan" };
function sr(t, e) {
  return t != null && t.deviceClass && ir[t.deviceClass] ? ir[t.deviceClass] : d1[(t == null ? void 0 : t.domain) ?? $a(e)] ?? "generic";
}
const or = (t) => a1(c1[t]);
function u1(t) {
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
class Qn extends Ve {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = un(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? un(this.meta, e) : null;
    return y`${or(e ? sr(this.meta.entities.get(e), e) : "generic")}
      ${n ? y`<span><b>${n.name}</b>${n.context !== n.name ? y`<small>${n.context}</small>` : v}<small class="eid">${e}</small></span>` : y`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = ka(this.states, e.entityId) ?? "unavailable";
    return y`${or(sr(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${u1(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = un(this.meta, e).name;
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
zs([
  ke({ attribute: !1 })
], Qn.prototype, "meta");
zs([
  ke({ attribute: !1 })
], Qn.prototype, "items");
zs([
  ke({ attribute: !1 })
], Qn.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Qn);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), Et(s, e);
  return !0;
}, An = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, hl = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), h1(e);
  }
};
function p1(t) {
  this._$AN !== void 0 ? (An(this), this._$AM = t, hl(this)) : this._$AM = t;
}
function f1(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) Et(i[o], !1), An(i[o]);
  else i != null && (Et(i, !1), An(i));
  else Et(this, t);
}
const h1 = (t) => {
  t.type == Se.CHILD && (t._$AP ?? (t._$AP = f1), t._$AQ ?? (t._$AQ = p1));
};
class m1 extends Ms {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), hl(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (Et(this, e), An(this));
  }
  setValue(e) {
    if (qa(this._$Ct)) this._$Ct._$AI(e, this);
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
const g1 = () => new w1();
class w1 {
}
const wi = /* @__PURE__ */ new WeakMap(), b1 = ks(class extends m1 {
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
      let n = wi.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), wi.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = wi.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), y1 = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], v1 = { min: 1, max: 10 };
function ml(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Bi = (t, e, n) => ml(t, jt(t.level, e.id, n));
function bi(t, e, n, i) {
  return y`<div class="cflag">${C(e, y`<input type="checkbox" data-field=${t} .checked=${q(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const yi = "__other", mt = /* @__PURE__ */ new Set();
function $1(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Ks.includes(i), a = !r || mt.has(o), l = g1(), c = [...Ks.map((d) => ({ v: d, label: d })), { v: yi, label: h("binding.eventOther") }];
  return y`<span class="evfield">${G(a ? yi : i, c, (d) => {
    if (d === yi) {
      mt.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    mt.delete(o), l.value && (l.value.hidden = !0), d !== i ? s(d) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${b1(l)} data-field=${`${n}-event-custom`} ?hidden=${Ls(!a)}
      .value=${q(r ? "" : i)} @change=${(d) => {
    var m;
    const p = d.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, t.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, t.setFieldNotice(null), f !== i) {
      s(f) && mt.delete(o);
      return;
    }
    if (mt.delete(o), r) {
      p.hidden = !0;
      const b = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      b && (b.value = i);
    }
  }} /></span>`;
}
function x1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return y`${v}`;
  const s = i[n], o = (r) => Bi(t, e, { [n]: { ...s, ...r } });
  return y`<div class="trigger" data-trigger=${n}>
    ${C(h("binding.slot"), G(
    String(s.slot),
    y1(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${C(h("binding.event"), $1(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function k1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return y`
      ${bi(
      "autoByDoubleToggle",
      h("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => Bi(t, e, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? y`<div class="cflag">${C(h("binding.window"), Te({
      value: i.windowSec,
      rule: v1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => t.setFieldNotice(a),
      apply: (a) => Bi(t, e, { windowSec: a })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return y`${v}`;
  const s = (a, l) => (c) => {
    var d, p;
    const u = jt(t.level, e.id, { [a]: c });
    return ml(t, c && !((d = e.bindings) != null && d[l]) ? In(u, e.id, l, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = bi("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : y`${bi("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? v : r}`;
}
function M1(t) {
  return t.props.kind !== "smart_button" || !Yl(t).length ? y`${v}` : y`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function Fi(t, e) {
  return e === "control" && t.props.kind === "equipment" ? h("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? h("binding.onOff") : h(`role.${e}`);
}
const vi = (t) => String(t).padStart(2, "0");
function _1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${vi(e.getHours())}:${vi(e.getMinutes())}:${vi(e.getSeconds())}`;
}
const A1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function S1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : h("output.errorNotConfigured") : t.last ? h("output.last").replace("{event}", A1(t.last, t.kind)).replace("{time}", _1(t.last.at)) : h("output.none");
}
function E1(t, e) {
  if (!Cn(e.props.kind)) return v;
  const n = t.feed.stateOf(e), i = n ? S1(n) : t.feed.error ?? (t.feed.ready ? h("output.notSaved") : null);
  return i === null ? v : y`<p class="note" data-field="output">${i}</p>`;
}
function I1(t, e, n, i) {
  const s = Ma(t.meta, i, t.states), o = Gl(t.level, e, n);
  return y`
    ${s === "missing" ? y`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : v}
    ${s === "unavailable" ? y`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : v}
    ${o.length ? y`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : v}`;
}
function P1(t, e, n) {
  var a;
  const { role: i } = n, s = ((a = e.bindings) == null ? void 0 : a[i]) ?? null, o = !!t.showAll[i], r = Fi(e, i);
  return y`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${h("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Os(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const c = In(t.level, e.id, i, l.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Gi(i) ? x1(t, e, i) : v}
    ${s ? I1(t, e, i, s) : v}
  </div>`;
}
function C1(t) {
  const e = t.device, n = Yi(t.level.devices.map(t.status));
  return y`<div class="props bprops">
    ${t.notice ? y`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.fieldNotice ? y`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : v}
    ${t.registryError ? y`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${h(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${e ? y`
      <h4>${Yn(e)}</h4>
      ${Ps(e, (i) => t.commit(jt(t.level, e.id, {}, i)))}
      ${E1(t, e)}
      ${He(e).map((i) => y`${P1(t, e, i)}${k1(t, e, i.role)}`)}
      ${M1(e)}` : y`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const L1 = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, O1 = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, z1 = 6, V1 = ["A", "0", "B"], H1 = ["power", "control"], N1 = ["power", "power_in", "power_out", "voltage", "control"], lt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function gt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? r : a) });
}
function wt(t, e, n, i, s, o) {
  return y`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Os(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const a = r.detail.value || null;
    a !== (s ?? null) && o(a);
  }}></ps-entity-combo>
  </div>`;
}
function T1(t, e) {
  const n = e.name ?? "";
  return C(h("props.name"), y`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${e.kind}`)} .value=${q(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(Nt(t.power, e.id, { name: o }, lt(t))) : s.value = n;
  }} />`);
}
function D1(t, e) {
  const n = new Set(He(e).map((i) => i.role));
  return y`${H1.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return y`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? y`<b>${un(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function sn(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function R1(t, e) {
  var o;
  const n = He(e), i = N1.flatMap((r) => n.filter((a) => a.role === r)), s = e.props;
  return y`
    ${Ps(e, (r) => sn(t, jt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var a;
    return y`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Fi(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Os(t.meta, r, !1)}
        .value=${((a = e.bindings) == null ? void 0 : a[r.role]) ?? null} .label=${Fi(e, r.role)}
        @value-changed=${(l) => {
      l.stopPropagation(), sn(t, In(t.level, e.id, r.role, l.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? Ke(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => sn(t, Nn(t.level, e.id, r))
  ) : v}
    ${s.kind === "equipment" ? Ke("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const a = Pa(t.level, t.power, e.id, r);
    return sn(t, a.level, a.power);
  }) : v}`;
}
function B1(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return y`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
  const i = dt(n) ? v : Ke("output", h("power.enableOutput"), e.output !== !1, (s) => {
    const o = lt(t);
    if (s) {
      const { output: r, ...a } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? a : l) });
    } else
      t.commitPower(jn(Nt(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? y`${R1(t, n)}${i}` : y`
    ${C(h("props.name"), y`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${C(h("props.kind"), y`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${D1(t, n)}${i}`;
}
function F1(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return y`
    ${C(h("power.form"), G(e.form, i, (r) => {
    r !== e.form && t.commitPower(Nt(t.power, e.id, { form: r }, lt(t)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${V1.map((r) => y`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function U1(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (l, c) => {
    if (l === i && c === s) return !1;
    t.commitPower(Nt(t.power, e.id, n ? { w: l, h: c } : { w: c, h: l }, lt(t)));
  }, r = (l, c, u) => Te({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: l, skipSame: !0, apply: u }), a = ["h", "v"].map((l) => ({ v: l, label: h(`power.orientation.${l}`) }));
  return y`
    ${C(h("power.orientation"), G(n ? "h" : "v", a, (l) => {
    l !== (n ? "h" : "v") && t.commitPower(Nt(t.power, e.id, { w: e.h, h: e.w }, lt(t)));
  }, "bus-orientation"))}
    ${C(h("power.busLength"), r("bus-length", i, (l) => o(Math.max(Hi, s + 1, l), s)))}
    ${C(h("power.busThickness"), r("bus-thickness", s, (l) => o(i, Math.min(Math.max(z1, l), i - 1))))}`;
}
function j1(t, e) {
  switch (e.kind) {
    case "grid":
      return y`
      ${wt(t, "power", h("power.field.power"), Ue, e.power, (n) => gt(t, e, "power", n))}
      ${wt(t, "voltage", h("power.field.voltage"), L1, e.voltage, (n) => gt(t, e, "voltage", n))}`;
    case "device":
      return B1(t, e);
    case "battery":
      return y`
      ${wt(t, "power", h("power.field.batteryPower"), Ue, e.power, (n) => gt(t, e, "power", n))}
      ${wt(t, "soc", h("power.field.soc"), O1, e.soc, (n) => gt(t, e, "soc", n))}`;
    case "pv":
      return wt(t, "power", h("power.field.power"), Ue, e.power, (n) => gt(t, e, "power", n));
    case "transfer":
      return F1(t, e);
    case "bus":
      return U1(t, e);
    default:
      return v;
  }
}
function W1(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return y`
    <h4>${i ? Yn(i) : h(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? v : T1(t, e)}
    ${j1(t, e)}
    <div class="pactions">
      ${n ? y`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Jd(t.power, e.id))}>${h("power.autoPorts")}</button>` : v}
      ${e.kind === "grid" ? v : y`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Sa(t.power, e.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function Z1(t, e) {
  var s, o;
  const n = lt(t), i = (r) => {
    const a = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), l = a ? Zn(a, n) || h(`power.kind.${a.kind}`) : "—";
    return "block" in r ? `${l} · ${r.port}` : l;
  };
  return y`
    <h4>${h("power.wire")}</h4>
    ${C(h("power.wire.from"), y`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${C(h("power.wire.to"), y`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${C(h("power.wire.power"), y`<span class="val ro" data-field="wire-power">${$t((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Ca(t.power, e.id))}>${h("action.delete")}</button></div>`;
}
function q1(t) {
  const e = La(t.level, t.power);
  return y`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = il(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${h("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${h("power.help.device")}</p>
    ${e.length === 0 ? y`<p class="muted" data-note="no-devices">${h("power.noDevices")}</p>` : y`<div class="pdevs">
      ${e.map((i) => y`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${Yn(i)}</span>
      </button>`)}
    </div>`}`;
}
function K1(t) {
  if (t.toolId === "power-device") return q1(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return W1(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Z1(t, i) : t.toolId !== "power-select" ? y`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : y`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function G1(t) {
  return y`<div class="props pprops">
    ${t.notice ? y`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : v}
    ${t.feedError ? y`<p class="note" data-notice="feed">${t.feedError}</p>` : v}
    ${K1(t)}
  </div>`;
}
function Y1(t, e) {
  return t.mode !== "binding" ? mh(t.mode, t.toolId, (n) => t.pickTool(n)) : _h({
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
function Q1(t, e) {
  var i;
  const n = t.selection;
  return C1({
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
function X1(t, e) {
  var i;
  if (t.mode === "binding") return Q1(t, e);
  if (t.mode === "power")
    return G1({
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
  return t.mode === "equipment" ? Gh({
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
  }) : n1({
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
function J1(t, e) {
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
function em(t, e) {
  const n = t === "zone" ? `${h("tool.zone")} · ${h(`zones.kind.${e}`)}` : h(`tool.${t}`);
  return y`<span class="tool-chip">${nl(t)}${n}</span>`;
}
function tm(t) {
  return y`
    <div class="status">
      ${em(t.tool, t.zoneMethod)}
      ${J1(t.tool, t.zoneMethod).map(([e, n]) => y`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? y`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${h(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? v : y`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function nm(t, e) {
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
function im(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a: l, b: c } = s[0], u = Math.hypot(c.x - l.x, c.y - l.y);
    let d = Math.atan2(-(c.y - l.y), c.x - l.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: je(u), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: je(r), second: je(a) };
}
function sm(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const om = pr`
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
`, rm = 5e-3, am = 2, Sn = (t) => Math.max(rm, Math.min(am, t));
function lm(t, e, n) {
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
function cm(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Sn(Math.min(e, n) / 12e3) };
  const i = t.map((d) => d.x), s = t.map((d) => d.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, c = Math.max(...s) + o, u = Sn(Math.min(e / (a - r), n / (c - l)));
  return { x: (r + a) / 2 - e / u / 2, y: (l + c) / 2 - n / u / 2, scale: u };
}
function dm(t, e, n, i, s) {
  const o = Sn(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function um(t, e, n) {
  const i = Sn(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function pm(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function rr(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function fm(t, e, n, i, s = 1) {
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
const hm = ["Shift", "Control", "Alt", "Meta"], mm = {
  plan: "select",
  equipment: "device-select",
  power: "power-select"
}, gm = new Map(Object.entries(tl).map(([t, e]) => [`Key${e}`, t]));
function ar(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class wm {
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
        this.h.view = pm(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = um(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (ar(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? gm.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let a = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!a && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (a = this.h.deleteSelection()), !a && n.key === "Escape") {
        const l = mm[this.h.mode];
        l && this.h.toolId !== l ? this.h.pickTool(l) : (this.h.activeTool.cancel(), this.h.selection = null), a = !0;
      }
      a && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || ar(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !hm.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function gl(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function bm(t) {
  return y`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", gl(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function bt(t, e, n, i) {
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
function ym(t) {
  var n;
  const e = { action: "cancel", label: h("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? bt(h("draft.title"), h("draft.text").replace("{time}", gl(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => t.discard(i) }
      ]) : v;
    }
    case "new":
      return bt(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return bt(h("delete.title"), h("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "switch":
      return bt(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return bt(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return v;
  }
}
const yt = "plan_studio.draft.", on = "plan_studio.lastPlanId";
function vm() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function $m(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class xm {
  constructor(e = vm, n = 500) {
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
      return $m(s) && s.planId === e ? s : null;
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(on)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(on, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(on)) === e && n.removeItem(on);
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
const wl = 5e3, bl = 12, km = 3e3;
function lr(t) {
  t().catch(() => {
  });
}
class Mm {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && lr(n.unsub));
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
          lr(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(be(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= bl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, wl));
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
    }, km), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
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
const _m = ["power", "voltage", "power_in", "power_out", "control"], Am = 300;
function cr(t) {
  t().catch(() => {
  });
}
function Sm(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const a = { inverter: dt(r), controllable: Wr(r) };
    for (const l of _m) {
      const c = (s = r.bindings) == null ? void 0 : s[l];
      c && (a[l] = c);
    }
    i[r.id] = a;
  }
  return { power: t, devices: i };
}
class Em {
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
      }, Am);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && cr(n.unsub));
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
          cr(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(be(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= bl || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, wl));
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
var Im = Object.defineProperty, B = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && Im(e, n, s), s;
};
const Hs = class Hs extends et {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Xl.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Nh(), this.nextObj = Ah(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = _a(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new xm(), this.resizeObs = null, this.session = new Oh(this), this.haMeta = new zh(this), this.feed = new Mm(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new Em(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Zl(i, (s) => {
      var o;
      return Ma(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Au(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Vh(this), this.activeTool = Ni("select", this.ctx), this.input = new wm(this);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? Sm(this.power, e) : null);
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
    const i = this.history.current.power, s = n ?? (i && Yd(i, e));
    this.history.push({ ...this.history.current, level: e, ...s && s !== this.power ? { power: s } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
  }
  commitPower(e) {
    this.history && (this.history.push({ ...this.history.current, power: e }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  dropStaleSelection() {
    this.history && this.selection && !gi(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || !e || !n || e.kind === "node" || !gi(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Ia(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? ms(n, e.id) : e.kind === "opening" ? Br(n, e.id) : ma(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Ca(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Sa(n, e.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = be(i);
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
    this.selection = this.mode === "binding" && n && i && gi(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Ni(e, this.ctx);
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
    e !== this.mode && (this.mode === "power" && (this.placeDeviceId = null), this.mode = e, this.pickTool(Es(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = X(n, i);
    s && (this.view = rr(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = ca(n).get(e);
    s && (this.view = rr(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? xh(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return lm(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = cm(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = $u(this.power, this.ctx.geo());
    e && (this.powerView = dm(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e;
    return ym({
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
    var d, p, f;
    if (!this.plan || !this.history)
      return y`<div class="center">${this.loadError ? y`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const e = Sf(!!((p = (d = this.hass) == null ? void 0 : d.themes) != null && p.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power";
    return y`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : ""}"
        style=${sm(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${ph({
      steps: wh({
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
        ${Y1(this, n)}
        ${X1(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(m) => m.preventDefault()}>
            ${this.grid ? fm(this.view, a, l, e, u ? 0.1 : 1) : v}
            ${this.mode === "power" ? Mf(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Yp(n, {
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
            ${i.tracker ? nm(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: im(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((f = this.dialog) == null ? void 0 : f.kind) !== "restore" ? bm({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${tm({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? h(`snap.${i.snap.kind}`) : null,
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
Hs.styles = om;
let T = Hs;
B([
  ke({ attribute: !1 })
], T.prototype, "hass");
B([
  ke({ type: Boolean })
], T.prototype, "narrow");
B([
  ke({ attribute: !1 })
], T.prototype, "panel");
B([
  R()
], T.prototype, "plan");
B([
  R()
], T.prototype, "loadError");
B([
  R()
], T.prototype, "selection");
B([
  R()
], T.prototype, "toolId");
B([
  R()
], T.prototype, "wallType");
B([
  R()
], T.prototype, "thickness");
B([
  R()
], T.prototype, "boxMeasure");
B([
  R()
], T.prototype, "grid");
B([
  R()
], T.prototype, "mode");
B([
  R()
], T.prototype, "bindFilter");
B([
  R()
], T.prototype, "bindQuery");
B([
  R()
], T.prototype, "railCollapsed");
B([
  R()
], T.prototype, "showAll");
B([
  R()
], T.prototype, "zoneQuery");
B([
  R()
], T.prototype, "cones");
B([
  R()
], T.prototype, "nextProps");
B([
  R()
], T.prototype, "nextObj");
B([
  R()
], T.prototype, "planView");
B([
  R()
], T.prototype, "powerView");
B([
  R()
], T.prototype, "placeDeviceId");
B([
  R()
], T.prototype, "size");
B([
  R()
], T.prototype, "dialog");
B([
  R()
], T.prototype, "notice");
B([
  R()
], T.prototype, "fieldNotice");
B([
  R()
], T.prototype, "pendingDraft");
B([
  R()
], T.prototype, "plans");
B([
  R()
], T.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", T);
export {
  T as PlanStudioPanel
};
