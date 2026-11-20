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
})(e) : e, { is: u, defineProperty: d, getOwnPropertyDescriptor: f, getOwnPropertyNames: p, getOwnPropertySymbols: m, getPrototypeOf: ee } = Object, h = globalThis, te = h.trustedTypes, ne = te ? te.emptyScript : "", re = h.reactiveElementPolyfillSupport, g = (e, t) => e, ie = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ne : null;
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
}, ae = (e, t) => !u(e, t), oe = {
	attribute: !0,
	type: String,
	converter: ie,
	reflect: !1,
	useDefault: !1,
	hasChanged: ae
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var _ = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(g("elementProperties"))) return;
		let e = ee(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(g("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(g("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? ie : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ie : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ae)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[g("elementProperties")] = /* @__PURE__ */ new Map(), _[g("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: _ }), (h.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var se = globalThis, ce = (e) => e, v = se.trustedTypes, le = v ? v.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + y, fe = `<${de}>`, b = document, x = () => b.createComment(""), S = (e) => e === null || typeof e != "object" && typeof e != "function", pe = Array.isArray, me = (e) => pe(e) || typeof e?.[Symbol.iterator] == "function", he = "[ 	\n\f\r]", C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ge = /-->/g, _e = />/g, w = RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, be = /^(?:script|style|textarea|title)$/i, xe = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), T = xe(1), E = xe(2), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), Se = /* @__PURE__ */ new WeakMap(), k = b.createTreeWalker(b, 129);
function Ce(e, t) {
	if (!pe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var we = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = C;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === C ? c[1] === "!--" ? o = ge : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = w) : (be.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : o = _e : o === w ? c[0] === ">" ? (o = i ?? C, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? w : c[3] === "\"" ? ye : ve) : o === ye || o === ve ? o = w : o === ge || o === _e ? o = C : (o = w, i = void 0);
		let d = o === w && e[t + 1].startsWith("/>") ? " " : "";
		a += o === C ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + y + d) : n + y + (l === -2 ? t : d);
	}
	return [Ce(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Te = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = we(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(y), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Oe : r[1] === "?" ? ke : r[1] === "@" ? Ae : j
					}), i.removeAttribute(e);
				} else e.startsWith(y) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (be.test(i.tagName)) {
					let e = i.textContent.split(y), t = e.length - 1;
					if (t > 0) {
						i.textContent = v ? v.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], x()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], x());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(y, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += y.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = b.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = S(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Ee = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? b).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new De(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new je(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = b, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, De = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = A(this, e, t), S(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? me(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && S(this._$AH) ? this._$AA.nextSibling.data = e : this.T(b.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Te.createElement(Ce(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ee(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Se.get(e.strings);
		return t === void 0 && Se.set(e.strings, t = new Te(e)), t;
	}
	k(t) {
		pe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(x()), this.O(x()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, j = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !S(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !S(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Oe = class extends j {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, ke = class extends j {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, Ae = class extends j {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, je = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, Me = {
	M: ue,
	P: y,
	A: de,
	C: 1,
	L: we,
	R: Ee,
	D: me,
	V: A,
	I: De,
	H: j,
	N: ke,
	U: Ae,
	B: Oe,
	F: je
}, Ne = se.litHtmlPolyfillSupport;
Ne?.(Te, De), (se.litHtmlVersions ??= []).push("3.3.3");
var Pe = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new De(t.insertBefore(x(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Fe = globalThis, M = class extends _ {
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
		return D;
	}
};
M._$litElement$ = !0, M.finalized = !0, Fe.litElementHydrateSupport?.({ LitElement: M });
var Ie = Fe.litElementPolyfillSupport;
Ie?.({ LitElement: M }), (Fe.litElementVersions ??= []).push("4.2.2");
// src/actions.ts
function Le(e, t, n) {
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
function Re(e, t) {
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
function ze(e, t) {
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
function Be(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function Ve(e, t, n) {
	let r = n - t, i = (e) => (Be(e, t, n) - t) * 100 / r;
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
function He(e, t, n) {
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
function N(e, t, n) {
	let r = t.hi - t.lo || 1;
	return n - (Be(e, t.lo, t.hi) - t.lo) / r * n;
}
var P = (e) => String(Math.round(e * 100) / 100);
function Ue(e, t, n) {
	let r = (t) => e.length > 1 ? t * n.w / (e.length - 1) : 0, i = (e) => N(e, t, n.h), a = i(0), o = [], s = [], c = [], l = () => {
		if (c.length > 0) {
			let e = (c.length === 1 ? [c[0], c[0]] : c).map((e, t) => `${t === 0 ? "M" : "L"}${P(e.x)} ${P(e.y)}`).join(" "), t = c[0], n = c[c.length - 1];
			o.push(e), s.push(`${e} L${P(n.x)} ${P(a)} L${P(t.x)} ${P(a)} Z`);
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
var F = "__untracked", We = "Untracked", I = "var(--disabled-color, #bdbdbd)", L = 60, R = 24, Ge = 1, z = {
	c: 50,
	r: 38,
	w: 14
}, B = (e) => String(Math.round(e * 100) / 100), Ke = (e) => typeof e == "number" && Number.isFinite(e), qe = (e, t) => t > 1 ? e / (t - 1) * L : L / 2;
function Je(e, t) {
	let n = [], r = [];
	for (let i = 0; i < e; i++) t(i) ? r.push(i) : r.length > 0 && (n.push(r), r = []);
	return r.length > 0 && n.push(r), n;
}
var Ye = (e) => e.length === 1 ? [e[0], e[0]] : e, V = (e, t = "M") => e.map((e, n) => `${n === 0 ? t : "L"}${B(e.x)} ${B(e.y)}`).join(" ");
function Xe(e) {
	if (!(e.lo < 0)) return "";
	let t = B(N(0, e, R));
	return E`<path class="zero" d="M0 ${t} L${L} ${t}" fill="none" style="stroke: currentColor; stroke-opacity: 0.3" vector-effect="non-scaling-stroke"></path>`;
}
function Ze(e, t, n) {
	return E`
    <svg viewBox="0 0 ${L} ${R}" preserveAspectRatio="none" role="img" aria-label=${n ?? O}>
      ${Xe(t)}
      ${e.map((e) => {
		let n = Math.min(e.lower.length, e.upper.length);
		return Je(n, (t) => Ke(e.lower[t]) && Ke(e.upper[t])).map((r) => {
			let i = Ye(r.map((r) => ({
				x: qe(r, n),
				y: N(e.upper[r], t, R)
			}))), a = Ye(r.map((r) => ({
				x: qe(r, n),
				y: N(e.lower[r], t, R)
			}))).reverse();
			return E`
            <path class="band" d=${`${V(i)} ${V(a, "L")} Z`} style="fill: ${e.color}; fill-opacity: 0.6"></path>
            <path class="edge" d=${V(i)} fill="none" style="stroke: ${e.color}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`;
		});
	})}
    </svg>
  `;
}
function Qe(e, t, n) {
	return E`
    <svg viewBox="0 0 ${L} ${R}" preserveAspectRatio="none" role="img" aria-label=${n ?? O}>
      ${Xe(t)}
      ${e.map((e) => {
		let n = e.buckets.length, r = e.key === "__untracked" ? "; stroke-dasharray: 3 2" : "";
		return Je(n, (t) => Ke(e.buckets[t])).map((i) => E`<path class="series" d=${V(Ye(i.map((r) => ({
			x: qe(r, n),
			y: N(e.buckets[r], t, R)
		}))))} fill="none" style="stroke: ${e.color}${r}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`);
	})}
    </svg>
  `;
}
function $e(e) {
	let t = (e - 90) * Math.PI / 180;
	return {
		x: z.c + z.r * Math.cos(t),
		y: z.c + z.r * Math.sin(t)
	};
}
function et(e, t) {
	let n = $e(e), r = $e(t), i = +(t - e > 180);
	return `M${B(n.x)} ${B(n.y)} A${z.r} ${z.r} 0 ${i} 1 ${B(r.x)} ${B(r.y)}`;
}
function tt(e, t) {
	let n = e.start + t / 2, r = e.end - t / 2;
	return !Number.isFinite(n) || !Number.isFinite(r) || r <= n ? [] : r - n >= 359.99 ? [et(n, n + 180), et(n + 180, n + 359.99)] : [et(n, r)];
}
function nt(e, t, n) {
	let r = e.length > 1 ? Ge : 0;
	return T`
    <svg viewBox="0 0 100 100" role="img" aria-label=${n ?? O}>
      ${e.length === 0 ? E`<circle class="empty-ring" cx=${z.c} cy=${z.c} r=${z.r} fill="none" style="stroke: var(--divider-color, #e0e0e0)" stroke-width=${z.w}></circle>` : e.map((e) => tt(e, r).map((t) => E`<path class="slice" d=${t} fill="none" style="stroke: ${e.color}" stroke-width=${z.w}></path>`))}
      <text
        class="center"
        x=${z.c}
        y=${z.c}
        text-anchor="middle"
        dominant-baseline="central"
        style="fill: currentColor"
      >
        ${t}
      </text>
    </svg>
  `;
}
function rt(e) {
	return T`<div class="legend">
    ${e.map((e) => T`<span class="legend-item"
          ><span class="swatch" style="background: ${e.color}"></span>${e.name}</span
        >`)}
  </div>`;
}
// src/combine.ts
var it = .05, at = {
	lo: 0,
	hi: 1
}, H = (e) => typeof e == "number" && Number.isFinite(e), ot = (e) => Array(e).fill(null);
function st(e, t) {
	return e.map((e, n) => {
		if (!H(e)) return 0;
		let r = 0;
		for (let e of t) {
			let t = e.buckets[n];
			H(t) && t > 0 && (r += t);
		}
		return Math.max(0, e - r);
	});
}
function ct(e, t) {
	let n = Math.max(0, ...e.map((e) => e.buckets.length), t?.length ?? 0), r = e.map((e) => ({
		key: e.key,
		color: e.color,
		lower: ot(n),
		upper: ot(n)
	})), i = t ? {
		key: F,
		color: I,
		lower: ot(n),
		upper: ot(n)
	} : null;
	for (let a = 0; a < n; a++) {
		let n = t?.[a] ?? 0;
		if (e.every((e) => !H(e.buckets[a])) && !(n > 0)) continue;
		let o = 0, s = 0;
		e.forEach((e, t) => {
			let n = e.buckets[a], i = H(n) ? n : 0;
			i >= 0 ? (r[t].lower[a] = o, o += i, r[t].upper[a] = o) : (r[t].lower[a] = s, s += i, r[t].upper[a] = s);
		}), i && (i.lower[a] = o, i.upper[a] = o + n);
	}
	return i ? [...r, i] : r;
}
function lt(e) {
	let t = 0, n = 0;
	for (let r of e) H(r) && (r < t && (t = r), r > n && (n = r));
	let r = n - t;
	return r > 0 ? {
		lo: t < 0 ? t - r * it : t,
		hi: n > 0 ? n + r * it : n
	} : { ...at };
}
function ut(e) {
	return lt(e.flatMap((e) => [...e.lower, ...e.upper]));
}
function dt(e) {
	return lt(e.flatMap((e) => e.buckets));
}
function ft(e, t) {
	let n = [];
	for (let t of e) H(t.value) && t.value > 0 && n.push({
		key: t.key,
		name: t.name,
		color: t.color,
		value: t.value
	});
	let r = n.reduce((e, t) => e + t.value, 0), i = H(t) ? t : null;
	i !== null && i > r && n.push({
		key: F,
		name: We,
		color: I,
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
function pt(e, t) {
	let n = e.reduce((e, t) => H(t) && t > 0 ? e + t : e, 0), r = H(t) && t > 0 ? t : n;
	return r > 0 ? e.map((e) => H(e) && e >= 0 ? Math.round(e / r * 100) : null) : e.map(() => null);
}
// src/config.ts
var mt = class extends Error {
	constructor(e) {
		super(e), this.name = "ConfigError";
	}
}, ht = ["sparkline", "bar"], gt = {
	normal: "var(--success-color)",
	warning: "var(--warning-color)",
	critical: "var(--error-color)"
}, _t = 5e3, vt = .25, yt = 24;
function bt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function U(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function W(e) {
	return typeof e == "string" && e !== "" ? e : void 0;
}
function xt(e, t) {
	if (!Array.isArray(e)) return t;
	let n = e.filter((e) => e === "sparkline" || e === "bar");
	return n.length > 0 ? n : t;
}
function St(e) {
	let t = (Array.isArray(e) ? e : [e]).filter((e) => e === "stacked" || e === "lines" || e === "donut"), n = t.filter((e) => e !== "donut");
	return {
		timeChart: n[0],
		donut: t.includes("donut"),
		warnings: new Set(n).size > 1 ? ["chart_conflict"] : []
	};
}
function Ct(e) {
	if (bt(e)) {
		if (e.action === "none") return { action: "none" };
		if (e.action === "navigate" && W(e.navigation_path)) return {
			action: "navigate",
			navigation_path: e.navigation_path
		};
		if (e.action === "url" && W(e.url_path)) return {
			action: "url",
			url_path: e.url_path
		};
	}
	return { action: "more-info" };
}
function wt(e, t) {
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
function Tt(e, t) {
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
function Et(e, t) {
	let n = typeof e == "string" ? { entity: e } : bt(e) ? e : {}, r = W(n.entity);
	if (!r) throw new mt("Each meter needs an entity id");
	let i = [], a = U(n.min) ?? 0, o = U(n.max) ?? _t;
	o <= a && (i.push("range"), o = a + 1);
	let s = a < 0, c = [
		U(n.normal),
		U(n.warning),
		U(n.critical)
	];
	s && c.some((e) => e !== void 0 && e < 0) && (i.push("thresholds_negative"), c = c.map((e) => e === void 0 ? e : Math.abs(e)));
	let l = c.filter((e) => e !== void 0);
	l.some((e, t) => t > 0 && e < l[t - 1]) && i.push("thresholds_order");
	let [u, d, f] = Tt(c, wt(a, o)).sort((e, t) => e - t);
	return {
		entity: r,
		name: W(n.name),
		unit: W(n.unit),
		precision: U(n.precision),
		min: a,
		max: o,
		normal: u,
		warning: d,
		critical: f,
		twoSided: s,
		display: xt(n.display, t),
		tapAction: Ct(n.tap_action),
		color: W(n.color),
		errors: i
	};
}
function Dt(e) {
	if (!bt(e)) throw new mt("Invalid configuration");
	if (!Array.isArray(e.meters) || e.meters.length === 0) throw new mt("At least one meter is required");
	let t = xt(e.display, ht), n = bt(e.colors) ? e.colors : {}, r = Math.min(yt, Math.max(vt, U(e.hours) ?? 1)), { timeChart: i, donut: a, warnings: o } = St(e.chart);
	return {
		title: W(e.title),
		display: t,
		hours: r,
		scale: e.sparkline_scale === "auto" ? "auto" : "fixed",
		colors: {
			normal: W(n.normal) ?? gt.normal,
			warning: W(n.warning) ?? gt.warning,
			critical: W(n.critical) ?? gt.critical
		},
		blend: e.blend !== !1,
		timeChart: i,
		donut: a,
		rows: e.rows !== !1 || i === void 0 && !a,
		total: W(e.total),
		warnings: o,
		meters: e.meters.map((e) => Et(e, t))
	};
}
// src/format.ts
function Ot(e) {
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
var kt = 1e3, At = 6e4, jt = 36e5, Mt = 3;
function Nt(e) {
	return e === Mt || typeof e == "object" && !!e && e.code === Mt;
}
function Pt(e) {
	if (e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Ft(e, t) {
	let n = 0, r = e.length;
	for (; n < r;) {
		let i = n + r >>> 1;
		e[i].t < t ? n = i + 1 : r = i;
	}
	return n;
}
function It(e, t) {
	let n = Ft(e, t.t);
	n < e.length && e[n].t === t.t ? e[n] = t : e.splice(n, 0, t);
}
function Lt(e, t) {
	if (t.states) for (let [n, r] of Object.entries(t.states)) {
		let t = e.get(n);
		for (let i of r) {
			let r = i.lu ?? i.lc;
			r !== void 0 && (t || (t = [], e.set(n, t)), It(t, {
				t: r * 1e3,
				v: Pt(i.s)
			}));
		}
	}
}
function Rt(e, t) {
	for (let n of e.values()) {
		let e = Ft(n, t);
		e > 1 && n.splice(0, e - 1);
	}
}
var zt = class {
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
		}, kt)));
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
		let a = this.now() - t * jt;
		this.trimTimer = setInterval(() => {
			Rt(this.store, this.now() - this.hours * jt), this.storeVersion++;
		}, At), this.conn.subscribeMessage((e) => {
			i === this.generation && (Lt(this.store, e), this.storeVersion++, this.onChange());
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
			i === this.generation && !Nt(e) && console.error("powermeter-card: history/stream subscription failed", e);
		});
	}
}, Bt = {
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
}, Vt = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i, Ht = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i, Ut = /^var\(\s*(--[^,\s)]+)\s*(?:,[^)]*)?\)$/;
function Wt(e) {
	return Math.max(0, Math.min(255, Math.round(e)));
}
function Gt(e) {
	let t = e.trim(), n = Vt.exec(t);
	if (n) {
		let e = n[1];
		return e.length === 3 && (e = [...e].map((e) => e + e).join("")), {
			r: parseInt(e.slice(0, 2), 16),
			g: parseInt(e.slice(2, 4), 16),
			b: parseInt(e.slice(4, 6), 16)
		};
	}
	let r = Ht.exec(t);
	return r ? {
		r: Wt(Number(r[1])),
		g: Wt(Number(r[2])),
		b: Wt(Number(r[3]))
	} : null;
}
var Kt = "rgba(1, 2, 3, 0.004)", qt = /* @__PURE__ */ new WeakMap();
function Jt(e) {
	let t = e.shadowRoot ?? e, n = qt.get(t);
	if (n?.parentElement?.parentNode !== t) {
		let e = document.createElement("span");
		e.setAttribute("aria-hidden", "true"), e.style.display = "none", e.style.color = Kt, n = document.createElement("span"), e.append(n), t.append(e), qt.set(t, n);
	}
	return n;
}
function Yt(e, t) {
	let n = Jt(e);
	if (n.style.color = "", n.style.color = t, !n.style.color) return null;
	let r = getComputedStyle(n).color.trim(), i = getComputedStyle(n.parentElement).color.trim();
	return r === "" || r === i ? null : Gt(r);
}
function Xt(e, t, n) {
	let r = t.trim(), i = r, a = Ut.exec(i);
	return a && (i = getComputedStyle(e).getPropertyValue(a[1]).trim()), Gt(i) ?? Yt(e, r) ?? n;
}
function Zt(e, t) {
	return {
		normal: Xt(e, t.normal, Bt.normal),
		warning: Xt(e, t.warning, Bt.warning),
		critical: Xt(e, t.critical, Bt.critical)
	};
}
function Qt(e, t, n) {
	return {
		r: Math.round(e.r + (t.r - e.r) * n),
		g: Math.round(e.g + (t.g - e.g) * n),
		b: Math.round(e.b + (t.b - e.b) * n)
	};
}
function $t(e, t, n) {
	return n > t ? (e - t) / (n - t) : 1;
}
function G(e) {
	return `rgb(${e.r}, ${e.g}, ${e.b})`;
}
function en(e, t, n, r) {
	let i = t.twoSided ? Math.abs(e) : e;
	return r ? i <= t.normal ? G(n.normal) : i >= t.critical ? G(n.critical) : i <= t.warning ? G(Qt(n.normal, n.warning, $t(i, t.normal, t.warning))) : G(Qt(n.warning, n.critical, $t(i, t.warning, t.critical))) : i < t.warning ? G(n.normal) : i < t.critical ? G(n.warning) : G(n.critical);
}
// src/series.ts
var tn = [
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
], nn = {
	W: 1,
	kW: 1e3,
	MW: 1e6
}, rn = {
	w: 1,
	kw: 1e3
};
function an(e) {
	let t = e?.trim() ?? "";
	if (t === "") return 1;
	if (Object.hasOwn(nn, t)) return nn[t];
	let n = t.toLowerCase();
	return Object.hasOwn(rn, n) ? rn[n] : null;
}
function on(e) {
	return an(e) !== null;
}
function sn(e, t) {
	return e * (an(t) ?? 1);
}
function K(e, t) {
	if (t) return t;
	let n = e % tn.length;
	return `var(--graph-color-${n + 1}, ${tn[n]})`;
}
// src/sparkline.ts
var cn = 60, ln = 24;
function un(e, t, n, r, i) {
	let { lines: a, areas: o } = Ue(e, n, {
		w: cn,
		h: ln
	}), s = `cpm-grad-${i}`, c = e.length, l = N(0, n, ln);
	return E`
    <svg viewBox="0 0 ${cn} ${ln}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${cn} y2="0">
          ${e.map((e, n) => t[n] ?? t[t.length - 1] ?? "currentColor").map((e, t) => E`<stop offset=${c > 1 ? t / (c - 1) : 0} stop-color=${e}></stop>`)}
        </linearGradient>
      </defs>
      ${r ? E`<line class="zero" x1="0" y1=${l} x2=${cn} y2=${l} stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"></line>` : ""}
      ${o.map((e) => E`<path class="area" d=${e} fill="url(#${s})" fill-opacity="0.2"></path>`)}
      ${a.map((e) => E`<path class="line" d=${e} fill="none" stroke="url(#${s})" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>`)}
    </svg>
  `;
}
// src/card.ts
function dn(e) {
	return e.timeChart !== void 0 || e.donut;
}
function fn(e) {
	return e < 1 ? `${Math.round(e * 60)} min` : `${Math.round(e * 100) / 100} h`;
}
var pn = 60, mn = 36e5, hn = 10, gn = "custom:constant-powermeter-card", _n = 15e3, vn = {
	unit: "W",
	precision: 0
};
function yn() {
	return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1;
}
function q(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function bn(e) {
	return e === void 0 || !Number.isFinite(e) ? 0 : Math.min(hn, Math.max(0, Math.round(e)));
}
function xn(e, t, n, r) {
	let i = e.find((e) => e !== null);
	if (i === void 0) return [];
	let a = en(i, t, n, r);
	return e.map((e) => (e !== null && (a = en(e, t, n, r)), a));
}
var Sn = class extends M {
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
			type: gn,
			meters: [(t.find((e) => e.attributes.device_class === "power" || e.attributes.unit_of_measurement === "W" || e.attributes.unit_of_measurement === "kW") ?? t[0])?.entity_id ?? "sensor.power"]
		};
	}
	setConfig(e) {
		this.config = Dt(e), this.palette = void 0, this.tweens.clear(), this.bucketCache.clear(), this.syncHistory(), this.syncTick();
	}
	getCardSize() {
		let e = this.config;
		if (!e) return 1;
		let t = e.meters.reduce((e, t) => e + (t.display.includes("bar") ? 2 : 1), 0), n = +!!e.title;
		if (!dn(e)) return n + Math.max(1, Math.ceil(t / 2));
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
		super.disconnectedCallback(), this.history?.close(), this.history = void 0, this.bucketCache.clear(), this.stopTick(), this.frame !== void 0 && cancelAnimationFrame(this.frame), this.frame = void 0;
	}
	shownValue(e, t, n) {
		if (t === null) return this.shown.delete(e), this.tweens.delete(e), null;
		let r = this.shown.get(e);
		if (r === void 0 || yn()) return this.shown.set(e, t), this.tweens.delete(e), t;
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
		let e = Math.max(_n, this.config.hours * mn / pn);
		(this.tickTimer === void 0 || e !== this.tickMs) && (this.stopTick(), this.tickMs = e, this.tickTimer = setInterval(() => this.requestUpdate(), e));
	}
	stopTick() {
		this.tickTimer !== void 0 && clearInterval(this.tickTimer), this.tickTimer = void 0, this.tickMs = 0;
	}
	syncHistory() {
		if (!this.isConnected || !this.hass || !this.config) return;
		this.history ??= new zt(this.hass.connection, () => this.requestUpdate());
		let e = this.config.meters.map((e) => e.entity), t = this.chartTotal(this.config);
		t !== void 0 && e.push(t), this.history.update(e, this.config.hours);
	}
	chartTotal(e) {
		if (dn(e) && e.total !== void 0) return on(this.unitOf(e.total)) ? e.total : void 0;
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
			let { locales: e, useGrouping: a } = Ot(n);
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
		this.clickable(t) && Le(e.currentTarget, t.tapAction, t.entity);
	}
	onKey(e, t) {
		e.key !== "Enter" && e.key !== " " || e.repeat || (e.preventDefault(), this.act(e, t));
	}
	render() {
		let e = this.config;
		if (!e || !this.hass) return O;
		let t = this.palette ?? Zt(this, e.colors);
		this.isConnected && (this.palette = t);
		let n = Date.now();
		return dn(e) ? this.renderCharted(e, t, n) : T`
      <ha-card .header=${e.title}>
        <div class="rows">${e.meters.map((r, i) => this.renderRow(e, r, i, t, n))}</div>
      </ha-card>
    `;
	}
	renderCharted(e, t, n) {
		let r = this.chartTotal(e), i = r === void 0 ? null : this.liveWatts(r, this.unitOf(r)), a = new Set(this.chartMeters(e).map(({ i: e }) => e)), o = pt(e.meters.map((e, t) => a.has(t) ? this.liveWatts(e.entity, this.unitOf(e.entity, e)) : null), i);
		return T`
      <ha-card .header=${e.title}>
        ${this.renderChart(e, n)}
        ${e.rows ? T`<div class="rows">
                ${e.meters.map((r, i) => this.renderRow(e, r, i, t, n, a.has(i) ? {
			color: K(i, r.color),
			share: o[i]
		} : { share: null }))}
              </div>` : O}
      </ha-card>
    `;
	}
	chartMeters(e) {
		let t = e.total;
		return e.meters.flatMap((e, n) => e.entity === t || !on(this.unitOf(e.entity, e)) ? [] : [{
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
		let n = q(this.hass.states[e]?.state);
		return n === null ? null : sn(n, t);
	}
	formatWithUnit(e, t) {
		let n = this.format(e, t.precision);
		return t.unit ? `${n} ${t.unit}` : n;
	}
	chartBuckets(e, t, n, r, i) {
		let a = e.timeChart === "stacked" ? "mean" : "peak", o = this.historyBuckets(e, t, n, a, i);
		return o[o.length - 1] = q(this.hass.states[n]?.state), o.map((e) => e === null ? null : sn(e, r));
	}
	historyBuckets(e, t, n, r, i) {
		let a = e.hours * mn / pn, o = `${this.history?.version ?? -1}|${e.hours}|${Math.floor(t / a)}`, s = `${n}|${r}|${r === "peak" && i}`, c = this.bucketCache.get(s);
		if (c?.stamp === o) return [...c.buckets];
		let l = this.history?.store.get(n) ?? [], u = {
			start: t - e.hours * mn,
			end: t,
			count: pn
		}, d = r === "mean" ? ze(l, u) : Re(l, {
			...u,
			twoSided: i
		});
		return this.bucketCache.set(s, {
			stamp: o,
			buckets: d
		}), [...d];
	}
	renderChart(e, t) {
		let n = e.rows ? O : rt([...this.chartMeters(e).map(({ m: e, i: t }) => ({
			key: String(t),
			name: this.meterName(e),
			color: K(t, e.color)
		})), ...this.chartTotal(e) === void 0 ? [] : [{
			key: F,
			name: We,
			color: I
		}]]);
		return T`
      <div class="chart">
        <div class="chart-body ${e.timeChart ? "" : "donut-only"}">
          ${e.timeChart ? this.renderTimeChart(e, e.timeChart, t) : O}
          ${e.donut ? this.renderDonutChart(e, t) : O}
        </div>
        ${n}
      </div>
    `;
	}
	renderTimeChart(e, t, n) {
		let r = this.chartMeters(e).map(({ m: t, i: r }) => ({
			key: String(r),
			name: this.meterName(t),
			color: K(r, t.color),
			buckets: this.chartBuckets(e, n, t.entity, this.unitOf(t.entity, t), t.twoSided)
		})), i = this.chartTotal(e), a = i === void 0 ? void 0 : this.chartBuckets(e, n, i, this.unitOf(i), !1), o = a && st(a, r), s, c, l = `last ${fn(e.hours)}`;
		if (t === "stacked") {
			let e = ct(r, o);
			c = ut(e), s = Ze(e, c, `Stacked power, ${l}`);
		} else {
			let e = [...r];
			o && a && e.push({
				key: F,
				name: We,
				color: I,
				buckets: o.map((e, t) => a[t] === null ? null : e)
			}), c = dt(e), s = Qe(e, c, `Power per meter, ${l}`);
		}
		let u = [...r.map((e) => e.buckets), a ?? []].some((e) => e.some((e) => e !== null));
		return T`
      <div class="time ${t}">
        ${s}
        ${u ? T`<span class="label top">${this.formatWithUnit(c.hi, vn)}</span>` : O}
        <span class="label bottom">${fn(e.hours)}</span>
      </div>
    `;
	}
	renderDonutChart(e, t) {
		let n = this.chartMeters(e).map(({ m: e, i: n }) => {
			let r = this.unitOf(e.entity, e), i = this.shownValue(e.entity, q(this.hass.states[e.entity]?.state), t);
			return {
				key: String(n),
				name: this.meterName(e),
				color: K(n, e.color),
				value: i === null ? null : sn(i, r)
			};
		}), r = this.chartTotal(e), i = null;
		if (r !== void 0) {
			let e = this.shownValue(r, q(this.hass.states[r]?.state), t);
			i = e === null ? null : sn(e, this.unitOf(r));
		}
		let { slices: a, center: o } = ft(n, i), s = a.length === 0 || o === null, c = s ? "—" : this.formatWithUnit(o, vn);
		return T`<div class="donut">${nt(a, c, `Power split, ${s ? "no data" : c}`)}</div>`;
	}
	renderRow(e, t, n, r, i, a) {
		let o = this.hass.states[t.entity], s = q(o?.state), c = this.shownValue(t.entity, s, i), l = t.name ?? o?.attributes.friendly_name ?? t.entity, u = t.unit ?? o?.attributes.unit_of_measurement ?? "", d = bn(t.precision ?? this.hass.entities?.[t.entity]?.display_precision), f = this.clickable(t);
		return T`
      <div
        class="row"
        role=${f ? "button" : O}
        tabindex=${f ? "0" : O}
        @click=${(e) => this.act(e, t)}
        @keydown=${(e) => this.onKey(e, t)}
      >
        <div class="head">
          <span class="name" title=${l}
            >${a?.color ? T`<span class="swatch" style="background: ${a.color}"></span>` : O}${l}</span
          >
          <span class="spark">
            ${t.display.includes("sparkline") ? this.renderSpark(e, t, s, r, i, n) : O}
          </span>
          <span class="value"
            >${c === null ? "—" : this.format(c, d)}${s !== null && u ? T`<span class="unit">${u}</span>` : O}${a && a.share !== null ? T`<span class="share">${a.share}%</span>` : O}</span
          >
        </div>
        ${t.display.includes("bar") ? this.renderBar(e, t, s, r) : O}
      </div>
    `;
	}
	renderSpark(e, t, n, r, i, a) {
		let o = this.historyBuckets(e, i, t.entity, "peak", t.twoSided);
		return o[o.length - 1] = n, un(o, xn(o, t, r, e.blend), He(o, t, e.scale), t.twoSided, String(a));
	}
	renderBar(e, t, n, r) {
		let i = t.twoSided ? Ve(0, t.min, t.max).zero : null, a = O;
		if (n !== null) {
			let i = Ve(n, t.min, t.max), o = en(n, t, r, e.blend);
			a = T`<div
        class="fill"
        style="left: ${i.left}%; width: ${i.width}%; background: ${o}"
      ></div>`;
		}
		return T`
      <div class="track">
        ${a}${i === null ? O : T`<div class="zero" style="left: ${i}%"></div>`}
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
}, Cn = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, wn = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Tn = class {
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
}, { I: En } = Me, Dn = (e) => e, On = () => document.createComment(""), J = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new En(r.insertBefore(On(), i), r.insertBefore(On(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = Dn(e).nextSibling;
				Dn(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, Y = (e, t, n = e) => (e._$AI(t, n), e), kn = {}, An = (e, t = kn) => e._$AH = t, jn = (e) => e._$AH, Mn = (e) => {
	e._$AR(), e._$AA.remove();
}, Nn = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Pn = wn(class extends Tn {
	constructor(e) {
		if (super(e), e.type !== Cn.CHILD) throw Error("repeat() can only be used in text expressions");
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
		let i = jn(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = Y(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = Y(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = Y(i[d], a[m]), J(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = Y(i[f], a[p]), J(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Nn(o, p, m), u = Nn(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = J(e, i[d]);
					Y(t, a[p]), c[p] = t;
				} else c[p] = Y(n, a[p]), J(e, i[d], n), i[t] = null;
				p++;
			} else Mn(i[f]), f--;
		} else Mn(i[d]), d++;
		for (; p <= m;) {
			let t = J(e, c[m + 1]);
			Y(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Mn(e);
		}
		return this.ut = o, An(e, c), D;
	}
}), Fn = [
	"normal",
	"warning",
	"critical"
], In = Fn, Ln = [
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
], Rn = 0, X = Dt({
	type: "",
	meters: ["sensor.x"]
}), zn = X.meters[0].max, Z = {
	order: "Normal ≤ Warning ≤ Critical",
	negative: "Use a positive value: two-sided thresholds apply to |value|",
	range: "Max must be above Min",
	twoSided: "Two-sided: thresholds apply to |value|",
	chartConflict: "Stacked and Lines cannot be shown together; only the first one listed is shown",
	notInChart: "Not in chart"
}, Bn = {
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
}, Vn = {
	normal: "Normal color",
	warning: "Warning color",
	critical: "Critical color"
};
function Hn(e) {
	return e === void 0 || e === "" || Array.isArray(e) && e.length === 0;
}
function Un(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) Hn(r) ? delete n[e] : n[e] = r;
	return n;
}
function Wn(e) {
	return typeof e == "string" ? { entity: e } : { ...e };
}
function Gn(e, t) {
	return Number.isInteger(t) && t >= 0 && t < e.meters.length;
}
function Kn(e, t) {
	return {
		...e,
		meters: [...e.meters, { entity: t }]
	};
}
function qn(e, t) {
	return Gn(e, t) ? {
		...e,
		meters: e.meters.filter((e, n) => n !== t)
	} : e;
}
function Jn(e, t, n) {
	let r = t + n;
	if (!Gn(e, t) || !Gn(e, r)) return e;
	let i = [...e.meters];
	return [i[t], i[r]] = [i[r], i[t]], {
		...e,
		meters: i
	};
}
function Yn(e, t, n) {
	if (!Gn(e, t)) return e;
	let r = Wn(e.meters[t]), i = Un(r, n);
	if (ur(r, i)) return e;
	let a = [...e.meters];
	return a[t] = i, {
		...e,
		meters: a
	};
}
function Xn(e, t) {
	return Un(e, t);
}
function Zn(e, t, n) {
	let r = Un(e.colors ?? {}, { [t]: n });
	return Xn(e, { colors: Object.keys(r).length > 0 ? r : void 0 });
}
function Qn(e) {
	return Math.round(e * 100) / 100;
}
function $n(e) {
	let t = e.twoSided ? 0 : e.min, n = e.twoSided ? Math.max(-e.min, e.max) : e.max, r = (e) => Math.min(100, Math.max(0, Qn((e - t) * 100 / (n - t)))), i = r(e.normal), a = r(e.warning);
	return {
		normal: [0, i],
		warning: [i, a],
		critical: [a, 100]
	};
}
function er(e, t) {
	let n = {};
	if (e.errors.includes("range") && (n.max = Z.range), e.errors.includes("thresholds_negative")) {
		let e = In.filter((e) => (t?.[e] ?? 0) < 0);
		for (let t of e.length > 0 ? e : ["normal"]) n[t] = Z.negative;
	}
	if (e.errors.includes("thresholds_order")) {
		let r = t ? tr(t, e.twoSided) : [];
		for (let e of r.length > 0 ? r : ["warning"]) n[e] ??= Z.order;
	}
	return n;
}
function tr(e, t) {
	let n = [], r = -Infinity;
	for (let i of In) {
		let a = e[i];
		if (typeof a != "number" || !Number.isFinite(a)) continue;
		let o = t ? Math.abs(a) : a;
		o < r && n.push(i), r = Math.max(r, o);
	}
	return n;
}
function nr(e, t) {
	return Array.isArray(e) && Array.isArray(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e === t;
}
function rr(e, t) {
	let n = {};
	for (let r of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) nr(e[r], t[r]) || (n[r] = t[r]);
	return n;
}
function ir(e) {
	let t = e?.includes("sparkline") ?? !1, n = e?.includes("bar") ?? !1;
	return t && n ? "both" : t ? "sparkline" : n ? "bar" : "default";
}
var ar = {
	default: void 0,
	sparkline: ["sparkline"],
	bar: ["bar"],
	both: ["sparkline", "bar"]
};
function or(e, t) {
	let n = Wn(e), r = {};
	for (let e of Ln) n[e] !== void 0 && (r[e] = n[e]);
	r.display = ir(n.display);
	let i = n.tap_action;
	return r.tap_action = t ?? i?.action ?? "more-info", i?.action === "navigate" && (r.navigation_path = i.navigation_path), i?.action === "url" && (r.url_path = i.url_path), r;
}
function sr(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : void 0;
}
function cr(e, t, n) {
	if (e === "none") return { action: "none" };
	let r = sr(t);
	if (e === "navigate" && r) return {
		action: "navigate",
		navigation_path: r
	};
	let i = sr(n);
	if (e === "url" && i) return {
		action: "url",
		url_path: i
	};
}
function lr(e) {
	if (e.tap_action === "navigate" && !sr(e.navigation_path)) return "navigate";
	if (e.tap_action === "url" && !sr(e.url_path)) return "url";
}
function ur(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e) || Array.isArray(t)) return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((e, n) => ur(e, t[n]));
	if (typeof e != "object" || typeof t != "object" || e === null || t === null) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	return n.length === r.length && n.every((n) => n in t && ur(e[n], t[n]));
}
function dr(e) {
	return typeof e == "string" ? e : e.entity ?? "";
}
function fr(e, t, n, r) {
	let i = /* @__PURE__ */ new Set(), a = n.map(() => void 0);
	n.forEach((n, r) => {
		let o = dr(n);
		if (o === "") return;
		let s = e.findIndex((e, n) => dr(e) === o && t[n] !== void 0 && !i.has(t[n]));
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
function pr(e, t) {
	return ur(e, t);
}
function mr(e, t, n) {
	let r = {};
	for (let t of Ln) t in e && (r[t] = Hn(e[t]) ? void 0 : e[t]);
	if (r.entity === void 0 && delete r.entity, "display" in e && (r.display = ar[e.display]), "tap_action" in e || "navigation_path" in e || "url_path" in e) {
		let i = t.tap_action, a = (t) => t in e ? e[t] : i && t in i ? i[t] : void 0;
		r.tap_action = cr("tap_action" in e ? e.tap_action : n ?? i?.action ?? "more-info", a("navigation_path"), a("url_path"));
	}
	return r;
}
var Q = {
	step: "any",
	mode: "box"
};
function hr(e, t) {
	return e.meters.filter((e, n) => n !== t).map((e) => typeof e == "string" ? e : e.entity).filter((e) => typeof e == "string" && e !== "");
}
function gr(e = []) {
	let t = { filter: { domain: "sensor" } };
	return e.length > 0 && (t.exclude_entities = e), { entity: t };
}
function _r(e, t = []) {
	let n = [
		{
			name: "entity",
			required: !0,
			selector: gr(t)
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
function vr(e) {
	return String(Qn(e));
}
function yr(e, t, n, r = {}, i) {
	let a = t[e], o = a === void 0 || a === "", s = In.includes(e);
	if (n?.twoSided && (e === "min" || s && !o)) return Z.twoSided;
	if (o) {
		if (s && n) {
			let t = `Default: ${vr(n.errors.includes("thresholds_order") ? wt(n.min, n.max)[e] : n[e])}`;
			return n.twoSided ? `${t} · two-sided, thresholds apply to |value|` : t;
		}
		if (e === "min") return `Default: ${Rn}`;
		if (e === "max") return `Default: ${zn}`;
		if (e === "color" && i !== void 0) return `Default: ${K(i)}`;
		if (e === "name" && r.friendly_name) return `Default: ${r.friendly_name}`;
		if (e === "unit" && r.unit_of_measurement) return `Default: ${r.unit_of_measurement}`;
	}
}
function br(e, t = {}) {
	let n = Wn(e);
	return n.name || t.friendly_name || n.entity;
}
function xr(e, t) {
	try {
		return Dt({
			...e,
			meters: [e.meters[t]]
		}).meters[0];
	} catch {
		return;
	}
}
function Sr() {
	return [
		...wr,
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
			selector: gr()
		}
	];
}
var Cr = [
	"title",
	"display",
	"hours",
	"sparkline_scale",
	"blend",
	"chart",
	"rows",
	"total"
], wr = [
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
function Tr(e) {
	let t = {};
	return e.title !== void 0 && (t.title = e.title), t.display = e.display ?? [...X.display], t.hours = e.hours ?? X.hours, t.sparkline_scale = e.sparkline_scale ?? X.scale, t.blend = e.blend ?? X.blend, t.chart = e.chart === void 0 ? [] : Array.isArray(e.chart) ? [...e.chart] : [e.chart], t.rows = e.rows ?? X.rows, e.total !== void 0 && (t.total = e.total), t;
}
function Er(e) {
	let t = {};
	for (let n of Cr) n in e && (t[n] = Hn(e[n]) ? void 0 : e[n]);
	return t.rows === !0 && (t.rows = void 0), t;
}
function Dr(e, t, n) {
	if (t !== void 0 && t !== "") return t;
	let r = n?.states[e];
	return r ? r.attributes.unit_of_measurement : null;
}
function Or(e, t) {
	if (e.chart === void 0) return [];
	let n = [], { warnings: r } = Dt({
		type: "",
		chart: e.chart,
		meters: ["sensor.x"]
	});
	r.includes("chart_conflict") && n.push(Z.chartConflict);
	let i = e.meters.map(Wn).filter((e) => typeof e.entity == "string"), a = [], o = (e, n, r, i = "") => {
		let o = Dr(e, n, t);
		if (o === null || on(o)) return;
		let s = r ?? t?.states[e]?.attributes.friendly_name ?? e;
		a.push(`${s} (${o}${i})`);
	};
	for (let e of i) o(e.entity, e.unit, e.name);
	return e.total && o(e.total, void 0, void 0, ", total"), a.length > 0 && n.push(`${Z.notInChart}: ${a.join(", ")}`), n;
}
// src/editor.ts
var kr = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", Ar = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", jr = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", Mr = (e) => [{
	name: "entity",
	selector: gr(hr(e))
}], Nr = (e) => customElements.get("ha-alert") ? T`<ha-alert class="warning" alert-type="warning">${e}</ha-alert>` : T`<div class="warning" role="alert">${e}</div>`, Pr = (e) => Bn[e.name] ?? e.name, Fr = () => customElements.get("ha-form") !== void 0 && customElements.get("ha-expansion-panel") !== void 0;
async function Ir() {
	if (Fr()) return !1;
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
var Lr = class extends M {
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
		super.connectedCallback(), this.loadStarted || (this.loadStarted = !0, Ir().then((e) => {
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
		let { keys: t, nextKey: n } = fr(this.config?.meters ?? [], this.keys, e.meters, this.nextKey);
		this.keys = t, this.nextKey = n;
		let r = new Set(t), i = Object.fromEntries(Object.entries(this.pending).filter(([e]) => r.has(Number(e))));
		Object.keys(i).length !== Object.keys(this.pending).length && (this.pending = i), this.config = e;
	}
	commit(e) {
		this.config && pr(e, this.config) || (this.apply(e), this.dispatchEvent(new CustomEvent("config-changed", {
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
		let n = rr(Tr(e), t.detail.value);
		this.commit(Xn(e, Er(n)));
	}
	onColorChanged(e, t, n) {
		n.stopPropagation();
		let r = n.detail.value[t];
		this.commit(Zn(e, t, typeof r == "string" ? r.trim() : void 0));
	}
	onMeterChanged(e, t, n) {
		n.stopPropagation();
		let r = e.meters[t], i = typeof r == "string" ? { entity: r } : r, a = this.keys[t], o = this.pending[a], s = rr(or(r, o), n.detail.value);
		if (Object.keys(s).length === 0) return;
		let c = lr(n.detail.value);
		if (c !== o) {
			let e = { ...this.pending };
			c ? e[a] = c : delete e[a], this.pending = e;
		}
		this.commit(Yn(e, t, mr(s, i, o)));
	}
	onAdd(e, t) {
		t.stopPropagation();
		let n = t.detail.value.entity;
		typeof n == "string" && n !== "" && this.commit(Kn(e, n));
	}
	onButton(e, t) {
		e.stopPropagation(), this.commit(t());
	}
	stop(e) {
		e.stopPropagation();
	}
	render() {
		let e = this.config;
		return e ? T`
      <div class="section">
        <h3>Panel</h3>
        ${Or(e, this.hass).map(Nr)}
        <ha-form
          class="panel"
          .hass=${this.hass}
          .data=${Tr(e)}
          .schema=${Sr()}
          .computeLabel=${Pr}
          .computeHelper=${(e) => e.name === "hours" ? `Default: ${X.hours}` : void 0}
          @value-changed=${(t) => this.onPanelChanged(e, t)}
        ></ha-form>
        ${Fn.map((t) => this.renderColor(e, t))}
      </div>
      <div class="section">
        <h3>Meters</h3>
        ${Pn(e.meters, (e, t) => this.keys[t], (t, n) => this.renderMeter(e, n))}
        <ha-form
          class="add"
          .hass=${this.hass}
          .data=${{}}
          .schema=${Mr(e)}
          .computeLabel=${() => "Add meter"}
          @value-changed=${(t) => this.onAdd(e, t)}
        ></ha-form>
      </div>
    ` : O;
	}
	renderColor(e, t) {
		let n = e.colors?.[t], r = X.colors[t];
		return T`
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
          .computeLabel=${() => Vn[t]}
          .computeHelper=${() => `Default: ${r}`}
          @value-changed=${(n) => this.onColorChanged(e, t, n)}
        ></ha-form>
      </div>
    `;
	}
	renderMeter(e, t) {
		let n = e.meters[t], r = typeof n == "string" ? { entity: n } : n, i = this.attrs(r.entity), a = xr(e, t), o = or(n, this.pending[this.keys[t]]), s = e.meters.length - 1;
		return T`
      <ha-expansion-panel outlined data-index=${t} .header=${br(n, i)}>
        <div slot="icons" class="buttons" @click=${this.stop} @keydown=${this.stop}>
          <span
            class="swatch meter-swatch"
            title="Series color"
            style="background: ${K(t, r.color)}"
          ></span>
          <ha-icon-button
            class="up"
            .label=${"Move up"}
            .path=${kr}
            ?disabled=${t === 0}
            @click=${(n) => this.onButton(n, () => Jn(e, t, -1))}
          ></ha-icon-button>
          <ha-icon-button
            class="down"
            .label=${"Move down"}
            .path=${Ar}
            ?disabled=${t === s}
            @click=${(n) => this.onButton(n, () => Jn(e, t, 1))}
          ></ha-icon-button>
          <ha-icon-button
            class="delete"
            .label=${"Remove meter"}
            .path=${jr}
            ?disabled=${s === 0}
            @click=${(n) => this.onButton(n, () => qn(e, t))}
          ></ha-icon-button>
        </div>
        <ha-form
          class="meter"
          .hass=${this.hass}
          .data=${o}
          .schema=${_r(String(o.tap_action), hr(e, t))}
          .error=${a ? er(a, r) : {}}
          .computeLabel=${Pr}
          .computeHelper=${(e) => yr(e.name, r, a, i, t)}
          @value-changed=${(n) => this.onMeterChanged(e, t, n)}
        ></ha-form>
        ${a ? this.renderBands(e, a) : O}
      </ha-expansion-panel>
    `;
	}
	renderBands(e, t) {
		let n = $n(t), r = (t) => e.colors?.[t] || X.colors[t];
		return T`<div
      class="bands"
      role="img"
      aria-label="Threshold preview"
      style="background: linear-gradient(to right, ${Fn.map((e) => `${r(e)} ${n[e][0]}% ${n[e][1]}%`).join(", ")})"
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
}, $ = "constant-powermeter-card", Rr = `${$}-editor`;
console.info(`${$} v${e}`), customElements.get($) || customElements.define($, Sn), customElements.get(Rr) || customElements.define(Rr, Lr);
var zr = window;
zr.customCards ??= [], zr.customCards.some((e) => e.type === $) || zr.customCards.push({
	type: $,
	name: "Constant Powermeter Card",
	preview: !0,
	description: "Power meters with per-meter thresholds, a sparkline and a bar.",
	documentationURL: "https://github.com/uded/constant-powermeter-card"
});
