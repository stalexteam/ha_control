/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mi = globalThis, js = mi.ShadowRoot && (mi.ShadyCSS === void 0 || mi.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qs = Symbol(), il = /* @__PURE__ */ new WeakMap();
let Mc = class {
  constructor(e, n, i) {
    if (this._$cssResult$ = !0, i !== qs) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = n;
  }
  get styleSheet() {
    let e = this.o;
    const n = this.t;
    if (js && e === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (e = il.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && il.set(n, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const vh = (t) => new Mc(typeof t == "string" ? t : t + "", void 0, qs), _c = (t, ...e) => {
  const n = t.length === 1 ? t[0] : e.reduce((i, o, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new Mc(n, t, qs);
}, $h = (t, e) => {
  if (js) t.adoptedStyleSheets = e.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of e) {
    const i = document.createElement("style"), o = mi.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = n.cssText, t.appendChild(i);
  }
}, ol = js ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let n = "";
  for (const i of e.cssRules) n += i.cssText;
  return vh(n);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yh, defineProperty: xh, getOwnPropertyDescriptor: kh, getOwnPropertyNames: Mh, getOwnPropertySymbols: _h, getPrototypeOf: Ah } = Object, rt = globalThis, sl = rt.trustedTypes, Sh = sl ? sl.emptyScript : "", Eo = rt.reactiveElementPolyfillSupport, fn = (t, e) => t, Ai = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Sh : null;
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
} }, Zs = (t, e) => !yh(t, e), rl = { attribute: !0, type: String, converter: Ai, reflect: !1, useDefault: !1, hasChanged: Zs };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), rt.litPropertyMetadata ?? (rt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Nt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, n = rl) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(e, n), !n.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(e, i, n);
      o !== void 0 && xh(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, n, i) {
    const { get: o, set: s } = kh(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? rl;
  }
  static _$Ei() {
    if (this.hasOwnProperty(fn("elementProperties"))) return;
    const e = Ah(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(fn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(fn("properties"))) {
      const n = this.properties, i = [...Mh(n), ..._h(n)];
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
      for (const o of i) n.unshift(ol(o));
    } else e !== void 0 && n.push(ol(e));
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
    return $h(e, this.constructor.elementStyles), e;
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
      const r = (((s = i.converter) == null ? void 0 : s.toAttribute) !== void 0 ? i.converter : Ai).toAttribute(n, i.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, n) {
    var s, r;
    const i = this.constructor, o = i._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const l = i.getPropertyOptions(o), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : Ai;
      this._$Em = o;
      const c = a.fromAttribute(n, l.type);
      this[o] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, n, i, o = !1, s) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (o === !1 && (s = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? Zs)(s, n) || i.useDefault && i.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
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
Nt.elementStyles = [], Nt.shadowRootOptions = { mode: "open" }, Nt[fn("elementProperties")] = /* @__PURE__ */ new Map(), Nt[fn("finalized")] = /* @__PURE__ */ new Map(), Eo == null || Eo({ ReactiveElement: Nt }), (rt.reactiveElementVersions ?? (rt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pn = globalThis, ll = (t) => t, Si = pn.trustedTypes, al = Si ? Si.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ac = "$lit$", tt = `lit$${Math.random().toFixed(9).slice(2)}$`, Sc = "?" + tt, Lh = `<${Sc}>`, xt = document, Sn = () => xt.createComment(""), Ln = (t) => t === null || typeof t != "object" && typeof t != "function", Gs = Array.isArray, Ch = (t) => Gs(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Oo = `[ 	
\f\r]`, en = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, cl = /-->/g, ul = />/g, pt = RegExp(`>|${Oo}(?:([^\\s"'>=/]+)(${Oo}*=${Oo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), dl = /'/g, hl = /"/g, Lc = /^(?:script|style|textarea|title)$/i, Cc = (t) => (e, ...n) => ({ _$litType$: t, strings: e, values: n }), g = Cc(1), _ = Cc(2), ye = Symbol.for("lit-noChange"), $ = Symbol.for("lit-nothing"), fl = /* @__PURE__ */ new WeakMap(), bt = xt.createTreeWalker(xt, 129);
function Ic(t, e) {
  if (!Gs(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return al !== void 0 ? al.createHTML(e) : e;
}
const Ih = (t, e) => {
  const n = t.length - 1, i = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = en;
  for (let l = 0; l < n; l++) {
    const a = t[l];
    let c, h, f = -1, d = 0;
    for (; d < a.length && (r.lastIndex = d, h = r.exec(a), h !== null); ) d = r.lastIndex, r === en ? h[1] === "!--" ? r = cl : h[1] !== void 0 ? r = ul : h[2] !== void 0 ? (Lc.test(h[2]) && (o = RegExp("</" + h[2], "g")), r = pt) : h[3] !== void 0 && (r = pt) : r === pt ? h[0] === ">" ? (r = o ?? en, f = -1) : h[1] === void 0 ? f = -2 : (f = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? pt : h[3] === '"' ? hl : dl) : r === hl || r === dl ? r = pt : r === cl || r === ul ? r = en : (r = pt, o = void 0);
    const p = r === pt && t[l + 1].startsWith("/>") ? " " : "";
    s += r === en ? a + Lh : f >= 0 ? (i.push(c), a.slice(0, f) + Ac + a.slice(f) + tt + p) : a + tt + (f === -2 ? l : p);
  }
  return [Ic(t, s + (t[n] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Cn {
  constructor({ strings: e, _$litType$: n }, i) {
    let o;
    this.parts = [];
    let s = 0, r = 0;
    const l = e.length - 1, a = this.parts, [c, h] = Ih(e, n);
    if (this.el = Cn.createElement(c, i), bt.currentNode = this.el.content, n === 2 || n === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (o = bt.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const f of o.getAttributeNames()) if (f.endsWith(Ac)) {
          const d = h[r++], p = o.getAttribute(f).split(tt), m = /([.?@])?(.*)/.exec(d);
          a.push({ type: 1, index: s, name: m[2], strings: p, ctor: m[1] === "." ? Oh : m[1] === "?" ? Dh : m[1] === "@" ? Nh : oo }), o.removeAttribute(f);
        } else f.startsWith(tt) && (a.push({ type: 6, index: s }), o.removeAttribute(f));
        if (Lc.test(o.tagName)) {
          const f = o.textContent.split(tt), d = f.length - 1;
          if (d > 0) {
            o.textContent = Si ? Si.emptyScript : "";
            for (let p = 0; p < d; p++) o.append(f[p], Sn()), bt.nextNode(), a.push({ type: 2, index: ++s });
            o.append(f[d], Sn());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Sc) a.push({ type: 2, index: s });
      else {
        let f = -1;
        for (; (f = o.data.indexOf(tt, f + 1)) !== -1; ) a.push({ type: 7, index: s }), f += tt.length - 1;
      }
      s++;
    }
  }
  static createElement(e, n) {
    const i = xt.createElement("template");
    return i.innerHTML = e, i;
  }
}
function Ft(t, e, n = t, i) {
  var r, l;
  if (e === ye) return e;
  let o = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const s = Ln(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== s && ((l = o == null ? void 0 : o._$AO) == null || l.call(o, !1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = o : n._$Cl = o), o !== void 0 && (e = Ft(t, o._$AS(t, e.values), o, i)), e;
}
class Eh {
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
    const { el: { content: n }, parts: i } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? xt).importNode(n, !0);
    bt.currentNode = o;
    let s = bt.nextNode(), r = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new io(s, s.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (c = new Ph(s, this, e)), this._$AV.push(c), a = i[++l];
      }
      r !== (a == null ? void 0 : a.index) && (s = bt.nextNode(), r++);
    }
    return bt.currentNode = xt, o;
  }
  p(e) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, n), n += i.strings.length - 2) : i._$AI(e[n])), n++;
  }
}
let io = class Ec {
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
    e = Ft(this, e, n), Ln(e) ? e === $ || e == null || e === "" ? (this._$AH !== $ && this._$AR(), this._$AH = $) : e !== this._$AH && e !== ye && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ch(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== $ && Ln(this._$AH) ? this._$AA.nextSibling.data = e : this.T(xt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: n, _$litType$: i } = e, o = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Cn.createElement(Ic(i.h, i.h[0]), this.options)), i);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === o) this._$AH.p(n);
    else {
      const r = new Eh(o, this), l = r.u(this.options);
      r.p(n), this.T(l), this._$AH = r;
    }
  }
  _$AC(e) {
    let n = fl.get(e.strings);
    return n === void 0 && fl.set(e.strings, n = new Cn(e)), n;
  }
  k(e) {
    Gs(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, o = 0;
    for (const s of e) o === n.length ? n.push(i = new Ec(this.O(Sn()), this.O(Sn()), this, this.options)) : i = n[o], i._$AI(s), o++;
    o < n.length && (this._$AR(i && i._$AB.nextSibling, o), n.length = o);
  }
  _$AR(e = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); e !== this._$AB; ) {
      const o = ll(e).nextSibling;
      ll(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var n;
    this._$AM === void 0 && (this._$Cv = e, (n = this._$AP) == null || n.call(this, e));
  }
};
class oo {
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
    if (s === void 0) e = Ft(this, e, n, 0), r = !Ln(e) || e !== this._$AH && e !== ye, r && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = s[0], a = 0; a < s.length - 1; a++) c = Ft(this, l[i + a], n, a), c === ye && (c = this._$AH[a]), r || (r = !Ln(c) || c !== this._$AH[a]), c === $ ? e = $ : e !== $ && (e += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === $ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Oh extends oo {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === $ ? void 0 : e;
  }
}
class Dh extends oo {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== $);
  }
}
let Nh = class extends oo {
  constructor(e, n, i, o, s) {
    super(e, n, i, o, s), this.type = 5;
  }
  _$AI(e, n = this) {
    if ((e = Ft(this, e, n, 0) ?? $) === ye) return;
    const i = this._$AH, o = e === $ && i !== $ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== $ && (i === $ || o);
    o && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
};
class Ph {
  constructor(e, n, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Ft(this, e);
  }
}
const Th = { I: io }, Do = pn.litHtmlPolyfillSupport;
Do == null || Do(Cn, io), (pn.litHtmlVersions ?? (pn.litHtmlVersions = [])).push("3.3.3");
const Vh = (t, e, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? e;
  let o = i._$litPart$;
  if (o === void 0) {
    const s = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = o = new io(e.insertBefore(Sn(), s), s, void 0, n ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vt = globalThis;
let zt = class extends Nt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Vh(n, this.renderRoot, this.renderOptions);
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
    return ye;
  }
};
var kc;
zt._$litElement$ = !0, zt.finalized = !0, (kc = vt.litElementHydrateSupport) == null || kc.call(vt, { LitElement: zt });
const No = vt.litElementPolyfillSupport;
No == null || No({ LitElement: zt });
(vt.litElementVersions ?? (vt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Hh = { attribute: !0, type: String, converter: Ai, reflect: !1, hasChanged: Zs }, zh = (t = Hh, e, n) => {
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
function Ke(t) {
  return (e, n) => typeof n == "object" ? zh(t, e, n) : ((i, o, s) => {
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
  return Ke({ ...t, state: !0, attribute: !1 });
}
function oe() {
  const t = new Uint8Array(6);
  return crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function Ks(t, e) {
  const n = new Set(e);
  let i = 1;
  for (; n.has(`${t} ${i}`); ) i++;
  return `${t} ${i}`;
}
const $t = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Rh = { role: "voltage", domains: ["sensor"], deviceClasses: ["voltage"], units: ["V", "kV", "mV"], primary: !1 }, Bh = { ...$t, role: "power_in" }, Fh = { ...$t, role: "power_out" }, Uh = { role: "sun", domains: ["sun"], primary: !0 }, Wh = ["on", "off", "auto"], Xs = (t) => Wh.includes(t), Po = (t) => ({
  role: t,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), jh = {
  ceiling_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  wall_light: [{ role: "control", domains: ["light", "switch"], primary: !0 }],
  motion_sensor: [{ role: "motion", domains: ["binary_sensor"], deviceClasses: ["occupancy", "motion", "presence"], primary: !0 }],
  illuminance_sensor: [
    { role: "illuminance", domains: ["sensor"], deviceClasses: ["illuminance"], units: ["lx"], primary: !0 },
    // Fallback while the lux reading is unusable; one of illuminance / sun is enough (see PRIMARY_MODE).
    Uh
  ],
  climate_sensor: [
    { role: "temperature", domains: ["sensor"], deviceClasses: ["temperature"], units: ["°C", "°F"], primary: !0 },
    { role: "humidity", domains: ["sensor"], deviceClasses: ["humidity"], units: ["%"], primary: !0 }
  ],
  wall_switch: [{ role: "state", domains: ["switch", "light", "binary_sensor"], primary: !0 }],
  valve: [{ role: "state", domains: ["valve", "switch"], primary: !0 }],
  leak_sensor: [{ role: "leak", domains: ["binary_sensor"], deviceClasses: ["moisture"], primary: !0 }],
  // Active roles depend on the flags: see activeRoleSpecs.
  smart_button: [Po("on"), Po("off"), Po("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, $t],
  // Fixed by the device (virtual.<id>, see virtualEntity); never chosen, so the Binding step shows no field for it.
  virtual_switch: [{ role: "control", domains: ["virtual"], primary: !0 }],
  // Announcements: the integration binds a speaker strictly to a player and an optional voice (needed to say text); a phone binds
  // no entity (its notify service is a prop).
  speaker: [{ role: "player", domains: ["media_player"], primary: !0 }, { role: "voice", domains: ["tts"], primary: !1 }],
  phone: [],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  // Every role optional (a dummy has none); active roles depend on the inverter flag: see activeRoleSpecs.
  equipment: [{ role: "control", domains: ["switch"], primary: !1 }, $t, Rh, Bh, Fh]
}, Ys = (t) => {
  let e = 0;
  for (const n of t) n !== "bound" && e++;
  return e;
}, qh = { climate_sensor: "any", illuminance_sensor: "any" };
function Le(t) {
  const e = t.props, n = jh[e.kind];
  if (e.kind === "smart_button")
    return n.filter(({ role: i }) => i === "off" ? e.separateOff : i === "auto" ? e.autoEnabled : !0);
  if (e.kind === "equipment") {
    const i = !!e.inverter;
    return n.filter(({ role: o }) => o === "power" ? !i : o === "power_in" || o === "power_out" ? i : !0);
  }
  return n;
}
function Oc(t) {
  return new Set(Le(t).map((e) => e.role));
}
function so(t, e, n, i) {
  var l;
  const o = t.devices.find((a) => a.id === e);
  if (!o || !Oc(o).has(n) || o.props.kind === "virtual_switch") return t;
  const s = (l = o.bindings) == null ? void 0 : l[n];
  if (i === null || i === "") {
    if (s === void 0) return t;
    const a = { ...o.bindings };
    delete a[n];
    const c = { ...o, bindings: a };
    if (Object.keys(a).length === 0 && delete c.bindings, n === "control" && o.props.kind === "equipment" && o.props.controllable) {
      const { controllable: h, ...f } = o.props;
      c.props = f;
    }
    return { ...t, devices: t.devices.map((h) => h === o ? c : h) };
  }
  if (s === i) return t;
  const r = { ...o, bindings: { ...o.bindings, [n]: i } };
  return { ...t, devices: t.devices.map((a) => a === o ? r : a) };
}
function Zh(t, e) {
  if (t.props.kind === "phone") return t.props.notify ? "bound" : "unbound";
  if (t.props.kind === "virtual_switch") return "bound";
  const n = t.bindings ?? {}, i = Object.values(n).filter((l) => !!l), o = Le(t).filter((l) => l.primary);
  if (i.length === 0) return o.length === 0 ? "bound" : "unbound";
  if (i.some((l) => e(l) === "missing")) return "missing";
  const s = o.filter((l) => !!n[l.role]);
  return (qh[t.props.kind] === "any" ? s.length > 0 : s.length === o.length) ? "bound" : "partial";
}
function Gh(t) {
  const e = Le(t);
  return { filled: e.filter((n) => {
    var i;
    return !!((i = t.bindings) != null && i[n.role]);
  }).length, total: e.length };
}
const Kh = (t) => t.slot === 0 ? t.event : `${t.slot}_${t.event}`;
function ps(t, e) {
  var o;
  const n = (o = t.bindings) == null ? void 0 : o[e];
  if (!n) return null;
  const i = t.props;
  return i.kind !== "smart_button" || !Xs(e) ? n : `${n}|${Kh(i[e])}`;
}
function Xh(t, e, n) {
  const i = ps(e, n);
  return i === null ? [] : t.devices.filter((o) => o.id !== e.id && Le(o).some((s) => ps(o, s.role) === i));
}
function Yh(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Le(t)) {
    const o = Xs(i) ? ps(t, i) : null;
    o !== null && (e.has(o) ? n.push(i) : e.add(o));
  }
  return n;
}
function ro(t) {
  if (!t.bindings) return t;
  const e = Oc(t), n = Object.entries(t.bindings).filter(([o, s]) => e.has(o) && !!s);
  if (n.length > 0 && n.length === Object.keys(t.bindings).length) return t;
  const i = { ...t };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const Dc = (t) => t === "wall_switch" || t === "smart_button", lo = (t) => t === "wall_switch" || t === "smart_button" || t === "valve", In = (t) => t === "wall" ? "wall" : "free", Qh = [100, 125, 150], Qs = "mdi:cube-outline", pl = ["single", "double", "hold"], Jh = ["say", "play", "notify"], xe = (t) => Jh.includes(t), Ge = (t) => "button" in t, Se = (t) => "event" in t, ef = {
  bearing: 400
}, gi = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Nc(t = oe(), e = "Level 1") {
  return { id: t, name: e, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function ml(t) {
  return {
    id: oe(),
    name: t,
    schemaVersion: 2,
    revision: 0,
    levels: [Nc()]
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
  virtual_switch: ["free", "wall"],
  speaker: ["free", "wall"],
  // A phone is never on the plan: it is added under Not on the plan.
  phone: [],
  equipment: ["free", "wall"],
  climate_sensor: ["free", "wall"],
  exhaust_fan: ["wall"]
}, Ut = 90, Pc = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function ct(t, e) {
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
const En = (t) => `virtual.${t}`;
function tf(t) {
  if (t.props.kind !== "virtual_switch") return t;
  const e = t.bindings;
  return e && Object.keys(e).length === 1 && e.control === En(t.id) ? t : { ...t, bindings: { control: En(t.id) } };
}
const nf = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Qs
};
function of(t) {
  const e = t.props;
  if (e.kind !== "equipment" || !("symbol" in e) && typeof e.icon == "string") return t;
  const { symbol: n, ...i } = e, o = typeof e.icon == "string" ? e.icon : nf[String(n)] ?? Qs;
  return { ...t, props: { ...i, icon: o } };
}
function sf(t) {
  var i;
  if (t.props.kind !== "switch") return t;
  const e = (i = t.bindings) == null ? void 0 : i.action, n = In(t.placement.mode);
  return e ? { ...t, props: ct("smart_button", n), bindings: { on: e } } : { ...t, props: ct("wall_switch", n) };
}
const Tc = (t, e, n) => typeof t == "number" && Number.isInteger(t) && t >= e && t <= n;
function rf(t, e) {
  const n = t !== null && typeof t == "object" ? t : {}, i = Tc(n.slot, 0, 9) ? n.slot : e.slot, o = typeof n.event == "string" && n.event ? n.event : e.event;
  return i === n.slot && o === n.event ? t : { slot: i, event: o };
}
function lf(t) {
  const e = t.props.kind;
  if (!lo(e)) return t;
  const n = t.props;
  let i = null;
  for (const [o, s] of Object.entries(ct(e, In(t.placement.mode)))) {
    const r = n[o], l = o === "on" || o === "off" || o === "auto" ? rf(r, s) : o === "windowSec" ? Tc(r, 1, 10) ? r : s : typeof r == typeof s ? r : s;
    l !== r && ((i ?? (i = { ...n }))[o] = l);
  }
  return i ? { ...t, props: i } : t;
}
function af(t) {
  if (t.props.kind !== "climate_sensor" || !("zoneIds" in t.props)) return t;
  const { zoneIds: e, ...n } = t.props;
  return { ...t, props: n };
}
function cf(t) {
  if (!lo(t.props.kind) || !("defaultOutput" in t.props)) return t;
  const { defaultOutput: e, ...n } = t.props;
  return { ...t, props: n };
}
function uf(t) {
  if (!t.devices) return { ...t, devices: [] };
  const e = t.devices.map((n) => tf(ro(af(cf(lf(sf(of(n))))))));
  return e.some((n, i) => n !== t.devices[i]) ? { ...t, devices: e } : t;
}
function B(t, e) {
  return { x: t.x + e.x, y: t.y + e.y };
}
function P(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function T(t, e) {
  return { x: t.x * e, y: t.y * e };
}
function G(t, e) {
  return t.x * e.x + t.y * e.y;
}
function pe(t, e) {
  return t.x * e.y - t.y * e.x;
}
function Vc(t) {
  return Math.hypot(t.x, t.y);
}
function R(t, e) {
  return Vc(P(e, t));
}
function ao(t) {
  const e = Vc(t);
  return e === 0 ? { x: 0, y: 0 } : T(t, 1 / e);
}
function le(t) {
  return { x: t.y, y: -t.x };
}
function Hc(t, e, n) {
  return { x: t.x + (e.x - t.x) * n, y: t.y + (e.y - t.y) * n };
}
function ze(t, e, n, i) {
  const o = pe(e, i);
  if (Math.abs(o) < 1e-9) return null;
  const s = pe(P(n, t), i) / o;
  return B(t, T(e, s));
}
function co(t, e, n) {
  const i = P(n, e), o = G(i, i);
  return o === 0 ? 0 : G(P(t, e), i) / o;
}
function be(t, e, n) {
  const i = P(n, e), o = G(i, i), s = o === 0 ? 0 : Math.max(0, Math.min(1, G(P(t, e), i) / o));
  return R(t, B(e, T(i, s)));
}
function ut(t, e) {
  let n = !1;
  for (let i = 0, o = e.length - 1; i < e.length; o = i++) {
    const s = e[i], r = e[o];
    s.y > t.y != r.y > t.y && t.x < (r.x - s.x) * (t.y - s.y) / (r.y - s.y) + s.x && (n = !n);
  }
  return n;
}
function Oe(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const i = t[n], o = t[(n + 1) % t.length];
    e += i.x * o.y - o.x * i.y;
  }
  return e / 2;
}
let dt = class {
  constructor(e, n) {
    this.next = null, this.key = e, this.data = n, this.left = null, this.right = null;
  }
};
function df(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}
function nt(t, e, n) {
  const i = new dt(null, null);
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
function To(t, e, n, i) {
  const o = new dt(t, e);
  if (n === null)
    return o.left = o.right = null, o;
  n = nt(t, n, i);
  const s = i(t, n.key);
  return s < 0 ? (o.left = n.left, o.right = n, n.left = null) : s >= 0 && (o.right = n.right, o.left = n, n.right = null), o;
}
function gl(t, e, n) {
  let i = null, o = null;
  if (e) {
    e = nt(t, e, n);
    const s = n(e.key, t);
    s === 0 ? (i = e.left, o = e.right) : s < 0 ? (o = e.right, e.right = null, i = e) : (i = e.left, e.left = null, o = e);
  }
  return { left: i, right: o };
}
function hf(t, e, n) {
  return e === null ? t : (t === null || (e = nt(t.key, e, n), e.left = t), e);
}
function ms(t, e, n, i, o) {
  if (t) {
    i(`${e}${n ? "└── " : "├── "}${o(t)}
`);
    const s = e + (n ? "    " : "│   ");
    t.left && ms(t.left, s, !1, i, o), t.right && ms(t.right, s, !0, i, o);
  }
}
class er {
  constructor(e = df) {
    this._root = null, this._size = 0, this._comparator = e;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(e, n) {
    return this._size++, this._root = To(e, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(e, n) {
    const i = new dt(e, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const o = this._comparator, s = nt(e, this._root, o), r = o(e, s.key);
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
    return n === null ? null : (n = nt(e, n, i), i(e, n.key) === 0 ? (n.left === null ? o = n.right : (o = nt(e, n.left, i), o.right = n.right), this._size--, o) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let e = this._root;
    if (e) {
      for (; e.left; ) e = e.left;
      return this._root = nt(e.key, this._root, this._comparator), this._root = this._remove(e.key, this._root, this._comparator), { key: e.key, data: e.data };
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
    return this._root && (this._root = nt(e, this._root, this._comparator), this._comparator(e, this._root.key) !== 0) ? null : this._root;
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
    return pf(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(e, n = [], i = !1) {
    let o = e.length;
    const s = this._comparator;
    if (i && ws(e, n, 0, o - 1, s), this._root === null)
      this._root = gs(e, n, 0, o), this._size = o;
    else {
      const r = mf(
        this.toList(),
        ff(e, n),
        s
      );
      o = this._size + o, this._root = bs({ head: r }, 0, o);
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
    return ms(this._root, "", !0, (i) => n.push(i), e), n.join("");
  }
  update(e, n, i) {
    const o = this._comparator;
    let { left: s, right: r } = gl(e, this._root, o);
    o(e, n) < 0 ? r = To(n, i, r, o) : s = To(n, i, s, o), this._root = hf(s, r, o);
  }
  split(e) {
    return gl(e, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let e = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      e !== null ? (n.push(e), e = e.left) : n.length !== 0 ? (e = n.pop(), yield e, e = e.right) : i = !0;
  }
}
function gs(t, e, n, i) {
  const o = i - n;
  if (o > 0) {
    const s = n + Math.floor(o / 2), r = t[s], l = e[s], a = new dt(r, l);
    return a.left = gs(t, e, n, s), a.right = gs(t, e, s + 1, i), a;
  }
  return null;
}
function ff(t, e) {
  const n = new dt(null, null);
  let i = n;
  for (let o = 0; o < t.length; o++)
    i = i.next = new dt(t[o], e[o]);
  return i.next = null, n.next;
}
function pf(t) {
  let e = t;
  const n = [];
  let i = !1;
  const o = new dt(null, null);
  let s = o;
  for (; !i; )
    e ? (n.push(e), e = e.left) : n.length > 0 ? (e = s = s.next = n.pop(), e = e.right) : i = !0;
  return s.next = null, o.next;
}
function bs(t, e, n) {
  const i = n - e;
  if (i > 0) {
    const o = e + Math.floor(i / 2), s = bs(t, e, o), r = t.head;
    return r.left = s, t.head = t.head.next, r.right = bs(t, o + 1, n), r;
  }
  return null;
}
function mf(t, e, n) {
  const i = new dt(null, null);
  let o = i, s = t, r = e;
  for (; s !== null && r !== null; )
    n(s.key, r.key) < 0 ? (o.next = s, s = s.next) : (o.next = r, r = r.next), o = o.next;
  return s !== null ? o.next = s : r !== null && (o.next = r), i.next;
}
function ws(t, e, n, i, o) {
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
  ws(t, e, n, l, o), ws(t, e, l + 1, i, o);
}
const qe = 11102230246251565e-32, ue = 134217729, gf = (3 + 8 * qe) * qe;
function Vo(t, e, n, i, o) {
  let s, r, l, a, c = e[0], h = i[0], f = 0, d = 0;
  h > c == h > -c ? (s = c, c = e[++f]) : (s = h, h = i[++d]);
  let p = 0;
  if (f < t && d < n)
    for (h > c == h > -c ? (r = c + s, l = s - (r - c), c = e[++f]) : (r = h + s, l = s - (r - h), h = i[++d]), s = r, l !== 0 && (o[p++] = l); f < t && d < n; )
      h > c == h > -c ? (r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++f]) : (r = s + h, a = r - s, l = s - (r - a) + (h - a), h = i[++d]), s = r, l !== 0 && (o[p++] = l);
  for (; f < t; )
    r = s + c, a = r - s, l = s - (r - a) + (c - a), c = e[++f], s = r, l !== 0 && (o[p++] = l);
  for (; d < n; )
    r = s + h, a = r - s, l = s - (r - a) + (h - a), h = i[++d], s = r, l !== 0 && (o[p++] = l);
  return (s !== 0 || p === 0) && (o[p++] = s), p;
}
function bf(t, e) {
  let n = e[0];
  for (let i = 1; i < t; i++) n += e[i];
  return n;
}
function L(t) {
  return new Float64Array(t);
}
const wf = (3 + 16 * qe) * qe, vf = (2 + 12 * qe) * qe, $f = (9 + 64 * qe) * qe * qe, Ot = L(4), bl = L(8), wl = L(12), vl = L(16), he = L(4);
function yf(t, e, n, i, o, s, r) {
  let l, a, c, h, f, d, p, m, w, v, b, y, x, M, k, S, C, A;
  const N = t - o, U = n - o, I = e - s, O = i - s;
  M = N * O, d = ue * N, p = d - (d - N), m = N - p, d = ue * O, w = d - (d - O), v = O - w, k = m * v - (M - p * w - m * w - p * v), S = I * U, d = ue * I, p = d - (d - I), m = I - p, d = ue * U, w = d - (d - U), v = U - w, C = m * v - (S - p * w - m * w - p * v), b = k - C, f = k - b, Ot[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, Ot[1] = x - (b + f) + (f - S), A = y + b, f = A - y, Ot[2] = y - (A - f) + (b - f), Ot[3] = A;
  let E = bf(4, Ot), D = vf * r;
  if (E >= D || -E >= D || (f = t - N, l = t - (N + f) + (f - o), f = n - U, c = n - (U + f) + (f - o), f = e - I, a = e - (I + f) + (f - s), f = i - O, h = i - (O + f) + (f - s), l === 0 && a === 0 && c === 0 && h === 0) || (D = $f * r + gf * Math.abs(E), E += N * h + O * l - (I * c + U * a), E >= D || -E >= D)) return E;
  M = l * O, d = ue * l, p = d - (d - l), m = l - p, d = ue * O, w = d - (d - O), v = O - w, k = m * v - (M - p * w - m * w - p * v), S = a * U, d = ue * a, p = d - (d - a), m = a - p, d = ue * U, w = d - (d - U), v = U - w, C = m * v - (S - p * w - m * w - p * v), b = k - C, f = k - b, he[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, he[1] = x - (b + f) + (f - S), A = y + b, f = A - y, he[2] = y - (A - f) + (b - f), he[3] = A;
  const H = Vo(4, Ot, 4, he, bl);
  M = N * h, d = ue * N, p = d - (d - N), m = N - p, d = ue * h, w = d - (d - h), v = h - w, k = m * v - (M - p * w - m * w - p * v), S = I * c, d = ue * I, p = d - (d - I), m = I - p, d = ue * c, w = d - (d - c), v = c - w, C = m * v - (S - p * w - m * w - p * v), b = k - C, f = k - b, he[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, he[1] = x - (b + f) + (f - S), A = y + b, f = A - y, he[2] = y - (A - f) + (b - f), he[3] = A;
  const q = Vo(H, bl, 4, he, wl);
  M = l * h, d = ue * l, p = d - (d - l), m = l - p, d = ue * h, w = d - (d - h), v = h - w, k = m * v - (M - p * w - m * w - p * v), S = a * c, d = ue * a, p = d - (d - a), m = a - p, d = ue * c, w = d - (d - c), v = c - w, C = m * v - (S - p * w - m * w - p * v), b = k - C, f = k - b, he[0] = k - (b + f) + (f - C), y = M + b, f = y - M, x = M - (y - f) + (b - f), b = x - S, f = x - b, he[1] = x - (b + f) + (f - S), A = y + b, f = A - y, he[2] = y - (A - f) + (b - f), he[3] = A;
  const V = Vo(q, wl, 4, he, vl);
  return vl[V - 1];
}
function xf(t, e, n, i, o, s) {
  const r = (e - s) * (n - o), l = (t - o) * (i - s), a = r - l, c = Math.abs(r + l);
  return Math.abs(a) >= wf * c ? a : -yf(t, e, n, i, o, s, c);
}
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(8);
L(8);
L(8);
L(4);
L(8);
L(8);
L(16);
L(12);
L(192);
L(192);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(8);
L(8);
L(8);
L(8);
L(8);
L(8);
L(8);
L(8);
L(8);
L(4);
L(4);
L(4);
L(8);
L(16);
L(16);
L(16);
L(32);
L(32);
L(48);
L(64);
L(1152);
L(1152);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(4);
L(24);
L(24);
L(24);
L(24);
L(24);
L(24);
L(24);
L(24);
L(24);
L(24);
L(1152);
L(1152);
L(1152);
L(1152);
L(1152);
L(2304);
L(2304);
L(3456);
L(5760);
L(8);
L(8);
L(8);
L(16);
L(24);
L(48);
L(48);
L(96);
L(192);
L(384);
L(384);
L(384);
L(768);
L(96);
L(96);
L(96);
L(1152);
const tn = (t, e) => t.ll.x <= e.x && e.x <= t.ur.x && t.ll.y <= e.y && e.y <= t.ur.y, vs = (t, e) => {
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
let it = Number.EPSILON;
it === void 0 && (it = Math.pow(2, -52));
const kf = it * it, $l = (t, e) => {
  if (-it < t && t < it && -it < e && e < it)
    return 0;
  const n = t - e;
  return n * n < kf * t * e ? 0 : t < e ? -1 : 1;
};
class Mf {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new yl(), this.yRounder = new yl();
  }
  round(e, n) {
    return {
      x: this.xRounder.round(e),
      y: this.yRounder.round(n)
    };
  }
}
class yl {
  constructor() {
    this.tree = new er(), this.round(0);
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
    if (i !== null && $l(n.key, i.key) === 0)
      return this.tree.remove(e), i.key;
    const o = this.tree.next(n);
    return o !== null && $l(n.key, o.key) === 0 ? (this.tree.remove(e), o.key) : e;
  }
}
const On = new Mf(), bi = (t, e) => t.x * e.y - t.y * e.x, zc = (t, e) => t.x * e.x + t.y * e.y, xl = (t, e, n) => {
  const i = xf(t.x, t.y, e.x, e.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Li = (t) => Math.sqrt(zc(t, t)), _f = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return bi(o, i) / Li(o) / Li(i);
}, Af = (t, e, n) => {
  const i = {
    x: e.x - t.x,
    y: e.y - t.y
  }, o = {
    x: n.x - t.x,
    y: n.y - t.y
  };
  return zc(o, i) / Li(o) / Li(i);
}, kl = (t, e, n) => e.y === 0 ? null : {
  x: t.x + e.x / e.y * (n - t.y),
  y: n
}, Ml = (t, e, n) => e.x === 0 ? null : {
  x: n,
  y: t.y + e.y / e.x * (n - t.x)
}, Sf = (t, e, n, i) => {
  if (e.x === 0) return Ml(n, i, t.x);
  if (i.x === 0) return Ml(t, e, n.x);
  if (e.y === 0) return kl(n, i, t.y);
  if (i.y === 0) return kl(t, e, n.y);
  const o = bi(e, i);
  if (o == 0) return null;
  const s = {
    x: n.x - t.x,
    y: n.y - t.y
  }, r = bi(s, e) / o, l = bi(s, i) / o, a = t.x + l * e.x, c = n.x + r * i.x, h = t.y + l * e.y, f = n.y + r * i.y, d = (a + c) / 2, p = (h + f) / 2;
  return {
    x: d,
    y: p
  };
};
class Me {
  // for ordering sweep events in the sweep event queue
  static compare(e, n) {
    const i = Me.comparePoints(e.point, n.point);
    return i !== 0 ? i : (e.point !== n.point && e.link(n), e.isLeft !== n.isLeft ? e.isLeft ? 1 : -1 : lt.compare(e.segment, n.segment));
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
        sine: _f(this.point, e.point, s.point),
        cosine: Af(this.point, e.point, s.point)
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
let Lf = 0;
class lt {
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
    const l = e.leftSE.point.y, a = n.leftSE.point.y, c = e.rightSE.point.y, h = n.rightSE.point.y;
    if (i < o) {
      if (a < l && a < c) return 1;
      if (a > l && a > c) return -1;
      const f = e.comparePoint(n.leftSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
      const d = n.comparePoint(e.rightSE.point);
      return d !== 0 ? d : -1;
    }
    if (i > o) {
      if (l < a && l < h) return -1;
      if (l > a && l > h) return 1;
      const f = n.comparePoint(e.leftSE.point);
      if (f !== 0) return f;
      const d = e.comparePoint(n.rightSE.point);
      return d < 0 ? 1 : d > 0 ? -1 : 1;
    }
    if (l < a) return -1;
    if (l > a) return 1;
    if (s < r) {
      const f = n.comparePoint(e.rightSE.point);
      if (f !== 0) return f;
    }
    if (s > r) {
      const f = e.comparePoint(n.rightSE.point);
      if (f < 0) return 1;
      if (f > 0) return -1;
    }
    if (s !== r) {
      const f = c - l, d = s - i, p = h - a, m = r - o;
      if (f > d && p < m) return 1;
      if (f < d && p > m) return -1;
    }
    return s > r ? 1 : s < r || c < h ? -1 : c > h ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(e, n, i, o) {
    this.id = ++Lf, this.leftSE = e, e.segment = this, e.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = e, this.rings = i, this.windings = o;
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
    return new lt(a, c, [i], [r]);
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
    const n = this.bbox(), i = e.bbox(), o = vs(n, i);
    if (o === null) return null;
    const s = this.leftSE.point, r = this.rightSE.point, l = e.leftSE.point, a = e.rightSE.point, c = tn(n, l) && this.comparePoint(l) === 0, h = tn(i, s) && e.comparePoint(s) === 0, f = tn(n, a) && this.comparePoint(a) === 0, d = tn(i, r) && e.comparePoint(r) === 0;
    if (h && c)
      return d && !f ? r : !d && f ? a : null;
    if (h)
      return f && s.x === a.x && s.y === a.y ? null : s;
    if (c)
      return d && r.x === l.x && r.y === l.y ? null : l;
    if (d && f) return null;
    if (d) return r;
    if (f) return a;
    const p = Sf(s, this.vector(), l, e.vector());
    return p === null || !tn(o, p) ? null : On.round(p.x, p.y);
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
    const l = new lt(o, r, this.rings.slice(), this.windings.slice());
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
    const o = lt.compare(n, i);
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
      const c = this.rings[l], h = this.windings[l], f = n.indexOf(c);
      f === -1 ? (n.push(c), i.push(h)) : i[f] += h;
    }
    const s = [], r = [];
    for (let l = 0, a = n.length; l < a; l++) {
      if (i[l] === 0) continue;
      const c = n[l], h = c.poly;
      if (r.indexOf(h) === -1)
        if (c.isExterior) s.push(h);
        else {
          r.indexOf(h) === -1 && r.push(h);
          const f = s.indexOf(c.poly);
          f !== -1 && s.splice(f, 1);
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
class _l {
  constructor(e, n, i) {
    if (!Array.isArray(e) || e.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof e[0][0] != "number" || typeof e[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const o = On.round(e[0][0], e[0][1]);
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
      let a = On.round(e[r][0], e[r][1]);
      a.x === s.x && a.y === s.y || (this.segments.push(lt.fromRing(s, a, this)), a.x < this.bbox.ll.x && (this.bbox.ll.x = a.x), a.y < this.bbox.ll.y && (this.bbox.ll.y = a.y), a.x > this.bbox.ur.x && (this.bbox.ur.x = a.x), a.y > this.bbox.ur.y && (this.bbox.ur.y = a.y), s = a);
    }
    (o.x !== s.x || o.y !== s.y) && this.segments.push(lt.fromRing(s, o, this));
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
class Cf {
  constructor(e, n) {
    if (!Array.isArray(e))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new _l(e[0], this, !0), this.bbox = {
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
      const s = new _l(e[i], this, !1);
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
class Al {
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
      const s = new Cf(e[i], this);
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
class Ci {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(e) {
    const n = [];
    for (let i = 0, o = e.length; i < o; i++) {
      const s = e[i];
      if (!s.isInResult() || s.ringOut) continue;
      let r = null, l = s.leftSE, a = s.rightSE;
      const c = [l], h = l.point, f = [];
      for (; r = l, l = a, c.push(l), l.point !== h; )
        for (; ; ) {
          const d = l.getAvailableLinkedEvents();
          if (d.length === 0) {
            const w = c[0].point, v = c[c.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${w.x}, ${w.y}]. Last matching segment found ends at [${v.x}, ${v.y}].`);
          }
          if (d.length === 1) {
            a = d[0].otherSE;
            break;
          }
          let p = null;
          for (let w = 0, v = f.length; w < v; w++)
            if (f[w].point === l.point) {
              p = w;
              break;
            }
          if (p !== null) {
            const w = f.splice(p)[0], v = c.splice(w.index);
            v.unshift(v[0].otherSE), n.push(new Ci(v.reverse()));
            continue;
          }
          f.push({
            index: c.length,
            point: l.point
          });
          const m = l.getLeftmostComparator(r);
          a = d.sort(m)[0].otherSE;
          break;
        }
      n.push(new Ci(c));
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
    for (let c = 1, h = this.events.length - 1; c < h; c++) {
      const f = this.events[c].point, d = this.events[c + 1].point;
      xl(f, e, d) !== 0 && (n.push(f), e = f);
    }
    if (n.length === 1) return null;
    const i = n[0], o = n[1];
    xl(i, e, o) === 0 && n.shift(), n.push(n[0]);
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
class Sl {
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
class If {
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
        if (s.isExteriorRing()) n.push(new Sl(s));
        else {
          const r = s.enclosingRing();
          r.poly || n.push(new Sl(r)), r.poly.addInterior(s);
        }
    }
    return n;
  }
}
class Ef {
  constructor(e) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : lt.compare;
    this.queue = e, this.tree = new er(n), this.segments = [];
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
        const f = l.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (c = f), !l.isAnEndpoint(f))) {
          const d = this._splitSafely(l, f);
          for (let p = 0, m = d.length; p < m; p++)
            i.push(d[p]);
        }
      }
      let h = null;
      if (a) {
        const f = a.getIntersection(n);
        if (f !== null && (n.isAnEndpoint(f) || (h = f), !a.isAnEndpoint(f))) {
          const d = this._splitSafely(a, f);
          for (let p = 0, m = d.length; p < m; p++)
            i.push(d[p]);
        }
      }
      if (c !== null || h !== null) {
        let f = null;
        c === null ? f = h : h === null ? f = c : f = Me.comparePoints(c, h) <= 0 ? c : h, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const d = n.split(f);
        for (let p = 0, m = d.length; p < m; p++)
          i.push(d[p]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(e)) : (this.segments.push(n), n.prev = l);
    } else {
      if (l && a) {
        const c = l.getIntersection(a);
        if (c !== null) {
          if (!l.isAnEndpoint(c)) {
            const h = this._splitSafely(l, c);
            for (let f = 0, d = h.length; f < d; f++)
              i.push(h[f]);
          }
          if (!a.isAnEndpoint(c)) {
            const h = this._splitSafely(a, c);
            for (let f = 0, d = h.length; f < d; f++)
              i.push(h[f]);
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
const Ll = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, Of = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Df {
  run(e, n, i) {
    Ie.type = e, On.reset();
    const o = [new Al(n, !0)];
    for (let f = 0, d = i.length; f < d; f++)
      o.push(new Al(i[f], !1));
    if (Ie.numMultiPolys = o.length, Ie.type === "difference") {
      const f = o[0];
      let d = 1;
      for (; d < o.length; )
        vs(o[d].bbox, f.bbox) !== null ? d++ : o.splice(d, 1);
    }
    if (Ie.type === "intersection")
      for (let f = 0, d = o.length; f < d; f++) {
        const p = o[f];
        for (let m = f + 1, w = o.length; m < w; m++)
          if (vs(p.bbox, o[m].bbox) === null) return [];
      }
    const s = new er(Me.compare);
    for (let f = 0, d = o.length; f < d; f++) {
      const p = o[f].getSweepEvents();
      for (let m = 0, w = p.length; m < w; m++)
        if (s.insert(p[m]), s.size > Ll)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Ef(s);
    let l = s.size, a = s.pop();
    for (; a; ) {
      const f = a.key;
      if (s.size === l) {
        const p = f.segment;
        throw new Error(`Unable to pop() ${f.isLeft ? "left" : "right"} SweepEvent [${f.point.x}, ${f.point.y}] from segment #${p.id} [${p.leftSE.point.x}, ${p.leftSE.point.y}] -> [${p.rightSE.point.x}, ${p.rightSE.point.y}] from queue.`);
      }
      if (s.size > Ll)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > Of)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const d = r.process(f);
      for (let p = 0, m = d.length; p < m; p++) {
        const w = d[p];
        w.consumedBy === void 0 && s.insert(w);
      }
      l = s.size, a = s.pop();
    }
    On.reset();
    const c = Ci.factory(r.segments);
    return new If(c).getGeom();
  }
}
const Ie = new Df(), Nf = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("union", t, n);
}, Pf = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("intersection", t, n);
}, Tf = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("xor", t, n);
}, Vf = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return Ie.run("difference", t, n);
};
var Rc = {
  union: Nf,
  intersection: Pf,
  xor: Tf,
  difference: Vf
};
const Bc = 3, Hf = 1e-6;
function uo(t, e) {
  const n = t.nodes.find((i) => i.id === e);
  if (!n) throw new Error(`node not found: ${e}`);
  return n;
}
function ne(t, e) {
  const n = uo(t, e);
  return { x: n.x, y: n.y };
}
function Lt(t, e) {
  const n = t.walls.find((s) => s.id === e);
  if (!n) return null;
  const i = t.nodes.find((s) => s.id === n.a), o = t.nodes.find((s) => s.id === n.b);
  return !i || !o ? null : R(i, o);
}
function Fc(t, e, n, i) {
  const o = n, [s, r] = i === "left" ? [0, o] : i === "right" ? [o, 0] : [o / 2, o / 2];
  return { a: t, b: e, dir: ao(P(e, t)), len: R(t, e), leftOff: s, rightOff: r };
}
function ae(t, e) {
  return Fc(ne(t, e.a), ne(t, e.b), e.thickness, e.baseline);
}
function Xe(t, e) {
  const n = P(e, t.a);
  return { t: G(n, t.dir), side: G(n, le(t.dir)) };
}
function Cl(t, e) {
  const { f: n } = t;
  return e === "a" ? { body: t, end: e, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: t, end: e, p: n.b, u: T(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Pt = (t) => B(t.p, T(le(t.u), t.offL)), Tt = (t) => P(t.p, T(le(t.u), t.offR));
function wt(t, e, n) {
  return t !== null && R(t, e) <= n;
}
function zf(t) {
  const e = [];
  for (const n of t.walls) {
    const i = ae(t, n);
    if (i.len < 1e-9) continue;
    const o = le(i.dir);
    e.push({
      wall: n,
      f: i,
      c: {
        al: B(i.a, T(o, i.leftOff)),
        ar: P(i.a, T(o, i.rightOff)),
        bl: B(i.b, T(o, i.leftOff)),
        br: P(i.b, T(o, i.rightOff))
      }
    });
  }
  return e;
}
function Rf(t, e) {
  const n = e.f, i = le(n.dir);
  for (const o of t) {
    if (o.body === e) continue;
    const r = G(P(o.far, n.a), i) >= 0 ? B(n.a, T(i, n.leftOff)) : P(n.a, T(i, n.rightOff)), l = Bc * Math.max(o.body.wall.thickness, e.wall.thickness), a = ze(Pt(o), o.u, r, n.dir), c = ze(Tt(o), o.u, r, n.dir);
    wt(a, o.p, l) && (o.body.c[o.leftKey] = a), wt(c, o.p, l) && (o.body.c[o.rightKey] = c);
  }
}
function Bf(t, e) {
  t.sort((o, s) => Math.atan2(o.u.y, o.u.x) - Math.atan2(s.u.y, s.u.x));
  const n = Bc * Math.max(...t.map((o) => o.body.wall.thickness));
  for (let o = 0; o < t.length; o++) {
    const s = t[o], r = t[(o + 1) % t.length], l = ze(Tt(s), s.u, Pt(r), r.u);
    wt(l, e, n) && (s.body.c[s.rightKey] = l, r.body.c[r.leftKey] = l);
  }
  if (t.length < 3) return;
  const i = Ff(t, e, n);
  for (const o of t) {
    if (i.has(o)) continue;
    const s = o.body.c[o.leftKey], r = o.body.c[o.rightKey], l = P(r, s), a = pe(l, P(e, s)), c = pe(l, P(o.far, s));
    a * c < 0 && $s(o, [e]);
  }
}
function $s(t, e) {
  t.end === "a" ? t.body.extraA = e : t.body.extraB = e;
}
function Ff(t, e, n) {
  const i = t.length;
  for (let o = 0; o < i; o++) {
    const s = t[o], r = t[(o + 1) % i];
    if (Math.abs(pe(s.u, r.u)) > 1e-9 || G(s.u, r.u) > 0) continue;
    const l = s.offR - r.offL;
    if (!(Math.abs(l) < 1e-9)) {
      if (l > 0) {
        const a = t[(o + 2) % i], c = ze(Tt(s), s.u, Pt(a), a.u), h = ze(Pt(r), r.u, Pt(a), a.u);
        if (!wt(c, e, n) || !wt(h, e, n)) continue;
        const f = r.body.c[r.rightKey];
        s.body.c[s.rightKey] = c, r.body.c[r.leftKey] = h, $s(s, [e, f, h]);
      } else {
        const a = t[(o - 1 + i) % i], c = ze(Pt(r), r.u, Tt(a), a.u), h = ze(Tt(s), s.u, Tt(a), a.u);
        if (!wt(h, e, n) || !wt(c, e, n)) continue;
        const f = s.body.c[s.leftKey];
        s.body.c[s.rightKey] = h, r.body.c[r.leftKey] = c, $s(r, [h, f, e]);
      }
      return /* @__PURE__ */ new Set([s, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function tr(t) {
  const e = zf(t), n = new Map(e.map((i) => [i.wall.id, i]));
  for (const i of t.nodes) {
    const o = [];
    for (const r of e)
      r.wall.a === i.id && o.push(Cl(r, "a")), r.wall.b === i.id && o.push(Cl(r, "b"));
    if (o.length === 0) continue;
    const s = i.host ? n.get(i.host.wallId) : void 0;
    s ? Rf(o, s) : o.length >= 2 && Bf(o, { x: i.x, y: i.y });
  }
  return e;
}
function Uc(t) {
  const e = [], n = [["al", "left", "a"], ["ar", "right", "a"], ["bl", "left", "b"], ["br", "right", "b"]];
  for (const i of tr(t))
    for (const [o, s, r] of n) {
      const l = i.c[o];
      e.push({ pt: l, wallId: i.wall.id, side: s, end: r, offset: G(P(l, i.f.a), i.f.dir) });
    }
  return e;
}
function Wc(t) {
  return [t.c.ar, t.c.br, ...t.extraB ?? [], t.c.bl, t.c.al, ...t.extraA ?? []];
}
function ho(t) {
  return new Map(tr(t).map((e) => [e.wall.id, Wc(e)]));
}
function Il(t, e) {
  const n = [];
  for (let i = 0; i < t.length; i++) {
    const o = t[i], s = t[(i + 1) % t.length], r = e(o), l = e(s);
    r >= 0 && n.push(o), r >= 0 != l >= 0 && n.push(B(o, T(P(s, o), r / (r - l))));
  }
  return n;
}
function nr(t, e = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of tr(t)) {
    const o = Wc(i), s = t.openings.filter((h) => h.wallId === i.wall.id && !h.invalid && e(h)).sort((h, f) => h.offset - f.offset), r = (h) => G(P(h, i.f.a), i.f.dir), l = [];
    let a = -1 / 0;
    for (const h of s)
      l.push([a, h.offset]), a = Math.max(a, h.offset + h.width);
    l.push([a, 1 / 0]);
    const c = [];
    for (const [h, f] of l) {
      if (f <= h) continue;
      let d = o;
      h > -1 / 0 && (d = Il(d, (p) => r(p) - h)), f < 1 / 0 && (d = Il(d, (p) => f - r(p))), d.length >= 3 && Math.abs(Oe(d)) > Hf && c.push(d);
    }
    n.set(i.wall.id, c);
  }
  return n;
}
const ys = (t) => [t.map((e) => [e.x, e.y])];
function jc(t) {
  const e = t.map(([o, s]) => ({ x: o, y: s })), n = e[0], i = e[e.length - 1];
  return e.length > 1 && n.x === i.x && n.y === i.y && e.pop(), e;
}
function qc(t, e) {
  return Zc(e ? [...nr(t).values()].flat() : [...ho(t).values()]);
}
function Zc(t) {
  const e = t.map(ys);
  if (e.length === 0) return [];
  let n;
  try {
    n = Rc.union(e[0], ...e.slice(1));
  } catch {
    return t.map((i) => [i.map((o) => ({ x: o.x, y: o.y }))]);
  }
  return n.map((i) => i.map(jc));
}
const Wt = 1e-6, Ii = ["door", "gate", "wicket"], Gc = (t) => t === "opening", Kc = (t) => t.passesLight ?? Gc(t.kind), Xc = (t) => t === "opening", Yc = (t) => t.passesPir ?? Xc(t.kind);
function Qc(t, e) {
  return t.offset < e.offset + e.width - Wt && e.offset < t.offset + t.width - Wt;
}
function fo(t, e, n, i, o) {
  const s = Lt(t, e);
  return s === null || i <= 0 || n < -Wt || n + i > s + Wt ? !1 : !t.openings.some((r) => r.wallId === e && r.id !== o && Qc(r, { offset: n, width: i }));
}
function Xt(t, e) {
  return { ...t, openings: e };
}
function Uf(t, e, n, i, o, s = {}) {
  const r = o ?? gi[n], l = i - r / 2;
  if (!fo(t, e, l, r)) return { level: t, openingId: null };
  const a = { id: oe(), wallId: e, kind: n, offset: l, width: r, invalid: !1 };
  return Ii.includes(n) && (a.hinge = s.hinge ?? "start", a.swing = s.swing ?? "left"), n === "window" && (a.outside = s.outside ?? "left"), { level: Xt(t, [...t.openings, a]), openingId: a.id };
}
function Jc(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !fo(t, i.wallId, n, i.width, e) ? t : Wn(Xt(t, t.openings.map((o) => o.id === e ? { ...o, offset: n } : o)));
}
function Wf(t, e, n) {
  const i = t.openings.find((o) => o.id === e);
  return !i || !fo(t, i.wallId, i.offset, n, e) ? t : Wn(Xt(t, t.openings.map((o) => o.id === e ? { ...o, width: n } : o)));
}
function jf(t, e) {
  return Ii.includes(e) ? { kind: e, hinge: t.hinge ?? "start", swing: t.swing ?? "left", outside: void 0 } : e === "window" ? { kind: e, outside: t.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: e, hinge: void 0, swing: void 0, outside: void 0 };
}
function qf(t, e, n) {
  if (!t.openings.some((o) => o.id === e)) return t;
  const i = (o) => {
    const s = { ...o, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete s[r];
    return s;
  };
  return Wn(Xt(t, t.openings.map((o) => o.id === e ? i(o) : o)));
}
function eu(t, e) {
  return Wn(Xt(t, t.openings.filter((n) => n.id !== e)));
}
function Wn(t) {
  return Xt(t, t.openings.map((e) => {
    const n = Lt(t, e.wallId), i = n === null || e.offset < -Wt || e.offset + e.width > n + Wt || t.openings.some((o) => o.id !== e.id && o.wallId === e.wallId && Qc(e, o));
    return { ...e, invalid: i };
  }));
}
const Ei = 1e-6;
function tu(t, e) {
  return e.mode !== "none" && Js[t.kind].includes(e.mode);
}
function nu(t, e, n) {
  if (n.mode === "none" || !tu(e, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -Ut || i > Ut)) return !1;
  const o = Lt(t, n.wallId);
  return o !== null && n.offset >= -Ei && n.offset <= o + Ei;
}
function Ye(t, e) {
  return { ...t, devices: e };
}
function El(t, e, n, i) {
  if (!nu(t, e, n)) return { level: t, deviceId: null };
  const o = oe(), s = { id: o, name: i, placement: n, props: e, invalid: !1 };
  return e.kind === "virtual_switch" && (s.bindings = { control: En(o) }), { level: Ye(t, [...t.devices, s]), deviceId: s.id };
}
function iu(t, e, n = "equipment") {
  const i = oe(), o = { id: i, name: e, placement: { mode: "none" }, props: ct(n, "free"), invalid: !1 };
  return n === "virtual_switch" && (o.bindings = { control: En(i) }), { level: Ye(t, [...t.devices, o]), id: o.id };
}
const Zf = ["power", "power_in", "power_out", "voltage"];
function Gf(t) {
  if (t.props.kind !== "equipment") return null;
  const e = t.bindings ?? {}, n = Zf.some((i) => !!e[i]);
  return e.control ? n ? "metered-switch" : "switch" : n ? "meter" : "dummy";
}
const Yt = (t) => (t == null ? void 0 : t.props.kind) === "equipment" && !!t.props.inverter, ou = (t) => t.props.kind !== "equipment" || !!t.props.controllable;
function su(t, e, n) {
  const i = { ...t };
  return n ? i[e] = !0 : delete i[e], i;
}
function ru(t, e, n) {
  const i = t.devices.find((a) => a.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.inverter === n) return t;
  const [o, s] = n ? ["power", "power_out"] : ["power_out", "power"], r = { ...i.bindings };
  r[o] && (r[s] = r[o]), delete r[o];
  const l = ro({ ...i, props: su(i.props, "inverter", n), bindings: r });
  return Ye(t, t.devices.map((a) => a === i ? l : a));
}
function po(t, e, n) {
  const i = t.devices.find((s) => s.id === e);
  if (!i || i.props.kind !== "equipment" || !!i.props.controllable === n) return t;
  const o = { ...i, props: su(i.props, "controllable", n) };
  return Ye(t, t.devices.map((s) => s === i ? o : s));
}
function lu(t, e, n) {
  if (t.kind !== "motion_sensor" || e === n) return t;
  const i = ct("motion_sensor", In(e)), o = ct("motion_sensor", In(n));
  return i.kind === "motion_sensor" && o.kind === "motion_sensor" && t.zoneAngle === i.zoneAngle ? { ...t, zoneAngle: o.zoneAngle } : t;
}
function Oi(t, e, n) {
  const i = t.devices, o = i.find((r) => r.id === e);
  if (!o || !nu(t, o.props, n)) return t;
  const s = lu(o.props, o.placement.mode, n.mode);
  return au(Ye(t, i.map((r) => r.id === e ? { ...r, placement: n, props: s } : r)));
}
function ft(t, e, n, i) {
  const o = t.devices;
  return o.some((s) => s.id === e) ? Ye(t, o.map((s) => {
    if (s.id !== e) return s;
    const r = { ...s.props, ...n, kind: s.props.kind };
    for (const [l, a] of Object.entries(n)) a === void 0 && delete r[l];
    return ro({ ...s, props: r, name: i ?? s.name });
  })) : t;
}
function Kf(t, e, n) {
  const i = t.devices.find((r) => r.id === e);
  if (!i || !Dc(i.props.kind) || i.props.kind === n) return t;
  const o = ct(n, In(i.placement.mode));
  if (!tu(o, i.placement)) return t;
  const s = ro({ ...i, props: o });
  return Ye(t, t.devices.map((r) => r === i ? s : r));
}
function Xf(t, e) {
  return Ye(t, t.devices.filter((n) => n.id !== e));
}
function au(t) {
  return Ye(t, t.devices.map((e) => {
    if (e.placement.mode !== "wall") return e.invalid ? { ...e, invalid: !1 } : e;
    const n = Lt(t, e.placement.wallId), i = n === null || e.placement.offset < -Ei || e.placement.offset > n + Ei;
    return e.invalid === i ? e : { ...e, invalid: i };
  }));
}
function cu(t) {
  const e = [];
  for (const n of qc(t, !1)) for (const i of n.slice(1)) e.push(i);
  return e;
}
function xs(t, e) {
  let n = null, i = 1 / 0;
  for (const o of t) {
    if (!ut(e, o)) continue;
    const s = Math.abs(Oe(o));
    s < i && (n = o, i = s);
  }
  return n;
}
const Ho = 1e-3;
function uu(t, e) {
  return t.length !== e.length || Math.abs(Math.abs(Oe(t)) - Math.abs(Oe(e))) > Ho ? !1 : t.every((n) => e.some((i) => Math.abs(n.x - i.x) <= Ho && Math.abs(n.y - i.y) <= Ho));
}
const du = 2, Ol = Math.ceil(360 / du), Dl = 1e-4, Yf = 1e-9, Nl = 1e-9, Qf = {
  light: Kc,
  motion: Yc
};
function hu(t, e) {
  const n = [];
  for (const i of Zc([...nr(t, Qf[e]).values()].flat()))
    for (const o of i)
      for (let s = 0; s < o.length; s++) n.push([o[s], o[(s + 1) % o.length]]);
  return n;
}
function ir(t, e, n) {
  return e.filter(([i, o]) => be(t, i, o) <= n);
}
function zo(t) {
  return t < -Math.PI ? t + 2 * Math.PI : t >= Math.PI ? t - 2 * Math.PI : t;
}
function Jf(t, e, n) {
  const i = ir(t, e, n), o = [];
  for (let v = 0; v < Ol; v++) o.push(-Math.PI + 2 * Math.PI * v / Ol);
  const s = n * 1.05;
  for (const v of i)
    for (const b of v) {
      if (R(t, b) > s) continue;
      const y = Math.atan2(b.y - t.y, b.x - t.x);
      o.push(zo(y - Dl), zo(y), zo(y + Dl));
    }
  o.sort((v, b) => v - b);
  const r = i.length, l = new Float64Array(r), a = new Float64Array(r), c = new Float64Array(r), h = new Float64Array(r);
  i.forEach(([v, b], y) => {
    l[y] = v.x - t.x, a[y] = v.y - t.y, c[y] = b.x - v.x, h[y] = b.y - v.y;
  });
  const f = [], d = [];
  let p = NaN;
  for (const v of o) {
    if (v === p) continue;
    p = v;
    const b = Math.cos(v), y = Math.sin(v);
    let x = n, M = -1;
    for (let C = 0; C < r; C++) {
      const A = b * h[C] - y * c[C];
      if (Math.abs(A) < 1e-12) continue;
      const N = (l[C] * h[C] - a[C] * c[C]) / A;
      if (!(N > Yf && N < x)) continue;
      const U = (l[C] * y - a[C] * b) / A;
      U < -Nl || U > 1 + Nl || (x = N, M = C);
    }
    const k = { x: t.x + b * x, y: t.y + y * x }, S = f.length;
    if (!(S > 0 && f[S - 1].x === k.x && f[S - 1].y === k.y)) {
      if (M >= 0 && S >= 2 && d[S - 1] === M && d[S - 2] === M) {
        f[S - 1] = k;
        continue;
      }
      f.push(k), d.push(M);
    }
  }
  const m = f[0], w = f[f.length - 1];
  return f.length > 1 && m.x === w.x && m.y === w.y && f.pop(), f;
}
const Pl = /* @__PURE__ */ new WeakMap();
function fu(t, e) {
  let n = Pl.get(t.walls);
  n || Pl.set(t.walls, n = /* @__PURE__ */ new WeakMap());
  let i = n.get(t.nodes);
  i || n.set(t.nodes, i = /* @__PURE__ */ new WeakMap());
  let o = i.get(t.openings);
  return o || i.set(t.openings, o = {}), o[e] ?? (o[e] = hu(t, e));
}
const ep = 32, Tl = 128;
function Di(t) {
  const e = t * Math.PI / 180;
  return { x: Math.cos(e), y: -Math.sin(e) };
}
function Ze(t) {
  return Math.atan2(-t.y, t.x) * 180 / Math.PI;
}
function or(t) {
  return (t % 360 + 360) % 360;
}
function pu(t) {
  return (t % 360 + 540) % 360 - 180;
}
function mu(t, e, n, i) {
  const o = t.walls.find((c) => c.id === e);
  if (!o) return null;
  let s;
  try {
    s = ae(t, o);
  } catch {
    return null;
  }
  const r = le(s.dir), l = n === "left" ? r : T(r, -1), a = n === "left" ? s.leftOff : s.rightOff;
  return { pt: B(B(s.a, T(s.dir, i)), T(l, a)), normal: l };
}
function Dn(t, e, n, i) {
  var o;
  return ((o = mu(t, e, n, i)) == null ? void 0 : o.pt) ?? null;
}
function de(t, e) {
  const n = e.placement;
  if (n.mode === "none") return null;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: Di(n.rotation) };
  const i = mu(t, n.wallId, n.side, n.offset);
  if (!i) return null;
  const o = i.normal, s = e.props;
  if (s.kind === "equipment") {
    const r = s.shape === "circle" ? s.diameter / 2 : s.depth / 2;
    return { pt: B(i.pt, T(o, r)), dir: le(o), normal: o };
  }
  return { pt: i.pt, dir: n.aim ? Di(Ze(o) + n.aim) : o, normal: o };
}
function Vl(t, e, n, i, o, s) {
  const r = t.nodes.find((a) => a.id === n);
  if (!r || r.host) return !1;
  let l = !1;
  for (const a of t.walls) {
    if (a === e || a.a !== n && a.b !== n) continue;
    let c;
    try {
      c = ae(t, a);
    } catch {
      continue;
    }
    const h = a.a === n ? c.dir : T(c.dir, -1);
    if (Math.abs(pe(i, h)) < 1e-9 && G(i, h) < 0) {
      if ((G(le(c.dir), o) > 0 ? c.leftOff : c.rightOff) > s + 1e-6) return !1;
      l = !0;
    } else if (G(h, o) > 1e-9) return !1;
  }
  return l;
}
function sr(t, e, n, i) {
  var U;
  if (e.kind !== "equipment" || n.mode !== "wall") return n;
  const o = t.walls.find((I) => I.id === n.wallId);
  if (!o) return n;
  let s;
  try {
    s = ae(t, o);
  } catch {
    return n;
  }
  const r = Uc(t), l = r.filter((I) => I.wallId === n.wallId && I.side === n.side), a = l.find((I) => I.end === "a"), c = l.find((I) => I.end === "b");
  if (!a || !c) return n;
  const h = le(s.dir), f = n.side === "left" ? h : T(h, -1), d = n.side === "left" ? s.leftOff : s.rightOff, p = Vl(t, o, o.a, s.dir, f, d) ? -1 / 0 : a.offset, m = Vl(t, o, o.b, T(s.dir, -1), f, d) ? 1 / 0 : c.offset, w = (I) => G(P(I, s.a), s.dir), v = [];
  for (const I of t.nodes)
    if (((U = I.host) == null ? void 0 : U.wallId) === o.id)
      for (const O of t.walls) {
        const E = O.a === I.id ? "a" : O.b === I.id ? "b" : null, D = E && t.nodes.find((q) => q.id === (E === "a" ? O.b : O.a));
        if (!D || (G(P(D, s.a), h) >= 0 ? "left" : "right") !== n.side) continue;
        const H = r.filter((q) => q.wallId === O.id && q.end === E).map((q) => w(q.pt));
        H.length && v.push([Math.min(...H), Math.max(...H)]);
      }
  v.sort((I, O) => I[0] - O[0]);
  const b = [];
  let y = p;
  for (const [I, O] of v) {
    const E = Math.min(I, m);
    E > y && b.push([y, E]), y = Math.max(y, O);
  }
  m > y && b.push([y, m]), b.length === 0 && b.push([p, m]);
  const x = ([I, O]) => Math.max(0, I - n.offset, n.offset - O), [M, k] = b.reduce((I, O) => x(O) < x(I) ? O : I), S = (e.shape === "circle" ? e.diameter : e.width) / 2, C = M + S, A = k - S;
  let N = n.offset;
  return C > A ? N = (M + k) / 2 : N <= C + i ? N = C : N >= A - i && (N = A), N = Math.max(0, Math.min(s.len, N)), Math.abs(N - n.offset) < 1e-9 ? n : { ...n, offset: N };
}
function gu(t, e) {
  const n = [];
  for (let i = 0; i < Tl; i++) n.push(B(t, T(Di(360 * i / Tl), e)));
  return n;
}
function Hl(t, e, n, i) {
  if (n >= 360) return gu(t, i);
  const o = Math.max(1, Math.ceil(n / 90 * ep)), s = Ze(e) - n / 2, r = [t];
  for (let l = 0; l <= o; l++) r.push(B(t, T(Di(s + n * l / o), i)));
  return r;
}
const tp = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function mo(t) {
  return tp[t] ?? null;
}
const np = (t) => mo(t.kind) !== null;
function ip(t, e) {
  const n = e.props;
  if (!np(n)) return null;
  const i = de(t, e);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Hl(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Hl(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? gu(i.pt, n.poolRadius) : null;
  }
}
function op(t) {
  return t.normal ? B(t.pt, t.normal) : t.pt;
}
function zl(t, e) {
  let n = !1;
  for (const [i, o] of e)
    i.y > t.y != o.y > t.y && t.x < i.x + (t.y - i.y) * (o.x - i.x) / (o.y - i.y) && (n = !n);
  return n;
}
function sp(t, e, n) {
  const i = P(e, t);
  for (const [o, s] of n) {
    const r = P(s, o), l = P(o, t), a = pe(i, r);
    if (Math.abs(a) < 1e-12) continue;
    const c = pe(l, r) / a, h = pe(l, i) / a;
    if (c >= 0 && c <= 1 && h >= 0 && h <= 1) return !0;
  }
  return !1;
}
const Rl = 0.5, rp = 3, lp = 1e-4;
function ap(t, e, n) {
  const i = de(t, e);
  if (!i) return null;
  const o = op(i), s = e.placement;
  if (s.mode !== "wall") return o;
  const r = (k) => zl(k, n) || ir(k, n, Rl).length > 0;
  if (!r(o)) return o;
  const l = ae(t, t.walls.find((k) => k.id === s.wallId)), a = i.normal, c = (k) => Math.abs(G(P(k, i.pt), a)) <= lp, h = ([k, S]) => T(B(k, S), 0.5), f = n.filter((k) => c(k[0]) && c(k[1]) && R(k[0], k[1]) > 1e-9 && !zl(B(h(k), T(a, Rl)), n)), d = (k) => G(P(k, l.a), l.dir), p = ([k, S]) => Math.max(0, Math.min(d(k), d(S)) - s.offset, s.offset - Math.max(d(k), d(S))), m = Math.min(...f.map(p)), w = f.filter((k) => p(k) <= m + 1e-6).map((k) => B(h(k), a)), v = (k) => w.some((S) => !sp(k, S, n)), b = rp * Math.max(...t.walls.map((k) => k.thickness)) + 2, y = [];
  for (const [k, S] of n) {
    const C = P(S, k), A = P(k, o), N = pe(l.dir, C);
    if (Math.abs(N) < 1e-12) continue;
    const U = pe(A, l.dir) / N;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const I = pe(A, C) / N, O = R(k, S) / Math.abs(N);
    y.push(I - O, I + O);
  }
  const x = s.offset <= l.len / 2 ? 1 : -1, M = y.filter((k) => Math.abs(k) <= b).sort((k, S) => Math.abs(k) - Math.abs(S) || Math.sign(S) * x - Math.sign(k) * x);
  for (const k of M) {
    const S = B(o, T(l.dir, k));
    if (!r(S) && v(S)) return S;
  }
  return null;
}
const cp = 1 / Math.cos(du / 2 * (Math.PI / 180)), Bl = (t) => t.map((e) => ({ x: Math.round(e.x * 1e3) / 1e3, y: Math.round(e.y * 1e3) / 1e3 }));
function bu(t, e, n = hu) {
  const i = ip(t, e), o = mo(e.props.kind);
  if (!i || !o) return [];
  const s = n(t, o), r = ap(t, e, s);
  if (!r) return [];
  const l = Math.max(...i.map((f) => R(f, r))) * cp, a = ir(r, s, l);
  if (a.length === 0) return [i];
  const c = Jf(r, a, l);
  let h;
  try {
    h = Rc.intersection(ys(Bl(i)), ys(Bl(c)));
  } catch {
    return [c];
  }
  return h.flatMap((f) => f.map(jc));
}
function up(t, e, n, i) {
  const o = de(t, e);
  if (!o) return !1;
  const s = e.props;
  if (s.kind === "ceiling_light" && s.shape === "linear") {
    const l = Math.max(-s.length / 2, Math.min(s.length / 2, G(P(n, o.pt), o.dir)));
    return R(B(o.pt, T(o.dir, l)), n) <= i;
  }
  if (s.kind === "ceiling_light" && s.shape === "round") return R(o.pt, n) <= s.diameter / 2 + i;
  if (s.kind !== "equipment") return R(o.pt, n) <= i;
  if (s.shape === "circle") return R(o.pt, n) <= s.diameter / 2 + i;
  const r = P(n, o.pt);
  return Math.abs(G(r, o.dir)) <= s.width / 2 + i && Math.abs(G(r, le(o.dir))) <= s.depth / 2 + i;
}
function wu(t, e, n) {
  const i = t.devices;
  for (const o of [!1, !0])
    for (let s = i.length - 1; s >= 0; s--)
      if (i[s].props.kind === "equipment" === o && up(t, i[s], e, n)) return i[s].id;
  return null;
}
const dp = 60;
function ks(t, e, n) {
  if (!Pc.has(e.props.kind)) return null;
  const i = de(t, e);
  return i ? { from: i.pt, to: B(i.pt, T(i.dir, dp / n)) } : null;
}
function vu(t, e) {
  const n = { ...t, aim: e };
  return e === 0 && delete n.aim, n;
}
function hp(t, e, n, i) {
  const o = e.placement, s = de(t, e);
  if (o.mode === "none" || !s || n.x === s.pt.x && n.y === s.pt.y) return o;
  const r = Ze(P(n, s.pt)), l = (h) => i ? Math.round(h / 15) * 15 : Math.round(h);
  if (o.mode === "free") return { ...o, rotation: or(l(r)) };
  const a = pu(r - Ze(s.normal)), c = Math.max(-Ut, Math.min(Ut, l(a)));
  return vu(o, c);
}
const fp = 1, Ni = 1, Fl = 1e-6, pp = 1e-9, mp = 1e-6, gp = 1;
function rr(t, e) {
  switch (e.kind) {
    case "free":
      return { x: e.x, y: e.y };
    case "node": {
      const n = t.nodes.find((i) => i.id === e.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = Lt(t, e.wallId);
      return n === null ? null : Dn(t, e.wallId, e.side, Math.max(0, Math.min(n, e.offset)));
    }
  }
}
function se(t, e) {
  const n = e.shape;
  return n.kind === "walls" ? n.outline : n.vertices.map((i) => rr(t, i) ?? { x: i.x, y: i.y });
}
function lr(t, e) {
  const n = se(t, e);
  return n.length < 3 ? null : Math.round(Math.abs(Oe(n)) / 1e5) / 10;
}
function dn(t, e, n) {
  const i = pe(P(e, t), P(n, t));
  return Math.abs(i) <= pp * R(t, e) * R(t, n) ? 0 : Math.sign(i);
}
const Yn = (t, e, n) => G(P(e, t), P(n, t)) <= 0;
function ar(t, e, n, i) {
  const o = dn(n, i, t), s = dn(n, i, e), r = dn(t, e, n), l = dn(t, e, i);
  return o * s < 0 && r * l < 0 ? !0 : r === 0 && Yn(n, t, e) || l === 0 && Yn(i, t, e) || o === 0 && Yn(t, n, i) || s === 0 && Yn(e, n, i);
}
function bp(t) {
  const e = [];
  for (const n of t) (e.length === 0 || R(e[e.length - 1], n) > Fl) && e.push(n);
  for (; e.length > 1 && R(e[0], e[e.length - 1]) <= Fl; ) e.pop();
  return e;
}
function Pi(t) {
  const e = bp(t), n = e.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const o = e[i], s = e[(i + 1) % n], r = e[(i + 2) % n];
    if (dn(o, s, r) === 0 && G(P(s, o), P(r, s)) < 0) return !0;
    for (let l = i + 2; l < n; l++)
      if (!(i === 0 && l === n - 1) && ar(o, s, e[l], e[(l + 1) % n]))
        return !0;
  }
  return !1;
}
function $u(t, e) {
  const n = e.shape;
  if (n.kind === "walls") return n.broken ? "broken" : null;
  if (n.vertices.some((s) => s.kind === "free" ? s.lost === !0 : rr(t, s) === null)) return "lost";
  const i = (s) => {
    if (s.kind !== "wall") return !1;
    const r = Lt(t, s.wallId);
    return r !== null && (s.offset < -Ni || s.offset > r + Ni);
  };
  if (n.vertices.some(i)) return "beyond";
  const o = se(t, e);
  return Math.abs(Oe(o)) < gp || Pi(o) ? "crossing" : null;
}
function Re(t, e) {
  return ut(e, t) || t.some((n, i) => be(e, n, t[(i + 1) % t.length]) <= fp);
}
const yu = (t, e) => !(t.zoneBlacklist ?? []).includes(e);
function wp(t, e) {
  const n = de(t, e);
  return n ? t.zones.filter((i) => Re(se(t, i), n.pt)).map((i) => ({ zone: i, participates: yu(e, i.id) })) : [];
}
function Qe(t, e) {
  const n = t.zones.find((s) => s.id === e);
  if (!n) return [];
  const i = se(t, n), o = [];
  for (const s of t.devices) {
    const r = de(t, s);
    r && Re(i, r.pt) && o.push({ device: s, participates: yu(s, e) });
  }
  return o;
}
function Ms(t) {
  const e = t.length;
  if (e === 0) return { x: 0, y: 0 };
  const n = Oe(t);
  if (Math.abs(n) > mp) {
    let i = 0, o = 0;
    for (let r = 0; r < e; r++) {
      const l = t[r], a = t[(r + 1) % e], c = l.x * a.y - a.x * l.y;
      i += (l.x + a.x) * c, o += (l.y + a.y) * c;
    }
    const s = { x: i / (6 * n), y: o / (6 * n) };
    if (ut(s, t)) return s;
  }
  return {
    x: t.reduce((i, o) => i + o.x, 0) / e,
    y: t.reduce((i, o) => i + o.y, 0) / e
  };
}
const Ro = 32;
function Ul(t, e) {
  let n = 1 / 0;
  for (const i of e) for (let o = 0; o < i.length; o++) n = Math.min(n, be(t, i[o], i[(o + 1) % i.length]));
  return n;
}
function xu(t) {
  const e = t.zones.map((o) => se(t, o)), n = e.map((o) => Math.abs(Oe(o))), i = /* @__PURE__ */ new Map();
  return t.zones.forEach((o, s) => {
    const r = e[s];
    if (r.length < 3) return;
    const l = e.filter((w, v) => v !== s && w.length >= 3 && n[v] < n[s] && w.every((b) => Re(r, b))), a = Ms(r);
    if (l.length === 0) {
      i.set(o.id, a);
      return;
    }
    const c = r.map((w) => w.x), h = r.map((w) => w.y), f = Math.min(...c), d = Math.min(...h), p = Math.max(Math.max(...c) - f, Math.max(...h) - d) / Ro;
    let m = null;
    for (let w = f + p / 2; w < f + p * Ro; w += p)
      for (let v = d + p / 2; v < d + p * Ro; v += p) {
        const b = { x: w, y: v };
        if (!ut(b, r) || l.some((x) => ut(b, x))) continue;
        const y = Math.min(Ul(b, [r]), Ul(b, l));
        (!m || y > m.d) && (m = { p: b, d: y });
      }
    i.set(o.id, (m == null ? void 0 : m.p) ?? a);
  }), i;
}
const cr = 3, jt = (t, e) => ({ ...t, zones: e }), Nn = (t, e, n) => jt(t, t.zones.map((i) => i === e ? n : i)), ur = (t) => ({ kind: "free", x: t.x, y: t.y, lost: !0 }), ku = (t, e) => t.length === e.length && t.every((n, i) => n.x === e[i].x && n.y === e[i].y);
function vp(t, e) {
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
function $p(t, e) {
  return t.kind === "walls" ? e.kind === "walls" && t.broken === e.broken && t.seed.x === e.seed.x && t.seed.y === e.seed.y && ku(t.outline, e.outline) : e.kind === "polygon" && t.vertices.length === e.vertices.length && t.vertices.every((n, i) => vp(n, e.vertices[i]));
}
function Mu(t, e) {
  return t.id === e.id && t.name === e.name && t.automation === e.automation && t.invalid === e.invalid && $p(t.shape, e.shape);
}
function yp(t, e) {
  if (e.kind === "free") return e;
  const n = rr(t, e);
  return n ? n.x === e.x && n.y === e.y ? e : { ...e, x: n.x, y: n.y } : ur(e);
}
function _u(t, e) {
  const n = e.shape, i = n.vertices.map((o) => yp(t, o));
  return i.some((o, s) => o !== n.vertices[s]) ? { ...e, shape: { kind: "polygon", vertices: i } } : e;
}
function xp(t, e, n) {
  const i = t.shape, o = xs(e, i.seed);
  return !o || n.some((s) => uu(s, o)) ? i.broken ? t : { ...t, shape: { ...i, broken: !0 } } : (n.push(o), !i.broken && ku(o, i.outline) ? t : { ...t, shape: { ...i, outline: o, broken: !1 } });
}
function Au(t, e) {
  const n = $u(t, e) !== null;
  return e.invalid === n ? e : { ...e, invalid: n };
}
const dr = (t, e) => Au(t, _u(t, e));
function kp(t) {
  const e = t.zones;
  if (e.length === 0) return t;
  const n = e.some((s) => s.shape.kind === "walls") ? cu(t) : [], i = [], o = e.map((s) => Au(
    t,
    s.shape.kind === "walls" ? xp(s, n, i) : _u(t, s)
  ));
  return o.some((s, r) => s !== e[r]) ? jt(t, o) : t;
}
function Mp(t, e) {
  const n = t.zones, i = e.zones, o = n.map((s) => {
    const r = i.find((l) => l.id === s.id);
    return r && r !== s && Mu(r, s) ? r : s;
  });
  return o.length === i.length && o.every((s, r) => s === i[r]) ? n === i ? t : jt(t, i) : o.some((s, r) => s !== n[r]) ? jt(t, o) : t;
}
function _p(t, e, n) {
  const i = cu(t), o = xs(i, e);
  if (!o) return { level: t, zoneId: null, existing: !1 };
  for (const r of t.zones) {
    if (r.shape.kind !== "walls" || r.shape.broken) continue;
    const l = xs(i, r.shape.seed);
    if (l && uu(l, o)) return { level: t, zoneId: r.id, existing: !0 };
  }
  const s = { id: oe(), name: n, shape: { kind: "walls", seed: { x: e.x, y: e.y }, outline: o, broken: !1 }, invalid: !1 };
  return { level: jt(t, [...t.zones, s]), zoneId: s.id, existing: !1 };
}
const hr = (t) => t.kind === "free" && t.lost ? { kind: "free", x: t.x, y: t.y } : t;
function Ap(t, e, n) {
  if (e.length < cr) return { level: t, zoneId: null };
  const i = dr(t, { id: oe(), name: n, shape: { kind: "polygon", vertices: e.map(hr) }, invalid: !1 });
  return Pi(se(t, i)) ? { level: t, zoneId: null } : { level: jt(t, [...t.zones, i]), zoneId: i.id };
}
function Sp(t, e, n) {
  const i = t.zones.find((o) => o.id === e);
  return !i || i.name === n ? t : Nn(t, i, { ...i, name: n });
}
function fr(t, e, n) {
  const i = t.zones.find((r) => r.id === e);
  if (!i || i.automation !== !1 === n) return t;
  if (!n) return Nn(t, i, { ...i, automation: !1 });
  const { automation: o, ...s } = i;
  return Nn(t, i, s);
}
function Su(t, e) {
  if (e.length > 0) return { ...t, zoneBlacklist: e };
  const { zoneBlacklist: n, ...i } = t;
  return i;
}
function Lu(t, e) {
  if (!t.zones.some((i) => i.id === e)) return t;
  const n = t.devices.map((i) => {
    var o;
    return (o = i.zoneBlacklist) != null && o.includes(e) ? Su(i, i.zoneBlacklist.filter((s) => s !== e)) : i;
  });
  return {
    ...t,
    zones: t.zones.filter((i) => i.id !== e),
    devices: n.some((i, o) => i !== t.devices[o]) ? n : t.devices
  };
}
function pr(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? n : null;
}
function mr(t, e, n) {
  const i = dr(t, { ...e, shape: { kind: "polygon", vertices: n } });
  return Mu(i, e) ? t : Nn(t, e, i);
}
const gr = (t, e) => Number.isInteger(t) && t >= 0 && t < e;
function Lp(t, e, n, i) {
  const o = pr(t, e);
  return !o || !gr(n, o.shape.vertices.length) ? t : mr(t, o, o.shape.vertices.map((s, r) => r === n ? hr(i) : s));
}
function Cp(t, e, n, i) {
  const o = pr(t, e);
  if (!o || !gr(n, o.shape.vertices.length + 1)) return t;
  const s = [...o.shape.vertices];
  return s.splice(n, 0, hr(i)), mr(t, o, s);
}
function Ip(t, e, n) {
  const i = pr(t, e);
  return !i || i.shape.vertices.length <= cr || !gr(n, i.shape.vertices.length) ? t : mr(t, i, i.shape.vertices.filter((o, s) => s !== n));
}
function Ep(t, e) {
  const n = t.zones.find((o) => o.id === e);
  if (!n || n.shape.kind !== "walls" || n.shape.outline.length < cr) return t;
  const i = n.shape.outline.map(ur);
  return Nn(t, n, dr(t, { ...n, shape: { kind: "polygon", vertices: i } }));
}
function Cu(t, e, n, i) {
  const o = t.devices.find((l) => l.id === e);
  if (!o) return t;
  const s = o.zoneBlacklist ?? [];
  if (s.includes(n) !== i || !i && !t.zones.some((l) => l.id === n)) return t;
  const r = Su(o, i ? s.filter((l) => l !== n) : [...s, n]);
  return { ...t, devices: t.devices.map((l) => l === o ? r : l) };
}
const Pn = 1;
function Be(t) {
  return structuredClone(t);
}
function go(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) throw new Error(`wall not found: ${e}`);
  return n;
}
function Op(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function bo(t, e, n) {
  const i = ne(t, e.a), o = ne(t, e.b), s = R(i, o), r = Op(typeof n == "number" ? n : co(n, i, o) * s, 0, s);
  return { pt: s === 0 ? i : Hc(i, o, r / s), offset: r };
}
function Dp(t) {
  for (let e = 0; e <= t.nodes.length; e++) {
    let n = !1;
    for (const i of t.nodes) {
      if (!i.host) continue;
      const o = t.walls.find((l) => l.id === i.host.wallId);
      if (!o) continue;
      const { pt: s, offset: r } = bo(t, o, i);
      (Math.abs(i.x - s.x) > 1e-9 || Math.abs(i.y - s.y) > 1e-9) && (n = !0), i.x = s.x, i.y = s.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Iu(t, e) {
  Dp(t), e && Vp(e, t);
  const n = kp(au(Wn(t)));
  return e ? Mp(n, e) : n;
}
function Je(t, e) {
  return Iu(Be(t), e);
}
function Eu(t, e, n) {
  const i = uo(t, e), o = i.host && t.walls.find((s) => s.id === i.host.wallId);
  if (i.host && o) {
    const { pt: s, offset: r } = bo(t, o, n);
    i.host.offset = r, i.x = s.x, i.y = s.y;
  } else
    i.x = n.x, i.y = n.y;
}
function Wl(t, e) {
  if (e.kind === "free") return { pt: e.pt };
  if (e.kind === "node") return { pt: ne(t, e.nodeId), nodeId: e.nodeId };
  const n = go(t, e.wallId), { pt: i, offset: o } = bo(t, n, e.offset), s = R(ne(t, n.a), ne(t, n.b));
  return o <= Pn ? { pt: ne(t, n.a), nodeId: n.a } : s - o <= Pn ? { pt: ne(t, n.b), nodeId: n.b } : { pt: i, host: { wallId: e.wallId, offset: o } };
}
function jl(t, e) {
  if (e.nodeId) return e.nodeId;
  const n = { id: oe(), x: e.pt.x, y: e.pt.y };
  return e.host && (n.host = { ...e.host }), t.nodes.push(n), n.id;
}
function Np(t, e, n, i) {
  const o = Wl(t, e), s = Wl(t, n);
  if (R(o.pt, s.pt) < Pn) return { level: t, wallId: null, endNodeId: null };
  const r = Be(t), l = jl(r, o), a = jl(r, s);
  if (l === a) return { level: t, wallId: null, endNodeId: null };
  const c = { id: oe(), a: l, b: a, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(c), { level: Je(r, t), wallId: c.id, endNodeId: a };
}
function Ou(t, e, n, i) {
  const o = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, s = Math.min(t.x, e.x) - o, r = Math.max(t.x, e.x) + o, l = Math.min(t.y, e.y) - o, a = Math.max(t.y, e.y) + o;
  return r - s < Pn || a - l < Pn ? null : [{ x: s, y: l }, { x: r, y: l }, { x: r, y: a }, { x: s, y: a }];
}
function Pp(t, e, n, i, o) {
  const s = Ou(e, n, i.thickness, o);
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
  return Je(r, t);
}
function Tp(t, e, n) {
  const i = Be(t);
  return Eu(i, e, n), Iu(i, t);
}
function Vp(t, e) {
  const n = [
    ...e.openings,
    ...e.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...e.zones.flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of e.walls) {
    const o = t.walls.find((f) => f.id === i.id);
    if (!o || o.a !== i.a) continue;
    const s = t.nodes.find((f) => f.id === o.a), r = t.nodes.find((f) => f.id === o.b), l = e.nodes.find((f) => f.id === i.a), a = e.nodes.find((f) => f.id === i.b);
    if (!s || !r || !l || !a || s.x === l.x && s.y === l.y) continue;
    const c = R(l, a);
    if (c === 0) continue;
    const h = ao(P(r, s));
    for (const f of n)
      f.wallId === i.id && (f.offset = co(B(s, T(h, f.offset)), l, a) * c);
  }
}
function Hp(t, e, n) {
  const i = Be(t), o = go(i, e), r = (o.a === o.b ? [o.a] : [o.a, o.b]).map((l) => ({ id: l, to: B(ne(i, l), n) }));
  for (const l of r) Eu(i, l.id, l.to);
  return Je(i, t);
}
function wo(t) {
  t.nodes = t.nodes.filter((e) => t.walls.some((n) => n.a === e.id || n.b === e.id));
}
function Du(t, e, n) {
  for (const i of t.zones)
    if (i.shape.kind === "polygon")
      for (const o of i.shape.vertices) o.kind === "node" && o.nodeId === e && (o.nodeId = n);
}
function zp(t, e, n) {
  const i = Be(t), o = go(i, e), s = o[n], r = ne(i, s), l = { id: oe(), x: r.x, y: r.y };
  return i.nodes.push(l), o[n] = l.id, i.walls.some((a) => a.a === s || a.b === s) || Du(i, s, l.id), wo(i), { level: Je(i, t), nodeId: l.id };
}
function Rp(t, e, n) {
  if (e === n) return t;
  const i = Be(t);
  for (const s of i.walls)
    s.a === e && (s.a = n), s.b === e && (s.b = n);
  const o = new Set(i.walls.filter((s) => s.a === s.b).map((s) => s.id));
  i.walls = i.walls.filter((s) => !o.has(s.id)), i.openings = i.openings.filter((s) => !o.has(s.wallId)), i.devices = i.devices.filter((s) => s.placement.mode !== "wall" || !o.has(s.placement.wallId));
  for (const s of i.nodes) s.host && o.has(s.host.wallId) && delete s.host;
  return Du(i, e, n), i.nodes = i.nodes.filter((s) => s.id !== e), wo(i), Je(i, t);
}
function br(t, e) {
  var i;
  const n = Be(t);
  n.walls = n.walls.filter((o) => o.id !== e), n.openings = n.openings.filter((o) => o.wallId !== e), n.devices = n.devices.filter((o) => o.placement.mode !== "wall" || o.placement.wallId !== e);
  for (const o of n.nodes) ((i = o.host) == null ? void 0 : i.wallId) === e && delete o.host;
  return wo(n), Je(n, t);
}
function Bp(t, e, n) {
  const i = Be(t);
  return Object.assign(go(i, e), n), Je(i, t);
}
const ke = (t) => typeof t == "string" && t !== "" ? t : null, wr = (t) => t.split(".")[0], Fp = ["friendly_name", "device_class", "unit_of_measurement"];
function Nu(t, e) {
  const n = e.attributes ?? {};
  return {
    entityId: t,
    domain: wr(t),
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
function Up(t) {
  const e = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(t ?? {})) e.set(n, Nu(n, i ?? {}));
  return { entities: e, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function Wp(t, e) {
  if (t === e) return !0;
  if (!t || !e) return Object.keys(t ?? e ?? {}).length === 0;
  let n = 0;
  for (const i in e) {
    n++;
    const o = t[i], s = e[i];
    if (o === s) continue;
    if (!o || !s) return !1;
    const r = o.attributes ?? {}, l = s.attributes ?? {};
    if (r !== l && Fp.some((a) => r[a] !== l[a])) return !1;
  }
  return n === Object.keys(t).length;
}
function vr(t, e) {
  const n = t == null ? void 0 : t[e];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function jp(t) {
  const e = (r) => t.connection.sendMessagePromise({ type: r }), [n, i, o] = await Promise.all([
    e("config/entity_registry/list"),
    e("config/device_registry/list"),
    e("config/area_registry/list")
  ]), s = /* @__PURE__ */ new Map();
  for (const r of n) {
    const l = Nu(r.entity_id, {});
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
function qp(t, e) {
  const n = new Map(e.entities);
  for (const [i, o] of t.entities) {
    const s = e.entities.get(i);
    n.set(i, s ? { ...s, name: o.name !== i ? o.name : s.name, deviceClass: o.deviceClass ?? s.deviceClass, unit: o.unit ?? s.unit } : o);
  }
  return { entities: n, devices: e.devices, areas: e.areas, registryLoaded: !0 };
}
function Pu(t, e, n) {
  const i = t.entities.get(e);
  if (!i) return t.registryLoaded ? "missing" : "unknown";
  const o = i.disabled ? null : vr(n, e);
  return o === null || o === "unavailable" ? "unavailable" : "present";
}
const Zp = {
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
  "control.hint": 'Reacts to events. A source gives "on" when it becomes true and "off" when it becomes false (NOT swaps them); a button gives what it is set up for: toggle, or on / off, and its Auto action runs "When auto". Each event runs its own list. "toggle" actions of one list work as a group: any of them on switches all off, else all on. Nothing happens at start or Save, a device that is unavailable at that moment is skipped, and a change made by a Load control rule is not an event for another one.',
  "control.sources": "Sources",
  "control.addSource": "Add a source…",
  "control.group.buttons": "Buttons",
  "control.gives": "gives {what}",
  "control.gate": "Act only when",
  "control.whenOn": "When on",
  "control.whenOff": "When off",
  "control.whenToggle": "When toggle",
  "control.auto": "When auto",
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
  "control.do.auto": "auto",
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
  "motionLight.outside": "outside",
  "motionLight.noNeighbours": "No motion sensor sees past the zone's doors or passages: this has no effect.",
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
  "rules.error.switchedBack": "the device switched back",
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
  "device.brightness": "Brightness when switched on, %",
  "device.brightnessHint": "empty = the lamp's own",
  "props.badBrightness": "Brightness is a whole number from 1 to 100.",
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
  return Zp[t] ?? t;
}
const Gp = ["grid", "device", "bus", "battery", "pv", "transfer", "remainder"], Kp = 10;
function Qt(t, e) {
  const n = (i, o) => ({ name: i, dir: o });
  switch (t.kind) {
    case "grid":
      return [n("OUT", "out")];
    case "device":
      return Yt(e.device(t.deviceId)) ? [n("IN", "in"), n("OUT", "out"), n("PV", "in"), n("BAT", "out")] : t.output === !1 ? [n("IN", "in")] : [n("IN", "in"), n("OUT", "out")];
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
function Tu() {
  return { blocks: [{ id: oe(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Xp(t, e, n, i) {
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
function ql(t, e) {
  return { ...t, blocks: [...t.blocks, e] };
}
function vo(t, e, n) {
  return t.blocks.some((i) => i.id === e) ? { ...t, blocks: t.blocks.map((i) => i.id === e ? n(i) : i) } : t;
}
function Yp(t, e, n, i) {
  return vo(t, e, (o) => ({ ...o, x: n, y: i }));
}
const _s = (t) => "block" in t ? t.block : t.bus, Vu = (t, e) => _s(t.from) === e || _s(t.to) === e;
function Tn(t, e, n, i) {
  const o = t.blocks.find((c) => c.id === e);
  if (!o) return t;
  const s = vo(t, e, (c) => ({ ...c, ...n }));
  if (o.kind === "transfer" && "form" in n && n.form !== o.form)
    return { ...s, wires: s.wires.filter((c) => !Vu(c, e)) };
  const r = s.blocks.find((c) => c.id === e), l = new Set(Qt(r, i).map((c) => c.name)), a = (c) => "block" in c && c.block === e && !l.has(c.port);
  return s.wires.some((c) => a(c.from) || a(c.to)) ? { ...s, wires: s.wires.filter((c) => !a(c.from) && !a(c.to)) } : s;
}
function Hu(t, e) {
  const n = t.blocks.find((i) => i.id === e);
  return !n || n.kind === "grid" ? t : { blocks: t.blocks.filter((i) => i.id !== e), wires: t.wires.filter((i) => !Vu(i, e)) };
}
const zu = (t, e) => new Set(t.blocks.flatMap((n) => n.kind === "device" && n.deviceId === e ? [n.id] : []));
function $o(t, e, n) {
  const i = zu(t, e);
  if (i.size === 0) return t;
  const o = new Map(t.blocks.filter((c) => i.has(c.id)).map((c) => [c.id, new Set(Qt(c, n).map((h) => h.name))])), s = (c) => "block" in c && !!o.get(c.block) && !o.get(c.block).has(c.port), r = t.wires.filter((c) => !s(c.from) && !s(c.to));
  let l = !1;
  const a = t.blocks.map((c) => {
    const h = o.get(c.id);
    if (!h || !c.portPins || Object.keys(c.portPins).every((m) => h.has(m))) return c;
    l = !0;
    const f = Object.fromEntries(Object.entries(c.portPins).filter(([m]) => h.has(m))), { portPins: d, ...p } = c;
    return Object.keys(f).length ? { ...p, portPins: f } : p;
  });
  return r.length === t.wires.length && !l ? t : { ...t, blocks: a, wires: r };
}
function Qp(t, e) {
  const n = $r(e), i = new Set(t.blocks.flatMap((s) => s.kind === "device" ? [s.deviceId] : []));
  let o = t;
  for (const s of i) o = $o(o, s, n);
  return o;
}
function Jp(t, e) {
  const n = zu(t, e);
  if (n.size === 0) return t;
  const i = (o) => n.has(_s(o));
  return {
    ...t,
    blocks: t.blocks.filter((o) => !n.has(o.id)),
    wires: t.wires.filter((o) => !i(o.from) && !i(o.to))
  };
}
const $r = (t) => ({ device: (e) => t.devices.find((n) => n.id === e) });
function Ru(t, e, n) {
  var s;
  const i = ((s = t.devices.find((r) => r.id === n)) == null ? void 0 : s.placement.mode) === "none", o = Xf(t, n);
  return { level: o, power: i ? Jp(e, n) : $o(e, n, $r(o)) };
}
function Bu(t, e, n, i) {
  const o = ru(t, n, i);
  return { level: o, power: o === t ? e : $o(e, n, $r(o)) };
}
function Fu(t, e) {
  return t.wires.some((n) => n.id === e) ? { ...t, wires: t.wires.filter((n) => n.id !== e) } : t;
}
function em(t, e, n, i) {
  return vo(t, e, (o) => {
    const s = { ...o.portPins };
    i ? s[n] = i : delete s[n];
    const { portPins: r, ...l } = o;
    return Object.keys(s).length ? { ...l, portPins: s } : l;
  });
}
function tm(t, e) {
  return vo(t, e, (n) => {
    const { portPins: i, ...o } = n;
    return o;
  });
}
function Zl(t, e) {
  if (t.kind === "battery") return "bat";
  if (t.kind === "pv") return "pv";
  if (t.kind === "device") {
    if (e === "BAT") return "bat";
    if (e === "PV") return "pv";
  }
  return "ac";
}
function nm(t, e) {
  const n = t.filter((s) => s.kind === "transfer"), i = n.slice(0, Kp), o = /* @__PURE__ */ new Map();
  for (const s of n) s.kind === "transfer" && o.set(s.id, s.form === "2in1out" ? "OUT" : "IN");
  for (let s = 0; s < 1 << i.length; s++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((h, f) => r.set(h.id, s & 1 << f ? "B" : "A"));
    const l = /* @__PURE__ */ new Map(), a = (h) => {
      let f = h;
      for (; l.has(f) && l.get(f) !== f; ) f = l.get(f);
      return f;
    }, c = (h, f) => {
      if ("bus" in h) return `n:${h.bus}`;
      const d = o.get(h.block);
      return d !== void 0 && h.port !== d && h.port !== (r.get(h.block) ?? "A") ? `x:${f.id}:${h.port}` : `n:${h.block}`;
    };
    for (const h of e) {
      const f = a(c(h.from, h)), d = a(c(h.to, h));
      if (f === d) return !0;
      l.set(f, d);
    }
  }
  return !1;
}
function Gl(t, e, n, i) {
  const o = new Map(t.blocks.map((b) => [b.id, b])), s = (b) => {
    if ("bus" in b) {
      const M = o.get(b.bus);
      return M && M.kind === "bus" ? { bl: M, dir: null } : null;
    }
    const y = o.get(b.block), x = y ? Qt(y, i).find((M) => M.name === b.port) : void 0;
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
  const h = (b) => "block" in b && t.wires.some((y) => [y.from, y.to].some((x) => "block" in x && x.block === b.block && x.port === b.port));
  if (h(a) || h(c)) return { error: "port-taken" };
  const f = (b) => {
    for (const y of t.wires)
      for (const [x, M] of [[y.from, y.to], [y.to, y.from]])
        if ("bus" in x && x.bus === b && "block" in M) {
          const k = o.get(M.block);
          if (k) return Zl(k, M.port);
        }
    return null;
  }, d = (b) => "bus" in b ? f(b.bus) : Zl(o.get(b.block), b.port), p = d(a), m = d(c);
  if (p !== null && m !== null && p !== m) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in c && o.get(c.block).kind === "remainder" && t.wires.some((b) => {
    var y;
    return "bus" in b.from && b.from.bus === a.bus && "block" in b.to && ((y = o.get(b.to.block)) == null ? void 0 : y.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const w = { id: oe(), from: a, to: c }, v = [...t.wires, w];
  return nm(t.blocks, v) ? { error: "loop" } : { schema: { ...t, wires: v }, wire: w };
}
const We = (t) => typeof t == "object" && t !== null && !Array.isArray(t), Rt = (t) => typeof t == "number" && Number.isFinite(t), im = ["top", "right", "bottom", "left"], om = ["2in1out", "1in2out"];
function sm(t, e) {
  let n = t;
  if (n.kind === "bus" && !(Rt(n.w) && Rt(n.h) && n.w >= 1 && n.h >= 1) && (n = { ...n, w: 240, h: 12 }), n.kind === "transfer" && !om.includes(n.form) && (n = { ...n, form: "2in1out" }), !("portPins" in n)) return n;
  const i = n.portPins, o = new Set(Qt(n, e).map((c) => c.name)), s = {};
  let r = We(i);
  for (const [c, h] of We(i) ? Object.entries(i) : []) {
    if (!o.has(c) || !We(h) || !im.includes(h.side) || !Rt(h.at)) {
      r = !1;
      continue;
    }
    const f = Math.min(1, Math.max(0, h.at));
    f !== h.at && (r = !1), s[c] = f === h.at ? h : { side: h.side, at: f };
  }
  if (r) return n;
  const { portPins: l, ...a } = n;
  return Object.keys(s).length ? { ...a, portPins: s } : a;
}
function rm(t, e) {
  if (!We(t)) return;
  const n = Array.isArray(t.blocks) ? t.blocks : [], i = Array.isArray(t.wires) ? t.wires : [];
  let o = !Array.isArray(t.blocks) || !Array.isArray(t.wires);
  const s = [], r = /* @__PURE__ */ new Set();
  for (const h of n)
    if (We(h) && typeof h.id == "string" && h.id && Gp.includes(h.kind) && Rt(h.x) && Rt(h.y)) {
      const f = sm(h, e);
      f !== h && (o = !0), f.kind === "transfer" && f.form !== h.form && r.add(f.id), s.push(f);
    } else o = !0;
  const l = new Map(s.map((h) => [h.id, h])), a = (h) => {
    var d;
    if (!We(h)) return null;
    if (typeof h.bus == "string") {
      if (((d = l.get(h.bus)) == null ? void 0 : d.kind) !== "bus" || !Rt(h.at)) return null;
      const p = Math.min(1, Math.max(0, h.at));
      return p === h.at ? h : { bus: h.bus, at: p };
    }
    const f = typeof h.block == "string" ? l.get(h.block) : void 0;
    return f && !r.has(f.id) && Qt(f, e).some((p) => p.name === h.port) ? h : null;
  }, c = [];
  for (const h of i) {
    const f = We(h) ? a(h.from) : null, d = We(h) ? a(h.to) : null;
    if (!We(h) || typeof h.id != "string" || !h.id || !f || !d) {
      o = !0;
      continue;
    }
    f === h.from && d === h.to ? c.push(h) : (o = !0, c.push({ ...h, from: f, to: d }));
  }
  return o ? { ...t, blocks: s, wires: c } : t;
}
function Uu(t, e) {
  const n = new Set(e.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return t.devices.filter((i) => {
    var o, s;
    return !n.has(i.id) && i.props.kind !== "virtual_switch" && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((o = i.bindings) != null && o.power) || !!((s = i.bindings) != null && s.control));
  }).sort((i, o) => i.name.localeCompare(o.name) || i.id.localeCompare(o.id));
}
function lm(t) {
  const e = t.blocks.find((n) => n.kind === "grid");
  return !!e && e.kind === "grid" && !!e.power && t.wires.length > 0;
}
const jn = 11, Ti = 18, Vi = 30, am = 12, cm = 120, ve = 14, Kl = 10, Vn = (t) => Math.round(t / Kl) * Kl || 0, Bo = 24, Xl = 6, um = 2 * jn + 6, dm = ve, hm = 1e6, Yl = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, yo = (t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 }), Fo = (t, e, n) => t.x >= e.x - n && t.x <= e.x + e.w + n && t.y >= e.y - n && t.y <= e.y + e.h + n, Wu = (t) => Math.min(1, Math.max(0, t));
function xo(t, e) {
  var n;
  return t.kind === "device" ? ((n = e.device(t.deviceId)) == null ? void 0 : n.name) ?? "" : t.name ?? "";
}
function fm(t, e) {
  const n = (...i) => i.filter(Boolean).length;
  switch (t.kind) {
    case "grid":
      return 1 + n(t.voltage);
    case "device": {
      const i = e.device(t.deviceId);
      if (!i) return 1;
      const o = i.bindings ?? {}, s = Yt(i);
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
function De(t, e, n) {
  return n ? kr(n, t, e).r : yr(t, e);
}
function yr(t, e) {
  return t.kind === "bus" ? { x: t.x, y: t.y, w: t.w, h: t.h } : {
    x: t.x,
    y: t.y,
    w: Math.max(cm, 7 * xo(t, e).length + 32),
    h: Vi + Ti * fm(t, e) + am
  };
}
function Hi(t, e, n) {
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
function pm(t, e) {
  const n = yo(t), i = e.x - n.x, o = e.y - n.y;
  return i === 0 && o === 0 ? null : Math.abs(i) / (t.w / 2) > Math.abs(o) / (t.h / 2) ? i > 0 ? "right" : "left" : o > 0 ? "bottom" : "top";
}
function mm(t, e) {
  const n = [
    { side: "top", a: { x: t.x, y: t.y }, b: { x: t.x + t.w, y: t.y } },
    { side: "right", a: { x: t.x + t.w, y: t.y }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "bottom", a: { x: t.x, y: t.y + t.h }, b: { x: t.x + t.w, y: t.y + t.h } },
    { side: "left", a: { x: t.x, y: t.y }, b: { x: t.x, y: t.y + t.h } }
  ];
  let i = n[0], o = 1 / 0;
  for (const l of n) {
    const a = be(e, l.a, l.b);
    a < o && (i = l, o = a);
  }
  const r = i.side === "top" || i.side === "bottom" ? t.w ? (e.x - t.x) / t.w : 0.5 : t.h ? (e.y - t.y) / t.h : 0.5;
  return { side: i.side, at: Wu(r) };
}
const Hn = (t) => t.w >= t.h;
function ju(t, e) {
  return Hn(t) ? { x: t.x + e * t.w, y: t.y + t.h / 2 } : { x: t.x + t.w / 2, y: t.y + e * t.h };
}
function gm(t, e, n) {
  const i = { x: t.x, y: t.y, w: t.w, h: t.h };
  if (e === 0 || e === 1) {
    const r = Hn(t) ? e === 0 ? "left" : "right" : e === 0 ? "top" : "bottom";
    return { pt: Hi(i, r, 0.5), side: r };
  }
  const o = yo(i), s = Hn(t) ? n.y < o.y ? "top" : "bottom" : n.x < o.x ? "left" : "right";
  return { pt: Hi(i, s, e), side: s };
}
function bm(t, e) {
  if (t.kind === "device") {
    if (e.name === "BAT") return "right";
    if (e.name === "PV") return "top";
  }
  return e.dir === "in" ? "top" : "bottom";
}
const xr = (t, e) => t.blocks.find((n) => n.id === e), As = (t, e) => {
  const n = xr(t, e);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Uo = (t, e, n) => "block" in t && t.block === e && t.port === n;
function wm(t, e, n, i) {
  const o = t.wires.find((l) => Uo(l.from, e, n) || Uo(l.to, e, n));
  if (!o) return null;
  const s = Uo(o.from, e, n) ? o.to : o.from;
  if ("bus" in s) {
    const l = As(t, s.bus);
    return l ? ju(l, s.at) : null;
  }
  const r = xr(t, s.block);
  return r ? yo(yr(r, i)) : null;
}
function kr(t, e, n) {
  const i = yr(e, n), o = yo(i), s = Qt(e, n).map((c) => {
    var m;
    const h = (m = e.portPins) == null ? void 0 : m[c.name];
    if (h) return { ...c, side: h.side, pin: h, key: 0 };
    const f = wm(t, e.id, c.name, n), d = (f && pm(i, f)) ?? bm(e, c), p = f ?? o;
    return { ...c, side: d, pin: void 0, key: d === "top" || d === "bottom" ? p.x : p.y };
  }), r = (c) => {
    const h = s.filter((f) => f.side === c).length;
    return h ? (h + 1) * um : 0;
  }, l = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, a = new Array(s.length);
  s.forEach((c, h) => {
    c.pin && (a[h] = { name: c.name, dir: c.dir, side: c.side, pt: Hi(l, c.side, c.pin.at), pinned: !0 });
  });
  for (const c of ["top", "right", "bottom", "left"]) {
    const h = s.map((f, d) => ({ p: f, i: d })).filter(({ p: f }) => !f.pin && f.side === c).sort((f, d) => f.p.key - d.p.key || f.i - d.i);
    h.forEach(({ p: f, i: d }, p) => {
      a[d] = { name: f.name, dir: f.dir, side: c, pt: Hi(l, c, (p + 1) / (h.length + 1)), pinned: !1 };
    });
  }
  return { r: l, places: a };
}
function ko(t, e, n) {
  return kr(t, e, n).places;
}
function qu(t, e, n) {
  const i = (c) => {
    if (!("block" in c)) return null;
    const h = xr(t, c.block);
    if (!h) return null;
    const { r: f, places: d } = kr(t, h, n), p = d.find((m) => m.name === c.port);
    return p ? { pt: p.pt, side: p.side, rect: f } : null;
  }, o = (c, h, f) => {
    if (!("bus" in c)) return null;
    const d = As(t, c.bus);
    if (!d) return null;
    let p = f == null ? void 0 : f.pt;
    if (!p && "bus" in h) {
      const m = As(t, h.bus);
      p = m && ju(m, h.at);
    }
    return p ? { ...gm(d, c.at, p), rect: De(d, n, t) } : null;
  }, s = i(e.from), r = i(e.to), l = s ?? o(e.from, e.to, r), a = r ?? o(e.to, e.from, s);
  return l && a ? { a: l, b: a } : null;
}
const Qn = (t, e) => ({ x: Math.sign(e.x - t.x), y: Math.sign(e.y - t.y) }), Ss = (t, e) => Math.abs(e.x - t.x) + Math.abs(e.y - t.y);
function vm(t, e, n) {
  const i = [];
  for (const l of t) {
    const a = i[i.length - 1];
    if (!(a && a.x === l.x && a.y === l.y)) {
      if (a && a.x !== l.x && a.y !== l.y) return null;
      if (i.length >= 2) {
        const c = Qn(i[i.length - 2], a), h = Qn(a, l);
        if (c.x === h.x && c.y === h.y) {
          i[i.length - 1] = l;
          continue;
        }
        if (c.x === -h.x && c.y === -h.y) return null;
      }
      i.push(l);
    }
  }
  const o = i.length;
  if (o < 2 || o > 6) return null;
  const s = Qn(i[0], i[1]), r = Qn(i[o - 2], i[o - 1]);
  return s.x !== e.x || s.y !== e.y || Ss(i[0], i[1]) < ve - 1e-9 || r.x !== -n.x || r.y !== -n.y || Ss(i[o - 2], i[o - 1]) < ve - 1e-9 ? null : i;
}
function $m(t, e, n) {
  return Math.min(t.x, e.x) < n.x + n.w - 0.5 && Math.max(t.x, e.x) > n.x + 0.5 && Math.min(t.y, e.y) < n.y + n.h - 0.5 && Math.max(t.y, e.y) > n.y + 0.5;
}
function ym(t, e) {
  let n = (t.length - 2) * dm;
  for (let i = 1; i < t.length; i++) {
    n += Ss(t[i - 1], t[i]);
    for (const o of e) $m(t[i - 1], t[i], o) && (n += hm);
  }
  return n;
}
function Zu(t, e) {
  const n = t.pt, i = e.pt, o = Yl[t.side], s = Yl[e.side], r = { x: n.x + o.x * ve, y: n.y + o.y * ve }, l = { x: i.x + s.x * ve, y: i.y + s.y * ve }, a = [t.rect, e.rect].filter((x) => !!x), c = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + l[x]) / 2,
    r[x],
    l[x],
    n[x],
    i[x],
    ...a.flatMap((k) => [k[x] - ve, k[x] + k[M] + ve]),
    Math.min(r[x], l[x]) - ve,
    Math.max(r[x], l[x]) + ve
  ])], h = c("x", "w"), f = c("y", "h"), d = o.x === 0, p = s.x === 0, m = (d ? f : h).filter((x) => (x - (d ? n.y : n.x)) * (d ? o.y : o.x) >= ve - 1e-9), w = (p ? f : h).filter((x) => (x - (p ? i.y : i.x)) * (p ? s.y : s.x) >= ve - 1e-9);
  let v = null, b = 1 / 0;
  const y = (x) => {
    const M = vm(x, o, s);
    if (!M) return;
    const k = ym(M, a);
    k < b - 1e-6 && (v = M, b = k);
  };
  if (d && p)
    for (const x of m) for (const M of h) for (const k of w)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: k }, { x: i.x, y: k }, i]);
  else if (!d && !p)
    for (const x of m) for (const M of f) for (const k of w)
      y([n, { x, y: n.y }, { x, y: M }, { x: k, y: M }, { x: k, y: i.y }, i]);
  else if (d)
    for (const x of m) for (const M of w)
      y([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of w)
      y([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return v ?? [n, r, d ? { x: r.x, y: l.y } : { x: l.x, y: r.y }, l, i];
}
function Gu(t, e, n) {
  const i = De(t, e, n), o = i.x + (i.w - (3 * Bo + 2 * Xl)) / 2, s = i.y + Vi + 1;
  return ["A", "0", "B"].map((r, l) => ({
    position: r,
    rect: { x: o + l * (Bo + Xl), y: s, w: Bo, h: Ti - 2 }
  }));
}
function xm(t) {
  const { x: e, y: n, w: i, h: o } = t;
  return Hn(t) ? [{ end: "start", a: { x: e, y: n }, b: { x: e, y: n + o } }, { end: "end", a: { x: e + i, y: n }, b: { x: e + i, y: n + o } }] : [{ end: "start", a: { x: e, y: n }, b: { x: e + i, y: n } }, { end: "end", a: { x: e, y: n + o }, b: { x: e + i, y: n + o } }];
}
function Ls(t, e, n, i) {
  const o = [...t.blocks].reverse();
  for (const h of o) {
    if (h.kind !== "transfer") continue;
    const f = Gu(h, i, t).find((d) => Fo(e, d.rect, 0));
    if (f) return { kind: "chip", block: h.id, position: f.position };
  }
  let s = null, r = 1 / 0;
  for (const h of o)
    for (const f of ko(t, h, i)) {
      const d = R(e, f.pt);
      d <= jn + n && d < r && (s = { kind: "port", block: h.id, port: f.name }, r = d);
    }
  if (s) return s;
  for (const h of o) {
    if (h.kind !== "bus") continue;
    let f = null, d = 1 / 0;
    for (const p of xm(h)) {
      const m = be(e, p.a, p.b);
      m <= n && m < d && (f = { kind: "bus-end", id: h.id, end: p.end }, d = m);
    }
    if (f) return f;
  }
  for (const h of o) {
    if (h.kind !== "bus" || !Fo(e, De(h, i, t), n)) continue;
    const f = Hn(h) ? (e.x - h.x) / h.w : (e.y - h.y) / h.h;
    return { kind: "bus", id: h.id, at: Wu(f) };
  }
  let l = null, a = 1 / 0;
  for (const h of t.wires) {
    const f = qu(t, h, i);
    if (!f) continue;
    const d = Zu(f.a, f.b);
    for (let p = 1; p < d.length; p++) {
      const m = be(e, d[p - 1], d[p]);
      m <= n && m < a && (l = { kind: "wire", id: h.id }, a = m);
    }
  }
  if (l) return l;
  const c = o.find((h) => h.kind !== "bus" && Fo(e, De(h, i, t), 0));
  return c ? { kind: "block", id: c.id } : null;
}
function km(t, e) {
  if (!t.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const r of t.blocks) {
    const l = De(r, e, t);
    n = Math.min(n, l.x), i = Math.min(i, l.y), o = Math.max(o, l.x + l.w), s = Math.max(s, l.y + l.h);
  }
  return { x: n, y: i, w: o - n, h: s - i };
}
var Ku = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", Mm = "M16 20H8V6H16M16.67 4H15V2H9V4H7.33C6.6 4 6 4.6 6 5.33V20.67C6 21.4 6.6 22 7.33 22H16.67C17.41 22 18 21.41 18 20.67V5.33C18 4.6 17.4 4 16.67 4M15 16H9V19H15V16M15 7H9V10H15V7M15 11.5H9V14.5H15V11.5Z", _m = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z", Am = "M8,9H11V4H13V9H16L20,17H4L8,9M14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18H14Z", Sm = "M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z", Lm = "M11,2V22C5.9,21.5 2,17.2 2,12C2,6.8 5.9,2.5 11,2M13,2V11H22C21.5,6.2 17.8,2.5 13,2M13,13V22C17.7,21.5 21.5,17.8 22,13H13Z", Cm = "M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z", Im = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", Ql = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", nn = "M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z", Em = "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z", Om = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z", Dm = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", Nm = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Xu = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z", Pm = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z", Tm = "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z", Vm = "M19 17C20.21 17 22 16.2 22 14S20.21 11 19 11H17V9H19C21.2 9 22 7.21 22 6C22 3.8 20.21 3 19 3H17V2H16V3H8V2H7V3H2V5H7V7H5C3.79 7 2 7.8 2 10S3.79 13 5 13H7V15H5C3.79 15 2 15.8 2 18S3.79 21 5 21H7V22H8V21H16V22H17V21H22V19H17V17H19M19 13C19.45 13 20 13.19 20 14S19.45 15 19 15H17V13H19M16 11H8V9H16V11M19 5C19.45 5 20 5.2 20 6C20 6.45 19.81 7 19 7H17V5H19M8 5H16V7H8V5M5 11C4.55 11 4 10.81 4 10S4.55 9 5 9H7V11H5M8 13H16V15H8V13M5 19C4.55 19 4 18.81 4 18S4.55 17 5 17H7V19H5M16 19H8V17H16V19Z", Yu = "M8 6V18H16V6H8M14 10H10V8H14V10M19.4 1.6C19 1.2 18.5 1 18 1H6C5.5 1 5 1.2 4.6 1.6C4.2 2 4 2.5 4 3V21C4 21.5 4.2 22 4.6 22.4C5 22.8 5.5 23 6 23H18C18.5 23 19 22.8 19.4 22.4C19.8 22 20 21.5 20 21V3C20 2.5 19.8 2 19.4 1.6M18 21H6V3H18V21Z", Hm = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", zm = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Qu = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z", Rm = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Bm = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Ju = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Fm = "M4,9C5.31,9 6.42,9.83 6.83,11H17.17C17.58,9.83 18.69,9 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15C18.69,15 17.58,14.17 17.17,13H6.83C6.42,14.17 5.31,15 4,15A3,3 0 0,1 1,12A3,3 0 0,1 4,9Z", Um = "M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z", ed = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Wm = "M13,14C9.64,14 8.54,15.35 8.18,16.24C9.25,16.7 10,17.76 10,19A3,3 0 0,1 7,22A3,3 0 0,1 4,19C4,17.69 4.83,16.58 6,16.17V7.83C4.83,7.42 4,6.31 4,5A3,3 0 0,1 7,2A3,3 0 0,1 10,5C10,6.31 9.17,7.42 8,7.83V13.12C8.88,12.47 10.16,12 12,12C14.67,12 15.56,10.66 15.85,9.77C14.77,9.32 14,8.25 14,7A3,3 0 0,1 17,4A3,3 0 0,1 20,7C20,8.34 19.12,9.5 17.91,9.86C17.65,11.29 16.68,14 13,14M7,18A1,1 0 0,0 6,19A1,1 0 0,0 7,20A1,1 0 0,0 8,19A1,1 0 0,0 7,18M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M17,6A1,1 0 0,0 16,7A1,1 0 0,0 17,8A1,1 0 0,0 18,7A1,1 0 0,0 17,6Z", jm = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z", qm = "M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M4 6L6 4H10.9L4 10.9V6M4 13.7L13.7 4H18.6L4 18.6V13.7M20 18L18 20H13.1L20 13.1V18M20 10.3L10.3 20H5.4L20 5.4V10.3Z", Zm = "M10 13V5C10 3.34 8.66 2 7 2S4 3.34 4 5V13C1.79 14.66 1.34 17.79 3 20S7.79 22.66 10 21 12.66 16.21 11 14C10.72 13.62 10.38 13.28 10 13M7 4C7.55 4 8 4.45 8 5V8H6V5C6 4.45 6.45 4 7 4M18 7C18 7 14 11.34 14 14.07C14 19.31 22 19.31 22 14.07C22 11.34 18 7 18 7Z", Gm = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z", Km = "M15 3H9V1H15V3M11 14H13V8H11V14M19 13C19.7 13 20.36 13.13 21 13.35C21 13.23 21 13.12 21 13C21 10.88 20.26 8.93 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13S7.03 22 12 22C12.59 22 13.16 21.94 13.71 21.83C13.4 21.25 13.18 20.6 13.08 19.91C12.72 19.96 12.37 20 12 20C8.13 20 5 16.87 5 13S8.13 6 12 6 19 9.13 19 13M17 16V22L22 19L17 16Z", Xm = "M18.4 1.6C18 1.2 17.5 1 17 1H7C6.5 1 6 1.2 5.6 1.6C5.2 2 5 2.5 5 3V21C5 21.5 5.2 22 5.6 22.4C6 22.8 6.5 23 7 23H17C17.5 23 18 22.8 18.4 22.4C18.8 22 19 21.5 19 21V3C19 2.5 18.8 2 18.4 1.6M16 7C16 7.6 15.6 8 15 8H9C8.4 8 8 7.6 8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7Z", Ym = "M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z", Qm = "M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17", Jm = "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z", eg = "M3,16H12V21H3V16M2,10H8V15H2V10M9,10H15V15H9V10M16,10H22V15H16V10M13,16H21V21H13V16M3,4H11V9H3V4M12,4H21V9H12V4Z", tg = "M13 19V16H11V19H13M19.09 16.5L20.5 15.09L18.73 13.32L17.32 14.73L19.09 16.5M4.91 16.5L6.68 14.73L5.27 13.32L3.5 15.09L4.91 16.5M20 12C20 9.14 18.5 6.5 16 5.07S10.5 3.64 8 5.07 4 9.14 4 12H20Z", td = "M10 3.25C10 3.25 16 10 16 14C16 17.31 13.31 20 10 20S4 17.31 4 14C4 10 10 3.25 10 3.25M20 7V13H18V7H20M18 17H20V15H18V17Z", ng = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z", ig = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z", og = "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z";
const Ne = "non-scaling-stroke", zn = "system-ui, sans-serif", sg = 13, mn = 9, rg = 11, Jl = 18, Wo = 12, jo = 11, Jn = 13, lg = 3, wi = 10, ea = 4.5, ag = 12, cg = 11.5, Mr = 10, qo = 10.5, ug = 6, dg = {
  IN: Rm,
  OUT: Ju,
  BAT: Bm,
  PV: ed
}, ta = { dead: 0, nodata: 1, idle: 2, live: 3 };
function _e(t) {
  if (t == null || !Number.isFinite(t)) return "—";
  const e = Math.round(t);
  if (e === 0) return "0 W";
  const n = t < 0 ? "−" : "";
  return Math.abs(e) < 1e3 ? `${n}${Math.abs(e)} W` : `${n}${(Math.abs(t) / 1e3).toFixed(2)} kW`;
}
const Bt = (t, e) => t == null || !Number.isFinite(t) ? "—" : `${Math.round(t)} ${e}`;
function hg(t) {
  return t ? t.state === "dead" ? "dead" : t.power === null ? "nodata" : Math.abs(t.power) >= 1 ? "live" : "idle" : "nodata";
}
function qn(t, e) {
  return { live: e.powerLive, idle: e.powerIdle, dead: e.powerDead, nodata: e.powerNoData }[t];
}
const fg = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, pg = _`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, nd = (t, e, n, i) => _`<path class=${t} d=${e} fill="none"
  stroke=${n} stroke-width="8" stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round"
  vector-effect=${Ne}>${i ? $ : pg}</path>`, id = (t) => `M${t.map((e) => `${e.x} ${e.y}`).join("L")}`, qt = (t, e, n, i) => _`<path d=${t} fill=${i} transform=${`translate(${e.x - n / 2} ${e.y - n / 2}) scale(${n / 24})`}></path>`;
function mg(t, e) {
  var c;
  const n = (c = t.live) == null ? void 0 : c.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (h) => "block" in h ? jn : mn, o = t.pts[0], s = t.pts[t.pts.length - 1], r = wi / 2 / e.scale, l = 3 / e.scale, a = t.pts.slice(1).map((h, f) => ({ p: t.pts[f], q: h, len: Math.abs(h.x - t.pts[f].x) + Math.abs(h.y - t.pts[f].y) })).sort((h, f) => f.len - h.len);
  for (const { p: h, q: f, len: d } of a) {
    if (d < 2 * r + 2 * l) continue;
    const p = { x: (h.x + f.x) / 2, y: (h.y + f.y) / 2 }, m = (v, b) => Math.hypot(p.x - v.x, p.y - v.y) >= b + r + l;
    if (!m(o, i(t.w.from)) || !m(s, i(t.w.to))) continue;
    const w = Math.atan2(f.y - h.y, f.x - h.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: p, deg: ((w + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function gg(t, e, n) {
  var c;
  const i = e.palette, o = qn(t.style, i), s = id(t.pts), r = ((c = e.selection) == null ? void 0 : c.kind) === "powerWire" && e.selection.id === t.w.id, l = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[t.style], a = mg(t, e);
  return _`<g data-wire=${t.w.id}>
    ${r ? _`<path class="wire-selection" d=${s} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${Ne}></path>` : $}
    ${t.style === "live" ? nd("glow", s, o, n) : $}
    <path class=${`wire ${t.style}`} d=${s} fill="none" stroke=${o} stroke-width=${l}
      stroke-dasharray=${t.style === "nodata" ? "5 4" : $} stroke-linejoin="round" vector-effect=${Ne}></path>
    ${a ? _`<path class="arrow" d=${`M${wi / 2} 0L${-wi / 2} ${-ea}L${-wi / 2} ${ea}Z`}
      fill=${o} transform=${`translate(${a.at.x} ${a.at.y}) rotate(${a.deg}) scale(${1 / e.scale})`}></path>` : $}
  </g>`;
}
function bg(t, e, n) {
  const i = dg[t.name];
  return _`<g class="port" data-port=${t.name}>
    <title>${t.name}</title>
    <circle cx=${t.pt.x} cy=${t.pt.y} r=${jn} fill=${n.portFill}
      stroke=${e ? qn(e, n) : n.blockStroke} stroke-width="1.5" vector-effect=${Ne}></circle>
    ${i ? qt(i, t.pt, sg, n.portIcon) : _`<text x=${t.pt.x} y=${t.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${zn}>${t.name}</text>`}
  </g>`;
}
function wg(t, e) {
  const n = Math.max(4, Math.floor(e / (Mr * 0.55)));
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
function vg(t, e, n, i) {
  const o = e.map((l) => {
    const a = t.blocks.find((c) => c.id === l);
    return a ? xo(a, n) || u(`power.kind.${a.kind}`) : l;
  }), s = u("power.absorbed.one");
  return { kind: "text", value: o.length === 1 ? s.replace("{name}", wg(o[0], i - 12 - s.replace("{name}", "").length * Mr * 0.55)) : u("power.absorbed.many").replace("{n}", String(o.length)), small: !0, title: o.join(", ") };
}
function $g(t, e, n, i, o, s) {
  var a;
  const r = () => ({ kind: "text", value: _e(i == null ? void 0 : i.power) }), l = (c) => ({ kind: "switch", state: i == null ? void 0 : i.switch, controllable: c });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [r(), { kind: "text", value: Bt(i == null ? void 0 : i.voltage, "V") }] : [r()];
    case "device": {
      const c = n.device(e.deviceId);
      if (!c) return [{ kind: "text", value: u("power.missing"), fill: o.blockInvalid }];
      const h = c.bindings ?? {}, f = Yt(c), d = [];
      return f ? (h.power_in && d.push({ kind: "text", label: u("power.in"), value: _e(i == null ? void 0 : i.power_in) }), h.power_out && d.push({ kind: "text", label: u("power.out"), value: _e(i == null ? void 0 : i.power_out) })) : h.power && d.push(r()), h.voltage && d.push({ kind: "text", value: Bt(i == null ? void 0 : i.voltage, "V") }), h.control && d.push(l(ou(c))), f && d.push({ kind: "text", label: u("power.loss"), value: _e(i == null ? void 0 : i.loss) }), d;
    }
    case "battery":
      return [{ kind: "text", label: u("power.soc"), value: Bt(i == null ? void 0 : i.soc, "%") }, r()];
    case "pv":
      return [r()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (i == null ? void 0 : i.hint) === "disagree" ? [{ kind: "text", value: "—", note: u("power.hint.disagree"), fill: o.blockInvalid }] : (a = i == null ? void 0 : i.absorbed) != null && a.length ? [r(), vg(t, i.absorbed, n, s)] : [r()];
    case "bus":
      return [];
  }
}
function yg(t, e, n) {
  const i = t.state ?? "unknown", o = t.controllable ? 0 : Wo + 3, s = e.x - o / 2, r = `${u(`power.switch.${i}`)}${t.controllable ? "" : ` · ${u("power.readOnly")}`}`;
  return _`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : $}>
    <title>${r}</title>
    ${qt(
    i === "on" ? Nm : Dm,
    { x: s, y: e.y },
    Jl,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${t.controllable ? $ : qt(Hm, { x: s + Jl / 2 + 3 + Wo / 2, y: e.y + 1 }, Wo, n.blockValue)}
  </g>`;
}
function na(t, e, n) {
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
function xg(t, e, n) {
  const i = 2 * (t.w + t.h), o = na(t, e.side, e.pt), s = ((na(t, n.side, n.pt) - o) % i + i) % i, r = s <= i / 2 ? 1 : -1, l = r > 0 ? s : i - s, c = [
    { t: 0, pt: { x: t.x, y: t.y } },
    { t: t.w, pt: { x: t.x + t.w, y: t.y } },
    { t: t.w + t.h, pt: { x: t.x + t.w, y: t.y + t.h } },
    { t: 2 * t.w + t.h, pt: { x: t.x, y: t.y + t.h } }
  ].map((h) => ({ c: h, d: ((h.t - o) * r % i + i) % i })).filter(({ d: h }) => h > 0 && h < l).sort((h, f) => h.d - f.d).map(({ c: h }) => h.pt);
  return [e.pt, ...c, n.pt];
}
function kg(t, e, n, i, o, s) {
  const r = n == null ? void 0 : n.position;
  if (r !== "A" && r !== "B") return $;
  const l = ko(t, e, i.geo), a = l.find((p) => p.name === r), c = l.find((p) => p.name === (e.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !c) return $;
  const h = o(c.name) ?? "nodata", f = qn(h, i.palette), d = id(xg(De(e, i.geo, t), a, c));
  return _`${h === "live" ? nd("ts-glow", d, f, s) : $}
    <path class="ts-path" d=${d} fill="none" stroke=${f} stroke-width="3" stroke-dasharray=${h === "nodata" ? "5 4" : $}
      stroke-linejoin="round" stroke-linecap="round" vector-effect=${Ne}></path>`;
}
function Mg(t, e, n, i) {
  const o = i.palette;
  return Gu(e, i.geo, t).map(({ position: s, rect: r }) => {
    const l = (n == null ? void 0 : n.position) === s;
    return _`<g class=${l ? "chip current" : "chip"} data-position=${s} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${l ? o.accent : "none"}
        stroke=${l ? o.accent : o.blockStroke} stroke-width="1" vector-effect=${Ne}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${l ? o.accentText : o.blockValue} font-family=${zn}>${s}</text>
    </g>`;
  });
}
function _g(t) {
  const e = /^unavailable:(.*)$/.exec(t);
  return e ? u("power.alert.unavailable").replace("{entity}", e[1]) : t === "missing-device" ? u("power.alert.missingDevice") : t === "disagree" ? u("power.alert.disagree") : t;
}
function Ag(t, e, n, i) {
  const o = lg + Jn / 2, s = [
    { x: e.x + e.w - o, y: e.y + o },
    { x: e.x + e.w - o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + e.h - o },
    { x: e.x + o, y: e.y + o }
  ], r = (a) => n.every(({ pt: c }) => {
    const h = Math.max(Math.abs(c.x - a.x) - Jn / 2, 0), f = Math.max(Math.abs(c.y - a.y) - Jn / 2, 0);
    return Math.hypot(h, f) > jn;
  }), l = s.find(r) ?? s[0];
  return _`<g class="alert"><title>${t.map(_g).join(`
`)}</title>
    ${qt(Ku, l, Jn, i.blockInvalid)}</g>`;
}
function Sg(t, e, n, i, o) {
  var w, v;
  const s = n.palette, r = De(e, n.geo, t), l = (w = n.frame) == null ? void 0 : w.blocks[e.id], a = e.kind === "device" ? n.geo.device(e.deviceId) : void 0, c = e.kind === "device" && !a, h = r.x + r.w / 2, f = xo(e, n.geo) || u(`power.kind.${e.kind}`), d = $g(t, e, n.geo, l, s, r.w), p = e.kind === "remainder", m = ko(t, e, n.geo);
  return _`<g class=${`block block-${e.kind}${c ? " missing" : ""}`} data-id=${e.id}>
    <rect class="body" x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="4" fill=${s.blockFill}
      stroke=${p ? s.powerRemainder : s.blockStroke} stroke-width=${p ? 1.5 : 1.25}
      stroke-dasharray=${p ? "6 4" : $} vector-effect=${Ne}></rect>
    ${e.kind === "transfer" ? kg(t, e, l, n, (b) => i(e.id, b), o) : $}
    ${a && a.placement.mode !== "none" ? _`<g class="pin"><title>${u("power.planDevice")}</title>
      ${qt(zm, { x: r.x + 4 + jo / 2, y: r.y + 4 + jo / 2 }, jo, s.blockValue)}</g>` : $}
    <text class="name" x=${h} y=${r.y + Vi - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${ag} font-weight="600" fill=${s.blockName} font-family=${zn}>${f}</text>
    ${d.map((b, y) => {
    const x = r.y + Vi + y * Ti + Ti / 2;
    if (b.kind === "chips") return e.kind === "transfer" ? Mg(t, e, l, n) : $;
    if (b.kind === "switch") return yg(b, { x: h, y: x }, s);
    const M = b.fill ?? s.blockValue, k = b.label ? _`<tspan>${b.label} </tspan>` : $, S = b.note ? _`<tspan> ${b.note}</tspan>` : $;
    return _`<text x=${h} y=${x} text-anchor="middle" dominant-baseline="central" font-size=${b.small ? Mr : cg}
        fill=${M} font-family=${zn}>${b.title ? _`<title>${b.title}</title>` : $}${k}<tspan
        font-weight=${b.small ? $ : "600"}>${b.value}</tspan>${S}</text>`;
  })}
    ${(v = l == null ? void 0 : l.alert) != null && v.length ? Ag(l.alert, r, m, s) : $}
    ${m.map((b) => bg(b, i(e.id, b.name), s))}
  </g>`;
}
function Lg(t, e, n, i) {
  const o = i.palette, s = t.w >= t.h, r = s ? t.x : t.y, l = r + (s ? t.w : t.h), a = s ? t.h : t.w;
  let c = $;
  const h = t.name ?? "", f = Math.min(qo, a - 4), d = f >= ug, p = h.length * (d ? f : qo) * 0.58 + 12;
  if (h) {
    const m = e.map((b) => s ? b.x : b.y).sort((b, y) => b - y);
    let w = { lo: 0, hi: -1 }, v = r;
    for (const b of [...m, l + mn]) {
      const y = Math.min(b - mn, l);
      y - v > w.hi - w.lo && (w = { lo: v, hi: y }), v = Math.max(v, b + mn);
    }
    if (w.hi - w.lo >= p) {
      const b = (w.lo + w.hi) / 2, y = s ? { x: b, y: d ? t.y + t.h / 2 : t.y - 7 } : { x: d ? t.x + t.w / 2 : t.x - 7, y: b };
      c = _`<text class="bus-name" x=${y.x} y=${y.y} text-anchor="middle" dominant-baseline="central"
        font-size=${d ? f : qo} fill=${o.blockValue} font-family=${zn}
        transform=${s ? $ : `rotate(-90 ${y.x} ${y.y})`}>${h}</text>`;
    }
  }
  return _`<g class="block block-bus" data-id=${t.id}>
    <rect class="body" x=${t.x} y=${t.y} width=${t.w} height=${t.h} rx="2" fill=${o.blockFill}
      stroke=${n ? qn(n, o) : o.blockStroke} stroke-width="1.5" vector-effect=${Ne}></rect>
    ${c}
  </g>`;
}
function Cg(t, e, n) {
  return _`<g class="terminal">
    <circle cx=${t.x} cy=${t.y} r=${mn} fill=${n.portFill} stroke=${qn(e, n)} stroke-width="1.5"
      vector-effect=${Ne}></circle>
    ${qt(Im, t, rg, n.portIcon)}
  </g>`;
}
function Ig(t, e) {
  const n = e.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return $;
  const i = t.blocks.find((r) => r.id === n.id);
  if (!i) return $;
  const o = De(i, e.geo, t), s = 4 / e.scale;
  return _`<rect class="selection" x=${o.x - s} y=${o.y - s} width=${o.w + 2 * s} height=${o.h + 2 * s} rx="6"
    fill="none" stroke=${e.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${Ne}></rect>`;
}
function Eg(t, e) {
  var d;
  const n = e.preview.power ?? t, i = e.palette, o = [];
  for (const p of n.wires) {
    const m = qu(n, p, e.geo);
    if (!m) continue;
    const w = (d = e.frame) == null ? void 0 : d.wires[p.id];
    o.push({ w: p, a: m.a, b: m.b, pts: Zu(m.a, m.b), live: w, style: hg(w) });
  }
  const s = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), a = [];
  for (const p of o)
    for (const [m, w] of [[p.w.from, p.a], [p.w.to, p.b]]) {
      if ("block" in m) {
        s.set(`${m.block}:${m.port}`, p.style);
        continue;
      }
      const v = r.get(m.bus);
      (v === void 0 || ta[p.style] > ta[v]) && r.set(m.bus, p.style), l.set(m.bus, [...l.get(m.bus) ?? [], w.pt]), a.push({ at: w.pt, style: p.style });
    }
  const c = (p, m) => s.get(`${p}:${m}`), h = fg(), f = e.preview.wireDraft;
  return _`<g class="power">
    <g class="buses">${n.blocks.map((p) => p.kind === "bus" ? Lg(p, l.get(p.id) ?? [], r.get(p.id), e) : $)}</g>
    <g class="wires">${o.map((p) => gg(p, e, h))}</g>
    ${Ig(n, e)}
    <g class="blocks">${n.blocks.map((p) => p.kind === "bus" ? $ : Sg(n, p, e, c, h))}</g>
    <g class="terminals">${a.map((p) => Cg(p.at, p.style, i))}</g>
    ${f ? _`<line class="wire-draft" x1=${f.from.x} y1=${f.from.y} x2=${f.to.x} y2=${f.to.y}
      stroke=${f.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${Ne}></line>` : $}
  </g>`;
}
const Zt = { nightBelow: 10, dayAbove: 50, sunNight: -6, sunDay: 3, debounce: 60 }, od = 3600, Rn = (t) => typeof t == "number" && Number.isFinite(t);
function Og(t) {
  const e = t.props.kind === "illuminance_sensor" ? t.props : {}, n = Zt, i = sd(e.nightBelow, e.dayAbove), o = rd(e.sunNight, e.sunDay);
  return {
    nightBelow: i ? e.nightBelow ?? n.nightBelow : n.nightBelow,
    dayAbove: i ? e.dayAbove ?? n.dayAbove : n.dayAbove,
    sunNight: o ? e.sunNight ?? n.sunNight : n.sunNight,
    sunDay: o ? e.sunDay ?? n.sunDay : n.sunDay,
    debounce: ld(e.debounce) ? e.debounce ?? n.debounce : n.debounce
  };
}
function sd(t, e) {
  if (t !== void 0 && !Rn(t) || e !== void 0 && !Rn(e)) return !1;
  const n = t ?? Zt.nightBelow, i = e ?? Zt.dayAbove;
  return n >= 0 && n < i;
}
function rd(t, e) {
  if (t !== void 0 && !Rn(t) || e !== void 0 && !Rn(e)) return !1;
  const n = t ?? Zt.sunNight, i = e ?? Zt.sunDay;
  return n < i;
}
const ld = (t) => t === void 0 || Number.isInteger(t) && t >= 0 && t <= od, ia = (t, e, n) => t < e ? "night" : t > n ? "day" : "twilight";
function Dg(t, e) {
  var l, a, c, h;
  const n = Og(t), i = (f) => {
    const d = f ? e == null ? void 0 : e[f] : void 0;
    return d && typeof d == "object" ? d : void 0;
  }, o = i((l = t.bindings) == null ? void 0 : l.illuminance);
  if (o && ((a = o.attributes) == null ? void 0 : a.unit_of_measurement) === "lx" && typeof o.state == "string" && o.state.trim() !== "") {
    const f = Number(o.state);
    if (Number.isFinite(f)) return { state: ia(f, n.nightBelow, n.dayAbove), lux: f };
  }
  const s = i((c = t.bindings) == null ? void 0 : c.sun), r = (h = s == null ? void 0 : s.attributes) == null ? void 0 : h.elevation;
  return s && s.state !== "unavailable" && s.state !== "unknown" && Rn(r) ? { state: ia(r, n.sunNight, n.sunDay), elevation: r } : { state: null };
}
const Ng = { W: 1, kW: 1e3, MW: 1e6, mW: 1e-3 };
function _r(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  if (e < 60) return String(e);
  const n = (i) => String(i).padStart(2, "0");
  return e < 3600 ? `${Math.floor(e / 60)}:${n(e % 60)}` : `${Math.floor(e / 3600)}:${n(Math.floor(e / 60) % 60)}:${n(e % 60)}`;
}
const Cs = (t, e) => {
  const n = e ? t == null ? void 0 : t[e] : void 0;
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function Pg(t, e) {
  var s;
  const n = Cs(t, e);
  if (!n || n.state.trim() === "") return;
  const i = Ng[((s = n.attributes) == null ? void 0 : s.unit_of_measurement) ?? ""], o = Number(n.state);
  return i === void 0 || !Number.isFinite(o) ? void 0 : o * i;
}
const Tg = (t) => {
  const e = t.last_changed ? Date.parse(t.last_changed) : NaN;
  return Number.isFinite(e) ? e : void 0;
};
function vi(t, e) {
  var p;
  const n = t.bindings ?? {}, i = t.props.kind;
  let o = "none", s = !1, r = !1, l;
  const a = (m, w, v) => {
    if (!m) return;
    l = Cs(e, m);
    const b = (l == null ? void 0 : l.state) ?? "";
    o = w.includes(b) ? "on" : v.includes(b) ? "off" : "no-data";
  }, c = ["on"], h = ["off"];
  switch (i) {
    case "ceiling_light":
    case "wall_light":
    case "exhaust_fan":
      s = !0;
    // falls through
    case "socket":
    case "equipment":
    case "virtual_switch": {
      r = !!n.control, a(n.control, c, h);
      break;
    }
    case "motion_sensor":
    case "leak_sensor": {
      s = !0, a(n[i === "motion_sensor" ? "motion" : "leak"], c, h), o === "on" && (o = "active");
      break;
    }
    case "wall_switch":
      a(n.state, c, h);
      break;
    // A speaker is on while its player plays.
    case "speaker": {
      if (!n.player) break;
      const m = (p = Cs(e, n.player)) == null ? void 0 : p.state;
      o = m === "playing" ? "on" : m === void 0 || m === "unavailable" || m === "unknown" ? "no-data" : "off";
      break;
    }
    // A valve may be a `switch` entity: the server maps open = on, closed = off.
    case "valve":
      a(n.state, ["open", "on"], ["closed", "off"]);
      break;
  }
  const f = { look: o };
  if (s && l && (o === "on" || o === "active")) {
    const m = Tg(l);
    m !== void 0 && (f.timerSince = m);
  }
  const d = Le(t).some((m) => m.role === "power") ? Pg(e, n.power) : void 0;
  return d !== void 0 && Math.round(d) >= 1 && (o === "on" || !r) && (f.power = d), i === "illuminance_sensor" && (n.illuminance || n.sun) && (f.daylight = Vg(t, e)), f;
}
function Vg(t, e) {
  const n = Dg(t, e);
  if (n.state === null) return u("daylight.noData");
  const i = u(`daylight.${n.state}`);
  return "lux" in n ? `${i} ${Number(n.lux.toPrecision(6))} lx` : `${i} ${u("daylight.bySun")}`;
}
function ad(t, e, n) {
  const i = [];
  if (t.timerSince !== void 0) {
    const o = e.props.kind;
    i.push({ text: _r(n - t.timerSince), tone: o === "motion_sensor" ? "motion" : o === "leak_sensor" ? "leak" : "device", id: "timer" });
  }
  return t.power !== void 0 && i.push({ text: _e(t.power), tone: "device", id: "power" }), t.daylight !== void 0 && i.push({ text: t.daylight, tone: "device", id: "daylight" }), i;
}
function $i(t) {
  const e = Math.max(0, Math.floor(t / 1e3));
  return e < 60 ? `${e} s` : _r(e * 1e3);
}
const Hg = (t) => t < 1e3 ? "<1 s" : $i(Math.round(t / 1e3) * 1e3);
function zg(t, e) {
  return t.map(({ label: n, value: i, stats: o }) => {
    const s = `${n}  ${i}`;
    if (!o) return s;
    if (o.count <= 0 || o.last === null) return `${s} · ${u("power.hint.none")}`;
    const r = [s];
    if (o.period !== null && r.push(u("power.hint.every").replace("{period}", Hg(o.period))), r.push(u("power.hint.last").replace("{age}", $i(e - o.last))), o.period !== null) {
      const l = o.last + o.period - e;
      r.push(l >= 0 ? u("power.hint.next").replace("{left}", $i(Math.ceil(l / 1e3) * 1e3)) : u("power.hint.overdue").replace("{over}", $i(-l)));
    }
    return r.join(" · ");
  });
}
const ei = 8, Te = 4, Rg = 6.8, Bg = 17, Fg = 22, Ug = 12;
function Wg(t) {
  return { w: Math.ceil(Math.max(0, ...t.map((e) => e.length)) * Rg + Fg), h: t.length * Bg + Ug };
}
function jg(t, e, n) {
  const i = (h, f, d) => Math.max(f, Math.min(h, Math.max(f, d))), o = i(t.x + t.w / 2 - e.w / 2, Te, n.w - e.w - Te), s = i(t.y + t.h / 2 - e.h / 2, Te, n.h - e.h - Te), r = t.y + t.h + ei;
  if (r + e.h <= n.h - Te) return { left: o, top: r };
  const l = t.y - ei - e.h;
  if (l >= Te) return { left: o, top: l };
  const a = t.x + t.w + ei;
  if (a + e.w <= n.w - Te) return { left: a, top: s };
  const c = t.x - ei - e.w;
  return c >= Te ? { left: c, top: s } : { left: o, top: i(r, Te, n.h - e.h - Te) };
}
class cd extends Error {
  constructor(e = "Revision conflict") {
    super(e), this.name = "RevisionConflictError";
  }
}
async function Zo(t) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function qg(t) {
  return t.connection.sendMessagePromise({ type: "plan_studio/info" });
}
async function Zg(t, e) {
  return (await t.sendMessagePromise({ type: "plan_studio/readings/get", entity_ids: e })).readings;
}
async function Gg(t, e) {
  return (await t.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: e
  })).plan;
}
async function Kg(t, e, n, i = !1) {
  try {
    return (await t.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: e,
      expected_revision: n,
      force: i
    })).revision;
  } catch (o) {
    throw typeof o == "object" && o !== null && o.code === "revision_conflict" ? new cd(o.message) : o;
  }
}
async function Xg(t, e) {
  await t.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: e
  });
}
const Yg = 2e3, Qg = 200;
class Jg {
  constructor(e, n) {
    this.host = e, this.connection = n, this.stats = null, this.json = "", this.ids = [], this.timer = null, this.run = 0, this.asked = 0, this.applied = 0;
  }
  watch(e) {
    const n = e.slice(0, Qg), i = JSON.stringify(n);
    i === this.json && this.timer !== null || (this.stop(), n.length !== 0 && (this.json = i, this.ids = n, this.timer = setInterval(() => {
      this.ask(this.run);
    }, Yg), this.ask(this.run)));
  }
  stop() {
    this.timer !== null && clearInterval(this.timer), this.timer = null, this.run++, this.json = "", this.ids = [], this.stats = null;
  }
  async ask(e) {
    const n = this.connection();
    if (!n) return;
    const i = ++this.asked;
    try {
      const o = await Zg(n, this.ids);
      if (e !== this.run || i < this.applied || !o || typeof o != "object") return;
      this.applied = i, this.stats = o, this.host.requestUpdate();
    } catch {
    }
  }
}
function e1(t, e) {
  var n, i;
  return e.domains.includes(t.domain) ? (n = e.plainDomains) != null && n.includes(t.domain) ? t.deviceClass === null && t.unit === null : e.deviceClasses ? t.deviceClass !== null ? e.deviceClasses.includes(t.deviceClass) : t.unit !== null && !!((i = e.units) != null && i.includes(t.unit)) : !0 : !1;
}
const oa = /* @__PURE__ */ new WeakMap();
function Ar(t, e, n) {
  let i = oa.get(t);
  i || oa.set(t, i = /* @__PURE__ */ new WeakMap());
  let o = i.get(e);
  o || i.set(e, o = [null, null]);
  const s = n ? 1 : 0;
  if (o[s]) return o[s];
  const r = [...t.entities.values()].filter((l) => {
    var a;
    return n ? e.domains.includes(l.domain) : e1(l, e) && !l.hidden && !l.disabled && (l.category === null || !!((a = e.categories) != null && a.includes(l.category)));
  });
  return r.sort((l, a) => l.name.localeCompare(a.name) || l.entityId.localeCompare(a.entityId)), o[s] = r, r;
}
function yi(t, e) {
  const n = t.entities.get(e), i = n != null && n.deviceId ? t.devices.get(n.deviceId) : void 0, o = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, s = [o ? t.areas.get(o) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? e, context: s.join(" ▸ ") || e };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ti = (t) => t ?? $;
var t1 = Object.defineProperty, Zn = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && t1(e, n, o), o;
};
const n1 = 100;
let i1 = 0;
const o1 = (t) => g`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`, el = class el extends zt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${i1++}`, this.shown = null, this.onOutside = (e) => {
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
        if (o.length === n1) {
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
        aria-controls=${`${this.uid}-lb`} aria-label=${ti(this.label || void 0)} title=${ti(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
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
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${ti(e.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(o) => {
      this.query = o.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${e.map((o, s) => g`<div class="opt ${s === i ? "on" : ""}" id=${this.optId(s)} role="option"
            aria-selected=${o.id === this.value ? "true" : "false"} data-id=${o.id} title=${ti(this.rowTitle(o))}
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
el.styles = _c`
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
let ht = el;
Zn([
  Ke()
], ht.prototype, "value");
Zn([
  Ke()
], ht.prototype, "label");
Zn([
  X()
], ht.prototype, "isOpen");
Zn([
  X()
], ht.prototype, "query");
Zn([
  X()
], ht.prototype, "active");
var s1 = Object.defineProperty, Sr = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && s1(e, n, o), o;
};
const r1 = {
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
}, sa = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, l1 = { light: "light", switch: "switch", event: "event", fan: "fan" };
function ra(t, e) {
  return t != null && t.deviceClass && sa[t.deviceClass] ? sa[t.deviceClass] : l1[(t == null ? void 0 : t.domain) ?? wr(e)] ?? "generic";
}
const la = (t) => o1(r1[t]);
function a1(t) {
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
class Mo extends ht {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const e of this.items) {
      const { name: n, context: i } = yi(this.meta, e.entityId);
      yield { id: e.entityId, name: n, context: i, search: `${n}
${e.entityId}
${i}`.toLowerCase(), e };
    }
  }
  renderBox() {
    const e = this.value, n = e ? yi(this.meta, e) : null;
    return g`${la(e ? ra(this.meta.entities.get(e), e) : "generic")}
      ${n ? g`<span><b>${n.name}</b>${n.context !== n.name ? g`<small>${n.context}</small>` : $}<small class="eid">${e}</small></span>` : g`<span class="ph">${u("combo.none")}</span>`}`;
  }
  renderRow({ e, name: n, context: i }) {
    const o = vr(this.states, e.entityId) ?? "unavailable";
    return g`${la(ra(e, e.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${e.entityId}</small></span>
      <span class="side">${a1(e.domain)}<br>${o}${e.unit ? ` ${e.unit}` : ""}</span>`;
  }
  boxTitle() {
    const e = this.value;
    if (!e) return;
    const n = yi(this.meta, e).name;
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
Sr([
  Ke({ attribute: !1 })
], Mo.prototype, "meta");
Sr([
  Ke({ attribute: !1 })
], Mo.prototype, "items");
Sr([
  Ke({ attribute: !1 })
], Mo.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", Mo);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const je = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, _o = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ao = class {
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
const { I: c1 } = Th, aa = (t) => t, ud = (t) => t.strings === void 0, ca = () => document.createComment(""), on = (t, e, n) => {
  var s;
  const i = t._$AA.parentNode, o = e === void 0 ? t._$AB : e._$AA;
  if (n === void 0) {
    const r = i.insertBefore(ca(), o), l = i.insertBefore(ca(), o);
    n = new c1(r, l, t, t.options);
  } else {
    const r = n._$AB.nextSibling, l = n._$AM, a = l !== t;
    if (a) {
      let c;
      (s = n._$AQ) == null || s.call(n, t), n._$AM = t, n._$AP !== void 0 && (c = t._$AU) !== l._$AU && n._$AP(c);
    }
    if (r !== o || a) {
      let c = n._$AA;
      for (; c !== r; ) {
        const h = aa(c).nextSibling;
        aa(i).insertBefore(c, o), c = h;
      }
    }
  }
  return n;
}, mt = (t, e, n = t) => (t._$AI(e, n), t), u1 = {}, Lr = (t, e = u1) => t._$AH = e, d1 = (t) => t._$AH, Go = (t) => {
  t._$AR(), t._$AA.remove();
};
class h1 extends Ao {
  constructor(e) {
    if (super(e), e.type !== je.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(e) {
    return e;
  }
  update(e, [n]) {
    const i = e.element;
    return i.getRootNode().activeElement === i || i[e.name] === n ? ye : (Lr(e), n);
  }
}
const Q = _o(h1);
function Cr(t, e) {
  return Math.abs(e.x - t.x) >= Math.abs(e.y - t.y) ? { x: e.x, y: t.y } : { x: t.x, y: e.y };
}
function f1(t, e, n) {
  return B(t, T(ao(P(e, t)), n));
}
function ni(t, e) {
  return { pt: t, kind: e, endpoint: { kind: "free", pt: t } };
}
function kt(t, e, n) {
  const { tolMm: i, grid: o, ortho: s } = n, r = s ? n.from : void 0, l = new Set(n.excludeNodeIds ?? []), a = r ? Cr(r, e) : e, c = r !== void 0 && a.y === r.y, h = (k) => !r || Math.abs(c ? k.y - r.y : k.x - r.x) <= 1;
  let f = null;
  for (const k of t.nodes) {
    if (l.has(k.id)) continue;
    const S = { x: k.x, y: k.y }, C = R(S, a);
    C <= i && h(S) && (!f || C < f.d) && (f = { id: k.id, pt: S, d: C });
  }
  let d = null;
  for (const k of n.corners ?? []) {
    const S = R(k.pt, a);
    S <= i && h(k.pt) && (!d || S < d.d) && (d = { c: k, d: S });
  }
  if (d && (!f || d.d < f.d)) {
    const k = d.c.pt;
    return { pt: k, kind: "corner", endpoint: { kind: "free", pt: k }, corner: d.c };
  }
  if (f) return { pt: f.pt, kind: "node", endpoint: { kind: "node", nodeId: f.id } };
  const p = t.walls.filter((k) => !l.has(k.a) && !l.has(k.b)).map((k) => ({ w: k, f: ae(t, k) })).filter((k) => k.f.len > 1e-9);
  let m = null;
  for (const { w: k, f: S } of p) {
    const C = { x: (S.a.x + S.b.x) / 2, y: (S.a.y + S.b.y) / 2 }, A = R(C, a);
    A <= i && h(C) && (!m || A < m.d) && (m = { wallId: k.id, pt: C, offset: S.len / 2, d: A });
  }
  if (m)
    return { pt: m.pt, kind: "mid", endpoint: { kind: "wall", wallId: m.wallId, offset: m.offset } };
  const w = (k) => {
    let S = null;
    for (const { w: C, f: A } of p) {
      const N = le(A.dir), U = k ? [A.leftOff, -A.rightOff].filter((I) => I !== 0) : [0];
      for (const I of U) {
        const O = B(A.a, T(N, I)), E = r ? ze(r, P(a, r), O, A.dir) : B(O, T(A.dir, G(P(a, O), A.dir)));
        if (!E) continue;
        const D = G(P(E, O), A.dir);
        if (D < 0 || D > A.len) continue;
        const H = R(E, a);
        H <= i && (!S || H < S.d) && (S = { d: H, res: { pt: E, kind: "wall", endpoint: { kind: "wall", wallId: C.id, offset: D } } });
      }
    }
    return S ? S.res : null;
  }, v = w(!1);
  if (v) return v;
  const b = w(!0);
  if (b) return b;
  const y = n.zones ?? [];
  let x = null;
  for (const k of y)
    for (const S of k) {
      const C = R(S, a);
      C <= i && h(S) && (!x || C < x.d) && (x = { pt: S, d: C });
    }
  if (x) return ni(x.pt, "zoneVertex");
  let M = null;
  for (const k of y)
    for (let S = 0; S < k.length; S++) {
      const C = k[S], A = k[(S + 1) % k.length], N = R(C, A);
      if (N < 1e-9) continue;
      const U = T(P(A, C), 1 / N), I = r ? ze(r, P(a, r), C, U) : B(C, T(U, G(P(a, C), U)));
      if (!I) continue;
      const O = G(P(I, C), U);
      if (O < 0 || O > N) continue;
      const E = R(I, a);
      E <= i && (!M || E < M.d) && (M = { pt: I, d: E });
    }
  if (M) return ni(M.pt, "zoneEdge");
  if (o && o > 0) {
    const k = (C) => Math.round(C / o) * o, S = r ? c ? { x: k(a.x), y: r.y } : { x: r.x, y: k(a.y) } : { x: k(a.x), y: k(a.y) };
    return ni(S, "grid");
  }
  return ni(a, "none");
}
const So = 3, ua = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
};
function dd(t) {
  let e = null;
  const n = (o, s, r) => {
    const l = o.devices.find((h) => h.id === s), a = l ? de(o, l) : null, c = l ? ks(o, l, t.scale()) : null;
    return !a || !c ? 0 : pu(Ze(P(r, a.pt)) - Ze(P(c.to, a.pt)));
  };
  function i(o) {
    if (!e || !e.moved && R(o.pt, e.downPt) <= So / t.scale()) return;
    e.moved = !0;
    const s = e.original.devices.find((f) => f.id === e.id), r = s ? de(e.original, s) : null;
    if (!s || !r) return;
    const l = R(o.pt, r.pt), a = (Ze(P(o.pt, r.pt)) - e.offset) * Math.PI / 180, c = l === 0 ? o.pt : { x: r.pt.x + Math.cos(a) * l, y: r.pt.y - Math.sin(a) * l }, h = hp(e.original, s, c, o.shift);
    e.work = JSON.stringify(h) === JSON.stringify(s.placement) ? e.original : Oi(e.original, s.id, h);
  }
  return {
    start(o, s) {
      if (e = null, !o) return !1;
      const r = t.level(), l = r.devices.find((c) => c.id === o), a = l ? ks(r, l, t.scale()) : null;
      return !l || !a || R(s.pt, a.to) > t.tolMm() ? !1 : (e = { id: o, original: r, work: r, downPt: s.pt, offset: n(r, o, s.pt), moved: !1 }, !0);
    },
    move: i,
    end(o) {
      if (!e) return !1;
      i(o);
      const s = e;
      return e = null, s.moved && s.work !== s.original && ua(s.work, s.id) !== ua(s.original, s.id) && t.commit(s.work), !0;
    },
    cancel() {
      const o = e !== null;
      return e = null, o;
    },
    active: () => e !== null,
    working: () => e ? e.work : null
  };
}
function da(t, e, n) {
  const i = ae(t, t.walls.find((o) => o.id === e));
  return Xe(i, n).side > 0 ? "left" : "right";
}
function hd(t, e) {
  const n = t.grid();
  return n && n > 0 ? { x: Math.round(e.x / n) * n, y: Math.round(e.y / n) * n } : { x: Math.round(e.x), y: Math.round(e.y) };
}
function Ir(t, e = "free") {
  return t === "equipment" ? [e] : Js[t];
}
function fd(t, e, n, i, o = 0, s = Ir(n)) {
  if (s.includes("wall")) {
    const r = kt(e, i, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }), l = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && l.kind === "wall")
      return { mode: "wall", wallId: l.wallId, side: da(e, l.wallId, i), offset: l.offset };
    if (r.kind === "node" && l.kind === "node") {
      let a = null;
      for (const c of e.walls) {
        if (c.a !== l.nodeId && c.b !== l.nodeId) continue;
        const h = ae(e, c), f = Xe(h, i).side, d = Math.abs(Math.abs(f) - (f > 0 ? h.leftOff : h.rightOff));
        (!a || d < a.d) && (a = { id: c.id, offset: c.a === l.nodeId ? 0 : h.len, d });
      }
      if (a) return { mode: "wall", wallId: a.id, side: da(e, a.id, i), offset: a.offset };
    }
  }
  return s.includes("free") ? { mode: "free", ...hd(t, i), rotation: o } : null;
}
function p1(t, e, n) {
  const i = de(t, e);
  if (!i) return null;
  if (!n) {
    const s = or(Math.round(Ze(i.dir)));
    return { mode: "free", x: Math.round(i.pt.x), y: Math.round(i.pt.y), rotation: s };
  }
  let o = null;
  for (const s of t.walls) {
    let r;
    try {
      r = ae(t, s);
    } catch {
      continue;
    }
    if (r.len <= 1e-9) continue;
    const l = Xe(r, i.pt), a = l.side > 0 ? "left" : "right", c = Math.min(r.len, Math.max(0, Math.round(l.t))), h = Dn(t, s.id, a, c), f = h ? R(h, i.pt) : 1 / 0;
    (!o || f < o.d) && (o = { placement: { mode: "wall", wallId: s.id, side: a, offset: c }, d: f });
  }
  return o && o.d < 1 / 0 ? sr(t, e.props, o.placement, 0) : null;
}
function m1(t, e, n) {
  return lu(t.deviceDefaults(e), "free", n.mode);
}
function g1(t, e) {
  let n = null, i;
  const o = dd(t);
  function s() {
    if (!n) return null;
    const r = t.level(), l = Ir(e, t.wallMount() ? "wall" : "free"), a = fd(t, r, e, n, 0, l);
    if (!a)
      return { placement: { mode: "free", ...hd(t, n), rotation: 0 }, props: t.deviceDefaults(e), invalid: !0 };
    const c = m1(t, e, a), h = sr(r, c, a, t.tolMm()), f = El(r, c, h, "").deviceId !== null;
    return { placement: h, props: c, invalid: !f };
  }
  return {
    id: e,
    down(r) {
      if (n = r.pt, o.start(i, r)) return;
      const l = s();
      if (!l || l.invalid) return;
      const a = t.level(), c = Ks(u(`device.${e}`), a.devices.filter((f) => f.props.kind === e).map((f) => f.name)), h = El(a, l.props, l.placement, c);
      h.deviceId !== null && (t.commit(h.level), i = h.deviceId, t.select({ kind: "device", id: h.deviceId }));
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
function Bn(t, { min: e = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const o = t.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(o)) return null;
  const s = Number(o);
  return Number.isSafeInteger(s) && s >= e && s <= n ? s : null;
}
function z(t, e) {
  return g`<label class="row"><span>${t}</span>${e}</label>`;
}
function ce(t, e, n, i) {
  return g`<select class="val" data-field=${i ?? $} .value=${Q(t)} @change=${(o) => {
    const s = o.target;
    n(s.value) === !1 && (s.value = t);
  }}>
    ${e.map((o) => g`<option value=${o.v} ?selected=${o.v === t}>${o.label}</option>`)}
  </select>`;
}
function Fe(t) {
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
    const s = Bn(o.value, t.rule);
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
function b1(t) {
  return t.devices.filter((e) => e.placement.mode === "none").sort((e, n) => e.name.localeCompare(n.name) || e.id.localeCompare(n.id));
}
function pd(t, e = "equipment") {
  const n = t.devices.filter((i) => i.props.kind === e).map((i) => i.name);
  return iu(t, Ks(u(`device.${e}`), n), e);
}
function Er(t) {
  if (Yt(t)) return u("props.inverter");
  const e = Gf(t);
  return e ? u(`deviceRole.${e}`) : "";
}
function Lo(t) {
  const e = u(`device.${t.props.kind}`), n = Er(t);
  return n ? `${e} · ${n}` : e;
}
function w1(t) {
  const e = b1(t.level);
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
        <span class="name">${n.name}</span><span class="kind">${Er(n) || u(`device.${n.props.kind}`)}</span>
      </button>`)}
    </div>`}
  </section>`;
}
const md = Object.keys(Js), v1 = (t) => md.includes(t);
function $1() {
  return Object.fromEntries(md.map((t) => [t, ct(t, "free")]));
}
const gd = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -Ut, max: Ut, signed: !0 }, bad: "props.badAim" }
}, gn = (t, e, n, i, o) => Fe({ ...gd[i], value: n, field: e, setNotice: t.onNotice, apply: o, skipSame: !0 }), y1 = ["round", "linear", "spot"], x1 = ["rect", "circle"], zi = (t, e) => t.map((n) => ({ v: n, label: u(`${e}.${n}`) }));
function bd(t, e, n, i) {
  const o = (r, l, a) => z(`${u(l)}, ${u("unit.mm")}`, gn(t, n + r, a, "mm", (c) => i({ [r]: c }))), s = (r, l, a) => z(`${u(l)}, ${u("unit.deg")}`, gn(t, n + r, a, "angle", (c) => i({ [r]: c })));
  switch (e.kind) {
    case "ceiling_light":
      return g`
        ${z(u("props.shape"), ce(e.shape, zi([...y1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "linear" ? g`${o("length", "props.length", e.length)}${o("width", "props.width", e.width)}` : e.shape === "round" ? o("diameter", "props.diameter", e.diameter) : $}
        ${z(`${u("props.poolRadius")}, ${u("unit.mm")}`, Fe({
        ...gd.mm,
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
      return z(`${u("props.diameter")}, ${u("unit.mm")}`, g`<select class="val" data-field=${`${n}diameter`}
        .value=${Q(String(e.diameter))} @change=${(r) => {
        const l = r.target, a = Number(l.value);
        a !== e.diameter && !i({ diameter: a }) && (l.value = String(e.diameter));
      }}>
        ${Qh.map((r) => g`<option value=${String(r)} ?selected=${r === e.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return g`
        ${z(u("props.shape"), ce(e.shape, zi([...x1], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${e.shape === "rect" ? g`${o("width", "props.width", e.width)}${o("depth", "props.depth", e.depth)}` : o("diameter", "props.diameter", e.diameter)}
        ${z(u("props.icon"), M1(t, e.icon, `${n}icon`, i))}
        ${z(u("props.label"), g`<input class="val wide" type="text" data-field=${`${n}label`} .value=${Q(e.label)}
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
const k1 = /^mdi:[a-z0-9-]+$/;
function M1(t, e, n, i) {
  const o = (s, r) => {
    var l, a;
    if (!k1.test(s)) {
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
function Mt(t, e, n, i) {
  return z(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)} @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`);
}
function _1(t, e) {
  return e.props.kind !== "equipment" || e.placement.mode === "none" ? $ : Mt("wallMount", u("props.wallMount"), e.placement.mode === "wall", (n) => {
    var i;
    return ((i = t.onWallMount) == null ? void 0 : i.call(t, n)) ?? !1;
  });
}
function A1(t, e) {
  var i;
  const n = e.props;
  return n.kind !== "equipment" ? $ : g`
    ${Mt("inverter", u("props.inverter"), !!n.inverter, (o) => {
    var s;
    return ((s = t.onInverter) == null ? void 0 : s.call(t, o)) ?? !1;
  })}
    ${(i = e.bindings) != null && i.control ? Mt("controllable", u("props.controllable"), !!n.controllable, (o) => {
    var s;
    return ((s = t.onControllable) == null ? void 0 : s.call(t, o)) ?? !1;
  }) : g`<p class="muted" data-note="bind-switch">${u("props.bindSwitchHint")}</p>`}`;
}
function S1(t, e) {
  const n = e.placement;
  if (n.mode === "none") return $;
  if (n.mode === "free")
    return z(
      `${u("props.rotation")}, ${u("unit.deg")}`,
      gn(t, "rotation", n.rotation, "rotation", (o) => t.onPlacement({ ...n, rotation: o }))
    );
  const i = Pc.has(e.props.kind);
  return g`
    ${z(u("props.side"), ce(n.side, zi(["left", "right"], "side"), (o) => t.onPlacement({ ...n, side: o }), "side"))}
    ${z(`${u("props.offset")}, ${u("unit.mm")}`, gn(
    t,
    "offset",
    n.offset,
    "offset",
    (o) => t.onPlacement({ ...n, offset: o })
  ))}
    ${i ? z(
    `${u("props.aim")}, ${u("unit.deg")}`,
    gn(t, "aim", n.aim ?? 0, "aim", (o) => t.onPlacement(vu(n, o)))
  ) : $}`;
}
function Or(t, e) {
  return z(u("props.name"), g`<input class="val wide" type="text" data-field="name" .value=${Q(t.name)}
    @change=${(n) => {
    const i = n.target, o = i.value.trim();
    if (!o) {
      i.value = t.name;
      return;
    }
    o !== t.name && e(o);
  }} />`);
}
function L1(t, e) {
  const n = e.props.kind;
  return Dc(n) ? n === "smart_button" && e.placement.mode === "free" ? g`<p class="muted" data-note="type-free">${u("props.typeFreeHint")}</p>` : z(u("props.type"), ce(
    n,
    zi(["wall_switch", "smart_button"], "device"),
    (i) => {
      var o;
      return (o = t.onKind) == null ? void 0 : o.call(t, i);
    },
    "kind"
  )) : $;
}
function C1(t, e) {
  const n = t.level ? wp(t.level, e) : [];
  return g`<fieldset data-field="zone-membership"><legend>${u("props.zoneList")}</legend>
    ${n.length === 0 ? g`<p class="muted">${u("props.noZones")}</p>` : n.map(({ zone: i, participates: o }) => g`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${o}
        @change=${(s) => {
    var l;
    const r = s.target;
    (l = t.onZone) != null && l.call(t, i.id, r.checked) || (r.checked = o);
  }} /></label>`)}
  </fieldset>`;
}
function I1(t, e) {
  const n = e.placement.mode !== "none";
  return g`
    <h4>${Lo(e)}</h4>
    ${Or(e, (i) => t.onDevice({}, i))}
    ${L1(t, e)}
    ${n ? bd(t, e.props, "", (i) => t.onDevice(i)) : $}
    ${_1(t, e)}
    ${S1(t, e)}
    ${A1(t, e)}
    ${n ? C1(t, e) : $}
    ${e.invalid ? g`<p class="warn">${u("props.invalidDevice")}</p>` : $}
    <button class="btn danger" data-action="delete-device" @click=${() => t.onDelete()}>${u("action.delete")}</button>`;
}
function E1(t) {
  return t.device ? I1(t, t.device) : t.nextKind && t.nextProps ? g`
      <h4>${u("props.nextDevice")}: ${u(`device.${t.nextKind}`)}</h4>
      ${bd(t, t.nextProps, "next-", (e) => (t.onNext(e), !0))}
      ${t.nextKind === "equipment" ? Mt(
    "next-wallMount",
    u("props.wallMount"),
    !!t.nextWallMount,
    (e) => {
      var n;
      return (n = t.onNextWallMount) == null || n.call(t, e), !0;
    }
  ) : $}` : g`<p class="muted">${u("props.none")}</p>`;
}
function O1(t) {
  const { level: e, selection: n } = t, i = (n == null ? void 0 : n.kind) === "device" ? e.devices.find((a) => a.id === n.id) ?? null : null, o = v1(t.toolId) ? t.toolId : null, s = (a) => a === e ? (t.setNotice(u("props.noFit")), !1) : (t.setNotice(null), t.commit(a), !0), r = (a) => a.level === e ? !1 : (t.setNotice(null), t.commit(a.level, a.power), !0), l = (a, c) => {
    const h = p1(e, a, c);
    return s(h ? Oi(e, a.id, h) : e);
  };
  return g`<div class="props">
    ${E1({
    device: i,
    level: e,
    nextKind: o,
    nextProps: o ? t.nextProps[o] : null,
    onDevice: (a, c) => !!i && s(ft(e, i.id, a, c)),
    onKind: (a) => !!i && s(Kf(e, i.id, a)),
    onPlacement: (a) => !!i && s(Oi(e, i.id, a)),
    onZone: (a, c) => !!i && s(Cu(e, i.id, a, c)),
    onWallMount: (a) => !!i && l(i, a),
    onInverter: (a) => !!i && r(Bu(e, t.power, i.id, a)),
    onControllable: (a) => !!i && s(po(e, i.id, a)),
    nextWallMount: t.nextWallMount,
    onNextWallMount: (a) => t.setNextWallMount(a),
    onNext: (a) => {
      o && t.setNextProps({ ...t.nextProps, [o]: { ...t.nextProps[o], ...a, kind: o } });
    },
    onDelete: () => {
      i && r(Ru(e, t.power, i.id));
    },
    onNotice: (a) => t.setNotice(a)
  })}
    ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    ${i ? $ : w1({
    level: e,
    onPick: (a) => t.pickDevice(a),
    onNew: (a) => {
      const c = pd(e, a);
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
const Dr = _o(class extends Ao {
  constructor(t) {
    if (super(t), t.type !== je.PROPERTY && t.type !== je.ATTRIBUTE && t.type !== je.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!ud(t)) throw Error("`live` bindings can only contain a single expression");
  }
  render(t) {
    return t;
  }
  update(t, [e]) {
    if (e === ye || e === $) return e;
    const n = t.element, i = t.name;
    if (t.type === je.PROPERTY) {
      if (e === n[i]) return ye;
    } else if (t.type === je.BOOLEAN_ATTRIBUTE) {
      if (!!e === n.hasAttribute(i)) return ye;
    } else if (t.type === je.ATTRIBUTE && n.getAttribute(i) === e + "") return ye;
    return Lr(t), e;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bn = (t, e) => {
  var i;
  const n = t._$AN;
  if (n === void 0) return !1;
  for (const o of n) (i = o._$AO) == null || i.call(o, e, !1), bn(o, e);
  return !0;
}, Ri = (t) => {
  let e, n;
  do {
    if ((e = t._$AM) === void 0) break;
    n = e._$AN, n.delete(t), t = e;
  } while ((n == null ? void 0 : n.size) === 0);
}, wd = (t) => {
  for (let e; e = t._$AM; t = e) {
    let n = e._$AN;
    if (n === void 0) e._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(t)) break;
    n.add(t), P1(e);
  }
};
function D1(t) {
  this._$AN !== void 0 ? (Ri(this), this._$AM = t, wd(this)) : this._$AM = t;
}
function N1(t, e = !1, n = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0) if (e) if (Array.isArray(i)) for (let s = n; s < i.length; s++) bn(i[s], !1), Ri(i[s]);
  else i != null && (bn(i, !1), Ri(i));
  else bn(this, t);
}
const P1 = (t) => {
  t.type == je.CHILD && (t._$AP ?? (t._$AP = N1), t._$AQ ?? (t._$AQ = D1));
};
class T1 extends Ao {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(e, n, i) {
    super._$AT(e, n, i), wd(this), this.isConnected = e._$AU;
  }
  _$AO(e, n = !0) {
    var i, o;
    e !== this.isConnected && (this.isConnected = e, e ? (i = this.reconnected) == null || i.call(this) : (o = this.disconnected) == null || o.call(this)), n && (bn(this, e), Ri(this));
  }
  setValue(e) {
    if (ud(this._$Ct)) this._$Ct._$AI(e, this);
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
const V1 = () => new H1();
class H1 {
}
const Ko = /* @__PURE__ */ new WeakMap(), z1 = _o(class extends T1 {
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
      let n = Ko.get(e);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Ko.set(e, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, t), t !== void 0 && this.G.call(this.ht, t);
    } else this.G.value = t;
  }
  get lt() {
    var t, e;
    return typeof this.G == "function" ? (t = Ko.get(this.ht ?? globalThis)) == null ? void 0 : t.get(this.G) : (e = this.G) == null ? void 0 : e.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), R1 = () => [{ v: "0", label: u("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => ({ v: String(t), label: String(t) }))], B1 = { min: 1, max: 10 };
function vd(t, e) {
  return e === t.level ? !1 : (t.setFieldNotice(null), t.commit(e), !0);
}
const Is = (t, e, n) => vd(t, ft(t.level, e.id, n));
function Xo(t, e, n, i) {
  return g`<div class="cflag">${z(e, g`<input type="checkbox" data-field=${t} .checked=${Q(n)}
    @change=${(o) => {
    const s = o.target;
    i(s.checked) || (s.checked = n);
  }} />`)}</div>`;
}
const Yo = "__other", sn = /* @__PURE__ */ new Set();
function F1(t, e, n, i, o) {
  const s = `${e.id}:${n}`, r = pl.includes(i), l = !r || sn.has(s), a = V1(), c = [...pl.map((f) => ({ v: f, label: f })), { v: Yo, label: u("binding.eventOther") }];
  return g`<span class="evfield">${ce(l ? Yo : i, c, (f) => {
    if (f === Yo) {
      sn.add(s), a.value && (a.value.hidden = !1, a.value.focus());
      return;
    }
    sn.delete(s), a.value && (a.value.hidden = !0), f !== i ? o(f) : t.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${z1(a)} data-field=${`${n}-event-custom`} ?hidden=${Dr(!l)}
      .value=${Q(r ? "" : i)} @change=${(f) => {
    var m;
    const d = f.target, p = d.value.trim();
    if (!p) {
      d.value = r ? "" : i, t.setFieldNotice(u("props.badEvent"));
      return;
    }
    if (d.value = p, t.setFieldNotice(null), p !== i) {
      o(p) && sn.delete(s);
      return;
    }
    if (sn.delete(s), r) {
      d.hidden = !0;
      const w = (m = d.parentElement) == null ? void 0 : m.querySelector("select");
      w && (w.value = i);
    }
  }} /></span>`;
}
function U1(t, e, n) {
  const i = e.props;
  if (i.kind !== "smart_button") return g`${$}`;
  const o = i[n], s = (r) => Is(t, e, { [n]: { ...o, ...r } });
  return g`<div class="trigger" data-trigger=${n}>
    ${z(u("binding.slot"), ce(
    String(o.slot),
    R1(),
    (r) => r === String(o.slot) ? !1 : s({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${z(u("binding.event"), F1(t, e, n, o.event, (r) => s({ event: r })))}
  </div>`;
}
function W1(t, e, n) {
  const i = e.props;
  if ((i.kind === "wall_switch" || i.kind === "valve") && n === "state")
    return g`
      ${Xo(
      "autoByDoubleToggle",
      u("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (l) => Is(t, e, { autoByDoubleToggle: l })
    )}
      ${i.autoByDoubleToggle ? g`<div class="cflag">${z(u("binding.window"), Fe({
      value: i.windowSec,
      rule: B1,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (l) => t.setFieldNotice(l),
      apply: (l) => Is(t, e, { windowSec: l })
    }))}</div>` : $}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return g`${$}`;
  const o = (l, a) => (c) => {
    var f, d;
    const h = ft(t.level, e.id, { [l]: c });
    return vd(t, c && !((f = e.bindings) != null && f[a]) ? so(h, e.id, a, ((d = e.bindings) == null ? void 0 : d.on) ?? null) : h);
  }, s = o("separateOff", "off"), r = Xo("autoEnabled", u("binding.autoEnabled"), i.autoEnabled, o("autoEnabled", "auto"));
  return n === "off" ? r : g`${Xo("separateOff", u("binding.separateOff"), i.separateOff, s)}${i.separateOff ? $ : r}`;
}
function j1(t) {
  return t.props.kind !== "smart_button" || !Yh(t).length ? g`${$}` : g`<div class="cfields"><p class="warn" data-note="duplicate">${u("binding.duplicate")}</p></div>`;
}
function q1(t) {
  const e = t.trim().replace("−", "-").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(e) ? Number(e) : null;
}
function Z1(t, e) {
  const n = e.props;
  if (n.kind !== "illuminance_sensor") return $;
  const i = Zt, o = (a, c) => {
    if (c === n[a] || n[a] === void 0 && c === i[a]) {
      t.setFieldNotice(null);
      return;
    }
    t.setFieldNotice(null), t.commit(ft(t.level, e.id, { [a]: c }));
  }, s = (a, c) => {
    const h = String(n[a] ?? i[a]);
    return z(c, g`<input class="val" type="text" inputmode="decimal" data-field=${a} .value=${Q(h)}
      @change=${(f) => {
      const d = f.target;
      if (d.value.trim() === "") {
        o(a, void 0);
        return;
      }
      const p = q1(d.value);
      if (p === null) {
        d.value = h, t.setFieldNotice(u("props.badDecimal"));
        return;
      }
      o(a, p);
    }} />`);
  }, r = z(u("props.debounce"), Fe({
    value: n.debounce ?? i.debounce,
    rule: { min: 0, max: od },
    bad: "props.badDebounce",
    field: "debounce",
    setNotice: (a) => t.setFieldNotice(a),
    apply: (a) => o("debounce", a),
    onBlank: () => o("debounce", void 0)
  })), l = (a, c) => g`<p class="warn" data-note=${a}>${c}</p>`;
  return g`<div class="cfields" data-section="daylight">
    ${s("nightBelow", u("props.nightBelow"))}
    ${s("dayAbove", u("props.dayAbove"))}
    ${sd(n.nightBelow, n.dayAbove) ? $ : l("lux-pair", u("props.badLuxPair").replace("{night}", String(i.nightBelow)).replace("{day}", String(i.dayAbove)))}
    ${s("sunNight", u("props.sunNight"))}
    ${s("sunDay", u("props.sunDay"))}
    ${rd(n.sunNight, n.sunDay) ? $ : l("sun-pair", u("props.badSunPair").replace("{night}", String(i.sunNight)).replace("{day}", String(i.sunDay)))}
    ${r}
    ${ld(n.debounce) ? $ : l("debounce", u("props.badDebounceStored").replace("{s}", String(i.debounce)))}
  </div>`;
}
function G1(t, e) {
  var o, s;
  if (wr(e) !== "light") return !1;
  const n = (o = t.states) == null ? void 0 : o[e], i = (s = n == null ? void 0 : n.attributes) == null ? void 0 : s.supported_color_modes;
  return Array.isArray(i) && i.some((r) => r !== "onoff");
}
function K1(t, e) {
  var s;
  const n = e.props;
  if (n.kind !== "ceiling_light" && n.kind !== "wall_light") return $;
  const i = (s = e.bindings) == null ? void 0 : s.control;
  if (!i || !G1(t, i)) return $;
  const o = (r) => {
    t.setFieldNotice(null), r !== n.brightness && t.commit(ft(t.level, e.id, { brightness: r }));
  };
  return g`<div class="cfields" data-section="brightness">
    ${z(u("device.brightness"), Fe({
    value: n.brightness ?? null,
    rule: { min: 1, max: 100 },
    bad: "props.badBrightness",
    field: "brightness",
    setNotice: (r) => t.setFieldNotice(r),
    apply: (r) => o(r),
    onBlank: () => o(void 0)
  }))}
    <p class="muted" data-note="brightness-hint">${u("device.brightnessHint")}</p>
  </div>`;
}
function Bi(t, e) {
  return e === "control" && t.props.kind === "equipment" ? u("role.control.equipment") : e === "on" && t.props.kind === "smart_button" && !t.props.separateOff ? u("binding.onOff") : u(`role.${e}`);
}
const Qo = (t) => String(t).padStart(2, "0");
function X1(t) {
  const e = new Date(t);
  return Number.isNaN(e.getTime()) ? t : `${Qo(e.getHours())}:${Qo(e.getMinutes())}:${Qo(e.getSeconds())}`;
}
const Y1 = (t, e) => t.action !== "set" ? t.action : `set ${(e === "valve" ? t.value === "on" ? "open" : t.value === "off" ? "closed" : t.value : t.value) ?? ""}`.trim();
function Q1(t) {
  return t.status === "error" ? t.reason === "unavailable" ? u("output.errorUnavailable").replace("{entities}", (t.entities ?? []).join(", ")) : u("output.errorNotConfigured") : t.last ? u("output.last").replace("{event}", Y1(t.last, t.kind)).replace("{time}", X1(t.last.at)) : u("output.none");
}
function J1(t, e) {
  if (!lo(e.props.kind)) return $;
  const n = t.feed.stateOf(e), i = n ? Q1(n) : t.feed.error ?? (t.feed.ready ? u("output.notSaved") : null);
  return i === null ? $ : g`<p class="note" data-field="output">${i}</p>`;
}
function eb(t, e) {
  var i;
  const n = (i = e.bindings) != null && i.control ? vr(t.states, e.bindings.control) : null;
  return g`<p class="note" data-field="virtual-state">${n === null ? u("output.notSaved") : u("virtual.state").replace("{s}", n)}</p>
    <p class="muted" data-note="virtual-hint">${u("virtual.hint")}</p>`;
}
function tb(t, e) {
  const n = e.props.kind === "phone" ? e.props.notify ?? "" : "", i = t.notifyServices ?? [], o = n !== "" && !i.includes(n);
  return g`<div class="role" data-role="notify">
    <div class="role-head"><span class="role-label" data-field="notify-label">${u("phone.notify")}</span></div>
    <select class="val wide" data-field="notify" @change=${(s) => {
    const r = s.target.value;
    t.commit(ft(t.level, e.id, { notify: r === "" ? void 0 : r }));
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
function nb(t, e, n, i) {
  const o = Pu(t.meta, i, t.states), s = Xh(t.level, e, n);
  return g`
    ${o === "missing" ? g`<p class="warn" data-note="missing">${u("binding.missing")}</p>` : $}
    ${o === "unavailable" ? g`<p class="note" data-note="unavailable">${u("binding.unavailable")}</p>` : $}
    ${s.length ? g`<p class="note" data-note="also">${u("binding.alsoBound").replace("{names}", s.map((r) => r.name).join(", "))}</p>` : $}`;
}
function ib(t, e, n) {
  var l;
  const { role: i } = n, o = ((l = e.bindings) == null ? void 0 : l[i]) ?? null, s = !!t.showAll[i], r = Bi(e, i);
  return g`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${s}
        @change=${() => t.onShowAll(i)} />${u("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${t.meta} .states=${t.states} .items=${Ar(t.meta, n, s)} .value=${o}
      .label=${r} @value-changed=${(a) => {
    a.stopPropagation();
    const c = so(t.level, e.id, i, a.detail.value);
    c !== t.level && t.commit(c);
  }}></ps-entity-combo>
    ${e.props.kind === "smart_button" && Xs(i) ? U1(t, e, i) : $}
    ${o ? nb(t, e, i, o) : $}
  </div>`;
}
function ob(t) {
  const e = t.device, n = Ys(t.level.devices.map(t.status));
  return g`<div class="props bprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.fieldNotice ? g`<p class="warn" data-notice="field" role="alert">${t.fieldNotice}</p>` : $}
    ${t.registryError ? g`<div class="reg-error" data-notice="registry"><p class="warn">${t.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${t.registryLoading}
        @click=${() => t.onRetry()}>${u(t.registryLoading ? "load.loading" : "action.retry")}</button></div>` : $}
    ${e ? g`
      <h4>${Lo(e)}</h4>
      ${Or(e, (i) => t.commit(ft(t.level, e.id, {}, i)))}
      ${J1(t, e)}
      ${e.props.kind === "virtual_switch" ? eb(t, e) : e.props.kind === "phone" ? tb(t, e) : Le(e).map((i) => g`${ib(t, e, i)}${W1(t, e, i.role)}`)}
      ${e.props.kind === "speaker" ? g`<p class="muted" data-note="speaker-hint">${u("speaker.hint")}</p>` : $}
      ${j1(e)}
      ${K1(t, e)}
      ${Z1(t, e)}` : g`<p class="muted">${u("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${u("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => t.onNextUnbound()}>${u("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${t.registryLoading}
      @click=${() => t.onRetry()}>${u("binding.reload")}</button>
  </div>`;
}
const sb = 500, rb = 1e3;
function lb(t, e, n) {
  var s;
  const i = [], o = (r, l, a) => {
    r && i.push({ entity: r, label: l, value: a });
  };
  switch (t.kind) {
    case "grid":
      o(t.power, u("power.field.power"), _e(n == null ? void 0 : n.power)), o(t.voltage, u("power.field.voltage"), Bt(n == null ? void 0 : n.voltage, "V"));
      break;
    case "battery":
      o(t.power, u("power.field.batteryPower"), _e(n == null ? void 0 : n.power)), o(t.soc, u("power.field.soc"), Bt(n == null ? void 0 : n.soc, "%"));
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
        voltage: Bt(n == null ? void 0 : n.voltage, "V")
      };
      for (const c of ["power", "power_in", "power_out", "voltage"])
        l.has(c) && o((s = r.bindings) == null ? void 0 : s[c], Bi(r, c), a[c] ?? "—");
      break;
    }
  }
  return i;
}
class ab {
  /** `meters(id)`: the block's meters now (empty when the block is gone or reads nothing). */
  constructor(e, n, i) {
    this.host = e, this.meters = i, this.openId = null, this.candidate = null, this.dwell = null, this.tick = null, this.feed = new Jg(e, n);
  }
  /** How many meters block `id` has now (0: no hint for it). */
  meterCount(e) {
    return this.meters(e).length;
  }
  /** The pointer is over block `id` (null: over nothing, or a block without meters): starts, keeps or drops the dwell. */
  move(e) {
    e !== (this.openId ?? this.candidate) && (this.hide(), e !== null && (this.candidate = e, this.dwell = setTimeout(() => {
      this.dwell = null, this.candidate = null, this.show(e);
    }, sb)));
  }
  /** Opens at once (the dev harness); the same checks as after the dwell. */
  show(e) {
    this.openId !== e && (this.hide(), this.meters(e).length !== 0 && (this.openId = e, this.tick = setInterval(() => this.host.requestUpdate(), rb), this.sync(), this.host.requestUpdate()));
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
    return i.length ? zg(i, e) : null;
  }
}
const cb = 3;
function Ee(t) {
  if (typeof t == "number")
    return t === cb ? "Connection lost" : `Connection error ${t}`;
  if (typeof t == "string") return t;
  if (t instanceof Error) return t.message;
  if (typeof t == "object" && t !== null) {
    const e = t;
    if (typeof e.message == "string" && e.message) return e.message;
    if (e.code !== void 0) return String(e.code);
  }
  return typeof t == "object" && t !== null ? "Unknown error" : String(t);
}
class ub {
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
      const s = await Kg(this.hass, e, n, i);
      return this.baseRevision = s, this.dirty = this.dirtyVersion !== o, this.state = "saved", this.onChange(), s;
    } catch (s) {
      return s instanceof cd ? (this.state = "conflict", this.errorMessage = s.message) : (this.state = "error", this.errorMessage = Ee(s)), this.onChange(), null;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ha = (t, e, n) => {
  const i = /* @__PURE__ */ new Map();
  for (let o = e; o <= n; o++) i.set(t[o], o);
  return i;
}, db = _o(class extends Ao {
  constructor(t) {
    if (super(t), t.type !== je.CHILD) throw Error("repeat() can only be used in text expressions");
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
    const o = d1(t), { values: s, keys: r } = this.dt(e, n, i);
    if (!Array.isArray(o)) return this.ut = r, s;
    const l = this.ut ?? (this.ut = []), a = [];
    let c, h, f = 0, d = o.length - 1, p = 0, m = s.length - 1;
    for (; f <= d && p <= m; ) if (o[f] === null) f++;
    else if (o[d] === null) d--;
    else if (l[f] === r[p]) a[p] = mt(o[f], s[p]), f++, p++;
    else if (l[d] === r[m]) a[m] = mt(o[d], s[m]), d--, m--;
    else if (l[f] === r[m]) a[m] = mt(o[f], s[m]), on(t, a[m + 1], o[f]), f++, m--;
    else if (l[d] === r[p]) a[p] = mt(o[d], s[p]), on(t, o[f], o[d]), d--, p++;
    else if (c === void 0 && (c = ha(r, p, m), h = ha(l, f, d)), c.has(l[f])) if (c.has(l[d])) {
      const w = h.get(r[p]), v = w !== void 0 ? o[w] : null;
      if (v === null) {
        const b = on(t, o[f]);
        mt(b, s[p]), a[p] = b;
      } else a[p] = mt(v, s[p]), on(t, o[f], v), o[w] = null;
      p++;
    } else Go(o[d]), d--;
    else Go(o[f]), f++;
    for (; p <= m; ) {
      const w = on(t, a[m + 1]);
      mt(w, s[p]), a[p++] = w;
    }
    for (; f <= d; ) {
      const w = o[f++];
      w !== null && Go(w);
    }
    return this.ut = r, Lr(t, a), ye;
  }
});
function $d(t, e, n) {
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
function hb(t) {
  return Math.abs(t.x) >= Math.abs(t.y) ? t.x >= 0 ? "right" : "left" : t.y >= 0 ? "down" : "up";
}
function fb(t, e, n, i) {
  const o = [t, t + n / 2, t + n], s = [e, e + i / 2, e + i], r = [];
  for (const l of o) for (const a of s) (l !== o[1] || a !== s[1]) && r.push({ x: l, y: a });
  return r;
}
function pb(t, e, n, i, o) {
  const s = fb(e, n, i, o);
  if (!s.every((l) => Re(t, l)) || t.some((l) => l.x > e && l.x < e + i && l.y > n && l.y < n + o)) return null;
  let r = 1 / 0;
  for (const l of s)
    for (let a = 0; a < t.length; a++) r = Math.min(r, be(l, t[a], t[(a + 1) % t.length]));
  return r;
}
function mb(t, e, n, i, o) {
  const s = e.placement.mode === "wall", r = s ? hb(n.normal ?? n.dir) : "right";
  let l = null, a = 1 / 0;
  for (const d of t.zones) {
    const p = se(t, d);
    if (p.length < 3 || !Re(p, n.pt)) continue;
    const m = Math.abs(Oe(p));
    m < a && (a = m, l = p);
  }
  if (!l) return r;
  const c = (d) => {
    const p = $d(d, i, o);
    return pb(l, n.pt.x + p.x, n.pt.y + p.y, i.w, i.h);
  }, h = (d) => {
    let p = null, m = -1;
    for (const w of d) {
      const v = c(w);
      v !== null && v > m && (p = w, m = v);
    }
    return p;
  }, f = ["down-right", "down-left", "up-right", "up-left"];
  if (s) {
    const d = r === "up" || r === "down", p = { up: "down", down: "up", left: "right", right: "left" }[r];
    if (c(r) !== null) return r;
    const m = f.filter((w) => d ? w.startsWith(r) : w.endsWith(r));
    return h(m) ?? h(d ? ["right", "left"] : ["down", "up"]) ?? (c(p) !== null ? p : r);
  }
  return h(["right", "left"]) ?? h(f) ?? h(["down", "up"]) ?? r;
}
const ge = (t) => t.length === 0 ? "" : `M${t.map((e) => `${e.x} ${e.y}`).join("L")}Z`;
function _t(t, e, n) {
  let i = t.get(e);
  return i === void 0 && (i = n(e), t.set(e, i)), i;
}
function yd(t) {
  return t === null ? "—" : `${t.toFixed(1)} ${u("unit.m2")}`;
}
const Gn = 12, K = "non-scaling-stroke", gb = 7, bb = 10, Fi = "#f43f5e", fa = "3 2", pa = 18, wb = 6, ma = 11, vb = 0.6, $b = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", xd = 24, ii = 4, ga = 4, xi = Gn * 0.85, yb = 0.58;
function xb(t, e, n, i) {
  const o = xd;
  if (!e) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const s = n * Math.PI / 180, r = Math.abs(Math.cos(s)), l = Math.abs(Math.sin(s)), [a, c] = t.shape === "circle" ? [t.diameter / Math.SQRT2, t.diameter / Math.SQRT2] : [t.width * r + t.depth * l, t.width * l + t.depth * r], h = a * i - 2 * ga, f = c * i - 2 * ga, d = e.length * yb * xi, p = o + ii + xi, m = o + ii + d, w = Math.max(o, d), v = (M, k) => Math.max(0, M - h) + Math.max(0, k - f), b = v(w, p), y = v(m, o);
  if (b > 0 && y < b) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + o / 2) / i,
      iconY: 0,
      labelX: (M + o + ii) / i,
      labelY: 0,
      labelAnchor: "start"
    };
  }
  const x = -p / 2;
  return {
    mode: "stacked",
    iconX: 0,
    iconY: (x + o / 2) / i,
    labelX: 0,
    labelY: (x + o + ii + xi / 2) / i,
    labelAnchor: "middle"
  };
}
function kb(t, e, n, i = 0, o = 0) {
  const s = xd / e;
  return customElements.get("ha-icon") ? _`<foreignObject class="equipment-icon" x=${i - s / 2} y=${o - s / 2} width=${s} height=${s}
      style="pointer-events:none">
      <ha-icon icon=${t} style=${`--mdc-icon-size:${s}px;color:${n};display:block`}></ha-icon></foreignObject>` : _`<g class="equipment-icon" transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}>
    <path d=${$b} fill=${n}></path></g>`;
}
const Mb = "__preview__", _b = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, Ab = /* @__PURE__ */ new WeakMap();
function kd(t, e) {
  const n = mo(e.props.kind);
  if (!n) return [];
  const i = fu(t, n), o = _t(Ab, i, () => /* @__PURE__ */ new WeakMap());
  let s = o.get(e);
  return s || (s = bu(t, e, () => i), o.set(e, s)), s;
}
function Ui(t, e) {
  return t.props.kind === "ceiling_light" && t.props.shape === "round" ? Math.max(t.props.diameter / 2, e) : e;
}
function Sb(t, e, n, i, o, s = n, r = !1) {
  const l = t.props, a = { stroke: n, fill: i }, c = o ?? $;
  switch (l.kind) {
    case "ceiling_light":
      return l.shape === "linear" ? _`<rect class="icon" x=${-l.length / 2} y=${-l.width / 2} width=${l.length} height=${l.width}
          fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></rect>` : l.shape === "spot" ? _`<circle class="icon" r=${e / 3} fill=${r ? i : n} stroke=${n} stroke-width="1" stroke-dasharray=${c} vector-effect=${K}></circle>` : _`<circle class="icon" r=${Ui(t, e)} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>`;
    case "wall_light":
      return _`<path class="icon" d=${`M0 ${-e}A${e} ${e} 0 0 0 0 ${e}Z`} fill=${a.fill} stroke=${a.stroke}
        stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></path>`;
    case "motion_sensor": {
      const h = (f) => `M${e * f} ${-e * f * 0.8}A${e * f} ${e * f * 0.8} 0 0 1 ${e * f} ${e * f * 0.8}`;
      return _`<circle class="icon" r=${e * 0.6} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="arcs" d=${h(1) + h(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    case "illuminance_sensor": {
      let h = "";
      for (let f = 0; f < 8; f++) {
        const d = f * Math.PI / 4;
        h += `M${Math.cos(d) * e * 1.15} ${Math.sin(d) * e * 1.15}L${Math.cos(d) * e * 1.6} ${Math.sin(d) * e * 1.6}`;
      }
      return _`<circle class="icon" r=${e * 0.7} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="rays" d=${h} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${K}></path>`;
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
      let h = "";
      for (let f = 0; f < 4; f++) {
        const d = f * Math.PI / 2 + Math.PI / 4;
        h += `M0 0L${Math.cos(d) * e * 0.85} ${Math.sin(d) * e * 0.85}`;
      }
      return _`<circle class="icon" r=${e} fill=${a.fill} stroke=${a.stroke} stroke-width="1.5" stroke-dasharray=${c} vector-effect=${K}></circle>
        <path class="blades" d=${h} fill="none" stroke=${s} stroke-width="1.5" vector-effect=${K}></path>`;
    }
    default:
      return _`${$}`;
  }
}
function Lb(t, e, n, i, o, s) {
  const r = t.props;
  if (r.kind !== "equipment") return _`${$}`;
  const l = xb(r, r.label, i, e.scale), a = s ?? $, c = r.shape === "circle" ? _`<circle class="equipment-body" r=${r.diameter / 2} fill=${e.palette.deviceFill} stroke=${n}
        stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></circle>
      ${o ? _`<circle class="equipment-lit" r=${r.diameter / 2} fill=${n} fill-opacity="0.3"></circle>` : $}` : _`<rect class="equipment-body" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${e.palette.deviceFill} stroke=${n} stroke-width="1.5" stroke-dasharray=${a} vector-effect=${K}></rect>
      ${o ? _`<rect class="equipment-lit" x=${-r.width / 2} y=${-r.depth / 2} width=${r.width} height=${r.depth}
        fill=${n} fill-opacity="0.3"></rect>` : $}`;
  return _`
    <g transform=${`rotate(${i})`}>${c}</g>
    ${kb(r.icon, e.scale, n, l.iconX, l.iconY)}
    <text class="equipment-label" x=${l.labelX} y=${l.labelY} text-anchor=${l.labelAnchor} dominant-baseline="middle"
      font-size=${xi / e.scale}
      fill=${n} font-family="system-ui, sans-serif">${r.label}</text>
    <g class="equipment-data"></g>`;
}
function Cb(t, e, n = 0) {
  return t === "bound" ? $ : _`<circle class=${`bind-ring bind-${t}`} r=${Math.max(Gn * 1.7 / e, n + 4 / e)} fill="none" style=${`stroke:${_b[t]}`}
    stroke-width="2" stroke-dasharray=${t === "unbound" ? "4 3" : $} vector-effect=${K}></circle>`;
}
function Ib(t, e, n) {
  if (t.status !== "error") return $;
  const i = e * 0.9, o = -e * 0.9, s = bb / n.scale;
  return _`<g class="badge" data-badge="alert">
    <circle cx=${i} cy=${o} r=${gb / n.scale} fill=${n.palette.background} stroke=${Fi} stroke-width="1.5"
      vector-effect=${K}></circle>
    <path d=${Ku} fill=${Fi} transform=${`translate(${i - s / 2} ${o - s / 2}) scale(${s / 24})`}></path>
  </g>`;
}
function Eb(t, e) {
  return t === "motion" ? e.motionCone : t === "leak" || t === "unmatched" ? Fi : t === "event" ? e.selection : t === "mode" ? e.modeBubble : e.device;
}
function Ob(t, e, n, i, o, s) {
  const r = [...i.shown.map((b) => [b, "bubble-in"]), ...i.leaving.map((b) => [b, "bubble-out"])];
  if (r.length === 0) return $;
  const l = 1 / s.scale, a = r.map(([b]) => (b.text.length * ma * vb + 2 * wb) * l), c = pa * l, h = (pa + 2) * l, f = { w: Math.max(...a), h: c + h * (r.length - 1) }, d = o + 4 * l, p = Math.max(1, i.shown.length), m = mb(t, e, n, { w: Math.max(...a.slice(0, p)), h: c + h * (p - 1) }, d), w = $d(m, f, d), v = ([b, y], x) => `${y}:${b.id ?? (b.key === void 0 ? `#${x}` : "")}:${b.key ?? ""}`;
  return _`${db(r.map((b, y) => [b, y]), ([b, y]) => v(b, y), ([[b, y], x]) => {
    const M = a[x], k = w.x + (f.w - M) / 2, S = w.y + (m.startsWith("up") ? r.length - 1 - x : x) * h, C = Eb(b.tone, s.palette);
    return _`<g class=${`bubble ${y}`} data-tone=${b.tone}>
      <rect x=${k} y=${S} width=${M} height=${c} rx=${c / 2} fill=${s.palette.background} stroke=${C} stroke-width="1.5"
        vector-effect=${K}></rect>
      <text x=${k + M / 2} y=${S + c / 2} text-anchor="middle" dominant-baseline="central" fill=${C} font-weight="700"
        font-size=${ma * l} font-family="system-ui, sans-serif">${b.text}</text>
    </g>`;
  })}`;
}
function Db(t, e) {
  const n = t.props;
  return n.kind === "equipment" ? (n.shape === "circle" ? n.diameter / 2 : Math.hypot(n.width, n.depth) / 2) * Math.SQRT1_2 : Ui(t, Gn / e.scale);
}
function Nb(t, e, n, i) {
  var r;
  const o = (r = i.bubbles) == null ? void 0 : r.call(i, e), s = o ? Ob(t, e, n, o, Db(e, i), i) : $;
  return s === $ ? $ : _`<g class="device-bubbles" data-id=${e.id} transform=${`translate(${n.pt.x} ${n.pt.y})`}
    opacity=${i.dim ? String(i.palette.dimOpacity) : $}>${s}</g>`;
}
function Pb(t, e, n, i) {
  var x, M, k;
  const o = n.palette, s = t.invalid ? o.invalid : o.device, r = Gn / n.scale, l = Math.atan2(e.dir.y, e.dir.x) * 180 / Math.PI, a = !i && ((x = n.selection) == null ? void 0 : x.kind) === "device" && n.selection.id === t.id, c = !i && lo(t.props.kind), h = c ? (M = n.containerState) == null ? void 0 : M.call(n, t) : void 0, f = i || (k = n.live) == null ? void 0 : k.call(n, t), d = (f == null ? void 0 : f.look) === "on" || (f == null ? void 0 : f.look) === "active", p = c && !!n.containerState && !h || (f == null ? void 0 : f.look) === "no-data", m = t.props.kind, w = !d || t.invalid ? s : m === "leak_sensor" ? Fi : m === "motion_sensor" ? o.motionCone : s, v = `device device-${t.props.kind}${a ? " selected" : ""}${t.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (p ? " no-data" : ""), b = i ? "0.5" : n.dim ? String(o.dimOpacity) : $, y = t.props.kind === "equipment" ? t.props.shape === "circle" ? t.props.diameter / 2 : Math.hypot(t.props.width, t.props.depth) / 2 : Math.max(r * 1.6, Ui(t, r));
  return _`
    <g class=${v} data-id=${t.id} opacity=${b} transform=${`translate(${e.pt.x} ${e.pt.y})`}>
      ${a ? _`<circle class="selection-ring" r=${y + 4 / n.scale} fill="none" stroke=${o.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${K}></circle>` : $}
      ${t.props.kind === "equipment" ? Lb(t, n, s, l, d, p ? fa : void 0) : _`<g transform=${`rotate(${l})`}>${Sb(
    t,
    r,
    w,
    d ? w : o.deviceFill,
    p ? fa : void 0,
    d ? o.deviceFill : w,
    (f == null ? void 0 : f.look) === "off"
  )}</g>`}
      ${n.bindingStatus && !i ? Cb(n.bindingStatus(t), n.scale, Ui(t, r)) : $}
      ${h ? Ib(h, r, n) : $}
    </g>`;
}
function ba(t, e, n, i) {
  const o = kd(t, e);
  if (o.length === 0) return $;
  const s = n.palette, r = e.invalid ? s.invalid : mo(e.props.kind) === "motion" ? s.motionCone : s.cone, l = i ? "0.5" : n.dim ? String(s.dimOpacity) : $, a = o.map(ge).join("");
  return e.props.kind === "ceiling_light" ? _`<path class="pool" d=${a} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${l} vector-effect=${K}></path>` : _`<path class="cone" d=${a} fill=${r} fill-opacity="0.18"
    fill-rule="evenodd" stroke=${r} stroke-opacity="0.5" stroke-width="1" opacity=${l}
    vector-effect=${K}></path>`;
}
function Tb(t, e, n, i) {
  const o = kd(t, e);
  let s = 0;
  for (const c of o) for (const h of c) s = Math.max(s, Math.hypot(h.x - n.pt.x, h.y - n.pt.y));
  s === 0 && (s = Gn * 3 / i.scale);
  const r = `lg-${e.id}`, l = i.palette.device, a = i.dim ? String(i.palette.dimOpacity) : $;
  return _`<g class="light-live" opacity=${a}>
    <defs><radialGradient id=${r} gradientUnits="userSpaceOnUse" cx=${n.pt.x} cy=${n.pt.y} r=${s}>
      <stop offset="0" stop-color=${l} stop-opacity="0.35"></stop><stop offset="1" stop-color=${l} stop-opacity="0"></stop>
    </radialGradient></defs>
    ${o.length ? _`<path class="light-fill" d=${o.map(ge).join("")} fill=${`url(#${r})`} fill-rule="evenodd" stroke="none"></path>` : _`<circle class="light-fill" cx=${n.pt.x} cy=${n.pt.y} r=${s} fill=${`url(#${r})`} stroke="none"></circle>`}
  </g>`;
}
function Vb(t, e) {
  var r;
  if (((r = e.selection) == null ? void 0 : r.kind) !== "device" || e.bindingStatus) return $;
  const n = e.selection.id, i = t.devices.find((l) => l.id === n), o = i ? ks(t, i, e.scale) : null;
  if (!o) return $;
  const s = e.palette.selection;
  return _`<g class="aim-handle" opacity=${e.dim ? String(e.palette.dimOpacity) : $}>
    <line x1=${o.from.x} y1=${o.from.y} x2=${o.to.x} y2=${o.to.y} stroke=${s} stroke-width="2" vector-effect=${K}></line>
    <circle class="aim-knob" cx=${o.to.x} cy=${o.to.y} r=${6 / e.scale} fill=${e.palette.deviceFill} stroke=${s}
      stroke-width="2" vector-effect=${K} style="cursor:grab"></circle>
  </g>`;
}
function Hb(t, e) {
  const n = [];
  for (const i of t.devices) {
    const o = de(t, i);
    o && n.push({ d: i, pose: o, preview: !1 });
  }
  if (e.preview) {
    const i = { id: Mb, name: "", placement: e.preview.placement, props: e.preview.props, invalid: e.preview.invalid }, o = de(t, i);
    o && n.push({ d: i, pose: o, preview: !0 });
  }
  return _`
    <g class="cones">${n.map((i) => {
    if (!e.showCones) return $;
    if (e.live && !i.preview) {
      const o = e.live(i.d).look, s = i.d.props.kind;
      return s === "ceiling_light" || s === "wall_light" ? o === "on" ? Tb(t, i.d, i.pose, e) : $ : s === "motion_sensor" && o === "active" ? ba(t, i.d, e, !1) : $;
    }
    return ba(t, i.d, e, i.preview);
  })}</g>
    <g class="devices">${n.map((i) => Pb(i.d, i.pose, e, i.preview))}</g>
    ${Vb(t, e)}
    ${e.bubbles ? _`<g class="bubbles">${n.map((i) => i.preview ? $ : Nb(t, i.d, i.pose, e))}</g>` : $}`;
}
const wa = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Nr = (t) => wa[t % wa.length], At = "non-scaling-stroke", zb = "0.55", Rb = /* @__PURE__ */ new WeakMap();
function Bb(t, e, n, i) {
  const o = i.palette, s = Nr(n), r = i.selectedId === e.id, l = _t(Rb, t, xu).get(e.id), a = 12 / i.scale;
  return _`
    <g class="zone-item" data-id=${e.id}>
      <path class=${`zone${e.invalid ? " broken" : ""}${r ? " selected" : ""}`} data-id=${e.id}
        d=${ge(se(t, e))} fill=${e.invalid ? "url(#zone-hatch)" : s}
        fill-opacity=${e.invalid ? $ : "0.16"} stroke=${s} stroke-width="1.5" vector-effect=${At}
        opacity=${i.selectedId !== null && !r ? zb : $}></path>
      ${l ? _`<text class="zone-label" x=${l.x} y=${l.y} text-anchor="middle" font-size=${a} font-family="system-ui, sans-serif">
        <tspan x=${l.x} dy=${-0.2 * a} font-weight="600" fill=${e.invalid ? o.invalid : o.text}>${e.name}</tspan>
        <tspan x=${l.x} dy=${1.2 * a} font-size=${a * 0.9} fill=${o.zoneLabel}>${yd(lr(t, e))}</tspan>
      </text>` : $}
    </g>`;
}
function Fb(t, e) {
  const n = e.palette, i = t.zones.map((s, r) => ({ z: s, i: r }));
  if (e.mode !== "plan")
    return _`<g class="zones" opacity=${String(n.dimOpacity)}>${i.map(({ z: s, i: r }) => _`
      <path class="zone" data-id=${s.id} d=${ge(se(t, s))} fill="none" stroke=${Nr(r)} stroke-width="1"
        vector-effect=${At}></path>`)}</g>`;
  const o = 8 / e.scale;
  return _`
    <defs>
      <pattern id="zone-hatch" patternUnits="userSpaceOnUse" width=${o} height=${o} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${o} stroke=${n.invalid} stroke-width=${1.5 / e.scale}></line>
      </pattern>
    </defs>
    <g class="zones">${i.map(({ z: s, i: r }) => Bb(t, s, r, e))}</g>`;
}
function Ub(t, e, n) {
  const i = n.palette, o = 14 / n.scale;
  return _`<g class="zone-members">${Qe(t, e).map(({ device: s, participates: r }) => {
    const l = de(t, s);
    return l ? r ? _`<circle class="member-ring in" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${At}></circle>` : _`<circle class="member-ring out" cx=${l.pt.x} cy=${l.pt.y} r=${o} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${At}></circle>` : $;
  })}</g>`;
}
function Wb(t, e, n) {
  if (e.shape.kind !== "polygon") return $;
  const i = n.palette, o = e.shape.vertices;
  return _`${se(t, e).map((s, r) => {
    const l = o[r], a = l.kind === "free" && l.lost === !0, c = n.vertex === r;
    return _`<circle class=${`zone-vertex${a ? " lost" : ""}${c ? " on" : ""}`} data-index=${r} cx=${s.x} cy=${s.y}
      r=${5 / n.scale} fill=${c ? i.selection : i.background} stroke=${a ? i.invalid : i.selection} stroke-width="2"
      vector-effect=${At}></circle>`;
  })}`;
}
function jb(t, e) {
  const n = t.cursor ? [...t.points, t.cursor] : t.points;
  return _`<polyline class=${`zone-draft${t.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${t.invalid ? e.palette.invalid : e.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${At}></polyline>`;
}
function qb(t, e) {
  const n = e.selectedId === null ? void 0 : t.zones.find((i) => i.id === e.selectedId);
  return _`<g class="zone-overlay">
    ${n ? _`<path class="zone-outline" data-id=${n.id} d=${ge(se(t, n))} fill="none"
      stroke=${e.palette.selection} stroke-width="2.5" vector-effect=${At}></path>` : $}
    ${n ? Ub(t, n.id, e) : $}
    ${n ? Wb(t, n, e) : $}
    ${e.draft ? jb(e.draft, e) : $}</g>`;
}
function yt(t) {
  const e = Math.round(t), n = String(Math.abs(e)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return e < 0 ? `-${n}` : n;
}
const Zb = /* @__PURE__ */ new WeakMap(), Gb = /* @__PURE__ */ new WeakMap(), Md = /* @__PURE__ */ new WeakMap();
function Co(t, e, n) {
  const i = le(t.dir), o = B(t.a, T(t.dir, e)), s = B(t.a, T(t.dir, n));
  return [B(o, T(i, t.leftOff)), B(s, T(i, t.leftOff)), P(s, T(i, t.rightOff)), P(o, T(i, t.rightOff))];
}
function Fn(t, e) {
  const n = t.walls.find((i) => i.id === e);
  if (!n) return null;
  try {
    const i = ae(t, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
const ee = "non-scaling-stroke";
function Kb(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t.walls)
    n.set(l.a, (n.get(l.a) ?? 0) + 1), n.set(l.b, (n.get(l.b) ?? 0) + 1);
  const i = 6 / e.scale, o = 5 / e.scale, s = 2 / e.scale, r = [];
  for (const l of t.walls) {
    const a = Fn(t, l.id);
    if (!a) continue;
    const c = le(a.dir);
    for (const [h, f, d] of [[l.a, a.a, a.dir], [l.b, a.b, T(a.dir, -1)]]) {
      const p = t.nodes.find((k) => k.id === h);
      if (!p || p.host || n.get(h) !== 1) continue;
      const m = B(f, T(c, a.leftOff + i)), w = P(f, T(c, a.rightOff + i)), v = T(c, 1), b = T(B(m, w), 0.5), y = B(P(b, T(v, -s)), T(d, o / 2)), x = P(P(b, T(v, s)), T(d, o / 2)), M = [m, y, x, w];
      r.push(_`<path class="wall-break" d=${`M${M.map((k) => `${k.x} ${k.y}`).join("L")}`} fill="none"
        stroke=${e.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${ee}></path>`);
    }
  }
  return r.length ? _`${r}` : $;
}
function Xb(t, e, n) {
  const i = le(t.dir), o = (e.swing ?? "left") === "left", s = o ? i : T(i, -1), r = o ? t.leftOff : t.rightOff, [l, a] = (e.hinge ?? "start") === "start" ? [e.offset, e.offset + e.width] : [e.offset + e.width, e.offset], c = B(B(t.a, T(t.dir, l)), T(s, r)), h = B(B(t.a, T(t.dir, a)), T(s, r)), f = B(c, T(s, e.width)), d = pe(P(f, c), P(h, c)) > 0 ? 1 : 0;
  return _`
    <line x1=${c.x} y1=${c.y} x2=${f.x} y2=${f.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>
    <path d=${`M${f.x} ${f.y}A${e.width} ${e.width} 0 0 ${d} ${h.x} ${h.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${ee}></path>`;
}
function Yb(t, e, n) {
  const i = le(t.dir), o = t.leftOff + t.rightOff, s = [t.leftOff - o / 3, t.leftOff - 2 * o / 3].map((r) => {
    const l = B(B(t.a, T(t.dir, e.offset)), T(i, r)), a = B(B(t.a, T(t.dir, e.offset + e.width)), T(i, r));
    return _`<line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${n} stroke-width="1.5" vector-effect=${ee}></line>`;
  });
  return _`${s}`;
}
function Qb(t, e, n) {
  const i = Fn(t, e.wallId);
  if (!i) return $;
  const o = n.palette, s = e.invalid ? o.invalid : e.kind === "window" ? o.window : o.door, r = Co(i, e.offset, e.offset + e.width), l = e.kind === "door" || e.kind === "gate" || e.kind === "wicket";
  return _`
    <g class=${`opening ${e.kind}${e.invalid ? " invalid" : ""}`}>
      <path d=${ge(r)} fill=${e.invalid ? o.invalid : "none"} fill-opacity="0.45"></path>
      ${l ? Xb(i, e, s) : e.kind === "window" ? Yb(i, e, s) : $}
    </g>`;
}
function va(t, e, n, i, o) {
  const s = o.palette.dim, r = 6 / o.scale, l = B(t, T(n, i)), a = B(e, T(n, i)), c = (f, d) => {
    const p = B(d, T(n, i + r));
    return _`<line x1=${f.x} y1=${f.y} x2=${p.x} y2=${p.y} stroke=${s} stroke-width="0.75" vector-effect=${ee}></line>`;
  }, h = B(T(B(l, a), 0.5), T(n, 9 / o.scale));
  return _`
    <g class="dim">
      ${c(B(t, T(n, 2 / o.scale)), t)}${c(B(e, T(n, 2 / o.scale)), e)}
      <line x1=${l.x} y1=${l.y} x2=${a.x} y2=${a.y} stroke=${s} stroke-width="1" vector-effect=${ee}></line>
      <text x=${h.x} y=${h.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / o.scale}
        fill=${s} font-family="system-ui, sans-serif">${yt(R(t, e))}</text>
    </g>`;
}
function Jb(t, e) {
  const n = e.selection;
  if (!n) return $;
  const i = e.palette, o = 4 / e.scale, s = (r) => _`<circle cx=${r.x} cy=${r.y} r=${o} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = t.nodes.find((l) => l.id === n.id);
    return r ? s(r) : $;
  }
  if (n.kind === "wall") {
    const r = _t(Md, t, ho).get(n.id), l = Fn(t, n.id);
    if (!r || !l) return $;
    const a = le(l.dir);
    return _`
      <path d=${ge(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${s(l.a)}${s(l.b)}
      ${va(l.a, l.b, a, l.leftOff + 18 / e.scale, e)}`;
  }
  if (n.kind === "opening") {
    const r = t.openings.find((d) => d.id === n.id), l = r ? Fn(t, r.wallId) : null;
    if (!r || !l) return $;
    const a = T(le(l.dir), -1), c = l.rightOff + 18 / e.scale, h = (d) => B(l.a, T(l.dir, d)), f = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, l.len]];
    return _`
      <path d=${ge(Co(l, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${ee}></path>
      ${f.filter(([d, p]) => p - d >= 1).map(([d, p]) => va(h(d), h(p), a, c, e))}`;
  }
  if (n.kind === "zone" && e.mode === "automation") {
    const r = t.zones.find((l) => l.id === n.id);
    return r ? _`<path class="zone-pick" d=${ge(se(t, r))} fill="none" stroke=${i.selection} stroke-width="2.5"
      vector-effect=${ee}></path>` : $;
  }
  return $;
}
function ew(t, e, n) {
  return R(t, e) < 1e-6 ? null : Co(Fc(t, e, n.thickness, n.baseline), 0, R(t, e));
}
function tw(t, e) {
  const { preview: n, palette: i } = e, o = 1e7, s = n.orthoFrom, r = n.opening, l = r ? Fn(t, r.wallId) : null;
  return _`
    ${s ? _`<path d=${`M${s.x - o} ${s.y}H${s.x + o}M${s.x} ${s.y - o}V${s.y + o}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${ee}></path>` : $}
    ${(n.walls ?? []).map((a) => {
    const c = ew(a.a, a.b, a.props);
    return _`<g class="preview-wall">
        ${c ? _`<path d=${ge(c)} fill=${i.selection} fill-opacity="0.35"></path>` : $}
        <line x1=${a.a.x} y1=${a.a.y} x2=${a.b.x} y2=${a.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${ee}></line></g>`;
  })}
    ${r && l ? _`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${ge(Co(l, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : $}
    ${iw(t, e)}`;
}
function nw(t, e) {
  const n = e.palette, i = 5 / e.scale;
  return _`<g class="snap-start">
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${ee}></rect>
    <rect x=${t.x - i} y=${t.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${ee}></rect></g>`;
}
function iw(t, e) {
  const n = e.preview, i = e.palette, o = n.anchor ? nw(n.anchor, e) : $, s = n.snap;
  if (!s || s.kind === "none") return o;
  const r = (p) => p / e.scale, { x: l, y: a } = s.pt, c = { stroke: i.background, width: "3" };
  let h, f = $;
  if (s.kind === "node" || s.kind === "corner") {
    const p = r(5);
    h = _`<g class=${s.kind === "node" ? "snap-node" : "snap-corner"}><rect x=${l - p} y=${a - p} width=${2 * p} height=${2 * p} fill=${i.snap}
      stroke=${c.stroke} stroke-width=${c.width} paint-order="stroke" vector-effect=${ee}></rect></g>`;
  } else if (s.kind === "mid") {
    const p = r(11) / Math.sqrt(3), m = `M${l} ${a - p}L${l + p * 0.866} ${a + p / 2}L${l - p * 0.866} ${a + p / 2}Z`;
    h = _`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${c.stroke} stroke-width=${c.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "zoneVertex") {
    const p = r(7), m = `M${l} ${a - p}L${l + p} ${a}L${l} ${a + p}L${l - p} ${a}Z`;
    h = _`<g class="snap-zone-vertex"><path d=${m} fill="none" stroke=${c.stroke} stroke-width="5"
      vector-effect=${ee}></path><path d=${m} fill="none" stroke=${i.snap} stroke-width="2" vector-effect=${ee}></path></g>`;
  } else if (s.kind === "wall" || s.kind === "zoneEdge") {
    const p = r(5), m = `M${l - p} ${a - p}L${l + p} ${a + p}M${l - p} ${a + p}L${l + p} ${a - p}`;
    h = _`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${ee}></path></g>`;
    const w = s.endpoint.kind === "wall" ? _t(Md, t, ho).get(s.endpoint.wallId) : void 0;
    w && (f = _`<path class="snap-wall-hl" d=${ge(w)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${ee}></path>`);
  } else {
    const p = r(4), m = `M${l - p} ${a}H${l + p}M${l} ${a - p}V${a + p}`;
    h = _`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${c.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${ee}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${ee}></path></g>`;
  }
  const d = u(`snapmark.${s.kind}`);
  return _`
    ${f}${o}${h}
    <text class="snap-label" x=${l + r(9)} y=${a - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${ee} font-family="system-ui, sans-serif">${d}</text>`;
}
function ow(t, e) {
  var d;
  const n = e.preview.level ?? t, i = e.palette, o = _t(Zb, n, (p) => qc(p, !0)), s = n.walls.filter((p) => p.type === "railing" || p.type === "fence"), r = s.length ? _t(Gb, n, nr) : null, l = e.selection, a = (e.mode ?? "plan") === "plan", c = a ? $ : String(i.dimOpacity), h = (l == null ? void 0 : l.kind) === "zone" ? l.id : null, f = e.mode ?? "plan";
  return _`
    ${Fb(n, { palette: i, scale: e.scale, selectedId: h, mode: f === "automation" ? "plan" : f })}
    <path class="walls" d=${o.map((p) => p.map(ge).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${c}></path>
    ${r ? _`<g class="railings" opacity=${c}>${s.flatMap((p) => (r.get(p.id) ?? []).map((m) => _`<path d=${ge(m)} fill=${i.railing}></path>`))}</g>` : $}
    <g class="openings" opacity=${c}>${n.openings.map((p) => Qb(n, p, e))}</g>
    <g class="wall-breaks" opacity=${c}>${Kb(n, e)}</g>
    ${a ? qb(n, {
    palette: i,
    scale: e.scale,
    selectedId: h,
    draft: e.preview.zoneDraft,
    vertex: ((d = e.preview.zoneVertex) == null ? void 0 : d.zoneId) === h ? e.preview.zoneVertex.index : null
  }) : $}
    <g class="devices-layer">${a ? $ : Hb(n, {
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
    <g class="selection">${Jb(n, e)}</g>
    <g class="preview">${tw(n, e)}</g>`;
}
const sw = {
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
}, rw = {
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
function lw(t) {
  return t ? sw : rw;
}
const Es = 1, $a = 1e-6;
function aw(t, e, n, i, o) {
  const s = (a) => a > $a && a < o - $a, r = new Set(t.nodes.filter((a) => {
    var c;
    return ((c = a.host) == null ? void 0 : c.wallId) === e.id;
  }).map((a) => a.id)), l = [];
  for (const a of r) {
    const c = uo(t, a).host.offset;
    s(c) && l.push({ t: c, nodeId: a });
  }
  for (const a of t.walls) {
    if (a.id === e.id || [a.a, a.b].some((w) => w === e.a || w === e.b || r.has(w))) continue;
    const c = ne(t, a.a), h = ne(t, a.b), f = R(c, h), d = f === 0 ? null : ze(n, i, c, P(h, c));
    if (!d) continue;
    const p = co(d, c, h) * f;
    if (p < -Es || p > f + Es) continue;
    const m = G(P(d, n), i);
    s(m) && l.push({ t: m, wall: a, pt: d });
  }
  return l;
}
function ya(t, e) {
  let n;
  for (const i of t) {
    const o = Math.abs(i.t - e), s = n ? Math.abs(n.t - e) : 1 / 0;
    (o < s || o === s && "nodeId" in i) && (n = i);
  }
  return n;
}
function xa(t, e) {
  if ("nodeId" in e)
    return delete uo(t, e.nodeId).host, e.nodeId;
  for (const s of [e.wall.a, e.wall.b]) if (R(ne(t, s), e.pt) <= Es) return s;
  const { pt: n, offset: i } = bo(t, e.wall, e.pt), o = { id: oe(), x: n.x, y: n.y, host: { wallId: e.wall.id, offset: i } };
  return t.nodes.push(o), o.id;
}
function cw(t, e, n) {
  const i = t.walls.find((b) => b.id === e);
  if (!i) return t;
  const o = ne(t, i.a), s = ne(t, i.b), r = R(o, s), l = ao(P(s, o)), a = G(P(n, o), l), c = aw(t, i, o, l, r), h = ya(c.filter((b) => b.t < a), a), f = ya(c.filter((b) => b.t > a), a);
  if (!h && !f) return br(t, e);
  const d = Be(t), p = d.walls.find((b) => b.id === e);
  let m = e, w = 0;
  if (f) {
    const b = xa(d, f);
    if (w = G(P(ne(d, b), o), l), h) {
      const y = { ...p, id: oe(), a: b };
      d.walls.push(y), m = y.id;
    } else
      p.a = b;
  }
  h && (p.b = xa(d, h));
  const v = (b, y) => b.wallId !== e || h && y <= h.t ? !0 : !f || y < f.t ? !1 : (b.wallId = m, b.offset -= w, !0);
  d.openings = d.openings.filter((b) => v(b, b.offset + b.width / 2)), d.devices = d.devices.filter((b) => b.placement.mode !== "wall" || v(b.placement, b.placement.offset));
  for (const b of d.nodes) b.host && !v(b.host, b.host.offset) && delete b.host;
  for (const b of d.zones) {
    const y = b.shape;
    y.kind === "polygon" && (y.vertices = y.vertices.map((x) => x.kind !== "wall" || v(x, x.offset) ? x : ur(x)));
  }
  return wo(d), Je(d, t);
}
function uw(t, e, n) {
  return e.some((i, o) => be(t, i, e[(o + 1) % e.length]) <= n);
}
function Pr(t, e, n) {
  const i = ho(t);
  for (const [o, s] of i) if (ut(e, s)) return o;
  for (const [o, s] of i) if (uw(e, s, n)) return o;
  return null;
}
function dw(t, e) {
  for (const n of t.openings) {
    const i = t.walls.find((l) => l.id === n.wallId);
    if (!i) continue;
    const o = ae(t, i);
    if (o.len < 1e-9) continue;
    const { t: s, side: r } = Xe(o, e);
    if (s >= n.offset && s <= n.offset + n.width && r >= -o.rightOff && r <= o.leftOff) return n.id;
  }
  return null;
}
function hw(t, e, n, i) {
  const o = dw(t, e);
  if (o) return { kind: "opening", id: o };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = t.walls.find((l) => l.id === i.id);
    if (r)
      for (const l of [r.a, r.b]) {
        const a = t.nodes.find((c) => c.id === l);
        if (a && R(e, a) <= n) return { kind: "node", id: l };
      }
  }
  const s = Pr(t, e, n);
  return s ? { kind: "wall", id: s } : null;
}
const fw = (t, e) => t.zones.filter((n) => n.id !== e).map((n) => se(t, n)).filter((n) => n.length >= 3);
function _d(t, e, n, i, o) {
  if (n.alt) {
    const l = n.shift && i ? Cr(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: l.x, y: l.y }, snap: null };
  }
  const s = kt(e, n.pt, { tolMm: t.tolMm(), grid: t.grid(), from: i, ortho: n.shift, zones: fw(e, o), corners: Uc(e) }), r = s.endpoint;
  if (s.kind === "node" && r.kind === "node")
    return { vertex: { kind: "node", nodeId: r.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if (s.kind === "corner" && s.corner) {
    const l = s.corner, a = Lt(e, l.wallId), c = a !== null && l.offset >= -Ni && l.offset <= a + Ni, h = c ? Math.max(0, Math.min(a, l.offset)) : l.offset, f = c ? Dn(e, l.wallId, l.side, h) : null;
    if (f) return { vertex: { kind: "wall", wallId: l.wallId, offset: h, side: l.side, x: f.x, y: f.y }, snap: s };
  }
  if ((s.kind === "mid" || s.kind === "wall") && r.kind === "wall") {
    const l = e.walls.find((a) => a.id === r.wallId);
    if (l) {
      const a = Xe(ae(e, l), n.pt).side >= 0 ? "left" : "right", c = Dn(e, l.id, a, r.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: l.id, offset: r.offset, side: a, x: c.x, y: c.y }, snap: { ...s, pt: c } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function Ad(t, e, n) {
  const i = [];
  for (const o of t.zones) {
    const s = se(t, o);
    if (s.length < 3) continue;
    (s.some((l, a) => be(e, l, s[(a + 1) % s.length]) <= n) || Re(s, e)) && i.push({ id: o.id, area: Math.abs(Oe(s)) });
  }
  return i.sort((o, s) => o.area - s.area || (o.id < s.id ? -1 : o.id > s.id ? 1 : 0)), i.map((o) => o.id);
}
function Sd(t, e) {
  const n = t.zones.find((i) => i.id === e);
  return n && n.shape.kind === "polygon" ? { o: se(t, n), v: n.shape.vertices } : null;
}
function pw(t, e, n, i) {
  var r;
  const o = (r = Sd(t, e)) == null ? void 0 : r.o;
  if (!o) return null;
  let s = -1;
  return o.forEach((l, a) => {
    R(n, l) <= i && (s < 0 || R(n, l) < R(n, o[s])) && (s = a);
  }), s < 0 ? null : { index: s, from: o[(s + o.length - 1) % o.length] };
}
function mw(t, e, n, i) {
  const o = Sd(t, e);
  if (!o || o.o.some((v) => R(n, v) <= i)) return null;
  const { o: s, v: r } = o;
  let l = -1, a = 1 / 0;
  if (s.forEach((v, b) => {
    const y = be(n, v, s[(b + 1) % s.length]);
    y <= i && y < a && (l = b, a = y);
  }), l < 0) return null;
  const c = s[l], h = s[(l + 1) % s.length], f = Math.max(0, Math.min(1, co(n, c, h))), d = Hc(c, h, f), p = r[l], m = r[(l + 1) % r.length], w = p.kind === "wall" && m.kind === "wall" && p.wallId === m.wallId && p.side === m.side ? { kind: "wall", wallId: p.wallId, side: p.side, offset: p.offset + f * (m.offset - p.offset), x: d.x, y: d.y } : { kind: "free", x: Math.round(d.x), y: Math.round(d.y) };
  return { index: l + 1, vertex: w };
}
function gw(t, e) {
  let n = null, i = null, o = null, s = null, r = null, l = !1, a = !1, c = { x: 0, y: 0 }, h = null, f = [];
  const d = () => {
    const v = t.selection();
    return (v == null ? void 0 : v.kind) === "zone" ? v.id : null;
  }, p = () => {
    i = null, o = null, s = null, r = null, l = !1, a = !1;
  }, m = () => h && h.zoneId === d() ? h : null;
  function w(v) {
    if (!i || !o || !a && R(v.pt, c) <= So / t.scale()) return;
    a = !0;
    const b = _d(t, o, v, i.from, i.zoneId);
    r = b.snap, l = v.shift, s = Lp(o, i.zoneId, i.index, b.vertex);
  }
  return {
    note() {
      f = [f[f.length - 1] ?? null, t.selection()];
    },
    press(v) {
      p(), h = null, c = v.pt;
      const b = d(), y = t.level(), x = b === null ? null : pw(y, b, v.pt, t.tolMm());
      return b === null || !x ? !1 : (i = { zoneId: b, ...x }, o = s = y, !0);
    },
    pick(v) {
      const b = Ad(t.level(), v, t.tolMm());
      if (b.length === 0) {
        n = null, e(null);
        return;
      }
      const y = d(), x = y !== null && n !== null && R(v, n) <= t.tolMm() ? b.indexOf(y) : -1;
      n = v, e({ kind: "zone", id: b[(x + 1) % b.length] });
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
      const b = s, y = o, x = a, M = i;
      p(), x ? b && y && b !== y && t.commit(b) : h = { zoneId: M.zoneId, index: M.index };
    },
    dblclick(v) {
      const b = f[0];
      if ((b == null ? void 0 : b.kind) !== "zone") return;
      const y = t.level(), x = mw(y, b.id, v.pt, t.tolMm());
      if (!x) return;
      const M = Cp(y, b.id, x.index, x.vertex);
      M !== y && (t.commit(M), e(b), n = null);
    },
    key(v) {
      if (v === "Escape" && i)
        return p(), !0;
      const b = m();
      if (v === "Escape" && b)
        return h = null, !0;
      if ((v === "Delete" || v === "Backspace") && b) {
        const y = t.level(), x = Ip(y, b.zoneId, b.index);
        return x === y ? (t.notify(u("zones.minVertices")), !0) : (h = null, t.commit(x), !0);
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
      p(), h = null, n = null;
    }
  };
}
function bw(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 }, r = null;
  const l = (p) => {
    t.select(p);
  }, a = () => {
    e = null, n = null, i = null, r = null, o = !1;
  }, c = gw(t, l), h = (p) => p.kind === "none" ? { x: Math.round(p.pt.x), y: Math.round(p.pt.y) } : p.pt, f = (p, m, w) => Xe(ae(p, p.walls.find((v) => v.id === m)), w).t;
  function d(p) {
    const m = e;
    if (!(!m || !n) && !(p.pt.x === s.x && p.pt.y === s.y))
      if (o = !0, m.kind === "node") {
        const w = kt(n, p.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: p.shift,
          excludeNodeIds: [m.nodeId]
        }), v = w.endpoint, b = (w.kind === "wall" || w.kind === "mid") && v.kind === "wall", y = w.kind === "node" && v.kind === "node" && v.nodeId !== m.nodeId, x = n.nodes.find((C) => C.id === m.nodeId), M = !!x.host && b && v.kind === "wall" && v.wallId === x.host.wallId;
        let k = n;
        if (x.host && !M) {
          const C = structuredClone(n);
          delete C.nodes.find((A) => A.id === m.nodeId).host, k = C;
        }
        let S = Tp(k, m.nodeId, h(w));
        if (y && v.kind === "node")
          S = Rp(S, m.nodeId, v.nodeId);
        else if (b && v.kind === "wall" && !M) {
          const C = n.walls.find((A) => A.id === v.wallId);
          if (C && C.a !== m.nodeId && C.b !== m.nodeId) {
            const A = structuredClone(S);
            A.nodes.find((N) => N.id === m.nodeId).host = { wallId: v.wallId, offset: v.offset }, S = Je(A, S);
          }
        }
        i = S;
      } else if (m.kind === "wall") {
        const w = n.walls.find((y) => y.id === m.wallId), v = kt(n, p.pt, {
          tolMm: t.tolMm(),
          grid: t.grid(),
          from: m.origin,
          ortho: p.shift,
          excludeNodeIds: [w.a, w.b]
        }), b = P(v.pt, m.origin);
        i = Hp(
          n,
          m.wallId,
          v.kind === "none" ? { x: Math.round(b.x), y: Math.round(b.y) } : b
        );
      } else {
        const w = n.openings.find((v) => v.id === m.openingId);
        i = Jc(n, w.id, f(n, w.wallId, p.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(p) {
      a(), s = p.pt, c.note();
      const m = t.level(), w = p.ctrl ? Pr(m, p.pt, t.tolMm()) : null;
      if (w) {
        l(null), t.commit(cw(m, w, p.pt));
        return;
      }
      if (c.press(p)) return;
      const v = t.selection(), b = hw(m, p.pt, t.tolMm(), v);
      if (!b) {
        c.pick(p.pt);
        return;
      }
      if (c.forget(), l(b), r = n = i = m, b.kind === "node") {
        let y = b.id;
        const x = (v == null ? void 0 : v.kind) === "wall" ? m.walls.find((M) => M.id === v.id) : void 0;
        if (p.alt && x) {
          const M = zp(m, x.id, x.a === b.id ? "a" : "b");
          n = i = M.level, y = M.nodeId, l({ kind: "node", id: y });
        }
        e = { kind: "node", nodeId: y, origin: ne(n, y) };
      } else if (b.kind === "wall")
        e = { kind: "wall", wallId: b.id, origin: p.pt };
      else if (b.kind === "opening") {
        const y = m.openings.find((x) => x.id === b.id);
        e = { kind: "opening", openingId: y.id, grab: f(m, y.wallId, p.pt) - y.offset };
      }
    },
    move(p) {
      c.active() ? c.move(p) : d(p);
    },
    up(p) {
      if (c.active()) {
        c.up(p);
        return;
      }
      e && d(p);
      const m = o, w = i, v = r;
      a(), m && w && v && w !== v && t.commit(w);
    },
    dblclick(p) {
      c.dblclick(p);
    },
    key(p) {
      return p === "Escape" && e ? (a(), !0) : c.key(p);
    },
    preview() {
      return !e || !i ? c.preview() : { level: i, orthoFrom: e.kind === "node" ? e.origin : void 0 };
    },
    cancel() {
      a(), c.cancel();
    }
  };
}
function Ld() {
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
function ww(t) {
  let e = null, n = { x: 0, y: 0 };
  const i = Ld(), o = () => {
    e = null, i.clear();
  }, s = (c) => kt(t.level(), c, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 });
  function r() {
    if (!e) return null;
    if (i.typing()) {
      const c = Bn(i.first, { min: 1 }), h = Bn(i.second, { min: 1 });
      return c === null || h === null ? null : { x: e.x + (n.x >= e.x ? c : -c), y: e.y + (n.y >= e.y ? h : -h) };
    }
    return s(n).pt;
  }
  const l = (c, h) => Math.abs(c.x - h.x) < 1 || Math.abs(c.y - h.y) < 1;
  function a(c) {
    if (!e || l(e, c)) return;
    const h = Pp(t.level(), e, c, t.wallProps(), t.boxMeasure());
    h !== t.level() && (t.commit(h), o());
  }
  return {
    id: "box",
    down(c) {
      if (n = c.pt, !e) {
        e = s(c.pt).pt;
        return;
      }
      const h = r();
      h && a(h);
    },
    move(c) {
      n = c.pt;
    },
    up() {
    },
    key(c) {
      return e ? i.key(c, () => {
        const h = r();
        h && a(h);
      }, o) : !1;
    },
    preview() {
      if (!e) return { snap: s(n) };
      const c = r(), h = {
        tracker: i.tracker(n),
        anchor: e,
        snap: i.typing() ? void 0 : s(n)
      };
      if (!c || l(e, c)) return h;
      const f = t.wallProps(), d = Ou(e, c, f.thickness, t.boxMeasure());
      return d && (h.walls = d.map((p, m) => ({ a: p, b: d[(m + 1) % 4], props: { ...f, baseline: "center" } }))), h;
    },
    cancel() {
      o();
    }
  };
}
const ka = (t) => Math.round(t * 1e3) / 1e3 + 0;
function vw(t) {
  let e = null, n = null, i = null, o = { x: 0, y: 0 }, s = !1, r = null;
  const l = Ld(), a = () => {
    e = null, n = null, i = null, r = null, l.clear();
  }, c = (d, p) => kt(t.level(), d, { tolMm: t.tolMm(), grid: t.grid(), from: n ?? void 0, ortho: p && n !== null });
  function h() {
    if (!n) return null;
    const d = c(o, s), p = Bn(l.first, { min: 1 }), m = Bn(l.second);
    if (p === null && m === null) return { pt: d.pt, endpoint: d.endpoint, snap: d };
    const w = p ?? R(n, d.pt);
    let v = d.pt;
    if (m === null && R(n, d.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      v = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      v = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const b = f1(n, v, w), y = { x: ka(b.x), y: ka(b.y) }, x = t.level().nodes.find((M) => Math.hypot(M.x - y.x, M.y - y.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: d } : { pt: y, endpoint: { kind: "free", pt: y }, snap: d };
  }
  function f() {
    const d = h();
    if (!e || !d) return;
    const p = Np(t.level(), e, d.endpoint, t.wallProps());
    if (p.wallId === null || p.endNodeId === null) return;
    t.commit(p.level);
    const m = p.level.walls.find((x) => x.id === p.wallId);
    i === null && (i = m.a);
    const w = p.endNodeId === i, v = n, b = ne(p.level, p.endNodeId), y = R(v, b);
    if (y > 0 && (r = { x: (b.x - v.x) / y, y: (b.y - v.y) / y }), l.clear(), w) {
      a();
      return;
    }
    e = { kind: "node", nodeId: p.endNodeId }, n = ne(p.level, p.endNodeId);
  }
  return {
    id: "wall",
    down(d) {
      if (o = d.pt, s = d.shift, !e) {
        const p = c(d.pt, !1);
        e = p.endpoint, n = p.pt;
        return;
      }
      f();
    },
    move(d) {
      o = d.pt, s = d.shift;
    },
    up() {
    },
    key(d, p) {
      return s = p.shift, e ? l.key(d, f, a) : !1;
    },
    preview() {
      if (!n) return { snap: kt(t.level(), o, { tolMm: t.tolMm(), grid: t.grid(), ortho: !1 }) };
      const d = h();
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
function $w(t, e) {
  let n = null;
  const i = () => t.openingDefaults(e);
  function o() {
    if (!n) return null;
    const s = t.level(), r = Pr(s, n, t.tolMm());
    if (!r) return null;
    const l = ae(s, s.walls.find((c) => c.id === r)), a = Xe(l, n).t;
    return { wallId: r, center: a, pt: B(l.a, T(l.dir, a)) };
  }
  return {
    id: e,
    down(s) {
      n = s.pt;
      const r = o();
      if (!r) return;
      const l = i(), a = Uf(t.level(), r.wallId, e, r.center, l.width, l);
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
        opening: { wallId: s.wallId, offset: l, width: r, kind: e, invalid: !fo(t.level(), s.wallId, l, r) },
        snap: { pt: s.pt, kind: "wall", endpoint: { kind: "wall", wallId: s.wallId, offset: s.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
const Ma = 3, yw = 1, Ve = (t) => ({ x: t.x, y: t.y });
function xw(t) {
  let e = [], n = null, i = !1, o = null, s = !1;
  const r = () => e.length ? Ve(e[e.length - 1]) : void 0;
  function l(f) {
    const d = e.length;
    if (d === 0) return !1;
    const p = e.map(Ve);
    if (R(p[d - 1], f) <= yw) return !0;
    if (d >= 2) {
      const m = P(p[d - 1], p[d - 2]), w = P(f, p[d - 1]);
      if (Math.abs(pe(m, w)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(w.x, w.y) && G(m, w) < 0) return !0;
    }
    for (let m = 0; m + 2 < d; m++) if (ar(p[d - 1], f, p[m], p[m + 1])) return !0;
    return !1;
  }
  function a(f) {
    if (e.length < Ma) return null;
    const d = t.tolMm(), p = Ve(e[0]), m = Ve(e[e.length - 1]);
    return R(f, p) <= d ? p : R(f, m) <= d ? m : null;
  }
  function c() {
    var p;
    if (e.length < Ma || Pi(e.map(Ve))) return !1;
    const f = t.level(), d = Ap(f, e, t.zoneName());
    return d.zoneId === null ? !1 : (e = [], n = null, i = !1, t.commit(t.zoneAutomation() ? d.level : fr(d.level, d.zoneId, !1)), (p = t.zonePlaced) == null || p.call(t), t.select({ kind: "zone", id: d.zoneId }), !0);
  }
  const h = (f) => _d(t, t.level(), f, r());
  return {
    id: "zone",
    down(f) {
      if (a(f.pt)) {
        c();
        return;
      }
      const d = h(f).vertex;
      l(Ve(d)) || (e = [...e, d], n = Ve(d), i = !1);
    },
    move(f) {
      s = f.shift;
      const d = a(f.pt);
      if (d) {
        n = d, o = null, i = Pi(e.map(Ve));
        return;
      }
      const p = h(f);
      o = p.snap, n = Ve(p.vertex), i = l(n);
    },
    up() {
    },
    key(f) {
      return f === "Enter" ? c() : f === "Backspace" || f === "Delete" || f === "Undo" ? e.length === 0 ? !1 : (e = e.slice(0, -1), i = !1, !0) : f === "Escape" ? e.length === 0 ? !1 : (e = [], n = null, i = !1, !0) : !1;
    },
    preview() {
      const f = {};
      e.length > 0 && (f.zoneDraft = { points: e.map(Ve), cursor: n, invalid: i }), o && (f.snap = o);
      const d = r();
      return s && d && (f.orthoFrom = d), f;
    },
    cancel() {
      e = [], n = null, i = !1, o = null, s = !1;
    }
  };
}
function kw(t) {
  return t.zoneMethod() === "polygon" ? xw(t) : {
    id: "zone",
    down(e) {
      var i;
      const n = _p(t.level(), e.pt, t.zoneName());
      if (n.zoneId === null) {
        t.notify(u("zones.noLoop"));
        return;
      }
      n.existing || (t.commit(t.zoneAutomation() ? n.level : fr(n.level, n.zoneId, !1)), (i = t.zonePlaced) == null || i.call(t)), t.select({ kind: "zone", id: n.zoneId });
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
const _a = (t, e) => {
  var n;
  return JSON.stringify((n = t.devices.find((i) => i.id === e)) == null ? void 0 : n.placement);
}, Mw = (t, e, n) => n === void 0 || _a(t, n) !== _a(e, n);
function _w(t, e, n, i) {
  const o = e.placement;
  if (o.mode === "free" && n) return P(n, i);
  if (o.mode !== "wall" || e.props.kind !== "equipment") return { x: 0, y: 0 };
  const s = Dn(t, o.wallId, o.side, o.offset);
  return s ? P(s, i) : { x: 0, y: 0 };
}
function Aw(t) {
  let e = null, n = null;
  const i = dd(t);
  let o = null, s = null, r = !1, l = { x: 0, y: 0 };
  const a = (d) => {
    e = d, t.select(d);
  }, c = () => {
    n = null, o = null, s = null, r = !1;
  };
  function h(d) {
    if (!n || !o || !r && R(d.pt, l) <= So / t.scale()) return;
    if (r = !0, d.pt.x === l.x && d.pt.y === l.y) {
      s = o;
      return;
    }
    const p = o.devices.find((k) => k.id === n.id);
    if (!p || p.placement.mode === "none") return;
    const m = d.shift ? Cr(l, d.pt) : d.pt, w = p.placement, v = w.mode === "free" ? null : de(o, p), b = w.mode === "free" ? w.rotation : v ? or(Math.round(Ze(v.dir))) : 0, y = B(m, n.grab), x = fd(t, o, p.props.kind, y, b, Ir(p.props.kind, w.mode)), M = x && x.mode === "wall" && w.mode === "wall" && w.aim !== void 0 ? { ...x, aim: w.aim } : x;
    s = M ? Oi(o, p.id, sr(o, p.props, f(o, p.placement, M, m, y), t.tolMm())) : o;
  }
  function f(d, p, m, w, v) {
    if (p.mode !== "wall" || m.mode !== "wall" || m.wallId !== p.wallId) return m;
    const b = d.walls.find((C) => C.id === p.wallId);
    if (!b) return m;
    const y = ae(d, b), x = Math.max(0, Math.min(y.len, p.offset + G(P(w, l), y.dir))), M = Xe(y, v).side, k = t.tolMm(), S = p.side === "left" ? M < -(y.rightOff + k) ? "right" : "left" : M > y.leftOff + k ? "left" : "right";
    return { ...m, offset: x, side: S };
  }
  return {
    id: "device-select",
    down(d) {
      c(), l = d.pt;
      const p = t.level(), m = t.tolMm();
      if (i.start((e == null ? void 0 : e.kind) === "device" ? e.id : void 0, d)) return;
      const w = wu(p, d.pt, m);
      if (!w) {
        a(null);
        return;
      }
      a({ kind: "device", id: w });
      const v = p.devices.find((y) => y.id === w), b = de(p, v);
      o = s = p, n = { id: w, grab: _w(p, v, (b == null ? void 0 : b.pt) ?? null, d.pt) };
    },
    move(d) {
      i.active() ? i.move(d) : h(d);
    },
    up(d) {
      if (i.end(d)) return;
      n && h(d);
      const p = s, m = o, w = r, v = n == null ? void 0 : n.id;
      c(), w && p && m && p !== m && Mw(m, p, v) && t.commit(p);
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
function Sw(t) {
  return {
    id: "binding-select",
    down(e) {
      const n = wu(t.level(), e.pt, t.tolMm());
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
const Os = 40, Lw = (t, e) => t.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === e.block && i.port === e.port));
function Cw(t, e, n, i) {
  const o = t.blocks.find((p) => p.id === e);
  if ((o == null ? void 0 : o.kind) !== "bus") return t;
  const s = o.w >= o.h, r = s ? o.x : o.y, l = s ? o.w : o.h, a = Vn(s ? i.x : i.y), c = n === "start" ? Math.min(a, r + l - Os) : r, h = n === "end" ? Math.max(a, r + Os) : r + l;
  if (c === r && h === r + l) return t;
  const f = s ? { x: c, w: h - c } : { y: c, h: h - c }, d = (p) => "bus" in p && p.bus === e ? { bus: e, at: Math.min(1, Math.max(0, (r + p.at * l - c) / (h - c))) } : p;
  return {
    ...t,
    blocks: t.blocks.map((p) => p.id === e ? { ...p, ...f } : p),
    wires: t.wires.map((p) => {
      const m = d(p.from), w = d(p.to);
      return m === p.from && w === p.to ? p : { ...p, from: m, to: w };
    })
  };
}
function Iw(t) {
  let e = null, n = null, i = null, o = !1, s = { x: 0, y: 0 };
  const r = () => {
    e = null, n = null, i = null, o = !1;
  };
  function l(h, f) {
    const d = Ls(h, f, t.tolMm(), t.geo());
    return (d == null ? void 0 : d.kind) === "port" ? { block: d.block, port: d.port } : (d == null ? void 0 : d.kind) === "bus" ? { bus: d.id, at: d.at } : (d == null ? void 0 : d.kind) === "bus-end" ? { bus: d.id, at: d.end === "start" ? 0 : 1 } : null;
  }
  function a(h) {
    const f = e, d = n;
    if (!f || !d || !o && R(h.pt, s) <= So / t.scale()) return;
    if (o = !0, f.kind === "wire") {
      const v = l(d, h.pt);
      e = { ...f, to: h.pt, ok: !!v && !("error" in Gl(d, f.from, v, t.geo())) };
      return;
    }
    if (f.kind === "bus-end") {
      i = Cw(d, f.id, f.end, h.pt);
      return;
    }
    const p = d.blocks.find((v) => v.id === (f.kind === "pin" ? f.from.block : f.id));
    if (!p) return;
    if (f.kind === "pin") {
      i = em(d, p.id, f.from.port, mm(De(p, t.geo(), d), h.pt));
      return;
    }
    const m = Vn(p.x + h.pt.x - s.x), w = Vn(p.y + h.pt.y - s.y);
    i = m === p.x && w === p.y ? d : Yp(d, p.id, m, w);
  }
  function c(h, f, d) {
    const p = l(h, d);
    if (!p) return;
    const m = Gl(h, f, p, t.geo());
    if ("error" in m) {
      t.notify(u(`power.err.${m.error}`));
      return;
    }
    t.commitPower(m.schema), t.notify(null);
  }
  return {
    id: "power-select",
    down(h) {
      r(), s = h.pt;
      const f = t.power(), d = Ls(f, h.pt, t.tolMm(), t.geo());
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
      if (n = i = f, d.kind === "port") {
        const p = { block: d.block, port: d.port };
        if (Lw(f, p)) {
          e = { kind: "pin", from: p };
          return;
        }
        const m = f.blocks.find((v) => v.id === d.block), w = ko(f, m, t.geo()).find((v) => v.name === d.port).pt;
        e = { kind: "wire", from: p, at: w, to: w, ok: !1 };
        return;
      }
      t.select({ kind: "powerBlock", id: d.id }), e = d.kind === "bus-end" ? { kind: "bus-end", id: d.id, end: d.end } : { kind: "move", id: d.id };
    },
    move(h) {
      a(h);
    },
    up(h) {
      a(h);
      const f = e, d = n, p = i, m = o;
      if (r(), !(!f || !d)) {
        if (!m) {
          (f.kind === "wire" || f.kind === "pin") && t.select({ kind: "powerBlock", id: f.from.block });
          return;
        }
        f.kind === "wire" ? c(d, f.from, h.pt) : p && p !== d && t.commitPower(p);
      }
    },
    key(h) {
      return h === "Escape" && e ? (r(), !0) : !1;
    },
    preview() {
      const h = e;
      return h ? h.kind === "wire" ? { wireDraft: { from: h.at, to: h.to, ok: h.ok } } : i ? { power: i } : {} : {};
    },
    cancel() {
      r();
    }
  };
}
function Ew(t, e) {
  const n = e.slice(6);
  return {
    id: e,
    down(i) {
      var c;
      let o;
      if (n === "device") {
        const h = t.placeDeviceId();
        if (!h) {
          t.notify(u("power.pickDevice"));
          return;
        }
        o = h;
      }
      const s = t.power(), r = Xp(n, { x: 0, y: 0 }, s, o), l = De(r, t.geo(), ql(s, r)), a = { ...r, x: Vn(i.pt.x - l.w / 2), y: Vn(i.pt.y - l.h / 2) };
      t.commitPower(ql(s, a)), n === "device" && ((c = t.devicePlaced) == null || c.call(t)), t.pickTool("power-select"), t.select({ kind: "powerBlock", id: a.id });
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
function Ow(t) {
  return {
    id: "zone-pick",
    down(e) {
      const n = Ad(t.level(), e.pt, t.tolMm())[0];
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
const Dw = ["select", "box", "wall", "door", "window", "opening", "zone"], Nw = [
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
], Pw = ["binding-select"], Tw = [
  "power-select",
  "power-device",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Vw = ["zone-pick"], Cd = {
  select: "V",
  box: "B",
  wall: "W",
  door: "D",
  window: "N",
  opening: "O",
  zone: "Z"
}, Hw = {
  plan: Dw,
  equipment: Nw,
  binding: Pw,
  power: Tw,
  automation: Vw
};
function Tr(t) {
  return Hw[t];
}
function Ds(t, e) {
  switch (t) {
    case "select":
      return bw(e);
    case "box":
      return ww(e);
    case "wall":
      return vw(e);
    case "door":
    case "window":
    case "opening":
      return $w(e, t);
    case "zone":
      return kw(e);
    case "device-select":
      return Aw(e);
    case "binding-select":
      return Sw(e);
    case "power-select":
      return Iw(e);
    case "zone-pick":
      return Ow(e);
    case "power-device":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return Ew(e, t);
    default:
      return g1(e, t);
  }
}
function Jo(t, e, n) {
  return e.kind === "powerBlock" ? n.blocks.some((o) => o.id === e.id) : e.kind === "powerWire" ? n.wires.some((o) => o.id === e.id) : (e.kind === "wall" ? t.walls : e.kind === "node" ? t.nodes : e.kind === "opening" ? t.openings : e.kind === "device" ? t.devices : t.zones).some((o) => o.id === e.id);
}
const zw = {
  select: nn,
  box: Jm,
  wall: eg,
  door: Em,
  window: og,
  opening: Om,
  zone: qm,
  "device-select": nn,
  ceiling_light: Am,
  wall_light: tg,
  motion_sensor: Qu,
  illuminance_sensor: _m,
  climate_sensor: Zm,
  wall_switch: Yu,
  smart_button: Tm,
  valve: Ym,
  leak_sensor: td,
  socket: Ju,
  virtual_switch: Xm,
  speaker: jm,
  phone: Sm,
  exhaust_fan: Xu,
  equipment: Ql,
  "binding-select": nn,
  "zone-pick": nn,
  "power-select": nn,
  "power-device": Ql,
  "power-bus": Fm,
  "power-battery": Mm,
  "power-pv": ed,
  "power-transfer": Wm,
  "power-remainder": Lm
}, Id = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${zw[t]}></path>`}</svg>`;
function Rw(t) {
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
function Bw(t) {
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
        ${Rw(t)}${t.saveState === "error" && t.errorMessage ? g`: ${t.errorMessage}` : $}</span>
      <button class="btn primary" data-action="save" ?disabled=${t.saveState === "saving"} @click=${t.onSave}>
        ${u("action.save")}</button>
    </div>${t.steps}</div>`;
}
const Fw = ["box", "door", "zone", "ceiling_light", "power-device", "power-bus"];
function Ed(t, e, n) {
  return Tr(t).map((i) => {
    const o = t === "plan" ? Cd[i] : void 0, s = u(`tool.${i}`);
    return g`
      ${Fw.includes(i) ? g`<div class="tool-sep"></div>` : $}
      <button class="tool ${e === i ? "on" : ""}" data-tool=${i} data-key=${o ?? $}
        aria-pressed=${e === i ? "true" : "false"} aria-keyshortcuts=${o ?? $}
        title=${o ? `${s} (${o})` : s} @click=${() => n(i)}>
        ${Id(i)}<span class="tlabel">${s}</span></button>`;
  });
}
function Uw(t, e, n) {
  return g`<div class="tools">${Ed(t, e, n)}</div>`;
}
const oi = ["plan", "equipment", "binding", "power", "automation"], rn = (t, e, n) => u(t === 1 ? e : n).replace("{n}", String(t));
function Ww(t, e, n, i, o = 0) {
  const { walls: s, zones: r, devices: l } = e;
  switch (t) {
    case "plan": {
      const a = r.filter((h) => h.invalid).length, c = a ? `, ${u("steps.invalid").replace("{n}", String(a))}` : "";
      return {
        text: `${rn(s.length, "steps.wall", "steps.walls")}, ${rn(r.length, "steps.zone", "steps.zones")}${c}`,
        done: s.length > 0 && r.length > 0
      };
    }
    case "equipment":
      return { text: rn(l.length, "steps.device", "steps.devices"), done: l.length > 0 };
    case "binding": {
      const a = l.length - Ys(l.map(n));
      return {
        text: u("steps.bound").replace("{b}", String(a)).replace("{n}", String(l.length)),
        done: l.length > 0 && a === l.length
      };
    }
    case "power":
      return { text: rn(i.blocks.length, "steps.block", "steps.blocks"), done: lm(i) };
    case "automation":
      return { text: rn(o, "steps.rule", "steps.rules"), done: o > 0 };
  }
}
const Aa = (t, e) => u(t).replace("{step}", u(`mode.${e}`));
function jw(t) {
  const e = oi.indexOf(t.mode), n = oi[e - 1], i = oi[e + 1];
  return g`
    <nav class="steps" aria-label=${u("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${Q(t.planName)} aria-label=${u("plan.name")} title=${u("plan.name")}
          @change=${(o) => t.onRename(o.target.value)} />
        <span class="app">${u("steps.app")}</span>
      </div>
      ${oi.map((o, s) => {
    const r = Ww(o, t.level, t.status, t.power, t.rules), l = o === t.mode;
    return g`<button class="step${l ? " current" : ""}${r.done ? " done" : ""}" data-mode=${o}
          aria-current=${l ? "step" : $} @click=${() => t.onMode(o)}>
          <span class="n">${s + 1}</span><span class="name">${u(`mode.${o}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <div class="nav">
        ${n ? g`<button class="btn" data-nav="back" @click=${() => t.onMode(n)}>${Aa("steps.back", n)}</button>` : $}
        ${i ? g`<button class="btn primary" data-nav="next" @click=${() => t.onMode(i)}>${Aa("steps.next", i)}</button>` : $}
      </div>
    </nav>`;
}
const qw = ["unbound", "bound", "all"], Zw = /* @__PURE__ */ new WeakMap(), wn = (t) => t.placement.mode === "none";
function Od(t) {
  return _t(Zw, t, (e) => [...e.devices].sort((n, i) => Number(wn(n)) - Number(wn(i)) || n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Gw(t, e, n) {
  const i = Od(t), o = e === null ? -1 : i.findIndex((s) => s.id === e);
  for (let s = 1; s <= i.length; s++) {
    const r = i[(o + s) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const Dd = (t) => u(`device.${t.props.kind}`), Sa = (t) => t.props.kind === "equipment" ? Er(t) : Dd(t), Kw = (t, e) => t === "all" || t === "bound" == (e === "bound");
function Xw(t, e, n) {
  return e === 0 ? u("binding.noDevices") : n || t.filter === "all" ? u("binding.noMatch") : u(t.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function La(t) {
  const e = u(t.collapsed ? "binding.expand" : "binding.collapse");
  return g`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!t.collapsed)} aria-label=${e}
    title=${e} @click=${() => t.onCollapse(!t.collapsed)}>${t.collapsed ? "›" : "‹"}</button>`;
}
function Yw(t) {
  var l;
  if (t.collapsed) return g`<div class="blist collapsed">${La(t)}</div>`;
  const e = Od(t.level).map((a) => ({ d: a, st: t.status(a) })), n = {
    unbound: Ys(e.map((a) => a.st)),
    bound: e.filter((a) => a.st === "bound").length,
    all: e.length
  }, i = t.query.trim().toLowerCase(), o = e.filter(({ d: a, st: c }) => Kw(t.filter, c) && (!i || a.name.toLowerCase().includes(i) || Dd(a).toLowerCase().includes(i) || Sa(a).toLowerCase().includes(i))), s = ((l = t.selection) == null ? void 0 : l.kind) === "device" ? t.selection.id : null, r = (a, c) => {
    const h = Gh(a);
    return g`<button class="brow${a.id === s ? " sel" : ""}" data-id=${a.id} @click=${() => t.onPick(a.id)}>
      <span class="dot ${c}" role="img" aria-label=${u(`bindstatus.${c}`)} title=${u(`bindstatus.${c}`)}></span>
      <span class="nm"><span class="name">${a.name}</span><small class="kind">${Sa(a)}</small></span>
      <span class="cnt">${h.filled}/${h.total}</span>
    </button>`;
  };
  return g`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${u("binding.show")}>
          ${qw.map((a) => g`<button role="radio" aria-checked=${String(a === t.filter)} data-filter=${a}
            @click=${() => t.onFilter(a)}>${u(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${La(t)}
      </div>
      <input class="list-search" type="search" placeholder=${u("binding.search")} aria-label=${u("binding.search")}
        .value=${Q(t.query)} @input=${(a) => t.onQuery(a.target.value)} />
      <div class="rows">
        ${o.length === 0 ? g`<p class="empty">${Xw(t, e.length, i)}</p>` : g`
          ${o.filter((a) => !wn(a.d)).map((a) => r(a.d, a.st))}
          ${o.some((a) => wn(a.d)) ? g`<div class="bgroup" data-group="unplaced">
            <h5>${u("devices.unplaced")}</h5>
            ${o.filter((a) => wn(a.d)).map((a) => r(a.d, a.st))}
          </div>` : $}`}
      </div>
    </div>`;
}
function Qw() {
  return {
    door: { width: gi.door, hinge: "start", swing: "left" },
    window: { width: gi.window, outside: "left" },
    opening: { width: gi.opening },
    zone: { method: "walls", name: null, automation: !0 },
    wallMount: !1
  };
}
function Jw(t, e) {
  return e === "door" ? { ...t.door } : e === "window" ? { ...t.window } : { width: t.opening.width };
}
function Nd(t) {
  return Ks(u("zones.default"), t.zones.map((e) => e.name));
}
const ev = (t) => t === "door" || t === "window" || t === "opening";
function tv(t) {
  const e = t.next;
  if (t.tool !== "door" && t.tool !== "window" && t.tool !== "opening") return $;
  const n = t.tool, i = e[n].width, o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = (r) => t.setNext({ ...e, [n]: { ...e[n], ...r } });
  return g`
    <h4>${u(`props.next.${n}`)}</h4>
    ${z(`${u("props.width")}, ${u("unit.mm")}`, Fe({
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
      ${z(u("props.hinge"), ce(
    e.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => {
      r !== e.door.hinge && s({ hinge: r });
    },
    "next-hinge"
  ))}
      ${z(u("props.swing"), ce(e.door.swing, o, (r) => {
    r !== e.door.swing && s({ swing: r });
  }, "next-swing"))}` : $}
    ${n === "window" ? z(u("props.outside"), ce(
    e.window.outside,
    o,
    (r) => {
      r !== e.window.outside && s({ outside: r });
    },
    "next-outside"
  )) : $}`;
}
class nv {
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
const Ns = (t) => typeof t == "object" && t !== null && !Array.isArray(t), vn = (t) => typeof t == "string" && t ? t : null, Ca = (t) => typeof t == "number" && Number.isFinite(t), Ps = (t) => {
  var e;
  return t.props.kind === "equipment" && !!((e = t.bindings) != null && e.control);
};
function Pd(t) {
  return t.switchesMigrated || !t.devices.some(Ps) ? t : { ...t, switchesMigrated: !0 };
}
function iv(t, e, n) {
  const i = iu(t, n);
  let o = i.level;
  const s = Ns(e.switch) ? e.switch : {}, r = [["power", vn(e.power)], ["voltage", vn(e.voltage)], ["control", vn(s.entity)]];
  for (const [l, a] of r) a && (o = so(o, i.id, l, a));
  return s.controllable === !0 && (o = po(o, i.id, !0)), { level: o, id: i.id };
}
function ov(t) {
  let e = t.level, n = t.power;
  const i = t.power;
  if (Ns(i) && Array.isArray(i.blocks)) {
    let o = 0, s = !1;
    const r = i.blocks.map((l) => {
      if (!Ns(l)) return l;
      if (l.kind === "meter" && vn(l.id) && Ca(l.x) && Ca(l.y)) {
        o++;
        const a = iv(e, l, vn(l.name) ?? `Meter ${o}`);
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
        return a === !0 && typeof l.deviceId == "string" && (e = ru(e, l.deviceId, !0)), s = !0, c;
      }
      return l;
    });
    s && (n = { ...i, blocks: r });
  }
  if (!e.switchesMigrated && e.devices.some(Ps)) {
    for (const o of t.level.devices) Ps(o) && (e = po(e, o.id, !0));
    e = Pd(e);
  }
  return e === t.level && n === t.power ? t : { ...t, level: e, ...n ? { power: n } : {} };
}
const Wi = 3600;
function Ue(t) {
  return { id: oe(), name: "", zoneId: t, combine: "any", inputs: [], onDelay: 0, offDelay: 0, onTrue: [], onFalse: [] };
}
const sv = (t, e) => [...t, e], rv = (t, e) => t.map((n) => n.id === e.id ? e : n), lv = (t, e) => t.filter((n) => n.id !== e);
function av(t, e, n) {
  return e === null ? t.filter((i) => i.zoneId === null || !n(i.zoneId)) : t.filter((i) => i.zoneId === e);
}
const cv = (t) => {
  const e = t.source;
  return "rule" in e ? [e.rule] : "held" in e ? e.held.sources.flatMap((n) => "rule" in n ? [n.rule] : []) : [];
}, Vr = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).filter((n) => typeof n == "object" && n !== null && !Ge(n) && !Se(n));
}, uv = (t) => {
  var e;
  return (Array.isArray((e = t.control) == null ? void 0 : e.sources) ? t.control.sources : []).flatMap((n) => typeof n == "object" && n !== null && Se(n) && typeof n.event == "object" && n.event !== null && typeof n.event.rule == "string" ? [n.event.rule] : []);
}, ji = (t) => [...[...t.inputs, ...Vr(t), ...t.gate ? [t.gate] : []].flatMap(cv), ...uv(t)];
function Hr(t) {
  return t.motionLight ? ["auto", "manual"] : t.boiler ? ["auto", "manual", "done"] : [];
}
const Td = (t, e) => `${t}: ${u(`control.event.${e}`)}`, Vd = (t) => {
  const e = t.source;
  return "device" in e ? [e.device] : "held" in e ? e.held.sources.flatMap((n) => "device" in n ? [n.device] : []) : [];
}, dv = (t, e) => t.filter((n) => n.id !== e && ji(n).includes(e));
function hv(t, e) {
  const n = new Map(t.map((s) => [s.id, s]));
  n.set(e.id, e);
  const i = /* @__PURE__ */ new Set(), o = (s, r) => {
    if (s === e.id && r.length > 0) return r;
    if (r.includes(s) || i.has(s)) return null;
    const l = n.get(s);
    if (!l) return null;
    for (const a of ji(l)) {
      const c = o(a, [...r, s]);
      if (c) return c;
    }
    return i.add(s), null;
  };
  for (const s of ji(e)) {
    const r = o(s, [e.id]);
    if (r) return r;
  }
  return null;
}
const qi = /^([01]\d|2[0-3]):[0-5]\d$/, St = (t) => typeof t == "number" && Number.isFinite(t);
function fv(t) {
  const e = t.source;
  if ("daylight" in e) return ["night", "dark", "day"].includes(e.is) && t.not === void 0 ? null : "daylight";
  if ("light" in e) return St(e.below) && e.below > 0 && St(e.hysteresis) && e.hysteresis >= 0 && (e.unknownDark === void 0 || e.unknownDark === !0) ? null : "light";
  if ("time" in e) {
    const { from: n, to: i } = e.time;
    return typeof n == "string" && typeof i == "string" && qi.test(n) && qi.test(i) && n !== i ? null : "time";
  }
  if ("held" in e) {
    const n = e.held;
    return Array.isArray(n.sources) && n.sources.length >= 1 && ["on", "off", "any"].includes(n.state) && Number.isInteger(n.seconds) && n.seconds >= 1 && n.seconds <= 86400 ? null : "held";
  }
  return null;
}
const Ia = (t) => Number.isInteger(t) && t >= 0 && t <= Wi;
function pv(t, e, n, i, o, s, r, l, a, c, h, f, d, p, m, w, v, b, y, x, M, k, S, C) {
  var q;
  const A = [];
  e.name.trim() || A.push("name"), e.inputs.length === 0 && !e.vent && !e.boiler && !e.leak && !e.timed && !e.outside && !e.beurer && !e.control && !e.motionLight && A.push("inputs");
  const N = e.control, U = (Array.isArray(N == null ? void 0 : N.sources) ? N.sources : []).filter((V) => typeof V == "object" && V !== null && Ge(V)).map((V) => V.button), I = N ? [N.on, N.off, N.toggle, ...N.auto === void 0 ? [] : [N.auto]].flatMap((V) => Array.isArray(V) ? V : []) : [], O = [...e.inputs, ...Vr(e), ...e.gate ? [e.gate] : []], E = [...O.flatMap(Vd), ...e.onTrue.map((V) => V.device), ...e.onFalse.map((V) => V.device)], D = O.flatMap((V) => "light" in V.source ? [V.source.light] : "daylight" in V.source ? [V.source.daylight] : []);
  (E.some((V) => !n(V)) || D.some((V) => !(o ?? n)(V)) || e.vent && [e.vent.sensor, e.vent.than].some((V) => !(s ?? n)(V)) || e.boiler && (!(r ?? n)(e.boiler.device) || !(l ?? n)(e.boiler.button) || e.boiler.grid && a && !a(e.boiler.grid.block)) || e.leak && (e.leak.sensors.some((V) => !(h ?? n)(V)) || e.leak.valves.some((V) => !(f ?? n)(V))) || e.timed && (!(d ?? n)(e.timed.button) || !(p ?? n)(e.timed.device)) || e.outside && (!(m ?? n)(e.outside.light) || !(o ?? n)(e.outside.sensor)) || e.beurer && (!(w ?? n)(e.beurer.heater) || !(v ?? n)(e.beurer.source)) || e.motionLight && (!(x ?? n)(e.motionLight.light) || e.motionLight.sensors.some((V) => !(M ?? n)(V)) || e.motionLight.buttons.some((V) => !(k ?? n)(V)) || e.motionLight.daylight && !(o ?? n)(e.motionLight.daylight.sensor) || e.motionLight.blocker && !(C ?? n)(e.motionLight.blocker.device)) || U.some((V) => !(b ?? n)(V)) || I.some((V) => !(y ?? n)(V.device))) && A.push("device-missing");
  const H = new Set(t.map((V) => V.id));
  ji(e).some((V) => V !== e.id && !H.has(V)) && A.push("rule-missing"), hv(t, e) && A.push("cycle"), (!Ia(e.onDelay) || !Ia(e.offDelay)) && A.push("delay");
  for (const V of O) {
    const re = fv(V);
    re && !A.includes(re) && A.push(re);
  }
  return e.vent && gv(e, e.vent) && A.push("vent"), e.boiler && Fv(e, e.boiler) && A.push("boiler"), e.leak && bv(e, e.leak) && A.push("leak"), e.timed && yv(e, e.timed) && A.push("timed"), e.outside && Mv(e, e.outside) && A.push("outside"), e.beurer && _v(e, e.beurer) && A.push("beurer"), e.control && Ev(e, e.control, t) && A.push("control"), e.motionLight && Hv(e, e.motionLight) && A.push("motionLight"), S && mv(e, S) && A.push("virtual-read"), [...e.onTrue, ...e.onFalse, ...I].some((V) => typeof V == "object" && V !== null && xe(V.do) && Lv(V)) && A.push("announce"), (q = e.boiler) != null && q.button && c && !A.includes("device-missing") && !c(e.boiler.button) && A.push("boiler-auto"), i && [...e.onTrue, ...e.onFalse].some((V) => {
    const re = i(V.device);
    return re !== void 0 && !re.includes(V.do);
  }) && A.push("action"), N && I.some((V) => !Av.includes(V.do) || i && !Sv(V.do, i(V.device))) && A.push("action"), A;
}
function mv(t, e) {
  const n = new Set(t.inputs.flatMap((i) => "device" in i.source ? [i.source.device] : []));
  return [...t.onTrue, ...t.onFalse].some((i) => e(i.device) && n.has(i.device));
}
function gv(t, e) {
  if (t.inputs.length > 0 || t.motionLight || t.beurer || t.control || t.gate || t.leak || t.timed || t.outside || t.combine !== "any" || t.onDelay !== 0 || !e.sensor || !e.than || e.sensor === e.than || !St(e.above) || !St(e.below) || e.above <= 0 || e.below < 0 || e.below > e.above) return !0;
  const [n, i] = [t.onTrue[0], t.onFalse[0]];
  return t.onTrue.length !== 1 || t.onFalse.length !== 1 || n.do !== "on" || i.do !== "off" || !n.device || n.device !== i.device;
}
function bv(t, e) {
  if (t.vent || t.boiler || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (i) => Array.isArray(i) && i.length >= 1 && i.every((o) => typeof o == "string" && o !== "") && new Set(i).size === i.length;
  return !n(e.sensors) || !n(e.valves);
}
const wv = (t) => t.leak !== void 0;
function vv(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Leak protection ${n}` : "Leak protection";
  const o = e === null ? void 0 : t.levels.find((r) => r.zones.some((l) => l.id === e)), s = o ? Qe(o, e).filter((r) => r.participates).map((r) => r.device) : [];
  return i.leak = { sensors: s.filter((r) => r.props.kind === "leak_sensor").map((r) => r.id), valves: s.filter((r) => r.props.kind === "valve").map((r) => r.id) }, i;
}
const $v = 15;
function yv(t, e) {
  return t.vent || t.boiler || t.leak || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.button || !e.device || e.button === e.device || !Number.isInteger(e.minutes) || e.minutes < 1 || e.minutes > 1440 ? !0 : e.invert !== void 0 && e.invert !== !0;
}
const xv = (t) => t.timed !== void 0, kv = 30;
function Mv(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.light || !e.sensor || e.light === e.sensor || e.noDataNight !== void 0 && e.noDataNight !== !0 || e.afterSunset !== void 0 && e.afterSunset !== !0 || !Number.isInteger(e.pause) || e.pause < 0 || e.pause > 1440) return !0;
  if (e.window === void 0) return !1;
  const { from: n, to: i } = e.window;
  return !(typeof n == "string" && typeof i == "string" && qi.test(n) && qi.test(i) && n !== i);
}
const si = { above: 200, offDelay: 60, keep: 10, every: 30 };
function _v(t, e) {
  return t.vent || t.boiler || t.leak || t.timed || t.outside || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.heater || !e.source || e.heater === e.source || !St(e.above) || e.above <= 0 ? !0 : ![e.keep, e.every].every((n) => Number.isInteger(n) && n >= 0 && n <= 1440);
}
const Av = ["on", "off", "toggle", "close", "say", "play", "notify"];
function $n(t) {
  const e = te(t), n = e.filter(xe);
  return n.length > 0 ? n : e.includes("on") && e.includes("off") ? ["on", "off", "toggle"] : e.includes("close") ? ["close"] : [];
}
const Sv = (t, e) => e === void 0 || (xe(t) ? e.includes(t) : t === "close" ? e.includes("close") : e.includes("on") && e.includes("off")), Ea = (t) => typeof t == "string" && t.trim() !== "";
function Lv(t) {
  const e = t, n = t.do === "play" ? "media" : "text", i = t.do === "notify" ? "title" : null;
  return !Ea(e[n]) || Object.keys(e).some((o) => o !== "device" && o !== "do" && o !== n && o !== i) || i !== null && i in e && !Ea(e[i]);
}
const Cv = (t) => xe(t.do) ? `${t.device}|${t.do}` : t.device;
function Iv(t, e) {
  if (typeof t != "object" || t === null || Object.keys(t).length !== 1) return !1;
  const n = t.event;
  if (typeof n != "object" || n === null || Object.keys(n).sort().join() !== "rule,what") return !1;
  const { rule: i, what: o } = n;
  if (typeof i != "string" || i === "" || typeof o != "string" || o === "") return !1;
  const s = e.find((r) => r.id === i);
  return s === void 0 || Hr(s).includes(o);
}
function Hd(t, e) {
  const n = (i, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).sort(([s], [r]) => s < r ? -1 : 1)) : o;
  return JSON.stringify(t, n) === JSON.stringify(e, n);
}
function Ev(t, e, n) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.motionLight || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const i = [e.on, e.off, e.toggle, ...e.auto === void 0 ? [] : [e.auto]];
  if (!Array.isArray(e.sources) || e.sources.length === 0 || !i.every(Array.isArray) || i.every((l) => l.length === 0)) return !0;
  const o = (l) => typeof l == "object" && l !== null && (Se(l) ? Iv(l, n) : Ge(l) ? typeof l.button == "string" && l.button !== "" : typeof l.source == "object" && l.source !== null);
  if (!e.sources.every(o) || e.sources.some((l, a) => e.sources.some((c, h) => h < a && Hd(l, c)))) return !0;
  const s = (l) => l.every((a) => typeof a == "object" && a !== null && typeof a.device == "string" && a.device !== "") && new Set(l.map(Cv)).size === l.length;
  if (!i.every(s)) return !0;
  const r = new Set(Vr(t).flatMap(Vd));
  return i.some((l) => l.some((a) => !xe(a.do) && r.has(a.device)));
}
const zr = (t) => {
  var e;
  return t.sources.some(Ge) || (((e = t.auto) == null ? void 0 : e.length) ?? 0) > 0 ? ["on", "off", "toggle", "auto"] : ["on", "off", "toggle"];
}, Oa = (t) => t.control !== void 0;
function Ov(t, e, n) {
  var d, p;
  const i = Ue(e);
  i.name = e !== null && n ? `Load control ${n}` : "Load control";
  const o = e === null ? void 0 : t.levels.find((m) => m.zones.some((w) => w.id === e)), s = o ? Qe(o, e).filter((m) => m.participates).map((m) => m.device) : [], r = s.filter((m) => m.props.kind === "wall_switch" || m.props.kind === "smart_button"), l = s.filter((m) => {
    const w = te(m);
    return w.includes("on") && w.includes("off");
  }), a = r.length === 1 ? r[0] : void 0, c = l.length === 1 ? l[0] : void 0, h = (a == null ? void 0 : a.props.kind) === "wall_switch" && !!((d = a.bindings) != null && d.state) && a.bindings.state === ((p = c == null ? void 0 : c.bindings) == null ? void 0 : p.control), f = (m) => c && !h ? [{ device: c.id, do: m }] : [];
  return i.control = { sources: a ? [a.props.kind === "smart_button" ? { button: a.id } : { source: { device: a.id } }] : [], on: f("on"), off: f("off"), toggle: f("toggle") }, i;
}
function Dv(t, e) {
  const n = t.control;
  if (!n || "on" in n || !Array.isArray(n.sources) || !Array.isArray(n.loads) || ![...n.sources, ...n.loads].every((r) => typeof r == "string")) return t;
  const i = n.loads, o = (r) => i.map((l) => ({ device: l, do: r })), s = n.sources.map((r) => e(r) === "smart_button" ? { button: r } : { source: { device: r } });
  return { ...t, control: { sources: s, on: o("on"), off: o("off"), toggle: o("toggle") } };
}
const Nv = (t) => t.beurer !== void 0;
function Pv(t, e) {
  const n = Ue(t);
  return n.name = t !== null && e ? `Beurer heater ${e}` : "Beurer heater", n.offDelay = si.offDelay, n.beurer = { heater: "", source: "", above: si.above, keep: si.keep, every: si.every }, n;
}
const Tv = (t) => t.outside !== void 0;
function Vv(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Outside light ${n}` : "Outside light";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), r = (o ? Qe(o, e).filter((a) => a.participates).map((a) => a.device) : []).filter((a) => (a.props.kind === "ceiling_light" || a.props.kind === "wall_light") && te(a).includes("on")), l = t.levels.flatMap((a) => a.devices).filter((a) => a.props.kind === "illuminance_sensor");
  return i.outside = { light: r.length === 1 ? r[0].id : "", sensor: l.length === 1 ? l[0].id : "", noDataNight: !0, afterSunset: !0, pause: kv }, i;
}
const ri = { offDelay: 180, minOn: 0, autoAfter: 0, is: "dark" };
function Hv(t, e) {
  if (t.vent || t.boiler || t.leak || t.timed || t.outside || t.beurer || t.control || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0) return !0;
  const n = (o) => Array.isArray(o) && o.every((s) => typeof s == "string" && s !== "") && new Set(o).size === o.length;
  if (typeof e.light != "string" || e.light === "" || !n(e.sensors) || !n(e.buttons) || e.sensors.includes(e.light) || e.buttons.includes(e.light) || e.daylight !== void 0 && (typeof e.daylight != "object" || e.daylight === null || typeof e.daylight.sensor != "string" || e.daylight.sensor === "" || e.daylight.is !== "night" && e.daylight.is !== "dark")) return !0;
  const i = e.blocker;
  return i !== void 0 && (typeof i != "object" || i === null || typeof i.device != "string" || i.device === "" || i.device === e.light || i.is !== "on" && i.is !== "off") ? !0 : !Number.isInteger(e.minOn) || e.minOn < 0 || e.minOn > 3600 || !Number.isInteger(e.autoAfter) || e.autoAfter < 0 || e.autoAfter > 1440;
}
const Da = (t) => {
  const e = te(t);
  return e.includes("on") && e.includes("off");
}, zv = (t) => t.motionLight !== void 0, Na = (t) => {
  var e;
  return t.props.kind === "smart_button" || t.props.kind === "wall_switch" && !!((e = t.bindings) != null && e.state);
};
function Rv(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Light motion control ${n}` : "Light motion control", i.offDelay = ri.offDelay;
  const o = e === null ? void 0 : t.levels.find((c) => c.zones.some((h) => h.id === e)), s = o ? Qe(o, e).filter((c) => c.participates).map((c) => c.device) : [], r = s.filter((c) => (c.props.kind === "ceiling_light" || c.props.kind === "wall_light") && te(c).includes("on") && te(c).includes("off")), l = t.levels.flatMap((c) => c.devices).filter((c) => c.props.kind === "illuminance_sensor"), a = r.length === 1 ? r[0] : void 0;
  return i.motionLight = {
    light: a ? a.id : "",
    sensors: s.filter((c) => c.props.kind === "motion_sensor").map((c) => c.id),
    ...l.length === 1 ? { daylight: { sensor: l[0].id, is: ri.is } } : {},
    minOn: ri.minOn,
    buttons: s.filter((c) => {
      var h, f;
      return c.props.kind === "smart_button" || !!((h = a == null ? void 0 : a.bindings) != null && h.control) && c.props.kind === "wall_switch" && ((f = c.bindings) == null ? void 0 : f.state) === a.bindings.control;
    }).map((c) => c.id),
    autoAfter: ri.autoAfter
  }, i;
}
function Bv(t, e, n) {
  const i = Ue(e);
  i.name = e !== null && n ? `Timed switch ${n}` : "Timed switch";
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Qe(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "wall_switch" || a.props.kind === "smart_button"), l = s.filter((a) => {
    const c = te(a);
    return c.includes("on") && c.includes("off");
  });
  return i.timed = { button: r.length === 1 ? r[0].id : "", device: l.length === 1 ? l[0].id : "", minutes: $v }, i;
}
function Fv(t, e) {
  if (t.vent || t.leak || t.timed || t.outside || t.beurer || t.control || t.motionLight || t.gate || t.inputs.length > 0 || t.combine !== "any" || t.onDelay !== 0 || t.offDelay !== 0 || t.onTrue.length > 0 || t.onFalse.length > 0 || !e.device || !e.button || e.device === e.button) return !0;
  if (e.grid === void 0) return !1;
  const n = e.grid;
  return !n.block || !St(n.limit) || !St(n.nominal) || n.limit <= 0 || n.nominal <= 0;
}
const Uv = (t) => t.boiler !== void 0, Ts = (t) => {
  var e, n;
  return !!((e = t.bindings) != null && e.control) && !!((n = t.bindings) != null && n.power) && (t.props.kind !== "equipment" || t.props.controllable === !0);
};
function zd(t) {
  const e = t.props;
  return e.kind === "wall_switch" ? e.autoByDoubleToggle : e.kind === "smart_button" ? e.autoEnabled && e.auto.event.trim() !== "" : !0;
}
const Rd = 3e3, Bd = 1400;
function Wv(t, e, n) {
  var c;
  const i = Ue(e);
  i.name = e !== null && n ? `Cost effective boiler ${n}` : "Cost effective boiler";
  const o = e === null ? void 0 : t.levels.find((h) => h.zones.some((f) => f.id === e)), s = o ? Qe(o, e).filter((h) => h.participates).map((h) => h.device) : [], r = s.filter(Ts), l = s.filter((h) => h.props.kind === "wall_switch" || h.props.kind === "smart_button");
  i.boiler = { device: r.length === 1 ? r[0].id : "", button: l.length === 1 ? l[0].id : "" };
  const a = (((c = t.power) == null ? void 0 : c.blocks) ?? []).filter((h) => h.kind === "grid");
  return a.length === 1 && (i.boiler.grid = { block: a[0].id, limit: Rd, nominal: Bd }), i;
}
const jv = (t) => t.vent !== void 0, qv = 600;
function Zv(t, e, n) {
  var l;
  const i = Ue(e);
  i.name = e !== null && n ? `Vent ${n}` : "Vent", i.offDelay = qv;
  const o = e === null ? void 0 : t.levels.find((a) => a.zones.some((c) => c.id === e)), s = o ? Qe(o, e).filter((a) => a.participates).map((a) => a.device) : [], r = s.filter((a) => a.props.kind === "exhaust_fan");
  return i.vent = { sensor: ((l = s.find((a) => a.props.kind === "climate_sensor")) == null ? void 0 : l.id) ?? "", than: "", above: 9, below: 5 }, r.length === 1 && (i.onTrue = [{ device: r[0].id, do: "on" }], i.onFalse = [{ device: r[0].id, do: "off" }]), i;
}
const Gv = 1800;
function Kv(t, e, n, i) {
  const o = Ue(e);
  return o.name = i.trim() ? `${i.trim()} unchanged 30 min` : "Unchanged 30 min", o.inputs = [{ source: { held: { sources: n === null ? [] : [{ device: n }], state: "any", seconds: Gv } } }], o;
}
const Xv = /* @__PURE__ */ new Set(["leak_sensor", "motion_sensor", "ceiling_light", "wall_light", "socket", "exhaust_fan", "equipment", "wall_switch", "valve", "virtual_switch"]), es = (t) => Xv.has(t.props.kind);
function te(t) {
  var n;
  const e = t.props;
  return e.kind === "valve" ? ["close"] : e.kind === "speaker" ? (n = t.bindings) != null && n.voice ? ["say", "play"] : ["play"] : e.kind === "phone" ? e.notify ? ["notify"] : [] : e.kind === "equipment" ? e.controllable === !0 ? ["on", "off"] : [] : e.kind === "ceiling_light" || e.kind === "wall_light" || e.kind === "socket" || e.kind === "exhaust_fan" || e.kind === "virtual_switch" ? ["on", "off"] : [];
}
const ki = (t, e) => Hd(Pa(t), Pa(e));
function Pa(t) {
  if (!t.motionLight || t.motionLight.neighbours === void 0) return t;
  const { neighbours: e, ...n } = t.motionLight;
  return { ...t, motionLight: n };
}
const li = 100, ts = [300, 600], ns = [-0.4, -0.2, 0, 0.2, 0.4], fe = 1;
function Yv(t, e) {
  return t.walls.some((n) => {
    let i;
    try {
      i = ae(t, n);
    } catch {
      return !1;
    }
    const { t: o, side: s } = Xe(i, e);
    return o >= -fe && o <= i.len + fe && s >= -i.rightOff - fe && s <= i.leftOff + fe;
  });
}
const Vt = (t, e) => ut(e, t) && !t.some((n, i) => be(e, n, t[(i + 1) % t.length]) <= fe);
function Qv(t, e) {
  if (t.some((i) => Vt(e, i)) || e.some((i) => Vt(t, i)) || Vt(e, Ms(t)) || Vt(t, Ms(e))) return !0;
  const n = (i, o, s, r) => {
    const l = (a, c, h) => (c.x - a.x) * (h.y - a.y) - (c.y - a.y) * (h.x - a.x);
    return l(s, r, i) * l(s, r, o) < -fe * fe && l(i, o, s) * l(i, o, r) < -fe * fe;
  };
  return t.some((i, o) => e.some((s, r) => n(i, t[(o + 1) % t.length], s, e[(r + 1) % e.length])));
}
function Jv(t, e, n) {
  const i = [];
  for (let o = 0; o < e.length; o++) {
    const s = e[o], r = e[(o + 1) % e.length], l = R(s, r);
    if (l < fe) continue;
    const a = P(r, s);
    for (let c = 0; c < n.length; c++) {
      const h = n[c], f = n[(c + 1) % n.length];
      if (be(h, s, r) > fe && be(f, s, r) > fe && !ar(s, r, h, f)) continue;
      const d = (y) => Math.abs((y.x - s.x) * a.y - (y.y - s.y) * a.x) / l;
      if (d(h) > fe || d(f) > fe) continue;
      const p = G(P(h, s), a) / l, m = G(P(f, s), a) / l, w = Math.max(0, Math.min(p, m)), v = Math.min(l, Math.max(p, m));
      if (v - w <= fe) continue;
      const b = (y) => ({ x: s.x + a.x / l * y, y: s.y + a.y / l * y });
      Yv(t, b(w + (v - w) / 2)) || i.push({ p: b(w), q: b(v) });
    }
  }
  return i;
}
const Ta = (t, e) => Math.abs(Oe(se(t, e)));
function e$(t, e, n) {
  let i = null;
  for (const o of t.zones)
    o.id === e || !Re(se(t, o), n) || (!i || Ta(t, o) < Ta(t, i)) && (i = o);
  return i;
}
function t$(t, e) {
  const n = se(t, e), i = [], o = (s, r) => {
    Re(n, s) || i.push({ pt: s, zone: r });
  };
  for (const s of t.openings) {
    if (s.invalid || s.kind === "window") continue;
    const r = t.walls.find((d) => d.id === s.wallId);
    if (!r) continue;
    let l;
    try {
      l = ae(t, r);
    } catch {
      continue;
    }
    const a = s.offset + s.width / 2, c = { x: l.a.x + l.dir.x * a, y: l.a.y + l.dir.y * a }, h = le(l.dir), f = [
      { near: { x: c.x + h.x * (l.leftOff + li), y: c.y + h.y * (l.leftOff + li) }, sign: -1, farOff: l.rightOff },
      { near: { x: c.x - h.x * (l.rightOff + li), y: c.y - h.y * (l.rightOff + li) }, sign: 1, farOff: l.leftOff }
    ];
    for (const { near: d, sign: p, farOff: m } of f)
      if (Re(n, d))
        for (const w of ns) for (const v of ts) {
          const b = { x: c.x + l.dir.x * w * s.width + h.x * p * (m + v), y: c.y + l.dir.y * w * s.width + h.y * p * (m + v) };
          o(b, e$(t, e.id, b));
        }
  }
  if (n.length < 3) return i;
  for (const s of t.zones) {
    const r = se(t, s);
    if (!(s.id === e.id || r.length < 3)) {
      for (const { p: l, q: a } of Jv(t, n, r)) {
        const c = P(a, l), h = R(l, a), f = { x: -c.y / h, y: c.x / h }, d = { x: (l.x + a.x) / 2 + f.x * 50, y: (l.y + a.y) / 2 + f.y * 50 }, p = Vt(n, d) ? -1 : 1;
        for (let m = 1; m <= ns.length; m++) for (const w of ts) {
          const v = m / (ns.length + 1);
          o({ x: l.x + c.x * v + f.x * p * w, y: l.y + c.y * v + f.y * p * w }, s);
        }
      }
      if (Qv(n, r)) {
        const l = r.map((m) => m.x), a = r.map((m) => m.y), c = Math.min(...l), h = Math.min(...a), f = Math.max(...l), d = Math.max(...a), p = Math.max(200, Math.max(f - c, d - h) / 60);
        for (let m = c + p / 2; m < f; m += p)
          for (let w = h + p / 2; w < d; w += p) {
            const v = { x: m, y: w };
            !Vt(r, v) || Re(n, v) || n.some((b, y) => be(v, b, n[(y + 1) % n.length]) <= ts[1]) && i.push({ pt: v, zone: s });
          }
      }
    }
  }
  return i;
}
const Va = /* @__PURE__ */ new WeakMap();
function n$(t, e) {
  let n = Va.get(t);
  n || Va.set(t, n = /* @__PURE__ */ new Map());
  let i = n.get(e.id);
  if (!i) {
    try {
      i = bu(t, e, fu);
    } catch {
      i = [];
    }
    n.set(e.id, i);
  }
  return i;
}
const i$ = (t, e) => t.reduce((n, i) => ut(e, i) ? !n : n, !1), Ha = /* @__PURE__ */ new WeakMap();
function o$(t, e, n) {
  const i = `${e}|${[...n].sort().join(",")}`;
  let o = Ha.get(t);
  o || Ha.set(t, o = /* @__PURE__ */ new Map());
  const s = o.get(i);
  if (s) return s;
  const r = t.zones.find((a) => a.id === e), l = [];
  if (r) {
    const a = t$(t, r), c = t.devices.filter((h) => h.props.kind === "motion_sensor" && !n.includes(h.id));
    for (const h of [...t.zones, null]) {
      const f = a.filter((p) => {
        var m;
        return (((m = p.zone) == null ? void 0 : m.id) ?? null) === ((h == null ? void 0 : h.id) ?? null);
      });
      if (f.length === 0) continue;
      const d = c.filter((p) => {
        const m = n$(t, p);
        return m.length > 0 && f.some((w) => i$(m, w.pt));
      });
      d.length > 0 && l.push({ zone: h, sensors: d });
    }
  }
  return o.set(i, l), l;
}
function Fd(t, e, n) {
  const i = e === null ? void 0 : t.find((o) => o.zones.some((s) => s.id === e));
  return i ? o$(i, e, n) : [];
}
const s$ = (t) => [...new Set(t.flatMap((e) => e.sensors.map((n) => n.id)))].sort();
function r$(t, e) {
  let n = !1;
  const i = t.map((o) => {
    const s = o.motionLight;
    if (!s) return o;
    const { neighbours: r, ...l } = s, a = s.presence === !0 ? s$(Fd(e, o.zoneId, s.sensors)) : void 0;
    return (a === void 0 ? r === void 0 : r !== void 0 && r.length === a.length && r.every((c, h) => c === a[h])) ? o : (n = !0, { ...o, motionLight: a === void 0 ? l : { ...l, neighbours: a } });
  });
  return n ? i : t;
}
class l$ {
  constructor(e) {
    this.h = e, this.savedRules = [];
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const e = await Zo(this.h.hass);
        if (this.h.plans = e, e.length === 0)
          this.h.save.reset(null), this.savedRules = [], this.adopt(ml(u("plan.default"))), this.offerDraft(this.h.drafts.latest());
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
    const n = await Gg(this.h.hass, e);
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
        this.h.plans = await Zo(this.h.hass);
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
    this.h.toolId = Tr(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.savedRules = [], this.adopt(ml(u("plan.default"))), this.offerDraft(null);
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
            await Xg(this.h.hass, e.id);
          } catch (s) {
            this.h.save.state = "error", this.h.save.errorMessage = Ee(s);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(e.id), this.h.drafts.clearLastPlanId(e.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === e.id && this.offerDraft(null);
        let i = [];
        try {
          i = await Zo(this.h.hass), this.h.plans = i;
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
    this.h.plan = { ...e, levels: e.levels.map(uf) };
    const n = ov({ level: this.h.plan.levels[0], power: this.h.plan.power }), i = rm(n.power, { device: (a) => n.level.devices.find((c) => c.id === a) }), o = new Map(this.h.plan.levels.flatMap((a) => a.devices.map((c) => [c.id, c.props.kind]))), s = (l = e.rules) == null ? void 0 : l.map((a) => Dv(a, (c) => o.get(c))), r = e.rules && s && e.rules.length > 0 ? s.some((a, c) => a !== e.rules[c]) ? s : e.rules : void 0;
    this.h.history = new nv({ level: n.level, ...i ? { power: i } : {}, ...r ? { rules: r } : {} }), this.h.lazyPower = Tu(), this.h.activeTool.cancel(), this.h.activeTool = Ds(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const e = this.h.plan, { level: n, power: i, rules: o } = this.h.history.current, s = e.levels.map((h, f) => f === 0 ? Pd(n) : h), { power: r, rules: l, ...a } = e, c = o ? r$(o, s) : void 0;
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
class a$ {
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
    !n || !Wp(n.states, e) ? this.base = { states: e, meta: Up(e) } : n.states = e;
    const i = this.base.meta, o = this.merged;
    if (o && o.base === i && o.regs === this.regs) return o.meta;
    const s = this.regs ? qp(i, this.regs) : i;
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
    this.pending || !e || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), jp(e).then(
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
const ai = Nc("", "");
function c$(t) {
  return {
    level: () => {
      var e;
      return ((e = t.history) == null ? void 0 : e.current.level) ?? ai;
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
    openingDefaults: (e) => Jw(t.nextObj, e),
    zoneName: () => {
      var e;
      return t.nextObj.zone.name ?? Nd(((e = t.history) == null ? void 0 : e.current.level) ?? ai);
    },
    zoneMethod: () => t.nextObj.zone.method,
    zoneAutomation: () => t.nextObj.zone.automation,
    /** A typed zone name is single-use: the next default is "Zone N" again. */
    zonePlaced: () => {
      t.nextObj = { ...t.nextObj, zone: { ...t.nextObj.zone, name: null } };
    },
    geo: () => {
      var n;
      const e = (((n = t.history) == null ? void 0 : n.current.level) ?? ai).devices;
      return { device: (i) => e.find((o) => o.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const e = t.placeDeviceId;
      return e === null ? null : Uu(((n = t.history) == null ? void 0 : n.current.level) ?? ai, t.power).some((i) => i.id === e) ? e : (t.placeDeviceId = null, null);
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
const Vs = (t) => u(`zones.kind.${t.shape.kind}`), Rr = (t) => g`<svg class="micon" viewBox="0 0 24 24"
  aria-hidden="true">${_`<path d=${t === "walls" ? Pm : Qm}></path>`}</svg>`;
function Ud(t, e) {
  const n = $u(t, e);
  return n ? u(`zones.invalid.${n}`) : null;
}
function u$(t) {
  var o;
  const e = t.query.trim().toLowerCase(), n = ((o = t.selection) == null ? void 0 : o.kind) === "zone" ? t.selection.id : null, i = t.level.zones.map((s, r) => ({ z: s, hue: Nr(r) })).filter(({ z: s }) => !e || s.name.toLowerCase().includes(e) || Vs(s).toLowerCase().includes(e));
  return g`
    <div class="zlist">
      <div class="zhead"><span>${u("zones.list").replace("{n}", String(t.level.zones.length))}</span><span>${u("unit.m2")}</span></div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${u("zones.filter")}
        aria-label=${u("zones.filter")} .value=${Q(t.query)}
        @input=${(s) => t.onQuery(s.target.value)} />
      <div class="rows">
        ${i.map(({ z: s, hue: r }) => {
    var a;
    const l = s.invalid ? Ud(t.level, s) ?? "" : null;
    return g`<button class="zrow${s.id === n ? " sel" : ""}" data-id=${s.id} @click=${() => t.onPick(s.id)}>
            ${l === null ? g`<span class="zswatch" style=${`background:${r}`}></span>` : g`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="name">${s.name}</span>
            <span class="zkind" data-kind=${s.shape.kind} title=${Vs(s)}>${Rr(s.shape.kind)}</span>
            <span class="zarea">${((a = lr(t.level, s)) == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
const Wd = (t, e, n) => g`
  <label class="zcheck"><input type="checkbox" data-field=${t} .checked=${Dr(e)}
    @change=${(i) => n(i.target.checked)} />${u("zones.automation")}</label>`;
function d$(t, e, n) {
  const i = Qe(t, e.id);
  return g`<div class="zmembers">
    <div class="zhead"><span>${u("zones.inside").replace("{n}", String(i.length))}</span>
      ${i.length ? g`<span>${u("zones.participates")}</span>` : $}</div>
    ${i.length === 0 ? g`<p class="muted">${u("zones.noMembers")}</p>` : i.map(({ device: o, participates: s }) => g`
      <label class="member" data-device=${o.id}>
        <span class="nm"><span class="name">${o.name}</span><small class="kind">${u(`device.${o.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${u("zones.participates")} .checked=${Dr(s)}
          @change=${(r) => {
    const l = Cu(t, o.id, e.id, r.target.checked);
    l !== t && n(l);
  }} />
      </label>`)}
  </div>`;
}
function za(t, e, n) {
  const i = Ud(t, e), o = e.shape.kind === "walls" && e.shape.broken;
  return g`<div class="zprops">
    <h4>${u("props.zone")}</h4>
    ${z(u("props.name"), g`<input class="val wide" type="text" data-field="zone-name" .value=${Q(e.name)}
      @change=${(s) => {
    const r = s.target, l = r.value.trim();
    if (!l || l === e.name) {
      r.value = e.name;
      return;
    }
    n(Sp(t, e.id, l));
  }} />`)}
    ${z(u("props.area"), g`<span class="val ro" data-field="zone-area">${yd(lr(t, e))}</span>`)}
    ${z(u("zones.outline"), g`<span class="val ro zkindval" data-field="zone-kind">${Rr(e.shape.kind)}${Vs(e)}</span>`)}
    ${Wd("zone-automation", e.automation !== !1, (s) => {
    const r = fr(t, e.id, s);
    r !== t && n(r);
  })}
    ${i ? g`<div class="warnbox"><p class="warn" data-note="zone-invalid">${i}</p>
      ${o ? g`<button class="btn" data-action="keep-outline" @click=${() => n(Ep(t, e.id))}>
        ${u("zones.keepOutline")}</button>` : $}</div>` : $}
    ${d$(t, e, n)}
    <button class="btn danger" data-action="delete-zone" @click=${() => n(Lu(t, e.id))}>
      ${u("zones.delete")}</button>
  </div>`;
}
function h$(t) {
  const e = t.next.zone, n = e.name ?? Nd(t.level), i = (o) => t.setNext({ ...t.next, zone: { ...e, ...o } });
  return g`
    <h4>${u("props.nextZone")}</h4>
    <div class="muted">${u("zones.method")}</div>
    <div class="mseg" role="radiogroup" aria-label=${u("zones.method")}>
      ${["walls", "polygon"].map((o) => g`
        <button class=${e.method === o ? "on" : ""} role="radio" aria-checked=${String(e.method === o)} data-method=${o}
          @click=${() => {
    o !== e.method && t.onMethod(o);
  }}>${Rr(o)}<span>${u(`zones.kind.${o}`)}</span></button>`)}
    </div>
    <p class="muted hint" data-note="zone-hint">${u(`zones.hint.${e.method}`)}</p>
    ${z(u("props.name"), g`<input class="val wide" type="text" data-field="next-zone-name" .value=${Q(n)}
      @change=${(o) => {
    const s = o.target, r = s.value.trim();
    if (!r) {
      s.value = n;
      return;
    }
    r !== n && i({ name: r });
  }} />`)}
    ${Wd("next-zone-automation", e.automation, (o) => i({ automation: o }))}`;
}
function jd(t, e, n) {
  return Fe({ value: e, rule: { min: 1 }, bad: "props.badWidth", setNotice: t.setNotice, apply: n });
}
function Ra(t, e) {
  return e === t.level ? !1 : (t.commit(e), !0);
}
function f$(t, e) {
  const n = ae(e.level, t).len, i = ["bearing", "partition", "railing", ...t.type === "fence" ? ["fence"] : []], o = (s) => e.commit(Bp(e.level, t.id, s));
  return g`
    <h4>${u("props.wall")}</h4>
    ${z(u("props.type"), ce(
    t.type,
    i.map((s) => ({ v: s, label: u(`walltype.${s}`) })),
    (s) => o({ type: s }),
    "wall-type"
  ))}
    ${z(u("props.thickness"), jd(e, t.thickness, (s) => {
    o({ thickness: s });
  }))}
    ${z(u("props.baseline"), ce(
    t.baseline,
    ["center", "left", "right"].map((s) => ({ v: s, label: u(`baseline.${s}`) })),
    (s) => o({ baseline: s })
  ))}
    ${z(u("props.length"), g`<span class="val ro">${yt(n)} ${u("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => e.commit(br(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function p$(t, e) {
  const n = ["door", "window", "opening", ...Ii.slice(1).includes(t.kind) ? [t.kind] : []], i = (r) => e.commit(qf(e.level, t.id, r)), o = ["left", "right"].map((r) => ({ v: r, label: u(`side.${r}`) })), s = Ii.includes(t.kind);
  return g`
    <h4>${u(`kind.${t.kind}`)}</h4>
    ${z(u("props.kind"), ce(t.kind, n.map((r) => ({ v: r, label: u(`kind.${r}`) })), (r) => i(jf(t, r))))}
    ${z(u("props.width"), jd(e, t.width, (r) => Ra(e, Wf(e.level, t.id, r))))}
    ${z(u("props.offset"), Fe({
    value: t.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: e.setNotice,
    apply: (r) => Ra(e, Jc(e.level, t.id, r))
  }))}
    ${s ? g`
      ${z(u("props.hinge"), ce(
    t.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: u(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${z(u("props.swing"), ce(t.swing ?? "left", o, (r) => i({ swing: r })))}` : $}
    ${t.kind === "window" ? z(u("props.outside"), ce(t.outside ?? "left", o, (r) => i({ outside: r }))) : $}
    ${z(u("props.passesLight"), g`<input type="checkbox" data-field="passesLight" .checked=${Q(Kc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesLight: l === Gc(t.kind) ? void 0 : l });
  }} />`)}
    ${z(u("props.passesPir"), g`<input type="checkbox" data-field="passesPir" .checked=${Q(Yc(t))}
      @change=${(r) => {
    const l = r.target.checked;
    i({ passesPir: l === Xc(t.kind) ? void 0 : l });
  }} />`)}
    ${t.invalid ? g`<p class="warn">${u("props.invalidOpening")}</p>` : $}
    <button class="btn danger" data-action="delete-opening" @click=${() => e.commit(eu(e.level, t.id))}>
      ${u("action.delete")}</button>`;
}
function m$(t) {
  const e = ["bearing", "partition", "railing"];
  return g`
    <h4>${u("props.newWall")}</h4>
    ${z(u("props.type"), g`<select class="val" data-field="new-wall-type"
      @change=${(n) => t.setWallType(n.target.value)}>
      ${e.map((n) => g`<option value=${n} ?selected=${n === t.wallType}>${u(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${z(`${u("props.thickness")}, ${u("unit.mm")}`, Fe({
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
const Ba = (t) => u$({
  level: t.level,
  selection: t.selection,
  query: t.zoneQuery,
  onQuery: t.onZoneQuery,
  onPick: t.onPickZone
});
function g$(t) {
  const { level: e, selection: n } = t;
  if (t.tool === "zone") {
    const o = (n == null ? void 0 : n.kind) === "zone" ? e.zones.find((s) => s.id === n.id) : void 0;
    return g`<div class="props">
      ${h$({ level: e, next: t.next, setNext: t.setNext, onMethod: t.onZoneMethod })}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
      ${o ? za(e, o, t.commit) : $}
      ${Ba(t)}
    </div>`;
  }
  let i = $;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const o = e.walls.find((s) => s.id === n.id);
    o && (i = f$(o, t));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const o = e.openings.find((s) => s.id === n.id);
    o && (i = p$(o, t));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const o = e.zones.find((s) => s.id === n.id);
    o && (i = za(e, o, t.commit));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const o = e.nodes.find((s) => s.id === n.id);
    o && (i = g`<h4>${u("props.node")}</h4>
      ${z("X", g`<span class="val ro">${yt(o.x)}</span>`)}${z("Y", g`<span class="val ro">${yt(o.y)}</span>`)}`);
  }
  return g`
    <div class="props">
      ${i === $ && (t.tool === "wall" || t.tool === "box") ? m$(t) : i === $ && ev(t.tool) ? tv({ tool: t.tool, level: e, next: t.next, setNext: t.setNext, setNotice: t.setNotice }) : i === $ && t.tool === "select" ? Ba(t) : i === $ ? g`<p class="muted">${u("props.none")}</p>` : i}
      ${t.notice ? g`<p class="warn">${t.notice}</p>` : $}
    </div>`;
}
const b$ = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, w$ = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, v$ = 6, $$ = ["A", "0", "B"], y$ = ["power", "control"], x$ = ["power", "power_in", "power_out", "voltage", "control"], Gt = (t) => ({ device: (e) => t.level.devices.find((n) => n.id === e) });
function ln(t, e, n, i) {
  const { [n]: o, ...s } = e, r = i === null ? s : { ...s, [n]: i };
  t.commitPower({ ...t.power, blocks: t.power.blocks.map((l) => l.id === e.id ? r : l) });
}
function an(t, e, n, i, o, s) {
  return g`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${e}>${n}</span></div>
    <ps-entity-combo data-field=${e} .meta=${t.meta} .states=${t.states} .items=${Ar(t.meta, i, !1)}
      .value=${o ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const l = r.detail.value || null;
    l !== (o ?? null) && s(l);
  }}></ps-entity-combo>
  </div>`;
}
function k$(t, e) {
  const n = e.name ?? "";
  return z(u("props.name"), g`<input class="val wide" type="text" data-field="name"
    placeholder=${u(`power.kind.${e.kind}`)} .value=${Q(n)} @change=${(i) => {
    const o = i.target, s = o.value.trim();
    s && s !== n ? t.commitPower(Tn(t.power, e.id, { name: s }, Gt(t))) : o.value = n;
  }} />`);
}
function M$(t, e) {
  const n = new Set(Le(e).map((i) => i.role));
  return g`${y$.filter((i) => n.has(i)).map((i) => {
    var s;
    const o = (s = e.bindings) == null ? void 0 : s[i];
    return g`<div class="role">
      <div class="role-head"><span class="role-label">${u(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${o ? g`<b>${yi(t.meta, o).name}</b><small>${o}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${u("power.boundHint")}</p>`;
}
function ci(t, e, n) {
  return e === t.level ? !1 : (t.commit(e, n), !0);
}
function _$(t, e) {
  var s;
  const n = Le(e), i = x$.flatMap((r) => n.filter((l) => l.role === r)), o = e.props;
  return g`
    ${Or(e, (r) => ci(t, ft(t.level, e.id, {}, r)))}
    ${i.map((r) => {
    var l;
    return g`<div class="role">
      <div class="role-head"><span class="role-label" data-label=${r.role}>${Bi(e, r.role)}</span></div>
      <ps-entity-combo data-field=${r.role} .meta=${t.meta} .states=${t.states} .items=${Ar(t.meta, r, !1)}
        .value=${((l = e.bindings) == null ? void 0 : l[r.role]) ?? null} .label=${Bi(e, r.role)}
        @value-changed=${(a) => {
      a.stopPropagation(), ci(t, so(t.level, e.id, r.role, a.detail.value || null));
    }}></ps-entity-combo>
    </div>`;
  })}
    ${o.kind === "equipment" && ((s = e.bindings) != null && s.control) ? Mt(
    "controllable",
    u("props.controllable"),
    !!o.controllable,
    (r) => ci(t, po(t.level, e.id, r))
  ) : $}
    ${o.kind === "equipment" ? Mt("inverter", u("props.inverter"), !!o.inverter, (r) => {
    const l = Bu(t.level, t.power, e.id, r);
    return ci(t, l.level, l.power);
  }) : $}`;
}
function A$(t, e) {
  const n = t.level.devices.find((o) => o.id === e.deviceId);
  if (!n) return g`<p class="warn" data-note="device-missing">${u("power.missing")}</p>`;
  const i = Yt(n) ? $ : Mt("output", u("power.enableOutput"), e.output !== !1, (o) => {
    const s = Gt(t);
    if (o) {
      const { output: r, ...l } = e;
      t.commitPower({ ...t.power, blocks: t.power.blocks.map((a) => a.id === e.id ? l : a) });
    } else
      t.commitPower($o(Tn(t.power, e.id, { output: !1 }, s), e.deviceId, s));
    return !0;
  });
  return n.props.kind === "equipment" ? g`${_$(t, n)}${i}` : g`
    ${z(u("props.name"), g`<span class="val ro" data-field="device-name">${n.name}</span>`)}
    ${z(u("props.kind"), g`<span class="val ro">${u(`device.${n.props.kind}`)}</span>`)}${M$(t, n)}${i}`;
}
function S$(t, e) {
  var o, s;
  const n = (s = (o = t.frame) == null ? void 0 : o.blocks[e.id]) == null ? void 0 : s.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: u(`power.form.${r}`) }));
  return g`
    ${z(u("power.form"), ce(e.form, i, (r) => {
    r !== e.form && t.commitPower(Tn(t.power, e.id, { form: r }, Gt(t)));
  }, "form"))}
    <div class="row"><span>${u("power.position")}</span><span class="seg pos">${$$.map((r) => g`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => t.setPosition(e.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${u("power.positionHint")}</p>`;
}
function L$(t, e) {
  const n = e.w >= e.h, i = n ? e.w : e.h, o = n ? e.h : e.w, s = (a, c) => {
    if (a === i && c === o) return !1;
    t.commitPower(Tn(t.power, e.id, n ? { w: a, h: c } : { w: c, h: a }, Gt(t)));
  }, r = (a, c, h) => Fe({ value: c, rule: { min: 1 }, bad: "props.badNumber", field: a, skipSame: !0, apply: h }), l = ["h", "v"].map((a) => ({ v: a, label: u(`power.orientation.${a}`) }));
  return g`
    ${z(u("power.orientation"), ce(n ? "h" : "v", l, (a) => {
    a !== (n ? "h" : "v") && t.commitPower(Tn(t.power, e.id, { w: e.h, h: e.w }, Gt(t)));
  }, "bus-orientation"))}
    ${z(u("power.busLength"), r("bus-length", i, (a) => s(Math.max(Os, o + 1, a), o)))}
    ${z(u("power.busThickness"), r("bus-thickness", o, (a) => s(i, Math.min(Math.max(v$, a), i - 1))))}`;
}
function C$(t, e) {
  switch (e.kind) {
    case "grid":
      return g`
      ${an(t, "power", u("power.field.power"), $t, e.power, (n) => ln(t, e, "power", n))}
      ${an(t, "voltage", u("power.field.voltage"), b$, e.voltage, (n) => ln(t, e, "voltage", n))}`;
    case "device":
      return A$(t, e);
    case "battery":
      return g`
      ${an(t, "power", u("power.field.batteryPower"), $t, e.power, (n) => ln(t, e, "power", n))}
      ${an(t, "soc", u("power.field.soc"), w$, e.soc, (n) => ln(t, e, "soc", n))}`;
    case "pv":
      return an(t, "power", u("power.field.power"), $t, e.power, (n) => ln(t, e, "power", n));
    case "transfer":
      return S$(t, e);
    case "bus":
      return L$(t, e);
    default:
      return $;
  }
}
function I$(t, e) {
  const n = !!e.portPins && Object.keys(e.portPins).length > 0, i = e.kind === "device" ? t.level.devices.find((o) => o.id === e.deviceId) : void 0;
  return g`
    <h4>${i ? Lo(i) : u(`power.title.${e.kind}`)}</h4>
    ${e.kind === "device" ? $ : k$(t, e)}
    ${C$(t, e)}
    <div class="pactions">
      ${n ? g`<button class="btn" data-action="auto-ports"
        @click=${() => t.commitPower(tm(t.power, e.id))}>${u("power.autoPorts")}</button>` : $}
      ${e.kind === "grid" ? $ : g`<button class="btn danger" data-action="delete-block"
        @click=${() => t.commitPower(Hu(t.power, e.id))}>${u("action.delete")}</button>`}
    </div>`;
}
function E$(t, e) {
  var o, s;
  const n = Gt(t), i = (r) => {
    const l = t.power.blocks.find((c) => c.id === ("block" in r ? r.block : r.bus)), a = l ? xo(l, n) || u(`power.kind.${l.kind}`) : "—";
    return "block" in r ? `${a} · ${r.port}` : a;
  };
  return g`
    <h4>${u("power.wire")}</h4>
    ${z(u("power.wire.from"), g`<span class="val ro wide" data-field="wire-from">${i(e.from)}</span>`)}
    ${z(u("power.wire.to"), g`<span class="val ro wide" data-field="wire-to">${i(e.to)}</span>`)}
    ${z(u("power.wire.power"), g`<span class="val ro" data-field="wire-power">${_e((s = (o = t.frame) == null ? void 0 : o.wires[e.id]) == null ? void 0 : s.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => t.commitPower(Fu(t.power, e.id))}>${u("action.delete")}</button></div>`;
}
function O$(t) {
  const e = Uu(t.level, t.power);
  return g`
    <div class="pactions"><button class="btn" data-action="new-device" @click=${() => {
    const i = pd(t.level);
    t.commit(i.level), t.onPlaceDevice(i.id);
  }}>${u("devices.new")}</button></div>
    <p class="muted" data-note="power-hint">${u("power.help.device")}</p>
    ${e.length === 0 ? g`<p class="muted" data-note="no-devices">${u("power.noDevices")}</p>` : g`<div class="pdevs">
      ${e.map((i) => g`<button class="pdev${i.id === t.placeDeviceId ? " sel" : ""}" data-place-device=${i.id}
        aria-pressed=${i.id === t.placeDeviceId ? "true" : "false"} @click=${() => t.onPlaceDevice(i.id)}>
        <span class="name">${i.name}</span><span class="kind">${Lo(i)}</span>
      </button>`)}
    </div>`}`;
}
function D$(t) {
  if (t.toolId === "power-device") return O$(t);
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "powerBlock" ? t.power.blocks.find((o) => o.id === e.id) : void 0;
  if (n) return I$(t, n);
  const i = (e == null ? void 0 : e.kind) === "powerWire" ? t.power.wires.find((o) => o.id === e.id) : void 0;
  return i ? E$(t, i) : t.toolId !== "power-select" ? g`<p class="muted" data-note="power-hint">${u("power.help.place")}</p>` : g`<p class="muted" data-note="power-hint">${u("power.pick")}</p><p class="muted">${u("power.help.select")}</p>`;
}
function N$(t) {
  return g`<div class="props pprops">
    ${t.notice ? g`<p class="warn" data-notice="session" role="alert">${t.notice}</p>` : $}
    ${t.feedError ? g`<p class="note" data-notice="feed">${t.feedError}</p>` : $}
    ${D$(t)}
  </div>`;
}
const Fa = /* @__PURE__ */ new Map([
  ["not confirmed", "rules.error.notConfirmed"],
  ["virtual switch loop", "rules.error.virtualLoop"],
  ["device switched back", "rules.error.switchedBack"]
]);
function P$(t) {
  var i;
  const e = t.reason !== void 0 ? Fa.get(t.reason) : void 0, n = ((i = t.last) == null ? void 0 : i.error) !== void 0 ? Fa.get(t.last.error) : void 0;
  return !e && !n ? t : { ...t, ...e ? { reason: u(e) } : {}, ...n && t.last ? { last: { ...t.last, error: u(n) } } : {} };
}
function T$(t) {
  return t.error === u("rules.error.notConfirmed");
}
const qd = "ended: switched elsewhere";
function Kn(t) {
  return t.sent === !1 && /^(kept|already) on by /.test(t.reason);
}
const V$ = {
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
function Zd(t) {
  return V$[t.reason];
}
function Gd(t) {
  return t.sent === !1 && (t.reason === qd || t.reason.startsWith("switched elsewhere"));
}
const Kd = 5e3, Xd = 12;
function Ua(t) {
  t().catch(() => {
  });
}
class H$ {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && Ua(n.unsub));
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
          Ua(o);
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
    this.retries >= Xd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Kd));
  }
  cancelRetry() {
    this.retryTimer !== null && clearTimeout(this.retryTimer), this.retryTimer = null;
  }
  apply(e) {
    const n = Object.entries(e.rules ?? {}).map(([i, o]) => [i, P$(o)]);
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
function $e(t) {
  try {
    return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Br(t, e = !1) {
  const n = e ? Zd(t) : void 0;
  if (n) return u(`motionLight.row.${n}`).replace("{target}", t.target).replace("{s}", t.action).replace("{at}", $e(t.at)).trim();
  if (Kn(t)) return u("rules.last.kept").replace("{target}", t.target).replace("{reason}", t.reason).replace("{at}", $e(t.at)).trim();
  if (t.sent === !1)
    return u(Gd(t) ? "rules.last.elsewhere" : "rules.last.already").replace("{target}", t.target).replace("{s}", t.action).replace("{at}", $e(t.at)).trim();
  const i = xe(t.action) ? `${t.target}: ${u(`rules.did.${t.action}`)} ${$e(t.at)}`.trim() : `${u(`rules.did.${t.action}`)} ${t.target} ${$e(t.at)}`.trim();
  return t.error ? `${i}: ${t.error}` : i;
}
function Fr(t) {
  return Kn(t) ? u("vent.flow.kept").replace("{reason}", t.reason).replace("{at}", $e(t.at)) : u("vent.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", $e(t.at));
}
function z$(t, e, n) {
  return e ? e.status === "error" && e.reason ? `${u("rules.status.error")}: ${e.reason}` : u(`rules.status.${e.status}`) : t.enabled === !1 ? u("rules.status.disabled") : n.live ? u("rules.unsaved") : u("rules.noTrace");
}
function R$(t, e, n) {
  const i = n.trace(t.id), o = (i == null ? void 0 : i.verdict) === !0 ? "true" : (i == null ? void 0 : i.verdict) === !1 ? "false" : "unknown", s = (i == null ? void 0 : i.unknownInputs) ?? 0, r = n.saved(t.id), l = !!r && !ki(r, t);
  return g`
    <div class="rrow" data-id=${t.id}>
      <span class="vdot" data-verdict=${o} role="img" aria-label=${u(`rules.verdict.${o}`)}
        title=${u(`rules.verdict.${o}`)}></span>
      <div class="rbody">
        <span class="rname">${t.name}${e ? g` <span class="orphan">(${u("rules.orphan")})</span>` : $}</span>
        <span class="rstatus ${(i == null ? void 0 : i.status) ?? ""}">${z$(t, i, n)}</span>
        ${l ? g`<span class="runsaved">${u("rules.unsavedChanges")}</span>` : $}
        ${s > 0 ? g`<span class="rwarn">${s === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(s))}</span>` : $}
        ${i != null && i.last ? g`<span class="rlast">${Br(i.last, !!i.motionLight)}</span>` : $}
      </div>
      <div class="ractions">
        <button class="btn" data-action="rule-edit" @click=${() => n.onEdit(t.id)}>${u("rules.edit")}</button>
        <button class="btn" data-action="rule-delete" @click=${() => n.onDelete(t.id)}>${u("rules.delete")}</button>
      </div>
    </div>`;
}
function B$(t) {
  const e = t.selection, n = (e == null ? void 0 : e.kind) === "zone" ? t.level.zones.find((o) => o.id === e.id) ?? null : null, i = av(t.rules, (n == null ? void 0 : n.id) ?? null, (o) => t.level.zones.some((s) => s.id === o));
  return g`
    <div class="rules">
      <h4 class="rules-title">${n ? n.name : u("rules.noZone")}</h4>
      ${t.feedError ? g`<p class="muted">${t.feedError}</p>` : $}
      ${n === null && i.length === 0 && t.rules.length === 0 ? g`<p class="muted">${u("rules.hint")}</p>` : $}
      ${i.length === 0 ? g`<p class="muted rempty">${u("rules.empty")}</p>` : i.map((o) => R$(o, n === null && o.zoneId !== null, t))}
    </div>`;
}
const Yd = {
  condition: Cm,
  leak: td,
  timer: Gm,
  outside: ig,
  vent: Xu,
  boiler: ng,
  timed: Km,
  beurer: Vm,
  control: Yu,
  motionLight: Qu
}, F$ = ["condition", "timer", "control"], U$ = ["vent", "boiler", "leak", "timed", "outside", "motionLight", "beurer"], Hs = (t) => g`<svg class="ticon" viewBox="0 0 24 24" aria-hidden="true">${_`<path d=${t}></path>`}</svg>`;
function W$(t, e, n) {
  return [
    ...F$.map((i) => g`
      <button class="tool" data-template=${i} title=${u(`rules.template.${i}`)} @click=${() => t(i)}>
        ${Hs(Yd[i])}<span class="tlabel">${u(`rules.template.${i}`)}</span></button>`),
    g`
      <button class="tool${e ? " on" : ""}" data-action="automations" title=${u("rules.automations")} aria-haspopup="menu"
        aria-expanded=${e ? "true" : "false"} @click=${(i) => n(i.currentTarget)}>
        ${Hs(Um)}<span class="tlabel">${u("rules.automations")}</span></button>`
  ];
}
function j$(t) {
  var s;
  const e = t.currentTarget, n = [...e.querySelectorAll('[role="menuitem"]')], i = n.indexOf(e.getRootNode().activeElement), o = t.key === "ArrowDown" ? (i + 1) % n.length : t.key === "ArrowUp" ? (i - 1 + n.length) % n.length : t.key === "Home" ? 0 : t.key === "End" ? n.length - 1 : null;
  o !== null && (t.preventDefault(), (s = n[o]) == null || s.focus());
}
function q$(t, e, n) {
  return g`
    <div class="amenu-back" @pointerdown=${n}></div>
    <div class="amenu" role="menu" aria-label=${u("rules.automations")} style=${`left:${t.x}px;top:${t.y}px`} @keydown=${j$}>
      ${U$.map((i) => g`
        <button class="amenu-item" role="menuitem" data-automation=${i} @click=${() => e(i)}>
          ${Hs(Yd[i])}<span>${u(`rules.template.${i}`)}</span></button>`)}
    </div>`;
}
function Z$(t, e) {
  return t.mode === "automation" ? g`<div class="tools">${Ed(t.mode, t.toolId, (n) => t.pickTool(n))}<div class="tool-sep"></div>${W$((n) => t.openRuleDialog(n), t.automationsMenu !== null, (n) => t.toggleAutomationsMenu(n))}</div>` : t.mode !== "binding" ? Uw(t.mode, t.toolId, (n) => t.pickTool(n)) : Yw({
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
function G$(t, e) {
  var i, o;
  const n = t.selection;
  return ob({
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
function K$(t, e) {
  if (t.mode === "binding") return G$(t, e);
  if (t.mode === "automation")
    return g`<div class="props">${B$({
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
    return N$({
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
  return t.mode === "equipment" ? O1({
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
  }) : g$({
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
function X$(t, e) {
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
function Y$(t, e) {
  const n = t === "zone" ? `${u("tool.zone")} · ${u(`zones.kind.${e}`)}` : u(`tool.${t}`);
  return g`<span class="tool-chip">${Id(t)}${n}</span>`;
}
function Q$(t) {
  return g`
    <div class="status">
      ${Y$(t.tool, t.zoneMethod)}
      ${X$(t.tool, t.zoneMethod).map(([e, n]) => g`<span><span class="kbd">${e}</span> ${n}</span>`)}
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
function J$(t, e) {
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
function ey(t, e, n, i) {
  const o = t.walls;
  if (!o || o.length === 0) return null;
  if (e === "wall") {
    const { a, b: c } = o[0], h = Math.hypot(c.x - a.x, c.y - a.y);
    let f = Math.atan2(-(c.y - a.y), c.x - a.x) * 180 / Math.PI;
    return f < 0 && (f += 360), { first: yt(h), second: f.toFixed(1) };
  }
  if (o.length < 2) return null;
  const s = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(o[0].b.x - o[0].a.x, o[0].b.y - o[0].a.y) + s, l = Math.hypot(o[1].b.x - o[1].a.x, o[1].b.y - o[1].a.y) + s;
  return { first: yt(r), second: yt(l) };
}
function ty(t) {
  return Object.entries(t).filter(([, e]) => typeof e == "string").map(([e, n]) => `--ps-${e}:${n}`).join(";");
}
const ny = _c`
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
`, iy = 5e-3, oy = 2, Zi = (t) => Math.max(iy, Math.min(oy, t));
function sy(t, e, n) {
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
function ry(t, e, n) {
  if (t.length === 0) return { x: -1e3, y: -1e3, scale: Zi(Math.min(e, n) / 12e3) };
  const i = t.map((f) => f.x), o = t.map((f) => f.y), s = 1500, r = Math.min(...i) - s, l = Math.max(...i) + s, a = Math.min(...o) - s, c = Math.max(...o) + s, h = Zi(Math.min(e / (l - r), n / (c - a)));
  return { x: (r + l) / 2 - e / h / 2, y: (a + c) / 2 - n / h / 2, scale: h };
}
function ly(t, e, n, i, o) {
  const s = Zi(Math.min(o, e / (t.w + 2 * i), n / (t.h + 2 * i)));
  return { x: t.x + t.w / 2 - e / s / 2, y: t.y + t.h / 2 - n / s / 2, scale: s };
}
function ay(t, e, n) {
  const i = Zi(t.scale * Math.exp(-n * 15e-4));
  return { x: e.x - (e.x - t.x) * t.scale / i, y: e.y - (e.y - t.y) * t.scale / i, scale: i };
}
function cy(t, e, n) {
  return { ...t, x: t.x - e / t.scale, y: t.y - n / t.scale };
}
function Wa(t, e, n, i) {
  const o = n / t.scale, s = i / t.scale;
  return e.x >= t.x && e.x <= t.x + o && e.y >= t.y && e.y <= t.y + s ? t : { ...t, x: e.x - o / 2, y: e.y - s / 2 };
}
function uy(t, e, n, i, o = 1) {
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
const dy = ["Shift", "Control", "Alt", "Meta"], hy = {
  plan: "select",
  equipment: "device-select",
  power: "power-select",
  automation: "zone-pick"
}, fy = new Map(Object.entries(Cd).map(([t, e]) => [`Key${e}`, t]));
function ja(t) {
  const e = t.composedPath()[0];
  return !!e && ["INPUT", "SELECT", "TEXTAREA"].includes(e.tagName);
}
class py {
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
          this.h.view = cy(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      this.h.dialog === null && (n.preventDefault(), this.h.hint.hide(), this.h.view = ay(this.h.view, this.h.toMm(n), n.deltaY));
    }, this.keyDown = (n) => {
      if (this.h.automationsMenu !== null && n.key === "Escape") {
        n.preventDefault(), this.h.closeAutomationsMenu();
        return;
      }
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (ja(n) || !this.h.history) return;
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
      const s = !i && !n.altKey && !n.shiftKey && !this.pointerActive, r = this.h.mode === "plan" && s ? fy.get(n.code) : void 0;
      if (r) {
        n.preventDefault(), r !== this.h.toolId && this.h.pickTool(r), this.h.requestUpdate();
        return;
      }
      let l = this.h.activeTool.key(n.key, { shift: n.shiftKey });
      if (!l && (n.key === "Delete" || n.key === "Backspace") && !n.repeat && (l = this.h.deleteSelection()), !l && n.key === "Escape") {
        const a = hy[this.h.mode];
        a && this.h.toolId !== a ? this.h.pickTool(a) : (this.h.activeTool.cancel(), this.h.selection = null), l = !0;
      }
      l && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || ja(n), o = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const s = this.spacePending;
        this.spacePending = !1, s && !i && (this.h.activeTool.key(" ", o), this.h.requestUpdate());
        return;
      }
      i || !dy.includes(n.key) || (this.h.activeTool.key(n.key, o), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(e) {
    return { pt: this.h.toMm(e), shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey || e.metaKey };
  }
}
function Qd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return new Date(t).toISOString();
  }
}
function my(t) {
  return g`
    <div class="draft-banner" role="status">
      <span>${u("draft.banner").replace("{time}", Qd(t.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${t.onRestore}>${u("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${t.onDiscard}>${u("draft.discard")}</button>
    </div>`;
}
function Dt(t, e, n, i) {
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
function gy(t) {
  var n;
  const e = { action: "cancel", label: u("action.cancel"), onClick: t.close };
  switch ((n = t.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = t.draft;
      return i ? Dt(u("draft.title"), u("draft.text").replace("{time}", Qd(i.savedAt)), [
        { action: "restore", label: u("draft.restore"), primary: !0, onClick: () => t.restore(i) },
        { action: "discard", label: u("draft.discard"), onClick: () => t.discard(i) }
      ]) : $;
    }
    case "new":
      return Dt(u("new.title"), u("new.text"), [
        { action: "new-discard", label: u("new.discard"), primary: !0, onClick: t.startNew },
        { ...e, action: "new-cancel" }
      ]);
    case "delete":
      return Dt(u("delete.title"), u("delete.text").replace("{name}", t.planName), [
        { action: "delete-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDelete },
        { ...e, action: "delete-cancel" }
      ]);
    case "delete-rule":
      return Dt(u("delete.rule.title"), u("delete.rule.text").replace("{name}", t.ruleName), [
        { action: "delete-rule-confirm", label: u("delete.confirm"), primary: !0, onClick: t.confirmDeleteRule },
        { ...e, action: "delete-rule-cancel" }
      ], t.ruleUsers.length > 0 ? u("delete.rule.usedBy").replace("{names}", t.ruleUsers.join(", ")) : null);
    case "switch":
      return Dt(u("switch.title"), u("switch.text"), [
        { action: "switch-discard", label: u("switch.discard"), primary: !0, onClick: t.confirmSwitch },
        { ...e, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = t.dialog.kind === "conflict-again";
      return Dt(u("conflict.title"), u(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: u("conflict.overwrite"), disabled: t.saving, onClick: t.overwrite }],
        { action: "save-as-new", label: u("conflict.saveAsNew"), primary: !0, disabled: t.saving, onClick: t.saveAsNew },
        e
      ], t.message);
    }
    default:
      return $;
  }
}
const cn = "plan_studio.draft.", ui = "plan_studio.lastPlanId";
function by() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function wy(t) {
  const e = t;
  return !!e && typeof e == "object" && typeof e.planId == "string" && typeof e.savedAt == "number" && (e.baseRevision === null || typeof e.baseRevision == "number") && !!e.plan && typeof e.plan == "object" && Array.isArray(e.plan.levels) && e.plan.levels.length > 0;
}
class vy {
  constructor(e = by, n = 500) {
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
      (n = this.storage()) == null || n.setItem(cn + e.planId, JSON.stringify(e));
    } catch {
    }
  }
  read(e) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(cn + e), o = i ? JSON.parse(i) : null;
      return wy(o) && o.planId === e ? o : null;
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
        if (!(o != null && o.startsWith(cn))) continue;
        const s = this.read(o.slice(cn.length));
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
      return ((e = this.storage()) == null ? void 0 : e.getItem(ui)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(e) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(ui, e);
    } catch {
    }
  }
  clearLastPlanId(e) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(ui)) === e && n.removeItem(ui);
    } catch {
    }
  }
  clear(e) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(cn + e);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const Ur = 5e3, Wr = 12;
function qa(t) {
  t().catch(() => {
  });
}
class $y {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && qa(n.unsub));
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
          qa(o);
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
    this.retries >= Wr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Ur));
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
function yy(t, e, n) {
  var o, s, r, l;
  const i = [];
  for (const a of t) {
    if (a.enabled === !1) continue;
    const c = e(a.id);
    if (!c) continue;
    let h = null;
    ((o = a.motionLight) == null ? void 0 : o.light) === n ? ((s = c.motionLight) == null ? void 0 : s.mode) === "auto" && a.motionLight.sensors.length > 0 && (h = c.verdict === !0) : ((r = a.boiler) == null ? void 0 : r.device) === n && ((l = c.boiler) == null ? void 0 : l.mode) === "auto" && (h = c.boiler.phase === "heating"), h !== null && i.push({ text: u(h ? "live.mode.autoOn" : "live.mode.autoOff"), tone: "mode", id: `mode:${a.id}` });
  }
  return i;
}
const xy = 1046, Jd = 1.25, Ct = 480, F = 10, W = 34, eh = (t, e) => t.length > e ? `${t.slice(0, e - 1)}…` : t, th = (t) => Math.floor((t - 20) / 6.6), ky = (t) => Math.floor((t - 20) / 6), we = (t) => t < 60 ? `0:${String(t).padStart(2, "0")}` : _r(t * 1e3), J = (t) => 14 + 18 * t;
function et(t) {
  const e = t.err ? [...t.lines, t.err] : t.lines, n = (i) => e.length === 1 ? t.h / 2 + 5 : 20 + 18 * i;
  return _`
    <g class="fc-blk${t.cls}${t.focused ? " hl" : ""}" data-block=${t.field} transform=${`translate(${t.x} ${t.y})`}
      @click=${t.onClick}>
      <title>${t.tip ?? e.join(`
`)}</title>
      <rect class="fc-box" width=${t.w} height=${t.h} rx="8"></rect>
      <svg class="fc-clip" width=${t.w - 8} height=${t.h}>
        ${e.map((i, o) => _`<text class=${o === 0 ? "fc-t1" : o === t.lines.length ? "fc-err" : "fc-t2"} x="10" y=${n(o)}>${eh(i, o === 0 ? th(t.w) : ky(t.w))}</text>`)}
      </svg>
    </g>`;
}
function Gi(t) {
  return t === "gate" ? "combine" : t === "gate-input" ? "gate-input" : t === "delays" ? "delays" : "input" in t ? `input-${t.input}` : `action-${t.action}-${t.index}`;
}
const me = xy, Ce = me / 2, at = 230, Mi = 26, Ae = 4, Za = 36, He = J(2), My = (me - Ae * at - (Ae - 1) * Mi) / 2, Ga = 200, gt = 330, nh = 40, ot = 460, yn = 8, ih = 24, zs = (me - gt * 2 - nh) / 2, Ka = zs + gt + nh;
function Xn(t) {
  if (!Number.isFinite(t)) return "?";
  const e = Math.round(t);
  if (e < 60) return `${e} ${u("rules.unit.s")}`;
  const n = Math.floor(e / 3600), i = Math.round(e % 3600 / 60);
  return n === 0 ? `${i} ${u("rules.unit.min")}` : i === 0 ? `${n} ${u("rules.unit.h")}` : `${n} ${u("rules.unit.h")} ${i} ${u("rules.unit.min")}`;
}
const jr = (t, e) => we(Math.max(1, Math.ceil((t - e) / 1e3)));
function qr(t, e = !1) {
  return "light" in t ? `${u("rules.light.below").toLowerCase()} ${t.below} lx (+${t.hysteresis})` : "daylight" in t ? u(`rules.daylight.is.${t.is}`) : "sun" in t ? u(e ? "rules.sun.above" : "rules.sun.below") : "time" in t ? `${t.time.from}-${t.time.to}` : "held" in t ? `${u(`rules.held.${t.held.state}`)} ${Xn(t.held.seconds)}` : "rule" in t ? u("rules.src.rule") : u("rules.src.device");
}
const Xa = (t) => Number.isFinite(t) ? String(t) : "?";
function _y(t, e) {
  return e.length === 0 ? null : t === "all" ? e.includes(!1) ? !1 : e.includes(null) ? null : !0 : e.includes(!0) ? !0 : e.some((n) => n !== null) ? !1 : null;
}
function oh(t, e, n) {
  return "daylight" in n ? sh(t, e) : t.until !== void 0 && t.until > e && t.value !== !0 ? u("rules.flow.trueIn").replace("{t}", jr(t.until, e)) : t.detail;
}
const sh = (t, e) => t.until === void 0 ? t.detail : t.detail.replace(/ in [\d:]+\)$/, ` in ${jr(t.until, e)})`), ie = (t) => u(`rules.val.${t === null ? "unknown" : t}`), j = (t) => t === !0 ? " on" : t === !1 ? " off" : " nodata";
function Ay(t) {
  if (t <= Ae) {
    const i = (me - t * at - (t - 1) * Mi) / 2;
    return Array.from({ length: t }, (o, s) => i + s * (at + Mi));
  }
  const e = t - Math.floor((t - 1) / Ae) * Ae, n = Math.floor((Ae - e) / 2);
  return Array.from({ length: t }, (i, o) => {
    const s = o % Ae;
    return My + (o >= t - e ? n + s : s) * (at + Mi);
  });
}
function rh(t, e, n, i) {
  const o = n ? "daylight" in t.source && n.value !== null ? `${u(n.value ? "rules.flow.open" : "rules.flow.closed")}, ${sh(n, i)}` : n.value === !0 ? u("rules.flow.open") : n.value === null ? `${u("rules.flow.closed")}, ${u("rules.val.unknown")}` : n.until !== void 0 && n.until > i ? `${u("rules.flow.closed")}, ${u("rules.flow.opensIn").replace("{t}", jr(n.until, i))}` : `${u("rules.flow.closed")}${n.detail ? `, ${n.detail}` : ""}` : qr(t.source);
  return [`${u("rules.flow.gate")}: ${t.not ? "NOT " : ""}${e}`, o];
}
function lh(t, e) {
  const n = Math.ceil(t / Ae), i = Ay(t), o = (a) => F + a * (e + Za), s = (a) => o(Math.floor(a / Ae)), r = (a) => o(a) + e + (a === n - 1 ? W : Za) / 2, l = [];
  i.forEach((a, c) => l.push(`M${a + at / 2} ${s(c) + e} V${r(Math.floor(c / Ae))}`));
  for (let a = 0; a < n; a++) {
    const c = [Ce, ...i.slice(a * Ae, (a + 1) * Ae).map((h) => h + at / 2)];
    Math.max(...c) > Math.min(...c) && l.push(`M${Math.min(...c)} ${r(a)} H${Math.max(...c)}`);
  }
  return { xs: i, inY: s, busY: r, bottom: t === 0 ? F - W : o(n - 1) + e, links: l };
}
function Sy(t) {
  const { rule: e, trace: n } = t, i = n && n.inputs.length === e.inputs.length ? n.inputs : null, o = e.inputs.map((D, H) => {
    const q = (i == null ? void 0 : i[H].value) ?? null;
    return q === null || !D.not ? q : !q;
  }), s = i ? _y(e.combine, o) : void 0, r = n ? n.verdict : void 0, l = n == null ? void 0 : n.pending, a = l ? Math.max(0, Math.ceil((l.at - t.now) / 1e3)) : 0, c = (n == null ? void 0 : n.unknownInputs) ?? 0, h = e.gate ? n == null ? void 0 : n.gate : void 0, f = e.gate ? rh(e.gate, t.inputName(e.gate), h, t.now) : [], d = u("rules.flow.delay").replace("{on}", Xa(e.onDelay)).replace("{off}", Xa(e.offDelay)), p = n === void 0 ? d : `${ie(r ?? null)}${l ? `, ${u("rules.flow.pending").replace("{to}", ie(l.to)).replace("{t}", we(a))}` : ""}`, m = e.inputs.length, w = lh(m, He), { xs: v, inY: b } = w, y = m === 0 ? F : w.bottom + W, x = y + He + W, M = x + He + W, k = (e.gate ? M : x) + He, S = k + W / 2, C = k + W, A = C + ih, N = Math.max(1, e.onTrue.length, e.onFalse.length), U = A + N * (He + yn) - yn + F, I = [
    { side: "true", x: zs, list: e.onTrue, head: u("rules.whenTrue") },
    { side: "false", x: Ka, list: e.onFalse, head: u("rules.whenFalse") }
  ], O = [...w.links];
  m > 0 && O.push(`M${Ce} ${w.busY(0)} V${y}`), O.push(`M${Ce} ${y + He} V${x}`), e.gate && O.push(`M${Ce} ${x + He} V${M}`), O.push(`M${Ce} ${k} V${S} H${zs + gt / 2} V${C}`, `M${Ce} ${S} H${Ka + gt / 2} V${C}`);
  const E = (D) => et({ ...D, h: He, focused: t.focused === D.field, onClick: () => t.onFocus(D.target) });
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${me * Jd}px`} viewBox=${`0 0 ${me} ${U}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("rules.flow.title")}>
        ${O.map((D) => _`<path class="fc-link" d=${D}></path>`)}
        ${e.inputs.map((D, H) => {
    const q = i == null ? void 0 : i[H];
    return E({
      x: v[H],
      y: b(H),
      w: at,
      field: `input-${H}`,
      target: { input: H },
      cls: q ? j(q.value) : "",
      lines: [`${D.not ? "NOT " : ""}${t.inputName(D)}`, q ? oh(q, t.now, D.source) : qr(D.source, D.not === !0)]
    });
  })}
        ${E({
    x: (me - Ga) / 2,
    y,
    w: Ga,
    field: "combine",
    target: "gate",
    cls: s === void 0 ? "" : j(s),
    lines: [e.combine === "all" ? "ALL" : "ANY", ...s === void 0 ? [] : [ie(s)]]
  })}
        ${E({
    x: (me - ot) / 2,
    y: x,
    w: ot,
    field: "delays",
    target: "delays",
    cls: r === void 0 ? "" : j(r ?? null),
    lines: [u("rules.flow.result"), p]
  })}
        ${e.gate ? E({
    x: (me - ot) / 2,
    y: M,
    w: ot,
    field: "gate-input",
    target: "gate-input",
    cls: h ? j(h.value) : "",
    lines: f
  }) : $}
        ${I.map((D) => _`
          <text class="fc-head" text-anchor="middle" x=${D.x + gt / 2} y=${C + 14}>${D.head}</text>
          ${D.list.length === 0 ? _`<text class="fc-t2" text-anchor="middle" x=${D.x + gt / 2} y=${A + He / 2 + 4}>${u("rules.noActions")}</text>` : D.list.map((H, q) => E({
    x: D.x,
    y: A + q * (He + yn),
    w: gt,
    field: `action-${D.side}-${q}`,
    target: { action: D.side, index: q },
    cls: "",
    lines: [t.actionName(H.device), xe(H.do) ? `${Ya(H.do)}: ${(H.do === "play" ? H.media : H.text) ?? ""}` : Ya(H.do)]
  }))}`)}
      </svg>
      ${c > 0 ? g`<p class="fc-warn">${c === 1 ? u("rules.unknown1") : u("rules.unknownN").replace("{n}", String(c))}</p>` : $}
      ${n != null && n.held ? g`<p class="fc-warn" data-note="held">${u("rules.flow.heldNote")}</p>` : $}
      ${n != null && n.last ? g`<p class="fc-last">${u("rules.flow.last")} ${Br(n.last)}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const Ya = (t) => u(`rules.act.${t}`), Qa = { s: 1, min: 60, h: 3600 }, Ly = ["s", "min", "h"];
function Cy(t) {
  return Number.isInteger(t) && t > 0 && t % 3600 === 0 ? "h" : Number.isInteger(t) && t > 0 && t % 60 === 0 ? "min" : "s";
}
const Ki = (t) => Number.isFinite(t) ? String(t) : "";
function Ja(t) {
  return t.trim() === "" ? NaN : Number(t);
}
const Rs = (t, e) => {
  var n;
  return "device" in e ? ((n = t.deviceById(e.device)) == null ? void 0 : n.name) ?? u("rules.missingDevice") : t.ruleName(e.rule) ?? u("rules.missingRule");
};
function Zr(t, e) {
  var i, o;
  const n = e.source;
  return "device" in n || "rule" in n ? Rs(t, n) : "light" in n ? ((i = t.deviceById(n.light)) == null ? void 0 : i.name) ?? u("rules.light.noSensor") : "daylight" in n ? ((o = t.deviceById(n.daylight)) == null ? void 0 : o.name) ?? u("rules.light.noSensor") : "sun" in n ? u("rules.src.sun") : "time" in n ? u("rules.src.time") : n.held.sources.length === 0 ? u("rules.src.held") : `${u("rules.src.held")}: ${n.held.sources.map((s) => Rs(t, s)).join(", ")}`;
}
const Bs = (t, e) => "device" in e ? !t.deviceById(e.device) : t.ruleName(e.rule) === void 0;
function Iy(t, e) {
  return "device" in e || "rule" in e ? Bs(t, e) : "light" in e ? e.light !== "" && !t.deviceById(e.light) : "daylight" in e ? e.daylight !== "" && !t.deviceById(e.daylight) : "held" in e ? e.held.sources.some((n) => Bs(t, n)) : !1;
}
function ah(t, e) {
  var n;
  return e.startsWith("r:") ? { rule: e.slice(2) } : e.startsWith("d:") ? { device: e.slice(2) } : e === "daylight" ? { daylight: ((n = t.lightSensors[0]) == null ? void 0 : n.id) ?? "", is: "night" } : e === "sun" ? { sun: !0 } : e === "time" ? { time: { from: "17:00", to: "01:00" } } : e === "held" ? { held: { sources: [], state: "any", seconds: 1800 } } : null;
}
function ch(t) {
  return g`
    <optgroup label=${u("rules.groupDevices")}>
      ${t.inputDevices.map((e) => g`<option value=${`d:${e.id}`}>${e.name}</option>`)}
    </optgroup>
    ${t.otherRules.length > 0 ? g`<optgroup label=${u("rules.groupRules")}>
      ${t.otherRules.map((e) => g`<option value=${`r:${e.id}`}>${e.name}</option>`)}
    </optgroup>` : $}`;
}
function Gr(t, e, n) {
  return g`
    <option value="">${e}</option>
    ${ch(t)}
    <optgroup label=${u("rules.groupConditions")}>
      ${["daylight", "sun", "time", "held"].map((i) => g`<option value=${i}>${u(`rules.src.${i}`)}</option>`)}
    </optgroup>
    ${n ?? $}`;
}
const uh = { say: { need: "text" }, play: { need: "media" }, notify: { need: "text", opt: "title" } };
function Fs(t, e, n = t.device) {
  const i = { device: n, do: e };
  if (!xe(e)) return i;
  const o = uh[e];
  return i[o.need] = t[o.need] ?? "", o.opt && t[o.opt] !== void 0 && (i[o.opt] = t[o.opt]), i;
}
function xn(t, e, n) {
  const i = t.actionsFor(e);
  if (!t.unique) return i;
  const o = t.list.filter((s, r) => r !== n && s.device === e.id).map((s) => s.do);
  return i.some(xe) ? i.filter((s) => !o.includes(s)) : o.length > 0 ? [] : i;
}
function Ey(t, e, n, i) {
  var d;
  const o = e.list, s = t.deviceById(i.device), r = s ? xn(e, s, n) : [], l = r.includes(i.do) ? r : [...r, i.do], a = e.unique ? t.actionDevices.filter((p) => p.id === i.device || xn(e, p, n).length > 0) : t.actionDevices, c = xe(i.do) ? uh[i.do] : void 0, h = (p, m) => {
    e.set(o.map((w, v) => {
      if (v !== n) return w;
      const { [p]: b, ...y } = w;
      return p === "title" && m === "" ? y : { ...y, [p]: m };
    }));
  }, f = (p) => g`
    <input class="grow" type="text" data-part=${p} placeholder=${u(`rules.field.${p}`)} .value=${i[p] ?? ""}
      @input=${(m) => h(p, m.target.value)} />`;
  return g`
    <div class="rline" data-field=${e.field(n)} tabindex="-1">
      <select class="grow" data-part="device" data-value=${i.device}
        @change=${(p) => {
    const m = t.deviceById(p.target.value);
    if (!m) return;
    const w = xn(e, m, n), v = e.firstDo(m), b = w.includes(i.do) ? i.do : w.includes(v) ? v : w[0];
    b !== void 0 && e.set(o.map((y, x) => x === n ? Fs(y, b, m.id) : y));
  }}>
        ${s && !t.actionDevices.includes(s) ? g`<option value=${s.id}>${s.name}</option>` : $}
        ${s ? $ : g`<option value=${i.device}>${u("rules.missingDevice")}</option>`}
        ${a.map((p) => g`<option value=${p.id}>${p.name}</option>`)}
      </select>
      <select data-part="do" data-value=${i.do}
        @change=${(p) => e.set(o.map((m, w) => w === n ? Fs(m, p.target.value) : m))}>
        ${l.map((p) => g`<option value=${p}>${e.doText(p)}</option>`)}
      </select>
      <button class="btn" data-action="remove-action" title=${u("rules.remove")} @click=${() => e.set(o.filter((p, m) => m !== n))}>&times;</button>
      ${c ? g`<div class="rparams">${f(c.need)}${c.opt ? f(c.opt) : $}</div>` : $}
      ${(s == null ? void 0 : s.props.kind) === "speaker" && !((d = s.bindings) != null && d.voice) ? g`<p class="muted" data-note="no-voice">${u("rules.announce.noVoice")}</p>` : $}
    </div>`;
}
function dh(t, e) {
  const n = e.unique ? t.actionDevices.filter((i) => xn(e, i).length > 0) : t.actionDevices;
  return g`
    <div class="rgroup">
      <div class="rlabel">${e.label}</div>
      ${e.list.map((i, o) => Ey(t, e, o, i))}
      <select class="radd" data-action=${e.add} data-field=${e.addField ?? $} .value=${""}
        @change=${(i) => {
    const o = i.target, s = t.deviceById(o.value);
    if (o.value = "", !s || e.actionsFor(s).length === 0) return;
    const r = xn(e, s), l = e.firstDo(s), a = r.includes(l) ? l : r[0];
    a !== void 0 && e.set([...e.list, Fs({ device: s.id, do: a }, a)]);
  }}>
        <option value="">${e.addText}</option>
        ${n.map((i) => g`<option value=${i.id}>${i.name}</option>`)}
      </select>
    </div>`;
}
function ec(t, e) {
  const n = t.draft.rule, i = e === "true" ? "onTrue" : "onFalse";
  return dh(t, {
    label: u(e === "true" ? "rules.whenTrue" : "rules.whenFalse"),
    addText: u("rules.addAction"),
    add: `add-action-${e}`,
    field: (o) => Gi({ action: e, index: o }),
    list: n[i],
    set: (o) => t.onChange({ ...n, [i]: o }),
    actionsFor: te,
    firstDo: (o) => te(o)[0],
    doText: (o) => u(`rules.act.${o}`)
  });
}
const is = (t) => t.trim() === "" ? NaN : Number(t);
function tc(t, e, n, i) {
  var o;
  return g`<select data-part=${e} data-value=${n} @change=${(s) => i(s.target.value)}>
    ${t.lightSensors.some((s) => s.id === n) ? $ : g`<option value=${n}>${((o = t.deviceById(n)) == null ? void 0 : o.name) ?? u("rules.light.noSensor")}</option>`}
    ${t.lightSensors.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
  </select>`;
}
const Oy = ["night", "dark", "day"];
function Dy(t, e, n, i) {
  var o;
  if ("daylight" in n)
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.daylight.sensor")} ${tc(t, "daylight", n.daylight, (s) => i({ ...n, daylight: s }))}</label>
        <select data-part="is" data-value=${n.is}
          @change=${(s) => i({ ...n, is: s.target.value })}>
          ${Oy.map((s) => g`<option value=${s}>${u(`rules.daylight.is.${s}`)}</option>`)}
        </select>
      </div>`;
  if ("light" in n) {
    const s = n.light === "" ? void 0 : t.lightUnit(n.light);
    return g`
      <div class="rparams">
        <label class="grow">${u("rules.light.sensor")}
          ${tc(t, "light", n.light, (r) => i({ ...n, light: r }))}</label>
        <label>${u("rules.light.below")}
          <input class="num" data-part="below" type="number" min="0" step="any" .value=${Ki(n.below)}
            @input=${(r) => i({ ...n, below: is(r.target.value) })} /> lx</label>
        <label>${u("rules.light.hysteresis")}
          <input class="num" data-part="hysteresis" type="number" min="0" step="any" .value=${Ki(n.hysteresis)}
            @input=${(r) => i({ ...n, hysteresis: is(r.target.value) })} /> lx</label>
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
    const s = n.held, r = ((o = t.draft.units) == null ? void 0 : o[e]) ?? Cy(s.seconds), l = Number.isFinite(s.seconds) ? String(+(s.seconds / Qa[r]).toFixed(4)) : "", a = (c) => i({ held: { ...s, ...c } });
    return g`
      <div class="rparams">
        <div class="rsources">
          ${s.sources.length === 0 ? g`<span class="muted">${u("rules.held.noSources")}</span>` : $}
          ${s.sources.map((c, h) => g`
            <span class="rchip${Bs(t, c) ? " bad" : ""}" data-part="source">${Rs(t, c)}
              <button class="btn" data-action="remove-source" title=${u("rules.held.removeSource")}
                @click=${() => a({ sources: s.sources.filter((f, d) => d !== h) })}>&times;</button></span>`)}
          <select class="radd" data-part="add-source" .value=${""}
            @change=${(c) => {
      const h = c.target, f = ah(t, h.value);
      h.value = "", f && ("device" in f || "rule" in f) && a({ sources: [...s.sources, f] });
    }}>
            <option value="">${u("rules.held.addSource")}</option>
            ${ch(t)}
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
      var h;
      ((h = t.draft.units) == null ? void 0 : h[e]) === void 0 && t.onUnit(e, r), a({ seconds: Math.round(is(c.target.value) * Qa[r]) });
    }} />
          <select data-part="unit" data-value=${r} @change=${(c) => t.onUnit(e, c.target.value)}>
            ${Ly.map((c) => g`<option value=${c}>${u(`rules.unit.${c}`)}</option>`)}
          </select></label>
      </div>`;
  }
  return $;
}
function Kr(t, e, n, i, o) {
  const s = e.source, r = !("device" in s || "rule" in s), l = "light" in s ? "light" : "daylight" in s ? "daylight" : "sun" in s ? "sun" : "time" in s ? "time" : "held";
  return g`
    <div class="rline${Iy(t, s) ? " bad" : ""}" data-field=${n} tabindex="-1">
      <span class="grow">${r ? u(`rules.src.${l}`) : Zr(t, e)}${"sun" in s ? g` <span class="muted">${e.not ? u("rules.sun.above") : qr(s)}</span>` : $}</span>
      ${o ?? $}
      ${"daylight" in s && !e.not ? $ : g`<label class="rnot"><input type="checkbox" data-part="not" .checked=${e.not === !0}
        @change=${(a) => {
    const c = a.target.checked, { not: h, ...f } = e;
    i(c ? { ...f, not: !0 } : f);
  }} /> ${u("rules.not")}</label>`}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
      ${Dy(t, n, s, (a) => i({ ...e, source: a }))}
    </div>`;
}
const Xr = (t, e) => (n) => {
  const i = n.target, o = i.value ? ah(t, i.value) : null;
  i.value = "", o && e(o);
};
function hh(t, e, n, i = u("rules.gate.hint")) {
  const o = t.draft.rule, s = (r) => {
    const { gate: l, ...a } = o;
    t.onChange(r ? { ...a, gate: r } : a);
  };
  return g`
      <div class="rgroup">
        <div class="rlabel">${e}</div>
        <p class="muted">${i}</p>
        ${o.gate ? Kr(t, o.gate, n, s) : g`<select class="radd" data-action="set-gate" .value=${""} @change=${Xr(t, (r) => s({ source: r }))}>
            ${Gr(t, u("rules.gate.set"))}
          </select>`}
      </div>`;
}
function fh(t) {
  const e = t.draft.rule;
  return g`
      <label class="rlabel" for="rule-name">${u("rules.name")}</label>
      <input id="rule-name" data-field="name" type="text" .value=${e.name} placeholder=${u("rules.namePlaceholder")}
        @input=${(n) => t.onChange({ ...e, name: n.target.value })} />`;
}
function Ny(t) {
  const e = t.draft.rule;
  return g`
    <div class="rsettings">
      ${fh(t)}

      <label class="rlabel" for="rule-combine">${u("rules.combine")}</label>
      <select id="rule-combine" data-field="combine" data-value=${e.combine}
        @change=${(n) => t.onChange({ ...e, combine: n.target.value === "all" ? "all" : "any" })}>
        <option value="any">${u("rules.combine.any")}</option>
        <option value="all">${u("rules.combine.all")}</option>
      </select>

      <div class="rgroup">
        <div class="rlabel">${u("rules.inputs")}</div>
        ${e.inputs.length === 0 ? g`<p class="muted">${u("rules.noInputs")}</p>` : e.inputs.map((n, i) => Kr(
    t,
    n,
    Gi({ input: i }),
    (o) => t.onChange({ ...e, inputs: o ? e.inputs.map((s, r) => r === i ? o : s) : e.inputs.filter((s, r) => r !== i) })
  ))}
        <select class="radd" data-action="add-input" .value=${""} @change=${Xr(t, (n) => t.onChange({ ...e, inputs: [...e.inputs, { source: n }] }))}>
          ${Gr(t, u("rules.addInput"))}
        </select>
      </div>

      <div class="rgroup" data-field="delays" tabindex="-1">
        <div class="rlabel">${u("rules.delays")}</div>
        <div class="rline">
          <label class="grow">${u("rules.onDelay")}
            <input class="num" data-part="on-delay" type="number" min="0" max=${Wi} step="1" .value=${Ki(e.onDelay)}
              @input=${(n) => t.onChange({ ...e, onDelay: Ja(n.target.value) })} /></label>
          <label class="grow">${u("rules.offDelay")}
            <input class="num" data-part="off-delay" type="number" min="0" max=${Wi} step="1" .value=${Ki(e.offDelay)}
              @input=${(n) => t.onChange({ ...e, offDelay: Ja(n.target.value) })} /></label>
        </div>
      </div>

      ${hh(t, u("rules.gate"), Gi("gate-input"))}

      ${ec(t, "true")}
      ${ec(t, "false")}
    </div>`;
}
function Py(t) {
  const e = t.draft.rule, n = (i) => t.onFocus(Gi(i));
  return ph({
    title: u(t.draft.isNew ? "rules.dialog.new" : "rules.dialog.edit"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: t.problems.map((i) => ({ key: i, text: u(`rules.problem.${i}`) })),
    form: Ny(t),
    diagram: Sy({
      rule: e,
      inputName: (i) => Zr(t, i),
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
function ph(t) {
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
const Kt = Ct, Yr = 20, Ht = Kt - 2 * F, kn = (Ht - Yr) / 2, Us = (Kt - kn * 2 - Yr) / 2, nc = Us + kn + Yr, os = (Kt - Ht) / 2, ss = Kt / 2, rs = (t) => (Math.round(t * 10) / 10 || 0).toFixed(1), ic = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?", Ty = (t) => `${t > 0 ? "+" : ""}${t} %`, un = (t, e) => et({ ...e, focused: t.focused === e.field, onClick: () => t.onFocus(e.field) });
function oc(t, e, n) {
  if (!n) return [t, e];
  const i = [n.t !== null ? `${rs(n.t)} °C` : "", n.rh !== null ? `${rs(n.rh)} %` : ""].filter(Boolean).join(" ");
  return n.why ? i ? [t, n.why, i] : [t, n.why] : [t, i || "—", n.ah !== null ? `${rs(n.ah)} g/m³` : "—"];
}
function Vy(t) {
  var D, H, q;
  const e = t.rule, n = e.vent, i = t.trace, o = i == null ? void 0 : i.inputs[0], s = o == null ? void 0 : o.vent, r = t.deviceName(n.sensor), l = t.deviceName(n.than), a = ((D = e.onTrue[0]) == null ? void 0 : D.device) ?? "", c = oc(r, u("vent.sensor"), s == null ? void 0 : s.a), h = oc(l, u("vent.than"), s == null ? void 0 : s.b), f = J(Math.max(c.length, h.length)), d = u("vent.flow.vs").replace("{a}", r).replace("{b}", l), p = s ? `: ${s.pct === null ? ie(null) : Ty(s.pct)}` : o ? `: ${o.detail}` : "", m = s ? `${eh(d, th(Ht) - p.length)}${p}` : `${d}${p}`, w = u("vent.flow.margins").replace("{above}", ic(n.above)).replace("{below}", ic(n.below)), v = i == null ? void 0 : i.pending, b = v ? Math.max(0, Math.ceil((v.at - t.now) / 1e3)) : 0, y = u("vent.flow.runon").replace("{t}", Xn(e.offDelay)), x = [
    i ? `${u("rules.flow.result")}: ${ie(i.verdict)}` : u("rules.flow.result"),
    v ? `${y} (${u("vent.pending").replace("{to}", v.to ? "on" : "off").replace("{t}", we(b))})` : y
  ], M = i == null ? void 0 : i.last, k = [
    t.deviceName(a),
    `${((H = e.onTrue[0]) == null ? void 0 : H.do) ?? "?"} / ${((q = e.onFalse[0]) == null ? void 0 : q.do) ?? "?"}`,
    ...M ? [Fr(M)] : []
  ], S = M == null ? void 0 : M.error, C = J(k.length + (S ? 1 : 0)), A = F + f + W, N = A + J(2) + W, U = N + J(2) + W, I = U + C + F, O = (V) => _`<path class="fc-link" d=${`M${V + kn / 2} ${F + f} V${A - W / 2} H${ss} V${A}`}></path>`, E = i && i.status !== "ok" ? i.status === "error" && i.reason ? `${u("rules.status.error")}: ${i.reason}` : u(`rules.status.${i.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Kt}px`} viewBox=${`0 0 ${Kt} ${I}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("vent.flow.title")}>
        ${O(Us)}${O(nc)}
        <path class="fc-link" d=${`M${ss} ${A + J(2)} V${N} M${ss} ${N + J(2)} V${U}`}></path>
        ${un(t, { x: Us, y: F, w: kn, h: f, field: "vent-sensor", cls: s != null && s.a.why ? " nodata" : "", lines: c })}
        ${un(t, { x: nc, y: F, w: kn, h: f, field: "vent-than", cls: s != null && s.b.why ? " nodata" : "", lines: h })}
        ${un(t, { x: os, y: A, w: Ht, h: J(2), field: "vent-above", cls: o ? j(o.value) : "", lines: [m, w], tip: `${d}${p}
${w}` })}
        ${un(t, { x: os, y: N, w: Ht, h: J(2), field: "vent-runon", cls: i ? j(i.verdict) : "", lines: x })}
        ${un(t, { x: os, y: U, w: Ht, h: C, field: "vent-fan", cls: "", lines: k, err: S })}
      </svg>
      ${E ? g`<p class="fc-warn" data-note="status">${E}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function It(t) {
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
const ls = (t) => t.trim() === "" ? NaN : Number(t), as = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function cs(t, e, n, i, o) {
  var r;
  const s = n === "" || i.some((l) => l.id === n);
  return g`
    <select data-field=${e} data-value=${n} @change=${(l) => o(l.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? $ : g`<option value=${n}>${((r = t.deviceById(n)) == null ? void 0 : r.name) ?? u("rules.missingDevice")}</option>`}
      ${i.map((l) => g`<option value=${l.id}>${l.name}</option>`)}
    </select>`;
}
function Hy(t) {
  var r, l, a;
  const e = t.draft.rule, n = e.vent, i = [];
  n.sensor || i.push({ key: "pick-sensor", text: u("vent.problem.sensor") }), n.than || i.push({ key: "pick-than", text: u("vent.problem.than") }), (r = e.onTrue[0]) != null && r.device || i.push({ key: "pick-fan", text: u("vent.problem.fan") });
  const o = [...i], s = [n.sensor, n.than, (l = e.onTrue[0]) == null ? void 0 : l.device, (a = e.onFalse[0]) == null ? void 0 : a.device].filter((c) => !!c);
  for (const c of t.problems)
    c === "device-missing" && !s.some((h) => !t.deviceById(h)) && !(n.sensor && !t.climateSensors.some((h) => h.id === n.sensor)) && !(n.than && !t.climateSensors.some((h) => h.id === n.than)) || c === "vent" && i.length > 0 || o.push({ key: c, text: u(c === "delay" ? "vent.problem.runon" : `rules.problem.${c}`) });
  return o;
}
function zy(t) {
  var s;
  const e = t.draft.rule, n = e.vent, i = (r) => t.onChange({ ...e, vent: { ...n, ...r } }), o = ((s = e.onTrue[0]) == null ? void 0 : s.device) ?? "";
  return It({
    prefix: "vent",
    title: u("vent.title"),
    hint: u("vent.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Hy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("vent.sensor")}</label>
      ${cs(t, "vent-sensor", n.sensor, t.climateSensors, (r) => i({ sensor: r }))}

      <label class="rlabel">${u("vent.than")}</label>
      ${cs(t, "vent-than", n.than, t.climateSensors, (r) => i({ than: r }))}

      <label class="rlabel">${u("vent.fan")}</label>
      ${cs(t, "vent-fan", o, t.fans, (r) => t.onChange({
      ...e,
      onTrue: r ? [{ device: r, do: "on" }] : [],
      onFalse: r ? [{ device: r, do: "off" }] : []
    }))}

      <div class="vnums">
        <label>${u("vent.above")}
          <input class="num" data-field="vent-above" type="number" min="0" step="any" .value=${Q(as(n.above))}
            @input=${(r) => i({ above: ls(r.target.value) })} /></label>
        <label>${u("vent.below")}
          <input class="num" data-field="vent-below" type="number" min="0" step="any" .value=${Q(as(n.below))}
            @input=${(r) => i({ below: ls(r.target.value) })} /></label>
        <label>${u("vent.runon")}
          <input class="num" data-field="vent-runon" type="number" min="0" max="60" step="1" .value=${Q(as(e.offDelay / 60))}
            @input=${(r) => t.onChange({ ...e, offDelay: Math.round(ls(r.target.value)) * 60 })} /></label>
      </div>`,
    diagram: Vy({
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
const Ry = { "boiler-relay": "boiler-device", "boiler-power": "boiler-device" }, Xi = Ct, By = Xi - 2 * F, Fy = F, Uy = Xi / 2, sc = (t) => t === null ? ie(null) : `${Math.round(t)} W`, di = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "?";
function Wy(t, e) {
  const n = t.until !== void 0 ? we(Math.max(0, Math.ceil((t.until - e) / 1e3))) : null;
  switch (t.phase) {
    case "heating":
      return n ? u("boiler.phase.heatingCheck").replace("{t}", n) : u("boiler.phase.heating");
    case "waiting":
      return u("boiler.phase.waiting").replace("{t}", n ?? we(0));
    case "blackout":
    case "limit":
    case "done":
      return u(`boiler.phase.${t.phase}`);
    default:
      return null;
  }
}
function jy(t) {
  return t.phase === "heating" ? j(!0) : t.phase !== null ? j(!1) : j(t.relay === null ? null : t.relay === "on");
}
function qy(t) {
  const n = t.rule.boiler, i = n.grid, o = t.trace, s = o == null ? void 0 : o.boiler, r = t.deviceName(n.device), l = [];
  let a = F;
  const c = (v, b, y, x) => {
    const M = J(y.length + (x ? 1 : 0));
    l.push({ y: a, h: M, field: v, cls: b, lines: y, err: x }), a += M + W;
  };
  if (i) {
    const v = (s == null ? void 0 : s.settling) !== void 0 && s.settling > t.now ? [u("boiler.flow.settling").replace("{left}", we(Math.ceil((s.settling - t.now) / 1e3)))] : [];
    c("boiler-grid", s && s.grid === null ? j(null) : "", [t.gridName(i.block), s ? sc(s.grid) : u("boiler.flow.gridPower"), ...v]);
    const b = u("boiler.flow.formula").replace("{nominal}", di(i.nominal)), y = s && s.headroom !== null ? s.headroom > i.limit : null, x = !!s && (v.length > 0 || s.boilerW === null && s.relay !== "off" && s.grid !== null && s.grid <= i.limit && s.grid + i.nominal > i.limit);
    c("boiler-limit", s ? x ? "" : j(y === null ? null : !y) : "", [
      s ? `${u("boiler.flow.headroom")}: ${x ? u("boiler.flow.notJudged") : y === null ? ie(null) : u(y ? "boiler.flow.over" : "boiler.flow.ok")}` : u("boiler.flow.headroom"),
      s && s.headroom !== null ? `${b} = ${Math.round(s.headroom)} / ${di(i.limit)} W` : `${b} ≤ ${di(i.limit)} W`
    ]);
  }
  c("boiler-button", s ? j(s.mode === "auto") : "", [
    s ? `${u("boiler.flow.mode")}: ${u(`boiler.mode.${s.mode}`)}` : u("boiler.flow.mode"),
    u("boiler.flow.button").replace("{name}", t.deviceName(n.button))
  ]);
  const h = s ? Wy(s, t.now) : null, f = o == null ? void 0 : o.last;
  c("boiler-relay", s ? jy(s) : "", [
    s ? `${u("boiler.flow.relay")}: ${s.relay ?? ie(null)}` : u("boiler.flow.relay"),
    r,
    ...h ? [h] : [],
    ...f ? [Fr(f)] : []
  ], f == null ? void 0 : f.error);
  const d = u("boiler.flow.done");
  c(i ? "boiler-nominal" : "boiler-power", s ? j(s.boilerW === null ? null : s.boilerW > 1) : "", [
    s ? `${u("boiler.flow.power")}: ${sc(s.boilerW)}` : u("boiler.flow.power"),
    i ? `${u("boiler.flow.nominal").replace("{w}", di(i.nominal))}, ${d}` : d
  ]);
  const p = a - W + F, m = l.slice(1).map((v) => `M${Uy} ${v.y - W} V${v.y}`).join(" "), w = o && o.status !== "ok" ? o.status === "error" && o.reason ? `${u("rules.status.error")}: ${o.reason}` : u(`rules.status.${o.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Xi}px`} viewBox=${`0 0 ${Xi} ${p}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("boiler.flow.title")}>
        <path class="fc-link" d=${m}></path>
        ${l.map((v) => et({ x: Fy, w: By, ...v, focused: t.focused === v.field, onClick: () => t.onFocus(v.field) }))}
      </svg>
      ${w ? g`<p class="fc-warn" data-note="status">${w}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const rc = (t) => t.trim() === "" ? NaN : Number(t), lc = (t) => Number.isFinite(t) ? String(+t.toFixed(4)) : "";
function us(t, e, n, i, o) {
  const s = e === "" || n.some((r) => r.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(r) => o(r.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${s ? $ : g`<option value=${e}>${i}</option>`}
      ${n.map((r) => g`<option value=${r.id}>${r.name}</option>`)}
    </select>`;
}
function Zy(t) {
  var s;
  const e = t.draft.rule.boiler, n = [];
  e.device || n.push({ key: "pick-device", text: u("boiler.problem.device") }), e.button || n.push({ key: "pick-button", text: u("boiler.problem.button") }), e.grid && !e.grid.block && n.push({ key: "pick-grid", text: u("boiler.problem.grid") });
  const i = [...n], o = e.device && !t.boilers.some((r) => r.id === e.device) || e.button && !t.buttons.some((r) => r.id === e.button) || ((s = e.grid) == null ? void 0 : s.block) && !t.grids.some((r) => r.id === e.grid.block);
  for (const r of t.problems)
    r === "device-missing" && !o || r === "boiler" && n.length > 0 || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function Gy(t) {
  const e = t.draft.rule, n = e.boiler, i = n.grid, o = (c) => t.onChange({ ...e, boiler: c }), s = (c) => i && o({ ...n, grid: { ...i, ...c } }), r = (c) => {
    const { grid: h, ...f } = n;
    o(c ? { ...f, grid: { block: t.grids.length === 1 ? t.grids[0].id : "", limit: Rd, nominal: Bd } } : f);
  }, l = (c) => {
    var h;
    return ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, a = (c) => {
    var h;
    return c === "" ? u("vent.pick") : ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  };
  return It({
    prefix: "boiler",
    title: u("boiler.title"),
    hint: u("boiler.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Zy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("boiler.device")}</label>
      ${us("boiler-device", n.device, t.boilers, l(n.device), (c) => o({ ...n, device: c }))}

      <label class="rlabel">${u("boiler.button")}</label>
      ${us("boiler-button", n.button, t.buttons, l(n.button), (c) => o({ ...n, button: c }))}

      <label class="rnot rcheck"><input type="checkbox" data-field="boiler-limit-on" .checked=${!!i}
        @change=${(c) => r(c.target.checked)} /> ${u("boiler.limitOn")}</label>
      ${i ? g`
        <label class="rlabel">${u("boiler.grid")}</label>
        ${us("boiler-grid", i.block, t.grids, u("boiler.missingGrid"), (c) => s({ block: c }))}
        <div class="vnums">
          <label>${u("boiler.limit")}
            <input class="num" data-field="boiler-limit" type="number" min="1" step="any" .value=${Q(lc(i.limit))}
              @input=${(c) => s({ limit: rc(c.target.value) })} /></label>
          <label>${u("boiler.nominal")}
            <input class="num" data-field="boiler-nominal" type="number" min="1" step="any" .value=${Q(lc(i.nominal))}
              @input=${(c) => s({ nominal: rc(c.target.value) })} /></label>
        </div>` : $}`,
    diagram: qy({
      rule: e,
      deviceName: a,
      gridName: (c) => {
        var h;
        return c === "" ? u("vent.pick") : ((h = t.grids.find((f) => f.id === c)) == null ? void 0 : h.name) ?? u("boiler.missingGrid");
      },
      trace: t.trace,
      note: t.note,
      now: t.now,
      focused: t.draft.focused,
      onFocus: t.onFocus
    })
  });
}
const Yi = Ct, st = 2, mh = 20, Mn = 24, ac = 220, _n = (Yi - 2 * F - (st - 1) * mh) / st, An = Yi / 2;
function Ky(t) {
  return t.startsWith("leak-valve") ? "leak-valves" : "leak-sensors";
}
const Xy = (t, e) => t === 1 ? An - _n / 2 : F + e % st * (_n + mh);
function cc(t, e, n, i) {
  const o = J(Math.max(...e.map((h) => h.lines.length + (h.err ? 1 : 0)))), s = Math.ceil(e.length / st), r = (h) => t + h * (o + Mn), l = e.map((h, f) => ({ ...h, x: Xy(e.length, f), y: r(Math.floor(f / st)), w: _n, h: o })), a = (h) => n ? r(h) + o + (h === s - 1 ? W : Mn) / 2 : r(h) - (h === 0 ? W : Mn) / 2, c = [];
  for (let h = 0; h < s; h++) {
    const f = l.slice(h * st, (h + 1) * st);
    for (const p of f) c.push(`M${p.x + _n / 2} ${n ? p.y + o : p.y} V${a(h)}`);
    const d = [An, ...f.map((p) => p.x + _n / 2)];
    Math.max(...d) > Math.min(...d) && c.push(`M${Math.min(...d)} ${a(h)} H${Math.max(...d)}`);
  }
  return c.push(n ? `M${An} ${a(0)} V${i}` : `M${An} ${i} V${a(s - 1)}`), { blocks: l, bottom: r(s - 1) + o, links: c.join(" ") };
}
function Yy(t) {
  const e = t.rule.leak, n = t.trace, i = n == null ? void 0 : n.last, o = e.sensors.length === 0 ? [{ field: "leak-sensors", cls: "", lines: [u("leak.flow.addSensor")] }] : e.sensors.map((y, x) => {
    const M = n == null ? void 0 : n.inputs[x];
    return { field: `leak-sensor:${y}`, cls: M ? j(M.value) : "", lines: [t.deviceName(y), M ? M.detail : u("device.leak_sensor")] };
  }), s = (y) => {
    var x, M;
    return ((M = (x = n == null ? void 0 : n.leak) == null ? void 0 : x.valves.find((k) => k.id === y)) == null ? void 0 : M.name) ?? t.deviceName(y);
  }, r = i ? e.valves.find((y) => s(y) === i.target) : void 0, l = e.valves.length === 0 ? [{ field: "leak-valves", cls: "", lines: [u("leak.flow.addValve")] }] : e.valves.map((y) => {
    var A;
    const x = (A = n == null ? void 0 : n.leak) == null ? void 0 : A.valves.find((N) => N.id === y), M = t.deviceName(y), k = (x == null ? void 0 : x.state) ?? null, S = y === r ? i : void 0, C = S ? (S.reason === "re-closed: leak" ? u("leak.flow.reclosed") : u("vent.flow.last").replace("{did}", u(`rules.did.${S.action}`))).replace("{at}", $e(S.at)) : null;
    return {
      field: `leak-valve:${y}`,
      cls: n ? k === "closed" ? j(!0) : k === "open" ? "" : j(null) : "",
      lines: [M, n ? k === null ? ie(null) : u(`leak.state.${k}`) : u("leak.flow.close"), ...C ? [C] : []],
      err: S == null ? void 0 : S.error
    };
  }), a = J(2), c = J(Math.max(...o.map((y) => y.lines.length))), h = F + Math.ceil(o.length / st) * (c + Mn) - Mn + W, f = cc(F, o, !0, h), d = cc(h + a + W, l, !1, h + a), p = {
    x: An - ac / 2,
    y: h,
    w: ac,
    h: a,
    field: "leak",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("leak.flow.leak")}: ${n.verdict === null ? ie(null) : u(n.verdict ? "leak.yes" : "leak.no")}` : u("leak.flow.leak"), u("leak.flow.any")]
  }, m = d.bottom + F, w = `${f.links} ${d.links}`, v = (y) => et({ ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }), b = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Yi}px`} viewBox=${`0 0 ${Yi} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("leak.flow.title")}>
        ${_`<path class="fc-link" d=${w}></path>`}
        ${f.blocks.map(v)}${v(p)}${d.blocks.map(v)}
      </svg>
      ${b ? g`<p class="fc-warn" data-note="status">${b}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function Qi(t, e, n, i, o, s, r) {
  const l = (c) => {
    var h;
    return ((h = t.deviceById(c)) == null ? void 0 : h.name) ?? u("rules.missingDevice");
  }, a = t.draft.focused;
  return g`
    <div class="rsources" data-group=${e}>
      ${i.map((c) => g`
        <span class="rchip${o.some((h) => h.id === c) ? "" : " bad"}${a === `${n}:${c}` ? " hl" : ""}"
          data-id=${c}>${l(c)}
          <button class="btn" data-action="remove" title=${u("leak.remove")}
            @click=${() => r(i.filter((h) => h !== c))}>&times;</button></span>`)}
      <select class="radd" data-field=${e} .value=${""}
        @change=${(c) => {
    const h = c.target, f = h.value;
    h.value = "", f && r([...i, f]);
  }}>
        <option value="">${s}</option>
        ${o.filter((c) => !i.includes(c.id)).map((c) => g`<option value=${c.id}>${c.name}</option>`)}
      </select>
    </div>`;
}
function Qy(t) {
  const e = t.draft.rule.leak, n = [];
  e.sensors.length === 0 && n.push({ key: "pick-sensors", text: u("leak.problem.sensors") }), e.valves.length === 0 && n.push({ key: "pick-valves", text: u("leak.problem.valves") });
  const i = [...n];
  for (const o of t.problems)
    o === "leak" && n.length > 0 || i.push({ key: o, text: u(`rules.problem.${o}`) });
  return i;
}
function Jy(t) {
  const e = t.draft.rule, n = e.leak;
  return It({
    prefix: "leak",
    title: u("leak.title"),
    hint: u("leak.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: Qy(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("leak.sensors")}</label>
      ${Qi(t, "leak-sensors", "leak-sensor", n.sensors, t.sensors, u("leak.addSensor"), (i) => t.onChange({ ...e, leak: { ...n, sensors: i } }))}
      <label class="rlabel">${u("leak.valves")}</label>
      ${Qi(t, "leak-valves", "leak-valve", n.valves, t.valves, u("leak.addValve"), (i) => t.onChange({ ...e, leak: { ...n, valves: i } }))}`,
    diagram: Yy({
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
const Ji = Ct, e0 = Ji - 2 * F, t0 = Ji / 2;
function n0(t) {
  const e = $e(t.at);
  return Kn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : t.sent === !1 ? (t.reason === qd ? u("timed.flow.elsewhere") : u("timed.flow.already").replace("{reason}", t.reason)).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason);
}
function i0(t) {
  const e = t.rule.timed, n = t.trace, i = n == null ? void 0 : n.timed, o = [];
  let s = F;
  const r = (p, m, w, v) => {
    const b = J(w.length + (v ? 1 : 0));
    o.push({ y: s, h: b, field: p, cls: m, lines: w, err: v }), s += b + W;
  };
  r("timed-button", "", [t.deviceName(e.button), t.events ?? u("timed.flow.events")]);
  const l = u(e.invert ? "timed.flow.forInvert" : "timed.flow.for").replace("{d}", Xn(e.minutes * 60)), a = i ? i.running ? i.until !== void 0 ? u("timed.flow.running").replace("{t}", we(Math.max(0, Math.ceil((i.until - t.now) / 1e3)))) : u("timed.flow.runningNow") : u("timed.flow.idle") : u("timed.flow.run");
  r("timed-minutes", i ? j(i.running) : n ? j(n.verdict) : "", [a, l]);
  const c = n == null ? void 0 : n.last;
  r("timed-device", i ? j(i.device === null ? null : i.device === "on") : "", [
    t.deviceName(e.device),
    i ? u("timed.flow.state").replace("{s}", i.device ?? ie(null)) : u(e.invert ? "timed.flow.cmdInvert" : "timed.flow.cmd"),
    ...c ? [n0(c)] : []
  ], c == null ? void 0 : c.error);
  const h = s - W + F, f = o.slice(1).map((p) => `M${t0} ${p.y - W} V${p.y}`).join(" "), d = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${Ji}px`} viewBox=${`0 0 ${Ji} ${h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("timed.flow.title")}>
        <path class="fc-link" d=${f}></path>
        ${o.map((p) => et({ x: F, w: e0, ...p, focused: t.focused === p.field, onClick: () => t.onFocus(p.field) }))}
      </svg>
      ${d ? g`<p class="fc-warn" data-note="status">${d}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const uc = (t) => t.slot === 0 ? t.event : `${t.slot} ${t.event}`;
function o0(t) {
  const e = t == null ? void 0 : t.props;
  return (e == null ? void 0 : e.kind) === "wall_switch" ? u("timed.events.wall") : (e == null ? void 0 : e.kind) !== "smart_button" ? null : `${u("timed.events.start").replace("{e}", uc(e.on))}, ${e.separateOff ? u("timed.events.stop").replace("{e}", uc(e.off)) : u("timed.events.noStop")}`;
}
const s0 = (t) => t.trim() === "" ? NaN : Number(t);
function dc(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function r0(t) {
  const e = t.draft.rule.timed, n = [];
  e.button || n.push({ key: "pick-button", text: u("timed.problem.button") }), e.device || n.push({ key: "pick-device", text: u("timed.problem.device") });
  const i = [...n], o = e.button && !t.buttons.some((r) => r.id === e.button) || e.device && !t.devices.some((r) => r.id === e.device), s = Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440;
  for (const r of t.problems)
    r === "device-missing" && !o || r === "timed" && n.length > 0 && s || i.push({ key: r, text: u(`rules.problem.${r}`) });
  return i;
}
function l0(t) {
  const e = t.draft.rule, n = e.timed, i = (r) => t.onChange({ ...e, timed: r }), o = o0(t.deviceById(n.button)), s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return It({
    prefix: "timed",
    title: u("timed.title"),
    hint: u("timed.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: r0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("timed.button")}</label>
      ${dc("timed-button", n.button, t.buttons, (r) => i({ ...n, button: r }))}
      ${o ? g`<p class="muted" data-note="events">${o}</p>` : $}

      <label class="rlabel">${u("timed.device")}</label>
      ${dc("timed-device", n.device, t.devices, (r) => i({ ...n, device: r }))}

      <div class="vnums">
        <label>${u("timed.minutes")}
          <input class="num" data-field="timed-minutes" type="number" min="1" max="1440" step="1"
            .value=${Q(Number.isFinite(n.minutes) ? String(n.minutes) : "")}
            @input=${(r) => i({ ...n, minutes: s0(r.target.value) })} /></label>
      </div>
      <label class="rnot rcheck"><input type="checkbox" data-field="timed-invert" .checked=${n.invert === !0}
        @change=${(r) => {
      const { invert: l, ...a } = n;
      i(r.target.checked ? { ...a, invert: !0 } : a);
    }} /> ${u("timed.invert")}</label>`,
    diagram: i0({
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
const a0 = { "outside-wants": "outside-sensor" }, eo = Ct, hn = eo - 2 * F, ds = eo / 2, _i = 16, c0 = { 1: [hn], 2: [(hn - _i) / 2, (hn - _i) / 2], 3: [176, 116, hn - 176 - 116 - 2 * _i] }, Ws = (t, e) => t !== void 0 ? we(Math.max(0, Math.ceil((t - e) / 1e3))) : null;
function u0(t, e, n) {
  const i = /^(.*?) \((.+) in [\d:]+\)$/.exec(t.detail), o = i ? i[1] : t.detail, s = t.daylight === null && o === u("daylight.noData") ? [] : [o];
  return i && s.push(`${i[2]} in ${Ws(t.until, n) ?? we(0)}`), t.daylight === null && e && s.push(u("outside.flow.countsNight")), s;
}
function Qr(t) {
  const e = $e(t.at);
  return Kn(t) ? u("timed.flow.kept").replace("{reason}", t.reason).replace("{at}", e) : Gd(t) ? u("outside.flow.elsewhere").replace("{s}", t.action).replace("{at}", e).replace("{why}", t.reason.replace(/^switched elsewhere:?\s*/, "")) : t.sent === !1 ? u("timed.flow.already").replace("{reason}", t.reason).replace("{s}", t.action).replace("{at}", e) : u("timed.flow.last").replace("{did}", u(`rules.did.${t.action}`)).replace("{at}", e).replace("{reason}", t.reason.split(":")[0]);
}
function d0(t) {
  const e = t.rule.outside, n = t.trace, i = n == null ? void 0 : n.outside, o = e.window, s = [{
    field: "outside-sensor",
    cls: i ? j(i.daylight === null ? null : i.daylight === "night") : "",
    lines: i ? [`${u("outside.flow.daylight")}: ${u(`daylight.${i.daylight ?? "noData"}`)}`, t.deviceName(e.sensor), ...u0(i, e.noDataNight === !0, t.now)] : [u("outside.flow.daylight"), t.deviceName(e.sensor), u(e.noDataNight ? "outside.flow.nightOrNoData" : "daylight.night")]
  }];
  if (e.afterSunset && s.push({
    field: "outside-sunset",
    cls: i ? j(i.sun === null ? null : i.sun === "below") : "",
    lines: [i ? `${u("outside.flow.sun")}: ${i.sun === null ? ie(null) : u(`outside.sun.${i.sun}`)}` : u("outside.flow.sun"), u("outside.flow.afterSunset")]
  }), o) {
    const A = `${o.from}-${o.to}`, N = i && i.window !== null ? Ws(i.windowUntil, t.now) : null;
    s.push({
      field: "outside-window",
      cls: i ? j(i.window) : "",
      lines: i ? [
        i.window === null ? `${u("outside.flow.window")}: ${ie(null)}` : u(i.window ? "outside.flow.inWindow" : "outside.flow.outWindow"),
        A,
        ...N ? [u(i.window ? "outside.flow.endsIn" : "outside.flow.startsIn").replace("{t}", N)] : []
      ] : [u("outside.flow.window"), A]
    });
  }
  const r = [], l = c0[s.length], a = J(Math.max(...s.map((A) => A.lines.length)));
  let c = F;
  for (const [A, N] of s.entries())
    r.push({ ...N, x: c, y: F, w: l[A], h: a }), c += l[A] + _i;
  let h = F + a + W;
  const f = (A) => {
    const N = J(A.lines.length + (A.err ? 1 : 0));
    r.push({ ...A, x: F, y: h, w: hn, h: N }), h += N + W;
  }, d = u("outside.flow.rule").replace("{sun}", e.afterSunset ? u("outside.flow.ruleSun") : "").replace("{window}", o ? u("outside.flow.ruleWindow") : "");
  f({
    field: "outside-wants",
    cls: n ? j(n.verdict) : "",
    lines: [n ? `${u("outside.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("outside.flow.wants"), d]
  });
  const p = (i == null ? void 0 : i.pausedUntil) !== void 0 && e.pause > 0 ? Ws(i.pausedUntil, t.now) : null;
  f(e.pause === 0 ? { field: "outside-pause", cls: i ? j(!0) : "", lines: [u("outside.flow.never"), u("outside.flow.ignored")] } : {
    field: "outside-pause",
    cls: i ? j(p === null) : "",
    lines: [
      i ? p !== null ? u("outside.flow.paused").replace("{t}", p) : u("outside.flow.noPause") : u("outside.flow.pause"),
      u("outside.flow.after").replace("{d}", Xn(e.pause * 60))
    ]
  });
  const m = n == null ? void 0 : n.last, w = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ie(null)) : u("outside.flow.onOff"),
    ...m ? [Qr(m)] : []
  ];
  f({
    field: "outside-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: w,
    err: m == null ? void 0 : m.error,
    tip: m ? [...w, ...m.error ? [m.error] : [], m.reason].join(`
`) : void 0
  });
  const v = h - W + F, b = r.find((A) => A.field === "outside-wants"), y = F + a + W / 2, x = r.slice(0, s.length), M = [ds, ...x.map((A) => A.x + A.w / 2)], k = [
    ...x.map((A) => `M${A.x + A.w / 2} ${F + a} V${y}`),
    ...Math.max(...M) > Math.min(...M) ? [`M${Math.min(...M)} ${y} H${Math.max(...M)}`] : [],
    `M${ds} ${y} V${b.y}`,
    ...r.slice(s.length + 1).map((A) => `M${ds} ${A.y - W} V${A.y}`)
  ].join(" "), S = (A) => et({ ...A, focused: t.focused === A.field, onClick: () => t.onFocus(A.field) }), C = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${eo}px`} viewBox=${`0 0 ${eo} ${v}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("outside.flow.title")}>
        ${_`<path class="fc-link" d=${k}></path>`}
        ${r.map(S)}
      </svg>
      ${C ? g`<p class="fc-warn" data-note="status">${C}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const h0 = { from: "17:00", to: "01:00" }, Jr = (t) => t.trim() === "" ? NaN : Number(t);
function Un(t, e, n, i) {
  const o = e === "" || n.some((s) => s.id === e);
  return g`
    <select data-field=${t} data-value=${e} @change=${(s) => i(s.target.value)}>
      <option value="">${u("vent.pick")}</option>
      ${o ? $ : g`<option value=${e}>${u("rules.missingDevice")}</option>`}
      ${n.map((s) => g`<option value=${s.id}>${s.name}</option>`)}
    </select>`;
}
function hc(t, e, n, i, o) {
  return g`
    <label class="rnot rcheck"><input type="checkbox" data-field=${t} .checked=${n[e] === !0}
      @change=${(s) => {
    const { [e]: r, ...l } = n;
    o(s.target.checked ? { ...l, [e]: !0 } : l);
  }} /> ${i}</label>`;
}
function f0(t) {
  const e = t.draft.rule.outside, n = [];
  e.light || n.push({ key: "pick-light", text: u("outside.problem.light") }), e.sensor || n.push({ key: "pick-sensor", text: u("outside.problem.sensor") });
  const i = [...n], o = e.light && !t.lights.some((l) => l.id === e.light) || e.sensor && !t.sensors.some((l) => l.id === e.sensor), s = Number.isInteger(e.pause) && e.pause >= 0 && e.pause <= 1440, r = !e.window || e.window.from !== "" && e.window.to !== "" && e.window.from !== e.window.to;
  for (const l of t.problems)
    l === "device-missing" && !o || l === "outside" && n.length > 0 && s && r || i.push({ key: l, text: u(`rules.problem.${l}`) });
  return i;
}
function p0(t) {
  const e = t.draft.rule, n = e.outside, i = (r) => t.onChange({ ...e, outside: r }), o = n.window, s = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  };
  return It({
    prefix: "outside",
    title: u("outside.title"),
    hint: u("outside.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: f0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("outside.light")}</label>
      ${Un("outside-light", n.light, t.lights, (r) => i({ ...n, light: r }))}

      <label class="rlabel">${u("outside.sensor")}</label>
      ${Un("outside-sensor", n.sensor, t.sensors, (r) => i({ ...n, sensor: r }))}

      ${hc("outside-nodata", "noDataNight", n, u("outside.noDataNight"), i)}
      ${hc("outside-sunset", "afterSunset", n, u("outside.afterSunset"), i)}

      <label class="rnot rcheck"><input type="checkbox" data-field="outside-window" .checked=${o !== void 0}
        @change=${(r) => {
      const { window: l, ...a } = n;
      i(r.target.checked ? { ...a, window: { ...h0 } } : a);
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
            @input=${(r) => i({ ...n, pause: Jr(r.target.value) })} /></label>
        <span class="muted">${u("outside.pauseNote")}</span>
      </div>`,
    diagram: d0({
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
const m0 = { "beurer-wants": "beurer-above" }, to = Ct, g0 = to - 2 * F, b0 = to / 2, hi = (t, e) => we(Math.max(0, Math.ceil((t - e) / 1e3)));
function w0(t) {
  var b;
  const e = t.rule.beurer, n = t.trace, i = n == null ? void 0 : n.beurer, o = [];
  let s = F;
  const r = (y, x, M, k, S) => {
    const C = J(M.length + (k ? 1 : 0));
    o.push({ y: s, h: C, field: y, cls: x, lines: M, err: k, tip: S }), s += C + W;
  }, l = (i == null ? void 0 : i.watts) === null && i.keptUntil !== void 0, a = i ? i.watts !== null ? i.detail : l ? u("beurer.flow.kept").replace("{t}", hi(i.keptUntil, t.now)) : u("beurer.flow.noData") : u("beurer.source");
  r(
    "beurer-source",
    i ? j(i.watts !== null ? i.watts > e.above : l ? ((b = n.inputs[0]) == null ? void 0 : b.value) ?? null : null) : "",
    [t.deviceName(e.source), a]
  );
  const c = n == null ? void 0 : n.pending;
  r("beurer-wants", n ? j(n.verdict) : "", [
    n ? `${u("beurer.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("beurer.flow.wants"),
    u("beurer.flow.rule").replace("{w}", String(e.above)).replace("{d}", we(t.rule.offDelay)),
    ...c ? [u("rules.flow.pending").replace("{to}", c.to ? "on" : "off").replace("{t}", hi(c.at, t.now))] : []
  ]);
  const h = (n == null ? void 0 : n.verdict) === !0, f = e.every === 0 ? u("beurer.flow.never") : i && !h ? "—" : (i == null ? void 0 : i.pausedUntil) !== void 0 ? u("beurer.flow.now").replace("{t}", hi(i.pausedUntil, t.now)) : (i == null ? void 0 : i.cycleAt) !== void 0 ? u("beurer.flow.next").replace("{t}", hi(i.cycleAt, t.now)) : i && h && i.heater === "on" && !i.fresh ? u("beurer.flow.due") : i ? "—" : Xn(e.every * 60);
  r("beurer-every", i ? j(i.pausedUntil !== void 0 ? !1 : h ? !0 : null) : "", [u("beurer.flow.repower"), f]);
  const d = n == null ? void 0 : n.last, p = [
    t.deviceName(e.heater),
    i ? u("timed.flow.state").replace("{s}", i.heater ?? ie(null)) : u("outside.flow.onOff"),
    ...d ? [Qr(d)] : []
  ];
  r(
    "beurer-heater",
    i ? j(i.heater === null ? null : i.heater === "on") : "",
    p,
    d == null ? void 0 : d.error,
    d ? [...p, ...d.error ? [d.error] : [], d.reason].join(`
`) : void 0
  );
  const m = s - W + F, w = o.slice(1).map((y) => `M${b0} ${y.y - W} V${y.y}`).join(" "), v = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${to}px`} viewBox=${`0 0 ${to} ${m}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("beurer.flow.title")}>
        ${_`<path class="fc-link" d=${w}></path>`}
        ${o.map((y) => et({ x: F, w: g0, ...y, focused: t.focused === y.field, onClick: () => t.onFocus(y.field) }))}
      </svg>
      ${v ? g`<p class="fc-warn" data-note="status">${v}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function v0(t) {
  const e = t.draft.rule, n = e.beurer, i = [];
  n.heater || i.push({ key: "pick-heater", text: u("beurer.problem.heater") }), n.source || i.push({ key: "pick-source", text: u("beurer.problem.source") });
  const o = [...i], s = n.heater && !t.heaters.some((l) => l.id === n.heater) || n.source && !t.sources.some((l) => l.id === n.source), r = Number.isFinite(n.above) && n.above > 0 && [n.keep, n.every].every((l) => Number.isInteger(l) && l >= 0 && l <= 1440);
  for (const l of t.problems)
    l === "device-missing" && !s || l === "beurer" && i.length > 0 && r || o.push({ key: l, text: u(`rules.problem.${l}`) });
  return o;
}
function $0(t) {
  const e = t.draft.rule, n = e.beurer, i = (r) => t.onChange({ ...e, beurer: r }), o = (r) => {
    var l;
    return r === "" ? u("vent.pick") : ((l = t.deviceById(r)) == null ? void 0 : l.name) ?? u("rules.missingDevice");
  }, s = (r, l, a, c, h, f, d) => g`
    <div class="vnums">
      <label>${l}
        <input class="num" data-field=${`beurer-${r}`} type="number" min=${c} max=${h} step="1"
          .value=${Q(Number.isFinite(a) ? String(a) : "")}
          @input=${(p) => f(Jr(p.target.value))} /></label>
      ${d ? g`<span class="muted">${d}</span>` : ""}
    </div>`;
  return It({
    prefix: "beurer",
    title: u("beurer.title"),
    hint: u("beurer.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: v0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("beurer.heater")}</label>
      ${Un("beurer-heater", n.heater, t.heaters, (r) => i({ ...n, heater: r }))}

      <label class="rlabel">${u("beurer.source")}</label>
      ${Un("beurer-source", n.source, t.sources.filter((r) => r.id !== n.heater), (r) => i({ ...n, source: r }))}

      ${s("above", u("beurer.above"), n.above, 1, 1e5, (r) => i({ ...n, above: r }))}
      ${s("off", u("beurer.off"), e.offDelay, 0, 3600, (r) => t.onChange({ ...e, offDelay: r }))}
      ${s("keep", u("beurer.keep"), n.keep, 0, 1440, (r) => i({ ...n, keep: r }))}
      ${s("every", u("beurer.every"), n.every, 0, 1440, (r) => i({ ...n, every: r }), u("beurer.everyNote"))}`,
    diagram: w0({
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
const y0 = { "motionlight-wants": "motionlight-off", "motionlight-mode": "motionlight-buttons" };
function x0(t) {
  return t.startsWith("motionlight-sensor:") ? "motionlight-sensors" : y0[t] ?? t;
}
const no = Ct, fc = no - 2 * F, pc = no / 2, hs = 12, k0 = 3, M0 = {
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
}, _0 = (t) => {
  const e = Zd(t);
  return e ? u(`motionLight.flow.${M0[e]}`).replace("{at}", $e(t.at)).replace("{s}", t.action) : Qr(t);
}, fi = (t, e) => we(Math.max(0, Math.ceil((t - e) / 1e3)));
function A0(t) {
  var U;
  const e = t.rule.motionLight, n = t.trace, i = n == null ? void 0 : n.motionLight, o = e.daylight, s = e.sensors.length === 0 ? [{ field: "motionlight-sensors", cls: " muted", lines: [u("motionLight.flow.noSensors")] }] : e.sensors.map((I) => {
    const O = i == null ? void 0 : i.sensors.find((E) => E.id === I);
    return {
      field: `motionlight-sensor:${I}`,
      cls: i ? j((O == null ? void 0 : O.state) === void 0 || O.state === null ? null : O.state === "on") : "",
      lines: [t.deviceName(I), i ? (O == null ? void 0 : O.state) === "on" ? u("motionLight.flow.motion") : (O == null ? void 0 : O.state) === "off" ? u("motionLight.flow.clear") : u("motionLight.flow.noData") : u("device.motion_sensor")]
    };
  });
  if (o) {
    const I = i != null && i.daylight ? ((U = /^(.*?) \(.+ in [\d:]+\)$/.exec(i.daylight.detail)) == null ? void 0 : U[1]) ?? i.daylight.detail : "";
    s.push({
      field: "motionlight-daylight",
      cls: i ? j(i.dark) : "",
      lines: i != null && i.daylight ? [`${u("motionLight.flow.daylight")}: ${i.daylight.state ?? u("motionLight.flow.noData")}`, t.deviceName(o.sensor), ...I ? [I] : []] : [u("motionLight.flow.daylight"), t.deviceName(o.sensor), u(o.is === "night" ? "motionLight.isNight" : "motionLight.isDark")],
      tip: i != null && i.daylight ? [u("motionLight.flow.daylight"), t.deviceName(o.sensor), i.daylight.detail].join(`
`) : void 0
    });
  }
  const r = e.blocker;
  if (r) {
    const I = t.deviceName(r.device), O = u(r.is === "on" ? "motionLight.blockerIsOn" : "motionLight.blockerIsOff"), E = (i == null ? void 0 : i.blocked) === !0, D = i != null && i.blocker ? i.blocker.state ?? u("motionLight.flow.noData") : void 0;
    s.push({
      field: "motionlight-blocker",
      cls: i ? j(!E) : "",
      lines: E ? [u("motionLight.flow.blocked").replace("{name}", I)] : [u("motionLight.blocker"), `${I} ${O}`, ...D !== void 0 ? [u("motionLight.flow.blockerNow").replace("{s}", D)] : []]
    });
  }
  const l = e.sensors.length === 0 ? 1 : Math.min(k0, s.length), a = (fc - (l - 1) * hs) / l, c = Math.ceil(s.length / l), h = J(Math.max(...s.map((I) => I.lines.length))), f = l === 3 ? F + a + hs / 2 : pc, d = s.map((I, O) => ({ ...I, x: F + O % l * (a + hs), y: F + Math.floor(O / l) * (h + W), w: a, h })), p = [];
  for (let I = 0; I < c; I++) {
    const O = d.slice(I * l, (I + 1) * l), E = O[0].y + h + W / 2;
    for (const H of O) p.push(`M${H.x + a / 2} ${H.y + h} V${E}`);
    const D = [f, ...O.map((H) => H.x + a / 2)];
    Math.max(...D) > Math.min(...D) && p.push(`M${Math.min(...D)} ${E} H${Math.max(...D)}`);
  }
  const m = F + c * (h + W);
  let w = m;
  p.push(`M${f} ${F + h + W / 2} V${m}`);
  const v = (I) => {
    const O = J(I.lines.length + (I.err ? 1 : 0));
    d.push({ ...I, x: F, y: w, w: fc, h: O }), w > m && p.push(`M${pc} ${w - W} V${w}`), w += O + W;
  }, b = u("motionLight.flow.rule").replace("{dark}", o ? u("motionLight.flow.ruleDark") : "").replace("{d}", we(t.rule.offDelay)) + (e.minOn > 0 ? u("motionLight.flow.ruleMin").replace("{d}", we(e.minOn)) : ""), y = o ? u("motionLight.flow.ruleDay") : null, x = (i == null ? void 0 : i.mode) === "manual", M = x || e.sensors.length === 0;
  v({
    field: "motionlight-wants",
    cls: i && !M ? j(n.verdict) : "",
    lines: [
      i && !M ? `${u("motionLight.flow.wants")}: ${n.verdict === null ? ie(null) : n.verdict ? "on" : "off"}` : u("motionLight.flow.wants"),
      b,
      ...y ? [y] : [],
      ...(i == null ? void 0 : i.offAt) !== void 0 && !M ? [u("motionLight.flow.offIn").replace("{t}", fi(i.offAt, t.now))] : [],
      ...(i == null ? void 0 : i.minUntil) !== void 0 && !M ? [u("motionLight.flow.minOn").replace("{t}", fi(i.minUntil, t.now))] : [],
      ...i != null && i.present && i.holdUntil !== void 0 && !M ? [u("motionLight.flow.held").replace("{until}", fi(i.holdUntil, t.now))] : [],
      ...(i == null ? void 0 : i.left) !== void 0 && !M ? [u("motionLight.flow.left").replace("{name}", () => i.left)] : [],
      ...i != null && i.waiting && !M ? [u("motionLight.flow.waiting")] : []
    ]
  }), v({
    field: "motionlight-mode",
    cls: i ? j(!x) : "",
    lines: i ? [
      `${u("motionLight.flow.mode")}: ${u(x ? "motionLight.flow.manual" : e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.auto")}`,
      ...x ? [i.autoAt !== void 0 ? u("motionLight.flow.autoIn").replace("{t}", fi(i.autoAt, t.now)) : u("motionLight.flow.byButton")] : []
    ] : [u("motionLight.flow.mode"), u(e.buttons.length === 0 ? "motionLight.flow.autoNoButton" : "motionLight.flow.byButton")]
  });
  const k = n == null ? void 0 : n.last, S = [
    t.deviceName(e.light),
    i ? u("timed.flow.state").replace("{s}", i.light ?? ie(null)) : u("outside.flow.onOff"),
    ...k ? [_0(k)] : []
  ];
  v({
    field: "motionlight-light",
    cls: i ? j(i.light === null ? null : i.light === "on") : "",
    lines: S,
    err: k == null ? void 0 : k.error,
    tip: k ? [...S, ...k.error ? [k.error] : [], k.reason].join(`
`) : void 0
  });
  const C = w - W + F, A = (I) => et({ ...I, focused: t.focused === I.field, onClick: () => t.onFocus(I.field) }), N = n && n.status !== "ok" ? n.status === "error" && n.reason ? `${u("rules.status.error")}: ${n.reason}` : u(`rules.status.${n.status}`) : null;
  return g`
    <div class="flow">
      <svg class="vt" style=${`max-width:${no}px`} viewBox=${`0 0 ${no} ${C}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("motionLight.flow.title")}>
        ${_`<path class="fc-link" d=${p.join(" ")}></path>`}
        ${d.map(A)}
      </svg>
      ${N ? g`<p class="fc-warn" data-note="status">${N}</p>` : $}
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
function S0(t) {
  var l;
  const e = t.draft.rule, n = e.motionLight, i = [];
  n.light || i.push({ key: "pick-light", text: u("motionLight.problem.light") });
  const o = [...i], s = n.light && !t.lights.some((a) => a.id === n.light) || n.sensors.some((a) => !t.sensors.some((c) => c.id === a)) || n.buttons.some((a) => !t.buttons.some((c) => c.id === a)) || n.daylight && !t.daylightSensors.some((a) => a.id === n.daylight.sensor) || n.blocker && !t.blockers.some((a) => a.id === n.blocker.device), r = !n.sensors.includes(n.light) && !n.buttons.includes(n.light) && ((l = n.blocker) == null ? void 0 : l.device) !== n.light && [n.minOn, n.autoAfter].every(Number.isInteger) && n.minOn >= 0 && n.minOn <= 3600 && n.autoAfter >= 0 && n.autoAfter <= 1440;
  for (const a of t.problems)
    a === "device-missing" && !s || a === "motionLight" && i.length > 0 && r || o.push({ key: a, text: u(`rules.problem.${a}`) });
  return o;
}
function L0(t) {
  const e = t.draft.rule, n = e.motionLight, i = (d) => t.onChange({ ...e, motionLight: d }), o = (d) => {
    var p;
    return d === "" ? u("vent.pick") : ((p = t.deviceById(d)) == null ? void 0 : p.name) ?? u("rules.missingDevice");
  }, s = (d, p, m, w, v, b, y) => g`
    <div class="vnums">
      <label>${p}
        <input class="num" data-field=${`motionlight-${d}`} type="number" min=${w} max=${v} step="1"
          .value=${Q(Number.isFinite(m) ? String(m) : "")}
          @input=${(x) => b(Jr(x.target.value))} /></label>
      ${y ? g`<span class="muted">${y}</span>` : $}
    </div>`, r = n.buttons.length > 0 && n.autoAfter === 0 && !n.buttons.some((d) => {
    const p = t.buttons.find((m) => m.id === d);
    return !!p && zd(p);
  }), l = n.buttons.some((d) => {
    const p = t.buttons.find((m) => m.id === d);
    return (p == null ? void 0 : p.props.kind) === "wall_switch" && !p.props.autoByDoubleToggle;
  }), a = n.daylight, c = !a || t.daylightSensors.some((d) => d.id === a.sensor), h = n.blocker, f = !h || t.blockers.some((d) => d.id === h.device);
  return It({
    prefix: "motionlight",
    title: u("motionLight.title"),
    hint: u("motionLight.hint"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: S0(t),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel,
    form: g`
      <label class="rlabel">${u("motionLight.light")}</label>
      ${Un("motionlight-light", n.light, t.lights, (d) => i({ ...n, light: d }))}

      <label class="rlabel">${u("motionLight.buttons")}</label>
      ${Qi(t, "motionlight-buttons", "motionlight-button", n.buttons, t.buttons.filter((d) => d.id !== n.light), u("motionLight.addButton"), (d) => i({ ...n, buttons: d, ...d.length === 0 ? { autoAfter: 0 } : {} }))}
      <span class="muted">${u("motionLight.buttonsNote")}</span>
      ${l ? g`<span class="muted" data-note="motionlight-nodoubletoggle">${u("motionLight.noDoubleToggle")}</span>` : $}

      <label class="rlabel">${u("motionLight.sensors")}</label>
      ${Qi(t, "motionlight-sensors", "motionlight-sensor", n.sensors, t.sensors, u("motionLight.addSensor"), (d) => i({ ...n, sensors: d }))}
      <span class="muted">${u("motionLight.sensorsNote")}</span>

      <label class="rlabel">${u("motionLight.daylight")}</label>
      <div class="vnums">
        <select data-field="motionlight-daylight" data-value=${(a == null ? void 0 : a.sensor) ?? ""}
          @change=${(d) => {
      const p = d.target.value, { daylight: m, ...w } = n;
      i(p === "" ? w : { ...w, daylight: { sensor: p, is: (a == null ? void 0 : a.is) ?? "dark" } });
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
        <select data-field="motionlight-blocker" data-value=${(h == null ? void 0 : h.device) ?? ""}
          @change=${(d) => {
      const p = d.target.value, { blocker: m, ...w } = n;
      i(p === "" ? w : { ...w, blocker: { device: p, is: (h == null ? void 0 : h.is) ?? "on" } });
    }}>
          <option value="">${u("motionLight.blockerNone")}</option>
          ${f ? $ : g`<option value=${h.device}>${u("rules.missingDevice")}</option>`}
          ${t.blockers.filter((d) => d.id !== n.light).map((d) => g`<option value=${d.id}>${d.name}</option>`)}
        </select>
        ${h ? g`
          <select data-field="motionlight-blocker-is" data-value=${h.is}
            @change=${(d) => i({ ...n, blocker: { ...h, is: d.target.value } })}>
            <option value="on">${u("motionLight.blockerIsOn")}</option>
            <option value="off">${u("motionLight.blockerIsOff")}</option>
          </select>` : $}
      </div>
      ${h ? g`<span class="muted">${u("motionLight.blockerNote")}</span>` : $}

      ${s("off", u("motionLight.off"), e.offDelay, 0, Wi, (d) => t.onChange({ ...e, offDelay: d }), u("motionLight.offNote"))}
      ${s("minon", u("motionLight.minOn"), n.minOn, 0, 3600, (d) => i({ ...n, minOn: d }))}

      ${n.buttons.length > 0 ? s("autoafter", u("motionLight.autoAfter"), n.autoAfter, 0, 1440, (d) => i({ ...n, autoAfter: d }), u("motionLight.autoAfterNote")) : $}
      <label class="rnot rcheck"><input type="checkbox" data-field="motionlight-presence" .checked=${n.presence === !0}
        @change=${(d) => {
      const { presence: p, neighbours: m, ...w } = n;
      i(d.target.checked ? { ...w, presence: !0 } : w);
    }} /> ${u("motionLight.presence")}</label>
      ${n.presence === !0 ? g`<span class="muted" data-note="motionlight-neighbours">${t.neighbours.length > 0 ? u("motionLight.neighbours").replace("{list}", () => t.neighbours.map((d) => {
      var p;
      return `${((p = d.zone) == null ? void 0 : p.name) ?? u("motionLight.outside")} — ${d.sensors.map((m) => m.name).join(", ")}`;
    }).join("; ")) : u("motionLight.noNeighbours")}</span>` : $}
      ${r ? g`<p class="muted" data-note="motionlight-noauto">${u("motionLight.noAutoNote")}</p>` : $}`,
    diagram: A0({
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
function C0(t) {
  return t === "event" ? "control-source-0" : `control-${t.endsWith(":empty") ? t.slice(0, -6) : t.replace(":", "-")}`;
}
const mc = 20, I0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle", auto: "control.auto" }, E0 = (t) => t.error && !T$(t) ? u("control.flow.notSent").replace("{at}", $e(t.at)) : Kn(t) || t.sent !== !1 ? Fr(t) : Br(t);
function O0(t) {
  const { rule: e, trace: n } = t, i = e.control, o = i.sources.length, s = n && n.inputs.length === o ? n.inputs : null, r = n == null ? void 0 : n.control, l = r == null ? void 0 : r.event, a = J(s || i.sources.some(Se) ? 3 : 2), c = J(l != null && l.dropped ? 3 : 2), h = lh(o, a), f = o === 0 ? F : h.bottom + W, d = f + c + W, p = e.gate ? d + J(2) : f + c, m = p + W / 2, w = p + W, v = w + ih, b = zr(i), y = (me - 2 * F - (b.length - 1) * mc) / b.length, x = (E) => F + E * (y + mc), M = [...h.links];
  o > 0 && M.push(`M${Ce} ${h.busY(0)} V${f}`), e.gate && M.push(`M${Ce} ${f + c} V${d}`), M.push(`M${Ce} ${p} V${m} H${x(0) + y / 2} V${w}`, `M${Ce} ${m} H${x(b.length - 1) + y / 2} V${w}`);
  for (let E = 1; E < b.length - 1; E++) M.push(`M${Ce} ${m} H${x(E) + y / 2} V${w}`);
  const k = (E) => et({ ...E, focused: t.focused === E.field, onClick: () => t.onFocus(E.field) }), S = [
    u("control.flow.event"),
    // An event of a purpose-built rule is worded by that rule's event ("... heating done"), any other by the action list it ran.
    l ? u("control.flow.eventLine").replace("{source}", l.source).replace("{what}", l.origin ? u(`control.event.${l.origin.what}`) : u(`control.do.${l.what}`)).replace("{at}", $e(l.at)) : u("control.flow.noEvent"),
    ...l != null && l.dropped ? [u("control.flow.dropped")] : []
  ], C = (E) => {
    var D;
    return (D = r == null ? void 0 : r.devices.find((H) => H.id === E)) == null ? void 0 : D.state;
  }, A = n == null ? void 0 : n.last, N = (E, D) => A && l && !l.dropped && l.what === E && A.target === t.nameOf(D.device) && (!xe(D.do) || A.action === D.do) ? A : void 0, U = (E, D, H, q, V) => {
    const re = C(D.device), Pe = N(E, D), Et = xe(D.do) ? `${u(`control.do.${D.do}`)}: ${(D.do === "play" ? D.media : D.text) ?? ""}` : u(`control.do.${D.do}`), Io = r && !xe(D.do) ? [u("control.flow.now").replace("{s}", re ?? u("control.flow.noData"))] : [], Jt = [t.nameOf(D.device), Et, ...Io, ...Pe ? [E0(Pe)] : []], nl = J(Jt.length + (Pe != null && Pe.error ? 1 : 0));
    return { svg: k({ x: q, y: V, w: y, h: nl, field: `${E}:${H}`, cls: r ? j(re == null ? null : re === "on" || re === "open") : "", lines: Jt, err: Pe == null ? void 0 : Pe.error }), h: nl };
  }, I = b.map((E, D) => {
    const H = i[E] ?? [], q = x(D), V = _`<text class="fc-head" text-anchor="middle" x=${q + y / 2} y=${w + 14}>${u(I0[E])}</text>`;
    if (H.length === 0) {
      const Et = J(1);
      return { bottom: v + Et, body: _`${V}${k({ x: q, y: v, w: y, h: Et, field: `${E}:empty`, cls: " muted", lines: [u("control.flow.nothing")] })}` };
    }
    let re = v;
    const Pe = H.map((Et, Io) => {
      const Jt = U(E, Et, Io, q, re);
      return re += Jt.h + yn, Jt.svg;
    });
    return { bottom: re - yn, body: _`${V}${Pe}` };
  }), O = Math.max(...I.map((E) => E.bottom)) + F;
  return g`
    <div class="flow">
      <svg class="fc" style=${`max-width:${me * Jd}px`} viewBox=${`0 0 ${me} ${O}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label=${u("control.flow.title")}>
        ${M.map((E) => _`<path class="fc-link" d=${E}></path>`)}
        ${i.sources.map((E, D) => {
    var re;
    const H = s == null ? void 0 : s[D], q = H && H.detail !== "" && "source" in E ? oh(H, t.now, E.source) : Se(E) || H == null ? void 0 : H.detail, V = u("control.gives").replace("{what}", (H == null ? void 0 : H.gives) ?? t.gives(E));
    return k({
      x: h.xs[D],
      y: h.inY(D),
      w: at,
      h: a,
      field: `source:${D}`,
      cls: H && !Ge(E) && !Se(E) ? j(H.value) : "",
      lines: Se(E) ? [...((re = t.eventLines) == null ? void 0 : re.call(t, E)) ?? [t.sourceLabel(E)], V] : [`${"not" in E && E.not ? "NOT " : ""}${(H == null ? void 0 : H.label) ?? t.sourceLabel(E)}`, ...q ? [q] : [], V]
    });
  })}
        ${k({
    x: (me - ot) / 2,
    y: f,
    w: ot,
    h: c,
    field: "event",
    cls: l != null && l.dropped ? " nodata" : "",
    lines: S
  })}
        ${e.gate ? k({
    x: (me - ot) / 2,
    y: d,
    w: ot,
    h: J(2),
    field: "gate",
    cls: n != null && n.gate ? j(n.gate.value) : "",
    lines: rh(e.gate, t.sourceLabel(e.gate), n == null ? void 0 : n.gate, t.now)
  }) : $}
        ${I.map((E) => E.body)}
      </svg>
      ${t.note ? g`<p class="fc-note">${t.note}</p>` : $}
    </div>`;
}
const D0 = { on: "control.whenOn", off: "control.whenOff", toggle: "control.whenToggle", auto: "control.auto" };
function N0(t, e, n) {
  if (e !== "auto") return { ...t, [e]: n };
  const { auto: i, ...o } = t;
  return n.length > 0 ? { ...o, auto: n } : o;
}
function gh(t, e) {
  var i;
  if (Se(e)) return "on";
  if (!Ge(e)) return "on / off";
  const n = (i = t.deviceById(e.button)) == null ? void 0 : i.props;
  return (n == null ? void 0 : n.kind) === "smart_button" && n.separateOff ? "on / off" : "toggle";
}
const bh = (t, e) => {
  const n = t.ruleName(e.event.rule);
  return n === void 0 ? u("rules.missingRule") : Td(n, e.event.what);
};
function P0(t, e, n, i) {
  const o = `control-source-${n}`, s = g`<span class="muted" data-part="gives">${u("control.gives").replace("{what}", gh(t, e))}</span>`;
  if (Se(e)) {
    const l = t.otherRules.find((a) => a.id === e.event.rule);
    return g`
    <div class="rline${l && Hr(l).includes(e.event.what) ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${bh(t, e)}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
  }
  if (!Ge(e)) return Kr(t, e, o, i, s);
  const r = t.deviceById(e.button);
  return g`
    <div class="rline${(r == null ? void 0 : r.props.kind) === "smart_button" ? "" : " bad"}" data-field=${o} tabindex="-1">
      <span class="grow">${(r == null ? void 0 : r.name) ?? u("rules.missingDevice")}</span>
      ${s}
      <button class="btn" data-action="remove-input" title=${u("rules.remove")} @click=${() => i(null)}>&times;</button>
    </div>`;
}
function T0(t) {
  const e = t.draft.rule.control, n = [];
  return e.sources.length === 0 && n.push({ key: "pick-sources", text: u("control.problem.sources") }), zr(e).every((i) => (e[i] ?? []).length === 0) && n.push({ key: "pick-actions", text: u("control.problem.actions") }), [...n, ...t.problems.filter((i) => i !== "control" || n.length === 0).map((i) => ({ key: i, text: u(`rules.problem.${i}`) }))];
}
function V0(t) {
  const e = t.draft.rule, n = e.control, i = (f) => t.onChange({ ...e, control: { ...n, sources: f } }), o = (f) => {
    var d;
    return ((d = t.deviceById(f)) == null ? void 0 : d.name) ?? u("rules.missingDevice");
  }, s = t.buttons.filter((f) => !n.sources.some((d) => Ge(d) && d.button === f.id)), r = s.length > 0 ? g`<optgroup label=${u("control.group.buttons")}>
      ${s.map((f) => g`<option value=${`b:${f.id}`}>${f.name}</option>`)}
    </optgroup>` : void 0, l = t.otherRules.flatMap((f) => Hr(f).map((d) => ({ rule: f, what: d }))).filter((f) => !n.sources.some((d) => Se(d) && d.event.rule === f.rule.id && d.event.what === f.what)), a = l.length > 0 ? g`<optgroup label=${u("control.group.events")}>
      ${l.map((f) => g`<option value=${`e:${f.rule.id}:${f.what}`}>${Td(f.rule.name, f.what)}</option>`)}
    </optgroup>` : void 0, c = (f) => {
    const d = f.target;
    if (d.value.startsWith("e:")) {
      const [, m, w] = d.value.split(":");
      d.value = "", i([...n.sources, { event: { rule: m, what: w } }]);
      return;
    }
    if (!d.value.startsWith("b:")) {
      Xr(t, (m) => i([...n.sources, { source: m }]))(f);
      return;
    }
    const p = d.value.slice(2);
    d.value = "", i([...n.sources, { button: p }]);
  }, h = g`
    <div class="rsettings">
      <p class="muted">${u("control.hint")}</p>
      ${fh(t)}

      <div class="rgroup">
        <div class="rlabel">${u("control.sources")}</div>
        ${n.sources.map((f, d) => P0(
    t,
    f,
    d,
    (p) => i(p ? n.sources.map((m, w) => w === d ? p : m) : n.sources.filter((m, w) => w !== d))
  ))}
        <select class="radd" data-action="add-source" .value=${""} @change=${c}>
          ${Gr(t, u("control.addSource"), g`${r}${a}`)}
        </select>
      </div>

      ${hh(t, u("control.gate"), "control-gate", u("control.gateNote"))}

      ${zr(n).map((f) => dh(t, {
    label: u(D0[f]),
    addText: u("control.addAction"),
    add: `add-action-${f}`,
    addField: `control-${f}`,
    field: (d) => `control-${f}-${d}`,
    list: n[f] ?? [],
    set: (d) => t.onChange({ ...e, control: N0(n, f, d) }),
    actionsFor: $n,
    firstDo: (d) => f !== "auto" && $n(d).includes(f) ? f : $n(d)[0],
    doText: (d) => u(`control.do.${d}`),
    unique: !0
  }))}
    </div>`;
  return ph({
    title: u("control.title"),
    rule: e,
    zones: t.zones,
    problems: t.problems,
    texts: T0(t),
    form: h,
    diagram: O0({
      rule: e,
      trace: t.trace,
      note: t.note,
      now: t.now,
      nameOf: o,
      sourceLabel: (f) => Ge(f) ? o(f.button) : Se(f) ? bh(t, f) : Zr(t, f),
      eventLines: (f) => Se(f) ? [t.ruleName(f.event.rule) ?? u("rules.missingRule"), u(`control.event.${f.event.what}`)] : [],
      gives: (f) => gh(t, f),
      focused: t.draft.focused,
      onFocus: t.onFocus
    }),
    onChange: t.onChange,
    onOk: t.onOk,
    onCancel: t.onCancel
  });
}
const H0 = ["power", "voltage", "power_in", "power_out", "control"], z0 = 300;
function gc(t) {
  t().catch(() => {
  });
}
function R0(t, e) {
  var o;
  const n = new Map(e.devices.map((s) => [s.id, s])), i = {};
  for (const s of t.blocks) {
    const r = s.kind === "device" ? n.get(s.deviceId) : void 0;
    if (!r) continue;
    const l = { inverter: Yt(r), controllable: ou(r) };
    for (const a of H0) {
      const c = (o = r.bindings) == null ? void 0 : o[a];
      c && (l[a] = c);
    }
    i[r.id] = l;
  }
  return { power: t, devices: i };
}
class B0 {
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
      }, z0);
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
    this.sub = null, n && (n.live = !1, e && n.unsub && gc(n.unsub));
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
          gc(s);
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
    this.retries >= Wr || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Ur));
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
const fs = 1e4, bc = 400, F0 = 1e3, wc = /* @__PURE__ */ new Set(["", "unknown", "unavailable"]), U0 = ["timer", "power"], W0 = (t, e) => {
  const n = t == null ? void 0 : t[e];
  return n && typeof n == "object" && typeof n.state == "string" ? n : void 0;
};
function j0(t, e) {
  return t === 0 ? e : `${t}_${e}`;
}
function vc(t) {
  var n;
  if (t.props.kind !== "smart_button") return [];
  const e = [];
  for (const { role: i } of Le(t)) {
    if (i !== "on" && i !== "off" && i !== "auto") continue;
    const o = (n = t.bindings) == null ? void 0 : n[i], s = t.props[i];
    o && s && typeof s.event == "string" && s.event && e.push({ entity: o, value: j0(s.slot, s.event) });
  }
  return e;
}
function wh(t) {
  const e = t.bindings ?? {}, n = t.props.kind, i = [], o = (s, r, l = !1) => {
    s && !i.some((a) => a.entity === s) && i.push({ entity: s, settled: r, valve: l });
  };
  if (n === "smart_button")
    for (const { role: s } of Le(t)) (s === "on" || s === "off" || s === "auto") && o(e[s], !1);
  else n === "wall_switch" ? o(e.state, !0) : n === "valve" && o(e.state, !0, !0);
  return i;
}
function q0(t, e) {
  if (t === "on" || e && t === "open") return e ? "open" : "on";
  if (t === "off" || e && t === "closed") return e ? "closed" : "off";
}
function Z0(t, e, n) {
  var i;
  if (t.settled) {
    const o = q0(e.state, t.valve);
    return o === void 0 ? {} : { value: o, text: n && n.last !== o ? o : void 0 };
  }
  if (t.entity.startsWith("event.")) {
    if (wc.has(e.state)) return {};
    const o = (i = e.attributes) == null ? void 0 : i.event_type, s = n && n.last !== e.state && typeof o == "string" && o !== "";
    return { value: e.state, text: s ? o : void 0 };
  }
  return { value: e.state, text: n && n.last !== e.state && !wc.has(e.state) ? e.state : void 0 };
}
function $c(t, e, n, i) {
  const o = e === "timer" ? { look: t.look, timerSince: t.timerSince } : { look: t.look, power: t.power };
  return ad(o, n, i)[0];
}
function G0(t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t.devices) for (const i of wh(n)) e.add(i.entity);
  return [...e].sort();
}
class K0 {
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
    return i && n - i.at < fs ? i : null;
  }
  /**
   * Bubbles that ended under FADE_MS ago (shown fading with their text at the exit time), and the action bubble
   * for EVENT_FADE_WINDOW_MS after its EVENT_MS ran out; else [].
   */
  leaving(e, n) {
    const i = (this.leave.get(e) ?? []).filter((r) => n - r.at < bc).map((r) => r.bubble), o = this.events.get(e), s = o ? n - o.at : -1;
    return o && s >= fs && s < fs + F0 && i.push({ text: o.text, tone: o.tone, key: o.at }), i;
  }
  updateEvents(e, n, i, o) {
    const s = wh(n), r = `${n.id}|`, l = new Set(s.map((a) => r + a.entity));
    for (const a of [...this.seen.keys()]) a.startsWith(r) && !l.has(a) && this.seen.delete(a);
    for (const a of s) {
      const c = W0(i, a.entity);
      if (!c) continue;
      const h = r + a.entity, { value: f, text: d } = Z0(a, c, this.seen.get(h));
      if (f !== void 0 && this.seen.set(h, { last: f }), !!d) {
        if (n.props.kind !== "smart_button") {
          this.events.set(n.id, { text: d, at: o, tone: "event" });
          continue;
        }
        vc(n).some((p) => p.entity === a.entity && p.value === d) ? this.events.set(n.id, { text: d, at: o, tone: "event" }) : e.devices.some((p) => p !== n && vc(p).some((m) => m.entity === a.entity && m.value === d)) || this.events.set(n.id, { text: u("live.noTrigger").replace("{action}", d), at: o, tone: "unmatched" });
      }
    }
  }
  updateBubbles(e, n, i) {
    const o = vi(e, n), s = this.bubbles.get(e.id);
    if (s) {
      const r = (this.leave.get(e.id) ?? []).filter((l) => i - l.at < bc);
      for (const l of U0) {
        const a = $c(s, l, e, i);
        a && !$c(o, l, e, i) && r.push({ bubble: a, at: i });
      }
      r.length ? this.leave.set(e.id, r) : this.leave.delete(e.id);
    }
    this.bubbles.set(e.id, o);
  }
}
const pi = (t) => typeof t == "number" && Number.isFinite(t) ? new Date(t * 1e3).toISOString() : void 0;
function yc(t) {
  t().catch(() => {
  });
}
class X0 {
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
    this.sub = null, n && (n.live = !1, e && n.unsub && yc(n.unsub));
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
        n.live ? n.unsub = i : yc(i);
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
function xc(t) {
  t().catch(() => {
  });
}
class Y0 {
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
    for (const [o, s] of this.map) i[En(o)] = { state: s.state, attributes: {}, last_changed: s.since };
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
    this.sub = null, n && (n.live = !1, e && n.unsub && xc(n.unsub));
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
          xc(o);
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
    this.retries >= Xd || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, Kd));
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
class Q0 {
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
      const { version: i } = await qg({ connection: e });
      if (n !== this.run || typeof i != "string" || !i) return;
      const o = i === this.bundleVersion ? null : i;
      if (o === null && this.serverVersion !== null) return;
      o !== this.serverVersion && (this.serverVersion = o, this.onChange());
    } catch {
      if (n !== this.run || this.retries >= Wr) return;
      this.retries++, this.timer = setTimeout(() => {
        this.timer = null, this.check();
      }, Ur);
    }
  }
}
var J0 = Object.defineProperty, Y = (t, e, n, i) => {
  for (var o = void 0, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = r(e, n, o) || o);
  return o && J0(e, n, o), o;
};
const ex = "0.30.0", tl = class tl extends zt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.automationsMenu = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = ef.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = $1(), this.nextObj = Qw(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.ruleDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Tu(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new vy(), this.resizeObs = null, this.session = new l$(this), this.haMeta = new a$(this), this.feed = new $y(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.rulesFeed = new H$(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.virtualFeed = new Y0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new B0(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.hint = new ab(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, (i) => {
      var s;
      const o = this.power.blocks.find((r) => r.id === i);
      return o && this.mode === "power" ? lb(o, this.ctx.geo(), (s = this.powerFeed.frame) == null ? void 0 : s.blocks[i]) : [];
    }), this.events = new K0(), this.entityFeed = new X0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, () => this.onEntities()), this.reloadPage = () => location.reload(), this.updateCheck = new Q0(() => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }, ex, () => this.requestUpdate()), this.trackedLevel = null, this.ticker = null, this.bindStatus = (i) => Zh(i, (o) => Pu(this.haMeta.get(), o, this.liveStates)), this.onBeforeUnload = (i) => {
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
    this.save = new ub(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = c$(this), this.activeTool = Ds("select", this.ctx), this.input = new py(this);
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
    this.entityFeed.watch(e ? G0(e) : null);
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
    this.powerFeed.watch(e && this.plan ? this.plan.id : null, e ? R0(this.power, e) : null);
  }
  /** The 1 s ticker runs only while a shown Binding bubble changes by itself (timer, event, fade-out). */
  syncTicker() {
    var r, l, a, c, h, f, d, p, m, w, v, b, y, x;
    const e = (r = this.history) == null ? void 0 : r.current.level, n = Date.now(), i = this.isConnected && (this.mode === "binding" || this.mode === "automation") && !!e && !!this.hass && e.devices.some((M) => vi(M, this.liveStates).timerSince !== void 0 || this.events.event(M.id, n) !== null || this.events.leaving(M.id, n).length > 0), o = this.modal && this.ruleDraft ? this.shownRuleTrace(this.ruleDraft.rule) : void 0, s = !!o && (!!o.pending || o.inputs.some((M) => M.until !== void 0 && M.until > n) || (((l = o.gate) == null ? void 0 : l.until) ?? 0) > n || (((a = o.boiler) == null ? void 0 : a.until) ?? 0) > n || (((c = o.boiler) == null ? void 0 : c.settling) ?? 0) > n || ((h = o.timed) == null ? void 0 : h.running) === !0 && (o.timed.until ?? 0) > n || [(f = o.outside) == null ? void 0 : f.pausedUntil, (d = o.outside) == null ? void 0 : d.until, (p = o.outside) == null ? void 0 : p.windowUntil, (m = o.beurer) == null ? void 0 : m.pausedUntil, (w = o.beurer) == null ? void 0 : w.cycleAt, (v = o.beurer) == null ? void 0 : v.keptUntil, (b = o.motionLight) == null ? void 0 : b.offAt, (y = o.motionLight) == null ? void 0 : y.minUntil, (x = o.motionLight) == null ? void 0 : x.autoAt].some((M) => (M ?? 0) > n));
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
    const i = this.history.current.power, o = n ?? (i && Qp(i, e));
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
      const r = this.planLevels(), l = ((o = this.selection) == null ? void 0 : o.kind) === "zone" ? this.selection.id : null, a = r.flatMap((d) => d.zones).find((d) => d.id === l), c = ((s = this.selection) == null ? void 0 : s.kind) === "device" ? r.flatMap((d) => d.devices).find((d) => d.id === this.selection.id) : void 0, h = (a == null ? void 0 : a.id) ?? null;
      i = { rule: e === "leak" ? vv({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "timer" ? Kv({}, h, c && es(c) ? c.id : null, c && es(c) ? c.name : "") : e === "outside" ? Vv({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "control" ? Ov({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "beurer" ? Pv(h, (a == null ? void 0 : a.name) ?? null) : e === "motionLight" ? Rv({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "vent" ? Zv({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "timed" ? Bv({ levels: r }, h, (a == null ? void 0 : a.name) ?? null) : e === "boiler" ? Wv({ levels: r, power: { ...this.power, blocks: this.boilerGridBlocks() } }, h, (a == null ? void 0 : a.name) ?? null) : Ue(h), isNew: !0, focused: null };
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
    e.isNew ? this.commitRules(sv(this.rules, e.rule)) : n && !ki(n, e.rule) && this.commitRules(rv(this.rules, e.rule));
  }
  /**
   * The live trace a rule dialog shows: only for a rule equal to its saved copy (not an OK-confirmed but unsaved
   * edit), since after an edit the values would land on the wrong blocks. The 1 s ticker follows the same trace.
   */
  shownRuleTrace(e) {
    const n = this.session.savedRules.find((i) => i.id === e.id);
    return n && ki(n, e) ? this.rulesFeed.trace(e.id) : void 0;
  }
  renderRuleDialogNow() {
    const e = this.ruleDraft;
    if (!this.modal || !e || !this.plan) return $;
    const n = this.planLevels(), i = n.flatMap((d) => d.devices), o = e.rule, s = this.session.savedRules.find((d) => d.id === o.id), r = this.shownRuleTrace(o), l = s ? ki(s, o) ? null : u("rules.flow.edited") : u("rules.flow.new"), a = n.length > 1, c = n.flatMap((d) => d.zones.map((p) => ({ id: p.id, name: a ? `${p.name} (${d.name})` : p.name }))), h = pv(
      this.rules,
      o,
      (d) => i.some((p) => p.id === d),
      (d) => {
        const p = i.find((m) => m.id === d);
        return p && te(p);
      },
      (d) => i.some((p) => p.id === d && p.props.kind === "illuminance_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "climate_sensor"),
      (d) => i.some((p) => p.id === d && Ts(p)),
      (d) => i.some((p) => p.id === d && (p.props.kind === "wall_switch" || p.props.kind === "smart_button")),
      (d) => this.boilerGridBlocks().some((p) => p.id === d),
      (d) => {
        const p = i.find((m) => m.id === d);
        return !p || zd(p);
      },
      (d) => i.some((p) => p.id === d && p.props.kind === "leak_sensor"),
      (d) => i.some((p) => p.id === d && p.props.kind === "valve"),
      (d) => i.some((p) => p.id === d && (p.props.kind === "wall_switch" || p.props.kind === "smart_button")),
      (d) => i.some((p) => p.id === d && te(p).includes("on")),
      (d) => i.some((p) => p.id === d && te(p).includes("on")),
      (d) => i.some((p) => p.id === d && te(p).includes("on")),
      (d) => i.some((p) => {
        var m;
        return p.id === d && !!((m = p.bindings) != null && m.power);
      }),
      (d) => i.some((p) => p.id === d && p.props.kind === "smart_button"),
      (d) => i.some((p) => p.id === d && $n(p).length > 0),
      (d) => i.some((p) => p.id === d && te(p).includes("on") && te(p).includes("off")),
      (d) => i.some((p) => p.id === d && p.props.kind === "motion_sensor"),
      (d) => i.some((p) => p.id === d && Na(p)),
      (d) => i.some((p) => p.id === d && p.props.kind === "virtual_switch"),
      (d) => i.some((p) => p.id === d && Da(p))
    );
    if (Uv(o))
      return Gy({
        draft: e,
        boilers: i.filter(Ts),
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        grids: this.boilerGridBlocks().map((d) => ({ id: d.id, name: d.name || u("power.kind.grid") })),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Ry[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (wv(o))
      return Jy({
        draft: e,
        sensors: i.filter((d) => d.props.kind === "leak_sensor"),
        valves: i.filter((d) => d.props.kind === "valve"),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, Ky(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (xv(o))
      return l0({
        draft: e,
        buttons: i.filter((d) => d.props.kind === "wall_switch" || d.props.kind === "smart_button"),
        devices: i.filter((d) => te(d).includes("on")),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
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
    if (Tv(o))
      return p0({
        draft: e,
        lights: i.filter((d) => te(d).includes("on")),
        sensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, a0[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (zv(o))
      return L0({
        draft: e,
        lights: i.filter((d) => {
          const p = te(d);
          return p.includes("on") && p.includes("off");
        }),
        sensors: i.filter((d) => d.props.kind === "motion_sensor"),
        daylightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
        buttons: i.filter(Na),
        blockers: i.filter(Da),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        neighbours: o.motionLight.presence === !0 ? Fd(n, o.zoneId, o.motionLight.sensors) : [],
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, x0(d)),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (Nv(o))
      return $0({
        draft: e,
        heaters: i.filter((d) => te(d).includes("on")),
        sources: i.filter((d) => {
          var p;
          return !!((p = d.bindings) != null && p.power);
        }),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
        trace: r,
        note: l,
        now: Date.now(),
        onChange: (d) => {
          this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
        },
        onFocus: (d) => this.focusRuleField(d, m0[d] ?? d),
        onOk: () => this.commitRuleDraft(),
        onCancel: () => {
          this.dialog = null, this.ruleDraft = null;
        }
      });
    if (jv(o))
      return zy({
        draft: e,
        climateSensors: i.filter((d) => d.props.kind === "climate_sensor"),
        fans: i.filter((d) => {
          const p = te(d);
          return p.includes("on") && p.includes("off");
        }),
        deviceById: (d) => i.find((p) => p.id === d),
        zones: c,
        problems: h,
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
    const f = {
      draft: e,
      inputDevices: i.filter(es),
      lightSensors: i.filter((d) => d.props.kind === "illuminance_sensor"),
      lightUnit: (d) => {
        var w, v, b, y;
        const p = (v = (w = i.find((x) => x.id === d)) == null ? void 0 : w.bindings) == null ? void 0 : v.illuminance, m = p ? (b = this.liveStates) == null ? void 0 : b[p] : void 0;
        return (y = m == null ? void 0 : m.attributes) == null ? void 0 : y.unit_of_measurement;
      },
      actionDevices: i.filter((d) => te(d).length > 0),
      deviceById: (d) => i.find((p) => p.id === d),
      // A Load control rule has no verdict, so it is never offered as a source (a rule that already reads one keeps its row).
      otherRules: this.rules.filter((d) => d.id !== o.id && !Oa(d)),
      ruleName: (d) => {
        var p;
        return (p = this.rules.find((m) => m.id === d)) == null ? void 0 : p.name;
      },
      zones: c,
      problems: h,
      trace: r,
      note: l,
      now: Date.now(),
      onChange: (d) => {
        this.ruleDraft = { ...this.ruleDraft ?? e, rule: d };
      },
      onFocus: (d) => this.focusRuleField(d),
      onUnit: (d, p) => {
        const m = this.ruleDraft ?? e;
        this.ruleDraft = { ...m, units: { ...m.units, [d]: p } };
      },
      onOk: () => this.commitRuleDraft(),
      onCancel: () => {
        this.dialog = null, this.ruleDraft = null;
      }
    };
    return Oa(o) ? V0({
      ...f,
      actionDevices: i.filter((d) => $n(d).length > 0),
      buttons: i.filter((d) => d.props.kind === "smart_button"),
      onFocus: (d) => this.focusRuleField(d, C0(d))
    }) : Py(f);
  }
  /** Deletes the rule a 'delete-rule' dialog asked about (undoable until the plan is saved). */
  confirmDeleteRule() {
    const e = this.dialog;
    this.dialog = null, (e == null ? void 0 : e.kind) === "delete-rule" && this.commitRules(lv(this.rules, e.id));
  }
  dropStaleSelection() {
    this.history && this.selection && !Jo(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Power step deletes power blocks and wires only.
   */
  deleteSelection() {
    const e = this.selection, n = this.level;
    if (this.mode === "binding" || this.mode === "automation" || !e || !n || e.kind === "node" || !Jo(n, e, this.power)) return !1;
    if (this.mode === "power") return this.deletePower(e);
    if (e.kind === "powerBlock" || e.kind === "powerWire") return !1;
    if (e.kind === "device") {
      const i = Ru(n, this.power, e.id);
      return this.commit(i.level, i.power), !0;
    }
    return this.commit(e.kind === "wall" ? br(n, e.id) : e.kind === "opening" ? eu(n, e.id) : Lu(n, e.id)), !0;
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(e) {
    const n = this.power;
    if (e.kind === "powerWire")
      return this.commitPower(Fu(n, e.id)), !0;
    if (e.kind !== "powerBlock") return !1;
    const i = Hu(n, e.id);
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
    this.selection = o && n && i && Jo(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(e) {
    this.wallType = e;
  }
  pickTool(e) {
    this.modal || (this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, e === "box" && (this.wallType = "bearing"), this.toolId = e, this.activeTool = Ds(e, this.ctx));
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
    e === this.mode || this.modal || (this.mode === "power" && (this.placeDeviceId = null), this.automationsMenu = null, this.mode = e, this.pickTool(Tr(e)[0]), (e === "binding" || e === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(e) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: e });
    const o = de(n, i);
    o && (this.view = Wa(this.view, o.pt, this.size.w, this.size.h));
  }
  /** Selects a zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(e) {
    const n = this.level, i = n == null ? void 0 : n.zones.find((s) => s.id === e);
    if (!n || !i) return;
    this.ctx.select({ kind: "zone", id: e });
    const o = xu(n).get(e);
    o && (this.view = Wa(this.view, o, this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const e = this.level, n = e ? Gw(e, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return sy(this.svgEl(), this.view, e);
  }
  /** Power step pointer move without a button: the block under the pointer (not a bus, wire or empty space) rests for the hint. */
  hintHover(e) {
    if (this.mode !== "power") return;
    const n = Ls(this.power, this.toMm(e), this.ctx.tolMm(), this.ctx.geo()), i = (n == null ? void 0 : n.kind) === "block" ? n.id : (n == null ? void 0 : n.kind) === "port" || (n == null ? void 0 : n.kind) === "chip" ? n.block : null;
    this.hint.move(i !== null && this.hint.meterCount(i) > 0 ? i : null);
  }
  /** The open hover hint over the canvas: its lines beside the hovered block (screen pixels of the canvas). */
  renderHint(e) {
    const n = this.hint.openId, i = this.hint.lines(e), o = n === null ? void 0 : this.power.blocks.find((h) => h.id === n);
    if (!i || !o) return $;
    const { x: s, y: r, scale: l } = this.view, a = De(o, this.ctx.geo(), this.power), c = jg({ x: (a.x - s) * l, y: (a.y - r) * l, w: a.w * l, h: a.h * l }, Wg(i), this.size);
    return g`<div class="power-hint" role="tooltip" style=${`left:${c.left}px;top:${c.top}px`}>
      ${i.map((h) => g`<div class="line">${h}</div>`)}</div>`;
  }
  fit() {
    var e;
    this.planView = ry(((e = this.level) == null ? void 0 : e.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const e = km(this.power, this.ctx.geo());
    e && (this.powerView = ly(e, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var e, n, i, o;
    return gy({
      dialog: this.dialog,
      draft: this.pendingDraft,
      planName: ((e = this.plan) == null ? void 0 : e.name) ?? "",
      ruleName: ((n = this.dialog) == null ? void 0 : n.kind) === "delete-rule" ? ((i = this.rules.find((s) => s.id === this.dialog.id)) == null ? void 0 : i.name) ?? "" : "",
      ruleUsers: ((o = this.dialog) == null ? void 0 : o.kind) === "delete-rule" ? dv(this.rules, this.dialog.id).map((s) => s.name) : [],
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
    var p, m, w;
    if (!this.plan || !this.history)
      return g`<div class="center">${this.loadError ? g`<span>${u("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${u("action.retry")}</button>` : u("load.loading")}</div>`;
    const e = lw(!!((m = (p = this.hass) == null ? void 0 : p.themes) != null && m.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: o, y: s, scale: r } = this.view, l = Math.max(1, this.size.w) / r, a = Math.max(1, this.size.h) / r, c = this.save, h = this.mode === "power", f = Date.now(), d = this.liveStates;
    return g`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : h ? " power" : this.mode === "automation" ? " automation" : ""}"
        style=${ty(e)} ?data-update=${this.updateCheck.serverVersion !== null}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${this.updateCheck.serverVersion === null ? $ : g`<div class="update-bar" role="status">
          <span>${u("update.notice").replace("{version}", this.updateCheck.serverVersion)}</span>
          <button data-action="reload" @click=${() => this.reloadPage()}>${u("update.reload")}</button></div>`}
        ${Bw({
      steps: jw({
        mode: this.mode,
        level: n,
        status: this.bindStatus,
        power: this.power,
        rules: this.rules.length,
        planName: this.plan.name,
        onRename: (v) => {
          this.plan = { ...this.plan, name: v }, c.markDirty();
        },
        onMode: (v) => this.setMode(v)
      }),
      planId: this.plan.id,
      plans: this.session.planOptions(),
      canUndo: this.history.canUndo,
      canRedo: this.history.canRedo,
      saveState: c.state,
      dirty: c.dirty,
      errorMessage: c.errorMessage,
      lead: this.narrow ? g`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : $,
      onPickPlan: (v) => this.session.pickPlan(v),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${Z$(this, n)}
        ${K$(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${o} ${s} ${l} ${a}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${e.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort} @pointerleave=${() => this.hint.hide()}
            @lostpointercapture=${this.input.pointerAbort} @dblclick=${this.input.dblClick} @wheel=${this.input.wheel} @contextmenu=${(v) => v.preventDefault()}>
            ${this.grid ? uy(this.view, l, a, e, h ? 0.1 : 1) : $}
            ${this.mode === "power" ? Eg(this.power, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : ow(n, {
      palette: e,
      selection: this.selection,
      preview: i,
      scale: r,
      mode: this.mode,
      showCones: this.cones,
      bindingStatus: this.bindStatus,
      containerState: (v) => this.feed.stateOf(v),
      live: (v) => vi(v, d),
      bubbles: (v) => {
        const b = vi(v, d), y = this.events.event(v.id, f);
        return {
          shown: [...yy(this.session.savedRules, (x) => this.rulesFeed.trace(x), v.id), ...ad(b, v, f), ...y ? [{ text: y.text, tone: y.tone, key: y.at }] : []],
          leaving: this.events.leaving(v.id, f)
        };
      }
    })}
            ${i.tracker ? J$(i.tracker, {
      palette: e,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: ey(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : $}
          </svg>
          ${h ? this.renderHint(f) : $}
          ${this.pendingDraft && ((w = this.dialog) == null ? void 0 : w.kind) !== "restore" ? my({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : $}
        </div>
        ${Q$({
      grid: this.grid,
      zoomPct: Math.round(r * (h ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? u(`snap.${i.snap.kind}`) : null,
      onGrid: (v) => {
        this.grid = v;
      },
      cones: this.cones,
      onCones: (v) => {
        this.cones = v;
      },
      tool: this.toolId,
      zoneMethod: this.nextObj.zone.method,
      power: h
    })}
        ${this.automationsMenu ? q$(this.automationsMenu, (v) => this.pickAutomation(v), () => this.closeAutomationsMenu()) : $}
        ${this.renderDialog()}
        ${this.renderRuleDialogNow()}
      </div>`;
  }
};
tl.styles = ny;
let Z = tl;
Y([
  Ke({ attribute: !1 })
], Z.prototype, "hass");
Y([
  Ke({ type: Boolean })
], Z.prototype, "narrow");
Y([
  Ke({ attribute: !1 })
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
