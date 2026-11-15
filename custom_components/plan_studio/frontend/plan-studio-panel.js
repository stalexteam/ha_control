/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ve = globalThis, bi = Ve.ShadowRoot && (Ve.ShadyCSS === void 0 || Ve.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, vi = Symbol(), Xi = /* @__PURE__ */ new WeakMap();
let $o = class {
  constructor(t, n, i) {
    if (this._$cssResult$ = !0, i !== vi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (bi && t === void 0) {
      const i = n !== void 0 && n.length === 1;
      i && (t = Xi.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Xi.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const xa = (e) => new $o(typeof e == "string" ? e : e + "", void 0, vi), xo = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((i, s, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[o + 1], e[0]);
  return new $o(n, e, vi);
}, ka = (e, t) => {
  if (bi) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const i = document.createElement("style"), s = Ve.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = n.cssText, e.appendChild(i);
  }
}, Qi = bi ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const i of t.cssRules) n += i.cssText;
  return xa(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ma, defineProperty: _a, getOwnPropertyDescriptor: Aa, getOwnPropertyNames: Sa, getOwnPropertySymbols: Ea, getPrototypeOf: Ia } = Object, St = globalThis, Ji = St.trustedTypes, Pa = Ji ? Ji.emptyScript : "", Cn = St.reactiveElementPolyfillSupport, we = (e, t) => e, Ke = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Pa : null;
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
} }, $i = (e, t) => !Ma(e, t), ts = { attribute: !0, type: String, converter: Ke, reflect: !1, useDefault: !1, hasChanged: $i };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), St.litPropertyMetadata ?? (St.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Zt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = ts) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((n = Object.create(n)).wrapped = !0), this.elementProperties.set(t, n), !n.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, n);
      s !== void 0 && _a(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, n, i) {
    const { get: s, set: o } = Aa(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? ts;
  }
  static _$Ei() {
    if (this.hasOwnProperty(we("elementProperties"))) return;
    const t = Ia(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(we("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(we("properties"))) {
      const n = this.properties, i = [...Sa(n), ...Ea(n)];
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
      for (const s of i) n.unshift(Qi(s));
    } else t !== void 0 && n.push(Qi(t));
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
    return ka(t, this.constructor.elementStyles), t;
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
      const r = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : Ke).toAttribute(n, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, n) {
    var o, r;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : Ke;
      this._$Em = s;
      const d = l.fromAttribute(n, a.type);
      this[s] = d ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, n, i, s = !1, o) {
    var r;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = a.getPropertyOptions(t)), !((i.hasChanged ?? $i)(o, n) || i.useDefault && i.reflect && o === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(a._$Eu(t, i)))) return;
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
Zt.elementStyles = [], Zt.shadowRootOptions = { mode: "open" }, Zt[we("elementProperties")] = /* @__PURE__ */ new Map(), Zt[we("finalized")] = /* @__PURE__ */ new Map(), Cn == null || Cn({ ReactiveElement: Zt }), (St.reactiveElementVersions ?? (St.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis, es = (e) => e, Ye = ye.trustedTypes, ns = Ye ? Ye.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ko = "$lit$", kt = `lit$${Math.random().toFixed(9).slice(2)}$`, Mo = "?" + kt, Oa = `<${Mo}>`, Bt = document, xe = () => Bt.createComment(""), ke = (e) => e === null || typeof e != "object" && typeof e != "function", xi = Array.isArray, Ca = (e) => xi(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Ln = `[ 	
\f\r]`, de = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, is = /-->/g, ss = />/g, Nt = RegExp(`>|${Ln}(?:([^\\s"'>=/]+)(${Ln}*=${Ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), os = /'/g, rs = /"/g, _o = /^(?:script|style|textarea|title)$/i, Ao = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), b = Ao(1), A = Ao(2), ot = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), as = /* @__PURE__ */ new WeakMap(), Tt = Bt.createTreeWalker(Bt, 129);
function So(e, t) {
  if (!xi(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ns !== void 0 ? ns.createHTML(t) : t;
}
const La = (e, t) => {
  const n = e.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = de;
  for (let a = 0; a < n; a++) {
    const l = e[a];
    let d, u, c = -1, p = 0;
    for (; p < l.length && (r.lastIndex = p, u = r.exec(l), u !== null); ) p = r.lastIndex, r === de ? u[1] === "!--" ? r = is : u[1] !== void 0 ? r = ss : u[2] !== void 0 ? (_o.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Nt) : u[3] !== void 0 && (r = Nt) : r === Nt ? u[0] === ">" ? (r = s ?? de, c = -1) : u[1] === void 0 ? c = -2 : (c = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? Nt : u[3] === '"' ? rs : os) : r === rs || r === os ? r = Nt : r === is || r === ss ? r = de : (r = Nt, s = void 0);
    const h = r === Nt && e[a + 1].startsWith("/>") ? " " : "";
    o += r === de ? l + Oa : c >= 0 ? (i.push(d), l.slice(0, c) + ko + l.slice(c) + kt + h) : l + kt + (c === -2 ? a : h);
  }
  return [So(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Me {
  constructor({ strings: t, _$litType$: n }, i) {
    let s;
    this.parts = [];
    let o = 0, r = 0;
    const a = t.length - 1, l = this.parts, [d, u] = La(t, n);
    if (this.el = Me.createElement(d, i), Tt.currentNode = this.el.content, n === 2 || n === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = Tt.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(ko)) {
          const p = u[r++], h = s.getAttribute(c).split(kt), m = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: o, name: m[2], strings: h, ctor: m[1] === "." ? Ta : m[1] === "?" ? za : m[1] === "@" ? Da : dn }), s.removeAttribute(c);
        } else c.startsWith(kt) && (l.push({ type: 6, index: o }), s.removeAttribute(c));
        if (_o.test(s.tagName)) {
          const c = s.textContent.split(kt), p = c.length - 1;
          if (p > 0) {
            s.textContent = Ye ? Ye.emptyScript : "";
            for (let h = 0; h < p; h++) s.append(c[h], xe()), Tt.nextNode(), l.push({ type: 2, index: ++o });
            s.append(c[p], xe());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Mo) l.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(kt, c + 1)) !== -1; ) l.push({ type: 7, index: o }), c += kt.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const i = Bt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Jt(e, t, n = e, i) {
  var r, a;
  if (t === ot) return t;
  let s = i !== void 0 ? (r = n._$Co) == null ? void 0 : r[i] : n._$Cl;
  const o = ke(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), o === void 0 ? s = void 0 : (s = new o(e), s._$AT(e, n, i)), i !== void 0 ? (n._$Co ?? (n._$Co = []))[i] = s : n._$Cl = s), s !== void 0 && (t = Jt(e, s._$AS(e, t.values), s, i)), t;
}
class Na {
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
    const { el: { content: n }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? Bt).importNode(n, !0);
    Tt.currentNode = s;
    let o = Tt.nextNode(), r = 0, a = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let d;
        l.type === 2 ? d = new ki(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new Ra(o, this, t)), this._$AV.push(d), l = i[++a];
      }
      r !== (l == null ? void 0 : l.index) && (o = Tt.nextNode(), r++);
    }
    return Tt.currentNode = Bt, s;
  }
  p(t) {
    let n = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, n), n += i.strings.length - 2) : i._$AI(t[n])), n++;
  }
}
let ki = class Eo {
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
    t = Jt(this, t, n), ke(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== ot && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ca(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && ke(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Bt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: n, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Me.createElement(So(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(n);
    else {
      const r = new Na(s, this), a = r.u(this.options);
      r.p(n), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let n = as.get(t.strings);
    return n === void 0 && as.set(t.strings, n = new Me(t)), n;
  }
  k(t) {
    xi(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let i, s = 0;
    for (const o of t) s === n.length ? n.push(i = new Eo(this.O(xe()), this.O(xe()), this, this.options)) : i = n[s], i._$AI(o), s++;
    s < n.length && (this._$AR(i && i._$AB.nextSibling, s), n.length = s);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, n); t !== this._$AB; ) {
      const s = es(t).nextSibling;
      es(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var n;
    this._$AM === void 0 && (this._$Cv = t, (n = this._$AP) == null || n.call(this, t));
  }
};
class dn {
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
    if (o === void 0) t = Jt(this, t, n, 0), r = !ke(t) || t !== this._$AH && t !== ot, r && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = Jt(this, a[i + l], n, l), d === ot && (d = this._$AH[l]), r || (r = !ke(d) || d !== this._$AH[l]), d === v ? t = v : t !== v && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ta extends dn {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class za extends dn {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
let Da = class extends dn {
  constructor(t, n, i, s, o) {
    super(t, n, i, s, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Jt(this, t, n, 0) ?? v) === ot) return;
    const i = this._$AH, s = t === v && i !== v || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var n;
    typeof this._$AH == "function" ? this._$AH.call(((n = this.options) == null ? void 0 : n.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
};
class Ra {
  constructor(t, n, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Jt(this, t);
  }
}
const Nn = ye.litHtmlPolyfillSupport;
Nn == null || Nn(Me, ki), (ye.litHtmlVersions ?? (ye.litHtmlVersions = [])).push("3.3.3");
const Ba = (e, t, n) => {
  const i = (n == null ? void 0 : n.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (n == null ? void 0 : n.renderBefore) ?? null;
    i._$litPart$ = s = new ki(t.insertBefore(xe(), o), o, void 0, n ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = globalThis;
let Yt = class extends Zt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ba(n, this.renderRoot, this.renderOptions);
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
var vo;
Yt._$litElement$ = !0, Yt.finalized = !0, (vo = Dt.litElementHydrateSupport) == null || vo.call(Dt, { LitElement: Yt });
const Tn = Dt.litElementPolyfillSupport;
Tn == null || Tn({ LitElement: Yt });
(Dt.litElementVersions ?? (Dt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ha = { attribute: !0, type: String, converter: Ke, reflect: !1, hasChanged: $i }, Fa = (e = Ha, t, n) => {
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
function vt(e) {
  return (t, n) => typeof n == "object" ? Fa(e, t, n) : ((i, s, o) => {
    const r = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(e, t, n);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function z(e) {
  return vt({ ...e, state: !0, attribute: !1 });
}
function q() {
  const e = new Uint8Array(6);
  return crypto.getRandomValues(e), Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
}
function Mi(e, t) {
  const n = new Set(t);
  let i = 1;
  for (; n.has(`${e} ${i}`); ) i++;
  return `${e} ${i}`;
}
const Xt = { role: "power", domains: ["sensor"], deviceClasses: ["power"], units: ["W", "kW"], primary: !1 }, Ua = ["on", "off", "auto"], _i = (e) => Ua.includes(e), zn = (e) => ({
  role: e,
  domains: ["event", "sensor"],
  plainDomains: ["sensor"],
  categories: ["diagnostic"],
  primary: !0
}), Va = {
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
  smart_button: [zn("on"), zn("off"), zn("auto")],
  socket: [{ role: "control", domains: ["switch"], primary: !0 }, Xt],
  exhaust_fan: [{ role: "control", domains: ["switch", "fan"], primary: !0 }],
  equipment: [{ role: "control", domains: ["switch"], primary: !0 }, Xt]
}, Ai = (e) => {
  let t = 0;
  for (const n of e) n !== "bound" && t++;
  return t;
}, ja = { climate_sensor: "any" };
function Vt(e) {
  const t = e.props, n = Va[t.kind];
  return t.kind !== "smart_button" ? n : n.filter(({ role: i }) => i === "off" ? t.separateOff : i === "auto" ? t.autoEnabled : !0);
}
function Io(e) {
  return new Set(Vt(e).map((t) => t.role));
}
function Po(e, t, n, i) {
  var a;
  const s = e.devices.find((l) => l.id === t);
  if (!s || !Io(s).has(n)) return e;
  const o = (a = s.bindings) == null ? void 0 : a[n];
  if (i === null || i === "") {
    if (o === void 0) return e;
    const l = { ...s.bindings };
    delete l[n];
    const d = { ...s, bindings: l };
    return Object.keys(l).length === 0 && delete d.bindings, { ...e, devices: e.devices.map((u) => u === s ? d : u) };
  }
  if (o === i) return e;
  const r = { ...s, bindings: { ...s.bindings, [n]: i } };
  return { ...e, devices: e.devices.map((l) => l === s ? r : l) };
}
function Wa(e, t) {
  const n = e.bindings ?? {}, i = Object.values(n).filter((a) => !!a);
  if (i.length === 0) return "unbound";
  if (i.some((a) => t(a) === "missing")) return "missing";
  const s = Vt(e).filter((a) => a.primary), o = s.filter((a) => !!n[a.role]);
  return (ja[e.props.kind] === "any" ? o.length > 0 : o.length === s.length) ? "bound" : "partial";
}
function Za(e) {
  const t = Vt(e);
  return { filled: t.filter((n) => {
    var i;
    return !!((i = e.bindings) != null && i[n.role]);
  }).length, total: t.length };
}
const qa = (e) => e.slot === 0 ? e.event : `${e.slot}_${e.event}`;
function Jn(e, t) {
  var s;
  const n = (s = e.bindings) == null ? void 0 : s[t];
  if (!n) return null;
  const i = e.props;
  return i.kind !== "smart_button" || !_i(t) ? n : `${n}|${qa(i[t])}`;
}
function Ga(e, t, n) {
  const i = Jn(t, n);
  return i === null ? [] : e.devices.filter((s) => s.id !== t.id && Vt(s).some((o) => Jn(s, o.role) === i));
}
function Ka(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const { role: i } of Vt(e)) {
    const s = _i(i) ? Jn(e, i) : null;
    s !== null && (t.has(s) ? n.push(i) : t.add(s));
  }
  return n;
}
function Si(e) {
  if (!e.bindings) return e;
  const t = Io(e), n = Object.entries(e.bindings).filter(([s, o]) => t.has(s) && !!o);
  if (n.length > 0 && n.length === Object.keys(e.bindings).length) return e;
  const i = { ...e };
  return n.length ? i.bindings = Object.fromEntries(n) : delete i.bindings, i;
}
const ie = (e) => e === "wall_switch" || e === "smart_button", Ya = [100, 125, 150], Ei = "mdi:cube-outline", ls = ["single", "double", "hold"];
function F(e) {
  return e.automationZones ?? [];
}
const Xa = {
  bearing: 400
}, je = {
  opening: 900,
  door: 900,
  window: 1200,
  gate: 3e3,
  wicket: 1e3
};
function Oo(e = q(), t = "Level 1") {
  return { id: e, name: t, kind: "floor", order: 0, nodes: [], walls: [], openings: [], zones: [], devices: [] };
}
function cs(e) {
  return {
    id: q(),
    name: e,
    schemaVersion: 1,
    revision: 0,
    levels: [Oo()]
  };
}
const Ii = {
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
}, te = 90, Co = /* @__PURE__ */ new Set(["wall_light", "motion_sensor", "illuminance_sensor"]);
function Ht(e, t) {
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
      return { kind: e, shape: "rect", width: 600, depth: 600, diameter: 600, icon: Ei, label: "" };
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
const Qa = {
  boiler: "mdi:water-boiler",
  pc: "mdi:desktop-tower",
  automation: "mdi:server",
  other: Ei
};
function Ja(e) {
  const t = e.props;
  if (t.kind !== "equipment" || !("symbol" in t) && typeof t.icon == "string") return e;
  const { symbol: n, ...i } = t, s = typeof t.icon == "string" ? t.icon : Qa[String(n)] ?? Ei;
  return { ...e, props: { ...i, icon: s } };
}
function tl(e) {
  var n;
  if (e.props.kind !== "switch") return e;
  const t = (n = e.bindings) == null ? void 0 : n.action;
  return t ? { ...e, props: Ht("smart_button", e.placement.mode), bindings: { on: t } } : { ...e, props: Ht("wall_switch", e.placement.mode) };
}
const Lo = (e, t, n) => typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
function el(e, t) {
  const n = e !== null && typeof e == "object" ? e : {}, i = Lo(n.slot, 0, 9) ? n.slot : t.slot, s = typeof n.event == "string" && n.event ? n.event : t.event;
  return i === n.slot && s === n.event ? e : { slot: i, event: s };
}
function nl(e) {
  const t = e.props.kind;
  if (!ie(t)) return e;
  const n = e.props;
  let i = null;
  for (const [s, o] of Object.entries(Ht(t, e.placement.mode))) {
    const r = n[s], a = s === "on" || s === "off" || s === "auto" ? el(r, o) : s === "windowSec" ? Lo(r, 1, 10) ? r : o : typeof r == typeof o ? r : o;
    a !== r && ((i ?? (i = { ...n }))[s] = a);
  }
  return i ? { ...e, props: i } : e;
}
function il(e) {
  if (e.props.kind !== "climate_sensor" || !("zoneIds" in e.props)) return e;
  const { zoneIds: t, ...n } = e.props;
  return { ...e, props: n };
}
function sl(e) {
  if (!ie(e.props.kind) || !("defaultOutput" in e.props)) return e;
  const { defaultOutput: t, ...n } = e.props;
  return { ...e, props: n };
}
function ol(e) {
  if (!e.devices) return { ...e, devices: [] };
  const t = e.devices.map((n) => Si(il(sl(nl(tl(Ja(n)))))));
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
function J(e, t) {
  return e.x * t.y - e.y * t.x;
}
function No(e) {
  return Math.hypot(e.x, e.y);
}
function C(e, t) {
  return No(E(t, e));
}
function un(e) {
  const t = No(e);
  return t === 0 ? { x: 0, y: 0 } : S(e, 1 / t);
}
function tt(e) {
  return { x: e.y, y: -e.x };
}
function rl(e, t, n) {
  return { x: e.x + (t.x - e.x) * n, y: e.y + (t.y - e.y) * n };
}
function gt(e, t, n, i) {
  const s = J(t, i);
  if (Math.abs(s) < 1e-9) return null;
  const o = J(E(n, e), i) / s;
  return O(e, S(t, o));
}
function Pi(e, t, n) {
  const i = E(n, t), s = H(i, i);
  return s === 0 ? 0 : H(E(e, t), i) / s;
}
function Ft(e, t, n) {
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
function al(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function Mt(e, t, n) {
  const i = new Pt(null, null);
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
function Dn(e, t, n, i) {
  const s = new Pt(e, t);
  if (n === null)
    return s.left = s.right = null, s;
  n = Mt(e, n, i);
  const o = i(e, n.key);
  return o < 0 ? (s.left = n.left, s.right = n, n.left = null) : o >= 0 && (s.right = n.right, s.left = n, n.right = null), s;
}
function ds(e, t, n) {
  let i = null, s = null;
  if (t) {
    t = Mt(e, t, n);
    const o = n(t.key, e);
    o === 0 ? (i = t.left, s = t.right) : o < 0 ? (s = t.right, t.right = null, i = t) : (i = t.left, t.left = null, s = t);
  }
  return { left: i, right: s };
}
function ll(e, t, n) {
  return t === null ? e : (e === null || (t = Mt(e.key, t, n), t.left = e), t);
}
function ti(e, t, n, i, s) {
  if (e) {
    i(`${t}${n ? "└── " : "├── "}${s(e)}
`);
    const o = t + (n ? "    " : "│   ");
    e.left && ti(e.left, o, !1, i, s), e.right && ti(e.right, o, !0, i, s);
  }
}
class Oi {
  constructor(t = al) {
    this._root = null, this._size = 0, this._comparator = t;
  }
  /**
   * Inserts a key, allows duplicates
   */
  insert(t, n) {
    return this._size++, this._root = Dn(t, n, this._root, this._comparator);
  }
  /**
   * Adds a key, if it is not present in the tree
   */
  add(t, n) {
    const i = new Pt(t, n);
    this._root === null && (i.left = i.right = null, this._size++, this._root = i);
    const s = this._comparator, o = Mt(t, this._root, s), r = s(t, o.key);
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
    return n === null ? null : (n = Mt(t, n, i), i(t, n.key) === 0 ? (n.left === null ? s = n.right : (s = Mt(t, n.left, i), s.right = n.right), this._size--, s) : n);
  }
  /**
   * Removes and returns the node with smallest key
   */
  pop() {
    let t = this._root;
    if (t) {
      for (; t.left; ) t = t.left;
      return this._root = Mt(t.key, this._root, this._comparator), this._root = this._remove(t.key, this._root, this._comparator), { key: t.key, data: t.data };
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
    return this._root && (this._root = Mt(t, this._root, this._comparator), this._comparator(t, this._root.key) !== 0) ? null : this._root;
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
    return dl(this._root);
  }
  /**
   * Bulk-load items. Both array have to be same size
   */
  load(t, n = [], i = !1) {
    let s = t.length;
    const o = this._comparator;
    if (i && ii(t, n, 0, s - 1, o), this._root === null)
      this._root = ei(t, n, 0, s), this._size = s;
    else {
      const r = ul(
        this.toList(),
        cl(t, n),
        o
      );
      s = this._size + s, this._root = ni({ head: r }, 0, s);
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
    return ti(this._root, "", !0, (i) => n.push(i), t), n.join("");
  }
  update(t, n, i) {
    const s = this._comparator;
    let { left: o, right: r } = ds(t, this._root, s);
    s(t, n) < 0 ? r = Dn(n, i, r, s) : o = Dn(n, i, o, s), this._root = ll(o, r, s);
  }
  split(t) {
    return ds(t, this._root, this._comparator);
  }
  *[Symbol.iterator]() {
    let t = this._root;
    const n = [];
    let i = !1;
    for (; !i; )
      t !== null ? (n.push(t), t = t.left) : n.length !== 0 ? (t = n.pop(), yield t, t = t.right) : i = !0;
  }
}
function ei(e, t, n, i) {
  const s = i - n;
  if (s > 0) {
    const o = n + Math.floor(s / 2), r = e[o], a = t[o], l = new Pt(r, a);
    return l.left = ei(e, t, n, o), l.right = ei(e, t, o + 1, i), l;
  }
  return null;
}
function cl(e, t) {
  const n = new Pt(null, null);
  let i = n;
  for (let s = 0; s < e.length; s++)
    i = i.next = new Pt(e[s], t[s]);
  return i.next = null, n.next;
}
function dl(e) {
  let t = e;
  const n = [];
  let i = !1;
  const s = new Pt(null, null);
  let o = s;
  for (; !i; )
    t ? (n.push(t), t = t.left) : n.length > 0 ? (t = o = o.next = n.pop(), t = t.right) : i = !0;
  return o.next = null, s.next;
}
function ni(e, t, n) {
  const i = n - t;
  if (i > 0) {
    const s = t + Math.floor(i / 2), o = ni(e, t, s), r = e.head;
    return r.left = o, e.head = e.head.next, r.right = ni(e, s + 1, n), r;
  }
  return null;
}
function ul(e, t, n) {
  const i = new Pt(null, null);
  let s = i, o = e, r = t;
  for (; o !== null && r !== null; )
    n(o.key, r.key) < 0 ? (s.next = o, o = o.next) : (s.next = r, r = r.next), s = s.next;
  return o !== null ? s.next = o : r !== null && (s.next = r), i.next;
}
function ii(e, t, n, i, s) {
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
  ii(e, t, n, a, s), ii(e, t, a + 1, i, s);
}
const yt = 11102230246251565e-32, K = 134217729, pl = (3 + 8 * yt) * yt;
function Rn(e, t, n, i, s) {
  let o, r, a, l, d = t[0], u = i[0], c = 0, p = 0;
  u > d == u > -d ? (o = d, d = t[++c]) : (o = u, u = i[++p]);
  let h = 0;
  if (c < e && p < n)
    for (u > d == u > -d ? (r = d + o, a = o - (r - d), d = t[++c]) : (r = u + o, a = o - (r - u), u = i[++p]), o = r, a !== 0 && (s[h++] = a); c < e && p < n; )
      u > d == u > -d ? (r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c]) : (r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p]), o = r, a !== 0 && (s[h++] = a);
  for (; c < e; )
    r = o + d, l = r - o, a = o - (r - l) + (d - l), d = t[++c], o = r, a !== 0 && (s[h++] = a);
  for (; p < n; )
    r = o + u, l = r - o, a = o - (r - l) + (u - l), u = i[++p], o = r, a !== 0 && (s[h++] = a);
  return (o !== 0 || h === 0) && (s[h++] = o), h;
}
function hl(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function k(e) {
  return new Float64Array(e);
}
const fl = (3 + 16 * yt) * yt, ml = (2 + 12 * yt) * yt, gl = (9 + 64 * yt) * yt * yt, Wt = k(4), us = k(8), ps = k(12), hs = k(16), Y = k(4);
function wl(e, t, n, i, s, o, r) {
  let a, l, d, u, c, p, h, m, y, w, g, $, x, M, _, P, L, N;
  const R = e - s, U = n - s, Z = t - o, Q = i - o;
  M = R * Q, p = K * R, h = p - (p - R), m = R - h, p = K * Q, y = p - (p - Q), w = Q - y, _ = m * w - (M - h * y - m * y - h * w), P = Z * U, p = K * Z, h = p - (p - Z), m = Z - h, p = K * U, y = p - (p - U), w = U - y, L = m * w - (P - h * y - m * y - h * w), g = _ - L, c = _ - g, Wt[0] = _ - (g + c) + (c - L), $ = M + g, c = $ - M, x = M - ($ - c) + (g - c), g = x - P, c = x - g, Wt[1] = x - (g + c) + (c - P), N = $ + g, c = N - $, Wt[2] = $ - (N - c) + (g - c), Wt[3] = N;
  let ht = hl(4, Wt), ce = ml * r;
  if (ht >= ce || -ht >= ce || (c = e - R, a = e - (R + c) + (c - s), c = n - U, d = n - (U + c) + (c - s), c = t - Z, l = t - (Z + c) + (c - o), c = i - Q, u = i - (Q + c) + (c - o), a === 0 && l === 0 && d === 0 && u === 0) || (ce = gl * r + pl * Math.abs(ht), ht += R * u + Q * a - (Z * d + U * l), ht >= ce || -ht >= ce)) return ht;
  M = a * Q, p = K * a, h = p - (p - a), m = a - h, p = K * Q, y = p - (p - Q), w = Q - y, _ = m * w - (M - h * y - m * y - h * w), P = l * U, p = K * l, h = p - (p - l), m = l - h, p = K * U, y = p - (p - U), w = U - y, L = m * w - (P - h * y - m * y - h * w), g = _ - L, c = _ - g, Y[0] = _ - (g + c) + (c - L), $ = M + g, c = $ - M, x = M - ($ - c) + (g - c), g = x - P, c = x - g, Y[1] = x - (g + c) + (c - P), N = $ + g, c = N - $, Y[2] = $ - (N - c) + (g - c), Y[3] = N;
  const ba = Rn(4, Wt, 4, Y, us);
  M = R * u, p = K * R, h = p - (p - R), m = R - h, p = K * u, y = p - (p - u), w = u - y, _ = m * w - (M - h * y - m * y - h * w), P = Z * d, p = K * Z, h = p - (p - Z), m = Z - h, p = K * d, y = p - (p - d), w = d - y, L = m * w - (P - h * y - m * y - h * w), g = _ - L, c = _ - g, Y[0] = _ - (g + c) + (c - L), $ = M + g, c = $ - M, x = M - ($ - c) + (g - c), g = x - P, c = x - g, Y[1] = x - (g + c) + (c - P), N = $ + g, c = N - $, Y[2] = $ - (N - c) + (g - c), Y[3] = N;
  const va = Rn(ba, us, 4, Y, ps);
  M = a * u, p = K * a, h = p - (p - a), m = a - h, p = K * u, y = p - (p - u), w = u - y, _ = m * w - (M - h * y - m * y - h * w), P = l * d, p = K * l, h = p - (p - l), m = l - h, p = K * d, y = p - (p - d), w = d - y, L = m * w - (P - h * y - m * y - h * w), g = _ - L, c = _ - g, Y[0] = _ - (g + c) + (c - L), $ = M + g, c = $ - M, x = M - ($ - c) + (g - c), g = x - P, c = x - g, Y[1] = x - (g + c) + (c - P), N = $ + g, c = N - $, Y[2] = $ - (N - c) + (g - c), Y[3] = N;
  const $a = Rn(va, ps, 4, Y, hs);
  return hs[$a - 1];
}
function yl(e, t, n, i, s, o) {
  const r = (t - o) * (n - s), a = (e - s) * (i - o), l = r - a, d = Math.abs(r + a);
  return Math.abs(l) >= fl * d ? l : -wl(e, t, n, i, s, o, d);
}
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(8);
k(8);
k(8);
k(4);
k(8);
k(8);
k(16);
k(12);
k(192);
k(192);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(8);
k(8);
k(8);
k(8);
k(8);
k(8);
k(8);
k(8);
k(8);
k(4);
k(4);
k(4);
k(8);
k(16);
k(16);
k(16);
k(32);
k(32);
k(48);
k(64);
k(1152);
k(1152);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(4);
k(24);
k(24);
k(24);
k(24);
k(24);
k(24);
k(24);
k(24);
k(24);
k(24);
k(1152);
k(1152);
k(1152);
k(1152);
k(1152);
k(2304);
k(2304);
k(3456);
k(5760);
k(8);
k(8);
k(8);
k(16);
k(24);
k(48);
k(48);
k(96);
k(192);
k(384);
k(384);
k(384);
k(768);
k(96);
k(96);
k(96);
k(1152);
const ue = (e, t) => e.ll.x <= t.x && t.x <= e.ur.x && e.ll.y <= t.y && t.y <= e.ur.y, si = (e, t) => {
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
const bl = At * At, fs = (e, t) => {
  if (-At < e && e < At && -At < t && t < At)
    return 0;
  const n = e - t;
  return n * n < bl * e * t ? 0 : e < t ? -1 : 1;
};
class vl {
  constructor() {
    this.reset();
  }
  reset() {
    this.xRounder = new ms(), this.yRounder = new ms();
  }
  round(t, n) {
    return {
      x: this.xRounder.round(t),
      y: this.yRounder.round(n)
    };
  }
}
class ms {
  constructor() {
    this.tree = new Oi(), this.round(0);
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
    if (i !== null && fs(n.key, i.key) === 0)
      return this.tree.remove(t), i.key;
    const s = this.tree.next(n);
    return s !== null && fs(n.key, s.key) === 0 ? (this.tree.remove(t), s.key) : t;
  }
}
const _e = new vl(), We = (e, t) => e.x * t.y - e.y * t.x, To = (e, t) => e.x * t.x + e.y * t.y, gs = (e, t, n) => {
  const i = yl(e.x, e.y, t.x, t.y, n.x, n.y);
  return i > 0 ? -1 : i < 0 ? 1 : 0;
}, Xe = (e) => Math.sqrt(To(e, e)), $l = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return We(s, i) / Xe(s) / Xe(i);
}, xl = (e, t, n) => {
  const i = {
    x: t.x - e.x,
    y: t.y - e.y
  }, s = {
    x: n.x - e.x,
    y: n.y - e.y
  };
  return To(s, i) / Xe(s) / Xe(i);
}, ws = (e, t, n) => t.y === 0 ? null : {
  x: e.x + t.x / t.y * (n - e.y),
  y: n
}, ys = (e, t, n) => t.x === 0 ? null : {
  x: n,
  y: e.y + t.y / t.x * (n - e.x)
}, kl = (e, t, n, i) => {
  if (t.x === 0) return ys(n, i, e.x);
  if (i.x === 0) return ys(e, t, n.x);
  if (t.y === 0) return ws(n, i, e.y);
  if (i.y === 0) return ws(e, t, n.y);
  const s = We(t, i);
  if (s == 0) return null;
  const o = {
    x: n.x - e.x,
    y: n.y - e.y
  }, r = We(o, t) / s, a = We(o, i) / s, l = e.x + a * t.x, d = n.x + r * i.x, u = e.y + a * t.y, c = n.y + r * i.y, p = (l + d) / 2, h = (u + c) / 2;
  return {
    x: p,
    y: h
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
        sine: $l(this.point, t.point, o.point),
        cosine: xl(this.point, t.point, o.point)
      });
    };
    return (s, o) => {
      n.has(s) || i(s), n.has(o) || i(o);
      const {
        sine: r,
        cosine: a
      } = n.get(s), {
        sine: l,
        cosine: d
      } = n.get(o);
      return r >= 0 && l >= 0 ? a < d ? 1 : a > d ? -1 : 0 : r < 0 && l < 0 ? a < d ? -1 : a > d ? 1 : 0 : l < r ? -1 : l > r ? 1 : 0;
    };
  }
}
let Ml = 0;
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
    const a = t.leftSE.point.y, l = n.leftSE.point.y, d = t.rightSE.point.y, u = n.rightSE.point.y;
    if (i < s) {
      if (l < a && l < d) return 1;
      if (l > a && l > d) return -1;
      const c = t.comparePoint(n.leftSE.point);
      if (c < 0) return 1;
      if (c > 0) return -1;
      const p = n.comparePoint(t.rightSE.point);
      return p !== 0 ? p : -1;
    }
    if (i > s) {
      if (a < l && a < u) return -1;
      if (a > l && a > u) return 1;
      const c = n.comparePoint(t.leftSE.point);
      if (c !== 0) return c;
      const p = t.comparePoint(n.rightSE.point);
      return p < 0 ? 1 : p > 0 ? -1 : 1;
    }
    if (a < l) return -1;
    if (a > l) return 1;
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
      const c = d - a, p = o - i, h = u - l, m = r - s;
      if (c > p && h < m) return 1;
      if (c < p && h > m) return -1;
    }
    return o > r ? 1 : o < r || d < u ? -1 : d > u ? 1 : t.id < n.id ? -1 : t.id > n.id ? 1 : 0;
  }
  /* Warning: a reference to ringWindings input will be stored,
   *  and possibly will be later modified */
  constructor(t, n, i, s) {
    this.id = ++Ml, this.leftSE = t, t.segment = this, t.otherSE = n, this.rightSE = n, n.segment = this, n.otherSE = t, this.rings = i, this.windings = s;
  }
  static fromRing(t, n, i) {
    let s, o, r;
    const a = st.comparePoints(t, n);
    if (a < 0)
      s = t, o = n, r = 1;
    else if (a > 0)
      s = n, o = t, r = -1;
    else throw new Error(`Tried to create degenerate segment at [${t.x}, ${t.y}]`);
    const l = new st(s, !0), d = new st(o, !1);
    return new Et(l, d, [i], [r]);
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
    const n = this.bbox(), i = t.bbox(), s = si(n, i);
    if (s === null) return null;
    const o = this.leftSE.point, r = this.rightSE.point, a = t.leftSE.point, l = t.rightSE.point, d = ue(n, a) && this.comparePoint(a) === 0, u = ue(i, o) && t.comparePoint(o) === 0, c = ue(n, l) && this.comparePoint(l) === 0, p = ue(i, r) && t.comparePoint(r) === 0;
    if (u && d)
      return p && !c ? r : !p && c ? l : null;
    if (u)
      return c && o.x === l.x && o.y === l.y ? null : o;
    if (d)
      return p && r.x === a.x && r.y === a.y ? null : a;
    if (p && c) return null;
    if (p) return r;
    if (c) return l;
    const h = kl(o, this.vector(), a, t.vector());
    return h === null || !ue(s, h) ? null : _e.round(h.x, h.y);
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
    const a = new Et(s, r, this.rings.slice(), this.windings.slice());
    return st.comparePoints(a.leftSE.point, a.rightSE.point) > 0 && a.swapEvents(), st.comparePoints(this.leftSE.point, this.rightSE.point) > 0 && this.swapEvents(), i && (s.checkForConsuming(), o.checkForConsuming()), n;
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
        const a = i.rings[o], l = i.windings[o], d = n.rings.indexOf(a);
        d === -1 ? (n.rings.push(a), n.windings.push(l)) : n.windings[d] += l;
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
      const d = this.rings[a], u = this.windings[a], c = n.indexOf(d);
      c === -1 ? (n.push(d), i.push(u)) : i[c] += u;
    }
    const o = [], r = [];
    for (let a = 0, l = n.length; a < l; a++) {
      if (i[a] === 0) continue;
      const d = n[a], u = d.poly;
      if (r.indexOf(u) === -1)
        if (d.isExterior) o.push(u);
        else {
          r.indexOf(u) === -1 && r.push(u);
          const c = o.indexOf(d.poly);
          c !== -1 && o.splice(c, 1);
        }
    }
    for (let a = 0, l = o.length; a < l; a++) {
      const d = o[a].multiPoly;
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
class bs {
  constructor(t, n, i) {
    if (!Array.isArray(t) || t.length === 0)
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    if (this.poly = n, this.isExterior = i, this.segments = [], typeof t[0][0] != "number" || typeof t[0][1] != "number")
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    const s = _e.round(t[0][0], t[0][1]);
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
      let l = _e.round(t[r][0], t[r][1]);
      l.x === o.x && l.y === o.y || (this.segments.push(Et.fromRing(o, l, this)), l.x < this.bbox.ll.x && (this.bbox.ll.x = l.x), l.y < this.bbox.ll.y && (this.bbox.ll.y = l.y), l.x > this.bbox.ur.x && (this.bbox.ur.x = l.x), l.y > this.bbox.ur.y && (this.bbox.ur.y = l.y), o = l);
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
class _l {
  constructor(t, n) {
    if (!Array.isArray(t))
      throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
    this.exteriorRing = new bs(t[0], this, !0), this.bbox = {
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
      const o = new bs(t[i], this, !1);
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
class vs {
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
      const o = new _l(t[i], this);
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
class Qe {
  /* Given the segments from the sweep line pass, compute & return a series
   * of closed rings from all the segments marked to be part of the result */
  static factory(t) {
    const n = [];
    for (let i = 0, s = t.length; i < s; i++) {
      const o = t[i];
      if (!o.isInResult() || o.ringOut) continue;
      let r = null, a = o.leftSE, l = o.rightSE;
      const d = [a], u = a.point, c = [];
      for (; r = a, a = l, d.push(a), a.point !== u; )
        for (; ; ) {
          const p = a.getAvailableLinkedEvents();
          if (p.length === 0) {
            const y = d[0].point, w = d[d.length - 1].point;
            throw new Error(`Unable to complete output ring starting at [${y.x}, ${y.y}]. Last matching segment found ends at [${w.x}, ${w.y}].`);
          }
          if (p.length === 1) {
            l = p[0].otherSE;
            break;
          }
          let h = null;
          for (let y = 0, w = c.length; y < w; y++)
            if (c[y].point === a.point) {
              h = y;
              break;
            }
          if (h !== null) {
            const y = c.splice(h)[0], w = d.splice(y.index);
            w.unshift(w[0].otherSE), n.push(new Qe(w.reverse()));
            continue;
          }
          c.push({
            index: d.length,
            point: a.point
          });
          const m = a.getLeftmostComparator(r);
          l = p.sort(m)[0].otherSE;
          break;
        }
      n.push(new Qe(d));
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
      gs(c, t, p) !== 0 && (n.push(c), t = c);
    }
    if (n.length === 1) return null;
    const i = n[0], s = n[1];
    gs(i, t, s) === 0 && n.shift(), n.push(n[0]);
    const o = this.isExteriorRing() ? 1 : -1, r = this.isExteriorRing() ? 0 : n.length - 1, a = this.isExteriorRing() ? n.length : -1, l = [];
    for (let d = r; d != a; d += o) l.push([n[d].x, n[d].y]);
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
class $s {
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
class Al {
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
        if (o.isExteriorRing()) n.push(new $s(o));
        else {
          const r = o.enclosingRing();
          r.poly || n.push(new $s(r)), r.poly.addInterior(o);
        }
    }
    return n;
  }
}
class Sl {
  constructor(t) {
    let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Et.compare;
    this.queue = t, this.tree = new Oi(n), this.segments = [];
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
      let d = null;
      if (a) {
        const c = a.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (d = c), !a.isAnEndpoint(c))) {
          const p = this._splitSafely(a, c);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      let u = null;
      if (l) {
        const c = l.getIntersection(n);
        if (c !== null && (n.isAnEndpoint(c) || (u = c), !l.isAnEndpoint(c))) {
          const p = this._splitSafely(l, c);
          for (let h = 0, m = p.length; h < m; h++)
            i.push(p[h]);
        }
      }
      if (d !== null || u !== null) {
        let c = null;
        d === null ? c = u : u === null ? c = d : c = st.comparePoints(d, u) <= 0 ? d : u, this.queue.remove(n.rightSE), i.push(n.rightSE);
        const p = n.split(c);
        for (let h = 0, m = p.length; h < m; h++)
          i.push(p[h]);
      }
      i.length > 0 ? (this.tree.remove(n), i.push(t)) : (this.segments.push(n), n.prev = a);
    } else {
      if (a && l) {
        const d = a.getIntersection(l);
        if (d !== null) {
          if (!a.isAnEndpoint(d)) {
            const u = this._splitSafely(a, d);
            for (let c = 0, p = u.length; c < p; c++)
              i.push(u[c]);
          }
          if (!l.isAnEndpoint(d)) {
            const u = this._splitSafely(l, d);
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
const xs = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1e6, El = typeof process < "u" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1e6;
class Il {
  run(t, n, i) {
    rt.type = t, _e.reset();
    const s = [new vs(n, !0)];
    for (let c = 0, p = i.length; c < p; c++)
      s.push(new vs(i[c], !1));
    if (rt.numMultiPolys = s.length, rt.type === "difference") {
      const c = s[0];
      let p = 1;
      for (; p < s.length; )
        si(s[p].bbox, c.bbox) !== null ? p++ : s.splice(p, 1);
    }
    if (rt.type === "intersection")
      for (let c = 0, p = s.length; c < p; c++) {
        const h = s[c];
        for (let m = c + 1, y = s.length; m < y; m++)
          if (si(h.bbox, s[m].bbox) === null) return [];
      }
    const o = new Oi(st.compare);
    for (let c = 0, p = s.length; c < p; c++) {
      const h = s[c].getSweepEvents();
      for (let m = 0, y = h.length; m < y; m++)
        if (o.insert(h[m]), o.size > xs)
          throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big).");
    }
    const r = new Sl(o);
    let a = o.size, l = o.pop();
    for (; l; ) {
      const c = l.key;
      if (o.size === a) {
        const h = c.segment;
        throw new Error(`Unable to pop() ${c.isLeft ? "left" : "right"} SweepEvent [${c.point.x}, ${c.point.y}] from segment #${h.id} [${h.leftSE.point.x}, ${h.leftSE.point.y}] -> [${h.rightSE.point.x}, ${h.rightSE.point.y}] from queue.`);
      }
      if (o.size > xs)
        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big).");
      if (r.segments.length > El)
        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments).");
      const p = r.process(c);
      for (let h = 0, m = p.length; h < m; h++) {
        const y = p[h];
        y.consumedBy === void 0 && o.insert(y);
      }
      a = o.size, l = o.pop();
    }
    _e.reset();
    const d = Qe.factory(r.segments);
    return new Al(d).getGeom();
  }
}
const rt = new Il(), Pl = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("union", e, n);
}, Ol = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("intersection", e, n);
}, Cl = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("xor", e, n);
}, Ll = function(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    n[i - 1] = arguments[i];
  return rt.run("difference", e, n);
};
var zo = {
  union: Pl,
  intersection: Ol,
  xor: Cl,
  difference: Ll
};
const Do = 3, Nl = 1e-6;
function pn(e, t) {
  const n = e.nodes.find((i) => i.id === t);
  if (!n) throw new Error(`node not found: ${t}`);
  return n;
}
function j(e, t) {
  const n = pn(e, t);
  return { x: n.x, y: n.y };
}
function oe(e, t) {
  const n = e.walls.find((o) => o.id === t);
  if (!n) return null;
  const i = e.nodes.find((o) => o.id === n.a), s = e.nodes.find((o) => o.id === n.b);
  return !i || !s ? null : C(i, s);
}
function Ro(e, t, n, i) {
  const s = n, [o, r] = i === "left" ? [0, s] : i === "right" ? [s, 0] : [s / 2, s / 2];
  return { a: e, b: t, dir: un(E(t, e)), len: C(e, t), leftOff: o, rightOff: r };
}
function nt(e, t) {
  return Ro(j(e, t.a), j(e, t.b), t.thickness, t.baseline);
}
function jt(e, t) {
  const n = E(t, e.a);
  return { t: H(n, e.dir), side: H(n, tt(e.dir)) };
}
function ks(e, t) {
  const { f: n } = e;
  return t === "a" ? { body: e, end: t, p: n.a, u: n.dir, offL: n.leftOff, offR: n.rightOff, leftKey: "al", rightKey: "ar", far: n.b } : { body: e, end: t, p: n.b, u: S(n.dir, -1), offL: n.rightOff, offR: n.leftOff, leftKey: "br", rightKey: "bl", far: n.a };
}
const Gt = (e) => O(e.p, S(tt(e.u), e.offL)), Kt = (e) => E(e.p, S(tt(e.u), e.offR));
function zt(e, t, n) {
  return e !== null && C(e, t) <= n;
}
function Tl(e) {
  const t = [];
  for (const n of e.walls) {
    const i = nt(e, n);
    if (i.len < 1e-9) continue;
    const s = tt(i.dir);
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
function zl(e, t) {
  const n = t.f, i = tt(n.dir);
  for (const s of e) {
    if (s.body === t) continue;
    const r = H(E(s.far, n.a), i) >= 0 ? O(n.a, S(i, n.leftOff)) : E(n.a, S(i, n.rightOff)), a = Do * Math.max(s.body.wall.thickness, t.wall.thickness), l = gt(Gt(s), s.u, r, n.dir), d = gt(Kt(s), s.u, r, n.dir);
    zt(l, s.p, a) && (s.body.c[s.leftKey] = l), zt(d, s.p, a) && (s.body.c[s.rightKey] = d);
  }
}
function Dl(e, t) {
  e.sort((s, o) => Math.atan2(s.u.y, s.u.x) - Math.atan2(o.u.y, o.u.x));
  const n = Do * Math.max(...e.map((s) => s.body.wall.thickness));
  for (let s = 0; s < e.length; s++) {
    const o = e[s], r = e[(s + 1) % e.length], a = gt(Kt(o), o.u, Gt(r), r.u);
    zt(a, t, n) && (o.body.c[o.rightKey] = a, r.body.c[r.leftKey] = a);
  }
  if (e.length < 3) return;
  const i = Rl(e, t, n);
  for (const s of e) {
    if (i.has(s)) continue;
    const o = s.body.c[s.leftKey], r = s.body.c[s.rightKey], a = E(r, o), l = J(a, E(t, o)), d = J(a, E(s.far, o));
    l * d < 0 && oi(s, [t]);
  }
}
function oi(e, t) {
  e.end === "a" ? e.body.extraA = t : e.body.extraB = t;
}
function Rl(e, t, n) {
  const i = e.length;
  for (let s = 0; s < i; s++) {
    const o = e[s], r = e[(s + 1) % i];
    if (Math.abs(J(o.u, r.u)) > 1e-9 || H(o.u, r.u) > 0) continue;
    const a = o.offR - r.offL;
    if (!(Math.abs(a) < 1e-9)) {
      if (a > 0) {
        const l = e[(s + 2) % i], d = gt(Kt(o), o.u, Gt(l), l.u), u = gt(Gt(r), r.u, Gt(l), l.u);
        if (!zt(d, t, n) || !zt(u, t, n)) continue;
        const c = r.body.c[r.rightKey];
        o.body.c[o.rightKey] = d, r.body.c[r.leftKey] = u, oi(o, [t, c, u]);
      } else {
        const l = e[(s - 1 + i) % i], d = gt(Gt(r), r.u, Kt(l), l.u), u = gt(Kt(o), o.u, Kt(l), l.u);
        if (!zt(u, t, n) || !zt(d, t, n)) continue;
        const c = o.body.c[o.leftKey];
        o.body.c[o.rightKey] = u, r.body.c[r.leftKey] = d, oi(r, [u, c, t]);
      }
      return /* @__PURE__ */ new Set([o, r]);
    }
  }
  return /* @__PURE__ */ new Set();
}
function Bo(e) {
  const t = Tl(e), n = new Map(t.map((i) => [i.wall.id, i]));
  for (const i of e.nodes) {
    const s = [];
    for (const r of t)
      r.wall.a === i.id && s.push(ks(r, "a")), r.wall.b === i.id && s.push(ks(r, "b"));
    if (s.length === 0) continue;
    const o = i.host ? n.get(i.host.wallId) : void 0;
    o ? zl(s, o) : s.length >= 2 && Dl(s, { x: i.x, y: i.y });
  }
  return t;
}
function Ho(e) {
  return [e.c.ar, e.c.br, ...e.extraB ?? [], e.c.bl, e.c.al, ...e.extraA ?? []];
}
function hn(e) {
  return new Map(Bo(e).map((t) => [t.wall.id, Ho(t)]));
}
function Ms(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i], o = e[(i + 1) % e.length], r = t(s), a = t(o);
    r >= 0 && n.push(s), r >= 0 != a >= 0 && n.push(O(s, S(E(o, s), r / (r - a))));
  }
  return n;
}
function Ci(e, t = () => !0) {
  const n = /* @__PURE__ */ new Map();
  for (const i of Bo(e)) {
    const s = Ho(i), o = e.openings.filter((u) => u.wallId === i.wall.id && !u.invalid && t(u)).sort((u, c) => u.offset - c.offset), r = (u) => H(E(u, i.f.a), i.f.dir), a = [];
    let l = -1 / 0;
    for (const u of o)
      a.push([l, u.offset]), l = Math.max(l, u.offset + u.width);
    a.push([l, 1 / 0]);
    const d = [];
    for (const [u, c] of a) {
      if (c <= u) continue;
      let p = s;
      u > -1 / 0 && (p = Ms(p, (h) => r(h) - u)), c < 1 / 0 && (p = Ms(p, (h) => c - r(h))), p.length >= 3 && Math.abs(bt(p)) > Nl && d.push(p);
    }
    n.set(i.wall.id, d);
  }
  return n;
}
const ri = (e) => [e.map((t) => [t.x, t.y])];
function Fo(e) {
  const t = e.map(([s, o]) => ({ x: s, y: o })), n = t[0], i = t[t.length - 1];
  return t.length > 1 && n.x === i.x && n.y === i.y && t.pop(), t;
}
function Uo(e, t) {
  return Vo(t ? [...Ci(e).values()].flat() : [...hn(e).values()]);
}
function Vo(e) {
  const t = e.map(ri);
  if (t.length === 0) return [];
  let n;
  try {
    n = zo.union(t[0], ...t.slice(1));
  } catch {
    return e.map((i) => [i.map((s) => ({ x: s.x, y: s.y }))]);
  }
  return n.map((i) => i.map(Fo));
}
function jo(e) {
  const t = [];
  for (const n of Uo(e, !1)) for (const i of n.slice(1)) t.push(i);
  return t;
}
function ai(e, t) {
  let n = null, i = 1 / 0;
  for (const s of e) {
    if (!se(t, s)) continue;
    const o = Math.abs(bt(s));
    o < i && (n = s, i = o);
  }
  return n;
}
function Wo(e) {
  return Math.round(Math.abs(bt(e)) / 1e6 * 100) / 100;
}
const Bn = 1e-3;
function Zo(e, t) {
  return e.length !== t.length || Math.abs(Math.abs(bt(e)) - Math.abs(bt(t))) > Bn ? !1 : e.every((n) => t.some((i) => Math.abs(n.x - i.x) <= Bn && Math.abs(n.y - i.y) <= Bn));
}
function Bl(e, t, n) {
  const i = jo(e), s = ai(i, t);
  if (!s) return { level: e, zoneId: null };
  for (const r of e.zones) {
    const a = r.broken ? null : ai(i, r.seed);
    if (a && Zo(a, s)) return { level: e, zoneId: null };
  }
  const o = { id: q(), name: n, seed: { ...t }, outline: s, broken: !1 };
  return { level: { ...e, zones: [...e.zones, o] }, zoneId: o.id };
}
function Hl(e, t, n) {
  return { ...e, zones: e.zones.map((i) => i.id === t ? { ...i, name: n } : i) };
}
function qo(e, t) {
  const n = e.zones.find((r) => r.id === t);
  if (!n) return e;
  const i = { ...e, zones: e.zones.filter((r) => r !== n) }, s = F(e), o = (r) => r.shape.kind === "room" && r.shape.roomId === t;
  if (s.some(o)) {
    const r = n.outline.map((a) => ({ kind: "free", x: a.x, y: a.y, lost: !0 }));
    i.automationZones = s.map((a) => o(a) ? { ...a, shape: { kind: "polygon", vertices: r }, invalid: !0 } : a);
  }
  return i;
}
function re(e) {
  if (e.zones.length === 0) return e;
  const t = jo(e), n = [], i = e.zones.map((s) => {
    const o = ai(t, s.seed);
    return !o || n.some((r) => Zo(r, o)) ? { ...s, broken: !0 } : (n.push(o), { ...s, outline: o, broken: !1 });
  });
  return { ...e, zones: i };
}
const ee = 1e-6, Je = ["door", "gate", "wicket"], Go = (e) => e === "opening", Ko = (e) => e.passesLight ?? Go(e.kind), Yo = (e) => e === "opening", Xo = (e) => e.passesPir ?? Yo(e.kind);
function Qo(e, t) {
  return e.offset < t.offset + t.width - ee && t.offset < e.offset + e.width - ee;
}
function fn(e, t, n, i, s) {
  const o = oe(e, t);
  return o === null || i <= 0 || n < -ee || n + i > o + ee ? !1 : !e.openings.some((r) => r.wallId === t && r.id !== s && Qo(r, { offset: n, width: i }));
}
function ae(e, t) {
  return { ...e, openings: t };
}
function Fl(e, t, n, i, s, o = {}) {
  const r = s ?? je[n], a = i - r / 2;
  if (!fn(e, t, a, r)) return { level: e, openingId: null };
  const l = { id: q(), wallId: t, kind: n, offset: a, width: r, invalid: !1 };
  return Je.includes(n) && (l.hinge = o.hinge ?? "start", l.swing = o.swing ?? "left"), n === "window" && (l.outside = o.outside ?? "left"), { level: re(ae(e, [...e.openings, l])), openingId: l.id };
}
function Jo(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !fn(e, i.wallId, n, i.width, t) ? e : re(Ne(ae(e, e.openings.map((s) => s.id === t ? { ...s, offset: n } : s))));
}
function Ul(e, t, n) {
  const i = e.openings.find((s) => s.id === t);
  return !i || !fn(e, i.wallId, i.offset, n, t) ? e : re(Ne(ae(e, e.openings.map((s) => s.id === t ? { ...s, width: n } : s))));
}
function Vl(e, t) {
  return Je.includes(t) ? { kind: t, hinge: e.hinge ?? "start", swing: e.swing ?? "left", outside: void 0 } : t === "window" ? { kind: t, outside: e.outside ?? "left", hinge: void 0, swing: void 0 } : { kind: t, hinge: void 0, swing: void 0, outside: void 0 };
}
function jl(e, t, n) {
  if (!e.openings.some((s) => s.id === t)) return e;
  const i = (s) => {
    const o = { ...s, ...n };
    for (const r of Object.keys(n)) n[r] === void 0 && delete o[r];
    return o;
  };
  return re(Ne(ae(e, e.openings.map((s) => s.id === t ? i(s) : s))));
}
function tr(e, t) {
  return re(Ne(ae(e, e.openings.filter((n) => n.id !== t))));
}
function Ne(e) {
  return ae(e, e.openings.map((t) => {
    const n = oe(e, t.wallId), i = n === null || t.offset < -ee || t.offset + t.width > n + ee || e.openings.some((s) => s.id !== t.id && s.wallId === t.wallId && Qo(t, s));
    return { ...t, invalid: i };
  }));
}
const tn = 1e-6;
function er(e, t) {
  return Ii[e.kind].includes(t.mode);
}
function nr(e, t, n) {
  if (!er(t, n)) return !1;
  if (n.mode === "free") return !0;
  const i = n.aim;
  if (i !== void 0 && (!Number.isInteger(i) || i < -te || i > te)) return !1;
  const s = oe(e, n.wallId);
  return s !== null && n.offset >= -tn && n.offset <= s + tn;
}
function le(e, t) {
  return { ...e, devices: t };
}
function _s(e, t, n, i) {
  if (!nr(e, t, n)) return { level: e, deviceId: null };
  const s = { id: q(), name: i, placement: n, props: t, invalid: !1 };
  return { level: le(e, [...e.devices, s]), deviceId: s.id };
}
function ir(e, t, n) {
  if (e.kind !== "motion_sensor" || t === n) return e;
  const i = Ht("motion_sensor", t), s = Ht("motion_sensor", n);
  return i.kind === "motion_sensor" && s.kind === "motion_sensor" && e.zoneAngle === i.zoneAngle ? { ...e, zoneAngle: s.zoneAngle } : e;
}
function Li(e, t, n) {
  const i = e.devices, s = i.find((r) => r.id === t);
  if (!s || !nr(e, s.props, n)) return e;
  const o = ir(s.props, s.placement.mode, n.mode);
  return or(le(e, i.map((r) => r.id === t ? { ...r, placement: n, props: o } : r)));
}
function mn(e, t, n, i) {
  const s = e.devices;
  return s.some((o) => o.id === t) ? le(e, s.map((o) => {
    if (o.id !== t) return o;
    const r = { ...o.props, ...n, kind: o.props.kind };
    return Si({ ...o, props: r, name: i ?? o.name });
  })) : e;
}
function Wl(e, t, n) {
  const i = e.devices.find((r) => r.id === t);
  if (!i || !ie(i.props.kind) || i.props.kind === n) return e;
  const s = Ht(n, i.placement.mode);
  if (!er(s, i.placement)) return e;
  const o = Si({ ...i, props: s });
  return le(e, e.devices.map((r) => r === i ? o : r));
}
function sr(e, t) {
  return le(e, e.devices.filter((n) => n.id !== t));
}
function or(e) {
  return le(e, e.devices.map((t) => {
    if (t.placement.mode !== "wall") return t.invalid ? { ...t, invalid: !1 } : t;
    const n = oe(e, t.placement.wallId), i = n === null || t.placement.offset < -tn || t.placement.offset > n + tn;
    return t.invalid === i ? t : { ...t, invalid: i };
  }));
}
const rr = 2, As = Math.ceil(360 / rr), Ss = 1e-4, Zl = 1e-9, Es = 1e-9, ql = {
  light: Ko,
  motion: Xo
};
function ar(e, t) {
  const n = [];
  for (const i of Vo([...Ci(e, ql[t]).values()].flat()))
    for (const s of i)
      for (let o = 0; o < s.length; o++) n.push([s[o], s[(o + 1) % s.length]]);
  return n;
}
function Ni(e, t, n) {
  return t.filter(([i, s]) => Ft(e, i, s) <= n);
}
function Hn(e) {
  return e < -Math.PI ? e + 2 * Math.PI : e >= Math.PI ? e - 2 * Math.PI : e;
}
function Gl(e, t, n) {
  const i = Ni(e, t, n), s = [];
  for (let w = 0; w < As; w++) s.push(-Math.PI + 2 * Math.PI * w / As);
  const o = n * 1.05;
  for (const w of i)
    for (const g of w) {
      if (C(e, g) > o) continue;
      const $ = Math.atan2(g.y - e.y, g.x - e.x);
      s.push(Hn($ - Ss), Hn($), Hn($ + Ss));
    }
  s.sort((w, g) => w - g);
  const r = i.length, a = new Float64Array(r), l = new Float64Array(r), d = new Float64Array(r), u = new Float64Array(r);
  i.forEach(([w, g], $) => {
    a[$] = w.x - e.x, l[$] = w.y - e.y, d[$] = g.x - w.x, u[$] = g.y - w.y;
  });
  const c = [], p = [];
  let h = NaN;
  for (const w of s) {
    if (w === h) continue;
    h = w;
    const g = Math.cos(w), $ = Math.sin(w);
    let x = n, M = -1;
    for (let L = 0; L < r; L++) {
      const N = g * u[L] - $ * d[L];
      if (Math.abs(N) < 1e-12) continue;
      const R = (a[L] * u[L] - l[L] * d[L]) / N;
      if (!(R > Zl && R < x)) continue;
      const U = (a[L] * $ - l[L] * g) / N;
      U < -Es || U > 1 + Es || (x = R, M = L);
    }
    const _ = { x: e.x + g * x, y: e.y + $ * x }, P = c.length;
    if (!(P > 0 && c[P - 1].x === _.x && c[P - 1].y === _.y)) {
      if (M >= 0 && P >= 2 && p[P - 1] === M && p[P - 2] === M) {
        c[P - 1] = _;
        continue;
      }
      c.push(_), p.push(M);
    }
  }
  const m = c[0], y = c[c.length - 1];
  return c.length > 1 && m.x === y.x && m.y === y.y && c.pop(), c;
}
const Kl = 32, Is = 128;
function en(e) {
  const t = e * Math.PI / 180;
  return { x: Math.cos(t), y: -Math.sin(t) };
}
function It(e) {
  return Math.atan2(-e.y, e.x) * 180 / Math.PI;
}
function lr(e) {
  return (e % 360 + 360) % 360;
}
function cr(e) {
  return (e % 360 + 540) % 360 - 180;
}
function dr(e, t, n, i) {
  const s = e.walls.find((d) => d.id === t);
  if (!s) return null;
  let o;
  try {
    o = nt(e, s);
  } catch {
    return null;
  }
  const r = tt(o.dir), a = n === "left" ? r : S(r, -1), l = n === "left" ? o.leftOff : o.rightOff;
  return { pt: O(O(o.a, S(o.dir, i)), S(a, l)), normal: a };
}
function ur(e, t, n, i) {
  var s;
  return ((s = dr(e, t, n, i)) == null ? void 0 : s.pt) ?? null;
}
function X(e, t) {
  const n = t.placement;
  if (n.mode === "free") return { pt: { x: n.x, y: n.y }, dir: en(n.rotation) };
  const i = dr(e, n.wallId, n.side, n.offset);
  if (!i) return null;
  const s = i.normal;
  return { pt: i.pt, dir: n.aim ? en(It(s) + n.aim) : s, normal: s };
}
function pr(e, t) {
  const n = [];
  for (let i = 0; i < Is; i++) n.push(O(e, S(en(360 * i / Is), t)));
  return n;
}
function Ps(e, t, n, i) {
  if (n >= 360) return pr(e, i);
  const s = Math.max(1, Math.ceil(n / 90 * Kl)), o = It(t) - n / 2, r = [e];
  for (let a = 0; a <= s; a++) r.push(O(e, S(en(o + n * a / s), i)));
  return r;
}
const Yl = {
  wall_light: "light",
  ceiling_light: "light",
  motion_sensor: "motion"
};
function gn(e) {
  return Yl[e] ?? null;
}
const Xl = (e) => gn(e.kind) !== null;
function Ql(e, t) {
  const n = t.props;
  if (!Xl(n)) return null;
  const i = X(e, t);
  if (!i) return null;
  switch (n.kind) {
    case "wall_light":
      return n.coneAngle > 0 && n.coneRange > 0 ? Ps(i.pt, i.dir, n.coneAngle, n.coneRange) : null;
    case "motion_sensor":
      return n.zoneAngle > 0 && n.zoneRange > 0 ? Ps(i.pt, i.dir, n.zoneAngle, n.zoneRange) : null;
    case "ceiling_light":
      return n.poolRadius !== null && n.poolRadius > 0 ? pr(i.pt, n.poolRadius) : null;
  }
}
function Jl(e) {
  return e.normal ? O(e.pt, e.normal) : e.pt;
}
function Os(e, t) {
  let n = !1;
  for (const [i, s] of t)
    i.y > e.y != s.y > e.y && e.x < i.x + (e.y - i.y) * (s.x - i.x) / (s.y - i.y) && (n = !n);
  return n;
}
function tc(e, t, n) {
  const i = E(t, e);
  for (const [s, o] of n) {
    const r = E(o, s), a = E(s, e), l = J(i, r);
    if (Math.abs(l) < 1e-12) continue;
    const d = J(a, r) / l, u = J(a, i) / l;
    if (d >= 0 && d <= 1 && u >= 0 && u <= 1) return !0;
  }
  return !1;
}
const Cs = 0.5, ec = 3, nc = 1e-4;
function ic(e, t, n) {
  const i = X(e, t);
  if (!i) return null;
  const s = Jl(i), o = t.placement;
  if (o.mode !== "wall") return s;
  const r = (_) => Os(_, n) || Ni(_, n, Cs).length > 0;
  if (!r(s)) return s;
  const a = nt(e, e.walls.find((_) => _.id === o.wallId)), l = i.normal, d = (_) => Math.abs(H(E(_, i.pt), l)) <= nc, u = ([_, P]) => S(O(_, P), 0.5), c = n.filter((_) => d(_[0]) && d(_[1]) && C(_[0], _[1]) > 1e-9 && !Os(O(u(_), S(l, Cs)), n)), p = (_) => H(E(_, a.a), a.dir), h = ([_, P]) => Math.max(0, Math.min(p(_), p(P)) - o.offset, o.offset - Math.max(p(_), p(P))), m = Math.min(...c.map(h)), y = c.filter((_) => h(_) <= m + 1e-6).map((_) => O(u(_), l)), w = (_) => y.some((P) => !tc(_, P, n)), g = ec * Math.max(...e.walls.map((_) => _.thickness)) + 2, $ = [];
  for (const [_, P] of n) {
    const L = E(P, _), N = E(_, s), R = J(a.dir, L);
    if (Math.abs(R) < 1e-12) continue;
    const U = J(N, a.dir) / R;
    if (U < -1e-9 || U > 1 + 1e-9) continue;
    const Z = J(N, L) / R, Q = C(_, P) / Math.abs(R);
    $.push(Z - Q, Z + Q);
  }
  const x = o.offset <= a.len / 2 ? 1 : -1, M = $.filter((_) => Math.abs(_) <= g).sort((_, P) => Math.abs(_) - Math.abs(P) || Math.sign(P) * x - Math.sign(_) * x);
  for (const _ of M) {
    const P = O(s, S(a.dir, _));
    if (!r(P) && w(P)) return P;
  }
  return null;
}
const sc = 1 / Math.cos(rr / 2 * (Math.PI / 180)), Ls = (e) => e.map((t) => ({ x: Math.round(t.x * 1e3) / 1e3, y: Math.round(t.y * 1e3) / 1e3 }));
function oc(e, t, n = ar) {
  const i = Ql(e, t), s = gn(t.props.kind);
  if (!i || !s) return [];
  const o = n(e, s), r = ic(e, t, o);
  if (!r) return [];
  const a = Math.max(...i.map((c) => C(c, r))) * sc, l = Ni(r, o, a);
  if (l.length === 0) return [i];
  const d = Gl(r, l, a);
  let u;
  try {
    u = zo.intersection(ri(Ls(i)), ri(Ls(d)));
  } catch {
    return [d];
  }
  return u.flatMap((c) => c.map(Fo));
}
function rc(e, t, n, i) {
  const s = X(e, t);
  if (!s) return !1;
  const o = t.props;
  if (o.kind === "ceiling_light" && o.shape === "linear") {
    const a = Math.max(-o.length / 2, Math.min(o.length / 2, H(E(n, s.pt), s.dir)));
    return C(O(s.pt, S(s.dir, a)), n) <= i;
  }
  if (o.kind === "ceiling_light" && o.shape === "round") return C(s.pt, n) <= o.diameter / 2 + i;
  if (o.kind !== "equipment") return C(s.pt, n) <= i;
  if (o.shape === "circle") return C(s.pt, n) <= o.diameter / 2 + i;
  const r = E(n, s.pt);
  return Math.abs(H(r, s.dir)) <= o.width / 2 + i && Math.abs(H(r, tt(s.dir))) <= o.depth / 2 + i;
}
function hr(e, t, n) {
  const i = e.devices;
  for (const s of [!1, !0])
    for (let o = i.length - 1; o >= 0; o--)
      if (i[o].props.kind === "equipment" === s && rc(e, i[o], t, n)) return i[o].id;
  return null;
}
const ac = 60;
function li(e, t, n) {
  if (!Co.has(t.props.kind)) return null;
  const i = X(e, t);
  return i ? { from: i.pt, to: O(i.pt, S(i.dir, ac / n)) } : null;
}
function fr(e, t) {
  const n = { ...e, aim: t };
  return t === 0 && delete n.aim, n;
}
function lc(e, t, n, i) {
  const s = t.placement, o = X(e, t);
  if (!o || n.x === o.pt.x && n.y === o.pt.y) return s;
  const r = It(E(n, o.pt)), a = (u) => i ? Math.round(u / 15) * 15 : Math.round(u);
  if (s.mode === "free") return { ...s, rotation: lr(a(r)) };
  const l = cr(r - It(o.normal)), d = Math.max(-te, Math.min(te, a(l)));
  return fr(s, d);
}
const cc = 1, Ns = 1, Ts = 1e-6, dc = 1e-9, uc = 1e-6, pc = 1;
function Ti(e, t) {
  switch (t.kind) {
    case "free":
      return { x: t.x, y: t.y };
    case "node": {
      const n = e.nodes.find((i) => i.id === t.nodeId);
      return n ? { x: n.x, y: n.y } : null;
    }
    case "wall": {
      const n = oe(e, t.wallId);
      return n === null ? null : ur(e, t.wallId, t.side, Math.max(0, Math.min(n, t.offset)));
    }
  }
}
function Ct(e, t) {
  var i;
  const n = t.shape;
  return n.kind === "room" ? ((i = e.zones.find((s) => s.id === n.roomId)) == null ? void 0 : i.outline) ?? [] : n.vertices.map((s) => Ti(e, s) ?? { x: s.x, y: s.y });
}
function ge(e, t, n) {
  const i = J(E(t, e), E(n, e));
  return Math.abs(i) <= dc * C(e, t) * C(e, n) ? 0 : Math.sign(i);
}
const ze = (e, t, n) => H(E(t, e), E(n, e)) <= 0;
function mr(e, t, n, i) {
  const s = ge(n, i, e), o = ge(n, i, t), r = ge(e, t, n), a = ge(e, t, i);
  return s * o < 0 && r * a < 0 ? !0 : r === 0 && ze(n, e, t) || a === 0 && ze(i, e, t) || s === 0 && ze(e, n, i) || o === 0 && ze(t, n, i);
}
function hc(e) {
  const t = [];
  for (const n of e) (t.length === 0 || C(t[t.length - 1], n) > Ts) && t.push(n);
  for (; t.length > 1 && C(t[0], t[t.length - 1]) <= Ts; ) t.pop();
  return t;
}
function nn(e) {
  const t = hc(e), n = t.length;
  if (n < 3) return !1;
  for (let i = 0; i < n; i++) {
    const s = t[i], o = t[(i + 1) % n], r = t[(i + 2) % n];
    if (ge(s, o, r) === 0 && H(E(o, s), E(r, o)) < 0) return !0;
    for (let a = i + 2; a < n; a++)
      if (!(i === 0 && a === n - 1) && mr(s, o, t[a], t[(a + 1) % n]))
        return !0;
  }
  return !1;
}
function gr(e, t) {
  const n = t.shape;
  if (n.kind === "room") {
    const o = e.zones.find((r) => r.id === n.roomId);
    return !o || o.broken ? "room" : null;
  }
  if (n.vertices.some((o) => o.kind === "free" ? o.lost === !0 : Ti(e, o) === null)) return "lost";
  const i = (o) => {
    if (o.kind !== "wall") return !1;
    const r = oe(e, o.wallId);
    return r !== null && (o.offset < -Ns || o.offset > r + Ns);
  };
  if (n.vertices.some(i)) return "wall";
  const s = Ct(e, t);
  return Math.abs(bt(s)) < pc || nn(s) ? "self" : null;
}
function wn(e, t) {
  return se(t, e) || e.some((n, i) => Ft(t, n, e[(i + 1) % e.length]) <= cc);
}
const wr = (e, t) => !(e.zoneBlacklist ?? []).includes(t);
function fc(e, t) {
  const n = X(e, t);
  return n ? F(e).filter((i) => wn(Ct(e, i), n.pt)).map((i) => ({ zone: i, participates: wr(t, i.id) })) : [];
}
function zi(e, t) {
  const n = F(e).find((o) => o.id === t);
  if (!n) return [];
  const i = Ct(e, n), s = [];
  for (const o of e.devices) {
    const r = X(e, o);
    r && wn(i, r.pt) && s.push({ device: o, participates: wr(o, t) });
  }
  return s;
}
function yr(e) {
  const t = e.length;
  if (t === 0) return { x: 0, y: 0 };
  const n = bt(e);
  if (Math.abs(n) > uc) {
    let i = 0, s = 0;
    for (let r = 0; r < t; r++) {
      const a = e[r], l = e[(r + 1) % t], d = a.x * l.y - l.x * a.y;
      i += (a.x + l.x) * d, s += (a.y + l.y) * d;
    }
    const o = { x: i / (6 * n), y: s / (6 * n) };
    if (se(o, e)) return o;
  }
  return {
    x: e.reduce((i, s) => i + s.x, 0) / t,
    y: e.reduce((i, s) => i + s.y, 0) / t
  };
}
const mc = 3, ne = (e, t) => ({ ...e, automationZones: t }), br = (e) => ({ kind: "free", x: e.x, y: e.y, lost: !0 });
function gc(e, t) {
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
function vr(e, t) {
  if (e.id !== t.id || e.name !== t.name || e.invalid !== t.invalid) return !1;
  const n = e.shape, i = t.shape;
  return n.kind === "room" ? i.kind === "room" && n.roomId === i.roomId : i.kind === "polygon" && n.vertices.length === i.vertices.length && n.vertices.every((s, o) => gc(s, i.vertices[o]));
}
function wc(e, t) {
  if (t.kind === "free") return t;
  const n = Ti(e, t);
  return n ? n.x === t.x && n.y === t.y ? t : { ...t, x: n.x, y: n.y } : br(t);
}
function yn(e, t) {
  let n = t;
  const i = t.shape;
  if (i.kind === "polygon") {
    const o = i.vertices.map((r) => wc(e, r));
    o.some((r, a) => r !== i.vertices[a]) && (n = { ...t, shape: { kind: "polygon", vertices: o } });
  }
  const s = gr(e, n) !== null;
  return n.invalid === s ? n : { ...n, invalid: s };
}
function yc(e) {
  const t = e.automationZones;
  if (!t || t.length === 0) return e;
  const n = t.map((i) => yn(e, i));
  return n.some((i, s) => i !== t[s]) ? ne(e, n) : e;
}
function bc(e, t) {
  const n = e.automationZones, i = t.automationZones;
  if (!n || !i) return e;
  const s = n.map((o) => {
    const r = i.find((a) => a.id === o.id);
    return r && r !== o && vr(r, o) ? r : o;
  });
  return s.length === i.length && s.every((o, r) => o === i[r]) ? ne(e, i) : s.some((o, r) => o !== n[r]) ? ne(e, s) : e;
}
function $r(e, t) {
  return { level: ne(e, [...F(e), yn(e, t)]), zoneId: t.id };
}
function vc(e, t, n) {
  if (!e.zones.some((s) => s.id === t)) return { level: e, zoneId: null };
  const i = F(e).find((s) => s.shape.kind === "room" && s.shape.roomId === t);
  return i ? { level: e, zoneId: i.id } : $r(e, { id: q(), name: n, shape: { kind: "room", roomId: t }, invalid: !1 });
}
const xr = (e) => e.kind === "free" && e.lost ? { kind: "free", x: e.x, y: e.y } : e;
function $c(e, t, n) {
  if (t.length < mc) return { level: e, zoneId: null };
  const i = yn(e, { id: q(), name: n, shape: { kind: "polygon", vertices: t.map(xr) }, invalid: !1 });
  return nn(Ct(e, i)) ? { level: e, zoneId: null } : $r(e, i);
}
function xc(e, t, n) {
  const i = F(e), s = i.find((o) => o.id === t);
  return !s || s.name === n ? e : ne(e, i.map((o) => o === s ? { ...s, name: n } : o));
}
function kr(e, t) {
  if (t.length > 0) return { ...e, zoneBlacklist: t };
  const { zoneBlacklist: n, ...i } = e;
  return i;
}
function Mr(e, t) {
  const n = F(e);
  if (!n.some((s) => s.id === t)) return e;
  const i = e.devices.map((s) => {
    var o;
    return (o = s.zoneBlacklist) != null && o.includes(t) ? kr(s, s.zoneBlacklist.filter((r) => r !== t)) : s;
  });
  return {
    ...e,
    automationZones: n.filter((s) => s.id !== t),
    devices: i.some((s, o) => s !== e.devices[o]) ? i : e.devices
  };
}
function kc(e, t, n, i) {
  const s = F(e), o = s.find((l) => l.id === t);
  if (!o || o.shape.kind !== "polygon" || !Number.isInteger(n) || n < 0 || n >= o.shape.vertices.length)
    return e;
  const r = o.shape.vertices.map((l, d) => d === n ? xr(i) : l), a = yn(e, { ...o, shape: { kind: "polygon", vertices: r } });
  return vr(a, o) ? e : ne(e, s.map((l) => l === o ? a : l));
}
function _r(e, t, n, i) {
  const s = e.devices.find((a) => a.id === t);
  if (!s) return e;
  const o = s.zoneBlacklist ?? [];
  if (o.includes(n) !== i || !i && !F(e).some((a) => a.id === n)) return e;
  const r = kr(s, i ? o.filter((a) => a !== n) : [...o, n]);
  return { ...e, devices: e.devices.map((a) => a === s ? r : a) };
}
const Ae = 1;
function pt(e) {
  return structuredClone(e);
}
function bn(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) throw new Error(`wall not found: ${t}`);
  return n;
}
function Mc(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function vn(e, t, n) {
  const i = j(e, t.a), s = j(e, t.b), o = C(i, s), r = Mc(typeof n == "number" ? n : Pi(n, i, s) * o, 0, o);
  return { pt: o === 0 ? i : rl(i, s, r / o), offset: r };
}
function _c(e) {
  for (let t = 0; t <= e.nodes.length; t++) {
    let n = !1;
    for (const i of e.nodes) {
      if (!i.host) continue;
      const s = e.walls.find((a) => a.id === i.host.wallId);
      if (!s) continue;
      const { pt: o, offset: r } = vn(e, s, i);
      (Math.abs(i.x - o.x) > 1e-9 || Math.abs(i.y - o.y) > 1e-9) && (n = !0), i.x = o.x, i.y = o.y, i.host.offset = r;
    }
    if (!n) break;
  }
}
function Ar(e, t) {
  _c(e), t && Ic(t, e);
  const n = yc(re(or(Ne(e))));
  return t ? bc(n, t) : n;
}
function $t(e, t) {
  return Ar(pt(e), t);
}
function Sr(e, t, n) {
  const i = pn(e, t), s = i.host && e.walls.find((o) => o.id === i.host.wallId);
  if (i.host && s) {
    const { pt: o, offset: r } = vn(e, s, n);
    i.host.offset = r, i.x = o.x, i.y = o.y;
  } else
    i.x = n.x, i.y = n.y;
}
function zs(e, t) {
  if (t.kind === "free") return { pt: t.pt };
  if (t.kind === "node") return { pt: j(e, t.nodeId), nodeId: t.nodeId };
  const n = bn(e, t.wallId), { pt: i, offset: s } = vn(e, n, t.offset), o = C(j(e, n.a), j(e, n.b));
  return s <= Ae ? { pt: j(e, n.a), nodeId: n.a } : o - s <= Ae ? { pt: j(e, n.b), nodeId: n.b } : { pt: i, host: { wallId: t.wallId, offset: s } };
}
function Ds(e, t) {
  if (t.nodeId) return t.nodeId;
  const n = { id: q(), x: t.pt.x, y: t.pt.y };
  return t.host && (n.host = { ...t.host }), e.nodes.push(n), n.id;
}
function Ac(e, t, n, i) {
  const s = zs(e, t), o = zs(e, n);
  if (C(s.pt, o.pt) < Ae) return { level: e, wallId: null, endNodeId: null };
  const r = pt(e), a = Ds(r, s), l = Ds(r, o);
  if (a === l) return { level: e, wallId: null, endNodeId: null };
  const d = { id: q(), a, b: l, thickness: i.thickness, type: i.type, baseline: i.baseline };
  return r.walls.push(d), { level: $t(r, e), wallId: d.id, endNodeId: l };
}
function Er(e, t, n, i) {
  const s = i === "inner" ? n / 2 : i === "outer" ? -n / 2 : 0, o = Math.min(e.x, t.x) - s, r = Math.max(e.x, t.x) + s, a = Math.min(e.y, t.y) - s, l = Math.max(e.y, t.y) + s;
  return r - o < Ae || l - a < Ae ? null : [{ x: o, y: a }, { x: r, y: a }, { x: r, y: l }, { x: o, y: l }];
}
function Sc(e, t, n, i, s) {
  const o = Er(t, n, i.thickness, s);
  if (!o) return e;
  const r = pt(e), a = o.map((l) => {
    const d = { id: q(), x: l.x, y: l.y };
    return r.nodes.push(d), d.id;
  });
  for (let l = 0; l < 4; l++)
    r.walls.push({
      id: q(),
      a: a[l],
      b: a[(l + 1) % 4],
      thickness: i.thickness,
      type: i.type,
      baseline: "center"
    });
  return $t(r, e);
}
function Ec(e, t, n) {
  const i = pt(e);
  return Sr(i, t, n), Ar(i, e);
}
function Ic(e, t) {
  const n = [
    ...t.openings,
    ...t.devices.flatMap((i) => i.placement.mode === "wall" ? [i.placement] : []),
    ...F(t).flatMap((i) => i.shape.kind === "polygon" ? i.shape.vertices : []).flatMap((i) => i.kind === "wall" ? [i] : [])
  ];
  for (const i of t.walls) {
    const s = e.walls.find((c) => c.id === i.id);
    if (!s || s.a !== i.a) continue;
    const o = e.nodes.find((c) => c.id === s.a), r = e.nodes.find((c) => c.id === s.b), a = t.nodes.find((c) => c.id === i.a), l = t.nodes.find((c) => c.id === i.b);
    if (!o || !r || !a || !l || o.x === a.x && o.y === a.y) continue;
    const d = C(a, l);
    if (d === 0) continue;
    const u = un(E(r, o));
    for (const c of n)
      c.wallId === i.id && (c.offset = Pi(O(o, S(u, c.offset)), a, l) * d);
  }
}
function Pc(e, t, n) {
  const i = pt(e), s = bn(i, t), r = (s.a === s.b ? [s.a] : [s.a, s.b]).map((a) => ({ id: a, to: O(j(i, a), n) }));
  for (const a of r) Sr(i, a.id, a.to);
  return $t(i, e);
}
function $n(e) {
  e.nodes = e.nodes.filter((t) => e.walls.some((n) => n.a === t.id || n.b === t.id));
}
function Ir(e, t, n) {
  for (const i of F(e))
    if (i.shape.kind === "polygon")
      for (const s of i.shape.vertices) s.kind === "node" && s.nodeId === t && (s.nodeId = n);
}
function Oc(e, t, n) {
  const i = pt(e), s = bn(i, t), o = s[n], r = j(i, o), a = { id: q(), x: r.x, y: r.y };
  return i.nodes.push(a), s[n] = a.id, i.walls.some((l) => l.a === o || l.b === o) || Ir(i, o, a.id), $n(i), { level: $t(i, e), nodeId: a.id };
}
function Cc(e, t, n) {
  if (t === n) return e;
  const i = pt(e);
  for (const o of i.walls)
    o.a === t && (o.a = n), o.b === t && (o.b = n);
  const s = new Set(i.walls.filter((o) => o.a === o.b).map((o) => o.id));
  i.walls = i.walls.filter((o) => !s.has(o.id)), i.openings = i.openings.filter((o) => !s.has(o.wallId)), i.devices = i.devices.filter((o) => o.placement.mode !== "wall" || !s.has(o.placement.wallId));
  for (const o of i.nodes) o.host && s.has(o.host.wallId) && delete o.host;
  return Ir(i, t, n), i.nodes = i.nodes.filter((o) => o.id !== t), $n(i), $t(i, e);
}
function Di(e, t) {
  var i;
  const n = pt(e);
  n.walls = n.walls.filter((s) => s.id !== t), n.openings = n.openings.filter((s) => s.wallId !== t), n.devices = n.devices.filter((s) => s.placement.mode !== "wall" || s.placement.wallId !== t);
  for (const s of n.nodes) ((i = s.host) == null ? void 0 : i.wallId) === t && delete s.host;
  return $n(n), $t(n, e);
}
function Lc(e, t, n) {
  const i = pt(e);
  return Object.assign(bn(i, t), n), $t(i, e);
}
const it = (e) => typeof e == "string" && e !== "" ? e : null, Pr = (e) => e.split(".")[0], Nc = ["friendly_name", "device_class", "unit_of_measurement"];
function Or(e, t) {
  const n = t.attributes ?? {};
  return {
    entityId: e,
    domain: Pr(e),
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
function Tc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const [n, i] of Object.entries(e ?? {})) t.set(n, Or(n, i ?? {}));
  return { entities: t, devices: /* @__PURE__ */ new Map(), areas: /* @__PURE__ */ new Map(), registryLoaded: !1 };
}
function zc(e, t) {
  if (e === t) return !0;
  if (!e || !t) return Object.keys(e ?? t ?? {}).length === 0;
  let n = 0;
  for (const i in t) {
    n++;
    const s = e[i], o = t[i];
    if (s === o) continue;
    if (!s || !o) return !1;
    const r = s.attributes ?? {}, a = o.attributes ?? {};
    if (r !== a && Nc.some((l) => r[l] !== a[l])) return !1;
  }
  return n === Object.keys(e).length;
}
function Cr(e, t) {
  const n = e == null ? void 0 : e[t];
  return n ? typeof n.state == "string" ? n.state : String(n.state ?? "") : null;
}
async function Dc(e) {
  const t = (r) => e.connection.sendMessagePromise({ type: r }), [n, i, s] = await Promise.all([
    t("config/entity_registry/list"),
    t("config/device_registry/list"),
    t("config/area_registry/list")
  ]), o = /* @__PURE__ */ new Map();
  for (const r of n) {
    const a = Or(r.entity_id, {});
    o.set(r.entity_id, {
      ...a,
      name: it(r.name) ?? it(r.original_name) ?? a.name,
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
function Rc(e, t) {
  const n = new Map(t.entities);
  for (const [i, s] of e.entities) {
    const o = t.entities.get(i);
    n.set(i, o ? { ...o, name: s.name !== i ? s.name : o.name, deviceClass: s.deviceClass ?? o.deviceClass, unit: s.unit ?? o.unit } : s);
  }
  return { entities: n, devices: t.devices, areas: t.areas, registryLoaded: !0 };
}
function Lr(e, t, n) {
  const i = e.entities.get(t);
  if (!i) return e.registryLoaded ? "missing" : "unknown";
  const s = i.disabled ? null : Cr(n, t);
  return s === null || s === "unavailable" ? "unavailable" : "present";
}
const Bc = {
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
  "tool.equipment": "Equipment",
  "tool.climate_sensor": "Climate sensor",
  "tool.exhaust_fan": "Exhaust fan",
  "tool.zones-select": "Select",
  "tool.zone-room": "Zone from room",
  "tool.zone-draw": "Custom zone",
  "tool.power-select": "Select",
  "tool.power-device": "Plan device",
  "tool.power-meter": "Meter",
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
  "role.motion": "Motion",
  "role.illuminance": "Illuminance",
  "role.temperature": "Temperature",
  "role.humidity": "Humidity",
  "role.state": "State",
  "role.power": "Power",
  "role.on": "On",
  "role.off": "Off",
  "role.auto": "Auto",
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
  "power.kind.meter": "Meter",
  "power.kind.bus": "Bus",
  "power.kind.battery": "Battery",
  "power.kind.pv": "PV field",
  "power.kind.transfer": "Transfer switch",
  "power.kind.remainder": "Other",
  "power.missing": "Device missing",
  "power.planDevice": "Plan device",
  "power.loss": "Loss",
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
  "power.title.device": "Plan device",
  "power.title.meter": "Meter",
  "power.title.bus": "Bus",
  "power.title.battery": "Battery",
  "power.title.pv": "PV field",
  "power.title.transfer": "Transfer switch",
  "power.title.remainder": "Remainder",
  "power.pick": "Select a block or a wire to edit it.",
  "power.noDevices": "No devices left to place. Sockets, equipment and devices with a power or control binding are listed until they are in the schematic.",
  "power.field.power": "Power",
  "power.field.batteryPower": "Power (+ charging)",
  "power.field.voltage": "Voltage",
  "power.field.soc": "SOC",
  "power.field.switch": "Switch",
  "power.controllable": "Controllable",
  "power.inverter": "Inverter",
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
function f(e) {
  return Bc[e] ?? e;
}
const Hc = ["grid", "device", "meter", "bus", "battery", "pv", "transfer", "remainder"], Fc = ["IN", "OUT", "PV", "BAT", "A", "B"], Uc = 10;
function xn(e) {
  const t = (n, i) => ({ name: n, dir: i });
  switch (e.kind) {
    case "grid":
      return [t("OUT", "out")];
    case "device":
      return e.inverter ? [t("IN", "in"), t("OUT", "out"), t("PV", "in"), t("BAT", "out")] : [t("IN", "in"), t("OUT", "out")];
    case "meter":
      return [t("IN", "in"), t("OUT", "out")];
    case "battery":
      return [t("BAT", "in")];
    case "pv":
      return [t("OUT", "out")];
    case "remainder":
      return [t("IN", "in")];
    case "transfer":
      return e.form === "2in1out" ? [t("A", "in"), t("B", "in"), t("OUT", "out")] : e.form === "1in2out" ? [t("IN", "in"), t("A", "out"), t("B", "out")] : [];
    default:
      return [];
  }
}
function Nr() {
  return { blocks: [{ id: q(), kind: "grid", x: 0, y: 0 }], wires: [] };
}
function Vc(e, t, n, i) {
  const s = { id: q(), x: t.x, y: t.y }, o = { ...s, name: `${f(`power.kind.${e}`)} ${1 + n.blocks.filter((r) => r.kind === e).length}` };
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
function Rs(e, t) {
  return { ...e, blocks: [...e.blocks, t] };
}
function kn(e, t, n) {
  return e.blocks.some((i) => i.id === t) ? { ...e, blocks: e.blocks.map((i) => i.id === t ? n(i) : i) } : e;
}
function jc(e, t, n, i) {
  return kn(e, t, (s) => ({ ...s, x: n, y: i }));
}
const Bs = (e) => "block" in e ? e.block : e.bus, Tr = (e, t) => Bs(e.from) === t || Bs(e.to) === t;
function Se(e, t, n) {
  const i = e.blocks.find((l) => l.id === t);
  if (!i) return e;
  const s = kn(e, t, (l) => ({ ...l, ...n }));
  if (i.kind === "transfer" && "form" in n && n.form !== i.form)
    return { ...s, wires: s.wires.filter((l) => !Tr(l, t)) };
  const o = s.blocks.find((l) => l.id === t), r = new Set(xn(o).map((l) => l.name)), a = (l) => "block" in l && l.block === t && !r.has(l.port);
  return s.wires.some((l) => a(l.from) || a(l.to)) ? { ...s, wires: s.wires.filter((l) => !a(l.from) && !a(l.to)) } : s;
}
function zr(e, t) {
  const n = e.blocks.find((i) => i.id === t);
  return !n || n.kind === "grid" ? e : { blocks: e.blocks.filter((i) => i.id !== t), wires: e.wires.filter((i) => !Tr(i, t)) };
}
function Dr(e, t) {
  return e.wires.some((n) => n.id === t) ? { ...e, wires: e.wires.filter((n) => n.id !== t) } : e;
}
function Wc(e, t, n, i) {
  return kn(e, t, (s) => {
    const o = { ...s.portPins };
    i ? o[n] = i : delete o[n];
    const { portPins: r, ...a } = s;
    return Object.keys(o).length ? { ...a, portPins: o } : a;
  });
}
function Zc(e, t) {
  return kn(e, t, (n) => {
    const { portPins: i, ...s } = n;
    return s;
  });
}
function Hs(e, t) {
  if (e.kind === "battery") return "bat";
  if (e.kind === "pv") return "pv";
  if (e.kind === "device" && e.inverter) {
    if (t === "BAT") return "bat";
    if (t === "PV") return "pv";
  }
  return "ac";
}
function qc(e, t) {
  const n = e.filter((o) => o.kind === "transfer"), i = n.slice(0, Uc), s = /* @__PURE__ */ new Map();
  for (const o of n) o.kind === "transfer" && s.set(o.id, o.form === "2in1out" ? "OUT" : "IN");
  for (let o = 0; o < 1 << i.length; o++) {
    const r = /* @__PURE__ */ new Map();
    i.forEach((u, c) => r.set(u.id, o & 1 << c ? "B" : "A"));
    const a = /* @__PURE__ */ new Map(), l = (u) => {
      let c = u;
      for (; a.has(c) && a.get(c) !== c; ) c = a.get(c);
      return c;
    }, d = (u, c) => {
      if ("bus" in u) return `n:${u.bus}`;
      const p = s.get(u.block);
      return p !== void 0 && u.port !== p && u.port !== (r.get(u.block) ?? "A") ? `x:${c.id}:${u.port}` : `n:${u.block}`;
    };
    for (const u of t) {
      const c = l(d(u.from, u)), p = l(d(u.to, u));
      if (c === p) return !0;
      a.set(c, p);
    }
  }
  return !1;
}
function Fs(e, t, n) {
  const i = new Map(e.blocks.map((w) => [w.id, w])), s = (w) => {
    if ("bus" in w) {
      const x = i.get(w.bus);
      return x && x.kind === "bus" ? { bl: x, dir: null } : null;
    }
    const g = i.get(w.block), $ = g ? xn(g).find((x) => x.name === w.port) : void 0;
    return g && $ ? { bl: g, dir: $.dir } : null;
  }, o = s(t), r = s(n);
  if (!o || !r) return { error: "missing" };
  if (o.bl.id === r.bl.id) return { error: "same-block" };
  let a = t, l = n;
  if (o.dir === null || r.dir === null)
    (o.dir === "in" || r.dir === "out") && (a = n, l = t);
  else {
    if (o.dir === r.dir)
      return { error: "direction" };
    o.dir === "in" && (a = n, l = t);
  }
  const d = (w) => "block" in w && e.wires.some((g) => [g.from, g.to].some(($) => "block" in $ && $.block === w.block && $.port === w.port));
  if (d(a) || d(l)) return { error: "port-taken" };
  const u = (w) => {
    for (const g of e.wires)
      for (const [$, x] of [[g.from, g.to], [g.to, g.from]])
        if ("bus" in $ && $.bus === w && "block" in x) {
          const M = i.get(x.block);
          if (M) return Hs(M, x.port);
        }
    return null;
  }, c = (w) => "bus" in w ? u(w.bus) : Hs(i.get(w.block), w.port), p = c(a), h = c(l);
  if (p !== null && h !== null && p !== h) return { error: "dc-mismatch" };
  if ("bus" in a && "block" in l && i.get(l.block).kind === "remainder" && e.wires.some((w) => {
    var g;
    return "bus" in w.from && w.from.bus === a.bus && "block" in w.to && ((g = i.get(w.to.block)) == null ? void 0 : g.kind) === "remainder";
  }))
    return { error: "second-remainder" };
  const m = { id: q(), from: a, to: l }, y = [...e.wires, m];
  return qc(e.blocks, y) ? { error: "loop" } : { schema: { ...e, wires: y }, wire: m };
}
const ft = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Qt = (e) => typeof e == "number" && Number.isFinite(e), Gc = ["top", "right", "bottom", "left"], Kc = ["2in1out", "1in2out"];
function Yc(e) {
  let t = e;
  if (t.kind === "bus" && !(Qt(t.w) && Qt(t.h) && t.w >= 1 && t.h >= 1) && (t = { ...t, w: 240, h: 12 }), t.kind === "transfer" && !Kc.includes(t.form) && (t = { ...t, form: "2in1out" }), !("portPins" in t)) return t;
  const n = t.portPins, i = new Set(xn(t).map((l) => l.name)), s = {};
  let o = ft(n);
  for (const [l, d] of ft(n) ? Object.entries(n) : []) {
    if (!i.has(l) || !ft(d) || !Gc.includes(d.side) || !Qt(d.at)) {
      o = !1;
      continue;
    }
    const u = Math.min(1, Math.max(0, d.at));
    u !== d.at && (o = !1), s[l] = u === d.at ? d : { side: d.side, at: u };
  }
  if (o) return t;
  const { portPins: r, ...a } = t;
  return Object.keys(s).length ? { ...a, portPins: s } : a;
}
function Xc(e) {
  if (!ft(e)) return;
  const t = Array.isArray(e.blocks) ? e.blocks : [], n = Array.isArray(e.wires) ? e.wires : [];
  let i = !Array.isArray(e.blocks) || !Array.isArray(e.wires);
  const s = [], o = /* @__PURE__ */ new Set();
  for (const d of t)
    if (ft(d) && typeof d.id == "string" && d.id && Hc.includes(d.kind) && Qt(d.x) && Qt(d.y)) {
      const u = Yc(d);
      u !== d && (i = !0), u.kind === "transfer" && u.form !== d.form && o.add(u.id), s.push(u);
    } else i = !0;
  const r = new Map(s.map((d) => [d.id, d])), a = (d) => {
    var u;
    if (!ft(d)) return null;
    if (typeof d.bus == "string") {
      if (((u = r.get(d.bus)) == null ? void 0 : u.kind) !== "bus" || !Qt(d.at)) return null;
      const c = Math.min(1, Math.max(0, d.at));
      return c === d.at ? d : { bus: d.bus, at: c };
    }
    return typeof d.block == "string" && Fc.includes(d.port) && r.has(d.block) && !o.has(d.block) ? d : null;
  }, l = [];
  for (const d of n) {
    const u = ft(d) ? a(d.from) : null, c = ft(d) ? a(d.to) : null;
    if (!ft(d) || typeof d.id != "string" || !d.id || !u || !c) {
      i = !0;
      continue;
    }
    u === d.from && c === d.to ? l.push(d) : (i = !0, l.push({ ...d, from: u, to: c }));
  }
  return i ? { ...e, blocks: s, wires: l } : e;
}
function Rr(e, t) {
  const n = new Set(t.blocks.flatMap((i) => i.kind === "device" ? [i.deviceId] : []));
  return e.devices.filter((i) => {
    var s, o;
    return !n.has(i.id) && (i.props.kind === "socket" || i.props.kind === "equipment" || !!((s = i.bindings) != null && s.power) || !!((o = i.bindings) != null && o.control));
  }).sort((i, s) => i.name.localeCompare(s.name) || i.id.localeCompare(s.id));
}
function Qc(e) {
  const t = e.blocks.find((n) => n.kind === "grid");
  return !!t && t.kind === "grid" && !!t.power && e.wires.length > 0;
}
const Mn = 11, sn = 18, on = 30, Jc = 12, td = 120, et = 14, Us = 10, Ee = (e) => Math.round(e / Us) * Us || 0, Fn = 24, Vs = 6, ed = 2 * Mn + 6, nd = et, id = 1e6, js = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 }
}, _n = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 }), Un = (e, t, n) => e.x >= t.x - n && e.x <= t.x + t.w + n && e.y >= t.y - n && e.y <= t.y + t.h + n, Br = (e) => Math.min(1, Math.max(0, e));
function Ri(e, t) {
  var n;
  return e.kind === "device" ? ((n = t.device(e.deviceId)) == null ? void 0 : n.name) ?? "" : e.name ?? "";
}
function sd(e, t) {
  var i, s, o;
  const n = (...r) => r.filter(Boolean).length;
  switch (e.kind) {
    case "grid":
      return 1 + n(e.voltage);
    case "device": {
      const r = t.device(e.deviceId);
      return r ? n((i = r.bindings) == null ? void 0 : i.power, (s = r.bindings) == null ? void 0 : s.control, e.inverter) : 1;
    }
    case "meter":
      return 1 + n(e.voltage, (o = e.switch) == null ? void 0 : o.entity);
    case "battery":
      return 2;
    case "bus":
      return 0;
    default:
      return 1;
  }
}
function ut(e, t, n) {
  return n ? Fi(n, e, t).r : Bi(e, t);
}
function Bi(e, t) {
  return e.kind === "bus" ? { x: e.x, y: e.y, w: e.w, h: e.h } : {
    x: e.x,
    y: e.y,
    w: Math.max(td, 7 * Ri(e, t).length + 32),
    h: on + sn * sd(e, t) + Jc
  };
}
function ci(e, t, n) {
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
function od(e, t) {
  const n = _n(e), i = t.x - n.x, s = t.y - n.y;
  return i === 0 && s === 0 ? null : Math.abs(i) / (e.w / 2) > Math.abs(s) / (e.h / 2) ? i > 0 ? "right" : "left" : s > 0 ? "bottom" : "top";
}
function rd(e, t) {
  const n = [
    { side: "top", a: { x: e.x, y: e.y }, b: { x: e.x + e.w, y: e.y } },
    { side: "right", a: { x: e.x + e.w, y: e.y }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "bottom", a: { x: e.x, y: e.y + e.h }, b: { x: e.x + e.w, y: e.y + e.h } },
    { side: "left", a: { x: e.x, y: e.y }, b: { x: e.x, y: e.y + e.h } }
  ];
  let i = n[0], s = 1 / 0;
  for (const a of n) {
    const l = Ft(t, a.a, a.b);
    l < s && (i = a, s = l);
  }
  const r = i.side === "top" || i.side === "bottom" ? e.w ? (t.x - e.x) / e.w : 0.5 : e.h ? (t.y - e.y) / e.h : 0.5;
  return { side: i.side, at: Br(r) };
}
const An = (e) => e.w >= e.h;
function Hr(e, t) {
  return An(e) ? { x: e.x + t * e.w, y: e.y + e.h / 2 } : { x: e.x + e.w / 2, y: e.y + t * e.h };
}
function ad(e, t, n) {
  const i = { x: e.x, y: e.y, w: e.w, h: e.h }, s = _n(i), o = An(e) ? n.y < s.y ? "top" : "bottom" : n.x < s.x ? "left" : "right";
  return { pt: ci(i, o, t), side: o };
}
function ld(e, t) {
  if (e.kind === "device" && e.inverter) {
    if (t.name === "BAT") return "right";
    if (t.name === "PV") return "top";
  }
  return t.dir === "in" ? "top" : "bottom";
}
const Hi = (e, t) => e.blocks.find((n) => n.id === t), di = (e, t) => {
  const n = Hi(e, t);
  return (n == null ? void 0 : n.kind) === "bus" ? n : void 0;
}, Vn = (e, t, n) => "block" in e && e.block === t && e.port === n;
function cd(e, t, n, i) {
  const s = e.wires.find((a) => Vn(a.from, t, n) || Vn(a.to, t, n));
  if (!s) return null;
  const o = Vn(s.from, t, n) ? s.to : s.from;
  if ("bus" in o) {
    const a = di(e, o.bus);
    return a ? Hr(a, o.at) : null;
  }
  const r = Hi(e, o.block);
  return r ? _n(Bi(r, i)) : null;
}
function Fi(e, t, n) {
  const i = Bi(t, n), s = _n(i), o = xn(t).map((d) => {
    var m;
    const u = (m = t.portPins) == null ? void 0 : m[d.name];
    if (u) return { ...d, side: u.side, pin: u, key: 0 };
    const c = cd(e, t.id, d.name, n), p = (c && od(i, c)) ?? ld(t, d), h = c ?? s;
    return { ...d, side: p, pin: void 0, key: p === "top" || p === "bottom" ? h.x : h.y };
  }), r = (d) => {
    const u = o.filter((c) => c.side === d).length;
    return u ? (u + 1) * ed : 0;
  }, a = {
    ...i,
    w: Math.max(i.w, r("top"), r("bottom")),
    h: Math.max(i.h, r("left"), r("right"))
  }, l = new Array(o.length);
  o.forEach((d, u) => {
    d.pin && (l[u] = { name: d.name, dir: d.dir, side: d.side, pt: ci(a, d.side, d.pin.at), pinned: !0 });
  });
  for (const d of ["top", "right", "bottom", "left"]) {
    const u = o.map((c, p) => ({ p: c, i: p })).filter(({ p: c }) => !c.pin && c.side === d).sort((c, p) => c.p.key - p.p.key || c.i - p.i);
    u.forEach(({ p: c, i: p }, h) => {
      l[p] = { name: c.name, dir: c.dir, side: d, pt: ci(a, d, (h + 1) / (u.length + 1)), pinned: !1 };
    });
  }
  return { r: a, places: l };
}
function Sn(e, t, n) {
  return Fi(e, t, n).places;
}
function Fr(e, t, n) {
  const i = (d) => {
    if (!("block" in d)) return null;
    const u = Hi(e, d.block);
    if (!u) return null;
    const { r: c, places: p } = Fi(e, u, n), h = p.find((m) => m.name === d.port);
    return h ? { pt: h.pt, side: h.side, rect: c } : null;
  }, s = (d, u, c) => {
    if (!("bus" in d)) return null;
    const p = di(e, d.bus);
    if (!p) return null;
    let h = c == null ? void 0 : c.pt;
    if (!h && "bus" in u) {
      const m = di(e, u.bus);
      h = m && Hr(m, u.at);
    }
    return h ? { ...ad(p, d.at, h), rect: ut(p, n, e) } : null;
  }, o = i(t.from), r = i(t.to), a = o ?? s(t.from, t.to, r), l = r ?? s(t.to, t.from, o);
  return a && l ? { a, b: l } : null;
}
const De = (e, t) => ({ x: Math.sign(t.x - e.x), y: Math.sign(t.y - e.y) }), ui = (e, t) => Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
function dd(e, t, n) {
  const i = [];
  for (const a of e) {
    const l = i[i.length - 1];
    if (!(l && l.x === a.x && l.y === a.y)) {
      if (l && l.x !== a.x && l.y !== a.y) return null;
      if (i.length >= 2) {
        const d = De(i[i.length - 2], l), u = De(l, a);
        if (d.x === u.x && d.y === u.y) {
          i[i.length - 1] = a;
          continue;
        }
        if (d.x === -u.x && d.y === -u.y) return null;
      }
      i.push(a);
    }
  }
  const s = i.length;
  if (s < 2 || s > 6) return null;
  const o = De(i[0], i[1]), r = De(i[s - 2], i[s - 1]);
  return o.x !== t.x || o.y !== t.y || ui(i[0], i[1]) < et - 1e-9 || r.x !== -n.x || r.y !== -n.y || ui(i[s - 2], i[s - 1]) < et - 1e-9 ? null : i;
}
function ud(e, t, n) {
  return Math.min(e.x, t.x) < n.x + n.w - 0.5 && Math.max(e.x, t.x) > n.x + 0.5 && Math.min(e.y, t.y) < n.y + n.h - 0.5 && Math.max(e.y, t.y) > n.y + 0.5;
}
function pd(e, t) {
  let n = (e.length - 2) * nd;
  for (let i = 1; i < e.length; i++) {
    n += ui(e[i - 1], e[i]);
    for (const s of t) ud(e[i - 1], e[i], s) && (n += id);
  }
  return n;
}
function Ur(e, t) {
  const n = e.pt, i = t.pt, s = js[e.side], o = js[t.side], r = { x: n.x + s.x * et, y: n.y + s.y * et }, a = { x: i.x + o.x * et, y: i.y + o.y * et }, l = [e.rect, t.rect].filter((x) => !!x), d = (x, M) => [.../* @__PURE__ */ new Set([
    (r[x] + a[x]) / 2,
    r[x],
    a[x],
    n[x],
    i[x],
    ...l.flatMap((_) => [_[x] - et, _[x] + _[M] + et]),
    Math.min(r[x], a[x]) - et,
    Math.max(r[x], a[x]) + et
  ])], u = d("x", "w"), c = d("y", "h"), p = s.x === 0, h = o.x === 0, m = (p ? c : u).filter((x) => (x - (p ? n.y : n.x)) * (p ? s.y : s.x) >= et - 1e-9), y = (h ? c : u).filter((x) => (x - (h ? i.y : i.x)) * (h ? o.y : o.x) >= et - 1e-9);
  let w = null, g = 1 / 0;
  const $ = (x) => {
    const M = dd(x, s, o);
    if (!M) return;
    const _ = pd(M, l);
    _ < g - 1e-6 && (w = M, g = _);
  };
  if (p && h)
    for (const x of m) for (const M of u) for (const _ of y)
      $([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: _ }, { x: i.x, y: _ }, i]);
  else if (!p && !h)
    for (const x of m) for (const M of c) for (const _ of y)
      $([n, { x, y: n.y }, { x, y: M }, { x: _, y: M }, { x: _, y: i.y }, i]);
  else if (p)
    for (const x of m) for (const M of y)
      $([n, { x: n.x, y: x }, { x: M, y: x }, { x: M, y: i.y }, i]);
  else
    for (const x of m) for (const M of y)
      $([n, { x, y: n.y }, { x, y: M }, { x: i.x, y: M }, i]);
  return w ?? [n, r, p ? { x: r.x, y: a.y } : { x: a.x, y: r.y }, a, i];
}
function Vr(e, t, n) {
  const i = ut(e, t, n), s = i.x + (i.w - (3 * Fn + 2 * Vs)) / 2, o = i.y + on + 1;
  return ["A", "0", "B"].map((r, a) => ({
    position: r,
    rect: { x: s + a * (Fn + Vs), y: o, w: Fn, h: sn - 2 }
  }));
}
function hd(e) {
  const { x: t, y: n, w: i, h: s } = e;
  return An(e) ? [{ end: "start", a: { x: t, y: n }, b: { x: t, y: n + s } }, { end: "end", a: { x: t + i, y: n }, b: { x: t + i, y: n + s } }] : [{ end: "start", a: { x: t, y: n }, b: { x: t + i, y: n } }, { end: "end", a: { x: t, y: n + s }, b: { x: t + i, y: n + s } }];
}
function Ws(e, t, n, i) {
  const s = [...e.blocks].reverse();
  for (const u of s) {
    if (u.kind !== "transfer") continue;
    const c = Vr(u, i, e).find((p) => Un(t, p.rect, 0));
    if (c) return { kind: "chip", block: u.id, position: c.position };
  }
  let o = null, r = 1 / 0;
  for (const u of s)
    for (const c of Sn(e, u, i)) {
      const p = C(t, c.pt);
      p <= Mn + n && p < r && (o = { kind: "port", block: u.id, port: c.name }, r = p);
    }
  if (o) return o;
  for (const u of s) {
    if (u.kind !== "bus") continue;
    let c = null, p = 1 / 0;
    for (const h of hd(u)) {
      const m = Ft(t, h.a, h.b);
      m <= n && m < p && (c = { kind: "bus-end", id: u.id, end: h.end }, p = m);
    }
    if (c) return c;
  }
  for (const u of s) {
    if (u.kind !== "bus" || !Un(t, ut(u, i, e), n)) continue;
    const c = An(u) ? (t.x - u.x) / u.w : (t.y - u.y) / u.h;
    return { kind: "bus", id: u.id, at: Br(c) };
  }
  let a = null, l = 1 / 0;
  for (const u of e.wires) {
    const c = Fr(e, u, i);
    if (!c) continue;
    const p = Ur(c.a, c.b);
    for (let h = 1; h < p.length; h++) {
      const m = Ft(t, p[h - 1], p[h]);
      m <= n && m < l && (a = { kind: "wire", id: u.id }, l = m);
    }
  }
  if (a) return a;
  const d = s.find((u) => u.kind !== "bus" && Un(t, ut(u, i, e), 0));
  return d ? { kind: "block", id: d.id } : null;
}
function fd(e, t) {
  if (!e.blocks.length) return null;
  let n = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
  for (const r of e.blocks) {
    const a = ut(r, t, e);
    n = Math.min(n, a.x), i = Math.min(i, a.y), s = Math.max(s, a.x + a.w), o = Math.max(o, a.y + a.h);
  }
  return { x: n, y: i, w: s - n, h: o - i };
}
class jr extends Error {
  constructor(t = "Revision conflict") {
    super(t), this.name = "RevisionConflictError";
  }
}
async function jn(e) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/list"
  })).plans;
}
async function md(e, t) {
  return (await e.connection.sendMessagePromise({
    type: "plan_studio/plans/get",
    plan_id: t
  })).plan;
}
async function gd(e, t, n, i = !1) {
  try {
    return (await e.connection.sendMessagePromise({
      type: "plan_studio/plans/save",
      plan: t,
      expected_revision: n,
      force: i
    })).revision;
  } catch (s) {
    throw typeof s == "object" && s !== null && s.code === "revision_conflict" ? new jr(s.message) : s;
  }
}
async function wd(e, t) {
  await e.connection.sendMessagePromise({
    type: "plan_studio/plans/delete",
    plan_id: t
  });
}
const yd = 3;
function wt(e) {
  if (typeof e == "number")
    return e === yd ? "Connection lost" : `Connection error ${e}`;
  if (typeof e == "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e == "object" && e !== null) {
    const t = e;
    if (typeof t.message == "string" && t.message) return t.message;
    if (t.code !== void 0) return String(t.code);
  }
  return typeof e == "object" && e !== null ? "Unknown error" : String(e);
}
class bd {
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
      const o = await gd(this.hass, t, n, i);
      return this.baseRevision = o, this.dirty = this.dirtyVersion !== s, this.state = "saved", this.onChange(), o;
    } catch (o) {
      return o instanceof jr ? (this.state = "conflict", this.errorMessage = o.message) : (this.state = "error", this.errorMessage = wt(o)), this.onChange(), null;
    }
  }
}
var vd = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z", $d = "M21.4 7.5C22.2 8.3 22.2 9.6 21.4 10.3L18.6 13.1L10.8 5.3L13.6 2.5C14.4 1.7 15.7 1.7 16.4 2.5L18.2 4.3L21.2 1.3L22.6 2.7L19.6 5.7L21.4 7.5M15.6 13.3L14.2 11.9L11.4 14.7L9.3 12.6L12.1 9.8L10.7 8.4L7.9 11.2L6.4 9.8L3.6 12.6C2.8 13.4 2.8 14.7 3.6 15.4L5.4 17.2L1.4 21.2L2.8 22.6L6.8 18.6L8.6 20.4C9.4 21.2 10.7 21.2 11.4 20.4L14.2 17.6L12.8 16.2L15.6 13.3Z", xd = "M1,11H3.17C3.58,9.83 4.69,9 6,9C6.65,9 7.25,9.21 7.74,9.56L14.44,4.87L15.58,6.5L8.89,11.2C8.96,11.45 9,11.72 9,12A3,3 0 0,1 6,15C4.69,15 3.58,14.17 3.17,13H1V11M23,11V13H20.83C20.42,14.17 19.31,15 18,15A3,3 0 0,1 15,12A3,3 0 0,1 18,9C19.31,9 20.42,9.83 20.83,11H23M6,11A1,1 0 0,0 5,12A1,1 0 0,0 6,13A1,1 0 0,0 7,12A1,1 0 0,0 6,11M18,11A1,1 0 0,0 17,12A1,1 0 0,0 18,13A1,1 0 0,0 19,12A1,1 0 0,0 18,11Z", kd = "M20.83 11A3 3 0 0 0 15.18 11H8.82A3 3 0 0 0 3.17 11H1V13H3.17A3 3 0 0 0 8.82 13H15.18A3 3 0 0 0 20.83 13H23V11M6 13A1 1 0 1 1 7 12A1 1 0 0 1 6 13M18 13A1 1 0 1 1 19 12A1 1 0 0 1 18 13Z", Md = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z", _d = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z", Ad = "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13", Sd = "M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19Z", Ed = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z", Id = "M12 10C12 9.35 11.57 8.7 11 8.32C10.7 8.12 10.35 8 10 8V4H8V8H4V4H2V8C1 8 0 9 0 10V15.5L3.5 19V22H8.5V19L12 15.5V10M12.33 4C12.22 4 12.11 4 12 4.04V6.59C12.3 6.77 12.56 7 12.79 7.21C13.44 7.87 14 8.85 14 10V16.33L11 19.33V20.67C11 21.4 11.6 22 12.33 22H21.67C22 22 22.36 21.86 22.61 21.61C22.86 21.36 23 21 23 20.67V5.33C23 4.6 22.4 4 21.67 4H20V2H14V4H12.33Z", Pd = "M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5C6.66,13.5 6,12.83 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5M4.22,2H19.78C21,2 22,3 22,4.22V19.78A2.22,2.22 0 0,1 19.78,22H4.22C3,22 2,21 2,19.78V4.22A2.22,2.22 0 0,1 4.22,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z", Od = "M12.68 6H11.32L7 16H9L9.73 14H14.27L15 16H17L12.68 6M10.3 12.5L12 8L13.7 12.5H10.3M17.4 20.4L19 22H14V17L16 19C18.39 17.61 20 14.95 20 12C20 7.59 16.41 4 12 4S4 7.59 4 12C4 14.95 5.61 17.53 8 18.92V21.16C4.47 19.61 2 16.1 2 12C2 6.5 6.5 2 12 2S22 6.5 22 12C22 15.53 20.17 18.62 17.4 20.4Z", Cd = "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z", Ld = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z";
const lt = (e) => e.length === 0 ? "" : `M${e.map((t) => `${t.x} ${t.y}`).join("L")}Z`;
function dt(e, t, n) {
  let i = e.get(t);
  return i === void 0 && (i = n(t), e.set(t, i)), i;
}
const Ui = 12, B = "non-scaling-stroke", Nd = 7, Td = 10, zd = "#f43f5e", Dd = "3 2", Rd = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z", Wr = 24, Re = 4, Zs = 4, Ze = Ui * 0.85, Bd = 0.58;
function Hd(e, t, n, i) {
  const s = Wr;
  if (!t) return { mode: "stacked", iconX: 0, iconY: 0, labelX: 0, labelY: 0, labelAnchor: "middle" };
  const o = n * Math.PI / 180, r = Math.abs(Math.cos(o)), a = Math.abs(Math.sin(o)), [l, d] = e.shape === "circle" ? [e.diameter / Math.SQRT2, e.diameter / Math.SQRT2] : [e.width * r + e.depth * a, e.width * a + e.depth * r], u = l * i - 2 * Zs, c = d * i - 2 * Zs, p = t.length * Bd * Ze, h = s + Re + Ze, m = s + Re + p, y = Math.max(s, p), w = (M, _) => Math.max(0, M - u) + Math.max(0, _ - c), g = w(y, h), $ = w(m, s);
  if (g > 0 && $ < g) {
    const M = -m / 2;
    return {
      mode: "line",
      iconX: (M + s / 2) / i,
      iconY: 0,
      labelX: (M + s + Re) / i,
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
    labelY: (x + s + Re + Ze / 2) / i,
    labelAnchor: "middle"
  };
}
function Fd(e, t, n, i = 0, s = 0) {
  const o = Wr / t;
  return customElements.get("ha-icon") ? A`<foreignObject class="equipment-icon" x=${i - o / 2} y=${s - o / 2} width=${o} height=${o}
      style="pointer-events:none">
      <ha-icon icon=${e} style=${`--mdc-icon-size:${o}px;color:${n};display:block`}></ha-icon></foreignObject>` : A`<g class="equipment-icon" transform=${`translate(${i - o / 2} ${s - o / 2}) scale(${o / 24})`}>
    <path d=${Rd} fill=${n}></path></g>`;
}
const Ud = "__preview__", Vd = {
  unbound: "var(--secondary-text-color, #94a3b8)",
  partial: "#f59e0b",
  missing: "#f43f5e"
}, jd = /* @__PURE__ */ new WeakMap();
function Wd(e, t) {
  var s;
  const n = dt(jd, e.walls, () => /* @__PURE__ */ new WeakMap()), i = dt(n, e.nodes, () => /* @__PURE__ */ new WeakMap());
  return (s = dt(i, e.openings, () => ({})))[t] ?? (s[t] = ar(e, t));
}
const Zd = /* @__PURE__ */ new WeakMap();
function qd(e, t) {
  const n = gn(t.props.kind);
  if (!n) return [];
  const i = Wd(e, n), s = dt(Zd, i, () => /* @__PURE__ */ new WeakMap());
  let o = s.get(t);
  return o || (o = oc(e, t, () => i), s.set(t, o)), o;
}
function pi(e, t) {
  return e.props.kind === "ceiling_light" && e.props.shape === "round" ? Math.max(e.props.diameter / 2, t) : t;
}
function Gd(e, t, n, i, s) {
  const o = e.props, r = { stroke: n, fill: i };
  switch (o.kind) {
    case "ceiling_light":
      return o.shape === "linear" ? A`<rect class="icon" x=${-o.length / 2} y=${-o.width / 2} width=${o.length} height=${o.width}
          fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></rect>` : o.shape === "spot" ? A`<circle class="icon" r=${t / 3} fill=${n} stroke=${n} stroke-width="1" vector-effect=${B}></circle>` : A`<circle class="icon" r=${pi(e, t)} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>`;
    case "wall_light":
      return A`<path class="icon" d=${`M0 ${-t}A${t} ${t} 0 0 0 0 ${t}Z`} fill=${r.fill} stroke=${r.stroke}
        stroke-width="1.5" vector-effect=${B}></path>`;
    case "motion_sensor": {
      const a = (l) => `M${t * l} ${-t * l * 0.8}A${t * l} ${t * l * 0.8} 0 0 1 ${t * l} ${t * l * 0.8}`;
      return A`<circle class="icon" r=${t * 0.6} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="arcs" d=${a(1) + a(1.5)} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    case "illuminance_sensor": {
      let a = "";
      for (let l = 0; l < 8; l++) {
        const d = l * Math.PI / 4;
        a += `M${Math.cos(d) * t * 1.15} ${Math.sin(d) * t * 1.15}L${Math.cos(d) * t * 1.6} ${Math.sin(d) * t * 1.6}`;
      }
      return A`<circle class="icon" r=${t * 0.7} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="rays" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
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
      let a = "";
      for (let l = 0; l < 4; l++) {
        const d = l * Math.PI / 2 + Math.PI / 4;
        a += `M0 0L${Math.cos(d) * t * 0.85} ${Math.sin(d) * t * 0.85}`;
      }
      return A`<circle class="icon" r=${t} fill=${r.fill} stroke=${r.stroke} stroke-width="1.5" vector-effect=${B}></circle>
        <path class="blades" d=${a} fill="none" stroke=${n} stroke-width="1.5" vector-effect=${B}></path>`;
    }
    default:
      return A`${v}`;
  }
}
function Kd(e, t, n, i) {
  const s = e.props;
  if (s.kind !== "equipment") return A`${v}`;
  const o = Hd(s, s.label, i, t.scale), r = s.shape === "circle" ? A`<circle class="equipment-body" r=${s.diameter / 2} fill=${t.palette.deviceFill} stroke=${n}
        stroke-width="1.5" vector-effect=${B}></circle>` : A`<rect class="equipment-body" x=${-s.width / 2} y=${-s.depth / 2} width=${s.width} height=${s.depth}
        fill=${t.palette.deviceFill} stroke=${n} stroke-width="1.5" vector-effect=${B}></rect>`;
  return A`
    <g transform=${`rotate(${i})`}>${r}</g>
    ${Fd(s.icon, t.scale, n, o.iconX, o.iconY)}
    <text class="equipment-label" x=${o.labelX} y=${o.labelY} text-anchor=${o.labelAnchor} dominant-baseline="middle"
      font-size=${Ze / t.scale}
      fill=${n} font-family="system-ui, sans-serif">${s.label}</text>
    <g class="equipment-data"></g>`;
}
function Yd(e, t, n = 0) {
  return e === "bound" ? v : A`<circle class=${`bind-ring bind-${e}`} r=${Math.max(Ui * 1.7 / t, n + 4 / t)} fill="none" style=${`stroke:${Vd[e]}`}
    stroke-width="2" stroke-dasharray=${e === "unbound" ? "4 3" : v} vector-effect=${B}></circle>`;
}
function Xd(e) {
  return e.action === "toggle" ? ["toggle", Ld] : e.action === "auto" ? ["auto", Od] : e.value === "off" ? ["set-off", Sd] : ["set-on", Ad];
}
function Qd(e, t, n, i) {
  const s = t ? Xd(t) : e.status === "error" ? ["alert", vd] : null;
  if (!s) return v;
  const [o, r] = s, a = t ? i.palette.selection : zd, l = n * 0.9, d = -n * 0.9, u = Td / i.scale;
  return A`<g class="badge" data-badge=${o}>
    <circle cx=${l} cy=${d} r=${Nd / i.scale} fill=${i.palette.background} stroke=${a} stroke-width="1.5"
      vector-effect=${B}></circle>
    <path d=${r} fill=${a} transform=${`translate(${l - u / 2} ${d - u / 2}) scale(${u / 24})`}></path>
  </g>`;
}
function Jd(e, t, n, i) {
  var y, w, g;
  const s = n.palette, o = e.invalid ? s.invalid : s.device, r = Ui / n.scale, a = Math.atan2(t.dir.y, t.dir.x) * 180 / Math.PI, l = !i && ((y = n.selection) == null ? void 0 : y.kind) === "device" && n.selection.id === e.id, d = !i && ie(e.props.kind), u = d ? (w = n.containerState) == null ? void 0 : w.call(n, e) : void 0, c = d && !u, p = `device device-${e.props.kind}${l ? " selected" : ""}${e.invalid ? " invalid" : ""}${i ? " device-preview" : ""}` + (c ? " no-data" : ""), h = i ? "0.5" : n.dim ? String(s.dimOpacity) : v, m = e.props.kind === "equipment" ? e.props.shape === "circle" ? e.props.diameter / 2 : Math.hypot(e.props.width, e.props.depth) / 2 : Math.max(r * 1.6, pi(e, r));
  return A`
    <g class=${p} data-id=${e.id} opacity=${h} transform=${`translate(${t.pt.x} ${t.pt.y})`}>
      ${l ? A`<circle class="selection-ring" r=${m + 4 / n.scale} fill="none" stroke=${s.selection}
        stroke-width="2" stroke-dasharray="4 3" vector-effect=${B}></circle>` : v}
      ${e.props.kind === "equipment" ? Kd(e, n, o, a) : A`<g transform=${`rotate(${a})`}>${Gd(
    e,
    r,
    o,
    s.deviceFill,
    c ? Dd : void 0
  )}</g>`}
      ${n.bindingStatus && !i ? Yd(n.bindingStatus(e), n.scale, pi(e, r)) : v}
      ${u ? Qd(u, ((g = n.containerFlash) == null ? void 0 : g.call(n, e)) ?? null, r, n) : v}
    </g>`;
}
function tu(e, t, n, i) {
  const s = qd(e, t);
  if (s.length === 0) return v;
  const o = n.palette, r = t.invalid ? o.invalid : gn(t.props.kind) === "motion" ? o.motionCone : o.cone, a = i ? "0.5" : n.dim ? String(o.dimOpacity) : v, l = s.map(lt).join("");
  return t.props.kind === "ceiling_light" ? A`<path class="pool" d=${l} fill="none" stroke=${r} stroke-width="1.5" stroke-dasharray="6 4"
      fill-rule="evenodd" opacity=${a} vector-effect=${B}></path>` : A`<path class="cone" d=${l} fill=${r} fill-opacity="0.18" fill-rule="evenodd" stroke=${r}
    stroke-opacity="0.5" stroke-width="1" opacity=${a} vector-effect=${B}></path>`;
}
function eu(e, t) {
  var r;
  if (((r = t.selection) == null ? void 0 : r.kind) !== "device" || t.bindingStatus) return v;
  const n = t.selection.id, i = e.devices.find((a) => a.id === n), s = i ? li(e, i, t.scale) : null;
  if (!s) return v;
  const o = t.palette.selection;
  return A`<g class="aim-handle" opacity=${t.dim ? String(t.palette.dimOpacity) : v}>
    <line x1=${s.from.x} y1=${s.from.y} x2=${s.to.x} y2=${s.to.y} stroke=${o} stroke-width="2" vector-effect=${B}></line>
    <circle class="aim-knob" cx=${s.to.x} cy=${s.to.y} r=${6 / t.scale} fill=${t.palette.deviceFill} stroke=${o}
      stroke-width="2" vector-effect=${B} style="cursor:grab"></circle>
  </g>`;
}
function nu(e, t) {
  const n = [];
  for (const i of e.devices) {
    const s = X(e, i);
    s && n.push({ d: i, pose: s, preview: !1 });
  }
  if (t.preview) {
    const i = { id: Ud, name: "", placement: t.preview.placement, props: t.preview.props, invalid: t.preview.invalid }, s = X(e, i);
    s && n.push({ d: i, pose: s, preview: !0 });
  }
  return A`
    <g class="cones">${t.showCones ? n.map((i) => tu(e, i.d, t, i.preview)) : v}</g>
    <g class="devices">${n.map((i) => Jd(i.d, i.pose, t, i.preview))}</g>
    ${eu(e, t)}`;
}
const rn = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#60a5fa", "#f97316", "#2dd4bf"], Ie = "non-scaling-stroke";
function iu(e, t, n, i) {
  const s = i.palette, o = rn[n % rn.length], r = i.selectedId === t.id, a = Ct(e, t), l = yr(a), d = 12 / i.scale, u = (c) => {
    if (t.shape.kind !== "polygon") return !1;
    const p = t.shape.vertices[c];
    return p.kind === "free" && p.lost === !0;
  };
  return A`
    <g class=${`azone${t.invalid ? " invalid" : ""}${r ? " selected" : ""}`} data-id=${t.id}>
      <path class="azone-fill" d=${lt(a)} fill=${t.invalid ? "url(#azone-hatch)" : o}
        fill-opacity=${t.invalid ? v : "0.18"} stroke=${o} stroke-width=${r ? "3" : "1.5"}
        vector-effect=${Ie}></path>
      <text class="azone-label" x=${l.x} y=${l.y} text-anchor="middle" dominant-baseline="middle" font-size=${d}
        fill=${t.invalid ? s.invalid : o} font-family="system-ui, sans-serif">${t.name}</text>
      ${r && t.shape.kind === "polygon" ? a.map((c, p) => A`
        <circle class=${`azone-vertex${u(p) ? " lost" : ""}`} data-index=${p} cx=${c.x} cy=${c.y}
          r=${5 / i.scale} fill=${s.background} stroke=${u(p) ? s.invalid : o} stroke-width="2"
          vector-effect=${Ie}></circle>`) : v}
    </g>`;
}
function su(e, t, n) {
  const i = n.palette, s = 14 / n.scale;
  return A`<g class="azone-members">${zi(e, t).map(({ device: o, participates: r }) => {
    const a = X(e, o);
    return a ? r ? A`<circle class="member-ring in" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.selection}
          stroke-width="2" vector-effect=${Ie}></circle>` : A`<circle class="member-ring out" cx=${a.pt.x} cy=${a.pt.y} r=${s} fill="none" stroke=${i.dim}
          stroke-width="1.5" stroke-dasharray="3 3" vector-effect=${Ie}></circle>` : v;
  })}</g>`;
}
function ou(e, t) {
  const n = e.cursor ? [...e.points, e.cursor] : e.points;
  return A`<polyline class=${`azone-draft${e.invalid ? " invalid" : ""}`} points=${n.map((i) => `${i.x},${i.y}`).join(" ")}
    fill="none" stroke=${e.invalid ? t.palette.invalid : t.palette.selection} stroke-width="2" stroke-dasharray="5 3"
    vector-effect=${Ie}></polyline>`;
}
function ru(e, t) {
  const n = 8 / t.scale, i = F(e);
  return A`
    <defs>
      <pattern id="azone-hatch" patternUnits="userSpaceOnUse" width=${n} height=${n} patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2=${n} stroke=${t.palette.invalid} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="azones">${i.map((s, o) => iu(e, s, o, t))}</g>
    ${t.selectedId && i.some((s) => s.id === t.selectedId) ? su(e, t.selectedId, t) : v}
    ${t.draft ? ou(t.draft, t) : v}`;
}
function Rt(e) {
  const t = Math.round(e), n = String(Math.abs(t)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return t < 0 ? `-${n}` : n;
}
function Zr(e) {
  return `${e.toFixed(2)} ${f("unit.m2")}`;
}
const au = /* @__PURE__ */ new WeakMap(), lu = /* @__PURE__ */ new WeakMap(), qr = /* @__PURE__ */ new WeakMap();
function En(e, t, n) {
  const i = tt(e.dir), s = O(e.a, S(e.dir, t)), o = O(e.a, S(e.dir, n));
  return [O(s, S(i, e.leftOff)), O(o, S(i, e.leftOff)), E(o, S(i, e.rightOff)), E(s, S(i, e.rightOff))];
}
function Pe(e, t) {
  const n = e.walls.find((i) => i.id === t);
  if (!n) return null;
  try {
    const i = nt(e, n);
    return i.len < 1e-9 ? null : i;
  } catch {
    return null;
  }
}
function cu(e, t) {
  let n = 0, i = 0, s = 0;
  for (let r = 0; r < e.length; r++) {
    const a = e[r], l = e[(r + 1) % e.length], d = a.x * l.y - l.x * a.y;
    n += d, i += (a.x + l.x) * d, s += (a.y + l.y) * d;
  }
  if (Math.abs(n) < 1e-9) return t;
  const o = { x: i / (3 * n), y: s / (3 * n) };
  return se(o, e) ? o : t;
}
const V = "non-scaling-stroke";
function du(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const a of e.walls)
    n.set(a.a, (n.get(a.a) ?? 0) + 1), n.set(a.b, (n.get(a.b) ?? 0) + 1);
  const i = 6 / t.scale, s = 5 / t.scale, o = 2 / t.scale, r = [];
  for (const a of e.walls) {
    const l = Pe(e, a.id);
    if (!l) continue;
    const d = tt(l.dir);
    for (const [u, c, p] of [[a.a, l.a, l.dir], [a.b, l.b, S(l.dir, -1)]]) {
      const h = e.nodes.find((_) => _.id === u);
      if (!h || h.host || n.get(u) !== 1) continue;
      const m = O(c, S(d, l.leftOff + i)), y = E(c, S(d, l.rightOff + i)), w = S(d, 1), g = S(O(m, y), 0.5), $ = O(E(g, S(w, -o)), S(p, s / 2)), x = E(E(g, S(w, o)), S(p, s / 2)), M = [m, $, x, y];
      r.push(A`<path class="wall-break" d=${`M${M.map((_) => `${_.x} ${_.y}`).join("L")}`} fill="none"
        stroke=${t.palette.breakLine} stroke-width="1.5" stroke-linejoin="round" vector-effect=${V}></path>`);
    }
  }
  return r.length ? A`${r}` : v;
}
function uu(e, t, n) {
  const i = t.palette, s = cu(e.outline, e.seed), o = 12 / t.scale;
  return A`
    <path class="zone${e.broken ? " broken" : ""}" d=${lt(e.outline)}
      fill=${e.broken ? "url(#hatch)" : i.zone}
      stroke=${n ? i.selection : "none"} stroke-width="2" vector-effect=${V}></path>
    ${t.mode === "zones" ? v : A`<text class="zone-label" x=${s.x} y=${s.y} text-anchor="middle" font-size=${o}
      fill=${e.broken ? i.invalid : i.zoneLabel} font-family="system-ui, sans-serif">
      <tspan x=${s.x} dy=${-0.2 * o}>${e.name}</tspan>
      <tspan x=${s.x} dy=${1.2 * o} font-size=${o * 0.9}>${Zr(Wo(e.outline))}</tspan>
    </text>`}`;
}
function pu(e, t, n) {
  const i = tt(e.dir), s = (t.swing ?? "left") === "left", o = s ? i : S(i, -1), r = s ? e.leftOff : e.rightOff, [a, l] = (t.hinge ?? "start") === "start" ? [t.offset, t.offset + t.width] : [t.offset + t.width, t.offset], d = O(O(e.a, S(e.dir, a)), S(o, r)), u = O(O(e.a, S(e.dir, l)), S(o, r)), c = O(d, S(o, t.width)), p = J(E(c, d), E(u, d)) > 0 ? 1 : 0;
  return A`
    <line x1=${d.x} y1=${d.y} x2=${c.x} y2=${c.y} stroke=${n} stroke-width="1.5" vector-effect=${V}></line>
    <path d=${`M${c.x} ${c.y}A${t.width} ${t.width} 0 0 ${p} ${u.x} ${u.y}`} fill="none" stroke=${n}
      stroke-width="1" vector-effect=${V}></path>`;
}
function hu(e, t, n) {
  const i = tt(e.dir), s = e.leftOff + e.rightOff, o = [e.leftOff - s / 3, e.leftOff - 2 * s / 3].map((r) => {
    const a = O(O(e.a, S(e.dir, t.offset)), S(i, r)), l = O(O(e.a, S(e.dir, t.offset + t.width)), S(i, r));
    return A`<line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${n} stroke-width="1.5" vector-effect=${V}></line>`;
  });
  return A`${o}`;
}
function fu(e, t, n) {
  const i = Pe(e, t.wallId);
  if (!i) return v;
  const s = n.palette, o = t.invalid ? s.invalid : t.kind === "window" ? s.window : s.door, r = En(i, t.offset, t.offset + t.width), a = t.kind === "door" || t.kind === "gate" || t.kind === "wicket";
  return A`
    <g class=${`opening ${t.kind}${t.invalid ? " invalid" : ""}`}>
      <path d=${lt(r)} fill=${t.invalid ? s.invalid : "none"} fill-opacity="0.45"></path>
      ${a ? pu(i, t, o) : t.kind === "window" ? hu(i, t, o) : v}
    </g>`;
}
function qs(e, t, n, i, s) {
  const o = s.palette.dim, r = 6 / s.scale, a = O(e, S(n, i)), l = O(t, S(n, i)), d = (c, p) => {
    const h = O(p, S(n, i + r));
    return A`<line x1=${c.x} y1=${c.y} x2=${h.x} y2=${h.y} stroke=${o} stroke-width="0.75" vector-effect=${V}></line>`;
  }, u = O(S(O(a, l), 0.5), S(n, 9 / s.scale));
  return A`
    <g class="dim">
      ${d(O(e, S(n, 2 / s.scale)), e)}${d(O(t, S(n, 2 / s.scale)), t)}
      <line x1=${a.x} y1=${a.y} x2=${l.x} y2=${l.y} stroke=${o} stroke-width="1" vector-effect=${V}></line>
      <text x=${u.x} y=${u.y} text-anchor="middle" dominant-baseline="middle" font-size=${11 / s.scale}
        fill=${o} font-family="system-ui, sans-serif">${Rt(C(e, t))}</text>
    </g>`;
}
function mu(e, t) {
  const n = t.selection;
  if (!n) return v;
  const i = t.palette, s = 4 / t.scale, o = (r) => A`<circle cx=${r.x} cy=${r.y} r=${s} fill=${i.selection}></circle>`;
  if (n.kind === "node") {
    const r = e.nodes.find((a) => a.id === n.id);
    return r ? o(r) : v;
  }
  if (n.kind === "wall") {
    const r = dt(qr, e, hn).get(n.id), a = Pe(e, n.id);
    if (!r || !a) return v;
    const l = tt(a.dir);
    return A`
      <path d=${lt(r)} fill=${i.selection} fill-opacity="0.15" stroke=${i.selection} stroke-width="1.5"
        stroke-dasharray="4 3" vector-effect=${V}></path>
      ${o(a.a)}${o(a.b)}
      ${qs(a.a, a.b, l, a.leftOff + 18 / t.scale, t)}`;
  }
  if (n.kind === "opening") {
    const r = e.openings.find((p) => p.id === n.id), a = r ? Pe(e, r.wallId) : null;
    if (!r || !a) return v;
    const l = S(tt(a.dir), -1), d = a.rightOff + 18 / t.scale, u = (p) => O(a.a, S(a.dir, p)), c = [[0, r.offset], [r.offset, r.offset + r.width], [r.offset + r.width, a.len]];
    return A`
      <path d=${lt(En(a, r.offset, r.offset + r.width))} fill="none" stroke=${i.selection}
        stroke-width="1.5" stroke-dasharray="4 3" vector-effect=${V}></path>
      ${c.filter(([p, h]) => h - p >= 1).map(([p, h]) => qs(u(p), u(h), l, d, t))}`;
  }
  return v;
}
function gu(e, t, n) {
  return C(e, t) < 1e-6 ? null : En(Ro(e, t, n.thickness, n.baseline), 0, C(e, t));
}
function wu(e, t) {
  const { preview: n, palette: i } = t, s = 1e7, o = n.orthoFrom, r = n.opening, a = r ? Pe(e, r.wallId) : null;
  return A`
    ${o ? A`<path d=${`M${o.x - s} ${o.y}H${o.x + s}M${o.x} ${o.y - s}V${o.y + s}`}
      stroke=${i.snap} stroke-width="0.75" stroke-dasharray="6 4" stroke-opacity="0.6" vector-effect=${V}></path>` : v}
    ${(n.walls ?? []).map((l) => {
    const d = gu(l.a, l.b, l.props);
    return A`<g class="preview-wall">
        ${d ? A`<path d=${lt(d)} fill=${i.selection} fill-opacity="0.35"></path>` : v}
        <line x1=${l.a.x} y1=${l.a.y} x2=${l.b.x} y2=${l.b.y} stroke=${i.selection} stroke-width="1"
          stroke-dasharray="4 3" vector-effect=${V}></line></g>`;
  })}
    ${r && a ? A`<path class=${`preview-opening${r.invalid ? " invalid" : ""}`}
      d=${lt(En(a, r.offset, r.offset + r.width))}
      fill=${r.invalid ? i.invalid : r.kind === "window" ? i.window : i.selection} fill-opacity="0.55"></path>` : v}
    ${bu(e, t)}`;
}
function yu(e, t) {
  const n = t.palette, i = 5 / t.scale;
  return A`<g class="snap-start">
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.background}
      stroke-width="4" vector-effect=${V}></rect>
    <rect x=${e.x - i} y=${e.y - i} width=${2 * i} height=${2 * i} fill="none" stroke=${n.snap}
      stroke-width="1.5" vector-effect=${V}></rect></g>`;
}
function bu(e, t) {
  const n = t.preview, i = t.palette, s = n.anchor ? yu(n.anchor, t) : v, o = n.snap;
  if (!o || o.kind === "none") return s;
  const r = (h) => h / t.scale, { x: a, y: l } = o.pt, d = { stroke: i.background, width: "3" };
  let u, c = v;
  if (o.kind === "node") {
    const h = r(5);
    u = A`<g class="snap-node"><rect x=${a - h} y=${l - h} width=${2 * h} height=${2 * h} fill=${i.snap}
      stroke=${d.stroke} stroke-width=${d.width} paint-order="stroke" vector-effect=${V}></rect></g>`;
  } else if (o.kind === "mid") {
    const h = r(11) / Math.sqrt(3), m = `M${a} ${l - h}L${a + h * 0.866} ${l + h / 2}L${a - h * 0.866} ${l + h / 2}Z`;
    u = A`<g class="snap-mid"><path d=${m} fill=${i.snap} stroke=${d.stroke} stroke-width=${d.width}
      paint-order="stroke" stroke-linejoin="round" vector-effect=${V}></path></g>`;
  } else if (o.kind === "wall") {
    const h = r(5), m = `M${a - h} ${l - h}L${a + h} ${l + h}M${a - h} ${l + h}L${a + h} ${l - h}`;
    u = A`<g class="snap-wall">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="5" stroke-linecap="round" vector-effect=${V}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="2" stroke-linecap="round" vector-effect=${V}></path></g>`;
    const y = o.endpoint.kind === "wall" ? dt(qr, e, hn).get(o.endpoint.wallId) : void 0;
    y && (c = A`<path class="snap-wall-hl" d=${lt(y)} fill="none" stroke=${i.snap} stroke-width="2.5"
        stroke-opacity="0.9" vector-effect=${V}></path>`);
  } else {
    const h = r(4), m = `M${a - h} ${l}H${a + h}M${a} ${l - h}V${l + h}`;
    u = A`<g class="snap-grid">
      <path d=${m} fill="none" stroke=${d.stroke} stroke-width="4" stroke-linecap="round" vector-effect=${V}></path>
      <path d=${m} fill="none" stroke=${i.snap} stroke-width="1.5" stroke-linecap="round" vector-effect=${V}></path></g>`;
  }
  const p = f(`snapmark.${o.kind}`);
  return A`
    ${c}${s}${u}
    <text class="snap-label" x=${a + r(9)} y=${l - r(9)} font-size=${r(11)} fill=${i.snap} stroke=${i.background}
      stroke-width="3" paint-order="stroke" vector-effect=${V} font-family="system-ui, sans-serif">${p}</text>`;
}
function vu(e, t) {
  const n = t.preview.level ?? e, i = t.palette, s = dt(au, n, (c) => Uo(c, !0)), o = n.walls.filter((c) => c.type === "railing" || c.type === "fence"), r = o.length ? dt(lu, n, Ci) : null, a = 8 / t.scale, l = t.selection, d = (t.mode ?? "plan") === "plan", u = d ? v : String(i.dimOpacity);
  return A`
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width=${a} height=${a} patternTransform="rotate(45)">
        <rect width=${a} height=${a} fill=${i.zone}></rect>
        <line x1="0" y1="0" x2="0" y2=${a} stroke=${i.hatch} stroke-width=${1.5 / t.scale}></line>
      </pattern>
    </defs>
    <g class="zones" opacity=${u}>${n.zones.map((c) => uu(c, t, (l == null ? void 0 : l.kind) === "zone" && l.id === c.id))}</g>
    <path class="walls" d=${s.map((c) => c.map(lt).join("")).join("")} fill=${i.wall} fill-rule="evenodd" opacity=${u}></path>
    ${r ? A`<g class="railings" opacity=${u}>${o.flatMap((c) => (r.get(c.id) ?? []).map((p) => A`<path d=${lt(p)} fill=${i.railing}></path>`))}</g>` : v}
    <g class="openings" opacity=${u}>${n.openings.map((c) => fu(n, c, t))}</g>
    <g class="wall-breaks" opacity=${u}>${du(n, t)}</g>
    ${t.mode === "zones" ? ru(n, {
    palette: i,
    scale: t.scale,
    selectedId: (l == null ? void 0 : l.kind) === "automationZone" ? l.id : null,
    draft: t.preview.zoneDraft
  }) : v}
    <g class="devices-layer">${nu(n, {
    palette: i,
    scale: t.scale,
    selection: l,
    showCones: t.showCones ?? !0,
    dim: d,
    preview: t.preview.device,
    bindingStatus: t.mode === "binding" ? t.bindingStatus : void 0,
    containerState: t.containerState,
    containerFlash: t.containerFlash
  })}</g>
    <g class="selection">${mu(n, t)}</g>
    <g class="preview">${wu(n, t)}</g>`;
}
const at = "non-scaling-stroke", Oe = "system-ui, sans-serif", $u = 13, be = 9, xu = 11, Gs = 18, Wn = 12, Zn = 11, qe = 10, Ks = 4.5, ku = 12, Mu = 11.5, Ys = 10.5, _u = 15, Au = {
  IN: Ed,
  OUT: Pd,
  BAT: Id,
  PV: Cd
}, Be = {
  top: { x: 0, y: 1 },
  right: { x: -1, y: 0 },
  bottom: { x: 0, y: -1 },
  left: { x: 1, y: 0 }
}, Xs = { dead: 0, nodata: 1, idle: 2, live: 3 };
function hi(e) {
  if (e == null || !Number.isFinite(e)) return "—";
  const t = Math.round(e);
  if (t === 0) return "0 W";
  const n = e < 0 ? "−" : "";
  return Math.abs(t) < 1e3 ? `${n}${Math.abs(t)} W` : `${n}${(Math.abs(e) / 1e3).toFixed(2)} kW`;
}
const qn = (e, t) => e == null || !Number.isFinite(e) ? "—" : `${Math.round(e)} ${t}`;
function Su(e) {
  return e ? e.state === "dead" ? "dead" : e.power === null ? "nodata" : Math.abs(e.power) >= 1 ? "live" : "idle" : "nodata";
}
function In(e, t) {
  return { live: t.powerLive, idle: t.powerIdle, dead: t.powerDead, nodata: t.powerNoData }[e];
}
const Eu = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Iu = A`<animate attributeName="stroke-opacity" values="0.12;0.3;0.12" dur="3s" repeatCount="indefinite"></animate>`, Pu = (e) => `M${e.map((t) => `${t.x} ${t.y}`).join("L")}`, Ce = (e, t, n, i) => A`<path d=${e} fill=${i} transform=${`translate(${t.x - n / 2} ${t.y - n / 2}) scale(${n / 24})`}></path>`;
function Ou(e, t) {
  var d;
  const n = (d = e.live) == null ? void 0 : d.power;
  if (n == null || Math.abs(n) < 1) return null;
  const i = (u) => "block" in u ? Mn : be, s = e.pts[0], o = e.pts[e.pts.length - 1], r = qe / 2 / t.scale, a = 3 / t.scale, l = e.pts.slice(1).map((u, c) => ({ p: e.pts[c], q: u, len: Math.abs(u.x - e.pts[c].x) + Math.abs(u.y - e.pts[c].y) })).sort((u, c) => c.len - u.len);
  for (const { p: u, q: c, len: p } of l) {
    if (p < 2 * r + 2 * a) continue;
    const h = { x: (u.x + c.x) / 2, y: (u.y + c.y) / 2 }, m = (w, g) => Math.hypot(h.x - w.x, h.y - w.y) >= g + r + a;
    if (!m(s, i(e.w.from)) || !m(o, i(e.w.to))) continue;
    const y = Math.atan2(c.y - u.y, c.x - u.x) * 180 / Math.PI + (n < 0 ? 180 : 0);
    return { at: h, deg: ((y + 180) % 360 + 360) % 360 - 180 };
  }
  return null;
}
function Cu(e, t, n) {
  var d;
  const i = t.palette, s = In(e.style, i), o = Pu(e.pts), r = ((d = t.selection) == null ? void 0 : d.kind) === "powerWire" && t.selection.id === e.w.id, a = { live: 2.5, idle: 1.5, dead: 1.25, nodata: 1.5 }[e.style], l = Ou(e, t);
  return A`<g data-wire=${e.w.id}>
    ${r ? A`<path class="wire-selection" d=${o} fill="none" stroke=${i.selection} stroke-width="9"
      stroke-dasharray="4 3" stroke-opacity="0.8" vector-effect=${at}></path>` : v}
    ${e.style === "live" ? A`<path class="glow" d=${o} fill="none" stroke=${s} stroke-width="8"
      stroke-opacity="0.2" stroke-linejoin="round" stroke-linecap="round" vector-effect=${at}>${n ? v : Iu}</path>` : v}
    <path class=${`wire ${e.style}`} d=${o} fill="none" stroke=${s} stroke-width=${a}
      stroke-dasharray=${e.style === "nodata" ? "5 4" : v} stroke-linejoin="round" vector-effect=${at}></path>
    ${l ? A`<path class="arrow" d=${`M${qe / 2} 0L${-qe / 2} ${-Ks}L${-qe / 2} ${Ks}Z`}
      fill=${s} transform=${`translate(${l.at.x} ${l.at.y}) rotate(${l.deg}) scale(${1 / t.scale})`}></path>` : v}
  </g>`;
}
function Lu(e, t, n) {
  const i = Au[e.name];
  return A`<g class="port" data-port=${e.name}>
    <title>${e.name}</title>
    <circle cx=${e.pt.x} cy=${e.pt.y} r=${Mn} fill=${n.portFill}
      stroke=${t ? In(t, n) : n.blockStroke} stroke-width="1.5" vector-effect=${at}></circle>
    ${i ? Ce(i, e.pt, $u, n.portIcon) : A`<text x=${e.pt.x} y=${e.pt.y} text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700"
        fill=${n.portIcon} font-family=${Oe}>${e.name}</text>`}
  </g>`;
}
function Nu(e, t, n, i) {
  var r, a, l;
  const s = () => ({ kind: "text", value: hi(n == null ? void 0 : n.power) }), o = (d) => ({ kind: "switch", state: n == null ? void 0 : n.switch, controllable: d });
  switch (e.kind) {
    case "grid":
      return e.voltage ? [s(), { kind: "text", value: qn(n == null ? void 0 : n.voltage, "V") }] : [s()];
    case "device": {
      const d = t.device(e.deviceId);
      if (!d) return [{ kind: "text", value: f("power.missing"), fill: i.blockInvalid }];
      const u = [];
      return (r = d.bindings) != null && r.power && u.push(s()), (a = d.bindings) != null && a.control && u.push(o(!0)), e.inverter && u.push({ kind: "text", label: f("power.loss"), value: hi(n == null ? void 0 : n.loss) }), u;
    }
    case "meter": {
      const d = [s()];
      return e.voltage && d.push({ kind: "text", value: qn(n == null ? void 0 : n.voltage, "V") }), (l = e.switch) != null && l.entity && d.push(o(e.switch.controllable)), d;
    }
    case "battery":
      return [{ kind: "text", label: f("power.soc"), value: qn(n == null ? void 0 : n.soc, "%") }, s()];
    case "pv":
      return [s()];
    case "transfer":
      return [{ kind: "chips" }];
    case "remainder":
      return (n == null ? void 0 : n.hint) === "disagree" ? [{ kind: "text", value: "—", note: f("power.hint.disagree"), fill: i.blockInvalid }] : [s()];
    case "bus":
      return [];
  }
}
function Tu(e, t, n) {
  const i = e.state ?? "unknown", s = e.controllable ? 0 : Wn + 3, o = t.x - s / 2, r = `${f(`power.switch.${i}`)}${e.controllable ? "" : ` · ${f("power.readOnly")}`}`;
  return A`<g class="switch" data-state=${i} opacity=${i === "unknown" ? "0.45" : v}>
    <title>${r}</title>
    ${Ce(
    i === "on" ? kd : xd,
    { x: o, y: t.y },
    Gs,
    i === "on" ? n.blockName : n.blockValue
  )}
    ${e.controllable ? v : Ce(Md, { x: o + Gs / 2 + 3 + Wn / 2, y: t.y + 1 }, Wn, n.blockValue)}
  </g>`;
}
function zu(e, t, n, i, s) {
  const o = n == null ? void 0 : n.position;
  if (o !== "A" && o !== "B") return v;
  const r = Sn(e, t, i.geo), a = r.find((w) => w.name === o), l = r.find((w) => w.name === (t.form === "2in1out" ? "OUT" : "IN"));
  if (!a || !l) return v;
  const d = ut(t, i.geo, e), u = Math.min(d.w, d.h) / 2, c = { x: a.pt.x + Be[a.side].x * u, y: a.pt.y + Be[a.side].y * u }, p = { x: l.pt.x + Be[l.side].x * u, y: l.pt.y + Be[l.side].y * u }, m = s(l.name) === "live" ? i.palette.powerLive : i.palette.blockStroke, y = `M${a.pt.x} ${a.pt.y}C${c.x} ${c.y} ${p.x} ${p.y} ${l.pt.x} ${l.pt.y}`;
  return A`<path class="ts-path" d=${y} fill="none" stroke=${m} stroke-opacity="0.4" stroke-width="4"
    stroke-linecap="round" vector-effect=${at}></path>`;
}
function Du(e, t, n, i) {
  const s = i.palette;
  return Vr(t, i.geo, e).map(({ position: o, rect: r }) => {
    const a = (n == null ? void 0 : n.position) === o;
    return A`<g class=${a ? "chip current" : "chip"} data-position=${o} style="cursor:pointer">
      <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx="3" fill=${a ? s.accent : "none"}
        stroke=${a ? s.accent : s.blockStroke} stroke-width="1" vector-effect=${at}></rect>
      <text x=${r.x + r.w / 2} y=${r.y + r.h / 2} text-anchor="middle" dominant-baseline="central" font-size="11"
        font-weight="700" fill=${a ? s.accentText : s.blockValue} font-family=${Oe}>${o}</text>
    </g>`;
  });
}
function Ru(e, t, n, i) {
  var p;
  const s = n.palette, o = ut(t, n.geo, e), r = (p = n.frame) == null ? void 0 : p.blocks[t.id], a = t.kind === "device" && !n.geo.device(t.deviceId), l = o.x + o.w / 2, d = Ri(t, n.geo) || f(`power.kind.${t.kind}`), u = Nu(t, n.geo, r, s), c = t.kind === "remainder";
  return A`<g class=${`block block-${t.kind}${a ? " missing" : ""}`} data-id=${t.id}>
    <rect class="body" x=${o.x} y=${o.y} width=${o.w} height=${o.h} rx="4" fill=${s.blockFill}
      stroke=${c ? s.powerRemainder : s.blockStroke} stroke-width=${c ? 1.5 : 1.25}
      stroke-dasharray=${c ? "6 4" : v} vector-effect=${at}></rect>
    ${t.kind === "transfer" ? zu(e, t, r, n, (h) => i(t.id, h)) : v}
    ${t.kind === "device" ? A`<g class="pin"><title>${f("power.planDevice")}</title>
      ${Ce(_d, { x: o.x + 4 + Zn / 2, y: o.y + 4 + Zn / 2 }, Zn, s.blockValue)}</g>` : v}
    <text class="name" x=${l} y=${o.y + on - 11.5} text-anchor="middle" dominant-baseline="central"
      font-size=${ku} font-weight="600" fill=${s.blockName} font-family=${Oe}>${d}</text>
    ${u.map((h, m) => {
    const y = o.y + on + m * sn + sn / 2;
    if (h.kind === "chips") return t.kind === "transfer" ? Du(e, t, r, n) : v;
    if (h.kind === "switch") return Tu(h, { x: l, y }, s);
    const w = h.fill ?? s.blockValue, g = h.label ? A`<tspan>${h.label} </tspan>` : v, $ = h.note ? A`<tspan> ${h.note}</tspan>` : v;
    return A`<text x=${l} y=${y} text-anchor="middle" dominant-baseline="central" font-size=${Mu} fill=${w}
        font-family=${Oe}>${g}<tspan font-weight="600">${h.value}</tspan>${$}</text>`;
  })}
    ${Sn(e, t, n.geo).map((h) => Lu(h, i(t.id, h.name), s))}
  </g>`;
}
function Bu(e, t, n, i) {
  const s = i.palette, o = e.w >= e.h, r = o ? e.x : e.y, a = r + (o ? e.w : e.h), l = o ? e.h : e.w;
  let d = v;
  const u = e.name ?? "", c = u.length * Ys * 0.58 + 12;
  if (u) {
    const p = t.map((y) => o ? y.x : y.y).sort((y, w) => y - w);
    let h = { lo: 0, hi: -1 }, m = r;
    for (const y of [...p, a + be]) {
      const w = Math.min(y - be, a);
      w - m > h.hi - h.lo && (h = { lo: m, hi: w }), m = Math.max(m, y + be);
    }
    if (h.hi - h.lo >= c) {
      const y = (h.lo + h.hi) / 2, w = l >= _u, g = o ? { x: y, y: w ? e.y + e.h / 2 : e.y - 7 } : { x: w ? e.x + e.w / 2 : e.x - 7, y };
      d = A`<text class="bus-name" x=${g.x} y=${g.y} text-anchor="middle" dominant-baseline="central"
        font-size=${Ys} fill=${s.blockValue} font-family=${Oe}
        transform=${o ? v : `rotate(-90 ${g.x} ${g.y})`}>${u}</text>`;
    }
  }
  return A`<g class="block block-bus" data-id=${e.id}>
    <rect class="body" x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx="2" fill=${s.blockFill}
      stroke=${n ? In(n, s) : s.blockStroke} stroke-width="1.5" vector-effect=${at}></rect>
    ${d}
  </g>`;
}
function Hu(e, t, n) {
  return A`<g class="terminal">
    <circle cx=${e.x} cy=${e.y} r=${be} fill=${n.portFill} stroke=${In(t, n)} stroke-width="1.5"
      vector-effect=${at}></circle>
    ${Ce($d, e, xu, n.portIcon)}
  </g>`;
}
function Fu(e, t) {
  const n = t.selection;
  if ((n == null ? void 0 : n.kind) !== "powerBlock") return v;
  const i = e.blocks.find((r) => r.id === n.id);
  if (!i) return v;
  const s = ut(i, t.geo, e), o = 4 / t.scale;
  return A`<rect class="selection" x=${s.x - o} y=${s.y - o} width=${s.w + 2 * o} height=${s.h + 2 * o} rx="6"
    fill="none" stroke=${t.palette.selection} stroke-width="2" stroke-dasharray="4 3" vector-effect=${at}></rect>`;
}
function Uu(e, t) {
  var p;
  const n = t.preview.power ?? e, i = t.palette, s = [];
  for (const h of n.wires) {
    const m = Fr(n, h, t.geo);
    if (!m) continue;
    const y = (p = t.frame) == null ? void 0 : p.wires[h.id];
    s.push({ w: h, a: m.a, b: m.b, pts: Ur(m.a, m.b), live: y, style: Su(y) });
  }
  const o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = [];
  for (const h of s)
    for (const [m, y] of [[h.w.from, h.a], [h.w.to, h.b]]) {
      if ("block" in m) {
        o.set(`${m.block}:${m.port}`, h.style);
        continue;
      }
      const w = r.get(m.bus);
      (w === void 0 || Xs[h.style] > Xs[w]) && r.set(m.bus, h.style), a.set(m.bus, [...a.get(m.bus) ?? [], y.pt]), l.push({ at: y.pt, style: h.style });
    }
  const d = (h, m) => o.get(`${h}:${m}`), u = Eu(), c = t.preview.wireDraft;
  return A`<g class="power">
    <g class="buses">${n.blocks.map((h) => h.kind === "bus" ? Bu(h, a.get(h.id) ?? [], r.get(h.id), t) : v)}</g>
    <g class="wires">${s.map((h) => Cu(h, t, u))}</g>
    ${Fu(n, t)}
    <g class="blocks">${n.blocks.map((h) => h.kind === "bus" ? v : Ru(n, h, t, d))}</g>
    <g class="terminals">${l.map((h) => Hu(h.at, h.style, i))}</g>
    ${c ? A`<line class="wire-draft" x1=${c.from.x} y1=${c.from.y} x2=${c.to.x} y2=${c.to.y}
      stroke=${c.ok ? i.selection : i.invalid} stroke-width="2" stroke-dasharray="6 4" vector-effect=${at}></line>` : v}
  </g>`;
}
const Vu = {
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
}, ju = {
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
function Wu(e) {
  return e ? Vu : ju;
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xt = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Vi = (e) => (...t) => ({ _$litDirective$: e, values: t });
class ji {
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
const Gr = (e) => e.strings === void 0, Zu = {}, Kr = (e, t = Zu) => e._$AH = t;
class qu extends ji {
  constructor(t) {
    if (super(t), t.type !== xt.PROPERTY) throw new Error("fieldValue() can only be used in a property binding");
  }
  render(t) {
    return t;
  }
  update(t, [n]) {
    const i = t.element;
    return i.getRootNode().activeElement === i || i[t.name] === n ? ot : (Kr(t), n);
  }
}
const W = Vi(qu), fi = 1, Qs = 1e-6;
function Gu(e, t, n, i, s) {
  const o = (l) => l > Qs && l < s - Qs, r = new Set(e.nodes.filter((l) => {
    var d;
    return ((d = l.host) == null ? void 0 : d.wallId) === t.id;
  }).map((l) => l.id)), a = [];
  for (const l of r) {
    const d = pn(e, l).host.offset;
    o(d) && a.push({ t: d, nodeId: l });
  }
  for (const l of e.walls) {
    if (l.id === t.id || [l.a, l.b].some((y) => y === t.a || y === t.b || r.has(y))) continue;
    const d = j(e, l.a), u = j(e, l.b), c = C(d, u), p = c === 0 ? null : gt(n, i, d, E(u, d));
    if (!p) continue;
    const h = Pi(p, d, u) * c;
    if (h < -fi || h > c + fi) continue;
    const m = H(E(p, n), i);
    o(m) && a.push({ t: m, wall: l, pt: p });
  }
  return a;
}
function Js(e, t) {
  let n;
  for (const i of e) {
    const s = Math.abs(i.t - t), o = n ? Math.abs(n.t - t) : 1 / 0;
    (s < o || s === o && "nodeId" in i) && (n = i);
  }
  return n;
}
function to(e, t) {
  if ("nodeId" in t)
    return delete pn(e, t.nodeId).host, t.nodeId;
  for (const o of [t.wall.a, t.wall.b]) if (C(j(e, o), t.pt) <= fi) return o;
  const { pt: n, offset: i } = vn(e, t.wall, t.pt), s = { id: q(), x: n.x, y: n.y, host: { wallId: t.wall.id, offset: i } };
  return e.nodes.push(s), s.id;
}
function Ku(e, t, n) {
  const i = e.walls.find((g) => g.id === t);
  if (!i) return e;
  const s = j(e, i.a), o = j(e, i.b), r = C(s, o), a = un(E(o, s)), l = H(E(n, s), a), d = Gu(e, i, s, a, r), u = Js(d.filter((g) => g.t < l), l), c = Js(d.filter((g) => g.t > l), l);
  if (!u && !c) return Di(e, t);
  const p = pt(e), h = p.walls.find((g) => g.id === t);
  let m = t, y = 0;
  if (c) {
    const g = to(p, c);
    if (y = H(E(j(p, g), s), a), u) {
      const $ = { ...h, id: q(), a: g };
      p.walls.push($), m = $.id;
    } else
      h.a = g;
  }
  u && (h.b = to(p, u));
  const w = (g, $) => g.wallId !== t || u && $ <= u.t ? !0 : !c || $ < c.t ? !1 : (g.wallId = m, g.offset -= y, !0);
  p.openings = p.openings.filter((g) => w(g, g.offset + g.width / 2)), p.devices = p.devices.filter((g) => g.placement.mode !== "wall" || w(g.placement, g.placement.offset));
  for (const g of p.nodes) g.host && !w(g.host, g.host.offset) && delete g.host;
  for (const g of F(p)) {
    const $ = g.shape;
    $.kind === "polygon" && ($.vertices = $.vertices.map((x) => x.kind !== "wall" || w(x, x.offset) ? x : br(x)));
  }
  return $n(p), $t(p, e);
}
function Wi(e, t) {
  return Math.abs(t.x - e.x) >= Math.abs(t.y - e.y) ? { x: t.x, y: e.y } : { x: e.x, y: t.y };
}
function Yu(e, t, n) {
  return O(e, S(un(E(t, e)), n));
}
function eo(e, t) {
  return { pt: e, kind: t, endpoint: { kind: "free", pt: e } };
}
function Ut(e, t, n) {
  const { tolMm: i, grid: s, ortho: o } = n, r = o ? n.from : void 0, a = new Set(n.excludeNodeIds ?? []), l = r ? Wi(r, t) : t, d = r !== void 0 && l.y === r.y, u = (g) => !r || Math.abs(d ? g.y - r.y : g.x - r.x) <= 1;
  let c = null;
  for (const g of e.nodes) {
    if (a.has(g.id)) continue;
    const $ = { x: g.x, y: g.y }, x = C($, l);
    x <= i && u($) && (!c || x < c.d) && (c = { id: g.id, pt: $, d: x });
  }
  if (c) return { pt: c.pt, kind: "node", endpoint: { kind: "node", nodeId: c.id } };
  const p = e.walls.filter((g) => !a.has(g.a) && !a.has(g.b)).map((g) => ({ w: g, f: nt(e, g) })).filter((g) => g.f.len > 1e-9);
  let h = null;
  for (const { w: g, f: $ } of p) {
    const x = { x: ($.a.x + $.b.x) / 2, y: ($.a.y + $.b.y) / 2 }, M = C(x, l);
    M <= i && u(x) && (!h || M < h.d) && (h = { wallId: g.id, pt: x, offset: $.len / 2, d: M });
  }
  if (h)
    return { pt: h.pt, kind: "mid", endpoint: { kind: "wall", wallId: h.wallId, offset: h.offset } };
  const m = (g) => {
    let $ = null;
    for (const { w: x, f: M } of p) {
      const _ = tt(M.dir), P = g ? [M.leftOff, -M.rightOff].filter((L) => L !== 0) : [0];
      for (const L of P) {
        const N = O(M.a, S(_, L)), R = r ? gt(r, E(l, r), N, M.dir) : O(N, S(M.dir, H(E(l, N), M.dir)));
        if (!R) continue;
        const U = H(E(R, N), M.dir);
        if (U < 0 || U > M.len) continue;
        const Z = C(R, l);
        Z <= i && (!$ || Z < $.d) && ($ = { d: Z, res: { pt: R, kind: "wall", endpoint: { kind: "wall", wallId: x.id, offset: U } } });
      }
    }
    return $ ? $.res : null;
  }, y = m(!1);
  if (y) return y;
  const w = m(!0);
  if (w) return w;
  if (s && s > 0) {
    const g = (x) => Math.round(x / s) * s, $ = r ? d ? { x: g(l.x), y: r.y } : { x: r.x, y: g(l.y) } : { x: g(l.x), y: g(l.y) };
    return eo($, "grid");
  }
  return eo(l, "none");
}
function Xu(e, t, n) {
  return t.some((i, s) => Ft(e, i, t[(s + 1) % t.length]) <= n);
}
function Zi(e, t, n) {
  const i = hn(e);
  for (const [s, o] of i) if (se(t, o)) return s;
  for (const [s, o] of i) if (Xu(t, o, n)) return s;
  return null;
}
function Qu(e, t) {
  for (const n of e.openings) {
    const i = e.walls.find((a) => a.id === n.wallId);
    if (!i) continue;
    const s = nt(e, i);
    if (s.len < 1e-9) continue;
    const { t: o, side: r } = jt(s, t);
    if (o >= n.offset && o <= n.offset + n.width && r >= -s.rightOff && r <= s.leftOff) return n.id;
  }
  return null;
}
function Ju(e, t, n, i) {
  const s = Qu(e, t);
  if (s) return { kind: "opening", id: s };
  if ((i == null ? void 0 : i.kind) === "wall") {
    const r = e.walls.find((a) => a.id === i.id);
    if (r)
      for (const a of [r.a, r.b]) {
        const l = e.nodes.find((d) => d.id === a);
        if (l && C(t, l) <= n) return { kind: "node", id: a };
      }
  }
  const o = Zi(e, t, n);
  if (o) return { kind: "wall", id: o };
  for (const r of e.zones)
    if (r.outline.length >= 3 && se(t, r.outline)) return { kind: "zone", id: r.id };
  return null;
}
function tp(e) {
  let t = null, n = null, i = null, s = null, o = !1, r = { x: 0, y: 0 }, a = null;
  const l = (h) => {
    t = h, e.select(h);
  }, d = () => {
    n = null, i = null, s = null, a = null, o = !1;
  }, u = (h) => h.kind === "none" ? { x: Math.round(h.pt.x), y: Math.round(h.pt.y) } : h.pt, c = (h, m, y) => jt(nt(h, h.walls.find((w) => w.id === m)), y).t;
  function p(h) {
    const m = n;
    if (!(!m || !i) && !(h.pt.x === r.x && h.pt.y === r.y))
      if (o = !0, m.kind === "node") {
        const y = Ut(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [m.nodeId]
        }), w = y.endpoint, g = (y.kind === "wall" || y.kind === "mid") && w.kind === "wall", $ = y.kind === "node" && w.kind === "node" && w.nodeId !== m.nodeId, x = i.nodes.find((L) => L.id === m.nodeId), M = !!x.host && g && w.kind === "wall" && w.wallId === x.host.wallId;
        let _ = i;
        if (x.host && !M) {
          const L = structuredClone(i);
          delete L.nodes.find((N) => N.id === m.nodeId).host, _ = L;
        }
        let P = Ec(_, m.nodeId, u(y));
        if ($ && w.kind === "node")
          P = Cc(P, m.nodeId, w.nodeId);
        else if (g && w.kind === "wall" && !M) {
          const L = i.walls.find((N) => N.id === w.wallId);
          if (L && L.a !== m.nodeId && L.b !== m.nodeId) {
            const N = structuredClone(P);
            N.nodes.find((R) => R.id === m.nodeId).host = { wallId: w.wallId, offset: w.offset }, P = $t(N, P);
          }
        }
        s = P;
      } else if (m.kind === "wall") {
        const y = i.walls.find(($) => $.id === m.wallId), w = Ut(i, h.pt, {
          tolMm: e.tolMm(),
          grid: e.grid(),
          from: m.origin,
          ortho: h.shift,
          excludeNodeIds: [y.a, y.b]
        }), g = E(w.pt, m.origin);
        s = Pc(
          i,
          m.wallId,
          w.kind === "none" ? { x: Math.round(g.x), y: Math.round(g.y) } : g
        );
      } else {
        const y = i.openings.find((w) => w.id === m.openingId);
        s = Jo(i, y.id, c(i, y.wallId, h.pt) - m.grab);
      }
  }
  return {
    id: "select",
    down(h) {
      d(), r = h.pt;
      const m = e.level(), y = h.ctrl ? Zi(m, h.pt, e.tolMm()) : null;
      if (y) {
        l(null), e.commit(Ku(m, y, h.pt));
        return;
      }
      const w = t, g = Ju(m, h.pt, e.tolMm(), w);
      if (l(g), !!g) {
        if (a = i = s = m, g.kind === "node") {
          let $ = g.id;
          const x = (w == null ? void 0 : w.kind) === "wall" ? m.walls.find((M) => M.id === w.id) : void 0;
          if (h.alt && x) {
            const M = Oc(m, x.id, x.a === g.id ? "a" : "b");
            i = s = M.level, $ = M.nodeId, l({ kind: "node", id: $ });
          }
          n = { kind: "node", nodeId: $, origin: j(i, $) };
        } else if (g.kind === "wall")
          n = { kind: "wall", wallId: g.id, origin: h.pt };
        else if (g.kind === "opening") {
          const $ = m.openings.find((x) => x.id === g.id);
          n = { kind: "opening", openingId: $.id, grab: c(m, $.wallId, h.pt) - $.offset };
        }
      }
    },
    move(h) {
      p(h);
    },
    up(h) {
      n && p(h);
      const m = o, y = s, w = a;
      d(), m && y && w && y !== w && e.commit(y);
    },
    key(h) {
      return h === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      return !n || !s ? {} : { level: s, orthoFrom: n.kind === "node" ? n.origin : void 0 };
    },
    cancel() {
      d(), l(null);
    }
  };
}
function Le(e, { min: t = 0, max: n = Number.MAX_SAFE_INTEGER, signed: i = !1 } = {}) {
  const s = e.replace(/\s/g, "").replace("−", "-");
  if (!(i ? /^-?\d+$/ : /^\d+$/).test(s)) return null;
  const o = Number(s);
  return Number.isSafeInteger(o) && o >= t && o <= n ? o : null;
}
function Yr() {
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
function ep(e) {
  let t = null, n = { x: 0, y: 0 };
  const i = Yr(), s = () => {
    t = null, i.clear();
  }, o = (d) => Ut(e.level(), d, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 });
  function r() {
    if (!t) return null;
    if (i.typing()) {
      const d = Le(i.first, { min: 1 }), u = Le(i.second, { min: 1 });
      return d === null || u === null ? null : { x: t.x + (n.x >= t.x ? d : -d), y: t.y + (n.y >= t.y ? u : -u) };
    }
    return o(n).pt;
  }
  const a = (d, u) => Math.abs(d.x - u.x) < 1 || Math.abs(d.y - u.y) < 1;
  function l(d) {
    if (!t || a(t, d)) return;
    const u = Sc(e.level(), t, d, e.wallProps(), e.boxMeasure());
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
      u && l(u);
    },
    move(d) {
      n = d.pt;
    },
    up() {
    },
    key(d) {
      return t ? i.key(d, () => {
        const u = r();
        u && l(u);
      }, s) : !1;
    },
    preview() {
      if (!t) return { snap: o(n) };
      const d = r(), u = {
        tracker: i.tracker(n),
        anchor: t,
        snap: i.typing() ? void 0 : o(n)
      };
      if (!d || a(t, d)) return u;
      const c = e.wallProps(), p = Er(t, d, c.thickness, e.boxMeasure());
      return p && (u.walls = p.map((h, m) => ({ a: h, b: p[(m + 1) % 4], props: { ...c, baseline: "center" } }))), u;
    },
    cancel() {
      s();
    }
  };
}
const no = (e) => Math.round(e * 1e3) / 1e3 + 0;
function np(e) {
  let t = null, n = null, i = null, s = { x: 0, y: 0 }, o = !1, r = null;
  const a = Yr(), l = () => {
    t = null, n = null, i = null, r = null, a.clear();
  }, d = (p, h) => Ut(e.level(), p, { tolMm: e.tolMm(), grid: e.grid(), from: n ?? void 0, ortho: h && n !== null });
  function u() {
    if (!n) return null;
    const p = d(s, o), h = Le(a.first, { min: 1 }), m = Le(a.second);
    if (h === null && m === null) return { pt: p.pt, endpoint: p.endpoint, snap: p };
    const y = h ?? C(n, p.pt);
    let w = p.pt;
    if (m === null && C(n, p.pt) < 1) {
      const M = r ?? { x: 1, y: 0 };
      w = { x: n.x + M.x, y: n.y + M.y };
    }
    if (m !== null) {
      const M = m * Math.PI / 180;
      w = { x: n.x + Math.cos(M), y: n.y - Math.sin(M) };
    }
    const g = Yu(n, w, y), $ = { x: no(g.x), y: no(g.y) }, x = e.level().nodes.find((M) => Math.hypot(M.x - $.x, M.y - $.y) < 1);
    return x ? { pt: { x: x.x, y: x.y }, endpoint: { kind: "node", nodeId: x.id }, snap: p } : { pt: $, endpoint: { kind: "free", pt: $ }, snap: p };
  }
  function c() {
    const p = u();
    if (!t || !p) return;
    const h = Ac(e.level(), t, p.endpoint, e.wallProps());
    if (h.wallId === null || h.endNodeId === null) return;
    e.commit(h.level);
    const m = h.level.walls.find((x) => x.id === h.wallId);
    i === null && (i = m.a);
    const y = h.endNodeId === i, w = n, g = j(h.level, h.endNodeId), $ = C(w, g);
    if ($ > 0 && (r = { x: (g.x - w.x) / $, y: (g.y - w.y) / $ }), a.clear(), y) {
      l();
      return;
    }
    t = { kind: "node", nodeId: h.endNodeId }, n = j(h.level, h.endNodeId);
  }
  return {
    id: "wall",
    down(p) {
      if (s = p.pt, o = p.shift, !t) {
        const h = d(p.pt, !1);
        t = h.endpoint, n = h.pt;
        return;
      }
      c();
    },
    move(p) {
      s = p.pt, o = p.shift;
    },
    up() {
    },
    key(p, h) {
      return o = h.shift, t ? a.key(p, c, l) : !1;
    },
    preview() {
      if (!n) return { snap: Ut(e.level(), s, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }) };
      const p = u();
      return {
        walls: [{ a: n, b: p.pt, props: e.wallProps() }],
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
function ip(e, t) {
  let n = null;
  const i = () => e.openingDefaults(t);
  function s() {
    if (!n) return null;
    const o = e.level(), r = Zi(o, n, e.tolMm());
    if (!r) return null;
    const a = nt(o, o.walls.find((d) => d.id === r)), l = jt(a, n).t;
    return { wallId: r, center: l, pt: O(a.a, S(a.dir, l)) };
  }
  return {
    id: t,
    down(o) {
      n = o.pt;
      const r = s();
      if (!r) return;
      const a = i(), l = Fl(e.level(), r.wallId, t, r.center, a.width, a);
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
        opening: { wallId: o.wallId, offset: a, width: r, kind: t, invalid: !fn(e.level(), o.wallId, a, r) },
        snap: { pt: o.pt, kind: "wall", endpoint: { kind: "wall", wallId: o.wallId, offset: o.center } }
      };
    },
    cancel() {
      n = null;
    }
  };
}
function sp(e) {
  return {
    id: "zone",
    down(t) {
      var s;
      const n = e.level(), i = Bl(n, t.pt, e.zoneName());
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
const Pn = 3, io = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
};
function Xr(e) {
  let t = null;
  const n = (s, o, r) => {
    const a = s.devices.find((u) => u.id === o), l = a ? X(s, a) : null, d = a ? li(s, a, e.scale()) : null;
    return !l || !d ? 0 : cr(It(E(r, l.pt)) - It(E(d.to, l.pt)));
  };
  function i(s) {
    if (!t || !t.moved && C(s.pt, t.downPt) <= Pn / e.scale()) return;
    t.moved = !0;
    const o = t.original.devices.find((c) => c.id === t.id), r = o ? X(t.original, o) : null;
    if (!o || !r) return;
    const a = C(s.pt, r.pt), l = (It(E(s.pt, r.pt)) - t.offset) * Math.PI / 180, d = a === 0 ? s.pt : { x: r.pt.x + Math.cos(l) * a, y: r.pt.y - Math.sin(l) * a }, u = lc(t.original, o, d, s.shift);
    t.work = JSON.stringify(u) === JSON.stringify(o.placement) ? t.original : Li(t.original, o.id, u);
  }
  return {
    start(s, o) {
      if (t = null, !s) return !1;
      const r = e.level(), a = r.devices.find((d) => d.id === s), l = a ? li(r, a, e.scale()) : null;
      return !a || !l || C(o.pt, l.to) > e.tolMm() ? !1 : (t = { id: s, original: r, work: r, downPt: o.pt, offset: n(r, s, o.pt), moved: !1 }, !0);
    },
    move: i,
    end(s) {
      if (!t) return !1;
      i(s);
      const o = t;
      return t = null, o.moved && o.work !== o.original && io(o.work, o.id) !== io(o.original, o.id) && e.commit(o.work), !0;
    },
    cancel() {
      const s = t !== null;
      return t = null, s;
    },
    active: () => t !== null,
    working: () => t ? t.work : null
  };
}
function so(e, t, n) {
  const i = nt(e, e.walls.find((s) => s.id === t));
  return jt(i, n).side > 0 ? "left" : "right";
}
function Qr(e, t) {
  const n = e.grid();
  return n && n > 0 ? { x: Math.round(t.x / n) * n, y: Math.round(t.y / n) * n } : { x: Math.round(t.x), y: Math.round(t.y) };
}
function Jr(e, t, n, i, s = 0) {
  const o = Ii[n];
  if (o.includes("wall")) {
    const r = Ut(t, i, { tolMm: e.tolMm(), grid: e.grid(), ortho: !1 }), a = r.endpoint;
    if ((r.kind === "wall" || r.kind === "mid") && a.kind === "wall")
      return { mode: "wall", wallId: a.wallId, side: so(t, a.wallId, i), offset: a.offset };
    if (r.kind === "node" && a.kind === "node") {
      let l = null;
      for (const d of t.walls) {
        if (d.a !== a.nodeId && d.b !== a.nodeId) continue;
        const u = nt(t, d), c = Math.max(0, Math.min(u.len, jt(u, i).t)), p = Math.hypot(i.x - (u.a.x + u.dir.x * c), i.y - (u.a.y + u.dir.y * c));
        (!l || p < l.d) && (l = { id: d.id, offset: d.a === a.nodeId ? 0 : u.len, d: p });
      }
      if (l) return { mode: "wall", wallId: l.id, side: so(t, l.id, i), offset: l.offset };
    }
  }
  return o.includes("free") ? { mode: "free", ...Qr(e, i), rotation: s } : null;
}
function op(e, t, n) {
  return ir(e.deviceDefaults(t), "free", n.mode);
}
function rp(e, t) {
  let n = null, i;
  const s = Xr(e);
  function o() {
    if (!n) return null;
    const r = e.level(), a = Jr(e, r, t, n);
    if (!a)
      return { placement: { mode: "free", ...Qr(e, n), rotation: 0 }, props: e.deviceDefaults(t), invalid: !0 };
    const l = op(e, t, a), d = _s(r, l, a, "").deviceId !== null;
    return { placement: a, props: l, invalid: !d };
  }
  return {
    id: t,
    down(r) {
      if (n = r.pt, s.start(i, r)) return;
      const a = o();
      if (!a || a.invalid) return;
      const l = e.level(), d = Mi(f(`device.${t}`), l.devices.filter((c) => c.props.kind === t).map((c) => c.name)), u = _s(l, a.props, a.placement, d);
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
      const a = o();
      return a ? { device: a } : {};
    },
    cancel() {
      s.cancel(), n = null, i = void 0;
    }
  };
}
const oo = (e, t) => {
  var n;
  return JSON.stringify((n = e.devices.find((i) => i.id === t)) == null ? void 0 : n.placement);
}, ap = (e, t, n) => n === void 0 || oo(e, n) !== oo(t, n);
function lp(e) {
  let t = null, n = null;
  const i = Xr(e);
  let s = null, o = null, r = !1, a = { x: 0, y: 0 };
  const l = (p) => {
    t = p, e.select(p);
  }, d = () => {
    n = null, s = null, o = null, r = !1;
  };
  function u(p) {
    if (!n || !s || !r && C(p.pt, a) <= Pn / e.scale()) return;
    if (r = !0, p.pt.x === a.x && p.pt.y === a.y) {
      o = s;
      return;
    }
    const h = s.devices.find((_) => _.id === n.id);
    if (!h) return;
    const m = p.shift ? Wi(a, p.pt) : p.pt, y = h.placement, w = y.mode === "free", g = w ? null : X(s, h), $ = y.mode === "free" ? y.rotation : g ? lr(Math.round(It(g.dir))) : 0, x = Jr(e, s, h.props.kind, w ? O(m, n.grab) : m, $), M = x && x.mode === "wall" && y.mode === "wall" && y.aim !== void 0 ? { ...x, aim: y.aim } : x;
    o = M ? Li(s, h.id, c(s, h.placement, M, m)) : s;
  }
  function c(p, h, m, y) {
    if (h.mode !== "wall" || m.mode !== "wall" || m.wallId !== h.wallId) return m;
    const w = p.walls.find((P) => P.id === h.wallId);
    if (!w) return m;
    const g = nt(p, w), $ = Math.max(0, Math.min(g.len, h.offset + H(E(y, a), g.dir))), x = jt(g, y).side, M = e.tolMm(), _ = h.side === "left" ? x < -(g.rightOff + M) ? "right" : "left" : x > g.leftOff + M ? "left" : "right";
    return { ...m, offset: $, side: _ };
  }
  return {
    id: "device-select",
    down(p) {
      d(), a = p.pt;
      const h = e.level(), m = e.tolMm();
      if (i.start((t == null ? void 0 : t.kind) === "device" ? t.id : void 0, p)) return;
      const y = hr(h, p.pt, m);
      if (!y) {
        l(null);
        return;
      }
      l({ kind: "device", id: y });
      const w = h.devices.find(($) => $.id === y), g = X(h, w);
      s = o = h, n = { id: y, grab: g && w.placement.mode === "free" ? E(g.pt, p.pt) : { x: 0, y: 0 } };
    },
    move(p) {
      i.active() ? i.move(p) : u(p);
    },
    up(p) {
      if (i.end(p)) return;
      n && u(p);
      const h = o, m = s, y = r, w = n == null ? void 0 : n.id;
      d(), y && h && m && h !== m && ap(m, h, w) && e.commit(h);
    },
    key(p) {
      return p === "Escape" && i.cancel() ? !0 : p === "Escape" && n ? (d(), !0) : !1;
    },
    preview() {
      const p = i.working();
      return p ? { level: p } : n && o ? { level: o } : {};
    },
    cancel() {
      i.cancel(), d(), l(null);
    }
  };
}
function cp(e) {
  return {
    id: "binding-select",
    down(t) {
      const n = hr(e.level(), t.pt, e.tolMm());
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
function dp(e, t) {
  let n = null;
  for (const i of e.zones) {
    if (i.outline.length < 3 || !wn(i.outline, t)) continue;
    const s = Math.abs(bt(i.outline));
    (!n || s < n.area || s === n.area && i.id < n.room.id) && (n = { room: i, area: s });
  }
  return n ? n.room : null;
}
function up(e) {
  return {
    id: "zone-room",
    down(t) {
      const n = e.level(), i = dp(n, t.pt);
      if (!i) return;
      const s = vc(n, i.id, i.name);
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
function ta(e, t, n, i) {
  if (n.alt) {
    const r = n.shift && i ? Wi(i, n.pt) : n.pt;
    return { vertex: { kind: "free", x: r.x, y: r.y }, snap: null };
  }
  const s = Ut(t, n.pt, { tolMm: e.tolMm(), grid: e.grid(), from: i, ortho: n.shift }), o = s.endpoint;
  if (s.kind === "node" && o.kind === "node")
    return { vertex: { kind: "node", nodeId: o.nodeId, x: s.pt.x, y: s.pt.y }, snap: s };
  if ((s.kind === "mid" || s.kind === "wall") && o.kind === "wall") {
    const r = t.walls.find((a) => a.id === o.wallId);
    if (r) {
      const a = jt(nt(t, r), n.pt).side >= 0 ? "left" : "right", l = ur(t, r.id, a, o.offset) ?? s.pt;
      return { vertex: { kind: "wall", wallId: r.id, offset: o.offset, side: a, x: l.x, y: l.y }, snap: { ...s, pt: l } };
    }
  }
  return { vertex: { kind: "free", x: s.pt.x, y: s.pt.y }, snap: s };
}
function pp(e, t, n) {
  const i = [];
  for (const s of F(e)) {
    const o = Ct(e, s);
    (o.some((a, l) => Ft(t, a, o[(l + 1) % o.length]) <= n) || wn(o, t)) && i.push({ id: s.id, area: Math.abs(bt(o)) });
  }
  return i.sort((s, o) => s.area - o.area || (s.id < o.id ? -1 : s.id > o.id ? 1 : 0)), i.map((s) => s.id);
}
function hp(e, t, n, i) {
  const s = F(e).find((a) => a.id === t);
  if (!s || s.shape.kind !== "polygon") return null;
  const o = Ct(e, s);
  let r = -1;
  return o.forEach((a, l) => {
    C(n, a) <= i && (r < 0 || C(n, a) < C(n, o[r])) && (r = l);
  }), r < 0 ? null : { index: r, from: o[(r + o.length - 1) % o.length] };
}
function fp(e) {
  let t = null, n = null, i = null, s = null, o = null, r = !1, a = !1, l = { x: 0, y: 0 };
  const d = () => {
    const m = e.selection();
    return (m == null ? void 0 : m.kind) === "automationZone" ? m.id : null;
  }, u = (m) => {
    e.select(m === null ? null : { kind: "automationZone", id: m });
  }, c = () => {
    n = null, i = null, s = null, o = null, r = !1, a = !1;
  };
  function p(m) {
    if (!n || !i || !a && C(m.pt, l) <= Pn / e.scale()) return;
    a = !0;
    const y = ta(e, i, m, n.from);
    o = y.snap, r = m.shift, s = kc(i, n.zoneId, n.index, y.vertex);
  }
  function h(m, y) {
    const w = pp(m, y, e.tolMm());
    if (w.length === 0) {
      t = null, u(null);
      return;
    }
    const g = d(), $ = g !== null && t !== null && C(y, t) <= e.tolMm() ? w.indexOf(g) : -1;
    t = y, u(w[($ + 1) % w.length]);
  }
  return {
    id: "zones-select",
    down(m) {
      c(), l = m.pt;
      const y = e.level(), w = d(), g = w === null ? null : hp(y, w, m.pt, e.tolMm());
      if (w !== null && g) {
        n = { zoneId: w, ...g }, i = s = y;
        return;
      }
      h(y, m.pt);
    },
    move(m) {
      p(m);
    },
    up(m) {
      n && p(m);
      const y = s, w = i, g = a;
      c(), g && y && w && y !== w && e.commit(y);
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
const ro = 3, mp = 1, ct = (e) => ({ x: e.x, y: e.y });
function gp(e) {
  let t = [], n = null, i = !1, s = null, o = !1;
  const r = () => t.length ? ct(t[t.length - 1]) : void 0;
  function a(c) {
    const p = t.length;
    if (p === 0) return !1;
    const h = t.map(ct);
    if (C(h[p - 1], c) <= mp) return !0;
    if (p >= 2) {
      const m = E(h[p - 1], h[p - 2]), y = E(c, h[p - 1]);
      if (Math.abs(J(m, y)) <= 1e-9 * Math.hypot(m.x, m.y) * Math.hypot(y.x, y.y) && H(m, y) < 0) return !0;
    }
    for (let m = 0; m + 2 < p; m++) if (mr(h[p - 1], c, h[m], h[m + 1])) return !0;
    return !1;
  }
  function l(c) {
    if (t.length < ro) return null;
    const p = e.tolMm(), h = ct(t[0]), m = ct(t[t.length - 1]);
    return C(c, h) <= p ? h : C(c, m) <= p ? m : null;
  }
  function d() {
    if (t.length < ro || nn(t.map(ct))) return !1;
    const c = e.level(), p = Mi(f("zones.default"), F(c).map((m) => m.name)), h = $c(c, t, p);
    return h.zoneId === null ? !1 : (t = [], n = null, i = !1, e.commit(h.level), e.select({ kind: "automationZone", id: h.zoneId }), !0);
  }
  const u = (c) => ta(e, e.level(), c, r());
  return {
    id: "zone-draw",
    down(c) {
      if (l(c.pt)) {
        d();
        return;
      }
      const p = u(c).vertex;
      a(ct(p)) || (t = [...t, p], n = ct(p), i = !1);
    },
    move(c) {
      o = c.shift;
      const p = l(c.pt);
      if (p) {
        n = p, s = null, i = nn(t.map(ct));
        return;
      }
      const h = u(c);
      s = h.snap, n = ct(h.vertex), i = a(n);
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
const mi = 40, wp = (e, t) => e.wires.some((n) => [n.from, n.to].some((i) => "block" in i && i.block === t.block && i.port === t.port));
function yp(e, t, n, i) {
  const s = e.blocks.find((h) => h.id === t);
  if ((s == null ? void 0 : s.kind) !== "bus") return e;
  const o = s.w >= s.h, r = o ? s.x : s.y, a = o ? s.w : s.h, l = Ee(o ? i.x : i.y), d = n === "start" ? Math.min(l, r + a - mi) : r, u = n === "end" ? Math.max(l, r + mi) : r + a;
  if (d === r && u === r + a) return e;
  const c = o ? { x: d, w: u - d } : { y: d, h: u - d }, p = (h) => "bus" in h && h.bus === t ? { bus: t, at: Math.min(1, Math.max(0, (r + h.at * a - d) / (u - d))) } : h;
  return {
    ...e,
    blocks: e.blocks.map((h) => h.id === t ? { ...h, ...c } : h),
    wires: e.wires.map((h) => {
      const m = p(h.from), y = p(h.to);
      return m === h.from && y === h.to ? h : { ...h, from: m, to: y };
    })
  };
}
function bp(e) {
  let t = null, n = null, i = null, s = !1, o = { x: 0, y: 0 };
  const r = () => {
    t = null, n = null, i = null, s = !1;
  };
  function a(u, c) {
    const p = Ws(u, c, e.tolMm(), e.geo());
    return (p == null ? void 0 : p.kind) === "port" ? { block: p.block, port: p.port } : (p == null ? void 0 : p.kind) === "bus" ? { bus: p.id, at: p.at } : (p == null ? void 0 : p.kind) === "bus-end" ? { bus: p.id, at: p.end === "start" ? 0 : 1 } : null;
  }
  function l(u) {
    const c = t, p = n;
    if (!c || !p || !s && C(u.pt, o) <= Pn / e.scale()) return;
    if (s = !0, c.kind === "wire") {
      const w = a(p, u.pt);
      t = { ...c, to: u.pt, ok: !!w && !("error" in Fs(p, c.from, w)) };
      return;
    }
    if (c.kind === "bus-end") {
      i = yp(p, c.id, c.end, u.pt);
      return;
    }
    const h = p.blocks.find((w) => w.id === (c.kind === "pin" ? c.from.block : c.id));
    if (!h) return;
    if (c.kind === "pin") {
      i = Wc(p, h.id, c.from.port, rd(ut(h, e.geo(), p), u.pt));
      return;
    }
    const m = Ee(h.x + u.pt.x - o.x), y = Ee(h.y + u.pt.y - o.y);
    i = m === h.x && y === h.y ? p : jc(p, h.id, m, y);
  }
  function d(u, c, p) {
    const h = a(u, p);
    if (!h) return;
    const m = Fs(u, c, h);
    if ("error" in m) {
      e.notify(f(`power.err.${m.error}`));
      return;
    }
    e.commitPower(m.schema), e.notify(null);
  }
  return {
    id: "power-select",
    down(u) {
      r(), o = u.pt;
      const c = e.power(), p = Ws(c, u.pt, e.tolMm(), e.geo());
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
        const h = { block: p.block, port: p.port };
        if (wp(c, h)) {
          t = { kind: "pin", from: h };
          return;
        }
        const m = c.blocks.find((w) => w.id === p.block), y = Sn(c, m, e.geo()).find((w) => w.name === p.port).pt;
        t = { kind: "wire", from: h, at: y, to: y, ok: !1 };
        return;
      }
      e.select({ kind: "powerBlock", id: p.id }), t = p.kind === "bus-end" ? { kind: "bus-end", id: p.id, end: p.end } : { kind: "move", id: p.id };
    },
    move(u) {
      l(u);
    },
    up(u) {
      l(u);
      const c = t, p = n, h = i, m = s;
      if (r(), !(!c || !p)) {
        if (!m) {
          (c.kind === "wire" || c.kind === "pin") && e.select({ kind: "powerBlock", id: c.from.block });
          return;
        }
        c.kind === "wire" ? d(p, c.from, u.pt) : h && h !== p && e.commitPower(h);
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
function vp(e, t) {
  const n = t.slice(6);
  return {
    id: t,
    down(i) {
      var d;
      let s;
      if (n === "device") {
        const u = e.placeDeviceId();
        if (!u) {
          e.notify(f("power.pickDevice"));
          return;
        }
        s = u;
      }
      const o = e.power(), r = Vc(n, { x: 0, y: 0 }, o, s), a = ut(r, e.geo(), Rs(o, r)), l = { ...r, x: Ee(i.pt.x - a.w / 2), y: Ee(i.pt.y - a.h / 2) };
      e.commitPower(Rs(o, l)), n === "device" && ((d = e.devicePlaced) == null || d.call(e)), e.pickTool("power-select"), e.select({ kind: "powerBlock", id: l.id });
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
const $p = ["select", "box", "wall", "door", "window", "opening", "zone"], xp = [
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
], kp = ["binding-select"], Mp = ["zones-select", "zone-room", "zone-draw"], _p = [
  "power-select",
  "power-device",
  "power-meter",
  "power-bus",
  "power-battery",
  "power-pv",
  "power-transfer",
  "power-remainder"
], Ap = {
  plan: $p,
  equipment: xp,
  binding: kp,
  zones: Mp,
  power: _p
};
function qi(e) {
  return Ap[e];
}
function gi(e, t) {
  switch (e) {
    case "select":
      return tp(t);
    case "box":
      return ep(t);
    case "wall":
      return np(t);
    case "door":
    case "window":
    case "opening":
      return ip(t, e);
    case "zone":
      return sp(t);
    case "device-select":
      return lp(t);
    case "binding-select":
      return cp(t);
    case "zones-select":
      return fp(t);
    case "zone-room":
      return up(t);
    case "zone-draw":
      return gp(t);
    case "power-select":
      return bp(t);
    case "power-device":
    case "power-meter":
    case "power-bus":
    case "power-battery":
    case "power-pv":
    case "power-transfer":
    case "power-remainder":
      return vp(t, e);
    default:
      return rp(t, e);
  }
}
function Gn(e, t, n) {
  return t.kind === "powerBlock" ? n.blocks.some((s) => s.id === t.id) : t.kind === "powerWire" ? n.wires.some((s) => s.id === t.id) : t.kind === "automationZone" ? F(e).some((s) => s.id === t.id) : (t.kind === "wall" ? e.walls : t.kind === "node" ? e.nodes : t.kind === "opening" ? e.openings : t.kind === "device" ? e.devices : e.zones).some((s) => s.id === t.id);
}
function Sp(e) {
  switch (e.saveState) {
    case "saving":
      return f("save.saving");
    case "conflict":
      return f("save.conflict");
    case "error":
      return f("save.error");
    default:
      return e.dirty ? f("save.dirty") : f(e.saveState === "saved" ? "save.saved" : "save.clean");
  }
}
function Ep(e) {
  return b`
    <div class="top"><div class="bar">
      ${e.lead ?? v}
      ${e.plans.length > 1 ? b`
        <select class="plan-pick" aria-label=${f("plan.pick")} title=${f("plan.pick")}
          ?disabled=${e.saveState === "saving"} .value=${W(e.planId)}
          @change=${(t) => {
    const n = t.target, i = n.value;
    n.value = e.planId, i !== e.planId && e.onPickPlan(i);
  }}>
          ${e.plans.map((t) => b`<option value=${t.id} ?selected=${t.id === e.planId}>${t.name}</option>`)}
        </select>` : v}
      <button class="btn" data-action="new-plan" title=${f("plan.new")} aria-label=${f("plan.new")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onNewPlan}>+</button>
      <button class="btn" data-action="delete-plan" title=${f("plan.delete")} aria-label=${f("plan.delete")}
        ?disabled=${e.busy || e.saveState === "saving"} @click=${e.onDeletePlan}>&#128465;</button>
      <span class="sp"></span>
      <button class="btn" title=${f("action.undo")} aria-label=${f("action.undo")} ?disabled=${!e.canUndo}
        @click=${e.onUndo}>↶</button>
      <button class="btn" title=${f("action.redo")} aria-label=${f("action.redo")} ?disabled=${!e.canRedo}
        @click=${e.onRedo}>↷</button>
      <span class="save-state ${e.saveState}" title=${e.saveState === "error" ? e.errorMessage ?? "" : ""}>
        ${Sp(e)}${e.saveState === "error" && e.errorMessage ? b`: ${e.errorMessage}` : v}</span>
      <button class="btn primary" data-action="save" ?disabled=${e.saveState === "saving"} @click=${e.onSave}>
        ${f("action.save")}</button>
    </div>${e.steps}</div>`;
}
const Ip = ["zone", "ceiling_light", "power-device", "power-meter"];
function ea(e, t, n) {
  return qi(e).map((i) => b`
    ${Ip.includes(i) ? b`<div class="tool-sep"></div>` : v}
    <button class="tool ${t === i ? "on" : ""}" data-tool=${i} @click=${() => n(i)}>
      ${f(`tool.${i}`)}</button>`);
}
function Pp(e, t, n) {
  return b`<div class="tools">${ea(e, t, n)}</div>`;
}
const pe = ["plan", "equipment", "binding", "zones", "power"], qt = (e, t, n) => f(e === 1 ? t : n).replace("{n}", String(e));
function Op(e, t, n, i) {
  const { walls: s, zones: o, devices: r } = t;
  switch (e) {
    case "plan":
      return {
        text: `${qt(s.length, "steps.wall", "steps.walls")}, ${qt(o.length, "steps.room", "steps.rooms")}`,
        done: s.length > 0 && o.length > 0
      };
    case "equipment":
      return { text: qt(r.length, "steps.device", "steps.devices"), done: r.length > 0 };
    case "binding": {
      const a = r.length - Ai(r.map(n));
      return {
        text: f("steps.bound").replace("{b}", String(a)).replace("{n}", String(r.length)),
        done: r.length > 0 && a === r.length
      };
    }
    case "zones": {
      const a = F(t).length;
      return { text: qt(a, "steps.zone", "steps.zones"), done: a > 0 };
    }
    case "power":
      return { text: qt(i.blocks.length, "steps.block", "steps.blocks"), done: Qc(i) };
  }
}
const ao = (e, t) => f(e).replace("{step}", f(`mode.${t}`));
function Cp(e) {
  const t = pe.indexOf(e.mode), n = pe[t - 1], i = pe[t + 1];
  return b`
    <nav class="steps" aria-label=${f("steps.label")}>
      <div class="title">
        <input class="plan-name" .value=${W(e.planName)} aria-label=${f("plan.name")} title=${f("plan.name")}
          @change=${(s) => e.onRename(s.target.value)} />
        <span class="app">${f("steps.app")}</span>
      </div>
      ${pe.map((s, o) => {
    const r = Op(s, e.level, e.status, e.power), a = s === e.mode;
    return b`<button class="step${a ? " current" : ""}${r.done ? " done" : ""}" data-mode=${s}
          aria-current=${a ? "step" : v} @click=${() => e.onMode(s)}>
          <span class="n">${o + 1}</span><span class="name">${f(`mode.${s}`)}</span><span class="state">${r.text}</span>
        </button>`;
  })}
      <button class="step later" data-step="automation" disabled>
        <span class="n">${pe.length + 1}</span><span class="name">${f("mode.automation")}</span>
        <span class="state">${f("steps.later")}</span>
      </button>
      <div class="nav">
        ${n ? b`<button class="btn" data-nav="back" @click=${() => e.onMode(n)}>${ao("steps.back", n)}</button>` : v}
        ${i ? b`<button class="btn primary" data-nav="next" @click=${() => e.onMode(i)}>${ao("steps.next", i)}</button>` : v}
      </div>
    </nav>`;
}
const Lp = ["unbound", "bound", "all"], Np = /* @__PURE__ */ new WeakMap();
function na(e) {
  return dt(Np, e, (t) => [...t.devices].sort((n, i) => n.name.localeCompare(i.name) || n.id.localeCompare(i.id)));
}
function Tp(e, t, n) {
  const i = na(e), s = t === null ? -1 : i.findIndex((o) => o.id === t);
  for (let o = 1; o <= i.length; o++) {
    const r = i[(s + o) % i.length];
    if (n(r) !== "bound") return r.id;
  }
  return null;
}
const lo = (e) => f(`device.${e.props.kind}`), zp = (e, t) => e === "all" || e === "bound" == (t === "bound");
function Dp(e, t, n) {
  return t === 0 ? f("binding.noDevices") : n || e.filter === "all" ? f("binding.noMatch") : f(e.filter === "unbound" ? "binding.allBound" : "binding.noneBound");
}
function co(e) {
  const t = f(e.collapsed ? "binding.expand" : "binding.collapse");
  return b`<button class="rail-toggle" data-action="toggle-rail" aria-expanded=${String(!e.collapsed)} aria-label=${t}
    title=${t} @click=${() => e.onCollapse(!e.collapsed)}>${e.collapsed ? "›" : "‹"}</button>`;
}
function Rp(e) {
  var r;
  if (e.collapsed) return b`<div class="blist collapsed">${co(e)}</div>`;
  const t = na(e.level).map((a) => ({ d: a, st: e.status(a) })), n = {
    unbound: Ai(t.map((a) => a.st)),
    bound: t.filter((a) => a.st === "bound").length,
    all: t.length
  }, i = e.query.trim().toLowerCase(), s = t.filter(({ d: a, st: l }) => zp(e.filter, l) && (!i || a.name.toLowerCase().includes(i) || lo(a).toLowerCase().includes(i))), o = ((r = e.selection) == null ? void 0 : r.kind) === "device" ? e.selection.id : null;
  return b`
    <div class="blist">
      <div class="bhead">
        <div class="filter-seg" role="radiogroup" aria-label=${f("binding.show")}>
          ${Lp.map((a) => b`<button role="radio" aria-checked=${String(a === e.filter)} data-filter=${a}
            @click=${() => e.onFilter(a)}>${f(`binding.filter.${a}`)} <span class="count">${n[a]}</span></button>`)}
        </div>
        ${co(e)}
      </div>
      <input class="list-search" type="search" placeholder=${f("binding.search")} aria-label=${f("binding.search")}
        .value=${W(e.query)} @input=${(a) => e.onQuery(a.target.value)} />
      <div class="rows">
        ${s.length === 0 ? b`<p class="empty">${Dp(e, t.length, i)}</p>` : s.map(({ d: a, st: l }) => {
    const d = Za(a);
    return b`<button class="brow${a.id === o ? " sel" : ""}" data-id=${a.id} @click=${() => e.onPick(a.id)}>
            <span class="dot ${l}" role="img" aria-label=${f(`bindstatus.${l}`)} title=${f(`bindstatus.${l}`)}></span>
            <span class="nm"><span class="name">${a.name}</span><small class="kind">${lo(a)}</small></span>
            <span class="cnt">${d.filled}/${d.total}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function I(e, t) {
  return b`<label class="row"><span>${e}</span>${t}</label>`;
}
function G(e, t, n, i) {
  return b`<select class="val" data-field=${i ?? v} .value=${W(e)} @change=${(s) => {
    const o = s.target;
    n(o.value) === !1 && (o.value = e);
  }}>
    ${t.map((s) => b`<option value=${s.v} ?selected=${s.v === e}>${s.label}</option>`)}
  </select>`;
}
function Lt(e) {
  const t = e.value === null ? "" : String(Math.round(e.value)), n = (i) => {
    var s;
    return (s = e.setNotice) == null ? void 0 : s.call(e, i);
  };
  return b`<input class="val" type="text" inputmode="numeric" data-field=${e.field ?? v}
    placeholder=${e.placeholder ?? v} title=${e.placeholder ?? v} .value=${W(t)}
    @change=${(i) => {
    const s = i.target;
    if (e.onBlank && s.value.trim() === "") {
      (e.value === null || e.onBlank() !== !1) && n(null);
      return;
    }
    const o = Le(s.value, e.rule);
    if (o === null) {
      s.value = t, n(f(e.bad));
      return;
    }
    if (e.skipSame && o === e.value) {
      n(null);
      return;
    }
    if (e.apply(o) === !1) {
      s.value = t, n(f("props.noFit"));
      return;
    }
    n(null);
  }} />`;
}
function Bp() {
  return {
    door: { width: je.door, hinge: "start", swing: "left" },
    window: { width: je.window, outside: "left" },
    opening: { width: je.opening },
    zoneName: null
  };
}
function Hp(e, t) {
  return t === "door" ? { ...e.door } : t === "window" ? { ...e.window } : { width: e.opening.width };
}
function ia(e) {
  return Mi(f("zone.default"), e.zones.map((t) => t.name));
}
const Fp = (e) => e === "door" || e === "window" || e === "opening" || e === "zone";
function Up(e) {
  const t = e.next;
  if (e.tool === "zone") {
    const r = t.zoneName ?? ia(e.level);
    return b`
      <h4>${f("props.nextZone")}</h4>
      ${I(f("props.name"), b`<input class="val wide" type="text" data-field="next-zone-name" .value=${W(r)}
        @change=${(a) => {
      const l = a.target, d = l.value.trim();
      if (!d) {
        l.value = r;
        return;
      }
      d !== r && e.setNext({ ...t, zoneName: d });
    }} />`)}`;
  }
  if (e.tool !== "door" && e.tool !== "window" && e.tool !== "opening") return v;
  const n = e.tool, i = t[n].width, s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = (r) => e.setNext({ ...t, [n]: { ...t[n], ...r } });
  return b`
    <h4>${f(`props.next.${n}`)}</h4>
    ${I(`${f("props.width")}, ${f("unit.mm")}`, Lt({
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
    ${n === "door" ? b`
      ${I(f("props.hinge"), G(
    t.door.hinge,
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => {
      r !== t.door.hinge && o({ hinge: r });
    },
    "next-hinge"
  ))}
      ${I(f("props.swing"), G(t.door.swing, s, (r) => {
    r !== t.door.swing && o({ swing: r });
  }, "next-swing"))}` : v}
    ${n === "window" ? I(f("props.outside"), G(
    t.window.outside,
    s,
    (r) => {
      r !== t.window.outside && o({ outside: r });
    },
    "next-outside"
  )) : v}`;
}
class Vp {
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
class jp {
  constructor(t) {
    this.h = t;
  }
  async load() {
    if (this.h.hass) {
      this.h.loading = !0, this.h.loadError = null;
      try {
        const t = await jn(this.h.hass);
        if (this.h.plans = t, t.length === 0)
          this.h.save.reset(null), this.adopt(cs(f("plan.default"))), this.offerDraft(this.h.drafts.latest());
        else {
          const n = this.h.drafts.lastPlanId();
          await this.openPlan(t.some((i) => i.id === n) ? n : t[0].id);
        }
      } catch (t) {
        this.h.loadError = wt(t);
      } finally {
        this.h.loading = !1;
      }
    }
  }
  /** Loads a stored plan from the server and makes it the open one. */
  async openPlan(t) {
    const n = await md(this.h.hass, t);
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
        this.h.plans = await jn(this.h.hass);
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
      this.h.notice = wt(n);
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
    this.h.toolId = qi(this.h.mode)[0], this.h.notice = null, this.h.save.reset(null), this.adopt(cs(f("plan.default"))), this.offerDraft(null);
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
            await wd(this.h.hass, t.id);
          } catch (o) {
            this.h.save.state = "error", this.h.save.errorMessage = wt(o);
            return;
          }
        this.h.drafts.cancel(), this.h.drafts.clear(t.id), this.h.drafts.clearLastPlanId(t.id), ((n = this.h.pendingDraft) == null ? void 0 : n.planId) === t.id && this.offerDraft(null);
        let i = [];
        try {
          i = await jn(this.h.hass), this.h.plans = i;
        } catch {
          i = [];
        }
        const s = i.find((o) => o.id !== t.id);
        if (s)
          try {
            await this.openPlan(s.id);
            return;
          } catch (o) {
            this.h.notice = wt(o);
          }
        this.openFresh();
      } finally {
        this.h.deleting = !1;
      }
    }
  }
  adopt(t) {
    this.h.plan = { ...t, levels: t.levels.map(ol) };
    const n = Xc(this.h.plan.power);
    this.h.history = new Vp({ level: this.h.plan.levels[0], ...n ? { power: n } : {} }), this.h.lazyPower = Nr(), this.h.activeTool.cancel(), this.h.activeTool = gi(this.h.toolId, this.h.ctx), this.h.selection = null, this.h.fieldNotice = null, this.h.placeDeviceId = null, this.h.needFit = !0, this.h.needPowerFit = !0;
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
    const t = this.h.plan, { level: n, power: i } = this.h.history.current, s = t.levels.map((a, l) => l === 0 ? n : a), { power: o, ...r } = t;
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
    const t = `${this.h.plan.name} ${f("plan.copySuffix")}`, n = this.h.plan.id, i = await this.h.save.saveAsNew(this.currentPlan(), t);
    i ? (this.h.plan = i, this.h.dialog = null, this.afterSaved(n, i.id)) : this.h.save.state === "error" && (this.h.dialog = null);
  }
}
class Wp {
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
    !n || !zc(n.states, t) ? this.base = { states: t, meta: Tc(t) } : n.states = t;
    const i = this.base.meta, s = this.merged;
    if (s && s.base === i && s.regs === this.regs) return s.meta;
    const o = this.regs ? Rc(i, this.regs) : i;
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
    this.pending || !t || (this.tried = !0, this.pending = !0, this.h.requestUpdate(), Dc(t).then(
      (n) => {
        this.regs = n, this.error = null;
      },
      (n) => {
        this.error = f("binding.registryError").replace("{error}", wt(n));
      }
    ).finally(() => {
      this.pending = !1, this.h.requestUpdate();
    }));
  }
}
const He = Oo("", "");
function Zp(e) {
  return {
    level: () => {
      var t;
      return ((t = e.history) == null ? void 0 : t.current.level) ?? He;
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
    openingDefaults: (t) => Hp(e.nextObj, t),
    zoneName: () => {
      var t;
      return e.nextObj.zoneName ?? ia(((t = e.history) == null ? void 0 : t.current.level) ?? He);
    },
    /** A custom zone name is single-use: the next default is "Room N" again. */
    zonePlaced: () => {
      e.nextObj = { ...e.nextObj, zoneName: null };
    },
    geo: () => {
      var n;
      const t = (((n = e.history) == null ? void 0 : n.current.level) ?? He).devices;
      return { device: (i) => t.find((s) => s.id === i) };
    },
    // The arm counts only while its device is placeable: Undo / Redo may have put its block back or removed the
    // device from the level. A stale arm is dropped, so the tool asks for a pick and places nothing.
    placeDeviceId: () => {
      var n;
      const t = e.placeDeviceId;
      return t === null ? null : Rr(((n = e.history) == null ? void 0 : n.current.level) ?? He, e.power).some((i) => i.id === t) ? t : (e.placeDeviceId = null, null);
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
const sa = Object.keys(Ii), qp = (e) => sa.includes(e);
function Gp() {
  return Object.fromEntries(sa.map((e) => [e, Ht(e, "free")]));
}
const oa = {
  mm: { rule: { min: 1 }, bad: "props.badNumber" },
  angle: { rule: { min: 1, max: 360 }, bad: "props.badAngle" },
  rotation: { rule: { min: 0, max: 359 }, bad: "props.badRotation" },
  offset: { rule: { min: 0 }, bad: "props.badOffset" },
  aim: { rule: { min: -te, max: te, signed: !0 }, bad: "props.badAim" }
}, ve = (e, t, n, i, s) => Lt({ ...oa[i], value: n, field: t, setNotice: e.onNotice, apply: s, skipSame: !0 }), Kp = ["round", "linear", "spot"], Yp = ["rect", "circle"], an = (e, t) => e.map((n) => ({ v: n, label: f(`${t}.${n}`) }));
function ra(e, t, n, i) {
  const s = (r, a, l) => I(`${f(a)}, ${f("unit.mm")}`, ve(e, n + r, l, "mm", (d) => i({ [r]: d }))), o = (r, a, l) => I(`${f(a)}, ${f("unit.deg")}`, ve(e, n + r, l, "angle", (d) => i({ [r]: d })));
  switch (t.kind) {
    case "ceiling_light":
      return b`
        ${I(f("props.shape"), G(t.shape, an([...Kp], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "linear" ? b`${s("length", "props.length", t.length)}${s("width", "props.width", t.width)}` : t.shape === "round" ? s("diameter", "props.diameter", t.diameter) : v}
        ${I(`${f("props.poolRadius")}, ${f("unit.mm")}`, Lt({
        ...oa.mm,
        value: t.poolRadius,
        field: `${n}poolRadius`,
        placeholder: f("props.poolHint"),
        setNotice: e.onNotice,
        skipSame: !0,
        apply: (r) => i({ poolRadius: r }),
        onBlank: () => i({ poolRadius: null })
      }))}`;
    case "wall_light":
      return b`${o("coneAngle", "props.coneAngle", t.coneAngle)}${s("coneRange", "props.coneRange", t.coneRange)}`;
    case "motion_sensor":
      return b`${o("zoneAngle", "props.zoneAngle", t.zoneAngle)}${s("zoneRange", "props.zoneRange", t.zoneRange)}`;
    case "exhaust_fan":
      return I(`${f("props.diameter")}, ${f("unit.mm")}`, b`<select class="val" data-field=${`${n}diameter`}
        .value=${W(String(t.diameter))} @change=${(r) => {
        const a = r.target, l = Number(a.value);
        l !== t.diameter && !i({ diameter: l }) && (a.value = String(t.diameter));
      }}>
        ${Ya.map((r) => b`<option value=${String(r)} ?selected=${r === t.diameter}>${r}</option>`)}
      </select>`);
    case "equipment":
      return b`
        ${I(f("props.shape"), G(t.shape, an([...Yp], "shape"), (r) => i({ shape: r }), `${n}shape`))}
        ${t.shape === "rect" ? b`${s("width", "props.width", t.width)}${s("depth", "props.depth", t.depth)}` : s("diameter", "props.diameter", t.diameter)}
        ${I(f("props.icon"), Qp(e, t.icon, `${n}icon`, i))}
        ${I(f("props.label"), b`<input class="val wide" type="text" data-field=${`${n}label`} .value=${W(t.label)}
          @change=${(r) => {
        const a = r.target.value.trim();
        a !== t.label && i({ label: a });
      }} />`)}`;
    default:
      return b`<p class="muted">${f("props.noSettings")}</p>`;
  }
}
const Xp = /^mdi:[a-z0-9-]+$/;
function Qp(e, t, n, i) {
  const s = (o, r) => {
    var a, l;
    if (!Xp.test(o)) {
      r(t), (a = e.onNotice) == null || a.call(e, f("props.badIcon"));
      return;
    }
    (l = e.onNotice) == null || l.call(e, null), o !== t && !i({ icon: o }) && r(t);
  };
  return customElements.get("ha-icon-picker") ? b`<ha-icon-picker data-field=${n} .value=${W(t)} @value-changed=${(o) => {
    var a;
    const r = o.target;
    s(String(((a = o.detail) == null ? void 0 : a.value) ?? "").trim(), (l) => {
      r.value = l;
    });
  }}></ha-icon-picker>` : b`<input class="val wide" type="text" data-field=${n} .value=${W(t)}
    @change=${(o) => {
    const r = o.target;
    s(r.value.trim(), (a) => {
      r.value = a;
    });
  }} />`;
}
function Jp(e, t) {
  const n = t.placement;
  if (n.mode === "free")
    return I(
      `${f("props.rotation")}, ${f("unit.deg")}`,
      ve(e, "rotation", n.rotation, "rotation", (s) => e.onPlacement({ ...n, rotation: s }))
    );
  const i = Co.has(t.props.kind);
  return b`
    ${I(f("props.side"), G(n.side, an(["left", "right"], "side"), (s) => e.onPlacement({ ...n, side: s }), "side"))}
    ${I(`${f("props.offset")}, ${f("unit.mm")}`, ve(
    e,
    "offset",
    n.offset,
    "offset",
    (s) => e.onPlacement({ ...n, offset: s })
  ))}
    ${i ? I(
    `${f("props.aim")}, ${f("unit.deg")}`,
    ve(e, "aim", n.aim ?? 0, "aim", (s) => e.onPlacement(fr(n, s)))
  ) : v}`;
}
function aa(e, t) {
  return I(f("props.name"), b`<input class="val wide" type="text" data-field="name" .value=${W(e.name)}
    @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t(s);
  }} />`);
}
function th(e, t) {
  const n = t.props.kind;
  return ie(n) ? n === "smart_button" && t.placement.mode === "free" ? b`<p class="muted" data-note="type-free">${f("props.typeFreeHint")}</p>` : I(f("props.type"), G(
    n,
    an(["wall_switch", "smart_button"], "device"),
    (i) => {
      var s;
      return (s = e.onKind) == null ? void 0 : s.call(e, i);
    },
    "kind"
  )) : v;
}
function eh(e, t) {
  const n = e.level ? fc(e.level, t) : [];
  return b`<fieldset data-field="zone-membership"><legend>${f("props.zoneList")}</legend>
    ${n.length === 0 ? b`<p class="muted">${f("props.noZones")}</p>` : n.map(({ zone: i, participates: s }) => b`<label class="row"><span>${i.name}</span><input type="checkbox" data-zone=${i.id} .checked=${s}
        @change=${(o) => {
    var a;
    const r = o.target;
    (a = e.onZone) != null && a.call(e, i.id, r.checked) || (r.checked = s);
  }} /></label>`)}
  </fieldset>`;
}
function nh(e, t) {
  return b`
    <h4>${f(`device.${t.props.kind}`)}</h4>
    ${aa(t, (n) => e.onDevice({}, n))}
    ${th(e, t)}
    ${ra(e, t.props, "", (n) => e.onDevice(n))}
    ${Jp(e, t)}
    ${eh(e, t)}
    ${t.invalid ? b`<p class="warn">${f("props.invalidDevice")}</p>` : v}
    <button class="btn danger" data-action="delete-device" @click=${() => e.onDelete()}>${f("action.delete")}</button>`;
}
function ih(e) {
  return e.device ? nh(e, e.device) : e.nextKind && e.nextProps ? b`
      <h4>${f("props.nextDevice")}: ${f(`device.${e.nextKind}`)}</h4>
      ${ra(e, e.nextProps, "next-", (t) => (e.onNext(t), !0))}` : b`<p class="muted">${f("props.none")}</p>`;
}
function sh(e) {
  const { level: t, selection: n } = e, i = (n == null ? void 0 : n.kind) === "device" ? t.devices.find((r) => r.id === n.id) ?? null : null, s = qp(e.toolId) ? e.toolId : null, o = (r) => r === t ? (e.setNotice(f("props.noFit")), !1) : (e.setNotice(null), e.commit(r), !0);
  return b`<div class="props">
    ${ih({
    device: i,
    level: t,
    nextKind: s,
    nextProps: s ? e.nextProps[s] : null,
    onDevice: (r, a) => !!i && o(mn(t, i.id, r, a)),
    onKind: (r) => !!i && o(Wl(t, i.id, r)),
    onPlacement: (r) => !!i && o(Li(t, i.id, r)),
    onZone: (r, a) => !!i && o(_r(t, i.id, r, a)),
    onNext: (r) => {
      s && e.setNextProps({ ...e.nextProps, [s]: { ...e.nextProps[s], ...r, kind: s } });
    },
    onDelete: () => {
      i && e.commit(sr(t, i.id));
    },
    onNotice: (r) => e.setNotice(r)
  })}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : v}
  </div>`;
}
function la(e, t, n) {
  return Lt({ value: t, rule: { min: 1 }, bad: "props.badWidth", setNotice: e.setNotice, apply: n });
}
function uo(e, t) {
  return t === e.level ? !1 : (e.commit(t), !0);
}
function oh(e, t) {
  const n = nt(t.level, e).len, i = ["bearing", "partition", "railing", ...e.type === "fence" ? ["fence"] : []], s = (o) => t.commit(Lc(t.level, e.id, o));
  return b`
    <h4>${f("props.wall")}</h4>
    ${I(f("props.type"), G(
    e.type,
    i.map((o) => ({ v: o, label: f(`walltype.${o}`) })),
    (o) => s({ type: o }),
    "wall-type"
  ))}
    ${I(f("props.thickness"), la(t, e.thickness, (o) => {
    s({ thickness: o });
  }))}
    ${I(f("props.baseline"), G(
    e.baseline,
    ["center", "left", "right"].map((o) => ({ v: o, label: f(`baseline.${o}`) })),
    (o) => s({ baseline: o })
  ))}
    ${I(f("props.length"), b`<span class="val ro">${Rt(n)} ${f("unit.mm")}</span>`)}
    <button class="btn danger" data-action="delete-wall" @click=${() => t.commit(Di(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function rh(e, t) {
  const n = ["door", "window", "opening", ...Je.slice(1).includes(e.kind) ? [e.kind] : []], i = (r) => t.commit(jl(t.level, e.id, r)), s = ["left", "right"].map((r) => ({ v: r, label: f(`side.${r}`) })), o = Je.includes(e.kind);
  return b`
    <h4>${f(`kind.${e.kind}`)}</h4>
    ${I(f("props.kind"), G(e.kind, n.map((r) => ({ v: r, label: f(`kind.${r}`) })), (r) => i(Vl(e, r))))}
    ${I(f("props.width"), la(t, e.width, (r) => uo(t, Ul(t.level, e.id, r))))}
    ${I(f("props.offset"), Lt({
    value: e.offset,
    rule: { min: 0 },
    bad: "props.noFit",
    setNotice: t.setNotice,
    apply: (r) => uo(t, Jo(t.level, e.id, r))
  }))}
    ${o ? b`
      ${I(f("props.hinge"), G(
    e.hinge ?? "start",
    ["start", "end"].map((r) => ({ v: r, label: f(`hinge.${r}`) })),
    (r) => i({ hinge: r })
  ))}
      ${I(f("props.swing"), G(e.swing ?? "left", s, (r) => i({ swing: r })))}` : v}
    ${e.kind === "window" ? I(f("props.outside"), G(e.outside ?? "left", s, (r) => i({ outside: r }))) : v}
    ${I(f("props.passesLight"), b`<input type="checkbox" data-field="passesLight" .checked=${W(Ko(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesLight: a === Go(e.kind) ? void 0 : a });
  }} />`)}
    ${I(f("props.passesPir"), b`<input type="checkbox" data-field="passesPir" .checked=${W(Xo(e))}
      @change=${(r) => {
    const a = r.target.checked;
    i({ passesPir: a === Yo(e.kind) ? void 0 : a });
  }} />`)}
    ${e.invalid ? b`<p class="warn">${f("props.invalidOpening")}</p>` : v}
    <button class="btn danger" data-action="delete-opening" @click=${() => t.commit(tr(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function ah(e, t) {
  return b`
    <h4>${f("props.zone")}</h4>
    ${I(f("props.name"), b`<input class="val wide" type="text" .value=${W(e.name)}
      @change=${(n) => {
    const i = n.target, s = i.value.trim();
    if (!s) {
      i.value = e.name;
      return;
    }
    s !== e.name && t.commit(Hl(t.level, e.id, s));
  }} />`)}
    ${I(f("props.area"), b`<span class="val ro">${Zr(Wo(e.outline))}</span>`)}
    ${e.broken ? b`<p class="warn">${f("props.broken")}</p>` : v}
    <button class="btn danger" data-action="delete-zone" @click=${() => t.commit(qo(t.level, e.id))}>
      ${f("action.delete")}</button>`;
}
function lh(e) {
  const t = ["bearing", "partition", "railing"];
  return b`
    <h4>${f("props.newWall")}</h4>
    ${I(f("props.type"), b`<select class="val" data-field="new-wall-type"
      @change=${(n) => e.setWallType(n.target.value)}>
      ${t.map((n) => b`<option value=${n} ?selected=${n === e.wallType}>${f(`walltype.${n}`)}</option>`)}
    </select>`)}
    ${I(`${f("props.thickness")}, ${f("unit.mm")}`, Lt({
    value: e.thickness,
    rule: { min: 1 },
    bad: "props.badWidth",
    setNotice: e.setNotice,
    field: "new-wall-thickness",
    apply: (n) => {
      e.setThickness(n);
    }
  }))}
    ${e.tool === "box" ? b`
      <div class="muted">${f("props.measure")}</div>
      <div class="seg">
        ${["inner", "axis", "outer"].map((n) => b`
          <button class=${e.boxMeasure === n ? "on" : ""} aria-pressed=${String(e.boxMeasure === n)} data-measure=${n}
            @click=${() => e.setBoxMeasure(n)}>
            ${f(`measure.${n}`)}</button>`)}
      </div>` : v}`;
}
function ch(e) {
  const { level: t, selection: n } = e;
  let i = v;
  if ((n == null ? void 0 : n.kind) === "wall") {
    const s = t.walls.find((o) => o.id === n.id);
    s && (i = oh(s, e));
  } else if ((n == null ? void 0 : n.kind) === "opening") {
    const s = t.openings.find((o) => o.id === n.id);
    s && (i = rh(s, e));
  } else if ((n == null ? void 0 : n.kind) === "zone") {
    const s = t.zones.find((o) => o.id === n.id);
    s && (i = ah(s, e));
  } else if ((n == null ? void 0 : n.kind) === "node") {
    const s = t.nodes.find((o) => o.id === n.id);
    s && (i = b`<h4>${f("props.node")}</h4>
      ${I("X", b`<span class="val ro">${Rt(s.x)}</span>`)}${I("Y", b`<span class="val ro">${Rt(s.y)}</span>`)}`);
  }
  return b`
    <div class="props">
      ${i === v && (e.tool === "wall" || e.tool === "box") ? lh(e) : i === v && Fp(e.tool) ? Up({ tool: e.tool, level: t, next: e.next, setNext: e.setNext, setNotice: e.setNotice }) : i === v ? b`<p class="muted">${f("props.none")}</p>` : i}
      ${e.notice ? b`<p class="warn">${e.notice}</p>` : v}
    </div>`;
}
function dh(e, t) {
  var n, i;
  return t.domains.includes(e.domain) ? (n = t.plainDomains) != null && n.includes(e.domain) ? e.deviceClass === null && e.unit === null : t.deviceClasses ? e.deviceClass !== null ? t.deviceClasses.includes(e.deviceClass) : e.unit !== null && !!((i = t.units) != null && i.includes(e.unit)) : !0 : !1;
}
const po = /* @__PURE__ */ new WeakMap();
function ca(e, t, n) {
  let i = po.get(e);
  i || po.set(e, i = /* @__PURE__ */ new WeakMap());
  let s = i.get(t);
  s || i.set(t, s = [null, null]);
  const o = n ? 1 : 0;
  if (s[o]) return s[o];
  const r = [...e.entities.values()].filter((a) => {
    var l;
    return n ? t.domains.includes(a.domain) : dh(a, t) && !a.hidden && !a.disabled && (a.category === null || !!((l = t.categories) != null && l.includes(a.category)));
  });
  return r.sort((a, l) => a.name.localeCompare(l.name) || a.entityId.localeCompare(l.entityId)), s[o] = r, r;
}
function Ge(e, t) {
  const n = e.entities.get(t), i = n != null && n.deviceId ? e.devices.get(n.deviceId) : void 0, s = (n == null ? void 0 : n.areaId) ?? (i == null ? void 0 : i.areaId) ?? null, o = [s ? e.areas.get(s) : void 0, i == null ? void 0 : i.name].filter((r) => !!r);
  return { name: (n == null ? void 0 : n.name) ?? t, context: o.join(" ▸ ") || t };
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = (e) => e ?? v;
var uh = Object.defineProperty, Te = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && uh(t, n, s), s;
};
const ph = 100;
let hh = 0;
const fh = (e) => b`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${A`<path d=${e}></path>`}</svg>`, Ki = class Ki extends Yt {
  constructor() {
    super(...arguments), this.value = null, this.label = "", this.isOpen = !1, this.query = "", this.active = 0, this.uid = `psc${hh++}`, this.shown = null, this.onOutside = (t) => {
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
        if (s.length === ph) {
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
    return b`<div class="field"><div class="cbox" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded=${this.isOpen ? "true" : "false"}
        aria-controls=${`${this.uid}-lb`} aria-label=${Fe(this.label || void 0)} title=${Fe(this.boxTitle())} @click=${() => this.isOpen ? this.close() : this.openList()} @keydown=${this.onBoxKey}>
      ${this.renderBox()}
      <span class="car" aria-hidden="true">▾</span>
    </div>${this.value ? b`<button class="x" type="button" title=${f("combo.clear")} aria-label=${f("combo.clear")}
          @click=${() => this.pick(null)}>✕</button>` : v}</div>`;
  }
  renderDrop() {
    const { rows: t, more: n } = this.filtered(), i = this.clamped(t);
    return b`<div class="drop" @pointerdown=${(s) => {
      s.target.tagName !== "INPUT" && s.preventDefault();
    }}>
      <div class="srch"><input type="text" role="searchbox" placeholder=${this.searchLabel()} aria-label=${this.searchLabel()}
        aria-controls=${`${this.uid}-lb`} aria-activedescendant=${Fe(t.length ? this.optId(i) : void 0)}
        .value=${this.query} @input=${(s) => {
      this.query = s.target.value, this.active = 0;
    }}
        @keydown=${this.onSearchKey}></div>
      <div class="opts" id=${`${this.uid}-lb`} role="listbox" aria-label=${this.label || this.searchLabel()}>
        ${t.map((s, o) => b`<div class="opt ${o === i ? "on" : ""}" id=${this.optId(o)} role="option"
            aria-selected=${s.id === this.value ? "true" : "false"} data-id=${s.id} title=${Fe(this.rowTitle(s))}
            @click=${() => this.pick(s.id)} @pointerenter=${() => {
      this.active = o;
    }}>${this.renderRow(s)}</div>`)}
      </div>
      ${t.length === 0 ? b`<div class="empty">${this.emptyText()}</div>` : v}
      ${n ? b`<div class="hint">${f("combo.more")}</div>` : v}
    </div>`;
  }
  render() {
    return b`<div @focusout=${this.onFocusOut}>${this.renderClosed()}${this.isOpen ? this.renderDrop() : v}</div>`;
  }
};
Ki.styles = xo`
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
let Ot = Ki;
Te([
  vt()
], Ot.prototype, "value");
Te([
  vt()
], Ot.prototype, "label");
Te([
  z()
], Ot.prototype, "isOpen");
Te([
  z()
], Ot.prototype, "query");
Te([
  z()
], Ot.prototype, "active");
var mh = Object.defineProperty, Gi = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && mh(t, n, s), s;
};
const gh = {
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
}, ho = {
  power: "power",
  energy: "power",
  temperature: "temperature",
  humidity: "humidity",
  motion: "motion",
  occupancy: "motion",
  presence: "motion",
  illuminance: "illuminance"
}, wh = { light: "light", switch: "switch", event: "event", fan: "fan" };
function fo(e, t) {
  return e != null && e.deviceClass && ho[e.deviceClass] ? ho[e.deviceClass] : wh[(e == null ? void 0 : e.domain) ?? Pr(t)] ?? "generic";
}
const mo = (e) => fh(gh[e]);
function yh(e) {
  switch (e) {
    case "sensor":
      return f("combo.domain.sensor");
    case "binary_sensor":
      return f("combo.domain.binary_sensor");
    case "light":
      return f("combo.domain.light");
    case "switch":
      return f("combo.domain.switch");
    case "fan":
      return f("combo.domain.fan");
    case "event":
      return f("combo.domain.event");
    default:
      return e;
  }
}
class On extends Ot {
  constructor() {
    super(...arguments), this.items = [], this.states = void 0;
  }
  rowDeps() {
    return [this.items, this.meta];
  }
  *allRows() {
    for (const t of this.items) {
      const { name: n, context: i } = Ge(this.meta, t.entityId);
      yield { id: t.entityId, name: n, context: i, search: `${n}
${t.entityId}
${i}`.toLowerCase(), e: t };
    }
  }
  renderBox() {
    const t = this.value, n = t ? Ge(this.meta, t) : null;
    return b`${mo(t ? fo(this.meta.entities.get(t), t) : "generic")}
      ${n ? b`<span><b>${n.name}</b>${n.context !== n.name ? b`<small>${n.context}</small>` : v}<small class="eid">${t}</small></span>` : b`<span class="ph">${f("combo.none")}</span>`}`;
  }
  renderRow({ e: t, name: n, context: i }) {
    const s = Cr(this.states, t.entityId) ?? "unavailable";
    return b`${mo(fo(t, t.entityId))}
      <span><b>${n}</b><small>${i}</small><small class="eid">${t.entityId}</small></span>
      <span class="side">${yh(t.domain)}<br>${s}${t.unit ? ` ${t.unit}` : ""}</span>`;
  }
  boxTitle() {
    const t = this.value;
    if (!t) return;
    const n = Ge(this.meta, t).name;
    return n === t ? t : `${n} (${t})`;
  }
  rowTitle(t) {
    return t.name === t.id ? t.id : `${t.name} (${t.id})`;
  }
  searchLabel() {
    return f("combo.search");
  }
  emptyText() {
    return f("combo.empty");
  }
}
Gi([
  vt({ attribute: !1 })
], On.prototype, "meta");
Gi([
  vt({ attribute: !1 })
], On.prototype, "items");
Gi([
  vt({ attribute: !1 })
], On.prototype, "states");
customElements.get("ps-entity-combo") || customElements.define("ps-entity-combo", On);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const da = Vi(class extends ji {
  constructor(e) {
    if (super(e), e.type !== xt.PROPERTY && e.type !== xt.ATTRIBUTE && e.type !== xt.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Gr(e)) throw Error("`live` bindings can only contain a single expression");
  }
  render(e) {
    return e;
  }
  update(e, [t]) {
    if (t === ot || t === v) return t;
    const n = e.element, i = e.name;
    if (e.type === xt.PROPERTY) {
      if (t === n[i]) return ot;
    } else if (e.type === xt.BOOLEAN_ATTRIBUTE) {
      if (!!t === n.hasAttribute(i)) return ot;
    } else if (e.type === xt.ATTRIBUTE && n.getAttribute(i) === t + "") return ot;
    return Kr(e), t;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = (e, t) => {
  var i;
  const n = e._$AN;
  if (n === void 0) return !1;
  for (const s of n) (i = s._$AO) == null || i.call(s, t, !1), $e(s, t);
  return !0;
}, ln = (e) => {
  let t, n;
  do {
    if ((t = e._$AM) === void 0) break;
    n = t._$AN, n.delete(e), e = t;
  } while ((n == null ? void 0 : n.size) === 0);
}, ua = (e) => {
  for (let t; t = e._$AM; e = t) {
    let n = t._$AN;
    if (n === void 0) t._$AN = n = /* @__PURE__ */ new Set();
    else if (n.has(e)) break;
    n.add(e), $h(t);
  }
};
function bh(e) {
  this._$AN !== void 0 ? (ln(this), this._$AM = e, ua(this)) : this._$AM = e;
}
function vh(e, t = !1, n = 0) {
  const i = this._$AH, s = this._$AN;
  if (s !== void 0 && s.size !== 0) if (t) if (Array.isArray(i)) for (let o = n; o < i.length; o++) $e(i[o], !1), ln(i[o]);
  else i != null && ($e(i, !1), ln(i));
  else $e(this, e);
}
const $h = (e) => {
  e.type == xt.CHILD && (e._$AP ?? (e._$AP = vh), e._$AQ ?? (e._$AQ = bh));
};
class xh extends ji {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, n, i) {
    super._$AT(t, n, i), ua(this), this.isConnected = t._$AU;
  }
  _$AO(t, n = !0) {
    var i, s;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (s = this.disconnected) == null || s.call(this)), n && ($e(this, t), ln(this));
  }
  setValue(t) {
    if (Gr(this._$Ct)) this._$Ct._$AI(t, this);
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
const kh = () => new Mh();
class Mh {
}
const Kn = /* @__PURE__ */ new WeakMap(), _h = Vi(class extends xh {
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
      let n = Kn.get(t);
      n === void 0 && (n = /* @__PURE__ */ new WeakMap(), Kn.set(t, n)), n.get(this.G) !== void 0 && this.G.call(this.ht, void 0), n.set(this.G, e), e !== void 0 && this.G.call(this.ht, e);
    } else this.G.value = e;
  }
  get lt() {
    var e, t;
    return typeof this.G == "function" ? (e = Kn.get(this.ht ?? globalThis)) == null ? void 0 : e.get(this.G) : (t = this.G) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
}), Ah = () => [{ v: "0", label: f("binding.singleButton") }, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => ({ v: String(e), label: String(e) }))], Sh = { min: 1, max: 10 };
function pa(e, t) {
  return t === e.level ? !1 : (e.setFieldNotice(null), e.commit(t), !0);
}
const wi = (e, t, n) => pa(e, mn(e.level, t.id, n));
function Yn(e, t, n, i) {
  return b`<div class="cflag">${I(t, b`<input type="checkbox" data-field=${e} .checked=${W(n)}
    @change=${(s) => {
    const o = s.target;
    i(o.checked) || (o.checked = n);
  }} />`)}</div>`;
}
const Xn = "__other", he = /* @__PURE__ */ new Set();
function Eh(e, t, n, i, s) {
  const o = `${t.id}:${n}`, r = ls.includes(i), a = !r || he.has(o), l = kh(), d = [...ls.map((c) => ({ v: c, label: c })), { v: Xn, label: f("binding.eventOther") }];
  return b`<span class="evfield">${G(a ? Xn : i, d, (c) => {
    if (c === Xn) {
      he.add(o), l.value && (l.value.hidden = !1, l.value.focus());
      return;
    }
    he.delete(o), l.value && (l.value.hidden = !0), c !== i ? s(c) : e.setFieldNotice(null);
  }, `${n}-event`)}
    <input class="val wide" type="text" ${_h(l)} data-field=${`${n}-event-custom`} ?hidden=${da(!a)}
      .value=${W(r ? "" : i)} @change=${(c) => {
    var m;
    const p = c.target, h = p.value.trim();
    if (!h) {
      p.value = r ? "" : i, e.setFieldNotice(f("props.badEvent"));
      return;
    }
    if (p.value = h, e.setFieldNotice(null), h !== i) {
      s(h) && he.delete(o);
      return;
    }
    if (he.delete(o), r) {
      p.hidden = !0;
      const y = (m = p.parentElement) == null ? void 0 : m.querySelector("select");
      y && (y.value = i);
    }
  }} /></span>`;
}
function Ih(e, t, n) {
  const i = t.props;
  if (i.kind !== "smart_button") return b`${v}`;
  const s = i[n], o = (r) => wi(e, t, { [n]: { ...s, ...r } });
  return b`<div class="trigger" data-trigger=${n}>
    ${I(f("binding.slot"), G(
    String(s.slot),
    Ah(),
    (r) => r === String(s.slot) ? !1 : o({ slot: Number(r) }),
    `${n}-slot`
  ))}
    ${I(f("binding.event"), Eh(e, t, n, s.event, (r) => o({ event: r })))}
  </div>`;
}
function Ph(e, t, n) {
  const i = t.props;
  if (i.kind === "wall_switch" && n === "state")
    return b`
      ${Yn(
      "autoByDoubleToggle",
      f("binding.autoByDoubleToggle"),
      i.autoByDoubleToggle,
      (a) => wi(e, t, { autoByDoubleToggle: a })
    )}
      ${i.autoByDoubleToggle ? b`<div class="cflag">${I(f("binding.window"), Lt({
      value: i.windowSec,
      rule: Sh,
      bad: "props.badWindow",
      field: "windowSec",
      skipSame: !0,
      setNotice: (a) => e.setFieldNotice(a),
      apply: (a) => wi(e, t, { windowSec: a })
    }))}</div>` : v}`;
  if (i.kind !== "smart_button" || n !== "on" && n !== "off") return b`${v}`;
  const s = (a, l) => (d) => {
    var c, p;
    const u = mn(e.level, t.id, { [a]: d });
    return pa(e, d && !((c = t.bindings) != null && c[l]) ? Po(u, t.id, l, ((p = t.bindings) == null ? void 0 : p.on) ?? null) : u);
  }, o = s("separateOff", "off"), r = Yn("autoEnabled", f("binding.autoEnabled"), i.autoEnabled, s("autoEnabled", "auto"));
  return n === "off" ? r : b`${Yn("separateOff", f("binding.separateOff"), i.separateOff, o)}${i.separateOff ? v : r}`;
}
function Oh(e) {
  return e.props.kind !== "smart_button" || !Ka(e).length ? b`${v}` : b`<div class="cfields"><p class="warn" data-note="duplicate">${f("binding.duplicate")}</p></div>`;
}
function Ch(e, t) {
  return t === "on" && e.props.kind === "smart_button" && !e.props.separateOff ? f("binding.onOff") : f(`role.${t}`);
}
const Qn = (e) => String(e).padStart(2, "0");
function Lh(e) {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : `${Qn(t.getHours())}:${Qn(t.getMinutes())}:${Qn(t.getSeconds())}`;
}
const Nh = (e) => e.action === "set" ? `set ${e.value ?? ""}`.trim() : e.action;
function Th(e) {
  return e.status === "error" ? e.reason === "unavailable" ? f("output.errorUnavailable").replace("{entities}", (e.entities ?? []).join(", ")) : f("output.errorNotConfigured") : e.last ? f("output.last").replace("{event}", Nh(e.last)).replace("{time}", Lh(e.last.at)) : f("output.none");
}
function zh(e, t) {
  if (!ie(t.props.kind)) return v;
  const n = e.feed.stateOf(t), i = n ? Th(n) : e.feed.error ?? (e.feed.ready ? f("output.notSaved") : null);
  return i === null ? v : b`<p class="note" data-field="output">${i}</p>`;
}
function Dh(e, t, n, i) {
  const s = Lr(e.meta, i, e.states), o = Ga(e.level, t, n);
  return b`
    ${s === "missing" ? b`<p class="warn" data-note="missing">${f("binding.missing")}</p>` : v}
    ${s === "unavailable" ? b`<p class="note" data-note="unavailable">${f("binding.unavailable")}</p>` : v}
    ${o.length ? b`<p class="note" data-note="also">${f("binding.alsoBound").replace("{names}", o.map((r) => r.name).join(", "))}</p>` : v}`;
}
function Rh(e, t, n) {
  var a;
  const { role: i } = n, s = ((a = t.bindings) == null ? void 0 : a[i]) ?? null, o = !!e.showAll[i], r = Ch(t, i);
  return b`<div class="role" data-role=${i}>
    <div class="role-head">
      <span class="role-label">${r}</span>
      <label class="showall"><input type="checkbox" data-showall=${i} .checked=${o}
        @change=${() => e.onShowAll(i)} />${f("binding.showAll")}</label>
    </div>
    <ps-entity-combo data-role=${i} .meta=${e.meta} .states=${e.states} .items=${ca(e.meta, n, o)} .value=${s}
      .label=${r} @value-changed=${(l) => {
    l.stopPropagation();
    const d = Po(e.level, t.id, i, l.detail.value);
    d !== e.level && e.commit(d);
  }}></ps-entity-combo>
    ${t.props.kind === "smart_button" && _i(i) ? Ih(e, t, i) : v}
    ${s ? Dh(e, t, i, s) : v}
  </div>`;
}
function Bh(e) {
  const t = e.device, n = Ai(e.level.devices.map(e.status));
  return b`<div class="props bprops">
    ${e.notice ? b`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : v}
    ${e.fieldNotice ? b`<p class="warn" data-notice="field" role="alert">${e.fieldNotice}</p>` : v}
    ${e.registryError ? b`<div class="reg-error" data-notice="registry"><p class="warn">${e.registryError}</p>
      <button class="btn" data-action="retry-registry" ?disabled=${e.registryLoading}
        @click=${() => e.onRetry()}>${f(e.registryLoading ? "load.loading" : "action.retry")}</button></div>` : v}
    ${t ? b`
      <h4>${f(`device.${t.props.kind}`)}</h4>
      ${aa(t, (i) => e.commit(mn(e.level, t.id, {}, i)))}
      ${zh(e, t)}
      ${Vt(t).map((i) => b`${Rh(e, t, i)}${Ph(e, t, i.role)}`)}
      ${Oh(t)}` : b`<p class="muted">${f("binding.pick")}</p>`}
    <div class="bfoot">
      <span>${f("binding.notBound").replace("{n}", String(n))}</span>
      <button class="btn" data-action="next-unbound" @click=${() => e.onNextUnbound()}>${f("steps.nextUnbound")}</button>
    </div>
    <button class="btn reload" data-action="reload-registries" ?disabled=${e.registryLoading}
      @click=${() => e.onRetry()}>${f("binding.reload")}</button>
  </div>`;
}
const yi = (e) => f(`zones.kind.${e.shape.kind}`);
function ha(e, t) {
  const n = gr(e, t);
  return n ? f(`zones.invalid.${n}`) : null;
}
const Hh = /* @__PURE__ */ new WeakMap();
function Fh(e) {
  return dt(Hh, e, (t) => new Map(F(t).map((n) => [n.id, zi(t, n.id).filter((i) => i.participates).length])));
}
function Uh(e) {
  var o;
  const t = Fh(e.level), n = e.query.trim().toLowerCase(), i = ((o = e.selection) == null ? void 0 : o.kind) === "automationZone" ? e.selection.id : null, s = F(e.level).map((r, a) => ({ z: r, hue: rn[a % rn.length] })).filter(({ z: r }) => !n || r.name.toLowerCase().includes(n) || yi(r).toLowerCase().includes(n));
  return b`
    <div class="zlist">
      <div class="ztools">${ea("zones", e.toolId, e.onTool)}</div>
      <input class="list-search" type="search" data-field="zone-filter" placeholder=${f("zones.filter")}
        aria-label=${f("zones.filter")} .value=${W(e.query)}
        @input=${(r) => e.onQuery(r.target.value)} />
      <div class="rows">
        ${s.map(({ z: r, hue: a }) => {
    const l = r.invalid ? ha(e.level, r) ?? "" : null;
    return b`<button class="zrow${r.id === i ? " sel" : ""}" data-id=${r.id} @click=${() => e.onPick(r.id)}>
            ${l === null ? b`<span class="zswatch" style=${`background:${a}`}></span>` : b`<span class="zswatch zinvalid" role="img" aria-label=${l} title=${l}></span>`}
            <span class="nm"><span class="name">${r.name}</span><small class="kind">${yi(r)}</small></span>
            <span class="zcount" title=${f("zones.members")}>${t.get(r.id) ?? 0}</span>
          </button>`;
  })}
      </div>
    </div>`;
}
function Vh(e, t) {
  const n = zi(e.level, t.id);
  return b`<div class="zmembers">
    <div class="zhead"><span>${f("zones.members")}</span>${n.length ? b`<span>${f("zones.participates")}</span>` : v}</div>
    ${n.length === 0 ? b`<p class="muted">${f("zones.noMembers")}</p>` : n.map(({ device: i, participates: s }) => b`
      <label class="member" data-device=${i.id}>
        <span class="nm"><span class="name">${i.name}</span><small class="kind">${f(`device.${i.props.kind}`)}</small></span>
        <input type="checkbox" data-field="participates" aria-label=${f("zones.participates")} .checked=${da(s)}
          @change=${(o) => {
    const r = _r(e.level, i.id, t.id, o.target.checked);
    r !== e.level && e.commit(r);
  }} />
      </label>`)}
  </div>`;
}
function jh(e, t) {
  var o;
  const n = t.shape, i = n.kind === "room" ? ((o = e.level.zones.find((r) => r.id === n.roomId)) == null ? void 0 : o.name) ?? "—" : null, s = ha(e.level, t);
  return b`
    <h4>${f("zones.default")}</h4>
    ${I(f("props.name"), b`<input class="val wide" type="text" data-field="zone-name" .value=${W(t.name)}
      @change=${(r) => {
    const a = r.target, l = a.value.trim();
    if (!l || l === t.name) {
      a.value = t.name;
      return;
    }
    e.commit(xc(e.level, t.id, l));
  }} />`)}
    ${I(f("props.kind"), b`<span class="val ro" data-field="zone-kind">${yi(t)}</span>`)}
    ${i === null ? v : I(f("zones.room"), b`<span class="val ro" data-field="zone-room">${i}</span>`)}
    ${s ? b`<p class="warn" data-note="zone-invalid">${s}</p>` : v}
    ${Vh(e, t)}
    <button class="btn danger" data-action="delete-zone" @click=${() => e.commit(Mr(e.level, t.id))}>
      ${f("zones.delete")}</button>`;
}
function Wh(e) {
  const t = e.selection, n = F(e.level), i = (t == null ? void 0 : t.kind) === "automationZone" ? n.find((s) => s.id === t.id) ?? null : null;
  return b`<div class="props zprops">
    ${i ? jh(e, i) : b`
      <p class="muted">${f("zones.hint")}</p>
      <p class="muted" data-note="zone-count">${qt(n.length, "steps.zone", "steps.zones")}</p>`}
    ${e.notice ? b`<p class="warn">${e.notice}</p>` : v}
  </div>`;
}
const fa = { domains: ["sensor"], deviceClasses: ["voltage"], units: ["V"] }, Zh = { domains: ["sensor"], deviceClasses: ["battery"], units: ["%"] }, qh = { domains: ["switch"] }, Gh = 6, Kh = ["A", "0", "B"], Yh = ["power", "control"];
function mt(e, t, n, i) {
  const { [n]: s, ...o } = t, r = i === null ? o : { ...o, [n]: i };
  e.commitPower({ ...e.power, blocks: e.power.blocks.map((a) => a.id === t.id ? r : a) });
}
function _t(e, t, n, i, s, o) {
  return b`<div class="role">
    <div class="role-head"><span class="role-label" data-label=${t}>${n}</span></div>
    <ps-entity-combo data-field=${t} .meta=${e.meta} .states=${e.states} .items=${ca(e.meta, i, !1)}
      .value=${s ?? null} .label=${n} @value-changed=${(r) => {
    r.stopPropagation();
    const a = r.detail.value || null;
    a !== (s ?? null) && o(a);
  }}></ps-entity-combo>
  </div>`;
}
function ma(e, t, n, i) {
  return b`<div class="cflag">${I(t, b`<input type="checkbox" data-field=${e} .checked=${W(n)}
    @change=${(s) => i(s.target.checked)} />`)}</div>`;
}
function Xh(e, t) {
  const n = t.name ?? "";
  return I(f("props.name"), b`<input class="val wide" type="text" data-field="name"
    placeholder=${f(`power.kind.${t.kind}`)} .value=${W(n)} @change=${(i) => {
    const s = i.target, o = s.value.trim();
    o && o !== n ? e.commitPower(Se(e.power, t.id, { name: o })) : s.value = n;
  }} />`);
}
function Qh(e, t) {
  const n = new Set(Vt(t).map((i) => i.role));
  return b`${Yh.filter((i) => n.has(i)).map((i) => {
    var o;
    const s = (o = t.bindings) == null ? void 0 : o[i];
    return b`<div class="role">
      <div class="role-head"><span class="role-label">${f(`role.${i}`)}</span></div>
      <div class="bound" data-bound=${i}>${s ? b`<b>${Ge(e.meta, s).name}</b><small>${s}</small>` : "—"}</div>
    </div>`;
  })}
  <p class="note" data-note="bound-hint">${f("power.boundHint")}</p>`;
}
function Jh(e, t) {
  const n = e.level.devices.find((i) => i.id === t.deviceId);
  return b`
    ${I(f("props.name"), b`<span class="val ro" data-field="device-name">${(n == null ? void 0 : n.name) ?? "—"}</span>`)}
    ${n ? b`${I(f("props.kind"), b`<span class="val ro">${f(`device.${n.props.kind}`)}</span>`)}${Qh(e, n)}` : b`<p class="warn" data-note="device-missing">${f("power.missing")}</p>`}
    ${ma("inverter", f("power.inverter"), !!t.inverter, (i) => e.commitPower(Se(e.power, t.id, { inverter: i })))}`;
}
function tf(e, t) {
  const n = t.switch;
  return b`
    ${_t(e, "power", f("power.field.power"), Xt, t.power, (i) => mt(e, t, "power", i))}
    ${_t(e, "voltage", f("power.field.voltage"), fa, t.voltage, (i) => mt(e, t, "voltage", i))}
    ${_t(
    e,
    "switch",
    f("power.field.switch"),
    qh,
    n == null ? void 0 : n.entity,
    (i) => mt(e, t, "switch", i ? { entity: i, controllable: (n == null ? void 0 : n.controllable) ?? !1 } : null)
  )}
    ${n ? ma(
    "controllable",
    f("power.controllable"),
    n.controllable,
    (i) => mt(e, t, "switch", { ...n, controllable: i })
  ) : v}`;
}
function ef(e, t) {
  var s, o;
  const n = (o = (s = e.frame) == null ? void 0 : s.blocks[t.id]) == null ? void 0 : o.position, i = ["2in1out", "1in2out"].map((r) => ({ v: r, label: f(`power.form.${r}`) }));
  return b`
    ${I(f("power.form"), G(t.form, i, (r) => {
    r !== t.form && e.commitPower(Se(e.power, t.id, { form: r }));
  }, "form"))}
    <div class="row"><span>${f("power.position")}</span><span class="seg pos">${Kh.map((r) => b`
      <button class=${r === n ? "on" : ""} data-position=${r} @click=${() => e.setPosition(t.id, r)}>${r}</button>`)}
    </span></div>
    <p class="note">${f("power.positionHint")}</p>`;
}
function nf(e, t) {
  const n = t.w >= t.h, i = n ? t.w : t.h, s = n ? t.h : t.w, o = (l, d) => {
    if (l === i && d === s) return !1;
    e.commitPower(Se(e.power, t.id, n ? { w: l, h: d } : { w: d, h: l }));
  }, r = (l, d, u) => Lt({ value: d, rule: { min: 1 }, bad: "props.badNumber", field: l, skipSame: !0, apply: u }), a = ["h", "v"].map((l) => ({ v: l, label: f(`power.orientation.${l}`) }));
  return b`
    ${I(f("power.orientation"), G(n ? "h" : "v", a, (l) => {
    l !== (n ? "h" : "v") && e.commitPower(Se(e.power, t.id, { w: t.h, h: t.w }));
  }, "bus-orientation"))}
    ${I(f("power.busLength"), r("bus-length", i, (l) => o(Math.max(mi, s + 1, l), s)))}
    ${I(f("power.busThickness"), r("bus-thickness", s, (l) => o(i, Math.min(Math.max(Gh, l), i - 1))))}`;
}
function sf(e, t) {
  switch (t.kind) {
    case "grid":
      return b`
      ${_t(e, "power", f("power.field.power"), Xt, t.power, (n) => mt(e, t, "power", n))}
      ${_t(e, "voltage", f("power.field.voltage"), fa, t.voltage, (n) => mt(e, t, "voltage", n))}`;
    case "device":
      return Jh(e, t);
    case "meter":
      return tf(e, t);
    case "battery":
      return b`
      ${_t(e, "power", f("power.field.batteryPower"), Xt, t.power, (n) => mt(e, t, "power", n))}
      ${_t(e, "soc", f("power.field.soc"), Zh, t.soc, (n) => mt(e, t, "soc", n))}`;
    case "pv":
      return _t(e, "power", f("power.field.power"), Xt, t.power, (n) => mt(e, t, "power", n));
    case "transfer":
      return ef(e, t);
    case "bus":
      return nf(e, t);
    default:
      return v;
  }
}
function of(e, t) {
  const n = !!t.portPins && Object.keys(t.portPins).length > 0;
  return b`
    <h4>${f(`power.title.${t.kind}`)}</h4>
    ${t.kind === "device" ? v : Xh(e, t)}
    ${sf(e, t)}
    <div class="pactions">
      ${n ? b`<button class="btn" data-action="auto-ports"
        @click=${() => e.commitPower(Zc(e.power, t.id))}>${f("power.autoPorts")}</button>` : v}
      ${t.kind === "grid" ? v : b`<button class="btn danger" data-action="delete-block"
        @click=${() => e.commitPower(zr(e.power, t.id))}>${f("action.delete")}</button>`}
    </div>`;
}
function rf(e, t) {
  var s, o;
  const n = { device: (r) => e.level.devices.find((a) => a.id === r) }, i = (r) => {
    const a = e.power.blocks.find((d) => d.id === ("block" in r ? r.block : r.bus)), l = a ? Ri(a, n) || f(`power.kind.${a.kind}`) : "—";
    return "block" in r ? `${l} · ${r.port}` : l;
  };
  return b`
    <h4>${f("power.wire")}</h4>
    ${I(f("power.wire.from"), b`<span class="val ro wide" data-field="wire-from">${i(t.from)}</span>`)}
    ${I(f("power.wire.to"), b`<span class="val ro wide" data-field="wire-to">${i(t.to)}</span>`)}
    ${I(f("power.wire.power"), b`<span class="val ro" data-field="wire-power">${hi((o = (s = e.frame) == null ? void 0 : s.wires[t.id]) == null ? void 0 : o.power)}</span>`)}
    <div class="pactions"><button class="btn danger" data-action="delete-wire"
      @click=${() => e.commitPower(Dr(e.power, t.id))}>${f("action.delete")}</button></div>`;
}
function af(e) {
  const t = Rr(e.level, e.power);
  return b`
    <p class="muted" data-note="power-hint">${f("power.help.device")}</p>
    ${t.length === 0 ? b`<p class="muted" data-note="no-devices">${f("power.noDevices")}</p>` : b`<div class="pdevs">
      ${t.map((n) => b`<button class="pdev${n.id === e.placeDeviceId ? " sel" : ""}" data-place-device=${n.id}
        aria-pressed=${n.id === e.placeDeviceId ? "true" : "false"} @click=${() => e.onPlaceDevice(n.id)}>
        <span class="name">${n.name}</span><span class="kind">${f(`device.${n.props.kind}`)}</span>
      </button>`)}
    </div>`}`;
}
function lf(e) {
  if (e.toolId === "power-device") return af(e);
  const t = e.selection, n = (t == null ? void 0 : t.kind) === "powerBlock" ? e.power.blocks.find((s) => s.id === t.id) : void 0;
  if (n) return of(e, n);
  const i = (t == null ? void 0 : t.kind) === "powerWire" ? e.power.wires.find((s) => s.id === t.id) : void 0;
  return i ? rf(e, i) : e.toolId !== "power-select" ? b`<p class="muted" data-note="power-hint">${f("power.help.place")}</p>` : b`<p class="muted" data-note="power-hint">${f("power.pick")}</p><p class="muted">${f("power.help.select")}</p>`;
}
function cf(e) {
  return b`<div class="props pprops">
    ${e.notice ? b`<p class="warn" data-notice="session" role="alert">${e.notice}</p>` : v}
    ${e.feedError ? b`<p class="note" data-notice="feed">${e.feedError}</p>` : v}
    ${lf(e)}
  </div>`;
}
function df(e, t) {
  return e.mode === "zones" ? Uh({
    level: t,
    selection: e.selection,
    toolId: e.toolId,
    query: e.zoneQuery,
    onTool: (n) => e.pickTool(n),
    onQuery: (n) => {
      e.zoneQuery = n;
    },
    onPick: (n) => e.pickZone(n)
  }) : e.mode !== "binding" ? Pp(e.mode, e.toolId, (n) => e.pickTool(n)) : Rp({
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
function uf(e, t) {
  var i;
  const n = e.selection;
  return Bh({
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
function pf(e, t) {
  var i;
  if (e.mode === "binding") return uf(e, t);
  if (e.mode === "power")
    return cf({
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
      commitPower: (s) => e.commitPower(s),
      setPosition: (s, o) => e.setPowerPosition(s, o)
    });
  if (e.mode === "zones") return Wh({ level: t, selection: e.selection, notice: e.notice, commit: (s) => e.commit(s) });
  const n = {
    level: t,
    selection: e.selection,
    notice: e.notice,
    commit: (s) => e.commit(s),
    setNotice: (s) => {
      e.notice = s;
    }
  };
  return e.mode === "equipment" ? sh({ ...n, toolId: e.toolId, nextProps: e.nextProps, setNextProps: (s) => {
    e.nextProps = s;
  } }) : ch({
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
function hf(e) {
  return b`
    <div class="status">
      ${e.binding ? v : b`
        <span><span class="kbd">Shift</span> ${f("hint.shift")}</span>
        <span><span class="kbd">${f("hint.digits")}</span> ${f("hint.length")}</span>
        <span><span class="kbd">Tab</span> ${f("hint.tab")}</span>`}
      <span><span class="kbd">Esc</span> ${f(e.binding ? "hint.deselect" : "hint.esc")}</span>
      <span class="sp"></span>
      ${e.snap ? b`<span class="snap-kind">${e.snap}</span>` : ""}
      <span>${e.zoomPct}%</span>
      <label class="grid-toggle">
        <input type="checkbox" .checked=${e.grid} @change=${(t) => e.onGrid(t.target.checked)} />
        ${f(e.power ? "status.gridSchematic" : "status.grid")}
      </label>
      ${e.power ? v : b`<label class="grid-toggle">
        <input type="checkbox" data-toggle="cones" .checked=${e.cones}
          @change=${(t) => e.onCones(t.target.checked)} />
        ${f("status.cones")}
      </label>`}
    </div>`;
}
function ff(e, t) {
  var o, r;
  const n = t.palette, i = 1 / t.scale, s = [
    {
      label: f(t.mode === "box" ? "tracker.width" : "tracker.length"),
      buf: e.first,
      live: ((o = t.live) == null ? void 0 : o.first) ?? "",
      active: e.field === "first",
      unit: f("unit.mm")
    },
    {
      label: f(t.mode === "box" ? "tracker.depth" : "tracker.angle"),
      buf: e.second,
      live: ((r = t.live) == null ? void 0 : r.second) ?? "",
      active: e.field === "second",
      unit: t.mode === "box" ? f("unit.mm") : "°"
    }
  ];
  return A`
    <g class="tracker" transform=${`translate(${e.at.x + 18 * i} ${e.at.y + 18 * i}) scale(${i})`}
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
function mf(e, t, n, i) {
  const s = e.walls;
  if (!s || s.length === 0) return null;
  if (t === "wall") {
    const { a: l, b: d } = s[0], u = Math.hypot(d.x - l.x, d.y - l.y);
    let c = Math.atan2(-(d.y - l.y), d.x - l.x) * 180 / Math.PI;
    return c < 0 && (c += 360), { first: Rt(u), second: c.toFixed(1) };
  }
  if (s.length < 2) return null;
  const o = n === "inner" ? -i : n === "outer" ? i : 0, r = Math.hypot(s[0].b.x - s[0].a.x, s[0].b.y - s[0].a.y) + o, a = Math.hypot(s[1].b.x - s[1].a.x, s[1].b.y - s[1].a.y) + o;
  return { first: Rt(r), second: Rt(a) };
}
function gf(e) {
  return Object.entries(e).filter(([, t]) => typeof t == "string").map(([t, n]) => `--ps-${t}:${n}`).join(";");
}
const wf = xo`
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
  /* Power properties: the Plan device tool's device list, read-only bindings, the action buttons. */
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
`, yf = 5e-3, bf = 2, cn = (e) => Math.max(yf, Math.min(bf, e));
function vf(e, t, n) {
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
function $f(e, t, n) {
  if (e.length === 0) return { x: -1e3, y: -1e3, scale: cn(Math.min(t, n) / 12e3) };
  const i = e.map((c) => c.x), s = e.map((c) => c.y), o = 1500, r = Math.min(...i) - o, a = Math.max(...i) + o, l = Math.min(...s) - o, d = Math.max(...s) + o, u = cn(Math.min(t / (a - r), n / (d - l)));
  return { x: (r + a) / 2 - t / u / 2, y: (l + d) / 2 - n / u / 2, scale: u };
}
function xf(e, t, n, i, s) {
  const o = cn(Math.min(s, t / (e.w + 2 * i), n / (e.h + 2 * i)));
  return { x: e.x + e.w / 2 - t / o / 2, y: e.y + e.h / 2 - n / o / 2, scale: o };
}
function kf(e, t, n) {
  const i = cn(e.scale * Math.exp(-n * 15e-4));
  return { x: t.x - (t.x - e.x) * e.scale / i, y: t.y - (t.y - e.y) * e.scale / i, scale: i };
}
function Mf(e, t, n) {
  return { ...e, x: e.x - t / e.scale, y: e.y - n / e.scale };
}
function go(e, t, n, i) {
  const s = n / e.scale, o = i / e.scale;
  return t.x >= e.x && t.x <= e.x + s && t.y >= e.y && t.y <= e.y + o ? e : { ...e, x: t.x - s / 2, y: t.y - o / 2 };
}
function _f(e, t, n, i, s = 1) {
  const o = 1e3 * s, r = 100 * s * e.scale >= 6 ? 100 * s : o, a = 1 / e.scale;
  return A`
    <defs>
      <pattern id="grid-minor" patternUnits="userSpaceOnUse" width=${r} height=${r}>
        <path d=${`M${r} 0H0V${r}`} fill="none" stroke=${i.grid} stroke-width=${a}></path></pattern>
      <pattern id="grid-major" patternUnits="userSpaceOnUse" width=${o} height=${o}>
        <rect width=${o} height=${o} fill="url(#grid-minor)"></rect>
        <path d=${`M${o} 0H0V${o}`} fill="none" stroke=${i.gridMajor} stroke-width=${a}></path></pattern>
    </defs>
    <rect x=${e.x} y=${e.y} width=${t} height=${n} fill="url(#grid-major)" pointer-events="none"></rect>`;
}
const Af = ["Shift", "Control", "Alt", "Meta"], Sf = {
  plan: "select",
  equipment: "device-select",
  zones: "zones-select",
  power: "power-select"
};
function wo(e) {
  const t = e.composedPath()[0];
  return !!t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName);
}
class Ef {
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
        this.h.view = Mf(this.h.view, n.clientX - this.panFrom.x, n.clientY - this.panFrom.y), this.panFrom = { x: n.clientX, y: n.clientY };
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
      n.preventDefault(), this.h.view = kf(this.h.view, this.h.toMm(n), n.deltaY);
    }, this.keyDown = (n) => {
      if (this.h.dialog !== null) {
        n.key === "Escape" && (n.preventDefault(), this.h.dialog = null);
        return;
      }
      if (wo(n) || !this.h.history) return;
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
        const r = Sf[this.h.mode];
        r && this.h.toolId !== r ? this.h.pickTool(r) : (this.h.activeTool.cancel(), this.h.selection = null), o = !0;
      }
      o && n.preventDefault(), this.h.requestUpdate();
    }, this.keyUp = (n) => {
      const i = this.h.dialog !== null || wo(n), s = { shift: n.shiftKey };
      if (n.key === " ") {
        this.spaceDown = !1;
        const o = this.spacePending;
        this.spacePending = !1, o && !i && (this.h.activeTool.key(" ", s), this.h.requestUpdate());
        return;
      }
      i || !Af.includes(n.key) || (this.h.activeTool.key(n.key, s), this.h.requestUpdate());
    }, this.blur = () => {
      this.spaceDown = !1, this.spacePending = !1;
    };
  }
  toolEvent(t) {
    return { pt: this.h.toMm(t), shift: t.shiftKey, alt: t.altKey, ctrl: t.ctrlKey || t.metaKey };
  }
}
function ga(e) {
  try {
    return new Date(e).toLocaleString();
  } catch {
    return new Date(e).toISOString();
  }
}
function If(e) {
  return b`
    <div class="draft-banner" role="status">
      <span>${f("draft.banner").replace("{time}", ga(e.savedAt))}</span>
      <button class="btn primary" data-action="banner-restore" @click=${e.onRestore}>${f("draft.restore")}</button>
      <button class="btn" data-action="banner-discard" @click=${e.onDiscard}>${f("draft.discard")}</button>
    </div>`;
}
function fe(e, t, n, i) {
  return b`
    <div class="backdrop">
      <div class="dialog" role="dialog" aria-modal="true">
        <h3>${e}</h3>
        <p>${t}</p>
        ${i ? b`<p class="muted">${i}</p>` : v}
        <div class="actions">
          ${n.map((s) => b`<button class="btn${s.primary ? " primary" : ""}" data-action=${s.action}
            ?disabled=${s.disabled ?? !1} @click=${s.onClick}>${s.label}</button>`)}
        </div>
      </div>
    </div>`;
}
function Pf(e) {
  var n;
  const t = { action: "cancel", label: f("action.cancel"), onClick: e.close };
  switch ((n = e.dialog) == null ? void 0 : n.kind) {
    case "restore": {
      const i = e.draft;
      return i ? fe(f("draft.title"), f("draft.text").replace("{time}", ga(i.savedAt)), [
        { action: "restore", label: f("draft.restore"), primary: !0, onClick: () => e.restore(i) },
        { action: "discard", label: f("draft.discard"), onClick: () => e.discard(i) }
      ]) : v;
    }
    case "new":
      return fe(f("new.title"), f("new.text"), [
        { action: "new-discard", label: f("new.discard"), primary: !0, onClick: e.startNew },
        { ...t, action: "new-cancel" }
      ]);
    case "delete":
      return fe(f("delete.title"), f("delete.text").replace("{name}", e.planName), [
        { action: "delete-confirm", label: f("delete.confirm"), primary: !0, onClick: e.confirmDelete },
        { ...t, action: "delete-cancel" }
      ]);
    case "switch":
      return fe(f("switch.title"), f("switch.text"), [
        { action: "switch-discard", label: f("switch.discard"), primary: !0, onClick: e.confirmSwitch },
        { ...t, action: "switch-cancel" }
      ]);
    case "conflict":
    case "conflict-again": {
      const i = e.dialog.kind === "conflict-again";
      return fe(f("conflict.title"), f(i ? "conflict.again" : "conflict.text"), [
        ...i ? [] : [{ action: "overwrite", label: f("conflict.overwrite"), disabled: e.saving, onClick: e.overwrite }],
        { action: "save-as-new", label: f("conflict.saveAsNew"), primary: !0, disabled: e.saving, onClick: e.saveAsNew },
        t
      ], e.message);
    }
    default:
      return v;
  }
}
const me = "plan_studio.draft.", Ue = "plan_studio.lastPlanId";
function Of() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
function Cf(e) {
  const t = e;
  return !!t && typeof t == "object" && typeof t.planId == "string" && typeof t.savedAt == "number" && (t.baseRevision === null || typeof t.baseRevision == "number") && !!t.plan && typeof t.plan == "object" && Array.isArray(t.plan.levels) && t.plan.levels.length > 0;
}
class Lf {
  constructor(t = Of, n = 500) {
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
      (n = this.storage()) == null || n.setItem(me + t.planId, JSON.stringify(t));
    } catch {
    }
  }
  read(t) {
    var n;
    try {
      const i = (n = this.storage()) == null ? void 0 : n.getItem(me + t), s = i ? JSON.parse(i) : null;
      return Cf(s) && s.planId === t ? s : null;
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
        if (!(s != null && s.startsWith(me))) continue;
        const o = this.read(s.slice(me.length));
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
      return ((t = this.storage()) == null ? void 0 : t.getItem(Ue)) ?? null;
    } catch {
      return null;
    }
  }
  setLastPlanId(t) {
    var n;
    try {
      (n = this.storage()) == null || n.setItem(Ue, t);
    } catch {
    }
  }
  clearLastPlanId(t) {
    try {
      const n = this.storage();
      (n == null ? void 0 : n.getItem(Ue)) === t && n.removeItem(Ue);
    } catch {
    }
  }
  clear(t) {
    var n;
    try {
      (n = this.storage()) == null || n.removeItem(me + t);
    } catch {
    }
  }
  cancelTimer() {
    this.timer !== null && clearTimeout(this.timer), this.timer = null;
  }
}
const wa = 5e3, ya = 12, Nf = 3e3;
function yo(e) {
  e().catch(() => {
  });
}
class Tf {
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
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, t && n.unsub && yo(n.unsub));
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
          yo(s);
          return;
        }
        i.unsub = s, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (s) => {
        i.live && (i.live = !1, this.sub = null, this.setFailure(wt(s)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= ya || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, wa));
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
        const a = (s = (i = this.map.get(o)) == null ? void 0 : i.last) == null ? void 0 : s.at;
        this.map.set(o, r), r.last && r.last.at !== a && this.startFlash(o, r.last);
      }
    this.host.requestUpdate();
  }
  /** Shows `last` on the container's badge for FLASH_MS, replacing (and restarting) any intent shown there. */
  startFlash(t, n) {
    const i = this.flashes.get(t);
    i && clearTimeout(i.timer);
    const s = setTimeout(() => {
      this.flashes.delete(t), this.host.requestUpdate();
    }, Nf), o = n.value === void 0 ? { action: n.action } : { action: n.action, value: n.value };
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
const zf = 300;
function bo(e) {
  e().catch(() => {
  });
}
function Df(e, t) {
  const n = new Map(t.devices.map((s) => [s.id, s])), i = {};
  for (const s of e.blocks) {
    const o = s.kind === "device" ? n.get(s.deviceId) : void 0;
    if (!o) continue;
    const { power: r, control: a } = o.bindings ?? {};
    i[o.id] = { ...r ? { power: r } : {}, ...a ? { control: a } : {} };
  }
  return { power: e, devices: i };
}
class Rf {
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
      }, zf);
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
      this.setFailure(f("output.noLive"));
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
    this.sub = null, n && (n.live = !1, t && n.unsub && bo(n.unsub));
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
          bo(o);
          return;
        }
        s.unsub = o, this.retries = 0, this.failure !== null && this.setFailure(null);
      },
      (o) => {
        s.live && (s.live = !1, this.sub = null, this.current = null, this.setFailure(wt(o)), this.scheduleRetry());
      }
    );
  }
  scheduleRetry() {
    this.retries >= ya || (this.retryTimer = setTimeout(() => {
      this.retryTimer = null, this.retries++, this.subscribe();
    }, wa));
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
var Bf = Object.defineProperty, D = (e, t, n, i) => {
  for (var s = void 0, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (s = r(t, n, s) || s);
  return s && Bf(t, n, s), s;
};
const Yi = class Yi extends Yt {
  constructor() {
    super(), this.narrow = !1, this.plan = null, this.loadError = null, this.selection = null, this.toolId = "select", this.wallType = "bearing", this.thickness = Xa.bearing, this.boxMeasure = "inner", this.grid = !0, this.mode = "plan", this.bindFilter = "unbound", this.bindQuery = "", this.railCollapsed = !1, this.showAll = {}, this.zoneQuery = "", this.cones = !0, this.nextProps = Gp(), this.nextObj = Bp(), this.planView = { x: -1e3, y: -1e3, scale: 0.08 }, this.powerView = { x: -40, y: -40, scale: 1 }, this.placeDeviceId = null, this.size = { w: 0, h: 0 }, this.dialog = null, this.notice = null, this.fieldNotice = null, this.pendingDraft = null, this.plans = [], this.deleting = !1, this.history = null, this.lazyPower = Nr(), this.loading = !1, this.needFit = !1, this.needPowerFit = !1, this.drafts = new Lf(), this.resizeObs = null, this.session = new jp(this), this.haMeta = new Wp(this), this.feed = new Tf(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.powerFeed = new Rf(this, () => {
      var i;
      return (i = this.hass) == null ? void 0 : i.connection;
    }), this.bindStatus = (i) => Wa(i, (s) => {
      var o;
      return Lr(this.haMeta.get(), s, (o = this.hass) == null ? void 0 : o.states);
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
    this.save = new bd(n, () => {
      this.save.dirty && this.plan && !this.session.draftBlocked() && this.drafts.schedule(() => this.session.makeDraft()), this.requestUpdate();
    }), this.ctx = Zp(this), this.activeTool = gi("select", this.ctx), this.input = new Ef(this);
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
    this.powerFeed.watch(t && this.plan ? this.plan.id : null, t ? Df(this.power, t) : null);
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
  commit(t) {
    this.history && (this.history.push({ ...this.history.current, level: t }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  commitPower(t) {
    this.history && (this.history.push({ ...this.history.current, power: t }), this.save.markDirty(), this.dropStaleSelection(), this.requestUpdate());
  }
  dropStaleSelection() {
    this.history && this.selection && !Gn(this.history.current.level, this.selection, this.power) && (this.activeTool.cancel(), this.selection = null, this.fieldNotice = null);
  }
  /**
   * Delete/Backspace: remove the selected element (commit() drops the tool state and the selection). Not in the
   * Binding step; the Zones step deletes an automation zone only, and no other step deletes one; the Power step
   * deletes power blocks and wires only.
   */
  deleteSelection() {
    const t = this.selection, n = this.level;
    return this.mode === "binding" || !t || !n || t.kind === "node" || !Gn(n, t, this.power) ? !1 : this.mode === "power" ? this.deletePower(t) : t.kind === "powerBlock" || t.kind === "powerWire" || this.mode === "zones" != (t.kind === "automationZone") ? !1 : (this.commit(t.kind === "wall" ? Di(n, t.id) : t.kind === "opening" ? tr(n, t.id) : t.kind === "device" ? sr(n, t.id) : t.kind === "automationZone" ? Mr(n, t.id) : qo(n, t.id)), !0);
  }
  /** Power step: the selected wire, or the selected block with its wires; the grid source stays (with a notice). */
  deletePower(t) {
    const n = this.power;
    if (t.kind === "powerWire")
      return this.commitPower(Dr(n, t.id)), !0;
    if (t.kind !== "powerBlock") return !1;
    const i = zr(n, t.id);
    return i === n ? this.notice = f("power.gridKeep") : this.commitPower(i), !0;
  }
  /** Sets a transfer switch position live on the server (not saved with the plan); a failure shows as the notice. */
  setPowerPosition(t, n) {
    this.powerFeed.setPosition(t, n).catch((i) => {
      this.notice = wt(i);
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
    this.selection = this.mode === "binding" && n && i && Gn(i, n, this.power) ? n : null, this.selection || (this.fieldNotice = null), this.requestUpdate();
  }
  /** Wall type for the next wall; the thickness is independent and stays as it is. */
  setWallType(t) {
    this.wallType = t;
  }
  pickTool(t) {
    this.activeTool.cancel(), this.selection = null, this.notice = null, this.fieldNotice = null, t === "box" && (this.wallType = "bearing"), this.toolId = t, this.activeTool = gi(t, this.ctx);
  }
  /**
   * Power step device list: arms a plan device for the Plan device tool (activated when another tool is on), so the
   * next canvas click places it; the "pick a device first" notice goes. The arm stays across tool switches; a
   * placement, leaving the step or opening another plan clears it.
   */
  armDevice(t) {
    this.toolId !== "power-device" && this.pickTool("power-device"), this.placeDeviceId = t, this.notice = null;
  }
  /** Wizard step switch: cancels the tool, clears the selection, activates the step's first tool. */
  setMode(t) {
    t !== this.mode && (this.mode === "power" && (this.placeDeviceId = null), this.mode = t, this.pickTool(qi(t)[0]), (t === "binding" || t === "power") && this.haMeta.enter());
  }
  /** Selects a device (binding list, Next unbound device) and pans the plan to it when it is off-screen. */
  pickDevice(t) {
    const n = this.level, i = n == null ? void 0 : n.devices.find((o) => o.id === t);
    if (!n || !i) return;
    this.ctx.select({ kind: "device", id: t });
    const s = X(n, i);
    s && (this.view = go(this.view, s.pt, this.size.w, this.size.h));
  }
  /** Selects an automation zone (zone list) and pans the plan to its label when it is off-screen. */
  pickZone(t) {
    const n = this.level, i = n ? F(n).find((s) => s.id === t) : void 0;
    !n || !i || (this.ctx.select({ kind: "automationZone", id: t }), this.view = go(this.view, yr(Ct(n, i)), this.size.w, this.size.h));
  }
  nextUnboundDevice() {
    var i;
    const t = this.level, n = t ? Tp(t, ((i = this.selection) == null ? void 0 : i.kind) === "device" ? this.selection.id : null, this.bindStatus) : null;
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
    return vf(this.svgEl(), this.view, t);
  }
  fit() {
    var t;
    this.planView = $f(((t = this.level) == null ? void 0 : t.nodes) ?? [], this.size.w, this.size.h);
  }
  /** The whole schematic with a 40-unit margin, at most 150 %. */
  fitPower() {
    const t = fd(this.power, this.ctx.geo());
    t && (this.powerView = xf(t, this.size.w, this.size.h, 40, 1.5));
  }
  // ---- render ----
  renderDialog() {
    var t;
    return Pf({
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
    var c, p, h;
    if (!this.plan || !this.history)
      return b`<div class="center">${this.loadError ? b`<span>${f("load.error")}: ${this.loadError}</span>
            <button @click=${() => this.session.load()}>${f("action.retry")}</button>` : f("load.loading")}</div>`;
    const t = Wu(!!((p = (c = this.hass) == null ? void 0 : c.themes) != null && p.darkMode)), n = this.history.current.level, i = this.activeTool.preview(), { x: s, y: o, scale: r } = this.view, a = Math.max(1, this.size.w) / r, l = Math.max(1, this.size.h) / r, d = this.save, u = this.mode === "power";
    return b`
      <div class="ed${this.mode === "binding" ? ` binding${this.railCollapsed ? " rail-off" : ""}` : this.mode === "zones" || u ? ` ${this.mode}` : ""}"
        style=${gf(t)}
        @click=${this.refocus} @change=${this.refocusAfterChange}>
        ${Ep({
      steps: Cp({
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
      lead: this.narrow ? b`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : v,
      onPickPlan: (m) => this.session.pickPlan(m),
      onNewPlan: () => this.session.requestNewPlan(),
      onDeletePlan: () => this.session.requestDelete(),
      busy: this.deleting,
      onUndo: () => this.undo(),
      onRedo: () => this.redo(),
      onSave: () => this.session.doSave()
    })}
        ${df(this, n)}
        ${pf(this, n)}
        <div class="canvas">
          <svg class="plan" xmlns="http://www.w3.org/2000/svg" viewBox=${`${s} ${o} ${a} ${l}`}
            preserveAspectRatio="xMinYMin meet" style=${`background:${t.background}`}
            @pointerdown=${this.input.pointerDown} @pointermove=${this.input.pointerMove}
            @pointerup=${this.input.pointerUp} @pointercancel=${this.input.pointerAbort}
            @lostpointercapture=${this.input.pointerAbort} @wheel=${this.input.wheel} @contextmenu=${(m) => m.preventDefault()}>
            ${this.grid ? _f(this.view, a, l, t, u ? 0.1 : 1) : v}
            ${this.mode === "power" ? Uu(this.power, {
      palette: t,
      selection: this.selection,
      preview: i,
      scale: r,
      frame: this.powerFeed.frame,
      geo: this.ctx.geo()
    }) : vu(n, {
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
            ${i.tracker ? ff(i.tracker, {
      palette: t,
      scale: r,
      mode: this.toolId === "box" ? "box" : "wall",
      live: mf(i, this.toolId === "box" ? "box" : "wall", this.boxMeasure, this.thickness)
    }) : v}
          </svg>
          ${this.pendingDraft && ((h = this.dialog) == null ? void 0 : h.kind) !== "restore" ? If({
      savedAt: this.pendingDraft.savedAt,
      onRestore: () => this.session.restoreDraft(this.pendingDraft),
      onDiscard: () => this.session.discardDraft(this.pendingDraft)
    }) : v}
        </div>
        ${hf({
      grid: this.grid,
      zoomPct: Math.round(r * (u ? 100 : 1e3)),
      snap: i.snap && i.snap.kind !== "none" ? f(`snap.${i.snap.kind}`) : null,
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
Yi.styles = wf;
let T = Yi;
D([
  vt({ attribute: !1 })
], T.prototype, "hass");
D([
  vt({ type: Boolean })
], T.prototype, "narrow");
D([
  vt({ attribute: !1 })
], T.prototype, "panel");
D([
  z()
], T.prototype, "plan");
D([
  z()
], T.prototype, "loadError");
D([
  z()
], T.prototype, "selection");
D([
  z()
], T.prototype, "toolId");
D([
  z()
], T.prototype, "wallType");
D([
  z()
], T.prototype, "thickness");
D([
  z()
], T.prototype, "boxMeasure");
D([
  z()
], T.prototype, "grid");
D([
  z()
], T.prototype, "mode");
D([
  z()
], T.prototype, "bindFilter");
D([
  z()
], T.prototype, "bindQuery");
D([
  z()
], T.prototype, "railCollapsed");
D([
  z()
], T.prototype, "showAll");
D([
  z()
], T.prototype, "zoneQuery");
D([
  z()
], T.prototype, "cones");
D([
  z()
], T.prototype, "nextProps");
D([
  z()
], T.prototype, "nextObj");
D([
  z()
], T.prototype, "planView");
D([
  z()
], T.prototype, "powerView");
D([
  z()
], T.prototype, "placeDeviceId");
D([
  z()
], T.prototype, "size");
D([
  z()
], T.prototype, "dialog");
D([
  z()
], T.prototype, "notice");
D([
  z()
], T.prototype, "fieldNotice");
D([
  z()
], T.prototype, "pendingDraft");
D([
  z()
], T.prototype, "plans");
D([
  z()
], T.prototype, "deleting");
customElements.get("plan-studio-panel") || customElements.define("plan-studio-panel", T);
export {
  T as PlanStudioPanel
};
