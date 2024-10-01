var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var n, l$3, u$3, t$2, i$2, o$2, r$1, f$3, e$2, c$2, s$3, h$1 = {}, v$2 = [], p$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, y$2 = Array.isArray;
function d$3(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function w$2(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _$2(l2, u2, t2) {
  var i2, o2, r2, f2 = {};
  for (r2 in u2) "key" == r2 ? i2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (r2 in l2.defaultProps) void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
  return g$1(l2, f2, i2, o2, null);
}
function g$1(n2, t2, i2, o2, r2) {
  var f2 = { type: n2, props: t2, key: i2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == r2 ? ++u$3 : r2, __i: -1, __u: 0 };
  return null == r2 && null != l$3.vnode && l$3.vnode(f2), f2;
}
function b$1(n2) {
  return n2.children;
}
function k$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function x(n2, l2) {
  if (null == l2) return n2.__ ? x(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? x(n2) : null;
}
function C$1(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
      n2.__e = n2.__c.base = u2.__e;
      break;
    }
    return C$1(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i$2.push(n2) && !P.__r++ || o$2 !== l$3.debounceRendering) && ((o$2 = l$3.debounceRendering) || r$1)(P);
}
function P() {
  var n2, u2, t2, o2, r2, e2, c2, s2;
  for (i$2.sort(f$3); n2 = i$2.shift(); ) n2.__d && (u2 = i$2.length, o2 = void 0, e2 = (r2 = (t2 = n2).__v).__e, c2 = [], s2 = [], t2.__P && ((o2 = d$3({}, r2)).__v = r2.__v + 1, l$3.vnode && l$3.vnode(o2), O(t2.__P, o2, r2, t2.__n, t2.__P.namespaceURI, 32 & r2.__u ? [e2] : null, c2, null == e2 ? x(r2) : e2, !!(32 & r2.__u), s2), o2.__v = r2.__v, o2.__.__k[o2.__i] = o2, j$1(c2, o2, s2), o2.__e != e2 && C$1(o2)), i$2.length > u2 && i$2.sort(f$3));
  P.__r = 0;
}
function S(n2, l2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, p2, y2, d2, w2, _2 = t2 && t2.__k || v$2, g2 = l2.length;
  for (u2.__d = e2, $(u2, l2, _2), e2 = u2.__d, a2 = 0; a2 < g2; a2++) null != (y2 = u2.__k[a2]) && (p2 = -1 === y2.__i ? h$1 : _2[y2.__i] || h$1, y2.__i = a2, O(n2, y2, p2, i2, o2, r2, f2, e2, c2, s2), d2 = y2.__e, y2.ref && p2.ref != y2.ref && (p2.ref && N(p2.ref, null, y2), s2.push(y2.ref, y2.__c || d2, y2)), null == w2 && null != d2 && (w2 = d2), 65536 & y2.__u || p2.__k === y2.__k ? e2 = I(y2, e2, n2) : "function" == typeof y2.type && void 0 !== y2.__d ? e2 = y2.__d : d2 && (e2 = d2.nextSibling), y2.__d = void 0, y2.__u &= -196609);
  u2.__d = e2, u2.__e = w2;
}
function $(n2, l2, u2) {
  var t2, i2, o2, r2, f2, e2 = l2.length, c2 = u2.length, s2 = c2, a2 = 0;
  for (n2.__k = [], t2 = 0; t2 < e2; t2++) null != (i2 = l2[t2]) && "boolean" != typeof i2 && "function" != typeof i2 ? (r2 = t2 + a2, (i2 = n2.__k[t2] = "string" == typeof i2 || "number" == typeof i2 || "bigint" == typeof i2 || i2.constructor == String ? g$1(null, i2, null, null, null) : y$2(i2) ? g$1(b$1, { children: i2 }, null, null, null) : void 0 === i2.constructor && i2.__b > 0 ? g$1(i2.type, i2.props, i2.key, i2.ref ? i2.ref : null, i2.__v) : i2).__ = n2, i2.__b = n2.__b + 1, o2 = null, -1 !== (f2 = i2.__i = L(i2, u2, r2, s2)) && (s2--, (o2 = u2[f2]) && (o2.__u |= 131072)), null == o2 || null === o2.__v ? (-1 == f2 && a2--, "function" != typeof i2.type && (i2.__u |= 65536)) : f2 !== r2 && (f2 == r2 - 1 ? a2-- : f2 == r2 + 1 ? a2++ : (f2 > r2 ? a2-- : a2++, i2.__u |= 65536))) : i2 = n2.__k[t2] = null;
  if (s2) for (t2 = 0; t2 < c2; t2++) null != (o2 = u2[t2]) && 0 == (131072 & o2.__u) && (o2.__e == n2.__d && (n2.__d = x(o2)), V(o2, o2));
}
function I(n2, l2, u2) {
  var t2, i2;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = I(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = x(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 === l2.nodeType);
  return l2;
}
function L(n2, l2, u2, t2) {
  var i2 = n2.key, o2 = n2.type, r2 = u2 - 1, f2 = u2 + 1, e2 = l2[u2];
  if (null === e2 || e2 && i2 == e2.key && o2 === e2.type && 0 == (131072 & e2.__u)) return u2;
  if (t2 > (null != e2 && 0 == (131072 & e2.__u) ? 1 : 0)) for (; r2 >= 0 || f2 < l2.length; ) {
    if (r2 >= 0) {
      if ((e2 = l2[r2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return r2;
      r2--;
    }
    if (f2 < l2.length) {
      if ((e2 = l2[f2]) && 0 == (131072 & e2.__u) && i2 == e2.key && o2 === e2.type) return f2;
      f2++;
    }
  }
  return -1;
}
function T$1(n2, l2, u2) {
  "-" === l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || p$2.test(l2) ? u2 : u2 + "px";
}
function A$1(n2, l2, u2, t2, i2) {
  var o2;
  n: if ("style" === l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$1(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] === t2[l2] || T$1(n2.style, l2, u2[l2]);
  }
  else if ("o" === l2[0] && "n" === l2[1]) o2 = l2 !== (l2 = l2.replace(/(PointerCapture)$|Capture$/i, "$1")), l2 = l2.toLowerCase() in n2 || "onFocusOut" === l2 || "onFocusIn" === l2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = e$2, n2.addEventListener(l2, o2 ? s$3 : c$2, o2)) : n2.removeEventListener(l2, o2 ? s$3 : c$2, o2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" !== l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function F(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2.t) u2.t = e$2++;
      else if (u2.t < t2.u) return;
      return t2(l$3.event ? l$3.event(u2) : u2);
    }
  };
}
function O(n2, u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, h2, v2, p2, w2, _2, g2, m2, x2, C2, M2, P2, $2, I2, H, L2, T2 = u2.type;
  if (void 0 !== u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), r2 = [e2 = u2.__e = t2.__e]), (a2 = l$3.__b) && a2(u2);
  n: if ("function" == typeof T2) try {
    if (m2 = u2.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a2 = T2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? g2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (x2 ? u2.__c = h2 = new T2(m2, M2) : (u2.__c = h2 = new k$1(m2, M2), h2.constructor = T2, h2.render = q), C2 && C2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, v2 = h2.__d = true, h2.__h = [], h2._sb = []), x2 && null == h2.__s && (h2.__s = h2.state), x2 && null != T2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$3({}, h2.__s)), d$3(h2.__s, T2.getDerivedStateFromProps(m2, h2.__s))), p2 = h2.props, w2 = h2.state, h2.__v = u2, v2) x2 && null == T2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), x2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (x2 && null == T2.getDerivedStateFromProps && m2 !== p2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(m2, M2), !h2.__e && (null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(m2, h2.__s, M2) || u2.__v === t2.__v)) {
        for (u2.__v !== t2.__v && (h2.props = m2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
          n3 && (n3.__ = u2);
        }), P2 = 0; P2 < h2._sb.length; P2++) h2.__h.push(h2._sb[P2]);
        h2._sb = [], h2.__h.length && f2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(m2, h2.__s, M2), x2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(p2, w2, _2);
      });
    }
    if (h2.context = M2, h2.props = m2, h2.__P = n2, h2.__e = false, $2 = l$3.__r, I2 = 0, x2) {
      for (h2.state = h2.__s, h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H = 0; H < h2._sb.length; H++) h2.__h.push(h2._sb[H]);
      h2._sb = [];
    } else do {
      h2.__d = false, $2 && $2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++I2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = d$3(d$3({}, i2), h2.getChildContext())), x2 && !v2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(p2, w2)), S(n2, y$2(L2 = null != a2 && a2.type === b$1 && null == a2.key ? a2.props.children : a2) ? L2 : [L2], u2, t2, i2, o2, r2, f2, e2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && f2.push(h2), g2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != r2) {
      for (u2.__u |= c2 ? 160 : 32; e2 && 8 === e2.nodeType && e2.nextSibling; ) e2 = e2.nextSibling;
      r2[r2.indexOf(e2)] = null, u2.__e = e2;
    } else u2.__e = t2.__e, u2.__k = t2.__k;
    l$3.__e(n3, u2, t2);
  }
  else null == r2 && u2.__v === t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : u2.__e = z$1(t2.__e, u2, t2, i2, o2, r2, f2, c2, s2);
  (a2 = l$3.diffed) && a2(u2);
}
function j$1(n2, u2, t2) {
  u2.__d = void 0;
  for (var i2 = 0; i2 < t2.length; i2++) N(t2[i2], t2[++i2], t2[++i2]);
  l$3.__c && l$3.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$3.__e(n3, u3.__v);
    }
  });
}
function z$1(u2, t2, i2, o2, r2, f2, e2, c2, s2) {
  var a2, v2, p2, d2, _2, g2, m2, b2 = i2.props, k2 = t2.props, C2 = t2.type;
  if ("svg" === C2 ? r2 = "http://www.w3.org/2000/svg" : "math" === C2 ? r2 = "http://www.w3.org/1998/Math/MathML" : r2 || (r2 = "http://www.w3.org/1999/xhtml"), null != f2) {
    for (a2 = 0; a2 < f2.length; a2++) if ((_2 = f2[a2]) && "setAttribute" in _2 == !!C2 && (C2 ? _2.localName === C2 : 3 === _2.nodeType)) {
      u2 = _2, f2[a2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null === C2) return document.createTextNode(k2);
    u2 = document.createElementNS(r2, C2, k2.is && k2), c2 && (l$3.__m && l$3.__m(t2, f2), c2 = false), f2 = null;
  }
  if (null === C2) b2 === k2 || c2 && u2.data === k2 || (u2.data = k2);
  else {
    if (f2 = f2 && n.call(u2.childNodes), b2 = i2.props || h$1, !c2 && null != f2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(_2 = u2.attributes[a2]).name] = _2.value;
    for (a2 in b2) if (_2 = b2[a2], "children" == a2) ;
    else if ("dangerouslySetInnerHTML" == a2) p2 = _2;
    else if (!(a2 in k2)) {
      if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
      A$1(u2, a2, null, _2, r2);
    }
    for (a2 in k2) _2 = k2[a2], "children" == a2 ? d2 = _2 : "dangerouslySetInnerHTML" == a2 ? v2 = _2 : "value" == a2 ? g2 = _2 : "checked" == a2 ? m2 = _2 : c2 && "function" != typeof _2 || b2[a2] === _2 || A$1(u2, a2, _2, b2[a2], r2);
    if (v2) c2 || p2 && (v2.__html === p2.__html || v2.__html === u2.innerHTML) || (u2.innerHTML = v2.__html), t2.__k = [];
    else if (p2 && (u2.innerHTML = ""), S(u2, y$2(d2) ? d2 : [d2], t2, i2, o2, "foreignObject" === C2 ? "http://www.w3.org/1999/xhtml" : r2, f2, e2, f2 ? f2[0] : i2.__k && x(i2, 0), c2, s2), null != f2) for (a2 = f2.length; a2--; ) w$2(f2[a2]);
    c2 || (a2 = "value", "progress" === C2 && null == g2 ? u2.removeAttribute("value") : void 0 !== g2 && (g2 !== u2[a2] || "progress" === C2 && !g2 || "option" === C2 && g2 !== b2[a2]) && A$1(u2, a2, g2, b2[a2], r2), a2 = "checked", void 0 !== m2 && m2 !== u2[a2] && A$1(u2, a2, m2, b2[a2], r2));
  }
  return u2;
}
function N(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$3.__e(n3, t2);
  }
}
function V(n2, u2, t2) {
  var i2, o2;
  if (l$3.unmount && l$3.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current !== n2.__e || N(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$3.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (o2 = 0; o2 < i2.length; o2++) i2[o2] && V(i2[o2], u2, t2 || "function" != typeof n2.type);
  t2 || w$2(n2.__e), n2.__c = n2.__ = n2.__e = n2.__d = void 0;
}
function q(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function B$1(u2, t2, i2) {
  var o2, r2, f2, e2;
  l$3.__ && l$3.__(u2, t2), r2 = (o2 = "function" == typeof i2) ? null : t2.__k, f2 = [], e2 = [], O(t2, u2 = (!o2 && i2 || t2).__k = _$2(b$1, null, [u2]), r2 || h$1, h$1, t2.namespaceURI, !o2 && i2 ? [i2] : r2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, f2, !o2 && i2 ? i2 : r2 ? r2.__e : t2.firstChild, o2, e2), j$1(f2, u2, e2);
}
n = v$2.slice, l$3 = { __e: function(n2, l2, u2, t2) {
  for (var i2, o2, r2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((o2 = i2.constructor) && null != o2.getDerivedStateFromError && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$3 = 0, t$2 = function(n2) {
  return null != n2 && null == n2.constructor;
}, k$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = d$3({}, this.state), "function" == typeof n2 && (n2 = n2(d$3({}, u2), this.props)), n2 && d$3(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M(this));
}, k$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, k$1.prototype.render = b$1, i$2 = [], r$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f$3 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, P.__r = 0, e$2 = 0, c$2 = F(false), s$3 = F(true);
var f$2 = 0;
function u$2(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f$2, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$3.vnode && l$3.vnode(l2), l2;
}
const _Midi = class _Midi {
  static NoteOn(chan, note, velocity) {
    return [_Midi.NoteOnCode | chan - 1, note, velocity];
  }
  static NoteOff(chan, note, velocity) {
    return [_Midi.NoteOffCode | chan - 1, note, velocity];
  }
};
__publicField(_Midi, "NoteOnCode", 144);
__publicField(_Midi, "NoteOffCode", 128);
let Midi = _Midi;
function findFirstNamedOutputPort(midi, name) {
  if (midi === void 0) return void 0;
  for (const entry of midi.outputs) {
    const output = entry[1];
    if (output.name === name)
      return output;
  }
  return void 0;
}
async function sendSequence(m8Port, controlChannel, script) {
  await m8Port.open();
  const m8 = new M8Controller(controlChannel);
  m8.sendCommands(m8Port, script);
}
var t$1, r, u$1, i$1, o$1 = 0, f$1 = [], c$1 = l$3, e$1 = c$1.__b, a$1 = c$1.__r, v$1 = c$1.diffed, l$2 = c$1.__c, m = c$1.unmount, s$2 = c$1.__;
function d$2(n2, t2) {
  c$1.__h && c$1.__h(r, n2, o$1 || t2), o$1 = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function y$1(n2, u2) {
  var i2 = d$2(t$1++, 3);
  !c$1.__s && C(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r.__H.__h.push(i2));
}
function A(n2) {
  return o$1 = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = d$2(t$1++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function j() {
  for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z), n2.__H.__h.forEach(B), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], c$1.__e(t2, n2.__v);
  }
}
c$1.__b = function(n2) {
  r = null, e$1 && e$1(n2);
}, c$1.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$2 && s$2(n2, t2);
}, c$1.__r = function(n2) {
  a$1 && a$1(n2), t$1 = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u$1 === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = void 0;
  })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t$1 = 0)), u$1 = r;
}, c$1.diffed = function(n2) {
  v$1 && v$1(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$1)(j)), t2.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.i = void 0;
  })), u$1 = r = null;
}, c$1.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c$1.__e(r2, n3.__v);
    }
  }), l$2 && l$2(n2, t2);
}, c$1.unmount = function(n2) {
  m && m(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w$1(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 100);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
var i = Symbol.for("preact-signals");
function t() {
  if (!(s$1 > 1)) {
    var i2, t2 = false;
    while (void 0 !== h) {
      var r2 = h;
      h = void 0;
      f++;
      while (void 0 !== r2) {
        var o2 = r2.o;
        r2.o = void 0;
        r2.f &= -3;
        if (!(8 & r2.f) && c(r2)) try {
          r2.c();
        } catch (r3) {
          if (!t2) {
            i2 = r3;
            t2 = true;
          }
        }
        r2 = o2;
      }
    }
    f = 0;
    s$1--;
    if (t2) throw i2;
  } else s$1--;
}
var o = void 0;
var h = void 0, s$1 = 0, f = 0, v = 0;
function e(i2) {
  if (void 0 !== o) {
    var t2 = i2.n;
    if (void 0 === t2 || t2.t !== o) {
      t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
      if (void 0 !== o.s) o.s.n = t2;
      o.s = t2;
      i2.n = t2;
      if (32 & o.f) i2.S(t2);
      return t2;
    } else if (-1 === t2.i) {
      t2.i = 0;
      if (void 0 !== t2.n) {
        t2.n.p = t2.p;
        if (void 0 !== t2.p) t2.p.n = t2.n;
        t2.p = o.s;
        t2.n = void 0;
        o.s.n = t2;
        o.s = t2;
      }
      return t2;
    }
  }
}
function u(i2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
}
u.prototype.brand = i;
u.prototype.h = function() {
  return true;
};
u.prototype.S = function(i2) {
  if (this.t !== i2 && void 0 === i2.e) {
    i2.x = this.t;
    if (void 0 !== this.t) this.t.e = i2;
    this.t = i2;
  }
};
u.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    var t2 = i2.e, r2 = i2.x;
    if (void 0 !== t2) {
      t2.x = r2;
      i2.e = void 0;
    }
    if (void 0 !== r2) {
      r2.e = t2;
      i2.x = void 0;
    }
    if (i2 === this.t) this.t = r2;
  }
};
u.prototype.subscribe = function(i2) {
  var t2 = this;
  return E(function() {
    var r2 = t2.value, n2 = o;
    o = void 0;
    try {
      i2(r2);
    } finally {
      o = n2;
    }
  });
};
u.prototype.valueOf = function() {
  return this.value;
};
u.prototype.toString = function() {
  return this.value + "";
};
u.prototype.toJSON = function() {
  return this.value;
};
u.prototype.peek = function() {
  var i2 = o;
  o = void 0;
  try {
    return this.value;
  } finally {
    o = i2;
  }
};
Object.defineProperty(u.prototype, "value", { get: function() {
  var i2 = e(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set: function(i2) {
  if (i2 !== this.v) {
    if (f > 100) throw new Error("Cycle detected");
    this.v = i2;
    this.i++;
    v++;
    s$1++;
    try {
      for (var r2 = this.t; void 0 !== r2; r2 = r2.x) r2.t.N();
    } finally {
      t();
    }
  }
} });
function d$1(i2) {
  return new u(i2);
}
function c(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function a(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    var r2 = t2.S.n;
    if (void 0 !== r2) t2.r = r2;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function l$1(i2) {
  var t2 = i2.s, r2 = void 0;
  while (void 0 !== t2) {
    var o2 = t2.p;
    if (-1 === t2.i) {
      t2.S.U(t2);
      if (void 0 !== o2) o2.n = t2.n;
      if (void 0 !== t2.n) t2.n.p = o2;
    } else r2 = t2;
    t2.S.n = t2.r;
    if (void 0 !== t2.r) t2.r = void 0;
    t2 = o2;
  }
  i2.s = r2;
}
function y(i2) {
  u.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = v - 1;
  this.f = 4;
}
(y.prototype = new u()).h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === v) return true;
  this.g = v;
  this.f |= 1;
  if (this.i > 0 && !c(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = o;
  try {
    a(this);
    o = this;
    var t2 = this.x();
    if (16 & this.f || this.v !== t2 || 0 === this.i) {
      this.v = t2;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  o = i2;
  l$1(this);
  this.f &= -2;
  return true;
};
y.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  u.prototype.S.call(this, i2);
};
y.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    u.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
y.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(y.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = e(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function w(i2) {
  return new y(i2);
}
function _$1(i2) {
  var r2 = i2.u;
  i2.u = void 0;
  if ("function" == typeof r2) {
    s$1++;
    var n2 = o;
    o = void 0;
    try {
      r2();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      g(i2);
      throw t2;
    } finally {
      o = n2;
      t();
    }
  }
}
function g(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  _$1(i2);
}
function p$1(i2) {
  if (o !== this) throw new Error("Out-of-order effect");
  l$1(this);
  o = i2;
  this.f &= -2;
  if (8 & this.f) g(this);
  t();
}
function b(i2) {
  this.x = i2;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
}
b.prototype.c = function() {
  var i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t2 = this.x();
    if ("function" == typeof t2) this.u = t2;
  } finally {
    i2();
  }
};
b.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _$1(this);
  a(this);
  s$1++;
  var i2 = o;
  o = this;
  return p$1.bind(this, i2);
};
b.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h;
    h = this;
  }
};
b.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) g(this);
};
function E(i2) {
  var t2 = new b(i2);
  try {
    t2.c();
  } catch (i3) {
    t2.d();
    throw i3;
  }
  return t2.d.bind(t2);
}
var s;
function l(n2, i2) {
  l$3[n2] = i2.bind(null, l$3[n2] || function() {
  });
}
function d(n2) {
  if (s) s();
  s = n2 && n2.S();
}
function p(n2) {
  var r2 = this, f2 = n2.data, o2 = useSignal(f2);
  o2.value = f2;
  var e2 = T(function() {
    var n3 = r2.__v;
    while (n3 = n3.__) if (n3.__c) {
      n3.__c.__$f |= 4;
      break;
    }
    r2.__$u.c = function() {
      var n4;
      if (!t$2(e2.peek()) && 3 === (null == (n4 = r2.base) ? void 0 : n4.nodeType)) r2.base.data = e2.peek();
      else {
        r2.__$f |= 1;
        r2.setState({});
      }
    };
    return w(function() {
      var n4 = o2.value.value;
      return 0 === n4 ? 0 : true === n4 ? "" : n4 || "";
    });
  }, []);
  return e2.value;
}
p.displayName = "_st";
Object.defineProperties(u.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: p }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l("__b", function(n2, r2) {
  if ("string" == typeof r2.type) {
    var i2, t2 = r2.props;
    for (var f2 in t2) if ("children" !== f2) {
      var o2 = t2[f2];
      if (o2 instanceof u) {
        if (!i2) r2.__np = i2 = {};
        i2[f2] = o2;
        t2[f2] = o2.peek();
      }
    }
  }
  n2(r2);
});
l("__r", function(n2, r2) {
  d();
  var i2, t2 = r2.__c;
  if (t2) {
    t2.__$f &= -2;
    if (void 0 === (i2 = t2.__$u)) t2.__$u = i2 = function(n3) {
      var r3;
      E(function() {
        r3 = this;
      });
      r3.c = function() {
        t2.__$f |= 1;
        t2.setState({});
      };
      return r3;
    }();
  }
  d(i2);
  n2(r2);
});
l("__e", function(n2, r2, i2, t2) {
  d();
  n2(r2, i2, t2);
});
l("diffed", function(n2, r2) {
  d();
  var i2;
  if ("string" == typeof r2.type && (i2 = r2.__e)) {
    var t2 = r2.__np, f2 = r2.props;
    if (t2) {
      var o2 = i2.U;
      if (o2) for (var e2 in o2) {
        var u2 = o2[e2];
        if (void 0 !== u2 && !(e2 in t2)) {
          u2.d();
          o2[e2] = void 0;
        }
      }
      else i2.U = o2 = {};
      for (var a2 in t2) {
        var c2 = o2[a2], s2 = t2[a2];
        if (void 0 === c2) {
          c2 = _(i2, a2, s2, f2);
          o2[a2] = c2;
        } else c2.o(s2, f2);
      }
    }
  }
  n2(r2);
});
function _(n2, r2, i2, t2) {
  var f2 = r2 in n2 && void 0 === n2.ownerSVGElement, o2 = d$1(i2);
  return { o: function(n3, r3) {
    o2.value = n3;
    t2 = r3;
  }, d: E(function() {
    var i3 = o2.value.value;
    if (t2[r2] !== i3) {
      t2[r2] = i3;
      if (f2) n2[r2] = i3;
      else if (i3) n2.setAttribute(r2, i3);
      else n2.removeAttribute(r2);
    }
  }) };
}
l("unmount", function(n2, r2) {
  if ("string" == typeof r2.type) {
    var i2 = r2.__e;
    if (i2) {
      var t2 = i2.U;
      if (t2) {
        i2.U = void 0;
        for (var f2 in t2) {
          var o2 = t2[f2];
          if (o2) o2.d();
        }
      }
    }
  } else {
    var e2 = r2.__c;
    if (e2) {
      var u2 = e2.__$u;
      if (u2) {
        e2.__$u = void 0;
        u2.d();
      }
    }
  }
  n2(r2);
});
l("__h", function(n2, r2, i2, t2) {
  if (t2 < 3 || 9 === t2) r2.__$f |= 2;
  n2(r2, i2, t2);
});
k$1.prototype.shouldComponentUpdate = function(n2, r2) {
  var i2 = this.__$u;
  if (!(i2 && void 0 !== i2.s || 4 & this.__$f)) return true;
  if (3 & this.__$f) return true;
  for (var t2 in r2) return true;
  for (var f2 in n2) if ("__source" !== f2 && n2[f2] !== this.props[f2]) return true;
  for (var o2 in this.props) if (!(o2 in n2)) return true;
  return false;
};
function useSignal(n2) {
  return T(function() {
    return d$1(n2);
  }, []);
}
function* renderAttackDecay(parameter, macro) {
  let instructionCount = 0;
  if (macro.AttackTics === 0) {
    yield { ...parameter, value: macro.Amount };
    instructionCount++;
  } else {
    const attackSlope = macro.Amount / macro.AttackTics | 0;
    yield { ...parameter, value: attackSlope };
    instructionCount++;
    if (macro.AttackTics > 1) {
      yield M8Builder.REP(macro.AttackTics - 1);
      instructionCount++;
    }
  }
  if (macro.DecayTics === 0) {
    yield { ...parameter, value: signed(macro.Amount) };
    instructionCount++;
  } else {
    const decaySlope = macro.Amount / macro.DecayTics | 0;
    yield { ...parameter, value: signed(decaySlope) };
    instructionCount++;
    if (macro.DecayTics > 1) {
      instructionCount++;
      yield M8Builder.REP(macro.DecayTics - 1);
    }
  }
  if (macro.Loop) {
    yield M8Builder.HOP(0);
  } else {
    yield M8Builder.HOP(instructionCount);
  }
}
function* renderAdsr(parameter, macro) {
  let instructionCount = 0;
  if (macro.AttackTics === 0) {
    yield { ...parameter, value: macro.Amount };
    instructionCount++;
  } else {
    const attackSlope = macro.Amount / macro.AttackTics | 0;
    yield { ...parameter, value: attackSlope };
    instructionCount++;
    if (macro.AttackTics > 1) {
      yield M8Builder.REP(macro.AttackTics - 1);
      instructionCount++;
    }
  }
  const sustainDelta = macro.Amount - macro.SustainLevel;
  if (macro.DecayTics === 0) {
    yield { ...parameter, value: signed(sustainDelta) };
    instructionCount++;
  } else {
    const decaySlope = sustainDelta / macro.DecayTics | 0;
    yield { ...parameter, value: signed(decaySlope) };
    instructionCount++;
    if (macro.DecayTics > 1) {
      instructionCount++;
      yield M8Builder.REP(macro.DecayTics - 1);
    }
  }
  yield M8Builder.DEL(macro.SustainTics);
  instructionCount++;
  if (macro.ReleaseTics > 0) {
    const releaseSlope = macro.SustainLevel / macro.ReleaseTics | 0;
    yield { ...parameter, value: signed(releaseSlope) };
    instructionCount++;
    if (macro.ReleaseTics > 1) {
      instructionCount++;
      yield M8Builder.REP(macro.ReleaseTics - 1);
    }
  } else {
    yield { ...parameter, value: signed(macro.SustainLevel) };
    instructionCount++;
  }
  if (macro.Loop) {
    yield M8Builder.HOP(0);
  } else {
    yield M8Builder.HOP(instructionCount);
  }
}
function signed(v2) {
  return (255 - v2 + 1) % 256;
}
function* renderTriLfo(parameter, macro) {
  const upDuration = macro.Duration / 4 | 0;
  const downDuration = macro.Duration / 2 | 0;
  const slope = macro.Amount / (macro.Duration / 2) | 0;
  let instruction_count = 3;
  yield { ...parameter, value: slope };
  if (upDuration > 1) {
    yield M8Builder.REP(upDuration - 1);
    instruction_count++;
  }
  yield { ...parameter, value: signed(slope) };
  if (downDuration > 1) {
    yield M8Builder.REP(downDuration - 1);
    instruction_count++;
  }
  yield { ...parameter, value: slope };
  if (upDuration > 1) {
    yield M8Builder.REP(upDuration - 1);
    instruction_count++;
  }
  if (macro.Loop) {
    yield M8Builder.HOP(0);
  } else {
    yield M8Builder.HOP(instruction_count);
  }
}
function* renderSquareLfo(parameter, macro) {
  const phaseLength = macro.Duration / 2 | 0;
  let instruction_count = 1;
  yield { ...parameter, value: macro.Amount / 2 | 0 };
  if (phaseLength > 1) {
    yield M8Builder.DEL(phaseLength - 1);
    instruction_count++;
  }
  instruction_count++;
  yield { ...parameter, value: signed(macro.Amount) };
  if (phaseLength > 1) {
    instruction_count++;
    yield M8Builder.DEL(phaseLength - 1);
  }
  instruction_count++;
  yield { ...parameter, value: macro.Amount };
  if (phaseLength > 1) {
    instruction_count++;
    yield M8Builder.DEL(phaseLength - 1);
  }
  if (macro.Loop) {
    yield M8Builder.HOP(phaseLength > 1 ? 2 : 1);
  } else {
    yield M8Builder.HOP(instruction_count);
  }
}
function* renderSawLFO(parameter, macro, downward) {
  let instruction_count = 2;
  const slope = macro.Amount / macro.Duration | 0;
  if (downward) {
    yield { ...parameter, value: macro.Amount };
    yield { ...parameter, value: signed(slope) };
  } else {
    yield { ...parameter, value: slope };
  }
  if (macro.Duration > 1) {
    yield M8Builder.REP(macro.Duration);
    instruction_count++;
  }
  if (macro.Loop) {
    if (!downward) {
      yield { ...parameter, value: signed(macro.Amount) };
    }
    yield M8Builder.HOP(0);
  } else {
    yield M8Builder.HOP(instruction_count);
  }
}
function RenderMacro(parameter, macro) {
  const kind = macro.kind;
  switch (kind) {
    case "ad_env":
      return renderAttackDecay(parameter, macro.def);
    case "adsr_env":
      return renderAdsr(parameter, macro.def);
    case "tri_lfo":
      return renderTriLfo(parameter, macro.def);
    case "square_lfo":
      return renderSquareLfo(parameter, macro.def);
    case "ramp_up_lfo":
      return renderSawLFO(parameter, macro.def, false);
    case "ramp_down_lfo":
      return renderSawLFO(parameter, macro.def, true);
    case "free":
      return [];
    default:
      never();
  }
}
const SegmentKindIndex = {
  free: 0,
  ad_env: 1,
  adsr_env: 2,
  tri_lfo: 3,
  square_lfo: 4,
  ramp_up_lfo: 5,
  ramp_down_lfo: 6
};
function FreshMacro(ix) {
  switch (ix) {
    case 1:
      return { kind: "ad_env", def: { AttackTics: 0, DecayTics: 10, Amount: 48, Loop: false } };
    case 2:
      return { kind: "adsr_env", def: { AttackTics: 7, DecayTics: 5, SustainTics: 29, ReleaseTics: 8, SustainLevel: 59, Amount: 80, Loop: false } };
    case 3:
      return { kind: "tri_lfo", def: { Duration: 40, Amount: 62, Loop: true } };
    case 4:
      return { kind: "square_lfo", def: { Duration: 40, Amount: 62, Loop: true } };
    case 5:
      return { kind: "ramp_up_lfo", def: { Duration: 22, Amount: 77, Loop: true } };
    case 6:
      return { kind: "ramp_down_lfo", def: { Duration: 22, Amount: 47, Loop: true } };
    case 0:
    default:
      return { kind: "free" };
  }
}
function createState(midi) {
  const current_parameter = d$1(M8Builder.CUT(0));
  const current_macro = d$1(FreshMacro(2));
  const script = w(() => [...RenderMacro(current_parameter.value, current_macro.value)]);
  return {
    current_instrument: d$1("MA"),
    current_parameter,
    current_segments: d$1([]),
    current_macro,
    script,
    midi,
    m8Channel: d$1(10),
    m8port: d$1(void 0)
  };
}
function never(_2) {
  throw "never";
}
const M8WaveSynthCommandPositions = {
  SIZ: { x: 4, y: 4, relative: true },
  MUL: { x: 5, y: 4, relative: true },
  WRP: { x: 6, y: 4, relative: true },
  SCN: { x: 7, y: 4, relative: true }
};
const M8FMSynthCommandPositions = {
  FM1: { x: 4, y: 4, relative: true },
  FM2: { x: 5, y: 4, relative: true },
  FM3: { x: 6, y: 4, relative: true },
  FM4: { x: 7, y: 4, relative: true }
};
const M8HyperSynthCommandPositions = {
  SHF: { x: 4, y: 4, relative: true },
  SWM: { x: 5, y: 4, relative: true },
  WID: { x: 6, y: 4, relative: true },
  SUB: { x: 7, y: 4, relative: true }
};
const M8SamplerSynthCommandPositions = {
  PLY: { x: 3, y: 4, relative: false },
  STA: { x: 4, y: 4, relative: false },
  LOP: { x: 5, y: 4, relative: false },
  LEN: { x: 6, y: 4, relative: false },
  DEG: { x: 7, y: 4, relative: false },
  SLI: { x: 6, y: 5, relative: false }
};
const M8MacroSynthCommandPositions = {
  TBR: { x: 4, y: 4, relative: true },
  COL: { x: 5, y: 4, relative: true },
  DEG: { x: 6, y: 4, relative: true },
  RED: { x: 7, y: 4, relative: true }
};
const M8SequencerCommandPositions = {
  DEL: { x: 3, y: 0, relative: false },
  HOP: { x: 5, y: 0, relative: false },
  RET: { x: 0, y: 1, relative: false },
  REP: { x: 1, y: 1, relative: false },
  RTO: { x: 2, y: 1, relative: false },
  TIC: { x: 6, y: 2, relative: false }
};
const M8GlobalCommandPositions = {
  VOL: { x: 0, y: 4, relative: true },
  PIT: { x: 1, y: 4, relative: true },
  FIN: { x: 2, y: 4, relative: true },
  CUT: { x: 1, y: 5, relative: true },
  RES: { x: 2, y: 5, relative: true },
  AMP: { x: 3, y: 5, relative: true },
  PAN: { x: 5, y: 5, relative: true },
  DRY: { x: 0, y: 6, relative: false },
  SCH: { x: 1, y: 6, relative: false },
  SDL: { x: 2, y: 6, relative: false },
  SRV: { x: 3, y: 6, relative: false }
};
const M8WaveSynthCommands = {
  SIZ: { ty: "WAV", code: "SIZ", value: 0 },
  MUL: { ty: "WAV", code: "MUL", value: 0 },
  WRP: { ty: "WAV", code: "WRP", value: 0 },
  SCN: { ty: "WAV", code: "SCN", value: 0 }
};
const M8FMSynthCommands = {
  FM1: { ty: "FM", code: "FM1", value: 0 },
  FM2: { ty: "FM", code: "FM2", value: 0 },
  FM3: { ty: "FM", code: "FM3", value: 0 },
  FM4: { ty: "FM", code: "FM4", value: 0 }
};
const M8HyperSynthCommands = {
  SHF: { ty: "HS", code: "SHF", value: 0 },
  SWM: { ty: "HS", code: "SWM", value: 0 },
  WID: { ty: "HS", code: "WID", value: 0 },
  SUB: { ty: "HS", code: "SUB", value: 0 }
};
const M8SamplerSynthCommands = {
  PLY: { ty: "SA", code: "PLY", value: 0 },
  STA: { ty: "SA", code: "STA", value: 0 },
  LOP: { ty: "SA", code: "LOP", value: 0 },
  LEN: { ty: "SA", code: "LEN", value: 0 },
  DEG: { ty: "SA", code: "DEG", value: 0 },
  SLI: { ty: "SA", code: "SLI", value: 0 }
};
const M8MacroSynthCommands = {
  TBR: { ty: "MA", code: "TBR", value: 0 },
  COL: { ty: "MA", code: "COL", value: 0 },
  DEG: { ty: "MA", code: "DEG", value: 0 },
  RED: { ty: "MA", code: "RED", value: 0 }
};
const M8GlobalCommands = {
  VOL: { ty: "GLO", code: "VOL", value: 0 },
  PIT: { ty: "GLO", code: "PIT", value: 0 },
  FIN: { ty: "GLO", code: "FIN", value: 0 },
  CUT: { ty: "GLO", code: "CUT", value: 0 },
  RES: { ty: "GLO", code: "RES", value: 0 },
  AMP: { ty: "GLO", code: "AMP", value: 0 },
  PAN: { ty: "GLO", code: "PAN", value: 0 },
  DRY: { ty: "GLO", code: "DRY", value: 0 },
  SCH: { ty: "GLO", code: "SCH", value: 0 },
  SDL: { ty: "GLO", code: "SDL", value: 0 },
  SRV: { ty: "GLO", code: "SRV", value: 0 }
};
const HumanNameOfInstrument = {
  "WAV": "Wavsynth",
  "MA": "Macrosynth",
  "HS": "Hypersynth",
  "SA": "Sampler",
  "FM": "FM Synth"
};
function HumanCommandKindOfCommand(cmd) {
  const k2 = cmd.ty;
  switch (k2) {
    case "SEQ":
      return "Sequencer";
    case "GLO":
      return "Global";
    default:
      return HumanNameOfInstrument[k2];
  }
}
class M8Builder {
  static DEL(v2) {
    return { ty: "SEQ", code: "DEL", value: v2 };
  }
  static REP(v2) {
    return { ty: "SEQ", code: "REP", value: v2 };
  }
  static HOP(v2) {
    return { ty: "SEQ", code: "HOP", value: v2 };
  }
  static CUT(v2) {
    return { ty: "GLO", code: "CUT", value: v2 };
  }
}
function* mk(dic) {
  for (let k2 in dic) {
    yield dic[k2];
  }
}
const CommandsOfInstrument = {
  "WAV": [[...mk(M8WaveSynthCommands)], [...mk(M8GlobalCommands)]],
  "FM": [[...mk(M8FMSynthCommands)], [...mk(M8GlobalCommands)]],
  "MA": [[...mk(M8MacroSynthCommands)], [...mk(M8GlobalCommands)]],
  "HS": [[...mk(M8HyperSynthCommands)], [...mk(M8GlobalCommands)]],
  "SA": [[...mk(M8SamplerSynthCommands)], [...mk(M8GlobalCommands)]]
};
function Plot(ctx, baseValue, commands) {
  let current_instruction = 0;
  let current_tick = 0;
  let value = baseValue;
  let prevValue = 0;
  const widthPerTick = 3;
  const heightPerValue = 2;
  const height = ctx.canvas.clientHeight;
  const render = (v2) => {
    ctx.fillRect(
      current_tick * widthPerTick,
      height - v2,
      widthPerTick,
      heightPerValue
    );
  };
  const maxTick = ctx.canvas.clientWidth / widthPerTick;
  while (current_instruction < commands.length) {
    if (current_tick >= maxTick)
      break;
    const cmd = commands[current_instruction];
    switch (cmd.code) {
      case "REP":
        for (let i2 = 0; i2 < cmd.value; i2++) {
          if (current_tick >= maxTick)
            break;
          value = Math.min(255, Math.max(0, value + prevValue));
          render(value);
          current_tick++;
        }
        break;
      case "DEL":
        for (let i2 = 0; i2 < cmd.value; i2++) {
          if (current_tick >= maxTick) break;
          render(value);
          current_tick++;
        }
        break;
      case "HOP":
        if (cmd.value === current_instruction) {
          render(value);
          current_tick++;
        }
        current_instruction = cmd.value - 1;
        break;
      default:
        const signed2 = cmd.value > 128 ? -(~cmd.value + 1 & 255) : cmd.value;
        value = signed2 + value;
        value = Math.min(255, Math.max(0, value));
        render(value);
        prevValue = signed2;
        current_tick++;
        break;
    }
    current_instruction++;
  }
  while (current_tick < maxTick) {
    render(value);
    current_tick++;
  }
}
function PositionOfCommand(cmd) {
  const ty = cmd.ty;
  switch (ty) {
    case "SEQ":
      return M8SequencerCommandPositions[cmd.code];
    case "GLO":
      return M8GlobalCommandPositions[cmd.code];
    case "WAV":
      return M8WaveSynthCommandPositions[cmd.code];
    case "FM":
      return M8FMSynthCommandPositions[cmd.code];
    case "MA":
      return M8MacroSynthCommandPositions[cmd.code];
    case "HS":
      return M8HyperSynthCommandPositions[cmd.code];
    case "SA":
      return M8SamplerSynthCommandPositions[cmd.code];
    default:
      return never();
  }
}
function* resetCommandView() {
  for (let i2 = 0; i2 < 7; i2++) {
    yield 4;
    yield 4;
  }
  for (let i2 = 0; i2 < 15; i2++) {
    yield 6;
    yield 6;
  }
}
function* setValue(v2) {
  yield 2;
  yield 3;
  yield 2;
  yield 3;
  yield 2;
  const bigStepCount = (v2 / 16 | 0) * 2;
  for (let i2 = 0; i2 < bigStepCount; i2++) {
    yield 6;
  }
  const smallStepCount = (v2 & 15) * 2;
  for (let i2 = 0; i2 < smallStepCount; i2++) {
    yield 5;
  }
  yield 2;
}
function* CommandToWriteOrders(commands) {
  const currentPos = { x: 0, y: 0 };
  let isFirst = true;
  for (const cmd of commands) {
    const toPos = PositionOfCommand(cmd);
    const dx = toPos.x - currentPos.x;
    const dy = toPos.y - currentPos.y;
    const hDir = dx < 0 ? 4 : 5;
    const vDir = dy < 0 ? 6 : 7;
    yield 2;
    yield 6;
    yield 6;
    if (isFirst) {
      yield* resetCommandView();
      isFirst = false;
    }
    const repX = Math.abs(dx);
    for (let x2 = 0; x2 < 2 * repX; x2++) {
      yield hDir;
    }
    const repY = Math.abs(dy);
    for (let y2 = 0; y2 < 2 * repY; y2++) {
      yield vDir;
    }
    yield 2;
    yield 5;
    yield 5;
    yield* setValue(cmd.value);
    yield 4;
    yield 4;
    yield 7;
    yield 7;
    currentPos.x = toPos.x;
    currentPos.y = toPos.y;
  }
}
class M8Controller {
  constructor(controlChannel) {
    __publicField(this, "NoteOns");
    __publicField(this, "NoteOffs");
    __publicField(this, "keyStates");
    this.controlChannel = controlChannel;
    this.keyStates = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ];
    this.NoteOns = [
      Midi.NoteOn(controlChannel, 0, 1),
      Midi.NoteOn(controlChannel, 1, 1),
      Midi.NoteOn(controlChannel, 2, 1),
      Midi.NoteOn(controlChannel, 3, 1),
      Midi.NoteOn(controlChannel, 4, 1),
      Midi.NoteOn(controlChannel, 5, 1),
      Midi.NoteOn(controlChannel, 6, 1),
      Midi.NoteOn(controlChannel, 7, 1)
    ];
    this.NoteOffs = [
      Midi.NoteOff(controlChannel, 0, 0),
      Midi.NoteOff(controlChannel, 1, 0),
      Midi.NoteOff(controlChannel, 2, 0),
      Midi.NoteOff(controlChannel, 3, 0),
      Midi.NoteOff(controlChannel, 4, 0),
      Midi.NoteOff(controlChannel, 5, 0),
      Midi.NoteOff(controlChannel, 6, 0),
      Midi.NoteOff(controlChannel, 7, 0)
    ];
  }
  sendCommands(out, commands) {
    this.sendUserCommands(out, CommandToWriteOrders(commands));
  }
  sendUserCommands(out, commands) {
    let i2 = 0;
    const timeBetweenNotes = 23;
    for (const command of commands) {
      const status = this.keyStates[command];
      const mapping = status ? this.NoteOffs : this.NoteOns;
      this.keyStates[command] = !status;
      out.send(mapping[command], window.performance.now() + i2 * timeBetweenNotes);
      i2++;
    }
  }
}
let state = createState(void 0);
function RangeVal(props) {
  const onChange = (a2) => {
    const n2 = Number.parseInt(a2, 10);
    props.update(n2);
  };
  const maxi = props.max === void 0 ? 255 : props.max;
  return /* @__PURE__ */ u$2("div", { class: "valueEdit", children: [
    /* @__PURE__ */ u$2("label", { children: props.name }),
    /* @__PURE__ */ u$2("br", {}),
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "range",
        min: "0",
        max: maxi,
        onInput: (evt) => onChange(evt.currentTarget.value),
        value: props.val
      }
    ),
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "number",
        min: "0",
        max: maxi,
        onInput: (evt) => onChange(evt.currentTarget.value),
        value: props.val
      }
    )
  ] });
}
function AttackDecayEnvEditor(props) {
  const def = props.def;
  return /* @__PURE__ */ u$2("form", { children: [
    /* @__PURE__ */ u$2("h3", { children: props.name }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Attack (tics)", val: def.AttackTics, update: (v2) => props.update({ ...def, AttackTics: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Decay (tics)", val: def.DecayTics, update: (v2) => props.update({ ...def, DecayTics: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Amount", val: def.Amount, update: (v2) => props.update({ ...def, Amount: v2 }) }),
    /* @__PURE__ */ u$2("label", { children: "Loop" }),
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "checkbox",
        checked: def.Loop,
        onInput: (_evt) => props.update({ ...def, Loop: !def.Loop })
      }
    )
  ] });
}
function AdsrEnvEditor(props) {
  const def = props.def;
  return /* @__PURE__ */ u$2("form", { children: [
    /* @__PURE__ */ u$2("h3", { children: props.name }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Amount", val: def.Amount, update: (v2) => props.update({ ...def, Amount: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Attack (tics)", val: def.AttackTics, update: (v2) => props.update({ ...def, AttackTics: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Decay (tics)", val: def.DecayTics, update: (v2) => props.update({ ...def, DecayTics: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Sustain (tics)", val: def.SustainTics, update: (v2) => props.update({ ...def, SustainTics: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Sustain Amount", val: def.SustainLevel, update: (v2) => props.update({ ...def, SustainLevel: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Release (tics)", val: def.ReleaseTics, update: (v2) => props.update({ ...def, ReleaseTics: v2 }) }),
    /* @__PURE__ */ u$2("label", { children: "Loop" }),
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "checkbox",
        checked: def.Loop,
        onInput: (_evt) => props.update({ ...def, Loop: !def.Loop })
      }
    )
  ] });
}
function LfoEditor(props) {
  const def = props.def;
  return /* @__PURE__ */ u$2("form", { children: [
    /* @__PURE__ */ u$2("h3", { children: props.name }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Duration (tics)", val: def.Duration, update: (v2) => props.update({ ...def, Duration: v2 }) }),
    /* @__PURE__ */ u$2(RangeVal, { name: "Amount", val: def.Amount, update: (v2) => props.update({ ...def, Amount: v2 }), max: props.maxAmount }),
    /* @__PURE__ */ u$2("label", { children: "Loop" }),
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "checkbox",
        checked: def.Loop,
        onInput: (_evt) => props.update({ ...def, Loop: !def.Loop })
      }
    )
  ] });
}
function hexCode(n2) {
  const asHex = n2.toString(16);
  return asHex.length < 2 ? "0" + asHex : asHex;
}
function M8CommandScriptRender(id, cmd) {
  return `${hexCode(id)} : ${cmd.code} ${hexCode(cmd.value)}`;
}
function ScriptRender() {
  const script = state.script.value;
  return /* @__PURE__ */ u$2("pre", { children: script.map((c2, i2) => M8CommandScriptRender(i2, c2) + "\n") });
}
function MacroEditor() {
  const macroEditor = state.current_macro.value;
  const kind = macroEditor.kind;
  switch (kind) {
    case "ad_env":
      return /* @__PURE__ */ u$2(
        AttackDecayEnvEditor,
        {
          name: "Attack Decay Enveloppe",
          def: macroEditor.def,
          update: (env) => state.current_macro.value = { ...macroEditor, def: env }
        }
      );
    case "adsr_env":
      return /* @__PURE__ */ u$2(
        AdsrEnvEditor,
        {
          name: "ADSR Enveloppe",
          def: macroEditor.def,
          update: (env) => state.current_macro.value = { ...macroEditor, def: env }
        }
      );
    case "tri_lfo":
      return /* @__PURE__ */ u$2(
        LfoEditor,
        {
          name: "Triangle LFO",
          def: macroEditor.def,
          update: (lfo) => state.current_macro.value = { ...macroEditor, def: lfo }
        }
      );
    case "square_lfo":
      return /* @__PURE__ */ u$2(
        LfoEditor,
        {
          name: "Square LFO",
          def: macroEditor.def,
          maxAmount: 127,
          update: (lfo) => state.current_macro.value = { ...macroEditor, def: lfo }
        }
      );
    case "ramp_up_lfo":
      return /* @__PURE__ */ u$2(
        LfoEditor,
        {
          name: "Ramp UP LFO",
          def: macroEditor.def,
          update: (lfo) => state.current_macro.value = { ...macroEditor, def: lfo }
        }
      );
    case "ramp_down_lfo":
      return /* @__PURE__ */ u$2(
        LfoEditor,
        {
          name: "Ramp Down LFO",
          def: macroEditor.def,
          update: (lfo) => state.current_macro.value = { ...macroEditor, def: lfo }
        }
      );
    case "free":
      return /* @__PURE__ */ u$2(b$1, {});
    default:
      never();
  }
}
function MacroChoice() {
  const selectedIndex = SegmentKindIndex[state.current_macro.value.kind] - 1;
  const setMacro = (i2) => {
    state.current_macro.value = FreshMacro(i2);
  };
  const choices = [
    // "Free",
    "Attack Decay Env",
    "ADSR Env",
    "Triangle LFO",
    "Square LFO",
    "Ramp up LFO",
    "Ramp down LFO"
  ];
  const renderChoice = (choice, ix) => /* @__PURE__ */ u$2("div", { children: /* @__PURE__ */ u$2("label", { children: [
    /* @__PURE__ */ u$2("input", { type: "radio", checked: selectedIndex === ix, onInput: (_2) => setMacro(ix + 1) }),
    choice
  ] }) });
  return /* @__PURE__ */ u$2("div", { children: choices.map(renderChoice) });
}
function ScriptPlot() {
  const canvasRef = A(null);
  const script = state.script.value;
  const param = state.current_parameter.value;
  y$1(() => {
    const current = canvasRef.current;
    if (current === null) return;
    const context = current.getContext("2d");
    if (context === null) return;
    const width = context.canvas.clientWidth;
    const height = context.canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#555";
    for (var i2 = 1; i2 < 255; i2 += 16) {
      context.fillRect(0, i2, width, 1);
    }
    context.fillStyle = "#080";
    context.fillRect(0, 255 - param.value, width, 2);
    context.fillStyle = "#fff";
    Plot(context, param.value, script);
  }, [script]);
  return /* @__PURE__ */ u$2("div", { children: /* @__PURE__ */ u$2("canvas", { class: "visualization", ref: canvasRef, width: 512 + 128, height: 258 }) });
}
function InstrumentChoice() {
  const instrument = state.current_instrument.value;
  const mkRadio = (m8i) => /* @__PURE__ */ u$2("div", { children: /* @__PURE__ */ u$2("label", { children: [
    /* @__PURE__ */ u$2(
      "input",
      {
        type: "radio",
        value: m8i,
        checked: m8i === instrument,
        onInput: (_2) => state.current_instrument.value = m8i
      }
    ),
    HumanNameOfInstrument[m8i]
  ] }) });
  return /* @__PURE__ */ u$2("div", { children: [
    mkRadio("WAV"),
    mkRadio("MA"),
    mkRadio("HS"),
    mkRadio("SA"),
    mkRadio("FM")
  ] });
}
function ValueChoice() {
  const instrument = state.current_instrument.value;
  const parameter = state.current_parameter.value;
  const commands = CommandsOfInstrument[instrument];
  let allCommands = [];
  const setValue2 = (ixStr) => {
    const ix = Number.parseInt(ixStr, 10);
    const cmd = allCommands[ix];
    state.current_parameter.value = { ...cmd, value: parameter.value };
  };
  let i2 = 0;
  const onCmd = (cmd) => {
    allCommands.push(cmd);
    return /* @__PURE__ */ u$2("option", { value: i2++, selected: parameter.code === cmd.code, children: [
      " ",
      cmd.code,
      " "
    ] });
  };
  const groups = commands.map((grp) => /* @__PURE__ */ u$2("optgroup", { label: HumanCommandKindOfCommand(grp[0]), children: grp.map(onCmd) }));
  return /* @__PURE__ */ u$2("select", { size: 20, onChange: (e2) => setValue2(e2.currentTarget.value), children: groups });
}
function InstrumentBaseValue() {
  const param = state.current_parameter.value;
  return /* @__PURE__ */ u$2(
    RangeVal,
    {
      name: "Amount",
      val: param.value,
      update: (v2) => state.current_parameter.value = { ...param, value: v2 }
    }
  );
}
function TryUpdateM8Port() {
  if (state.midi === void 0) return;
  const port = findFirstNamedOutputPort(state.midi, "M8");
  state.m8port.value = port == null ? void 0 : port.id;
}
function MidiStatus() {
  const port = state.m8Channel.value;
  const m8port = state.m8port.value;
  if (state.midi === void 0) {
    return /* @__PURE__ */ u$2("div", { class: "message", children: "No midi allowed, cannot write to M8, grant MIDI rights and refresh page" });
  }
  const midiStatus = m8port === void 0 ? "No connected M8 found" : "M8 OK, put cursor in an instrument table for writing.";
  const setVal = (str) => {
    const ix = Number.parseInt(str, 10);
    state.m8Channel.value = ix;
  };
  return /* @__PURE__ */ u$2("div", { class: "message", children: [
    /* @__PURE__ */ u$2("span", { class: "midistatus", children: midiStatus }),
    /* @__PURE__ */ u$2("span", { class: "separator" }),
    /* @__PURE__ */ u$2("label", { children: [
      /* @__PURE__ */ u$2("span", { class: "midistatus", children: "M8 control channel : " }),
      /* @__PURE__ */ u$2(
        "input",
        {
          type: "number",
          min: "1",
          max: "16",
          title: "M8 Midi control channel (10 by default)",
          value: port,
          onInput: (evt) => setVal(evt.currentTarget.value)
        }
      )
    ] }),
    /* @__PURE__ */ u$2("span", { class: "separator" }),
    /* @__PURE__ */ u$2("button", { title: "Search for M8", onClick: (_2) => TryUpdateM8Port(), children: "⟳ Refresh M8" })
  ] });
}
function sendCurrentScript() {
  const port = findFirstNamedOutputPort(state.midi, "M8");
  if (port === void 0) {
    state.m8port.value = void 0;
    alert("No M8 found, please connect and refresh");
    return;
  }
  sendSequence(port, state.m8Channel.peek(), state.script.peek());
}
function App() {
  const disabled = state.m8port.value === void 0;
  return /* @__PURE__ */ u$2("div", { children: [
    /* @__PURE__ */ u$2("div", { class: "rootheader", children: [
      /* @__PURE__ */ u$2("h1", { children: "M8 Table generator" }),
      /* @__PURE__ */ u$2(MidiStatus, {})
    ] }),
    /* @__PURE__ */ u$2("div", { class: "rootcontainer", children: [
      /* @__PURE__ */ u$2("div", { class: "rootcolumn", children: [
        /* @__PURE__ */ u$2("h3", { children: "Generator" }),
        /* @__PURE__ */ u$2(MacroChoice, {}),
        /* @__PURE__ */ u$2("h3", { children: "Instrument" }),
        /* @__PURE__ */ u$2(InstrumentChoice, {}),
        /* @__PURE__ */ u$2("h3", { children: "Value" }),
        /* @__PURE__ */ u$2(InstrumentBaseValue, {}),
        /* @__PURE__ */ u$2(ValueChoice, {})
      ] }),
      /* @__PURE__ */ u$2("div", { class: "rootcolumn", children: /* @__PURE__ */ u$2(MacroEditor, {}) }),
      /* @__PURE__ */ u$2("div", { class: "rootcolumn", children: [
        /* @__PURE__ */ u$2("h3", { children: "M8 'script'" }),
        /* @__PURE__ */ u$2(ScriptRender, {}),
        /* @__PURE__ */ u$2(ScriptPlot, {}),
        /* @__PURE__ */ u$2(
          "button",
          {
            disabled,
            onClick: (_2) => sendCurrentScript(),
            children: "M8 write"
          }
        )
      ] })
    ] })
  ] });
}
try {
  navigator.requestMIDIAccess().then(
    (midiAccess) => {
      state = createState(midiAccess);
      TryUpdateM8Port();
      B$1(/* @__PURE__ */ u$2(App, {}), document.getElementById("app"));
    },
    (_2) => {
      B$1(/* @__PURE__ */ u$2(App, {}), document.getElementById("app"));
    }
  );
} catch {
  document.addEventListener("DOMContentLoaded", function() {
    const app = document.getElementById("app");
    B$1(/* @__PURE__ */ u$2(App, {}), app);
  }, false);
}
