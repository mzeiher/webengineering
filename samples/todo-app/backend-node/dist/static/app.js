(() => {
  // node_modules/@lit/reactive-element/css-tag.js
  var t = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var e = Symbol();
  var n = /* @__PURE__ */ new Map();
  var s = class {
    constructor(t4, n5) {
      if (this._$cssResult$ = true, n5 !== e)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4;
    }
    get styleSheet() {
      let e5 = n.get(this.cssText);
      return t && e5 === void 0 && (n.set(this.cssText, e5 = new CSSStyleSheet()), e5.replaceSync(this.cssText)), e5;
    }
    toString() {
      return this.cssText;
    }
  };
  var o = (t4) => new s(typeof t4 == "string" ? t4 : t4 + "", e);
  var i = (e5, n5) => {
    t ? e5.adoptedStyleSheets = n5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : n5.forEach((t4) => {
      const n6 = document.createElement("style"), s5 = window.litNonce;
      s5 !== void 0 && n6.setAttribute("nonce", s5), n6.textContent = t4.cssText, e5.appendChild(n6);
    });
  };
  var S = t ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const n5 of t5.cssRules)
      e5 += n5.cssText;
    return o(e5);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var s2;
  var e2 = window.trustedTypes;
  var r2 = e2 ? e2.emptyScript : "";
  var h = window.reactiveElementPolyfillSupport;
  var o2 = { toAttribute(t4, i4) {
    switch (i4) {
      case Boolean:
        t4 = t4 ? r2 : null;
        break;
      case Object:
      case Array:
        t4 = t4 == null ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, i4) {
    let s5 = t4;
    switch (i4) {
      case Boolean:
        s5 = t4 !== null;
        break;
      case Number:
        s5 = t4 === null ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          s5 = JSON.parse(t4);
        } catch (t5) {
          s5 = null;
        }
    }
    return s5;
  } };
  var n2 = (t4, i4) => i4 !== t4 && (i4 == i4 || t4 == t4);
  var l = { attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2 };
  var a = class extends HTMLElement {
    constructor() {
      super(), this._$Et = /* @__PURE__ */ new Map(), this.isUpdatePending = false, this.hasUpdated = false, this._$Ei = null, this.o();
    }
    static addInitializer(t4) {
      var i4;
      (i4 = this.l) !== null && i4 !== void 0 || (this.l = []), this.l.push(t4);
    }
    static get observedAttributes() {
      this.finalize();
      const t4 = [];
      return this.elementProperties.forEach((i4, s5) => {
        const e5 = this._$Eh(s5, i4);
        e5 !== void 0 && (this._$Eu.set(e5, s5), t4.push(e5));
      }), t4;
    }
    static createProperty(t4, i4 = l) {
      if (i4.state && (i4.attribute = false), this.finalize(), this.elementProperties.set(t4, i4), !i4.noAccessor && !this.prototype.hasOwnProperty(t4)) {
        const s5 = typeof t4 == "symbol" ? Symbol() : "__" + t4, e5 = this.getPropertyDescriptor(t4, s5, i4);
        e5 !== void 0 && Object.defineProperty(this.prototype, t4, e5);
      }
    }
    static getPropertyDescriptor(t4, i4, s5) {
      return { get() {
        return this[i4];
      }, set(e5) {
        const r4 = this[t4];
        this[i4] = e5, this.requestUpdate(t4, r4, s5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) || l;
    }
    static finalize() {
      if (this.hasOwnProperty("finalized"))
        return false;
      this.finalized = true;
      const t4 = Object.getPrototypeOf(this);
      if (t4.finalize(), this.elementProperties = new Map(t4.elementProperties), this._$Eu = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
        const t5 = this.properties, i4 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
        for (const s5 of i4)
          this.createProperty(s5, t5[s5]);
      }
      return this.elementStyles = this.finalizeStyles(this.styles), true;
    }
    static finalizeStyles(i4) {
      const s5 = [];
      if (Array.isArray(i4)) {
        const e5 = new Set(i4.flat(1 / 0).reverse());
        for (const i5 of e5)
          s5.unshift(S(i5));
      } else
        i4 !== void 0 && s5.push(S(i4));
      return s5;
    }
    static _$Eh(t4, i4) {
      const s5 = i4.attribute;
      return s5 === false ? void 0 : typeof s5 == "string" ? s5 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
    }
    o() {
      var t4;
      this._$Ep = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$Em(), this.requestUpdate(), (t4 = this.constructor.l) === null || t4 === void 0 || t4.forEach((t5) => t5(this));
    }
    addController(t4) {
      var i4, s5;
      ((i4 = this._$Eg) !== null && i4 !== void 0 ? i4 : this._$Eg = []).push(t4), this.renderRoot !== void 0 && this.isConnected && ((s5 = t4.hostConnected) === null || s5 === void 0 || s5.call(t4));
    }
    removeController(t4) {
      var i4;
      (i4 = this._$Eg) === null || i4 === void 0 || i4.splice(this._$Eg.indexOf(t4) >>> 0, 1);
    }
    _$Em() {
      this.constructor.elementProperties.forEach((t4, i4) => {
        this.hasOwnProperty(i4) && (this._$Et.set(i4, this[i4]), delete this[i4]);
      });
    }
    createRenderRoot() {
      var t4;
      const s5 = (t4 = this.shadowRoot) !== null && t4 !== void 0 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
      return i(s5, this.constructor.elementStyles), s5;
    }
    connectedCallback() {
      var t4;
      this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
        var i4;
        return (i4 = t5.hostConnected) === null || i4 === void 0 ? void 0 : i4.call(t5);
      });
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      var t4;
      (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
        var i4;
        return (i4 = t5.hostDisconnected) === null || i4 === void 0 ? void 0 : i4.call(t5);
      });
    }
    attributeChangedCallback(t4, i4, s5) {
      this._$AK(t4, s5);
    }
    _$ES(t4, i4, s5 = l) {
      var e5, r4;
      const h3 = this.constructor._$Eh(t4, s5);
      if (h3 !== void 0 && s5.reflect === true) {
        const n5 = ((r4 = (e5 = s5.converter) === null || e5 === void 0 ? void 0 : e5.toAttribute) !== null && r4 !== void 0 ? r4 : o2.toAttribute)(i4, s5.type);
        this._$Ei = t4, n5 == null ? this.removeAttribute(h3) : this.setAttribute(h3, n5), this._$Ei = null;
      }
    }
    _$AK(t4, i4) {
      var s5, e5, r4;
      const h3 = this.constructor, n5 = h3._$Eu.get(t4);
      if (n5 !== void 0 && this._$Ei !== n5) {
        const t5 = h3.getPropertyOptions(n5), l4 = t5.converter, a3 = (r4 = (e5 = (s5 = l4) === null || s5 === void 0 ? void 0 : s5.fromAttribute) !== null && e5 !== void 0 ? e5 : typeof l4 == "function" ? l4 : null) !== null && r4 !== void 0 ? r4 : o2.fromAttribute;
        this._$Ei = n5, this[n5] = a3(i4, t5.type), this._$Ei = null;
      }
    }
    requestUpdate(t4, i4, s5) {
      let e5 = true;
      t4 !== void 0 && (((s5 = s5 || this.constructor.getPropertyOptions(t4)).hasChanged || n2)(this[t4], i4) ? (this._$AL.has(t4) || this._$AL.set(t4, i4), s5.reflect === true && this._$Ei !== t4 && (this._$E_ === void 0 && (this._$E_ = /* @__PURE__ */ new Map()), this._$E_.set(t4, s5))) : e5 = false), !this.isUpdatePending && e5 && (this._$Ep = this._$EC());
    }
    async _$EC() {
      this.isUpdatePending = true;
      try {
        await this._$Ep;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return t4 != null && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var t4;
      if (!this.isUpdatePending)
        return;
      this.hasUpdated, this._$Et && (this._$Et.forEach((t5, i5) => this[i5] = t5), this._$Et = void 0);
      let i4 = false;
      const s5 = this._$AL;
      try {
        i4 = this.shouldUpdate(s5), i4 ? (this.willUpdate(s5), (t4 = this._$Eg) === null || t4 === void 0 || t4.forEach((t5) => {
          var i5;
          return (i5 = t5.hostUpdate) === null || i5 === void 0 ? void 0 : i5.call(t5);
        }), this.update(s5)) : this._$EU();
      } catch (t5) {
        throw i4 = false, this._$EU(), t5;
      }
      i4 && this._$AE(s5);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      var i4;
      (i4 = this._$Eg) === null || i4 === void 0 || i4.forEach((t5) => {
        var i5;
        return (i5 = t5.hostUpdated) === null || i5 === void 0 ? void 0 : i5.call(t5);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$EU() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$Ep;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$E_ !== void 0 && (this._$E_.forEach((t5, i4) => this._$ES(i4, this[i4], t5)), this._$E_ = void 0), this._$EU();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  a.finalized = true, a.elementProperties = /* @__PURE__ */ new Map(), a.elementStyles = [], a.shadowRootOptions = { mode: "open" }, h == null || h({ ReactiveElement: a }), ((s2 = globalThis.reactiveElementVersions) !== null && s2 !== void 0 ? s2 : globalThis.reactiveElementVersions = []).push("1.2.3");

  // node_modules/lit-html/lit-html.js
  var t2;
  var i2 = globalThis.trustedTypes;
  var s3 = i2 ? i2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = `lit$${(Math.random() + "").slice(9)}$`;
  var o3 = "?" + e3;
  var n3 = `<${o3}>`;
  var l2 = document;
  var h2 = (t4 = "") => l2.createComment(t4);
  var r3 = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
  var d = Array.isArray;
  var u = (t4) => {
    var i4;
    return d(t4) || typeof ((i4 = t4) === null || i4 === void 0 ? void 0 : i4[Symbol.iterator]) == "function";
  };
  var c = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var a2 = />/g;
  var f = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
  var _ = /'/g;
  var m = /"/g;
  var g = /^(?:script|style|textarea|title)$/i;
  var p = (t4) => (i4, ...s5) => ({ _$litType$: t4, strings: i4, values: s5 });
  var $ = p(1);
  var y = p(2);
  var b = Symbol.for("lit-noChange");
  var w = Symbol.for("lit-nothing");
  var T = /* @__PURE__ */ new WeakMap();
  var x = (t4, i4, s5) => {
    var e5, o7;
    const n5 = (e5 = s5 == null ? void 0 : s5.renderBefore) !== null && e5 !== void 0 ? e5 : i4;
    let l4 = n5._$litPart$;
    if (l4 === void 0) {
      const t5 = (o7 = s5 == null ? void 0 : s5.renderBefore) !== null && o7 !== void 0 ? o7 : null;
      n5._$litPart$ = l4 = new N(i4.insertBefore(h2(), t5), t5, void 0, s5 != null ? s5 : {});
    }
    return l4._$AI(t4), l4;
  };
  var A = l2.createTreeWalker(l2, 129, null, false);
  var C = (t4, i4) => {
    const o7 = t4.length - 1, l4 = [];
    let h3, r4 = i4 === 2 ? "<svg>" : "", d2 = c;
    for (let i5 = 0; i5 < o7; i5++) {
      const s5 = t4[i5];
      let o8, u3, p2 = -1, $2 = 0;
      for (; $2 < s5.length && (d2.lastIndex = $2, u3 = d2.exec(s5), u3 !== null); )
        $2 = d2.lastIndex, d2 === c ? u3[1] === "!--" ? d2 = v : u3[1] !== void 0 ? d2 = a2 : u3[2] !== void 0 ? (g.test(u3[2]) && (h3 = RegExp("</" + u3[2], "g")), d2 = f) : u3[3] !== void 0 && (d2 = f) : d2 === f ? u3[0] === ">" ? (d2 = h3 != null ? h3 : c, p2 = -1) : u3[1] === void 0 ? p2 = -2 : (p2 = d2.lastIndex - u3[2].length, o8 = u3[1], d2 = u3[3] === void 0 ? f : u3[3] === '"' ? m : _) : d2 === m || d2 === _ ? d2 = f : d2 === v || d2 === a2 ? d2 = c : (d2 = f, h3 = void 0);
      const y2 = d2 === f && t4[i5 + 1].startsWith("/>") ? " " : "";
      r4 += d2 === c ? s5 + n3 : p2 >= 0 ? (l4.push(o8), s5.slice(0, p2) + "$lit$" + s5.slice(p2) + e3 + y2) : s5 + e3 + (p2 === -2 ? (l4.push(void 0), i5) : y2);
    }
    const u2 = r4 + (t4[o7] || "<?>") + (i4 === 2 ? "</svg>" : "");
    if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return [s3 !== void 0 ? s3.createHTML(u2) : u2, l4];
  };
  var E = class {
    constructor({ strings: t4, _$litType$: s5 }, n5) {
      let l4;
      this.parts = [];
      let r4 = 0, d2 = 0;
      const u2 = t4.length - 1, c2 = this.parts, [v2, a3] = C(t4, s5);
      if (this.el = E.createElement(v2, n5), A.currentNode = this.el.content, s5 === 2) {
        const t5 = this.el.content, i4 = t5.firstChild;
        i4.remove(), t5.append(...i4.childNodes);
      }
      for (; (l4 = A.nextNode()) !== null && c2.length < u2; ) {
        if (l4.nodeType === 1) {
          if (l4.hasAttributes()) {
            const t5 = [];
            for (const i4 of l4.getAttributeNames())
              if (i4.endsWith("$lit$") || i4.startsWith(e3)) {
                const s6 = a3[d2++];
                if (t5.push(i4), s6 !== void 0) {
                  const t6 = l4.getAttribute(s6.toLowerCase() + "$lit$").split(e3), i5 = /([.?@])?(.*)/.exec(s6);
                  c2.push({ type: 1, index: r4, name: i5[2], strings: t6, ctor: i5[1] === "." ? M : i5[1] === "?" ? H : i5[1] === "@" ? I : S2 });
                } else
                  c2.push({ type: 6, index: r4 });
              }
            for (const i4 of t5)
              l4.removeAttribute(i4);
          }
          if (g.test(l4.tagName)) {
            const t5 = l4.textContent.split(e3), s6 = t5.length - 1;
            if (s6 > 0) {
              l4.textContent = i2 ? i2.emptyScript : "";
              for (let i4 = 0; i4 < s6; i4++)
                l4.append(t5[i4], h2()), A.nextNode(), c2.push({ type: 2, index: ++r4 });
              l4.append(t5[s6], h2());
            }
          }
        } else if (l4.nodeType === 8)
          if (l4.data === o3)
            c2.push({ type: 2, index: r4 });
          else {
            let t5 = -1;
            for (; (t5 = l4.data.indexOf(e3, t5 + 1)) !== -1; )
              c2.push({ type: 7, index: r4 }), t5 += e3.length - 1;
          }
        r4++;
      }
    }
    static createElement(t4, i4) {
      const s5 = l2.createElement("template");
      return s5.innerHTML = t4, s5;
    }
  };
  function P(t4, i4, s5 = t4, e5) {
    var o7, n5, l4, h3;
    if (i4 === b)
      return i4;
    let d2 = e5 !== void 0 ? (o7 = s5._$Cl) === null || o7 === void 0 ? void 0 : o7[e5] : s5._$Cu;
    const u2 = r3(i4) ? void 0 : i4._$litDirective$;
    return (d2 == null ? void 0 : d2.constructor) !== u2 && ((n5 = d2 == null ? void 0 : d2._$AO) === null || n5 === void 0 || n5.call(d2, false), u2 === void 0 ? d2 = void 0 : (d2 = new u2(t4), d2._$AT(t4, s5, e5)), e5 !== void 0 ? ((l4 = (h3 = s5)._$Cl) !== null && l4 !== void 0 ? l4 : h3._$Cl = [])[e5] = d2 : s5._$Cu = d2), d2 !== void 0 && (i4 = P(t4, d2._$AS(t4, i4.values), d2, e5)), i4;
  }
  var V = class {
    constructor(t4, i4) {
      this.v = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    p(t4) {
      var i4;
      const { el: { content: s5 }, parts: e5 } = this._$AD, o7 = ((i4 = t4 == null ? void 0 : t4.creationScope) !== null && i4 !== void 0 ? i4 : l2).importNode(s5, true);
      A.currentNode = o7;
      let n5 = A.nextNode(), h3 = 0, r4 = 0, d2 = e5[0];
      for (; d2 !== void 0; ) {
        if (h3 === d2.index) {
          let i5;
          d2.type === 2 ? i5 = new N(n5, n5.nextSibling, this, t4) : d2.type === 1 ? i5 = new d2.ctor(n5, d2.name, d2.strings, this, t4) : d2.type === 6 && (i5 = new L(n5, this, t4)), this.v.push(i5), d2 = e5[++r4];
        }
        h3 !== (d2 == null ? void 0 : d2.index) && (n5 = A.nextNode(), h3++);
      }
      return o7;
    }
    m(t4) {
      let i4 = 0;
      for (const s5 of this.v)
        s5 !== void 0 && (s5.strings !== void 0 ? (s5._$AI(t4, s5, i4), i4 += s5.strings.length - 2) : s5._$AI(t4[i4])), i4++;
    }
  };
  var N = class {
    constructor(t4, i4, s5, e5) {
      var o7;
      this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s5, this.options = e5, this._$Cg = (o7 = e5 == null ? void 0 : e5.isConnected) === null || o7 === void 0 || o7;
    }
    get _$AU() {
      var t4, i4;
      return (i4 = (t4 = this._$AM) === null || t4 === void 0 ? void 0 : t4._$AU) !== null && i4 !== void 0 ? i4 : this._$Cg;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i4 = this._$AM;
      return i4 !== void 0 && t4.nodeType === 11 && (t4 = i4.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i4 = this) {
      t4 = P(this, t4, i4), r3(t4) ? t4 === w || t4 == null || t4 === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : t4 !== this._$AH && t4 !== b && this.$(t4) : t4._$litType$ !== void 0 ? this.T(t4) : t4.nodeType !== void 0 ? this.S(t4) : u(t4) ? this.A(t4) : this.$(t4);
    }
    M(t4, i4 = this._$AB) {
      return this._$AA.parentNode.insertBefore(t4, i4);
    }
    S(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.M(t4));
    }
    $(t4) {
      this._$AH !== w && r3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.S(l2.createTextNode(t4)), this._$AH = t4;
    }
    T(t4) {
      var i4;
      const { values: s5, _$litType$: e5 } = t4, o7 = typeof e5 == "number" ? this._$AC(t4) : (e5.el === void 0 && (e5.el = E.createElement(e5.h, this.options)), e5);
      if (((i4 = this._$AH) === null || i4 === void 0 ? void 0 : i4._$AD) === o7)
        this._$AH.m(s5);
      else {
        const t5 = new V(o7, this), i5 = t5.p(this.options);
        t5.m(s5), this.S(i5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i4 = T.get(t4.strings);
      return i4 === void 0 && T.set(t4.strings, i4 = new E(t4)), i4;
    }
    A(t4) {
      d(this._$AH) || (this._$AH = [], this._$AR());
      const i4 = this._$AH;
      let s5, e5 = 0;
      for (const o7 of t4)
        e5 === i4.length ? i4.push(s5 = new N(this.M(h2()), this.M(h2()), this, this.options)) : s5 = i4[e5], s5._$AI(o7), e5++;
      e5 < i4.length && (this._$AR(s5 && s5._$AB.nextSibling, e5), i4.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i4) {
      var s5;
      for ((s5 = this._$AP) === null || s5 === void 0 || s5.call(this, false, true, i4); t4 && t4 !== this._$AB; ) {
        const i5 = t4.nextSibling;
        t4.remove(), t4 = i5;
      }
    }
    setConnected(t4) {
      var i4;
      this._$AM === void 0 && (this._$Cg = t4, (i4 = this._$AP) === null || i4 === void 0 || i4.call(this, t4));
    }
  };
  var S2 = class {
    constructor(t4, i4, s5, e5, o7) {
      this.type = 1, this._$AH = w, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e5, this.options = o7, s5.length > 2 || s5[0] !== "" || s5[1] !== "" ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = w;
    }
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4, i4 = this, s5, e5) {
      const o7 = this.strings;
      let n5 = false;
      if (o7 === void 0)
        t4 = P(this, t4, i4, 0), n5 = !r3(t4) || t4 !== this._$AH && t4 !== b, n5 && (this._$AH = t4);
      else {
        const e6 = t4;
        let l4, h3;
        for (t4 = o7[0], l4 = 0; l4 < o7.length - 1; l4++)
          h3 = P(this, e6[s5 + l4], i4, l4), h3 === b && (h3 = this._$AH[l4]), n5 || (n5 = !r3(h3) || h3 !== this._$AH[l4]), h3 === w ? t4 = w : t4 !== w && (t4 += (h3 != null ? h3 : "") + o7[l4 + 1]), this._$AH[l4] = h3;
      }
      n5 && !e5 && this.k(t4);
    }
    k(t4) {
      t4 === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
    }
  };
  var M = class extends S2 {
    constructor() {
      super(...arguments), this.type = 3;
    }
    k(t4) {
      this.element[this.name] = t4 === w ? void 0 : t4;
    }
  };
  var k = i2 ? i2.emptyScript : "";
  var H = class extends S2 {
    constructor() {
      super(...arguments), this.type = 4;
    }
    k(t4) {
      t4 && t4 !== w ? this.element.setAttribute(this.name, k) : this.element.removeAttribute(this.name);
    }
  };
  var I = class extends S2 {
    constructor(t4, i4, s5, e5, o7) {
      super(t4, i4, s5, e5, o7), this.type = 5;
    }
    _$AI(t4, i4 = this) {
      var s5;
      if ((t4 = (s5 = P(this, t4, i4, 0)) !== null && s5 !== void 0 ? s5 : w) === b)
        return;
      const e5 = this._$AH, o7 = t4 === w && e5 !== w || t4.capture !== e5.capture || t4.once !== e5.once || t4.passive !== e5.passive, n5 = t4 !== w && (e5 === w || o7);
      o7 && this.element.removeEventListener(this.name, this, e5), n5 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      var i4, s5;
      typeof this._$AH == "function" ? this._$AH.call((s5 = (i4 = this.options) === null || i4 === void 0 ? void 0 : i4.host) !== null && s5 !== void 0 ? s5 : this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var L = class {
    constructor(t4, i4, s5) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s5;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      P(this, t4);
    }
  };
  var z = window.litHtmlPolyfillSupport;
  z == null || z(E, N), ((t2 = globalThis.litHtmlVersions) !== null && t2 !== void 0 ? t2 : globalThis.litHtmlVersions = []).push("2.1.3");

  // node_modules/lit-element/lit-element.js
  var l3;
  var o4;
  var s4 = class extends a {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Dt = void 0;
    }
    createRenderRoot() {
      var t4, e5;
      const i4 = super.createRenderRoot();
      return (t4 = (e5 = this.renderOptions).renderBefore) !== null && t4 !== void 0 || (e5.renderBefore = i4.firstChild), i4;
    }
    update(t4) {
      const i4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Dt = x(i4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var t4;
      super.connectedCallback(), (t4 = this._$Dt) === null || t4 === void 0 || t4.setConnected(true);
    }
    disconnectedCallback() {
      var t4;
      super.disconnectedCallback(), (t4 = this._$Dt) === null || t4 === void 0 || t4.setConnected(false);
    }
    render() {
      return b;
    }
  };
  s4.finalized = true, s4._$litElement$ = true, (l3 = globalThis.litElementHydrateSupport) === null || l3 === void 0 || l3.call(globalThis, { LitElement: s4 });
  var n4 = globalThis.litElementPolyfillSupport;
  n4 == null || n4({ LitElement: s4 });
  ((o4 = globalThis.litElementVersions) !== null && o4 !== void 0 ? o4 : globalThis.litElementVersions = []).push("3.1.2");

  // node_modules/lit-html/directive.js
  var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e4 = (t4) => (...e5) => ({ _$litDirective$: t4, values: e5 });
  var i3 = class {
    constructor(t4) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t4, e5, i4) {
      this._$Ct = t4, this._$AM = e5, this._$Ci = i4;
    }
    _$AS(t4, e5) {
      return this.update(t4, e5);
    }
    update(t4, e5) {
      return this.render(...e5);
    }
  };

  // node_modules/lit-html/directives/class-map.js
  var o5 = e4(class extends i3 {
    constructor(t4) {
      var i4;
      if (super(t4), t4.type !== t3.ATTRIBUTE || t4.name !== "class" || ((i4 = t4.strings) === null || i4 === void 0 ? void 0 : i4.length) > 2)
        throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
    render(t4) {
      return " " + Object.keys(t4).filter((i4) => t4[i4]).join(" ") + " ";
    }
    update(i4, [s5]) {
      var r4, o7;
      if (this.st === void 0) {
        this.st = /* @__PURE__ */ new Set(), i4.strings !== void 0 && (this.et = new Set(i4.strings.join(" ").split(/\s/).filter((t4) => t4 !== "")));
        for (const t4 in s5)
          s5[t4] && !((r4 = this.et) === null || r4 === void 0 ? void 0 : r4.has(t4)) && this.st.add(t4);
        return this.render(s5);
      }
      const e5 = i4.element.classList;
      this.st.forEach((t4) => {
        t4 in s5 || (e5.remove(t4), this.st.delete(t4));
      });
      for (const t4 in s5) {
        const i5 = !!s5[t4];
        i5 === this.st.has(t4) || ((o7 = this.et) === null || o7 === void 0 ? void 0 : o7.has(t4)) || (i5 ? (e5.add(t4), this.st.add(t4)) : (e5.remove(t4), this.st.delete(t4)));
      }
      return b;
    }
  });

  // node_modules/lit-html/directives/map.js
  function* o6(o7, f2) {
    if (o7 !== void 0) {
      let i4 = 0;
      for (const t4 of o7)
        yield f2(t4, i4++);
    }
  }

  // src/store.ts
  var ToDoStore = class extends EventTarget {
    constructor() {
      super();
      this.host = "//127.0.0.1:3000";
      window.setTimeout(() => {
        const websocketConnection = () => {
          const ws = new WebSocket(`ws:${this.host}/signal`);
          ws.addEventListener("message", () => {
            this.sync();
          });
          ws.addEventListener("error", (reason) => {
            this.dispatchEvent(Object.assign(new Event("error"), { error: reason }));
            this.dispatchEvent(new Event("disconnected"));
            window.setTimeout(() => {
              websocketConnection();
            }, 1e3);
          });
          ws.addEventListener("close", () => {
            this.dispatchEvent(new Event("disconnected"));
            window.setTimeout(() => {
              websocketConnection();
            }, 1e3);
          });
          ws.addEventListener("open", () => {
            this.dispatchEvent(new Event("connected"));
          });
        };
        websocketConnection();
      }, 0);
    }
    sync() {
      fetch(`${this.host}/todos`, { method: "GET" }).then(async (response) => {
        const todos = await response.json();
        this.dispatchEvent(Object.assign(new Event("update"), { todos }));
      }).catch((error) => {
        this.dispatchEvent(Object.assign(new Event("error"), { error }));
      });
    }
    addTodo(text) {
      fetch(`${this.host}/todos`, { method: "POST", body: text }).then(() => {
        this.sync();
      }).catch((error) => {
        this.dispatchEvent(Object.assign(new Event("error"), { error }));
      });
    }
    deleteTodo(todo) {
      fetch(`${this.host}/todos/${todo.id}`, { method: "DELETE" }).then(() => {
        this.sync();
      }).catch((error) => {
        this.dispatchEvent(Object.assign(new Event("error"), { error }));
      });
    }
    updateTodo(todo) {
      fetch(`${this.host}/todos/${todo.id}`, { method: "PUT", body: JSON.stringify({ todo: todo.todo, isDone: todo.isDone }) }).then(() => {
        this.sync();
      }).catch((error) => {
        this.dispatchEvent(Object.assign(new Event("error"), { error }));
      });
    }
    addEventListener(type, listener) {
      super.addEventListener(type, listener);
    }
  };
  var store = new ToDoStore();

  // src/app.ts
  var CONNECTED = false;
  var update = (todos) => {
    x(app(todos), document.body);
  };
  var app = (todos) => {
    return $`
    <header><h1>ToDo App</h1></header>
    ${!CONNECTED ? $`<div class="error">DISCONNECTED</div>` : w}
    <main class="${o5({ offline: !CONNECTED })}">
        ${todoList(todos)}
    </main>`;
  };
  var todoList = (todos) => {
    return $`
    <ul class="todo_list">
        ${o6(todos, (todo) => {
      return $`<li class="${o5({ done: todo.isDone })}">
        <label>${todo.todo}</label><button @click="${() => {
        if (todo.isDone) {
          store.deleteTodo(todo);
        } else {
          store.updateTodo({ ...todo, isDone: !todo.isDone });
        }
      }}">${todo.isDone ? "\u274C" : "\u2714\uFE0F"}</button>
        </li>
        `;
    })}
    </ul>
    <form @submit="${(evt) => {
      evt.preventDefault();
      const form_data = new FormData(evt.target);
      store.addTodo(form_data.get("text"));
    }}">
    <div class="todo_input"><input type="text" name="text" /><button type="submit">➕</button></div>
    </form>
    `;
  };
  store.addEventListener("update", (evt) => {
    update(evt.todos);
  });
  store.addEventListener("disconnected", () => {
    CONNECTED = false;
    update([]);
  });
  store.addEventListener("connected", () => {
    CONNECTED = true;
    store.sync();
  });
  window.addEventListener("load", () => {
    update([]);
    store.sync();
  });
})();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
//# sourceMappingURL=app.js.map
