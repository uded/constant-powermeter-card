// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
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
}, oe = (e, t) => !l(e, t), se = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: oe
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var h = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = se) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
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
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
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
		return s(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
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
h.elementStyles = [], h.shadowRootOptions = { mode: "open" }, h[p("elementProperties")] = /* @__PURE__ */ new Map(), h[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: h }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var g = globalThis, ce = (e) => e, _ = g.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", C = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, ye = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), E = ye(1), D = ye(2), O = Symbol.for("lit-noChange"), k = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), A = y.createTreeWalker(y, 129);
function xe(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var Se = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
	}
	return [xe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, j = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Se(t, n);
		if (this.el = e.createElement(l, r), A.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = A.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : N
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), A.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function M(e, t, n = e, r) {
	if (t === O) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = M(e, i._$AS(e, t.values), i, r)), t;
}
var Ce = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		A.currentNode = r;
		let i = A.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new we(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = A.nextNode(), a++);
		}
		return A.currentNode = y, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, we = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = k, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = M(this, e, t), x(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== O && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== k && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = j.createElement(xe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = be.get(e.strings);
		return t === void 0 && be.set(e.strings, t = new j(e)), t;
	}
	k(t) {
		S(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
}, N = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = k, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = k;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = M(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = M(this, r[n + o], t, o), s === O && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === k ? e = k : e !== k && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends N {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === k ? void 0 : e;
	}
}, Ee = class extends N {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== k);
	}
}, De = class extends N {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = M(this, e, t, 0) ?? k) === O) return;
		let n = this._$AH, r = e === k && n !== k || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== k && (n === k || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		M(this, e);
	}
}, ke = g.litHtmlPolyfillSupport;
ke?.(j, we), (g.litHtmlVersions ??= []).push("3.3.3");
var Ae = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new we(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, je = globalThis, P = class extends h {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ae(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return O;
	}
};
P._$litElement$ = !0, P.finalized = !0, je.litElementHydrateSupport?.({ LitElement: P });
var Me = je.litElementPolyfillSupport;
Me?.({ LitElement: P }), (je.litElementVersions ??= []).push("4.2.2");
// src/actions.ts
function Ne(e, t, n) {
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
function Pe(e, t) {
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
var F = class extends Error {
	constructor(e) {
		super(e), this.name = "ConfigError";
	}
}, Fe = ["sparkline", "bar"], I = {
	normal: "var(--success-color)",
	warning: "var(--warning-color)",
	critical: "var(--error-color)"
}, Ie = 5e3, Le = .25, Re = 24;
function L(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function R(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function z(e) {
	return typeof e == "string" && e !== "" ? e : void 0;
}
function ze(e, t) {
	if (!Array.isArray(e)) return t;
	let n = e.filter((e) => e === "sparkline" || e === "bar");
	return n.length > 0 ? n : t;
}
function Be(e) {
	if (L(e)) {
		if (e.action === "none") return { action: "none" };
		if (e.action === "navigate" && z(e.navigation_path)) return {
			action: "navigate",
			navigation_path: e.navigation_path
		};
		if (e.action === "url" && z(e.url_path)) return {
			action: "url",
			url_path: e.url_path
		};
	}
	return { action: "more-info" };
}
function Ve(e, t) {
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
function He(e, t) {
	let n = typeof e == "string" ? { entity: e } : L(e) ? e : {}, r = z(n.entity);
	if (!r) throw new F("Each meter needs an entity id");
	let i = [], a = R(n.min) ?? 0, o = R(n.max) ?? Ie;
	o <= a && (i.push("range"), o = a + 1);
	let s = a < 0, c = Ve(a, o), l = [
		R(n.normal) ?? c.normal,
		R(n.warning) ?? c.warning,
		R(n.critical) ?? c.critical
	];
	s && l.some((e) => e < 0) && (i.push("thresholds_negative"), l = l.map(Math.abs));
	let u = [...l].sort((e, t) => e - t);
	u.some((e, t) => e !== l[t]) && i.push("thresholds_order");
	let [d, ee, te] = u;
	return {
		entity: r,
		name: z(n.name),
		unit: z(n.unit),
		precision: R(n.precision),
		min: a,
		max: o,
		normal: d,
		warning: ee,
		critical: te,
		twoSided: s,
		display: ze(n.display, t),
		tapAction: Be(n.tap_action),
		errors: i
	};
}
function B(e) {
	if (!L(e)) throw new F("Invalid configuration");
	if (!Array.isArray(e.meters) || e.meters.length === 0) throw new F("At least one meter is required");
	let t = ze(e.display, Fe), n = L(e.colors) ? e.colors : {}, r = Math.min(Re, Math.max(Le, R(e.hours) ?? 1));
	return {
		title: z(e.title),
		display: t,
		hours: r,
		scale: e.sparkline_scale === "auto" ? "auto" : "fixed",
		colors: {
			normal: z(n.normal) ?? I.normal,
			warning: z(n.warning) ?? I.warning,
			critical: z(n.critical) ?? I.critical
		},
		blend: e.blend !== !1,
		meters: e.meters.map((e) => He(e, t))
	};
}
// src/geometry.ts
function Ue(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function We(e, t, n) {
	let r = n - t, i = (e) => (Ue(e, t, n) - t) * 100 / r;
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
function Ge(e, t, n) {
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
function Ke(e, t, n) {
	let r = t.hi - t.lo || 1;
	return n - (Ue(e, t.lo, t.hi) - t.lo) / r * n;
}
var V = (e) => String(Math.round(e * 100) / 100);
function qe(e, t, n) {
	let r = (t) => e.length > 1 ? t * n.w / (e.length - 1) : 0, i = (e) => Ke(e, t, n.h), a = i(0), o = [], s = [], c = [], l = () => {
		if (c.length > 0) {
			let e = (c.length === 1 ? [c[0], c[0]] : c).map((e, t) => `${t === 0 ? "M" : "L"}${V(e.x)} ${V(e.y)}`).join(" "), t = c[0], n = c[c.length - 1];
			o.push(e), s.push(`${e} L${V(n.x)} ${V(a)} L${V(t.x)} ${V(a)} Z`);
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
var Je = 1e3, Ye = 6e4, Xe = 36e5;
function Ze(e) {
	if (e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function Qe(e, t) {
	let n = 0, r = e.length;
	for (; n < r;) {
		let i = n + r >>> 1;
		e[i].t < t ? n = i + 1 : r = i;
	}
	return n;
}
function $e(e, t) {
	let n = Qe(e, t.t);
	n < e.length && e[n].t === t.t ? e[n] = t : e.splice(n, 0, t);
}
function et(e, t) {
	if (t.states) for (let [n, r] of Object.entries(t.states)) {
		let t = e.get(n);
		for (let i of r) {
			let r = i.lu ?? i.lc;
			r !== void 0 && (t || (t = [], e.set(n, t)), $e(t, {
				t: r * 1e3,
				v: Ze(i.s)
			}));
		}
	}
}
function tt(e, t) {
	for (let n of e.values()) {
		let e = Qe(n, t);
		e > 1 && n.splice(0, e - 1);
	}
}
var nt = class {
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
	constructor(e, t, n = Date.now) {
		this.conn = e, this.onChange = t, this.now = n;
	}
	update(e, t) {
		let n = [...new Set(e)].sort(), r = `${n.join(",")}|${t}`;
		r !== (this.debounceTimer ? this.pendingKey : this.activeKey) && (this.clearDebounce(), r !== this.activeKey && (this.pendingKey = r, this.debounceTimer = setTimeout(() => {
			this.debounceTimer = void 0, this.subscribe(n, t, r);
		}, Je)));
	}
	close() {
		this.clearDebounce(), this.generation++, this.teardown(), this.activeKey = void 0;
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
		if (this.activeKey = n, this.hours = t, e.length === 0) return;
		let a = this.now() - t * Xe;
		this.trimTimer = setInterval(() => tt(this.store, this.now() - this.hours * Xe), Ye), this.conn.subscribeMessage((e) => {
			i === this.generation && (et(this.store, e), this.onChange());
		}, {
			type: "history/stream",
			entity_ids: e,
			start_time: new Date(a).toISOString(),
			minimal_response: !0,
			no_attributes: !0,
			significant_changes_only: !1
		}).then((e) => {
			i === this.generation ? this.unsub = e : e().catch(() => {});
		}).catch((e) => {
			i === this.generation && console.error("powermeter-card: history/stream subscription failed", e);
		});
	}
}, H = {
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
}, rt = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i, it = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i, at = /^var\(\s*(--[^,\s)]+)\s*(?:,[^)]*)?\)$/;
function U(e) {
	return Math.max(0, Math.min(255, Math.round(e)));
}
function ot(e) {
	let t = e.trim(), n = rt.exec(t);
	if (n) {
		let e = n[1];
		return e.length === 3 && (e = [...e].map((e) => e + e).join("")), {
			r: parseInt(e.slice(0, 2), 16),
			g: parseInt(e.slice(2, 4), 16),
			b: parseInt(e.slice(4, 6), 16)
		};
	}
	let r = it.exec(t);
	return r ? {
		r: U(Number(r[1])),
		g: U(Number(r[2])),
		b: U(Number(r[3]))
	} : null;
}
function W(e, t, n) {
	let r = t.trim(), i = at.exec(r);
	return i && (r = getComputedStyle(e).getPropertyValue(i[1]).trim()), ot(r) ?? n;
}
function st(e, t) {
	return {
		normal: W(e, t.normal, H.normal),
		warning: W(e, t.warning, H.warning),
		critical: W(e, t.critical, H.critical)
	};
}
function ct(e, t, n) {
	return {
		r: Math.round(e.r + (t.r - e.r) * n),
		g: Math.round(e.g + (t.g - e.g) * n),
		b: Math.round(e.b + (t.b - e.b) * n)
	};
}
function lt(e, t, n) {
	return n > t ? (e - t) / (n - t) : 1;
}
function G(e) {
	return `rgb(${e.r}, ${e.g}, ${e.b})`;
}
function ut(e, t, n, r) {
	let i = t.twoSided ? Math.abs(e) : e;
	return r ? i <= t.normal ? G(n.normal) : i >= t.critical ? G(n.critical) : i <= t.warning ? G(ct(n.normal, n.warning, lt(i, t.normal, t.warning))) : G(ct(n.warning, n.critical, lt(i, t.warning, t.critical))) : i < t.warning ? G(n.normal) : i < t.critical ? G(n.warning) : G(n.critical);
}
// src/sparkline.ts
var K = 60, dt = 24;
function ft(e, t, n, r, i) {
	let { lines: a, areas: o } = qe(e, n, {
		w: K,
		h: dt
	}), s = `cpm-grad-${i}`, c = e.length, l = Ke(0, n, dt);
	return D`
    <svg viewBox="0 0 ${K} ${dt}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${K} y2="0">
          ${e.map((e, n) => t[n] ?? t[t.length - 1] ?? "currentColor").map((e, t) => D`<stop offset=${c > 1 ? t / (c - 1) : 0} stop-color=${e}></stop>`)}
        </linearGradient>
      </defs>
      ${r ? D`<line class="zero" x1="0" y1=${l} x2=${K} y2=${l} stroke="currentColor" stroke-opacity="0.3" vector-effect="non-scaling-stroke"></line>` : ""}
      ${o.map((e) => D`<path class="area" d=${e} fill="url(#${s})" fill-opacity="0.15"></path>`)}
      ${a.map((e) => D`<path class="line" d=${e} fill="none" stroke="url(#${s})" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>`)}
    </svg>
  `;
}
// src/card.ts
var pt = 60, mt = 36e5, ht = 10, gt = "custom:constant-powermeter-card", _t = 15e3;
function vt(e) {
	if (e === void 0 || e.trim() === "") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function yt(e) {
	return e === void 0 || !Number.isFinite(e) ? 0 : Math.min(ht, Math.max(0, Math.round(e)));
}
function bt(e, t, n, r) {
	let i = e.find((e) => e !== null);
	if (i === void 0) return [];
	let a = ut(i, t, n, r);
	return e.map((e) => (e !== null && (a = ut(e, t, n, r)), a));
}
var xt = class extends P {
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
			type: gt,
			meters: [(t.find((e) => e.attributes.device_class === "power" || e.attributes.unit_of_measurement === "W" || e.attributes.unit_of_measurement === "kW") ?? t[0])?.entity_id ?? "sensor.power"]
		};
	}
	setConfig(e) {
		this.config = B(e), this.palette = void 0, this.syncHistory(), this.syncTick();
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
		let e = Math.max(_t, this.config.hours * mt / pt);
		(this.tickTimer === void 0 || e !== this.tickMs) && (this.stopTick(), this.tickMs = e, this.tickTimer = setInterval(() => this.requestUpdate(), e));
	}
	stopTick() {
		this.tickTimer !== void 0 && clearInterval(this.tickTimer), this.tickTimer = void 0, this.tickMs = 0;
	}
	syncHistory() {
		this.isConnected && this.hass && this.config && (this.history ??= new nt(this.hass.connection, () => this.requestUpdate()), this.history.update(this.config.meters.map((e) => e.entity), this.config.hours));
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
		this.clickable(t) && Ne(e.currentTarget, t.tapAction, t.entity);
	}
	onKey(e, t) {
		e.key !== "Enter" && e.key !== " " || e.repeat || (e.preventDefault(), this.act(e, t));
	}
	render() {
		let e = this.config;
		if (!e || !this.hass) return k;
		let t = this.palette ?? st(this, e.colors);
		this.isConnected && (this.palette = t);
		let n = Date.now();
		return E`
      <ha-card .header=${e.title}>
        <div class="rows">${e.meters.map((r, i) => this.renderRow(e, r, i, t, n))}</div>
      </ha-card>
    `;
	}
	renderRow(e, t, n, r, i) {
		let a = this.hass.states[t.entity], o = vt(a?.state), s = t.name ?? a?.attributes.friendly_name ?? t.entity, c = t.unit ?? a?.attributes.unit_of_measurement ?? "", l = yt(t.precision ?? this.hass.entities?.[t.entity]?.display_precision), u = this.clickable(t);
		return E`
      <div
        class="row"
        role=${u ? "button" : k}
        tabindex=${u ? "0" : k}
        @click=${(e) => this.act(e, t)}
        @keydown=${(e) => this.onKey(e, t)}
      >
        <div class="line">
          <span class="name" title=${s}>${s}</span>
          <span class="spark">
            ${t.display.includes("sparkline") ? this.renderSpark(e, t, o, r, i, n) : k}
          </span>
          <span class="value"
            >${o === null ? "—" : this.format(o, l)}${o !== null && c ? E`<span class="unit">${c}</span>` : k}</span
          >
        </div>
        ${t.display.includes("bar") ? this.renderBar(e, t, o, r) : k}
      </div>
    `;
	}
	renderSpark(e, t, n, r, i, a) {
		let o = Pe(this.history?.store.get(t.entity) ?? [], {
			start: i - e.hours * mt,
			end: i,
			count: pt,
			twoSided: t.twoSided
		});
		return o[o.length - 1] = n, ft(o, bt(o, t, r, e.blend), Ge(o, t, e.scale), t.twoSided, String(a));
	}
	renderBar(e, t, n, r) {
		let i = t.twoSided ? We(0, t.min, t.max).zero : null, a = k;
		if (n !== null) {
			let i = We(n, t.min, t.max), o = ut(n, t, r, e.blend);
			a = E`<div
        class="fill"
        style="left: ${i.left}%; width: ${i.width}%; background: ${o}"
      ></div>`;
		}
		return E`
      <div class="track">
        ${a}${i === null ? k : E`<div class="zero" style="left: ${i}%"></div>`}
      </div>
    `;
	}
	static styles = o`
    :host {
      display: block;
    }
    .rows {
      padding: 8px 0;
    }
    .row {
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
      display: grid;
      grid-template-columns: var(--cpm-name-width, 8em) minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 12px;
      min-height: 24px;
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
}, St = [
	"normal",
	"warning",
	"critical"
], Ct = St, wt = [
	"entity",
	"name",
	"unit",
	"precision",
	"min",
	"max",
	"normal",
	"warning",
	"critical"
], Tt = 0, q = B({
	type: "",
	meters: ["sensor.x"]
}), Et = q.meters[0].max, J = {
	order: "Normal ≤ Warning ≤ Critical",
	negative: "Use a positive value: two-sided thresholds apply to |value|",
	range: "Max must be above Min",
	twoSided: "Two-sided: thresholds apply to |value|"
}, Dt = {
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
}, Ot = {
	normal: "Normal color",
	warning: "Warning color",
	critical: "Critical color"
};
function kt(e) {
	return e === void 0 || e === "" || Array.isArray(e) && e.length === 0;
}
function At(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) kt(r) ? delete n[e] : n[e] = r;
	return n;
}
function jt(e) {
	return typeof e == "string" ? { entity: e } : { ...e };
}
function Y(e, t) {
	return Number.isInteger(t) && t >= 0 && t < e.meters.length;
}
function Mt(e, t) {
	return {
		...e,
		meters: [...e.meters, { entity: t }]
	};
}
function Nt(e, t) {
	return Y(e, t) ? {
		...e,
		meters: e.meters.filter((e, n) => n !== t)
	} : e;
}
function Pt(e, t, n) {
	let r = t + n;
	if (!Y(e, t) || !Y(e, r)) return e;
	let i = [...e.meters];
	return [i[t], i[r]] = [i[r], i[t]], {
		...e,
		meters: i
	};
}
function Ft(e, t, n) {
	if (!Y(e, t)) return e;
	let r = jt(e.meters[t]), i = At(r, n);
	if (Z(r, i)) return e;
	let a = [...e.meters];
	return a[t] = i, {
		...e,
		meters: a
	};
}
function It(e, t) {
	return At(e, t);
}
function Lt(e, t, n) {
	let r = At(e.colors ?? {}, { [t]: n });
	return It(e, { colors: Object.keys(r).length > 0 ? r : void 0 });
}
function Rt(e) {
	return Math.round(e * 100) / 100;
}
function zt(e) {
	let t = e.twoSided ? 0 : e.min, n = e.twoSided ? Math.max(-e.min, e.max) : e.max, r = (e) => Math.min(100, Math.max(0, Rt((e - t) * 100 / (n - t)))), i = r(e.normal), a = r(e.warning);
	return {
		normal: [0, i],
		warning: [i, a],
		critical: [a, 100]
	};
}
function Bt(e, t) {
	let n = {};
	if (e.errors.includes("range") && (n.max = J.range), e.errors.includes("thresholds_negative")) {
		let e = Ct.filter((e) => (t?.[e] ?? 0) < 0);
		for (let t of e.length > 0 ? e : ["normal"]) n[t] = J.negative;
	}
	return e.errors.includes("thresholds_order") && (n.warning ??= J.order), n;
}
function Vt(e, t) {
	return Array.isArray(e) && Array.isArray(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e === t;
}
function Ht(e, t) {
	let n = {};
	for (let r of /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])) Vt(e[r], t[r]) || (n[r] = t[r]);
	return n;
}
function Ut(e) {
	let t = e?.includes("sparkline") ?? !1, n = e?.includes("bar") ?? !1;
	return t && n ? "both" : t ? "sparkline" : n ? "bar" : "default";
}
var Wt = {
	default: void 0,
	sparkline: ["sparkline"],
	bar: ["bar"],
	both: ["sparkline", "bar"]
};
function Gt(e, t) {
	let n = jt(e), r = {};
	for (let e of wt) n[e] !== void 0 && (r[e] = n[e]);
	r.display = Ut(n.display);
	let i = n.tap_action;
	return r.tap_action = t ?? i?.action ?? "more-info", i?.action === "navigate" && (r.navigation_path = i.navigation_path), i?.action === "url" && (r.url_path = i.url_path), r;
}
function X(e) {
	return typeof e == "string" && e.trim() !== "" ? e.trim() : void 0;
}
function Kt(e, t, n) {
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
function qt(e) {
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
function Jt(e, t) {
	return Z(e, t);
}
function Yt(e, t, n) {
	let r = {};
	for (let t of wt) t in e && (r[t] = kt(e[t]) ? void 0 : e[t]);
	if (r.entity === void 0 && delete r.entity, "display" in e && (r.display = Wt[e.display]), "tap_action" in e || "navigation_path" in e || "url_path" in e) {
		let i = t.tap_action, a = (t) => t in e ? e[t] : i && t in i ? i[t] : void 0;
		r.tap_action = Kt("tap_action" in e ? e.tap_action : n ?? i?.action ?? "more-info", a("navigation_path"), a("url_path"));
	}
	return r;
}
var Q = {
	step: "any",
	mode: "box"
};
function Xt(e) {
	let t = [
		{
			name: "entity",
			required: !0,
			selector: { entity: { domain: "sensor" } }
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
	return e === "navigate" && t.push({
		name: "navigation_path",
		selector: { text: {} }
	}), e === "url" && t.push({
		name: "url_path",
		selector: { text: { type: "url" } }
	}), t;
}
function Zt(e) {
	return String(Rt(e));
}
function Qt(e, t, n, r = {}) {
	let i = t[e], a = i === void 0 || i === "", o = Ct.includes(e);
	if (n?.twoSided && (e === "min" || o && !a)) return J.twoSided;
	if (a) {
		if (o && n) {
			let t = `Default: ${Zt(Ve(n.min, n.max)[e])}`;
			return n.twoSided ? `${t} · two-sided, thresholds apply to |value|` : t;
		}
		if (e === "min") return `Default: ${Tt}`;
		if (e === "max") return `Default: ${Et}`;
		if (e === "name" && r.friendly_name) return `Default: ${r.friendly_name}`;
		if (e === "unit" && r.unit_of_measurement) return `Default: ${r.unit_of_measurement}`;
	}
}
function $t(e, t = {}) {
	let n = jt(e);
	return n.name || t.friendly_name || n.entity;
}
function en(e, t) {
	try {
		return B({
			...e,
			meters: [e.meters[t]]
		}).meters[0];
	} catch {
		return;
	}
}
var tn = [
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
function nn(e) {
	let t = {};
	return e.title !== void 0 && (t.title = e.title), t.display = e.display ?? [...q.display], t.hours = e.hours ?? q.hours, t.sparkline_scale = e.sparkline_scale ?? q.scale, t.blend = e.blend ?? q.blend, t;
}
function rn(e) {
	let t = {};
	for (let n of tn.map((e) => e.name)) n in e && (t[n] = kt(e[n]) ? void 0 : e[n]);
	return t;
}
// src/editor.ts
var an = "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z", on = "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z", sn = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", cn = [{
	name: "entity",
	selector: { entity: { domain: "sensor" } }
}], ln = (e) => Dt[e.name] ?? e.name, un = class extends P {
	static properties = {
		hass: { attribute: !1 },
		config: { state: !0 },
		pending: { state: !0 }
	};
	constructor() {
		super(), this.pending = {};
	}
	setConfig(e) {
		this.config = {
			...e,
			meters: Array.isArray(e.meters) ? e.meters : []
		};
	}
	commit(e, t = !1) {
		t && (this.pending = {}), this.config && Jt(e, this.config) || (this.config = e, this.dispatchEvent(new CustomEvent("config-changed", {
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
		let n = Ht(nn(e), t.detail.value);
		this.commit(It(e, rn(n)));
	}
	onColorChanged(e, t, n) {
		n.stopPropagation();
		let r = n.detail.value[t];
		this.commit(Lt(e, t, typeof r == "string" ? r.trim() : void 0));
	}
	onMeterChanged(e, t, n) {
		n.stopPropagation();
		let r = e.meters[t], i = typeof r == "string" ? { entity: r } : r, a = this.pending[t], o = Ht(Gt(r, a), n.detail.value);
		if (Object.keys(o).length === 0) return;
		let s = qt(n.detail.value);
		if (s !== a) {
			let e = { ...this.pending };
			s ? e[t] = s : delete e[t], this.pending = e;
		}
		this.commit(Ft(e, t, Yt(o, i, a)));
	}
	onAdd(e, t) {
		t.stopPropagation();
		let n = t.detail.value.entity;
		typeof n == "string" && n !== "" && this.commit(Mt(e, n), !0);
	}
	onButton(e, t) {
		e.stopPropagation(), this.commit(t(), !0);
	}
	stop(e) {
		e.stopPropagation();
	}
	render() {
		let e = this.config;
		return e ? E`
      <div class="section">
        <h3>Panel</h3>
        <ha-form
          class="panel"
          .hass=${this.hass}
          .data=${nn(e)}
          .schema=${tn}
          .computeLabel=${ln}
          .computeHelper=${(e) => e.name === "hours" ? `Default: ${q.hours}` : void 0}
          @value-changed=${(t) => this.onPanelChanged(e, t)}
        ></ha-form>
        ${St.map((t) => this.renderColor(e, t))}
      </div>
      <div class="section">
        <h3>Meters</h3>
        ${e.meters.map((t, n) => this.renderMeter(e, n))}
        <ha-form
          class="add"
          .hass=${this.hass}
          .data=${{}}
          .schema=${cn}
          .computeLabel=${() => "Add meter"}
          @value-changed=${(t) => this.onAdd(e, t)}
        ></ha-form>
      </div>
    ` : k;
	}
	renderColor(e, t) {
		let n = e.colors?.[t], r = q.colors[t];
		return E`
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
          .computeLabel=${() => Ot[t]}
          .computeHelper=${() => `Default: ${r}`}
          @value-changed=${(n) => this.onColorChanged(e, t, n)}
        ></ha-form>
      </div>
    `;
	}
	renderMeter(e, t) {
		let n = e.meters[t], r = typeof n == "string" ? { entity: n } : n, i = this.attrs(r.entity), a = en(e, t), o = Gt(n, this.pending[t]), s = e.meters.length - 1;
		return E`
      <ha-expansion-panel outlined data-index=${t} .header=${$t(n, i)}>
        <div slot="icons" class="buttons" @click=${this.stop} @keydown=${this.stop}>
          <ha-icon-button
            class="up"
            .label=${"Move up"}
            .path=${an}
            ?disabled=${t === 0}
            @click=${(n) => this.onButton(n, () => Pt(e, t, -1))}
          ></ha-icon-button>
          <ha-icon-button
            class="down"
            .label=${"Move down"}
            .path=${on}
            ?disabled=${t === s}
            @click=${(n) => this.onButton(n, () => Pt(e, t, 1))}
          ></ha-icon-button>
          <ha-icon-button
            class="delete"
            .label=${"Remove meter"}
            .path=${sn}
            ?disabled=${s === 0}
            @click=${(n) => this.onButton(n, () => Nt(e, t))}
          ></ha-icon-button>
        </div>
        <ha-form
          class="meter"
          .hass=${this.hass}
          .data=${o}
          .schema=${Xt(String(o.tap_action))}
          .error=${a ? Bt(a, r) : {}}
          .computeLabel=${ln}
          .computeHelper=${(e) => Qt(e.name, r, a, i)}
          @value-changed=${(n) => this.onMeterChanged(e, t, n)}
        ></ha-form>
        ${a ? this.renderBands(e, a) : k}
      </ha-expansion-panel>
    `;
	}
	renderBands(e, t) {
		let n = zt(t), r = (t) => e.colors?.[t] || q.colors[t];
		return E`<div
      class="bands"
      role="img"
      aria-label="Threshold preview"
      style="background: linear-gradient(to right, ${St.map((e) => `${r(e)} ${n[e][0]}% ${n[e][1]}%`).join(", ")})"
    ></div>`;
	}
	static styles = o`
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
}, $ = "constant-powermeter-card", dn = `${$}-editor`;
customElements.get($) || customElements.define($, xt), customElements.get(dn) || customElements.define(dn, un);
var fn = window;
fn.customCards ??= [], fn.customCards.some((e) => e.type === $) || fn.customCards.push({
	type: $,
	name: "Constant Powermeter Card",
	preview: !0,
	description: "Power meters with per-meter thresholds, a sparkline and a bar."
});
