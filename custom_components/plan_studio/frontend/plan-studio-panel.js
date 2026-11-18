/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fi = globalThis, Fs = fi.ShadowRoot && (fi.ShadyCSS === void 0 || fi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Us = Symbol(), Qr = /* @__PURE__ */ new WeakMap();
let fc = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== Us) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (Fs && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = Qr.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Qr.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const uh = (t) => new fc(typeof t == "string" ? t : t + "", void 0, Us), mc = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, o, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new fc(n, t, Us);
}, dh = (t, e) => {
  if (Fs) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), o = fi.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = n.cssText, t.appendChild(i);
  }
}, Jr = Fs ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return uh(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: hh, defineProperty: ph, getOwnPropertyDescriptor: fh, getOwnPropertyNames: mh, getOwnPropertySymbols: gh, getPrototypeOf: bh } = Object, ot = globalThis, el = ot.trustedTypes, wh = el ? el.emptyScript : "", Io = ot.reactiveElementPolyfillSupport, dn = (t, e) => t, _i = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? wh : null;
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
} }, Ws = (t, e) => !hh(t, e), tl = { attribute: !0, type: String, converter: _i, reflect: !1, useDefault: !1, hasChanged: Ws };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), ot.litPropertyMetadata ?? (ot.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Dt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = tl) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(e, i, n);
      o !== void 0 && ph(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: o, set: s } = fh(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? tl;
  }
  static _$Ei() {
    if (this.hasOwnProperty(dn("elementProperties"))) return;
    const e = bh(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(dn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(dn("properties"))) {
      const n = this.properties, i = [...mh(n), ...gh(n)];
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
      for (const o of i) n.unshift(Jr(o));
    } else e !== void 0 && n.push(Jr(e));
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
    return dh(e, this.constructor.elementStyles), e;
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
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : _i).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var s, r;
    const i = this.constructor, o = i._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const l = i.getPropertyOptions(o), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : _i;
      this._$Em = o;
      const c = a.fromAttribute(n, l.type);
      this[o] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, o = !1, s) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (o === !1 && (s = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? Ws)(s, n) || i.useDefault && i.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
Dt.elementStyles = [], Dt.shadowRootOptions = { mode: "open" }, Dt[dn("elementProperties")] = /* @__PURE__ */ new Map(), Dt[dn("finalized")] = /* @__PURE__ */ new Map(), Io == null || Io({ ReactiveElement: Dt }), (ot.reactiveElementVersions ?? (ot.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hn = globalThis, nl = (t) => t, Ai = hn.trustedTypes, il = Ai ? Ai.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, gc = "$lit$", Je = `lit$${Math.random().toFixed(9).slice(2)}$`, bc = "?" + Je, vh = `<${bc}>`, vt = document, _n = () => vt.createComment(""), An = (t) => t === null || typeof t != "object" && typeof t != "function", js = Array.isArray, $h = (t) => js(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Eo = `[ 	
\f\r]`, Qt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ol = /-->/g, sl = />/g, dt = RegExp(`>|${Eo}(?:([^\\s"'>=/]+)(${Eo}*=${Eo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rl = /'/g, ll = /"/g, wc = /^(?:script|style|textarea|title)$/i, vc = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), g = vc(1), _ = vc(2), $e = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), al = /* @__PURE__ */ new WeakMap(), ft = vt.createTreeWalker(vt, 129);
function $c(t, e) {
  if (!js(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return il !== void 0 ? il.createHTML(e) : e;
}
const yh = (t, e) => {
  const n = t.length - 1, i = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Qt;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, p, h = -1, d = 0;
    for (; d < a.length && (r.lastIndex = d, p = r.exec(a), p !== null); ) d = r.lastIndex, r === Qt ? p[1] === "!--" ? r = ol : p[1] !== void 0 ? r = sl : p[2] !== void 0 ? (wc.test(p[2]) && (o = RegExp("</" + p[2], "g")), r = dt) : p[3] !== void 0 && (r = dt) : r === dt ? p[0] === ">" ? (r = o ?? Qt, h = -1) : p[1] === void 0 ? h = -2 : (h = r.lastIndex - p[2].length, c = p[1], r = p[3] === void 0 ? dt : p[3] === '"' ? ll : rl) : r === ll || r === rl ? r = dt : r === ol || r === sl ? r = Qt : (r = dt, o = void 0);
    const f = r === dt && t[l + 1].startsWith("/>") ? " " : "";
    s += r === Qt ? a + vh : h >= 0 ? (i.push(c), a.slice(0, h) + gc + a.slice(h) + Je + f) : a + Je + (h === -2 ? l : f);
  }
  return [$c(t, s + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Sn {
  constructor({ strings: e, _$litType$: n }, i) {
    let o;
    this.parts = [];
    let s = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, p] = yh(e, n);
    if (this.el = Sn.createElement(c, i), ft.currentNode = this.el.content, n === 2 || n === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = ft.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(gc)) {
          const d = p[r++], f = o.getAttribute(h).split(Je), m = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: s, name: m[2], strings: f, ctor: m[1] === "." ? kh : m[1] === "?" ? Mh : m[1] === "@" ? _h : io }), o.removeAttribute(h);
        } else h.startsWith(Je) && (a.push({ type: 6, index: s }), o.removeAttribute(h));
        if (wc.test(o.tagName)) {
          const h = o.textContent.split(Je), d = h.length - 1;
          if (d > 0) {
            o.textContent = Ai ? Ai.emptyScript : "";
            for (let f = 0; f < d; f++) o.append(h[f], _n()), ft.nextNode(), a.push({ type: 2, index: ++s });
            o.append(h[d], _n());
          }
        }
      } else if (o.nodeType === 8) if (o.data === bc) a.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(Je, h + 1)) !== -1; ) a.push({ type: 7, index: s }), h += Je.length - 1;
      }
      s++;
    }
  }
  static createElement(e, n) {
    const i = vt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Rt(t, e, n = t, i) {
  var r, l;
  if (e === $e) return e;
  let o = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const s = An(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== s && ((l = o == null ? void 0 : o._$AO) == null || l.call(o, !1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = o : n._$Cl = o), o !== void 0 && (e = Rt(t, o._$AS(t, e.values), o, i)), e;
}
class xh {
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
    ft.currentNode = o;
    let s = ft.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new no(s, s.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (c = new Ah(s, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (s = ft.nextNode(), r++);
    }
    return ft.currentNode = vt, o;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let no = class yc {
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
    e = Rt(this, e, n), An(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== $e && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : $h(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && An(this._$AH) ? this._$AA.nextSibling.data = e : this.T(vt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: n, _$litType$: i } = e, o = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Sn.createElement($c(i.h, i.h[0]), this.options)), i);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === o) this._$AH.p(n);
    else {
      const r = new xh(o, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = al.get(e.strings);
    return n === void 0 && al.set(e.strings, n = new Sn(e)), n;
  }
  k(e) {
    js(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, o = 0;
    for (const s of e) o === n.length ? n.push(i = new yc(this.O(_n()), this.O(_n()), this, this.options)) : i = n[o], i._$AI(s), o++;
    o < n.length && (this._$AR(i && i._$AB.nextSibling, o), n.length = o);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const o = nl(e).nextSibling;
      nl(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class io {
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
    if (s === void 0) e = Rt(this, e, n, 0), r = !An(e) || e !== this._$AH && e !== $e, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = s[0], a = 0; a < s.length - 1; a++) c = Rt(this, l[i + a], n, a), c === $e && (c = this._$AH[a]), r || (r = !An(c) || c !== this._$AH[a]), c === $ ? e = $ : e !== $ && (e += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class kh extends io {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class Mh extends io {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
let _h = class extends io {
  constructor(e, n, i, o, s) {
    super(e, n, i, o, s), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Rt(this, e, n, 0) ?? $) === $e) return;
    const i = this._$AH, o = e === $ && i !== $ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== $ && (i === $ || o);
    o && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Ah {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Rt(this, e);
  }
}
const Sh = { I: no }, Oo = hn.litHtmlPolyfillSupport;
Oo == null || Oo(Sn, no), (hn.litHtmlVersions ?? (hn.litHtmlVersions = [])).push("3.3.3");
const Lh = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let o = i._$litPart$;
  if (o === void 0) {
    const s = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = o = new no(e.insertBefore(_n(), s), s, void 0, n ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = globalThis;
let Vt = class extends Dt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Lh(n, this.renderRoot, this.renderOptions);
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
var pc;
Vt._$litElement$ = !0, Vt.finalized = !0, (pc = gt.litElementHydrateSupport) == null || pc.call(gt, { LitElement: Vt });
const Do = gt.litElementPolyfillSupport;
Do == null || Do({ LitElement: Vt });
(gt.litElementVersions ?? (gt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ch = { attribute: !0, type: String, converter: _i, reflect: !1, hasChanged: Ws }, Ih = (t = Ch, e, n) => {
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
function Ze(t) {
  return (e, n) => typeof n == "object" ? Ih(t, e, n) : ((i, o, s) => {
    const r = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, i), r ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(t, e, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function X(t) {
  return Ze({ ...t, state: !0, attribute: !1 });
}
function oe() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function qs(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const bt = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Eh = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Oh = { ...bt, role: "power_in" }, Dh = { ...bt, role: "power_out" }, Nh = { role: "sun", domains: ["sun"], primary: !0 }, Ph = ["on", "off", "auto"], Zs = (t) => Ph.includes(t), No = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Th = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Nh
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [No("on"), No("off"), No("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, bt],
  // Fixed by the device (virtual.<id>, see virtualEntity); never chosen, so the Binding step shows no field for it.
  virtual_switch: [{ role: "control", domains: ["virtual"], primary: !0 }],
  // Announcements: the integration binds a speaker strictly to a player and an optional voice (needed to say text); a phone binds
  // no entity (its notify service is a prop).
  speaker: [{ role: "player", domains: ["media_player"], primary: !0 }, { role: "voice", domains: ["tts"], primary: !1 }],
  phone: [],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, bt, Eh, Oh, Dh]
}, Gs = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, Vh = { climate_sensor: "any", illuminance_sensor: "any" };
function Le(t) {
  const e = t.props, n = Th[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: o }) => o === "power" ? !i : o === "power_in" || o === "power_out" ? i : !0);
  }
  return n;
}
function xc(t) {
  return new Set(Le(t).map((e) => e.role));
}
function oo(t, e, n, i) {
  var l;
  const o = t.devices.find((a) => a.id === e);
  if (!o || !xc(o).has(n) || o.props.kind === "virtual_switch") return t;
  const s = (l = o.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (s === void 0) return t;
    const a = { ...o.bindings };
    delete a[n];
    const c = { ...o, bindings: a };
    if (Object.keys(a).length === 0 && delete c.bindings, n === "control" && o.props.kind === "equipment" && o.props.controllable) {
      const { controllable: p, ...h } = o.props;
      c.props = h;
    }
    return { ...t, devices: t.devices.map((p) => p === o ? c : p) };
  }
  if (s === i) return t;
  const r = { ...o, bindings: { ...o.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === o ? r : a) };
}
function Hh(t, e) {
  if (t.props.kind === "phone") return t.props.notify ? "bound" : "unbound";
  if (t.props.kind === "virtual_switch") return "bound";
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), o = Le(t).filter((l) => l.primary);
  if (i.length === 0) return o.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const s = o.filter((l) => !!n[l.role]);
  return (Vh[t.props.kind] === "any" ? s.length > 0 : s.length === o.length) ? "bound" : "partial";
}
function zh(t) {
  const e = Le(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Rh = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function ds(t, e) {
  var o;
  const n = (o = t.bindings) == null ? void 0 : o[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Zs(e) ? n : `${n}|${Rh(i[e])}`;
}
function Bh(t, e, n) {
  const i = ds(e, n);
  return i === null ? [] : t.devices.filter((o) => o.id !== e.id && Le(o).some((s) => ds(o, s.role) === i));
}
function Fh(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Le(t)) {
    const o = Zs(i) ? ds(t, i) : null;
    o !== null && (e.has(o) ? n.push(i) : e.add(o));
  }
  return n;
}
function so(t) {
  if (!t.bindings) return t;
  const e = xc(t), n = Object.entries(t.bindings).filter(([o, s]) => e.has(o) && !!s);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const kc = (t) => t === "wall_switch" || t === "smart_button", ro = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", Ln = (t) => t === "wall" ? "wall" : "free", Uh = [100, 125, 150], Ks = "mdi:cube-outline", cl = ["single", "double", "hold"], Wh = ["say", "play", "notify"], ye = (t) => Wh.includes(t), lt = (t) => "button" in t, Se = (t) => "event" in t, jh = {
  bearing: 400
}, mi = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Mc(t = oe(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function ul(t) {
  return {
    id: oe(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Mc()]
  };
}
const Xs = {
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
}, Bt = 90, _c = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function at(t, e) {
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
      return { kind: t, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Ks, label: "" };
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
const Cn = (t) => `virtual.${t}`;
function qh(t) {
  if (t.props.kind !== "virtual_switch") return t;
  const e = t.bindings;
  return e && Object.keys(e).length === 1 && e.control === Cn(t.id) ? t : { ...t, bindings: { control: Cn(t.id) } };
}
const Zh = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Ks
};
function Gh(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, o = typeof e.icon == "string" ? e.icon : Zh[String(n)] ?? Ks;
  return { ...t, props: { ...i, icon: o } };
}
function Kh(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = Ln(t.placement.mode);
  return e ? { ...t, props: at("smart_button", n), bindings: { on: e } } : { ...t, props: at("wall_switch", n) };
}
const Ac = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function Xh(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Ac(n.slot, 0, 9) ? n.slot : e.slot, o = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && o === n.event ? t : { slot: i, event: o };
}
function Yh(t) {
  const e = t.props.kind;
  if (!ro(e)) return t;
  const n = t.props;
  let i = null;
  for (const [o, s] of Object.entries(at(e, Ln(t.placement.mode)))) {
    const r = n[o], l = o === "on" || o === "off" || o === "auto" ? Xh(r, s) : o === "windowSec" ? Ac(r, 1, 10) ? r : s : typeof r == typeof s ? r : s;
    l !== r && ((i ?? (i = { ...n }))[o] = l);
  }
  return i ? { ...t, props: i } : t;
}
function Qh(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function Jh(t) {
  if (!ro(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function ep(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => qh(so(Qh(Jh(Yh(Kh(Gh(n))))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function R(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function D(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function P(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function G(t, e) {
  return t.x * e.x + t.y * e.y;
}
function pe(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Sc(t) {
  return Math.hypot(t.x, t.y);
}
function z(t, e) {
  return Sc(D(e, t));
}
function lo(t) {
  const e = Sc(t);
  return e === 0 ? { x: 0, y: 0 } : P(t, 1 / e);
}
function se(t) {
  return { x: t.y, y: -t.x };
}
function Lc(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function Ve(t, e, n, i) {
  const o = pe(e, i);
  if (Math.abs(o) < 1e-9) return null;
  const s = pe(D(n, t), i) / o;
  return R(t, P(e, s));
}
function ao(t, e, n) {
  const i = D(n, e), o = G(i, i);
  return o === 0 ? 0 : G(D(t, e), i) / o;
}
function xe(t, e, n) {
  const i = D(n, e), o = G(i, i), s = o === 0 ? 0 : Math.max(0, Math.min(1, G(D(t, e), i) / o));
  return z(t, R(e, P(i, s)));
}
function $t(t, e) {
  let n = !1;
  for (let i = 0, o = e.length - 1; i < e.length; o = i++) {
    const s = e[i], r = e[o];
    s.y > t.y != r.y > t.y && t.x < (r.x - s.x) * (t.y - s.y) / (r.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function ze(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], o = t[(n + 1) % t.length];
    e += i.x * o.y - o.x * i.y;
  }
  return e / 2;
}
let ct = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function tp(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function et(t, e, n) {
  const i = new ct(null, null);
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
function Po(t, e, n, i) {
  const o = new ct(t, e);
  if (n === null)
    return o.left = o.right = null, o;
  n = et(t, n, i);
  const s = i(t, n.key);
  return s < 0 ? (o.left = n.left, o.right = n, n.left = null) : s >= 0 && (o.right = n.right, o.left = n, n.right = null), o;
}
function dl(t, e, n) {
  let i = null, o = null;
  if (e) {
    e = et(t, e, n);
    const s = n(e.key, t);
    s === 0 ? (i = e.left, o = e.right) : s < 0 ? (o = e.right, e.right = null, i = e) : (i = e.left, e.left = null, o = e);
  }
  return { left: i, right: o };
}
function np(t, e, n) {
  return e === null ? t : (t === null || (e = et(t.key, e, n), e.left = t), e);
}
function hs(t, e, n, i, o) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${o(t)}
`);
    const s = e + (n ? "    " : "│   ");
    t.left && hs(t.left, s, !1, i, o), t.right && hs(t.right, s, !0, i, o);
  }
}
class Ys {
  constructor(e = tp) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = Po(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new ct(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const o = this._comparator, s = et(e, this._root, o), r = o(e, s.key);
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
    return n === null ? null : (n = et(e, n, i), i(e, n.key) === 0 ? (n.left === null ? o = n.right : (o = et(e, n.left, i), o.right = n.right), this._size--, o) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = et(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = et(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return op(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let o = e.length;
    const s = this._comparator;
    if (i && ms(e, n, 0, o - 1, s), this._root === null)
      this._root = ps(e, n, 0, o), this._size = o;
    else {
      const r = sp(
        this.toList(),
        ip(e, n),
        s
      );
      o = this._size + o, this._root = fs({ head: r }, 0, o);
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
    return hs(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const o = this._comparator;
    let { left: s, right: r } = dl(e, this._root, o);
    o(e, n) < 0 ? r = Po(n, i, r, o) : s = Po(n, i, s, o), this._root = np(s, r, o);
  }
  split(e) {
    return dl(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function ps(t, e, n, i) {
  const o = i - n;
  if (o > 0) {
    const s = n + Math.floor(o / 2), r = t[s], l = e[s], a = new ct(r, l);
    return a.left = ps(t, e, n, s), a.right = ps(t, e, s + 1, i), a;
  }
  return null;
}
function ip(t, e) {
  const n = new ct(null, null);
  let i = n;
  for (let o = 0; o < t.length; o++)
    i = i.next = new ct(t[o], e[o]);
  return i.next = null, n.next;
}
function op(t) {
  let e = t;
  const n = [];
  let i = !1;
  const o = new ct(null, null);
  let s = o;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = s = s.next = n.pop(), e = e.right) : i = !0;
  return s.next = null, o.next;
}
function fs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const o = e + Math.floor(i / 2), s = fs(t, e, o), r = t.head;
    return r.left = s, t.head = t.head.next, r.right = fs(t, o + 1, n), r;
  }
  return null;
}
function sp(t, e, n) {
  const i = new ct(null, null);
  let o = i, s = t, r = e;
  for (; s !== null && r !== null; )
    n(s.key, r.key) < 0 ? (o.next = s, s = s.next) : (o.next = r, r = r.next), o = o.next;
  return s !== null ? o.next = s : r !== null && (o.next = r), i.next;
}
function ms(t, e, n, i, o) {
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
  ms(t, e, n, l, o), ms(t, e, l + 1, i, o);
}
const je = 11102230246251565e-32, ce = 134217729, rp = (3 + 8 * je) * je;
function To(t, e, n, i, o) {
  let s, r, l, a, c = e[0], p = i[0], h = 0, d = 0;
  p > c == p > -c ? (s = c, c = e[++h]) : (s = p, p = i[++d]);
  let f = 0;
  if (h < t && d < n)
    for (p > c == p > -c ? (r = c + s, l = s - (r - c), c = e[++h]) : (r = p + s, l = s - (r - p), p = i[++d]), s = r, l !== 0 && (o[f++] = l); h < t && d < n; )
      p > c == p > -c ? (r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++h]) : (r = s + p, a = r - s, l = s - (r - a) + (p - a), p = i[++d]), s = r, l !== 0 && (o[f++] = l);
  for (; h < t; )
    r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++h], s = r, l !== 0 && (o[f++] = l);
  for (; d < n; )
    r = s + p, a = r - s, l = s - (r - a) + (p - a), p = i[++d], s = r, l !== 0 && (o[f++] = l);
  return (s !== 0 || f === 0) && (o[f++] = s), f;
}
function lp(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function C(t) {
  return new Float64Array(t);
}
const ap = (3 + 16 * je) * je, cp = (2 + 12 * je) * je, up = (9 + 64 * je) * je * je, It = C(4), hl = C(8), pl = C(12), fl = C(16), de = C(4);
function dp(t, e, n, i, o, s, r) {
  let l, a, c, p, h, d, f, m, v, w, b, y, x, M, k, L, E, A;
  const O = t - o, U = n - o, S = e - s, I = i - s;
  M = O * I, d = ce * O, f = d - (d - O), m = O - f, d = ce * I, v = d - (d - I), w = I - v, k = m * w - (M - f * v - m * v - f * w), L = S * U, d = ce * S, f = d - (d - S), m = S - f, d = ce * U, v = d - (d - U), w = U - v, E = m * w - (L - f * v - m * v - f * w), b = k - E, h = k - b, It[0] = k - (b + h) + (h - E), y = M + b, h = y - M, x = M - (y - h) + (b - h), b = x - L, h = x - b, It[1] = x - (b + h) + (h - L), A = y + b, h = A - y, It[2] = y - (A - h) + (b - h), It[3] = A;
  let T = lp(4, It), V = cp * r;
  if (T >= V || -T >= V || (h = t - O, l = t - (O + h) + (h - o), h = n - U, c = n - (U + h) + (h - o), h = e - S, a = e - (S + h) + (h - s), h = i - I, p = i - (I + h) + (h - s), l === 0 && a === 0 && c === 0 && p === 0) || (V = up * r + rp * Math.abs(T), T += O * p + I * l - (S * c + U * a), T >= V || -T >= V)) return T;
  M = l * I, d = ce * l, f = d - (d - l), m = l - f, d = ce * I, v = d - (d - I), w = I - v, k = m * w - (M - f * v - m * v - f * w), L = a * U, d = ce * a, f = d - (d - a), m = a - f, d = ce * U, v = d - (d - U), w = U - v, E = m * w - (L - f * v - m * v - f * w), b = k - E, h = k - b, de[0] = k - (b + h) + (h - E), y = M + b, h = y - M, x = M - (y - h) + (b - h), b = x - L, h = x - b, de[1] = x - (b + h) + (h - L), A = y + b, h = A - y, de[2] = y - (A - h) + (b - h), de[3] = A;
  const F = To(4, It, 4, de, hl);
  M = O * p, d = ce * O, f = d - (d - O), m = O - f, d = ce * p, v = d - (d - p), w = p - v, k = m * w - (M - f * v - m * v - f * w), L = S * c, d = ce * S, f = d - (d - S), m = S - f, d = ce * c, v = d - (d - c), w = c - v, E = m * w - (L - f * v - m * v - f * w), b = k - E, h = k - b, de[0] = k - (b + h) + (h - E), y = M + b, h = y - M, x = M - (y - h) + (b - h), b = x - L, h = x - b, de[1] = x - (b + h) + (h - L), A = y + b, h = A - y, de[2] = y - (A - h) + (b - h), de[3] = A;
  const q = To(F, hl, 4, de, pl);
  M = l * p, d = ce * l, f = d - (d - l), m = l - f, d = ce * p, v = d - (d - p), w = p - v, k = m * w - (M - f * v - m * v - f * w), L = a * c, d = ce * a, f = d - (d - a), m = a - f, d = ce * c, v = d - (d - c), w = c - v, E = m * w - (L - f * v - m * v - f * w), b = k - E, h = k - b, de[0] = k - (b + h) + (h - E), y = M + b, h = y - M, x = M - (y - h) + (b - h), b = x - L, h = x - b, de[1] = x - (b + h) + (h - L), A = y + b, h = A - y, de[2] = y - (A - h) + (b - h), de[3] = A;
  const N = To(q, pl, 4, de, fl);
  return fl[N - 1];
}
function hp(t, e, n, i, o, s) {
  const r = (e - s) * (n - o), l = (t - o) * (i - s), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= ap * c ? a : -dp(t, e, n, i, o, s, c);
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
const Jt = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, gs = (t, e) => {
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
let tt = Number.EPSILON;
tt === void 0 && (tt = Math.pow(2, -52));
const pp = tt * tt, ml = (t, e) => {
  if (-tt < t && t < tt && -tt < e && e < tt)
    return 0;
  const n = t - e;
  return n * n < pp * t * e ? 0 : t < e ? -1 : 1;
};
class fp {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new gl(), this.yRounder = new gl();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class gl {
  constructor() {
    this.tree = new Ys(), this.round(0);
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
    if (i !== null && ml(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const o = this.tree.next(n);
    return o !== null && ml(n.key, o.key) === 0 ? (this.tree.remove(e), o.key) : e;
  }
}
const In = new fp(), gi = (t, e) => t.x * e.y - t.y * e.x, Cc = (t, e) => t.x * e.x + t.y * e.y, bl = (t, e, n) => {
  const i = hp(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Si = (t) => Math.sqrt(Cc(t, t)), mp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return gi(o, i) / Si(o) / Si(i);
}, gp = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return Cc(o, i) / Si(o) / Si(i);
}, wl = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, vl = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, bp = (t, e, n, i) => {
  if (e.x === 0) return vl(n, i, t.x);
  if (i.x === 0) return vl(t, e, n.x);
  if (e.y === 0) return wl(n, i, t.y);
  if (i.y === 0) return wl(t, e, n.y);
  const o = gi(e, i);
  if (o == 0) return null;
  const s = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = gi(s, e) / o, l = gi(s, i) / o, a = t.x + l * e.x, c = n.x + r * i.x, p = t.y + l * e.y, h = n.y + r * i.y, d = (a + c) / 2, f = (p + h) / 2;
  return {
    x: d,
    y: f
  };
};
class Me {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = Me.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : st.compare(e.segment, n.segment));
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
        sine: mp(this.point, e.point, s.point),
        cosine: gp(this.point, e.point, s.point)
      });
    };
    return (o, s) => {
      n.has(o) || i(o), n.has(s) || i(s);
      const {
        sine: r,
        cosine: l
      } = n.get(o), {
        sine: a,
        cosine: c
      } = n.get(s);
      return r >= 0 && a >= 0 ? l < c ? 1 : l > c ? -1 : 0 : r < 0 && a < 0 ? l < c ? -1 : l > c ? 1 : 0 : a < r ? -1 : a > r ? 1 : 0;
    };
  }
}
let wp = 0;
class st {
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
    const l = e.leftSE.point.y, a = n.leftSE.point.y, c = e.rightSE.point.y, p = n.rightSE.point.y;
    if (i < o) {
      if (a < l && a < c) return 1;
      if (a > l && a > c) return -1;
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
      const h = c - l, d = s - i, f = p - a, m = r - o;
      if (h > d && f < m) return 1;
      if (h < d && f > m) return -1;
    }
    return s > r ? 1 : s < r || c < p ? -1 : c > p ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, o) {
    this.id = ++wp, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = o;
  }
  static fromRing(e, n, i) {
    let o, s, r;
    const l = Me.comparePoints(e, n);
    if (l < 0)
      o = e, s = n, r = 1;
    else if (l > 0)
      o = n, s = e, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);
    const a = new Me(o, !0), c = new Me(s, !1);
    return new st(a, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), o = gs(n, i);
    if (o === null) return null;
    const s = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = Jt(n, l) && this.comparePoint(l) === 0, p = Jt(i, s) && e.comparePoint(s) === 0, h = Jt(n, a) && this.comparePoint(a) === 0, d = Jt(i, r) && e.comparePoint(r) === 0;
    if (p && c)
      return d && !h ? r : !d && h ? a : null;
    if (p)
      return h && s.x === a.x && s.y === a.y ? null : s;
    if (c)
      return d && r.x === l.x && r.y === l.y ? null : l;
    if (d && h) return null;
    if (d) return r;
    if (h) return a;
    const f = bp(s, this.vector(), l, e.vector());
    return f === null || !Jt(o, f) ? null : In.round(f.x, f.y);
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
    const n = [], i = e.events !== void 0, o = new Me(e, !0), s = new Me(e, !1), r = this.rightSE;
    this.replaceRightSE(s), n.push(s), n.push(o);
    const l = new st(o, r, this.rings.slice(), this.windings.slice());
    return Me.comparePoints(l.leftSE.point, l.rightSE.point) > 0 && l.swapEvents(), Me.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (o.checkForConsuming(), s.checkForConsuming()), n;
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
    const o = st.compare(n, i);
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
        const l = i.rings[s], a = i.windings[s], c = n.rings.indexOf(l);
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
    const n = this._afterState.rings, i = this._afterState.windings, o = this._afterState.multiPolys;
    for (let l = 0, a = this.rings.length; l < a; l++) {
      const c = this.rings[l], p = this.windings[l], h = n.indexOf(c);
      h === -1 ? (n.push(c), i.push(p)) : i[h] += p;
    }
    const s = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const c = n[l], p = c.poly;
      if (r.indexOf(p) === -1)
        if (c.isExterior) s.push(p);
        else {
          r.indexOf(p) === -1 && r.push(p);
          const h = s.indexOf(c.poly);
          h !== -1 && s.splice(h, 1);
        }
    }
    for (let l = 0, a = s.length; l < a; l++) {
      const c = s[l].multiPoly;
      o.indexOf(c) === -1 && o.push(c);
    }
    return this._afterState;
  }
  /* Is this segment part of the final result? */
  isInResult() {
    if (this.consumedBy) return !1;
    if (this._isInResult !== void 0) return this._isInResult;
    const e = this.beforeState().multiPolys, n = this.afterState().multiPolys;
    switch (Ie.type) {
      case "union": {
        const i = e.length === 0, o = n.length === 0;
        this._isInResult = i !== o;
        break;
      }
      case "intersection": {
        let i, o;
        e.length < n.length ? (i = e.length, o = n.length) : (i = n.length, o = e.length), this._isInResult = o === Ie.numMultiPolys && i < o;
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
        throw new Error(`Unrecognized operation type found ${Ie.type}`);
    }
    return this._isInResult;
  }
}
class $l {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const o = In.round(e[0][0], e[0][1]);
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
      let a = In.round(e[r][0], e[r][1]);
      a.x === s.x && a.y === s.y || (this.segments.push(st.fromRing(s, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), s = a);
    }
    (o.x !== s.x || o.y !== s.y) && this.segments.push(st.fromRing(s, o, this));
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
class vp {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new $l(e[0], this, !0), this.bbox = {
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
      const s = new $l(e[i], this, !1);
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
class yl {
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
      const s = new vp(e[i], this);
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
class Li {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.isInResult() || s.ringOut) continue;
      let r = null, l = s.leftSE, a = s.rightSE;
      const c = [l], p = l.point, h = [];
      for (; r = l, l = a, c.push(l), l.point !== p; )
        for (; ; ) {
          const d = l.getAvailableLinkedEvents();
          if (d.length === 0) {
            const v = c[0].point, w = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${v.x}, ${v.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (d.length === 1) {
            a = d[0].otherSE;
            break;
          }
          let f = null;
          for (let v = 0, w = h.length; v < w; v++)
            if (h[v].point === l.point) {
              f = v;
              break;
            }
          if (f !== null) {
            const v = h.splice(f)[0], w = c.splice(v.index);
            w.unshift(w[0].otherSE), n.push(new Li(w.reverse()));
            continue;
          }
          h.push({
            index: c.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = d.sort(m)[0].otherSE;
          break;
        }
      n.push(new Li(c));
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
    for (let c = 1, p = this.events.length - 1; c < p; c++) {
      const h = this.events[c].point, d = this.events[c + 1].point;
      bl(h, e, d) !== 0 && (n.push(h), e = h);
    }
    if (n.length === 1) return null;
    const i = n[0], o = n[1];
    bl(i, e, o) === 0 && n.shift(), n.push(n[0]);
    const s = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, l = this.isExteriorRing() ? n.length : -1, a = [];
    for (let c = r; c != l; c += s) a.push([n[c].x, n[c].y]);
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
      Me.compare(e, r) > 0 && (e = r);
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
class xl {
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
class $p {
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
        if (s.isExteriorRing()) n.push(new xl(s));
        else {
          const r = s.enclosingRing();
          r.poly || n.push(new xl(r)), r.poly.addInterior(s);
        }
    }
    return n;
  }
}
class yp {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : st.compare;
    this.queue = e, this.tree = new Ys(n), this.segments = [];
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
      let c = null;
      if (l) {
        const h = l.getIntersection(n);
        if (h !== null && (n.isAnEndpoint(h) || (c = h), !l.isAnEndpoint(h))) {
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
      if (c !== null || p !== null) {
        let h = null;
        c === null ? h = p : p === null ? h = c : h = Me.comparePoints(c, p) <= 0 ? c : p, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const d = n.split(h);
        for (let f = 0, m = d.length; f < m; f++)
          i.push(d[f]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const c = l.getIntersection(a);
        if (c !== null) {
          if (!l.isAnEndpoint(c)) {
            const p = this._splitSafely(l, c);
            for (let h = 0, d = p.length; h < d; h++)
              i.push(p[h]);
          }
          if (!a.isAnEndpoint(c)) {
            const p = this._splitSafely(a, c);
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
const kl = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, xp = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class kp {
  run(e, n, i) {
    Ie.type = e, In.reset();
    const o = [new yl(n, !0)];
    for (let h = 0, d = i.length; h < d; h++)
      o.push(new yl(i[h], !1));
    if (Ie.numMultiPolys = o.length, Ie.type === "difference") {
      const h = o[0];
      let d = 1;
      for (; d < o.length; )
        gs(o[d].bbox, h.bbox) !== null ? d++ : o.splice(d, 1);
    }
    if (Ie.type === "intersection")
      for (let h = 0, d = o.length; h < d; h++) {
        const f = o[h];
        for (let m = h + 1, v = o.length; m < v; m++)
          if (gs(f.bbox, o[m].bbox) === null) return [];
      }
    const s = new Ys(Me.compare);
    for (let h = 0, d = o.length; h < d; h++) {
      const f = o[h].getSweepEvents();
      for (let m = 0, v = f.length; m < v; m++)
        if (s.insert(f[m]), s.size > kl)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new yp(s);
    let l = s.size, a = s.pop();
    for (; a; ) {
      const h = a.key;
      if (s.size === l) {
        const f = h.segment;
        throw new Error(`Unable to pop() ${h.isLeft ? "left" : "right"} SweepEvent [${h.point.x}, ${h.point.y}] from segment #${f.id} [${f.leftSE.point.x}, ${f.leftSE.point.y}] -> [${f.rightSE.point.x}, ${f.rightSE.point.y}] from queue.`);
      }
      if (s.size > kl)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > xp)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const d = r.process(h);
      for (let f = 0, m = d.length; f < m; f++) {
        const v = d[f];
        v.consumedBy === void 0 && s.insert(v);
      }
      l = s.size, a = s.pop();
    }
    In.reset();
    const c = Li.factory(r.segments);
    return new $p(c).getGeom();
  }
}
const Ie = new kp(), Mp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("union", t, n);
}, _p = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("intersection", t, n);
}, Ap = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("xor", t, n);
}, Sp = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("difference", t, n);
};
var Ic = {
  union: Mp,
  intersection: _p,
  xor: Ap,
  difference: Sp
};
const Ec = 3, Lp = 1e-6;
function co(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function ne(t, e) {
  const n = co(t, e);
  return { x: n.x, y: n.y };
}
function _t(t, e) {
  const n = t.walls.find((s) => s.id === e);
  if (!n) return null;
  const i = t.nodes.find((s) => s.id === n.a), o = t.nodes.find((s) => s.id === n.b);
  return !i || !o ? null : z(i, o);
}
function Oc(t, e, n, i) {
  const o = n, [s, r] = i === "left" ? [0, o] : i === "right" ? [o, 0] : [o / 2, o / 2];
  return { a: t, b: e, dir: lo(D(e, t)), len: z(t, e), leftOff: s, rightOff: r };
}
function le(t, e) {
  return Oc(ne(t, e.a), ne(t, e.b), e.thickness, e.baseline);
}
function Ge(t, e) {
  const n = D(e, t.a);
  return { t: G(n, t.dir), side: G(n, se(t.dir)) };
}
function Ml(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: P(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Nt = (t) => R(t.p, P(se(t.u), t.offL)), Pt = (t) => D(t.p, P(se(t.u), t.offR));
function mt(t, e, n) {
  return t !== null && z(t, e) <= n;
}
function Cp(t) {
  const e = [];
  for (const n of t.walls) {
    const i = le(t, n);
    if (i.len < 1e-9) continue;
    const o = se(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: R(i.a, P(o, i.leftOff)),
        ar: D(i.a, P(o, i.rightOff)),
        bl: R(i.b, P(o, i.leftOff)),
        br: D(i.b, P(o, i.rightOff))
      }
    });
  }
  return e;
}
function Ip(t, e) {
  const n = e.f, i = se(n.dir);
  for (const o of t) {
    if (o.body === e) continue;
    const r = G(D(o.far, n.a), i) >= 0 ? R(n.a, P(i, n.leftOff)) : D(n.a, P(i, n.rightOff)), l = Ec * Math.max(o.body.wall.thickness, e.wall.thickness), a = Ve(Nt(o), o.u, r, n.dir), c = Ve(Pt(o), o.u, r, n.dir);
    mt(a, o.p, l) && (o.body.c[o.leftKey] = a), mt(c, o.p, l) && (o.body.c[o.rightKey] = c);
  }
}
function Ep(t, e) {
  t.sort((o, s) => Math.atan2(o.u.y, o.u.x) - Math.atan2(s.u.y, s.u.x));
  const n = Ec * Math.max(...t.map((o) => o.body.wall.thickness));
  for (let o = 0; o < t.length; o++) {
    const s = t[o], r = t[(o + 1) % t.length], l = Ve(Pt(s), s.u, Nt(r), r.u);
    mt(l, e, n) && (s.body.c[s.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Op(t, e, n);
  for (const o of t) {
    if (i.has(o)) continue;
    const s = o.body.c[o.leftKey], r = o.body.c[o.rightKey], l = D(r, s), a = pe(l, D(e, s)), c = pe(l, D(o.far, s));
    a * c < 0 && bs(o, [e]);
  }
}
function bs(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Op(t, e, n) {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o], r = t[(o + 1) % i];
    if (Math.abs(pe(s.u, r.u)) > 1e-9 || G(s.u, r.u) > 0) continue;
    const l = s.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(o + 2) % i], c = Ve(Pt(s), s.u, Nt(a), a.u), p = Ve(Nt(r), r.u, Nt(a), a.u);
        if (!mt(c, e, n) || !mt(p, e, n)) continue;
        const h = r.body.c[r.rightKey];
        s.body.c[s.rightKey] = c, r.body.c[r.leftKey] = p, bs(s, [e, h, p]);
      } else {
        const a = t[(o - 1 + i) % i], c = Ve(Nt(r), r.u, Pt(a), a.u), p = Ve(Pt(s), s.u, Pt(a), a.u);
        if (!mt(p, e, n) || !mt(c, e, n)) continue;
        const h = s.body.c[s.leftKey];
        s.body.c[s.rightKey] = p, r.body.c[r.leftKey] = c, bs(r, [p, h, e]);
      }
      return /* @__PURE__ */ new Set([s, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Qs(t) {
  const e = Cp(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const o = [];
    for (const r of e)
      r.wall.a === i.id && o.push(Ml(r, "a")), r.wall.b === i.id && o.push(Ml(r, "b"));
    if (o.length === 0) continue;
    const s = i.host ? n.get(i.host.wallId) : void 0;
    s ? Ip(o, s) : o.length >= 2 && Ep(o, { x: i.x, y: i.y });
  }
  return e;
}
function Dc(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of Qs(t))
    for (const [o, s, r] of n) {
      const l = i.c[o];
      e.push({ pt: l, wallId: i.wall.id, side: s, end: r, offset: G(D(l, i.f.a), i.f.dir) });
    }
  return e;
}
function Nc(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function uo(t) {
  return new Map(Qs(t).map((e) => [e.wall.id, Nc(e)]));
}
function _l(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const o = t[i], s = t[(i + 1) % t.length], r = e(o), l = e(s);
    r >= 0 && n.push(o), r >= 0 != l >= 0 && n.push(R(o, P(D(s, o), r / (r - l))));
  }
  return n;
}
function Js(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Qs(t)) {
    const o = Nc(i), s = t.openings.filter((p) => p.wallId === i.wall.id && !p.invalid && e(p)).sort((p, h) => p.offset - h.offset), r = (p) => G(D(p, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const p of s)
      l.push([a, p.offset]), a = Math.max(a, p.offset + p.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [p, h] of l) {
      if (h <= p) continue;
      let d = o;
      p > -1 / 0 && (d = _l(d, (f) => r(f) - p)), h < 1 / 0 && (d = _l(d, (f) => h - r(f))), d.length >= 3 && Math.abs(ze(d)) > Lp && c.push(d);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const ws = (t) => [t.map((e) => [e.x, e.y])];
function Pc(t) {
  const e = t.map(([o, s]) => ({ x: o, y: s })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function Tc(t, e) {
  return Vc(e ? [...Js(t).values()].flat() : [...uo(t).values()]);
}
function Vc(t) {
  const e = t.map(ws);
  if (e.length === 0) return [];
  let n;
  try {
    n = Ic.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return n.map((i) => i.map(Pc));
}
const Ft = 1e-6, Ci = ["door", "gate", "wicket"], Hc = (t) => t === "opening", zc = (t) => t.passesLight ?? Hc(t.kind), Rc = (t) => t === "opening", Bc = (t) => t.passesPir ?? Rc(t.kind);
function Fc(t, e) {
  return t.offset < e.offset + e.width - Ft && e.offset < t.offset + t.width - Ft;
}
function ho(t, e, n, i, o) {
  const s = _t(t, e);
  return s === null || i <= 0 || n < -Ft || n + i > s + Ft ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== o && Fc(r, { offset: n, width: i }));
}
function Gt(t, e) {
  return { ...t, openings: e };
}
function Dp(t, e, n, i, o, s = {}) {
  const r = o ?? mi[n], l = i - r / 2;
  if (!ho(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: oe(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return Ci.includes(n) && (a.hinge = s.hinge ?? "start", a.swing = s.swing ?? "left"), n === "window" && (a.outside = s.outside ?? "left"), { level: Gt(t, [...t.openings, a]), openingId: a.id };
}
function Uc(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !ho(t, i.wallId, n, i.width, e) ? t : Fn(Gt(t, t.openings.map((o) => o.id === e ? { ...o, offset: n } : o)));
}
function Np(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !ho(t, i.wallId, i.offset, n, e) ? t : Fn(Gt(t, t.openings.map((o) => o.id === e ? { ...o, width: n } : o)));
}
function Pp(t, e) {
  return Ci.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function Tp(t, e, n) {
  if (!t.openings.some((o) => o.id === e)) return t;
  const i = (o) => {
    const s = { ...o, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete s[r];
    return s;
  };
  return Fn(Gt(t, t.openings.map((o) => o.id === e ? i(o) : o)));
}
function Wc(t, e) {
  return Fn(Gt(t, t.openings.filter((n) => n.id !== e)));
}
function Fn(t) {
  return Gt(t, t.openings.map((e) => {
    const n = _t(t, e.wallId), i = n === null || e.offset < -Ft || e.offset + e.width > n + Ft || t.openings.some((o) => o.id !== e.id && o.wallId === e.wallId && Fc(e, o));
    return { ...e, invalid: i };
  }));
}
const Ii = 1e-6;
function jc(t, e) {
  return e.mode !== "none" && Xs[t.kind].includes(e.mode);
}
function qc(t, e, n) {
  if (n.mode === "none" || !jc(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Bt || i > Bt)) return !1;
  const o = _t(t, n.wallId);
  return o !== null && n.offset >= -Ii && n.offset <= o + Ii;
}
function Ke(t, e) {
  return { ...t, devices: e };
}
function Al(t, e, n, i) {
  if (!qc(t, e, n)) return { level: t, deviceId: null };
  const o = oe(), s = { id: o, name: i, placement: n, props: e, invalid: !1 };
  return e.kind === "virtual_switch" && (s.bindings = { control: Cn(o) }), { level: Ke(t, [...t.devices, s]), deviceId: s.id };
}
function Zc(t, e, n = "equipment") {
  const i = oe(), o = { id: i, name: e, placement: { mode: "none" }, props: at(n, "free"), invalid: !1 };
  return n === "virtual_switch" && (o.bindings = { control: Cn(i) }), { level: Ke(t, [...t.devices, o]), id: o.id };
}
const Vp = ["power", "power_in", "power_out", "voltage"];
function Hp(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Vp.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Kt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, Gc = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function Kc(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function Xc(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [o, s] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[o] && (r[s] = r[o]), delete r[o];
  const l = so({ ...i, props: Kc(i.props, "inverter", n), bindings: r });
  return Ke(t, t.devices.map((a) => a === i ? l : a));
}
function po(t, e, n) {
  const i = t.devices.find((s) => s.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const o = { ...i, props: Kc(i.props, "controllable", n) };
  return Ke(t, t.devices.map((s) => s === i ? o : s));
}
function Yc(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = at("motion_sensor", Ln(e)), o = at("motion_sensor", Ln(n));
  return i.kind === "motion_sensor" && o.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: o.zoneAngle } : t;
}
function Ei(t, e, n) {
  const i = t.devices, o = i.find((r) => r.id === e);
  if (!o || !qc(t, o.props, n)) return t;
  const s = Yc(o.props, o.placement.mode, n.mode);
  return Qc(Ke(t, i.map((r) => r.id === e ? { ...r, placement: n, props: s } : r)));
}
function At(t, e, n, i) {
  const o = t.devices;
  return o.some((s) => s.id === e) ? Ke(t, o.map((s) => {
    if (s.id !== e) return s;
    const r = { ...s.props, ...n, kind: s.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return so({ ...s, props: r, name: i ?? s.name });
  })) : t;
}
function zp(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !kc(i.props.kind) || i.props.kind === n) return t;
  const o = at(n, Ln(i.placement.mode));
  if (!jc(o, i.placement)) return t;
  const s = so({ ...i, props: o });
  return Ke(t, t.devices.map((r) => r === i ? s : r));
}
function Rp(t, e) {
  return Ke(t, t.devices.filter((n) => n.id !== e));
}
function Qc(t) {
  return Ke(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = _t(t, e.placement.wallId), i = n === null || e.placement.offset < -Ii || e.placement.offset > n + Ii;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function Jc(t) {
  const e = [];
  for (const n of Tc(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function vs(t, e) {
  let n = null, i = 1 / 0;
  for (const o of t) {
    if (!$t(e, o)) continue;
    const s = Math.abs(ze(o));
    s < i && (n = o, i = s);
  }
  return n;
}
const Vo = 1e-3;
function eu(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(ze(t)) - Math.abs(ze(e))) > Vo ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= Vo && Math.abs(n.y - i.y) <= Vo));
}
const tu = 2, Sl = Math.ceil(360 / tu), Ll = 1e-4, Bp = 1e-9, Cl = 1e-9, Fp = {
  light: zc,
  motion: Bc
};
function nu(t, e) {
  const n = [];
  for (const i of Vc([...Js(t, Fp[e]).values()].flat()))
    for (const o of i)
      for (let s = 0; s < o.length; s++) n.push([o[s], o[(s + 1) % o.length]]);
  return n;
}
function er(t, e, n) {
  return e.filter(([i, o]) => xe(t, i, o) <= n);
}
function Ho(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Up(t, e, n) {
  const i = er(t, e, n), o = [];
  for (let w = 0; w < Sl; w++) o.push(-Math.PI + 2 * Math.PI * w / Sl);
  const s = n * 1.05;
  for (const w of i)
    for (const b of w) {
      if (z(t, b) > s) continue;
      const y = Math.atan2(b.y - t.y, b.x - t.x);
      o.push(Ho(y - Ll), Ho(y), Ho(y + Ll));
    }
  o.sort((w, b) => w - b);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), p = new Float64Array(r);
  i.forEach(([w, b], y) => {
    l[y] = w.x - t.x, a[y] = w.y - t.y, c[y] = b.x - w.x, p[y] = b.y - w.y;
  });
  const h = [], d = [];
  let f = NaN;
  for (const w of o) {
    if (w === f) continue;
    f = w;
    const b = Math.cos(w), y = Math.sin(w);
    let x = n, M = -1;
    for (let E = 0; E < r; E++) {
      const A = b * p[E] - y * c[E];
      if (Math.abs(A) < 1e-12) continue;
      const O = (l[E] * p[E] - a[E] * c[E]) / A;
      if (!(O > Bp && O < x)) continue;
      const U = (l[E] * y - a[E] * b) / A;
      U < -Cl || U > 1 + Cl || (x = O, M = E);
    }
    const k = { x: t.x + b * x, y: t.y + y * x }, L = h.length;
    if (!(L > 0 && h[L - 1].x === k.x && h[L - 1].y === k.y)) {
      if (M >= 0 && L >= 2 && d[L - 1] === M && d[L - 2] === M) {
        h[L - 1] = k;
        continue;
      }
      h.push(k), d.push(M);
    }
  }
  const m = h[0], v = h[h.length - 1];
  return h.length > 1 && m.x === v.x && m.y === v.y && h.pop(), h;
}
const Wp = 32, Il = 128;
function Oi(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function qe(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function tr(t) {
  return (t % 360 + 360) % 360;
}
function iu(t) {
  return (t % 360 + 540) % 360 - 180;
}
function ou(t, e, n, i) {
  const o = t.walls.find((c) => c.id === e);
  if (!o) return null;
  let s;
  try {
    s = le(t, o);
  } catch {
    return null;
  }
  const r = se(s.dir), l = n === "left" ? r : P(r, -1), a = n === "left" ? s.leftOff : s.rightOff;
  return { pt: R(R(s.a, P(s.dir, i)), P(l, a)), normal: l };
}
function En(t, e, n, i) {
  var o;
  return ((o = ou(t, e, n, i)) == null ? void 0 : o.pt) ?? null;
}
function ue(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Oi(n.rotation) };
  const i = ou(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const o = i.normal, s = e.props;
  if (s.kind === "equipment") {
    const r = s.shape === "circle" ? s.diameter / 2 : s.depth / 2;
    return { pt: R(i.pt, P(o, r)), dir: se(o), normal: o };
  }
  return { pt: i.pt, dir: n.aim ? Oi(qe(o) + n.aim) : o, normal: o };
}
function El(t, e, n, i, o, s) {
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
    const p = a.a === n ? c.dir : P(c.dir, -1);
    if (Math.abs(pe(i, p)) < 1e-9 && G(i, p) < 0) {
      if ((G(se(c.dir), o) > 0 ? c.leftOff : c.rightOff) > s + 1e-6) return !1;
      l = !0;
    } else if (G(p, o) > 1e-9) return !1;
  }
  return l;
}
function nr(t, e, n, i) {
  var U;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const o = t.walls.find((S) => S.id === n.wallId);
  if (!o) return n;
  let s;
  try {
    s = le(t, o);
  } catch {
    return n;
  }
  const r = Dc(t), l = r.filter((S) => S.wallId === n.wallId && S.side === n.side), a = l.find((S) => S.end === "a"), c = l.find((S) => S.end === "b");
  if (!a || !c) return n;
  const p = se(s.dir), h = n.side === "left" ? p : P(p, -1), d = n.side === "left" ? s.leftOff : s.rightOff, f = El(t, o, o.a, s.dir, h, d) ? -1 / 0 : a.offset, m = El(t, o, o.b, P(s.dir, -1), h, d) ? 1 / 0 : c.offset, v = (S) => G(D(S, s.a), s.dir), w = [];
  for (const S of t.nodes)
    if (((U = S.host) == null ? void 0 : U.wallId) === o.id)
      for (const I of t.walls) {
        const T = I.a === S.id ? "a" : I.b === S.id ? "b" : null, V = T && t.nodes.find((q) => q.id === (T === "a" ? I.b : I.a));
        if (!V || (G(D(V, s.a), p) >= 0 ? "left" : "right") !== n.side) continue;
        const F = r.filter((q) => q.wallId === I.id && q.end === T).map((q) => v(q.pt));
        F.length && w.push([Math.min(...F), Math.max(...F)]);
      }
  w.sort((S, I) => S[0] - I[0]);
  const b = [];
  let y = f;
  for (const [S, I] of w) {
    const T = Math.min(S, m);
    T > y && b.push([y, T]), y = Math.max(y, I);
  }
  m > y && b.push([y, m]), b.length === 0 && b.push([f, m]);
  const x = ([S, I]) => Math.max(0, S - n.offset, n.offset - I), [M, k] = b.reduce((S, I) => x(I) < x(S) ? I : S), L = (e.shape === "circle" ? e.diameter : e.width) / 2, E = M + L, A = k - L;
  let O = n.offset;
  return E > A ? O = (M + k) / 2 : O <= E + i ? O = E : O >= A - i && (O = A), O = Math.max(0, Math.min(s.len, O)), Math.abs(O - n.offset) < 1e-9 ? n : { ...n, offset: O };
}
function su(t, e) {
  const n = [];
  for (let i = 0; i < Il; i++) n.push(R(t, P(Oi(360 * i / Il), e)));
  return n;
}
function Ol(t, e, n, i) {
  if (n >= 360) return su(t, i);
  const o = Math.max(1, Math.ceil(n / 90 * Wp)), s = qe(e) - n / 2, r = [t];
  for (let l = 0; l <= o; l++) r.push(R(t, P(Oi(s + n * l / o), i)));
  return r;
}
const jp = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function fo(t) {
  return jp[t] ?? null;
}
const qp = (t) => fo(t.kind) !== null;
function Zp(t, e) {
  const n = e.props;
  if (!qp(n)) return null;
  const i = ue(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Ol(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Ol(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? su(i.pt, n.poolRadius) : null;
  }
}
function Gp(t) {
  return t.normal ? R(t.pt, t.normal) : t.pt;
}
function Dl(t, e) {
  let n = !1;
  for (const [i, o] of e)
    i.y > t.y != o.y > t.y && t.x < i.x + (t.y - i.y) * (o.x - i.x) / (o.y - i.y) && (n = !n);
  return n;
}
function Kp(t, e, n) {
  const i = D(e, t);
  for (const [o, s] of n) {
    const r = D(s, o), l = D(o, t), a = pe(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = pe(l, r) / a, p = pe(l, i) / a;
    if (c >= 0 && c <= 1 && p >= 0 && p <= 1) return !0;
  }
  return !1;
}
const Nl = 0.5, Xp = 3, Yp = 1e-4;
function Qp(t, e, n) {
  const i = ue(t, e);
  if (!i) return null;
  const o = Gp(i), s = e.placement;
  if (s.mode !== "wall") return o;
  const r = (k) => Dl(k, n) || er(k, n, Nl).length > 0;
  if (!r(o)) return o;
  const l = le(t, t.walls.find((k) => k.id === s.wallId)), a = i.normal, c = (k) => Math.abs(G(D(k, i.pt), a)) <= Yp, p = ([k, L]) => P(R(k, L), 0.5), h = n.filter((k) => c(k[0]) && c(k[1]) && z(k[0], k[1]) > 1e-9 && !Dl(R(p(k), P(a, Nl)), n)), d = (k) => G(D(k, l.a), l.dir), f = ([k, L]) => Math.max(0, Math.min(d(k), d(L)) - s.offset, s.offset - Math.max(d(k), d(L))), m = Math.min(...h.map(f)), v = h.filter((k) => f(k) <= m + 1e-6).map((k) => R(p(k), a)), w = (k) => v.some((L) => !Kp(k, L, n)), b = Xp * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, L] of n) {
    const E = D(L, k), A = D(k, o), O = pe(l.dir, E);
    if (Math.abs(O) < 1e-12) continue;
    const U = pe(A, l.dir) / O;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const S = pe(A, E) / O, I = z(k, L) / Math.abs(O);
    y.push(S - I, S + I);
  }
  const x = s.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= b).sort((k, L) => Math.abs(k) - Math.abs(L) || Math.sign(L) * x - Math.sign(k) * x);
  for (const k of M) {
    const L = R(o, P(l.dir, k));
    if (!r(L) && w(L)) return L;
  }
  return null;
}
const Jp = 1 / Math.cos(tu / 2 * (Math.PI / 180)), Pl = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function ef(t, e, n = nu) {
  const i = Zp(t, e), o = fo(e.props.kind);
  if (!i || !o) return [];
  const s = n(t, o), r = Qp(t, e, s);
  if (!r) return [];
  const l = Math.max(...i.map((h) => z(h, r))) * Jp, a = er(r, s, l);
  if (a.length === 0) return [i];
  const c = Up(r, a, l);
  let p;
  try {
    p = Ic.intersection(ws(Pl(i)), ws(Pl(c)));
  } catch {
    return [c];
  }
  return p.flatMap((h) => h.map(Pc));
}
function tf(t, e, n, i) {
  const o = ue(t, e);
  if (!o) return !1;
  const s = e.props;
  if (s.kind === "ceiling_light" && s.shape === "linear") {
    const l = Math.max(-s.length / 2, Math.min(s.length / 2, G(D(n, o.pt), o.dir)));
    return z(R(o.pt, P(o.dir, l)), n) <= i;
  }
  if (s.kind === "ceiling_light" && s.shape === "round") return z(o.pt, n) <= s.diameter / 2 + i;
  if (s.kind !== "equipment") return z(o.pt, n) <= i;
  if (s.shape === "circle") return z(o.pt, n) <= s.diameter / 2 + i;
  const r = D(n, o.pt);
  return Math.abs(G(r, o.dir)) <= s.width / 2 + i && Math.abs(G(r, se(o.dir))) <= s.depth / 2 + i;
}
function ru(t, e, n) {
  const i = t.devices;
  for (const o of [!1, !0])
    for (let s = i.length - 1; s >= 0; s--)
      if (i[s].props.kind === "equipment" === o && tf(t, i[s], e, n)) return i[s].id;
  return null;
}
const nf = 60;
function $s(t, e, n) {
  if (!_c.has(e.props.kind)) return null;
  const i = ue(t, e);
  return i ? { from: i.pt, to: R(i.pt, P(i.dir, nf / n)) } : null;
}
function lu(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function of(t, e, n, i) {
  const o = e.placement, s = ue(t, e);
  if (o.mode === "none" || !s || n.x === s.pt.x && n.y === s.pt.y) return o;
  const r = qe(D(n, s.pt)), l = (p) => i ? Math.round(p / 15) * 15 : Math.round(p);
  if (o.mode === "free") return { ...o, rotation: tr(l(r)) };
  const a = iu(r - qe(s.normal)), c = Math.max(-Bt, Math.min(Bt, l(a)));
  return lu(o, c);
}
const sf = 1, Di = 1, Tl = 1e-6, rf = 1e-9, lf = 1e-6, af = 1;
function ir(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = _t(t, e.wallId);
      return n === null ? null : En(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function re(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => ir(t, i) ?? { x: i.x, y: i.y });
}
function or(t, e) {
  const n = re(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(ze(n)) / 1e5) / 10;
}
function cn(t, e, n) {
  const i = pe(D(e, t), D(n, t));
  return Math.abs(i) <= rf * z(t, e) * z(t, n) ? 0 : Math.sign(i);
}
const Kn = (t, e, n) => G(D(e, t), D(n, t)) <= 0;
function sr(t, e, n, i) {
  const o = cn(n, i, t), s = cn(n, i, e), r = cn(t, e, n), l = cn(t, e, i);
  return o * s < 0 && r * l < 0 ? !0 : r === 0 && Kn(n, t, e) || l === 0 && Kn(i, t, e) || o === 0 && Kn(t, n, i) || s === 0 && Kn(e, n, i);
}
function cf(t) {
  const e = [];
  for (const n of t) (e.length === 0 || z(e[e.length - 1], n) > Tl) && e.push(n);
  for (; e.length > 1 && z(e[0], e[e.length - 1]) <= Tl; ) e.pop();
  return e;
}
function Ni(t) {
  const e = cf(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const o = e[i], s = e[(i + 1) % n], r = e[(i + 2) % n];
    if (cn(o, s, r) === 0 && G(D(s, o), D(r, s)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && sr(o, s, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function au(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((s) => s.kind === "free" ? s.lost === !0 : ir(t, s) === null)) return "lost";
  const i = (s) => {
    if (s.kind !== "wall") return !1;
    const r = _t(t, s.wallId);
    return r !== null && (s.offset < -Di || s.offset > r + Di);
  };
  if (n.vertices.some(i)) return "beyond";
  const o = re(t, e);
  return Math.abs(ze(o)) < af || Ni(o) ? "crossing" : null;
}
function St(t, e) {
  return $t(e, t) || t.some((n, i) => xe(e, n, t[(i + 1) % t.length]) <= sf);
}
const cu = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function uf(t, e) {
  const n = ue(t, e);
  return n ? t.zones.filter((i) => St(re(t, i), n.pt)).map((i) => ({ zone: i, participates: cu(e, i.id) })) : [];
}
function Re(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n) return [];
  const i = re(t, n), o = [];
  for (const s of t.devices) {
    const r = ue(t, s);
    r && St(i, r.pt) && o.push({ device: s, participates: cu(s, e) });
  }
  return o;
}
function ys(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = ze(t);
  if (Math.abs(n) > lf) {
    let i = 0, o = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, o += (l.y + a.y) * c;
    }
    const s = { x: i / (6 * n), y: o / (6 * n) };
    if ($t(s, t)) return s;
  }
  return {
    x: t.reduce((i, o) => i + o.x, 0) / e,
    y: t.reduce((i, o) => i + o.y, 0) / e
  };
}
const zo = 32;
function Vl(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let o = 0; o < i.length; o++) n = Math.min(n, xe(t, i[o], i[(o + 1) % i.length]));
  return n;
}
function uu(t) {
  const e = t.zones.map((o) => re(t, o)), n = e.map((o) => Math.abs(ze(o))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((o, s) => {
    const r = e[s];
    if (r.length < 3) return;
    const l = e.filter((v, w) => w !== s && v.length >= 3 && n[w] < n[s] && v.every((b) => St(r, b))), a = ys(r);
    if (l.length === 0) {
      i.set(o.id, a);
      return;
    }
    const c = r.map((v) => v.x), p = r.map((v) => v.y), h = Math.min(...c), d = Math.min(...p), f = Math.max(Math.max(...c) - h, Math.max(...p) - d) / zo;
    let m = null;
    for (let v = h + f / 2; v < h + f * zo; v += f)
      for (let w = d + f / 2; w < d + f * zo; w += f) {
        const b = { x: v, y: w };
        if (!$t(b, r) || l.some((x) => $t(b, x))) continue;
        const y = Math.min(Vl(b, [r]), Vl(b, l));
        (!m || y > m.d) && (m = { p: b, d: y });
      }
    i.set(o.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const rr = 3, Ut = (t, e) => ({ ...t, zones: e }), On = (t, e, n) => Ut(t, t.zones.map((i) => i === e ? n : i)), lr = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), du = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function df(t, e) {
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
function hf(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && du(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => df(n, e.vertices[i]));
}
function hu(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && hf(t.shape, e.shape);
}
function pf(t, e) {
  if (e.kind === "free") return e;
  const n = ir(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : lr(e);
}
function pu(t, e) {
  const n = e.shape, i = n.vertices.map((o) => pf(t, o));
  return i.some((o, s) => o !== n.vertices[s]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function ff(t, e, n) {
  const i = t.shape, o = vs(e, i.seed);
  return !o || n.some((s) => eu(s, o)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(o), !i.broken && du(o, i.outline) ? t : { ...t, shape: { ...i, outline: o, broken: !1 } });
}
function fu(t, e) {
  const n = au(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const ar = (t, e) => fu(t, pu(t, e));
function mf(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((s) => s.shape.kind === "walls") ? Jc(t) : [], i = [], o = e.map((s) => fu(
    t,
    s.shape.kind === "walls" ? ff(s, n, i) : pu(t, s)
  ));
  return o.some((s, r) => s !== e[r]) ? Ut(t, o) : t;
}
function gf(t, e) {
  const n = t.zones, i = e.zones, o = n.map((s) => {
    const r = i.find((l) => l.id === s.id);
    return r && r !== s && hu(r, s) ? r : s;
  });
  return o.length === i.length && o.every((s, r) => s === i[r]) ? n === i ? t : Ut(t, i) : o.some((s, r) => s !== n[r]) ? Ut(t, o) : t;
}
function bf(t, e, n) {
  const i = Jc(t), o = vs(i, e);
  if (!o) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = vs(i, r.shape.seed);
    if (l && eu(l, o)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const s = { id: oe(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: o, broken: !1 }, invalid: !1 };
  return { level: Ut(t, [...t.zones, s]), zoneId: s.id, existing: !1 };
}
const cr = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function wf(t, e, n) {
  if (e.length < rr) return { level: t, zoneId: null };
  const i = ar(t, { id: oe(), name: n, shape: { kind: "polygon", vertices: e.map(cr) }, invalid: !1 });
  return Ni(re(t, i)) ? { level: t, zoneId: null } : { level: Ut(t, [...t.zones, i]), zoneId: i.id };
}
function vf(t, e, n) {
  const i = t.zones.find((o) => o.id === e);
  return !i || i.name === n ? t : On(t, i, { ...i, name: n });
}
function ur(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return On(t, i, { ...i, automation: !1 });
  const { automation: o, ...s } = i;
  return On(t, i, s);
}
function mu(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function gu(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var o;
    return (o = i.zoneBlacklist) != null && o.includes(e) ? mu(i, i.zoneBlacklist.filter((s) => s !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, o) => i !== t.devices[o]) ? n : t.devices
  };
}
function dr(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function hr(t, e, n) {
  const i = ar(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return hu(i, e) ? t : On(t, e, i);
}
const pr = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function $f(t, e, n, i) {
  const o = dr(t, e);
  return !o || !pr(n, o.shape.vertices.length) ? t : hr(t, o, o.shape.vertices.map((s, r) => r === n ? cr(i) : s));
}
function yf(t, e, n, i) {
  const o = dr(t, e);
  if (!o || !pr(n, o.shape.vertices.length + 1)) return t;
  const s = [...o.shape.vertices];
  return s.splice(n, 0, cr(i)), hr(t, o, s);
}
function xf(t, e, n) {
  const i = dr(t, e);
  return !i || i.shape.vertices.length <= rr || !pr(n, i.shape.vertices.length) ? t : hr(t, i, i.shape.vertices.filter((o, s) => s !== n));
}
function kf(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < rr) return t;
  const i = n.shape.outline.map(lr);
  return On(t, n, ar(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function bu(t, e, n, i) {
  const o = t.devices.find((l) => l.id === e);
  if (!o) return t;
  const s = o.zoneBlacklist ?? [];
  if (s.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = mu(o, i ? s.filter((l) => l !== n) : [...s, n]);
  return { ...t, devices: t.devices.map((l) => l === o ? r : l) };
}
const Dn = 1;
function Be(t) {
  return structuredClone(t);
}
function mo(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Mf(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function go(t, e, n) {
  const i = ne(t, e.a), o = ne(t, e.b), s = z(i, o), r = Mf(typeof n == "number" ? n : ao(n, i, o) * s, 0, s);
  return { pt: s === 0 ? i : Lc(i, o, r / s), offset: r };
}
function _f(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const o = t.walls.find((l) => l.id === i.host.wallId);
      if (!o) continue;
      const { pt: s, offset: r } = go(t, o, i);
      (Math.abs(i.x - s.x) > 1e-9 || Math.abs(i.y - s.y) > 1e-9) && (n = !0), i.x = s.x, i.y = s.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function wu(t, e) {
  _f(t), e && Cf(e, t);
  const n = mf(Qc(Fn(t)));
  return e ? gf(n, e) : n;
}
function Xe(t, e) {
  return wu(Be(t), e);
}
function vu(t, e, n) {
  const i = co(t, e), o = i.host && t.walls.find((s) => s.id === i.host.wallId);
  if (i.host && o) {
    const { pt: s, offset: r } = go(t, o, n);
    i.host.offset = r, i.x = s.x, i.y = s.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Hl(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: ne(t, e.nodeId), nodeId: e.nodeId };
  const n = mo(t, e.wallId), { pt: i, offset: o } = go(t, n, e.offset), s = z(ne(t, n.a), ne(t, n.b));
  return o <= Dn ? { pt: ne(t, n.a), nodeId: n.a } : s - o <= Dn ? { pt: ne(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: o } };
}
function zl(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: oe(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Af(t, e, n, i) {
  const o = Hl(t, e), s = Hl(t, n);
  if (z(o.pt, s.pt) < Dn) return { level: t, wallId: null, endNodeId: null };
  const r = Be(t), l = zl(r, o), a = zl(r, s);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: oe(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Xe(r, t), wallId: c.id, endNodeId: a };
}
function $u(t, e, n, i) {
  const o = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, s = Math.min(t.x, e.x) - o, r = Math.max(t.x, e.x) + o, l = Math.min(t.y, e.y) - o, a = Math.max(t.y, e.y) + o;
  return r - s < Dn || a - l < Dn ? null : [{ x: s, y: l }, { x: r, y: l }, { x: r, y: a }, { x: s, y: a }];
}
function Sf(t, e, n, i, o) {
  const s = $u(e, n, i.thickness, o);
  if (!s) return t;
  const r = Be(t), l = s.map((a) => {
    const c = { id: oe(), x: a.x, y: a.y };
    return r.nodes.push(c), c.id;
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
  return Xe(r, t);
}
function Lf(t, e, n) {
  const i = Be(t);
  return vu(i, e, n), wu(i, t);
}
function Cf(t, e) {
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
    const c = z(l, a);
    if (c === 0) continue;
    const p = lo(D(r, s));
    for (const h of n)
      h.wallId === i.id && (h.offset = ao(R(s, P(p, h.offset)), l, a) * c);
  }
}
function If(t, e, n) {
  const i = Be(t), o = mo(i, e), r = (o.a === o.b ? [o.a] : [o.a, o.b]).map((l) => ({ id: l, to: R(ne(i, l), n) }));
  for (const l of r) vu(i, l.id, l.to);
  return Xe(i, t);
}
function bo(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function yu(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const o of i.shape.vertices) o.kind === "node" && o.nodeId === e && (o.nodeId = n);
}
function Ef(t, e, n) {
  const i = Be(t), o = mo(i, e), s = o[n], r = ne(i, s), l = { id: oe(), x: r.x, y: r.y };
  return i.nodes.push(l), o[n] = l.id, i.walls.some((a) => a.a === s || a.b === s) || yu(i, s, l.id), bo(i), { level: Xe(i, t), nodeId: l.id };
}
function Of(t, e, n) {
  if (e === n) return t;
  const i = Be(t);
  for (const s of i.walls)
    s.a === e && (s.a = n), s.b === e && (s.b = n);
  const o = new Set(i.walls.filter((s) => s.a === s.b).map((s) => s.id));
  i.walls = i.walls.filter((s) => !o.has(s.id)), i.openings = i.openings.filter((s) => !o.has(s.wallId)), i.devices = i.devices.filter((s) => s.placement.mode !== "wall" || !o.has(s.placement.wallId));
  for (const s of i.nodes) s.host && o.has(s.host.wallId) && delete s.host;
  return yu(i, e, n), i.nodes = i.nodes.filter((s) => s.id !== e), bo(i), Xe(i, t);
}
function fr(t, e) {
  var i;
  const n = Be(t);
  n.walls = n.walls.filter((o) => o.id !== e), n.openings = n.openings.filter((o) => o.wallId !== e), n.devices = n.devices.filter((o) => o.placement.mode !== "wall" || o.placement.wallId !== e);
  for (const o of n.nodes) ((i = o.host) == null ? void 0 : i.wallId) === e && delete o.host;
  return bo(n), Xe(n, t);
}
function Df(t, e, n) {
  const i = Be(t);
  return Object.assign(mo(i, e), n), Xe(i, t);
}
const ke = (t) => typeof t == "string" && t !== "" ? t : null, xu = (t) => t.split(".")[0], Nf = ["friendly_name", "device_class", "unit_of_measurement"];
function ku(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: xu(t),
    name: ke(n.friendly_name) ?? t,
    deviceClass: ke(n.device_class),
    unit: ke(n.unit_of_measurement),
    deviceId: null,
    areaId: null,
    hidden: !1,
    disabled: !1,
    category: null
  };
}
function Pf(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, ku(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Tf(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const o = t[i], s = e[i];
    if (o === s) continue;
    if (!o || !s) return !1;
    const r = o.attributes ?? {}, l = s.attributes ?? {};
    if (r !== l && Nf.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function mr(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Vf(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, o] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), s = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = ku(r.entity_id, {});
    s.set(r.entity_id, {
      ...l,
      name: ke(r.name) ?? ke(r.original_name) ?? l.name,
      deviceId: ke(r.device_id),
      areaId: ke(r.area_id),
      hidden: !!r.hidden_by,
      disabled: !!r.disabled_by,
      category: ke(r.entity_category)
    });
  }
  return {
    entities: s,
    devices: new Map(i.map((r) => [r.id, { id: r.id, name: ke(r.name_by_user) ?? ke(r.name) ?? r.id, model: ke(r.model), areaId: ke(r.area_id) }])),
    areas: new Map(o.map((r) => [r.area_id, r.name]))
  };
}
function Hf(t, e) {
  const n = new Map(e.entities);
  for (const [i, o] of t.entities) {
    const s = e.entities.get(i);
    n.set(i, s ? { ...s, name: o.name !== i ? o.name : s.name, deviceClass: o.deviceClass ?? s.deviceClass, unit: o.unit ?? s.unit } : o);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Mu(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const o = i.disabled ? null : mr(n, e);
  return o === null || o === "unavailable" ? "unavailable" : "present";
}
const zf = {
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
  "motionLight.presence": "Keep on while someone is present",
  "motionLight.neighbours": "Neighbours: {list}",
  "motionLight.noNeighbours": "No neighbouring zone with a motion sensor on the plan: this has no effect.",
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
  "motionLight.flow.held": "held: nobody left (ends in {until})",
  "motionLight.flow.left": "left: {name}",
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
function u(t) {
  return zf[t] ?? t;
}
const Rf = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Bf = 10;
function Xt(t, e) {
  const n = (i, o) => ({ name: i, dir: o });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Kt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function _u() {
  return { blocks: [{ id: oe(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Ff(t, e, n, i) {
  const o = { id: oe(), x: e.x, y: e.y }, s = { ...o, name: `${u(`power.kind.${t}`)} ${1 + n.blocks.filter((r) => r.kind === t).length}` };
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
function Rl(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function wo(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Uf(t, e, n, i) {
  return wo(t, e, (o) => ({ ...o, x: n, y: i }));
}
const xs = (t) => "block" in t ? t.block : t.bus, Au = (t, e) => xs(t.from) === e || xs(t.to) === e;
function Nn(t, e, n, i) {
  const o = t.blocks.find((c) => c.id === e);
  if (!o) return t;
  const s = wo(t, e, (c) => ({ ...c, ...n }));
  if (o.kind === "transfer" && "form" in n && n.form !== o.form)
    return { ...s, wires: s.wires.filter((c) => !Au(c, e)) };
  const r = s.blocks.find((c) => c.id === e), l = new Set(Xt(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return s.wires.some((c) => a(c.from) || a(c.to)) ? { ...s, wires: s.wires.filter((c) => !a(c.from) && !a(c.to)) } : s;
}
function Su(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Au(i, e)) };
}
const Lu = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function vo(t, e, n) {
  const i = Lu(t, e);
  if (i.size === 0) return t;
  const o = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(Xt(c, n).map((p) => p.name))])), s = (c) => "block" in c && !!o.get(c.block) && !o.get(c.block).has(c.port), r = t.wires.filter((c) => !s(c.from) && !s(c.to));
  let l = !1;
  const a = t.blocks.map((c) => {
    const p = o.get(c.id);
    if (!p || !c.portPins || Object.keys(c.portPins).every((m) => p.has(m))) return c;
    l = !0;
    const h = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => p.has(m))), { portPins: d, ...f } = c;
    return Object.keys(h).length ? { ...f, portPins: h } : f;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Wf(t, e) {
  const n = gr(e), i = new Set(t.blocks.flatMap((s) => s.kind === "device" ? [s.deviceId] : []));
  let o = t;
  for (const s of i) o = vo(o, s, n);
  return o;
}
function jf(t, e) {
  const n = Lu(t, e);
  if (n.size === 0) return t;
  const i = (o) => n.has(xs(o));
  return {
    ...t,
    blocks: t.blocks.filter((o) => !n.has(o.id)),
    wires: t.wires.filter((o) => !i(o.from) && !i(o.to))
  };
}
const gr = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Cu(t, e, n) {
  var s;
  const i = ((s = t.devices.find((r) => r.id === n)) == null ? void 0 : s.placement.mode) === "none", o = Rp(t, n);
  return { level: o, power: i ? jf(e, n) : vo(e, n, gr(o)) };
}
function Iu(t, e, n, i) {
  const o = Xc(t, n, i);
  return { level: o, power: o === t ? e : vo(e, n, gr(o)) };
}
function Eu(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function qf(t, e, n, i) {
  return wo(t, e, (o) => {
    const s = { ...o.portPins };
    i ? s[n] = i : delete s[n];
    const { portPins: r, ...l } = o;
    return Object.keys(s).length ? { ...l, portPins: s } : l;
  });
}
function Zf(t, e) {
  return wo(t, e, (n) => {
    const { portPins: i, ...o } = n;
    return o;
  });
}
function Bl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function Gf(t, e) {
  const n = t.filter((s) => s.kind === "transfer"), i = n.slice(0, Bf), o = /* @__PURE__ */ new Map();
  for (const s of n) s.kind === "transfer" && o.set(s.id, s.form === "2in1out" ? "OUT" : "IN");
  for (let s = 0; s < 1 << i.length; s++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((p, h) => r.set(p.id, s & 1 << h ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (p) => {
      let h = p;
      for (; l.has(h) && l.get(h) !== h; ) h = l.get(h);
      return h;
    }, c = (p, h) => {
      if ("bus" in p) return `n:${p.bus}`;
      const d = o.get(p.block);
      return d !== void 0 && p.port !== d && p.port !== (r.get(p.block) ?? "A") ? `x:${h.id}:${p.port}` : `n:${p.block}`;
    };
    for (const p of e) {
      const h = a(c(p.from, p)), d = a(c(p.to, p));
      if (h === d) return !0;
      l.set(h, d);
    }
  }
  return !1;
}
function Fl(t, e, n, i) {
  const o = new Map(t.blocks.map((b) => [b.id, b])), s = (b) => {
    if ("bus" in b) {
      const M = o.get(b.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = o.get(b.block), x = y ? Xt(y, i).find((M) => M.name === b.port) : void 0;
    return y && x ? { bl: y, dir: x.dir } : null;
  }, r = s(e), l = s(n);
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
  const p = (b) => "block" in b && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === b.block && x.port === b.port));
  if (p(a) || p(c)) return { error: "port-taken" };
  const h = (b) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === b && "block" in M) {
          const k = o.get(M.block);
          if (k) return Bl(k, M.port);
        }
    return null;
  }, d = (b) => "bus" in b ? h(b.bus) : Bl(o.get(b.block), b.port), f = d(a), m = d(c);
  if (f !== null && m !== null && f !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && o.get(c.block).kind === "remainder" && t.wires.some((b) => {
    var y;
    return "bus" in b.from && b.from.bus === a.bus && "block" in b.to && ((y = o.get(b.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const v = { id: oe(), from: a, to: c }, w = [...t.wires, v];
  return Gf(t.blocks, w) ? { error: "loop" } : { schema: { ...t, wires: w }, wire: v };
}
const Ue = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Ht = (t) => typeof t == "number" && Number.isFinite(t), Kf = ["top", "right", "bottom", "left"], Xf = ["2in1out", "1in2out"];
function Yf(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Ht(n.w) && Ht(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !Xf.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, o = new Set(Xt(n, e).map((c) => c.name)), s = {};
  let r = Ue(i);
  for (const [c, p] of Ue(i) ? Object.entries(i) : []) {
    if (!o.has(c) || !Ue(p) || !Kf.includes(p.side) || !Ht(p.at)) {
      r = !1;
      continue;
    }
    const h = Math.min(1, Math.max(0, p.at));
    h !== p.at && (r = !1), s[c] = h === p.at ? p : { side: p.side, at: h };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(s).length ? { ...a, portPins: s } : a;
}
function Qf(t, e) {
  if (!Ue(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let o = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const s = [], r = /* @__PURE__ */ new Set();
  for (const p of n)
    if (Ue(p) && typeof p.id == "string" && p.id && Rf.includes(p.kind) && Ht(p.x) && Ht(p.y)) {
      const h = Yf(p, e);
      h !== p && (o = !0), h.kind === "transfer" && h.form !== p.form && r.add(h.id), s.push(h);
    } else o = !0;
  const l = new Map(s.map((p) => [p.id, p])), a = (p) => {
    var d;
    if (!Ue(p)) return null;
    if (typeof p.bus == "string") {
      if (((d = l.get(p.bus)) == null ? void 0 : d.kind) !== "bus" || !Ht(p.at)) return null;
      const f = Math.min(1, Math.max(0, p.at));
      return f === p.at ? p : { bus: p.bus, at: f };
    }
    const h = typeof p.block == "string" ? l.get(p.block) : void 0;
    return h && !r.has(h.id) && Xt(h, e).some((f) => f.name === p.port) ? p : null;
  }, c = [];
  for (const p of i) {
    const h = Ue(p) ? a(p.from) : null, d = Ue(p) ? a(p.to) : null;
    if (!Ue(p) || typeof p.id != "string" || !p.id || !h || !d) {
      o = !0;
      continue;
    }
    h === p.from && d === p.to ? c.push(p) : (o = !0, c.push({ ...p, from: h, to: d }));
  }
  return o ? { ...t, blocks: s, wires: c } : t;
}
function Ou(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var o, s;
    return !n.has(i.id) && i.props.kind !== "virtual_switch" && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((o = i.bindings) != null && o.power) || !!((s = i.bindings) != null && s.control));
  }).sort((i, o) => i.name.localeCompare(o.name) || i.id.localeCompare(o.id));
}
function Jf(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const Un = 11, Pi = 18, Ti = 30, em = 12, tm = 120, we = 14, Ul = 10, Pn = (t) => Math.round(t / Ul) * Ul || 0, Ro = 24, Wl = 6, nm = 2 * Un + 6, im = we, om = 1e6, jl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, $o = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Bo = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Du = (t) => Math.min(1, Math.max(0, t));
function yo(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function sm(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const o = i.bindings ?? {}, s = Kt(i);
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
function Oe(t, e, n) {
  return n ? vr(n, t, e).r : br(t, e);
}
function br(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(tm, 7 * yo(t, e).length + 32),
    h: Ti + Pi * sm(t, e) + em
  };
}
function Vi(t, e, n) {
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
function rm(t, e) {
  const n = $o(t), i = e.x - n.x, o = e.y - n.y;
  return i === 0 && o === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(o) / (t.h / 2) ? i > 0 ? "right" : "left" : o > 0 ? "bottom" : "top";
}
function lm(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], o = 1 / 0;
  for (const l of n) {
    const a = xe(e, l.a, l.b);
    a < o && (i = l, o = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Du(r) };
}
const Tn = (t) => t.w >= t.h;
function Nu(t, e) {
  return Tn(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function am(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Tn(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Vi(i, r, 0.5), side: r };
  }
  const o = $o(i), s = Tn(t) ? n.y < o.y ? "top" : "bottom" : n.x < o.x ? "left" : "right";
  return { pt: Vi(i, s, e), side: s };
}
function cm(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const wr = (t, e) => t.blocks.find((n) => n.id === e), ks = (t, e) => {
  const n = wr(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Fo = (t, e, n) => "block" in t && t.block === e && t.port === n;
function um(t, e, n, i) {
  const o = t.wires.find((l) => Fo(l.from, e, n) || Fo(l.to, e, n));
  if (!o) return null;
  const s = Fo(o.from, e, n) ? o.to : o.from;
  if ("bus" in s) {
    const l = ks(t, s.bus);
    return l ? Nu(l, s.at) : null;
  }
  const r = wr(t, s.block);
  return r ? $o(br(r, i)) : null;
}
function vr(t, e, n) {
  const i = br(e, n), o = $o(i), s = Xt(e, n).map((c) => {
    var m;
    const p = (m = e.portPins) == null ? void 0 : m[c.name];
    if (p) return { ...c, side: p.side, pin: p, key: 0 };
    const h = um(t, e.id, c.name, n), d = (h && rm(i, h)) ?? cm(e, c), f = h ?? o;
    return { ...c, side: d, pin: void 0, key: d === "top" || d === "bottom" ? f.x : f.y };
  }), r = (c) => {
    const p = s.filter((h) => h.side === c).length;
    return p ? (p + 1) * nm : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(s.length);
  s.forEach((c, p) => {
    c.pin && (a[p] = { name: c.name, dir: c.dir, side: c.side, pt: Vi(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const p = s.map((h, d) => ({ p: h, i: d })).filter(({ p: h }) => !h.pin && h.side === c).sort((h, d) => h.p.key - d.p.key || h.i - d.i);
    p.forEach(({ p: h, i: d }, f) => {
      a[d] = { name: h.name, dir: h.dir, side: c, pt: Vi(l, c, (f + 1) / (p.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function xo(t, e, n) {
  return vr(t, e, n).places;
}
function Pu(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const p = wr(t, c.block);
    if (!p) return null;
    const { r: h, places: d } = vr(t, p, n), f = d.find((m) => m.name === c.port);
    return f ? { pt: f.pt, side: f.side, rect: h } : null;
  }, o = (c, p, h) => {
    if (!("bus" in c)) return null;
    const d = ks(t, c.bus);
    if (!d) return null;
    let f = h == null ? void 0 : h.pt;
    if (!f && "bus" in p) {
      const m = ks(t, p.bus);
      f = m && Nu(m, p.at);
    }
    return f ? { ...am(d, c.at, f), rect: Oe(d, n, t) } : null;
  }, s = i(e.from), r = i(e.to), l = s ?? o(e.from, e.to, r), a = r ?? o(e.to, e.from, s);
  return l && a ? { a: l, b: a } : null;
}
const Xn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Ms = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function dm(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = Xn(i[i.length - 2], a), p = Xn(a, l);
        if (c.x === p.x && c.y === p.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (c.x === -p.x && c.y === -p.y) return null;
      }
      i.push(l);
    }
  }
  const o = i.length;
  if (o < 2 || o > 6) return null;
  const s = Xn(i[0], i[1]), r = Xn(i[o - 2], i[o - 1]);
  return s.x !== e.x || s.y !== e.y || Ms(i[0], i[1]) < we - 1e-9 || r.x !== -n.x || r.y !== -n.y || Ms(i[o - 2], i[o - 1]) < we - 1e-9 ? null : i;
}
function hm(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function pm(t, e) {
  let n = (t.length - 2) * im;
  for (let i = 1; i < t.length; i++) {
    n += Ms(t[i - 1], t[i]);
    for (const o of e) hm(t[i - 1], t[i], o) && (n += om);
  }
  return n;
}
function Tu(t, e) {
  const n = t.pt, i = e.pt, o = jl[t.side], s = jl[e.side], r = { x: n.x + o.x * we, y: n.y + o.y * we }, l = { x: i.x + s.x * we, y: i.y + s.y * we }, a = [t.rect, e.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - we, k[x] + k[M] + we]),
    Math.min(r[x], l[x]) - we,
    Math.max(r[x], l[x]) + we
  ])], p = c("x", "w"), h = c("y", "h"), d = o.x === 0, f = s.x === 0, m = (d ? h : p).filter((x) => (x - (d ? n.y : n.x)) * (d ? o.y : o.x) >= we - 1e-9), v = (f ? h : p).filter((x) => (x - (f ? i.y : i.x)) * (f ? s.y : s.x) >= we - 1e-9);
  let w = null, b = 1 / 0;
  const y = (x) => {
    const M = dm(x, o, s);
    if (!M) return;
    const k = pm(M, a);
    k < b - 1e-6 && (w = M, b = k);
  };
  if (d && f)
    for (const x of m) for (const M of p) for (const k of v)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!d && !f)
    for (const x of m) for (const M of h) for (const k of v)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (d)
    for (const x of m) for (const M of v)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of v)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, d ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Vu(t, e, n) {
  const i = Oe(t, e, n), o = i.x + (i.w - (3 * Ro + 2 * Wl)) / 2, s = i.y + Ti + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: o + l * (Ro + Wl), y: s, w: Ro, h: Pi - 2 }
  }));
}
function fm(t) {
  const { x: e, y: n, w: i, h: o } = t;
  return Tn(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + o } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + o } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + o }, b: { x: e + i, y: n + o } }];
}
function _s(t, e, n, i) {
  const o = [...t.blocks].reverse();
  for (const p of o) {
    if (p.kind !== "transfer") continue;
    const h = Vu(p, i, t).find((d) => Bo(e, d.rect, 0));
    if (h) return { kind: "chip", block: p.id, position: h.position };
  }
  let s = null, r = 1 / 0;
  for (const p of o)
    for (const h of xo(t, p, i)) {
      const d = z(e, h.pt);
      d <= Un + n && d < r && (s = { kind: "port", block: p.id, port: h.name }, r = d);
    }
  if (s) return s;
  for (const p of o) {
    if (p.kind !== "bus") continue;
    let h = null, d = 1 / 0;
    for (const f of fm(p)) {
      const m = xe(e, f.a, f.b);
      m <= n && m < d && (h = { kind: "bus-end", id: p.id, end: f.end }, d = m);
    }
    if (h) return h;
  }
  for (const p of o) {
    if (p.kind !== "bus" || !Bo(e, Oe(p, i, t), n)) continue;
    const h = Tn(p) ? (e.x - p.x) / p.w : (e.y - p.y) / p.h;
    return { kind: "bus", id: p.id, at: Du(h) };
  }
  let l = null, a = 1 / 0;
  for (const p of t.wires) {
    const h = Pu(t, p, i);
    if (!h) continue;
    const d = Tu(h.a, h.b);
    for (let f = 1; f < d.length; f++) {
      const m = xe(e, d[f - 1], d[f]);
      m <= n && m < a && (l = { kind: "wire", id: p.id }, a = m);
    }
  }
  if (l) return l;
  const c = o.find((p) => p.kind !== "bus" && Bo(e, Oe(p, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function mm(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const r of t.blocks) {
    const l = Oe(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), o = Math.max(o, l.x + l.w), s = Math.max(s, l.y + l.h);
  }
  return { x: n, y: i, w: o - n, h: s - i };
}
var Hu = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", gm = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", bm = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", wm = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", vm = "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z", $m = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", ym = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", xm = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", ql = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", en = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", km = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Mm = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", _m = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Am = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", zu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Sm = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Lm = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Cm = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", Ru = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Im = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", Em = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Bu = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Om = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Dm = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Fu = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Nm = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Pm = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", Uu = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Tm = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", Vm = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", Hm = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", zm = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Rm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Bm = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", Fm = "M18.4 1.6C18 1.2 17.5 1 17 1H7C6.5 1 6 1.2 5.6 1.6C5.2 2 5 2.5 5 3V21C5 21.5 5.2 22 5.6 22.4C6 22.8 6.5 23 7 23H17C17.5 23 18 22.8 18.4 22.4C18.8 22 19 21.5 19 21V3C19 2.5 18.8 2 18.4 1.6M16 7C16 7.6 15.6 8 15 8H9C8.4 8 8 7.6 8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7Z", Um = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Wm = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", jm = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", qm = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", Zm = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", Wu = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", Gm = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", Km = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", Xm = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const De = "non-scaling-stroke", Vn = "system-ui, sans-serif", Ym = 13, pn = 9, Qm = 11, Zl = 18, Uo = 12, Wo = 11, Yn = 13, Jm = 3, bi = 10, Gl = 4.5, eg = 12, tg = 11.5, $r = 10, jo = 10.5, ng = 6, ig = {
  IN: Om,
  OUT: Fu,
  BAT: Dm,
  PV: Uu
}, Kl = { dead: 0, nodata: 1, idle: 2, live: 3 };
function _e(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const zt = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function og(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function Wn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const sg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, rg = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, ju = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${De}>${i ? $ : rg}</path>`, qu = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, Wt = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function lg(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (p) => "block" in p ? Un : pn, o = t.pts[0], s = t.pts[t.pts.length - 1], r = bi / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((p, h) => ({ p: t.pts[h], q: p, len: Math.abs(p.x - t.pts[h].x) + Math.abs(p.y - t.pts[h].y) })).sort((p, h) => h.len - p.len);
  for (const { p, q: h, len: d } of a) {
    if (d < 2 * r + 2 * l) continue;
    const f = { x: (p.x + h.x) / 2, y: (p.y + h.y) / 2 }, m = (w, b) => Math.hypot(f.x - w.x, f.y - w.y) >= b + r + l;
    if (!m(o, i(t.w.from)) || !m(s, i(t.w.to))) continue;
    const v = Math.atan2(h.y - p.y, h.x - p.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: f, deg: ((v + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function ag(t, e, n) {
  var c;
  const i = e.palette, o = Wn(t.style, i), s = qu(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = lg(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${s} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${De}></path>` : $}
    ${t.style === "live" ? ju("glow", s, o, n) : $}
    <path class=${`wire ${t.style}`} d=${s} fill="none" stroke=${o} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : $} stroke-linejoin="round" vector-effect=${De}></path>
    ${a ? _`<path class="arrow" d=${`M${bi / 2} 0L${-bi / 2} ${-Gl}L${-bi / 2} ${Gl}Z`}
      fill=${o} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : $}
  </g>`;
}
function cg(t, e, n) {
  const i = ig[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${Un} fill=${n.portFill}
      stroke=${e ? Wn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${De}></circle>
    ${i ? Wt(i, t.pt, Ym, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Vn}>${t.name}</text>`}
  </g>`;
}
function ug(t, e) {
  const n = Math.max(4, Math.floor(e / ($r * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function dg(t, e, n, i) {
  const o = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? yo(a, n) || u(`power.kind.${a.kind}`) : l;
  }), s = u("power.absorbed.one");
  return { kind: "text", value: o.length === 1 ? s.replace("{name}", ug(o[0], i - 12 - s.replace("{name}", "").length * $r * 0.55)) : u("power.absorbed.many").replace("{n}", String(o.length)), small: !0, title: o.join(", ") };
}
function hg(t, e, n, i, o, s) {
  var a;
  const r = () => ({ kind: "text", value: _e(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: zt(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: u("power.missing"), fill: o.blockInvalid }];
      const p = c.bindings ?? {}, h = Kt(c), d = [];
      return h ? (p.power_in && d.push({ kind: "text", label: u("power.in"), value: _e(i == null ? void 0 : i.power_in) }), p.power_out && d.push({ kind: "text", label: u("power.out"), value: _e(i == null ? void 0 : i.power_out) })) : p.power && d.push(r()), p.voltage && d.push({ kind: "text", value: zt(i == null ? void 0 : i.voltage, "V") }), p.control && d.push(l(Gc(c))), h && d.push({ kind: "text", label: u("power.loss"), value: _e(i == null ? void 0 : i.loss) }), d;
    }
    case "battery":
      return [{ kind: "text", label: u("power.soc"), value: zt(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: u("power.hint.disagree"), fill: o.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), dg(t, i.absorbed, n, s)] : [r()];
    case "bus":
      return [];
  }
}
function pg(t, e, n) {
  const i = t.state ?? "unknown", o = t.controllable ? 0 : Uo + 3, s = e.x - o / 2, r = `${u(`power.switch.${i}`)}${t.controllable ? "" : ` · ${u("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : $}>
    <title>${r}</title>
    ${Wt(
    i === "on" ? Am : _m,
    { x: s, y: e.y },
    Zl,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? $ : Wt(Im, { x: s + Zl / 2 + 3 + Uo / 2, y: e.y + 1 }, Uo, n.blockValue)}
  </g>`;
}
function Xl(t, e, n) {
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
function fg(t, e, n) {
  const i = 2 * (t.w + t.h), o = Xl(t, e.side, e.pt), s = ((Xl(t, n.side, n.pt) - o) % i + i) % i, r = s <= i / 2 ? 1 : -1, l = r > 0 ? s : i - s, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((p) => ({ c: p, d: ((p.t - o) * r % i + i) % i })).filter(({ d: p }) => p > 0 && p < l).sort((p, h) => p.d - h.d).map(({ c: p }) => p.pt);
  return [e.pt, ...c, n.pt];
}
function mg(t, e, n, i, o, s) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return $;
  const l = xo(t, e, i.geo), a = l.find((f) => f.name === r), c = l.find((f) => f.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return $;
  const p = o(c.name) ?? "nodata", h = Wn(p, i.palette), d = qu(fg(Oe(e, i.geo, t), a, c));
  return _`${p === "live" ? ju("ts-glow", d, h, s) : $}
    <path class="ts-path" d=${d} fill="none" stroke=${h} stroke-width="3" stroke-dasharray=${p === "nodata" ? "5 4" : $}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${De}></path>`;
}
function gg(t, e, n, i) {
  const o = i.palette;
  return Vu(e, i.geo, t).map(({ position: s, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === s;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${s} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? o.accent : "none"}
        stroke=${l ? o.accent : o.blockStroke} stroke-width="1" vector-effect=${De}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? o.accentText : o.blockValue} font-family=${Vn}>${s}</text>
    </g>`;
  });
}
function bg(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? u("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? u("power.alert.missingDevice") : t === "disagree" ? u("power.alert.disagree") : t;
}
function wg(t, e, n, i) {
  const o = Jm + Yn / 2, s = [
    { x: e.x + e.w - o, y: e.y + o },
    { x: e.x + e.w - o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + o }
  ], r = (a) => n.every(({ pt: c }) => {
    const p = Math.max(Math.abs(c.x - a.x) - Yn / 2, 0), h = Math.max(Math.abs(c.y - a.y) - Yn / 2, 0);
    return Math.hypot(p, h) > Un;
  }), l = s.find(r) ?? s[0];
  return _`<g class="alert"><title>${t.map(bg).join(`
`)}</title>
    ${Wt(Hu, l, Yn, i.blockInvalid)}</g>`;
}
function vg(t, e, n, i, o) {
  var v, w;
  const s = n.palette, r = Oe(e, n.geo, t), l = (v = n.frame) == null ? void 0 : v.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, p = r.x + r.w / 2, h = yo(e, n.geo) || u(`power.kind.${e.kind}`), d = hg(t, e, n.geo, l, s, r.w), f = e.kind === "remainder", m = xo(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${s.blockFill}
      stroke=${f ? s.powerRemainder : s.blockStroke} stroke-width=${f ? 1.5 : 1.25}
      stroke-dasharray=${f ? "6 4" : $} vector-effect=${De}></rect>
    ${e.kind === "transfer" ? mg(t, e, l, n, (b) => i(e.id, b), o) : $}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${u("power.planDevice")}</title>
      ${Wt(Em, { x: r.x + 4 + Wo / 2, y: r.y + 4 + Wo / 2 }, Wo, s.blockValue)}</g>` : $}
    <text class="name" x=${p} y=${r.y + Ti - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${eg} font-weight="600" fill=${s.blockName} font-family=${Vn}>${h}</text>
    ${d.map((b, y) => {
    const x = r.y + Ti + y * Pi + Pi / 2;
    if (b.kind === "chips") return e.kind === "transfer" ? gg(t, e, l, n) : $;
    if (b.kind === "switch") return pg(b, { x: p, y: x }, s);
    const M = b.fill ?? s.blockValue, k = b.label ? _`<tspan>${b.label} </tspan>` : $, L = b.note ? _`<tspan> ${b.note}</tspan>` : $;
    return _`<text x=${p} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${b.small ? $r : tg}
        fill=${M} font-family=${Vn}>${b.title ? _`<title>${b.title}</title>` : $}${k}<tspan
        font-weight=${b.small ? $ : "600"}>${b.value}</tspan>${L}</text>`;
  })}
    ${(w = l == null ? void 0 : l.alert) != null && w.length ? wg(l.alert, r, m, s) : $}
    ${m.map((b) => cg(b, i(e.id, b.name), s))}
  </g>`;
}
function $g(t, e, n, i) {
  const o = i.palette, s = t.w >= t.h, r = s ? t.x : t.y, l = r + (s ? t.w : t.h), a = s ? t.h : t.w;
  let c = $;
  const p = t.name ?? "", h = Math.min(jo, a - 4), d = h >= ng, f = p.length * (d ? h : jo) * 0.58 + 12;
  if (p) {
    const m = e.map((b) => s ? b.x : b.y).sort((b, y) => b - y);
    let v = { lo: 0, hi: -1 }, w = r;
    for (const b of [...m, l + pn]) {
      const y = Math.min(b - pn, l);
      y - w > v.hi - v.lo && (v = { lo: w, hi: y }), w = Math.max(w, b + pn);
    }
    if (v.hi - v.lo >= f) {
      const b = (v.lo + v.hi) / 2, y = s ? { x: b, y: d ? t.y + t.h / 2 : t.y - 7 } : { x: d ? t.x + t.w / 2 : t.x - 7, y: b };
      c = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${d ? h : jo} fill=${o.blockValue} font-family=${Vn}
        transform=${s ? $ : `rotate(-90 ${y.x} ${y.y})`}>${p}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${o.blockFill}
      stroke=${n ? Wn(n, o) : o.blockStroke} stroke-width="1.5" vector-effect=${De}></rect>
    ${c}
  </g>`;
}
function yg(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${pn} fill=${n.portFill} stroke=${Wn(e, n)} stroke-width="1.5"
      vector-effect=${De}></circle>
    ${Wt(xm, t, Qm, n.portIcon)}
  </g>`;
}
function xg(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return $;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return $;
  const o = Oe(i, e.geo, t), s = 4 / e.scale;
  return _`<rect class="selection" x=${o.x - s} y=${o.y - s} width=${o.w + 2 * s} height=${o.h + 2 * s} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${De}></rect>`;
}
function kg(t, e) {
  var d;
  const n = e.preview.power ?? t, i = e.palette, o = [];
  for (const f of n.wires) {
    const m = Pu(n, f, e.geo);
    if (!m) continue;
    const v = (d = e.frame) == null ? void 0 : d.wires[f.id];
    o.push({ w: f, a: m.a, b: m.b, pts: Tu(m.a, m.b), live: v, style: og(v) });
  }
  const s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const f of o)
    for (const [m, v] of [[f.w.from, f.a], [f.w.to, f.b]]) {
      if ("block" in m) {
        s.set(`${m.block}:${m.port}`, f.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Kl[f.style] > Kl[w]) && r.set(m.bus, f.style), l.set(m.bus, [...l.get(m.bus) ?? [], v.pt]), a.push({ at: v.pt, style: f.style });
    }
  const c = (f, m) => s.get(`${f}:${m}`), p = sg(), h = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((f) => f.kind === "bus" ? $g(f, l.get(f.id) ?? [], r.get(f.id), e) : $)}</g>
    <g class="wires">${o.map((f) => ag(f, e, p))}</g>
    ${xg(n, e)}
    <g class="blocks">${n.blocks.map((f) => f.kind === "bus" ? $ : vg(n, f, e, c, p))}</g>
    <g class="terminals">${a.map((f) => yg(f.at, f.style, i))}</g>
    ${h ? _`<line class="wire-draft" x1=${h.from.x} y1=${h.from.y} x2=${h.to.x} y2=${h.to.y}
      stroke=${h.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${De}></line>` : $}
  </g>`;
}
const jt = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, Zu = 3600, Hn = (t) => typeof t == "number" && Number.isFinite(t);
function Mg(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = jt, i = Gu(e.nightBelow, e.dayAbove), o = Ku(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: o ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: o ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: Xu(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function Gu(t, e) {
  if (t !== void 0 && !Hn(t) || e !== void 0 && !Hn(e)) return !1;
  const n = t ?? jt.nightBelow, i = e ?? jt.dayAbove;
  return n >= 0 && n < i;
}
function Ku(t, e) {
  if (t !== void 0 && !Hn(t) || e !== void 0 && !Hn(e)) return !1;
  const n = t ?? jt.sunNight, i = e ?? jt.sunDay;
  return n < i;
}
const Xu = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= Zu, Yl = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function _g(t, e) {
  var l, a, c, p;
  const n = Mg(t), i = (h) => {
    const d = h ? e == null ? void 0 : e[h] : void 0;
    return d && typeof d == "object" ? d : void 0;
  }, o = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (o && ((a = o.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof o.state == "string" && o.state.trim() !== "") {
    const h = Number(o.state);
    if (Number.isFinite(h)) return { state: Yl(h, n.nightBelow, n.dayAbove), lux: h };
  }
  const s = i((c = t.bindings) == null ? void 0 : c.sun), r = (p = s == null ? void 0 : s.attributes) == null ? void 0 : p.elevation;
  return s && s.state !== "unavailable" && s.state !== "unknown" && Hn(r) ? { state: Yl(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
const Ag = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function yr(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const As = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Sg(t, e) {
  var s;
  const n = As(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Ag[((s = n.attributes) == null ? void 0 : s.unit_of_measurement) ?? ""], o = Number(n.state);
  return i === void 0 || !Number.isFinite(o) ? void 0 : o * i;
}
const Lg = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function wi(t, e) {
  var f;
  const n = t.bindings ?? {}, i = t.props.kind;
  let o = "none", s = !1, r = !1, l;
  const a = (m, v, w) => {
    if (!m) return;
    l = As(e, m);
    const b = (l == null ? void 0 : l.state) ?? "";
    o = v.includes(b) ? "on" : w.includes(b) ? "off" : "no-data";
  }, c = ["on"], p = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      s = !0;
    // falls through
    case "socket":
    case "equipment":
    case "virtual_switch": {
      r = !!n.control, a(n.control, c, p);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      s = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], c, p), o === "on" && (o = "active");
      break;
    }
    case "wall_switch":
      a(n.state, c, p);
      break;
    // A speaker is on while its player plays.
    case "speaker": {
      if (!n.player) break;
      const m = (f = As(e, n.player)) == null ? void 0 : f.state;
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
    const m = Lg(l);
    m !== void 0 && (h.timerSince = m);
  }
  const d = Le(t).some((m) => m.role === "power") ? Sg(e, n.power) : void 0;
  return d !== void 0 && Math.round(d) >= 1 && (o === "on" || !r) && (h.power = d), i === "illuminance_sensor" && (n.illuminance || n.sun) && (h.daylight = Cg(t, e)), h;
}
function Cg(t, e) {
  const n = _g(t, e);
  if (n.state === null) return u("daylight.noData");
  const i = u(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${u("daylight.bySun")}`;
}
function Yu(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const o = e.props.kind;
    i.push({ text: yr(n - t.timerSince), tone: o === "motion_sensor" ? "motion" : o === "leak_sensor" ? "leak" : "device", id: "timer" });
  }
  return t.power !== void 0 && i.push({ text: _e(t.power), tone: "device", id: "power" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device", id: "daylight" }), i;
}
function vi(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  return e < 60 ? `${e} s` : yr(e * 1e3);
}
const Ig = (t) => t < 1e3 ? "<1 s" : vi(Math.round(t / 1e3) * 1e3);
function Eg(t, e) {
  return t.map(({ label: n, value: i, stats: o }) => {
    const s = `${n}  ${i}`;
    if (!o) return s;
    if (o.count <= 0 || o.last === null) return `${s} · ${u("power.hint.none")}`;
    const r = [s];
    if (o.period !== null && r.push(u("power.hint.every").replace("{period}", Ig(o.period))), r.push(u("power.hint.last").replace("{age}", vi(e - o.last))), o.period !== null) {
      const l = o.last + o.period - e;
      r.push(l >= 0 ? u("power.hint.next").replace("{left}", vi(Math.ceil(l / 1e3) * 1e3)) : u("power.hint.overdue").replace("{over}", vi(-l)));
    }
    return r.join(" · ");
  });
}
const Qn = 8, Ne = 4, Og = 6.8, Dg = 17, Ng = 22, Pg = 12;
function Tg(t) {
  return { w: Math.ceil(Math.max(0, ...t.map((e) => e.length)) * Og + Ng), h: t.length * Dg + Pg };
}
function Vg(t, e, n) {
  const i = (p, h, d) => Math.max(h, Math.min(p, Math.max(h, d))), o = i(t.x + t.w / 2 - e.w / 2, Ne, n.w - e.w - Ne), s = i(t.y + t.h / 2 - e.h / 2, Ne, n.h - e.h - Ne), r = t.y + t.h + Qn;
  if (r + e.h <= n.h - Ne) return { left: o, top: r };
  const l = t.y - Qn - e.h;
  if (l >= Ne) return { left: o, top: l };
  const a = t.x + t.w + Qn;
  if (a + e.w <= n.w - Ne) return { left: a, top: s };
  const c = t.x - Qn - e.w;
  return c >= Ne ? { left: c, top: s } : { left: o, top: i(r, Ne, n.h - e.h - Ne) };
}
class Qu extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function qo(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function Hg(t) {
  return t.connection.sendMessagePromise({ type: "plan_studio/info" });
}
async function zg(t, e) {
  return (await t.sendMessagePromise({ type: "plan_studio/readings/get", entity_ids: e })).readings;
}
async function Rg(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Bg(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (o) {
    throw typeof o == "object" && o !== null && o.code === "revision_conflict" ? new Qu(o.message) : o;
  }
}
async function Fg(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Ug = 2e3, Wg = 200;
class jg {
  constructor(e, n) {
    this.host = e, this.connection = n, this.stats = null, this.json = "", this.ids = [], this.timer = null, this.run = 0, this.asked = 0, this.applied = 0;
  }
  watch(e) {
    const n = e.slice(0, Wg), i = JSON.stringify(n);
    i === this.json && this.timer !== null || (this.stop(), n.length !== 0 && (this.json = i, this.ids = n, this.timer = setInterval(() => {
      this.ask(this.run);
    }, Ug), this.ask(this.run)));
  }
  stop() {
    this.timer !== null && clearInterval(this.timer), this.timer = null, this.run++, this.json = "", this.ids = [], this.stats = null;
  }
  async ask(e) {
    const n = this.connection();
    if (!n) return;
    const i = ++this.asked;
    try {
      const o = await zg(n, this.ids);
      if (e !== this.run || i < this.applied || !o || typeof o != "object") return;
      this.applied = i, this.stats = o, this.host.requestUpdate();
    } catch {
    }
  }
}
function qg(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const Ql = /* @__PURE__ */ new WeakMap();
function xr(t, e, n) {
  let i = Ql.get(t);
  i || Ql.set(t, i = /* @__PURE__ */ new WeakMap());
  let o = i.get(e);
  o || i.set(e, o = [null, null]);
  const s = n ? 1 : 0;
  if (o[s]) return o[s];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : qg(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), o[s] = r, r;
}
function $i(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, o = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, s = [o ? t.areas.get(o) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: s.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jn = (t) => t ?? $;
var Zg = Object.defineProperty, jn = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && Zg(e, n, o), o;
};
const Gg = 100;
let Kg = 0;
const Xg = (t) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, Kr = class Kr extends Vt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${Kg++}`, this.shown = null, this.onOutside = (e) => {
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
        if (o.length === Gg) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${Jn(this.label || void 0)} title=${Jn(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? g`<button class="x" type="button" title=${u("combo.clear")} aria-label=${u("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : $}</div>`;
  }
  renderDrop() {
    const { rows: e, more: n } = this.filtered(), i = this.clamped(e);
    return g`<div class="drop" @pointerdown=${(o) => {
      o.target.tagName !== "INPUT" && o.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Jn(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(o) => {
      this.query = o.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((o, s) => g`<div class="opt ${s === i ? "on" : ""}" id=${this.optId(s)} role="option"
            aria-selected=${o.id === this.value ? "true" : "false"} data-id=${o.id} title=${Jn(this.rowTitle(o))}
            @click=${() => this.pick(o.id)} @pointerenter=${() => {
      this.active = s;
    }}>${this.renderRow(o)}</div>`)}
      </div>
      ${e.length === 0 ? g`<div class="empty">${this.emptyText()}</div>` : $}
      ${n ? g`<div class="hint">${u("combo.more")}</div>` : $}
    </div>`;
  }
  render() {
    return g`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : $}</div>`;
  }
};
Kr.styles = mc`
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
let ut = Kr;
jn([
  Ze()
], ut.prototype, "value");
jn([
  Ze()
], ut.prototype, "label");
jn([
  X()
], ut.prototype, "isOpen");
jn([
  X()
], ut.prototype, "query");
jn([
  X()
], ut.prototype, "active");
var Yg = Object.defineProperty, kr = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && Yg(e, n, o), o;
};
const Qg = {
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
}, Jl = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, Jg = { light: "light", switch: "switch", event: "event", fan: "fan" };
function ea(t, e) {
  return t != null && t.deviceClass && Jl[t.deviceClass] ? Jl[t.deviceClass] : Jg[(t == null ? void 0 : t.domain) ?? xu(e)] ?? "generic";
}
const ta = (t) => Xg(Qg[t]);
function e1(t) {
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
class ko extends ut {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = $i(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? $i(this.meta, e) : null;
    return g`${ta(e ? ea(this.meta.entities.get(e), e) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : $}<small class="eid">${e}</small></span>` : g`<span class="ph">${u("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const o = mr(this.states, e.entityId) ?? "unavailable";
    return g`${ta(ea(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${e1(e.domain)}<br>${o}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = $i(this.meta, e).name;
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
kr([
  Ze({ attribute: !1 })
], ko.prototype, "meta");
kr([
  Ze({ attribute: !1 })
], ko.prototype, "items");
kr([
  Ze({ attribute: !1 })
], ko.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", ko);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Mo = (t) => (...e) => ({ _$litDirective$: t, values: e });
let _o = class {
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
const { I: t1 } = Sh, na = (t) => t, Ju = (t) => t.strings === void 0, ia = () => document.createComment(""), tn = (t, e, n) => {
  var s;
  const i = t._$AA.parentNode, o = e === void 0 ? t._$AB : e._$AA;
  if (n === void 0) {
    const r = i.insertBefore(ia(), o), l = i.insertBefore(ia(), o);
    n = new t1(r, l, t, t.options);
  } else {
    const r = n._$AB.nextSibling, l = n._$AM, a = l !== t;
    if (a) {
      let c;
      (s = n._$AQ) == null || s.call(n, t), n._$AM = t, n._$AP !== void 0 && (c = t._$AU) !== l._$AU && n._$AP(c);
    }
    if (r !== o || a) {
      let c = n._$AA;
      for (; c !== r; ) {
        const p = na(c).nextSibling;
        na(i).insertBefore(c, o), c = p;
      }
    }
  }
  return n;
}, ht = (t, e, n = t) => (t._$AI(e, n), t), n1 = {}, Mr = (t, e = n1) => t._$AH = e, i1 = (t) => t._$AH, Zo = (t) => {
  t._$AR(), t._$AA.remove();
};
class o1 extends _o {
  constructor(e) {
    if (super(e), e.type !== We.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? $e : (Mr(e), n);
  }
}
const Q = Mo(o1);
function _r(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function s1(t, e, n) {
  return R(t, P(lo(D(e, t)), n));
}
function ei(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function yt(t, e, n) {
  const { tolMm: i, grid: o, ortho: s } = n, r = s ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? _r(r, e) : e, c = r !== void 0 && a.y === r.y, p = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let h = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const L = { x: k.x, y: k.y }, E = z(L, a);
    E <= i && p(L) && (!h || E < h.d) && (h = { id: k.id, pt: L, d: E });
  }
  let d = null;
  for (const k of n.corners ?? []) {
    const L = z(k.pt, a);
    L <= i && p(k.pt) && (!d || L < d.d) && (d = { c: k, d: L });
  }
  if (d && (!h || d.d < h.d)) {
    const k = d.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: d.c };
  }
  if (h) return { pt: h.pt, kind: "node", endpoint: { kind: "node", nodeId: h.id } };
  const f = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: le(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: L } of f) {
    const E = { x: (L.a.x + L.b.x) / 2, y: (L.a.y + L.b.y) / 2 }, A = z(E, a);
    A <= i && p(E) && (!m || A < m.d) && (m = { wallId: k.id, pt: E, offset: L.len / 2, d: A });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const v = (k) => {
    let L = null;
    for (const { w: E, f: A } of f) {
      const O = se(A.dir), U = k ? [A.leftOff, -A.rightOff].filter((S) => S !== 0) : [0];
      for (const S of U) {
        const I = R(A.a, P(O, S)), T = r ? Ve(r, D(a, r), I, A.dir) : R(I, P(A.dir, G(D(a, I), A.dir)));
        if (!T) continue;
        const V = G(D(T, I), A.dir);
        if (V < 0 || V > A.len) continue;
        const F = z(T, a);
        F <= i && (!L || F < L.d) && (L = { d: F, res: { pt: T, kind: "wall", endpoint: { kind: "wall", wallId: E.id, offset: V } } });
      }
    }
    return L ? L.res : null;
  }, w = v(!1);
  if (w) return w;
  const b = v(!0);
  if (b) return b;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const L of k) {
      const E = z(L, a);
      E <= i && p(L) && (!x || E < x.d) && (x = { pt: L, d: E });
    }
  if (x) return ei(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let L = 0; L < k.length; L++) {
      const E = k[L], A = k[(L + 1) % k.length], O = z(E, A);
      if (O < 1e-9) continue;
      const U = P(D(A, E), 1 / O), S = r ? Ve(r, D(a, r), E, U) : R(E, P(U, G(D(a, E), U)));
      if (!S) continue;
      const I = G(D(S, E), U);
      if (I < 0 || I > O) continue;
      const T = z(S, a);
      T <= i && (!M || T < M.d) && (M = { pt: S, d: T });
    }
  if (M) return ei(M.pt, "zoneEdge");
  if (o && o > 0) {
    const k = (E) => Math.round(E / o) * o, L = r ? c ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return ei(L, "grid");
  }
  return ei(a, "none");
}
const Ao = 3, oa = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function ed(t) {
  let e = null;
  const n = (o, s, r) => {
    const l = o.devices.find((p) => p.id === s), a = l ? ue(o, l) : null, c = l ? $s(o, l, t.scale()) : null;
    return !a || !c ? 0 : iu(qe(D(r, a.pt)) - qe(D(c.to, a.pt)));
  };
  function i(o) {
    if (!e || !e.moved && z(o.pt, e.downPt) <= Ao / t.scale()) return;
    e.moved = !0;
    const s = e.original.devices.find((h) => h.id === e.id), r = s ? ue(e.original, s) : null;
    if (!s || !r) return;
    const l = z(o.pt, r.pt), a = (qe(D(o.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? o.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, p = of(e.original, s, c, o.shift);
    e.work = JSON.stringify(p) === JSON.stringify(s.placement) ? e.original : Ei(e.original, s.id, p);
  }
  return {
    start(o, s) {
      if (e = null, !o) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === o), a = l ? $s(r, l, t.scale()) : null;
      return !l || !a || z(s.pt, a.to) > t.tolMm() ? !1 : (e = { id: o, original: r, work: r, downPt: s.pt, offset: n(r, o, s.pt), moved: !1 }, !0);
    },
    move: i,
    end(o) {
      if (!e) return !1;
      i(o);
      const s = e;
      return e = null, s.moved && s.work !== s.original && oa(s.work, s.id) !== oa(s.original, s.id) && t.commit(s.work), !0;
    },
    cancel() {
      const o = e !== null;
      return e = null, o;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function sa(t, e, n) {
  const i = le(t, t.walls.find((o) => o.id === e));
  return Ge(i, n).side > 0 ? "left" : "right";
}
function td(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function Ar(t, e = "free") {
  return t === "equipment" ? [e] : Xs[t];
}
function nd(t, e, n, i, o = 0, s = Ar(n)) {
  if (s.includes("wall")) {
    const r = yt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: sa(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const p = le(e, c), h = Ge(p, i).side, d = Math.abs(Math.abs(h) - (h > 0 ? p.leftOff : p.rightOff));
        (!a || d < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : p.len, d });
      }
      if (a) return { mode: "wall", wallId: a.id, side: sa(e, a.id, i), offset: a.offset };
    }
  }
  return s.includes("free") ? { mode: "free", ...td(t, i), rotation: o } : null;
}
function r1(t, e, n) {
  const i = ue(t, e);
  if (!i) return null;
  if (!n) {
    const s = tr(Math.round(qe(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: s };
  }
  let o = null;
  for (const s of t.walls) {
    let r;
    try {
      r = le(t, s);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = Ge(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), p = En(t, s.id, a, c), h = p ? z(p, i.pt) : 1 / 0;
    (!o || h < o.d) && (o = { placement: { mode: "wall", wallId: s.id, side: a, offset: c }, d: h });
  }
  return o && o.d < 1 / 0 ? nr(t, e.props, o.placement, 0) : null;
}
function l1(t, e, n) {
  return Yc(t.deviceDefaults(e), "free", n.mode);
}
function a1(t, e) {
  let n = null, i;
  const o = ed(t);
  function s() {
    if (!n) return null;
    const r = t.level(), l = Ar(e, t.wallMount() ? "wall" : "free"), a = nd(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...td(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = l1(t, e, a), p = nr(r, c, a, t.tolMm()), h = Al(r, c, p, "").deviceId !== null;
    return { placement: p, props: c, invalid: !h };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, o.start(i, r)) return;
      const l = s();
      if (!l || l.invalid) return;
      const a = t.level(), c = qs(u(`device.${e}`), a.devices.filter((h) => h.props.kind === e).map((h) => h.name)), p = Al(a, l.props, l.placement, c);
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
function zn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const o = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(o)) return null;
  const s = Number(o);
  return Number.isSafeInteger(s) && s >= e && s <= n ? s : null;
}
function H(t, e) {
  return g`<label class="row"><span>${t}</span>${e}</label>`;
}
function ae(t, e, n, i) {
  return g`<select class="val" data-field=${i ?? $} .value=${Q(t)} @change=${(o) => {
    const s = o.target;
    n(s.value) === !1 && (s.value = t);
  }}>
    ${e.map((o) => g`<option value=${o.v} ?selected=${o.v === t}>${o.label}</option>`)}
  </select>`;
}
function Ye(t) {
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
    const s = zn(o.value, t.rule);
    if (s === null) {
      o.value = e, n(u(t.bad));
      return;
    }
    if (t.skipSame && s === t.value) {
      n(null);
      return;
    }
    if (t.apply(s) === !1) {
      o.value = e, n(u("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function c1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function id(t, e = "equipment") {
  const n = t.devices.filter((i) => i.props.kind === e).map((i) => i.name);
  return Zc(t, qs(u(`device.${e}`), n), e);
}
function Sr(t) {
  if (Kt(t)) return u("props.inverter");
  const e = Hp(t);
  return e ? u(`deviceRole.${e}`) : "";
}
function So(t) {
  const e = u(`device.${t.props.kind}`), n = Sr(t);
  return n ? `${e} · ${n}` : e;
}
function u1(t) {
  const e = c1(t.level);
  return g`<section class="unplaced" data-list="unplaced">
    <div class="uhead">
      <h4>${u("devices.unplaced")}</h4>
      <span class="uacts">
        <button class="btn" data-action="new-device" @click=${() => t.onNew("equipment")}>${u("devices.new")}</button>
        <button class="btn" data-action="new-virtual-switch" @click=${() => t.onNew("virtual_switch")}>${u("devices.newVirtual")}</button>
        <button class="btn" data-action="new-speaker" @click=${() => t.onNew("speaker")}>${u("devices.newSpeaker")}</button>
        <button class="btn" data-action="new-phone" @click=${() => t.onNew("phone")}>${u("devices.newPhone")}</button>
      </span>
    </div>
    ${e.length === 0 ? $ : g`<div class="pdevs">
      ${e.map((n) => g`<button class="pdev" data-id=${n.id} @click=${() => t.onPick(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${Sr(n) || u(`device.${n.props.kind}`)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const od = Object.keys(Xs), d1 = (t) => od.includes(t);
function h1() {
  return Object.fromEntries(od.map((t) => [t, at(t, "free")]));
}
const sd = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Bt, max: Bt, signed: !0 }, bad: "props.badAim" }
}, fn = (t, e, n, i, o) => Ye({ ...sd[i], value: n, field: e, setNotice: t.onNotice, apply: o, skipSame: !0 }), p1 = ["round", "linear", "spot"], f1 = ["rect", "circle"], Hi = (t, e) => t.map((n) => ({ v: n, label: u(`${e}.${n}`) }));
function rd(t, e, n, i) {
  const o = (r, l, a) => H(`${u(l)}, ${u("unit.mm")}`, fn(t, n + r, a, "mm", (c) => i({ [r]: c }))), s = (r, l, a) => H(`${u(l)}, ${u("unit.deg")}`, fn(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return g`
        ${H(u("props.shape"), ae(e.shape, Hi([...p1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? g`${o("length", "props.length", e.length)}${o("width", "props.width", e.width)}` : e.shape === "round" ? o("diameter", "props.diameter", e.diameter) : $}
        ${H(`${u("props.poolRadius")}, ${u("unit.mm")}`, Ye({
        ...sd.mm,
        value: e.poolRadius,
        field: `${n}poolRadius`,
        placeholder: u("props.poolHint"),
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
      return H(`${u("props.diameter")}, ${u("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${Q(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Uh.map((r) => g`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return g`
        ${H(u("props.shape"), ae(e.shape, Hi([...f1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? g`${o("width", "props.width", e.width)}${o("depth", "props.depth", e.depth)}` : o("diameter", "props.diameter", e.diameter)}
        ${H(u("props.icon"), g1(t, e.icon, `${n}icon`, i))}
        ${H(u("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Q(e.label)}
          @change=${(r) => {
        const l = r.target.value.trim();
        l !== e.label && i({ label: l });
      }} />`)}`;
    case "illuminance_sensor":
      return g`<p class="muted" data-note="daylight">${u("props.daylightInBinding")}</p>`;
    default:
      return g`<p class="muted">${u("props.noSettings")}</p>`;
  }
}
const m1 = /^mdi:[a-z0-9-]+$/;
function g1(t, e, n, i) {
  const o = (s, r) => {
    var l, a;
    if (!m1.test(s)) {
      r(e), (l = t.onNotice) == null || l.call(t, u("props.badIcon"));
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
function xt(t, e, n, i) {
  return H(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)} @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`);
}
function b1(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? $ : xt("wallMount", u("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function w1(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? $ : g`
    ${xt("inverter", u("props.inverter"), !!n.inverter, (o) => {
    var s;
    return ((s = t.onInverter) == null ? void 0 : s.call(t, o)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? xt("controllable", u("props.controllable"), !!n.controllable, (o) => {
    var s;
    return ((s = t.onControllable) == null ? void 0 : s.call(t, o)) ?? !1;
  }) : g`<p class="muted" data-note="bind-switch">${u("props.bindSwitchHint")}</p>`}`;
}
function v1(t, e) {
  const n = e.placement;
  if (n.mode === "none") return $;
  if (n.mode === "free")
    return H(
      `${u("props.rotation")}, ${u("unit.deg")}`,
      fn(t, "rotation", n.rotation, "rotation", (o) => t.onPlacement({ ...n, rotation: o }))
    );
  const i = _c.has(e.props.kind);
  return g`
    ${H(u("props.side"), ae(n.side, Hi(["left", "right"], "side"), (o) => t.onPlacement({ ...n, side: o }), "side"))}
    ${H(`${u("props.offset")}, ${u("unit.mm")}`, fn(
    t,
    "offset",
    n.offset,
    "offset",
    (o) => t.onPlacement({ ...n, offset: o })
  ))}
    ${i ? H(
    `${u("props.aim")}, ${u("unit.deg")}`,
    fn(t, "aim", n.aim ?? 0, "aim", (o) => t.onPlacement(lu(n, o)))
  ) : $}`;
}
function Lr(t, e) {
  return H(u("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${Q(t.name)}
    @change=${(n) => {
    const i = n.target, o = i.value.trim();
    if (!o) {
      i.value = t.name;
      return;
    }
    o !== t.name && e(o);
  }} />`);
}
function $1(t, e) {
  const n = e.props.kind;
  return kc(n) ? n === "smart_button" && e.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${u("props.typeFreeHint")}</p>` : H(u("props.type"), ae(
    n,
    Hi(["wall_switch", "smart_button"], "device"),
    (i) => {
      var o;
      return (o = t.onKind) == null ? void 0 : o.call(t, i);
    },
    "kind"
  )) : $;
}
function y1(t, e) {
  const n = t.level ? uf(t.level, e) : [];
  return g`<fieldset data-field="zone-membership"><legend>${u("props.zoneList")}</legend>
    ${n.length === 0 ? g`<p class="muted">${u("props.noZones")}</p>` : n.map(({ zone: i, participates: o }) => g`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${o}
        @change=${(s) => {
    var l;
    const r = s.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = o);
  }} /></label>`)}
  </fieldset>`;
}
function x1(t, e) {
  const n = e.placement.mode !== "none";
  return g`
    <h4>${So(e)}</h4>
    ${Lr(e, (i) => t.onDevice({}, i))}
    ${$1(t, e)}
    ${n ? rd(t, e.props, "", (i) => t.onDevice(i)) : $}
    ${b1(t, e)}
    ${v1(t, e)}
    ${w1(t, e)}
    ${n ? y1(t, e) : $}
    ${e.invalid ? g`<p class="warn">${u("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${u("action.delete")}</button>`;
}
function k1(t) {
  return t.device ? x1(t, t.device) : t.nextKind && t.nextProps ? g`
      <h4>${u("props.nextDevice")}: ${u(`device.${t.nextKind}`)}</h4>
      ${rd(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? xt(
    "next-wallMount",
    u("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : $}` : g`<p class="muted">${u("props.none")}</p>`;
}
function M1(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, o = d1(t.toolId) ? t.toolId : null, s = (a) => a === e ? (t.setNotice(u("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const p = r1(e, a, c);
    return s(p ? Ei(e, a.id, p) : e);
  };
  return g`<div class="props">
    ${k1({
    device: i,
    level: e,
    nextKind: o,
    nextProps: o ? t.nextProps[o] : null,
    onDevice: (a, c) => !!i && s(At(e, i.id, a, c)),
    onKind: (a) => !!i && s(zp(e, i.id, a)),
    onPlacement: (a) => !!i && s(Ei(e, i.id, a)),
    onZone: (a, c) => !!i && s(bu(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Iu(e, t.power, i.id, a)),
    onControllable: (a) => !!i && s(po(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      o && t.setNextProps({ ...t.nextProps, [o]: { ...t.nextProps[o], ...a, kind: o } });
    },
    onDelete: () => {
      i && r(Cu(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    ${i ? $ : u1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: (a) => {
      const c = id(e, a);
      t.commit(c.level), t.pickDevice(c.id);
    }
  })}
  </div>`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Cr = Mo(class extends _o {
  constructor(t) {
    if (super(t), t.type !== We.PROPERTY && t.type !== We.ATTRIBUTE && t.type !== We.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Ju(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === $e || e === $) return e;
    const n = t.element, i = t.name;
    if (t.type === We.PROPERTY) {
      if (e === n[i]) return $e;
    } else if (t.type === We.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return $e;
    } else if (t.type === We.ATTRIBUTE && n.getAttribute(i) === e + "") return $e;
    return Mr(t), e;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mn = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const o of n) (i = o._$AO) == null || i.call(o, e, !1), mn(o, e);
  return !0;
}, zi = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, ld = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), S1(e);
  }
};
function _1(t) {
  this._$AN !== void 0 ? (zi(this), this._$AM = t, ld(this)) : this._$AM = t;
}
function A1(t, e = !1, n = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0) if (e) if (Array.isArray(i)) for (let s = n; s < i.length; s++) mn(i[s], !1), zi(i[s]);
  else i != null && (mn(i, !1), zi(i));
  else mn(this, t);
}
const S1 = (t) => {
  t.type == We.CHILD && (t._$AP ?? (t._$AP = A1), t._$AQ ?? (t._$AQ = _1));
};
class L1 extends _o {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), ld(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, o;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (o = this.disconnected) == null || o.call(this)), n && (mn(this, e), zi(this));
  }
  setValue(e) {
    if (Ju(this._$Ct)) this._$Ct._$AI(e, this);
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
const C1 = () => new I1();
class I1 {
}
const Go = /* @__PURE__ */ new WeakMap(), E1 = Mo(class extends L1 {
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
      let n = Go.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Go.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Go.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), O1 = () => [{ v: "0", label: u("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], D1 = { min: 1, max: 10 };
function ad(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Ss = (t, e, n) => ad(t, At(t.level, e.id, n));
function Ko(t, e, n, i) {
  return g`<div class="cflag">${H(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)}
    @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`)}</div>`;
}
const Xo = "__other", nn = /* @__PURE__ */ new Set();
function N1(t, e, n, i, o) {
  const s = `${e.id}:${n}`, r = cl.includes(i), l = !r || nn.has(s), a = C1(), c = [...cl.map((h) => ({ v: h, label: h })), { v: Xo, label: u("binding.eventOther") }];
  return g`<span class="evfield">${ae(l ? Xo : i, c, (h) => {
    if (h === Xo) {
      nn.add(s), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    nn.delete(s), a.value && (a.value.hidden = !0), h !== i ? o(h) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${E1(a)} data-field=${`${n}-event-custom`} ?hidden=${Cr(!l)}
      .value=${Q(r ? "" : i)} @change=${(h) => {
    var m;
    const d = h.target, f = d.value.trim();
    if (!f) {
      d.value = r ? "" : i, t.setFieldNotice(u("props.badEvent"));
      return;
    }
    if (d.value = f, t.setFieldNotice(null), f !== i) {
      o(f) && nn.delete(s);
      return;
    }
    if (nn.delete(s), r) {
      d.hidden = !0;
      const v = (m = d.parentElement) == null ? void 0 : m.querySelector("select");
      v && (v.value = i);
    }
  }} /></span>`;
}
function P1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return g`${$}`;
  const o = i[n], s = (r) => Ss(t, e, { [n]: { ...o, ...r } });
  return g`<div class="trigger" data-trigger=${n}>
    ${H(u("binding.slot"), ae(
    String(o.slot),
    O1(),
    (r) => r === String(o.slot) ? !1 : s({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${H(u("binding.event"), N1(t, e, n, o.event, (r) => s({ event: r })))}
  </div>`;
}
function T1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return g`
      ${Ko(
      "autoByDoubleToggle",
      u("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => Ss(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${H(u("binding.window"), Ye({
      value: i.windowSec,
      rule: D1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => Ss(t, e, { windowSec: l })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${$}`;
  const o = (l, a) => (c) => {
    var h, d;
    const p = At(t.level, e.id, { [l]: c });
    return ad(t, c && !((h = e.bindings) != null && h[a]) ? oo(p, e.id, a, ((d = e.bindings) == null ? void 0 : d.on) ?? null) : p);
  }, s = o("separateOff", "off"), r = Ko("autoEnabled", u("binding.autoEnabled"), i.autoEnabled, o("autoEnabled", "auto"));
  return n === "off" ? r : g`${Ko("separateOff", u("binding.separateOff"), i.separateOff, s)}${i.separateOff ? $ : r}`;
}
function V1(t) {
  return t.props.kind !== "smart_button" || !Fh(t).length ? g`${$}` : g`<div class="cfields"><p class="warn" data-note="duplicate">${u("binding.duplicate")}</p></div>`;
}
function H1(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function z1(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return $;
  const i = jt, o = (a, c) => {
    if (c === n[a] || n[a] === void 0 && c === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(At(t.level, e.id, { [a]: c }));
  }, s = (a, c) => {
    const p = String(n[a] ?? i[a]);
    return H(c, g`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${Q(p)}
      @change=${(h) => {
      const d = h.target;
      if (d.value.trim() === "") {
        o(a, void 0);
        return;
      }
      const f = H1(d.value);
      if (f === null) {
        d.value = p, t.setFieldNotice(u("props.badDecimal"));
        return;
      }
      o(a, f);
    }} />`);
  }, r = H(u("props.debounce"), Ye({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: Zu },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => o("debounce", a),
    onBlank: () => o("debounce", void 0)
  })), l = (a, c) => g`<p class="warn" data-note=${a}>${c}</p>`;
  return g`<div class="cfields" data-section="daylight">
    ${s("nightBelow", u("props.nightBelow"))}
    ${s("dayAbove", u("props.dayAbove"))}
    ${Gu(n.nightBelow, n.dayAbove) ? $ : l("lux-pair", u("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${s("sunNight", u("props.sunNight"))}
    ${s("sunDay", u("props.sunDay"))}
    ${Ku(n.sunNight, n.sunDay) ? $ : l("sun-pair", u("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${Xu(n.debounce) ? $ : l("debounce", u("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function Ri(t, e) {
  return e === "control" && t.props.kind === "equipment" ? u("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? u("binding.onOff") : u(`role.${e}`);
}
const Yo = (t) => String(t).padStart(2, "0");
function R1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Yo(e.getHours())}:${Yo(e.getMinutes())}:${Yo(e.getSeconds())}`;
}
const B1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function F1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? u("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : u("output.errorNotConfigured") : t.last ? u("output.last").replace("{event}", B1(t.last, t.kind)).replace("{time}", R1(t.last.at)) : u("output.none");
}
function U1(t, e) {
  if (!ro(e.props.kind)) return $;
  const n = t.feed.stateOf(e), i = n ? F1(n) : t.feed.error ?? (t.feed.ready ? u("output.notSaved") : null);
  return i === null ? $ : g`<p class="note" data-field="output">${i}</p>`;
}
function W1(t, e) {
  var i;
  const n = (i = e.bindings) != null && i.control ? mr(t.states, e.bindings.control) : null;
  return g`<p class="note" data-field="virtual-state">${n === null ? u("output.notSaved") : u("virtual.state").replace("{s}", n)}</p>
    <p class="muted" data-note="virtual-hint">${u("virtual.hint")}</p>`;
}
function j1(t, e) {
  const n = e.props.kind === "phone" ? e.props.notify ?? "" : "", i = t.notifyServices ?? [], o = n !== "" && !i.includes(n);
  return g`<div class="role" data-role="notify">
    <div class="role-head"><span class="role-label" data-field="notify-label">${u("phone.notify")}</span></div>
    <select class="val wide" data-field="notify" @change=${(s) => {
    const r = s.target.value;
    t.commit(At(t.level, e.id, { notify: r === "" ? void 0 : r }));
  }}>
      <option value="" ?selected=${n === ""}>${u("phone.pick")}</option>
      ${o ? g`<option value=${n} selected>${n}</option>` : $}
      ${i.map((s) => g`<option value=${s} ?selected=${s === n}>${s}</option>`)}
    </select>
    ${o ? g`<p class="warn" data-note="notify-missing">${u("phone.missing")}</p>` : $}
    ${i.length === 0 ? g`<p class="note" data-note="notify-none">${u("phone.noServices")}</p>` : $}
    <p class="muted" data-note="phone-hint">${u("phone.hint")}</p>
  </div>`;
}
function q1(t, e, n, i) {
  const o = Mu(t.meta, i, t.states), s = Bh(t.level, e, n);
  return g`
    ${o === "missing" ? g`<p class="warn" data-note="missing">${u("binding.missing")}</p>` : $}
    ${o === "unavailable" ? g`<p class="note" data-note="unavailable">${u("binding.unavailable")}</p>` : $}
    ${s.length ? g`<p class="note" data-note="also">${u("binding.alsoBound").replace("{names}", s.map((r) => r.name).join(", "))}</p>` : $}`;
}
function Z1(t, e, n) {
  var l;
  const { role: i } = n, o = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, s = !!t.showAll[i], r = Ri(e, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${s}
        @change=${() => t.onShowAll(i)} />${u("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${xr(t.meta, n, s)} .value=${o}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = oo(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Zs(i) ? P1(t, e, i) : $}
    ${o ? q1(t, e, i, o) : $}
  </div>`;
}
function G1(t) {
  const e = t.device, n = Gs(t.level.devices.map(t.status));
  return g`<div class="props bprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.fieldNotice ? g`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : $}
    ${t.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${u(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${e ? g`
      <h4>${So(e)}</h4>
      ${Lr(e, (i) => t.commit(At(t.level, e.id, {}, i)))}
      ${U1(t, e)}
      ${e.props.kind === "virtual_switch" ? W1(t, e) : e.props.kind === "phone" ? j1(t, e) : Le(e).map((i) => g`${Z1(t, e, i)}${T1(t, e, i.role)}`)}
      ${e.props.kind === "speaker" ? g`<p class="muted" data-note="speaker-hint">${u("speaker.hint")}</p>` : $}
      ${V1(e)}
      ${z1(t, e)}` : g`<p class="muted">${u("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${u("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${u("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${u("binding.reload")}</button>
  </div>`;
}
const K1 = 500, X1 = 1e3;
function Y1(t, e, n) {
  var s;
  const i = [], o = (r, l, a) => {
    r && i.push({ entity: r, label: l, value: a });
  };
  switch (t.kind) {
    case "grid":
      o(t.power, u("power.field.power"), _e(n == null ? void 0 : n.power)), o(t.voltage, u("power.field.voltage"), zt(n == null ? void 0 : n.voltage, "V"));
      break;
    case "battery":
      o(t.power, u("power.field.batteryPower"), _e(n == null ? void 0 : n.power)), o(t.soc, u("power.field.soc"), zt(n == null ? void 0 : n.soc, "%"));
      break;
    case "pv":
      o(t.power, u("power.field.power"), _e(n == null ? void 0 : n.power));
      break;
    case "device": {
      const r = e.device(t.deviceId);
      if (!r) break;
      const l = new Set(Le(r).map((c) => c.role)), a = {
        power: _e(n == null ? void 0 : n.power),
        power_in: _e(n == null ? void 0 : n.power_in),
        power_out: _e(n == null ? void 0 : n.power_out),
        voltage: zt(n == null ? void 0 : n.voltage, "V")
      };
      for (const c of ["power", "power_in", "power_out", "voltage"])
        l.has(c) && o((s = r.bindings) == null ? void 0 : s[c], Ri(r, c), a[c] ?? "—");
      break;
    }
  }
  return i;
}
class Q1 {
  /** `meters(id)`: the block's meters now (empty when the block is gone or reads nothing). */
  constructor(e, n, i) {
    this.host = e, this.meters = i, this.openId = null, this.candidate = null, this.dwell = null, this.tick = null, this.feed = new jg(e, n);
  }
  /** How many meters block `id` has now (0: no hint for it). */
  meterCount(e) {
    return this.meters(e).length;
  }
  /** The pointer is over block `id` (null: over nothing, or a block without meters): starts, keeps or drops the dwell. */
  move(e) {
    e !== (this.openId ?? this.candidate) && (this.hide(), e !== null && (this.candidate = e, this.dwell = setTimeout(() => {
      this.dwell = null, this.candidate = null, this.show(e);
    }, K1)));
  }
  /** Opens at once (the dev harness); the same checks as after the dwell. */
  show(e) {
    this.openId !== e && (this.hide(), this.meters(e).length !== 0 && (this.openId = e, this.tick = setInterval(() => this.host.requestUpdate(), X1), this.sync(), this.host.requestUpdate()));
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
    return i.length ? Eg(i, e) : null;
  }
}
const J1 = 3;
function Ee(t) {
  if (typeof t == "number")
    return t === J1 ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class eb {
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
      const s = await Bg(this.hass, e, n, i);
      return this.baseRevision = s, this.dirty = this.dirtyVersion !== o, this.state = "saved", this.onChange(), s;
    } catch (s) {
      return s instanceof Qu ? (this.state = "conflict", this.errorMessage = s.message) : (this.state = "error", this.errorMessage = Ee(s)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ra = (t, e, n) => {
  const i = /* @__PURE__ */ new Map();
  for (let o = e; o <= n; o++) i.set(t[o], o);
  return i;
}, tb = Mo(class extends _o {
  constructor(t) {
    if (super(t), t.type !== We.CHILD) throw Error("repeat() can only be used in text expressions");
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
    const o = i1(t), { values: s, keys: r } = this.dt(e, n, i);
    if (!Array.isArray(o)) return this.ut = r, s;
    const l = this.ut ?? (this.ut = []), a = [];
    let c, p, h = 0, d = o.length - 1, f = 0, m = s.length - 1;
    for (; h <= d && f <= m; ) if (o[h] === null) h++;
    else if (o[d] === null) d--;
    else if (l[h] === r[f]) a[f] = ht(o[h], s[f]), h++, f++;
    else if (l[d] === r[m]) a[m] = ht(o[d], s[m]), d--, m--;
    else if (l[h] === r[m]) a[m] = ht(o[h], s[m]), tn(t, a[m + 1], o[h]), h++, m--;
    else if (l[d] === r[f]) a[f] = ht(o[d], s[f]), tn(t, o[h], o[d]), d--, f++;
    else if (c === void 0 && (c = ra(r, f, m), p = ra(l, h, d)), c.has(l[h])) if (c.has(l[d])) {
      const v = p.get(r[f]), w = v !== void 0 ? o[v] : null;
      if (w === null) {
        const b = tn(t, o[h]);
        ht(b, s[f]), a[f] = b;
      } else a[f] = ht(w, s[f]), tn(t, o[h], w), o[v] = null;
      f++;
    } else Zo(o[d]), d--;
    else Zo(o[h]), h++;
    for (; f <= m; ) {
      const v = tn(t, a[m + 1]);
      ht(v, s[f]), a[f++] = v;
    }
    for (; h <= d; ) {
      const v = o[h++];
      v !== null && Zo(v);
    }
    return this.ut = r, Mr(t, a), $e;
  }
});
function cd(t, e, n) {
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
function nb(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function ib(t, e, n, i) {
  const o = [t, t + n / 2, t + n], s = [e, e + i / 2, e + i], r = [];
  for (const l of o) for (const a of s) (l !== o[1] || a !== s[1]) && r.push({ x: l, y: a });
  return r;
}
function ob(t, e, n, i, o) {
  const s = ib(e, n, i, o);
  if (!s.every((l) => St(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + o)) return null;
  let r = 1 / 0;
  for (const l of s)
    for (let a = 0; a < t.length; a++) r = Math.min(r, xe(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function sb(t, e, n, i, o) {
  const s = e.placement.mode === "wall", r = s ? nb(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const d of t.zones) {
    const f = re(t, d);
    if (f.length < 3 || !St(f, n.pt)) continue;
    const m = Math.abs(ze(f));
    m < a && (a = m, l = f);
  }
  if (!l) return r;
  const c = (d) => {
    const f = cd(d, i, o);
    return ob(l, n.pt.x + f.x, n.pt.y + f.y, i.w, i.h);
  }, p = (d) => {
    let f = null, m = -1;
    for (const v of d) {
      const w = c(v);
      w !== null && w > m && (f = v, m = w);
    }
    return f;
  }, h = ["down-right", "down-left", "up-right", "up-left"];
  if (s) {
    const d = r === "up" || r === "down", f = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = h.filter((v) => d ? v.startsWith(r) : v.endsWith(r));
    return p(m) ?? p(d ? ["right", "left"] : ["down", "up"]) ?? (c(f) !== null ? f : r);
  }
  return p(["right", "left"]) ?? p(h) ?? p(["down", "up"]) ?? r;
}
const me = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function He(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function ud(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${u("unit.m2")}`;
}
const qn = 12, K = "non-scaling-stroke", rb = 7, lb = 10, Bi = "#f43f5e", la = "3 2", aa = 18, ab = 6, ca = 11, cb = 0.6, ub = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", dd = 24, ti = 4, ua = 4, yi = qn * 0.85, db = 0.58;
function hb(t, e, n, i) {
  const o = dd;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const s = n * Math.PI / 180, r = Math.abs(Math.cos(s)), l = Math.abs(Math.sin(s)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], p = a * i - 2 * ua, h = c * i - 2 * ua, d = e.length * db * yi, f = o + ti + yi, m = o + ti + d, v = Math.max(o, d), w = (M, k) => Math.max(0, M - p) + Math.max(0, k - h), b = w(v, f), y = w(m, o);
  if (b > 0 && y < b) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + o / 2) / i,
      iconY: 0,
      labelX: (M + o + ti) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -f / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + o / 2) / i,
    labelX: 0,
    labelY: (x + o + ti + yi / 2) / i,
    labelAnchor: "middle"
  };
}
function pb(t, e, n, i = 0, o = 0) {
  const s = dd / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - s / 2} y=${o - s / 2} width=${s} height=${s}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${s}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}>
    <path d=${ub} fill=${n}></path></g>`;
}
const fb = "__preview__", mb = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, gb = /* @__PURE__ */ new WeakMap();
function bb(t, e) {
  var o;
  const n = He(gb, t.walls, () => /* @__PURE__ */ new WeakMap()), i = He(n, t.nodes, () => /* @__PURE__ */ new WeakMap());
  return (o = He(i, t.openings, () => ({})))[e] ?? (o[e] = nu(t, e));
}
const wb = /* @__PURE__ */ new WeakMap();
function hd(t, e) {
  const n = fo(e.props.kind);
  if (!n) return [];
  const i = bb(t, n), o = He(wb, i, () => /* @__PURE__ */ new WeakMap());
  let s = o.get(e);
  return s || (s = ef(t, e, () => i), o.set(e, s)), s;
}
function Fi(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function vb(t, e, n, i, o, s = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = o ?? $;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${K}></circle>` : _`<circle class="icon" r=${Fi(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></path>`;
    case "motion_sensor": {
      const p = (h) => `M${e * h} ${-e * h * 0.8}A${e * h} ${e * h * 0.8} 0 0 1 ${e * h} ${e * h * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="arcs" d=${p(1) + p(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    case "illuminance_sensor": {
      let p = "";
      for (let h = 0; h < 8; h++) {
        const d = h * Math.PI / 4;
        p += `M${Math.cos(d) * e * 1.15} ${Math.sin(d) * e * 1.15}L${Math.cos(d) * e * 1.6} ${Math.sin(d) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="rays" d=${p} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    case "wall_switch":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></rect>`;
    case "valve":
      return _`<path class="icon" d=${`M${-e} ${-e * 0.6}L${e} ${e * 0.6}L${e} ${-e * 0.6}L${-e} ${e * 0.6}Z`} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-linejoin="round" stroke-dasharray=${c} vector-effect=${K}></path>`;
    case "leak_sensor":
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="drop" d=${`M0 ${-e * 0.4}Q${e * 0.3} ${e * 0.05} 0 ${e * 0.3}Q${-e * 0.3} ${e * 0.05} 0 ${-e * 0.4}Z`} fill=${s} stroke=${s} stroke-width="1" vector-effect=${K}></path>`;
    case "smart_button":
      return _`<rect class="icon" x=${-e * 0.6} y=${-e * 0.6} width=${e * 1.2} height=${e * 1.2} rx=${e * 0.35}
        fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c}
        vector-effect=${K}></rect>
        <circle class="dot" r=${e * 0.18} fill=${n}></circle>`;
    case "socket":
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <circle class="dot" cx=${-e * 0.4} r=${e * 0.15} fill=${s}></circle>
        <circle class="dot" cx=${e * 0.4} r=${e * 0.15} fill=${s}></circle>`;
    case "virtual_switch":
      return _`<rect class="icon" x=${-e} y=${-e * 0.55} width=${e * 2} height=${e * 1.1} rx=${e * 0.55} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></rect>
        <circle class="dot" cx=${-e * 0.45} r=${e * 0.3} fill=${s}></circle>`;
    case "speaker":
      return _`<rect class="icon" x=${-e * 0.7} y=${-e} width=${e * 1.4} height=${e * 2} rx=${e * 0.25} fill=${a.fill}
        stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></rect>
        <circle class="dot" cy=${e * 0.3} r=${e * 0.42} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${K}></circle>
        <circle class="dot" cy=${-e * 0.55} r=${e * 0.16} fill=${s}></circle>`;
    case "climate_sensor":
      return _`<circle class="icon" cx=${-e * 0.3} r=${e * 0.45} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="thermo" d=${`M${-e * 0.3} ${-e * 0.45}V${-e * 1.1}M${-e * 0.3} ${-e * 0.45}H${-e * 1.1}`} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>
        <path class="drop" d=${`M${e * 0.7} ${-e * 0.7}Q${e * 1.1} ${-e * 0.1} ${e * 0.7} ${e * 0.3}Q${e * 0.3} ${-e * 0.1} ${e * 0.7} ${-e * 0.7}Z`} fill=${n} stroke=${n} stroke-width="1" vector-effect=${K}></path>`;
    case "exhaust_fan": {
      let p = "";
      for (let h = 0; h < 4; h++) {
        const d = h * Math.PI / 2 + Math.PI / 4;
        p += `M0 0L${Math.cos(d) * e * 0.85} ${Math.sin(d) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="blades" d=${p} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    default:
      return _`${$}`;
  }
}
function $b(t, e, n, i, o, s) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${$}`;
  const l = hb(r, r.label, i, e.scale), a = s ?? $, c = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></circle>
      ${o ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : $}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></rect>
      ${o ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : $}`;
  return _`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${pb(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${yi / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function yb(t, e, n = 0) {
  return t === "bound" ? $ : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(qn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${mb[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : $} vector-effect=${K}></circle>`;
}
function xb(t, e, n) {
  if (t.status !== "error") return $;
  const i = e * 0.9, o = -e * 0.9, s = lb / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${o} r=${rb / n.scale} fill=${n.palette.background} stroke=${Bi} stroke-width="1.5"
      vector-effect=${K}></circle>
    <path d=${Hu} fill=${Bi} transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}></path>
  </g>`;
}
function kb(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" || t === "unmatched" ? Bi : t === "event" ? e.selection : t === "mode" ? e.modeBubble : e.device;
}
function Mb(t, e, n, i, o, s) {
  const r = [...i.shown.map((b) => [b, "bubble-in"]), ...i.leaving.map((b) => [b, "bubble-out"])];
  if (r.length === 0) return $;
  const l = 1 / s.scale, a = r.map(([b]) => (b.text.length * ca * cb + 2 * ab) * l), c = aa * l, p = (aa + 2) * l, h = { w: Math.max(...a), h: c + p * (r.length - 1) }, d = o + 4 * l, f = Math.max(1, i.shown.length), m = sb(t, e, n, { w: Math.max(...a.slice(0, f)), h: c + p * (f - 1) }, d), v = cd(m, h, d), w = ([b, y], x) => `${y}:${b.id ?? (b.key === void 0 ? `#${x}` : "")}:${b.key ?? ""}`;
  return _`${tb(r.map((b, y) => [b, y]), ([b, y]) => w(b, y), ([[b, y], x]) => {
    const M = a[x], k = v.x + (h.w - M) / 2, L = v.y + (m.startsWith("up") ? r.length - 1 - x : x) * p, E = kb(b.tone, s.palette);
    return _`<g class=${`bubble ${y}`} data-tone=${b.tone}>
      <rect x=${k} y=${L} width=${M} height=${c} rx=${c / 2} fill=${s.palette.background} stroke=${E} stroke-width="1.5"
        vector-effect=${K}></rect>
      <text x=${k + M / 2} y=${L + c / 2} text-anchor="middle" dominant-baseline="central" fill=${E} font-weight="700"
        font-size=${ca * l} font-family="system-ui, sans-serif">${b.text}</text>
    </g>`;
  })}`;
}
function _b(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Fi(t, qn / e.scale);
}
function Ab(t, e, n, i) {
  var r;
  const o = (r = i.bubbles) == null ? void 0 : r.call(i, e), s = o ? Mb(t, e, n, o, _b(e, i), i) : $;
  return s === $ ? $ : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : $}>${s}</g>`;
}
function Sb(t, e, n, i) {
  var x, M, k;
  const o = n.palette, s = t.invalid ? o.invalid : o.device, r = qn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, c = !i && ro(t.props.kind), p = c ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, h = i || (k = n.live) == null ? void 0 : k.call(n, t), d = (h == null ? void 0 : h.look) === "on" || (h == null ? void 0 : h.look) === "active", f = c && !!n.containerState && !p || (h == null ? void 0 : h.look) === "no-data", m = t.props.kind, v = !d || t.invalid ? s : m === "leak_sensor" ? Bi : m === "motion_sensor" ? o.motionCone : s, w = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (f ? " no-data" : ""), b = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Fi(t, r));
  return _`
    <g class=${w} data-id=${t.id} opacity=${b} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${o.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${K}></circle>` : $}
      ${t.props.kind === "equipment" ? $b(t, n, s, l, d, f ? la : void 0) : _`<g transform=${`rotate(${l})`}>${vb(
    t,
    r,
    v,
    d ? v : o.deviceFill,
    f ? la : void 0,
    d ? o.deviceFill : v,
    (h == null ? void 0 : h.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? yb(n.bindingStatus(t), n.scale, Fi(t, r)) : $}
      ${p ? xb(p, r, n) : $}
    </g>`;
}
function da(t, e, n, i) {
  const o = hd(t, e);
  if (o.length === 0) return $;
  const s = n.palette, r = e.invalid ? s.invalid : fo(e.props.kind) === "motion" ? s.motionCone : s.cone, l = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, a = o.map(me).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${K}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${K}></path>`;
}
function Lb(t, e, n, i) {
  const o = hd(t, e);
  let s = 0;
  for (const c of o) for (const p of c) s = Math.max(s, Math.hypot(p.x - n.pt.x, p.y - n.pt.y));
  s === 0 && (s = qn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : $;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${s}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${o.length ? _`<path class="light-fill" d=${o.map(me).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${s} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Cb(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return $;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), o = i ? $s(t, i, e.scale) : null;
  if (!o) return $;
  const s = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : $}>
    <line x1=${o.from.x} y1=${o.from.y} x2=${o.to.x} y2=${o.to.y} stroke=${s} stroke-width="2" vector-effect=${K}></line>
    <circle class="aim-knob" cx=${o.to.x} cy=${o.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${s}
      stroke-width="2" vector-effect=${K} style="cursor:grab"></circle>
  </g>`;
}
function Ib(t, e) {
  const n = [];
  for (const i of t.devices) {
    const o = ue(t, i);
    o && n.push({ d: i, pose: o, preview: !1 });
  }
  if (e.preview) {
    const i = { id: fb, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, o = ue(t, i);
    o && n.push({ d: i, pose: o, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return $;
    if (e.live && !i.preview) {
      const o = e.live(i.d).look, s = i.d.props.kind;
      return s === "ceiling_light" || s === "wall_light" ? o === "on" ? Lb(t, i.d, i.pose, e) : $ : s === "motion_sensor" && o === "active" ? da(t, i.d, e, !1) : $;
    }
    return da(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Sb(i.d, i.pose, e, i.preview))}</g>
    ${Cb(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? $ : Ab(t, i.d, i.pose, e))}</g>` : $}`;
}
const ha = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Ir = (t) => ha[t % ha.length], kt = "non-scaling-stroke", Eb = "0.55", Ob = /* @__PURE__ */ new WeakMap();
function Db(t, e, n, i) {
  const o = i.palette, s = Ir(n), r = i.selectedId === e.id, l = He(Ob, t, uu).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${me(re(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : s}
        fill-opacity=${e.invalid ? $ : "0.16"} stroke=${s} stroke-width="1.5" vector-effect=${kt}
        opacity=${i.selectedId !== null && !r ? Eb : $}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? o.invalid : o.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${o.zoneLabel}>${ud(or(t, e))}</tspan>
      </text>` : $}
    </g>`;
}
function Nb(t, e) {
  const n = e.palette, i = t.zones.map((s, r) => ({ z: s, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: s, i: r }) => _`
      <path class="zone" data-id=${s.id} d=${me(re(t, s))} fill="none" stroke=${Ir(r)} stroke-width="1"
        vector-effect=${kt}></path>`)}</g>`;
  const o = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${o} height=${o} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${o} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: s, i: r }) => Db(t, s, r, e))}</g>`;
}
function Pb(t, e, n) {
  const i = n.palette, o = 14 / n.scale;
  return _`<g class="zone-members">${Re(t, e).map(({ device: s, participates: r }) => {
    const l = ue(t, s);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${kt}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${kt}></circle>` : $;
  })}</g>`;
}
function Tb(t, e, n) {
  if (e.shape.kind !== "polygon") return $;
  const i = n.palette, o = e.shape.vertices;
  return _`${re(t, e).map((s, r) => {
    const l = o[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${s.x} cy=${s.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${kt}></circle>`;
  })}`;
}
function Vb(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${kt}></polyline>`;
}
function Hb(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${me(re(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${kt}></path>` : $}
    ${n ? Pb(t, n.id, e) : $}
    ${n ? Tb(t, n, e) : $}
    ${e.draft ? Vb(e.draft, e) : $}</g>`;
}
function wt(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const zb = /* @__PURE__ */ new WeakMap(), Rb = /* @__PURE__ */ new WeakMap(), pd = /* @__PURE__ */ new WeakMap();
function Lo(t, e, n) {
  const i = se(t.dir), o = R(t.a, P(t.dir, e)), s = R(t.a, P(t.dir, n));
  return [R(o, P(i, t.leftOff)), R(s, P(i, t.leftOff)), D(s, P(i, t.rightOff)), D(o, P(i, t.rightOff))];
}
function Rn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = le(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const ee = "non-scaling-stroke";
function Bb(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, o = 5 / e.scale, s = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = Rn(t, l.id);
    if (!a) continue;
    const c = se(a.dir);
    for (const [p, h, d] of [[l.a, a.a, a.dir], [l.b, a.b, P(a.dir, -1)]]) {
      const f = t.nodes.find((k) => k.id === p);
      if (!f || f.host || n.get(p) !== 1) continue;
      const m = R(h, P(c, a.leftOff + i)), v = D(h, P(c, a.rightOff + i)), w = P(c, 1), b = P(R(m, v), 0.5), y = R(D(b, P(w, -s)), P(d, o / 2)), x = D(D(b, P(w, s)), P(d, o / 2)), M = [m, y, x, v];
      r.push(_`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${ee}></path>`);
    }
  }
  return r.length ? _`${r}` : $;
}
function Fb(t, e, n) {
  const i = se(t.dir), o = (e.swing ?? "left") === "left", s = o ? i : P(i, -1), r = o ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = R(R(t.a, P(t.dir, l)), P(s, r)), p = R(R(t.a, P(t.dir, a)), P(s, r)), h = R(c, P(s, e.width)), d = pe(D(h, c), D(p, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>
    <path d=${`M${h.x} ${h.y}A${e.width} ${e.width} 0 0 ${d} ${p.x} ${p.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${ee}></path>`;
}
function Ub(t, e, n) {
  const i = se(t.dir), o = t.leftOff + t.rightOff, s = [t.leftOff - o / 3, t.leftOff - 2 * o / 3].map((r) => {
    const l = R(R(t.a, P(t.dir, e.offset)), P(i, r)), a = R(R(t.a, P(t.dir, e.offset + e.width)), P(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>`;
  });
  return _`${s}`;
}
function Wb(t, e, n) {
  const i = Rn(t, e.wallId);
  if (!i) return $;
  const o = n.palette, s = e.invalid ? o.invalid : e.kind === "window" ? o.window : o.door, r = Lo(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${me(r)} fill=${e.invalid ? o.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Fb(i, e, s) : e.kind === "window" ? Ub(i, e, s) : $}
    </g>`;
}
function pa(t, e, n, i, o) {
  const s = o.palette.dim, r = 6 / o.scale, l = R(t, P(n, i)), a = R(e, P(n, i)), c = (h, d) => {
    const f = R(d, P(n, i + r));
    return _`<line x1=${h.x} y1=${h.y} x2=${f.x} y2=${f.y} stroke=${s} stroke-width="0.75" vector-effect=${ee}></line>`;
  }, p = R(P(R(l, a), 0.5), P(n, 9 / o.scale));
  return _`
    <g class="dim">
      ${c(R(t, P(n, 2 / o.scale)), t)}${c(R(e, P(n, 2 / o.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${s} stroke-width="1" vector-effect=${ee}></line>
      <text x=${p.x} y=${p.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / o.scale}
        fill=${s} font-family="system-ui, sans-serif">${wt(z(t, e))}</text>
    </g>`;
}
function jb(t, e) {
  const n = e.selection;
  if (!n) return $;
  const i = e.palette, o = 4 / e.scale, s = (r) => _`<circle cx=${r.x} cy=${r.y} r=${o} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? s(r) : $;
  }
  if (n.kind === "wall") {
    const r = He(pd, t, uo).get(n.id), l = Rn(t, n.id);
    if (!r || !l) return $;
    const a = se(l.dir);
    return _`
      <path d=${me(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${s(l.a)}${s(l.b)}
      ${pa(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((d) => d.id === n.id), l = r ? Rn(t, r.wallId) : null;
    if (!r || !l) return $;
    const a = P(se(l.dir), -1), c = l.rightOff + 18 / e.scale, p = (d) => R(l.a, P(l.dir, d)), h = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${me(Lo(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${h.filter(([d, f]) => f - d >= 1).map(([d, f]) => pa(p(d), p(f), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${me(re(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${ee}></path>` : $;
  }
  return $;
}
function qb(t, e, n) {
  return z(t, e) < 1e-6 ? null : Lo(Oc(t, e, n.thickness, n.baseline), 0, z(t, e));
}
function Zb(t, e) {
  const { preview: n, palette: i } = e, o = 1e7, s = n.orthoFrom, r = n.opening, l = r ? Rn(t, r.wallId) : null;
  return _`
    ${s ? _`<path d=${`M${s.x - o} ${s.y}H${s.x + o}M${s.x} ${s.y - o}V${s.y + o}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${ee}></path>` : $}
    ${(n.walls ?? []).map((a) => {
    const c = qb(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${me(c)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${ee}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${me(Lo(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${Kb(t, e)}`;
}
function Gb(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${ee}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${ee}></rect></g>`;
}
function Kb(t, e) {
  const n = e.preview, i = e.palette, o = n.anchor ? Gb(n.anchor, e) : $, s = n.snap;
  if (!s || s.kind === "none") return o;
  const r = (f) => f / e.scale, { x: l, y: a } = s.pt, c = { stroke: i.background, width: "3" };
  let p, h = $;
  if (s.kind === "node" || s.kind === "corner") {
    const f = r(5);
    p = _`<g class=${s.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - f} y=${a - f} width=${2 * f} height=${2 * f} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${ee}></rect></g>`;
  } else if (s.kind === "mid") {
    const f = r(11) / Math.sqrt(3), m = `M${l} ${a - f}L${l + f * 0.866} ${a + f / 2}L${l - f * 0.866} ${a + f / 2}Z`;
    p = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "zoneVertex") {
    const f = r(7), m = `M${l} ${a - f}L${l + f} ${a}L${l} ${a + f}L${l - f} ${a}Z`;
    p = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${ee}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "wall" || s.kind === "zoneEdge") {
    const f = r(5), m = `M${l - f} ${a - f}L${l + f} ${a + f}M${l - f} ${a + f}L${l + f} ${a - f}`;
    p = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${ee}></path></g>`;
    const v = s.endpoint.kind === "wall" ? He(pd, t, uo).get(s.endpoint.wallId) : void 0;
    v && (h = _`<path class="snap-wall-hl" d=${me(v)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${ee}></path>`);
  } else {
    const f = r(4), m = `M${l - f} ${a}H${l + f}M${l} ${a - f}V${a + f}`;
    p = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${ee}></path></g>`;
  }
  const d = u(`snapmark.${s.kind}`);
  return _`
    ${h}${o}${p}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${ee} font-family="system-ui, sans-serif">${d}</text>`;
}
function Xb(t, e) {
  var d;
  const n = e.preview.level ?? t, i = e.palette, o = He(zb, n, (f) => Tc(f, !0)), s = n.walls.filter((f) => f.type === "railing" || f.type === "fence"), r = s.length ? He(Rb, n, Js) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? $ : String(i.dimOpacity), p = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, h = e.mode ?? "plan";
  return _`
    ${Nb(n, { palette: i, scale: e.scale, selectedId: p, mode: h === "automation" ? "plan" : h })}
    <path class="walls" d=${o.map((f) => f.map(me).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? _`<g class="railings" opacity=${c}>${s.flatMap((f) => (r.get(f.id) ?? []).map((m) => _`<path d=${me(m)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${c}>${n.openings.map((f) => Wb(n, f, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Bb(n, e)}</g>
    ${a ? Hb(n, {
    palette: i,
    scale: e.scale,
    selectedId: p,
    draft: e.preview.zoneDraft,
    vertex: ((d = e.preview.zoneVertex) == null ? void 0 : d.zoneId) === p ? e.preview.zoneVertex.index : null
  }) : $}
    <g class="devices-layer">${a ? $ : Ib(n, {
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
    <g class="selection">${jb(n, e)}</g>
    <g class="preview">${Zb(n, e)}</g>`;
}
const Yb = {
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
}, Qb = {
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
function Jb(t) {
  return t ? Yb : Qb;
}
const Ls = 1, fa = 1e-6;
function ew(t, e, n, i, o) {
  const s = (a) => a > fa && a < o - fa, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = co(t, a).host.offset;
    s(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some((v) => v === e.a || v === e.b || r.has(v))) continue;
    const c = ne(t, a.a), p = ne(t, a.b), h = z(c, p), d = h === 0 ? null : Ve(n, i, c, D(p, c));
    if (!d) continue;
    const f = ao(d, c, p) * h;
    if (f < -Ls || f > h + Ls) continue;
    const m = G(D(d, n), i);
    s(m) && l.push({ t: m, wall: a, pt: d });
  }
  return l;
}
function ma(t, e) {
  let n;
  for (const i of t) {
    const o = Math.abs(i.t - e), s = n ? Math.abs(n.t - e) : 1 / 0;
    (o < s || o === s && "nodeId" in i) && (n = i);
  }
  return n;
}
function ga(t, e) {
  if ("nodeId" in e)
    return delete co(t, e.nodeId).host, e.nodeId;
  for (const s of [e.wall.a, e.wall.b]) if (z(ne(t, s), e.pt) <= Ls) return s;
  const { pt: n, offset: i } = go(t, e.wall, e.pt), o = { id: oe(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(o), o.id;
}
function tw(t, e, n) {
  const i = t.walls.find((b) => b.id === e);
  if (!i) return t;
  const o = ne(t, i.a), s = ne(t, i.b), r = z(o, s), l = lo(D(s, o)), a = G(D(n, o), l), c = ew(t, i, o, l, r), p = ma(c.filter((b) => b.t < a), a), h = ma(c.filter((b) => b.t > a), a);
  if (!p && !h) return fr(t, e);
  const d = Be(t), f = d.walls.find((b) => b.id === e);
  let m = e, v = 0;
  if (h) {
    const b = ga(d, h);
    if (v = G(D(ne(d, b), o), l), p) {
      const y = { ...f, id: oe(), a: b };
      d.walls.push(y), m = y.id;
    } else
      f.a = b;
  }
  p && (f.b = ga(d, p));
  const w = (b, y) => b.wallId !== e || p && y <= p.t ? !0 : !h || y < h.t ? !1 : (b.wallId = m, b.offset -= v, !0);
  d.openings = d.openings.filter((b) => w(b, b.offset + b.width / 2)), d.devices = d.devices.filter((b) => b.placement.mode !== "wall" || w(b.placement, b.placement.offset));
  for (const b of d.nodes) b.host && !w(b.host, b.host.offset) && delete b.host;
  for (const b of d.zones) {
    const y = b.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : lr(x)));
  }
  return bo(d), Xe(d, t);
}
function nw(t, e, n) {
  return e.some((i, o) => xe(t, i, e[(o + 1) % e.length]) <= n);
}
function Er(t, e, n) {
  const i = uo(t);
  for (const [o, s] of i) if ($t(e, s)) return o;
  for (const [o, s] of i) if (nw(e, s, n)) return o;
  return null;
}
function iw(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const o = le(t, i);
    if (o.len < 1e-9) continue;
    const { t: s, side: r } = Ge(o, e);
    if (s >= n.offset && s <= n.offset + n.width && r >= -o.rightOff && r <= o.leftOff) return n.id;
  }
  return null;
}
function ow(t, e, n, i) {
  const o = iw(t, e);
  if (o) return { kind: "opening", id: o };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && z(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const s = Er(t, e, n);
  return s ? { kind: "wall", id: s } : null;
}
const sw = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => re(t, n)).filter((n) => n.length >= 3);
function fd(t, e, n, i, o) {
  if (n.alt) {
    const l = n.shift && i ? _r(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const s = yt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: sw(e, o), corners: Dc(e) }), r = s.endpoint;
  if (s.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if (s.kind === "corner" && s.corner) {
    const l = s.corner, a = _t(e, l.wallId), c = a !== null && l.offset >= -Di && l.offset <= a + Di, p = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, h = c ? En(e, l.wallId, l.side, p) : null;
    if (h) return { vertex: { kind: "wall", wallId: l.wallId, offset: p, side: l.side, x: h.x, y: h.y }, snap: s };
  }
  if ((s.kind === "mid" || s.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = Ge(le(e, l), n.pt).side >= 0 ? "left" : "right", c = En(e, l.id, a, r.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...s, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function md(t, e, n) {
  const i = [];
  for (const o of t.zones) {
    const s = re(t, o);
    if (s.length < 3) continue;
    (s.some((l, a) => xe(e, l, s[(a + 1) % s.length]) <= n) || St(s, e)) && i.push({ id: o.id, area: Math.abs(ze(s)) });
  }
  return i.sort((o, s) => o.area - s.area || (o.id < s.id ? -1 : o.id > s.id ? 1 : 0)), i.map((o) => o.id);
}
function gd(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: re(t, n), v: n.shape.vertices } : null;
}
function rw(t, e, n, i) {
  var r;
  const o = (r = gd(t, e)) == null ? void 0 : r.o;
  if (!o) return null;
  let s = -1;
  return o.forEach((l, a) => {
    z(n, l) <= i && (s < 0 || z(n, l) < z(n, o[s])) && (s = a);
  }), s < 0 ? null : { index: s, from: o[(s + o.length - 1) % o.length] };
}
function lw(t, e, n, i) {
  const o = gd(t, e);
  if (!o || o.o.some((w) => z(n, w) <= i)) return null;
  const { o: s, v: r } = o;
  let l = -1, a = 1 / 0;
  if (s.forEach((w, b) => {
    const y = xe(n, w, s[(b + 1) % s.length]);
    y <= i && y < a && (l = b, a = y);
  }), l < 0) return null;
  const c = s[l], p = s[(l + 1) % s.length], h = Math.max(0, Math.min(1, ao(n, c, p))), d = Lc(c, p, h), f = r[l], m = r[(l + 1) % r.length], v = f.kind === "wall" && m.kind === "wall" && f.wallId === m.wallId && f.side === m.side ? { kind: "wall", wallId: f.wallId, side: f.side, offset: f.offset + h * (m.offset - f.offset), x: d.x, y: d.y } : { kind: "free", x: Math.round(d.x), y: Math.round(d.y) };
  return { index: l + 1, vertex: v };
}
function aw(t, e) {
  let n = null, i = null, o = null, s = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, p = null, h = [];
  const d = () => {
    const w = t.selection();
    return (w == null ? void 0 : w.kind) === "zone" ? w.id : null;
  }, f = () => {
    i = null, o = null, s = null, r = null, l = !1, a = !1;
  }, m = () => p && p.zoneId === d() ? p : null;
  function v(w) {
    if (!i || !o || !a && z(w.pt, c) <= Ao / t.scale()) return;
    a = !0;
    const b = fd(t, o, w, i.from, i.zoneId);
    r = b.snap, l = w.shift, s = $f(o, i.zoneId, i.index, b.vertex);
  }
  return {
    note() {
      h = [h[h.length - 1] ?? null, t.selection()];
    },
    press(w) {
      f(), p = null, c = w.pt;
      const b = d(), y = t.level(), x = b === null ? null : rw(y, b, w.pt, t.tolMm());
      return b === null || !x ? !1 : (i = { zoneId: b, ...x }, o = s = y, !0);
    },
    pick(w) {
      const b = md(t.level(), w, t.tolMm());
      if (b.length === 0) {
        n = null, e(null);
        return;
      }
      const y = d(), x = y !== null && n !== null && z(w, n) <= t.tolMm() ? b.indexOf(y) : -1;
      n = w, e({ kind: "zone", id: b[(x + 1) % b.length] });
    },
    forget() {
      n = null;
    },
    active: () => i !== null,
    move(w) {
      v(w);
    },
    up(w) {
      if (!i) return;
      v(w);
      const b = s, y = o, x = a, M = i;
      f(), x ? b && y && b !== y && t.commit(b) : p = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(w) {
      const b = h[0];
      if ((b == null ? void 0 : b.kind) !== "zone") return;
      const y = t.level(), x = lw(y, b.id, w.pt, t.tolMm());
      if (!x) return;
      const M = yf(y, b.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(b), n = null);
    },
    key(w) {
      if (w === "Escape" && i)
        return f(), !0;
      const b = m();
      if (w === "Escape" && b)
        return p = null, !0;
      if ((w === "Delete" || w === "Backspace") && b) {
        const y = t.level(), x = xf(y, b.zoneId, b.index);
        return x === y ? (t.notify(u("zones.minVertices")), !0) : (p = null, t.commit(x), !0);
      }
      return !1;
    },
    preview() {
      if (i && s) {
        const b = { level: s };
        return r && (b.snap = r), l && (b.orthoFrom = i.from), b;
      }
      const w = m();
      return w ? { zoneVertex: w } : {};
    },
    cancel() {
      f(), p = null, n = null;
    }
  };
}
function cw(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 }, r = null;
  const l = (f) => {
    t.select(f);
  }, a = () => {
    e = null, n = null, i = null, r = null, o = !1;
  }, c = aw(t, l), p = (f) => f.kind === "none" ? { x: Math.round(f.pt.x), y: Math.round(f.pt.y) } : f.pt, h = (f, m, v) => Ge(le(f, f.walls.find((w) => w.id === m)), v).t;
  function d(f) {
    const m = e;
    if (!(!m || !n) && !(f.pt.x === s.x && f.pt.y === s.y))
      if (o = !0, m.kind === "node") {
        const v = yt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [m.nodeId]
        }), w = v.endpoint, b = (v.kind === "wall" || v.kind === "mid") && w.kind === "wall", y = v.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = n.nodes.find((E) => E.id === m.nodeId), M = !!x.host && b && w.kind === "wall" && w.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const E = structuredClone(n);
          delete E.nodes.find((A) => A.id === m.nodeId).host, k = E;
        }
        let L = Lf(k, m.nodeId, p(v));
        if (y && w.kind === "node")
          L = Of(L, m.nodeId, w.nodeId);
        else if (b && w.kind === "wall" && !M) {
          const E = n.walls.find((A) => A.id === w.wallId);
          if (E && E.a !== m.nodeId && E.b !== m.nodeId) {
            const A = structuredClone(L);
            A.nodes.find((O) => O.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, L = Xe(A, L);
          }
        }
        i = L;
      } else if (m.kind === "wall") {
        const v = n.walls.find((y) => y.id === m.wallId), w = yt(n, f.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: f.shift,
          excludeNodeIds: [v.a, v.b]
        }), b = D(w.pt, m.origin);
        i = If(
          n,
          m.wallId,
          w.kind === "none" ? { x: Math.round(b.x), y: Math.round(b.y) } : b
        );
      } else {
        const v = n.openings.find((w) => w.id === m.openingId);
        i = Uc(n, v.id, h(n, v.wallId, f.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(f) {
      a(), s = f.pt, c.note();
      const m = t.level(), v = f.ctrl ? Er(m, f.pt, t.tolMm()) : null;
      if (v) {
        l(null), t.commit(tw(m, v, f.pt));
        return;
      }
      if (c.press(f)) return;
      const w = t.selection(), b = ow(m, f.pt, t.tolMm(), w);
      if (!b) {
        c.pick(f.pt);
        return;
      }
      if (c.forget(), l(b), r = n = i = m, b.kind === "node") {
        let y = b.id;
        const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
        if (f.alt && x) {
          const M = Ef(m, x.id, x.a === b.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: ne(n, y) };
      } else if (b.kind === "wall")
        e = { kind: "wall", wallId: b.id, origin: f.pt };
      else if (b.kind === "opening") {
        const y = m.openings.find((x) => x.id === b.id);
        e = { kind: "opening", openingId: y.id, grab: h(m, y.wallId, f.pt) - y.offset };
      }
    },
    move(f) {
      c.active() ? c.move(f) : d(f);
    },
    up(f) {
      if (c.active()) {
        c.up(f);
        return;
      }
      e && d(f);
      const m = o, v = i, w = r;
      a(), m && v && w && v !== w && t.commit(v);
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
function bd() {
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
function uw(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = bd(), o = () => {
    e = null, i.clear();
  }, s = (c) => yt(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = zn(i.first, { min: 1 }), p = zn(i.second, { min: 1 });
      return c === null || p === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? p : -p) };
    }
    return s(n).pt;
  }
  const l = (c, p) => Math.abs(c.x - p.x) < 1 || Math.abs(c.y - p.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const p = Sf(t.level(), e, c, t.wallProps(), t.boxMeasure());
    p !== t.level() && (t.commit(p), o());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !e) {
        e = s(c.pt).pt;
        return;
      }
      const p = r();
      p && a(p);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return e ? i.key(c, () => {
        const p = r();
        p && a(p);
      }, o) : !1;
    },
    preview() {
      if (!e) return { snap: s(n) };
      const c = r(), p = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : s(n)
      };
      if (!c || l(e, c)) return p;
      const h = t.wallProps(), d = $u(e, c, h.thickness, t.boxMeasure());
      return d && (p.walls = d.map((f, m) => ({ a: f, b: d[(m + 1) % 4], props: { ...h, baseline: "center" } }))), p;
    },
    cancel() {
      o();
    }
  };
}
const ba = (t) => Math.round(t * 1e3) / 1e3 + 0;
function dw(t) {
  let e = null, n = null, i = null, o = { x: 0, y: 0 }, s = !1, r = null;
  const l = bd(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (d, f) => yt(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: f && n !== null });
  function p() {
    if (!n) return null;
    const d = c(o, s), f = zn(l.first, { min: 1 }), m = zn(l.second);
    if (f === null && m === null) return { pt: d.pt, endpoint: d.endpoint, snap: d };
    const v = f ?? z(n, d.pt);
    let w = d.pt;
    if (m === null && z(n, d.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const b = s1(n, w, v), y = { x: ba(b.x), y: ba(b.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: d } : { pt: y, endpoint: { kind: "free", pt: y }, snap: d };
  }
  function h() {
    const d = p();
    if (!e || !d) return;
    const f = Af(t.level(), e, d.endpoint, t.wallProps());
    if (f.wallId === null || f.endNodeId === null) return;
    t.commit(f.level);
    const m = f.level.walls.find((x) => x.id === f.wallId);
    i === null && (i = m.a);
    const v = f.endNodeId === i, w = n, b = ne(f.level, f.endNodeId), y = z(w, b);
    if (y > 0 && (r = { x: (b.x - w.x) / y, y: (b.y - w.y) / y }), l.clear(), v) {
      a();
      return;
    }
    e = { kind: "node", nodeId: f.endNodeId }, n = ne(f.level, f.endNodeId);
  }
  return {
    id: "wall",
    down(d) {
      if (o = d.pt, s = d.shift, !e) {
        const f = c(d.pt, !1);
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
      if (!n) return { snap: yt(t.level(), o, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
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
function hw(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function o() {
    if (!n) return null;
    const s = t.level(), r = Er(s, n, t.tolMm());
    if (!r) return null;
    const l = le(s, s.walls.find((c) => c.id === r)), a = Ge(l, n).t;
    return { wallId: r, center: a, pt: R(l.a, P(l.dir, a)) };
  }
  return {
    id: e,
    down(s) {
      n = s.pt;
      const r = o();
      if (!r) return;
      const l = i(), a = Dp(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: s.wallId, offset: l, width: r, kind: e, invalid: !ho(t.level(), s.wallId, l, r) },
        snap: { pt: s.pt, kind: "wall", endpoint: { kind: "wall", wallId: s.wallId, offset: s.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const wa = 3, pw = 1, Pe = (t) => ({ x: t.x, y: t.y });
function fw(t) {
  let e = [], n = null, i = !1, o = null, s = !1;
  const r = () => e.length ? Pe(e[e.length - 1]) : void 0;
  function l(h) {
    const d = e.length;
    if (d === 0) return !1;
    const f = e.map(Pe);
    if (z(f[d - 1], h) <= pw) return !0;
    if (d >= 2) {
      const m = D(f[d - 1], f[d - 2]), v = D(h, f[d - 1]);
      if (Math.abs(pe(m, v)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(v.x, v.y) && G(m, v) < 0) return !0;
    }
    for (let m = 0; m + 2 < d; m++) if (sr(f[d - 1], h, f[m], f[m + 1])) return !0;
    return !1;
  }
  function a(h) {
    if (e.length < wa) return null;
    const d = t.tolMm(), f = Pe(e[0]), m = Pe(e[e.length - 1]);
    return z(h, f) <= d ? f : z(h, m) <= d ? m : null;
  }
  function c() {
    var f;
    if (e.length < wa || Ni(e.map(Pe))) return !1;
    const h = t.level(), d = wf(h, e, t.zoneName());
    return d.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? d.level : ur(d.level, d.zoneId, !1)), (f = t.zonePlaced) == null || f.call(t), t.select({ kind: "zone", id: d.zoneId }), !0);
  }
  const p = (h) => fd(t, t.level(), h, r());
  return {
    id: "zone",
    down(h) {
      if (a(h.pt)) {
        c();
        return;
      }
      const d = p(h).vertex;
      l(Pe(d)) || (e = [...e, d], n = Pe(d), i = !1);
    },
    move(h) {
      s = h.shift;
      const d = a(h.pt);
      if (d) {
        n = d, o = null, i = Ni(e.map(Pe));
        return;
      }
      const f = p(h);
      o = f.snap, n = Pe(f.vertex), i = l(n);
    },
    up() {
    },
    key(h) {
      return h === "Enter" ? c() : h === "Backspace" || h === "Delete" || h === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : h === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const h = {};
      e.length > 0 && (h.zoneDraft = { points: e.map(Pe), cursor: n, invalid: i }), o && (h.snap = o);
      const d = r();
      return s && d && (h.orthoFrom = d), h;
    },
    cancel() {
      e = [], n = null, i = !1, o = null, s = !1;
    }
  };
}
function mw(t) {
  return t.zoneMethod() === "polygon" ? fw(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = bf(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(u("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : ur(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const va = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, gw = (t, e, n) => n === void 0 || va(t, n) !== va(e, n);
function bw(t, e, n, i) {
  const o = e.placement;
  if (o.mode === "free" && n) return D(n, i);
  if (o.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const s = En(t, o.wallId, o.side, o.offset);
  return s ? D(s, i) : { x: 0, y: 0 };
}
function ww(t) {
  let e = null, n = null;
  const i = ed(t);
  let o = null, s = null, r = !1, l = { x: 0, y: 0 };
  const a = (d) => {
    e = d, t.select(d);
  }, c = () => {
    n = null, o = null, s = null, r = !1;
  };
  function p(d) {
    if (!n || !o || !r && z(d.pt, l) <= Ao / t.scale()) return;
    if (r = !0, d.pt.x === l.x && d.pt.y === l.y) {
      s = o;
      return;
    }
    const f = o.devices.find((k) => k.id === n.id);
    if (!f || f.placement.mode === "none") return;
    const m = d.shift ? _r(l, d.pt) : d.pt, v = f.placement, w = v.mode === "free" ? null : ue(o, f), b = v.mode === "free" ? v.rotation : w ? tr(Math.round(qe(w.dir))) : 0, y = R(m, n.grab), x = nd(t, o, f.props.kind, y, b, Ar(f.props.kind, v.mode)), M = x && x.mode === "wall" && v.mode === "wall" && v.aim !== void 0 ? { ...x, aim: v.aim } : x;
    s = M ? Ei(o, f.id, nr(o, f.props, h(o, f.placement, M, m, y), t.tolMm())) : o;
  }
  function h(d, f, m, v, w) {
    if (f.mode !== "wall" || m.mode !== "wall" || m.wallId !== f.wallId) return m;
    const b = d.walls.find((E) => E.id === f.wallId);
    if (!b) return m;
    const y = le(d, b), x = Math.max(0, Math.min(y.len, f.offset + G(D(v, l), y.dir))), M = Ge(y, w).side, k = t.tolMm(), L = f.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: L };
  }
  return {
    id: "device-select",
    down(d) {
      c(), l = d.pt;
      const f = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, d)) return;
      const v = ru(f, d.pt, m);
      if (!v) {
        a(null);
        return;
      }
      a({ kind: "device", id: v });
      const w = f.devices.find((y) => y.id === v), b = ue(f, w);
      o = s = f, n = { id: v, grab: bw(f, w, (b == null ? void 0 : b.pt) ?? null, d.pt) };
    },
    move(d) {
      i.active() ? i.move(d) : p(d);
    },
    up(d) {
      if (i.end(d)) return;
      n && p(d);
      const f = s, m = o, v = r, w = n == null ? void 0 : n.id;
      c(), v && f && m && f !== m && gw(m, f, w) && t.commit(f);
    },
    key(d) {
      return d === "Escape" && i.cancel() ? !0 : d === "Escape" && n ? (c(), !0) : !1;
    },
    preview() {
      const d = i.working();
      return d ? { level: d } : n && s ? { level: s } : {};
    },
    cancel() {
      i.cancel(), c(), a(null);
    }
  };
}
function vw(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = ru(t.level(), e.pt, t.tolMm());
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
const Cs = 40, $w = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function yw(t, e, n, i) {
  const o = t.blocks.find((f) => f.id === e);
  if ((o == null ? void 0 : o.kind) !== "bus") return t;
  const s = o.w >= o.h, r = s ? o.x : o.y, l = s ? o.w : o.h, a = Pn(s ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - Cs) : r, p = n === "end" ? Math.max(a, r + Cs) : r + l;
  if (c === r && p === r + l) return t;
  const h = s ? { x: c, w: p - c } : { y: c, h: p - c }, d = (f) => "bus" in f && f.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + f.at * l - c) / (p - c))) } : f;
  return {
    ...t,
    blocks: t.blocks.map((f) => f.id === e ? { ...f, ...h } : f),
    wires: t.wires.map((f) => {
      const m = d(f.from), v = d(f.to);
      return m === f.from && v === f.to ? f : { ...f, from: m, to: v };
    })
  };
}
function xw(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, o = !1;
  };
  function l(p, h) {
    const d = _s(p, h, t.tolMm(), t.geo());
    return (d == null ? void 0 : d.kind) === "port" ? { block: d.block, port: d.port } : (d == null ? void 0 : d.kind) === "bus" ? { bus: d.id, at: d.at } : (d == null ? void 0 : d.kind) === "bus-end" ? { bus: d.id, at: d.end === "start" ? 0 : 1 } : null;
  }
  function a(p) {
    const h = e, d = n;
    if (!h || !d || !o && z(p.pt, s) <= Ao / t.scale()) return;
    if (o = !0, h.kind === "wire") {
      const w = l(d, p.pt);
      e = { ...h, to: p.pt, ok: !!w && !("error" in Fl(d, h.from, w, t.geo())) };
      return;
    }
    if (h.kind === "bus-end") {
      i = yw(d, h.id, h.end, p.pt);
      return;
    }
    const f = d.blocks.find((w) => w.id === (h.kind === "pin" ? h.from.block : h.id));
    if (!f) return;
    if (h.kind === "pin") {
      i = qf(d, f.id, h.from.port, lm(Oe(f, t.geo(), d), p.pt));
      return;
    }
    const m = Pn(f.x + p.pt.x - s.x), v = Pn(f.y + p.pt.y - s.y);
    i = m === f.x && v === f.y ? d : Uf(d, f.id, m, v);
  }
  function c(p, h, d) {
    const f = l(p, d);
    if (!f) return;
    const m = Fl(p, h, f, t.geo());
    if ("error" in m) {
      t.notify(u(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(p) {
      r(), s = p.pt;
      const h = t.power(), d = _s(h, p.pt, t.tolMm(), t.geo());
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
        if ($w(h, f)) {
          e = { kind: "pin", from: f };
          return;
        }
        const m = h.blocks.find((w) => w.id === d.block), v = xo(h, m, t.geo()).find((w) => w.name === d.port).pt;
        e = { kind: "wire", from: f, at: v, to: v, ok: !1 };
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
        h.kind === "wire" ? c(d, h.from, p.pt) : f && f !== d && t.commitPower(f);
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
function kw(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let o;
      if (n === "device") {
        const p = t.placeDeviceId();
        if (!p) {
          t.notify(u("power.pickDevice"));
          return;
        }
        o = p;
      }
      const s = t.power(), r = Ff(n, { x: 0, y: 0 }, s, o), l = Oe(r, t.geo(), Rl(s, r)), a = { ...r, x: Pn(i.pt.x - l.w / 2), y: Pn(i.pt.y - l.h / 2) };
      t.commitPower(Rl(s, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function Mw(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = md(t.level(), e.pt, t.tolMm())[0];
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
const _w = ["select", "box", "wall", "door", "window", "opening", "zone"], Aw = [
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
], Sw = ["binding-select"], Lw = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Cw = ["zone-pick"], wd = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, Iw = {
  plan: _w,
  equipment: Aw,
  binding: Sw,
  power: Lw,
  automation: Cw
};
function Or(t) {
  return Iw[t];
}
function Is(t, e) {
  switch (t) {
    case "select":
      return cw(e);
    case "box":
      return uw(e);
    case "wall":
      return dw(e);
    case "door":
    case "window":
    case "opening":
      return hw(e, t);
    case "zone":
      return mw(e);
    case "device-select":
      return ww(e);
    case "binding-select":
      return vw(e);
    case "power-select":
      return xw(e);
    case "zone-pick":
      return Mw(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return kw(e, t);
    default:
      return a1(e, t);
  }
}
function Qo(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((o) => o.id === e.id) : e.kind === "powerWire" ? n.wires.some((o) => o.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((o) => o.id === e.id);
}
const Ew = {
  select: en,
  box: jm,
  wall: qm,
  door: km,
  window: Xm,
  opening: Mm,
  zone: Hm,
  "device-select": en,
  ceiling_light: wm,
  wall_light: Zm,
  motion_sensor: Bu,
  illuminance_sensor: bm,
  climate_sensor: zm,
  wall_switch: Ru,
  smart_button: Lm,
  valve: Um,
  leak_sensor: Wu,
  socket: Fu,
  virtual_switch: Fm,
  speaker: Vm,
  phone: vm,
  exhaust_fan: zu,
  equipment: ql,
  "binding-select": en,
  "zone-pick": en,
  "power-select": en,
  "power-device": ql,
  "power-bus": Nm,
  "power-battery": gm,
  "power-pv": Uu,
  "power-transfer": Tm,
  "power-remainder": $m
}, vd = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${Ew[t]}></path>`}</svg>`;
function Ow(t) {
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
function Dw(t) {
  return g`
    <div class="top"><div class="bar">
      ${t.lead ?? $}
      ${t.plans.length > 1 ? g`
        <select class="plan-pick" aria-label=${u("plan.pick")} title=${u("plan.pick")}
          ?disabled=${t.saveState === "saving"} .value=${Q(t.planId)}
          @change=${(e) => {
    const n = e.target, i = n.value;
    n.value = t.planId, i !== t.planId && t.onPickPlan(i);
  }}>
          ${t.plans.map((e) => g`<option value=${e.id} ?selected=${e.id === t.planId}>${e.name}</option>`)}
        </select>` : $}
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
        ${Ow(t)}${t.saveState === "error" && t.errorMessage ? g`: ${t.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${u("action.save")}</button>
    </div>${t.steps}</div>`;
}
const Nw = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function $d(t, e, n) {
  return Or(t).map((i) => {
    const o = t === "plan" ? wd[i] : void 0, s = u(`tool.${i}`);
    return g`
      ${Nw.includes(i) ? g`<div class="tool-sep"></div>` : $}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${o ?? $}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${o ?? $}
        title=${o ? `${s} (${o})` : s} @click=${() => n(i)}>
        ${vd(i)}<span class="tlabel">${s}</span></button>`;
  });
}
function Pw(t, e, n) {
  return g`<div class="tools">${$d(t, e, n)}</div>`;
}
const ni = ["plan", "equipment", "binding", "power", "automation"], on = (t, e, n) => u(t === 1 ? e : n).replace("{n}", String(t));
function Tw(t, e, n, i, o = 0) {
  const { walls: s, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((p) => p.invalid).length, c = a ? `, ${u("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${on(s.length, "steps.wall", "steps.walls")}, ${on(r.length, "steps.zone", "steps.zones")}${c}`,
        done: s.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: on(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Gs(l.map(n));
      return {
        text: u("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: on(i.blocks.length, "steps.block", "steps.blocks"), done: Jf(i) };
    case "automation":
      return { text: on(o, "steps.rule", "steps.rules"), done: o > 0 };
  }
}
const $a = (t, e) => u(t).replace("{step}", u(`mode.${e}`));
function Vw(t) {
  const e = ni.indexOf(t.mode), n = ni[e - 1], i = ni[e + 1];
  return g`
    <nav class="steps" aria-label=${u("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Q(t.planName)} aria-label=${u("plan.name")} title=${u("plan.name")}
          @change=${(o) => t.onRename(o.target.value)} />
        <span class="app">${u("steps.app")}</span>
      </div>
      ${ni.map((o, s) => {
    const r = Tw(o, t.level, t.status, t.power, t.rules), l = o === t.mode;
    return g`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${o}
          aria-current=${l ? "step" : $} @click=${() => t.onMode(o)}>
          <span class="n">${s + 1}</span><span class="name">${u(`mode.${o}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${$a("steps.back", n)}</button>` : $}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${$a("steps.next", i)}</button>` : $}
      </div>
    </nav>`;
}
const Hw = ["unbound", "bound", "all"], zw = /* @__PURE__ */ new WeakMap(), gn = (t) => t.placement.mode === "none";
function yd(t) {
  return He(zw, t, (e) => [...e.devices].sort((n, i) => Number(gn(n)) - Number(gn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Rw(t, e, n) {
  const i = yd(t), o = e === null ? -1 : i.findIndex((s) => s.id === e);
  for (let s = 1; s <= i.length; s++) {
    const r = i[(o + s) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const xd = (t) => u(`device.${t.props.kind}`), ya = (t) => t.props.kind === "equipment" ? Sr(t) : xd(t), Bw = (t, e) => t === "all" || t === "bound" == (e === "bound");
function Fw(t, e, n) {
  return e === 0 ? u("binding.noDevices") : n || t.filter === "all" ? u("binding.noMatch") : u(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function xa(t) {
  const e = u(t.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function Uw(t) {
  var l;
  if (t.collapsed) return g`<div class="blist collapsed">${xa(t)}</div>`;
  const e = yd(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Gs(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), o = e.filter(({ d: a, st: c }) => Bw(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || xd(a).toLowerCase().includes(i) || ya(a).toLowerCase().includes(i))), s = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const p = zh(a);
    return g`<button class="brow${a.id === s ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${u(`bindstatus.${c}`)} title=${u(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${ya(a)}</small></span>
      <span class="cnt">${p.filled}/${p.total}</span>
    </button>`;
  };
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${u("binding.show")}>
          ${Hw.map((a) => g`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${u(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${xa(t)}
      </div>
      <input class="list-search" type="search" placeholder=${u("binding.search")} aria-label=${u("binding.search")}
        .value=${Q(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${o.length === 0 ? g`<p class="empty">${Fw(t, e.length, i)}</p>` : g`
          ${o.filter((a) => !gn(a.d)).map((a) => r(a.d, a.st))}
          ${o.some((a) => gn(a.d)) ? g`<div class="bgroup" data-group="unplaced">
            <h5>${u("devices.unplaced")}</h5>
            ${o.filter((a) => gn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : $}`}
      </div>
    </div>`;
}
function Ww() {
  return {
    door: { width: mi.door, hinge: "start", swing: "left" },
    window: { width: mi.window, outside: "left" },
    opening: { width: mi.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function jw(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function kd(t) {
  return qs(u("zones.default"), t.zones.map((e) => e.name));
}
const qw = (t) => t === "door" || t === "window" || t === "opening";
function Zw(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return $;
  const n = t.tool, i = e[n].width, o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return g`
    <h4>${u(`props.next.${n}`)}</h4>
    ${H(`${u("props.width")}, ${u("unit.mm")}`, Ye({
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
      ${H(u("props.hinge"), ae(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && s({ hinge: r });
    },
    "next-hinge"
  ))}
      ${H(u("props.swing"), ae(e.door.swing, o, (r) => {
    r !== e.door.swing && s({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? H(u("props.outside"), ae(
    e.window.outside,
    o,
    (r) => {
      r !== e.window.outside && s({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class Gw {
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
const Es = (t) => typeof t == "object" && t !== null && !Array.isArray(t), bn = (t) => typeof t == "string" && t ? t : null, ka = (t) => typeof t == "number" && Number.isFinite(t), Os = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Md(t) {
  return t.switchesMigrated || !t.devices.some(Os) ? t : { ...t, switchesMigrated: !0 };
}
function Kw(t, e, n) {
  const i = Zc(t, n);
  let o = i.level;
  const s = Es(e.switch) ? e.switch : {}, r = [["power", bn(e.power)], ["voltage", bn(e.voltage)], ["control", bn(s.entity)]];
  for (const [l, a] of r) a && (o = oo(o, i.id, l, a));
  return s.controllable === !0 && (o = po(o, i.id, !0)), { level: o, id: i.id };
}
function Xw(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Es(i) && Array.isArray(i.blocks)) {
    let o = 0, s = !1;
    const r = i.blocks.map((l) => {
      if (!Es(l)) return l;
      if (l.kind === "meter" && bn(l.id) && ka(l.x) && ka(l.y)) {
        o++;
        const a = Kw(e, l, bn(l.name) ?? `Meter ${o}`);
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
        const { inverter: a, ...c } = l;
        return a === !0 && typeof l.deviceId == "string" && (e = Xc(e, l.deviceId, !0)), s = !0, c;
      }
      return l;
    });
    s && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Os)) {
    for (const o of t.level.devices) Os(o) && (e = po(e, o.id, !0));
    e = Md(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
const Ui = 3600;
function Fe(t) {
  return { id: oe(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const Yw = (t, e) => [...t, e], Qw = (t, e) => t.map((n) => n.id === e.id ? e : n), Jw = (t, e) => t.filter((n) => n.id !== e);
function ev(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const tv = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, Dr = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).filter((n) => typeof n == "object" && n !== null && !lt(n) && !Se(n));
}, nv = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).flatMap((n) => typeof n == "object" && n !== null && Se(n) && typeof n.event == "object" && n.event !== null && typeof n.event.rule == "string" ? [n.event.rule] : []);
}, Wi = (t) => [...[...t.inputs, ...Dr(t), ...t.gate ? [t.gate] : []].flatMap(tv), ...nv(t)];
function Nr(t) {
  return t.motionLight ? ["auto", "manual"] : t.boiler ? ["auto", "manual", "done"] : [];
}
const _d = (t, e) => `${t}: ${u(`control.event.${e}`)}`, Ad = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, iv = (t, e) => t.filter((n) => n.id !== e && Wi(n).includes(e));
function ov(t, e) {
  const n = new Map(t.map((s) => [s.id, s]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), o = (s, r) => {
    if (s === e.id && r.length > 0) return r;
    if (r.includes(s) || i.has(s)) return null;
    const l = n.get(s);
    if (!l) return null;
    for (const a of Wi(l)) {
      const c = o(a, [...r, s]);
      if (c) return c;
    }
    return i.add(s), null;
  };
  for (const s of Wi(e)) {
    const r = o(s, [e.id]);
    if (r) return r;
  }
  return null;
}
const ji = /^([01]\d|2[0-3]):[0-5]\d$/, Mt = (t) => typeof t == "number" && Number.isFinite(t);
function sv(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return Mt(e.below) && e.below > 0 && Mt(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && ji.test(n) && ji.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const Ma = (t) => Number.isInteger(t) && t >= 0 && t <= Ui;
function rv(t, e, n, i, o, s, r, l, a, c, p, h, d, f, m, v, w, b, y, x, M, k, L, E) {
  var q;
  const A = [];
  e.name.trim() || A.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && !e.motionLight && A.push("inputs");
  const O = e.control, U = (Array.isArray(O == null ? void 0 : O.sources) ? O.sources : []).filter((N) => typeof N == "object" && N !== null && lt(N)).map((N) => N.button), S = O ? [O.on, O.off, O.toggle].flatMap((N) => Array.isArray(N) ? N : []) : [], I = [...e.inputs, ...Dr(e), ...e.gate ? [e.gate] : []], T = [...I.flatMap(Ad), ...e.onTrue.map((N) => N.device), ...e.onFalse.map((N) => N.device)], V = I.flatMap((N) => "light" in N.source ? [N.source.light] : "daylight" in N.source ? [N.source.daylight] : []);
  (T.some((N) => !n(N)) || V.some((N) => !(o ?? n)(N)) || e.vent && [e.vent.sensor, e.vent.than].some((N) => !(s ?? n)(N)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((N) => !(p ?? n)(N)) || e.leak.valves.some((N) => !(h ?? n)(N))) || e.timed && (!(d ?? n)(e.timed.button) || !(f ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(o ?? n)(e.outside.sensor)) || e.beurer && (!(v ?? n)(e.beurer.heater) || !(w ?? n)(e.beurer.source)) || e.motionLight && (!(x ?? n)(e.motionLight.light) || e.motionLight.sensors.some((N) => !(M ?? n)(N)) || e.motionLight.buttons.some((N) => !(k ?? n)(N)) || e.motionLight.daylight && !(o ?? n)(e.motionLight.daylight.sensor) || e.motionLight.blocker && !(E ?? n)(e.motionLight.blocker.device)) || U.some((N) => !(b ?? n)(N)) || S.some((N) => !(y ?? n)(N.device))) && A.push("device-missing");
  const F = new Set(t.map((N) => N.id));
  Wi(e).some((N) => N !== e.id && !F.has(N)) && A.push("rule-missing"), ov(t, e) && A.push("cycle"), (!Ma(e.onDelay) || !Ma(e.offDelay)) && A.push("delay");
  for (const N of I) {
    const be = sv(N);
    be && !A.includes(be) && A.push(be);
  }
  return e.vent && av(e, e.vent) && A.push("vent"), e.boiler && Nv(e, e.boiler) && A.push("boiler"), e.leak && cv(e, e.leak) && A.push("leak"), e.timed && pv(e, e.timed) && A.push("timed"), e.outside && gv(e, e.outside) && A.push("outside"), e.beurer && bv(e, e.beurer) && A.push("beurer"), e.control && kv(e, e.control, t) && A.push("control"), e.motionLight && Iv(e, e.motionLight) && A.push("motionLight"), L && lv(e, L) && A.push("virtual-read"), [...e.onTrue, ...e.onFalse, ...S].some((N) => typeof N == "object" && N !== null && ye(N.do) && $v(N)) && A.push("announce"), (q = e.boiler) != null && q.button && c && !A.includes("device-missing") && !c(e.boiler.button) && A.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((N) => {
    const be = i(N.device);
    return be !== void 0 && !be.includes(N.do);
  }) && A.push("action"), O && S.some((N) => !wv.includes(N.do) || i && !vv(N.do, i(N.device))) && A.push("action"), A;
}
function lv(t, e) {
  const n = new Set(t.inputs.flatMap((i) => "device" in i.source ? [i.source.device] : []));
  return [...t.onTrue, ...t.onFalse].some((i) => e(i.device) && n.has(i.device));
}
function av(t, e) {
  if (t.inputs.length > 0 || t.motionLight || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !Mt(e.above) || !Mt(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function cv(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((o) => typeof o == "string" && o !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const uv = (t) => t.leak !== void 0;
function dv(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const o = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), s = o ? Re(o, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: s.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: s.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const hv = 15;
function pv(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const fv = (t) => t.timed !== void 0, mv = 30;
function gv(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && ji.test(n) && ji.test(i) && n !== i);
}
const ii = { above: 200, offDelay: 60, keep: 10, every: 30 };
function bv(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !Mt(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
const wv = ["on", "off", "toggle", "close", "say", "play", "notify"];
function wn(t) {
  const e = te(t), n = e.filter(ye);
  return n.length > 0 ? n : e.includes("on") && e.includes("off") ? ["on", "off", "toggle"] : e.includes("close") ? ["close"] : [];
}
const vv = (t, e) => e === void 0 || (ye(t) ? e.includes(t) : t === "close" ? e.includes("close") : e.includes("on") && e.includes("off")), _a = (t) => typeof t == "string" && t.trim() !== "";
function $v(t) {
  const e = t, n = t.do === "play" ? "media" : "text", i = t.do === "notify" ? "title" : null;
  return !_a(e[n]) || Object.keys(e).some((o) => o !== "device" && o !== "do" && o !== n && o !== i) || i !== null && i in e && !_a(e[i]);
}
const yv = (t) => ye(t.do) ? `${t.device}|${t.do}` : t.device;
function xv(t, e) {
  if (typeof t != "object" || t === null || Object.keys(t).length !== 1) return !1;
  const n = t.event;
  if (typeof n != "object" || n === null || Object.keys(n).sort().join() !== "rule,what") return !1;
  const { rule: i, what: o } = n;
  if (typeof i != "string" || i === "" || typeof o != "string" || o === "") return !1;
  const s = e.find((r) => r.id === i);
  return s === void 0 || Nr(s).includes(o);
}
function Sd(t, e) {
  const n = (i, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).sort(([s], [r]) => s < r ? -1 : 1)) : o;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function kv(t, e, n) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.motionLight || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const i = [e.on, e.off, e.toggle];
  if (!Array.isArray(e.sources) || e.sources.length === 0 || !i.every(Array.isArray) || i.every((l) => l.length === 0)) return !0;
  const o = (l) => typeof l == "object" && l !== null && (Se(l) ? xv(l, n) : lt(l) ? typeof l.button == "string" && l.button !== "" : typeof l.source == "object" && l.source !== null);
  if (!e.sources.every(o) || e.sources.some((l, a) => e.sources.some((c, p) => p < a && Sd(l, c)))) return !0;
  const s = (l) => l.every((a) => typeof a == "object" && a !== null && typeof a.device == "string" && a.device !== "") && new Set(l.map(yv)).size === l.length;
  if (!i.every(s)) return !0;
  const r = new Set(Dr(t).flatMap(Ad));
  return i.some((l) => l.some((a) => !ye(a.do) && r.has(a.device)));
}
const Aa = (t) => t.control !== void 0;
function Mv(t, e, n) {
  var d, f;
  const i = Fe(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const o = e === null ? void 0 : t.levels.find((m) => m.zones.some((v) => v.id === e)), s = o ? Re(o, e).filter((m) => m.participates).map((m) => m.device) : [], r = s.filter((m) => m.props.kind === "wall_switch" || m.props.kind === "smart_button"), l = s.filter((m) => {
    const v = te(m);
    return v.includes("on") && v.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, c = l.length === 1 ? l[0] : void 0, p = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((d = a.bindings) != null && d.state) && a.bindings.state === ((f = c == null ? void 0 : c.bindings) == null ? void 0 : f.control), h = (m) => c && !p ? [{ device: c.id, do: m }] : [];
  return i.control = { sources: a ? [a.props.kind === "smart_button" ? { button: a.id } : { source: { device: a.id } }] : [], on: h("on"), off: h("off"), toggle: h("toggle") }, i;
}
function _v(t, e) {
  const n = t.control;
  if (!n || "on" in n || !Array.isArray(n.sources) || !Array.isArray(n.loads) || ![...n.sources, ...n.loads].every((r) => typeof r == "string")) return t;
  const i = n.loads, o = (r) => i.map((l) => ({ device: l, do: r })), s = n.sources.map((r) => e(r) === "smart_button" ? { button: r } : { source: { device: r } });
  return { ...t, control: { sources: s, on: o("on"), off: o("off"), toggle: o("toggle") } };
}
const Av = (t) => t.beurer !== void 0;
function Sv(t, e) {
  const n = Fe(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = ii.offDelay, n.beurer = { heater: "", source: "", above: ii.above, keep: ii.keep, every: ii.every }, n;
}
const Lv = (t) => t.outside !== void 0;
function Cv(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), r = (o ? Re(o, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && te(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: mv }, i;
}
const oi = { offDelay: 180, minOn: 0, autoAfter: 0, is: "dark" };
function Iv(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (o) => Array.isArray(o) && o.every((s) => typeof s == "string" && s !== "") && new Set(o).size === o.length;
  if (typeof e.light != "string" || e.light === "" || !n(e.sensors) || !n(e.buttons) || e.sensors.includes(e.light) || e.buttons.includes(e.light) || e.daylight !== void 0 && (typeof e.daylight != "object" || e.daylight === null || typeof e.daylight.sensor != "string" || e.daylight.sensor === "" || e.daylight.is !== "night" && e.daylight.is !== "dark")) return !0;
  const i = e.blocker;
  return i !== void 0 && (typeof i != "object" || i === null || typeof i.device != "string" || i.device === "" || i.device === e.light || i.is !== "on" && i.is !== "off") ? !0 : !Number.isInteger(e.minOn) || e.minOn < 0 || e.minOn > 3600 || !Number.isInteger(e.autoAfter) || e.autoAfter < 0 || e.autoAfter > 1440;
}
const Sa = (t) => {
  const e = te(t);
  return e.includes("on") && e.includes("off");
}, Ev = (t) => t.motionLight !== void 0, La = (t) => {
  var e;
  return t.props.kind === "smart_button" || t.props.kind === "wall_switch" && !!((e = t.bindings) != null && e.state);
};
function Ov(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Light motion control ${n}` : "Light motion control", i.offDelay = oi.offDelay;
  const o = e === null ? void 0 : t.levels.find((c) => c.zones.some((p) => p.id === e)), s = o ? Re(o, e).filter((c) => c.participates).map((c) => c.device) : [], r = s.filter((c) => (c.props.kind === "ceiling_light" || c.props.kind === "wall_light") && te(c).includes("on") && te(c).includes("off")), l = t.levels.flatMap((c) => c.devices).filter((c) => c.props.kind === "illuminance_sensor"), a = r.length === 1 ? r[0] : void 0;
  return i.motionLight = {
    light: a ? a.id : "",
    sensors: s.filter((c) => c.props.kind === "motion_sensor").map((c) => c.id),
    ...l.length === 1 ? { daylight: { sensor: l[0].id, is: oi.is } } : {},
    minOn: oi.minOn,
    buttons: s.filter((c) => {
      var p, h;
      return c.props.kind === "smart_button" || !!((p = a == null ? void 0 : a.bindings) != null && p.control) && c.props.kind === "wall_switch" && ((h = c.bindings) == null ? void 0 : h.state) === a.bindings.control;
    }).map((c) => c.id),
    autoAfter: oi.autoAfter
  }, i;
}
function Dv(t, e, n) {
  const i = Fe(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Re(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = s.filter((a) => {
    const c = te(a);
    return c.includes("on") && c.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: hv }, i;
}
function Nv(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !Mt(n.limit) || !Mt(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const Pv = (t) => t.boiler !== void 0, Ds = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function Ld(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Cd = 3e3, Id = 1400;
function Tv(t, e, n) {
  var c;
  const i = Fe(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const o = e === null ? void 0 : t.levels.find((p) => p.zones.some((h) => h.id === e)), s = o ? Re(o, e).filter((p) => p.participates).map((p) => p.device) : [], r = s.filter(Ds), l = s.filter((p) => p.props.kind === "wall_switch" || p.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((c = t.power) == null ? void 0 : c.blocks) ?? []).filter((p) => p.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Cd, nominal: Id }), i;
}
const Vv = (t) => t.vent !== void 0, Hv = 600;
function zv(t, e, n) {
  var l;
  const i = Fe(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = Hv;
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Re(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = s.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const Rv = 1800;
function Bv(t, e, n, i) {
  const o = Fe(e);
  return o.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", o.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Rv } } }], o;
}
const Fv = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve", "virtual_switch"]), Jo = (t) => Fv.has(t.props.kind);
function te(t) {
  var n;
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "speaker" ? (n = t.bindings) != null && n.voice ? ["say", "play"] : ["play"] : e.kind === "phone" ? e.notify ? ["notify"] : [] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" || e.kind === "virtual_switch" ? ["on", "off"] : [];
}
const xi = (t, e) => Sd(Ca(t), Ca(e));
function Ca(t) {
  if (!t.motionLight || t.motionLight.neighbours === void 0) return t;
  const { neighbours: e, ...n } = t.motionLight;
  return { ...t, motionLight: n };
}
const si = 100;
function Uv(t, e, n) {
  const i = t.walls.find((p) => p.id === e);
  if (!i) return null;
  let o;
  try {
    o = le(t, i);
  } catch {
    return null;
  }
  const s = { x: o.a.x + o.dir.x * n, y: o.a.y + o.dir.y * n }, r = se(o.dir), l = { x: s.x + r.x * (o.leftOff + si), y: s.y + r.y * (o.leftOff + si) }, a = { x: s.x - r.x * (o.rightOff + si), y: s.y - r.y * (o.rightOff + si) }, c = (p) => t.zones.filter((h) => St(re(t, h), p));
  return [c(l), c(a)];
}
const he = 1;
function Wv(t, e) {
  return t.walls.some((n) => {
    let i;
    try {
      i = le(t, n);
    } catch {
      return !1;
    }
    const { t: o, side: s } = Ge(i, e);
    return o >= -he && o <= i.len + he && s >= -i.rightOff - he && s <= i.leftOff + he;
  });
}
const ri = (t, e) => $t(e, t) && !t.some((n, i) => xe(e, n, t[(i + 1) % t.length]) <= he);
function jv(t, e) {
  if (t.some((i) => ri(e, i)) || e.some((i) => ri(t, i)) || ri(e, ys(t)) || ri(t, ys(e))) return !0;
  const n = (i, o, s, r) => {
    const l = (a, c, p) => (c.x - a.x) * (p.y - a.y) - (c.y - a.y) * (p.x - a.x);
    return l(s, r, i) * l(s, r, o) < -he * he && l(i, o, s) * l(i, o, r) < -he * he;
  };
  return t.some((i, o) => e.some((s, r) => n(i, t[(o + 1) % t.length], s, e[(r + 1) % e.length])));
}
function qv(t, e, n) {
  for (let i = 0; i < e.length; i++) {
    const o = e[i], s = e[(i + 1) % e.length], r = z(o, s);
    if (r < he) continue;
    const l = D(s, o);
    for (let a = 0; a < n.length; a++) {
      const c = n[a], p = n[(a + 1) % n.length];
      if (xe(c, o, s) > he && xe(p, o, s) > he && !sr(o, s, c, p)) continue;
      const h = (b) => Math.abs((b.x - o.x) * l.y - (b.y - o.y) * l.x) / r;
      if (h(c) > he || h(p) > he) continue;
      const d = G(D(c, o), l) / r, f = G(D(p, o), l) / r, m = Math.max(0, Math.min(d, f)), v = Math.min(r, Math.max(d, f));
      if (v - m <= he) continue;
      const w = m + (v - m) / 2;
      if (!Wv(t, { x: o.x + l.x / r * w, y: o.y + l.y / r * w })) return !0;
    }
  }
  return !1;
}
function Zv(t, e, n) {
  if (!t.zones.some((l) => l.id === e)) return [];
  const i = /* @__PURE__ */ new Set();
  for (const l of t.openings) {
    if (l.invalid || l.kind === "window") continue;
    const a = Uv(t, l.wallId, l.offset + l.width / 2);
    if (!a) continue;
    const [c, p] = a, h = (d, f) => {
      if (d.some((m) => m.id === e))
        for (const m of f) m.id !== e && i.add(m.id);
    };
    h(c, p), h(p, c);
  }
  const o = t.zones.find((l) => l.id === e), s = re(t, o);
  if (s.length >= 3)
    for (const l of t.zones) {
      const a = re(t, l);
      l.id !== e && a.length >= 3 && (jv(s, a) || qv(t, s, a)) && i.add(l.id);
    }
  const r = [];
  for (const l of t.zones) {
    if (!i.has(l.id)) continue;
    const a = Re(t, l.id).filter((c) => c.participates && c.device.props.kind === "motion_sensor" && !n.includes(c.device.id)).map((c) => c.device);
    a.length > 0 && r.push({ zone: l, sensors: a });
  }
  return r;
}
function Ed(t, e, n) {
  const i = e === null ? void 0 : t.find((o) => o.zones.some((s) => s.id === e));
  return i ? Zv(i, e, n) : [];
}
const Gv = (t) => [...new Set(t.flatMap((e) => e.sensors.map((n) => n.id)))].sort();
function Kv(t, e) {
  let n = !1;
  const i = t.map((o) => {
    const s = o.motionLight;
    if (!s) return o;
    const { neighbours: r, ...l } = s, a = s.presence === !0 ? Gv(Ed(e, o.zoneId, s.sensors)) : void 0;
    return (a === void 0 ? r === void 0 : r !== void 0 && r.length === a.length && r.every((c, p) => c === a[p])) ? o : (n = !0, { ...o, motionLight: a === void 0 ? l : { ...l, neighbours: a } });
  });
  return n ? i : t;
}
class Xv {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await qo(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(ul(u("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(e.some((i) => i.id === n) ? n : e[0].id);
        }
      } catch (e) {
        this.h.loadError = Ee(e);
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
    const n = await Rg(this.h.hass, e);
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
        this.h.plans = await qo(this.h.hass);
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
      this.h.notice = Ee(n);
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
    this.h.toolId = Or(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(ul(u("plan.default"))), this.offerDraft(null);
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
            await Fg(this.h.hass, e.id);
          } catch (s) {
            this.h.save.state = "error", this.h.save.errorMessage = Ee(s);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await qo(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const o = i.find((s) => s.id !== e.id);
        if (o)
          try {
            await this.openPlan(o.id);
            return;
          } catch (s) {
            this.h.notice = Ee(s);
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
    this.h.plan = { ...e, levels: e.levels.map(ep) };
    const n = Xw({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = Qf(n.power, { device: (a) => n.level.devices.find((c) => c.id === a) }), o = new Map(this.h.plan.levels.flatMap((a) => a.devices.map((c) => [c.id, c.props.kind]))), s = (l = e.rules) == null ? void 0 : l.map((a) => _v(a, (c) => o.get(c))), r = e.rules && s && e.rules.length > 0 ? s.some((a, c) => a !== e.rules[c]) ? s : e.rules : void 0;
    this.h.history = new Gw({ level: n.level, ...i ? { power: i } : {}, ...r ? { rules: r } : {} }), this.h.lazyPower = _u(), this.h.activeTool.cancel(), this.h.activeTool = Is(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: o } = this.h.history.current, s = e.levels.map((p, h) => h === 0 ? Md(n) : p), { power: r, rules: l, ...a } = e, c = o ? Kv(o, s) : void 0;
    return { ...a, levels: s, ...i ? { power: i } : {}, ...c ? { rules: c } : {}, revision: this.h.save.baseRevision ?? 0 };
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
    const e = `${this.h.plan.name} ${u("plan.copySuffix")}`, n = this.h.plan.id, i = this.currentPlan(), o = await this.h.save.saveAsNew(i, e);
    o && this.keepSaved(i), o ? (this.h.plan = o, this.h.dialog = null, this.afterSaved(n, o.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Yv {
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
    !n || !Tf(n.states, e) ? this.base = { states: e, meta: Pf(e) } : n.states = e;
    const i = this.base.meta, o = this.merged;
    if (o && o.base === i && o.regs === this.regs) return o.meta;
    const s = this.regs ? Hf(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Vf(e).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = u("binding.registryError").replace("{error}", Ee(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const li = Mc("", "");
function Qv(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? li;
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
    openingDefaults: (e) => jw(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? kd(((e = t.history) == null ? void 0 : e.current.level) ?? li);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? li).devices;
      return { device: (i) => e.find((o) => o.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Ou(((n = t.history) == null ? void 0 : n.current.level) ?? li, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Ns = (t) => u(`zones.kind.${t.shape.kind}`), Pr = (t) => g`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? Sm : Wm}></path>`}</svg>`;
function Od(t, e) {
  const n = au(t, e);
  return n ? u(`zones.invalid.${n}`) : null;
}
function Jv(t) {
  var o;
  const e = t.query.trim().toLowerCase(), n = ((o = t.selection) == null ? void 0 : o.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((s, r) => ({ z: s, hue: Ir(r) })).filter(({ z: s }) => !e || s.name.toLowerCase().includes(e) || Ns(s).toLowerCase().includes(e));
  return g`
    <div class="zlist">
      <div class="zhead"><span>${u("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${u("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${u("zones.filter")}
        aria-label=${u("zones.filter")} .value=${Q(t.query)}
        @input=${(s) => t.onQuery(s.target.value)} />
      <div class="rows">
        ${i.map(({ z: s, hue: r }) => {
    var a;
    const l = s.invalid ? Od(t.level, s) ?? "" : null;
    return g`<button class="zrow${s.id === n ? " sel" : ""}" data-id=${s.id} @click=${() => t.onPick(s.id)}>
            ${l === null ? g`<span class="zswatch" style=${`background:${r}`}></span>` : g`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${s.name}</span>
            <span class="zkind" data-kind=${s.shape.kind} title=${Ns(s)}>${Pr(s.shape.kind)}</span>
            <span class="zarea">${((a = or(t.level, s)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
const Dd = (t, e, n) => g`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Cr(e)}
    @change=${(i) => n(i.target.checked)} />${u("zones.automation")}</label>`;
function e$(t, e, n) {
  const i = Re(t, e.id);
  return g`<div class="zmembers">
    <div class="zhead"><span>${u("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? g`<span>${u("zones.participates")}</span>` : $}</div>
    ${i.length === 0 ? g`<p class="muted">${u("zones.noMembers")}</p>` : i.map(({ device: o, participates: s }) => g`
      <label class="member" data-device=${o.id}>
        <span class="nm"><span class="name">${o.name}</span><small class="kind">${u(`device.${o.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${u("zones.participates")} .checked=${Cr(s)}
          @change=${(r) => {
    const l = bu(t, o.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function Ia(t, e, n) {
  const i = Od(t, e), o = e.shape.kind === "walls" && e.shape.broken;
  return g`<div class="zprops">
    <h4>${u("props.zone")}</h4>
    ${H(u("props.name"), g`<input class="val wide" type="text" data-field="zone-name" .value=${Q(e.name)}
      @change=${(s) => {
    const r = s.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(vf(t, e.id, l));
  }} />`)}
    ${H(u("props.area"), g`<span class="val ro" data-field="zone-area">${ud(or(t, e))}</span>`)}
    ${H(u("zones.outline"), g`<span class="val ro zkindval" data-field="zone-kind">${Pr(e.shape.kind)}${Ns(e)}</span>`)}
    ${Dd("zone-automation", e.automation !== !1, (s) => {
    const r = ur(t, e.id, s);
    r !== t && n(r);
  })}
    ${i ? g`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${o ? g`<button class="btn" data-action="keep-outline" @click=${() => n(kf(t, e.id))}>
        ${u("zones.keepOutline")}</button>` : $}</div>` : $}
    ${e$(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(gu(t, e.id))}>
      ${u("zones.delete")}</button>
  </div>`;
}
function t$(t) {
  const e = t.next.zone, n = e.name ?? kd(t.level), i = (o) => t.setNext({ ...t.next, zone: { ...e, ...o } });
  return g`
    <h4>${u("props.nextZone")}</h4>
    <div class="muted">${u("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${u("zones.method")}>
      ${["walls", "polygon"].map((o) => g`
        <button class=${e.method === o ? "on" : ""} role="radio" aria-checked=${String(e.method === o)} data-method=${o}
          @click=${() => {
    o !== e.method && t.onMethod(o);
  }}>${Pr(o)}<span>${u(`zones.kind.${o}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${u(`zones.hint.${e.method}`)}</p>
    ${H(u("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${Q(n)}
      @change=${(o) => {
    const s = o.target, r = s.value.trim();
    if (!r) {
      s.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Dd("next-zone-automation", e.automation, (o) => i({ automation: o }))}`;
}
function Nd(t, e, n) {
  return Ye({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Ea(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function n$(t, e) {
  const n = le(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], o = (s) => e.commit(Df(e.level, t.id, s));
  return g`
    <h4>${u("props.wall")}</h4>
    ${H(u("props.type"), ae(
    t.type,
    i.map((s) => ({ v: s, label: u(`walltype.${s}`) })),
    (s) => o({ type: s }),
    "wall-type"
  ))}
    ${H(u("props.thickness"), Nd(e, t.thickness, (s) => {
    o({ thickness: s });
  }))}
    ${H(u("props.baseline"), ae(
    t.baseline,
    ["center", "left", "right"].map((s) => ({ v: s, label: u(`baseline.${s}`) })),
    (s) => o({ baseline: s })
  ))}
    ${H(u("props.length"), g`<span class="val ro">${wt(n)} ${u("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(fr(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function i$(t, e) {
  const n = ["door", "window", "opening", ...Ci.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(Tp(e.level, t.id, r)), o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = Ci.includes(t.kind);
  return g`
    <h4>${u(`kind.${t.kind}`)}</h4>
    ${H(u("props.kind"), ae(t.kind, n.map((r) => ({ v: r, label: u(`kind.${r}`) })), (r) => i(Pp(t, r))))}
    ${H(u("props.width"), Nd(e, t.width, (r) => Ea(e, Np(e.level, t.id, r))))}
    ${H(u("props.offset"), Ye({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Ea(e, Uc(e.level, t.id, r))
  }))}
    ${s ? g`
      ${H(u("props.hinge"), ae(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${H(u("props.swing"), ae(t.swing ?? "left", o, (r) => i({ swing: r })))}` : $}
    ${t.kind === "window" ? H(u("props.outside"), ae(t.outside ?? "left", o, (r) => i({ outside: r }))) : $}
    ${H(u("props.passesLight"), g`<input type="checkbox" data-field="passesLight" .checked=${Q(zc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Hc(t.kind) ? void 0 : l });
  }} />`)}
    ${H(u("props.passesPir"), g`<input type="checkbox" data-field="passesPir" .checked=${Q(Bc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Rc(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? g`<p class="warn">${u("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(Wc(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function o$(t) {
  const e = ["bearing", "partition", "railing"];
  return g`
    <h4>${u("props.newWall")}</h4>
    ${H(u("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => g`<option value=${n} ?selected=${n === t.wallType}>${u(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${H(`${u("props.thickness")}, ${u("unit.mm")}`, Ye({
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
      <div class="muted">${u("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => g`
          <button class=${t.boxMeasure === n ? "on" : ""} aria-pressed=${String(t.boxMeasure === n)} data-measure=${n}
            @click=${() => t.setBoxMeasure(n)}>
            ${u(`measure.${n}`)}</button>`)}
      </div>` : $}`;
}
const Oa = (t) => Jv({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function s$(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const o = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((s) => s.id === n.id) : void 0;
    return g`<div class="props">
      ${t$({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
      ${o ? Ia(e, o, t.commit) : $}
      ${Oa(t)}
    </div>`;
  }
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const o = e.walls.find((s) => s.id === n.id);
    o && (i = n$(o, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const o = e.openings.find((s) => s.id === n.id);
    o && (i = i$(o, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const o = e.zones.find((s) => s.id === n.id);
    o && (i = Ia(e, o, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const o = e.nodes.find((s) => s.id === n.id);
    o && (i = g`<h4>${u("props.node")}</h4>
      ${H("X", g`<span class="val ro">${wt(o.x)}</span>`)}${H("Y", g`<span class="val ro">${wt(o.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === $ && (t.tool === "wall" || t.tool === "box") ? o$(t) : i === $ && qw(t.tool) ? Zw({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === $ && t.tool === "select" ? Oa(t) : i === $ ? g`<p class="muted">${u("props.none")}</p>` : i}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    </div>`;
}
const r$ = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, l$ = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, a$ = 6, c$ = ["A", "0", "B"], u$ = ["power", "control"], d$ = ["power", "power_in", "power_out", "voltage", "control"], qt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function sn(t, e, n, i) {
  const { [n]: o, ...s } = e, r = i === null ? s : { ...s, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function rn(t, e, n, i, o, s) {
  return g`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${xr(t.meta, i, !1)}
      .value=${o ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (o ?? null) && s(l);
  }}></ps-entity-combo>
  </div>`;
}
function h$(t, e) {
  const n = e.name ?? "";
  return H(u("props.name"), g`<input class="val wide" type="text" data-field="name"
    placeholder=${u(`power.kind.${e.kind}`)} .value=${Q(n)} @change=${(i) => {
    const o = i.target, s = o.value.trim();
    s && s !== n ? t.commitPower(Nn(t.power, e.id, { name: s }, qt(t))) : o.value = n;
  }} />`);
}
function p$(t, e) {
  const n = new Set(Le(e).map((i) => i.role));
  return g`${u$.filter((i) => n.has(i)).map((i) => {
    var s;
    const o = (s = e.bindings) == null ? void 0 : s[i];
    return g`<div class="role">
      <div class="role-head"><span class="role-label">${u(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${o ? g`<b>${$i(t.meta, o).name}</b><small>${o}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${u("power.boundHint")}</p>`;
}
function ai(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function f$(t, e) {
  var s;
  const n = Le(e), i = d$.flatMap((r) => n.filter((l) => l.role === r)), o = e.props;
  return g`
    ${Lr(e, (r) => ai(t, At(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return g`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Ri(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${xr(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Ri(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), ai(t, oo(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${o.kind === "equipment" && ((s = e.bindings) != null && s.control) ? xt(
    "controllable",
    u("props.controllable"),
    !!o.controllable,
    (r) => ai(t, po(t.level, e.id, r))
  ) : $}
    ${o.kind === "equipment" ? xt("inverter", u("props.inverter"), !!o.inverter, (r) => {
    const l = Iu(t.level, t.power, e.id, r);
    return ai(t, l.level, l.power);
  }) : $}`;
}
function m$(t, e) {
  const n = t.level.devices.find((o) => o.id === e.deviceId);
  if (!n) return g`<p class="warn" data-note="device-missing">${u("power.missing")}</p>`;
  const i = Kt(n) ? $ : xt("output", u("power.enableOutput"), e.output !== !1, (o) => {
    const s = qt(t);
    if (o) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower(vo(Nn(t.power, e.id, { output: !1 }, s), e.deviceId, s));
    return !0;
  });
  return n.props.kind === "equipment" ? g`${f$(t, n)}${i}` : g`
    ${H(u("props.name"), g`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${H(u("props.kind"), g`<span class="val ro">${u(`device.${n.props.kind}`)}</span>`)}${p$(t, n)}${i}`;
}
function g$(t, e) {
  var o, s;
  const n = (s = (o = t.frame) == null ? void 0 : o.blocks[e.id]) == null ? void 0 : s.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: u(`power.form.${r}`) }));
  return g`
    ${H(u("power.form"), ae(e.form, i, (r) => {
    r !== e.form && t.commitPower(Nn(t.power, e.id, { form: r }, qt(t)));
  }, "form"))}
    <div class="row"><span>${u("power.position")}</span><span class="seg pos">${c$.map((r) => g`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${u("power.positionHint")}</p>`;
}
function b$(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, o = n ? e.h : e.w, s = (a, c) => {
    if (a === i && c === o) return !1;
    t.commitPower(Nn(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, qt(t)));
  }, r = (a, c, p) => Ye({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: p }), l = ["h", "v"].map((a) => ({ v: a, label: u(`power.orientation.${a}`) }));
  return g`
    ${H(u("power.orientation"), ae(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(Nn(t.power, e.id, { w: e.h, h: e.w }, qt(t)));
  }, "bus-orientation"))}
    ${H(u("power.busLength"), r("bus-length", i, (a) => s(Math.max(Cs, o + 1, a), o)))}
    ${H(u("power.busThickness"), r("bus-thickness", o, (a) => s(i, Math.min(Math.max(a$, a), i - 1))))}`;
}
function w$(t, e) {
  switch (e.kind) {
    case "grid":
      return g`
      ${rn(t, "power", u("power.field.power"), bt, e.power, (n) => sn(t, e, "power", n))}
      ${rn(t, "voltage", u("power.field.voltage"), r$, e.voltage, (n) => sn(t, e, "voltage", n))}`;
    case "device":
      return m$(t, e);
    case "battery":
      return g`
      ${rn(t, "power", u("power.field.batteryPower"), bt, e.power, (n) => sn(t, e, "power", n))}
      ${rn(t, "soc", u("power.field.soc"), l$, e.soc, (n) => sn(t, e, "soc", n))}`;
    case "pv":
      return rn(t, "power", u("power.field.power"), bt, e.power, (n) => sn(t, e, "power", n));
    case "transfer":
      return g$(t, e);
    case "bus":
      return b$(t, e);
    default:
      return $;
  }
}
function v$(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((o) => o.id === e.deviceId) : void 0;
  return g`
    <h4>${i ? So(i) : u(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? $ : h$(t, e)}
    ${w$(t, e)}
    <div class="pactions">
      ${n ? g`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(Zf(t.power, e.id))}>${u("power.autoPorts")}</button>` : $}
      ${e.kind === "grid" ? $ : g`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Su(t.power, e.id))}>${u("action.delete")}</button>`}
    </div>`;
}
function $$(t, e) {
  var o, s;
  const n = qt(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? yo(l, n) || u(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return g`
    <h4>${u("power.wire")}</h4>
    ${H(u("power.wire.from"), g`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${H(u("power.wire.to"), g`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${H(u("power.wire.power"), g`<span class="val ro" data-field="wire-power">${_e((s = (o = t.frame) == null ? void 0 : o.wires[e.id]) == null ? void 0 : s.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Eu(t.power, e.id))}>${u("action.delete")}</button></div>`;
}
function y$(t) {
  const e = Ou(t.level, t.power);
  return g`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = id(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${u("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${u("power.help.device")}</p>
    ${e.length === 0 ? g`<p class="muted" data-note="no-devices">${u("power.noDevices")}</p>` : g`<div class="pdevs">
      ${e.map((i) => g`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${So(i)}</span>
      </button>`)}
    </div>`}`;
}
function x$(t) {
  if (t.toolId === "power-device") return y$(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((o) => o.id === e.id) : void 0;
  if (n) return v$(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((o) => o.id === e.id) : void 0;
  return i ? $$(t, i) : t.toolId !== "power-select" ? g`<p class="muted" data-note="power-hint">${u("power.help.place")}</p>` : g`<p class="muted" data-note="power-hint">${u("power.pick")}</p><p class="muted">${u("power.help.select")}</p>`;
}
function k$(t) {
  return g`<div class="props pprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.feedError ? g`<p class="note" data-notice="feed">${t.feedError}</p>` : $}
    ${x$(t)}
  </div>`;
}
const Da = /* @__PURE__ */ new Map([["not confirmed", "rules.error.notConfirmed"], ["virtual switch loop", "rules.error.virtualLoop"]]);
function M$(t) {
  var i;
  const e = t.reason !== void 0 ? Da.get(t.reason) : void 0, n = ((i = t.last) == null ? void 0 : i.error) !== void 0 ? Da.get(t.last.error) : void 0;
  return !e && !n ? t : { ...t, ...e ? { reason: u(e) } : {}, ...n && t.last ? { last: { ...t.last, error: u(n) } } : {} };
}
function _$(t) {
  return t.error === u("rules.error.notConfirmed");
}
const Pd = "ended: switched elsewhere";
function Zn(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
const A$ = {
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
function Td(t) {
  return A$[t.reason];
}
function Vd(t) {
  return t.sent === !1 && (t.reason === Pd || t.reason.startsWith("switched elsewhere"));
}
const Hd = 5e3, zd = 12;
function Na(t) {
  t().catch(() => {
  });
}
class S$ {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Na(n.unsub));
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
          Na(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ee(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= zd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Hd));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.rules ?? {}).map(([i, o]) => [i, M$(o)]);
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
function Tr(t, e = !1) {
  const n = e ? Td(t) : void 0;
  if (n) return u(`motionLight.row.${n}`).replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ve(t.at)).trim();
  if (Zn(t)) return u("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", ve(t.at)).trim();
  if (t.sent === !1)
    return u(Vd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", ve(t.at)).trim();
  const i = ye(t.action) ? `${t.target}: ${u(`rules.did.${t.action}`)} ${ve(t.at)}`.trim() : `${u(`rules.did.${t.action}`)} ${t.target} ${ve(t.at)}`.trim();
  return t.error ? `${i}: ${t.error}` : i;
}
function Vr(t) {
  return Zn(t) ? u("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", ve(t.at)) : u("vent.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", ve(t.at));
}
function L$(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${u("rules.status.error")}: ${e.reason}` : u(`rules.status.${e.status}`) : t.enabled === !1 ? u("rules.status.disabled") : n.live ? u("rules.unsaved") : u("rules.noTrace");
}
function C$(t, e, n) {
  const i = n.trace(t.id), o = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", s = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !xi(r, t);
  return g`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${o} role="img" aria-label=${u(`rules.verdict.${o}`)}
        title=${u(`rules.verdict.${o}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? g` <span class="orphan">(${u("rules.orphan")})</span>` : $}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${L$(t, i, n)}</span>
        ${l ? g`<span class="runsaved">${u("rules.unsavedChanges")}</span>` : $}
        ${s > 0 ? g`<span class="rwarn">${s === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(s))}</span>` : $}
        ${i != null && i.last ? g`<span class="rlast">${Tr(i.last, !!i.motionLight)}</span>` : $}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${u("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${u("rules.delete")}</button>
      </div>
    </div>`;
}
function I$(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((o) => o.id === e.id) ?? null : null, i = ev(t.rules, (n == null ? void 0 : n.id) ?? null, (o) => t.level.zones.some((s) => s.id === o));
  return g`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : u("rules.noZone")}</h4>
      ${t.feedError ? g`<p class="muted">${t.feedError}</p>` : $}
      ${n === null && i.length === 0 && t.rules.length === 0 ? g`<p class="muted">${u("rules.hint")}</p>` : $}
      ${i.length === 0 ? g`<p class="muted rempty">${u("rules.empty")}</p>` : i.map((o) => C$(o, n === null && o.zoneId !== null, t))}
    </div>`;
}
const Rd = {
  condition: ym,
  leak: Wu,
  timer: Rm,
  outside: Km,
  vent: zu,
  boiler: Gm,
  timed: Bm,
  beurer: Cm,
  control: Ru,
  motionLight: Bu
}, E$ = ["condition", "timer", "control"], O$ = ["vent", "boiler", "leak", "timed", "outside", "motionLight", "beurer"], Ps = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function D$(t, e, n) {
  return [
    ...E$.map((i) => g`
      <button class="tool" data-template=${i} title=${u(`rules.template.${i}`)} @click=${() => t(i)}>
        ${Ps(Rd[i])}<span class="tlabel">${u(`rules.template.${i}`)}</span></button>`),
    g`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${u("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${Ps(Pm)}<span class="tlabel">${u("rules.automations")}</span></button>`
  ];
}
function N$(t) {
  var s;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), o = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  o !== null && (t.preventDefault(), (s = n[o]) == null || s.focus());
}
function P$(t, e, n) {
  return g`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${u("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${N$}>
      ${O$.map((i) => g`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${Ps(Rd[i])}<span>${u(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function T$(t, e) {
  return t.mode === "automation" ? g`<div class="tools">${$d(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${D$((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? Pw(t.mode, t.toolId, (n) => t.pickTool(n)) : Uw({
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
function V$(t, e) {
  var i, o;
  const n = t.selection;
  return G1({
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
function H$(t, e) {
  if (t.mode === "binding") return V$(t, e);
  if (t.mode === "automation")
    return g`<div class="props">${I$({
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
    return k$({
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
  return t.mode === "equipment" ? M1({
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
  }) : s$({
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
function z$(t, e) {
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
function R$(t, e) {
  const n = t === "zone" ? `${u("tool.zone")} · ${u(`zones.kind.${e}`)}` : u(`tool.${t}`);
  return g`<span class="tool-chip">${vd(t)}${n}</span>`;
}
function B$(t) {
  return g`
    <div class="status">
      ${R$(t.tool, t.zoneMethod)}
      ${z$(t.tool, t.zoneMethod).map(([e, n]) => g`<span><span class="kbd">${e}</span> ${n}</span>`)}
      <span class="sp"></span>
      ${t.snap ? g`<span class="snap-kind">${t.snap}</span>` : ""}
      <span>${t.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${t.grid} @change=${(e) => t.onGrid(e.target.checked)} />
        ${u(t.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${t.power ? $ : g`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${t.cones}
          @change=${(e) => t.onCones(e.target.checked)} />
        ${u("status.cones")}
      </label>`}
    </div>`;
}
function F$(t, e) {
  var s, r;
  const n = e.palette, i = 1 / e.scale, o = [
    {
      label: u(e.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: t.first,
      live: ((s = e.live) == null ? void 0 : s.first) ?? "",
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
      ${o.map((l, a) => _`
        <text x="8" y=${19 + a * 22} font-size="11" fill=${n.muted}>${l.label}</text>
        <rect x="24" y=${7 + a * 22} width="118" height="17" rx="3" fill=${n.background}
          stroke=${l.active ? n.accent : "none"}></rect>
        <text x="136" y=${20 + a * 22} text-anchor="end" font-size="12"
          fill=${l.buf ? n.text : n.muted}>${l.buf ? `${l.buf} ${l.unit}` : l.live ? `${l.live} ${l.unit}` : "—"}</text>`)}
    </g>`;
}
function U$(t, e, n, i) {
  const o = t.walls;
  if (!o || o.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = o[0], p = Math.hypot(c.x - a.x, c.y - a.y);
    let h = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return h < 0 && (h += 360), { first: wt(p), second: h.toFixed(1) };
  }
  if (o.length < 2) return null;
  const s = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(o[0].b.x - o[0].a.x, o[0].b.y - o[0].a.y) + s, l = Math.hypot(o[1].b.x - o[1].a.x, o[1].b.y - o[1].a.y) + s;
  return { first: wt(r), second: wt(l) };
}
function W$(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const j$ = mc`
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
`, q$ = 5e-3, Z$ = 2, qi = (t) => Math.max(q$, Math.min(Z$, t));
function G$(t, e, n) {
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
function K$(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: qi(Math.min(e, n) / 12e3) };
  const i = t.map((h) => h.x), o = t.map((h) => h.y), s = 1500, r = Math.min(...i) - s, l = Math.max(...i) + s, a = Math.min(...o) - s, c = Math.max(...o) + s, p = qi(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / p / 2, y: (a + c) / 2 - n / p / 2, scale: p };
}
function X$(t, e, n, i, o) {
  const s = qi(Math.min(o, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / s / 2, y: t.y + t.h / 2 - n / s / 2, scale: s };
}
function Y$(t, e, n) {
  const i = qi(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function Q$(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Pa(t, e, n, i) {
  const o = n / t.scale, s = i / t.scale;
  return e.x >= t.x && e.x <= t.x + o && e.y >= t.y && e.y <= t.y + s ? t : { ...t, x: e.x - o / 2, y: e.y - s / 2 };
}
function J$(t, e, n, i, o = 1) {
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
const ey = ["Shift", "Control", "Alt", "Meta"], ty = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, ny = new Map(Object.entries(wd).map(([t, e]) => [`Key${e}`, t]));
function Ta(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class iy {
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
          this.h.view = Q$(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.hint.hide(), this.h.view = Y$(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (Ta(n) || !this.h.history) return;
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
      const s = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && s ? ny.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = ty[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || Ta(n), o = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const s = this.spacePending;
        this.spacePending = !1, s && !i && (this.h.activeTool.key(" ", o), this.h.requestUpdate());
        return;
      }
      i || !ey.includes(n.key) || (this.h.activeTool.key(n.key, o), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Bd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function oy(t) {
  return g`
    <div class="draft-banner" role="status">
      <span>${u("draft.banner").replace("{time}", Bd(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${u("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${u("draft.discard")}</button>
    </div>`;
}
function Et(t, e, n, i) {
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
function sy(t) {
  var n;
  const e = { action: "cancel", label: u("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? Et(u("draft.title"), u("draft.text").replace("{time}", Bd(i.savedAt)), [
        { action: "restore", label: u("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: u("draft.discard"), onClick: () => t.discard(i) }
      ]) : $;
    }
    case "new":
      return Et(u("new.title"), u("new.text"), [
        { action: "new-discard", label: u("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return Et(u("delete.title"), u("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return Et(u("delete.rule.title"), u("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? u("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return Et(u("switch.title"), u("switch.text"), [
        { action: "switch-discard", label: u("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return Et(u("conflict.title"), u(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: u("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: u("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return $;
  }
}
const ln = "plan_studio.draft.", ci = "plan_studio.lastPlanId";
function ry() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function ly(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class ay {
  constructor(e = ry, n = 500) {
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
      (n = this.storage()) == null || n.setItem(ln + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(ln + e), o = i ? JSON.parse(i) : null;
      return ly(o) && o.planId === e ? o : null;
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
        if (!(o != null && o.startsWith(ln))) continue;
        const s = this.read(o.slice(ln.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(ci)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(ci, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(ci)) === e && n.removeItem(ci);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(ln + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Hr = 5e3, zr = 12;
function Va(t) {
  t().catch(() => {
  });
}
class cy {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Va(n.unsub));
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
          Va(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ee(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= zr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Hr));
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
function uy(t, e, n) {
  var o, s, r, l;
  const i = [];
  for (const a of t) {
    if (a.enabled === !1) continue;
    const c = e(a.id);
    if (!c) continue;
    let p = null;
    ((o = a.motionLight) == null ? void 0 : o.light) === n ? ((s = c.motionLight) == null ? void 0 : s.mode) === "auto" && a.motionLight.sensors.length > 0 && (p = c.verdict === !0) : ((r = a.boiler) == null ? void 0 : r.device) === n && ((l = c.boiler) == null ? void 0 : l.mode) === "auto" && (p = c.boiler.phase === "heating"), p !== null && i.push({ text: u(p ? "live.mode.autoOn" : "live.mode.autoOff"), tone: "mode", id: `mode:${a.id}` });
  }
  return i;
}
const dy = 1046, Fd = 1.25, Lt = 480, B = 10, W = 34, Ud = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, Wd = (t) => Math.floor((t - 20) / 6.6), hy = (t) => Math.floor((t - 20) / 6), ge = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : yr(t * 1e3), J = (t) => 14 + 18 * t;
function Qe(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, o) => _`<text class=${o === 0 ? "fc-t1" : o === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(o)}>${Ud(i, o === 0 ? Wd(t.w) : hy(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Zi(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const fe = dy, Ce = fe / 2, rt = 230, ki = 26, Ae = 4, Ha = 36, Te = J(2), py = (fe - Ae * rt - (Ae - 1) * ki) / 2, za = 200, pt = 330, jd = 40, nt = 460, vn = 8, qd = 24, Ts = (fe - pt * 2 - jd) / 2, Ra = Ts + pt + jd;
function Gn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${u("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${u("rules.unit.min")}` : i === 0 ? `${n} ${u("rules.unit.h")}` : `${n} ${u("rules.unit.h")} ${i} ${u("rules.unit.min")}`;
}
const Rr = (t, e) => ge(Math.max(1, Math.ceil((t - e) / 1e3)));
function Br(t, e = !1) {
  return "light" in t ? `${u("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? u(`rules.daylight.is.${t.is}`) : "sun" in t ? u(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${u(`rules.held.${t.held.state}`)} ${Gn(t.held.seconds)}` : "rule" in t ? u("rules.src.rule") : u("rules.src.device");
}
const Ba = (t) => Number.isFinite(t) ? String(t) : "?";
function fy(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function Zd(t, e, n) {
  return "daylight" in n ? Gd(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? u("rules.flow.trueIn").replace("{t}", Rr(t.until, e)) : t.detail;
}
const Gd = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${Rr(t.until, e)})`), ie = (t) => u(`rules.val.${t === null ? "unknown" : t}`), j = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function my(t) {
  if (t <= Ae) {
    const i = (fe - t * rt - (t - 1) * ki) / 2;
    return Array.from({ length: t }, (o, s) => i + s * (rt + ki));
  }
  const e = t - Math.floor((t - 1) / Ae) * Ae, n = Math.floor((Ae - e) / 2);
  return Array.from({ length: t }, (i, o) => {
    const s = o % Ae;
    return py + (o >= t - e ? n + s : s) * (rt + ki);
  });
}
function Kd(t, e, n, i) {
  const o = n ? "daylight" in t.source && n.value !== null ? `${u(n.value ? "rules.flow.open" : "rules.flow.closed")}, ${Gd(n, i)}` : n.value === !0 ? u("rules.flow.open") : n.value === null ? `${u("rules.flow.closed")}, ${u("rules.val.unknown")}` : n.until !== void 0 && n.until > i ? `${u("rules.flow.closed")}, ${u("rules.flow.opensIn").replace("{t}", Rr(n.until, i))}` : `${u("rules.flow.closed")}${n.detail ? `, ${n.detail}` : ""}` : Br(t.source);
  return [`${u("rules.flow.gate")}: ${t.not ? "NOT " : ""}${e}`, o];
}
function Xd(t, e) {
  const n = Math.ceil(t / Ae), i = my(t), o = (a) => B + a * (e + Ha), s = (a) => o(Math.floor(a / Ae)), r = (a) => o(a) + e + (a === n - 1 ? W : Ha) / 2, l = [];
  i.forEach((a, c) => l.push(`M${a + rt / 2} ${s(c) + e} V${r(Math.floor(c / Ae))}`));
  for (let a = 0; a < n; a++) {
    const c = [Ce, ...i.slice(a * Ae, (a + 1) * Ae).map((p) => p + rt / 2)];
    Math.max(...c) > Math.min(...c) && l.push(`M${Math.min(...c)} ${r(a)} H${Math.max(...c)}`);
  }
  return { xs: i, inY: s, busY: r, bottom: t === 0 ? B - W : o(n - 1) + e, links: l };
}
function gy(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, o = e.inputs.map((V, F) => {
    const q = (i == null ? void 0 : i[F].value) ?? null;
    return q === null || !V.not ? q : !q;
  }), s = i ? fy(e.combine, o) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, c = (n == null ? void 0 : n.unknownInputs) ?? 0, p = e.gate ? n == null ? void 0 : n.gate : void 0, h = e.gate ? Kd(e.gate, t.inputName(e.gate), p, t.now) : [], d = u("rules.flow.delay").replace("{on}", Ba(e.onDelay)).replace("{off}", Ba(e.offDelay)), f = n === void 0 ? d : `${ie(r ?? null)}${l ? `, ${u("rules.flow.pending").replace("{to}", ie(l.to)).replace("{t}", ge(a))}` : ""}`, m = e.inputs.length, v = Xd(m, Te), { xs: w, inY: b } = v, y = m === 0 ? B : v.bottom + W, x = y + Te + W, M = x + Te + W, k = (e.gate ? M : x) + Te, L = k + W / 2, E = k + W, A = E + qd, O = Math.max(1, e.onTrue.length, e.onFalse.length), U = A + O * (Te + vn) - vn + B, S = [
    { side: "true", x: Ts, list: e.onTrue, head: u("rules.whenTrue") },
    { side: "false", x: Ra, list: e.onFalse, head: u("rules.whenFalse") }
  ], I = [...v.links];
  m > 0 && I.push(`M${Ce} ${v.busY(0)} V${y}`), I.push(`M${Ce} ${y + Te} V${x}`), e.gate && I.push(`M${Ce} ${x + Te} V${M}`), I.push(`M${Ce} ${k} V${L} H${Ts + pt / 2} V${E}`, `M${Ce} ${L} H${Ra + pt / 2} V${E}`);
  const T = (V) => Qe({ ...V, h: Te, focused: t.focused === V.field, onClick: () => t.onFocus(V.target) });
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * Fd}px`} viewBox=${`0 0 ${fe} ${U}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("rules.flow.title")}>
        ${I.map((V) => _`<path class="fc-link" d=${V}></path>`)}
        ${e.inputs.map((V, F) => {
    const q = i == null ? void 0 : i[F];
    return T({
      x: w[F],
      y: b(F),
      w: rt,
      field: `input-${F}`,
      target: { input: F },
      cls: q ? j(q.value) : "",
      lines: [`${V.not ? "NOT " : ""}${t.inputName(V)}`, q ? Zd(q, t.now, V.source) : Br(V.source, V.not === !0)]
    });
  })}
        ${T({
    x: (fe - za) / 2,
    y,
    w: za,
    field: "combine",
    target: "gate",
    cls: s === void 0 ? "" : j(s),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...s === void 0 ? [] : [ie(s)]]
  })}
        ${T({
    x: (fe - nt) / 2,
    y: x,
    w: nt,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : j(r ?? null),
    lines: [u("rules.flow.result"), f]
  })}
        ${e.gate ? T({
    x: (fe - nt) / 2,
    y: M,
    w: nt,
    field: "gate-input",
    target: "gate-input",
    cls: p ? j(p.value) : "",
    lines: h
  }) : $}
        ${S.map((V) => _`
          <text class="fc-head" text-anchor="middle" x=${V.x + pt / 2} y=${E + 14}>${V.head}</text>
          ${V.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${V.x + pt / 2} y=${A + Te / 2 + 4}>${u("rules.noActions")}</text>` : V.list.map((F, q) => T({
    x: V.x,
    y: A + q * (Te + vn),
    w: pt,
    field: `action-${V.side}-${q}`,
    target: { action: V.side, index: q },
    cls: "",
    lines: [t.actionName(F.device), ye(F.do) ? `${Fa(F.do)}: ${(F.do === "play" ? F.media : F.text) ?? ""}` : Fa(F.do)]
  }))}`)}
      </svg>
      ${c > 0 ? g`<p class="fc-warn">${c === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(c))}</p>` : $}
      ${n != null && n.held ? g`<p class="fc-warn" data-note="held">${u("rules.flow.heldNote")}</p>` : $}
      ${n != null && n.last ? g`<p class="fc-last">${u("rules.flow.last")} ${Tr(n.last)}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Fa = (t) => u(`rules.act.${t}`), Ua = { s: 1, min: 60, h: 3600 }, by = ["s", "min", "h"];
function wy(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Gi = (t) => Number.isFinite(t) ? String(t) : "";
function Wa(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const Vs = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? u("rules.missingDevice") : t.ruleName(e.rule) ?? u("rules.missingRule");
};
function Fr(t, e) {
  var i, o;
  const n = e.source;
  return "device" in n || "rule" in n ? Vs(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? u("rules.light.noSensor") : "daylight" in n ? ((o = t.deviceById(n.daylight)) == null ? void 0 : o.name) ?? u("rules.light.noSensor") : "sun" in n ? u("rules.src.sun") : "time" in n ? u("rules.src.time") : n.held.sources.length === 0 ? u("rules.src.held") : `${u("rules.src.held")}: ${n.held.sources.map((s) => Vs(t, s)).join(", ")}`;
}
const Hs = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function vy(t, e) {
  return "device" in e || "rule" in e ? Hs(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => Hs(t, n)) : !1;
}
function Yd(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function Qd(t) {
  return g`
    <optgroup label=${u("rules.groupDevices")}>
      ${t.inputDevices.map((e) => g`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? g`<optgroup label=${u("rules.groupRules")}>
      ${t.otherRules.map((e) => g`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : $}`;
}
function Ur(t, e, n) {
  return g`
    <option value="">${e}</option>
    ${Qd(t)}
    <optgroup label=${u("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((i) => g`<option value=${i}>${u(`rules.src.${i}`)}</option>`)}
    </optgroup>
    ${n ?? $}`;
}
const Jd = { say: { need: "text" }, play: { need: "media" }, notify: { need: "text", opt: "title" } };
function zs(t, e, n = t.device) {
  const i = { device: n, do: e };
  if (!ye(e)) return i;
  const o = Jd[e];
  return i[o.need] = t[o.need] ?? "", o.opt && t[o.opt] !== void 0 && (i[o.opt] = t[o.opt]), i;
}
function $n(t, e, n) {
  const i = t.actionsFor(e);
  if (!t.unique) return i;
  const o = t.list.filter((s, r) => r !== n && s.device === e.id).map((s) => s.do);
  return i.some(ye) ? i.filter((s) => !o.includes(s)) : o.length > 0 ? [] : i;
}
function $y(t, e, n, i) {
  var d;
  const o = e.list, s = t.deviceById(i.device), r = s ? $n(e, s, n) : [], l = r.includes(i.do) ? r : [...r, i.do], a = e.unique ? t.actionDevices.filter((f) => f.id === i.device || $n(e, f, n).length > 0) : t.actionDevices, c = ye(i.do) ? Jd[i.do] : void 0, p = (f, m) => {
    e.set(o.map((v, w) => {
      if (w !== n) return v;
      const { [f]: b, ...y } = v;
      return f === "title" && m === "" ? y : { ...y, [f]: m };
    }));
  }, h = (f) => g`
    <input class="grow" type="text" data-part=${f} placeholder=${u(`rules.field.${f}`)} .value=${i[f] ?? ""}
      @input=${(m) => p(f, m.target.value)} />`;
  return g`
    <div class="rline" data-field=${e.field(n)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(f) => {
    const m = t.deviceById(f.target.value);
    if (!m) return;
    const v = $n(e, m, n), w = e.firstDo(m), b = v.includes(i.do) ? i.do : v.includes(w) ? w : v[0];
    b !== void 0 && e.set(o.map((y, x) => x === n ? zs(y, b, m.id) : y));
  }}>
        ${s && !t.actionDevices.includes(s) ? g`<option value=${s.id}>${s.name}</option>` : $}
        ${s ? $ : g`<option value=${i.device}>${u("rules.missingDevice")}</option>`}
        ${a.map((f) => g`<option value=${f.id}>${f.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(f) => e.set(o.map((m, v) => v === n ? zs(m, f.target.value) : m))}>
        ${l.map((f) => g`<option value=${f}>${e.doText(f)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${u("rules.remove")} @click=${() => e.set(o.filter((f, m) => m !== n))}>&times;</button>
      ${c ? g`<div class="rparams">${h(c.need)}${c.opt ? h(c.opt) : $}</div>` : $}
      ${(s == null ? void 0 : s.props.kind) === "speaker" && !((d = s.bindings) != null && d.voice) ? g`<p class="muted" data-note="no-voice">${u("rules.announce.noVoice")}</p>` : $}
    </div>`;
}
function eh(t, e) {
  const n = e.unique ? t.actionDevices.filter((i) => $n(e, i).length > 0) : t.actionDevices;
  return g`
    <div class="rgroup">
      <div class="rlabel">${e.label}</div>
      ${e.list.map((i, o) => $y(t, e, o, i))}
      <select class="radd" data-action=${e.add} data-field=${e.addField ?? $} .value=${""}
        @change=${(i) => {
    const o = i.target, s = t.deviceById(o.value);
    if (o.value = "", !s || e.actionsFor(s).length === 0) return;
    const r = $n(e, s), l = e.firstDo(s), a = r.includes(l) ? l : r[0];
    a !== void 0 && e.set([...e.list, zs({ device: s.id, do: a }, a)]);
  }}>
        <option value="">${e.addText}</option>
        ${n.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
      </select>
    </div>`;
}
function ja(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return eh(t, {
    label: u(e === "true" ? "rules.whenTrue" : "rules.whenFalse"),
    addText: u("rules.addAction"),
    add: `add-action-${e}`,
    field: (o) => Zi({ action: e, index: o }),
    list: n[i],
    set: (o) => t.onChange({ ...n, [i]: o }),
    actionsFor: te,
    firstDo: (o) => te(o)[0],
    doText: (o) => u(`rules.act.${o}`)
  });
}
const es = (t) => t.trim() === "" ? NaN : Number(t);
function qa(t, e, n, i) {
  var o;
  return g`<select data-part=${e} data-value=${n} @change=${(s) => i(s.target.value)}>
    ${t.lightSensors.some((s) => s.id === n) ? $ : g`<option value=${n}>${((o = t.deviceById(n)) == null ? void 0 : o.name) ?? u("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
  </select>`;
}
const yy = ["night", "dark", "day"];
function xy(t, e, n, i) {
  var o;
  if ("daylight" in n)
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.daylight.sensor")} ${qa(t, "daylight", n.daylight, (s) => i({ ...n, daylight: s }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(s) => i({ ...n, is: s.target.value })}>
          ${yy.map((s) => g`<option value=${s}>${u(`rules.daylight.is.${s}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const s = n.light === "" ? void 0 : t.lightUnit(n.light);
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.light.sensor")}
          ${qa(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${u("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Gi(n.below)}
            @input=${(r) => i({ ...n, below: es(r.target.value) })} /> lx</label>
        <label>${u("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Gi(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: es(r.target.value) })} /> lx</label>
        <label class="chk">
          <input type="checkbox" data-part="unknown-dark" .checked=${n.unknownDark === !0}
            @change=${(r) => {
      const { unknownDark: l, ...a } = n;
      i(r.target.checked ? { ...a, unknownDark: !0 } : a);
    }} /> ${u("rules.light.unknownDark")}</label>
        ${s !== void 0 && s !== "lx" ? g`<p class="rwarn" data-warn="light-unit">${u("rules.light.unit").replace("{unit}", s)}</p>` : $}
      </div>`;
  }
  if ("time" in n)
    return g`
      <div class="rparams">
        <label>${u("rules.time.from")}
          <input data-part="from" type="time" .value=${n.time.from}
            @input=${(s) => i({ time: { ...n.time, from: s.target.value } })} /></label>
        <label>${u("rules.time.to")}
          <input data-part="to" type="time" .value=${n.time.to}
            @input=${(s) => i({ time: { ...n.time, to: s.target.value } })} /></label>
      </div>`;
  if ("held" in n) {
    const s = n.held, r = ((o = t.draft.units) == null ? void 0 : o[e]) ?? wy(s.seconds), l = Number.isFinite(s.seconds) ? String(+(s.seconds / Ua[r]).toFixed(4)) : "", a = (c) => i({ held: { ...s, ...c } });
    return g`
      <div class="rparams">
        <div class="rsources">
          ${s.sources.length === 0 ? g`<span class="muted">${u("rules.held.noSources")}</span>` : $}
          ${s.sources.map((c, p) => g`
            <span class="rchip${Hs(t, c) ? " bad" : ""}" data-part="source">${Vs(t, c)}
              <button class="btn" data-action="remove-source" title=${u("rules.held.removeSource")}
                @click=${() => a({ sources: s.sources.filter((h, d) => d !== p) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(c) => {
      const p = c.target, h = Yd(t, p.value);
      p.value = "", h && ("device" in h || "rule" in h) && a({ sources: [...s.sources, h] });
    }}>
            <option value="">${u("rules.held.addSource")}</option>
            ${Qd(t)}
          </select>
        </div>
        <label>${u("rules.held.state")}
          <select data-part="state" data-value=${s.state}
            @change=${(c) => a({ state: c.target.value })}>
            ${["on", "off", "any"].map((c) => g`<option value=${c}>${u(`rules.held.${c}`)}</option>`)}
          </select></label>
        <label>${u("rules.held.for")}
          <input class="num" data-part="duration" type="number" min="0" step="any" .value=${l}
            @input=${(c) => {
      var p;
      ((p = t.draft.units) == null ? void 0 : p[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(es(c.target.value) * Ua[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(c) => t.onUnit(e, c.target.value)}>
            ${by.map((c) => g`<option value=${c}>${u(`rules.unit.${c}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return $;
}
function Wr(t, e, n, i, o) {
  const s = e.source, r = !("device" in s || "rule" in s), l = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return g`
    <div class="rline${vy(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${r ? u(`rules.src.${l}`) : Fr(t, e)}${"sun" in s ? g` <span class="muted">${e.not ? u("rules.sun.above") : Br(s)}</span>` : $}</span>
      ${o ?? $}
      ${"daylight" in s && !e.not ? $ : g`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(a) => {
    const c = a.target.checked, { not: p, ...h } = e;
    i(c ? { ...h, not: !0 } : h);
  }} /> ${u("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${xy(t, n, s, (a) => i({ ...e, source: a }))}
    </div>`;
}
const jr = (t, e) => (n) => {
  const i = n.target, o = i.value ? Yd(t, i.value) : null;
  i.value = "", o && e(o);
};
function th(t, e, n, i = u("rules.gate.hint")) {
  const o = t.draft.rule, s = (r) => {
    const { gate: l, ...a } = o;
    t.onChange(r ? { ...a, gate: r } : a);
  };
  return g`
      <div class="rgroup">
        <div class="rlabel">${e}</div>
        <p class="muted">${i}</p>
        ${o.gate ? Wr(t, o.gate, n, s) : g`<select class="radd" data-action="set-gate" .value=${""} @change=${jr(t, (r) => s({ source: r }))}>
            ${Ur(t, u("rules.gate.set"))}
          </select>`}
      </div>`;
}
function nh(t) {
  const e = t.draft.rule;
  return g`
      <label class="rlabel" for="rule-name">${u("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${u("rules.namePlaceholder")}
        @input=${(n) => t.onChange({ ...e, name: n.target.value })} />`;
}
function ky(t) {
  const e = t.draft.rule;
  return g`
    <div class="rsettings">
      ${nh(t)}

      <label class="rlabel" for="rule-combine">${u("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(n) => t.onChange({ ...e, combine: n.target.value === "all" ? "all" : "any" })}>
        <option value="any">${u("rules.combine.any")}</option>
        <option value="all">${u("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${u("rules.inputs")}</div>
        ${e.inputs.length === 0 ? g`<p class="muted">${u("rules.noInputs")}</p>` : e.inputs.map((n, i) => Wr(
    t,
    n,
    Zi({ input: i }),
    (o) => t.onChange({ ...e, inputs: o ? e.inputs.map((s, r) => r === i ? o : s) : e.inputs.filter((s, r) => r !== i) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${jr(t, (n) => t.onChange({ ...e, inputs: [...e.inputs, { source: n }] }))}>
          ${Ur(t, u("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${u("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${u("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${Ui} step="1" .value=${Gi(e.onDelay)}
              @input=${(n) => t.onChange({ ...e, onDelay: Wa(n.target.value) })} /></label>
          <label class="grow">${u("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${Ui} step="1" .value=${Gi(e.offDelay)}
              @input=${(n) => t.onChange({ ...e, offDelay: Wa(n.target.value) })} /></label>
        </div>
      </div>

      ${th(t, u("rules.gate"), Zi("gate-input"))}

      ${ja(t, "true")}
      ${ja(t, "false")}
    </div>`;
}
function My(t) {
  const e = t.draft.rule, n = (i) => t.onFocus(Zi(i));
  return ih({
    title: u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t.problems.map((i) => ({ key: i, text: u(`rules.problem.${i}`) })),
    form: ky(t),
    diagram: gy({
      rule: e,
      inputName: (i) => Fr(t, i),
      actionName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? u("rules.missingDevice");
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
function ih(t) {
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
          <label class="rlabel" for="rule-zone">${u("rules.zone")}</label>
          <select id="rule-zone" data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? $ : g`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const Zt = Lt, qr = 20, Tt = Zt - 2 * B, yn = (Tt - qr) / 2, Rs = (Zt - yn * 2 - qr) / 2, Za = Rs + yn + qr, ts = (Zt - Tt) / 2, ns = Zt / 2, is = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), Ga = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", _y = (t) => `${t > 0 ? "+" : ""}${t} %`, an = (t, e) => Qe({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function Ka(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${is(n.t)} °C` : "", n.rh !== null ? `${is(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${is(n.ah)} g/m³` : "—"];
}
function Ay(t) {
  var V, F, q;
  const e = t.rule, n = e.vent, i = t.trace, o = i == null ? void 0 : i.inputs[0], s = o == null ? void 0 : o.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((V = e.onTrue[0]) == null ? void 0 : V.device) ?? "", c = Ka(r, u("vent.sensor"), s == null ? void 0 : s.a), p = Ka(l, u("vent.than"), s == null ? void 0 : s.b), h = J(Math.max(c.length, p.length)), d = u("vent.flow.vs").replace("{a}", r).replace("{b}", l), f = s ? `: ${s.pct === null ? ie(null) : _y(s.pct)}` : o ? `: ${o.detail}` : "", m = s ? `${Ud(d, Wd(Tt) - f.length)}${f}` : `${d}${f}`, v = u("vent.flow.margins").replace("{above}", Ga(n.above)).replace("{below}", Ga(n.below)), w = i == null ? void 0 : i.pending, b = w ? Math.max(0, Math.ceil((w.at - t.now) / 1e3)) : 0, y = u("vent.flow.runon").replace("{t}", Gn(e.offDelay)), x = [
    i ? `${u("rules.flow.result")}: ${ie(i.verdict)}` : u("rules.flow.result"),
    w ? `${y} (${u("vent.pending").replace("{to}", w.to ? "on" : "off").replace("{t}", ge(b))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((F = e.onTrue[0]) == null ? void 0 : F.do) ?? "?"} / ${((q = e.onFalse[0]) == null ? void 0 : q.do) ?? "?"}`,
    ...M ? [Vr(M)] : []
  ], L = M == null ? void 0 : M.error, E = J(k.length + (L ? 1 : 0)), A = B + h + W, O = A + J(2) + W, U = O + J(2) + W, S = U + E + B, I = (N) => _`<path class="fc-link" d=${`M${N + yn / 2} ${B + h} V${A - W / 2} H${ns} V${A}`}></path>`, T = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${u("rules.status.error")}: ${i.reason}` : u(`rules.status.${i.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Zt}px`} viewBox=${`0 0 ${Zt} ${S}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("vent.flow.title")}>
        ${I(Rs)}${I(Za)}
        <path class="fc-link" d=${`M${ns} ${A + J(2)} V${O} M${ns} ${O + J(2)} V${U}`}></path>
        ${an(t, { x: Rs, y: B, w: yn, h, field: "vent-sensor", cls: s != null && s.a.why ? " nodata" : "", lines: c })}
        ${an(t, { x: Za, y: B, w: yn, h, field: "vent-than", cls: s != null && s.b.why ? " nodata" : "", lines: p })}
        ${an(t, { x: ts, y: A, w: Tt, h: J(2), field: "vent-above", cls: o ? j(o.value) : "", lines: [m, v], tip: `${d}${f}
${v}` })}
        ${an(t, { x: ts, y: O, w: Tt, h: J(2), field: "vent-runon", cls: i ? j(i.verdict) : "", lines: x })}
        ${an(t, { x: ts, y: U, w: Tt, h: E, field: "vent-fan", cls: "", lines: k, err: L })}
      </svg>
      ${T ? g`<p class="fc-warn" data-note="status">${T}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function Ct(t) {
  const e = t.rule, n = e.zoneId === null || t.zones.some((i) => i.id === e.zoneId);
  return g`
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
        ${t.texts.length > 0 ? g`<ul class="rproblems" role="alert">
          ${t.texts.map((i) => g`<li data-problem=${i.key}>${i.text}</li>`)}</ul>` : $}
        <div class="rfoot">
          <label class="rlabel" for=${`${t.prefix}-zone`}>${u("rules.zone")}</label>
          <select id=${`${t.prefix}-zone`} data-field="zone" data-value=${e.zoneId ?? ""}
            @change=${(i) => t.onChange({ ...e, zoneId: i.target.value || null })}>
            <option value="">${u("rules.zone.none")}</option>
            ${n ? $ : g`<option value=${e.zoneId}>${u("rules.zone.removed")}</option>`}
            ${t.zones.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
          </select>
          <label class="rnot"><input type="checkbox" data-field="enabled" .checked=${e.enabled !== !1}
            @change=${(i) => {
    const { enabled: o, ...s } = e;
    t.onChange(i.target.checked ? s : { ...s, enabled: !1 });
  }} /> ${u("rules.enabled")}</label>
          <span class="sp"></span>
          <button class="btn" data-action="rule-cancel" @click=${t.onCancel}>${u("action.cancel")}</button>
          <button class="btn primary" data-action="rule-ok" ?disabled=${t.problems.length > 0} @click=${t.onOk}>${u("action.ok")}</button>
        </div>
      </div>
    </div>`;
}
const os = (t) => t.trim() === "" ? NaN : Number(t), ss = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function rs(t, e, n, i, o) {
  var r;
  const s = n === "" || i.some((l) => l.id === n);
  return g`
    <select data-field=${e} data-value=${n} @change=${(l) => o(l.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? $ : g`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? u("rules.missingDevice")}</option>`}
      ${i.map((l) => g`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function Sy(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: u("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: u("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: u("vent.problem.fan") });
  const o = [...i], s = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((c) => !!c);
  for (const c of t.problems)
    c === "device-missing" && !s.some((p) => !t.deviceById(p)) && !(n.sensor && !t.climateSensors.some((p) => p.id === n.sensor)) && !(n.than && !t.climateSensors.some((p) => p.id === n.than)) || c === "vent" && i.length > 0 || o.push({ key: c, text: u(c === "delay" ? "vent.problem.runon" : `rules.problem.${c}`) });
  return o;
}
function Ly(t) {
  var s;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), o = ((s = e.onTrue[0]) == null ? void 0 : s.device) ?? "";
  return Ct({
    prefix: "vent",
    title: u("vent.title"),
    hint: u("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Sy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("vent.sensor")}</label>
      ${rs(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${u("vent.than")}</label>
      ${rs(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${u("vent.fan")}</label>
      ${rs(t, "vent-fan", o, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${u("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${Q(ss(n.above))}
            @input=${(r) => i({ above: os(r.target.value) })} /></label>
        <label>${u("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${Q(ss(n.below))}
            @input=${(r) => i({ below: os(r.target.value) })} /></label>
        <label>${u("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${Q(ss(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(os(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: Ay({
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
const Cy = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, Ki = Lt, Iy = Ki - 2 * B, Ey = B, Oy = Ki / 2, Xa = (t) => t === null ? ie(null) : `${Math.round(t)} W`, ui = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function Dy(t, e) {
  const n = t.until !== void 0 ? ge(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? u("boiler.phase.heatingCheck").replace("{t}", n) : u("boiler.phase.heating");
    case "waiting":
      return u("boiler.phase.waiting").replace("{t}", n ?? ge(0));
    case "blackout":
    case "limit":
    case "done":
      return u(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function Ny(t) {
  return t.phase === "heating" ? j(!0) : t.phase !== null ? j(!1) : j(t.relay === null ? null : t.relay === "on");
}
function Py(t) {
  const n = t.rule.boiler, i = n.grid, o = t.trace, s = o == null ? void 0 : o.boiler, r = t.deviceName(n.device), l = [];
  let a = B;
  const c = (w, b, y, x) => {
    const M = J(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: w, cls: b, lines: y, err: x }), a += M + W;
  };
  if (i) {
    const w = (s == null ? void 0 : s.settling) !== void 0 && s.settling > t.now ? [u("boiler.flow.settling").replace("{left}", ge(Math.ceil((s.settling - t.now) / 1e3)))] : [];
    c("boiler-grid", s && s.grid === null ? j(null) : "", [t.gridName(i.block), s ? Xa(s.grid) : u("boiler.flow.gridPower"), ...w]);
    const b = u("boiler.flow.formula").replace("{nominal}", ui(i.nominal)), y = s && s.headroom !== null ? s.headroom > i.limit : null, x = !!s && (w.length > 0 || s.boilerW === null && s.relay !== "off" && s.grid !== null && s.grid <= i.limit && s.grid + i.nominal > i.limit);
    c("boiler-limit", s ? x ? "" : j(y === null ? null : !y) : "", [
      s ? `${u("boiler.flow.headroom")}: ${x ? u("boiler.flow.notJudged") : y === null ? ie(null) : u(y ? "boiler.flow.over" : "boiler.flow.ok")}` : u("boiler.flow.headroom"),
      s && s.headroom !== null ? `${b} = ${Math.round(s.headroom)} / ${ui(i.limit)} W` : `${b} ≤ ${ui(i.limit)} W`
    ]);
  }
  c("boiler-button", s ? j(s.mode === "auto") : "", [
    s ? `${u("boiler.flow.mode")}: ${u(`boiler.mode.${s.mode}`)}` : u("boiler.flow.mode"),
    u("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const p = s ? Dy(s, t.now) : null, h = o == null ? void 0 : o.last;
  c("boiler-relay", s ? Ny(s) : "", [
    s ? `${u("boiler.flow.relay")}: ${s.relay ?? ie(null)}` : u("boiler.flow.relay"),
    r,
    ...p ? [p] : [],
    ...h ? [Vr(h)] : []
  ], h == null ? void 0 : h.error);
  const d = u("boiler.flow.done");
  c(i ? "boiler-nominal" : "boiler-power", s ? j(s.boilerW === null ? null : s.boilerW > 1) : "", [
    s ? `${u("boiler.flow.power")}: ${Xa(s.boilerW)}` : u("boiler.flow.power"),
    i ? `${u("boiler.flow.nominal").replace("{w}", ui(i.nominal))}, ${d}` : d
  ]);
  const f = a - W + B, m = l.slice(1).map((w) => `M${Oy} ${w.y - W} V${w.y}`).join(" "), v = o && o.status !== "ok" ? o.status === "error" && o.reason ? `${u("rules.status.error")}: ${o.reason}` : u(`rules.status.${o.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ki}px`} viewBox=${`0 0 ${Ki} ${f}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((w) => Qe({ x: Ey, w: Iy, ...w, focused: t.focused === w.field, onClick: () => t.onFocus(w.field) }))}
      </svg>
      ${v ? g`<p class="fc-warn" data-note="status">${v}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Ya = (t) => t.trim() === "" ? NaN : Number(t), Qa = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function ls(t, e, n, i, o) {
  const s = e === "" || n.some((r) => r.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(r) => o(r.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? $ : g`<option value=${e}>${i}</option>`}
      ${n.map((r) => g`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function Ty(t) {
  var s;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: u("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: u("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: u("boiler.problem.grid") });
  const i = [...n], o = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((s = e.grid) == null ? void 0 : s.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !o || r === "boiler" && n.length > 0 || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Vy(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, o = (c) => t.onChange({ ...e, boiler: c }), s = (c) => i && o({ ...n, grid: { ...i, ...c } }), r = (c) => {
    const { grid: p, ...h } = n;
    o(c ? { ...h, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Cd, nominal: Id } } : h);
  }, l = (c) => {
    var p;
    return ((p = t.deviceById(c)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = (c) => {
    var p;
    return c === "" ? u("vent.pick") : ((p = t.deviceById(c)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  };
  return Ct({
    prefix: "boiler",
    title: u("boiler.title"),
    hint: u("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Ty(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("boiler.device")}</label>
      ${ls("boiler-device", n.device, t.boilers, l(n.device), (c) => o({ ...n, device: c }))}

      <label class="rlabel">${u("boiler.button")}</label>
      ${ls("boiler-button", n.button, t.buttons, l(n.button), (c) => o({ ...n, button: c }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(c) => r(c.target.checked)} /> ${u("boiler.limitOn")}</label>
      ${i ? g`
        <label class="rlabel">${u("boiler.grid")}</label>
        ${ls("boiler-grid", i.block, t.grids, u("boiler.missingGrid"), (c) => s({ block: c }))}
        <div class="vnums">
          <label>${u("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${Q(Qa(i.limit))}
              @input=${(c) => s({ limit: Ya(c.target.value) })} /></label>
          <label>${u("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${Q(Qa(i.nominal))}
              @input=${(c) => s({ nominal: Ya(c.target.value) })} /></label>
        </div>` : $}`,
    diagram: Py({
      rule: e,
      deviceName: a,
      gridName: (c) => {
        var p;
        return c === "" ? u("vent.pick") : ((p = t.grids.find((h) => h.id === c)) == null ? void 0 : p.name) ?? u("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Xi = Lt, it = 2, oh = 20, xn = 24, Ja = 220, kn = (Xi - 2 * B - (it - 1) * oh) / it, Mn = Xi / 2;
function Hy(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const zy = (t, e) => t === 1 ? Mn - kn / 2 : B + e % it * (kn + oh);
function ec(t, e, n, i) {
  const o = J(Math.max(...e.map((p) => p.lines.length + (p.err ? 1 : 0)))), s = Math.ceil(e.length / it), r = (p) => t + p * (o + xn), l = e.map((p, h) => ({ ...p, x: zy(e.length, h), y: r(Math.floor(h / it)), w: kn, h: o })), a = (p) => n ? r(p) + o + (p === s - 1 ? W : xn) / 2 : r(p) - (p === 0 ? W : xn) / 2, c = [];
  for (let p = 0; p < s; p++) {
    const h = l.slice(p * it, (p + 1) * it);
    for (const f of h) c.push(`M${f.x + kn / 2} ${n ? f.y + o : f.y} V${a(p)}`);
    const d = [Mn, ...h.map((f) => f.x + kn / 2)];
    Math.max(...d) > Math.min(...d) && c.push(`M${Math.min(...d)} ${a(p)} H${Math.max(...d)}`);
  }
  return c.push(n ? `M${Mn} ${a(0)} V${i}` : `M${Mn} ${i} V${a(s - 1)}`), { blocks: l, bottom: r(s - 1) + o, links: c.join(" ") };
}
function Ry(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, o = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [u("leak.flow.addSensor")] }] : e.sensors.map((y, x) => {
    const M = n == null ? void 0 : n.inputs[x];
    return { field: `leak-sensor:${y}`, cls: M ? j(M.value) : "", lines: [t.deviceName(y), M ? M.detail : u("device.leak_sensor")] };
  }), s = (y) => {
    var x, M;
    return ((M = (x = n == null ? void 0 : n.leak) == null ? void 0 : x.valves.find((k) => k.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => s(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [u("leak.flow.addValve")] }] : e.valves.map((y) => {
    var A;
    const x = (A = n == null ? void 0 : n.leak) == null ? void 0 : A.valves.find((O) => O.id === y), M = t.deviceName(y), k = (x == null ? void 0 : x.state) ?? null, L = y === r ? i : void 0, E = L ? (L.reason === "re-closed: leak" ? u("leak.flow.reclosed") : u("vent.flow.last").replace("{did}", u(`rules.did.${L.action}`))).replace("{at}", ve(L.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? k === "closed" ? j(!0) : k === "open" ? "" : j(null) : "",
      lines: [M, n ? k === null ? ie(null) : u(`leak.state.${k}`) : u("leak.flow.close"), ...E ? [E] : []],
      err: L == null ? void 0 : L.error
    };
  }), a = J(2), c = J(Math.max(...o.map((y) => y.lines.length))), p = B + Math.ceil(o.length / it) * (c + xn) - xn + W, h = ec(B, o, !0, p), d = ec(p + a + W, l, !1, p + a), f = {
    x: Mn - Ja / 2,
    y: p,
    w: Ja,
    h: a,
    field: "leak",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("leak.flow.leak")}: ${n.verdict === null ? ie(null) : u(n.verdict ? "leak.yes" : "leak.no")}` : u("leak.flow.leak"), u("leak.flow.any")]
  }, m = d.bottom + B, v = `${h.links} ${d.links}`, w = (y) => Qe({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), b = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Xi}px`} viewBox=${`0 0 ${Xi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("leak.flow.title")}>
        ${_`<path class="fc-link" d=${v}></path>`}
        ${h.blocks.map(w)}${w(f)}${d.blocks.map(w)}
      </svg>
      ${b ? g`<p class="fc-warn" data-note="status">${b}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function Yi(t, e, n, i, o, s, r) {
  const l = (c) => {
    var p;
    return ((p = t.deviceById(c)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, a = t.draft.focused;
  return g`
    <div class="rsources" data-group=${e}>
      ${i.map((c) => g`
        <span class="rchip${o.some((p) => p.id === c) ? "" : " bad"}${a === `${n}:${c}` ? " hl" : ""}"
          data-id=${c}>${l(c)}
          <button class="btn" data-action="remove" title=${u("leak.remove")}
            @click=${() => r(i.filter((p) => p !== c))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(c) => {
    const p = c.target, h = p.value;
    p.value = "", h && r([...i, h]);
  }}>
        <option value="">${s}</option>
        ${o.filter((c) => !i.includes(c.id)).map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
    </div>`;
}
function By(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: u("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: u("leak.problem.valves") });
  const i = [...n];
  for (const o of t.problems)
    o === "leak" && n.length > 0 || i.push({ key: o, text: u(`rules.problem.${o}`) });
  return i;
}
function Fy(t) {
  const e = t.draft.rule, n = e.leak;
  return Ct({
    prefix: "leak",
    title: u("leak.title"),
    hint: u("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: By(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("leak.sensors")}</label>
      ${Yi(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, u("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${u("leak.valves")}</label>
      ${Yi(t, "leak-valves", "leak-valve", n.valves, t.valves, u("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: Ry({
      rule: e,
      deviceName: (i) => {
        var o;
        return ((o = t.deviceById(i)) == null ? void 0 : o.name) ?? u("rules.missingDevice");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Qi = Lt, Uy = Qi - 2 * B, Wy = Qi / 2;
function jy(t) {
  const e = ve(t.at);
  return Zn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === Pd ? u("timed.flow.elsewhere") : u("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function qy(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, o = [];
  let s = B;
  const r = (f, m, v, w) => {
    const b = J(v.length + (w ? 1 : 0));
    o.push({ y: s, h: b, field: f, cls: m, lines: v, err: w }), s += b + W;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? u("timed.flow.events")]);
  const l = u(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Gn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? u("timed.flow.running").replace("{t}", ge(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : u("timed.flow.runningNow") : u("timed.flow.idle") : u("timed.flow.run");
  r("timed-minutes", i ? j(i.running) : n ? j(n.verdict) : "", [a, l]);
  const c = n == null ? void 0 : n.last;
  r("timed-device", i ? j(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? u("timed.flow.state").replace("{s}", i.device ?? ie(null)) : u(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...c ? [jy(c)] : []
  ], c == null ? void 0 : c.error);
  const p = s - W + B, h = o.slice(1).map((f) => `M${Wy} ${f.y - W} V${f.y}`).join(" "), d = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Qi}px`} viewBox=${`0 0 ${Qi} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("timed.flow.title")}>
        <path class="fc-link" d=${h}></path>
        ${o.map((f) => Qe({ x: B, w: Uy, ...f, focused: t.focused === f.field, onClick: () => t.onFocus(f.field) }))}
      </svg>
      ${d ? g`<p class="fc-warn" data-note="status">${d}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const tc = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function Zy(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? u("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${u("timed.events.start").replace("{e}", tc(e.on))}, ${e.separateOff ? u("timed.events.stop").replace("{e}", tc(e.off)) : u("timed.events.noStop")}`;
}
const Gy = (t) => t.trim() === "" ? NaN : Number(t);
function nc(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function Ky(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: u("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: u("timed.problem.device") });
  const i = [...n], o = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), s = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !o || r === "timed" && n.length > 0 && s || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Xy(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), o = Zy(t.deviceById(n.button)), s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return Ct({
    prefix: "timed",
    title: u("timed.title"),
    hint: u("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Ky(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("timed.button")}</label>
      ${nc("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${o ? g`<p class="muted" data-note="events">${o}</p>` : $}

      <label class="rlabel">${u("timed.device")}</label>
      ${nc("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${u("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${Q(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: Gy(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${u("timed.invert")}</label>`,
    diagram: qy({
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
const Yy = { "outside-wants": "outside-sensor" }, Ji = Lt, un = Ji - 2 * B, as = Ji / 2, Mi = 16, Qy = { 1: [un], 2: [(un - Mi) / 2, (un - Mi) / 2], 3: [176, 116, un - 176 - 116 - 2 * Mi] }, Bs = (t, e) => t !== void 0 ? ge(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function Jy(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), o = i ? i[1] : t.detail, s = t.daylight === null && o === u("daylight.noData") ? [] : [o];
  return i && s.push(`${i[2]} in ${Bs(t.until, n) ?? ge(0)}`), t.daylight === null && e && s.push(u("outside.flow.countsNight")), s;
}
function Zr(t) {
  const e = ve(t.at);
  return Zn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : Vd(t) ? u("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? u("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function e0(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, o = e.window, s = [{
    field: "outside-sensor",
    cls: i ? j(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${u("outside.flow.daylight")}: ${u(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...Jy(i, e.noDataNight === !0, t.now)] : [u("outside.flow.daylight"), t.deviceName(e.sensor), u(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && s.push({
    field: "outside-sunset",
    cls: i ? j(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${u("outside.flow.sun")}: ${i.sun === null ? ie(null) : u(`outside.sun.${i.sun}`)}` : u("outside.flow.sun"), u("outside.flow.afterSunset")]
  }), o) {
    const A = `${o.from}-${o.to}`, O = i && i.window !== null ? Bs(i.windowUntil, t.now) : null;
    s.push({
      field: "outside-window",
      cls: i ? j(i.window) : "",
      lines: i ? [
        i.window === null ? `${u("outside.flow.window")}: ${ie(null)}` : u(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        A,
        ...O ? [u(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", O)] : []
      ] : [u("outside.flow.window"), A]
    });
  }
  const r = [], l = Qy[s.length], a = J(Math.max(...s.map((A) => A.lines.length)));
  let c = B;
  for (const [A, O] of s.entries())
    r.push({ ...O, x: c, y: B, w: l[A], h: a }), c += l[A] + Mi;
  let p = B + a + W;
  const h = (A) => {
    const O = J(A.lines.length + (A.err ? 1 : 0));
    r.push({ ...A, x: B, y: p, w: un, h: O }), p += O + W;
  }, d = u("outside.flow.rule").replace("{sun}", e.afterSunset ? u("outside.flow.ruleSun") : "").replace("{window}", o ? u("outside.flow.ruleWindow") : "");
  h({
    field: "outside-wants",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("outside.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("outside.flow.wants"), d]
  });
  const f = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? Bs(i.pausedUntil, t.now) : null;
  h(e.pause === 0 ? { field: "outside-pause", cls: i ? j(!0) : "", lines: [u("outside.flow.never"), u("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? j(f === null) : "",
    lines: [
      i ? f !== null ? u("outside.flow.paused").replace("{t}", f) : u("outside.flow.noPause") : u("outside.flow.pause"),
      u("outside.flow.after").replace("{d}", Gn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, v = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ie(null)) : u("outside.flow.onOff"),
    ...m ? [Zr(m)] : []
  ];
  h({
    field: "outside-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: v,
    err: m == null ? void 0 : m.error,
    tip: m ? [...v, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const w = p - W + B, b = r.find((A) => A.field === "outside-wants"), y = B + a + W / 2, x = r.slice(0, s.length), M = [as, ...x.map((A) => A.x + A.w / 2)], k = [
    ...x.map((A) => `M${A.x + A.w / 2} ${B + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${as} ${y} V${b.y}`,
    ...r.slice(s.length + 1).map((A) => `M${as} ${A.y - W} V${A.y}`)
  ].join(" "), L = (A) => Qe({ ...A, focused: t.focused === A.field, onClick: () => t.onFocus(A.field) }), E = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ji}px`} viewBox=${`0 0 ${Ji} ${w}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("outside.flow.title")}>
        ${_`<path class="fc-link" d=${k}></path>`}
        ${r.map(L)}
      </svg>
      ${E ? g`<p class="fc-warn" data-note="status">${E}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const t0 = { from: "17:00", to: "01:00" }, Gr = (t) => t.trim() === "" ? NaN : Number(t);
function Bn(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function ic(t, e, n, i, o) {
  return g`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(s) => {
    const { [e]: r, ...l } = n;
    o(s.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function n0(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: u("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: u("outside.problem.sensor") });
  const i = [...n], o = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), s = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !o || l === "outside" && n.length > 0 && s && r || i.push({ key: l, text: u(`rules.problem.${l}`) });
  return i;
}
function i0(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), o = n.window, s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return Ct({
    prefix: "outside",
    title: u("outside.title"),
    hint: u("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: n0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("outside.light")}</label>
      ${Bn("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${u("outside.sensor")}</label>
      ${Bn("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${ic("outside-nodata", "noDataNight", n, u("outside.noDataNight"), i)}
      ${ic("outside-sunset", "afterSunset", n, u("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${o !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...t0 } } : a);
    }} /> ${u("outside.window")}</label>
      ${o ? g`
        <div class="vnums">
          <label>${u("rules.time.from")}
            <input data-field="outside-from" type="time" .value=${Q(o.from)}
              @input=${(r) => i({ ...n, window: { ...o, from: r.target.value } })} /></label>
          <label>${u("rules.time.to")}
            <input data-field="outside-to" type="time" .value=${Q(o.to)}
              @input=${(r) => i({ ...n, window: { ...o, to: r.target.value } })} /></label>
        </div>` : $}

      <div class="vnums">
        <label>${u("outside.pause")}
          <input class="num" data-field="outside-pause" type="number" min="0" max="1440" step="1"
            .value=${Q(Number.isFinite(n.pause) ? String(n.pause) : "")}
            @input=${(r) => i({ ...n, pause: Gr(r.target.value) })} /></label>
        <span class="muted">${u("outside.pauseNote")}</span>
      </div>`,
    diagram: e0({
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
const o0 = { "beurer-wants": "beurer-above" }, eo = Lt, s0 = eo - 2 * B, r0 = eo / 2, di = (t, e) => ge(Math.max(0, Math.ceil((t - e) / 1e3)));
function l0(t) {
  var b;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, o = [];
  let s = B;
  const r = (y, x, M, k, L) => {
    const E = J(M.length + (k ? 1 : 0));
    o.push({ y: s, h: E, field: y, cls: x, lines: M, err: k, tip: L }), s += E + W;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? u("beurer.flow.kept").replace("{t}", di(i.keptUntil, t.now)) : u("beurer.flow.noData") : u("beurer.source");
  r(
    "beurer-source",
    i ? j(i.watts !== null ? i.watts > e.above : l ? ((b = n.inputs[0]) == null ? void 0 : b.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const c = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? j(n.verdict) : "", [
    n ? `${u("beurer.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("beurer.flow.wants"),
    u("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", ge(t.rule.offDelay)),
    ...c ? [u("rules.flow.pending").replace("{to}", c.to ? "on" : "off").replace("{t}", di(c.at, t.now))] : []
  ]);
  const p = (n == null ? void 0 : n.verdict) === !0, h = e.every === 0 ? u("beurer.flow.never") : i && !p ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? u("beurer.flow.now").replace("{t}", di(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? u("beurer.flow.next").replace("{t}", di(i.cycleAt, t.now)) : i && p && i.heater === "on" && !i.fresh ? u("beurer.flow.due") : i ? "—" : Gn(e.every * 60);
  r("beurer-every", i ? j(i.pausedUntil !== void 0 ? !1 : p ? !0 : null) : "", [u("beurer.flow.repower"), h]);
  const d = n == null ? void 0 : n.last, f = [
    t.deviceName(e.heater),
    i ? u("timed.flow.state").replace("{s}", i.heater ?? ie(null)) : u("outside.flow.onOff"),
    ...d ? [Zr(d)] : []
  ];
  r(
    "beurer-heater",
    i ? j(i.heater === null ? null : i.heater === "on") : "",
    f,
    d == null ? void 0 : d.error,
    d ? [...f, ...d.error ? [d.error] : [], d.reason].join(`
`) : void 0
  );
  const m = s - W + B, v = o.slice(1).map((y) => `M${r0} ${y.y - W} V${y.y}`).join(" "), w = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${eo}px`} viewBox=${`0 0 ${eo} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("beurer.flow.title")}>
        ${_`<path class="fc-link" d=${v}></path>`}
        ${o.map((y) => Qe({ x: B, w: s0, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${w ? g`<p class="fc-warn" data-note="status">${w}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function a0(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: u("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: u("beurer.problem.source") });
  const o = [...i], s = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !s || l === "beurer" && i.length > 0 && r || o.push({ key: l, text: u(`rules.problem.${l}`) });
  return o;
}
function c0(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  }, s = (r, l, a, c, p, h, d) => g`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${c} max=${p} step="1"
          .value=${Q(Number.isFinite(a) ? String(a) : "")}
          @input=${(f) => h(Gr(f.target.value))} /></label>
      ${d ? g`<span class="muted">${d}</span>` : ""}
    </div>`;
  return Ct({
    prefix: "beurer",
    title: u("beurer.title"),
    hint: u("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: a0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("beurer.heater")}</label>
      ${Bn("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${u("beurer.source")}</label>
      ${Bn("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${s("above", u("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${s("off", u("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${s("keep", u("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${s("every", u("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), u("beurer.everyNote"))}`,
    diagram: l0({
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
const u0 = { "motionlight-wants": "motionlight-off", "motionlight-mode": "motionlight-buttons" };
function d0(t) {
  return t.startsWith("motionlight-sensor:") ? "motionlight-sensors" : u0[t] ?? t;
}
const to = Lt, oc = to - 2 * B, sc = to / 2, cs = 12, h0 = 3, p0 = {
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
}, f0 = (t) => {
  const e = Td(t);
  return e ? u(`motionLight.flow.${p0[e]}`).replace("{at}", ve(t.at)).replace("{s}", t.action) : Zr(t);
}, hi = (t, e) => ge(Math.max(0, Math.ceil((t - e) / 1e3)));
function m0(t) {
  var U;
  const e = t.rule.motionLight, n = t.trace, i = n == null ? void 0 : n.motionLight, o = e.daylight, s = e.sensors.length === 0 ? [{ field: "motionlight-sensors", cls: " muted", lines: [u("motionLight.flow.noSensors")] }] : e.sensors.map((S) => {
    const I = i == null ? void 0 : i.sensors.find((T) => T.id === S);
    return {
      field: `motionlight-sensor:${S}`,
      cls: i ? j((I == null ? void 0 : I.state) === void 0 || I.state === null ? null : I.state === "on") : "",
      lines: [t.deviceName(S), i ? (I == null ? void 0 : I.state) === "on" ? u("motionLight.flow.motion") : (I == null ? void 0 : I.state) === "off" ? u("motionLight.flow.clear") : u("motionLight.flow.noData") : u("device.motion_sensor")]
    };
  });
  if (o) {
    const S = i != null && i.daylight ? ((U = /^(.*?) \(.+ in [\d:]+\)$/.exec(i.daylight.detail)) == null ? void 0 : U[1]) ?? i.daylight.detail : "";
    s.push({
      field: "motionlight-daylight",
      cls: i ? j(i.dark) : "",
      lines: i != null && i.daylight ? [`${u("motionLight.flow.daylight")}: ${i.daylight.state ?? u("motionLight.flow.noData")}`, t.deviceName(o.sensor), ...S ? [S] : []] : [u("motionLight.flow.daylight"), t.deviceName(o.sensor), u(o.is === "night" ? "motionLight.isNight" : "motionLight.isDark")],
      tip: i != null && i.daylight ? [u("motionLight.flow.daylight"), t.deviceName(o.sensor), i.daylight.detail].join(`
`) : void 0
    });
  }
  const r = e.blocker;
  if (r) {
    const S = t.deviceName(r.device), I = u(r.is === "on" ? "motionLight.blockerIsOn" : "motionLight.blockerIsOff"), T = (i == null ? void 0 : i.blocked) === !0, V = i != null && i.blocker ? i.blocker.state ?? u("motionLight.flow.noData") : void 0;
    s.push({
      field: "motionlight-blocker",
      cls: i ? j(!T) : "",
      lines: T ? [u("motionLight.flow.blocked").replace("{name}", S)] : [u("motionLight.blocker"), `${S} ${I}`, ...V !== void 0 ? [u("motionLight.flow.blockerNow").replace("{s}", V)] : []]
    });
  }
  const l = e.sensors.length === 0 ? 1 : Math.min(h0, s.length), a = (oc - (l - 1) * cs) / l, c = Math.ceil(s.length / l), p = J(Math.max(...s.map((S) => S.lines.length))), h = l === 3 ? B + a + cs / 2 : sc, d = s.map((S, I) => ({ ...S, x: B + I % l * (a + cs), y: B + Math.floor(I / l) * (p + W), w: a, h: p })), f = [];
  for (let S = 0; S < c; S++) {
    const I = d.slice(S * l, (S + 1) * l), T = I[0].y + p + W / 2;
    for (const F of I) f.push(`M${F.x + a / 2} ${F.y + p} V${T}`);
    const V = [h, ...I.map((F) => F.x + a / 2)];
    Math.max(...V) > Math.min(...V) && f.push(`M${Math.min(...V)} ${T} H${Math.max(...V)}`);
  }
  const m = B + c * (p + W);
  let v = m;
  f.push(`M${h} ${B + p + W / 2} V${m}`);
  const w = (S) => {
    const I = J(S.lines.length + (S.err ? 1 : 0));
    d.push({ ...S, x: B, y: v, w: oc, h: I }), v > m && f.push(`M${sc} ${v - W} V${v}`), v += I + W;
  }, b = u("motionLight.flow.rule").replace("{dark}", o ? u("motionLight.flow.ruleDark") : "").replace("{d}", ge(t.rule.offDelay)) + (e.minOn > 0 ? u("motionLight.flow.ruleMin").replace("{d}", ge(e.minOn)) : ""), y = o ? u("motionLight.flow.ruleDay") : null, x = (i == null ? void 0 : i.mode) === "manual", M = x || e.sensors.length === 0;
  w({
    field: "motionlight-wants",
    cls: i && !M ? j(n.verdict) : "",
    lines: [
      i && !M ? `${u("motionLight.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("motionLight.flow.wants"),
      b,
      ...y ? [y] : [],
      ...(i == null ? void 0 : i.offAt) !== void 0 && !M ? [u("motionLight.flow.offIn").replace("{t}", hi(i.offAt, t.now))] : [],
      ...(i == null ? void 0 : i.minUntil) !== void 0 && !M ? [u("motionLight.flow.minOn").replace("{t}", hi(i.minUntil, t.now))] : [],
      ...i != null && i.present && i.holdUntil !== void 0 && !M ? [u("motionLight.flow.held").replace("{until}", hi(i.holdUntil, t.now))] : [],
      ...(i == null ? void 0 : i.left) !== void 0 && !M ? [u("motionLight.flow.left").replace("{name}", () => i.left)] : [],
      ...i != null && i.waiting && !M ? [u("motionLight.flow.waiting")] : []
    ]
  }), w({
    field: "motionlight-mode",
    cls: i ? j(!x) : "",
    lines: i ? [
      `${u("motionLight.flow.mode")}: ${u(x ? "motionLight.flow.manual" : e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.auto")}`,
      ...x ? [i.autoAt !== void 0 ? u("motionLight.flow.autoIn").replace("{t}", hi(i.autoAt, t.now)) : u("motionLight.flow.byButton")] : []
    ] : [u("motionLight.flow.mode"), u(e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.byButton")]
  });
  const k = n == null ? void 0 : n.last, L = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ie(null)) : u("outside.flow.onOff"),
    ...k ? [f0(k)] : []
  ];
  w({
    field: "motionlight-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: L,
    err: k == null ? void 0 : k.error,
    tip: k ? [...L, ...k.error ? [k.error] : [], k.reason].join(`
`) : void 0
  });
  const E = v - W + B, A = (S) => Qe({ ...S, focused: t.focused === S.field, onClick: () => t.onFocus(S.field) }), O = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${to}px`} viewBox=${`0 0 ${to} ${E}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("motionLight.flow.title")}>
        ${_`<path class="fc-link" d=${f.join(" ")}></path>`}
        ${d.map(A)}
      </svg>
      ${O ? g`<p class="fc-warn" data-note="status">${O}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function g0(t) {
  var l;
  const e = t.draft.rule, n = e.motionLight, i = [];
  n.light || i.push({ key: "pick-light", text: u("motionLight.problem.light") });
  const o = [...i], s = n.light && !t.lights.some((a) => a.id === n.light) || n.sensors.some((a) => !t.sensors.some((c) => c.id === a)) || n.buttons.some((a) => !t.buttons.some((c) => c.id === a)) || n.daylight && !t.daylightSensors.some((a) => a.id === n.daylight.sensor) || n.blocker && !t.blockers.some((a) => a.id === n.blocker.device), r = !n.sensors.includes(n.light) && !n.buttons.includes(n.light) && ((l = n.blocker) == null ? void 0 : l.device) !== n.light && [n.minOn, n.autoAfter].every(Number.isInteger) && n.minOn >= 0 && n.minOn <= 3600 && n.autoAfter >= 0 && n.autoAfter <= 1440;
  for (const a of t.problems)
    a === "device-missing" && !s || a === "motionLight" && i.length > 0 && r || o.push({ key: a, text: u(`rules.problem.${a}`) });
  return o;
}
function b0(t) {
  const e = t.draft.rule, n = e.motionLight, i = (d) => t.onChange({ ...e, motionLight: d }), o = (d) => {
    var f;
    return d === "" ? u("vent.pick") : ((f = t.deviceById(d)) == null ? void 0 : f.name) ?? u("rules.missingDevice");
  }, s = (d, f, m, v, w, b, y) => g`
    <div class="vnums">
      <label>${f}
        <input class="num" data-field=${`motionlight-${d}`} type="number" min=${v} max=${w} step="1"
          .value=${Q(Number.isFinite(m) ? String(m) : "")}
          @input=${(x) => b(Gr(x.target.value))} /></label>
      ${y ? g`<span class="muted">${y}</span>` : $}
    </div>`, r = n.buttons.length > 0 && n.autoAfter === 0 && !n.buttons.some((d) => {
    const f = t.buttons.find((m) => m.id === d);
    return !!f && Ld(f);
  }), l = n.buttons.some((d) => {
    const f = t.buttons.find((m) => m.id === d);
    return (f == null ? void 0 : f.props.kind) === "wall_switch" && !f.props.autoByDoubleToggle;
  }), a = n.daylight, c = !a || t.daylightSensors.some((d) => d.id === a.sensor), p = n.blocker, h = !p || t.blockers.some((d) => d.id === p.device);
  return Ct({
    prefix: "motionlight",
    title: u("motionLight.title"),
    hint: u("motionLight.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: g0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("motionLight.light")}</label>
      ${Bn("motionlight-light", n.light, t.lights, (d) => i({ ...n, light: d }))}

      <label class="rlabel">${u("motionLight.buttons")}</label>
      ${Yi(t, "motionlight-buttons", "motionlight-button", n.buttons, t.buttons.filter((d) => d.id !== n.light), u("motionLight.addButton"), (d) => i({ ...n, buttons: d, ...d.length === 0 ? { autoAfter: 0 } : {} }))}
      <span class="muted">${u("motionLight.buttonsNote")}</span>
      ${l ? g`<span class="muted" data-note="motionlight-nodoubletoggle">${u("motionLight.noDoubleToggle")}</span>` : $}

      <label class="rlabel">${u("motionLight.sensors")}</label>
      ${Yi(t, "motionlight-sensors", "motionlight-sensor", n.sensors, t.sensors, u("motionLight.addSensor"), (d) => i({ ...n, sensors: d }))}
      <span class="muted">${u("motionLight.sensorsNote")}</span>

      <label class="rlabel">${u("motionLight.daylight")}</label>
      <div class="vnums">
        <select data-field="motionlight-daylight" data-value=${(a == null ? void 0 : a.sensor) ?? ""}
          @change=${(d) => {
      const f = d.target.value, { daylight: m, ...v } = n;
      i(f === "" ? v : { ...v, daylight: { sensor: f, is: (a == null ? void 0 : a.is) ?? "dark" } });
    }}>
          <option value="">${u("motionLight.noDaylight")}</option>
          ${c ? $ : g`<option value=${a.sensor}>${u("rules.missingDevice")}</option>`}
          ${t.daylightSensors.map((d) => g`<option value=${d.id}>${d.name}</option>`)}
        </select>
        ${a ? g`
          <select data-field="motionlight-is" data-value=${a.is}
            @change=${(d) => i({ ...n, daylight: { ...a, is: d.target.value } })}>
            <option value="night">${u("motionLight.isNight")}</option>
            <option value="dark">${u("motionLight.isDark")}</option>
          </select>` : $}
      </div>

      <label class="rlabel">${u("motionLight.blocker")}</label>
      <div class="vnums">
        <select data-field="motionlight-blocker" data-value=${(p == null ? void 0 : p.device) ?? ""}
          @change=${(d) => {
      const f = d.target.value, { blocker: m, ...v } = n;
      i(f === "" ? v : { ...v, blocker: { device: f, is: (p == null ? void 0 : p.is) ?? "on" } });
    }}>
          <option value="">${u("motionLight.blockerNone")}</option>
          ${h ? $ : g`<option value=${p.device}>${u("rules.missingDevice")}</option>`}
          ${t.blockers.filter((d) => d.id !== n.light).map((d) => g`<option value=${d.id}>${d.name}</option>`)}
        </select>
        ${p ? g`
          <select data-field="motionlight-blocker-is" data-value=${p.is}
            @change=${(d) => i({ ...n, blocker: { ...p, is: d.target.value } })}>
            <option value="on">${u("motionLight.blockerIsOn")}</option>
            <option value="off">${u("motionLight.blockerIsOff")}</option>
          </select>` : $}
      </div>
      ${p ? g`<span class="muted">${u("motionLight.blockerNote")}</span>` : $}

      ${s("off", u("motionLight.off"), e.offDelay, 0, Ui, (d) => t.onChange({ ...e, offDelay: d }), u("motionLight.offNote"))}
      ${s("minon", u("motionLight.minOn"), n.minOn, 0, 3600, (d) => i({ ...n, minOn: d }))}

      ${n.buttons.length > 0 ? s("autoafter", u("motionLight.autoAfter"), n.autoAfter, 0, 1440, (d) => i({ ...n, autoAfter: d }), u("motionLight.autoAfterNote")) : $}
      <label class="rnot rcheck"><input type="checkbox" data-field="motionlight-presence" .checked=${n.presence === !0}
        @change=${(d) => {
      const { presence: f, neighbours: m, ...v } = n;
      i(d.target.checked ? { ...v, presence: !0 } : v);
    }} /> ${u("motionLight.presence")}</label>
      ${n.presence === !0 ? g`<span class="muted" data-note="motionlight-neighbours">${t.neighbours.length > 0 ? u("motionLight.neighbours").replace("{list}", () => t.neighbours.map((d) => `${d.zone.name} — ${d.sensors.map((f) => f.name).join(", ")}`).join("; ")) : u("motionLight.noNeighbours")}</span>` : $}
      ${r ? g`<p class="muted" data-note="motionlight-noauto">${u("motionLight.noAutoNote")}</p>` : $}`,
    diagram: m0({
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
function w0(t) {
  return t === "event" ? "control-source-0" : `control-${t.endsWith(":empty") ? t.slice(0, -6) : t.replace(":", "-")}`;
}
const sh = 20, Ot = (fe - 2 * B - 2 * sh) / 3, v0 = ["on", "off", "toggle"], $0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" }, y0 = (t) => t.error && !_$(t) ? u("control.flow.notSent").replace("{at}", ve(t.at)) : Zn(t) || t.sent !== !1 ? Vr(t) : Tr(t);
function x0(t) {
  const { rule: e, trace: n } = t, i = e.control, o = i.sources.length, s = n && n.inputs.length === o ? n.inputs : null, r = n == null ? void 0 : n.control, l = r == null ? void 0 : r.event, a = J(s || i.sources.some(Se) ? 3 : 2), c = J(l != null && l.dropped ? 3 : 2), p = Xd(o, a), h = o === 0 ? B : p.bottom + W, d = h + c + W, f = e.gate ? d + J(2) : h + c, m = f + W / 2, v = f + W, w = v + qd, b = (S) => B + S * (Ot + sh), y = [...p.links];
  o > 0 && y.push(`M${Ce} ${p.busY(0)} V${h}`), e.gate && y.push(`M${Ce} ${h + c} V${d}`), y.push(`M${Ce} ${f} V${m} H${b(0) + Ot / 2} V${v}`, `M${Ce} ${m} H${b(2) + Ot / 2} V${v}`, `M${Ce} ${m} V${v}`);
  const x = (S) => Qe({ ...S, focused: t.focused === S.field, onClick: () => t.onFocus(S.field) }), M = [
    u("control.flow.event"),
    // An event of a purpose-built rule is worded by that rule's event ("... heating done"), any other by the action list it ran.
    l ? u("control.flow.eventLine").replace("{source}", l.source).replace("{what}", l.origin ? u(`control.event.${l.origin.what}`) : u(`control.do.${l.what}`)).replace("{at}", ve(l.at)) : u("control.flow.noEvent"),
    ...l != null && l.dropped ? [u("control.flow.dropped")] : []
  ], k = (S) => {
    var I;
    return (I = r == null ? void 0 : r.devices.find((T) => T.id === S)) == null ? void 0 : I.state;
  }, L = n == null ? void 0 : n.last, E = (S, I) => L && l && !l.dropped && l.what === S && L.target === t.nameOf(I.device) && (!ye(I.do) || L.action === I.do) ? L : void 0, A = (S, I, T, V, F) => {
    const q = k(I.device), N = E(S, I), be = ye(I.do) ? `${u(`control.do.${I.do}`)}: ${(I.do === "play" ? I.media : I.text) ?? ""}` : u(`control.do.${I.do}`), Co = r && !ye(I.do) ? [u("control.flow.now").replace("{s}", q ?? u("control.flow.noData"))] : [], Yt = [t.nameOf(I.device), be, ...Co, ...N ? [y0(N)] : []], Yr = J(Yt.length + (N != null && N.error ? 1 : 0));
    return { svg: x({ x: V, y: F, w: Ot, h: Yr, field: `${S}:${T}`, cls: r ? j(q == null ? null : q === "on" || q === "open") : "", lines: Yt, err: N == null ? void 0 : N.error }), h: Yr };
  }, O = v0.map((S, I) => {
    const T = i[S], V = b(I), F = _`<text class="fc-head" text-anchor="middle" x=${V + Ot / 2} y=${v + 14}>${u($0[S])}</text>`;
    if (T.length === 0) {
      const be = J(1);
      return { bottom: w + be, body: _`${F}${x({ x: V, y: w, w: Ot, h: be, field: `${S}:empty`, cls: " muted", lines: [u("control.flow.nothing")] })}` };
    }
    let q = w;
    const N = T.map((be, Co) => {
      const Yt = A(S, be, Co, V, q);
      return q += Yt.h + vn, Yt.svg;
    });
    return { bottom: q - vn, body: _`${F}${N}` };
  }), U = Math.max(...O.map((S) => S.bottom)) + B;
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${fe * Fd}px`} viewBox=${`0 0 ${fe} ${U}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("control.flow.title")}>
        ${y.map((S) => _`<path class="fc-link" d=${S}></path>`)}
        ${i.sources.map((S, I) => {
    var q;
    const T = s == null ? void 0 : s[I], V = T && T.detail !== "" && "source" in S ? Zd(T, t.now, S.source) : Se(S) || T == null ? void 0 : T.detail, F = u("control.gives").replace("{what}", (T == null ? void 0 : T.gives) ?? t.gives(S));
    return x({
      x: p.xs[I],
      y: p.inY(I),
      w: rt,
      h: a,
      field: `source:${I}`,
      cls: T && !lt(S) && !Se(S) ? j(T.value) : "",
      lines: Se(S) ? [...((q = t.eventLines) == null ? void 0 : q.call(t, S)) ?? [t.sourceLabel(S)], F] : [`${"not" in S && S.not ? "NOT " : ""}${(T == null ? void 0 : T.label) ?? t.sourceLabel(S)}`, ...V ? [V] : [], F]
    });
  })}
        ${x({
    x: (fe - nt) / 2,
    y: h,
    w: nt,
    h: c,
    field: "event",
    cls: l != null && l.dropped ? " nodata" : "",
    lines: M
  })}
        ${e.gate ? x({
    x: (fe - nt) / 2,
    y: d,
    w: nt,
    h: J(2),
    field: "gate",
    cls: n != null && n.gate ? j(n.gate.value) : "",
    lines: Kd(e.gate, t.sourceLabel(e.gate), n == null ? void 0 : n.gate, t.now)
  }) : $}
        ${O.map((S) => S.body)}
      </svg>
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const rh = ["on", "off", "toggle"], k0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle" };
function lh(t, e) {
  var i;
  if (Se(e)) return "on";
  if (!lt(e)) return "on / off";
  const n = (i = t.deviceById(e.button)) == null ? void 0 : i.props;
  return (n == null ? void 0 : n.kind) === "smart_button" && n.separateOff ? "on / off" : "toggle";
}
const ah = (t, e) => {
  const n = t.ruleName(e.event.rule);
  return n === void 0 ? u("rules.missingRule") : _d(n, e.event.what);
};
function M0(t, e, n, i) {
  const o = `control-source-${n}`, s = g`<span class="muted" data-part="gives">${u("control.gives").replace("{what}", lh(t, e))}</span>`;
  if (Se(e)) {
    const l = t.otherRules.find((a) => a.id === e.event.rule);
    return g`
    <div class="rline${l && Nr(l).includes(e.event.what) ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${ah(t, e)}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
  }
  if (!lt(e)) return Wr(t, e, o, i, s);
  const r = t.deviceById(e.button);
  return g`
    <div class="rline${(r == null ? void 0 : r.props.kind) === "smart_button" ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${(r == null ? void 0 : r.name) ?? u("rules.missingDevice")}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
}
function _0(t) {
  const e = t.draft.rule.control, n = [];
  return e.sources.length === 0 && n.push({ key: "pick-sources", text: u("control.problem.sources") }), rh.every((i) => e[i].length === 0) && n.push({ key: "pick-actions", text: u("control.problem.actions") }), [...n, ...t.problems.filter((i) => i !== "control" || n.length === 0).map((i) => ({ key: i, text: u(`rules.problem.${i}`) }))];
}
function A0(t) {
  const e = t.draft.rule, n = e.control, i = (h) => t.onChange({ ...e, control: { ...n, sources: h } }), o = (h) => {
    var d;
    return ((d = t.deviceById(h)) == null ? void 0 : d.name) ?? u("rules.missingDevice");
  }, s = t.buttons.filter((h) => !n.sources.some((d) => lt(d) && d.button === h.id)), r = s.length > 0 ? g`<optgroup label=${u("control.group.buttons")}>
      ${s.map((h) => g`<option value=${`b:${h.id}`}>${h.name}</option>`)}
    </optgroup>` : void 0, l = t.otherRules.flatMap((h) => Nr(h).map((d) => ({ rule: h, what: d }))).filter((h) => !n.sources.some((d) => Se(d) && d.event.rule === h.rule.id && d.event.what === h.what)), a = l.length > 0 ? g`<optgroup label=${u("control.group.events")}>
      ${l.map((h) => g`<option value=${`e:${h.rule.id}:${h.what}`}>${_d(h.rule.name, h.what)}</option>`)}
    </optgroup>` : void 0, c = (h) => {
    const d = h.target;
    if (d.value.startsWith("e:")) {
      const [, m, v] = d.value.split(":");
      d.value = "", i([...n.sources, { event: { rule: m, what: v } }]);
      return;
    }
    if (!d.value.startsWith("b:")) {
      jr(t, (m) => i([...n.sources, { source: m }]))(h);
      return;
    }
    const f = d.value.slice(2);
    d.value = "", i([...n.sources, { button: f }]);
  }, p = g`
    <div class="rsettings">
      <p class="muted">${u("control.hint")}</p>
      ${nh(t)}

      <div class="rgroup">
        <div class="rlabel">${u("control.sources")}</div>
        ${n.sources.map((h, d) => M0(
    t,
    h,
    d,
    (f) => i(f ? n.sources.map((m, v) => v === d ? f : m) : n.sources.filter((m, v) => v !== d))
  ))}
        <select class="radd" data-action="add-source" .value=${""} @change=${c}>
          ${Ur(t, u("control.addSource"), g`${r}${a}`)}
        </select>
      </div>

      ${th(t, u("control.gate"), "control-gate", u("control.gateNote"))}

      ${rh.map((h) => eh(t, {
    label: u(k0[h]),
    addText: u("control.addAction"),
    add: `add-action-${h}`,
    addField: `control-${h}`,
    field: (d) => `control-${h}-${d}`,
    list: n[h],
    set: (d) => t.onChange({ ...e, control: { ...n, [h]: d } }),
    actionsFor: wn,
    firstDo: (d) => wn(d).includes(h) ? h : wn(d)[0],
    doText: (d) => u(`control.do.${d}`),
    unique: !0
  }))}
    </div>`;
  return ih({
    title: u("control.title"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: _0(t),
    form: p,
    diagram: x0({
      rule: e,
      trace: t.trace,
      note: t.note,
      now: t.now,
      nameOf: o,
      sourceLabel: (h) => lt(h) ? o(h.button) : Se(h) ? ah(t, h) : Fr(t, h),
      eventLines: (h) => Se(h) ? [t.ruleName(h.event.rule) ?? u("rules.missingRule"), u(`control.event.${h.event.what}`)] : [],
      gives: (h) => lh(t, h),
      focused: t.draft.focused,
      onFocus: t.onFocus
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
const S0 = ["power", "voltage", "power_in", "power_out", "control"], L0 = 300;
function rc(t) {
  t().catch(() => {
  });
}
function C0(t, e) {
  var o;
  const n = new Map(e.devices.map((s) => [s.id, s])), i = {};
  for (const s of t.blocks) {
    const r = s.kind === "device" ? n.get(s.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Kt(r), controllable: Gc(r) };
    for (const a of S0) {
      const c = (o = r.bindings) == null ? void 0 : o[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class I0 {
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
      }, L0);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && rc(n.unsub));
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
          rc(s);
          return;
        }
        o.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        o.live && (o.live = !1, this.sub = null, this.current = null, this.setFailure(Ee(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= zr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Hr));
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
const us = 1e4, lc = 400, E0 = 1e3, ac = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), O0 = ["timer", "power"], D0 = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function N0(t, e) {
  return t === 0 ? e : `${t}_${e}`;
}
function cc(t) {
  var n;
  if (t.props.kind !== "smart_button") return [];
  const e = [];
  for (const { role: i } of Le(t)) {
    if (i !== "on" && i !== "off" && i !== "auto") continue;
    const o = (n = t.bindings) == null ? void 0 : n[i], s = t.props[i];
    o && s && typeof s.event == "string" && s.event && e.push({ entity: o, value: N0(s.slot, s.event) });
  }
  return e;
}
function ch(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], o = (s, r, l = !1) => {
    s && !i.some((a) => a.entity === s) && i.push({ entity: s, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: s } of Le(t)) (s === "on" || s === "off" || s === "auto") && o(e[s], !1);
  else n === "wall_switch" ? o(e.state, !0) : n === "valve" && o(e.state, !0, !0);
  return i;
}
function P0(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function T0(t, e, n) {
  var i;
  if (t.settled) {
    const o = P0(e.state, t.valve);
    return o === void 0 ? {} : { value: o, text: n && n.last !== o ? o : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (ac.has(e.state)) return {};
    const o = (i = e.attributes) == null ? void 0 : i.event_type, s = n && n.last !== e.state && typeof o == "string" && o !== "";
    return { value: e.state, text: s ? o : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !ac.has(e.state) ? e.state : void 0 };
}
function uc(t, e, n, i) {
  const o = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return Yu(o, n, i)[0];
}
function V0(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of ch(n)) e.add(i.entity);
  return [...e].sort();
}
class H0 {
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
    return i && n - i.at < us ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < lc).map((r) => r.bubble), o = this.events.get(e), s = o ? n - o.at : -1;
    return o && s >= us && s < us + E0 && i.push({ text: o.text, tone: o.tone, key: o.at }), i;
  }
  updateEvents(e, n, i, o) {
    const s = ch(n), r = `${n.id}|`, l = new Set(s.map((a) => r + a.entity));
    for (const a of [...this.seen.keys()]) a.startsWith(r) && !l.has(a) && this.seen.delete(a);
    for (const a of s) {
      const c = D0(i, a.entity);
      if (!c) continue;
      const p = r + a.entity, { value: h, text: d } = T0(a, c, this.seen.get(p));
      if (h !== void 0 && this.seen.set(p, { last: h }), !!d) {
        if (n.props.kind !== "smart_button") {
          this.events.set(n.id, { text: d, at: o, tone: "event" });
          continue;
        }
        cc(n).some((f) => f.entity === a.entity && f.value === d) ? this.events.set(n.id, { text: d, at: o, tone: "event" }) : e.devices.some((f) => f !== n && cc(f).some((m) => m.entity === a.entity && m.value === d)) || this.events.set(n.id, { text: u("live.noTrigger").replace("{action}", d), at: o, tone: "unmatched" });
      }
    }
  }
  updateBubbles(e, n, i) {
    const o = wi(e, n), s = this.bubbles.get(e.id);
    if (s) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < lc);
      for (const l of O0) {
        const a = uc(s, l, e, i);
        a && !uc(o, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, o);
  }
}
const pi = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function dc(t) {
  t().catch(() => {
  });
}
class z0 {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && dc(n.unsub));
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
        n.live ? n.unsub = i : dc(i);
      },
      () => {
        n.live && (n.live = !1, this.sub = null);
      }
    );
  }
  apply(e) {
    var n;
    for (const [i, o] of Object.entries(e.a ?? {}))
      !o || typeof o.s != "string" || this.map.set(i, { state: o.s, attributes: { ...o.a ?? {} }, last_changed: pi(o.lc) ?? pi(o.lu) });
    for (const [i, o] of Object.entries(e.c ?? {})) {
      const s = this.map.get(i);
      if (!s || !o) continue;
      const r = { ...s, attributes: { ...s.attributes } }, l = o["+"];
      if (l) {
        const a = typeof l.s == "string" && l.s !== s.state;
        typeof l.s == "string" && (r.state = l.s), l.a && typeof l.a == "object" && Object.assign(r.attributes, l.a);
        const c = pi(l.lc) ?? (a ? pi(l.lu) : void 0);
        c && (r.last_changed = c);
      }
      for (const a of ((n = o["-"]) == null ? void 0 : n.a) ?? []) delete r.attributes[a];
      this.map.set(i, r);
    }
    for (const i of e.r ?? []) this.map.delete(i);
    this.onChange();
  }
}
function hc(t) {
  t().catch(() => {
  });
}
class R0 {
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
    for (const [o, s] of this.map) i[Cn(o)] = { state: s.state, attributes: {}, last_changed: s.since };
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
  drop(e) {
    const n = this.sub;
    this.sub = null, n && (n.live = !1, e && n.unsub && hc(n.unsub));
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
          hc(o);
          return;
        }
        i.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(Ee(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= zd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Hd));
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
class B0 {
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
      const { version: i } = await Hg({ connection: e });
      if (n !== this.run || typeof i != "string" || !i) return;
      const o = i === this.bundleVersion ? null : i;
      if (o === null && this.serverVersion !== null) return;
      o !== this.serverVersion && (this.serverVersion = o, this.onChange());
    } catch {
      if (n !== this.run || this.retries >= zr) return;
      this.retries++, this.timer = setTimeout(() => {
        this.timer = null, this.check();
      }, Hr);
    }
  }
}
var F0 = Object.defineProperty, Y = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && F0(e, n, o), o;
};
const U0 = "0.28.0", Xr = class Xr extends Vt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = jh.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = h1(), this.nextObj = Ww(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = _u(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new ay(), this.resizeObs = null, this.session = new Xv(this), this.haMeta = new Yv(this), this.feed = new cy(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new S$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.virtualFeed = new R0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new I0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.hint = new Q1(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, (i) => {
      var s;
      const o = this.power.blocks.find((r) => r.id === i);
      return o && this.mode === "power" ? Y1(o, this.ctx.geo(), (s = this.powerFeed.frame) == null ? void 0 : s.blocks[i]) : [];
    }), this.events = new H0(), this.entityFeed = new z0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.reloadPage = () => location.reload(), this.updateCheck = new B0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, U0, () => this.requestUpdate()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Hh(i, (o) => Mu(this.haMeta.get(), o, this.liveStates)), this.onBeforeUnload = (i) => {
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
    this.save = new eb(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Qv(this), this.activeTool = Is("select", this.ctx), this.input = new iy(this);
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
    this.entityFeed.watch(e ? V0(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? C0(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, c, p, h, d, f, m, v, w, b, y, x;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((M) => wi(M, this.liveStates).timerSince !== void 0 || this.events.event(M.id, n) !== null || this.events.leaving(M.id, n).length > 0), o = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, s = !!o && (!!o.pending || o.inputs.some((M) => M.until !== void 0 && M.until > n) || (((l = o.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = o.boiler) == null ? void 0 : a.until) ?? 0) > n || (((c = o.boiler) == null ? void 0 : c.settling) ?? 0) > n || ((p = o.timed) == null ? void 0 : p.running) === !0 && (o.timed.until ?? 0) > n || [(h = o.outside) == null ? void 0 : h.pausedUntil, (d = o.outside) == null ? void 0 : d.until, (f = o.outside) == null ? void 0 : f.windowUntil, (m = o.beurer) == null ? void 0 : m.pausedUntil, (v = o.beurer) == null ? void 0 : v.cycleAt, (w = o.beurer) == null ? void 0 : w.keptUntil, (b = o.motionLight) == null ? void 0 : b.offAt, (y = o.motionLight) == null ? void 0 : y.minUntil, (x = o.motionLight) == null ? void 0 : x.autoAt].some((M) => (M ?? 0) > n));
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
    const i = this.history.current.power, o = n ?? (i && Wf(i, e));
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
      const r = this.planLevels(), l = ((o = this.selection) == null ? void 0 : o.kind) === "zone" ? this.selection.id : null, a = r.flatMap((d) => d.zones).find((d) => d.id === l), c = ((s = this.selection) == null ? void 0 : s.kind) === "device" ? r.flatMap((d) => d.devices).find((d) => d.id === this.selection.id) : void 0, p = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? dv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Bv({}, p, c && Jo(c) ? c.id : null, c && Jo(c) ? c.name : "") : e === "outside" ? Cv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "control" ? Mv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? Sv(p, (a == null ? void 0 : a.name) ?? null) : e === "motionLight" ? Ov({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? zv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? Dv({ levels: r }, p, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? Tv({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, p, (a == null ? void 0 : a.name) ?? null) : Fe(p), isNew: !0, focused: null };
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
    e.isNew ? this.commitRules(Yw(this.rules, e.rule)) : n && !xi(n, e.rule) && this.commitRules(Qw(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && xi(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return $;
    const n = this.planLevels(), i = n.flatMap((d) => d.devices), o = e.rule, s = this.session.savedRules.find((d) => d.id === o.id), r = this.shownRuleTrace(o), l = s ? xi(s, o) ? null : u("rules.flow.edited") : u("rules.flow.new"), a = n.length > 1, c = n.flatMap((d) => d.zones.map((f) => ({ id: f.id, name: a ? `${f.name} (${d.name})` : f.name }))), p = rv(
      this.rules,
      o,
      (d) => i.some((f) => f.id === d),
      (d) => {
        const f = i.find((m) => m.id === d);
        return f && te(f);
      },
      (d) => i.some((f) => f.id === d && f.props.kind === "illuminance_sensor"),
      (d) => i.some((f) => f.id === d && f.props.kind === "climate_sensor"),
      (d) => i.some((f) => f.id === d && Ds(f)),
      (d) => i.some((f) => f.id === d && (f.props.kind === "wall_switch" || f.props.kind === "smart_button")),
      (d) => this.boilerGridBlocks().some((f) => f.id === d),
      (d) => {
        const f = i.find((m) => m.id === d);
        return !f || Ld(f);
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
      (d) => i.some((f) => f.id === d && wn(f).length > 0),
      (d) => i.some((f) => f.id === d && te(f).includes("on") && te(f).includes("off")),
      (d) => i.some((f) => f.id === d && f.props.kind === "motion_sensor"),
      (d) => i.some((f) => f.id === d && La(f)),
      (d) => i.some((f) => f.id === d && f.props.kind === "virtual_switch"),
      (d) => i.some((f) => f.id === d && Sa(f))
    );
    if (Pv(o))
      return Vy({
        draft: e,
        boilers: i.filter(Ds),
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        grids: this.boilerGridBlocks().map((d) => ({ id: d.id, name: d.name || u("power.kind.grid") })),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Cy[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (uv(o))
      return Fy({
        draft: e,
        sensors: i.filter((d) => d.props.kind === "leak_sensor"),
        valves: i.filter((d) => d.props.kind === "valve"),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Hy(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (fv(o))
      return Xy({
        draft: e,
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        devices: i.filter((d) => te(d).includes("on")),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
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
    if (Lv(o))
      return i0({
        draft: e,
        lights: i.filter((d) => te(d).includes("on")),
        sensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Yy[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Ev(o))
      return b0({
        draft: e,
        lights: i.filter((d) => {
          const f = te(d);
          return f.includes("on") && f.includes("off");
        }),
        sensors: i.filter((d) => d.props.kind === "motion_sensor"),
        daylightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        buttons: i.filter(La),
        blockers: i.filter(Sa),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        neighbours: Ed(n, o.zoneId, o.motionLight.sensors),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, d0(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Av(o))
      return c0({
        draft: e,
        heaters: i.filter((d) => te(d).includes("on")),
        sources: i.filter((d) => {
          var f;
          return !!((f = d.bindings) != null && f.power);
        }),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
        problems: p,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, o0[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Vv(o))
      return Ly({
        draft: e,
        climateSensors: i.filter((d) => d.props.kind === "climate_sensor"),
        fans: i.filter((d) => {
          const f = te(d);
          return f.includes("on") && f.includes("off");
        }),
        deviceById: (d) => i.find((f) => f.id === d),
        zones: c,
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
      inputDevices: i.filter(Jo),
      lightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
      lightUnit: (d) => {
        var v, w, b, y;
        const f = (w = (v = i.find((x) => x.id === d)) == null ? void 0 : v.bindings) == null ? void 0 : w.illuminance, m = f ? (b = this.liveStates) == null ? void 0 : b[f] : void 0;
        return (y = m == null ? void 0 : m.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((d) => te(d).length > 0),
      deviceById: (d) => i.find((f) => f.id === d),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter((d) => d.id !== o.id && !Aa(d)),
      ruleName: (d) => {
        var f;
        return (f = this.rules.find((m) => m.id === d)) == null ? void 0 : f.name;
      },
      zones: c,
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
    return Aa(o) ? A0({
      ...h,
      actionDevices: i.filter((d) => wn(d).length > 0),
      buttons: i.filter((d) => d.props.kind === "smart_button"),
      onFocus: (d) => this.focusRuleField(d, w0(d))
    }) : My(h);
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(Jw(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Qo(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Qo(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Cu(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? fr(n, e.id) : e.kind === "opening" ? Wc(n, e.id) : gu(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Eu(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Su(n, e.id);
    return i === n ? this.notice = u("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(e, n) {
    this.powerFeed.setPosition(e, n).catch((i) => {
      this.notice = Ee(i);
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
    this.selection = o && n && i && Qo(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Is(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(Or(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const o = ue(n, i);
    o && (this.view = Pa(this.view, o.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const o = uu(n).get(e);
    o && (this.view = Pa(this.view, o, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? Rw(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return G$(this.svgEl(), this.view, e);
  }
  /** Power step pointer move without a button: the block under the pointer (not a bus, wire or empty space) rests for the hint. */
  hintHover(e) {
    if (this.mode !== "power") return;
    const n = _s(this.power, this.toMm(e), this.ctx.tolMm(), this.ctx.geo()), i = (n == null ? void 0 : n.kind) === "block" ? n.id : (n == null ? void 0 : n.kind) === "port" || (n == null ? void 0 : n.kind) === "chip" ? n.block : null;
    this.hint.move(i !== null && this.hint.meterCount(i) > 0 ? i : null);
  }
  /** The open hover hint over the canvas: its lines beside the hovered block (screen pixels of the canvas). */
  renderHint(e) {
    const n = this.hint.openId, i = this.hint.lines(e), o = n === null ? void 0 : this.power.blocks.find((p) => p.id === n);
    if (!i || !o) return $;
    const { x: s, y: r, scale: l } = this.view, a = Oe(o, this.ctx.geo(), this.power), c = Vg({ x: (a.x - s) * l, y: (a.y - r) * l, w: a.w * l, h: a.h * l }, Tg(i), this.size);
    return g`<div class="power-hint" role="tooltip" style=${`left:${c.left}px;top:${c.top}px`}>
      ${i.map((p) => g`<div class="line">${p}</div>`)}</div>`;
  }
  fit() {
    var e;
    this.planView = K$(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = mm(this.power, this.ctx.geo());
    e && (this.powerView = X$(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, o;
    return sy({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((s) => s.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((o = this.dialog) == null ? void 0 : o.kind) === "delete-rule" ? iv(this.rules, this.dialog.id).map((s) => s.name) : [],
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
    var f, m, v;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${u("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${u("action.retry")}</button>` : u("load.loading")}</div>`;
    const e = Jb(!!((m = (f = this.hass) == null ? void 0 : f.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: o, y: s, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, p = this.mode === "power", h = Date.now(), d = this.liveStates;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : p ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${W$(e)} ?data-update=${this.updateCheck.serverVersion !== null}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${this.updateCheck.serverVersion === null ? $ : g`<div class="update-bar" role="status">
          <span>${u("update.notice").replace("{version}", this.updateCheck.serverVersion)}</span>
          <button data-action="reload" @click=${() => this.reloadPage()}>${u("update.reload")}</button></div>`}
        ${Dw({
      steps: Vw({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (w) => {
          this.plan = { ...this.plan, name: w }, c.markDirty();
        },
        onMode: (w) => this.setMode(w)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (w) => this.session.pickPlan(w),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${T$(this, n)}
        ${H$(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${o} ${s} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort} @pointerleave=${() => this.hint.hide()}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(w) => w.preventDefault()}>
            ${this.grid ? J$(this.view, l, a, e, p ? 0.1 : 1) : $}
            ${this.mode === "power" ? kg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : Xb(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (w) => this.feed.stateOf(w),
      live: (w) => wi(w, d),
      bubbles: (w) => {
        const b = wi(w, d), y = this.events.event(w.id, h);
        return {
          shown: [...uy(this.session.savedRules, (x) => this.rulesFeed.trace(x), w.id), ...Yu(b, w, h), ...y ? [{ text: y.text, tone: y.tone, key: y.at }] : []],
          leaving: this.events.leaving(w.id, h)
        };
      }
    })}
            ${i.tracker ? F$(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: U$(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${p ? this.renderHint(h) : $}
          ${this.pendingDraft && ((v = this.dialog) == null ? void 0 : v.kind) !== "restore" ? oy({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${B$({
      grid: this.grid,
      zoomPct: Math.round(r * (p ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? u(`snap.${i.snap.kind}`) : null,
      onGrid: (w) => {
        this.grid = w;
      },
      cones: this.cones,
      onCones: (w) => {
        this.cones = w;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: p
    })}
        ${this.automationsMenu ? P$(this.automationsMenu, (w) => this.pickAutomation(w), () => this.closeAutomationsMenu()) : $}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
Xr.styles = j$;
let Z = Xr;
Y([
  Ze({ attribute: !1 })
], Z.prototype, "hass");
Y([
  Ze({ type: Boolean })
], Z.prototype, "narrow");
Y([
  Ze({ attribute: !1 })
], Z.prototype, "panel");
Y([
  X()
], Z.prototype, "plan");
Y([
  X()
], Z.prototype, "automationsMenu");
Y([
  X()
], Z.prototype, "loadError");
Y([
  X()
], Z.prototype, "selection");
Y([
  X()
], Z.prototype, "toolId");
Y([
  X()
], Z.prototype, "wallType");
Y([
  X()
], Z.prototype, "thickness");
Y([
  X()
], Z.prototype, "boxMeasure");
Y([
  X()
], Z.prototype, "grid");
Y([
  X()
], Z.prototype, "mode");
Y([
  X()
], Z.prototype, "bindFilter");
Y([
  X()
], Z.prototype, "bindQuery");
Y([
  X()
], Z.prototype, "railCollapsed");
Y([
  X()
], Z.prototype, "showAll");
Y([
  X()
], Z.prototype, "zoneQuery");
Y([
  X()
], Z.prototype, "cones");
Y([
  X()
], Z.prototype, "nextProps");
Y([
  X()
], Z.prototype, "nextObj");
Y([
  X()
], Z.prototype, "planView");
Y([
  X()
], Z.prototype, "powerView");
Y([
  X()
], Z.prototype, "placeDeviceId");
Y([
  X()
], Z.prototype, "size");
Y([
  X()
], Z.prototype, "dialog");
Y([
  X()
], Z.prototype, "notice");
Y([
  X()
], Z.prototype, "fieldNotice");
Y([
  X()
], Z.prototype, "pendingDraft");
Y([
  X()
], Z.prototype, "ruleDraft");
Y([
  X()
], Z.prototype, "plans");
Y([
  X()
], Z.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", Z);
export {
  Z as PlanStudioPanel
};
