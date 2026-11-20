// package.json
var e = "0.1.2", t = globalThis, n = t.ShadowRoot && (t.ShadyCSS === void 0 || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, r = Symbol(), i = /* @__PURE__ */ new WeakMap(), a = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== r) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (n && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = i.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && i.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, o = (e) => new a(typeof e == "string" ? e : e + "", void 0, r), s = (e, ...t) => new a(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, r), c = (e, r) => {
	if (n) e.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of r) {
		let r = document.createElement("style"), i = t.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = n.cssText, e.appendChild(r);
	}
}, l = n ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return o(t);
})(e) : e, { is: u, defineProperty: d, getOwnPropertyDescriptor: ee, getOwnPropertyNames: te, getOwnPropertySymbols: ne, getPrototypeOf: re } = Object, f = globalThis, ie = f.trustedTypes, ae = ie ? ie.emptyScript : "", oe = f.reactiveElementPolyfillSupport, p = (e, t) => e, se = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ae : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, ce = (e, t) => !u(e, t), le = {
	attribute: !0,
	type: String,
	converter: se,
	reflect: !1,
	useDefault: !1,
	hasChanged: ce
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var m = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = le) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && d(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = ee(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? le;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = re(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...te(e), ...ne(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(l(e));
		} else e !== void 0 && t.push(l(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return c(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? se : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? se : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
m.elementStyles = [], m.shadowRootOptions = { mode: "open" }, m[p("elementProperties")] = /* @__PURE__ */ new Map(), m[p("finalized")] = /* @__PURE__ */ new Map(), oe?.({ ReactiveElement: m }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var ue = globalThis, de = (e) => e, h = ue.trustedTypes, fe = h ? h.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pe = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + g, he = `<${me}>`, _ = document, v = () => _.createComment(""), y = (e) => e === null || typeof e != "object" && typeof e != "function", ge = Array.isArray, _e = (e) => ge(e) || typeof e?.[Symbol.iterator] == "function", b = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, ye = />/g, S = RegExp(`>|${b}(?:([^\\s"'>=/]+)(${b}*=${b}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, xe = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ce = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Ce(1), w = Ce(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), D = _.createTreeWalker(_, 129);
function Te(e, t) {
	if (!ge(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return fe === void 0 ? t : fe.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (Se.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ye : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? xe : be) : o === xe || o === be ? o = S : o === ve || o === ye ? o = x : (o = S, i = void 0);
		let d = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + he : l >= 0 ? (r.push(s), n.slice(0, l) + pe + n.slice(l) + g + d) : n + g + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, O = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ee(t, n);
		if (this.el = e.createElement(l, r), D.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = D.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(pe)) {
					let t = u[o++], n = i.getAttribute(e).split(g), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ke : r[1] === "?" ? Ae : r[1] === "@" ? je : A
					}), i.removeAttribute(e);
				} else e.startsWith(g) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Se.test(i.tagName)) {
					let e = i.textContent.split(g), t = e.length - 1;
					if (t > 0) {
						i.textContent = h ? h.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], v()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], v());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === me) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(g, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += g.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = _.createElement("template");
		return n.innerHTML = e, n;
	}
};
function k(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = y(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = k(e, i._$AS(e, t.values), i, r)), t;
}
var De = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? _).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Oe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Me(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = _, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Oe = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = k(this, e, t), y(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? _e(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && y(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = O.createElement(Te(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new De(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = we.get(e.strings);
		return t === void 0 && we.set(e.strings, t = new O(e)), t;
	}
	k(t) {
		ge(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(v()), this.O(v()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = de(e).nextSibling;
			de(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, A = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = E, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = E;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = k(this, e, t, 0), a = !y(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = k(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !y(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ke = class extends A {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, Ae = class extends A {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, je = class extends A {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = k(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Me = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		k(this, e);
	}
}, Ne = ue.litHtmlPolyfillSupport;
Ne?.(O, Oe), (ue.litHtmlVersions ??= []).push("3.3.3");
var Pe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Oe(t.insertBefore(v(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, j = globalThis, M = class extends m {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Pe(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return T;
	}
};
M._$litElement$ = !0, M.finalized = !0, j.litElementHydrateSupport?.({ LitElement: M });
var Fe = j.litElementPolyfillSupport;
Fe?.({ LitElement: M }), (j.litElementVersions ??= []).push("4.2.2");
// src/actions.ts
function Ie(e, t, n) {
	switch (t.action) {
		case "more-info":
			e.dispatchEvent(new CustomEvent("hass-more-info", {
				detail: { entityId: n },
				bubbles: !0,
				composed: !0
			}));
			return;
		case "navigate":
			window.history.pushState(null, "", t.navigation_path), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
			return;
		case "url":
			window.open(t.url_path, "_blank", "noopener");
			return;
		case "none": return;
	}
}
// src/buckets.ts
function Le(e, t) {
	let n = Array(t.count), r = (t.end - t.start) / t.count, i = (e, n) => t.twoSided ? Math.abs(n) > Math.abs(e) : n > e, a = 0, o = null;
	for (let s = 0; s < t.count; s++) {
		let c = t.start + s * r, l = s === t.count - 1 ? t.end : t.start + (s + 1) * r;
		for (; a < e.length && e[a].t <= c;) o = e[a++].v;
		let u = o;
		for (; a < e.length && e[a].t < l;) {
			let t = e[a].v;
			t !== null && (u === null || i(u, t)) && (u = t), o = t, a++;
		}
		n[s] = u;
	}
	return n;
}
// src/config.ts
var Re = class extends Error {
	constructor(e) {
		super(e), this.name = "ConfigError";
	}
}, ze = ["sparkline", "bar"], Be = {
	normal: "var(--success-color)",
	warning: "var(--warning-color)",
	critical: "var(--error-color)"
}, Ve = 5e3, He = .25, Ue = 24;
function N(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function P(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function F(e) {
	return typeof e == "string" && e !== "" ? e : void 0;
}
function We(e, t) {
	if (!Array.isArray(e)) return t;
	let n = e.filter((e) => e === "sparkline" || e === "bar");
	return n.length > 0 ? n : t;
}
function Ge(e) {
	if (N(e)) {
		if (e.action === "none") return { action: "none" };
		if (e.action === "navigate" && F(e.navigation_path)) return {
			action: "navigate",
			navigation_path: e.navigation_path
		};
		if (e.action === "url" && F(e.url_path)) return {
			action: "url",
			url_path: e.url_path
		};
	}
	return { action: "more-info" };
}
function Ke(e, t) {
	if (e < 0) {
		let n = Math.max(Math.abs(e), t);
		return {
			normal: .2 * n,
			warning: .6 * n,
			critical: n
		};
	}
	let n = t - e;
	return {
		normal: e + .2 * n,
		warning: e + .6 * n,
		critical: t
	};
}
function qe(e, t) {
	let n = [
		t.normal,
		t.warning,
		t.critical
	];
	return e.map((t, r) => {
		if (t !== void 0) return t;
		let i = e.slice(0, r).filter((e) => e !== void 0), a = e.slice(r + 1).filter((e) => e !== void 0);
		return Math.min(Math.max(n[r], ...i), ...a);
	});
}
function Je(e, t) {
	let n = typeof e == "string" ? { entity: e } : N(e) ? e : {}, r = F(n.entity);
	if (!r) throw new Re("Each meter needs an entity id");
	let i = [], a = P(n.min) ?? 0, o = P(n.max) ?? Ve;
	o <= a && (i.push("range"), o = a + 1);
	let s = a < 0, c = [
		P(n.normal),
		P(n.warning),
		P(n.critical)
	];
	s && c.some((e) => e !== void 0 && e < 0) && (i.push("thresholds_negative"), c = c.map((e) => e === void 0 ? e : Math.abs(e)));
	let l = c.filter((e) => e !== void 0);
	l.some((e, t) => t > 0 && e < l[t - 1]) && i.push("thresholds_order");
	let [u, d, ee] = qe(c, Ke(a, o)).sort((e, t) => e - t);
	return {
		entity: r,
		name: F(n.name),
		unit: F(n.unit),
		precision: P(n.precision),
		min: a,
		max: o,
		normal: u,
		warning: d,
		critical: ee,
		twoSided: s,
		display: We(n.display, t),
		tapAction: Ge(n.tap_action),
		errors: i
	};
}
function I(e) {
	if (!N(e)) throw new Re("Invalid configuration");
	if (!Array.isArray(e.meters) || e.meters.length === 0) throw new Re("At least one meter is required");
	let t = We(e.display, ze), n = N(e.colors) ? e.colors : {}, r = Math.min(Ue, Math.max(He, P(e.hours) ?? 1));
	return {
		title: F(e.title),
		display: t,
		hours: r,
		scale: e.sparkline_scale === "auto" ? "auto" : "fixed",
		colors: {
			normal: F(n.normal) ?? Be.normal,
			warning: F(n.warning) ?? Be.warning,
			critical: F(n.critical) ?? Be.critical
		},
		blend: e.blend !== !1,
		meters: e.meters.map((e) => Je(e, t))
	};
}
// src/geometry.ts
function Ye(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function Xe(e, t, n) {
	let r = n - t, i = (e) => (Ye(e, t, n) - t) * 100 / r;
	if (t >= 0) return {
		left: 0,
		width: i(e),
		zero: null
	};
	let a = i(0), o = i(e);
	return {
		left: Math.min(o, a),
		width: Math.abs(o - a),
		zero: a
	};
}
function Ze(e, t, n) {
	if (n === "fixed") return {
		lo: t.min,
		hi: t.max
	};
	let r = e.filter((e) => e !== null);
	if (r.length === 0) return {
		lo: t.min,
		hi: t.max
	};
	let i = Math.min(...r), a = Math.max(...r), o = a === i ? 1 : (a - i) * .05;
	return i -= o, a += o, t.twoSided && (i = Math.min(i, 0), a = Math.max(a, 0)), {
		lo: i,
		hi: a
	};
}
function Qe(e, t, n) {
	let r = t.hi - t.lo || 1;
	return n - (Ye(e, t.lo, t.hi) - t.lo) / r * n;
}
var L = (e) => String(Math.round(e * 100) / 100);
function $e(e, t, n) {
	let r = (t) => e.length > 1 ? t * n.w / (e.length - 1) : 0, i = (e) => Qe(e, t, n.h), a = i(0), o = [], s = [], c = [], l = () => {
		if (c.length > 0) {
			let e = (c.length === 1 ? [c[0], c[0]] : c).map((e, t) => `${t === 0 ? "M" : "L"}${L(e.x)} ${L(e.y)}`).join(" "), t = c[0], n = c[c.length - 1];
			o.push(e), s.push(`${e} L${L(n.x)} ${L(a)} L${L(t.x)} ${L(a)} Z`);
		}
		c = [];
	};
	return e.forEach((e, t) => {
		e === null ? l() : c.push({
			x: r(t),
			y: i(e)
		});
	}), l(), {
		lines: o,
		areas: s
	};
}
// src/history.ts
var et = 1e3, tt = 6e4, nt = 36e5;
function rt(e) {
	if (e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function it(e, t) {
	let n = 0, r = e.length;
	for (; n < r;) {
		let i = n + r >>> 1;
		e[i].t < t ? n = i + 1 : r = i;
	}
	return n;
}
function at(e, t) {
	let n = it(e, t.t);
	n < e.length && e[n].t === t.t ? e[n] = t : e.splice(n, 0, t);
}
function ot(e, t) {
	if (t.states) for (let [n, r] of Object.entries(t.states)) {
		let t = e.get(n);
		for (let i of r) {
			let r = i.lu ?? i.lc;
			r !== void 0 && (t || (t = [], e.set(n, t)), at(t, {
				t: r * 1e3,
				v: rt(i.s)
			}));
		}
	}
}
function st(e, t) {
	for (let n of e.values()) {
		let e = it(n, t);
		e > 1 && n.splice(0, e - 1);
	}
}
var ct = class {
	conn;
	onChange;
	now;
	store = /* @__PURE__ */ new Map();
	activeKey;
	hours = 0;
	generation = 0;
	unsub;
	debounceTimer;
	trimTimer;
	pendingKey;
	activeIds = [];
	listening = !1;
	onReady = () => {
		this.unsub = void 0, this.debounceTimer === void 0 ? this.activeKey !== void 0 && this.activeIds.length !== 0 && this.subscribe(this.activeIds, this.hours, this.activeKey) : this.activeKey = void 0;
	};
	constructor(e, t, n = Date.now) {
		this.conn = e, this.onChange = t, this.now = n;
	}
	update(e, t) {
		let n = [...new Set(e)].sort(), r = `${n.join(",")}|${t}`;
		r !== (this.debounceTimer ? this.pendingKey : this.activeKey) && (this.clearDebounce(), r !== this.activeKey && (this.pendingKey = r, this.debounceTimer = setTimeout(() => {
			this.debounceTimer = void 0, this.subscribe(n, t, r);
		}, et)));
	}
	close() {
		this.clearDebounce(), this.generation++, this.teardown(), this.activeKey = void 0, this.activeIds = [], this.listening && this.conn.removeEventListener("ready", this.onReady), this.listening = !1;
	}
	clearDebounce() {
		this.debounceTimer !== void 0 && clearTimeout(this.debounceTimer), this.debounceTimer = void 0, this.pendingKey = void 0;
	}
	teardown() {
		this.trimTimer !== void 0 && clearInterval(this.trimTimer), this.trimTimer = void 0;
		let e = this.unsub;
		this.unsub = void 0, e && e().catch(() => {}), this.store.clear();
	}
	subscribe(e, t, n) {
		let r = this.store.size > 0;
		this.teardown(), r && this.onChange();
		let i = ++this.generation;
		if (this.activeKey = n, this.activeIds = e, this.hours = t, e.length === 0) return;
		this.listening ||= (this.conn.addEventListener("ready", this.onReady), !0);
		let a = this.now() - t * nt;
		this.trimTimer = setInterval(() => st(this.store, this.now() - this.hours * nt), tt), this.conn.subscribeMessage((e) => {
			i === this.generation && (ot(this.store, e), this.onChange());
		}, {
			type: "history/stream",
			entity_ids: e,
			start_time: new Date(a).toISOString(),
			minimal_response: !0,
			no_attributes: !0,
			significant_changes_only: !1
		}, { resubscribe: !1 }).then((e) => {
			i === this.generation ? this.unsub = e : e().catch(() => {});
		}).catch((e) => {
			i === this.generation && console.error("powermeter-card: history/stream subscription failed", e);
		});
	}
}, R = {
	normal: {
		r: 67,
		g: 160,
		b: 71
	},
	warning: {
		r: 255,
		g: 166,
		b: 0
	},
	critical: {
		r: 219,
		g: 68,
		b: 55
	}
}, lt = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i, ut = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i, dt = /^var\(\s*(--[^,\s)]+)\s*(?:,[^)]*)?\)$/;
function z(e) {
	return Math.max(0, Math.min(255, Math.round(e)));
}
function ft(e) {
	let t = e.trim(), n = lt.exec(t);
	if (n) {
		let e = n[1];
		return e.length === 3 && (e = [...e].map((e) => e + e).join("")), {
			r: parseInt(e.slice(0, 2), 16),
			g: parseInt(e.slice(2, 4), 16),
			b: parseInt(e.slice(4, 6), 16)
		};
	}
	let r = ut.exec(t);
	return r ? {
		r: z(Number(r[1])),
		g: z(Number(r[2])),
		b: z(Number(r[3]))
	} : null;
}
var pt = "rgba(1, 2, 3, 0.004)", mt = /* @__PURE__ */ new WeakMap();
function ht(e) {
	let t = e.shadowRoot ?? e, n = mt.get(t);
	if (n?.parentElement?.parentNode !== t) {
		let e = document.createElement("span");
		e.setAttribute("aria-hidden", "true"), e.style.display = "none", e.style.color = pt, n = document.createElement("span"), e.append(n), t.append(e), mt.set(t, n);
	}
	return n;
}
function gt(e, t) {
	let n = ht(e);
	if (n.style.color = "", n.style.color = t, !n.style.color) return null;
	let r = getComputedStyle(n).color.trim(), i = getComputedStyle(n.parentElement).color.trim();
	return r === "" || r === i ? null : ft(r);
}
function B(e, t, n) {
	let r = t.trim(), i = r, a = dt.exec(i);
	return a && (i = getComputedStyle(e).getPropertyValue(a[1]).trim()), ft(i) ?? gt(e, r) ?? n;
}
function _t(e, t) {
	return {
		normal: B(e, t.normal, R.normal),
		warning: B(e, t.warning, R.warning),
		critical: B(e, t.critical, R.critical)
	};
}
function vt(e, t, n) {
	return {
		r: Math.round(e.r + (t.r - e.r) * n),
		g: Math.round(e.g + (t.g - e.g) * n),
		b: Math.round(e.b + (t.b - e.b) * n)
	};
}
function yt(e, t, n) {
	return n > t ? (e - t) / (n - t) : 1;
}
function V(e) {
	return `rgb(${e.r}, ${e.g}, ${e.b})`;
}
function H(e, t, n, r) {
	let i = t.twoSided ? Math.abs(e) : e;
	return r ? i <= t.normal ? V(n.normal) : i >= t.critical ? V(n.critical) : i <= t.warning ? V(vt(n.normal, n.warning, yt(i, t.normal, t.warning))) : V(vt(n.warning, n.critical, yt(i, t.warning, t.critical))) : i < t.warning ? V(n.normal) : i < t.critical ? V(n.warning) : V(n.critical);
}
// src/sparkline.ts
var U = 60, W = 24;
function bt(e, t, n, r, i) {
	let { lines: a, areas: o } = $e(e, n, {
		w: U,
		h: W
	}), s = `cpm-grad-${i}`, c = e.length, l = Qe(0, n, W);
	return w`
    <svg viewBox="0 0 ${U} ${W}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${U} y2="0">
          ${e.map((e, n) => t[n] ?? t[t.length - 1] ?? "currentColor").map((e, t) => w`<stop offset=${c > 1 ? t / (c - 1) : 0} stop-color=${e}></stop>`)}
        </linearGradient>
      </defs>
      ${r ? w`<line class="zero" x1="0" y1=${l} x2=${U} y2=${l} stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"></line>` : ""}
      ${o.map((e) => w`<path class="area" d=${e} fill="url(#${s})" fill-opacity="0.15"></path>`)}
      ${a.map((e) => w`<path class="line" d=${e} fill="none" stroke="url(#${s})" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>`)}
    </svg>
  `;
}
// src/card.ts
var xt = 60, St = 36e5, Ct = 10, wt = "custom:constant-powermeter-card", Tt = 15e3;
function Et(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Dt(e) {
	return e === void 0 || !Number.isFinite(e) ? 0 : Math.min(Ct, Math.max(0, Math.round(e)));
}
function Ot(e, t, n, r) {
	let i = e.find((e) => e !== null);
	if (i === void 0) return [];
	let a = H(i, t, n, r);
	return e.map((e) => (e !== null && (a = H(e, t, n, r)), a));
}
var kt = class extends M {
	static properties = {
		hass: { attribute: !1 },
		preview: { type: Boolean },
		config: { state: !0 }
	};
	palette;
	history;
	tickTimer;
	tickMs = 0;
	formats = /* @__PURE__ */ new Map();
	constructor() {
		super(), this.preview = !1;
	}
	static getConfigElement() {
		return document.createElement("constant-powermeter-card-editor");
	}
	static getStubConfig(e) {
		let t = Object.values(e.states).filter((e) => e.entity_id.startsWith("sensor."));
		return {
			type: wt,
			meters: [(t.find((e) => e.attributes.device_class === "power" || e.attributes.unit_of_measurement === "W" || e.attributes.unit_of_measurement === "kW") ?? t[0])?.entity_id ?? "sensor.power"]
		};
	}
	setConfig(e) {
		this.config = I(e), this.palette = void 0, this.syncHistory(), this.syncTick();
	}
	getCardSize() {
		if (!this.config) return 1;
		let e = this.config.meters.reduce((e, t) => e + (t.display.includes("bar") ? 2 : 1), 0);
		return +!!this.config.title + Math.max(1, Math.ceil(e / 2));
	}
	connectedCallback() {
		super.connectedCallback(), this.syncHistory(), this.syncTick();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.history?.close(), this.history = void 0, this.stopTick();
	}
	syncTick() {
		if (!this.isConnected || !this.config) return;
		let e = Math.max(Tt, this.config.hours * St / xt);
		(this.tickTimer === void 0 || e !== this.tickMs) && (this.stopTick(), this.tickMs = e, this.tickTimer = setInterval(() => this.requestUpdate(), e));
	}
	stopTick() {
		this.tickTimer !== void 0 && clearInterval(this.tickTimer), this.tickTimer = void 0, this.tickMs = 0;
	}
	syncHistory() {
		this.isConnected && this.hass && this.config && (this.history ??= new ct(this.hass.connection, () => this.requestUpdate()), this.history.update(this.config.meters.map((e) => e.entity), this.config.hours));
	}
	shouldUpdate(e) {
		if (!e.has("hass") || e.size > 1) return !0;
		let t = e.get("hass"), n = this.hass;
		return !t || !n || !this.config || t.themes !== n.themes || t.locale !== n.locale || t.entities !== n.entities || this.config.meters.some((e) => t.states[e.entity] !== n.states[e.entity]);
	}
	willUpdate(e) {
		if (!e.has("hass")) return;
		let t = e.get("hass");
		t && t.themes !== this.hass?.themes && (this.palette = void 0), this.history || this.syncHistory();
	}
	format(e, t) {
		let n = this.hass?.locale?.language, r = `${n ?? ""}|${t}`, i = this.formats.get(r);
		return i || (i = new Intl.NumberFormat(n, {
			minimumFractionDigits: t,
			maximumFractionDigits: t
		}), this.formats.set(r, i)), i.format(e);
	}
	clickable(e) {
		return !this.preview && e.tapAction.action !== "none";
	}
	act(e, t) {
		this.clickable(t) && Ie(e.currentTarget, t.tapAction, t.entity);
	}
	onKey(e, t) {
		e.key !== "Enter" && e.key !== " " || e.repeat || (e.preventDefault(), this.act(e, t));
	}
	render() {
		let e = this.config;
		if (!e || !this.hass) return E;
		let t = this.palette ?? _t(this, e.colors);
		this.isConnected && (this.palette = t);
		let n = Date.now();
		return C`
      <ha-card .header=${e.title}>
        <div class="rows">${e.meters.map((r, i) => this.renderRow(e, r, i, t, n))}</div>
      </ha-card>
    `;
	}
	renderRow(e, t, n, r, i) {
		let a = this.hass.states[t.entity], o = Et(a?.state), s = t.name ?? a?.attributes.friendly_name ?? t.entity, c = t.unit ?? a?.attributes.unit_of_measurement ?? "", l = Dt(t.precision ?? this.hass.entities?.[t.entity]?.display_precision), u = this.clickable(t);
		return C`
      <div
        class="row"
        role=${u ? "button" : E}
        tabindex=${u ? "0" : E}
        @click=${(e) => this.act(e, t)}
        @keydown=${(e) => this.onKey(e, t)}
      >
        <div class="line">
          <span class="name" title=${s}>${s}</span>
          <span class="spark">
            ${t.display.includes("sparkline") ? this.renderSpark(e, t, o, r, i, n) : E}
          </span>
          <span class="value"
            >${o === null ? "—" : this.format(o, l)}${o !== null && c ? C`<span class="unit">${c}</span>` : E}</span
          >
        </div>
        ${t.display.includes("bar") ? this.renderBar(e, t, o, r) : E}
      </div>
    `;
	}
	renderSpark(e, t, n, r, i, a) {
		let o = Le(this.history?.store.get(t.entity) ?? [], {
			start: i - e.hours * St,
			end: i,
			count: xt,
			twoSided: t.twoSided
		});
		return o[o.length - 1] = n, bt(o, Ot(o, t, r, e.blend), Ze(o, t, e.scale), t.twoSided, String(a));
	}
	renderBar(e, t, n, r) {
		let i = t.twoSided ? Xe(0, t.min, t.max).zero : null, a = E;
		if (n !== null) {
			let i = Xe(n, t.min, t.max), o = H(n, t, r, e.blend);
			a = C`<div
        class="fill"
        style="left: ${i.left}%; width: ${i.width}%; background: ${o}"
      ></div>`;
		}
		return C`
      <div class="track">
        ${a}${i === null ? E : C`<div class="zero" style="left: ${i}%"></div>`}
      </div>
    `;
	}
	static styles = s`
    :host {
      display: block;
    }
    /* One grid for the whole panel: every row shares the name, sparkline and value
       columns, so sparklines and values line up across meters. */
    .rows {
      display: grid;
      grid-template-columns: var(--cpm-name-width, 8em) minmax(0, 1fr) auto;
      column-gap: 12px;
      padding: 8px 0;
    }
    .row {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      align-items: center;
      padding: 6px 16px;
      outline: none;
    }
    .row[role='button'] {
      cursor: pointer;
    }
    .row[role='button']:hover {
      background: var(--secondary-background-color);
    }
    .row[role='button']:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .line {
      display: contents;
    }
    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--primary-text-color);
    }
    .spark {
      min-width: 0;
      height: 24px;
      color: var(--secondary-text-color);
    }
    .spark svg {
      display: block;
      width: 100%;
      height: 24px;
      overflow: visible;
    }
    .value {
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      text-align: right;
    }
    .unit {
      margin-left: 0.25em;
    }
    .track {
      grid-column: 1 / -1;
      position: relative;
      height: 6px;
      margin-top: 6px;
      border-radius: 3px;
      background: var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .fill {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 3px;
      transition:
        width 300ms ease,
        left 300ms ease;
    }
    .zero {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 1px;
      margin-left: -0.5px;
      background: var(--secondary-text-color);
    }
    @media (prefers-reduced-motion: reduce) {
      .fill {
        transition: none;
      }
    }
  `;
}, G = [
	"normal",
	"warning",
	"critical"
], K = G, At = [
	"entity",
	"name",
	"unit",
	"precision",
	"min",
	"max",
	"normal",
	"warning",
	"critical"
], jt = 0, q = I({
	type: "",
	meters: ["sensor.x"]
}), Mt = q.meters[0].max, J = {
	order: "Normal ≤ Warning ≤ Critical",
	negative: "Use a positive value: two-sided thresholds apply to |value|",
	range: "Max must be above Min",
	twoSided: "Two-sided: thresholds apply to |value|"
}, Nt = {
	title: "Title",
	display: "Display",
	hours: "Window (hours)",
	sparkline_scale: "Sparkline scale",
	blend: "Blend between levels",
	entity: "Entity",
	name: "Name",
	unit: "Unit",
	precision: "Precision",
	min: "Min",
	max: "Max",
	normal: "Normal",
	warning: "Warning",
	critical: "Critical",
	tap_action: "Tap action",
	navigation_path: "Navigation path",
	url_path: "URL"
}, Pt = {
	normal: "Normal color",
	warning: "Warning color",
	critical: "Critical color"
};
function Ft(e) {
	return e === void 0 || e === "" || Array.isArray(e) && e.length === 0;
}
function It(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) Ft(r) ? delete n[e] : n[e] = r;
	return n;
}
function Lt(e) {
	return typeof e == "string" ? { entity: e } : { ...e };
}
function Y(e, t) {
	return Number.isInteger(t) && t >= 0 && t < e.meters.length;
}
function Rt(e, t) {
	return {
		...e,
		meters: [...e.meters, { entity: t }]
	};
}
function zt(e, t) {
	return Y(e, t) ? {
		...e,
		meters: e.meters.filter((e, n) => n !== t)
	} : e;
}
function Bt(e, t, n) {
	let r = t + n;
	if (!Y(e, t) || !Y(e, r)) return e;
	let i = [...e.meters];
	return [i[t], i[r]] = [i[r], i[t]], {
		...e,
		meters: i
	};
}
function Vt(e, t, n) {
	if (!Y(e, t)) return e;
	let r = Lt(e.meters[t]), i = It(r, n);
	if (Z(r, i)) return e;
	let a = [...e.meters];
	return a[t] = i, {
		...e,
		meters: a
	};
}
function Ht(e, t) {
	return It(e, t);
}
function Ut(e, t, n) {
	let r = It(e.colors ?? {}, { [t]: n });
	return Ht(e, { colors: Object.keys(r).length > 0 ? r : void 0 });
}
function Wt(e) {
	return Math.round(e * 100) / 100;
}
function Gt(e) {
	let t = e.twoSided ? 0 : e.min, n = e.twoSided ? Math.max(-e.min, e.max) : e.max, r = (e) => Math.min(100, Math.max(0, Wt((e - t) * 100 / (n - t)))), i = r(e.normal), a = r(e.warning);
	return {
		normal: [0, i],
		warning: [i, a],
		critical: [a, 100]
	};
}
function Kt(e, t) {
	let n = {};
	if (e.errors.includes("range") && (n.max = J.range), e.errors.includes("thresholds_negative")) {
		let e = K.filter((e) => (t?.[e] ?? 0) < 0);
		for (let t of e.length > 0 ? e : ["normal"]) n[t] = J.negative;
	}
	if (e.errors.includes("thresholds_order")) {
		let r = t ? qt(t, e.twoSided) : [];
		for (let e of r.length > 0 ? r : ["warning"]) n[e] ??= J.order;
	}
	return n;
}
function qt(e, t) {
	let n = [], r = -Infinity;
	for (let i of K) {
		let a = e[i];
		if (typeof a != "number" || !Number.isFinite(a)) continue;
		let o = t ? Math.abs(a) : a;
		o < r && n.push(i), r = Math.max(r, o);
	}
	return n;
}
function Jt(e, t) {
	return Array.isArray(e) && Array.isArray(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e === t;
}
function Yt(e, t) {
	let n = {};
	for (let r of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) Jt(e[r], t[r]) || (n[r] = t[r]);
	return n;
}
function Xt(e) {
	let t = e?.includes("sparkline") ?? !1, n = e?.includes("bar") ?? !1;
	return t && n ? "both" : t ? "sparkline" : n ? "bar" : "default";
}
var Zt = {
	default: void 0,
	sparkline: ["sparkline"],
	bar: ["bar"],
	both: ["sparkline", "bar"]
};
function Qt(e, t) {
	let n = Lt(e), r = {};
	for (let e of At) n[e] !== void 0 && (r[e] = n[e]);
	r.display = Xt(n.display);
	let i = n.tap_action;
	return r.tap_action = t ?? i?.action ?? "more-info", i?.action === "navigate" && (r.navigation_path = i.navigation_path), i?.action === "url" && (r.url_path = i.url_path), r;
}
function X(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : void 0;
}
function $t(e, t, n) {
	if (e === "none") return { action: "none" };
	let r = X(t);
	if (e === "navigate" && r) return {
		action: "navigate",
		navigation_path: r
	};
	let i = X(n);
	if (e === "url" && i) return {
		action: "url",
		url_path: i
	};
}
function en(e) {
	if (e.tap_action === "navigate" && !X(e.navigation_path)) return "navigate";
	if (e.tap_action === "url" && !X(e.url_path)) return "url";
}
function Z(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e) || Array.isArray(t)) return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((e, n) => Z(e, t[n]));
	if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => n in t && Z(e[n], t[n]));
}
function tn(e, t) {
	return Z(e, t);
}
function nn(e, t, n) {
	let r = {};
	for (let t of At) t in e && (r[t] = Ft(e[t]) ? void 0 : e[t]);
	if (r.entity === void 0 && delete r.entity, "display" in e && (r.display = Zt[e.display]), "tap_action" in e || "navigation_path" in e || "url_path" in e) {
		let i = t.tap_action, a = (t) => t in e ? e[t] : i && t in i ? i[t] : void 0;
		r.tap_action = $t("tap_action" in e ? e.tap_action : n ?? i?.action ?? "more-info", a("navigation_path"), a("url_path"));
	}
	return r;
}
var Q = {
	step: "any",
	mode: "box"
};
function rn(e, t) {
	return e.meters.filter((e, n) => n !== t).map((e) => typeof e == "string" ? e : e.entity).filter((e) => typeof e == "string" && e !== "");
}
function an(e = []) {
	let t = { filter: { domain: "sensor" } };
	return e.length > 0 && (t.exclude_entities = e), { entity: t };
}
function on(e, t = []) {
	let n = [
		{
			name: "entity",
			required: !0,
			selector: an(t)
		},
		{
			name: "name",
			selector: { text: {} }
		},
		{
			name: "unit",
			selector: { text: {} }
		},
		{
			name: "precision",
			selector: { number: {
				min: 0,
				max: 10,
				step: 1,
				mode: "box"
			} }
		},
		{
			name: "min",
			selector: { number: Q }
		},
		{
			name: "max",
			selector: { number: Q }
		},
		{
			name: "normal",
			selector: { number: Q }
		},
		{
			name: "warning",
			selector: { number: Q }
		},
		{
			name: "critical",
			selector: { number: Q }
		},
		{
			name: "display",
			selector: { select: {
				mode: "dropdown",
				options: [
					{
						value: "default",
						label: "Panel default"
					},
					{
						value: "sparkline",
						label: "Sparkline"
					},
					{
						value: "bar",
						label: "Bar"
					},
					{
						value: "both",
						label: "Both"
					}
				]
			} }
		},
		{
			name: "tap_action",
			selector: { select: {
				mode: "dropdown",
				options: [
					{
						value: "more-info",
						label: "More info"
					},
					{
						value: "navigate",
						label: "Navigate"
					},
					{
						value: "url",
						label: "URL"
					},
					{
						value: "none",
						label: "None"
					}
				]
			} }
		}
	];
	return e === "navigate" && n.push({
		name: "navigation_path",
		selector: { text: {} }
	}), e === "url" && n.push({
		name: "url_path",
		selector: { text: { type: "url" } }
	}), n;
}
function sn(e) {
	return String(Wt(e));
}
function cn(e, t, n, r = {}) {
	let i = t[e], a = i === void 0 || i === "", o = K.includes(e);
	if (n?.twoSided && (e === "min" || o && !a)) return J.twoSided;
	if (a) {
		if (o && n) {
			let t = `Default: ${sn(n.errors.includes("thresholds_order") ? Ke(n.min, n.max)[e] : n[e])}`;
			return n.twoSided ? `${t} · two-sided, thresholds apply to |value|` : t;
		}
		if (e === "min") return `Default: ${jt}`;
		if (e === "max") return `Default: ${Mt}`;
		if (e === "name" && r.friendly_name) return `Default: ${r.friendly_name}`;
		if (e === "unit" && r.unit_of_measurement) return `Default: ${r.unit_of_measurement}`;
	}
}
function ln(e, t = {}) {
	let n = Lt(e);
	return n.name || t.friendly_name || n.entity;
}
function un(e, t) {
	try {
		return I({
			...e,
			meters: [e.meters[t]]
		}).meters[0];
	} catch {
		return;
	}
}
var dn = [
	{
		name: "title",
		selector: { text: {} }
	},
	{
		name: "display",
		selector: { select: {
			multiple: !0,
			mode: "list",
			options: [{
				value: "sparkline",
				label: "Sparkline"
			}, {
				value: "bar",
				label: "Bar"
			}]
		} }
	},
	{
		name: "hours",
		selector: { number: {
			min: .25,
			max: 24,
			step: .25,
			mode: "box"
		} }
	},
	{
		name: "sparkline_scale",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "fixed",
				label: "Fixed (min to max)"
			}, {
				value: "auto",
				label: "Auto (data range)"
			}]
		} }
	},
	{
		name: "blend",
		selector: { boolean: {} }
	}
];
function fn(e) {
	let t = {};
	return e.title !== void 0 && (t.title = e.title), t.display = e.display ?? [...q.display], t.hours = e.hours ?? q.hours, t.sparkline_scale = e.sparkline_scale ?? q.scale, t.blend = e.blend ?? q.blend, t;
}
function pn(e) {
	let t = {};
	for (let n of dn.map((e) => e.name)) n in e && (t[n] = Ft(e[n]) ? void 0 : e[n]);
	return t;
}
// src/editor.ts
var mn = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", hn = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", gn = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", _n = (e) => [{
	name: "entity",
	selector: an(rn(e))
}], vn = (e) => Nt[e.name] ?? e.name, yn = () => customElements.get("ha-form") !== void 0 && customElements.get("ha-expansion-panel") !== void 0;
async function bn() {
	if (yn()) return !1;
	try {
		let e = await window.loadCardHelpers?.();
		if (!e) return !1;
		let t = await e.createCardElement({
			type: "entities",
			entities: []
		});
		return await (customElements.get("hui-entities-card") ?? t.constructor).getConfigElement?.(), !0;
	} catch {
		return !1;
	}
}
var xn = class extends M {
	static properties = {
		hass: { attribute: !1 },
		config: { state: !0 },
		pending: { state: !0 }
	};
	loadStarted = !1;
	constructor() {
		super(), this.pending = {};
	}
	connectedCallback() {
		super.connectedCallback(), this.loadStarted || (this.loadStarted = !0, bn().then((e) => {
			e && this.requestUpdate();
		}));
	}
	setConfig(e) {
		this.config = {
			...e,
			meters: Array.isArray(e.meters) ? e.meters : []
		};
	}
	commit(e, t = !1) {
		t && (this.pending = {}), this.config && tn(e, this.config) || (this.config = e, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: e },
			bubbles: !0,
			composed: !0
		})));
	}
	attrs(e) {
		return e && this.hass?.states[e]?.attributes || {};
	}
	onPanelChanged(e, t) {
		t.stopPropagation();
		let n = Yt(fn(e), t.detail.value);
		this.commit(Ht(e, pn(n)));
	}
	onColorChanged(e, t, n) {
		n.stopPropagation();
		let r = n.detail.value[t];
		this.commit(Ut(e, t, typeof r == "string" ? r.trim() : void 0));
	}
	onMeterChanged(e, t, n) {
		n.stopPropagation();
		let r = e.meters[t], i = typeof r == "string" ? { entity: r } : r, a = this.pending[t], o = Yt(Qt(r, a), n.detail.value);
		if (Object.keys(o).length === 0) return;
		let s = en(n.detail.value);
		if (s !== a) {
			let e = { ...this.pending };
			s ? e[t] = s : delete e[t], this.pending = e;
		}
		this.commit(Vt(e, t, nn(o, i, a)));
	}
	onAdd(e, t) {
		t.stopPropagation();
		let n = t.detail.value.entity;
		typeof n == "string" && n !== "" && this.commit(Rt(e, n), !0);
	}
	onButton(e, t) {
		e.stopPropagation(), this.commit(t(), !0);
	}
	stop(e) {
		e.stopPropagation();
	}
	render() {
		let e = this.config;
		return e ? C`
      <div class="section">
        <h3>Panel</h3>
        <ha-form
          class="panel"
          .hass=${this.hass}
          .data=${fn(e)}
          .schema=${dn}
          .computeLabel=${vn}
          .computeHelper=${(e) => e.name === "hours" ? `Default: ${q.hours}` : void 0}
          @value-changed=${(t) => this.onPanelChanged(e, t)}
        ></ha-form>
        ${G.map((t) => this.renderColor(e, t))}
      </div>
      <div class="section">
        <h3>Meters</h3>
        ${e.meters.map((t, n) => this.renderMeter(e, n))}
        <ha-form
          class="add"
          .hass=${this.hass}
          .data=${{}}
          .schema=${_n(e)}
          .computeLabel=${() => "Add meter"}
          @value-changed=${(t) => this.onAdd(e, t)}
        ></ha-form>
      </div>
    ` : E;
	}
	renderColor(e, t) {
		let n = e.colors?.[t], r = q.colors[t];
		return C`
      <div class="color-row">
        <span class="swatch swatch-${t}" style="background: ${n || r}"></span>
        <ha-form
          class="color-${t}"
          .hass=${this.hass}
          .data=${n === void 0 ? {} : { [t]: n }}
          .schema=${[{
			name: t,
			selector: { text: {} }
		}]}
          .computeLabel=${() => Pt[t]}
          .computeHelper=${() => `Default: ${r}`}
          @value-changed=${(n) => this.onColorChanged(e, t, n)}
        ></ha-form>
      </div>
    `;
	}
	renderMeter(e, t) {
		let n = e.meters[t], r = typeof n == "string" ? { entity: n } : n, i = this.attrs(r.entity), a = un(e, t), o = Qt(n, this.pending[t]), s = e.meters.length - 1;
		return C`
      <ha-expansion-panel outlined data-index=${t} .header=${ln(n, i)}>
        <div slot="icons" class="buttons" @click=${this.stop} @keydown=${this.stop}>
          <ha-icon-button
            class="up"
            .label=${"Move up"}
            .path=${mn}
            ?disabled=${t === 0}
            @click=${(n) => this.onButton(n, () => Bt(e, t, -1))}
          ></ha-icon-button>
          <ha-icon-button
            class="down"
            .label=${"Move down"}
            .path=${hn}
            ?disabled=${t === s}
            @click=${(n) => this.onButton(n, () => Bt(e, t, 1))}
          ></ha-icon-button>
          <ha-icon-button
            class="delete"
            .label=${"Remove meter"}
            .path=${gn}
            ?disabled=${s === 0}
            @click=${(n) => this.onButton(n, () => zt(e, t))}
          ></ha-icon-button>
        </div>
        <ha-form
          class="meter"
          .hass=${this.hass}
          .data=${o}
          .schema=${on(String(o.tap_action), rn(e, t))}
          .error=${a ? Kt(a, r) : {}}
          .computeLabel=${vn}
          .computeHelper=${(e) => cn(e.name, r, a, i)}
          @value-changed=${(n) => this.onMeterChanged(e, t, n)}
        ></ha-form>
        ${a ? this.renderBands(e, a) : E}
      </ha-expansion-panel>
    `;
	}
	renderBands(e, t) {
		let n = Gt(t), r = (t) => e.colors?.[t] || q.colors[t];
		return C`<div
      class="bands"
      role="img"
      aria-label="Threshold preview"
      style="background: linear-gradient(to right, ${G.map((e) => `${r(e)} ${n[e][0]}% ${n[e][1]}%`).join(", ")})"
    ></div>`;
	}
	static styles = s`
    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    h3 {
      margin: 0;
      font-size: 1em;
      font-weight: 500;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-row ha-form {
      flex: 1;
    }
    .swatch {
      width: 24px;
      height: 24px;
      flex: none;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
    }
    .buttons {
      display: flex;
    }
    ha-expansion-panel ha-form {
      display: block;
      padding-top: 8px;
    }
    .bands {
      height: 8px;
      margin: 12px 0 8px;
      border-radius: 4px;
    }
  `;
}, $ = "constant-powermeter-card", Sn = `${$}-editor`;
console.info(`${$} v${e}`), customElements.get($) || customElements.define($, kt), customElements.get(Sn) || customElements.define(Sn, xn);
var Cn = window;
Cn.customCards ??= [], Cn.customCards.some((e) => e.type === $) || Cn.customCards.push({
	type: $,
	name: "Constant Powermeter Card",
	preview: !0,
	description: "Power meters with per-meter thresholds, a sparkline and a bar.",
	documentationURL: "https://github.com/uded/constant-powermeter-card"
});
