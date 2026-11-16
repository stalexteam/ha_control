/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Je = globalThis, Ri = Je.ShadowRoot && (Je.ShadyCSS === void 0 || Je.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bi = Symbol(), vs = /* @__PURE__ */ new WeakMap();
let Vo = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== Bi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Ri && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = vs.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && vs.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ql = (e) => new Vo(typeof e == "string" ? e : e + "", void 0, Bi), jo = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new Vo(n, e, Bi);
}, Zl = (e, t) => {
  if (Ri) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = Je.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, $s = Ri ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return ql(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gl, defineProperty: Kl, getOwnPropertyDescriptor: Yl, getOwnPropertyNames: Xl, getOwnPropertySymbols: Ql, getPrototypeOf: Jl } = Object, St = globalThis, xs = St.trustedTypes, ta = xs ? xs.emptyScript : "", Gn = St.reactiveElementPolyfillSupport, ve = (e, t) => e, rn = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ta : null;
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
} }, Hi = (e, t) => !Gl(e, t), ks = { attribute: !0, type: String, converter: rn, reflect: !1, useDefault: !1, hasChanged: Hi };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), St.litPropertyMetadata ?? (St.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let qt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = ks) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && Kl(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Yl(this.prototype, t) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: s, set(r) {
      const l = s == null ? void 0 : s.call(this);
      o == null || o.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ks;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ve("elementProperties"))) return;
    const t = Jl(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ve("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ve("properties"))) {
      const n = this.properties, i = [...Xl(n), ...Ql(n)];
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
      for (const s of i) n.unshift($s(s));
    } else t !== void 0 && n.push($s(t));
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
    return Zl(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : rn).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : rn;
      this._$Em = s;
      const d = a.fromAttribute(n, l.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? Hi)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
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
        const { wrapped: l } = r, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
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
qt.elementStyles = [], qt.shadowRootOptions = { mode: "open" }, qt[ve("elementProperties")] = /* @__PURE__ */ new Map(), qt[ve("finalized")] = /* @__PURE__ */ new Map(), Gn == null || Gn({ ReactiveElement: qt }), (St.reactiveElementVersions ?? (St.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = globalThis, Ms = (e) => e, ln = $e.trustedTypes, _s = ln ? ln.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Wo = "$lit$", Mt = `lit$${Math.random().toFixed(9).slice(2)}$`, qo = "?" + Mt, ea = `<${qo}>`, Ut = document, Se = () => Ut.createComment(""), Ee = (e) => e === null || typeof e != "object" && typeof e != "function", Fi = Array.isArray, na = (e) => Fi(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Kn = `[ 	
\f\r]`, de = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, As = /-->/g, Ss = />/g, Tt = RegExp(`>|${Kn}(?:([^\\s"'>=/]+)(${Kn}*=${Kn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Es = /'/g, Is = /"/g, Zo = /^(?:script|style|textarea|title)$/i, Go = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), y = Go(1), A = Go(2), ot = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), Ps = /* @__PURE__ */ new WeakMap(), Dt = Ut.createTreeWalker(Ut, 129);
function Ko(e, t) {
  if (!Fi(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _s !== void 0 ? _s.createHTML(t) : t;
}
const ia = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = de;
  for (let l = 0; l < n; l++) {
    const a = e[l];
    let d, u, c = -1, p = 0;
    for (; p < a.length && (r.lastIndex = p, u = r.exec(a), u !== null); ) p = r.lastIndex, r === de ? u[1] === "!--" ? r = As : u[1] !== void 0 ? r = Ss : u[2] !== void 0 ? (Zo.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Tt) : u[3] !== void 0 && (r = Tt) : r === Tt ? u[0] === ">" ? (r = s ?? de, c = -1) : u[1] === void 0 ? c = -2 : (c = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? Tt : u[3] === '"' ? Is : Es) : r === Is || r === Es ? r = Tt : r === As || r === Ss ? r = de : (r = Tt, s = void 0);
    const f = r === Tt && e[l + 1].startsWith("/>") ? " " : "";
    o += r === de ? a + ea : c >= 0 ? (i.push(d), a.slice(0, c) + Wo + a.slice(c) + Mt + f) : a + Mt + (c === -2 ? l : f);
  }
  return [Ko(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ie {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [d, u] = ia(t, n);
    if (this.el = Ie.createElement(d, i), Dt.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = Dt.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Wo)) {
          const p = u[r++], f = s.getAttribute(c).split(Mt), m = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? oa : m[1] === "?" ? ra : m[1] === "@" ? la : kn }), s.removeAttribute(c);
        } else c.startsWith(Mt) && (a.push({ type: 6, index: o }), s.removeAttribute(c));
        if (Zo.test(s.tagName)) {
          const c = s.textContent.split(Mt), p = c.length - 1;
          if (p > 0) {
            s.textContent = ln ? ln.emptyScript : "";
            for (let f = 0; f < p; f++) s.append(c[f], Se()), Dt.nextNode(), a.push({ type: 2, index: ++o });
            s.append(c[p], Se());
          }
        }
      } else if (s.nodeType === 8) if (s.data === qo) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(Mt, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += Mt.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = Ut.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Qt(e, t, n = e, i) {
  var r, l;
  if (t === ot) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = Ee(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Qt(e, s._$AS(e, t.values), s, i)), t;
}
class sa {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? Ut).importNode(n, !0);
    Dt.currentNode = s;
    let o = Dt.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new Ui(o, o.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (d = new aa(o, this, t)), this._$AV.push(d), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (o = Dt.nextNode(), r++);
    }
    return Dt.currentNode = Ut, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let Ui = class Yo {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, n, i, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = Qt(this, t, n), Ee(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== ot && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : na(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && Ee(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Ut.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ie.createElement(Ko(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new sa(s, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = Ps.get(t.strings);
    return n === void 0 && Ps.set(t.strings, n = new Ie(t)), n;
  }
  k(t) {
    Fi(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Yo(this.O(Se()), this.O(Se()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = Ms(t).nextSibling;
      Ms(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class kn {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, i, s, o) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = n, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(t, n = this, i, s) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = Qt(this, t, n, 0), r = !Ee(t) || t !== this._$AH && t !== ot, r && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = o[0], a = 0; a < o.length - 1; a++) d = Qt(this, l[i + a], n, a), d === ot && (d = this._$AH[a]), r || (r = !Ee(d) || d !== this._$AH[a]), d === v ? t = v : t !== v && (t += (d ?? "") + o[a + 1]), this._$AH[a] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class oa extends kn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class ra extends kn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
let la = class extends kn {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Qt(this, t, n, 0) ?? v) === ot) return;
    const i = this._$AH, s = t === v && i !== v || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class aa {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Qt(this, t);
  }
}
const Yn = $e.litHtmlPolyfillSupport;
Yn == null || Yn(Ie, Ui), ($e.litHtmlVersions ?? ($e.litHtmlVersions = [])).push("3.3.3");
const ca = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new Ui(t.insertBefore(Se(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bt = globalThis;
let Yt = class extends qt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ca(n, this.renderRoot, this.renderOptions);
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
    return ot;
  }
};
var Uo;
Yt._$litElement$ = !0, Yt.finalized = !0, (Uo = Bt.litElementHydrateSupport) == null || Uo.call(Bt, { LitElement: Yt });
const Xn = Bt.litElementPolyfillSupport;
Xn == null || Xn({ LitElement: Yt });
(Bt.litElementVersions ?? (Bt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const da = { attribute: !0, type: String, converter: rn, reflect: !1, hasChanged: Hi }, ua = (e = da, t, n) => {
  const { kind: i, metadata: s } = n;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(n.name, e), i === "accessor") {
    const { name: r } = n;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, e, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = n;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function vt(e) {
  return (t, n) => typeof n == "object" ? ua(e, t, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function T(e) {
  return vt({ ...e, state: !0, attribute: !1 });
}
function q() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function Mn(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const Ht = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, pa = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, fa = { ...Ht, role: "power_in" }, ha = { ...Ht, role: "power_out" }, ma = ["on", "off", "auto"], Vi = (e) => ma.includes(e), Qn = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), ga = {
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
  smart_button: [Qn("on"), Qn("off"), Qn("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Ht],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, Ht, pa, fa, ha]
}, ji = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, wa = { climate_sensor: "any" };
function Ct(e) {
  const t = e.props, n = ga[t.kind];
  if (t.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
  if (t.kind === "equipment") {
    const i = !!t.inverter;
    return n.filter(({ role: s }) => s === "power" ? !i : s === "power_in" || s === "power_out" ? i : !0);
  }
  return n;
}
function Xo(e) {
  return new Set(Ct(e).map((t) => t.role));
}
function _n(e, t, n, i) {
  var l;
  const s = e.devices.find((a) => a.id === t);
  if (!s || !Xo(s).has(n)) return e;
  const o = (l = s.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const a = { ...s.bindings };
    delete a[n];
    const d = { ...s, bindings: a };
    if (Object.keys(a).length === 0 && delete d.bindings, n === "control" && s.props.kind === "equipment" && s.props.controllable) {
      const { controllable: u, ...c } = s.props;
      d.props = c;
    }
    return { ...e, devices: e.devices.map((u) => u === s ? d : u) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((a) => a === s ? r : a) };
}
function ya(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((l) => !!l), s = Ct(e).filter((l) => l.primary);
  if (i.length === 0) return s.length === 0 ? "bound" : "unbound";
  if (i.some((l) => t(l) === "missing")) return "missing";
  const o = s.filter((l) => !!n[l.role]);
  return (wa[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function ba(e) {
  const t = Ct(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const va = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function gi(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !Vi(t) ? n : `${n}|${va(i[t])}`;
}
function $a(e, t, n) {
  const i = gi(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && Ct(s).some((o) => gi(s, o.role) === i));
}
function xa(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Ct(e)) {
    const s = Vi(i) ? gi(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function An(e) {
  if (!e.bindings) return e;
  const t = Xo(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const ie = (e) => e === "wall_switch" || e === "smart_button", Pe = (e) => e === "wall" ? "wall" : "free", ka = [100, 125, 150], Wi = "mdi:cube-outline", Os = ["single", "double", "hold"];
function F(e) {
  return e.automationZones ?? [];
}
const Ma = {
  bearing: 400
}, tn = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Qo(e = q(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function Cs(e) {
  return {
    id: q(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [Qo()]
  };
}
const qi = {
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
}, Jt = 90, Jo = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function It(e, t) {
  switch (e) {
    case "ceiling_light":
      return { kind: e, shape: "round", diameter: 300, length: 1200, width: 100, poolRadius: null };
    case "wall_light":
      return { kind: e, coneAngle: 90, coneRange: 2e3 };
    case "motion_sensor":
      return { kind: e, zoneAngle: t === "free" ? 360 : 110, zoneRange: 5e3 };
    case "exhaust_fan":
      return { kind: e, diameter: 100 };
    case "equipment":
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Wi, label: "" };
    case "wall_switch":
      return { kind: e, autoByDoubleToggle: !1, windowSec: 3 };
    case "smart_button":
      return {
        kind: e,
        separateOff: !1,
        autoEnabled: !1,
        on: { slot: 0, event: "single" },
        off: { slot: 0, event: "hold" },
        auto: { slot: 0, event: "double" }
      };
    default:
      return { kind: e };
  }
}
const _a = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Wi
};
function Aa(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : _a[String(n)] ?? Wi;
  return { ...e, props: { ...i, icon: s } };
}
function Sa(e) {
  var i;
  if (e.props.kind !== "switch") return e;
  const t = (i = e.bindings) == null ? void 0 : i.action, n = Pe(e.placement.mode);
  return t ? { ...e, props: It("smart_button", n), bindings: { on: t } } : { ...e, props: It("wall_switch", n) };
}
const tr = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function Ea(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = tr(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function Ia(e) {
  const t = e.props.kind;
  if (!ie(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(It(t, Pe(e.placement.mode)))) {
    const r = n[s], l = s === "on" || s === "off" || s === "auto" ? Ea(r, o) : s === "windowSec" ? tr(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    l !== r && ((i ?? (i = { ...n }))[s] = l);
  }
  return i ? { ...e, props: i } : e;
}
function Pa(e) {
  if (e.props.kind !== "climate_sensor" || !("zoneIds" in e.props)) return e;
  const { zoneIds: t, ...n } = e.props;
  return { ...e, props: n };
}
function Oa(e) {
  if (!ie(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function Ca(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => An(Pa(Oa(Ia(Sa(Aa(n)))))));
  return t.some((n, i) => n !== e.devices[i]) ? { ...e, devices: t } : e;
}
function O(e, t) {
  return { x: e.x + t.x, y: e.y + t.y };
}
function E(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function S(e, t) {
  return { x: e.x * t, y: e.y * t };
}
function H(e, t) {
  return e.x * t.x + e.y * t.y;
}
function tt(e, t) {
  return e.x * t.y - e.y * t.x;
}
function er(e) {
  return Math.hypot(e.x, e.y);
}
function C(e, t) {
  return er(E(t, e));
}
function Sn(e) {
  const t = er(e);
  return t === 0 ? { x: 0, y: 0 } : S(e, 1 / t);
}
function Q(e) {
  return { x: e.y, y: -e.x };
}
function Na(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function mt(e, t, n, i) {
  const s = tt(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = tt(E(n, e), i) / s;
  return O(e, S(t, o));
}
function Zi(e, t, n) {
  const i = E(n, t), s = H(i, i);
  return s === 0 ? 0 : H(E(e, t), i) / s;
}
function Vt(e, t, n) {
  const i = E(n, t), s = H(i, i), o = s === 0 ? 0 : Math.max(0, Math.min(1, H(E(e, t), i) / s));
  return C(e, O(t, S(i, o)));
}
function se(e, t) {
  let n = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const o = t[i], r = t[s];
    o.y > e.y != r.y > e.y && e.x < (r.x - o.x) * (e.y - o.y) / (r.y - o.y) + o.x && (n = !n);
  }
  return n;
}
function bt(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) {
    const i = e[n], s = e[(n + 1) % e.length];
    t += i.x * s.y - s.x * i.y;
  }
  return t / 2;
}
let Pt = class {
  constructor(t, n) {
    this.next = null, this.key = t, this.data = n, this.left = null, this.right = null;
  }
};
function La(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function _t(e, t, n) {
  const i = new Pt(null, null);
  let s = i, o = i;
  for (; ; ) {
    const r = n(e, t.key);
    if (r < 0) {
      if (t.left === null) break;
      if (n(e, t.left.key) < 0) {
        const l = t.left;
        if (t.left = l.right, l.right = t, t = l, t.left === null) break;
      }
      o.left = t, o = t, t = t.left;
    } else if (r > 0) {
      if (t.right === null) break;
      if (n(e, t.right.key) > 0) {
        const l = t.right;
        if (t.right = l.left, l.left = t, t = l, t.right === null) break;
      }
      s.right = t, s = t, t = t.right;
    } else break;
  }
  return s.right = t.left, o.left = t.right, t.left = i.right, t.right = i.left, t;
}
function Jn(e, t, n, i) {
  const s = new Pt(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = _t(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function Ns(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = _t(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function za(e, t, n) {
  return t === null ? e : (e === null || (t = _t(e.key, t, n), t.left = e), t);
}
function wi(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && wi(e.left, o, !1, i, s), e.right && wi(e.right, o, !0, i, s);
  }
}
class Gi {
  constructor(t = La) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = Jn(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new Pt(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = _t(t, this._root, s), r = s(t, o.key);
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
    return n === null ? null : (n = _t(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = _t(t, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = _t(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = _t(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    let l = this._root, a;
    for (; o.length !== 0 || l; )
      if (l)
        o.push(l), l = l.left;
      else {
        if (l = o.pop(), a = r(l.key, n), a > 0)
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
    return Da(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && vi(t, n, 0, s - 1, o), this._root === null)
      this._root = yi(t, n, 0, s), this._size = s;
    else {
      const r = Ra(
        this.toList(),
        Ta(t, n),
        o
      );
      s = this._size + s, this._root = bi({ head: r }, 0, s);
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
    return wi(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = Ns(t, this._root, s);
    s(t, n) < 0 ? r = Jn(n, i, r, s) : o = Jn(n, i, o, s), this._root = za(o, r, s);
  }
  split(t) {
    return Ns(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function yi(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], l = t[o], a = new Pt(r, l);
    return a.left = yi(e, t, n, o), a.right = yi(e, t, o + 1, i), a;
  }
  return null;
}
function Ta(e, t) {
  const n = new Pt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new Pt(e[s], t[s]);
  return i.next = null, n.next;
}
function Da(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new Pt(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function bi(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = bi(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = bi(e, s + 1, n), r;
  }
  return null;
}
function Ra(e, t, n) {
  const i = new Pt(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function vi(e, t, n, i, s) {
  if (n >= i) return;
  const o = e[n + i >> 1];
  let r = n - 1, l = i + 1;
  for (; ; ) {
    do
      r++;
    while (s(e[r], o) < 0);
    do
      l--;
    while (s(e[l], o) > 0);
    if (r >= l) break;
    let a = e[r];
    e[r] = e[l], e[l] = a, a = t[r], t[r] = t[l], t[l] = a;
  }
  vi(e, t, n, l, s), vi(e, t, l + 1, i, s);
}
const wt = 11102230246251565e-32, K = 134217729, Ba = (3 + 8 * wt) * wt;
function ti(e, t, n, i, s) {
  let o, r, l, a, d = t[0], u = i[0], c = 0, p = 0;
  u > d == u > -d ? (o = d, d = t[++c]) : (o = u, u = i[++p]);
  let f = 0;
  if (c < e && p < n)
    for (u > d == u > -d ? (r = d + o, l = o - (r - d), d = t[++c]) : (r = u + o, l = o - (r - u), u = i[++p]), o = r, l !== 0 && (s[f++] = l); c < e && p < n; )
      u > d == u > -d ? (r = o + d, a = r - o, l = o - (r - a) + (d - a), d = t[++c]) : (r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p]), o = r, l !== 0 && (s[f++] = l);
  for (; c < e; )
    r = o + d, a = r - o, l = o - (r - a) + (d - a), d = t[++c], o = r, l !== 0 && (s[f++] = l);
  for (; p < n; )
    r = o + u, a = r - o, l = o - (r - a) + (u - a), u = i[++p], o = r, l !== 0 && (s[f++] = l);
  return (o !== 0 || f === 0) && (s[f++] = o), f;
}
function Ha(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function M(e) {
  return new Float64Array(e);
}
const Fa = (3 + 16 * wt) * wt, Ua = (2 + 12 * wt) * wt, Va = (9 + 64 * wt) * wt * wt, Wt = M(4), Ls = M(8), zs = M(12), Ts = M(16), X = M(4);
function ja(e, t, n, i, s, o, r) {
  let l, a, d, u, c, p, f, m, w, b, g, $, x, k, _, P, N, L;
  const R = e - s, U = n - s, Z = t - o, J = i - o;
  k = R * J, p = K * R, f = p - (p - R), m = R - f, p = K * J, w = p - (p - J), b = J - w, _ = m * b - (k - f * w - m * w - f * b), P = Z * U, p = K * Z, f = p - (p - Z), m = Z - f, p = K * U, w = p - (p - U), b = U - w, N = m * b - (P - f * w - m * w - f * b), g = _ - N, c = _ - g, Wt[0] = _ - (g + c) + (c - N), $ = k + g, c = $ - k, x = k - ($ - c) + (g - c), g = x - P, c = x - g, Wt[1] = x - (g + c) + (c - P), L = $ + g, c = L - $, Wt[2] = $ - (L - c) + (g - c), Wt[3] = L;
  let ft = Ha(4, Wt), ce = Ua * r;
  if (ft >= ce || -ft >= ce || (c = e - R, l = e - (R + c) + (c - s), c = n - U, d = n - (U + c) + (c - s), c = t - Z, a = t - (Z + c) + (c - o), c = i - J, u = i - (J + c) + (c - o), l === 0 && a === 0 && d === 0 && u === 0) || (ce = Va * r + Ba * Math.abs(ft), ft += R * u + J * l - (Z * d + U * a), ft >= ce || -ft >= ce)) return ft;
  k = l * J, p = K * l, f = p - (p - l), m = l - f, p = K * J, w = p - (p - J), b = J - w, _ = m * b - (k - f * w - m * w - f * b), P = a * U, p = K * a, f = p - (p - a), m = a - f, p = K * U, w = p - (p - U), b = U - w, N = m * b - (P - f * w - m * w - f * b), g = _ - N, c = _ - g, X[0] = _ - (g + c) + (c - N), $ = k + g, c = $ - k, x = k - ($ - c) + (g - c), g = x - P, c = x - g, X[1] = x - (g + c) + (c - P), L = $ + g, c = L - $, X[2] = $ - (L - c) + (g - c), X[3] = L;
  const Vl = ti(4, Wt, 4, X, Ls);
  k = R * u, p = K * R, f = p - (p - R), m = R - f, p = K * u, w = p - (p - u), b = u - w, _ = m * b - (k - f * w - m * w - f * b), P = Z * d, p = K * Z, f = p - (p - Z), m = Z - f, p = K * d, w = p - (p - d), b = d - w, N = m * b - (P - f * w - m * w - f * b), g = _ - N, c = _ - g, X[0] = _ - (g + c) + (c - N), $ = k + g, c = $ - k, x = k - ($ - c) + (g - c), g = x - P, c = x - g, X[1] = x - (g + c) + (c - P), L = $ + g, c = L - $, X[2] = $ - (L - c) + (g - c), X[3] = L;
  const jl = ti(Vl, Ls, 4, X, zs);
  k = l * u, p = K * l, f = p - (p - l), m = l - f, p = K * u, w = p - (p - u), b = u - w, _ = m * b - (k - f * w - m * w - f * b), P = a * d, p = K * a, f = p - (p - a), m = a - f, p = K * d, w = p - (p - d), b = d - w, N = m * b - (P - f * w - m * w - f * b), g = _ - N, c = _ - g, X[0] = _ - (g + c) + (c - N), $ = k + g, c = $ - k, x = k - ($ - c) + (g - c), g = x - P, c = x - g, X[1] = x - (g + c) + (c - P), L = $ + g, c = L - $, X[2] = $ - (L - c) + (g - c), X[3] = L;
  const Wl = ti(jl, zs, 4, X, Ts);
  return Ts[Wl - 1];
}
function Wa(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), l = (e - s) * (i - o), a = r - l, d = Math.abs(r + l);
  return Math.abs(a) >= Fa * d ? a : -ja(e, t, n, i, s, o, d);
}
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(8);
M(8);
M(8);
M(4);
M(8);
M(8);
M(16);
M(12);
M(192);
M(192);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(8);
M(8);
M(8);
M(8);
M(8);
M(8);
M(8);
M(8);
M(8);
M(4);
M(4);
M(4);
M(8);
M(16);
M(16);
M(16);
M(32);
M(32);
M(48);
M(64);
M(1152);
M(1152);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(4);
M(24);
M(24);
M(24);
M(24);
M(24);
M(24);
M(24);
M(24);
M(24);
M(24);
M(1152);
M(1152);
M(1152);
M(1152);
M(1152);
M(2304);
M(2304);
M(3456);
M(5760);
M(8);
M(8);
M(8);
M(16);
M(24);
M(48);
M(48);
M(96);
M(192);
M(384);
M(384);
M(384);
M(768);
M(96);
M(96);
M(96);
M(1152);
const ue = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, $i = (e, t) => {
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
let At = Number.EPSILON;
At === void 0 && (At = Math.pow(2, -52));
const qa = At * At, Ds = (e, t) => {
  if (-At < e && e < At && -At < t && t < At)
    return 0;
  const n = e - t;
  return n * n < qa * e * t ? 0 : e < t ? -1 : 1;
};
class Za {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new Rs(), this.yRounder = new Rs();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class Rs {
  constructor() {
    this.tree = new Gi(), this.round(0);
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
    if (i !== null && Ds(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && Ds(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const Oe = new Za(), en = (e, t) => e.x * t.y - e.y * t.x, nr = (e, t) => e.x * t.x + e.y * t.y, Bs = (e, t, n) => {
  const i = Wa(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, an = (e) => Math.sqrt(nr(e, e)), Ga = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return en(s, i) / an(s) / an(i);
}, Ka = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return nr(s, i) / an(s) / an(i);
}, Hs = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, Fs = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, Ya = (e, t, n, i) => {
  if (t.x === 0) return Fs(n, i, e.x);
  if (i.x === 0) return Fs(e, t, n.x);
  if (t.y === 0) return Hs(n, i, e.y);
  if (i.y === 0) return Hs(e, t, n.y);
  const s = en(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = en(o, t) / s, l = en(o, i) / s, a = e.x + l * t.x, d = n.x + r * i.x, u = e.y + l * t.y, c = n.y + r * i.y, p = (a + d) / 2, f = (u + c) / 2;
  return {
    x: p,
    y: f
  };
};
class st {
  // for ordering sweep events in the sweep event queue
  static compare(t, n) {
    const i = st.comparePoints(t.point, n.point);
    return i !== 0 ? i : (t.point !== n.point && t.link(n), t.isLeft !== n.isLeft ? t.isLeft ? 1 : -1 : Et.compare(t.segment, n.segment));
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
        sine: Ga(this.point, t.point, o.point),
        cosine: Ka(this.point, t.point, o.point)
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
let Xa = 0;
class Et {
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
    const l = t.leftSE.point.y, a = n.leftSE.point.y, d = t.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (a < l && a < d) return 1;
      if (a > l && a > d) return -1;
      const c = t.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const p = n.comparePoint(t.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (l < a && l < u) return -1;
      if (l > a && l > u) return 1;
      const c = n.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const p = t.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (o < r) {
      const c = n.comparePoint(t.rightSE.point);
      if (c !== 0) return c;
    }
    if (o > r) {
      const c = t.comparePoint(n.rightSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
    }
    if (o !== r) {
      const c = d - l, p = o - i, f = u - a, m = r - s;
      if (c > p && f < m) return 1;
      if (c < p && f > m) return -1;
    }
    return o > r ? 1 : o < r || d < u ? -1 : d > u ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++Xa, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const l = st.comparePoints(t, n);
    if (l < 0)
      s = t, o = n, r = 1;
    else if (l > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const a = new st(s, !0), d = new st(o, !1);
    return new Et(a, d, [i], [r]);
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
    const l = (t.x - n.x) / s.x, a = n.y + l * s.y;
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
    const n = this.bbox(), i = t.bbox(), s = $i(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, l = t.leftSE.point, a = t.rightSE.point, d = ue(n, l) && this.comparePoint(l) === 0, u = ue(i, o) && t.comparePoint(o) === 0, c = ue(n, a) && this.comparePoint(a) === 0, p = ue(i, r) && t.comparePoint(r) === 0;
    if (u && d)
      return p && !c ? r : !p && c ? a : null;
    if (u)
      return c && o.x === a.x && o.y === a.y ? null : o;
    if (d)
      return p && r.x === l.x && r.y === l.y ? null : l;
    if (p && c) return null;
    if (p) return r;
    if (c) return a;
    const f = Ya(o, this.vector(), l, t.vector());
    return f === null || !ue(s, f) ? null : Oe.round(f.x, f.y);
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
    const n = [], i = t.events !== void 0, s = new st(t, !0), o = new st(t, !1), r = this.rightSE;
    this.replaceRightSE(o), n.push(o), n.push(s);
    const l = new Et(s, r, this.rings.slice(), this.windings.slice());
    return st.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), st.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
    const s = Et.compare(n, i);
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
    const t = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (rt.type) {
      case "union": {
        const i = t.length === 0, s = n.length === 0;
        this._isInResult = i !== s;
        break;
      }
      case "intersection": {
        let i, s;
        t.length < n.length ? (i = t.length, s = n.length) : (i = n.length, s = t.length), this._isInResult = s === rt.numMultiPolys && i < s;
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
        throw new Error(`Unrecognized operation type found ${rt.type}`);
    }
    return this._isInResult;
  }
}
class Us {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = Oe.round(t[0][0], t[0][1]);
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
      let a = Oe.round(t[r][0], t[r][1]);
      a.x === o.x && a.y === o.y || (this.segments.push(Et.fromRing(o, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), o = a);
    }
    (s.x !== o.x || s.y !== o.y) && this.segments.push(Et.fromRing(o, s, this));
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
class Qa {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new Us(t[0], this, !0), this.bbox = {
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
      const o = new Us(t[i], this, !1);
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
class Vs {
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
      const o = new Qa(t[i], this);
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
class cn {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, l = o.leftSE, a = o.rightSE;
      const d = [l], u = l.point, c = [];
      for (; r = l, l = a, d.push(l), l.point !== u; )
        for (; ; ) {
          const p = l.getAvailableLinkedEvents();
          if (p.length === 0) {
            const w = d[0].point, b = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${w.x}, ${w.y}]. Last matching segment found ends at [${b.x}, ${b.y}].`);
          }
          if (p.length === 1) {
            a = p[0].otherSE;
            break;
          }
          let f = null;
          for (let w = 0, b = c.length; w < b; w++)
            if (c[w].point === l.point) {
              f = w;
              break;
            }
          if (f !== null) {
            const w = c.splice(f)[0], b = d.splice(w.index);
            b.unshift(b[0].otherSE), n.push(new cn(b.reverse()));
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
      n.push(new cn(d));
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
    for (let d = 1, u = this.events.length - 1; d < u; d++) {
      const c = this.events[d].point, p = this.events[d + 1].point;
      Bs(c, t, p) !== 0 && (n.push(c), t = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    Bs(i, t, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let d = r; d != l; d += o) a.push([n[d].x, n[d].y]);
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
      st.compare(t, r) > 0 && (t = r);
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
class js {
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
class Ja {
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
        if (o.isExteriorRing()) n.push(new js(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new js(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class tc {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Et.compare;
    this.queue = t, this.tree = new Gi(n), this.segments = [];
  }
  process(t) {
    const n = t.segment, i = [];
    if (t.consumedBy)
      return t.isLeft ? this.queue.remove(t.otherSE) : this.tree.remove(n), i;
    const s = t.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!s) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let o = s, r = s, l, a;
    for (; l === void 0; )
      o = this.tree.prev(o), o === null ? l = null : o.key.consumedBy === void 0 && (l = o.key);
    for (; a === void 0; )
      r = this.tree.next(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    if (t.isLeft) {
      let d = null;
      if (l) {
        const c = l.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (d = c), !l.isAnEndpoint(c))) {
          const p = this._splitSafely(l, c);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      let u = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (u = c), !a.isAnEndpoint(c))) {
          const p = this._splitSafely(a, c);
          for (let f = 0, m = p.length; f < m; f++)
            i.push(p[f]);
        }
      }
      if (d !== null || u !== null) {
        let c = null;
        d === null ? c = u : u === null ? c = d : c = st.comparePoints(d, u) <= 0 ? d : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(c);
        for (let f = 0, m = p.length; f < m; f++)
          i.push(p[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = l);
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
  _splitSafely(t, n) {
    this.tree.remove(t);
    const i = t.rightSE;
    this.queue.remove(i);
    const s = t.split(n);
    return s.push(i), t.consumedBy === void 0 && this.tree.add(t), s;
  }
}
const Ws = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, ec = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class nc {
  run(t, n, i) {
    rt.type = t, Oe.reset();
    const s = [new Vs(n, !0)];
    for (let c = 0, p = i.length; c < p; c++)
      s.push(new Vs(i[c], !1));
    if (rt.numMultiPolys = s.length, rt.type === "difference") {
      const c = s[0];
      let p = 1;
      for (; p < s.length; )
        $i(s[p].bbox, c.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (rt.type === "intersection")
      for (let c = 0, p = s.length; c < p; c++) {
        const f = s[c];
        for (let m = c + 1, w = s.length; m < w; m++)
          if ($i(f.bbox, s[m].bbox) === null) return [];
      }
    const o = new Gi(st.compare);
    for (let c = 0, p = s.length; c < p; c++) {
      const f = s[c].getSweepEvents();
      for (let m = 0, w = f.length; m < w; m++)
        if (o.insert(f[m]), o.size > Ws)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new tc(o);
    let l = o.size, a = o.pop();
    for (; a; ) {
      const c = a.key;
      if (o.size === l) {
        const f = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (o.size > Ws)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > ec)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(c);
      for (let f = 0, m = p.length; f < m; f++) {
        const w = p[f];
        w.consumedBy === void 0 && o.insert(w);
      }
      l = o.size, a = o.pop();
    }
    Oe.reset();
    const d = cn.factory(r.segments);
    return new Ja(d).getGeom();
  }
}
const rt = new nc(), ic = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("union", e, n);
}, sc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("intersection", e, n);
}, oc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("xor", e, n);
}, rc = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("difference", e, n);
};
var ir = {
  union: ic,
  intersection: sc,
  xor: oc,
  difference: rc
};
const sr = 3, lc = 1e-6;
function En(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function j(e, t) {
  const n = En(e, t);
  return { x: n.x, y: n.y };
}
function oe(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : C(i, s);
}
function or(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: Sn(E(t, e)), len: C(e, t), leftOff: o, rightOff: r };
}
function et(e, t) {
  return or(j(e, t.a), j(e, t.b), t.thickness, t.baseline);
}
function Nt(e, t) {
  const n = E(t, e.a);
  return { t: H(n, e.dir), side: H(n, Q(e.dir)) };
}
function qs(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: S(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Gt = (e) => O(e.p, S(Q(e.u), e.offL)), Kt = (e) => E(e.p, S(Q(e.u), e.offR));
function Rt(e, t, n) {
  return e !== null && C(e, t) <= n;
}
function ac(e) {
  const t = [];
  for (const n of e.walls) {
    const i = et(e, n);
    if (i.len < 1e-9) continue;
    const s = Q(i.dir);
    t.push({
      wall: n,
      f: i,
      c: {
        al: O(i.a, S(s, i.leftOff)),
        ar: E(i.a, S(s, i.rightOff)),
        bl: O(i.b, S(s, i.leftOff)),
        br: E(i.b, S(s, i.rightOff))
      }
    });
  }
  return t;
}
function cc(e, t) {
  const n = t.f, i = Q(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = H(E(s.far, n.a), i) >= 0 ? O(n.a, S(i, n.leftOff)) : E(n.a, S(i, n.rightOff)), l = sr * Math.max(s.body.wall.thickness, t.wall.thickness), a = mt(Gt(s), s.u, r, n.dir), d = mt(Kt(s), s.u, r, n.dir);
    Rt(a, s.p, l) && (s.body.c[s.leftKey] = a), Rt(d, s.p, l) && (s.body.c[s.rightKey] = d);
  }
}
function dc(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = sr * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], l = mt(Kt(o), o.u, Gt(r), r.u);
    Rt(l, t, n) && (o.body.c[o.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (e.length < 3) return;
  const i = uc(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], l = E(r, o), a = tt(l, E(t, o)), d = tt(l, E(s.far, o));
    a * d < 0 && xi(s, [t]);
  }
}
function xi(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function uc(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(tt(o.u, r.u)) > 1e-9 || H(o.u, r.u) > 0) continue;
    const l = o.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = e[(s + 2) % i], d = mt(Kt(o), o.u, Gt(a), a.u), u = mt(Gt(r), r.u, Gt(a), a.u);
        if (!Rt(d, t, n) || !Rt(u, t, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = u, xi(o, [t, c, u]);
      } else {
        const a = e[(s - 1 + i) % i], d = mt(Gt(r), r.u, Kt(a), a.u), u = mt(Kt(o), o.u, Kt(a), a.u);
        if (!Rt(u, t, n) || !Rt(d, t, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = d, xi(r, [u, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function rr(e) {
  const t = ac(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(qs(r, "a")), r.wall.b === i.id && s.push(qs(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? cc(s, o) : s.length >= 2 && dc(s, { x: i.x, y: i.y });
  }
  return t;
}
function lr(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function In(e) {
  return new Map(rr(e).map((t) => [t.wall.id, lr(t)]));
}
function Zs(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), l = t(o);
    r >= 0 && n.push(s), r >= 0 != l >= 0 && n.push(O(s, S(E(o, s), r / (r - l))));
  }
  return n;
}
function Ki(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of rr(e)) {
    const s = lr(i), o = e.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && t(u)).sort((u, c) => u.offset - c.offset), r = (u) => H(E(u, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const u of o)
      l.push([a, u.offset]), a = Math.max(a, u.offset + u.width);
    l.push([a, 1 / 0]);
    const d = [];
    for (const [u, c] of l) {
      if (c <= u) continue;
      let p = s;
      u > -1 / 0 && (p = Zs(p, (f) => r(f) - u)), c < 1 / 0 && (p = Zs(p, (f) => c - r(f))), p.length >= 3 && Math.abs(bt(p)) > lc && d.push(p);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const ki = (e) => [e.map((t) => [t.x, t.y])];
function ar(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function cr(e, t) {
  return dr(t ? [...Ki(e).values()].flat() : [...In(e).values()]);
}
function dr(e) {
  const t = e.map(ki);
  if (t.length === 0) return [];
  let n;
  try {
    n = ir.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(ar));
}
function ur(e) {
  const t = [];
  for (const n of cr(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function Mi(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!se(t, s)) continue;
    const o = Math.abs(bt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
function pr(e) {
  return Math.round(Math.abs(bt(e)) / 1e6 * 100) / 100;
}
const ei = 1e-3;
function fr(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(bt(e)) - Math.abs(bt(t))) > ei ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= ei && Math.abs(n.y - i.y) <= ei));
}
function pc(e, t, n) {
  const i = ur(e), s = Mi(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const l = r.broken ? null : Mi(i, r.seed);
    if (l && fr(l, s)) return { level: e, zoneId: null };
  }
  const o = { id: q(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function fc(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function hr(e, t) {
  const n = e.zones.find((r) => r.id === t);
  if (!n) return e;
  const i = { ...e, zones: e.zones.filter((r) => r !== n) }, s = F(e), o = (r) => r.shape.kind === "room" && r.shape.roomId === t;
  if (s.some(o)) {
    const r = n.outline.map((l) => ({ kind: "free", x: l.x, y: l.y, lost: !0 }));
    i.automationZones = s.map((l) => o(l) ? { ...l, shape: { kind: "polygon", vertices: r }, invalid: !0 } : l);
  }
  return i;
}
function re(e) {
  if (e.zones.length === 0) return e;
  const t = ur(e), n = [], i = e.zones.map((s) => {
    const o = Mi(t, s.seed);
    return !o || n.some((r) => fr(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const te = 1e-6, dn = ["door", "gate", "wicket"], mr = (e) => e === "opening", gr = (e) => e.passesLight ?? mr(e.kind), wr = (e) => e === "opening", yr = (e) => e.passesPir ?? wr(e.kind);
function br(e, t) {
  return e.offset < t.offset + t.width - te && t.offset < e.offset + e.width - te;
}
function Pn(e, t, n, i, s) {
  const o = oe(e, t);
  return o === null || i <= 0 || n < -te || n + i > o + te ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && br(r, { offset: n, width: i }));
}
function le(e, t) {
  return { ...e, openings: t };
}
function hc(e, t, n, i, s, o = {}) {
  const r = s ?? tn[n], l = i - r / 2;
  if (!Pn(e, t, l, r)) return { level: e, openingId: null };
  const a = { id: q(), wallId: t, kind: n, offset: l, width: r, invalid: !1 };
  return dn.includes(n) && (a.hinge = o.hinge ?? "start", a.swing = o.swing ?? "left"), n === "window" && (a.outside = o.outside ?? "left"), { level: re(le(e, [...e.openings, a])), openingId: a.id };
}
function vr(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Pn(e, i.wallId, n, i.width, t) ? e : re(Fe(le(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function mc(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !Pn(e, i.wallId, i.offset, n, t) ? e : re(Fe(le(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function gc(e, t) {
  return dn.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function wc(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return re(Fe(le(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function $r(e, t) {
  return re(Fe(le(e, e.openings.filter((n) => n.id !== t))));
}
function Fe(e) {
  return le(e, e.openings.map((t) => {
    const n = oe(e, t.wallId), i = n === null || t.offset < -te || t.offset + t.width > n + te || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && br(t, s));
    return { ...t, invalid: i };
  }));
}
const un = 1e-6;
function xr(e, t) {
  return t.mode !== "none" && qi[e.kind].includes(t.mode);
}
function kr(e, t, n) {
  if (n.mode === "none" || !xr(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Jt || i > Jt)) return !1;
  const s = oe(e, n.wallId);
  return s !== null && n.offset >= -un && n.offset <= s + un;
}
function $t(e, t) {
  return { ...e, devices: t };
}
function Gs(e, t, n, i) {
  if (!kr(e, t, n)) return { level: e, deviceId: null };
  const s = { id: q(), name: i, placement: n, props: t, invalid: !1 };
  return { level: $t(e, [...e.devices, s]), deviceId: s.id };
}
function Mr(e, t) {
  const n = { id: q(), name: t, placement: { mode: "none" }, props: It("equipment", "free"), invalid: !1 };
  return { level: $t(e, [...e.devices, n]), id: n.id };
}
const yc = ["power", "power_in", "power_out", "voltage"];
function bc(e) {
  if (e.props.kind !== "equipment") return null;
  const t = e.bindings ?? {}, n = yc.some((i) => !!t[i]);
  return t.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Ue = (e) => (e == null ? void 0 : e.props.kind) === "equipment" && !!e.props.inverter, _r = (e) => e.props.kind !== "equipment" || !!e.props.controllable;
function Ar(e, t, n) {
  const i = { ...e };
  return n ? i[t] = !0 : delete i[t], i;
}
function Sr(e, t, n) {
  const i = e.devices.find((a) => a.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return e;
  const [s, o] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[s] && (r[o] = r[s]), delete r[s];
  const l = An({ ...i, props: Ar(i.props, "inverter", n), bindings: r });
  return $t(e, e.devices.map((a) => a === i ? l : a));
}
function On(e, t, n) {
  const i = e.devices.find((o) => o.id === t);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return e;
  const s = { ...i, props: Ar(i.props, "controllable", n) };
  return $t(e, e.devices.map((o) => o === i ? s : o));
}
function Er(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = It("motion_sensor", Pe(t)), s = It("motion_sensor", Pe(n));
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function pn(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !kr(e, s.props, n)) return e;
  const o = Er(s.props, s.placement.mode, n.mode);
  return Ir($t(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function Ve(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? $t(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return An({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function vc(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !ie(i.props.kind) || i.props.kind === n) return e;
  const s = It(n, Pe(i.placement.mode));
  if (!xr(s, i.placement)) return e;
  const o = An({ ...i, props: s });
  return $t(e, e.devices.map((r) => r === i ? o : r));
}
function $c(e, t) {
  return $t(e, e.devices.filter((n) => n.id !== t));
}
function Ir(e) {
  return $t(e, e.devices.map((t) => {
    if (t.placement.mode !== "wall") return t.invalid ? { ...t, invalid: !1 } : t;
    const n = oe(e, t.placement.wallId), i = n === null || t.placement.offset < -un || t.placement.offset > n + un;
    return t.invalid === i ? t : { ...t, invalid: i };
  }));
}
const Pr = 2, Ks = Math.ceil(360 / Pr), Ys = 1e-4, xc = 1e-9, Xs = 1e-9, kc = {
  light: gr,
  motion: yr
};
function Or(e, t) {
  const n = [];
  for (const i of dr([...Ki(e, kc[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Yi(e, t, n) {
  return t.filter(([i, s]) => Vt(e, i, s) <= n);
}
function ni(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function Mc(e, t, n) {
  const i = Yi(e, t, n), s = [];
  for (let b = 0; b < Ks; b++) s.push(-Math.PI + 2 * Math.PI * b / Ks);
  const o = n * 1.05;
  for (const b of i)
    for (const g of b) {
      if (C(e, g) > o) continue;
      const $ = Math.atan2(g.y - e.y, g.x - e.x);
      s.push(ni($ - Ys), ni($), ni($ + Ys));
    }
  s.sort((b, g) => b - g);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), d = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([b, g], $) => {
    l[$] = b.x - e.x, a[$] = b.y - e.y, d[$] = g.x - b.x, u[$] = g.y - b.y;
  });
  const c = [], p = [];
  let f = NaN;
  for (const b of s) {
    if (b === f) continue;
    f = b;
    const g = Math.cos(b), $ = Math.sin(b);
    let x = n, k = -1;
    for (let N = 0; N < r; N++) {
      const L = g * u[N] - $ * d[N];
      if (Math.abs(L) < 1e-12) continue;
      const R = (l[N] * u[N] - a[N] * d[N]) / L;
      if (!(R > xc && R < x)) continue;
      const U = (l[N] * $ - a[N] * g) / L;
      U < -Xs || U > 1 + Xs || (x = R, k = N);
    }
    const _ = { x: e.x + g * x, y: e.y + $ * x }, P = c.length;
    if (!(P > 0 && c[P - 1].x === _.x && c[P - 1].y === _.y)) {
      if (k >= 0 && P >= 2 && p[P - 1] === k && p[P - 2] === k) {
        c[P - 1] = _;
        continue;
      }
      c.push(_), p.push(k);
    }
  }
  const m = c[0], w = c[c.length - 1];
  return c.length > 1 && m.x === w.x && m.y === w.y && c.pop(), c;
}
const _c = 32, Qs = 128;
function fn(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function yt(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function Xi(e) {
  return (e % 360 + 360) % 360;
}
function Cr(e) {
  return (e % 360 + 540) % 360 - 180;
}
function Nr(e, t, n, i) {
  const s = e.walls.find((d) => d.id === t);
  if (!s) return null;
  let o;
  try {
    o = et(e, s);
  } catch {
    return null;
  }
  const r = Q(o.dir), l = n === "left" ? r : S(r, -1), a = n === "left" ? o.leftOff : o.rightOff;
  return { pt: O(O(o.a, S(o.dir, i)), S(l, a)), normal: l };
}
function Cn(e, t, n, i) {
  var s;
  return ((s = Nr(e, t, n, i)) == null ? void 0 : s.pt) ?? null;
}
function Y(e, t) {
  const n = t.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: fn(n.rotation) };
  const i = Nr(e, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal, o = t.props;
  if (o.kind === "equipment") {
    const r = o.shape === "circle" ? o.diameter / 2 : o.depth / 2;
    return { pt: O(i.pt, S(s, r)), dir: Q(s), normal: s };
  }
  return { pt: i.pt, dir: n.aim ? fn(yt(s) + n.aim) : s, normal: s };
}
function Lr(e, t) {
  const n = [];
  for (let i = 0; i < Qs; i++) n.push(O(e, S(fn(360 * i / Qs), t)));
  return n;
}
function Js(e, t, n, i) {
  if (n >= 360) return Lr(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * _c)), o = yt(t) - n / 2, r = [e];
  for (let l = 0; l <= s; l++) r.push(O(e, S(fn(o + n * l / s), i)));
  return r;
}
const Ac = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function Nn(e) {
  return Ac[e] ?? null;
}
const Sc = (e) => Nn(e.kind) !== null;
function Ec(e, t) {
  const n = t.props;
  if (!Sc(n)) return null;
  const i = Y(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Js(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Js(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Lr(i.pt, n.poolRadius) : null;
  }
}
function Ic(e) {
  return e.normal ? O(e.pt, e.normal) : e.pt;
}
function to(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function Pc(e, t, n) {
  const i = E(t, e);
  for (const [s, o] of n) {
    const r = E(o, s), l = E(s, e), a = tt(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const d = tt(l, r) / a, u = tt(l, i) / a;
    if (d >= 0 && d <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const eo = 0.5, Oc = 3, Cc = 1e-4;
function Nc(e, t, n) {
  const i = Y(e, t);
  if (!i) return null;
  const s = Ic(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (_) => to(_, n) || Yi(_, n, eo).length > 0;
  if (!r(s)) return s;
  const l = et(e, e.walls.find((_) => _.id === o.wallId)), a = i.normal, d = (_) => Math.abs(H(E(_, i.pt), a)) <= Cc, u = ([_, P]) => S(O(_, P), 0.5), c = n.filter((_) => d(_[0]) && d(_[1]) && C(_[0], _[1]) > 1e-9 && !to(O(u(_), S(a, eo)), n)), p = (_) => H(E(_, l.a), l.dir), f = ([_, P]) => Math.max(0, Math.min(p(_), p(P)) - o.offset, o.offset - Math.max(p(_), p(P))), m = Math.min(...c.map(f)), w = c.filter((_) => f(_) <= m + 1e-6).map((_) => O(u(_), a)), b = (_) => w.some((P) => !Pc(_, P, n)), g = Oc * Math.max(...e.walls.map((_) => _.thickness)) + 2, $ = [];
  for (const [_, P] of n) {
    const N = E(P, _), L = E(_, s), R = tt(l.dir, N);
    if (Math.abs(R) < 1e-12) continue;
    const U = tt(L, l.dir) / R;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const Z = tt(L, N) / R, J = C(_, P) / Math.abs(R);
    $.push(Z - J, Z + J);
  }
  const x = o.offset <= l.len / 2 ? 1 : -1, k = $.filter((_) => Math.abs(_) <= g).sort((_, P) => Math.abs(_) - Math.abs(P) || Math.sign(P) * x - Math.sign(_) * x);
  for (const _ of k) {
    const P = O(s, S(l.dir, _));
    if (!r(P) && b(P)) return P;
  }
  return null;
}
const Lc = 1 / Math.cos(Pr / 2 * (Math.PI / 180)), no = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function zc(e, t, n = Or) {
  const i = Ec(e, t), s = Nn(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = Nc(e, t, o);
  if (!r) return [];
  const l = Math.max(...i.map((c) => C(c, r))) * Lc, a = Yi(r, o, l);
  if (a.length === 0) return [i];
  const d = Mc(r, a, l);
  let u;
  try {
    u = ir.intersection(ki(no(i)), ki(no(d)));
  } catch {
    return [d];
  }
  return u.flatMap((c) => c.map(ar));
}
function Tc(e, t, n, i) {
  const s = Y(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const l = Math.max(-o.length / 2, Math.min(o.length / 2, H(E(n, s.pt), s.dir)));
    return C(O(s.pt, S(s.dir, l)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return C(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return C(s.pt, n) <= i;
  if (o.shape === "circle") return C(s.pt, n) <= o.diameter / 2 + i;
  const r = E(n, s.pt);
  return Math.abs(H(r, s.dir)) <= o.width / 2 + i && Math.abs(H(r, Q(s.dir))) <= o.depth / 2 + i;
}
function zr(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && Tc(e, i[o], t, n)) return i[o].id;
  return null;
}
const Dc = 60;
function _i(e, t, n) {
  if (!Jo.has(t.props.kind)) return null;
  const i = Y(e, t);
  return i ? { from: i.pt, to: O(i.pt, S(i.dir, Dc / n)) } : null;
}
function Tr(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function Rc(e, t, n, i) {
  const s = t.placement, o = Y(e, t);
  if (s.mode === "none" || !o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = yt(E(n, o.pt)), l = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: Xi(l(r)) };
  const a = Cr(r - yt(o.normal)), d = Math.max(-Jt, Math.min(Jt, l(a)));
  return Tr(s, d);
}
const Bc = 1, io = 1, so = 1e-6, Hc = 1e-9, Fc = 1e-6, Uc = 1;
function Qi(e, t) {
  switch (t.kind) {
    case "free":
      return { x: t.x, y: t.y };
    case "node": {
      const n = e.nodes.find((i) => i.id === t.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = oe(e, t.wallId);
      return n === null ? null : Cn(e, t.wallId, t.side, Math.max(0, Math.min(n, t.offset)));
    }
  }
}
function Lt(e, t) {
  var i;
  const n = t.shape;
  return n.kind === "room" ? ((i = e.zones.find((s) => s.id === n.roomId)) == null ? void 0 : i.outline) ?? [] : n.vertices.map((s) => Qi(e, s) ?? { x: s.x, y: s.y });
}
function ye(e, t, n) {
  const i = tt(E(t, e), E(n, e));
  return Math.abs(i) <= Hc * C(e, t) * C(e, n) ? 0 : Math.sign(i);
}
const We = (e, t, n) => H(E(t, e), E(n, e)) <= 0;
function Dr(e, t, n, i) {
  const s = ye(n, i, e), o = ye(n, i, t), r = ye(e, t, n), l = ye(e, t, i);
  return s * o < 0 && r * l < 0 ? !0 : r === 0 && We(n, e, t) || l === 0 && We(i, e, t) || s === 0 && We(e, n, i) || o === 0 && We(t, n, i);
}
function Vc(e) {
  const t = [];
  for (const n of e) (t.length === 0 || C(t[t.length - 1], n) > so) && t.push(n);
  for (; t.length > 1 && C(t[0], t[t.length - 1]) <= so; ) t.pop();
  return t;
}
function hn(e) {
  const t = Vc(e), n = t.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = t[i], o = t[(i + 1) % n], r = t[(i + 2) % n];
    if (ye(s, o, r) === 0 && H(E(o, s), E(r, o)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && Dr(s, o, t[l], t[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function Rr(e, t) {
  const n = t.shape;
  if (n.kind === "room") {
    const o = e.zones.find((r) => r.id === n.roomId);
    return !o || o.broken ? "room" : null;
  }
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Qi(e, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = oe(e, o.wallId);
    return r !== null && (o.offset < -io || o.offset > r + io);
  };
  if (n.vertices.some(i)) return "wall";
  const s = Lt(e, t);
  return Math.abs(bt(s)) < Uc || hn(s) ? "self" : null;
}
function Ln(e, t) {
  return se(t, e) || e.some((n, i) => Vt(t, n, e[(i + 1) % e.length]) <= Bc);
}
const Br = (e, t) => !(e.zoneBlacklist ?? []).includes(t);
function jc(e, t) {
  const n = Y(e, t);
  return n ? F(e).filter((i) => Ln(Lt(e, i), n.pt)).map((i) => ({ zone: i, participates: Br(t, i.id) })) : [];
}
function Ji(e, t) {
  const n = F(e).find((o) => o.id === t);
  if (!n) return [];
  const i = Lt(e, n), s = [];
  for (const o of e.devices) {
    const r = Y(e, o);
    r && Ln(i, r.pt) && s.push({ device: o, participates: Br(o, t) });
  }
  return s;
}
function Hr(e) {
  const t = e.length;
  if (t === 0) return { x: 0, y: 0 };
  const n = bt(e);
  if (Math.abs(n) > Fc) {
    let i = 0, s = 0;
    for (let r = 0; r < t; r++) {
      const l = e[r], a = e[(r + 1) % t], d = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * d, s += (l.y + a.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (se(o, e)) return o;
  }
  return {
    x: e.reduce((i, s) => i + s.x, 0) / t,
    y: e.reduce((i, s) => i + s.y, 0) / t
  };
}
const Wc = 3, ee = (e, t) => ({ ...e, automationZones: t }), Fr = (e) => ({ kind: "free", x: e.x, y: e.y, lost: !0 });
function qc(e, t) {
  if (e.x !== t.x || e.y !== t.y) return !1;
  switch (e.kind) {
    case "free":
      return t.kind === "free" && e.lost === t.lost;
    case "node":
      return t.kind === "node" && e.nodeId === t.nodeId;
    case "wall":
      return t.kind === "wall" && e.wallId === t.wallId && e.offset === t.offset && e.side === t.side;
  }
}
function Ur(e, t) {
  if (e.id !== t.id || e.name !== t.name || e.invalid !== t.invalid) return !1;
  const n = e.shape, i = t.shape;
  return n.kind === "room" ? i.kind === "room" && n.roomId === i.roomId : i.kind === "polygon" && n.vertices.length === i.vertices.length && n.vertices.every((s, o) => qc(s, i.vertices[o]));
}
function Zc(e, t) {
  if (t.kind === "free") return t;
  const n = Qi(e, t);
  return n ? n.x === t.x && n.y === t.y ? t : { ...t, x: n.x, y: n.y } : Fr(t);
}
function zn(e, t) {
  let n = t;
  const i = t.shape;
  if (i.kind === "polygon") {
    const o = i.vertices.map((r) => Zc(e, r));
    o.some((r, l) => r !== i.vertices[l]) && (n = { ...t, shape: { kind: "polygon", vertices: o } });
  }
  const s = Rr(e, n) !== null;
  return n.invalid === s ? n : { ...n, invalid: s };
}
function Gc(e) {
  const t = e.automationZones;
  if (!t || t.length === 0) return e;
  const n = t.map((i) => zn(e, i));
  return n.some((i, s) => i !== t[s]) ? ee(e, n) : e;
}
function Kc(e, t) {
  const n = e.automationZones, i = t.automationZones;
  if (!n || !i) return e;
  const s = n.map((o) => {
    const r = i.find((l) => l.id === o.id);
    return r && r !== o && Ur(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? ee(e, i) : s.some((o, r) => o !== n[r]) ? ee(e, s) : e;
}
function Vr(e, t) {
  return { level: ee(e, [...F(e), zn(e, t)]), zoneId: t.id };
}
function Yc(e, t, n) {
  if (!e.zones.some((s) => s.id === t)) return { level: e, zoneId: null };
  const i = F(e).find((s) => s.shape.kind === "room" && s.shape.roomId === t);
  return i ? { level: e, zoneId: i.id } : Vr(e, { id: q(), name: n, shape: { kind: "room", roomId: t }, invalid: !1 });
}
const jr = (e) => e.kind === "free" && e.lost ? { kind: "free", x: e.x, y: e.y } : e;
function Xc(e, t, n) {
  if (t.length < Wc) return { level: e, zoneId: null };
  const i = zn(e, { id: q(), name: n, shape: { kind: "polygon", vertices: t.map(jr) }, invalid: !1 });
  return hn(Lt(e, i)) ? { level: e, zoneId: null } : Vr(e, i);
}
function Qc(e, t, n) {
  const i = F(e), s = i.find((o) => o.id === t);
  return !s || s.name === n ? e : ee(e, i.map((o) => o === s ? { ...s, name: n } : o));
}
function Wr(e, t) {
  if (t.length > 0) return { ...e, zoneBlacklist: t };
  const { zoneBlacklist: n, ...i } = e;
  return i;
}
function qr(e, t) {
  const n = F(e);
  if (!n.some((s) => s.id === t)) return e;
  const i = e.devices.map((s) => {
    var o;
    return (o = s.zoneBlacklist) != null && o.includes(t) ? Wr(s, s.zoneBlacklist.filter((r) => r !== t)) : s;
  });
  return {
    ...e,
    automationZones: n.filter((s) => s.id !== t),
    devices: i.some((s, o) => s !== e.devices[o]) ? i : e.devices
  };
}
function Jc(e, t, n, i) {
  const s = F(e), o = s.find((a) => a.id === t);
  if (!o || o.shape.kind !== "polygon" || !Number.isInteger(n) || n < 0 || n >= o.shape.vertices.length)
    return e;
  const r = o.shape.vertices.map((a, d) => d === n ? jr(i) : a), l = zn(e, { ...o, shape: { kind: "polygon", vertices: r } });
  return Ur(l, o) ? e : ee(e, s.map((a) => a === o ? l : a));
}
function Zr(e, t, n, i) {
  const s = e.devices.find((l) => l.id === t);
  if (!s) return e;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !F(e).some((l) => l.id === n)) return e;
  const r = Wr(s, i ? o.filter((l) => l !== n) : [...o, n]);
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
const Ce = 1;
function pt(e) {
  return structuredClone(e);
}
function Tn(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function td(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Dn(e, t, n) {
  const i = j(e, t.a), s = j(e, t.b), o = C(i, s), r = td(typeof n == "number" ? n : Zi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : Na(i, s, r / o), offset: r };
}
function ed(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((l) => l.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = Dn(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Gr(e, t) {
  ed(e), t && od(t, e);
  const n = Gc(re(Ir(Fe(e))));
  return t ? Kc(n, t) : n;
}
function xt(e, t) {
  return Gr(pt(e), t);
}
function Kr(e, t, n) {
  const i = En(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = Dn(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function oo(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: j(e, t.nodeId), nodeId: t.nodeId };
  const n = Tn(e, t.wallId), { pt: i, offset: s } = Dn(e, n, t.offset), o = C(j(e, n.a), j(e, n.b));
  return s <= Ce ? { pt: j(e, n.a), nodeId: n.a } : o - s <= Ce ? { pt: j(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function ro(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: q(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function nd(e, t, n, i) {
  const s = oo(e, t), o = oo(e, n);
  if (C(s.pt, o.pt) < Ce) return { level: e, wallId: null, endNodeId: null };
  const r = pt(e), l = ro(r, s), a = ro(r, o);
  if (l === a) return { level: e, wallId: null, endNodeId: null };
  const d = { id: q(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: xt(r, e), wallId: d.id, endNodeId: a };
}
function Yr(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, l = Math.min(e.y, t.y) - s, a = Math.max(e.y, t.y) + s;
  return r - o < Ce || a - l < Ce ? null : [{ x: o, y: l }, { x: r, y: l }, { x: r, y: a }, { x: o, y: a }];
}
function id(e, t, n, i, s) {
  const o = Yr(t, n, i.thickness, s);
  if (!o) return e;
  const r = pt(e), l = o.map((a) => {
    const d = { id: q(), x: a.x, y: a.y };
    return r.nodes.push(d), d.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: q(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return xt(r, e);
}
function sd(e, t, n) {
  const i = pt(e);
  return Kr(i, t, n), Gr(i, e);
}
function od(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...F(t).flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((c) => c.id === s.a), r = e.nodes.find((c) => c.id === s.b), l = t.nodes.find((c) => c.id === i.a), a = t.nodes.find((c) => c.id === i.b);
    if (!o || !r || !l || !a || o.x === l.x && o.y === l.y) continue;
    const d = C(l, a);
    if (d === 0) continue;
    const u = Sn(E(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = Zi(O(o, S(u, c.offset)), l, a) * d);
  }
}
function rd(e, t, n) {
  const i = pt(e), s = Tn(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((l) => ({ id: l, to: O(j(i, l), n) }));
  for (const l of r) Kr(i, l.id, l.to);
  return xt(i, e);
}
function Rn(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Xr(e, t, n) {
  for (const i of F(e))
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === t && (s.nodeId = n);
}
function ld(e, t, n) {
  const i = pt(e), s = Tn(i, t), o = s[n], r = j(i, o), l = { id: q(), x: r.x, y: r.y };
  return i.nodes.push(l), s[n] = l.id, i.walls.some((a) => a.a === o || a.b === o) || Xr(i, o, l.id), Rn(i), { level: xt(i, e), nodeId: l.id };
}
function ad(e, t, n) {
  if (t === n) return e;
  const i = pt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Xr(i, t, n), i.nodes = i.nodes.filter((o) => o.id !== t), Rn(i), xt(i, e);
}
function ts(e, t) {
  var i;
  const n = pt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return Rn(n), xt(n, e);
}
function cd(e, t, n) {
  const i = pt(e);
  return Object.assign(Tn(i, t), n), xt(i, e);
}
const it = (e) => typeof e == "string" && e !== "" ? e : null, Qr = (e) => e.split(".")[0], dd = ["friendly_name", "device_class", "unit_of_measurement"];
function Jr(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: Qr(e),
    name: it(n.friendly_name) ?? e,
    deviceClass: it(n.device_class),
    unit: it(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function ud(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Jr(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function pd(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, l = o.attributes ?? {};
    if (r !== l && dd.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(e).length;
}
function tl(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function fd(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Jr(r.entity_id, {});
    o.set(r.entity_id, {
      ...l,
      name: it(r.name) ?? it(r.original_name) ?? l.name,
      deviceId: it(r.device_id),
      areaId: it(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: it(r.entity_category)
    });
  }
  return {
    entities: o,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: it(r.name_by_user) ?? it(r.name) ?? r.id, model: it(r.model), areaId: it(r.area_id) }])),
    areas: new Map(s.map((r) => [r.area_id, r.name]))
  };
}
function hd(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function el(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : tl(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const md = {
  "tool.select": "Select",
  "tool.box": "Box",
  "tool.wall": "Wall",
  "tool.door": "Door",
  "tool.window": "Window",
  "tool.opening": "Opening",
  "tool.zone": "Room",
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
  "tool.zones-select": "Select",
  "tool.zone-room": "Zone from room",
  "tool.zone-draw": "Custom zone",
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
  "mode.zones": "Zones",
  "mode.power": "Power",
  "mode.automation": "Automation",
  "steps.label": "Setup steps",
  "steps.app": "Plan Studio",
  "steps.wall": "{n} wall",
  "steps.walls": "{n} walls",
  "steps.room": "{n} room",
  "steps.rooms": "{n} rooms",
  "steps.device": "{n} device",
  "steps.devices": "{n} devices",
  "steps.zone": "{n} zone",
  "steps.zones": "{n} zones",
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
  "zone.default": "Room",
  "zones.default": "Zone",
  "zones.kind.room": "Room",
  "zones.kind.polygon": "Custom",
  "zones.room": "Room",
  "zones.members": "Members",
  "zones.participates": "Participates",
  "zones.noMembers": "No devices inside.",
  "zones.delete": "Delete zone",
  "zones.filter": "Filter zones",
  "zones.hint": "Pick a zone on the plan or in the list, or add one with Zone from room or Custom zone.",
  "zones.invalid.room": "The room is broken: fix its walls.",
  "zones.invalid.lost": "A vertex lost its wall or corner: drag it to place it again.",
  "zones.invalid.wall": "A vertex lies beyond the end of its wall.",
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
  "power.switch.on": "On",
  "power.switch.off": "Off",
  "power.switch.unknown": "Unknown",
  "power.readOnly": "read-only",
  "power.gridKeep": "The grid source cannot be deleted",
  "power.pickDevice": "Pick a device in the list first",
  "power.help.select": "Drag from a port to a port or a bus to add a wire. Drag a block to move it.",
  "power.help.place": "Click on the canvas to place the block.",
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
  "zones.invalid.self": "The outline crosses itself: move a vertex.",
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
  "props.passesLight": "Passes light",
  "props.passesPir": "Passes PIR",
  "props.invalidOpening": "Out of the wall or overlapping another opening",
  "props.badWidth": "Width must be a whole number of mm above 0",
  "props.noFit": "Does not fit the wall at this position",
  "props.zone": "Room",
  "props.zoneList": "Zones",
  "props.noZones": "Not in any zone.",
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
  "status.grid": "Grid 100 mm",
  "status.gridSchematic": "Grid",
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
function h(e) {
  return md[e] ?? e;
}
const gd = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], wd = 10;
function ae(e, t) {
  const n = (i, s) => ({ name: i, dir: s });
  switch (e.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Ue(t.device(e.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : [n("IN", "in"), n("OUT", "out")];
    case "battery":
      return [n("BAT", "in")];
    case "pv":
      return [n("OUT", "out")];
    case "remainder":
      return [n("IN", "in")];
    case "transfer":
      return e.form === "2in1out" ? [n("A", "in"), n("B", "in"), n("OUT", "out")] : e.form === "1in2out" ? [n("IN", "in"), n("A", "out"), n("B", "out")] : [];
    default:
      return [];
  }
}
function nl() {
  return { blocks: [{ id: q(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function yd(e, t, n, i) {
  const s = { id: q(), x: t.x, y: t.y }, o = { ...s, name: `${h(`power.kind.${e}`)} ${1 + n.blocks.filter((r) => r.kind === e).length}` };
  switch (e) {
    case "device":
      return { ...s, kind: e, deviceId: i ?? "" };
    case "bus":
      return { ...o, kind: e, w: 240, h: 12 };
    case "transfer":
      return { ...o, kind: e, form: "2in1out" };
    default:
      return { ...o, kind: e };
  }
}
function lo(e, t) {
  return { ...e, blocks: [...e.blocks, t] };
}
function Bn(e, t, n) {
  return e.blocks.some((i) => i.id === t) ? { ...e, blocks: e.blocks.map((i) => i.id === t ? n(i) : i) } : e;
}
function bd(e, t, n, i) {
  return Bn(e, t, (s) => ({ ...s, x: n, y: i }));
}
const Ai = (e) => "block" in e ? e.block : e.bus, il = (e, t) => Ai(e.from) === t || Ai(e.to) === t;
function mn(e, t, n, i) {
  const s = e.blocks.find((d) => d.id === t);
  if (!s) return e;
  const o = Bn(e, t, (d) => ({ ...d, ...n }));
  if (s.kind === "transfer" && "form" in n && n.form !== s.form)
    return { ...o, wires: o.wires.filter((d) => !il(d, t)) };
  const r = o.blocks.find((d) => d.id === t), l = new Set(ae(r, i).map((d) => d.name)), a = (d) => "block" in d && d.block === t && !l.has(d.port);
  return o.wires.some((d) => a(d.from) || a(d.to)) ? { ...o, wires: o.wires.filter((d) => !a(d.from) && !a(d.to)) } : o;
}
function sl(e, t) {
  const n = e.blocks.find((i) => i.id === t);
  return !n || n.kind === "grid" ? e : { blocks: e.blocks.filter((i) => i.id !== t), wires: e.wires.filter((i) => !il(i, t)) };
}
const ol = (e, t) => new Set(e.blocks.flatMap((n) => n.kind === "device" && n.deviceId === t ? [n.id] : []));
function es(e, t, n) {
  const i = ol(e, t);
  if (i.size === 0) return e;
  const s = new Map(e.blocks.filter((d) => i.has(d.id)).map((d) => [d.id, new Set(ae(d, n).map((u) => u.name))])), o = (d) => "block" in d && !!s.get(d.block) && !s.get(d.block).has(d.port), r = e.wires.filter((d) => !o(d.from) && !o(d.to));
  let l = !1;
  const a = e.blocks.map((d) => {
    const u = s.get(d.id);
    if (!u || !d.portPins || Object.keys(d.portPins).every((m) => u.has(m))) return d;
    l = !0;
    const c = Object.fromEntries(Object.entries(d.portPins).filter(([m]) => u.has(m))), { portPins: p, ...f } = d;
    return Object.keys(c).length ? { ...f, portPins: c } : f;
  });
  return r.length === e.wires.length && !l ? e : { ...e, blocks: a, wires: r };
}
function vd(e, t) {
  const n = ns(t), i = new Set(e.blocks.flatMap((o) => o.kind === "device" ? [o.deviceId] : []));
  let s = e;
  for (const o of i) s = es(s, o, n);
  return s;
}
function $d(e, t) {
  const n = ol(e, t);
  if (n.size === 0) return e;
  const i = (s) => n.has(Ai(s));
  return {
    ...e,
    blocks: e.blocks.filter((s) => !n.has(s.id)),
    wires: e.wires.filter((s) => !i(s.from) && !i(s.to))
  };
}
const ns = (e) => ({ device: (t) => e.devices.find((n) => n.id === t) });
function rl(e, t, n) {
  var o;
  const i = ((o = e.devices.find((r) => r.id === n)) == null ? void 0 : o.placement.mode) === "none", s = $c(e, n);
  return { level: s, power: i ? $d(t, n) : es(t, n, ns(s)) };
}
function ll(e, t, n, i) {
  const s = Sr(e, n, i);
  return { level: s, power: s === e ? t : es(t, n, ns(s)) };
}
function al(e, t) {
  return e.wires.some((n) => n.id === t) ? { ...e, wires: e.wires.filter((n) => n.id !== t) } : e;
}
function xd(e, t, n, i) {
  return Bn(e, t, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...l } = s;
    return Object.keys(o).length ? { ...l, portPins: o } : l;
  });
}
function kd(e, t) {
  return Bn(e, t, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function ao(e, t) {
  if (e.kind === "battery") return "bat";
  if (e.kind === "pv") return "pv";
  if (e.kind === "device") {
    if (t === "BAT") return "bat";
    if (t === "PV") return "pv";
  }
  return "ac";
}
function Md(e, t) {
  const n = e.filter((o) => o.kind === "transfer"), i = n.slice(0, wd), s = /* @__PURE__ */ new Map();
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
    for (const u of t) {
      const c = a(d(u.from, u)), p = a(d(u.to, u));
      if (c === p) return !0;
      l.set(c, p);
    }
  }
  return !1;
}
function co(e, t, n, i) {
  const s = new Map(e.blocks.map((g) => [g.id, g])), o = (g) => {
    if ("bus" in g) {
      const k = s.get(g.bus);
      return k && k.kind === "bus" ? { bl: k, dir: null } : null;
    }
    const $ = s.get(g.block), x = $ ? ae($, i).find((k) => k.name === g.port) : void 0;
    return $ && x ? { bl: $, dir: x.dir } : null;
  }, r = o(t), l = o(n);
  if (!r || !l) return { error: "missing" };
  if (r.bl.id === l.bl.id) return { error: "same-block" };
  let a = t, d = n;
  if (r.dir === null || l.dir === null)
    (r.dir === "in" || l.dir === "out") && (a = n, d = t);
  else {
    if (r.dir === l.dir)
      return { error: "direction" };
    r.dir === "in" && (a = n, d = t);
  }
  const u = (g) => "block" in g && e.wires.some(($) => [$.from, $.to].some((x) => "block" in x && x.block === g.block && x.port === g.port));
  if (u(a) || u(d)) return { error: "port-taken" };
  const c = (g) => {
    for (const $ of e.wires)
      for (const [x, k] of [[$.from, $.to], [$.to, $.from]])
        if ("bus" in x && x.bus === g && "block" in k) {
          const _ = s.get(k.block);
          if (_) return ao(_, k.port);
        }
    return null;
  }, p = (g) => "bus" in g ? c(g.bus) : ao(s.get(g.block), g.port), f = p(a), m = p(d);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in d && s.get(d.block).kind === "remainder" && e.wires.some((g) => {
    var $;
    return "bus" in g.from && g.from.bus === a.bus && "block" in g.to && (($ = s.get(g.to.block)) == null ? void 0 : $.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const w = { id: q(), from: a, to: d }, b = [...e.wires, w];
  return Md(e.blocks, b) ? { error: "loop" } : { schema: { ...e, wires: b }, wire: w };
}
const ht = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Xt = (e) => typeof e == "number" && Number.isFinite(e), _d = ["top", "right", "bottom", "left"], Ad = ["2in1out", "1in2out"];
function Sd(e, t) {
  let n = e;
  if (n.kind === "bus" && !(Xt(n.w) && Xt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Ad.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, s = new Set(ae(n, t).map((d) => d.name)), o = {};
  let r = ht(i);
  for (const [d, u] of ht(i) ? Object.entries(i) : []) {
    if (!s.has(d) || !ht(u) || !_d.includes(u.side) || !Xt(u.at)) {
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
function Ed(e, t) {
  if (!ht(e)) return;
  const n = Array.isArray(e.blocks) ? e.blocks : [], i = Array.isArray(e.wires) ? e.wires : [];
  let s = !Array.isArray(e.blocks) || !Array.isArray(e.wires);
  const o = [], r = /* @__PURE__ */ new Set();
  for (const u of n)
    if (ht(u) && typeof u.id == "string" && u.id && gd.includes(u.kind) && Xt(u.x) && Xt(u.y)) {
      const c = Sd(u, t);
      c !== u && (s = !0), c.kind === "transfer" && c.form !== u.form && r.add(c.id), o.push(c);
    } else s = !0;
  const l = new Map(o.map((u) => [u.id, u])), a = (u) => {
    var p;
    if (!ht(u)) return null;
    if (typeof u.bus == "string") {
      if (((p = l.get(u.bus)) == null ? void 0 : p.kind) !== "bus" || !Xt(u.at)) return null;
      const f = Math.min(1, Math.max(0, u.at));
      return f === u.at ? u : { bus: u.bus, at: f };
    }
    const c = typeof u.block == "string" ? l.get(u.block) : void 0;
    return c && !r.has(c.id) && ae(c, t).some((f) => f.name === u.port) ? u : null;
  }, d = [];
  for (const u of i) {
    const c = ht(u) ? a(u.from) : null, p = ht(u) ? a(u.to) : null;
    if (!ht(u) || typeof u.id != "string" || !u.id || !c || !p) {
      s = !0;
      continue;
    }
    c === u.from && p === u.to ? d.push(u) : (s = !0, d.push({ ...u, from: c, to: p }));
  }
  return s ? { ...e, blocks: o, wires: d } : e;
}
function cl(e, t) {
  const n = new Set(t.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return e.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function Id(e) {
  const t = e.blocks.find((n) => n.kind === "grid");
  return !!t && t.kind === "grid" && !!t.power && e.wires.length > 0;
}
const Hn = 11, gn = 18, wn = 30, Pd = 12, Od = 120, nt = 14, uo = 10, Ne = (e) => Math.round(e / uo) * uo || 0, ii = 24, po = 6, Cd = 2 * Hn + 6, Nd = nt, Ld = 1e6, fo = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, Fn = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 }), si = (e, t, n) => e.x >= t.x - n && e.x <= t.x + t.w + n && e.y >= t.y - n && e.y <= t.y + t.h + n, dl = (e) => Math.min(1, Math.max(0, e));
function is(e, t) {
  var n;
  return e.kind === "device" ? ((n = t.device(e.deviceId)) == null ? void 0 : n.name) ?? "" : e.name ?? "";
}
function zd(e, t) {
  const n = (...i) => i.filter(Boolean).length;
  switch (e.kind) {
    case "grid":
      return 1 + n(e.voltage);
    case "device": {
      const i = t.device(e.deviceId);
      if (!i) return 1;
      const s = i.bindings ?? {}, o = Ue(i);
      return n(o ? s.power_in : s.power, o && s.power_out, s.voltage, s.control, o);
    }
    case "battery":
      return 2;
    case "bus":
      return 0;
    default:
      return 1;
  }
}
function ut(e, t, n) {
  return n ? rs(n, e, t).r : ss(e, t);
}
function ss(e, t) {
  return e.kind === "bus" ? { x: e.x, y: e.y, w: e.w, h: e.h } : {
    x: e.x,
    y: e.y,
    w: Math.max(Od, 7 * is(e, t).length + 32),
    h: wn + gn * zd(e, t) + Pd
  };
}
function yn(e, t, n) {
  switch (t) {
    case "top":
      return { x: e.x + n * e.w, y: e.y };
    case "bottom":
      return { x: e.x + n * e.w, y: e.y + e.h };
    case "left":
      return { x: e.x, y: e.y + n * e.h };
    case "right":
      return { x: e.x + e.w, y: e.y + n * e.h };
  }
}
function Td(e, t) {
  const n = Fn(e), i = t.x - n.x, s = t.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (e.w / 2) > Math.abs(s) / (e.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function Dd(e, t) {
  const n = [
    { side: "top", a: { x: e.x, y: e.y }, b: { x: e.x + e.w, y: e.y } },
    { side: "right", a: { x: e.x + e.w, y: e.y }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "bottom", a: { x: e.x, y: e.y + e.h }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "left", a: { x: e.x, y: e.y }, b: { x: e.x, y: e.y + e.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const l of n) {
    const a = Vt(t, l.a, l.b);
    a < s && (i = l, s = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? e.w ? (t.x - e.x) / e.w : 0.5 : e.h ? (t.y - e.y) / e.h : 0.5;
  return { side: i.side, at: dl(r) };
}
const Le = (e) => e.w >= e.h;
function ul(e, t) {
  return Le(e) ? { x: e.x + t * e.w, y: e.y + e.h / 2 } : { x: e.x + e.w / 2, y: e.y + t * e.h };
}
function Rd(e, t, n) {
  const i = { x: e.x, y: e.y, w: e.w, h: e.h };
  if (t === 0 || t === 1) {
    const r = Le(e) ? t === 0 ? "left" : "right" : t === 0 ? "top" : "bottom";
    return { pt: yn(i, r, 0.5), side: r };
  }
  const s = Fn(i), o = Le(e) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: yn(i, o, t), side: o };
}
function Bd(e, t) {
  if (e.kind === "device") {
    if (t.name === "BAT") return "right";
    if (t.name === "PV") return "top";
  }
  return t.dir === "in" ? "top" : "bottom";
}
const os = (e, t) => e.blocks.find((n) => n.id === t), Si = (e, t) => {
  const n = os(e, t);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, oi = (e, t, n) => "block" in e && e.block === t && e.port === n;
function Hd(e, t, n, i) {
  const s = e.wires.find((l) => oi(l.from, t, n) || oi(l.to, t, n));
  if (!s) return null;
  const o = oi(s.from, t, n) ? s.to : s.from;
  if ("bus" in o) {
    const l = Si(e, o.bus);
    return l ? ul(l, o.at) : null;
  }
  const r = os(e, o.block);
  return r ? Fn(ss(r, i)) : null;
}
function rs(e, t, n) {
  const i = ss(t, n), s = Fn(i), o = ae(t, n).map((d) => {
    var m;
    const u = (m = t.portPins) == null ? void 0 : m[d.name];
    if (u) return { ...d, side: u.side, pin: u, key: 0 };
    const c = Hd(e, t.id, d.name, n), p = (c && Td(i, c)) ?? Bd(t, d), f = c ?? s;
    return { ...d, side: p, pin: void 0, key: p === "top" || p === "bottom" ? f.x : f.y };
  }), r = (d) => {
    const u = o.filter((c) => c.side === d).length;
    return u ? (u + 1) * Cd : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(o.length);
  o.forEach((d, u) => {
    d.pin && (a[u] = { name: d.name, dir: d.dir, side: d.side, pt: yn(l, d.side, d.pin.at), pinned: !0 });
  });
  for (const d of ["top", "right", "bottom", "left"]) {
    const u = o.map((c, p) => ({ p: c, i: p })).filter(({ p: c }) => !c.pin && c.side === d).sort((c, p) => c.p.key - p.p.key || c.i - p.i);
    u.forEach(({ p: c, i: p }, f) => {
      a[p] = { name: c.name, dir: c.dir, side: d, pt: yn(l, d, (f + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function Un(e, t, n) {
  return rs(e, t, n).places;
}
function pl(e, t, n) {
  const i = (d) => {
    if (!("block" in d)) return null;
    const u = os(e, d.block);
    if (!u) return null;
    const { r: c, places: p } = rs(e, u, n), f = p.find((m) => m.name === d.port);
    return f ? { pt: f.pt, side: f.side, rect: c } : null;
  }, s = (d, u, c) => {
    if (!("bus" in d)) return null;
    const p = Si(e, d.bus);
    if (!p) return null;
    let f = c == null ? void 0 : c.pt;
    if (!f && "bus" in u) {
      const m = Si(e, u.bus);
      f = m && ul(m, u.at);
    }
    return f ? { ...Rd(p, d.at, f), rect: ut(p, n, e) } : null;
  }, o = i(t.from), r = i(t.to), l = o ?? s(t.from, t.to, r), a = r ?? s(t.to, t.from, o);
  return l && a ? { a: l, b: a } : null;
}
const qe = (e, t) => ({ x: Math.sign(t.x - e.x), y: Math.sign(t.y - e.y) }), Ei = (e, t) => Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
function Fd(e, t, n) {
  const i = [];
  for (const l of e) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const d = qe(i[i.length - 2], a), u = qe(a, l);
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
  const o = qe(i[0], i[1]), r = qe(i[s - 2], i[s - 1]);
  return o.x !== t.x || o.y !== t.y || Ei(i[0], i[1]) < nt - 1e-9 || r.x !== -n.x || r.y !== -n.y || Ei(i[s - 2], i[s - 1]) < nt - 1e-9 ? null : i;
}
function Ud(e, t, n) {
  return Math.min(e.x, t.x) < n.x + n.w - 0.5 && Math.max(e.x, t.x) > n.x + 0.5 && Math.min(e.y, t.y) < n.y + n.h - 0.5 && Math.max(e.y, t.y) > n.y + 0.5;
}
function Vd(e, t) {
  let n = (e.length - 2) * Nd;
  for (let i = 1; i < e.length; i++) {
    n += Ei(e[i - 1], e[i]);
    for (const s of t) Ud(e[i - 1], e[i], s) && (n += Ld);
  }
  return n;
}
function fl(e, t) {
  const n = e.pt, i = t.pt, s = fo[e.side], o = fo[t.side], r = { x: n.x + s.x * nt, y: n.y + s.y * nt }, l = { x: i.x + o.x * nt, y: i.y + o.y * nt }, a = [e.rect, t.rect].filter((x) => !!x), d = (x, k) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((_) => [_[x] - nt, _[x] + _[k] + nt]),
    Math.min(r[x], l[x]) - nt,
    Math.max(r[x], l[x]) + nt
  ])], u = d("x", "w"), c = d("y", "h"), p = s.x === 0, f = o.x === 0, m = (p ? c : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= nt - 1e-9), w = (f ? c : u).filter((x) => (x - (f ? i.y : i.x)) * (f ? o.y : o.x) >= nt - 1e-9);
  let b = null, g = 1 / 0;
  const $ = (x) => {
    const k = Fd(x, s, o);
    if (!k) return;
    const _ = Vd(k, a);
    _ < g - 1e-6 && (b = k, g = _);
  };
  if (p && f)
    for (const x of m) for (const k of u) for (const _ of w)
      $([n, { x: n.x, y: x }, { x: k, y: x }, { x: k, y: _ }, { x: i.x, y: _ }, i]);
  else if (!p && !f)
    for (const x of m) for (const k of c) for (const _ of w)
      $([n, { x, y: n.y }, { x, y: k }, { x: _, y: k }, { x: _, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const k of w)
      $([n, { x: n.x, y: x }, { x: k, y: x }, { x: k, y: i.y }, i]);
  else
    for (const x of m) for (const k of w)
      $([n, { x, y: n.y }, { x, y: k }, { x: i.x, y: k }, i]);
  return b ?? [n, r, p ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function hl(e, t, n) {
  const i = ut(e, t, n), s = i.x + (i.w - (3 * ii + 2 * po)) / 2, o = i.y + wn + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: s + l * (ii + po), y: o, w: ii, h: gn - 2 }
  }));
}
function jd(e) {
  const { x: t, y: n, w: i, h: s } = e;
  return Le(e) ? [{ end: "start", a: { x: t, y: n }, b: { x: t, y: n + s } }, { end: "end", a: { x: t + i, y: n }, b: { x: t + i, y: n + s } }] : [{ end: "start", a: { x: t, y: n }, b: { x: t + i, y: n } }, { end: "end", a: { x: t, y: n + s }, b: { x: t + i, y: n + s } }];
}
function ho(e, t, n, i) {
  const s = [...e.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const c = hl(u, i, e).find((p) => si(t, p.rect, 0));
    if (c) return { kind: "chip", block: u.id, position: c.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const c of Un(e, u, i)) {
      const p = C(t, c.pt);
      p <= Hn + n && p < r && (o = { kind: "port", block: u.id, port: c.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let c = null, p = 1 / 0;
    for (const f of jd(u)) {
      const m = Vt(t, f.a, f.b);
      m <= n && m < p && (c = { kind: "bus-end", id: u.id, end: f.end }, p = m);
    }
    if (c) return c;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !si(t, ut(u, i, e), n)) continue;
    const c = Le(u) ? (t.x - u.x) / u.w : (t.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: dl(c) };
  }
  let l = null, a = 1 / 0;
  for (const u of e.wires) {
    const c = pl(e, u, i);
    if (!c) continue;
    const p = fl(c.a, c.b);
    for (let f = 1; f < p.length; f++) {
      const m = Vt(t, p[f - 1], p[f]);
      m <= n && m < a && (l = { kind: "wire", id: u.id }, a = m);
    }
  }
  if (l) return l;
  const d = s.find((u) => u.kind !== "bus" && si(t, ut(u, i, e), 0));
  return d ? { kind: "block", id: d.id } : null;
}
function Wd(e, t) {
  if (!e.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of e.blocks) {
    const l = ut(r, t, e);
    n = Math.min(n, l.x), i = Math.min(i, l.y), s = Math.max(s, l.x + l.w), o = Math.max(o, l.y + l.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class ml extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function ri(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function qd(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function Zd(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new ml(s.message) : s;
  }
}
async function Gd(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const Kd = 3;
function gt(e) {
  if (typeof e == "number")
    return e === Kd ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class Yd {
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
    const i = { ...t, id: q(), name: n, revision: 0 }, s = await this.run(i, null, !1);
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
      const o = await Zd(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof ml ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = gt(o)), this.onChange(), null;
    }
  }
}
var Xd = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Qd = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Jd = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", tu = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", eu = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", nu = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", iu = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", su = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", ou = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", ru = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", lu = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", au = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", cu = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", du = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z";
const at = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function dt(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const ls = 12, B = "non-scaling-stroke", uu = 7, pu = 10, fu = "#f43f5e", hu = "3 2", mu = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", gl = 24, Ze = 4, mo = 4, nn = ls * 0.85, gu = 0.58;
function wu(e, t, n, i) {
  const s = gl;
  if (!t) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), l = Math.abs(Math.sin(o)), [a, d] = e.shape === "circle" ? [e.diameter / Math.SQRT2, e.diameter / Math.SQRT2] : [e.width * r + e.depth * l, e.width * l + e.depth * r], u = a * i - 2 * mo, c = d * i - 2 * mo, p = t.length * gu * nn, f = s + Ze + nn, m = s + Ze + p, w = Math.max(s, p), b = (k, _) => Math.max(0, k - u) + Math.max(0, _ - c), g = b(w, f), $ = b(m, s);
  if (g > 0 && $ < g) {
    const k = -m / 2;
    return {
      mode: "line",
      iconX: (k + s / 2) / i,
      iconY: 0,
      labelX: (k + s + Ze) / i,
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
    labelY: (x + s + Ze + nn / 2) / i,
    labelAnchor: "middle"
  };
}
function yu(e, t, n, i = 0, s = 0) {
  const o = gl / t;
  return customElements.get("ha-icon") ? A`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : A`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${mu} fill=${n}></path></g>`;
}
const bu = "__preview__", vu = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, $u = /* @__PURE__ */ new WeakMap();
function xu(e, t) {
  var s;
  const n = dt($u, e.walls, () => /* @__PURE__ */ new WeakMap()), i = dt(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = dt(i, e.openings, () => ({})))[t] ?? (s[t] = Or(e, t));
}
const ku = /* @__PURE__ */ new WeakMap();
function Mu(e, t) {
  const n = Nn(t.props.kind);
  if (!n) return [];
  const i = xu(e, n), s = dt(ku, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = zc(e, t, () => i), s.set(t, o)), o;
}
function Ii(e, t) {
  return e.props.kind === "ceiling_light" && e.props.shape === "round" ? Math.max(e.props.diameter / 2, t) : t;
}
function _u(e, t, n, i, s) {
  const o = e.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? A`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></rect>` : o.shape === "spot" ? A`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${B}></circle>` : A`<circle class="icon" r=${Ii(e, t)} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>`;
    case "wall_light":
      return A`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${B}></path>`;
    case "motion_sensor": {
      const l = (a) => `M${t * a} ${-t * a * 0.8}A${t * a} ${t * a * 0.8} 0 0 1 ${t * a} ${t * a * 0.8}`;
      return A`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="arcs" d=${l(1) + l(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    case "illuminance_sensor": {
      let l = "";
      for (let a = 0; a < 8; a++) {
        const d = a * Math.PI / 4;
        l += `M${Math.cos(d) * t * 1.15} ${Math.sin(d) * t * 1.15}L${Math.cos(d) * t * 1.6} ${Math.sin(d) * t * 1.6}`;
      }
      return A`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="rays" d=${l} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    case "wall_switch":
      return A`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} fill=${r.fill}
        stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v} vector-effect=${B}></rect>`;
    case "smart_button":
      return A`<rect class="icon" x=${-t * 0.6} y=${-t * 0.6} width=${t * 1.2} height=${t * 1.2} rx=${t * 0.35}
        fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" stroke-dasharray=${s ?? v}
        vector-effect=${B}></rect>
        <circle class="dot" r=${t * 0.18} fill=${n}></circle>`;
    case "socket":
      return A`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <circle class="dot" cx=${-t * 0.4} r=${t * 0.15} fill=${n}></circle>
        <circle class="dot" cx=${t * 0.4} r=${t * 0.15} fill=${n}></circle>`;
    case "climate_sensor":
      return A`<circle class="icon" cx=${-t * 0.3} r=${t * 0.45} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="thermo" d=${`M${-t * 0.3} ${-t * 0.45}V${-t * 1.1}M${-t * 0.3} ${-t * 0.45}H${-t * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>
        <path class="drop" d=${`M${t * 0.7} ${-t * 0.7}Q${t * 1.1} ${-t * 0.1} ${t * 0.7} ${t * 0.3}Q${t * 0.3} ${-t * 0.1} ${t * 0.7} ${-t * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${B}></path>`;
    case "exhaust_fan": {
      let l = "";
      for (let a = 0; a < 4; a++) {
        const d = a * Math.PI / 2 + Math.PI / 4;
        l += `M0 0L${Math.cos(d) * t * 0.85} ${Math.sin(d) * t * 0.85}`;
      }
      return A`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="blades" d=${l} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    default:
      return A`${v}`;
  }
}
function Au(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return A`${v}`;
  const o = wu(s, s.label, i, t.scale), r = s.shape === "circle" ? A`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${B}></circle>` : A`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${B}></rect>`;
  return A`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${yu(s.icon, t.scale, n, o.iconX, o.iconY)}
    <text class="equipment-label" x=${o.labelX} y=${o.labelY} text-anchor=${o.labelAnchor} dominant-baseline="middle"
      font-size=${nn / t.scale}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Su(e, t, n = 0) {
  return e === "bound" ? v : A`<circle class=${`bind-ring bind-${e}`} r=${Math.max(ls * 1.7 / t, n + 4 / t)} fill="none" style=${`stroke:${vu[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : v} vector-effect=${B}></circle>`;
}
function Eu(e) {
  return e.action === "toggle" ? ["toggle", du] : e.action === "auto" ? ["auto", au] : e.value === "off" ? ["set-off", su] : ["set-on", iu];
}
function Iu(e, t, n, i) {
  const s = t ? Eu(t) : e.status === "error" ? ["alert", Xd] : null;
  if (!s) return v;
  const [o, r] = s, l = t ? i.palette.selection : fu, a = n * 0.9, d = -n * 0.9, u = pu / i.scale;
  return A`<g class="badge" data-badge=${o}>
    <circle cx=${a} cy=${d} r=${uu / i.scale} fill=${i.palette.background} stroke=${l} stroke-width="1.5"
      vector-effect=${B}></circle>
    <path d=${r} fill=${l} transform=${`translate(${a - u / 2} ${d - u / 2}) scale(${u / 24})`}></path>
  </g>`;
}
function Pu(e, t, n, i) {
  var w, b, g;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = ls / n.scale, l = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, a = !i && ((w = n.selection) == null ? void 0 : w.kind) === "device" && n.selection.id === e.id, d = !i && ie(e.props.kind), u = d ? (b = n.containerState) == null ? void 0 : b.call(n, e) : void 0, c = d && !u, p = `device device-${e.props.kind}${a ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (c ? " no-data" : ""), f = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, m = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : Math.max(r * 1.6, Ii(e, r));
  return A`
    <g class=${p} data-id=${e.id} opacity=${f} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${a ? A`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${B}></circle>` : v}
      ${e.props.kind === "equipment" ? Au(e, n, o, l) : A`<g transform=${`rotate(${l})`}>${_u(
    e,
    r,
    o,
    s.deviceFill,
    c ? hu : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? Su(n.bindingStatus(e), n.scale, Ii(e, r)) : v}
      ${u ? Iu(u, ((g = n.containerFlash) == null ? void 0 : g.call(n, e)) ?? null, r, n) : v}
    </g>`;
}
function Ou(e, t, n, i) {
  const s = Mu(e, t);
  if (s.length === 0) return v;
  const o = n.palette, r = t.invalid ? o.invalid : Nn(t.props.kind) === "motion" ? o.motionCone : o.cone, l = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, a = s.map(at).join("");
  return t.props.kind === "ceiling_light" ? A`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${B}></path>` : A`<path class="cone" d=${a} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${l} vector-effect=${B}></path>`;
}
function Cu(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return v;
  const n = t.selection.id, i = e.devices.find((l) => l.id === n), s = i ? _i(e, i, t.scale) : null;
  if (!s) return v;
  const o = t.palette.selection;
  return A`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${B}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${B} style="cursor:grab"></circle>
  </g>`;
}
function Nu(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = Y(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: bu, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = Y(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return A`
    <g class="cones">${t.showCones ? n.map((i) => Ou(e, i.d, t, i.preview)) : v}</g>
    <g class="devices">${n.map((i) => Pu(i.d, i.pose, t, i.preview))}</g>
    ${Cu(e, t)}`;
}
const bn = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], ze = "non-scaling-stroke";
function Lu(e, t, n, i) {
  const s = i.palette, o = bn[n % bn.length], r = i.selectedId === t.id, l = Lt(e, t), a = Hr(l), d = 12 / i.scale, u = (c) => {
    if (t.shape.kind !== "polygon") return !1;
    const p = t.shape.vertices[c];
    return p.kind === "free" && p.lost === !0;
  };
  return A`
    <g class=${`azone${t.invalid ? " invalid" : ""}${r ? " selected" : ""}`} data-id=${t.id}>
      <path class="azone-fill" d=${at(l)} fill=${t.invalid ? "url(#azone-hatch)" : o}
        fill-opacity=${t.invalid ? v : "0.18"} stroke=${o} stroke-width=${r ? "3" : "1.5"}
        vector-effect=${ze}></path>
      <text class="azone-label" x=${a.x} y=${a.y} text-anchor="middle" dominant-baseline="middle" font-size=${d}
        fill=${t.invalid ? s.invalid : o} font-family="system-ui, sans-serif">${t.name}</text>
      ${r && t.shape.kind === "polygon" ? l.map((c, p) => A`
        <circle class=${`azone-vertex${u(p) ? " lost" : ""}`} data-index=${p} cx=${c.x} cy=${c.y}
          r=${5 / i.scale} fill=${s.background} stroke=${u(p) ? s.invalid : o} stroke-width="2"
          vector-effect=${ze}></circle>`) : v}
    </g>`;
}
function zu(e, t, n) {
  const i = n.palette, s = 14 / n.scale;
  return A`<g class="azone-members">${Ji(e, t).map(({ device: o, participates: r }) => {
    const l = Y(e, o);
    return l ? r ? A`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${ze}></circle>` : A`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${ze}></circle>` : v;
  })}</g>`;
}
function Tu(e, t) {
  const n = e.cursor ? [...e.points, e.cursor] : e.points;
  return A`<polyline class=${`azone-draft${e.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${e.invalid ? t.palette.invalid : t.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${ze}></polyline>`;
}
function Du(e, t) {
  const n = 8 / t.scale, i = F(e);
  return A`
    <defs>
      <pattern id="azone-hatch" patternUnits="userSpaceOnUse" width=${n} height=${n} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${n} stroke=${t.palette.invalid} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="azones">${i.map((s, o) => Lu(e, s, o, t))}</g>
    ${t.selectedId && i.some((s) => s.id === t.selectedId) ? zu(e, t.selectedId, t) : v}
    ${t.draft ? Tu(t.draft, t) : v}`;
}
function Ft(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function wl(e) {
  return `${e.toFixed(2)} ${h("unit.m2")}`;
}
const Ru = /* @__PURE__ */ new WeakMap(), Bu = /* @__PURE__ */ new WeakMap(), yl = /* @__PURE__ */ new WeakMap();
function Vn(e, t, n) {
  const i = Q(e.dir), s = O(e.a, S(e.dir, t)), o = O(e.a, S(e.dir, n));
  return [O(s, S(i, e.leftOff)), O(o, S(i, e.leftOff)), E(o, S(i, e.rightOff)), E(s, S(i, e.rightOff))];
}
function Te(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = et(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function Hu(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const l = e[r], a = e[(r + 1) % e.length], d = l.x * a.y - a.x * l.y;
    n += d, i += (l.x + a.x) * d, s += (l.y + a.y) * d;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return se(o, e) ? o : t;
}
const V = "non-scaling-stroke";
function Fu(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const l of e.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const l of e.walls) {
    const a = Te(e, l.id);
    if (!a) continue;
    const d = Q(a.dir);
    for (const [u, c, p] of [[l.a, a.a, a.dir], [l.b, a.b, S(a.dir, -1)]]) {
      const f = e.nodes.find((_) => _.id === u);
      if (!f || f.host || n.get(u) !== 1) continue;
      const m = O(c, S(d, a.leftOff + i)), w = E(c, S(d, a.rightOff + i)), b = S(d, 1), g = S(O(m, w), 0.5), $ = O(E(g, S(b, -o)), S(p, s / 2)), x = E(E(g, S(b, o)), S(p, s / 2)), k = [m, $, x, w];
      r.push(A`<path class="wall-break" d=${`M${k.map((_) => `${_.x} ${_.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${V}></path>`);
    }
  }
  return r.length ? A`${r}` : v;
}
function Uu(e, t, n) {
  const i = t.palette, s = Hu(e.outline, e.seed), o = 12 / t.scale;
  return A`
    <path class="zone${e.broken ? " broken" : ""}" d=${at(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${V}></path>
    ${t.mode === "zones" ? v : A`<text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${wl(pr(e.outline))}</tspan>
    </text>`}`;
}
function Vu(e, t, n) {
  const i = Q(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : S(i, -1), r = s ? e.leftOff : e.rightOff, [l, a] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = O(O(e.a, S(e.dir, l)), S(o, r)), u = O(O(e.a, S(e.dir, a)), S(o, r)), c = O(d, S(o, t.width)), p = tt(E(c, d), E(u, d)) > 0 ? 1 : 0;
  return A`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${V}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${V}></path>`;
}
function ju(e, t, n) {
  const i = Q(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const l = O(O(e.a, S(e.dir, t.offset)), S(i, r)), a = O(O(e.a, S(e.dir, t.offset + t.width)), S(i, r));
    return A`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${V}></line>`;
  });
  return A`${o}`;
}
function Wu(e, t, n) {
  const i = Te(e, t.wallId);
  if (!i) return v;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = Vn(i, t.offset, t.offset + t.width), l = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return A`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${at(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Vu(i, t, o) : t.kind === "window" ? ju(i, t, o) : v}
    </g>`;
}
function go(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, l = O(e, S(n, i)), a = O(t, S(n, i)), d = (c, p) => {
    const f = O(p, S(n, i + r));
    return A`<line x1=${c.x} y1=${c.y} x2=${f.x} y2=${f.y} stroke=${o} stroke-width="0.75" vector-effect=${V}></line>`;
  }, u = O(S(O(l, a), 0.5), S(n, 9 / s.scale));
  return A`
    <g class="dim">
      ${d(O(e, S(n, 2 / s.scale)), e)}${d(O(t, S(n, 2 / s.scale)), t)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${o} stroke-width="1" vector-effect=${V}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Ft(C(e, t))}</text>
    </g>`;
}
function qu(e, t) {
  const n = t.selection;
  if (!n) return v;
  const i = t.palette, s = 4 / t.scale, o = (r) => A`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((l) => l.id === n.id);
    return r ? o(r) : v;
  }
  if (n.kind === "wall") {
    const r = dt(yl, e, In).get(n.id), l = Te(e, n.id);
    if (!r || !l) return v;
    const a = Q(l.dir);
    return A`
      <path d=${at(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${V}></path>
      ${o(l.a)}${o(l.b)}
      ${go(l.a, l.b, a, l.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((p) => p.id === n.id), l = r ? Te(e, r.wallId) : null;
    if (!r || !l) return v;
    const a = S(Q(l.dir), -1), d = l.rightOff + 18 / t.scale, u = (p) => O(l.a, S(l.dir, p)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return A`
      <path d=${at(Vn(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${V}></path>
      ${c.filter(([p, f]) => f - p >= 1).map(([p, f]) => go(u(p), u(f), a, d, t))}`;
  }
  return v;
}
function Zu(e, t, n) {
  return C(e, t) < 1e-6 ? null : Vn(or(e, t, n.thickness, n.baseline), 0, C(e, t));
}
function Gu(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, l = r ? Te(e, r.wallId) : null;
  return A`
    ${o ? A`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${V}></path>` : v}
    ${(n.walls ?? []).map((a) => {
    const d = Zu(a.a, a.b, a.props);
    return A`<g class="preview-wall">
        ${d ? A`<path d=${at(d)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${V}></line></g>`;
  })}
    ${r && l ? A`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${at(Vn(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${Yu(e, t)}`;
}
function Ku(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return A`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${V}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${V}></rect></g>`;
}
function Yu(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? Ku(n.anchor, t) : v, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (f) => f / t.scale, { x: l, y: a } = o.pt, d = { stroke: i.background, width: "3" };
  let u, c = v;
  if (o.kind === "node") {
    const f = r(5);
    u = A`<g class="snap-node"><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${V}></rect></g>`;
  } else if (o.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    u = A`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${V}></path></g>`;
  } else if (o.kind === "wall") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    u = A`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${V}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${V}></path></g>`;
    const w = o.endpoint.kind === "wall" ? dt(yl, e, In).get(o.endpoint.wallId) : void 0;
    w && (c = A`<path class="snap-wall-hl" d=${at(w)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${V}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    u = A`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${V}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${V}></path></g>`;
  }
  const p = h(`snapmark.${o.kind}`);
  return A`
    ${c}${s}${u}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${V} font-family="system-ui, sans-serif">${p}</text>`;
}
function Xu(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = dt(Ru, n, (c) => cr(c, !0)), o = n.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? dt(Bu, n, Ki) : null, l = 8 / t.scale, a = t.selection, d = (t.mode ?? "plan") === "plan", u = d ? v : String(i.dimOpacity);
  return A`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${l} height=${l} patternTransform="rotate(45)">
        <rect width=${l} height=${l} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${l} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${u}>${n.zones.map((c) => Uu(c, t, (a == null ? void 0 : a.kind) === "zone" && a.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(at).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${u}></path>
    ${r ? A`<g class="railings" opacity=${u}>${o.flatMap((c) => (r.get(c.id) ?? []).map((p) => A`<path d=${at(p)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${u}>${n.openings.map((c) => Wu(n, c, t))}</g>
    <g class="wall-breaks" opacity=${u}>${Fu(n, t)}</g>
    ${t.mode === "zones" ? Du(n, {
    palette: i,
    scale: t.scale,
    selectedId: (a == null ? void 0 : a.kind) === "automationZone" ? a.id : null,
    draft: t.preview.zoneDraft
  }) : v}
    <g class="devices-layer">${Nu(n, {
    palette: i,
    scale: t.scale,
    selection: a,
    showCones: t.showCones ?? !0,
    dim: d,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0,
    containerState: t.containerState,
    containerFlash: t.containerFlash
  })}</g>
    <g class="selection">${qu(n, t)}</g>
    <g class="preview">${Gu(n, t)}</g>`;
}
const lt = "non-scaling-stroke", De = "system-ui, sans-serif", Qu = 13, xe = 9, Ju = 11, wo = 18, li = 12, ai = 11, sn = 10, yo = 4.5, tp = 12, ep = 11.5, ci = 10.5, np = 6, ip = {
  IN: ou,
  OUT: lu,
  BAT: ru,
  PV: cu
}, Ge = {
  top: { x: 0, y: 1 },
  right: { x: -1, y: 0 },
  bottom: { x: 0, y: -1 },
  left: { x: 1, y: 0 }
}, bo = { dead: 0, nodata: 1, idle: 2, live: 3 };
function be(e) {
  if (e == null || !Number.isFinite(e)) return "—";
  const t = Math.round(e);
  if (t === 0) return "0 W";
  const n = e < 0 ? "−" : "";
  return Math.abs(t) < 1e3 ? `${n}${Math.abs(t)} W` : `${n}${(Math.abs(e) / 1e3).toFixed(2)} kW`;
}
const di = (e, t) => e == null || !Number.isFinite(e) ? "—" : `${Math.round(e)} ${t}`;
function sp(e) {
  return e ? e.state === "dead" ? "dead" : e.power === null ? "nodata" : Math.abs(e.power) >= 1 ? "live" : "idle" : "nodata";
}
function jn(e, t) {
  return { live: t.powerLive, idle: t.powerIdle, dead: t.powerDead, nodata: t.powerNoData }[e];
}
const op = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, rp = A`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, lp = (e) => `M${e.map((t) => `${t.x} ${t.y}`).join("L")}`, Re = (e, t, n, i) => A`<path d=${e} fill=${i} transform=${`translate(${t.x - n / 2} ${t.y - n / 2}) scale(${n / 24})`}></path>`;
function ap(e, t) {
  var d;
  const n = (d = e.live) == null ? void 0 : d.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Hn : xe, s = e.pts[0], o = e.pts[e.pts.length - 1], r = sn / 2 / t.scale, l = 3 / t.scale, a = e.pts.slice(1).map((u, c) => ({ p: e.pts[c], q: u, len: Math.abs(u.x - e.pts[c].x) + Math.abs(u.y - e.pts[c].y) })).sort((u, c) => c.len - u.len);
  for (const { p: u, q: c, len: p } of a) {
    if (p < 2 * r + 2 * l) continue;
    const f = { x: (u.x + c.x) / 2, y: (u.y + c.y) / 2 }, m = (b, g) => Math.hypot(f.x - b.x, f.y - b.y) >= g + r + l;
    if (!m(s, i(e.w.from)) || !m(o, i(e.w.to))) continue;
    const w = Math.atan2(c.y - u.y, c.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((w + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function cp(e, t, n) {
  var d;
  const i = t.palette, s = jn(e.style, i), o = lp(e.pts), r = ((d = t.selection) == null ? void 0 : d.kind) === "powerWire" && t.selection.id === e.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[e.style], a = ap(e, t);
  return A`<g data-wire=${e.w.id}>
    ${r ? A`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${lt}></path>` : v}
    ${e.style === "live" ? A`<path class="glow" d=${o} fill="none" stroke=${s} stroke-width="8"
      stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round" vector-effect=${lt}>${n ? v : rp}</path>` : v}
    <path class=${`wire ${e.style}`} d=${o} fill="none" stroke=${s} stroke-width=${l}
      stroke-dasharray=${e.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${lt}></path>
    ${a ? A`<path class="arrow" d=${`M${sn / 2} 0L${-sn / 2} ${-yo}L${-sn / 2} ${yo}Z`}
      fill=${s} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / t.scale})`}></path>` : v}
  </g>`;
}
function dp(e, t, n) {
  const i = ip[e.name];
  return A`<g class="port" data-port=${e.name}>
    <title>${e.name}</title>
    <circle cx=${e.pt.x} cy=${e.pt.y} r=${Hn} fill=${n.portFill}
      stroke=${t ? jn(t, n) : n.blockStroke} stroke-width="1.5" vector-effect=${lt}></circle>
    ${i ? Re(i, e.pt, Qu, n.portIcon) : A`<text x=${e.pt.x} y=${e.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${De}>${e.name}</text>`}
  </g>`;
}
function up(e, t, n, i) {
  const s = () => ({ kind: "text", value: be(n == null ? void 0 : n.power) }), o = (r) => ({ kind: "switch", state: n == null ? void 0 : n.switch, controllable: r });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [s(), { kind: "text", value: di(n == null ? void 0 : n.voltage, "V") }] : [s()];
    case "device": {
      const r = t.device(e.deviceId);
      if (!r) return [{ kind: "text", value: h("power.missing"), fill: i.blockInvalid }];
      const l = r.bindings ?? {}, a = Ue(r), d = [];
      return a ? (l.power_in && d.push({ kind: "text", label: h("power.in"), value: be(n == null ? void 0 : n.power_in) }), l.power_out && d.push({ kind: "text", label: h("power.out"), value: be(n == null ? void 0 : n.power_out) })) : l.power && d.push(s()), l.voltage && d.push({ kind: "text", value: di(n == null ? void 0 : n.voltage, "V") }), l.control && d.push(o(_r(r))), a && d.push({ kind: "text", label: h("power.loss"), value: be(n == null ? void 0 : n.loss) }), d;
    }
    case "battery":
      return [{ kind: "text", label: h("power.soc"), value: di(n == null ? void 0 : n.soc, "%") }, s()];
    case "pv":
      return [s()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (n == null ? void 0 : n.hint) === "disagree" ? [{ kind: "text", value: "—", note: h("power.hint.disagree"), fill: i.blockInvalid }] : [s()];
    case "bus":
      return [];
  }
}
function pp(e, t, n) {
  const i = e.state ?? "unknown", s = e.controllable ? 0 : li + 3, o = t.x - s / 2, r = `${h(`power.switch.${i}`)}${e.controllable ? "" : ` · ${h("power.readOnly")}`}`;
  return A`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${Re(
    i === "on" ? tu : Jd,
    { x: o, y: t.y },
    wo,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${e.controllable ? v : Re(eu, { x: o + wo / 2 + 3 + li / 2, y: t.y + 1 }, li, n.blockValue)}
  </g>`;
}
function fp(e, t, n, i, s) {
  const o = n == null ? void 0 : n.position;
  if (o !== "A" && o !== "B") return v;
  const r = Un(e, t, i.geo), l = r.find((b) => b.name === o), a = r.find((b) => b.name === (t.form === "2in1out" ? "OUT" : "IN"));
  if (!l || !a) return v;
  const d = ut(t, i.geo, e), u = Math.min(d.w, d.h) / 2, c = { x: l.pt.x + Ge[l.side].x * u, y: l.pt.y + Ge[l.side].y * u }, p = { x: a.pt.x + Ge[a.side].x * u, y: a.pt.y + Ge[a.side].y * u }, m = s(a.name) === "live" ? i.palette.powerLive : i.palette.blockStroke, w = `M${l.pt.x} ${l.pt.y}C${c.x} ${c.y} ${p.x} ${p.y} ${a.pt.x} ${a.pt.y}`;
  return A`<path class="ts-path" d=${w} fill="none" stroke=${m} stroke-opacity="0.4" stroke-width="4"
    stroke-linecap="round" vector-effect=${lt}></path>`;
}
function hp(e, t, n, i) {
  const s = i.palette;
  return hl(t, i.geo, e).map(({ position: o, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === o;
    return A`<g class=${l ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? s.accent : "none"}
        stroke=${l ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${lt}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? s.accentText : s.blockValue} font-family=${De}>${o}</text>
    </g>`;
  });
}
function mp(e, t, n, i) {
  var f;
  const s = n.palette, o = ut(t, n.geo, e), r = (f = n.frame) == null ? void 0 : f.blocks[t.id], l = t.kind === "device" ? n.geo.device(t.deviceId) : void 0, a = t.kind === "device" && !l, d = o.x + o.w / 2, u = is(t, n.geo) || h(`power.kind.${t.kind}`), c = up(t, n.geo, r, s), p = t.kind === "remainder";
  return A`<g class=${`block block-${t.kind}${a ? " missing" : ""}`} data-id=${t.id}>
    <rect class="body" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx="4" fill=${s.blockFill}
      stroke=${p ? s.powerRemainder : s.blockStroke} stroke-width=${p ? 1.5 : 1.25}
      stroke-dasharray=${p ? "6 4" : v} vector-effect=${lt}></rect>
    ${t.kind === "transfer" ? fp(e, t, r, n, (m) => i(t.id, m)) : v}
    ${l && l.placement.mode !== "none" ? A`<g class="pin"><title>${h("power.planDevice")}</title>
      ${Re(nu, { x: o.x + 4 + ai / 2, y: o.y + 4 + ai / 2 }, ai, s.blockValue)}</g>` : v}
    <text class="name" x=${d} y=${o.y + wn - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${tp} font-weight="600" fill=${s.blockName} font-family=${De}>${u}</text>
    ${c.map((m, w) => {
    const b = o.y + wn + w * gn + gn / 2;
    if (m.kind === "chips") return t.kind === "transfer" ? hp(e, t, r, n) : v;
    if (m.kind === "switch") return pp(m, { x: d, y: b }, s);
    const g = m.fill ?? s.blockValue, $ = m.label ? A`<tspan>${m.label} </tspan>` : v, x = m.note ? A`<tspan> ${m.note}</tspan>` : v;
    return A`<text x=${d} y=${b} text-anchor="middle" dominant-baseline="central" font-size=${ep} fill=${g}
        font-family=${De}>${$}<tspan font-weight="600">${m.value}</tspan>${x}</text>`;
  })}
    ${Un(e, t, n.geo).map((m) => dp(m, i(t.id, m.name), s))}
  </g>`;
}
function gp(e, t, n, i) {
  const s = i.palette, o = e.w >= e.h, r = o ? e.x : e.y, l = r + (o ? e.w : e.h), a = o ? e.h : e.w;
  let d = v;
  const u = e.name ?? "", c = Math.min(ci, a - 4), p = c >= np, f = u.length * (p ? c : ci) * 0.58 + 12;
  if (u) {
    const m = t.map((g) => o ? g.x : g.y).sort((g, $) => g - $);
    let w = { lo: 0, hi: -1 }, b = r;
    for (const g of [...m, l + xe]) {
      const $ = Math.min(g - xe, l);
      $ - b > w.hi - w.lo && (w = { lo: b, hi: $ }), b = Math.max(b, g + xe);
    }
    if (w.hi - w.lo >= f) {
      const g = (w.lo + w.hi) / 2, $ = o ? { x: g, y: p ? e.y + e.h / 2 : e.y - 7 } : { x: p ? e.x + e.w / 2 : e.x - 7, y: g };
      d = A`<text class="bus-name" x=${$.x} y=${$.y} text-anchor="middle" dominant-baseline="central"
        font-size=${p ? c : ci} fill=${s.blockValue} font-family=${De}
        transform=${o ? v : `rotate(-90 ${$.x} ${$.y})`}>${u}</text>`;
    }
  }
  return A`<g class="block block-bus" data-id=${e.id}>
    <rect class="body" x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="2" fill=${s.blockFill}
      stroke=${n ? jn(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${lt}></rect>
    ${d}
  </g>`;
}
function wp(e, t, n) {
  return A`<g class="terminal">
    <circle cx=${e.x} cy=${e.y} r=${xe} fill=${n.portFill} stroke=${jn(t, n)} stroke-width="1.5"
      vector-effect=${lt}></circle>
    ${Re(Qd, e, Ju, n.portIcon)}
  </g>`;
}
function yp(e, t) {
  const n = t.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = e.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const s = ut(i, t.geo, e), o = 4 / t.scale;
  return A`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${t.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${lt}></rect>`;
}
function bp(e, t) {
  var p;
  const n = t.preview.power ?? e, i = t.palette, s = [];
  for (const f of n.wires) {
    const m = pl(n, f, t.geo);
    if (!m) continue;
    const w = (p = t.frame) == null ? void 0 : p.wires[f.id];
    s.push({ w: f, a: m.a, b: m.b, pts: fl(m.a, m.b), live: w, style: sp(w) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of s)
    for (const [m, w] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const b = r.get(m.bus);
      (b === void 0 || bo[f.style] > bo[b]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], w.pt]), a.push({ at: w.pt, style: f.style });
    }
  const d = (f, m) => o.get(`${f}:${m}`), u = op(), c = t.preview.wireDraft;
  return A`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? gp(f, l.get(f.id) ?? [], r.get(f.id), t) : v)}</g>
    <g class="wires">${s.map((f) => cp(f, t, u))}</g>
    ${yp(n, t)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? v : mp(n, f, t, d))}</g>
    <g class="terminals">${a.map((f) => wp(f.at, f.style, i))}</g>
    ${c ? A`<line class="wire-draft" x1=${c.from.x} y1=${c.from.y} x2=${c.to.x} y2=${c.to.y}
      stroke=${c.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${lt}></line>` : v}
  </g>`;
}
const vp = {
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
}, $p = {
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
function xp(e) {
  return e ? vp : $p;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, as = (e) => (...t) => ({ _$litDirective$: e, values: t });
class cs {
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
const bl = (e) => e.strings === void 0, kp = {}, vl = (e, t = kp) => e._$AH = t;
class Mp extends cs {
  constructor(t) {
    if (super(t), t.type !== kt.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? ot : (vl(t), n);
  }
}
const W = as(Mp), Pi = 1, vo = 1e-6;
function _p(e, t, n, i, s) {
  const o = (a) => a > vo && a < s - vo, r = new Set(e.nodes.filter((a) => {
    var d;
    return ((d = a.host) == null ? void 0 : d.wallId) === t.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const d = En(e, a).host.offset;
    o(d) && l.push({ t: d, nodeId: a });
  }
  for (const a of e.walls) {
    if (a.id === t.id || [a.a, a.b].some((w) => w === t.a || w === t.b || r.has(w))) continue;
    const d = j(e, a.a), u = j(e, a.b), c = C(d, u), p = c === 0 ? null : mt(n, i, d, E(u, d));
    if (!p) continue;
    const f = Zi(p, d, u) * c;
    if (f < -Pi || f > c + Pi) continue;
    const m = H(E(p, n), i);
    o(m) && l.push({ t: m, wall: a, pt: p });
  }
  return l;
}
function $o(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function xo(e, t) {
  if ("nodeId" in t)
    return delete En(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (C(j(e, o), t.pt) <= Pi) return o;
  const { pt: n, offset: i } = Dn(e, t.wall, t.pt), s = { id: q(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function Ap(e, t, n) {
  const i = e.walls.find((g) => g.id === t);
  if (!i) return e;
  const s = j(e, i.a), o = j(e, i.b), r = C(s, o), l = Sn(E(o, s)), a = H(E(n, s), l), d = _p(e, i, s, l, r), u = $o(d.filter((g) => g.t < a), a), c = $o(d.filter((g) => g.t > a), a);
  if (!u && !c) return ts(e, t);
  const p = pt(e), f = p.walls.find((g) => g.id === t);
  let m = t, w = 0;
  if (c) {
    const g = xo(p, c);
    if (w = H(E(j(p, g), s), l), u) {
      const $ = { ...f, id: q(), a: g };
      p.walls.push($), m = $.id;
    } else
      f.a = g;
  }
  u && (f.b = xo(p, u));
  const b = (g, $) => g.wallId !== t || u && $ <= u.t ? !0 : !c || $ < c.t ? !1 : (g.wallId = m, g.offset -= w, !0);
  p.openings = p.openings.filter((g) => b(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || b(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !b(g.host, g.host.offset) && delete g.host;
  for (const g of F(p)) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((x) => x.kind !== "wall" || b(x, x.offset) ? x : Fr(x)));
  }
  return Rn(p), xt(p, e);
}
function ds(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Sp(e, t, n) {
  return O(e, S(Sn(E(t, e)), n));
}
function ko(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function jt(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? ds(r, t) : t, d = r !== void 0 && a.y === r.y, u = (g) => !r || Math.abs(d ? g.y - r.y : g.x - r.x) <= 1;
  let c = null;
  for (const g of e.nodes) {
    if (l.has(g.id)) continue;
    const $ = { x: g.x, y: g.y }, x = C($, a);
    x <= i && u($) && (!c || x < c.d) && (c = { id: g.id, pt: $, d: x });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const p = e.walls.filter((g) => !l.has(g.a) && !l.has(g.b)).map((g) => ({ w: g, f: et(e, g) })).filter((g) => g.f.len > 1e-9);
  let f = null;
  for (const { w: g, f: $ } of p) {
    const x = { x: ($.a.x + $.b.x) / 2, y: ($.a.y + $.b.y) / 2 }, k = C(x, a);
    k <= i && u(x) && (!f || k < f.d) && (f = { wallId: g.id, pt: x, offset: $.len / 2, d: k });
  }
  if (f)
    return { pt: f.pt, kind: "mid", endpoint: { kind: "wall", wallId: f.wallId, offset: f.offset } };
  const m = (g) => {
    let $ = null;
    for (const { w: x, f: k } of p) {
      const _ = Q(k.dir), P = g ? [k.leftOff, -k.rightOff].filter((N) => N !== 0) : [0];
      for (const N of P) {
        const L = O(k.a, S(_, N)), R = r ? mt(r, E(a, r), L, k.dir) : O(L, S(k.dir, H(E(a, L), k.dir)));
        if (!R) continue;
        const U = H(E(R, L), k.dir);
        if (U < 0 || U > k.len) continue;
        const Z = C(R, a);
        Z <= i && (!$ || Z < $.d) && ($ = { d: Z, res: { pt: R, kind: "wall", endpoint: { kind: "wall", wallId: x.id, offset: U } } });
      }
    }
    return $ ? $.res : null;
  }, w = m(!1);
  if (w) return w;
  const b = m(!0);
  if (b) return b;
  if (s && s > 0) {
    const g = (x) => Math.round(x / s) * s, $ = r ? d ? { x: g(a.x), y: r.y } : { x: r.x, y: g(a.y) } : { x: g(a.x), y: g(a.y) };
    return ko($, "grid");
  }
  return ko(a, "none");
}
function Ep(e, t, n) {
  return t.some((i, s) => Vt(e, i, t[(s + 1) % t.length]) <= n);
}
function us(e, t, n) {
  const i = In(e);
  for (const [s, o] of i) if (se(t, o)) return s;
  for (const [s, o] of i) if (Ep(t, o, n)) return s;
  return null;
}
function Ip(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const s = et(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = Nt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Pp(e, t, n, i) {
  const s = Ip(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = e.nodes.find((d) => d.id === l);
        if (a && C(t, a) <= n) return { kind: "node", id: l };
      }
  }
  const o = us(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && se(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function Op(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, l = null;
  const a = (f) => {
    t = f, e.select(f);
  }, d = () => {
    n = null, i = null, s = null, l = null, o = !1;
  }, u = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, c = (f, m, w) => Nt(et(f, f.walls.find((b) => b.id === m)), w).t;
  function p(f) {
    const m = n;
    if (!(!m || !i) && !(f.pt.x === r.x && f.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const w = jt(i, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), b = w.endpoint, g = (w.kind === "wall" || w.kind === "mid") && b.kind === "wall", $ = w.kind === "node" && b.kind === "node" && b.nodeId !== m.nodeId, x = i.nodes.find((N) => N.id === m.nodeId), k = !!x.host && g && b.kind === "wall" && b.wallId === x.host.wallId;
        let _ = i;
        if (x.host && !k) {
          const N = structuredClone(i);
          delete N.nodes.find((L) => L.id === m.nodeId).host, _ = N;
        }
        let P = sd(_, m.nodeId, u(w));
        if ($ && b.kind === "node")
          P = ad(P, m.nodeId, b.nodeId);
        else if (g && b.kind === "wall" && !k) {
          const N = i.walls.find((L) => L.id === b.wallId);
          if (N && N.a !== m.nodeId && N.b !== m.nodeId) {
            const L = structuredClone(P);
            L.nodes.find((R) => R.id === m.nodeId).host = { wallId: b.wallId, offset: b.offset }, P = xt(L, P);
          }
        }
        s = P;
      } else if (m.kind === "wall") {
        const w = i.walls.find(($) => $.id === m.wallId), b = jt(i, f.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [w.a, w.b]
        }), g = E(b.pt, m.origin);
        s = rd(
          i,
          m.wallId,
          b.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const w = i.openings.find((b) => b.id === m.openingId);
        s = vr(i, w.id, c(i, w.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      d(), r = f.pt;
      const m = e.level(), w = f.ctrl ? us(m, f.pt, e.tolMm()) : null;
      if (w) {
        a(null), e.commit(Ap(m, w, f.pt));
        return;
      }
      const b = t, g = Pp(m, f.pt, e.tolMm(), b);
      if (a(g), !!g) {
        if (l = i = s = m, g.kind === "node") {
          let $ = g.id;
          const x = (b == null ? void 0 : b.kind) === "wall" ? m.walls.find((k) => k.id === b.id) : void 0;
          if (f.alt && x) {
            const k = ld(m, x.id, x.a === g.id ? "a" : "b");
            i = s = k.level, $ = k.nodeId, a({ kind: "node", id: $ });
          }
          n = { kind: "node", nodeId: $, origin: j(i, $) };
        } else if (g.kind === "wall")
          n = { kind: "wall", wallId: g.id, origin: f.pt };
        else if (g.kind === "opening") {
          const $ = m.openings.find((x) => x.id === g.id);
          n = { kind: "opening", openingId: $.id, grab: c(m, $.wallId, f.pt) - $.offset };
        }
      }
    },
    move(f) {
      p(f);
    },
    up(f) {
      n && p(f);
      const m = o, w = s, b = l;
      d(), m && w && b && w !== b && e.commit(w);
    },
    key(f) {
      return f === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      d(), a(null);
    }
  };
}
function Be(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function $l() {
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
    key(o, r, l) {
      return /^[0-9]$/.test(o) || o === " " ? (n === "first" ? e += o : t += o, !0) : o === "Backspace" ? (n === "first" ? e = e.slice(0, -1) : t = t.slice(0, -1), !0) : o === "Tab" ? (n = n === "first" ? "second" : "first", !0) : o === "Enter" ? (r(), !0) : o === "Escape" ? (s() ? i() : l(), !0) : !1;
    },
    tracker: (o) => ({ first: e, second: t, field: n, at: o })
  };
}
function Cp(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = $l(), s = () => {
    t = null, i.clear();
  }, o = (d) => jt(e.level(), d, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const d = Be(i.first, { min: 1 }), u = Be(i.second, { min: 1 });
      return d === null || u === null ? null : { x: t.x + (n.x >= t.x ? d : -d), y: t.y + (n.y >= t.y ? u : -u) };
    }
    return o(n).pt;
  }
  const l = (d, u) => Math.abs(d.x - u.x) < 1 || Math.abs(d.y - u.y) < 1;
  function a(d) {
    if (!t || l(t, d)) return;
    const u = id(e.level(), t, d, e.wallProps(), e.boxMeasure());
    u !== e.level() && (e.commit(u), s());
  }
  return {
    id: "box",
    down(d) {
      if (n = d.pt, !t) {
        t = o(d.pt).pt;
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
      return t ? i.key(d, () => {
        const u = r();
        u && a(u);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const d = r(), u = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || l(t, d)) return u;
      const c = e.wallProps(), p = Yr(t, d, c.thickness, e.boxMeasure());
      return p && (u.walls = p.map((f, m) => ({ a: f, b: p[(m + 1) % 4], props: { ...c, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const Mo = (e) => Math.round(e * 1e3) / 1e3 + 0;
function Np(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const l = $l(), a = () => {
    t = null, n = null, i = null, r = null, l.clear();
  }, d = (p, f) => jt(e.level(), p, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: f && n !== null });
  function u() {
    if (!n) return null;
    const p = d(s, o), f = Be(l.first, { min: 1 }), m = Be(l.second);
    if (f === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const w = f ?? C(n, p.pt);
    let b = p.pt;
    if (m === null && C(n, p.pt) < 1) {
      const k = r ?? { x: 1, y: 0 };
      b = { x: n.x + k.x, y: n.y + k.y };
    }
    if (m !== null) {
      const k = m * Math.PI / 180;
      b = { x: n.x + Math.cos(k), y: n.y - Math.sin(k) };
    }
    const g = Sp(n, b, w), $ = { x: Mo(g.x), y: Mo(g.y) }, x = e.level().nodes.find((k) => Math.hypot(k.x - $.x, k.y - $.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function c() {
    const p = u();
    if (!t || !p) return;
    const f = nd(e.level(), t, p.endpoint, e.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    e.commit(f.level);
    const m = f.level.walls.find((x) => x.id === f.wallId);
    i === null && (i = m.a);
    const w = f.endNodeId === i, b = n, g = j(f.level, f.endNodeId), $ = C(b, g);
    if ($ > 0 && (r = { x: (g.x - b.x) / $, y: (g.y - b.y) / $ }), l.clear(), w) {
      a();
      return;
    }
    t = { kind: "node", nodeId: f.endNodeId }, n = j(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !t) {
        const f = d(p.pt, !1);
        t = f.endpoint, n = f.pt;
        return;
      }
      c();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, f) {
      return o = f.shift, t ? l.key(p, c, a) : !1;
    },
    preview() {
      if (!n) return { snap: jt(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: n, b: p.pt, props: e.wallProps() }],
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
function Lp(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = us(o, n, e.tolMm());
    if (!r) return null;
    const l = et(o, o.walls.find((d) => d.id === r)), a = Nt(l, n).t;
    return { wallId: r, center: a, pt: O(l.a, S(l.dir, a)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const l = i(), a = hc(e.level(), r.wallId, t, r.center, l.width, l);
      a.openingId !== null && e.commit(a.level);
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
        opening: { wallId: o.wallId, offset: l, width: r, kind: t, invalid: !Pn(e.level(), o.wallId, l, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function zp(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = pc(n, t.pt, e.zoneName());
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
const Wn = 3, _o = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function xl(e) {
  let t = null;
  const n = (s, o, r) => {
    const l = s.devices.find((u) => u.id === o), a = l ? Y(s, l) : null, d = l ? _i(s, l, e.scale()) : null;
    return !a || !d ? 0 : Cr(yt(E(r, a.pt)) - yt(E(d.to, a.pt)));
  };
  function i(s) {
    if (!t || !t.moved && C(s.pt, t.downPt) <= Wn / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? Y(t.original, o) : null;
    if (!o || !r) return;
    const l = C(s.pt, r.pt), a = (yt(E(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = l === 0 ? s.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, u = Rc(t.original, o, d, s.shift);
    t.work = JSON.stringify(u) === JSON.stringify(o.placement) ? t.original : pn(t.original, o.id, u);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), l = r.devices.find((d) => d.id === s), a = l ? _i(r, l, e.scale()) : null;
      return !l || !a || C(o.pt, a.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && _o(o.work, o.id) !== _o(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function Ao(e, t, n) {
  const i = et(e, e.walls.find((s) => s.id === t));
  return Nt(i, n).side > 0 ? "left" : "right";
}
function kl(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function ps(e, t = "free") {
  return e === "equipment" ? [t] : qi[e];
}
function Ml(e, t, n, i, s = 0, o = ps(n)) {
  if (o.includes("wall")) {
    const r = jt(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: Ao(t, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const d of t.walls) {
        if (d.a !== l.nodeId && d.b !== l.nodeId) continue;
        const u = et(t, d), c = Math.max(0, Math.min(u.len, Nt(u, i).t)), p = Math.hypot(i.x - (u.a.x + u.dir.x * c), i.y - (u.a.y + u.dir.y * c));
        (!a || p < a.d) && (a = { id: d.id, offset: d.a === l.nodeId ? 0 : u.len, d: p });
      }
      if (a) return { mode: "wall", wallId: a.id, side: Ao(t, a.id, i), offset: a.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...kl(e, i), rotation: s } : null;
}
function Tp(e, t, n) {
  const i = Y(e, t);
  if (!i) return null;
  if (!n) {
    const o = Xi(Math.round(yt(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: o };
  }
  let s = null;
  for (const o of e.walls) {
    let r;
    try {
      r = et(e, o);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = Nt(r, i.pt), a = l.side > 0 ? "left" : "right", d = Math.min(r.len, Math.max(0, Math.round(l.t))), u = Cn(e, o.id, a, d), c = u ? C(u, i.pt) : 1 / 0;
    (!s || c < s.d) && (s = { placement: { mode: "wall", wallId: o.id, side: a, offset: d }, d: c });
  }
  return s && s.d < 1 / 0 ? s.placement : null;
}
function Dp(e, t, n) {
  return Er(e.deviceDefaults(t), "free", n.mode);
}
function Rp(e, t) {
  let n = null, i;
  const s = xl(e);
  function o() {
    if (!n) return null;
    const r = e.level(), l = ps(t, e.wallMount() ? "wall" : "free"), a = Ml(e, r, t, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...kl(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const d = Dp(e, t, a), u = Gs(r, d, a, "").deviceId !== null;
    return { placement: a, props: d, invalid: !u };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const l = o();
      if (!l || l.invalid) return;
      const a = e.level(), d = Mn(h(`device.${t}`), a.devices.filter((c) => c.props.kind === t).map((c) => c.name)), u = Gs(a, l.props, l.placement, d);
      u.deviceId !== null && (e.commit(u.level), i = u.deviceId, e.select({ kind: "device", id: u.deviceId }));
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
const So = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, Bp = (e, t, n) => n === void 0 || So(e, n) !== So(t, n);
function Hp(e, t, n, i) {
  const s = t.placement;
  if (s.mode === "free" && n) return E(n, i);
  if (s.mode !== "wall" || t.props.kind !== "equipment") return { x: 0, y: 0 };
  const o = Cn(e, s.wallId, s.side, s.offset);
  return o ? E(o, i) : { x: 0, y: 0 };
}
function Fp(e) {
  let t = null, n = null;
  const i = xl(e);
  let s = null, o = null, r = !1, l = { x: 0, y: 0 };
  const a = (p) => {
    t = p, e.select(p);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && C(p.pt, l) <= Wn / e.scale()) return;
    if (r = !0, p.pt.x === l.x && p.pt.y === l.y) {
      o = s;
      return;
    }
    const f = s.devices.find((_) => _.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = p.shift ? ds(l, p.pt) : p.pt, w = f.placement, b = w.mode === "free" ? null : Y(s, f), g = w.mode === "free" ? w.rotation : b ? Xi(Math.round(yt(b.dir))) : 0, $ = O(m, n.grab), x = Ml(e, s, f.props.kind, $, g, ps(f.props.kind, w.mode)), k = x && x.mode === "wall" && w.mode === "wall" && w.aim !== void 0 ? { ...x, aim: w.aim } : x;
    o = k ? pn(s, f.id, c(s, f.placement, k, m, $)) : s;
  }
  function c(p, f, m, w, b) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const g = p.walls.find((N) => N.id === f.wallId);
    if (!g) return m;
    const $ = et(p, g), x = Math.max(0, Math.min($.len, f.offset + H(E(w, l), $.dir))), k = Nt($, b).side, _ = e.tolMm(), P = f.side === "left" ? k < -($.rightOff + _) ? "right" : "left" : k > $.leftOff + _ ? "left" : "right";
    return { ...m, offset: x, side: P };
  }
  return {
    id: "device-select",
    down(p) {
      d(), l = p.pt;
      const f = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, p)) return;
      const w = zr(f, p.pt, m);
      if (!w) {
        a(null);
        return;
      }
      a({ kind: "device", id: w });
      const b = f.devices.find(($) => $.id === w), g = Y(f, b);
      s = o = f, n = { id: w, grab: Hp(f, b, (g == null ? void 0 : g.pt) ?? null, p.pt) };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const f = o, m = s, w = r, b = n == null ? void 0 : n.id;
      d(), w && f && m && f !== m && Bp(m, f, b) && e.commit(f);
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
function Up(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = zr(e.level(), t.pt, e.tolMm());
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
function Vp(e, t) {
  let n = null;
  for (const i of e.zones) {
    if (i.outline.length < 3 || !Ln(i.outline, t)) continue;
    const s = Math.abs(bt(i.outline));
    (!n || s < n.area || s === n.area && i.id < n.room.id) && (n = { room: i, area: s });
  }
  return n ? n.room : null;
}
function jp(e) {
  return {
    id: "zone-room",
    down(t) {
      const n = e.level(), i = Vp(n, t.pt);
      if (!i) return;
      const s = Yc(n, i.id, i.name);
      s.zoneId !== null && (s.level !== n && e.commit(s.level), e.select({ kind: "automationZone", id: s.zoneId }));
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
function _l(e, t, n, i) {
  if (n.alt) {
    const r = n.shift && i ? ds(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: r.x, y: r.y }, snap: null };
  }
  const s = jt(t, n.pt, { tolMm: e.tolMm(), grid: e.grid(), from: i, ortho: n.shift }), o = s.endpoint;
  if (s.kind === "node" && o.kind === "node")
    return { vertex: { kind: "node", nodeId: o.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if ((s.kind === "mid" || s.kind === "wall") && o.kind === "wall") {
    const r = t.walls.find((l) => l.id === o.wallId);
    if (r) {
      const l = Nt(et(t, r), n.pt).side >= 0 ? "left" : "right", a = Cn(t, r.id, l, o.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: r.id, offset: o.offset, side: l, x: a.x, y: a.y }, snap: { ...s, pt: a } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function Wp(e, t, n) {
  const i = [];
  for (const s of F(e)) {
    const o = Lt(e, s);
    (o.some((l, a) => Vt(t, l, o[(a + 1) % o.length]) <= n) || Ln(o, t)) && i.push({ id: s.id, area: Math.abs(bt(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function qp(e, t, n, i) {
  const s = F(e).find((l) => l.id === t);
  if (!s || s.shape.kind !== "polygon") return null;
  const o = Lt(e, s);
  let r = -1;
  return o.forEach((l, a) => {
    C(n, l) <= i && (r < 0 || C(n, l) < C(n, o[r])) && (r = a);
  }), r < 0 ? null : { index: r, from: o[(r + o.length - 1) % o.length] };
}
function Zp(e) {
  let t = null, n = null, i = null, s = null, o = null, r = !1, l = !1, a = { x: 0, y: 0 };
  const d = () => {
    const m = e.selection();
    return (m == null ? void 0 : m.kind) === "automationZone" ? m.id : null;
  }, u = (m) => {
    e.select(m === null ? null : { kind: "automationZone", id: m });
  }, c = () => {
    n = null, i = null, s = null, o = null, r = !1, l = !1;
  };
  function p(m) {
    if (!n || !i || !l && C(m.pt, a) <= Wn / e.scale()) return;
    l = !0;
    const w = _l(e, i, m, n.from);
    o = w.snap, r = m.shift, s = Jc(i, n.zoneId, n.index, w.vertex);
  }
  function f(m, w) {
    const b = Wp(m, w, e.tolMm());
    if (b.length === 0) {
      t = null, u(null);
      return;
    }
    const g = d(), $ = g !== null && t !== null && C(w, t) <= e.tolMm() ? b.indexOf(g) : -1;
    t = w, u(b[($ + 1) % b.length]);
  }
  return {
    id: "zones-select",
    down(m) {
      c(), a = m.pt;
      const w = e.level(), b = d(), g = b === null ? null : qp(w, b, m.pt, e.tolMm());
      if (b !== null && g) {
        n = { zoneId: b, ...g }, i = s = w;
        return;
      }
      f(w, m.pt);
    },
    move(m) {
      p(m);
    },
    up(m) {
      n && p(m);
      const w = s, b = i, g = l;
      c(), g && w && b && w !== b && e.commit(w);
    },
    key(m) {
      return m === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      if (!n || !s) return {};
      const m = { level: s };
      return o && (m.snap = o), r && (m.orthoFrom = n.from), m;
    },
    cancel() {
      c(), t = null;
    }
  };
}
const Eo = 3, Gp = 1, ct = (e) => ({ x: e.x, y: e.y });
function Kp(e) {
  let t = [], n = null, i = !1, s = null, o = !1;
  const r = () => t.length ? ct(t[t.length - 1]) : void 0;
  function l(c) {
    const p = t.length;
    if (p === 0) return !1;
    const f = t.map(ct);
    if (C(f[p - 1], c) <= Gp) return !0;
    if (p >= 2) {
      const m = E(f[p - 1], f[p - 2]), w = E(c, f[p - 1]);
      if (Math.abs(tt(m, w)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(w.x, w.y) && H(m, w) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (Dr(f[p - 1], c, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(c) {
    if (t.length < Eo) return null;
    const p = e.tolMm(), f = ct(t[0]), m = ct(t[t.length - 1]);
    return C(c, f) <= p ? f : C(c, m) <= p ? m : null;
  }
  function d() {
    if (t.length < Eo || hn(t.map(ct))) return !1;
    const c = e.level(), p = Mn(h("zones.default"), F(c).map((m) => m.name)), f = Xc(c, t, p);
    return f.zoneId === null ? !1 : (t = [], n = null, i = !1, e.commit(f.level), e.select({ kind: "automationZone", id: f.zoneId }), !0);
  }
  const u = (c) => _l(e, e.level(), c, r());
  return {
    id: "zone-draw",
    down(c) {
      if (a(c.pt)) {
        d();
        return;
      }
      const p = u(c).vertex;
      l(ct(p)) || (t = [...t, p], n = ct(p), i = !1);
    },
    move(c) {
      o = c.shift;
      const p = a(c.pt);
      if (p) {
        n = p, s = null, i = hn(t.map(ct));
        return;
      }
      const f = u(c);
      s = f.snap, n = ct(f.vertex), i = l(n);
    },
    up() {
    },
    key(c) {
      return c === "Enter" ? d() : c === "Backspace" || c === "Delete" ? t.length === 0 ? !1 : (t = t.slice(0, -1), i = !1, !0) : c === "Escape" ? t.length === 0 ? !1 : (t = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const c = {};
      t.length > 0 && (c.zoneDraft = { points: t.map(ct), cursor: n, invalid: i }), s && (c.snap = s);
      const p = r();
      return o && p && (c.orthoFrom = p), c;
    },
    cancel() {
      t = [], n = null, i = !1, s = null, o = !1;
    }
  };
}
const Oi = 40, Yp = (e, t) => e.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === t.block && i.port === t.port));
function Xp(e, t, n, i) {
  const s = e.blocks.find((f) => f.id === t);
  if ((s == null ? void 0 : s.kind) !== "bus") return e;
  const o = s.w >= s.h, r = o ? s.x : s.y, l = o ? s.w : s.h, a = Ne(o ? i.x : i.y), d = n === "start" ? Math.min(a, r + l - Oi) : r, u = n === "end" ? Math.max(a, r + Oi) : r + l;
  if (d === r && u === r + l) return e;
  const c = o ? { x: d, w: u - d } : { y: d, h: u - d }, p = (f) => "bus" in f && f.bus === t ? { bus: t, at: Math.min(1, Math.max(0, (r + f.at * l - d) / (u - d))) } : f;
  return {
    ...e,
    blocks: e.blocks.map((f) => f.id === t ? { ...f, ...c } : f),
    wires: e.wires.map((f) => {
      const m = p(f.from), w = p(f.to);
      return m === f.from && w === f.to ? f : { ...f, from: m, to: w };
    })
  };
}
function Qp(e) {
  let t = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    t = null, n = null, i = null, s = !1;
  };
  function l(u, c) {
    const p = ho(u, c, e.tolMm(), e.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function a(u) {
    const c = t, p = n;
    if (!c || !p || !s && C(u.pt, o) <= Wn / e.scale()) return;
    if (s = !0, c.kind === "wire") {
      const b = l(p, u.pt);
      t = { ...c, to: u.pt, ok: !!b && !("error" in co(p, c.from, b, e.geo())) };
      return;
    }
    if (c.kind === "bus-end") {
      i = Xp(p, c.id, c.end, u.pt);
      return;
    }
    const f = p.blocks.find((b) => b.id === (c.kind === "pin" ? c.from.block : c.id));
    if (!f) return;
    if (c.kind === "pin") {
      i = xd(p, f.id, c.from.port, Dd(ut(f, e.geo(), p), u.pt));
      return;
    }
    const m = Ne(f.x + u.pt.x - o.x), w = Ne(f.y + u.pt.y - o.y);
    i = m === f.x && w === f.y ? p : bd(p, f.id, m, w);
  }
  function d(u, c, p) {
    const f = l(u, p);
    if (!f) return;
    const m = co(u, c, f, e.geo());
    if ("error" in m) {
      e.notify(h(`power.err.${m.error}`));
      return;
    }
    e.commitPower(m.schema), e.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const c = e.power(), p = ho(c, u.pt, e.tolMm(), e.geo());
      if (!p) {
        e.select(null);
        return;
      }
      if (p.kind === "chip") {
        e.setPosition(p.block, p.position);
        return;
      }
      if (p.kind === "wire") {
        e.select({ kind: "powerWire", id: p.id });
        return;
      }
      if (n = i = c, p.kind === "port") {
        const f = { block: p.block, port: p.port };
        if (Yp(c, f)) {
          t = { kind: "pin", from: f };
          return;
        }
        const m = c.blocks.find((b) => b.id === p.block), w = Un(c, m, e.geo()).find((b) => b.name === p.port).pt;
        t = { kind: "wire", from: f, at: w, to: w, ok: !1 };
        return;
      }
      e.select({ kind: "powerBlock", id: p.id }), t = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      a(u);
    },
    up(u) {
      a(u);
      const c = t, p = n, f = i, m = s;
      if (r(), !(!c || !p)) {
        if (!m) {
          (c.kind === "wire" || c.kind === "pin") && e.select({ kind: "powerBlock", id: c.from.block });
          return;
        }
        c.kind === "wire" ? d(p, c.from, u.pt) : f && f !== p && e.commitPower(f);
      }
    },
    key(u) {
      return u === "Escape" && t ? (r(), !0) : !1;
    },
    preview() {
      const u = t;
      return u ? u.kind === "wire" ? { wireDraft: { from: u.at, to: u.to, ok: u.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function Jp(e, t) {
  const n = t.slice(6);
  return {
    id: t,
    down(i) {
      var d;
      let s;
      if (n === "device") {
        const u = e.placeDeviceId();
        if (!u) {
          e.notify(h("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = e.power(), r = yd(n, { x: 0, y: 0 }, o, s), l = ut(r, e.geo(), lo(o, r)), a = { ...r, x: Ne(i.pt.x - l.w / 2), y: Ne(i.pt.y - l.h / 2) };
      e.commitPower(lo(o, a)), n === "device" && ((d = e.devicePlaced) == null || d.call(e)), e.pickTool("power-select"), e.select({ kind: "powerBlock", id: a.id });
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
const tf = ["select", "box", "wall", "door", "window", "opening", "zone"], ef = [
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
], nf = ["binding-select"], sf = ["zones-select", "zone-room", "zone-draw"], of = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], rf = {
  plan: tf,
  equipment: ef,
  binding: nf,
  zones: sf,
  power: of
};
function fs(e) {
  return rf[e];
}
function Ci(e, t) {
  switch (e) {
    case "select":
      return Op(t);
    case "box":
      return Cp(t);
    case "wall":
      return Np(t);
    case "door":
    case "window":
    case "opening":
      return Lp(t, e);
    case "zone":
      return zp(t);
    case "device-select":
      return Fp(t);
    case "binding-select":
      return Up(t);
    case "zones-select":
      return Zp(t);
    case "zone-room":
      return jp(t);
    case "zone-draw":
      return Kp(t);
    case "power-select":
      return Qp(t);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Jp(t, e);
    default:
      return Rp(t, e);
  }
}
function ui(e, t, n) {
  return t.kind === "powerBlock" ? n.blocks.some((s) => s.id === t.id) : t.kind === "powerWire" ? n.wires.some((s) => s.id === t.id) : t.kind === "automationZone" ? F(e).some((s) => s.id === t.id) : (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((s) => s.id === t.id);
}
function lf(e) {
  switch (e.saveState) {
    case "saving":
      return h("save.saving");
    case "conflict":
      return h("save.conflict");
    case "error":
      return h("save.error");
    default:
      return e.dirty ? h("save.dirty") : h(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function af(e) {
  return y`
    <div class="top"><div class="bar">
      ${e.lead ?? v}
      ${e.plans.length > 1 ? y`
        <select class="plan-pick" aria-label=${h("plan.pick")} title=${h("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${W(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => y`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : v}
      <button class="btn" data-action="new-plan" title=${h("plan.new")} aria-label=${h("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${h("plan.delete")} aria-label=${h("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${h("action.undo")} aria-label=${h("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${h("action.redo")} aria-label=${h("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${lf(e)}${e.saveState === "error" && e.errorMessage ? y`: ${e.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${h("action.save")}</button>
    </div>${e.steps}</div>`;
}
const cf = ["zone", "ceiling_light", "power-device", "power-bus"];
function Al(e, t, n) {
  return fs(e).map((i) => y`
    ${cf.includes(i) ? y`<div class="tool-sep"></div>` : v}
    <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
      ${h(`tool.${i}`)}</button>`);
}
function df(e, t, n) {
  return y`<div class="tools">${Al(e, t, n)}</div>`;
}
const pe = ["plan", "equipment", "binding", "zones", "power"], Zt = (e, t, n) => h(e === 1 ? t : n).replace("{n}", String(e));
function uf(e, t, n, i) {
  const { walls: s, zones: o, devices: r } = t;
  switch (e) {
    case "plan":
      return {
        text: `${Zt(s.length, "steps.wall", "steps.walls")}, ${Zt(o.length, "steps.room", "steps.rooms")}`,
        done: s.length > 0 && o.length > 0
      };
    case "equipment":
      return { text: Zt(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const l = r.length - ji(r.map(n));
      return {
        text: h("steps.bound").replace("{b}", String(l)).replace("{n}", String(r.length)),
        done: r.length > 0 && l === r.length
      };
    }
    case "zones": {
      const l = F(t).length;
      return { text: Zt(l, "steps.zone", "steps.zones"), done: l > 0 };
    }
    case "power":
      return { text: Zt(i.blocks.length, "steps.block", "steps.blocks"), done: Id(i) };
  }
}
const Io = (e, t) => h(e).replace("{step}", h(`mode.${t}`));
function pf(e) {
  const t = pe.indexOf(e.mode), n = pe[t - 1], i = pe[t + 1];
  return y`
    <nav class="steps" aria-label=${h("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${W(e.planName)} aria-label=${h("plan.name")} title=${h("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${h("steps.app")}</span>
      </div>
      ${pe.map((s, o) => {
    const r = uf(s, e.level, e.status, e.power), l = s === e.mode;
    return y`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${l ? "step" : v} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${h(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${pe.length + 1}</span><span class="name">${h("mode.automation")}</span>
        <span class="state">${h("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? y`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${Io("steps.back", n)}</button>` : v}
        ${i ? y`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${Io("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
function ff(e) {
  return e.devices.filter((t) => t.placement.mode === "none").sort((t, n) => t.name.localeCompare(n.name) || t.id.localeCompare(n.id));
}
function Sl(e) {
  const t = e.devices.filter((n) => n.props.kind === "equipment").map((n) => n.name);
  return Mr(e, Mn(h("device.equipment"), t));
}
function hs(e) {
  if (Ue(e)) return h("props.inverter");
  const t = bc(e);
  return t ? h(`deviceRole.${t}`) : "";
}
function qn(e) {
  const t = h(`device.${e.props.kind}`), n = hs(e);
  return n ? `${t} · ${n}` : t;
}
function hf(e) {
  const t = ff(e.level);
  return y`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${h("devices.unplaced")}</h4>
      <button class="btn" data-action="new-device" @click=${() => e.onNew()}>${h("devices.new")}</button>
    </div>
    ${t.length === 0 ? v : y`<div class="pdevs">
      ${t.map((n) => y`<button class="pdev" data-id=${n.id} @click=${() => e.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${hs(n)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const mf = ["unbound", "bound", "all"], gf = /* @__PURE__ */ new WeakMap(), ke = (e) => e.placement.mode === "none";
function El(e) {
  return dt(gf, e, (t) => [...t.devices].sort((n, i) => Number(ke(n)) - Number(ke(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function wf(e, t, n) {
  const i = El(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Il = (e) => h(`device.${e.props.kind}`), Po = (e) => e.props.kind === "equipment" ? hs(e) : Il(e), yf = (e, t) => e === "all" || e === "bound" == (t === "bound");
function bf(e, t, n) {
  return t === 0 ? h("binding.noDevices") : n || e.filter === "all" ? h("binding.noMatch") : h(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function Oo(e) {
  const t = h(e.collapsed ? "binding.expand" : "binding.collapse");
  return y`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function vf(e) {
  var l;
  if (e.collapsed) return y`<div class="blist collapsed">${Oo(e)}</div>`;
  const t = El(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: ji(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: d }) => yf(e.filter, d) && (!i || a.name.toLowerCase().includes(i) || Il(a).toLowerCase().includes(i) || Po(a).toLowerCase().includes(i))), o = ((l = e.selection) == null ? void 0 : l.kind) === "device" ? e.selection.id : null, r = (a, d) => {
    const u = ba(a);
    return y`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
      <span class="dot ${d}" role="img" aria-label=${h(`bindstatus.${d}`)} title=${h(`bindstatus.${d}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Po(a)}</small></span>
      <span class="cnt">${u.filled}/${u.total}</span>
    </button>`;
  };
  return y`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${h("binding.show")}>
          ${mf.map((a) => y`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${h(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${Oo(e)}
      </div>
      <input class="list-search" type="search" placeholder=${h("binding.search")} aria-label=${h("binding.search")}
        .value=${W(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? y`<p class="empty">${bf(e, t.length, i)}</p>` : y`
          ${s.filter((a) => !ke(a.d)).map((a) => r(a.d, a.st))}
          ${s.some((a) => ke(a.d)) ? y`<div class="bgroup" data-group="unplaced">
            <h5>${h("devices.unplaced")}</h5>
            ${s.filter((a) => ke(a.d)).map((a) => r(a.d, a.st))}
          </div>` : v}`}
      </div>
    </div>`;
}
function I(e, t) {
  return y`<label class="row"><span>${e}</span>${t}</label>`;
}
function G(e, t, n, i) {
  return y`<select class="val" data-field=${i ?? v} .value=${W(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => y`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function zt(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return y`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? v}
    placeholder=${e.placeholder ?? v} title=${e.placeholder ?? v} .value=${W(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = Be(s.value, e.rule);
    if (o === null) {
      s.value = t, n(h(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(h("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function $f() {
  return {
    door: { width: tn.door, hinge: "start", swing: "left" },
    window: { width: tn.window, outside: "left" },
    opening: { width: tn.opening },
    zoneName: null,
    wallMount: !1
  };
}
function xf(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function Pl(e) {
  return Mn(h("zone.default"), e.zones.map((t) => t.name));
}
const kf = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function Mf(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? Pl(e.level);
    return y`
      <h4>${h("props.nextZone")}</h4>
      ${I(h("props.name"), y`<input class="val wide" type="text" data-field="next-zone-name" .value=${W(r)}
        @change=${(l) => {
      const a = l.target, d = a.value.trim();
      if (!d) {
        a.value = r;
        return;
      }
      d !== r && e.setNext({ ...t, zoneName: d });
    }} />`)}`;
  }
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return v;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return y`
    <h4>${h(`props.next.${n}`)}</h4>
    ${I(`${h("props.width")}, ${h("unit.mm")}`, zt({
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
    ${n === "door" ? y`
      ${I(h("props.hinge"), G(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${I(h("props.swing"), G(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? I(h("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class _f {
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
const Ni = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Me = (e) => typeof e == "string" && e ? e : null, Co = (e) => typeof e == "number" && Number.isFinite(e), Li = (e) => {
  var t;
  return e.props.kind === "equipment" && !!((t = e.bindings) != null && t.control);
};
function Ol(e) {
  return e.switchesMigrated || !e.devices.some(Li) ? e : { ...e, switchesMigrated: !0 };
}
function Af(e, t, n) {
  const i = Mr(e, n);
  let s = i.level;
  const o = Ni(t.switch) ? t.switch : {}, r = [["power", Me(t.power)], ["voltage", Me(t.voltage)], ["control", Me(o.entity)]];
  for (const [l, a] of r) a && (s = _n(s, i.id, l, a));
  return o.controllable === !0 && (s = On(s, i.id, !0)), { level: s, id: i.id };
}
function Sf(e) {
  let t = e.level, n = e.power;
  const i = e.power;
  if (Ni(i) && Array.isArray(i.blocks)) {
    let s = 0, o = !1;
    const r = i.blocks.map((l) => {
      if (!Ni(l)) return l;
      if (l.kind === "meter" && Me(l.id) && Co(l.x) && Co(l.y)) {
        s++;
        const a = Af(t, l, Me(l.name) ?? `Meter ${s}`);
        return t = a.level, o = !0, {
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
        return a === !0 && typeof l.deviceId == "string" && (t = Sr(t, l.deviceId, !0)), o = !0, d;
      }
      return l;
    });
    o && (n = { ...i, blocks: r });
  }
  if (!t.switchesMigrated && t.devices.some(Li)) {
    for (const s of e.level.devices) Li(s) && (t = On(t, s.id, !0));
    t = Ol(t);
  }
  return t === e.level && n === e.power ? e : { ...e, level: t, ...n ? { power: n } : {} };
}
class Ef {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await ri(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(Cs(h("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = gt(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await qd(this.h.hass, t);
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
        this.h.plans = await ri(this.h.hass);
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
      this.h.notice = gt(n);
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
    this.h.toolId = fs(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(Cs(h("plan.default"))), this.offerDraft(null);
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
            await Gd(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = gt(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await ri(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = gt(o);
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
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(Ca) };
    const n = Sf({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Ed(n.power, { device: (s) => n.level.devices.find((o) => o.id === s) });
    this.h.history = new _f({ level: n.level, ...i ? { power: i } : {} }), this.h.lazyPower = nl(), this.h.activeTool.cancel(), this.h.activeTool = Ci(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
  /** The open plan as it is saved or drafted; an equipment switch on the edited level marks it (markSwitchesMigrated). */
  currentPlan() {
    const t = this.h.plan, { level: n, power: i } = this.h.history.current, s = t.levels.map((l, a) => a === 0 ? Ol(n) : l), { power: o, ...r } = t;
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
    const t = `${this.h.plan.name} ${h("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class If {
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
    !n || !pd(n.states, t) ? this.base = { states: t, meta: ud(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? hd(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), fd(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = h("binding.registryError").replace("{error}", gt(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const Ke = Qo("", "");
function Pf(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current.level) ?? Ke;
    },
    commit: (t) => e.commit(t),
    power: () => e.power,
    commitPower: (t) => e.commitPower(t),
    scale: () => e.view.scale,
    tolMm: () => 10 / e.view.scale,
    grid: () => e.grid ? 100 : null,
    wallProps: () => ({ type: e.wallType, thickness: e.thickness, baseline: "center" }),
    boxMeasure: () => e.boxMeasure,
    // A field message belongs to the selected element; a session error (Binding) outlives the selection.
    select: (t) => {
      e.selection = t, e.fieldNotice = null, e.mode !== "binding" && (e.notice = null);
    },
    selection: () => e.selection,
    deviceDefaults: (t) => e.nextProps[t],
    wallMount: () => e.nextObj.wallMount,
    openingDefaults: (t) => xf(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? Pl(((t = e.history) == null ? void 0 : t.current.level) ?? Ke);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    },
    geo: () => {
      var n;
      const t = (((n = e.history) == null ? void 0 : n.current.level) ?? Ke).devices;
      return { device: (i) => t.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const t = e.placeDeviceId;
      return t === null ? null : cl(((n = e.history) == null ? void 0 : n.current.level) ?? Ke, e.power).some((i) => i.id === t) ? t : (e.placeDeviceId = null, null);
    },
    devicePlaced: () => {
      e.placeDeviceId = null;
    },
    setPosition: (t, n) => e.setPowerPosition(t, n),
    notify: (t) => {
      e.notice = t;
    },
    pickTool: (t) => e.pickTool(t)
  };
}
const Cl = Object.keys(qi), Of = (e) => Cl.includes(e);
function Cf() {
  return Object.fromEntries(Cl.map((e) => [e, It(e, "free")]));
}
const Nl = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Jt, max: Jt, signed: !0 }, bad: "props.badAim" }
}, _e = (e, t, n, i, s) => zt({ ...Nl[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), Nf = ["round", "linear", "spot"], Lf = ["rect", "circle"], vn = (e, t) => e.map((n) => ({ v: n, label: h(`${t}.${n}`) }));
function Ll(e, t, n, i) {
  const s = (r, l, a) => I(`${h(l)}, ${h("unit.mm")}`, _e(e, n + r, a, "mm", (d) => i({ [r]: d }))), o = (r, l, a) => I(`${h(l)}, ${h("unit.deg")}`, _e(e, n + r, a, "angle", (d) => i({ [r]: d })));
  switch (t.kind) {
    case "ceiling_light":
      return y`
        ${I(h("props.shape"), G(t.shape, vn([...Nf], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? y`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : t.shape === "round" ? s("diameter", "props.diameter", t.diameter) : v}
        ${I(`${h("props.poolRadius")}, ${h("unit.mm")}`, zt({
        ...Nl.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: h("props.poolHint"),
        setNotice: e.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return y`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return y`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return I(`${h("props.diameter")}, ${h("unit.mm")}`, y`<select class="val" data-field=${`${n}diameter`}
        .value=${W(String(t.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== t.diameter && !i({ diameter: a }) && (l.value = String(t.diameter));
      }}>
        ${ka.map((r) => y`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return y`
        ${I(h("props.shape"), G(t.shape, vn([...Lf], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? y`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${I(h("props.icon"), Tf(e, t.icon, `${n}icon`, i))}
        ${I(h("props.label"), y`<input class="val wide" type="text" data-field=${`${n}label`} .value=${W(t.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== t.label && i({ label: l });
      }} />`)}`;
    default:
      return y`<p class="muted">${h("props.noSettings")}</p>`;
  }
}
const zf = /^mdi:[a-z0-9-]+$/;
function Tf(e, t, n, i) {
  const s = (o, r) => {
    var l, a;
    if (!zf.test(o)) {
      r(t), (l = e.onNotice) == null || l.call(e, h("props.badIcon"));
      return;
    }
    (a = e.onNotice) == null || a.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? y`<ha-icon-picker data-field=${n} .value=${W(t)} @value-changed=${(o) => {
    var l;
    const r = o.target;
    s(String(((l = o.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : y`<input class="val wide" type="text" data-field=${n} .value=${W(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function ne(e, t, n, i) {
  return I(t, y`<input type="checkbox" data-field=${e} .checked=${W(n)} @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`);
}
function Df(e, t) {
  return t.props.kind !== "equipment" || t.placement.mode === "none" ? v : ne("wallMount", h("props.wallMount"), t.placement.mode === "wall", (n) => {
    var i;
    return ((i = e.onWallMount) == null ? void 0 : i.call(e, n)) ?? !1;
  });
}
function Rf(e, t) {
  var i;
  const n = t.props;
  return n.kind !== "equipment" ? v : y`
    ${ne("inverter", h("props.inverter"), !!n.inverter, (s) => {
    var o;
    return ((o = e.onInverter) == null ? void 0 : o.call(e, s)) ?? !1;
  })}
    ${(i = t.bindings) != null && i.control ? ne("controllable", h("props.controllable"), !!n.controllable, (s) => {
    var o;
    return ((o = e.onControllable) == null ? void 0 : o.call(e, s)) ?? !1;
  }) : y`<p class="muted" data-note="bind-switch">${h("props.bindSwitchHint")}</p>`}`;
}
function Bf(e, t) {
  const n = t.placement;
  if (n.mode === "none") return v;
  if (n.mode === "free")
    return I(
      `${h("props.rotation")}, ${h("unit.deg")}`,
      _e(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = Jo.has(t.props.kind);
  return y`
    ${I(h("props.side"), G(n.side, vn(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${I(`${h("props.offset")}, ${h("unit.mm")}`, _e(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? I(
    `${h("props.aim")}, ${h("unit.deg")}`,
    _e(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(Tr(n, s)))
  ) : v}`;
}
function ms(e, t) {
  return I(h("props.name"), y`<input class="val wide" type="text" data-field="name" .value=${W(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function Hf(e, t) {
  const n = t.props.kind;
  return ie(n) ? n === "smart_button" && t.placement.mode === "free" ? y`<p class="muted" data-note="type-free">${h("props.typeFreeHint")}</p>` : I(h("props.type"), G(
    n,
    vn(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : v;
}
function Ff(e, t) {
  const n = e.level ? jc(e.level, t) : [];
  return y`<fieldset data-field="zone-membership"><legend>${h("props.zoneList")}</legend>
    ${n.length === 0 ? y`<p class="muted">${h("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => y`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var l;
    const r = o.target;
    (l = e.onZone) != null && l.call(e, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function Uf(e, t) {
  const n = t.placement.mode !== "none";
  return y`
    <h4>${qn(t)}</h4>
    ${ms(t, (i) => e.onDevice({}, i))}
    ${Hf(e, t)}
    ${n ? Ll(e, t.props, "", (i) => e.onDevice(i)) : v}
    ${Df(e, t)}
    ${Bf(e, t)}
    ${Rf(e, t)}
    ${n ? Ff(e, t) : v}
    ${t.invalid ? y`<p class="warn">${h("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${h("action.delete")}</button>`;
}
function Vf(e) {
  return e.device ? Uf(e, e.device) : e.nextKind && e.nextProps ? y`
      <h4>${h("props.nextDevice")}: ${h(`device.${e.nextKind}`)}</h4>
      ${Ll(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}
      ${e.nextKind === "equipment" ? ne(
    "next-wallMount",
    h("props.wallMount"),
    !!e.nextWallMount,
    (t) => {
      var n;
      return (n = e.onNextWallMount) == null || n.call(e, t), !0;
    }
  ) : v}` : y`<p class="muted">${h("props.none")}</p>`;
}
function jf(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((a) => a.id === n.id) ?? null : null, s = Of(e.toolId) ? e.toolId : null, o = (a) => a === t ? (e.setNotice(h("props.noFit")), !1) : (e.setNotice(null), e.commit(a), !0), r = (a) => a.level === t ? !1 : (e.setNotice(null), e.commit(a.level, a.power), !0), l = (a, d) => {
    const u = Tp(t, a, d);
    return o(u ? pn(t, a.id, u) : t);
  };
  return y`<div class="props">
    ${Vf({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (a, d) => !!i && o(Ve(t, i.id, a, d)),
    onKind: (a) => !!i && o(vc(t, i.id, a)),
    onPlacement: (a) => !!i && o(pn(t, i.id, a)),
    onZone: (a, d) => !!i && o(Zr(t, i.id, a, d)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(ll(t, e.power, i.id, a)),
    onControllable: (a) => !!i && o(On(t, i.id, a)),
    nextWallMount: e.nextWallMount,
    onNextWallMount: (a) => e.setNextWallMount(a),
    onNext: (a) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...a, kind: s } });
    },
    onDelete: () => {
      i && r(rl(t, e.power, i.id));
    },
    onNotice: (a) => e.setNotice(a)
  })}
    ${e.notice ? y`<p class="warn">${e.notice}</p>` : v}
    ${i ? v : hf({
    level: t,
    onPick: (a) => e.pickDevice(a),
    onNew: () => {
      const a = Sl(t);
      e.commit(a.level), e.pickDevice(a.id);
    }
  })}
  </div>`;
}
function zl(e, t, n) {
  return zt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function No(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function Wf(e, t) {
  const n = et(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(cd(t.level, e.id, o));
  return y`
    <h4>${h("props.wall")}</h4>
    ${I(h("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: h(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${I(h("props.thickness"), zl(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${I(h("props.baseline"), G(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: h(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${I(h("props.length"), y`<span class="val ro">${Ft(n)} ${h("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(ts(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function qf(e, t) {
  const n = ["door", "window", "opening", ...dn.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(wc(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: h(`side.${r}`) })), o = dn.includes(e.kind);
  return y`
    <h4>${h(`kind.${e.kind}`)}</h4>
    ${I(h("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: h(`kind.${r}`) })), (r) => i(gc(e, r))))}
    ${I(h("props.width"), zl(t, e.width, (r) => No(t, mc(t.level, e.id, r))))}
    ${I(h("props.offset"), zt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => No(t, vr(t.level, e.id, r))
  }))}
    ${o ? y`
      ${I(h("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: h(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${I(h("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${e.kind === "window" ? I(h("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${I(h("props.passesLight"), y`<input type="checkbox" data-field="passesLight" .checked=${W(gr(e))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === mr(e.kind) ? void 0 : l });
  }} />`)}
    ${I(h("props.passesPir"), y`<input type="checkbox" data-field="passesPir" .checked=${W(yr(e))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === wr(e.kind) ? void 0 : l });
  }} />`)}
    ${e.invalid ? y`<p class="warn">${h("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit($r(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function Zf(e, t) {
  return y`
    <h4>${h("props.zone")}</h4>
    ${I(h("props.name"), y`<input class="val wide" type="text" .value=${W(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(fc(t.level, e.id, s));
  }} />`)}
    ${I(h("props.area"), y`<span class="val ro">${wl(pr(e.outline))}</span>`)}
    ${e.broken ? y`<p class="warn">${h("props.broken")}</p>` : v}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(hr(t.level, e.id))}>
      ${h("action.delete")}</button>`;
}
function Gf(e) {
  const t = ["bearing", "partition", "railing"];
  return y`
    <h4>${h("props.newWall")}</h4>
    ${I(h("props.type"), y`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => y`<option value=${n} ?selected=${n === e.wallType}>${h(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${I(`${h("props.thickness")}, ${h("unit.mm")}`, zt({
    value: e.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      e.setThickness(n);
    }
  }))}
    ${e.tool === "box" ? y`
      <div class="muted">${h("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => y`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${h(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
function Kf(e) {
  const { level: t, selection: n } = e;
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = Wf(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = qf(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = Zf(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = y`<h4>${h("props.node")}</h4>
      ${I("X", y`<span class="val ro">${Ft(s.x)}</span>`)}${I("Y", y`<span class="val ro">${Ft(s.y)}</span>`)}`);
  }
  return y`
    <div class="props">
      ${i === v && (e.tool === "wall" || e.tool === "box") ? Gf(e) : i === v && kf(e.tool) ? Mf({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === v ? y`<p class="muted">${h("props.none")}</p>` : i}
      ${e.notice ? y`<p class="warn">${e.notice}</p>` : v}
    </div>`;
}
function Yf(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const Lo = /* @__PURE__ */ new WeakMap();
function gs(e, t, n) {
  let i = Lo.get(e);
  i || Lo.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((l) => {
    var a;
    return n ? t.domains.includes(l.domain) : Yf(l, t) && !l.hidden && !l.disabled && (l.category === null || !!((a = t.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), s[o] = r, r;
}
function on(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = (e) => e ?? v;
var Xf = Object.defineProperty, je = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Xf(t, n, s), s;
};
const Qf = 100;
let Jf = 0;
const th = (e) => y`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${e}></path>`}</svg>`, ys = class ys extends Yt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Jf++}`, this.shown = null, this.onOutside = (t) => {
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
    if (n && n.deps.length === t.length && n.deps.every((l, a) => l === t[a])) return n.value;
    const i = t[t.length - 1], s = [];
    let o = !1;
    for (const l of this.allRows())
      if (!(i && !l.search.includes(i))) {
        if (s.length === Qf) {
          o = !0;
          break;
        }
        s.push(l);
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
    return y`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${Ye(this.label || void 0)} title=${Ye(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? y`<button class="x" type="button" title=${h("combo.clear")} aria-label=${h("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return y`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Ye(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => y`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Ye(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? y`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? y`<div class="hint">${h("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return y`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
ys.styles = jo`
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
let Ot = ys;
je([
  vt()
], Ot.prototype, "value");
je([
  vt()
], Ot.prototype, "label");
je([
  T()
], Ot.prototype, "isOpen");
je([
  T()
], Ot.prototype, "query");
je([
  T()
], Ot.prototype, "active");
var eh = Object.defineProperty, ws = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && eh(t, n, s), s;
};
const nh = {
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
}, zo = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, ih = { light: "light", switch: "switch", event: "event", fan: "fan" };
function To(e, t) {
  return e != null && e.deviceClass && zo[e.deviceClass] ? zo[e.deviceClass] : ih[(e == null ? void 0 : e.domain) ?? Qr(t)] ?? "generic";
}
const Do = (e) => th(nh[e]);
function sh(e) {
  switch (e) {
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
      return e;
  }
}
class Zn extends Ot {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = on(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? on(this.meta, t) : null;
    return y`${Do(t ? To(this.meta.entities.get(t), t) : "generic")}
      ${n ? y`<span><b>${n.name}</b>${n.context !== n.name ? y`<small>${n.context}</small>` : v}<small class="eid">${t}</small></span>` : y`<span class="ph">${h("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = tl(this.states, t.entityId) ?? "unavailable";
    return y`${Do(To(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${sh(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = on(this.meta, t).name;
    return n === t ? t : `${n} (${t})`;
  }
  rowTitle(t) {
    return t.name === t.id ? t.id : `${t.name} (${t.id})`;
  }
  searchLabel() {
    return h("combo.search");
  }
  emptyText() {
    return h("combo.empty");
  }
}
ws([
  vt({ attribute: !1 })
], Zn.prototype, "meta");
ws([
  vt({ attribute: !1 })
], Zn.prototype, "items");
ws([
  vt({ attribute: !1 })
], Zn.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Zn);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Tl = as(class extends cs {
  constructor(e) {
    if (super(e), e.type !== kt.PROPERTY && e.type !== kt.ATTRIBUTE && e.type !== kt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!bl(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === ot || t === v) return t;
    const n = e.element, i = e.name;
    if (e.type === kt.PROPERTY) {
      if (t === n[i]) return ot;
    } else if (e.type === kt.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return ot;
    } else if (e.type === kt.ATTRIBUTE && n.getAttribute(i) === t + "") return ot;
    return vl(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ae = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), Ae(s, t);
  return !0;
}, $n = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, Dl = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), lh(t);
  }
};
function oh(e) {
  this._$AN !== void 0 ? ($n(this), this._$AM = e, Dl(this)) : this._$AM = e;
}
function rh(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) Ae(i[o], !1), $n(i[o]);
  else i != null && (Ae(i, !1), $n(i));
  else Ae(this, e);
}
const lh = (e) => {
  e.type == kt.CHILD && (e._$AP ?? (e._$AP = rh), e._$AQ ?? (e._$AQ = oh));
};
class ah extends cs {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), Dl(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && (Ae(this, t), $n(this));
  }
  setValue(t) {
    if (bl(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const n = [...this._$Ct._$AH];
      n[this._$Ci] = t, this._$Ct._$AI(n, this, 0);
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
const ch = () => new dh();
class dh {
}
const pi = /* @__PURE__ */ new WeakMap(), uh = as(class extends ah {
  render(e) {
    return v;
  }
  update(e, [t]) {
    var i;
    const n = t !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = t, this.ht = (i = e.options) == null ? void 0 : i.host, this.rt(this.ct = e.element)), v;
  }
  rt(e) {
    if (this.G !== void 0) if (this.isConnected || (e = void 0), typeof this.G == "function") {
      const t = this.ht ?? globalThis;
      let n = pi.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), pi.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = pi.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), ph = () => [{ v: "0", label: h("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], fh = { min: 1, max: 10 };
function Rl(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const zi = (e, t, n) => Rl(e, Ve(e.level, t.id, n));
function fi(e, t, n, i) {
  return y`<div class="cflag">${I(t, y`<input type="checkbox" data-field=${e} .checked=${W(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const hi = "__other", fe = /* @__PURE__ */ new Set();
function hh(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = Os.includes(i), l = !r || fe.has(o), a = ch(), d = [...Os.map((c) => ({ v: c, label: c })), { v: hi, label: h("binding.eventOther") }];
  return y`<span class="evfield">${G(l ? hi : i, d, (c) => {
    if (c === hi) {
      fe.add(o), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    fe.delete(o), a.value && (a.value.hidden = !0), c !== i ? s(c) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${uh(a)} data-field=${`${n}-event-custom`} ?hidden=${Tl(!l)}
      .value=${W(r ? "" : i)} @change=${(c) => {
    var m;
    const p = c.target, f = p.value.trim();
    if (!f) {
      p.value = r ? "" : i, e.setFieldNotice(h("props.badEvent"));
      return;
    }
    if (p.value = f, e.setFieldNotice(null), f !== i) {
      s(f) && fe.delete(o);
      return;
    }
    if (fe.delete(o), r) {
      p.hidden = !0;
      const w = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      w && (w.value = i);
    }
  }} /></span>`;
}
function mh(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return y`${v}`;
  const s = i[n], o = (r) => zi(e, t, { [n]: { ...s, ...r } });
  return y`<div class="trigger" data-trigger=${n}>
    ${I(h("binding.slot"), G(
    String(s.slot),
    ph(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${I(h("binding.event"), hh(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function gh(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return y`
      ${fi(
      "autoByDoubleToggle",
      h("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => zi(e, t, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? y`<div class="cflag">${I(h("binding.window"), zt({
      value: i.windowSec,
      rule: fh,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => e.setFieldNotice(l),
      apply: (l) => zi(e, t, { windowSec: l })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return y`${v}`;
  const s = (l, a) => (d) => {
    var c, p;
    const u = Ve(e.level, t.id, { [l]: d });
    return Rl(e, d && !((c = t.bindings) != null && c[a]) ? _n(u, t.id, a, ((p = t.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = fi("autoEnabled", h("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : y`${fi("separateOff", h("binding.separateOff"), i.separateOff, o)}${i.separateOff ? v : r}`;
}
function wh(e) {
  return e.props.kind !== "smart_button" || !xa(e).length ? y`${v}` : y`<div class="cfields"><p class="warn" data-note="duplicate">${h("binding.duplicate")}</p></div>`;
}
function Ti(e, t) {
  return t === "control" && e.props.kind === "equipment" ? h("role.control.equipment") : t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? h("binding.onOff") : h(`role.${t}`);
}
const mi = (e) => String(e).padStart(2, "0");
function yh(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${mi(t.getHours())}:${mi(t.getMinutes())}:${mi(t.getSeconds())}`;
}
const bh = (e) => e.action === "set" ? `set ${e.value ?? ""}`.trim() : e.action;
function vh(e) {
  return e.status === "error" ? e.reason === "unavailable" ? h("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : h("output.errorNotConfigured") : e.last ? h("output.last").replace("{event}", bh(e.last)).replace("{time}", yh(e.last.at)) : h("output.none");
}
function $h(e, t) {
  if (!ie(t.props.kind)) return v;
  const n = e.feed.stateOf(t), i = n ? vh(n) : e.feed.error ?? (e.feed.ready ? h("output.notSaved") : null);
  return i === null ? v : y`<p class="note" data-field="output">${i}</p>`;
}
function xh(e, t, n, i) {
  const s = el(e.meta, i, e.states), o = $a(e.level, t, n);
  return y`
    ${s === "missing" ? y`<p class="warn" data-note="missing">${h("binding.missing")}</p>` : v}
    ${s === "unavailable" ? y`<p class="note" data-note="unavailable">${h("binding.unavailable")}</p>` : v}
    ${o.length ? y`<p class="note" data-note="also">${h("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : v}`;
}
function kh(e, t, n) {
  var l;
  const { role: i } = n, s = ((l = t.bindings) == null ? void 0 : l[i]) ?? null, o = !!e.showAll[i], r = Ti(t, i);
  return y`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${h("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${gs(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const d = _n(e.level, t.id, i, a.detail.value);
    d !== e.level && e.commit(d);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && Vi(i) ? mh(e, t, i) : v}
    ${s ? xh(e, t, i, s) : v}
  </div>`;
}
function Mh(e) {
  const t = e.device, n = ji(e.level.devices.map(e.status));
  return y`<div class="props bprops">
    ${e.notice ? y`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : v}
    ${e.fieldNotice ? y`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : v}
    ${e.registryError ? y`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${h(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${t ? y`
      <h4>${qn(t)}</h4>
      ${ms(t, (i) => e.commit(Ve(e.level, t.id, {}, i)))}
      ${$h(e, t)}
      ${Ct(t).map((i) => y`${kh(e, t, i)}${gh(e, t, i.role)}`)}
      ${wh(t)}` : y`<p class="muted">${h("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${h("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${h("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${h("binding.reload")}</button>
  </div>`;
}
const Di = (e) => h(`zones.kind.${e.shape.kind}`);
function Bl(e, t) {
  const n = Rr(e, t);
  return n ? h(`zones.invalid.${n}`) : null;
}
const _h = /* @__PURE__ */ new WeakMap();
function Ah(e) {
  return dt(_h, e, (t) => new Map(F(t).map((n) => [n.id, Ji(t, n.id).filter((i) => i.participates).length])));
}
function Sh(e) {
  var o;
  const t = Ah(e.level), n = e.query.trim().toLowerCase(), i = ((o = e.selection) == null ? void 0 : o.kind) === "automationZone" ? e.selection.id : null, s = F(e.level).map((r, l) => ({ z: r, hue: bn[l % bn.length] })).filter(({ z: r }) => !n || r.name.toLowerCase().includes(n) || Di(r).toLowerCase().includes(n));
  return y`
    <div class="zlist">
      <div class="ztools">${Al("zones", e.toolId, e.onTool)}</div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${h("zones.filter")}
        aria-label=${h("zones.filter")} .value=${W(e.query)}
        @input=${(r) => e.onQuery(r.target.value)} />
      <div class="rows">
        ${s.map(({ z: r, hue: l }) => {
    const a = r.invalid ? Bl(e.level, r) ?? "" : null;
    return y`<button class="zrow${r.id === i ? " sel" : ""}" data-id=${r.id} @click=${() => e.onPick(r.id)}>
            ${a === null ? y`<span class="zswatch" style=${`background:${l}`}></span>` : y`<span class="zswatch zinvalid" role="img" aria-label=${a} title=${a}></span>`}
            <span class="nm"><span class="name">${r.name}</span><small class="kind">${Di(r)}</small></span>
            <span class="zcount" title=${h("zones.members")}>${t.get(r.id) ?? 0}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function Eh(e, t) {
  const n = Ji(e.level, t.id);
  return y`<div class="zmembers">
    <div class="zhead"><span>${h("zones.members")}</span>${n.length ? y`<span>${h("zones.participates")}</span>` : v}</div>
    ${n.length === 0 ? y`<p class="muted">${h("zones.noMembers")}</p>` : n.map(({ device: i, participates: s }) => y`
      <label class="member" data-device=${i.id}>
        <span class="nm"><span class="name">${i.name}</span><small class="kind">${h(`device.${i.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${h("zones.participates")} .checked=${Tl(s)}
          @change=${(o) => {
    const r = Zr(e.level, i.id, t.id, o.target.checked);
    r !== e.level && e.commit(r);
  }} />
      </label>`)}
  </div>`;
}
function Ih(e, t) {
  var o;
  const n = t.shape, i = n.kind === "room" ? ((o = e.level.zones.find((r) => r.id === n.roomId)) == null ? void 0 : o.name) ?? "—" : null, s = Bl(e.level, t);
  return y`
    <h4>${h("zones.default")}</h4>
    ${I(h("props.name"), y`<input class="val wide" type="text" data-field="zone-name" .value=${W(t.name)}
      @change=${(r) => {
    const l = r.target, a = l.value.trim();
    if (!a || a === t.name) {
      l.value = t.name;
      return;
    }
    e.commit(Qc(e.level, t.id, a));
  }} />`)}
    ${I(h("props.kind"), y`<span class="val ro" data-field="zone-kind">${Di(t)}</span>`)}
    ${i === null ? v : I(h("zones.room"), y`<span class="val ro" data-field="zone-room">${i}</span>`)}
    ${s ? y`<p class="warn" data-note="zone-invalid">${s}</p>` : v}
    ${Eh(e, t)}
    <button class="btn danger" data-action="delete-zone" @click=${() => e.commit(qr(e.level, t.id))}>
      ${h("zones.delete")}</button>`;
}
function Ph(e) {
  const t = e.selection, n = F(e.level), i = (t == null ? void 0 : t.kind) === "automationZone" ? n.find((s) => s.id === t.id) ?? null : null;
  return y`<div class="props zprops">
    ${i ? Ih(e, i) : y`
      <p class="muted">${h("zones.hint")}</p>
      <p class="muted" data-note="zone-count">${Zt(n.length, "steps.zone", "steps.zones")}</p>`}
    ${e.notice ? y`<p class="warn">${e.notice}</p>` : v}
  </div>`;
}
const Oh = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Ch = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Nh = 6, Lh = ["A", "0", "B"], zh = ["power", "control"], Th = ["power", "power_in", "power_out", "voltage", "control"], He = (e) => ({ device: (t) => e.level.devices.find((n) => n.id === t) });
function he(e, t, n, i) {
  const { [n]: s, ...o } = t, r = i === null ? o : { ...o, [n]: i };
  e.commitPower({ ...e.power, blocks: e.power.blocks.map((l) => l.id === t.id ? r : l) });
}
function me(e, t, n, i, s, o) {
  return y`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${t}>${n}</span></div>
    <ps-entity-combo data-field=${t} .meta=${e.meta} .states=${e.states} .items=${gs(e.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (s ?? null) && o(l);
  }}></ps-entity-combo>
  </div>`;
}
function Dh(e, t) {
  const n = t.name ?? "";
  return I(h("props.name"), y`<input class="val wide" type="text" data-field="name"
    placeholder=${h(`power.kind.${t.kind}`)} .value=${W(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? e.commitPower(mn(e.power, t.id, { name: o }, He(e))) : s.value = n;
  }} />`);
}
function Rh(e, t) {
  const n = new Set(Ct(t).map((i) => i.role));
  return y`${zh.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = t.bindings) == null ? void 0 : o[i];
    return y`<div class="role">
      <div class="role-head"><span class="role-label">${h(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? y`<b>${on(e.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${h("power.boundHint")}</p>`;
}
function Xe(e, t, n) {
  return t === e.level ? !1 : (e.commit(t, n), !0);
}
function Bh(e, t) {
  var o;
  const n = Ct(t), i = Th.flatMap((r) => n.filter((l) => l.role === r)), s = t.props;
  return y`
    ${ms(t, (r) => Xe(e, Ve(e.level, t.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return y`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Ti(t, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${e.meta} .states=${e.states} .items=${gs(e.meta, r, !1)}
        .value=${((l = t.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Ti(t, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), Xe(e, _n(e.level, t.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${s.kind === "equipment" && ((o = t.bindings) != null && o.control) ? ne(
    "controllable",
    h("props.controllable"),
    !!s.controllable,
    (r) => Xe(e, On(e.level, t.id, r))
  ) : v}
    ${s.kind === "equipment" ? ne("inverter", h("props.inverter"), !!s.inverter, (r) => {
    const l = ll(e.level, e.power, t.id, r);
    return Xe(e, l.level, l.power);
  }) : v}`;
}
function Hh(e, t) {
  const n = e.level.devices.find((i) => i.id === t.deviceId);
  return n ? n.props.kind === "equipment" ? Bh(e, n) : y`
    ${I(h("props.name"), y`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${I(h("props.kind"), y`<span class="val ro">${h(`device.${n.props.kind}`)}</span>`)}${Rh(e, n)}` : y`<p class="warn" data-note="device-missing">${h("power.missing")}</p>`;
}
function Fh(e, t) {
  var s, o;
  const n = (o = (s = e.frame) == null ? void 0 : s.blocks[t.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: h(`power.form.${r}`) }));
  return y`
    ${I(h("power.form"), G(t.form, i, (r) => {
    r !== t.form && e.commitPower(mn(e.power, t.id, { form: r }, He(e)));
  }, "form"))}
    <div class="row"><span>${h("power.position")}</span><span class="seg pos">${Lh.map((r) => y`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => e.setPosition(t.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${h("power.positionHint")}</p>`;
}
function Uh(e, t) {
  const n = t.w >= t.h, i = n ? t.w : t.h, s = n ? t.h : t.w, o = (a, d) => {
    if (a === i && d === s) return !1;
    e.commitPower(mn(e.power, t.id, n ? { w: a, h: d } : { w: d, h: a }, He(e)));
  }, r = (a, d, u) => zt({ value: d, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: u }), l = ["h", "v"].map((a) => ({ v: a, label: h(`power.orientation.${a}`) }));
  return y`
    ${I(h("power.orientation"), G(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && e.commitPower(mn(e.power, t.id, { w: t.h, h: t.w }, He(e)));
  }, "bus-orientation"))}
    ${I(h("power.busLength"), r("bus-length", i, (a) => o(Math.max(Oi, s + 1, a), s)))}
    ${I(h("power.busThickness"), r("bus-thickness", s, (a) => o(i, Math.min(Math.max(Nh, a), i - 1))))}`;
}
function Vh(e, t) {
  switch (t.kind) {
    case "grid":
      return y`
      ${me(e, "power", h("power.field.power"), Ht, t.power, (n) => he(e, t, "power", n))}
      ${me(e, "voltage", h("power.field.voltage"), Oh, t.voltage, (n) => he(e, t, "voltage", n))}`;
    case "device":
      return Hh(e, t);
    case "battery":
      return y`
      ${me(e, "power", h("power.field.batteryPower"), Ht, t.power, (n) => he(e, t, "power", n))}
      ${me(e, "soc", h("power.field.soc"), Ch, t.soc, (n) => he(e, t, "soc", n))}`;
    case "pv":
      return me(e, "power", h("power.field.power"), Ht, t.power, (n) => he(e, t, "power", n));
    case "transfer":
      return Fh(e, t);
    case "bus":
      return Uh(e, t);
    default:
      return v;
  }
}
function jh(e, t) {
  const n = !!t.portPins && Object.keys(t.portPins).length > 0, i = t.kind === "device" ? e.level.devices.find((s) => s.id === t.deviceId) : void 0;
  return y`
    <h4>${i ? qn(i) : h(`power.title.${t.kind}`)}</h4>
    ${t.kind === "device" ? v : Dh(e, t)}
    ${Vh(e, t)}
    <div class="pactions">
      ${n ? y`<button class="btn" data-action="auto-ports"
        @click=${() => e.commitPower(kd(e.power, t.id))}>${h("power.autoPorts")}</button>` : v}
      ${t.kind === "grid" ? v : y`<button class="btn danger" data-action="delete-block"
        @click=${() => e.commitPower(sl(e.power, t.id))}>${h("action.delete")}</button>`}
    </div>`;
}
function Wh(e, t) {
  var s, o;
  const n = He(e), i = (r) => {
    const l = e.power.blocks.find((d) => d.id === ("block" in r ? r.block : r.bus)), a = l ? is(l, n) || h(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return y`
    <h4>${h("power.wire")}</h4>
    ${I(h("power.wire.from"), y`<span class="val ro wide" data-field="wire-from">${i(t.from)}</span>`)}
    ${I(h("power.wire.to"), y`<span class="val ro wide" data-field="wire-to">${i(t.to)}</span>`)}
    ${I(h("power.wire.power"), y`<span class="val ro" data-field="wire-power">${be((o = (s = e.frame) == null ? void 0 : s.wires[t.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => e.commitPower(al(e.power, t.id))}>${h("action.delete")}</button></div>`;
}
function qh(e) {
  const t = cl(e.level, e.power);
  return y`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Sl(e.level);
    e.commit(i.level), e.onPlaceDevice(i.id);
  }}>${h("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${h("power.help.device")}</p>
    ${t.length === 0 ? y`<p class="muted" data-note="no-devices">${h("power.noDevices")}</p>` : y`<div class="pdevs">
      ${t.map((i) => y`<button class="pdev${i.id === e.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === e.placeDeviceId ? "true" : "false"} @click=${() => e.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${qn(i)}</span>
      </button>`)}
    </div>`}`;
}
function Zh(e) {
  if (e.toolId === "power-device") return qh(e);
  const t = e.selection, n = (t == null ? void 0 : t.kind) === "powerBlock" ? e.power.blocks.find((s) => s.id === t.id) : void 0;
  if (n) return jh(e, n);
  const i = (t == null ? void 0 : t.kind) === "powerWire" ? e.power.wires.find((s) => s.id === t.id) : void 0;
  return i ? Wh(e, i) : e.toolId !== "power-select" ? y`<p class="muted" data-note="power-hint">${h("power.help.place")}</p>` : y`<p class="muted" data-note="power-hint">${h("power.pick")}</p><p class="muted">${h("power.help.select")}</p>`;
}
function Gh(e) {
  return y`<div class="props pprops">
    ${e.notice ? y`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : v}
    ${e.feedError ? y`<p class="note" data-notice="feed">${e.feedError}</p>` : v}
    ${Zh(e)}
  </div>`;
}
function Kh(e, t) {
  return e.mode === "zones" ? Sh({
    level: t,
    selection: e.selection,
    toolId: e.toolId,
    query: e.zoneQuery,
    onTool: (n) => e.pickTool(n),
    onQuery: (n) => {
      e.zoneQuery = n;
    },
    onPick: (n) => e.pickZone(n)
  }) : e.mode !== "binding" ? df(e.mode, e.toolId, (n) => e.pickTool(n)) : vf({
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
function Yh(e, t) {
  var i;
  const n = e.selection;
  return Mh({
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
    fieldNotice: e.fieldNotice,
    setFieldNotice: (s) => {
      e.fieldNotice = s;
    },
    registryError: e.haMeta.error,
    registryLoading: e.haMeta.loading,
    onRetry: () => e.haMeta.retry(),
    feed: e.feed
  });
}
function Xh(e, t) {
  var i;
  if (e.mode === "binding") return Yh(e, t);
  if (e.mode === "power")
    return Gh({
      power: e.power,
      level: t,
      selection: e.selection,
      meta: e.haMeta.get(),
      states: (i = e.hass) == null ? void 0 : i.states,
      frame: e.powerFeed.frame,
      notice: e.notice,
      feedError: e.powerFeed.error,
      toolId: e.toolId,
      placeDeviceId: e.placeDeviceId,
      onPlaceDevice: (s) => e.armDevice(s),
      commit: (s, o) => e.commit(s, o),
      commitPower: (s) => e.commitPower(s),
      setPosition: (s, o) => e.setPowerPosition(s, o)
    });
  if (e.mode === "zones") return Ph({ level: t, selection: e.selection, notice: e.notice, commit: (s) => e.commit(s) });
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (s) => e.commit(s),
    setNotice: (s) => {
      e.notice = s;
    }
  };
  return e.mode === "equipment" ? jf({
    ...n,
    power: e.power,
    commit: (s, o) => e.commit(s, o),
    toolId: e.toolId,
    nextProps: e.nextProps,
    setNextProps: (s) => {
      e.nextProps = s;
    },
    nextWallMount: e.nextObj.wallMount,
    setNextWallMount: (s) => {
      e.nextObj = { ...e.nextObj, wallMount: s };
    },
    pickDevice: (s) => e.pickDevice(s)
  }) : Kf({
    ...n,
    tool: e.toolId,
    boxMeasure: e.boxMeasure,
    wallType: e.wallType,
    thickness: e.thickness,
    next: e.nextObj,
    setNext: (s) => {
      e.nextObj = s;
    },
    setWallType: (s) => e.setWallType(s),
    setThickness: (s) => {
      e.thickness = s;
    },
    setBoxMeasure: (s) => {
      e.boxMeasure = s;
    }
  });
}
function Qh(e) {
  return y`
    <div class="status">
      ${e.binding ? v : y`
        <span><span class="kbd">Shift</span> ${h("hint.shift")}</span>
        <span><span class="kbd">${h("hint.digits")}</span> ${h("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${h("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${h(e.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${e.snap ? y`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${h(e.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${e.power ? v : y`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${h("status.cones")}
      </label>`}
    </div>`;
}
function Jh(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: h(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: h("unit.mm")
    },
    {
      label: h(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? h("unit.mm") : "°"
    }
  ];
  return A`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${s.map((l, a) => A`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function tm(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a, b: d } = s[0], u = Math.hypot(d.x - a.x, d.y - a.y);
    let c = Math.atan2(-(d.y - a.y), d.x - a.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: Ft(u), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, l = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Ft(r), second: Ft(l) };
}
function em(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const nm = jo`
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
  .ed.zones { grid-template-columns: 230px 280px 1fr; }
  .ed.power { grid-template-columns: 64px 300px 1fr; }
  @media (max-width: 700px) {
    .ed { grid-template-columns: 54px 170px 1fr; }
    .ed.binding, .ed.zones { grid-template-columns: 170px 200px 1fr; }
    .ed.power { grid-template-columns: 54px 200px 1fr; }
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

  /* Left rail: tools, the binding device list, or the Zones tools above the zone list. */
  .tools { background: var(--ch-card); border-right: 1px solid var(--ch-divider); display: flex;
    flex-direction: column; align-items: center; gap: 4px; padding-top: 8px; }
  .tool { width: 54px; height: 40px; border-radius: 8px; border: 0; background: transparent; font-size: 11px;
    color: var(--ch-muted); line-height: 1.1; padding: 0 2px; }
  .tool:hover { background: var(--ch-hover); color: var(--ch-text); }
  .tool.on { background: var(--ch-tint); color: var(--ch-primary); font-weight: 500; }
  .tool-sep { height: 1px; width: 36px; background: var(--ch-divider); margin: 4px 0; }
  .blist, .zlist { display: flex; flex-direction: column; min-width: 0; min-height: 0; background: var(--ch-card);
    border-right: 1px solid var(--ch-divider); }
  .ztools { display: flex; gap: 4px; padding: 8px 8px 0; }
  .ztools .tool { flex: 1; width: auto; }
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
  .brow .kind, .zrow .kind, .member .kind { display: block; color: var(--ch-muted); font-size: 12px; }
  .bgroup h5 { margin: 12px 12px 4px; color: var(--ch-muted); font-size: 12px; font-weight: 600; }
  .brow .cnt, .zrow .zcount { color: var(--ch-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
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
  /* Zones properties: the member list with its Participates column. */
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
  .kbd { border: 1px solid var(--ch-divider); border-radius: 3px; padding: 0 4px; color: var(--ch-text); }
  .grid-toggle { display: flex; align-items: center; gap: 4px; cursor: pointer; }
  .backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .45); display: flex; align-items: center;
    justify-content: center; z-index: 10; }
  .dialog { background: var(--ch-card); border: 1px solid var(--ch-divider); border-radius: var(--ch-radius); padding: 18px 20px;
    max-width: 420px; box-shadow: 0 8px 28px rgba(0, 0, 0, .35); }
  .dialog h3 { margin: 0 0 8px; font-weight: 500; }
  .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
`, im = 5e-3, sm = 2, xn = (e) => Math.max(im, Math.min(sm, e));
function om(e, t, n) {
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
function rm(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: xn(Math.min(t, n) / 12e3) };
  const i = e.map((c) => c.x), s = e.map((c) => c.y), o = 1500, r = Math.min(...i) - o, l = Math.max(...i) + o, a = Math.min(...s) - o, d = Math.max(...s) + o, u = xn(Math.min(t / (l - r), n / (d - a)));
  return { x: (r + l) / 2 - t / u / 2, y: (a + d) / 2 - n / u / 2, scale: u };
}
function lm(e, t, n, i, s) {
  const o = xn(Math.min(s, t / (e.w + 2 * i), n / (e.h + 2 * i)));
  return { x: e.x + e.w / 2 - t / o / 2, y: e.y + e.h / 2 - n / o / 2, scale: o };
}
function am(e, t, n) {
  const i = xn(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function cm(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function Ro(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function dm(e, t, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * e.scale >= 6 ? 100 * s : o, l = 1 / e.scale;
  return A`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const um = ["Shift", "Control", "Alt", "Meta"], pm = {
  plan: "select",
  equipment: "device-select",
  zones: "zones-select",
  power: "power-select"
};
function Bo(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class fm {
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
        this.h.view = cm(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
    }, this.wheel = (n) => {
      n.preventDefault(), this.h.view = am(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Bo(n) || !this.h.history) return;
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
      if (!o && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (o = this.h.deleteSelection()), !o && n.key === "Escape") {
        const r = pm[this.h.mode];
        r && this.h.toolId !== r ? this.h.pickTool(r) : (this.h.activeTool.cancel(), this.h.selection = null), o = !0;
      }
      o && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Bo(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !um.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function Hl(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function hm(e) {
  return y`
    <div class="draft-banner" role="status">
      <span>${h("draft.banner").replace("{time}", Hl(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${h("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${h("draft.discard")}</button>
    </div>`;
}
function ge(e, t, n, i) {
  return y`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? y`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${n.map((s) => y`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function mm(e) {
  var n;
  const t = { action: "cancel", label: h("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? ge(h("draft.title"), h("draft.text").replace("{time}", Hl(i.savedAt)), [
        { action: "restore", label: h("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: h("draft.discard"), onClick: () => e.discard(i) }
      ]) : v;
    }
    case "new":
      return ge(h("new.title"), h("new.text"), [
        { action: "new-discard", label: h("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return ge(h("delete.title"), h("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: h("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return ge(h("switch.title"), h("switch.text"), [
        { action: "switch-discard", label: h("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return ge(h("conflict.title"), h(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: h("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: h("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return v;
  }
}
const we = "plan_studio.draft.", Qe = "plan_studio.lastPlanId";
function gm() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function wm(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class ym {
  constructor(t = gm, n = 500) {
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
      (n = this.storage()) == null || n.setItem(we + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(we + t), s = i ? JSON.parse(i) : null;
      return wm(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(we))) continue;
        const o = this.read(s.slice(we.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(Qe)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Qe, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Qe)) === t && n.removeItem(Qe);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(we + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Fl = 5e3, Ul = 12, bm = 3e3;
function Ho(e) {
  e().catch(() => {
  });
}
class vm {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.flashes = /* @__PURE__ */ new Map(), this.onDisconnected = () => {
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
  get(t) {
    return this.map.get(t);
  }
  /** The intent the container's badge shows now (for FLASH_MS after it arrived), else null. */
  flash(t) {
    var n;
    return ((n = this.flashes.get(t)) == null ? void 0 : n.intent) ?? null;
  }
  /** The device's live state; undefined when the saved plan has no such container or has it as another kind. */
  stateOf(t) {
    const n = this.map.get(t.id);
    return (n == null ? void 0 : n.kind) === t.props.kind ? n : void 0;
  }
  watch(t) {
    t !== this.planId && (this.stop(), this.planId = t, t !== null && this.start());
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
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(h("output.noLive"));
      return;
    }
    this.conn = t, (n = t.addEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t.addEventListener) == null || i.call(t, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const t = this.conn;
    this.conn = null, (n = t == null ? void 0 : t.removeEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t == null ? void 0 : t.removeEventListener) == null || i.call(t, "ready", this.onReady);
  }
  /** Ends the current subscription: its messages are ignored from now on; `unsubscribe` also tells the server. */
  drop(t) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, t && n.unsub && Ho(n.unsub));
  }
  subscribe() {
    const t = this.conn, n = this.planId;
    if (!(t != null && t.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, t.subscribeMessage(
      (s) => {
        i.live && this.apply(s);
      },
      { type: "plan_studio/containers/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!i.live) {
          Ho(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(gt(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ul || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Fl));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(t) {
    var i, s;
    const n = Object.entries(t.containers ?? {});
    if (t.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [o, r] of n) {
        const l = (s = (i = this.map.get(o)) == null ? void 0 : i.last) == null ? void 0 : s.at;
        this.map.set(o, r), r.last && r.last.at !== l && this.startFlash(o, r.last);
      }
    this.host.requestUpdate();
  }
  /** Shows `last` on the container's badge for FLASH_MS, replacing (and restarting) any intent shown there. */
  startFlash(t, n) {
    const i = this.flashes.get(t);
    i && clearTimeout(i.timer);
    const s = setTimeout(() => {
      this.flashes.delete(t), this.host.requestUpdate();
    }, bm), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
    this.flashes.set(t, { intent: o, timer: s });
  }
  clearFlashes() {
    for (const t of this.flashes.values()) clearTimeout(t.timer);
    this.flashes.clear();
  }
  setFailure(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
const $m = ["power", "voltage", "power_in", "power_out", "control"], xm = 300;
function Fo(e) {
  e().catch(() => {
  });
}
function km(e, t) {
  var s;
  const n = new Map(t.devices.map((o) => [o.id, o])), i = {};
  for (const o of e.blocks) {
    const r = o.kind === "device" ? n.get(o.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Ue(r), controllable: _r(r) };
    for (const a of $m) {
      const d = (s = r.bindings) == null ? void 0 : s[a];
      d && (l[a] = d);
    }
    i[r.id] = l;
  }
  return { power: e, devices: i };
}
class Mm {
  constructor(t, n) {
    this.host = t, this.connection = n, this.planId = null, this.payload = null, this.json = "", this.sub = null, this.current = null, this.failure = null, this.conn = null, this.offline = !1, this.retryTimer = null, this.retries = 0, this.debounceTimer = null, this.onDisconnected = () => {
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
  watch(t, n) {
    if (t === null || n === null) {
      this.stop();
      return;
    }
    const i = JSON.stringify(n);
    if (t === this.planId) {
      if (i === this.json) return;
      this.payload = n, this.json = i, this.cancelDebounce(), this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null, this.restart();
      }, xm);
      return;
    }
    this.stop(), this.planId = t, this.payload = n, this.json = i, this.start();
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
  async setPosition(t, n) {
    const i = this.connection();
    !i || this.planId === null || await i.sendMessagePromise({ type: "plan_studio/power/set_position", plan_id: this.planId, block_id: t, position: n });
  }
  start() {
    var n, i;
    const t = this.connection();
    if (!(t != null && t.subscribeMessage)) {
      this.setFailure(h("output.noLive"));
      return;
    }
    this.conn = t, (n = t.addEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t.addEventListener) == null || i.call(t, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const t = this.conn;
    this.conn = null, (n = t == null ? void 0 : t.removeEventListener) == null || n.call(t, "disconnected", this.onDisconnected), (i = t == null ? void 0 : t.removeEventListener) == null || i.call(t, "ready", this.onReady);
  }
  /** Replaces the subscription with one for the latest payload, with a fresh run of retries; the frame stays. */
  restart() {
    this.cancelRetry(), this.cancelDebounce(), this.retries = 0, this.drop(!0), this.subscribe();
  }
  /** Ends the current subscription: its frames are ignored from now on; `unsubscribe` also tells the server. */
  drop(t) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, t && n.unsub && Fo(n.unsub));
  }
  subscribe() {
    const { conn: t, planId: n, payload: i } = this;
    if (!(t != null && t.subscribeMessage) || n === null || i === null || this.offline) return;
    const s = { live: !0, unsub: null };
    this.sub = s, t.subscribeMessage(
      (o) => {
        s.live && (this.current = o, this.host.requestUpdate());
      },
      { type: "plan_studio/power/subscribe", plan_id: n, power: i.power, devices: i.devices },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!s.live) {
          Fo(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(gt(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Ul || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Fl));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  cancelDebounce() {
    this.debounceTimer !== null && clearTimeout(this.debounceTimer), this.debounceTimer = null;
  }
  setFailure(t) {
    this.failure = t, this.host.requestUpdate();
  }
}
var _m = Object.defineProperty, D = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && _m(t, n, s), s;
};
const bs = class bs extends Yt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Ma.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Cf(), this.nextObj = $f(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = nl(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new ym(), this.resizeObs = null, this.session = new Ef(this), this.haMeta = new If(this), this.feed = new vm(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new Mm(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => ya(i, (s) => {
      var o;
      return el(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new Yd(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Pf(this), this.activeTool = Ci("select", this.ctx), this.input = new fm(this);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((t = this.plan) == null ? void 0 : t.id) ?? null), this.watchPower();
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (t = this.resizeObs) == null || t.disconnect(), this.resizeObs = null, this.feed.stop(), this.powerFeed.stop();
  }
  willUpdate(t) {
    var i;
    t.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = this.size.w > 0 && this.size.h > 0;
    this.needFit && n && (this.needFit = !1, this.fit()), this.needPowerFit && n && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((i = this.plan) == null ? void 0 : i.id) ?? null : null), this.watchPower();
  }
  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  watchPower() {
    const t = this.isConnected && this.mode === "power" ? this.level : null;
    this.powerFeed.watch(t && this.plan ? this.plan.id : null, t ? km(this.power, t) : null);
  }
  updated() {
    const t = this.renderRoot.querySelector(".canvas");
    t && !this.resizeObs && typeof ResizeObserver < "u" && (this.resizeObs = new ResizeObserver((n) => {
      const i = n[0].contentRect;
      (i.width !== this.size.w || i.height !== this.size.h) && (this.size = { w: i.width, h: i.height });
    }), this.resizeObs.observe(t));
  }
  // ---- editing ----
  get level() {
    var t;
    return ((t = this.history) == null ? void 0 : t.current.level) ?? null;
  }
  get power() {
    var t;
    return ((t = this.history) == null ? void 0 : t.current.power) ?? this.lazyPower;
  }
  /**
   * Pushes a level edit; `power` joins the same undo step when the edit changed the schematic too. Without `power`, a
   * stored schematic loses the wires on ports its device blocks no longer have (a wall delete took an inverter); the
   * lazy default is never written.
   */
  commit(t, n) {
    if (!this.history) return;
    const i = this.history.current.power, s = n ?? (i && vd(i, t));
    this.history.push({ ...this.history.current, level: t, ...s && s !== this.power ? { power: s } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
  }
  commitPower(t) {
    this.history && (this.history.push({ ...this.history.current, power: t }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  dropStaleSelection() {
    this.history && this.selection && !ui(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Zones step deletes an automation zone only, and no other step deletes one; the Power step
   * deletes power blocks and wires only.
   */
  deleteSelection() {
    const t = this.selection, n = this.level;
    if (this.mode === "binding" || !t || !n || t.kind === "node" || !ui(n, t, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(t);
    if (t.kind === "powerBlock" || t.kind === "powerWire" || this.mode === "zones" != (t.kind === "automationZone")) return !1;
    if (t.kind === "device") {
      const i = rl(n, this.power, t.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(t.kind === "wall" ? ts(n, t.id) : t.kind === "opening" ? $r(n, t.id) : t.kind === "automationZone" ? qr(n, t.id) : hr(n, t.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(t) {
    const n = this.power;
    if (t.kind === "powerWire")
      return this.commitPower(al(n, t.id)), !0;
    if (t.kind !== "powerBlock") return !1;
    const i = sl(n, t.id);
    return i === n ? this.notice = h("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(t, n) {
    this.powerFeed.setPosition(t, n).catch((i) => {
      this.notice = gt(i);
    });
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
  /**
   * Undo / redo drop the selection, except in the Binding step, which keeps the selected device while it exists;
   * the field notice goes with a dropped selection.
   */
  step(t) {
    this.activeTool.cancel(), t() && this.save.markDirty();
    const n = this.selection, i = this.level;
    this.selection = this.mode === "binding" && n && i && ui(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = Ci(t, this.ctx);
  }
  /**
   * Power step device list: arms a device for the Device tool (activated when another tool is on), so the
   * next canvas click places it; the "pick a device first" notice goes. The arm stays across tool switches; a
   * placement, leaving the step or opening another plan clears it.
   */
  armDevice(t) {
    this.toolId !== "power-device" && this.pickTool("power-device"), this.placeDeviceId = t, this.notice = null;
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode === "power" && (this.placeDeviceId = null), this.mode = t, this.pickTool(fs(t)[0]), (t === "binding" || t === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = Y(n, i);
    s && (this.view = Ro(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects an automation zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(t) {
    const n = this.level, i = n ? F(n).find((s) => s.id === t) : void 0;
    !n || !i || (this.ctx.select({ kind: "automationZone", id: t }), this.view = Ro(this.view, Hr(Lt(n, i)), this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const t = this.level, n = t ? wf(t, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
    n && this.pickDevice(n);
  }
  // ---- view / pointer ----
  /** The canvas view of the active step: the Power step has its own, so the plan view is kept meanwhile. */
  get view() {
    return this.mode === "power" ? this.powerView : this.planView;
  }
  set view(t) {
    this.mode === "power" ? this.powerView = t : this.planView = t;
  }
  svgEl() {
    return this.renderRoot.querySelector("svg.plan");
  }
  toMm(t) {
    return om(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.planView = rm(((t = this.level) == null ? void 0 : t.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const t = Wd(this.power, this.ctx.geo());
    t && (this.powerView = lm(t, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var t;
    return mm({
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
    var c, p, f;
    if (!this.plan || !this.history)
      return y`<div class="center">${this.loadError ? y`<span>${h("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${h("action.retry")}</button>` : h("load.loading")}</div>`;
    const t = xp(!!((p = (c = this.hass) == null ? void 0 : c.themes) != null && p.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, d = this.save, u = this.mode === "power";
    return y`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : this.mode === "zones" || u ? ` ${this.mode}` : ""}"
        style=${em(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${af({
      steps: pf({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        planName: this.plan.name,
        onRename: (m) => {
          this.plan = { ...this.plan, name: m }, d.markDirty();
        },
        onMode: (m) => this.setMode(m)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: d.state,
      dirty: d.dirty,
      errorMessage: d.errorMessage,
      lead: this.narrow ? y`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onPickPlan: (m) => this.session.pickPlan(m),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Kh(this, n)}
        ${Xh(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(m) => m.preventDefault()}>
            ${this.grid ? dm(this.view, l, a, t, u ? 0.1 : 1) : v}
            ${this.mode === "power" ? bp(this.power, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Xu(n, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (m) => this.feed.stateOf(m),
      containerFlash: (m) => this.feed.flash(m.id)
    })}
            ${i.tracker ? Jh(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: tm(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((f = this.dialog) == null ? void 0 : f.kind) !== "restore" ? hm({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${Qh({
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
      binding: this.mode === "binding" || u,
      power: u
    })}
        ${this.renderDialog()}
      </div>`;
  }
};
bs.styles = nm;
let z = bs;
D([
  vt({ attribute: !1 })
], z.prototype, "hass");
D([
  vt({ type: Boolean })
], z.prototype, "narrow");
D([
  vt({ attribute: !1 })
], z.prototype, "panel");
D([
  T()
], z.prototype, "plan");
D([
  T()
], z.prototype, "loadError");
D([
  T()
], z.prototype, "selection");
D([
  T()
], z.prototype, "toolId");
D([
  T()
], z.prototype, "wallType");
D([
  T()
], z.prototype, "thickness");
D([
  T()
], z.prototype, "boxMeasure");
D([
  T()
], z.prototype, "grid");
D([
  T()
], z.prototype, "mode");
D([
  T()
], z.prototype, "bindFilter");
D([
  T()
], z.prototype, "bindQuery");
D([
  T()
], z.prototype, "railCollapsed");
D([
  T()
], z.prototype, "showAll");
D([
  T()
], z.prototype, "zoneQuery");
D([
  T()
], z.prototype, "cones");
D([
  T()
], z.prototype, "nextProps");
D([
  T()
], z.prototype, "nextObj");
D([
  T()
], z.prototype, "planView");
D([
  T()
], z.prototype, "powerView");
D([
  T()
], z.prototype, "placeDeviceId");
D([
  T()
], z.prototype, "size");
D([
  T()
], z.prototype, "dialog");
D([
  T()
], z.prototype, "notice");
D([
  T()
], z.prototype, "fieldNotice");
D([
  T()
], z.prototype, "pendingDraft");
D([
  T()
], z.prototype, "plans");
D([
  T()
], z.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", z);
export {
  z as PlanStudioPanel
};
