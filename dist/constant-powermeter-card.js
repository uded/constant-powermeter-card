// package.json
var e = "0.2.1", t = globalThis, n = t.ShadowRoot && (t.ShadyCSS === void 0 || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, r = Symbol(), i = /* @__PURE__ */ new WeakMap(), a = class {
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
})(e) : e, { is: u, defineProperty: d, getOwnPropertyDescriptor: f, getOwnPropertyNames: p, getOwnPropertySymbols: m, getPrototypeOf: ee } = Object, te = globalThis, ne = te.trustedTypes, re = ne ? ne.emptyScript : "", ie = te.reactiveElementPolyfillSupport, h = (e, t) => e, ae = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, oe = (e, t) => !u(e, t), se = {
	attribute: !0,
	type: String,
	converter: ae,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), te.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && d(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = f(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? se;
	}
	static _$Ei() {
		if (this.hasOwnProperty(h("elementProperties"))) return;
		let e = ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(h("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(h("properties"))) {
			let e = this.properties, t = [...p(e), ...m(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? ae : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ae : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? oe)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[h("elementProperties")] = /* @__PURE__ */ new Map(), g[h("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: g }), (te.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var ce = globalThis, le = (e) => e, ue = ce.trustedTypes, de = ue ? ue.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, fe = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, pe = "?" + _, me = `<${pe}>`, v = document, y = () => v.createComment(""), b = (e) => e === null || typeof e != "object" && typeof e != "function", he = Array.isArray, ge = (e) => he(e) || typeof e?.[Symbol.iterator] == "function", _e = "[ 	\n\f\r]", x = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, ye = />/g, S = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, xe = /"/g, Se = /^(?:script|style|textarea|title)$/i, Ce = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), C = Ce(1), w = Ce(2), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), D = v.createTreeWalker(v, 129);
function Te(e, t) {
	if (!he(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return de === void 0 ? t : de.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = x;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === x ? c[1] === "!--" ? o = ve : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = S) : (Se.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = S) : o = ye : o === S ? c[0] === ">" ? (o = i ?? x, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? S : c[3] === "\"" ? xe : be) : o === xe || o === be ? o = S : o === ve || o === ye ? o = x : (o = S, i = void 0);
		let d = o === S && e[t + 1].startsWith("/>") ? " " : "";
		a += o === x ? n + me : l >= 0 ? (r.push(s), n.slice(0, l) + fe + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, De = class e {
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(fe)) {
					let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ae : r[1] === "?" ? je : r[1] === "@" ? Me : k
					}), i.removeAttribute(e);
				} else e.startsWith(_) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Se.test(i.tagName)) {
					let e = i.textContent.split(_), t = e.length - 1;
					if (t > 0) {
						i.textContent = ue ? ue.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], y()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], y());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === pe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += _.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = v.createElement("template");
		return n.innerHTML = e, n;
	}
};
function O(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = b(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = O(e, i._$AS(e, t.values), i, r)), t;
}
var Oe = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new ke(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ne(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = v, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, ke = class e {
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
		e = O(this, e, t), b(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && b(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = De.createElement(Te(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Oe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = we.get(e.strings);
		return t === void 0 && we.set(e.strings, t = new De(e)), t;
	}
	k(t) {
		he(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(y()), this.O(y()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = le(e).nextSibling;
			le(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, k = class {
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
		if (i === void 0) e = O(this, e, t, 0), a = !b(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = O(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !b(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ae = class extends k {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, je = class extends k {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, Me = class extends k {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = O(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ne = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		O(this, e);
	}
}, Pe = {
	M: fe,
	P: _,
	A: pe,
	C: 1,
	L: Ee,
	R: Oe,
	D: ge,
	V: O,
	I: ke,
	H: k,
	N: je,
	U: Me,
	B: Ae,
	F: Ne
}, Fe = ce.litHtmlPolyfillSupport;
Fe?.(De, ke), (ce.litHtmlVersions ??= []).push("3.3.3");
var Ie = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new ke(t.insertBefore(y(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Le = globalThis, A = class extends g {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ie(t, this.renderRoot, this.renderOptions);
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
A._$litElement$ = !0, A.finalized = !0, Le.litElementHydrateSupport?.({ LitElement: A });
var Re = Le.litElementPolyfillSupport;
Re?.({ LitElement: A }), (Le.litElementVersions ??= []).push("4.2.2");
// src/actions.ts
function ze(e, t, n) {
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
function Be(e, t) {
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
function Ve(e, t) {
	let n = Array(t.count), r = (t.end - t.start) / t.count, i = 0, a = null;
	for (let o = 0; o < t.count; o++) {
		let s = t.start + o * r, c = o === t.count - 1 ? t.end : t.start + (o + 1) * r;
		for (; i < e.length && e[i].t <= s;) a = e[i++].v;
		let l = 0, u = 0, d = s;
		for (; i < e.length && e[i].t < c;) {
			let { t, v: n } = e[i++];
			a !== null && (l += a * (t - d), u += t - d), d = t, a = n;
		}
		a !== null && (l += a * (c - d), u += c - d), n[o] = u === 0 ? null : l / u;
	}
	return n;
}
// src/geometry.ts
function He(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function Ue(e, t, n) {
	let r = n - t, i = (e) => (He(e, t, n) - t) * 100 / r;
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
function We(e, t, n) {
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
function j(e, t, n) {
	let r = t.hi - t.lo || 1;
	return n - (He(e, t.lo, t.hi) - t.lo) / r * n;
}
var M = (e) => String(Math.round(e * 100) / 100);
function Ge(e, t, n) {
	let r = (t) => e.length > 1 ? t * n.w / (e.length - 1) : 0, i = (e) => j(e, t, n.h), a = i(0), o = [], s = [], c = [], l = () => {
		if (c.length > 0) {
			let e = (c.length === 1 ? [c[0], c[0]] : c).map((e, t) => `${t === 0 ? "M" : "L"}${M(e.x)} ${M(e.y)}`).join(" "), t = c[0], n = c[c.length - 1];
			o.push(e), s.push(`${e} L${M(n.x)} ${M(a)} L${M(t.x)} ${M(a)} Z`);
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
// src/types/chart.ts
var N = "__untracked", Ke = "Untracked", P = "var(--disabled-color, #bdbdbd)", F = 60, I = 24, qe = 1, L = {
	c: 50,
	r: 38,
	w: 14
}, R = (e) => String(Math.round(e * 100) / 100), Je = (e) => typeof e == "number" && Number.isFinite(e), Ye = (e, t) => t > 1 ? e / (t - 1) * F : F / 2;
function Xe(e, t) {
	let n = [], r = [];
	for (let i = 0; i < e; i++) t(i) ? r.push(i) : r.length > 0 && (n.push(r), r = []);
	return r.length > 0 && n.push(r), n;
}
var Ze = (e) => e.length === 1 ? [e[0], e[0]] : e, z = (e, t = "M") => e.map((e, n) => `${n === 0 ? t : "L"}${R(e.x)} ${R(e.y)}`).join(" ");
function Qe(e) {
	if (!(e.lo < 0)) return "";
	let t = R(j(0, e, I));
	return w`<path class="zero" d="M0 ${t} L${F} ${t}" fill="none" style="stroke: currentColor; stroke-opacity: 0.3" vector-effect="non-scaling-stroke"></path>`;
}
function $e(e, t, n) {
	return w`
    <svg viewBox="0 0 ${F} ${I}" preserveAspectRatio="none" role="img" aria-label=${n ?? E}>
      ${Qe(t)}
      ${e.map((e) => {
		let n = Math.min(e.lower.length, e.upper.length);
		return Xe(n, (t) => Je(e.lower[t]) && Je(e.upper[t])).map((r) => {
			let i = Ze(r.map((r) => ({
				x: Ye(r, n),
				y: j(e.upper[r], t, I)
			}))), a = Ze(r.map((r) => ({
				x: Ye(r, n),
				y: j(e.lower[r], t, I)
			}))).reverse();
			return w`
            <path class="band" d=${`${z(i)} ${z(a, "L")} Z`} style="fill: ${e.color}; fill-opacity: 0.6"></path>
            <path class="edge" d=${z(i)} fill="none" style="stroke: ${e.color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`;
		});
	})}
    </svg>
  `;
}
function et(e, t, n) {
	return w`
    <svg viewBox="0 0 ${F} ${I}" preserveAspectRatio="none" role="img" aria-label=${n ?? E}>
      ${Qe(t)}
      ${e.map((e) => {
		let n = e.buckets.length, r = e.key === "__untracked" ? "; stroke-dasharray: 3 2" : "";
		return Xe(n, (t) => Je(e.buckets[t])).map((i) => w`<path class="series" d=${z(Ze(i.map((r) => ({
			x: Ye(r, n),
			y: j(e.buckets[r], t, I)
		}))))} fill="none" style="stroke: ${e.color}${r}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`);
	})}
    </svg>
  `;
}
function tt(e) {
	let t = (e - 90) * Math.PI / 180;
	return {
		x: L.c + L.r * Math.cos(t),
		y: L.c + L.r * Math.sin(t)
	};
}
function nt(e, t) {
	let n = tt(e), r = tt(t), i = +(t - e > 180);
	return `M${R(n.x)} ${R(n.y)} A${L.r} ${L.r} 0 ${i} 1 ${R(r.x)} ${R(r.y)}`;
}
function rt(e, t) {
	let n = e.start + t / 2, r = e.end - t / 2;
	return !Number.isFinite(n) || !Number.isFinite(r) || r <= n ? [] : r - n >= 359.99 ? [nt(n, n + 180), nt(n + 180, n + 359.99)] : [nt(n, r)];
}
function it(e, t, n) {
	let r = e.length > 1 ? qe : 0;
	return C`
    <svg viewBox="0 0 100 100" role="img" aria-label=${n ?? E}>
      ${e.length === 0 ? w`<circle class="empty-ring" cx=${L.c} cy=${L.c} r=${L.r} fill="none" style="stroke: var(--divider-color, #e0e0e0)" stroke-width=${L.w}></circle>` : e.map((e) => rt(e, r).map((t) => w`<path class="slice" data-key=${e.key} d=${t} fill="none" style="stroke: ${e.color}" stroke-width=${L.w}></path>`))}
      <text
        class="center"
        x=${L.c}
        y=${L.c}
        text-anchor="middle"
        dominant-baseline="central"
        style="fill: currentColor"
      >
        ${t}
      </text>
    </svg>
  `;
}
function at(e) {
	return C`<div class="legend">
    ${e.map((e) => C`<span class="legend-item"
          ><span class="swatch" style="background: ${e.color}"></span>${e.name}</span
        >`)}
  </div>`;
}
// src/combine.ts
var ot = .05, st = {
	lo: 0,
	hi: 1
}, B = (e) => typeof e == "number" && Number.isFinite(e), ct = (e) => Array(e).fill(null);
function lt(e, t) {
	return e.map((e, n) => {
		if (!B(e)) return 0;
		let r = 0;
		for (let e of t) {
			let t = e.buckets[n];
			B(t) && t > 0 && (r += t);
		}
		return Math.max(0, e - r);
	});
}
function ut(e, t) {
	let n = Math.max(0, ...e.map((e) => e.buckets.length), t?.length ?? 0), r = e.map((e) => ({
		key: e.key,
		color: e.color,
		lower: ct(n),
		upper: ct(n)
	})), i = t ? {
		key: N,
		color: P,
		lower: ct(n),
		upper: ct(n)
	} : null;
	for (let a = 0; a < n; a++) {
		let n = t?.[a] ?? 0;
		if (e.every((e) => !B(e.buckets[a])) && !(n > 0)) continue;
		let o = 0, s = 0;
		e.forEach((e, t) => {
			let n = e.buckets[a], i = B(n) ? n : 0;
			i >= 0 ? (r[t].lower[a] = o, o += i, r[t].upper[a] = o) : (r[t].lower[a] = s, s += i, r[t].upper[a] = s);
		}), i && (i.lower[a] = o, i.upper[a] = o + n);
	}
	return i ? [...r, i] : r;
}
function dt(e) {
	let t = 0, n = 0;
	for (let r of e) B(r) && (r < t && (t = r), r > n && (n = r));
	let r = n - t;
	return r > 0 ? {
		lo: t < 0 ? t - r * ot : t,
		hi: n > 0 ? n + r * ot : n
	} : { ...st };
}
function ft(e) {
	return dt(e.flatMap((e) => [...e.lower, ...e.upper]));
}
function pt(e) {
	return dt(e.flatMap((e) => e.buckets));
}
function mt(e, t) {
	let n = [];
	for (let t of e) B(t.value) && t.value > 0 && n.push({
		key: t.key,
		name: t.name,
		color: t.color,
		value: t.value
	});
	let r = n.reduce((e, t) => e + t.value, 0), i = B(t) ? t : null;
	i !== null && i > r && n.push({
		key: N,
		name: Ke,
		color: P,
		value: i - r
	});
	let a = n.reduce((e, t) => e + t.value, 0);
	if (!(a > 0)) return {
		slices: [],
		center: i
	};
	let o = 0;
	return {
		slices: n.map((e, t) => {
			let r = o;
			return o = t === n.length - 1 ? 360 : o + e.value / a * 360, {
				...e,
				start: r,
				end: o
			};
		}),
		center: i ?? a
	};
}
function ht(e, t) {
	let n = e.reduce((e, t) => B(t) && t > 0 ? e + t : e, 0), r = B(t) && t > 0 ? t : n;
	return r > 0 ? e.map((e) => B(e) && e >= 0 ? Math.round(e / r * 100) : null) : e.map(() => null);
}
// src/config.ts
var gt = class extends Error {
	constructor(e) {
		super(e), this.name = "ConfigError";
	}
}, _t = ["sparkline", "bar"], vt = {
	normal: "var(--success-color)",
	warning: "var(--warning-color)",
	critical: "var(--error-color)"
}, yt = 5e3, bt = .25, xt = 24;
function St(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function V(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function H(e) {
	return typeof e == "string" && e !== "" ? e : void 0;
}
function Ct(e, t) {
	if (!Array.isArray(e)) return t;
	let n = e.filter((e) => e === "sparkline" || e === "bar");
	return n.length > 0 ? n : t;
}
function wt(e) {
	let t = (Array.isArray(e) ? e : [e]).filter((e) => e === "stacked" || e === "lines" || e === "donut"), n = t.filter((e) => e !== "donut");
	return {
		timeChart: n[0],
		donut: t.includes("donut"),
		warnings: new Set(n).size > 1 ? ["chart_conflict"] : []
	};
}
function Tt(e) {
	if (St(e)) {
		if (e.action === "none") return { action: "none" };
		if (e.action === "navigate" && H(e.navigation_path)) return {
			action: "navigate",
			navigation_path: e.navigation_path
		};
		if (e.action === "url" && H(e.url_path)) return {
			action: "url",
			url_path: e.url_path
		};
	}
	return { action: "more-info" };
}
function Et(e, t) {
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
function Dt(e, t) {
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
function Ot(e, t) {
	let n = typeof e == "string" ? { entity: e } : St(e) ? e : {}, r = H(n.entity);
	if (!r) throw new gt("Each meter needs an entity id");
	let i = [], a = V(n.min) ?? 0, o = V(n.max) ?? yt;
	o <= a && (i.push("range"), o = a + 1);
	let s = a < 0, c = [
		V(n.normal),
		V(n.warning),
		V(n.critical)
	];
	s && c.some((e) => e !== void 0 && e < 0) && (i.push("thresholds_negative"), c = c.map((e) => e === void 0 ? e : Math.abs(e)));
	let l = c.filter((e) => e !== void 0);
	l.some((e, t) => t > 0 && e < l[t - 1]) && i.push("thresholds_order");
	let [u, d, f] = Dt(c, Et(a, o)).sort((e, t) => e - t);
	return {
		entity: r,
		name: H(n.name),
		unit: H(n.unit),
		precision: V(n.precision),
		min: a,
		max: o,
		normal: u,
		warning: d,
		critical: f,
		twoSided: s,
		display: Ct(n.display, t),
		tapAction: Tt(n.tap_action),
		color: H(n.color),
		errors: i
	};
}
function kt(e) {
	if (!St(e)) throw new gt("Invalid configuration");
	if (!Array.isArray(e.meters) || e.meters.length === 0) throw new gt("At least one meter is required");
	let t = Ct(e.display, _t), n = St(e.colors) ? e.colors : {}, r = Math.min(xt, Math.max(bt, V(e.hours) ?? 1)), { timeChart: i, donut: a, warnings: o } = wt(e.chart);
	return {
		title: H(e.title),
		display: t,
		hours: r,
		scale: e.sparkline_scale === "auto" ? "auto" : "fixed",
		colors: {
			normal: H(n.normal) ?? vt.normal,
			warning: H(n.warning) ?? vt.warning,
			critical: H(n.critical) ?? vt.critical
		},
		blend: e.blend !== !1,
		timeChart: i,
		donut: a,
		rows: e.rows !== !1 || i === void 0 && !a,
		total: H(e.total),
		warnings: o,
		meters: e.meters.map((e) => Ot(e, t))
	};
}
// src/format.ts
function At(e) {
	switch (e?.number_format) {
		case "comma_decimal": return {
			locales: ["en-US", "en"],
			useGrouping: !0
		};
		case "decimal_comma": return {
			locales: [
				"de",
				"es",
				"it"
			],
			useGrouping: !0
		};
		case "space_comma": return {
			locales: [
				"fr",
				"sv",
				"cs"
			],
			useGrouping: !0
		};
		case "quote_decimal": return {
			locales: ["de-CH"],
			useGrouping: !0
		};
		case "system": return {
			locales: void 0,
			useGrouping: !0
		};
		case "none": return {
			locales: ["en-US", "en"],
			useGrouping: !1
		};
		default: return {
			locales: e?.language,
			useGrouping: !0
		};
	}
}
// src/history.ts
var jt = 1e3, Mt = 6e4, Nt = 36e5, Pt = 3;
function Ft(e) {
	return e === Pt || typeof e == "object" && !!e && e.code === Pt;
}
function It(e) {
	if (e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Lt(e, t) {
	let n = 0, r = e.length;
	for (; n < r;) {
		let i = n + r >>> 1;
		e[i].t < t ? n = i + 1 : r = i;
	}
	return n;
}
function Rt(e, t) {
	let n = Lt(e, t.t);
	n < e.length && e[n].t === t.t ? e[n] = t : e.splice(n, 0, t);
}
function zt(e, t) {
	if (t.states) for (let [n, r] of Object.entries(t.states)) {
		let t = e.get(n);
		for (let i of r) {
			let r = i.lu ?? i.lc;
			r !== void 0 && (t || (t = [], e.set(n, t)), Rt(t, {
				t: r * 1e3,
				v: It(i.s)
			}));
		}
	}
}
function Bt(e, t) {
	for (let n of e.values()) {
		let e = Lt(n, t);
		e > 1 && n.splice(0, e - 1);
	}
}
var Vt = class {
	conn;
	onChange;
	now;
	store = /* @__PURE__ */ new Map();
	storeVersion = 0;
	get version() {
		return this.storeVersion;
	}
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
		}, jt)));
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
		this.unsub = void 0, e && e().catch(() => {}), this.store.clear(), this.storeVersion++;
	}
	subscribe(e, t, n) {
		let r = this.store.size > 0;
		this.teardown(), r && this.onChange();
		let i = ++this.generation;
		if (this.activeKey = n, this.activeIds = e, this.hours = t, e.length === 0) return;
		this.listening ||= (this.conn.addEventListener("ready", this.onReady), !0);
		let a = this.now() - t * Nt;
		this.trimTimer = setInterval(() => {
			Bt(this.store, this.now() - this.hours * Nt), this.storeVersion++;
		}, Mt), this.conn.subscribeMessage((e) => {
			i === this.generation && (zt(this.store, e), this.storeVersion++, this.onChange());
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
			i === this.generation && !Ft(e) && console.error("powermeter-card: history/stream subscription failed", e);
		});
	}
}, Ht = {
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
}, Ut = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i, Wt = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i, Gt = /^var\(\s*(--[^,\s)]+)\s*(?:,[^)]*)?\)$/;
function Kt(e) {
	return Math.max(0, Math.min(255, Math.round(e)));
}
function qt(e) {
	let t = e.trim(), n = Ut.exec(t);
	if (n) {
		let e = n[1];
		return e.length === 3 && (e = [...e].map((e) => e + e).join("")), {
			r: parseInt(e.slice(0, 2), 16),
			g: parseInt(e.slice(2, 4), 16),
			b: parseInt(e.slice(4, 6), 16)
		};
	}
	let r = Wt.exec(t);
	return r ? {
		r: Kt(Number(r[1])),
		g: Kt(Number(r[2])),
		b: Kt(Number(r[3]))
	} : null;
}
var Jt = "rgba(1, 2, 3, 0.004)", Yt = /* @__PURE__ */ new WeakMap();
function Xt(e) {
	let t = e.shadowRoot ?? e, n = Yt.get(t);
	if (n?.parentElement?.parentNode !== t) {
		let e = document.createElement("span");
		e.setAttribute("aria-hidden", "true"), e.style.display = "none", e.style.color = Jt, n = document.createElement("span"), e.append(n), t.append(e), Yt.set(t, n);
	}
	return n;
}
function Zt(e, t) {
	let n = Xt(e);
	if (n.style.color = "", n.style.color = t, !n.style.color) return null;
	let r = getComputedStyle(n).color.trim(), i = getComputedStyle(n.parentElement).color.trim();
	return r === "" || r === i ? null : qt(r);
}
function Qt(e, t, n) {
	let r = t.trim(), i = r, a = Gt.exec(i);
	return a && (i = getComputedStyle(e).getPropertyValue(a[1]).trim()), qt(i) ?? Zt(e, r) ?? n;
}
function $t(e, t) {
	return {
		normal: Qt(e, t.normal, Ht.normal),
		warning: Qt(e, t.warning, Ht.warning),
		critical: Qt(e, t.critical, Ht.critical)
	};
}
function en(e, t, n) {
	return {
		r: Math.round(e.r + (t.r - e.r) * n),
		g: Math.round(e.g + (t.g - e.g) * n),
		b: Math.round(e.b + (t.b - e.b) * n)
	};
}
function tn(e, t, n) {
	return n > t ? (e - t) / (n - t) : 1;
}
function U(e) {
	return `rgb(${e.r}, ${e.g}, ${e.b})`;
}
function nn(e, t, n, r) {
	let i = t.twoSided ? Math.abs(e) : e;
	return r ? i <= t.normal ? U(n.normal) : i >= t.critical ? U(n.critical) : i <= t.warning ? U(en(n.normal, n.warning, tn(i, t.normal, t.warning))) : U(en(n.warning, n.critical, tn(i, t.warning, t.critical))) : i < t.warning ? U(n.normal) : i < t.critical ? U(n.warning) : U(n.critical);
}
// src/series.ts
var rn = [
	"#44739e",
	"#e45e65",
	"#39c07f",
	"#f0a30a",
	"#9c6fb6",
	"#2bb5c9",
	"#d9822b",
	"#7a8f3a",
	"#c2549a",
	"#8a8f98"
], an = {
	W: 1,
	kW: 1e3,
	MW: 1e6
}, on = {
	w: 1,
	kw: 1e3
};
function sn(e) {
	let t = e?.trim() ?? "";
	if (t === "") return 1;
	if (Object.hasOwn(an, t)) return an[t];
	let n = t.toLowerCase();
	return Object.hasOwn(on, n) ? on[n] : null;
}
function cn(e) {
	return sn(e) !== null;
}
function ln(e, t) {
	return e * (sn(t) ?? 1);
}
function W(e, t) {
	if (t) return t;
	let n = e % rn.length;
	return `var(--graph-color-${n + 1}, ${rn[n]})`;
}
// src/sparkline.ts
var un = 60, dn = 24;
function fn(e, t, n, r, i) {
	let { lines: a, areas: o } = Ge(e, n, {
		w: un,
		h: dn
	}), s = `cpm-grad-${i}`, c = e.length, l = j(0, n, dn);
	return w`
    <svg viewBox="0 0 ${un} ${dn}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${un} y2="0">
          ${e.map((e, n) => t[n] ?? t[t.length - 1] ?? "currentColor").map((e, t) => w`<stop offset=${c > 1 ? t / (c - 1) : 0} stop-color=${e}></stop>`)}
        </linearGradient>
      </defs>
      ${r ? w`<line class="zero" x1="0" y1=${l} x2=${un} y2=${l} stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"></line>` : ""}
      ${o.map((e) => w`<path class="area" d=${e} fill="url(#${s})" fill-opacity="0.2"></path>`)}
      ${a.map((e) => w`<path class="line" d=${e} fill="none" stroke="url(#${s})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`)}
    </svg>
  `;
}
// src/tooltip.ts
var pn = 36e5;
function mn(e, t, n) {
	if (!(t > 0) || n <= 1) return 0;
	let r = Math.round(e / t * (n - 1));
	return Math.min(n - 1, Math.max(0, r));
}
function hn(e, t) {
	return t > 1 ? e / (t - 1) * 100 : 50;
}
function gn(e, t, n, r) {
	let i = t * pn;
	return e - i + (r + 1) * i / n;
}
var _n = (e) => C`<span class="swatch" style="background: ${e}"></span>`;
function vn(e, t, n, r) {
	return C`
    <div class="guide" style="left: ${r}%" aria-hidden="true"></div>
    <div class="tip ${r < 50 ? "right" : "left"}" style="left: ${r}%" aria-hidden="true">
      <div class="tip-title">${e}</div>
      ${t.map((e) => C`<div class="tip-row">
            ${_n(e.color)}<span class="tip-name">${e.name}</span
            ><span class="tip-value">${e.value === null ? "—" : n(e.value)}</span>
          </div>`)}
    </div>
  `;
}
function yn(e, t, n, r) {
	return C`<div class="tip slice" aria-hidden="true">
    <div class="tip-row">
      ${_n(t)}<span class="tip-name">${e}</span><span class="tip-value">${n}</span
      ><span class="tip-share">${r}</span>
    </div>
  </div>`;
}
// src/card.ts
function bn(e) {
	return e.timeChart !== void 0 || e.donut;
}
function xn(e) {
	return e < 1 ? `${Math.round(e * 60)} min` : `${Math.round(e * 100) / 100} h`;
}
var G = 60, Sn = 36e5, Cn = 10, wn = "custom:constant-powermeter-card", Tn = 15e3, En = {
	unit: "W",
	precision: 0
}, Dn = 3e3;
function On() {
	return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
}
function K(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function kn(e) {
	return e === void 0 || !Number.isFinite(e) ? 0 : Math.min(Cn, Math.max(0, Math.round(e)));
}
function An(e, t, n, r) {
	let i = e.find((e) => e !== null);
	if (i === void 0) return [];
	let a = nn(i, t, n, r);
	return e.map((e) => (e !== null && (a = nn(e, t, n, r)), a));
}
var jn = class extends A {
	static properties = {
		hass: { attribute: !1 },
		preview: { type: Boolean },
		config: { state: !0 },
		hover: { state: !0 }
	};
	hoverTimer;
	palette;
	history;
	tickTimer;
	tickMs = 0;
	formats = /* @__PURE__ */ new Map();
	shown = /* @__PURE__ */ new Map();
	tweens = /* @__PURE__ */ new Map();
	frame;
	bucketCache = /* @__PURE__ */ new Map();
	constructor() {
		super(), this.preview = !1;
	}
	static getConfigElement() {
		return document.createElement("constant-powermeter-card-editor");
	}
	static getStubConfig(e) {
		let t = Object.values(e.states).filter((e) => e.entity_id.startsWith("sensor."));
		return {
			type: wn,
			meters: [(t.find((e) => e.attributes.device_class === "power" || e.attributes.unit_of_measurement === "W" || e.attributes.unit_of_measurement === "kW") ?? t[0])?.entity_id ?? "sensor.power"]
		};
	}
	setConfig(e) {
		this.config = kt(e), this.palette = void 0, this.tweens.clear(), this.bucketCache.clear(), this.clearHover(), this.syncHistory(), this.syncTick();
	}
	getCardSize() {
		let e = this.config;
		if (!e) return 1;
		let t = e.meters.reduce((e, t) => e + (t.display.includes("bar") ? 2 : 1), 0), n = +!!e.title;
		if (!bn(e)) return n + Math.max(1, Math.ceil(t / 2));
		let r = e.rows ? Math.max(1, Math.ceil(t / 2)) : 1;
		return n + 3 + r;
	}
	getGridOptions() {
		return {
			columns: 12,
			rows: "auto",
			min_columns: 6
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.syncHistory(), this.syncTick();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.history?.close(), this.history = void 0, this.bucketCache.clear(), this.stopTick(), this.frame !== void 0 && cancelAnimationFrame(this.frame), this.frame = void 0, this.clearHover();
	}
	shownValue(e, t, n) {
		if (t === null) return this.shown.delete(e), this.tweens.delete(e), null;
		let r = this.shown.get(e);
		if (r === void 0 || On()) return this.shown.set(e, t), this.tweens.delete(e), t;
		let i = this.tweens.get(e);
		if (!i || i.to !== t) {
			if (!i && r === t) return t;
			i = {
				from: r,
				to: t,
				start: n
			}, this.tweens.set(e, i);
		}
		let a = Math.min(1, (n - i.start) / 500), o = i.from + (i.to - i.from) * (1 - (1 - a) ** 3);
		return this.shown.set(e, o), a >= 1 && this.tweens.delete(e), o;
	}
	updated() {
		this.tweens.size !== 0 && this.frame === void 0 && this.isConnected && (this.frame = requestAnimationFrame(() => {
			this.frame = void 0, this.requestUpdate();
		}));
	}
	syncTick() {
		if (!this.isConnected || !this.config) return;
		let e = Math.max(Tn, this.config.hours * Sn / G);
		(this.tickTimer === void 0 || e !== this.tickMs) && (this.stopTick(), this.tickMs = e, this.tickTimer = setInterval(() => this.requestUpdate(), e));
	}
	stopTick() {
		this.tickTimer !== void 0 && clearInterval(this.tickTimer), this.tickTimer = void 0, this.tickMs = 0;
	}
	syncHistory() {
		if (!this.isConnected || !this.hass || !this.config) return;
		this.history ??= new Vt(this.hass.connection, () => this.requestUpdate());
		let e = this.config.meters.map((e) => e.entity), t = this.chartTotal(this.config);
		t !== void 0 && e.push(t), this.history.update(e, this.config.hours);
	}
	chartTotal(e) {
		if (bn(e) && e.total !== void 0) return cn(this.unitOf(e.total)) ? e.total : void 0;
	}
	shouldUpdate(e) {
		if (!e.has("hass") || e.size > 1) return !0;
		let t = e.get("hass"), n = this.hass;
		if (!t || !n || !this.config || t.themes !== n.themes || t.locale !== n.locale || t.entities !== n.entities) return !0;
		let r = this.chartTotal(this.config);
		return r !== void 0 && t.states[r] !== n.states[r] || this.config.meters.some((e) => t.states[e.entity] !== n.states[e.entity]);
	}
	willUpdate(e) {
		if (!e.has("hass")) return;
		let t = e.get("hass");
		t && t.themes !== this.hass?.themes && (this.palette = void 0), this.history || this.syncHistory();
	}
	format(e, t) {
		let n = this.hass?.locale, r = `${n?.language ?? ""}|${n?.number_format ?? ""}|${t}`, i = this.formats.get(r);
		if (!i) {
			let { locales: e, useGrouping: a } = At(n);
			i = new Intl.NumberFormat(e, {
				minimumFractionDigits: t,
				maximumFractionDigits: t,
				useGrouping: a
			}), this.formats.set(r, i);
		}
		return i.format(e);
	}
	clickable(e) {
		return !this.preview && e.tapAction.action !== "none";
	}
	act(e, t) {
		this.clickable(t) && ze(e.currentTarget, t.tapAction, t.entity);
	}
	onKey(e, t) {
		e.key !== "Enter" && e.key !== " " || e.repeat || (e.preventDefault(), this.act(e, t));
	}
	clearHover() {
		clearTimeout(this.hoverTimer), this.hoverTimer = void 0, this.hover = void 0;
	}
	setHover(e) {
		clearTimeout(this.hoverTimer), this.hoverTimer = void 0;
		let t = this.hover;
		t?.kind === e.kind && (t.kind === "time" ? t.step === e.step : t.key === e.key) || (this.hover = e);
	}
	leaveHover = (e) => {
		e.pointerType === "touch" ? (clearTimeout(this.hoverTimer), this.hoverTimer = setTimeout(() => this.clearHover(), Dn)) : this.clearHover();
	};
	onTimePointer = (e) => {
		let t = e.currentTarget.querySelector("svg");
		if (!t) return;
		let n = t.getBoundingClientRect();
		this.setHover({
			kind: "time",
			step: mn(e.clientX - n.left, n.width, G)
		});
	};
	onSlicePointer = (e) => {
		let t = e.target.getAttribute?.("data-key");
		t && this.setHover({
			kind: "slice",
			key: t
		});
	};
	stepTitle(e, t, n) {
		if (n === 59) return "Now";
		let r = gn(t, e.hours, G, n);
		return new Intl.DateTimeFormat(this.hass?.locale?.language, {
			hour: "2-digit",
			minute: "2-digit"
		}).format(r);
	}
	render() {
		let e = this.config;
		if (!e || !this.hass) return E;
		let t = this.palette ?? $t(this, e.colors);
		this.isConnected && (this.palette = t);
		let n = Date.now();
		return bn(e) ? this.renderCharted(e, t, n) : C`
      <ha-card .header=${e.title}>
        <div class="rows">${e.meters.map((r, i) => this.renderRow(e, r, i, t, n))}</div>
      </ha-card>
    `;
	}
	renderCharted(e, t, n) {
		let r = this.chartTotal(e), i = r === void 0 ? null : this.liveWatts(r, this.unitOf(r)), a = new Set(this.chartMeters(e).map(({ i: e }) => e)), o = ht(e.meters.map((e, t) => a.has(t) ? this.liveWatts(e.entity, this.unitOf(e.entity, e)) : null), i);
		return C`
      <ha-card .header=${e.title}>
        ${this.renderChart(e, n)}
        ${e.rows ? C`<div class="rows">
                ${e.meters.map((r, i) => this.renderRow(e, r, i, t, n, a.has(i) ? {
			color: W(i, r.color),
			share: o[i]
		} : { share: null }))}
              </div>` : E}
      </ha-card>
    `;
	}
	chartMeters(e) {
		let t = e.total;
		return e.meters.flatMap((e, n) => e.entity === t || !cn(this.unitOf(e.entity, e)) ? [] : [{
			m: e,
			i: n
		}]);
	}
	unitOf(e, t) {
		return t?.unit ?? this.hass.states[e]?.attributes.unit_of_measurement;
	}
	meterName(e) {
		return e.name ?? this.hass.states[e.entity]?.attributes.friendly_name ?? e.entity;
	}
	liveWatts(e, t) {
		let n = K(this.hass.states[e]?.state);
		return n === null ? null : ln(n, t);
	}
	formatWithUnit(e, t) {
		let n = this.format(e, t.precision);
		return t.unit ? `${n} ${t.unit}` : n;
	}
	chartBuckets(e, t, n, r, i) {
		let a = e.timeChart === "stacked" ? "mean" : "peak", o = this.historyBuckets(e, t, n, a, i);
		return o[o.length - 1] = K(this.hass.states[n]?.state), o.map((e) => e === null ? null : ln(e, r));
	}
	historyBuckets(e, t, n, r, i) {
		let a = e.hours * Sn / G, o = `${this.history?.version ?? -1}|${e.hours}|${Math.floor(t / a)}`, s = `${n}|${r}|${r === "peak" && i}`, c = this.bucketCache.get(s);
		if (c?.stamp === o) return [...c.buckets];
		let l = this.history?.store.get(n) ?? [], u = {
			start: t - e.hours * Sn,
			end: t,
			count: G
		}, d = r === "mean" ? Ve(l, u) : Be(l, {
			...u,
			twoSided: i
		});
		return this.bucketCache.set(s, {
			stamp: o,
			buckets: d
		}), [...d];
	}
	renderChart(e, t) {
		let n = e.rows ? E : at([...this.chartMeters(e).map(({ m: e, i: t }) => ({
			key: String(t),
			name: this.meterName(e),
			color: W(t, e.color)
		})), ...this.chartTotal(e) === void 0 ? [] : [{
			key: N,
			name: Ke,
			color: P
		}]]);
		return C`
      <div class="chart">
        <div class="chart-body ${e.timeChart ? "" : "donut-only"}">
          ${e.timeChart ? this.renderTimeChart(e, e.timeChart, t) : E}
          ${e.donut ? this.renderDonutChart(e, t) : E}
        </div>
        ${n}
      </div>
    `;
	}
	renderTimeChart(e, t, n) {
		let r = this.chartMeters(e).map(({ m: t, i: r }) => ({
			key: String(r),
			name: this.meterName(t),
			color: W(r, t.color),
			buckets: this.chartBuckets(e, n, t.entity, this.unitOf(t.entity, t), t.twoSided)
		})), i = this.chartTotal(e), a = i === void 0 ? void 0 : this.chartBuckets(e, n, i, this.unitOf(i), !1), o = a && lt(a, r), s, c, l = `last ${xn(e.hours)}`;
		if (t === "stacked") {
			let e = ut(r, o);
			c = ft(e), s = $e(e, c, `Stacked power, ${l}`);
		} else {
			let e = [...r];
			o && a && e.push({
				key: N,
				name: Ke,
				color: P,
				buckets: o.map((e, t) => a[t] === null ? null : e)
			}), c = pt(e), s = et(e, c, `Power per meter, ${l}`);
		}
		let u = [...r.map((e) => e.buckets), a ?? []].some((e) => e.some((e) => e !== null)), d = this.hover, f = E;
		if (d?.kind === "time") {
			let t = r.map((e) => ({
				...e,
				value: e.buckets[d.step] ?? null
			}));
			if (i !== void 0 && a) {
				let e = a[d.step] ?? null;
				t.push({
					key: N,
					name: Ke,
					color: P,
					value: e === null ? null : o?.[d.step] ?? null
				}), t.push({
					key: "total",
					name: this.hass.states[i]?.attributes.friendly_name ?? "Total",
					color: "transparent",
					value: e
				});
			}
			f = vn(this.stepTitle(e, n, d.step), t, (e) => this.formatWithUnit(e, En), hn(d.step, G));
		}
		return C`
      <div
        class="time ${t}"
        @pointermove=${this.onTimePointer}
        @pointerdown=${this.onTimePointer}
        @pointerleave=${this.leaveHover}
      >
        ${s}
        ${u ? C`<span class="label top">${this.formatWithUnit(c.hi, En)}</span>` : E}
        <span class="label bottom">${xn(e.hours)}</span>
        ${f}
      </div>
    `;
	}
	renderDonutChart(e, t) {
		let n = this.chartMeters(e).map(({ m: e, i: n }) => {
			let r = this.unitOf(e.entity, e), i = this.shownValue(e.entity, K(this.hass.states[e.entity]?.state), t);
			return {
				key: String(n),
				name: this.meterName(e),
				color: W(n, e.color),
				value: i === null ? null : ln(i, r)
			};
		}), r = this.chartTotal(e), i = null;
		if (r !== void 0) {
			let e = this.shownValue(r, K(this.hass.states[r]?.state), t);
			i = e === null ? null : ln(e, this.unitOf(r));
		}
		let { slices: a, center: o } = mt(n, i), s = a.length === 0 || o === null, c = s ? "—" : this.formatWithUnit(o, En), l = `Power split, ${s ? "no data" : c}`, u = this.hover, d = u?.kind === "slice" ? a.find((e) => e.key === u.key) : void 0, f = d && o !== null && o > 0 ? yn(d.name, d.color, this.formatWithUnit(d.value, En), `${Math.round(d.value / o * 100)}%`) : E;
		return C`<div
      class="donut"
      @pointerover=${this.onSlicePointer}
      @pointerdown=${this.onSlicePointer}
      @pointerleave=${this.leaveHover}
    >
      ${it(a, c, l)}${f}
    </div>`;
	}
	renderRow(e, t, n, r, i, a) {
		let o = this.hass.states[t.entity], s = K(o?.state), c = this.shownValue(t.entity, s, i), l = t.name ?? o?.attributes.friendly_name ?? t.entity, u = t.unit ?? o?.attributes.unit_of_measurement ?? "", d = kn(t.precision ?? this.hass.entities?.[t.entity]?.display_precision), f = this.clickable(t);
		return C`
      <div
        class="row"
        role=${f ? "button" : E}
        tabindex=${f ? "0" : E}
        @click=${(e) => this.act(e, t)}
        @keydown=${(e) => this.onKey(e, t)}
      >
        <div class="head">
          <span class="name" title=${l}
            >${a?.color ? C`<span class="swatch" style="background: ${a.color}"></span>` : E}${l}</span
          >
          <span class="spark">
            ${t.display.includes("sparkline") ? this.renderSpark(e, t, s, r, i, n) : E}
          </span>
          <span class="value"
            >${c === null ? "—" : this.format(c, d)}${s !== null && u ? C`<span class="unit">${u}</span>` : E}${a && a.share !== null ? C`<span class="share">${a.share}%</span>` : E}</span
          >
        </div>
        ${t.display.includes("bar") ? this.renderBar(e, t, s, r) : E}
      </div>
    `;
	}
	renderSpark(e, t, n, r, i, a) {
		let o = this.historyBuckets(e, i, t.entity, "peak", t.twoSided);
		return o[o.length - 1] = n, fn(o, An(o, t, r, e.blend), We(o, t, e.scale), t.twoSided, String(a));
	}
	renderBar(e, t, n, r) {
		let i = t.twoSided ? Ue(0, t.min, t.max).zero : null, a = E;
		if (n !== null) {
			let i = Ue(n, t.min, t.max), o = nn(n, t, r, e.blend);
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
    .head {
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
    .spark path.line {
      stroke-width: var(--cpm-line-width, 2px);
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
        width 500ms cubic-bezier(0.33, 1, 0.68, 1),
        left 500ms cubic-bezier(0.33, 1, 0.68, 1);
    }
    .track .zero {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 1px;
      margin-left: -0.5px;
      background: var(--secondary-text-color);
    }
    /* Combined charts. The chart is its own container, so the donut can move below
       the time chart when the card is narrow, whatever the dashboard layout. */
    .chart {
      container-type: inline-size;
      padding: 12px 16px 0;
    }
    .chart-body {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .chart-body.donut-only {
      justify-content: center;
    }
    /* The labels sit in the padding, above and below the plot, so they never cover it. */
    .time {
      position: relative;
      padding: 14px 0;
      flex: 1 1 auto;
      min-width: 0;
      color: var(--secondary-text-color);
      /* Horizontal drags move the tooltip; vertical swipes still scroll the dashboard. */
      touch-action: pan-y;
    }
    .time svg {
      display: block;
      width: 100%;
      height: 120px;
      overflow: visible;
    }
    .label {
      position: absolute;
      left: 0;
      font-size: 11px;
      line-height: 1;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .label.top {
      top: 0;
    }
    .label.bottom {
      bottom: 0;
    }
    .donut {
      flex: 0 0 120px;
      color: var(--primary-text-color);
    }
    .donut svg {
      display: block;
      width: 100%;
      max-width: 120px;
      height: auto;
      margin: 0 auto;
    }
    /* SVG text sizes are in viewBox units (100 across), so 13 fits inside the ring. */
    .donut .center {
      font-size: 13px;
      font-variant-numeric: tabular-nums;
    }
    .donut {
      position: relative;
    }
    /* Tooltips: a guide line over the time chart and a small box, both ignoring the
       pointer so hovering stays smooth. */
    .guide {
      position: absolute;
      top: 14px;
      bottom: 14px;
      width: 1px;
      margin-left: -0.5px;
      background: var(--secondary-text-color);
      opacity: 0.6;
      pointer-events: none;
    }
    .tip {
      position: absolute;
      top: 14px;
      z-index: 1;
      padding: 6px 8px;
      border-radius: 6px;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.25));
      font-size: 12px;
      line-height: 1.4;
      white-space: nowrap;
      pointer-events: none;
    }
    .tip.right {
      transform: translateX(8px);
    }
    .tip.left {
      transform: translateX(calc(-100% - 8px));
    }
    /* Right-aligned under the ring: the donut sits at the card's right edge. */
    .tip.slice {
      top: auto;
      bottom: -4px;
      right: 0;
      transform: translateY(100%);
    }
    .tip-title {
      color: var(--secondary-text-color);
      margin-bottom: 2px;
    }
    .tip-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tip-name {
      flex: 1 1 auto;
    }
    .tip-value,
    .tip-share {
      font-variant-numeric: tabular-nums;
      margin-left: 8px;
    }
    .tip-share {
      color: var(--secondary-text-color);
    }
    /* The query measures the .chart content box, 32 px narrower than the card (16 px
       padding each side), so 328 px here wraps the donut at a 360 px wide card. */
    @container (max-width: 328px) {
      .chart-body {
        flex-direction: column;
        align-items: stretch;
      }
      .donut {
        flex-basis: auto;
        align-self: center;
        width: 120px;
      }
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      padding-top: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    }
    .swatch {
      display: inline-block;
      flex: none;
      width: 10px;
      height: 10px;
      margin-right: 6px;
      border-radius: 2px;
      vertical-align: middle;
    }
    .share {
      color: var(--secondary-text-color);
    }
    .share::before {
      content: '·';
      margin: 0 0.35em;
    }
    @media (prefers-reduced-motion: reduce) {
      .fill {
        transition: none;
      }
    }
  `;
}, Mn = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Nn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Pn = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, { I: Fn } = Pe, In = (e) => e, Ln = () => document.createComment(""), q = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new Fn(r.insertBefore(Ln(), i), r.insertBefore(Ln(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = In(e).nextSibling;
				In(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, J = (e, t, n = e) => (e._$AI(t, n), e), Rn = {}, zn = (e, t = Rn) => e._$AH = t, Bn = (e) => e._$AH, Vn = (e) => {
	e._$AR(), e._$AA.remove();
}, Hn = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Un = Nn(class extends Pn {
	constructor(e) {
		if (super(e), e.type !== Mn.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = Bn(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = J(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = J(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = J(i[d], a[m]), q(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = J(i[f], a[p]), q(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Hn(o, p, m), u = Hn(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = q(e, i[d]);
					J(t, a[p]), c[p] = t;
				} else c[p] = J(n, a[p]), q(e, i[d], n), i[t] = null;
				p++;
			} else Vn(i[f]), f--;
		} else Vn(i[d]), d++;
		for (; p <= m;) {
			let t = q(e, c[m + 1]);
			J(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Vn(e);
		}
		return this.ut = o, zn(e, c), T;
	}
}), Wn = [
	"normal",
	"warning",
	"critical"
], Gn = Wn, Kn = [
	"entity",
	"name",
	"unit",
	"precision",
	"min",
	"max",
	"normal",
	"warning",
	"critical",
	"color"
], qn = 0, Y = kt({
	type: "",
	meters: ["sensor.x"]
}), Jn = Y.meters[0].max, X = {
	order: "Normal ≤ Warning ≤ Critical",
	negative: "Use a positive value: two-sided thresholds apply to |value|",
	range: "Max must be above Min",
	twoSided: "Two-sided: thresholds apply to |value|",
	chartConflict: "Stacked and Lines cannot be shown together; only the first one listed is shown",
	notInChart: "Not in chart"
}, Yn = {
	title: "Title",
	display: "Display",
	hours: "Window (hours)",
	sparkline_scale: "Sparkline scale",
	blend: "Blend between levels",
	chart: "Chart",
	rows: "Show rows",
	total: "Total meter (optional)",
	entity: "Entity",
	name: "Name",
	unit: "Unit",
	precision: "Precision",
	min: "Min",
	max: "Max",
	normal: "Normal",
	warning: "Warning",
	critical: "Critical",
	color: "Color",
	tap_action: "Tap action",
	navigation_path: "Navigation path",
	url_path: "URL"
}, Xn = {
	normal: "Normal color",
	warning: "Warning color",
	critical: "Critical color"
};
function Zn(e) {
	return e === void 0 || e === "" || Array.isArray(e) && e.length === 0;
}
function Qn(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) Zn(r) ? delete n[e] : n[e] = r;
	return n;
}
function $n(e) {
	return typeof e == "string" ? { entity: e } : { ...e };
}
function er(e, t) {
	return Number.isInteger(t) && t >= 0 && t < e.meters.length;
}
function tr(e, t) {
	return {
		...e,
		meters: [...e.meters, { entity: t }]
	};
}
function nr(e, t) {
	return er(e, t) ? {
		...e,
		meters: e.meters.filter((e, n) => n !== t)
	} : e;
}
function rr(e, t, n) {
	let r = t + n;
	if (!er(e, t) || !er(e, r)) return e;
	let i = [...e.meters];
	return [i[t], i[r]] = [i[r], i[t]], {
		...e,
		meters: i
	};
}
function ir(e, t, n) {
	if (!er(e, t)) return e;
	let r = $n(e.meters[t]), i = Qn(r, n);
	if (Z(r, i)) return e;
	let a = [...e.meters];
	return a[t] = i, {
		...e,
		meters: a
	};
}
function ar(e, t) {
	return Qn(e, t);
}
function or(e, t, n) {
	let r = Qn(e.colors ?? {}, { [t]: n });
	return ar(e, { colors: Object.keys(r).length > 0 ? r : void 0 });
}
function sr(e) {
	return Math.round(e * 100) / 100;
}
function cr(e) {
	let t = e.twoSided ? 0 : e.min, n = e.twoSided ? Math.max(-e.min, e.max) : e.max, r = (e) => Math.min(100, Math.max(0, sr((e - t) * 100 / (n - t)))), i = r(e.normal), a = r(e.warning);
	return {
		normal: [0, i],
		warning: [i, a],
		critical: [a, 100]
	};
}
function lr(e, t) {
	let n = {};
	if (e.errors.includes("range") && (n.max = X.range), e.errors.includes("thresholds_negative")) {
		let e = Gn.filter((e) => (t?.[e] ?? 0) < 0);
		for (let t of e.length > 0 ? e : ["normal"]) n[t] = X.negative;
	}
	if (e.errors.includes("thresholds_order")) {
		let r = t ? ur(t, e.twoSided) : [];
		for (let e of r.length > 0 ? r : ["warning"]) n[e] ??= X.order;
	}
	return n;
}
function ur(e, t) {
	let n = [], r = -Infinity;
	for (let i of Gn) {
		let a = e[i];
		if (typeof a != "number" || !Number.isFinite(a)) continue;
		let o = t ? Math.abs(a) : a;
		o < r && n.push(i), r = Math.max(r, o);
	}
	return n;
}
function dr(e, t) {
	return Array.isArray(e) && Array.isArray(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e === t;
}
function fr(e, t) {
	let n = {};
	for (let r of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) dr(e[r], t[r]) || (n[r] = t[r]);
	return n;
}
function pr(e) {
	let t = e?.includes("sparkline") ?? !1, n = e?.includes("bar") ?? !1;
	return t && n ? "both" : t ? "sparkline" : n ? "bar" : "default";
}
var mr = {
	default: void 0,
	sparkline: ["sparkline"],
	bar: ["bar"],
	both: ["sparkline", "bar"]
};
function hr(e, t) {
	let n = $n(e), r = {};
	for (let e of Kn) n[e] !== void 0 && (r[e] = n[e]);
	r.display = pr(n.display);
	let i = n.tap_action;
	return r.tap_action = t ?? i?.action ?? "more-info", i?.action === "navigate" && (r.navigation_path = i.navigation_path), i?.action === "url" && (r.url_path = i.url_path), r;
}
function gr(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : void 0;
}
function _r(e, t, n) {
	if (e === "none") return { action: "none" };
	let r = gr(t);
	if (e === "navigate" && r) return {
		action: "navigate",
		navigation_path: r
	};
	let i = gr(n);
	if (e === "url" && i) return {
		action: "url",
		url_path: i
	};
}
function vr(e) {
	if (e.tap_action === "navigate" && !gr(e.navigation_path)) return "navigate";
	if (e.tap_action === "url" && !gr(e.url_path)) return "url";
}
function Z(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e) || Array.isArray(t)) return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((e, n) => Z(e, t[n]));
	if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => n in t && Z(e[n], t[n]));
}
function yr(e) {
	return typeof e == "string" ? e : e.entity ?? "";
}
function br(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = n.map(() => void 0);
	n.forEach((n, r) => {
		let o = yr(n);
		if (o === "") return;
		let s = e.findIndex((e, n) => yr(e) === o && t[n] !== void 0 && !i.has(t[n]));
		s >= 0 && (a[r] = t[s], i.add(t[s]));
	});
	let o = r;
	return {
		keys: a.map((e, n) => {
			if (e !== void 0) return e;
			let r = t[n];
			return r !== void 0 && !i.has(r) ? (i.add(r), r) : o++;
		}),
		nextKey: o
	};
}
function xr(e, t) {
	return Z(e, t);
}
function Sr(e, t, n) {
	let r = {};
	for (let t of Kn) t in e && (r[t] = Zn(e[t]) ? void 0 : e[t]);
	if (r.entity === void 0 && delete r.entity, "display" in e && (r.display = mr[e.display]), "tap_action" in e || "navigation_path" in e || "url_path" in e) {
		let i = t.tap_action, a = (t) => t in e ? e[t] : i && t in i ? i[t] : void 0;
		r.tap_action = _r("tap_action" in e ? e.tap_action : n ?? i?.action ?? "more-info", a("navigation_path"), a("url_path"));
	}
	return r;
}
var Q = {
	step: "any",
	mode: "box"
};
function Cr(e, t) {
	return e.meters.filter((e, n) => n !== t).map((e) => typeof e == "string" ? e : e.entity).filter((e) => typeof e == "string" && e !== "");
}
function wr(e = []) {
	let t = { filter: { domain: "sensor" } };
	return e.length > 0 && (t.exclude_entities = e), { entity: t };
}
function Tr(e, t = []) {
	let n = [
		{
			name: "entity",
			required: !0,
			selector: wr(t)
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
			name: "color",
			selector: { text: {} }
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
function Er(e) {
	return String(sr(e));
}
function Dr(e, t, n, r = {}, i) {
	let a = t[e], o = a === void 0 || a === "", s = Gn.includes(e);
	if (n?.twoSided && (e === "min" || s && !o)) return X.twoSided;
	if (o) {
		if (s && n) {
			let t = `Default: ${Er(n.errors.includes("thresholds_order") ? Et(n.min, n.max)[e] : n[e])}`;
			return n.twoSided ? `${t} · two-sided, thresholds apply to |value|` : t;
		}
		if (e === "min") return `Default: ${qn}`;
		if (e === "max") return `Default: ${Jn}`;
		if (e === "color" && i !== void 0) return `Default: ${W(i)}`;
		if (e === "name" && r.friendly_name) return `Default: ${r.friendly_name}`;
		if (e === "unit" && r.unit_of_measurement) return `Default: ${r.unit_of_measurement}`;
	}
}
function Or(e, t = {}) {
	let n = $n(e);
	return n.name || t.friendly_name || n.entity;
}
function kr(e, t) {
	try {
		return kt({
			...e,
			meters: [e.meters[t]]
		}).meters[0];
	} catch {
		return;
	}
}
function Ar() {
	return [
		...Mr,
		{
			name: "chart",
			selector: { select: {
				multiple: !0,
				mode: "list",
				options: [
					{
						value: "stacked",
						label: "Stacked"
					},
					{
						value: "lines",
						label: "Lines"
					},
					{
						value: "donut",
						label: "Donut"
					}
				]
			} }
		},
		{
			name: "rows",
			selector: { boolean: {} }
		},
		{
			name: "total",
			selector: wr()
		}
	];
}
var jr = [
	"title",
	"display",
	"hours",
	"sparkline_scale",
	"blend",
	"chart",
	"rows",
	"total"
], Mr = [
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
function Nr(e) {
	let t = {};
	return e.title !== void 0 && (t.title = e.title), t.display = e.display ?? [...Y.display], t.hours = e.hours ?? Y.hours, t.sparkline_scale = e.sparkline_scale ?? Y.scale, t.blend = e.blend ?? Y.blend, t.chart = e.chart === void 0 ? [] : Array.isArray(e.chart) ? [...e.chart] : [e.chart], t.rows = e.rows ?? Y.rows, e.total !== void 0 && (t.total = e.total), t;
}
function Pr(e) {
	let t = {};
	for (let n of jr) n in e && (t[n] = Zn(e[n]) ? void 0 : e[n]);
	return t.rows === !0 && (t.rows = void 0), t;
}
function Fr(e, t, n) {
	if (t !== void 0 && t !== "") return t;
	let r = n?.states[e];
	return r ? r.attributes.unit_of_measurement : null;
}
function Ir(e, t) {
	if (e.chart === void 0) return [];
	let n = [], { warnings: r } = kt({
		type: "",
		chart: e.chart,
		meters: ["sensor.x"]
	});
	r.includes("chart_conflict") && n.push(X.chartConflict);
	let i = e.meters.map($n).filter((e) => typeof e.entity == "string"), a = [], o = (e, n, r, i = "") => {
		let o = Fr(e, n, t);
		if (o === null || cn(o)) return;
		let s = r ?? t?.states[e]?.attributes.friendly_name ?? e;
		a.push(`${s} (${o}${i})`);
	};
	for (let e of i) o(e.entity, e.unit, e.name);
	return e.total && o(e.total, void 0, void 0, ", total"), a.length > 0 && n.push(`${X.notInChart}: ${a.join(", ")}`), n;
}
// src/editor.ts
var Lr = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", Rr = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", zr = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", Br = (e) => [{
	name: "entity",
	selector: wr(Cr(e))
}], Vr = (e) => customElements.get("ha-alert") ? C`<ha-alert class="warning" alert-type="warning">${e}</ha-alert>` : C`<div class="warning" role="alert">${e}</div>`, Hr = (e) => Yn[e.name] ?? e.name, Ur = () => customElements.get("ha-form") !== void 0 && customElements.get("ha-expansion-panel") !== void 0;
async function Wr() {
	if (Ur()) return !1;
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
var Gr = class extends A {
	static properties = {
		hass: { attribute: !1 },
		config: { state: !0 },
		pending: { state: !0 }
	};
	loadStarted = !1;
	keys = [];
	nextKey = 0;
	constructor() {
		super(), this.pending = {};
	}
	connectedCallback() {
		super.connectedCallback(), this.loadStarted || (this.loadStarted = !0, Wr().then((e) => {
			e && this.requestUpdate();
		}));
	}
	setConfig(e) {
		this.apply({
			...e,
			meters: Array.isArray(e.meters) ? e.meters : []
		});
	}
	apply(e) {
		let { keys: t, nextKey: n } = br(this.config?.meters ?? [], this.keys, e.meters, this.nextKey);
		this.keys = t, this.nextKey = n;
		let r = new Set(t), i = Object.fromEntries(Object.entries(this.pending).filter(([e]) => r.has(Number(e))));
		Object.keys(i).length !== Object.keys(this.pending).length && (this.pending = i), this.config = e;
	}
	commit(e) {
		this.config && xr(e, this.config) || (this.apply(e), this.dispatchEvent(new CustomEvent("config-changed", {
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
		let n = fr(Nr(e), t.detail.value);
		this.commit(ar(e, Pr(n)));
	}
	onColorChanged(e, t, n) {
		n.stopPropagation();
		let r = n.detail.value[t];
		this.commit(or(e, t, typeof r == "string" ? r.trim() : void 0));
	}
	onMeterChanged(e, t, n) {
		n.stopPropagation();
		let r = e.meters[t], i = typeof r == "string" ? { entity: r } : r, a = this.keys[t], o = this.pending[a], s = fr(hr(r, o), n.detail.value);
		if (Object.keys(s).length === 0) return;
		let c = vr(n.detail.value);
		if (c !== o) {
			let e = { ...this.pending };
			c ? e[a] = c : delete e[a], this.pending = e;
		}
		this.commit(ir(e, t, Sr(s, i, o)));
	}
	onAdd(e, t) {
		t.stopPropagation();
		let n = t.detail.value.entity;
		typeof n == "string" && n !== "" && this.commit(tr(e, n));
	}
	onButton(e, t) {
		e.stopPropagation(), this.commit(t());
	}
	stop(e) {
		e.stopPropagation();
	}
	render() {
		let e = this.config;
		return e ? C`
      <div class="section">
        <h3>Panel</h3>
        ${Ir(e, this.hass).map(Vr)}
        <ha-form
          class="panel"
          .hass=${this.hass}
          .data=${Nr(e)}
          .schema=${Ar()}
          .computeLabel=${Hr}
          .computeHelper=${(e) => e.name === "hours" ? `Default: ${Y.hours}` : void 0}
          @value-changed=${(t) => this.onPanelChanged(e, t)}
        ></ha-form>
        ${Wn.map((t) => this.renderColor(e, t))}
      </div>
      <div class="section">
        <h3>Meters</h3>
        ${Un(e.meters, (e, t) => this.keys[t], (t, n) => this.renderMeter(e, n))}
        <ha-form
          class="add"
          .hass=${this.hass}
          .data=${{}}
          .schema=${Br(e)}
          .computeLabel=${() => "Add meter"}
          @value-changed=${(t) => this.onAdd(e, t)}
        ></ha-form>
      </div>
    ` : E;
	}
	renderColor(e, t) {
		let n = e.colors?.[t], r = Y.colors[t];
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
          .computeLabel=${() => Xn[t]}
          .computeHelper=${() => `Default: ${r}`}
          @value-changed=${(n) => this.onColorChanged(e, t, n)}
        ></ha-form>
      </div>
    `;
	}
	renderMeter(e, t) {
		let n = e.meters[t], r = typeof n == "string" ? { entity: n } : n, i = this.attrs(r.entity), a = kr(e, t), o = hr(n, this.pending[this.keys[t]]), s = e.meters.length - 1;
		return C`
      <ha-expansion-panel outlined data-index=${t} .header=${Or(n, i)}>
        <div slot="icons" class="buttons" @click=${this.stop} @keydown=${this.stop}>
          <span
            class="swatch meter-swatch"
            title="Series color"
            style="background: ${W(t, r.color)}"
          ></span>
          <ha-icon-button
            class="up"
            .label=${"Move up"}
            .path=${Lr}
            ?disabled=${t === 0}
            @click=${(n) => this.onButton(n, () => rr(e, t, -1))}
          ></ha-icon-button>
          <ha-icon-button
            class="down"
            .label=${"Move down"}
            .path=${Rr}
            ?disabled=${t === s}
            @click=${(n) => this.onButton(n, () => rr(e, t, 1))}
          ></ha-icon-button>
          <ha-icon-button
            class="delete"
            .label=${"Remove meter"}
            .path=${zr}
            ?disabled=${s === 0}
            @click=${(n) => this.onButton(n, () => nr(e, t))}
          ></ha-icon-button>
        </div>
        <ha-form
          class="meter"
          .hass=${this.hass}
          .data=${o}
          .schema=${Tr(String(o.tap_action), Cr(e, t))}
          .error=${a ? lr(a, r) : {}}
          .computeLabel=${Hr}
          .computeHelper=${(e) => Dr(e.name, r, a, i, t)}
          @value-changed=${(n) => this.onMeterChanged(e, t, n)}
        ></ha-form>
        ${a ? this.renderBands(e, a) : E}
      </ha-expansion-panel>
    `;
	}
	renderBands(e, t) {
		let n = cr(t), r = (t) => e.colors?.[t] || Y.colors[t];
		return C`<div
      class="bands"
      role="img"
      aria-label="Threshold preview"
      style="background: linear-gradient(to right, ${Wn.map((e) => `${r(e)} ${n[e][0]}% ${n[e][1]}%`).join(", ")})"
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
      align-items: center;
    }
    .meter-swatch {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    div.warning {
      padding: 8px 12px;
      border-radius: 4px;
      border-left: 4px solid var(--warning-color);
      background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
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
}, $ = "constant-powermeter-card", Kr = `${$}-editor`;
console.info(`${$} v${e}`), customElements.get($) || customElements.define($, jn), customElements.get(Kr) || customElements.define(Kr, Gr);
var qr = window;
qr.customCards ??= [], qr.customCards.some((e) => e.type === $) || qr.customCards.push({
	type: $,
	name: "Constant Powermeter Card",
	preview: !0,
	description: "Power meters with per-meter thresholds, a sparkline and a bar.",
	documentationURL: "https://github.com/uded/constant-powermeter-card"
});
