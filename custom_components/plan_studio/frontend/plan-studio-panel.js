/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ui = globalThis, Hs = ui.ShadowRoot && (ui.ShadyCSS === void 0 || ui.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zs = Symbol(), Zr = /* @__PURE__ */ new WeakMap();
let ac = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== zs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Hs && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Zr.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Zr.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const oh = (t) => new ac(typeof t == "string" ? t : t + "", void 0, zs), cc = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, o, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new ac(n, t, zs);
}, sh = (t, e) => {
  if (Hs) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), o = ui.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = n.cssText, t.appendChild(i);
  }
}, Gr = Hs ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return oh(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: rh, defineProperty: lh, getOwnPropertyDescriptor: ah, getOwnPropertyNames: ch, getOwnPropertySymbols: uh, getPrototypeOf: dh } = Object, nt = globalThis, Kr = nt.trustedTypes, hh = Kr ? Kr.emptyScript : "", Ao = nt.reactiveElementPolyfillSupport, un = (t, e) => t, yi = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? hh : null;
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
} }, Rs = (t, e) => !rh(t, e), Xr = { attribute: !0, type: String, converter: yi, reflect: !1, useDefault: !1, hasChanged: Rs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), nt.litPropertyMetadata ?? (nt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let It = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = Xr) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(e, i, n);
      o !== void 0 && lh(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: o, set: s } = ah(this.prototype, e) ?? { get() {
      return this[n];
    }, set(r) {
      this[n] = r;
    } };
    return { get: o, set(r) {
      const l = o == null ? void 0 : o.call(this);
      s == null || s.call(this, r), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Xr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(un("elementProperties"))) return;
    const e = dh(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(un("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(un("properties"))) {
      const n = this.properties, i = [...ch(n), ...uh(n)];
      for (const o of i) this.createProperty(o, n[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const n = litPropertyMetadata.get(e);
      if (n !== void 0) for (const [i, o] of n) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, i] of this.elementProperties) {
      const o = this._$Eu(n, i);
      o !== void 0 && this._$Eh.set(o, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const n = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const o of i) n.unshift(Gr(o));
    } else e !== void 0 && n.push(Gr(e));
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
    return sh(e, this.constructor.elementStyles), e;
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
    var s;
    const i = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : yi).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var s, r;
    const i = this.constructor, o = i._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const l = i.getPropertyOptions(o), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : yi;
      this._$Em = o;
      const u = a.fromAttribute(n, l.type);
      this[o] = u ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, o = !1, s) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (o === !1 && (s = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? Rs)(s, n) || i.useDefault && i.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, n, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, n, { useDefault: i, reflect: o, wrapped: s }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? n ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (n = void 0), this._$AL.set(e, n)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [s, r] of o) {
        const { wrapped: l } = r, a = this[s];
        l !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, r, a);
      }
    }
    let e = !1;
    const n = this._$AL;
    try {
      e = this.shouldUpdate(n), e ? (this.willUpdate(n), (i = this._$EO) == null || i.forEach((o) => {
        var s;
        return (s = o.hostUpdate) == null ? void 0 : s.call(o);
      }), this.update(n)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(n);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var n;
    (n = this._$EO) == null || n.forEach((i) => {
      var o;
      return (o = i.hostUpdated) == null ? void 0 : o.call(i);
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
It.elementStyles = [], It.shadowRootOptions = { mode: "open" }, It[un("elementProperties")] = /* @__PURE__ */ new Map(), It[un("finalized")] = /* @__PURE__ */ new Map(), Ao == null || Ao({ ReactiveElement: It }), (nt.reactiveElementVersions ?? (nt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dn = globalThis, Yr = (t) => t, ki = dn.trustedTypes, Qr = ki ? ki.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, uc = "$lit$", Ye = `lit$${Math.random().toFixed(9).slice(2)}$`, dc = "?" + Ye, ph = `<${dc}>`, vt = document, Mn = () => vt.createComment(""), _n = (t) => t === null || typeof t != "object" && typeof t != "function", Bs = Array.isArray, fh = (t) => Bs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", So = `[ 	
\f\r]`, Yt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Jr = /-->/g, el = />/g, ut = RegExp(`>|${So}(?:([^\\s"'>=/]+)(${So}*=${So}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), tl = /'/g, nl = /"/g, hc = /^(?:script|style|textarea|title)$/i, pc = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), g = pc(1), _ = pc(2), we = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), il = /* @__PURE__ */ new WeakMap(), pt = vt.createTreeWalker(vt, 129);
function fc(t, e) {
  if (!Bs(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qr !== void 0 ? Qr.createHTML(e) : e;
}
const mh = (t, e) => {
  const n = t.length - 1, i = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Yt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let u, p, h = -1, d = 0;
    for (; d < a.length && (r.lastIndex = d, p = r.exec(a), p !== null); ) d = r.lastIndex, r === Yt ? p[1] === "!--" ? r = Jr : p[1] !== void 0 ? r = el : p[2] !== void 0 ? (hc.test(p[2]) && (o = RegExp("</" + p[2], "g")), r = ut) : p[3] !== void 0 && (r = ut) : r === ut ? p[0] === ">" ? (r = o ?? Yt, h = -1) : p[1] === void 0 ? h = -2 : (h = r.lastIndex - p[2].length, u = p[1], r = p[3] === void 0 ? ut : p[3] === '"' ? nl : tl) : r === nl || r === tl ? r = ut : r === Jr || r === el ? r = Yt : (r = ut, o = void 0);
    const f = r === ut && t[l + 1].startsWith("/>") ? " " : "";
    s += r === Yt ? a + ph : h >= 0 ? (i.push(u), a.slice(0, h) + uc + a.slice(h) + Ye + f) : a + Ye + (h === -2 ? l : f);
  }
  return [fc(t, s + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class An {
  constructor({ strings: e, _$litType$: n }, i) {
    let o;
    this.parts = [];
    let s = 0, r = 0;
    const l = e.length - 1, a = this.parts, [u, p] = mh(e, n);
    if (this.el = An.createElement(u, i), pt.currentNode = this.el.content, n === 2 || n === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = pt.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(uc)) {
          const d = p[r++], f = o.getAttribute(h).split(Ye), m = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: s, name: m[2], strings: f, ctor: m[1] === "." ? bh : m[1] === "?" ? vh : m[1] === "@" ? wh : Ji }), o.removeAttribute(h);
        } else h.startsWith(Ye) && (a.push({ type: 6, index: s }), o.removeAttribute(h));
        if (hc.test(o.tagName)) {
          const h = o.textContent.split(Ye), d = h.length - 1;
          if (d > 0) {
            o.textContent = ki ? ki.emptyScript : "";
            for (let f = 0; f < d; f++) o.append(h[f], Mn()), pt.nextNode(), a.push({ type: 2, index: ++s });
            o.append(h[d], Mn());
          }
        }
      } else if (o.nodeType === 8) if (o.data === dc) a.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(Ye, h + 1)) !== -1; ) a.push({ type: 7, index: s }), h += Ye.length - 1;
      }
      s++;
    }
  }
  static createElement(e, n) {
    const i = vt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Vt(t, e, n = t, i) {
  var r, l;
  if (e === we) return e;
  let o = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const s = _n(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== s && ((l = o == null ? void 0 : o._$AO) == null || l.call(o, !1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = o : n._$Cl = o), o !== void 0 && (e = Vt(t, o._$AS(t, e.values), o, i)), e;
}
class gh {
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
    const { el: { content: n }, parts: i } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? vt).importNode(n, !0);
    pt.currentNode = o;
    let s = pt.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let u;
        a.type === 2 ? u = new Qi(s, s.nextSibling, this, e) : a.type === 1 ? u = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (u = new $h(s, this, e)), this._$AV.push(u), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (s = pt.nextNode(), r++);
    }
    return pt.currentNode = vt, o;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let Qi = class mc {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, n, i, o) {
    this.type = 2, this._$AH = $, this._$AN = void 0, this._$AA = e, this._$AB = n, this._$AM = i, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    e = Vt(this, e, n), _n(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== we && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : fh(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && _n(this._$AH) ? this._$AA.nextSibling.data = e : this.T(vt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: n, _$litType$: i } = e, o = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = An.createElement(fc(i.h, i.h[0]), this.options)), i);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === o) this._$AH.p(n);
    else {
      const r = new gh(o, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = il.get(e.strings);
    return n === void 0 && il.set(e.strings, n = new An(e)), n;
  }
  k(e) {
    Bs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, o = 0;
    for (const s of e) o === n.length ? n.push(i = new mc(this.O(Mn()), this.O(Mn()), this, this.options)) : i = n[o], i._$AI(s), o++;
    o < n.length && (this._$AR(i && i._$AB.nextSibling, o), n.length = o);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const o = Yr(e).nextSibling;
      Yr(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class Ji {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, n, i, o, s) {
    this.type = 1, this._$AH = $, this._$AN = void 0, this.element = e, this.name = n, this._$AM = o, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = $;
  }
  _$AI(e, n = this, i, o) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = Vt(this, e, n, 0), r = !_n(e) || e !== this._$AH && e !== we, r && (this._$AH = e);
    else {
      const l = e;
      let a, u;
      for (e = s[0], a = 0; a < s.length - 1; a++) u = Vt(this, l[i + a], n, a), u === we && (u = this._$AH[a]), r || (r = !_n(u) || u !== this._$AH[a]), u === $ ? e = $ : e !== $ && (e += (u ?? "") + s[a + 1]), this._$AH[a] = u;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class bh extends Ji {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class vh extends Ji {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
let wh = class extends Ji {
  constructor(e, n, i, o, s) {
    super(e, n, i, o, s), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Vt(this, e, n, 0) ?? $) === we) return;
    const i = this._$AH, o = e === $ && i !== $ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== $ && (i === $ || o);
    o && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class $h {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Vt(this, e);
  }
}
const yh = { I: Qi }, Lo = dn.litHtmlPolyfillSupport;
Lo == null || Lo(An, Qi), (dn.litHtmlVersions ?? (dn.litHtmlVersions = [])).push("3.3.3");
const kh = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let o = i._$litPart$;
  if (o === void 0) {
    const s = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = o = new Qi(e.insertBefore(Mn(), s), s, void 0, n ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis;
let Nt = class extends It {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = kh(n, this.renderRoot, this.renderOptions);
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
var lc;
Nt._$litElement$ = !0, Nt.finalized = !0, (lc = mt.litElementHydrateSupport) == null || lc.call(mt, { LitElement: Nt });
const Co = mt.litElementPolyfillSupport;
Co == null || Co({ LitElement: Nt });
(mt.litElementVersions ?? (mt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xh = { attribute: !0, type: String, converter: yi, reflect: !1, hasChanged: Rs }, Mh = (t = xh, e, n) => {
  const { kind: i, metadata: o } = n;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(n.name, t), i === "accessor") {
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
function je(t) {
  return (e, n) => typeof n == "object" ? Mh(t, e, n) : ((i, o, s) => {
    const r = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, i), r ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function K(t) {
  return je({ ...t, state: !0, attribute: !1 });
}
function oe() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Fs(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const gt = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, _h = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Ah = { ...gt, role: "power_in" }, Sh = { ...gt, role: "power_out" }, Lh = { role: "sun", domains: ["sun"], primary: !0 }, Ch = ["on", "off", "auto"], Us = (t) => Ch.includes(t), Io = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Ih = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Lh
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [Io("on"), Io("off"), Io("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, gt],
  // Fixed by the device (virtual.<id>, see virtualEntity); never chosen, so the Binding step shows no field for it.
  virtual_switch: [{ role: "control", domains: ["virtual"], primary: !0 }],
  // Announcements: the integration binds a speaker strictly to a player and an optional voice (needed to say text); a phone binds
  // no entity (its notify service is a prop).
  speaker: [{ role: "player", domains: ["media_player"], primary: !0 }, { role: "voice", domains: ["tts"], primary: !1 }],
  phone: [],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, gt, _h, Ah, Sh]
}, Ws = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Eh = { climate_sensor: "any", illuminance_sensor: "any" };
function Ae(t) {
  const e = t.props, n = Ih[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: o }) => o === "power" ? !i : o === "power_in" || o === "power_out" ? i : !0);
  }
  return n;
}
function gc(t) {
  return new Set(Ae(t).map((e) => e.role));
}
function eo(t, e, n, i) {
  var l;
  const o = t.devices.find((a) => a.id === e);
  if (!o || !gc(o).has(n) || o.props.kind === "virtual_switch") return t;
  const s = (l = o.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (s === void 0) return t;
    const a = { ...o.bindings };
    delete a[n];
    const u = { ...o, bindings: a };
    if (Object.keys(a).length === 0 && delete u.bindings, n === "control" && o.props.kind === "equipment" && o.props.controllable) {
      const { controllable: p, ...h } = o.props;
      u.props = h;
    }
    return { ...t, devices: t.devices.map((p) => p === o ? u : p) };
  }
  if (s === i) return t;
  const r = { ...o, bindings: { ...o.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === o ? r : a) };
}
function Oh(t, e) {
  if (t.props.kind === "phone") return t.props.notify ? "bound" : "unbound";
  if (t.props.kind === "virtual_switch") return "bound";
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), o = Ae(t).filter((l) => l.primary);
  if (i.length === 0) return o.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const s = o.filter((l) => !!n[l.role]);
  return (Eh[t.props.kind] === "any" ? s.length > 0 : s.length === o.length) ? "bound" : "partial";
}
function Dh(t) {
  const e = Ae(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Nh = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function as(t, e) {
  var o;
  const n = (o = t.bindings) == null ? void 0 : o[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Us(e) ? n : `${n}|${Nh(i[e])}`;
}
function Ph(t, e, n) {
  const i = as(e, n);
  return i === null ? [] : t.devices.filter((o) => o.id !== e.id && Ae(o).some((s) => as(o, s.role) === i));
}
function Th(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Ae(t)) {
    const o = Us(i) ? as(t, i) : null;
    o !== null && (e.has(o) ? n.push(i) : e.add(o));
  }
  return n;
}
function to(t) {
  if (!t.bindings) return t;
  const e = gc(t), n = Object.entries(t.bindings).filter(([o, s]) => e.has(o) && !!s);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const bc = (t) => t === "wall_switch" || t === "smart_button", no = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", Sn = (t) => t === "wall" ? "wall" : "free", Vh = [100, 125, 150], js = "mdi:cube-outline", ol = ["single", "double", "hold"], Hh = ["say", "play", "notify"], $e = (t) => Hh.includes(t), st = (t) => "button" in t, _e = (t) => "event" in t, zh = {
  bearing: 400
}, di = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function vc(t = oe(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function sl(t) {
  return {
    id: oe(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [vc()]
  };
}
const qs = {
  ceiling_light: ["free"],
  wall_light: ["wall", "free"],
  motion_sensor: ["free", "wall"],
  illuminance_sensor: ["free", "wall"],
  wall_switch: ["wall"],
  valve: ["wall", "free"],
  leak_sensor: ["free", "wall"],
  smart_button: ["wall", "free"],
  socket: ["wall"],
  virtual_switch: ["free", "wall"],
  speaker: ["free", "wall"],
  // A phone is never on the plan: it is added under Not on the plan.
  phone: [],
  equipment: ["free", "wall"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, Ht = 90, wc = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function rt(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: js, label: "" };
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
const Ln = (t) => `virtual.${t}`;
function Rh(t) {
  if (t.props.kind !== "virtual_switch") return t;
  const e = t.bindings;
  return e && Object.keys(e).length === 1 && e.control === Ln(t.id) ? t : { ...t, bindings: { control: Ln(t.id) } };
}
const Bh = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: js
};
function Fh(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, o = typeof e.icon == "string" ? e.icon : Bh[String(n)] ?? js;
  return { ...t, props: { ...i, icon: o } };
}
function Uh(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Sn(t.placement.mode);
  return e ? { ...t, props: rt("smart_button", n), bindings: { on: e } } : { ...t, props: rt("wall_switch", n) };
}
const $c = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Wh(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = $c(n.slot, 0, 9) ? n.slot : e.slot, o = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && o === n.event ? t : { slot: i, event: o };
}
function jh(t) {
  const e = t.props.kind;
  if (!no(e)) return t;
  const n = t.props;
  let i = null;
  for (const [o, s] of Object.entries(rt(e, Sn(t.placement.mode)))) {
    const r = n[o], l = o === "on" || o === "off" || o === "auto" ? Wh(r, s) : o === "windowSec" ? $c(r, 1, 10) ? r : s : typeof r == typeof s ? r : s;
    l !== r && ((i ?? (i = { ...n }))[o] = l);
  }
  return i ? { ...t, props: i } : t;
}
function qh(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function Zh(t) {
  if (!no(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function Gh(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => Rh(to(qh(Zh(jh(Uh(Fh(n))))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function R(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function P(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function N(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function Y(t, e) {
  return t.x * e.x + t.y * e.y;
}
function de(t, e) {
  return t.x * e.y - t.y * e.x;
}
function yc(t) {
  return Math.hypot(t.x, t.y);
}
function z(t, e) {
  return yc(P(e, t));
}
function io(t) {
  const e = yc(t);
  return e === 0 ? { x: 0, y: 0 } : N(t, 1 / e);
}
function re(t) {
  return { x: t.y, y: -t.x };
}
function kc(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function Pe(t, e, n, i) {
  const o = de(e, i);
  if (Math.abs(o) < 1e-9) return null;
  const s = de(P(n, t), i) / o;
  return R(t, N(e, s));
}
function oo(t, e, n) {
  const i = P(n, e), o = Y(i, i);
  return o === 0 ? 0 : Y(P(t, e), i) / o;
}
function Ve(t, e, n) {
  const i = P(n, e), o = Y(i, i), s = o === 0 ? 0 : Math.max(0, Math.min(1, Y(P(t, e), i) / o));
  return z(t, R(e, N(i, s)));
}
function zt(t, e) {
  let n = !1;
  for (let i = 0, o = e.length - 1; i < e.length; o = i++) {
    const s = e[i], r = e[o];
    s.y > t.y != r.y > t.y && t.x < (r.x - s.x) * (t.y - s.y) / (r.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function He(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], o = t[(n + 1) % t.length];
    e += i.x * o.y - o.x * i.y;
  }
  return e / 2;
}
let lt = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function Kh(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function Qe(t, e, n) {
  const i = new lt(null, null);
  let o = i, s = i;
  for (; ; ) {
    const r = n(t, e.key);
    if (r < 0) {
      if (e.left === null) break;
      if (n(t, e.left.key) < 0) {
        const l = e.left;
        if (e.left = l.right, l.right = e, e = l, e.left === null) break;
      }
      s.left = e, s = e, e = e.left;
    } else if (r > 0) {
      if (e.right === null) break;
      if (n(t, e.right.key) > 0) {
        const l = e.right;
        if (e.right = l.left, l.left = e, e = l, e.right === null) break;
      }
      o.right = e, o = e, e = e.right;
    } else break;
  }
  return o.right = e.left, s.left = e.right, e.left = i.right, e.right = i.left, e;
}
function Eo(t, e, n, i) {
  const o = new lt(t, e);
  if (n === null)
    return o.left = o.right = null, o;
  n = Qe(t, n, i);
  const s = i(t, n.key);
  return s < 0 ? (o.left = n.left, o.right = n, n.left = null) : s >= 0 && (o.right = n.right, o.left = n, n.right = null), o;
}
function rl(t, e, n) {
  let i = null, o = null;
  if (e) {
    e = Qe(t, e, n);
    const s = n(e.key, t);
    s === 0 ? (i = e.left, o = e.right) : s < 0 ? (o = e.right, e.right = null, i = e) : (i = e.left, e.left = null, o = e);
  }
  return { left: i, right: o };
}
function Xh(t, e, n) {
  return e === null ? t : (t === null || (e = Qe(t.key, e, n), e.left = t), e);
}
function cs(t, e, n, i, o) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${o(t)}
`);
    const s = e + (n ? "    " : "│   ");
    t.left && cs(t.left, s, !1, i, o), t.right && cs(t.right, s, !0, i, o);
  }
}
class Zs {
  constructor(e = Kh) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = Eo(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new lt(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const o = this._comparator, s = Qe(e, this._root, o), r = o(e, s.key);
    return r === 0 ? this._root = s : (r < 0 ? (i.left = s.left, i.right = s, s.left = null) : r > 0 && (i.right = s.right, i.left = s, s.right = null), this._size++, this._root = i), this._root;
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
    let o;
    return n === null ? null : (n = Qe(e, n, i), i(e, n.key) === 0 ? (n.left === null ? o = n.right : (o = Qe(e, n.left, i), o.right = n.right), this._size--, o) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = Qe(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
      const o = i(e, n.key);
      if (o === 0) return n;
      o < 0 ? n = n.left : n = n.right;
    }
    return null;
  }
  find(e) {
    return this._root && (this._root = Qe(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
  }
  contains(e) {
    let n = this._root;
    const i = this._comparator;
    for (; n; ) {
      const o = i(e, n.key);
      if (o === 0) return !0;
      o < 0 ? n = n.left : n = n.right;
    }
    return !1;
  }
  forEach(e, n) {
    let i = this._root;
    const o = [];
    let s = !1;
    for (; !s; )
      i !== null ? (o.push(i), i = i.left) : o.length !== 0 ? (i = o.pop(), e.call(n, i), i = i.right) : s = !0;
    return this;
  }
  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   */
  range(e, n, i, o) {
    const s = [], r = this._comparator;
    let l = this._root, a;
    for (; s.length !== 0 || l; )
      if (l)
        s.push(l), l = l.left;
      else {
        if (l = s.pop(), a = r(l.key, n), a > 0)
          break;
        if (r(l.key, e) >= 0 && i.call(o, l))
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
    let n = this._root, i = !1, o = 0;
    const s = [];
    for (; !i; )
      if (n)
        s.push(n), n = n.left;
      else if (s.length > 0) {
        if (n = s.pop(), o === e) return n;
        o++, n = n.right;
      } else i = !0;
    return null;
  }
  next(e) {
    let n = this._root, i = null;
    if (e.right) {
      for (i = e.right; i.left; ) i = i.left;
      return i;
    }
    const o = this._comparator;
    for (; n; ) {
      const s = o(e.key, n.key);
      if (s === 0) break;
      s < 0 ? (i = n, n = n.left) : n = n.right;
    }
    return i;
  }
  prev(e) {
    let n = this._root, i = null;
    if (e.left !== null) {
      for (i = e.left; i.right; ) i = i.right;
      return i;
    }
    const o = this._comparator;
    for (; n; ) {
      const s = o(e.key, n.key);
      if (s === 0) break;
      s < 0 ? n = n.left : (i = n, n = n.right);
    }
    return i;
  }
  clear() {
    return this._root = null, this._size = 0, this;
  }
  toList() {
    return Qh(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let o = e.length;
    const s = this._comparator;
    if (i && hs(e, n, 0, o - 1, s), this._root === null)
      this._root = us(e, n, 0, o), this._size = o;
    else {
      const r = Jh(
        this.toList(),
        Yh(e, n),
        s
      );
      o = this._size + o, this._root = ds({ head: r }, 0, o);
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
    return cs(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const o = this._comparator;
    let { left: s, right: r } = rl(e, this._root, o);
    o(e, n) < 0 ? r = Eo(n, i, r, o) : s = Eo(n, i, s, o), this._root = Xh(s, r, o);
  }
  split(e) {
    return rl(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function us(t, e, n, i) {
  const o = i - n;
  if (o > 0) {
    const s = n + Math.floor(o / 2), r = t[s], l = e[s], a = new lt(r, l);
    return a.left = us(t, e, n, s), a.right = us(t, e, s + 1, i), a;
  }
  return null;
}
function Yh(t, e) {
  const n = new lt(null, null);
  let i = n;
  for (let o = 0; o < t.length; o++)
    i = i.next = new lt(t[o], e[o]);
  return i.next = null, n.next;
}
function Qh(t) {
  let e = t;
  const n = [];
  let i = !1;
  const o = new lt(null, null);
  let s = o;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = s = s.next = n.pop(), e = e.right) : i = !0;
  return s.next = null, o.next;
}
function ds(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const o = e + Math.floor(i / 2), s = ds(t, e, o), r = t.head;
    return r.left = s, t.head = t.head.next, r.right = ds(t, o + 1, n), r;
  }
  return null;
}
function Jh(t, e, n) {
  const i = new lt(null, null);
  let o = i, s = t, r = e;
  for (; s !== null && r !== null; )
    n(s.key, r.key) < 0 ? (o.next = s, s = s.next) : (o.next = r, r = r.next), o = o.next;
  return s !== null ? o.next = s : r !== null && (o.next = r), i.next;
}
function hs(t, e, n, i, o) {
  if (n >= i) return;
  const s = t[n + i >> 1];
  let r = n - 1, l = i + 1;
  for (; ; ) {
    do
      r++;
    while (o(t[r], s) < 0);
    do
      l--;
    while (o(t[l], s) > 0);
    if (r >= l) break;
    let a = t[r];
    t[r] = t[l], t[l] = a, a = e[r], e[r] = e[l], e[l] = a;
  }
  hs(t, e, n, l, o), hs(t, e, l + 1, i, o);
}
const Ue = 11102230246251565e-32, le = 134217729, ep = (3 + 8 * Ue) * Ue;
function Oo(t, e, n, i, o) {
  let s, r, l, a, u = e[0], p = i[0], h = 0, d = 0;
  p > u == p > -u ? (s = u, u = e[++h]) : (s = p, p = i[++d]);
  let f = 0;
  if (h < t && d < n)
    for (p > u == p > -u ? (r = u + s, l = s - (r - u), u = e[++h]) : (r = p + s, l = s - (r - p), p = i[++d]), s = r, l !== 0 && (o[f++] = l); h < t && d < n; )
      p > u == p > -u ? (r = s + u, a = r - s, l = s - (r - a) + (u - a), u = e[++h]) : (r = s + p, a = r - s, l = s - (r - a) + (p - a), p = i[++d]), s = r, l !== 0 && (o[f++] = l);
  for (; h < t; )
    r = s + u, a = r - s, l = s - (r - a) + (u - a), u = e[++h], s = r, l !== 0 && (o[f++] = l);
  for (; d < n; )
    r = s + p, a = r - s, l = s - (r - a) + (p - a), p = i[++d], s = r, l !== 0 && (o[f++] = l);
  return (s !== 0 || f === 0) && (o[f++] = s), f;
}
function tp(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function C(t) {
  return new Float64Array(t);
}
const np = (3 + 16 * Ue) * Ue, ip = (2 + 12 * Ue) * Ue, op = (9 + 64 * Ue) * Ue * Ue, St = C(4), ll = C(8), al = C(12), cl = C(16), ue = C(4);
function sp(t, e, n, i, o, s, r) {
  let l, a, u, p, h, d, f, m, w, v, b, y, k, M, x, L, E, A;
  const O = t - o, U = n - o, S = e - s, I = i - s;
  M = O * I, d = le * O, f = d - (d - O), m = O - f, d = le * I, w = d - (d - I), v = I - w, x = m * v - (M - f * w - m * w - f * v), L = S * U, d = le * S, f = d - (d - S), m = S - f, d = le * U, w = d - (d - U), v = U - w, E = m * v - (L - f * w - m * w - f * v), b = x - E, h = x - b, St[0] = x - (b + h) + (h - E), y = M + b, h = y - M, k = M - (y - h) + (b - h), b = k - L, h = k - b, St[1] = k - (b + h) + (h - L), A = y + b, h = A - y, St[2] = y - (A - h) + (b - h), St[3] = A;
  let T = tp(4, St), V = ip * r;
  if (T >= V || -T >= V || (h = t - O, l = t - (O + h) + (h - o), h = n - U, u = n - (U + h) + (h - o), h = e - S, a = e - (S + h) + (h - s), h = i - I, p = i - (I + h) + (h - s), l === 0 && a === 0 && u === 0 && p === 0) || (V = op * r + ep * Math.abs(T), T += O * p + I * l - (S * u + U * a), T >= V || -T >= V)) return T;
  M = l * I, d = le * l, f = d - (d - l), m = l - f, d = le * I, w = d - (d - I), v = I - w, x = m * v - (M - f * w - m * w - f * v), L = a * U, d = le * a, f = d - (d - a), m = a - f, d = le * U, w = d - (d - U), v = U - w, E = m * v - (L - f * w - m * w - f * v), b = x - E, h = x - b, ue[0] = x - (b + h) + (h - E), y = M + b, h = y - M, k = M - (y - h) + (b - h), b = k - L, h = k - b, ue[1] = k - (b + h) + (h - L), A = y + b, h = A - y, ue[2] = y - (A - h) + (b - h), ue[3] = A;
  const F = Oo(4, St, 4, ue, ll);
  M = O * p, d = le * O, f = d - (d - O), m = O - f, d = le * p, w = d - (d - p), v = p - w, x = m * v - (M - f * w - m * w - f * v), L = S * u, d = le * S, f = d - (d - S), m = S - f, d = le * u, w = d - (d - u), v = u - w, E = m * v - (L - f * w - m * w - f * v), b = x - E, h = x - b, ue[0] = x - (b + h) + (h - E), y = M + b, h = y - M, k = M - (y - h) + (b - h), b = k - L, h = k - b, ue[1] = k - (b + h) + (h - L), A = y + b, h = A - y, ue[2] = y - (A - h) + (b - h), ue[3] = A;
  const q = Oo(F, ll, 4, ue, al);
  M = l * p, d = le * l, f = d - (d - l), m = l - f, d = le * p, w = d - (d - p), v = p - w, x = m * v - (M - f * w - m * w - f * v), L = a * u, d = le * a, f = d - (d - a), m = a - f, d = le * u, w = d - (d - u), v = u - w, E = m * v - (L - f * w - m * w - f * v), b = x - E, h = x - b, ue[0] = x - (b + h) + (h - E), y = M + b, h = y - M, k = M - (y - h) + (b - h), b = k - L, h = k - b, ue[1] = k - (b + h) + (h - L), A = y + b, h = A - y, ue[2] = y - (A - h) + (b - h), ue[3] = A;
  const D = Oo(q, al, 4, ue, cl);
  return cl[D - 1];
}
function rp(t, e, n, i, o, s) {
  const r = (e - s) * (n - o), l = (t - o) * (i - s), a = r - l, u = Math.abs(r + l);
  return Math.abs(a) >= np * u ? a : -sp(t, e, n, i, o, s, u);
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
const Qt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, ps = (t, e) => {
  if (e.ur.x < t.ll.x || t.ur.x < e.ll.x || e.ur.y < t.ll.y || t.ur.y < e.ll.y) return null;
  const n = t.ll.x < e.ll.x ? e.ll.x : t.ll.x, i = t.ur.x < e.ur.x ? t.ur.x : e.ur.x, o = t.ll.y < e.ll.y ? e.ll.y : t.ll.y, s = t.ur.y < e.ur.y ? t.ur.y : e.ur.y;
  return {
    ll: {
      x: n,
      y: o
    },
    ur: {
      x: i,
      y: s
    }
  };
};
let Je = Number.EPSILON;
Je === void 0 && (Je = Math.pow(2, -52));
const lp = Je * Je, ul = (t, e) => {
  if (-Je < t && t < Je && -Je < e && e < Je)
    return 0;
  const n = t - e;
  return n * n < lp * t * e ? 0 : t < e ? -1 : 1;
};
class ap {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new dl(), this.yRounder = new dl();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class dl {
  constructor() {
    this.tree = new Zs(), this.round(0);
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
    if (i !== null && ul(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const o = this.tree.next(n);
    return o !== null && ul(n.key, o.key) === 0 ? (this.tree.remove(e), o.key) : e;
  }
}
const Cn = new ap(), hi = (t, e) => t.x * e.y - t.y * e.x, xc = (t, e) => t.x * e.x + t.y * e.y, hl = (t, e, n) => {
  const i = rp(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, xi = (t) => Math.sqrt(xc(t, t)), cp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return hi(o, i) / xi(o) / xi(i);
}, up = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return xc(o, i) / xi(o) / xi(i);
}, pl = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, fl = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, dp = (t, e, n, i) => {
  if (e.x === 0) return fl(n, i, t.x);
  if (i.x === 0) return fl(t, e, n.x);
  if (e.y === 0) return pl(n, i, t.y);
  if (i.y === 0) return pl(t, e, n.y);
  const o = hi(e, i);
  if (o == 0) return null;
  const s = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = hi(s, e) / o, l = hi(s, i) / o, a = t.x + l * e.x, u = n.x + r * i.x, p = t.y + l * e.y, h = n.y + r * i.y, d = (a + u) / 2, f = (p + h) / 2;
  return {
    x: d,
    y: f
  };
};
class ke {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = ke.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : it.compare(e.segment, n.segment));
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
    for (let i = 0, o = n.length; i < o; i++) {
      const s = n[i];
      this.point.events.push(s), s.point = this.point;
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
        for (let o = n + 1; o < e; o++) {
          const s = this.point.events[o];
          s.consumedBy === void 0 && i.otherSE.point.events === s.otherSE.point.events && i.segment.consume(s.segment);
        }
    }
  }
  getAvailableLinkedEvents() {
    const e = [];
    for (let n = 0, i = this.point.events.length; n < i; n++) {
      const o = this.point.events[n];
      o !== this && !o.segment.ringOut && o.segment.isInResult() && e.push(o);
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
    const n = /* @__PURE__ */ new Map(), i = (o) => {
      const s = o.otherSE;
      n.set(o, {
        sine: cp(this.point, e.point, s.point),
        cosine: up(this.point, e.point, s.point)
      });
    };
    return (o, s) => {
      n.has(o) || i(o), n.has(s) || i(s);
      const {
        sine: r,
        cosine: l
      } = n.get(o), {
        sine: a,
        cosine: u
      } = n.get(s);
      return r >= 0 && a >= 0 ? l < u ? 1 : l > u ? -1 : 0 : r < 0 && a < 0 ? l < u ? -1 : l > u ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let hp = 0;
class it {
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
    const i = e.leftSE.point.x, o = n.leftSE.point.x, s = e.rightSE.point.x, r = n.rightSE.point.x;
    if (r < i) return 1;
    if (s < o) return -1;
    const l = e.leftSE.point.y, a = n.leftSE.point.y, u = e.rightSE.point.y, p = n.rightSE.point.y;
    if (i < o) {
      if (a < l && a < u) return 1;
      if (a > l && a > u) return -1;
      const h = e.comparePoint(n.leftSE.point);
      if (h < 0) return 1;
      if (h > 0) return -1;
      const d = n.comparePoint(e.rightSE.point);
      return d !== 0 ? d : -1;
    }
    if (i > o) {
      if (l < a && l < p) return -1;
      if (l > a && l > p) return 1;
      const h = n.comparePoint(e.leftSE.point);
      if (h !== 0) return h;
      const d = e.comparePoint(n.rightSE.point);
      return d < 0 ? 1 : d > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (s < r) {
      const h = n.comparePoint(e.rightSE.point);
      if (h !== 0) return h;
    }
    if (s > r) {
      const h = e.comparePoint(n.rightSE.point);
      if (h < 0) return 1;
      if (h > 0) return -1;
    }
    if (s !== r) {
      const h = u - l, d = s - i, f = p - a, m = r - o;
      if (h > d && f < m) return 1;
      if (h < d && f > m) return -1;
    }
    return s > r ? 1 : s < r || u < p ? -1 : u > p ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, o) {
    this.id = ++hp, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = o;
  }
  static fromRing(e, n, i) {
    let o, s, r;
    const l = ke.comparePoints(e, n);
    if (l < 0)
      o = e, s = n, r = 1;
    else if (l > 0)
      o = n, s = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new ke(o, !0), u = new ke(s, !1);
    return new it(a, u, [i], [r]);
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
    const n = this.leftSE.point, i = this.rightSE.point, o = this.vector();
    if (n.x === i.x)
      return e.x === n.x ? 0 : e.x < n.x ? 1 : -1;
    const s = (e.y - n.y) / o.y, r = n.x + s * o.x;
    if (e.x === r) return 0;
    const l = (e.x - n.x) / o.x, a = n.y + l * o.y;
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
    const n = this.bbox(), i = e.bbox(), o = ps(n, i);
    if (o === null) return null;
    const s = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, u = Qt(n, l) && this.comparePoint(l) === 0, p = Qt(i, s) && e.comparePoint(s) === 0, h = Qt(n, a) && this.comparePoint(a) === 0, d = Qt(i, r) && e.comparePoint(r) === 0;
    if (p && u)
      return d && !h ? r : !d && h ? a : null;
    if (p)
      return h && s.x === a.x && s.y === a.y ? null : s;
    if (u)
      return d && r.x === l.x && r.y === l.y ? null : l;
    if (d && h) return null;
    if (d) return r;
    if (h) return a;
    const f = dp(s, this.vector(), l, e.vector());
    return f === null || !Qt(o, f) ? null : Cn.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, o = new ke(e, !0), s = new ke(e, !1), r = this.rightSE;
    this.replaceRightSE(s), n.push(s), n.push(o);
    const l = new it(o, r, this.rings.slice(), this.windings.slice());
    return ke.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), ke.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (o.checkForConsuming(), s.checkForConsuming()), n;
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
    const o = it.compare(n, i);
    if (o !== 0) {
      if (o > 0) {
        const s = n;
        n = i, i = s;
      }
      if (n.prev === i) {
        const s = n;
        n = i, i = s;
      }
      for (let s = 0, r = i.rings.length; s < r; s++) {
        const l = i.rings[s], a = i.windings[s], u = n.rings.indexOf(l);
        u === -1 ? (n.rings.push(l), n.windings.push(a)) : n.windings[u] += a;
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
    const n = this._afterState.rings, i = this._afterState.windings, o = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const u = this.rings[l], p = this.windings[l], h = n.indexOf(u);
      h === -1 ? (n.push(u), i.push(p)) : i[h] += p;
    }
    const s = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const u = n[l], p = u.poly;
      if (r.indexOf(p) === -1)
        if (u.isExterior) s.push(p);
        else {
          r.indexOf(p) === -1 && r.push(p);
          const h = s.indexOf(u.poly);
          h !== -1 && s.splice(h, 1);
        }
    }
    for (let l = 0, a = s.length; l < a; l++) {
      const u = s[l].multiPoly;
      o.indexOf(u) === -1 && o.push(u);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (Le.type) {
      case "union": {
        const i = e.length === 0, o = n.length === 0;
        this._isInResult = i !== o;
        break;
      }
      case "intersection": {
        let i, o;
        e.length < n.length ? (i = e.length, o = n.length) : (i = n.length, o = e.length), this._isInResult = o === Le.numMultiPolys && i < o;
        break;
      }
      case "xor": {
        const i = Math.abs(e.length - n.length);
        this._isInResult = i % 2 === 1;
        break;
      }
      case "difference": {
        const i = (o) => o.length === 1 && o[0].isSubject;
        this._isInResult = i(e) !== i(n);
        break;
      }
      default:
        throw new Error(`Unrecognized operation type found ${Le.type}`);
    }
    return this._isInResult;
  }
}
class ml {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const o = Cn.round(e[0][0], e[0][1]);
    this.bbox = {
      ll: {
        x: o.x,
        y: o.y
      },
      ur: {
        x: o.x,
        y: o.y
      }
    };
    let s = o;
    for (let r = 1, l = e.length; r < l; r++) {
      if (typeof e[r][0] != "number" || typeof e[r][1] != "number")
        throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
      let a = Cn.round(e[r][0], e[r][1]);
      a.x === s.x && a.y === s.y || (this.segments.push(it.fromRing(s, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), s = a);
    }
    (o.x !== s.x || o.y !== s.y) && this.segments.push(it.fromRing(s, o, this));
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.segments.length; n < i; n++) {
      const o = this.segments[n];
      e.push(o.leftSE), e.push(o.rightSE);
    }
    return e;
  }
}
class pp {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new ml(e[0], this, !0), this.bbox = {
      ll: {
        x: this.exteriorRing.bbox.ll.x,
        y: this.exteriorRing.bbox.ll.y
      },
      ur: {
        x: this.exteriorRing.bbox.ur.x,
        y: this.exteriorRing.bbox.ur.y
      }
    }, this.interiorRings = [];
    for (let i = 1, o = e.length; i < o; i++) {
      const s = new ml(e[i], this, !1);
      s.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = s.bbox.ll.x), s.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = s.bbox.ll.y), s.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = s.bbox.ur.x), s.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = s.bbox.ur.y), this.interiorRings.push(s);
    }
    this.multiPoly = n;
  }
  getSweepEvents() {
    const e = this.exteriorRing.getSweepEvents();
    for (let n = 0, i = this.interiorRings.length; n < i; n++) {
      const o = this.interiorRings[n].getSweepEvents();
      for (let s = 0, r = o.length; s < r; s++)
        e.push(o[s]);
    }
    return e;
  }
}
class gl {
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
    for (let i = 0, o = e.length; i < o; i++) {
      const s = new pp(e[i], this);
      s.bbox.ll.x < this.bbox.ll.x && (this.bbox.ll.x = s.bbox.ll.x), s.bbox.ll.y < this.bbox.ll.y && (this.bbox.ll.y = s.bbox.ll.y), s.bbox.ur.x > this.bbox.ur.x && (this.bbox.ur.x = s.bbox.ur.x), s.bbox.ur.y > this.bbox.ur.y && (this.bbox.ur.y = s.bbox.ur.y), this.polys.push(s);
    }
    this.isSubject = n;
  }
  getSweepEvents() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const o = this.polys[n].getSweepEvents();
      for (let s = 0, r = o.length; s < r; s++)
        e.push(o[s]);
    }
    return e;
  }
}
class Mi {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.isInResult() || s.ringOut) continue;
      let r = null, l = s.leftSE, a = s.rightSE;
      const u = [l], p = l.point, h = [];
      for (; r = l, l = a, u.push(l), l.point !== p; )
        for (; ; ) {
          const d = l.getAvailableLinkedEvents();
          if (d.length === 0) {
            const w = u[0].point, v = u[u.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${w.x}, ${w.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (d.length === 1) {
            a = d[0].otherSE;
            break;
          }
          let f = null;
          for (let w = 0, v = h.length; w < v; w++)
            if (h[w].point === l.point) {
              f = w;
              break;
            }
          if (f !== null) {
            const w = h.splice(f)[0], v = u.splice(w.index);
            v.unshift(v[0].otherSE), n.push(new Mi(v.reverse()));
            continue;
          }
          h.push({
            index: u.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = d.sort(m)[0].otherSE;
          break;
        }
      n.push(new Mi(u));
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
    for (let u = 1, p = this.events.length - 1; u < p; u++) {
      const h = this.events[u].point, d = this.events[u + 1].point;
      hl(h, e, d) !== 0 && (n.push(h), e = h);
    }
    if (n.length === 1) return null;
    const i = n[0], o = n[1];
    hl(i, e, o) === 0 && n.shift(), n.push(n[0]);
    const s = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let u = r; u != l; u += s) a.push([n[u].x, n[u].y]);
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
    for (let o = 1, s = this.events.length; o < s; o++) {
      const r = this.events[o];
      ke.compare(e, r) > 0 && (e = r);
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
class bl {
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
      const o = this.interiorRings[n].getGeom();
      o !== null && e.push(o);
    }
    return e;
  }
}
class fp {
  constructor(e) {
    this.rings = e, this.polys = this._composePolys(e);
  }
  getGeom() {
    const e = [];
    for (let n = 0, i = this.polys.length; n < i; n++) {
      const o = this.polys[n].getGeom();
      o !== null && e.push(o);
    }
    return e;
  }
  _composePolys(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.poly)
        if (s.isExteriorRing()) n.push(new bl(s));
        else {
          const r = s.enclosingRing();
          r.poly || n.push(new bl(r)), r.poly.addInterior(s);
        }
    }
    return n;
  }
}
class mp {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : it.compare;
    this.queue = e, this.tree = new Zs(n), this.segments = [];
  }
  process(e) {
    const n = e.segment, i = [];
    if (e.consumedBy)
      return e.isLeft ? this.queue.remove(e.otherSE) : this.tree.remove(n), i;
    const o = e.isLeft ? this.tree.add(n) : this.tree.find(n);
    if (!o) throw new Error(`Unable to find segment #${n.id} [${n.leftSE.point.x}, ${n.leftSE.point.y}] -> [${n.rightSE.point.x}, ${n.rightSE.point.y}] in SweepLine tree.`);
    let s = o, r = o, l, a;
    for (; l === void 0; )
      s = this.tree.prev(s), s === null ? l = null : s.key.consumedBy === void 0 && (l = s.key);
    for (; a === void 0; )
      r = this.tree.next(r), r === null ? a = null : r.key.consumedBy === void 0 && (a = r.key);
    if (e.isLeft) {
      let u = null;
      if (l) {
        const h = l.getIntersection(n);
        if (h !== null && (n.isAnEndpoint(h) || (u = h), !l.isAnEndpoint(h))) {
          const d = this._splitSafely(l, h);
          for (let f = 0, m = d.length; f < m; f++)
            i.push(d[f]);
        }
      }
      let p = null;
      if (a) {
        const h = a.getIntersection(n);
        if (h !== null && (n.isAnEndpoint(h) || (p = h), !a.isAnEndpoint(h))) {
          const d = this._splitSafely(a, h);
          for (let f = 0, m = d.length; f < m; f++)
            i.push(d[f]);
        }
      }
      if (u !== null || p !== null) {
        let h = null;
        u === null ? h = p : p === null ? h = u : h = ke.comparePoints(u, p) <= 0 ? u : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const d = n.split(h);
        for (let f = 0, m = d.length; f < m; f++)
          i.push(d[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const u = l.getIntersection(a);
        if (u !== null) {
          if (!l.isAnEndpoint(u)) {
            const p = this._splitSafely(l, u);
            for (let h = 0, d = p.length; h < d; h++)
              i.push(p[h]);
          }
          if (!a.isAnEndpoint(u)) {
            const p = this._splitSafely(a, u);
            for (let h = 0, d = p.length; h < d; h++)
              i.push(p[h]);
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
    const o = e.split(n);
    return o.push(i), e.consumedBy === void 0 && this.tree.add(e), o;
  }
}
const vl = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, gp = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class bp {
  run(e, n, i) {
    Le.type = e, Cn.reset();
    const o = [new gl(n, !0)];
    for (let h = 0, d = i.length; h < d; h++)
      o.push(new gl(i[h], !1));
    if (Le.numMultiPolys = o.length, Le.type === "difference") {
      const h = o[0];
      let d = 1;
      for (; d < o.length; )
        ps(o[d].bbox, h.bbox) !== null ? d++ : o.splice(d, 1);
    }
    if (Le.type === "intersection")
      for (let h = 0, d = o.length; h < d; h++) {
        const f = o[h];
        for (let m = h + 1, w = o.length; m < w; m++)
          if (ps(f.bbox, o[m].bbox) === null) return [];
      }
    const s = new Zs(ke.compare);
    for (let h = 0, d = o.length; h < d; h++) {
      const f = o[h].getSweepEvents();
      for (let m = 0, w = f.length; m < w; m++)
        if (s.insert(f[m]), s.size > vl)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new mp(s);
    let l = s.size, a = s.pop();
    for (; a; ) {
      const h = a.key;
      if (s.size === l) {
        const f = h.segment;
        throw new Error(`Unable to pop() ${h.isLeft ? "left" : "right"} SweepEvent [${h.point.x}, ${h.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (s.size > vl)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > gp)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const d = r.process(h);
      for (let f = 0, m = d.length; f < m; f++) {
        const w = d[f];
        w.consumedBy === void 0 && s.insert(w);
      }
      l = s.size, a = s.pop();
    }
    Cn.reset();
    const u = Mi.factory(r.segments);
    return new fp(u).getGeom();
  }
}
const Le = new bp(), vp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Le.run("union", t, n);
}, wp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Le.run("intersection", t, n);
}, $p = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Le.run("xor", t, n);
}, yp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Le.run("difference", t, n);
};
var Mc = {
  union: vp,
  intersection: wp,
  xor: $p,
  difference: yp
};
const _c = 3, kp = 1e-6;
function so(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function ne(t, e) {
  const n = so(t, e);
  return { x: n.x, y: n.y };
}
function xt(t, e) {
  const n = t.walls.find((s) => s.id === e);
  if (!n) return null;
  const i = t.nodes.find((s) => s.id === n.a), o = t.nodes.find((s) => s.id === n.b);
  return !i || !o ? null : z(i, o);
}
function Ac(t, e, n, i) {
  const o = n, [s, r] = i === "left" ? [0, o] : i === "right" ? [o, 0] : [o / 2, o / 2];
  return { a: t, b: e, dir: io(P(e, t)), len: z(t, e), leftOff: s, rightOff: r };
}
function ce(t, e) {
  return Ac(ne(t, e.a), ne(t, e.b), e.thickness, e.baseline);
}
function ct(t, e) {
  const n = P(e, t.a);
  return { t: Y(n, t.dir), side: Y(n, re(t.dir)) };
}
function wl(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: N(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Et = (t) => R(t.p, N(re(t.u), t.offL)), Ot = (t) => P(t.p, N(re(t.u), t.offR));
function ft(t, e, n) {
  return t !== null && z(t, e) <= n;
}
function xp(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ce(t, n);
    if (i.len < 1e-9) continue;
    const o = re(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: R(i.a, N(o, i.leftOff)),
        ar: P(i.a, N(o, i.rightOff)),
        bl: R(i.b, N(o, i.leftOff)),
        br: P(i.b, N(o, i.rightOff))
      }
    });
  }
  return e;
}
function Mp(t, e) {
  const n = e.f, i = re(n.dir);
  for (const o of t) {
    if (o.body === e) continue;
    const r = Y(P(o.far, n.a), i) >= 0 ? R(n.a, N(i, n.leftOff)) : P(n.a, N(i, n.rightOff)), l = _c * Math.max(o.body.wall.thickness, e.wall.thickness), a = Pe(Et(o), o.u, r, n.dir), u = Pe(Ot(o), o.u, r, n.dir);
    ft(a, o.p, l) && (o.body.c[o.leftKey] = a), ft(u, o.p, l) && (o.body.c[o.rightKey] = u);
  }
}
function _p(t, e) {
  t.sort((o, s) => Math.atan2(o.u.y, o.u.x) - Math.atan2(s.u.y, s.u.x));
  const n = _c * Math.max(...t.map((o) => o.body.wall.thickness));
  for (let o = 0; o < t.length; o++) {
    const s = t[o], r = t[(o + 1) % t.length], l = Pe(Ot(s), s.u, Et(r), r.u);
    ft(l, e, n) && (s.body.c[s.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Ap(t, e, n);
  for (const o of t) {
    if (i.has(o)) continue;
    const s = o.body.c[o.leftKey], r = o.body.c[o.rightKey], l = P(r, s), a = de(l, P(e, s)), u = de(l, P(o.far, s));
    a * u < 0 && fs(o, [e]);
  }
}
function fs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Ap(t, e, n) {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o], r = t[(o + 1) % i];
    if (Math.abs(de(s.u, r.u)) > 1e-9 || Y(s.u, r.u) > 0) continue;
    const l = s.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(o + 2) % i], u = Pe(Ot(s), s.u, Et(a), a.u), p = Pe(Et(r), r.u, Et(a), a.u);
        if (!ft(u, e, n) || !ft(p, e, n)) continue;
        const h = r.body.c[r.rightKey];
        s.body.c[s.rightKey] = u, r.body.c[r.leftKey] = p, fs(s, [e, h, p]);
      } else {
        const a = t[(o - 1 + i) % i], u = Pe(Et(r), r.u, Ot(a), a.u), p = Pe(Ot(s), s.u, Ot(a), a.u);
        if (!ft(p, e, n) || !ft(u, e, n)) continue;
        const h = s.body.c[s.leftKey];
        s.body.c[s.rightKey] = p, r.body.c[r.leftKey] = u, fs(r, [p, h, e]);
      }
      return /* @__PURE__ */ new Set([s, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Gs(t) {
  const e = xp(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const o = [];
    for (const r of e)
      r.wall.a === i.id && o.push(wl(r, "a")), r.wall.b === i.id && o.push(wl(r, "b"));
    if (o.length === 0) continue;
    const s = i.host ? n.get(i.host.wallId) : void 0;
    s ? Mp(o, s) : o.length >= 2 && _p(o, { x: i.x, y: i.y });
  }
  return e;
}
function Sc(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Gs(t))
    for (const [o, s, r] of n) {
      const l = i.c[o];
      e.push({ pt: l, wallId: i.wall.id, side: s, end: r, offset: Y(P(l, i.f.a), i.f.dir) });
    }
  return e;
}
function Lc(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function ro(t) {
  return new Map(Gs(t).map((e) => [e.wall.id, Lc(e)]));
}
function $l(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const o = t[i], s = t[(i + 1) % t.length], r = e(o), l = e(s);
    r >= 0 && n.push(o), r >= 0 != l >= 0 && n.push(R(o, N(P(s, o), r / (r - l))));
  }
  return n;
}
function Ks(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Gs(t)) {
    const o = Lc(i), s = t.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && e(p)).sort((p, h) => p.offset - h.offset), r = (p) => Y(P(p, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const p of s)
      l.push([a, p.offset]), a = Math.max(a, p.offset + p.width);
    l.push([a, 1 / 0]);
    const u = [];
    for (const [p, h] of l) {
      if (h <= p) continue;
      let d = o;
      p > -1 / 0 && (d = $l(d, (f) => r(f) - p)), h < 1 / 0 && (d = $l(d, (f) => h - r(f))), d.length >= 3 && Math.abs(He(d)) > kp && u.push(d);
    }
    n.set(i.wall.id, u);
  }
  return n;
}
const ms = (t) => [t.map((e) => [e.x, e.y])];
function Cc(t) {
  const e = t.map(([o, s]) => ({ x: o, y: s })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Ic(t, e) {
  return Ec(e ? [...Ks(t).values()].flat() : [...ro(t).values()]);
}
function Ec(t) {
  const e = t.map(ms);
  if (e.length === 0) return [];
  let n;
  try {
    n = Mc.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return n.map((i) => i.map(Cc));
}
const Rt = 1e-6, _i = ["door", "gate", "wicket"], Oc = (t) => t === "opening", Dc = (t) => t.passesLight ?? Oc(t.kind), Nc = (t) => t === "opening", Pc = (t) => t.passesPir ?? Nc(t.kind);
function Tc(t, e) {
  return t.offset < e.offset + e.width - Rt && e.offset < t.offset + t.width - Rt;
}
function lo(t, e, n, i, o) {
  const s = xt(t, e);
  return s === null || i <= 0 || n < -Rt || n + i > s + Rt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== o && Tc(r, { offset: n, width: i }));
}
function qt(t, e) {
  return { ...t, openings: e };
}
function Sp(t, e, n, i, o, s = {}) {
  const r = o ?? di[n], l = i - r / 2;
  if (!lo(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: oe(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return _i.includes(n) && (a.hinge = s.hinge ?? "start", a.swing = s.swing ?? "left"), n === "window" && (a.outside = s.outside ?? "left"), { level: qt(t, [...t.openings, a]), openingId: a.id };
}
function Vc(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !lo(t, i.wallId, n, i.width, e) ? t : Bn(qt(t, t.openings.map((o) => o.id === e ? { ...o, offset: n } : o)));
}
function Lp(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !lo(t, i.wallId, i.offset, n, e) ? t : Bn(qt(t, t.openings.map((o) => o.id === e ? { ...o, width: n } : o)));
}
function Cp(t, e) {
  return _i.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Ip(t, e, n) {
  if (!t.openings.some((o) => o.id === e)) return t;
  const i = (o) => {
    const s = { ...o, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete s[r];
    return s;
  };
  return Bn(qt(t, t.openings.map((o) => o.id === e ? i(o) : o)));
}
function Hc(t, e) {
  return Bn(qt(t, t.openings.filter((n) => n.id !== e)));
}
function Bn(t) {
  return qt(t, t.openings.map((e) => {
    const n = xt(t, e.wallId), i = n === null || e.offset < -Rt || e.offset + e.width > n + Rt || t.openings.some((o) => o.id !== e.id && o.wallId === e.wallId && Tc(e, o));
    return { ...e, invalid: i };
  }));
}
const Ai = 1e-6;
function zc(t, e) {
  return e.mode !== "none" && qs[t.kind].includes(e.mode);
}
function Rc(t, e, n) {
  if (n.mode === "none" || !zc(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Ht || i > Ht)) return !1;
  const o = xt(t, n.wallId);
  return o !== null && n.offset >= -Ai && n.offset <= o + Ai;
}
function qe(t, e) {
  return { ...t, devices: e };
}
function yl(t, e, n, i) {
  if (!Rc(t, e, n)) return { level: t, deviceId: null };
  const o = oe(), s = { id: o, name: i, placement: n, props: e, invalid: !1 };
  return e.kind === "virtual_switch" && (s.bindings = { control: Ln(o) }), { level: qe(t, [...t.devices, s]), deviceId: s.id };
}
function Bc(t, e, n = "equipment") {
  const i = oe(), o = { id: i, name: e, placement: { mode: "none" }, props: rt(n, "free"), invalid: !1 };
  return n === "virtual_switch" && (o.bindings = { control: Ln(i) }), { level: qe(t, [...t.devices, o]), id: o.id };
}
const Ep = ["power", "power_in", "power_out", "voltage"];
function Op(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Ep.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Zt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, Fc = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function Uc(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function Wc(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [o, s] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[o] && (r[s] = r[o]), delete r[o];
  const l = to({ ...i, props: Uc(i.props, "inverter", n), bindings: r });
  return qe(t, t.devices.map((a) => a === i ? l : a));
}
function ao(t, e, n) {
  const i = t.devices.find((s) => s.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const o = { ...i, props: Uc(i.props, "controllable", n) };
  return qe(t, t.devices.map((s) => s === i ? o : s));
}
function jc(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = rt("motion_sensor", Sn(e)), o = rt("motion_sensor", Sn(n));
  return i.kind === "motion_sensor" && o.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: o.zoneAngle } : t;
}
function Si(t, e, n) {
  const i = t.devices, o = i.find((r) => r.id === e);
  if (!o || !Rc(t, o.props, n)) return t;
  const s = jc(o.props, o.placement.mode, n.mode);
  return qc(qe(t, i.map((r) => r.id === e ? { ...r, placement: n, props: s } : r)));
}
function Mt(t, e, n, i) {
  const o = t.devices;
  return o.some((s) => s.id === e) ? qe(t, o.map((s) => {
    if (s.id !== e) return s;
    const r = { ...s.props, ...n, kind: s.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return to({ ...s, props: r, name: i ?? s.name });
  })) : t;
}
function Dp(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !bc(i.props.kind) || i.props.kind === n) return t;
  const o = rt(n, Sn(i.placement.mode));
  if (!zc(o, i.placement)) return t;
  const s = to({ ...i, props: o });
  return qe(t, t.devices.map((r) => r === i ? s : r));
}
function Np(t, e) {
  return qe(t, t.devices.filter((n) => n.id !== e));
}
function qc(t) {
  return qe(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = xt(t, e.placement.wallId), i = n === null || e.placement.offset < -Ai || e.placement.offset > n + Ai;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function Zc(t) {
  const e = [];
  for (const n of Ic(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function gs(t, e) {
  let n = null, i = 1 / 0;
  for (const o of t) {
    if (!zt(e, o)) continue;
    const s = Math.abs(He(o));
    s < i && (n = o, i = s);
  }
  return n;
}
const Do = 1e-3;
function Gc(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(He(t)) - Math.abs(He(e))) > Do ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= Do && Math.abs(n.y - i.y) <= Do));
}
const Kc = 2, kl = Math.ceil(360 / Kc), xl = 1e-4, Pp = 1e-9, Ml = 1e-9, Tp = {
  light: Dc,
  motion: Pc
};
function Xc(t, e) {
  const n = [];
  for (const i of Ec([...Ks(t, Tp[e]).values()].flat()))
    for (const o of i)
      for (let s = 0; s < o.length; s++) n.push([o[s], o[(s + 1) % o.length]]);
  return n;
}
function Xs(t, e, n) {
  return e.filter(([i, o]) => Ve(t, i, o) <= n);
}
function No(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Vp(t, e, n) {
  const i = Xs(t, e, n), o = [];
  for (let v = 0; v < kl; v++) o.push(-Math.PI + 2 * Math.PI * v / kl);
  const s = n * 1.05;
  for (const v of i)
    for (const b of v) {
      if (z(t, b) > s) continue;
      const y = Math.atan2(b.y - t.y, b.x - t.x);
      o.push(No(y - xl), No(y), No(y + xl));
    }
  o.sort((v, b) => v - b);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), u = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([v, b], y) => {
    l[y] = v.x - t.x, a[y] = v.y - t.y, u[y] = b.x - v.x, p[y] = b.y - v.y;
  });
  const h = [], d = [];
  let f = NaN;
  for (const v of o) {
    if (v === f) continue;
    f = v;
    const b = Math.cos(v), y = Math.sin(v);
    let k = n, M = -1;
    for (let E = 0; E < r; E++) {
      const A = b * p[E] - y * u[E];
      if (Math.abs(A) < 1e-12) continue;
      const O = (l[E] * p[E] - a[E] * u[E]) / A;
      if (!(O > Pp && O < k)) continue;
      const U = (l[E] * y - a[E] * b) / A;
      U < -Ml || U > 1 + Ml || (k = O, M = E);
    }
    const x = { x: t.x + b * k, y: t.y + y * k }, L = h.length;
    if (!(L > 0 && h[L - 1].x === x.x && h[L - 1].y === x.y)) {
      if (M >= 0 && L >= 2 && d[L - 1] === M && d[L - 2] === M) {
        h[L - 1] = x;
        continue;
      }
      h.push(x), d.push(M);
    }
  }
  const m = h[0], w = h[h.length - 1];
  return h.length > 1 && m.x === w.x && m.y === w.y && h.pop(), h;
}
const Hp = 32, _l = 128;
function Li(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function We(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function Ys(t) {
  return (t % 360 + 360) % 360;
}
function Yc(t) {
  return (t % 360 + 540) % 360 - 180;
}
function Qc(t, e, n, i) {
  const o = t.walls.find((u) => u.id === e);
  if (!o) return null;
  let s;
  try {
    s = ce(t, o);
  } catch {
    return null;
  }
  const r = re(s.dir), l = n === "left" ? r : N(r, -1), a = n === "left" ? s.leftOff : s.rightOff;
  return { pt: R(R(s.a, N(s.dir, i)), N(l, a)), normal: l };
}
function In(t, e, n, i) {
  var o;
  return ((o = Qc(t, e, n, i)) == null ? void 0 : o.pt) ?? null;
}
function ae(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Li(n.rotation) };
  const i = Qc(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const o = i.normal, s = e.props;
  if (s.kind === "equipment") {
    const r = s.shape === "circle" ? s.diameter / 2 : s.depth / 2;
    return { pt: R(i.pt, N(o, r)), dir: re(o), normal: o };
  }
  return { pt: i.pt, dir: n.aim ? Li(We(o) + n.aim) : o, normal: o };
}
function Al(t, e, n, i, o, s) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let u;
    try {
      u = ce(t, a);
    } catch {
      continue;
    }
    const p = a.a === n ? u.dir : N(u.dir, -1);
    if (Math.abs(de(i, p)) < 1e-9 && Y(i, p) < 0) {
      if ((Y(re(u.dir), o) > 0 ? u.leftOff : u.rightOff) > s + 1e-6) return !1;
      l = !0;
    } else if (Y(p, o) > 1e-9) return !1;
  }
  return l;
}
function Qs(t, e, n, i) {
  var U;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const o = t.walls.find((S) => S.id === n.wallId);
  if (!o) return n;
  let s;
  try {
    s = ce(t, o);
  } catch {
    return n;
  }
  const r = Sc(t), l = r.filter((S) => S.wallId === n.wallId && S.side === n.side), a = l.find((S) => S.end === "a"), u = l.find((S) => S.end === "b");
  if (!a || !u) return n;
  const p = re(s.dir), h = n.side === "left" ? p : N(p, -1), d = n.side === "left" ? s.leftOff : s.rightOff, f = Al(t, o, o.a, s.dir, h, d) ? -1 / 0 : a.offset, m = Al(t, o, o.b, N(s.dir, -1), h, d) ? 1 / 0 : u.offset, w = (S) => Y(P(S, s.a), s.dir), v = [];
  for (const S of t.nodes)
    if (((U = S.host) == null ? void 0 : U.wallId) === o.id)
      for (const I of t.walls) {
        const T = I.a === S.id ? "a" : I.b === S.id ? "b" : null, V = T && t.nodes.find((q) => q.id === (T === "a" ? I.b : I.a));
        if (!V || (Y(P(V, s.a), p) >= 0 ? "left" : "right") !== n.side) continue;
        const F = r.filter((q) => q.wallId === I.id && q.end === T).map((q) => w(q.pt));
        F.length && v.push([Math.min(...F), Math.max(...F)]);
      }
  v.sort((S, I) => S[0] - I[0]);
  const b = [];
  let y = f;
  for (const [S, I] of v) {
    const T = Math.min(S, m);
    T > y && b.push([y, T]), y = Math.max(y, I);
  }
  m > y && b.push([y, m]), b.length === 0 && b.push([f, m]);
  const k = ([S, I]) => Math.max(0, S - n.offset, n.offset - I), [M, x] = b.reduce((S, I) => k(I) < k(S) ? I : S), L = (e.shape === "circle" ? e.diameter : e.width) / 2, E = M + L, A = x - L;
  let O = n.offset;
  return E > A ? O = (M + x) / 2 : O <= E + i ? O = E : O >= A - i && (O = A), O = Math.max(0, Math.min(s.len, O)), Math.abs(O - n.offset) < 1e-9 ? n : { ...n, offset: O };
}
function Jc(t, e) {
  const n = [];
  for (let i = 0; i < _l; i++) n.push(R(t, N(Li(360 * i / _l), e)));
  return n;
}
function Sl(t, e, n, i) {
  if (n >= 360) return Jc(t, i);
  const o = Math.max(1, Math.ceil(n / 90 * Hp)), s = We(e) - n / 2, r = [t];
  for (let l = 0; l <= o; l++) r.push(R(t, N(Li(s + n * l / o), i)));
  return r;
}
const zp = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function co(t) {
  return zp[t] ?? null;
}
const Rp = (t) => co(t.kind) !== null;
function Bp(t, e) {
  const n = e.props;
  if (!Rp(n)) return null;
  const i = ae(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Sl(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Sl(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? Jc(i.pt, n.poolRadius) : null;
  }
}
function Fp(t) {
  return t.normal ? R(t.pt, t.normal) : t.pt;
}
function Ll(t, e) {
  let n = !1;
  for (const [i, o] of e)
    i.y > t.y != o.y > t.y && t.x < i.x + (t.y - i.y) * (o.x - i.x) / (o.y - i.y) && (n = !n);
  return n;
}
function Up(t, e, n) {
  const i = P(e, t);
  for (const [o, s] of n) {
    const r = P(s, o), l = P(o, t), a = de(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const u = de(l, r) / a, p = de(l, i) / a;
    if (u >= 0 && u <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Cl = 0.5, Wp = 3, jp = 1e-4;
function qp(t, e, n) {
  const i = ae(t, e);
  if (!i) return null;
  const o = Fp(i), s = e.placement;
  if (s.mode !== "wall") return o;
  const r = (x) => Ll(x, n) || Xs(x, n, Cl).length > 0;
  if (!r(o)) return o;
  const l = ce(t, t.walls.find((x) => x.id === s.wallId)), a = i.normal, u = (x) => Math.abs(Y(P(x, i.pt), a)) <= jp, p = ([x, L]) => N(R(x, L), 0.5), h = n.filter((x) => u(x[0]) && u(x[1]) && z(x[0], x[1]) > 1e-9 && !Ll(R(p(x), N(a, Cl)), n)), d = (x) => Y(P(x, l.a), l.dir), f = ([x, L]) => Math.max(0, Math.min(d(x), d(L)) - s.offset, s.offset - Math.max(d(x), d(L))), m = Math.min(...h.map(f)), w = h.filter((x) => f(x) <= m + 1e-6).map((x) => R(p(x), a)), v = (x) => w.some((L) => !Up(x, L, n)), b = Wp * Math.max(...t.walls.map((x) => x.thickness)) + 2, y = [];
  for (const [x, L] of n) {
    const E = P(L, x), A = P(x, o), O = de(l.dir, E);
    if (Math.abs(O) < 1e-12) continue;
    const U = de(A, l.dir) / O;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const S = de(A, E) / O, I = z(x, L) / Math.abs(O);
    y.push(S - I, S + I);
  }
  const k = s.offset <= l.len / 2 ? 1 : -1, M = y.filter((x) => Math.abs(x) <= b).sort((x, L) => Math.abs(x) - Math.abs(L) || Math.sign(L) * k - Math.sign(x) * k);
  for (const x of M) {
    const L = R(o, N(l.dir, x));
    if (!r(L) && v(L)) return L;
  }
  return null;
}
const Zp = 1 / Math.cos(Kc / 2 * (Math.PI / 180)), Il = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function Gp(t, e, n = Xc) {
  const i = Bp(t, e), o = co(e.props.kind);
  if (!i || !o) return [];
  const s = n(t, o), r = qp(t, e, s);
  if (!r) return [];
  const l = Math.max(...i.map((h) => z(h, r))) * Zp, a = Xs(r, s, l);
  if (a.length === 0) return [i];
  const u = Vp(r, a, l);
  let p;
  try {
    p = Mc.intersection(ms(Il(i)), ms(Il(u)));
  } catch {
    return [u];
  }
  return p.flatMap((h) => h.map(Cc));
}
function Kp(t, e, n, i) {
  const o = ae(t, e);
  if (!o) return !1;
  const s = e.props;
  if (s.kind === "ceiling_light" && s.shape === "linear") {
    const l = Math.max(-s.length / 2, Math.min(s.length / 2, Y(P(n, o.pt), o.dir)));
    return z(R(o.pt, N(o.dir, l)), n) <= i;
  }
  if (s.kind === "ceiling_light" && s.shape === "round") return z(o.pt, n) <= s.diameter / 2 + i;
  if (s.kind !== "equipment") return z(o.pt, n) <= i;
  if (s.shape === "circle") return z(o.pt, n) <= s.diameter / 2 + i;
  const r = P(n, o.pt);
  return Math.abs(Y(r, o.dir)) <= s.width / 2 + i && Math.abs(Y(r, re(o.dir))) <= s.depth / 2 + i;
}
function eu(t, e, n) {
  const i = t.devices;
  for (const o of [!1, !0])
    for (let s = i.length - 1; s >= 0; s--)
      if (i[s].props.kind === "equipment" === o && Kp(t, i[s], e, n)) return i[s].id;
  return null;
}
const Xp = 60;
function bs(t, e, n) {
  if (!wc.has(e.props.kind)) return null;
  const i = ae(t, e);
  return i ? { from: i.pt, to: R(i.pt, N(i.dir, Xp / n)) } : null;
}
function tu(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function Yp(t, e, n, i) {
  const o = e.placement, s = ae(t, e);
  if (o.mode === "none" || !s || n.x === s.pt.x && n.y === s.pt.y) return o;
  const r = We(P(n, s.pt)), l = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (o.mode === "free") return { ...o, rotation: Ys(l(r)) };
  const a = Yc(r - We(s.normal)), u = Math.max(-Ht, Math.min(Ht, l(a)));
  return tu(o, u);
}
const Qp = 1, Ci = 1, El = 1e-6, Jp = 1e-9, ef = 1e-6, tf = 1;
function Js(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = xt(t, e.wallId);
      return n === null ? null : In(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function he(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => Js(t, i) ?? { x: i.x, y: i.y });
}
function er(t, e) {
  const n = he(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(He(n)) / 1e5) / 10;
}
function an(t, e, n) {
  const i = de(P(e, t), P(n, t));
  return Math.abs(i) <= Jp * z(t, e) * z(t, n) ? 0 : Math.sign(i);
}
const Gn = (t, e, n) => Y(P(e, t), P(n, t)) <= 0;
function nu(t, e, n, i) {
  const o = an(n, i, t), s = an(n, i, e), r = an(t, e, n), l = an(t, e, i);
  return o * s < 0 && r * l < 0 ? !0 : r === 0 && Gn(n, t, e) || l === 0 && Gn(i, t, e) || o === 0 && Gn(t, n, i) || s === 0 && Gn(e, n, i);
}
function nf(t) {
  const e = [];
  for (const n of t) (e.length === 0 || z(e[e.length - 1], n) > El) && e.push(n);
  for (; e.length > 1 && z(e[0], e[e.length - 1]) <= El; ) e.pop();
  return e;
}
function Ii(t) {
  const e = nf(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const o = e[i], s = e[(i + 1) % n], r = e[(i + 2) % n];
    if (an(o, s, r) === 0 && Y(P(s, o), P(r, s)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && nu(o, s, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function iu(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((s) => s.kind === "free" ? s.lost === !0 : Js(t, s) === null)) return "lost";
  const i = (s) => {
    if (s.kind !== "wall") return !1;
    const r = xt(t, s.wallId);
    return r !== null && (s.offset < -Ci || s.offset > r + Ci);
  };
  if (n.vertices.some(i)) return "beyond";
  const o = he(t, e);
  return Math.abs(He(o)) < tf || Ii(o) ? "crossing" : null;
}
function Gt(t, e) {
  return zt(e, t) || t.some((n, i) => Ve(e, n, t[(i + 1) % t.length]) <= Qp);
}
const ou = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function of(t, e) {
  const n = ae(t, e);
  return n ? t.zones.filter((i) => Gt(he(t, i), n.pt)).map((i) => ({ zone: i, participates: ou(e, i.id) })) : [];
}
function Ze(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n) return [];
  const i = he(t, n), o = [];
  for (const s of t.devices) {
    const r = ae(t, s);
    r && Gt(i, r.pt) && o.push({ device: s, participates: ou(s, e) });
  }
  return o;
}
function sf(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = He(t);
  if (Math.abs(n) > ef) {
    let i = 0, o = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], u = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * u, o += (l.y + a.y) * u;
    }
    const s = { x: i / (6 * n), y: o / (6 * n) };
    if (zt(s, t)) return s;
  }
  return {
    x: t.reduce((i, o) => i + o.x, 0) / e,
    y: t.reduce((i, o) => i + o.y, 0) / e
  };
}
const Po = 32;
function Ol(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let o = 0; o < i.length; o++) n = Math.min(n, Ve(t, i[o], i[(o + 1) % i.length]));
  return n;
}
function su(t) {
  const e = t.zones.map((o) => he(t, o)), n = e.map((o) => Math.abs(He(o))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((o, s) => {
    const r = e[s];
    if (r.length < 3) return;
    const l = e.filter((w, v) => v !== s && w.length >= 3 && n[v] < n[s] && w.every((b) => Gt(r, b))), a = sf(r);
    if (l.length === 0) {
      i.set(o.id, a);
      return;
    }
    const u = r.map((w) => w.x), p = r.map((w) => w.y), h = Math.min(...u), d = Math.min(...p), f = Math.max(Math.max(...u) - h, Math.max(...p) - d) / Po;
    let m = null;
    for (let w = h + f / 2; w < h + f * Po; w += f)
      for (let v = d + f / 2; v < d + f * Po; v += f) {
        const b = { x: w, y: v };
        if (!zt(b, r) || l.some((k) => zt(b, k))) continue;
        const y = Math.min(Ol(b, [r]), Ol(b, l));
        (!m || y > m.d) && (m = { p: b, d: y });
      }
    i.set(o.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const tr = 3, Bt = (t, e) => ({ ...t, zones: e }), En = (t, e, n) => Bt(t, t.zones.map((i) => i === e ? n : i)), nr = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), ru = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function rf(t, e) {
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
function lf(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && ru(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => rf(n, e.vertices[i]));
}
function lu(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && lf(t.shape, e.shape);
}
function af(t, e) {
  if (e.kind === "free") return e;
  const n = Js(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : nr(e);
}
function au(t, e) {
  const n = e.shape, i = n.vertices.map((o) => af(t, o));
  return i.some((o, s) => o !== n.vertices[s]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function cf(t, e, n) {
  const i = t.shape, o = gs(e, i.seed);
  return !o || n.some((s) => Gc(s, o)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(o), !i.broken && ru(o, i.outline) ? t : { ...t, shape: { ...i, outline: o, broken: !1 } });
}
function cu(t, e) {
  const n = iu(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const ir = (t, e) => cu(t, au(t, e));
function uf(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((s) => s.shape.kind === "walls") ? Zc(t) : [], i = [], o = e.map((s) => cu(
    t,
    s.shape.kind === "walls" ? cf(s, n, i) : au(t, s)
  ));
  return o.some((s, r) => s !== e[r]) ? Bt(t, o) : t;
}
function df(t, e) {
  const n = t.zones, i = e.zones, o = n.map((s) => {
    const r = i.find((l) => l.id === s.id);
    return r && r !== s && lu(r, s) ? r : s;
  });
  return o.length === i.length && o.every((s, r) => s === i[r]) ? n === i ? t : Bt(t, i) : o.some((s, r) => s !== n[r]) ? Bt(t, o) : t;
}
function hf(t, e, n) {
  const i = Zc(t), o = gs(i, e);
  if (!o) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = gs(i, r.shape.seed);
    if (l && Gc(l, o)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const s = { id: oe(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: o, broken: !1 }, invalid: !1 };
  return { level: Bt(t, [...t.zones, s]), zoneId: s.id, existing: !1 };
}
const or = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function pf(t, e, n) {
  if (e.length < tr) return { level: t, zoneId: null };
  const i = ir(t, { id: oe(), name: n, shape: { kind: "polygon", vertices: e.map(or) }, invalid: !1 });
  return Ii(he(t, i)) ? { level: t, zoneId: null } : { level: Bt(t, [...t.zones, i]), zoneId: i.id };
}
function ff(t, e, n) {
  const i = t.zones.find((o) => o.id === e);
  return !i || i.name === n ? t : En(t, i, { ...i, name: n });
}
function sr(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return En(t, i, { ...i, automation: !1 });
  const { automation: o, ...s } = i;
  return En(t, i, s);
}
function uu(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function du(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var o;
    return (o = i.zoneBlacklist) != null && o.includes(e) ? uu(i, i.zoneBlacklist.filter((s) => s !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, o) => i !== t.devices[o]) ? n : t.devices
  };
}
function rr(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function lr(t, e, n) {
  const i = ir(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return lu(i, e) ? t : En(t, e, i);
}
const ar = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function mf(t, e, n, i) {
  const o = rr(t, e);
  return !o || !ar(n, o.shape.vertices.length) ? t : lr(t, o, o.shape.vertices.map((s, r) => r === n ? or(i) : s));
}
function gf(t, e, n, i) {
  const o = rr(t, e);
  if (!o || !ar(n, o.shape.vertices.length + 1)) return t;
  const s = [...o.shape.vertices];
  return s.splice(n, 0, or(i)), lr(t, o, s);
}
function bf(t, e, n) {
  const i = rr(t, e);
  return !i || i.shape.vertices.length <= tr || !ar(n, i.shape.vertices.length) ? t : lr(t, i, i.shape.vertices.filter((o, s) => s !== n));
}
function vf(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < tr) return t;
  const i = n.shape.outline.map(nr);
  return En(t, n, ir(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function hu(t, e, n, i) {
  const o = t.devices.find((l) => l.id === e);
  if (!o) return t;
  const s = o.zoneBlacklist ?? [];
  if (s.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = uu(o, i ? s.filter((l) => l !== n) : [...s, n]);
  return { ...t, devices: t.devices.map((l) => l === o ? r : l) };
}
const On = 1;
function ze(t) {
  return structuredClone(t);
}
function uo(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function wf(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function ho(t, e, n) {
  const i = ne(t, e.a), o = ne(t, e.b), s = z(i, o), r = wf(typeof n == "number" ? n : oo(n, i, o) * s, 0, s);
  return { pt: s === 0 ? i : kc(i, o, r / s), offset: r };
}
function $f(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const o = t.walls.find((l) => l.id === i.host.wallId);
      if (!o) continue;
      const { pt: s, offset: r } = ho(t, o, i);
      (Math.abs(i.x - s.x) > 1e-9 || Math.abs(i.y - s.y) > 1e-9) && (n = !0), i.x = s.x, i.y = s.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function pu(t, e) {
  $f(t), e && Mf(e, t);
  const n = uf(qc(Bn(t)));
  return e ? df(n, e) : n;
}
function Ge(t, e) {
  return pu(ze(t), e);
}
function fu(t, e, n) {
  const i = so(t, e), o = i.host && t.walls.find((s) => s.id === i.host.wallId);
  if (i.host && o) {
    const { pt: s, offset: r } = ho(t, o, n);
    i.host.offset = r, i.x = s.x, i.y = s.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Dl(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: ne(t, e.nodeId), nodeId: e.nodeId };
  const n = uo(t, e.wallId), { pt: i, offset: o } = ho(t, n, e.offset), s = z(ne(t, n.a), ne(t, n.b));
  return o <= On ? { pt: ne(t, n.a), nodeId: n.a } : s - o <= On ? { pt: ne(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: o } };
}
function Nl(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: oe(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function yf(t, e, n, i) {
  const o = Dl(t, e), s = Dl(t, n);
  if (z(o.pt, s.pt) < On) return { level: t, wallId: null, endNodeId: null };
  const r = ze(t), l = Nl(r, o), a = Nl(r, s);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const u = { id: oe(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(u), { level: Ge(r, t), wallId: u.id, endNodeId: a };
}
function mu(t, e, n, i) {
  const o = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, s = Math.min(t.x, e.x) - o, r = Math.max(t.x, e.x) + o, l = Math.min(t.y, e.y) - o, a = Math.max(t.y, e.y) + o;
  return r - s < On || a - l < On ? null : [{ x: s, y: l }, { x: r, y: l }, { x: r, y: a }, { x: s, y: a }];
}
function kf(t, e, n, i, o) {
  const s = mu(e, n, i.thickness, o);
  if (!s) return t;
  const r = ze(t), l = s.map((a) => {
    const u = { id: oe(), x: a.x, y: a.y };
    return r.nodes.push(u), u.id;
  });
  for (let a = 0; a < 4; a++)
    r.walls.push({
      id: oe(),
      a: l[a],
      b: l[(a + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return Ge(r, t);
}
function xf(t, e, n) {
  const i = ze(t);
  return fu(i, e, n), pu(i, t);
}
function Mf(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const o = t.walls.find((h) => h.id === i.id);
    if (!o || o.a !== i.a) continue;
    const s = t.nodes.find((h) => h.id === o.a), r = t.nodes.find((h) => h.id === o.b), l = e.nodes.find((h) => h.id === i.a), a = e.nodes.find((h) => h.id === i.b);
    if (!s || !r || !l || !a || s.x === l.x && s.y === l.y) continue;
    const u = z(l, a);
    if (u === 0) continue;
    const p = io(P(r, s));
    for (const h of n)
      h.wallId === i.id && (h.offset = oo(R(s, N(p, h.offset)), l, a) * u);
  }
}
function _f(t, e, n) {
  const i = ze(t), o = uo(i, e), r = (o.a === o.b ? [o.a] : [o.a, o.b]).map((l) => ({ id: l, to: R(ne(i, l), n) }));
  for (const l of r) fu(i, l.id, l.to);
  return Ge(i, t);
}
function po(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function gu(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const o of i.shape.vertices) o.kind === "node" && o.nodeId === e && (o.nodeId = n);
}
function Af(t, e, n) {
  const i = ze(t), o = uo(i, e), s = o[n], r = ne(i, s), l = { id: oe(), x: r.x, y: r.y };
  return i.nodes.push(l), o[n] = l.id, i.walls.some((a) => a.a === s || a.b === s) || gu(i, s, l.id), po(i), { level: Ge(i, t), nodeId: l.id };
}
function Sf(t, e, n) {
  if (e === n) return t;
  const i = ze(t);
  for (const s of i.walls)
    s.a === e && (s.a = n), s.b === e && (s.b = n);
  const o = new Set(i.walls.filter((s) => s.a === s.b).map((s) => s.id));
  i.walls = i.walls.filter((s) => !o.has(s.id)), i.openings = i.openings.filter((s) => !o.has(s.wallId)), i.devices = i.devices.filter((s) => s.placement.mode !== "wall" || !o.has(s.placement.wallId));
  for (const s of i.nodes) s.host && o.has(s.host.wallId) && delete s.host;
  return gu(i, e, n), i.nodes = i.nodes.filter((s) => s.id !== e), po(i), Ge(i, t);
}
function cr(t, e) {
  var i;
  const n = ze(t);
  n.walls = n.walls.filter((o) => o.id !== e), n.openings = n.openings.filter((o) => o.wallId !== e), n.devices = n.devices.filter((o) => o.placement.mode !== "wall" || o.placement.wallId !== e);
  for (const o of n.nodes) ((i = o.host) == null ? void 0 : i.wallId) === e && delete o.host;
  return po(n), Ge(n, t);
}
function Lf(t, e, n) {
  const i = ze(t);
  return Object.assign(uo(i, e), n), Ge(i, t);
}
const ye = (t) => typeof t == "string" && t !== "" ? t : null, bu = (t) => t.split(".")[0], Cf = ["friendly_name", "device_class", "unit_of_measurement"];
function vu(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: bu(t),
    name: ye(n.friendly_name) ?? t,
    deviceClass: ye(n.device_class),
    unit: ye(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function If(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, vu(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Ef(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const o = t[i], s = e[i];
    if (o === s) continue;
    if (!o || !s) return !1;
    const r = o.attributes ?? {}, l = s.attributes ?? {};
    if (r !== l && Cf.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function ur(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Of(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, o] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), s = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = vu(r.entity_id, {});
    s.set(r.entity_id, {
      ...l,
      name: ye(r.name) ?? ye(r.original_name) ?? l.name,
      deviceId: ye(r.device_id),
      areaId: ye(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: ye(r.entity_category)
    });
  }
  return {
    entities: s,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: ye(r.name_by_user) ?? ye(r.name) ?? r.id, model: ye(r.model), areaId: ye(r.area_id) }])),
    areas: new Map(o.map((r) => [r.area_id, r.name]))
  };
}
function Df(t, e) {
  const n = new Map(e.entities);
  for (const [i, o] of t.entities) {
    const s = e.entities.get(i);
    n.set(i, s ? { ...s, name: o.name !== i ? o.name : s.name, deviceClass: o.deviceClass ?? s.deviceClass, unit: o.unit ?? s.unit } : o);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function wu(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const o = i.disabled ? null : ur(n, e);
  return o === null || o === "unavailable" ? "unavailable" : "present";
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
  "tool.virtual_switch": "Virtual switch",
  "tool.equipment": "Device",
  "tool.climate_sensor": "Climate sensor",
  "tool.exhaust_fan": "Exhaust fan",
  "tool.speaker": "Speaker",
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
  "role.player": "Player",
  "role.voice": "Voice",
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
  "power.hint.none": "no reports yet",
  "power.hint.every": "every ~{period}",
  "power.hint.last": "last {age} ago",
  "power.hint.next": "next in ~{left}",
  "power.hint.overdue": "next expected {over} ago",
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
  "device.virtual_switch": "Virtual switch",
  "virtual.state": "State: {s}",
  "virtual.hint": "Kept by Plan Studio, not by Home Assistant: it has no entity to bind. Automations switch it and read it, for example to block a light.",
  "device.equipment": "Device",
  "device.climate_sensor": "Climate sensor",
  "device.exhaust_fan": "Exhaust fan",
  "device.speaker": "Speaker",
  "device.phone": "Phone",
  "speaker.hint": "Player plays files and says text; the Voice (a text-to-speech entity) is only needed to say text.",
  "phone.notify": "Notify service",
  "phone.pick": "Pick a service…",
  "phone.missing": "Home Assistant no longer offers this service.",
  "phone.noServices": "Home Assistant offers no notify services.",
  "phone.hint": "Rules push a message to this phone through the notify service. It is not on the plan.",
  "devices.unplaced": "Not on the plan",
  "devices.new": "New device",
  "devices.newVirtual": "New virtual switch",
  "devices.newSpeaker": "New speaker",
  "devices.newPhone": "New phone",
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
  "update.notice": "Plan Studio was updated on the server ({version}). Reload the page to use it.",
  "update.reload": "Reload",
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
  "rules.template.motionLight": "Light motion control",
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
  "control.do.say": "say",
  "control.do.play": "play",
  "control.do.notify": "notify",
  "control.group.events": "Events",
  "control.event.auto": "entered auto",
  "control.event.manual": "entered manual",
  "control.event.done": "heating done",
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
  "motionLight.title": "Light motion control",
  "motionLight.hint": "The button sets the mode: its toggle (or on / off) switches the light by hand, its Auto action hands the light to the automation. Without a button the rule is always in auto. Auto: motion on any of the sensors switches the light on (only when it is dark, if a light sensor is set) and it goes off after the time without motion, but not before the minimum on time; when the light sensor reports day (or light), the light goes off at once. While the blocking device is in its state, the light is off and motion does nothing. Without motion sensors auto does nothing. A switch of the light by other means does not change the mode.",
  "motionLight.light": "Light",
  "motionLight.sensors": "Motion sensors",
  "motionLight.addSensor": "Add a motion sensor…",
  "motionLight.blocker": "Blocked while",
  "motionLight.blockerNone": "— (never)",
  "motionLight.blockerIsOn": "is on",
  "motionLight.blockerIsOff": "is off",
  "motionLight.blockerNote": "The light goes off and motion does nothing while the device is in that state (manual is not blocked).",
  "motionLight.daylight": "Only when dark",
  "motionLight.noDaylight": "— always —",
  "motionLight.isNight": "is night",
  "motionLight.isDark": "is dark",
  "motionLight.off": "Off after, s",
  "motionLight.offNote": "without motion",
  "motionLight.minOn": "Minimum on time, s",
  "motionLight.buttons": "Buttons",
  "motionLight.addButton": "Add a button…",
  "motionLight.buttonsNote": "none = always auto",
  "motionLight.noDoubleToggle": "This switch cannot return auto: turn on Auto by double toggle in Binding.",
  "motionLight.sensorsNote": "none = auto does nothing",
  "motionLight.autoAfter": "Auto again after, min",
  "motionLight.autoAfterNote": "0 = never",
  "motionLight.problem.light": "Choose the light",
  "motionLight.flow.title": "Light motion control diagram",
  "motionLight.flow.motion": "motion",
  "motionLight.flow.clear": "clear",
  "motionLight.flow.noData": "no data",
  "motionLight.flow.daylight": "Daylight",
  "motionLight.flow.wants": "Wants",
  "motionLight.flow.rule": "on at motion{dark}, off {d} after it ends",
  "motionLight.flow.ruleDark": " when dark",
  "motionLight.flow.ruleMin": ", at least {d} on",
  "motionLight.flow.offIn": "off in {t}",
  "motionLight.flow.minOn": "minimum on {t}",
  "motionLight.flow.mode": "Mode",
  "motionLight.flow.auto": "auto",
  "motionLight.flow.manual": "manual",
  "motionLight.flow.autoIn": "auto again in {t}",
  "motionLight.flow.lastAuto": "last: back to auto {at} (button)",
  "motionLight.flow.lastAutoAgain": "last: back to auto {at} (no motion)",
  "motionLight.flow.lastManualButton": "last: manual {at} (button)",
  "motionLight.flow.lastReleased": "last: switched off elsewhere {at}, waits for new motion",
  "motionLight.flow.lastFound": "last: found on {at}",
  "motionLight.flow.lastAutoOff": "last: turned off {at} (back to auto: no motion)",
  "motionLight.flow.lastAutoOffLight": "last: turned off {at} (back to auto: it is light)",
  "motionLight.flow.lastAutoOn": "last: turned on {at} (back to auto: motion)",
  "motionLight.flow.lastBlocked": "last: turned off {at} (blocked)",
  "motionLight.flow.lastUnblockedOn": "last: turned on {at} (unblocked: motion)",
  "motionLight.flow.lastUnblockedOff": "last: turned off {at} (unblocked: no motion)",
  "motionLight.flow.lastUnblockedLight": "last: turned off {at} (unblocked: not dark)",
  "motionLight.flow.lastDaylight": "last: turned off {at} (daylight)",
  "motionLight.flow.blocked": "blocked by {name}",
  "motionLight.flow.ruleDay": "off at once when daylight comes",
  "motionLight.flow.blockerNow": "now {s}",
  "motionLight.flow.noSensors": "no motion sensors: auto does nothing",
  "motionLight.flow.autoNoButton": "auto (no button)",
  "motionLight.flow.waiting": "waiting for new motion",
  "motionLight.flow.byButton": "back to auto: a button's Auto action",
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
  "boiler.flow.settling": "limit not judged until the meters report ({left})",
  "boiler.flow.headroom": "Headroom",
  "boiler.flow.formula": "grid + {nominal} - boiler",
  "boiler.flow.ok": "ok",
  "boiler.flow.over": "over the limit",
  "boiler.flow.notJudged": "not judged",
  "boiler.flow.mode": "Mode",
  "boiler.flow.button": "button: {name}",
  "boiler.flow.relay": "Relay",
  "boiler.flow.power": "Boiler power",
  "boiler.flow.nominal": "nominal {w} W",
  "boiler.flow.done": "done at ≤ 1 W",
  "rules.problem.boiler-auto": "This button has no Auto action: enable it in the button's properties",
  "rules.problem.boiler": "Boiler: a boiler and a button; Limit and Boiler power above 0 W.",
  "rules.problem.outside": "Outside light: pick a light that can be switched on and a different daylight sensor, a time window with different From and To, and a pause of 0 to 1440 minutes.",
  "rules.problem.motionLight": "Light motion control: pick a light that can be switched on and off, buttons and motion sensors each only once, and whole numbers in range.",
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
  "rules.error.notConfirmed": "not confirmed by the device",
  "rules.error.virtualLoop": "virtual switch loop: changes refused for 10 s",
  "rules.unsaved": "Not saved yet",
  "rules.unsavedChanges": "Unsaved changes",
  "rules.noTrace": "Waiting for live state",
  "live.noTrigger": "{action}: no trigger",
  "live.mode.autoOn": "auto: on",
  "live.mode.autoOff": "auto: off",
  "rules.unknown1": "1 input without data",
  "rules.unknownN": "{n} inputs without data",
  "rules.did.on": "turned on",
  "rules.did.off": "turned off",
  "rules.did.open": "opened",
  "rules.did.close": "closed",
  "rules.did.say": "said",
  "rules.did.play": "played",
  "rules.did.notify": "notified",
  "rules.last.elsewhere": "{target} switched {s} elsewhere {at}",
  "rules.last.already": "{target} already {s} {at}",
  "motionLight.row.auto": "{target} back to auto {at} (button)",
  "motionLight.row.autoAgain": "{target} back to auto {at} (no motion)",
  "motionLight.row.manualButton": "{target} manual {at} (button)",
  "motionLight.row.releasedOff": "{target} switched off elsewhere {at}: waits for new motion",
  "motionLight.row.found": "{target} found on {at}",
  "motionLight.row.autoOff": "{target} turned off {at} (back to auto: no motion)",
  "motionLight.row.autoOffLight": "{target} turned off {at} (back to auto: it is light)",
  "motionLight.row.autoOn": "{target} turned on {at} (back to auto: motion)",
  "motionLight.row.blocked": "{target} turned off {at} (blocked)",
  "motionLight.row.unblockedOn": "{target} turned on {at} (unblocked: motion)",
  "motionLight.row.unblockedOff": "{target} turned off {at} (unblocked: no motion)",
  "motionLight.row.unblockedLight": "{target} turned off {at} (unblocked: not dark)",
  "motionLight.row.daylight": "{target} turned off {at} (daylight)",
  "motionLight.noAutoNote": 'No button here has an Auto action and "Auto again after" is 0: after a press the rule stays manual until it is changed.',
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
  "rules.act.say": "Say",
  "rules.act.play": "Play",
  "rules.act.notify": "Notify",
  "rules.field.text": "Text",
  "rules.field.media": "Media",
  "rules.field.title": "Title (optional)",
  "rules.announce.noVoice": "Bind a voice to say text",
  "rules.problem.announce": "Say and notify need a text, play needs a media id; a title is optional but not empty.",
  "rules.val.true": "true",
  "rules.val.false": "false",
  "rules.val.unknown": "no data",
  "rules.problem.name": "Give the rule a name.",
  "rules.problem.virtual-read": "a rule must not switch a virtual switch it reads as an input",
  "rules.problem.inputs": "Add at least one input.",
  "rules.problem.device-missing": "A device of this rule is no longer on the plan.",
  "rules.problem.rule-missing": "A rule this rule reads (an input or an event source) no longer exists.",
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
function c(t) {
  return Nf[t] ?? t;
}
const Pf = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Tf = 10;
function Kt(t, e) {
  const n = (i, o) => ({ name: i, dir: o });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Zt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function $u() {
  return { blocks: [{ id: oe(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Vf(t, e, n, i) {
  const o = { id: oe(), x: e.x, y: e.y }, s = { ...o, name: `${c(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
  switch (t) {
    case "device":
      return { ...o, kind: t, deviceId: i ?? "", output: !1 };
    case "bus":
      return { ...s, kind: t, w: 240, h: 12 };
    case "transfer":
      return { ...s, kind: t, form: "2in1out" };
    default:
      return { ...s, kind: t };
  }
}
function Pl(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function fo(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Hf(t, e, n, i) {
  return fo(t, e, (o) => ({ ...o, x: n, y: i }));
}
const vs = (t) => "block" in t ? t.block : t.bus, yu = (t, e) => vs(t.from) === e || vs(t.to) === e;
function Dn(t, e, n, i) {
  const o = t.blocks.find((u) => u.id === e);
  if (!o) return t;
  const s = fo(t, e, (u) => ({ ...u, ...n }));
  if (o.kind === "transfer" && "form" in n && n.form !== o.form)
    return { ...s, wires: s.wires.filter((u) => !yu(u, e)) };
  const r = s.blocks.find((u) => u.id === e), l = new Set(Kt(r, i).map((u) => u.name)), a = (u) => "block" in u && u.block === e && !l.has(u.port);
  return s.wires.some((u) => a(u.from) || a(u.to)) ? { ...s, wires: s.wires.filter((u) => !a(u.from) && !a(u.to)) } : s;
}
function ku(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !yu(i, e)) };
}
const xu = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function mo(t, e, n) {
  const i = xu(t, e);
  if (i.size === 0) return t;
  const o = new Map(t.blocks.filter((u) => i.has(u.id)).map((u) => [u.id, new Set(Kt(u, n).map((p) => p.name))])), s = (u) => "block" in u && !!o.get(u.block) && !o.get(u.block).has(u.port), r = t.wires.filter((u) => !s(u.from) && !s(u.to));
  let l = !1;
  const a = t.blocks.map((u) => {
    const p = o.get(u.id);
    if (!p || !u.portPins || Object.keys(u.portPins).every((m) => p.has(m))) return u;
    l = !0;
    const h = Object.fromEntries(Object.entries(u.portPins).filter(([m]) => p.has(m))), { portPins: d, ...f } = u;
    return Object.keys(h).length ? { ...f, portPins: h } : f;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function zf(t, e) {
  const n = dr(e), i = new Set(t.blocks.flatMap((s) => s.kind === "device" ? [s.deviceId] : []));
  let o = t;
  for (const s of i) o = mo(o, s, n);
  return o;
}
function Rf(t, e) {
  const n = xu(t, e);
  if (n.size === 0) return t;
  const i = (o) => n.has(vs(o));
  return {
    ...t,
    blocks: t.blocks.filter((o) => !n.has(o.id)),
    wires: t.wires.filter((o) => !i(o.from) && !i(o.to))
  };
}
const dr = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Mu(t, e, n) {
  var s;
  const i = ((s = t.devices.find((r) => r.id === n)) == null ? void 0 : s.placement.mode) === "none", o = Np(t, n);
  return { level: o, power: i ? Rf(e, n) : mo(e, n, dr(o)) };
}
function _u(t, e, n, i) {
  const o = Wc(t, n, i);
  return { level: o, power: o === t ? e : mo(e, n, dr(o)) };
}
function Au(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function Bf(t, e, n, i) {
  return fo(t, e, (o) => {
    const s = { ...o.portPins };
    i ? s[n] = i : delete s[n];
    const { portPins: r, ...l } = o;
    return Object.keys(s).length ? { ...l, portPins: s } : l;
  });
}
function Ff(t, e) {
  return fo(t, e, (n) => {
    const { portPins: i, ...o } = n;
    return o;
  });
}
function Tl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Uf(t, e) {
  const n = t.filter((s) => s.kind === "transfer"), i = n.slice(0, Tf), o = /* @__PURE__ */ new Map();
  for (const s of n) s.kind === "transfer" && o.set(s.id, s.form === "2in1out" ? "OUT" : "IN");
  for (let s = 0; s < 1 << i.length; s++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((p, h) => r.set(p.id, s & 1 << h ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (p) => {
      let h = p;
      for (; l.has(h) && l.get(h) !== h; ) h = l.get(h);
      return h;
    }, u = (p, h) => {
      if ("bus" in p) return `n:${p.bus}`;
      const d = o.get(p.block);
      return d !== void 0 && p.port !== d && p.port !== (r.get(p.block) ?? "A") ? `x:${h.id}:${p.port}` : `n:${p.block}`;
    };
    for (const p of e) {
      const h = a(u(p.from, p)), d = a(u(p.to, p));
      if (h === d) return !0;
      l.set(h, d);
    }
  }
  return !1;
}
function Vl(t, e, n, i) {
  const o = new Map(t.blocks.map((b) => [b.id, b])), s = (b) => {
    if ("bus" in b) {
      const M = o.get(b.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = o.get(b.block), k = y ? Kt(y, i).find((M) => M.name === b.port) : void 0;
    return y && k ? { bl: y, dir: k.dir } : null;
  }, r = s(e), l = s(n);
  if (!r || !l) return { error: "missing" };
  if (r.bl.id === l.bl.id) return { error: "same-block" };
  let a = e, u = n;
  if (r.dir === null || l.dir === null)
    (r.dir === "in" || l.dir === "out") && (a = n, u = e);
  else {
    if (r.dir === l.dir)
      return { error: "direction" };
    r.dir === "in" && (a = n, u = e);
  }
  const p = (b) => "block" in b && t.wires.some((y) => [y.from, y.to].some((k) => "block" in k && k.block === b.block && k.port === b.port));
  if (p(a) || p(u)) return { error: "port-taken" };
  const h = (b) => {
    for (const y of t.wires)
      for (const [k, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in k && k.bus === b && "block" in M) {
          const x = o.get(M.block);
          if (x) return Tl(x, M.port);
        }
    return null;
  }, d = (b) => "bus" in b ? h(b.bus) : Tl(o.get(b.block), b.port), f = d(a), m = d(u);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in u && o.get(u.block).kind === "remainder" && t.wires.some((b) => {
    var y;
    return "bus" in b.from && b.from.bus === a.bus && "block" in b.to && ((y = o.get(b.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const w = { id: oe(), from: a, to: u }, v = [...t.wires, w];
  return Uf(t.blocks, v) ? { error: "loop" } : { schema: { ...t, wires: v }, wire: w };
}
const Be = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Pt = (t) => typeof t == "number" && Number.isFinite(t), Wf = ["top", "right", "bottom", "left"], jf = ["2in1out", "1in2out"];
function qf(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Pt(n.w) && Pt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !jf.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, o = new Set(Kt(n, e).map((u) => u.name)), s = {};
  let r = Be(i);
  for (const [u, p] of Be(i) ? Object.entries(i) : []) {
    if (!o.has(u) || !Be(p) || !Wf.includes(p.side) || !Pt(p.at)) {
      r = !1;
      continue;
    }
    const h = Math.min(1, Math.max(0, p.at));
    h !== p.at && (r = !1), s[u] = h === p.at ? p : { side: p.side, at: h };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(s).length ? { ...a, portPins: s } : a;
}
function Zf(t, e) {
  if (!Be(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let o = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const s = [], r = /* @__PURE__ */ new Set();
  for (const p of n)
    if (Be(p) && typeof p.id == "string" && p.id && Pf.includes(p.kind) && Pt(p.x) && Pt(p.y)) {
      const h = qf(p, e);
      h !== p && (o = !0), h.kind === "transfer" && h.form !== p.form && r.add(h.id), s.push(h);
    } else o = !0;
  const l = new Map(s.map((p) => [p.id, p])), a = (p) => {
    var d;
    if (!Be(p)) return null;
    if (typeof p.bus == "string") {
      if (((d = l.get(p.bus)) == null ? void 0 : d.kind) !== "bus" || !Pt(p.at)) return null;
      const f = Math.min(1, Math.max(0, p.at));
      return f === p.at ? p : { bus: p.bus, at: f };
    }
    const h = typeof p.block == "string" ? l.get(p.block) : void 0;
    return h && !r.has(h.id) && Kt(h, e).some((f) => f.name === p.port) ? p : null;
  }, u = [];
  for (const p of i) {
    const h = Be(p) ? a(p.from) : null, d = Be(p) ? a(p.to) : null;
    if (!Be(p) || typeof p.id != "string" || !p.id || !h || !d) {
      o = !0;
      continue;
    }
    h === p.from && d === p.to ? u.push(p) : (o = !0, u.push({ ...p, from: h, to: d }));
  }
  return o ? { ...t, blocks: s, wires: u } : t;
}
function Su(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var o, s;
    return !n.has(i.id) && i.props.kind !== "virtual_switch" && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((o = i.bindings) != null && o.power) || !!((s = i.bindings) != null && s.control));
  }).sort((i, o) => i.name.localeCompare(o.name) || i.id.localeCompare(o.id));
}
function Gf(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Fn = 11, Ei = 18, Oi = 30, Kf = 12, Xf = 120, be = 14, Hl = 10, Nn = (t) => Math.round(t / Hl) * Hl || 0, To = 24, zl = 6, Yf = 2 * Fn + 6, Qf = be, Jf = 1e6, Rl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, go = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Vo = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Lu = (t) => Math.min(1, Math.max(0, t));
function bo(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function em(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const o = i.bindings ?? {}, s = Zt(i);
      return n(s ? o.power_in : o.power, s && o.power_out, o.voltage, o.control, s);
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
  return n ? fr(n, t, e).r : hr(t, e);
}
function hr(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(Xf, 7 * bo(t, e).length + 32),
    h: Oi + Ei * em(t, e) + Kf
  };
}
function Di(t, e, n) {
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
function tm(t, e) {
  const n = go(t), i = e.x - n.x, o = e.y - n.y;
  return i === 0 && o === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(o) / (t.h / 2) ? i > 0 ? "right" : "left" : o > 0 ? "bottom" : "top";
}
function nm(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], o = 1 / 0;
  for (const l of n) {
    const a = Ve(e, l.a, l.b);
    a < o && (i = l, o = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Lu(r) };
}
const Pn = (t) => t.w >= t.h;
function Cu(t, e) {
  return Pn(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function im(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Pn(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Di(i, r, 0.5), side: r };
  }
  const o = go(i), s = Pn(t) ? n.y < o.y ? "top" : "bottom" : n.x < o.x ? "left" : "right";
  return { pt: Di(i, s, e), side: s };
}
function om(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const pr = (t, e) => t.blocks.find((n) => n.id === e), ws = (t, e) => {
  const n = pr(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Ho = (t, e, n) => "block" in t && t.block === e && t.port === n;
function sm(t, e, n, i) {
  const o = t.wires.find((l) => Ho(l.from, e, n) || Ho(l.to, e, n));
  if (!o) return null;
  const s = Ho(o.from, e, n) ? o.to : o.from;
  if ("bus" in s) {
    const l = ws(t, s.bus);
    return l ? Cu(l, s.at) : null;
  }
  const r = pr(t, s.block);
  return r ? go(hr(r, i)) : null;
}
function fr(t, e, n) {
  const i = hr(e, n), o = go(i), s = Kt(e, n).map((u) => {
    var m;
    const p = (m = e.portPins) == null ? void 0 : m[u.name];
    if (p) return { ...u, side: p.side, pin: p, key: 0 };
    const h = sm(t, e.id, u.name, n), d = (h && tm(i, h)) ?? om(e, u), f = h ?? o;
    return { ...u, side: d, pin: void 0, key: d === "top" || d === "bottom" ? f.x : f.y };
  }), r = (u) => {
    const p = s.filter((h) => h.side === u).length;
    return p ? (p + 1) * Yf : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(s.length);
  s.forEach((u, p) => {
    u.pin && (a[p] = { name: u.name, dir: u.dir, side: u.side, pt: Di(l, u.side, u.pin.at), pinned: !0 });
  });
  for (const u of ["top", "right", "bottom", "left"]) {
    const p = s.map((h, d) => ({ p: h, i: d })).filter(({ p: h }) => !h.pin && h.side === u).sort((h, d) => h.p.key - d.p.key || h.i - d.i);
    p.forEach(({ p: h, i: d }, f) => {
      a[d] = { name: h.name, dir: h.dir, side: u, pt: Di(l, u, (f + 1) / (p.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function vo(t, e, n) {
  return fr(t, e, n).places;
}
function Iu(t, e, n) {
  const i = (u) => {
    if (!("block" in u)) return null;
    const p = pr(t, u.block);
    if (!p) return null;
    const { r: h, places: d } = fr(t, p, n), f = d.find((m) => m.name === u.port);
    return f ? { pt: f.pt, side: f.side, rect: h } : null;
  }, o = (u, p, h) => {
    if (!("bus" in u)) return null;
    const d = ws(t, u.bus);
    if (!d) return null;
    let f = h == null ? void 0 : h.pt;
    if (!f && "bus" in p) {
      const m = ws(t, p.bus);
      f = m && Cu(m, p.at);
    }
    return f ? { ...im(d, u.at, f), rect: Ie(d, n, t) } : null;
  }, s = i(e.from), r = i(e.to), l = s ?? o(e.from, e.to, r), a = r ?? o(e.to, e.from, s);
  return l && a ? { a: l, b: a } : null;
}
const Kn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), $s = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function rm(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const u = Kn(i[i.length - 2], a), p = Kn(a, l);
        if (u.x === p.x && u.y === p.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (u.x === -p.x && u.y === -p.y) return null;
      }
      i.push(l);
    }
  }
  const o = i.length;
  if (o < 2 || o > 6) return null;
  const s = Kn(i[0], i[1]), r = Kn(i[o - 2], i[o - 1]);
  return s.x !== e.x || s.y !== e.y || $s(i[0], i[1]) < be - 1e-9 || r.x !== -n.x || r.y !== -n.y || $s(i[o - 2], i[o - 1]) < be - 1e-9 ? null : i;
}
function lm(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function am(t, e) {
  let n = (t.length - 2) * Qf;
  for (let i = 1; i < t.length; i++) {
    n += $s(t[i - 1], t[i]);
    for (const o of e) lm(t[i - 1], t[i], o) && (n += Jf);
  }
  return n;
}
function Eu(t, e) {
  const n = t.pt, i = e.pt, o = Rl[t.side], s = Rl[e.side], r = { x: n.x + o.x * be, y: n.y + o.y * be }, l = { x: i.x + s.x * be, y: i.y + s.y * be }, a = [t.rect, e.rect].filter((k) => !!k), u = (k, M) => [.../* @__PURE__ */ new Set([
    (r[k] + l[k]) / 2,
    r[k],
    l[k],
    n[k],
    i[k],
    ...a.flatMap((x) => [x[k] - be, x[k] + x[M] + be]),
    Math.min(r[k], l[k]) - be,
    Math.max(r[k], l[k]) + be
  ])], p = u("x", "w"), h = u("y", "h"), d = o.x === 0, f = s.x === 0, m = (d ? h : p).filter((k) => (k - (d ? n.y : n.x)) * (d ? o.y : o.x) >= be - 1e-9), w = (f ? h : p).filter((k) => (k - (f ? i.y : i.x)) * (f ? s.y : s.x) >= be - 1e-9);
  let v = null, b = 1 / 0;
  const y = (k) => {
    const M = rm(k, o, s);
    if (!M) return;
    const x = am(M, a);
    x < b - 1e-6 && (v = M, b = x);
  };
  if (d && f)
    for (const k of m) for (const M of p) for (const x of w)
      y([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: x }, { x: i.x, y: x }, i]);
  else if (!d && !f)
    for (const k of m) for (const M of h) for (const x of w)
      y([n, { x: k, y: n.y }, { x: k, y: M }, { x, y: M }, { x, y: i.y }, i]);
  else if (d)
    for (const k of m) for (const M of w)
      y([n, { x: n.x, y: k }, { x: M, y: k }, { x: M, y: i.y }, i]);
  else
    for (const k of m) for (const M of w)
      y([n, { x: k, y: n.y }, { x: k, y: M }, { x: i.x, y: M }, i]);
  return v ?? [n, r, d ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Ou(t, e, n) {
  const i = Ie(t, e, n), o = i.x + (i.w - (3 * To + 2 * zl)) / 2, s = i.y + Oi + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: o + l * (To + zl), y: s, w: To, h: Ei - 2 }
  }));
}
function cm(t) {
  const { x: e, y: n, w: i, h: o } = t;
  return Pn(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + o } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + o } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + o }, b: { x: e + i, y: n + o } }];
}
function ys(t, e, n, i) {
  const o = [...t.blocks].reverse();
  for (const p of o) {
    if (p.kind !== "transfer") continue;
    const h = Ou(p, i, t).find((d) => Vo(e, d.rect, 0));
    if (h) return { kind: "chip", block: p.id, position: h.position };
  }
  let s = null, r = 1 / 0;
  for (const p of o)
    for (const h of vo(t, p, i)) {
      const d = z(e, h.pt);
      d <= Fn + n && d < r && (s = { kind: "port", block: p.id, port: h.name }, r = d);
    }
  if (s) return s;
  for (const p of o) {
    if (p.kind !== "bus") continue;
    let h = null, d = 1 / 0;
    for (const f of cm(p)) {
      const m = Ve(e, f.a, f.b);
      m <= n && m < d && (h = { kind: "bus-end", id: p.id, end: f.end }, d = m);
    }
    if (h) return h;
  }
  for (const p of o) {
    if (p.kind !== "bus" || !Vo(e, Ie(p, i, t), n)) continue;
    const h = Pn(p) ? (e.x - p.x) / p.w : (e.y - p.y) / p.h;
    return { kind: "bus", id: p.id, at: Lu(h) };
  }
  let l = null, a = 1 / 0;
  for (const p of t.wires) {
    const h = Iu(t, p, i);
    if (!h) continue;
    const d = Eu(h.a, h.b);
    for (let f = 1; f < d.length; f++) {
      const m = Ve(e, d[f - 1], d[f]);
      m <= n && m < a && (l = { kind: "wire", id: p.id }, a = m);
    }
  }
  if (l) return l;
  const u = o.find((p) => p.kind !== "bus" && Vo(e, Ie(p, i, t), 0));
  return u ? { kind: "block", id: u.id } : null;
}
function um(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const r of t.blocks) {
    const l = Ie(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), o = Math.max(o, l.x + l.w), s = Math.max(s, l.y + l.h);
  }
  return { x: n, y: i, w: o - n, h: s - i };
}
var Du = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", dm = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", hm = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", pm = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", fm = "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z", mm = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", gm = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", bm = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Bl = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Jt = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", vm = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", wm = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", $m = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", ym = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Nu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", km = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", xm = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Mm = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", Pu = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", _m = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Am = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Tu = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Sm = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Lm = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Vu = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Cm = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Im = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", Hu = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Em = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Om = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", Dm = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Nm = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Pm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Tm = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", Vm = "M18.4 1.6C18 1.2 17.5 1 17 1H7C6.5 1 6 1.2 5.6 1.6C5.2 2 5 2.5 5 3V21C5 21.5 5.2 22 5.6 22.4C6 22.8 6.5 23 7 23H17C17.5 23 18 22.8 18.4 22.4C18.8 22 19 21.5 19 21V3C19 2.5 18.8 2 18.4 1.6M16 7C16 7.6 15.6 8 15 8H9C8.4 8 8 7.6 8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7Z", Hm = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", zm = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Rm = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", Bm = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Fm = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", zu = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", Um = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", Wm = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", jm = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const Ee = "non-scaling-stroke", Tn = "system-ui, sans-serif", qm = 13, hn = 9, Zm = 11, Fl = 18, zo = 12, Ro = 11, Xn = 13, Gm = 3, pi = 10, Ul = 4.5, Km = 12, Xm = 11.5, mr = 10, Bo = 10.5, Ym = 6, Qm = {
  IN: Sm,
  OUT: Vu,
  BAT: Lm,
  PV: Hu
}, Wl = { dead: 0, nodata: 1, idle: 2, live: 3 };
function xe(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Tt = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function Jm(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function Un(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const eg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, tg = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Ru = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${Ee}>${i ? $ : tg}</path>`, Bu = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Ft = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function ng(t, e) {
  var u;
  const n = (u = t.live) == null ? void 0 : u.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (p) => "block" in p ? Fn : hn, o = t.pts[0], s = t.pts[t.pts.length - 1], r = pi / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((p, h) => ({ p: t.pts[h], q: p, len: Math.abs(p.x - t.pts[h].x) + Math.abs(p.y - t.pts[h].y) })).sort((p, h) => h.len - p.len);
  for (const { p, q: h, len: d } of a) {
    if (d < 2 * r + 2 * l) continue;
    const f = { x: (p.x + h.x) / 2, y: (p.y + h.y) / 2 }, m = (v, b) => Math.hypot(f.x - v.x, f.y - v.y) >= b + r + l;
    if (!m(o, i(t.w.from)) || !m(s, i(t.w.to))) continue;
    const w = Math.atan2(h.y - p.y, h.x - p.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((w + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function ig(t, e, n) {
  var u;
  const i = e.palette, o = Un(t.style, i), s = Bu(t.pts), r = ((u = e.selection) == null ? void 0 : u.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = ng(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${s} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${Ee}></path>` : $}
    ${t.style === "live" ? Ru("glow", s, o, n) : $}
    <path class=${`wire ${t.style}`} d=${s} fill="none" stroke=${o} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : $} stroke-linejoin="round" vector-effect=${Ee}></path>
    ${a ? _`<path class="arrow" d=${`M${pi / 2} 0L${-pi / 2} ${-Ul}L${-pi / 2} ${Ul}Z`}
      fill=${o} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : $}
  </g>`;
}
function og(t, e, n) {
  const i = Qm[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Fn} fill=${n.portFill}
      stroke=${e ? Un(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${Ee}></circle>
    ${i ? Ft(i, t.pt, qm, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Tn}>${t.name}</text>`}
  </g>`;
}
function sg(t, e) {
  const n = Math.max(4, Math.floor(e / (mr * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function rg(t, e, n, i) {
  const o = e.map((l) => {
    const a = t.blocks.find((u) => u.id === l);
    return a ? bo(a, n) || c(`power.kind.${a.kind}`) : l;
  }), s = c("power.absorbed.one");
  return { kind: "text", value: o.length === 1 ? s.replace("{name}", sg(o[0], i - 12 - s.replace("{name}", "").length * mr * 0.55)) : c("power.absorbed.many").replace("{n}", String(o.length)), small: !0, title: o.join(", ") };
}
function lg(t, e, n, i, o, s) {
  var a;
  const r = () => ({ kind: "text", value: xe(i == null ? void 0 : i.power) }), l = (u) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: u });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Tt(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const u = n.device(e.deviceId);
      if (!u) return [{ kind: "text", value: c("power.missing"), fill: o.blockInvalid }];
      const p = u.bindings ?? {}, h = Zt(u), d = [];
      return h ? (p.power_in && d.push({ kind: "text", label: c("power.in"), value: xe(i == null ? void 0 : i.power_in) }), p.power_out && d.push({ kind: "text", label: c("power.out"), value: xe(i == null ? void 0 : i.power_out) })) : p.power && d.push(r()), p.voltage && d.push({ kind: "text", value: Tt(i == null ? void 0 : i.voltage, "V") }), p.control && d.push(l(Fc(u))), h && d.push({ kind: "text", label: c("power.loss"), value: xe(i == null ? void 0 : i.loss) }), d;
    }
    case "battery":
      return [{ kind: "text", label: c("power.soc"), value: Tt(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: c("power.hint.disagree"), fill: o.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), rg(t, i.absorbed, n, s)] : [r()];
    case "bus":
      return [];
  }
}
function ag(t, e, n) {
  const i = t.state ?? "unknown", o = t.controllable ? 0 : zo + 3, s = e.x - o / 2, r = `${c(`power.switch.${i}`)}${t.controllable ? "" : ` · ${c("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : $}>
    <title>${r}</title>
    ${Ft(
    i === "on" ? ym : $m,
    { x: s, y: e.y },
    Fl,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? $ : Ft(_m, { x: s + Fl / 2 + 3 + zo / 2, y: e.y + 1 }, zo, n.blockValue)}
  </g>`;
}
function jl(t, e, n) {
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
function cg(t, e, n) {
  const i = 2 * (t.w + t.h), o = jl(t, e.side, e.pt), s = ((jl(t, n.side, n.pt) - o) % i + i) % i, r = s <= i / 2 ? 1 : -1, l = r > 0 ? s : i - s, u = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((p) => ({ c: p, d: ((p.t - o) * r % i + i) % i })).filter(({ d: p }) => p > 0 && p < l).sort((p, h) => p.d - h.d).map(({ c: p }) => p.pt);
  return [e.pt, ...u, n.pt];
}
function ug(t, e, n, i, o, s) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return $;
  const l = vo(t, e, i.geo), a = l.find((f) => f.name === r), u = l.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !u) return $;
  const p = o(u.name) ?? "nodata", h = Un(p, i.palette), d = Bu(cg(Ie(e, i.geo, t), a, u));
  return _`${p === "live" ? Ru("ts-glow", d, h, s) : $}
    <path class="ts-path" d=${d} fill="none" stroke=${h} stroke-width="3" stroke-dasharray=${p === "nodata" ? "5 4" : $}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${Ee}></path>`;
}
function dg(t, e, n, i) {
  const o = i.palette;
  return Ou(e, i.geo, t).map(({ position: s, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === s;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${s} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? o.accent : "none"}
        stroke=${l ? o.accent : o.blockStroke} stroke-width="1" vector-effect=${Ee}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? o.accentText : o.blockValue} font-family=${Tn}>${s}</text>
    </g>`;
  });
}
function hg(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? c("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? c("power.alert.missingDevice") : t === "disagree" ? c("power.alert.disagree") : t;
}
function pg(t, e, n, i) {
  const o = Gm + Xn / 2, s = [
    { x: e.x + e.w - o, y: e.y + o },
    { x: e.x + e.w - o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + o }
  ], r = (a) => n.every(({ pt: u }) => {
    const p = Math.max(Math.abs(u.x - a.x) - Xn / 2, 0), h = Math.max(Math.abs(u.y - a.y) - Xn / 2, 0);
    return Math.hypot(p, h) > Fn;
  }), l = s.find(r) ?? s[0];
  return _`<g class="alert"><title>${t.map(hg).join(`
`)}</title>
    ${Ft(Du, l, Xn, i.blockInvalid)}</g>`;
}
function fg(t, e, n, i, o) {
  var w, v;
  const s = n.palette, r = Ie(e, n.geo, t), l = (w = n.frame) == null ? void 0 : w.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, u = e.kind === "device" && !a, p = r.x + r.w / 2, h = bo(e, n.geo) || c(`power.kind.${e.kind}`), d = lg(t, e, n.geo, l, s, r.w), f = e.kind === "remainder", m = vo(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${u ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${s.blockFill}
      stroke=${f ? s.powerRemainder : s.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : $} vector-effect=${Ee}></rect>
    ${e.kind === "transfer" ? ug(t, e, l, n, (b) => i(e.id, b), o) : $}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${c("power.planDevice")}</title>
      ${Ft(Am, { x: r.x + 4 + Ro / 2, y: r.y + 4 + Ro / 2 }, Ro, s.blockValue)}</g>` : $}
    <text class="name" x=${p} y=${r.y + Oi - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${Km} font-weight="600" fill=${s.blockName} font-family=${Tn}>${h}</text>
    ${d.map((b, y) => {
    const k = r.y + Oi + y * Ei + Ei / 2;
    if (b.kind === "chips") return e.kind === "transfer" ? dg(t, e, l, n) : $;
    if (b.kind === "switch") return ag(b, { x: p, y: k }, s);
    const M = b.fill ?? s.blockValue, x = b.label ? _`<tspan>${b.label} </tspan>` : $, L = b.note ? _`<tspan> ${b.note}</tspan>` : $;
    return _`<text x=${p} y=${k} text-anchor="middle" dominant-baseline="central" font-size=${b.small ? mr : Xm}
        fill=${M} font-family=${Tn}>${b.title ? _`<title>${b.title}</title>` : $}${x}<tspan
        font-weight=${b.small ? $ : "600"}>${b.value}</tspan>${L}</text>`;
  })}
    ${(v = l == null ? void 0 : l.alert) != null && v.length ? pg(l.alert, r, m, s) : $}
    ${m.map((b) => og(b, i(e.id, b.name), s))}
  </g>`;
}
function mg(t, e, n, i) {
  const o = i.palette, s = t.w >= t.h, r = s ? t.x : t.y, l = r + (s ? t.w : t.h), a = s ? t.h : t.w;
  let u = $;
  const p = t.name ?? "", h = Math.min(Bo, a - 4), d = h >= Ym, f = p.length * (d ? h : Bo) * 0.58 + 12;
  if (p) {
    const m = e.map((b) => s ? b.x : b.y).sort((b, y) => b - y);
    let w = { lo: 0, hi: -1 }, v = r;
    for (const b of [...m, l + hn]) {
      const y = Math.min(b - hn, l);
      y - v > w.hi - w.lo && (w = { lo: v, hi: y }), v = Math.max(v, b + hn);
    }
    if (w.hi - w.lo >= f) {
      const b = (w.lo + w.hi) / 2, y = s ? { x: b, y: d ? t.y + t.h / 2 : t.y - 7 } : { x: d ? t.x + t.w / 2 : t.x - 7, y: b };
      u = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${d ? h : Bo} fill=${o.blockValue} font-family=${Tn}
        transform=${s ? $ : `rotate(-90 ${y.x} ${y.y})`}>${p}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${o.blockFill}
      stroke=${n ? Un(n, o) : o.blockStroke} stroke-width="1.5" vector-effect=${Ee}></rect>
    ${u}
  </g>`;
}
function gg(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${hn} fill=${n.portFill} stroke=${Un(e, n)} stroke-width="1.5"
      vector-effect=${Ee}></circle>
    ${Ft(bm, t, Zm, n.portIcon)}
  </g>`;
}
function bg(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return $;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return $;
  const o = Ie(i, e.geo, t), s = 4 / e.scale;
  return _`<rect class="selection" x=${o.x - s} y=${o.y - s} width=${o.w + 2 * s} height=${o.h + 2 * s} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${Ee}></rect>`;
}
function vg(t, e) {
  var d;
  const n = e.preview.power ?? t, i = e.palette, o = [];
  for (const f of n.wires) {
    const m = Iu(n, f, e.geo);
    if (!m) continue;
    const w = (d = e.frame) == null ? void 0 : d.wires[f.id];
    o.push({ w: f, a: m.a, b: m.b, pts: Eu(m.a, m.b), live: w, style: Jm(w) });
  }
  const s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of o)
    for (const [m, w] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        s.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const v = r.get(m.bus);
      (v === void 0 || Wl[f.style] > Wl[v]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], w.pt]), a.push({ at: w.pt, style: f.style });
    }
  const u = (f, m) => s.get(`${f}:${m}`), p = eg(), h = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? mg(f, l.get(f.id) ?? [], r.get(f.id), e) : $)}</g>
    <g class="wires">${o.map((f) => ig(f, e, p))}</g>
    ${bg(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? $ : fg(n, f, e, u, p))}</g>
    <g class="terminals">${a.map((f) => gg(f.at, f.style, i))}</g>
    ${h ? _`<line class="wire-draft" x1=${h.from.x} y1=${h.from.y} x2=${h.to.x} y2=${h.to.y}
      stroke=${h.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${Ee}></line>` : $}
  </g>`;
}
const Ut = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, Fu = 3600, Vn = (t) => typeof t == "number" && Number.isFinite(t);
function wg(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Ut, i = Uu(e.nightBelow, e.dayAbove), o = Wu(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: o ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: o ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: ju(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function Uu(t, e) {
  if (t !== void 0 && !Vn(t) || e !== void 0 && !Vn(e)) return !1;
  const n = t ?? Ut.nightBelow, i = e ?? Ut.dayAbove;
  return n >= 0 && n < i;
}
function Wu(t, e) {
  if (t !== void 0 && !Vn(t) || e !== void 0 && !Vn(e)) return !1;
  const n = t ?? Ut.sunNight, i = e ?? Ut.sunDay;
  return n < i;
}
const ju = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= Fu, ql = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function $g(t, e) {
  var l, a, u, p;
  const n = wg(t), i = (h) => {
    const d = h ? e == null ? void 0 : e[h] : void 0;
    return d && typeof d == "object" ? d : void 0;
  }, o = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (o && ((a = o.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof o.state == "string" && o.state.trim() !== "") {
    const h = Number(o.state);
    if (Number.isFinite(h)) return { state: ql(h, n.nightBelow, n.dayAbove), lux: h };
  }
  const s = i((u = t.bindings) == null ? void 0 : u.sun), r = (p = s == null ? void 0 : s.attributes) == null ? void 0 : p.elevation;
  return s && s.state !== "unavailable" && s.state !== "unknown" && Vn(r) ? { state: ql(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
const yg = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function gr(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const ks = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function kg(t, e) {
  var s;
  const n = ks(t, e);
  if (!n || n.state.trim() === "") return;
  const i = yg[((s = n.attributes) == null ? void 0 : s.unit_of_measurement) ?? ""], o = Number(n.state);
  return i === void 0 || !Number.isFinite(o) ? void 0 : o * i;
}
const xg = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function fi(t, e) {
  var f;
  const n = t.bindings ?? {}, i = t.props.kind;
  let o = "none", s = !1, r = !1, l;
  const a = (m, w, v) => {
    if (!m) return;
    l = ks(e, m);
    const b = (l == null ? void 0 : l.state) ?? "";
    o = w.includes(b) ? "on" : v.includes(b) ? "off" : "no-data";
  }, u = ["on"], p = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      s = !0;
    // falls through
    case "socket":
    case "equipment":
    case "virtual_switch": {
      r = !!n.control, a(n.control, u, p);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      s = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], u, p), o === "on" && (o = "active");
      break;
    }
    case "wall_switch":
      a(n.state, u, p);
      break;
    // A speaker is on while its player plays.
    case "speaker": {
      if (!n.player) break;
      const m = (f = ks(e, n.player)) == null ? void 0 : f.state;
      o = m === "playing" ? "on" : m === void 0 || m === "unavailable" || m === "unknown" ? "no-data" : "off";
      break;
    }
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const h = { look: o };
  if (s && l && (o === "on" || o === "active")) {
    const m = xg(l);
    m !== void 0 && (h.timerSince = m);
  }
  const d = Ae(t).some((m) => m.role === "power") ? kg(e, n.power) : void 0;
  return d !== void 0 && Math.round(d) >= 1 && (o === "on" || !r) && (h.power = d), i === "illuminance_sensor" && (n.illuminance || n.sun) && (h.daylight = Mg(t, e)), h;
}
function Mg(t, e) {
  const n = $g(t, e);
  if (n.state === null) return c("daylight.noData");
  const i = c(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${c("daylight.bySun")}`;
}
function qu(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const o = e.props.kind;
    i.push({ text: gr(n - t.timerSince), tone: o === "motion_sensor" ? "motion" : o === "leak_sensor" ? "leak" : "device", id: "timer" });
  }
  return t.power !== void 0 && i.push({ text: xe(t.power), tone: "device", id: "power" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device", id: "daylight" }), i;
}
function mi(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  return e < 60 ? `${e} s` : gr(e * 1e3);
}
const _g = (t) => t < 1e3 ? "<1 s" : mi(Math.round(t / 1e3) * 1e3);
function Ag(t, e) {
  return t.map(({ label: n, value: i, stats: o }) => {
    const s = `${n}  ${i}`;
    if (!o) return s;
    if (o.count <= 0 || o.last === null) return `${s} · ${c("power.hint.none")}`;
    const r = [s];
    if (o.period !== null && r.push(c("power.hint.every").replace("{period}", _g(o.period))), r.push(c("power.hint.last").replace("{age}", mi(e - o.last))), o.period !== null) {
      const l = o.last + o.period - e;
      r.push(l >= 0 ? c("power.hint.next").replace("{left}", mi(Math.ceil(l / 1e3) * 1e3)) : c("power.hint.overdue").replace("{over}", mi(-l)));
    }
    return r.join(" · ");
  });
}
const Yn = 8, Oe = 4, Sg = 6.8, Lg = 17, Cg = 22, Ig = 12;
function Eg(t) {
  return { w: Math.ceil(Math.max(0, ...t.map((e) => e.length)) * Sg + Cg), h: t.length * Lg + Ig };
}
function Og(t, e, n) {
  const i = (p, h, d) => Math.max(h, Math.min(p, Math.max(h, d))), o = i(t.x + t.w / 2 - e.w / 2, Oe, n.w - e.w - Oe), s = i(t.y + t.h / 2 - e.h / 2, Oe, n.h - e.h - Oe), r = t.y + t.h + Yn;
  if (r + e.h <= n.h - Oe) return { left: o, top: r };
  const l = t.y - Yn - e.h;
  if (l >= Oe) return { left: o, top: l };
  const a = t.x + t.w + Yn;
  if (a + e.w <= n.w - Oe) return { left: a, top: s };
  const u = t.x - Yn - e.w;
  return u >= Oe ? { left: u, top: s } : { left: o, top: i(r, Oe, n.h - e.h - Oe) };
}
class Zu extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function Fo(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Dg(t) {
  return t.connection.sendMessagePromise({ type: "plan_studio/info" });
}
async function Ng(t, e) {
  return (await t.sendMessagePromise({ type: "plan_studio/readings/get", entity_ids: e })).readings;
}
async function Pg(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Tg(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (o) {
    throw typeof o == "object" && o !== null && o.code === "revision_conflict" ? new Zu(o.message) : o;
  }
}
async function Vg(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Hg = 2e3, zg = 200;
class Rg {
  constructor(e, n) {
    this.host = e, this.connection = n, this.stats = null, this.json = "", this.ids = [], this.timer = null, this.run = 0, this.asked = 0, this.applied = 0;
  }
  watch(e) {
    const n = e.slice(0, zg), i = JSON.stringify(n);
    i === this.json && this.timer !== null || (this.stop(), n.length !== 0 && (this.json = i, this.ids = n, this.timer = setInterval(() => {
      this.ask(this.run);
    }, Hg), this.ask(this.run)));
  }
  stop() {
    this.timer !== null && clearInterval(this.timer), this.timer = null, this.run++, this.json = "", this.ids = [], this.stats = null;
  }
  async ask(e) {
    const n = this.connection();
    if (!n) return;
    const i = ++this.asked;
    try {
      const o = await Ng(n, this.ids);
      if (e !== this.run || i < this.applied || !o || typeof o != "object") return;
      this.applied = i, this.stats = o, this.host.requestUpdate();
    } catch {
    }
  }
}
function Bg(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Zl = /* @__PURE__ */ new WeakMap();
function br(t, e, n) {
  let i = Zl.get(t);
  i || Zl.set(t, i = /* @__PURE__ */ new WeakMap());
  let o = i.get(e);
  o || i.set(e, o = [null, null]);
  const s = n ? 1 : 0;
  if (o[s]) return o[s];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : Bg(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), o[s] = r, r;
}
function gi(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, o = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, s = [o ? t.areas.get(o) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: s.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qn = (t) => t ?? $;
var Fg = Object.defineProperty, Wn = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && Fg(e, n, o), o;
};
const Ug = 100;
let Wg = 0;
const jg = (t) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, Wr = class Wr extends Nt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Wg++}`, this.shown = null, this.onOutside = (e) => {
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
    const i = e[e.length - 1], o = [];
    let s = !1;
    for (const l of this.allRows())
      if (!(i && !l.search.includes(i))) {
        if (o.length === Ug) {
          s = !0;
          break;
        }
        o.push(l);
      }
    const r = { rows: o, more: s };
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
        aria-controls=${`${this.uid}-lb`} aria-label=${Qn(this.label || void 0)} title=${Qn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? g`<button class="x" type="button" title=${c("combo.clear")} aria-label=${c("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : $}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return g`<div class="drop" @pointerdown=${(o) => {
      o.target.tagName !== "INPUT" && o.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Qn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(o) => {
      this.query = o.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((o, s) => g`<div class="opt ${s === i ? "on" : ""}" id=${this.optId(s)} role="option"
            aria-selected=${o.id === this.value ? "true" : "false"} data-id=${o.id} title=${Qn(this.rowTitle(o))}
            @click=${() => this.pick(o.id)} @pointerenter=${() => {
      this.active = s;
    }}>${this.renderRow(o)}</div>`)}
      </div>
      ${e.length === 0 ? g`<div class="empty">${this.emptyText()}</div>` : $}
      ${n ? g`<div class="hint">${c("combo.more")}</div>` : $}
    </div>`;
  }
  render() {
    return g`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : $}</div>`;
  }
};
Wr.styles = cc`
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
let at = Wr;
Wn([
  je()
], at.prototype, "value");
Wn([
  je()
], at.prototype, "label");
Wn([
  K()
], at.prototype, "isOpen");
Wn([
  K()
], at.prototype, "query");
Wn([
  K()
], at.prototype, "active");
var qg = Object.defineProperty, vr = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && qg(e, n, o), o;
};
const Zg = {
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
}, Gl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Gg = { light: "light", switch: "switch", event: "event", fan: "fan" };
function Kl(t, e) {
  return t != null && t.deviceClass && Gl[t.deviceClass] ? Gl[t.deviceClass] : Gg[(t == null ? void 0 : t.domain) ?? bu(e)] ?? "generic";
}
const Xl = (t) => jg(Zg[t]);
function Kg(t) {
  switch (t) {
    case "sensor":
      return c("combo.domain.sensor");
    case "binary_sensor":
      return c("combo.domain.binary_sensor");
    case "light":
      return c("combo.domain.light");
    case "switch":
      return c("combo.domain.switch");
    case "fan":
      return c("combo.domain.fan");
    case "event":
      return c("combo.domain.event");
    default:
      return t;
  }
}
class wo extends at {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = gi(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? gi(this.meta, e) : null;
    return g`${Xl(e ? Kl(this.meta.entities.get(e), e) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : $}<small class="eid">${e}</small></span>` : g`<span class="ph">${c("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const o = ur(this.states, e.entityId) ?? "unavailable";
    return g`${Xl(Kl(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${Kg(e.domain)}<br>${o}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = gi(this.meta, e).name;
    return n === e ? e : `${n} (${e})`;
  }
  rowTitle(e) {
    return e.name === e.id ? e.id : `${e.name} (${e.id})`;
  }
  searchLabel() {
    return c("combo.search");
  }
  emptyText() {
    return c("combo.empty");
  }
}
vr([
  je({ attribute: !1 })
], wo.prototype, "meta");
vr([
  je({ attribute: !1 })
], wo.prototype, "items");
vr([
  je({ attribute: !1 })
], wo.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", wo);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, $o = (t) => (...e) => ({ _$litDirective$: t, values: e });
let yo = class {
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
const { I: Xg } = yh, Yl = (t) => t, Gu = (t) => t.strings === void 0, Ql = () => document.createComment(""), en = (t, e, n) => {
  var s;
  const i = t._$AA.parentNode, o = e === void 0 ? t._$AB : e._$AA;
  if (n === void 0) {
    const r = i.insertBefore(Ql(), o), l = i.insertBefore(Ql(), o);
    n = new Xg(r, l, t, t.options);
  } else {
    const r = n._$AB.nextSibling, l = n._$AM, a = l !== t;
    if (a) {
      let u;
      (s = n._$AQ) == null || s.call(n, t), n._$AM = t, n._$AP !== void 0 && (u = t._$AU) !== l._$AU && n._$AP(u);
    }
    if (r !== o || a) {
      let u = n._$AA;
      for (; u !== r; ) {
        const p = Yl(u).nextSibling;
        Yl(i).insertBefore(u, o), u = p;
      }
    }
  }
  return n;
}, dt = (t, e, n = t) => (t._$AI(e, n), t), Yg = {}, wr = (t, e = Yg) => t._$AH = e, Qg = (t) => t._$AH, Uo = (t) => {
  t._$AR(), t._$AA.remove();
};
class Jg extends yo {
  constructor(e) {
    if (super(e), e.type !== Fe.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? we : (wr(e), n);
  }
}
const Q = $o(Jg);
function $r(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function e1(t, e, n) {
  return R(t, N(io(P(e, t)), n));
}
function Jn(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function wt(t, e, n) {
  const { tolMm: i, grid: o, ortho: s } = n, r = s ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? $r(r, e) : e, u = r !== void 0 && a.y === r.y, p = (x) => !r || Math.abs(u ? x.y - r.y : x.x - r.x) <= 1;
  let h = null;
  for (const x of t.nodes) {
    if (l.has(x.id)) continue;
    const L = { x: x.x, y: x.y }, E = z(L, a);
    E <= i && p(L) && (!h || E < h.d) && (h = { id: x.id, pt: L, d: E });
  }
  let d = null;
  for (const x of n.corners ?? []) {
    const L = z(x.pt, a);
    L <= i && p(x.pt) && (!d || L < d.d) && (d = { c: x, d: L });
  }
  if (d && (!h || d.d < h.d)) {
    const x = d.c.pt;
    return { pt: x, kind: "corner", endpoint: { kind: "free", pt: x }, corner: d.c };
  }
  if (h) return { pt: h.pt, kind: "node", endpoint: { kind: "node", nodeId: h.id } };
  const f = t.walls.filter((x) => !l.has(x.a) && !l.has(x.b)).map((x) => ({ w: x, f: ce(t, x) })).filter((x) => x.f.len > 1e-9);
  let m = null;
  for (const { w: x, f: L } of f) {
    const E = { x: (L.a.x + L.b.x) / 2, y: (L.a.y + L.b.y) / 2 }, A = z(E, a);
    A <= i && p(E) && (!m || A < m.d) && (m = { wallId: x.id, pt: E, offset: L.len / 2, d: A });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const w = (x) => {
    let L = null;
    for (const { w: E, f: A } of f) {
      const O = re(A.dir), U = x ? [A.leftOff, -A.rightOff].filter((S) => S !== 0) : [0];
      for (const S of U) {
        const I = R(A.a, N(O, S)), T = r ? Pe(r, P(a, r), I, A.dir) : R(I, N(A.dir, Y(P(a, I), A.dir)));
        if (!T) continue;
        const V = Y(P(T, I), A.dir);
        if (V < 0 || V > A.len) continue;
        const F = z(T, a);
        F <= i && (!L || F < L.d) && (L = { d: F, res: { pt: T, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: V } } });
      }
    }
    return L ? L.res : null;
  }, v = w(!1);
  if (v) return v;
  const b = w(!0);
  if (b) return b;
  const y = n.zones ?? [];
  let k = null;
  for (const x of y)
    for (const L of x) {
      const E = z(L, a);
      E <= i && p(L) && (!k || E < k.d) && (k = { pt: L, d: E });
    }
  if (k) return Jn(k.pt, "zoneVertex");
  let M = null;
  for (const x of y)
    for (let L = 0; L < x.length; L++) {
      const E = x[L], A = x[(L + 1) % x.length], O = z(E, A);
      if (O < 1e-9) continue;
      const U = N(P(A, E), 1 / O), S = r ? Pe(r, P(a, r), E, U) : R(E, N(U, Y(P(a, E), U)));
      if (!S) continue;
      const I = Y(P(S, E), U);
      if (I < 0 || I > O) continue;
      const T = z(S, a);
      T <= i && (!M || T < M.d) && (M = { pt: S, d: T });
    }
  if (M) return Jn(M.pt, "zoneEdge");
  if (o && o > 0) {
    const x = (E) => Math.round(E / o) * o, L = r ? u ? { x: x(a.x), y: r.y } : { x: r.x, y: x(a.y) } : { x: x(a.x), y: x(a.y) };
    return Jn(L, "grid");
  }
  return Jn(a, "none");
}
const ko = 3, Jl = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function Ku(t) {
  let e = null;
  const n = (o, s, r) => {
    const l = o.devices.find((p) => p.id === s), a = l ? ae(o, l) : null, u = l ? bs(o, l, t.scale()) : null;
    return !a || !u ? 0 : Yc(We(P(r, a.pt)) - We(P(u.to, a.pt)));
  };
  function i(o) {
    if (!e || !e.moved && z(o.pt, e.downPt) <= ko / t.scale()) return;
    e.moved = !0;
    const s = e.original.devices.find((h) => h.id === e.id), r = s ? ae(e.original, s) : null;
    if (!s || !r) return;
    const l = z(o.pt, r.pt), a = (We(P(o.pt, r.pt)) - e.offset) * Math.PI / 180, u = l === 0 ? o.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, p = Yp(e.original, s, u, o.shift);
    e.work = JSON.stringify(p) === JSON.stringify(s.placement) ? e.original : Si(e.original, s.id, p);
  }
  return {
    start(o, s) {
      if (e = null, !o) return !1;
      const r = t.level(), l = r.devices.find((u) => u.id === o), a = l ? bs(r, l, t.scale()) : null;
      return !l || !a || z(s.pt, a.to) > t.tolMm() ? !1 : (e = { id: o, original: r, work: r, downPt: s.pt, offset: n(r, o, s.pt), moved: !1 }, !0);
    },
    move: i,
    end(o) {
      if (!e) return !1;
      i(o);
      const s = e;
      return e = null, s.moved && s.work !== s.original && Jl(s.work, s.id) !== Jl(s.original, s.id) && t.commit(s.work), !0;
    },
    cancel() {
      const o = e !== null;
      return e = null, o;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function ea(t, e, n) {
  const i = ce(t, t.walls.find((o) => o.id === e));
  return ct(i, n).side > 0 ? "left" : "right";
}
function Xu(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function yr(t, e = "free") {
  return t === "equipment" ? [e] : qs[t];
}
function Yu(t, e, n, i, o = 0, s = yr(n)) {
  if (s.includes("wall")) {
    const r = wt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: ea(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const u of e.walls) {
        if (u.a !== l.nodeId && u.b !== l.nodeId) continue;
        const p = ce(e, u), h = ct(p, i).side, d = Math.abs(Math.abs(h) - (h > 0 ? p.leftOff : p.rightOff));
        (!a || d < a.d) && (a = { id: u.id, offset: u.a === l.nodeId ? 0 : p.len, d });
      }
      if (a) return { mode: "wall", wallId: a.id, side: ea(e, a.id, i), offset: a.offset };
    }
  }
  return s.includes("free") ? { mode: "free", ...Xu(t, i), rotation: o } : null;
}
function t1(t, e, n) {
  const i = ae(t, e);
  if (!i) return null;
  if (!n) {
    const s = Ys(Math.round(We(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: s };
  }
  let o = null;
  for (const s of t.walls) {
    let r;
    try {
      r = ce(t, s);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = ct(r, i.pt), a = l.side > 0 ? "left" : "right", u = Math.min(r.len, Math.max(0, Math.round(l.t))), p = In(t, s.id, a, u), h = p ? z(p, i.pt) : 1 / 0;
    (!o || h < o.d) && (o = { placement: { mode: "wall", wallId: s.id, side: a, offset: u }, d: h });
  }
  return o && o.d < 1 / 0 ? Qs(t, e.props, o.placement, 0) : null;
}
function n1(t, e, n) {
  return jc(t.deviceDefaults(e), "free", n.mode);
}
function i1(t, e) {
  let n = null, i;
  const o = Ku(t);
  function s() {
    if (!n) return null;
    const r = t.level(), l = yr(e, t.wallMount() ? "wall" : "free"), a = Yu(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...Xu(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const u = n1(t, e, a), p = Qs(r, u, a, t.tolMm()), h = yl(r, u, p, "").deviceId !== null;
    return { placement: p, props: u, invalid: !h };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, o.start(i, r)) return;
      const l = s();
      if (!l || l.invalid) return;
      const a = t.level(), u = Fs(c(`device.${e}`), a.devices.filter((h) => h.props.kind === e).map((h) => h.name)), p = yl(a, l.props, l.placement, u);
      p.deviceId !== null && (t.commit(p.level), i = p.deviceId, t.select({ kind: "device", id: p.deviceId }));
    },
    move(r) {
      n = r.pt, o.active() && o.move(r);
    },
    up(r) {
      o.end(r);
    },
    key(r) {
      return r === "Escape" && o.cancel();
    },
    preview() {
      const r = o.working();
      if (o.active()) return r ? { level: r } : {};
      const l = s();
      return l ? { device: l } : {};
    },
    cancel() {
      o.cancel(), n = null, i = void 0;
    }
  };
}
function Hn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const o = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(o)) return null;
  const s = Number(o);
  return Number.isSafeInteger(s) && s >= e && s <= n ? s : null;
}
function H(t, e) {
  return g`<label class="row"><span>${t}</span>${e}</label>`;
}
function se(t, e, n, i) {
  return g`<select class="val" data-field=${i ?? $} .value=${Q(t)} @change=${(o) => {
    const s = o.target;
    n(s.value) === !1 && (s.value = t);
  }}>
    ${e.map((o) => g`<option value=${o.v} ?selected=${o.v === t}>${o.label}</option>`)}
  </select>`;
}
function Ke(t) {
  const e = t.value === null ? "" : String(Math.round(t.value)), n = (i) => {
    var o;
    return (o = t.setNotice) == null ? void 0 : o.call(t, i);
  };
  return g`<input class="val" type="text" inputmode="numeric" data-field=${t.field ?? $}
    placeholder=${t.placeholder ?? $} title=${t.placeholder ?? $} .value=${Q(e)}
    @change=${(i) => {
    const o = i.target;
    if (t.onBlank && o.value.trim() === "") {
      (t.value === null || t.onBlank() !== !1) && n(null);
      return;
    }
    const s = Hn(o.value, t.rule);
    if (s === null) {
      o.value = e, n(c(t.bad));
      return;
    }
    if (t.skipSame && s === t.value) {
      n(null);
      return;
    }
    if (t.apply(s) === !1) {
      o.value = e, n(c("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function o1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function Qu(t, e = "equipment") {
  const n = t.devices.filter((i) => i.props.kind === e).map((i) => i.name);
  return Bc(t, Fs(c(`device.${e}`), n), e);
}
function kr(t) {
  if (Zt(t)) return c("props.inverter");
  const e = Op(t);
  return e ? c(`deviceRole.${e}`) : "";
}
function xo(t) {
  const e = c(`device.${t.props.kind}`), n = kr(t);
  return n ? `${e} · ${n}` : e;
}
function s1(t) {
  const e = o1(t.level);
  return g`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${c("devices.unplaced")}</h4>
      <span class="uacts">
        <button class="btn" data-action="new-device" @click=${() => t.onNew("equipment")}>${c("devices.new")}</button>
        <button class="btn" data-action="new-virtual-switch" @click=${() => t.onNew("virtual_switch")}>${c("devices.newVirtual")}</button>
        <button class="btn" data-action="new-speaker" @click=${() => t.onNew("speaker")}>${c("devices.newSpeaker")}</button>
        <button class="btn" data-action="new-phone" @click=${() => t.onNew("phone")}>${c("devices.newPhone")}</button>
      </span>
    </div>
    ${e.length === 0 ? $ : g`<div class="pdevs">
      ${e.map((n) => g`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${kr(n) || c(`device.${n.props.kind}`)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const Ju = Object.keys(qs), r1 = (t) => Ju.includes(t);
function l1() {
  return Object.fromEntries(Ju.map((t) => [t, rt(t, "free")]));
}
const ed = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Ht, max: Ht, signed: !0 }, bad: "props.badAim" }
}, pn = (t, e, n, i, o) => Ke({ ...ed[i], value: n, field: e, setNotice: t.onNotice, apply: o, skipSame: !0 }), a1 = ["round", "linear", "spot"], c1 = ["rect", "circle"], Ni = (t, e) => t.map((n) => ({ v: n, label: c(`${e}.${n}`) }));
function td(t, e, n, i) {
  const o = (r, l, a) => H(`${c(l)}, ${c("unit.mm")}`, pn(t, n + r, a, "mm", (u) => i({ [r]: u }))), s = (r, l, a) => H(`${c(l)}, ${c("unit.deg")}`, pn(t, n + r, a, "angle", (u) => i({ [r]: u })));
  switch (e.kind) {
    case "ceiling_light":
      return g`
        ${H(c("props.shape"), se(e.shape, Ni([...a1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? g`${o("length", "props.length", e.length)}${o("width", "props.width", e.width)}` : e.shape === "round" ? o("diameter", "props.diameter", e.diameter) : $}
        ${H(`${c("props.poolRadius")}, ${c("unit.mm")}`, Ke({
        ...ed.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: c("props.poolHint"),
        setNotice: t.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return g`${s("coneAngle", "props.coneAngle", e.coneAngle)}${o("coneRange", "props.coneRange", e.coneRange)}`;
    case "motion_sensor":
      return g`${s("zoneAngle", "props.zoneAngle", e.zoneAngle)}${o("zoneRange", "props.zoneRange", e.zoneRange)}`;
    case "exhaust_fan":
      return H(`${c("props.diameter")}, ${c("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${Q(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Vh.map((r) => g`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return g`
        ${H(c("props.shape"), se(e.shape, Ni([...c1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? g`${o("width", "props.width", e.width)}${o("depth", "props.depth", e.depth)}` : o("diameter", "props.diameter", e.diameter)}
        ${H(c("props.icon"), d1(t, e.icon, `${n}icon`, i))}
        ${H(c("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Q(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return g`<p class="muted" data-note="daylight">${c("props.daylightInBinding")}</p>`;
    default:
      return g`<p class="muted">${c("props.noSettings")}</p>`;
  }
}
const u1 = /^mdi:[a-z0-9-]+$/;
function d1(t, e, n, i) {
  const o = (s, r) => {
    var l, a;
    if (!u1.test(s)) {
      r(e), (l = t.onNotice) == null || l.call(t, c("props.badIcon"));
      return;
    }
    (a = t.onNotice) == null || a.call(t, null), s !== e && !i({ icon: s }) && r(e);
  };
  return customElements.get("ha-icon-picker") ? g`<ha-icon-picker data-field=${n} .value=${Q(e)} @value-changed=${(s) => {
    var l;
    const r = s.target;
    o(String(((l = s.detail) == null ? void 0 : l.value) ?? "").trim(), (a) => {
      r.value = a;
    });
  }}></ha-icon-picker>` : g`<input class="val wide" type="text" data-field=${n} .value=${Q(e)}
    @change=${(s) => {
    const r = s.target;
    o(r.value.trim(), (l) => {
      r.value = l;
    });
  }} />`;
}
function $t(t, e, n, i) {
  return H(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)} @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`);
}
function h1(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? $ : $t("wallMount", c("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function p1(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? $ : g`
    ${$t("inverter", c("props.inverter"), !!n.inverter, (o) => {
    var s;
    return ((s = t.onInverter) == null ? void 0 : s.call(t, o)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? $t("controllable", c("props.controllable"), !!n.controllable, (o) => {
    var s;
    return ((s = t.onControllable) == null ? void 0 : s.call(t, o)) ?? !1;
  }) : g`<p class="muted" data-note="bind-switch">${c("props.bindSwitchHint")}</p>`}`;
}
function f1(t, e) {
  const n = e.placement;
  if (n.mode === "none") return $;
  if (n.mode === "free")
    return H(
      `${c("props.rotation")}, ${c("unit.deg")}`,
      pn(t, "rotation", n.rotation, "rotation", (o) => t.onPlacement({ ...n, rotation: o }))
    );
  const i = wc.has(e.props.kind);
  return g`
    ${H(c("props.side"), se(n.side, Ni(["left", "right"], "side"), (o) => t.onPlacement({ ...n, side: o }), "side"))}
    ${H(`${c("props.offset")}, ${c("unit.mm")}`, pn(
    t,
    "offset",
    n.offset,
    "offset",
    (o) => t.onPlacement({ ...n, offset: o })
  ))}
    ${i ? H(
    `${c("props.aim")}, ${c("unit.deg")}`,
    pn(t, "aim", n.aim ?? 0, "aim", (o) => t.onPlacement(tu(n, o)))
  ) : $}`;
}
function xr(t, e) {
  return H(c("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${Q(t.name)}
    @change=${(n) => {
    const i = n.target, o = i.value.trim();
    if (!o) {
      i.value = t.name;
      return;
    }
    o !== t.name && e(o);
  }} />`);
}
function m1(t, e) {
  const n = e.props.kind;
  return bc(n) ? n === "smart_button" && e.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${c("props.typeFreeHint")}</p>` : H(c("props.type"), se(
    n,
    Ni(["wall_switch", "smart_button"], "device"),
    (i) => {
      var o;
      return (o = t.onKind) == null ? void 0 : o.call(t, i);
    },
    "kind"
  )) : $;
}
function g1(t, e) {
  const n = t.level ? of(t.level, e) : [];
  return g`<fieldset data-field="zone-membership"><legend>${c("props.zoneList")}</legend>
    ${n.length === 0 ? g`<p class="muted">${c("props.noZones")}</p>` : n.map(({ zone: i, participates: o }) => g`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${o}
        @change=${(s) => {
    var l;
    const r = s.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = o);
  }} /></label>`)}
  </fieldset>`;
}
function b1(t, e) {
  const n = e.placement.mode !== "none";
  return g`
    <h4>${xo(e)}</h4>
    ${xr(e, (i) => t.onDevice({}, i))}
    ${m1(t, e)}
    ${n ? td(t, e.props, "", (i) => t.onDevice(i)) : $}
    ${h1(t, e)}
    ${f1(t, e)}
    ${p1(t, e)}
    ${n ? g1(t, e) : $}
    ${e.invalid ? g`<p class="warn">${c("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${c("action.delete")}</button>`;
}
function v1(t) {
  return t.device ? b1(t, t.device) : t.nextKind && t.nextProps ? g`
      <h4>${c("props.nextDevice")}: ${c(`device.${t.nextKind}`)}</h4>
      ${td(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? $t(
    "next-wallMount",
    c("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : $}` : g`<p class="muted">${c("props.none")}</p>`;
}
function w1(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, o = r1(t.toolId) ? t.toolId : null, s = (a) => a === e ? (t.setNotice(c("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, u) => {
    const p = t1(e, a, u);
    return s(p ? Si(e, a.id, p) : e);
  };
  return g`<div class="props">
    ${v1({
    device: i,
    level: e,
    nextKind: o,
    nextProps: o ? t.nextProps[o] : null,
    onDevice: (a, u) => !!i && s(Mt(e, i.id, a, u)),
    onKind: (a) => !!i && s(Dp(e, i.id, a)),
    onPlacement: (a) => !!i && s(Si(e, i.id, a)),
    onZone: (a, u) => !!i && s(hu(e, i.id, a, u)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(_u(e, t.power, i.id, a)),
    onControllable: (a) => !!i && s(ao(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      o && t.setNextProps({ ...t.nextProps, [o]: { ...t.nextProps[o], ...a, kind: o } });
    },
    onDelete: () => {
      i && r(Mu(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    ${i ? $ : s1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: (a) => {
      const u = Qu(e, a);
      t.commit(u.level), t.pickDevice(u.id);
    }
  })}
  </div>`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mr = $o(class extends yo {
  constructor(t) {
    if (super(t), t.type !== Fe.PROPERTY && t.type !== Fe.ATTRIBUTE && t.type !== Fe.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Gu(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === we || e === $) return e;
    const n = t.element, i = t.name;
    if (t.type === Fe.PROPERTY) {
      if (e === n[i]) return we;
    } else if (t.type === Fe.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return we;
    } else if (t.type === Fe.ATTRIBUTE && n.getAttribute(i) === e + "") return we;
    return wr(t), e;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fn = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const o of n) (i = o._$AO) == null || i.call(o, e, !1), fn(o, e);
  return !0;
}, Pi = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, nd = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), k1(e);
  }
};
function $1(t) {
  this._$AN !== void 0 ? (Pi(this), this._$AM = t, nd(this)) : this._$AM = t;
}
function y1(t, e = !1, n = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0) if (e) if (Array.isArray(i)) for (let s = n; s < i.length; s++) fn(i[s], !1), Pi(i[s]);
  else i != null && (fn(i, !1), Pi(i));
  else fn(this, t);
}
const k1 = (t) => {
  t.type == Fe.CHILD && (t._$AP ?? (t._$AP = y1), t._$AQ ?? (t._$AQ = $1));
};
class x1 extends yo {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), nd(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, o;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (o = this.disconnected) == null || o.call(this)), n && (fn(this, e), Pi(this));
  }
  setValue(e) {
    if (Gu(this._$Ct)) this._$Ct._$AI(e, this);
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
const M1 = () => new _1();
class _1 {
}
const Wo = /* @__PURE__ */ new WeakMap(), A1 = $o(class extends x1 {
  render(t) {
    return $;
  }
  update(t, [e]) {
    var i;
    const n = e !== this.G;
    return n && this.rt(void 0), (n || this.lt !== this.ct) && (this.G = e, this.ht = (i = t.options) == null ? void 0 : i.host, this.rt(this.ct = t.element)), $;
  }
  rt(t) {
    if (this.G !== void 0) if (this.isConnected || (t = void 0), typeof this.G == "function") {
      const e = this.ht ?? globalThis;
      let n = Wo.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Wo.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Wo.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), S1 = () => [{ v: "0", label: c("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], L1 = { min: 1, max: 10 };
function id(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const xs = (t, e, n) => id(t, Mt(t.level, e.id, n));
function jo(t, e, n, i) {
  return g`<div class="cflag">${H(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)}
    @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`)}</div>`;
}
const qo = "__other", tn = /* @__PURE__ */ new Set();
function C1(t, e, n, i, o) {
  const s = `${e.id}:${n}`, r = ol.includes(i), l = !r || tn.has(s), a = M1(), u = [...ol.map((h) => ({ v: h, label: h })), { v: qo, label: c("binding.eventOther") }];
  return g`<span class="evfield">${se(l ? qo : i, u, (h) => {
    if (h === qo) {
      tn.add(s), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    tn.delete(s), a.value && (a.value.hidden = !0), h !== i ? o(h) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${A1(a)} data-field=${`${n}-event-custom`} ?hidden=${Mr(!l)}
      .value=${Q(r ? "" : i)} @change=${(h) => {
    var m;
    const d = h.target, f = d.value.trim();
    if (!f) {
      d.value = r ? "" : i, t.setFieldNotice(c("props.badEvent"));
      return;
    }
    if (d.value = f, t.setFieldNotice(null), f !== i) {
      o(f) && tn.delete(s);
      return;
    }
    if (tn.delete(s), r) {
      d.hidden = !0;
      const w = (m = d.parentElement) == null ? void 0 : m.querySelector("select");
      w && (w.value = i);
    }
  }} /></span>`;
}
function I1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return g`${$}`;
  const o = i[n], s = (r) => xs(t, e, { [n]: { ...o, ...r } });
  return g`<div class="trigger" data-trigger=${n}>
    ${H(c("binding.slot"), se(
    String(o.slot),
    S1(),
    (r) => r === String(o.slot) ? !1 : s({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${H(c("binding.event"), C1(t, e, n, o.event, (r) => s({ event: r })))}
  </div>`;
}
function E1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return g`
      ${jo(
      "autoByDoubleToggle",
      c("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => xs(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${H(c("binding.window"), Ke({
      value: i.windowSec,
      rule: L1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => xs(t, e, { windowSec: l })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${$}`;
  const o = (l, a) => (u) => {
    var h, d;
    const p = Mt(t.level, e.id, { [l]: u });
    return id(t, u && !((h = e.bindings) != null && h[a]) ? eo(p, e.id, a, ((d = e.bindings) == null ? void 0 : d.on) ?? null) : p);
  }, s = o("separateOff", "off"), r = jo("autoEnabled", c("binding.autoEnabled"), i.autoEnabled, o("autoEnabled", "auto"));
  return n === "off" ? r : g`${jo("separateOff", c("binding.separateOff"), i.separateOff, s)}${i.separateOff ? $ : r}`;
}
function O1(t) {
  return t.props.kind !== "smart_button" || !Th(t).length ? g`${$}` : g`<div class="cfields"><p class="warn" data-note="duplicate">${c("binding.duplicate")}</p></div>`;
}
function D1(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function N1(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return $;
  const i = Ut, o = (a, u) => {
    if (u === n[a] || n[a] === void 0 && u === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(Mt(t.level, e.id, { [a]: u }));
  }, s = (a, u) => {
    const p = String(n[a] ?? i[a]);
    return H(u, g`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${Q(p)}
      @change=${(h) => {
      const d = h.target;
      if (d.value.trim() === "") {
        o(a, void 0);
        return;
      }
      const f = D1(d.value);
      if (f === null) {
        d.value = p, t.setFieldNotice(c("props.badDecimal"));
        return;
      }
      o(a, f);
    }} />`);
  }, r = H(c("props.debounce"), Ke({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: Fu },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => o("debounce", a),
    onBlank: () => o("debounce", void 0)
  })), l = (a, u) => g`<p class="warn" data-note=${a}>${u}</p>`;
  return g`<div class="cfields" data-section="daylight">
    ${s("nightBelow", c("props.nightBelow"))}
    ${s("dayAbove", c("props.dayAbove"))}
    ${Uu(n.nightBelow, n.dayAbove) ? $ : l("lux-pair", c("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${s("sunNight", c("props.sunNight"))}
    ${s("sunDay", c("props.sunDay"))}
    ${Wu(n.sunNight, n.sunDay) ? $ : l("sun-pair", c("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${ju(n.debounce) ? $ : l("debounce", c("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function Ti(t, e) {
  return e === "control" && t.props.kind === "equipment" ? c("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? c("binding.onOff") : c(`role.${e}`);
}
const Zo = (t) => String(t).padStart(2, "0");
function P1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Zo(e.getHours())}:${Zo(e.getMinutes())}:${Zo(e.getSeconds())}`;
}
const T1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function V1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? c("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : c("output.errorNotConfigured") : t.last ? c("output.last").replace("{event}", T1(t.last, t.kind)).replace("{time}", P1(t.last.at)) : c("output.none");
}
function H1(t, e) {
  if (!no(e.props.kind)) return $;
  const n = t.feed.stateOf(e), i = n ? V1(n) : t.feed.error ?? (t.feed.ready ? c("output.notSaved") : null);
  return i === null ? $ : g`<p class="note" data-field="output">${i}</p>`;
}
function z1(t, e) {
  var i;
  const n = (i = e.bindings) != null && i.control ? ur(t.states, e.bindings.control) : null;
  return g`<p class="note" data-field="virtual-state">${n === null ? c("output.notSaved") : c("virtual.state").replace("{s}", n)}</p>
    <p class="muted" data-note="virtual-hint">${c("virtual.hint")}</p>`;
}
function R1(t, e) {
  const n = e.props.kind === "phone" ? e.props.notify ?? "" : "", i = t.notifyServices ?? [], o = n !== "" && !i.includes(n);
  return g`<div class="role" data-role="notify">
    <div class="role-head"><span class="role-label" data-field="notify-label">${c("phone.notify")}</span></div>
    <select class="val wide" data-field="notify" @change=${(s) => {
    const r = s.target.value;
    t.commit(Mt(t.level, e.id, { notify: r === "" ? void 0 : r }));
  }}>
      <option value="" ?selected=${n === ""}>${c("phone.pick")}</option>
      ${o ? g`<option value=${n} selected>${n}</option>` : $}
      ${i.map((s) => g`<option value=${s} ?selected=${s === n}>${s}</option>`)}
    </select>
    ${o ? g`<p class="warn" data-note="notify-missing">${c("phone.missing")}</p>` : $}
    ${i.length === 0 ? g`<p class="note" data-note="notify-none">${c("phone.noServices")}</p>` : $}
    <p class="muted" data-note="phone-hint">${c("phone.hint")}</p>
  </div>`;
}
function B1(t, e, n, i) {
  const o = wu(t.meta, i, t.states), s = Ph(t.level, e, n);
  return g`
    ${o === "missing" ? g`<p class="warn" data-note="missing">${c("binding.missing")}</p>` : $}
    ${o === "unavailable" ? g`<p class="note" data-note="unavailable">${c("binding.unavailable")}</p>` : $}
    ${s.length ? g`<p class="note" data-note="also">${c("binding.alsoBound").replace("{names}", s.map((r) => r.name).join(", "))}</p>` : $}`;
}
function F1(t, e, n) {
  var l;
  const { role: i } = n, o = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, s = !!t.showAll[i], r = Ti(e, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${s}
        @change=${() => t.onShowAll(i)} />${c("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${br(t.meta, n, s)} .value=${o}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const u = eo(t.level, e.id, i, a.detail.value);
    u !== t.level && t.commit(u);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Us(i) ? I1(t, e, i) : $}
    ${o ? B1(t, e, i, o) : $}
  </div>`;
}
function U1(t) {
  const e = t.device, n = Ws(t.level.devices.map(t.status));
  return g`<div class="props bprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.fieldNotice ? g`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : $}
    ${t.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${c(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${e ? g`
      <h4>${xo(e)}</h4>
      ${xr(e, (i) => t.commit(Mt(t.level, e.id, {}, i)))}
      ${H1(t, e)}
      ${e.props.kind === "virtual_switch" ? z1(t, e) : e.props.kind === "phone" ? R1(t, e) : Ae(e).map((i) => g`${F1(t, e, i)}${E1(t, e, i.role)}`)}
      ${e.props.kind === "speaker" ? g`<p class="muted" data-note="speaker-hint">${c("speaker.hint")}</p>` : $}
      ${O1(e)}
      ${N1(t, e)}` : g`<p class="muted">${c("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${c("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${c("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${c("binding.reload")}</button>
  </div>`;
}
const W1 = 500, j1 = 1e3;
function q1(t, e, n) {
  var s;
  const i = [], o = (r, l, a) => {
    r && i.push({ entity: r, label: l, value: a });
  };
  switch (t.kind) {
    case "grid":
      o(t.power, c("power.field.power"), xe(n == null ? void 0 : n.power)), o(t.voltage, c("power.field.voltage"), Tt(n == null ? void 0 : n.voltage, "V"));
      break;
    case "battery":
      o(t.power, c("power.field.batteryPower"), xe(n == null ? void 0 : n.power)), o(t.soc, c("power.field.soc"), Tt(n == null ? void 0 : n.soc, "%"));
      break;
    case "pv":
      o(t.power, c("power.field.power"), xe(n == null ? void 0 : n.power));
      break;
    case "device": {
      const r = e.device(t.deviceId);
      if (!r) break;
      const l = new Set(Ae(r).map((u) => u.role)), a = {
        power: xe(n == null ? void 0 : n.power),
        power_in: xe(n == null ? void 0 : n.power_in),
        power_out: xe(n == null ? void 0 : n.power_out),
        voltage: Tt(n == null ? void 0 : n.voltage, "V")
      };
      for (const u of ["power", "power_in", "power_out", "voltage"])
        l.has(u) && o((s = r.bindings) == null ? void 0 : s[u], Ti(r, u), a[u] ?? "—");
      break;
    }
  }
  return i;
}
class Z1 {
  /** `meters(id)`: the block's meters now (empty when the block is gone or reads nothing). */
  constructor(e, n, i) {
    this.host = e, this.meters = i, this.openId = null, this.candidate = null, this.dwell = null, this.tick = null, this.feed = new Rg(e, n);
  }
  /** How many meters block `id` has now (0: no hint for it). */
  meterCount(e) {
    return this.meters(e).length;
  }
  /** The pointer is over block `id` (null: over nothing, or a block without meters): starts, keeps or drops the dwell. */
  move(e) {
    e !== (this.openId ?? this.candidate) && (this.hide(), e !== null && (this.candidate = e, this.dwell = setTimeout(() => {
      this.dwell = null, this.candidate = null, this.show(e);
    }, W1)));
  }
  /** Opens at once (the dev harness); the same checks as after the dwell. */
  show(e) {
    this.openId !== e && (this.hide(), this.meters(e).length !== 0 && (this.openId = e, this.tick = setInterval(() => this.host.requestUpdate(), j1), this.sync(), this.host.requestUpdate()));
  }
  /** Closes the hint and drops the dwell, the ticker and the asking. */
  hide() {
    this.dwell !== null && clearTimeout(this.dwell), this.dwell = null, this.candidate = null, this.tick !== null && clearInterval(this.tick), this.tick = null, this.feed.stop(), this.openId !== null && (this.openId = null, this.host.requestUpdate());
  }
  /** While open: closes when the block no longer has meters (deleted, unbound), else follows its entities. Called on every update. */
  sync() {
    if (this.openId === null) return;
    const e = this.meters(this.openId);
    if (e.length === 0) {
      this.hide();
      return;
    }
    this.feed.watch(e.map((n) => n.entity));
  }
  /** The hint's text lines at `now`, or null while closed. */
  lines(e) {
    if (this.openId === null) return null;
    const n = this.feed.stats, i = this.meters(this.openId).map((o) => ({ label: o.label, value: o.value, ...n != null && n[o.entity] ? { stats: n[o.entity] } : {} }));
    return i.length ? Ag(i, e) : null;
  }
}
const G1 = 3;
function Ce(t) {
  if (typeof t == "number")
    return t === G1 ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class K1 {
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
    const i = { ...e, id: oe(), name: n, revision: 0 }, o = await this.run(i, null, !1);
    return o === null ? null : { ...i, revision: o };
  }
  /** Returns the new revision, or null if the save did not succeed. */
  run(e, n, i) {
    const o = this.doRun(e, n, i).finally(() => {
      this.inflight = null;
    });
    return this.inflight = o, o;
  }
  async doRun(e, n, i) {
    this.state = "saving", this.errorMessage = null;
    const o = this.dirtyVersion;
    this.onChange();
    try {
      const s = await Tg(this.hass, e, n, i);
      return this.baseRevision = s, this.dirty = this.dirtyVersion !== o, this.state = "saved", this.onChange(), s;
    } catch (s) {
      return s instanceof Zu ? (this.state = "conflict", this.errorMessage = s.message) : (this.state = "error", this.errorMessage = Ce(s)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ta = (t, e, n) => {
  const i = /* @__PURE__ */ new Map();
  for (let o = e; o <= n; o++) i.set(t[o], o);
  return i;
}, X1 = $o(class extends yo {
  constructor(t) {
    if (super(t), t.type !== Fe.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, n) {
    let i;
    n === void 0 ? n = e : e !== void 0 && (i = e);
    const o = [], s = [];
    let r = 0;
    for (const l of t) o[r] = i ? i(l, r) : r, s[r] = n(l, r), r++;
    return { values: s, keys: o };
  }
  render(t, e, n) {
    return this.dt(t, e, n).values;
  }
  update(t, [e, n, i]) {
    const o = Qg(t), { values: s, keys: r } = this.dt(e, n, i);
    if (!Array.isArray(o)) return this.ut = r, s;
    const l = this.ut ?? (this.ut = []), a = [];
    let u, p, h = 0, d = o.length - 1, f = 0, m = s.length - 1;
    for (; h <= d && f <= m; ) if (o[h] === null) h++;
    else if (o[d] === null) d--;
    else if (l[h] === r[f]) a[f] = dt(o[h], s[f]), h++, f++;
    else if (l[d] === r[m]) a[m] = dt(o[d], s[m]), d--, m--;
    else if (l[h] === r[m]) a[m] = dt(o[h], s[m]), en(t, a[m + 1], o[h]), h++, m--;
    else if (l[d] === r[f]) a[f] = dt(o[d], s[f]), en(t, o[h], o[d]), d--, f++;
    else if (u === void 0 && (u = ta(r, f, m), p = ta(l, h, d)), u.has(l[h])) if (u.has(l[d])) {
      const w = p.get(r[f]), v = w !== void 0 ? o[w] : null;
      if (v === null) {
        const b = en(t, o[h]);
        dt(b, s[f]), a[f] = b;
      } else a[f] = dt(v, s[f]), en(t, o[h], v), o[w] = null;
      f++;
    } else Uo(o[d]), d--;
    else Uo(o[h]), h++;
    for (; f <= m; ) {
      const w = en(t, a[m + 1]);
      dt(w, s[f]), a[f++] = w;
    }
    for (; h <= d; ) {
      const w = o[h++];
      w !== null && Uo(w);
    }
    return this.ut = r, wr(t, a), we;
  }
});
function od(t, e, n) {
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
function Y1(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function Q1(t, e, n, i) {
  const o = [t, t + n / 2, t + n], s = [e, e + i / 2, e + i], r = [];
  for (const l of o) for (const a of s) (l !== o[1] || a !== s[1]) && r.push({ x: l, y: a });
  return r;
}
function J1(t, e, n, i, o) {
  const s = Q1(e, n, i, o);
  if (!s.every((l) => Gt(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + o)) return null;
  let r = 1 / 0;
  for (const l of s)
    for (let a = 0; a < t.length; a++) r = Math.min(r, Ve(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function eb(t, e, n, i, o) {
  const s = e.placement.mode === "wall", r = s ? Y1(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const d of t.zones) {
    const f = he(t, d);
    if (f.length < 3 || !Gt(f, n.pt)) continue;
    const m = Math.abs(He(f));
    m < a && (a = m, l = f);
  }
  if (!l) return r;
  const u = (d) => {
    const f = od(d, i, o);
    return J1(l, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, p = (d) => {
    let f = null, m = -1;
    for (const w of d) {
      const v = u(w);
      v !== null && v > m && (f = w, m = v);
    }
    return f;
  }, h = ["down-right", "down-left", "up-right", "up-left"];
  if (s) {
    const d = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (u(r) !== null) return r;
    const m = h.filter((w) => d ? w.startsWith(r) : w.endsWith(r));
    return p(m) ?? p(d ? ["right", "left"] : ["down", "up"]) ?? (u(f) !== null ? f : r);
  }
  return p(["right", "left"]) ?? p(h) ?? p(["down", "up"]) ?? r;
}
const fe = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function Te(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function sd(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${c("unit.m2")}`;
}
const jn = 12, G = "non-scaling-stroke", tb = 7, nb = 10, Vi = "#f43f5e", na = "3 2", ia = 18, ib = 6, oa = 11, ob = 0.6, sb = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", rd = 24, ei = 4, sa = 4, bi = jn * 0.85, rb = 0.58;
function lb(t, e, n, i) {
  const o = rd;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const s = n * Math.PI / 180, r = Math.abs(Math.cos(s)), l = Math.abs(Math.sin(s)), [a, u] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], p = a * i - 2 * sa, h = u * i - 2 * sa, d = e.length * rb * bi, f = o + ei + bi, m = o + ei + d, w = Math.max(o, d), v = (M, x) => Math.max(0, M - p) + Math.max(0, x - h), b = v(w, f), y = v(m, o);
  if (b > 0 && y < b) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + o / 2) / i,
      iconY: 0,
      labelX: (M + o + ei) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const k = -f / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (k + o / 2) / i,
    labelX: 0,
    labelY: (k + o + ei + bi / 2) / i,
    labelAnchor: "middle"
  };
}
function ab(t, e, n, i = 0, o = 0) {
  const s = rd / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - s / 2} y=${o - s / 2} width=${s} height=${s}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${s}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}>
    <path d=${sb} fill=${n}></path></g>`;
}
const cb = "__preview__", ub = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, db = /* @__PURE__ */ new WeakMap();
function hb(t, e) {
  var o;
  const n = Te(db, t.walls, () => /* @__PURE__ */ new WeakMap()), i = Te(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (o = Te(i, t.openings, () => ({})))[e] ?? (o[e] = Xc(t, e));
}
const pb = /* @__PURE__ */ new WeakMap();
function ld(t, e) {
  const n = co(e.props.kind);
  if (!n) return [];
  const i = hb(t, n), o = Te(pb, i, () => /* @__PURE__ */ new WeakMap());
  let s = o.get(e);
  return s || (s = Gp(t, e, () => i), o.set(e, s)), s;
}
function Hi(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function fb(t, e, n, i, o, s = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, u = o ?? $;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${u} vector-effect=${G}></circle>` : _`<circle class="icon" r=${Hi(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></path>`;
    case "motion_sensor": {
      const p = (h) => `M${e * h} ${-e * h * 0.8}A${e * h} ${e * h * 0.8} 0 0 1 ${e * h} ${e * h * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <path class="arcs" d=${p(1) + p(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${G}></path>`;
    }
    case "illuminance_sensor": {
      let p = "";
      for (let h = 0; h < 8; h++) {
        const d = h * Math.PI / 4;
        p += `M${Math.cos(d) * e * 1.15} ${Math.sin(d) * e * 1.15}L${Math.cos(d) * e * 1.6} ${Math.sin(d) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <path class="rays" d=${p} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${G}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${u} vector-effect=${G}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${s} stroke=${s} stroke-width="1" vector-effect=${G}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u}
        vector-effect=${G}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${s}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${s}></circle>`;
    case "virtual_switch":
      return _`<rect class="icon" x=${-e} y=${-e * 0.55} width=${e * 2} height=${e * 1.1} rx=${e * 0.55} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></rect>
        <circle class="dot" cx=${-e * 0.45} r=${e * 0.3} fill=${s}></circle>`;
    case "speaker":
      return _`<rect class="icon" x=${-e * 0.7} y=${-e} width=${e * 1.4} height=${e * 2} rx=${e * 0.25} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></rect>
        <circle class="dot" cy=${e * 0.3} r=${e * 0.42} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${G}></circle>
        <circle class="dot" cy=${-e * 0.55} r=${e * 0.16} fill=${s}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${G}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${G}></path>`;
    case "exhaust_fan": {
      let p = "";
      for (let h = 0; h < 4; h++) {
        const d = h * Math.PI / 2 + Math.PI / 4;
        p += `M0 0L${Math.cos(d) * e * 0.85} ${Math.sin(d) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${u} vector-effect=${G}></circle>
        <path class="blades" d=${p} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${G}></path>`;
    }
    default:
      return _`${$}`;
  }
}
function mb(t, e, n, i, o, s) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${$}`;
  const l = lb(r, r.label, i, e.scale), a = s ?? $, u = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${G}></circle>
      ${o ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : $}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${G}></rect>
      ${o ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : $}`;
  return _`
    <g transform=${`rotate(${i})`}>${u}</g>
    ${ab(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${bi / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function gb(t, e, n = 0) {
  return t === "bound" ? $ : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(jn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${ub[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : $} vector-effect=${G}></circle>`;
}
function bb(t, e, n) {
  if (t.status !== "error") return $;
  const i = e * 0.9, o = -e * 0.9, s = nb / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${o} r=${tb / n.scale} fill=${n.palette.background} stroke=${Vi} stroke-width="1.5"
      vector-effect=${G}></circle>
    <path d=${Du} fill=${Vi} transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}></path>
  </g>`;
}
function vb(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" || t === "unmatched" ? Vi : t === "event" ? e.selection : t === "mode" ? e.modeBubble : e.device;
}
function wb(t, e, n, i, o, s) {
  const r = [...i.shown.map((b) => [b, "bubble-in"]), ...i.leaving.map((b) => [b, "bubble-out"])];
  if (r.length === 0) return $;
  const l = 1 / s.scale, a = r.map(([b]) => (b.text.length * oa * ob + 2 * ib) * l), u = ia * l, p = (ia + 2) * l, h = { w: Math.max(...a), h: u + p * (r.length - 1) }, d = o + 4 * l, f = Math.max(1, i.shown.length), m = eb(t, e, n, { w: Math.max(...a.slice(0, f)), h: u + p * (f - 1) }, d), w = od(m, h, d), v = ([b, y], k) => `${y}:${b.id ?? (b.key === void 0 ? `#${k}` : "")}:${b.key ?? ""}`;
  return _`${X1(r.map((b, y) => [b, y]), ([b, y]) => v(b, y), ([[b, y], k]) => {
    const M = a[k], x = w.x + (h.w - M) / 2, L = w.y + (m.startsWith("up") ? r.length - 1 - k : k) * p, E = vb(b.tone, s.palette);
    return _`<g class=${`bubble ${y}`} data-tone=${b.tone}>
      <rect x=${x} y=${L} width=${M} height=${u} rx=${u / 2} fill=${s.palette.background} stroke=${E} stroke-width="1.5"
        vector-effect=${G}></rect>
      <text x=${x + M / 2} y=${L + u / 2} text-anchor="middle" dominant-baseline="central" fill=${E} font-weight="700"
        font-size=${oa * l} font-family="system-ui, sans-serif">${b.text}</text>
    </g>`;
  })}`;
}
function $b(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Hi(t, jn / e.scale);
}
function yb(t, e, n, i) {
  var r;
  const o = (r = i.bubbles) == null ? void 0 : r.call(i, e), s = o ? wb(t, e, n, o, $b(e, i), i) : $;
  return s === $ ? $ : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : $}>${s}</g>`;
}
function kb(t, e, n, i) {
  var k, M, x;
  const o = n.palette, s = t.invalid ? o.invalid : o.device, r = jn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((k = n.selection) == null ? void 0 : k.kind) === "device" && n.selection.id === t.id, u = !i && no(t.props.kind), p = u ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, h = i || (x = n.live) == null ? void 0 : x.call(n, t), d = (h == null ? void 0 : h.look) === "on" || (h == null ? void 0 : h.look) === "active", f = u && !!n.containerState && !p || (h == null ? void 0 : h.look) === "no-data", m = t.props.kind, w = !d || t.invalid ? s : m === "leak_sensor" ? Vi : m === "motion_sensor" ? o.motionCone : s, v = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), b = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Hi(t, r));
  return _`
    <g class=${v} data-id=${t.id} opacity=${b} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${o.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${G}></circle>` : $}
      ${t.props.kind === "equipment" ? mb(t, n, s, l, d, f ? na : void 0) : _`<g transform=${`rotate(${l})`}>${fb(
    t,
    r,
    w,
    d ? w : o.deviceFill,
    f ? na : void 0,
    d ? o.deviceFill : w,
    (h == null ? void 0 : h.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? gb(n.bindingStatus(t), n.scale, Hi(t, r)) : $}
      ${p ? bb(p, r, n) : $}
    </g>`;
}
function ra(t, e, n, i) {
  const o = ld(t, e);
  if (o.length === 0) return $;
  const s = n.palette, r = e.invalid ? s.invalid : co(e.props.kind) === "motion" ? s.motionCone : s.cone, l = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, a = o.map(fe).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${G}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${G}></path>`;
}
function xb(t, e, n, i) {
  const o = ld(t, e);
  let s = 0;
  for (const u of o) for (const p of u) s = Math.max(s, Math.hypot(p.x - n.pt.x, p.y - n.pt.y));
  s === 0 && (s = jn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : $;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${s}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${o.length ? _`<path class="light-fill" d=${o.map(fe).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${s} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Mb(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return $;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), o = i ? bs(t, i, e.scale) : null;
  if (!o) return $;
  const s = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : $}>
    <line x1=${o.from.x} y1=${o.from.y} x2=${o.to.x} y2=${o.to.y} stroke=${s} stroke-width="2" vector-effect=${G}></line>
    <circle class="aim-knob" cx=${o.to.x} cy=${o.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${s}
      stroke-width="2" vector-effect=${G} style="cursor:grab"></circle>
  </g>`;
}
function _b(t, e) {
  const n = [];
  for (const i of t.devices) {
    const o = ae(t, i);
    o && n.push({ d: i, pose: o, preview: !1 });
  }
  if (e.preview) {
    const i = { id: cb, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, o = ae(t, i);
    o && n.push({ d: i, pose: o, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return $;
    if (e.live && !i.preview) {
      const o = e.live(i.d).look, s = i.d.props.kind;
      return s === "ceiling_light" || s === "wall_light" ? o === "on" ? xb(t, i.d, i.pose, e) : $ : s === "motion_sensor" && o === "active" ? ra(t, i.d, e, !1) : $;
    }
    return ra(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => kb(i.d, i.pose, e, i.preview))}</g>
    ${Mb(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? $ : yb(t, i.d, i.pose, e))}</g>` : $}`;
}
const la = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], _r = (t) => la[t % la.length], yt = "non-scaling-stroke", Ab = "0.55", Sb = /* @__PURE__ */ new WeakMap();
function Lb(t, e, n, i) {
  const o = i.palette, s = _r(n), r = i.selectedId === e.id, l = Te(Sb, t, su).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${fe(he(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : s}
        fill-opacity=${e.invalid ? $ : "0.16"} stroke=${s} stroke-width="1.5" vector-effect=${yt}
        opacity=${i.selectedId !== null && !r ? Ab : $}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? o.invalid : o.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${o.zoneLabel}>${sd(er(t, e))}</tspan>
      </text>` : $}
    </g>`;
}
function Cb(t, e) {
  const n = e.palette, i = t.zones.map((s, r) => ({ z: s, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: s, i: r }) => _`
      <path class="zone" data-id=${s.id} d=${fe(he(t, s))} fill="none" stroke=${_r(r)} stroke-width="1"
        vector-effect=${yt}></path>`)}</g>`;
  const o = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${o} height=${o} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${o} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: s, i: r }) => Lb(t, s, r, e))}</g>`;
}
function Ib(t, e, n) {
  const i = n.palette, o = 14 / n.scale;
  return _`<g class="zone-members">${Ze(t, e).map(({ device: s, participates: r }) => {
    const l = ae(t, s);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${yt}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${yt}></circle>` : $;
  })}</g>`;
}
function Eb(t, e, n) {
  if (e.shape.kind !== "polygon") return $;
  const i = n.palette, o = e.shape.vertices;
  return _`${he(t, e).map((s, r) => {
    const l = o[r], a = l.kind === "free" && l.lost === !0, u = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${u ? " on" : ""}`} data-index=${r} cx=${s.x} cy=${s.y}
      r=${5 / n.scale} fill=${u ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${yt}></circle>`;
  })}`;
}
function Ob(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${yt}></polyline>`;
}
function Db(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${fe(he(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${yt}></path>` : $}
    ${n ? Ib(t, n.id, e) : $}
    ${n ? Eb(t, n, e) : $}
    ${e.draft ? Ob(e.draft, e) : $}</g>`;
}
function bt(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Nb = /* @__PURE__ */ new WeakMap(), Pb = /* @__PURE__ */ new WeakMap(), ad = /* @__PURE__ */ new WeakMap();
function Mo(t, e, n) {
  const i = re(t.dir), o = R(t.a, N(t.dir, e)), s = R(t.a, N(t.dir, n));
  return [R(o, N(i, t.leftOff)), R(s, N(i, t.leftOff)), P(s, N(i, t.rightOff)), P(o, N(i, t.rightOff))];
}
function zn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ce(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const ee = "non-scaling-stroke";
function Tb(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, o = 5 / e.scale, s = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = zn(t, l.id);
    if (!a) continue;
    const u = re(a.dir);
    for (const [p, h, d] of [[l.a, a.a, a.dir], [l.b, a.b, N(a.dir, -1)]]) {
      const f = t.nodes.find((x) => x.id === p);
      if (!f || f.host || n.get(p) !== 1) continue;
      const m = R(h, N(u, a.leftOff + i)), w = P(h, N(u, a.rightOff + i)), v = N(u, 1), b = N(R(m, w), 0.5), y = R(P(b, N(v, -s)), N(d, o / 2)), k = P(P(b, N(v, s)), N(d, o / 2)), M = [m, y, k, w];
      r.push(_`<path class="wall-break" d=${`M${M.map((x) => `${x.x} ${x.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${ee}></path>`);
    }
  }
  return r.length ? _`${r}` : $;
}
function Vb(t, e, n) {
  const i = re(t.dir), o = (e.swing ?? "left") === "left", s = o ? i : N(i, -1), r = o ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], u = R(R(t.a, N(t.dir, l)), N(s, r)), p = R(R(t.a, N(t.dir, a)), N(s, r)), h = R(u, N(s, e.width)), d = de(P(h, u), P(p, u)) > 0 ? 1 : 0;
  return _`
    <line x1=${u.x} y1=${u.y} x2=${h.x} y2=${h.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>
    <path d=${`M${h.x} ${h.y}A${e.width} ${e.width} 0 0 ${d} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${ee}></path>`;
}
function Hb(t, e, n) {
  const i = re(t.dir), o = t.leftOff + t.rightOff, s = [t.leftOff - o / 3, t.leftOff - 2 * o / 3].map((r) => {
    const l = R(R(t.a, N(t.dir, e.offset)), N(i, r)), a = R(R(t.a, N(t.dir, e.offset + e.width)), N(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>`;
  });
  return _`${s}`;
}
function zb(t, e, n) {
  const i = zn(t, e.wallId);
  if (!i) return $;
  const o = n.palette, s = e.invalid ? o.invalid : e.kind === "window" ? o.window : o.door, r = Mo(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${fe(r)} fill=${e.invalid ? o.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Vb(i, e, s) : e.kind === "window" ? Hb(i, e, s) : $}
    </g>`;
}
function aa(t, e, n, i, o) {
  const s = o.palette.dim, r = 6 / o.scale, l = R(t, N(n, i)), a = R(e, N(n, i)), u = (h, d) => {
    const f = R(d, N(n, i + r));
    return _`<line x1=${h.x} y1=${h.y} x2=${f.x} y2=${f.y} stroke=${s} stroke-width="0.75" vector-effect=${ee}></line>`;
  }, p = R(N(R(l, a), 0.5), N(n, 9 / o.scale));
  return _`
    <g class="dim">
      ${u(R(t, N(n, 2 / o.scale)), t)}${u(R(e, N(n, 2 / o.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${s} stroke-width="1" vector-effect=${ee}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / o.scale}
        fill=${s} font-family="system-ui, sans-serif">${bt(z(t, e))}</text>
    </g>`;
}
function Rb(t, e) {
  const n = e.selection;
  if (!n) return $;
  const i = e.palette, o = 4 / e.scale, s = (r) => _`<circle cx=${r.x} cy=${r.y} r=${o} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? s(r) : $;
  }
  if (n.kind === "wall") {
    const r = Te(ad, t, ro).get(n.id), l = zn(t, n.id);
    if (!r || !l) return $;
    const a = re(l.dir);
    return _`
      <path d=${fe(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${s(l.a)}${s(l.b)}
      ${aa(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((d) => d.id === n.id), l = r ? zn(t, r.wallId) : null;
    if (!r || !l) return $;
    const a = N(re(l.dir), -1), u = l.rightOff + 18 / e.scale, p = (d) => R(l.a, N(l.dir, d)), h = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${fe(Mo(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${h.filter(([d, f]) => f - d >= 1).map(([d, f]) => aa(p(d), p(f), a, u, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${fe(he(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${ee}></path>` : $;
  }
  return $;
}
function Bb(t, e, n) {
  return z(t, e) < 1e-6 ? null : Mo(Ac(t, e, n.thickness, n.baseline), 0, z(t, e));
}
function Fb(t, e) {
  const { preview: n, palette: i } = e, o = 1e7, s = n.orthoFrom, r = n.opening, l = r ? zn(t, r.wallId) : null;
  return _`
    ${s ? _`<path d=${`M${s.x - o} ${s.y}H${s.x + o}M${s.x} ${s.y - o}V${s.y + o}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${ee}></path>` : $}
    ${(n.walls ?? []).map((a) => {
    const u = Bb(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${u ? _`<path d=${fe(u)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${ee}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${fe(Mo(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${Wb(t, e)}`;
}
function Ub(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${ee}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${ee}></rect></g>`;
}
function Wb(t, e) {
  const n = e.preview, i = e.palette, o = n.anchor ? Ub(n.anchor, e) : $, s = n.snap;
  if (!s || s.kind === "none") return o;
  const r = (f) => f / e.scale, { x: l, y: a } = s.pt, u = { stroke: i.background, width: "3" };
  let p, h = $;
  if (s.kind === "node" || s.kind === "corner") {
    const f = r(5);
    p = _`<g class=${s.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${u.stroke} stroke-width=${u.width} paint-order="stroke" vector-effect=${ee}></rect></g>`;
  } else if (s.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    p = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${u.stroke} stroke-width=${u.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "zoneVertex") {
    const f = r(7), m = `M${l} ${a - f}L${l + f} ${a}L${l} ${a + f}L${l - f} ${a}Z`;
    p = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${u.stroke} stroke-width="5"
      vector-effect=${ee}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "wall" || s.kind === "zoneEdge") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    p = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${u.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${ee}></path></g>`;
    const w = s.endpoint.kind === "wall" ? Te(ad, t, ro).get(s.endpoint.wallId) : void 0;
    w && (h = _`<path class="snap-wall-hl" d=${fe(w)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${ee}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    p = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${u.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${ee}></path></g>`;
  }
  const d = c(`snapmark.${s.kind}`);
  return _`
    ${h}${o}${p}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${ee} font-family="system-ui, sans-serif">${d}</text>`;
}
function jb(t, e) {
  var d;
  const n = e.preview.level ?? t, i = e.palette, o = Te(Nb, n, (f) => Ic(f, !0)), s = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = s.length ? Te(Pb, n, Ks) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", u = a ? $ : String(i.dimOpacity), p = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, h = e.mode ?? "plan";
  return _`
    ${Cb(n, { palette: i, scale: e.scale, selectedId: p, mode: h === "automation" ? "plan" : h })}
    <path class="walls" d=${o.map((f) => f.map(fe).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${u}></path>
    ${r ? _`<g class="railings" opacity=${u}>${s.flatMap((f) => (r.get(f.id) ?? []).map((m) => _`<path d=${fe(m)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${u}>${n.openings.map((f) => zb(n, f, e))}</g>
    <g class="wall-breaks" opacity=${u}>${Tb(n, e)}</g>
    ${a ? Db(n, {
    palette: i,
    scale: e.scale,
    selectedId: p,
    draft: e.preview.zoneDraft,
    vertex: ((d = e.preview.zoneVertex) == null ? void 0 : d.zoneId) === p ? e.preview.zoneVertex.index : null
  }) : $}
    <g class="devices-layer">${a ? $ : _b(n, {
    palette: i,
    scale: e.scale,
    selection: l,
    showCones: e.showCones ?? !0,
    dim: !1,
    preview: e.preview.device,
    ...h === "binding" || h === "automation" ? {
      bindingStatus: h === "binding" ? e.bindingStatus : void 0,
      containerState: e.containerState,
      live: e.live,
      bubbles: e.bubbles
    } : {}
  })}</g>
    <g class="selection">${Rb(n, e)}</g>
    <g class="preview">${Fb(n, e)}</g>`;
}
const qb = {
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
  modeBubble: "#34d399",
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
}, Zb = {
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
  modeBubble: "#047857",
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
function Gb(t) {
  return t ? qb : Zb;
}
const Ms = 1, ca = 1e-6;
function Kb(t, e, n, i, o) {
  const s = (a) => a > ca && a < o - ca, r = new Set(t.nodes.filter((a) => {
    var u;
    return ((u = a.host) == null ? void 0 : u.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const u = so(t, a).host.offset;
    s(u) && l.push({ t: u, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some((w) => w === e.a || w === e.b || r.has(w))) continue;
    const u = ne(t, a.a), p = ne(t, a.b), h = z(u, p), d = h === 0 ? null : Pe(n, i, u, P(p, u));
    if (!d) continue;
    const f = oo(d, u, p) * h;
    if (f < -Ms || f > h + Ms) continue;
    const m = Y(P(d, n), i);
    s(m) && l.push({ t: m, wall: a, pt: d });
  }
  return l;
}
function ua(t, e) {
  let n;
  for (const i of t) {
    const o = Math.abs(i.t - e), s = n ? Math.abs(n.t - e) : 1 / 0;
    (o < s || o === s && "nodeId" in i) && (n = i);
  }
  return n;
}
function da(t, e) {
  if ("nodeId" in e)
    return delete so(t, e.nodeId).host, e.nodeId;
  for (const s of [e.wall.a, e.wall.b]) if (z(ne(t, s), e.pt) <= Ms) return s;
  const { pt: n, offset: i } = ho(t, e.wall, e.pt), o = { id: oe(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(o), o.id;
}
function Xb(t, e, n) {
  const i = t.walls.find((b) => b.id === e);
  if (!i) return t;
  const o = ne(t, i.a), s = ne(t, i.b), r = z(o, s), l = io(P(s, o)), a = Y(P(n, o), l), u = Kb(t, i, o, l, r), p = ua(u.filter((b) => b.t < a), a), h = ua(u.filter((b) => b.t > a), a);
  if (!p && !h) return cr(t, e);
  const d = ze(t), f = d.walls.find((b) => b.id === e);
  let m = e, w = 0;
  if (h) {
    const b = da(d, h);
    if (w = Y(P(ne(d, b), o), l), p) {
      const y = { ...f, id: oe(), a: b };
      d.walls.push(y), m = y.id;
    } else
      f.a = b;
  }
  p && (f.b = da(d, p));
  const v = (b, y) => b.wallId !== e || p && y <= p.t ? !0 : !h || y < h.t ? !1 : (b.wallId = m, b.offset -= w, !0);
  d.openings = d.openings.filter((b) => v(b, b.offset + b.width / 2)), d.devices = d.devices.filter((b) => b.placement.mode !== "wall" || v(b.placement, b.placement.offset));
  for (const b of d.nodes) b.host && !v(b.host, b.host.offset) && delete b.host;
  for (const b of d.zones) {
    const y = b.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((k) => k.kind !== "wall" || v(k, k.offset) ? k : nr(k)));
  }
  return po(d), Ge(d, t);
}
function Yb(t, e, n) {
  return e.some((i, o) => Ve(t, i, e[(o + 1) % e.length]) <= n);
}
function Ar(t, e, n) {
  const i = ro(t);
  for (const [o, s] of i) if (zt(e, s)) return o;
  for (const [o, s] of i) if (Yb(e, s, n)) return o;
  return null;
}
function Qb(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const o = ce(t, i);
    if (o.len < 1e-9) continue;
    const { t: s, side: r } = ct(o, e);
    if (s >= n.offset && s <= n.offset + n.width && r >= -o.rightOff && r <= o.leftOff) return n.id;
  }
  return null;
}
function Jb(t, e, n, i) {
  const o = Qb(t, e);
  if (o) return { kind: "opening", id: o };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((u) => u.id === l);
        if (a && z(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const s = Ar(t, e, n);
  return s ? { kind: "wall", id: s } : null;
}
const ev = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => he(t, n)).filter((n) => n.length >= 3);
function cd(t, e, n, i, o) {
  if (n.alt) {
    const l = n.shift && i ? $r(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const s = wt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: ev(e, o), corners: Sc(e) }), r = s.endpoint;
  if (s.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if (s.kind === "corner" && s.corner) {
    const l = s.corner, a = xt(e, l.wallId), u = a !== null && l.offset >= -Ci && l.offset <= a + Ci, p = u ? Math.max(0, Math.min(a, l.offset)) : l.offset, h = u ? In(e, l.wallId, l.side, p) : null;
    if (h) return { vertex: { kind: "wall", wallId: l.wallId, offset: p, side: l.side, x: h.x, y: h.y }, snap: s };
  }
  if ((s.kind === "mid" || s.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = ct(ce(e, l), n.pt).side >= 0 ? "left" : "right", u = In(e, l.id, a, r.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: u.x, y: u.y }, snap: { ...s, pt: u } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function ud(t, e, n) {
  const i = [];
  for (const o of t.zones) {
    const s = he(t, o);
    if (s.length < 3) continue;
    (s.some((l, a) => Ve(e, l, s[(a + 1) % s.length]) <= n) || Gt(s, e)) && i.push({ id: o.id, area: Math.abs(He(s)) });
  }
  return i.sort((o, s) => o.area - s.area || (o.id < s.id ? -1 : o.id > s.id ? 1 : 0)), i.map((o) => o.id);
}
function dd(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: he(t, n), v: n.shape.vertices } : null;
}
function tv(t, e, n, i) {
  var r;
  const o = (r = dd(t, e)) == null ? void 0 : r.o;
  if (!o) return null;
  let s = -1;
  return o.forEach((l, a) => {
    z(n, l) <= i && (s < 0 || z(n, l) < z(n, o[s])) && (s = a);
  }), s < 0 ? null : { index: s, from: o[(s + o.length - 1) % o.length] };
}
function nv(t, e, n, i) {
  const o = dd(t, e);
  if (!o || o.o.some((v) => z(n, v) <= i)) return null;
  const { o: s, v: r } = o;
  let l = -1, a = 1 / 0;
  if (s.forEach((v, b) => {
    const y = Ve(n, v, s[(b + 1) % s.length]);
    y <= i && y < a && (l = b, a = y);
  }), l < 0) return null;
  const u = s[l], p = s[(l + 1) % s.length], h = Math.max(0, Math.min(1, oo(n, u, p))), d = kc(u, p, h), f = r[l], m = r[(l + 1) % r.length], w = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + h * (m.offset - f.offset), x: d.x, y: d.y } : { kind: "free", x: Math.round(d.x), y: Math.round(d.y) };
  return { index: l + 1, vertex: w };
}
function iv(t, e) {
  let n = null, i = null, o = null, s = null, r = null, l = !1, a = !1, u = { x: 0, y: 0 }, p = null, h = [];
  const d = () => {
    const v = t.selection();
    return (v == null ? void 0 : v.kind) === "zone" ? v.id : null;
  }, f = () => {
    i = null, o = null, s = null, r = null, l = !1, a = !1;
  }, m = () => p && p.zoneId === d() ? p : null;
  function w(v) {
    if (!i || !o || !a && z(v.pt, u) <= ko / t.scale()) return;
    a = !0;
    const b = cd(t, o, v, i.from, i.zoneId);
    r = b.snap, l = v.shift, s = mf(o, i.zoneId, i.index, b.vertex);
  }
  return {
    note() {
      h = [h[h.length - 1] ?? null, t.selection()];
    },
    press(v) {
      f(), p = null, u = v.pt;
      const b = d(), y = t.level(), k = b === null ? null : tv(y, b, v.pt, t.tolMm());
      return b === null || !k ? !1 : (i = { zoneId: b, ...k }, o = s = y, !0);
    },
    pick(v) {
      const b = ud(t.level(), v, t.tolMm());
      if (b.length === 0) {
        n = null, e(null);
        return;
      }
      const y = d(), k = y !== null && n !== null && z(v, n) <= t.tolMm() ? b.indexOf(y) : -1;
      n = v, e({ kind: "zone", id: b[(k + 1) % b.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(v) {
      w(v);
    },
    up(v) {
      if (!i) return;
      w(v);
      const b = s, y = o, k = a, M = i;
      f(), k ? b && y && b !== y && t.commit(b) : p = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(v) {
      const b = h[0];
      if ((b == null ? void 0 : b.kind) !== "zone") return;
      const y = t.level(), k = nv(y, b.id, v.pt, t.tolMm());
      if (!k) return;
      const M = gf(y, b.id, k.index, k.vertex);
      M !== y && (t.commit(M), e(b), n = null);
    },
    key(v) {
      if (v === "Escape" && i)
        return f(), !0;
      const b = m();
      if (v === "Escape" && b)
        return p = null, !0;
      if ((v === "Delete" || v === "Backspace") && b) {
        const y = t.level(), k = bf(y, b.zoneId, b.index);
        return k === y ? (t.notify(c("zones.minVertices")), !0) : (p = null, t.commit(k), !0);
      }
      return !1;
    },
    preview() {
      if (i && s) {
        const b = { level: s };
        return r && (b.snap = r), l && (b.orthoFrom = i.from), b;
      }
      const v = m();
      return v ? { zoneVertex: v } : {};
    },
    cancel() {
      f(), p = null, n = null;
    }
  };
}
function ov(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 }, r = null;
  const l = (f) => {
    t.select(f);
  }, a = () => {
    e = null, n = null, i = null, r = null, o = !1;
  }, u = iv(t, l), p = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, h = (f, m, w) => ct(ce(f, f.walls.find((v) => v.id === m)), w).t;
  function d(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === s.x && f.pt.y === s.y))
      if (o = !0, m.kind === "node") {
        const w = wt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), v = w.endpoint, b = (w.kind === "wall" || w.kind === "mid") && v.kind === "wall", y = w.kind === "node" && v.kind === "node" && v.nodeId !== m.nodeId, k = n.nodes.find((E) => E.id === m.nodeId), M = !!k.host && b && v.kind === "wall" && v.wallId === k.host.wallId;
        let x = n;
        if (k.host && !M) {
          const E = structuredClone(n);
          delete E.nodes.find((A) => A.id === m.nodeId).host, x = E;
        }
        let L = xf(x, m.nodeId, p(w));
        if (y && v.kind === "node")
          L = Sf(L, m.nodeId, v.nodeId);
        else if (b && v.kind === "wall" && !M) {
          const E = n.walls.find((A) => A.id === v.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const A = structuredClone(L);
            A.nodes.find((O) => O.id === m.nodeId).host = { wallId: v.wallId, offset: v.offset }, L = Ge(A, L);
          }
        }
        i = L;
      } else if (m.kind === "wall") {
        const w = n.walls.find((y) => y.id === m.wallId), v = wt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [w.a, w.b]
        }), b = P(v.pt, m.origin);
        i = _f(
          n,
          m.wallId,
          v.kind === "none" ? { x: Math.round(b.x), y: Math.round(b.y) } : b
        );
      } else {
        const w = n.openings.find((v) => v.id === m.openingId);
        i = Vc(n, w.id, h(n, w.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      a(), s = f.pt, u.note();
      const m = t.level(), w = f.ctrl ? Ar(m, f.pt, t.tolMm()) : null;
      if (w) {
        l(null), t.commit(Xb(m, w, f.pt));
        return;
      }
      if (u.press(f)) return;
      const v = t.selection(), b = Jb(m, f.pt, t.tolMm(), v);
      if (!b) {
        u.pick(f.pt);
        return;
      }
      if (u.forget(), l(b), r = n = i = m, b.kind === "node") {
        let y = b.id;
        const k = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((M) => M.id === v.id) : void 0;
        if (f.alt && k) {
          const M = Af(m, k.id, k.a === b.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: ne(n, y) };
      } else if (b.kind === "wall")
        e = { kind: "wall", wallId: b.id, origin: f.pt };
      else if (b.kind === "opening") {
        const y = m.openings.find((k) => k.id === b.id);
        e = { kind: "opening", openingId: y.id, grab: h(m, y.wallId, f.pt) - y.offset };
      }
    },
    move(f) {
      u.active() ? u.move(f) : d(f);
    },
    up(f) {
      if (u.active()) {
        u.up(f);
        return;
      }
      e && d(f);
      const m = o, w = i, v = r;
      a(), m && w && v && w !== v && t.commit(w);
    },
    dblclick(f) {
      u.dblclick(f);
    },
    key(f) {
      return f === "Escape" && e ? (a(), !0) : u.key(f);
    },
    preview() {
      return !e || !i ? u.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), u.cancel();
    }
  };
}
function hd() {
  let t = "", e = "", n = "first";
  const i = () => {
    t = "", e = "", n = "first";
  }, o = () => t !== "" || e !== "";
  return {
    get first() {
      return t;
    },
    get second() {
      return e;
    },
    typing: o,
    clear: i,
    key(s, r, l) {
      return /^[0-9]$/.test(s) || s === " " ? (n === "first" ? t += s : e += s, !0) : s === "Backspace" ? (n === "first" ? t = t.slice(0, -1) : e = e.slice(0, -1), !0) : s === "Tab" ? (n = n === "first" ? "second" : "first", !0) : s === "Enter" ? (r(), !0) : s === "Escape" ? (o() ? i() : l(), !0) : !1;
    },
    tracker: (s) => ({ first: t, second: e, field: n, at: s })
  };
}
function sv(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = hd(), o = () => {
    e = null, i.clear();
  }, s = (u) => wt(t.level(), u, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const u = Hn(i.first, { min: 1 }), p = Hn(i.second, { min: 1 });
      return u === null || p === null ? null : { x: e.x + (n.x >= e.x ? u : -u), y: e.y + (n.y >= e.y ? p : -p) };
    }
    return s(n).pt;
  }
  const l = (u, p) => Math.abs(u.x - p.x) < 1 || Math.abs(u.y - p.y) < 1;
  function a(u) {
    if (!e || l(e, u)) return;
    const p = kf(t.level(), e, u, t.wallProps(), t.boxMeasure());
    p !== t.level() && (t.commit(p), o());
  }
  return {
    id: "box",
    down(u) {
      if (n = u.pt, !e) {
        e = s(u.pt).pt;
        return;
      }
      const p = r();
      p && a(p);
    },
    move(u) {
      n = u.pt;
    },
    up() {
    },
    key(u) {
      return e ? i.key(u, () => {
        const p = r();
        p && a(p);
      }, o) : !1;
    },
    preview() {
      if (!e) return { snap: s(n) };
      const u = r(), p = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : s(n)
      };
      if (!u || l(e, u)) return p;
      const h = t.wallProps(), d = mu(e, u, h.thickness, t.boxMeasure());
      return d && (p.walls = d.map((f, m) => ({ a: f, b: d[(m + 1) % 4], props: { ...h, baseline: "center" } }))), p;
    },
    cancel() {
      o();
    }
  };
}
const ha = (t) => Math.round(t * 1e3) / 1e3 + 0;
function rv(t) {
  let e = null, n = null, i = null, o = { x: 0, y: 0 }, s = !1, r = null;
  const l = hd(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, u = (d, f) => wt(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function p() {
    if (!n) return null;
    const d = u(o, s), f = Hn(l.first, { min: 1 }), m = Hn(l.second);
    if (f === null && m === null) return { pt: d.pt, endpoint: d.endpoint, snap: d };
    const w = f ?? z(n, d.pt);
    let v = d.pt;
    if (m === null && z(n, d.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      v = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      v = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const b = e1(n, v, w), y = { x: ha(b.x), y: ha(b.y) }, k = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return k ? { pt: { x: k.x, y: k.y }, endpoint: { kind: "node", nodeId: k.id }, snap: d } : { pt: y, endpoint: { kind: "free", pt: y }, snap: d };
  }
  function h() {
    const d = p();
    if (!e || !d) return;
    const f = yf(t.level(), e, d.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((k) => k.id === f.wallId);
    i === null && (i = m.a);
    const w = f.endNodeId === i, v = n, b = ne(f.level, f.endNodeId), y = z(v, b);
    if (y > 0 && (r = { x: (b.x - v.x) / y, y: (b.y - v.y) / y }), l.clear(), w) {
      a();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = ne(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(d) {
      if (o = d.pt, s = d.shift, !e) {
        const f = u(d.pt, !1);
        e = f.endpoint, n = f.pt;
        return;
      }
      h();
    },
    move(d) {
      o = d.pt, s = d.shift;
    },
    up() {
    },
    key(d, f) {
      return s = f.shift, e ? l.key(d, h, a) : !1;
    },
    preview() {
      if (!n) return { snap: wt(t.level(), o, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const d = p();
      return {
        walls: [{ a: n, b: d.pt, props: t.wallProps() }],
        snap: d.snap,
        tracker: l.tracker(d.pt),
        orthoFrom: s ? n : void 0,
        anchor: n
      };
    },
    cancel() {
      a();
    }
  };
}
function lv(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function o() {
    if (!n) return null;
    const s = t.level(), r = Ar(s, n, t.tolMm());
    if (!r) return null;
    const l = ce(s, s.walls.find((u) => u.id === r)), a = ct(l, n).t;
    return { wallId: r, center: a, pt: R(l.a, N(l.dir, a)) };
  }
  return {
    id: e,
    down(s) {
      n = s.pt;
      const r = o();
      if (!r) return;
      const l = i(), a = Sp(t.level(), r.wallId, e, r.center, l.width, l);
      a.openingId !== null && t.commit(a.level);
    },
    move(s) {
      n = s.pt;
    },
    up() {
    },
    key() {
      return !1;
    },
    preview() {
      const s = o();
      if (!s) return {};
      const { width: r } = i(), l = s.center - r / 2;
      return {
        // The same test addOpening runs on a click, without building the level.
        opening: { wallId: s.wallId, offset: l, width: r, kind: e, invalid: !lo(t.level(), s.wallId, l, r) },
        snap: { pt: s.pt, kind: "wall", endpoint: { kind: "wall", wallId: s.wallId, offset: s.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const pa = 3, av = 1, De = (t) => ({ x: t.x, y: t.y });
function cv(t) {
  let e = [], n = null, i = !1, o = null, s = !1;
  const r = () => e.length ? De(e[e.length - 1]) : void 0;
  function l(h) {
    const d = e.length;
    if (d === 0) return !1;
    const f = e.map(De);
    if (z(f[d - 1], h) <= av) return !0;
    if (d >= 2) {
      const m = P(f[d - 1], f[d - 2]), w = P(h, f[d - 1]);
      if (Math.abs(de(m, w)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(w.x, w.y) && Y(m, w) < 0) return !0;
    }
    for (let m = 0; m + 2 < d; m++) if (nu(f[d - 1], h, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(h) {
    if (e.length < pa) return null;
    const d = t.tolMm(), f = De(e[0]), m = De(e[e.length - 1]);
    return z(h, f) <= d ? f : z(h, m) <= d ? m : null;
  }
  function u() {
    var f;
    if (e.length < pa || Ii(e.map(De))) return !1;
    const h = t.level(), d = pf(h, e, t.zoneName());
    return d.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? d.level : sr(d.level, d.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: d.zoneId }), !0);
  }
  const p = (h) => cd(t, t.level(), h, r());
  return {
    id: "zone",
    down(h) {
      if (a(h.pt)) {
        u();
        return;
      }
      const d = p(h).vertex;
      l(De(d)) || (e = [...e, d], n = De(d), i = !1);
    },
    move(h) {
      s = h.shift;
      const d = a(h.pt);
      if (d) {
        n = d, o = null, i = Ii(e.map(De));
        return;
      }
      const f = p(h);
      o = f.snap, n = De(f.vertex), i = l(n);
    },
    up() {
    },
    key(h) {
      return h === "Enter" ? u() : h === "Backspace" || h === "Delete" || h === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : h === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const h = {};
      e.length > 0 && (h.zoneDraft = { points: e.map(De), cursor: n, invalid: i }), o && (h.snap = o);
      const d = r();
      return s && d && (h.orthoFrom = d), h;
    },
    cancel() {
      e = [], n = null, i = !1, o = null, s = !1;
    }
  };
}
function uv(t) {
  return t.zoneMethod() === "polygon" ? cv(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = hf(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(c("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : sr(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const fa = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, dv = (t, e, n) => n === void 0 || fa(t, n) !== fa(e, n);
function hv(t, e, n, i) {
  const o = e.placement;
  if (o.mode === "free" && n) return P(n, i);
  if (o.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const s = In(t, o.wallId, o.side, o.offset);
  return s ? P(s, i) : { x: 0, y: 0 };
}
function pv(t) {
  let e = null, n = null;
  const i = Ku(t);
  let o = null, s = null, r = !1, l = { x: 0, y: 0 };
  const a = (d) => {
    e = d, t.select(d);
  }, u = () => {
    n = null, o = null, s = null, r = !1;
  };
  function p(d) {
    if (!n || !o || !r && z(d.pt, l) <= ko / t.scale()) return;
    if (r = !0, d.pt.x === l.x && d.pt.y === l.y) {
      s = o;
      return;
    }
    const f = o.devices.find((x) => x.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = d.shift ? $r(l, d.pt) : d.pt, w = f.placement, v = w.mode === "free" ? null : ae(o, f), b = w.mode === "free" ? w.rotation : v ? Ys(Math.round(We(v.dir))) : 0, y = R(m, n.grab), k = Yu(t, o, f.props.kind, y, b, yr(f.props.kind, w.mode)), M = k && k.mode === "wall" && w.mode === "wall" && w.aim !== void 0 ? { ...k, aim: w.aim } : k;
    s = M ? Si(o, f.id, Qs(o, f.props, h(o, f.placement, M, m, y), t.tolMm())) : o;
  }
  function h(d, f, m, w, v) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const b = d.walls.find((E) => E.id === f.wallId);
    if (!b) return m;
    const y = ce(d, b), k = Math.max(0, Math.min(y.len, f.offset + Y(P(w, l), y.dir))), M = ct(y, v).side, x = t.tolMm(), L = f.side === "left" ? M < -(y.rightOff + x) ? "right" : "left" : M > y.leftOff + x ? "left" : "right";
    return { ...m, offset: k, side: L };
  }
  return {
    id: "device-select",
    down(d) {
      u(), l = d.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, d)) return;
      const w = eu(f, d.pt, m);
      if (!w) {
        a(null);
        return;
      }
      a({ kind: "device", id: w });
      const v = f.devices.find((y) => y.id === w), b = ae(f, v);
      o = s = f, n = { id: w, grab: hv(f, v, (b == null ? void 0 : b.pt) ?? null, d.pt) };
    },
    move(d) {
      i.active() ? i.move(d) : p(d);
    },
    up(d) {
      if (i.end(d)) return;
      n && p(d);
      const f = s, m = o, w = r, v = n == null ? void 0 : n.id;
      u(), w && f && m && f !== m && dv(m, f, v) && t.commit(f);
    },
    key(d) {
      return d === "Escape" && i.cancel() ? !0 : d === "Escape" && n ? (u(), !0) : !1;
    },
    preview() {
      const d = i.working();
      return d ? { level: d } : n && s ? { level: s } : {};
    },
    cancel() {
      i.cancel(), u(), a(null);
    }
  };
}
function fv(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = eu(t.level(), e.pt, t.tolMm());
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
const _s = 40, mv = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function gv(t, e, n, i) {
  const o = t.blocks.find((f) => f.id === e);
  if ((o == null ? void 0 : o.kind) !== "bus") return t;
  const s = o.w >= o.h, r = s ? o.x : o.y, l = s ? o.w : o.h, a = Nn(s ? i.x : i.y), u = n === "start" ? Math.min(a, r + l - _s) : r, p = n === "end" ? Math.max(a, r + _s) : r + l;
  if (u === r && p === r + l) return t;
  const h = s ? { x: u, w: p - u } : { y: u, h: p - u }, d = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * l - u) / (p - u))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...h } : f),
    wires: t.wires.map((f) => {
      const m = d(f.from), w = d(f.to);
      return m === f.from && w === f.to ? f : { ...f, from: m, to: w };
    })
  };
}
function bv(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, o = !1;
  };
  function l(p, h) {
    const d = ys(p, h, t.tolMm(), t.geo());
    return (d == null ? void 0 : d.kind) === "port" ? { block: d.block, port: d.port } : (d == null ? void 0 : d.kind) === "bus" ? { bus: d.id, at: d.at } : (d == null ? void 0 : d.kind) === "bus-end" ? { bus: d.id, at: d.end === "start" ? 0 : 1 } : null;
  }
  function a(p) {
    const h = e, d = n;
    if (!h || !d || !o && z(p.pt, s) <= ko / t.scale()) return;
    if (o = !0, h.kind === "wire") {
      const v = l(d, p.pt);
      e = { ...h, to: p.pt, ok: !!v && !("error" in Vl(d, h.from, v, t.geo())) };
      return;
    }
    if (h.kind === "bus-end") {
      i = gv(d, h.id, h.end, p.pt);
      return;
    }
    const f = d.blocks.find((v) => v.id === (h.kind === "pin" ? h.from.block : h.id));
    if (!f) return;
    if (h.kind === "pin") {
      i = Bf(d, f.id, h.from.port, nm(Ie(f, t.geo(), d), p.pt));
      return;
    }
    const m = Nn(f.x + p.pt.x - s.x), w = Nn(f.y + p.pt.y - s.y);
    i = m === f.x && w === f.y ? d : Hf(d, f.id, m, w);
  }
  function u(p, h, d) {
    const f = l(p, d);
    if (!f) return;
    const m = Vl(p, h, f, t.geo());
    if ("error" in m) {
      t.notify(c(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(p) {
      r(), s = p.pt;
      const h = t.power(), d = ys(h, p.pt, t.tolMm(), t.geo());
      if (!d) {
        t.select(null);
        return;
      }
      if (d.kind === "chip") {
        t.setPosition(d.block, d.position);
        return;
      }
      if (d.kind === "wire") {
        t.select({ kind: "powerWire", id: d.id });
        return;
      }
      if (n = i = h, d.kind === "port") {
        const f = { block: d.block, port: d.port };
        if (mv(h, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = h.blocks.find((v) => v.id === d.block), w = vo(h, m, t.geo()).find((v) => v.name === d.port).pt;
        e = { kind: "wire", from: f, at: w, to: w, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: d.id }), e = d.kind === "bus-end" ? { kind: "bus-end", id: d.id, end: d.end } : { kind: "move", id: d.id };
    },
    move(p) {
      a(p);
    },
    up(p) {
      a(p);
      const h = e, d = n, f = i, m = o;
      if (r(), !(!h || !d)) {
        if (!m) {
          (h.kind === "wire" || h.kind === "pin") && t.select({ kind: "powerBlock", id: h.from.block });
          return;
        }
        h.kind === "wire" ? u(d, h.from, p.pt) : f && f !== d && t.commitPower(f);
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
function vv(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var u;
      let o;
      if (n === "device") {
        const p = t.placeDeviceId();
        if (!p) {
          t.notify(c("power.pickDevice"));
          return;
        }
        o = p;
      }
      const s = t.power(), r = Vf(n, { x: 0, y: 0 }, s, o), l = Ie(r, t.geo(), Pl(s, r)), a = { ...r, x: Nn(i.pt.x - l.w / 2), y: Nn(i.pt.y - l.h / 2) };
      t.commitPower(Pl(s, a)), n === "device" && ((u = t.devicePlaced) == null || u.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function wv(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = ud(t.level(), e.pt, t.tolMm())[0];
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
const $v = ["select", "box", "wall", "door", "window", "opening", "zone"], yv = [
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
  "virtual_switch",
  "speaker",
  "exhaust_fan",
  "equipment"
], kv = ["binding-select"], xv = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Mv = ["zone-pick"], pd = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, _v = {
  plan: $v,
  equipment: yv,
  binding: kv,
  power: xv,
  automation: Mv
};
function Sr(t) {
  return _v[t];
}
function As(t, e) {
  switch (t) {
    case "select":
      return ov(e);
    case "box":
      return sv(e);
    case "wall":
      return rv(e);
    case "door":
    case "window":
    case "opening":
      return lv(e, t);
    case "zone":
      return uv(e);
    case "device-select":
      return pv(e);
    case "binding-select":
      return fv(e);
    case "power-select":
      return bv(e);
    case "zone-pick":
      return wv(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return vv(e, t);
    default:
      return i1(e, t);
  }
}
function Go(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((o) => o.id === e.id) : e.kind === "powerWire" ? n.wires.some((o) => o.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((o) => o.id === e.id);
}
const Av = {
  select: Jt,
  box: Rm,
  wall: Bm,
  door: vm,
  window: jm,
  opening: wm,
  zone: Dm,
  "device-select": Jt,
  ceiling_light: pm,
  wall_light: Fm,
  motion_sensor: Tu,
  illuminance_sensor: hm,
  climate_sensor: Nm,
  wall_switch: Pu,
  smart_button: xm,
  valve: Hm,
  leak_sensor: zu,
  socket: Vu,
  virtual_switch: Vm,
  speaker: Om,
  phone: fm,
  exhaust_fan: Nu,
  equipment: Bl,
  "binding-select": Jt,
  "zone-pick": Jt,
  "power-select": Jt,
  "power-device": Bl,
  "power-bus": Cm,
  "power-battery": dm,
  "power-pv": Hu,
  "power-transfer": Em,
  "power-remainder": mm
}, fd = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${Av[t]}></path>`}</svg>`;
function Sv(t) {
  switch (t.saveState) {
    case "saving":
      return c("save.saving");
    case "conflict":
      return c("save.conflict");
    case "error":
      return c("save.error");
    default:
      return t.dirty ? c("save.dirty") : c(t.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Lv(t) {
  return g`
    <div class="top"><div class="bar">
      ${t.lead ?? $}
      ${t.plans.length > 1 ? g`
        <select class="plan-pick" aria-label=${c("plan.pick")} title=${c("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${Q(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => g`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : $}
      <button class="btn" data-action="new-plan" title=${c("plan.new")} aria-label=${c("plan.new")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${c("plan.delete")} aria-label=${c("plan.delete")}
        ?disabled=${t.busy || t.saveState === "saving"} @click=${t.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${c("action.undo")} aria-label=${c("action.undo")} ?disabled=${!t.canUndo}
        @click=${t.onUndo}>↶</button>
      <button class="btn" title=${c("action.redo")} aria-label=${c("action.redo")} ?disabled=${!t.canRedo}
        @click=${t.onRedo}>↷</button>
      <span class="save-state ${t.saveState}" title=${t.saveState === "error" ? t.errorMessage ?? "" : ""}>
        ${Sv(t)}${t.saveState === "error" && t.errorMessage ? g`: ${t.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${c("action.save")}</button>
    </div>${t.steps}</div>`;
}
const Cv = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function md(t, e, n) {
  return Sr(t).map((i) => {
    const o = t === "plan" ? pd[i] : void 0, s = c(`tool.${i}`);
    return g`
      ${Cv.includes(i) ? g`<div class="tool-sep"></div>` : $}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${o ?? $}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${o ?? $}
        title=${o ? `${s} (${o})` : s} @click=${() => n(i)}>
        ${fd(i)}<span class="tlabel">${s}</span></button>`;
  });
}
function Iv(t, e, n) {
  return g`<div class="tools">${md(t, e, n)}</div>`;
}
const ti = ["plan", "equipment", "binding", "power", "automation"], nn = (t, e, n) => c(t === 1 ? e : n).replace("{n}", String(t));
function Ev(t, e, n, i, o = 0) {
  const { walls: s, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((p) => p.invalid).length, u = a ? `, ${c("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${nn(s.length, "steps.wall", "steps.walls")}, ${nn(r.length, "steps.zone", "steps.zones")}${u}`,
        done: s.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: nn(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Ws(l.map(n));
      return {
        text: c("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: nn(i.blocks.length, "steps.block", "steps.blocks"), done: Gf(i) };
    case "automation":
      return { text: nn(o, "steps.rule", "steps.rules"), done: o > 0 };
  }
}
const ma = (t, e) => c(t).replace("{step}", c(`mode.${e}`));
function Ov(t) {
  const e = ti.indexOf(t.mode), n = ti[e - 1], i = ti[e + 1];
  return g`
    <nav class="steps" aria-label=${c("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Q(t.planName)} aria-label=${c("plan.name")} title=${c("plan.name")}
          @change=${(o) => t.onRename(o.target.value)} />
        <span class="app">${c("steps.app")}</span>
      </div>
      ${ti.map((o, s) => {
    const r = Ev(o, t.level, t.status, t.power, t.rules), l = o === t.mode;
    return g`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${o}
          aria-current=${l ? "step" : $} @click=${() => t.onMode(o)}>
          <span class="n">${s + 1}</span><span class="name">${c(`mode.${o}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${ma("steps.back", n)}</button>` : $}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${ma("steps.next", i)}</button>` : $}
      </div>
    </nav>`;
}
const Dv = ["unbound", "bound", "all"], Nv = /* @__PURE__ */ new WeakMap(), mn = (t) => t.placement.mode === "none";
function gd(t) {
  return Te(Nv, t, (e) => [...e.devices].sort((n, i) => Number(mn(n)) - Number(mn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Pv(t, e, n) {
  const i = gd(t), o = e === null ? -1 : i.findIndex((s) => s.id === e);
  for (let s = 1; s <= i.length; s++) {
    const r = i[(o + s) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const bd = (t) => c(`device.${t.props.kind}`), ga = (t) => t.props.kind === "equipment" ? kr(t) : bd(t), Tv = (t, e) => t === "all" || t === "bound" == (e === "bound");
function Vv(t, e, n) {
  return e === 0 ? c("binding.noDevices") : n || t.filter === "all" ? c("binding.noMatch") : c(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function ba(t) {
  const e = c(t.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function Hv(t) {
  var l;
  if (t.collapsed) return g`<div class="blist collapsed">${ba(t)}</div>`;
  const e = gd(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Ws(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), o = e.filter(({ d: a, st: u }) => Tv(t.filter, u) && (!i || a.name.toLowerCase().includes(i) || bd(a).toLowerCase().includes(i) || ga(a).toLowerCase().includes(i))), s = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, u) => {
    const p = Dh(a);
    return g`<button class="brow${a.id === s ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${u}" role="img" aria-label=${c(`bindstatus.${u}`)} title=${c(`bindstatus.${u}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${ga(a)}</small></span>
      <span class="cnt">${p.filled}/${p.total}</span>
    </button>`;
  };
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${c("binding.show")}>
          ${Dv.map((a) => g`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${c(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${ba(t)}
      </div>
      <input class="list-search" type="search" placeholder=${c("binding.search")} aria-label=${c("binding.search")}
        .value=${Q(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${o.length === 0 ? g`<p class="empty">${Vv(t, e.length, i)}</p>` : g`
          ${o.filter((a) => !mn(a.d)).map((a) => r(a.d, a.st))}
          ${o.some((a) => mn(a.d)) ? g`<div class="bgroup" data-group="unplaced">
            <h5>${c("devices.unplaced")}</h5>
            ${o.filter((a) => mn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : $}`}
      </div>
    </div>`;
}
function zv() {
  return {
    door: { width: di.door, hinge: "start", swing: "left" },
    window: { width: di.window, outside: "left" },
    opening: { width: di.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Rv(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function vd(t) {
  return Fs(c("zones.default"), t.zones.map((e) => e.name));
}
const Bv = (t) => t === "door" || t === "window" || t === "opening";
function Fv(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return $;
  const n = t.tool, i = e[n].width, o = ["left", "right"].map((r) => ({ v: r, label: c(`side.${r}`) })), s = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return g`
    <h4>${c(`props.next.${n}`)}</h4>
    ${H(`${c("props.width")}, ${c("unit.mm")}`, Ke({
    value: i,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: t.setNotice,
    field: "next-width",
    skipSame: !0,
    apply: (r) => {
      s({ width: r });
    }
  }))}
    ${n === "door" ? g`
      ${H(c("props.hinge"), se(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: c(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && s({ hinge: r });
    },
    "next-hinge"
  ))}
      ${H(c("props.swing"), se(e.door.swing, o, (r) => {
    r !== e.door.swing && s({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? H(c("props.outside"), se(
    e.window.outside,
    o,
    (r) => {
      r !== e.window.outside && s({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class Uv {
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
const Ss = (t) => typeof t == "object" && t !== null && !Array.isArray(t), gn = (t) => typeof t == "string" && t ? t : null, va = (t) => typeof t == "number" && Number.isFinite(t), Ls = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function wd(t) {
  return t.switchesMigrated || !t.devices.some(Ls) ? t : { ...t, switchesMigrated: !0 };
}
function Wv(t, e, n) {
  const i = Bc(t, n);
  let o = i.level;
  const s = Ss(e.switch) ? e.switch : {}, r = [["power", gn(e.power)], ["voltage", gn(e.voltage)], ["control", gn(s.entity)]];
  for (const [l, a] of r) a && (o = eo(o, i.id, l, a));
  return s.controllable === !0 && (o = ao(o, i.id, !0)), { level: o, id: i.id };
}
function jv(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Ss(i) && Array.isArray(i.blocks)) {
    let o = 0, s = !1;
    const r = i.blocks.map((l) => {
      if (!Ss(l)) return l;
      if (l.kind === "meter" && gn(l.id) && va(l.x) && va(l.y)) {
        o++;
        const a = Wv(e, l, gn(l.name) ?? `Meter ${o}`);
        return e = a.level, s = !0, {
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
        const { inverter: a, ...u } = l;
        return a === !0 && typeof l.deviceId == "string" && (e = Wc(e, l.deviceId, !0)), s = !0, u;
      }
      return l;
    });
    s && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Ls)) {
    for (const o of t.level.devices) Ls(o) && (e = ao(e, o.id, !0));
    e = wd(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
const zi = 3600;
function Re(t) {
  return { id: oe(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const qv = (t, e) => [...t, e], Zv = (t, e) => t.map((n) => n.id === e.id ? e : n), Gv = (t, e) => t.filter((n) => n.id !== e);
function Kv(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const Xv = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, Lr = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).filter((n) => typeof n == "object" && n !== null && !st(n) && !_e(n));
}, Yv = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).flatMap((n) => typeof n == "object" && n !== null && _e(n) && typeof n.event == "object" && n.event !== null && typeof n.event.rule == "string" ? [n.event.rule] : []);
}, Ri = (t) => [...[...t.inputs, ...Lr(t), ...t.gate ? [t.gate] : []].flatMap(Xv), ...Yv(t)];
function Cr(t) {
  return t.motionLight ? ["auto", "manual"] : t.boiler ? ["auto", "manual", "done"] : [];
}
const $d = (t, e) => `${t}: ${c(`control.event.${e}`)}`, yd = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, Qv = (t, e) => t.filter((n) => n.id !== e && Ri(n).includes(e));
function Jv(t, e) {
  const n = new Map(t.map((s) => [s.id, s]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), o = (s, r) => {
    if (s === e.id && r.length > 0) return r;
    if (r.includes(s) || i.has(s)) return null;
    const l = n.get(s);
    if (!l) return null;
    for (const a of Ri(l)) {
      const u = o(a, [...r, s]);
      if (u) return u;
    }
    return i.add(s), null;
  };
  for (const s of Ri(e)) {
    const r = o(s, [e.id]);
    if (r) return r;
  }
  return null;
}
const Bi = /^([01]\d|2[0-3]):[0-5]\d$/, kt = (t) => typeof t == "number" && Number.isFinite(t);
function ew(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return kt(e.below) && e.below > 0 && kt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && Bi.test(n) && Bi.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const wa = (t) => Number.isInteger(t) && t >= 0 && t <= zi;
function tw(t, e, n, i, o, s, r, l, a, u, p, h, d, f, m, w, v, b, y, k, M, x, L, E) {
  var q;
  const A = [];
  e.name.trim() || A.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && !e.motionLight && A.push("inputs");
  const O = e.control, U = (Array.isArray(O == null ? void 0 : O.sources) ? O.sources : []).filter((D) => typeof D == "object" && D !== null && st(D)).map((D) => D.button), S = O ? [O.on, O.off, O.toggle].flatMap((D) => Array.isArray(D) ? D : []) : [], I = [...e.inputs, ...Lr(e), ...e.gate ? [e.gate] : []], T = [...I.flatMap(yd), ...e.onTrue.map((D) => D.device), ...e.onFalse.map((D) => D.device)], V = I.flatMap((D) => "light" in D.source ? [D.source.light] : "daylight" in D.source ? [D.source.daylight] : []);
  (T.some((D) => !n(D)) || V.some((D) => !(o ?? n)(D)) || e.vent && [e.vent.sensor, e.vent.than].some((D) => !(s ?? n)(D)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((D) => !(p ?? n)(D)) || e.leak.valves.some((D) => !(h ?? n)(D))) || e.timed && (!(d ?? n)(e.timed.button) || !(f ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(o ?? n)(e.outside.sensor)) || e.beurer && (!(w ?? n)(e.beurer.heater) || !(v ?? n)(e.beurer.source)) || e.motionLight && (!(k ?? n)(e.motionLight.light) || e.motionLight.sensors.some((D) => !(M ?? n)(D)) || e.motionLight.buttons.some((D) => !(x ?? n)(D)) || e.motionLight.daylight && !(o ?? n)(e.motionLight.daylight.sensor) || e.motionLight.blocker && !(E ?? n)(e.motionLight.blocker.device)) || U.some((D) => !(b ?? n)(D)) || S.some((D) => !(y ?? n)(D.device))) && A.push("device-missing");
  const F = new Set(t.map((D) => D.id));
  Ri(e).some((D) => D !== e.id && !F.has(D)) && A.push("rule-missing"), Jv(t, e) && A.push("cycle"), (!wa(e.onDelay) || !wa(e.offDelay)) && A.push("delay");
  for (const D of I) {
    const ge = ew(D);
    ge && !A.includes(ge) && A.push(ge);
  }
  return e.vent && iw(e, e.vent) && A.push("vent"), e.boiler && Cw(e, e.boiler) && A.push("boiler"), e.leak && ow(e, e.leak) && A.push("leak"), e.timed && aw(e, e.timed) && A.push("timed"), e.outside && dw(e, e.outside) && A.push("outside"), e.beurer && hw(e, e.beurer) && A.push("beurer"), e.control && vw(e, e.control, t) && A.push("control"), e.motionLight && _w(e, e.motionLight) && A.push("motionLight"), L && nw(e, L) && A.push("virtual-read"), [...e.onTrue, ...e.onFalse, ...S].some((D) => typeof D == "object" && D !== null && $e(D.do) && mw(D)) && A.push("announce"), (q = e.boiler) != null && q.button && u && !A.includes("device-missing") && !u(e.boiler.button) && A.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((D) => {
    const ge = i(D.device);
    return ge !== void 0 && !ge.includes(D.do);
  }) && A.push("action"), O && S.some((D) => !pw.includes(D.do) || i && !fw(D.do, i(D.device))) && A.push("action"), A;
}
function nw(t, e) {
  const n = new Set(t.inputs.flatMap((i) => "device" in i.source ? [i.source.device] : []));
  return [...t.onTrue, ...t.onFalse].some((i) => e(i.device) && n.has(i.device));
}
function iw(t, e) {
  if (t.inputs.length > 0 || t.motionLight || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !kt(e.above) || !kt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function ow(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((o) => typeof o == "string" && o !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const sw = (t) => t.leak !== void 0;
function rw(t, e, n) {
  const i = Re(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const o = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), s = o ? Ze(o, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: s.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: s.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const lw = 15;
function aw(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const cw = (t) => t.timed !== void 0, uw = 30;
function dw(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && Bi.test(n) && Bi.test(i) && n !== i);
}
const ni = { above: 200, offDelay: 60, keep: 10, every: 30 };
function hw(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !kt(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
const pw = ["on", "off", "toggle", "close", "say", "play", "notify"];
function bn(t) {
  const e = te(t), n = e.filter($e);
  return n.length > 0 ? n : e.includes("on") && e.includes("off") ? ["on", "off", "toggle"] : e.includes("close") ? ["close"] : [];
}
const fw = (t, e) => e === void 0 || ($e(t) ? e.includes(t) : t === "close" ? e.includes("close") : e.includes("on") && e.includes("off")), $a = (t) => typeof t == "string" && t.trim() !== "";
function mw(t) {
  const e = t, n = t.do === "play" ? "media" : "text", i = t.do === "notify" ? "title" : null;
  return !$a(e[n]) || Object.keys(e).some((o) => o !== "device" && o !== "do" && o !== n && o !== i) || i !== null && i in e && !$a(e[i]);
}
const gw = (t) => $e(t.do) ? `${t.device}|${t.do}` : t.device;
function bw(t, e) {
  if (typeof t != "object" || t === null || Object.keys(t).length !== 1) return !1;
  const n = t.event;
  if (typeof n != "object" || n === null || Object.keys(n).sort().join() !== "rule,what") return !1;
  const { rule: i, what: o } = n;
  if (typeof i != "string" || i === "" || typeof o != "string" || o === "") return !1;
  const s = e.find((r) => r.id === i);
  return s === void 0 || Cr(s).includes(o);
}
function kd(t, e) {
  const n = (i, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).sort(([s], [r]) => s < r ? -1 : 1)) : o;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function vw(t, e, n) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.motionLight || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const i = [e.on, e.off, e.toggle];
  if (!Array.isArray(e.sources) || e.sources.length === 0 || !i.every(Array.isArray) || i.every((l) => l.length === 0)) return !0;
  const o = (l) => typeof l == "object" && l !== null && (_e(l) ? bw(l, n) : st(l) ? typeof l.button == "string" && l.button !== "" : typeof l.source == "object" && l.source !== null);
  if (!e.sources.every(o) || e.sources.some((l, a) => e.sources.some((u, p) => p < a && kd(l, u)))) return !0;
  const s = (l) => l.every((a) => typeof a == "object" && a !== null && typeof a.device == "string" && a.device !== "") && new Set(l.map(gw)).size === l.length;
  if (!i.every(s)) return !0;
  const r = new Set(Lr(t).flatMap(yd));
  return i.some((l) => l.some((a) => !$e(a.do) && r.has(a.device)));
}
const ya = (t) => t.control !== void 0;
function ww(t, e, n) {
  var d, f;
  const i = Re(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const o = e === null ? void 0 : t.levels.find((m) => m.zones.some((w) => w.id === e)), s = o ? Ze(o, e).filter((m) => m.participates).map((m) => m.device) : [], r = s.filter((m) => m.props.kind === "wall_switch" || m.props.kind === "smart_button"), l = s.filter((m) => {
    const w = te(m);
    return w.includes("on") && w.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, u = l.length === 1 ? l[0] : void 0, p = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((d = a.bindings) != null && d.state) && a.bindings.state === ((f = u == null ? void 0 : u.bindings) == null ? void 0 : f.control), h = (m) => u && !p ? [{ device: u.id, do: m }] : [];
  return i.control = { sources: a ? [a.props.kind === "smart_button" ? { button: a.id } : { source: { device: a.id } }] : [], on: h("on"), off: h("off"), toggle: h("toggle") }, i;
}
function $w(t, e) {
  const n = t.control;
  if (!n || "on" in n || !Array.isArray(n.sources) || !Array.isArray(n.loads) || ![...n.sources, ...n.loads].every((r) => typeof r == "string")) return t;
  const i = n.loads, o = (r) => i.map((l) => ({ device: l, do: r })), s = n.sources.map((r) => e(r) === "smart_button" ? { button: r } : { source: { device: r } });
  return { ...t, control: { sources: s, on: o("on"), off: o("off"), toggle: o("toggle") } };
}
const yw = (t) => t.beurer !== void 0;
function kw(t, e) {
  const n = Re(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = ni.offDelay, n.beurer = { heater: "", source: "", above: ni.above, keep: ni.keep, every: ni.every }, n;
}
const xw = (t) => t.outside !== void 0;
function Mw(t, e, n) {
  const i = Re(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((u) => u.id === e)), r = (o ? Ze(o, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && te(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: uw }, i;
}
const ii = { offDelay: 180, minOn: 0, autoAfter: 0, is: "dark" };
function _w(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (o) => Array.isArray(o) && o.every((s) => typeof s == "string" && s !== "") && new Set(o).size === o.length;
  if (typeof e.light != "string" || e.light === "" || !n(e.sensors) || !n(e.buttons) || e.sensors.includes(e.light) || e.buttons.includes(e.light) || e.daylight !== void 0 && (typeof e.daylight != "object" || e.daylight === null || typeof e.daylight.sensor != "string" || e.daylight.sensor === "" || e.daylight.is !== "night" && e.daylight.is !== "dark")) return !0;
  const i = e.blocker;
  return i !== void 0 && (typeof i != "object" || i === null || typeof i.device != "string" || i.device === "" || i.device === e.light || i.is !== "on" && i.is !== "off") ? !0 : !Number.isInteger(e.minOn) || e.minOn < 0 || e.minOn > 3600 || !Number.isInteger(e.autoAfter) || e.autoAfter < 0 || e.autoAfter > 1440;
}
const ka = (t) => {
  const e = te(t);
  return e.includes("on") && e.includes("off");
}, Aw = (t) => t.motionLight !== void 0, xa = (t) => {
  var e;
  return t.props.kind === "smart_button" || t.props.kind === "wall_switch" && !!((e = t.bindings) != null && e.state);
};
function Sw(t, e, n) {
  const i = Re(e);
  i.name = e !== null && n ? `Light motion control ${n}` : "Light motion control", i.offDelay = ii.offDelay;
  const o = e === null ? void 0 : t.levels.find((u) => u.zones.some((p) => p.id === e)), s = o ? Ze(o, e).filter((u) => u.participates).map((u) => u.device) : [], r = s.filter((u) => (u.props.kind === "ceiling_light" || u.props.kind === "wall_light") && te(u).includes("on") && te(u).includes("off")), l = t.levels.flatMap((u) => u.devices).filter((u) => u.props.kind === "illuminance_sensor"), a = r.length === 1 ? r[0] : void 0;
  return i.motionLight = {
    light: a ? a.id : "",
    sensors: s.filter((u) => u.props.kind === "motion_sensor").map((u) => u.id),
    ...l.length === 1 ? { daylight: { sensor: l[0].id, is: ii.is } } : {},
    minOn: ii.minOn,
    buttons: s.filter((u) => {
      var p, h;
      return u.props.kind === "smart_button" || !!((p = a == null ? void 0 : a.bindings) != null && p.control) && u.props.kind === "wall_switch" && ((h = u.bindings) == null ? void 0 : h.state) === a.bindings.control;
    }).map((u) => u.id),
    autoAfter: ii.autoAfter
  }, i;
}
function Lw(t, e, n) {
  const i = Re(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((u) => u.id === e)), s = o ? Ze(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = s.filter((a) => {
    const u = te(a);
    return u.includes("on") && u.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: lw }, i;
}
function Cw(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !kt(n.limit) || !kt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const Iw = (t) => t.boiler !== void 0, Cs = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function xd(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Md = 3e3, _d = 1400;
function Ew(t, e, n) {
  var u;
  const i = Re(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const o = e === null ? void 0 : t.levels.find((p) => p.zones.some((h) => h.id === e)), s = o ? Ze(o, e).filter((p) => p.participates).map((p) => p.device) : [], r = s.filter(Cs), l = s.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((u = t.power) == null ? void 0 : u.blocks) ?? []).filter((p) => p.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Md, nominal: _d }), i;
}
const Ow = (t) => t.vent !== void 0, Dw = 600;
function Nw(t, e, n) {
  var l;
  const i = Re(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = Dw;
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((u) => u.id === e)), s = o ? Ze(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = s.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const Pw = 1800;
function Tw(t, e, n, i) {
  const o = Re(e);
  return o.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", o.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Pw } } }], o;
}
const Vw = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve", "virtual_switch"]), Ko = (t) => Vw.has(t.props.kind);
function te(t) {
  var n;
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "speaker" ? (n = t.bindings) != null && n.voice ? ["say", "play"] : ["play"] : e.kind === "phone" ? e.notify ? ["notify"] : [] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" || e.kind === "virtual_switch" ? ["on", "off"] : [];
}
const vi = (t, e) => kd(t, e);
class Hw {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await Fo(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(sl(c("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = Ce(e);
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
    const n = await Pg(this.h.hass, e);
    if (n.schemaVersion !== 2) throw new Error(c("load.oldServer"));
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
    e && e.plan.schemaVersion !== 2 && (this.h.drafts.clear(e.planId), this.h.notice = c("drafts.oldDiscarded"), e = null), this.h.pendingDraft = e, e ? this.h.dialog = { kind: "restore" } : this.closeDialog("restore");
  }
  async refreshPlans() {
    if (this.h.hass)
      try {
        this.h.plans = await Fo(this.h.hass);
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
      this.h.notice = Ce(n);
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
    this.h.toolId = Sr(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(sl(c("plan.default"))), this.offerDraft(null);
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
            await Vg(this.h.hass, e.id);
          } catch (s) {
            this.h.save.state = "error", this.h.save.errorMessage = Ce(s);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Fo(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const o = i.find((s) => s.id !== e.id);
        if (o)
          try {
            await this.openPlan(o.id);
            return;
          } catch (s) {
            this.h.notice = Ce(s);
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
    this.h.plan = { ...e, levels: e.levels.map(Gh) };
    const n = jv({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Zf(n.power, { device: (a) => n.level.devices.find((u) => u.id === a) }), o = new Map(this.h.plan.levels.flatMap((a) => a.devices.map((u) => [u.id, u.props.kind]))), s = (l = e.rules) == null ? void 0 : l.map((a) => $w(a, (u) => o.get(u))), r = e.rules && s && e.rules.length > 0 ? s.some((a, u) => a !== e.rules[u]) ? s : e.rules : void 0;
    this.h.history = new Uv({ level: n.level, ...i ? { power: i } : {}, ...r ? { rules: r } : {} }), this.h.lazyPower = $u(), this.h.activeTool.cancel(), this.h.activeTool = As(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: o } = this.h.history.current, s = e.levels.map((u, p) => p === 0 ? wd(n) : u), { power: r, rules: l, ...a } = e;
    return { ...a, levels: s, ...i ? { power: i } : {}, ...o ? { rules: o } : {}, revision: this.h.save.baseRevision ?? 0 };
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
    const e = `${this.h.plan.name} ${c("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), o = await this.h.save.saveAsNew(i, e);
    o && this.keepSaved(i), o ? (this.h.plan = o, this.h.dialog = null, this.afterSaved(n, o.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class zw {
  constructor(e) {
    this.h = e, this.error = null, this.regs = null, this.tried = !1, this.pending = !1, this.base = null, this.merged = null;
  }
  /** A registry load is in progress. */
  get loading() {
    return this.pending;
  }
  get() {
    var r;
    const e = this.h.liveStates ?? ((r = this.h.hass) == null ? void 0 : r.states), n = this.base;
    !n || !Ef(n.states, e) ? this.base = { states: e, meta: If(e) } : n.states = e;
    const i = this.base.meta, o = this.merged;
    if (o && o.base === i && o.regs === this.regs) return o.meta;
    const s = this.regs ? Df(i, this.regs) : i;
    return this.merged = { base: i, regs: this.regs, meta: s }, s;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Of(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = c("binding.registryError").replace("{error}", Ce(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const oi = vc("", "");
function Rw(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? oi;
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
    openingDefaults: (e) => Rv(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? vd(((e = t.history) == null ? void 0 : e.current.level) ?? oi);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? oi).devices;
      return { device: (i) => e.find((o) => o.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Su(((n = t.history) == null ? void 0 : n.current.level) ?? oi, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Is = (t) => c(`zones.kind.${t.shape.kind}`), Ir = (t) => g`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? km : zm}></path>`}</svg>`;
function Ad(t, e) {
  const n = iu(t, e);
  return n ? c(`zones.invalid.${n}`) : null;
}
function Bw(t) {
  var o;
  const e = t.query.trim().toLowerCase(), n = ((o = t.selection) == null ? void 0 : o.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((s, r) => ({ z: s, hue: _r(r) })).filter(({ z: s }) => !e || s.name.toLowerCase().includes(e) || Is(s).toLowerCase().includes(e));
  return g`
    <div class="zlist">
      <div class="zhead"><span>${c("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${c("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${c("zones.filter")}
        aria-label=${c("zones.filter")} .value=${Q(t.query)}
        @input=${(s) => t.onQuery(s.target.value)} />
      <div class="rows">
        ${i.map(({ z: s, hue: r }) => {
    var a;
    const l = s.invalid ? Ad(t.level, s) ?? "" : null;
    return g`<button class="zrow${s.id === n ? " sel" : ""}" data-id=${s.id} @click=${() => t.onPick(s.id)}>
            ${l === null ? g`<span class="zswatch" style=${`background:${r}`}></span>` : g`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${s.name}</span>
            <span class="zkind" data-kind=${s.shape.kind} title=${Is(s)}>${Ir(s.shape.kind)}</span>
            <span class="zarea">${((a = er(t.level, s)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
const Sd = (t, e, n) => g`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Mr(e)}
    @change=${(i) => n(i.target.checked)} />${c("zones.automation")}</label>`;
function Fw(t, e, n) {
  const i = Ze(t, e.id);
  return g`<div class="zmembers">
    <div class="zhead"><span>${c("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? g`<span>${c("zones.participates")}</span>` : $}</div>
    ${i.length === 0 ? g`<p class="muted">${c("zones.noMembers")}</p>` : i.map(({ device: o, participates: s }) => g`
      <label class="member" data-device=${o.id}>
        <span class="nm"><span class="name">${o.name}</span><small class="kind">${c(`device.${o.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${c("zones.participates")} .checked=${Mr(s)}
          @change=${(r) => {
    const l = hu(t, o.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Ma(t, e, n) {
  const i = Ad(t, e), o = e.shape.kind === "walls" && e.shape.broken;
  return g`<div class="zprops">
    <h4>${c("props.zone")}</h4>
    ${H(c("props.name"), g`<input class="val wide" type="text" data-field="zone-name" .value=${Q(e.name)}
      @change=${(s) => {
    const r = s.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(ff(t, e.id, l));
  }} />`)}
    ${H(c("props.area"), g`<span class="val ro" data-field="zone-area">${sd(er(t, e))}</span>`)}
    ${H(c("zones.outline"), g`<span class="val ro zkindval" data-field="zone-kind">${Ir(e.shape.kind)}${Is(e)}</span>`)}
    ${Sd("zone-automation", e.automation !== !1, (s) => {
    const r = sr(t, e.id, s);
    r !== t && n(r);
  })}
    ${i ? g`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${o ? g`<button class="btn" data-action="keep-outline" @click=${() => n(vf(t, e.id))}>
        ${c("zones.keepOutline")}</button>` : $}</div>` : $}
    ${Fw(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(du(t, e.id))}>
      ${c("zones.delete")}</button>
  </div>`;
}
function Uw(t) {
  const e = t.next.zone, n = e.name ?? vd(t.level), i = (o) => t.setNext({ ...t.next, zone: { ...e, ...o } });
  return g`
    <h4>${c("props.nextZone")}</h4>
    <div class="muted">${c("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${c("zones.method")}>
      ${["walls", "polygon"].map((o) => g`
        <button class=${e.method === o ? "on" : ""} role="radio" aria-checked=${String(e.method === o)} data-method=${o}
          @click=${() => {
    o !== e.method && t.onMethod(o);
  }}>${Ir(o)}<span>${c(`zones.kind.${o}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${c(`zones.hint.${e.method}`)}</p>
    ${H(c("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${Q(n)}
      @change=${(o) => {
    const s = o.target, r = s.value.trim();
    if (!r) {
      s.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Sd("next-zone-automation", e.automation, (o) => i({ automation: o }))}`;
}
function Ld(t, e, n) {
  return Ke({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function _a(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function Ww(t, e) {
  const n = ce(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], o = (s) => e.commit(Lf(e.level, t.id, s));
  return g`
    <h4>${c("props.wall")}</h4>
    ${H(c("props.type"), se(
    t.type,
    i.map((s) => ({ v: s, label: c(`walltype.${s}`) })),
    (s) => o({ type: s }),
    "wall-type"
  ))}
    ${H(c("props.thickness"), Ld(e, t.thickness, (s) => {
    o({ thickness: s });
  }))}
    ${H(c("props.baseline"), se(
    t.baseline,
    ["center", "left", "right"].map((s) => ({ v: s, label: c(`baseline.${s}`) })),
    (s) => o({ baseline: s })
  ))}
    ${H(c("props.length"), g`<span class="val ro">${bt(n)} ${c("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(cr(e.level, t.id))}>
      ${c("action.delete")}</button>`;
}
function jw(t, e) {
  const n = ["door", "window", "opening", ..._i.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Ip(e.level, t.id, r)), o = ["left", "right"].map((r) => ({ v: r, label: c(`side.${r}`) })), s = _i.includes(t.kind);
  return g`
    <h4>${c(`kind.${t.kind}`)}</h4>
    ${H(c("props.kind"), se(t.kind, n.map((r) => ({ v: r, label: c(`kind.${r}`) })), (r) => i(Cp(t, r))))}
    ${H(c("props.width"), Ld(e, t.width, (r) => _a(e, Lp(e.level, t.id, r))))}
    ${H(c("props.offset"), Ke({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => _a(e, Vc(e.level, t.id, r))
  }))}
    ${s ? g`
      ${H(c("props.hinge"), se(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: c(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${H(c("props.swing"), se(t.swing ?? "left", o, (r) => i({ swing: r })))}` : $}
    ${t.kind === "window" ? H(c("props.outside"), se(t.outside ?? "left", o, (r) => i({ outside: r }))) : $}
    ${H(c("props.passesLight"), g`<input type="checkbox" data-field="passesLight" .checked=${Q(Dc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Oc(t.kind) ? void 0 : l });
  }} />`)}
    ${H(c("props.passesPir"), g`<input type="checkbox" data-field="passesPir" .checked=${Q(Pc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Nc(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? g`<p class="warn">${c("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Hc(e.level, t.id))}>
      ${c("action.delete")}</button>`;
}
function qw(t) {
  const e = ["bearing", "partition", "railing"];
  return g`
    <h4>${c("props.newWall")}</h4>
    ${H(c("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => g`<option value=${n} ?selected=${n === t.wallType}>${c(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${H(`${c("props.thickness")}, ${c("unit.mm")}`, Ke({
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
      <div class="muted">${c("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => g`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${c(`measure.${n}`)}</button>`)}
      </div>` : $}`;
}
const Aa = (t) => Bw({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function Zw(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const o = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((s) => s.id === n.id) : void 0;
    return g`<div class="props">
      ${Uw({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
      ${o ? Ma(e, o, t.commit) : $}
      ${Aa(t)}
    </div>`;
  }
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const o = e.walls.find((s) => s.id === n.id);
    o && (i = Ww(o, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const o = e.openings.find((s) => s.id === n.id);
    o && (i = jw(o, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const o = e.zones.find((s) => s.id === n.id);
    o && (i = Ma(e, o, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const o = e.nodes.find((s) => s.id === n.id);
    o && (i = g`<h4>${c("props.node")}</h4>
      ${H("X", g`<span class="val ro">${bt(o.x)}</span>`)}${H("Y", g`<span class="val ro">${bt(o.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === $ && (t.tool === "wall" || t.tool === "box") ? qw(t) : i === $ && Bv(t.tool) ? Fv({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === $ && t.tool === "select" ? Aa(t) : i === $ ? g`<p class="muted">${c("props.none")}</p>` : i}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    </div>`;
}
const Gw = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Kw = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, Xw = 6, Yw = ["A", "0", "B"], Qw = ["power", "control"], Jw = ["power", "power_in", "power_out", "voltage", "control"], Wt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function on(t, e, n, i) {
  const { [n]: o, ...s } = e, r = i === null ? s : { ...s, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function sn(t, e, n, i, o, s) {
  return g`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${br(t.meta, i, !1)}
      .value=${o ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (o ?? null) && s(l);
  }}></ps-entity-combo>
  </div>`;
}
function e$(t, e) {
  const n = e.name ?? "";
  return H(c("props.name"), g`<input class="val wide" type="text" data-field="name"
    placeholder=${c(`power.kind.${e.kind}`)} .value=${Q(n)} @change=${(i) => {
    const o = i.target, s = o.value.trim();
    s && s !== n ? t.commitPower(Dn(t.power, e.id, { name: s }, Wt(t))) : o.value = n;
  }} />`);
}
function t$(t, e) {
  const n = new Set(Ae(e).map((i) => i.role));
  return g`${Qw.filter((i) => n.has(i)).map((i) => {
    var s;
    const o = (s = e.bindings) == null ? void 0 : s[i];
    return g`<div class="role">
      <div class="role-head"><span class="role-label">${c(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${o ? g`<b>${gi(t.meta, o).name}</b><small>${o}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${c("power.boundHint")}</p>`;
}
function si(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function n$(t, e) {
  var s;
  const n = Ae(e), i = Jw.flatMap((r) => n.filter((l) => l.role === r)), o = e.props;
  return g`
    ${xr(e, (r) => si(t, Mt(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return g`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Ti(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${br(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Ti(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), si(t, eo(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${o.kind === "equipment" && ((s = e.bindings) != null && s.control) ? $t(
    "controllable",
    c("props.controllable"),
    !!o.controllable,
    (r) => si(t, ao(t.level, e.id, r))
  ) : $}
    ${o.kind === "equipment" ? $t("inverter", c("props.inverter"), !!o.inverter, (r) => {
    const l = _u(t.level, t.power, e.id, r);
    return si(t, l.level, l.power);
  }) : $}`;
}
function i$(t, e) {
  const n = t.level.devices.find((o) => o.id === e.deviceId);
  if (!n) return g`<p class="warn" data-note="device-missing">${c("power.missing")}</p>`;
  const i = Zt(n) ? $ : $t("output", c("power.enableOutput"), e.output !== !1, (o) => {
    const s = Wt(t);
    if (o) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(mo(Dn(t.power, e.id, { output: !1 }, s), e.deviceId, s));
    return !0;
  });
  return n.props.kind === "equipment" ? g`${n$(t, n)}${i}` : g`
    ${H(c("props.name"), g`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${H(c("props.kind"), g`<span class="val ro">${c(`device.${n.props.kind}`)}</span>`)}${t$(t, n)}${i}`;
}
function o$(t, e) {
  var o, s;
  const n = (s = (o = t.frame) == null ? void 0 : o.blocks[e.id]) == null ? void 0 : s.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: c(`power.form.${r}`) }));
  return g`
    ${H(c("power.form"), se(e.form, i, (r) => {
    r !== e.form && t.commitPower(Dn(t.power, e.id, { form: r }, Wt(t)));
  }, "form"))}
    <div class="row"><span>${c("power.position")}</span><span class="seg pos">${Yw.map((r) => g`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${c("power.positionHint")}</p>`;
}
function s$(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, o = n ? e.h : e.w, s = (a, u) => {
    if (a === i && u === o) return !1;
    t.commitPower(Dn(t.power, e.id, n ? { w: a, h: u } : { w: u, h: a }, Wt(t)));
  }, r = (a, u, p) => Ke({ value: u, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: p }), l = ["h", "v"].map((a) => ({ v: a, label: c(`power.orientation.${a}`) }));
  return g`
    ${H(c("power.orientation"), se(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(Dn(t.power, e.id, { w: e.h, h: e.w }, Wt(t)));
  }, "bus-orientation"))}
    ${H(c("power.busLength"), r("bus-length", i, (a) => s(Math.max(_s, o + 1, a), o)))}
    ${H(c("power.busThickness"), r("bus-thickness", o, (a) => s(i, Math.min(Math.max(Xw, a), i - 1))))}`;
}
function r$(t, e) {
  switch (e.kind) {
    case "grid":
      return g`
      ${sn(t, "power", c("power.field.power"), gt, e.power, (n) => on(t, e, "power", n))}
      ${sn(t, "voltage", c("power.field.voltage"), Gw, e.voltage, (n) => on(t, e, "voltage", n))}`;
    case "device":
      return i$(t, e);
    case "battery":
      return g`
      ${sn(t, "power", c("power.field.batteryPower"), gt, e.power, (n) => on(t, e, "power", n))}
      ${sn(t, "soc", c("power.field.soc"), Kw, e.soc, (n) => on(t, e, "soc", n))}`;
    case "pv":
      return sn(t, "power", c("power.field.power"), gt, e.power, (n) => on(t, e, "power", n));
    case "transfer":
      return o$(t, e);
    case "bus":
      return s$(t, e);
    default:
      return $;
  }
}
function l$(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((o) => o.id === e.deviceId) : void 0;
  return g`
    <h4>${i ? xo(i) : c(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? $ : e$(t, e)}
    ${r$(t, e)}
    <div class="pactions">
      ${n ? g`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Ff(t.power, e.id))}>${c("power.autoPorts")}</button>` : $}
      ${e.kind === "grid" ? $ : g`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(ku(t.power, e.id))}>${c("action.delete")}</button>`}
    </div>`;
}
function a$(t, e) {
  var o, s;
  const n = Wt(t), i = (r) => {
    const l = t.power.blocks.find((u) => u.id === ("block" in r ? r.block : r.bus)), a = l ? bo(l, n) || c(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return g`
    <h4>${c("power.wire")}</h4>
    ${H(c("power.wire.from"), g`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${H(c("power.wire.to"), g`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${H(c("power.wire.power"), g`<span class="val ro" data-field="wire-power">${xe((s = (o = t.frame) == null ? void 0 : o.wires[e.id]) == null ? void 0 : s.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Au(t.power, e.id))}>${c("action.delete")}</button></div>`;
}
function c$(t) {
  const e = Su(t.level, t.power);
  return g`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = Qu(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${c("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${c("power.help.device")}</p>
    ${e.length === 0 ? g`<p class="muted" data-note="no-devices">${c("power.noDevices")}</p>` : g`<div class="pdevs">
      ${e.map((i) => g`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${xo(i)}</span>
      </button>`)}
    </div>`}`;
}
function u$(t) {
  if (t.toolId === "power-device") return c$(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((o) => o.id === e.id) : void 0;
  if (n) return l$(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((o) => o.id === e.id) : void 0;
  return i ? a$(t, i) : t.toolId !== "power-select" ? g`<p class="muted" data-note="power-hint">${c("power.help.place")}</p>` : g`<p class="muted" data-note="power-hint">${c("power.pick")}</p><p class="muted">${c("power.help.select")}</p>`;
}
function d$(t) {
  return g`<div class="props pprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.feedError ? g`<p class="note" data-notice="feed">${t.feedError}</p>` : $}
    ${u$(t)}
  </div>`;
}
const Sa = /* @__PURE__ */ new Map([["not confirmed", "rules.error.notConfirmed"], ["virtual switch loop", "rules.error.virtualLoop"]]);
function h$(t) {
  var i;
  const e = t.reason !== void 0 ? Sa.get(t.reason) : void 0, n = ((i = t.last) == null ? void 0 : i.error) !== void 0 ? Sa.get(t.last.error) : void 0;
  return !e && !n ? t : { ...t, ...e ? { reason: c(e) } : {}, ...n && t.last ? { last: { ...t.last, error: c(n) } } : {} };
}
function p$(t) {
  return t.error === c("rules.error.notConfirmed");
}
const Cd = "ended: switched elsewhere";
function qn(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
const f$ = {
  "button: auto": "auto",
  "auto again": "autoAgain",
  "button: manual": "manualButton",
  "switched off elsewhere: waits for new motion": "releasedOff",
  "found on": "found",
  // the command sent on entering auto (a fresh decision)
  "back to auto: no motion": "autoOff",
  "back to auto: not dark": "autoOffLight",
  "back to auto: motion": "autoOn",
  // the blocker and the daylight
  blocked: "blocked",
  "unblocked: motion": "unblockedOn",
  "unblocked: no motion": "unblockedOff",
  "unblocked: not dark": "unblockedLight",
  daylight: "daylight"
};
function Id(t) {
  return f$[t.reason];
}
function Ed(t) {
  return t.sent === !1 && (t.reason === Cd || t.reason.startsWith("switched elsewhere"));
}
const Od = 5e3, Dd = 12;
function La(t) {
  t().catch(() => {
  });
}
class m$ {
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
      this.setFailure(c("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && La(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (o) => {
        i.live && this.apply(o);
      },
      { type: "plan_studio/rules/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!i.live) {
          La(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ce(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Dd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Od));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.rules ?? {}).map(([i, o]) => [i, h$(o)]);
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, o] of n) this.map.set(i, o);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
function ve(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Er(t, e = !1) {
  const n = e ? Id(t) : void 0;
  if (n) return c(`motionLight.row.${n}`).replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ve(t.at)).trim();
  if (qn(t)) return c("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", ve(t.at)).trim();
  if (t.sent === !1)
    return c(Ed(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ve(t.at)).trim();
  const i = $e(t.action) ? `${t.target}: ${c(`rules.did.${t.action}`)} ${ve(t.at)}`.trim() : `${c(`rules.did.${t.action}`)} ${t.target} ${ve(t.at)}`.trim();
  return t.error ? `${i}: ${t.error}` : i;
}
function Or(t) {
  return qn(t) ? c("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", ve(t.at)) : c("vent.flow.last").replace("{did}", c(`rules.did.${t.action}`)).replace("{at}", ve(t.at));
}
function g$(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${c("rules.status.error")}: ${e.reason}` : c(`rules.status.${e.status}`) : t.enabled === !1 ? c("rules.status.disabled") : n.live ? c("rules.unsaved") : c("rules.noTrace");
}
function b$(t, e, n) {
  const i = n.trace(t.id), o = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", s = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !vi(r, t);
  return g`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${o} role="img" aria-label=${c(`rules.verdict.${o}`)}
        title=${c(`rules.verdict.${o}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? g` <span class="orphan">(${c("rules.orphan")})</span>` : $}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${g$(t, i, n)}</span>
        ${l ? g`<span class="runsaved">${c("rules.unsavedChanges")}</span>` : $}
        ${s > 0 ? g`<span class="rwarn">${s === 1 ? c("rules.unknown1") : c("rules.unknownN").replace("{n}", String(s))}</span>` : $}
        ${i != null && i.last ? g`<span class="rlast">${Er(i.last, !!i.motionLight)}</span>` : $}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${c("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${c("rules.delete")}</button>
      </div>
    </div>`;
}
function v$(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((o) => o.id === e.id) ?? null : null, i = Kv(t.rules, (n == null ? void 0 : n.id) ?? null, (o) => t.level.zones.some((s) => s.id === o));
  return g`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : c("rules.noZone")}</h4>
      ${t.feedError ? g`<p class="muted">${t.feedError}</p>` : $}
      ${n === null && i.length === 0 && t.rules.length === 0 ? g`<p class="muted">${c("rules.hint")}</p>` : $}
      ${i.length === 0 ? g`<p class="muted rempty">${c("rules.empty")}</p>` : i.map((o) => b$(o, n === null && o.zoneId !== null, t))}
    </div>`;
}
const Nd = {
  condition: gm,
  leak: zu,
  timer: Pm,
  outside: Wm,
  vent: Nu,
  boiler: Um,
  timed: Tm,
  beurer: Mm,
  control: Pu,
  motionLight: Tu
}, w$ = ["condition", "timer", "control"], $$ = ["vent", "boiler", "leak", "timed", "outside", "motionLight", "beurer"], Es = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function y$(t, e, n) {
  return [
    ...w$.map((i) => g`
      <button class="tool" data-template=${i} title=${c(`rules.template.${i}`)} @click=${() => t(i)}>
        ${Es(Nd[i])}<span class="tlabel">${c(`rules.template.${i}`)}</span></button>`),
    g`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${c("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${Es(Im)}<span class="tlabel">${c("rules.automations")}</span></button>`
  ];
}
function k$(t) {
  var s;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), o = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  o !== null && (t.preventDefault(), (s = n[o]) == null || s.focus());
}
function x$(t, e, n) {
  return g`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${c("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${k$}>
      ${$$.map((i) => g`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${Es(Nd[i])}<span>${c(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function M$(t, e) {
  return t.mode === "automation" ? g`<div class="tools">${md(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${y$((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? Iv(t.mode, t.toolId, (n) => t.pickTool(n)) : Hv({
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
function _$(t, e) {
  var i, o;
  const n = t.selection;
  return U1({
    level: e,
    device: (n == null ? void 0 : n.kind) === "device" ? e.devices.find((s) => s.id === n.id) ?? null : null,
    meta: t.haMeta.get(),
    states: t.liveStates,
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
    feed: t.feed,
    notifyServices: Object.keys(((o = (i = t.hass) == null ? void 0 : i.services) == null ? void 0 : o.notify) ?? {}).sort()
  });
}
function A$(t, e) {
  if (t.mode === "binding") return _$(t, e);
  if (t.mode === "automation")
    return g`<div class="props">${v$({
      level: e,
      rules: t.rules,
      saved: (i) => t.session.savedRules.find((o) => o.id === i),
      selection: t.selection,
      trace: (i) => t.rulesFeed.trace(i),
      live: t.rulesFeed.ready,
      feedError: t.rulesFeed.error,
      onEdit: (i) => t.openRuleDialog("condition", i),
      onDelete: (i) => {
        t.dialog = { kind: "delete-rule", id: i };
      }
    })}</div>`;
  if (t.mode === "power")
    return d$({
      power: t.power,
      level: e,
      selection: t.selection,
      meta: t.haMeta.get(),
      states: t.liveStates,
      frame: t.powerFeed.frame,
      notice: t.notice,
      feedError: t.powerFeed.error,
      toolId: t.toolId,
      placeDeviceId: t.placeDeviceId,
      onPlaceDevice: (i) => t.armDevice(i),
      commit: (i, o) => t.commit(i, o),
      commitPower: (i) => t.commitPower(i),
      setPosition: (i, o) => t.setPowerPosition(i, o)
    });
  const n = {
    level: e,
    selection: t.selection,
    notice: t.notice,
    commit: (i) => t.commit(i),
    setNotice: (i) => {
      t.notice = i;
    }
  };
  return t.mode === "equipment" ? w1({
    ...n,
    power: t.power,
    commit: (i, o) => t.commit(i, o),
    toolId: t.toolId,
    nextProps: t.nextProps,
    setNextProps: (i) => {
      t.nextProps = i;
    },
    nextWallMount: t.nextObj.wallMount,
    setNextWallMount: (i) => {
      t.nextObj = { ...t.nextObj, wallMount: i };
    },
    pickDevice: (i) => t.pickDevice(i)
  }) : Zw({
    ...n,
    tool: t.toolId,
    boxMeasure: t.boxMeasure,
    wallType: t.wallType,
    thickness: t.thickness,
    next: t.nextObj,
    setNext: (i) => {
      t.nextObj = i;
    },
    setWallType: (i) => t.setWallType(i),
    setThickness: (i) => {
      t.thickness = i;
    },
    setBoxMeasure: (i) => {
      t.boxMeasure = i;
    },
    zoneQuery: t.zoneQuery,
    onZoneQuery: (i) => {
      t.zoneQuery = i;
    },
    onPickZone: (i) => t.pickZone(i),
    onZoneMethod: (i) => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, method: i } }, t.pickTool("zone");
    }
  });
}
function S$(t, e) {
  switch (t) {
    case "wall":
      return [["Shift", c("hint.shift")], [c("hint.digits"), c("hint.length")], ["Tab", c("hint.tab")], ["Esc", c("hint.esc")]];
    case "box":
      return [[c("hint.digits"), c("hint.size")], ["Tab", c("hint.tabSize")], ["Esc", c("hint.esc")]];
    case "zone":
      return e === "polygon" ? [
        ["Enter", c("hint.close")],
        ["Backspace", c("hint.removeVertex")],
        ["Shift", c("hint.shift")],
        ["Alt", c("hint.freeVertex")],
        ["Esc", c("hint.cancel")]
      ] : [["Esc", c("hint.esc")]];
    case "select":
    case "device-select":
    case "power-select":
      return [["Del", c("hint.delete")], ["Esc", c("hint.deselect")]];
    case "binding-select":
      return [["Esc", c("hint.deselect")]];
    default:
      return [["Esc", c("hint.esc")]];
  }
}
function L$(t, e) {
  const n = t === "zone" ? `${c("tool.zone")} · ${c(`zones.kind.${e}`)}` : c(`tool.${t}`);
  return g`<span class="tool-chip">${fd(t)}${n}</span>`;
}
function C$(t) {
  return g`
    <div class="status">
      ${L$(t.tool, t.zoneMethod)}
      ${S$(t.tool, t.zoneMethod).map(([e, n]) => g`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? g`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${c(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? $ : g`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${c("status.cones")}
      </label>`}
    </div>`;
}
function I$(t, e) {
  var s, r;
  const n = e.palette, i = 1 / e.scale, o = [
    {
      label: c(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((s = e.live) == null ? void 0 : s.first) ?? "",
      active: t.field === "first",
      unit: c("unit.mm")
    },
    {
      label: c(e.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: t.second,
      live: ((r = e.live) == null ? void 0 : r.second) ?? "",
      active: t.field === "second",
      unit: e.mode === "box" ? c("unit.mm") : "°"
    }
  ];
  return _`
    <g class="tracker" transform=${`translate(${t.at.x + 18 * i} ${t.at.y + 18 * i}) scale(${i})`}
      font-family="system-ui, sans-serif" pointer-events="none">
      <rect width="150" height="50" rx="5" fill=${n.input} stroke=${n.inputBorder}></rect>
      ${o.map((l, a) => _`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function E$(t, e, n, i) {
  const o = t.walls;
  if (!o || o.length === 0) return null;
  if (e === "wall") {
    const { a, b: u } = o[0], p = Math.hypot(u.x - a.x, u.y - a.y);
    let h = Math.atan2(-(u.y - a.y), u.x - a.x) * 180 / Math.PI;
    return h < 0 && (h += 360), { first: bt(p), second: h.toFixed(1) };
  }
  if (o.length < 2) return null;
  const s = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(o[0].b.x - o[0].a.x, o[0].b.y - o[0].a.y) + s, l = Math.hypot(o[1].b.x - o[1].a.x, o[1].b.y - o[1].a.y) + s;
  return { first: bt(r), second: bt(l) };
}
function O$(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const D$ = cc`
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
  .ed[data-update] { grid-template-rows: auto auto 1fr 30px; }
  .update-bar { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; padding: 6px 12px;
    background: var(--ch-primary); color: var(--ch-on-primary); }
  .update-bar button { border: 1px solid var(--ch-on-primary); border-radius: 6px; padding: 3px 12px;
    background: transparent; color: inherit; }
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
  .power-hint { position: absolute; z-index: 5; pointer-events: none; white-space: nowrap; box-sizing: border-box;
    padding: 6px 10px; border: 1px solid var(--ch-divider); border-radius: 6px; background: var(--ch-card); color: var(--ch-text);
    font-size: 12px; line-height: 17px; box-shadow: 0 2px 8px rgba(0, 0, 0, .25); }
  .power-hint .line { white-space: pre; } /* keeps the two spaces between label and value; lines never wrap */
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
  .uhead { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  .uacts { display: flex; flex-wrap: wrap; gap: 6px; }
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
`, N$ = 5e-3, P$ = 2, Fi = (t) => Math.max(N$, Math.min(P$, t));
function T$(t, e, n) {
  var r;
  const i = (r = t == null ? void 0 : t.getScreenCTM) == null ? void 0 : r.call(t), o = i && typeof i.inverse == "function" ? i.inverse() : null;
  if (o && Number.isFinite(o.a) && Number.isFinite(o.d))
    return { x: o.a * n.clientX + o.c * n.clientY + o.e, y: o.b * n.clientX + o.d * n.clientY + o.f };
  const s = t == null ? void 0 : t.getBoundingClientRect();
  return {
    x: e.x + (n.clientX - ((s == null ? void 0 : s.left) ?? 0)) / e.scale,
    y: e.y + (n.clientY - ((s == null ? void 0 : s.top) ?? 0)) / e.scale
  };
}
function V$(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Fi(Math.min(e, n) / 12e3) };
  const i = t.map((h) => h.x), o = t.map((h) => h.y), s = 1500, r = Math.min(...i) - s, l = Math.max(...i) + s, a = Math.min(...o) - s, u = Math.max(...o) + s, p = Fi(Math.min(e / (l - r), n / (u - a)));
  return { x: (r + l) / 2 - e / p / 2, y: (a + u) / 2 - n / p / 2, scale: p };
}
function H$(t, e, n, i, o) {
  const s = Fi(Math.min(o, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / s / 2, y: t.y + t.h / 2 - n / s / 2, scale: s };
}
function z$(t, e, n) {
  const i = Fi(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function R$(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Ca(t, e, n, i) {
  const o = n / t.scale, s = i / t.scale;
  return e.x >= t.x && e.x <= t.x + o && e.y >= t.y && e.y <= t.y + s ? t : { ...t, x: e.x - o / 2, y: e.y - s / 2 };
}
function B$(t, e, n, i, o = 1) {
  const s = 1e3 * o, r = 100 * o * t.scale >= 6 ? 100 * o : s, l = 1 / t.scale;
  return _`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${l}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${s} height=${s}>
        <rect width=${s} height=${s} fill="url(#grid-minor)"></rect>
        <path d=${`M${s} 0H0V${s}`} fill="none" stroke=${i.gridMajor} stroke-width=${l}></path></pattern>
    </defs>
    <rect x=${t.x} y=${t.y} width=${e} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const F$ = ["Shift", "Control", "Alt", "Meta"], U$ = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, W$ = new Map(Object.entries(pd).map(([t, e]) => [`Key${e}`, t]));
function Ia(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class j$ {
  constructor(e) {
    this.h = e, this.panFrom = null, this.spaceDown = !1, this.spacePending = !1, this.pointerActive = !1, this.pointerDown = (n) => {
      var o, s;
      if (this.h.dialog !== null) return;
      this.h.hint.hide(), this.h.focus();
      const i = n.currentTarget;
      if (n.button === 1 || n.button === 0 && this.spaceDown) {
        n.preventDefault(), this.spacePending = !1, this.panFrom = { x: n.clientX, y: n.clientY }, (o = i.setPointerCapture) == null || o.call(i, n.pointerId);
        return;
      }
      n.button === 0 && ((s = i.setPointerCapture) == null || s.call(i, n.pointerId), this.pointerActive = !0, this.h.activeTool.down(this.toolEvent(n)), this.h.requestUpdate());
    }, this.pointerMove = (n) => {
      if (this.h.dialog === null) {
        if (this.panFrom) {
          this.h.view = R$(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
          return;
        }
        this.pointerActive || this.h.hintHover(n), this.h.activeTool.move(this.toolEvent(n)), this.h.requestUpdate();
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
      var i, o;
      this.h.dialog === null && n.button === 0 && ((o = (i = this.h.activeTool).dblclick) == null || o.call(i, this.toolEvent(n)), this.h.requestUpdate());
    }, this.wheel = (n) => {
      this.h.dialog === null && (n.preventDefault(), this.h.hint.hide(), this.h.view = z$(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Ia(n) || !this.h.history) return;
      const i = n.ctrlKey || n.metaKey, o = n.code === "KeyZ" ? "z" : n.code === "KeyY" ? "y" : n.code === "KeyS" ? "s" : n.key.toLowerCase();
      if (i && (o === "z" || o === "y")) {
        if (n.preventDefault(), o === "z" && !n.shiftKey && this.h.activeTool.key("Undo", { shift: !1 })) {
          this.h.requestUpdate();
          return;
        }
        o === "z" && !n.shiftKey ? this.h.undo() : this.h.redo();
        return;
      }
      if (i && o === "s") {
        n.preventDefault(), this.h.doSave();
        return;
      }
      if (n.key === " ") {
        n.preventDefault(), !n.repeat && !this.spaceDown && (this.spaceDown = !0, this.spacePending = !0);
        return;
      }
      const s = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && s ? W$.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = U$[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Ia(n), o = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const s = this.spacePending;
        this.spacePending = !1, s && !i && (this.h.activeTool.key(" ", o), this.h.requestUpdate());
        return;
      }
      i || !F$.includes(n.key) || (this.h.activeTool.key(n.key, o), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Pd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function q$(t) {
  return g`
    <div class="draft-banner" role="status">
      <span>${c("draft.banner").replace("{time}", Pd(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${c("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${c("draft.discard")}</button>
    </div>`;
}
function Lt(t, e, n, i) {
  return g`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${t}</h3>
        <p>${e}</p>
        ${i ? g`<p class="muted">${i}</p>` : $}
        <div class="actions">
          ${n.map((o) => g`<button class="btn${o.primary ? " primary" : ""}" data-action=${o.action}
            ?disabled=${o.disabled ?? !1} @click=${o.onClick}>${o.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Z$(t) {
  var n;
  const e = { action: "cancel", label: c("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? Lt(c("draft.title"), c("draft.text").replace("{time}", Pd(i.savedAt)), [
        { action: "restore", label: c("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: c("draft.discard"), onClick: () => t.discard(i) }
      ]) : $;
    }
    case "new":
      return Lt(c("new.title"), c("new.text"), [
        { action: "new-discard", label: c("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return Lt(c("delete.title"), c("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: c("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return Lt(c("delete.rule.title"), c("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: c("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? c("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return Lt(c("switch.title"), c("switch.text"), [
        { action: "switch-discard", label: c("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return Lt(c("conflict.title"), c(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: c("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: c("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return $;
  }
}
const rn = "plan_studio.draft.", ri = "plan_studio.lastPlanId";
function G$() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function K$(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class X$ {
  constructor(e = G$, n = 500) {
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
      (n = this.storage()) == null || n.setItem(rn + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(rn + e), o = i ? JSON.parse(i) : null;
      return K$(o) && o.planId === e ? o : null;
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
        const o = e.key(i);
        if (!(o != null && o.startsWith(rn))) continue;
        const s = this.read(o.slice(rn.length));
        s && (!n || s.savedAt > n.savedAt) && (n = s);
      }
      return n;
    } catch {
      return null;
    }
  }
  lastPlanId() {
    var e;
    try {
      return ((e = this.storage()) == null ? void 0 : e.getItem(ri)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(ri, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(ri)) === e && n.removeItem(ri);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(rn + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Dr = 5e3, Nr = 12;
function Ea(t) {
  t().catch(() => {
  });
}
class Y$ {
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
      this.setFailure(c("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Ea(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (o) => {
        i.live && this.apply(o);
      },
      { type: "plan_studio/containers/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!i.live) {
          Ea(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ce(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Nr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Dr));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.containers ?? {});
    if (e.full)
      this.map = new Map(n), this.gotFull = !0;
    else
      for (const [i, o] of n) this.map.set(i, o);
    this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
function Q$(t, e, n) {
  var o, s, r, l;
  const i = [];
  for (const a of t) {
    if (a.enabled === !1) continue;
    const u = e(a.id);
    if (!u) continue;
    let p = null;
    ((o = a.motionLight) == null ? void 0 : o.light) === n ? ((s = u.motionLight) == null ? void 0 : s.mode) === "auto" && a.motionLight.sensors.length > 0 && (p = u.verdict === !0) : ((r = a.boiler) == null ? void 0 : r.device) === n && ((l = u.boiler) == null ? void 0 : l.mode) === "auto" && (p = u.boiler.phase === "heating"), p !== null && i.push({ text: c(p ? "live.mode.autoOn" : "live.mode.autoOff"), tone: "mode", id: `mode:${a.id}` });
  }
  return i;
}
const J$ = 1046, Td = 1.25, _t = 480, B = 10, W = 34, Vd = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, Hd = (t) => Math.floor((t - 20) / 6.6), ey = (t) => Math.floor((t - 20) / 6), me = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : gr(t * 1e3), J = (t) => 14 + 18 * t;
function Xe(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, o) => _`<text class=${o === 0 ? "fc-t1" : o === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(o)}>${Vd(i, o === 0 ? Hd(t.w) : ey(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Ui(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const pe = J$, Se = pe / 2, ot = 230, wi = 26, Me = 4, Oa = 36, Ne = J(2), ty = (pe - Me * ot - (Me - 1) * wi) / 2, Da = 200, ht = 330, zd = 40, et = 460, vn = 8, Rd = 24, Os = (pe - ht * 2 - zd) / 2, Na = Os + ht + zd;
function Zn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${c("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${c("rules.unit.min")}` : i === 0 ? `${n} ${c("rules.unit.h")}` : `${n} ${c("rules.unit.h")} ${i} ${c("rules.unit.min")}`;
}
const Pr = (t, e) => me(Math.max(1, Math.ceil((t - e) / 1e3)));
function Tr(t, e = !1) {
  return "light" in t ? `${c("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? c(`rules.daylight.is.${t.is}`) : "sun" in t ? c(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${c(`rules.held.${t.held.state}`)} ${Zn(t.held.seconds)}` : "rule" in t ? c("rules.src.rule") : c("rules.src.device");
}
const Pa = (t) => Number.isFinite(t) ? String(t) : "?";
function ny(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function Bd(t, e, n) {
  return "daylight" in n ? Fd(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? c("rules.flow.trueIn").replace("{t}", Pr(t.until, e)) : t.detail;
}
const Fd = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${Pr(t.until, e)})`), ie = (t) => c(`rules.val.${t === null ? "unknown" : t}`), j = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function iy(t) {
  if (t <= Me) {
    const i = (pe - t * ot - (t - 1) * wi) / 2;
    return Array.from({ length: t }, (o, s) => i + s * (ot + wi));
  }
  const e = t - Math.floor((t - 1) / Me) * Me, n = Math.floor((Me - e) / 2);
  return Array.from({ length: t }, (i, o) => {
    const s = o % Me;
    return ty + (o >= t - e ? n + s : s) * (ot + wi);
  });
}
function Ud(t, e, n, i) {
  const o = n ? "daylight" in t.source && n.value !== null ? `${c(n.value ? "rules.flow.open" : "rules.flow.closed")}, ${Fd(n, i)}` : n.value === !0 ? c("rules.flow.open") : n.value === null ? `${c("rules.flow.closed")}, ${c("rules.val.unknown")}` : n.until !== void 0 && n.until > i ? `${c("rules.flow.closed")}, ${c("rules.flow.opensIn").replace("{t}", Pr(n.until, i))}` : `${c("rules.flow.closed")}${n.detail ? `, ${n.detail}` : ""}` : Tr(t.source);
  return [`${c("rules.flow.gate")}: ${t.not ? "NOT " : ""}${e}`, o];
}
function Wd(t, e) {
  const n = Math.ceil(t / Me), i = iy(t), o = (a) => B + a * (e + Oa), s = (a) => o(Math.floor(a / Me)), r = (a) => o(a) + e + (a === n - 1 ? W : Oa) / 2, l = [];
  i.forEach((a, u) => l.push(`M${a + ot / 2} ${s(u) + e} V${r(Math.floor(u / Me))}`));
  for (let a = 0; a < n; a++) {
    const u = [Se, ...i.slice(a * Me, (a + 1) * Me).map((p) => p + ot / 2)];
    Math.max(...u) > Math.min(...u) && l.push(`M${Math.min(...u)} ${r(a)} H${Math.max(...u)}`);
  }
  return { xs: i, inY: s, busY: r, bottom: t === 0 ? B - W : o(n - 1) + e, links: l };
}
function oy(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, o = e.inputs.map((V, F) => {
    const q = (i == null ? void 0 : i[F].value) ?? null;
    return q === null || !V.not ? q : !q;
  }), s = i ? ny(e.combine, o) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, u = (n == null ? void 0 : n.unknownInputs) ?? 0, p = e.gate ? n == null ? void 0 : n.gate : void 0, h = e.gate ? Ud(e.gate, t.inputName(e.gate), p, t.now) : [], d = c("rules.flow.delay").replace("{on}", Pa(e.onDelay)).replace("{off}", Pa(e.offDelay)), f = n === void 0 ? d : `${ie(r ?? null)}${l ? `, ${c("rules.flow.pending").replace("{to}", ie(l.to)).replace("{t}", me(a))}` : ""}`, m = e.inputs.length, w = Wd(m, Ne), { xs: v, inY: b } = w, y = m === 0 ? B : w.bottom + W, k = y + Ne + W, M = k + Ne + W, x = (e.gate ? M : k) + Ne, L = x + W / 2, E = x + W, A = E + Rd, O = Math.max(1, e.onTrue.length, e.onFalse.length), U = A + O * (Ne + vn) - vn + B, S = [
    { side: "true", x: Os, list: e.onTrue, head: c("rules.whenTrue") },
    { side: "false", x: Na, list: e.onFalse, head: c("rules.whenFalse") }
  ], I = [...w.links];
  m > 0 && I.push(`M${Se} ${w.busY(0)} V${y}`), I.push(`M${Se} ${y + Ne} V${k}`), e.gate && I.push(`M${Se} ${k + Ne} V${M}`), I.push(`M${Se} ${x} V${L} H${Os + ht / 2} V${E}`, `M${Se} ${L} H${Na + ht / 2} V${E}`);
  const T = (V) => Xe({ ...V, h: Ne, focused: t.focused === V.field, onClick: () => t.onFocus(V.target) });
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${pe * Td}px`} viewBox=${`0 0 ${pe} ${U}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("rules.flow.title")}>
        ${I.map((V) => _`<path class="fc-link" d=${V}></path>`)}
        ${e.inputs.map((V, F) => {
    const q = i == null ? void 0 : i[F];
    return T({
      x: v[F],
      y: b(F),
      w: ot,
      field: `input-${F}`,
      target: { input: F },
      cls: q ? j(q.value) : "",
      lines: [`${V.not ? "NOT " : ""}${t.inputName(V)}`, q ? Bd(q, t.now, V.source) : Tr(V.source, V.not === !0)]
    });
  })}
        ${T({
    x: (pe - Da) / 2,
    y,
    w: Da,
    field: "combine",
    target: "gate",
    cls: s === void 0 ? "" : j(s),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...s === void 0 ? [] : [ie(s)]]
  })}
        ${T({
    x: (pe - et) / 2,
    y: k,
    w: et,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : j(r ?? null),
    lines: [c("rules.flow.result"), f]
  })}
        ${e.gate ? T({
    x: (pe - et) / 2,
    y: M,
    w: et,
    field: "gate-input",
    target: "gate-input",
    cls: p ? j(p.value) : "",
    lines: h
  }) : $}
        ${S.map((V) => _`
          <text class="fc-head" text-anchor="middle" x=${V.x + ht / 2} y=${E + 14}>${V.head}</text>
          ${V.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${V.x + ht / 2} y=${A + Ne / 2 + 4}>${c("rules.noActions")}</text>` : V.list.map((F, q) => T({
    x: V.x,
    y: A + q * (Ne + vn),
    w: ht,
    field: `action-${V.side}-${q}`,
    target: { action: V.side, index: q },
    cls: "",
    lines: [t.actionName(F.device), $e(F.do) ? `${Ta(F.do)}: ${(F.do === "play" ? F.media : F.text) ?? ""}` : Ta(F.do)]
  }))}`)}
      </svg>
      ${u > 0 ? g`<p class="fc-warn">${u === 1 ? c("rules.unknown1") : c("rules.unknownN").replace("{n}", String(u))}</p>` : $}
      ${n != null && n.held ? g`<p class="fc-warn" data-note="held">${c("rules.flow.heldNote")}</p>` : $}
      ${n != null && n.last ? g`<p class="fc-last">${c("rules.flow.last")} ${Er(n.last)}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Ta = (t) => c(`rules.act.${t}`), Va = { s: 1, min: 60, h: 3600 }, sy = ["s", "min", "h"];
function ry(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Wi = (t) => Number.isFinite(t) ? String(t) : "";
function Ha(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const Ds = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? c("rules.missingDevice") : t.ruleName(e.rule) ?? c("rules.missingRule");
};
function Vr(t, e) {
  var i, o;
  const n = e.source;
  return "device" in n || "rule" in n ? Ds(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? c("rules.light.noSensor") : "daylight" in n ? ((o = t.deviceById(n.daylight)) == null ? void 0 : o.name) ?? c("rules.light.noSensor") : "sun" in n ? c("rules.src.sun") : "time" in n ? c("rules.src.time") : n.held.sources.length === 0 ? c("rules.src.held") : `${c("rules.src.held")}: ${n.held.sources.map((s) => Ds(t, s)).join(", ")}`;
}
const Ns = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function ly(t, e) {
  return "device" in e || "rule" in e ? Ns(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => Ns(t, n)) : !1;
}
function jd(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function qd(t) {
  return g`
    <optgroup label=${c("rules.groupDevices")}>
      ${t.inputDevices.map((e) => g`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? g`<optgroup label=${c("rules.groupRules")}>
      ${t.otherRules.map((e) => g`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : $}`;
}
function Hr(t, e, n) {
  return g`
    <option value="">${e}</option>
    ${qd(t)}
    <optgroup label=${c("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((i) => g`<option value=${i}>${c(`rules.src.${i}`)}</option>`)}
    </optgroup>
    ${n ?? $}`;
}
const Zd = { say: { need: "text" }, play: { need: "media" }, notify: { need: "text", opt: "title" } };
function Ps(t, e, n = t.device) {
  const i = { device: n, do: e };
  if (!$e(e)) return i;
  const o = Zd[e];
  return i[o.need] = t[o.need] ?? "", o.opt && t[o.opt] !== void 0 && (i[o.opt] = t[o.opt]), i;
}
function wn(t, e, n) {
  const i = t.actionsFor(e);
  if (!t.unique) return i;
  const o = t.list.filter((s, r) => r !== n && s.device === e.id).map((s) => s.do);
  return i.some($e) ? i.filter((s) => !o.includes(s)) : o.length > 0 ? [] : i;
}
function ay(t, e, n, i) {
  var d;
  const o = e.list, s = t.deviceById(i.device), r = s ? wn(e, s, n) : [], l = r.includes(i.do) ? r : [...r, i.do], a = e.unique ? t.actionDevices.filter((f) => f.id === i.device || wn(e, f, n).length > 0) : t.actionDevices, u = $e(i.do) ? Zd[i.do] : void 0, p = (f, m) => {
    e.set(o.map((w, v) => {
      if (v !== n) return w;
      const { [f]: b, ...y } = w;
      return f === "title" && m === "" ? y : { ...y, [f]: m };
    }));
  }, h = (f) => g`
    <input class="grow" type="text" data-part=${f} placeholder=${c(`rules.field.${f}`)} .value=${i[f] ?? ""}
      @input=${(m) => p(f, m.target.value)} />`;
  return g`
    <div class="rline" data-field=${e.field(n)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(f) => {
    const m = t.deviceById(f.target.value);
    if (!m) return;
    const w = wn(e, m, n), v = e.firstDo(m), b = w.includes(i.do) ? i.do : w.includes(v) ? v : w[0];
    b !== void 0 && e.set(o.map((y, k) => k === n ? Ps(y, b, m.id) : y));
  }}>
        ${s && !t.actionDevices.includes(s) ? g`<option value=${s.id}>${s.name}</option>` : $}
        ${s ? $ : g`<option value=${i.device}>${c("rules.missingDevice")}</option>`}
        ${a.map((f) => g`<option value=${f.id}>${f.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(f) => e.set(o.map((m, w) => w === n ? Ps(m, f.target.value) : m))}>
        ${l.map((f) => g`<option value=${f}>${e.doText(f)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${c("rules.remove")} @click=${() => e.set(o.filter((f, m) => m !== n))}>&times;</button>
      ${u ? g`<div class="rparams">${h(u.need)}${u.opt ? h(u.opt) : $}</div>` : $}
      ${(s == null ? void 0 : s.props.kind) === "speaker" && !((d = s.bindings) != null && d.voice) ? g`<p class="muted" data-note="no-voice">${c("rules.announce.noVoice")}</p>` : $}
    </div>`;
}
function Gd(t, e) {
  const n = e.unique ? t.actionDevices.filter((i) => wn(e, i).length > 0) : t.actionDevices;
  return g`
    <div class="rgroup">
      <div class="rlabel">${e.label}</div>
      ${e.list.map((i, o) => ay(t, e, o, i))}
      <select class="radd" data-action=${e.add} data-field=${e.addField ?? $} .value=${""}
        @change=${(i) => {
    const o = i.target, s = t.deviceById(o.value);
    if (o.value = "", !s || e.actionsFor(s).length === 0) return;
    const r = wn(e, s), l = e.firstDo(s), a = r.includes(l) ? l : r[0];
    a !== void 0 && e.set([...e.list, Ps({ device: s.id, do: a }, a)]);
  }}>
        <option value="">${e.addText}</option>
        ${n.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
      </select>
    </div>`;
}
function za(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return Gd(t, {
    label: c(e === "true" ? "rules.whenTrue" : "rules.whenFalse"),
    addText: c("rules.addAction"),
    add: `add-action-${e}`,
    field: (o) => Ui({ action: e, index: o }),
    list: n[i],
    set: (o) => t.onChange({ ...n, [i]: o }),
    actionsFor: te,
    firstDo: (o) => te(o)[0],
    doText: (o) => c(`rules.act.${o}`)
  });
}
const Xo = (t) => t.trim() === "" ? NaN : Number(t);
function Ra(t, e, n, i) {
  var o;
  return g`<select data-part=${e} data-value=${n} @change=${(s) => i(s.target.value)}>
    ${t.lightSensors.some((s) => s.id === n) ? $ : g`<option value=${n}>${((o = t.deviceById(n)) == null ? void 0 : o.name) ?? c("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
  </select>`;
}
const cy = ["night", "dark", "day"];
function uy(t, e, n, i) {
  var o;
  if ("daylight" in n)
    return g`
      <div class="rparams">
        <label class="grow">${c("rules.daylight.sensor")} ${Ra(t, "daylight", n.daylight, (s) => i({ ...n, daylight: s }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(s) => i({ ...n, is: s.target.value })}>
          ${cy.map((s) => g`<option value=${s}>${c(`rules.daylight.is.${s}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const s = n.light === "" ? void 0 : t.lightUnit(n.light);
    return g`
      <div class="rparams">
        <label class="grow">${c("rules.light.sensor")}
          ${Ra(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${c("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Wi(n.below)}
            @input=${(r) => i({ ...n, below: Xo(r.target.value) })} /> lx</label>
        <label>${c("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Wi(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: Xo(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${c("rules.light.unknownDark")}</label>
        ${s !== void 0 && s !== "lx" ? g`<p class="rwarn" data-warn="light-unit">${c("rules.light.unit").replace("{unit}", s)}</p>` : $}
      </div>`;
  }
  if ("time" in n)
    return g`
      <div class="rparams">
        <label>${c("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(s) => i({ time: { ...n.time, from: s.target.value } })} /></label>
        <label>${c("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(s) => i({ time: { ...n.time, to: s.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const s = n.held, r = ((o = t.draft.units) == null ? void 0 : o[e]) ?? ry(s.seconds), l = Number.isFinite(s.seconds) ? String(+(s.seconds / Va[r]).toFixed(4)) : "", a = (u) => i({ held: { ...s, ...u } });
    return g`
      <div class="rparams">
        <div class="rsources">
          ${s.sources.length === 0 ? g`<span class="muted">${c("rules.held.noSources")}</span>` : $}
          ${s.sources.map((u, p) => g`
            <span class="rchip${Ns(t, u) ? " bad" : ""}" data-part="source">${Ds(t, u)}
              <button class="btn" data-action="remove-source" title=${c("rules.held.removeSource")}
                @click=${() => a({ sources: s.sources.filter((h, d) => d !== p) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(u) => {
      const p = u.target, h = jd(t, p.value);
      p.value = "", h && ("device" in h || "rule" in h) && a({ sources: [...s.sources, h] });
    }}>
            <option value="">${c("rules.held.addSource")}</option>
            ${qd(t)}
          </select>
        </div>
        <label>${c("rules.held.state")}
          <select data-part="state" data-value=${s.state}
            @change=${(u) => a({ state: u.target.value })}>
            ${["on", "off", "any"].map((u) => g`<option value=${u}>${c(`rules.held.${u}`)}</option>`)}
          </select></label>
        <label>${c("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(u) => {
      var p;
      ((p = t.draft.units) == null ? void 0 : p[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(Xo(u.target.value) * Va[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(u) => t.onUnit(e, u.target.value)}>
            ${sy.map((u) => g`<option value=${u}>${c(`rules.unit.${u}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return $;
}
function zr(t, e, n, i, o) {
  const s = e.source, r = !("device" in s || "rule" in s), l = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return g`
    <div class="rline${ly(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${r ? c(`rules.src.${l}`) : Vr(t, e)}${"sun" in s ? g` <span class="muted">${e.not ? c("rules.sun.above") : Tr(s)}</span>` : $}</span>
      ${o ?? $}
      ${"daylight" in s && !e.not ? $ : g`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(a) => {
    const u = a.target.checked, { not: p, ...h } = e;
    i(u ? { ...h, not: !0 } : h);
  }} /> ${c("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${c("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${uy(t, n, s, (a) => i({ ...e, source: a }))}
    </div>`;
}
const Rr = (t, e) => (n) => {
  const i = n.target, o = i.value ? jd(t, i.value) : null;
  i.value = "", o && e(o);
};
function Kd(t, e, n, i = c("rules.gate.hint")) {
  const o = t.draft.rule, s = (r) => {
    const { gate: l, ...a } = o;
    t.onChange(r ? { ...a, gate: r } : a);
  };
  return g`
      <div class="rgroup">
        <div class="rlabel">${e}</div>
        <p class="muted">${i}</p>
        ${o.gate ? zr(t, o.gate, n, s) : g`<select class="radd" data-action="set-gate" .value=${""} @change=${Rr(t, (r) => s({ source: r }))}>
            ${Hr(t, c("rules.gate.set"))}
          </select>`}
      </div>`;
}
function Xd(t) {
  const e = t.draft.rule;
  return g`
      <label class="rlabel" for="rule-name">${c("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${c("rules.namePlaceholder")}
        @input=${(n) => t.onChange({ ...e, name: n.target.value })} />`;
}
function dy(t) {
  const e = t.draft.rule;
  return g`
    <div class="rsettings">
      ${Xd(t)}

      <label class="rlabel" for="rule-combine">${c("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(n) => t.onChange({ ...e, combine: n.target.value === "all" ? "all" : "any" })}>
        <option value="any">${c("rules.combine.any")}</option>
        <option value="all">${c("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${c("rules.inputs")}</div>
        ${e.inputs.length === 0 ? g`<p class="muted">${c("rules.noInputs")}</p>` : e.inputs.map((n, i) => zr(
    t,
    n,
    Ui({ input: i }),
    (o) => t.onChange({ ...e, inputs: o ? e.inputs.map((s, r) => r === i ? o : s) : e.inputs.filter((s, r) => r !== i) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${Rr(t, (n) => t.onChange({ ...e, inputs: [...e.inputs, { source: n }] }))}>
          ${Hr(t, c("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${c("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${c("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${zi} step="1" .value=${Wi(e.onDelay)}
              @input=${(n) => t.onChange({ ...e, onDelay: Ha(n.target.value) })} /></label>
          <label class="grow">${c("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${zi} step="1" .value=${Wi(e.offDelay)}
              @input=${(n) => t.onChange({ ...e, offDelay: Ha(n.target.value) })} /></label>
        </div>
      </div>

      ${Kd(t, c("rules.gate"), Ui("gate-input"))}

      ${za(t, "true")}
      ${za(t, "false")}
    </div>`;
}
function hy(t) {
  const e = t.draft.rule, n = (i) => t.onFocus(Ui(i));
  return Yd({
    title: c(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t.problems.map((i) => ({ key: i, text: c(`rules.problem.${i}`) })),
    form: dy(t),
    diagram: oy({
      rule: e,
      inputName: (i) => Vr(t, i),
      actionName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? c("rules.missingDevice");
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
function Yd(t) {
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
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : $}
        <div class="rfoot">
          <label class="rlabel" for="rule-zone">${c("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${c("rules.zone.none")}</option>
            ${n ? $ : g`<option value=${e.zoneId}>${c("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${c("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${c("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${c("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const jt = _t, Br = 20, Dt = jt - 2 * B, $n = (Dt - Br) / 2, Ts = (jt - $n * 2 - Br) / 2, Ba = Ts + $n + Br, Yo = (jt - Dt) / 2, Qo = jt / 2, Jo = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), Fa = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", py = (t) => `${t > 0 ? "+" : ""}${t} %`, ln = (t, e) => Xe({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function Ua(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${Jo(n.t)} °C` : "", n.rh !== null ? `${Jo(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${Jo(n.ah)} g/m³` : "—"];
}
function fy(t) {
  var V, F, q;
  const e = t.rule, n = e.vent, i = t.trace, o = i == null ? void 0 : i.inputs[0], s = o == null ? void 0 : o.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((V = e.onTrue[0]) == null ? void 0 : V.device) ?? "", u = Ua(r, c("vent.sensor"), s == null ? void 0 : s.a), p = Ua(l, c("vent.than"), s == null ? void 0 : s.b), h = J(Math.max(u.length, p.length)), d = c("vent.flow.vs").replace("{a}", r).replace("{b}", l), f = s ? `: ${s.pct === null ? ie(null) : py(s.pct)}` : o ? `: ${o.detail}` : "", m = s ? `${Vd(d, Hd(Dt) - f.length)}${f}` : `${d}${f}`, w = c("vent.flow.margins").replace("{above}", Fa(n.above)).replace("{below}", Fa(n.below)), v = i == null ? void 0 : i.pending, b = v ? Math.max(0, Math.ceil((v.at - t.now) / 1e3)) : 0, y = c("vent.flow.runon").replace("{t}", Zn(e.offDelay)), k = [
    i ? `${c("rules.flow.result")}: ${ie(i.verdict)}` : c("rules.flow.result"),
    v ? `${y} (${c("vent.pending").replace("{to}", v.to ? "on" : "off").replace("{t}", me(b))})` : y
  ], M = i == null ? void 0 : i.last, x = [
    t.deviceName(a),
    `${((F = e.onTrue[0]) == null ? void 0 : F.do) ?? "?"} / ${((q = e.onFalse[0]) == null ? void 0 : q.do) ?? "?"}`,
    ...M ? [Or(M)] : []
  ], L = M == null ? void 0 : M.error, E = J(x.length + (L ? 1 : 0)), A = B + h + W, O = A + J(2) + W, U = O + J(2) + W, S = U + E + B, I = (D) => _`<path class="fc-link" d=${`M${D + $n / 2} ${B + h} V${A - W / 2} H${Qo} V${A}`}></path>`, T = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${c("rules.status.error")}: ${i.reason}` : c(`rules.status.${i.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${jt}px`} viewBox=${`0 0 ${jt} ${S}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("vent.flow.title")}>
        ${I(Ts)}${I(Ba)}
        <path class="fc-link" d=${`M${Qo} ${A + J(2)} V${O} M${Qo} ${O + J(2)} V${U}`}></path>
        ${ln(t, { x: Ts, y: B, w: $n, h, field: "vent-sensor", cls: s != null && s.a.why ? " nodata" : "", lines: u })}
        ${ln(t, { x: Ba, y: B, w: $n, h, field: "vent-than", cls: s != null && s.b.why ? " nodata" : "", lines: p })}
        ${ln(t, { x: Yo, y: A, w: Dt, h: J(2), field: "vent-above", cls: o ? j(o.value) : "", lines: [m, w], tip: `${d}${f}
${w}` })}
        ${ln(t, { x: Yo, y: O, w: Dt, h: J(2), field: "vent-runon", cls: i ? j(i.verdict) : "", lines: k })}
        ${ln(t, { x: Yo, y: U, w: Dt, h: E, field: "vent-fan", cls: "", lines: x, err: L })}
      </svg>
      ${T ? g`<p class="fc-warn" data-note="status">${T}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function At(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return g`
    <div class="backdrop rule-backdrop" @change=${(i) => i.stopPropagation()}>
      <div class="dialog rdlg pdlg" role="dialog" aria-modal="true" aria-label=${t.title}>
        <h3>${t.title}</h3>
        <div class="rcols">
          <div class="rsettings">
            <p class="muted">${t.hint}</p>
            <label class="rlabel" for=${`${t.prefix}-name`}>${c("rules.name")}</label>
            <input id=${`${t.prefix}-name`} data-field="name" type="text" .value=${e.name} placeholder=${c("rules.namePlaceholder")}
              @input=${(i) => t.onChange({ ...e, name: i.target.value })} />
            ${t.form}
          </div>
          ${t.diagram}
        </div>
        ${t.texts.length > 0 ? g`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : $}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${c("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${c("rules.zone.none")}</option>
            ${n ? $ : g`<option value=${e.zoneId}>${c("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${c("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${c("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${c("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const es = (t) => t.trim() === "" ? NaN : Number(t), ts = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function ns(t, e, n, i, o) {
  var r;
  const s = n === "" || i.some((l) => l.id === n);
  return g`
    <select data-field=${e} data-value=${n} @change=${(l) => o(l.target.value)}>
      <option value="">${c("vent.pick")}</option>
      ${s ? $ : g`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? c("rules.missingDevice")}</option>`}
      ${i.map((l) => g`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function my(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: c("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: c("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: c("vent.problem.fan") });
  const o = [...i], s = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((u) => !!u);
  for (const u of t.problems)
    u === "device-missing" && !s.some((p) => !t.deviceById(p)) && !(n.sensor && !t.climateSensors.some((p) => p.id === n.sensor)) && !(n.than && !t.climateSensors.some((p) => p.id === n.than)) || u === "vent" && i.length > 0 || o.push({ key: u, text: c(u === "delay" ? "vent.problem.runon" : `rules.problem.${u}`) });
  return o;
}
function gy(t) {
  var s;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), o = ((s = e.onTrue[0]) == null ? void 0 : s.device) ?? "";
  return At({
    prefix: "vent",
    title: c("vent.title"),
    hint: c("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: my(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("vent.sensor")}</label>
      ${ns(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${c("vent.than")}</label>
      ${ns(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${c("vent.fan")}</label>
      ${ns(t, "vent-fan", o, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${c("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${Q(ts(n.above))}
            @input=${(r) => i({ above: es(r.target.value) })} /></label>
        <label>${c("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${Q(ts(n.below))}
            @input=${(r) => i({ below: es(r.target.value) })} /></label>
        <label>${c("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${Q(ts(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(es(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: fy({
      rule: e,
      deviceName: (r) => {
        var l;
        return r === "" ? c("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? c("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const by = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, ji = _t, vy = ji - 2 * B, wy = B, $y = ji / 2, Wa = (t) => t === null ? ie(null) : `${Math.round(t)} W`, li = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function yy(t, e) {
  const n = t.until !== void 0 ? me(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? c("boiler.phase.heatingCheck").replace("{t}", n) : c("boiler.phase.heating");
    case "waiting":
      return c("boiler.phase.waiting").replace("{t}", n ?? me(0));
    case "blackout":
    case "limit":
    case "done":
      return c(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function ky(t) {
  return t.phase === "heating" ? j(!0) : t.phase !== null ? j(!1) : j(t.relay === null ? null : t.relay === "on");
}
function xy(t) {
  const n = t.rule.boiler, i = n.grid, o = t.trace, s = o == null ? void 0 : o.boiler, r = t.deviceName(n.device), l = [];
  let a = B;
  const u = (v, b, y, k) => {
    const M = J(y.length + (k ? 1 : 0));
    l.push({ y: a, h: M, field: v, cls: b, lines: y, err: k }), a += M + W;
  };
  if (i) {
    const v = (s == null ? void 0 : s.settling) !== void 0 && s.settling > t.now ? [c("boiler.flow.settling").replace("{left}", me(Math.ceil((s.settling - t.now) / 1e3)))] : [];
    u("boiler-grid", s && s.grid === null ? j(null) : "", [t.gridName(i.block), s ? Wa(s.grid) : c("boiler.flow.gridPower"), ...v]);
    const b = c("boiler.flow.formula").replace("{nominal}", li(i.nominal)), y = s && s.headroom !== null ? s.headroom > i.limit : null, k = !!s && (v.length > 0 || s.boilerW === null && s.relay !== "off" && s.grid !== null && s.grid <= i.limit && s.grid + i.nominal > i.limit);
    u("boiler-limit", s ? k ? "" : j(y === null ? null : !y) : "", [
      s ? `${c("boiler.flow.headroom")}: ${k ? c("boiler.flow.notJudged") : y === null ? ie(null) : c(y ? "boiler.flow.over" : "boiler.flow.ok")}` : c("boiler.flow.headroom"),
      s && s.headroom !== null ? `${b} = ${Math.round(s.headroom)} / ${li(i.limit)} W` : `${b} ≤ ${li(i.limit)} W`
    ]);
  }
  u("boiler-button", s ? j(s.mode === "auto") : "", [
    s ? `${c("boiler.flow.mode")}: ${c(`boiler.mode.${s.mode}`)}` : c("boiler.flow.mode"),
    c("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const p = s ? yy(s, t.now) : null, h = o == null ? void 0 : o.last;
  u("boiler-relay", s ? ky(s) : "", [
    s ? `${c("boiler.flow.relay")}: ${s.relay ?? ie(null)}` : c("boiler.flow.relay"),
    r,
    ...p ? [p] : [],
    ...h ? [Or(h)] : []
  ], h == null ? void 0 : h.error);
  const d = c("boiler.flow.done");
  u(i ? "boiler-nominal" : "boiler-power", s ? j(s.boilerW === null ? null : s.boilerW > 1) : "", [
    s ? `${c("boiler.flow.power")}: ${Wa(s.boilerW)}` : c("boiler.flow.power"),
    i ? `${c("boiler.flow.nominal").replace("{w}", li(i.nominal))}, ${d}` : d
  ]);
  const f = a - W + B, m = l.slice(1).map((v) => `M${$y} ${v.y - W} V${v.y}`).join(" "), w = o && o.status !== "ok" ? o.status === "error" && o.reason ? `${c("rules.status.error")}: ${o.reason}` : c(`rules.status.${o.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${ji}px`} viewBox=${`0 0 ${ji} ${f}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((v) => Xe({ x: wy, w: vy, ...v, focused: t.focused === v.field, onClick: () => t.onFocus(v.field) }))}
      </svg>
      ${w ? g`<p class="fc-warn" data-note="status">${w}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const ja = (t) => t.trim() === "" ? NaN : Number(t), qa = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function is(t, e, n, i, o) {
  const s = e === "" || n.some((r) => r.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(r) => o(r.target.value)}>
      <option value="">${c("vent.pick")}</option>
      ${s ? $ : g`<option value=${e}>${i}</option>`}
      ${n.map((r) => g`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function My(t) {
  var s;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: c("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: c("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: c("boiler.problem.grid") });
  const i = [...n], o = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((s = e.grid) == null ? void 0 : s.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !o || r === "boiler" && n.length > 0 || i.push({ key: r, text: c(`rules.problem.${r}`) });
  return i;
}
function _y(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, o = (u) => t.onChange({ ...e, boiler: u }), s = (u) => i && o({ ...n, grid: { ...i, ...u } }), r = (u) => {
    const { grid: p, ...h } = n;
    o(u ? { ...h, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Md, nominal: _d } } : h);
  }, l = (u) => {
    var p;
    return ((p = t.deviceById(u)) == null ? void 0 : p.name) ?? c("rules.missingDevice");
  }, a = (u) => {
    var p;
    return u === "" ? c("vent.pick") : ((p = t.deviceById(u)) == null ? void 0 : p.name) ?? c("rules.missingDevice");
  };
  return At({
    prefix: "boiler",
    title: c("boiler.title"),
    hint: c("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: My(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("boiler.device")}</label>
      ${is("boiler-device", n.device, t.boilers, l(n.device), (u) => o({ ...n, device: u }))}

      <label class="rlabel">${c("boiler.button")}</label>
      ${is("boiler-button", n.button, t.buttons, l(n.button), (u) => o({ ...n, button: u }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(u) => r(u.target.checked)} /> ${c("boiler.limitOn")}</label>
      ${i ? g`
        <label class="rlabel">${c("boiler.grid")}</label>
        ${is("boiler-grid", i.block, t.grids, c("boiler.missingGrid"), (u) => s({ block: u }))}
        <div class="vnums">
          <label>${c("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${Q(qa(i.limit))}
              @input=${(u) => s({ limit: ja(u.target.value) })} /></label>
          <label>${c("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${Q(qa(i.nominal))}
              @input=${(u) => s({ nominal: ja(u.target.value) })} /></label>
        </div>` : $}`,
    diagram: xy({
      rule: e,
      deviceName: a,
      gridName: (u) => {
        var p;
        return u === "" ? c("vent.pick") : ((p = t.grids.find((h) => h.id === u)) == null ? void 0 : p.name) ?? c("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const qi = _t, tt = 2, Qd = 20, yn = 24, Za = 220, kn = (qi - 2 * B - (tt - 1) * Qd) / tt, xn = qi / 2;
function Ay(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const Sy = (t, e) => t === 1 ? xn - kn / 2 : B + e % tt * (kn + Qd);
function Ga(t, e, n, i) {
  const o = J(Math.max(...e.map((p) => p.lines.length + (p.err ? 1 : 0)))), s = Math.ceil(e.length / tt), r = (p) => t + p * (o + yn), l = e.map((p, h) => ({ ...p, x: Sy(e.length, h), y: r(Math.floor(h / tt)), w: kn, h: o })), a = (p) => n ? r(p) + o + (p === s - 1 ? W : yn) / 2 : r(p) - (p === 0 ? W : yn) / 2, u = [];
  for (let p = 0; p < s; p++) {
    const h = l.slice(p * tt, (p + 1) * tt);
    for (const f of h) u.push(`M${f.x + kn / 2} ${n ? f.y + o : f.y} V${a(p)}`);
    const d = [xn, ...h.map((f) => f.x + kn / 2)];
    Math.max(...d) > Math.min(...d) && u.push(`M${Math.min(...d)} ${a(p)} H${Math.max(...d)}`);
  }
  return u.push(n ? `M${xn} ${a(0)} V${i}` : `M${xn} ${i} V${a(s - 1)}`), { blocks: l, bottom: r(s - 1) + o, links: u.join(" ") };
}
function Ly(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, o = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [c("leak.flow.addSensor")] }] : e.sensors.map((y, k) => {
    const M = n == null ? void 0 : n.inputs[k];
    return { field: `leak-sensor:${y}`, cls: M ? j(M.value) : "", lines: [t.deviceName(y), M ? M.detail : c("device.leak_sensor")] };
  }), s = (y) => {
    var k, M;
    return ((M = (k = n == null ? void 0 : n.leak) == null ? void 0 : k.valves.find((x) => x.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => s(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [c("leak.flow.addValve")] }] : e.valves.map((y) => {
    var A;
    const k = (A = n == null ? void 0 : n.leak) == null ? void 0 : A.valves.find((O) => O.id === y), M = t.deviceName(y), x = (k == null ? void 0 : k.state) ?? null, L = y === r ? i : void 0, E = L ? (L.reason === "re-closed: leak" ? c("leak.flow.reclosed") : c("vent.flow.last").replace("{did}", c(`rules.did.${L.action}`))).replace("{at}", ve(L.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? x === "closed" ? j(!0) : x === "open" ? "" : j(null) : "",
      lines: [M, n ? x === null ? ie(null) : c(`leak.state.${x}`) : c("leak.flow.close"), ...E ? [E] : []],
      err: L == null ? void 0 : L.error
    };
  }), a = J(2), u = J(Math.max(...o.map((y) => y.lines.length))), p = B + Math.ceil(o.length / tt) * (u + yn) - yn + W, h = Ga(B, o, !0, p), d = Ga(p + a + W, l, !1, p + a), f = {
    x: xn - Za / 2,
    y: p,
    w: Za,
    h: a,
    field: "leak",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${c("leak.flow.leak")}: ${n.verdict === null ? ie(null) : c(n.verdict ? "leak.yes" : "leak.no")}` : c("leak.flow.leak"), c("leak.flow.any")]
  }, m = d.bottom + B, w = `${h.links} ${d.links}`, v = (y) => Xe({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), b = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${c("rules.status.error")}: ${n.reason}` : c(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${qi}px`} viewBox=${`0 0 ${qi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("leak.flow.title")}>
        ${_`<path class="fc-link" d=${w}></path>`}
        ${h.blocks.map(v)}${v(f)}${d.blocks.map(v)}
      </svg>
      ${b ? g`<p class="fc-warn" data-note="status">${b}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function Zi(t, e, n, i, o, s, r) {
  const l = (u) => {
    var p;
    return ((p = t.deviceById(u)) == null ? void 0 : p.name) ?? c("rules.missingDevice");
  }, a = t.draft.focused;
  return g`
    <div class="rsources" data-group=${e}>
      ${i.map((u) => g`
        <span class="rchip${o.some((p) => p.id === u) ? "" : " bad"}${a === `${n}:${u}` ? " hl" : ""}"
          data-id=${u}>${l(u)}
          <button class="btn" data-action="remove" title=${c("leak.remove")}
            @click=${() => r(i.filter((p) => p !== u))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(u) => {
    const p = u.target, h = p.value;
    p.value = "", h && r([...i, h]);
  }}>
        <option value="">${s}</option>
        ${o.filter((u) => !i.includes(u.id)).map((u) => g`<option value=${u.id}>${u.name}</option>`)}
      </select>
    </div>`;
}
function Cy(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: c("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: c("leak.problem.valves") });
  const i = [...n];
  for (const o of t.problems)
    o === "leak" && n.length > 0 || i.push({ key: o, text: c(`rules.problem.${o}`) });
  return i;
}
function Iy(t) {
  const e = t.draft.rule, n = e.leak;
  return At({
    prefix: "leak",
    title: c("leak.title"),
    hint: c("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Cy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("leak.sensors")}</label>
      ${Zi(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, c("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${c("leak.valves")}</label>
      ${Zi(t, "leak-valves", "leak-valve", n.valves, t.valves, c("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: Ly({
      rule: e,
      deviceName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? c("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Gi = _t, Ey = Gi - 2 * B, Oy = Gi / 2;
function Dy(t) {
  const e = ve(t.at);
  return qn(t) ? c("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === Cd ? c("timed.flow.elsewhere") : c("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : c("timed.flow.last").replace("{did}", c(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function Ny(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, o = [];
  let s = B;
  const r = (f, m, w, v) => {
    const b = J(w.length + (v ? 1 : 0));
    o.push({ y: s, h: b, field: f, cls: m, lines: w, err: v }), s += b + W;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? c("timed.flow.events")]);
  const l = c(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Zn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? c("timed.flow.running").replace("{t}", me(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : c("timed.flow.runningNow") : c("timed.flow.idle") : c("timed.flow.run");
  r("timed-minutes", i ? j(i.running) : n ? j(n.verdict) : "", [a, l]);
  const u = n == null ? void 0 : n.last;
  r("timed-device", i ? j(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? c("timed.flow.state").replace("{s}", i.device ?? ie(null)) : c(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...u ? [Dy(u)] : []
  ], u == null ? void 0 : u.error);
  const p = s - W + B, h = o.slice(1).map((f) => `M${Oy} ${f.y - W} V${f.y}`).join(" "), d = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${c("rules.status.error")}: ${n.reason}` : c(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Gi}px`} viewBox=${`0 0 ${Gi} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("timed.flow.title")}>
        <path class="fc-link" d=${h}></path>
        ${o.map((f) => Xe({ x: B, w: Ey, ...f, focused: t.focused === f.field, onClick: () => t.onFocus(f.field) }))}
      </svg>
      ${d ? g`<p class="fc-warn" data-note="status">${d}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Ka = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function Py(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? c("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${c("timed.events.start").replace("{e}", Ka(e.on))}, ${e.separateOff ? c("timed.events.stop").replace("{e}", Ka(e.off)) : c("timed.events.noStop")}`;
}
const Ty = (t) => t.trim() === "" ? NaN : Number(t);
function Xa(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${c("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${c("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function Vy(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: c("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: c("timed.problem.device") });
  const i = [...n], o = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), s = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !o || r === "timed" && n.length > 0 && s || i.push({ key: r, text: c(`rules.problem.${r}`) });
  return i;
}
function Hy(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), o = Py(t.deviceById(n.button)), s = (r) => {
    var l;
    return r === "" ? c("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? c("rules.missingDevice");
  };
  return At({
    prefix: "timed",
    title: c("timed.title"),
    hint: c("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Vy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("timed.button")}</label>
      ${Xa("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${o ? g`<p class="muted" data-note="events">${o}</p>` : $}

      <label class="rlabel">${c("timed.device")}</label>
      ${Xa("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${c("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${Q(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: Ty(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${c("timed.invert")}</label>`,
    diagram: Ny({
      rule: e,
      deviceName: s,
      events: o,
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const zy = { "outside-wants": "outside-sensor" }, Ki = _t, cn = Ki - 2 * B, os = Ki / 2, $i = 16, Ry = { 1: [cn], 2: [(cn - $i) / 2, (cn - $i) / 2], 3: [176, 116, cn - 176 - 116 - 2 * $i] }, Vs = (t, e) => t !== void 0 ? me(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function By(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), o = i ? i[1] : t.detail, s = t.daylight === null && o === c("daylight.noData") ? [] : [o];
  return i && s.push(`${i[2]} in ${Vs(t.until, n) ?? me(0)}`), t.daylight === null && e && s.push(c("outside.flow.countsNight")), s;
}
function Fr(t) {
  const e = ve(t.at);
  return qn(t) ? c("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : Ed(t) ? c("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? c("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : c("timed.flow.last").replace("{did}", c(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function Fy(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, o = e.window, s = [{
    field: "outside-sensor",
    cls: i ? j(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${c("outside.flow.daylight")}: ${c(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...By(i, e.noDataNight === !0, t.now)] : [c("outside.flow.daylight"), t.deviceName(e.sensor), c(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && s.push({
    field: "outside-sunset",
    cls: i ? j(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${c("outside.flow.sun")}: ${i.sun === null ? ie(null) : c(`outside.sun.${i.sun}`)}` : c("outside.flow.sun"), c("outside.flow.afterSunset")]
  }), o) {
    const A = `${o.from}-${o.to}`, O = i && i.window !== null ? Vs(i.windowUntil, t.now) : null;
    s.push({
      field: "outside-window",
      cls: i ? j(i.window) : "",
      lines: i ? [
        i.window === null ? `${c("outside.flow.window")}: ${ie(null)}` : c(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        A,
        ...O ? [c(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", O)] : []
      ] : [c("outside.flow.window"), A]
    });
  }
  const r = [], l = Ry[s.length], a = J(Math.max(...s.map((A) => A.lines.length)));
  let u = B;
  for (const [A, O] of s.entries())
    r.push({ ...O, x: u, y: B, w: l[A], h: a }), u += l[A] + $i;
  let p = B + a + W;
  const h = (A) => {
    const O = J(A.lines.length + (A.err ? 1 : 0));
    r.push({ ...A, x: B, y: p, w: cn, h: O }), p += O + W;
  }, d = c("outside.flow.rule").replace("{sun}", e.afterSunset ? c("outside.flow.ruleSun") : "").replace("{window}", o ? c("outside.flow.ruleWindow") : "");
  h({
    field: "outside-wants",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${c("outside.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : c("outside.flow.wants"), d]
  });
  const f = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? Vs(i.pausedUntil, t.now) : null;
  h(e.pause === 0 ? { field: "outside-pause", cls: i ? j(!0) : "", lines: [c("outside.flow.never"), c("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? j(f === null) : "",
    lines: [
      i ? f !== null ? c("outside.flow.paused").replace("{t}", f) : c("outside.flow.noPause") : c("outside.flow.pause"),
      c("outside.flow.after").replace("{d}", Zn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, w = [
    t.deviceName(e.light),
    i ? c("timed.flow.state").replace("{s}", i.light ?? ie(null)) : c("outside.flow.onOff"),
    ...m ? [Fr(m)] : []
  ];
  h({
    field: "outside-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: w,
    err: m == null ? void 0 : m.error,
    tip: m ? [...w, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const v = p - W + B, b = r.find((A) => A.field === "outside-wants"), y = B + a + W / 2, k = r.slice(0, s.length), M = [os, ...k.map((A) => A.x + A.w / 2)], x = [
    ...k.map((A) => `M${A.x + A.w / 2} ${B + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${os} ${y} V${b.y}`,
    ...r.slice(s.length + 1).map((A) => `M${os} ${A.y - W} V${A.y}`)
  ].join(" "), L = (A) => Xe({ ...A, focused: t.focused === A.field, onClick: () => t.onFocus(A.field) }), E = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${c("rules.status.error")}: ${n.reason}` : c(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ki}px`} viewBox=${`0 0 ${Ki} ${v}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("outside.flow.title")}>
        ${_`<path class="fc-link" d=${x}></path>`}
        ${r.map(L)}
      </svg>
      ${E ? g`<p class="fc-warn" data-note="status">${E}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Uy = { from: "17:00", to: "01:00" }, Ur = (t) => t.trim() === "" ? NaN : Number(t);
function Rn(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${c("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${c("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function Ya(t, e, n, i, o) {
  return g`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(s) => {
    const { [e]: r, ...l } = n;
    o(s.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function Wy(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: c("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: c("outside.problem.sensor") });
  const i = [...n], o = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), s = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !o || l === "outside" && n.length > 0 && s && r || i.push({ key: l, text: c(`rules.problem.${l}`) });
  return i;
}
function jy(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), o = n.window, s = (r) => {
    var l;
    return r === "" ? c("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? c("rules.missingDevice");
  };
  return At({
    prefix: "outside",
    title: c("outside.title"),
    hint: c("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Wy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("outside.light")}</label>
      ${Rn("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${c("outside.sensor")}</label>
      ${Rn("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${Ya("outside-nodata", "noDataNight", n, c("outside.noDataNight"), i)}
      ${Ya("outside-sunset", "afterSunset", n, c("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${o !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...Uy } } : a);
    }} /> ${c("outside.window")}</label>
      ${o ? g`
        <div class="vnums">
          <label>${c("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${Q(o.from)}
              @input=${(r) => i({ ...n, window: { ...o, from: r.target.value } })} /></label>
          <label>${c("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${Q(o.to)}
              @input=${(r) => i({ ...n, window: { ...o, to: r.target.value } })} /></label>
        </div>` : $}

      <div class="vnums">
        <label>${c("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${Q(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: Ur(r.target.value) })} /></label>
        <span class="muted">${c("outside.pauseNote")}</span>
      </div>`,
    diagram: Fy({
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
const qy = { "beurer-wants": "beurer-above" }, Xi = _t, Zy = Xi - 2 * B, Gy = Xi / 2, ai = (t, e) => me(Math.max(0, Math.ceil((t - e) / 1e3)));
function Ky(t) {
  var b;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, o = [];
  let s = B;
  const r = (y, k, M, x, L) => {
    const E = J(M.length + (x ? 1 : 0));
    o.push({ y: s, h: E, field: y, cls: k, lines: M, err: x, tip: L }), s += E + W;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? c("beurer.flow.kept").replace("{t}", ai(i.keptUntil, t.now)) : c("beurer.flow.noData") : c("beurer.source");
  r(
    "beurer-source",
    i ? j(i.watts !== null ? i.watts > e.above : l ? ((b = n.inputs[0]) == null ? void 0 : b.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const u = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? j(n.verdict) : "", [
    n ? `${c("beurer.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : c("beurer.flow.wants"),
    c("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", me(t.rule.offDelay)),
    ...u ? [c("rules.flow.pending").replace("{to}", u.to ? "on" : "off").replace("{t}", ai(u.at, t.now))] : []
  ]);
  const p = (n == null ? void 0 : n.verdict) === !0, h = e.every === 0 ? c("beurer.flow.never") : i && !p ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? c("beurer.flow.now").replace("{t}", ai(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? c("beurer.flow.next").replace("{t}", ai(i.cycleAt, t.now)) : i && p && i.heater === "on" && !i.fresh ? c("beurer.flow.due") : i ? "—" : Zn(e.every * 60);
  r("beurer-every", i ? j(i.pausedUntil !== void 0 ? !1 : p ? !0 : null) : "", [c("beurer.flow.repower"), h]);
  const d = n == null ? void 0 : n.last, f = [
    t.deviceName(e.heater),
    i ? c("timed.flow.state").replace("{s}", i.heater ?? ie(null)) : c("outside.flow.onOff"),
    ...d ? [Fr(d)] : []
  ];
  r(
    "beurer-heater",
    i ? j(i.heater === null ? null : i.heater === "on") : "",
    f,
    d == null ? void 0 : d.error,
    d ? [...f, ...d.error ? [d.error] : [], d.reason].join(`
`) : void 0
  );
  const m = s - W + B, w = o.slice(1).map((y) => `M${Gy} ${y.y - W} V${y.y}`).join(" "), v = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${c("rules.status.error")}: ${n.reason}` : c(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Xi}px`} viewBox=${`0 0 ${Xi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("beurer.flow.title")}>
        ${_`<path class="fc-link" d=${w}></path>`}
        ${o.map((y) => Xe({ x: B, w: Zy, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${v ? g`<p class="fc-warn" data-note="status">${v}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function Xy(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: c("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: c("beurer.problem.source") });
  const o = [...i], s = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !s || l === "beurer" && i.length > 0 && r || o.push({ key: l, text: c(`rules.problem.${l}`) });
  return o;
}
function Yy(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), o = (r) => {
    var l;
    return r === "" ? c("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? c("rules.missingDevice");
  }, s = (r, l, a, u, p, h, d) => g`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${u} max=${p} step="1"
          .value=${Q(Number.isFinite(a) ? String(a) : "")}
          @input=${(f) => h(Ur(f.target.value))} /></label>
      ${d ? g`<span class="muted">${d}</span>` : ""}
    </div>`;
  return At({
    prefix: "beurer",
    title: c("beurer.title"),
    hint: c("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Xy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("beurer.heater")}</label>
      ${Rn("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${c("beurer.source")}</label>
      ${Rn("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${s("above", c("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${s("off", c("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${s("keep", c("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${s("every", c("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), c("beurer.everyNote"))}`,
    diagram: Ky({
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
const Qy = { "motionlight-wants": "motionlight-off", "motionlight-mode": "motionlight-buttons" };
function Jy(t) {
  return t.startsWith("motionlight-sensor:") ? "motionlight-sensors" : Qy[t] ?? t;
}
const Yi = _t, Qa = Yi - 2 * B, Ja = Yi / 2, ss = 12, e0 = 3, t0 = {
  auto: "lastAuto",
  autoAgain: "lastAutoAgain",
  manualButton: "lastManualButton",
  releasedOff: "lastReleased",
  found: "lastFound",
  autoOff: "lastAutoOff",
  autoOffLight: "lastAutoOffLight",
  autoOn: "lastAutoOn",
  blocked: "lastBlocked",
  unblockedOn: "lastUnblockedOn",
  unblockedOff: "lastUnblockedOff",
  unblockedLight: "lastUnblockedLight",
  daylight: "lastDaylight"
}, n0 = (t) => {
  const e = Id(t);
  return e ? c(`motionLight.flow.${t0[e]}`).replace("{at}", ve(t.at)).replace("{s}", t.action) : Fr(t);
}, rs = (t, e) => me(Math.max(0, Math.ceil((t - e) / 1e3)));
function i0(t) {
  var U;
  const e = t.rule.motionLight, n = t.trace, i = n == null ? void 0 : n.motionLight, o = e.daylight, s = e.sensors.length === 0 ? [{ field: "motionlight-sensors", cls: " muted", lines: [c("motionLight.flow.noSensors")] }] : e.sensors.map((S) => {
    const I = i == null ? void 0 : i.sensors.find((T) => T.id === S);
    return {
      field: `motionlight-sensor:${S}`,
      cls: i ? j((I == null ? void 0 : I.state) === void 0 || I.state === null ? null : I.state === "on") : "",
      lines: [t.deviceName(S), i ? (I == null ? void 0 : I.state) === "on" ? c("motionLight.flow.motion") : (I == null ? void 0 : I.state) === "off" ? c("motionLight.flow.clear") : c("motionLight.flow.noData") : c("device.motion_sensor")]
    };
  });
  if (o) {
    const S = i != null && i.daylight ? ((U = /^(.*?) \(.+ in [\d:]+\)$/.exec(i.daylight.detail)) == null ? void 0 : U[1]) ?? i.daylight.detail : "";
    s.push({
      field: "motionlight-daylight",
      cls: i ? j(i.dark) : "",
      lines: i != null && i.daylight ? [`${c("motionLight.flow.daylight")}: ${i.daylight.state ?? c("motionLight.flow.noData")}`, t.deviceName(o.sensor), ...S ? [S] : []] : [c("motionLight.flow.daylight"), t.deviceName(o.sensor), c(o.is === "night" ? "motionLight.isNight" : "motionLight.isDark")],
      tip: i != null && i.daylight ? [c("motionLight.flow.daylight"), t.deviceName(o.sensor), i.daylight.detail].join(`
`) : void 0
    });
  }
  const r = e.blocker;
  if (r) {
    const S = t.deviceName(r.device), I = c(r.is === "on" ? "motionLight.blockerIsOn" : "motionLight.blockerIsOff"), T = (i == null ? void 0 : i.blocked) === !0, V = i != null && i.blocker ? i.blocker.state ?? c("motionLight.flow.noData") : void 0;
    s.push({
      field: "motionlight-blocker",
      cls: i ? j(!T) : "",
      lines: T ? [c("motionLight.flow.blocked").replace("{name}", S)] : [c("motionLight.blocker"), `${S} ${I}`, ...V !== void 0 ? [c("motionLight.flow.blockerNow").replace("{s}", V)] : []]
    });
  }
  const l = e.sensors.length === 0 ? 1 : Math.min(e0, s.length), a = (Qa - (l - 1) * ss) / l, u = Math.ceil(s.length / l), p = J(Math.max(...s.map((S) => S.lines.length))), h = l === 3 ? B + a + ss / 2 : Ja, d = s.map((S, I) => ({ ...S, x: B + I % l * (a + ss), y: B + Math.floor(I / l) * (p + W), w: a, h: p })), f = [];
  for (let S = 0; S < u; S++) {
    const I = d.slice(S * l, (S + 1) * l), T = I[0].y + p + W / 2;
    for (const F of I) f.push(`M${F.x + a / 2} ${F.y + p} V${T}`);
    const V = [h, ...I.map((F) => F.x + a / 2)];
    Math.max(...V) > Math.min(...V) && f.push(`M${Math.min(...V)} ${T} H${Math.max(...V)}`);
  }
  const m = B + u * (p + W);
  let w = m;
  f.push(`M${h} ${B + p + W / 2} V${m}`);
  const v = (S) => {
    const I = J(S.lines.length + (S.err ? 1 : 0));
    d.push({ ...S, x: B, y: w, w: Qa, h: I }), w > m && f.push(`M${Ja} ${w - W} V${w}`), w += I + W;
  }, b = c("motionLight.flow.rule").replace("{dark}", o ? c("motionLight.flow.ruleDark") : "").replace("{d}", me(t.rule.offDelay)) + (e.minOn > 0 ? c("motionLight.flow.ruleMin").replace("{d}", me(e.minOn)) : ""), y = o ? c("motionLight.flow.ruleDay") : null, k = (i == null ? void 0 : i.mode) === "manual", M = k || e.sensors.length === 0;
  v({
    field: "motionlight-wants",
    cls: i && !M ? j(n.verdict) : "",
    lines: [
      i && !M ? `${c("motionLight.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : c("motionLight.flow.wants"),
      b,
      ...y ? [y] : [],
      ...(i == null ? void 0 : i.offAt) !== void 0 && !M ? [c("motionLight.flow.offIn").replace("{t}", rs(i.offAt, t.now))] : [],
      ...(i == null ? void 0 : i.minUntil) !== void 0 && !M ? [c("motionLight.flow.minOn").replace("{t}", rs(i.minUntil, t.now))] : [],
      ...i != null && i.waiting && !M ? [c("motionLight.flow.waiting")] : []
    ]
  }), v({
    field: "motionlight-mode",
    cls: i ? j(!k) : "",
    lines: i ? [
      `${c("motionLight.flow.mode")}: ${c(k ? "motionLight.flow.manual" : e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.auto")}`,
      ...k ? [i.autoAt !== void 0 ? c("motionLight.flow.autoIn").replace("{t}", rs(i.autoAt, t.now)) : c("motionLight.flow.byButton")] : []
    ] : [c("motionLight.flow.mode"), c(e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.byButton")]
  });
  const x = n == null ? void 0 : n.last, L = [
    t.deviceName(e.light),
    i ? c("timed.flow.state").replace("{s}", i.light ?? ie(null)) : c("outside.flow.onOff"),
    ...x ? [n0(x)] : []
  ];
  v({
    field: "motionlight-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: L,
    err: x == null ? void 0 : x.error,
    tip: x ? [...L, ...x.error ? [x.error] : [], x.reason].join(`
`) : void 0
  });
  const E = w - W + B, A = (S) => Xe({ ...S, focused: t.focused === S.field, onClick: () => t.onFocus(S.field) }), O = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${c("rules.status.error")}: ${n.reason}` : c(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Yi}px`} viewBox=${`0 0 ${Yi} ${E}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("motionLight.flow.title")}>
        ${_`<path class="fc-link" d=${f.join(" ")}></path>`}
        ${d.map(A)}
      </svg>
      ${O ? g`<p class="fc-warn" data-note="status">${O}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function o0(t) {
  var l;
  const e = t.draft.rule, n = e.motionLight, i = [];
  n.light || i.push({ key: "pick-light", text: c("motionLight.problem.light") });
  const o = [...i], s = n.light && !t.lights.some((a) => a.id === n.light) || n.sensors.some((a) => !t.sensors.some((u) => u.id === a)) || n.buttons.some((a) => !t.buttons.some((u) => u.id === a)) || n.daylight && !t.daylightSensors.some((a) => a.id === n.daylight.sensor) || n.blocker && !t.blockers.some((a) => a.id === n.blocker.device), r = !n.sensors.includes(n.light) && !n.buttons.includes(n.light) && ((l = n.blocker) == null ? void 0 : l.device) !== n.light && [n.minOn, n.autoAfter].every(Number.isInteger) && n.minOn >= 0 && n.minOn <= 3600 && n.autoAfter >= 0 && n.autoAfter <= 1440;
  for (const a of t.problems)
    a === "device-missing" && !s || a === "motionLight" && i.length > 0 && r || o.push({ key: a, text: c(`rules.problem.${a}`) });
  return o;
}
function s0(t) {
  const e = t.draft.rule, n = e.motionLight, i = (d) => t.onChange({ ...e, motionLight: d }), o = (d) => {
    var f;
    return d === "" ? c("vent.pick") : ((f = t.deviceById(d)) == null ? void 0 : f.name) ?? c("rules.missingDevice");
  }, s = (d, f, m, w, v, b, y) => g`
    <div class="vnums">
      <label>${f}
        <input class="num" data-field=${`motionlight-${d}`} type="number" min=${w} max=${v} step="1"
          .value=${Q(Number.isFinite(m) ? String(m) : "")}
          @input=${(k) => b(Ur(k.target.value))} /></label>
      ${y ? g`<span class="muted">${y}</span>` : $}
    </div>`, r = n.buttons.length > 0 && n.autoAfter === 0 && !n.buttons.some((d) => {
    const f = t.buttons.find((m) => m.id === d);
    return !!f && xd(f);
  }), l = n.buttons.some((d) => {
    const f = t.buttons.find((m) => m.id === d);
    return (f == null ? void 0 : f.props.kind) === "wall_switch" && !f.props.autoByDoubleToggle;
  }), a = n.daylight, u = !a || t.daylightSensors.some((d) => d.id === a.sensor), p = n.blocker, h = !p || t.blockers.some((d) => d.id === p.device);
  return At({
    prefix: "motionlight",
    title: c("motionLight.title"),
    hint: c("motionLight.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: o0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${c("motionLight.light")}</label>
      ${Rn("motionlight-light", n.light, t.lights, (d) => i({ ...n, light: d }))}

      <label class="rlabel">${c("motionLight.buttons")}</label>
      ${Zi(t, "motionlight-buttons", "motionlight-button", n.buttons, t.buttons.filter((d) => d.id !== n.light), c("motionLight.addButton"), (d) => i({ ...n, buttons: d, ...d.length === 0 ? { autoAfter: 0 } : {} }))}
      <span class="muted">${c("motionLight.buttonsNote")}</span>
      ${l ? g`<span class="muted" data-note="motionlight-nodoubletoggle">${c("motionLight.noDoubleToggle")}</span>` : $}

      <label class="rlabel">${c("motionLight.sensors")}</label>
      ${Zi(t, "motionlight-sensors", "motionlight-sensor", n.sensors, t.sensors, c("motionLight.addSensor"), (d) => i({ ...n, sensors: d }))}
      <span class="muted">${c("motionLight.sensorsNote")}</span>

      <label class="rlabel">${c("motionLight.daylight")}</label>
      <div class="vnums">
        <select data-field="motionlight-daylight" data-value=${(a == null ? void 0 : a.sensor) ?? ""}
          @change=${(d) => {
      const f = d.target.value, { daylight: m, ...w } = n;
      i(f === "" ? w : { ...w, daylight: { sensor: f, is: (a == null ? void 0 : a.is) ?? "dark" } });
    }}>
          <option value="">${c("motionLight.noDaylight")}</option>
          ${u ? $ : g`<option value=${a.sensor}>${c("rules.missingDevice")}</option>`}
          ${t.daylightSensors.map((d) => g`<option value=${d.id}>${d.name}</option>`)}
        </select>
        ${a ? g`
          <select data-field="motionlight-is" data-value=${a.is}
            @change=${(d) => i({ ...n, daylight: { ...a, is: d.target.value } })}>
            <option value="night">${c("motionLight.isNight")}</option>
            <option value="dark">${c("motionLight.isDark")}</option>
          </select>` : $}
      </div>

      <label class="rlabel">${c("motionLight.blocker")}</label>
      <div class="vnums">
        <select data-field="motionlight-blocker" data-value=${(p == null ? void 0 : p.device) ?? ""}
          @change=${(d) => {
      const f = d.target.value, { blocker: m, ...w } = n;
      i(f === "" ? w : { ...w, blocker: { device: f, is: (p == null ? void 0 : p.is) ?? "on" } });
    }}>
          <option value="">${c("motionLight.blockerNone")}</option>
          ${h ? $ : g`<option value=${p.device}>${c("rules.missingDevice")}</option>`}
          ${t.blockers.filter((d) => d.id !== n.light).map((d) => g`<option value=${d.id}>${d.name}</option>`)}
        </select>
        ${p ? g`
          <select data-field="motionlight-blocker-is" data-value=${p.is}
            @change=${(d) => i({ ...n, blocker: { ...p, is: d.target.value } })}>
            <option value="on">${c("motionLight.blockerIsOn")}</option>
            <option value="off">${c("motionLight.blockerIsOff")}</option>
          </select>` : $}
      </div>
      ${p ? g`<span class="muted">${c("motionLight.blockerNote")}</span>` : $}

      ${s("off", c("motionLight.off"), e.offDelay, 0, zi, (d) => t.onChange({ ...e, offDelay: d }), c("motionLight.offNote"))}
      ${s("minon", c("motionLight.minOn"), n.minOn, 0, 3600, (d) => i({ ...n, minOn: d }))}

      ${n.buttons.length > 0 ? s("autoafter", c("motionLight.autoAfter"), n.autoAfter, 0, 1440, (d) => i({ ...n, autoAfter: d }), c("motionLight.autoAfterNote")) : $}
      ${r ? g`<p class="muted" data-note="motionlight-noauto">${c("motionLight.noAutoNote")}</p>` : $}`,
    diagram: i0({
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
function r0(t) {
  return t === "event" ? "control-source-0" : `control-${t.endsWith(":empty") ? t.slice(0, -6) : t.replace(":", "-")}`;
}
const Jd = 20, Ct = (pe - 2 * B - 2 * Jd) / 3, l0 = ["on", "off", "toggle"], a0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" }, c0 = (t) => t.error && !p$(t) ? c("control.flow.notSent").replace("{at}", ve(t.at)) : qn(t) || t.sent !== !1 ? Or(t) : Er(t);
function u0(t) {
  const { rule: e, trace: n } = t, i = e.control, o = i.sources.length, s = n && n.inputs.length === o ? n.inputs : null, r = n == null ? void 0 : n.control, l = r == null ? void 0 : r.event, a = J(s || i.sources.some(_e) ? 3 : 2), u = J(l != null && l.dropped ? 3 : 2), p = Wd(o, a), h = o === 0 ? B : p.bottom + W, d = h + u + W, f = e.gate ? d + J(2) : h + u, m = f + W / 2, w = f + W, v = w + Rd, b = (S) => B + S * (Ct + Jd), y = [...p.links];
  o > 0 && y.push(`M${Se} ${p.busY(0)} V${h}`), e.gate && y.push(`M${Se} ${h + u} V${d}`), y.push(`M${Se} ${f} V${m} H${b(0) + Ct / 2} V${w}`, `M${Se} ${m} H${b(2) + Ct / 2} V${w}`, `M${Se} ${m} V${w}`);
  const k = (S) => Xe({ ...S, focused: t.focused === S.field, onClick: () => t.onFocus(S.field) }), M = [
    c("control.flow.event"),
    // An event of a purpose-built rule is worded by that rule's event ("... heating done"), any other by the action list it ran.
    l ? c("control.flow.eventLine").replace("{source}", l.source).replace("{what}", l.origin ? c(`control.event.${l.origin.what}`) : c(`control.do.${l.what}`)).replace("{at}", ve(l.at)) : c("control.flow.noEvent"),
    ...l != null && l.dropped ? [c("control.flow.dropped")] : []
  ], x = (S) => {
    var I;
    return (I = r == null ? void 0 : r.devices.find((T) => T.id === S)) == null ? void 0 : I.state;
  }, L = n == null ? void 0 : n.last, E = (S, I) => L && l && !l.dropped && l.what === S && L.target === t.nameOf(I.device) && (!$e(I.do) || L.action === I.do) ? L : void 0, A = (S, I, T, V, F) => {
    const q = x(I.device), D = E(S, I), ge = $e(I.do) ? `${c(`control.do.${I.do}`)}: ${(I.do === "play" ? I.media : I.text) ?? ""}` : c(`control.do.${I.do}`), _o = r && !$e(I.do) ? [c("control.flow.now").replace("{s}", q ?? c("control.flow.noData"))] : [], Xt = [t.nameOf(I.device), ge, ..._o, ...D ? [c0(D)] : []], qr = J(Xt.length + (D != null && D.error ? 1 : 0));
    return { svg: k({ x: V, y: F, w: Ct, h: qr, field: `${S}:${T}`, cls: r ? j(q == null ? null : q === "on" || q === "open") : "", lines: Xt, err: D == null ? void 0 : D.error }), h: qr };
  }, O = l0.map((S, I) => {
    const T = i[S], V = b(I), F = _`<text class="fc-head" text-anchor="middle" x=${V + Ct / 2} y=${w + 14}>${c(a0[S])}</text>`;
    if (T.length === 0) {
      const ge = J(1);
      return { bottom: v + ge, body: _`${F}${k({ x: V, y: v, w: Ct, h: ge, field: `${S}:empty`, cls: " muted", lines: [c("control.flow.nothing")] })}` };
    }
    let q = v;
    const D = T.map((ge, _o) => {
      const Xt = A(S, ge, _o, V, q);
      return q += Xt.h + vn, Xt.svg;
    });
    return { bottom: q - vn, body: _`${F}${D}` };
  }), U = Math.max(...O.map((S) => S.bottom)) + B;
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${pe * Td}px`} viewBox=${`0 0 ${pe} ${U}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${c("control.flow.title")}>
        ${y.map((S) => _`<path class="fc-link" d=${S}></path>`)}
        ${i.sources.map((S, I) => {
    var q;
    const T = s == null ? void 0 : s[I], V = T && T.detail !== "" && "source" in S ? Bd(T, t.now, S.source) : _e(S) || T == null ? void 0 : T.detail, F = c("control.gives").replace("{what}", (T == null ? void 0 : T.gives) ?? t.gives(S));
    return k({
      x: p.xs[I],
      y: p.inY(I),
      w: ot,
      h: a,
      field: `source:${I}`,
      cls: T && !st(S) && !_e(S) ? j(T.value) : "",
      lines: _e(S) ? [...((q = t.eventLines) == null ? void 0 : q.call(t, S)) ?? [t.sourceLabel(S)], F] : [`${"not" in S && S.not ? "NOT " : ""}${(T == null ? void 0 : T.label) ?? t.sourceLabel(S)}`, ...V ? [V] : [], F]
    });
  })}
        ${k({
    x: (pe - et) / 2,
    y: h,
    w: et,
    h: u,
    field: "event",
    cls: l != null && l.dropped ? " nodata" : "",
    lines: M
  })}
        ${e.gate ? k({
    x: (pe - et) / 2,
    y: d,
    w: et,
    h: J(2),
    field: "gate",
    cls: n != null && n.gate ? j(n.gate.value) : "",
    lines: Ud(e.gate, t.sourceLabel(e.gate), n == null ? void 0 : n.gate, t.now)
  }) : $}
        ${O.map((S) => S.body)}
      </svg>
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const eh = ["on", "off", "toggle"], d0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" };
function th(t, e) {
  var i;
  if (_e(e)) return "on";
  if (!st(e)) return "on / off";
  const n = (i = t.deviceById(e.button)) == null ? void 0 : i.props;
  return (n == null ? void 0 : n.kind) === "smart_button" && n.separateOff ? "on / off" : "toggle";
}
const nh = (t, e) => {
  const n = t.ruleName(e.event.rule);
  return n === void 0 ? c("rules.missingRule") : $d(n, e.event.what);
};
function h0(t, e, n, i) {
  const o = `control-source-${n}`, s = g`<span class="muted" data-part="gives">${c("control.gives").replace("{what}", th(t, e))}</span>`;
  if (_e(e)) {
    const l = t.otherRules.find((a) => a.id === e.event.rule);
    return g`
    <div class="rline${l && Cr(l).includes(e.event.what) ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${nh(t, e)}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${c("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
  }
  if (!st(e)) return zr(t, e, o, i, s);
  const r = t.deviceById(e.button);
  return g`
    <div class="rline${(r == null ? void 0 : r.props.kind) === "smart_button" ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${(r == null ? void 0 : r.name) ?? c("rules.missingDevice")}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${c("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
}
function p0(t) {
  const e = t.draft.rule.control, n = [];
  return e.sources.length === 0 && n.push({ key: "pick-sources", text: c("control.problem.sources") }), eh.every((i) => e[i].length === 0) && n.push({ key: "pick-actions", text: c("control.problem.actions") }), [...n, ...t.problems.filter((i) => i !== "control" || n.length === 0).map((i) => ({ key: i, text: c(`rules.problem.${i}`) }))];
}
function f0(t) {
  const e = t.draft.rule, n = e.control, i = (h) => t.onChange({ ...e, control: { ...n, sources: h } }), o = (h) => {
    var d;
    return ((d = t.deviceById(h)) == null ? void 0 : d.name) ?? c("rules.missingDevice");
  }, s = t.buttons.filter((h) => !n.sources.some((d) => st(d) && d.button === h.id)), r = s.length > 0 ? g`<optgroup label=${c("control.group.buttons")}>
      ${s.map((h) => g`<option value=${`b:${h.id}`}>${h.name}</option>`)}
    </optgroup>` : void 0, l = t.otherRules.flatMap((h) => Cr(h).map((d) => ({ rule: h, what: d }))).filter((h) => !n.sources.some((d) => _e(d) && d.event.rule === h.rule.id && d.event.what === h.what)), a = l.length > 0 ? g`<optgroup label=${c("control.group.events")}>
      ${l.map((h) => g`<option value=${`e:${h.rule.id}:${h.what}`}>${$d(h.rule.name, h.what)}</option>`)}
    </optgroup>` : void 0, u = (h) => {
    const d = h.target;
    if (d.value.startsWith("e:")) {
      const [, m, w] = d.value.split(":");
      d.value = "", i([...n.sources, { event: { rule: m, what: w } }]);
      return;
    }
    if (!d.value.startsWith("b:")) {
      Rr(t, (m) => i([...n.sources, { source: m }]))(h);
      return;
    }
    const f = d.value.slice(2);
    d.value = "", i([...n.sources, { button: f }]);
  }, p = g`
    <div class="rsettings">
      <p class="muted">${c("control.hint")}</p>
      ${Xd(t)}

      <div class="rgroup">
        <div class="rlabel">${c("control.sources")}</div>
        ${n.sources.map((h, d) => h0(
    t,
    h,
    d,
    (f) => i(f ? n.sources.map((m, w) => w === d ? f : m) : n.sources.filter((m, w) => w !== d))
  ))}
        <select class="radd" data-action="add-source" .value=${""} @change=${u}>
          ${Hr(t, c("control.addSource"), g`${r}${a}`)}
        </select>
      </div>

      ${Kd(t, c("control.gate"), "control-gate", c("control.gateNote"))}

      ${eh.map((h) => Gd(t, {
    label: c(d0[h]),
    addText: c("control.addAction"),
    add: `add-action-${h}`,
    addField: `control-${h}`,
    field: (d) => `control-${h}-${d}`,
    list: n[h],
    set: (d) => t.onChange({ ...e, control: { ...n, [h]: d } }),
    actionsFor: bn,
    firstDo: (d) => bn(d).includes(h) ? h : bn(d)[0],
    doText: (d) => c(`control.do.${d}`),
    unique: !0
  }))}
    </div>`;
  return Yd({
    title: c("control.title"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: p0(t),
    form: p,
    diagram: u0({
      rule: e,
      trace: t.trace,
      note: t.note,
      now: t.now,
      nameOf: o,
      sourceLabel: (h) => st(h) ? o(h.button) : _e(h) ? nh(t, h) : Vr(t, h),
      eventLines: (h) => _e(h) ? [t.ruleName(h.event.rule) ?? c("rules.missingRule"), c(`control.event.${h.event.what}`)] : [],
      gives: (h) => th(t, h),
      focused: t.draft.focused,
      onFocus: t.onFocus
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
const m0 = ["power", "voltage", "power_in", "power_out", "control"], g0 = 300;
function ec(t) {
  t().catch(() => {
  });
}
function b0(t, e) {
  var o;
  const n = new Map(e.devices.map((s) => [s.id, s])), i = {};
  for (const s of t.blocks) {
    const r = s.kind === "device" ? n.get(s.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Zt(r), controllable: Fc(r) };
    for (const a of m0) {
      const u = (o = r.bindings) == null ? void 0 : o[a];
      u && (l[a] = u);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class v0 {
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
      }, g0);
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
      this.setFailure(c("output.noLive"));
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
    this.sub = null, n && (n.live = !1, e && n.unsub && ec(n.unsub));
  }
  subscribe() {
    const { conn: e, planId: n, payload: i } = this;
    if (!(e != null && e.subscribeMessage) || n === null || i === null || this.offline) return;
    const o = { live: !0, unsub: null };
    this.sub = o, e.subscribeMessage(
      (s) => {
        o.live && (this.current = s, this.host.requestUpdate());
      },
      { type: "plan_studio/power/subscribe", plan_id: n, power: i.power, devices: i.devices },
      { resubscribe: !1 }
    ).then(
      (s) => {
        if (!o.live) {
          ec(s);
          return;
        }
        o.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        o.live && (o.live = !1, this.sub = null, this.current = null, this.setFailure(Ce(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Nr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Dr));
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
const ls = 1e4, tc = 400, w0 = 1e3, nc = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), $0 = ["timer", "power"], y0 = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function k0(t, e) {
  return t === 0 ? e : `${t}_${e}`;
}
function ic(t) {
  var n;
  if (t.props.kind !== "smart_button") return [];
  const e = [];
  for (const { role: i } of Ae(t)) {
    if (i !== "on" && i !== "off" && i !== "auto") continue;
    const o = (n = t.bindings) == null ? void 0 : n[i], s = t.props[i];
    o && s && typeof s.event == "string" && s.event && e.push({ entity: o, value: k0(s.slot, s.event) });
  }
  return e;
}
function ih(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], o = (s, r, l = !1) => {
    s && !i.some((a) => a.entity === s) && i.push({ entity: s, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: s } of Ae(t)) (s === "on" || s === "off" || s === "auto") && o(e[s], !1);
  else n === "wall_switch" ? o(e.state, !0) : n === "valve" && o(e.state, !0, !0);
  return i;
}
function x0(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function M0(t, e, n) {
  var i;
  if (t.settled) {
    const o = x0(e.state, t.valve);
    return o === void 0 ? {} : { value: o, text: n && n.last !== o ? o : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (nc.has(e.state)) return {};
    const o = (i = e.attributes) == null ? void 0 : i.event_type, s = n && n.last !== e.state && typeof o == "string" && o !== "";
    return { value: e.state, text: s ? o : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !nc.has(e.state) ? e.state : void 0 };
}
function oc(t, e, n, i) {
  const o = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return qu(o, n, i)[0];
}
function _0(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of ih(n)) e.add(i.entity);
  return [...e].sort();
}
class A0 {
  constructor() {
    this.seen = /* @__PURE__ */ new Map(), this.events = /* @__PURE__ */ new Map(), this.bubbles = /* @__PURE__ */ new Map(), this.leave = /* @__PURE__ */ new Map();
  }
  /** Compare states with the last seen ones for every event source of the level's devices; record new events and bubble exits. */
  update(e, n, i) {
    for (const o of e.devices)
      this.updateEvents(e, o, n, i), this.updateBubbles(o, n, i);
  }
  /** The device's event bubble text while under EVENT_MS old, else null. */
  event(e, n) {
    const i = this.events.get(e);
    return i && n - i.at < ls ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < tc).map((r) => r.bubble), o = this.events.get(e), s = o ? n - o.at : -1;
    return o && s >= ls && s < ls + w0 && i.push({ text: o.text, tone: o.tone, key: o.at }), i;
  }
  updateEvents(e, n, i, o) {
    const s = ih(n), r = `${n.id}|`, l = new Set(s.map((a) => r + a.entity));
    for (const a of [...this.seen.keys()]) a.startsWith(r) && !l.has(a) && this.seen.delete(a);
    for (const a of s) {
      const u = y0(i, a.entity);
      if (!u) continue;
      const p = r + a.entity, { value: h, text: d } = M0(a, u, this.seen.get(p));
      if (h !== void 0 && this.seen.set(p, { last: h }), !!d) {
        if (n.props.kind !== "smart_button") {
          this.events.set(n.id, { text: d, at: o, tone: "event" });
          continue;
        }
        ic(n).some((f) => f.entity === a.entity && f.value === d) ? this.events.set(n.id, { text: d, at: o, tone: "event" }) : e.devices.some((f) => f !== n && ic(f).some((m) => m.entity === a.entity && m.value === d)) || this.events.set(n.id, { text: c("live.noTrigger").replace("{action}", d), at: o, tone: "unmatched" });
      }
    }
  }
  updateBubbles(e, n, i) {
    const o = fi(e, n), s = this.bubbles.get(e.id);
    if (s) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < tc);
      for (const l of $0) {
        const a = oc(s, l, e, i);
        a && !oc(o, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, o);
  }
}
const ci = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function sc(t) {
  t().catch(() => {
  });
}
class S0 {
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
    var s, r;
    const n = e ? [...new Set(e)].sort() : [], i = n.length ? n.join(`
`) : null;
    if (i === this.key || (this.stop(), i === null)) return;
    this.key = i, this.ids = n;
    const o = this.connection();
    o != null && o.subscribeMessage && (this.conn = o, (s = o.addEventListener) == null || s.call(o, "disconnected", this.onDisconnected), (r = o.addEventListener) == null || r.call(o, "ready", this.onReady), this.subscribe());
  }
  /** Ends the subscription, stops listening to the connection and forgets the states. */
  stop() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady), this.drop(!0), this.key = null, this.ids = [], this.map = /* @__PURE__ */ new Map();
  }
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && sc(n.unsub));
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
        n.live ? n.unsub = i : sc(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, o] of Object.entries(e.a ?? {}))
      !o || typeof o.s != "string" || this.map.set(i, { state: o.s, attributes: { ...o.a ?? {} }, last_changed: ci(o.lc) ?? ci(o.lu) });
    for (const [i, o] of Object.entries(e.c ?? {})) {
      const s = this.map.get(i);
      if (!s || !o) continue;
      const r = { ...s, attributes: { ...s.attributes } }, l = o["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== s.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const u = ci(l.lc) ?? (a ? ci(l.lu) : void 0);
        u && (r.last_changed = u);
      }
      for (const a of ((n = o["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
function rc(t) {
  t().catch(() => {
  });
}
class L0 {
  constructor(e, n, i = Date.now) {
    this.host = e, this.connection = n, this.now = i, this.planId = null, this.sub = null, this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.failure = null, this.conn = null, this.retryTimer = null, this.retries = 0, this.merged = null, this.version = 0, this.onDisconnected = () => {
      this.cancelRetry(), this.drop(!1), this.forget(), this.host.requestUpdate();
    }, this.onReady = () => {
      this.cancelRetry(), this.retries = 0, this.drop(!0), this.subscribe();
    };
  }
  /** The first event for the watched plan has arrived. */
  get ready() {
    return this.gotFull;
  }
  /** Why there is no live state (no subscription support, or the subscription failed), else null. */
  get error() {
    return this.failure;
  }
  /** The state of a virtual switch device; undefined while unknown (not saved yet, or no event yet). */
  stateOf(e) {
    var n;
    return (n = this.map.get(e)) == null ? void 0 : n.state;
  }
  /** `states` with the virtual switches added; `states` itself while there are none. */
  merge(e) {
    if (this.map.size === 0) return e;
    const n = this.merged;
    if (n && n.states === e && n.version === this.version) return n.out;
    const i = { ...e };
    for (const [o, s] of this.map) i[Ln(o)] = { state: s.state, attributes: {}, last_changed: s.since };
    return this.merged = { states: e, version: this.version, out: i }, i;
  }
  watch(e) {
    e !== this.planId && (this.stop(), this.planId = e, e !== null && this.start());
  }
  stop() {
    this.unlisten(), this.cancelRetry(), this.retries = 0, this.drop(!0), this.planId = null, this.forget(), this.failure = null;
  }
  forget() {
    this.map = /* @__PURE__ */ new Map(), this.gotFull = !1, this.version++;
  }
  start() {
    var n, i;
    const e = this.connection();
    if (!(e != null && e.subscribeMessage)) {
      this.setFailure(c("output.noLive"));
      return;
    }
    this.conn = e, (n = e.addEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e.addEventListener) == null || i.call(e, "ready", this.onReady), this.subscribe();
  }
  unlisten() {
    var n, i;
    const e = this.conn;
    this.conn = null, (n = e == null ? void 0 : e.removeEventListener) == null || n.call(e, "disconnected", this.onDisconnected), (i = e == null ? void 0 : e.removeEventListener) == null || i.call(e, "ready", this.onReady);
  }
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && rc(n.unsub));
  }
  subscribe() {
    const e = this.conn, n = this.planId;
    if (!(e != null && e.subscribeMessage) || n === null) return;
    const i = { live: !0, unsub: null };
    this.sub = i, e.subscribeMessage(
      (o) => {
        i.live && this.apply(o);
      },
      { type: "plan_studio/virtual/subscribe", plan_id: n },
      { resubscribe: !1 }
    ).then(
      (o) => {
        if (!i.live) {
          rc(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ce(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= Dd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Od));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  /** The event is the whole map: a device whose state did not change keeps its time, a new or changed one gets this frame's. */
  apply(e) {
    const n = new Date(this.now()).toISOString(), i = /* @__PURE__ */ new Map();
    for (const [o, s] of Object.entries(e.states ?? {})) {
      if (s !== "on" && s !== "off") continue;
      const r = this.map.get(o);
      i.set(o, r && r.state === s ? r : { state: s, since: n });
    }
    this.map = i, this.gotFull = !0, this.version++, this.host.requestUpdate();
  }
  setFailure(e) {
    this.failure = e, this.host.requestUpdate();
  }
}
class C0 {
  constructor(e, n, i) {
    this.connection = e, this.bundleVersion = n, this.onChange = i, this.serverVersion = null, this.conn = null, this.run = 0, this.retries = 0, this.timer = null, this.onReady = () => {
      this.retries = 0, this.check();
    };
  }
  /** Starts listening to the current connection (a no-op for the same one) and asks once. */
  watch() {
    var n;
    if (!this.bundleVersion) return;
    const e = this.connection();
    !e || e === this.conn || (this.stop(), this.conn = e, this.retries = 0, (n = e.addEventListener) == null || n.call(e, "ready", this.onReady), this.check());
  }
  stop() {
    var e, n;
    (n = (e = this.conn) == null ? void 0 : e.removeEventListener) == null || n.call(e, "ready", this.onReady), this.conn = null, this.run++, this.cancelRetry();
  }
  cancelRetry() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
  async check() {
    const e = this.conn;
    if (!e) return;
    this.cancelRetry();
    const n = ++this.run;
    try {
      const { version: i } = await Dg({ connection: e });
      if (n !== this.run || typeof i != "string" || !i) return;
      const o = i === this.bundleVersion ? null : i;
      if (o === null && this.serverVersion !== null) return;
      o !== this.serverVersion && (this.serverVersion = o, this.onChange());
    } catch {
      if (n !== this.run || this.retries >= Nr) return;
      this.retries++, this.timer = setTimeout(() => {
        this.timer = null, this.check();
      }, Dr);
    }
  }
}
var I0 = Object.defineProperty, X = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && I0(e, n, o), o;
};
const E0 = "0.27.0", jr = class jr extends Nt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = zh.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = l1(), this.nextObj = zv(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = $u(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new X$(), this.resizeObs = null, this.session = new Hw(this), this.haMeta = new zw(this), this.feed = new Y$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new m$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.virtualFeed = new L0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new v0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.hint = new Z1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, (i) => {
      var s;
      const o = this.power.blocks.find((r) => r.id === i);
      return o && this.mode === "power" ? q1(o, this.ctx.geo(), (s = this.powerFeed.frame) == null ? void 0 : s.blocks[i]) : [];
    }), this.events = new A0(), this.entityFeed = new S0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.reloadPage = () => location.reload(), this.updateCheck = new C0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, E0, () => this.requestUpdate()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Oh(i, (o) => wu(this.haMeta.get(), o, this.liveStates)), this.onBeforeUnload = (i) => {
      this.drafts.flush(), this.save.dirty && (i.preventDefault(), i.returnValue = "");
    }, this.onPageHide = () => {
      this.drafts.flush();
    }, this.refocus = (i) => {
      const o = i.composedPath()[0];
      o instanceof Element && o.closest("button") && this.focus();
    }, this.refocusAfterChange = (i) => {
      const o = i.composedPath()[0];
      (o instanceof HTMLInputElement || o instanceof HTMLSelectElement) && (o.blur(), this.focus());
    };
    const e = this, n = {
      get connection() {
        return e.hass.connection;
      }
    };
    this.save = new K1(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Rw(this), this.activeTool = As("select", this.ctx), this.input = new j$(this);
  }
  /** True while the 1 s ticker runs (Binding step with a timer, event or fading bubble). */
  get tickerOn() {
    return this.ticker !== null;
  }
  /** hass.states plus the virtual switches (`virtual.<device id>`): every reader of live states takes these. */
  get liveStates() {
    var e;
    return this.virtualFeed.merge((e = this.hass) == null ? void 0 : e.states);
  }
  doSave() {
    return this.session.doSave();
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), this.hasAttribute("tabindex") || (this.tabIndex = 0), this.addEventListener("keydown", this.input.keyDown), this.addEventListener("keyup", this.input.keyUp), this.addEventListener("blur", this.input.blur), window.addEventListener("beforeunload", this.onBeforeUnload), window.addEventListener("pagehide", this.onPageHide), this.feed.watch(((e = this.plan) == null ? void 0 : e.id) ?? null), this.watchPower(), this.watchRules(), this.watchVirtual(), this.watchEntities(), this.updateCheck.watch();
  }
  disconnectedCallback() {
    var e;
    this.updateCheck.stop(), super.disconnectedCallback(), this.removeEventListener("keydown", this.input.keyDown), this.removeEventListener("keyup", this.input.keyUp), this.removeEventListener("blur", this.input.blur), window.removeEventListener("beforeunload", this.onBeforeUnload), window.removeEventListener("pagehide", this.onPageHide), this.plan && this.save.dirty && !this.session.draftBlocked() && this.drafts.write(this.session.makeDraft()), this.drafts.cancel(), (e = this.resizeObs) == null || e.disconnect(), this.resizeObs = null, this.feed.stop(), this.powerFeed.stop(), this.hint.hide(), this.rulesFeed.stop(), this.virtualFeed.stop(), this.entityFeed.stop(), this.stopTicker();
  }
  willUpdate(e) {
    var o, s;
    this.ruleDraft && !this.modal && (this.ruleDraft = null), e.has("hass") && this.hass && !this.plan && !this.loading && !this.loadError && this.session.load();
    const n = ((o = this.history) == null ? void 0 : o.current.level) ?? null;
    this.watchEntities(), e.has("hass") && this.isConnected && this.updateCheck.watch(), n && this.hass && (e.has("hass") || n !== this.trackedLevel) && this.events.update(n, this.entityFeed.overlay(this.liveStates), Date.now()), this.trackedLevel = n;
    const i = this.size.w > 0 && this.size.h > 0;
    this.needFit && i && (this.needFit = !1, this.fit()), this.needPowerFit && i && this.mode === "power" && (this.needPowerFit = !1, this.fitPower()), this.feed.watch(this.isConnected ? ((s = this.plan) == null ? void 0 : s.id) ?? null : null), this.watchPower(), this.watchRules(), this.watchVirtual(), this.hint.sync();
  }
  /** The rules feed watches the open plan in the Binding (mode bubbles) and Automation steps of an attached panel. */
  watchRules() {
    var e;
    this.rulesFeed.watch(this.isConnected && (this.mode === "automation" || this.mode === "binding") ? ((e = this.plan) == null ? void 0 : e.id) ?? null : null);
  }
  /** The virtual feed watches the open plan while it has a virtual switch (any step: the Binding look, the rule dialogs, the Automation step). */
  watchVirtual() {
    const e = this.isConnected && !!this.plan && this.planLevels().some((n) => n.devices.some((i) => i.props.kind === "virtual_switch"));
    this.virtualFeed.watch(e ? this.plan.id : null);
  }
  /** The entity feed watches the open level's event sources in the Binding and Automation steps of an attached panel. */
  watchEntities() {
    var n;
    const e = this.isConnected && (this.mode === "binding" || this.mode === "automation") ? (n = this.history) == null ? void 0 : n.current.level : void 0;
    this.entityFeed.watch(e ? _0(e) : null);
  }
  /** Every entity feed message: the tracker sees each value, even one the next message replaces at once. */
  onEntities() {
    var n;
    const e = (n = this.history) == null ? void 0 : n.current.level;
    e && this.hass && this.events.update(e, this.entityFeed.overlay(this.liveStates), Date.now()), this.requestUpdate();
  }
  /** The power feed carries the draft schematic; it is idle outside the Power step and while detached. */
  watchPower() {
    const e = this.isConnected && this.mode === "power" ? this.level : null;
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? b0(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, u, p, h, d, f, m, w, v, b, y, k;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((M) => fi(M, this.liveStates).timerSince !== void 0 || this.events.event(M.id, n) !== null || this.events.leaving(M.id, n).length > 0), o = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, s = !!o && (!!o.pending || o.inputs.some((M) => M.until !== void 0 && M.until > n) || (((l = o.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = o.boiler) == null ? void 0 : a.until) ?? 0) > n || (((u = o.boiler) == null ? void 0 : u.settling) ?? 0) > n || ((p = o.timed) == null ? void 0 : p.running) === !0 && (o.timed.until ?? 0) > n || [(h = o.outside) == null ? void 0 : h.pausedUntil, (d = o.outside) == null ? void 0 : d.until, (f = o.outside) == null ? void 0 : f.windowUntil, (m = o.beurer) == null ? void 0 : m.pausedUntil, (w = o.beurer) == null ? void 0 : w.cycleAt, (v = o.beurer) == null ? void 0 : v.keptUntil, (b = o.motionLight) == null ? void 0 : b.offAt, (y = o.motionLight) == null ? void 0 : y.minUntil, (k = o.motionLight) == null ? void 0 : k.autoAt].some((M) => (M ?? 0) > n));
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
    const i = this.history.current.power, o = n ?? (i && zf(i, e));
    this.history.push({ ...this.history.current, level: e, ...o && o !== this.power ? { power: o } : {} }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate();
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
    return (((n = this.plan) == null ? void 0 : n.levels) ?? []).map((i, o) => o === 0 && e ? e : i);
  }
  /**
   * Opens the rule dialog: a rule id edits that rule (the template does not matter then); otherwise a new rule
   * from the template, in the selected zone. The dialog works on a copy; OK commits one edit, Cancel drops it.
   */
  openRuleDialog(e, n) {
    var o, s;
    if (!this.plan || !this.history || this.dialog !== null) return;
    let i;
    if (n !== void 0) {
      const r = this.rules.find((l) => l.id === n);
      if (!r) return;
      i = { rule: structuredClone(r), isNew: !1, focused: null };
    } else {
      const r = this.planLevels(), l = ((o = this.selection) == null ? void 0 : o.kind) === "zone" ? this.selection.id : null, a = r.flatMap((d) => d.zones).find((d) => d.id === l), u = ((s = this.selection) == null ? void 0 : s.kind) === "device" ? r.flatMap((d) => d.devices).find((d) => d.id === this.selection.id) : void 0, p = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? rw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Tw({}, p, u && Ko(u) ? u.id : null, u && Ko(u) ? u.name : "") : e === "outside" ? Mw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "control" ? ww({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? kw(p, (a == null ? void 0 : a.name) ?? null) : e === "motionLight" ? Sw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? Nw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? Lw({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? Ew({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, p, (a == null ? void 0 : a.name) ?? null) : Re(p), isNew: !0, focused: null };
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
      var s;
      const i = this.renderRoot.querySelector(`.rule-backdrop [data-field="${n}"]`), o = i != null && i.matches("input, select, button") ? i : (i == null ? void 0 : i.querySelector("select, input, button")) ?? i;
      (s = o == null ? void 0 : o.scrollIntoView) == null || s.call(o, { block: "nearest" }), o == null || o.focus();
    });
  }
  /** OK: the rule is added or changed as one undoable edit (an unchanged rule closes the dialog without an edit). */
  commitRuleDraft() {
    const e = this.ruleDraft;
    if (this.dialog = null, this.ruleDraft = null, !e) return;
    const n = this.rules.find((i) => i.id === e.rule.id);
    e.isNew ? this.commitRules(qv(this.rules, e.rule)) : n && !vi(n, e.rule) && this.commitRules(Zv(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && vi(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return $;
    const n = this.planLevels(), i = n.flatMap((d) => d.devices), o = e.rule, s = this.session.savedRules.find((d) => d.id === o.id), r = this.shownRuleTrace(o), l = s ? vi(s, o) ? null : c("rules.flow.edited") : c("rules.flow.new"), a = n.length > 1, u = n.flatMap((d) => d.zones.map((f) => ({ id: f.id, name: a ? `${f.name} (${d.name})` : f.name }))), p = tw(
      this.rules,
      o,
      (d) => i.some((f) => f.id === d),
      (d) => {
        const f = i.find((m) => m.id === d);
        return f && te(f);
      },
      (d) => i.some((f) => f.id === d && f.props.kind === "illuminance_sensor"),
      (d) => i.some((f) => f.id === d && f.props.kind === "climate_sensor"),
      (d) => i.some((f) => f.id === d && Cs(f)),
      (d) => i.some((f) => f.id === d && (f.props.kind === "wall_switch" || f.props.kind === "smart_button")),
      (d) => this.boilerGridBlocks().some((f) => f.id === d),
      (d) => {
        const f = i.find((m) => m.id === d);
        return !f || xd(f);
      },
      (d) => i.some((f) => f.id === d && f.props.kind === "leak_sensor"),
      (d) => i.some((f) => f.id === d && f.props.kind === "valve"),
      (d) => i.some((f) => f.id === d && (f.props.kind === "wall_switch" || f.props.kind === "smart_button")),
      (d) => i.some((f) => f.id === d && te(f).includes("on")),
      (d) => i.some((f) => f.id === d && te(f).includes("on")),
      (d) => i.some((f) => f.id === d && te(f).includes("on")),
      (d) => i.some((f) => {
        var m;
        return f.id === d && !!((m = f.bindings) != null && m.power);
      }),
      (d) => i.some((f) => f.id === d && f.props.kind === "smart_button"),
      (d) => i.some((f) => f.id === d && bn(f).length > 0),
      (d) => i.some((f) => f.id === d && te(f).includes("on") && te(f).includes("off")),
      (d) => i.some((f) => f.id === d && f.props.kind === "motion_sensor"),
      (d) => i.some((f) => f.id === d && xa(f)),
      (d) => i.some((f) => f.id === d && f.props.kind === "virtual_switch"),
      (d) => i.some((f) => f.id === d && ka(f))
    );
    if (Iw(o))
      return _y({
        draft: e,
        boilers: i.filter(Cs),
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        grids: this.boilerGridBlocks().map((d) => ({ id: d.id, name: d.name || c("power.kind.grid") })),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, by[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (sw(o))
      return Iy({
        draft: e,
        sensors: i.filter((d) => d.props.kind === "leak_sensor"),
        valves: i.filter((d) => d.props.kind === "valve"),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Ay(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (cw(o))
      return Hy({
        draft: e,
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        devices: i.filter((d) => te(d).includes("on")),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
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
      });
    if (xw(o))
      return jy({
        draft: e,
        lights: i.filter((d) => te(d).includes("on")),
        sensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, zy[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Aw(o))
      return s0({
        draft: e,
        lights: i.filter((d) => {
          const f = te(d);
          return f.includes("on") && f.includes("off");
        }),
        sensors: i.filter((d) => d.props.kind === "motion_sensor"),
        daylightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        buttons: i.filter(xa),
        blockers: i.filter(ka),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Jy(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (yw(o))
      return Yy({
        draft: e,
        heaters: i.filter((d) => te(d).includes("on")),
        sources: i.filter((d) => {
          var f;
          return !!((f = d.bindings) != null && f.power);
        }),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, qy[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Ow(o))
      return gy({
        draft: e,
        climateSensors: i.filter((d) => d.props.kind === "climate_sensor"),
        fans: i.filter((d) => {
          const f = te(d);
          return f.includes("on") && f.includes("off");
        }),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: u,
        problems: p,
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
      });
    const h = {
      draft: e,
      inputDevices: i.filter(Ko),
      lightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
      lightUnit: (d) => {
        var w, v, b, y;
        const f = (v = (w = i.find((k) => k.id === d)) == null ? void 0 : w.bindings) == null ? void 0 : v.illuminance, m = f ? (b = this.liveStates) == null ? void 0 : b[f] : void 0;
        return (y = m == null ? void 0 : m.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((d) => te(d).length > 0),
      deviceById: (d) => i.find((f) => f.id === d),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter((d) => d.id !== o.id && !ya(d)),
      ruleName: (d) => {
        var f;
        return (f = this.rules.find((m) => m.id === d)) == null ? void 0 : f.name;
      },
      zones: u,
      problems: p,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (d) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
      },
      onFocus: (d) => this.focusRuleField(d),
      onUnit: (d, f) => {
        const m = this.ruleDraft ?? e;
        this.ruleDraft = { ...m, units: { ...m.units, [d]: f } };
      },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    };
    return ya(o) ? f0({
      ...h,
      actionDevices: i.filter((d) => bn(d).length > 0),
      buttons: i.filter((d) => d.props.kind === "smart_button"),
      onFocus: (d) => this.focusRuleField(d, r0(d))
    }) : hy(h);
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(Gv(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Go(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Go(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Mu(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? cr(n, e.id) : e.kind === "opening" ? Hc(n, e.id) : du(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Au(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = ku(n, e.id);
    return i === n ? this.notice = c("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = Ce(i);
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
    const n = this.selection, i = this.level, o = this.mode === "binding" || this.mode === "automation";
    this.selection = o && n && i && Go(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = As(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(Sr(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const o = ae(n, i);
    o && (this.view = Ca(this.view, o.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const o = su(n).get(e);
    o && (this.view = Ca(this.view, o, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? Pv(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return T$(this.svgEl(), this.view, e);
  }
  /** Power step pointer move without a button: the block under the pointer (not a bus, wire or empty space) rests for the hint. */
  hintHover(e) {
    if (this.mode !== "power") return;
    const n = ys(this.power, this.toMm(e), this.ctx.tolMm(), this.ctx.geo()), i = (n == null ? void 0 : n.kind) === "block" ? n.id : (n == null ? void 0 : n.kind) === "port" || (n == null ? void 0 : n.kind) === "chip" ? n.block : null;
    this.hint.move(i !== null && this.hint.meterCount(i) > 0 ? i : null);
  }
  /** The open hover hint over the canvas: its lines beside the hovered block (screen pixels of the canvas). */
  renderHint(e) {
    const n = this.hint.openId, i = this.hint.lines(e), o = n === null ? void 0 : this.power.blocks.find((p) => p.id === n);
    if (!i || !o) return $;
    const { x: s, y: r, scale: l } = this.view, a = Ie(o, this.ctx.geo(), this.power), u = Og({ x: (a.x - s) * l, y: (a.y - r) * l, w: a.w * l, h: a.h * l }, Eg(i), this.size);
    return g`<div class="power-hint" role="tooltip" style=${`left:${u.left}px;top:${u.top}px`}>
      ${i.map((p) => g`<div class="line">${p}</div>`)}</div>`;
  }
  fit() {
    var e;
    this.planView = V$(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = um(this.power, this.ctx.geo());
    e && (this.powerView = H$(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, o;
    return Z$({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((s) => s.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((o = this.dialog) == null ? void 0 : o.kind) === "delete-rule" ? Qv(this.rules, this.dialog.id).map((s) => s.name) : [],
      saving: this.save.state === "saving",
      message: this.save.errorMessage,
      restore: (s) => this.session.restoreDraft(s),
      discard: (s) => this.session.discardDraft(s),
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
    var f, m, w;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${c("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${c("action.retry")}</button>` : c("load.loading")}</div>`;
    const e = Gb(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: o, y: s, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, u = this.save, p = this.mode === "power", h = Date.now(), d = this.liveStates;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : p ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${O$(e)} ?data-update=${this.updateCheck.serverVersion !== null}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${this.updateCheck.serverVersion === null ? $ : g`<div class="update-bar" role="status">
          <span>${c("update.notice").replace("{version}", this.updateCheck.serverVersion)}</span>
          <button data-action="reload" @click=${() => this.reloadPage()}>${c("update.reload")}</button></div>`}
        ${Lv({
      steps: Ov({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (v) => {
          this.plan = { ...this.plan, name: v }, u.markDirty();
        },
        onMode: (v) => this.setMode(v)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: u.state,
      dirty: u.dirty,
      errorMessage: u.errorMessage,
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (v) => this.session.pickPlan(v),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${M$(this, n)}
        ${A$(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${o} ${s} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort} @pointerleave=${() => this.hint.hide()}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(v) => v.preventDefault()}>
            ${this.grid ? B$(this.view, l, a, e, p ? 0.1 : 1) : $}
            ${this.mode === "power" ? vg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : jb(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (v) => this.feed.stateOf(v),
      live: (v) => fi(v, d),
      bubbles: (v) => {
        const b = fi(v, d), y = this.events.event(v.id, h);
        return {
          shown: [...Q$(this.session.savedRules, (k) => this.rulesFeed.trace(k), v.id), ...qu(b, v, h), ...y ? [{ text: y.text, tone: y.tone, key: y.at }] : []],
          leaving: this.events.leaving(v.id, h)
        };
      }
    })}
            ${i.tracker ? I$(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: E$(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${p ? this.renderHint(h) : $}
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? q$({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${C$({
      grid: this.grid,
      zoomPct: Math.round(r * (p ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? c(`snap.${i.snap.kind}`) : null,
      onGrid: (v) => {
        this.grid = v;
      },
      cones: this.cones,
      onCones: (v) => {
        this.cones = v;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: p
    })}
        ${this.automationsMenu ? x$(this.automationsMenu, (v) => this.pickAutomation(v), () => this.closeAutomationsMenu()) : $}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
jr.styles = D$;
let Z = jr;
X([
  je({ attribute: !1 })
], Z.prototype, "hass");
X([
  je({ type: Boolean })
], Z.prototype, "narrow");
X([
  je({ attribute: !1 })
], Z.prototype, "panel");
X([
  K()
], Z.prototype, "plan");
X([
  K()
], Z.prototype, "automationsMenu");
X([
  K()
], Z.prototype, "loadError");
X([
  K()
], Z.prototype, "selection");
X([
  K()
], Z.prototype, "toolId");
X([
  K()
], Z.prototype, "wallType");
X([
  K()
], Z.prototype, "thickness");
X([
  K()
], Z.prototype, "boxMeasure");
X([
  K()
], Z.prototype, "grid");
X([
  K()
], Z.prototype, "mode");
X([
  K()
], Z.prototype, "bindFilter");
X([
  K()
], Z.prototype, "bindQuery");
X([
  K()
], Z.prototype, "railCollapsed");
X([
  K()
], Z.prototype, "showAll");
X([
  K()
], Z.prototype, "zoneQuery");
X([
  K()
], Z.prototype, "cones");
X([
  K()
], Z.prototype, "nextProps");
X([
  K()
], Z.prototype, "nextObj");
X([
  K()
], Z.prototype, "planView");
X([
  K()
], Z.prototype, "powerView");
X([
  K()
], Z.prototype, "placeDeviceId");
X([
  K()
], Z.prototype, "size");
X([
  K()
], Z.prototype, "dialog");
X([
  K()
], Z.prototype, "notice");
X([
  K()
], Z.prototype, "fieldNotice");
X([
  K()
], Z.prototype, "pendingDraft");
X([
  K()
], Z.prototype, "ruleDraft");
X([
  K()
], Z.prototype, "plans");
X([
  K()
], Z.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", Z);
export {
  Z as PlanStudioPanel
};
