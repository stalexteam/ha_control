/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const On = globalThis, Ws = On.ShadowRoot && (On.ShadyCSS === void 0 || On.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, js = Symbol(), Bo = /* @__PURE__ */ new WeakMap();
let Rl = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== js) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Ws && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Bo.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Bo.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const bd = (t) => new Rl(typeof t == "string" ? t : t + "", void 0, js), Bl = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[o + 1], t[0]);
  return new Rl(n, t, js);
}, vd = (t, e) => {
  if (Ws) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), s = On.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, t.appendChild(i);
  }
}, Fo = Ws ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return bd(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wd, defineProperty: $d, getOwnPropertyDescriptor: yd, getOwnPropertyNames: xd, getOwnPropertySymbols: kd, getPrototypeOf: Md } = Object, Be = globalThis, Uo = Be.trustedTypes, _d = Uo ? Uo.emptyScript : "", Di = Be.reactiveElementPolyfillSupport, Ut = (t, e) => t, Fn = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? _d : null;
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
} }, qs = (t, e) => !wd(t, e), Wo = { attribute: !0, type: String, converter: Fn, reflect: !1, useDefault: !1, hasChanged: qs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Be.litPropertyMetadata ?? (Be.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let pt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Wo) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, n);
      s !== void 0 && $d(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: s, set: o } = yd(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Wo;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ut("elementProperties"))) return;
    const e = Md(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ut("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ut("properties"))) {
      const n = this.properties, i = [...xd(n), ...kd(n)];
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
      for (const s of i) n.unshift(Fo(s));
    } else e !== void 0 && n.push(Fo(e));
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
    return vd(e, this.constructor.elementStyles), e;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : Fn).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : Fn;
      this._$Em = s;
      const c = a.fromAttribute(n, l.type);
      this[s] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? qs)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
pt.elementStyles = [], pt.shadowRootOptions = { mode: "open" }, pt[Ut("elementProperties")] = /* @__PURE__ */ new Map(), pt[Ut("finalized")] = /* @__PURE__ */ new Map(), Di == null || Di({ ReactiveElement: pt }), (Be.reactiveElementVersions ?? (Be.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = globalThis, jo = (t) => t, Un = Wt.trustedTypes, qo = Un ? Un.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Fl = "$lit$", Ve = `lit$${Math.random().toFixed(9).slice(2)}$`, Ul = "?" + Ve, Ad = `<${Ul}>`, st = document, Yt = () => st.createComment(""), Qt = (t) => t === null || typeof t != "object" && typeof t != "function", Zs = Array.isArray, Sd = (t) => Zs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Ni = `[ 	
\f\r]`, Pt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Zo = /-->/g, Go = />/g, Xe = RegExp(`>|${Ni}(?:([^\\s"'>=/]+)(${Ni}*=${Ni}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ko = /'/g, Xo = /"/g, Wl = /^(?:script|style|textarea|title)$/i, jl = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), v = jl(1), _ = jl(2), ge = Symbol.for("lit-noChange"), w = Symbol.for("lit-nothing"), Yo = /* @__PURE__ */ new WeakMap(), Qe = st.createTreeWalker(st, 129);
function ql(t, e) {
  if (!Zs(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return qo !== void 0 ? qo.createHTML(e) : e;
}
const Id = (t, e) => {
  const n = t.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Pt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, u, d = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, u = r.exec(a), u !== null); ) p = r.lastIndex, r === Pt ? u[1] === "!--" ? r = Zo : u[1] !== void 0 ? r = Go : u[2] !== void 0 ? (Wl.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Xe) : u[3] !== void 0 && (r = Xe) : r === Xe ? u[0] === ">" ? (r = s ?? Pt, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? Xe : u[3] === '"' ? Xo : Ko) : r === Xo || r === Ko ? r = Xe : r === Zo || r === Go ? r = Pt : (r = Xe, s = void 0);
    const f = r === Xe && t[l + 1].startsWith("/>") ? " " : "";
    o += r === Pt ? a + Ad : d >= 0 ? (i.push(c), a.slice(0, d) + Fl + a.slice(d) + Ve + f) : a + Ve + (d === -2 ? l : f);
  }
  return [ql(t, o + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Jt {
  constructor({ strings: e, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, u] = Id(e, n);
    if (this.el = Jt.createElement(c, i), Qe.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = Qe.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Fl)) {
          const p = u[r++], f = s.getAttribute(d).split(Ve), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? Cd : m[1] === "?" ? Ld : m[1] === "@" ? Pd : di }), s.removeAttribute(d);
        } else d.startsWith(Ve) && (a.push({ type: 6, index: o }), s.removeAttribute(d));
        if (Wl.test(s.tagName)) {
          const d = s.textContent.split(Ve), p = d.length - 1;
          if (p > 0) {
            s.textContent = Un ? Un.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(d[f], Yt()), Qe.nextNode(), a.push({ type: 2, index: ++o });
            s.append(d[p], Yt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ul) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(Ve, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += Ve.length - 1;
      }
      o++;
    }
  }
  static createElement(e, n) {
    const i = st.createElement("template");
    return i.innerHTML = e, i;
  }
}
function vt(t, e, n = t, i) {
  var r, l;
  if (e === ge) return e;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Qt(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(t), s._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (e = vt(t, s._$AS(t, e.values), s, i)), e;
}
class Ed {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? st).importNode(n, !0);
    Qe.currentNode = s;
    let o = Qe.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new Gs(o, o.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (c = new Od(o, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = Qe.nextNode(), r++);
    }
    return Qe.currentNode = st, s;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let Gs = class Zl {
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
    e = vt(this, e, n), Qt(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== ge && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Sd(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== w && Qt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(st.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: n, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Jt.createElement(ql(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Ed(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = Yo.get(e.strings);
    return n === void 0 && Yo.set(e.strings, n = new Jt(e)), n;
  }
  k(e) {
    Zs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of e) s === n.length ? n.push(i = new Zl(this.O(Yt()), this.O(Yt()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const s = jo(e).nextSibling;
      jo(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class di {
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
    if (o === void 0) e = vt(this, e, n, 0), r = !Qt(e) || e !== this._$AH && e !== ge, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = o[0], a = 0; a < o.length - 1; a++) c = vt(this, l[i + a], n, a), c === ge && (c = this._$AH[a]), r || (r = !Qt(c) || c !== this._$AH[a]), c === w ? e = w : e !== w && (e += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Cd extends di {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === w ? void 0 : e;
  }
}
class Ld extends di {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== w);
  }
}
let Pd = class extends di {
  constructor(e, n, i, s, o) {
    super(e, n, i, s, o), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = vt(this, e, n, 0) ?? w) === ge) return;
    const i = this._$AH, s = e === w && i !== w || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== w && (i === w || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Od {
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
const Ti = Wt.litHtmlPolyfillSupport;
Ti == null || Ti(Jt, Gs), (Wt.litHtmlVersions ?? (Wt.litHtmlVersions = [])).push("3.3.3");
const zd = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new Gs(e.insertBefore(Yt(), o), o, void 0, n ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = globalThis;
let gt = class extends pt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = zd(n, this.renderRoot, this.renderOptions);
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
    return ge;
  }
};
var Hl;
gt._$litElement$ = !0, gt.finalized = !0, (Hl = et.litElementHydrateSupport) == null || Hl.call(et, { LitElement: gt });
const Vi = et.litElementPolyfillSupport;
Vi == null || Vi({ LitElement: gt });
(et.litElementVersions ?? (et.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dd = { attribute: !0, type: String, converter: Fn, reflect: !1, hasChanged: qs }, Nd = (t = Dd, e, n) => {
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
  return (e, n) => typeof n == "object" ? Nd(t, e, n) : ((i, s, o) => {
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
  return ze({ ...t, state: !0, attribute: !1 });
}
function Y() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Ks(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const tt = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Td = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Vd = { ...tt, role: "power_in" }, Hd = { ...tt, role: "power_out" }, Rd = ["on", "off", "auto"], Xs = (t) => Rd.includes(t), Hi = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Bd = {
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
  smart_button: [Hi("on"), Hi("off"), Hi("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, tt],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, tt, Td, Vd, Hd]
}, Ys = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Fd = { climate_sensor: "any" };
function Ie(t) {
  const e = t.props, n = Bd[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Gl(t) {
  return new Set(Ie(t).map((e) => e.role));
}
function ui(t, e, n, i) {
  var l;
  const s = t.devices.find((a) => a.id === e);
  if (!s || !Gl(s).has(n)) return t;
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
function Ud(t, e) {
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = Ie(t).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (Fd[t.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Wd(t) {
  const e = Ie(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const jd = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function ms(t, e) {
  var s;
  const n = (s = t.bindings) == null ? void 0 : s[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Xs(e) ? n : `${n}|${jd(i[e])}`;
}
function qd(t, e, n) {
  const i = ms(e, n);
  return i === null ? [] : t.devices.filter((s) => s.id !== e.id && Ie(s).some((o) => ms(s, o.role) === i));
}
function Zd(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Ie(t)) {
    const s = Xs(i) ? ms(t, i) : null;
    s !== null && (e.has(s) ? n.push(i) : e.add(s));
  }
  return n;
}
function pi(t) {
  if (!t.bindings) return t;
  const e = Gl(t), n = Object.entries(t.bindings).filter(([s, o]) => e.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Kl = (t) => t === "wall_switch" || t === "smart_button", hi = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", en = (t) => t === "wall" ? "wall" : "free", Gd = [100, 125, 150], Qs = "mdi:cube-outline", Qo = ["single", "double", "hold"], Kd = {
  bearing: 400
}, zn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Xl(t = Y(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Jo(t) {
  return {
    id: Y(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Xl()]
  };
}
const Js = {
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
}, wt = 90, Yl = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function je(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Qs, label: "" };
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
const Xd = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Qs
};
function Yd(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, s = typeof e.icon == "string" ? e.icon : Xd[String(n)] ?? Qs;
  return { ...t, props: { ...i, icon: s } };
}
function Qd(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = en(t.placement.mode);
  return e ? { ...t, props: je("smart_button", n), bindings: { on: e } } : { ...t, props: je("wall_switch", n) };
}
const Ql = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Jd(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Ql(n.slot, 0, 9) ? n.slot : e.slot, s = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && s === n.event ? t : { slot: i, event: s };
}
function eu(t) {
  const e = t.props.kind;
  if (!hi(e)) return t;
  const n = t.props;
  let i = null;
  for (const [s, o] of Object.entries(je(e, en(t.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? Jd(r, o) : s === "windowSec" ? Ql(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...t, props: i } : t;
}
function tu(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function nu(t) {
  if (!hi(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function iu(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => pi(tu(nu(eu(Qd(Yd(n)))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function D(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function C(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function E(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function U(t, e) {
  return t.x * e.x + t.y * e.y;
}
function oe(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Jl(t) {
  return Math.hypot(t.x, t.y);
}
function O(t, e) {
  return Jl(C(e, t));
}
function fi(t) {
  const e = Jl(t);
  return e === 0 ? { x: 0, y: 0 } : E(t, 1 / e);
}
function ee(t) {
  return { x: t.y, y: -t.x };
}
function ea(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function xe(t, e, n, i) {
  const s = oe(e, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = oe(C(n, t), i) / s;
  return D(t, E(e, o));
}
function mi(t, e, n) {
  const i = C(n, e), s = U(i, i);
  return s === 0 ? 0 : U(C(t, e), i) / s;
}
function _e(t, e, n) {
  const i = C(n, e), s = U(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, U(C(t, e), i) / s));
  return O(t, D(e, E(i, o)));
}
function $t(t, e) {
  let n = !1;
  for (let i = 0, s = e.length - 1; i < e.length; s = i++) {
    const o = e[i], r = e[s];
    o.y > t.y != r.y > t.y && t.x < (r.x - o.x) * (t.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function Ae(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], s = t[(n + 1) % t.length];
    e += i.x * s.y - s.x * i.y;
  }
  return e / 2;
}
let qe = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function su(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function He(t, e, n) {
  const i = new qe(null, null);
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
function Ri(t, e, n, i) {
  const s = new qe(t, e);
  if (n === null)
    return s.left = s.right = null, s;
  n = He(t, n, i);
  const o = i(t, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function er(t, e, n) {
  let i = null, s = null;
  if (e) {
    e = He(t, e, n);
    const o = n(e.key, t);
    o === 0 ? (i = e.left, s = e.right) : o < 0 ? (s = e.right, e.right = null, i = e) : (i = e.left, e.left = null, s = e);
  }
  return { left: i, right: s };
}
function ou(t, e, n) {
  return e === null ? t : (t === null || (e = He(t.key, e, n), e.left = t), e);
}
function gs(t, e, n, i, s) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${s(t)}
`);
    const o = e + (n ? "    " : "│   ");
    t.left && gs(t.left, o, !1, i, s), t.right && gs(t.right, o, !0, i, s);
  }
}
class eo {
  constructor(e = su) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = Ri(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new qe(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = He(e, this._root, s), r = s(e, o.key);
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
    return n === null ? null : (n = He(e, n, i), i(e, n.key) === 0 ? (n.left === null ? s = n.right : (s = He(e, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = He(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = He(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return lu(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let s = e.length;
    const o = this._comparator;
    if (i && ws(e, n, 0, s - 1, o), this._root === null)
      this._root = bs(e, n, 0, s), this._size = s;
    else {
      const r = au(
        this.toList(),
        ru(e, n),
        o
      );
      s = this._size + s, this._root = vs({ head: r }, 0, s);
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
    return gs(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = er(e, this._root, s);
    s(e, n) < 0 ? r = Ri(n, i, r, s) : o = Ri(n, i, o, s), this._root = ou(o, r, s);
  }
  split(e) {
    return er(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function bs(t, e, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = t[o], l = e[o], a = new qe(r, l);
    return a.left = bs(t, e, n, o), a.right = bs(t, e, o + 1, i), a;
  }
  return null;
}
function ru(t, e) {
  const n = new qe(null, null);
  let i = n;
  for (let s = 0; s < t.length; s++)
    i = i.next = new qe(t[s], e[s]);
  return i.next = null, n.next;
}
function lu(t) {
  let e = t;
  const n = [];
  let i = !1;
  const s = new qe(null, null);
  let o = s;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = o = o.next = n.pop(), e = e.right) : i = !0;
  return o.next = null, s.next;
}
function vs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const s = e + Math.floor(i / 2), o = vs(t, e, s), r = t.head;
    return r.left = o, t.head = t.head.next, r.right = vs(t, s + 1, n), r;
  }
  return null;
}
function au(t, e, n) {
  const i = new qe(null, null);
  let s = i, o = t, r = e;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function ws(t, e, n, i, s) {
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
  ws(t, e, n, l, s), ws(t, e, l + 1, i, s);
}
const Pe = 11102230246251565e-32, te = 134217729, cu = (3 + 8 * Pe) * Pe;
function Bi(t, e, n, i, s) {
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
function du(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function A(t) {
  return new Float64Array(t);
}
const uu = (3 + 16 * Pe) * Pe, pu = (2 + 12 * Pe) * Pe, hu = (9 + 64 * Pe) * Pe * Pe, ct = A(4), tr = A(8), nr = A(12), ir = A(16), se = A(4);
function fu(t, e, n, i, s, o, r) {
  let l, a, c, u, d, p, f, m, $, b, g, y, x, M, k, S, I, L;
  const N = t - s, H = n - s, z = e - o, V = i - o;
  M = N * V, p = te * N, f = p - (p - N), m = N - f, p = te * V, $ = p - (p - V), b = V - $, k = m * b - (M - f * $ - m * $ - f * b), S = z * H, p = te * z, f = p - (p - z), m = z - f, p = te * H, $ = p - (p - H), b = H - $, I = m * b - (S - f * $ - m * $ - f * b), g = k - I, d = k - g, ct[0] = k - (g + d) + (d - I), y = M + g, d = y - M, x = M - (y - d) + (g - d), g = x - S, d = x - g, ct[1] = x - (g + d) + (d - S), L = y + g, d = L - y, ct[2] = y - (L - d) + (g - d), ct[3] = L;
  let W = du(4, ct), Z = pu * r;
  if (W >= Z || -W >= Z || (d = t - N, l = t - (N + d) + (d - s), d = n - H, c = n - (H + d) + (d - s), d = e - z, a = e - (z + d) + (d - o), d = i - V, u = i - (V + d) + (d - o), l === 0 && a === 0 && c === 0 && u === 0) || (Z = hu * r + cu * Math.abs(W), W += N * u + V * l - (z * c + H * a), W >= Z || -W >= Z)) return W;
  M = l * V, p = te * l, f = p - (p - l), m = l - f, p = te * V, $ = p - (p - V), b = V - $, k = m * b - (M - f * $ - m * $ - f * b), S = a * H, p = te * a, f = p - (p - a), m = a - f, p = te * H, $ = p - (p - H), b = H - $, I = m * b - (S - f * $ - m * $ - f * b), g = k - I, d = k - g, se[0] = k - (g + d) + (d - I), y = M + g, d = y - M, x = M - (y - d) + (g - d), g = x - S, d = x - g, se[1] = x - (g + d) + (d - S), L = y + g, d = L - y, se[2] = y - (L - d) + (g - d), se[3] = L;
  const Q = Bi(4, ct, 4, se, tr);
  M = N * u, p = te * N, f = p - (p - N), m = N - f, p = te * u, $ = p - (p - u), b = u - $, k = m * b - (M - f * $ - m * $ - f * b), S = z * c, p = te * z, f = p - (p - z), m = z - f, p = te * c, $ = p - (p - c), b = c - $, I = m * b - (S - f * $ - m * $ - f * b), g = k - I, d = k - g, se[0] = k - (g + d) + (d - I), y = M + g, d = y - M, x = M - (y - d) + (g - d), g = x - S, d = x - g, se[1] = x - (g + d) + (d - S), L = y + g, d = L - y, se[2] = y - (L - d) + (g - d), se[3] = L;
  const T = Bi(Q, tr, 4, se, nr);
  M = l * u, p = te * l, f = p - (p - l), m = l - f, p = te * u, $ = p - (p - u), b = u - $, k = m * b - (M - f * $ - m * $ - f * b), S = a * c, p = te * a, f = p - (p - a), m = a - f, p = te * c, $ = p - (p - c), b = c - $, I = m * b - (S - f * $ - m * $ - f * b), g = k - I, d = k - g, se[0] = k - (g + d) + (d - I), y = M + g, d = y - M, x = M - (y - d) + (g - d), g = x - S, d = x - g, se[1] = x - (g + d) + (d - S), L = y + g, d = L - y, se[2] = y - (L - d) + (g - d), se[3] = L;
  const K = Bi(T, nr, 4, se, ir);
  return ir[K - 1];
}
function mu(t, e, n, i, s, o) {
  const r = (e - o) * (n - s), l = (t - s) * (i - o), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= uu * c ? a : -fu(t, e, n, i, s, o, c);
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
const Ot = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, $s = (t, e) => {
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
let Re = Number.EPSILON;
Re === void 0 && (Re = Math.pow(2, -52));
const gu = Re * Re, sr = (t, e) => {
  if (-Re < t && t < Re && -Re < e && e < Re)
    return 0;
  const n = t - e;
  return n * n < gu * t * e ? 0 : t < e ? -1 : 1;
};
class bu {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new or(), this.yRounder = new or();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class or {
  constructor() {
    this.tree = new eo(), this.round(0);
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
    if (i !== null && sr(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const s = this.tree.next(n);
    return s !== null && sr(n.key, s.key) === 0 ? (this.tree.remove(e), s.key) : e;
  }
}
const tn = new bu(), Dn = (t, e) => t.x * e.y - t.y * e.x, ta = (t, e) => t.x * e.x + t.y * e.y, rr = (t, e, n) => {
  const i = mu(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Wn = (t) => Math.sqrt(ta(t, t)), vu = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Dn(s, i) / Wn(s) / Wn(i);
}, wu = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, s = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return ta(s, i) / Wn(s) / Wn(i);
}, lr = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, ar = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, $u = (t, e, n, i) => {
  if (e.x === 0) return ar(n, i, t.x);
  if (i.x === 0) return ar(t, e, n.x);
  if (e.y === 0) return lr(n, i, t.y);
  if (i.y === 0) return lr(t, e, n.y);
  const s = Dn(e, i);
  if (s == 0) return null;
  const o = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = Dn(o, e) / s, l = Dn(o, i) / s, a = t.x + l * e.x, c = n.x + r * i.x, u = t.y + l * e.y, d = n.y + r * i.y, p = (a + c) / 2, f = (u + d) / 2;
  return {
    x: p,
    y: f
  };
};
class fe {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = fe.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : Fe.compare(e.segment, n.segment));
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
        sine: vu(this.point, e.point, o.point),
        cosine: wu(this.point, e.point, o.point)
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
let yu = 0;
class Fe {
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
    this.id = ++yu, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = s;
  }
  static fromRing(e, n, i) {
    let s, o, r;
    const l = fe.comparePoints(e, n);
    if (l < 0)
      s = e, o = n, r = 1;
    else if (l > 0)
      s = n, o = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new fe(s, !0), c = new fe(o, !1);
    return new Fe(a, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), s = $s(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = Ot(n, l) && this.comparePoint(l) === 0, u = Ot(i, o) && e.comparePoint(o) === 0, d = Ot(n, a) && this.comparePoint(a) === 0, p = Ot(i, r) && e.comparePoint(r) === 0;
    if (u && c)
      return p && !d ? r : !p && d ? a : null;
    if (u)
      return d && o.x === a.x && o.y === a.y ? null : o;
    if (c)
      return p && r.x === l.x && r.y === l.y ? null : l;
    if (p && d) return null;
    if (p) return r;
    if (d) return a;
    const f = $u(o, this.vector(), l, e.vector());
    return f === null || !Ot(s, f) ? null : tn.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, s = new fe(e, !0), o = new fe(e, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new Fe(s, r, this.rings.slice(), this.windings.slice());
    return fe.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), fe.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Fe.compare(n, i);
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
    switch (be.type) {
      case "union": {
        const i = e.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        e.length < n.length ? (i = e.length, s = n.length) : (i = n.length, s = e.length), this._isInResult = s === be.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${be.type}`);
    }
    return this._isInResult;
  }
}
class cr {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = tn.round(e[0][0], e[0][1]);
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
      let a = tn.round(e[r][0], e[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(Fe.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Fe.fromRing(o, s, this));
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
class xu {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new cr(e[0], this, !0), this.bbox = {
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
      const o = new cr(e[i], this, !1);
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
class dr {
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
      const o = new xu(e[i], this);
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
class jn {
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
            const $ = c[0].point, b = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${$.x}, ${$.y}]. Last matching segment found ends at [${b.x}, ${b.y}].`);
          }
          if (p.length === 1) {
            a = p[0].otherSE;
            break;
          }
          let f = null;
          for (let $ = 0, b = d.length; $ < b; $++)
            if (d[$].point === l.point) {
              f = $;
              break;
            }
          if (f !== null) {
            const $ = d.splice(f)[0], b = c.splice($.index);
            b.unshift(b[0].otherSE), n.push(new jn(b.reverse()));
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
      n.push(new jn(c));
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
      rr(d, e, p) !== 0 && (n.push(d), e = d);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    rr(i, e, s) === 0 && n.shift(), n.push(n[0]);
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
      fe.compare(e, r) > 0 && (e = r);
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
class ur {
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
class ku {
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
        if (o.isExteriorRing()) n.push(new ur(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new ur(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Mu {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Fe.compare;
    this.queue = e, this.tree = new eo(n), this.segments = [];
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
        c === null ? d = u : u === null ? d = c : d = fe.comparePoints(c, u) <= 0 ? c : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
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
const pr = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, _u = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Au {
  run(e, n, i) {
    be.type = e, tn.reset();
    const s = [new dr(n, !0)];
    for (let d = 0, p = i.length; d < p; d++)
      s.push(new dr(i[d], !1));
    if (be.numMultiPolys = s.length, be.type === "difference") {
      const d = s[0];
      let p = 1;
      for (; p < s.length; )
        $s(s[p].bbox, d.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (be.type === "intersection")
      for (let d = 0, p = s.length; d < p; d++) {
        const f = s[d];
        for (let m = d + 1, $ = s.length; m < $; m++)
          if ($s(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new eo(fe.compare);
    for (let d = 0, p = s.length; d < p; d++) {
      const f = s[d].getSweepEvents();
      for (let m = 0, $ = f.length; m < $; m++)
        if (o.insert(f[m]), o.size > pr)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Mu(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const d = a.key;
      if (o.size === l) {
        const f = d.segment;
        throw new Error(`Unable to pop() ${d.isLeft ? "left" : "right"} SweepEvent [${d.point.x}, ${d.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > pr)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > _u)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(d);
      for (let f = 0, m = p.length; f < m; f++) {
        const $ = p[f];
        $.consumedBy === void 0 && o.insert($);
      }
      l = o.size, a = o.pop();
    }
    tn.reset();
    const c = jn.factory(r.segments);
    return new ku(c).getGeom();
  }
}
const be = new Au(), Su = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return be.run("union", t, n);
}, Iu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return be.run("intersection", t, n);
}, Eu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return be.run("xor", t, n);
}, Cu = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return be.run("difference", t, n);
};
var na = {
  union: Su,
  intersection: Iu,
  xor: Eu,
  difference: Cu
};
const ia = 3, Lu = 1e-6;
function gi(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function X(t, e) {
  const n = gi(t, e);
  return { x: n.x, y: n.y };
}
function at(t, e) {
  const n = t.walls.find((o) => o.id === e);
  if (!n) return null;
  const i = t.nodes.find((o) => o.id === n.a), s = t.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : O(i, s);
}
function sa(t, e, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: t, b: e, dir: fi(C(e, t)), len: O(t, e), leftOff: o, rightOff: r };
}
function ie(t, e) {
  return sa(X(t, e.a), X(t, e.b), e.thickness, e.baseline);
}
function Ge(t, e) {
  const n = C(e, t.a);
  return { t: U(n, t.dir), side: U(n, ee(t.dir)) };
}
function hr(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: E(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const ht = (t) => D(t.p, E(ee(t.u), t.offL)), ft = (t) => C(t.p, E(ee(t.u), t.offR));
function Je(t, e, n) {
  return t !== null && O(t, e) <= n;
}
function Pu(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ie(t, n);
    if (i.len < 1e-9) continue;
    const s = ee(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: D(i.a, E(s, i.leftOff)),
        ar: C(i.a, E(s, i.rightOff)),
        bl: D(i.b, E(s, i.leftOff)),
        br: C(i.b, E(s, i.rightOff))
      }
    });
  }
  return e;
}
function Ou(t, e) {
  const n = e.f, i = ee(n.dir);
  for (const s of t) {
    if (s.body === e) continue;
    const r = U(C(s.far, n.a), i) >= 0 ? D(n.a, E(i, n.leftOff)) : C(n.a, E(i, n.rightOff)), l = ia * Math.max(s.body.wall.thickness, e.wall.thickness), a = xe(ht(s), s.u, r, n.dir), c = xe(ft(s), s.u, r, n.dir);
    Je(a, s.p, l) && (s.body.c[s.leftKey] = a), Je(c, s.p, l) && (s.body.c[s.rightKey] = c);
  }
}
function zu(t, e) {
  t.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = ia * Math.max(...t.map((s) => s.body.wall.thickness));
  for (let s = 0; s < t.length; s++) {
    const o = t[s], r = t[(s + 1) % t.length], l = xe(ft(o), o.u, ht(r), r.u);
    Je(l, e, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Du(t, e, n);
  for (const s of t) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = C(r, o), a = oe(l, C(e, o)), c = oe(l, C(s.far, o));
    a * c < 0 && ys(s, [e]);
  }
}
function ys(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Du(t, e, n) {
  const i = t.length;
  for (let s = 0; s < i; s++) {
    const o = t[s], r = t[(s + 1) % i];
    if (Math.abs(oe(o.u, r.u)) > 1e-9 || U(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(s + 2) % i], c = xe(ft(o), o.u, ht(a), a.u), u = xe(ht(r), r.u, ht(a), a.u);
        if (!Je(c, e, n) || !Je(u, e, n)) continue;
        const d = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = c, r.body.c[r.leftKey] = u, ys(o, [e, d, u]);
      } else {
        const a = t[(s - 1 + i) % i], c = xe(ht(r), r.u, ft(a), a.u), u = xe(ft(o), o.u, ft(a), a.u);
        if (!Je(u, e, n) || !Je(c, e, n)) continue;
        const d = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = c, ys(r, [u, d, e]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function to(t) {
  const e = Pu(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const s = [];
    for (const r of e)
      r.wall.a === i.id && s.push(hr(r, "a")), r.wall.b === i.id && s.push(hr(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? Ou(s, o) : s.length >= 2 && zu(s, { x: i.x, y: i.y });
  }
  return e;
}
function oa(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of to(t))
    for (const [s, o, r] of n) {
      const l = i.c[s];
      e.push({ pt: l, wallId: i.wall.id, side: o, end: r, offset: U(C(l, i.f.a), i.f.dir) });
    }
  return e;
}
function ra(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function bi(t) {
  return new Map(to(t).map((e) => [e.wall.id, ra(e)]));
}
function fr(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = t[(i + 1) % t.length], r = e(s), l = e(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(D(s, E(C(o, s), r / (r - l))));
  }
  return n;
}
function no(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of to(t)) {
    const s = ra(i), o = t.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && e(u)).sort((u, d) => u.offset - d.offset), r = (u) => U(C(u, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const u of o)
      l.push([a, u.offset]), a = Math.max(a, u.offset + u.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [u, d] of l) {
      if (d <= u) continue;
      let p = s;
      u > -1 / 0 && (p = fr(p, (f) => r(f) - u)), d < 1 / 0 && (p = fr(p, (f) => d - r(f))), p.length >= 3 && Math.abs(Ae(p)) > Lu && c.push(p);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const xs = (t) => [t.map((e) => [e.x, e.y])];
function la(t) {
  const e = t.map(([s, o]) => ({ x: s, y: o })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function aa(t, e) {
  return ca(e ? [...no(t).values()].flat() : [...bi(t).values()]);
}
function ca(t) {
  const e = t.map(xs);
  if (e.length === 0) return [];
  let n;
  try {
    n = na.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(la));
}
const yt = 1e-6, qn = ["door", "gate", "wicket"], da = (t) => t === "opening", ua = (t) => t.passesLight ?? da(t.kind), pa = (t) => t === "opening", ha = (t) => t.passesPir ?? pa(t.kind);
function fa(t, e) {
  return t.offset < e.offset + e.width - yt && e.offset < t.offset + t.width - yt;
}
function vi(t, e, n, i, s) {
  const o = at(t, e);
  return o === null || i <= 0 || n < -yt || n + i > o + yt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== s && fa(r, { offset: n, width: i }));
}
function At(t, e) {
  return { ...t, openings: e };
}
function Nu(t, e, n, i, s, o = {}) {
  const r = s ?? zn[n], l = i - r / 2;
  if (!vi(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: Y(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return qn.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: At(t, [...t.openings, a]), openingId: a.id };
}
function ma(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !vi(t, i.wallId, n, i.width, e) ? t : fn(At(t, t.openings.map((s) => s.id === e ? { ...s, offset: n } : s)));
}
function Tu(t, e, n) {
  const i = t.openings.find((s) => s.id === e);
  return !i || !vi(t, i.wallId, i.offset, n, e) ? t : fn(At(t, t.openings.map((s) => s.id === e ? { ...s, width: n } : s)));
}
function Vu(t, e) {
  return qn.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Hu(t, e, n) {
  if (!t.openings.some((s) => s.id === e)) return t;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return fn(At(t, t.openings.map((s) => s.id === e ? i(s) : s)));
}
function ga(t, e) {
  return fn(At(t, t.openings.filter((n) => n.id !== e)));
}
function fn(t) {
  return At(t, t.openings.map((e) => {
    const n = at(t, e.wallId), i = n === null || e.offset < -yt || e.offset + e.width > n + yt || t.openings.some((s) => s.id !== e.id && s.wallId === e.wallId && fa(e, s));
    return { ...e, invalid: i };
  }));
}
const Zn = 1e-6;
function ba(t, e) {
  return e.mode !== "none" && Js[t.kind].includes(e.mode);
}
function va(t, e, n) {
  if (n.mode === "none" || !ba(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -wt || i > wt)) return !1;
  const s = at(t, n.wallId);
  return s !== null && n.offset >= -Zn && n.offset <= s + Zn;
}
function De(t, e) {
  return { ...t, devices: e };
}
function mr(t, e, n, i) {
  if (!va(t, e, n)) return { level: t, deviceId: null };
  const s = { id: Y(), name: i, placement: n, props: e, invalid: !1 };
  return { level: De(t, [...t.devices, s]), deviceId: s.id };
}
function wa(t, e) {
  const n = { id: Y(), name: e, placement: { mode: "none" }, props: je("equipment", "free"), invalid: !1 };
  return { level: De(t, [...t.devices, n]), id: n.id };
}
const Ru = ["power", "power_in", "power_out", "voltage"];
function Bu(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Ru.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const St = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, $a = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function ya(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function xa(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = pi({ ...i, props: ya(i.props, "inverter", n), bindings: r });
  return De(t, t.devices.map((a) => a === i ? l : a));
}
function wi(t, e, n) {
  const i = t.devices.find((o) => o.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const s = { ...i, props: ya(i.props, "controllable", n) };
  return De(t, t.devices.map((o) => o === i ? s : o));
}
function ka(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = je("motion_sensor", en(e)), s = je("motion_sensor", en(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: s.zoneAngle } : t;
}
function Gn(t, e, n) {
  const i = t.devices, s = i.find((r) => r.id === e);
  if (!s || !va(t, s.props, n)) return t;
  const o = ka(s.props, s.placement.mode, n.mode);
  return Ma(De(t, i.map((r) => r.id === e ? { ...r, placement: n, props: o } : r)));
}
function mn(t, e, n, i) {
  const s = t.devices;
  return s.some((o) => o.id === e) ? De(t, s.map((o) => {
    if (o.id !== e) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return pi({ ...o, props: r, name: i ?? o.name });
  })) : t;
}
function Fu(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Kl(i.props.kind) || i.props.kind === n) return t;
  const s = je(n, en(i.placement.mode));
  if (!ba(s, i.placement)) return t;
  const o = pi({ ...i, props: s });
  return De(t, t.devices.map((r) => r === i ? o : r));
}
function Uu(t, e) {
  return De(t, t.devices.filter((n) => n.id !== e));
}
function Ma(t) {
  return De(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = at(t, e.placement.wallId), i = n === null || e.placement.offset < -Zn || e.placement.offset > n + Zn;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function _a(t) {
  const e = [];
  for (const n of aa(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function ks(t, e) {
  let n = null, i = 1 / 0;
  for (const s of t) {
    if (!$t(e, s)) continue;
    const o = Math.abs(Ae(s));
    o < i && (n = s, i = o);
  }
  return n;
}
const Fi = 1e-3;
function Aa(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Ae(t)) - Math.abs(Ae(e))) > Fi ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= Fi && Math.abs(n.y - i.y) <= Fi));
}
const Sa = 2, gr = Math.ceil(360 / Sa), br = 1e-4, Wu = 1e-9, vr = 1e-9, ju = {
  light: ua,
  motion: ha
};
function Ia(t, e) {
  const n = [];
  for (const i of ca([...no(t, ju[e]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function io(t, e, n) {
  return e.filter(([i, s]) => _e(t, i, s) <= n);
}
function Ui(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function qu(t, e, n) {
  const i = io(t, e, n), s = [];
  for (let b = 0; b < gr; b++) s.push(-Math.PI + 2 * Math.PI * b / gr);
  const o = n * 1.05;
  for (const b of i)
    for (const g of b) {
      if (O(t, g) > o) continue;
      const y = Math.atan2(g.y - t.y, g.x - t.x);
      s.push(Ui(y - br), Ui(y), Ui(y + br));
    }
  s.sort((b, g) => b - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([b, g], y) => {
    l[y] = b.x - t.x, a[y] = b.y - t.y, c[y] = g.x - b.x, u[y] = g.y - b.y;
  });
  const d = [], p = [];
  let f = NaN;
  for (const b of s) {
    if (b === f) continue;
    f = b;
    const g = Math.cos(b), y = Math.sin(b);
    let x = n, M = -1;
    for (let I = 0; I < r; I++) {
      const L = g * u[I] - y * c[I];
      if (Math.abs(L) < 1e-12) continue;
      const N = (l[I] * u[I] - a[I] * c[I]) / L;
      if (!(N > Wu && N < x)) continue;
      const H = (l[I] * y - a[I] * g) / L;
      H < -vr || H > 1 + vr || (x = N, M = I);
    }
    const k = { x: t.x + g * x, y: t.y + y * x }, S = d.length;
    if (!(S > 0 && d[S - 1].x === k.x && d[S - 1].y === k.y)) {
      if (M >= 0 && S >= 2 && p[S - 1] === M && p[S - 2] === M) {
        d[S - 1] = k;
        continue;
      }
      d.push(k), p.push(M);
    }
  }
  const m = d[0], $ = d[d.length - 1];
  return d.length > 1 && m.x === $.x && m.y === $.y && d.pop(), d;
}
const Zu = 32, wr = 128;
function Kn(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function Oe(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function so(t) {
  return (t % 360 + 360) % 360;
}
function Ea(t) {
  return (t % 360 + 540) % 360 - 180;
}
function Ca(t, e, n, i) {
  const s = t.walls.find((c) => c.id === e);
  if (!s) return null;
  let o;
  try {
    o = ie(t, s);
  } catch {
    return null;
  }
  const r = ee(o.dir), l = n === "left" ? r : E(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: D(D(o.a, E(o.dir, i)), E(l, a)), normal: l };
}
function nn(t, e, n, i) {
  var s;
  return ((s = Ca(t, e, n, i)) == null ? void 0 : s.pt) ?? null;
}
function ne(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Kn(n.rotation) };
  const i = Ca(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = e.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: D(i.pt, E(s, r)), dir: ee(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? Kn(Oe(s) + n.aim) : s, normal: s };
}
function $r(t, e, n, i, s, o) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let c;
    try {
      c = ie(t, a);
    } catch {
      continue;
    }
    const u = a.a === n ? c.dir : E(c.dir, -1);
    if (Math.abs(oe(i, u)) < 1e-9 && U(i, u) < 0) {
      if ((U(ee(c.dir), s) > 0 ? c.leftOff : c.rightOff) > o + 1e-6) return !1;
      l = !0;
    } else if (U(u, s) > 1e-9) return !1;
  }
  return l;
}
function oo(t, e, n, i) {
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
  const r = oa(t), l = r.filter((z) => z.wallId === n.wallId && z.side === n.side), a = l.find((z) => z.end === "a"), c = l.find((z) => z.end === "b");
  if (!a || !c) return n;
  const u = ee(o.dir), d = n.side === "left" ? u : E(u, -1), p = n.side === "left" ? o.leftOff : o.rightOff, f = $r(t, s, s.a, o.dir, d, p) ? -1 / 0 : a.offset, m = $r(t, s, s.b, E(o.dir, -1), d, p) ? 1 / 0 : c.offset, $ = (z) => U(C(z, o.a), o.dir), b = [];
  for (const z of t.nodes)
    if (((H = z.host) == null ? void 0 : H.wallId) === s.id)
      for (const V of t.walls) {
        const W = V.a === z.id ? "a" : V.b === z.id ? "b" : null, Z = W && t.nodes.find((T) => T.id === (W === "a" ? V.b : V.a));
        if (!Z || (U(C(Z, o.a), u) >= 0 ? "left" : "right") !== n.side) continue;
        const Q = r.filter((T) => T.wallId === V.id && T.end === W).map((T) => $(T.pt));
        Q.length && b.push([Math.min(...Q), Math.max(...Q)]);
      }
  b.sort((z, V) => z[0] - V[0]);
  const g = [];
  let y = f;
  for (const [z, V] of b) {
    const W = Math.min(z, m);
    W > y && g.push([y, W]), y = Math.max(y, V);
  }
  m > y && g.push([y, m]), g.length === 0 && g.push([f, m]);
  const x = ([z, V]) => Math.max(0, z - n.offset, n.offset - V), [M, k] = g.reduce((z, V) => x(V) < x(z) ? V : z), S = (e.shape === "circle" ? e.diameter : e.width) / 2, I = M + S, L = k - S;
  let N = n.offset;
  return I > L ? N = (M + k) / 2 : N <= I + i ? N = I : N >= L - i && (N = L), N = Math.max(0, Math.min(o.len, N)), Math.abs(N - n.offset) < 1e-9 ? n : { ...n, offset: N };
}
function La(t, e) {
  const n = [];
  for (let i = 0; i < wr; i++) n.push(D(t, E(Kn(360 * i / wr), e)));
  return n;
}
function yr(t, e, n, i) {
  if (n >= 360) return La(t, i);
  const s = Math.max(1, Math.ceil(n / 90 * Zu)), o = Oe(e) - n / 2, r = [t];
  for (let l = 0; l <= s; l++) r.push(D(t, E(Kn(o + n * l / s), i)));
  return r;
}
const Gu = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function $i(t) {
  return Gu[t] ?? null;
}
const Ku = (t) => $i(t.kind) !== null;
function Xu(t, e) {
  const n = e.props;
  if (!Ku(n)) return null;
  const i = ne(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? yr(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? yr(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? La(i.pt, n.poolRadius) : null;
  }
}
function Yu(t) {
  return t.normal ? D(t.pt, t.normal) : t.pt;
}
function xr(t, e) {
  let n = !1;
  for (const [i, s] of e)
    i.y > t.y != s.y > t.y && t.x < i.x + (t.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Qu(t, e, n) {
  const i = C(e, t);
  for (const [s, o] of n) {
    const r = C(o, s), l = C(s, t), a = oe(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = oe(l, r) / a, u = oe(l, i) / a;
    if (c >= 0 && c <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const kr = 0.5, Ju = 3, ep = 1e-4;
function tp(t, e, n) {
  const i = ne(t, e);
  if (!i) return null;
  const s = Yu(i), o = e.placement;
  if (o.mode !== "wall") return s;
  const r = (k) => xr(k, n) || io(k, n, kr).length > 0;
  if (!r(s)) return s;
  const l = ie(t, t.walls.find((k) => k.id === o.wallId)), a = i.normal, c = (k) => Math.abs(U(C(k, i.pt), a)) <= ep, u = ([k, S]) => E(D(k, S), 0.5), d = n.filter((k) => c(k[0]) && c(k[1]) && O(k[0], k[1]) > 1e-9 && !xr(D(u(k), E(a, kr)), n)), p = (k) => U(C(k, l.a), l.dir), f = ([k, S]) => Math.max(0, Math.min(p(k), p(S)) - o.offset, o.offset - Math.max(p(k), p(S))), m = Math.min(...d.map(f)), $ = d.filter((k) => f(k) <= m + 1e-6).map((k) => D(u(k), a)), b = (k) => $.some((S) => !Qu(k, S, n)), g = Ju * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, S] of n) {
    const I = C(S, k), L = C(k, s), N = oe(l.dir, I);
    if (Math.abs(N) < 1e-12) continue;
    const H = oe(L, l.dir) / N;
    if (H < -1e-9 || H > 1 + 1e-9) continue;
    const z = oe(L, I) / N, V = O(k, S) / Math.abs(N);
    y.push(z - V, z + V);
  }
  const x = o.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= g).sort((k, S) => Math.abs(k) - Math.abs(S) || Math.sign(S) * x - Math.sign(k) * x);
  for (const k of M) {
    const S = D(s, E(l.dir, k));
    if (!r(S) && b(S)) return S;
  }
  return null;
}
const np = 1 / Math.cos(Sa / 2 * (Math.PI / 180)), Mr = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function ip(t, e, n = Ia) {
  const i = Xu(t, e), s = $i(e.props.kind);
  if (!i || !s) return [];
  const o = n(t, s), r = tp(t, e, o);
  if (!r) return [];
  const l = Math.max(...i.map((d) => O(d, r))) * np, a = io(r, o, l);
  if (a.length === 0) return [i];
  const c = qu(r, a, l);
  let u;
  try {
    u = na.intersection(xs(Mr(i)), xs(Mr(c)));
  } catch {
    return [c];
  }
  return u.flatMap((d) => d.map(la));
}
function sp(t, e, n, i) {
  const s = ne(t, e);
  if (!s) return !1;
  const o = e.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, U(C(n, s.pt), s.dir)));
    return O(D(s.pt, E(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return O(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return O(s.pt, n) <= i;
  if (o.shape === "circle") return O(s.pt, n) <= o.diameter / 2 + i;
  const r = C(n, s.pt);
  return Math.abs(U(r, s.dir)) <= o.width / 2 + i && Math.abs(U(r, ee(s.dir))) <= o.depth / 2 + i;
}
function Pa(t, e, n) {
  const i = t.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && sp(t, i[o], e, n)) return i[o].id;
  return null;
}
const op = 60;
function Ms(t, e, n) {
  if (!Yl.has(e.props.kind)) return null;
  const i = ne(t, e);
  return i ? { from: i.pt, to: D(i.pt, E(i.dir, op / n)) } : null;
}
function Oa(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function rp(t, e, n, i) {
  const s = e.placement, o = ne(t, e);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = Oe(C(n, o.pt)), l = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: so(l(r)) };
  const a = Ea(r - Oe(o.normal)), c = Math.max(-wt, Math.min(wt, l(a)));
  return Oa(s, c);
}
const lp = 1, Xn = 1, _r = 1e-6, ap = 1e-9, cp = 1e-6, dp = 1;
function ro(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = at(t, e.wallId);
      return n === null ? null : nn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function re(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => ro(t, i) ?? { x: i.x, y: i.y });
}
function lo(t, e) {
  const n = re(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Ae(n)) / 1e5) / 10;
}
function Bt(t, e, n) {
  const i = oe(C(e, t), C(n, t));
  return Math.abs(i) <= ap * O(t, e) * O(t, n) ? 0 : Math.sign(i);
}
const $n = (t, e, n) => U(C(e, t), C(n, t)) <= 0;
function za(t, e, n, i) {
  const s = Bt(n, i, t), o = Bt(n, i, e), r = Bt(t, e, n), l = Bt(t, e, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && $n(n, t, e) || l === 0 && $n(i, t, e) || s === 0 && $n(t, n, i) || o === 0 && $n(e, n, i);
}
function up(t) {
  const e = [];
  for (const n of t) (e.length === 0 || O(e[e.length - 1], n) > _r) && e.push(n);
  for (; e.length > 1 && O(e[0], e[e.length - 1]) <= _r; ) e.pop();
  return e;
}
function Yn(t) {
  const e = up(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = e[i], o = e[(i + 1) % n], r = e[(i + 2) % n];
    if (Bt(s, o, r) === 0 && U(C(o, s), C(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && za(s, o, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function Da(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : ro(t, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = at(t, o.wallId);
    return r !== null && (o.offset < -Xn || o.offset > r + Xn);
  };
  if (n.vertices.some(i)) return "beyond";
  const s = re(t, e);
  return Math.abs(Ae(s)) < dp || Yn(s) ? "crossing" : null;
}
function It(t, e) {
  return $t(e, t) || t.some((n, i) => _e(e, n, t[(i + 1) % t.length]) <= lp);
}
const Na = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function pp(t, e) {
  const n = ne(t, e);
  return n ? t.zones.filter((i) => It(re(t, i), n.pt)).map((i) => ({ zone: i, participates: Na(e, i.id) })) : [];
}
function Et(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n) return [];
  const i = re(t, n), s = [];
  for (const o of t.devices) {
    const r = ne(t, o);
    r && It(i, r.pt) && s.push({ device: o, participates: Na(o, e) });
  }
  return s;
}
function hp(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Ae(t);
  if (Math.abs(n) > cp) {
    let i = 0, s = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, s += (l.y + a.y) * c;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if ($t(o, t)) return o;
  }
  return {
    x: t.reduce((i, s) => i + s.x, 0) / e,
    y: t.reduce((i, s) => i + s.y, 0) / e
  };
}
const Wi = 32;
function Ar(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let s = 0; s < i.length; s++) n = Math.min(n, _e(t, i[s], i[(s + 1) % i.length]));
  return n;
}
function Ta(t) {
  const e = t.zones.map((s) => re(t, s)), n = e.map((s) => Math.abs(Ae(s))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((s, o) => {
    const r = e[o];
    if (r.length < 3) return;
    const l = e.filter(($, b) => b !== o && $.length >= 3 && n[b] < n[o] && $.every((g) => It(r, g))), a = hp(r);
    if (l.length === 0) {
      i.set(s.id, a);
      return;
    }
    const c = r.map(($) => $.x), u = r.map(($) => $.y), d = Math.min(...c), p = Math.min(...u), f = Math.max(Math.max(...c) - d, Math.max(...u) - p) / Wi;
    let m = null;
    for (let $ = d + f / 2; $ < d + f * Wi; $ += f)
      for (let b = p + f / 2; b < p + f * Wi; b += f) {
        const g = { x: $, y: b };
        if (!$t(g, r) || l.some((x) => $t(g, x))) continue;
        const y = Math.min(Ar(g, [r]), Ar(g, l));
        (!m || y > m.d) && (m = { p: g, d: y });
      }
    i.set(s.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const ao = 3, xt = (t, e) => ({ ...t, zones: e }), sn = (t, e, n) => xt(t, t.zones.map((i) => i === e ? n : i)), co = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), Va = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function fp(t, e) {
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
function mp(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && Va(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => fp(n, e.vertices[i]));
}
function Ha(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && mp(t.shape, e.shape);
}
function gp(t, e) {
  if (e.kind === "free") return e;
  const n = ro(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : co(e);
}
function Ra(t, e) {
  const n = e.shape, i = n.vertices.map((s) => gp(t, s));
  return i.some((s, o) => s !== n.vertices[o]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function bp(t, e, n) {
  const i = t.shape, s = ks(e, i.seed);
  return !s || n.some((o) => Aa(o, s)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(s), !i.broken && Va(s, i.outline) ? t : { ...t, shape: { ...i, outline: s, broken: !1 } });
}
function Ba(t, e) {
  const n = Da(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const uo = (t, e) => Ba(t, Ra(t, e));
function vp(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((o) => o.shape.kind === "walls") ? _a(t) : [], i = [], s = e.map((o) => Ba(
    t,
    o.shape.kind === "walls" ? bp(o, n, i) : Ra(t, o)
  ));
  return s.some((o, r) => o !== e[r]) ? xt(t, s) : t;
}
function wp(t, e) {
  const n = t.zones, i = e.zones, s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && Ha(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? n === i ? t : xt(t, i) : s.some((o, r) => o !== n[r]) ? xt(t, s) : t;
}
function $p(t, e, n) {
  const i = _a(t), s = ks(i, e);
  if (!s) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = ks(i, r.shape.seed);
    if (l && Aa(l, s)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const o = { id: Y(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: s, broken: !1 }, invalid: !1 };
  return { level: xt(t, [...t.zones, o]), zoneId: o.id, existing: !1 };
}
const po = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function yp(t, e, n) {
  if (e.length < ao) return { level: t, zoneId: null };
  const i = uo(t, { id: Y(), name: n, shape: { kind: "polygon", vertices: e.map(po) }, invalid: !1 });
  return Yn(re(t, i)) ? { level: t, zoneId: null } : { level: xt(t, [...t.zones, i]), zoneId: i.id };
}
function xp(t, e, n) {
  const i = t.zones.find((s) => s.id === e);
  return !i || i.name === n ? t : sn(t, i, { ...i, name: n });
}
function ho(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return sn(t, i, { ...i, automation: !1 });
  const { automation: s, ...o } = i;
  return sn(t, i, o);
}
function Fa(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Ua(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var s;
    return (s = i.zoneBlacklist) != null && s.includes(e) ? Fa(i, i.zoneBlacklist.filter((o) => o !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, s) => i !== t.devices[s]) ? n : t.devices
  };
}
function fo(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function mo(t, e, n) {
  const i = uo(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return Ha(i, e) ? t : sn(t, e, i);
}
const go = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function kp(t, e, n, i) {
  const s = fo(t, e);
  return !s || !go(n, s.shape.vertices.length) ? t : mo(t, s, s.shape.vertices.map((o, r) => r === n ? po(i) : o));
}
function Mp(t, e, n, i) {
  const s = fo(t, e);
  if (!s || !go(n, s.shape.vertices.length + 1)) return t;
  const o = [...s.shape.vertices];
  return o.splice(n, 0, po(i)), mo(t, s, o);
}
function _p(t, e, n) {
  const i = fo(t, e);
  return !i || i.shape.vertices.length <= ao || !go(n, i.shape.vertices.length) ? t : mo(t, i, i.shape.vertices.filter((s, o) => o !== n));
}
function Ap(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < ao) return t;
  const i = n.shape.outline.map(co);
  return sn(t, n, uo(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Wa(t, e, n, i) {
  const s = t.devices.find((l) => l.id === e);
  if (!s) return t;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Fa(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...t, devices: t.devices.map((l) => l === s ? r : l) };
}
const on = 1;
function Ee(t) {
  return structuredClone(t);
}
function yi(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Sp(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function xi(t, e, n) {
  const i = X(t, e.a), s = X(t, e.b), o = O(i, s), r = Sp(typeof n == "number" ? n : mi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : ea(i, s, r / o), offset: r };
}
function Ip(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const s = t.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = xi(t, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function ja(t, e) {
  Ip(t), e && Pp(e, t);
  const n = vp(Ma(fn(t)));
  return e ? wp(n, e) : n;
}
function Ne(t, e) {
  return ja(Ee(t), e);
}
function qa(t, e, n) {
  const i = gi(t, e), s = i.host && t.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = xi(t, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Sr(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: X(t, e.nodeId), nodeId: e.nodeId };
  const n = yi(t, e.wallId), { pt: i, offset: s } = xi(t, n, e.offset), o = O(X(t, n.a), X(t, n.b));
  return s <= on ? { pt: X(t, n.a), nodeId: n.a } : o - s <= on ? { pt: X(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: s } };
}
function Ir(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: Y(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Ep(t, e, n, i) {
  const s = Sr(t, e), o = Sr(t, n);
  if (O(s.pt, o.pt) < on) return { level: t, wallId: null, endNodeId: null };
  const r = Ee(t), l = Ir(r, s), a = Ir(r, o);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: Y(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Ne(r, t), wallId: c.id, endNodeId: a };
}
function Za(t, e, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(t.x, e.x) - s, r = Math.max(t.x, e.x) + s, l = Math.min(t.y, e.y) - s, a = Math.max(t.y, e.y) + s;
  return r - o < on || a - l < on ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function Cp(t, e, n, i, s) {
  const o = Za(e, n, i.thickness, s);
  if (!o) return t;
  const r = Ee(t), l = o.map((a) => {
    const c = { id: Y(), x: a.x, y: a.y };
    return r.nodes.push(c), c.id;
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
  return Ne(r, t);
}
function Lp(t, e, n) {
  const i = Ee(t);
  return qa(i, e, n), ja(i, t);
}
function Pp(t, e) {
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
    const c = O(l, a);
    if (c === 0) continue;
    const u = fi(C(r, o));
    for (const d of n)
      d.wallId === i.id && (d.offset = mi(D(o, E(u, d.offset)), l, a) * c);
  }
}
function Op(t, e, n) {
  const i = Ee(t), s = yi(i, e), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: D(X(i, l), n) }));
  for (const l of r) qa(i, l.id, l.to);
  return Ne(i, t);
}
function ki(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Ga(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === e && (s.nodeId = n);
}
function zp(t, e, n) {
  const i = Ee(t), s = yi(i, e), o = s[n], r = X(i, o), l = { id: Y(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || Ga(i, o, l.id), ki(i), { level: Ne(i, t), nodeId: l.id };
}
function Dp(t, e, n) {
  if (e === n) return t;
  const i = Ee(t);
  for (const o of i.walls)
    o.a === e && (o.a = n), o.b === e && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Ga(i, e, n), i.nodes = i.nodes.filter((o) => o.id !== e), ki(i), Ne(i, t);
}
function bo(t, e) {
  var i;
  const n = Ee(t);
  n.walls = n.walls.filter((s) => s.id !== e), n.openings = n.openings.filter((s) => s.wallId !== e), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== e);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === e && delete s.host;
  return ki(n), Ne(n, t);
}
function Np(t, e, n) {
  const i = Ee(t);
  return Object.assign(yi(i, e), n), Ne(i, t);
}
const he = (t) => typeof t == "string" && t !== "" ? t : null, Ka = (t) => t.split(".")[0], Tp = ["friendly_name", "device_class", "unit_of_measurement"];
function Xa(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: Ka(t),
    name: he(n.friendly_name) ?? t,
    deviceClass: he(n.device_class),
    unit: he(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Vp(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Xa(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Hp(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const s = t[i], o = e[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && Tp.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function Ya(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Rp(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Xa(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: he(r.name) ?? he(r.original_name) ?? l.name,
      deviceId: he(r.device_id),
      areaId: he(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: he(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: he(r.name_by_user) ?? he(r.name) ?? r.id, model: he(r.model), areaId: he(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function Bp(t, e) {
  const n = new Map(e.entities);
  for (const [i, s] of t.entities) {
    const o = e.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Qa(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Ya(n, e);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Fp = {
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
  "rules.template.boiler": "Cost effective boiler",
  "rules.automations": "Automations",
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
function h(t) {
  return Fp[t] ?? t;
}
const Up = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Wp = 10;
function Ct(t, e) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return St(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function Ja() {
  return { blocks: [{ id: Y(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function jp(t, e, n, i) {
  const s = { id: Y(), x: e.x, y: e.y }, o = { ...s, name: `${h(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function Er(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function Mi(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function qp(t, e, n, i) {
  return Mi(t, e, (s) => ({ ...s, x: n, y: i }));
}
const _s = (t) => "block" in t ? t.block : t.bus, ec = (t, e) => _s(t.from) === e || _s(t.to) === e;
function rn(t, e, n, i) {
  const s = t.blocks.find((c) => c.id === e);
  if (!s) return t;
  const o = Mi(t, e, (c) => ({ ...c, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((c) => !ec(c, e)) };
  const r = o.blocks.find((c) => c.id === e), l = new Set(Ct(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return o.wires.some((c) => a(c.from) || a(c.to)) ? { ...o, wires: o.wires.filter((c) => !a(c.from) && !a(c.to)) } : o;
}
function tc(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !ec(i, e)) };
}
const nc = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function _i(t, e, n) {
  const i = nc(t, e);
  if (i.size === 0) return t;
  const s = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(Ct(c, n).map((u) => u.name))])), o = (c) => "block" in c && !!s.get(c.block) && !s.get(c.block).has(c.port), r = t.wires.filter((c) => !o(c.from) && !o(c.to));
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
function Zp(t, e) {
  const n = vo(e), i = new Set(t.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = t;
  for (const o of i) s = _i(s, o, n);
  return s;
}
function Gp(t, e) {
  const n = nc(t, e);
  if (n.size === 0) return t;
  const i = (s) => n.has(_s(s));
  return {
    ...t,
    blocks: t.blocks.filter((s) => !n.has(s.id)),
    wires: t.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const vo = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function ic(t, e, n) {
  var o;
  const i = ((o = t.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = Uu(t, n);
  return { level: s, power: i ? Gp(e, n) : _i(e, n, vo(s)) };
}
function sc(t, e, n, i) {
  const s = xa(t, n, i);
  return { level: s, power: s === t ? e : _i(e, n, vo(s)) };
}
function oc(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Kp(t, e, n, i) {
  return Mi(t, e, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function Xp(t, e) {
  return Mi(t, e, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function Cr(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Yp(t, e) {
  const n = t.filter((o) => o.kind === "transfer"), i = n.slice(0, Wp), s = /* @__PURE__ */ new Map();
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
function Lr(t, e, n, i) {
  const s = new Map(t.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const M = s.get(g.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = s.get(g.block), x = y ? Ct(y, i).find((M) => M.name === g.port) : void 0;
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
  const u = (g) => "block" in g && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === g.block && x.port === g.port));
  if (u(a) || u(c)) return { error: "port-taken" };
  const d = (g) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === g && "block" in M) {
          const k = s.get(M.block);
          if (k) return Cr(k, M.port);
        }
    return null;
  }, p = (g) => "bus" in g ? d(g.bus) : Cr(s.get(g.block), g.port), f = p(a), m = p(c);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && s.get(c.block).kind === "remainder" && t.wires.some((g) => {
    var y;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && ((y = s.get(g.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const $ = { id: Y(), from: a, to: c }, b = [...t.wires, $];
  return Yp(t.blocks, b) ? { error: "loop" } : { schema: { ...t, wires: b }, wire: $ };
}
const Ce = (t) => typeof t == "object" && t !== null && !Array.isArray(t), bt = (t) => typeof t == "number" && Number.isFinite(t), Qp = ["top", "right", "bottom", "left"], Jp = ["2in1out", "1in2out"];
function eh(t, e) {
  let n = t;
  if (n.kind === "bus" && !(bt(n.w) && bt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Jp.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(Ct(n, e).map((c) => c.name)), o = {};
  let r = Ce(i);
  for (const [c, u] of Ce(i) ? Object.entries(i) : []) {
    if (!s.has(c) || !Ce(u) || !Qp.includes(u.side) || !bt(u.at)) {
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
function th(t, e) {
  if (!Ce(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let s = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (Ce(u) && typeof u.id == "string" && u.id && Up.includes(u.kind) && bt(u.x) && bt(u.y)) {
      const d = eh(u, e);
      d !== u && (s = !0), d.kind === "transfer" && d.form !== u.form && r.add(d.id), o.push(d);
    } else s = !0;
  const l = new Map(o.map((u) => [u.id, u])), a = (u) => {
    var p;
    if (!Ce(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = l.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !bt(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const d = typeof u.block == "string" ? l.get(u.block) : void 0;
    return d && !r.has(d.id) && Ct(d, e).some((f) => f.name === u.port) ? u : null;
  }, c = [];
  for (const u of i) {
    const d = Ce(u) ? a(u.from) : null, p = Ce(u) ? a(u.to) : null;
    if (!Ce(u) || typeof u.id != "string" || !u.id || !d || !p) {
      s = !0;
      continue;
    }
    d === u.from && p === u.to ? c.push(u) : (s = !0, c.push({ ...u, from: d, to: p }));
  }
  return s ? { ...t, blocks: o, wires: c } : t;
}
function rc(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function nh(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const gn = 11, Qn = 18, Jn = 30, ih = 12, sh = 120, de = 14, Pr = 10, ln = (t) => Math.round(t / Pr) * Pr || 0, ji = 24, Or = 6, oh = 2 * gn + 6, rh = de, lh = 1e6, zr = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Ai = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), qi = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, lc = (t) => Math.min(1, Math.max(0, t));
function Si(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function ah(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = St(i);
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
function Se(t, e, n) {
  return n ? yo(n, t, e).r : wo(t, e);
}
function wo(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(sh, 7 * Si(t, e).length + 32),
    h: Jn + Qn * ah(t, e) + ih
  };
}
function ei(t, e, n) {
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
function ch(t, e) {
  const n = Ai(t), i = e.x - n.x, s = e.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(s) / (t.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function dh(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = _e(e, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: lc(r) };
}
const an = (t) => t.w >= t.h;
function ac(t, e) {
  return an(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function uh(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = an(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: ei(i, r, 0.5), side: r };
  }
  const s = Ai(i), o = an(t) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: ei(i, o, e), side: o };
}
function ph(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const $o = (t, e) => t.blocks.find((n) => n.id === e), As = (t, e) => {
  const n = $o(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Zi = (t, e, n) => "block" in t && t.block === e && t.port === n;
function hh(t, e, n, i) {
  const s = t.wires.find((l) => Zi(l.from, e, n) || Zi(l.to, e, n));
  if (!s) return null;
  const o = Zi(s.from, e, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = As(t, o.bus);
    return l ? ac(l, o.at) : null;
  }
  const r = $o(t, o.block);
  return r ? Ai(wo(r, i)) : null;
}
function yo(t, e, n) {
  const i = wo(e, n), s = Ai(i), o = Ct(e, n).map((c) => {
    var m;
    const u = (m = e.portPins) == null ? void 0 : m[c.name];
    if (u) return { ...c, side: u.side, pin: u, key: 0 };
    const d = hh(t, e.id, c.name, n), p = (d && ch(i, d)) ?? ph(e, c), f = d ?? s;
    return { ...c, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const u = o.filter((d) => d.side === c).length;
    return u ? (u + 1) * oh : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((c, u) => {
    c.pin && (a[u] = { name: c.name, dir: c.dir, side: c.side, pt: ei(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const u = o.map((d, p) => ({ p: d, i: p })).filter(({ p: d }) => !d.pin && d.side === c).sort((d, p) => d.p.key - p.p.key || d.i - p.i);
    u.forEach(({ p: d, i: p }, f) => {
      a[p] = { name: d.name, dir: d.dir, side: c, pt: ei(l, c, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function Ii(t, e, n) {
  return yo(t, e, n).places;
}
function cc(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const u = $o(t, c.block);
    if (!u) return null;
    const { r: d, places: p } = yo(t, u, n), f = p.find((m) => m.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: d } : null;
  }, s = (c, u, d) => {
    if (!("bus" in c)) return null;
    const p = As(t, c.bus);
    if (!p) return null;
    let f = d == null ? void 0 : d.pt;
    if (!f && "bus" in u) {
      const m = As(t, u.bus);
      f = m && ac(m, u.at);
    }
    return f ? { ...uh(p, c.at, f), rect: Se(p, n, t) } : null;
  }, o = i(e.from), r = i(e.to), l = o ?? s(e.from, e.to, r), a = r ?? s(e.to, e.from, o);
  return l && a ? { a: l, b: a } : null;
}
const yn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Ss = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function fh(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = yn(i[i.length - 2], a), u = yn(a, l);
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
  const o = yn(i[0], i[1]), r = yn(i[s - 2], i[s - 1]);
  return o.x !== e.x || o.y !== e.y || Ss(i[0], i[1]) < de - 1e-9 || r.x !== -n.x || r.y !== -n.y || Ss(i[s - 2], i[s - 1]) < de - 1e-9 ? null : i;
}
function mh(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function gh(t, e) {
  let n = (t.length - 2) * rh;
  for (let i = 1; i < t.length; i++) {
    n += Ss(t[i - 1], t[i]);
    for (const s of e) mh(t[i - 1], t[i], s) && (n += lh);
  }
  return n;
}
function dc(t, e) {
  const n = t.pt, i = e.pt, s = zr[t.side], o = zr[e.side], r = { x: n.x + s.x * de, y: n.y + s.y * de }, l = { x: i.x + o.x * de, y: i.y + o.y * de }, a = [t.rect, e.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - de, k[x] + k[M] + de]),
    Math.min(r[x], l[x]) - de,
    Math.max(r[x], l[x]) + de
  ])], u = c("x", "w"), d = c("y", "h"), p = s.x === 0, f = o.x === 0, m = (p ? d : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= de - 1e-9), $ = (f ? d : u).filter((x) => (x - (f ? i.y : i.x)) * (f ? o.y : o.x) >= de - 1e-9);
  let b = null, g = 1 / 0;
  const y = (x) => {
    const M = fh(x, s, o);
    if (!M) return;
    const k = gh(M, a);
    k < g - 1e-6 && (b = M, g = k);
  };
  if (p && f)
    for (const x of m) for (const M of u) for (const k of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!p && !f)
    for (const x of m) for (const M of d) for (const k of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const M of $)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of $)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return b ?? [n, r, p ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function uc(t, e, n) {
  const i = Se(t, e, n), s = i.x + (i.w - (3 * ji + 2 * Or)) / 2, o = i.y + Jn + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (ji + Or), y: o, w: ji, h: Qn - 2 }
  }));
}
function bh(t) {
  const { x: e, y: n, w: i, h: s } = t;
  return an(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + s } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + s } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + s }, b: { x: e + i, y: n + s } }];
}
function Dr(t, e, n, i) {
  const s = [...t.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const d = uc(u, i, t).find((p) => qi(e, p.rect, 0));
    if (d) return { kind: "chip", block: u.id, position: d.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const d of Ii(t, u, i)) {
      const p = O(e, d.pt);
      p <= gn + n && p < r && (o = { kind: "port", block: u.id, port: d.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let d = null, p = 1 / 0;
    for (const f of bh(u)) {
      const m = _e(e, f.a, f.b);
      m <= n && m < p && (d = { kind: "bus-end", id: u.id, end: f.end }, p = m);
    }
    if (d) return d;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !qi(e, Se(u, i, t), n)) continue;
    const d = an(u) ? (e.x - u.x) / u.w : (e.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: lc(d) };
  }
  let l = null, a = 1 / 0;
  for (const u of t.wires) {
    const d = cc(t, u, i);
    if (!d) continue;
    const p = dc(d.a, d.b);
    for (let f = 1; f < p.length; f++) {
      const m = _e(e, p[f - 1], p[f]);
      m <= n && m < a && (l = { kind: "wire", id: u.id }, a = m);
    }
  }
  if (l) return l;
  const c = s.find((u) => u.kind !== "bus" && qi(e, Se(u, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function vh(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of t.blocks) {
    const l = Se(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class pc extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function Gi(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function wh(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function $h(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new pc(s.message) : s;
  }
}
async function yh(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const xh = 3;
function ke(t) {
  if (typeof t == "number")
    return t === xh ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class kh {
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
      const o = await $h(this.hass, e, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof pc ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = ke(o)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Ei = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ci = class {
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
const hc = (t) => t.strings === void 0, Mh = {}, xo = (t, e = Mh) => t._$AH = e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _h = Ei(class extends Ci {
  constructor() {
    super(...arguments), this.key = w;
  }
  render(t, e) {
    return this.key = t, e;
  }
  update(t, [e, n]) {
    return e !== this.key && (xo(t), this.key = e), n;
  }
});
var fc = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Ah = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", Sh = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Ih = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Eh = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Ch = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Lh = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Nr = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", zt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Ph = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Oh = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", zh = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Dh = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", mc = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Nh = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Th = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Vh = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Hh = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Rh = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Bh = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Fh = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Uh = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", gc = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Wh = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", jh = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", bc = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", qh = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Zh = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Gh = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Kh = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Xh = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Yh = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Qh = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Jh = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", ef = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", vc = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", tf = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", nf = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", sf = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
function wc(t, e, n) {
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
function of(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function rf(t, e, n, i) {
  const s = [t, t + n / 2, t + n], o = [e, e + i / 2, e + i], r = [];
  for (const l of s) for (const a of o) (l !== s[1] || a !== o[1]) && r.push({ x: l, y: a });
  return r;
}
function lf(t, e, n, i, s) {
  const o = rf(e, n, i, s);
  if (!o.every((l) => It(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + s)) return null;
  let r = 1 / 0;
  for (const l of o)
    for (let a = 0; a < t.length; a++) r = Math.min(r, _e(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function af(t, e, n, i, s) {
  const o = e.placement.mode === "wall", r = o ? of(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const p of t.zones) {
    const f = re(t, p);
    if (f.length < 3 || !It(f, n.pt)) continue;
    const m = Math.abs(Ae(f));
    m < a && (a = m, l = f);
  }
  if (!l) return r;
  const c = (p) => {
    const f = wc(p, i, s);
    return lf(l, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, u = (p) => {
    let f = null, m = -1;
    for (const $ of p) {
      const b = c($);
      b !== null && b > m && (f = $, m = b);
    }
    return f;
  }, d = ["down-right", "down-left", "up-right", "up-left"];
  if (o) {
    const p = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = d.filter(($) => p ? $.startsWith(r) : $.endsWith(r));
    return u(m) ?? u(p ? ["right", "left"] : ["down", "up"]) ?? (c(f) !== null ? f : r);
  }
  return u(["right", "left"]) ?? u(d) ?? u(["down", "up"]) ?? r;
}
const ae = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Me(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function $c(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${h("unit.m2")}`;
}
const bn = 12, j = "non-scaling-stroke", cf = 7, df = 10, ti = "#f43f5e", Tr = "3 2", Vr = 18, uf = 6, Hr = 11, pf = 0.6, hf = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", yc = 24, xn = 4, Rr = 4, Nn = bn * 0.85, ff = 0.58;
function mf(t, e, n, i) {
  const s = yc;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], u = a * i - 2 * Rr, d = c * i - 2 * Rr, p = e.length * ff * Nn, f = s + xn + Nn, m = s + xn + p, $ = Math.max(s, p), b = (M, k) => Math.max(0, M - u) + Math.max(0, k - d), g = b($, f), y = b(m, s);
  if (g > 0 && y < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + xn) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -f / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + s / 2) / i,
    labelX: 0,
    labelY: (x + s + xn + Nn / 2) / i,
    labelAnchor: "middle"
  };
}
function gf(t, e, n, i = 0, s = 0) {
  const o = yc / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${hf} fill=${n}></path></g>`;
}
const bf = "__preview__", vf = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, wf = /* @__PURE__ */ new WeakMap();
function $f(t, e) {
  var s;
  const n = Me(wf, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Me(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = Me(i, t.openings, () => ({})))[e] ?? (s[e] = Ia(t, e));
}
const yf = /* @__PURE__ */ new WeakMap();
function xc(t, e) {
  const n = $i(e.props.kind);
  if (!n) return [];
  const i = $f(t, n), s = Me(yf, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(e);
  return o || (o = ip(t, e, () => i), s.set(e, o)), o;
}
function ni(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function xf(t, e, n, i, s, o = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = s ?? w;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${j}></circle>` : _`<circle class="icon" r=${ni(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></path>`;
    case "motion_sensor": {
      const u = (d) => `M${e * d} ${-e * d * 0.8}A${e * d} ${e * d * 0.8} 0 0 1 ${e * d} ${e * d * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <path class="arcs" d=${u(1) + u(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    case "illuminance_sensor": {
      let u = "";
      for (let d = 0; d < 8; d++) {
        const p = d * Math.PI / 4;
        u += `M${Math.cos(p) * e * 1.15} ${Math.sin(p) * e * 1.15}L${Math.cos(p) * e * 1.6} ${Math.sin(p) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <path class="rays" d=${u} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${j}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${o} stroke=${o} stroke-width="1" vector-effect=${j}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${j}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${o}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${o}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${j}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${j}></path>`;
    case "exhaust_fan": {
      let u = "";
      for (let d = 0; d < 4; d++) {
        const p = d * Math.PI / 2 + Math.PI / 4;
        u += `M0 0L${Math.cos(p) * e * 0.85} ${Math.sin(p) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${j}></circle>
        <path class="blades" d=${u} fill="none" stroke=${o} stroke-width="1.5" vector-effect=${j}></path>`;
    }
    default:
      return _`${w}`;
  }
}
function kf(t, e, n, i, s, o) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${w}`;
  const l = mf(r, r.label, i, e.scale), a = o ?? w, c = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${j}></circle>
      ${s ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : w}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${j}></rect>
      ${s ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : w}`;
  return _`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${gf(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${Nn / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function Mf(t, e, n = 0) {
  return t === "bound" ? w : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(bn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${vf[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : w} vector-effect=${j}></circle>`;
}
function _f(t, e, n) {
  if (t.status !== "error") return w;
  const i = e * 0.9, s = -e * 0.9, o = df / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${s} r=${cf / n.scale} fill=${n.palette.background} stroke=${ti} stroke-width="1.5"
      vector-effect=${j}></circle>
    <path d=${fc} fill=${ti} transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}></path>
  </g>`;
}
function Af(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" ? ti : t === "event" ? e.selection : e.device;
}
function Sf(t, e, n, i, s, o) {
  const r = [...i.shown.map((b) => [b, "bubble-in"]), ...i.leaving.map((b) => [b, "bubble-out"])];
  if (r.length === 0) return w;
  const l = 1 / o.scale, a = r.map(([b]) => (b.text.length * Hr * pf + 2 * uf) * l), c = Vr * l, u = (Vr + 2) * l, d = { w: Math.max(...a), h: c + u * (r.length - 1) }, p = s + 4 * l, f = Math.max(1, i.shown.length), m = af(t, e, n, { w: Math.max(...a.slice(0, f)), h: c + u * (f - 1) }, p), $ = wc(m, d, p);
  return _`${r.map(([b, g], y) => {
    const x = a[y], M = $.x + (d.w - x) / 2, k = $.y + (m.startsWith("up") ? r.length - 1 - y : y) * u, S = Af(b.tone, o.palette);
    return _h(`${g}:${b.key ?? ""}`, _`<g class=${`bubble ${g}`} data-tone=${b.tone}>
      <rect x=${M} y=${k} width=${x} height=${c} rx=${c / 2} fill=${o.palette.background} stroke=${S} stroke-width="1.5"
        vector-effect=${j}></rect>
      <text x=${M + x / 2} y=${k + c / 2} text-anchor="middle" dominant-baseline="central" fill=${S} font-weight="700"
        font-size=${Hr * l} font-family="system-ui, sans-serif">${b.text}</text>
    </g>`);
  })}`;
}
function If(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : ni(t, bn / e.scale);
}
function Ef(t, e, n, i) {
  var r;
  const s = (r = i.bubbles) == null ? void 0 : r.call(i, e), o = s ? Sf(t, e, n, s, If(e, i), i) : w;
  return o === w ? w : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : w}>${o}</g>`;
}
function Cf(t, e, n, i) {
  var x, M, k;
  const s = n.palette, o = t.invalid ? s.invalid : s.device, r = bn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, c = !i && hi(t.props.kind), u = c ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, d = i || (k = n.live) == null ? void 0 : k.call(n, t), p = (d == null ? void 0 : d.look) === "on" || (d == null ? void 0 : d.look) === "active", f = c && !!n.containerState && !u || (d == null ? void 0 : d.look) === "no-data", m = t.props.kind, $ = !p || t.invalid ? o : m === "leak_sensor" ? ti : m === "motion_sensor" ? s.motionCone : o, b = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), g = i ? "0.5" : n.dim ? String(s.dimOpacity) : w, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, ni(t, r));
  return _`
    <g class=${b} data-id=${t.id} opacity=${g} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${j}></circle>` : w}
      ${t.props.kind === "equipment" ? kf(t, n, o, l, p, f ? Tr : void 0) : _`<g transform=${`rotate(${l})`}>${xf(
    t,
    r,
    $,
    p ? $ : s.deviceFill,
    f ? Tr : void 0,
    p ? s.deviceFill : $,
    (d == null ? void 0 : d.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? Mf(n.bindingStatus(t), n.scale, ni(t, r)) : w}
      ${u ? _f(u, r, n) : w}
    </g>`;
}
function Br(t, e, n, i) {
  const s = xc(t, e);
  if (s.length === 0) return w;
  const o = n.palette, r = e.invalid ? o.invalid : $i(e.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : w, a = s.map(ae).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${j}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${j}></path>`;
}
function Lf(t, e, n, i) {
  const s = xc(t, e);
  let o = 0;
  for (const c of s) for (const u of c) o = Math.max(o, Math.hypot(u.x - n.pt.x, u.y - n.pt.y));
  o === 0 && (o = bn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : w;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${o}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${s.length ? _`<path class="light-fill" d=${s.map(ae).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${o} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Pf(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return w;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), s = i ? Ms(t, i, e.scale) : null;
  if (!s) return w;
  const o = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : w}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${j}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${j} style="cursor:grab"></circle>
  </g>`;
}
function Of(t, e) {
  const n = [];
  for (const i of t.devices) {
    const s = ne(t, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (e.preview) {
    const i = { id: bf, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, s = ne(t, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return w;
    if (e.live && !i.preview) {
      const s = e.live(i.d).look, o = i.d.props.kind;
      return o === "ceiling_light" || o === "wall_light" ? s === "on" ? Lf(t, i.d, i.pose, e) : w : o === "motion_sensor" && s === "active" ? Br(t, i.d, e, !1) : w;
    }
    return Br(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Cf(i.d, i.pose, e, i.preview))}</g>
    ${Pf(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? w : Ef(t, i.d, i.pose, e))}</g>` : w}`;
}
const Fr = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], ko = (t) => Fr[t % Fr.length], ot = "non-scaling-stroke", zf = "0.55", Df = /* @__PURE__ */ new WeakMap();
function Nf(t, e, n, i) {
  const s = i.palette, o = ko(n), r = i.selectedId === e.id, l = Me(Df, t, Ta).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${ae(re(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : o}
        fill-opacity=${e.invalid ? w : "0.16"} stroke=${o} stroke-width="1.5" vector-effect=${ot}
        opacity=${i.selectedId !== null && !r ? zf : w}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? s.invalid : s.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${s.zoneLabel}>${$c(lo(t, e))}</tspan>
      </text>` : w}
    </g>`;
}
function Tf(t, e) {
  const n = e.palette, i = t.zones.map((o, r) => ({ z: o, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: o, i: r }) => _`
      <path class="zone" data-id=${o.id} d=${ae(re(t, o))} fill="none" stroke=${ko(r)} stroke-width="1"
        vector-effect=${ot}></path>`)}</g>`;
  const s = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${s} height=${s} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${s} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: o, i: r }) => Nf(t, o, r, e))}</g>`;
}
function Vf(t, e, n) {
  const i = n.palette, s = 14 / n.scale;
  return _`<g class="zone-members">${Et(t, e).map(({ device: o, participates: r }) => {
    const l = ne(t, o);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${ot}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${ot}></circle>` : w;
  })}</g>`;
}
function Hf(t, e, n) {
  if (e.shape.kind !== "polygon") return w;
  const i = n.palette, s = e.shape.vertices;
  return _`${re(t, e).map((o, r) => {
    const l = s[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${o.x} cy=${o.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${ot}></circle>`;
  })}`;
}
function Rf(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${ot}></polyline>`;
}
function Bf(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${ae(re(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${ot}></path>` : w}
    ${n ? Vf(t, n.id, e) : w}
    ${n ? Hf(t, n, e) : w}
    ${e.draft ? Rf(e.draft, e) : w}</g>`;
}
function nt(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Ff = /* @__PURE__ */ new WeakMap(), Uf = /* @__PURE__ */ new WeakMap(), kc = /* @__PURE__ */ new WeakMap();
function Li(t, e, n) {
  const i = ee(t.dir), s = D(t.a, E(t.dir, e)), o = D(t.a, E(t.dir, n));
  return [D(s, E(i, t.leftOff)), D(o, E(i, t.leftOff)), C(o, E(i, t.rightOff)), C(s, E(i, t.rightOff))];
}
function cn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ie(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const G = "non-scaling-stroke";
function Wf(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, s = 5 / e.scale, o = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = cn(t, l.id);
    if (!a) continue;
    const c = ee(a.dir);
    for (const [u, d, p] of [[l.a, a.a, a.dir], [l.b, a.b, E(a.dir, -1)]]) {
      const f = t.nodes.find((k) => k.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const m = D(d, E(c, a.leftOff + i)), $ = C(d, E(c, a.rightOff + i)), b = E(c, 1), g = E(D(m, $), 0.5), y = D(C(g, E(b, -o)), E(p, s / 2)), x = C(C(g, E(b, o)), E(p, s / 2)), M = [m, y, x, $];
      r.push(_`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${G}></path>`);
    }
  }
  return r.length ? _`${r}` : w;
}
function jf(t, e, n) {
  const i = ee(t.dir), s = (e.swing ?? "left") === "left", o = s ? i : E(i, -1), r = s ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = D(D(t.a, E(t.dir, l)), E(o, r)), u = D(D(t.a, E(t.dir, a)), E(o, r)), d = D(c, E(o, e.width)), p = oe(C(d, c), C(u, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${d.x} y2=${d.y} stroke=${n} stroke-width="1.5" vector-effect=${G}></line>
    <path d=${`M${d.x} ${d.y}A${e.width} ${e.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${G}></path>`;
}
function qf(t, e, n) {
  const i = ee(t.dir), s = t.leftOff + t.rightOff, o = [t.leftOff - s / 3, t.leftOff - 2 * s / 3].map((r) => {
    const l = D(D(t.a, E(t.dir, e.offset)), E(i, r)), a = D(D(t.a, E(t.dir, e.offset + e.width)), E(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${G}></line>`;
  });
  return _`${o}`;
}
function Zf(t, e, n) {
  const i = cn(t, e.wallId);
  if (!i) return w;
  const s = n.palette, o = e.invalid ? s.invalid : e.kind === "window" ? s.window : s.door, r = Li(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${ae(r)} fill=${e.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? jf(i, e, o) : e.kind === "window" ? qf(i, e, o) : w}
    </g>`;
}
function Ur(t, e, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = D(t, E(n, i)), a = D(e, E(n, i)), c = (d, p) => {
    const f = D(p, E(n, i + r));
    return _`<line x1=${d.x} y1=${d.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${G}></line>`;
  }, u = D(E(D(l, a), 0.5), E(n, 9 / s.scale));
  return _`
    <g class="dim">
      ${c(D(t, E(n, 2 / s.scale)), t)}${c(D(e, E(n, 2 / s.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${G}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${nt(O(t, e))}</text>
    </g>`;
}
function Gf(t, e) {
  const n = e.selection;
  if (!n) return w;
  const i = e.palette, s = 4 / e.scale, o = (r) => _`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? o(r) : w;
  }
  if (n.kind === "wall") {
    const r = Me(kc, t, bi).get(n.id), l = cn(t, n.id);
    if (!r || !l) return w;
    const a = ee(l.dir);
    return _`
      <path d=${ae(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${G}></path>
      ${o(l.a)}${o(l.b)}
      ${Ur(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((p) => p.id === n.id), l = r ? cn(t, r.wallId) : null;
    if (!r || !l) return w;
    const a = E(ee(l.dir), -1), c = l.rightOff + 18 / e.scale, u = (p) => D(l.a, E(l.dir, p)), d = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${ae(Li(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${G}></path>
      ${d.filter(([p, f]) => f - p >= 1).map(([p, f]) => Ur(u(p), u(f), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${ae(re(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${G}></path>` : w;
  }
  return w;
}
function Kf(t, e, n) {
  return O(t, e) < 1e-6 ? null : Li(sa(t, e, n.thickness, n.baseline), 0, O(t, e));
}
function Xf(t, e) {
  const { preview: n, palette: i } = e, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? cn(t, r.wallId) : null;
  return _`
    ${o ? _`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${G}></path>` : w}
    ${(n.walls ?? []).map((a) => {
    const c = Kf(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${ae(c)} fill=${i.selection} fill-opacity="0.35"></path>` : w}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${G}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ae(Li(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : w}
    ${Qf(t, e)}`;
}
function Yf(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${G}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${G}></rect></g>`;
}
function Qf(t, e) {
  const n = e.preview, i = e.palette, s = n.anchor ? Yf(n.anchor, e) : w, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / e.scale, { x: l, y: a } = o.pt, c = { stroke: i.background, width: "3" };
  let u, d = w;
  if (o.kind === "node" || o.kind === "corner") {
    const f = r(5);
    u = _`<g class=${o.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${G}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    u = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${G}></path></g>`;
  } else if (o.kind === "zoneVertex") {
    const f = r(7), m = `M${l} ${a - f}L${l + f} ${a}L${l} ${a + f}L${l - f} ${a}Z`;
    u = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${G}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${G}></path></g>`;
  } else if (o.kind === "wall" || o.kind === "zoneEdge") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    u = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${G}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${G}></path></g>`;
    const $ = o.endpoint.kind === "wall" ? Me(kc, t, bi).get(o.endpoint.wallId) : void 0;
    $ && (d = _`<path class="snap-wall-hl" d=${ae($)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${G}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    u = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${G}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${G}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return _`
    ${d}${s}${u}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${G} font-family="system-ui, sans-serif">${p}</text>`;
}
function Jf(t, e) {
  var p;
  const n = e.preview.level ?? t, i = e.palette, s = Me(Ff, n, (f) => aa(f, !0)), o = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = o.length ? Me(Uf, n, no) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? w : String(i.dimOpacity), u = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, d = e.mode ?? "plan";
  return _`
    ${Tf(n, { palette: i, scale: e.scale, selectedId: u, mode: d === "automation" ? "plan" : d })}
    <path class="walls" d=${s.map((f) => f.map(ae).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? _`<g class="railings" opacity=${c}>${o.flatMap((f) => (r.get(f.id) ?? []).map((m) => _`<path d=${ae(m)} fill=${i.railing}></path>`))}</g>` : w}
    <g class="openings" opacity=${c}>${n.openings.map((f) => Zf(n, f, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Wf(n, e)}</g>
    ${a ? Bf(n, {
    palette: i,
    scale: e.scale,
    selectedId: u,
    draft: e.preview.zoneDraft,
    vertex: ((p = e.preview.zoneVertex) == null ? void 0 : p.zoneId) === u ? e.preview.zoneVertex.index : null
  }) : w}
    <g class="devices-layer">${a ? w : Of(n, {
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
    <g class="selection">${Gf(n, e)}</g>
    <g class="preview">${Xf(n, e)}</g>`;
}
const ve = "non-scaling-stroke", dn = "system-ui, sans-serif", em = 13, jt = 9, tm = 11, Wr = 18, Ki = 12, Xi = 11, kn = 13, nm = 3, Tn = 10, jr = 4.5, im = 12, sm = 11.5, Mo = 10, Yi = 10.5, om = 6, rm = {
  IN: Fh,
  OUT: gc,
  BAT: Uh,
  PV: bc
}, qr = { dead: 0, nodata: 1, idle: 2, live: 3 };
function mt(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Qi = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function lm(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function vn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const am = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, cm = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Mc = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${ve}>${i ? w : cm}</path>`, _c = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, kt = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function dm(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? gn : jt, s = t.pts[0], o = t.pts[t.pts.length - 1], r = Tn / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((u, d) => ({ p: t.pts[d], q: u, len: Math.abs(u.x - t.pts[d].x) + Math.abs(u.y - t.pts[d].y) })).sort((u, d) => d.len - u.len);
  for (const { p: u, q: d, len: p } of a) {
    if (p < 2 * r + 2 * l) continue;
    const f = { x: (u.x + d.x) / 2, y: (u.y + d.y) / 2 }, m = (b, g) => Math.hypot(f.x - b.x, f.y - b.y) >= g + r + l;
    if (!m(s, i(t.w.from)) || !m(o, i(t.w.to))) continue;
    const $ = Math.atan2(d.y - u.y, d.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: (($ + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function um(t, e, n) {
  var c;
  const i = e.palette, s = vn(t.style, i), o = _c(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = dm(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${ve}></path>` : w}
    ${t.style === "live" ? Mc("glow", o, s, n) : w}
    <path class=${`wire ${t.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : w} stroke-linejoin="round" vector-effect=${ve}></path>
    ${a ? _`<path class="arrow" d=${`M${Tn / 2} 0L${-Tn / 2} ${-jr}L${-Tn / 2} ${jr}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : w}
  </g>`;
}
function pm(t, e, n) {
  const i = rm[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${gn} fill=${n.portFill}
      stroke=${e ? vn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${ve}></circle>
    ${i ? kt(i, t.pt, em, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${dn}>${t.name}</text>`}
  </g>`;
}
function hm(t, e) {
  const n = Math.max(4, Math.floor(e / (Mo * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function fm(t, e, n, i) {
  const s = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? Si(a, n) || h(`power.kind.${a.kind}`) : l;
  }), o = h("power.absorbed.one");
  return { kind: "text", value: s.length === 1 ? o.replace("{name}", hm(s[0], i - 12 - o.replace("{name}", "").length * Mo * 0.55)) : h("power.absorbed.many").replace("{n}", String(s.length)), small: !0, title: s.join(", ") };
}
function mm(t, e, n, i, s, o) {
  var a;
  const r = () => ({ kind: "text", value: mt(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Qi(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: h("power.missing"), fill: s.blockInvalid }];
      const u = c.bindings ?? {}, d = St(c), p = [];
      return d ? (u.power_in && p.push({ kind: "text", label: h("power.in"), value: mt(i == null ? void 0 : i.power_in) }), u.power_out && p.push({ kind: "text", label: h("power.out"), value: mt(i == null ? void 0 : i.power_out) })) : u.power && p.push(r()), u.voltage && p.push({ kind: "text", value: Qi(i == null ? void 0 : i.voltage, "V") }), u.control && p.push(l($a(c))), d && p.push({ kind: "text", label: h("power.loss"), value: mt(i == null ? void 0 : i.loss) }), p;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: Qi(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: s.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), fm(t, i.absorbed, n, o)] : [r()];
    case "bus":
      return [];
  }
}
function gm(t, e, n) {
  const i = t.state ?? "unknown", s = t.controllable ? 0 : Ki + 3, o = e.x - s / 2, r = `${h(`power.switch.${i}`)}${t.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : w}>
    <title>${r}</title>
    ${kt(
    i === "on" ? Dh : zh,
    { x: o, y: e.y },
    Wr,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? w : kt(Hh, { x: o + Wr / 2 + 3 + Ki / 2, y: e.y + 1 }, Ki, n.blockValue)}
  </g>`;
}
function Zr(t, e, n) {
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
function bm(t, e, n) {
  const i = 2 * (t.w + t.h), s = Zr(t, e.side, e.pt), o = ((Zr(t, n.side, n.pt) - s) % i + i) % i, r = o <= i / 2 ? 1 : -1, l = r > 0 ? o : i - o, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((u) => ({ c: u, d: ((u.t - s) * r % i + i) % i })).filter(({ d: u }) => u > 0 && u < l).sort((u, d) => u.d - d.d).map(({ c: u }) => u.pt);
  return [e.pt, ...c, n.pt];
}
function vm(t, e, n, i, s, o) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return w;
  const l = Ii(t, e, i.geo), a = l.find((f) => f.name === r), c = l.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return w;
  const u = s(c.name) ?? "nodata", d = vn(u, i.palette), p = _c(bm(Se(e, i.geo, t), a, c));
  return _`${u === "live" ? Mc("ts-glow", p, d, o) : w}
    <path class="ts-path" d=${p} fill="none" stroke=${d} stroke-width="3" stroke-dasharray=${u === "nodata" ? "5 4" : w}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${ve}></path>`;
}
function wm(t, e, n, i) {
  const s = i.palette;
  return uc(e, i.geo, t).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${ve}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${dn}>${o}</text>
    </g>`;
  });
}
function $m(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? h("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? h("power.alert.missingDevice") : t === "disagree" ? h("power.alert.disagree") : t;
}
function ym(t, e, n, i) {
  const s = nm + kn / 2, o = [
    { x: e.x + e.w - s, y: e.y + s },
    { x: e.x + e.w - s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + e.h - s },
    { x: e.x + s, y: e.y + s }
  ], r = (a) => n.every(({ pt: c }) => {
    const u = Math.max(Math.abs(c.x - a.x) - kn / 2, 0), d = Math.max(Math.abs(c.y - a.y) - kn / 2, 0);
    return Math.hypot(u, d) > gn;
  }), l = o.find(r) ?? o[0];
  return _`<g class="alert"><title>${t.map($m).join(`
`)}</title>
    ${kt(fc, l, kn, i.blockInvalid)}</g>`;
}
function xm(t, e, n, i, s) {
  var $, b;
  const o = n.palette, r = Se(e, n.geo, t), l = ($ = n.frame) == null ? void 0 : $.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, u = r.x + r.w / 2, d = Si(e, n.geo) || h(`power.kind.${e.kind}`), p = mm(t, e, n.geo, l, o, r.w), f = e.kind === "remainder", m = Ii(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${o.blockFill}
      stroke=${f ? o.powerRemainder : o.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : w} vector-effect=${ve}></rect>
    ${e.kind === "transfer" ? vm(t, e, l, n, (g) => i(e.id, g), s) : w}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${h("power.planDevice")}</title>
      ${kt(Rh, { x: r.x + 4 + Xi / 2, y: r.y + 4 + Xi / 2 }, Xi, o.blockValue)}</g>` : w}
    <text class="name" x=${u} y=${r.y + Jn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${im} font-weight="600" fill=${o.blockName} font-family=${dn}>${d}</text>
    ${p.map((g, y) => {
    const x = r.y + Jn + y * Qn + Qn / 2;
    if (g.kind === "chips") return e.kind === "transfer" ? wm(t, e, l, n) : w;
    if (g.kind === "switch") return gm(g, { x: u, y: x }, o);
    const M = g.fill ?? o.blockValue, k = g.label ? _`<tspan>${g.label} </tspan>` : w, S = g.note ? _`<tspan> ${g.note}</tspan>` : w;
    return _`<text x=${u} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${g.small ? Mo : sm}
        fill=${M} font-family=${dn}>${g.title ? _`<title>${g.title}</title>` : w}${k}<tspan
        font-weight=${g.small ? w : "600"}>${g.value}</tspan>${S}</text>`;
  })}
    ${(b = l == null ? void 0 : l.alert) != null && b.length ? ym(l.alert, r, m, o) : w}
    ${m.map((g) => pm(g, i(e.id, g.name), o))}
  </g>`;
}
function km(t, e, n, i) {
  const s = i.palette, o = t.w >= t.h, r = o ? t.x : t.y, l = r + (o ? t.w : t.h), a = o ? t.h : t.w;
  let c = w;
  const u = t.name ?? "", d = Math.min(Yi, a - 4), p = d >= om, f = u.length * (p ? d : Yi) * 0.58 + 12;
  if (u) {
    const m = e.map((g) => o ? g.x : g.y).sort((g, y) => g - y);
    let $ = { lo: 0, hi: -1 }, b = r;
    for (const g of [...m, l + jt]) {
      const y = Math.min(g - jt, l);
      y - b > $.hi - $.lo && ($ = { lo: b, hi: y }), b = Math.max(b, g + jt);
    }
    if ($.hi - $.lo >= f) {
      const g = ($.lo + $.hi) / 2, y = o ? { x: g, y: p ? t.y + t.h / 2 : t.y - 7 } : { x: p ? t.x + t.w / 2 : t.x - 7, y: g };
      c = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? d : Yi} fill=${s.blockValue} font-family=${dn}
        transform=${o ? w : `rotate(-90 ${y.x} ${y.y})`}>${u}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${s.blockFill}
      stroke=${n ? vn(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${ve}></rect>
    ${c}
  </g>`;
}
function Mm(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${jt} fill=${n.portFill} stroke=${vn(e, n)} stroke-width="1.5"
      vector-effect=${ve}></circle>
    ${kt(Lh, t, tm, n.portIcon)}
  </g>`;
}
function _m(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return w;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return w;
  const s = Se(i, e.geo, t), o = 4 / e.scale;
  return _`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${ve}></rect>`;
}
function Am(t, e) {
  var p;
  const n = e.preview.power ?? t, i = e.palette, s = [];
  for (const f of n.wires) {
    const m = cc(n, f, e.geo);
    if (!m) continue;
    const $ = (p = e.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: dc(m.a, m.b), live: $, style: lm($) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of s)
    for (const [m, $] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const b = r.get(m.bus);
      (b === void 0 || qr[f.style] > qr[b]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], $.pt]), a.push({ at: $.pt, style: f.style });
    }
  const c = (f, m) => o.get(`${f}:${m}`), u = am(), d = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? km(f, l.get(f.id) ?? [], r.get(f.id), e) : w)}</g>
    <g class="wires">${s.map((f) => um(f, e, u))}</g>
    ${_m(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? w : xm(n, f, e, c, u))}</g>
    <g class="terminals">${a.map((f) => Mm(f.at, f.style, i))}</g>
    ${d ? _`<line class="wire-draft" x1=${d.from.x} y1=${d.from.y} x2=${d.to.x} y2=${d.to.y}
      stroke=${d.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${ve}></line>` : w}
  </g>`;
}
const Sm = {
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
}, Im = {
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
function Em(t) {
  return t ? Sm : Im;
}
class Cm extends Ci {
  constructor(e) {
    if (super(e), e.type !== Te.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? ge : (xo(e), n);
  }
}
const q = Ei(Cm), Is = 1, Gr = 1e-6;
function Lm(t, e, n, i, s) {
  const o = (a) => a > Gr && a < s - Gr, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = gi(t, a).host.offset;
    o(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some(($) => $ === e.a || $ === e.b || r.has($))) continue;
    const c = X(t, a.a), u = X(t, a.b), d = O(c, u), p = d === 0 ? null : xe(n, i, c, C(u, c));
    if (!p) continue;
    const f = mi(p, c, u) * d;
    if (f < -Is || f > d + Is) continue;
    const m = U(C(p, n), i);
    o(m) && l.push({ t: m, wall: a, pt: p });
  }
  return l;
}
function Kr(t, e) {
  let n;
  for (const i of t) {
    const s = Math.abs(i.t - e), o = n ? Math.abs(n.t - e) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function Xr(t, e) {
  if ("nodeId" in e)
    return delete gi(t, e.nodeId).host, e.nodeId;
  for (const o of [e.wall.a, e.wall.b]) if (O(X(t, o), e.pt) <= Is) return o;
  const { pt: n, offset: i } = xi(t, e.wall, e.pt), s = { id: Y(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(s), s.id;
}
function Pm(t, e, n) {
  const i = t.walls.find((g) => g.id === e);
  if (!i) return t;
  const s = X(t, i.a), o = X(t, i.b), r = O(s, o), l = fi(C(o, s)), a = U(C(n, s), l), c = Lm(t, i, s, l, r), u = Kr(c.filter((g) => g.t < a), a), d = Kr(c.filter((g) => g.t > a), a);
  if (!u && !d) return bo(t, e);
  const p = Ee(t), f = p.walls.find((g) => g.id === e);
  let m = e, $ = 0;
  if (d) {
    const g = Xr(p, d);
    if ($ = U(C(X(p, g), s), l), u) {
      const y = { ...f, id: Y(), a: g };
      p.walls.push(y), m = y.id;
    } else
      f.a = g;
  }
  u && (f.b = Xr(p, u));
  const b = (g, y) => g.wallId !== e || u && y <= u.t ? !0 : !d || y < d.t ? !1 : (g.wallId = m, g.offset -= $, !0);
  p.openings = p.openings.filter((g) => b(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || b(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !b(g.host, g.host.offset) && delete g.host;
  for (const g of p.zones) {
    const y = g.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || b(x, x.offset) ? x : co(x)));
  }
  return ki(p), Ne(p, t);
}
function _o(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function Om(t, e, n) {
  return D(t, E(fi(C(e, t)), n));
}
function Mn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function rt(t, e, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? _o(r, e) : e, c = r !== void 0 && a.y === r.y, u = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let d = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const S = { x: k.x, y: k.y }, I = O(S, a);
    I <= i && u(S) && (!d || I < d.d) && (d = { id: k.id, pt: S, d: I });
  }
  let p = null;
  for (const k of n.corners ?? []) {
    const S = O(k.pt, a);
    S <= i && u(k.pt) && (!p || S < p.d) && (p = { c: k, d: S });
  }
  if (p && (!d || p.d < d.d)) {
    const k = p.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: p.c };
  }
  if (d) return { pt: d.pt, kind: "node", endpoint: { kind: "node", nodeId: d.id } };
  const f = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: ie(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: S } of f) {
    const I = { x: (S.a.x + S.b.x) / 2, y: (S.a.y + S.b.y) / 2 }, L = O(I, a);
    L <= i && u(I) && (!m || L < m.d) && (m = { wallId: k.id, pt: I, offset: S.len / 2, d: L });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const $ = (k) => {
    let S = null;
    for (const { w: I, f: L } of f) {
      const N = ee(L.dir), H = k ? [L.leftOff, -L.rightOff].filter((z) => z !== 0) : [0];
      for (const z of H) {
        const V = D(L.a, E(N, z)), W = r ? xe(r, C(a, r), V, L.dir) : D(V, E(L.dir, U(C(a, V), L.dir)));
        if (!W) continue;
        const Z = U(C(W, V), L.dir);
        if (Z < 0 || Z > L.len) continue;
        const Q = O(W, a);
        Q <= i && (!S || Q < S.d) && (S = { d: Q, res: { pt: W, kind: "wall", endpoint: { kind: "wall", wallId: I.id, offset: Z } } });
      }
    }
    return S ? S.res : null;
  }, b = $(!1);
  if (b) return b;
  const g = $(!0);
  if (g) return g;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const S of k) {
      const I = O(S, a);
      I <= i && u(S) && (!x || I < x.d) && (x = { pt: S, d: I });
    }
  if (x) return Mn(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let S = 0; S < k.length; S++) {
      const I = k[S], L = k[(S + 1) % k.length], N = O(I, L);
      if (N < 1e-9) continue;
      const H = E(C(L, I), 1 / N), z = r ? xe(r, C(a, r), I, H) : D(I, E(H, U(C(a, I), H)));
      if (!z) continue;
      const V = U(C(z, I), H);
      if (V < 0 || V > N) continue;
      const W = O(z, a);
      W <= i && (!M || W < M.d) && (M = { pt: z, d: W });
    }
  if (M) return Mn(M.pt, "zoneEdge");
  if (s && s > 0) {
    const k = (I) => Math.round(I / s) * s, S = r ? c ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return Mn(S, "grid");
  }
  return Mn(a, "none");
}
function zm(t, e, n) {
  return e.some((i, s) => _e(t, i, e[(s + 1) % e.length]) <= n);
}
function Ao(t, e, n) {
  const i = bi(t);
  for (const [s, o] of i) if ($t(e, o)) return s;
  for (const [s, o] of i) if (zm(e, o, n)) return s;
  return null;
}
function Dm(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = ie(t, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Ge(s, e);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Nm(t, e, n, i) {
  const s = Dm(t, e);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && O(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = Ao(t, e, n);
  return o ? { kind: "wall", id: o } : null;
}
const Pi = 3, Tm = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => re(t, n)).filter((n) => n.length >= 3);
function Ac(t, e, n, i, s) {
  if (n.alt) {
    const l = n.shift && i ? _o(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const o = rt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: Tm(e, s), corners: oa(e) }), r = o.endpoint;
  if (o.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: o.pt.x, y: o.pt.y }, snap: o };
  if (o.kind === "corner" && o.corner) {
    const l = o.corner, a = at(e, l.wallId), c = a !== null && l.offset >= -Xn && l.offset <= a + Xn, u = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, d = c ? nn(e, l.wallId, l.side, u) : null;
    if (d) return { vertex: { kind: "wall", wallId: l.wallId, offset: u, side: l.side, x: d.x, y: d.y }, snap: o };
  }
  if ((o.kind === "mid" || o.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = Ge(ie(e, l), n.pt).side >= 0 ? "left" : "right", c = nn(e, l.id, a, r.offset) ?? o.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...o, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: o.pt.x, y: o.pt.y }, snap: o };
}
function Sc(t, e, n) {
  const i = [];
  for (const s of t.zones) {
    const o = re(t, s);
    if (o.length < 3) continue;
    (o.some((l, a) => _e(e, l, o[(a + 1) % o.length]) <= n) || It(o, e)) && i.push({ id: s.id, area: Math.abs(Ae(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function Ic(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: re(t, n), v: n.shape.vertices } : null;
}
function Vm(t, e, n, i) {
  var r;
  const s = (r = Ic(t, e)) == null ? void 0 : r.o;
  if (!s) return null;
  let o = -1;
  return s.forEach((l, a) => {
    O(n, l) <= i && (o < 0 || O(n, l) < O(n, s[o])) && (o = a);
  }), o < 0 ? null : { index: o, from: s[(o + s.length - 1) % s.length] };
}
function Hm(t, e, n, i) {
  const s = Ic(t, e);
  if (!s || s.o.some((b) => O(n, b) <= i)) return null;
  const { o, v: r } = s;
  let l = -1, a = 1 / 0;
  if (o.forEach((b, g) => {
    const y = _e(n, b, o[(g + 1) % o.length]);
    y <= i && y < a && (l = g, a = y);
  }), l < 0) return null;
  const c = o[l], u = o[(l + 1) % o.length], d = Math.max(0, Math.min(1, mi(n, c, u))), p = ea(c, u, d), f = r[l], m = r[(l + 1) % r.length], $ = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + d * (m.offset - f.offset), x: p.x, y: p.y } : { kind: "free", x: Math.round(p.x), y: Math.round(p.y) };
  return { index: l + 1, vertex: $ };
}
function Rm(t, e) {
  let n = null, i = null, s = null, o = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, u = null, d = [];
  const p = () => {
    const b = t.selection();
    return (b == null ? void 0 : b.kind) === "zone" ? b.id : null;
  }, f = () => {
    i = null, s = null, o = null, r = null, l = !1, a = !1;
  }, m = () => u && u.zoneId === p() ? u : null;
  function $(b) {
    if (!i || !s || !a && O(b.pt, c) <= Pi / t.scale()) return;
    a = !0;
    const g = Ac(t, s, b, i.from, i.zoneId);
    r = g.snap, l = b.shift, o = kp(s, i.zoneId, i.index, g.vertex);
  }
  return {
    note() {
      d = [d[d.length - 1] ?? null, t.selection()];
    },
    press(b) {
      f(), u = null, c = b.pt;
      const g = p(), y = t.level(), x = g === null ? null : Vm(y, g, b.pt, t.tolMm());
      return g === null || !x ? !1 : (i = { zoneId: g, ...x }, s = o = y, !0);
    },
    pick(b) {
      const g = Sc(t.level(), b, t.tolMm());
      if (g.length === 0) {
        n = null, e(null);
        return;
      }
      const y = p(), x = y !== null && n !== null && O(b, n) <= t.tolMm() ? g.indexOf(y) : -1;
      n = b, e({ kind: "zone", id: g[(x + 1) % g.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(b) {
      $(b);
    },
    up(b) {
      if (!i) return;
      $(b);
      const g = o, y = s, x = a, M = i;
      f(), x ? g && y && g !== y && t.commit(g) : u = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(b) {
      const g = d[0];
      if ((g == null ? void 0 : g.kind) !== "zone") return;
      const y = t.level(), x = Hm(y, g.id, b.pt, t.tolMm());
      if (!x) return;
      const M = Mp(y, g.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(g), n = null);
    },
    key(b) {
      if (b === "Escape" && i)
        return f(), !0;
      const g = m();
      if (b === "Escape" && g)
        return u = null, !0;
      if ((b === "Delete" || b === "Backspace") && g) {
        const y = t.level(), x = _p(y, g.zoneId, g.index);
        return x === y ? (t.notify(h("zones.minVertices")), !0) : (u = null, t.commit(x), !0);
      }
      return !1;
    },
    preview() {
      if (i && o) {
        const g = { level: o };
        return r && (g.snap = r), l && (g.orthoFrom = i.from), g;
      }
      const b = m();
      return b ? { zoneVertex: b } : {};
    },
    cancel() {
      f(), u = null, n = null;
    }
  };
}
function Bm(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 }, r = null;
  const l = (f) => {
    t.select(f);
  }, a = () => {
    e = null, n = null, i = null, r = null, s = !1;
  }, c = Rm(t, l), u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, d = (f, m, $) => Ge(ie(f, f.walls.find((b) => b.id === m)), $).t;
  function p(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === o.x && f.pt.y === o.y))
      if (s = !0, m.kind === "node") {
        const $ = rt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), b = $.endpoint, g = ($.kind === "wall" || $.kind === "mid") && b.kind === "wall", y = $.kind === "node" && b.kind === "node" && b.nodeId !== m.nodeId, x = n.nodes.find((I) => I.id === m.nodeId), M = !!x.host && g && b.kind === "wall" && b.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const I = structuredClone(n);
          delete I.nodes.find((L) => L.id === m.nodeId).host, k = I;
        }
        let S = Lp(k, m.nodeId, u($));
        if (y && b.kind === "node")
          S = Dp(S, m.nodeId, b.nodeId);
        else if (g && b.kind === "wall" && !M) {
          const I = n.walls.find((L) => L.id === b.wallId);
          if (I && I.a !== m.nodeId && I.b !== m.nodeId) {
            const L = structuredClone(S);
            L.nodes.find((N) => N.id === m.nodeId).host = { wallId: b.wallId, offset: b.offset }, S = Ne(L, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const $ = n.walls.find((y) => y.id === m.wallId), b = rt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [$.a, $.b]
        }), g = C(b.pt, m.origin);
        i = Op(
          n,
          m.wallId,
          b.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const $ = n.openings.find((b) => b.id === m.openingId);
        i = ma(n, $.id, d(n, $.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      a(), o = f.pt, c.note();
      const m = t.level(), $ = f.ctrl ? Ao(m, f.pt, t.tolMm()) : null;
      if ($) {
        l(null), t.commit(Pm(m, $, f.pt));
        return;
      }
      if (c.press(f)) return;
      const b = t.selection(), g = Nm(m, f.pt, t.tolMm(), b);
      if (!g) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), l(g), r = n = i = m, g.kind === "node") {
        let y = g.id;
        const x = (b == null ? void 0 : b.kind) === "wall" ? m.walls.find((M) => M.id === b.id) : void 0;
        if (f.alt && x) {
          const M = zp(m, x.id, x.a === g.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: X(n, y) };
      } else if (g.kind === "wall")
        e = { kind: "wall", wallId: g.id, origin: f.pt };
      else if (g.kind === "opening") {
        const y = m.openings.find((x) => x.id === g.id);
        e = { kind: "opening", openingId: y.id, grab: d(m, y.wallId, f.pt) - y.offset };
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
      const m = s, $ = i, b = r;
      a(), m && $ && b && $ !== b && t.commit($);
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
function un(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= e && o <= n ? o : null;
}
function Ec() {
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
function Fm(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = Ec(), s = () => {
    e = null, i.clear();
  }, o = (c) => rt(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = un(i.first, { min: 1 }), u = un(i.second, { min: 1 });
      return c === null || u === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? u : -u) };
    }
    return o(n).pt;
  }
  const l = (c, u) => Math.abs(c.x - u.x) < 1 || Math.abs(c.y - u.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const u = Cp(t.level(), e, c, t.wallProps(), t.boxMeasure());
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
      const d = t.wallProps(), p = Za(e, c, d.thickness, t.boxMeasure());
      return p && (u.walls = p.map((f, m) => ({ a: f, b: p[(m + 1) % 4], props: { ...d, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Yr = (t) => Math.round(t * 1e3) / 1e3 + 0;
function Um(t) {
  let e = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = Ec(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (p, f) => rt(t.level(), p, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = c(s, o), f = un(l.first, { min: 1 }), m = un(l.second);
    if (f === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const $ = f ?? O(n, p.pt);
    let b = p.pt;
    if (m === null && O(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      b = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      b = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = Om(n, b, $), y = { x: Yr(g.x), y: Yr(g.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: y, endpoint: { kind: "free", pt: y }, snap: p };
  }
  function d() {
    const p = u();
    if (!e || !p) return;
    const f = Ep(t.level(), e, p.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((x) => x.id === f.wallId);
    i === null && (i = m.a);
    const $ = f.endNodeId === i, b = n, g = X(f.level, f.endNodeId), y = O(b, g);
    if (y > 0 && (r = { x: (g.x - b.x) / y, y: (g.y - b.y) / y }), l.clear(), $) {
      a();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = X(f.level, f.endNodeId);
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
      if (!n) return { snap: rt(t.level(), s, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
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
function Wm(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function s() {
    if (!n) return null;
    const o = t.level(), r = Ao(o, n, t.tolMm());
    if (!r) return null;
    const l = ie(o, o.walls.find((c) => c.id === r)), a = Ge(l, n).t;
    return { wallId: r, center: a, pt: D(l.a, E(l.dir, a)) };
  }
  return {
    id: e,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = Nu(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: o.wallId, offset: l, width: r, kind: e, invalid: !vi(t.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Qr = 3, jm = 1, we = (t) => ({ x: t.x, y: t.y });
function qm(t) {
  let e = [], n = null, i = !1, s = null, o = !1;
  const r = () => e.length ? we(e[e.length - 1]) : void 0;
  function l(d) {
    const p = e.length;
    if (p === 0) return !1;
    const f = e.map(we);
    if (O(f[p - 1], d) <= jm) return !0;
    if (p >= 2) {
      const m = C(f[p - 1], f[p - 2]), $ = C(d, f[p - 1]);
      if (Math.abs(oe(m, $)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot($.x, $.y) && U(m, $) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (za(f[p - 1], d, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(d) {
    if (e.length < Qr) return null;
    const p = t.tolMm(), f = we(e[0]), m = we(e[e.length - 1]);
    return O(d, f) <= p ? f : O(d, m) <= p ? m : null;
  }
  function c() {
    var f;
    if (e.length < Qr || Yn(e.map(we))) return !1;
    const d = t.level(), p = yp(d, e, t.zoneName());
    return p.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? p.level : ho(p.level, p.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: p.zoneId }), !0);
  }
  const u = (d) => Ac(t, t.level(), d, r());
  return {
    id: "zone",
    down(d) {
      if (a(d.pt)) {
        c();
        return;
      }
      const p = u(d).vertex;
      l(we(p)) || (e = [...e, p], n = we(p), i = !1);
    },
    move(d) {
      o = d.shift;
      const p = a(d.pt);
      if (p) {
        n = p, s = null, i = Yn(e.map(we));
        return;
      }
      const f = u(d);
      s = f.snap, n = we(f.vertex), i = l(n);
    },
    up() {
    },
    key(d) {
      return d === "Enter" ? c() : d === "Backspace" || d === "Delete" || d === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : d === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const d = {};
      e.length > 0 && (d.zoneDraft = { points: e.map(we), cursor: n, invalid: i }), s && (d.snap = s);
      const p = r();
      return o && p && (d.orthoFrom = p), d;
    },
    cancel() {
      e = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
function Zm(t) {
  return t.zoneMethod() === "polygon" ? qm(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = $p(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(h("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : ho(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const Jr = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Cc(t) {
  let e = null;
  const n = (s, o, r) => {
    const l = s.devices.find((u) => u.id === o), a = l ? ne(s, l) : null, c = l ? Ms(s, l, t.scale()) : null;
    return !a || !c ? 0 : Ea(Oe(C(r, a.pt)) - Oe(C(c.to, a.pt)));
  };
  function i(s) {
    if (!e || !e.moved && O(s.pt, e.downPt) <= Pi / t.scale()) return;
    e.moved = !0;
    const o = e.original.devices.find((d) => d.id === e.id), r = o ? ne(e.original, o) : null;
    if (!o || !r) return;
    const l = O(s.pt, r.pt), a = (Oe(C(s.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, u = rp(e.original, o, c, s.shift);
    e.work = JSON.stringify(u) === JSON.stringify(o.placement) ? e.original : Gn(e.original, o.id, u);
  }
  return {
    start(s, o) {
      if (e = null, !s) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === s), a = l ? Ms(r, l, t.scale()) : null;
      return !l || !a || O(o.pt, a.to) > t.tolMm() ? !1 : (e = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!e) return !1;
      i(s);
      const o = e;
      return e = null, o.moved && o.work !== o.original && Jr(o.work, o.id) !== Jr(o.original, o.id) && t.commit(o.work), !0;
    },
    cancel() {
      const s = e !== null;
      return e = null, s;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function el(t, e, n) {
  const i = ie(t, t.walls.find((s) => s.id === e));
  return Ge(i, n).side > 0 ? "left" : "right";
}
function Lc(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function So(t, e = "free") {
  return t === "equipment" ? [e] : Js[t];
}
function Pc(t, e, n, i, s = 0, o = So(n)) {
  if (o.includes("wall")) {
    const r = rt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: el(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const u = ie(e, c), d = Ge(u, i).side, p = Math.abs(Math.abs(d) - (d > 0 ? u.leftOff : u.rightOff));
        (!a || p < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : u.len, d: p });
      }
      if (a) return { mode: "wall", wallId: a.id, side: el(e, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Lc(t, i), rotation: s } : null;
}
function Gm(t, e, n) {
  const i = ne(t, e);
  if (!i) return null;
  if (!n) {
    const o = so(Math.round(Oe(i.dir)));
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
    const l = Ge(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), u = nn(t, o.id, a, c), d = u ? O(u, i.pt) : 1 / 0;
    (!s || d < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: c }, d });
  }
  return s && s.d < 1 / 0 ? oo(t, e.props, s.placement, 0) : null;
}
function Km(t, e, n) {
  return ka(t.deviceDefaults(e), "free", n.mode);
}
function Xm(t, e) {
  let n = null, i;
  const s = Cc(t);
  function o() {
    if (!n) return null;
    const r = t.level(), l = So(e, t.wallMount() ? "wall" : "free"), a = Pc(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...Lc(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = Km(t, e, a), u = oo(r, c, a, t.tolMm()), d = mr(r, c, u, "").deviceId !== null;
    return { placement: u, props: c, invalid: !d };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = t.level(), c = Ks(h(`device.${e}`), a.devices.filter((d) => d.props.kind === e).map((d) => d.name)), u = mr(a, l.props, l.placement, c);
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
const tl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Ym = (t, e, n) => n === void 0 || tl(t, n) !== tl(e, n);
function Qm(t, e, n, i) {
  const s = e.placement;
  if (s.mode === "free" && n) return C(n, i);
  if (s.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = nn(t, s.wallId, s.side, s.offset);
  return o ? C(o, i) : { x: 0, y: 0 };
}
function Jm(t) {
  let e = null, n = null;
  const i = Cc(t);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (p) => {
    e = p, t.select(p);
  }, c = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && O(p.pt, l) <= Pi / t.scale()) return;
    if (r = !0, p.pt.x === l.x && p.pt.y === l.y) {
      o = s;
      return;
    }
    const f = s.devices.find((k) => k.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = p.shift ? _o(l, p.pt) : p.pt, $ = f.placement, b = $.mode === "free" ? null : ne(s, f), g = $.mode === "free" ? $.rotation : b ? so(Math.round(Oe(b.dir))) : 0, y = D(m, n.grab), x = Pc(t, s, f.props.kind, y, g, So(f.props.kind, $.mode)), M = x && x.mode === "wall" && $.mode === "wall" && $.aim !== void 0 ? { ...x, aim: $.aim } : x;
    o = M ? Gn(s, f.id, oo(s, f.props, d(s, f.placement, M, m, y), t.tolMm())) : s;
  }
  function d(p, f, m, $, b) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = p.walls.find((I) => I.id === f.wallId);
    if (!g) return m;
    const y = ie(p, g), x = Math.max(0, Math.min(y.len, f.offset + U(C($, l), y.dir))), M = Ge(y, b).side, k = t.tolMm(), S = f.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: S };
  }
  return {
    id: "device-select",
    down(p) {
      c(), l = p.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, p)) return;
      const $ = Pa(f, p.pt, m);
      if (!$) {
        a(null);
        return;
      }
      a({ kind: "device", id: $ });
      const b = f.devices.find((y) => y.id === $), g = ne(f, b);
      s = o = f, n = { id: $, grab: Qm(f, b, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, m = s, $ = r, b = n == null ? void 0 : n.id;
      c(), $ && f && m && f !== m && Ym(m, f, b) && t.commit(f);
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
function eg(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = Pa(t.level(), e.pt, t.tolMm());
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
const Es = 40, tg = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function ng(t, e, n, i) {
  const s = t.blocks.find((f) => f.id === e);
  if ((s == null ? void 0 : s.kind) !== "bus") return t;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = ln(o ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - Es) : r, u = n === "end" ? Math.max(a, r + Es) : r + l;
  if (c === r && u === r + l) return t;
  const d = o ? { x: c, w: u - c } : { y: c, h: u - c }, p = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * l - c) / (u - c))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...d } : f),
    wires: t.wires.map((f) => {
      const m = p(f.from), $ = p(f.to);
      return m === f.from && $ === f.to ? f : { ...f, from: m, to: $ };
    })
  };
}
function ig(t) {
  let e = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, s = !1;
  };
  function l(u, d) {
    const p = Dr(u, d, t.tolMm(), t.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function a(u) {
    const d = e, p = n;
    if (!d || !p || !s && O(u.pt, o) <= Pi / t.scale()) return;
    if (s = !0, d.kind === "wire") {
      const b = l(p, u.pt);
      e = { ...d, to: u.pt, ok: !!b && !("error" in Lr(p, d.from, b, t.geo())) };
      return;
    }
    if (d.kind === "bus-end") {
      i = ng(p, d.id, d.end, u.pt);
      return;
    }
    const f = p.blocks.find((b) => b.id === (d.kind === "pin" ? d.from.block : d.id));
    if (!f) return;
    if (d.kind === "pin") {
      i = Kp(p, f.id, d.from.port, dh(Se(f, t.geo(), p), u.pt));
      return;
    }
    const m = ln(f.x + u.pt.x - o.x), $ = ln(f.y + u.pt.y - o.y);
    i = m === f.x && $ === f.y ? p : qp(p, f.id, m, $);
  }
  function c(u, d, p) {
    const f = l(u, p);
    if (!f) return;
    const m = Lr(u, d, f, t.geo());
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
      const d = t.power(), p = Dr(d, u.pt, t.tolMm(), t.geo());
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
        if (tg(d, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = d.blocks.find((b) => b.id === p.block), $ = Ii(d, m, t.geo()).find((b) => b.name === p.port).pt;
        e = { kind: "wire", from: f, at: $, to: $, ok: !1 };
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
function sg(t, e) {
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
      const o = t.power(), r = jp(n, { x: 0, y: 0 }, o, s), l = Se(r, t.geo(), Er(o, r)), a = { ...r, x: ln(i.pt.x - l.w / 2), y: ln(i.pt.y - l.h / 2) };
      t.commitPower(Er(o, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function og(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = Sc(t.level(), e.pt, t.tolMm())[0];
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
const rg = ["select", "box", "wall", "door", "window", "opening", "zone"], lg = [
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
], ag = ["binding-select"], cg = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], dg = ["zone-pick"], Oc = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, ug = {
  plan: rg,
  equipment: lg,
  binding: ag,
  power: cg,
  automation: dg
};
function Io(t) {
  return ug[t];
}
function Cs(t, e) {
  switch (t) {
    case "select":
      return Bm(e);
    case "box":
      return Fm(e);
    case "wall":
      return Um(e);
    case "door":
    case "window":
    case "opening":
      return Wm(e, t);
    case "zone":
      return Zm(e);
    case "device-select":
      return Jm(e);
    case "binding-select":
      return eg(e);
    case "power-select":
      return ig(e);
    case "zone-pick":
      return og(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return sg(e, t);
    default:
      return Xm(e, t);
  }
}
function Ji(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((s) => s.id === e.id) : e.kind === "powerWire" ? n.wires.some((s) => s.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((s) => s.id === e.id);
}
const pg = {
  select: zt,
  box: Qh,
  wall: Jh,
  door: Ph,
  window: sf,
  opening: Oh,
  zone: Zh,
  "device-select": zt,
  ceiling_light: Ih,
  wall_light: ef,
  motion_sensor: Bh,
  illuminance_sensor: Sh,
  climate_sensor: Gh,
  wall_switch: Vh,
  smart_button: Th,
  valve: Xh,
  leak_sensor: vc,
  socket: gc,
  exhaust_fan: mc,
  equipment: Nr,
  "binding-select": zt,
  "zone-pick": zt,
  "power-select": zt,
  "power-device": Nr,
  "power-bus": Wh,
  "power-battery": Ah,
  "power-pv": bc,
  "power-transfer": qh,
  "power-remainder": Eh
}, zc = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${pg[t]}></path>`}</svg>`;
function hg(t) {
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
function fg(t) {
  return v`
    <div class="top"><div class="bar">
      ${t.lead ?? w}
      ${t.plans.length > 1 ? v`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${q(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => v`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : w}
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
        ${hg(t)}${t.saveState === "error" && t.errorMessage ? v`: ${t.errorMessage}` : w}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${h("action.save")}</button>
    </div>${t.steps}</div>`;
}
const mg = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Dc(t, e, n) {
  return Io(t).map((i) => {
    const s = t === "plan" ? Oc[i] : void 0, o = h(`tool.${i}`);
    return v`
      ${mg.includes(i) ? v`<div class="tool-sep"></div>` : w}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${s ?? w}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${s ?? w}
        title=${s ? `${o} (${s})` : o} @click=${() => n(i)}>
        ${zc(i)}<span class="tlabel">${o}</span></button>`;
  });
}
function gg(t, e, n) {
  return v`<div class="tools">${Dc(t, e, n)}</div>`;
}
const _n = ["plan", "equipment", "binding", "power", "automation"], Dt = (t, e, n) => h(t === 1 ? e : n).replace("{n}", String(t));
function bg(t, e, n, i, s = 0) {
  const { walls: o, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((u) => u.invalid).length, c = a ? `, ${h("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${Dt(o.length, "steps.wall", "steps.walls")}, ${Dt(r.length, "steps.zone", "steps.zones")}${c}`,
        done: o.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: Dt(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Ys(l.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: Dt(i.blocks.length, "steps.block", "steps.blocks"), done: nh(i) };
    case "automation":
      return { text: Dt(s, "steps.rule", "steps.rules"), done: s > 0 };
  }
}
const nl = (t, e) => h(t).replace("{step}", h(`mode.${e}`));
function vg(t) {
  const e = _n.indexOf(t.mode), n = _n[e - 1], i = _n[e + 1];
  return v`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${q(t.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => t.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${_n.map((s, o) => {
    const r = bg(s, t.level, t.status, t.power, t.rules), l = s === t.mode;
    return v`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : w} @click=${() => t.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? v`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${nl("steps.back", n)}</button>` : w}
        ${i ? v`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${nl("steps.next", i)}</button>` : w}
      </div>
    </nav>`;
}
function wg(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Nc(t) {
  const e = t.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return wa(t, Ks(h("device.equipment"), e));
}
function Eo(t) {
  if (St(t)) return h("props.inverter");
  const e = Bu(t);
  return e ? h(`deviceRole.${e}`) : "";
}
function Oi(t) {
  const e = h(`device.${t.props.kind}`), n = Eo(t);
  return n ? `${e} · ${n}` : e;
}
function $g(t) {
  const e = wg(t.level);
  return v`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => t.onNew()}>${h("devices.new")}</button>
    </div>
    ${e.length === 0 ? w : v`<div class="pdevs">
      ${e.map((n) => v`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Eo(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const yg = ["unbound", "bound", "all"], xg = /* @__PURE__ */ new WeakMap(), qt = (t) => t.placement.mode === "none";
function Tc(t) {
  return Me(xg, t, (e) => [...e.devices].sort((n, i) => Number(qt(n)) - Number(qt(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function kg(t, e, n) {
  const i = Tc(t), s = e === null ? -1 : i.findIndex((o) => o.id === e);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Vc = (t) => h(`device.${t.props.kind}`), il = (t) => t.props.kind === "equipment" ? Eo(t) : Vc(t), Mg = (t, e) => t === "all" || t === "bound" == (e === "bound");
function _g(t, e, n) {
  return e === 0 ? h("binding.noDevices") : n || t.filter === "all" ? h("binding.noMatch") : h(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function sl(t) {
  const e = h(t.collapsed ? "binding.expand" : "binding.collapse");
  return v`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function Ag(t) {
  var l;
  if (t.collapsed) return v`<div class="blist collapsed">${sl(t)}</div>`;
  const e = Tc(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Ys(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), s = e.filter(({ d: a, st: c }) => Mg(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || Vc(a).toLowerCase().includes(i) || il(a).toLowerCase().includes(i))), o = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const u = Wd(a);
    return v`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${h(`bindstatus.${c}`)} title=${h(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${il(a)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return v`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${yg.map((a) => v`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${h(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${sl(t)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${q(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? v`<p class="empty">${_g(t, e.length, i)}</p>` : v`
          ${s.filter((a) => !qt(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => qt(a.d)) ? v`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((a) => qt(a.d)).map((a) => r(a.d, a.st))}
          </div>` : w}`}
      </div>
    </div>`;
}
function P(t, e) {
  return v`<label class="row"><span>${t}</span>${e}</label>`;
}
function J(t, e, n, i) {
  return v`<select class="val" data-field=${i ?? w} .value=${q(t)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = t);
  }}>
    ${e.map((s) => v`<option value=${s.v} ?selected=${s.v === t}>${s.label}</option>`)}
  </select>`;
}
function Ke(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var s;
    return (s = t.setNotice) == null ? void 0 : s.call(t, i);
  };
  return v`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? w}
    placeholder=${t.placeholder ?? w} title=${t.placeholder ?? w} .value=${q(e)}
    @change=${(i) => {
    const s = i.target;
    if (t.onBlank && s.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const o = un(s.value, t.rule);
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
function Sg() {
  return {
    door: { width: zn.door, hinge: "start", swing: "left" },
    window: { width: zn.window, outside: "left" },
    opening: { width: zn.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Ig(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Hc(t) {
  return Ks(h("zones.default"), t.zones.map((e) => e.name));
}
const Eg = (t) => t === "door" || t === "window" || t === "opening";
function Cg(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return w;
  const n = t.tool, i = e[n].width, s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return v`
    <h4>${h(`props.next.${n}`)}</h4>
    ${P(`${h("props.width")}, ${h("unit.mm")}`, Ke({
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
      ${P(h("props.hinge"), J(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${P(h("props.swing"), J(e.door.swing, s, (r) => {
    r !== e.door.swing && o({ swing: r });
  }, "next-swing"))}` : w}
    ${n === "window" ? P(h("props.outside"), J(
    e.window.outside,
    s,
    (r) => {
      r !== e.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : w}`;
}
class Lg {
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
const Ls = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Zt = (t) => typeof t == "string" && t ? t : null, ol = (t) => typeof t == "number" && Number.isFinite(t), Ps = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Rc(t) {
  return t.switchesMigrated || !t.devices.some(Ps) ? t : { ...t, switchesMigrated: !0 };
}
function Pg(t, e, n) {
  const i = wa(t, n);
  let s = i.level;
  const o = Ls(e.switch) ? e.switch : {}, r = [["power", Zt(e.power)], ["voltage", Zt(e.voltage)], ["control", Zt(o.entity)]];
  for (const [l, a] of r) a && (s = ui(s, i.id, l, a));
  return o.controllable === !0 && (s = wi(s, i.id, !0)), { level: s, id: i.id };
}
function Og(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Ls(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!Ls(l)) return l;
      if (l.kind === "meter" && Zt(l.id) && ol(l.x) && ol(l.y)) {
        s++;
        const a = Pg(e, l, Zt(l.name) ?? `Meter ${s}`);
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
        return a === !0 && typeof l.deviceId == "string" && (e = xa(e, l.deviceId, !0)), o = !0, c;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Ps)) {
    for (const s of t.level.devices) Ps(s) && (e = wi(e, s.id, !0));
    e = Rc(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
class zg {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await Gi(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(Jo(h("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = ke(e);
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
    const n = await wh(this.h.hass, e);
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
        this.h.plans = await Gi(this.h.hass);
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
      this.h.notice = ke(n);
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
    this.h.toolId = Io(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(Jo(h("plan.default"))), this.offerDraft(null);
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
            await yh(this.h.hass, e.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = ke(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Gi(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== e.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = ke(o);
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
    this.h.plan = { ...e, levels: e.levels.map(iu) };
    const n = Og({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = th(n.power, { device: (o) => n.level.devices.find((r) => r.id === o) }), s = e.rules && e.rules.length > 0 ? e.rules : void 0;
    this.h.history = new Lg({ level: n.level, ...i ? { power: i } : {}, ...s ? { rules: s } : {} }), this.h.lazyPower = Ja(), this.h.activeTool.cancel(), this.h.activeTool = Cs(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: s } = this.h.history.current, o = e.levels.map((c, u) => u === 0 ? Rc(n) : c), { power: r, rules: l, ...a } = e;
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
class Dg {
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
    !n || !Hp(n.states, e) ? this.base = { states: e, meta: Vp(e) } : n.states = e;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Bp(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Rp(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", ke(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const An = Xl("", "");
function Ng(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? An;
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
    openingDefaults: (e) => Ig(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Hc(((e = t.history) == null ? void 0 : e.current.level) ?? An);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? An).devices;
      return { device: (i) => e.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : rc(((n = t.history) == null ? void 0 : n.current.level) ?? An, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Bc = Object.keys(Js), Tg = (t) => Bc.includes(t);
function Vg() {
  return Object.fromEntries(Bc.map((t) => [t, je(t, "free")]));
}
const Fc = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -wt, max: wt, signed: !0 }, bad: "props.badAim" }
}, Gt = (t, e, n, i, s) => Ke({ ...Fc[i], value: n, field: e, setNotice: t.onNotice, apply: s, skipSame: !0 }), Hg = ["round", "linear", "spot"], Rg = ["rect", "circle"], ii = (t, e) => t.map((n) => ({ v: n, label: h(`${e}.${n}`) }));
function Uc(t, e, n, i) {
  const s = (r, l, a) => P(`${h(l)}, ${h("unit.mm")}`, Gt(t, n + r, a, "mm", (c) => i({ [r]: c }))), o = (r, l, a) => P(`${h(l)}, ${h("unit.deg")}`, Gt(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return v`
        ${P(h("props.shape"), J(e.shape, ii([...Hg], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? v`${s("length", "props.length", e.length)}${s("width", "props.width", e.width)}` : e.shape === "round" ? s("diameter", "props.diameter", e.diameter) : w}
        ${P(`${h("props.poolRadius")}, ${h("unit.mm")}`, Ke({
        ...Fc.mm,
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
        .value=${q(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Gd.map((r) => v`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return v`
        ${P(h("props.shape"), J(e.shape, ii([...Rg], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? v`${s("width", "props.width", e.width)}${s("depth", "props.depth", e.depth)}` : s("diameter", "props.diameter", e.diameter)}
        ${P(h("props.icon"), Fg(t, e.icon, `${n}icon`, i))}
        ${P(h("props.label"), v`<input class="val wide" type="text" data-field=${`${n}label`} .value=${q(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    default:
      return v`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const Bg = /^mdi:[a-z0-9-]+$/;
function Fg(t, e, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!Bg.test(o)) {
      r(e), (l = t.onNotice) == null || l.call(t, h("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), o !== e && !i({ icon: o }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? v`<ha-icon-picker data-field=${n} .value=${q(e)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : v`<input class="val wide" type="text" data-field=${n} .value=${q(e)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function lt(t, e, n, i) {
  return P(e, v`<input type="checkbox" data-field=${t} .checked=${q(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Ug(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? w : lt("wallMount", h("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function Wg(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? w : v`
    ${lt("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = t.onInverter) == null ? void 0 : o.call(t, s)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? lt("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = t.onControllable) == null ? void 0 : o.call(t, s)) ?? !1;
  }) : v`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function jg(t, e) {
  const n = e.placement;
  if (n.mode === "none") return w;
  if (n.mode === "free")
    return P(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      Gt(t, "rotation", n.rotation, "rotation", (s) => t.onPlacement({ ...n, rotation: s }))
    );
  const i = Yl.has(e.props.kind);
  return v`
    ${P(h("props.side"), J(n.side, ii(["left", "right"], "side"), (s) => t.onPlacement({ ...n, side: s }), "side"))}
    ${P(`${h("props.offset")}, ${h("unit.mm")}`, Gt(
    t,
    "offset",
    n.offset,
    "offset",
    (s) => t.onPlacement({ ...n, offset: s })
  ))}
    ${i ? P(
    `${h("props.aim")}, ${h("unit.deg")}`,
    Gt(t, "aim", n.aim ?? 0, "aim", (s) => t.onPlacement(Oa(n, s)))
  ) : w}`;
}
function Co(t, e) {
  return P(h("props.name"), v`<input class="val wide" type="text" data-field="name" .value=${q(t.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = t.name;
      return;
    }
    s !== t.name && e(s);
  }} />`);
}
function qg(t, e) {
  const n = e.props.kind;
  return Kl(n) ? n === "smart_button" && e.placement.mode === "free" ? v`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : P(h("props.type"), J(
    n,
    ii(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = t.onKind) == null ? void 0 : s.call(t, i);
    },
    "kind"
  )) : w;
}
function Zg(t, e) {
  const n = t.level ? pp(t.level, e) : [];
  return v`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? v`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => v`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function Gg(t, e) {
  const n = e.placement.mode !== "none";
  return v`
    <h4>${Oi(e)}</h4>
    ${Co(e, (i) => t.onDevice({}, i))}
    ${qg(t, e)}
    ${n ? Uc(t, e.props, "", (i) => t.onDevice(i)) : w}
    ${Ug(t, e)}
    ${jg(t, e)}
    ${Wg(t, e)}
    ${n ? Zg(t, e) : w}
    ${e.invalid ? v`<p class="warn">${h("props.invalidDevice")}</p>` : w}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${h("action.delete")}</button>`;
}
function Kg(t) {
  return t.device ? Gg(t, t.device) : t.nextKind && t.nextProps ? v`
      <h4>${h("props.nextDevice")}: ${h(`device.${t.nextKind}`)}</h4>
      ${Uc(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? lt(
    "next-wallMount",
    h("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : w}` : v`<p class="muted">${h("props.none")}</p>`;
}
function Xg(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, s = Tg(t.toolId) ? t.toolId : null, o = (a) => a === e ? (t.setNotice(h("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const u = Gm(e, a, c);
    return o(u ? Gn(e, a.id, u) : e);
  };
  return v`<div class="props">
    ${Kg({
    device: i,
    level: e,
    nextKind: s,
    nextProps: s ? t.nextProps[s] : null,
    onDevice: (a, c) => !!i && o(mn(e, i.id, a, c)),
    onKind: (a) => !!i && o(Fu(e, i.id, a)),
    onPlacement: (a) => !!i && o(Gn(e, i.id, a)),
    onZone: (a, c) => !!i && o(Wa(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(sc(e, t.power, i.id, a)),
    onControllable: (a) => !!i && o(wi(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      s && t.setNextProps({ ...t.nextProps, [s]: { ...t.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(ic(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? v`<p class="warn">${t.notice}</p>` : w}
    ${i ? w : $g({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: () => {
      const a = Nc(e);
      t.commit(a.level), t.pickDevice(a.id);
    }
  })}
  </div>`;
}
const Os = (t) => h(`zones.kind.${t.shape.kind}`), Lo = (t) => v`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? Nh : Yh}></path>`}</svg>`;
function Wc(t, e) {
  const n = Da(t, e);
  return n ? h(`zones.invalid.${n}`) : null;
}
function Yg(t) {
  var s;
  const e = t.query.trim().toLowerCase(), n = ((s = t.selection) == null ? void 0 : s.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((o, r) => ({ z: o, hue: ko(r) })).filter(({ z: o }) => !e || o.name.toLowerCase().includes(e) || Os(o).toLowerCase().includes(e));
  return v`
    <div class="zlist">
      <div class="zhead"><span>${h("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${h("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${h("zones.filter")}
        aria-label=${h("zones.filter")} .value=${q(t.query)}
        @input=${(o) => t.onQuery(o.target.value)} />
      <div class="rows">
        ${i.map(({ z: o, hue: r }) => {
    var a;
    const l = o.invalid ? Wc(t.level, o) ?? "" : null;
    return v`<button class="zrow${o.id === n ? " sel" : ""}" data-id=${o.id} @click=${() => t.onPick(o.id)}>
            ${l === null ? v`<span class="zswatch" style=${`background:${r}`}></span>` : v`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${o.name}</span>
            <span class="zkind" data-kind=${o.shape.kind} title=${Os(o)}>${Lo(o.shape.kind)}</span>
            <span class="zarea">${((a = lo(t.level, o)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
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
const Po = Ei(class extends Ci {
  constructor(t) {
    if (super(t), t.type !== Te.PROPERTY && t.type !== Te.ATTRIBUTE && t.type !== Te.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!hc(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === ge || e === w) return e;
    const n = t.element, i = t.name;
    if (t.type === Te.PROPERTY) {
      if (e === n[i]) return ge;
    } else if (t.type === Te.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return ge;
    } else if (t.type === Te.ATTRIBUTE && n.getAttribute(i) === e + "") return ge;
    return xo(t), e;
  }
}), jc = (t, e, n) => v`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Po(e)}
    @change=${(i) => n(i.target.checked)} />${h("zones.automation")}</label>`;
function Qg(t, e, n) {
  const i = Et(t, e.id);
  return v`<div class="zmembers">
    <div class="zhead"><span>${h("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? v`<span>${h("zones.participates")}</span>` : w}</div>
    ${i.length === 0 ? v`<p class="muted">${h("zones.noMembers")}</p>` : i.map(({ device: s, participates: o }) => v`
      <label class="member" data-device=${s.id}>
        <span class="nm"><span class="name">${s.name}</span><small class="kind">${h(`device.${s.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${Po(o)}
          @change=${(r) => {
    const l = Wa(t, s.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function rl(t, e, n) {
  const i = Wc(t, e), s = e.shape.kind === "walls" && e.shape.broken;
  return v`<div class="zprops">
    <h4>${h("props.zone")}</h4>
    ${P(h("props.name"), v`<input class="val wide" type="text" data-field="zone-name" .value=${q(e.name)}
      @change=${(o) => {
    const r = o.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(xp(t, e.id, l));
  }} />`)}
    ${P(h("props.area"), v`<span class="val ro" data-field="zone-area">${$c(lo(t, e))}</span>`)}
    ${P(h("zones.outline"), v`<span class="val ro zkindval" data-field="zone-kind">${Lo(e.shape.kind)}${Os(e)}</span>`)}
    ${jc("zone-automation", e.automation !== !1, (o) => {
    const r = ho(t, e.id, o);
    r !== t && n(r);
  })}
    ${i ? v`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${s ? v`<button class="btn" data-action="keep-outline" @click=${() => n(Ap(t, e.id))}>
        ${h("zones.keepOutline")}</button>` : w}</div>` : w}
    ${Qg(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Ua(t, e.id))}>
      ${h("zones.delete")}</button>
  </div>`;
}
function Jg(t) {
  const e = t.next.zone, n = e.name ?? Hc(t.level), i = (s) => t.setNext({ ...t.next, zone: { ...e, ...s } });
  return v`
    <h4>${h("props.nextZone")}</h4>
    <div class="muted">${h("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${h("zones.method")}>
      ${["walls", "polygon"].map((s) => v`
        <button class=${e.method === s ? "on" : ""} role="radio" aria-checked=${String(e.method === s)} data-method=${s}
          @click=${() => {
    s !== e.method && t.onMethod(s);
  }}>${Lo(s)}<span>${h(`zones.kind.${s}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${h(`zones.hint.${e.method}`)}</p>
    ${P(h("props.name"), v`<input class="val wide" type="text" data-field="next-zone-name" .value=${q(n)}
      @change=${(s) => {
    const o = s.target, r = o.value.trim();
    if (!r) {
      o.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${jc("next-zone-automation", e.automation, (s) => i({ automation: s }))}`;
}
function qc(t, e, n) {
  return Ke({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function ll(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function e1(t, e) {
  const n = ie(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], s = (o) => e.commit(Np(e.level, t.id, o));
  return v`
    <h4>${h("props.wall")}</h4>
    ${P(h("props.type"), J(
    t.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${P(h("props.thickness"), qc(e, t.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${P(h("props.baseline"), J(
    t.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: h(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${P(h("props.length"), v`<span class="val ro">${nt(n)} ${h("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(bo(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function t1(t, e) {
  const n = ["door", "window", "opening", ...qn.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Hu(e.level, t.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = qn.includes(t.kind);
  return v`
    <h4>${h(`kind.${t.kind}`)}</h4>
    ${P(h("props.kind"), J(t.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(Vu(t, r))))}
    ${P(h("props.width"), qc(e, t.width, (r) => ll(e, Tu(e.level, t.id, r))))}
    ${P(h("props.offset"), Ke({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => ll(e, ma(e.level, t.id, r))
  }))}
    ${o ? v`
      ${P(h("props.hinge"), J(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${P(h("props.swing"), J(t.swing ?? "left", s, (r) => i({ swing: r })))}` : w}
    ${t.kind === "window" ? P(h("props.outside"), J(t.outside ?? "left", s, (r) => i({ outside: r }))) : w}
    ${P(h("props.passesLight"), v`<input type="checkbox" data-field="passesLight" .checked=${q(ua(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === da(t.kind) ? void 0 : l });
  }} />`)}
    ${P(h("props.passesPir"), v`<input type="checkbox" data-field="passesPir" .checked=${q(ha(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === pa(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? v`<p class="warn">${h("props.invalidOpening")}</p>` : w}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(ga(e.level, t.id))}>
      ${h("action.delete")}</button>`;
}
function n1(t) {
  const e = ["bearing", "partition", "railing"];
  return v`
    <h4>${h("props.newWall")}</h4>
    ${P(h("props.type"), v`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => v`<option value=${n} ?selected=${n === t.wallType}>${h(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${P(`${h("props.thickness")}, ${h("unit.mm")}`, Ke({
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
      </div>` : w}`;
}
const al = (t) => Yg({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function i1(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const s = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((o) => o.id === n.id) : void 0;
    return v`<div class="props">
      ${Jg({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : w}
      ${s ? rl(e, s, t.commit) : w}
      ${al(t)}
    </div>`;
  }
  let i = w;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = e.walls.find((o) => o.id === n.id);
    s && (i = e1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = e.openings.find((o) => o.id === n.id);
    s && (i = t1(s, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = e.zones.find((o) => o.id === n.id);
    s && (i = rl(e, s, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = e.nodes.find((o) => o.id === n.id);
    s && (i = v`<h4>${h("props.node")}</h4>
      ${P("X", v`<span class="val ro">${nt(s.x)}</span>`)}${P("Y", v`<span class="val ro">${nt(s.y)}</span>`)}`);
  }
  return v`
    <div class="props">
      ${i === w && (t.tool === "wall" || t.tool === "box") ? n1(t) : i === w && Eg(t.tool) ? Cg({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === w && t.tool === "select" ? al(t) : i === w ? v`<p class="muted">${h("props.none")}</p>` : i}
      ${t.notice ? v`<p class="warn">${t.notice}</p>` : w}
    </div>`;
}
function s1(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const cl = /* @__PURE__ */ new WeakMap();
function Oo(t, e, n) {
  let i = cl.get(t);
  i || cl.set(t, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(e);
  s || i.set(e, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : s1(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function Vn(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? t.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: o.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Sn = (t) => t ?? w;
var o1 = Object.defineProperty, wn = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && o1(e, n, s), s;
};
const r1 = 100;
let l1 = 0;
const a1 = (t) => v`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, Ho = class Ho extends gt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${l1++}`, this.shown = null, this.onOutside = (e) => {
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
        if (s.length === r1) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${Sn(this.label || void 0)} title=${Sn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? v`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : w}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return v`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Sn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((s, o) => v`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Sn(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${e.length === 0 ? v`<div class="empty">${this.emptyText()}</div>` : w}
      ${n ? v`<div class="hint">${h("combo.more")}</div>` : w}
    </div>`;
  }
  render() {
    return v`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : w}</div>`;
  }
};
Ho.styles = Bl`
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
let Ze = Ho;
wn([
  ze()
], Ze.prototype, "value");
wn([
  ze()
], Ze.prototype, "label");
wn([
  B()
], Ze.prototype, "isOpen");
wn([
  B()
], Ze.prototype, "query");
wn([
  B()
], Ze.prototype, "active");
var c1 = Object.defineProperty, zo = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && c1(e, n, s), s;
};
const d1 = {
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
}, dl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, u1 = { light: "light", switch: "switch", event: "event", fan: "fan" };
function ul(t, e) {
  return t != null && t.deviceClass && dl[t.deviceClass] ? dl[t.deviceClass] : u1[(t == null ? void 0 : t.domain) ?? Ka(e)] ?? "generic";
}
const pl = (t) => a1(d1[t]);
function p1(t) {
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
class zi extends Ze {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = Vn(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? Vn(this.meta, e) : null;
    return v`${pl(e ? ul(this.meta.entities.get(e), e) : "generic")}
      ${n ? v`<span><b>${n.name}</b>${n.context !== n.name ? v`<small>${n.context}</small>` : w}<small class="eid">${e}</small></span>` : v`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const s = Ya(this.states, e.entityId) ?? "unavailable";
    return v`${pl(ul(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${p1(e.domain)}<br>${s}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = Vn(this.meta, e).name;
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
zo([
  ze({ attribute: !1 })
], zi.prototype, "meta");
zo([
  ze({ attribute: !1 })
], zi.prototype, "items");
zo([
  ze({ attribute: !1 })
], zi.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", zi);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, e, !1), Kt(s, e);
  return !0;
}, si = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, Zc = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), m1(e);
  }
};
function h1(t) {
  this._$AN !== void 0 ? (si(this), this._$AM = t, Zc(this)) : this._$AM = t;
}
function f1(t, e = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (e) if (Array.isArray(i)) for (let o = n; o < i.length; o++) Kt(i[o], !1), si(i[o]);
  else i != null && (Kt(i, !1), si(i));
  else Kt(this, t);
}
const m1 = (t) => {
  t.type == Te.CHILD && (t._$AP ?? (t._$AP = f1), t._$AQ ?? (t._$AQ = h1));
};
class g1 extends Ci {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), Zc(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, s;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (Kt(this, e), si(this));
  }
  setValue(e) {
    if (hc(this._$Ct)) this._$Ct._$AI(e, this);
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
const b1 = () => new v1();
class v1 {
}
const es = /* @__PURE__ */ new WeakMap(), w1 = Ei(class extends g1 {
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
      let n = es.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), es.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = es.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), $1 = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], y1 = { min: 1, max: 10 };
function Gc(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const zs = (t, e, n) => Gc(t, mn(t.level, e.id, n));
function ts(t, e, n, i) {
  return v`<div class="cflag">${P(e, v`<input type="checkbox" data-field=${t} .checked=${q(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const ns = "__other", Nt = /* @__PURE__ */ new Set();
function x1(t, e, n, i, s) {
  const o = `${e.id}:${n}`, r = Qo.includes(i), l = !r || Nt.has(o), a = b1(), c = [...Qo.map((d) => ({ v: d, label: d })), { v: ns, label: h("binding.eventOther") }];
  return v`<span class="evfield">${J(l ? ns : i, c, (d) => {
    if (d === ns) {
      Nt.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    Nt.delete(o), a.value && (a.value.hidden = !0), d !== i ? s(d) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${w1(a)} data-field=${`${n}-event-custom`} ?hidden=${Po(!l)}
      .value=${q(r ? "" : i)} @change=${(d) => {
    var m;
    const p = d.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, t.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, t.setFieldNotice(null), f !== i) {
      s(f) && Nt.delete(o);
      return;
    }
    if (Nt.delete(o), r) {
      p.hidden = !0;
      const $ = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      $ && ($.value = i);
    }
  }} /></span>`;
}
function k1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return v`${w}`;
  const s = i[n], o = (r) => zs(t, e, { [n]: { ...s, ...r } });
  return v`<div class="trigger" data-trigger=${n}>
    ${P(h("binding.slot"), J(
    String(s.slot),
    $1(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${P(h("binding.event"), x1(t, e, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function M1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return v`
      ${ts(
      "autoByDoubleToggle",
      h("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => zs(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? v`<div class="cflag">${P(h("binding.window"), Ke({
      value: i.windowSec,
      rule: y1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => zs(t, e, { windowSec: l })
    }))}</div>` : w}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return v`${w}`;
  const s = (l, a) => (c) => {
    var d, p;
    const u = mn(t.level, e.id, { [l]: c });
    return Gc(t, c && !((d = e.bindings) != null && d[a]) ? ui(u, e.id, a, ((p = e.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = ts("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : v`${ts("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? w : r}`;
}
function _1(t) {
  return t.props.kind !== "smart_button" || !Zd(t).length ? v`${w}` : v`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function Ds(t, e) {
  return e === "control" && t.props.kind === "equipment" ? h("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? h("binding.onOff") : h(`role.${e}`);
}
const is = (t) => String(t).padStart(2, "0");
function A1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${is(e.getHours())}:${is(e.getMinutes())}:${is(e.getSeconds())}`;
}
const S1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function I1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : h("output.errorNotConfigured") : t.last ? h("output.last").replace("{event}", S1(t.last, t.kind)).replace("{time}", A1(t.last.at)) : h("output.none");
}
function E1(t, e) {
  if (!hi(e.props.kind)) return w;
  const n = t.feed.stateOf(e), i = n ? I1(n) : t.feed.error ?? (t.feed.ready ? h("output.notSaved") : null);
  return i === null ? w : v`<p class="note" data-field="output">${i}</p>`;
}
function C1(t, e, n, i) {
  const s = Qa(t.meta, i, t.states), o = qd(t.level, e, n);
  return v`
    ${s === "missing" ? v`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : w}
    ${s === "unavailable" ? v`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : w}
    ${o.length ? v`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : w}`;
}
function L1(t, e, n) {
  var l;
  const { role: i } = n, s = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, o = !!t.showAll[i], r = Ds(e, i);
  return v`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => t.onShowAll(i)} />${h("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Oo(t.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = ui(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Xs(i) ? k1(t, e, i) : w}
    ${s ? C1(t, e, i, s) : w}
  </div>`;
}
function P1(t) {
  const e = t.device, n = Ys(t.level.devices.map(t.status));
  return v`<div class="props bprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : w}
    ${t.fieldNotice ? v`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : w}
    ${t.registryError ? v`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${h(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : w}
    ${e ? v`
      <h4>${Oi(e)}</h4>
      ${Co(e, (i) => t.commit(mn(t.level, e.id, {}, i)))}
      ${E1(t, e)}
      ${Ie(e).map((i) => v`${L1(t, e, i)}${M1(t, e, i.role)}`)}
      ${_1(e)}` : v`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const O1 = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, z1 = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, D1 = 6, N1 = ["A", "0", "B"], T1 = ["power", "control"], V1 = ["power", "power_in", "power_out", "voltage", "control"], Mt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function Tt(t, e, n, i) {
  const { [n]: s, ...o } = e, r = i === null ? o : { ...o, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function Vt(t, e, n, i, s, o) {
  return v`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Oo(t.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function H1(t, e) {
  const n = e.name ?? "";
  return P(h("props.name"), v`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${e.kind}`)} .value=${q(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? t.commitPower(rn(t.power, e.id, { name: o }, Mt(t))) : s.value = n;
  }} />`);
}
function R1(t, e) {
  const n = new Set(Ie(e).map((i) => i.role));
  return v`${T1.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = e.bindings) == null ? void 0 : o[i];
    return v`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? v`<b>${Vn(t.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function In(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function B1(t, e) {
  var o;
  const n = Ie(e), i = V1.flatMap((r) => n.filter((l) => l.role === r)), s = e.props;
  return v`
    ${Co(e, (r) => In(t, mn(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return v`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Ds(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Oo(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Ds(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), In(t, ui(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = e.bindings) != null && o.control) ? lt(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => In(t, wi(t.level, e.id, r))
  ) : w}
    ${s.kind === "equipment" ? lt("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const l = sc(t.level, t.power, e.id, r);
    return In(t, l.level, l.power);
  }) : w}`;
}
function F1(t, e) {
  const n = t.level.devices.find((s) => s.id === e.deviceId);
  if (!n) return v`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
  const i = St(n) ? w : lt("output", h("power.enableOutput"), e.output !== !1, (s) => {
    const o = Mt(t);
    if (s) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(_i(rn(t.power, e.id, { output: !1 }, o), e.deviceId, o));
    return !0;
  });
  return n.props.kind === "equipment" ? v`${B1(t, n)}${i}` : v`
    ${P(h("props.name"), v`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${P(h("props.kind"), v`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${R1(t, n)}${i}`;
}
function U1(t, e) {
  var s, o;
  const n = (o = (s = t.frame) == null ? void 0 : s.blocks[e.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return v`
    ${P(h("power.form"), J(e.form, i, (r) => {
    r !== e.form && t.commitPower(rn(t.power, e.id, { form: r }, Mt(t)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${N1.map((r) => v`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function W1(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, s = n ? e.h : e.w, o = (a, c) => {
    if (a === i && c === s) return !1;
    t.commitPower(rn(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, Mt(t)));
  }, r = (a, c, u) => Ke({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: u }), l = ["h", "v"].map((a) => ({ v: a, label: h(`power.orientation.${a}`) }));
  return v`
    ${P(h("power.orientation"), J(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(rn(t.power, e.id, { w: e.h, h: e.w }, Mt(t)));
  }, "bus-orientation"))}
    ${P(h("power.busLength"), r("bus-length", i, (a) => o(Math.max(Es, s + 1, a), s)))}
    ${P(h("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(D1, a), i - 1))))}`;
}
function j1(t, e) {
  switch (e.kind) {
    case "grid":
      return v`
      ${Vt(t, "power", h("power.field.power"), tt, e.power, (n) => Tt(t, e, "power", n))}
      ${Vt(t, "voltage", h("power.field.voltage"), O1, e.voltage, (n) => Tt(t, e, "voltage", n))}`;
    case "device":
      return F1(t, e);
    case "battery":
      return v`
      ${Vt(t, "power", h("power.field.batteryPower"), tt, e.power, (n) => Tt(t, e, "power", n))}
      ${Vt(t, "soc", h("power.field.soc"), z1, e.soc, (n) => Tt(t, e, "soc", n))}`;
    case "pv":
      return Vt(t, "power", h("power.field.power"), tt, e.power, (n) => Tt(t, e, "power", n));
    case "transfer":
      return U1(t, e);
    case "bus":
      return W1(t, e);
    default:
      return w;
  }
}
function q1(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((s) => s.id === e.deviceId) : void 0;
  return v`
    <h4>${i ? Oi(i) : h(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? w : H1(t, e)}
    ${j1(t, e)}
    <div class="pactions">
      ${n ? v`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Xp(t.power, e.id))}>${h("power.autoPorts")}</button>` : w}
      ${e.kind === "grid" ? w : v`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(tc(t.power, e.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function Z1(t, e) {
  var s, o;
  const n = Mt(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? Si(l, n) || h(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return v`
    <h4>${h("power.wire")}</h4>
    ${P(h("power.wire.from"), v`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${P(h("power.wire.to"), v`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${P(h("power.wire.power"), v`<span class="val ro" data-field="wire-power">${mt((o = (s = t.frame) == null ? void 0 : s.wires[e.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(oc(t.power, e.id))}>${h("action.delete")}</button></div>`;
}
function G1(t) {
  const e = rc(t.level, t.power);
  return v`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Nc(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${h("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${h("power.help.device")}</p>
    ${e.length === 0 ? v`<p class="muted" data-note="no-devices">${h("power.noDevices")}</p>` : v`<div class="pdevs">
      ${e.map((i) => v`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${Oi(i)}</span>
      </button>`)}
    </div>`}`;
}
function K1(t) {
  if (t.toolId === "power-device") return G1(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((s) => s.id === e.id) : void 0;
  if (n) return q1(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((s) => s.id === e.id) : void 0;
  return i ? Z1(t, i) : t.toolId !== "power-select" ? v`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : v`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function X1(t) {
  return v`<div class="props pprops">
    ${t.notice ? v`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : w}
    ${t.feedError ? v`<p class="note" data-notice="feed">${t.feedError}</p>` : w}
    ${K1(t)}
  </div>`;
}
const Ns = 3600;
function Lt(t) {
  return { id: Y(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const Y1 = (t, e) => [...t, e], Q1 = (t, e) => t.map((n) => n.id === e.id ? e : n), J1 = (t, e) => t.filter((n) => n.id !== e);
function eb(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const tb = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, oi = (t) => [...t.inputs, ...t.gate ? [t.gate] : []].flatMap(tb), nb = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, ib = (t, e) => t.filter((n) => n.id !== e && oi(n).includes(e));
function sb(t, e) {
  const n = new Map(t.map((o) => [o.id, o]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), s = (o, r) => {
    if (o === e.id && r.length > 0) return r;
    if (r.includes(o) || i.has(o)) return null;
    const l = n.get(o);
    if (!l) return null;
    for (const a of oi(l)) {
      const c = s(a, [...r, o]);
      if (c) return c;
    }
    return i.add(o), null;
  };
  for (const o of oi(e)) {
    const r = s(o, [e.id]);
    if (r) return r;
  }
  return null;
}
const hl = /^([01]\d|2[0-3]):[0-5]\d$/, _t = (t) => typeof t == "number" && Number.isFinite(t);
function ob(t) {
  const e = t.source;
  if ("light" in e) return _t(e.below) && e.below > 0 && _t(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && hl.test(n) && hl.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const fl = (t) => Number.isInteger(t) && t >= 0 && t <= Ns;
function rb(t, e, n, i, s, o, r, l, a, c) {
  var $;
  const u = [];
  e.name.trim() || u.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && u.push("inputs");
  const d = [...e.inputs, ...e.gate ? [e.gate] : []], p = [...d.flatMap(nb), ...e.onTrue.map((b) => b.device), ...e.onFalse.map((b) => b.device)], f = d.flatMap((b) => "light" in b.source ? [b.source.light] : []);
  (p.some((b) => !n(b)) || f.some((b) => !(s ?? n)(b)) || e.vent && [e.vent.sensor, e.vent.than].some((b) => !(o ?? n)(b)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block))) && u.push("device-missing");
  const m = new Set(t.map((b) => b.id));
  oi(e).some((b) => b !== e.id && !m.has(b)) && u.push("rule-missing"), sb(t, e) && u.push("cycle"), (!fl(e.onDelay) || !fl(e.offDelay)) && u.push("delay");
  for (const b of d) {
    const g = ob(b);
    g && !u.includes(g) && u.push(g);
  }
  return e.vent && lb(e, e.vent) && u.push("vent"), e.boiler && ab(e, e.boiler) && u.push("boiler"), ($ = e.boiler) != null && $.button && c && !u.includes("device-missing") && !c(e.boiler.button) && u.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((b) => {
    const g = i(b.device);
    return g !== void 0 && !g.includes(b.do);
  }) && u.push("action"), u;
}
function lb(t, e) {
  if (t.inputs.length > 0 || t.gate || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !_t(e.above) || !_t(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function ab(t, e) {
  if (t.vent || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !_t(n.limit) || !_t(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const cb = (t) => t.boiler !== void 0, Ts = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function db(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Kc = 3e3, Xc = 1400;
function ub(t, e, n) {
  var c;
  const i = Lt(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const s = e === null ? void 0 : t.levels.find((u) => u.zones.some((d) => d.id === e)), o = s ? Et(s, e).filter((u) => u.participates).map((u) => u.device) : [], r = o.filter(Ts), l = o.filter((u) => u.props.kind === "wall_switch" || u.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((c = t.power) == null ? void 0 : c.blocks) ?? []).filter((u) => u.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Kc, nominal: Xc }), i;
}
const pb = (t) => t.vent !== void 0, hb = 600;
function fb(t, e, n) {
  var l;
  const i = Lt(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = hb;
  const s = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), o = s ? Et(s, e).filter((a) => a.participates).map((a) => a.device) : [], r = o.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = o.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
function mb(t, e, n) {
  const i = Lt(e);
  if (i.name = e !== null && n ? `Leak ${n} -> valve` : "Leak -> valve", e === null) return i;
  const s = t.levels.find((l) => l.zones.some((a) => a.id === e));
  if (!s) return i;
  const o = Et(s, e).filter((l) => l.participates).map((l) => l.device);
  i.inputs = o.filter((l) => l.props.kind === "leak_sensor").map((l) => ({ source: { device: l.id } }));
  const r = o.filter((l) => l.props.kind === "valve");
  return r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "close" }]), i;
}
const Yc = 1800;
function gb(t, e, n, i) {
  const s = Lt(e);
  return s.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", s.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Yc } } }], s;
}
function bb(t, e, n) {
  var r;
  const i = Lt(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light", i.combine = "all";
  const s = e === null ? void 0 : t.levels.find((l) => l.zones.some((a) => a.id === e)), o = s ? (r = Et(s, e).find((l) => l.participates && l.device.props.kind === "illuminance_sensor")) == null ? void 0 : r.device.id : void 0;
  return i.inputs = [
    { source: { light: o ?? "", below: 10, hysteresis: 5, unknownDark: !0 } },
    { source: { sun: !0 } },
    { source: { time: { from: "17:00", to: "01:00" } } }
  ], i.gate = { source: { held: { sources: [], state: "any", seconds: Yc } } }, i;
}
const vb = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve"]), ss = (t) => vb.has(t.props.kind);
function Ue(t) {
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" ? ["on", "off"] : [];
}
function Hn(t, e) {
  const n = (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([o], [r]) => o < r ? -1 : 1)) : s;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function Do(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Qc(t) {
  const e = `${h(`rules.did.${t.action}`)} ${t.target} ${Do(t.at)}`.trim();
  return t.error ? `${e}: ${t.error}` : e;
}
function wb(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${h("rules.status.error")}: ${e.reason}` : h(`rules.status.${e.status}`) : t.enabled === !1 ? h("rules.status.disabled") : n.live ? h("rules.unsaved") : h("rules.noTrace");
}
function $b(t, e, n) {
  const i = n.trace(t.id), s = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", o = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !Hn(r, t);
  return v`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${s} role="img" aria-label=${h(`rules.verdict.${s}`)}
        title=${h(`rules.verdict.${s}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? v` <span class="orphan">(${h("rules.orphan")})</span>` : w}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${wb(t, i, n)}</span>
        ${l ? v`<span class="runsaved">${h("rules.unsavedChanges")}</span>` : w}
        ${o > 0 ? v`<span class="rwarn">${o === 1 ? h("rules.unknown1") : h("rules.unknownN").replace("{n}", String(o))}</span>` : w}
        ${i != null && i.last ? v`<span class="rlast">${Qc(i.last)}</span>` : w}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${h("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${h("rules.delete")}</button>
      </div>
    </div>`;
}
function yb(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((s) => s.id === e.id) ?? null : null, i = eb(t.rules, (n == null ? void 0 : n.id) ?? null, (s) => t.level.zones.some((o) => o.id === s));
  return v`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : h("rules.noZone")}</h4>
      ${t.feedError ? v`<p class="muted">${t.feedError}</p>` : w}
      ${n === null && i.length === 0 && t.rules.length === 0 ? v`<p class="muted">${h("rules.hint")}</p>` : w}
      ${i.length === 0 ? v`<p class="muted rempty">${h("rules.empty")}</p>` : i.map((s) => $b(s, n === null && s.zoneId !== null, t))}
    </div>`;
}
const Jc = {
  condition: Ch,
  leak: vc,
  timer: Kh,
  outside: nf,
  vent: mc,
  boiler: tf
}, xb = ["condition", "leak", "timer", "outside"], kb = ["vent", "boiler"], Vs = (t) => v`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function Mb(t, e, n) {
  return [
    ...xb.map((i) => v`
      <button class="tool" data-template=${i} title=${h(`rules.template.${i}`)} @click=${() => t(i)}>
        ${Vs(Jc[i])}<span class="tlabel">${h(`rules.template.${i}`)}</span></button>`),
    v`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${h("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${Vs(jh)}<span class="tlabel">${h("rules.automations")}</span></button>`
  ];
}
function _b(t) {
  var o;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), s = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  s !== null && (t.preventDefault(), (o = n[s]) == null || o.focus());
}
function Ab(t, e, n) {
  return v`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${h("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${_b}>
      ${kb.map((i) => v`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${Vs(Jc[i])}<span>${h(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function Sb(t, e) {
  return t.mode === "automation" ? v`<div class="tools">${Dc(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${Mb((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? gg(t.mode, t.toolId, (n) => t.pickTool(n)) : Ag({
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
function Ib(t, e) {
  var i;
  const n = t.selection;
  return P1({
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
function Eb(t, e) {
  var i;
  if (t.mode === "binding") return Ib(t, e);
  if (t.mode === "automation")
    return v`<div class="props">${yb({
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
    return X1({
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
  return t.mode === "equipment" ? Xg({
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
  }) : i1({
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
function Cb(t, e) {
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
function Lb(t, e) {
  const n = t === "zone" ? `${h("tool.zone")} · ${h(`zones.kind.${e}`)}` : h(`tool.${t}`);
  return v`<span class="tool-chip">${zc(t)}${n}</span>`;
}
function Pb(t) {
  return v`
    <div class="status">
      ${Lb(t.tool, t.zoneMethod)}
      ${Cb(t.tool, t.zoneMethod).map(([e, n]) => v`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? v`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${h(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? w : v`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function Ob(t, e) {
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
function zb(t, e, n, i) {
  const s = t.walls;
  if (!s || s.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = s[0], u = Math.hypot(c.x - a.x, c.y - a.y);
    let d = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return d < 0 && (d += 360), { first: nt(u), second: d.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: nt(r), second: nt(l) };
}
function Db(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const Nb = Bl`
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

  /* Both rule dialogs (condition, wet zone ventilation): about 90 % of the viewport; the form scrolls on the left,
     the diagram is on the right, the footer below. */
  .dialog.rdlg { box-sizing: border-box; width: 90%; height: 90%; max-width: none; display: flex; flex-direction: column; padding: 14px 18px; }
  .rsettings > p.muted { margin: 0; }
  .rsettings .rcheck { margin-top: 12px; font-size: 13px; color: var(--ch-text); }
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
`, Tb = 5e-3, Vb = 2, ri = (t) => Math.max(Tb, Math.min(Vb, t));
function Hb(t, e, n) {
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
function Rb(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: ri(Math.min(e, n) / 12e3) };
  const i = t.map((d) => d.x), s = t.map((d) => d.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, c = Math.max(...s) + o, u = ri(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / u / 2, y: (a + c) / 2 - n / u / 2, scale: u };
}
function Bb(t, e, n, i, s) {
  const o = ri(Math.min(s, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / o / 2, y: t.y + t.h / 2 - n / o / 2, scale: o };
}
function Fb(t, e, n) {
  const i = ri(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function Ub(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function ml(t, e, n, i) {
  const s = n / t.scale, o = i / t.scale;
  return e.x >= t.x && e.x <= t.x + s && e.y >= t.y && e.y <= t.y + o ? t : { ...t, x: e.x - s / 2, y: e.y - o / 2 };
}
function Wb(t, e, n, i, s = 1) {
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
const jb = ["Shift", "Control", "Alt", "Meta"], qb = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, Zb = new Map(Object.entries(Oc).map(([t, e]) => [`Key${e}`, t]));
function gl(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class Gb {
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
          this.h.view = Ub(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.view = Fb(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (gl(n) || !this.h.history) return;
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
      const o = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && o ? Zb.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = qb[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || gl(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !jb.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function ed(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function Kb(t) {
  return v`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", ed(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function dt(t, e, n, i) {
  return v`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? v`<p class="muted">${i}</p>` : w}
        <div class="actions">
          ${n.map((s) => v`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Xb(t) {
  var n;
  const e = { action: "cancel", label: h("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? dt(h("draft.title"), h("draft.text").replace("{time}", ed(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => t.discard(i) }
      ]) : w;
    }
    case "new":
      return dt(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return dt(h("delete.title"), h("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return dt(h("delete.rule.title"), h("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: h("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? h("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return dt(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return dt(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return w;
  }
}
const Ht = "plan_studio.draft.", En = "plan_studio.lastPlanId";
function Yb() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Qb(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class Jb {
  constructor(e = Yb, n = 500) {
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
      (n = this.storage()) == null || n.setItem(Ht + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(Ht + e), s = i ? JSON.parse(i) : null;
      return Qb(s) && s.planId === e ? s : null;
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
        if (!(s != null && s.startsWith(Ht))) continue;
        const o = this.read(s.slice(Ht.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(En)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(En, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(En)) === e && n.removeItem(En);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(Ht + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const td = 5e3, nd = 12;
function bl(t) {
  t().catch(() => {
  });
}
class ev {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && bl(n.unsub));
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
          bl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(ke(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= nd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, td));
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
const tv = 5e3, nv = 12;
function vl(t) {
  t().catch(() => {
  });
}
class iv {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && vl(n.unsub));
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
          vl(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(ke(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= nv || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, tv));
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
const sv = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function id(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const sd = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function ov(t, e) {
  var o;
  const n = sd(t, e);
  if (!n || n.state.trim() === "") return;
  const i = sv[((o = n.attributes) == null ? void 0 : o.unit_of_measurement) ?? ""], s = Number(n.state);
  return i === void 0 || !Number.isFinite(s) ? void 0 : s * i;
}
const rv = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function Rn(t, e) {
  const n = t.bindings ?? {}, i = t.props.kind;
  let s = "none", o = !1, r = !1, l;
  const a = (f, m, $) => {
    if (!f) return;
    l = sd(e, f);
    const b = (l == null ? void 0 : l.state) ?? "";
    s = m.includes(b) ? "on" : $.includes(b) ? "off" : "no-data";
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
    const f = rv(l);
    f !== void 0 && (d.timerSince = f);
  }
  const p = Ie(t).some((f) => f.role === "power") ? ov(e, n.power) : void 0;
  return p !== void 0 && Math.round(p) >= 1 && (s === "on" || !r) && (d.power = p), d;
}
function od(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const s = e.props.kind;
    i.push({ text: id(n - t.timerSince), tone: s === "motion_sensor" ? "motion" : s === "leak_sensor" ? "leak" : "device" });
  }
  return t.power !== void 0 && i.push({ text: mt(t.power), tone: "device" }), i;
}
const No = 1046, To = 1.25, ye = 10, ue = 34, rd = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, ld = (t) => Math.floor((t - 20) / 6.6), lv = (t) => Math.floor((t - 20) / 6), pn = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : id(t * 1e3), $e = (t) => 14 + 18 * t;
function Vo(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, s) => _`<text class=${s === 0 ? "fc-t1" : s === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(s)}>${rd(i, s === 0 ? ld(t.w) : lv(t.w))}</text>`)}
      </svg>
    </g>`;
}
function li(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const Le = No, ut = Le / 2, it = 230, Bn = 26, me = 4, wl = 36, ce = $e(2), av = (Le - me * it - (me - 1) * Bn) / 2, $l = 200, Cn = 460, Ye = 330, ad = 40, os = 8, cv = 24, Hs = (Le - Ye * 2 - ad) / 2, yl = Hs + Ye + ad;
function cd(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${h("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${h("rules.unit.min")}` : i === 0 ? `${n} ${h("rules.unit.h")}` : `${n} ${h("rules.unit.h")} ${i} ${h("rules.unit.min")}`;
}
const dd = (t, e) => pn(Math.max(1, Math.ceil((t - e) / 1e3)));
function Rs(t, e = !1) {
  return "light" in t ? `${h("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "sun" in t ? h(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${h(`rules.held.${t.held.state}`)} ${cd(t.held.seconds)}` : "rule" in t ? h("rules.src.rule") : h("rules.src.device");
}
const xl = (t) => Number.isFinite(t) ? String(t) : "?";
function dv(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function uv(t, e) {
  return t.until !== void 0 && t.until > e && t.value !== !0 ? h("rules.flow.trueIn").replace("{t}", dd(t.until, e)) : t.detail;
}
const We = (t) => h(`rules.val.${t === null ? "unknown" : t}`), pe = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function pv(t) {
  if (t <= me) {
    const i = (Le - t * it - (t - 1) * Bn) / 2;
    return Array.from({ length: t }, (s, o) => i + o * (it + Bn));
  }
  const e = t - Math.floor((t - 1) / me) * me, n = Math.floor((me - e) / 2);
  return Array.from({ length: t }, (i, s) => {
    const o = s % me;
    return av + (s >= t - e ? n + o : o) * (it + Bn);
  });
}
function hv(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, s = e.inputs.map((T, K) => {
    const le = (i == null ? void 0 : i[K].value) ?? null;
    return le === null || !T.not ? le : !le;
  }), o = i ? dv(e.combine, s) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, c = (n == null ? void 0 : n.unknownInputs) ?? 0, u = e.gate ? n == null ? void 0 : n.gate : void 0, d = e.gate ? u ? u.value === !0 ? h("rules.flow.open") : u.value === null ? `${h("rules.flow.closed")}, ${h("rules.val.unknown")}` : u.until !== void 0 && u.until > t.now ? `${h("rules.flow.closed")}, ${h("rules.flow.opensIn").replace("{t}", dd(u.until, t.now))}` : `${h("rules.flow.closed")}${u.detail ? `, ${u.detail}` : ""}` : Rs(e.gate.source) : "", p = h("rules.flow.delay").replace("{on}", xl(e.onDelay)).replace("{off}", xl(e.offDelay)), f = n === void 0 ? p : `${We(r ?? null)}${l ? `, ${h("rules.flow.pending").replace("{to}", We(l.to)).replace("{t}", pn(a))}` : ""}`, m = e.inputs.length, $ = Math.ceil(m / me), b = pv(m), g = (T) => ye + T * (ce + wl), y = (T) => g(Math.floor(T / me)), x = (T) => g(T) + ce + (T === $ - 1 ? ue : wl) / 2, M = m === 0 ? ye : g($ - 1) + ce + ue, k = M + ce + ue, S = k + ce + ue, I = (e.gate ? S : k) + ce, L = I + ue / 2, N = I + ue, H = N + cv, z = Math.max(1, e.onTrue.length, e.onFalse.length), V = H + z * (ce + os) - os + ye, W = [
    { side: "true", x: Hs, list: e.onTrue, head: h("rules.whenTrue") },
    { side: "false", x: yl, list: e.onFalse, head: h("rules.whenFalse") }
  ], Z = [];
  b.forEach((T, K) => Z.push(`M${T + it / 2} ${y(K) + ce} V${x(Math.floor(K / me))}`));
  for (let T = 0; T < $; T++) {
    const K = [ut, ...b.slice(T * me, (T + 1) * me).map((le) => le + it / 2)];
    Math.max(...K) > Math.min(...K) && Z.push(`M${Math.min(...K)} ${x(T)} H${Math.max(...K)}`);
  }
  m > 0 && Z.push(`M${ut} ${x(0)} V${M}`), Z.push(`M${ut} ${M + ce} V${k}`), e.gate && Z.push(`M${ut} ${k + ce} V${S}`), Z.push(`M${ut} ${I} V${L} H${Hs + Ye / 2} V${N}`, `M${ut} ${L} H${yl + Ye / 2} V${N}`);
  const Q = (T) => Vo({ ...T, h: ce, focused: t.focused === T.field, onClick: () => t.onFocus(T.target) });
  return v`
    <div class="flow">
      <svg class="fc" style=${`max-width:${Le * To}px`} viewBox=${`0 0 ${Le} ${V}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${h("rules.flow.title")}>
        ${Z.map((T) => _`<path class="fc-link" d=${T}></path>`)}
        ${e.inputs.map((T, K) => {
    const le = i == null ? void 0 : i[K];
    return Q({
      x: b[K],
      y: y(K),
      w: it,
      field: `input-${K}`,
      target: { input: K },
      cls: le ? pe(le.value) : "",
      lines: [`${T.not ? "NOT " : ""}${t.inputName(T)}`, le ? uv(le, t.now) : Rs(T.source, T.not === !0)]
    });
  })}
        ${Q({
    x: (Le - $l) / 2,
    y: M,
    w: $l,
    field: "combine",
    target: "gate",
    cls: o === void 0 ? "" : pe(o),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...o === void 0 ? [] : [We(o)]]
  })}
        ${Q({
    x: (Le - Cn) / 2,
    y: k,
    w: Cn,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : pe(r ?? null),
    lines: [h("rules.flow.result"), f]
  })}
        ${e.gate ? Q({
    x: (Le - Cn) / 2,
    y: S,
    w: Cn,
    field: "gate-input",
    target: "gate-input",
    cls: u ? pe(u.value) : "",
    lines: [`${h("rules.flow.gate")}: ${e.gate.not ? "NOT " : ""}${t.inputName(e.gate)}`, d]
  }) : w}
        ${W.map((T) => _`
          <text class="fc-head" text-anchor="middle" x=${T.x + Ye / 2} y=${N + 14}>${T.head}</text>
          ${T.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${T.x + Ye / 2} y=${H + ce / 2 + 4}>${h("rules.noActions")}</text>` : T.list.map((K, le) => Q({
    x: T.x,
    y: H + le * (ce + os),
    w: Ye,
    field: `action-${T.side}-${le}`,
    target: { action: T.side, index: le },
    cls: "",
    lines: [t.actionName(K.device), fv(K.do)]
  }))}`)}
      </svg>
      ${c > 0 ? v`<p class="fc-warn">${c === 1 ? h("rules.unknown1") : h("rules.unknownN").replace("{n}", String(c))}</p>` : w}
      ${n != null && n.held ? v`<p class="fc-warn" data-note="held">${h("rules.flow.heldNote")}</p>` : w}
      ${n != null && n.last ? v`<p class="fc-last">${h("rules.flow.last")} ${Qc(n.last)}</p>` : w}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const fv = (t) => h(`rules.act.${t}`), kl = { s: 1, min: 60, h: 3600 }, mv = ["s", "min", "h"];
function gv(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const ai = (t) => Number.isFinite(t) ? String(t) : "";
function Ml(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const Bs = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? h("rules.missingDevice") : t.ruleName(e.rule) ?? h("rules.missingRule");
};
function ud(t, e) {
  var i;
  const n = e.source;
  return "device" in n || "rule" in n ? Bs(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? h("rules.light.noSensor") : "sun" in n ? h("rules.src.sun") : "time" in n ? h("rules.src.time") : n.held.sources.length === 0 ? h("rules.src.held") : `${h("rules.src.held")}: ${n.held.sources.map((s) => Bs(t, s)).join(", ")}`;
}
const Fs = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function bv(t, e) {
  return "device" in e || "rule" in e ? Fs(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "held" in e ? e.held.sources.some((n) => Fs(t, n)) : !1;
}
function pd(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "light" ? { light: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", below: 10, hysteresis: 5 } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function hd(t) {
  return v`
    <optgroup label=${h("rules.groupDevices")}>
      ${t.inputDevices.map((e) => v`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? v`<optgroup label=${h("rules.groupRules")}>
      ${t.otherRules.map((e) => v`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : w}`;
}
function _l(t, e) {
  return v`
    <option value="">${e}</option>
    ${hd(t)}
    <optgroup label=${h("rules.groupConditions")}>
      ${["light", "sun", "time", "held"].map((n) => v`<option value=${n}>${h(`rules.src.${n}`)}</option>`)}
    </optgroup>`;
}
function vv(t, e, n, i) {
  const s = t.draft.rule, o = e === "true" ? "onTrue" : "onFalse", r = s[o], l = (p) => t.onChange({ ...s, [o]: p }), a = t.deviceById(i.device), c = a ? Ue(a) : [], u = c.includes(i.do) ? c : [...c, i.do], d = li({ action: e, index: n });
  return v`
    <div class="rline" data-field=${d} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(p) => {
    const f = t.deviceById(p.target.value);
    f && l(r.map((m, $) => $ === n ? { device: f.id, do: Ue(f).includes(m.do) ? m.do : Ue(f)[0] } : m));
  }}>
        ${a && !t.actionDevices.includes(a) ? v`<option value=${a.id}>${a.name}</option>` : w}
        ${a ? w : v`<option value=${i.device}>${h("rules.missingDevice")}</option>`}
        ${t.actionDevices.map((p) => v`<option value=${p.id}>${p.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(p) => l(r.map((f, m) => m === n ? { ...f, do: p.target.value } : f))}>
        ${u.map((p) => v`<option value=${p}>${h(`rules.act.${p}`)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${h("rules.remove")} @click=${() => l(r.filter((p, f) => f !== n))}>&times;</button>
    </div>`;
}
function Al(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return v`
    <div class="rgroup">
      <div class="rlabel">${h(e === "true" ? "rules.whenTrue" : "rules.whenFalse")}</div>
      ${n[i].map((s, o) => vv(t, e, o, s))}
      <select class="radd" data-action=${`add-action-${e}`} .value=${""}
        @change=${(s) => {
    const o = s.target, r = t.deviceById(o.value);
    o.value = "", r && Ue(r).length > 0 && t.onChange({ ...n, [i]: [...n[i], { device: r.id, do: Ue(r)[0] }] });
  }}>
        <option value="">${h("rules.addAction")}</option>
        ${t.actionDevices.map((s) => v`<option value=${s.id}>${s.name}</option>`)}
      </select>
    </div>`;
}
const rs = (t) => t.trim() === "" ? NaN : Number(t);
function wv(t, e, n, i) {
  var s, o;
  if ("light" in n) {
    const r = n.light === "" ? void 0 : t.lightUnit(n.light);
    return v`
      <div class="rparams">
        <label class="grow">${h("rules.light.sensor")}
          <select data-part="light" data-value=${n.light}
            @change=${(l) => i({ ...n, light: l.target.value })}>
            ${t.lightSensors.some((l) => l.id === n.light) ? w : v`<option value=${n.light}>${((s = t.deviceById(n.light)) == null ? void 0 : s.name) ?? h("rules.light.noSensor")}</option>`}
            ${t.lightSensors.map((l) => v`<option value=${l.id}>${l.name}</option>`)}
          </select></label>
        <label>${h("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${ai(n.below)}
            @input=${(l) => i({ ...n, below: rs(l.target.value) })} /> lx</label>
        <label>${h("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${ai(n.hysteresis)}
            @input=${(l) => i({ ...n, hysteresis: rs(l.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(l) => {
      const { unknownDark: a, ...c } = n;
      i(l.target.checked ? { ...c, unknownDark: !0 } : c);
    }} /> ${h("rules.light.unknownDark")}</label>
        ${r !== void 0 && r !== "lx" ? v`<p class="rwarn" data-warn="light-unit">${h("rules.light.unit").replace("{unit}", r)}</p>` : w}
      </div>`;
  }
  if ("time" in n)
    return v`
      <div class="rparams">
        <label>${h("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(r) => i({ time: { ...n.time, from: r.target.value } })} /></label>
        <label>${h("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(r) => i({ time: { ...n.time, to: r.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const r = n.held, l = ((o = t.draft.units) == null ? void 0 : o[e]) ?? gv(r.seconds), a = Number.isFinite(r.seconds) ? String(+(r.seconds / kl[l]).toFixed(4)) : "", c = (u) => i({ held: { ...r, ...u } });
    return v`
      <div class="rparams">
        <div class="rsources">
          ${r.sources.length === 0 ? v`<span class="muted">${h("rules.held.noSources")}</span>` : w}
          ${r.sources.map((u, d) => v`
            <span class="rchip${Fs(t, u) ? " bad" : ""}" data-part="source">${Bs(t, u)}
              <button class="btn" data-action="remove-source" title=${h("rules.held.removeSource")}
                @click=${() => c({ sources: r.sources.filter((p, f) => f !== d) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(u) => {
      const d = u.target, p = pd(t, d.value);
      d.value = "", p && ("device" in p || "rule" in p) && c({ sources: [...r.sources, p] });
    }}>
            <option value="">${h("rules.held.addSource")}</option>
            ${hd(t)}
          </select>
        </div>
        <label>${h("rules.held.state")}
          <select data-part="state" data-value=${r.state}
            @change=${(u) => c({ state: u.target.value })}>
            ${["on", "off", "any"].map((u) => v`<option value=${u}>${h(`rules.held.${u}`)}</option>`)}
          </select></label>
        <label>${h("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${a}
            @input=${(u) => {
      var d;
      ((d = t.draft.units) == null ? void 0 : d[e]) === void 0 && t.onUnit(e, l), c({ seconds: Math.round(rs(u.target.value) * kl[l]) });
    }} />
          <select data-part="unit" data-value=${l} @change=${(u) => t.onUnit(e, u.target.value)}>
            ${mv.map((u) => v`<option value=${u}>${h(`rules.unit.${u}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return w;
}
function Sl(t, e, n, i) {
  const s = e.source, o = "light" in s || "sun" in s || "time" in s || "held" in s, r = "light" in s ? "light" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return v`
    <div class="rline${bv(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${o ? h(`rules.src.${r}`) : ud(t, e)}${"sun" in s ? v` <span class="muted">${e.not ? h("rules.sun.above") : Rs(s)}</span>` : w}</span>
      <label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(l) => {
    const a = l.target.checked, { not: c, ...u } = e;
    i(a ? { ...u, not: !0 } : u);
  }} /> ${h("rules.not")}</label>
      <button class="btn" data-action="remove-input" title=${h("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${wv(t, n, s, (l) => i({ ...e, source: l }))}
    </div>`;
}
function $v(t) {
  const e = t.draft.rule, n = (s) => (o) => {
    const r = o.target, l = r.value ? pd(t, r.value) : null;
    r.value = "", l && s(l);
  }, i = (s) => {
    const { gate: o, ...r } = e;
    t.onChange(s ? { ...r, gate: s } : r);
  };
  return v`
    <div class="rsettings">
      <label class="rlabel" for="rule-name">${h("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${h("rules.namePlaceholder")}
        @input=${(s) => t.onChange({ ...e, name: s.target.value })} />

      <label class="rlabel" for="rule-combine">${h("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(s) => t.onChange({ ...e, combine: s.target.value === "all" ? "all" : "any" })}>
        <option value="any">${h("rules.combine.any")}</option>
        <option value="all">${h("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${h("rules.inputs")}</div>
        ${e.inputs.length === 0 ? v`<p class="muted">${h("rules.noInputs")}</p>` : e.inputs.map((s, o) => Sl(
    t,
    s,
    li({ input: o }),
    (r) => t.onChange({ ...e, inputs: r ? e.inputs.map((l, a) => a === o ? r : l) : e.inputs.filter((l, a) => a !== o) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${n((s) => t.onChange({ ...e, inputs: [...e.inputs, { source: s }] }))}>
          ${_l(t, h("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${h("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${h("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${Ns} step="1" .value=${ai(e.onDelay)}
              @input=${(s) => t.onChange({ ...e, onDelay: Ml(s.target.value) })} /></label>
          <label class="grow">${h("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${Ns} step="1" .value=${ai(e.offDelay)}
              @input=${(s) => t.onChange({ ...e, offDelay: Ml(s.target.value) })} /></label>
        </div>
      </div>

      <div class="rgroup">
        <div class="rlabel">${h("rules.gate")}</div>
        <p class="muted">${h("rules.gate.hint")}</p>
        ${e.gate ? Sl(t, e.gate, li("gate-input"), i) : v`<select class="radd" data-action="set-gate" .value=${""} @change=${n((s) => i({ source: s }))}>
            ${_l(t, h("rules.gate.set"))}
          </select>`}
      </div>

      ${Al(t, "true")}
      ${Al(t, "false")}
    </div>`;
}
function yv(t) {
  const e = t.draft.rule, n = e.zoneId === null || t.zones.some((s) => s.id === e.zoneId), i = (s) => t.onFocus(li(s));
  return v`
    <div class="backdrop rule-backdrop" @change=${(s) => s.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${h(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}>
        <h3>${h(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit")}</h3>
        <div class="rcols">
          ${$v(t)}
          ${hv({
    rule: e,
    inputName: (s) => ud(t, s),
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
          ${t.problems.map((s) => v`<li data-problem=${s}>${h(`rules.problem.${s}`)}</li>`)}</ul>` : w}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${h("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(s) => t.onChange({ ...e, zoneId: s.target.value || null })}>
            <option value="">${h("rules.zone.none")}</option>
            ${n ? w : v`<option value=${e.zoneId}>${h("rules.zone.removed")}</option>`}
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
const hn = No, Xt = 330, fd = 40, Ft = 460, Us = (hn - Xt * 2 - fd) / 2, Il = Us + Xt + fd, ls = (hn - Ft) / 2, as = hn / 2, cs = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), El = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", xv = (t) => `${t > 0 ? "+" : ""}${t} %`, Rt = (t, e) => Vo({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function Cl(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${cs(n.t)} °C` : "", n.rh !== null ? `${cs(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${cs(n.ah)} g/m³` : "—"];
}
function kv(t) {
  var Z, Q, T;
  const e = t.rule, n = e.vent, i = t.trace, s = i == null ? void 0 : i.inputs[0], o = s == null ? void 0 : s.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((Z = e.onTrue[0]) == null ? void 0 : Z.device) ?? "", c = Cl(r, h("vent.sensor"), o == null ? void 0 : o.a), u = Cl(l, h("vent.than"), o == null ? void 0 : o.b), d = $e(Math.max(c.length, u.length)), p = h("vent.flow.vs").replace("{a}", r).replace("{b}", l), f = o ? `: ${o.pct === null ? We(null) : xv(o.pct)}` : s ? `: ${s.detail}` : "", m = o ? `${rd(p, ld(Ft) - f.length)}${f}` : `${p}${f}`, $ = h("vent.flow.margins").replace("{above}", El(n.above)).replace("{below}", El(n.below)), b = i == null ? void 0 : i.pending, g = b ? Math.max(0, Math.ceil((b.at - t.now) / 1e3)) : 0, y = h("vent.flow.runon").replace("{t}", cd(e.offDelay)), x = [
    i ? `${h("rules.flow.result")}: ${We(i.verdict)}` : h("rules.flow.result"),
    b ? `${y} (${h("vent.pending").replace("{to}", b.to ? "on" : "off").replace("{t}", pn(g))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((Q = e.onTrue[0]) == null ? void 0 : Q.do) ?? "?"} / ${((T = e.onFalse[0]) == null ? void 0 : T.do) ?? "?"}`,
    ...M ? [h("vent.flow.last").replace("{did}", h(`rules.did.${M.action}`)).replace("{at}", Do(M.at))] : []
  ], S = M == null ? void 0 : M.error, I = $e(k.length + (S ? 1 : 0)), L = ye + d + ue, N = L + $e(2) + ue, H = N + $e(2) + ue, z = H + I + ye, V = (K) => _`<path class="fc-link" d=${`M${K + Xt / 2} ${ye + d} V${L - ue / 2} H${as} V${L}`}></path>`, W = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${h("rules.status.error")}: ${i.reason}` : h(`rules.status.${i.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${hn * To}px`} viewBox=${`0 0 ${hn} ${z}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${h("vent.flow.title")}>
        ${V(Us)}${V(Il)}
        <path class="fc-link" d=${`M${as} ${L + $e(2)} V${N} M${as} ${N + $e(2)} V${H}`}></path>
        ${Rt(t, { x: Us, y: ye, w: Xt, h: d, field: "vent-sensor", cls: o != null && o.a.why ? " nodata" : "", lines: c })}
        ${Rt(t, { x: Il, y: ye, w: Xt, h: d, field: "vent-than", cls: o != null && o.b.why ? " nodata" : "", lines: u })}
        ${Rt(t, { x: ls, y: L, w: Ft, h: $e(2), field: "vent-above", cls: s ? pe(s.value) : "", lines: [m, $], tip: `${p}${f}
${$}` })}
        ${Rt(t, { x: ls, y: N, w: Ft, h: $e(2), field: "vent-runon", cls: i ? pe(i.verdict) : "", lines: x })}
        ${Rt(t, { x: ls, y: H, w: Ft, h: I, field: "vent-fan", cls: "", lines: k, err: S })}
      </svg>
      ${W ? v`<p class="fc-warn" data-note="status">${W}</p>` : w}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const ds = (t) => t.trim() === "" ? NaN : Number(t), us = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function ps(t, e, n, i, s) {
  var r;
  const o = n === "" || i.some((l) => l.id === n);
  return v`
    <select data-field=${e} data-value=${n} @change=${(l) => s(l.target.value)}>
      <option value="">${h("vent.pick")}</option>
      ${o ? w : v`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? h("rules.missingDevice")}</option>`}
      ${i.map((l) => v`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function Mv(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: h("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: h("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: h("vent.problem.fan") });
  const s = [...i], o = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((c) => !!c);
  for (const c of t.problems)
    c === "device-missing" && !o.some((u) => !t.deviceById(u)) && !(n.sensor && !t.climateSensors.some((u) => u.id === n.sensor)) && !(n.than && !t.climateSensors.some((u) => u.id === n.than)) || c === "vent" && i.length > 0 || s.push({ key: c, text: h(c === "delay" ? "vent.problem.runon" : `rules.problem.${c}`) });
  return s;
}
function _v(t) {
  var a;
  const e = t.draft.rule, n = e.vent, i = (c) => t.onChange({ ...e, vent: { ...n, ...c } }), s = ((a = e.onTrue[0]) == null ? void 0 : a.device) ?? "", o = e.zoneId === null || t.zones.some((c) => c.id === e.zoneId), r = h("vent.title"), l = Mv(t);
  return v`
    <div class="backdrop rule-backdrop" @change=${(c) => c.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${r}>
        <h3>${r}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${h("vent.hint")}</p>
            <label class="rlabel" for="vent-name">${h("rules.name")}</label>
            <input id="vent-name" data-field="name" type="text" .value=${e.name} placeholder=${h("rules.namePlaceholder")}
              @input=${(c) => t.onChange({ ...e, name: c.target.value })} />

            <label class="rlabel">${h("vent.sensor")}</label>
            ${ps(t, "vent-sensor", n.sensor, t.climateSensors, (c) => i({ sensor: c }))}

            <label class="rlabel">${h("vent.than")}</label>
            ${ps(t, "vent-than", n.than, t.climateSensors, (c) => i({ than: c }))}

            <label class="rlabel">${h("vent.fan")}</label>
            ${ps(t, "vent-fan", s, t.fans, (c) => t.onChange({
    ...e,
    onTrue: c ? [{ device: c, do: "on" }] : [],
    onFalse: c ? [{ device: c, do: "off" }] : []
  }))}

            <div class="vnums">
              <label>${h("vent.above")}
                <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${q(us(n.above))}
                  @input=${(c) => i({ above: ds(c.target.value) })} /></label>
              <label>${h("vent.below")}
                <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${q(us(n.below))}
                  @input=${(c) => i({ below: ds(c.target.value) })} /></label>
              <label>${h("vent.runon")}
                <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${q(us(e.offDelay / 60))}
                  @input=${(c) => t.onChange({ ...e, offDelay: Math.round(ds(c.target.value)) * 60 })} /></label>
            </div>
          </div>
          ${kv({
    rule: e,
    deviceName: (c) => {
      var u;
      return c === "" ? h("vent.pick") : ((u = t.deviceById(c)) == null ? void 0 : u.name) ?? h("rules.missingDevice");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: t.onFocus
  })}
        </div>
        ${l.length > 0 ? v`<ul class="rproblems" role="alert">
          ${l.map((c) => v`<li data-problem=${c.key}>${c.text}</li>`)}</ul>` : w}
        <div class="rfoot">
          <label class="rlabel" for="vent-zone">${h("rules.zone")}</label>
          <select id="vent-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(c) => t.onChange({ ...e, zoneId: c.target.value || null })}>
            <option value="">${h("rules.zone.none")}</option>
            ${o ? w : v`<option value=${e.zoneId}>${h("rules.zone.removed")}</option>`}
            ${t.zones.map((c) => v`<option value=${c.id}>${c.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(c) => {
    const { enabled: u, ...d } = e;
    t.onChange(c.target.checked ? d : { ...d, enabled: !1 });
  }} /> ${h("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${h("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${h("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Av = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, ci = No, md = 460, Sv = (ci - md) / 2, Iv = ci / 2, Ll = (t) => t === null ? We(null) : `${Math.round(t)} W`, Ln = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function Ev(t, e) {
  const n = t.until !== void 0 ? pn(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? h("boiler.phase.heatingCheck").replace("{t}", n) : h("boiler.phase.heating");
    case "waiting":
      return h("boiler.phase.waiting").replace("{t}", n ?? pn(0));
    case "blackout":
    case "limit":
    case "done":
      return h(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function Cv(t) {
  return t.phase === "heating" ? pe(!0) : t.phase !== null ? pe(!1) : pe(t.relay === null ? null : t.relay === "on");
}
function Lv(t) {
  const n = t.rule.boiler, i = n.grid, s = t.trace, o = s == null ? void 0 : s.boiler, r = t.deviceName(n.device), l = [];
  let a = ye;
  const c = (b, g, y, x) => {
    const M = $e(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: b, cls: g, lines: y, err: x }), a += M + ue;
  };
  if (i) {
    c("boiler-grid", o && o.grid === null ? pe(null) : "", [t.gridName(i.block), o ? Ll(o.grid) : h("boiler.flow.gridPower")]);
    const b = h("boiler.flow.formula").replace("{nominal}", Ln(i.nominal)), g = o && o.headroom !== null ? o.headroom > i.limit : null;
    c("boiler-limit", o ? pe(g === null ? null : !g) : "", [
      o ? `${h("boiler.flow.headroom")}: ${g === null ? We(null) : h(g ? "boiler.flow.over" : "boiler.flow.ok")}` : h("boiler.flow.headroom"),
      o && o.headroom !== null ? `${b} = ${Math.round(o.headroom)} / ${Ln(i.limit)} W` : `${b} ≤ ${Ln(i.limit)} W`
    ]);
  }
  c("boiler-button", o ? pe(o.mode === "auto") : "", [
    o ? `${h("boiler.flow.mode")}: ${h(`boiler.mode.${o.mode}`)}` : h("boiler.flow.mode"),
    h("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const u = o ? Ev(o, t.now) : null, d = s == null ? void 0 : s.last;
  c("boiler-relay", o ? Cv(o) : "", [
    o ? `${h("boiler.flow.relay")}: ${o.relay ?? We(null)}` : h("boiler.flow.relay"),
    r,
    ...u ? [u] : [],
    ...d ? [h("vent.flow.last").replace("{did}", h(`rules.did.${d.action}`)).replace("{at}", Do(d.at))] : []
  ], d == null ? void 0 : d.error);
  const p = h("boiler.flow.done");
  c(i ? "boiler-nominal" : "boiler-power", o ? pe(o.boilerW === null ? null : o.boilerW > 1) : "", [
    o ? `${h("boiler.flow.power")}: ${Ll(o.boilerW)}` : h("boiler.flow.power"),
    i ? `${h("boiler.flow.nominal").replace("{w}", Ln(i.nominal))}, ${p}` : p
  ]);
  const f = a - ue + ye, m = l.slice(1).map((b) => `M${Iv} ${b.y - ue} V${b.y}`).join(" "), $ = s && s.status !== "ok" ? s.status === "error" && s.reason ? `${h("rules.status.error")}: ${s.reason}` : h(`rules.status.${s.status}`) : null;
  return v`
    <div class="flow">
      <svg class="vt" style=${`max-width:${ci * To}px`} viewBox=${`0 0 ${ci} ${f}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${h("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((b) => Vo({ x: Sv, w: md, ...b, focused: t.focused === b.field, onClick: () => t.onFocus(b.field) }))}
      </svg>
      ${$ ? v`<p class="fc-warn" data-note="status">${$}</p>` : w}
      ${t.note ? v`<p class="fc-note">${t.note}</p>` : w}
    </div>`;
}
const Pl = (t) => t.trim() === "" ? NaN : Number(t), Ol = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function hs(t, e, n, i, s) {
  const o = e === "" || n.some((r) => r.id === e);
  return v`
    <select data-field=${t} data-value=${e} @change=${(r) => s(r.target.value)}>
      <option value="">${h("vent.pick")}</option>
      ${o ? w : v`<option value=${e}>${i}</option>`}
      ${n.map((r) => v`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function Pv(t) {
  var o;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: h("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: h("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: h("boiler.problem.grid") });
  const i = [...n], s = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((o = e.grid) == null ? void 0 : o.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !s || r === "boiler" && n.length > 0 || i.push({ key: r, text: h(`rules.problem.${r}`) });
  return i;
}
function Ov(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, s = (p) => t.onChange({ ...e, boiler: p }), o = (p) => i && s({ ...n, grid: { ...i, ...p } }), r = (p) => {
    const { grid: f, ...m } = n;
    s(p ? { ...m, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Kc, nominal: Xc } } : m);
  }, l = (p) => {
    var f;
    return ((f = t.deviceById(p)) == null ? void 0 : f.name) ?? h("rules.missingDevice");
  }, a = e.zoneId === null || t.zones.some((p) => p.id === e.zoneId), c = h("boiler.title"), u = Pv(t), d = (p) => {
    var f;
    return p === "" ? h("vent.pick") : ((f = t.deviceById(p)) == null ? void 0 : f.name) ?? h("rules.missingDevice");
  };
  return v`
    <div class="backdrop rule-backdrop" @change=${(p) => p.stopPropagation()}>
      <div class="dialog rdlg" role="dialog" aria-modal="true" aria-label=${c}>
        <h3>${c}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${h("boiler.hint")}</p>
            <label class="rlabel" for="boiler-name">${h("rules.name")}</label>
            <input id="boiler-name" data-field="name" type="text" .value=${e.name} placeholder=${h("rules.namePlaceholder")}
              @input=${(p) => t.onChange({ ...e, name: p.target.value })} />

            <label class="rlabel">${h("boiler.device")}</label>
            ${hs("boiler-device", n.device, t.boilers, l(n.device), (p) => s({ ...n, device: p }))}

            <label class="rlabel">${h("boiler.button")}</label>
            ${hs("boiler-button", n.button, t.buttons, l(n.button), (p) => s({ ...n, button: p }))}

            <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
              @change=${(p) => r(p.target.checked)} /> ${h("boiler.limitOn")}</label>
            ${i ? v`
              <label class="rlabel">${h("boiler.grid")}</label>
              ${hs("boiler-grid", i.block, t.grids, h("boiler.missingGrid"), (p) => o({ block: p }))}
              <div class="vnums">
                <label>${h("boiler.limit")}
                  <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${q(Ol(i.limit))}
                    @input=${(p) => o({ limit: Pl(p.target.value) })} /></label>
                <label>${h("boiler.nominal")}
                  <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${q(Ol(i.nominal))}
                    @input=${(p) => o({ nominal: Pl(p.target.value) })} /></label>
              </div>` : w}
          </div>
          ${Lv({
    rule: e,
    deviceName: d,
    gridName: (p) => {
      var f;
      return p === "" ? h("vent.pick") : ((f = t.grids.find((m) => m.id === p)) == null ? void 0 : f.name) ?? h("boiler.missingGrid");
    },
    trace: t.trace,
    note: t.note,
    now: t.now,
    focused: t.draft.focused,
    onFocus: t.onFocus
  })}
        </div>
        ${u.length > 0 ? v`<ul class="rproblems" role="alert">
          ${u.map((p) => v`<li data-problem=${p.key}>${p.text}</li>`)}</ul>` : w}
        <div class="rfoot">
          <label class="rlabel" for="boiler-zone">${h("rules.zone")}</label>
          <select id="boiler-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(p) => t.onChange({ ...e, zoneId: p.target.value || null })}>
            <option value="">${h("rules.zone.none")}</option>
            ${a ? w : v`<option value=${e.zoneId}>${h("rules.zone.removed")}</option>`}
            ${t.zones.map((p) => v`<option value=${p.id}>${p.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(p) => {
    const { enabled: f, ...m } = e;
    t.onChange(p.target.checked ? m : { ...m, enabled: !1 });
  }} /> ${h("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${h("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${h("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const zv = ["power", "voltage", "power_in", "power_out", "control"], Dv = 300;
function zl(t) {
  t().catch(() => {
  });
}
function Nv(t, e) {
  var s;
  const n = new Map(e.devices.map((o) => [o.id, o])), i = {};
  for (const o of t.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: St(r), controllable: $a(r) };
    for (const a of zv) {
      const c = (s = r.bindings) == null ? void 0 : s[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class Tv {
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
      }, Dv);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && zl(n.unsub));
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
          zl(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(ke(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= nd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, td));
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
const fs = 1e4, Dl = 400, Vv = 1e3, Nl = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), Hv = ["timer", "power"], Rv = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function gd(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], s = (o, r, l = !1) => {
    o && !i.some((a) => a.entity === o) && i.push({ entity: o, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: o } of Ie(t)) (o === "on" || o === "off" || o === "auto") && s(e[o], !1);
  else n === "wall_switch" ? s(e.state, !0) : n === "valve" && s(e.state, !0, !0);
  return i;
}
function Bv(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function Fv(t, e, n) {
  var i;
  if (t.settled) {
    const s = Bv(e.state, t.valve);
    return s === void 0 ? {} : { value: s, text: n && n.last !== s ? s : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (Nl.has(e.state)) return {};
    const s = (i = e.attributes) == null ? void 0 : i.event_type, o = n && n.last !== e.state && typeof s == "string" && s !== "";
    return { value: e.state, text: o ? s : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !Nl.has(e.state) ? e.state : void 0 };
}
function Tl(t, e, n, i) {
  const s = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return od(s, n, i)[0];
}
function Uv(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of gd(n)) e.add(i.entity);
  return [...e].sort();
}
class Wv {
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
    return i && n - i.at < fs ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < Dl).map((r) => r.bubble), s = this.events.get(e), o = s ? n - s.at : -1;
    return s && o >= fs && o < fs + Vv && i.push({ text: s.text, tone: "event", key: s.at }), i;
  }
  updateEvents(e, n, i) {
    const s = gd(e), o = `${e.id}|`, r = new Set(s.map((l) => o + l.entity));
    for (const l of [...this.seen.keys()]) l.startsWith(o) && !r.has(l) && this.seen.delete(l);
    for (const l of s) {
      const a = Rv(n, l.entity);
      if (!a) continue;
      const c = o + l.entity, { value: u, text: d } = Fv(l, a, this.seen.get(c));
      u !== void 0 && this.seen.set(c, { last: u }), d && this.events.set(e.id, { text: d, at: i });
    }
  }
  updateBubbles(e, n, i) {
    const s = Rn(e, n), o = this.bubbles.get(e.id);
    if (o) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < Dl);
      for (const l of Hv) {
        const a = Tl(o, l, e, i);
        a && !Tl(s, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, s);
  }
}
const Pn = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function Vl(t) {
  t().catch(() => {
  });
}
class jv {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Vl(n.unsub));
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
        n.live ? n.unsub = i : Vl(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, s] of Object.entries(e.a ?? {}))
      !s || typeof s.s != "string" || this.map.set(i, { state: s.s, attributes: { ...s.a ?? {} }, last_changed: Pn(s.lc) ?? Pn(s.lu) });
    for (const [i, s] of Object.entries(e.c ?? {})) {
      const o = this.map.get(i);
      if (!o || !s) continue;
      const r = { ...o, attributes: { ...o.attributes } }, l = s["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== o.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const c = Pn(l.lc) ?? (a ? Pn(l.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const a of ((n = s["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
var qv = Object.defineProperty, F = (t, e, n, i) => {
  for (var s = void 0, o = t.length - 1, r; o >= 0; o--)
    (r = t[o]) && (s = r(e, n, s) || s);
  return s && qv(e, n, s), s;
};
const Ro = class Ro extends gt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Kd.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Vg(), this.nextObj = Sg(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Ja(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Jb(), this.resizeObs = null, this.session = new zg(this), this.haMeta = new Dg(this), this.feed = new ev(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new iv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new Tv(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.events = new Wv(), this.entityFeed = new jv(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Ud(i, (s) => {
      var o;
      return Qa(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new kh(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Ng(this), this.activeTool = Cs("select", this.ctx), this.input = new Gb(this);
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
    this.entityFeed.watch(e ? Uv(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? Nv(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((c) => Rn(c, this.hass.states).timerSince !== void 0 || this.events.event(c.id, n) !== null || this.events.leaving(c.id, n).length > 0), s = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, o = !!s && (!!s.pending || s.inputs.some((c) => c.until !== void 0 && c.until > n) || (((l = s.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = s.boiler) == null ? void 0 : a.until) ?? 0) > n);
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
    const i = this.history.current.power, s = n ?? (i && Zp(i, e));
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
      i = { rule: e === "leak" ? mb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? gb({}, u, c && ss(c) ? c.id : null, c && ss(c) ? c.name : "") : e === "outside" ? bb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? fb({ levels: r }, u, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? ub({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, u, (a == null ? void 0 : a.name) ?? null) : Lt(u), isNew: !0, focused: null };
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
    e.isNew ? this.commitRules(Y1(this.rules, e.rule)) : n && !Hn(n, e.rule) && this.commitRules(Q1(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && Hn(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return w;
    const n = this.planLevels(), i = n.flatMap((d) => d.devices), s = e.rule, o = this.session.savedRules.find((d) => d.id === s.id), r = this.shownRuleTrace(s), l = o ? Hn(o, s) ? null : h("rules.flow.edited") : h("rules.flow.new"), a = n.length > 1, c = n.flatMap((d) => d.zones.map((p) => ({ id: p.id, name: a ? `${p.name} (${d.name})` : p.name }))), u = rb(
      this.rules,
      s,
      (d) => i.some((p) => p.id === d),
      (d) => {
        const p = i.find((f) => f.id === d);
        return p && Ue(p);
      },
      (d) => i.some((p) => p.id === d && p.props.kind === "illuminance_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "climate_sensor"),
      (d) => i.some((p) => p.id === d && Ts(p)),
      (d) => i.some((p) => p.id === d && (p.props.kind === "wall_switch" || p.props.kind === "smart_button")),
      (d) => this.boilerGridBlocks().some((p) => p.id === d),
      (d) => {
        const p = i.find((f) => f.id === d);
        return !p || db(p);
      }
    );
    return cb(s) ? Ov({
      draft: e,
      boilers: i.filter(Ts),
      buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
      grids: this.boilerGridBlocks().map((d) => ({ id: d.id, name: d.name || h("power.kind.grid") })),
      deviceById: (d) => i.find((p) => p.id === d),
      zones: c,
      problems: u,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (d) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
      },
      onFocus: (d) => this.focusRuleField(d, Av[d] ?? d),
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    }) : pb(s) ? _v({
      draft: e,
      climateSensors: i.filter((d) => d.props.kind === "climate_sensor"),
      fans: i.filter((d) => {
        const p = Ue(d);
        return p.includes("on") && p.includes("off");
      }),
      deviceById: (d) => i.find((p) => p.id === d),
      zones: c,
      problems: u,
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
    }) : yv({
      draft: e,
      inputDevices: i.filter(ss),
      lightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
      lightUnit: (d) => {
        var m, $, b, g, y;
        const p = ($ = (m = i.find((x) => x.id === d)) == null ? void 0 : m.bindings) == null ? void 0 : $.illuminance, f = p ? (g = (b = this.hass) == null ? void 0 : b.states) == null ? void 0 : g[p] : void 0;
        return (y = f == null ? void 0 : f.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((d) => Ue(d).length > 0),
      deviceById: (d) => i.find((p) => p.id === d),
      otherRules: this.rules.filter((d) => d.id !== s.id),
      ruleName: (d) => {
        var p;
        return (p = this.rules.find((f) => f.id === d)) == null ? void 0 : p.name;
      },
      zones: c,
      problems: u,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (d) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
      },
      onFocus: (d) => this.focusRuleField(d),
      onUnit: (d, p) => {
        const f = this.ruleDraft ?? e;
        this.ruleDraft = { ...f, units: { ...f.units, [d]: p } };
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
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(J1(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Ji(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Ji(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = ic(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? bo(n, e.id) : e.kind === "opening" ? ga(n, e.id) : Ua(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(oc(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = tc(n, e.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = ke(i);
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
    this.selection = s && n && i && Ji(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Cs(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(Io(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const s = ne(n, i);
    s && (this.view = ml(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((o) => o.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const s = Ta(n).get(e);
    s && (this.view = ml(this.view, s, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? kg(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return Hb(this.svgEl(), this.view, e);
  }
  fit() {
    var e;
    this.planView = Rb(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = vh(this.power, this.ctx.geo());
    e && (this.powerView = Bb(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, s;
    return Xb({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((o) => o.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((s = this.dialog) == null ? void 0 : s.kind) === "delete-rule" ? ib(this.rules, this.dialog.id).map((o) => o.name) : [],
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
    var f, m, $, b;
    if (!this.plan || !this.history)
      return v`<div class="center">${this.loadError ? v`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const e = Em(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, u = this.mode === "power", d = Date.now(), p = ($ = this.hass) == null ? void 0 : $.states;
    return v`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : u ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${Db(e)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${fg({
      steps: vg({
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
      lead: this.narrow ? v`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : w,
      onPickPlan: (g) => this.session.pickPlan(g),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Sb(this, n)}
        ${Eb(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(g) => g.preventDefault()}>
            ${this.grid ? Wb(this.view, l, a, e, u ? 0.1 : 1) : w}
            ${this.mode === "power" ? Am(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Jf(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (g) => this.feed.stateOf(g),
      live: (g) => Rn(g, p),
      bubbles: (g) => {
        const y = Rn(g, p), x = this.events.event(g.id, d);
        return {
          shown: [...od(y, g, d), ...x ? [{ text: x.text, tone: "event", key: x.at }] : []],
          leaving: this.events.leaving(g.id, d)
        };
      }
    })}
            ${i.tracker ? Ob(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: zb(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : w}
          </svg>
          ${this.pendingDraft && ((b = this.dialog) == null ? void 0 : b.kind) !== "restore" ? Kb({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : w}
        </div>
        ${Pb({
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
        ${this.automationsMenu ? Ab(this.automationsMenu, (g) => this.pickAutomation(g), () => this.closeAutomationsMenu()) : w}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
Ro.styles = Nb;
let R = Ro;
F([
  ze({ attribute: !1 })
], R.prototype, "hass");
F([
  ze({ type: Boolean })
], R.prototype, "narrow");
F([
  ze({ attribute: !1 })
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
